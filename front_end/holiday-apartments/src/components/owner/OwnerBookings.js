import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import NavBar from '../common/NavBar';
import Footer from '../common/Footer';
import CreateBookingModal from './CreateBookingModal';
import OwnerMenu from '../owner/OwnerMenu';
import GuestMenu from '../guests/GuestMenu'; // Assuming you have a GuestMenu component

const OwnerBookings = () => {
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
    const storedGroups = JSON.parse(localStorage.getItem("groups") || "[]");

    if (storedUserId) {
      setUserId(parseInt(storedUserId, 10));
    }

    if (storedGroups.includes("Guests")) {
      setUserGroup("Guests");
    } else if (storedGroups.includes("Owners")) {
      setUserGroup("Owners");
    }

    if (storedUserId && storedGroups.includes("Guests")) {
      fetchBookings(storedUserId);
    } else if (storedUserId && storedGroups.includes("Owners")) {
      fetchOwnerBookings(storedUserId);
    }
  }, []);

  const fetchBookings = async (guestId) => {
    try {
      const token = localStorage.getItem("token");
      const myHeaders = new Headers();
      myHeaders.append("Content-Type", "application/json");
      myHeaders.append("Authorization", `Token ${token}`);

      // Fetch bookings for the current guest
      const bookingsResponse = await fetch(`http://localhost:8000/api/bookings/?guest_id=${guestId}`, {
        method: "GET",
        headers: myHeaders,
      });
      const bookingsData = await bookingsResponse.json();

      // Fetch apartments
      const apartmentsResponse = await fetch("http://localhost:8000/api/apartments/", {
        method: "GET",
        headers: myHeaders,
      });
      const apartmentsData = await apartmentsResponse.json();
      const apartmentsMap = {};
      apartmentsData.forEach(apartment => {
        apartmentsMap[apartment.id] = apartment.apartment_name;
      });
      setApartments(apartmentsMap);

      setBookings(bookingsData);
    } catch (error) {
      console.error("Error fetching bookings:", error);
    }
  };

  const fetchOwnerBookings = async (ownerId) => {
    try {
      const token = localStorage.getItem("token");
      const myHeaders = new Headers();
      myHeaders.append("Content-Type", "application/json");
      myHeaders.append("Authorization", `Token ${token}`);
  
      // Fetch apartments of the current owner
      const apartmentsResponse = await fetch(`http://localhost:8000/api/apartments/?owner=${ownerId}`, {
        method: "GET",
        headers: myHeaders,
      });
      const apartmentsData = await apartmentsResponse.json();
      const apartmentIds = apartmentsData.map(apartment => apartment.id);
      const apartmentsMap = {};
      apartmentsData.forEach(apartment => {
        apartmentsMap[apartment.id] = apartment.apartment_name;
      });
      setApartments(apartmentsMap);
  
      // Fetch bookings
      const bookingsResponse = await fetch("http://localhost:8000/api/bookings/", {
        method: "GET",
        headers: myHeaders,
      });
      const bookingsText = await bookingsResponse.text();
      console.log("Bookings response text:", bookingsText);
      const bookingsData = JSON.parse(bookingsText);
  
      // Filter bookings related to the owner's apartments
      const ownerBookings = bookingsData.filter(booking => apartmentIds.includes(booking.apartment));
  
      // Fetch guest details
      const uniqueGuestIds = [...new Set(ownerBookings.map(booking => booking.guest_id))];
      const guestDetails = await Promise.all(uniqueGuestIds.map(async (guestId) => {
        const guestResponse = await fetch(`http://localhost:8000/api/groups/guests/${guestId}/`, {
          method: "GET",
          headers: myHeaders,
        });
        return guestResponse.json();
      }));
  
      const guestsMap = {};
      guestDetails.forEach(guest => {
        guestsMap[guest.id] = guest.username;
      });
      setGuests(guestsMap);
  
      setBookings(ownerBookings);
    } catch (error) {
      console.error("Error fetching bookings:", error);
    }
  };

  const handleDelete = async (bookingId) => {
    if (!window.confirm("Are you sure you want to delete this booking?")) return;

    try {
      const response = await fetch(`http://localhost:8000/api/bookings/${bookingId}/`, {
        method: "DELETE",
        headers: {
          Authorization: `Token ${localStorage.getItem("token")}`,
        },
      });

      if (response.ok) {
        setBookings((prev) => prev.filter((booking) => booking.id !== bookingId));
        alert("Booking deleted successfully!");
      } else {
        alert("Error deleting booking. Please try again.");
      }
    } catch (error) {
      console.error("Error deleting booking:", error);
      alert("An error occurred. Please try again.");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const bookingPayload = {
        guest: userId,
        apartment: parseInt(apartmentId, 10),
        start_date: startDate,
        end_date: endDate,
      };

      let response;
      if (isUpdateMode) {
        response = await fetch(`http://localhost:8000/api/bookings/${bookingIdToUpdate}/`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Token ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify(bookingPayload),
        });
      } else {
        response = await fetch("http://localhost:8000/api/bookings/", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Token ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify(bookingPayload),
        });
      }

      if (!response.ok) {
        throw new Error("Failed to create/update booking");
      }

      const data = await response.json();
      console.log("Booking created/updated:", data);

      alert("Booking created/updated successfully!");
      setIsModalOpen(false);
      window.location.reload();
    } catch (error) {
      console.error("Error creating/updating booking:", error);
      setError("Failed to create/update booking. Please try again.");
    }
  };

  const openCreateModal = () => {
    setIsUpdateMode(false);
    setBookingIdToUpdate(null);
    setApartmentId("");
    setStartDate("");
    setEndDate("");
    setIsModalOpen(true);
  };

  const openUpdateModal = (booking) => {
    setIsUpdateMode(true);
    setBookingIdToUpdate(booking.id);
    setApartmentId(booking.apartment);
    setStartDate(booking.start_date);
    setEndDate(booking.end_date);
    setIsModalOpen(true);
  };

  return (
    <div className="h-screen flex flex-col">
      <NavBar />
      {userGroup === "Owners" ? <OwnerMenu /> : <GuestMenu />}
      <div className="flex flex-1 flex-col items-center mt-16">
        <h1 className="text-3xl font-bold mb-8">Bookings</h1>

        {userGroup === "Guests" && (
          <button
            onClick={openCreateModal}
            className="bg-blue-500 text-white px-4 py-2 rounded-md mb-4 hover:bg-blue-700"
          >
            Create Booking
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

        {userGroup === "Guests" && bookings.length === 0 && (
          <p className="text-red-600 font-semibold mb-4">
            No Bookings found.
          </p>
        )}

        <div className="w-full max-w-4xl overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-300">
            <thead>
              <tr className="bg-gray-100 text-center">
                {userGroup === "Owners" && <th className="py-3 px-4 border-b">Guest Name</th>}
                <th className="py-3 px-4 border-b">Apartment Name</th>
                <th className="py-3 px-4 border-b">Start Date</th>
                <th className="py-3 px-4 border-b">End Date</th>
                <th className="py-3 px-4 border-b">Actions</th>
              </tr>
            </thead>
            <tbody>
              {bookings.map((booking) => (
                <tr key={booking.id} className="hover:bg-gray-50 text-center">
                  {userGroup === "Owners" && <td className="py-3 px-4 border-b">{guests[booking.guest_id]}</td>}
                  <td className="py-3 px-4 border-b">{apartments[booking.apartment]}</td>
                  <td className="py-3 px-4 border-b">{booking.start_date}</td>
                  <td className="py-3 px-4 border-b">{booking.end_date}</td>
                  <td className="py-3 px-4 border-b flex justify-center space-x-2">
                    <button
                      onClick={() => openUpdateModal(booking)}
                      className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-700"
                    >
                      Update
                    </button>
                    <button
                      onClick={() => handleDelete(booking.id)}
                      className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-700"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default OwnerBookings;