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
        fields = ['image', 'format', 'size_in_bytes']

'''
class ApartmentSerializer(serializers.ModelSerializer):
    location = serializers.PrimaryKeyRelatedField(
        queryset=Location.objects.all(),  # Ensures the location must exist in the database
    )
    pictures = PictureSerializer(many=True, read_only=True)
    price_with_currency = serializers.ReadOnlyField()

    class Meta:
        model = Apartment
        fields = '__all__'
'''

class ApartmentSerializer(serializers.ModelSerializer):
    facilities = serializers.PrimaryKeyRelatedField(
        queryset=Facility.objects.all(),
        many=True
    )
    pictures = serializers.PrimaryKeyRelatedField(
        queryset=Picture.objects.all(),
        many=True
    )

    class Meta:
        model = Apartment
        fields = [
            'id',
            'apartment_name',
            'price',
            'currency',
            'location',
            'rooms',
            'size',
            'facilities',
            'pictures'
        ]

    def create(self, validated_data):
        facilities = validated_data.pop('facilities', [])
        pictures = validated_data.pop('pictures', [])
        apartment = Apartment.objects.create(**validated_data)

        # Assign Many-to-Many relationships
        apartment.facilities.set(facilities)
        apartment.pictures.set(pictures)
        return apartment

    def update(self, instance, validated_data):
        facilities = validated_data.pop('facilities', [])
        pictures = validated_data.pop('pictures', [])
        
        # Update instance fields
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()

        # Update Many-to-Many relationships
        instance.facilities.set(facilities)
        instance.pictures.set(pictures)
        return instance
    
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

class PublicBookingSerializer(serializers.ModelSerializer):
    class Meta:
        model = Booking
        fields = ['id', 'apartment', 'start_date', 'end_date']  # Exclude guest

class FacilitySerializer(serializers.ModelSerializer):
    class Meta:
        model = Facility
        fields = '__all__'

from .models import Currency

class CurrencySerializer(serializers.ModelSerializer):
    class Meta:
        model = Currency
        fields = '__all__'

class PictureSerializer(serializers.ModelSerializer):
    class Meta:
        model = Picture
        fields = ['id','image', 'format', 'size_in_bytes']

