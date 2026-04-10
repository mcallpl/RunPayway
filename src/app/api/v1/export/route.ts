// RUNPAYWAY™ — GET /api/v1/export
// Returns assessment data as downloadable JSON
// Called client-side with data from sessionStorage

import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    if (!body.record_id) {
      return NextResponse.json({ error: "No assessment data provided" }, { status: 400 });
    }

    // Clean the record for export — remove internal fields
    const exported = {
      export_version: "1.0",
      exported_at: new Date().toISOString(),
      platform: "RunPayway™",
      model_version: body.model_version || "RP-2.0",
      assessment: {
        record_id: body.record_id,
        assessment_title: body.assessment_title,
        assessment_date: body.assessment_date_utc,
        final_score: body.final_score,
        stability_band: body.stability_band,
        industry_sector: body.industry_sector,
        operating_structure: body.operating_structure,
        primary_income_model: body.primary_income_model,
      },
      income_structure: {
        active_income_pct: body.active_income_level,
        semi_persistent_income_pct: body.semi_persistent_income_level,
        persistent_income_pct: body.persistent_income_level,
        continuity_months: body.income_continuity_months,
      },
      risk_profile: {
        risk_scenario_score: body.risk_scenario_score,
        risk_scenario_drop: body.risk_scenario_drop,
      },
    };

    return NextResponse.json(exported);
  } catch {
    return NextResponse.json({ error: "Export failed" }, { status: 500 });
  }
}
