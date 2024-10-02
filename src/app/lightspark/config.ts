import {
  AccountTokenAuthProvider,
  LightsparkClient,
} from '@lightsparkdev/lightspark-sdk';

const API_TOKEN_CLIENT_ID = process.env.LIGHTSPARK_CLIENT_ID!;
const API_TOKEN_CLIENT_SECRET = process.env.LIGHTSPARK_CLIENT_SECRET!;
const NODE_ID = process.env.LIGHTSPARK_NODE_ID!;
const NODE_PASSWORD = process.env.LIGHTSPARK_NODE_PASSWORD!;

// Create an API client
const lightsparkClient = new LightsparkClient(
  new AccountTokenAuthProvider(API_TOKEN_CLIENT_ID, API_TOKEN_CLIENT_SECRET)
);

lightsparkClient.loadNodeSigningKey(NODE_ID, { password: NODE_PASSWORD });

export default lightsparkClient;
