import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import NavBar from '../common/NavBar';
import Footer from '../common/Footer';
import OwnerMenu from '../owner/OwnerMenu';
import { useTranslation } from 'react-i18next';

const Guests = () => {
  const { t } = useTranslation();
  const [guests, setGuests] = useState([]);
  const [userGroup, setUserGroup] = useState(null);
  const [userId, setUserId] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const storedUserId = localStorage.getItem("user_id");
    const rawGroups = localStorage.getItem("groups");
    let storedGroups = [];
    if (rawGroups) {
      try {
        // Attempt to parse as JSON
        const parsed = JSON.parse(rawGroups);
        // Handle both array and single string cases
        storedGroups = Array.isArray(parsed) ? parsed : [parsed];
      } catch {
        // If JSON parsing fails, treat as plain string
        storedGroups = [rawGroups];
      }
    }

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
      const token = localStorage.getItem("token");
      const myHeaders = new Headers();
      myHeaders.append("Content-Type", "application/json");
      myHeaders.append("Authorization", `Token ${token}`);

      // Fetch apartments of the current owner
      const apartmentsResponse = await fetch(`http://localhost:8000/api/apartments/?owner=${ownerId}`, {
        method: "GET",
        headers: myHeaders,
      });
      const apartments = await apartmentsResponse.json();
      const apartmentIds = apartments.map(apartment => apartment.id);

      // Fetch bookings
      const bookingsResponse = await fetch("http://localhost:8000/api/bookings/", {
        method: "GET",
        headers: myHeaders,
      });
      const bookings = await bookingsResponse.json();

      // Filter bookings related to the owner's apartments
      const ownerBookings = bookings.filter(booking => apartmentIds.includes(booking.apartment));

      // Extract unique guest IDs
      const uniqueGuestIds = [...new Set(ownerBookings.map(booking => booking.guest_id))];

      console.log("Unique Guest IDs:", uniqueGuestIds); // Debugging line

      // Fetch guest details
      const guestDetails = await Promise.all(uniqueGuestIds.map(async (guestId) => {
        const guestResponse = await fetch(`http://localhost:8000/api/groups/guests/${guestId}/`, {
          method: "GET",
          headers: myHeaders,
        });
        return guestResponse.json();
      }));

      setGuests(guestDetails);
    } catch (error) {
      console.error(t("error_fetching_guests"), error);
    }
  };

  return (
    <div className="h-screen flex flex-col">
      <NavBar />
      {userGroup === "Owners" && <OwnerMenu />}
      <div className="flex flex-1 flex-col items-center mt-16">
        <h1 className="text-3xl font-bold mb-8">{t("guests")}</h1>

        {userGroup === "Owners" && guests.length === 0 && (
          <p className="text-red-600 font-semibold mb-4">
            {t("no_guests_found")}
          </p>
        )}

        <div className="w-full max-w-4xl overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-300">
            <thead>
              <tr className="bg-gray-100 text-center">
                <th className="py-3 px-4 border-b">{t("username")}</th>
                <th className="py-3 px-4 border-b">{t("email")}</th>
                <th className="py-3 px-4 border-b">{t("first_name")}</th>
                <th className="py-3 px-4 border-b">{t("last_name")}</th>
              </tr>
            </thead>
            <tbody>
              {guests.map((guest, index) => (
                <tr key={index} className="hover:bg-gray-50 text-center">
                  <td className="py-3 px-4 border-b">
                    {guest.username}
                  </td>
                  <td className="py-3 px-4 border-b">
                    {guest.email}
                  </td>
                  <td className="py-3 px-4 border-b">
                    {guest.first_name}
                  </td>
                  <td className="py-3 px-4 border-b">
                    {guest.last_name}
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