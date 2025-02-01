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
    owner = models.ForeignKey(User, on_delete=models.CASCADE, related_name='apartments', null=True, blank=True)

    def __str__(self):
        return self.apartment_name

    def clean(self):
        """Ensure the apartment has an owner who belongs to the 'owners' group before saving."""
        if not self.owner:
            raise ValidationError("An owner must be assigned to this apartment.")
        
        if not self.owner.groups.filter(name="Owners").exists():
            raise ValidationError("The assigned user must be in the 'Owners' group.")

    def save(self, *args, **kwargs):
        """Validate before saving."""
        self.clean()
        super().save(*args, **kwargs)

    @property
    def price_with_currency(self):
        """Returns the price along with its currency unit."""
        return f"{self.price} {self.currency.code if self.currency else ''}"


class Picture(models.Model):
    image = models.ImageField(upload_to='apartment_pictures/')
    size_in_bytes = models.PositiveIntegerField()
    format = models.CharField(max_length=50, help_text="Format of the image, e.g., JPEG, PNG")
    tags = models.JSONField(default=list, help_text="List of topics related to the picture")  # Changed to JSONField
    apartment = models.ForeignKey(
        'Apartment', 
        on_delete=models.CASCADE, 
        related_name='apartment_pictures',  # Changed related_name to avoid conflict
        null=True, 
        blank=True,
        help_text="The apartment this picture belongs to."
    )

    def __str__(self):
        return f"{self.format} - {self.size_in_bytes} bytes"


class Review(models.Model):
    apartment = models.ForeignKey(Apartment, on_delete=models.CASCADE, related_name='reviews')
    guest = models.ForeignKey(User, on_delete=models.CASCADE, related_name='reviews')  # Changed to User
    created_at = models.DateTimeField(auto_now_add=True)
    value = models.IntegerField()
    comment = models.TextField()
    last_update = models.DateTimeField(auto_now=True)

    def clean(self):
        """
        Ensure the user posting the review belongs to the 'guests' group.
        """
        if not self.guest.groups.filter(name="Guests").exists():
            raise ValidationError("Only users in the 'guests' group can leave reviews.")

    def save(self, *args, **kwargs):
        """
        Perform the clean method before saving to enforce the rule.
        """
        self.clean()
        super().save(*args, **kwargs)

    def __str__(self):
        return f"Review by {self.guest.username} on {self.apartment.apartment_name}"


class Booking(models.Model):
    guest = models.ForeignKey(User, on_delete=models.CASCADE, related_name='bookings')  # Changed to User
    apartment = models.ForeignKey(Apartment, on_delete=models.CASCADE, related_name='bookings')
    start_date = models.DateField()
    end_date = models.DateField()

    def clean(self):
        """
        Validate:
        1. End date must be after start date.
        2. The user must belong to the "guests" group.
        """
        if self.end_date <= self.start_date:
            raise ValidationError("End date must be after start date.")

        if not self.guest.groups.filter(name="Guests").exists():
            raise ValidationError("Only users in the 'guests' group can make bookings.")

    def save(self, *args, **kwargs):
        """
        Perform validation before saving.
        """
        self.clean()
        super().save(*args, **kwargs)

    @property
    def booking_price(self):
        """Calculate booking price based on the number of days and apartment price."""
        num_days = (self.end_date - self.start_date).days
        return num_days * self.apartment.price if self.apartment and self.apartment.price else 0

    def __str__(self):
        return f"Booking by {self.guest.username} for {self.apartment.apartment_name} from {self.start_date} to {self.end_date}"
    

class Facility(models.Model):
    name = models.CharField(max_length=255)
    type = models.CharField(max_length=255)
    customer_weighting = models.IntegerField()
    logo = models.ImageField(upload_to='facility_logos/', null=True, blank=True)
    attribution = models.CharField(max_length=255, null=True, blank=True)  # Allow null and blank values


