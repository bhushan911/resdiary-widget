import React, { useState, useEffect } from "react";
import { CardElement, useStripe, useElements } from "@stripe/react-stripe-js";

const PaymentForm = ({ onSubmit }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsLoading(true);

    if (!stripe || !elements) {
      // Stripe.js has not loaded yet. Make sure to include it in your HTML file.
      return;
    }

    const cardElement = elements.getElement(CardElement);

    const { token, error } = await stripe.createToken(cardElement);

    setIsLoading(false);

    if (error) {
      setError(error.message);
    } else {
      // Pass the token to the parent component for further processing
      onSubmit(token);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="form-row">
        <label htmlFor="card-element">Credit or Debit Card</label>
        <div id="card-element">
          <CardElement
            options={{
              style: {
                base: {
                  fontSize: "16px",
                  fontFamily: '"Helvetica Neue", Helvetica, sans-serif',
                },
              },
            }}
          />
        </div>
        <div id="card-errors" role="alert">
          {error && <span>{error}</span>}
        </div>
      </div>
      <button type="submit" disabled={!stripe || isLoading}>
        {isLoading ? "Processing..." : "Submit Payment"}
      </button>
    </form>
  );
};

export default PaymentForm;
