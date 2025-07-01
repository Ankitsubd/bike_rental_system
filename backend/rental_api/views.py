from rest_framework import generics, permissions
from django.shortcuts import get_object_or_404
from django.utils.dateparse import parse_datetime
from .models import User, Bike, Booking, Review
from .serializers import UserSerializer, BikeSerializer, BookingSerializer, ReviewSerializer


class UserRegistrationView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [permissions.AllowAny]


class BikeListView(generics.ListAPIView):
    serializer_class = BikeSerializer
    permission_classes = [permissions.AllowAny]

    def get_queryset(self):
        return Bike.objects.filter(available=True)


class BookingCreateView(generics.CreateAPIView):
    queryset = Booking.objects.all()
    serializer_class = BookingSerializer
    permission_classes = [permissions.IsAuthenticated]

    def perform_create(self, serializer):
        bike_id = self.request.data.get('bike_id')
        start_time = parse_datetime(self.request.data.get('start_time'))
        end_time = parse_datetime(self.request.data.get('end_time'))

        bike = get_object_or_404(Bike, id=bike_id)

        if not start_time or not end_time:
            raise ValueError("Invalid or missing start_time or end_time.")

        duration_hours = (end_time - start_time).total_seconds() / 3600
        total_price = round(duration_hours * float(bike.price_per_hour), 2)

        serializer.save(
            user=self.request.user,
            bike=bike,
            start_time=start_time,
            end_time=end_time,
            total_price=total_price
        )

class ReviewCreateView(generics.CreateAPIView):
    queryset = Review.objects.all()
    serializer_class = ReviewSerializer
    permission_classes = [permissions.IsAuthenticated]

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)


class UserBookingsView(generics.ListAPIView):
    serializer_class = BookingSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Booking.objects.filter(user=self.request.user).order_by('-created_at')
