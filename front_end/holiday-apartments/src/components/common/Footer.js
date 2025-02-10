import { Link } from "react-router-dom";

const Footer = () => {
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
        <Link to="/language" className="hover:underline">
          Language
        </Link>
      </div>
    </footer>
  );
};

export default Footer;

