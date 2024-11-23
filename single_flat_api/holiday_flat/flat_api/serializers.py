# File: api/serializers.py
from rest_framework import serializers
from .models import Location, Apartment, Owner, Guest, Review, Booking

class LocationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Location
        fields = '__all__'

class ApartmentSerializer(serializers.ModelSerializer):
    location = LocationSerializer()

    class Meta:
        model = Apartment
        fields = '__all__'

class OwnerSerializer(serializers.ModelSerializer):
    apartments = ApartmentSerializer(many=True, read_only=True)

    class Meta:
        model = Owner
        fields = ['user', 'apartments']

class GuestSerializer(serializers.ModelSerializer):
    class Meta:
        model = Guest
        fields = ['user']

class ReviewSerializer(serializers.ModelSerializer):
    class Meta:
        model = Review
        fields = '__all__'

class BookingSerializer(serializers.ModelSerializer):
    class Meta:
        model = Booking
        fields = '__all__'
