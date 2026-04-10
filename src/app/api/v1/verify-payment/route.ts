// RUNPAYWAY™ — POST /api/v1/verify-payment
// Verify a signed payment token is authentic and not expired

import { NextRequest, NextResponse } from "next/server";
import { verifyPaymentToken } from "@/lib/payment-token";

export const dynamic = "force-dynamic";
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { token, plan_key, timestamp, nonce, expires_at } = body;

    if (!token || !plan_key || !timestamp || !nonce || !expires_at) {
      return NextResponse.json(
        { valid: false, error: "Missing required fields" },
        { status: 400 },
      );
    }

    const valid = verifyPaymentToken(token, {
      plan_key,
      timestamp,
      nonce,
      expires_at,
    });

    return NextResponse.json({
      valid,
      plan_key: valid ? plan_key : undefined,
      expires_at: valid ? expires_at : undefined,
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Internal server error";
    return NextResponse.json({ valid: false, error: message }, { status: 500 });
  }
}
