// PlaceOrder.jsx
import React, { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import io from 'socket.io-client'; // ✅ Added for real-time notifications
import 'react-toastify/dist/ReactToastify.css';
import './PlaceOrder.css';

const socket = io('http://localhost:5000'); // ✅ Connect to backend socket server

const PlaceOrder = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const orderData = location.state;

  useEffect(() => {
    if (!orderData) {
      toast.error('No order data found. Redirecting...');
      setTimeout(() => navigate('/'), 2000);
    }
  }, [orderData, navigate]);

  const getCookie = (name) => {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
    return null;
  };

  if (!orderData) return null;

  const { name, address, city, pincode } = orderData.customer;

  const total = orderData.cartItems.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );

  const handlePlaceOrder = async () => {
    const userId = getCookie('token');

    // Validation
    if (!userId) {
      toast.error('User not logged in or token missing.');
      return;
    }

    if (!name || !address || !city || !pincode) {
      toast.error('Please fill in all delivery address fields.');
      return;
    }

    try {
      const payload = {
        userId,
        address: {
          name,
          line1: address,
          line2: '', // Optional
          city,
          pincode,
        },
        items: orderData.cartItems.map(item => ({
          menuId: item._id,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
        })),
        totalAmount: total,
        paymentMethod: orderData.paymentMode || 'N/A',
      };

      const response = await axios.post('http://localhost:5000/api/order/place', payload);

      // ✅ Emit socket event so admin can receive notification
      socket.emit('newOrder', {
        orderId: response.data?.orderId || 'N/A',
        customerName: name,
        totalAmount: total,
        time: new Date().toISOString(),
      });

      toast.success('Order placed successfully!', {
        autoClose: 2000,
        onClose: () => navigate('/Order'),
      });
    } catch (err) {
      toast.error(err?.response?.data?.error || 'Error placing order. Please try again.');
      console.error('Order Error:', err?.response?.data);
    }
  };

  return (
    <div className="placeorder-container">
      <ToastContainer position="top-center" />
      <h2>Review & Place Order</h2>

      <div className="placeorder-box">
        <div className="placeorder-section">
          <h4>Delivery Address</h4>
          <p><strong>Name:</strong> {name}</p>
          <p><strong>Address:</strong> {address}</p>
          <p><strong>City:</strong> {city}</p>
          <p><strong>Pincode:</strong> {pincode}</p>
          <p><strong>Payment:</strong> {orderData.paymentMode || 'N/A'}</p>
        </div>

        <div className="placeorder-section">
          <h4>Items</h4>
          {orderData.cartItems.map((item, idx) => (
            <div className="placeorder-item" key={idx}>
              <span>{item.name}</span>
              <span>Qty: {item.quantity}</span>
              <span>₹{item.price * item.quantity}</span>
            </div>
          ))}
          <div className="placeorder-total">
            <strong>Total:</strong> ₹{total}
          </div>
        </div>
      </div>

      <button className="placeorder-btn" onClick={handlePlaceOrder}>
        Place Order
      </button>
    </div>
  );
};

export default PlaceOrder;
