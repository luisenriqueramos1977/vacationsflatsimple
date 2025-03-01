import { NavLink } from "react-router-dom";

const OwnerMenu = () => {
  const menuItems = [
    { name: "Profile", path: "/owner/profile" },
    { name: "Apartments", path: "/owner/apartments" },
    { name: "Guests", path: "/owner/guests" },
    { name: "Bookings", path: "/owner/bookings" },
    //{ name: "Analytics", path: "/owner/analytics" },
    { name: "Reviews", path: "/owner/reviews" },
  ];

  return (
    <div className="fixed top-16 left-0 h-[calc(100vh-4rem)] w-48 bg-gray-800 text-white flex flex-col p-4 gap-4 overflow-y-auto">
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