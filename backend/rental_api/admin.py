from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from .models import User, Bike, Booking, Review


class CustomUserAdmin(BaseUserAdmin):
    model = User
    list_display = ('id', 'username', 'email', 'is_customer', 'is_admin', 'is_verified' ,'created_at')
    list_filter = ('is_admin', 'is_customer')
    fieldsets = (
        (None, {'fields': ('username', 'email', 'password')}),
        ('Permissions', {'fields': ('is_active', 'is_staff', 'is_superuser', 'is_customer', 'is_admin')}),
        ('Important dates', {'fields': ('last_login', 'date_joined')}),
    )
    search_fields = ('username', 'email')
    ordering = ('-created_at',)

@admin.register(Bike)
class BikeAdmin(admin.ModelAdmin):
    list_display = ('id', 'name', 'brand', 'model', 'bike_type', 'price_per_hour', 'status', 'added_on')
    list_filter = ('status', 'brand', 'bike_type')
    search_fields = ('name', 'brand', 'model')


@admin.register(Booking)
class BookingAdmin(admin.ModelAdmin):
    list_display = ('id', 'user', 'bike', 'start_time', 'end_time', 'total_price', 'status', 'created_at')
    list_filter = ('status',)
    search_fields = ('user__username', 'bike__name')


# @admin.register(Payment)
# class PaymentAdmin(admin.ModelAdmin):
#     list_display = ('id', 'booking', 'amount', 'payment_method', 'payment_status', 'payment_date')
#     list_filter = ('payment_method', 'payment_status')
#     search_fields = ('booking__user__username',)


@admin.register(Review)
class ReviewAdmin(admin.ModelAdmin):
    list_display = ('id', 'user', 'bike', 'rating', 'created_at')
    list_filter = ('rating',)
    search_fields = ('user__username', 'bike__name')


admin.site.register(User, CustomUserAdmin)
