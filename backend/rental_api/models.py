from django.db import models
from django.contrib.auth.models import AbstractUser 
from django.core.validators import MinValueValidator, MaxValueValidator

class User(AbstractUser ):
   phone = models.CharField(max_length=20)
   is_admin = models.BooleanField(default=False)

   class Meta:
       unique_together = ('email',)

class Bike(models.Model):
    name = models.CharField(max_length=100)
    model = models.CharField(max_length=100)
    color = models.CharField(max_length=50)
    location = models.CharField(max_length=100)
    available = models.BooleanField(default=True)
    price_per_hour = models.DecimalField(max_digits=6, decimal_places=2, validators=[MinValueValidator(0)])
    image_url = models.URLField(blank=True, null=True)

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
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    bike = models.ForeignKey(Bike, on_delete=models.CASCADE)
    rating = models.IntegerField(validators=[MinValueValidator(1), MaxValueValidator(5)])
    comment = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('user', 'bike')
        
   