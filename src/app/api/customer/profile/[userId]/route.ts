// app/api/customer/[userId]/route.ts
import { NextResponse } from 'next/server';
import prisma from '@/lib/db'; // Adjust the path to your Prisma client

// GET Request: Fetch Customer by userId
export async function GET(
  req: Request,
  { params }: { params: { userId: string } }
) {
  try {
    const { userId } = params;
    const userIdNumber = Number(userId);

    if (isNaN(userIdNumber)) {
      return NextResponse.json({ error: 'Invalid userId' }, { status: 400 });
    }

    // Fetch customer by userId from the database
    const customer = await prisma.customer.findUnique({
      where: { userId: userIdNumber },
    });

    if (!customer) {
      return NextResponse.json(
        { error: 'Customer not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(customer, { status: 200 });
  } catch (error) {
    console.error('Error fetching customer profile:', error);
    return NextResponse.json(
      { error: 'Failed to fetch customer profile' },
      { status: 500 }
    );
  }
}

// PUT Request: Update Customer by userId
export async function PUT(
  req: Request,
  { params }: { params: { userId: string } }
) {
  try {
    const { userId } = params;
    const userIdNumber = Number(userId);

    if (isNaN(userIdNumber)) {
      return NextResponse.json({ error: 'Invalid userId' }, { status: 400 });
    }

    // Parse the request body for the profile info
    const data = await req.json();
    const {
      firstName,
      lastName,
      address,
      address2,
      city,
      state,
      zipCode,
      phoneNumber,
    } = data;

    // Update the customer's profile in the database
    const updatedCustomer = await prisma.customer.update({
      where: { userId: userIdNumber },
      data: {
        firstName,
        lastName,
        address,
        address2,
        city,
        state,
        zipCode,
        phoneNumber,
      },
    });

    return NextResponse.json(updatedCustomer, { status: 200 });
  } catch (error) {
    console.error('Error updating customer profile:', error);
    return NextResponse.json(
      { error: 'Failed to update customer profile' },
      { status: 500 }
    );
  }
}
