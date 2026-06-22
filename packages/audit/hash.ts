import { createHash } from "crypto";

export function sha256Hash(data: string): string {
  return createHash("sha256").update(data).digest("hex");
}

export function hashObject(obj: any): string {
  const json = JSON.stringify(obj, null, 0);
  return sha256Hash(json);
}

export function hashPayload(payload: any): string {
  return hashObject(payload);
}

export function hashPolicy(policyJson: string): string {
  return sha256Hash(policyJson);
}

export function hashResult(result: any): string {
  return hashObject(result);
}

export function generateAuditId(): string {
  const timestamp = Date.now();
  const randomPart = Math.random().toString(36).substring(2, 15);
  const combined = `aud_${timestamp}_${randomPart}`;
  return sha256Hash(combined).substring(0, 16);
}

export interface AuditHashes {
  input_hash: string;
  policy_hash: string;
  result_hash: string;
}

export function computeAuditHashes(
  payload: any,
  policyJson: string,
  result: any
): AuditHashes {
  return {
    input_hash: hashPayload(payload),
    policy_hash: hashPolicy(policyJson),
    result_hash: hashResult(result),
  };
}

export function verifyAuditHashes(hashes: AuditHashes, payload: any, policyJson: string, result: any): boolean {
  const computed = computeAuditHashes(payload, policyJson, result);
  return (
    hashes.input_hash === computed.input_hash &&
    hashes.policy_hash === computed.policy_hash &&
    hashes.result_hash === computed.result_hash
  );
}
