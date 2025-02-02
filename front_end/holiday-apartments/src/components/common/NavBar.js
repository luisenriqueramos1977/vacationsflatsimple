import { Link, useLocation } from "react-router-dom";

const NavBar = () => {
  const location = useLocation();
  
  // Define menu options
  const menuOptions = [
    { path: "/", label: "Home" },
    { path: "/locations", label: "Locations" },
    { path: "/apartments", label: "Apartments" },
    { path: "/booking", label: "Booking" },
    { path: "/login", label: "Login" }
  ];

  return (
    <nav className="fixed top-0 left-0 w-full bg-blue-500 text-white p-4 flex justify-around">
      {menuOptions
        .filter(option => option.path !== location.pathname) // Hide current page
        .map(option => (
          <Link key={option.path} to={option.path} className="px-4">
            {option.label}
          </Link>
        ))}
    </nav>
  );
};

export default NavBar;

