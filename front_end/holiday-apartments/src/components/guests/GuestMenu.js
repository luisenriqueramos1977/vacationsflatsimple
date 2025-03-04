import { Link, useLocation } from "react-router-dom";

const GuestMenu = () => {
  const location = useLocation();

  const menuItems = [
    { name: "Profile", path: "/guest/profile" },
    { name: "Bookings", path: "/owner/bookings" },
  ];

  return (
    <div className="fixed top-16 left-0 h-[calc(100vh-4rem)] w-48 bg-gray-800 text-white flex flex-col p-4 gap-4 overflow-y-auto">
      <h2 className="text-xl font-bold p-4 border-b border-gray-600">Guest Panel</h2>
      <ul className="p-4 space-y-2">
        {menuItems.map((item) => (
          <li key={item.path}>
            <Link
              to={item.path}
              className={`block p-3 rounded-lg ${
                location.pathname === item.path ? "bg-blue-500" : "hover:bg-gray-700"
              }`}
            >
              {item.name}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default GuestMenu;
