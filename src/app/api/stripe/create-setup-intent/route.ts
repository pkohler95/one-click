import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { PrismaClient } from '@prisma/client';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  apiVersion: '2023-08-16',
});

const prisma = new PrismaClient();

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json();

    // Find user in the database by email
    let user = await prisma.user.findUnique({
      where: { email },
    });

    let customer;

    if (user && user.stripeCustomerId) {
      // If the user already has a Stripe customer ID, retrieve the customer from Stripe
      customer = await stripe.customers.retrieve(user.stripeCustomerId);
    } else {
      // If the user does not exist or does not have a Stripe customer ID, create a new customer
      customer = await stripe.customers.create({ email });

      // If the user does not exist, create a new user in the database
      if (!user) {
        user = await prisma.user.create({
          data: {
            email,
            stripeCustomerId: customer.id, // Store the Stripe customer ID
          },
        });
      } else {
        // Update the existing user with the Stripe customer ID
        user = await prisma.user.update({
          where: { email },
          data: { stripeCustomerId: customer.id },
        });
      }
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
