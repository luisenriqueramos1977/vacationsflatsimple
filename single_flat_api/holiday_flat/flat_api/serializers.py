from rest_framework import serializers
from .models import Apartment, Guest, Booking, FewoOwner

class FewoOwnerSerializer(serializers.ModelSerializer):
    class Meta:
        model = FewoOwner
        fields = '__all__'

class ApartmentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Apartment
        fields = '__all__'

class GuestSerializer(serializers.ModelSerializer):
    class Meta:
        model = Guest
        fields = '__all__'

class BookingSerializer(serializers.ModelSerializer):
    class Meta:
        model = Booking
        fields = '__all__'
