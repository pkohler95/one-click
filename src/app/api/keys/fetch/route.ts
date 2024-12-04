import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/db'; // Adjust the path as necessary

export async function GET(req: NextRequest) {
  const userId = req.headers.get('user-id'); // Extract userId from headers

  if (!userId) {
    return NextResponse.json(
      { error: 'Unauthorized: Missing user ID' },
      { status: 401 }
    );
  }

  // Fetch API keys for the user
  const apiKeys = await prisma.apiKey.findMany({
    where: { userId: parseInt(userId) },
    select: {
      id: true,
      createdAt: true,
      expiresAt: true,
      isActive: true,
    },
  });

  if (!apiKeys.length) {
    return NextResponse.json(
      { error: 'No API keys found for this user' },
      { status: 404 }
    );
  }

  return NextResponse.json({ apiKeys });
}
