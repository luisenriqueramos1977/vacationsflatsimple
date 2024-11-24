# File: api/views.py
from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework import viewsets, mixins
from rest_framework.permissions import IsAuthenticated, AllowAny
from .models import Location, Apartment, Owner, Guest, Review, Booking, Facility, Picture
from .serializers import (
    LocationSerializer,
    ApartmentSerializer,
    OwnerSerializer,
    GuestSerializer,
    ReviewSerializer,
    BookingSerializer,
    FacilitySerializer,
    PictureSerializer,
    PublicBookingSerializer
)
from rest_framework.exceptions import PermissionDenied  # Add this import
from rest_framework.generics import ListAPIView

def home(request):
    return render(request, 'home.html')

def api_page(request):
    return render(request, 'api.html')

class LocationViewSet(viewsets.ModelViewSet):
    queryset = Location.objects.all()
    serializer_class = LocationSerializer
    permission_classes = [IsAuthenticated]

class ApartmentViewSet(viewsets.ModelViewSet):
    queryset = Apartment.objects.all()
    serializer_class = ApartmentSerializer

    def get_permissions(self):
        if self.action == 'list':
            return [AllowAny()]
        return [IsAuthenticated()]

class OwnerViewSet(viewsets.ModelViewSet):
    queryset = Owner.objects.all()
    serializer_class = OwnerSerializer
    permission_classes = [IsAuthenticated]

class GuestViewSet(viewsets.ModelViewSet):
    queryset = Guest.objects.all()
    serializer_class = GuestSerializer
    permission_classes = [IsAuthenticated]

# File: api/views.py

class ReviewViewSet(viewsets.ModelViewSet):
    queryset = Review.objects.all()
    serializer_class = ReviewSerializer

    def get_permissions(self):
        """
        Define permissions based on the action.
        """
        if self.action in ['list', 'retrieve']:
            return [AllowAny()]  # Non-authenticated users can view reviews
        return [IsAuthenticated()]  # Authenticated users for other actions

    def perform_create(self, serializer):
        """
        Ensure only guests can create reviews.
        """
        user = self.request.user
        if hasattr(user, 'guest_profile'):  # Check if the user is a Guest
            serializer.save(guest=user.guest_profile)
        else:
            raise PermissionDenied("Only guests can create reviews.")

    def perform_update(self, serializer):
        """
        Ensure only the guest who created the review or the owner of the apartment can update it.
        """
        user = self.request.user
        review = self.get_object()

        # Check if the user is the guest who created the review
        if hasattr(user, 'guest_profile') and review.guest == user.guest_profile:
            serializer.save()
        # Check if the user is the owner of the apartment
        elif hasattr(user, 'owner_profile') and review.apartment.location.owner == user.owner_profile:
            serializer.save()
        else:
            raise PermissionDenied("You do not have permission to update this review.")

    def perform_destroy(self, instance):
        """
        Ensure only the guest who created the review or the owner of the apartment can delete it.
        """
        user = self.request.user

        # Check if the user is the guest who created the review
        if hasattr(user, 'guest_profile') and instance.guest == user.guest_profile:
            instance.delete()
        # Check if the user is the owner of the apartment
        elif hasattr(user, 'owner_profile') and instance.apartment.location.owner == user.owner_profile:
            instance.delete()
        else:
            raise PermissionDenied("You do not have permission to delete this review.")


class BookingViewSet(viewsets.ModelViewSet):
    queryset = Booking.objects.all()
    serializer_class = BookingSerializer
    permission_classes = [IsAuthenticated]

class FacilityViewSet(viewsets.ModelViewSet):
    queryset = Facility.objects.all()
    serializer_class = FacilitySerializer

    def get_permissions(self):
        """
        Override the get_permissions method to apply custom permissions.
        Only owners can create, update, or delete facilities.
        """
        if self.action in ['create', 'update', 'destroy']:
            # Ensure the user is authenticated
            permission_classes = [IsAuthenticated]
            if not self.request.user.is_authenticated:
                raise PermissionDenied("Authentication required")
            return permission_classes
        # Allow anyone to list or retrieve facilities
        return [IsAuthenticated()]

    def perform_create(self, serializer):
        """
        Override to ensure that the authenticated user is the owner of the apartment
        before allowing them to create a facility.
        """
        apartment_id = self.request.data.get('apartment')  # Get apartment from the request data
        if not apartment_id:
            raise PermissionDenied("Apartment is required to attach facility.")
        
        try:
            apartment = Apartment.objects.get(id=apartment_id)
        except Apartment.DoesNotExist:
            raise PermissionDenied("Apartment does not exist.")
        
        # Check if the user is the owner of the apartment
        if apartment.location.owner.user != self.request.user:
            raise PermissionDenied("You must be the owner of this apartment to add a facility.")
        
        # Proceed to save the facility
        serializer.save()

    def perform_update(self, serializer):
        """
        Override to ensure that the authenticated user is the owner of the apartment
        before allowing them to update the facility.
        """
        apartment_id = self.request.data.get('apartment')  # Get apartment from the request data
        if not apartment_id:
            raise PermissionDenied("Apartment is required to update facility.")
        
        try:
            apartment = Apartment.objects.get(id=apartment_id)
        except Apartment.DoesNotExist:
            raise PermissionDenied("Apartment does not exist.")
        
        # Check if the user is the owner of the apartment
        if apartment.location.owner.user != self.request.user:
            raise PermissionDenied("You must be the owner of this apartment to update a facility.")
        
        # Proceed to save the facility
        serializer.save()

    def perform_destroy(self, instance):
        """
        Override to ensure that the authenticated user is the owner of the apartment
        before allowing them to delete the facility.
        """
        apartment = instance.apartment  # Get the apartment associated with the facility
        
        # Check if the user is the owner of the apartment
        if apartment.location.owner.user != self.request.user:
            raise PermissionDenied("You must be the owner of this apartment to delete a facility.")
        
        # Proceed to delete the facility
        instance.delete()
        
class ApartmentBookingsListView(ListAPIView):
    """
    List bookings for a specific apartment, excluding guest details.
    """
    serializer_class = PublicBookingSerializer
    permission_classes = [AllowAny]

    def get_queryset(self):
        apartment_id = self.kwargs['apartment_id']
        return Booking.objects.filter(apartment__id=apartment_id)

