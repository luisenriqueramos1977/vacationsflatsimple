import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';

const CreateBookingModal = ({
  isOpen,
  onClose,
  onSubmit,
  apartmentId,
  setApartmentId,
  startDate,
  setStartDate,
  endDate,
  setEndDate,
  apartments,
  error,
}) => {
  const { t } = useTranslation();
  const [availabilityError, setAvailabilityError] = useState("");
  const [totalPrice, setTotalPrice] = useState(null);
  const [currencySymbol, setCurrencySymbol] = useState("$");
  const [isAvailable, setIsAvailable] = useState(false);

  useEffect(() => {
    if (isAvailable && window.paypal) {
      console.log("Rendering PayPal button...");
      window.paypal.Buttons({
        createOrder: (data, actions) => {
          return actions.order.create({
            purchase_units: [{
              amount: {
                value: totalPrice.toFixed(2), // Ensure the total price is a string with 2 decimal places
                currency_code: currencySymbol,
              },
              payee: {
                email_address: 'luisenriqueramos1977@gmail.com',
              },
            }],
          });
        },
        onApprove: (data, actions) => {
          return actions.order.capture().then(details => {
            alert(t('transaction_completed') + ' ' + details.payer.name.given_name);
            onSubmit(); // Call the onSubmit function to handle the booking creation
          });
        },
        onError: (err) => {
          console.error('PayPal Checkout onError', err);
          alert(t('transaction_error'));
        },
      }).render('#paypal-button-container');
    }
  }, [isAvailable, totalPrice, currencySymbol, onSubmit, t]);

  if (!isOpen) return null;

  const fetchCurrencySymbol = async (currencyId) => {
    try {
      const response = await fetch(`http://localhost:8000/api/currencies/${currencyId}/`);
      if (!response.ok) {
        throw new Error(t('failed_to_fetch_currency'));
      }

      const data = await response.json();
      return data.symbol;
    } catch (error) {
      console.error(t('error_fetching_currency_symbol'), error);
      return "$";
    }
  };

  const calculateTotalPrice = async (apartmentId, startDate, endDate) => {
    try {
      const response = await fetch(`http://localhost:8000/api/apartments/${apartmentId}/`);
      if (!response.ok) {
        throw new Error(t('failed_to_fetch_apartment_details'));
      }

      const data = await response.json();
      const dailyPrice = data.price;
      const currencySymbol = await fetchCurrencySymbol(data.currency);

      const start = new Date(startDate);
      const end = new Date(endDate);
      const days = (end - start) / (1000 * 60 * 60 * 24);

      const totalPrice = dailyPrice * days;
      console.log(t('calculated_total_price') + `: ${totalPrice}`);
      setCurrencySymbol(currencySymbol);
      return totalPrice;
    } catch (error) {
      console.error(t('error_fetching_apartment_price'), error);
      return null;
    }
  };

  const checkAvailability = async () => {
    setAvailabilityError("");
    setTotalPrice(null);
    setIsAvailable(false);

    try {
      const queryParams = new URLSearchParams({
        start_date: startDate,
        end_date: endDate,
        location: apartmentId,
      }).toString();

      const response = await fetch(`http://localhost:8000/api/apartments/filter?${queryParams}`);
      if (!response.ok) {
        throw new Error(t('failed_to_check_availability'));
      }

      const data = await response.json();

      if (data.length === 0) {
        setAvailabilityError(t('no_availability'));
      } else {
        const totalPrice = await calculateTotalPrice(apartmentId, startDate, endDate);
        setTotalPrice(totalPrice);
        setIsAvailable(true);
        console.log(t('total_price_set') + `: ${totalPrice}`);
      }
    } catch (error) {
      console.error(t('error_checking_availability'), error);
      setAvailabilityError(t('failed_to_check_availability'));
    }
  };

  const handleCancel = () => {
    if (isAvailable) {
      setIsAvailable(false);
      setTotalPrice(null);
    } else {
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white p-6 rounded-lg w-full max-w-md">
        <h2 className="text-xl font-bold mb-4">{t('check_availability')}</h2>
        <form onSubmit={onSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700">{t('apartment')}</label>
            <select
              value={apartmentId}
              onChange={(e) => setApartmentId(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md"
              required
            >
              <option value="">{t('select_apartment')}</option>
              {Object.entries(apartments).map(([id, name]) => (
                <option key={id} value={id}>
                  {name}
                </option>
              ))}
            </select>
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">{t('start_date')}</label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">{t('end_date')}</label>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md"
              required
            />
          </div>

          {availabilityError && <p className="text-red-500 mb-4">{availabilityError}</p>}
          {totalPrice !== null && (
            <div className="mb-4">
              <p className="text-green-500 mb-4">{t('total_price')}: {currencySymbol}{totalPrice}</p>
              <div id="paypal-button-container"></div>
            </div>
          )}

          <div className="flex justify-end">
            <button
              type="button"
              onClick={handleCancel}
              className="bg-gray-500 text-white px-4 py-2 rounded-md mr-2 hover:bg-gray-600"
            >
              {t('cancel')}
            </button>
            {!isAvailable && (
              <button
                type="button"
                onClick={checkAvailability}
                className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
              >
                {t('check_availability')}
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateBookingModal;