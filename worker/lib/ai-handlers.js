// RunPayway — Claude-powered endpoint handlers

import { callClaude, profileBlock } from "./claude.js";
import { sanitizeString, sanitizeNumber } from "./sanitize.js";

// ══════════════════════════════════════════════════════════
// PRESSUREMAP
// ══════════════════════════════════════════════════════════

export async function handlePressureMap(body, env, corsHeaders) {
  body.industry = sanitizeString(body.industry, 200) || body.industry;
  body.operating_structure = sanitizeString(body.operating_structure, 200) || body.operating_structure;
  body.income_model = sanitizeString(body.income_model, 200) || body.income_model;
  body.score = sanitizeNumber(body.score, 0, 100, body.score || 0);

  const system = `You are the PressureMap engine for RunPayway. You produce real-time structural intelligence specific to one individual's income architecture.

ROLE: Structural analyst producing a private intelligence briefing.
OUTPUT: Three sections, each exactly 2 sentences. No more.`;

  const vc = body.vocab_context || {};
  const vocabBlock = vc.pressure_framing ? `\nINDUSTRY VOCABULARY (use this language — do NOT use generic income terminology):
- Structural pressure in this industry: ${vc.pressure_framing}
- Structural opportunity: ${vc.tailwind_framing}
- Specific arrangement types to recommend: ${vc.arrangement_types}
- Peer group: ${vc.peer_group_label}\n` : "";

  const user = `Generate a PressureMap briefing:

${profileBlock(body)}
${vocabBlock}
Return this JSON:
{
  "pressure": "[Exactly 2 sentences] The specific structural force in ${body.industry} that is currently working against this ${body.operating_structure} with a ${body.income_model} model, given their weakest factor is ${body.weakest_factor} at the values shown above. Name the structural dynamic, not a generic industry trend. Use the industry vocabulary above.",
  "tailwind": "[Exactly 2 sentences] The specific current condition in ${body.industry} that creates a structural opening for this ${body.operating_structure} with a ${body.income_model} model to improve their weakest factor right now. Reference specific arrangement types from the vocabulary.",
  "leverage_move": "[Exactly 2 sentences] The single highest-leverage structural change — name the exact type of arrangement from the vocabulary (${vc.arrangement_types || "retainer, standing agreement, prepaid package, productized service, licensing deal"}) that fits a ${body.operating_structure} in ${body.industry} earning through ${body.income_model}."
}

Return ONLY the JSON.`;

  const parsed = await callClaude(system, user, env);
  if (!parsed.pressure || !parsed.tailwind || !parsed.leverage_move) {
    return new Response(JSON.stringify({ error: "Incomplete" }), { status: 502, headers: corsHeaders });
  }
  return new Response(JSON.stringify(parsed), { headers: corsHeaders });
}

// ══════════════════════════════════════════════════════════
// PLAIN ENGLISH
// ══════════════════════════════════════════════════════════

export async function handlePlainEnglish(body, env, corsHeaders) {
  body.industry = sanitizeString(body.industry, 200) || body.industry;
  body.operating_structure = sanitizeString(body.operating_structure, 200) || body.operating_structure;
  body.income_model = sanitizeString(body.income_model, 200) || body.income_model;
  body.score = sanitizeNumber(body.score, 0, 100, body.score || 0);

  const vc = body.vocab_context || {};
  const vocabInstructions = vc.pressure_framing ? `
CRITICAL: Use industry-specific vocabulary. Do NOT use generic terms like "recurring revenue" or "forward visibility."
Instead use terms from this vocabulary:
- Structural pressure: ${vc.pressure_framing}
- Arrangement types: ${vc.arrangement_types}
- Peer group: ${vc.peer_group_label}` : "";

  const system = `You are a structural income analyst for RunPayway. You write the "In Plain English" section of the Income Stability Report.

ROLE: Senior analyst explaining diagnostic results directly to the person who took the assessment. You speak to them as a fellow professional in ${body.industry}.
GOAL: Make the reader feel that this score revealed something they did not already know about their income structure. This is what makes the report worth the price.
${vocabInstructions}

OUTPUT REQUIREMENTS:
- "interpretation": Exactly 3-4 sentences. Start with what the score means structurally for someone in ${body.industry}. Then explain the single most important thing it reveals about their specific situation. Then connect it to their daily reality as a ${body.operating_structure} earning through ${body.income_model}. End with what this means if conditions change.
- "why_not_higher": Exactly 1-2 sentences. The specific structural factor preventing a higher score, using language a ${body.operating_structure} in ${body.industry} would immediately recognize.`;

  const user = `Write the Plain English interpretation:

${profileBlock(body)}

Return this JSON:
{
  "interpretation": "[3-4 sentences as described above]",
  "why_not_higher": "[1-2 sentences] Why the score is ${body.score} and not higher, specific to their ${body.weakest_factor}. Use industry-specific terms, not generic structural language."
}

Return ONLY the JSON.`;

  const parsed = await callClaude(system, user, env, 400);
  if (!parsed.interpretation) {
    return new Response(JSON.stringify({ error: "Incomplete" }), { status: 502, headers: corsHeaders });
  }
  return new Response(JSON.stringify({
    interpretation: parsed.interpretation,
    why_not_higher: parsed.why_not_higher || "",
  }), { headers: corsHeaders });
}

// ══════════════════════════════════════════════════════════
// ACTION PLAN
// ══════════════════════════════════════════════════════════

export async function handleActionPlan(body, env, corsHeaders) {
  body.industry = sanitizeString(body.industry, 200) || body.industry;
  body.operating_structure = sanitizeString(body.operating_structure, 200) || body.operating_structure;
  body.income_model = sanitizeString(body.income_model, 200) || body.income_model;
  body.score = sanitizeNumber(body.score, 0, 100, body.score || 0);

  const vc = body.vocab_context || {};
  const vocabInstructions = vc.arrangement_types ? `
CRITICAL VOCABULARY RULES:
- You are advising a ${body.operating_structure} in ${body.industry}. Speak their language.
- Use these specific arrangement types: ${vc.arrangement_types}
- Industry pressure context: ${vc.pressure_framing || ""}
- Industry opportunity context: ${vc.tailwind_framing || ""}
- Do NOT use generic terms. Name specific deals, clients, arrangements this person would recognize.` : "";

  const system = `You are a structural income strategist for RunPayway. You write the Action Plan section of the Income Stability Report.

ROLE: Management consultant who has worked extensively in ${body.industry}, delivering a strategy recommendation to a private client.
GOAL: Make the reader feel that this action plan was written by someone who understands their industry. Every recommendation should use the vocabulary of ${body.industry}, not generic income advice.
${vocabInstructions}

OUTPUT REQUIREMENTS:
- primary_action: 2-3 sentences. Name the exact structural change using ${body.industry}-specific terms. Reference specific arrangement types.
- primary_how: 2-3 sentences. Exactly how to execute. What to offer, who to approach, what language to use. Specific to a ${body.operating_structure} in ${body.industry}.
- supporting_action: 1-2 sentences. A second change that compounds with the first. Industry-specific.
- supporting_how: 1-2 sentences. How to execute it.
- combined_interpretation: 1-2 sentences. What the income structure looks like after both changes.
- tradeoff_upside: 1-2 sentences. The structural benefit in terms a ${body.operating_structure} would care about.
- tradeoff_cost: 1-2 sentences. The realistic effort or sacrifice required.
- tradeoff_verdict: Exactly 1 sentence. Whether it is worth doing and why — stated with conviction.`;

  const user = `Write the action plan:

${profileBlock(body)}

Primary constraint: ${body.weakest_factor}
Top projected change: ${body.top_change || "Reduce " + body.weakest_factor}
Projected lift: ${body.projected_lift || "Unknown"}

Return this JSON:
{
  "primary_action": "[2-3 sentences] Use ${body.industry}-specific terminology.",
  "primary_how": "[2-3 sentences] Specific to a ${body.operating_structure} in ${body.industry} with a ${body.income_model} model. Name who to talk to, what to propose, how to frame it.",
  "supporting_action": "[1-2 sentences] Industry-specific.",
  "supporting_how": "[1-2 sentences]",
  "combined_interpretation": "[1-2 sentences] Reference the projected score if provided: ${body.projected_lift}",
  "tradeoff_upside": "[1-2 sentences]",
  "tradeoff_cost": "[1-2 sentences]",
  "tradeoff_verdict": "[1 sentence] State with conviction whether this is worth doing."
}

Return ONLY the JSON.`;

  const parsed = await callClaude(system, user, env, 800);
  if (!parsed.primary_action) {
    return new Response(JSON.stringify({ error: "Incomplete" }), { status: 502, headers: corsHeaders });
  }
  return new Response(JSON.stringify(parsed), { headers: corsHeaders });
}

// ══════════════════════════════════════════════════════════
// PERSONALIZE — unified narrative generation
// ══════════════════════════════════════════════════════════

export async function handlePersonalize(body, env, corsHeaders) {
  const EMPTY_RESPONSE = {
    why_this_score: "",
    action_script: "",
    what_becomes_possible: "",
    email_hook: "",
    dashboard_headline: "",
    comparative_narrative: "",
  };

  try {
    body.industry = sanitizeString(body.industry, 200) || body.industry;
    body.operating_structure = sanitizeString(body.operating_structure, 200) || body.operating_structure;
    body.income_model = sanitizeString(body.income_model, 200) || body.income_model;
    body.score = sanitizeNumber(body.score, 0, 100, body.score || 0);
    body.band = sanitizeString(body.band, 100) || body.band;
    body.prior_score = sanitizeNumber(body.prior_score, 0, 100, 0);
    body.prior_band = sanitizeString(body.prior_band, 100) || "";
    body.weakest_factor = sanitizeString(body.weakest_factor, 200) || body.weakest_factor;
    body.strongest_factor = sanitizeString(body.strongest_factor, 200) || "";
    body.recurrence_pct = sanitizeNumber(body.recurrence_pct, 0, 100, 0);
    body.concentration_pct = sanitizeNumber(body.concentration_pct, 0, 100, 0);
    body.forward_visibility_pct = sanitizeNumber(body.forward_visibility_pct, 0, 100, 0);
    body.labor_dependence_pct = sanitizeNumber(body.labor_dependence_pct, 0, 100, 0);
    body.variability_level = sanitizeString(body.variability_level, 50) || "moderate";
    body.continuity_months = sanitizeNumber(body.continuity_months, 0, 120, 0);
    body.active_income_pct = sanitizeNumber(body.active_income_pct, 0, 100, 0);
    body.persistent_income_pct = sanitizeNumber(body.persistent_income_pct, 0, 100, 0);
    body.fragility_class = sanitizeString(body.fragility_class, 100) || "";
    body.top_lift_action = sanitizeString(body.top_lift_action, 200) || "";
    body.top_lift_points = sanitizeNumber(body.top_lift_points, 0, 50, 0);
    body.projected_score = sanitizeNumber(body.projected_score, 0, 100, 0);
    body.risk_drop = sanitizeNumber(body.risk_drop, 0, 100, 0);
    body.assessment_title = sanitizeString(body.assessment_title, 200) || "";

    const vc = body.vocab_context || {};
    const hasPrior = body.prior_score && body.prior_score > 0;
    const comparativeInstruction = hasPrior
      ? `[2-3 sentences] What changed between their prior score of ${body.prior_score} and current ${body.score}. What structural shift caused the movement.`
      : "Return empty string";

    const system = `You are a senior income structure advisor writing a private diagnostic brief for one client. You have deep expertise in ${body.industry}.

VOICE: Direct, specific, confident. Speak to the client by situation, not by category. Reference their exact numbers. Name specific arrangement types from their industry. Never use generic phrases like "recurring revenue" — use industry terms.

INDUSTRY VOCABULARY:
- Structural pressure: ${sanitizeString(vc.pressure_framing, 500) || "general market dynamics"}
- Arrangement types: ${sanitizeString(vc.arrangement_types, 500) || "retainer, standing agreement, prepaid package"}
- Peer group: ${sanitizeString(vc.peer_group_label, 200) || "independent professionals"}

OUTPUT: Return valid JSON with exactly these 6 keys. Each must be personalized to THIS person's exact numbers, industry, and income model.`;

    const user = `Write the personalized narrative for this assessment:

${profileBlock(body)}

ADDITIONAL CONTEXT:
- Strongest factor: ${body.strongest_factor}
- Recurring revenue: ${body.recurrence_pct}%
- Concentration: ${body.concentration_pct}%
- Forward visibility: ${body.forward_visibility_pct}%
- Labor dependence: ${body.labor_dependence_pct}%
- Active income: ${body.active_income_pct}%
- Persistent income: ${body.persistent_income_pct}%
- Fragility class: ${body.fragility_class}
- Top lift action: ${body.top_lift_action} (+${body.top_lift_points} pts)
- Projected score: ${body.projected_score}
- Prior score: ${hasPrior ? body.prior_score + " (" + body.prior_band + ")" : "None"}
- Assessment title: ${body.assessment_title}

Return this JSON:
{
  "why_this_score": "[3-4 sentences] What their score of ${body.score} reveals about their specific situation as a ${body.operating_structure} in ${body.industry}. Reference their exact numbers. Make them feel understood — name something about their structure they know is true but haven't articulated.",

  "action_script": "[4-5 sentences] The single most important structural change, written as a specific instruction. Name who to call, what to propose, how to frame it, and what language to use. This must be so specific that the person can act on it today — not generic advice.",

  "what_becomes_possible": "[3 sentences] What changes in their daily life and business if they make the recommended change. Industry-specific outcomes, not abstract benefits. Reference what ${body.projected_score} means vs ${body.score}.",

  "email_hook": "[1-2 sentences] A subject-line-worthy insight that would make this person open an email. Must reference their specific situation — not generic. Example quality: 'CJ, 65% of your closings depend on one relationship — here\\'s the structural risk that creates.'",

  "dashboard_headline": "[1 sentence] The opening line they see on their dashboard. Direct, specific, sets the tone for the entire experience.",

  "comparative_narrative": "${comparativeInstruction}"
}

Return ONLY the JSON.`;

    const parsed = await callClaude(system, user, env, 1200);
    const REQUIRED_KEYS = ["why_this_score", "action_script", "what_becomes_possible", "email_hook", "dashboard_headline", "comparative_narrative"];
    for (const key of REQUIRED_KEYS) {
      if (!(key in parsed)) {
        return new Response(JSON.stringify({ error: "Incomplete" }), { status: 502, headers: corsHeaders });
      }
    }
    return new Response(JSON.stringify(parsed), { headers: corsHeaders });
  } catch (err) {
    console.error("Personalize error:", err);
    return new Response(JSON.stringify(EMPTY_RESPONSE), { headers: corsHeaders });
  }
}
