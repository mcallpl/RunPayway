// RUNPAYWAY™ — GET /api/v1/snapshot/[id]
// Retrieve issued record by record_id

export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import { createStorageBackend } from "@/lib/engine";
import { validateApiKey } from "@/lib/api-auth";
import { auditLog, getClientIp } from "@/lib/audit-log";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  // API key authentication
  if (!validateApiKey(request)) {
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401 }
    );
  }

  try {
    const { id } = await params;

    if (
      !id ||
      !/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
        id
      )
    ) {
      return NextResponse.json(
        { error: "Invalid record ID format" },
        { status: 400 }
      );
    }

    const storage = createStorageBackend();
    const record = await storage.getRecord(id);

    if (!record) {
      return NextResponse.json(
        { error: "Record not found" },
        { status: 404 }
      );
    }

    // Audit log: record accessed
    auditLog({
      action: "record_accessed",
      record_id: id,
      ip: getClientIp(request),
      timestamp: new Date().toISOString(),
    });

    // Return public fields only
    const r = record as any;
    return NextResponse.json({
      record_id: r.record_id,
      authorization_code: r.authorization_code,
      model_version: r.model_version,
      assessment_date_utc: r.assessment_date_utc,
      issued_timestamp_utc: r.issued_timestamp_utc,
      final_score: r.final_score,
      stability_band: r.stability_band,
      assessment_title: r.assessment_title,
      classification: r.classification,
      operating_structure: r.operating_structure,
      primary_income_model: r.primary_income_model,
      revenue_structure: r.revenue_structure,
      industry_sector: r.industry_sector,
      recurring_income_proportion: r.recurring_income_proportion,
      income_concentration: r.income_concentration,
      number_of_income_sources: r.number_of_income_sources,
      forward_revenue_visibility: r.forward_revenue_visibility,
      earnings_variability: r.earnings_variability,
      income_continuity_without_active_labor:
        r.income_continuity_without_active_labor,
      band_interpretation_key: r.band_interpretation_key,
      band_interpretation_text: r.band_interpretation_text,
      primary_constraint_key: r.primary_constraint_key,
      primary_constraint_label: r.primary_constraint_label,
      primary_constraint_text: r.primary_constraint_text,
      driver_1_key: r.driver_1_key,
      driver_1_label: r.driver_1_label,
      driver_1_text: r.driver_1_text,
      driver_2_key: r.driver_2_key,
      driver_2_label: r.driver_2_label,
      driver_2_text: r.driver_2_text,
      driver_3_key: r.driver_3_key,
      driver_3_label: r.driver_3_label,
      driver_3_text: r.driver_3_text,
      structural_priority_key: r.structural_priority_key,
      structural_priority_label: r.structural_priority_label,
      structural_priority_text: r.structural_priority_text,
      ruleset_checksum: r.ruleset_checksum,
    });
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : "Internal server error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
