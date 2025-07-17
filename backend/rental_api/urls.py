from django.urls import path, include
from rest_framework.routers import DefaultRouter
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

from .views import (
    UserRegistrationView, UserLoginView, VerifyEmailView,
    PasswordResetRequestView, SetNewPasswordView, ChangePasswordView,
    BikeListView, BikeAdminViewSet,
    BookingCreateView, UserBookingsView, AdminBookingListView, AdminBookingUpdateView,
    ReviewCreateView, AdminReviewViewSet, AdminReviewDeleteView, CancelBookingView, StartRideView, EndRideView, UpdateProfileView,
    AdminUserListView, UserReviewDeleteView,AdminUserDetailView,AdminUserDeleteView,AdminUserRoleUpdateView,
    AdminBookingDeleteView, AdminDashboardStatsView
)

router = DefaultRouter()
router.register(r'bikes', BikeListView, basename='bike')
router.register(r'admin/bikes', BikeAdminViewSet, basename='admin-bike')
router.register(r'admin/reviews', AdminReviewViewSet, basename='admin-reviews')

urlpatterns = [
    # Auth & User
    path('register/', UserRegistrationView.as_view(), name='register'),
    path('login/', UserLoginView.as_view(), name='login'),
    path('verify-email/<uidb64>/<token>/', VerifyEmailView.as_view(), name='verify-email'),

    # JWT Token
    path('token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),

    # Password
    path('reset-password/', PasswordResetRequestView.as_view(), name='request-reset'),
    path('set-new-password/<str:token>/', SetNewPasswordView.as_view(), name='set-new-password'),
    path('change-password/', ChangePasswordView.as_view(), name='change-password'),

    # Booking
    path('book/', BookingCreateView.as_view(), name='book-bike'),
    path('user/bookings/', UserBookingsView.as_view(), name='user-bookings'),
    path('admin/bookings/', AdminBookingListView.as_view(), name='admin-booking-list'),
    path('admin/bookings/<int:booking_id>/update/', AdminBookingUpdateView.as_view(), name='admin-booking-update'),
    # Booking actions
    path('booking/<int:booking_id>/cancel/', CancelBookingView.as_view(), name='cancel-booking'),
    path('booking/<int:booking_id>/start/', StartRideView.as_view(), name='start-ride'),
    path('booking/<int:booking_id>/end/', EndRideView.as_view(), name='end-ride'),

    # Profile update
    path('user/update-profile/', UpdateProfileView.as_view(), name='update-profile'),

    # Review
    path('review/', ReviewCreateView.as_view(), name='submit-review'),
    path('admin/reviews/<int:review_id>/delete/', AdminReviewDeleteView.as_view(), name='delete-review'),
    path('review/<int:review_id>/delete/', UserReviewDeleteView.as_view(), name='user-review-delete'),


    #Admin User list views
    path('admin/users/', AdminUserListView.as_view(), name='admin-user-list'),
    
    # Admin User Management
    path('admin/users/<int:user_id>/', AdminUserDetailView.as_view(), name='admin-user-detail'),
    path('admin/users/<int:user_id>/delete/', AdminUserDeleteView.as_view(), name='admin-user-delete'),
    path('admin/users/<int:user_id>/change-role/', AdminUserRoleUpdateView.as_view(), name='admin-user-role'),

    # Admin Booking Management
    path('admin/bookings/<int:booking_id>/delete/', AdminBookingDeleteView.as_view(), name='admin-booking-delete'),

    # Admin Dashboard Stats
    path('admin/stats/', AdminDashboardStatsView.as_view(), name='admin-dashboard-stats'),

    
    # DRF Router 
    path('', include(router.urls)),
]
