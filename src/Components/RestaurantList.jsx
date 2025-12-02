import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import './RestaurantList.css';

function RestaurantList() {
  const [restaurants, setRestaurants] = useState([]);
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);

  useEffect(() => {
    axios.get('http://localhost:5000/api/restaurants/list')
      .then(response => setRestaurants(response.data))
      .catch(() => console.error('Failed to fetch restaurants.'));
  }, []);

  return (
    <section className="section">
      <h3 className="section-title">Popular Restaurants</h3>
      <div className="grid">
        {(isSearching ? searchResults : restaurants).map(restaurant => (
          <Link to={`/restaurant/${restaurant._id}`} key={restaurant.id} className="card link-card">
            <img
              src={restaurant.image}
              alt={`Banner of ${restaurant.name}`}
              className="card-img"
            />
            <div className="card-body">
              <h5>{restaurant.name}</h5>
              <p><strong>Address:</strong> {restaurant.address}</p>
              <p><strong>Cuisine:</strong> {restaurant.cuisine}</p>
              <p><strong>Phone:</strong> {restaurant.phone}</p>
              <p><strong>Rating:</strong> <span style={{ color: 'gold' }}>★</span> {restaurant.rating}</p>
              <p><strong>Hours:</strong> {restaurant.openingHours}</p>
            </div>
          </Link>
        ))}
      </div>
      {isSearching && searchResults.length === 0 && (
        <p className="center-text">No restaurants match your search.</p>
      )}
    </section>
  );
}

export default RestaurantList;