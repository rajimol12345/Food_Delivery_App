import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./TrackOrder.css";

axios.defaults.baseURL = "http://localhost:5000";

const TrackOrder = () => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [error, setError] = useState(null);

  // Utility to get cookie value by name
  const getCookie = (name) => {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(";").shift();
    return null;
  };

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const userId = getCookie("token") || localStorage.getItem("userId");

        if (!userId) {
          setError("Please login to view orders");
          navigate("/LoginForm");
          return;
        }

        const response = await axios.get(`/api/order/myorders?userId=${userId}`);
        const orderData = Array.isArray(response.data) ? response.data : [];
        
        setOrders(orderData);
        if (orderData.length > 0) {
          setSelectedOrder(orderData[0]);
        }
      } catch (err) {
        console.error("Error fetching orders:", err);
        setError("Failed to load orders. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [navigate]);

  const getStatusStep = (status) => {
    const steps = {
      pending: 1,
      confirmed: 2,
      preparing: 3,
      "out for delivery": 4,
      delivered: 5,
      cancelled: 0,
    };
    return steps[status?.toLowerCase()] || 1;
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-IN", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (loading) {
    return (
      <div className="track-order-container">
        <div className="loading-wrapper">
          <div className="loader"></div>
          <p>Loading your orders...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="track-order-container">
        <div className="error-wrapper">
          <div className="error-icon">⚠️</div>
          <h2>Oops!</h2>
          <p>{error}</p>
          <button onClick={() => navigate("/Home")} className="back-btn">
            Go to Home
          </button>
        </div>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="track-order-container">
        <div className="no-orders-wrapper">
          <div className="no-orders-icon">📦</div>
          <h2>No Orders Yet</h2>
          <p>You haven't placed any orders. Start exploring our restaurants!</p>
          <button onClick={() => navigate("/Home")} className="explore-btn">
            Explore Restaurants
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="track-order-container">
      <div className="track-order-content">
        {/* Header */}
        <div className="track-header">
          <button onClick={() => navigate("/Home")} className="back-button">
            ← Back
          </button>
          <h1>Track Your Orders</h1>
          <p>Monitor your order status in real-time</p>
        </div>

        <div className="track-layout">
          {/* Orders List Sidebar */}
          <div className="orders-sidebar">
            <h3>Your Orders ({orders.length})</h3>
            <div className="orders-list">
              {orders.map((order) => (
                <div
                  key={order._id}
                  className={`order-card ${
                    selectedOrder?._id === order._id ? "active" : ""
                  }`}
                  onClick={() => setSelectedOrder(order)}
                >
                  <div className="order-card-header">
                    <span className="order-id">
                      #{order._id?.slice(-8).toUpperCase()}
                    </span>
                    <span
                      className={`status-badge status-${order.status?.toLowerCase().replace(/\s/g, "-")}`}
                    >
                      {order.status || "Pending"}
                    </span>
                  </div>
                  <div className="order-card-body">
                    <p className="restaurant-name">
                      {order.restaurantName || "Restaurant"}
                    </p>
                    <p className="order-date">{formatDate(order.createdAt)}</p>
                    <p className="order-total">
                      ₹{(order.totalAmount || order.amount || 0).toFixed(2)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Order Details Panel */}
          {selectedOrder && (
            <div className="order-details-panel">
              {/* Order Info */}
              <div className="order-info-section">
                <h2>Order Details</h2>
                <div className="order-meta">
                  <div className="meta-item">
                    <span className="meta-label">Order ID</span>
                    <span className="meta-value">
                      #{selectedOrder._id?.slice(-8).toUpperCase()}
                    </span>
                  </div>
                  <div className="meta-item">
                    <span className="meta-label">Restaurant</span>
                    <span className="meta-value">
                      {selectedOrder.restaurantName || "Restaurant"}
                    </span>
                  </div>
                  <div className="meta-item">
                    <span className="meta-label">Order Date</span>
                    <span className="meta-value">
                      {formatDate(selectedOrder.createdAt)}
                    </span>
                  </div>
                  <div className="meta-item">
                    <span className="meta-label">Total Amount</span>
                    <span className="meta-value total-amount">
                      ₹
                      {(
                        selectedOrder.totalAmount ||
                        selectedOrder.amount ||
                        0
                      ).toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Order Status Tracker */}
              <div className="status-tracker-section">
                <h2>Order Status</h2>
                <div className="status-timeline">
                  {selectedOrder.status?.toLowerCase() === "cancelled" ? (
                    <div className="cancelled-status">
                      <div className="cancelled-icon">❌</div>
                      <h3>Order Cancelled</h3>
                      <p>This order has been cancelled.</p>
                    </div>
                  ) : (
                    <>
                      <div
                        className={`timeline-step ${
                          getStatusStep(selectedOrder.status) >= 1
                            ? "completed"
                            : ""
                        } ${
                          getStatusStep(selectedOrder.status) === 1
                            ? "active"
                            : ""
                        }`}
                      >
                        <div className="step-icon">📝</div>
                        <div className="step-content">
                          <h4>Order Placed</h4>
                          <p>We have received your order</p>
                        </div>
                      </div>

                      <div
                        className={`timeline-step ${
                          getStatusStep(selectedOrder.status) >= 2
                            ? "completed"
                            : ""
                        } ${
                          getStatusStep(selectedOrder.status) === 2
                            ? "active"
                            : ""
                        }`}
                      >
                        <div className="step-icon">✅</div>
                        <div className="step-content">
                          <h4>Order Confirmed</h4>
                          <p>Restaurant has confirmed your order</p>
                        </div>
                      </div>

                      <div
                        className={`timeline-step ${
                          getStatusStep(selectedOrder.status) >= 3
                            ? "completed"
                            : ""
                        } ${
                          getStatusStep(selectedOrder.status) === 3
                            ? "active"
                            : ""
                        }`}
                      >
                        <div className="step-icon">👨‍🍳</div>
                        <div className="step-content">
                          <h4>Preparing</h4>
                          <p>Your food is being prepared</p>
                        </div>
                      </div>

                      <div
                        className={`timeline-step ${
                          getStatusStep(selectedOrder.status) >= 4
                            ? "completed"
                            : ""
                        } ${
                          getStatusStep(selectedOrder.status) === 4
                            ? "active"
                            : ""
                        }`}
                      >
                        <div className="step-icon">🚴</div>
                        <div className="step-content">
                          <h4>Out for Delivery</h4>
                          <p>Your order is on the way</p>
                        </div>
                      </div>

                      <div
                        className={`timeline-step ${
                          getStatusStep(selectedOrder.status) >= 5
                            ? "completed"
                            : ""
                        } ${
                          getStatusStep(selectedOrder.status) === 5
                            ? "active"
                            : ""
                        }`}
                      >
                        <div className="step-icon">🎉</div>
                        <div className="step-content">
                          <h4>Delivered</h4>
                          <p>Enjoy your meal!</p>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </div>

              {/* Order Items */}
              {selectedOrder.items && selectedOrder.items.length > 0 && (
                <div className="order-items-section">
                  <h2>Order Items</h2>
                  <div className="items-grid">
                    {selectedOrder.items.map((item, index) => (
                      <div key={index} className="item-detail-card">
                        <div className="item-detail-info">
                          <h4>{item.name}</h4>
                          <p className="item-quantity">Quantity: {item.quantity}</p>
                        </div>
                        <div className="item-detail-price">
                          ₹{(item.price * item.quantity).toFixed(2)}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Delivery Address */}
              {selectedOrder.address && (
                <div className="delivery-address-section">
                  <h2>Delivery Address</h2>
                  <div className="address-card">
                    <div className="address-icon">📍</div>
                    <div className="address-content">
                      <p>
                        {selectedOrder.address.street ||
                          selectedOrder.address.fullAddress ||
                          "Address not available"}
                      </p>
                      {selectedOrder.address.city && (
                        <p>{selectedOrder.address.city}</p>
                      )}
                      {selectedOrder.address.zipCode && (
                        <p>PIN: {selectedOrder.address.zipCode}</p>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TrackOrder;