// RunPayway AI Worker — Cloudflare Worker
// Secure proxy for all Claude API calls. Routes by URL path.
// Endpoints: /pressuremap, /plain-english, /action-plan, /save-record, /get-record, /stats

// ══════════════════════════════════════════════════════════
// BRAND VOICE — shared across all AI endpoints
// ══════════════════════════════════════════════════════════

const BRAND_RULES = `
VOICE AND TONE:
- Write like a senior analyst preparing a private structural briefing for a high-value client
- Tone: authoritative, calm, precise, institutional
- Every sentence must earn its place — no filler, no padding, no transitions
- Use plain English — no jargon unless it is the clearest way to say something
- Be direct. State what is true. Do not hedge unnecessarily.
- Create quiet urgency — make the reader feel that acting is important, without being alarmist

LANGUAGE RULES:
- Address the user as "your" and "you" — never "the client" or "one"
- Use present tense — this is about right now
- Reference their exact numbers (percentages, scores, months) — never generalize
- Name their specific industry, operating structure, and income model in every section
- Use "structure" and "structural" — these are RunPayway brand words
- Say "income stability" not "financial stability"
- Say "structural protection" not "financial security"
- Say "income continuity" not "passive income runway"

PROHIBITED:
- Never use exclamation marks
- Never say "congratulations", "great news", "exciting", "amazing", or motivational language
- Never use emojis
- Never provide financial advice, investment recommendations, or income predictions
- Never mention specific companies, stocks, funds, or investment vehicles
- Never fabricate statistics or cite specific market data — use directional language (rising, declining, compressing, accelerating)
- Never reference competitors or other scoring/assessment tools
- Never say "you should" — say "the highest-leverage move is" or "the structural priority is"
- Never guarantee outcomes — say "projected" or "estimated" or "the model indicates"
- Never use "passive income" — say "income that continues without daily work"
- Never use "side hustle" or "gig" — say "additional income source" or "secondary revenue stream"

STRUCTURAL FRAMING:
- Frame everything through income structure, not income amount
- The score measures how income holds up under disruption — not how much someone earns
- Every observation must connect back to a specific structural factor: persistence, concentration, forward visibility, labor dependence, continuity, or variability
- When describing what to change, name the exact type of arrangement: retainer, maintenance contract, prepaid package, licensing arrangement, standing agreement, recurring advisory, productized service

LENGTH DISCIPLINE:
- PressureMap sections: exactly 2 sentences each, no more
- Plain English interpretation: exactly 3-4 sentences
- Plain English why-not-higher: exactly 1-2 sentences
- Action plan items: exactly 2-3 sentences each
- Tradeoff items: exactly 1-2 sentences each
- Never exceed these limits. Shorter is better than longer.
`;

export default {
  async fetch(request, env) {
    // CORS preflight
    if (request.method === "OPTIONS") {
      return new Response(null, {
        headers: {
          "Access-Control-Allow-Origin": env.ALLOWED_ORIGIN || "*",
          "Access-Control-Allow-Methods": "POST, GET, OPTIONS",
          "Access-Control-Allow-Headers": "Content-Type",
          "Access-Control-Max-Age": "86400",
        },
      });
    }

    const corsHeaders = {
      "Access-Control-Allow-Origin": env.ALLOWED_ORIGIN || "*",
      "Content-Type": "application/json",
    };

    const url = new URL(request.url);
    const path = url.pathname.replace(/\/$/, "") || "/pressuremap";

    // GET endpoints
    if (request.method === "GET") {
      if (path === "/stats") return await handleStats(env, corsHeaders);
      return new Response("Not found", { status: 404 });
    }

    if (request.method !== "POST") {
      return new Response("Method not allowed", { status: 405 });
    }

    try {
      const body = await request.json();

      if (path === "/pressuremap" || path === "/") return await handlePressureMap(body, env, corsHeaders);
      if (path === "/plain-english") return await handlePlainEnglish(body, env, corsHeaders);
      if (path === "/action-plan") return await handleActionPlan(body, env, corsHeaders);
      if (path === "/save-record") return await handleSaveRecord(body, env, corsHeaders);
      if (path === "/get-record") return await handleGetRecord(body, env, corsHeaders);
      if (path === "/send-email") return await handleSendEmail(body, env, corsHeaders);
      if (path === "/contact") return await handleContact(body, env, corsHeaders);

      return new Response(JSON.stringify({ error: "Unknown endpoint" }), {
        status: 404, headers: corsHeaders,
      });
    } catch (err) {
      return new Response(JSON.stringify({ error: "Worker error", detail: String(err) }), {
        status: 500, headers: corsHeaders,
      });
    }
  },
};

// ══════════════════════════════════════════════════════════
// CALL CLAUDE
// ══════════════════════════════════════════════════════════

async function callClaude(system, user, env, maxTokens = 600) {
  const response = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": env.ANTHROPIC_API_KEY,
      "anthropic-version": "2023-06-01",
    },
    body: JSON.stringify({
      model: "claude-sonnet-4-20250514",
      max_tokens: maxTokens,
      system: BRAND_RULES + "\n\n" + system,
      messages: [{ role: "user", content: user }],
    }),
  });

  if (!response.ok) {
    const err = await response.text();
    throw new Error(`Anthropic API ${response.status}: ${err}`);
  }

  const data = await response.json();
  const text = data.content?.[0]?.text || "";
  const jsonMatch = text.match(/\{[\s\S]*\}/);
  if (!jsonMatch) throw new Error("No JSON in response");
  return JSON.parse(jsonMatch[0]);
}

// ══════════════════════════════════════════════════════════
// PROFILE BLOCK (shared)
// ══════════════════════════════════════════════════════════

function profileBlock(b) {
  return `PROFILE:
- Industry: ${b.industry || "General"}
- Operating Structure: ${b.operating_structure || "Independent"}
- Income Model: ${b.income_model || "Mixed"}
- Years in current structure: ${b.years_in_structure || "Unknown"}
- Income Stability Score: ${b.score || 0}/100 (${b.band || "Unknown"})
- Weakest structural factor: ${b.weakest_factor || "Unknown"}

STRUCTURAL DATA:
- Recurring revenue: ${b.recurrence_pct || 0}%
- Top client concentration: ${b.concentration_pct || 0}%
- Forward visibility: ${b.forward_visibility_pct || 0}%
- Labor dependence: ${b.labor_dependence_pct || 0}%
- Earnings variability: ${b.variability_level || "moderate"}
- Active income: ${b.active_income || 0}%
- Continuity if work stops: ${b.continuity_months || 0} months
- Risk scenario drop: ${b.risk_drop || 0} points`;
}

// ══════════════════════════════════════════════════════════
// PRESSUREMAP
// ══════════════════════════════════════════════════════════

async function handlePressureMap(body, env, corsHeaders) {
  const system = `You are the PressureMap engine for RunPayway. You produce real-time structural intelligence specific to one individual's income architecture.

ROLE: Structural analyst producing a private intelligence briefing.
OUTPUT: Three sections, each exactly 2 sentences. No more.`;

  const user = `Generate a PressureMap briefing:

${profileBlock(body)}

Return this JSON:
{
  "pressure": "[Exactly 2 sentences] The specific structural force in ${body.industry} that is currently working against this ${body.operating_structure} with a ${body.income_model} model, given their weakest factor is ${body.weakest_factor} at the values shown above. Name the structural dynamic, not a generic industry trend.",
  "tailwind": "[Exactly 2 sentences] The specific current condition in ${body.industry} that creates a structural opening for this ${body.operating_structure} with a ${body.income_model} model to improve their weakest factor right now.",
  "leverage_move": "[Exactly 2 sentences] The single highest-leverage structural change — name the exact type of arrangement (retainer, standing agreement, prepaid package, productized service, licensing deal, etc.) that fits a ${body.operating_structure} in ${body.industry} earning through ${body.income_model}."
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

async function handlePlainEnglish(body, env, corsHeaders) {
  const system = `You are a structural income analyst for RunPayway. You write the "In Plain English" section of the Income Stability Report.

ROLE: Senior analyst explaining diagnostic results to the person who took the assessment.
GOAL: Make the reader feel that this score revealed something they did not already know about their income structure. This is what makes the report worth the price.

OUTPUT REQUIREMENTS:
- "interpretation": Exactly 3-4 sentences. Start with what the score means structurally. Then explain the single most important thing it reveals. Then connect it to their daily reality as a ${body.operating_structure} in ${body.industry}. End with what this means if conditions change.
- "why_not_higher": Exactly 1-2 sentences. The specific structural factor preventing a higher score. Reference their exact number.`;

  const user = `Write the Plain English interpretation:

${profileBlock(body)}

Return this JSON:
{
  "interpretation": "[3-4 sentences as described above]",
  "why_not_higher": "[1-2 sentences] Why the score is ${body.score} and not higher, specific to their ${body.weakest_factor} in the context of being a ${body.operating_structure} in ${body.industry} with a ${body.income_model} model."
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

async function handleActionPlan(body, env, corsHeaders) {
  const system = `You are a structural income strategist for RunPayway. You write the Action Plan section of the Income Stability Report.

ROLE: Management consultant delivering a strategy recommendation to a private client.
GOAL: Make the reader feel that this action plan is the most valuable part of the report — specific enough to act on immediately, not generic advice they could find anywhere.

OUTPUT REQUIREMENTS:
- primary_action: 2-3 sentences. Name the exact structural change. Be specific to their industry and model.
- primary_how: 2-3 sentences. Exactly how to execute. What to offer, who to approach, what language to use. Specific to a ${body.operating_structure} in ${body.industry}.
- supporting_action: 1-2 sentences. A second change that compounds with the first.
- supporting_how: 1-2 sentences. How to execute it.
- combined_interpretation: 1-2 sentences. What the income structure looks like after both changes.
- tradeoff_upside: 1-2 sentences. The structural benefit.
- tradeoff_cost: 1-2 sentences. The realistic effort or sacrifice required.
- tradeoff_verdict: Exactly 1 sentence. Whether it is worth doing and why — stated with conviction.`;

  const user = `Write the action plan:

${profileBlock(body)}

Primary constraint: ${body.weakest_factor}
Top projected change: ${body.top_change || "Reduce " + body.weakest_factor}
Projected lift: ${body.projected_lift || "Unknown"}

Return this JSON:
{
  "primary_action": "[2-3 sentences]",
  "primary_how": "[2-3 sentences] Specific to a ${body.operating_structure} in ${body.industry} with a ${body.income_model} model.",
  "supporting_action": "[1-2 sentences]",
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
// SAVE RECORD
// ══════════════════════════════════════════════════════════

async function handleSaveRecord(body, env, corsHeaders) {
  if (!body.id || !body.record_data) {
    return new Response(JSON.stringify({ error: "Missing id or record_data" }), {
      status: 400, headers: corsHeaders,
    });
  }

  await env.DB.prepare(
    `INSERT OR REPLACE INTO records (id, created_at, assessment_title, industry, operating_structure, income_model, score, band, record_data) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`
  ).bind(
    body.id,
    new Date().toISOString(),
    body.assessment_title || "",
    body.industry || "",
    body.operating_structure || "",
    body.income_model || "",
    body.score || 0,
    body.band || "",
    typeof body.record_data === "string" ? body.record_data : JSON.stringify(body.record_data),
  ).run();

  return new Response(JSON.stringify({ success: true, id: body.id }), { headers: corsHeaders });
}

// ══════════════════════════════════════════════════════════
// GET RECORD
// ══════════════════════════════════════════════════════════

async function handleGetRecord(body, env, corsHeaders) {
  if (!body.id) {
    return new Response(JSON.stringify({ error: "Missing id" }), {
      status: 400, headers: corsHeaders,
    });
  }

  const row = await env.DB.prepare(
    `SELECT record_data FROM records WHERE id = ?`
  ).bind(body.id).first();

  if (!row) {
    return new Response(JSON.stringify({ error: "Record not found" }), {
      status: 404, headers: corsHeaders,
    });
  }

  return new Response(JSON.stringify({
    success: true,
    record_data: row.record_data,
  }), { headers: corsHeaders });
}

// ══════════════════════════════════════════════════════════
// SEND EMAIL (via Resend)
// ══════════════════════════════════════════════════════════

async function handleSendEmail(body, env, corsHeaders) {
  if (!body.to || !body.score) {
    return new Response(JSON.stringify({ error: "Missing to or score" }), {
      status: 400, headers: corsHeaders,
    });
  }

  if (!env.RESEND_API_KEY) {
    return new Response(JSON.stringify({ error: "Email not configured" }), {
      status: 500, headers: corsHeaders,
    });
  }

  const navy = "#0E1A2B";
  const purple = "#4B3FAE";
  const teal = "#1F6D7A";
  const muted = "rgba(14,26,43,0.58)";
  const light = "rgba(14,26,43,0.35)";
  const sand = "#F4F1EA";
  const name = body.name || "Assessment";
  const shortId = (body.record_id || "").slice(0, 8);
  const industry = body.industry || "";
  const structure = body.operating_structure || "";
  const bandColor = (body.score || 0) >= 75 ? teal : (body.score || 0) >= 50 ? "#2B5EA7" : (body.score || 0) >= 30 ? "#92640A" : "#9B2C2C";

  const html = `<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8"/><meta name="viewport" content="width=device-width,initial-scale=1.0"/></head>
<body style="margin:0;padding:0;background-color:${navy};font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:${navy};">

<!-- Navy pre-header spacer -->
<tr><td style="height:32px;">&nbsp;</td></tr>

<tr><td align="center" style="padding:0 16px;">
<table role="presentation" width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;">

<!-- Logo bar — navy background -->
<tr><td style="padding:28px 40px 24px;text-align:left;">
<img src="https://peoplestar.com/RunPayway/runpayway-logo-blue.png" alt="RunPayway" width="140" height="17" style="display:inline-block;height:auto;filter:brightness(0) invert(1);opacity:0.85;"/>
</td></tr>

<!-- Gradient accent line -->
<tr><td style="padding:0 40px;"><table role="presentation" width="100%" cellpadding="0" cellspacing="0"><tr><td style="background:linear-gradient(90deg,${purple} 0%,${teal} 100%);height:2px;border-radius:1px;">&nbsp;</td></tr></table></td></tr>

<!-- White content card -->
<tr><td style="padding:0 12px;">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0">
<tr><td style="background-color:#ffffff;padding:44px 40px 40px;border-radius:12px;margin-top:20px;">

<!-- Personal greeting -->
<table role="presentation" width="100%" cellpadding="0" cellspacing="0">
<tr><td>
<p style="font-size:22px;font-weight:300;color:${navy};margin:0 0 6px;letter-spacing:-0.02em;line-height:1.3;">${name}, your assessment is complete.</p>
<p style="font-size:13px;color:${light};line-height:1.7;margin:8px 0 0;">
Your income structure${industry ? ` in <strong style="color:${muted};font-weight:600;">${industry}</strong>` : ""}${structure ? ` as <strong style="color:${muted};font-weight:600;">${structure}</strong>` : ""} has been evaluated across six structural dimensions.
</p>
</td></tr>
</table>

<!-- Spacer -->
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:28px 0;">
<tr><td style="height:1px;background-color:rgba(14,26,43,0.06);">&nbsp;</td></tr>
</table>

<!-- Score display -->
<table role="presentation" width="100%" cellpadding="0" cellspacing="0">
<tr><td style="padding:28px 32px;background-color:#fafaf8;border-radius:10px;border:1px solid rgba(14,26,43,0.04);">

<table role="presentation" width="100%" cellpadding="0" cellspacing="0">
<tr>
<td style="vertical-align:top;">
<p style="font-size:10px;font-weight:700;letter-spacing:0.14em;text-transform:uppercase;color:${light};margin:0 0 14px;">INCOME STABILITY SCORE</p>
<table role="presentation" cellpadding="0" cellspacing="0">
<tr>
<td style="font-size:56px;font-weight:200;color:${navy};line-height:1;letter-spacing:-0.04em;font-family:'Georgia',serif;">${body.score}</td>
<td style="font-size:16px;font-weight:300;color:rgba(14,26,43,0.18);vertical-align:bottom;padding-bottom:10px;padding-left:4px;">/100</td>
</tr>
</table>
<table role="presentation" cellpadding="0" cellspacing="0" style="margin-top:12px;">
<tr>
<td style="width:8px;height:8px;border-radius:2px;background-color:${bandColor};">&nbsp;</td>
<td style="padding-left:8px;font-size:13px;font-weight:600;color:${bandColor};letter-spacing:0.01em;">${body.band || ""}</td>
</tr>
</table>
</td>
<td width="120" style="vertical-align:top;text-align:right;">
<table role="presentation" cellpadding="0" cellspacing="0" style="float:right;">
<tr><td style="padding:6px 12px;border-radius:6px;border:1px solid rgba(14,26,43,0.08);">
<p style="font-size:9px;font-weight:600;letter-spacing:0.1em;text-transform:uppercase;color:${light};margin:0 0 2px;">MODEL</p>
<p style="font-size:12px;font-weight:600;color:${navy};margin:0;">RP-2.0</p>
</td></tr>
</table>
</td>
</tr>
</table>

</td></tr>
</table>

<!-- Industry context interpretation -->
${body.interpretation ? `
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin-top:24px;">
<tr><td>
<p style="font-size:14px;color:${muted};line-height:1.75;margin:0;">${body.interpretation}</p>
</td></tr>
</table>
` : ""}

<!-- Spacer -->
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:28px 0;">
<tr><td style="height:1px;background-color:rgba(14,26,43,0.06);">&nbsp;</td></tr>
</table>

<!-- Assessment details — clean two-column -->
<table role="presentation" width="100%" cellpadding="0" cellspacing="0">
<tr>
<td width="50%" style="vertical-align:top;padding-right:16px;">
<p style="font-size:9px;font-weight:700;letter-spacing:0.14em;text-transform:uppercase;color:${light};margin:0 0 5px;">Industry</p>
<p style="font-size:14px;font-weight:500;color:${navy};margin:0 0 20px;">${industry || "\u2014"}</p>
<p style="font-size:9px;font-weight:700;letter-spacing:0.14em;text-transform:uppercase;color:${light};margin:0 0 5px;">Operating Structure</p>
<p style="font-size:14px;font-weight:500;color:${navy};margin:0;">${structure || "\u2014"}</p>
</td>
<td width="50%" style="vertical-align:top;padding-left:16px;border-left:1px solid rgba(14,26,43,0.06);">
<p style="font-size:9px;font-weight:700;letter-spacing:0.14em;text-transform:uppercase;color:${light};margin:0 0 5px;">Primary Constraint</p>
<p style="font-size:14px;font-weight:500;color:${navy};margin:0 0 20px;">${body.constraint || "\u2014"}</p>
<p style="font-size:9px;font-weight:700;letter-spacing:0.14em;text-transform:uppercase;color:${light};margin:0 0 5px;">Dimensions Analyzed</p>
<p style="font-size:14px;font-weight:500;color:${navy};margin:0;">6</p>
</td>
</tr>
</table>

<!-- Spacer -->
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:32px 0 0;">
<tr><td style="height:1px;background-color:rgba(14,26,43,0.06);">&nbsp;</td></tr>
</table>

<!-- Command Center CTA -->
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin-top:32px;">
<tr><td style="text-align:center;">
<p style="font-size:9px;font-weight:700;letter-spacing:0.14em;text-transform:uppercase;color:${teal};margin:0 0 8px;">NEXT STEP</p>
<p style="font-size:18px;font-weight:300;color:${navy};margin:0 0 8px;letter-spacing:-0.01em;">Your Command Center is ready.</p>
<p style="font-size:13px;color:${muted};line-height:1.65;margin:0 0 24px;">
View your full report, explore your structural breakdown by factor, and review your personalized action plan.
</p>
<table role="presentation" cellpadding="0" cellspacing="0" style="margin:0 auto;">
<tr><td style="background-color:${purple};border-radius:10px;">
<a href="https://peoplestar.com/RunPayway/dashboard" style="display:inline-block;padding:14px 40px;color:#ffffff;font-size:14px;font-weight:600;text-decoration:none;letter-spacing:0.02em;">Open Your Command Center</a>
</td></tr>
</table>
</td></tr>
</table>

<!-- Reassessment guidance -->
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin-top:36px;">
<tr><td style="padding:20px 24px;border-radius:8px;border:1px solid rgba(14,26,43,0.06);background-color:#fafaf8;">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0">
<tr>
<td width="4" style="vertical-align:top;padding-right:16px;">
<table role="presentation" cellpadding="0" cellspacing="0"><tr><td style="width:3px;height:36px;background-color:${teal};border-radius:2px;">&nbsp;</td></tr></table>
</td>
<td>
<p style="font-size:13px;font-weight:600;color:${navy};margin:0 0 6px;">When to reassess</p>
<p style="font-size:12px;color:${muted};line-height:1.65;margin:0;">
We recommend a follow-up assessment after 90 days or after making a significant structural change to your income${industry ? ` \u2014 whether that is securing a new contract, diversifying your ${industry.toLowerCase()} revenue streams, or building recurring arrangements` : ""}. Your Command Center tracks your progress across assessments automatically.
</p>
</td>
</tr>
</table>
</td></tr>
</table>

<!-- Record reference -->
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin-top:28px;">
<tr><td>
<p style="font-size:10px;color:rgba(14,26,43,0.22);margin:0;letter-spacing:0.02em;">Record ${shortId} \u00B7 Model RP-2.0</p>
</td></tr>
</table>

</td></tr>
</table>
</td></tr>

<!-- Footer — navy -->
<tr><td style="padding:32px 52px 12px;">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0">
<tr><td style="text-align:center;">
<p style="font-size:11px;color:rgba(244,241,234,0.40);margin:0 0 6px;letter-spacing:0.04em;">RunPayway \u2014 Income Stability Score\u2122</p>
<p style="font-size:10px;color:rgba(244,241,234,0.22);margin:0 0 12px;">Confidential \u2014 Prepared exclusively for ${name}</p>
<a href="https://peoplestar.com/RunPayway/contact" style="font-size:10px;color:rgba(244,241,234,0.35);text-decoration:none;letter-spacing:0.06em;">CONTACT US</a>
</td></tr>
</table>
</td></tr>

<tr><td style="height:24px;">&nbsp;</td></tr>

</table>
</td></tr>
</table>
</body>
</html>`;

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${env.RESEND_API_KEY}`,
    },
    body: JSON.stringify({
      from: env.FROM_EMAIL || "RunPayway <reports@peoplestar.com>",
      to: body.to,
      subject: `${body.name || "Your"} Income Stability Assessment \u2014 ${body.band || "Results Ready"}`,
      html,
      tags: [
        { name: "type", value: "assessment-report" },
        { name: "record_id", value: shortId },
      ],
    }),
  });

  if (!res.ok) {
    const err = await res.text();
    return new Response(JSON.stringify({ error: "Email failed", detail: err }), {
      status: 502, headers: corsHeaders,
    });
  }

  const result = await res.json();
  return new Response(JSON.stringify({ success: true, id: result.id }), { headers: corsHeaders });
}

// ══════════════════════════════════════════════════════════
// CONTACT FORM
// ══════════════════════════════════════════════════════════

async function handleContact(body, env, corsHeaders) {
  if (!body.name || !body.email || !body.message) {
    return new Response(JSON.stringify({ error: "Missing required fields" }), {
      status: 400, headers: corsHeaders,
    });
  }

  if (!env.RESEND_API_KEY) {
    return new Response(JSON.stringify({ error: "Email not configured" }), {
      status: 500, headers: corsHeaders,
    });
  }

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${env.RESEND_API_KEY}`,
    },
    body: JSON.stringify({
      from: env.FROM_EMAIL || "RunPayway <reports@peoplestar.com>",
      to: "info@peoplestar.com",
      reply_to: body.email,
      subject: `[RunPayway Contact] ${(body.subject || "General Inquiry").replace(/[\r\n]/g, "")} - ${(body.name || "").replace(/[\r\n]/g, "")}`,
      html: `<div style="font-family:sans-serif;max-width:600px;">
<h2 style="color:#0E1A2B;margin:0 0 16px;">New Contact Form Submission</h2>
<table style="width:100%;border-collapse:collapse;">
<tr><td style="padding:8px 0;color:#6B6155;width:100px;">Name</td><td style="padding:8px 0;color:#0E1A2B;font-weight:500;">${body.name}</td></tr>
<tr><td style="padding:8px 0;color:#6B6155;">Email</td><td style="padding:8px 0;color:#0E1A2B;font-weight:500;">${body.email}</td></tr>
<tr><td style="padding:8px 0;color:#6B6155;">Subject</td><td style="padding:8px 0;color:#0E1A2B;font-weight:500;">${body.subject || "General"}</td></tr>
</table>
<div style="margin:16px 0;padding:16px;background:#F8F6F1;border-radius:8px;border:1px solid #E8E5DE;">
<p style="margin:0;color:#0E1A2B;line-height:1.6;">${body.message.replace(/\n/g, "<br/>")}</p>
</div>
<p style="font-size:12px;color:#6B6155;margin:16px 0 0;">Reply directly to this email to respond to ${body.name}.</p>
</div>`,
    }),
  });

  if (!res.ok) {
    const err = await res.text();
    return new Response(JSON.stringify({ error: "Send failed", detail: err }), {
      status: 502, headers: corsHeaders,
    });
  }

  return new Response(JSON.stringify({ success: true }), { headers: corsHeaders });
}

// ══════════════════════════════════════════════════════════
// STATS
// ══════════════════════════════════════════════════════════

async function handleStats(env, corsHeaders) {
  const total = await env.DB.prepare("SELECT COUNT(*) as count FROM records").first();
  const avgScore = await env.DB.prepare("SELECT AVG(score) as avg FROM records").first();
  const byBand = await env.DB.prepare("SELECT band, COUNT(*) as count FROM records GROUP BY band ORDER BY count DESC").all();
  const byIndustry = await env.DB.prepare("SELECT industry, COUNT(*) as count, ROUND(AVG(score),1) as avg_score FROM records GROUP BY industry ORDER BY count DESC LIMIT 20").all();
  const byStructure = await env.DB.prepare("SELECT operating_structure, COUNT(*) as count, ROUND(AVG(score),1) as avg_score FROM records GROUP BY operating_structure ORDER BY count DESC LIMIT 10").all();
  const byModel = await env.DB.prepare("SELECT income_model, COUNT(*) as count, ROUND(AVG(score),1) as avg_score FROM records GROUP BY income_model ORDER BY count DESC LIMIT 10").all();
  const recent = await env.DB.prepare("SELECT id, created_at, assessment_title, industry, score, band FROM records ORDER BY created_at DESC LIMIT 25").all();
  const today = new Date().toISOString().split("T")[0];
  const todayCount = await env.DB.prepare("SELECT COUNT(*) as count FROM records WHERE created_at LIKE ?").bind(`${today}%`).first();

  return new Response(JSON.stringify({
    total_assessments: total?.count || 0,
    today: todayCount?.count || 0,
    average_score: Math.round((avgScore?.avg || 0) * 10) / 10,
    by_band: byBand?.results || [],
    by_industry: byIndustry?.results || [],
    by_structure: byStructure?.results || [],
    by_income_model: byModel?.results || [],
    recent_assessments: recent?.results || [],
  }), { headers: corsHeaders });
}
