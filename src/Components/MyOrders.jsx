import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Rating from './Rating.jsx';
import './MyOrders.css';

const MyOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');

  const getCookie = (name) => {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
    return null;
  };

  const userId = getCookie('token');

  useEffect(() => {
    if (userId) {
      fetchOrders();
    } else {
      setErrorMsg('User not logged in.');
      setLoading(false);
    }
  }, [userId]);

  const fetchOrders = async () => {
    try {
      const response = await axios.get(
        `http://localhost:5000/api/order/myorders?userId=${userId}`
      );
      setOrders(Array.isArray(response.data) ? response.data : []);
    } catch (err) {
      setErrorMsg(
        err.response?.data?.error ||
        err.message ||
        'Failed to load orders. Please try again later.'
      );
    } finally {
      setLoading(false);
    }
  };

  const handleRatingSubmit = async (orderId, rating) => {
    try {
      await axios.post(`http://localhost:5000/api/rate`, { orderId, rating });
      alert(`Thanks for rating this order ${rating} stars!`);
    } catch (err) {
      console.error(err);
      alert('Failed to submit rating.');
    }
  };

  // --- States rendering (no empty divs) ---
  if (loading) {
    return <div className="orders-message loading">Loading your orders...</div>;
  }
  if (errorMsg) {
    return <div className="orders-message error">{errorMsg}</div>;
  }
  if (!orders.length) {
    return <div className="orders-message">No orders found.</div>;
  }

  return (
    <div className="orders-container">
      <h2 className="orders-title">My Orders</h2>

      {orders.map((order) => (
        <div className="order-card" key={order._id}>
          <div className="order-header">
            <p><strong>Order ID:</strong> {order._id}</p>
            <p><strong>Date:</strong> {new Date(order.createdAt).toLocaleString()}</p>
          </div>

          <div className="order-info">
            <p><strong>Customer:</strong> {order.address?.name || 'N/A'}</p>
            <p>
              <strong>Address:</strong>{' '}
              {order.address?.line1}, {order.address?.city} - {order.address?.pincode}
            </p>
            {order.paymentMethod && (
              <p><strong>Payment:</strong> {order.paymentMethod}</p>
            )}
          </div>

          {Array.isArray(order.items) && order.items.length > 0 ? (
            <div className="order-items">
              <strong>Items:</strong>
              {order.items.map((item, index) => {
                const imageUrl = item.image?.startsWith('http')
                  ? item.image
                  : item.image
                  ? `http://localhost:5000/${item.image}`
                  : null;

                return (
                  <div key={index} className="order-item">
                    {imageUrl ? (
                      <img
                        src={imageUrl}
                        alt={item.name}
                        className="order-item-image"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = '/fallback.jpg';
                        }}
                      />
                    ) : (
                      <div className="order-item-placeholder">No Image</div>
                    )}
                    <div className="order-item-details">
                      <span>{item.name}</span>
                      <span>Qty: {item.quantity}</span>
                      <span>₹{item.price * item.quantity}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <p className="no-items">No items in this order.</p>
          )}

          <div className="order-footer">
            <div className="order-total">
              <strong>Total:</strong> ₹{order.totalAmount}
            </div>
            <div className="order-rating-right">
              <p><strong>Rate:</strong></p>
              <Rating onRate={(value) => handleRatingSubmit(order._id, value)} />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default MyOrders;
