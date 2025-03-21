import { useState } from "react";
import { useNavigate } from "react-router-dom";
import NavBar from "../common/NavBar";
import Footer from "../common/Footer";

const Login = () => {
  const [user, setUser] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const response = await fetch("http://localhost:8000/api/auth/login/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: user, password: password })
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("user_id", data.user_id);
        localStorage.setItem("username", data.username);
        localStorage.setItem("groups", JSON.stringify(data.groups || [])); // Store user groups

        // Check if user belongs to the "Owners" group
        if (data.groups && data.groups.includes("Owners")) {
          navigate("/owner/dashboard"); // Redirect to OwnerDashboard
        } else {
          navigate("/guest/dashboard"); // Redirect to GuestDashboard
        }
      } else {
        setError(data.error || "Invalid credentials. Please try again.");
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
          <h2 className="text-2xl mb-4">Login</h2>
          {error && <div className="text-red-500 mb-4">{error}</div>}
          <input
            type="text"
            placeholder="Username"
            value={user}
            onChange={(e) => setUser(e.target.value)}
            className="w-full p-2 border rounded mb-4"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-2 border rounded mb-4"
          />
          <button type="submit" className="w-full bg-blue-500 text-white p-2 rounded">Login</button>

          {/* Forgot Password Link */}
          <p className="text-center mt-4">
            <button onClick={() => navigate("/forgot-password")} className="text-blue-600 underline">
              Forgot Password?
            </button>
          </p>

          {/* Registration Link */}
          <p className="text-center mt-4">
            <span> Aren't you registered yet? </span>
            <button onClick={() => navigate("/register")} className="text-blue-600 underline">
              Register here
            </button>
          </p>
        </form>
      </div>
      <Footer />
    </div>
  );
};

export default Login;