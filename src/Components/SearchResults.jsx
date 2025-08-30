import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";
import "./searchResults.css";

const SearchResults = () => {
  const [foods, setFoods] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const location = useLocation();

  // get search query from URL
  const query = new URLSearchParams(location.search).get("q");

  useEffect(() => {
    if (!query) return;

    const fetchResults = async () => {
      setLoading(true);
      setError(""); // reset error
      try {
        const { data } = await axios.get(
          `http://localhost:5000/api/search?q=${encodeURIComponent(query)}`
        );

        if (data && Array.isArray(data.results)) {
          setFoods(data.results);
        } else {
          setFoods([]);
        }
      } catch (err) {
        console.error("Search fetch error:", err.response?.data || err.message);
        setError(err.response?.data?.message || "Failed to fetch results");
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
  }, [query]);

  return (
    <div className="search-results">
      <h2>Search Results for "{query}"</h2>

      {loading && <p>Loading...</p>}
      {error && <p className="error">{error}</p>}

      {!loading && !error && foods.length === 0 && (
        <p>No items found.</p>
      )}

      <div className="card-grid">
        {foods.map((food) => (
          <div className="card" key={food._id}>
            {food.image && (
              <img
                src={food.image}
                alt={food.name}
                className="card-img"
              />
            )}
            <div className="card-body">
              <h4>{food.name}</h4>
              {food.category && (
                <p>
                  <strong>Category:</strong> {food.category}
                </p>
              )}
              <p>
                <strong>Price:</strong> ₹{food.price}
              </p>
              {food.description && <p>{food.description}</p>}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SearchResults;
