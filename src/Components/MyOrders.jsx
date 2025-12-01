import React, { useEffect, useState } from "react";
import axios from "axios";
import Rating from "./Rating.jsx";
import "./MyOrders.css";

// Set default axios base URL
axios.defaults.baseURL = "http://localhost:5000";

const MyOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");

  // Utility to get cookie value by name
  const getCookie = (name) => {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(";").shift();
    return null;
  };

  const userId = getCookie("token"); // Make sure this is the actual user ID

  useEffect(() => {
    if (userId) {
      fetchOrders();
    } else {
      setErrorMsg("User not logged in.");
      setLoading(false);
    }
  }, [userId]);

  // Fetch orders from backend
  const fetchOrders = async () => {
    try {
      const response = await axios.get(`/api/order/myorders?userId=${userId}`);
      setOrders(Array.isArray(response.data) ? response.data : []);
    } catch (err) {
      setErrorMsg(
        err.response?.data?.error ||
          err.message ||
          "Failed to load orders. Please try again later."
      );
    } finally {
      setLoading(false);
    }
  };

  // Handle rating submission
  const handleRatingSubmit = async (orderId, value) => {
    try {
      await axios.post(`/api/rate`, {
        restaurantId: orderId, // match backend field name
        userId,
        rating: value,
      });
      alert(`Thanks for rating this order ${value} stars!`);
    } catch (err) {
      console.error(err);
      alert("Failed to submit rating.");
    }
  };

  // ===== Render States =====
  if (loading)
    return <div className="orders-message loading">Loading your orders...</div>;
  if (errorMsg) return <div className="orders-message error">{errorMsg}</div>;
  if (!orders.length)
    return <div className="orders-message">No orders found.</div>;

  return (
    <div className="orders-container">
      <h2 className="orders-title">My Orders</h2>

      {orders.map((order) => (
        <div className="order-card" key={order._id}>
          {/* ===== Order Header ===== */}
          <div className="order-header">
            <p>
              <strong>Order ID:</strong> {order._id}
            </p>
            <p>
              <strong>Date:</strong>{" "}
              {new Date(order.createdAt).toLocaleString()}
            </p>
          </div>

          {/* ===== Customer Info ===== */}
          <div className="order-info">
            <p>
              <strong>Customer:</strong> {order.address?.name || "N/A"}
            </p>
            <p>
              <strong>Address:</strong> {order.address?.line1},{" "}
              {order.address?.city} - {order.address?.pincode}
            </p>
            {order.paymentMethod && (
              <p>
                <strong>Payment:</strong> {order.paymentMethod}
              </p>
            )}
          </div>

          {/* ===== Items With Image ===== */}
          {Array.isArray(order.items) && order.items.length > 0 ? (
            <div className="order-items">
              <strong>Items:</strong>

              {order.items.map((item, index) => (
                <div key={index} className="order-item">
                  <img
                    src={
                      item.image ||
                      "https://via.placeholder.com/80?text=No+Image"
                    }
                    alt={item.name}
                    className="order-item-img"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src =
                        "https://via.placeholder.com/80?text=No+Image";
                    }}
                  />
                  <div className="order-item-details">
                    <span className="item-name">{item.name}</span>
                    <span className="item-qty">Qty: {item.quantity}</span>
                    <span className="item-price">
                      ₹{item.price * item.quantity}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="no-items">No items in this order.</p>
          )}

          {/* ===== Footer ===== */}
          <div className="order-footer">
            <div className="order-total">
              <strong>Total:</strong> ₹{order.totalAmount}
            </div>

            <div className="order-rating-right">
              <p>
                <strong>Rate:</strong>
              </p>
              <Rating
                restaurantId={order._id} // pass order ID as restaurantId
              />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default MyOrders;
