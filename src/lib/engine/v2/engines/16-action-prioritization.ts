// Engine 16 — Action Prioritization
// Maps constraints, fragility, lift, and profile to prioritized actions.

import type {
  ConstraintHierarchy,
  FragilityResult,
  SensitivityResult,
  ResolvedProfile,
  ActionResult,
  RecommendedAction,
  AvoidAction,
  ConstraintKey,
  FragilityClass,
} from "../types";

// ─── ACTION LIBRARY ─────────────────────────────────────

const ROOT_CONSTRAINT_ACTIONS: Record<ConstraintKey, Omit<RecommendedAction, "priority">> = {
  weak_forward_visibility: {
    action_id: "ACT-FWD-01",
    label: "Extend Forward Revenue Commitments",
    description: "Negotiate longer contract terms, retainers, or advance booking windows to increase visibility.",
    category: "revenue_structure",
    expected_impact: "Improves forward security score and continuity estimate",
  },
  high_labor_dependence: {
    action_id: "ACT-LBR-01",
    label: "Build Labor-Independent Revenue",
    description: "Develop recurring, passive, or asset-backed income that continues without active work.",
    category: "income_independence",
    expected_impact: "Improves labor dependence score and fragility resilience",
  },
  high_concentration: {
    action_id: "ACT-CON-01",
    label: "Reduce Single-Source Concentration",
    description: "Diversify revenue across more clients or revenue lines to reduce single-source risk.",
    category: "diversification",
    expected_impact: "Improves concentration resilience and reduces fragility",
  },
  low_persistence: {
    action_id: "ACT-PER-01",
    label: "Increase Recurring Revenue Base",
    description: "Convert one-time revenue into retainers, subscriptions, or continuing relationships.",
    category: "revenue_structure",
    expected_impact: "Improves persistence score and continuity estimate",
  },
  high_variability: {
    action_id: "ACT-VAR-01",
    label: "Stabilize Monthly Earnings",
    description: "Smooth revenue through retainers, payment plans, or consistent delivery cadence.",
    category: "cash_flow",
    expected_impact: "Improves variability score",
  },
  weak_durability: {
    action_id: "ACT-DUR-01",
    label: "Strengthen Revenue Durability",
    description: "Reduce cancellation risk, extend contract terms, and lower platform dependency.",
    category: "quality",
    expected_impact: "Improves quality score and durability grade",
  },
  shallow_continuity: {
    action_id: "ACT-CNT-01",
    label: "Deepen Income Continuity",
    description: "Build income streams that persist for at least 90 days without active work.",
    category: "income_independence",
    expected_impact: "Improves continuity estimate and stability score",
  },
};

const FRAGILITY_ACTIONS: Partial<Record<FragilityClass, Omit<RecommendedAction, "priority">>> = {
  brittle: {
    action_id: "ACT-FRAG-01",
    label: "Address Structural Fragility First",
    description: "Your income structure is brittle. Focus on the single highest-fragility trigger before optimizing other areas.",
    category: "resilience",
    expected_impact: "Reduces fragility score and unlocks secondary improvements",
  },
  thin: {
    action_id: "ACT-FRAG-02",
    label: "Build Structural Buffers",
    description: "Add at least one income buffer — a secondary source, longer contract, or emergency retainer.",
    category: "resilience",
    expected_impact: "Moves fragility class from thin to uneven or better",
  },
};

const LIFT_FACTOR_ACTIONS: Record<string, Omit<RecommendedAction, "priority">> = {
  forward_secured_pct: {
    action_id: "ACT-LIFT-FWD",
    label: "Lock In Forward Revenue",
    description: "Convert pipeline opportunities to signed commitments or extend existing contract terms.",
    category: "revenue_structure",
    expected_impact: "Highest projected score lift based on sensitivity analysis",
  },
  largest_source_pct: {
    action_id: "ACT-LIFT-CON",
    label: "Diversify Away from Largest Source",
    description: "Develop a second or third revenue line to reduce dependence on your largest source.",
    category: "diversification",
    expected_impact: "Highest projected score lift based on sensitivity analysis",
  },
  labor_dependence_pct: {
    action_id: "ACT-LIFT-LBR",
    label: "Create Passive or Recurring Income",
    description: "Build at least one revenue stream that continues generating income without your direct labor.",
    category: "income_independence",
    expected_impact: "Highest projected score lift based on sensitivity analysis",
  },
  income_persistence_pct: {
    action_id: "ACT-LIFT-PER",
    label: "Convert Active Revenue to Recurring",
    description: "Transition one-time project work into retainer, subscription, or recurring engagement models.",
    category: "revenue_structure",
    expected_impact: "Highest projected score lift based on sensitivity analysis",
  },
  source_diversity_count: {
    action_id: "ACT-LIFT-DIV",
    label: "Add a New Income Source",
    description: "Develop one additional meaningfully independent income source.",
    category: "diversification",
    expected_impact: "Highest projected score lift based on sensitivity analysis",
  },
  quality_score: {
    action_id: "ACT-LIFT-QAL",
    label: "Improve Revenue Quality",
    description: "Extend contract terms, reduce cancellation risk, or lower platform dependency.",
    category: "quality",
    expected_impact: "Highest projected score lift based on sensitivity analysis",
  },
};

// Sequencing: action → blocked by
const SEQUENCING_RULES: Record<string, string> = {
  "ACT-CON-01": "ACT-PER-01",
};

export function prioritizeActions(
  constraints: ConstraintHierarchy,
  fragility: FragilityResult,
  sensitivity: SensitivityResult,
  profile: ResolvedProfile,
): ActionResult {
  const recommended: RecommendedAction[] = [];
  const avoid: AvoidAction[] = [];

  // 1. Root constraint action
  const rootAction = ROOT_CONSTRAINT_ACTIONS[constraints.root_constraint];
  if (rootAction) {
    recommended.push({ ...rootAction, priority: 1 });
  }

  // 2. Highest lift action
  const liftAction = LIFT_FACTOR_ACTIONS[sensitivity.highest_lift_factor];
  if (liftAction && liftAction.action_id !== rootAction?.action_id) {
    recommended.push({ ...liftAction, priority: 2 });
  }

  // 3. Fragility action
  const fragilityAction = FRAGILITY_ACTIONS[fragility.fragility_class];
  if (fragilityAction) {
    const exists = recommended.find((a) => a.action_id === fragilityAction.action_id);
    if (!exists) {
      recommended.push({ ...fragilityAction, priority: recommended.length + 1 });
    }
  }

  // 4. Secondary constraint action
  if (constraints.primary_constraint !== constraints.root_constraint) {
    const secondaryAction = ROOT_CONSTRAINT_ACTIONS[constraints.primary_constraint];
    if (secondaryAction) {
      const exists = recommended.find((a) => a.action_id === secondaryAction.action_id);
      if (!exists && recommended.length < 6) {
        recommended.push({ ...secondaryAction, priority: recommended.length + 1 });
      }
    }
  }

  // Apply sequencing rules
  for (const action of recommended) {
    const blockedBy = SEQUENCING_RULES[action.action_id];
    if (blockedBy && recommended.some((a) => a.action_id === blockedBy)) {
      action.blocked_until = blockedBy;
      const blocker = recommended.find((a) => a.action_id === blockedBy);
      action.sequencing_note = `Address "${blocker?.label}" first`;
    }
  }

  // Avoid actions based on profile
  if (profile.primary_income_model === "salary") {
    avoid.push({
      action_id: "AVD-01",
      label: "Do not pursue income source diversification as first move",
      reason: "Salaried employees should focus on supplemental streams before restructuring primary income",
    });
  }

  if (profile.is_labor_primary && fragility.fragility_class === "brittle") {
    avoid.push({
      action_id: "AVD-02",
      label: "Do not pursue long-term structural changes before stabilizing",
      reason: "With brittle fragility, immediate buffers should precede strategic restructuring",
    });
  }

  return { recommended_actions: recommended, avoid_actions: avoid };
}
