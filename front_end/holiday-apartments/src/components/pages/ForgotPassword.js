import { useState } from "react";
import { useTranslation } from "react-i18next";
import NavBar from "../common/NavBar";
import Footer from "../common/Footer";

const ForgotPassword = () => {
  const { t } = useTranslation();
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');

    try {
      const response = await fetch('http://localhost:8000/api/auth/forgot-password/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      if (!response.ok) {
        throw new Error(t('failed_to_send_reset_email'));
      }

      setMessage(t('reset_email_sent_success'));
    } catch (error) {
      setError(error.message || t('something_went_wrong'));
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      <NavBar />
      <div className="flex flex-col items-center justify-center flex-1">
        <div className="bg-white p-8 rounded shadow-md w-full max-w-md">
          <h1 className="text-2xl font-bold mb-6">{t('reset_password')}</h1>
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label htmlFor="email" className="block text-gray-700 mb-2">
                {t('email')}
              </label>
              <input
                type="email"
                id="email"
                className="w-full px-3 py-2 border rounded"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            {message && <p className="text-green-500 mb-4">{message}</p>}
            {error && <p className="text-red-500 mb-4">{error}</p>}
            <button
              type="submit"
              className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-700"
            >
              {t('send_reset_link')}
            </button>
          </form>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default ForgotPassword;