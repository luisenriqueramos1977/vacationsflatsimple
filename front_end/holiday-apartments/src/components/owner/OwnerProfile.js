import { useState, useEffect } from "react";
import OwnerMenu from "./OwnerMenu";
import NavBar from "../common/NavBar";
import Footer from "../common/Footer";

const ProfilePage = () => {
  // State to store user profile data
  const [profile, setProfile] = useState({
    username: "",
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    groups: [],
  });

  // Fetch user profile data on component mount
  useEffect(() => {
    // Simulate fetching user data from an API
    const fetchProfile = async () => {
      try {
        const response = await fetch("http://localhost:8000/api/groups/owners/"); // Replace with your API endpoint
        if (!response.ok) {
          throw new Error("Failed to fetch profile data");
        }
        const data = await response.json();
        setProfile(data); // Set fetched data to state
      } catch (error) {
        console.error("Error fetching profile:", error);
      }
    };

    fetchProfile();
  }, []);

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
    try {
      const response = await fetch("http://localhost:8000/api/groups/owners/update/", {
        method: "PUT", // or "PATCH" depending on your API
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(profile),
      });

      if (!response.ok) {
        throw new Error("Failed to update profile");
      }

      alert("Profile updated successfully!");
    } catch (error) {
      console.error("Error updating profile:", error);
      alert("Failed to update profile. Please try again.");
    }
  };

  return (
    <div className="flex min-h-screen">
      <NavBar />
      {/* Sidebar Menu */}
      <OwnerMenu />

      {/* Main Content */}
      <div className="ml-64 p-6 w-full">
        <h1 className="text-3xl font-bold mb-4">Profile</h1>
        <p className="text-gray-600">Update your profile information here.</p>

        {/* Profile Form */}
        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Username</label>
            <input
              type="text"
              name="username"
              value={profile.username}
              onChange={handleChange}
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">First Name</label>
            <input
              type="text"
              name="firstName"
              value={profile.firstName}
              onChange={handleChange}
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Last Name</label>
            <input
              type="text"
              name="lastName"
              value={profile.lastName}
              onChange={handleChange}
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              name="email"
              value={profile.email}
              onChange={handleChange}
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Password</label>
            <input
              type="password"
              name="password"
              value={profile.password}
              onChange={handleChange}
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Groups</label>
            <input
              type="text"
              name="groups"
              value={profile.groups.join(", ")} // Display groups as comma-separated values
              onChange={(e) =>
                setProfile((prevProfile) => ({
                  ...prevProfile,
                  groups: e.target.value.split(", "), // Convert input back to array
                }))
              }
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
            />
          </div>

          <button
            type="submit"
            className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
          >
            Update Profile
          </button>
        </form>
      </div>
      <Footer />
    </div>
  );
};

export default ProfilePage;