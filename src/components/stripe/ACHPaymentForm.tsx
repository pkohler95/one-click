import { useState } from 'react';

const ACHPaymentForm: React.FC = () => {
  const [amount, setAmount] = useState(0);
  const [paymentMethodId, setPaymentMethodId] = useState('');

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    const response = await fetch('/api/create-payment-intent', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ paymentMethodId, amount }),
    });

    const result = await response.json();
    console.log('Payment Intent:', result.paymentIntent);
  };

  return (
    <form onSubmit={handleSubmit}>
      <label>
        Payment Method ID:
        <input
          type="text"
          value={paymentMethodId}
          onChange={(e) => setPaymentMethodId(e.target.value)}
          required
        />
      </label>
      <label>
        Amount (in USD):
        <input
          type="number"
          value={amount}
          onChange={(e) => setAmount(parseFloat(e.target.value))}
          required
        />
      </label>
      <button type="submit">Pay with ACH</button>
    </form>
  );
};

export default ACHPaymentForm;
