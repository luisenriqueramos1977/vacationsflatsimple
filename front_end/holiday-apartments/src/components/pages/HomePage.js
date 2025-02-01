import NavBar from "../common/NavBar";

const HomePage = () => {
  return (
    <div className="h-screen flex flex-col">
      <NavBar />
      <div className="flex flex-1 items-center justify-center mt-16">
        <h1 className="text-3xl font-bold">Welcome to Holiday Apartments</h1>
      </div>
    </div>
  );
};

export default HomePage;






