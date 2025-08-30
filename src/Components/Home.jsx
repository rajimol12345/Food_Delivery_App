import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Search from './Search';
import FoodCategory from './FoodCategory';
import RestaurantList from './RestaurantList';
import img1 from './img/18165.jpg';
import img2 from './img/Burgers.webp';
import img3 from './img/pizza.jpg';

const Home = () => {
  const [foods, setFoods] = useState([]);
  const [loading, setLoading] = useState(true);
  const [restaurants, setRestaurants] = useState([]);
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);

  useEffect(() => {
    axios.get('/Foodcollection.json')
      .then(response => {
        setFoods(response.data);
        setLoading(false);
      })
      .catch(() => setLoading(false));

    axios.get('/restaurant.json')
      .then(response => setRestaurants(response.data))
      .catch(() => {});

    axios.get('/food.json')
      .then(res => console.log('Food categories loaded (optional)', res.data))
      .catch(() => {});
  }, []);

  // This function will be called by Search component to update search results
  const handleSearch = (type, query) => {
    if (!query) {
      setIsSearching(false);
      return;
    }

    const filtered = restaurants.filter(restaurant => {
      const name = restaurant.name.toLowerCase();
      const cuisine = restaurant.cuisine.toLowerCase();
      const location = restaurant.address?.toLowerCase();
      const dishList = restaurant.specials?.join(' ').toLowerCase() || '';

      const searchTerm = query.toLowerCase();

      return (
        name.includes(searchTerm) ||
        cuisine.includes(searchTerm) ||
        location?.includes(searchTerm) ||
        dishList.includes(searchTerm)
      );
    });

    setSearchResults(filtered);
    setIsSearching(true);
  };

  return (
    <>
     {/* Pass the search handler to Search component */}
      <Search onSearch={handleSearch} />
        <FoodCategory />
      {/* Carousel Section */}
      <div id="foodCarousel" className="carousel slide mb-5" data-bs-ride="carousel">
        <div className="carousel-inner">
          <div className="carousel-item active">
            <img src={img3} className="d-block w-100" alt="Burger" style={{ height: '600px', objectFit: 'cover'}} />
            <div className="carousel-caption d-none d-md-block">
              <h5>Delicious Pizza</h5>
              <p className="fs-2 fst-italic">Hot, cheesy, and delivered fast to your door.</p>
            </div>
          </div>
          <div className="carousel-item">
            <img src={img2} className="d-block w-100" alt="Chocolate" style={{ height: '600px', objectFit: 'cover' }} />
            <div className="carousel-caption d-none d-md-block">
              <h5>Juicy Burgers</h5>
              <p className="fs-2 fst-italic">Loaded with flavor and grilled to perfection.</p>
            </div>
          </div>
          <div className="carousel-item">
            <img src={img1} className="d-block w-100" alt="Pizza" style={{ height: '600px', objectFit: 'cover' }} />
            <div className="carousel-caption d-none d-md-block">
              <h5>Sweet Desserts</h5>
              <p className="fs-2 fst-italic">Finish your meal with a delightful dessert.</p>
            </div>
          </div>
        </div>

        {/* Carousel Controls */}
        <button className="carousel-control-prev" type="button" data-bs-target="#foodCarousel" data-bs-slide="prev">
          <span className="carousel-control-prev-icon" aria-hidden="true"></span>
          <span className="visually-hidden">Previous</span>
        </button>
        <button className="carousel-control-next" type="button" data-bs-target="#foodCarousel" data-bs-slide="next">
          <span className="carousel-control-next-icon" aria-hidden="true"></span>
          <span className="visually-hidden">Next</span>
        </button>
      </div>

      {/* Food Collection Section */}
      <section className="section">
        <h3 className="section-title">Our Food Collection</h3>
        {loading ? (
          <p className="center-text">Loading food collection...</p>
        ) : (
          <div className="grid">
            {foods.map(food => (
              <div key={food.id} className="card">
                <img src={food.image} alt={food.name} className="card-img" />
                <div className="card-body">
                  <h5>{food.name}</h5>
                  <p className="text-muted">{food.category}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Restaurant List Section */}
      <RestaurantList
        restaurants={restaurants}
        searchResults={searchResults}
        isSearching={isSearching}
      />
    </>
  );
};

export default Home;
