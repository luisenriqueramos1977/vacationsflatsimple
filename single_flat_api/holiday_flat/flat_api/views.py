# File: api/views.py
from rest_framework.decorators import api_view, permission_classes
from rest_framework.authtoken.models import Token
from django.contrib.auth import authenticate
from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework import viewsets, mixins,  generics
from rest_framework.permissions import IsAuthenticated, AllowAny, IsAuthenticatedOrReadOnly
from .models import Location, Apartment, Review, Booking, Facility, Picture, Currency
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
from django.contrib.auth.models import Group, User
from django.utils.dateparse import parse_date
from django.db.models import Q
#added on 22.12.2022
from django.http import JsonResponse
from django.shortcuts import render
from django.contrib.auth.models import User
from rest_framework.exceptions import NotFound
from django.core.mail import send_mail
from django_filters.rest_framework import DjangoFilterBackend




def home(request):
    return render(request, 'home.html')

def api_page(request):
    return render(request, 'api.html')

from rest_framework.decorators import action

class LocationViewSet(viewsets.ModelViewSet):
    queryset = Location.objects.all()
    serializer_class = LocationSerializer
    # Override get_queryset to filter by name if provided
    def get_queryset(self):
        queryset = super().get_queryset()
        name = self.request.query_params.get("name", None)
        if name:
            queryset = queryset.filter(name__iexact=name)  # Case-insensitive match
        return queryset

    #permission_classes = [IsAuthenticated]

class ApartmentViewSet(viewsets.ModelViewSet):
    queryset = Apartment.objects.all()
    serializer_class = ApartmentSerializer
    filter_backends = [DjangoFilterBackend]  # Enable filtering
    filterset_fields = ['owner']  # Allow filtering by owner
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
    permission_classes = [IsAuthenticatedOrReadOnly]  # Read for anyone, write for authenticated users


from rest_framework import viewsets

class OwnerViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows only Owners to be viewed by ID.
    """
    serializer_class = OwnerSerializer
    queryset = User.objects.filter(groups__name='Owners')  # ✅ Filters only Owners
    permission_classes = [IsAuthenticated]  # ✅ Optional: Can remove for testing

class GuestsGroupViewSet(viewsets.ViewSet):
    """
    ViewSet for managing GUests group members.
    """

    permission_classes = [IsAuthenticated]

    def list(self, request):
        """
        List all users in the Guests group.
        """
        try:
            guests_group = Group.objects.get(name="Guests")
            guests = guests_group.user_set.all()
            data = [{"id": user.id, "username": user.username} for user in guests]
            return Response(data)
        except Group.DoesNotExist:
            raise NotFound(detail="The Guests group does not exist.")

    def create(self, request):
        """
        Create a new user and add them to the Guests group.
        """
        try:
            # Ensure the Guests group exists
            guests_group = Group.objects.get(name="Guests")
        except Group.DoesNotExist:
            return Response(
                {"error": "The Guests group does not exist."},
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
        guests_group.user_set.add(user)

        # Return a success response
        return Response(
            {
                "message": f"User {username} created and added to Guests group.",
                "user": {"id": user.id, "username": user.username, "email": user.email},
            },
            status=status.HTTP_201_CREATED,
        )


    def retrieve(self, request, pk=None):
        """
        Retrieve a specific user in the Guests group.
        """
        try:
            user = User.objects.get(pk=pk)
            if not user.groups.filter(name="Guests").exists():
                return Response(
                    {"error": "This user is not part of the Guests group."},
                    status=status.HTTP_404_NOT_FOUND,
                )
            return Response({"id": user.id, "username": user.username})
        except User.DoesNotExist:
            return Response({"error": "User not found."}, status=status.HTTP_404_NOT_FOUND)

    def update(self, request, pk=None):
        """
        Update a specific user in the Guests group.
        """
        try:
            user = User.objects.get(pk=pk)
            serializer = UserSerializer(user, data=request.data, partial=True)
            if serializer.is_valid():
                serializer.save()
                return Response({"message": "Guest updated successfully."})
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        except User.DoesNotExist:
            return Response({"error": "User not found."}, status=status.HTTP_404_NOT_FOUND)

    def destroy(self, request, pk=None):
        """
        Remove a specific user from the Guests group.
        """
        try:
            user = User.objects.get(pk=pk)
            if not user.groups.filter(name="Guests").exists():
                return Response(
                    {"error": "This user is not part of the Guests group."},
                    status=status.HTTP_404_NOT_FOUND,
                )
            user.delete()
            return Response({"message": "User deleted successfully."}, status=status.HTTP_204_NO_CONTENT)
        except User.DoesNotExist:
            return Response({"error": "User not found."}, status=status.HTTP_404_NOT_FOUND)

        

#begings added on 20.12.2024
class OwnerListCreateView(generics.ListCreateAPIView):
    queryset = User.objects.all()
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
    serializer_class = GuestSerializer
    queryset = User.objects.filter(groups__name='Guests')
    permission_classes = [IsAuthenticated]

#begins added on 20.12.2024
class GuestListCreateView(generics.ListCreateAPIView):
    queryset = User.objects.all()
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
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        queryset = super().get_queryset()
        guest_id = self.request.query_params.get('guest_id', None)
        if guest_id is not None:
            queryset = queryset.filter(guest_id=guest_id)
        return queryset

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
    

class ApartmentFilterView(APIView):
    def get(self, request):
        start_date = request.query_params.get('start_date')
        end_date = request.query_params.get('end_date')
        min_price = request.query_params.get('min_price')
        max_price = request.query_params.get('max_price')
        facilities = request.query_params.getlist('facilities')
        location = request.query_params.getlist('location')

        apartments = Apartment.objects.all()

        if start_date and end_date:
            # Assuming the Apartment model has a booking or availability field
            apartments = apartments.filter(
                Q(bookings__start_date__gte=start_date, bookings__end_date__lte=end_date) |
                Q(bookings__isnull=True)
            )

        if min_price:
            apartments = apartments.filter(price__gte=min_price)
        if max_price:
            apartments = apartments.filter(price__lte=max_price)

        if facilities:
            apartments = apartments.filter(facilities__in=facilities).distinct()
        if location:
            apartments = apartments.filter(location__in=location).distinct()

        serializer = ApartmentSerializer(apartments, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)


#added on 22.12.2024
def custom_404_view(request, exception):
    return render(request, '404.html', {'error': str(exception)}, status=404)


#updated  on 10.02.2025
from django.contrib.auth.models import Group

@api_view(['POST'])
def user_login(request):
    """
    Authenticate a user and return a token if valid credentials are provided.
    """
    username = request.data.get('username')
    password = request.data.get('password')

    if not username or not password:
        return Response({"error": "Both username and password are required."}, status=status.HTTP_400_BAD_REQUEST)

    user = authenticate(username=username, password=password)

    if user is not None:
        # Generate or retrieve a token for the user
        token, created = Token.objects.get_or_create(user=user)

        # Get the user's groups
        user_groups = user.groups.values_list('name', flat=True)  # Returns a list of group names

        return Response({
            "message": "Login successful!",
            "token": token.key,
            "user_id": user.id,
            "username": user.username,
            "groups": list(user_groups)  # Convert QuerySet to list for JSON response
        }, status=status.HTTP_200_OK)

    return Response({"error": "Invalid credentials. Please try again."}, status=status.HTTP_401_UNAUTHORIZED)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def user_logout(request):
    """
    Log out a user by deleting their authentication token.
    """
    try:
        # Delete the user's token
        request.user.auth_token.delete()
        return Response({"message": "Logout successful!"}, status=status.HTTP_200_OK)
    except AttributeError:
        return Response({"error": "User is not logged in."}, status=status.HTTP_400_BAD_REQUEST)
    


import logging
from django.core.mail import send_mail
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status

logger = logging.getLogger(__name__)

@api_view(["POST"])
def contact_view(request):
    email = request.data.get("email")
    message = request.data.get("message")
    subject = request.data.get("subject")

    if not email or not message or not subject:
        return Response({"error": "Email, subject, and message are required."}, status=400)

    try:
        # Use Django's send_mail function to send the email
        send_mail(
            subject=subject,
            message=message,
            from_email=email,
            recipient_list=["info@tropifruechte.de"],  # Replace with your actual recipient email
            fail_silently=False,
        )
        logger.info(f"Email sent successfully: {subject} from {email}")
        print(f"Email sent successfully: {subject} from {email}")
        return Response({"success": "Message sent successfully."})
    except Exception as e:
        logger.error(f"Error sending email: {str(e)}")
        return Response({"error": str(e)}, status=500)
    



