import React from 'react';
const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        {/* Logo / Branding */}
        <div className="footer-section">
          <h3 className="footer-logo">EatYoWay</h3>
          <p>Delicious food delivered fast at your doorstep.</p>
        </div>

        {/* Navigation Links */}
        <div className="footer-section">
          <h3>Quick Links</h3>
          <ul>
            <li><a href="/">Home</a></li>
            <li><a href="/menu">Menu</a></li>
            <li><a href="/about">About Us</a></li>
            <li><a href="/contact">Contact</a></li>
          </ul>
        </div>

        {/* Contact Info */}
        <div className="footer-section">
          <h3>Contact</h3>
          <p>Email: support@eatyoway.com</p>
          <p>Phone: +1 234 567 8901</p>
          <p>Location: New York, USA</p>
        </div>

        {/* Social Media */}
        <div className="footer-section">
          <h3>Follow Us</h3>
          <div className="social-icons">
            <a href="#"><i className="fab fa-facebook-f"></i></a>
            <a href="#"><i className="fab fa-instagram"></i></a>
            <a href="#"><i className="fab fa-twitter"></i></a>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <p>&copy; {new Date().getFullYear()} EatYoWay. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
