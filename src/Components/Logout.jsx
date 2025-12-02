import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Logout() {
  const navigate = useNavigate();
  const [toast, setToast] = useState({ show: false, message: '', type: '' });

  useEffect(() => {
    // Check if token exists
    const tokenMatch = document.cookie.match(/token=([^;]+)/);

    if (tokenMatch) {
      // Delete the token cookie by setting it to expire in the past
      document.cookie = 'token=; path=/; max-age=0;';
      
      // Show success toast
      setToast({ show: true, message: 'Logged out successfully!', type: 'success' });
      
      // Redirect after 2 seconds
      setTimeout(() => {
        navigate('/LoginForm');
      }, 2000);
    } else {
      // Show error toast
      setToast({ show: true, message: 'You are not logged in.', type: 'error' });
      
      // Redirect after 2 seconds
      setTimeout(() => {
        navigate('/LoginForm');
      }, 2000);
    }
  }, [navigate]);

  return (
    <>
      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }

        @keyframes bounce {
          0%, 100% {
            opacity: 0.3;
            transform: translateY(0);
          }
          50% {
            opacity: 1;
            transform: translateY(-10px);
          }
        }

        @keyframes slideIn {
          from {
            transform: translateX(100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: scale(0.9);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }

        .logout-container {
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          min-height: 100vh;
         background: linear-gradient(135deg, #ffffff 0%, #eaeaea 100%);
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
        }

        .logout-icon-container {
          width: 120px;
          height: 120px;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.2);
          backdrop-filter: blur(10px);
          display: flex;
          justify-content: center;
          align-items: center;
          margin-bottom: 2rem;
          animation: spin 2s linear infinite, fadeIn 0.5s ease-out;
        }

        .logout-icon {
          width: 60px;
          height: 60px;
          color: #e68d28ff;
        }

        .logout-title {
          color:#e68d28ff;
          font-size: 2rem;
          font-weight: 600;
          margin-bottom: 0.5rem;
          text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.2);
          animation: fadeIn 0.5s ease-out 0.2s backwards;
        }

        .logout-dots {
          display: flex;
          gap: 4px;
          font-size: 2rem;
          color: #ffffff;
        }

        .logout-dot {
          display: inline-block;
          animation: bounce 1.4s infinite;
          font-size: 2.5rem;
        }

        .logout-dot:nth-child(1) { animation-delay: 0s; }
        .logout-dot:nth-child(2) { animation-delay: 0.2s; }
        .logout-dot:nth-child(3) { animation-delay: 0.4s; }

        .toast {
          position: fixed;
          top: 2rem;
          right: 2rem;
          display: flex;
          align-items: center;
          gap: 0.75rem;
          padding: 1rem 1.5rem;
          border-radius: 12px;
          color: #ffffff;
          font-weight: 500;
          box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
          animation: slideIn 0.5s ease-out;
          z-index: 1000;
        }

        .toast-success {
          background-color: #10b981;
        }

        .toast-error {
          background-color: #ef4444;
        }

        .toast-icon {
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .toast-message {
          font-size: 1rem;
        }
      `}</style>

      <div className="logout-container">
        {/* Animated Logout Icon */}
        <div className="logout-icon-container">
          <svg 
            className="logout-icon" 
            viewBox="0 0 24 24" 
            fill="none" 
            xmlns="http://www.w3.org/2000/svg"
          >
            <path 
              d="M17 16L21 12M21 12L17 8M21 12H7M13 16V17C13 18.6569 11.6569 20 10 20H6C4.34315 20 3 18.6569 3 17V7C3 5.34315 4.34315 4 6 4H10C11.6569 4 13 5.34315 13 7V8" 
              stroke="currentColor" 
              strokeWidth="2" 
              strokeLinecap="round" 
              strokeLinejoin="round"
            />
          </svg>
        </div>

        {/* Loading Text */}
        <h2 className="logout-title">Logging Out</h2>
        <div className="logout-dots">
          <span className="logout-dot">.</span>
          <span className="logout-dot">.</span>
          <span className="logout-dot">.</span>
        </div>

        {/* Toast Notification */}
        {toast.show && (
          <div className={`toast ${toast.type === 'success' ? 'toast-success' : 'toast-error'}`}>
            <div className="toast-icon">
              {toast.type === 'success' ? (
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                  <path 
                    d="M16.25 5.625L7.5 14.375L3.75 10.625" 
                    stroke="white" 
                    strokeWidth="2" 
                    strokeLinecap="round" 
                    strokeLinejoin="round"
                  />
                </svg>
              ) : (
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                  <path 
                    d="M6.25 6.25L13.75 13.75M13.75 6.25L6.25 13.75" 
                    stroke="white" 
                    strokeWidth="2" 
                    strokeLinecap="round" 
                    strokeLinejoin="round"
                  />
                </svg>
              )}
            </div>
            <span className="toast-message">{toast.message}</span>
          </div>
        )}
      </div>
    </>
  );
}