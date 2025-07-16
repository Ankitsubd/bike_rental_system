from rest_framework import viewsets, permissions, status, filters
from rest_framework.views import APIView
from rest_framework.generics import UpdateAPIView
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
from django.db.models import Q
from .utils import verify_reset_token
from django.utils.encoding import force_bytes
from django.utils.http import urlsafe_base64_encode

from .utils import generate_verification_token, generate_reset_token
from .permissions import IsOwnerOrAdmin, IsAdminUser, IsVerifiedUser
from .models import Bike, Booking, Review
from .serializers import (
    UserSerializer, RegisterSerializer, ChangePasswordSerializer,
    BikeSerializer, BookingSerializer,
    ReviewSerializer, LoginSerializer, SetNewPasswordSerializer
)

User = get_user_model()


class UserRegistrationView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        serializer = RegisterSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            uid = urlsafe_base64_encode(force_bytes(user.pk))
            # token = generate_verification_token(user.email)
            token = PasswordResetTokenGenerator().make_token(user)
            verification_link = f"http://localhost:8000/api/v1/verify-email/{uid}/{token}/"
            send_mail(
                subject="Verify your Bike Rental Account",
                message=f"Click here to verify your email: {verification_link}",
                from_email=settings.DEFAULT_FROM_EMAIL,
                recipient_list=[user.email],
                fail_silently=False,
            )
            return Response({"message": "User registered. Please verify your email."}, status=status.HTTP_201_CREATED)
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
    def post(self, request):
        serializer = LoginSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        return Response(serializer.validated_data, status=status.HTTP_200_OK)


class PasswordResetRequestView(APIView):
    def post(self, request):
        email = request.data.get("email")
        if not email:
            return Response({"error": "Email is required."}, status=status.HTTP_400_BAD_REQUEST)

        try:
            user = User.objects.get(email=email)
        except User.DoesNotExist:
            return Response({"error": "User with this email does not exist."}, status=status.HTTP_404_NOT_FOUND)

        token = generate_reset_token(user.email)
        reset_link = f"http://localhost:8000/api/v1/set-new-password/{token}/"
        send_mail(
            subject="Reset your Bike Rental password",
            message=f"Click the link below to reset your password:\n{reset_link}",
            from_email=settings.DEFAULT_FROM_EMAIL,
            recipient_list=[email],
            fail_silently=False,
        )
        return Response({"message": "Password reset link sent to your email."}, status=status.HTTP_200_OK)


class SetNewPasswordView(APIView):
    def patch(self, request, token):
        email = verify_reset_token(token)
        if not email:
            return Response({'error': 'Invalid or expired token.'}, status=status.HTTP_400_BAD_REQUEST)

        try:
            user = User.objects.get(email=email)
        except User.DoesNotExist:
            return Response({'error': 'User not found.'}, status=status.HTTP_404_NOT_FOUND)

        serializer = SetNewPasswordSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        user.set_password(serializer.validated_data['new_password'])
        user.save()

        return Response({'message': 'Password has been reset successfully'}, status=status.HTTP_200_OK)



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
                return Response({"old_password": ["Wrong password."]}, status=status.HTTP_400_BAD_REQUEST)
            user.set_password(serializer.data.get("new_password"))
            user.save()
            return Response({"message": "Password updated successfully"}, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class BikeListView(viewsets.ReadOnlyModelViewSet):
    queryset = Bike.objects.filter(status='available')
    serializer_class = BikeSerializer
    permission_classes = [permissions.AllowAny]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter]
    filterset_fields = {'price_per_hour': ['gte', 'lte']}
    search_fields = ['name', 'model', 'brand', 'bike_type']


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
            return Response({'error': 'Bike already booked during this time.'}, status=status.HTTP_409_CONFLICT)

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
        bookings = Booking.objects.filter(user=request.user)
        serializer = BookingSerializer(bookings, many=True)
        return Response(serializer.data)


class AdminBookingListView(APIView):
    permission_classes = [IsAdminUser]

    def get(self, request):
        bookings = Booking.objects.all()
        serializer = BookingSerializer(bookings, many=True)
        return Response(serializer.data)


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
        serializer = ReviewSerializer(data=request.data, context={'request': request})
        if serializer.is_valid():
            serializer.save(user=request.user)
            return Response({'message': 'Review submitted successfully'}, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)



class AdminReviewViewSet(viewsets.ModelViewSet):
    queryset = Review.objects.all()
    serializer_class = ReviewSerializer
    permission_classes = [IsAdminUser]


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
        booking.bike.status = 'returned'
        booking.bike.save()
        booking.save()
        return Response({'message': 'Ride ended successfully and bike returned.'}, status=status.HTTP_200_OK)


class UpdateProfileView(UpdateAPIView):
    serializer_class = UserSerializer
    permission_classes = [IsAuthenticated]

    def get_object(self):
        return self.request.user


class AdminUserListView(APIView):
    permission_classes = [IsAdminUser]

    def get(self, request):
        is_admin = request.query_params.get('is_admin')
        is_customer = request.query_params.get('is_customer')
        search = request.query_params.get('search')

        users = User.objects.all()

        if is_admin is not None:
            users = users.filter(is_admin=(is_admin.lower() == 'true'))

        if is_customer is not None:
            users = users.filter(is_customer=(is_customer.lower() == 'true'))

        if search:
            users = users.filter(
                Q(username__icontains=search) | Q(email__icontains=search)
            )

        serializer = UserSerializer(users, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)


class UserReviewDeleteView(APIView):
    permission_classes = [IsAuthenticated]

    def delete(self, request, review_id):
        try:
            review = Review.objects.get(id=review_id, user=request.user)
        except Review.DoesNotExist:
            return Response({'error': 'Review not found or not yours'}, status=status.HTTP_404_NOT_FOUND)

        review.delete()
        return Response({'message': 'Review deleted successfully'}, status=status.HTTP_200_OK)

