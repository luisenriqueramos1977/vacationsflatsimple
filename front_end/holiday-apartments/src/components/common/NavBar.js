import { Link, useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

const NavBar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    console.log("Checking localStorage for token..."); // Debugging
    const token = localStorage.getItem("token"); // Ensure this matches what you actually store
    console.log("Token found:", token); // Debugging
    setIsLoggedIn(!!token); // Set state based on token existence
    console.log("isLoggedIn set to:", !!token); // Debugging
  }, []);

  const handleLogout = async () => {
    try {
      const token = localStorage.getItem("token");

      const response = await fetch("http://localhost:8000/api/auth/logout/", {
        method: "POST",
        headers: {
          Authorization: `Token ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        localStorage.removeItem("token"); // Clear token
        localStorage.removeItem("user_id"); // Clear token
        localStorage.removeItem("username"); // Clear token
        setIsLoggedIn(false); // Update state
        navigate("/"); // Redirect to Home
      } else {
        alert("Logout was unsuccessful. Please try again.");
      }
    } catch (error) {
      alert("An error occurred while logging out.");
    }
  };

  const menuOptions = [
    { path: "/", label: "Home" },
    { path: "/locations", label: "Locations" },
    { path: "/apartments", label: "Apartments" },
    { path: "/booking", label: "Booking" },
    { path: "/login", label: "Login" },
    { path: "/guest/dashboard", label: "Dashboard" }, // Add Dashboard option
  ];

  return (
    <nav className="fixed top-0 left-0 w-full bg-blue-500 text-white p-4 flex justify-around">
      {menuOptions
        .filter((option) => {
          // Hide current page
          if (option.path === location.pathname) return false;
          // Hide Login if logged in
          if (option.path === "/login" && isLoggedIn) return false;
          // Hide Dashboard if not logged in
          if (option.path === "/guest/dashboard" && !isLoggedIn) return false;
          return true;
        })
        .map((option) => (
          <Link key={option.path} to={option.path} className="px-4">
            {option.label}
          </Link>
        ))}
      {isLoggedIn && (
        <button onClick={handleLogout} className="bg-red-500 px-4 py-2 rounded">
          Logout
        </button>
      )}
    </nav>
  );
};

export default NavBar;