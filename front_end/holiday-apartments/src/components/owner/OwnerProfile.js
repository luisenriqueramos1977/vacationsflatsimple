import { useState, useEffect } from "react";
import OwnerMenu from "./OwnerMenu";
import NavBar from "../common/NavBar";
import Footer from "../common/Footer";
import { useTranslation } from "react-i18next";

const ProfilePage = () => {
  const { t } = useTranslation();
  
  // State to store user profile data
  const [profile, setProfile] = useState({
    username: "",
    first_name: "", // Fix to match API response field names
    last_name: "",
    email: "",
    groups: [],
  });

  // Fetch user profile data on component mount
  useEffect(() => {
    const fetchProfile = async () => {
      // Retrieve user ID and authentication token from localStorage
      const userId = localStorage.getItem("user_id");
      const authToken = localStorage.getItem("token");

      if (!userId || !authToken) {
        console.error(t("missing_authentication_details"));
        return;
      }

      try {
        const response = await fetch(`http://localhost:8000/api/groups/owners/${userId}/`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Token ${authToken}`, // Send authentication token
          },
        });

        if (!response.ok) {
          throw new Error(`${t("error_fetching_profile")} (Status: ${response.status})`);
        }

        const data = await response.json();

        // Set profile state with API response
        setProfile({
          username: data.username,
          first_name: data.first_name || "", // Ensure non-null values
          last_name: data.last_name || "",
          email: data.email,
          groups: data.groups || [],
        });
      } catch (error) {
        console.error(t("error_fetching_profile"), error);
      }
    };

    fetchProfile();
  }, [t]);

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfile((prevProfile) => ({
      ...prevProfile,
      [name]: value,
    }));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    const userId = localStorage.getItem("user_id");
    const authToken = localStorage.getItem("token");

    if (!userId || !authToken) {
      alert(t("missing_authentication_details"));
      return;
    }

    try {
      const response = await fetch(`http://localhost:8000/api/groups/owners/${userId}/`, {
        method: "PUT", // or PATCH depending on your API
        headers: {
          "Content-Type": "application/json",
          Authorization: `Token ${authToken}`,
        },
        body: JSON.stringify(profile),
      });

      if (!response.ok) {
        throw new Error(t("failed_to_update_profile"));
      }

      alert(t("profile_updated_successfully"));
    } catch (error) {
      console.error(t("failed_to_update_profile"), error);
      alert(t("failed_to_update_profile"));
    }
  };

  return (
    <div className="flex min-h-screen">
      <NavBar />
      {/* Sidebar Menu */}
      <OwnerMenu />

      {/* Main Content */}
      <div className="ml-64 p-6 w-full">
        <h1 className="text-3xl font-bold mb-4">{t("profile")}</h1>
        <p className="text-gray-600">{t("update_profile_info")}</p>

        {/* Profile Form */}
        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">{t("username")}</label>
            <input
              type="text"
              name="username"
              value={profile.username}
              onChange={handleChange}
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">{t("first_name")}</label>
            <input
              type="text"
              name="first_name"
              value={profile.first_name}
              onChange={handleChange}
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">{t("last_name")}</label>
            <input
              type="text"
              name="last_name"
              value={profile.last_name}
              onChange={handleChange}
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">{t("email")}</label>
            <input
              type="email"
              name="email"
              value={profile.email}
              onChange={handleChange}
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
            />
          </div>

          <button
            type="submit"
            className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
          >
            {t("update_profile")}
          </button>
        </form>
      </div>
      <Footer />
    </div>
  );
};

export default ProfilePage;