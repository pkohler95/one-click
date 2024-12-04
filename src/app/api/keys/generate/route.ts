import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/db'; // Adjust the path as needed
import { generateApiKey, hashApiKey } from '@/utils/apiKeyUtils';

export async function POST(req: NextRequest) {
  const userId = req.headers.get('user-id'); // Example header for user authentication
  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // Find the merchant associated with the userId
  const merchant = await prisma.merchant.findUnique({
    where: { userId: parseInt(userId) }, // Ensure userId matches the schema type
  });

  if (!merchant) {
    return NextResponse.json(
      { error: 'Merchant not found for this user' },
      { status: 404 }
    );
  }

  // Generate and hash the API key
  const rawKey = generateApiKey();
  const hashedKey = hashApiKey(rawKey);

  // Create the API key record linked to the userId
  await prisma.apiKey.create({
    data: {
      key: hashedKey,
      userId: parseInt(userId), // Link the key to the userId
      // expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // Optional: Expires in 30 days
    },
  });

  // Return the raw API key to the client (only shown once)
  return NextResponse.json({ apiKey: rawKey });
}
