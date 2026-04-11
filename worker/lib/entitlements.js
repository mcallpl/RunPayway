// RunPayway — Entitlement CRUD (D1-backed access control)

import { sanitizeEmail, sanitizeString } from "./sanitize.js";

export const PLAN_CONFIGS = {
  free:                { assessments_allowed: 1, expires_months: null },
  single_assessment:   { assessments_allowed: 1, expires_months: null },
  annual_monitoring:   { assessments_allowed: 3, expires_months: 12 },
};

// Ensure the entitlements table exists (idempotent)
export async function ensureEntitlementsTable(env) {
  await env.DB.prepare(`
    CREATE TABLE IF NOT EXISTS entitlements (
      id TEXT PRIMARY KEY,
      email TEXT NOT NULL,
      plan_key TEXT NOT NULL,
      assessments_allowed INTEGER NOT NULL,
      assessments_used INTEGER NOT NULL DEFAULT 0,
      model_version TEXT NOT NULL DEFAULT 'RP-2.0',
      status TEXT NOT NULL DEFAULT 'active',
      stripe_session_id TEXT,
      created_at TEXT NOT NULL,
      expires_at TEXT,
      last_assessment_at TEXT,
      last_assessment_id TEXT
    )
  `).run();
  await env.DB.prepare(`CREATE INDEX IF NOT EXISTS idx_entitlements_email ON entitlements(email)`).run();
  await env.DB.prepare(`CREATE INDEX IF NOT EXISTS idx_entitlements_stripe ON entitlements(stripe_session_id)`).run();
  try { await env.DB.prepare("ALTER TABLE entitlements ADD COLUMN last_idempotency_key TEXT DEFAULT NULL").run(); } catch { /* column exists */ }
}

export async function handleEntitlementCreate(body, env, corsHeaders) {
  const email = sanitizeEmail(body.email);
  const plan_key = sanitizeString(body.plan_key, 50);
  const stripe_session_id = sanitizeString(body.stripe_session_id, 200);
  if (!email || !plan_key) {
    return new Response(JSON.stringify({ error: "Missing email or plan_key" }), {
      status: 400, headers: corsHeaders,
    });
  }

  const config = PLAN_CONFIGS[plan_key];
  if (!config) {
    return new Response(JSON.stringify({ error: "Unknown plan_key" }), {
      status: 400, headers: corsHeaders,
    });
  }

  // Duplicate detection: same stripe_session_id
  if (stripe_session_id) {
    const existing = await env.DB.prepare(
      "SELECT * FROM entitlements WHERE stripe_session_id = ?"
    ).bind(stripe_session_id).first();
    if (existing) {
      return new Response(JSON.stringify({ success: true, entitlement: existing, duplicate: true }), { headers: corsHeaders });
    }
  }

  // Duplicate detection: same email + plan_key within 24h
  const cutoff24h = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
  const recent = await env.DB.prepare(
    "SELECT * FROM entitlements WHERE email = ? AND plan_key = ? AND created_at > ? ORDER BY created_at DESC LIMIT 1"
  ).bind(email, plan_key, cutoff24h).first();
  if (recent) {
    return new Response(JSON.stringify({ success: true, entitlement: recent, duplicate: true }), { headers: corsHeaders });
  }

  const now = new Date();
  const id = "ent_" + crypto.randomUUID().slice(0, 12);
  const expires_at = config.expires_months
    ? new Date(now.getTime() + config.expires_months * 30 * 24 * 60 * 60 * 1000).toISOString()
    : null;

  await env.DB.prepare(
    `INSERT INTO entitlements (id, email, plan_key, assessments_allowed, assessments_used, model_version, status, stripe_session_id, created_at, expires_at)
     VALUES (?, ?, ?, ?, 0, ?, 'active', ?, ?, ?)`
  ).bind(
    id,
    email,
    plan_key,
    config.assessments_allowed,
    sanitizeString(body.model_version, 20) || "RP-2.0",
    stripe_session_id || null,
    now.toISOString(),
    expires_at,
  ).run();

  const created = await env.DB.prepare("SELECT * FROM entitlements WHERE id = ?").bind(id).first();
  return new Response(JSON.stringify({ success: true, entitlement: created }), { headers: corsHeaders });
}

export async function handleEntitlementCheck(body, env, corsHeaders) {
  const email = (body.email || "").toLowerCase().trim();
  const plan_key = body.plan_key || "";
  if (!email || !plan_key) {
    return new Response(JSON.stringify({ error: "Missing email or plan_key" }), {
      status: 400, headers: corsHeaders,
    });
  }

  // Find active entitlement for this email + plan_key
  let ent = await env.DB.prepare(
    "SELECT * FROM entitlements WHERE email = ? AND plan_key = ? AND status = 'active' ORDER BY created_at DESC LIMIT 1"
  ).bind(email, plan_key).first();

  // If no active entitlement, check if an exhausted/expired one exists (don't auto-create if so)
  if (!ent) {
    const anyEnt = await env.DB.prepare(
      "SELECT * FROM entitlements WHERE email = ? AND plan_key = ? ORDER BY created_at DESC LIMIT 1"
    ).bind(email, plan_key).first();
    if (anyEnt) {
      return new Response(JSON.stringify({
        allowed: false, remaining: 0, plan_key, entitlement_id: anyEnt.id,
        reason: anyEnt.status === "expired" ? "expired" : "exhausted",
      }), { headers: corsHeaders });
    }
  }

  // Free plan auto-create: only if NO entitlement exists at all for this email + plan_key
  if (!ent && plan_key === "free") {
    const config = PLAN_CONFIGS.free;
    const now = new Date();
    const id = "ent_" + crypto.randomUUID().slice(0, 12);
    await env.DB.prepare(
      `INSERT INTO entitlements (id, email, plan_key, assessments_allowed, assessments_used, model_version, status, created_at)
       VALUES (?, ?, 'free', ?, 0, 'RP-2.0', 'active', ?)`
    ).bind(id, email, config.assessments_allowed, now.toISOString()).run();
    ent = await env.DB.prepare("SELECT * FROM entitlements WHERE id = ?").bind(id).first();
  }

  if (!ent) {
    return new Response(JSON.stringify({ allowed: false, reason: "no_entitlement", plan_key }), { headers: corsHeaders });
  }

  // Check expiry for annual plans
  if (ent.expires_at && new Date(ent.expires_at) < new Date()) {
    await env.DB.prepare("UPDATE entitlements SET status = 'expired' WHERE id = ?").bind(ent.id).run();
    return new Response(JSON.stringify({ allowed: false, reason: "expired", plan_key, entitlement_id: ent.id }), { headers: corsHeaders });
  }

  // Model version upgrade: if not on RP-2.0, grant +1 bonus and update
  if (ent.model_version !== "RP-2.0") {
    await env.DB.prepare(
      "UPDATE entitlements SET model_version = 'RP-2.0', assessments_allowed = assessments_allowed + 1 WHERE id = ?"
    ).bind(ent.id).run();
    ent = await env.DB.prepare("SELECT * FROM entitlements WHERE id = ?").bind(ent.id).first();
  }

  const remaining = ent.assessments_allowed - ent.assessments_used;

  if (remaining > 0) {
    return new Response(JSON.stringify({
      allowed: true, remaining, plan_key, entitlement_id: ent.id,
    }), { headers: corsHeaders });
  }

  // Single assessment retake: exhausted but within 30 days of purchase and has a last_assessment_id
  if (ent.assessments_used >= ent.assessments_allowed && ent.last_assessment_id) {
    const daysSincePurchase = (Date.now() - new Date(ent.created_at).getTime()) / (1000 * 60 * 60 * 24);
    if (daysSincePurchase <= 30) {
      return new Response(JSON.stringify({
        allowed: true, remaining: 0, plan_key, entitlement_id: ent.id, retake: true,
        reason: "retake_allowed",
      }), { headers: corsHeaders });
    }
  }

  return new Response(JSON.stringify({
    allowed: false, remaining: 0, plan_key, entitlement_id: ent.id, reason: "exhausted",
  }), { headers: corsHeaders });
}

export async function handleEntitlementUse(body, env, corsHeaders) {
  const entitlement_id = sanitizeString(body.entitlement_id, 100);
  const assessment_id = sanitizeString(body.assessment_id, 100);
  const idempotency_key = sanitizeString(body.idempotency_key, 200) || null;
  if (!entitlement_id || !assessment_id) {
    return new Response(JSON.stringify({ error: "Missing entitlement_id or assessment_id" }), {
      status: 400, headers: corsHeaders,
    });
  }

  const ent = await env.DB.prepare("SELECT * FROM entitlements WHERE id = ?").bind(entitlement_id).first();
  if (!ent) {
    return new Response(JSON.stringify({ error: "Entitlement not found" }), {
      status: 404, headers: corsHeaders,
    });
  }

  // Idempotency: if this assessment_id already recorded, skip decrement
  if (ent.last_assessment_id === assessment_id) {
    const remaining = ent.assessments_allowed - ent.assessments_used;
    return new Response(JSON.stringify({ success: true, remaining, status: ent.status, idempotent: true }), { headers: corsHeaders });
  }

  // Idempotency: if idempotency_key matches last_idempotency_key, skip
  if (idempotency_key && ent.last_idempotency_key === idempotency_key) {
    const remaining = ent.assessments_allowed - ent.assessments_used;
    return new Response(JSON.stringify({ success: true, remaining, status: ent.status, idempotent: true }), { headers: corsHeaders });
  }

  const now = new Date().toISOString();

  if (body.retake) {
    // Retake: don't increment, just update last_assessment fields
    await env.DB.prepare(
      "UPDATE entitlements SET last_assessment_at = ?, last_assessment_id = ?, last_idempotency_key = ? WHERE id = ?"
    ).bind(now, assessment_id, idempotency_key, entitlement_id).run();
    const remaining = ent.assessments_allowed - ent.assessments_used;
    return new Response(JSON.stringify({ success: true, remaining, status: ent.status }), { headers: corsHeaders });
  }

  // Normal use: increment assessments_used
  const newUsed = ent.assessments_used + 1;
  const newStatus = newUsed >= ent.assessments_allowed ? "exhausted" : "active";
  await env.DB.prepare(
    "UPDATE entitlements SET assessments_used = ?, status = ?, last_assessment_at = ?, last_assessment_id = ?, last_idempotency_key = ? WHERE id = ?"
  ).bind(newUsed, newStatus, now, assessment_id, idempotency_key, entitlement_id).run();

  const remaining = ent.assessments_allowed - newUsed;
  return new Response(JSON.stringify({ success: true, remaining, status: newStatus }), { headers: corsHeaders });
}

export async function handleEntitlementLookup(body, env, corsHeaders) {
  const email = (body.email || "").toLowerCase().trim();
  if (!email) {
    return new Response(JSON.stringify({ error: "Missing email" }), {
      status: 400, headers: corsHeaders,
    });
  }

  const rows = await env.DB.prepare(
    "SELECT * FROM entitlements WHERE email = ? ORDER BY created_at DESC"
  ).bind(email).all();

  return new Response(JSON.stringify({ success: true, entitlements: rows?.results || [] }), { headers: corsHeaders });
}
