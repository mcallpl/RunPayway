// RUNPAYWAY™ — POST /api/v1/score
// V1 scoring route — now powered by v2 engine with v1 output adapter.

import { NextRequest, NextResponse } from "next/server";
import { executeAssessment } from "@/lib/engine/v2/index";
import { adaptV2ToV1 } from "@/lib/v2-to-v1-adapter";
import { convertV1InputsToV2, convertV1ProfileToV2 } from "@/lib/client-engine-v2";
import { validateApiKey } from "@/lib/api-auth";
import { verifyPaymentToken } from "@/lib/payment-token";
import { auditLog, getClientIp } from "@/lib/audit-log";
import { createStorageBackend } from "@/lib/engine";

export const dynamic = "force-dynamic";
function isAuthorized(request: NextRequest, body: Record<string, unknown>): boolean {
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
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401 },
    );
  }

  try {
    // Convert v1 input format to v2
    const rawInputs = convertV1InputsToV2(body.inputs);
    const profile = convertV1ProfileToV2(body.profile);

    // Execute v2 engine
    const v2Result = executeAssessment({
      rawInputs,
      profile,
    });

    // Convert v2 output to v1 format
    const v1Record = adaptV2ToV1(v2Result);

    // Audit log
    auditLog({
      action: "record_created",
      record_id: v2Result.assessment_id,
      ip: getClientIp(request),
      timestamp: new Date().toISOString(),
      metadata: {
        model_version: v2Result.model_manifest.model_version,
        stability_band: v2Result.bands.primary_band,
      },
    });

    // Persist record
    try {
      const storage = createStorageBackend();
      await storage.saveRecord({
        record_id: v2Result.assessment_id,
        authorization_code: v2Result.integrity.record_hash.slice(0, 16),
        model_version: v2Result.model_manifest.model_version,
        assessment_date_utc: v2Result.created_at,
        issued_timestamp_utc: v2Result.created_at,
        final_score: v2Result.scores.overall_score,
        stability_band: v2Result.bands.primary_band,
        registry_status: "Active",
        input_checksum: v2Result.integrity.input_hash,
      } as Parameters<typeof storage.saveRecord>[0]);
    } catch {
      // Storage failure should not block the response
    }

    return NextResponse.json(v1Record);
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : "Internal server error";
    const status = message.includes("Validation") ? 400 : 500;
    return NextResponse.json({ error: message }, { status });
  }
}
