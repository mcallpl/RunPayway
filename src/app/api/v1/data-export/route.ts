// RUNPAYWAY™ — POST /api/v1/data-export
// GDPR Article 15 — Right of Access / Data Portability
// Returns the full record as downloadable JSON upon valid authorization

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

    // Validate record_id format
    if (
      !record_id ||
      typeof record_id !== "string" ||
      !/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
        record_id
      )
    ) {
      return NextResponse.json(
        { error: "Invalid record ID format" },
        { status: 400 }
      );
    }

    // Validate authorization_code format
    if (
      !authorization_code ||
      typeof authorization_code !== "string" ||
      !/^[a-f0-9]{64}$/.test(authorization_code)
    ) {
      return NextResponse.json(
        { error: "Invalid authorization code format" },
        { status: 400 }
      );
    }

    // Verify the record exists and the authorization code matches
    const storage = createStorageBackend();
    const record = await storage.verifyRecord(record_id, authorization_code);

    if (!record) {
      return NextResponse.json(
        { error: "Record not found or authorization code invalid" },
        { status: 404 }
      );
    }

    // Audit log: data export
    auditLog({
      action: "data_export",
      record_id,
      ip: getClientIp(request),
      timestamp: new Date().toISOString(),
      metadata: {
        export_type: "gdpr_article_15",
      },
    });

    // Build the portable data export (exclude internal engine snapshot for clarity)
    const exportData = {
      _export_metadata: {
        exported_at: new Date().toISOString(),
        export_type: "GDPR Article 15 — Right of Access",
        model_version: record.model_version,
        record_id: record.record_id,
      },
      record_identity: {
        record_id: record.record_id,
        authorization_code: record.authorization_code,
        assessment_date_utc: record.assessment_date_utc,
        issued_timestamp_utc: record.issued_timestamp_utc,
        model_version: record.model_version,
        ruleset_checksum: record.ruleset_checksum,
      },
      profile: {
        assessment_title: record.assessment_title,
        classification: record.classification,
        operating_structure: record.operating_structure,
        primary_income_model: record.primary_income_model,
        revenue_structure: record.revenue_structure,
        industry_sector: record.industry_sector,
        recipient_email: record.recipient_email,
      },
      inputs: {
        recurring_income_proportion: record.recurring_income_proportion,
        income_concentration: record.income_concentration,
        number_of_income_sources: record.number_of_income_sources,
        forward_revenue_visibility: record.forward_revenue_visibility,
        earnings_variability: record.earnings_variability,
        income_continuity_without_active_labor:
          record.income_continuity_without_active_labor,
      },
      scoring: {
        final_score: record.final_score,
        stability_band: record.stability_band,
        structure_score: record.structure_score,
        stability_score: record.stability_score,
      },
      interpretation: {
        band_interpretation_key: record.band_interpretation_key,
        band_interpretation_text: record.band_interpretation_text,
        primary_constraint_key: record.primary_constraint_key,
        primary_constraint_label: record.primary_constraint_label,
        primary_constraint_text: record.primary_constraint_text,
      },
      registry: {
        registry_status: record.registry_status,
        registry_visibility: record.registry_visibility,
        verification_status: record.verification_status,
      },
    };

    // Return as downloadable JSON
    return new NextResponse(JSON.stringify(exportData, null, 2), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        "Content-Disposition": `attachment; filename="runpayway-export-${record_id}.json"`,
      },
    });
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : "Internal server error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
