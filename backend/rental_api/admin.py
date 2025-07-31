from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import User, Bike, Booking, Review, Analytics

class CustomUserAdmin(UserAdmin):
    list_display = ('username', 'email', 'first_name', 'last_name', 'is_verified', 'date_joined')
    list_filter = ('is_verified', 'is_staff', 'is_superuser', 'date_joined')
    search_fields = ('username', 'email', 'first_name', 'last_name')
    ordering = ('date_joined',)

admin.site.register(User, CustomUserAdmin)

@admin.register(Bike)
class BikeAdmin(admin.ModelAdmin):
    list_display = ('name', 'brand', 'model', 'bike_type', 'price_per_hour', 'status', 'rating', 'total_reviews', 'phone_number', 'added_on')
    list_filter = ('status', 'bike_type', 'brand', 'added_on')
    search_fields = ('name', 'brand', 'model', 'phone_number')
    ordering = ('-added_on',)
    readonly_fields = ('rating', 'total_reviews')

@admin.register(Booking)
class BookingAdmin(admin.ModelAdmin):
    list_display = ('user', 'bike', 'start_time', 'end_time', 'status', 'total_price', 'created_at')
    list_filter = ('status', 'created_at')
    search_fields = ('user__username', 'bike__name')
    ordering = ('-created_at',)

@admin.register(Review)
class ReviewAdmin(admin.ModelAdmin):
    list_display = ('user', 'bike', 'rating', 'created_at')
    list_filter = ('rating', 'created_at')
    search_fields = ('user__username', 'bike__name', 'comment')
    ordering = ('-created_at',)

@admin.register(Analytics)
class AnalyticsAdmin(admin.ModelAdmin):
    list_display = ('action', 'page', 'timestamp', 'user', 'ip_address')
    list_filter = ('action', 'page', 'timestamp')
    search_fields = ('action', 'page', 'user__username')
    readonly_fields = ('timestamp',)
    ordering = ('-timestamp',)
