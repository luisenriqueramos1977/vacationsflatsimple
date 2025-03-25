import { useState, useEffect } from "react";
import NavBar from "../common/NavBar";
import Footer from "../common/Footer";
import { useTranslation } from "react-i18next";

const Locations = () => {
  const { t } = useTranslation();
  const [locations, setLocations] = useState([]);

  useEffect(() => {
    const fetchLocations = async () => {
      try {
        const response = await fetch("http://localhost:8000/api/locations/");
        const data = await response.json();
        setLocations(data);
      } catch (error) {
        console.error(t("error_fetching_locations"), error);
      }
    };

    fetchLocations();
  }, [t]);

  return (
    <div className="h-screen flex flex-col">
      <NavBar />
      <div className="flex flex-1 flex-col items-center justify-center mt-10">
        <h1 className="text-3xl font-bold mb-8">{t("locations")}</h1>

        {/* Locations Table - Adjusted to 50% Screen Width */}
        <div className="overflow-x-auto w-1/2">
          <table className="w-full border-collapse border border-gray-300">
            <thead>
              <tr className="bg-gray-200">
                <th className="border border-gray-300 px-4 py-2">{t("name")}</th>
                <th className="border border-gray-300 px-4 py-2">{t("country")}</th>
                <th className="border border-gray-300 px-4 py-2">{t("map")}</th>
              </tr>
            </thead>
            <tbody>
              {locations.map((location) => (
                <tr key={location.id} className="text-center">
                  <td className="border border-gray-300 px-4 py-2">{location.name}</td>
                  <td className="border border-gray-300 px-4 py-2">{location.country}</td>
                  <td className="border border-gray-300 px-4 py-2">
                    <a
                      href={`https://www.openstreetmap.org/search?query=${encodeURIComponent(location.name)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-500 hover:underline"
                    >
                      {t("view_on_map")}
                    </a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Locations;