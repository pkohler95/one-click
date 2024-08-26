import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { PrismaClient } from '@prisma/client';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  apiVersion: '2024-06-20',
});

const prisma = new PrismaClient();

export async function POST(req: NextRequest) {
  try {
    const { email, amount, paymentMethodId } = await req.json();

    // Find the user in the database
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user || !user.stripeCustomerId) {
      throw new Error('User or Stripe customer not found');
    }

    // Attach the PaymentMethod to the Customer
    await stripe.paymentMethods.attach(paymentMethodId, {
      customer: user.stripeCustomerId,
    });

    // Optionally, set the PaymentMethod as the default for future payments
    await stripe.customers.update(user.stripeCustomerId, {
      invoice_settings: {
        default_payment_method: paymentMethodId,
      },
    });

    // Create a PaymentIntent with mandate data
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount * 100, // Amount in cents
      currency: 'usd',
      customer: user.stripeCustomerId, // Use stored Stripe customer ID
      payment_method: paymentMethodId,
      confirm: true,
      mandate_data: {
        customer_acceptance: {
          type: 'online',
          online: {
            ip_address:
              req.headers.get('x-forwarded-for') ||
              req.headers.get('remote-addr') ||
              '',
            user_agent: req.headers.get('user-agent') || '',
          },
        },
      },
      automatic_payment_methods: {
        enabled: true,
        allow_redirects: 'never', // Disable redirects if not needed
      },
    });

    return NextResponse.json({ paymentIntent });
  } catch (error) {
    return NextResponse.json(
      { error: (error as Error).message },
      { status: 500 }
    );
  }
}
