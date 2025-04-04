import { useState, useEffect } from "react";
import OwnerMenu from "./OwnerMenu";
import NavBar from "../common/NavBar";
import Footer from "../common/Footer";
import { useTranslation } from "react-i18next";

const EmailSender = () => {
  const { t } = useTranslation();
  const [emailConfig, setEmailConfig] = useState({
    EMAIL_BACKEND: "",
    EMAIL_HOST: "",
    EMAIL_PORT: "",
    EMAIL_USE_TLS: false,
    EMAIL_USE_SSL: false,
    EMAIL_HOST_USER: "",
    EMAIL_HOST_PASSWORD: "",
    recipient_list: "",
  });

  useEffect(() => {
    const fetchEmailConfig = async () => {
      const authToken = localStorage.getItem("token");

      if (!authToken) {
        console.error(t("missing_authentication_token"));
        return;
      }

      try {
        const response = await fetch("http://localhost:8000/api/email-config/", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Token ${authToken}`,
          },
        });

        if (!response.ok) {
          throw new Error(`${t("failed_to_fetch_email_config")} (Status: ${response.status})`);
        }

        const data = await response.json();
        setEmailConfig(data);
      } catch (error) {
        console.error(t("error_fetching_email_config"), error);
      }
    };

    fetchEmailConfig();
  }, [t]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setEmailConfig((prevConfig) => ({
      ...prevConfig,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const authToken = localStorage.getItem("token");

    if (!authToken) {
      alert(t("missing_authentication_token"));
      return;
    }

    try {
      const response = await fetch("http://localhost:8000/api/email-config/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Token ${authToken}`,
        },
        body: JSON.stringify(emailConfig),
      });

      if (!response.ok) {
        throw new Error(t("failed_to_update_email_config"));
      }

      alert(t("email_configuration_updated_successfully"));
    } catch (error) {
      console.error(t("error_updating_email_config"), error);
      alert(t("failed_to_update_email_configuration"));
    }
  };

  return (
    <div className="flex min-h-screen">
      <NavBar />
      <OwnerMenu />
      <div className="ml-64 p-6 w-full">
        <h1 className="text-3xl font-bold mb-4">{t("email_configuration")}</h1>
        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">{t("email_backend")}</label>
            <input
              type="text"
              name="EMAIL_BACKEND"
              value={emailConfig.EMAIL_BACKEND}
              onChange={handleChange}
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">{t("email_host")}</label>
            <input
              type="text"
              name="EMAIL_HOST"
              value={emailConfig.EMAIL_HOST}
              onChange={handleChange}
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">{t("email_port")}</label>
            <input
              type="number"
              name="EMAIL_PORT"
              value={emailConfig.EMAIL_PORT}
              onChange={handleChange}
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">{t("use_tls")}</label>
            <input
              type="checkbox"
              name="EMAIL_USE_TLS"
              checked={emailConfig.EMAIL_USE_TLS}
              onChange={handleChange}
              className="mt-1"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">{t("use_ssl")}</label>
            <input
              type="checkbox"
              name="EMAIL_USE_SSL"
              checked={emailConfig.EMAIL_USE_SSL}
              onChange={handleChange}
              className="mt-1"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">{t("email_host_user")}</label>
            <input
              type="text"
              name="EMAIL_HOST_USER"
              value={emailConfig.EMAIL_HOST_USER}
              onChange={handleChange}
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">{t("email_host_password")}</label>
            <input
              type="password"
              name="EMAIL_HOST_PASSWORD"
              value={emailConfig.EMAIL_HOST_PASSWORD}
              onChange={handleChange}
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">{t("recipient_list")}</label>
            <input
              type="text"
              name="recipient_list"
              value={emailConfig.recipient_list}
              onChange={handleChange}
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
            />
          </div>
          <button
            type="submit"
            className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
          >
            {t("update_email_configuration")}
          </button>
        </form>
      </div>
      <Footer />
    </div>
  );
};

export default EmailSender;