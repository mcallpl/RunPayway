/**
 * RunPayway™ Canonical Advisor Record
 *
 * The single schema that all agents read from and write to.
 * This is the contract between layers. If this is right,
 * everything else can be swapped, upgraded, or replaced independently.
 */

import type {
  AssessmentRecord,
  RawDiagnosticInput,
  ProfileContext,
  IndustrySector,
  StabilityBand,
  ConstraintKey,
} from "../types";

/* ── Interpretation result (produced by the Interpretation Agent) ── */
export interface InterpretationResult {
  score: number;
  band: StabilityBand;
  top_risk: string;                   // Display label (e.g., "Forward Visibility")
  top_risk_key: ConstraintKey;        // Engine key (e.g., "weak_forward_visibility")
  one_sentence_talking_point: string;
  one_paragraph_meeting_prep: string;
}

/* ── The canonical record ── */
export interface CanonicalAdvisorRecord {
  // Identity
  record_id: string;                  // "REC-" + UUID, immutable once issued
  advisor_code: string;
  client_id: string;
  client_name: string;

  // Intake
  industry_sector: IndustrySector;
  profile: ProfileContext;
  raw_inputs: RawDiagnosticInput;

  // Engine output (the full deterministic assessment)
  assessment: AssessmentRecord;

  // Interpretation (advisor-facing summary)
  interpretation: InterpretationResult;

  // Agent stamps
  intake_agent_version: string;
  gatekeeper_version: string;
  interpretation_agent_version: string;

  // Integrity
  checksum: string;                   // SHA-256 hex of normalized_inputs + scores
  model_version: string;              // "RP-2.0"
  created_at: string;
}
