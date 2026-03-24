// RUNPAYWAY™ — POST /api/verify
// Verification endpoint (Section 20)

import { NextRequest, NextResponse } from "next/server";
import { createStorageBackend } from "@/lib/engine";
import { validateApiKey } from "@/lib/api-auth";
import { auditLog, getClientIp } from "@/lib/audit-log";

export async function POST(request: NextRequest) {
  // API key authentication
  if (!validateApiKey(request)) {
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401 }
    );
  }

  try {
    const body = await request.json();
    const { record_id, authorization_code } = body;

    // Validate inputs before record lookup
    if (
      !record_id ||
      typeof record_id !== "string" ||
      !/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
        record_id
      )
    ) {
      return NextResponse.json(
        { valid_record: false },
        { status: 400 }
      );
    }

    if (
      !authorization_code ||
      typeof authorization_code !== "string" ||
      !/^[a-f0-9]{16,64}$/.test(authorization_code)
    ) {
      return NextResponse.json(
        { valid_record: false },
        { status: 400 }
      );
    }

    const storage = createStorageBackend();
    const record = await storage.verifyRecord(record_id, authorization_code);

    // Audit log: verification attempt
    auditLog({
      action: "record_verified",
      record_id,
      ip: getClientIp(request),
      timestamp: new Date().toISOString(),
      metadata: {
        valid: !!record,
      },
    });

    if (!record) {
      return NextResponse.json({ valid_record: false });
    }

    return NextResponse.json({
      valid_record: true,
      record_id: record.record_id,
      model_version: record.model_version,
      final_score: record.final_score,
      stability_band: record.stability_band,
      assessment_date: record.assessment_date_utc,
      issued_timestamp: record.issued_timestamp_utc,
      verified_at: new Date().toISOString(),
      verification_statement:
        "This record matches a RunPayway\u2122-issued Income Stability Assessment.",
    });
  } catch {
    return NextResponse.json({ valid_record: false }, { status: 500 });
  }
}
