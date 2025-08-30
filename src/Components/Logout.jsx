import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Logout() {
  const navigate = useNavigate();

  useEffect(() => {
    // Check if token exists
    const tokenMatch = document.cookie.match(/token=([^;]+)/);

    if (tokenMatch) {
      // Delete the token cookie by setting it to expire in the past
      document.cookie = 'token=; path=/; age=0;';
      alert('You have been logged out.');
    } else {
      alert('You are not logged in.');
    }

    // Redirect to login
    navigate('/LoginForm');
  }, [navigate]);

  return null;
}
