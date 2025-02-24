import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import NavBar from '../common/NavBar';
import Footer from '../common/Footer';
import OwnerMenu from '../owner/OwnerMenu';

const Apartments = () => {
  const [apartments, setApartments] = useState([]);
  const [locations, setLocations] = useState({});
  const [currencies, setCurrencies] = useState({});
  const [userGroup, setUserGroup] = useState(null);
  const [userId, setUserId] = useState(null);
  const navigate = useNavigate();

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
      .then(response => response.json())
      .then(data => {
        setApartments(data);
        data.forEach(apartment => {
          fetch(`http://localhost:8000/api/locations/${apartment.location}/`)
            .then(response => response.json())
            .then(locationData => {
              setLocations(prev => ({ ...prev, [apartment.location]: locationData.name }));
            });

          fetch(`http://localhost:8000/api/currencies/${apartment.currency}/`)
            .then(response => response.json())
            .then(currencyData => {
              setCurrencies(prev => ({ ...prev, [apartment.currency]: currencyData.code }));
            });
        });
      })
      .catch(error => console.error("Error fetching apartments:", error));
  }, []);

  const handleDelete = async (apartmentId) => {
    if (!window.confirm("Are you sure you want to delete this apartment?")) return;

    try {
      const response = await fetch(`http://localhost:8000/api/apartments/${apartmentId}/`, {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (response.ok) {
        setApartments(prev => prev.filter(apt => apt.id !== apartmentId));
        alert("Apartment deleted successfully!");
      } else {
        alert("Error deleting apartment. Please try again.");
      }
    } catch (error) {
      console.error("Error deleting apartment:", error);
      alert("An error occurred. Please try again.");
    }
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
            onClick={() => navigate("/create-apartment")}
            className="bg-blue-500 text-white px-4 py-2 rounded-md mb-4 hover:bg-blue-700"
          >
            Create Apartment
          </button>
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
              {apartments.map(apartment => (
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
