import { useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import NavBar from "../common/NavBar";
import Footer from "../common/Footer";

const Booking = () => {
  const location = useLocation();
  const filteredApartments = location.state?.filteredApartments || [];
  const startDate = location.state?.startDate; // Access startDate
  const endDate = location.state?.endDate; // Access endDate
  const [locations, setLocations] = useState({});

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
    console.log('fechas check calculateBookingDays')
    console.log(startDate)
    console.log(endDate)
    if (!startDate || !endDate) return 1; // Default to 1 day if dates are missing

    // Parse dates correctly for mm/dd/yyyy format
    const parseDate = (dateString) => {
      const [year,month, day] = dateString.split('-').map(Number);
      return new Date(year, month - 1, day); // Month is 0-indexed in JavaScript Date
    };

    const start = parseDate(startDate);
    const end = parseDate(endDate);

    console.log('fechas check parsed')
    console.log(startDate)
    console.log(endDate)


    if (isNaN(start) || isNaN(end)) return 1; // If dates are invalid, default to 1 day

    // Calculate the difference in days, including both start and end dates
    const differenceInMs = end.getTime() - start.getTime();
    const differenceInDays = Math.ceil(differenceInMs / (1000 * 60 * 60 * 24)) + 1;

    return Math.max(1, differenceInDays); // Ensure at least 1 day
  };

  return (
    <div className="h-screen flex flex-col">
      <NavBar />
      <div className="flex flex-1 flex-col items-center justify-center mt-16">
        <h1 className="text-3xl font-bold mb-8">Booking</h1>
  
        {/* Display filtered apartments */}
        {filteredApartments.length > 0 ? (
          <div className="w-full max-w-4xl mx-auto">
            <h2 className="text-2xl font-semibold mb-4">Available Apartments</h2>
            <table className="w-full border-collapse border border-gray-300">
              <thead>
                <tr className="bg-gray-200">
                  <th className="border border-gray-300 p-3 text-left">Location</th>
                  <th className="border border-gray-300 p-3 text-left">Daily Price</th>
                  <th className="border border-gray-300 p-3 text-left">Total Booking Price</th>
                </tr>
              </thead>
              <tbody>
                {filteredApartments.map((apartment) => {
                  const dailyPrice = Number(apartment.price) || 0;
                  const bookingDays = calculateBookingDays(startDate, endDate);
                  const totalBookingPrice = dailyPrice * bookingDays;
  
                  return (
                    <tr key={apartment.id} className="bg-white">
                      <td className="border border-gray-300 p-3">{locations[apartment.location] || "Loading..."}</td>
                      <td className="border border-gray-300 p-3">${dailyPrice.toFixed(2)}</td>
                      <td className="border border-gray-300 p-3">${totalBookingPrice.toFixed(2)}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-gray-600">No apartments found matching your criteria.</p>
        )}
      </div>
      <Footer />
    </div>
  );  
};

export default Booking;