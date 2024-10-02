'use client';

import React, { useState, useEffect } from 'react';
import UserProfile from '../components/UserProfile';
import { Navbar } from '@/components/Navbar';
import ACHSetupForm from './stripe/ACHSetupForm';
import PaymentButton from '../components/stripe/PaymentButton';
import PlaceOrderButton from './coinbase/PlaceOrderButton';

const ProfilePageClient = ({ session }: { session: any }) => {
  const [paymentMethodId, setPaymentMethodId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  console.log(session);
  useEffect(() => {
    const fetchPaymentMethodId = async () => {
      if (!session?.user?.email) return;

      try {
        const response = await fetch('/api/stripe/get-payment-method', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ email: session.user.email }),
        });

        const data = await response.json();

        if (data.error) {
          console.error(data.error);
        } else {
          setPaymentMethodId(data.paymentMethodId);
        }
      } catch (error) {
        console.error('Error fetching payment method ID:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPaymentMethodId();
  }, [session?.user?.email]);

  if (loading) {
    return <p>Loading...</p>;
  }

  if (session?.user) {
    return (
      <div className="min-h-screen bg-gray-100 flex flex-col">
        <Navbar />
        <div className="flex justify-center items-center flex-grow">
          <UserProfile
            name={session?.user?.name || ''}
            email={session?.user?.email || ''}
            userType={session?.user?.userType || ''}
          />
        </div>

        <div>
          <h1>Buy Bitcoin</h1>
          <PlaceOrderButton />
        </div>

        <ACHSetupForm />

        {paymentMethodId ? (
          <PaymentButton
            email={session?.user?.email || ''}
            paymentMethodId={paymentMethodId} // Now using the fetched payment method ID
            amount={100} // Amount in USD
          />
        ) : (
          <p>No payment method available. Please add one.</p>
        )}
      </div>
    );
  }

  return <h2>Please login to see profile page</h2>;
};

export default ProfilePageClient;
