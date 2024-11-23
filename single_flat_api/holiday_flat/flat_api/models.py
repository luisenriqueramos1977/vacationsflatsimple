# File: api/models.py
from django.db import models
from django.contrib.auth.models import User

class Location(models.Model):
    name = models.CharField(max_length=255)
    country = models.CharField(max_length=100)
    state = models.CharField(max_length=100)
    latitude = models.FloatField()
    longitude = models.FloatField()

    def __str__(self):
        return self.name

class Apartment(models.Model):
    apartment_name = models.CharField(max_length=255)
    price = models.DecimalField(max_digits=10, decimal_places=2)
    rooms = models.IntegerField()
    size = models.FloatField()
    facilities = models.JSONField()
    location = models.ForeignKey(Location, on_delete=models.CASCADE, related_name="apartments")

    def __str__(self):
        return self.apartment_name

class Owner(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    apartments = models.ManyToManyField(Apartment, related_name="owners")

    def __str__(self):
        return self.user.username

class Guest(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)

    def __str__(self):
        return self.user.username

class Review(models.Model):
    apartment = models.ForeignKey(Apartment, on_delete=models.CASCADE, related_name="reviews")
    created_at = models.DateTimeField(auto_now_add=True)
    value = models.IntegerField()
    comment = models.TextField()
    last_update = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"Review for {self.apartment.apartment_name}"

class Booking(models.Model):
    guest = models.ForeignKey(Guest, on_delete=models.CASCADE, related_name="bookings")
    apartment = models.ForeignKey(Apartment, on_delete=models.CASCADE, related_name="bookings")
    booking_date = models.DateField()

    def __str__(self):
        return f"{self.guest.user.username} - {self.apartment.apartment_name}"

