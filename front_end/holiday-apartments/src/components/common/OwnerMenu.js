import { NavLink } from "react-router-dom";

const OwnerMenu = () => {
  const menuItems = [
    { name: "Profile", path: "/owner/profile" },
    { name: "Apartments", path: "/owner/apartments" },
    { name: "Guests", path: "/owner/guests" },
    { name: "Bookings", path: "/owner/bookings" },
    { name: "Analytics", path: "/owner/analytics" },
    { name: "Reviews", path: "/owner/reviews" },
  ];

  return (
    <div className="w-64 h-screen bg-gray-800 text-white fixed left-0 top-0 p-5">
      <h2 className="text-xl font-bold mb-4">Owner Dashboard</h2>
      <nav className="flex flex-col space-y-2">
        {menuItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `block py-2 px-4 rounded-md transition ${
                isActive ? "bg-blue-500" : "hover:bg-gray-700"
              }`
            }
          >
            {item.name}
          </NavLink>
        ))}
      </nav>
    </div>
  );
};

export default OwnerMenu;
