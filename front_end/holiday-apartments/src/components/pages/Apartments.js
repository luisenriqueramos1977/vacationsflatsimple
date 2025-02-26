import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import NavBar from '../common/NavBar';
import Footer from '../common/Footer';
import OwnerMenu from '../owner/OwnerMenu';

const Apartments = () => {
  const [apartments, setApartments] = useState([]);
  const [locations, setLocations] = useState({}); // For storing location names
  const [locationList, setLocationList] = useState([]); // For storing the list of locations
  const [location, setLocation] = useState(""); // For storing the selected location ID
  const [currencies, setCurrencies] = useState({}); // For storing currency codes
  const [currencyList, setCurrencyList] = useState([]); // For storing the list of currencies
  const [currency, setCurrency] = useState(""); // For storing the selected currency ID
  const [facilities, setFacilities] = useState([]); // For storing the list of facilities
  const [selectedFacilities, setSelectedFacilities] = useState([]); // For storing selected facility IDs
  const [userGroup, setUserGroup] = useState(null);
  const [userId, setUserId] = useState(null);
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [apartmentName, setApartmentName] = useState("");
  const [price, setPrice] = useState("");
  const [rooms, setRooms] = useState("");
  const [size, setSize] = useState("");
  const [error, setError] = useState("");

  // Fetch currencies from the API
  useEffect(() => {
    fetch("http://localhost:8000/api/currencies/")
      .then((response) => response.json())
      .then((data) => setCurrencyList(data)) // Set the list of currencies
      .catch((error) => console.error("Error fetching currencies:", error));
  }, []);

  // Fetch locations from the API
  useEffect(() => {
    fetch("http://localhost:8000/api/locations/")
      .then((response) => response.json())
      .then((data) => setLocationList(data)) // Set the list of locations
      .catch((error) => console.error("Error fetching locations:", error));
  }, []);

  // Fetch facilities from the API
  useEffect(() => {
    fetch("http://localhost:8000/api/facilities/")
      .then((response) => response.json())
      .then((data) => setFacilities(data)) // Set the list of facilities
      .catch((error) => console.error("Error fetching facilities:", error));
  }, []);

  useEffect(() => {
    const storedUserId = localStorage.getItem("user_id");
    const storedGroups = JSON.parse(localStorage.getItem("groups") || "[]");

    if (storedUserId) {
      setUserId(parseInt(storedUserId, 10));
    }

    if (storedGroups.includes("Owners")) {
      setUserGroup("Owners");
    }

    const endpoint = storedGroups.includes("Owners") && storedUserId
      ? `http://localhost:8000/api/apartments/?owner=${storedUserId}`
      : `http://localhost:8000/api/apartments/`;

    fetch(endpoint)
      .then((response) => response.json())
      .then((data) => {
        setApartments(data);
        data.forEach((apartment) => {
          fetch(`http://localhost:8000/api/locations/${apartment.location}/`)
            .then((response) => response.json())
            .then((locationData) => {
              setLocations((prev) => ({ ...prev, [apartment.location]: locationData.name }));
            });

          fetch(`http://localhost:8000/api/currencies/${apartment.currency}/`)
            .then((response) => response.json())
            .then((currencyData) => {
              setCurrencies((prev) => ({ ...prev, [apartment.currency]: currencyData.code }));
            });
        });
      })
      .catch((error) => console.error("Error fetching apartments:", error));
  }, []);

  const handleDelete = async (apartmentId) => {
    if (!window.confirm("Are you sure you want to delete this apartment?")) return;

    try {
      const response = await fetch(`http://localhost:8000/api/apartments/${apartmentId}/`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (response.ok) {
        setApartments((prev) => prev.filter((apt) => apt.id !== apartmentId));
        alert("Apartment deleted successfully!");
      } else {
        alert("Error deleting apartment. Please try again.");
      }
    } catch (error) {
      console.error("Error deleting apartment:", error);
      alert("An error occurred. Please try again.");
    }
  };

  // Function to handle form submission to create apartment
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("http://localhost:8000/api/apartments/?Content-Type=application/json", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          apartment_name: apartmentName,
          price: parseFloat(price),
          currency: parseInt(currency, 10), // Use selected currency ID
          location: parseInt(location, 10), // Use selected location ID
          rooms: parseInt(rooms, 10),
          size: parseFloat(size),
          facilities: selectedFacilities, // Use selected facility IDs
          owner: parseInt(userId, 10),
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to create apartment");
      }

      const data = await response.json();
      console.log("Apartment created:", data);
      alert("Apartment created successfully!");
      setIsModalOpen(false); // Close the modal
      // Refresh the apartment list
      window.location.reload();
    } catch (error) {
      console.error("Error creating apartment:", error);
      setError("Failed to create apartment. Please try again.");
    }
  };

  // Function to handle facility selection
  const handleFacilityChange = (facilityId) => {
    setSelectedFacilities((prev) =>
      prev.includes(facilityId)
        ? prev.filter((id) => id !== facilityId) // Remove if already selected
        : [...prev, facilityId] // Add if not selected
    );
  };

  return (
    <div className="h-screen flex flex-col">
      <NavBar />
      {userGroup === "Owners" && <OwnerMenu />}
      <div className="flex flex-1 flex-col items-center mt-16">
        <h1 className="text-3xl font-bold mb-8">Apartments</h1>

        {userGroup === "Owners" && apartments.length === 0 && (
          <p className="text-red-600 font-semibold mb-4">
            No Apartments available, please create one.
          </p>
        )}

        {userGroup === "Owners" && (
          <button
            onClick={() => setIsModalOpen(true)}
            className="bg-blue-500 text-white px-4 py-2 rounded-md mb-4 hover:bg-blue-700"
          >
            Create Apartment
          </button>
        )}

        {/* Modal for creating a new apartment */}
        {isModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <div className="bg-white p-6 rounded-lg w-full max-w-md">
              <h2 className="text-xl font-bold mb-4">Create New Apartment</h2>
              <form onSubmit={handleSubmit}>
                {/* Apartment Name */}
                <div className="mb-4">
                  <label className="block text-gray-700">Apartment Name</label>
                  <input
                    type="text"
                    value={apartmentName}
                    onChange={(e) => setApartmentName(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-md"
                    required
                  />
                </div>

                {/* Price */}
                <div className="mb-4">
                  <label className="block text-gray-700">Price</label>
                  <input
                    type="number"
                    step="0.01"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-md"
                    required
                  />
                </div>

                {/* Currency */}
                <div className="mb-4">
                  <label className="block text-gray-700">Currency</label>
                  <select
                    value={currency}
                    onChange={(e) => setCurrency(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-md"
                    required
                  >
                    <option value="">Select Currency</option>
                    {currencyList.map((currency) => (
                      <option key={currency.id} value={currency.id}>
                        {currency.name} ({currency.code})
                      </option>
                    ))}
                  </select>
                </div>

                {/* Location */}
                <div className="mb-4">
                  <label className="block text-gray-700">Location</label>
                  <select
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-md"
                    required
                  >
                    <option value="">Select Location</option>
                    {locationList.map((location) => (
                      <option key={location.id} value={location.id}>
                        {location.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Rooms */}
                <div className="mb-4">
                  <label className="block text-gray-700">Rooms</label>
                  <input
                    type="number"
                    value={rooms}
                    onChange={(e) => setRooms(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-md"
                    required
                  />
                </div>

                {/* Size */}
                <div className="mb-4">
                  <label className="block text-gray-700">Size (sq. ft.)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={size}
                    onChange={(e) => setSize(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-md"
                    required
                  />
                </div>

                {/* Facilities */}
                <div className="mb-4">
                  <label className="block text-gray-700">Facilities</label>
                  <div className="grid grid-cols-2 gap-4">
                    {facilities.map((facility) => (
                      <div key={facility.id} className="flex items-center">
                        <input
                          type="checkbox"
                          id={`facility-${facility.id}`}
                          checked={selectedFacilities.includes(facility.id)}
                          onChange={() => handleFacilityChange(facility.id)}
                          className="mr-2"
                        />
                        <label htmlFor={`facility-${facility.id}`} className="flex items-center">
                          <img
                            src={facility.logo}
                            alt={facility.name}
                            className="w-6 h-6 mr-2"
                          />
                          {facility.name}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Pictures Note */}
                <div className="mb-4 text-gray-600">
                  <p>Pictures can be added when updating the apartment.</p>
                </div>

                {/* Error Message */}
                {error && <p className="text-red-500 mb-4">{error}</p>}

                {/* Buttons */}
                <div className="flex justify-end">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="bg-gray-500 text-white px-4 py-2 rounded-md mr-2 hover:bg-gray-600"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
                  >
                    Create
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        <div className="w-full max-w-4xl overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-300">
            <thead>
              <tr className="bg-gray-100 text-center">
                <th className="py-3 px-4 border-b">Apartment Name</th>
                <th className="py-3 px-4 border-b">Price</th>
                <th className="py-3 px-4 border-b">Location</th>
                {userGroup === "Owners" && <th className="py-3 px-4 border-b">Actions</th>}
              </tr>
            </thead>
            <tbody>
              {apartments.map((apartment) => (
                <tr key={apartment.id} className="hover:bg-gray-50 text-center">
                  <td className="py-3 px-4 border-b">
                    <Link to={`/apartments/${apartment.id}`} className="text-blue-600 hover:text-blue-800">
                      {apartment.apartment_name}
                    </Link>
                  </td>
                  <td className="py-3 px-4 border-b">
                    {apartment.price} {currencies[apartment.currency] || 'Loading...'}
                  </td>
                  <td className="py-3 px-4 border-b">
                    {locations[apartment.location] || 'Loading...'}
                  </td>
                  {userGroup === "Owners" && (
                    <td className="py-3 px-4 border-b flex justify-center space-x-2">
                      <button
                        onClick={() => navigate(`/update-apartment/${apartment.id}`)}
                        className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-700"
                      >
                        Update
                      </button>
                      <button
                        onClick={() => handleDelete(apartment.id)}
                        className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-700"
                      >
                        Delete
                      </button>
                    </td>
                  )}
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

export default Apartments;