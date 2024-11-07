from django.db import models

class FewoOwner(models.Model):
    firstname = models.CharField(max_length=50)
    lastname = models.CharField(max_length=50)
    phonenumber = models.CharField(max_length=15)
    address = models.CharField(max_length=255)
    email = models.EmailField(unique=True)
    description = models.TextField(null=True, blank=True)

    def __str__(self):
        return f"{self.firstname} {self.lastname} ({self.email})"

class Apartment(models.Model):
    STATUS_CHOICES = [
        ('not_booked', 'Not Booked'),
        ('booked', 'Booked'),
        ('occupied', 'Occupied')
    ]
    name = models.CharField(max_length=100, unique=True)
    description = models.TextField()
    dailyprice = models.DecimalField(max_digits=10, decimal_places=2)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='not_booked')
    fewo_owner = models.ForeignKey(FewoOwner, on_delete=models.CASCADE, related_name='apartments')

    def __str__(self):
        return f"{self.name} - {self.status}"

class Guest(models.Model):
    firstname = models.CharField(max_length=50)
    lastname = models.CharField(max_length=50)
    phonenumber = models.CharField(max_length=15)
    address = models.CharField(max_length=255)
    email = models.EmailField(unique=True)
    description = models.TextField(null=True, blank=True)

    def __str__(self):
        return f"{self.firstname} {self.lastname} ({self.email})"

class Booking(models.Model):
    name = models.CharField(max_length=100)
    description = models.TextField()
    posted_date = models.DateField(auto_now_add=True)
    start_date = models.DateField()
    end_date = models.DateField()
    apartment = models.ForeignKey(Apartment, on_delete=models.CASCADE, related_name='bookings')
    guest = models.ForeignKey(Guest, on_delete=models.CASCADE, related_name='bookings')

    class Meta:
        constraints = [
            models.UniqueConstraint(fields=['apartment', 'start_date', 'end_date'], name='unique_apartment_booking')
        ]

    def __str__(self):
        return f"Booking for {self.apartment} by {self.guest} from {self.start_date} to {self.end_date}"
