// Engine 14 — Diagnostic Confidence
// Assesses quality and reliability of the diagnostic based on input patterns.

import type {
  CanonicalInput,
  ExtendedInputs,
  ResolvedProfile,
  SensitivityResult,
  ConfidenceResult,
  ConfidenceDeduction,
  ConfidenceLevel,
} from "../types";
import { CONFIDENCE_BASE, CONFIDENCE_LEVELS } from "../constants";

export function computeConfidence(
  n: CanonicalInput,
  ext: ExtendedInputs | null,
  profile: ResolvedProfile,
  sensitivity: SensitivityResult,
): ConfidenceResult {
  let score = CONFIDENCE_BASE;
  const deductions: ConfidenceDeduction[] = [];

  // Contradiction detection
  const contradictions = detectContradictions(n, profile);
  if (contradictions.length > 0) {
    score -= 20;
    deductions.push({
      reason: `Contradiction detected: ${contradictions[0]}`,
      points: -20,
    });
  }

  // Missing extended inputs
  if (!ext || Object.keys(ext).length === 0) {
    score -= 10;
    deductions.push({
      reason: "Extended quality inputs not provided",
      points: -10,
    });
  }

  // Profile mismatch
  if (profileMismatch(n, profile)) {
    score -= 10;
    deductions.push({
      reason: "Profile context may not align with diagnostic inputs",
      points: -10,
    });
  }

  // Scenario instability
  const maxLift = sensitivity.tests[0]?.lift ?? 0;
  if (maxLift >= 15) {
    score -= 10;
    deductions.push({
      reason: "Score is highly sensitive to small input changes",
      points: -10,
    });
  }

  // High ambiguity in quality inputs
  if (
    ext &&
    ext.cancellation_risk_level === undefined &&
    ext.platform_dependency_level === undefined
  ) {
    score -= 10;
    deductions.push({
      reason: "Key quality dimensions not assessed",
      points: -10,
    });
  }

  score = Math.max(0, Math.min(100, score));

  let confidence_level: ConfidenceLevel = "low";
  for (const [min, max, level] of CONFIDENCE_LEVELS) {
    if (score >= min && score <= max) {
      confidence_level = level;
      break;
    }
  }

  return { confidence_score: score, confidence_level, deductions };
}

function detectContradictions(
  n: CanonicalInput,
  profile: ResolvedProfile,
): string[] {
  const contradictions: string[] = [];

  if (n.income_persistence_pct >= 70 && n.labor_dependence_pct >= 80) {
    contradictions.push(
      "High recurring revenue reported alongside near-total labor dependence",
    );
  }

  if (
    profile.operating_structure === "asset_supported" &&
    n.labor_dependence_pct >= 80
  ) {
    contradictions.push(
      "Asset-supported structure selected but income is highly labor-dependent",
    );
  }

  if (n.source_diversity_count >= 5 && n.largest_source_pct >= 80) {
    contradictions.push(
      "Many income sources reported but single source dominates at 80%+",
    );
  }

  return contradictions;
}

function profileMismatch(
  n: CanonicalInput,
  profile: ResolvedProfile,
): boolean {
  if (
    profile.primary_income_model === "salary" &&
    n.source_diversity_count >= 5
  ) {
    return true;
  }
  if (profile.is_recurring_model && n.income_persistence_pct <= 10) {
    return true;
  }
  return false;
}
