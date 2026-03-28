/* ------------------------------------------------------------------ */
/*  industry-tailoring.ts                                              */
/*  Generates industry-specific copy for report sections               */
/*  No API required — deterministic, based on profile data             */
/* ------------------------------------------------------------------ */

interface TailoringInput {
  industry: string;        // e.g. "Technology", "Real Estate", "Consulting"
  structure: string;       // e.g. "independent contractor", "business owner"
  incomeModel: string;     // e.g. "commission-driven", "project-based"
  score: number;
  tier: string;            // "limited" | "developing" | "established" | "high"
  activeIncome: number;
  concentration: number;   // largest_source_pct
  recurrence: number;      // income_persistence_pct
  forwardVisibility: number;
  laborDependence: number;
  continuityMonths: number;
  dominantConstraint: string;
}

export interface TailoredCopy {
  diagnosticSentence: string;
  killerLine: string;
  constraintContext: string;
  fragilityContext: string;
  actionContext: string;
  incomeBreakdownInsight: string;
  riskContext: string;
}

export function generateTailoredCopy(input: TailoringInput): TailoredCopy {
  const { industry, structure, incomeModel, score, tier, activeIncome, concentration, recurrence, forwardVisibility, laborDependence, continuityMonths, dominantConstraint } = input;
  const ind = industry || "your industry";
  const struct = structure || "professional";
  const model = incomeModel || "income model";

  // ── DIAGNOSTIC SENTENCE — the "killer" opening diagnosis ──
  const diagnosticSentence = (() => {
    if (tier === "high") return `As a ${struct} in ${ind}, your income structure is unusually durable. Most ${model} professionals in ${ind} do not reach this level of structural protection.`;
    if (tier === "established") return `Your ${model} income in ${ind} has real structural support. But it still depends on a specific set of conditions — and ${ind} conditions shift.`;

    if (dominantConstraint === "labor_dependence") {
      return `Your income as a ${struct} in ${ind} is not weak because you earn too little. It is structurally limited because ${laborDependence}% of it stops when your daily work stops — a pattern common in ${model} arrangements.`;
    }
    if (dominantConstraint === "source_concentration") {
      return `As a ${struct} in ${ind}, your income is not small — but ${concentration}% of it depends on a single source. In ${model} structures, that level of concentration creates outsized risk from a single client decision.`;
    }
    if (dominantConstraint === "forward_visibility") {
      return `Your ${model} income in ${ind} has limited forward visibility — only ${forwardVisibility}% is secured ahead of time. For a ${struct}, this means each month starts with significant uncertainty about what will come in.`;
    }
    if (dominantConstraint === "low_continuity") {
      return `As a ${struct} earning through ${model} work in ${ind}, your income would continue for only about ${continuityMonths < 1 ? "weeks" : `${continuityMonths} months`} if you stopped working. That is thin continuity for this type of structure.`;
    }
    if (dominantConstraint === "few_sources") {
      return `Your ${model} income in ${ind} depends on too few sources. For a ${struct}, losing any one of them would materially change your financial position.`;
    }
    return `Your income structure as a ${struct} in ${ind} has specific weaknesses that are not visible in your day-to-day earnings. This report identifies them.`;
  })();

  // ── KILLER LINE — the income breakdown punch line ──
  const killerLine = (() => {
    if (activeIncome >= 80) {
      return `${activeIncome}% of your ${model} income in ${ind} is earned once and stops. As a ${struct}, that means almost all of your revenue resets the moment you stop working.`;
    }
    if (activeIncome + (100 - activeIncome - recurrence) >= 70) {
      return `${activeIncome}% of your income requires daily effort, and only ${recurrence}% renews automatically. For a ${struct} in ${ind}, this is a structure that must be actively rebuilt every month.`;
    }
    if (activeIncome <= 40) {
      return `${100 - activeIncome}% of your ${model} income continues without your daily effort. For a ${struct} in ${ind}, that is meaningful structural protection that most peers do not have.`;
    }
    return `${activeIncome}% of your income as a ${struct} in ${ind} depends on your continued daily work. The rest either repeats or survives interruption — but the active portion still dominates.`;
  })();

  // ── CONSTRAINT CONTEXT — adds industry meaning to the primary constraint ──
  const constraintContext = (() => {
    if (dominantConstraint === "labor_dependence") {
      return `In ${ind}, ${model} professionals with labor dependence above ${laborDependence > 70 ? "70" : "50"}% typically face the steepest score ceilings. Reducing this is the fastest structural improvement for a ${struct}.`;
    }
    if (dominantConstraint === "source_concentration") {
      return `For ${model} professionals in ${ind}, concentration above ${concentration > 50 ? "50" : "40"}% from a single source creates disproportionate structural risk. Rebalancing does not mean losing your best client — it means adding weight elsewhere.`;
    }
    if (dominantConstraint === "forward_visibility") {
      return `${model} structures in ${ind} often have weak forward visibility because work is sold reactively. Shifting even 15-20% of revenue to advance commitments would meaningfully change this score.`;
    }
    if (dominantConstraint === "low_continuity") {
      return `For a ${struct} in ${ind}, continuity of ${continuityMonths < 1 ? "less than a month" : `${continuityMonths} months`} means any work interruption creates immediate financial pressure. Building one durable revenue stream changes this.`;
    }
    return `For ${model} professionals in ${ind}, the primary constraint is typically the structural factor most tied to daily operational patterns. Addressing it first creates the most efficient path to a higher score.`;
  })();

  // ── FRAGILITY CONTEXT — industry-specific risk framing ──
  const fragilityContext = (() => {
    if (tier === "limited") {
      return `As a ${struct} in ${ind} with a ${model} structure, your income has almost no structural buffer. The scenarios below reflect the specific disruptions most likely to affect ${model} arrangements in ${ind}.`;
    }
    if (tier === "developing") {
      return `Your ${model} structure in ${ind} can absorb a minor disruption, but not two close together. The scenarios below are calibrated to the types of interruptions ${struct}s in ${ind} most commonly face.`;
    }
    if (tier === "established") {
      return `Most common disruptions would not break your ${model} structure in ${ind}. The scenarios below show the specific conditions that could still create pressure for a ${struct} at this level.`;
    }
    return `Your ${model} income in ${ind} has strong structural protection. The scenarios below test the outer boundaries of what your structure as a ${struct} can absorb.`;
  })();

  // ── ACTION CONTEXT — industry-specific framing for recommendations ──
  const actionContext = (() => {
    if (dominantConstraint === "labor_dependence") {
      return `For a ${struct} in ${ind}, reducing labor dependence typically means converting active service delivery into recurring arrangements — retainers, maintenance contracts, or productized offers specific to ${ind}.`;
    }
    if (dominantConstraint === "source_concentration") {
      return `In ${ind}, ${model} professionals reduce concentration by adding one new client or revenue channel that operates on a different cycle from their primary source.`;
    }
    if (dominantConstraint === "forward_visibility") {
      return `For ${model} structures in ${ind}, improving forward visibility usually means proposing quarterly or annual engagement frameworks to existing clients, even at modest discounts.`;
    }
    return `For a ${struct} in ${ind}, the most effective structural improvements target the single weakest factor first, then compound with a supporting change.`;
  })();

  // ── INCOME BREAKDOWN INSIGHT ──
  const incomeBreakdownInsight = (() => {
    if (recurrence >= 60) {
      return `Your recurring revenue of ${recurrence}% is above average for ${model} professionals in ${ind}. This is a structural strength that provides predictable income flow.`;
    }
    if (recurrence >= 30) {
      return `At ${recurrence}% recurring revenue, your ${model} structure in ${ind} has a foundation to build on. Increasing this by even 15 percentage points would meaningfully improve stability.`;
    }
    return `With only ${recurrence}% recurring revenue, most of your ${model} income in ${ind} must be re-earned each period. This is the structural pattern most limiting your score.`;
  })();

  // ── RISK CONTEXT ──
  const riskContext = (() => {
    if (concentration >= 50) {
      return `With ${concentration}% from your largest source, a single client departure would cause severe structural damage to your ${model} income in ${ind}. This is the most acute risk in your current structure.`;
    }
    if (laborDependence >= 70) {
      return `At ${laborDependence}% labor dependence, any disruption to your ability to work — illness, burnout, transition — directly reduces your ${model} income in ${ind}. This is your primary structural exposure.`;
    }
    if (forwardVisibility <= 20) {
      return `With only ${forwardVisibility}% forward visibility, your ${model} income in ${ind} has minimal committed revenue ahead. Each month starts close to zero in terms of confirmed income.`;
    }
    return `Your ${model} structure in ${ind} has specific risk exposures tied to how income flows through a ${struct} arrangement. The scenarios below quantify the most likely damage.`;
  })();

  return {
    diagnosticSentence,
    killerLine,
    constraintContext,
    fragilityContext,
    actionContext,
    incomeBreakdownInsight,
    riskContext,
  };
}
