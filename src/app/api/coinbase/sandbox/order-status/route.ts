// src/app/api/coinbase/order-status/route.ts
import { NextResponse } from 'next/server';
import axios from 'axios';
import crypto from 'crypto';

export async function POST(request: Request) {
  const { orderId } = await request.json();

  if (!orderId) {
    return NextResponse.json(
      { error: 'Order ID is required' },
      { status: 400 }
    );
  }

  const API_URL = `https://api-public.sandbox.pro.coinbase.com/orders/${orderId}`;
  const API_KEY = process.env.COINBASE_SANDBOX_API_KEY!;
  const API_SECRET = process.env.COINBASE_SANDBOX_API_SECRET!;
  const PASSPHRASE = process.env.COINBASE_SANDBOX_PASSPHRASE!;

  const timestamp = Math.floor(Date.now() / 1000);
  const method = 'GET';
  const requestPath = `/orders/${orderId}`;

  // Create the signature
  const what = timestamp + method + requestPath;
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
    const response = await axios.get(API_URL, { headers });
    return NextResponse.json(response.data);
  } catch (error) {
    console.error(
      'Error retrieving order status:',
      (error as any).response?.data || (error as any).message
    );
    return NextResponse.json(
      { error: 'Failed to retrieve order status' },
      { status: 500 }
    );
  }
}
