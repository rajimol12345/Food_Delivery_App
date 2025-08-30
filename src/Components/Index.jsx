import React from 'react';
import { Link } from 'react-router-dom';

const Index = () => {
  return (
    <>
      {/* Navigation Header */}
      <div className="header">
        <div className="logo">EatToWay</div>
        <div className="headnav-buttons">
          <Link to="/RegisterForm" className="headnav-item">Signup</Link>
          <Link to="/LoginForm" className="headnav-item">Login</Link>
        </div>
      </div>

      {/* Hero Section */}
      <div className="hero">
        <h1 className="hero-title">EatToWay</h1>
        <h2 className="hero-subtitle">
          Discover Top Restaurants, Cafés & Bars Across India
        </h2>
      </div>
    </>
  );
};

export default Index;
