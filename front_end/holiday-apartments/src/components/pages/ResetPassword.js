import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import NavBar from "../common/NavBar";
import Footer from "../common/Footer";

const ResetPassword = () => {
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
      setError("Passwords do not match.");
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
        setMessage("Password has been reset successfully.");
        navigate("/login");
      } else {
        setError(data.error || "Failed to reset password. Please try again.");
      }
    } catch (error) {
      setError("Something went wrong. Please try again later.");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <NavBar />
      <div className="flex items-center justify-center w-full min-h-screen">
        <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow-md w-96 text-center">
          <h2 className="text-2xl mb-4">Reset Password</h2>
          {message && <div className="text-green-500 mb-4">{message}</div>}
          {error && <div className="text-red-500 mb-4">{error}</div>}
          <input
            type="password"
            placeholder="New Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-2 border rounded mb-4"
          />
          <input
            type="password"
            placeholder="Confirm Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="w-full p-2 border rounded mb-4"
          />
          <button type="submit" className="w-full bg-blue-500 text-white p-2 rounded">Reset Password</button>
        </form>
      </div>
      <Footer />
    </div>
  );
};

export default ResetPassword;