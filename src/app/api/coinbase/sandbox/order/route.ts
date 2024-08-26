// src/app/api/coinbase/order/route.ts
import { NextResponse } from 'next/server';
import axios from 'axios';
import crypto from 'crypto';

export async function POST(request: Request) {
  const API_URL = 'https://api-public.sandbox.pro.coinbase.com/orders';
  const API_KEY = process.env.COINBASE_SANDBOX_API_KEY!;
  const API_SECRET = process.env.COINBASE_SANDBOX_API_SECRET!;
  const PASSPHRASE = process.env.COINBASE_SANDBOX_PASSPHRASE!;

  const timestamp = Math.floor(Date.now() / 1000);
  const method = 'POST';
  const requestPath = '/orders';

  const body = JSON.stringify({
    type: 'market',
    side: 'buy',
    product_id: 'BTC-USD',
    funds: '100.00', // Buy $100 worth of BTC
  });

  // Create the signature
  const what = timestamp + method + requestPath + body;
  const key = Buffer.from(API_SECRET, 'base64');
  const hmac = crypto.createHmac('sha256', key);
  const signature = hmac.update(what).digest('base64');

  const headers = {
    'CB-ACCESS-KEY': API_KEY,
    'CB-ACCESS-SIGN': signature,
    'CB-ACCESS-TIMESTAMP': timestamp.toString(),
    'CB-ACCESS-PASSPHRASE': PASSPHRASE,
    'Content-Type': 'application/json',
  };

  try {
    const response = await axios.post(API_URL, body, { headers });
    return NextResponse.json(response.data);
  } catch (error) {
    console.error(
      'Error placing order:',
      error.response?.data || error.message
    );
    return NextResponse.json(
      { error: 'Failed to place order' },
      { status: 500 }
    );
  }
}
