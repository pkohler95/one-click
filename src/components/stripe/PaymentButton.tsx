'use client';

import React, { useState } from 'react';

interface PaymentButtonProps {
  email: string;
  paymentMethodId: string;
  amount: number;
}

const PaymentButton: React.FC<PaymentButtonProps> = ({
  email,
  paymentMethodId,
  amount,
}) => {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const handlePayment = async () => {
    setLoading(true);
    setMessage(null);

    try {
      const response = await fetch('/api/stripe/create-payment-intent', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          amount,
          paymentMethodId,
        }),
      });

      const data = await response.json();

      if (data.error) {
        setMessage(`Error: ${data.error}`);
      } else {
        setMessage('Payment successful!');
      }
    } catch (error) {
      setMessage(`Error: ${(error as Error).message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center">
      <button
        className="bg-blue-500 text-white px-4 py-2 rounded mt-4"
        onClick={handlePayment}
        disabled={loading}
      >
        {loading ? 'Processing...' : `Make Payment of $${amount}`}
      </button>
      {message && <p className="mt-4">{message}</p>}
    </div>
  );
};

export default PaymentButton;
