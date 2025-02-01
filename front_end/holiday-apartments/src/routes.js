import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "./components/pages/HomePage";
import Locations from "./components/pages/Locations";
import Apartments from "./components/pages/Apartments";
import Booking from "./components/pages/Booking";
import Login from "./components/pages/Login";
import NavBar from "./components/common/NavBar";

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
      </Routes>
    </Router>
  );
};

export default AppRoutes;

