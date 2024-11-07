from django.urls import path
from .views import (
    FewoOwnerListView, FewoOwnerCreateView, FewoOwnerRetrieveUpdateDestroyView,
    ApartmentListView, ApartmentCreateView, ApartmentRetrieveUpdateDestroyView,
    GuestListView, GuestCreateView, GuestRetrieveUpdateDestroyView,
    BookingListView, BookingCreateView, BookingRetrieveUpdateDestroyView
)

urlpatterns = [
    # FewoOwner URLs
    path('fewoowners/', FewoOwnerListView.as_view(), name='fewoowner-list'),
    path('fewoowner/create/', FewoOwnerCreateView.as_view(), name='fewoowner-create'),
    path('fewoowner/<int:pk>/', FewoOwnerRetrieveUpdateDestroyView.as_view(), name='fewoowner-detail'),

    # Apartment URLs
    path('apartments/', ApartmentListView.as_view(), name='apartment-list'),
    path('apartment/create/', ApartmentCreateView.as_view(), name='apartment-create'),
    path('apartment/<int:pk>/', ApartmentRetrieveUpdateDestroyView.as_view(), name='apartment-detail'),

    # Guest URLs
    path('guests/', GuestListView.as_view(), name='guest-list'),
    path('guest/create/', GuestCreateView.as_view(), name='guest-create'),
    path('guest/<int:pk>/', GuestRetrieveUpdateDestroyView.as_view(), name='guest-detail'),

    # Booking URLs
    path('bookings/', BookingListView.as_view(), name='booking-list'),
    path('booking/create/', BookingCreateView.as_view(), name='booking-create'),
    path('booking/<int:pk>/', BookingRetrieveUpdateDestroyView.as_view(), name='booking-detail'),
]


