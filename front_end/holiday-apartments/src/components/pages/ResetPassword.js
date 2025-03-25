import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import NavBar from "../common/NavBar";
import Footer from "../common/Footer";
import { useTranslation } from "react-i18next";

const ResetPassword = () => {
  const { t } = useTranslation();
  const { token } = useParams(); // Get the reset token from the URL
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");

    if (password !== confirmPassword) {
      setError(t("passwords_do_not_match"));
      return;
    }

    try {
      const response = await fetch(`http://localhost:8000/api/auth/reset-password/${token}/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password })
      });

      const data = await response.json();

      if (response.ok) {
        setMessage(t("password_reset_success"));
        navigate("/login");
      } else {
        setError(data.error || t("failed_to_reset_password"));
      }
    } catch (error) {
      setError(t("something_went_wrong"));
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <NavBar />
      <div className="flex items-center justify-center w-full min-h-screen">
        <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow-md w-96 text-center">
          <h2 className="text-2xl mb-4">{t("reset_password")}</h2>
          {message && <div className="text-green-500 mb-4">{message}</div>}
          {error && <div className="text-red-500 mb-4">{error}</div>}
          <input
            type="password"
            placeholder={t("new_password")}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-2 border rounded mb-4"
          />
          <input
            type="password"
            placeholder={t("confirm_password")}
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="w-full p-2 border rounded mb-4"
          />
          <button type="submit" className="w-full bg-blue-500 text-white p-2 rounded">{t("reset_password")}</button>
        </form>
      </div>
      <Footer />
    </div>
  );
};

export default ResetPassword;