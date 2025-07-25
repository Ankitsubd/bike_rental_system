from django.db import models
from django.contrib.auth.models import AbstractUser 
from django.core.validators import MinValueValidator, MaxValueValidator

class User(AbstractUser):
    email = models.EmailField(unique=True)
    username = models.CharField(max_length=150, unique=True)
    is_customer = models.BooleanField(default=True)
    is_admin = models.BooleanField(default=False)
    is_verified = models.BooleanField(default= False)
    created_at = models.DateTimeField(auto_now_add=True)
    phone = models.CharField(max_length=15, blank=False, null=False, default='N/A')
    address = models.TextField(blank=False, null=False, default= 'N/A')
    
    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['username']

    def __str__(self):
        return self.email

class Bike(models.Model):
    BIKE_STATUS_CHOICES = [
        ('available', 'Available'),
        ('booked', 'Booked'),
        ('in_use', 'In Use'),
        ('returned', 'Returned'),
        ('maintenance', 'Under Maintenance'),
        ('reserved', 'Reserved'),
        ('offline', 'Offline / Inactive'),
    ]

    name = models.CharField(max_length=100)
    brand = models.CharField(max_length=100)
    model = models.CharField(max_length=100)
    bike_type = models.CharField(max_length=50)
    price_per_hour = models.DecimalField(max_digits=6, decimal_places=2, validators=[MinValueValidator(0)])
    # is_available = models.BooleanField(default=True)
    image = models.ImageField(upload_to='bike_images/', blank=True, null=True)
    status = models.CharField(max_length=20, choices=BIKE_STATUS_CHOICES, default='available')

    added_on = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.name} - {self.model}"

class Booking(models.Model):
    STATUS_CHOICES = [
           ('pending', 'Pending'),
           ('confirmed', 'Confirmed'),
           ('completed', 'Completed'),
           ('cancelled', 'Cancelled'),
       ]

    user = models.ForeignKey(User, on_delete=models.CASCADE)
    bike = models.ForeignKey(Bike, on_delete=models.CASCADE)
    start_time = models.DateTimeField()
    end_time = models.DateTimeField()
    total_price = models.DecimalField(max_digits=8, decimal_places=2)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Booking #{self.id} - {self.user.username}"




class Review(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='reviews')
    bike = models.ForeignKey(Bike, on_delete=models.CASCADE, related_name='reviews')
    rating = models.IntegerField(validators=[MinValueValidator(1), MaxValueValidator(5)])
    comment = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('user', 'bike')

    def __str__(self):
        return f"Review by {self.user.username} on {self.bike.name}"
   
