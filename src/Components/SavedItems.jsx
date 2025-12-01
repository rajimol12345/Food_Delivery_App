import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { FaHeart, FaRegHeart, FaShoppingCart } from 'react-icons/fa';
import './SavedItems.css';

const SavedItems = () => {
  const [savedItems, setSavedItems] = useState([]);
  const [loading, setLoading] = useState(true);

  // Function to read token from cookies
  const getCookie = (name) => {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
    return null;
  };

  const userId = getCookie('token');

  // Fetch saved items on mount or userId change
  useEffect(() => {
    const fetchSavedItems = async () => {
      if (!userId) {
        setLoading(false);
        return;
      }

      try {
        const res = await axios.get(`http://localhost:5000/api/saved/${userId}`);
        setSavedItems(res.data);
      } catch (err) {
        console.error('Error fetching saved items:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchSavedItems();
  }, [userId]);

  // Save/Unsave toggle handler
  const handleToggleSave = async (productId) => {
    const isSaved = savedItems.some((item) => item.productId._id === productId);

    try {
      if (isSaved) {
        // Remove from saved
        await axios.delete(`http://localhost:5000/api/saved/${userId}/${productId}`);
        setSavedItems((prev) => prev.filter((item) => item.productId._id !== productId));
      } else {
        // Add to saved
        await axios.post(`http://localhost:5000/api/saved/add`, {
          userId,
          productId,
        });
        const productData = await axios.get(`http://localhost:5000/api/products/${productId}`);
        setSavedItems((prev) => [...prev, { productId: productData.data }]);
      }
    } catch (err) {
      console.error('Error toggling saved item:', err);
    }
  };

  // Add item to cart handler
  const handleAddToCart = async (menuId) => {
    try {
      await axios.post(`http://localhost:5000/api/cart/addcart`, {
        userId,
        menuId,
        quantity: 1,
      });
      alert('Item added to cart!');
    } catch (err) {
      console.error('Error adding to cart:', err);
      alert('Failed to add item to cart.');
    }
  };

  if (!userId) {
    return <div className="saved-message error">Please log in to view saved items.</div>;
  }

  if (loading) {
    return <div className="saved-message">Loading saved items...</div>;
  }

  return (
    <div className="saved-container">
      <h2 className="saved-title">Saved Items</h2>

      <div className="saved-grid">
        {savedItems.length === 0 && <p>No saved items available.</p>}
        {savedItems.map(({ productId }) => {
          // Check if this product is saved
          const isSaved = savedItems.some((item) => item.productId._id === productId._id);

          return (
            <div key={productId._id} className="saved-card" style={{ position: 'relative' }}>
              {/* Wishlist Heart Icon */}
              <span
                className={`wishlist-icon position-absolute ${isSaved ? 'saved' : ''}`}
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  handleToggleSave(productId._id);
                }}
                title={isSaved ? 'Remove from saved items' : 'Add to saved items'}
                role="button"
                tabIndex={0}
                onKeyPress={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    handleToggleSave(productId._id);
                  }
                }}
              >
                {isSaved ? <FaHeart /> : <FaRegHeart />}
              </span>

              {/* Product Image */}
              <img
                src={productId.image}
                alt={productId.name}
                className="saved-image"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = '/fallback.jpg';
                }}
              />

              {/* Product Info */}
              <div className="saved-content">
                <h3 className="saved-name">{productId.name}</h3>
                <p className="saved-desc">{productId.description}</p>
                <p className="saved-price">₹{productId.price}</p>

                {/* Add to Cart Button */}
                <button
                  className="saved-cart-btn"
                  onClick={() => handleAddToCart(productId._id)}
                >
                  <FaShoppingCart className="cart-icon" /> Add
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default SavedItems;
