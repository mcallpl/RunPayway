// RUNPAYWAY™ — PressureMap™ API
// Generates real-time, per-user structural intelligence using AI
// One call per assessment, stored with the record

import { NextResponse } from "next/server";

const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY || "";

interface PressureMapRequest {
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

const SYSTEM_PROMPT = `You are the PressureMap™ engine for RunPayway™, an income stability assessment platform. You generate real-time structural intelligence briefings for individuals based on their industry, operating structure, income model, and assessment results.

CRITICAL RULES:
- Never provide financial advice, investment recommendations, or predictions
- Never mention specific companies, stocks, or investment vehicles
- Never fabricate statistics — use directional language ("rising", "declining", "accelerating") not fake numbers
- Never reference RunPayway competitors or other scoring tools
- Write in confident, institutional prose — like a strategy briefing, not a blog post
- Address the user directly ("your", "you")
- Connect every observation back to the user's specific structural profile
- Keep each section to 2-3 sentences maximum — concise, dense, no filler
- Use present tense — this is about right now, not the future`;

export async function POST(req: Request) {
  try {
    const body: PressureMapRequest = await req.json();

    if (!ANTHROPIC_API_KEY) {
      // Fallback: return a generic but useful briefing without AI
      return NextResponse.json(generateFallback(body));
    }

    const userPrompt = `Generate a PressureMap™ briefing for this individual:

PROFILE:
- Industry: ${body.industry}
- Operating Structure: ${body.operating_structure}
- Income Model: ${body.income_model}
- Years in current structure: ${body.years_in_structure}
- Income Stability Score: ${body.score}/100 (${body.band})
- Weakest structural factor: ${body.weakest_factor} (current value: ${body.weakest_factor_value})

STRUCTURAL DATA:
- Recurring revenue: ${body.recurrence_pct}%
- Top client concentration: ${body.concentration_pct}%
- Forward visibility: ${body.forward_visibility_pct}%
- Labor dependence: ${body.labor_dependence_pct}%
- Earnings variability: ${body.variability_level}

Return EXACTLY three sections in this JSON format:
{
  "pressure": "[2-3 sentences] What real-world forces in their specific industry, for their specific operating structure and income model, are currently working AGAINST their weakest structural factor. Be specific to the intersection of industry + structure + model. Do not be generic.",
  "tailwind": "[2-3 sentences] What current condition in their industry gives this specific profile a structural advantage or window of opportunity right now. This should be genuinely favorable, not a silver lining on bad news.",
  "leverage_move": "[2-3 sentences] The single highest-leverage structural change this person could make RIGHT NOW given their industry conditions, operating structure, income model, score, and weakest factor. Be specific and operational — not 'diversify your income' but the exact type of diversification that makes sense for their profile."
}

Return ONLY the JSON object, no other text.`;

    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": ANTHROPIC_API_KEY,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-sonnet-4-5-20250514",
        max_tokens: 600,
        system: SYSTEM_PROMPT,
        messages: [{ role: "user", content: userPrompt }],
      }),
    });

    if (!response.ok) {
      return NextResponse.json(generateFallback(body));
    }

    const data = await response.json();
    const text = data.content?.[0]?.text || "";

    // Parse the JSON response
    let parsed;
    try {
      // Extract JSON from potential markdown code blocks
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      parsed = JSON.parse(jsonMatch ? jsonMatch[0] : text);
    } catch {
      return NextResponse.json(generateFallback(body));
    }

    const result: PressureMapResult = {
      generated_at: new Date().toISOString(),
      industry: body.industry,
      operating_structure: body.operating_structure,
      income_model: body.income_model,
      pressure: parsed.pressure || "",
      tailwind: parsed.tailwind || "",
      leverage_move: parsed.leverage_move || "",
    };

    return NextResponse.json(result);
  } catch {
    return NextResponse.json(
      { error: "PressureMap generation failed" },
      { status: 500 },
    );
  }
}

/** Deterministic fallback when API is unavailable */
function generateFallback(body: PressureMapRequest): PressureMapResult {
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

  const factorKey = factor.includes("recurr") ? "recurrence"
    : factor.includes("concentr") ? "concentration"
    : factor.includes("forward") || factor.includes("visib") ? "forward_visibility"
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
