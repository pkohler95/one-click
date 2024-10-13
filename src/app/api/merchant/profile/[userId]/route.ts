import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(
  req: NextRequest,
  { params }: { params: { userId: string } }
) {
  const userId = parseInt(params.userId, 10);

  if (isNaN(userId)) {
    return NextResponse.json({ error: 'Invalid userId' }, { status: 400 });
  }

  try {
    const merchant = await prisma.merchant.findUnique({
      where: { userId },
    });

    if (!merchant) {
      return NextResponse.json(
        { error: 'Merchant not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(merchant, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch merchant profile' },
      { status: 500 }
    );
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: { userId: string } }
) {
  const userId = parseInt(params.userId, 10);

  if (isNaN(userId)) {
    return NextResponse.json({ error: 'Invalid userId' }, { status: 400 });
  }

  try {
    const { storeName, lnurl } = await req.json();

    const updatedMerchant = await prisma.merchant.update({
      where: { userId },
      data: {
        storeName,
        lnurl,
      },
    });

    return NextResponse.json(updatedMerchant, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to update merchant profile' },
      { status: 500 }
    );
  }
}
