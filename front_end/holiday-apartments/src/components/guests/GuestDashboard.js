import GuestMenu from "../guests/GuestMenu";
import NavBar from "../common/NavBar";
import Footer from "../common/Footer";
import { useTranslation } from "react-i18next";

const GuestDashboard = () => {
  const { t } = useTranslation();

  return (
    <div className="flex min-h-screen">
      <NavBar />
      {/* Sidebar Menu */}
      <GuestMenu />

      {/* Main Content */}
      <div className="ml-64 p-6 w-full">
        <h1 className="text-3xl font-bold mb-4">{t("guest_dashboard")}</h1>
        <p className="text-gray-600">{t("manage_profile_bookings")}</p>

        {/* Example of content sections */}
        <div className="mt-6 grid grid-cols-2 gap-4">
          <div className="bg-blue-100 p-4 rounded-lg shadow-md">
            <h2 className="text-lg font-semibold">{t("your_upcoming_bookings")}</h2>
            <p className="text-xl font-bold">3</p>
          </div>
          <div className="bg-green-100 p-4 rounded-lg shadow-md">
            <h2 className="text-lg font-semibold">{t("total_stays")}</h2>
            <p className="text-xl font-bold">10</p>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default GuestDashboard;