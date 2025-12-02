// Checkout.jsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './Checkout.css'; 

const Checkout = () => {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({
    name: '',
    line1: '',
    line2: '',
    city: '',
    pincode: '',
  });

  const getCookie = (name) => {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
    return null;
  };

  const userId = getCookie('token');
  const navigate = useNavigate();

  useEffect(() => {
    if (userId) {
      fetchUserProfile();
      fetchCartItems();
    } else {
      setLoading(false);
    }
  }, [userId]);

  const fetchUserProfile = async () => {
    try {
      const res = await axios.get(`http://localhost:5000/food-ordering-app/api/user/profile/${userId}`);
      const user = res.data;
      setForm({
        name: user.fullname || '',
        line1: user.deliveryAddress?.line1 || '',
        line2: user.deliveryAddress?.line2 || '',
        city: user.deliveryAddress?.city || '',
        pincode: user.deliveryAddress?.pincode || '',
      });
    } catch (err) {
      console.error('Error fetching user profile:', err);
    }
  };

  const fetchCartItems = async () => {
    try {
      const res = await axios.get(`http://localhost:5000/api/cart/${userId}`);
      setCartItems(res.data);
    } catch (err) {
      console.error('Error fetching cart items:', err);
    } finally {
      setLoading(false);
    }
  };

  const totalPrice = cartItems.reduce((acc, item) => {
    const price = item.menuId?.price || 0;
    return acc + price * (item.quantity || 1);
  }, 0);

  const handleInputChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleContinue = async () => {
    if (!form.name || !form.line1 || !form.city || !form.pincode) {
      alert('Please fill in all required delivery details.');
      return;
    }

    try {
      await axios.put(
        `http://localhost:5000/food-ordering-app/api/user/profile/${userId}`,
        {
          deliveryAddress: {
            line1: form.line1,
            line2: form.line2,
            city: form.city,
            pincode: form.pincode,
          },
        }
      );

      const orderData = {
        customer: {
          name: form.name,
          address: form.line1,
          city: form.city,
          pincode: form.pincode,
        },
        cartItems: cartItems.map((item) => ({
          ...item.menuId,
          quantity: item.quantity || 1,
        })),
      };

      navigate('/payment', { state: orderData });
    } catch (err) {
      console.error('Error preparing for payment:', err);
      alert('Something went wrong. Please try again.');
    }
  };

  if (!userId) return <div className="checkout-message error">Please log in to checkout.</div>;
  if (loading) return <div className="checkout-message">Loading checkout...</div>;

  return (
    <div className="checkout-container">
      <h2 className="checkout-title"> Checkout</h2>

      <div className="checkout-grid">
        {/* Delivery Form */}
        <div className="checkout-form">
          <h4>Delivery Details</h4>
          <input type="text" name="name" placeholder="Full Name" value={form.name} onChange={handleInputChange} required />
          <input type="text" name="line1" placeholder="Address Line 1" value={form.line1} onChange={handleInputChange} required />
          <input type="text" name="line2" placeholder="Address Line 2" value={form.line2} onChange={handleInputChange} />
          <input type="text" name="city" placeholder="City" value={form.city} onChange={handleInputChange} required />
          <input type="text" name="pincode" placeholder="Pincode" value={form.pincode} onChange={handleInputChange} required />
        </div>

        {/* Order Summary */}
        <div className="checkout-summary">
          <h4>Order Summary</h4>

          {cartItems.map((item) => (
            <div className="checkout-item" key={item._id}>
              {/* Item Image */}
              <img
                src={item.menuId?.image}
                alt={item.menuId?.name}
                className="checkout-item-img"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = 'https://via.placeholder.com/70?text=No+Img';
                }}
              />

              <div className="checkout-item-details">
                <span className="checkout-item-name">{item.menuId?.name}</span>
                <span className="checkout-item-qty">Qty: {item.quantity}</span>
              </div>

              <span className="checkout-item-price">
                ₹{(item.menuId?.price || 0) * (item.quantity || 1)}
              </span>
            </div>
          ))}

          <div className="checkout-total">
            <span>Total</span>
            <span className="price">₹{totalPrice}</span>
          </div>

          <button className="checkout-btn" onClick={handleContinue}>Continue</button>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
