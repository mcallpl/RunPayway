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
    return NextResponse.json({
      record_id: record.record_id,
      authorization_code: record.authorization_code,
      model_version: record.model_version,
      assessment_date_utc: record.assessment_date_utc,
      issued_timestamp_utc: record.issued_timestamp_utc,
      final_score: record.final_score,
      stability_band: record.stability_band,
      assessment_title: record.assessment_title,
      classification: record.classification,
      operating_structure: record.operating_structure,
      primary_income_model: record.primary_income_model,
      revenue_structure: record.revenue_structure,
      industry_sector: record.industry_sector,
      recurring_income_proportion: record.recurring_income_proportion,
      income_concentration: record.income_concentration,
      number_of_income_sources: record.number_of_income_sources,
      forward_revenue_visibility: record.forward_revenue_visibility,
      earnings_variability: record.earnings_variability,
      income_continuity_without_active_labor:
        record.income_continuity_without_active_labor,
      band_interpretation_key: record.band_interpretation_key,
      band_interpretation_text: record.band_interpretation_text,
      primary_constraint_key: record.primary_constraint_key,
      primary_constraint_label: record.primary_constraint_label,
      primary_constraint_text: record.primary_constraint_text,
      driver_1_key: record.driver_1_key,
      driver_1_label: record.driver_1_label,
      driver_1_text: record.driver_1_text,
      driver_2_key: record.driver_2_key,
      driver_2_label: record.driver_2_label,
      driver_2_text: record.driver_2_text,
      driver_3_key: record.driver_3_key,
      driver_3_label: record.driver_3_label,
      driver_3_text: record.driver_3_text,
      structural_priority_key: record.structural_priority_key,
      structural_priority_label: record.structural_priority_label,
      structural_priority_text: record.structural_priority_text,
      ruleset_checksum: record.ruleset_checksum,
    });
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : "Internal server error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
