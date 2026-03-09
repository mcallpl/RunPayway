// RUNPAYWAY™ Income Stability Score™ Diagnostic System
// Model RP-1.0 | Version 1.0 — Startup Integrity Verification

import { getRulesetChecksum } from "./manifest";

let ENGINE_LOCK = false;
let _verified = false;

export function verifyEngineIntegrity(): void {
  const checksum = getRulesetChecksum();

  // Checksum must be a valid 64-char hex string
  if (!/^[a-f0-9]{64}$/.test(checksum)) {
    ENGINE_LOCK = true;
    throw new Error(
      "Engine integrity check failed: invalid checksum format"
    );
  }

  _verified = true;
  ENGINE_LOCK = false;
}

export function isEngineLocked(): boolean {
  return ENGINE_LOCK;
}

export function isEngineVerified(): boolean {
  return _verified;
}

export function requireVerifiedEngine(): void {
  if (!_verified) {
    verifyEngineIntegrity();
  }
  if (ENGINE_LOCK) {
    throw new Error(
      "Engine is locked due to integrity verification failure. Execution blocked."
    );
  }
}
