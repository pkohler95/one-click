'use client';

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Navbar } from '@/components/shared/Navbar';
import AddressForm from './AddressForm';
import BankDetails from './BankDetails';
import AddBankDetails from './AddBankDetails';
import Button from '@/components/shared/Button';
import { CustomerNavBar } from './CustomerNavBar';

interface Customer {
  firstName?: string;
  lastName?: string;
  address?: string;
  address2?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  phoneNumber?: string;
  stripeCustomerId?: string;
  stripePaymentMethodId?: string;
  balance?: string;
}

interface BankDetailsProps {
  bankName: string;
  accountType: string;
  last4: string;
}

const CustomerProfileClient = ({ session }: { session: any }) => {
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [bankDetails, setBankDetails] = useState<BankDetailsProps | null>(null); // New state for bank details
  const [profileData, setProfileData] = useState<Customer | null>(null); // Local state for profile data
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCustomer = async () => {
      if (session?.user?.id) {
        try {
          const response = await axios.get(
            `/api/customer/profile/${session.user.id}`
          );
          setCustomer(response.data);
        } catch (error: any) {
          setError(
            error.response?.data?.error || 'Failed to fetch customer profile'
          );
        }
      }
    };

    // First fetch the customer profile
    fetchCustomer();
  }, [session?.user?.id]);

  useEffect(() => {
    const fetchBankDetails = async () => {
      // Only fetch bank details if stripePaymentMethodId is available
      if (customer?.stripePaymentMethodId) {
        try {
          const response = await axios.post(
            '/api/stripe/get-payment-method-details',
            {
              stripePaymentMethodId: customer.stripePaymentMethodId,
            }
          );

          const paymentMethod = response.data.paymentMethod;
          setBankDetails({
            bankName: paymentMethod.us_bank_account.bank_name,
            accountType: paymentMethod.us_bank_account.account_type,
            last4: paymentMethod.us_bank_account.last4,
          });
        } catch (error: any) {
          setError('Failed to fetch bank details.');
        }
      }
    };

    // Fetch bank details once the customer information is loaded and only if they have a stripePaymentMethodId
    if (customer?.stripePaymentMethodId) {
      fetchBankDetails(); // Fetch bank details only if stripePaymentMethodId exists
    }
  }, [customer?.stripePaymentMethodId, session?.user?.id]);

  const saveProfile = async () => {
    if (profileData) {
      try {
        if (session?.user?.id) {
          const response = await axios.put(
            `/api/customer/profile/${session.user.id}`,
            profileData
          );
          alert('Profile updated successfully!');
          setCustomer(response.data); // Update local state with new data
        }
      } catch (error: any) {
        alert('Failed to update profile.');
      }
    }
  };

  // Function to update the balance after adding funds
  const updateBalance = (newBalance: string) => {
    setCustomer((prevCustomer) => {
      if (prevCustomer) {
        return {
          ...prevCustomer,
          balance: newBalance,
        };
      }
      return prevCustomer;
    });
  };

  if (session?.user) {
    if (error) {
      return <div>Error: {error}</div>;
    }

    if (!customer) {
      return <div>Loading...</div>;
    }

    return (
      <div className="flex flex-col min-h-screen justify-between">
        <div className="flex justify-center flex-grow">
          <div className="w-4/5 mt-8">
            {/* Pass balance and updateBalance to the Navbar */}
            <CustomerNavBar balance={parseFloat(customer.balance || '0')} />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-20">
              {/* Left section */}
              <div className="">
                <h1 className="text-3xl font-bold mb-6 mt-12">
                  Customer profile
                </h1>

                {/* Pass customer data and form change handler to AddressForm */}
                <AddressForm
                  firstName={customer.firstName || ''}
                  lastName={customer.lastName || ''}
                  address={customer.address || ''}
                  address2={customer.address2 || ''}
                  city={customer.city || ''}
                  state={customer.state || ''}
                  zipCode={customer.zipCode || ''}
                  phoneNumber={customer.phoneNumber || ''}
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

              {/* Right section */}
              <div className="flex">
                <div className="w-full ">
                  {/* Conditionally render BankDetails or AddBankDetails based on stripePaymentMethodId */}
                  {customer.stripePaymentMethodId ? (
                    bankDetails && (
                      <BankDetails
                        bankName={bankDetails.bankName}
                        accountType={bankDetails.accountType}
                        last4={bankDetails.last4}
                        userId={session.user.id}
                        updateBalance={updateBalance} // Pass the balance update function to BankDetails
                      />
                    )
                  ) : (
                    <AddBankDetails
                      session={session}
                      firstName={customer.firstName || ''}
                      lastName={customer.lastName || ''}
                    />
                  )}
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

export default CustomerProfileClient;
