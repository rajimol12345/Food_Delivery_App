import React, { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import io from 'socket.io-client';
import 'react-toastify/dist/ReactToastify.css';
import './PlaceOrder.css';

const socket = io('http://localhost:5000');

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

  // Extract restaurant info from first item in the cart
  const restaurantId = orderData.cartItems[0]?.restaurantId || null;
  const restaurantName = orderData.cartItems[0]?.restaurantName || "Unknown Restaurant";

  const handlePlaceOrder = async () => {
    const userId = getCookie('token');

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
        restaurantId,
        restaurantName, // ⭐ FIX ADDED
        address: {
          name,
          line1: address,
          line2: '',
          city,
          pincode,
        },
        items: orderData.cartItems.map(item => ({
          menuId: item._id,
          name: item.name,
          image: item.image,
          price: item.price,
          quantity: item.quantity,
        })),
        totalAmount: total,
        paymentMethod: orderData.paymentMode || 'N/A',
      };

      const response = await axios.post(
        'http://localhost:5000/api/order/place',
        payload
      );

      socket.emit('newOrder', {
        orderId: response.data?.orderId || 'N/A',
        restaurantName,
        customerName: name,
        totalAmount: total,
        time: new Date().toISOString(),
      });

      toast.success('Order placed successfully!', { autoClose: 1500 });

      setTimeout(() => {
        navigate('/order-success', {
          state: {
            orderId: response.data?.orderId || 'N/A',
            restaurantName,
            customerName: name,
            totalAmount: total,
            items: orderData.cartItems,
            deliveryAddress: { name, address, city, pincode },
          },
        });
      }, 1500);
    } catch (err) {
      toast.error(
        err?.response?.data?.error || 'Error placing order. Please try again.'
      );
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
              <img
                src={item.image || 'https://via.placeholder.com/80'}
                alt={item.name}
                className="placeorder-item-img"
              />
              <div className="placeorder-item-info">
                <h5>{item.name}</h5>
                <p>Quantity: {item.quantity}</p>
                <p className="price">₹{item.price * item.quantity}</p>
              </div>
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
