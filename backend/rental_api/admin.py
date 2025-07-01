from django.contrib import admin

# Register your models here.
from .models import User, Bike, Booking, Review

admin.site.register(User)
admin.site.register(Bike)
admin.site.register(Booking)
admin.site.register(Review)
