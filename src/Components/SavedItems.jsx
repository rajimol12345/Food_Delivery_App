import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { FaHeart } from 'react-icons/fa';
import './SavedItems.css';

const SavedItems = () => {
  const [savedItems, setSavedItems] = useState([]);
  const [loading, setLoading] = useState(true);

  const getCookie = (name) => {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
    return null;
  };

  const userId = getCookie('token');

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

  const handleToggleSave = async (productId) => {
    const isSaved = savedItems.some((item) => item.productId._id === productId);

    try {
      if (isSaved) {
        // Remove from saved
        await axios.delete(`http://localhost:5000/api/saved/${userId}/${productId}`);
        setSavedItems((prev) => prev.filter((item) => item.productId._id !== productId));
      } else {
        // Add to saved
        await axios.post(`http://localhost:5000/api/saved`, {
          userId,
          productId
        });
        const productData = await axios.get(`http://localhost:5000/api/products/${productId}`);
        setSavedItems((prev) => [...prev, { productId: productData.data }]);
      }
    } catch (err) {
      console.error('Error toggling saved item:', err);
    }
  };

  if (!userId) {
    return <div className="saved-message error">Please log in to view saved items.</div>;
  }

  if (loading) return <div className="saved-message">Loading saved items...</div>;

  return (
    <div className="saved-container">
      <h2 className="saved-title">Saved Items</h2>

      <div className="saved-grid">
        {savedItems.map(({ productId }) => {
          const isSaved = savedItems.some((item) => item.productId._id === productId._id);
          return (
            <div key={productId._id} className="saved-card">
              <FaHeart
                className="saved-heart-icon"
                style={{ color: isSaved ? 'red' : 'grey', cursor: 'pointer' }}
                onClick={() => handleToggleSave(productId._id)}
              />

              <img
                src={productId.image}
                alt={productId.name}
                className="saved-image"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = '/fallback.jpg';
                }}
              />

              <div className="saved-content">
                <h3 className="saved-name">{productId.name}</h3>
                <p className="saved-desc">{productId.description}</p>
                <p className="saved-price">₹{productId.price}</p>

                {!isSaved && (
                  <button
                    className="saved-add-btn"
                    onClick={() => handleToggleSave(productId._id)}
                  >
                    Add
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default SavedItems;
