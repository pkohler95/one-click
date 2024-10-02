import { NextRequest, NextResponse } from 'next/server';
import lightsparkClient from '@/app/lightspark/config';

export async function GET() {
  try {
    // Simulate receiving an invoice
    const testInvoice = await lightsparkClient.createTestModeInvoice(
      process.env.LIGHTSPARK_NODE_ID!,
      20_000,
      'example script payment'
    );
    if (!testInvoice) {
      throw new Error('Unable to create test invoice');
    }
    console.log(`Invoice created: ${testInvoice}\n`);

    // Pay the invoice
    const payInvoice = await lightsparkClient.payInvoice(
      process.env.LIGHTSPARK_NODE_ID!,
      testInvoice,
      1000
    );
    if (!payInvoice) {
      throw new Error('Payment failed');
    }
    console.log(
      `Payment done with ID = ${JSON.stringify(payInvoice, null, 2)}\n`
    );

    return NextResponse.json({ payInvoice });
  } catch (error) {
    console.error('Error sending payment:', error);
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(
      { error: 'An unknown error occurred' },
      { status: 500 }
    );
  }
}
