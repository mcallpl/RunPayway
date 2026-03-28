// RunPayway AI Worker — Cloudflare Worker
// Secure proxy for all Claude API calls. Routes by URL path.
// Endpoints: /pressuremap, /plain-english, /action-plan

export default {
  async fetch(request, env) {
    // CORS preflight
    if (request.method === "OPTIONS") {
      return new Response(null, {
        headers: {
          "Access-Control-Allow-Origin": env.ALLOWED_ORIGIN || "*",
          "Access-Control-Allow-Methods": "POST, OPTIONS",
          "Access-Control-Allow-Headers": "Content-Type",
          "Access-Control-Max-Age": "86400",
        },
      });
    }

    if (request.method !== "POST") {
      return new Response("Method not allowed", { status: 405 });
    }

    const corsHeaders = {
      "Access-Control-Allow-Origin": env.ALLOWED_ORIGIN || "*",
      "Content-Type": "application/json",
    };

    const url = new URL(request.url);
    const path = url.pathname.replace(/\/$/, "") || "/pressuremap";

    try {
      const body = await request.json();

      if (path === "/pressuremap" || path === "/") {
        return await handlePressureMap(body, env, corsHeaders);
      }
      if (path === "/plain-english") {
        return await handlePlainEnglish(body, env, corsHeaders);
      }
      if (path === "/action-plan") {
        return await handleActionPlan(body, env, corsHeaders);
      }
      if (path === "/save-record") {
        return await handleSaveRecord(body, env, corsHeaders);
      }
      if (path === "/get-record") {
        return await handleGetRecord(body, env, corsHeaders);
      }

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

// ── Call Claude ──────────────────────────────────────────
async function callClaude(system, user, env, maxTokens = 600) {
  const response = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": env.ANTHROPIC_API_KEY,
      "anthropic-version": "2023-06-01",
    },
    body: JSON.stringify({
      model: "claude-sonnet-4-5-20250514",
      max_tokens: maxTokens,
      system,
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

// ── Build profile block (shared across endpoints) ───────
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
  const system = `You are the PressureMap engine for RunPayway, an income stability assessment platform. You generate real-time structural intelligence briefings for individuals based on their specific industry, operating structure, income model, and assessment results.

CRITICAL RULES:
- Never provide financial advice, investment recommendations, or predictions
- Never mention specific companies, stocks, or investment vehicles
- Never fabricate statistics — use directional language (rising, declining, accelerating) not fake numbers
- Write in confident, institutional prose — like a strategy briefing, not a blog post
- Address the user directly (your, you)
- Connect every observation back to the user's specific structural profile
- Keep each section to 2-3 sentences maximum — concise, dense, no filler
- Use present tense — this is about right now, not the future
- Be SPECIFIC to the exact intersection of their industry, operating structure, and income model
- Do NOT use generic language that could apply to any industry`;

  const user = `Generate a PressureMap briefing for this individual:

${profileBlock(body)}

Return EXACTLY three sections in this JSON format:
{
  "pressure": "[2-3 sentences] What real-world forces in ${body.industry}, for a ${body.operating_structure} with a ${body.income_model} model, are currently working AGAINST their weakest structural factor (${body.weakest_factor}). Reference their exact numbers. Do NOT use language that could apply to any industry.",
  "tailwind": "[2-3 sentences] What current condition in ${body.industry} specifically gives this ${body.operating_structure} with a ${body.income_model} model a structural advantage or window of opportunity right now.",
  "leverage_move": "[2-3 sentences] The single highest-leverage structural change this specific ${body.operating_structure} in ${body.industry} earning through ${body.income_model} could make RIGHT NOW. Be operational and specific — name the exact type of arrangement, offer, or structural change that fits their profile."
}

Return ONLY the JSON object, no other text.`;

  const parsed = await callClaude(system, user, env);
  if (!parsed.pressure || !parsed.tailwind || !parsed.leverage_move) {
    return new Response(JSON.stringify({ error: "Incomplete response" }), {
      status: 502, headers: corsHeaders,
    });
  }

  return new Response(JSON.stringify({
    pressure: parsed.pressure,
    tailwind: parsed.tailwind,
    leverage_move: parsed.leverage_move,
  }), { headers: corsHeaders });
}

// ══════════════════════════════════════════════════════════
// PLAIN ENGLISH
// ══════════════════════════════════════════════════════════

async function handlePlainEnglish(body, env, corsHeaders) {
  const system = `You are a structural income analyst for RunPayway. You write clear, direct, plain-English interpretations of income stability scores. You are not a chatbot. You write like a senior analyst preparing a private briefing.

RULES:
- Write in second person (your, you)
- Be specific to the person's exact industry, operating structure, and income model
- Reference their actual numbers — do not generalize
- No financial advice, no predictions, no investment language
- Maximum 4 sentences for the main interpretation
- Maximum 2 sentences for why-not-higher
- Tone: authoritative, calm, precise — like a doctor explaining test results`;

  const user = `Write a plain-English score interpretation for this individual:

${profileBlock(body)}

Return in this JSON format:
{
  "interpretation": "[3-4 sentences] Explain what their score of ${body.score}/100 means in practical terms for a ${body.operating_structure} in ${body.industry} earning through ${body.income_model}. What does it mean for their daily reality? What is the single most important thing this score reveals about their structure? Be specific to their exact numbers and situation.",
  "why_not_higher": "[1-2 sentences] The single most important reason their score is ${body.score} and not higher. Be specific to their weakest factor (${body.weakest_factor}) and their exact industry/structure."
}

Return ONLY the JSON object, no other text.`;

  const parsed = await callClaude(system, user, env, 400);
  if (!parsed.interpretation) {
    return new Response(JSON.stringify({ error: "Incomplete response" }), {
      status: 502, headers: corsHeaders,
    });
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
  const system = `You are a structural income strategist for RunPayway. You write specific, actionable recommendations for improving income stability. You are not a life coach. You write like a management consultant delivering a strategy recommendation.

RULES:
- Write in second person (your, you)
- Be specific to the person's exact industry, operating structure, and income model
- Name specific types of arrangements, offers, or structural changes that fit their profile
- No financial advice, no predictions, no investment language
- Each recommendation must be concrete enough to act on this week
- Reference their actual numbers
- Tone: direct, operational, professional`;

  const user = `Write an action plan for this individual:

${profileBlock(body)}

Their primary constraint is: ${body.weakest_factor}
Their highest-leverage change would be: ${body.top_change || "Reduce " + body.weakest_factor}
Their projected score improvement: ${body.projected_lift || "Unknown"}

Return in this JSON format:
{
  "primary_action": "[2-3 sentences] The single most important structural change they should make. Be specific to a ${body.operating_structure} in ${body.industry} with a ${body.income_model} model. Name the exact type of arrangement or structural shift.",
  "primary_how": "[2-3 sentences] Exactly how to execute this change. What to say, who to approach, what to offer. Specific to their industry.",
  "supporting_action": "[1-2 sentences] A second supporting change that compounds with the first.",
  "supporting_how": "[1-2 sentences] How to execute the supporting change.",
  "combined_interpretation": "[1-2 sentences] What happens to their income structure if both changes are completed. Reference projected scores if provided.",
  "tradeoff_upside": "[1-2 sentences] The structural benefit of making the primary change.",
  "tradeoff_cost": "[1-2 sentences] The realistic cost or effort required.",
  "tradeoff_verdict": "[1 sentence] Whether it is worth doing and why."
}

Return ONLY the JSON object, no other text.`;

  const parsed = await callClaude(system, user, env, 800);
  if (!parsed.primary_action) {
    return new Response(JSON.stringify({ error: "Incomplete response" }), {
      status: 502, headers: corsHeaders,
    });
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
// GET RECORD (for simulator access)
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
