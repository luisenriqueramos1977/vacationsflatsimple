import React, { useEffect, useState } from 'react';
import NavBar from '../common/NavBar';
import Footer from '../common/Footer';

const Apartments = () => {
  const [apartments, setApartments] = useState([]);
  const [locations, setLocations] = useState({}); // Store location data as a dictionary
  const [currencies, setCurrencies] = useState({}); // Store currency data as a dictionary

  // Fetch apartments data from the API endpoint
  useEffect(() => {
    fetch('http://localhost:8000/api/apartments/')
      .then((response) => response.json())
      .then((data) => {
        setApartments(data);
        // Fetch location and currency data for each apartment
        data.forEach((apartment) => {
          // Fetch location data
          fetch(`http://localhost:8000/api/locations/${apartment.location}/`)
            .then((response) => response.json())
            .then((locationData) => {
              setLocations((prevLocations) => ({
                ...prevLocations,
                [apartment.location]: locationData.name,
              }));
            })
            .catch((error) => console.error('Error fetching location data:', error));

          // Fetch currency data
          fetch(`http://localhost:8000/api/currencies/${apartment.currency}/`)
            .then((response) => response.json())
            .then((currencyData) => {
              setCurrencies((prevCurrencies) => ({
                ...prevCurrencies,
                [apartment.currency]: currencyData.code,
              }));
            })
            .catch((error) => console.error('Error fetching currency data:', error));
        });
      })
      .catch((error) => console.error('Error fetching apartment data:', error));
  }, []);

  return (
    <div className="h-screen flex flex-col">
      <NavBar />
      <div className="flex flex-1 flex-col items-center mt-16">
        <h1 className="text-3xl font-bold mb-8">Apartments</h1>
        <div className="w-full max-w-4xl overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-300">
            <thead>
              <tr className="bg-gray-100">
                <th className="py-3 px-4 border-b text-left">Apartment Name</th>
                <th className="py-3 px-4 border-b text-left">Price</th>
                <th className="py-3 px-4 border-b text-left">Location</th>
              </tr>
            </thead>
            <tbody>
              {apartments.map((apartment) => (
                <tr key={apartment.id} className="hover:bg-gray-50">
                  <td className="py-3 px-4 border-b">{apartment.apartment_name}</td>
                  <td className="py-3 px-4 border-b">
                    {apartment.price} {currencies[apartment.currency] || 'Loading...'}
                  </td>
                  <td className="py-3 px-4 border-b">
                    {locations[apartment.location] || 'Loading...'}
                  </td>
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