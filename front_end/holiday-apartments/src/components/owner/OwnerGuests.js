import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import NavBar from '../common/NavBar';
import Footer from '../common/Footer';
import OwnerMenu from '../owner/OwnerMenu';

const Guests = () => {
  const [guests, setGuests] = useState([]);
  const [userGroup, setUserGroup] = useState(null);
  const [userId, setUserId] = useState(null);
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

      console.log("Unique guests:", uniqueGuests);

      setGuests(uniqueGuests);


    } catch (error) {
      console.error("Error fetching guests:", error);
    }
  };

  return (
    <div className="h-screen flex flex-col">
      <NavBar />
      {userGroup === "Owners" && <OwnerMenu />}
      <div className="flex flex-1 flex-col items-center mt-16">
        <h1 className="text-3xl font-bold mb-8">Guests</h1>

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
              </tr>
            </thead>
            <tbody>
              {guests.map((guest, index) => (
                <tr key={index} className="hover:bg-gray-50 text-center">
                  <td className="py-3 px-4 border-b">
                    {guest}
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