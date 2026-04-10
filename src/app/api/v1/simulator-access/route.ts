// RUNPAYWAY™ — POST /api/v1/simulator-access
// Verify record_id + authorization_code (or prefix) and return simulator-relevant data.
// Public endpoint — no API key required. Authorization via record credentials.

import { NextRequest, NextResponse } from "next/server";
import { createStorageBackend } from "@/lib/engine";

export const dynamic = "force-dynamic";
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { record_id, authorization_code } = body;

    if (
      !record_id ||
      typeof record_id !== "string" ||
      !/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(record_id)
    ) {
      return NextResponse.json({ error: "Invalid report code" }, { status: 400 });
    }

    if (
      !authorization_code ||
      typeof authorization_code !== "string" ||
      !/^[a-f0-9]{16,64}$/i.test(authorization_code)
    ) {
      return NextResponse.json({ error: "Invalid access code" }, { status: 400 });
    }

    const storage = createStorageBackend();
    const record = await storage.getRecord(record_id);

    if (!record) {
      return NextResponse.json({ error: "Code not recognized. Check your report and try again." }, { status: 404 });
    }

    // Verify authorization code — accept full match or prefix match (min 16 chars)
    const providedCode = authorization_code.toLowerCase();
    const storedCode = (record.authorization_code || "").toLowerCase();
    if (!storedCode.startsWith(providedCode)) {
      return NextResponse.json({ error: "Code not recognized. Check your report and try again." }, { status: 404 });
    }

    // Extract normalized inputs from v2 engine data
    const v2 = (record as Record<string, unknown>)._v2 as Record<string, unknown> | undefined;
    const ni = v2?.normalized_inputs as Record<string, unknown> | undefined;

    if (!ni) {
      return NextResponse.json({ error: "Record does not contain simulator data" }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      record_id: record.record_id,
      assessment_title: record.assessment_title || "",
      industry_sector: record.industry_sector || "",
      primary_income_model: record.primary_income_model || "",
      final_score: record.final_score,
      stability_band: record.stability_band,
      normalized_inputs: {
        income_persistence_pct: ni.income_persistence_pct,
        largest_source_pct: ni.largest_source_pct,
        source_diversity_count: ni.source_diversity_count,
        forward_secured_pct: ni.forward_secured_pct,
        income_variability_level: ni.income_variability_level,
        labor_dependence_pct: ni.labor_dependence_pct,
      },
      quality_score: (v2?.quality as Record<string, unknown>)?.quality_score ?? 5,
    });
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
