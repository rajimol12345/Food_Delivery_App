import React, { useState, useEffect } from 'react';
import { FaStar } from 'react-icons/fa';
import axios from 'axios';

const Rating = ({ restaurantId }) => {
  const [rating, setRating] = useState(0); 
  const [hover, setHover] = useState(null);

  useEffect(() => {
    // Load existing rating if any
    axios.get(`/api/rate/${restaurantId}`)
      .then(res => setRating(res.data.rating))
      .catch(console.error);
  }, [restaurantId]);

  const submitRating = async (value) => {
    setRating(value);
    try {
      await axios.post('/api/rate', { restaurantId, rating: value });
      alert('Rating saved!');
    } catch {
      alert('Failed to save rating.');
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'row' }}>
      {[...Array(5)].map((_, index) => {
        const val = index + 1;
        return (
          <FaStar
            key={val}
            size={30}
            style={{ marginRight: 5, cursor: 'pointer' }}
            color={(hover || rating) >= val ? '#ffc107' : '#e4e5e9'}
            onMouseEnter={() => setHover(val)}
            onMouseLeave={() => setHover(null)}
            onClick={() => submitRating(val)}
          />
        );
      })}
    </div>
  );
};

export default Rating;
