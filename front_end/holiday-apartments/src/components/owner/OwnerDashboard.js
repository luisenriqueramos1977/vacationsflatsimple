import { useState, useEffect } from "react";
import OwnerMenu from "../owner/OwnerMenu";
import NavBar from "../common/NavBar";
import Footer from "../common/Footer";

const OwnerDashboard = () => {
  const [totalApartments, setTotalApartments] = useState(0);
  const [totalBookings, setTotalBookings] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Check if the user is an owner
        const groups = JSON.parse(localStorage.getItem("groups") || "[]");
        if (!groups.includes("Owners")) {
          console.error("User is not an owner.");
          return;
        }

        // Fetch user ID from local storage
        const userId = localStorage.getItem("user_id");
        if (!userId) {
          console.error("User ID not found in local storage");
          return;
        }

        // Fetch apartments owned by the user
        const apartmentsResponse = await fetch(`http://localhost:8000/api/apartments/?owner=${userId}`);
        const apartmentsData = await apartmentsResponse.json();
        setTotalApartments(apartmentsData.length);

        // Fetch all bookings
        const bookingsResponse = await fetch("http://localhost:8000/api/bookings/");
        const bookingsData = await bookingsResponse.json();

        // Filter bookings to count only those for the user's apartments
        const userApartmentIds = apartmentsData.map((apartment) => apartment.id);
        const userBookings = bookingsData.filter((booking) =>
          userApartmentIds.includes(booking.apartment)
        );

        // Set the total number of bookings
        setTotalBookings(userBookings.length);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="flex min-h-screen">
      <NavBar />
      {/* Sidebar Menu */}
      <OwnerMenu />

      {/* Main Content */}
      <div className="ml-64 p-6 w-full">
        <h1 className="text-3xl font-bold mb-4">Owner Dashboard</h1>
        <p className="text-gray-600">Manage your properties, guests, and bookings here.</p>

        {/* Content Sections */}
        <div className="mt-6 grid grid-cols-3 gap-4">
          {/* Total Apartments - Now Dynamic */}
          <div className="bg-blue-100 p-4 rounded-lg shadow-md">
            <h2 className="text-lg font-semibold">Total Apartments</h2>
            <p className="text-xl font-bold">{totalApartments}</p>
          </div>

          {/* Total Bookings - Now Dynamic */}
          <div className="bg-green-100 p-4 rounded-lg shadow-md">
            <h2 className="text-lg font-semibold">Total Bookings</h2>
            <p className="text-xl font-bold">{totalBookings}</p>
          </div>

          {/* Pending Reviews - Static for now */}
          <div className="bg-yellow-100 p-4 rounded-lg shadow-md">
            <h2 className="text-lg font-semibold">Pending Reviews</h2>
            <p className="text-xl font-bold">8</p>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default OwnerDashboard;

