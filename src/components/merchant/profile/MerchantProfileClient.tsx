'use client';

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Navbar } from '@/components/shared/Navbar';
import Button from '@/components/shared/Button';
import MerchantForm from './MerchantForm';
import MerchantTransactionsTable from './MerchantTransactionsTable';

interface Merchant {
  storeName?: string;
  lnurl?: string;
  connectedAccountId?: string;
  oneClickDiscount?: number;
}

const MerchantProfileClient = ({ session }: { session: any }) => {
  const [merchant, setMerchant] = useState<Merchant | null>(null); // State for merchant data
  const [profileData, setProfileData] = useState<Merchant | null>(null); // State for local profile data
  const [error, setError] = useState<string | null>(null); // Error state
  const [accountLink, setAccountLink] = useState<string | null>(null); // State for Stripe account link

  useEffect(() => {
    // Function to fetch merchant data and get onboarding/dashboard link if needed
    const fetchMerchant = async () => {
      if (session?.user?.id) {
        try {
          // Fetch merchant data
          const response = await axios.get(
            `/api/merchant/profile/${session.user.id}`
          );
          const merchantData = response.data;
          setMerchant(merchantData);

          // Request an onboarding or dashboard link
          const linkResponse = await axios.post(
            '/api/stripe/onboard-merchant',
            {
              connectedAccountId: merchantData.connectedAccountId,
            }
          );
          setAccountLink(linkResponse.data.url);
        } catch (error: any) {
          setError(
            error.response?.data?.error || 'Failed to fetch merchant profile'
          );
        }
      }
    };

    // Fetch the merchant profile when the session is available
    fetchMerchant();
  }, [session?.user?.id]);

  // Function to save the merchant profile
  const saveProfile = async () => {
    if (profileData) {
      try {
        if (session?.user?.id) {
          const response = await axios.put(
            `/api/merchant/profile/${session.user.id}`,
            profileData
          );
          alert('Profile updated successfully!');
          setMerchant(response.data); // Update local state with new data
        }
      } catch (error: any) {
        alert('Failed to update profile.');
      }
    }
  };

  if (session?.user) {
    if (error) {
      return <div>Error: {error}</div>;
    }

    if (!merchant) {
      return <div>Loading...</div>;
    }

    return (
      <div className="flex flex-col min-h-screen justify-between">
        <div className="flex justify-center flex-grow">
          <div className="w-4/5 mt-8">
            <Navbar />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-20">
              {/* Left section */}
              <div className="">
                <h1 className="text-3xl font-bold mb-6 mt-12">
                  Merchant profile
                </h1>

                {/* MerchantForm receives the current storeName and lnurl */}
                <MerchantForm
                  storeName={merchant.storeName || ''}
                  lnurl={merchant.lnurl || ''}
                  oneClickDiscount={merchant.oneClickDiscount || 2}
                  onFormChange={setProfileData} // Update profile data in parent
                />

                {/* Centralized Save Button */}
                <div className="flex justify-center mt-4">
                  <Button text="Save" variant="primary" onClick={saveProfile} />
                </div>
              </div>

              {/* Right section - Hosted Onboarding/Dashboard Link */}
              <div className="mt-12">
                {accountLink ? (
                  <Button
                    text={
                      merchant.connectedAccountId
                        ? 'Go to Stripe Dashboard'
                        : 'Start Onboarding'
                    }
                    variant="primary"
                    onClick={() => window.open(accountLink, '_blank')}
                  />
                ) : (
                  <p>Loading link...</p>
                )}

                <div className="pt-10">
                  <h1 className="text-3xl font-bold mb-6 mt-12">
                    Transactions
                  </h1>
                  <MerchantTransactionsTable merchantId={session?.user?.id} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return <h2>Please login to see profile page</h2>;
};

export default MerchantProfileClient;
