import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import NavBar from '../common/NavBar';
import Footer from '../common/Footer';
import CreateBookingModal from './CreateBookingModal';
import OwnerMenu from '../owner/OwnerMenu';
import GuestMenu from '../guests/GuestMenu';
import { useTranslation } from 'react-i18next';

const OwnerBookings = () => {
  const { t } = useTranslation();
  const [bookings, setBookings] = useState([]);
  const [apartments, setApartments] = useState({});
  const [guests, setGuests] = useState({});
  const [userGroup, setUserGroup] = useState(null);
  const [userId, setUserId] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isUpdateMode, setIsUpdateMode] = useState(false);
  const [bookingIdToUpdate, setBookingIdToUpdate] = useState(null);
  const [apartmentId, setApartmentId] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const storedUserId = localStorage.getItem("user_id");
    const rawGroups = localStorage.getItem("groups");
    let storedGroups = [];
    
    if (rawGroups) {
      try {
        const parsed = JSON.parse(rawGroups);
        storedGroups = Array.isArray(parsed) ? parsed : [parsed];
      } catch {
        storedGroups = [rawGroups];
      }
    }

    if (storedUserId) {
      setUserId(parseInt(storedUserId, 10));
    }

    // More robust group checking
    const isGuest = storedGroups.some(group => String(group).trim() === "Guests");
    const isOwner = storedGroups.some(group => String(group).trim() === "Owners");

    if (isGuest) {
      setUserGroup("Guests");
      fetchBookings(storedUserId);
    } else if (isOwner) {
      setUserGroup("Owners");
      fetchOwnerBookings(storedUserId);
    }
  }, []);

  const fetchBookings = async (guestId) => {
    try {
      const token = localStorage.getItem("token");
      const myHeaders = new Headers();
      myHeaders.append("Content-Type", "application/json");
      myHeaders.append("Authorization", `Token ${token}`);

      // Properly encoded guest_id parameter
      const response = await fetch(
        `http://localhost:8000/api/bookings/?guest_id=${encodeURIComponent(guestId)}`,
        {
          method: "GET",
          headers: myHeaders,
        }
      );

      if (!response.ok) {
        throw new Error(`Failed to fetch bookings (Status: ${response.status})`);
      }

      const bookingsData = await response.json();
      console.log("Fetched guest bookings:", bookingsData); // Debug log

      // Fetch apartments for guest view
      const apartmentsResponse = await fetch("http://localhost:8000/api/apartments/", {
        method: "GET",
        headers: myHeaders,
      });

      if (!apartmentsResponse.ok) {
        throw new Error(`Failed to fetch apartments (Status: ${apartmentsResponse.status})`);
      }

      const apartmentsData = await apartmentsResponse.json();
      const apartmentsMap = {};
      apartmentsData.forEach(apartment => {
        apartmentsMap[apartment.id] = apartment.apartment_name;
      });
      setApartments(apartmentsMap);

      setBookings(bookingsData);
    } catch (error) {
      console.error("Error fetching guest bookings:", error);
      setError(t("error_fetching_bookings"));
    }
  };

  const fetchOwnerBookings = async (ownerId) => {
    try {
      const token = localStorage.getItem("token");
      const myHeaders = new Headers();
      myHeaders.append("Content-Type", "application/json");
      myHeaders.append("Authorization", `Token ${token}`);

      // Fetch owner's apartments
      const apartmentsResponse = await fetch(
        `http://localhost:8000/api/apartments/?owner=${encodeURIComponent(ownerId)}`,
        {
          method: "GET",
          headers: myHeaders,
        }
      );
      
      if (!apartmentsResponse.ok) {
        throw new Error(`Failed to fetch apartments (Status: ${apartmentsResponse.status})`);
      }

      const apartmentsData = await apartmentsResponse.json();
      const apartmentIds = apartmentsData.map(apartment => apartment.id);
      const apartmentsMap = {};
      apartmentsData.forEach(apartment => {
        apartmentsMap[apartment.id] = apartment.apartment_name;
      });
      setApartments(apartmentsMap);

      // Fetch all bookings
      const bookingsResponse = await fetch("http://localhost:8000/api/bookings/", {
        method: "GET",
        headers: myHeaders,
      });

      if (!bookingsResponse.ok) {
        throw new Error(`Failed to fetch bookings (Status: ${bookingsResponse.status})`);
      }

      const bookingsData = await bookingsResponse.json();

      // Filter bookings for owner's apartments
      const ownerBookings = bookingsData.filter(booking => 
        apartmentIds.includes(booking.apartment)
      );

      // Fetch guest details
      const uniqueGuestIds = [...new Set(ownerBookings.map(booking => booking.guest_id))];
      const guestDetails = await Promise.all(
        uniqueGuestIds.map(async (guestId) => {
          const guestResponse = await fetch(
            `http://localhost:8000/api/groups/guests/${encodeURIComponent(guestId)}/`,
            {
              method: "GET",
              headers: myHeaders,
            }
          );
          return guestResponse.json();
        })
      );

      const guestsMap = {};
      guestDetails.forEach(guest => {
        guestsMap[guest.id] = guest.username;
      });
      setGuests(guestsMap);

      setBookings(ownerBookings);
    } catch (error) {
      console.error("Error fetching owner bookings:", error);
      setError(t("error_fetching_bookings"));
    }
  };

  const handleDelete = async (bookingId) => {
    if (!window.confirm(t("confirm_delete_booking"))) return;

    try {
      const response = await fetch(
        `http://localhost:8000/api/bookings/${encodeURIComponent(bookingId)}/`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Token ${localStorage.getItem("token")}`,
          },
        }
      );

      if (response.ok) {
        setBookings(prev => prev.filter(booking => booking.id !== bookingId));
        alert(t("booking_deleted_successfully"));
      } else {
        alert(t("error_deleting_booking"));
      }
    } catch (error) {
      console.error("Error deleting booking:", error);
      alert(t("error_occurred"));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const bookingPayload = {
        guest: userId,
        apartment: parseInt(apartmentId, 10),
        start_date: startDate,
        end_date: endDate,
      };

      const url = isUpdateMode
        ? `http://localhost:8000/api/bookings/${encodeURIComponent(bookingIdToUpdate)}/`
        : "http://localhost:8000/api/bookings/";

      const method = isUpdateMode ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Token ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(bookingPayload),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          errorData.detail || t("failed_to_create_update_booking")
        );
      }

      alert(t("booking_created_updated_successfully"));
      setIsModalOpen(false);
      
      // Refresh data based on user role
      if (userGroup === "Guests") {
        fetchBookings(userId);
      } else {
        fetchOwnerBookings(userId);
      }
    } catch (error) {
      console.error("Booking error:", error);
      setError(error.message || t("failed_to_create_update_booking"));
    }
  };

  const openCreateModal = () => {
    setIsUpdateMode(false);
    setBookingIdToUpdate(null);
    setApartmentId("");
    setStartDate("");
    setEndDate("");
    setError("");
    setIsModalOpen(true);
  };

  const openUpdateModal = (booking) => {
    setIsUpdateMode(true);
    setBookingIdToUpdate(booking.id);
    setApartmentId(booking.apartment);
    setStartDate(booking.start_date);
    setEndDate(booking.end_date);
    setError("");
    setIsModalOpen(true);
  };

  return (
    <div className="h-screen flex flex-col">
      <NavBar />
      {userGroup === "Owners" ? <OwnerMenu /> : <GuestMenu />}
      <div className="flex flex-1 flex-col items-center mt-16">
        <h1 className="text-3xl font-bold mb-8">{t("bookings")}</h1>

        {userGroup === "Guests" && (
          <button
            onClick={openCreateModal}
            className="bg-blue-500 text-white px-4 py-2 rounded-md mb-4 hover:bg-blue-700"
          >
            {t("create_booking")}
          </button>
        )}

        <CreateBookingModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSubmit={handleSubmit}
          apartmentId={apartmentId}
          setApartmentId={setApartmentId}
          startDate={startDate}
          setStartDate={setStartDate}
          endDate={endDate}
          setEndDate={setEndDate}
          apartments={apartments}
          error={error}
        />

        {bookings.length === 0 ? (
          <p className="text-red-600 font-semibold mb-4">
            {t("no_bookings_found")}
          </p>
        ) : (
          <div className="w-full max-w-4xl overflow-x-auto">
            <table className="min-w-full bg-white border border-gray-300">
              <thead>
                <tr className="bg-gray-100 text-center">
                  {userGroup === "Owners" && (
                    <th className="py-3 px-4 border-b">{t("guest_name")}</th>
                  )}
                  <th className="py-3 px-4 border-b">{t("apartment_name")}</th>
                  <th className="py-3 px-4 border-b">{t("start_date")}</th>
                  <th className="py-3 px-4 border-b">{t("end_date")}</th>
                  <th className="py-3 px-4 border-b">{t("actions")}</th>
                </tr>
              </thead>
              <tbody>
                {bookings.map((booking) => (
                  <tr key={booking.id} className="hover:bg-gray-50 text-center">
                    {userGroup === "Owners" && (
                      <td className="py-3 px-4 border-b">
                        {guests[booking.guest_id] || t("unknown_guest")}
                      </td>
                    )}
                    <td className="py-3 px-4 border-b">
                      {apartments[booking.apartment] || t("unknown_apartment")}
                    </td>
                    <td className="py-3 px-4 border-b">{booking.start_date}</td>
                    <td className="py-3 px-4 border-b">{booking.end_date}</td>
                    <td className="py-3 px-4 border-b flex justify-center space-x-2">
                      <button
                        onClick={() => openUpdateModal(booking)}
                        className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-700"
                      >
                        {t("update")}
                      </button>
                      <button
                        onClick={() => handleDelete(booking.id)}
                        className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-700"
                      >
                        {t("delete")}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default OwnerBookings;