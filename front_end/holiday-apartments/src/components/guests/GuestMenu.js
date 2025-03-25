import { Link, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";

const GuestMenu = () => {
  const { t } = useTranslation();
  const location = useLocation();

  const menuItems = [
    { name: t("profile"), path: "/guest/profile" },
    { name: t("bookings"), path: "/guest/bookings" },
  ];

  return (
    <div className="fixed top-16 left-0 h-[calc(100vh-4rem)] w-48 bg-gray-800 text-white flex flex-col p-4 gap-4 overflow-y-auto">
      <h2 className="text-xl font-bold p-4 border-b border-gray-600">{t("guest_panel")}</h2>
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