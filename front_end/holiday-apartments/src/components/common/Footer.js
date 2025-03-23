import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useState } from "react";

const Footer = () => {
  const { i18n } = useTranslation();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
    setIsDropdownOpen(false); // Close the dropdown after selecting a language
  };

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  return (
    <footer className="fixed bottom-0 left-0 w-full bg-gray-900 text-white p-4 text-center">
      <div className="flex justify-center gap-6 text-sm">
        <Link to="/contact-us" className="hover:underline">
          Contact Us
        </Link>
        <Link to="/house-rules" className="hover:underline">
          House Rules
        </Link>
        <Link to="/terms" className="hover:underline">
          Terms & Conditions
        </Link>
        <Link to="/site-map" className="hover:underline">
          Site Map
        </Link>
        <div className="relative inline-block text-left">
          <button onClick={toggleDropdown} className="hover:underline">
            Language
          </button>
          {isDropdownOpen && (
            <div className="absolute right-0 mb-2 w-32 bg-white text-black rounded-md shadow-lg dropdown-menu">
              <button onClick={() => changeLanguage('en')} className="block px-4 py-2 text-sm hover:bg-gray-200 w-full text-left">English</button>
              <button onClick={() => changeLanguage('es')} className="block px-4 py-2 text-sm hover:bg-gray-200 w-full text-left">Español</button>
              <button onClick={() => changeLanguage('de')} className="block px-4 py-2 text-sm hover:bg-gray-200 w-full text-left">Deutsch</button>
            </div>
          )}
        </div>
      </div>
    </footer>
  );
};

export default Footer;