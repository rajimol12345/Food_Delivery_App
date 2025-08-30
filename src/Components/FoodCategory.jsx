// src/components/FoodCategory.jsx
import React, { useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import './FoodCategory.css';

const categories = [
  { name: 'Biryani', image: './images/Egg Biryani.jpg' },
  { name: 'Pizzas', image: './images/pizza.jpg' },
  { name: 'Burgers', image: './images/buger hub.jpg' },
  { name: 'Noodles', image: './images/noodles.jpg' },
  { name: 'Paratha', image: './images/Paratha.jpg' },
  { name: 'Shake', image: './images/shake.jpeg' },
  { name: 'Samosa', image: './images/samosa.jpg' },
  { name: 'Sandwich', image: './images/Sandwich.jpg' },
  { name: 'Ice Cream', image: './images/Ice Cream.jpg' },
  { name: 'Pasta', image: './images/pasta.png' },
  { name: 'Soup', image: './images/Soup.jpg' },
  { name: 'Salad', image: './images/Salad.jpeg' },
  { name: 'Fries', image: './images/Fries.webp' },
  { name: 'Dosa', image: './images/masala dosa.avif' },
  { name: 'Idli', image: './images/Idli Sambar.jpg' },
  { name: 'Chaat', image: './images/4300.avif' },
  { name: 'Rolls', image: './images/Rolls.webp' },
  { name: 'Tandoori', image: './images/Tandoori.png' },
  { name: 'Thali', image: './images/Thali.webp' },
  { name: 'Chinese', image: './images/Chinese.webp' }
];

const FoodCategory = () => {
  const scrollRef = useRef(null);
  const navigate = useNavigate();

  // Scroll the category list horizontally
  const scroll = (direction) => {
    const scrollAmount = 300;
    if (scrollRef.current) {
      scrollRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  // Navigate to the menu page filtered by category
  const handleCategoryClick = (name) => {
    navigate(`/menu/category/${encodeURIComponent(name)}`);
  };

  return (
    <div className="food-category-container">
      <div className="food-category-header">
        <h2>What's on your mind?</h2>
        <div className="scroll-buttons">
          <button onClick={() => scroll('left')} aria-label="Scroll Left">
            &larr;
          </button>
          <button onClick={() => scroll('right')} aria-label="Scroll Right">
            &rarr;
          </button>
        </div>
      </div>

      <div className="food-category-scroll" ref={scrollRef}>
        {categories.map(({ name, image }) => (
          <div
            className="food-category-card"
            key={name}
            onClick={() => handleCategoryClick(name)}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                handleCategoryClick(name);
              }
            }}
          >
            <img src={image} alt={name} />
            <p>{name}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FoodCategory;
