import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FaTrashAlt } from 'react-icons/fa';
import './Cart.css';
import { useCart } from '../contexts/CartContext'; // ✅ Import cart context

const Cart = () => {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const location = useLocation();
  const navigate = useNavigate();
  const addedCount = location.state?.addedCount || 0;
  const [showToast, setShowToast] = useState(addedCount > 0);

  const { setCartCount } = useCart(); // ✅ use setCartCount from context

  const getCookie = (name) => {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
    return null;
  };

  const userId = getCookie('token');

  useEffect(() => {
    if (userId) {
      fetchCartItems();
    } else {
      setLoading(false);
    }
  }, [userId]);

  const fetchCartItems = async () => {
    try {
      const res = await axios.get(`http://localhost:5000/api/cart/${userId}`);
      setCartItems(res.data);

      // ✅ Update cart count context
      const count = res.data.reduce((total, item) => total + (item.quantity || 1), 0);
      setCartCount(count);

    } catch (error) {
      console.error('Error fetching cart items:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRemove = async (item) => {
    try {
      await axios.delete(`http://localhost:5000/api/cart/${userId}/${item.menuId._id}`);
      const updatedCart = cartItems.filter((i) => i._id !== item._id);
      setCartItems(updatedCart);

      // ✅ Update cart count
      const count = updatedCart.reduce((total, item) => total + (item.quantity || 1), 0);
      setCartCount(count);

    } catch (error) {
      console.error('Error removing item:', error.response?.data || error.message);
    }
  };

  const handleQuantityChange = async (itemId, delta) => {
    const item = cartItems.find((item) => item._id === itemId);
    if (!item) return;

    const newQty = (item.quantity || 1) + delta;
    if (newQty < 1) return;

    try {
      await axios.put(`http://localhost:5000/api/cart/update/${itemId}`, { quantity: newQty });
      const updatedCart = cartItems.map((item) =>
        item._id === itemId ? { ...item, quantity: newQty } : item
      );
      setCartItems(updatedCart);

      // ✅ Update cart count
      const count = updatedCart.reduce((total, item) => total + (item.quantity || 1), 0);
      setCartCount(count);

    } catch (error) {
      console.error('Quantity update failed:', error);
    }
  };

  const totalPrice = cartItems.reduce((acc, item) => {
    const price = item.menuId?.price || 0;
    return acc + price * (item.quantity || 1);
  }, 0);

  useEffect(() => {
    if (showToast) {
      const timer = setTimeout(() => setShowToast(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [showToast]);

  const handleCheckout = () => {
    navigate('/checkout');
  };

  if (loading) return <div className="cart-message">Loading cart...</div>;
  if (!userId) return <div className="cart-message error">Please log in to view your cart.</div>;

  return (
    <div className="cart-container">
      <h2 className="cart-title">Cart</h2>

      {showToast && (
        <div className="cart-toast">
          <strong>{addedCount}</strong> item{addedCount > 1 ? 's' : ''} added to your cart!
        </div>
      )}

      {cartItems.length === 0 ? (
        <p className="cart-message">Your cart is empty.</p>
      ) : (
        <>
          <div className="cart-table">
            <div className="cart-header">
              <span>Item</span>
              <span>Price</span>
              <span>Qty</span>
              <span>Total</span>
              <span>Remove</span>
            </div>

            {cartItems.map((item) => (
              <div key={item._id} className="cart-row">
                <span>{item.menuId?.name || 'Unnamed Item'}</span>
                <span>₹{item.menuId?.price || 0}</span>

                <span className="qty-control">
                  <button onClick={() => handleQuantityChange(item._id, -1)}>-</button>
                  <span className="qty-count">{item.quantity || 1}</span>
                  <button onClick={() => handleQuantityChange(item._id, 1)}>+</button>
                </span>

                <span>₹{(item.menuId?.price || 0) * (item.quantity || 1)}</span>
                <span>
                  <button className="cart-remove-btn" onClick={() => handleRemove(item)}>
                    <FaTrashAlt />
                  </button>
                </span>
              </div>
            ))}

            <div className="cart-footer">
              <span className="label">Grand Total:</span>
              <span className="value">₹{totalPrice}</span>
            </div>
          </div>

          <div className="checkout-section">
            <button className="checkout-btn" onClick={handleCheckout}>
              Proceed to Checkout
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default Cart;
