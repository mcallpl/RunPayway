import crypto from 'crypto';

export function hashPayload(payload: unknown): string {
  const jsonString = JSON.stringify(payload);
  return crypto.createHash('sha256').update(jsonString).digest('hex');
}

export function hashResult(result: unknown): string {
  const jsonString = JSON.stringify(result);
  return crypto.createHash('sha256').update(jsonString).digest('hex');
}

export function computeHash(data: unknown): string {
  const jsonString = JSON.stringify(data);
  return crypto.createHash('sha256').update(jsonString).digest('hex');
}
