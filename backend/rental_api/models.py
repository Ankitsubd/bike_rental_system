from django.db import models
from django.contrib.auth.models import AbstractUser
from django.core.validators import MinValueValidator, MaxValueValidator

class User(AbstractUser):
    is_verified = models.BooleanField(default=False)
    phone_number = models.CharField(max_length=15, blank=True, null=True)
    address = models.TextField(blank=True, null=True)
    full_name = models.CharField(max_length=255, blank=True, null=True)

    class Meta:
        verbose_name = 'User'
        verbose_name_plural = 'Users'

    def save(self, *args, **kwargs):
        # Auto-generate full_name from first_name and last_name if not set
        if not self.full_name and (self.first_name or self.last_name):
            self.full_name = f"{self.first_name or ''} {self.last_name or ''}".strip()
        super().save(*args, **kwargs)

class Bike(models.Model):
    BIKE_STATUS_CHOICES = [
        ('available', 'Available'),
        ('booked', 'Booked'),
        ('in_use', 'In Use'),
    ]

    name = models.CharField(max_length=100)
    brand = models.CharField(max_length=100)
    model = models.CharField(max_length=100)
    bike_type = models.CharField(max_length=50)
    price_per_hour = models.DecimalField(max_digits=10, decimal_places=2)
    status = models.CharField(max_length=20, choices=BIKE_STATUS_CHOICES, default='available')
    image = models.ImageField(upload_to='bikes/', blank=True, null=True)
    description = models.TextField(blank=True, null=True)
    phone_number = models.CharField(max_length=15, blank=True, null=True, help_text="Contact phone number for this bike")
    added_on = models.DateTimeField(auto_now_add=True)
    rating = models.DecimalField(max_digits=3, decimal_places=1, default=4.5, validators=[MinValueValidator(0), MaxValueValidator(5)])
    total_reviews = models.IntegerField(default=0)

    def __str__(self):
        return f"{self.brand} {self.model} - {self.name}"

    class Meta:
        ordering = ['-added_on']



class Booking(models.Model):
    STATUS_CHOICES = [
           ('pending', 'Pending'),
           ('confirmed', 'Confirmed'),
           ('in_use', 'In Use'),
           ('completed', 'Completed'),
           ('cancelled', 'Cancelled'),
       ]

    user = models.ForeignKey(User, on_delete=models.CASCADE)
    bike = models.ForeignKey(Bike, on_delete=models.CASCADE)
    start_time = models.DateTimeField()
    booked_end_time = models.DateTimeField(null=True, blank=True)  # User-selected end time (required for new bookings)
    end_time = models.DateTimeField(null=True, blank=True)  # Legacy field (deprecated)
    total_price = models.DecimalField(max_digits=8, decimal_places=2, null=True, blank=True)  # Made optional
    actual_end_time = models.DateTimeField(null=True, blank=True)  # When user actually ended ride
    actual_total_price = models.DecimalField(max_digits=8, decimal_places=2, null=True, blank=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Booking #{self.id} - {self.user.username}"

    class Meta:
        ordering = ['-created_at']




class Review(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='reviews')
    bike = models.ForeignKey(Bike, on_delete=models.CASCADE, related_name='reviews')
    rating = models.IntegerField(validators=[MinValueValidator(1), MaxValueValidator(5)])
    comment = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Review by {self.user.username} on {self.bike.name}"


class Analytics(models.Model):
    ACTION_CHOICES = [
        ('browse_bikes_clicked', 'Browse Bikes Clicked'),
        ('about_page_visited', 'About Page Visited'),
        ('contact_clicked', 'Contact Clicked'),
        ('feature_clicked', 'Feature Clicked'),
    ]

    action = models.CharField(max_length=50, choices=ACTION_CHOICES)
    page = models.CharField(max_length=50)
    timestamp = models.DateTimeField(auto_now_add=True)
    user = models.ForeignKey(User, on_delete=models.CASCADE, null=True, blank=True)
    ip_address = models.GenericIPAddressField(null=True, blank=True)
    user_agent = models.TextField(blank=True, null=True)

    class Meta:
        verbose_name_plural = "Analytics"
        ordering = ['-timestamp']

    def __str__(self):
        return f"{self.action} - {self.timestamp}"
   
