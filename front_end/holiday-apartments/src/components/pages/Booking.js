import { useLocation } from "react-router-dom";
import NavBar from "../common/NavBar";
import Footer from "../common/Footer";

const Booking = () => {
  const location = useLocation();
  const filteredApartments = location.state?.filteredApartments || [];

  return (
    <div className="h-screen flex flex-col">
      <NavBar />
      <div className="flex flex-1 flex-col items-center justify-center mt-16">
        <h1 className="text-3xl font-bold mb-8">Booking</h1>

        {/* Display filtered apartments */}
        {filteredApartments.length > 0 ? (
          <div className="w-full max-w-4xl mx-auto">
            <h2 className="text-2xl font-semibold mb-4">Available Apartments</h2>
            <ul className="space-y-4">
              {filteredApartments.map((apartment) => (
                <li key={apartment.id} className="bg-white p-6 rounded-lg shadow-md">
                  <h3 className="text-xl font-bold">{apartment.name}</h3>
                  <p className="text-gray-600">{apartment.description}</p>
                  <p className="text-gray-600">Price: ${apartment.price}</p>
                  <p className="text-gray-600">Location: {apartment.location}</p>
                </li>
              ))}
            </ul>
          </div>
        ) : (
          <p className="text-gray-600">No apartments found matching your criteria.</p>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default Booking;



  