// RunPayway — Advisor Account Management (D1-backed)

import { sanitizeEmail, sanitizeString } from "./sanitize.js";

/* ── Tier definitions ──────────────────────────────────── */
export const ADVISOR_TIERS = {
  advisor_starter:      { reports_limit: 15,  period_months: 3  },
  advisor_professional: { reports_limit: 50,  period_months: 1  },
  advisor_enterprise:   { reports_limit: -1,  period_months: 1  },  // -1 = unlimited
};

/* ── Table initialization (idempotent) ─────────────────── */
export async function ensureAdvisorTables(env) {
  await env.DB.prepare(`
    CREATE TABLE IF NOT EXISTS advisor_accounts (
      advisor_code TEXT PRIMARY KEY,
      org_id TEXT,
      email TEXT NOT NULL,
      tier TEXT NOT NULL DEFAULT 'advisor_starter',
      reports_limit INTEGER NOT NULL DEFAULT 15,
      reports_used INTEGER NOT NULL DEFAULT 0,
      period_start TEXT NOT NULL,
      period_end TEXT NOT NULL,
      stripe_session_id TEXT,
      stripe_subscription_id TEXT,
      active INTEGER NOT NULL DEFAULT 1,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL
    )
  `).run();
  await env.DB.prepare(`CREATE INDEX IF NOT EXISTS idx_advisor_email ON advisor_accounts(email)`).run();
  await env.DB.prepare(`CREATE INDEX IF NOT EXISTS idx_advisor_stripe ON advisor_accounts(stripe_session_id)`).run();

  await env.DB.prepare(`
    CREATE TABLE IF NOT EXISTS advisor_seats (
      seat_id TEXT PRIMARY KEY,
      org_id TEXT NOT NULL,
      advisor_code TEXT NOT NULL,
      email TEXT NOT NULL,
      status TEXT NOT NULL DEFAULT 'active',
      created_at TEXT NOT NULL
    )
  `).run();
  await env.DB.prepare(`CREATE INDEX IF NOT EXISTS idx_seats_org ON advisor_seats(org_id)`).run();

  await env.DB.prepare(`
    CREATE TABLE IF NOT EXISTS advisor_usage_log (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      advisor_code TEXT NOT NULL,
      assessment_id TEXT NOT NULL,
      client_name TEXT,
      created_at TEXT NOT NULL
    )
  `).run();
  await env.DB.prepare(`CREATE INDEX IF NOT EXISTS idx_usage_advisor ON advisor_usage_log(advisor_code)`).run();

  await env.DB.prepare(`
    CREATE TABLE IF NOT EXISTS advisor_records (
      record_id TEXT PRIMARY KEY,
      advisor_code TEXT NOT NULL,
      client_id TEXT NOT NULL,
      client_name TEXT,
      industry_sector TEXT,
      score INTEGER,
      band TEXT,
      top_risk TEXT,
      checksum TEXT NOT NULL,
      model_version TEXT NOT NULL DEFAULT 'RP-2.0',
      record_data TEXT NOT NULL,
      created_at TEXT NOT NULL
    )
  `).run();
  await env.DB.prepare(`CREATE INDEX IF NOT EXISTS idx_records_advisor ON advisor_records(advisor_code)`).run();
  await env.DB.prepare(`CREATE INDEX IF NOT EXISTS idx_records_client ON advisor_records(client_id)`).run();
}

/* ── Helpers ───────────────────────────────────────────── */
function generateAdvisorCode() {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"; // no I/O/1/0
  let code = "ADV-";
  for (let i = 0; i < 8; i++) {
    code += chars[Math.floor(Math.random() * chars.length)];
  }
  return code;
}

function computePeriodEnd(periodStart, periodMonths) {
  const d = new Date(periodStart);
  d.setMonth(d.getMonth() + periodMonths);
  return d.toISOString();
}

/* ── POST /advisor/create ──────────────────────────────── */
export async function handleAdvisorCreate(body, env, corsHeaders) {
  const email = sanitizeEmail(body.email);
  const tier = sanitizeString(body.tier, 50);
  const stripe_session_id = sanitizeString(body.stripe_session_id, 200);

  if (!email || !tier) {
    return new Response(JSON.stringify({ error: "Missing email or tier" }), {
      status: 400, headers: corsHeaders,
    });
  }

  const config = ADVISOR_TIERS[tier];
  if (!config) {
    return new Response(JSON.stringify({ error: "Unknown tier" }), {
      status: 400, headers: corsHeaders,
    });
  }

  // Duplicate detection: same stripe_session_id
  if (stripe_session_id) {
    const existing = await env.DB.prepare(
      "SELECT * FROM advisor_accounts WHERE stripe_session_id = ?"
    ).bind(stripe_session_id).first();
    if (existing) {
      return new Response(JSON.stringify({
        success: true, advisor_code: existing.advisor_code, account: existing, duplicate: true,
      }), { headers: corsHeaders });
    }
  }

  // Duplicate detection: same email + tier within 24h
  const cutoff24h = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
  const recent = await env.DB.prepare(
    "SELECT * FROM advisor_accounts WHERE email = ? AND tier = ? AND created_at > ? ORDER BY created_at DESC LIMIT 1"
  ).bind(email, tier, cutoff24h).first();
  if (recent) {
    return new Response(JSON.stringify({
      success: true, advisor_code: recent.advisor_code, account: recent, duplicate: true,
    }), { headers: corsHeaders });
  }

  const now = new Date();
  const advisor_code = generateAdvisorCode();
  const period_start = now.toISOString();
  const period_end = computePeriodEnd(period_start, config.period_months);

  await env.DB.prepare(
    `INSERT INTO advisor_accounts
     (advisor_code, org_id, email, tier, reports_limit, reports_used, period_start, period_end, stripe_session_id, stripe_subscription_id, active, created_at, updated_at)
     VALUES (?, ?, ?, ?, ?, 0, ?, ?, ?, ?, 1, ?, ?)`
  ).bind(
    advisor_code,
    null,
    email,
    tier,
    config.reports_limit,
    period_start,
    period_end,
    stripe_session_id || null,
    null,
    now.toISOString(),
    now.toISOString(),
  ).run();

  const created = await env.DB.prepare(
    "SELECT * FROM advisor_accounts WHERE advisor_code = ?"
  ).bind(advisor_code).first();

  return new Response(JSON.stringify({
    success: true, advisor_code, account: created,
  }), { headers: corsHeaders });
}

/* ── POST /advisor/validate ────────────────────────────── */
export async function handleAdvisorValidate(body, env, corsHeaders) {
  const advisor_code = sanitizeString(body.advisor_code, 100);

  if (!advisor_code) {
    return new Response(JSON.stringify({ valid: false, reason: "missing_code" }), {
      status: 400, headers: corsHeaders,
    });
  }

  const account = await env.DB.prepare(
    "SELECT * FROM advisor_accounts WHERE advisor_code = ?"
  ).bind(advisor_code).first();

  if (!account) {
    return new Response(JSON.stringify({ valid: false, reason: "not_found" }), {
      headers: corsHeaders,
    });
  }

  // Check if period has expired
  if (new Date(account.period_end) < new Date()) {
    if (account.active === 1) {
      await env.DB.prepare(
        "UPDATE advisor_accounts SET active = 0, updated_at = ? WHERE advisor_code = ?"
      ).bind(new Date().toISOString(), advisor_code).run();
    }
    return new Response(JSON.stringify({
      valid: false, reason: "expired", period_end: account.period_end,
    }), { headers: corsHeaders });
  }

  if (account.active !== 1) {
    return new Response(JSON.stringify({
      valid: false, reason: "inactive",
    }), { headers: corsHeaders });
  }

  return new Response(JSON.stringify({
    valid: true,
    tier: account.tier,
    email: account.email,
    reports_used: account.reports_used,
    reports_limit: account.reports_limit,
    period_start: account.period_start,
    period_end: account.period_end,
  }), { headers: corsHeaders });
}

/* ── POST /advisor/usage ───────────────────────────────── */
export async function handleAdvisorUsage(body, env, corsHeaders) {
  const advisor_code = sanitizeString(body.advisor_code, 100);

  if (!advisor_code) {
    return new Response(JSON.stringify({ error: "Missing advisor_code" }), {
      status: 400, headers: corsHeaders,
    });
  }

  const account = await env.DB.prepare(
    "SELECT reports_used, reports_limit, tier, period_start, period_end, active FROM advisor_accounts WHERE advisor_code = ?"
  ).bind(advisor_code).first();

  if (!account) {
    return new Response(JSON.stringify({ error: "Account not found" }), {
      status: 404, headers: corsHeaders,
    });
  }

  const remaining = account.reports_limit === -1
    ? -1  // unlimited
    : Math.max(0, account.reports_limit - account.reports_used);

  return new Response(JSON.stringify({
    reports_used: account.reports_used,
    reports_limit: account.reports_limit,
    remaining,
    tier: account.tier,
    period_start: account.period_start,
    period_end: account.period_end,
    active: account.active === 1,
  }), { headers: corsHeaders });
}

/* ── POST /advisor/meter ───────────────────────────────── */
export async function handleAdvisorMeter(body, env, corsHeaders) {
  const advisor_code = sanitizeString(body.advisor_code, 100);
  const assessment_id = sanitizeString(body.assessment_id, 100);
  const client_name = sanitizeString(body.client_name, 200);

  if (!advisor_code || !assessment_id) {
    return new Response(JSON.stringify({ error: "Missing advisor_code or assessment_id" }), {
      status: 400, headers: corsHeaders,
    });
  }

  const account = await env.DB.prepare(
    "SELECT * FROM advisor_accounts WHERE advisor_code = ? AND active = 1"
  ).bind(advisor_code).first();

  if (!account) {
    return new Response(JSON.stringify({ error: "Account not found or inactive" }), {
      status: 404, headers: corsHeaders,
    });
  }

  // Check period hasn't expired
  if (new Date(account.period_end) < new Date()) {
    await env.DB.prepare(
      "UPDATE advisor_accounts SET active = 0, updated_at = ? WHERE advisor_code = ?"
    ).bind(new Date().toISOString(), advisor_code).run();
    return new Response(JSON.stringify({ error: "Period expired", period_end: account.period_end }), {
      status: 402, headers: corsHeaders,
    });
  }

  // Check limit (skip for unlimited / enterprise)
  if (account.reports_limit !== -1 && account.reports_used >= account.reports_limit) {
    return new Response(JSON.stringify({
      error: "Report limit reached",
      reports_used: account.reports_used,
      reports_limit: account.reports_limit,
      remaining: 0,
    }), { status: 402, headers: corsHeaders });
  }

  // Idempotency: check if this assessment_id was already logged
  const existingLog = await env.DB.prepare(
    "SELECT id FROM advisor_usage_log WHERE advisor_code = ? AND assessment_id = ?"
  ).bind(advisor_code, assessment_id).first();

  if (existingLog) {
    const remaining = account.reports_limit === -1
      ? -1
      : Math.max(0, account.reports_limit - account.reports_used);
    return new Response(JSON.stringify({
      success: true, idempotent: true,
      reports_used: account.reports_used, reports_limit: account.reports_limit, remaining,
    }), { headers: corsHeaders });
  }

  // Increment and log
  const now = new Date().toISOString();
  const newUsed = account.reports_used + 1;

  await env.DB.prepare(
    "UPDATE advisor_accounts SET reports_used = ?, updated_at = ? WHERE advisor_code = ?"
  ).bind(newUsed, now, advisor_code).run();

  await env.DB.prepare(
    "INSERT INTO advisor_usage_log (advisor_code, assessment_id, client_name, created_at) VALUES (?, ?, ?, ?)"
  ).bind(advisor_code, assessment_id, client_name || null, now).run();

  const remaining = account.reports_limit === -1
    ? -1
    : Math.max(0, account.reports_limit - newUsed);

  return new Response(JSON.stringify({
    success: true,
    reports_used: newUsed,
    reports_limit: account.reports_limit,
    remaining,
  }), { headers: corsHeaders });
}

/* ── POST /advisor/save-record ─────────────────────────── */
export async function handleAdvisorSaveRecord(body, env, corsHeaders) {
  const advisor_code = sanitizeString(body.advisor_code, 100);
  const record_id = sanitizeString(body.record_id, 100);
  const client_id = sanitizeString(body.client_id, 100);
  const client_name = sanitizeString(body.client_name, 200);
  const industry_sector = sanitizeString(body.industry_sector, 100);
  const score = typeof body.score === "number" ? Math.round(body.score) : null;
  const band = sanitizeString(body.band, 100);
  const top_risk = sanitizeString(body.top_risk, 100);
  const checksum = sanitizeString(body.checksum, 128);
  const model_version = sanitizeString(body.model_version, 20) || "RP-2.0";
  const record_data = typeof body.record_data === "string" ? body.record_data : JSON.stringify(body.record_data || {});

  if (!advisor_code || !record_id || !client_id || !checksum) {
    return new Response(JSON.stringify({ error: "Missing required fields" }), {
      status: 400, headers: corsHeaders,
    });
  }

  // Verify advisor is active
  const account = await env.DB.prepare(
    "SELECT active FROM advisor_accounts WHERE advisor_code = ?"
  ).bind(advisor_code).first();

  if (!account || account.active !== 1) {
    return new Response(JSON.stringify({ error: "Account not found or inactive" }), {
      status: 403, headers: corsHeaders,
    });
  }

  // Idempotency: if record_id already exists, return it
  const existing = await env.DB.prepare(
    "SELECT record_id FROM advisor_records WHERE record_id = ?"
  ).bind(record_id).first();

  if (existing) {
    return new Response(JSON.stringify({ success: true, record_id, duplicate: true }), {
      headers: corsHeaders,
    });
  }

  const now = new Date().toISOString();

  await env.DB.prepare(
    `INSERT INTO advisor_records
     (record_id, advisor_code, client_id, client_name, industry_sector, score, band, top_risk, checksum, model_version, record_data, created_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
  ).bind(
    record_id, advisor_code, client_id, client_name || null,
    industry_sector || null, score, band || null, top_risk || null,
    checksum, model_version, record_data, now,
  ).run();

  return new Response(JSON.stringify({ success: true, record_id }), { headers: corsHeaders });
}

/* ── POST /advisor/get-record ──────────────────────────── */
export async function handleAdvisorGetRecord(body, env, corsHeaders) {
  const record_id = sanitizeString(body.record_id, 100);

  if (!record_id) {
    return new Response(JSON.stringify({ error: "Missing record_id" }), {
      status: 400, headers: corsHeaders,
    });
  }

  const row = await env.DB.prepare(
    "SELECT * FROM advisor_records WHERE record_id = ?"
  ).bind(record_id).first();

  if (!row) {
    return new Response(JSON.stringify({ error: "Record not found" }), {
      status: 404, headers: corsHeaders,
    });
  }

  // Verify checksum integrity
  let record;
  let integrityValid = false;
  try {
    record = JSON.parse(row.record_data);
    if (record && record.checksum === row.checksum) {
      integrityValid = true;
    }
  } catch {
    integrityValid = false;
  }

  return new Response(JSON.stringify({
    success: true,
    record_id: row.record_id,
    advisor_code: row.advisor_code,
    client_id: row.client_id,
    client_name: row.client_name,
    industry_sector: row.industry_sector,
    score: row.score,
    band: row.band,
    top_risk: row.top_risk,
    checksum: row.checksum,
    model_version: row.model_version,
    created_at: row.created_at,
    integrity_valid: integrityValid,
    record: integrityValid ? record : null,
  }), { headers: corsHeaders });
}
