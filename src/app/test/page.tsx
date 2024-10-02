'use client';

import { useState } from 'react';

const HomePage = () => {
  const [fundingAddress, setFundingAddress] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const getFundingAddress = async () => {
    try {
      const res = await fetch('/api/lightspark/create-address');
      const data = await res.json();

      if (res.ok) {
        console.log(res);
        setFundingAddress(data.fundingAddress);
      } else {
        setError(data.error);
      }
    } catch (err) {
      setError('Failed to fetch funding address');
    }
  };

  return (
    <div className="p-8 text-white">
      <h1>Lightspark Integration</h1>
      <button onClick={getFundingAddress}>Get Funding Address</button>
      {fundingAddress && (
        <p className=" text-white">Funding Address: {fundingAddress}</p>
      )}

      {error && <p className="text-red-500">Error: {error}</p>}
    </div>
  );
};

export default HomePage;
