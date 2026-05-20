// ═══════════════════════════════════════════════════════════════
// Engine 16B — Action Translation Layer
// Converts generic actions to specific, buyer-facing guidance
// Runs AFTER Engine 16 (Action Prioritization)
// ═══════════════════════════════════════════════════════════════

import type {
  RecommendedAction,
  AvoidAction,
  ConstraintHierarchy,
  SensitivityResult,
  ResolvedProfile,
  ScoreLiftProjection,
  ExtendedInputs,
  CanonicalInput,
  ActionConfidence,
  TranslatedActionMove,
  ActionPlan,
  ConstraintKey,
} from "../types";

import { findActionTemplate } from "../data/industry-action-library";

export function translateActions(
  recommendedActions: RecommendedAction[],
  avoidActions: AvoidAction[],
  constraints: ConstraintHierarchy,
  sensitivity: SensitivityResult,
  scoreLift: ScoreLiftProjection,
  profile: ResolvedProfile,
  normalized: CanonicalInput,
  extended: ExtendedInputs | null,
): ActionPlan {
  // Translate top 3 recommended actions
  const translatedMoves: TranslatedActionMove[] = [];

  for (let i = 0; i < Math.min(3, recommendedActions.length); i++) {
    const action = recommendedActions[i];
    const liftProjection = scoreLift.lift_scenarios[i] || scoreLift.highest_single_lift;

    const move = translateAction(
      action,
      i + 1,
      constraints.root_constraint,
      profile,
      normalized,
      extended,
      liftProjection?.lift || 0,
    );

    if (move) {
      translatedMoves.push(move);
    }
  }

  // Primary opportunity: derived from root constraint
  const primaryOpportunity = describePrimaryOpportunity(
    constraints.root_constraint,
    normalized,
    profile,
  );

  // First recommended shift: the top action, personalized
  const firstShift = translatedMoves[0]
    ? `${translatedMoves[0].action_title}: ${translatedMoves[0].first_step}`
    : "Identify and address your primary structural constraint.";

  // Avoid first: aggregated from avoid_actions or inferred from profile
  const avoidFirstStr = aggregateAvoidFirst(avoidActions, profile);

  // Reassessment trigger: derived from reassessment logic
  const reassessmentTrigger = deriveReassessmentTrigger(
    constraints.root_constraint,
    normalized,
  );

  return {
    primary_opportunity: primaryOpportunity,
    top_moves: translatedMoves,
    first_recommended_shift: firstShift,
    avoid_first: avoidFirstStr,
    reassessment_trigger: reassessmentTrigger,
  };
}

function translateAction(
  action: RecommendedAction,
  rank: number,
  rootConstraint: ConstraintKey,
  profile: ResolvedProfile,
  normalized: CanonicalInput,
  extended: ExtendedInputs | null,
  estimatedLift: number,
): TranslatedActionMove | null {
  // Determine confidence level
  const confidence = assessActionConfidence(
    rootConstraint,
    profile,
    extended,
    action.action_id,
  );

  // Look up industry-specific template
  const template = findActionTemplate(
    profile.industry_sector,
    profile.primary_income_model,
    profile.revenue_structure,
    rootConstraint,
  );

  if (!template) {
    // Fallback: use generic action properties
    return {
      rank,
      source_action_id: action.action_id,
      action_title: action.label,
      selected_because: action.description,
      target_metric: action.target,
      first_step: extractFirstStep(action),
      avoid_first: extractAvoidFirst(action),
      estimated_score_lift: estimatedLift,
      reassess_when: deriveReassessmentTrigger(rootConstraint, normalized),
      action_confidence: confidence,
    };
  }

  // Interpolate template with actual data
  const selectedBecause = interpolateTemplate(
    template.selected_because_template,
    normalized,
    extended,
    profile,
  );

  const targetMetric = interpolateTemplate(
    template.target_metric_template,
    normalized,
    extended,
    profile,
  );

  const firstStep = interpolateTemplate(
    template.first_step_template,
    normalized,
    extended,
    profile,
  );

  const avoidFirst = interpolateTemplate(
    template.avoid_first_template,
    normalized,
    extended,
    profile,
  );

  const reassessWhen = interpolateTemplate(
    template.reassess_when_template,
    normalized,
    extended,
    profile,
  );

  return {
    rank,
    source_action_id: action.action_id,
    action_title: template.action_title,
    selected_because: selectedBecause,
    target_metric: targetMetric,
    first_step: firstStep,
    avoid_first: avoidFirst,
    estimated_score_lift: estimatedLift,
    reassess_when: reassessWhen,
    action_confidence: confidence,
  };
}

function assessActionConfidence(
  rootConstraint: ConstraintKey,
  profile: ResolvedProfile,
  extended: ExtendedInputs | null,
  actionId: string,
): ActionConfidence {
  // High: industry template exists + lift exists + relevant extended inputs
  const hasTemplate = findActionTemplate(
    profile.industry_sector,
    profile.primary_income_model,
    profile.revenue_structure,
    rootConstraint,
  );

  const relevantExtInputs = countRelevantExtendedInputs(
    rootConstraint,
    extended,
    profile,
  );

  if (hasTemplate && relevantExtInputs >= 2) {
    return "high";
  }

  // Moderate: industry or generic template + some extended inputs
  if (hasTemplate && relevantExtInputs >= 1) {
    return "moderate";
  }

  // Guarded: fallback only, or no extended inputs
  return "guarded";
}

function countRelevantExtendedInputs(
  constraint: ConstraintKey,
  extended: ExtendedInputs | null,
  profile: ResolvedProfile,
): number {
  if (!extended) return 0;

  let count = 0;

  // Map constraint to relevant extended inputs
  const relevantFields: Record<ConstraintKey, (keyof ExtendedInputs)[]> = {
    weak_forward_visibility: ["months_of_visibility", "pipeline_visibility_months"],
    high_labor_dependence: ["repeat_revenue_pct", "asset_backed_income_pct"],
    high_concentration: [
      "largest_account_or_channel_pct",
      "customer_concentration_within_recurring_level",
    ],
    low_persistence: ["repeat_revenue_pct", "renewal_income_pct"],
    high_variability: [
      "recurring_contract_term_months_avg",
      "commission_payout_delay_days",
    ],
    weak_durability: [
      "recurring_contract_term_months_avg",
      "booked_but_cancelable_pct",
      "platform_dependency_level",
    ],
    shallow_continuity: ["repeat_revenue_pct", "renewal_income_pct"],
  };

  const fields = relevantFields[constraint] || [];
  for (const field of fields) {
    if (extended[field] !== undefined && extended[field] !== null) {
      count++;
    }
  }

  return count;
}

function interpolateTemplate(
  template: string,
  normalized: CanonicalInput,
  extended: ExtendedInputs | null,
  profile: ResolvedProfile,
): string {
  let result = template;

  // ─── Numeric Substitutions ───────────────────────────────

  result = result.replace(/{{forward_secured_pct}}/g, String(normalized.forward_secured_pct));
  result = result.replace(/{{largest_source_pct}}/g, String(normalized.largest_source_pct));
  result = result.replace(/{{labor_dependence_pct}}/g, String(normalized.labor_dependence_pct));
  result = result.replace(/{{income_persistence_pct}}/g, String(normalized.income_persistence_pct));
  result = result.replace(/{{income_variability_level}}/g, normalized.income_variability_level);
  result = result.replace(/{{source_diversity_count}}/g, String(normalized.source_diversity_count));

  // ─── Extended Inputs ─────────────────────────────────────

  if (extended?.months_of_visibility) {
    result = result.replace(
      /{{months_of_visibility}}/g,
      String(extended.months_of_visibility),
    );
  }

  if (extended?.renewal_income_pct) {
    result = result.replace(/{{renewal_income_pct}}/g, String(extended.renewal_income_pct));
  }

  if (extended?.recurring_contract_term_months_avg) {
    result = result.replace(
      /{{recurring_term_months}}/g,
      String(extended.recurring_contract_term_months_avg),
    );
  }

  // ─── Derived Targets ─────────────────────────────────────

  const targetForward = Math.min(100, normalized.forward_secured_pct + 20);
  result = result.replace(/{{target_forward}}/g, String(targetForward));

  const targetPersistence = Math.min(100, normalized.income_persistence_pct + 20);
  result = result.replace(/{{target_persistence}}/g, String(targetPersistence));

  const targetPassive = Math.min(25, Math.max(10, 100 - normalized.labor_dependence_pct));
  result = result.replace(/{{target_passive_pct}}/g, String(targetPassive));

  const continuityMonths = Math.max(3, 12 - normalized.labor_dependence_pct / 10);
  result = result.replace(/{{target_continuity_months}}/g, String(Math.round(continuityMonths)));

  // Number of projects to convert (estimate)
  const projectsToConvert = Math.max(1, Math.ceil(normalized.source_diversity_count / 2));
  result = result.replace(/{{num_projects_to_convert}}/g, String(projectsToConvert));

  const continuityStreamsNeeded = Math.max(1, 3 - normalized.source_diversity_count);
  result = result.replace(/{{continuity_streams_needed}}/g, String(continuityStreamsNeeded));

  // ─── Profile-Based Substitutions ────────────────────────

  const modelLabel = profile.primary_income_model.replace(/_/g, " ");
  result = result.replace(/{{income_model}}/g, modelLabel);

  const archetype = profile.profile_archetype || "your field";
  result = result.replace(/{{archetype}}/g, archetype);

  return result;
}

function describePrimaryOpportunity(
  constraint: ConstraintKey,
  normalized: CanonicalInput,
  profile: ResolvedProfile,
): string {
  const descriptions: Record<ConstraintKey, string> = {
    weak_forward_visibility:
      `Your forward visibility is only ${normalized.forward_secured_pct}%. ` +
      `Committing clients to signed agreements would unlock predictability and reduce runway risk.`,

    high_labor_dependence:
      `${normalized.labor_dependence_pct}% of your income requires daily work. ` +
      `Creating even one non-labor stream (retainer, product, licensing) would free capacity and scale earnings.`,

    high_concentration:
      `Your largest source is ${normalized.largest_source_pct}% of revenue. ` +
      `Adding 1–2 diversified clients would cut your catastrophic risk by more than half.`,

    low_persistence:
      `Only ${normalized.income_persistence_pct}% of revenue repeats month-to-month. ` +
      `Converting 2–3 project clients to retainers would create a stable earnings floor.`,

    high_variability:
      `Your monthly earnings swing from variable contracts. ` +
      `Locking in fixed monthly payments or retainers would smooth cash flow and reduce planning uncertainty.`,

    weak_durability:
      `Your revenue is fragile: short notice terms or high cancellation risk. ` +
      `Extending contracts to 6+ months with notice requirements would harden your foundation.`,

    shallow_continuity:
      `Your income would dry up in weeks if active work stopped. ` +
      `Building renewal income or continuing retainers creates a real financial buffer.`,
  };

  return descriptions[constraint] || "Address your primary structural constraint.";
}

function deriveReassessmentTrigger(
  constraint: ConstraintKey,
  normalized: CanonicalInput,
): string {
  const triggers: Record<ConstraintKey, string> = {
    weak_forward_visibility: `Reassess when forward-secured revenue reaches ${Math.min(100, normalized.forward_secured_pct + 25)}%+. This represents a meaningful increase in visibility.`,

    high_labor_dependence: `Reassess when non-labor revenue reaches 10%+. This threshold signals meaningful leverage creation.`,

    high_concentration: `Reassess when your largest source drops below ${Math.max(30, normalized.largest_source_pct - 25)}%. This represents material diversification.`,

    low_persistence: `Reassess when recurring revenue reaches ${Math.min(100, normalized.income_persistence_pct + 25)}%+. Each conversion compounds over time.`,

    high_variability: `Reassess after 90 days. Measure month-to-month swings. A 20%+ reduction signals cash flow stability progress.`,

    weak_durability: `Reassess when 60%+ of quarterly revenue is locked in 6+ month contracts. This hardens durability materially.`,

    shallow_continuity: `Reassess when income continuity (months of revenue if active work stopped) reaches 90+ days. This is the true safety threshold.`,
  };

  return triggers[constraint] || "Reassess in 90 days and measure progress against your target.";
}

function aggregateAvoidFirst(
  avoidActions: AvoidAction[],
  profile: ResolvedProfile,
): string {
  if (avoidActions.length === 0) {
    return "Avoid scattered efforts across too many new initiatives. Focus on one primary move first.";
  }

  const reasons = avoidActions.map((a) => a.reason);
  const unique = Array.from(new Set(reasons));

  if (unique.length === 1) {
    return `Avoid: ${unique[0]}`;
  }

  return `Avoid: ${unique.slice(0, 2).join("; ")}.`;
}

function extractFirstStep(action: RecommendedAction): string {
  // Extract from description or target
  if (action.sequencing_note) {
    return `First, ${action.sequencing_note.toLowerCase()}. Then, ${action.description.slice(0, 50)}...`;
  }

  return action.description.slice(0, 80) + "...";
}

function extractAvoidFirst(action: RecommendedAction): string {
  // Extract from tradeoff or generic fallback
  if (action.tradeoff) {
    const avoidPart = action.tradeoff.split(".")[0];
    return avoidPart.length > 10 ? avoidPart : "Avoid overcommitting to this action too quickly.";
  }

  return "Avoid overcommitting before validating the approach.";
}
