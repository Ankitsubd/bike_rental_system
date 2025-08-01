from rest_framework import viewsets, permissions, status, filters, serializers
from rest_framework.views import APIView
from rest_framework.generics import UpdateAPIView, ListAPIView
from rest_framework.response import Response
from django.contrib.auth import get_user_model
from django.contrib.auth.tokens import PasswordResetTokenGenerator
from django.utils.encoding import force_str
from django.utils.http import urlsafe_base64_decode
from django.utils import timezone
from django_filters.rest_framework import DjangoFilterBackend
from django.core.mail import send_mail
from django.conf import settings
from rest_framework.permissions import IsAuthenticated
from django.db.models import Q, Count, Sum, Avg
from .utils import verify_reset_token
from django.utils.encoding import force_bytes
from django.utils.http import urlsafe_base64_encode
from rest_framework.exceptions import ValidationError
from rest_framework.permissions import AllowAny
from datetime import timedelta
from django.db.models import Count, Q
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from jwt import decode as jwtDecode
from rest_framework_simplejwt.tokens import RefreshToken

from .utils import generate_verification_token, generate_reset_token
from .permissions import IsOwnerOrAdmin, IsAdminUser, IsVerifiedUser
from .models import Bike, Booking, Review, Analytics
from .serializers import (
    UserSerializer, RegisterSerializer, LoginSerializer, ChangePasswordSerializer,
    BikeSerializer, BookingSerializer, AdminBookingSerializer, ReviewSerializer, SetNewPasswordSerializer, AnalyticsSerializer,
    AdminUserCreateSerializer
)

User = get_user_model()


# User Dashboard Stats
class UserDashboardStatsView(APIView):
    permission_classes = [IsAuthenticated]
    
    def get(self, request):
        """Get user-specific dashboard statistics"""
        try:
            user = request.user
            
            # Get user's bookings
            user_bookings = Booking.objects.filter(user=user)
            total_bookings = user_bookings.count()
            
            # Calculate booking statistics
            active_bookings = user_bookings.filter(status__in=['confirmed', 'in_progress']).count()
            completed_bookings = user_bookings.filter(status__in=['completed', 'returned']).count()
            cancelled_bookings = user_bookings.filter(status='cancelled').count()
            
            # Calculate total spent
            total_spent = user_bookings.filter(status='completed').aggregate(
                total=Sum('total_price')
            )['total'] or 0
            
            # Get recent bookings (last 5)
            recent_bookings = user_bookings.order_by('-created_at')[:5]
            
            # Get user's reviews
            user_reviews = Review.objects.filter(user=user).count()
            
            # Calculate average rating given by user
            avg_rating_given = Review.objects.filter(user=user).aggregate(
                avg_rating=Avg('rating')
            )['avg_rating'] or 0

            return Response({
                'total_bookings': total_bookings,
                'active_bookings': active_bookings,
                'completed_bookings': completed_bookings,
                'cancelled_bookings': cancelled_bookings,
                'total_spent': float(total_spent),
                'total_reviews': user_reviews,
                'avg_rating_given': round(avg_rating_given, 1),
                'recent_bookings': BookingSerializer(recent_bookings, many=True).data
            })
            
        except Exception as e:
            print(f"Error in UserDashboardStatsView: {e}")
            return Response(
                {'error': 'Failed to fetch user dashboard statistics'}, 
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )


# User Profile Management
class UserProfileView(APIView):
    permission_classes = [IsAuthenticated]
    
    def get(self, request):
        """Get current user's profile information"""
        try:
            serializer = UserSerializer(request.user)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except Exception as e:
            return Response(
                {'error': 'Failed to fetch profile'}, 
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )


class UserRegistrationView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        print("Registration request data:", request.data)
        serializer = RegisterSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            uid = urlsafe_base64_encode(force_bytes(user.pk))
            # token = generate_verification_token(user.email)
            token = PasswordResetTokenGenerator().make_token(user)
            verification_link = f"http://localhost:5173/verify-email?uid={uid}&token={token}"
            send_mail(
                subject="Verify your Bike Rental Account",
                message=f"Click here to verify your email: {verification_link}",
                from_email=settings.DEFAULT_FROM_EMAIL,
                recipient_list=[user.email],
                fail_silently=False,
            )
            return Response({"message": "User registered. Please verify your email."}, status=status.HTTP_201_CREATED)
        else:
            print("Registration validation errors:", serializer.errors)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class VerifyEmailView(APIView):
    def get(self, request, uidb64, token):
        try:
            uid = force_str(urlsafe_base64_decode(uidb64))
            user = User.objects.get(pk=uid)
            if PasswordResetTokenGenerator().check_token(user, token):
                user.is_verified = True
                user.save()
                return Response({'message': 'Email verified successfully'}, status=status.HTTP_200_OK)
            return Response({'error': 'Invalid or expired token'}, status=status.HTTP_400_BAD_REQUEST)
        except Exception:
            return Response({'error': 'Invalid verification link'}, status=status.HTTP_400_BAD_REQUEST)


class UserLoginView(APIView):
    permission_classes = [permissions.AllowAny]
    
    def post(self, request):
        try:
            serializer = LoginSerializer(data=request.data)
            serializer.is_valid(raise_exception=True)
            return Response(serializer.validated_data, status=status.HTTP_200_OK)
        except serializers.ValidationError as e:
            # Provide more specific error messages
            error_message = "Password Incorrect. Please try again."
            if 'email' in e.detail:
                error_message = "Please enter a valid email address"
            elif 'password' in e.detail:
                error_message = "Password is required"
            elif 'non_field_errors' in e.detail:
                # Handle authentication errors specifically
                auth_error = e.detail['non_field_errors'][0]
                if any(keyword in auth_error.lower() for keyword in ['password', 'credentials', 'invalid', 'incorrect']):
                    error_message = "Password Incorrect. Please try again."
                else:
                    error_message = auth_error
            
            return Response(
                {"non_field_errors": [error_message]}, 
                status=status.HTTP_400_BAD_REQUEST
            )
        except Exception as e:
            print(f"Login error: {e}")
            return Response(
                {"non_field_errors": ["Server error. Please try again in a few moments."]}, 
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )


class PasswordResetRequestView(APIView):
    permission_classes = [permissions.AllowAny]
    
    def post(self, request):
        email = request.data.get("email")
        if not email:
            return Response({"error": "Email is required."}, status=status.HTTP_400_BAD_REQUEST)

        try:
            user = User.objects.get(email=email)
        except User.DoesNotExist:
            # Don't reveal if user exists or not for security
            return Response({"message": "If an account with this email exists, a password reset link has been sent."}, status=status.HTTP_200_OK)

        try:
            token = generate_reset_token(user.email)
            reset_link = f"http://localhost:5173/reset-password?token={token}"

            # Create a more professional email message
            email_message = f"""
Hello {user.username or user.email},

You have requested to reset your password for your Bike Rental account.

Click the link below to reset your password:
{reset_link}

This link will expire in 1 hour for security reasons.

If you didn't request this password reset, please ignore this email.

Best regards,
Bike Rental Team
            """

            send_mail(
                subject="Reset your Bike Rental password",
                message=email_message,
                from_email=settings.DEFAULT_FROM_EMAIL,
                recipient_list=[email],
                fail_silently=False,
            )
            return Response({"message": "Password reset link sent to your email."}, status=status.HTTP_200_OK)
        except Exception as e:
            print(f"Error sending password reset email: {e}")
            return Response({"error": "Failed to send reset email. Please try again later."}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class SetNewPasswordView(APIView):
    permission_classes = [AllowAny]
    
    def patch(self, request, token):
        print("Token received:", token)
        print("Data received:", request.data)
        
        # Verify the token
        email = verify_reset_token(token)
        print("decoded email from token:", email)
        
        if not email:
            return Response({'error': 'Invalid or expired token. Please request a new password reset.'}, status=400)

        try:
            user = User.objects.get(email=email)
        except User.DoesNotExist:
            return Response({'error': 'User not found.'}, status=404)

        # Validate the new password
        serializer = SetNewPasswordSerializer(data=request.data)
        try:
            serializer.is_valid(raise_exception=True)
        except ValidationError as e:
            print("Validation error:", e.detail)
            return Response({'error': 'Password validation failed.', 'details': e.detail}, status=400)

        # Set the new password
        user.set_password(serializer.validated_data['new_password'])
        user.save()

        return Response({'message': 'Password has been reset successfully'}, status=200)


class ChangePasswordView(UpdateAPIView):
    serializer_class = ChangePasswordSerializer
    permission_classes = [IsAuthenticated]

    def get_object(self):
        return self.request.user

    def update(self, request, *args, **kwargs):
        user = self.get_object()
        serializer = self.get_serializer(data=request.data)
        if serializer.is_valid():
            if not user.check_password(serializer.data.get("old_password")):
                return Response({"old_password": ["Old password wrong please input current password."]}, status=status.HTTP_400_BAD_REQUEST)
            user.set_password(serializer.data.get("new_password"))
            user.save()
            return Response({"message": "Password updated successfully"}, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class BikeListView(viewsets.ReadOnlyModelViewSet):
    queryset = Bike.objects.all()
    serializer_class = BikeSerializer
    permission_classes = [permissions.AllowAny]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = {
        'bike_type': ['exact'],
        'status': ['exact'],
        'price_per_hour': ['gte', 'lte']
    }
    search_fields = ['name', 'model', 'brand', 'bike_type']
    ordering_fields = ['price_per_hour', 'name', 'added_on']
    ordering = ['-added_on']

    def get_queryset(self):
        queryset = Bike.objects.all()
        
        # Handle type filtering - support both 'type' and 'bike_type' parameters
        bike_type = self.request.query_params.get('type') or self.request.query_params.get('bike_type')
        if bike_type:
            queryset = queryset.filter(bike_type=bike_type)
        
        return queryset


class BikeAdminViewSet(viewsets.ModelViewSet):
    queryset = Bike.objects.all()
    serializer_class = BikeSerializer
    permission_classes = [IsAdminUser]


class BookingCreateView(APIView):
    permission_classes = [IsAuthenticated, IsVerifiedUser]


    def post(self, request):
        data = request.data
        bike_id = data.get('bike')
        start_time = data.get('start_time')
        end_time = data.get('end_time')

        if not all([bike_id, start_time, end_time]):
            return Response({'error': 'Bike, start_time, and end_time are required.'}, status=status.HTTP_400_BAD_REQUEST)

        try:
            bike = Bike.objects.get(id=bike_id)
        except Bike.DoesNotExist:
            return Response({'error': 'Bike not found.'}, status=status.HTTP_404_NOT_FOUND)

        conflict = Booking.objects.filter(
            bike=bike,
            start_time__lt=end_time,
            end_time__gt=start_time,
            status__in=["pending", "confirmed"]
        ).exists()

        if conflict:
            return Response({
                'error': 'This bike is already booked for the selected time period. Please choose a different time or bike.',
                'details': 'The bike has conflicting bookings during your selected time range.'
            }, status=status.HTTP_409_CONFLICT)

        fmt_start = timezone.datetime.fromisoformat(start_time)
        fmt_end = timezone.datetime.fromisoformat(end_time)
        duration = (fmt_end - fmt_start).total_seconds() / 3600
        if duration <= 0:
            return Response({'error': 'Invalid time range.'}, status=status.HTTP_400_BAD_REQUEST)

        total_price = round(duration * float(bike.price_per_hour), 2)
        booking = Booking.objects.create(
            user=request.user,
            bike=bike,
            start_time=start_time,
            end_time=end_time,
            total_price=total_price,
            status='confirmed'
        )
        bike.status = 'booked'
        bike.save()

        serializer = BookingSerializer(booking)
        return Response(serializer.data, status=status.HTTP_201_CREATED)


class UserBookingsView(APIView):
    permission_classes = [IsAuthenticated, IsOwnerOrAdmin]

    def get(self, request):
        # Get all bookings for the user, ordered by newest first
        bookings = Booking.objects.filter(user=request.user).order_by('-created_at')
        serializer = BookingSerializer(bookings, many=True)
        return Response(serializer.data)


class UserCurrentBookingsView(APIView):
    permission_classes = [IsAuthenticated, IsOwnerOrAdmin]

    def get(self, request):
        # Get only current bookings (confirmed, in_use, pending)
        current_statuses = ['pending', 'confirmed', 'in_use']
        bookings = Booking.objects.filter(
            user=request.user, 
            status__in=current_statuses
        ).order_by('-created_at')
        serializer = BookingSerializer(bookings, many=True)
        return Response(serializer.data)


class UserRentalHistoryView(APIView):
    permission_classes = [IsAuthenticated, IsOwnerOrAdmin]

    def get(self, request):
        # Get only completed and cancelled bookings
        history_statuses = ['completed', 'cancelled']
        bookings = Booking.objects.filter(
            user=request.user, 
            status__in=history_statuses
        ).order_by('-created_at')
        serializer = BookingSerializer(bookings, many=True)
        return Response(serializer.data)


class AdminBookingListView(ListAPIView):
    queryset = Booking.objects.all()
    serializer_class = AdminBookingSerializer
    permission_classes = [IsAdminUser]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['status', 'bike__name', 'user__username']
    search_fields = ['user__username', 'bike__name']
    ordering_fields = ['created_at', 'start_time', 'end_time', 'total_price']
    ordering = ['-created_at']


class AdminBookingUpdateView(APIView):
    permission_classes = [IsAdminUser]

    def patch(self, request, booking_id):
        try:
            booking = Booking.objects.get(id=booking_id)
        except Booking.DoesNotExist:
            return Response({'error': 'Booking not found'}, status=status.HTTP_404_NOT_FOUND)

        serializer = BookingSerializer(booking, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response({'message': 'Booking updated successfully'}, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class ReviewCreateView(APIView):
    permission_classes = [IsAuthenticated, IsVerifiedUser]

    def post(self, request):
        try:
            print(f"ReviewCreateView - User: {request.user.username}")
            print(f"User is verified: {request.user.is_verified}")
            print(f"Request data: {request.data}")
            
            serializer = ReviewSerializer(data=request.data, context={'request': request})
            if serializer.is_valid():
                review = serializer.save(user=request.user)
                return Response({'message': 'Review submitted successfully'}, status=status.HTTP_201_CREATED)
            else:
                print(f"Serializer errors: {serializer.errors}")
                return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            print(f"Exception in ReviewCreateView: {e}")
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)



class AdminReviewViewSet(viewsets.ModelViewSet):
    queryset = Review.objects.all()
    serializer_class = ReviewSerializer
    permission_classes = [IsAdminUser]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['rating', 'bike__name', 'user__username']
    search_fields = ['user__username', 'bike__name', 'comment']
    ordering_fields = ['created_at', 'rating']
    ordering = ['-created_at']


class AdminReviewDeleteView(APIView):
    permission_classes = [IsAdminUser]

    def delete(self, request, review_id):
        try:
            review = Review.objects.get(id=review_id)
            review.delete()
            return Response({'message': 'Review deleted successfully'}, status=status.HTTP_200_OK)
        except Review.DoesNotExist:
            return Response({'error': 'Review not found'}, status=status.HTTP_404_NOT_FOUND)


class CancelBookingView(APIView):
    permission_classes = [IsAuthenticated, IsVerifiedUser]


    def patch(self, request, booking_id):
        try:
            booking = Booking.objects.get(id=booking_id, user=request.user)
        except Booking.DoesNotExist:
            return Response({'error': 'Booking not found.'}, status=status.HTTP_404_NOT_FOUND)

        if booking.status not in ['pending', 'confirmed']:
            return Response({'error': 'Cannot cancel this booking.'}, status=status.HTTP_400_BAD_REQUEST)

        booking.status = 'cancelled'
        booking.bike.status = 'available'
        booking.bike.save()
        booking.save()
        return Response({'message': 'Booking cancelled successfully.'}, status=status.HTTP_200_OK)


class StartRideView(APIView):
    permission_classes = [IsAuthenticated, IsVerifiedUser]


    def patch(self, request, booking_id):
        try:
            booking = Booking.objects.get(id=booking_id, user=request.user)
        except Booking.DoesNotExist:
            return Response({'error': 'Booking not found.'}, status=status.HTTP_404_NOT_FOUND)

        if booking.status != 'confirmed':
            return Response({'error': 'Ride cannot be started.'}, status=status.HTTP_400_BAD_REQUEST)

        booking.status = 'in_use'
        booking.bike.status = 'in_use'
        booking.bike.save()
        booking.save()
        return Response({'message': 'Ride started successfully.'}, status=status.HTTP_200_OK)


class EndRideView(APIView):
    permission_classes = [IsAuthenticated, IsVerifiedUser]


    def patch(self, request, booking_id):
        try:
            booking = Booking.objects.get(id=booking_id, user=request.user)
        except Booking.DoesNotExist:
            return Response({'error': 'Booking not found.'}, status=status.HTTP_404_NOT_FOUND)

        if booking.status != 'in_use':
            return Response({'error': 'Cannot end this ride.'}, status=status.HTTP_400_BAD_REQUEST)

        booking.status = 'completed'
        booking.bike.status = 'available'  # Make bike immediately available
        booking.bike.save()
        booking.save()
        return Response({
            'message': 'Ride ended successfully. Bike is now available.',
        }, status=status.HTTP_200_OK)


class UpdateProfileView(UpdateAPIView):
    serializer_class = UserSerializer
    permission_classes = [IsAuthenticated]

    def get_object(self):
        return self.request.user


class UserReviewDeleteView(APIView):
    permission_classes = [IsAuthenticated]

    def delete(self, request, review_id):
        try:
            review = Review.objects.get(id=review_id, user=request.user)
        except Review.DoesNotExist:
            return Response({'error': 'Review not found or not yours'}, status=status.HTTP_404_NOT_FOUND)

        review.delete()
        return Response({'message': 'Review deleted successfully'}, status=status.HTTP_200_OK)

# Admin: Delete User
class AdminUserDeleteView(APIView):
    permission_classes = [IsAdminUser]

    def delete(self, request, user_id):
        try:
            user = User.objects.get(id=user_id)
            user.delete()
            return Response({'message': 'User deleted successfully'}, status=status.HTTP_200_OK)
        except User.DoesNotExist:
            return Response({'error': 'User not found'}, status=status.HTTP_404_NOT_FOUND)

# Admin: Change User Role
class AdminUserRoleUpdateView(APIView):
    permission_classes = [IsAdminUser]

    def patch(self, request, user_id):
        is_staff = request.data.get("is_staff")
        is_superuser = request.data.get("is_superuser")

        try:
            user = User.objects.get(id=user_id)
            if is_staff is not None:
                user.is_staff = is_staff
            if is_superuser is not None:
                user.is_superuser = is_superuser
            user.save()
            return Response({'message': 'User role updated successfully'}, status=status.HTTP_200_OK)
        except User.DoesNotExist:
            return Response({'error': 'User not found'}, status=status.HTTP_404_NOT_FOUND)

# Admin: View Single User Detail
class AdminUserDetailView(APIView):
    permission_classes = [IsAdminUser]

    def get(self, request, user_id):
        try:
            user = User.objects.get(id=user_id)
            serializer = UserSerializer(user)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except User.DoesNotExist:
            return Response({'error': 'User not found'}, status=status.HTTP_404_NOT_FOUND)

    def put(self, request, user_id):
        try:
            user = User.objects.get(id=user_id)
            
            # Update basic fields
            if 'username' in request.data:
                user.username = request.data['username']
            if 'email' in request.data:
                user.email = request.data['email']
            
            # Update password if provided
            if 'password' in request.data and request.data['password']:
                user.set_password(request.data['password'])
            
            # Update role if provided
            if 'role' in request.data:
                role = request.data['role']
                if role == 'admin':
                    user.is_staff = True
                    user.is_superuser = True
                else:
                    user.is_staff = False
                    user.is_superuser = False
            
            user.save()
            
            return Response({
                'message': 'User updated successfully',
                'user': UserSerializer(user).data
            }, status=status.HTTP_200_OK)
            
        except User.DoesNotExist:
            return Response({'error': 'User not found'}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)

# Admin: Delete Booking
class AdminBookingDeleteView(APIView):
    permission_classes = [IsAdminUser]

    def delete(self, request, booking_id):
        try:
            booking = Booking.objects.get(id=booking_id)
            booking.delete()
            return Response({'message': 'Booking deleted successfully'}, status=status.HTTP_200_OK)
        except Booking.DoesNotExist:
            return Response({'error': 'Booking not found'}, status=status.HTTP_404_NOT_FOUND)

# Admin: Create User
class AdminUserCreateView(APIView):
    permission_classes = [IsAdminUser]

    def post(self, request):
        serializer = AdminUserCreateSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            return Response({
                "message": "User created successfully",
                "user_id": user.id
            }, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

# Admin: Dashboard Summary Stats
class AdminDashboardStatsView(APIView):
    permission_classes = [IsAdminUser]

    def get(self, request):
        try:
            # Basic counts
            total_users = User.objects.count()
            total_bikes = Bike.objects.count()
            total_bookings = Booking.objects.count()
            total_reviews = Review.objects.count()
            
            # User breakdown
            admin_users = User.objects.filter(is_staff=True).count()
            customer_users = User.objects.filter(is_staff=False, is_superuser=False).count()
            verified_users = User.objects.filter(is_verified=True).count()
            
            # Bike status breakdown
            available_bikes = Bike.objects.filter(status='available').count()
            booked_bikes = Bike.objects.filter(status='booked').count()
            in_use_bikes = Bike.objects.filter(status='in_use').count()
            
            # Booking status breakdown
            pending_bookings = Booking.objects.filter(status='pending').count()
            confirmed_bookings = Booking.objects.filter(status='confirmed').count()
            completed_bookings = Booking.objects.filter(status='completed').count()
            cancelled_bookings = Booking.objects.filter(status='cancelled').count()
            
            # Recent activity (last 7 days)
            from datetime import timedelta
            from django.utils import timezone
            
            week_ago = timezone.now() - timedelta(days=7)
            recent_bookings = Booking.objects.filter(created_at__gte=week_ago).count()
            recent_users = User.objects.filter(date_joined__gte=week_ago).count()
            recent_reviews = Review.objects.filter(created_at__gte=week_ago).count()
            
            # Revenue calculation (completed bookings)
            total_revenue = Booking.objects.filter(status='completed').aggregate(
                total=Sum('total_price')
            )['total'] or 0
            
            # Daily revenue (today)
            today = timezone.now().date()
            daily_revenue = Booking.objects.filter(
                status='completed',
                created_at__date=today
            ).aggregate(
                total=Sum('total_price')
            )['total'] or 0
            
            # Monthly revenue (current month)
            current_month = timezone.now().month
            current_year = timezone.now().year
            monthly_revenue = Booking.objects.filter(
                status='completed',
                created_at__month=current_month,
                created_at__year=current_year
            ).aggregate(
                total=Sum('total_price')
            )['total'] or 0
            
            # Average rating
            from django.db.models import Avg
            avg_rating = Review.objects.aggregate(avg_rating=Avg('rating'))['avg_rating'] or 0

            return Response({
                # Basic stats
                "total_users": total_users,
                "total_bikes": total_bikes,
                "total_bookings": total_bookings,
                "total_reviews": total_reviews,
                
                # User breakdown
                "admin_users": admin_users,
                "customer_users": customer_users,
                "verified_users": verified_users,
                
                # Bike status breakdown
                "available_bikes": available_bikes,
                "booked_bikes": booked_bikes,
                "in_use_bikes": in_use_bikes,
                
                # Booking status breakdown
                "pending_bookings": pending_bookings,
                "confirmed_bookings": confirmed_bookings,
                "completed_bookings": completed_bookings,
                "cancelled_bookings": cancelled_bookings,
                
                # Recent activity
                "recent_bookings": recent_bookings,
                "recent_users": recent_users,
                "recent_reviews": recent_reviews,
                
                # Financial and quality metrics
                "total_revenue": float(total_revenue),
                "daily_revenue": float(daily_revenue),
                "monthly_revenue": float(monthly_revenue),
                "avg_rating": round(avg_rating, 1),
                
                # Calculated percentages
                "bike_utilization_rate": round((booked_bikes + in_use_bikes) / total_bikes * 100, 1) if total_bikes > 0 else 0,
                "booking_completion_rate": round(completed_bookings / total_bookings * 100, 1) if total_bookings > 0 else 0,
                "user_verification_rate": round(verified_users / total_users * 100, 1) if total_users > 0 else 0,
            })
            
        except Exception as e:
            print(f"Error in AdminDashboardStatsView: {e}")
            return Response(
                {'error': 'Failed to fetch dashboard statistics'}, 
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )


class AdminUserListView(APIView):
    permission_classes = [IsAdminUser]

    def get(self, request):
        is_staff = request.query_params.get('is_staff')
        is_superuser = request.query_params.get('is_superuser')
        search = request.query_params.get('search')

        users = User.objects.all()

        if is_staff is not None:
            users = users.filter(is_staff=(is_staff.lower() == 'true'))

        if is_superuser is not None:
            users = users.filter(is_superuser=(is_superuser.lower() == 'true'))

        if search:
            users = users.filter(
                Q(username__icontains=search) | Q(email__icontains=search)
            )

        serializer = UserSerializer(users, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)


class ReviewListView(APIView):
    """
    Public endpoint to list reviews with optional bike filtering
    """
    permission_classes = [permissions.AllowAny]
    
    def get(self, request):
        # Get bike filter from query parameters
        bike_id = request.query_params.get('bike')
        
        # Start with all reviews
        reviews = Review.objects.select_related('user', 'bike').order_by('-created_at')
        
        # Filter by bike if bike_id is provided
        if bike_id:
            reviews = reviews.filter(bike_id=bike_id)
        
        serializer = ReviewSerializer(reviews, many=True)
        return Response(serializer.data)


@api_view(['GET'])
@permission_classes([AllowAny])
def bike_stats(request):
    """Get bike statistics for the frontend"""
    try:
        total_bikes = Bike.objects.count()
        available_bikes = Bike.objects.filter(status='available').count()
        booked_bikes = Bike.objects.filter(status='booked').count()
        in_use_bikes = Bike.objects.filter(status='in_use').count()
        
        stats = {
            'total': total_bikes,
            'available': available_bikes,
            'booked': booked_bikes,
            'in_use': in_use_bikes,
        }
        
        return Response(stats)
    except Exception as e:
        return Response({'error': str(e)}, status=500)


class AnalyticsTrackView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        try:
            # Get client IP address
            x_forwarded_for = request.META.get('HTTP_X_FORWARDED_FOR')
            if x_forwarded_for:
                ip = x_forwarded_for.split(',')[0]
            else:
                ip = request.META.get('REMOTE_ADDR')

            # Create analytics entry
            analytics_data = {
                'action': request.data.get('action', ''),
                'page': request.data.get('page', ''),
                'user': request.user if request.user.is_authenticated else None,
                'ip_address': ip or '',
                'user_agent': request.META.get('HTTP_USER_AGENT', '')
            }

            serializer = AnalyticsSerializer(data=analytics_data)
            if serializer.is_valid():
                serializer.save()
                return Response({'message': 'Analytics tracked successfully'}, status=201)
            else:
                print(f"Analytics serializer errors: {serializer.errors}")
                return Response(serializer.errors, status=400)

        except Exception as e:
            print(f"Analytics tracking error: {e}")
            return Response({'error': 'Failed to track analytics'}, status=500)


class AdminAnalyticsView(APIView):
    permission_classes = [IsAdminUser]

    def get(self, request):
        try:
            # Get analytics data
            total_clicks = Analytics.objects.count()
            browse_bikes_clicks = Analytics.objects.filter(action='browse_bikes_clicked').count()
            about_page_visits = Analytics.objects.filter(action='about_page_visited').count()
            
            # Get recent analytics
            recent_analytics = Analytics.objects.all()[:10]
            
            analytics_data = {
                'total_clicks': total_clicks,
                'browse_bikes_clicks': browse_bikes_clicks,
                'about_page_visits': about_page_visits,
                'recent_analytics': AnalyticsSerializer(recent_analytics, many=True).data
            }
            
            return Response(analytics_data)
            
        except Exception as e:
            return Response({'error': str(e)}, status=500)


class TokenRefreshView(APIView):
    permission_classes = [AllowAny]
    
    def post(self, request):
        try:
            refresh_token = request.data.get('refresh')
            if not refresh_token:
                return Response({'error': 'Refresh token is required'}, status=400)
            
            try:
                # Use the refresh token directly to get a new access token
                refresh = RefreshToken(refresh_token)
                access_token = str(refresh.access_token)
                
                return Response({
                    'access': access_token,
                    'refresh': str(refresh)
                }, status=200)
                
            except Exception as e:
                print(f"Token refresh error: {e}")
                return Response({'error': 'Invalid refresh token'}, status=400)
                
        except Exception as e:
            print(f"Token refresh failed: {e}")
            return Response({'error': 'Token refresh failed'}, status=500)


class SystemStatusView(APIView):
    permission_classes = [IsAdminUser]
    
    def get(self, request):
        try:
            # Check database connectivity
            from django.db import connection
            from django.db.utils import OperationalError
            
            db_status = "online"
            try:
                with connection.cursor() as cursor:
                    cursor.execute("SELECT 1")
                    cursor.fetchone()
            except OperationalError:
                db_status = "offline"
            
            # Check if server is running
            server_status = "online"
            
            # Check if there are any critical errors in logs (simplified check)
            # In a real implementation, you might check log files or error tracking
            error_count = 0  # This could be implemented to check actual error logs
            
            # Determine overall system status
            if db_status == "online" and server_status == "online" and error_count == 0:
                overall_status = "Online & Secure"
                status_color = "emerald"
                status_icon = "🟢"
            elif db_status == "offline":
                overall_status = "Database Offline"
                status_color = "red"
                status_icon = "🔴"
            else:
                overall_status = "System Issues Detected"
                status_color = "yellow"
                status_icon = "🟡"
            
            return Response({
                'overall_status': overall_status,
                'status_color': status_color,
                'status_icon': status_icon,
                'components': {
                    'database': db_status,
                    'server': server_status,
                    'errors': error_count
                },
                'last_check': timezone.now().isoformat()
            })
            
        except Exception as e:
            return Response({
                'overall_status': 'System Error',
                'status_color': 'red',
                'status_icon': '🔴',
                'components': {
                    'database': 'unknown',
                    'server': 'unknown',
                    'errors': 1
                },
                'last_check': timezone.now().isoformat(),
                'error': str(e)
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)



