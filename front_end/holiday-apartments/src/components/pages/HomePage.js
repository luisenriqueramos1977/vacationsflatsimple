import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import { Navigation } from "swiper/modules";
import NavBar from "../common/NavBar";
import Footer from "../common/Footer";

const HomePage = () => {
  const [location, setLocation] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [apartmentImages, setApartmentImages] = useState([]); // State for images
  const [error, setError] = useState("");

  const navigate = useNavigate();

  // Function to load PayPal SDK script
  const loadPayPalScript = (clientId) => {
    return new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.src = `https://www.paypal.com/sdk/js?client-id=${clientId}`;
      script.onload = () => resolve();
      script.onerror = () => reject(new Error('PayPal SDK could not be loaded.'));
      document.body.appendChild(script);
    });
  };

  // Fetch images from the API
  useEffect(() => {
    const fetchImages = async () => {
      try {
        const response = await fetch("http://localhost:8000/api/pictures/");
        if (!response.ok) {
          throw new Error("Failed to fetch images");
        }

        const data = await response.json();

        // Extract image URLs from API response
        const images = data.map((item) => item.image);
        setApartmentImages(images);
      } catch (error) {
        console.error("Error fetching images:", error);
        setError("Failed to load images. Please try again later.");
      }
    };

    fetchImages();
  }, []);

  // Load PayPal SDK
  useEffect(() => {
    const clientId = "YOUR_PAYPAL_CLIENT_ID"; // Replace with your PayPal client ID
    loadPayPalScript(clientId)
      .then(() => {
        console.log("PayPal SDK loaded successfully.");
      })
      .catch((error) => {
        console.error("Error loading PayPal SDK:", error);
      });
  }, []);

  const handleSearch = async () => {
    try {
      // Step 1: Get the location ID from the name
      const locationResponse = await fetch(`http://localhost:8000/api/locations/?name=${location}`);
      if (!locationResponse.ok) {
        throw new Error("Failed to fetch location");
      }

      const locationData = await locationResponse.json();
      
      if (locationData.length === 0) {
        alert("Location not found. Please enter a valid location.");
        return;
      }

      const locationId = locationData[0].id; // Get the first matching location ID

      // Step 2: Use the location ID to search for apartments
      const queryParams = new URLSearchParams({
        location: locationId, // Use location ID instead of name
        min_price: minPrice,
        max_price: maxPrice,
        start_date: startDate,
        end_date: endDate,
      }).toString();

      const apartmentResponse = await fetch(`http://localhost:8000/api/apartments/filter?${queryParams}`);
      if (!apartmentResponse.ok) {
        throw new Error("Failed to fetch filtered apartments");
      }

      const apartmentData = await apartmentResponse.json();

      // Step 3: Redirect to Booking.js with results
      if (apartmentData.length > 0) {

        navigate("/booking", {
            state: {
              filteredApartments: apartmentData,
              startDate, // Pass startDate
              endDate, // Pass endDate
            },
          });

      } else {
        alert("No apartments found matching your criteria.");
      }
    } catch (error) {
      console.error("Error during search:", error);
      setError("Failed to fetch apartments. Please try again later.");
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <NavBar />

      <h1 className="text-3xl font-bold text-center mt-4">Welcome to Holiday Apartments</h1>

      {/* Search Bar */}
      <div className="flex items-center justify-center gap-4 mt-10">
        {[
          { placeholder: "Location", value: location, setValue: setLocation },
          { placeholder: "Min Price", value: minPrice, setValue: setMinPrice },
          { placeholder: "Max Price", value: maxPrice, setValue: setMaxPrice },
          { placeholder: "Start Date", value: startDate, setValue: setStartDate, type: "date" },
          { placeholder: "End Date", value: endDate, setValue: setEndDate, type: "date" },
        ].map(({ placeholder, value, setValue, type = "text" }, index) => (
          <input
            key={index}
            type={type}
            placeholder={placeholder}
            value={value}
            onChange={(e) => setValue(e.target.value)}
            className="border-2 border-gold w-[50mm] h-[15mm] px-2 text-center"
          />
        ))}
        <button
          onClick={handleSearch}
          className="w-[50mm] h-[15mm] bg-red-500 text-white font-bold border-2 border-gold"
        >
          Search
        </button>
      </div>

      {/* Apartment Carousel */}
      <div className="w-full max-w-4xl mx-auto mt-10">
        {error ? (
          <p className="text-red-500 text-center">{error}</p>
        ) : (
          <Swiper
            modules={[Navigation]}
            spaceBetween={20}
            slidesPerView={3}
            navigation
            loop={true}
            className="rounded-lg shadow-lg"
          >
            {apartmentImages.length > 0 ? (
              apartmentImages.map((src, index) => (
                <SwiperSlide key={index}>
                  <img src={src} alt={`Apartment ${index + 1}`} className="w-full h-64 object-cover rounded-lg" />
                </SwiperSlide>
              ))
            ) : (
              <SwiperSlide>
                <p className="text-center text-gray-500">No images available</p>
              </SwiperSlide>
            )}
          </Swiper>
        )}
      </div>

      <Footer />
    </div>
  );
};

export default HomePage;