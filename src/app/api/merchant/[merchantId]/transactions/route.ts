import { NextResponse } from 'next/server';
import prisma from '@/lib/db';

export async function GET(
  req: Request,
  { params }: { params: { merchantId: string } }
) {
  try {
    const { merchantId } = params;
    const merchantIdNumber = Number(merchantId);

    if (isNaN(merchantIdNumber)) {
      return NextResponse.json(
        { error: 'Invalid merchantId' },
        { status: 400 }
      );
    }

    const transactions = await prisma.transaction.findMany({
      where: { merchantId: merchantIdNumber },
      orderBy: { createdAt: 'desc' },
    });

    if (!transactions || transactions.length === 0) {
      return NextResponse.json(
        { message: 'No transactions found for this merchant' },
        { status: 200 }
      );
    }

    return NextResponse.json(transactions, { status: 200 });
  } catch (error) {
    console.error('Error fetching transactions:', error);
    return NextResponse.json(
      { error: 'Failed to fetch transactions' },
      { status: 500 }
    );
  }
}
