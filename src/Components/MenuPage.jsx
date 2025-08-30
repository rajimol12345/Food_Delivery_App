// src/pages/MenuPage.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { FaHeart } from "react-icons/fa";
import Filter from "./Filter";

const MenuPage = ({ showCustomToast }) => {
  const { categoryName } = useParams();
  const [menuItems, setMenuItems] = useState([]);
  const [savedItems, setSavedItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toastMessage, setToastMessage] = useState("");
  const [showToast, setShowToast] = useState(false);

  const navigate = useNavigate();

  const getCookie = (name) => {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(";").shift();
    return null;
  };

  const userId = getCookie("token");

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        // Menu items by category
        const menuRes = await axios.get(
          `http://localhost:5000/api/menu/menus/category/${encodeURIComponent(
            categoryName
          )}`
        );

        // Wishlist if logged in
        let savedRes = { data: [] };
        if (userId) {
          savedRes = await axios.get(
            `http://localhost:5000/api/saved/${userId}`
          );
        }

        setMenuItems(menuRes.data);
        setSavedItems(savedRes.data.map((item) => item.productId));
        setToastMessage("");
      } catch (err) {
        console.error("Error fetching menu by category:", err);
        triggerToast(
          err.response?.data?.message || "Failed to fetch menu by category"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [categoryName, userId]);

  const triggerToast = (message) => {
    if (showCustomToast) {
      showCustomToast(message);
    } else {
      setToastMessage(message);
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
    }
  };

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

  const handleAddToCart = async (item) => {
    if (!userId) {
      triggerToast("Please log in to add items to cart.");
      return;
    }

    try {
      await axios.post("http://localhost:5000/api/cart/addcart", {
        userId,
        menuId: item._id,
        quantity: 1,
      });

      triggerToast(`${item.name} added to cart.`);
    } catch (error) {
      console.error("Error adding to cart:", error);
      triggerToast("Failed to add item to cart.");
    }
  };

  const handleCardClick = (item) => {
    navigate(`/food/${item._id}`);
  };

  if (loading) return <p>Loading menu...</p>;

  return (
    <div className="menu-page bg-light py-5">
      <Filter />
      {/* Custom Toast */}
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

      <div className="menu-grid row g-4 px-4">
        {menuItems.length > 0 ? (
          menuItems.map((item) => (
            <div className="col-md-3" key={item._id}>
              <div
                className="card h-100 shadow-sm position-relative"
                style={{
                  cursor: "pointer",
                  transition: "transform 0.2s",
                }}
                onClick={() => handleCardClick(item)}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.transform = "scale(1.02)")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.transform = "scale(1)")
                }
              >
                {/* Heart Icon */}
                <FaHeart
                  onClick={(e) => {
                    e.stopPropagation();
                    handleAddToWishlist(item);
                  }}
                  title={
                    savedItems.includes(item._id)
                      ? "Remove from wishlist"
                      : "Add to wishlist"
                  }
                  className={`position-absolute fs-5 ${
                    savedItems.includes(item._id)
                      ? "text-danger"
                      : "text-secondary"
                  }`}
                  style={{ top: "10px", right: "10px", zIndex: 2 }}
                />

                {/* Image */}
                <img
                  src={item.image}
                  alt={item.name}
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src =
                      "https://via.placeholder.com/150?text=No+Image";
                  }}
                  className="card-img-top"
                  style={{ height: "180px", objectFit: "cover" }}
                />

                {/* Card Body */}
                <div className="card-body d-flex flex-column">
                  <h5 className="fw-semibold">{item.name}</h5>
                  <p className="text-muted small">{item.description}</p>
                  <p className="fw-bold text-success mb-2">₹{item.price}</p>

                  <div className="mt-auto">
                    <button
                      className="btn btn-primary w-100"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleAddToCart(item);
                      }}
                    >
                      ADD
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <p>No menu items available in this category</p>
        )}
      </div>
    </div>
  );
};

export default MenuPage;
