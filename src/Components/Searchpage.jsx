// src/pages/Searchpage.jsx
import React, { useState } from "react";
import { FaSearch } from "react-icons/fa";
import axios from "axios";
import "./search.css";

const Searchpage = ({ onSearch }) => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState({ foods: [], restaurants: [] });
  const [loading, setLoading] = useState(false);

  // --- Helper to get cookie token ---
  const getCookie = (name) => {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(";").shift();
    return null;
  };

  const userId = getCookie("token");

  // --- Search Submit ---
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!query.trim()) return;

    setLoading(true);
    try {
      const { data } = await axios.get(
        `http://localhost:5000/api/search?q=${encodeURIComponent(query)}`
      );

      const foods = Array.isArray(data?.foods) ? data.foods : [];
      const restaurants = Array.isArray(data?.restaurants) ? data.restaurants : [];

      setResults({ foods, restaurants });

      if (onSearch) onSearch({ foods, restaurants });
    } catch (error) {
      console.error("Search error:", error);
      setResults({ foods: [], restaurants: [] });
    } finally {
      setLoading(false);
    }
  };

  // --- Add to Cart Function ---
  const handleAddToCart = async (foodId) => {
    if (!userId) {
      alert("Please log in to add items to cart!");
      return;
    }

    try {
      await axios.post("http://localhost:5000/api/cart/add", {
        userId,
        menuId: foodId,
        quantity: 1,
      });

      alert("Item added to cart!");
    } catch (error) {
      console.error("Error adding to cart:", error);
      alert("Failed to add item to cart.");
    }
  };

  return (
    <div className="search-container">
      {/* Search Bar */}
      <form className="search-bar" onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Search food or restaurant..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <button type="submit">
          <FaSearch />
        </button>
      </form>

      {/* Loading */}
      {loading && <p className="loading-text">Searching...</p>}

      {/* Results */}
      {!loading && (results.foods.length > 0 || results.restaurants.length > 0) && (
        <div className="cards-container">
          {/* Foods */}
          {results.foods.map((food) => (
            <div className="card" key={food._id}>
              <img
                src={food.image || "/fallback-food.jpg"}
                alt={food.name}
                className="card-image"
              />
              <div className="card-content">
                <h3 className="card-title">{food.name}</h3>
                <p className="card-description">{food.description}</p>
                <p className="card-price">₹{food.price}</p>
                <button
                  className="add-btn"
                  onClick={() => handleAddToCart(food._id)}
                >
                  ADD
                </button>
              </div>
            </div>
          ))}

          {/* Restaurants */}
          {results.restaurants.map((rest) => (
            <div className="card" key={rest._id}>
              <img
                src={rest.image || "/fallback-restaurant.jpg"}
                alt={rest.name}
                className="card-image"
              />
              <div className="card-content">
                <h3 className="card-title">{rest.name}</h3>
                <p className="card-description">{rest.description}</p>
                <button className="add-btn">View</button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* No Results */}
      {!loading &&
        query.trim() &&
        results.foods.length === 0 &&
        results.restaurants.length === 0 && (
          <p className="no-results">No results found.</p>
        )}
    </div>
  );
};

export default Searchpage;
