/**
 * RunPayway™ Scoring Gatekeeper v1.0
 *
 * Enforces the wall between AI and the official standard.
 * Pure validation + deterministic scoring + stamping.
 * No AI. No subjective judgment.
 *
 * Responsibilities:
 * 1. Validate required fields
 * 2. Validate permitted answer values
 * 3. Run deterministic score logic (executeAssessment)
 * 4. Compute checksum (SHA-256)
 * 5. Issue immutable record ID
 * 6. Stamp model version
 * 7. Return CanonicalAdvisorRecord
 */

import type { RawDiagnosticInput, ProfileContext, AnswerChoice, AssessmentRecord } from "@/lib/engine/v2/types";
import type { CanonicalAdvisorRecord, InterpretationResult } from "@/lib/engine/v2/schemas/canonical-record";

export const GATEKEEPER_VERSION = "1.0.0";

const VALID_ANSWERS: AnswerChoice[] = ["A", "B", "C", "D", "E"];

const REQUIRED_Q_FIELDS: (keyof RawDiagnosticInput)[] = [
  "q1_recurring_revenue_base",
  "q2_income_concentration",
  "q3_income_source_diversity",
  "q4_forward_revenue_visibility",
  "q5_earnings_variability",
  "q6_income_continuity_without_labor",
];

const REQUIRED_PROFILE_FIELDS: (keyof ProfileContext)[] = [
  "profile_class",
  "operating_structure",
  "primary_income_model",
  "revenue_structure",
  "industry_sector",
  "maturity_stage",
];

/* ── Result type ── */
export interface GatekeeperResult {
  valid: boolean;
  errors: string[];
  warnings: string[];
  record: CanonicalAdvisorRecord | null;
}

/* ── SHA-256 checksum (works in browser + Workers via Web Crypto) ── */
async function computeChecksum(normalizedInputs: unknown, scores: unknown): Promise<string> {
  const data = JSON.stringify(normalizedInputs) + JSON.stringify(scores);
  const encoder = new TextEncoder();
  const buffer = await crypto.subtle.digest("SHA-256", encoder.encode(data));
  return Array.from(new Uint8Array(buffer)).map(b => b.toString(16).padStart(2, "0")).join("");
}

/* ── Generate record ID ── */
function generateRecordId(): string {
  return "REC-" + crypto.randomUUID();
}

/* ── Run the gatekeeper ── */
export async function runGatekeeper(input: {
  advisorCode: string;
  clientId: string;
  clientName: string;
  profile: ProfileContext;
  rawInputs: RawDiagnosticInput;
  interpretation: InterpretationResult;
  intakeAgentVersion: string;
  interpretationAgentVersion: string;
}): Promise<GatekeeperResult> {
  const errors: string[] = [];
  const warnings: string[] = [];

  // ── 1. Validate required profile fields ──
  for (const field of REQUIRED_PROFILE_FIELDS) {
    if (!input.profile[field]) {
      errors.push(`Missing required profile field: ${field}`);
    }
  }

  // ── 2. Validate required answer fields ──
  for (const field of REQUIRED_Q_FIELDS) {
    const val = input.rawInputs[field];
    if (!val) {
      errors.push(`Missing required answer: ${field}`);
    } else if (!VALID_ANSWERS.includes(val)) {
      errors.push(`Invalid answer value for ${field}: ${val}. Must be A-E.`);
    }
  }

  if (errors.length > 0) {
    return { valid: false, errors, warnings, record: null };
  }

  // ── 3. Run deterministic scoring engine ──
  let assessment: AssessmentRecord;
  try {
    const { executeAssessment } = await import("@/lib/engine/v2/index");
    assessment = executeAssessment({
      rawInputs: input.rawInputs,
      profile: input.profile,
    });
  } catch (err) {
    return {
      valid: false,
      errors: [`Scoring engine failed: ${err instanceof Error ? err.message : String(err)}`],
      warnings,
      record: null,
    };
  }

  // ── 4. Compute checksum ──
  const checksum = await computeChecksum(
    assessment.normalized_inputs,
    assessment.scores,
  );

  // ── 5. Issue record ID ──
  const recordId = generateRecordId();

  // ── 6. Stamp and assemble ──
  const record: CanonicalAdvisorRecord = {
    record_id: recordId,
    advisor_code: input.advisorCode,
    client_id: input.clientId,
    client_name: input.clientName,

    industry_sector: input.profile.industry_sector,
    profile: input.profile,
    raw_inputs: input.rawInputs,

    assessment,
    interpretation: input.interpretation,

    intake_agent_version: input.intakeAgentVersion,
    gatekeeper_version: GATEKEEPER_VERSION,
    interpretation_agent_version: input.interpretationAgentVersion,

    checksum,
    model_version: assessment.model_manifest?.model_version || "RP-2.0",
    created_at: new Date().toISOString(),
  };

  return { valid: true, errors: [], warnings, record };
}
