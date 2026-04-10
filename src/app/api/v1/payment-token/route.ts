// RUNPAYWAY™ — POST /api/v1/payment-token
// Generate a signed payment token after checkout completion

import { NextRequest, NextResponse } from "next/server";
import { generatePaymentToken } from "@/lib/payment-token";

export const dynamic = "force-dynamic";
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const planKey = body.plan_key;

    if (planKey !== "single_assessment" && planKey !== "annual_monitoring") {
      return NextResponse.json(
        { error: "Invalid plan_key" },
        { status: 400 },
      );
    }

    const { token, payload } = generatePaymentToken(planKey);

    return NextResponse.json({
      token,
      plan_key: payload.plan_key,
      timestamp: payload.timestamp,
      nonce: payload.nonce,
      expires_at: payload.expires_at,
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Internal server error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
