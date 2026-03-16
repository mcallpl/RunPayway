// RUNPAYWAY™ Income Stability Score™ Diagnostic System
// Model RP-1.0 | Version 1.0 — Authorization Code Generation

import { createHash, createHmac } from "crypto";
import { CANONICAL_KEYS, type DiagnosticInput } from "./types";

/**
 * Generate an authorization code for a record.
 *
 * If RUNPAYWAY_HMAC_SECRET is set in the environment, uses HMAC-SHA256 for
 * stronger server-side authentication. Otherwise falls back to plain SHA-256,
 * which works on the client side and in static deployments.
 */
export function generateAuthorizationCode(
  recordId: string,
  input: DiagnosticInput,
  issuedTimestamp: string
): string {
  // Pipe-delimited: record_id|key1=val1|key2=val2|...|timestamp
  const parts: string[] = [recordId];
  for (const key of CANONICAL_KEYS) {
    parts.push(`${key}=${input[key]}`);
  }
  parts.push(issuedTimestamp);

  const payload = parts.join("|");

  // Use HMAC-SHA256 if a secret is available (server-side hardened mode)
  const hmacSecret = process.env.RUNPAYWAY_HMAC_SECRET;
  if (hmacSecret) {
    return createHmac("sha256", hmacSecret).update(payload, "utf8").digest("hex");
  }

  // Fallback: plain SHA-256 (client-side / static deployment)
  return createHash("sha256").update(payload, "utf8").digest("hex");
}
