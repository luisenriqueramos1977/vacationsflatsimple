import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import NavBar from '../common/NavBar';
import Footer from '../common/Footer';
import OwnerMenu from './OwnerMenu';

const OwnerReviews = () => {
  const [reviews, setReviews] = useState([]);
  const [userGroup, setUserGroup] = useState(null);
  const [userId, setUserId] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const storedUserId = localStorage.getItem("user_id");
    const storedGroups = JSON.parse(localStorage.getItem("groups") || "[]");

    if (storedUserId) {
      setUserId(parseInt(storedUserId, 10));
    }

    if (storedGroups.includes("Owners")) {
      setUserGroup("Owners");
    }

    if (storedUserId && storedGroups.includes("Owners")) {
      fetchReviews(storedUserId);
    }
  }, []);

  const fetchReviews = async (ownerId) => {
    try {
      // Fetch apartments of the current owner
      const apartmentsResponse = await fetch(`http://localhost:8000/api/apartments/?owner=${ownerId}`);
      const apartments = await apartmentsResponse.json();
      const apartmentIds = apartments.map(apartment => apartment.id);

      // Fetch reviews
      const reviewsResponse = await fetch("http://localhost:8000/api/reviews/");
      const reviews = await reviewsResponse.json();

      // Filter reviews related to the owner's apartments
      const ownerReviews = reviews.filter(review => apartmentIds.includes(review.apartment));

      setReviews(ownerReviews);
    } catch (error) {
      console.error("Error fetching reviews:", error);
    }
  };

  const handleDelete = async (reviewId) => {
    if (!window.confirm("Are you sure you want to delete this review?")) return;

    try {
      const response = await fetch(`http://localhost:8000/api/reviews/${reviewId}/`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (response.ok) {
        setReviews((prev) => prev.filter((review) => review.id !== reviewId));
        alert("Review deleted successfully!");
      } else {
        alert("Error deleting review. Please try again.");
      }
    } catch (error) {
      console.error("Error deleting review:", error);
      alert("An error occurred. Please try again.");
    }
  };

  const openUpdateModal = (review) => {
    // Implement the logic to open the update modal with the review details
  };

  return (
    <div className="h-screen flex flex-col">
      <NavBar />
      {userGroup === "Owners" && <OwnerMenu />}
      <div className="flex flex-1 flex-col items-center mt-16">
        <h1 className="text-3xl font-bold mb-8">Reviews</h1>

        {userGroup === "Owners" && reviews.length === 0 && (
          <p className="text-red-600 font-semibold mb-4">
            No Reviews found.
          </p>
        )}

        <div className="w-full max-w-4xl overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-300">
            <thead>
              <tr className="bg-gray-100 text-center">
                <th className="py-3 px-4 border-b">Guest Name</th>
                <th className="py-3 px-4 border-b">Apartment ID</th>
                <th className="py-3 px-4 border-b">Value</th>
                <th className="py-3 px-4 border-b">Comment</th>
                <th className="py-3 px-4 border-b">Actions</th>
              </tr>
            </thead>
            <tbody>
              {reviews.map((review) => (
                <tr key={review.id} className="hover:bg-gray-50 text-center">
                  <td className="py-3 px-4 border-b">
                    {review.guest}
                  </td>
                  <td className="py-3 px-4 border-b">
                    {review.apartment}
                  </td>
                  <td className="py-3 px-4 border-b">
                    {review.value}
                  </td>
                  <td className="py-3 px-4 border-b">
                    {review.comment}
                  </td>
                  <td className="py-3 px-4 border-b flex justify-center space-x-2">
                    <button
                      onClick={() => openUpdateModal(review)}
                      className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-700"
                    >
                      Update
                    </button>
                    <button
                      onClick={() => handleDelete(review.id)}
                      className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-700"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default OwnerReviews;