import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FaHeart } from 'react-icons/fa';

const FoodDetail = () => {
  const { foodId } = useParams();
  const [item, setItem] = useState(null);
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const getCookie = (name) => {
    const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
    return match ? match[2] : null;
  };

  const userId = getCookie('token');

  useEffect(() => {
    const fetchFood = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/menu/item/${foodId}`);
        setItem(res.data);
        if (userId) {
          const savedRes = await axios.get(`http://localhost:5000/api/saved/${userId}`);
          const savedIds = savedRes.data.map((i) => i.productId);
          setSaved(savedIds.includes(foodId));
        }
      } catch (err) {
        console.error('Error loading food item:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchFood();
  }, [foodId, userId]);

  const handleAddToCart = async () => {
    if (!userId) return alert('Please log in to add to cart.');

    try {
      await axios.post('http://localhost:5000/api/cart/addcart', {
        userId,
        menuId: foodId,
        quantity: 1,
      });
      alert('Added to cart');
      navigate('/Cart');
    } catch (err) {
      console.error('Cart add failed:', err);
      alert('Failed to add to cart');
    }
  };

  const handleWishlist = async () => {
    if (!userId) return alert('Please log in to use wishlist.');

    try {
      if (saved) {
        await axios.delete(`http://localhost:5000/api/saved/${userId}/${foodId}`);
        setSaved(false);
      } else {
        await axios.post('http://localhost:5000/api/saved/add', {
          userId,
          productId: foodId,
        });
        setSaved(true);
      }
    } catch (err) {
      console.error('Wishlist error:', err);
      alert('Failed to update wishlist');
    }
  };

  if (loading) return <div className="text-center my-5">Loading...</div>;
  if (!item) return <div className="text-center text-danger">Item not found</div>;

  return (
    <div className="container py-5">
      <div className="row align-items-start">
        <div className="col-md-5">
          <img
            src={item.image}
            alt={item.name}
            className="img-fluid rounded shadow"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = '/fallback.jpg';
            }}
          />
        </div>

        <div className="col-md-7">
          <div className="d-flex justify-content-between align-items-start">
            <h2>{item.name}</h2>
            <FaHeart
              onClick={handleWishlist}
              style={{ cursor: 'pointer', fontSize: '1.5rem' }}
              className={saved ? 'text-danger' : 'text-secondary'}
              title={saved ? 'Remove from wishlist' : 'Add to wishlist'}
            />
          </div>

          <p className="text-muted mt-2">{item.description}</p>
          <h4 className="text-success">₹{item.price}</h4>

          <button className="btn btn-primary mt-3" onClick={handleAddToCart}>
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
};

export default FoodDetail;
