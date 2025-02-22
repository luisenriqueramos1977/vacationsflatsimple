import { Link, useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

const NavBar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userGroup, setUserGroup] = useState(""); // State to store user group

  useEffect(() => {
    console.log("Checking localStorage for token..."); // Debugging
    const token = localStorage.getItem("token"); // Ensure this matches what you actually store
    const group = localStorage.getItem("groups"); // Get user group from localStorage
    console.log("Token found:", token); // Debugging
    console.log("User group found:", group); // Debugging
    setIsLoggedIn(!!token); // Set state based on token existence
    setUserGroup(group || ""); // Set user group state
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
        localStorage.removeItem("group"); // Clear group
        setIsLoggedIn(false); // Update state
        navigate("/"); // Redirect to Home
      } else {
        alert("Logout was unsuccessful. Please try again.");
      }
    } catch (error) {
      alert("An error occurred while logging out.");
    }
  };

  // Determine the dashboard path based on the user's group
  const getDashboardPath = () => {
    return userGroup.includes("Owners") ? "/owner/dashboard" : "/guest/dashboard";
  };

  const menuOptions = [
    { path: "/", label: "Home" },
    { path: "/locations", label: "Locations" },
    { path: "/apartments", label: "Apartments" },
    { path: "/login", label: "Login" },
  ];

  return (
    <nav className="fixed top-0 left-0 w-full bg-blue-500 text-white p-4 flex justify-around">
      {menuOptions
        .filter((option) => {
          // Hide current page
          if (option.path === location.pathname) return false;
          // Hide Login if logged in
          if (option.path === "/login" && isLoggedIn) return false;
          return true;
        })
        .map((option) => (
          <Link key={option.path} to={option.path} className="px-4">
            {option.label}
          </Link>
        ))}

      {/* Conditionally render Dashboard button */}
      {isLoggedIn && !location.pathname.includes("/dashboard") && (
        <Link to={getDashboardPath()} className="px-4">
          Dashboard
        </Link>
      )}

      {/* Logout button */}
      {isLoggedIn && (
        <button onClick={handleLogout} className="bg-red-500 px-4 py-2 rounded">
          Logout
        </button>
      )}
    </nav>
  );
};

export default NavBar;