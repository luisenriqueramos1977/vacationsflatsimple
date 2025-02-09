import { useState } from "react";
import { useNavigate } from "react-router-dom";
import NavBar from "../common/NavBar";
import Footer from "../common/Footer";

const Register = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const navigate = useNavigate();

  const handleRegister = (e) => {
    e.preventDefault();
    
    if (password !== confirmPassword) {
      alert("Passwords do not match!");
      return;
    }

    console.log("Registering with:", { email, password });
    // Add registration logic here
  };

  return (
    <div className="flex flex-col min-h-screen">
      <NavBar />

      {/* Centered Form */}
      <div className="flex-grow flex items-center justify-center">
        <div className="w-[300px] p-6 border rounded-lg shadow-lg">
          <h2 className="text-2xl font-bold text-center mb-4">Register</h2>

          <form onSubmit={handleRegister} className="flex flex-col gap-4">
            {/* Email Field */}
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="border p-2 rounded"
              required
            />

            {/* Password Field */}
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="border p-2 rounded"
              required
            />

            {/* Confirm Password Field */}
            <input
              type="password"
              placeholder="Repeat Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="border p-2 rounded"
              required
            />

            {/* Register Button */}
            <button type="submit" className="bg-blue-500 text-white p-2 rounded font-bold">
              Register
            </button>
          </form>

          {/* Login Link */}
          <p className="text-center mt-4">
            <span> Already have an account? </span>
            <button onClick={() => navigate("/login")} className="text-blue-600 underline">
              Login here
            </button>
          </p>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Register;
