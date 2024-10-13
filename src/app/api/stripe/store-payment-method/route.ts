import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(req: NextRequest) {
  try {
    const { userId, paymentMethodId } = await req.json();

    // Convert userId to an integer if needed (assuming it's passed as a string)
    const numericUserId = parseInt(userId, 10);

    // Check if conversion was successful
    if (isNaN(numericUserId)) {
      return NextResponse.json(
        { error: 'Invalid userId. Expected an integer.' },
        { status: 400 }
      );
    }

    // Store the paymentMethodId in the Customer table instead of the User table
    await prisma.customer.update({
      where: { userId: numericUserId }, // Assuming `userId` is a unique key in the Customer table
      data: { stripePaymentMethodId: paymentMethodId },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { error: (error as Error).message },
      { status: 500 }
    );
  }
}
