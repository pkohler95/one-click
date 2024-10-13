import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { PrismaClient } from '@prisma/client';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  apiVersion: '2024-06-20',
});

const prisma = new PrismaClient();

export async function POST(req: NextRequest) {
  try {
    const { userId, amount } = await req.json();

    // Parse userId as an integer
    const parsedUserId = parseInt(userId, 10);

    if (isNaN(parsedUserId)) {
      throw new Error('Invalid userId');
    }

    // Find the customer in the database using the parsed userId
    const customerRecord = await prisma.customer.findUnique({
      where: { userId: parsedUserId },
    });

    // Check if customer and paymentMethodId exist
    if (
      !customerRecord ||
      !customerRecord.stripeCustomerId ||
      !customerRecord.stripePaymentMethodId
    ) {
      throw new Error('Customer, Stripe customer, or payment method not found');
    }

    const { stripeCustomerId, stripePaymentMethodId, balance } = customerRecord;

    // Convert balance to a number (default to 0 if null)
    const currentBalance = balance ? parseFloat(balance) : 0;

    // Attach the PaymentMethod to the Customer (optional, if not already attached)
    await stripe.paymentMethods.attach(stripePaymentMethodId, {
      customer: stripeCustomerId,
    });

    // Optionally, set the PaymentMethod as the default for future payments
    await stripe.customers.update(stripeCustomerId, {
      invoice_settings: {
        default_payment_method: stripePaymentMethodId,
      },
    });

    // Create a PaymentIntent with mandate data
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount * 100, // Amount in cents
      currency: 'usd',
      customer: stripeCustomerId, // Use stored Stripe customer ID
      payment_method: stripePaymentMethodId,
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

    // Update the balance with the new amount added to the current balance
    const updatedBalance = currentBalance + amount;

    await prisma.customer.update({
      where: { userId: parsedUserId },
      data: {
        balance: updatedBalance.toString(), // Store as a string
      },
    });

    // Return both the paymentIntent and the updated balance
    return NextResponse.json({ paymentIntent, updatedBalance });
  } catch (error) {
    return NextResponse.json(
      { error: (error as Error).message },
      { status: 500 }
    );
  }
}
