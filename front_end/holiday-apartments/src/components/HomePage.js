import React, { useState, useEffect } from 'react';
import axios from '../api/api';
import ApartmentList from './ApartmentList';

function HomePage() {
  const [locations, setLocations] = useState([]);
  const [selectedLocation, setSelectedLocation] = useState(null);

  useEffect(() => {
    axios.get('/api/locations/')
      .then(response => setLocations(response.data))
      .catch(error => console.error('Error fetching locations:', error));
  }, []);

  return (
    <div>
      <h1>Holiday Apartments</h1>
      <div>
        <h2>Locations</h2>
        <select onChange={(e) => setSelectedLocation(e.target.value)}>
          <option value="">Select a location</option>
          {locations.map(location => (
            <option key={location.id} value={location.id}>{location.name}</option>
          ))}
        </select>
      </div>
      {selectedLocation && <ApartmentList locationId={selectedLocation} />}
    </div>
  );
}

export default HomePage;

