import NavBar from "../common/NavBar";
import Footer from "../common/Footer";

import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

const ApartmentDetails = () => {
  const { id } = useParams(); // Get the apartment ID from the URL
  const [apartment, setApartment] = useState(null);

  // Fetch apartment details based on the ID
  useEffect(() => {
    fetch(`http://localhost:8000/api/apartments/${id}/`)
      .then((response) => response.json())
      .then((data) => setApartment(data))
      .catch((error) => console.error('Error fetching apartment details:', error));
  }, [id]);

  if (!apartment) {
    return <div>Loading...</div>;
  }

  return (
    <div className="p-8">
            <NavBar />
      <h1 className="text-3xl font-bold mb-4">{apartment.apartment_name}</h1>
      <p>Price: {apartment.price} {apartment.currency}</p>
      <p>Location: {apartment.location}</p>
      <p>Rooms: {apartment.rooms}</p>
      <p>Size: {apartment.size} sqm</p>
      <div>
        <h2 className="text-xl font-bold mt-4">Pictures:</h2>
        {apartment.pictures.map((picture) => (
          <img
            key={picture.id}
            src={`http://localhost:8000${picture.image}`}
            alt={picture.tags.join(', ')}
            className="mt-2"
          />
        ))}
      </div>
      <Footer />

    </div>
  );
};

export default ApartmentDetails;