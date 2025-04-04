// Apartments.js
import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import NavBar from '../common/NavBar';
import Footer from '../common/Footer';
import OwnerMenu from '../owner/OwnerMenu';
import CreateApartmentModal from '../owner/CreateApartmentModal'; // Import the modal component
import { useTranslation } from 'react-i18next';

const Apartments = () => {
  const { t } = useTranslation();
  const [apartments, setApartments] = useState([]);
  const [locations, setLocations] = useState({});
  const [locationList, setLocationList] = useState([]);
  const [location, setLocation] = useState("");
  const [currencies, setCurrencies] = useState({});
  const [currencyList, setCurrencyList] = useState([]);
  const [currency, setCurrency] = useState("");
  const [facilities, setFacilities] = useState([]);
  const [selectedFacilities, setSelectedFacilities] = useState([]);
  const [userGroup, setUserGroup] = useState(null);
  const [userId, setUserId] = useState(null);
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [apartmentName, setApartmentName] = useState("");
  const [price, setPrice] = useState("");
  const [rooms, setRooms] = useState("");
  const [size, setSize] = useState("");
  const [error, setError] = useState("");
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [isUpdateMode, setIsUpdateMode] = useState(false);
  const [apartmentIdToUpdate, setApartmentIdToUpdate] = useState(null);

  // Fetch currencies, locations, and facilities
  useEffect(() => {
    fetch("http://localhost:8000/api/currencies/")
      .then((response) => response.json())
      .then((data) => setCurrencyList(data))
      .catch((error) => console.error("Error fetching currencies:", error));

    fetch("http://localhost:8000/api/locations/")
      .then((response) => response.json())
      .then((data) => setLocationList(data))
      .catch((error) => console.error("Error fetching locations:", error));

    fetch("http://localhost:8000/api/facilities/")
      .then((response) => response.json())
      .then((data) => setFacilities(data))
      .catch((error) => console.error("Error fetching facilities:", error));
  }, []);

  useEffect(() => {
    const storedUserId = localStorage.getItem("user_id");
    let storedGroups = [];

    const rawGroups = localStorage.getItem("groups");
    console.log("Raw groups data from localStorage:", rawGroups);

    try {
      let parsedGroups;
      // First try to parse as JSON
      if (rawGroups) {
        try {
          parsedGroups = JSON.parse(rawGroups);
        } catch (e) {
          // If parsing fails, treat it as a plain string
          parsedGroups = rawGroups;
        }
      }
      
      // Handle the parsed result
      if (!rawGroups) {
        storedGroups = [];
      } else if (Array.isArray(parsedGroups)) {
        storedGroups = parsedGroups;
      } else {
        // If it's a single item (either from JSON parse or plain string), wrap it in an array
        storedGroups = [parsedGroups];
      }
    } catch (error) {
      console.error("Error processing groups from localStorage:", error);
      storedGroups = [];
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
    if (!window.confirm(t("are_you_sure_delete_apartment"))) return;

    try {
      const response = await fetch(`http://localhost:8000/api/apartments/${apartmentId}/`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (response.ok) {
        setApartments((prev) => prev.filter((apt) => apt.id !== apartmentId));
        alert(t("apartment_deleted_successfully"));
      } else {
        alert(t("error_deleting_apartment"));
      }
    } catch (error) {
      console.error("Error deleting apartment:", error);
      alert(t("error_occurred_try_again"));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const apartmentPayload = {
        apartment_name: apartmentName,
        price: parseFloat(price),
        currency: parseInt(currency, 10),
        location: parseInt(location, 10),
        rooms: parseInt(rooms, 10),
        size: parseFloat(size),
        facilities: selectedFacilities,
        owner: parseInt(userId, 10),
      };

      let response;
      if (isUpdateMode) {
        response = await fetch(`http://localhost:8000/api/apartments/${apartmentIdToUpdate}/`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(apartmentPayload),
        });
      } else {
        response = await fetch("http://localhost:8000/api/apartments/?Content-Type=application/json", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(apartmentPayload),
        });
      }

      if (!response.ok) {
        throw new Error(t("failed_create_update_apartment"));
      }

      const data = await response.json();
      console.log("Apartment created/updated:", data);

      if (isUpdateMode && selectedFiles.length > 0) {
        const apartmentId = apartmentIdToUpdate || data.id;
        console.log("Selected Files:", selectedFiles);
        await Promise.all(
          selectedFiles.map(async (file) => {
            const formData = new FormData();
            formData.append("image", file);
            formData.append("size_in_bytes", file.size);
            formData.append("format", file.type.split("/")[1].toUpperCase());
            formData.append("apartment", apartmentId);

            console.log("header for tokens: ", "Token "+localStorage.getItem("token"));

            const uploadResponse = await fetch("http://localhost:8000/api/pictures/", {
              method: "POST",
              headers: {
                "Authorization": "Token "+localStorage.getItem("token")
              },
              body: formData,
            });

            if (!uploadResponse.ok) {
              const errorText = await uploadResponse.text();
              throw new Error(`${t("failed_upload_picture")}: ${errorText}`);
            }
          })
        );
      }

      alert(t("apartment_created_updated_successfully"));
      setIsModalOpen(false);
      window.location.reload();
    } catch (error) {
      console.error("Error creating/updating apartment:", error);
      setError(t("failed_create_update_apartment_try_again"));
    }
  };

  const handleFacilityChange = (facilityId) => {
    setSelectedFacilities((prev) =>
      prev.includes(facilityId)
        ? prev.filter((id) => id !== facilityId)
        : [...prev, facilityId]
    );
  };

  const handleFileChange = (e) => {
    setSelectedFiles([...e.target.files]);
  };

  const openCreateModal = () => {
    setIsUpdateMode(false);
    setApartmentIdToUpdate(null);
    setApartmentName("");
    setPrice("");
    setCurrency("");
    setLocation("");
    setRooms("");
    setSize("");
    setSelectedFacilities([]);
    setSelectedFiles([]);
    setIsModalOpen(true);
  };

  const openUpdateModal = (apartment) => {
    setIsUpdateMode(true);
    setApartmentIdToUpdate(apartment.id);
    setApartmentName(apartment.apartment_name);
    setPrice(apartment.price);
    setCurrency(apartment.currency);
    setLocation(apartment.location);
    setRooms(apartment.rooms);
    setSize(apartment.size);
    setSelectedFacilities(apartment.facilities);
    setSelectedFiles([]);
    setIsModalOpen(true);
  };

  return (
    <div className="h-screen flex flex-col">
      <NavBar />
      {userGroup === "Owners" && <OwnerMenu />}
      <div className="flex flex-1 flex-col items-center mt-16">
        <h1 className="text-3xl font-bold mb-8">{t("apartments")}</h1>

        {userGroup === "Owners" && apartments.length === 0 && (
          <p className="text-red-600 font-semibold mb-4">
            {t("no_apartments_available")}
          </p>
        )}

        {userGroup === "Owners" && (
          <button
            onClick={openCreateModal}
            className="bg-blue-500 text-white px-4 py-2 rounded-md mb-4 hover:bg-blue-700"
          >
            {t("create_apartment")}
          </button>
        )}

        {/* Render the modal component */}
        <CreateApartmentModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSubmit={handleSubmit}
          isUpdateMode={isUpdateMode}
          apartmentName={apartmentName}
          setApartmentName={setApartmentName}
          price={price}
          setPrice={setPrice}
          currency={currency}
          setCurrency={setCurrency}
          location={location}
          setLocation={setLocation}
          rooms={rooms}
          setRooms={setRooms}
          size={size}
          setSize={setSize}
          selectedFacilities={selectedFacilities}
          handleFacilityChange={handleFacilityChange}
          selectedFiles={selectedFiles}
          handleFileChange={handleFileChange}
          error={error}
          currencyList={currencyList}
          locationList={locationList}
          facilities={facilities}
        />

        <div className="w-full max-w-4xl overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-300">
            <thead>
              <tr className="bg-gray-100 text-center">
                <th className="py-3 px-4 border-b">{t("apartment_name")}</th>
                <th className="py-3 px-4 border-b">{t("price")}</th>
                <th className="py-3 px-4 border-b">{t("location")}</th>
                {userGroup === "Owners" && <th className="py-3 px-4 border-b">{t("actions")}</th>}
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
                    {apartment.price} {currencies[apartment.currency] || t("loading")}
                  </td>
                  <td className="py-3 px-4 border-b">
                    {locations[apartment.location] || t("loading")}
                  </td>
                  {userGroup === "Owners" && (
                    <td className="py-3 px-4 border-b flex justify-center space-x-2">
                      <button
                        onClick={() => openUpdateModal(apartment)}
                        className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-700"
                      >
                        {t("update")}
                      </button>
                      <button
                        onClick={() => handleDelete(apartment.id)}
                        className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-700"
                      >
                        {t("delete")}
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