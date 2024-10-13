'use client';

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Navbar } from '@/components/shared/Navbar';
import Button from '@/components/shared/Button';
import MerchantForm from './MerchantForm';

interface Merchant {
  storeName?: string;
  lnurl?: string;
}

const MerchantProfileClient = ({ session }: { session: any }) => {
  const [merchant, setMerchant] = useState<Merchant | null>(null); // State for merchant data
  const [profileData, setProfileData] = useState<Merchant | null>(null); // State for local profile data
  const [error, setError] = useState<string | null>(null); // Error state

  useEffect(() => {
    // Function to fetch merchant data
    const fetchMerchant = async () => {
      if (session?.user?.id) {
        try {
          const response = await axios.get(
            `/api/merchant/profile/${session.user.id}`
          );
          setMerchant(response.data); // Set the merchant data from the response
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
                  onFormChange={setProfileData} // Update profile data in parent
                />

                {/* Centralized Save Button */}
                <div className="flex justify-center mt-4">
                  <Button
                    text="Save"
                    variant="primary"
                    onClick={saveProfile} // Trigger profile saving
                  />
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
