import React, { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import confetti from "canvas-confetti";

const OrderSuccessPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { orderId, customerName } = location.state || {};

  useEffect(() => {
    // Fire confetti on mount
    confetti({
      particleCount: 180,
      spread: 90,
      origin: { y: 0.6 },
    });
  }, []);

  if (!orderId || !customerName) {
    // If user enters page directly, send to home
    navigate("/");
    return null;
  }

  return (
    <div style={styles.container}>
      <div style={styles.card} className="fade-in">
        {/*  Animated Checkmark */}
        <div style={styles.iconWrapper}>
          <div style={styles.checkCircle}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="50"
              height="50"
              viewBox="0 0 24 24"
              fill="none"
              stroke="white"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
              style={{ animation: "drawCheck 1s ease forwards" }}
            >
              <path d="M20 6L9 17l-5-5" />
            </svg>
          </div>
        </div>

        {/*  Success Message */}
        <h1 style={styles.title}>Order Placed Successfully! 🎉</h1>
        <p style={styles.message}>
          Thank you, <strong>{customerName}</strong>, for your order.
        </p>
        <p style={styles.message}>
          Your order ID is <strong>{orderId}</strong>.
        </p>
        <p style={styles.message}>
          We’re preparing your delicious food and will notify you once shipped 🚚
        </p>

        <button style={styles.button} onClick={() => navigate("/")}>
          Back to Home
        </button>
      </div>

      {/* Inline Animations */}
      <style>
        {`
          .fade-in {
            animation: fadeInUp 0.9s ease-out;
          }
          @keyframes fadeInUp {
            from {
              opacity: 0;
              transform: translateY(40px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }

          @keyframes drawCheck {
            from {
              stroke-dasharray: 48;
              stroke-dashoffset: 48;
            }
            to {
              stroke-dasharray: 48;
              stroke-dashoffset: 0;
            }
          }
        `}
      </style>
    </div>
  );
};

const styles = {
  container: {
    display: "flex",
    height: "100vh",
    justifyContent: "center",
    alignItems: "center",
    background: "linear-gradient(135deg, #f0fff4, #c8e6c9, #a5d6a7)",
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
    padding: "20px",
  },
  card: {
    padding: "40px",
    borderRadius: "20px",
    background: "#ffffff",
    boxShadow: "0 8px 20px rgba(0,0,0,0.15)",
    textAlign: "center",
    width: "450px",
  },
  iconWrapper: {
    display: "flex",
    justifyContent: "center",
    marginBottom: "20px",
  },
  checkCircle: {
    width: "90px",
    height: "90px",
    borderRadius: "50%",
    background: "#28a745",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    boxShadow: "0 6px 12px rgba(40,167,69,0.4)",
  },
  title: {
    color: "#28a745",
    marginBottom: "15px",
    fontSize: "28px",
    fontWeight: "bold",
  },
  message: {
    fontSize: "18px",
    margin: "10px 0",
    color: "#444",
  },
  button: {
    marginTop: "25px",
    padding: "12px 28px",
    fontSize: "16px",
    fontWeight: "600",
    borderRadius: "8px",
    border: "none",
    backgroundColor: "#28a745",
    color: "#fff",
    cursor: "pointer",
    transition: "all 0.3s ease",
  },
};

export default OrderSuccessPage;
