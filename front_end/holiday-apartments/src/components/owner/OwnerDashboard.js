import { useState, useEffect } from "react";
import OwnerMenu from "../owner/OwnerMenu";
import NavBar from "../common/NavBar";
import Footer from "../common/Footer";
import { useTranslation } from "react-i18next";

const OwnerDashboard = () => {
  const { t } = useTranslation();
  const [totalApartments, setTotalApartments] = useState(0);
  const [totalBookings, setTotalBookings] = useState(0);
  const [totalReviews, setTotalReviews] = useState(0);
  const [pendingReviews, setPendingReviews] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Check if the user is an owner
        try {
          const rawGroups = localStorage.getItem("groups");
          let groups = [];

          if (rawGroups) {
            try {
              const parsed = JSON.parse(rawGroups);
              groups = Array.isArray(parsed) ? parsed : [parsed];
            } catch {
              groups = [rawGroups];
            }
          }

          if (!groups.some(group => group === "Owners")) {
            console.error("User is not an owner.");
            return;
          }
        } catch (error) {
          console.error("Error checking owner status:", error);
          return;
        }

        // Fetch user ID from local storage
        const userId = localStorage.getItem("user_id");
        if (!userId) {
          console.error("User ID not found in local storage");
          return;
        }

        // Set up headers
        const token = localStorage.getItem("token");
        const myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");
        myHeaders.append("Authorization", `Token ${token}`);

        const requestOptions = {
          method: "GET",
          headers: myHeaders,
          redirect: "follow"
        };

        // Fetch apartments owned by the user
        const apartmentsResponse = await fetch(`http://localhost:8000/api/apartments/?owner=${userId}`, requestOptions);
        const apartmentsData = await apartmentsResponse.json();
        setTotalApartments(apartmentsData.length);

        // Fetch all bookings
        const bookingsResponse = await fetch("http://localhost:8000/api/bookings/", requestOptions);
        const bookingsData = await bookingsResponse.json();

        // Filter bookings to count only those for the user's apartments
        const userApartmentIds = apartmentsData.map((apartment) => apartment.id);
        const userBookings = bookingsData.filter((booking) =>
          userApartmentIds.includes(booking.apartment)
        );

        setTotalBookings(userBookings.length);

        // Fetch all reviews
        const reviewsResponse = await fetch("http://localhost:8000/api/reviews/", requestOptions);
        const reviewsData = await reviewsResponse.json();

        // Filter reviews to count only those for the user's apartments
        const userReviews = reviewsData.filter((review) =>
          userApartmentIds.includes(review.apartment)
        );

        setTotalReviews(userReviews.length);

        // Calculate pending reviews
        setPendingReviews(userBookings.length - userReviews.length);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="flex min-h-screen">
      <NavBar />
      <OwnerMenu />

      <div className="ml-64 p-6 w-full">
        <h1 className="text-3xl font-bold mb-4">{t("owner_dashboard")}</h1>
        <p className="text-gray-600">{t("manage_properties")}</p>

        <div className="mt-6 grid grid-cols-3 gap-4">
          <div className="bg-blue-100 p-4 rounded-lg shadow-md">
            <h2 className="text-lg font-semibold">{t("total_apartments")}</h2>
            <p className="text-xl font-bold">{totalApartments}</p>
          </div>

          <div className="bg-green-100 p-4 rounded-lg shadow-md">
            <h2 className="text-lg font-semibold">{t("total_bookings")}</h2>
            <p className="text-xl font-bold">{totalBookings}</p>
          </div>

          <div className="bg-yellow-100 p-4 rounded-lg shadow-md">
            <h2 className="text-lg font-semibold">{t("pending_reviews")}</h2>
            <p className="text-xl font-bold">{pendingReviews}</p>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default OwnerDashboard;