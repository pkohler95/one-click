import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json();

    // Find the user in the database and fetch the stripePaymentMethodId
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user || !user.stripePaymentMethodId) {
      throw new Error('No payment method found for this user');
    }

    const paymentMethodId = user.stripePaymentMethodId;

    return NextResponse.json({ paymentMethodId });
  } catch (error) {
    return NextResponse.json(
      { error: (error as Error).message },
      { status: 500 }
    );
  }
}
