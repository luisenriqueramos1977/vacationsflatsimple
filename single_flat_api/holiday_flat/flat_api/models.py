# File: api/models.py
from django.db import models
from django.contrib.auth.models import User
from django.core.exceptions import ValidationError

class Location(models.Model):
    name = models.CharField(max_length=255)
    country = models.CharField(max_length=100)
    state = models.CharField(max_length=100)
    latitude = models.FloatField()
    longitude = models.FloatField()

    def __str__(self):
        return self.name

class Apartment(models.Model):
    apartment_name = models.CharField(max_length=255, blank=True)
    price = models.DecimalField(max_digits=10, decimal_places=2)
    rooms = models.IntegerField()
    size = models.FloatField()
    facilities = models.JSONField(blank=True)
    location = models.ForeignKey(Location, on_delete=models.CASCADE, related_name="apartments")

    def __str__(self):
        return self.apartment_name
    
class Picture(models.Model):
    apartment = models.ForeignKey('Apartment', on_delete=models.CASCADE, related_name='pictures')
    image = models.ImageField(upload_to='apartment_pictures/')
    format = models.CharField(max_length=50, help_text="Format of the image, e.g., JPEG, PNG")
    size = models.PositiveIntegerField(help_text="Size in bytes")
    
class Owner(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='owner_profile')

    def __str__(self):
        return self.user.username  # Display the owner's username

class Guest(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)

    def __str__(self):
        return self.user.username

class Review(models.Model):
    apartment = models.ForeignKey(Apartment, on_delete=models.CASCADE, related_name='reviews')
    guest = models.ForeignKey(Guest, on_delete=models.CASCADE, related_name='reviews')  # Ensure this line is present
    created_at = models.DateTimeField(auto_now_add=True)
    value = models.IntegerField()
    comment = models.TextField()
    last_update = models.DateTimeField(auto_now=True)

class Booking(models.Model):
    guest = models.ForeignKey(Guest, on_delete=models.CASCADE, related_name='bookings')
    apartment = models.ForeignKey(Apartment, on_delete=models.CASCADE, related_name='bookings')
    start_date = models.DateField()
    end_date = models.DateField()

    def clean(self):
        if self.end_date <= self.start_date:
            raise ValidationError("End date must be after start date.")

    def save(self, *args, **kwargs):
        self.clean()
        super().save(*args, **kwargs)
    

class Facility(models.Model):
    name = models.CharField(max_length=255)
    type = models.CharField(max_length=255)
    customer_weighting = models.IntegerField()
    logo = models.ImageField(upload_to='facility_logos/', null=True, blank=True)


