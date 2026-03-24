// Engine 16 — Action Prioritization
// Maps constraints, fragility, lift, and profile to prioritized actions.
// RP-2.1: Actions now include concrete timeframes, numeric targets,
//         and tradeoff warnings.

import type {
  CanonicalInput,
  ConstraintHierarchy,
  FragilityResult,
  SensitivityResult,
  ResolvedProfile,
  ActionResult,
  RecommendedAction,
  AvoidAction,
  ExecutionRoadmapWeek,
  ScriptTemplate,
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
    timeframe: "Within 30 days",
    target: "Convert at least 1 existing client to a 90-day retainer or advance commitment, adding 15%+ forward visibility",
    tradeoff: "Longer commitments may require modest pricing concessions. The stability gain outweighs the per-hour discount.",
  },
  high_labor_dependence: {
    action_id: "ACT-LBR-01",
    label: "Build Labor-Independent Revenue",
    description: "Develop recurring, passive, or asset-backed income that continues without active work.",
    category: "income_independence",
    expected_impact: "Improves labor dependence score and fragility resilience",
    timeframe: "Within 60 days: launch one passive/semi-passive stream",
    target: "Create 1 revenue stream generating at least 10-15% of monthly income without daily labor (e.g., retainer, digital product, licensing deal)",
    tradeoff: "Building passive income requires upfront time that temporarily reduces active earning. Start small — one stream at 10% is transformative.",
  },
  high_concentration: {
    action_id: "ACT-CON-01",
    label: "Reduce Single-Source Concentration",
    description: "Diversify revenue across more clients or revenue lines to reduce single-source risk.",
    category: "diversification",
    expected_impact: "Improves concentration resilience and reduces fragility",
    timeframe: "Within 60 days: sign 1-2 new clients",
    target: "Acquire enough new revenue that your largest source drops below 50% (ideally 30%) of total income",
    tradeoff: "New clients start small and take time to ramp. Your top client may get less attention during the transition. Do not fire your biggest client — add around them.",
  },
  low_persistence: {
    action_id: "ACT-PER-01",
    label: "Increase Recurring Revenue Base",
    description: "Convert one-time revenue into retainers, subscriptions, or continuing relationships.",
    category: "revenue_structure",
    expected_impact: "Improves persistence score and continuity estimate",
    timeframe: "Within 30 days: propose 1 retainer conversion",
    target: "Convert at least 1 project-based client to a monthly retainer, raising recurring revenue by 15%+ of total income",
    tradeoff: "Retainers typically price lower per hour than project work. The compounding predictability more than compensates within 2-3 months.",
  },
  high_variability: {
    action_id: "ACT-VAR-01",
    label: "Stabilize Monthly Earnings",
    description: "Smooth revenue through retainers, payment plans, or consistent delivery cadence.",
    category: "cash_flow",
    expected_impact: "Improves variability score",
    timeframe: "Within 30 days: restructure 1 client payment",
    target: "Convert your most variable client to a fixed monthly payment or retainer, reducing month-to-month swings by at least 20%",
    tradeoff: "Smoothing income may cap peak months. You trade upside spikes for a reliable baseline. For most earners, this is a net positive.",
  },
  weak_durability: {
    action_id: "ACT-DUR-01",
    label: "Strengthen Revenue Durability",
    description: "Reduce cancellation risk, extend contract terms, and lower platform dependency.",
    category: "quality",
    expected_impact: "Improves quality score and durability grade",
    timeframe: "Within 45 days: renegotiate 1 key contract",
    target: "Extend at least 1 major contract to 6+ months with cancellation notice terms to reduce revenue fragility",
    tradeoff: "Better contract terms may require relationship negotiation. Reducing platform dependency means investing in owned channels. Both are worth it long-term.",
  },
  shallow_continuity: {
    action_id: "ACT-CNT-01",
    label: "Deepen Income Continuity",
    description: "Build income streams that persist for at least 90 days without active work.",
    category: "income_independence",
    expected_impact: "Improves continuity estimate and stability score",
    timeframe: "Within 60 days: establish 1 continuing stream",
    target: "Create at least 1 income stream that would continue producing for 90+ days if all active work stopped",
    tradeoff: "Building continuity requires shifting time from immediate revenue to structural work. Short-term income may dip while you invest in durability.",
  },
};

const FRAGILITY_ACTIONS: Partial<Record<FragilityClass, Omit<RecommendedAction, "priority">>> = {
  brittle: {
    action_id: "ACT-FRAG-01",
    label: "Address Structural Fragility First",
    description: "Your income structure is brittle. Focus on the single highest-fragility trigger before optimizing other areas.",
    category: "resilience",
    expected_impact: "Reduces fragility score and unlocks secondary improvements",
    timeframe: "This week: identify your single biggest fragility trigger",
    target: "Resolve 1 critical fragility factor (e.g., add a second income source, sign a 90-day contract, or reduce top-client share below 60%)",
    tradeoff: "Fragility fixes feel unsexy — they rarely increase immediate income. But they prevent catastrophic drops, which is more valuable per hour spent.",
  },
  thin: {
    action_id: "ACT-FRAG-02",
    label: "Build Structural Buffers",
    description: "Add at least one income buffer — a secondary source, longer contract, or emergency retainer.",
    category: "resilience",
    expected_impact: "Moves fragility class from thin to uneven or better",
    timeframe: "Within 30 days: add 1 structural buffer",
    target: "Add 1 new buffer: a secondary client at 10%+ of income, a 3-month retainer extension, or a passive income stream",
    tradeoff: "Building buffers may slow growth of your primary revenue line. The insurance value justifies the opportunity cost.",
  },
};

const LIFT_FACTOR_ACTIONS: Record<string, Omit<RecommendedAction, "priority">> = {
  forward_secured_pct: {
    action_id: "ACT-LIFT-FWD",
    label: "Lock In Forward Revenue",
    description: "Convert pipeline opportunities to signed commitments or extend existing contract terms.",
    category: "revenue_structure",
    expected_impact: "Highest projected score lift based on sensitivity analysis",
    timeframe: "Within 30 days",
    target: "Convert at least 2 pipeline opportunities to signed commitments, targeting 15%+ increase in forward-secured revenue",
    tradeoff: "Signed commitments reduce flexibility to pursue higher-value opportunities. The certainty is usually worth more than the optionality.",
  },
  largest_source_pct: {
    action_id: "ACT-LIFT-CON",
    label: "Diversify Away from Largest Source",
    description: "Develop a second or third revenue line to reduce dependence on your largest source.",
    category: "diversification",
    expected_impact: "Highest projected score lift based on sensitivity analysis",
    timeframe: "Within 60 days: onboard 1-2 new clients",
    target: "Bring largest source share down by 15 percentage points through new client acquisition",
    tradeoff: "Revenue diversification creates short-term income volatility. New clients take time to reach full value. Stay patient through the ramp.",
  },
  labor_dependence_pct: {
    action_id: "ACT-LIFT-LBR",
    label: "Create Passive or Recurring Income",
    description: "Build at least one revenue stream that continues generating income without your direct labor.",
    category: "income_independence",
    expected_impact: "Highest projected score lift based on sensitivity analysis",
    timeframe: "Within 60 days: launch 1 non-labor stream",
    target: "Generate at least 10-15% of monthly income from a source that does not require your daily work",
    tradeoff: "Passive income products (courses, templates, licensing) require significant upfront creation time. ROI comes in months 3-6, not week 1.",
  },
  income_persistence_pct: {
    action_id: "ACT-LIFT-PER",
    label: "Convert Active Revenue to Recurring",
    description: "Transition one-time project work into retainer, subscription, or recurring engagement models.",
    category: "revenue_structure",
    expected_impact: "Highest projected score lift based on sensitivity analysis",
    timeframe: "Within 30 days: propose 1 conversion",
    target: "Convert at least 1 project-based engagement into a recurring arrangement worth 15%+ of monthly income",
    tradeoff: "Recurring engagements often price below equivalent project rates. The compounding predictability more than compensates within 2-3 months.",
  },
  source_diversity_count: {
    action_id: "ACT-LIFT-DIV",
    label: "Add a New Income Source",
    description: "Develop one additional meaningfully independent income source.",
    category: "diversification",
    expected_impact: "Highest projected score lift based on sensitivity analysis",
    timeframe: "Within 60 days: activate 1 new source",
    target: "Add 1 new income source generating at least 10% of total monthly income within 90 days",
    tradeoff: "New revenue sources require time and attention to establish. Expect 4-8 weeks before meaningful revenue flow. Do not spread too thin.",
  },
  quality_score: {
    action_id: "ACT-LIFT-QAL",
    label: "Improve Revenue Quality",
    description: "Extend contract terms, reduce cancellation risk, or lower platform dependency.",
    category: "quality",
    expected_impact: "Highest projected score lift based on sensitivity analysis",
    timeframe: "Within 45 days: improve 1 contract",
    target: "Extend your most important contract to 6+ months with cancellation notice terms, or reduce platform dependency by 1 channel",
    tradeoff: "Better contract terms may require relationship negotiation. Reducing platform dependency means investing in owned channels. Both are worth it long-term.",
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
  normalized: CanonicalInput,
): ActionResult {
  const recommended: RecommendedAction[] = [];
  const avoid: AvoidAction[] = [];

  // 1. Root constraint action — personalize targets with actual numbers
  const rootAction = { ...ROOT_CONSTRAINT_ACTIONS[constraints.root_constraint] };
  if (rootAction) {
    rootAction.target = personalizeTarget(constraints.root_constraint, normalized, rootAction.target);
    recommended.push({ ...rootAction, priority: 1 });
  }

  // 2. Highest lift action
  const liftAction = LIFT_FACTOR_ACTIONS[sensitivity.highest_lift_factor];
  if (liftAction && liftAction.action_id !== rootAction?.action_id) {
    const personalized = { ...liftAction };
    const topTest = sensitivity.tests[0];
    if (topTest && topTest.lift > 0) {
      personalized.expected_impact = `Projects a ${topTest.lift}-point score increase (${topTest.original_score} → ${topTest.projected_score})`;
    }
    recommended.push({ ...personalized, priority: 2 });
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
        const personalized = { ...secondaryAction };
        personalized.target = personalizeTarget(constraints.primary_constraint, normalized, personalized.target);
        recommended.push({ ...personalized, priority: recommended.length + 1 });
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

  const execution_roadmap = generateExecutionRoadmap(constraints, normalized, profile);
  const script_templates = generateScriptTemplates(constraints, normalized, profile);

  return { recommended_actions: recommended, avoid_actions: avoid, execution_roadmap, script_templates };
}

// ─── TARGET PERSONALIZATION ──────────────────────────────

function personalizeTarget(
  constraint: ConstraintKey,
  n: CanonicalInput,
  fallback: string,
): string {
  switch (constraint) {
    case "high_concentration":
      if (n.largest_source_pct >= 70)
        return `Reduce your top source from ${n.largest_source_pct}% to below 50% by acquiring 1-2 new clients at ~${Math.round(n.largest_source_pct * 0.3)}% share each within 60 days`;
      if (n.largest_source_pct >= 50)
        return `Reduce your top source from ${n.largest_source_pct}% to below 30% by growing secondary sources within 90 days`;
      return fallback;

    case "weak_forward_visibility":
      return `Increase forward-secured revenue from ${n.forward_secured_pct}% to at least ${Math.min(100, n.forward_secured_pct + 20)}% by converting pipeline to signed commitments within 30 days`;

    case "high_labor_dependence":
      return `Reduce labor dependence from ${n.labor_dependence_pct}% to below ${Math.max(50, n.labor_dependence_pct - 20)}% by launching 1 non-labor revenue stream within 60 days`;

    case "low_persistence":
      return `Raise recurring revenue from ${n.income_persistence_pct}% to at least ${Math.min(100, n.income_persistence_pct + 20)}% by converting 1-2 clients to retainers within 30 days`;

    default:
      return fallback;
  }
}

// ─── CONSTRAINT LABEL HELPERS ─────────────────────────────

const CONSTRAINT_LABELS_PLAIN: Record<string, string> = {
  weak_forward_visibility: "forward visibility",
  high_labor_dependence: "labor dependence",
  high_concentration: "client concentration",
  low_persistence: "recurring revenue",
  high_variability: "earnings variability",
  weak_durability: "revenue durability",
  shallow_continuity: "income continuity",
};

// ─── EXECUTION ROADMAP ───────────────────────────────────

function generateExecutionRoadmap(
  constraints: ConstraintHierarchy,
  n: CanonicalInput,
  profile: ResolvedProfile,
): ExecutionRoadmapWeek[] {
  const weeks: ExecutionRoadmapWeek[] = [];
  const root = constraints.root_constraint;
  const isProject = profile.is_project_model;

  // Week 1: Assessment and identification
  weeks.push({
    week: "Week 1",
    action: "Audit your current income structure",
    detail: root === "high_concentration"
      ? `List all income sources. Confirm your top source is at ${n.largest_source_pct}%. Identify 3 prospects who could become 10%+ sources within 90 days.`
      : root === "weak_forward_visibility"
      ? `Review every current client. Identify which ones could commit to retainers, advance bookings, or multi-month contracts. Draft a shortlist of your top 3 conversion candidates.`
      : root === "high_labor_dependence"
      ? `Map every hour you work to the revenue it generates. Identify which services could be productized, templated, or delivered by someone else.`
      : root === "low_persistence"
      ? `Calculate what percentage of last month's revenue will repeat this month without re-selling. Identify 2-3 clients where a retainer conversation is natural.`
      : "Review your six structural factors. Identify the single weakest area and list 3 specific actions that could improve it.",
    success_metric: "You have a written list of specific opportunities to act on",
  });

  // Week 2: First outreach / conversation
  weeks.push({
    week: "Week 2",
    action: root === "high_concentration"
      ? "Reach out to 3 new prospects"
      : root === "weak_forward_visibility"
      ? "Pitch your first retainer or advance commitment"
      : root === "high_labor_dependence"
      ? "Design one productized or semi-passive offering"
      : root === "low_persistence"
      ? "Have the retainer conversation with your best client"
      : "Start one conversation that addresses your primary constraint",
    detail: root === "high_concentration"
      ? "Send personalized outreach to 3 qualified prospects. Focus on people who need ongoing work, not one-off projects. Use the outreach script from this report."
      : root === "weak_forward_visibility"
      ? `Choose your most likely conversion candidate and propose a ${isProject ? "3-month project commitment" : "monthly retainer"} with a small discount for commitment. Use the retainer pitch script from this report.`
      : root === "high_labor_dependence"
      ? "Package your most common deliverable into a fixed-scope offering that could be partially automated or delegated. Price it at 70-80% of your custom rate."
      : "Propose converting one project relationship into a monthly engagement. Frame it as guaranteed priority access.",
    success_metric: root === "high_concentration"
      ? "3 outreach messages sent, at least 1 response received"
      : "1 proposal delivered to a specific client",
  });

  // Week 3-4: Follow through and close
  weeks.push({
    week: "Weeks 3-4",
    action: root === "high_concentration"
      ? "Close 1 new client and nurture 2 more"
      : root === "weak_forward_visibility"
      ? "Close the commitment and identify the next conversion"
      : root === "high_labor_dependence"
      ? "Launch your productized offering and get your first customer"
      : "Finalize the retainer agreement and identify the second conversion",
    detail: root === "high_concentration"
      ? `Target: bring your top source below ${Math.max(50, n.largest_source_pct - 15)}%. Even one new client at 10% makes a structural difference.`
      : root === "weak_forward_visibility"
      ? `Target: increase forward-secured revenue from ${n.forward_secured_pct}% toward ${Math.min(100, n.forward_secured_pct + 15)}%. One signed commitment changes your runway.`
      : `Target: have at least one arrangement generating revenue that does not require your daily labor.`,
    success_metric: "1 structural change completed (new client, signed retainer, or launched product)",
  });

  // Weeks 5-6: Consolidate and measure
  weeks.push({
    week: "Weeks 5-6",
    action: "Measure the impact and plan the next move",
    detail: `Reassess your six structural factors. Has your ${CONSTRAINT_LABELS_PLAIN[root] ?? "primary constraint"} improved? If yes, move to your secondary constraint (${CONSTRAINT_LABELS_PLAIN[constraints.primary_constraint] ?? "next area"}). If not, double down on the same area.`,
    success_metric: "Measurable improvement in at least one structural factor. Ready for reassessment.",
  });

  return weeks;
}

// ─── SCRIPT TEMPLATES ────────────────────────────────────

function generateScriptTemplates(
  constraints: ConstraintHierarchy,
  n: CanonicalInput,
  profile: ResolvedProfile,
): ScriptTemplate[] {
  const scripts: ScriptTemplate[] = [];
  const root = constraints.root_constraint;

  // Always include retainer pitch if relevant
  if (root === "weak_forward_visibility" || root === "low_persistence" || n.forward_secured_pct <= 30) {
    scripts.push({
      id: "SCRIPT-RETAINER",
      title: "Retainer Conversion Pitch",
      context: "Use this when proposing to convert a project-based client to a monthly retainer or ongoing commitment.",
      script: `"I have enjoyed working on [project name] and I think there is an opportunity to make this work better for both of us. Instead of scoping each project individually, I would like to propose a monthly arrangement where you get [X hours / deliverables] per month at a [5-10]% preferred rate. This gives you guaranteed priority access and predictable costs. For me, it means I can plan around your needs instead of scrambling between projects. Would you be open to trying this for 3 months?"`,
    });
  }

  // Client diversification outreach
  if (root === "high_concentration" || n.largest_source_pct >= 50) {
    scripts.push({
      id: "SCRIPT-OUTREACH",
      title: "New Client Outreach Message",
      context: `Use this to reach prospects who could become meaningful income sources (target: 10-15% of total revenue each).`,
      script: `"Hi [Name], I have been doing [specific work] for [industry/clients like them] and wanted to reach out because [specific reason this prospect is a fit]. I specialize in [your core offering] and typically work with clients on a [retainer / project / ongoing] basis. Would you have 15 minutes this week to explore whether there is a fit? I am currently taking on [1-2] new ongoing clients."`,
    });
  }

  // Pricing restructure
  if (root === "high_variability" || root === "low_persistence") {
    scripts.push({
      id: "SCRIPT-PRICING",
      title: "Pricing Restructure Conversation",
      context: "Use this when proposing to restructure variable or project-based pricing into a predictable monthly arrangement.",
      script: `"I have noticed that our work together tends to fluctuate month to month, which makes it harder for both of us to plan. I would like to propose a fixed monthly arrangement at [$X/month] that covers [scope]. This gives you budget predictability and gives me the stability to prioritize your work. If we try it for 3 months, I am confident we will both prefer it."`,
    });
  }

  // Passive income launch
  if (root === "high_labor_dependence" || n.labor_dependence_pct >= 70) {
    scripts.push({
      id: "SCRIPT-PRODUCTIZE",
      title: "Productized Offering Framework",
      context: "Use this framework to design your first non-labor-dependent revenue stream.",
      script: `Step 1: Identify your most repeated deliverable — the thing you do most often for clients.\nStep 2: Package it at a fixed price with a defined scope (e.g., "[Service] Package — $[X]/month, includes [deliverables]").\nStep 3: Price it at 70-80% of your custom rate. The margin comes from efficiency, not higher pricing.\nStep 4: Offer it first to existing clients: "I have created a streamlined version of [service] that I think would work well for you at a lower price point."\nStep 5: Target: 2-3 clients on this package within 60 days = 15-20% of revenue on a lower-effort model.`,
    });
  }

  return scripts.slice(0, 3);
}
