import { NextResponse } from 'next/server';
import prisma from '@/lib/db';

export async function POST(req: Request) {
  const { name, email } = await req.json();

  // Check if the user already exists
  const existingUser = await prisma.user.findUnique({
    where: { email },
  });

  if (existingUser) {
    return NextResponse.json(
      { message: 'User with this email already exists' },
      { status: 409 }
    );
  }

  // Create a new user
  const newUser = await prisma.user.create({
    data: {
      name,
      email,
    },
  });

  // Send a success response
  return NextResponse.json({
    message: 'User created successfully!',
    user: {
      id: newUser.id,
      name: newUser.name,
      email: newUser.email,
    },
  });
}
