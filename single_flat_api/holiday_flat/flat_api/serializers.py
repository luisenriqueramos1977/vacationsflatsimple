# File: api/serializers.py
from rest_framework import serializers
from .models import Location, Apartment, Owner, Guest, Review, Booking, Facility, Picture

class LocationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Location
        fields = '__all__'

class PictureSerializer(serializers.ModelSerializer):
    class Meta:
        model = Picture
        fields = ['image', 'format', 'size']

class ApartmentSerializer(serializers.ModelSerializer):
    location = LocationSerializer()
    pictures = PictureSerializer(many=True, read_only=True)

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
    guest = serializers.StringRelatedField(read_only=True)  # Guest's username or related representation

    class Meta:
        model = Review
        fields = '__all__'

class BookingSerializer(serializers.ModelSerializer):
    class Meta:
        model = Booking
        fields = '__all__'

class FacilitySerializer(serializers.ModelSerializer):
    class Meta:
        model = Facility
        fields = '__all__'
