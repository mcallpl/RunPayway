// RunPayway — Record persistence (save, get, stats, error reports)

import { sanitizeString, sanitizeEmail, sanitizeInteger } from "./sanitize.js";

// ══════════════════════════════════════════════════════════
// ERROR REPORTING — D1-backed client error capture
// ══════════════════════════════════════════════════════════

export async function ensureErrorReportsTable(env) {
  await env.DB.prepare(`CREATE TABLE IF NOT EXISTS error_reports (
    id TEXT PRIMARY KEY, created_at TEXT NOT NULL, error_message TEXT NOT NULL,
    error_stack TEXT DEFAULT '', page_url TEXT DEFAULT '', user_agent TEXT DEFAULT '',
    component TEXT DEFAULT '', metadata TEXT DEFAULT '{}'
  )`).run();
}

export async function handleErrorReport(body, env, corsHeaders) {
  const id = "err_" + crypto.randomUUID().slice(0, 12);
  const now = new Date().toISOString();
  const error_message = sanitizeString(body.error_message || body.message || "", 2000);
  const error_stack = sanitizeString(body.error_stack || body.stack || "", 4000);
  const page_url = sanitizeString(body.page_url || body.url || "", 1000);
  const user_agent = sanitizeString(body.user_agent || "", 500);
  const component = sanitizeString(body.component || "", 200);
  let metadata = "{}";
  try {
    metadata = JSON.stringify(body.metadata || {}).slice(0, 4000);
  } catch { /* ignore */ }

  if (!error_message) {
    return new Response(JSON.stringify({ error: "Missing error_message" }), {
      status: 400, headers: corsHeaders,
    });
  }

  await env.DB.prepare(
    `INSERT INTO error_reports (id, created_at, error_message, error_stack, page_url, user_agent, component, metadata)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?)`
  ).bind(id, now, error_message, error_stack, page_url, user_agent, component, metadata).run();

  return new Response(JSON.stringify({ success: true, id }), { headers: corsHeaders });
}

export async function handleGetErrorReports(env, corsHeaders) {
  const rows = await env.DB.prepare(
    "SELECT * FROM error_reports ORDER BY created_at DESC LIMIT 100"
  ).all();
  return new Response(JSON.stringify({ success: true, reports: rows?.results || [] }), { headers: corsHeaders });
}

// ══════════════════════════════════════════════════════════
// SAVE RECORD
// ══════════════════════════════════════════════════════════

export async function handleSaveRecord(body, env, corsHeaders) {
  const id = sanitizeString(body.id, 100);
  if (!id || !body.record_data) {
    return new Response(JSON.stringify({ error: "Missing id or record_data" }), {
      status: 400, headers: corsHeaders,
    });
  }

  const assessment_title = sanitizeString(body.assessment_title, 200);
  const industry = sanitizeString(body.industry, 200);
  const operating_structure = sanitizeString(body.operating_structure, 200);
  const income_model = sanitizeString(body.income_model, 200);
  const score = sanitizeInteger(body.score, 0, 100, 0);
  const band = sanitizeString(body.band, 100);
  const email = sanitizeEmail(body.email || "");
  const top_action = sanitizeString(body.top_action, 500);
  const idempotency_key = sanitizeString(body.idempotency_key, 200) || null;
  const record_data = typeof body.record_data === "string" ? body.record_data : JSON.stringify(body.record_data);

  // Auto-migrate: add columns if missing
  try { await env.DB.prepare("ALTER TABLE records ADD COLUMN email TEXT DEFAULT ''").run(); } catch { /* column exists */ }
  try { await env.DB.prepare("ALTER TABLE records ADD COLUMN top_action TEXT DEFAULT ''").run(); } catch { /* column exists */ }
  try { await env.DB.prepare("ALTER TABLE records ADD COLUMN followup_sent INTEGER DEFAULT 0").run(); } catch { /* column exists */ }
  try { await env.DB.prepare("ALTER TABLE records ADD COLUMN idempotency_key TEXT DEFAULT NULL").run(); } catch { /* column exists */ }

  // Idempotency: if key provided and record exists, return it
  if (idempotency_key) {
    const existing = await env.DB.prepare(
      "SELECT id FROM records WHERE idempotency_key = ? LIMIT 1"
    ).bind(idempotency_key).first();
    if (existing) {
      return new Response(JSON.stringify({ success: true, id: existing.id, idempotent: true }), { headers: corsHeaders });
    }
  }

  await env.DB.prepare(
    `INSERT OR REPLACE INTO records (id, created_at, assessment_title, industry, operating_structure, income_model, score, band, record_data, email, top_action, idempotency_key) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
  ).bind(
    id,
    new Date().toISOString(),
    assessment_title,
    industry,
    operating_structure,
    income_model,
    score,
    band,
    record_data,
    email,
    top_action,
    idempotency_key,
  ).run();

  // ── Update nurture record with score data if this email is enrolled ──
  if (email && score) {
    try {
      const nurture = await env.DB.prepare(
        "SELECT email FROM nurture_queue WHERE email = ?"
      ).bind(email).first();

      if (nurture) {
        // Parse record_data to extract the weakest factor / constraint
        let constraint = "";
        try {
          const rd = typeof body.record_data === "string" ? JSON.parse(body.record_data) : body.record_data;
          constraint = rd?.weakest_factor || rd?.constraint || top_action || "";
        } catch { /* ignore parse errors */ }

        await env.DB.prepare(
          `UPDATE nurture_queue SET score = ?, band = ?, constraint_name = ?, industry = ? WHERE email = ?`
        ).bind(
          score,
          band,
          constraint,
          industry,
          email
        ).run();
        console.log(`[Nurture] Updated score data for ${email}: ${score} (${band})`);
      }
    } catch (err) {
      console.error(`[Nurture] Failed to update score for ${email}:`, err);
    }
  }

  return new Response(JSON.stringify({ success: true, id }), { headers: corsHeaders });
}

// ══════════════════════════════════════════════════════════
// GET RECORD
// ══════════════════════════════════════════════════════════

export async function handleGetRecord(body, env, corsHeaders) {
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
// STATS
// ══════════════════════════════════════════════════════════

export async function handleStats(env, corsHeaders) {
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
