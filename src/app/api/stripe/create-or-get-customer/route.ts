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

    // Find the user in your database
    let user = await prisma.user.findUnique({
      where: { email },
    });

    let customerId;

    if (user && user.stripeCustomerId) {
      // If the user already has a Stripe customer ID, use it
      customerId = user.stripeCustomerId;
    } else {
      // If the user doesn't have a Stripe customer, create one
      const customer = await stripe.customers.create({
        email,
      });

      customerId = customer.id;

      // Store the new Stripe customer ID in your database
      if (user) {
        // Update existing user
        await prisma.user.update({
          where: { email },
          data: { stripeCustomerId: customerId },
        });
      } else {
        // Optionally, create a new user record if one doesn't exist
        user = await prisma.user.create({
          data: {
            email,
            stripeCustomerId: customerId,
          },
        });
      }
    }

    return NextResponse.json({ customerId });
  } catch (error) {
    return NextResponse.json(
      { error: (error as Error).message },
      { status: 500 }
    );
  }
}
