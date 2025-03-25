import { NavLink } from "react-router-dom";
import { useTranslation } from "react-i18next";

const OwnerMenu = () => {
  const { t } = useTranslation();

  const menuItems = [
    { name: t("profile"), path: "/owner/profile" },
    { name: t("apartments"), path: "/owner/apartments" },
    { name: t("guests"), path: "/owner/guests" },
    { name: t("bookings"), path: "/owner/bookings" },
    { name: t("email_sender"), path: "/owner/emailsender" },
    { name: t("reviews"), path: "/owner/reviews" },
  ];

  return (
    <div className="fixed top-16 left-0 h-[calc(100vh-4rem)] w-48 bg-gray-800 text-white flex flex-col p-4 gap-4 overflow-y-auto">
      <h2 className="text-xl font-bold mb-4">{t("owner_dashboard")}</h2>
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