# File: api/serializers.py
from rest_framework import serializers
from .models import Location, Apartment, Owner, Guest, Review, Booking, Facility, Picture
from django.contrib.auth.models import Group, User
import logging
from django.core.exceptions import ObjectDoesNotExist

logger = logging.getLogger(__name__)

class LocationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Location
        fields = '__all__'

class ApartmentSerializer(serializers.ModelSerializer):
    pictures = serializers.SerializerMethodField()

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
            'pictures',
            'owner'
        ]

    def get_pictures(self, obj):
        """
        Retrieve pictures linked to this apartment based on the `apartment` ForeignKey.
        """
        pictures = Picture.objects.filter(apartment=obj)
        return [
            {
                "id": picture.id,
                "image": picture.image.url,
                "format": picture.format,
                "size_in_bytes": picture.size_in_bytes,
            }
            for picture in pictures
        ]

    def create(self, validated_data):
        facilities = validated_data.pop('facilities', [])
        apartment = Apartment.objects.create(**validated_data)
        apartment.facilities.set(facilities)

        # Automatically assign pictures where `apartment` matches the new apartment instance
        Picture.objects.filter(apartment=apartment).update(apartment=apartment)

        return apartment

    def update(self, instance, validated_data):
        facilities = validated_data.pop('facilities', [])

        for attr, value in validated_data.items():
            setattr(instance, attr, value)

        instance.save()
        instance.facilities.set(facilities)

        # Ensure pictures are properly linked
        Picture.objects.filter(apartment=instance).update(apartment=instance)

        return instance

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
    owner = serializers.PrimaryKeyRelatedField(
        queryset=User.objects.filter(groups__name="Owners"),  # Only include users in "Owners" group
        required=True
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
            'pictures',
            'owner'  # Include owner in fields
        ]

    def create(self, validated_data):
        facilities = validated_data.pop('facilities', [])
        pictures = validated_data.pop('pictures', [])
        owner1 = validated_data.pop('owner')  # Extract owner from validated data
        owner = Owner.objects.create(user=owner1)
        apartment = Apartment.objects.create(owner=owner, **validated_data)

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
'''
# serializers.py 


class OwnerSerializer(serializers.ModelSerializer):
    username = serializers.CharField(write_only=True)
    email = serializers.EmailField(write_only=True)
    password = serializers.CharField(write_only=True, min_length=8)

    class Meta:
        model = Owner
        fields = ['id', 'username', 'email', 'password']

    def create(self, validated_data):
        # Check if the "Owners" group exists
        try:
            owners_group = Group.objects.get(name="Owners")
        except Group.DoesNotExist:
            raise serializers.ValidationError({"group_error": "The 'Owners' group does not exist."})

        # Create the user
        username = validated_data['username']
        email = validated_data['email']
        password = validated_data['password']
        user = User.objects.create_user(username=username, email=email, password=password)

        # Add the user to the "Owners" group
        user.groups.add(owners_group)

        # Create the owner profile
        owner = Owner.objects.create(user=user)

        return owner


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
    apartment = serializers.IntegerField(write_only=True)  # Accepts apartment ID during write operations
    apartment_detail = serializers.PrimaryKeyRelatedField(
        read_only=True, source='apartment'
    )  # Shows the apartment details in read operations

    class Meta:
        model = Picture
        fields = ['id', 'image', 'format', 'size_in_bytes', 'apartment', 'apartment_detail']

    def validate_apartment(self, value):
        """
        Validate that the provided apartment ID corresponds to an existing apartment.
        """
        if not Apartment.objects.filter(pk=value).exists():
            raise serializers.ValidationError(f"Apartment with ID {value} does not exist.")
        return value

    def create(self, validated_data):
        """
        Override the create method to properly assign the apartment instance.
        """
        apartment_id = validated_data.pop('apartment')  # Extract apartment ID
        validated_data['apartment'] = Apartment.objects.get(pk=apartment_id)  # Get Apartment instance
        return super().create(validated_data)