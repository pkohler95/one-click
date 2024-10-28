// app/api/create-payment-intent/route.ts
import { stripe } from '@/lib/stripe';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { amount, currency, connectedAccountId } = await req.json();

    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount,
      currency: currency,
      payment_method_types: ['card'],
      on_behalf_of: connectedAccountId,
      transfer_data: {
        destination: connectedAccountId,
      },
    });

    return NextResponse.json({ clientSecret: paymentIntent.client_secret });
  } catch (error) {
    return NextResponse.error();
  }
}
