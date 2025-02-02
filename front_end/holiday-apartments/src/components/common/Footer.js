import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="w-full bg-gray-800 text-white py-4 mt-auto">
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
        <Link to="/language" className="hover:underline">
          Language
        </Link>
      </div>
    </footer>
  );
};

export default Footer;

