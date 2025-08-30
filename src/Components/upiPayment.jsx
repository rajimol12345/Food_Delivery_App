// upipayment.js
import React, { useEffect } from "react";
import { QRCodeSVG } from "qrcode.react";
import'./UpiPayment.css';
function UpiPayment() {
  const upiLink =
    "upi://pay?pa=rajimolcid@bank&pn=MyShop&am=10&cu=INR&tn=Order123";

  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://pay.google.com/gp/p/js/pay.js";
    script.async = true;
    script.onload = () => {
      if (!window.google) return;

      const paymentsClient = new window.google.payments.api.PaymentsClient({
        environment: "TEST", // Change to "PRODUCTION" later
      });

      const baseRequest = { apiVersion: 2, apiVersionMinor: 0 };

      const allowedPaymentMethods = [
        {
          type: "CARD",
          parameters: {
            allowedAuthMethods: ["PAN_ONLY", "CRYPTOGRAM_3DS"],
            allowedCardNetworks: ["VISA", "MASTERCARD"],
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
              });
              container.appendChild(button);
            }
          }
        })
        .catch((err) => console.error("Error checking readiness", err));

      function onGooglePayButtonClicked() {
        const paymentDataRequest = {
          ...baseRequest,
          allowedPaymentMethods,
          transactionInfo: {
            totalPriceStatus: "FINAL",
            totalPrice: "1.00",
            currencyCode: "INR",
            countryCode: "IN",
          },
          merchantInfo: {
            merchantId: "12345678901234567890",
            merchantName: "Demo Merchant",
          },
        };

        paymentsClient
          .loadPaymentData(paymentDataRequest)
          .then((paymentData) => {
            console.log("✅ Payment Success", paymentData);
          })
          .catch((err) => console.error("❌ Payment failed", err));
      }
    };

    document.body.appendChild(script);
  }, []);

  return (
    <div>
      <div id="gpay-container"></div>
      <div>
        <h2>Scan & Pay with UPI</h2>
        <QRCodeSVG value={upiLink} size={200} />
      </div>
    </div>
  );
}

export default UpiPayment;
