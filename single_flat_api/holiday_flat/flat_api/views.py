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
)
from rest_framework.exceptions import PermissionDenied  # Add this import

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

    def get_queryset(self):
        """
        Return facilities accessible to the current user.
        If the user is an owner, they can view all facilities.
        """
        user = self.request.user
        if hasattr(user, 'owner_profile'):  # Check if the user has an Owner profile
            return Facility.objects.all()  # Owners can access all facilities
        return Facility.objects.none()  # Non-owners cannot access facilities

    def perform_create(self, serializer):
        """
        Set the owner when creating a facility.
        """
        user = self.request.user
        if hasattr(user, 'owner_profile'):  # Ensure the user is an Owner
            serializer.save()

    def perform_update(self, serializer):
        """
        Ensure only owners can update facilities.
        """
        user = self.request.user
        if hasattr(user, 'owner_profile'):  # Check if the user is an Owner
            serializer.save()

    def perform_destroy(self, instance):
        """
        Ensure only owners can delete facilities.
        """
        user = self.request.user
        if hasattr(user, 'owner_profile'):  # Ensure the user is an Owner
            instance.delete()

