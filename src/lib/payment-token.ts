// RUNPAYWAY™ — Signed Payment Token System
// Prevents users from faking payment by setting sessionStorage directly.
// Tokens are HMAC-SHA256 signed and expire after 1 hour.

import { createHmac, randomBytes } from "crypto";

const TOKEN_EXPIRY_MS = 60 * 60 * 1000; // 1 hour

function getSecret(): string {
  const secret = process.env.RUNPAYWAY_PAYMENT_SECRET;
  if (secret) return secret;

  if (process.env.NODE_ENV === "production") {
    throw new Error("[SECURITY] RUNPAYWAY_PAYMENT_SECRET must be set in production");
  }

  // Dev fallback — deterministic but not secure
  return "dev-payment-secret-" + process.cwd();
}

export interface PaymentTokenPayload {
  plan_key: "single_assessment" | "annual_monitoring";
  timestamp: string;
  nonce: string;
  expires_at: string;
}

/**
 * Generate a signed payment token for a completed purchase.
 */
export function generatePaymentToken(planKey: "single_assessment" | "annual_monitoring"): {
  token: string;
  payload: PaymentTokenPayload;
} {
  const now = new Date();
  const payload: PaymentTokenPayload = {
    plan_key: planKey,
    timestamp: now.toISOString(),
    nonce: randomBytes(16).toString("hex"),
    expires_at: new Date(now.getTime() + TOKEN_EXPIRY_MS).toISOString(),
  };

  const hmac = createHmac("sha256", getSecret());
  hmac.update(JSON.stringify(payload, Object.keys(payload).sort()));
  const token = hmac.digest("hex");

  return { token, payload };
}

/**
 * Verify a payment token is authentic and not expired.
 */
export function verifyPaymentToken(
  token: string,
  payload: PaymentTokenPayload,
): boolean {
  // Check expiry
  if (new Date() > new Date(payload.expires_at)) {
    return false;
  }

  // Validate plan_key
  if (payload.plan_key !== "single_assessment" && payload.plan_key !== "annual_monitoring") {
    return false;
  }

  // Recompute HMAC and compare
  const hmac = createHmac("sha256", getSecret());
  hmac.update(JSON.stringify(payload, Object.keys(payload).sort()));
  const expected = hmac.digest("hex");

  // Constant-time comparison
  if (token.length !== expected.length) return false;
  let diff = 0;
  for (let i = 0; i < token.length; i++) {
    diff |= token.charCodeAt(i) ^ expected.charCodeAt(i);
  }
  return diff === 0;
}
