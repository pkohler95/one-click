import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/db';

export async function POST(req: NextRequest) {
  const { apiKeyId } = await req.json();
  const userId = req.headers.get('user-id'); // Fetch userId from headers for authentication

  if (!userId) {
    return NextResponse.json(
      { error: 'Unauthorized: Missing user ID' },
      { status: 401 }
    );
  }

  // Find the API key and ensure it belongs to the authenticated user's merchant
  const apiKey = await prisma.apiKey.findFirst({
    where: {
      id: apiKeyId,
      userId: parseInt(userId), // Match the userId with the ApiKey's userId
    },
  });

  if (!apiKey) {
    return NextResponse.json(
      { error: 'API key not found or unauthorized' },
      { status: 404 }
    );
  }

  // Revoke the API key by setting `isActive` to false
  await prisma.apiKey.update({
    where: { id: apiKeyId },
    data: { isActive: false },
  });

  return NextResponse.json({ message: 'API key revoked successfully' });
}
