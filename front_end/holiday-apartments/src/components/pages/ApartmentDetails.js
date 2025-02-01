import NavBar from "./NavBar";
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from '../../api/api';

function ApartmentDetails() {
  const { id } = useParams();
  const [apartment, setApartment] = useState(null);

  useEffect(() => {
    axios.get(`/api/apartments/${id}/`)
      .then(response => setApartment(response.data))
      .catch(error => console.error('Error fetching apartment details:', error));
  }, [id]);

  if (!apartment) return <p>Loading...</p>;

  return (
    <div>
      <h1>{apartment.name}</h1>
      <p>{apartment.description}</p>
      <p>Price: {apartment.price}</p>
      <div>
        <h3>Pictures</h3>
        {apartment.pictures.map(picture => (
          <img key={picture.id} src={picture.url} alt={apartment.name} style={{ width: '200px' }} />
        ))}
      </div>
      <Link to={`/booking/${apartment.id}`}>Book Now</Link>
    </div>
  );
}

export default ApartmentDetails;
