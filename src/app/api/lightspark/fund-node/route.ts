import { NextRequest, NextResponse } from 'next/server';
import lightsparkClient from '@/app/lightspark/config';

export async function GET() {
  try {
    // Simulate funding from L1 to the address created earlier
    const fundNodeOutput = await lightsparkClient.fundNode(
      process.env.LIGHTSPARK_NODE_ID!,
      200000
    );
    if (!fundNodeOutput) {
      throw new Error('Unable to fund node');
    }
    console.log(`Funded amount: ${fundNodeOutput.originalValue}`);

    return NextResponse.json({ fundNodeOutput });
  } catch (error) {
    console.error('Error funding node:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
