import prisma from '@/lib/db';
import { NextResponse } from 'next/server';
import bcrypt from 'bcrypt';
import * as z from 'zod';

const merchantSchema = z.object({
  name: z.string(),
  email: z.string().min(1, 'Email is required').email('Invalid email'),
  password: z
    .string()
    .min(1, 'Password is required')
    .min(8, 'Password must have minimum of 8 characters'),
});

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const { name, email, password } = merchantSchema.parse(body);

    // Check if email already exists

    const existingMerchantByEmail = await prisma.merchant.findUnique({
      where: {
        email,
      },
    });

    if (existingMerchantByEmail) {
      return NextResponse.json(
        {
          merchant: null,
          message: 'Merchant with this email already exists',
        },
        { status: 409 }
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newMerchant = await prisma.merchant.create({
      data: { name, email, password: hashedPassword },
    });

    const { password: newMerchantPassword, ...rest } = newMerchant;

    return NextResponse.json(
      {
        merchant: rest,
        message: 'Merchant created successfully',
      },
      { status: 201 }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: 'Something went wrong' },
      { status: 500 }
    );
  }
}
