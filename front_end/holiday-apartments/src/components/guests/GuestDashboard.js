import GuestMenu from "../guests/GuestMenu";
import NavBar from "../common/NavBar";
import Footer from "../common/Footer";


const GuestDashboard = () => {
  return (
    <div className="flex min-h-screen">
      <NavBar />
      {/* Sidebar Menu */}
      <GuestMenu />

      {/* Main Content */}
      <div className="ml-64 p-6 w-full">
        <h1 className="text-3xl font-bold mb-4">Guest Dashboard</h1>
        <p className="text-gray-600">Manage your profile and bookings.</p>

        {/* Example of content sections */}
        <div className="mt-6 grid grid-cols-2 gap-4">
          <div className="bg-blue-100 p-4 rounded-lg shadow-md">
            <h2 className="text-lg font-semibold">Your Upcoming Bookings</h2>
            <p className="text-xl font-bold">3</p>
          </div>
          <div className="bg-green-100 p-4 rounded-lg shadow-md">
            <h2 className="text-lg font-semibold">Total Stays</h2>
            <p className="text-xl font-bold">10</p>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default GuestDashboard;
