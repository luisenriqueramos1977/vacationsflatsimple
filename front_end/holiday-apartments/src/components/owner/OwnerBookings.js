import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import NavBar from '../common/NavBar';
import Footer from '../common/Footer';
import OwnerMenu from './OwnerMenu';

const OwnerBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [apartments, setApartments] = useState({});
  const [userGroup, setUserGroup] = useState(null);
  const [userId, setUserId] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isUpdateMode, setIsUpdateMode] = useState(false);
  const [bookingIdToUpdate, setBookingIdToUpdate] = useState(null);
  const [guestDetail, setGuestDetail] = useState("");
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

    if (storedGroups.includes("Owners")) {
      setUserGroup("Owners");
    }

    if (storedUserId && storedGroups.includes("Owners")) {
      fetchApartmentsAndBookings(storedUserId);
    }
  }, []);

  const fetchApartmentsAndBookings = async (ownerId) => {
    try {
      // Fetch apartments of the current owner
      const apartmentsResponse = await fetch(`http://localhost:8000/api/apartments/?owner=${ownerId}`);
      const apartmentsData = await apartmentsResponse.json();
      const apartmentIds = apartmentsData.map(apartment => apartment.id);
      const apartmentsMap = {};
      apartmentsData.forEach(apartment => {
        apartmentsMap[apartment.id] = apartment.apartment_name;
      });
      setApartments(apartmentsMap);

      // Fetch bookings
      const bookingsResponse = await fetch("http://localhost:8000/api/bookings/");
      const bookingsData = await bookingsResponse.json();

      // Filter bookings related to the owner's apartments
      const ownerBookings = bookingsData.filter(booking => apartmentIds.includes(booking.apartment));

      setBookings(ownerBookings);
    } catch (error) {
      console.error("Error fetching apartments and bookings:", error);
    }
  };

  const handleDelete = async (bookingId) => {
    if (!window.confirm("Are you sure you want to delete this booking?")) return;

    try {
      const response = await fetch(`http://localhost:8000/api/bookings/${bookingId}/`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
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
        guest_detail: guestDetail,
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
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify(bookingPayload),
        });
      } else {
        response = await fetch("http://localhost:8000/api/bookings/", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
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
    setGuestDetail("");
    setApartmentId("");
    setStartDate("");
    setEndDate("");
    setIsModalOpen(true);
  };

  const openUpdateModal = (booking) => {
    setIsUpdateMode(true);
    setBookingIdToUpdate(booking.id);
    setGuestDetail(booking.guest_detail);
    setApartmentId(booking.apartment);
    setStartDate(booking.start_date);
    setEndDate(booking.end_date);
    setIsModalOpen(true);
  };

  return (
    <div className="h-screen flex flex-col">
      <NavBar />
      {userGroup === "Owners" && <OwnerMenu />}
      <div className="flex flex-1 flex-col items-center mt-16">
        <h1 className="text-3xl font-bold mb-8">Bookings</h1>

        {userGroup === "Owners" && (
          <button
            onClick={openCreateModal}
            className="bg-blue-500 text-white px-4 py-2 rounded-md mb-4 hover:bg-blue-700"
          >
            Create Booking
          </button>
        )}

        {isModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <div className="bg-white p-6 rounded-lg w-full max-w-md">
              <h2 className="text-xl font-bold mb-4">{isUpdateMode ? "Update Booking" : "Create New Booking"}</h2>
              <form onSubmit={handleSubmit}>
                <div className="mb-4">
                  <label className="block text-gray-700">Guest Name</label>
                  <input
                    type="text"
                    value={guestDetail}
                    onChange={(e) => setGuestDetail(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-md"
                    required
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-gray-700">Apartment</label>
                  <select
                    value={apartmentId}
                    onChange={(e) => setApartmentId(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-md"
                    required
                  >
                    <option value="">Select Apartment</option>
                    {Object.entries(apartments).map(([id, name]) => (
                      <option key={id} value={id}>
                        {name}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="mb-4">
                  <label className="block text-gray-700">Start Date</label>
                  <input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-md"
                    required
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-gray-700">End Date</label>
                  <input
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-md"
                    required
                  />
                </div>

                {error && <p className="text-red-500 mb-4">{error}</p>}

                <div className="flex justify-end">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="bg-gray-500 text-white px-4 py-2 rounded-md mr-2 hover:bg-gray-600"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
                  >
                    {isUpdateMode ? "Update" : "Create"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {userGroup === "Owners" && bookings.length === 0 && (
          <p className="text-red-600 font-semibold mb-4">
            No Bookings found.
          </p>
        )}

        <div className="w-full max-w-4xl overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-300">
            <thead>
              <tr className="bg-gray-100 text-center">
                <th className="py-3 px-4 border-b">Guest Name</th>
                <th className="py-3 px-4 border-b">Apartment Name</th>
                <th className="py-3 px-4 border-b">Start Date</th>
                <th className="py-3 px-4 border-b">End Date</th>
                <th className="py-3 px-4 border-b">Actions</th>
              </tr>
            </thead>
            <tbody>
              {bookings.map((booking) => (
                <tr key={booking.id} className="hover:bg-gray-50 text-center">
                  <td className="py-3 px-4 border-b">
                    {booking.guest_detail}
                  </td>
                  <td className="py-3 px-4 border-b">
                    {apartments[booking.apartment]}
                  </td>
                  <td className="py-3 px-4 border-b">
                    {booking.start_date}
                  </td>
                  <td className="py-3 px-4 border-b">
                    {booking.end_date}
                  </td>
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