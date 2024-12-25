# File: api/models.py
from django.db import models
from django.contrib.auth.models import User
from django.core.exceptions import ValidationError

class Currency(models.Model):
    name = models.CharField(max_length=50, unique=True)
    symbol = models.CharField(max_length=5)
    code = models.CharField(max_length=10)  # Example: USD, EUR
    exchange_rate_to_usd = models.DecimalField(max_digits=10, decimal_places=4)

    def __str__(self):
        return f"{self.name} ({self.symbol})"

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
    currency = models.ForeignKey('Currency', on_delete=models.SET_NULL, null=True, related_name='apartments')
    location = models.ForeignKey('Location', on_delete=models.SET_NULL, null=True, related_name='apartments')
    rooms = models.IntegerField()
    size = models.FloatField()
    facilities = models.ManyToManyField('Facility', related_name='apartments')
    pictures = models.ManyToManyField('Picture', related_name='apartment_pictures', blank=True)

    def __str__(self):
        return self.apartment_name
    
    @property
    def price_with_currency(self):
        """Returns the price along with its currency unit."""
        return f"{self.price} {self.currency.code if self.currency else ''}"

class Picture(models.Model):
    image = models.ImageField(upload_to='apartment_pictures/')
    size_in_bytes = models.PositiveIntegerField()
    format = models.CharField(max_length=50, help_text="Format of the image, e.g., JPEG, PNG")

    def __str__(self):
        return f"{self.format} - {self.size_in_bytes} bytes"



class Owner(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='owner_profile')

    def __str__(self):
        return self.user.username  # Display the owner's username

class Guest(models.Model):
    firstname = models.CharField(max_length=50)
    lastname = models.CharField(max_length=50)
    phonenumber = models.CharField(max_length=15)
    address = models.CharField(max_length=255)
    email = models.EmailField()
    description = models.TextField(null=True, blank=True)

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
    attribution = models.CharField(max_length=255, null=True, blank=True)  # Allow null and blank values


