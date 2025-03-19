
# File: api/urls.py
from django.urls import path, include
from . import views
from django.urls import path
from .views import (
    LocationViewSet,
    CurrencyViewSet,
    ApartmentViewSet,
    OwnerViewSet,
    GuestViewSet,
    ReviewViewSet,
    BookingViewSet,
    ApartmentBookingsListView,
    PictureViewSet,
    user_login,
    user_logout,
    email_config_view
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

currencies_list = CurrencyViewSet.as_view({
    'get': 'list',
    'post': 'create'
})

currency_details = CurrencyViewSet.as_view({
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
    'get': 'list',        # List all owners
    'post': 'create',     # Create a new owner
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

pictures_list = PictureViewSet.as_view({
    'get': 'list',
    'post': 'create'
})

pictures_detail = PictureViewSet.as_view({
    'get': 'retrieve',
    'put': 'update',
    'delete': 'destroy'
})



urlpatterns = [
    path('', views.api_page, name='api-page'),  # API documentation page
    path('locations/', location_list, name='location-list'),
    path('locations/<int:pk>/', location_detail, name='location-detail'),
    path('apartments/', apartment_list, name='apartment-list'),
    path('pictures/', pictures_list, name='picture-list'),  # List and create pictures
    path('apartments/<int:pk>/', apartment_detail, name='apartment-detail'),
    path('apartments/<int:apartment_id>/bookings/', ApartmentBookingsListView.as_view(), name='apartment-bookings'),
    path('apartments/filter/', views.ApartmentFilterView.as_view(), name='filter-apartments'),
    # New endpoint for available apartments
    # New endpoint for filtering bookings by apartment in a given period
    path('apartments/<int:apartment_id>/bookings/', views.ApartmentBookingsView.as_view(), name='apartment-bookings'),
    path('apartments/available/', views.AvailableApartmentsView.as_view(), name='available-apartments'),
    path('groups/owners/', owner_list, name='owners-list-create'),##added on 20.12.2024
    path('groups/owners/<int:pk>/', owner_detail, name='owner-detail'),
    path('groups/guests/', guest_list, name='guests-group-list'),#added on 20.12.2024
    path('groups/guests/<int:pk>/', guest_detail, name='guests-detail'),
    path('reviews/', ReviewViewSet.as_view({'get': 'list', 'post': 'create'}), name='review-list'),
    path('reviews/<int:pk>/', ReviewViewSet.as_view({'get': 'retrieve','put': 'update','delete': 'destroy'}), name='review-detail'),
    path('bookings/', booking_list, name='booking-list'),
    path('bookings/<int:pk>/', booking_detail, name='booking-detail'),
    # Facilities endpoints
    path('facilities/', views.FacilityViewSet.as_view({'get': 'list', 'post': 'create'}), name='facility-list'),
    path('facilities/<int:pk>/', views.FacilityViewSet.as_view({'get': 'retrieve', 'put': 'update', 'delete': 'destroy'}), name='facility-detail'),
    # currencies
    path('currencies/', currencies_list, name='currencies-list'),
    path('currencies/<int:pk>/', currency_details, name='currency-details'),
    #path('currencies/', views.CurrencyViewSet.as_view({'get': 'list', 'post': 'create'}), name='currency-list'),  # List and create currencies
    path('pictures/<int:pk>/', views.PictureViewSet.as_view({'get': 'retrieve', 'put': 'update', 'delete': 'destroy'}), name='pictures-detail'),
    path('auth/login/', user_login, name='user-login'),
    path('auth/logout/', user_logout, name='user-logout'),
    path('contact/', views.contact_view, name='contact-view'),
    path('email-config/', email_config_view, name='email_config'),
]

#added on 22.12.2024
handler404 = 'flat_api.views.custom_404_view'
#added on 24.12.2024
if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)