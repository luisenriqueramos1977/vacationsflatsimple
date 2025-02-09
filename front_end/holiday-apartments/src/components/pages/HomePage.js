import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import { Navigation } from "swiper/modules";
import NavBar from "../common/NavBar";
import Footer from "../common/Footer";

const apartmentImages = [
  "/images/apartment1.jpg",
  "/images/apartment2.jpg",
  "/images/apartment3.jpg",
  "/images/apartment4.jpg",
  "/images/apartment5.jpg",
];

const HomePage = () => {
  const [location, setLocation] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const navigate = useNavigate();

  const handleSearch = () => {
    const queryParams = new URLSearchParams({
      location,
      min_price: minPrice,
      max_price: maxPrice,
      start_date: startDate,
      end_date: endDate,
    }).toString();

    navigate(`/api/apartments/filter?${queryParams}`);
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

      {/* Apartment Carousel (Now Below the Search Button) */}
      <div className="w-full max-w-4xl mx-auto mt-10">
        <Swiper
          modules={[Navigation]}
          spaceBetween={20}
          slidesPerView={3}
          navigation
          loop={true}
          className="rounded-lg shadow-lg"
        >
          {apartmentImages.map((src, index) => (
            <SwiperSlide key={index}>
              <img src={src} alt={`Apartment ${index + 1}`} className="w-full h-64 object-cover rounded-lg" />
            </SwiperSlide>
          ))}
        </Swiper>
      </div>

      <Footer />
    </div>
  );
};

export default HomePage;
