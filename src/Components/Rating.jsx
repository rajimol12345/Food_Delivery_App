import React, { useState, useEffect } from "react";
import { FaStar } from "react-icons/fa";
import axios from "axios";

axios.defaults.baseURL = "http://localhost:5000";

const Rating = ({ restaurantId }) => {
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(null);
  const [average, setAverage] = useState(0);
  const [loading, setLoading] = useState(true);

  const userId = localStorage.getItem("userId");

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
          const userRes = await axios.get(`/api/rate/${restaurantId}/${userId}`);
          setRating(userRes.data.rating ?? 0);
        }
      } catch (err) {
        console.error("Rating load failed:", err);
      }

      setLoading(false);
    };

    loadRatings();
  }, [restaurantId]); // removed userId dependency to avoid popup loop

  const submitRating = async (value) => {
    if (!userId) {
      alert("Please log in first!");
      return;
    }

    setRating(value);

    try {
      await axios.post("/api/rate", {
        restaurantId,
        userId,
        rating: value,
      });

      // Refresh average rating
      const avg = await axios.get(`/api/rate/average/${restaurantId}`);
      setAverage(avg.data.average ?? 0);

      alert("Rating saved!");
    } catch (err) {
      console.error("Rating submission error:", err);
      alert("Failed to submit rating.");
    }
  };

  if (loading) return <p>Loading rating...</p>;

  return (
    <div style={{ textAlign: "left" }}>
      <div style={{ display: "flex", flexDirection: "row" }}>
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
        ⭐ Average Rating: <b>{average.toFixed(1)}</b> / 5
      </p>
    </div>
  );
};

export default Rating;
