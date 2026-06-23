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

export function computeAuditHash(
  previousHash: string | null,
  eventType: string,
  subjectType: string,
  subjectId: string,
  evaluationId: string | null,
  policyId: string | null,
  policyVersion: number | null,
  eventTimestamp: string,
  detailsPayload: unknown
): string {
  const canonicalPayload = [
    previousHash || '',
    eventType,
    subjectType,
    subjectId,
    evaluationId || '',
    policyId || '',
    policyVersion?.toString() || '',
    eventTimestamp,
    JSON.stringify(detailsPayload)
  ].join('|');

  return crypto.createHash('sha256').update(canonicalPayload).digest('hex');
}
