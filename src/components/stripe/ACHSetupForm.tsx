import { useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY as string
);

const ACHSetupForm: React.FC = () => {
  const [email, setEmail] = useState('');
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSetupIntent = async () => {
    const response = await fetch('/api/stripe/create-setup-intent', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email }),
    });

    const { clientSecret } = await response.json();
    setClientSecret(clientSecret);
  };

  const handleCollectBankAccount = async () => {
    const stripe = await stripePromise;

    if (!stripe || !clientSecret) {
      return;
    }

    setIsLoading(true);

    const { setupIntent, error } = await stripe.collectBankAccountForSetup({
      clientSecret: clientSecret,
      params: {
        payment_method_data: {
          billing_details: {
            name: email, // Replace with actual account holder name
          },
        },
        payment_method_type: 'us_bank_account',
      },
    });

    if (error) {
      console.error('Error collecting bank account:', error);
    } else if (setupIntent) {
      const paymentMethodId = setupIntent.payment_method;

      // Store the paymentMethodId in your database
      await fetch('/api/stripe/store-payment-method', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, paymentMethodId }),
      });

      console.log('Bank account setup complete:', setupIntent);
    }

    setIsLoading(false);
  };

  return (
    <div>
      <label>
        Email:
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </label>
      <button onClick={handleSetupIntent} disabled={isLoading}>
        Start ACH Setup
      </button>

      {clientSecret && (
        <button onClick={handleCollectBankAccount} disabled={isLoading}>
          Collect Bank Account Details
        </button>
      )}
    </div>
  );
};

export default ACHSetupForm;
