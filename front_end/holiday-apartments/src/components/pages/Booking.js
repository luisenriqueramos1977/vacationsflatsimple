import NavBar from "../common/NavBar";
import Footer from "../common/Footer";


const Booking = () => {
  return (
    <div className="h-screen flex flex-col">
      <NavBar />
      <div className="flex flex-1 items-center justify-center mt-16">
        <h1 className="text-3xl font-bold">Booking</h1>
      </div>
      <Footer />

    </div>
  );
};

export default Booking;

  