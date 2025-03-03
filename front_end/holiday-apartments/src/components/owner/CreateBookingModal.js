import React from 'react';

const CreateBookingModal = ({
  isOpen,
  onClose,
  onSubmit,
  isUpdateMode,
  guestDetail,
  setGuestDetail,
  apartmentId,
  setApartmentId,
  startDate,
  setStartDate,
  endDate,
  setEndDate,
  apartments,
  error,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white p-6 rounded-lg w-full max-w-md">
        <h2 className="text-xl font-bold mb-4">{isUpdateMode ? "Update Booking" : "Create New Booking"}</h2>
        <form onSubmit={onSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700">Guest Name</label>
            <input
              type="text"
              value={guestDetail}
              onChange={(e) => setGuestDetail(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Apartment</label>
            <select
              value={apartmentId}
              onChange={(e) => setApartmentId(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md"
              required
            >
              <option value="">Select Apartment</option>
              {Object.entries(apartments).map(([id, name]) => (
                <option key={id} value={id}>
                  {name}
                </option>
              ))}
            </select>
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Start Date</label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">End Date</label>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md"
              required
            />
          </div>

          {error && <p className="text-red-500 mb-4">{error}</p>}

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

export default CreateBookingModal;