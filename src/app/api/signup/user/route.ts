import prisma from '@/lib/db';
import { NextResponse } from 'next/server';
import bcrypt from 'bcrypt';
import * as z from 'zod';

// Updated userSchema to include userType
const userSchema = z.object({
  name: z.string(),
  email: z.string().min(1, 'Email is required').email('Invalid email'),
  password: z
    .string()
    .min(1, 'Password is required')
    .min(8, 'Password must have minimum of 8 characters'),
  userType: z.enum(['customer', 'merchant'], 'User type is required'), // Add userType to the schema
});

export async function POST(req: Request) {
  try {
    const body = await req.json();

    // Validate request body
    const { name, email, password, userType } = userSchema.parse(body);

    // Check if email already exists in User table
    const existingUserByEmail = await prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (existingUserByEmail) {
      return NextResponse.json(
        {
          user: null,
          message: 'User with this email already exists',
        },
        { status: 409 }
      );
    }

    // Hash the user's password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user in the User table
    const newUser = await prisma.user.create({
      data: { name, email, password: hashedPassword, userType: userType },
    });

    // Depending on userType, create a record in either the Customer or Merchant table
    if (userType === 'customer') {
      await prisma.customer.create({
        data: {
          userId: newUser.id, // Link the customer to the user
          // Add any other customer-specific fields here
        },
      });
    } else if (userType === 'merchant') {
      await prisma.merchant.create({
        data: {
          userId: newUser.id, // Link the merchant to the user
          // Add any other merchant-specific fields here
        },
      });
    }

    // Return the new user without the password field
    const { password: newUserPassword, ...rest } = newUser;

    return NextResponse.json(
      {
        user: rest,
        message: 'User created successfully',
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
