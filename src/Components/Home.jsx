import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Search from './Search';
import FoodCategory from './FoodCategory';
import RestaurantList from './RestaurantList';

import img1 from './img/hero1.jpg';
import img2 from './img/hero2.avif';
import img3 from './img/hero3.jpg';

import burgerImg from './img/burger.png';
import offerSticker from './img/offer.png';   //  Add this image

import './Home.css';

const Home = () => {
  const [foods, setFoods] = useState([]);
  const [loading, setLoading] = useState(true);
  const [restaurants, setRestaurants] = useState([]);
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [showOffer, setShowOffer] = useState(false);

  const carouselImages = [img1, img2, img3];

  const heroTexts = [
    { title: "Order Fresh & Hot Food Anytime", subtitle: "Fast Delivery • Tasty Meals • Best Restaurants Near You" },
    { title: "Get Your Favourite Meals Delivered", subtitle: "Tasty • Affordable • Delivered in Minutes" },
    { title: "Discover Delicious Food Near You", subtitle: "Fresh Ingredients • Best Chefs • Great Taste" }
  ];

  useEffect(() => {
    axios.get('/Foodcollection.json')
      .then(res => { setFoods(res.data); setLoading(false); })
      .catch(() => setLoading(false));

    axios.get('/restaurant.json')
      .then(res => setRestaurants(res.data))
      .catch(() => {});

    // show popup
    setTimeout(() => setShowOffer(true), 2000);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide(prev => (prev + 1) % carouselImages.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleSearch = (type, query) => {
    if (!query) {
      setIsSearching(false);
      return;
    }

    const searchTerm = query.toLowerCase();
    const filtered = restaurants.filter(res =>
      res.name.toLowerCase().includes(searchTerm) ||
      res.cuisine.toLowerCase().includes(searchTerm) ||
      res.address?.toLowerCase().includes(searchTerm) ||
      (res.specials?.join(" ") || "").toLowerCase().includes(searchTerm)
    );

    setSearchResults(filtered);
    setIsSearching(true);
  };

  return (
    <>
      <Search onSearch={handleSearch} />
      <FoodCategory />

      {/* HERO SECTION */}
      <section className="hero">
        <div className="carousel">
          {carouselImages.map((img, index) => (
            <div
              key={index}
              className={`carousel-slide ${currentSlide === index ? "active" : ""}`}
              style={{ backgroundImage: `url(${img})` }}
            ></div>
          ))}
        </div>

        <div className="overlay"></div>

        <div className="hero-content">
          <h1 key={currentSlide} className="title fade-text">
            {heroTexts[currentSlide].title}
          </h1>
          <p key={currentSlide + "-sub"} className="subtitle fade-text">
            {heroTexts[currentSlide].subtitle}
          </p>
        </div>

        <img src={burgerImg} className="burger" alt="burger" />
      </section>

      {/* FOOD COLLECTION */}
      <section className="food-section">
        <h3 className="food-title">Explore Our Food Collection</h3>

        {loading ? (
          <p className="center-text">Loading...</p>
        ) : (
          <div className="food-grid">
            {foods.map(food => (
              <a href={`/food/${food.id}`} key={food.id} className="food-card fade-in">
                <div className="food-img-box">
                  <img src={food.image} alt={food.name} className="food-img" />
                </div>

                <div className="food-info">
                  <h4>{food.name}</h4>
                  <p>{food.category}</p>
                  <button className="view-btn">View Details</button>
                </div>
              </a>
            ))}
          </div>
        )}
      </section>

      {/*  OFFER POPUP — 3D + SHAPES + IMAGE */}
      {showOffer && (
        <div className="offer-popup-3d">
          <span className="popup-shape shape-1"></span>
          <span className="popup-shape shape-2"></span>

          <button className="close-offer" onClick={() => setShowOffer(false)}>×</button>

          <img src={offerSticker} className="offer-img" alt="special-offer" />

          <h4>Special Deal!</h4>
          <p>Enjoy <b>50% OFF</b> on your first food order.</p>

          <a href="/offers" className="offer-btn">Grab Now</a>
        </div>
      )}

      <RestaurantList
        restaurants={restaurants}
        searchResults={searchResults}
        isSearching={isSearching}
      />
    </>
  );
};

export default Home;
