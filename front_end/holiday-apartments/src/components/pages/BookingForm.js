import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from '../../api/api';
import Footer from "../common/Footer";


function BookingForm() {
  const { id } = useParams();
  const [formData, setFormData] = useState({ guestId: '', startDate: '', endDate: '' });
  const [message, setMessage] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    axios.post('/api/bookings/', { ...formData, apartmentId: id })
      .then(response => setMessage('Booking successful!'))
      .catch(error => setMessage('Error making booking.'));
  };

  return (
    <div>
      <h1>Book Apartment</h1>
      <form onSubmit={handleSubmit}>
        <label>
          Guest ID:
          <input type="text" name="guestId" value={formData.guestId} onChange={handleChange} required />
        </label>
        <label>
          Start Date:
          <input type="date" name="startDate" value={formData.startDate} onChange={handleChange} required />
        </label>
        <label>
          End Date:
          <input type="date" name="endDate" value={formData.endDate} onChange={handleChange} required />
        </label>
        <button type="submit">Book</button>
      </form>
      {message && <p>{message}</p>}

      <Footer />

    </div>
  );
}

export default BookingForm;
