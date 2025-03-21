import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css"; // Import carousel styles
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css"; // Import calendar styles
import NavBar from "../common/NavBar";
import Footer from "../common/Footer";

const ApartmentDetails = () => {
  const { id } = useParams(); // Get the apartment ID from the URL
  const [apartment, setApartment] = useState(null);
  const [locationName, setLocationName] = useState("");
  const [currencyName, setCurrencyName] = useState("");
  const [bookings, setBookings] = useState([]);

  // Fetch apartment details based on the ID
  useEffect(() => {
    fetch(`http://localhost:8000/api/apartments/${id}/`)
      .then((response) => response.json())
      .then((data) => {
        setApartment(data);

        // Fetch location details
        fetch(`http://localhost:8000/api/locations/${data.location}/`)
          .then((res) => res.json())
          .then((locationData) => setLocationName(locationData.name))
          .catch((error) => console.error("Error fetching location:", error));

        // Fetch currency details
        fetch(`http://localhost:8000/api/currencies/${data.currency}/`)
          .then((res) => res.json())
          .then((currencyData) => setCurrencyName(currencyData.name))
          .catch((error) => console.error("Error fetching currency:", error));
      })
      .catch((error) => console.error("Error fetching apartment details:", error));
  }, [id]);

  // Fetch bookings for the apartment
  useEffect(() => {
    fetch(`http://localhost:8000/api/apartments/${id}/bookings/`)
      .then((response) => response.json())
      .then((data) => setBookings(data))
      .catch((error) => console.error("Error fetching bookings:", error));
  }, [id]);

  if (!apartment) {
    return <div>Loading...</div>;
  }

  // Function to determine if a date is booked
  const isBooked = (date) => {
    return bookings.some((booking) => {
      const startDate = new Date(booking.start_date);
      const endDate = new Date(booking.end_date);
      return date >= startDate && date <= endDate;
    });
  };

  // Function to apply tile class based on booking status
  const tileClassName = ({ date, view }) => {
    if (view === "month" && isBooked(date)) {
      return "booked";
    }
  };

  return (
    <div className="h-screen flex flex-col">
      <NavBar />
      <div className="flex flex-1 items-center justify-center p-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl w-full">
          {/* Left Column: Apartment Information */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h1 className="text-3xl font-bold mb-4">{apartment.apartment_name}</h1>
            <p className="text-lg mb-2">
              <span className="font-semibold">Price:</span> {apartment.price} {currencyName}
            </p>
            <p className="text-lg mb-2">
              <span className="font-semibold">Location:</span> {locationName}
            </p>
            <p className="text-lg mb-2">
              <span className="font-semibold">Rooms:</span> {apartment.rooms}
            </p>
            <p className="text-lg mb-2">
              <span className="font-semibold">Size:</span> {apartment.size} sqm
            </p>
            <h2 className="text-xl font-bold mt-4 mb-2">Availability</h2>
            <Calendar
              className="custom-calendar"
              tileClassName={tileClassName}
            />
          </div>

          {/* Right Column: Pictures Carousel */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-bold mb-4">Pictures</h2>
            <Carousel showThumbs={false} infiniteLoop useKeyboardArrows autoPlay>
              {apartment.pictures.map((picture) => (
                <div key={picture.id}>
                  <img
                    src={`http://localhost:8000${picture.image}`}
                    alt={picture.tags.join(", ")}
                    className="rounded-lg"
                  />
                </div>
              ))}
            </Carousel>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default ApartmentDetails;