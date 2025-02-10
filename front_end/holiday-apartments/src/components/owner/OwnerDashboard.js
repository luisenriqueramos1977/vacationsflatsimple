import OwnerMenu from "../owner/OwnerMenu";
import NavBar from "../common/NavBar";
import Footer from "../common/Footer";

const OwnerDashboard = () => {
  return (
    <div className="flex min-h-screen">
        <NavBar />
      {/* Sidebar Menu */}
      <OwnerMenu />

      {/* Main Content */}
      <div className="ml-64 p-6 w-full">
        <h1 className="text-3xl font-bold mb-4">Owner Dashboard</h1>
        <p className="text-gray-600">Manage your properties, guests, and bookings here.</p>

        {/* Example of content sections */}
        <div className="mt-6 grid grid-cols-3 gap-4">
          <div className="bg-blue-100 p-4 rounded-lg shadow-md">
            <h2 className="text-lg font-semibold">Total Apartments</h2>
            <p className="text-xl font-bold">12</p>
          </div>
          <div className="bg-green-100 p-4 rounded-lg shadow-md">
            <h2 className="text-lg font-semibold">Total Bookings</h2>
            <p className="text-xl font-bold">45</p>
          </div>
          <div className="bg-yellow-100 p-4 rounded-lg shadow-md">
            <h2 className="text-lg font-semibold">Pending Reviews</h2>
            <p className="text-xl font-bold">8</p>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default OwnerDashboard;
