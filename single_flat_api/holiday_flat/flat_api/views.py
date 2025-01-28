# File: api/views.py
from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework import viewsets, mixins,  generics
from rest_framework.permissions import IsAuthenticated, AllowAny, IsAuthenticatedOrReadOnly
from .models import Location, Apartment, Owner, Guest, Review, Booking, Facility, Picture, Currency
from .serializers import (
    LocationSerializer,
    ApartmentSerializer,
    OwnerSerializer,
    GuestSerializer,
    ReviewSerializer,
    BookingSerializer,
    FacilitySerializer,
    PictureSerializer,
    PublicBookingSerializer,
    CurrencySerializer
)
from rest_framework.exceptions import PermissionDenied  # Add this import
from rest_framework.generics import ListAPIView
#added in 20.12.2024
from django.contrib.auth.models import Group
from django.utils.dateparse import parse_date
from django.db.models import Q
#added on 22.12.2022
from django.http import JsonResponse
from django.shortcuts import render
from django.contrib.auth.models import User
from rest_framework.exceptions import NotFound




def home(request):
    return render(request, 'home.html')

def api_page(request):
    return render(request, 'api.html')

class LocationViewSet(viewsets.ModelViewSet):
    queryset = Location.objects.all()
    serializer_class = LocationSerializer
    #permission_classes = [IsAuthenticated]

class ApartmentViewSet(viewsets.ModelViewSet):
    queryset = Apartment.objects.all()
    serializer_class = ApartmentSerializer
    '''
    def get_permissions(self):
        if self.action == 'list':
            return [AllowAny()]
        return [IsAuthenticated()]
    '''

#added on 25.12.2024
class PictureViewSet(viewsets.ModelViewSet):
    """
    ViewSet for managing pictures.
    """
    queryset = Picture.objects.all()
    serializer_class = PictureSerializer
    #permission_classes = [IsAuthenticatedOrReadOnly]  # Read for anyone, write for authenticated users


class OwnerViewSet(viewsets.ModelViewSet):
    queryset = Owner.objects.all()
    serializer_class = OwnerSerializer
    #permission_classes = [IsAuthenticated]

class OwnerGroupViewSet(viewsets.ViewSet):
    """
    ViewSet for managing Owners group members.
    """

    #permission_classes = [IsAuthenticated]

    def list(self, request):
        """
        List all users in the Owners group.
        """
        try:
            owners_group = Group.objects.get(name="Owners")
            owners = owners_group.user_set.all()
            data = [{"id": user.id, "username": user.username} for user in owners]
            return Response(data)
        except Group.DoesNotExist:
            raise NotFound(detail="The Owners group does not exist.")

    def create(self, request):
        """
        Create a new user and add them to the Owners group.
        """
        try:
            # Ensure the Owners group exists
            owners_group = Group.objects.get(name="Owners")
        except Group.DoesNotExist:
            return Response(
                {"error": "The Owners group does not exist."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        # Validate required fields in the POST message
        required_fields = ["username", "password", "email"]
        for field in required_fields:
            if field not in request.data:
                return Response(
                    {"error": f"{field} is required."},
                    status=status.HTTP_400_BAD_REQUEST,
                )

        # Extract fields from the request data
        username = request.data["username"]
        password = request.data["password"]
        email = request.data["email"]

        # Create the user
        user = User(username=username, email=email)
        user.set_password(password)  # Securely set the password
        user.save()

        # Add the user to the Owners group
        owners_group.user_set.add(user)

        # Return a success response
        return Response(
            {
                "message": f"User {username} created and added to Owners group.",
                "user": {"id": user.id, "username": user.username, "email": user.email},
            },
            status=status.HTTP_201_CREATED,
        )


    def retrieve(self, request, pk=None):
        """
        Retrieve a specific user in the Owners group.
        """
        try:
            user = User.objects.get(pk=pk)
            if not user.groups.filter(name="Owners").exists():
                return Response(
                    {"error": "This user is not part of the Owners group."},
                    status=status.HTTP_404_NOT_FOUND,
                )
            return Response({"id": user.id, "username": user.username})
        except User.DoesNotExist:
            return Response({"error": "User not found."}, status=status.HTTP_404_NOT_FOUND)

    def update(self, request, pk=None):
        """
        Update a specific user in the Owners group.
        """
        try:
            user = User.objects.get(pk=pk)
            serializer = UserSerializer(user, data=request.data, partial=True)
            if serializer.is_valid():
                serializer.save()
                return Response({"message": "User updated successfully."})
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        except User.DoesNotExist:
            return Response({"error": "User not found."}, status=status.HTTP_404_NOT_FOUND)

    def destroy(self, request, pk=None):
        """
        Remove a specific user from the Owners group.
        """
        try:
            user = User.objects.get(pk=pk)
            if not user.groups.filter(name="Owners").exists():
                return Response(
                    {"error": "This user is not part of the Owners group."},
                    status=status.HTTP_404_NOT_FOUND,
                )
            user.delete()
            return Response({"message": "User deleted successfully."}, status=status.HTTP_204_NO_CONTENT)
        except User.DoesNotExist:
            return Response({"error": "User not found."}, status=status.HTTP_404_NOT_FOUND)
        

#begings added on 20.12.2024
class OwnerListCreateView(generics.ListCreateAPIView):
    queryset = Owner.objects.all()
    serializer_class = OwnerSerializer

    def perform_create(self, serializer):
        owner = serializer.save()
        # Assign the user to the Owners group
        owners_group, created = Group.objects.get_or_create(name="Owners")
        owner.user.groups.add(owners_group)

class OwnerGroupListView(APIView):
    def get(self, request):
        try:
            owners_group = Group.objects.get(name="Owners")
            owners = owners_group.user_set.all()
            data = [{"id": user.id, "username": user.username} for user in owners]
            return Response(data)
        except Group.DoesNotExist:
            return JsonResponse(
                {'error': f"The group Owners does not exist."},
                status=status.HTTP_404_NOT_FOUND
            )
    
###ends added 20.12.2024
class GuestViewSet(viewsets.ModelViewSet):
    queryset = Guest.objects.all()
    serializer_class = GuestSerializer
    #permission_classes = [IsAuthenticated]

#begins added on 20.12.2024
class GuestListCreateView(generics.ListCreateAPIView):
    queryset = Guest.objects.all()
    serializer_class = GuestSerializer

    def perform_create(self, serializer):
        guest = serializer.save()
        # Assign the user to the Guests group
        guests_group, created = Group.objects.get_or_create(name="Guests")
        guest.user.groups.add(guests_group)

class GuestGroupListView(APIView):
    def get(self, request):
        try:
            guests_group = Group.objects.get(name="Guests")
            guests = guests_group.user_set.all()
            data = [{"id": user.id, "username": user.username} for user in guests]
            return Response(data)
        except Group.DoesNotExist:
            return JsonResponse(
                {'error': f"The group Guests does not exist."},
                status=status.HTTP_404_NOT_FOUND
            )
    
#ends added 20.12.2024
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
    #permission_classes = [IsAuthenticated]

class FacilityViewSet(viewsets.ModelViewSet):
    queryset = Facility.objects.all()
    serializer_class = FacilitySerializer
    #permission_classes = [IsAuthenticated]  # Use a list here
    #an user is required
    #def perform_create(self, serializer):
    #    serializer.save(owner=self.request.user.owner_profile)
        
class ApartmentBookingsListView(ListAPIView):
    """
    List bookings for a specific apartment, excluding guest details.
    """
    serializer_class = PublicBookingSerializer
    permission_classes = [AllowAny]

    def get_queryset(self):
        apartment_id = self.kwargs['apartment_id']
        return Booking.objects.filter(apartment__id=apartment_id)
    
#added on 21.12.2024

class ApartmentBookingsView(APIView):
    def get(self, request, apartment_id):
        start_date = request.query_params.get('start_date')
        end_date = request.query_params.get('end_date')

        if not start_date or not end_date:
            return Response(
                {"error": "Please provide both 'start_date' and 'end_date' in YYYY-MM-DD format."},
                status=status.HTTP_400_BAD_REQUEST
            )

        try:
            start_date = parse_date(start_date)
            end_date = parse_date(end_date)

            if not start_date or not end_date:
                raise ValueError("Invalid date format")

        except ValueError:
            return Response(
                {"error": "Invalid date format. Please use YYYY-MM-DD."},
                status=status.HTTP_400_BAD_REQUEST
            )

        # Filter bookings for the specified apartment within the given period
        bookings = Booking.objects.filter(
            apartment_id=apartment_id,
            start_date__lte=end_date,
            end_date__gte=start_date
        )

        serializer = BookingSerializer(bookings, many=True)

        return Response(serializer.data)
#added on 21.12.2024
    
class CurrencyViewSet(viewsets.ModelViewSet):
    queryset = Currency.objects.all()
    serializer_class = CurrencySerializer
    #permission_classes = [IsAuthenticated]  #grant user is authenticated to do crud
    #grant user is owner to create currencies
    #def perform_create(self, serializer):
    #    serializer.save(owner=self.request.user.owner_profile)    





#filter apartment per booking date, add on 20.12.2024
class AvailableApartmentsView(APIView):
    def get(self, request):
        start_date = request.query_params.get('start_date')
        end_date = request.query_params.get('end_date')

        if not start_date or not end_date:
            return Response(
                {"error": "Please provide both 'start_date' and 'end_date' in YYYY-MM-DD format."},
                status=status.HTTP_400_BAD_REQUEST
            )

        try:
            start_date = parse_date(start_date)
            end_date = parse_date(end_date)

            if not start_date or not end_date:
                raise ValueError("Invalid date format")

        except ValueError:
            return Response(
                {"error": "Invalid date format. Please use YYYY-MM-DD."},
                status=status.HTTP_400_BAD_REQUEST
            )

        # Get all apartments that do not have bookings overlapping the given period
        overlapping_bookings = Booking.objects.filter(
            Q(start_date__lte=end_date) & Q(end_date__gte=start_date)
        )

        booked_apartment_ids = overlapping_bookings.values_list('apartment_id', flat=True)

        available_apartments = Apartment.objects.exclude(id__in=booked_apartment_ids)

        serializer = ApartmentSerializer(available_apartments, many=True)

        return Response(serializer.data)

#added on 22.12.2024
def custom_404_view(request, exception):
    return render(request, '404.html', {'error': str(exception)}, status=404)




