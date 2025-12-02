import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import "./OrderSuccessPage.css";

axios.defaults.baseURL = "http://localhost:5000";

const OrderSuccessPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [orderDetails, setOrderDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showConfetti, setShowConfetti] = useState(false);

  // Utility to get cookie value by name
  const getCookie = (name) => {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(";").shift();
    return null;
  };

  useEffect(() => {
    const fetchOrderDetails = async () => {
      try {
        // First, check if order details came from navigation state
        if (location.state && location.state.orderId) {
          setOrderDetails(location.state);
          setLoading(false);
          setShowConfetti(true);
          return;
        }

        // If no state, try to fetch the latest order from backend
        const userId = getCookie("token") || localStorage.getItem("userId");
        
        if (!userId) {
          console.error("User not logged in");
          navigate("/");
          return;
        }

        // Fetch the user's most recent order
        const response = await axios.get(`/api/order/myorders?userId=${userId}`);
        const orders = Array.isArray(response.data) ? response.data : [];
        
        if (orders.length > 0) {
          // Get the most recent order (first in array, assuming sorted by date)
          const latestOrder = orders[0];
          
          setOrderDetails({
            orderId: latestOrder._id,
            restaurantName: latestOrder.restaurantName || "Restaurant",
            total: latestOrder.totalAmount || latestOrder.amount || 0,
            deliveryTime: latestOrder.deliveryTime || "30–40 mins",
            items: latestOrder.items || [],
            address: latestOrder.address || {},
            createdAt: latestOrder.createdAt,
          });
          setShowConfetti(true);
        } else {
          // No orders found, redirect to home
          navigate("/");
        }
      } catch (error) {
        console.error("Error fetching order details:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrderDetails();
  }, [location.state, navigate]);

  if (loading) {
    return (
      <div className="order-success-container">
        <div className="success-card loading-card">
          <div className="loader"></div>
          <p>Loading order details...</p>
        </div>
      </div>
    );
  }

  if (!orderDetails) return null;

  return (
    <div className="order-success-container">
      {/* Confetti Animation */}
      {showConfetti && (
        <div className="confetti-wrapper">
          {[...Array(50)].map((_, i) => (
            <div
              key={i}
              className="confetti"
              style={{
                left: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 3}s`,
                backgroundColor: ['#ff6b6b', '#4ecdc4', '#45b7d1', '#f9ca24', '#6c5ce7'][Math.floor(Math.random() * 5)]
              }}
            />
          ))}
        </div>
      )}

      <div className="success-card">
        {/* Success Animation */}
        <div className="checkmark-wrapper">
          <div className="checkmark-circle-wrapper">
            <svg className="checkmark" viewBox="0 0 52 52">
              <circle
                className="checkmark-circle"
                cx="26"
                cy="26"
                r="25"
                fill="none"
              />
              <path
                className="checkmark-check"
                fill="none"
                d="M14 27l7 7 16-16"
              />
            </svg>
          </div>
        </div>

        <h1 className="success-title">Order Confirmed!</h1>
        <p className="success-subtitle">
          🎉 Thank you for your order. Your delicious food is on the way!
        </p>

        {/* Order ID Badge */}
        <div className="order-id-badge">
          <span className="badge-label">Order ID:</span>
          <span className="badge-value">#{orderDetails.orderId?.slice(-8).toUpperCase()}</span>
        </div>

        {/* ORDER DETAILS */}
        <div className="order-info">
          <div className="info-row">
            <div className="info-item">
              <div className="info-icon">💰</div>
              <div className="info-content">
                <span className="info-label">Total Amount</span>
                <span className="info-value">₹{orderDetails.total?.toFixed(2) || "0.00"}</span>
              </div>
            </div>

            <div className="info-item">
              <div className="info-icon">🚴</div>
              <div className="info-content">
                <span className="info-label">Delivery Time</span>
                <span className="info-value">{orderDetails.deliveryTime || "30–40 mins"}</span>
              </div>
            </div>
          </div>

          {/* Restaurant Name */}
          {orderDetails.restaurantName && (
            <div className="restaurant-info">
              <span className="restaurant-icon">🍽️</span>
              <span className="restaurant-name">{orderDetails.restaurantName}</span>
            </div>
          )}

          {/* Ordered Items */}
          {orderDetails.items && orderDetails.items.length > 0 && (
            <div className="order-items-section">
              <h3 className="items-title">📋 Order Summary</h3>
              <div className="items-list">
                {orderDetails.items.map((item, index) => (
                  <div key={index} className="item-card">
                    <div className="item-info">
                      <span className="item-name">{item.name}</span>
                      <span className="item-quantity">x {item.quantity}</span>
                    </div>
                    <span className="item-price">₹{(item.price * item.quantity).toFixed(2)}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Delivery Address */}
          {orderDetails.address && (
            <div className="address-section">
              <h3 className="address-title">📍 Delivery Address</h3>
              <p className="address-text">
                {orderDetails.address.street || orderDetails.address.fullAddress || "Address not available"}
              </p>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="action-buttons">
          <button className="track-btn" onClick={() => navigate("/orders")}>
            <span className="btn-icon">📦</span>
            Track Order
          </button>
          <button className="home-btn" onClick={() => navigate("/Home")}>
            <span className="btn-icon">🍕</span>
            Order More
          </button>
        </div>

        {/* Thank You Message */}
        <div className="thank-you-message">
          <p>We appreciate your business! 💚</p>
        </div>
      </div>
    </div>
  );
};

export default OrderSuccessPage;