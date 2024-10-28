import { stripe } from '@/lib/stripe';
import prisma from '@/lib/db';
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    const email = session.user?.email;
    const userId = session.user?.id;

    if (!email || !userId) {
      return NextResponse.json(
        { error: 'Invalid session data' },
        { status: 400 }
      );
    }

    // Convert `userId` to a number
    const userIdNumber = Number(userId);
    if (isNaN(userIdNumber)) {
      return NextResponse.json({ error: 'Invalid user ID' }, { status: 400 });
    }

    // Fetch the merchant record from the database
    const merchant = await prisma.merchant.findUnique({
      where: { userId: userIdNumber },
    });

    let connectedAccountId = merchant?.connectedAccountId;

    // If the merchant doesn't have a connected account, create one
    if (!connectedAccountId) {
      const account = await stripe.accounts.create({
        type: 'express',
        country: 'US',
        email,
      });

      // Save the new connected account ID to the database
      await prisma.merchant.update({
        where: { userId: userIdNumber },
        data: { connectedAccountId: account.id },
      });

      connectedAccountId = account.id;
    }

    // Check the connected account’s status
    const account = await stripe.accounts.retrieve(connectedAccountId);

    let accountLinkUrl: string;

    if (account.details_submitted && account.charges_enabled) {
      // Account is fully enabled, create a login link to the dashboard
      const loginLink = await stripe.accounts.createLoginLink(
        connectedAccountId
      );
      accountLinkUrl = loginLink.url;
    } else {
      // Account is not fully enabled, create an onboarding link
      const accountLink = await stripe.accountLinks.create({
        account: connectedAccountId,
        refresh_url: 'http://localhost:3000/merchant-profile',
        return_url: 'http://localhost:3000/merchant-profile',
        type: 'account_onboarding',
      });
      accountLinkUrl = accountLink.url;
    }

    return NextResponse.json({ url: accountLinkUrl });
  } catch (error) {
    console.error('Error onboarding merchant:', error);
    return NextResponse.error();
  }
}
