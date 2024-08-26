import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(req: NextRequest) {
  try {
    const { email, paymentMethodId } = await req.json();

    // Store the paymentMethodId in your database
    await prisma.user.update({
      where: { email: email },
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
