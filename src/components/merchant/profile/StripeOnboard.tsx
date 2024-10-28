import { useState } from 'react';

export default function StripeOnboard() {
  const [email, setEmail] = useState('');

  const handleOnboard = async () => {
    const response = await fetch('/api/stripe/onboard-merchant', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email }),
    });
    const data = await response.json();
    window.location.href = data.url; // Redirect merchant to Stripe onboarding
  };

  return (
    <div>
      <h1>Onboard Merchant</h1>
      <button onClick={handleOnboard}>Onboard with Stripe</button>
    </div>
  );
}
