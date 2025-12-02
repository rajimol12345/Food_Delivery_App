import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FaHome, FaShoppingCart, FaUser, FaSignOutAlt } from 'react-icons/fa';
import { useCart } from '../contexts/CartContext'; // Named import
import logo from '../Components/img/logo.png';

const Header = () => {
  const { cartCount } = useCart();
  const [animateCart, setAnimateCart] = useState(false);

  const navItems = [
    { Icon: FaHome, to: '/Home', label: 'Home' },
    { Icon: FaShoppingCart, to: '/Cart', label: 'Cart' },
    {
      Icon: FaUser,
      label: 'Account',
      dropdown: [
        { to: '/Accounts', label: 'Profile' },
        { to: '/Order', label: 'My Orders' },
        { to: '/SavedItems', label: 'Saved Items' },
      ],
    },
    { Icon: FaSignOutAlt, to: '/Logout', label: 'Logout' },
  ];

  //  Animate cart badge each time cartCount changes
  useEffect(() => {
    if (cartCount > 0) {
      setAnimateCart(true);
      const timer = setTimeout(() => setAnimateCart(false), 600);
      return () => clearTimeout(timer);
    }
  }, [cartCount]);

  return (
    <nav className="navbar navbar-expand-lg navbar-light shadow-sm header-animate">
      <div className="container-fluid">
        <Link className="navbar-brand d-flex align-items-center" to="/Home">
          <img
            src={logo}
            alt="EatYoWay Logo"
            className="nav-logo"
            height={60}
            width={150}
          />
        </Link>

        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNavDropdown"
          aria-controls="navbarNavDropdown"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarNavDropdown">
          <ul className="navbar-nav ms-auto">
            {navItems.map(({ Icon, to, label, dropdown }) =>
              dropdown ? (
                <li className="nav-item dropdown nav-animate" key={label}>
                  <a
                    className="nav-link dropdown-toggle"
                    href="#"
                    id={`${label}-dropdown`}
                    role="button"
                    data-bs-toggle="dropdown"
                    aria-expanded="false"
                  >
                    <Icon className="me-1 nav-icon" /> {label}
                  </a>
                  <ul
                    className="dropdown-menu dropdown-animate"
                    aria-labelledby={`${label}-dropdown`}
                  >
                    {dropdown.map(({ to: dt, label: dl }) => (
                      <li key={dt}>
                        <Link className="dropdown-item" to={dt}>
                          {dl}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </li>
              ) : (
                <li className="nav-item nav-animate" key={to}>
                  <Link className="nav-link position-relative" to={to}>
                    <Icon className="me-1 nav-icon" /> {label}
                    {label === 'Cart' && cartCount > 0 && (
                      <span
                        className={`position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger cart-badge ${
                          animateCart ? 'bounce' : ''
                        }`}
                        style={{ fontSize: '0.6rem' }}
                      >
                        {cartCount}
                        <span className="visually-hidden">items in cart</span>
                      </span>
                    )}
                  </Link>
                </li>
              )
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Header;
