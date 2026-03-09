// RUNPAYWAY™ Income Stability Score™ Diagnostic System
// Model RP-1.0 | Version 1.0 — Canonical Serialization

import { createHash } from "crypto";
import { CANONICAL_KEYS, type DiagnosticInput } from "./types";

export function canonicalizeInputs(input: DiagnosticInput): string {
  const ordered: Record<string, number> = {};
  for (const key of CANONICAL_KEYS) {
    ordered[key] = input[key];
  }
  return JSON.stringify(ordered);
}

export function computeInputChecksum(input: DiagnosticInput): string {
  const canonical = canonicalizeInputs(input);
  return createHash("sha256").update(canonical, "utf8").digest("hex");
}

export function computeRecordHash(fields: Record<string, unknown>): string {
  const sorted = JSON.stringify(fields, Object.keys(fields).sort());
  return createHash("sha256").update(sorted, "utf8").digest("hex");
}
