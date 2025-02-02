import { useState } from "react";
import { useNavigate } from "react-router-dom";
import NavBar from "../common/NavBar";
import Footer from "../common/Footer";

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

      {/* Main Content */}
      <div className="flex-grow flex flex-col items-center justify-center">
        <h1 className="text-3xl font-bold">Welcome to Holiday Apartments</h1>

        {/* Search Bar Container */}
        <div className="flex items-center justify-center gap-4 mt-10">
          {/* Input fields */}
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
          {/* Search Button */}
          <button
            onClick={handleSearch}
            className="w-[50mm] h-[15mm] bg-red-500 text-white font-bold border-2 border-gold"
          >
            Search
          </button>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default HomePage;

