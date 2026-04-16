// RunPayway™ — Cloudflare Worker Entry Point
// All logic lives in worker/lib/ modules. This file is the router only.

import { handlePressureMap, handlePlainEnglish, handleActionPlan, handlePersonalize } from "./lib/ai-handlers.js";
import { handleSimulate, handleSimulateBatch, handleTimeline, handleActionScripts, handlePresets } from "./lib/simulation-handlers.js";
import { handleSaveRecord, handleGetRecord, handleStats, ensureErrorReportsTable, handleErrorReport, handleGetErrorReports } from "./lib/records.js";
import { handleEntitlementCreate, handleEntitlementCheck, handleEntitlementUse, handleEntitlementLookup, ensureEntitlementsTable } from "./lib/entitlements.js";
import { handleSendEmail, handleContact, handleNurture, handleFollowUpCron, processNurtureQueue, ensureNurtureTable } from "./lib/emails.js";
import { handleAdvisorCreate, handleAdvisorValidate, handleAdvisorUsage, handleAdvisorMeter, handleAdvisorSaveRecord, handleAdvisorGetRecord, ensureAdvisorTables } from "./lib/advisor.js";

// ══════════════════════════════════════════════════════════
// RATE LIMITING — in-memory per-isolate
// ══════════════════════════════════════════════════════════

const RATE_LIMITS = {
  default:     { maxRequests: 60, windowMs: 60000 },
  scoring:     { maxRequests: 10, windowMs: 60000 },
  entitlement: { maxRequests: 20, windowMs: 60000 },
  advisor:     { maxRequests: 20, windowMs: 60000 },
};

const rateLimitMap = new Map();
let rateLimitRequestCount = 0;

function isRateLimited(ip, category = "default") {
  const key = `${ip}:${category}`;
  const now = Date.now();
  const limits = RATE_LIMITS[category] || RATE_LIMITS.default;
  const entry = rateLimitMap.get(key);

  if (!entry || now > entry.resetAt) {
    rateLimitMap.set(key, { count: 1, resetAt: now + limits.windowMs });
    return false;
  }
  entry.count++;
  return entry.count > limits.maxRequests;
}

function cleanupRateLimits() {
  const now = Date.now();
  for (const [key, entry] of rateLimitMap) {
    if (now > entry.resetAt) rateLimitMap.delete(key);
  }
}

function getRateLimitCategory(path) {
  if (["/pressuremap", "/plain-english", "/action-plan", "/personalize", "/"].includes(path)) return "scoring";
  if (path.startsWith("/entitlement/")) return "entitlement";
  if (path.startsWith("/advisor/")) return "advisor";
  return "default";
}

// ══════════════════════════════════════════════════════════
// TABLE INITIALIZATION — run once per isolate
// ══════════════════════════════════════════════════════════

let tablesInitialized = false;

async function ensureAllTables(env) {
  if (tablesInitialized) return;
  await Promise.all([
    ensureEntitlementsTable(env),
    ensureErrorReportsTable(env),
    ensureNurtureTable(env),
    ensureAdvisorTables(env),
  ]);
  tablesInitialized = true;
}

// ══════════════════════════════════════════════════════════
// STRUCTURED LOGGING
// ══════════════════════════════════════════════════════════

function logRequest(request, path, status, durationMs, extra = {}) {
  const ip = request.headers.get("cf-connecting-ip") || "unknown";
  console.log(JSON.stringify({
    ts: new Date().toISOString(),
    method: request.method,
    path,
    status,
    duration_ms: durationMs,
    ip: ip.length > 3 ? ip.slice(0, -3) + "xxx" : "xxx",
    ...extra,
  }));
}

// ══════════════════════════════════════════════════════════
// CORS — locked to peoplestar.com (+ localhost in dev)
// ══════════════════════════════════════════════════════════

const ALLOWED_ORIGINS = ["https://peoplestar.com", "https://www.peoplestar.com"];

function getCorsOrigin(request) {
  const origin = request.headers.get("origin") || "";
  if (ALLOWED_ORIGINS.includes(origin)) return origin;
  if (origin.includes("localhost")) return origin;
  return ALLOWED_ORIGINS[0];
}

// ══════════════════════════════════════════════════════════
// ANALYTICS (inline — trivial handler)
// ══════════════════════════════════════════════════════════

function handleAnalytics(body, corsHeaders) {
  return new Response(JSON.stringify({ ok: true }), { headers: corsHeaders });
}

// ══════════════════════════════════════════════════════════
// MAIN WORKER
// ══════════════════════════════════════════════════════════

export default {
  // ── Cron trigger: send follow-up emails + nurture sequence ──
  async scheduled(event, env, ctx) {
    ctx.waitUntil(handleFollowUpCron(env));
    ctx.waitUntil(processNurtureQueue(env));
  },

  async fetch(request, env) {
    const startTime = Date.now();
    const url = new URL(request.url);
    const path = url.pathname.replace(/\/$/, "") || "/pressuremap";
    const corsOrigin = getCorsOrigin(request);

    // CORS preflight
    if (request.method === "OPTIONS") {
      return new Response(null, {
        headers: {
          "Access-Control-Allow-Origin": corsOrigin,
          "Access-Control-Allow-Methods": "POST, GET, OPTIONS",
          "Access-Control-Allow-Headers": "Content-Type, Authorization",
          "Access-Control-Max-Age": "86400",
        },
      });
    }

    const corsHeaders = {
      "Access-Control-Allow-Origin": corsOrigin,
      "Content-Type": "application/json",
    };

    // ── Rate limiting ──
    const clientIp = request.headers.get("cf-connecting-ip")
      || (request.headers.get("x-forwarded-for") || "").split(",")[0]
      || "unknown";
    const rlCategory = getRateLimitCategory(path);

    if (isRateLimited(clientIp, rlCategory)) {
      const resp = new Response(JSON.stringify({ error: "Rate limit exceeded", retry_after: 60 }), {
        status: 429, headers: corsHeaders,
      });
      logRequest(request, path, 429, Date.now() - startTime, { rate_limited: true, category: rlCategory });
      return resp;
    }

    // Periodic cleanup
    rateLimitRequestCount++;
    if (rateLimitRequestCount % 100 === 0) cleanupRateLimits();

    // ── Ensure tables once per isolate ──
    await ensureAllTables(env);

    let response;

    // GET endpoints
    if (request.method === "GET") {
      if (path === "/stats") response = await handleStats(env, corsHeaders);
      else if (path === "/presets") response = handlePresets(url, corsHeaders);
      else if (path === "/error-reports") response = await handleGetErrorReports(env, corsHeaders);
      else {
        // GET /action-scripts/:sector
        const actionScriptsMatch = path.match(/^\/action-scripts\/(.+)$/);
        if (actionScriptsMatch) response = handleActionScripts(decodeURIComponent(actionScriptsMatch[1]), request, corsHeaders);
        else response = new Response("Not found", { status: 404 });
      }

      logRequest(request, path, response.status, Date.now() - startTime);
      return response;
    }

    if (request.method !== "POST") {
      response = new Response("Method not allowed", { status: 405 });
      logRequest(request, path, 405, Date.now() - startTime);
      return response;
    }

    try {
      const body = await request.json();

      if (path === "/pressuremap" || path === "/") response = await handlePressureMap(body, env, corsHeaders);
      else if (path === "/plain-english") response = await handlePlainEnglish(body, env, corsHeaders);
      else if (path === "/action-plan") response = await handleActionPlan(body, env, corsHeaders);
      else if (path === "/save-record") response = await handleSaveRecord(body, env, corsHeaders);
      else if (path === "/get-record") response = await handleGetRecord(body, env, corsHeaders);
      else if (path === "/entitlement/create") response = await handleEntitlementCreate(body, env, corsHeaders);
      else if (path === "/entitlement/check") response = await handleEntitlementCheck(body, env, corsHeaders);
      else if (path === "/entitlement/use") response = await handleEntitlementUse(body, env, corsHeaders);
      else if (path === "/entitlement/lookup") response = await handleEntitlementLookup(body, env, corsHeaders);
      else if (path === "/send-email") response = await handleSendEmail(body, env, corsHeaders);
      else if (path === "/contact") response = await handleContact(body, env, corsHeaders);
      else if (path === "/nurture") response = await handleNurture(body, env, corsHeaders);
      else if (path === "/simulate") response = await handleSimulate(body, corsHeaders);
      else if (path === "/simulate-batch") response = await handleSimulateBatch(body, corsHeaders);
      else if (path === "/timeline") response = await handleTimeline(body, corsHeaders);
      else if (path === "/analytics") response = handleAnalytics(body, corsHeaders);
      else if (path === "/personalize") response = await handlePersonalize(body, env, corsHeaders);
      else if (path === "/error-report") response = await handleErrorReport(body, env, corsHeaders);
      else if (path === "/advisor/create") response = await handleAdvisorCreate(body, env, corsHeaders);
      else if (path === "/advisor/validate") response = await handleAdvisorValidate(body, env, corsHeaders);
      else if (path === "/advisor/usage") response = await handleAdvisorUsage(body, env, corsHeaders);
      else if (path === "/advisor/meter") response = await handleAdvisorMeter(body, env, corsHeaders);
      else if (path === "/advisor/save-record") response = await handleAdvisorSaveRecord(body, env, corsHeaders);
      else if (path === "/advisor/get-record") response = await handleAdvisorGetRecord(body, env, corsHeaders);
      else {
        response = new Response(JSON.stringify({ error: "Unknown endpoint" }), {
          status: 404, headers: corsHeaders,
        });
      }

      logRequest(request, path, response.status, Date.now() - startTime);
      return response;
    } catch (err) {
      response = new Response(JSON.stringify({ error: "Worker error", detail: String(err) }), {
        status: 500, headers: corsHeaders,
      });
      logRequest(request, path, 500, Date.now() - startTime, { error: String(err) });
      return response;
    }
  },
};
