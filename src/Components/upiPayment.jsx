// src/Components/UpiPayment.jsx
import React, { useEffect, useState } from "react";
import { QRCodeSVG } from "qrcode.react";
import "./UpiPayment.css";

function UpiPayment({ amount }) {
  const [isGPayReady, setIsGPayReady] = useState(false);
  const [gpayError, setGPayError] = useState(false);
  const paymentAmount = Number(amount);

  // Generate UPI QR link (for real payments)
  const upiLink = `upi://pay?pa=yourupiid@bank&pn=DemoShop&am=${paymentAmount}&cu=INR&tn=Order123`;

  // Load Google Pay script
  useEffect(() => {
    if (isNaN(paymentAmount) || paymentAmount <= 0) return;

    if (document.getElementById("gpay-script")) {
      setIsGPayReady(true);
      return;
    }

    const script = document.createElement("script");
    script.id = "gpay-script";
    script.src = "https://pay.google.com/gp/p/js/pay.js";
    script.async = true;

    script.onload = () => setIsGPayReady(true);
    script.onerror = () => {
      console.error("Failed to load Google Pay script");
      setGPayError(true);
    };

    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, [paymentAmount]);

  // Initialize Google Pay button
  useEffect(() => {
    if (!isGPayReady || gpayError) return;
    if (isNaN(paymentAmount) || paymentAmount <= 0) return;
    if (!window.google) return;

    const paymentsClient = new window.google.payments.api.PaymentsClient({
      environment: "TEST", // Sandbox mode
    });

    const baseRequest = { apiVersion: 2, apiVersionMinor: 0 };

    const allowedPaymentMethods = [
      {
        type: "CARD",
        parameters: {
          allowedAuthMethods: ["PAN_ONLY", "CRYPTOGRAM_3DS"],
          allowedCardNetworks: ["VISA", "MASTERCARD", "MAESTRO"],
        },
        tokenizationSpecification: {
          type: "PAYMENT_GATEWAY",
          parameters: {
            gateway: "example",
            gatewayMerchantId: "exampleMerchantId",
          },
        },
      },
    ];

    const isReadyToPayRequest = { ...baseRequest, allowedPaymentMethods };

    paymentsClient
      .isReadyToPay(isReadyToPayRequest)
      .then((response) => {
        if (response.result) {
          const container = document.getElementById("gpay-container");
          if (container && container.childNodes.length === 0) {
            const button = paymentsClient.createButton({
              onClick: onGooglePayButtonClicked,
              buttonColor: "black",
              buttonType: "pay",
            });
            container.appendChild(button);
          }
        } else {
          setGPayError(true);
        }
      })
      .catch((err) => {
        console.error("Error checking Google Pay readiness:", err);
        setGPayError(true);
      });

    function onGooglePayButtonClicked() {
      const paymentDataRequest = {
        ...baseRequest,
        allowedPaymentMethods,
        transactionInfo: {
          totalPriceStatus: "FINAL",
          totalPrice: paymentAmount.toFixed(2),
          currencyCode: "INR",
          countryCode: "IN",
        },
        merchantInfo: {
          merchantId: "12345678901234567890",
          merchantName: "Demo Shop",
        },
      };

      paymentsClient
        .loadPaymentData(paymentDataRequest)
        .then((paymentData) => {
          console.log("✅ Sandbox Payment Success:", paymentData);
          alert("Google Pay sandbox payment successful!");
        })
        .catch((err) => {
          if (err.name === "AbortError") {
            console.warn("Payment cancelled by user.");
          } else {
            console.error("❌ Google Pay Payment failed:", err);
            alert("Google Pay failed. You can use the UPI QR code instead.");
          }
        });
    }
  }, [isGPayReady, gpayError, paymentAmount]);

  return (
    <div className="upi-payment-container">
      <h2>Pay with Google Pay / UPI</h2>

      {isNaN(paymentAmount) || paymentAmount <= 0 ? (
        <p>Please provide a valid amount to proceed with payment.</p>
      ) : (
        <>
          {/* Google Pay button */}
          {!gpayError && <div id="gpay-container" style={{ marginBottom: "20px" }}></div>}

          {gpayError && (
            <p style={{ color: "red" }}>
              Google Pay is unavailable. Please use the UPI QR code below.
            </p>
          )}

          {/* OR separator */}
          <p style={{ textAlign: "center", margin: "10px 0" }}>OR</p>

          {/* UPI QR Code for real payment */}
          <div className="upi-qr">
            <h4>Scan this QR to pay via UPI:</h4>
            <QRCodeSVG value={upiLink} size={200} />
          </div>
        </>
      )}
    </div>
  );
}

export default UpiPayment;
