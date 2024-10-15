'use client';

import React from 'react';

export default function PlaceOrderButton() {
  const handlePlaceCoinbaseOrder = async () => {
    try {
      const response = await fetch('/api/coinbase/sandbox/order', {
        method: 'POST',
      });

      const data = await response.json();

      if (response.ok) {
        console.log('Order placed:', data);
      } else {
        console.error('Failed to place order:', data.error);
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return <button onClick={handlePlaceCoinbaseOrder}>Place Order</button>;
}
