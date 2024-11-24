
# File: api/urls.py
from django.urls import path, include
from . import views
from django.urls import path
from .views import (
    LocationViewSet,
    ApartmentViewSet,
    OwnerViewSet,
    GuestViewSet,
    ReviewViewSet,
    BookingViewSet,
    FacilityViewSet,
)

location_list = LocationViewSet.as_view({
    'get': 'list',
    'post': 'create'
})
location_detail = LocationViewSet.as_view({
    'get': 'retrieve',
    'put': 'update',
    'delete': 'destroy'
})

apartment_list = ApartmentViewSet.as_view({
    'get': 'list',
    'post': 'create'
})
apartment_detail = ApartmentViewSet.as_view({
    'get': 'retrieve',
    'put': 'update',
    'delete': 'destroy'
})

owner_list = OwnerViewSet.as_view({
    'get': 'list',
    'post': 'create'
})
owner_detail = OwnerViewSet.as_view({
    'get': 'retrieve',
    'put': 'update',
    'delete': 'destroy'
})

guest_list = GuestViewSet.as_view({
    'get': 'list',
    'post': 'create'
})
guest_detail = GuestViewSet.as_view({
    'get': 'retrieve',
    'put': 'update',
    'delete': 'destroy'
})

review_list = ReviewViewSet.as_view({
    'get': 'list',
    'post': 'create'
})
review_detail = ReviewViewSet.as_view({
    'get': 'retrieve',
    'put': 'update',
    'delete': 'destroy'
})

booking_list = BookingViewSet.as_view({
    'get': 'list',
    'post': 'create'
})
booking_detail = BookingViewSet.as_view({
    'get': 'retrieve',
    'put': 'update',
    'delete': 'destroy'
})



urlpatterns = [
    #path('', views.home, name='home'),  # Home page
    path('', views.api_page, name='api-page'),  # API documentation page
    path('locations/', location_list, name='location-list'),
    path('locations/<int:pk>/', location_detail, name='location-detail'),
    path('apartments/', apartment_list, name='apartment-list'),
    path('apartments/<int:pk>/', apartment_detail, name='apartment-detail'),
    path('owners/', owner_list, name='owner-list'),
    path('owners/<int:pk>/', owner_detail, name='owner-detail'),
    path('guests/', guest_list, name='guest-list'),
    path('guests/<int:pk>/', guest_detail, name='guest-detail'),
    path('api/reviews/', ReviewViewSet.as_view({'get': 'list', 'post': 'create'}), name='review-list'),
    path('api/reviews/<int:pk>/', ReviewViewSet.as_view({
        'get': 'retrieve',
        'put': 'update',
        'delete': 'destroy'
    }), name='review-detail'),
    path('bookings/', booking_list, name='booking-list'),
    path('bookings/<int:pk>/', booking_detail, name='booking-detail'),
    path('api/facilities/', FacilityViewSet.as_view({'get': 'list', 'post': 'create'}), name='facility-list'),
    path('api/facilities/<int:pk>/', FacilityViewSet.as_view({
        'get': 'retrieve', 
        'put': 'update', 
        'delete': 'destroy'
    }), name='facility-detail'),
]

