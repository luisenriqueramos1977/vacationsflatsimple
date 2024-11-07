from rest_framework import generics
from .models import Apartment, Guest, Booking, FewoOwner
from .serializers import ApartmentSerializer, GuestSerializer, BookingSerializer, FewoOwnerSerializer

# FewoOwner Views
class FewoOwnerListView(generics.ListAPIView):
    queryset = FewoOwner.objects.all()
    serializer_class = FewoOwnerSerializer

class FewoOwnerCreateView(generics.CreateAPIView):
    queryset = FewoOwner.objects.all()
    serializer_class = FewoOwnerSerializer

class FewoOwnerRetrieveUpdateDestroyView(generics.RetrieveUpdateDestroyAPIView):
    queryset = FewoOwner.objects.all()
    serializer_class = FewoOwnerSerializer

# Apartment Views
class ApartmentListView(generics.ListAPIView):
    queryset = Apartment.objects.all()
    serializer_class = ApartmentSerializer

class ApartmentCreateView(generics.CreateAPIView):
    queryset = Apartment.objects.all()
    serializer_class = ApartmentSerializer

class ApartmentRetrieveUpdateDestroyView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Apartment.objects.all()
    serializer_class = ApartmentSerializer

# Guest Views
class GuestListView(generics.ListAPIView):
    queryset = Guest.objects.all()
    serializer_class = GuestSerializer

class GuestCreateView(generics.CreateAPIView):
    queryset = Guest.objects.all()
    serializer_class = GuestSerializer

class GuestRetrieveUpdateDestroyView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Guest.objects.all()
    serializer_class = GuestSerializer

# Booking Views
class BookingListView(generics.ListAPIView):
    queryset = Booking.objects.all()
    serializer_class = BookingSerializer

class BookingCreateView(generics.CreateAPIView):
    queryset = Booking.objects.all()
    serializer_class = BookingSerializer

class BookingRetrieveUpdateDestroyView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Booking.objects.all()
    serializer_class = BookingSerializer
