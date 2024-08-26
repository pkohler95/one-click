// src/app/api/coinbase/order/route.ts
import { NextResponse } from 'next/server';
import axios from 'axios';
import { generateJWT } from '@/utils/generateJWT';

export async function POST(request: Request) {
  const API_URL = 'https://api.coinbase.com/api/v3/brokerage/orders';
  const API_KEY_NAME = process.env.COINBASE_API_KEY_NAME!;
  const PRIVATE_KEY = process.env.COINBASE_PRIVATE_KEY!.replace(/\\n/g, '\n'); // Handle newlines in private key

  const method = 'POST';
  const path = '/api/v3/brokerage/orders';

  // Generate JWT
  const jwtToken = generateJWT(API_KEY_NAME, PRIVATE_KEY, method, path);

  const headers = {
    Authorization: `Bearer ${jwtToken}`,
    'Content-Type': 'application/json',
  };

  const body = JSON.stringify({
    product_id: 'BTC-USD',
    side: 'buy',
    order_configuration: {
      market_market_ioc: {
        quote_size: '100',
      },
    },
  });

  try {
    const response = await axios.post(API_URL, body, { headers });
    return NextResponse.json(response.data);
  } catch (error) {
    console.error(
      'Error placing order:',
      (error as any).response?.data || (error as any).message
    );

    return NextResponse.json(
      { error: 'Failed to place order' },
      { status: 500 }
    );
  }
}
