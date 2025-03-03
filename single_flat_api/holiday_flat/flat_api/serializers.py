# File: api/serializers.py
from rest_framework import serializers
from .models import Location, Apartment, Review, Booking, Facility, Picture
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
    owner = serializers.PrimaryKeyRelatedField(
        queryset=User.objects.filter(groups__name="Owners"),  # ✅ Ensures only Owners can be selected
        write_only=True
    )

    class Meta:
        model = Apartment
        fields = [
            'id', 'apartment_name', 'price', 'currency', 'location', 'rooms', 'size', 'facilities', 'pictures', 'owner'
        ]

    def get_pictures(self, obj):
        """Retrieve pictures linked to this apartment."""
        pictures = Picture.objects.filter(apartment=obj)
        return [
            {
                "id": picture.id,
                "image": picture.image.url,
                "format": picture.format,
                "size_in_bytes": picture.size_in_bytes,
                "tags": picture.tags,
            }
            for picture in pictures
        ]

    def validate_apartment_name(self, value):
        """Allow updating with the same name but prevent duplicates when creating a new apartment."""
        request_method = self.context['request'].method  # Check if it's POST or PUT/PATCH
        apartment_id = self.instance.id if self.instance else None  # Get ID if updating

        # Check if an apartment with this name exists (excluding the current apartment)
        if Apartment.objects.filter(apartment_name=value).exclude(id=apartment_id).exists():
            raise serializers.ValidationError("An apartment with this name already exists.")

        return value

    def validate_owner(self, value):
        """Ensure the owner is a valid user in the 'Owners' group."""
        print(f"Validating owner: {value.username} (ID: {value.id})")  # Debug log
        if not value.groups.filter(name="Owners").exists():
            raise serializers.ValidationError("Only users in the 'Owners' group can own apartments.")
        return value  # Return the validated user object

    def create(self, validated_data):
        """Create an apartment after validating owner and unique name."""
        owner = validated_data.pop('owner')
        validated_data['owner'] = self.validate_owner(owner)  # Validate owner
        validated_data['apartment_name'] = self.validate_apartment_name(validated_data['apartment_name'])  # Validate name

        facilities = validated_data.pop('facilities', [])
        apartment = Apartment.objects.create(**validated_data)
        apartment.facilities.set(facilities)

        # Automatically assign pictures where `apartment` matches the new apartment instance
        Picture.objects.filter(apartment=apartment).update(apartment=apartment)

        return apartment

    def update(self, instance, validated_data):
        """Update an apartment while ensuring name uniqueness and valid owner."""
        if 'apartment_name' in validated_data:
            validated_data['apartment_name'] = self.validate_apartment_name(validated_data['apartment_name'])

        facilities = validated_data.pop('facilities', [])

        if 'owner' in validated_data:
            validated_data['owner'] = self.validate_owner(validated_data.pop('owner'))  # ✅ Validate new owner

        for attr, value in validated_data.items():
            setattr(instance, attr, value)

        instance.save()
        instance.facilities.set(facilities)

        # Ensure pictures are properly linked
        Picture.objects.filter(apartment=instance).update(apartment=instance)

        return instance



from django.contrib.auth.models import User, Group
from rest_framework import serializers

class OwnerSerializer(serializers.ModelSerializer):
    username = serializers.CharField()  # Keep this for readability
    email = serializers.EmailField()
    password = serializers.CharField(write_only=True, min_length=8, required=False)  # ✅ Password is optional in GET requests

    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'password','first_name','last_name','groups']

    def create(self, validated_data):
        """Ensure the user is created and added to the 'Owners' group."""
        owners_group, created = Group.objects.get_or_create(name="Owners")

        user = User.objects.create_user(
            username=validated_data['username'],
            email=validated_data['email'],
            password=validated_data['password']
        )

        user.groups.add(owners_group)
        return user  # Return the created User object


class GuestSerializer(serializers.ModelSerializer):
    username = serializers.CharField()
    email = serializers.EmailField()
    password = serializers.CharField(write_only=True, min_length=8, required=False)

    class Meta:
        model = User  # Use Django's default User model
        fields = ['id', 'username', 'email', 'password','first_name','last_name','groups']

    def create(self, validated_data):
        """Ensure the user is created and added to the 'Guests' group."""
        # Ensure the "Guests" group exists
        guests_group, created = Group.objects.get_or_create(name="Guests")

        # Create the user
        user = User.objects.create_user(
            username=validated_data['username'],
            email=validated_data['email'],
            password=validated_data['password']
        )

        # Add the user to the 'Guests' group
        user.groups.add(guests_group)

        return user  # Return the created User object

class ReviewSerializer(serializers.ModelSerializer):
    guest = serializers.StringRelatedField(read_only=True)  # Display guest username

    class Meta:
        model = Review
        fields = '__all__'

    def create(self, validated_data):
        """Ensure the user belongs to the 'Guests' group before creating a review."""
        user = self.context['request'].user  # Get the logged-in user

        # Check if the user is in the 'Guests' group
        if not user.groups.filter(name="Guests").exists():
            raise serializers.ValidationError({"error": "Only guests can add reviews."})

        # Create the review with the authenticated user as the guest
        validated_data['guest'] = user
        return Review.objects.create(**validated_data)



class BookingSerializer(serializers.ModelSerializer):
    guest = serializers.PrimaryKeyRelatedField(
        queryset=User.objects.filter(groups__name="Guests"),  # ✅ Only users in Guests group
        write_only=True
    )
    guest_id = serializers.IntegerField(source='guest.id', read_only=True)

    class Meta:
        model = Booking
        fields = ['id', 'guest', 'guest_id', 'apartment', 'start_date', 'end_date']

    def create(self, validated_data):
        """Ensure the guest belongs to the 'Guests' group before creating a booking."""
        user = validated_data.pop("guest")  # Get the User instance

        # Check if the user is in the "Guests" group
        if not user.groups.filter(name="Guests").exists():
            raise serializers.ValidationError({"error": "Only users in the 'Guests' group can make a booking."})

        # Assign the user as the guest
        validated_data["guest"] = user

        return super().create(validated_data)


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
        fields = ['id', 'image', 'format', 'size_in_bytes', 'apartment', 'apartment_detail','tags']

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