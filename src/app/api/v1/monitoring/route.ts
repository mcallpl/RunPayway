// RUNPAYWAY™ — POST /api/v1/monitoring
// Server-side monitoring session management
// Actions: create, verify, use

import { NextRequest, NextResponse } from "next/server";
import {
  createSession,
  verifySession,
  useAssessment,
} from "@/lib/monitoring-storage";
import { verifyPaymentToken } from "@/lib/payment-token";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const action = body.action;

    switch (action) {
      case "create": {
        // Requires valid payment token
        const { token, payload, email } = body;
        if (!email || typeof email !== "string") {
          return NextResponse.json({ error: "Email required" }, { status: 400 });
        }
        if (token && payload) {
          const valid = verifyPaymentToken(token, payload);
          if (!valid) {
            return NextResponse.json({ error: "Invalid payment token" }, { status: 401 });
          }
          if (payload.plan_key !== "annual_monitoring") {
            return NextResponse.json({ error: "Token not for monitoring plan" }, { status: 400 });
          }
        } else if (process.env.NODE_ENV === "production") {
          return NextResponse.json({ error: "Payment token required" }, { status: 401 });
        }

        const session = await createSession(email);
        return NextResponse.json({
          access_code: session.access_code,
          assessments_total: session.assessments_total,
          assessments_used: session.assessments_used,
          expires_at: session.expires_at,
        });
      }

      case "verify": {
        const { access_code } = body;
        if (!access_code || typeof access_code !== "string") {
          return NextResponse.json({ error: "access_code required" }, { status: 400 });
        }

        const result = await verifySession(access_code);
        return NextResponse.json({
          valid: result.valid,
          remaining: result.remaining,
          expired: result.expired,
        });
      }

      case "use": {
        const { access_code, record_id } = body;
        if (!access_code || !record_id) {
          return NextResponse.json({ error: "access_code and record_id required" }, { status: 400 });
        }

        const success = await useAssessment(access_code, record_id);
        return NextResponse.json({ success });
      }

      default:
        return NextResponse.json(
          { error: "Invalid action. Use: create, verify, use" },
          { status: 400 },
        );
    }
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Internal server error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
