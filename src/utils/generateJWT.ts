// src/utils/generateJWT.ts
import jwt from 'jsonwebtoken';

export function generateJWT(
  apiKeyName: string,
  privateKey: string,
  method: string,
  path: string
) {
  const payload = {
    sub: apiKeyName,
    aud: 'https://api.coinbase.com',
    iat: Math.floor(Date.now() / 1000),
    exp: Math.floor(Date.now() / 1000) + 60,
    method,
    path,
  };

  return jwt.sign(payload, privateKey, { algorithm: 'RS256' });
}
