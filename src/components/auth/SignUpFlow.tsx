'use client';

import { useState } from 'react';
import MerchantSignUpForm from './MerchantSignUpForm';
import CustomerSignUpForm from './CustomerSignUpForm';

const SignUp = () => {
  const [userType, setUserType] = useState<string | null>(null);

  const handleSelectUserType = (type: string) => {
    setUserType(type);
  };

  return (
    <div>
      {!userType && (
        <>
          <h1>Sign Up</h1>
          <div>
            <button onClick={() => handleSelectUserType('merchant')}>
              Sign Up as Merchant
            </button>
            <button onClick={() => handleSelectUserType('customer')}>
              Sign Up as Customer
            </button>
          </div>
        </>
      )}

      {userType === 'merchant' && <MerchantSignUpForm />}
      {userType === 'customer' && <CustomerSignUpForm />}
    </div>
  );
};

export default SignUp;
