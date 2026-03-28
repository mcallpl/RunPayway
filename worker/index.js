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
  const light = "rgba(14,26,43,0.42)";
  const sand = "#F4F1EA";
  const name = body.name || "Assessment";
  const shortId = (body.record_id || "").slice(0, 8);

  const html = `<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8"/><meta name="viewport" content="width=device-width,initial-scale=1.0"/></head>
<body style="margin:0;padding:0;background-color:#f7f6f3;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#f7f6f3;">
<tr><td align="center" style="padding:40px 16px;">
<table role="presentation" width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;">

<tr><td style="background:linear-gradient(135deg,${navy} 0%,${purple} 50%,${teal} 100%);height:4px;border-radius:12px 12px 0 0;">&nbsp;</td></tr>

<tr><td style="background-color:#ffffff;padding:40px 36px;border:1px solid #e5e7eb;border-top:none;border-radius:0 0 12px 12px;">

<table role="presentation" width="100%" cellpadding="0" cellspacing="0">
<tr><td style="padding-bottom:28px;border-bottom:1px solid ${sand};">
<img src="https://peoplestar.com/RunPayway/runpayway-logo-blue.png" alt="RunPayway" width="160" height="19" style="display:inline-block;height:auto;"/>
<span style="font-size:11px;color:${light};margin-left:8px;">Income Stability Assessment</span>
</td></tr>
</table>

<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin-top:28px;">
<tr><td>
<p style="font-size:12px;font-weight:600;letter-spacing:0.1em;text-transform:uppercase;color:${muted};margin:0 0 10px;">INCOME STABILITY SCORE</p>
<table role="presentation" cellpadding="0" cellspacing="0">
<tr>
<td style="font-size:52px;font-weight:700;color:${navy};line-height:1;padding-right:16px;">${body.score}</td>
<td style="vertical-align:bottom;padding-bottom:6px;"><span style="font-size:16px;font-weight:600;color:${teal};">${body.band || ""}</span></td>
</tr>
</table>
${body.interpretation ? `<p style="font-size:13px;color:${muted};line-height:1.6;margin:12px 0 0;">${body.interpretation}</p>` : ""}
</td></tr>
</table>

<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:24px 0;">
<tr><td style="height:1px;background-color:${sand};">&nbsp;</td></tr>
</table>

<table role="presentation" width="100%" cellpadding="0" cellspacing="0">
<tr>
<td width="50%" style="vertical-align:top;padding-right:12px;">
<p style="font-size:10px;font-weight:600;letter-spacing:0.1em;text-transform:uppercase;color:${light};margin:0 0 4px;">Assessment</p>
<p style="font-size:13px;font-weight:500;color:${navy};margin:0 0 16px;">${name}</p>
<p style="font-size:10px;font-weight:600;letter-spacing:0.1em;text-transform:uppercase;color:${light};margin:0 0 4px;">Industry</p>
<p style="font-size:13px;font-weight:500;color:${navy};margin:0;">${body.industry || ""}</p>
</td>
<td width="50%" style="vertical-align:top;padding-left:12px;">
<p style="font-size:10px;font-weight:600;letter-spacing:0.1em;text-transform:uppercase;color:${light};margin:0 0 4px;">Structure</p>
<p style="font-size:13px;font-weight:500;color:${navy};margin:0 0 16px;">${body.operating_structure || ""}</p>
<p style="font-size:10px;font-weight:600;letter-spacing:0.1em;text-transform:uppercase;color:${light};margin:0 0 4px;">Primary Constraint</p>
<p style="font-size:13px;font-weight:500;color:${navy};margin:0;">${body.constraint || ""}</p>
</td>
</tr>
</table>

<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:24px 0;">
<tr><td style="height:1px;background-color:${sand};">&nbsp;</td></tr>
</table>

<table role="presentation" width="100%" cellpadding="0" cellspacing="0">
<tr><td style="background-color:${sand};border-radius:8px;padding:20px 24px;">
<p style="font-size:13px;font-weight:600;color:${navy};margin:0 0 6px;">Your full report is ready</p>
<p style="font-size:12px;color:${muted};line-height:1.6;margin:0 0 16px;">
Your 4-page diagnostic includes PressureMap intelligence, ranked risk scenarios, a personalized action plan, and lifetime access to the Stability Simulator.
</p>
<a href="https://peoplestar.com/RunPayway/review" style="display:inline-block;padding:10px 24px;background-color:${navy};color:#ffffff;font-size:13px;font-weight:600;text-decoration:none;border-radius:8px;">View Full Report</a>
</td></tr>
</table>

<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin-top:24px;">
<tr><td>
<p style="font-size:10px;color:${light};margin:0;">Record ID: ${shortId}... | Model: RP-2.0 | Verify at peoplestar.com/RunPayway/verify</p>
</td></tr>
</table>

</td></tr>

<tr><td style="padding:24px 0;text-align:center;">
<p style="font-size:11px;color:${light};margin:0 0 4px;">RunPayway - Income Stability Score - Model RP-2.0</p>
<p style="font-size:10px;color:${light};margin:0;">Confidential - Prepared for ${name} - support@runpayway.com</p>
</td></tr>

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
      subject: `Your Income Stability Assessment - Score: ${body.score} (${body.band || "Assessment"})`,
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
