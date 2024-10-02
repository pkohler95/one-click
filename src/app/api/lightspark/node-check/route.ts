import { NextRequest, NextResponse } from 'next/server';

import {
  AccountTokenAuthProvider,
  LightsparkClient,
} from '@lightsparkdev/lightspark-sdk';

const API_TOKEN_CLIENT_ID = process.env.LIGHTSPARK_CLIENT_ID!;
const API_TOKEN_CLIENT_SECRET = process.env.LIGHTSPARK_CLIENT_SECRET!;
const NODE_ID = process.env.LIGHTSPARK_NODE_ID!;
const NODE_PASSWORD = process.env.LIGHTSPARK_NODE_PASSWORD!;

export async function GET() {
  try {
    const lightsparkClient = new LightsparkClient(
      new AccountTokenAuthProvider(API_TOKEN_CLIENT_ID, API_TOKEN_CLIENT_SECRET)
    );

    const signingKey = await lightsparkClient.loadNodeSigningKey(NODE_ID, {
      password: NODE_PASSWORD,
    });

    console.log(signingKey); // Should be ACTIVE or UNLOCKED

    return NextResponse.json({ lightsparkClient });
  } catch (error) {
    console.error('Error checking node:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
