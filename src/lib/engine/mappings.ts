// RUNPAYWAY™ Income Stability Score™ Refined Diagnostic System
// Model RP-1.0 | Version 1.0 — Deterministic Mapping Logic

import type { DiagnosticInput, ProfileContext, StabilityBand } from "./types";

// ============================================================
// STRUCTURAL INDICATORS
// ============================================================

type IndicatorLevel = "Very Low" | "Low" | "Moderate" | "High" | "Very High";

function mapValueToLevel(value: number): IndicatorLevel {
  if (value <= 10) return "Very Low";
  if (value <= 30) return "Low";
  if (value <= 55) return "Moderate";
  if (value <= 80) return "High";
  return "Very High";
}

export interface StructuralIndicators {
  income_persistence_label: string;
  income_source_diversity_label: string;
  forward_revenue_visibility_label: string;
  income_variability_label: string;
  active_labor_dependence_label: string;
  exposure_concentration_label: string;
}

export function computeStructuralIndicators(
  inputs: DiagnosticInput
): StructuralIndicators {
  // Income Persistence: derived from income_continuity_without_active_labor
  const income_persistence_label = mapValueToLevel(
    inputs.income_continuity_without_active_labor
  );

  // Income Source Diversity: derived from number_of_income_sources
  const income_source_diversity_label = mapValueToLevel(
    inputs.number_of_income_sources
  );

  // Forward Revenue Visibility: derived from forward_revenue_visibility
  const forward_revenue_visibility_label = mapValueToLevel(
    inputs.forward_revenue_visibility
  );

  // Income Variability: inverted — high earnings_variability score means LOW variability
  const income_variability_label = mapValueToLevel(
    100 - inputs.earnings_variability
  );

  // Active Labor Dependence: inverted — high continuity means LOW dependence
  const active_labor_dependence_label = mapValueToLevel(
    100 - inputs.income_continuity_without_active_labor
  );

  // Exposure Concentration: inverted — high income_concentration score means LOW concentration
  const exposure_concentration_label = mapValueToLevel(
    100 - inputs.income_concentration
  );

  return {
    income_persistence_label,
    income_source_diversity_label,
    forward_revenue_visibility_label,
    income_variability_label,
    active_labor_dependence_label,
    exposure_concentration_label,
  };
}

// ============================================================
// LABOR–ASSET POSITION
// ============================================================

export type LaborAssetKey =
  | "labor_dependent"
  | "labor_primary"
  | "transitional"
  | "asset_emerging"
  | "asset_supported";

export interface LaborAssetResult {
  labor_asset_position_key: LaborAssetKey;
  labor_asset_position_label: string;
  labor_asset_framework_text: string;
  labor_asset_marker_position: number; // 0-100 on spectrum
}

const LABOR_ASSET_LABELS: Record<LaborAssetKey, string> = {
  labor_dependent: "Labor-Dependent",
  labor_primary: "Labor-Primary",
  transitional: "Transitional",
  asset_emerging: "Asset-Emerging",
  asset_supported: "Asset-Supported",
};

const LABOR_ASSET_TEXTS: Record<LaborAssetKey, string> = {
  labor_dependent:
    "Income is primarily generated through active labor with minimal asset-derived or recurring revenue. Income continuity depends on sustained personal activity.",
  labor_primary:
    "Income relies primarily on active labor, with limited recurring or asset-derived components beginning to emerge.",
  transitional:
    "Income reflects a mix of active labor and emerging recurring or asset-derived components. The income system is transitioning toward greater structural persistence.",
  asset_emerging:
    "Income includes meaningful recurring or asset-derived components alongside active work. Structural persistence is emerging as a material contributor to income continuity.",
  asset_supported:
    "Income is materially supported by asset-derived, recurring, or contractually persistent revenue sources. Income continuity extends beyond immediate active labor.",
};

const LABOR_ASSET_POSITIONS: Record<LaborAssetKey, number> = {
  labor_dependent: 10,
  labor_primary: 30,
  transitional: 50,
  asset_emerging: 70,
  asset_supported: 90,
};

export function computeLaborAssetPosition(
  inputs: DiagnosticInput,
  profile: ProfileContext
): LaborAssetResult {
  // Composite score from recurring income and continuity
  const recurringScore = inputs.recurring_income_proportion;
  const continuityScore = inputs.income_continuity_without_active_labor;

  // Weight: 50/50 between recurring and continuity
  const composite = Math.floor((recurringScore + continuityScore) / 2);

  // Adjust based on income model and revenue structure
  let adjustment = 0;
  const assetModels = ["Asset-Based", "Investment / Dividend Income", "Real Estate Rental Income", "Licensing / Royalty Income"];
  const assetRevenues = ["Asset-Derived Revenue", "Long-Term Recurring Income"];
  const recurringRevenues = ["Recurring Revenue", "Monthly Recurring Payments", "Contracted Multi-Month Revenue"];
  const salaryModels = ["Salary-Based", "Employee Salary"];
  const activeRevenues = ["Primarily Active", "Mostly One-Time Payments"];

  if (
    assetModels.includes(profile.primary_income_model) ||
    assetRevenues.includes(profile.revenue_structure)
  ) {
    adjustment = 10;
  } else if (
    recurringRevenues.includes(profile.revenue_structure)
  ) {
    adjustment = 5;
  } else if (
    salaryModels.includes(profile.primary_income_model) &&
    activeRevenues.includes(profile.revenue_structure)
  ) {
    adjustment = -5;
  }

  const adjusted = Math.max(0, Math.min(100, composite + adjustment));

  let key: LaborAssetKey;
  if (adjusted <= 15) key = "labor_dependent";
  else if (adjusted <= 35) key = "labor_primary";
  else if (adjusted <= 55) key = "transitional";
  else if (adjusted <= 75) key = "asset_emerging";
  else key = "asset_supported";

  return {
    labor_asset_position_key: key,
    labor_asset_position_label: LABOR_ASSET_LABELS[key],
    labor_asset_framework_text: LABOR_ASSET_TEXTS[key],
    labor_asset_marker_position: LABOR_ASSET_POSITIONS[key],
  };
}

// ============================================================
// STRUCTURAL INCOME MAP
// ============================================================

export interface StructuralIncomeMap {
  active_income_level: number;
  semi_persistent_income_level: number;
  persistent_income_level: number;
}

export function computeStructuralIncomeMap(
  inputs: DiagnosticInput
): StructuralIncomeMap {
  // Persistent: income that continues without active labor
  const rawPersistent = inputs.income_continuity_without_active_labor;

  // Semi-Persistent: recurring income that still requires some involvement
  // Derived from recurring revenue and forward visibility, capped so total
  // never exceeds 100%
  const rawSemi = Math.floor(
    (inputs.recurring_income_proportion +
      inputs.forward_revenue_visibility) /
      2
  );
  const cappedSemi = Math.min(rawSemi, 100 - rawPersistent);

  // Active: remainder — income that depends entirely on active work
  const rawActive = 100 - cappedSemi - rawPersistent;

  return {
    active_income_level: Math.max(0, rawActive),
    semi_persistent_income_level: Math.max(0, cappedSemi),
    persistent_income_level: Math.max(0, rawPersistent),
  };
}

// ============================================================
// STABILITY SPECTRUM POSITION
// ============================================================

export function computeStabilitySpectrumPosition(
  finalScore: number
): number {
  // Direct mapping: score 0-100 → position 0-100 on spectrum
  return finalScore;
}

// ============================================================
// PEER BENCHMARK POSITION
// ============================================================

export function computePeerPositionMarker(band: StabilityBand): number {
  switch (band) {
    case "Limited Stability":
      return 1;
    case "Developing Stability":
      return 2;
    case "Established Stability":
      return 3;
    case "High Stability":
      return 4;
  }
}

// ============================================================
// EVOLUTION STAGE SELECTION
// ============================================================

export function selectCurrentEvolutionStage(
  steps: string[],
  profile: ProfileContext,
  inputs: DiagnosticInput,
  finalScore: number
): { key: string; label: string; position: number } {
  // Determine stage based on income model, revenue structure, score, and continuity
  const continuity = inputs.income_continuity_without_active_labor;

  let stageIndex: number;

  if (finalScore <= 20 && continuity <= 25) {
    stageIndex = 0;
  } else if (finalScore <= 39) {
    stageIndex = 1;
  } else if (finalScore <= 59) {
    stageIndex = 2;
  } else if (finalScore <= 79) {
    // Check if revenue structure suggests higher stage
    if (
      ["Recurring Revenue", "Monthly Recurring Payments", "Contracted Multi-Month Revenue", "Long-Term Recurring Income"].includes(profile.revenue_structure) ||
      ["Asset-Derived Revenue"].includes(profile.revenue_structure)
    ) {
      stageIndex = 3;
    } else {
      stageIndex = 2;
    }
  } else {
    // High stability
    if (continuity >= 75) {
      stageIndex = 4;
    } else {
      stageIndex = 3;
    }
  }

  // Clamp to available steps
  stageIndex = Math.min(stageIndex, steps.length - 1);

  const label = steps[stageIndex];
  const key = label
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_|_$/g, "");

  // Position: 0-based index mapped to percentage
  const position =
    steps.length > 1
      ? Math.floor((stageIndex / (steps.length - 1)) * 100)
      : 50;

  return { key, label, position };
}

// ============================================================
// INCOME CONTINUITY ESTIMATE
// ============================================================

export interface IncomeContinuityEstimate {
  income_continuity_pct: number;
  income_continuity_months: number;
  income_continuity_text: string;
}

export function computeIncomeContinuityEstimate(
  inputs: DiagnosticInput,
  profile: ProfileContext
): IncomeContinuityEstimate {
  // Persistent income percentage (what continues without active work)
  const persistentPct = inputs.income_continuity_without_active_labor;

  // Recurring revenue contributes semi-persistent continuity
  const recurringContribution = Math.floor(inputs.recurring_income_proportion * 0.5);

  // Forward visibility extends the duration
  const visibilityMonths = Math.floor(inputs.forward_revenue_visibility / 25) * 3; // 0→0, 25→3, 50→6, 75→9, 100→12

  // Total continuity percentage
  const totalPct = Math.min(100, persistentPct + recurringContribution);

  // Estimated months of meaningful continuity
  // Base: persistent income sustains indefinitely, recurring sustains for contract duration
  let months: number;
  if (totalPct >= 80) months = 12;
  else if (totalPct >= 60) months = Math.max(6, visibilityMonths);
  else if (totalPct >= 40) months = Math.max(3, Math.floor(visibilityMonths * 0.7));
  else if (totalPct >= 20) months = Math.max(1, Math.floor(visibilityMonths * 0.4));
  else months = 0;

  // Adjust for asset-based models
  const assetModels = ["Asset-Based", "Investment / Dividend Income", "Real Estate Rental Income", "Licensing / Royalty Income"];
  if (assetModels.includes(profile.primary_income_model)) {
    months = Math.min(12, months + 3);
  }

  const name = profile.assessment_title || "this income system";
  let text: string;
  if (totalPct >= 75) {
    text = `If active work stopped today, approximately ${totalPct}% of ${name}'s income would continue for an estimated ${months}+ months. This reflects strong structural persistence with meaningful recurring and asset-derived revenue.`;
  } else if (totalPct >= 50) {
    text = `If active work stopped today, approximately ${totalPct}% of ${name}'s income would continue for an estimated ${months} months. Semi-persistent arrangements and recurring revenue provide moderate continuity, though a significant portion still depends on active effort.`;
  } else if (totalPct >= 25) {
    text = `If active work stopped today, approximately ${totalPct}% of ${name}'s income would continue for an estimated ${months} month${months === 1 ? "" : "s"}. The majority of income requires ongoing active work to sustain.`;
  } else {
    text = `If active work stopped today, most of ${name}'s income would cease within weeks. Approximately ${totalPct}% may continue briefly through existing commitments, but the income system is primarily labor-dependent.`;
  }

  return {
    income_continuity_pct: totalPct,
    income_continuity_months: months,
    income_continuity_text: text,
  };
}

// ============================================================
// RISK SCENARIO ANALYSIS
// ============================================================

export interface RiskScenarioResult {
  risk_scenario_score: number;
  risk_scenario_band: string;
  risk_scenario_drop: number;
  risk_scenario_text: string;
}

function assignBandFromScore(score: number): string {
  if (score >= 80) return "High Stability";
  if (score >= 60) return "Established Stability";
  if (score >= 40) return "Developing Stability";
  return "Limited Stability";
}

export function computeRiskScenario(
  inputs: DiagnosticInput,
  finalScore: number,
  profile: ProfileContext
): RiskScenarioResult {
  // Simulate losing the largest income source
  // The concentration score tells us how dependent on one source
  // Low concentration (high score) = losing one source has less impact
  // High concentration (low score) = losing one source is devastating

  const concentrationRaw = inputs.income_concentration; // 0=high concentration, 100=well diversified
  const sourceCount = inputs.number_of_income_sources; // 0=1 source, 100=many

  // Impact: inverse of diversification — more concentrated = bigger drop
  const impactPct = Math.max(5, Math.floor((100 - concentrationRaw) * 0.45));
  const sourceDrop = Math.max(3, Math.floor((100 - sourceCount) * 0.2));
  const totalDrop = Math.min(40, impactPct + sourceDrop);

  const scenarioScore = Math.max(0, finalScore - totalDrop);
  const scenarioBand = assignBandFromScore(scenarioScore);

  const name = profile.assessment_title || "this income system";
  const bandChanged = scenarioBand !== assignBandFromScore(finalScore);

  let text: string;
  if (totalDrop <= 8) {
    text = `If ${name}'s largest income source were lost, the score would decline by approximately ${totalDrop} points to ${scenarioScore}. The diversified income structure provides meaningful resilience against single-source disruption.`;
  } else if (totalDrop <= 18) {
    text = `If ${name}'s largest income source were lost, the score would decline by approximately ${totalDrop} points to ${scenarioScore}. ${bandChanged ? `This would shift the classification from ${assignBandFromScore(finalScore)} to ${scenarioBand}. ` : ""}Moderate source concentration creates meaningful exposure to single-client risk.`;
  } else {
    text = `If ${name}'s largest income source were lost, the score would decline significantly — by approximately ${totalDrop} points to ${scenarioScore}${bandChanged ? `, moving from ${assignBandFromScore(finalScore)} to ${scenarioBand}` : ""}. High concentration on a single source creates substantial structural vulnerability.`;
  }

  return {
    risk_scenario_score: scenarioScore,
    risk_scenario_band: scenarioBand,
    risk_scenario_drop: totalDrop,
    risk_scenario_text: text,
  };
}

// ============================================================
// ADVISOR DISCUSSION GUIDE
// ============================================================

export interface AdvisorDiscussionGuide {
  talking_points: string[];
  client_questions: string[];
  red_flags: string[];
  next_steps: string[];
}

export function generateAdvisorDiscussionGuide(
  inputs: DiagnosticInput,
  finalScore: number,
  band: StabilityBand,
  constraintLabel: string,
  industrySector: string,
  continuityPct: number,
  riskDrop: number,
): AdvisorDiscussionGuide {
  const talking_points: string[] = [];
  const client_questions: string[] = [];
  const red_flags: string[] = [];
  const next_steps: string[] = [];

  // Talking points — score-tier specific (observational, not prescriptive)
  if (finalScore >= 80) {
    talking_points.push(`This score places the client in the top tier of income stability within ${industrySector}. The structural foundations — multiple income sources, meaningful persistence, and diversification — are well-developed.`);
    talking_points.push("The assessment measures structural resilience, not total earnings or financial health. This score reflects a durable income system.");
    talking_points.push("At this structural level, the income base may be well-positioned for the client to explore growth opportunities with their qualified advisor.");
  } else if (finalScore >= 60) {
    talking_points.push(`The client has built meaningful stability (${finalScore}/100), though specific structural characteristics — particularly ${constraintLabel} — distinguish this profile from top-tier systems.`);
    talking_points.push(`Approximately ${continuityPct}% of income would continue without active work. This reflects the current balance between active and persistent revenue.`);
    talking_points.push("The structural observations in this report identify areas where the income system differs most from higher-scoring profiles.");
  } else if (finalScore >= 40) {
    talking_points.push(`The score of ${finalScore} reflects a developing income structure. The system still depends heavily on active effort for most revenue, which is common at this stage.`);
    talking_points.push(`The primary structural characteristic — ${constraintLabel} — is the factor that most differentiates this profile from higher-scoring systems.`);
    talking_points.push("The score measures structural resilience, not income level or professional success. Structural evolution is typically incremental.");
  } else {
    talking_points.push(`A score of ${finalScore} reflects early-stage income structure. The income is primarily labor-dependent, which is common in ${industrySector}.`);
    talking_points.push("This is not a criticism of earnings or success — the score measures structural resilience, not income level. High earners can have low stability scores.");
    talking_points.push("Income systems at this structural stage tend to show the most measurable change from even modest shifts in how revenue is structured.");
  }

  // Exploration questions — for the client's own reflection
  if (inputs.income_continuity_without_active_labor <= 25) {
    client_questions.push("If you couldn't work for 90 days, what percentage of your current income would continue arriving?");
    client_questions.push("Are any of the services you provide structured as recurring or subscription-based arrangements?");
  }
  if (inputs.recurring_income_proportion <= 25) {
    client_questions.push("What percentage of this month's revenue was already committed before the month started?");
    client_questions.push("Do any of your current client relationships involve retainer or recurring payment structures?");
  }
  if (inputs.income_concentration <= 25) {
    client_questions.push("What would happen to your income if your largest single client or contract ended tomorrow?");
    client_questions.push("How many clients or sources would you need to lose before income dropped more than 30%?");
  }
  if (inputs.forward_revenue_visibility <= 25) {
    client_questions.push("How many months of revenue do you have contractually committed or reasonably certain?");
    client_questions.push("What is the typical length of your client contracts or engagement agreements?");
  }
  if (inputs.number_of_income_sources <= 25) {
    client_questions.push("How many independent sources contribute at least 10% of your total income?");
    client_questions.push("Are there additional revenue streams you have considered exploring?");
  }
  if (inputs.earnings_variability <= 25) {
    client_questions.push("How much does your monthly income vary — what's the difference between your best and worst months?");
    client_questions.push("Are any of your current fee arrangements based on variable rather than fixed pricing?");
  }
  // Ensure at least 3 questions
  if (client_questions.length < 3) {
    client_questions.push("What aspect of your income structure do you feel most uncertain about over the next 12 months?");
    client_questions.push("How would bringing on a partner or additional team members affect your current income structure?");
  }

  // Structural observations — notable characteristics (not directives)
  if (riskDrop > 20) {
    red_flags.push(`High concentration observed: losing the largest income source would reduce the score by ${riskDrop} points. This reflects significant single-source dependence.`);
  }
  if (continuityPct < 20) {
    red_flags.push("Less than 20% of income continues without active work. This indicates a high degree of labor dependence in the current income structure.");
  }
  if (inputs.forward_revenue_visibility <= 25 && inputs.recurring_income_proportion <= 25) {
    red_flags.push("Both forward visibility and recurring revenue are low — the income structure essentially resets each month. This combination amplifies structural uncertainty.");
  }
  if (finalScore < 40 && band === "Limited Stability") {
    red_flags.push("Limited Stability classification reflects an income structure in the early stages of structural development. This is common in labor-intensive sectors.");
  }

  // Possible follow-up topics
  next_steps.push("Review the structural observations in this report to identify which characteristics are most relevant to the client's goals.");
  next_steps.push(`A follow-up assessment in ${finalScore >= 60 ? "6" : "3"} months could measure whether structural characteristics have changed.`);
  if (riskDrop > 15) {
    next_steps.push("The concentration characteristics in this profile are among the most prominent structural features and may warrant discussion with a qualified advisor.");
  }
  next_steps.push("The Client Summary page provides a condensed reference of the key structural findings.");

  return {
    talking_points: talking_points.slice(0, 4),
    client_questions: client_questions.slice(0, 4),
    red_flags: red_flags.slice(0, 3),
    next_steps: next_steps.slice(0, 4),
  };
}

// ============================================================
// SERVICE CATEGORY OBSERVATIONS
// Structural characteristics mapped to professional service
// categories that clients in similar positions commonly explore.
// These are NOT recommendations — consult a licensed professional.
// ============================================================

export interface ProductRecommendation {
  category: string;
  rationale: string;
  urgency: "High" | "Medium" | "Low";
}

export function generateProductRecommendations(
  inputs: DiagnosticInput,
  finalScore: number,
  constraintKey: string,
  industrySector: string,
): ProductRecommendation[] {
  const recs: ProductRecommendation[] = [];

  // Persistence-related observations
  if (inputs.income_continuity_without_active_labor <= 50) {
    recs.push({
      category: "Income Protection Planning",
      rationale: `Income is ${inputs.income_continuity_without_active_labor <= 25 ? "heavily" : "moderately"} dependent on active work. Income systems with this structural profile are often exposed to disruption from health or capacity events. A licensed insurance professional can assess whether protection coverage is appropriate.`,
      urgency: inputs.income_continuity_without_active_labor <= 25 ? "High" : "Medium",
    });
  }

  // Concentration-related observations
  if (inputs.income_concentration <= 50) {
    recs.push({
      category: "Revenue Diversification Analysis",
      rationale: "Revenue is concentrated across a limited number of sources, which creates structural exposure. Professionals with this profile often benefit from exploring how revenue sources could be broadened. A qualified business advisor can evaluate specific strategies.",
      urgency: inputs.income_concentration <= 25 ? "High" : "Medium",
    });
  }

  // Key-person observation
  if (inputs.income_continuity_without_active_labor <= 25 && inputs.number_of_income_sources <= 50) {
    recs.push({
      category: "Key-Person Exposure Review",
      rationale: "The income system is structurally dependent on one person's continuous output with limited source diversification. This is a commonly identified structural characteristic that licensed professionals can evaluate for appropriate coverage.",
      urgency: "High",
    });
  }

  // Forward visibility observations
  if (inputs.forward_revenue_visibility <= 50) {
    recs.push({
      category: "Cash Flow Visibility Review",
      rationale: "Limited forward revenue visibility is a structural characteristic that affects planning predictability. Professionals in similar positions often explore contract structuring or payment term arrangements with their business advisor.",
      urgency: inputs.forward_revenue_visibility <= 25 ? "High" : "Medium",
    });
  }

  // Recurring revenue observations
  if (inputs.recurring_income_proportion <= 50) {
    recs.push({
      category: "Revenue Structure Analysis",
      rationale: `Most income in this ${industrySector} system comes from one-time transactions. Income systems with subscription, retainer, or membership components tend to exhibit more predictable monthly revenue patterns. A business advisor can evaluate which models may be applicable.`,
      urgency: inputs.recurring_income_proportion <= 25 ? "High" : "Medium",
    });
  }

  // Variability observations
  if (inputs.earnings_variability <= 50) {
    recs.push({
      category: "Cash Flow Planning Review",
      rationale: "Significant month-to-month income variation is a structural characteristic that affects operational planning. A qualified financial professional can help evaluate cash flow management strategies appropriate to this income profile.",
      urgency: inputs.earnings_variability <= 25 ? "High" : "Medium",
    });
  }

  // Wealth planning for high scorers
  if (finalScore >= 70) {
    recs.push({
      category: "Strategic Growth Planning",
      rationale: "Strong structural stability is a characteristic that may create capacity for evaluating growth or investment opportunities. A qualified financial advisor can assess whether the income base supports specific strategic goals.",
      urgency: "Medium",
    });
  }

  // Estate/succession for asset-heavy
  if (inputs.income_continuity_without_active_labor >= 75) {
    recs.push({
      category: "Succession & Continuity Planning",
      rationale: "Significant persistent income (asset-derived or recurring) is a structural characteristic that often has estate planning and succession implications. A qualified estate planning attorney can evaluate specific considerations.",
      urgency: "Low",
    });
  }

  // Sort by urgency, take top 4
  const order = { High: 0, Medium: 1, Low: 2 };
  return recs.sort((a, b) => order[a.urgency] - order[b.urgency]).slice(0, 4);
}

// ============================================================
// PAGE KEY INSIGHT TEXTS
// ============================================================

export function generatePageInsights(
  finalScore: number,
  band: StabilityBand,
  constraintLabel: string,
  priorityLabel: string,
  laborAssetLabel: string,
  industrySector: string
): {
  page_1: string;
  page_2: string;
  page_3: string;
  page_4: string;
  page_5: string;
  page_6: string;
} {
  // Sector-contextualized band description
  const bandContext =
    band === "High Stability"
      ? `among the most structurally stable income systems in the ${industrySector} sector`
      : band === "Established Stability"
        ? `structurally stronger than most income systems in the ${industrySector} sector, with meaningful recurring or persistent revenue`
        : band === "Developing Stability"
          ? `in a transitional phase typical of many ${industrySector} professionals building toward more persistent income structures`
          : `in the early stages of structural development, which is common in the ${industrySector} sector where income often begins as highly active and transaction-driven`;

  return {
    page_1: `This income system scores ${finalScore} under Model RP-1.0, placing it ${bandContext}. The score reflects the structural composition of income — not total earnings or financial health — and measures how well this system would sustain itself if active work were reduced.`,
    page_2: `Classified as ${laborAssetLabel} on the labor-asset spectrum, this income system in the ${industrySector} sector derives its revenue from a specific mix of active work, semi-persistent arrangements, and ongoing income. The structural indicators below reveal where stability is strong and where it depends on continued personal effort.`,
    page_3: `The income map shows how revenue is distributed across active, semi-persistent, and persistent categories — a pattern shaped by the typical structures available in the ${industrySector} sector. Combined with the structural indicators, this reveals the operational reality behind the score.`,
    page_4: `Within the ${industrySector} peer group, this income system falls in the ${band} band. The benchmark comparison below shows how this score compares to the sector average and the threshold for the top 20% of ${industrySector} income systems.`,
    page_5: `The primary structural characteristic is ${constraintLabel}, which is a common factor in the ${industrySector} sector. This is the area where the income profile most differs from higher-scoring systems: ${priorityLabel.charAt(0).toLowerCase() + priorityLabel.slice(1)}.`,
    page_6: `The improvement path below outlines how income systems in the ${industrySector} sector typically evolve from active, labor-dependent revenue toward more structured and recurring models. Each stage represents a structural shift, not just an increase in earnings.`,
  };
}
