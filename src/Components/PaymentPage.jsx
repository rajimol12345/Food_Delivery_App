// PaymentPage.jsx
import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";
import UpiPayment from "./upiPayment";
import "react-toastify/dist/ReactToastify.css";
import "./PaymentPage.css";

const PaymentPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const orderData = location.state;

  const [paymentMode, setPaymentMode] = useState("");

  useEffect(() => {
    if (!orderData) {
      toast.error("No order data found. Redirecting to checkout...");
      navigate("/checkout");
    }
  }, [orderData, navigate]);

  const totalAmount = orderData
    ? orderData.cartItems.reduce(
        (total, item) => total + item.price * item.quantity,
        0
      )
    : 0;

  // ✅ Handle COD
  const handleCOD = () => {
    toast.success("Order placed with Cash on Delivery.", {
      autoClose: 2000,
      onClose: () => {
        navigate("/place-order", {
          state: { ...orderData, paymentMode: "Cash on Delivery" },
        });
      },
    });
  };

  return (
    <div className="payment-container">
      <ToastContainer position="top-center" />
      <h2 className="payment-title">Payment Page</h2>

      {/* Order Summary */}
      <div className="payment-section">
        <h4>Order Summary</h4>
        {orderData?.cartItems.map((item, i) => (
          <div key={item._id || i} className="payment-item">
            <img
              src={item.image || "https://via.placeholder.com/60?text=No+Img"}
              alt={item.name}
              className="payment-item-img"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = "https://via.placeholder.com/60?text=No+Img";
              }}
            />
            <div className="payment-item-details">
              <span className="payment-item-name">{item.name}</span>
              <span className="payment-item-qty">Qty: {item.quantity}</span>
            </div>
            <span className="payment-item-price">
              ₹{item.price * item.quantity}
            </span>
          </div>
        ))}
        <div className="payment-total">
          <strong>Total:</strong> ₹{totalAmount}
        </div>
      </div>

      {/* Payment Mode Selection */}
      <div className="payment-section">
        <h4>Select Payment Method</h4>
        <label>
          <input
            type="radio"
            value="COD"
            checked={paymentMode === "COD"}
            onChange={() => setPaymentMode("COD")}
          />
          Cash on Delivery
        </label>

        <label>
          <input
            type="radio"
            value="PayPal"
            checked={paymentMode === "PayPal"}
            onChange={() => setPaymentMode("PayPal")}
          />
          Pay via PayPal
        </label>

        <label>
          <input
            type="radio"
            value="UPI"
            checked={paymentMode === "UPI"}
            onChange={() => setPaymentMode("UPI")}
          />
          Pay via UPI (Google Pay / QR)
        </label>
      </div>

      {/* COD Button */}
      {paymentMode === "COD" && (
        <button className="payment-button" onClick={handleCOD}>
          Confirm COD Order
        </button>
      )}

      {/* PayPal Button */}
      {paymentMode === "PayPal" && (
        <PayPalScriptProvider
          options={{ "client-id": process.env.REACT_APP_PAYPAL_CLIENT_ID }}
        >
          <div className="paypal-btn">
            <PayPalButtons
              style={{ layout: "vertical" }}
              createOrder={async () => {
                try {
                  const res = await fetch(
                    "http://localhost:5000/api/payment/create-order",
                    {
                      method: "POST",
                      headers: { "Content-Type": "application/json" },
                      body: JSON.stringify({ amount: totalAmount }),
                    }
                  );
                  const data = await res.json();
                  return data.id;
                } catch (err) {
                  toast.error("Error creating PayPal order");
                  console.error(err);
                }
              }}
              onApprove={async (data) => {
                try {
                  const res = await fetch(
                    `http://localhost:5000/api/payment/capture-order/${data.orderID}`,
                    { method: "POST" }
                  );
                  const details = await res.json();

                  toast.success("Payment Successful with PayPal!", {
                    autoClose: 2000,
                    onClose: () => {
                      navigate("/place-order", {
                        state: {
                          ...orderData,
                          paymentMode: "PayPal",
                          paymentId: details.id,
                          payer: details.payer,
                        },
                      });
                    },
                  });
                } catch (err) {
                  toast.error("Error capturing PayPal order");
                  console.error(err);
                }
              }}
              onError={(err) => {
                toast.error("Payment failed. Try again!");
                console.error(err);
              }}
            />
          </div>
        </PayPalScriptProvider>
      )}

      {/* UPI Payment */}
      {paymentMode === "UPI" && <UpiPayment amount={totalAmount} />}
    </div>
  );
};

export default PaymentPage;
