import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import NavBar from '../common/NavBar';
import Footer from '../common/Footer';
import OwnerMenu from '../owner/OwnerMenu';

const Guests = () => {
  const [guests, setGuests] = useState([]);
  const [userGroup, setUserGroup] = useState(null);
  const [userId, setUserId] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isUpdateMode, setIsUpdateMode] = useState(false);
  const [guestIdToUpdate, setGuestIdToUpdate] = useState(null);
  const [guestName, setGuestName] = useState("");
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
      fetchGuests(storedUserId);
    }
  }, []);

  const fetchGuests = async (ownerId) => {
    try {
      // Fetch apartments of the current owner
      const apartmentsResponse = await fetch(`http://localhost:8000/api/apartments/?owner=${ownerId}`);
      const apartments = await apartmentsResponse.json();
      const apartmentIds = apartments.map(apartment => apartment.id);

      // Fetch bookings
      const bookingsResponse = await fetch("http://localhost:8000/api/bookings/");
      const bookings = await bookingsResponse.json();

      // Filter bookings related to the owner's apartments
      const ownerBookings = bookings.filter(booking => apartmentIds.includes(booking.apartment));

      // Extract unique guest details
      const uniqueGuests = [...new Set(ownerBookings.map(booking => booking.guest_detail))];

      setGuests(uniqueGuests);
    } catch (error) {
      console.error("Error fetching guests:", error);
    }
  };

  const handleDelete = async (guestId) => {
    if (!window.confirm("Are you sure you want to delete this guest?")) return;

    try {
      const response = await fetch(`http://localhost:8000/api/guests/${guestId}/`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (response.ok) {
        setGuests((prev) => prev.filter((guest) => guest.id !== guestId));
        alert("Guest deleted successfully!");
      } else {
        alert("Error deleting guest. Please try again.");
      }
    } catch (error) {
      console.error("Error deleting guest:", error);
      alert("An error occurred. Please try again.");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const guestPayload = {
        name: guestName,
      };

      let response;
      if (isUpdateMode) {
        response = await fetch(`http://localhost:8000/api/guests/${guestIdToUpdate}/`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify(guestPayload),
        });
      } else {
        response = await fetch("http://localhost:8000/api/guests/", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify(guestPayload),
        });
      }

      if (!response.ok) {
        throw new Error("Failed to create/update guest");
      }

      const data = await response.json();
      console.log("Guest created/updated:", data);

      alert("Guest created/updated successfully!");
      setIsModalOpen(false);
      window.location.reload();
    } catch (error) {
      console.error("Error creating/updating guest:", error);
      setError("Failed to create/update guest. Please try again.");
    }
  };

  const openCreateModal = () => {
    setIsUpdateMode(false);
    setGuestIdToUpdate(null);
    setGuestName("");
    setIsModalOpen(true);
  };

  const openUpdateModal = (guest) => {
    setIsUpdateMode(true);
    setGuestIdToUpdate(guest.id);
    setGuestName(guest.name);
    setIsModalOpen(true);
  };

  return (
    <div className="h-screen flex flex-col">
      <NavBar />
      {userGroup === "Owners" && <OwnerMenu />}
      <div className="flex flex-1 flex-col items-center mt-16">
        <h1 className="text-3xl font-bold mb-8">Guests</h1>

        {userGroup === "Owners" && (
          <button
            onClick={openCreateModal}
            className="bg-blue-500 text-white px-4 py-2 rounded-md mb-4 hover:bg-blue-700"
          >
            Create Guest
          </button>
        )}

        {isModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <div className="bg-white p-6 rounded-lg w-full max-w-md">
              <h2 className="text-xl font-bold mb-4">{isUpdateMode ? "Update Guest" : "Create New Guest"}</h2>
              <form onSubmit={handleSubmit}>
                <div className="mb-4">
                  <label className="block text-gray-700">Guest Name</label>
                  <input
                    type="text"
                    value={guestName}
                    onChange={(e) => setGuestName(e.target.value)}
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

        {userGroup === "Owners" && guests.length === 0 && (
          <p className="text-red-600 font-semibold mb-4">
            No Guests found.
          </p>
        )}

        <div className="w-full max-w-4xl overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-300">
            <thead>
              <tr className="bg-gray-100 text-center">
                <th className="py-3 px-4 border-b">Guest Name</th>
                <th className="py-3 px-4 border-b">Actions</th>
              </tr>
            </thead>
            <tbody>
              {guests.map((guest, index) => (
                <tr key={index} className="hover:bg-gray-50 text-center">
                  <td className="py-3 px-4 border-b">
                    {guest}
                  </td>
                  <td className="py-3 px-4 border-b flex justify-center space-x-2">
                    <button
                      onClick={() => openUpdateModal(guest)}
                      className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-700"
                    >
                      Update
                    </button>
                    <button
                      onClick={() => handleDelete(guest.id)}
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

export default Guests;