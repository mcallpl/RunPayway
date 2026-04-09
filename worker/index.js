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
  // ── Cron trigger: send follow-up emails + nurture sequence ──
  async scheduled(event, env, ctx) {
    ctx.waitUntil(handleFollowUpCron(env));
    ctx.waitUntil(processNurtureQueue(env));
  },

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
      if (path === "/nurture") return await handleNurture(body, env, corsHeaders);

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

  // Auto-migrate: add columns if missing
  try { await env.DB.prepare("ALTER TABLE records ADD COLUMN email TEXT DEFAULT ''").run(); } catch { /* column exists */ }
  try { await env.DB.prepare("ALTER TABLE records ADD COLUMN top_action TEXT DEFAULT ''").run(); } catch { /* column exists */ }
  try { await env.DB.prepare("ALTER TABLE records ADD COLUMN followup_sent INTEGER DEFAULT 0").run(); } catch { /* column exists */ }

  await env.DB.prepare(
    `INSERT OR REPLACE INTO records (id, created_at, assessment_title, industry, operating_structure, income_model, score, band, record_data, email, top_action) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
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
    body.email || "",
    body.top_action || "",
  ).run();

  // ── Update nurture record with score data if this email is enrolled ──
  if (body.email && body.score) {
    try {
      await ensureNurtureTable(env);
      const nurture = await env.DB.prepare(
        "SELECT email FROM nurture_queue WHERE email = ?"
      ).bind(body.email.toLowerCase()).first();

      if (nurture) {
        // Parse record_data to extract the weakest factor / constraint
        let constraint = "";
        try {
          const rd = typeof body.record_data === "string" ? JSON.parse(body.record_data) : body.record_data;
          constraint = rd?.weakest_factor || rd?.constraint || body.top_action || "";
        } catch { /* ignore parse errors */ }

        await env.DB.prepare(
          `UPDATE nurture_queue SET score = ?, band = ?, constraint_name = ?, industry = ? WHERE email = ?`
        ).bind(
          body.score || 0,
          body.band || "",
          constraint,
          body.industry || "",
          body.email.toLowerCase()
        ).run();
        console.log(`[Nurture] Updated score data for ${body.email}: ${body.score} (${body.band})`);
      }
    } catch (err) {
      console.error(`[Nurture] Failed to update score for ${body.email}:`, err);
    }
  }

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

  const navy = "#1C1635";
  const purple = "#4B3FAE";
  const teal = "#1F6D7A";
  const muted = "rgba(14,26,43,0.58)";
  const light = "rgba(14,26,43,0.35)";
  const sand = "#F4F1EA";
  const name = body.name || "Assessment";
  const shortId = (body.record_id || "").slice(0, 8);
  const fullId = body.record_id || "";
  const dashboardLink = fullId ? `https://peoplestar.com/RunPayway/dashboard?record=${encodeURIComponent(fullId)}` : "https://peoplestar.com/RunPayway/dashboard";
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
<p style="font-size:22px;font-weight:300;color:${navy};margin:0 0 6px;letter-spacing:-0.02em;line-height:1.3;">${name}, we\u2019ve finished your assessment.</p>
<p style="font-size:13px;color:${light};line-height:1.7;margin:8px 0 0;">
We looked at how your income holds up${industry ? ` in <strong style="color:${muted};font-weight:600;">${industry}</strong>` : ""}${structure ? ` as ${structure.match(/^[aeiou]/i) ? "an" : "a"} <strong style="color:${muted};font-weight:600;">${structure}</strong>` : ""} \u2014 here\u2019s what stands out.
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
<p style="font-size:18px;font-weight:300;color:${navy};margin:0 0 8px;letter-spacing:-0.01em;">Your full breakdown is ready.</p>
<p style="font-size:13px;color:${muted};line-height:1.65;margin:0 0 24px;">
See exactly where your income is strong, where it\u2019s exposed, and what to focus on first.
</p>
<table role="presentation" cellpadding="0" cellspacing="0" style="margin:0 auto;">
<tr><td style="background-color:${purple};border-radius:10px;">
<a href="${dashboardLink}" style="display:inline-block;padding:14px 40px;color:#ffffff;font-size:14px;font-weight:600;text-decoration:none;letter-spacing:0.02em;">Open Your Command Center</a>
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
<p style="font-size:13px;font-weight:600;color:${navy};margin:0 0 6px;">When to check back in</p>
<p style="font-size:12px;color:${muted};line-height:1.65;margin:0;">
Run another assessment in about 90 days, or whenever something meaningful shifts${industry ? ` \u2014 a new contract, a change in how your ${industry.toLowerCase()} revenue comes in, or a move toward recurring work` : ""}. Your Command Center will track the progress for you.
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
<h2 style="color:#1C1635;margin:0 0 16px;">New Contact Form Submission</h2>
<table style="width:100%;border-collapse:collapse;">
<tr><td style="padding:8px 0;color:#6B6155;width:100px;">Name</td><td style="padding:8px 0;color:#1C1635;font-weight:500;">${body.name}</td></tr>
<tr><td style="padding:8px 0;color:#6B6155;">Email</td><td style="padding:8px 0;color:#1C1635;font-weight:500;">${body.email}</td></tr>
<tr><td style="padding:8px 0;color:#6B6155;">Subject</td><td style="padding:8px 0;color:#1C1635;font-weight:500;">${body.subject || "General"}</td></tr>
</table>
<div style="margin:16px 0;padding:16px;background:#F8F6F1;border-radius:8px;border:1px solid #E8E5DE;">
<p style="margin:0;color:#1C1635;line-height:1.6;">${body.message.replace(/\n/g, "<br/>")}</p>
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

  // ── Nurture sequence: enroll and send email 1 for brief signups ──
  if (body.subject === "structural_income_brief") {
    try {
      await ensureNurtureTable(env);

      // Check if already enrolled (idempotent)
      const existing = await env.DB.prepare(
        "SELECT email, emails_sent FROM nurture_queue WHERE email = ?"
      ).bind(body.email.toLowerCase()).first();

      if (!existing) {
        const now = new Date().toISOString();
        await env.DB.prepare(
          `INSERT INTO nurture_queue (email, name, signed_up_at, emails_sent, score, band, constraint_name, industry)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?)`
        ).bind(
          body.email.toLowerCase(),
          body.name || "there",
          now,
          "1", // email 1 will be sent immediately
          0,   // score not yet available
          "",  // band not yet available
          "",  // constraint not yet available
          ""   // industry not yet available
        ).run();

        // Send nurture email 1 immediately (welcome version without score)
        const welcomeResult = buildNurtureWelcomeEmail({ name: body.name || "there" });
        await fetch("https://api.resend.com/emails", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${env.RESEND_API_KEY}`,
          },
          body: JSON.stringify({
            from: env.FROM_EMAIL || "RunPayway <reports@peoplestar.com>",
            to: body.email,
            subject: welcomeResult.subject,
            html: welcomeResult.html,
            tags: [{ name: "type", value: "nurture-1" }],
          }),
        });
        console.log(`[Nurture] Enrolled ${body.email} and sent welcome email`);
      } else {
        console.log(`[Nurture] ${body.email} already enrolled, skipping`);
      }
    } catch (err) {
      // Nurture enrollment failure should not break the contact form
      console.error(`[Nurture] Enrollment error for ${body.email}:`, err);
    }
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

// ══════════════════════════════════════════════════════════
// NURTURE SEQUENCE — D1-backed scheduler
// ══════════════════════════════════════════════════════════

// Ensure the nurture_queue table exists (idempotent)
async function ensureNurtureTable(env) {
  await env.DB.prepare(`
    CREATE TABLE IF NOT EXISTS nurture_queue (
      email TEXT PRIMARY KEY,
      name TEXT NOT NULL DEFAULT 'there',
      signed_up_at TEXT NOT NULL,
      emails_sent TEXT NOT NULL DEFAULT '1',
      score INTEGER DEFAULT 0,
      band TEXT DEFAULT '',
      constraint_name TEXT DEFAULT '',
      industry TEXT DEFAULT ''
    )
  `).run();
}

// Process the nurture queue — called by cron trigger daily at 2pm UTC
async function processNurtureQueue(env) {
  if (!env.RESEND_API_KEY) {
    console.log("[Nurture Cron] No RESEND_API_KEY configured, skipping");
    return;
  }

  try {
    await ensureNurtureTable(env);
  } catch (err) {
    console.error("[Nurture Cron] Failed to ensure table:", err);
    return;
  }

  const fromEmail = env.FROM_EMAIL || "RunPayway <reports@peoplestar.com>";

  // Fetch all nurture records that still have emails to send
  let rows;
  try {
    rows = await env.DB.prepare(
      "SELECT * FROM nurture_queue ORDER BY signed_up_at ASC LIMIT 50"
    ).all();
  } catch (err) {
    console.error("[Nurture Cron] Failed to query nurture_queue:", err);
    return;
  }

  if (!rows?.results?.length) {
    console.log("[Nurture Cron] No records to process");
    return;
  }

  console.log(`[Nurture Cron] Processing ${rows.results.length} nurture records`);
  const now = Date.now();

  for (const row of rows.results) {
    const emailsSent = row.emails_sent ? row.emails_sent.split(",").map(Number) : [];
    const signedUpAt = new Date(row.signed_up_at).getTime();
    const daysSince = Math.floor((now - signedUpAt) / (1000 * 60 * 60 * 24));

    const params = {
      name: row.name || "there",
      score: row.score || 0,
      band: row.band || "",
      constraint: row.constraint_name || "Income Concentration",
      industry: row.industry || "",
    };

    try {
      // Day 3+: send email 2 (the structural move email)
      if (daysSince >= 3 && !emailsSent.includes(2)) {
        let emailContent;
        if (params.score > 0) {
          // Have score data — send the full nurture email 2
          emailContent = buildNurtureEmail2(params);
        } else {
          // No score yet — send a reminder to take the assessment
          emailContent = buildNurtureReminder2(params);
        }

        const res = await fetch("https://api.resend.com/emails", {
          method: "POST",
          headers: { "Content-Type": "application/json", "Authorization": `Bearer ${env.RESEND_API_KEY}` },
          body: JSON.stringify({
            from: fromEmail,
            to: row.email,
            subject: emailContent.subject,
            html: emailContent.html,
            tags: [{ name: "type", value: "nurture-2" }],
          }),
        });

        if (res.ok) {
          emailsSent.push(2);
          await env.DB.prepare(
            "UPDATE nurture_queue SET emails_sent = ? WHERE email = ?"
          ).bind(emailsSent.join(","), row.email).run();
          console.log(`[Nurture Cron] Sent email 2 to ${row.email} (day ${daysSince})`);
        } else {
          console.error(`[Nurture Cron] Failed to send email 2 to ${row.email}: ${await res.text()}`);
        }
        continue; // Process one email per record per cron run
      }

      // Day 7+: send email 3 (the industry patterns email)
      if (daysSince >= 7 && !emailsSent.includes(3)) {
        let emailContent;
        if (params.score > 0) {
          emailContent = buildNurtureEmail3(params);
        } else {
          emailContent = buildNurtureReminder3(params);
        }

        const res = await fetch("https://api.resend.com/emails", {
          method: "POST",
          headers: { "Content-Type": "application/json", "Authorization": `Bearer ${env.RESEND_API_KEY}` },
          body: JSON.stringify({
            from: fromEmail,
            to: row.email,
            subject: emailContent.subject,
            html: emailContent.html,
            tags: [{ name: "type", value: "nurture-3" }],
          }),
        });

        if (res.ok) {
          emailsSent.push(3);
          await env.DB.prepare(
            "UPDATE nurture_queue SET emails_sent = ? WHERE email = ?"
          ).bind(emailsSent.join(","), row.email).run();
          console.log(`[Nurture Cron] Sent email 3 to ${row.email} (day ${daysSince})`);
        } else {
          console.error(`[Nurture Cron] Failed to send email 3 to ${row.email}: ${await res.text()}`);
        }
        continue;
      }

      // All 3 emails sent — clean up the record
      if (emailsSent.includes(1) && emailsSent.includes(2) && emailsSent.includes(3)) {
        await env.DB.prepare("DELETE FROM nurture_queue WHERE email = ?").bind(row.email).run();
        console.log(`[Nurture Cron] Completed sequence for ${row.email}, record removed`);
      }
    } catch (err) {
      // Individual record failure should not stop processing others
      console.error(`[Nurture Cron] Error processing ${row.email}:`, err);
    }
  }

  console.log("[Nurture Cron] Processing complete");
}

// Welcome email (no score yet) — sent immediately on signup
function buildNurtureWelcomeEmail({ name }) {
  const navy = "#1C1635";
  const muted = "rgba(14,26,43,0.58)";
  const light = "rgba(14,26,43,0.35)";

  const body = `
<p style="font-size:22px;font-weight:300;color:${navy};margin:0 0 6px;letter-spacing:-0.02em;line-height:1.3;">Welcome to the Structural Income Brief, ${name}.</p>
<p style="font-size:13px;color:${light};line-height:1.7;margin:8px 0 0;">You are now receiving structural intelligence about how income holds up under pressure.</p>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:24px 0;"><tr><td style="height:1px;background-color:rgba(14,26,43,0.06);">&nbsp;</td></tr></table>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin-top:0;">
<tr><td>
<p style="font-size:14px;color:${muted};line-height:1.75;margin:0 0 12px;">Most professionals have no structural view of their income. They know what they earn, but not how it behaves under disruption \u2014 what happens when a client leaves, a contract ends, or the market shifts.</p>
<p style="font-size:14px;color:${muted};line-height:1.75;margin:0 0 12px;">The RunPayway Income Stability Score measures exactly this: how your income holds up when conditions change. It looks at six structural dimensions \u2014 concentration, recurrence, forward visibility, labor dependence, variability, and continuity \u2014 and produces a single number that tells you where you stand.</p>
<p style="font-size:14px;color:${muted};line-height:1.75;margin:0;">Take your free assessment to receive your personalized income structure analysis. It takes under 3 minutes.</p>
</td></tr></table>
${nurtureCta("Take Your Free Assessment", "https://peoplestar.com/RunPayway/begin")}
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:28px 0 0;">
<tr><td style="padding:20px 24px;border-radius:8px;background-color:#fafaf8;border:1px solid rgba(14,26,43,0.04);">
<p style="font-size:13px;font-weight:600;color:${navy};margin:0 0 6px;">What to expect</p>
<p style="font-size:12px;color:${muted};line-height:1.65;margin:0;">Over the next week, you will receive two more briefs: your primary structural constraint and how to address it, and how income patterns in your industry compare. Each one builds on the last.</p>
</td></tr></table>`;

  return { subject: `Welcome to the Structural Income Brief, ${name}`, html: nurtureEmailWrapper(body, name) };
}

// Reminder email 2 (Day 3, no score available) — nudge to take assessment
function buildNurtureReminder2({ name }) {
  const navy = "#1C1635";
  const muted = "rgba(14,26,43,0.58)";
  const light = "rgba(14,26,43,0.35)";

  const body = `
<p style="font-size:22px;font-weight:300;color:${navy};margin:0 0 6px;letter-spacing:-0.02em;line-height:1.3;">${name}, your structural analysis is waiting.</p>
<p style="font-size:13px;color:${light};line-height:1.7;margin:8px 0 0;">We have not received your assessment yet. Here is why it matters.</p>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:24px 0;"><tr><td style="height:1px;background-color:rgba(14,26,43,0.06);">&nbsp;</td></tr></table>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin-top:0;">
<tr><td>
<p style="font-size:14px;color:${muted};line-height:1.75;margin:0 0 12px;">The difference between income that feels stable and income that is structurally stable is not always obvious. Most people discover the gap only when something disrupts their earning pattern \u2014 a lost client, an industry shift, an unexpected change.</p>
<p style="font-size:14px;color:${muted};line-height:1.75;margin:0;">The free assessment takes under 3 minutes. It maps six structural dimensions of your income and identifies the single highest-leverage change you can make. No financial advice, no sales pitch \u2014 just a structural reading of how your income actually works.</p>
</td></tr></table>
${nurtureCta("Start Your Free Assessment", "https://peoplestar.com/RunPayway/begin")}`;

  return { subject: `${name}, your structural analysis is waiting`, html: nurtureEmailWrapper(body, name) };
}

// Reminder email 3 (Day 7, no score available) — last nudge
function buildNurtureReminder3({ name }) {
  const navy = "#1C1635";
  const muted = "rgba(14,26,43,0.58)";
  const light = "rgba(14,26,43,0.35)";

  const body = `
<p style="font-size:22px;font-weight:300;color:${navy};margin:0 0 6px;letter-spacing:-0.02em;line-height:1.3;">One structural question for ${name}.</p>
<p style="font-size:13px;color:${light};line-height:1.7;margin:8px 0 0;">This is the last email in the series without your assessment.</p>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:24px 0;"><tr><td style="height:1px;background-color:rgba(14,26,43,0.06);">&nbsp;</td></tr></table>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin-top:0;">
<tr><td>
<p style="font-size:14px;color:${muted};line-height:1.75;margin:0 0 12px;">If your largest income source disappeared tomorrow \u2014 how many months could your current structure sustain you?</p>
<p style="font-size:14px;color:${muted};line-height:1.75;margin:0 0 12px;">Most professionals answer this question with a feeling, not a number. The Income Stability Score replaces that feeling with a structural measurement. Six dimensions, one score, one clear priority.</p>
<p style="font-size:14px;color:${muted};line-height:1.75;margin:0;">It takes under 3 minutes. The result will either confirm that your structure is sound, or it will show you exactly where it is not.</p>
</td></tr></table>
${nurtureCta("See Where You Stand", "https://peoplestar.com/RunPayway/begin")}`;

  return { subject: `One structural question for ${name}`, html: nurtureEmailWrapper(body, name) };
}

// ══════════════════════════════════════════════════════════
// FOLLOW-UP EMAIL CRON
// ══════════════════════════════════════════════════════════

// followup_sent bitmask: 0=none, 1=day7, 2=day30, 4=day90

async function handleFollowUpCron(env) {
  if (!env.RESEND_API_KEY) return;
  const fromEmail = env.FROM_EMAIL || "RunPayway <reports@peoplestar.com>";

  // Query records with email that haven't received all follow-ups
  const rows = await env.DB.prepare(
    `SELECT id, email, assessment_title, score, band, top_action, created_at, followup_sent
     FROM records
     WHERE email != '' AND email IS NOT NULL AND followup_sent < 7
     ORDER BY created_at ASC LIMIT 50`
  ).all();

  if (!rows?.results?.length) return;

  const now = Date.now();

  for (const row of rows.results) {
    const daysSince = Math.floor((now - new Date(row.created_at).getTime()) / (1000 * 60 * 60 * 24));
    const sent = row.followup_sent || 0;
    const name = row.assessment_title || "there";

    let email = null;

    // Day 7 (send between day 6-14)
    if (daysSince >= 6 && daysSince <= 14 && !(sent & 1)) {
      email = {
        flag: 1,
        subject: `${name}, have you explored your Command Center yet?`,
        html: followUpDay7(name, row.score, row.band, row.top_action, row.id),
      };
    }
    // Day 30 (send between day 28-45)
    else if (daysSince >= 28 && daysSince <= 45 && !(sent & 2)) {
      email = {
        flag: 2,
        subject: `${daysSince} days since your assessment \u2014 here\u2019s what to focus on`,
        html: followUpDay30(name, row.score, row.top_action, daysSince, row.id),
      };
    }
    // Day 90 (send between day 85-120)
    else if (daysSince >= 85 && daysSince <= 120 && !(sent & 4)) {
      email = {
        flag: 4,
        subject: `${name}, it\u2019s time to see how much you\u2019ve improved`,
        html: followUpDay90(name, daysSince, row.id),
      };
    }

    if (!email) continue;

    try {
      const res = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: { "Content-Type": "application/json", "Authorization": `Bearer ${env.RESEND_API_KEY}` },
        body: JSON.stringify({
          from: fromEmail,
          to: row.email,
          subject: email.subject,
          html: email.html,
          tags: [{ name: "type", value: "follow-up" }, { name: "record_id", value: row.id.slice(0, 8) }],
        }),
      });
      if (res.ok) {
        await env.DB.prepare("UPDATE records SET followup_sent = ? WHERE id = ?").bind(sent | email.flag, row.id).run();
      }
    } catch { /* email send failed — will retry next cron */ }
  }
}

function followUpDay7(name, score, band, topAction, recordId) {
  const link = recordId ? `https://peoplestar.com/RunPayway/dashboard?record=${encodeURIComponent(recordId)}` : "https://peoplestar.com/RunPayway/dashboard";
  return `<!DOCTYPE html><html><head><meta charset="UTF-8"/><meta name="viewport" content="width=device-width,initial-scale=1.0"/></head>
<body style="margin:0;padding:0;background:#1C1635;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;">
<table width="100%" cellpadding="0" cellspacing="0" style="background:#1C1635;"><tr><td style="height:32px;"></td></tr>
<tr><td align="center" style="padding:0 16px;">
<table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;">
<tr><td style="padding:28px 40px 24px;"><img src="https://peoplestar.com/RunPayway/runpayway-logo-blue.png" alt="RunPayway" width="140" height="17" style="height:auto;filter:brightness(0) invert(1);opacity:0.85;"/></td></tr>
<tr><td style="padding:0 40px;"><table width="100%"><tr><td style="background:linear-gradient(90deg,#4B3FAE,#1F6D7A);height:2px;border-radius:1px;"></td></tr></table></td></tr>
<tr><td style="padding:0 12px;"><table width="100%" cellpadding="0" cellspacing="0">
<tr><td style="background:#ffffff;padding:44px 40px 40px;border-radius:12px;">
<p style="font-size:22px;font-weight:300;color:#1C1635;margin:0 0 12px;">${name}, your Command Center is waiting.</p>
<p style="font-size:14px;color:rgba(14,26,43,0.55);line-height:1.65;margin:0 0 24px;">Your Income Stability Score is <strong style="color:#1C1635;">${score}/100</strong> (${band}). Your 12-week roadmap, PressureMap, and What-If Simulator are ready.</p>
${topAction ? `<div style="border-left:3px solid #4B3FAE;padding:16px 20px;background:rgba(75,63,174,0.04);border-radius:0 8px 8px 0;margin-bottom:24px;">
<div style="font-size:10px;font-weight:700;letter-spacing:0.12em;color:#4B3FAE;margin-bottom:6px;">YOUR #1 PRIORITY</div>
<div style="font-size:15px;font-weight:600;color:#1C1635;">${topAction}</div></div>` : ""}
<table cellpadding="0" cellspacing="0" style="margin:0 auto;"><tr><td style="background:#4B3FAE;border-radius:10px;">
<a href="${link}" style="display:inline-block;padding:14px 32px;color:#ffffff;font-size:14px;font-weight:600;text-decoration:none;">Open Your Command Center</a>
</td></tr></table>
</td></tr></table></td></tr>
<tr><td style="padding:24px 40px;text-align:center;">
<p style="font-size:10px;color:rgba(244,241,234,0.30);margin:0;">RunPayway\u2122 \u2014 Income Stability Score \u2014 <a href="https://peoplestar.com/RunPayway/contact" style="color:rgba(244,241,234,0.35);text-decoration:none;">Contact</a></p>
</td></tr>
</table></td></tr></table></body></html>`;
}

function followUpDay30(name, score, topAction, daysSince, recordId) {
  const link = recordId ? `https://peoplestar.com/RunPayway/dashboard?record=${encodeURIComponent(recordId)}` : "https://peoplestar.com/RunPayway/dashboard";
  return `<!DOCTYPE html><html><head><meta charset="UTF-8"/><meta name="viewport" content="width=device-width,initial-scale=1.0"/></head>
<body style="margin:0;padding:0;background:#1C1635;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;">
<table width="100%" cellpadding="0" cellspacing="0" style="background:#1C1635;"><tr><td style="height:32px;"></td></tr>
<tr><td align="center" style="padding:0 16px;">
<table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;">
<tr><td style="padding:28px 40px 24px;"><img src="https://peoplestar.com/RunPayway/runpayway-logo-blue.png" alt="RunPayway" width="140" height="17" style="height:auto;filter:brightness(0) invert(1);opacity:0.85;"/></td></tr>
<tr><td style="padding:0 40px;"><table width="100%"><tr><td style="background:linear-gradient(90deg,#4B3FAE,#1F6D7A);height:2px;border-radius:1px;"></td></tr></table></td></tr>
<tr><td style="padding:0 12px;"><table width="100%" cellpadding="0" cellspacing="0">
<tr><td style="background:#ffffff;padding:44px 40px 40px;border-radius:12px;">
<p style="font-size:22px;font-weight:300;color:#1C1635;margin:0 0 12px;">${daysSince} days since your assessment.</p>
<p style="font-size:14px;color:rgba(14,26,43,0.55);line-height:1.65;margin:0 0 16px;">Your score of <strong style="color:#1C1635;">${score}</strong> reflects your income structure \u2014 not market conditions. The only way to change it is to make a structural change.</p>
<p style="font-size:14px;color:rgba(14,26,43,0.55);line-height:1.65;margin:0 0 24px;">${topAction ? `Your highest-leverage move is still: <strong style="color:#1C1635;">${topAction}</strong>. ` : ""}Use the Simulator to model the impact before you commit.</p>
<table cellpadding="0" cellspacing="0" style="margin:0 auto;"><tr><td style="background:#4B3FAE;border-radius:10px;">
<a href="${link}" style="display:inline-block;padding:14px 32px;color:#ffffff;font-size:14px;font-weight:600;text-decoration:none;">Open the Simulator</a>
</td></tr></table>
</td></tr></table></td></tr>
<tr><td style="padding:24px 40px;text-align:center;">
<p style="font-size:10px;color:rgba(244,241,234,0.30);margin:0;">RunPayway\u2122 \u2014 Income Stability Score \u2014 <a href="https://peoplestar.com/RunPayway/contact" style="color:rgba(244,241,234,0.35);text-decoration:none;">Contact</a></p>
</td></tr>
</table></td></tr></table></body></html>`;
}

// ══════════════════════════════════════════════════════════
// NURTURE EMAIL ENDPOINT
// ══════════════════════════════════════════════════════════

async function handleNurture(body, env, corsHeaders) {
  const { email, name, score, band, constraint, industry, emailNumber } = body;

  if (!email || !emailNumber || !name) {
    return new Response(JSON.stringify({ error: "Missing required fields: email, name, emailNumber" }), {
      status: 400, headers: corsHeaders,
    });
  }

  if (![1, 2, 3].includes(emailNumber)) {
    return new Response(JSON.stringify({ error: "emailNumber must be 1, 2, or 3" }), {
      status: 400, headers: corsHeaders,
    });
  }

  if (!env.RESEND_API_KEY) {
    return new Response(JSON.stringify({ error: "Email not configured" }), {
      status: 500, headers: corsHeaders,
    });
  }

  const params = {
    name: name || "there",
    score: score || 0,
    band: band || "",
    constraint: constraint || "Income Concentration",
    industry: industry || "",
  };

  let subject, html;

  if (emailNumber === 1) {
    const result = buildNurtureEmail1(params);
    subject = result.subject;
    html = result.html;
  } else if (emailNumber === 2) {
    const result = buildNurtureEmail2(params);
    subject = result.subject;
    html = result.html;
  } else {
    const result = buildNurtureEmail3(params);
    subject = result.subject;
    html = result.html;
  }

  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${env.RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: env.FROM_EMAIL || "RunPayway <reports@peoplestar.com>",
        to: email,
        subject,
        html,
        tags: [
          { name: "type", value: `nurture-${emailNumber}` },
          { name: "score", value: String(score || 0) },
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
  } catch (err) {
    return new Response(JSON.stringify({ error: "Send failed", detail: String(err) }), {
      status: 500, headers: corsHeaders,
    });
  }
}

// ── Nurture email template builders (inlined for Worker compatibility) ──

function nurtureEmailWrapper(bodyContent, recipientName) {
  const navy = "#1C1635";
  const purple = "#4B3FAE";
  const teal = "#1F6D7A";
  return `<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8"/><meta name="viewport" content="width=device-width,initial-scale=1.0"/></head>
<body style="margin:0;padding:0;background-color:${navy};font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:${navy};">
<tr><td style="height:32px;">&nbsp;</td></tr>
<tr><td align="center" style="padding:0 16px;">
<table role="presentation" width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;">
<tr><td style="padding:28px 40px 24px;text-align:left;">
<img src="https://peoplestar.com/RunPayway/runpayway-logo-blue.png" alt="RunPayway" width="140" height="17" style="display:inline-block;height:auto;filter:brightness(0) invert(1);opacity:0.85;"/>
</td></tr>
<tr><td style="padding:0 40px;"><table role="presentation" width="100%" cellpadding="0" cellspacing="0"><tr><td style="background:linear-gradient(90deg,${purple} 0%,${teal} 100%);height:2px;border-radius:1px;">&nbsp;</td></tr></table></td></tr>
<tr><td style="padding:0 12px;">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0">
<tr><td style="background-color:#ffffff;padding:44px 40px 40px;border-radius:12px;margin-top:20px;">
${bodyContent}
</td></tr>
</table>
</td></tr>
<tr><td style="padding:32px 52px 12px;">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0">
<tr><td style="text-align:center;">
<p style="font-size:11px;color:rgba(244,241,234,0.40);margin:0 0 6px;letter-spacing:0.04em;">RunPayway \u2014 Income Stability Score\u2122</p>
<p style="font-size:10px;color:rgba(244,241,234,0.22);margin:0 0 12px;">Confidential \u2014 Prepared exclusively for ${recipientName}</p>
<a href="https://peoplestar.com/RunPayway/contact" style="font-size:10px;color:rgba(244,241,234,0.35);text-decoration:none;letter-spacing:0.06em;">CONTACT US</a>
<span style="font-size:10px;color:rgba(244,241,234,0.18);margin:0 8px;">&middot;</span>
<a href="https://peoplestar.com/RunPayway/contact?subject=unsubscribe" style="font-size:10px;color:rgba(244,241,234,0.35);text-decoration:none;letter-spacing:0.06em;">UNSUBSCRIBE</a>
</td></tr>
</table>
</td></tr>
<tr><td style="height:24px;">&nbsp;</td></tr>
</table>
</td></tr>
</table>
</body>
</html>`;
}

function nurtureCta(text, href) {
  return `<table role="presentation" cellpadding="0" cellspacing="0" style="margin:28px 0 0;">
<tr><td style="background-color:#4B3FAE;border-radius:10px;">
<a href="${href}" style="display:inline-block;padding:14px 40px;color:#ffffff;font-size:14px;font-weight:600;text-decoration:none;letter-spacing:0.02em;">${text}</a>
</td></tr>
</table>`;
}

function nurtureBandColor(score) {
  return score >= 75 ? "#1F6D7A" : score >= 50 ? "#2B5EA7" : score >= 30 ? "#92640A" : "#9B2C2C";
}

function buildNurtureEmail1({ name, score, band, constraint, industry }) {
  const navy = "#1C1635";
  const muted = "rgba(14,26,43,0.58)";
  const light = "rgba(14,26,43,0.35)";
  const color = nurtureBandColor(score);

  const body = `
<p style="font-size:22px;font-weight:300;color:${navy};margin:0 0 6px;letter-spacing:-0.02em;line-height:1.3;">${name}, here is what your score means.</p>
<p style="font-size:13px;color:${light};line-height:1.7;margin:8px 0 0;">Your Income Stability Score places you in context against structural benchmarks.</p>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:24px 0;"><tr><td style="height:1px;background-color:rgba(14,26,43,0.06);">&nbsp;</td></tr></table>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0">
<tr><td style="padding:24px 28px;background-color:#fafaf8;border-radius:10px;border:1px solid rgba(14,26,43,0.04);">
<table role="presentation" cellpadding="0" cellspacing="0"><tr>
<td style="font-size:48px;font-weight:200;color:${navy};line-height:1;letter-spacing:-0.04em;font-family:'Georgia',serif;">${score}</td>
<td style="font-size:14px;font-weight:300;color:rgba(14,26,43,0.18);vertical-align:bottom;padding-bottom:8px;padding-left:4px;">/100</td>
<td style="vertical-align:bottom;padding-bottom:8px;padding-left:16px;">
<table role="presentation" cellpadding="0" cellspacing="0"><tr>
<td style="width:8px;height:8px;border-radius:2px;background-color:${color};">&nbsp;</td>
<td style="padding-left:8px;font-size:13px;font-weight:600;color:${color};">${band}</td>
</tr></table></td>
</tr></table>
</td></tr></table>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin-top:24px;"><tr><td>
<p style="font-size:14px;color:${muted};line-height:1.75;margin:0 0 12px;">
A score of ${score} in the <strong style="color:${navy};font-weight:600;">${band}</strong> band means your income structure ${score >= 50 ? "has a functional foundation but carries specific vulnerabilities" : "is exposed to structural disruption in ways that may not be visible day to day"}. ${industry ? `For professionals in ${industry}, this is a common pattern` : "This is a common pattern"} \u2014 and it is addressable.</p>
<p style="font-size:14px;color:${muted};line-height:1.75;margin:0;">
Your primary constraint is <strong style="color:${navy};font-weight:600;">${(constraint || "").toLowerCase()}</strong>. This is the single structural factor holding your score where it is. Addressing it changes the trajectory of your entire income architecture.</p>
</td></tr></table>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:28px 0 0;">
<tr><td style="padding:20px 24px;border-radius:8px;background-color:#fafaf8;border:1px solid rgba(14,26,43,0.04);">
<p style="font-size:13px;font-weight:600;color:${navy};margin:0 0 6px;">See the full picture</p>
<p style="font-size:12px;color:${muted};line-height:1.65;margin:0 0 16px;">The diagnostic reveals every dimension of your income structure, maps your specific risks, and gives you a step-by-step plan to improve your score.</p>
${nurtureCta("See Your Full Diagnostic", "https://peoplestar.com/RunPayway/pricing")}
</td></tr></table>`;

  return { subject: `${name}, here\u2019s what your ${score} means`, html: nurtureEmailWrapper(body, name) };
}

function buildNurtureEmail2({ name, score, band, constraint, industry }) {
  const navy = "#1C1635";
  const muted = "rgba(14,26,43,0.58)";
  const light = "rgba(14,26,43,0.35)";

  const constraintActions = {
    "Income Concentration": "Begin converting one existing client relationship into a retainer or standing agreement. Even a partial shift \u2014 moving 15\u201320% of project-based work into a recurring arrangement \u2014 changes how your income behaves under pressure.",
    "Forward Visibility": "Propose a 3-month or 6-month engagement framework to your most consistent revenue source. The goal is not to lock in every dollar \u2014 it is to extend the horizon of income you can see ahead of you.",
    "Labor Dependence": "Identify one deliverable you currently produce manually and package it as a repeatable, scalable offering. A productized service, a template library, a licensing arrangement \u2014 something that generates revenue without requiring your direct time.",
    "Low Recurrence": "Convert your most reliable one-time engagements into recurring structures. A retainer, a maintenance contract, a subscription-based access model. The structural shift matters more than the dollar amount.",
    "Source Diversification": "Open a second revenue channel that does not depend on your primary source. This does not mean working more hours \u2014 it means distributing income risk across independent relationships.",
    "Earnings Variability": "Introduce a floor into your income structure. A minimum monthly retainer, a base-rate agreement, or a prepaid package that guarantees a threshold regardless of project volume.",
    "Structural Durability": "Strengthen the agreements underpinning your income. Move from verbal commitments to documented terms. Extend contract durations where possible.",
    "Income Continuity": "Build a buffer of income that continues if you stop active work for 30 days. This could be deferred revenue, a licensing stream, or pre-sold capacity that does not require your presence to deliver.",
  };

  const action = constraintActions[constraint] || `Focus on addressing ${(constraint || "").toLowerCase()} \u2014 this is the single highest-leverage structural change available to you.`;

  const body = `
<p style="font-size:22px;font-weight:300;color:${navy};margin:0 0 6px;letter-spacing:-0.02em;line-height:1.3;">The single structural move for ${name}.</p>
<p style="font-size:13px;color:${light};line-height:1.7;margin:8px 0 0;">Based on your score of ${score} and your primary constraint.</p>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:24px 0;"><tr><td style="height:1px;background-color:rgba(14,26,43,0.06);">&nbsp;</td></tr></table>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0">
<tr><td style="padding:20px 24px;background-color:#fafaf8;border-radius:10px;border:1px solid rgba(14,26,43,0.04);">
<p style="font-size:9px;font-weight:700;letter-spacing:0.14em;text-transform:uppercase;color:${light};margin:0 0 8px;">YOUR PRIMARY CONSTRAINT</p>
<p style="font-size:18px;font-weight:600;color:${navy};margin:0;">${constraint}</p>
</td></tr></table>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin-top:24px;"><tr><td>
<p style="font-size:14px;color:${muted};line-height:1.75;margin:0 0 16px;">${action}</p>
<p style="font-size:14px;color:${muted};line-height:1.75;margin:0;">${industry ? `In ${industry}, this type of structural adjustment typically produces measurable score improvement within 60\u201390 days.` : "This type of structural adjustment typically produces measurable score improvement within 60\u201390 days."} The full diagnostic includes the complete action plan \u2014 with specific targets, timelines, and ready-to-use negotiation scripts.</p>
</td></tr></table>
${nurtureCta("See Your Full Action Plan", "https://peoplestar.com/RunPayway/pricing")}`;

  return { subject: `The single structural move for ${name}`, html: nurtureEmailWrapper(body, name) };
}

function buildNurtureEmail3({ name, score, band, constraint, industry }) {
  const navy = "#1C1635";
  const muted = "rgba(14,26,43,0.58)";
  const light = "rgba(14,26,43,0.35)";
  const color = nurtureBandColor(score);
  const displayIndustry = industry || "your sector";

  const body = `
<p style="font-size:22px;font-weight:300;color:${navy};margin:0 0 6px;letter-spacing:-0.02em;line-height:1.3;">Income patterns in ${displayIndustry}.</p>
<p style="font-size:13px;color:${light};line-height:1.7;margin:8px 0 0;">Where most professionals in your industry score \u2014 and what separates the top from the rest.</p>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:24px 0;"><tr><td style="height:1px;background-color:rgba(14,26,43,0.06);">&nbsp;</td></tr></table>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0">
<tr><td style="padding:24px 28px;background-color:#fafaf8;border-radius:10px;border:1px solid rgba(14,26,43,0.04);">
<p style="font-size:9px;font-weight:700;letter-spacing:0.14em;text-transform:uppercase;color:${light};margin:0 0 8px;">INDUSTRY BASELINE</p>
<p style="font-size:16px;font-weight:500;color:${navy};margin:0 0 16px;">${displayIndustry}</p>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0"><tr>
<td width="50%" style="vertical-align:top;">
<p style="font-size:9px;font-weight:700;letter-spacing:0.14em;text-transform:uppercase;color:${light};margin:0 0 4px;">YOUR SCORE</p>
<p style="font-size:28px;font-weight:200;color:${navy};margin:0;font-family:'Georgia',serif;">${score}</p>
<table role="presentation" cellpadding="0" cellspacing="0" style="margin-top:6px;"><tr>
<td style="width:6px;height:6px;border-radius:2px;background-color:${color};">&nbsp;</td>
<td style="padding-left:6px;font-size:12px;font-weight:600;color:${color};">${band}</td>
</tr></table></td>
<td width="50%" style="vertical-align:top;border-left:1px solid rgba(14,26,43,0.06);padding-left:16px;">
<p style="font-size:9px;font-weight:700;letter-spacing:0.14em;text-transform:uppercase;color:${light};margin:0 0 4px;">PRIMARY CONSTRAINT</p>
<p style="font-size:14px;font-weight:600;color:${navy};margin:0;">${constraint}</p>
</td></tr></table>
</td></tr></table>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin-top:24px;"><tr><td>
<p style="font-size:14px;color:${muted};line-height:1.75;margin:0 0 12px;">Most professionals in ${displayIndustry} operate in the Developing to Established range. The most common constraints are forward visibility and income concentration \u2014 structural patterns that are endemic to the industry, not individual failures.</p>
<p style="font-size:14px;color:${muted};line-height:1.75;margin:0 0 12px;">What distinguishes the top quartile is not earning more \u2014 it is how income is structured. Retainer-based arrangements, diversified client relationships, and contracted forward visibility create scores that hold up under disruption.</p>
<p style="font-size:14px;color:${muted};line-height:1.75;margin:0;">Your score of ${score} reflects your specific position within these patterns. The full diagnostic maps exactly where you stand relative to industry benchmarks and gives you the structural moves to improve.</p>
</td></tr></table>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:28px 0 0;">
<tr><td style="padding:20px 24px;border-radius:8px;background-color:#fafaf8;border:1px solid rgba(14,26,43,0.04);">
<p style="font-size:13px;font-weight:600;color:${navy};margin:0 0 6px;">Your full diagnostic is ready to generate</p>
<p style="font-size:12px;color:${muted};line-height:1.65;margin:0 0 16px;">Personalized action plan, risk scenarios, 12-week roadmap with your actual numbers, and ready-to-use negotiation scripts. Full refund if it does not reveal something new.</p>
${nurtureCta("Unlock Your Full Diagnostic", "https://peoplestar.com/RunPayway/pricing")}
</td></tr></table>`;

  return { subject: `Income patterns in ${displayIndustry}`, html: nurtureEmailWrapper(body, name) };
}

function followUpDay90(name, daysSince, _recordId) {
  return `<!DOCTYPE html><html><head><meta charset="UTF-8"/><meta name="viewport" content="width=device-width,initial-scale=1.0"/></head>
<body style="margin:0;padding:0;background:#1C1635;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;">
<table width="100%" cellpadding="0" cellspacing="0" style="background:#1C1635;"><tr><td style="height:32px;"></td></tr>
<tr><td align="center" style="padding:0 16px;">
<table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;">
<tr><td style="padding:28px 40px 24px;"><img src="https://peoplestar.com/RunPayway/runpayway-logo-blue.png" alt="RunPayway" width="140" height="17" style="height:auto;filter:brightness(0) invert(1);opacity:0.85;"/></td></tr>
<tr><td style="padding:0 40px;"><table width="100%"><tr><td style="background:linear-gradient(90deg,#4B3FAE,#1F6D7A);height:2px;border-radius:1px;"></td></tr></table></td></tr>
<tr><td style="padding:0 12px;"><table width="100%" cellpadding="0" cellspacing="0">
<tr><td style="background:#ffffff;padding:44px 40px 40px;border-radius:12px;">
<p style="font-size:22px;font-weight:300;color:#1C1635;margin:0 0 12px;">It has been ${daysSince} days.</p>
<p style="font-size:14px;color:rgba(14,26,43,0.55);line-height:1.65;margin:0 0 16px;">If you have made structural changes to your income \u2014 signed a retainer, added a client, built a recurring stream \u2014 your score may have improved. There is only one way to find out.</p>
<p style="font-size:14px;color:rgba(14,26,43,0.55);line-height:1.65;margin:0 0 24px;">A new assessment will show you exactly how much progress you have made and where to focus next.</p>
<table cellpadding="0" cellspacing="0" style="margin:0 auto;"><tr><td style="background:#1C1635;border-radius:10px;">
<a href="https://peoplestar.com/RunPayway/pricing" style="display:inline-block;padding:14px 32px;color:#ffffff;font-size:14px;font-weight:600;text-decoration:none;">Reassess Your Score</a>
</td></tr></table>
<div style="border-left:3px solid #1F6D7A;padding:16px 20px;background:rgba(31,109,122,0.04);border-radius:0 8px 8px 0;margin-top:24px;">
<p style="font-size:13px;color:rgba(14,26,43,0.55);line-height:1.6;margin:0;">Income structures shift over time. We recommend reassessing after 90 days or whenever you make a significant structural change. Your Command Center tracks progress across assessments automatically.</p>
</div>
</td></tr></table></td></tr>
<tr><td style="padding:24px 40px;text-align:center;">
<p style="font-size:10px;color:rgba(244,241,234,0.30);margin:0;">RunPayway\u2122 \u2014 Income Stability Score \u2014 <a href="https://peoplestar.com/RunPayway/contact" style="color:rgba(244,241,234,0.35);text-decoration:none;">Contact</a></p>
</td></tr>
</table></td></tr></table></body></html>`;
}
