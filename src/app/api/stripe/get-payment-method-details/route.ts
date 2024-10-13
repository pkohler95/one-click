import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  apiVersion: '2024-06-20',
});

export async function POST(req: NextRequest) {
  try {
    const { stripePaymentMethodId } = await req.json();

    // Check if stripePaymentMethodId is provided
    if (!stripePaymentMethodId) {
      return NextResponse.json(
        { error: 'stripePaymentMethodId is required' },
        { status: 400 }
      );
    }

    // Fetch the payment method details from Stripe
    const paymentMethod = await stripe.paymentMethods.retrieve(
      stripePaymentMethodId
    );

    // Return the payment method details as a response
    return NextResponse.json({ paymentMethod });
  } catch (error) {
    return NextResponse.json(
      { error: (error as Error).message },
      { status: 500 }
    );
  }
}
