import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { PrismaClient } from '@prisma/client';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  apiVersion: '2024-06-20',
});

const prisma = new PrismaClient();

export async function POST(req: NextRequest) {
  try {
    const { userId } = await req.json();

    // Convert userId to an integer if it's a string
    const numericUserId = parseInt(userId, 10);

    // Check if conversion was successful
    if (isNaN(numericUserId)) {
      return NextResponse.json(
        { error: 'Invalid userId. Expected an integer.' },
        { status: 400 }
      );
    }

    // Find customer in the database by userId and include related User data
    const customerRecord = await prisma.customer.findUnique({
      where: { userId: numericUserId },
      include: { user: true }, // Include related user data (e.g., email)
    });

    if (!customerRecord) {
      // If the customer does not exist in the Customer table, return an error
      return NextResponse.json(
        { error: 'Customer not found' },
        { status: 404 }
      );
    }

    let customer;

    if (customerRecord.stripeCustomerId) {
      // If the customer already has a Stripe customer ID, retrieve the customer from Stripe
      customer = await stripe.customers.retrieve(
        customerRecord.stripeCustomerId
      );
    } else {
      // If the customer exists but does not have a Stripe customer ID, create a new customer in Stripe
      customer = await stripe.customers.create({
        email: customerRecord.user.email, // Now we can access user.email
      });

      // Update the existing customer record with the Stripe customer ID
      await prisma.customer.update({
        where: { userId: numericUserId },
        data: { stripeCustomerId: customer.id },
      });
    }

    // Create a SetupIntent to collect ACH payment details
    const setupIntent = await stripe.setupIntents.create({
      payment_method_types: ['us_bank_account'],
      customer: customer.id, // Use the Stripe customer ID
    });

    return NextResponse.json({ clientSecret: setupIntent.client_secret });
  } catch (error) {
    return NextResponse.json(
      { error: (error as Error).message },
      { status: 500 }
    );
  }
}
