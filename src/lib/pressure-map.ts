/* ------------------------------------------------------------------ */
/*  RunPayway™ — PressureMap™ Client-Side Generator                    */
/*  Deterministic fallback that runs in the browser                    */
/* ------------------------------------------------------------------ */

export interface PressureMapInput {
  industry: string;
  operating_structure: string;
  income_model: string;
  years_in_structure: string;
  score: number;
  band: string;
  weakest_factor: string;
  weakest_factor_value: string;
  recurrence_pct: number;
  concentration_pct: number;
  forward_visibility_pct: number;
  labor_dependence_pct: number;
  variability_level: string;
}

export interface PressureMapResult {
  generated_at: string;
  industry: string;
  operating_structure: string;
  income_model: string;
  pressure: string;
  tailwind: string;
  leverage_move: string;
}

export function generatePressureMap(body: PressureMapInput): PressureMapResult {
  const factor = body.weakest_factor.toLowerCase();
  const industry = body.industry || "your industry";
  const model = body.income_model || "your income model";

  const pressureMap: Record<string, string> = {
    recurrence: `Professionals in ${industry} operating under a ${model.toLowerCase()} structure are facing increasing pressure on recurring revenue as clients shift toward shorter commitments and project-based engagements. Your recurrence rate of ${body.recurrence_pct}% is your most exposed structural factor in the current environment.`,
    concentration: `Income concentration remains a persistent structural risk in ${industry}, particularly for ${model.toLowerCase()} professionals. With ${body.concentration_pct}% of your income dependent on your largest source, a single client loss would disproportionately impact your stability.`,
    forward_visibility: `Forward revenue visibility in ${industry} has been compressing as decision cycles lengthen and commitments shorten. At ${body.forward_visibility_pct}% forward coverage, your pipeline provides limited buffer against near-term disruption.`,
    labor_dependence: `Labor dependence at ${body.labor_dependence_pct}% means your income generation capacity is directly tied to your personal output. In ${industry}, this creates acute vulnerability to any disruption — health, burnout, or market slowdown — that reduces your ability to work.`,
    variability: `Earnings variability at the ${body.variability_level} level is characteristic of ${model.toLowerCase()} professionals in ${industry} who lack contractual minimums or retainer structures. This volatility makes financial planning difficult and amplifies the impact of every other structural weakness.`,
  };

  const tailwindMap: Record<string, string> = {
    recurrence: `The shift toward subscription and retainer models across ${industry} is creating new structural opportunities for professionals willing to repackage their services. Early movers who establish recurring arrangements are capturing client loyalty before competitors adapt.`,
    concentration: `Client acquisition costs in ${industry} are declining as digital channels mature, making it more feasible to build a diversified client base without proportional increases in marketing spend.`,
    forward_visibility: `Demand for ${model.toLowerCase()} services in ${industry} remains structurally healthy. Professionals who proactively secure forward commitments — even at modest discounts — are building pipeline advantages that compound over subsequent quarters.`,
    labor_dependence: `The infrastructure for productizing and scaling professional services has never been more accessible. ${industry} professionals with established expertise can now create leverage through digital delivery, licensing, or team-based models with lower barriers to entry than even two years ago.`,
    variability: `Clients in ${industry} are increasingly receptive to structured payment arrangements — retainers, milestone billing, and minimum commitments — as they seek budget predictability themselves. This alignment of incentives creates an opening to reduce variability on both sides.`,
  };

  const leverageMap: Record<string, string> = {
    recurrence: `Introduce a structured monthly advisory or maintenance engagement to your top 3 existing clients. Package ongoing access, periodic reviews, and priority service at a fixed monthly rate. This directly converts one-time relationships into recurring revenue without requiring new client acquisition.`,
    concentration: `Allocate dedicated time each week to developing a second revenue channel — whether that is a new client segment, a complementary service line, or a referral partnership. The goal is not to replace your primary source but to ensure no single relationship controls more than 40% of your income.`,
    forward_visibility: `Propose 6-month or 12-month engagement frameworks to your current clients, even at a slight discount. Each signed commitment extends your forward visibility and reduces the portion of your income that resets to zero each month.`,
    labor_dependence: `Identify the single most repeatable element of your service delivery and package it as a product — a template, course, audit framework, or licensed methodology. Even a modest passive revenue stream fundamentally changes your structural resilience.`,
    variability: `Establish a minimum monthly retainer or base fee with your primary clients. Even a small guaranteed minimum — combined with variable upside — dramatically reduces month-to-month volatility and improves structural stability.`,
  };

  const factorKey = factor.includes("recurr") || factor.includes("persist") ? "recurrence"
    : factor.includes("concentr") || factor.includes("largest") || factor.includes("source_pct") ? "concentration"
    : factor.includes("forward") || factor.includes("visib") || factor.includes("secured") ? "forward_visibility"
    : factor.includes("labor") || factor.includes("depend") ? "labor_dependence"
    : "variability";

  return {
    generated_at: new Date().toISOString(),
    industry: body.industry,
    operating_structure: body.operating_structure,
    income_model: body.income_model,
    pressure: pressureMap[factorKey] || pressureMap.variability,
    tailwind: tailwindMap[factorKey] || tailwindMap.variability,
    leverage_move: leverageMap[factorKey] || leverageMap.variability,
  };
}
