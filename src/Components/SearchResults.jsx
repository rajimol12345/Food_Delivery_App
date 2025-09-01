import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { FaHeart, FaRegHeart } from "react-icons/fa";
import "./searchResults.css";

const SearchResults = ({ showCustomToast }) => {
  const [foods, setFoods] = useState([]);
  const [savedItems, setSavedItems] = useState([]);
  const [cartItems, setCartItems] = useState([]); //  track cart items
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [toastMessage, setToastMessage] = useState("");
  const [showToast, setShowToast] = useState(false);

  const location = useLocation();
  const navigate = useNavigate();

  const query = new URLSearchParams(location.search).get("q");

  const getCookie = (name) => {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(";").shift();
    return null;
  };

  const userId = getCookie("token");

  // fetch search results + wishlist + cart
  useEffect(() => {
    if (!query) return;

    const fetchResults = async () => {
      setLoading(true);
      setError("");
      try {
        const [searchRes, savedRes, cartRes] = await Promise.all([
          axios.get(
            `http://localhost:5000/api/search?q=${encodeURIComponent(query)}`
          ),
          userId
            ? axios.get(`http://localhost:5000/api/saved/${userId}`)
            : Promise.resolve({ data: [] }),
          userId
            ? axios.get(`http://localhost:5000/api/cart/${userId}`)
            : Promise.resolve({ data: [] }),
        ]);

        if (searchRes.data && Array.isArray(searchRes.data.results)) {
          setFoods(searchRes.data.results);
        } else {
          setFoods([]);
        }

        setSavedItems(savedRes.data.map((item) => item.productId));
        setCartItems(cartRes.data.map((item) => item.menuId)); // ✅ store cart ids
      } catch (err) {
        console.error("Search fetch error:", err.response?.data || err.message);
        setError(err.response?.data?.message || "Failed to fetch results");
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
  }, [query, userId]);

  const triggerToast = (message) => {
    if (showCustomToast) {
      showCustomToast(message);
    } else {
      setToastMessage(message);
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
    }
  };

  // wishlist handler
  const handleAddToWishlist = async (item) => {
    if (!userId) {
      triggerToast("Please log in to save items.");
      return;
    }
    const isAlreadySaved = savedItems.includes(item._id);
    try {
      if (isAlreadySaved) {
        await axios.delete(
          `http://localhost:5000/api/saved/${userId}/${item._id}`
        );
        setSavedItems((prev) => prev.filter((id) => id !== item._id));
        triggerToast(`${item.name} removed from Wishlist.`);
      } else {
        await axios.post("http://localhost:5000/api/saved/add", {
          userId,
          productId: item._id,
        });
        setSavedItems((prev) => [...prev, item._id]);
        triggerToast(`${item.name} added to Wishlist.`);
      }
    } catch (error) {
      console.error("Wishlist error:", error);
      triggerToast("Failed to update wishlist.");
    }
  };

  // cart handler
  const handleAddToCart = async (item) => {
    if (!userId) {
      triggerToast("Please log in to add items to cart.");
      return;
    }
    const isInCart = cartItems.includes(item._id);
    if (isInCart) {
      triggerToast(`${item.name} is already in your cart.`);
      return;
    }
    try {
      await axios.post("http://localhost:5000/api/cart/addcart", {
        userId,
        menuId: item._id,
        quantity: 1,
      });
      setCartItems((prev) => [...prev, item._id]); // update UI
      triggerToast(`${item.name} added to cart.`);
    } catch (error) {
      console.error("Error adding to cart:", error);
      triggerToast("Failed to add item to cart.");
    }
  };

  const handleCardClick = (item) => {
    navigate(`/food/${item._id}`);
  };

  return (
    <div className="search-results">
      <h2>Search Results for "{query}"</h2>

      {loading && <p>Loading...</p>}
      {error && <p className="error">{error}</p>}
      {!loading && !error && foods.length === 0 && <p>No items found.</p>}

      {/* Toast */}
      {showToast && (
        <div
          className="toast-container position-fixed bottom-0 end-0 p-3"
          style={{ zIndex: 9999 }}
        >
          <div className="toast show align-items-center text-white bg-dark border-0">
            <div className="d-flex">
              <div className="toast-body">{toastMessage}</div>
              <button
                type="button"
                className="btn-close btn-close-white me-2 m-auto"
                onClick={() => setShowToast(false)}
              ></button>
            </div>
          </div>
        </div>
      )}

      <div className="row g-4 px-4">
        {foods.map((food) => {
          const isSaved = savedItems.includes(food._id);
          const isInCart = cartItems.includes(food._id);

          return (
            <div className="col-md-3" key={food._id}>
              <div
                className="card h-100 shadow-sm position-relative"
                style={{ cursor: "pointer", transition: "transform 0.2s" }}
                onClick={() => handleCardClick(food)}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.transform = "scale(1.02)")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.transform = "scale(1)")
                }
              >
                {/* Wishlist Icon */}
                <span
                  onClick={(e) => {
                    e.stopPropagation();
                    handleAddToWishlist(food);
                  }}
                  title={isSaved ? "Remove from wishlist" : "Add to wishlist"}
                  className={`wishlist-icon position-absolute fs-5 ${
                    isSaved ? "saved animate-heart" : "not-saved"
                  }`}
                  style={{ top: "10px", right: "10px", zIndex: 2 }}
                >
                  {isSaved ? <FaHeart /> : <FaRegHeart />}
                </span>

                {/* Image */}
                {food.image && (
                  <img
                    src={food.image}
                    alt={food.name}
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = "/fallback.jpg";
                    }}
                    className="card-img-top"
                    style={{ height: "180px", objectFit: "cover" }}
                  />
                )}

                {/* Body */}
                <div className="card-body d-flex flex-column">
                  <h5 className="fw-semibold">{food.name}</h5>
                  <p className="text-muted small">{food.description}</p>
                  <p className="fw-bold text-success mb-2">₹{food.price}</p>
                  <div className="mt-auto">
                    <button
                      className={`btn w-100 ${
                        isInCart ? "btn-success" : "btn-primary"
                      }`}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleAddToCart(food);
                      }}
                      disabled={isInCart} //  disable if already added
                    >
                      {isInCart ? "In Cart" : "ADD"}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default SearchResults;
