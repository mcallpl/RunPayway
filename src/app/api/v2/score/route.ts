// RUNPAYWAY™ — POST /api/v2/score
// Model RP-2.0 Deterministic Assessment Engine

import { NextRequest, NextResponse } from "next/server";
import { executeAssessment } from "@/lib/engine/v2/index";
import { validateApiKey } from "@/lib/api-auth";
import { verifyPaymentToken } from "@/lib/payment-token";
import { auditLog, getClientIp } from "@/lib/audit-log";
import { createStorageBackend } from "@/lib/engine";

function isAuthorized(
  request: NextRequest,
  body: Record<string, unknown>,
): boolean {
  if (validateApiKey(request)) return true;

  const pt = body._payment_token as string | undefined;
  const pp = body._payment_payload as Record<string, string> | undefined;
  if (pt && pp) {
    return verifyPaymentToken(pt, {
      plan_key: pp.plan_key as "single_assessment" | "annual_monitoring",
      timestamp: pp.timestamp,
      nonce: pp.nonce,
      expires_at: pp.expires_at,
    });
  }

  return false;
}

export async function POST(request: NextRequest) {
  const body = await request.json();

  if (!isAuthorized(request, body)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const result = executeAssessment({
      rawInputs: body.raw_inputs,
      profile: body.profile,
      extendedInputs: body.extended_inputs ?? undefined,
    });

    auditLog({
      action: "record_created",
      record_id: result.assessment_id,
      ip: getClientIp(request),
      timestamp: new Date().toISOString(),
      metadata: {
        model_version: result.model_manifest.model_version,
        stability_band: result.bands.primary_band,
      },
    });

    // Persist record for server-side verification
    try {
      const storage = createStorageBackend();
      await storage.saveRecord({
        record_id: result.assessment_id,
        authorization_code: result.integrity.record_hash.slice(0, 16),
        model_version: result.model_manifest.model_version,
        assessment_date_utc: result.created_at,
        issued_timestamp_utc: result.created_at,
        final_score: result.scores.overall_score,
        stability_band: result.bands.primary_band,
        registry_status: "Active",
        input_checksum: result.integrity.input_checksum,
      } as Parameters<typeof storage.saveRecord>[0]);
    } catch {
      // Storage failure should not block the response
    }

    // Return full assessment record (client renders from this)
    return NextResponse.json(result);
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : "Internal server error";
    const isValidation =
      message.includes("Validation") ||
      message.includes("invalid") ||
      message.includes("Required");
    return NextResponse.json(
      { error: message },
      { status: isValidation ? 400 : 500 },
    );
  }
}
