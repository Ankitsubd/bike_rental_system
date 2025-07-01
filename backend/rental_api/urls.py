from django.urls import path
from rest_framework_simplejwt.views import (
    TokenObtainPairView,     
    TokenRefreshView          
)

from .views import (
    UserRegistrationView,     # User signup
    BikeListView,             # List all available bikes
    BookingCreateView,        # Create a new booking
    UserBookingsView,         # List bookings made by the current user
    ReviewCreateView          # Create a review (optional)
)

urlpatterns = [

    # ✅ Authentication endpoints
    path('register/', UserRegistrationView.as_view(), name='register'),
    path('login/', TokenObtainPairView.as_view(), name='login'),               # JWT login — returns access + refresh token
    path('token/refresh/', TokenRefreshView.as_view(), name='token-refresh'),  # Get a new access token using refresh token

    # ✅ Bike rental core features
    path('bikes/', BikeListView.as_view(), name='bike-list'),                  # Public endpoint — see available bikes
    path('bookings/create/', BookingCreateView.as_view(), name='create-booking'), # Create a booking (requires login)
    path('bookings/user/', UserBookingsView.as_view(), name='user-bookings'),  # View current user's bookings (requires login)
    path('reviews/create/', ReviewCreateView.as_view(), name='create-review'), # Submit a review (requires login)
]
