/**
 * RunPayway™ Interpretation Agent v1.0
 *
 * Turns a structural score into clear diagnosis for advisors.
 * Deterministic — no AI calls. Instant. Free.
 *
 * Reads the AssessmentRecord and produces:
 * - score (number)
 * - band (StabilityBand)
 * - top_risk (display label)
 * - one_sentence_talking_point
 * - one_paragraph_meeting_prep
 */

import type { AssessmentRecord, ConstraintKey, StabilityBand } from "@/lib/engine/v2/types";
import type { InterpretationResult } from "@/lib/engine/v2/schemas/canonical-record";

export const INTERPRETATION_AGENT_VERSION = "1.0.0";

/* ── Constraint key → display label ── */
const CONSTRAINT_LABELS: Record<ConstraintKey, string> = {
  weak_forward_visibility: "Forward Visibility",
  high_labor_dependence: "Labor Dependence",
  high_concentration: "Income Concentration",
  low_persistence: "Low Persistence",
  high_variability: "Income Variability",
  weak_durability: "Source Diversity",
  shallow_continuity: "Source Diversity",
};

/* ── Industry-specific risk conversation starters ── */
function riskConversation(topRisk: string, industry: string): string {
  const formatted = industry.replace(/_/g, " ");
  const conversations: Record<string, string> = {
    "Forward Visibility": `In ${formatted}, short-term visibility makes planning difficult. Explore retainers, contracts, or pipeline indicators your client tracks.`,
    "Labor Dependence": `In ${formatted}, income tied to hours worked limits growth. Discuss recurring revenue or productized services that reduce personal labor risk.`,
    "Income Concentration": `In ${formatted}, heavy reliance on one or two sources creates fragility. Ask about diversifying revenue sources or adding a second revenue line.`,
    "Low Persistence": `In ${formatted}, project-based income restarts from zero. Ask what percentage of this year's income was already locked in on January 1.`,
    "Income Variability": `In ${formatted}, month-to-month swings complicate planning. Ask about smoothing strategies, reserves, or seasonal adjustments.`,
    "Source Diversity": `In ${formatted}, relying on a single income type creates risk. Explore complementary revenue streams your client could add.`,
  };
  return conversations[topRisk] || `Discuss how ${topRisk.toLowerCase()} affects your client's income structure in ${formatted}.`;
}

/* ── Build the one-paragraph meeting prep ── */
function buildMeetingPrep(
  record: AssessmentRecord,
  clientName: string,
  topRisk: string,
  industry: string,
): string {
  const score = record.scores.overall_score;
  const band = record.bands.primary_band;
  const fragility = record.fragility.fragility_class;

  // Why this score
  const whyScore = record.explainability?.why_this_score || `${clientName} scored ${score}, placing them in the ${band} range.`;

  // Biggest lift opportunity
  const lift = record.score_lift_projection?.highest_single_lift;
  const liftText = lift
    ? `The single biggest improvement opportunity is ${lift.label.toLowerCase()}, which could lift the score by ${lift.projected_score - lift.original_score} points.`
    : "";

  // Fragility warning
  const fragilityText = (fragility === "brittle" || fragility === "thin")
    ? ` Their structure is ${fragility} — a single disruption could cause significant income loss.`
    : "";

  // Risk conversation
  const riskText = riskConversation(topRisk, industry);

  return `${whyScore}${fragilityText} Their primary structural risk is ${topRisk}. ${riskText}${liftText ? ` ${liftText}` : ""}`;
}

/* ── Main function ── */
export function generateInterpretation(
  record: AssessmentRecord,
  clientName: string,
  industry: string,
): InterpretationResult {
  const score = record.scores.overall_score;
  const band = record.bands.primary_band;
  const topRiskKey = record.constraints.root_constraint || record.constraints.primary_constraint;
  const topRisk = CONSTRAINT_LABELS[topRiskKey] || "Income Concentration";

  // One-sentence talking point
  const oneSentence = record.explainability?.one_thing_that_matters
    || riskConversation(topRisk, industry);

  // One-paragraph meeting prep
  const oneParagraph = buildMeetingPrep(record, clientName, topRisk, industry);

  return {
    score,
    band,
    top_risk: topRisk,
    top_risk_key: topRiskKey,
    one_sentence_talking_point: oneSentence,
    one_paragraph_meeting_prep: oneParagraph,
  };
}
