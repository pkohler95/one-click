import { randomBytes, createHash } from 'crypto';

// Generate a random API key
export function generateApiKey(): string {
  return randomBytes(32).toString('hex'); // Generates a 64-character hex string
}

// Hash the API key before saving
export function hashApiKey(apiKey: string): string {
  return createHash('sha256').update(apiKey).digest('hex');
}
