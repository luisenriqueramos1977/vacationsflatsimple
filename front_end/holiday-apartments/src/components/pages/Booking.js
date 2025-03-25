
import { useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import NavBar from "../common/NavBar";
import Footer from "../common/Footer";
import { useTranslation } from "react-i18next";

const Booking = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const filteredApartments = location.state?.filteredApartments || [];
  const startDate = location.state?.startDate; // Access startDate
  const endDate = location.state?.endDate; // Access endDate
  const [locations, setLocations] = useState({});
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Check if user is logged in (token in localStorage)
  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token);
  }, []);

  // Fetch location names based on IDs
  useEffect(() => {
    const fetchLocations = async () => {
      const locationData = {};
      for (const apartment of filteredApartments) {
        if (!apartment.location) continue;
        try {
          const response = await fetch(`http://localhost:8000/api/locations/${apartment.location}/`);
          const data = await response.json();
          locationData[apartment.location] = data.name; // Store location name
        } catch (error) {
          console.error("Error fetching location:", error);
        }
      }
      setLocations(locationData);
    };

    fetchLocations();
  }, [filteredApartments]);

  // Function to calculate the total number of days correctly
  const calculateBookingDays = (startDate, endDate) => {
    if (!startDate || !endDate) return 1; // Default to 1 day if dates are missing

    // Parse dates correctly for mm/dd/yyyy format
    const parseDate = (dateString) => {
      const [year, month, day] = dateString.split('-').map(Number);
      return new Date(year, month - 1, day); // Month is 0-indexed in JavaScript Date
    };

    const start = parseDate(startDate);
    const end = parseDate(endDate);

    if (isNaN(start) || isNaN(end)) return 1; // If dates are invalid, default to 1 day

    // Calculate the difference in days, including both start and end dates
    const differenceInMs = end.getTime() - start.getTime();
    const differenceInDays = Math.ceil(differenceInMs / (1000 * 60 * 60 * 24)) + 1;

    return Math.max(1, differenceInDays); // Ensure at least 1 day
  };

  // Function to handle booking
  const handleBook = async (apartment) => {
    const userId = localStorage.getItem("user_id");

    if (!userId) {
      alert(t("please_log_in"));
      return;
    }

    try {
      const response = await fetch("http://localhost:8000/api/bookings/?Content-Type=application/json", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          guest: parseInt(userId, 10),
          apartment: apartment.id,
          start_date: startDate,
          end_date: endDate,
        }),
      });

      if (!response.ok) {
        throw new Error(t("failed_to_book_apartment"));
      }

      alert(t("booking_successful"));
      navigate("/guest/dashboard"); // Redirect to Customer Dashboard
    } catch (error) {
      console.error("Error booking apartment:", error);
      alert(t("failed_to_book_apartment"));
    }
  };

  return (
    <div className="h-screen flex flex-col">
      <NavBar />
      <div className="flex flex-1 flex-col items-center justify-center mt-16">
        <h1 className="text-3xl font-bold mb-8">{t("booking")}</h1>

        {/* Display filtered apartments */}
        {filteredApartments.length > 0 ? (
          <div className="w-full max-w-4xl mx-auto">
            <h2 className="text-2xl font-semibold mb-4 text-center">{t("available_apartments")}</h2>
            <table className="w-full border-collapse border border-gray-300">
              <thead>
                <tr className="bg-gray-200 text-center">
                  <th className="border border-gray-300 p-3 text-center">{t("location")}</th>
                  <th className="border border-gray-300 p-3 text-center">{t("daily_price")}</th>
                  <th className="border border-gray-300 p-3 text-center">{t("total_booking_price")}</th>
                  <th className="border border-gray-300 p-3 text-center">{t("action")}</th>
                </tr>
              </thead>
              <tbody>
                {filteredApartments.map((apartment) => {
                  const dailyPrice = Number(apartment.price) || 0;
                  const bookingDays = calculateBookingDays(startDate, endDate);
                  const totalBookingPrice = dailyPrice * bookingDays;

                  return (
                    <tr key={apartment.id} className="bg-white text-center">
                      <td className="border border-gray-300 p-3">{locations[apartment.location] || t("loading")}</td>
                      <td className="border border-gray-300 p-3">${dailyPrice.toFixed(2)}</td>
                      <td className="border border-gray-300 p-3">${totalBookingPrice.toFixed(2)}</td>
                      <td className="border border-gray-300 p-3">
                        <button
                          onClick={() => handleBook(apartment)}
                          disabled={!isLoggedIn}
                          className={`bg-red-500 text-white px-4 py-2 rounded-md ${
                            isLoggedIn ? "hover:bg-red-600" : "opacity-50 cursor-not-allowed"
                          }`}
                        >
                          {t("book_now")}
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-gray-600">{t("no_apartments_found")}</p>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default Booking;