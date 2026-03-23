// Engine 15 — Deterministic Explainability
// Generates plain-language explanations for every assessment dimension.
// RP-2.1: Now includes surprising insights, tradeoff narratives,
//         one-thing-that-matters callout, and reusable framework.

import type {
  CanonicalInput,
  ScoreBreakdown,
  BandClassification,
  ConstraintHierarchy,
  InteractionResult,
  SensitivityResult,
  FragilityResult,
  QualityResult,
  ExplainabilityResult,
  SurprisingInsight,
  TradeoffNarrative,
  PredictiveWarning,
  BehavioralInsight,
  BenchmarkResult,
  ConstraintKey,
  ResolvedProfile,
} from "../types";
import { CONSTRAINT_LABELS, FAILURE_MODE_LABELS } from "../constants";

export function generateExplainability(
  scores: ScoreBreakdown,
  bands: BandClassification,
  constraints: ConstraintHierarchy,
  interactions: InteractionResult,
  sensitivity: SensitivityResult,
  fragility: FragilityResult,
  quality: QualityResult,
  normalized: CanonicalInput,
  benchmarks: BenchmarkResult | null,
  profile: ResolvedProfile,
): ExplainabilityResult {
  return {
    why_this_score: generateWhyThisScore(scores, bands),
    why_not_higher: generateWhyNotHigher(scores, constraints, interactions),
    strongest_supports: generateStrongestSupports(scores),
    strongest_suppressors: generateStrongestSuppressors(constraints),
    interaction_summary: generateInteractionSummary(interactions),
    best_lift_explanation: generateBestLiftExplanation(sensitivity),
    fragility_explanation: generateFragilityExplanation(fragility, quality),
    surprising_insights: generateSurprisingInsights(normalized, scores, interactions, sensitivity, constraints, benchmarks, fragility),
    tradeoff_narratives: generateTradeoffNarratives(constraints, normalized, sensitivity),
    one_thing_that_matters: generateOneThingThatMatters(sensitivity, constraints, scores),
    reusable_framework: generateReusableFramework(scores, normalized),
    predictive_warnings: generatePredictiveWarnings(normalized, constraints, fragility, scores),
    behavioral_insights: generateBehavioralInsights(normalized, constraints, profile, scores),
  };
}

// ─── EXISTING GENERATORS ─────────────────────────────────

function generateWhyThisScore(
  scores: ScoreBreakdown,
  bands: BandClassification,
): string {
  return (
    `Your overall score of ${scores.overall_score} places you in the ${bands.primary_band} range. ` +
    `Your income structure contributes ${scores.structure_score} of 60 possible structure points, ` +
    `and your stability factors contribute ${scores.stability_score} of 40 possible stability points.`
  );
}

function generateWhyNotHigher(
  scores: ScoreBreakdown,
  constraints: ConstraintHierarchy,
  interactions: InteractionResult,
): string {
  const constraintLabel = CONSTRAINT_LABELS[constraints.root_constraint];
  let explanation = `The primary factor holding your score back is ${constraintLabel}. `;

  if (interactions.net_adjustment < 0) {
    explanation +=
      `Cross-factor interactions reduced your score by ${Math.abs(interactions.net_adjustment)} points ` +
      `because of structural tensions between your income characteristics. `;
  }

  if (constraints.secondary_constraint) {
    const secondaryLabel =
      CONSTRAINT_LABELS[constraints.secondary_constraint];
    explanation +=
      `A secondary constraint — ${secondaryLabel} — also limits improvement potential.`;
  }

  return explanation;
}

function generateStrongestSupports(scores: ScoreBreakdown): string[] {
  const supports: { label: string; score: number; max: number }[] = [
    { label: "Labor independence", score: scores.labor_dependence_score, max: 20 },
    { label: "Forward visibility", score: scores.forward_security_score, max: 15 },
    { label: "Income persistence", score: scores.continuity_score, max: 10 },
    { label: "Concentration resilience", score: scores.concentration_resilience_score, max: 10 },
  ];

  return supports
    .filter((s) => s.score >= s.max * 0.6)
    .sort((a, b) => b.score / b.max - a.score / a.max)
    .slice(0, 3)
    .map((s) => `${s.label}: ${s.score}/${s.max} points`);
}

function generateStrongestSuppressors(
  constraints: ConstraintHierarchy,
): string[] {
  const suppressors: string[] = [];
  suppressors.push(CONSTRAINT_LABELS[constraints.root_constraint]);
  if (constraints.primary_constraint !== constraints.root_constraint) {
    suppressors.push(CONSTRAINT_LABELS[constraints.primary_constraint]);
  }
  if (constraints.secondary_constraint !== constraints.primary_constraint) {
    suppressors.push(CONSTRAINT_LABELS[constraints.secondary_constraint]);
  }
  return suppressors;
}

function generateInteractionSummary(interactions: InteractionResult): string {
  if (interactions.effects.length === 0) {
    return "No cross-factor interactions were detected in your income structure.";
  }
  const penalties = interactions.effects.filter((e) => e.type === "penalty");
  const bonuses = interactions.effects.filter((e) => e.type === "bonus");

  let summary = "";
  if (penalties.length > 0) {
    summary +=
      `${penalties.length} structural tension${penalties.length > 1 ? "s" : ""} detected ` +
      `(${interactions.total_penalty} point impact). `;
  }
  if (bonuses.length > 0) {
    summary +=
      `${bonuses.length} structural strength${bonuses.length > 1 ? "s" : ""} recognized ` +
      `(+${interactions.total_bonus} points).`;
  }
  return summary;
}

function generateBestLiftExplanation(sensitivity: SensitivityResult): string {
  const top = sensitivity.tests[0];
  if (!top || top.lift <= 0) {
    return "No single factor change produces meaningful score improvement in isolation.";
  }
  return (
    `The highest-impact improvement would be ${top.delta_description}, ` +
    `which projects a ${top.lift}-point increase from ${top.original_score} to ${top.projected_score}.`
  );
}

function generateFragilityExplanation(
  fragility: FragilityResult,
  quality: QualityResult,
): string {
  return (
    `Your fragility score is ${fragility.fragility_score}/100 (${fragility.fragility_class}). ` +
    `Your primary failure mode is ${FAILURE_MODE_LABELS[fragility.primary_failure_mode]}. ` +
    `Income quality is rated ${quality.durability_grade} (${quality.quality_score}/10).`
  );
}

// ─── NEW: SURPRISING INSIGHTS ────────────────────────────

function generateSurprisingInsights(
  n: CanonicalInput,
  scores: ScoreBreakdown,
  interactions: InteractionResult,
  sensitivity: SensitivityResult,
  constraints: ConstraintHierarchy,
  benchmarks: BenchmarkResult | null,
  fragility: FragilityResult,
): SurprisingInsight[] {
  const insights: SurprisingInsight[] = [];

  // 1. Diversity illusion: multiple sources but still concentrated
  if (n.source_diversity_count >= 4 && n.largest_source_pct >= 60) {
    insights.push({
      headline: "You have multiple sources, but you are still concentrated",
      explanation: `Even with ${n.source_diversity_count} income sources, ${n.largest_source_pct}% still comes from one. If that source disappears, the others do not cover the gap. Diversification only counts when no single source dominates.`,
      data_point: `${n.source_diversity_count} sources, but ${n.largest_source_pct}% from one`,
    });
  }

  // 2. Recurring revenue illusion: high persistence but labor-dependent
  if (n.income_persistence_pct >= 50 && n.labor_dependence_pct >= 75) {
    insights.push({
      headline: "Your recurring revenue still depends on you showing up",
      explanation: `${n.income_persistence_pct}% of your income repeats — but ${n.labor_dependence_pct}% requires your active effort to deliver. This means your \"recurring\" revenue is really \"re-earning\" revenue. If you stop, most of it stops too.`,
      data_point: `${n.income_persistence_pct}% recurring, ${n.labor_dependence_pct}% labor-dependent`,
    });
  }

  // 3. Hidden interaction penalty eating score
  if (interactions.net_adjustment <= -8) {
    insights.push({
      headline: "Your weaknesses are compounding each other",
      explanation: `Your score lost ${Math.abs(interactions.net_adjustment)} points not from any single weakness, but from how your weaknesses interact. When two vulnerable areas overlap — like high concentration and low visibility — the combined risk is worse than the sum of parts.`,
      data_point: `${Math.abs(interactions.net_adjustment)}-point interaction penalty`,
    });
  }

  // 4. Highest-lift factor is NOT the root constraint
  if (
    sensitivity.tests.length > 0 &&
    sensitivity.highest_lift_factor !== constraintKeyToFactor(constraints.root_constraint)
  ) {
    const topTest = sensitivity.tests[0];
    if (topTest && topTest.lift > 0) {
      insights.push({
        headline: "Your biggest weakness is not your best fix",
        explanation: `Your weakest area is ${CONSTRAINT_LABELS[constraints.root_constraint]}, but the fastest way to raise your score is ${topTest.delta_description}. That single change would add ${topTest.lift} points. Sometimes the most impactful move is not fixing the worst thing — it is strengthening what is closest to a tipping point.`,
        data_point: `Root constraint: ${CONSTRAINT_LABELS[constraints.root_constraint]}; highest lift: ${topTest.delta_description} (+${topTest.lift})`,
      });
    }
  }

  // 5. Peer comparison surprise — outperforming in unexpected area
  if (benchmarks && benchmarks.outlier_dimensions.length > 0) {
    const aboveOutlier = benchmarks.outlier_dimensions.find(
      (d) => d.direction === "above" && d.magnitude === "significant",
    );
    const belowOutlier = benchmarks.outlier_dimensions.find(
      (d) => d.direction === "below" && d.magnitude === "significant",
    );
    if (aboveOutlier && belowOutlier) {
      insights.push({
        headline: "You are stronger than peers in one area but weaker where it matters most",
        explanation: `You significantly outperform peers on ${aboveOutlier.factor.replace(/_/g, " ")} (you: ${Math.round(aboveOutlier.user_value)}, peers: ${Math.round(aboveOutlier.peer_average)}). But you fall significantly behind on ${belowOutlier.factor.replace(/_/g, " ")} (you: ${Math.round(belowOutlier.user_value)}, peers: ${Math.round(belowOutlier.peer_average)}). Your overall score would improve more by closing the gap than by widening the lead.`,
        data_point: `+${Math.round(aboveOutlier.user_value - aboveOutlier.peer_average)} above peers on ${aboveOutlier.factor.replace(/_/g, " ")}, -${Math.round(belowOutlier.peer_average - belowOutlier.user_value)} below on ${belowOutlier.factor.replace(/_/g, " ")}`,
      });
    }
  }

  // 6. Forward visibility is very low despite other strengths
  if (n.forward_secured_pct <= 12 && scores.overall_score >= 30) {
    insights.push({
      headline: "You have real strengths but almost no forward visibility",
      explanation: `Only ${n.forward_secured_pct}% of your income is secured ahead of time. That means every month starts from near-zero, regardless of how good last month was. Even strong earners are fragile without forward commitments.`,
      data_point: `${n.forward_secured_pct}% forward secured`,
    });
  }

  // 7. Fragility class worse than band suggests
  if (
    (scores.overall_score >= 50 && (fragility.fragility_class === "brittle" || fragility.fragility_class === "thin")) ||
    (scores.overall_score >= 30 && fragility.fragility_class === "brittle")
  ) {
    insights.push({
      headline: "Your score looks stable, but your structure is fragile",
      explanation: `Your overall score of ${scores.overall_score} suggests reasonable stability, but your fragility assessment is "${fragility.fragility_class}." This means a single disruption could cause a disproportionate drop. The score reflects average conditions — fragility reveals what happens when things go wrong.`,
      data_point: `Score: ${scores.overall_score}, Fragility: ${fragility.fragility_class}`,
    });
  }

  // Return top 3 most impactful (all are deterministic, just limit output)
  return insights.slice(0, 3);
}

function constraintKeyToFactor(key: ConstraintKey): string {
  const map: Record<ConstraintKey, string> = {
    weak_forward_visibility: "forward_secured_pct",
    high_labor_dependence: "labor_dependence_pct",
    high_concentration: "largest_source_pct",
    low_persistence: "income_persistence_pct",
    high_variability: "income_variability_level",
    weak_durability: "quality_score",
    shallow_continuity: "income_persistence_pct",
  };
  return map[key];
}

// ─── NEW: TRADEOFF NARRATIVES ────────────────────────────

function generateTradeoffNarratives(
  constraints: ConstraintHierarchy,
  n: CanonicalInput,
  sensitivity: SensitivityResult,
): TradeoffNarrative[] {
  const narratives: TradeoffNarrative[] = [];

  // Generate tradeoffs for the top 3 constraint-based improvements
  const constraintList: ConstraintKey[] = [
    constraints.root_constraint,
    constraints.primary_constraint,
    constraints.secondary_constraint,
  ].filter((c, i, arr) => arr.indexOf(c) === i); // dedupe

  for (const constraint of constraintList) {
    const tradeoff = TRADEOFF_MAP[constraint];
    if (tradeoff) {
      narratives.push(tradeoff(n, sensitivity));
    }
  }

  return narratives.slice(0, 3);
}

const TRADEOFF_MAP: Record<
  ConstraintKey,
  (n: CanonicalInput, s: SensitivityResult) => TradeoffNarrative
> = {
  high_concentration: (n) => ({
    action_label: "Reduce client concentration",
    upside: `Moving your largest source from ${n.largest_source_pct}% toward 30% dramatically reduces single-point-of-failure risk and unlocks cross-factor bonuses.`,
    downside: "Diversifying usually means short-term income volatility. New clients start smaller and take time to ramp. Your top client relationship may feel neglected during the transition.",
    net_recommendation: "Worth it. The structural risk of one source at this level outweighs the short-term revenue dip. Start by adding sources — do not fire your biggest client.",
  }),
  weak_forward_visibility: (n) => ({
    action_label: "Extend forward revenue visibility",
    upside: `Locking in revenue ahead of time (currently ${n.forward_secured_pct}%) means each month starts from a position of strength instead of zero. This directly reduces fragility and interaction penalties.`,
    downside: "Longer commitments may require pricing concessions or reduce your flexibility to take higher-value work that appears later. Retainers can feel constraining.",
    net_recommendation: "Worth it. The stability gain from forward visibility is the highest-leverage structural improvement. Even modest retainers or 90-day contracts fundamentally change your risk profile.",
  }),
  high_labor_dependence: (n) => ({
    action_label: "Reduce labor dependence",
    upside: `Moving from ${n.labor_dependence_pct}% labor-dependent means income continues even during illness, vacation, or transition periods. This is the difference between a job and a business.`,
    downside: "Building passive or semi-passive income requires upfront time investment that temporarily reduces active earning capacity. Productizing services often means lower per-unit pricing initially.",
    net_recommendation: "Worth it for anyone above 70% labor dependence. Start with one stream — a retainer, a digital product, or a licensing arrangement. Even 15% passive income fundamentally changes fragility.",
  }),
  low_persistence: (n) => ({
    action_label: "Increase recurring revenue",
    upside: `Raising persistence from ${n.income_persistence_pct}% means a growing base of income arrives without re-selling each month. This compounds over time and is the single best predictor of long-term stability.`,
    downside: "Recurring models may cap your upside. Retainers typically price lower per hour than project work. You may lose pricing flexibility on premium engagements.",
    net_recommendation: "Worth it. The predictability gain outweighs the potential per-unit pricing reduction. Convert your best clients first — they already trust you.",
  }),
  high_variability: () => ({
    action_label: "Reduce earnings variability",
    upside: "Smoothing month-to-month income reduces stress, improves planning accuracy, and removes interaction penalties that suppress your score.",
    downside: "Income smoothing — through retainers or payment plans — may reduce peak-month revenue. You trade upside spikes for consistent baseline.",
    net_recommendation: "Worth it if variability exceeds 40%. The planning and psychological benefits compound. Start by converting your most volatile client to a fixed monthly arrangement.",
  }),
  weak_durability: () => ({
    action_label: "Strengthen revenue quality",
    upside: "Better contract terms, lower cancellation risk, and reduced platform dependency make every dollar of revenue more durable and defensible.",
    downside: "Longer contracts reduce flexibility. Lower platform dependency may mean building your own distribution, which costs time and money upfront.",
    net_recommendation: "Worth it. Fragile revenue is worse than no revenue — it creates false confidence. Prioritize contract extensions over new acquisition.",
  }),
  shallow_continuity: (n) => ({
    action_label: "Deepen income continuity",
    upside: `Extending how long income lasts without active work (beyond the current ${Math.round(n.income_persistence_pct * 0.12)} months) gives you a safety net for transitions, health events, and strategic pivots.`,
    downside: "Building continuity requires shifting time from immediate revenue generation to longer-term structural work. Short-term income may dip.",
    net_recommendation: "Worth it. Income continuity is the ultimate measure of structural strength. Even one stream lasting 90+ days independently transforms your risk profile.",
  }),
};

// ─── NEW: ONE THING THAT MATTERS MOST ────────────────────

function generateOneThingThatMatters(
  sensitivity: SensitivityResult,
  constraints: ConstraintHierarchy,
  scores: ScoreBreakdown,
): string {
  const top = sensitivity.tests[0];
  if (!top || top.lift <= 0) {
    return `Your most important structural priority is addressing ${CONSTRAINT_LABELS[constraints.root_constraint]}. This is the single factor most suppressing your score.`;
  }

  const rootLabel = CONSTRAINT_LABELS[constraints.root_constraint];
  const factorLabel = top.delta_description;

  // If highest lift matches root constraint
  if (sensitivity.highest_lift_factor === constraintKeyToFactor(constraints.root_constraint)) {
    return (
      `If you change one thing, change this: ${rootLabel}. ` +
      `It is both your biggest weakness and your highest-leverage improvement. ` +
      `A single move — ${factorLabel} — would raise your score from ${scores.overall_score} to ${top.projected_score} (+${top.lift} points).`
    );
  }

  // If they diverge — explain why the lift pick is better
  return (
    `If you change one thing, change this: ${factorLabel}. ` +
    `While your biggest weakness is ${rootLabel}, the fastest path to a higher score is ${factorLabel} — ` +
    `it would raise your score from ${scores.overall_score} to ${top.projected_score} (+${top.lift} points). ` +
    `This matters more right now because it is closer to a structural tipping point.`
  );
}

// ─── NEW: REUSABLE FRAMEWORK ─────────────────────────────

function generateReusableFramework(
  scores: ScoreBreakdown,
  n: CanonicalInput,
): string[] {
  return [
    `Persistence (${n.income_persistence_pct}%): What share of your income continues without re-selling each month? Higher persistence = more predictable months.`,
    `Concentration (${n.largest_source_pct}%): How much comes from your single biggest source? Below 30% is diversified. Above 60% is a single point of failure.`,
    `Forward Visibility (${n.forward_secured_pct}%): How much of next month's income is already committed? Above 50% means your month starts from strength.`,
    `Labor Dependence (${n.labor_dependence_pct}%): How much income stops if you stop working? Below 40% means you have real structural independence.`,
    `Variability: How much does your income swing month to month? Lower swings = better planning, less stress, fewer crises.`,
    `Quality: How durable are your contracts? Long terms, low cancellation risk, and low platform dependency make each dollar worth more.`,
  ];
}

// ─── NEW: PREDICTIVE WARNINGS ────────────────────────────

function generatePredictiveWarnings(
  n: CanonicalInput,
  constraints: ConstraintHierarchy,
  fragility: FragilityResult,
  scores: ScoreBreakdown,
): PredictiveWarning[] {
  const warnings: PredictiveWarning[] = [];

  // Over-reliance escalation
  if (n.largest_source_pct >= 50 && n.largest_source_pct < 80) {
    warnings.push({
      headline: "You are likely to become more dependent on your top source",
      explanation: `At ${n.largest_source_pct}%, your largest source is already dominant. Without active diversification, natural gravity pulls this higher — your best client gives you more work, you say yes, and concentration creeps toward dangerous levels. Most people do not notice until it is too late.`,
      timeframe: "Next 3-6 months",
    });
  }

  // Burnout risk from labor + low persistence
  if (n.labor_dependence_pct >= 75 && n.income_persistence_pct <= 30) {
    warnings.push({
      headline: "Your current structure encourages burnout",
      explanation: `${n.labor_dependence_pct}% of your income requires daily effort and only ${n.income_persistence_pct}% recurs. This means you must perform at full capacity every month to maintain income. Fatigue, illness, or even a vacation creates an immediate income gap. This structure is not sustainable long-term.`,
      timeframe: "Next 60-90 days",
    });
  }

  // Forward visibility collapse
  if (n.forward_secured_pct <= 15 && n.source_diversity_count <= 2) {
    warnings.push({
      headline: "You are one slow month away from a cash crisis",
      explanation: `With only ${n.forward_secured_pct}% forward visibility and ${n.source_diversity_count} income source${n.source_diversity_count > 1 ? "s" : ""}, a single dry spell could cascade. You have no pipeline buffer, so any gap between clients becomes an emergency, not an inconvenience.`,
      timeframe: "Next 30-60 days",
    });
  }

  // False confidence from good score but brittle fragility
  if (scores.overall_score >= 45 && (fragility.fragility_class === "brittle" || fragility.fragility_class === "thin")) {
    warnings.push({
      headline: "Your score may be giving you false confidence",
      explanation: `A score of ${scores.overall_score} looks reasonable, but your fragility class is "${fragility.fragility_class}." This means things look fine until they do not. One disruption — a lost client, a health event, a market shift — could drop your score dramatically. Do not confuse a decent average with actual protection.`,
      timeframe: "Ongoing",
    });
  }

  // Complacency risk for high scorers
  if (scores.overall_score >= 70 && n.forward_secured_pct <= 30) {
    warnings.push({
      headline: "Stability without forward visibility is borrowed time",
      explanation: `Your score of ${scores.overall_score} is strong, but only ${n.forward_secured_pct}% is locked in ahead. This means your stability depends on things continuing to go right. The moment they do not — a client pauses, a deal slips — you will feel it immediately.`,
      timeframe: "Next quarter",
    });
  }

  return warnings.slice(0, 2);
}

// ─── NEW: BEHAVIORAL INSIGHTS ────────────────────────────

function generateBehavioralInsights(
  n: CanonicalInput,
  constraints: ConstraintHierarchy,
  profile: ResolvedProfile,
  scores: ScoreBreakdown,
): BehavioralInsight[] {
  const insights: BehavioralInsight[] = [];

  // High effort, low leverage
  if (n.labor_dependence_pct >= 70 && n.income_persistence_pct <= 25) {
    insights.push({
      pattern: "You are optimizing for short-term cash over long-term stability",
      consequence: "Every month you restart from near-zero. You work hard but the work does not compound. This is the highest-effort, lowest-leverage income model.",
      reframe: "Shift 10-15% of your time from active delivery to building one recurring stream. The first 90 days feel slower. After that, each month gets easier.",
    });
  }

  // Relationship dependency
  if (n.largest_source_pct >= 60 && n.source_diversity_count <= 2) {
    insights.push({
      pattern: "You are building a business around a relationship, not a structure",
      consequence: "When your biggest source is also your only real source, every business decision optimizes for keeping that one relationship happy. You lose negotiating power, take on scope you should not, and avoid uncomfortable conversations.",
      reframe: "Adding even one more meaningful source at 15-20% changes the dynamic entirely. You negotiate better, say no more easily, and sleep better.",
    });
  }

  // Comfort zone trap — decent score but no forward momentum
  if (scores.overall_score >= 40 && scores.overall_score <= 60 && n.forward_secured_pct <= 20) {
    insights.push({
      pattern: "You are in a comfort zone that feels stable but is not protected",
      consequence: "A mid-range score feels like you have figured it out. But without forward visibility, you are just having a good streak. Streaks end. When this one does, you will not have a plan B ready.",
      reframe: "Use this stable period to lock things in — retainers, contracts, commitments. Building from strength is easier than building from crisis.",
    });
  }

  // Avoidance of structure
  if (n.income_persistence_pct <= 15 && n.forward_secured_pct <= 15 && profile.is_project_model) {
    insights.push({
      pattern: "You are trading freedom for fragility",
      consequence: "Project-based work feels like independence, but zero recurring revenue and zero forward visibility is not freedom — it is constant reinvention. The mental cost of always hunting for the next project compounds into chronic stress.",
      reframe: "One retainer at 20-30% of your income buys real freedom — the freedom to say no, take vacations, and be strategic instead of reactive.",
    });
  }

  // Over-diversification without depth
  if (n.source_diversity_count >= 5 && n.income_persistence_pct <= 20) {
    insights.push({
      pattern: "You are spreading wide instead of building deep",
      consequence: `${n.source_diversity_count} sources looks diversified, but with only ${n.income_persistence_pct}% persistence, none of these relationships have real depth. You are a freelancer with many clients, not a business with durable revenue.`,
      reframe: "Pick your 2-3 best clients and convert them to recurring arrangements. Depth of relationship is more valuable than breadth of portfolio.",
    });
  }

  return insights.slice(0, 2);
}
