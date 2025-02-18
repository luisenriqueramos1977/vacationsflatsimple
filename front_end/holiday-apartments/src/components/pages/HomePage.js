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

  const handleSearch = async () => {
    const queryParams = new URLSearchParams({
      location,
      min_price: minPrice,
      max_price: maxPrice,
      start_date: startDate,
      end_date: endDate,
    }).toString();

    try {
      // Fetch filtered apartments
      const response = await fetch(`http://localhost:8000/api/apartments/filter?${queryParams}`);
      if (!response.ok) {
        throw new Error("Failed to fetch filtered apartments");
      }

      const data = await response.json();

      // Check if the result is not empty
      if (data.length > 0) {
        // Redirect to Booking.js and pass the results as state
        navigate("/booking", { state: { filteredApartments: data } });
      } else {
        alert("No apartments found matching your criteria.");
      }
    } catch (error) {
      console.error("Error fetching filtered apartments:", error);
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

