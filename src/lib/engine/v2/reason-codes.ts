// ═══════════════════════════════════════════════════════════════
// RUNPAYWAY™ — Model RP-2.0 Reason Code Registry
// ═══════════════════════════════════════════════════════════════

import type { ReasonCode, ReasonCategory } from "./types";

export const REASON_CODES: Record<string, ReasonCode> = {
  // ─── Validation ─────────────────────────────────────────
  "VAL-001": { code: "VAL-001", category: "validation", severity: "critical", message: "Invalid diagnostic input format" },
  "VAL-002": { code: "VAL-002", category: "validation", severity: "critical", message: "Invalid profile context format" },
  "VAL-003": { code: "VAL-003", category: "validation", severity: "info", message: "Extended inputs not provided — using defaults" },
  "VAL-004": { code: "VAL-004", category: "validation", severity: "warning", message: "Extended input value out of expected range" },

  // ─── Context ────────────────────────────────────────────
  "CTX-001": { code: "CTX-001", category: "context", severity: "info", message: "Profile archetype resolved" },
  "CTX-002": { code: "CTX-002", category: "context", severity: "warning", message: "Profile mismatch detected between inputs and context" },

  // ─── Normalization ──────────────────────────────────────
  "NRM-001": { code: "NRM-001", category: "normalization", severity: "info", message: "Inputs normalized to canonical values" },

  // ─── Scoring ────────────────────────────────────────────
  "SCR-001": { code: "SCR-001", category: "scoring", severity: "info", message: "Raw scores computed" },
  "SCR-002": { code: "SCR-002", category: "scoring", severity: "info", message: "Quality adjustment applied to structure score" },
  "SCR-003": { code: "SCR-003", category: "scoring", severity: "info", message: "Interaction adjustments applied to overall score" },
  "SCR-004": { code: "SCR-004", category: "scoring", severity: "warning", message: "Overall score clamped to valid range" },

  // ─── Indicators ─────────────────────────────────────────
  "IND-001": { code: "IND-001", category: "indicators", severity: "info", message: "Structural indicators computed" },

  // ─── Interactions ───────────────────────────────────────
  "INT-001": { code: "INT-001", category: "interactions", severity: "info", message: "No interaction effects triggered" },
  "INT-002": { code: "INT-002", category: "interactions", severity: "warning", message: "Interaction penalties applied" },
  "INT-003": { code: "INT-003", category: "interactions", severity: "info", message: "Interaction bonuses applied" },
  "INT-004": { code: "INT-004", category: "interactions", severity: "warning", message: "Net interaction adjustment clamped to [-20, +8]" },

  // ─── Quality ────────────────────────────────────────────
  "QAL-001": { code: "QAL-001", category: "quality", severity: "info", message: "Quality score computed from extended inputs" },
  "QAL-002": { code: "QAL-002", category: "quality", severity: "info", message: "Quality defaulted — no extended inputs provided" },

  // ─── Constraints ────────────────────────────────────────
  "CON-001": { code: "CON-001", category: "constraints", severity: "info", message: "Constraint hierarchy computed" },
  "CON-002": { code: "CON-002", category: "constraints", severity: "info", message: "Hidden unlock constraint identified" },

  // ─── Fragility ──────────────────────────────────────────
  "FRG-001": { code: "FRG-001", category: "fragility", severity: "info", message: "Fragility score computed" },
  "FRG-002": { code: "FRG-002", category: "fragility", severity: "warning", message: "Fragility class is brittle" },
  "FRG-003": { code: "FRG-003", category: "fragility", severity: "warning", message: "Multiple failure modes detected" },

  // ─── Sensitivity ────────────────────────────────────────
  "SEN-001": { code: "SEN-001", category: "sensitivity", severity: "info", message: "Sensitivity tests completed" },
  "SEN-002": { code: "SEN-002", category: "sensitivity", severity: "warning", message: "Score is highly sensitive to small changes" },

  // ─── Scenarios ──────────────────────────────────────────
  "SCN-001": { code: "SCN-001", category: "scenarios", severity: "info", message: "Risk scenarios computed" },
  "SCN-002": { code: "SCN-002", category: "scenarios", severity: "warning", message: "Band shift detected in stress scenario" },

  // ─── Lift ───────────────────────────────────────────────
  "LFT-001": { code: "LFT-001", category: "lift", severity: "info", message: "Score lift projections computed" },
  "LFT-002": { code: "LFT-002", category: "lift", severity: "info", message: "Combined top two moves projected" },

  // ─── Confidence ─────────────────────────────────────────
  "CNF-001": { code: "CNF-001", category: "confidence", severity: "info", message: "Diagnostic confidence computed" },
  "CNF-002": { code: "CNF-002", category: "confidence", severity: "warning", message: "Contradiction detected in inputs" },
  "CNF-003": { code: "CNF-003", category: "confidence", severity: "warning", message: "Confidence level below moderate" },

  // ─── Explainability ─────────────────────────────────────
  "EXP-001": { code: "EXP-001", category: "explainability", severity: "info", message: "Explainability objects generated" },

  // ─── Actions ────────────────────────────────────────────
  "ACT-001": { code: "ACT-001", category: "actions", severity: "info", message: "Actions prioritized" },
  "ACT-002": { code: "ACT-002", category: "actions", severity: "info", message: "Sequencing constraints applied" },

  // ─── Reassessment ───────────────────────────────────────
  "RSA-001": { code: "RSA-001", category: "reassessment", severity: "info", message: "Reassessment triggers computed" },

  // ─── Benchmarking ───────────────────────────────────────
  "BNK-001": { code: "BNK-001", category: "benchmarking", severity: "info", message: "Benchmarks computed from sector data" },
  "BNK-002": { code: "BNK-002", category: "benchmarking", severity: "info", message: "Outlier dimensions identified" },

  // ─── Integrity ──────────────────────────────────────────
  "IGT-001": { code: "IGT-001", category: "integrity", severity: "info", message: "Integrity hashes computed" },
  "IGT-002": { code: "IGT-002", category: "integrity", severity: "critical", message: "Integrity verification failed" },
};
