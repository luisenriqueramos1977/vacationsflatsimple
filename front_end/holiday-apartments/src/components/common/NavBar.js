import { Link } from "react-router-dom";

const NavBar = () => {
  return (
    <nav className="fixed top-0 left-0 w-full bg-blue-500 text-white p-4 flex justify-around">
      <Link to="/" className="px-4">Home</Link>
      <Link to="/locations" className="px-4">Locations</Link>
      <Link to="/apartments" className="px-4">Apartments</Link>
      <Link to="/booking" className="px-4">Booking</Link>
      <Link to="/login" className="px-4">Login</Link>
    </nav>
  );
};

export default NavBar;
