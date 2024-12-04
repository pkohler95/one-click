import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/db';
import { hashApiKey } from '@/utils/apiKeyUtils';

// In-memory store for rate limiting (use Redis or another persistent store for production)
const rateLimitCache: Record<string, { count: number; lastRequest: number }> =
  {};
const RATE_LIMIT_WINDOW = 60 * 1000; // 1 minute
const MAX_REQUESTS = 100; // Max requests per minute per API key

export async function middleware(req: NextRequest) {
  const apiKey = req.headers.get('x-api-key');
  if (!apiKey) {
    return NextResponse.json({ error: 'API key missing' }, { status: 401 });
  }

  const hashedKey = hashApiKey(apiKey);

  // Fetch the API key record
  const keyRecord = await prisma.apiKey.findFirst({
    where: {
      key: hashedKey,
      isActive: true,
      expiresAt: {
        gte: new Date(),
      },
    },
  });

  if (!keyRecord) {
    return NextResponse.json({ error: 'Invalid API key' }, { status: 403 });
  }

  // Rate limiting logic
  const now = Date.now();
  const cacheKey = `rate-limit:${hashedKey}`;

  if (!rateLimitCache[cacheKey]) {
    // Initialize rate limit for this API key
    rateLimitCache[cacheKey] = { count: 1, lastRequest: now };
  } else {
    const rateData = rateLimitCache[cacheKey];
    const timeElapsed = now - rateData.lastRequest;

    if (timeElapsed > RATE_LIMIT_WINDOW) {
      // Reset rate limit window
      rateLimitCache[cacheKey] = { count: 1, lastRequest: now };
    } else if (rateData.count >= MAX_REQUESTS) {
      // Block request if rate limit exceeded
      return NextResponse.json(
        { error: 'Rate limit exceeded. Try again later.' },
        { status: 429 }
      );
    } else {
      // Increment the request count
      rateData.count += 1;
    }
  }

  // Allow request to proceed
  return NextResponse.next();
}

export const config = {
  matcher: ['/api/protected/:path*'], // Apply middleware to specific routes
};
