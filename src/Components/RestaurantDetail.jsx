import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import MenuList from './MenuList';

const RestaurantDetail = () => {
  const { restaurantid } = useParams(); 
  const [restaurant, setRestaurant] = useState(null);
  const [error, setError] = useState('');
  const [wishlist, setWishlist] = useState([]);

 useEffect(() => {
  axios.get('http://localhost:5000/api/restaurants/list')
    .then(response => {
      console.log('All restaurant IDs:', response.data.map(r => r._id));
      const found = response.data.find(r => r._id?.toString() === restaurantid);
      if (found) {
        setRestaurant(found);
      } else {
        setError('Restaurant not found');
      }
    })
    .catch(() => setError('Failed to load restaurant data.'));
}, [restaurantid]);

  const handleAddToWishlist = (item) => {
    const itemId = item.id || item._id;
    const alreadySaved = wishlist.some(savedItem => (savedItem.id || savedItem._id) === itemId);

    if (!alreadySaved) {
      setWishlist(prev => [...prev, item]);
    }
  };

  if (error) {
    return (
      <div className="p-5">
        <p className="text-danger">{error}</p>
        <Link to="/Home" className="btn btn-outline-secondary mt-3">← Back to Home</Link>
      </div>
    );
  }

  if (!restaurant) {
    return (
      <div className="text-center p-5">
        <div className="spinner-border text-primary" role="status" />
      </div>
    );
  }

  return (
    <div className="restaurant-detail-page p-4">
      <Link to="/" className="btn btn-primary mb-4">← Back to Home</Link>

      <img
        src={restaurant.image || '/placeholder.jpg'}
        alt={restaurant.name}
        className="img-fluid rounded shadow mb-4"
        style={{ maxHeight: '500px', objectFit: 'cover', width: '100%' }}
      />

      <h2>{restaurant.name}</h2>
      <p><strong>Address:</strong> {restaurant.address}</p>
      <p><strong>Phone:</strong> {restaurant.phone}</p>
      <p><strong>Email:</strong> {restaurant.email}</p>
      <p><strong>Cuisine:</strong> {restaurant.cuisine}</p>
      <p><strong>Rating:</strong> {restaurant.rating}</p>
      <p><strong>Hours:</strong> {restaurant.openingHours}</p>

      {restaurant.history && (
        <>
          <h4 className="mt-4">About</h4>
          <p>{restaurant.history}</p>
        </>
      )}

      {restaurant.offers?.length > 0 && (
        <div className="card border-success mb-4">
          <div className="card-body">
            <h5 className="text-success">Current Offers</h5>
            <ul>
              {restaurant.offers.map((offer, i) => (
                <li key={i}>{offer}</li>
              ))}
            </ul>
          </div>
        </div>
      )}

      <MenuList
  restaurantId={restaurant._id}
  menu={restaurant.menu}
  handleAddToWishlist={handleAddToWishlist}
/>
    </div>
  );
};

export default RestaurantDetail;
