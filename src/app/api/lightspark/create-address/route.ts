import { NextRequest, NextResponse } from 'next/server';
import lightsparkClient from '@/app/lightspark/config';

export async function GET() {
  try {
    const fundingAddress = await lightsparkClient.createNodeWalletAddress(
      process.env.LIGHTSPARK_NODE_ID!
    );

    return NextResponse.json({ fundingAddress });
  } catch (error) {
    console.error('Error creating address:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
