import React, { useState, useEffect } from "react";
import { FaStar } from "react-icons/fa";
import axios from "axios";

axios.defaults.baseURL = "http://localhost:5000";

const Rating = ({ restaurantId, onRatingSubmit }) => {
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(null);
  const [average, setAverage] = useState(0);
  const [loading, setLoading] = useState(true);

  // Utility to get cookie value by name (same as MyOrders)
  const getCookie = (name) => {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(";").shift();
    return null;
  };

  const userId = getCookie("token") || localStorage.getItem("userId");

  useEffect(() => {
    if (!restaurantId) return;

    const loadRatings = async () => {
      try {
        setLoading(true);

        // Load average rating
        const avgRes = await axios.get(`/api/rate/average/${restaurantId}`);
        setAverage(avgRes.data.average ?? 0);

        // Load logged-in user's rating
        if (userId) {
          try {
            const userRes = await axios.get(`/api/rate/${restaurantId}/${userId}`);
            setRating(userRes.data.rating ?? 0);
          } catch (err) {
            // User hasn't rated yet - this is fine
            setRating(0);
          }
        }
      } catch (err) {
        console.error("Rating load failed:", err);
      } finally {
        setLoading(false);
      }
    };

    loadRatings();
  }, [restaurantId, userId]);

  const submitRating = async (value) => {
    if (!userId) {
      alert("Please log in first!");
      return;
    }

    setRating(value);

    try {
      // If onRatingSubmit prop is provided, use it (from MyOrders)
      if (onRatingSubmit) {
        await onRatingSubmit(value);
      } else {
        // Otherwise, handle submission directly
        await axios.post("/api/rate", {
          restaurantId,
          userId,
          rating: value,
        });
        alert("Rating saved!");
      }

      // Refresh average rating
      const avg = await axios.get(`/api/rate/average/${restaurantId}`);
      setAverage(avg.data.average ?? 0);
    } catch (err) {
      console.error("Rating submission error:", err);
      alert("Failed to submit rating.");
    }
  };

  if (loading) return <p>Loading rating...</p>;

  return (
    <div style={{ textAlign: "left" }}>
      <div style={{ display: "flex", flexDirection: "row", alignItems: "center" }}>
        {[...Array(5)].map((_, index) => {
          const value = index + 1;

          return (
            <FaStar
              key={value}
              size={30}
              style={{ cursor: "pointer", marginRight: 5 }}
              color={(hover ?? rating) >= value ? "#ffc107" : "#e4e5e9"}
              onMouseEnter={() => setHover(value)}
              onMouseLeave={() => setHover(null)}
              onClick={() => submitRating(value)}
            />
          );
        })}
      </div>

      <p style={{ marginTop: 6 }}>
        Average Rating: <b>{average.toFixed(1)}</b> / 5
      </p>
    </div>
  );
};

export default Rating;