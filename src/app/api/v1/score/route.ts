// RUNPAYWAY™ — POST /api/v1/score
// Execute income stability engine and return issued record

import { NextRequest, NextResponse } from "next/server";
import { executeIncomeStabilityEngine } from "@/lib/engine";
import { validateApiKey } from "@/lib/api-auth";
import { verifyPaymentToken } from "@/lib/payment-token";
import { auditLog, getClientIp } from "@/lib/audit-log";

function isAuthorized(request: NextRequest, body: Record<string, unknown>): boolean {
  // Method 1: API key (external integrations)
  if (validateApiKey(request)) return true;

  // Method 2: Payment token (frontend after checkout)
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

  // Authenticate via API key or payment token
  if (!isAuthorized(request, body)) {
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401 },
    );
  }

  try {
    const submission = {
      profile: body.profile,
      inputs: body.inputs,
    };

    const record = await executeIncomeStabilityEngine(submission);

    // Audit log: record created
    auditLog({
      action: "record_created",
      record_id: record.record_id,
      ip: getClientIp(request),
      timestamp: new Date().toISOString(),
      metadata: {
        model_version: record.model_version,
        stability_band: record.stability_band,
      },
    });

    // Return public fields only (excludes internal hashes, engine snapshot, etc.)
    return NextResponse.json({
      // Record identity
      record_id: record.record_id,
      authorization_code: record.authorization_code,
      model_version: record.model_version,
      assessment_date_utc: record.assessment_date_utc,
      issued_timestamp_utc: record.issued_timestamp_utc,
      // Profile
      assessment_title: record.assessment_title,
      classification: record.classification,
      operating_structure: record.operating_structure,
      primary_income_model: record.primary_income_model,
      revenue_structure: record.revenue_structure,
      industry_sector: record.industry_sector,
      // Score
      final_score: record.final_score,
      stability_band: record.stability_band,
      // Inputs (for report rendering)
      recurring_income_proportion: record.recurring_income_proportion,
      income_concentration: record.income_concentration,
      number_of_income_sources: record.number_of_income_sources,
      forward_revenue_visibility: record.forward_revenue_visibility,
      earnings_variability: record.earnings_variability,
      income_continuity_without_active_labor:
        record.income_continuity_without_active_labor,
      // Interpretation
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
      // Page insights
      page_1_key_insight_text: record.page_1_key_insight_text,
      page_2_key_insight_text: record.page_2_key_insight_text,
      page_3_key_insight_text: record.page_3_key_insight_text,
      page_4_key_insight_text: record.page_4_key_insight_text,
      page_5_key_insight_text: record.page_5_key_insight_text,
      page_6_key_insight_text: record.page_6_key_insight_text,
      // Labor-Asset
      labor_asset_position_key: record.labor_asset_position_key,
      labor_asset_position_label: record.labor_asset_position_label,
      labor_asset_framework_text: record.labor_asset_framework_text,
      labor_asset_marker_position: record.labor_asset_marker_position,
      // Structural Income Map
      active_income_level: record.active_income_level,
      semi_persistent_income_level: record.semi_persistent_income_level,
      persistent_income_level: record.persistent_income_level,
      // Structural Indicators
      income_persistence_label: record.income_persistence_label,
      income_source_diversity_label: record.income_source_diversity_label,
      forward_revenue_visibility_label: record.forward_revenue_visibility_label,
      income_variability_label: record.income_variability_label,
      active_labor_dependence_label: record.active_labor_dependence_label,
      exposure_concentration_label: record.exposure_concentration_label,
      // Stability spectrum
      stability_spectrum_position: record.stability_spectrum_position,
      // Peer benchmark
      peer_benchmark_group_key: record.peer_benchmark_group_key,
      peer_benchmark_group_label: record.peer_benchmark_group_label,
      peer_benchmark_text: record.peer_benchmark_text,
      peer_distribution_payload: record.peer_distribution_payload,
      peer_position_marker: record.peer_position_marker,
      // Evolution path
      evolution_path_key: record.evolution_path_key,
      evolution_path_title: record.evolution_path_title,
      evolution_path_steps_payload: record.evolution_path_steps_payload,
      current_evolution_stage_key: record.current_evolution_stage_key,
      current_evolution_stage_label: record.current_evolution_stage_label,
      current_evolution_stage_position: record.current_evolution_stage_position,
      sector_mechanisms_payload: record.sector_mechanisms_payload,
      structural_improvement_path_text:
        record.structural_improvement_path_text,
      // Sector benchmarks
      sector_avg_score: record.sector_avg_score,
      sector_top_20_threshold: record.sector_top_20_threshold,
      constraint_guidance_payload: record.constraint_guidance_payload,
      action_plan_payload: record.action_plan_payload,
      // Peer percentile
      peer_stability_percentile: record.peer_stability_percentile,
      peer_stability_percentile_label: record.peer_stability_percentile_label,
      // Stability trajectory
      projected_final_score: record.projected_final_score,
      projected_stability_band: record.projected_stability_band,
      projected_structure_score: record.projected_structure_score,
      projected_stability_score: record.projected_stability_score,
      trajectory_constraint_key: record.trajectory_constraint_key,
      // Income continuity estimate
      income_continuity_pct: record.income_continuity_pct,
      income_continuity_months: record.income_continuity_months,
      income_continuity_text: record.income_continuity_text,
      // Risk scenario
      risk_scenario_score: record.risk_scenario_score,
      risk_scenario_band: record.risk_scenario_band,
      risk_scenario_drop: record.risk_scenario_drop,
      risk_scenario_text: record.risk_scenario_text,
      // Advisor tools
      advisor_discussion_guide_payload: record.advisor_discussion_guide_payload,
      product_recommendations_payload: record.product_recommendations_payload,
      // Registry
      registry_visibility: record.registry_visibility,
    });
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : "Internal server error";
    const status = message.includes("Validation") ? 400 : 500;
    return NextResponse.json({ error: message }, { status });
  }
}
