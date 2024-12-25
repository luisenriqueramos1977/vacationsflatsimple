
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
    ApartmentBookingsListView,
    CurrencyViewSet,
)
#added on 22.12.2024
from django.conf.urls import handler404
#added on 24.12.2024
from django.conf import settings
from django.conf.urls.static import static

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

pictures_list = BookingViewSet.as_view({
    'get': 'list',
    'post': 'create'
})

pictures_detail = BookingViewSet.as_view({
    'get': 'retrieve',
    'put': 'update',
    'delete': 'destroy'
})



urlpatterns = [
    path('', views.api_page, name='api-page'),  # API documentation page
    path('locations/', location_list, name='location-list'),
    path('locations/<int:pk>/', location_detail, name='location-detail'),
    path('apartments/', apartment_list, name='apartment-list'),
    path('apartments/<int:pk>/', apartment_detail, name='apartment-detail'),
    path('apartments/<int:apartment_id>/bookings/', 
         ApartmentBookingsListView.as_view(), 
         name='apartment-bookings'),
    # New endpoint for available apartments
    # New endpoint for filtering bookings by apartment in a given period
    path(
        'apartments/<int:apartment_id>/bookings/',
        views.ApartmentBookingsView.as_view(),
        name='apartment-bookings'
    ),
    path('apartments/available/', views.AvailableApartmentsView.as_view(), name='available-apartments'),
    path('owners/', owner_list, name='owner-list'),
    path('owners/<int:pk>/', owner_detail, name='owner-detail'),
    path('groups/owners/', views.OwnerGroupListView.as_view(), name='owners-group-list'),##added on 20.12.2024
    path('guests/', guest_list, name='guest-list'),
    path('guests/<int:pk>/', guest_detail, name='guest-detail'),
    path('groups/guests/', views.GuestGroupListView.as_view(), name='guests-group-list'),#added on 20.12.2024
    path('reviews/', ReviewViewSet.as_view({'get': 'list', 'post': 'create'}), name='review-list'),
    path('reviews/<int:pk>/', ReviewViewSet.as_view({
        'get': 'retrieve',
        'put': 'update',
        'delete': 'destroy'
    }), name='review-detail'),
    path('bookings/', booking_list, name='booking-list'),
    path('bookings/<int:pk>/', booking_detail, name='booking-detail'),
    # Facilities endpoints
    path('facilities/', views.FacilityViewSet.as_view({'get': 'list', 'post': 'create'}), name='facility-list'),
    path('facilities/<int:pk>/', views.FacilityViewSet.as_view({'get': 'retrieve', 'put': 'update', 'delete': 'destroy'}), name='facility-detail'),
    # currencies
    path('currencies/', views.CurrencyViewSet.as_view({'get': 'list', 'post': 'create'}), name='currency-list'),  # List and create currencies
    path('pictures/', views.PictureViewSet.as_view({'get': 'list', 'post': 'create'}), name='picture-list'),  # List and create pictures
    path('pictures/<int:pk>/', views.PictureViewSet.as_view({'get': 'retrieve', 'put': 'update', 'delete': 'destroy'}), name='pictures-detail'),
]

#added on 22.12.2024
handler404 = 'flat_api.views.custom_404_view'
#added on 24.12.2024
if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)