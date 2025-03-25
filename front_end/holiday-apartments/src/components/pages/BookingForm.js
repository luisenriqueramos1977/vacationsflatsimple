import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from '../../api/api';
import Footer from "../common/Footer";
import { useTranslation } from 'react-i18next';

function BookingForm() {
  const { t } = useTranslation();
  const { id } = useParams();
  const [formData, setFormData] = useState({ guestId: '', startDate: '', endDate: '' });
  const [message, setMessage] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    axios.post('/api/bookings/', { ...formData, apartmentId: id })
      .then(response => setMessage(t('booking_successful')))
      .catch(error => setMessage(t('error_making_booking')));
  };

  return (
    <div>
      <h1>{t('book_apartment')}</h1>
      <form onSubmit={handleSubmit}>
        <label>
          {t('guest_id')}:
          <input type="text" name="guestId" value={formData.guestId} onChange={handleChange} required />
        </label>
        <label>
          {t('start_date')}:
          <input type="date" name="startDate" value={formData.startDate} onChange={handleChange} required />
        </label>
        <label>
          {t('end_date')}:
          <input type="date" name="endDate" value={formData.endDate} onChange={handleChange} required />
        </label>
        <button type="submit">{t('book')}</button>
      </form>
      {message && <p>{message}</p>}

      <Footer />
    </div>
  );
}

export default BookingForm;