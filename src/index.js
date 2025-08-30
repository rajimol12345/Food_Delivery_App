import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { BrowserRouter } from "react-router-dom";
import { PayPalScriptProvider } from "@paypal/react-paypal-js";
import { CartProvider } from './contexts/CartContext';  // Named import!

const root = ReactDOM.createRoot(document.getElementById("root"));

const paypalClientId = process.env.REACT_APP_PAYPAL_CLIENT_ID;

if (!paypalClientId) {
  console.error("❌ PayPal Client ID is missing. Add REACT_APP_PAYPAL_CLIENT_ID to your .env file.");
} else {
  console.log("✅ PayPal Client ID loaded:", paypalClientId);
}

root.render(
  <React.StrictMode>
    <BrowserRouter>
      <CartProvider>
        <PayPalScriptProvider options={{ "client-id": paypalClientId || "test" }}>
          <App />
        </PayPalScriptProvider>
      </CartProvider>
    </BrowserRouter>
  </React.StrictMode>
);
