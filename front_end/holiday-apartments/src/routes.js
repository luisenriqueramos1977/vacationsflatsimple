import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "./components/pages/HomePage";
import Locations from "./components/pages/Locations";
import Apartments from "./components/pages/Apartments";
import Booking from "./components/pages/Booking";
import Login from "./components/pages/Login";
import NavBar from "./components/common/NavBar";
import Register from "./components/pages/Register"
import OwnerDashboard from "./components/owner/OwnerDashboard";
import GuestDashboard from "./components/guests/GuestDashboard";
import ContactUs from "./components/pages/ContactUs";

const AppRoutes = () => {
  return (
    <Router>
      <NavBar /> {/* Common menu used on all pages */}
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/locations" element={<Locations />} />
        <Route path="/apartments" element={<Apartments />} />
        <Route path="/booking" element={<Booking />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />  {/* Ensure this exists */}
        <Route path="/owner/dashboard" element={<OwnerDashboard />} />
        <Route path="/guest/dashboard" element={<GuestDashboard />} />
        <Route path="/contact-us" element={<ContactUs />} />
      </Routes>
    </Router>
  );
};

export default AppRoutes;

