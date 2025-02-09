import { useState } from "react";
import { useNavigate } from "react-router-dom";
import NavBar from "../common/NavBar";
import Footer from "../common/Footer";

const Login = () => {
  const [user, setUser] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Logging in with:", { user, password });
    // Add authentication logic here
  };

  return (
    <div className="flex flex-col min-h-screen">
      <NavBar />

      {/* Centered Form */}
      <div className="flex-grow flex items-center justify-center">
        <div className="w-[300px] p-6 border rounded-lg shadow-lg">
          <h2 className="text-2xl font-bold text-center mb-4">Login</h2>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            {/* Email/Username Field */}
            <input
              type="text"
              placeholder="Email or Username"
              value={user}
              onChange={(e) => setUser(e.target.value)}
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

            {/* Submit Button */}
            <button type="submit" className="bg-blue-500 text-white p-2 rounded font-bold">
              Submit
            </button>
          </form>

          {/* Registration Link */}
          <p className="text-center mt-4">
            <span> Aren't you registered yet? </span>
            <button onClick={() => navigate("/register")} className="text-blue-600 underline">
              Register here
            </button>
          </p>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Login;


  