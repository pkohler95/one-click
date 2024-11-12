// components/BankDetailsButton.tsx
import React, { useState } from 'react';
import Button from '@/components/shared/Button';
import { loadStripe } from '@stripe/stripe-js';

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY as string
);

const AddBankDetails = ({
  session,
  firstName,
  lastName,
}: {
  session: any;
  firstName: string;
  lastName: string;
}) => {
  const [isLoading, setIsLoading] = useState(false);

  // Function to handle SetupIntent creation
  const handleSetupIntent = async () => {
    console.log('Starting SetupIntent creation...');
    try {
      const response = await fetch('/api/stripe/create-setup-intent', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId: session.user.id }),
      });
      console.log('SetupIntent response:', response);

      const { clientSecret } = await response.json();
      console.log('Received clientSecret:', clientSecret);
      return clientSecret;
    } catch (error) {
      console.error('Error creating SetupIntent:', error);
    }
  };

  // Function to handle bank account collection
  const handleCollectBankAccount = async (clientSecret: string) => {
    console.log('Starting bank account collection...');
    const stripe = await stripePromise;

    if (!stripe) {
      console.error('Stripe instance not loaded');
      return;
    }

    if (!clientSecret) {
      console.error('Client secret is missing');
      return;
    }

    setIsLoading(true);

    const { setupIntent, error } = await stripe.collectBankAccountForSetup({
      clientSecret: clientSecret,
      params: {
        payment_method_data: {
          billing_details: {
            name: `${firstName ?? ''} ${lastName ?? ''}`.trim(),
          },
        },
        payment_method_type: 'us_bank_account',
      },
    });
    console.log('Bank account collection result:', { setupIntent, error });

    if (error) {
      console.error('Error collecting bank account:', error);
    } else if (setupIntent) {
      const paymentMethodId = setupIntent.payment_method;
      console.log('SetupIntent completed. PaymentMethod ID:', paymentMethodId);

      // Store the paymentMethodId in your database
      try {
        const storeResponse = await fetch('/api/stripe/store-payment-method', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ userId: session.user.id, paymentMethodId }),
        });
        console.log('Stored payment method response:', storeResponse);
      } catch (storeError) {
        console.error('Error storing payment method:', storeError);
      }
    }

    setIsLoading(false);
  };

  // Function to handle the button click
  const handleButtonClick = async () => {
    console.log('Button clicked, starting SetupIntent and bank collection...');
    setIsLoading(true);

    // Step 1: Create SetupIntent
    const clientSecret = await handleSetupIntent();

    if (clientSecret) {
      // Step 2: Collect bank account details using the SetupIntent
      await handleCollectBankAccount(clientSecret);
    } else {
      console.error('Failed to obtain clientSecret for SetupIntent');
    }

    setIsLoading(false);
  };

  return (
    <div className="rounded-lg flex flex-col items-start">
      <h1 className="text-3xl font-bold mb-6 mt-20">Bank details</h1>
      <Button
        text="Connect bank account"
        variant="secondary"
        onClick={handleButtonClick} // Call handleButtonClick when the button is clicked
        disabled={isLoading} // Disable button when loading
      />
    </div>
  );
};

export default AddBankDetails;
