// RUNPAYWAY™ — Advisor Analyze API
// Generates personalized, industry-aware guidance for user goals using AI

import { NextResponse } from "next/server";
import { getVocabulary } from "@/lib/industry-vocabulary";

export const dynamic = "force-dynamic";
const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY || "";

interface AdvisorAnalyzeRequest {
  goal: string;
  industry: string;
  score: number;
  band: string;
  dimensions: Record<string, number>;
  roadmapSteps?: Array<{ action: string; lift: number; desc: string }>;
}

export interface AdvisorAnalyzeResult {
  generated_at: string;
  goal: string;
  industry: string;
  guidance: string;
  recommended_steps: string[];
  timeline_estimate: string;
}

const SYSTEM_PROMPT = `You are an income stability advisor for RunPayway™. Your role is to help individuals understand what's required to achieve their personal goals within their income structure.

CRITICAL RULES:
- Sound like a peer advisor, not an algorithm. Use conversational language ("Here's what I'm seeing", "Your fastest move")
- Never guarantee outcomes. Use "could," "likely to," "if," "depends on"
- Always acknowledge external factors ("if clients agree", "depending on market response")
- Be action-first: lead with the specific move they should take
- Connect their goal to the 6 dimensions of income stability (Persistence, Diversification, Forward Visibility, Concentration, Variability, Labor Dependence)
- Be industry-specific: use their vocabulary and reference their income patterns
- Keep response concise: 3-4 short paragraphs max
- End with a single next step they can take this week
- No fear framing, no fintech jargon, no overpromising
- Position guidance as a framework, not a prediction`;

export async function POST(req: Request) {
  try {
    const body: AdvisorAnalyzeRequest = await req.json();

    if (!body.goal || !body.industry) {
      return NextResponse.json(
        { error: "Missing required fields: goal, industry" },
        { status: 400 },
      );
    }

    if (!ANTHROPIC_API_KEY) {
      return NextResponse.json(generateFallback(body));
    }

    const vocab = getVocabulary(body.industry);
    const roadmapContext = body.roadmapSteps
      ? `\n\nTheir current 4-step roadmap:\n${body.roadmapSteps.map((s, i) => `${i + 1}. ${s.action} (+${s.lift} pts)`).join("\n")}`
      : "";

    const userPrompt = `Analyze this individual's goal and provide personalized advisor guidance:

THEIR GOAL:
"${body.goal}"

CURRENT SITUATION:
- Industry: ${body.industry}
- Income Stability Score: ${body.score}/100 (${body.band} Stability)
- Current dimensions:
  * Persistence (recurring revenue): ${body.dimensions.persistence_pct || 0}%
  * Diversification (# sources): ${body.dimensions.source_diversity_count || 0}
  * Forward Visibility (locked-in revenue): ${body.dimensions.forward_secured_pct || 0}%
  * Concentration (top source): ${body.dimensions.largest_source_pct || 0}%
  * Variability: ${body.dimensions.earnings_variability || "moderate"}
  * Labor Dependence (passive income): ${body.dimensions.labor_dependence_pct || 0}%

INDUSTRY CONTEXT:
${vocab?.operating_structure || ""} operating model is typical for ${body.industry}.
${vocab?.income_model || ""} income model is standard.

${roadmapContext}

Provide advisor guidance in this format:

[Opening insight - 2 sentences] Here's what I'm seeing about their situation and goal. Be specific to their industry and current structure.

[Analysis - 2-3 sentences] To unlock what they're after, which dimensions matter most? What's the core structural change required?

[Action recommendation - 2-3 sentences] Here's the move most likely to get them there. Be specific and operational, not generic. Acknowledge execution depends on their actions ("if clients agree", etc).

[Next step - 1-2 sentences] One thing they can do this week to start.

Return ONLY this text, no JSON formatting.`;

    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": ANTHROPIC_API_KEY,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-sonnet-4-5-20250514",
        max_tokens: 800,
        system: SYSTEM_PROMPT,
        messages: [{ role: "user", content: userPrompt }],
      }),
    });

    if (!response.ok) {
      return NextResponse.json(generateFallback(body));
    }

    const data = await response.json();
    const guidance = data.content?.[0]?.text || "";

    // Parse the response into paragraphs
    const paragraphs = guidance.split("\n\n").filter((p: string) => p.trim());

    const result: AdvisorAnalyzeResult = {
      generated_at: new Date().toISOString(),
      goal: body.goal,
      industry: body.industry,
      guidance: guidance,
      recommended_steps: extractSteps(guidance),
      timeline_estimate: extractTimeline(guidance),
    };

    return NextResponse.json(result);
  } catch (error) {
    console.error("Advisor analyze error:", error);
    return NextResponse.json(
      { error: "Advisor analysis failed" },
      { status: 500 },
    );
  }
}

/** Extract action steps from advisor guidance */
function extractSteps(guidance: string): string[] {
  const steps: string[] = [];
  const lines = guidance.split("\n");

  for (const line of lines) {
    // Look for numbered lists or key action phrases
    if (/^\d\.|—|Here's|move|step|action/i.test(line.trim())) {
      const cleaned = line.replace(/^\d\.\s|^—\s/, "").trim();
      if (cleaned.length > 10) {
        steps.push(cleaned);
      }
    }
  }

  return steps.slice(0, 3);
}

/** Extract timeline estimate from guidance */
function extractTimeline(guidance: string): string {
  const timePattern = /(\d+[-–]\d+\s+(?:weeks?|months?|days?)|\d+\s+(?:week|month|day))/i;
  const match = guidance.match(timePattern);
  return match ? match[0] : "4–8 weeks";
}

/** Deterministic fallback when API is unavailable */
function generateFallback(body: AdvisorAnalyzeRequest): AdvisorAnalyzeResult {
  const industry = body.industry || "your industry";
  const goal = body.goal || "achieve your income stability goal";
  const band = body.band || "your current stability level";

  const guidance = `Here's what I'm seeing: You're looking to ${goal.toLowerCase()}. That's a meaningful goal, and it's achievable within your current ${industry} structure.

To unlock what you're after, the core structural change depends on your specific bottleneck. Right now you're at ${band} Stability, which means there are leverage points we can address.

Your fastest move is to focus on the dimension that's holding you back most. If it's recurring revenue, move one client to a retainer. If it's forward visibility, secure commitments one quarter out. If it's diversification, add one new income stream. If you execute on this, combined with the momentum from your other moves, you could shift your stability level in 8–12 weeks. The timeline depends on how quickly you can move.

This week, identify which dimension is your biggest constraint, then have one conversation that addresses it.`;

  return {
    generated_at: new Date().toISOString(),
    goal: body.goal,
    industry: body.industry,
    guidance: guidance,
    recommended_steps: [
      "Identify your biggest constraint dimension",
      "Have one conversation this week addressing it",
      "Track progress toward your goal",
    ],
    timeline_estimate: "8–12 weeks",
  };
}
