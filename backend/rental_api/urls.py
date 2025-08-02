from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    BikeListView, BikeAdminViewSet,
    UserRegistrationView, UserLoginView, VerifyEmailView,
    PasswordResetRequestView, SetNewPasswordView, ChangePasswordView,
    BookingCreateView, UserBookingsView, UserCurrentBookingsView, UserRentalHistoryView, AdminBookingListView, AdminBookingUpdateView,
    ReviewCreateView, ReviewListView, AdminReviewViewSet, AdminReviewDeleteView, CancelBookingView, StartRideView, EndRideView, UpdateProfileView,
    AdminUserListView, UserReviewDeleteView, AdminUserDetailView, AdminUserDeleteView, AdminUserRoleUpdateView,
    AdminBookingDeleteView, AdminDashboardStatsView, AdminUserCreateView, UserProfileView, UserDashboardStatsView,
    bike_stats, AdminAnalyticsView, AnalyticsTrackView, TokenRefreshView, SystemStatusView, AdminContactInfoView
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
    path('token/refresh/', TokenRefreshView.as_view(), name='token-refresh'),

    # Password
    path('reset-password/', PasswordResetRequestView.as_view(), name='request-reset'),
    path('set-new-password/<str:token>/', SetNewPasswordView.as_view(), name='set-new-password'),
    path('change-password/', ChangePasswordView.as_view(), name='change-password'),

    # User Profile & Dashboard
    path('user/profile/', UserProfileView.as_view(), name='user-profile'),
    path('user/dashboard-stats/', UserDashboardStatsView.as_view(), name='user-dashboard-stats'),

    # Booking
    path('book/', BookingCreateView.as_view(), name='book-bike'),
    path('user/bookings/', UserBookingsView.as_view(), name='user-bookings'),
    path('user/current-bookings/', UserCurrentBookingsView.as_view(), name='user-current-bookings'),
    path('user/rental-history/', UserRentalHistoryView.as_view(), name='user-rental-history'),
    path('admin/bookings/', AdminBookingListView.as_view(), name='admin-booking-list'),
    path('admin/bookings/<int:booking_id>/update/', AdminBookingUpdateView.as_view(), name='admin-booking-update'),
    # Booking actions
    path('booking/<int:booking_id>/cancel/', CancelBookingView.as_view(), name='cancel-booking'),
    path('booking/<int:booking_id>/start/', StartRideView.as_view(), name='start-ride'),
    path('booking/<int:booking_id>/end/', EndRideView.as_view(), name='end-ride'),

    # Profile update
    path('user/update-profile/', UpdateProfileView.as_view(), name='update-profile'),

    # Review
    path('reviews/', ReviewListView.as_view(), name='list-reviews'),
    path('reviews/create/', ReviewCreateView.as_view(), name='create-review'),
    path('reviews/<int:review_id>/delete/', UserReviewDeleteView.as_view(), name='user-review-delete'),
    path('admin/reviews/<int:review_id>/delete/', AdminReviewDeleteView.as_view(), name='admin-review-delete'),

    # Admin User list views
    path('admin/users/', AdminUserListView.as_view(), name='admin-user-list'),
    
    # Admin User Management
    path('admin/users/create/', AdminUserCreateView.as_view(), name='admin-user-create'),
    path('admin/users/<int:user_id>/', AdminUserDetailView.as_view(), name='admin-user-detail'),
    path('admin/users/<int:user_id>/delete/', AdminUserDeleteView.as_view(), name='admin-user-delete'),
    path('admin/users/<int:user_id>/change-role/', AdminUserRoleUpdateView.as_view(), name='admin-user-role'),

    # Admin Booking Management
    path('admin/bookings/<int:booking_id>/delete/', AdminBookingDeleteView.as_view(), name='admin-booking-delete'),

    # Admin Dashboard Stats
    path('admin/stats/', AdminDashboardStatsView.as_view(), name='admin-dashboard-stats'),
    
    # System Status
    path('admin/system-status/', SystemStatusView.as_view(), name='system-status'),

    # Bike Stats
    path('bikes/stats/', bike_stats, name='bike-stats'),
    
    # Admin Contact Info
    path('admin/contact-info/', AdminContactInfoView.as_view(), name='admin-contact-info'),
    
    # DRF Router 
    path('', include(router.urls)),
    path('admin/analytics/', AdminAnalyticsView.as_view(), name='admin-analytics'),
    path('analytics/track-about-click/', AnalyticsTrackView.as_view(), name='analytics-track'),
]
