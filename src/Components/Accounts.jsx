import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate, useLocation } from 'react-router-dom';

export default function Accounts() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  const getTokenFromCookie = () => {
    const match = document.cookie.match(/token=([^;]+)/);
    return match ? match[1] : null;
  };

  useEffect(() => {
    const userId = getTokenFromCookie();

    if (!userId) {
      alert('Please login first.');
      navigate('/LoginForm');
      return;
    }

    axios
      .get(`http://localhost:5000/food-ordering-app/api/user/profile/${userId}`)
      .then((res) => {
        setUser(res.data);
        setLoading(false);
      })
      .catch((err) => {
        setError('Failed to fetch user profile');
        setLoading(false);
        console.error(err);
      });
  }, [navigate]);

  if (loading) return <p>Loading profile...</p>;
  if (error) return <p className="error">{error}</p>;
  if (!user) return <p>No user data found.</p>;

  return (
    <div className="account-container">
      <h2>My Account</h2>

      {/* Optional success message from navigation state */}
      {location.state?.message && (
        <p style={{ color: 'green', textAlign: 'center', marginBottom: '15px' }}>
          {location.state.message}
        </p>
      )}

      <div className="account-card">
        {user?.profilePic && (
          <img src={user.profilePic} alt="Profile" className="profile-preview" />
        )}

        <p><strong>Full Name:</strong> {user?.fullname}</p>
        <p><strong>Email:</strong> {user?.email}</p>
        <p><strong>Phone:</strong> {user?.phone || 'Not provided'}</p>

        {user?.deliveryAddress ? (
          <div>
            <p><strong>Address:</strong></p>
            <p>{user.deliveryAddress.line1}</p>
            {user.deliveryAddress.line2 && <p>{user.deliveryAddress.line2}</p>}
            <p>{user.deliveryAddress.city} - {user.deliveryAddress.pincode}</p>
          </div>
        ) : (
          <p><strong>Address:</strong> Not provided</p>
        )}

        <div style={{ marginTop: '20px' }}>
          <button onClick={() => navigate('/EditProfile')}>Edit Profile</button>
        </div>
      </div>
    </div>
  );
}
