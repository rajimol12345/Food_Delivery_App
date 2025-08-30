import React from 'react';
import './App.css';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';

// Component imports
import Header from './Components/Header';
import RegisterForm from './Components/RegisterForm';
import LoginForm from './Components/LoginForm';
import Home from './Components/Home';
import Footer from './Components/Footer';
import Cart from './Components/Cart';
import MyOrders from './Components/MyOrders.jsx';
import Logout from './Components/Logout';
import Index from './Components/Index';
import RestaurantDetail from './Components/RestaurantDetail';
import Checkout from './Components/Checkout';
import PaymentPage from './Components/PaymentPage.jsx';
import RestaurantList from './Components/RestaurantList';
import SavedItems from './Components/SavedItems';
import Searchpage from './Components/Searchpage.jsx';
import Accounts from './Components/Accounts';
import EditProfile from './Components/EditProfile';
import FoodDetail from './Components/FoodDetail';
import PlaceOrder from './Components/PlaceOrder.jsx';
import SearchResults from './Components/SearchResults.jsx';
import MenuPage from './Components/MenuPage.jsx';

function App() {
  const location = useLocation();

  const hideHeaderOnRoutes = ['/', '/LoginForm', '/RegisterForm'];
  const hideFooterOnRoutes = ['/', '/LoginForm', '/RegisterForm'];

  const shouldHideHeader = hideHeaderOnRoutes.includes(location.pathname);
  const shouldHideFooter = hideFooterOnRoutes.includes(location.pathname);


  return (
    <div>
      {/* Header */}
      {!shouldHideHeader && <Header />}


      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Index />} />
        <Route path="/LoginForm" element={<LoginForm />} />
        <Route path="/RegisterForm" element={<RegisterForm />} />
        <Route path="/Home" element={<Home />} />
        <Route path="/restaurant/:restaurantid" element={<RestaurantDetail />} />
        <Route path="/Cart" element={<Cart />} />
        <Route path="/Order" element={<MyOrders />} />
        <Route path="/SavedItems" element={<SavedItems />} />
        <Route path="/Accounts" element={<Accounts />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/EditProfile" element={<EditProfile />} />
        <Route path="/payment" element={<PaymentPage />} />
        <Route path="/place-order" element={<PlaceOrder />} />
        <Route path="/Logout" element={<Logout />} />
        <Route path="/RestaurantList" element={<RestaurantList />} />
        <Route path="/food/:foodId" element={<FoodDetail />} />
        <Route path="/menu/category/:categoryName" element={<MenuPage />} />
        <Route path="/results" element={<SearchResults />} />
        <Route path="/searchpage" element={<Searchpage />} />
        {/* Catch-all: Redirect to homepage */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>

      {/* Toast Notifications */}
      <ToastContainer />

      {/* Footer */}
      {!shouldHideFooter && <Footer />}
    </div>
  );
}

export default App;
