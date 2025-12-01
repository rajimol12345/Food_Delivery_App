import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "./OrderSuccessPage.css";

const OrderSuccessPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [orderDetails, setOrderDetails] = useState(null);

  useEffect(() => {
    // Check if order details came from navigation
    if (location.state) {
      setOrderDetails(location.state);
    } else {
      // Redirect to homepage if no data found
      navigate("/");
    }
  }, [location.state, navigate]);

  if (!orderDetails) return null;

  return (
    <div className="order-success-container">
      <div className="success-card">

        {/* Success Animation */}
        <div className="checkmark-wrapper">
          <div className="checkmark">
            <svg viewBox="0 0 52 52">
              <circle className="checkmark-circle" cx="26" cy="26" r="25" fill="none" />
              <path className="checkmark-check" fill="none" d="M14 27l7 7 16-16" />
            </svg>
          </div>
        </div>

        <h1>Order Confirmed!</h1>
        <p>Thank you for your order. Your delicious food is on the way!</p>

        {/* ORDER DETAILS */}
        <div className="order-info">
          <h2>Order Details</h2>

          <p>
            <strong>Order ID:</strong> {orderDetails.orderId || "N/A"}
          </p>

          <p>
            <strong>Restaurant:</strong> {orderDetails.restaurantName || "N/A"}
          </p>

          <p>
            <strong>Total Amount:</strong> ₹{orderDetails.total || 0}
          </p>

          <p>
            <strong>Delivery Time:</strong> {orderDetails.deliveryTime || "30–40 mins"}
          </p>
        </div>

        {/* Continue Button */}
        <button className="home-btn" onClick={() => navigate("/Home")}>
          Order More
        </button>
      </div>
    </div>
  );
};

export default OrderSuccessPage;
