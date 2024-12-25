import React, { useState, useEffect } from 'react';
import axios from '../api/api';
import { Link } from 'react-router-dom';

function ApartmentList({ locationId }) {
  const [apartments, setApartments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get('/api/apartments/', { params: { location: locationId } })
      .then(response => {
        setApartments(response.data);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching apartments:', error);
        setLoading(false);
      });
  }, [locationId]);

  if (loading) return <p>Loading apartments...</p>;

  return (
    <div>
      <h2>Apartments</h2>
      {apartments.map(apartment => (
        <div key={apartment.id} className="apartment-card">
          <h3>{apartment.name}</h3>
          <p>{apartment.description}</p>
          <p>Price: {apartment.price}</p>
          <Link to={`/apartments/${apartment.id}`}>View Details</Link>
        </div>
      ))}
    </div>
  );
}

export default ApartmentList;
