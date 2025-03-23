import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "./components/pages/HomePage";
import Locations from "./components/pages/Locations";
import Apartments from "./components/pages/Apartments";
import Booking from "./components/pages/Booking";
import Login from "./components/pages/Login";
import ForgotPassword from "./components/pages/ForgotPassword";
import ResetPassword from "./components/pages/ResetPassword";
import NavBar from "./components/common/NavBar";
import Register from "./components/pages/Register"
import OwnerDashboard from "./components/owner/OwnerDashboard";
import OwnerProfile from "./components/owner/OwnerProfile"; // ✅ Correct import
import EmailSender from "./components/owner/EmailSender"; // ✅ Correct import
import OwnerGuests from './components/owner/OwnerGuests';
import OwnerBookings from './components/owner/OwnerBookings'; // Import the OwnerBookings component
import OwnerReviews from './components/owner/OwnerReviews'; // Import the OwnerReviews component
import GuestDashboard from "./components/guests/GuestDashboard";
import GuestProfile from "./components/guests/GuestProfile"; // ✅ Correct import
import ContactUs from "./components/pages/ContactUs";
import ApartmentDetails from './components/pages/ApartmentDetails';
import NotFound from './components/pages/NotFound';


const AppRoutes = () => {
  return (
    <Router>
      <NavBar /> {/* Common menu used on all pages */}
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/locations" element={<Locations />} />
        <Route path="/apartments" element={<Apartments />} />
        <Route path="/apartments/:id" element={<ApartmentDetails />} />
        <Route path="/booking" element={<Booking />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />  {/* Ensure this exists */}
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password/:token" element={<ResetPassword />} />
        <Route path="/owner/dashboard" element={<OwnerDashboard />} />
        <Route path="/owner/profile" element={<OwnerProfile />} />
        <Route path="/owner/emailsender" element={<EmailSender />} />
        <Route path="/owner/apartments" element={<Apartments />} />
        <Route path="/owner/guests" element={<OwnerGuests />} />
        <Route path="/owner/bookings" element={<OwnerBookings />} /> {/* Add the OwnerBookings route */}
        <Route path="/owner/reviews" element={<OwnerReviews />} /> {/* Add the OwnerReviews route */}
        <Route path="/guest/dashboard" element={<GuestDashboard />} />
        <Route path="/guest/profile" element={<GuestProfile />} />
        <Route path="/contact-us" element={<ContactUs />} />
        <Route path="*" element={<NotFound />} /> {/* Catch-all route for 404 page */}

      </Routes>
    </Router>
  );
};

export default AppRoutes;

