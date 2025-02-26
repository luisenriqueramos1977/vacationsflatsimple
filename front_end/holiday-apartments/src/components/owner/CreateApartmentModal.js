// CreateApartmentModal.js
import React, { useState } from 'react';

const CreateApartmentModal = ({
  isOpen,
  onClose,
  onSubmit,
  isUpdateMode,
  apartmentName,
  setApartmentName,
  price,
  setPrice,
  currency,
  setCurrency,
  location,
  setLocation,
  rooms,
  setRooms,
  size,
  setSize,
  selectedFacilities,
  handleFacilityChange,
  selectedFiles,
  handleFileChange,
  error,
  currencyList,
  locationList,
  facilities,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white p-6 rounded-lg w-full max-w-md">
        <h2 className="text-xl font-bold mb-4">
          {isUpdateMode ? "Update Apartment" : "Create New Apartment"}
        </h2>
        <form onSubmit={onSubmit}>
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

          {/* Pictures (only in update mode) */}
          {isUpdateMode && (
            <div className="mb-4">
              <label className="block text-gray-700">Upload Pictures</label>
              <input
                type="file"
                multiple
                onChange={handleFileChange}
                className="w-full p-2 border border-gray-300 rounded-md"
              />
            </div>
          )}

          {/* Error Message */}
          {error && <p className="text-red-500 mb-4">{error}</p>}

          {/* Buttons */}
          <div className="flex justify-end">
            <button
              type="button"
              onClick={onClose}
              className="bg-gray-500 text-white px-4 py-2 rounded-md mr-2 hover:bg-gray-600"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
            >
              {isUpdateMode ? "Update" : "Create"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateApartmentModal;