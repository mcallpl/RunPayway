// RUNPAYWAY™ Income Stability Score™ Diagnostic System
// Model RP-1.0 | Version 1.0 — Authorization Code Generation

import { createHash } from "crypto";
import { CANONICAL_KEYS, type DiagnosticInput } from "./types";

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
  return createHash("sha256").update(payload, "utf8").digest("hex");
}
