"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";

/* ================================================================== */
/* UTILITIES                                                           */
/* ================================================================== */

function useInView(threshold = 0) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    if (rect.top < window.innerHeight + 50 && rect.bottom > 0) { setVisible(true); return; }
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setVisible(true); obs.disconnect(); } }, { threshold });
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);
  return { ref, visible };
}

function useMobile(bp = 768) {
  const [m, setM] = useState(false);
  useEffect(() => { const c = () => setM(window.innerWidth <= bp); c(); window.addEventListener("resize", c); return () => window.removeEventListener("resize", c); }, [bp]);
  return m;
}

function useReducedMotion() {
  const [r, setR] = useState(false);
  useEffect(() => { setR(window.matchMedia("(prefers-reduced-motion: reduce)").matches); }, []);
  return r;
}

function useFadeIn() {
  const reduced = useReducedMotion();
  return (visible: boolean, delay = 0): React.CSSProperties =>
    reduced ? {} : { opacity: visible ? 1 : 0, transform: visible ? "translateY(0)" : "translateY(10px)", transition: `opacity 500ms ease-out ${delay}ms, transform 500ms ease-out ${delay}ms` };
}

/* ================================================================== */
/* DESIGN SYSTEM                                                       */
/* ================================================================== */

const C = { navy: "#0E1A2B", purple: "#4B3FAE", teal: "#1F6D7A", sand: "#F4F1EA", white: "#FFFFFF", border: "#E5E7EB" };
const mono = '"SF Mono", "Fira Code", "IBM Plex Mono", "Courier New", monospace';
const muted = "rgba(14,26,43,0.68)";
const light = "rgba(14,26,43,0.50)";
const contentW = 1040;
const px = (m: boolean) => m ? 24 : 24;

/* ================================================================== */
/* CODE BLOCK COMPONENT                                                */
/* ================================================================== */

function CodeBlock({ code, language, copyable = true }: { code: string; language?: string; copyable?: boolean }) {
  const [copied, setCopied] = useState(false);
  const m = useMobile();

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch { /* silent */ }
  };

  return (
    <div style={{ position: "relative", borderRadius: 14, border: "1px solid rgba(14,26,43,0.12)", overflow: "hidden", marginBottom: 0 }}>
      {language && (
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "10px 16px", backgroundColor: "#131A2B", borderBottom: "1px solid rgba(244,241,234,0.06)" }}>
          <span style={{ fontSize: 12, fontWeight: 600, fontFamily: mono, color: "rgba(244,241,234,0.40)", textTransform: "uppercase", letterSpacing: "0.06em" }}>{language}</span>
          {copyable && (
            <button
              onClick={handleCopy}
              style={{ background: "none", border: "1px solid rgba(244,241,234,0.12)", borderRadius: 6, padding: "4px 10px", cursor: "pointer", fontSize: 12, fontFamily: mono, color: copied ? C.teal : "rgba(244,241,234,0.50)", transition: "color 200ms, border-color 200ms" }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = "rgba(244,241,234,0.25)"; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = "rgba(244,241,234,0.12)"; }}
            >
              {copied ? "Copied" : "Copy"}
            </button>
          )}
        </div>
      )}
      <pre style={{ margin: 0, padding: m ? 16 : 20, backgroundColor: C.navy, overflowX: "auto", WebkitOverflowScrolling: "touch" }}>
        <code style={{ fontFamily: mono, fontSize: m ? 13 : 14, lineHeight: 1.65, color: C.sand, whiteSpace: "pre", display: "block" }}>
          {code}
        </code>
      </pre>
      {!language && copyable && (
        <button
          onClick={handleCopy}
          style={{ position: "absolute", top: 12, right: 12, background: "rgba(14,26,43,0.6)", border: "1px solid rgba(244,241,234,0.12)", borderRadius: 6, padding: "4px 10px", cursor: "pointer", fontSize: 12, fontFamily: mono, color: copied ? C.teal : "rgba(244,241,234,0.50)", transition: "color 200ms, background 200ms" }}
        >
          {copied ? "Copied" : "Copy"}
        </button>
      )}
    </div>
  );
}

/* ================================================================== */
/* PARAM TABLE COMPONENT                                               */
/* ================================================================== */

function ParamTable({ params }: { params: { name: string; type: string; required: boolean; description: string }[] }) {
  const m = useMobile();
  return (
    <div style={{ overflowX: "auto", borderRadius: 10, border: "1px solid rgba(14,26,43,0.08)" }}>
      <table style={{ width: "100%", borderCollapse: "collapse", fontSize: m ? 13 : 14 }}>
        <thead>
          <tr style={{ backgroundColor: "#FAFAF8" }}>
            <th style={{ textAlign: "left", padding: "10px 14px", fontWeight: 600, color: C.navy, borderBottom: "1px solid rgba(14,26,43,0.08)", whiteSpace: "nowrap" }}>Parameter</th>
            <th style={{ textAlign: "left", padding: "10px 14px", fontWeight: 600, color: C.navy, borderBottom: "1px solid rgba(14,26,43,0.08)", whiteSpace: "nowrap" }}>Type</th>
            <th style={{ textAlign: "center", padding: "10px 14px", fontWeight: 600, color: C.navy, borderBottom: "1px solid rgba(14,26,43,0.08)", whiteSpace: "nowrap" }}>Required</th>
            <th style={{ textAlign: "left", padding: "10px 14px", fontWeight: 600, color: C.navy, borderBottom: "1px solid rgba(14,26,43,0.08)" }}>Description</th>
          </tr>
        </thead>
        <tbody>
          {params.map((p, i) => (
            <tr key={i} style={{ borderBottom: i < params.length - 1 ? "1px solid rgba(14,26,43,0.05)" : "none" }}>
              <td style={{ padding: "10px 14px", fontFamily: mono, fontSize: 13, color: C.purple, whiteSpace: "nowrap" }}>{p.name}</td>
              <td style={{ padding: "10px 14px", fontFamily: mono, fontSize: 13, color: muted, whiteSpace: "nowrap" }}>{p.type}</td>
              <td style={{ padding: "10px 14px", textAlign: "center", color: p.required ? C.teal : light }}>{p.required ? "Yes" : "No"}</td>
              <td style={{ padding: "10px 14px", color: muted, lineHeight: 1.5 }}>{p.description}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

/* ================================================================== */
/* SDK TABS COMPONENT                                                  */
/* ================================================================== */

function SdkTabs({ tabs }: { tabs: { label: string; language: string; code: string }[] }) {
  const [active, setActive] = useState(0);
  const m = useMobile();
  return (
    <div>
      <div style={{ display: "flex", gap: 0, borderBottom: "1px solid rgba(14,26,43,0.08)", marginBottom: 0 }}>
        {tabs.map((t, i) => (
          <button
            key={t.label}
            onClick={() => setActive(i)}
            style={{
              padding: m ? "10px 16px" : "12px 20px",
              fontSize: 14,
              fontWeight: active === i ? 600 : 500,
              color: active === i ? C.purple : muted,
              background: "none",
              border: "none",
              borderBottom: active === i ? `2px solid ${C.purple}` : "2px solid transparent",
              cursor: "pointer",
              transition: "color 200ms, border-color 200ms",
              fontFamily: mono,
            }}
          >
            {t.label}
          </button>
        ))}
      </div>
      <CodeBlock code={tabs[active].code} language={tabs[active].language} />
    </div>
  );
}

/* ================================================================== */
/* SECTION 1 -- HERO                                                   */
/* ================================================================== */

function HeroSection() {
  const { ref, visible } = useInView();
  const m = useMobile();
  const fadeIn = useFadeIn();
  return (
    <header ref={ref} style={{ backgroundColor: C.sand, paddingTop: m ? 104 : 152, paddingBottom: m ? 56 : 88, paddingLeft: px(m), paddingRight: px(m) }}>
      <div style={{ maxWidth: 720, margin: "0 auto", textAlign: "center" }}>
        <div style={{ fontSize: 12, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase" as const, color: C.teal, marginBottom: 16, ...fadeIn(visible) }}>DEVELOPERS</div>
        <h1 style={{ fontSize: m ? 30 : 64, fontWeight: 700, lineHeight: 1.1, letterSpacing: "-0.035em", color: C.navy, marginBottom: 16, ...fadeIn(visible, 50) }}>
          RunPayway API
        </h1>
        <p style={{ fontSize: m ? 20 : 28, fontWeight: 400, lineHeight: 1.4, color: C.teal, marginBottom: 24, ...fadeIn(visible, 80) }}>
          Integrate structural income measurement into your platform.
        </p>
        <p style={{ fontSize: m ? 16 : 18, color: muted, lineHeight: 1.6, maxWidth: 580, margin: "0 auto 24px", ...fadeIn(visible, 120) }}>
          Deterministic scoring. Version-locked output. Enterprise-ready.
        </p>
        <div style={{ display: "flex", flexWrap: "wrap" as const, justifyContent: "center", gap: m ? 12 : 24, ...fadeIn(visible, 160) }}>
          {["Model RP-2.0", "JSON responses", "HMAC integrity"].map((item, i) => (
            <span key={i} style={{ fontSize: 14, fontWeight: 600, color: "rgba(14,26,43,0.55)" }}>{item}</span>
          ))}
        </div>
      </div>
    </header>
  );
}

/* ================================================================== */
/* SECTION 2 -- OVERVIEW                                               */
/* ================================================================== */

function OverviewSection() {
  const { ref, visible } = useInView();
  const m = useMobile();
  const fadeIn = useFadeIn();

  const items = [
    { label: "Base URL", value: "https://peoplestar.com/RunPayway/api" },
    { label: "Authentication", value: "API key via x-api-key header or Authorization: Bearer <key>" },
    { label: "Response format", value: "JSON" },
    { label: "Versioning", value: "v1 (stable, v2 engine with v1 output adapter) and v2 (latest, full output)" },
    { label: "Rate limiting", value: "10 requests/minute per IP on scoring endpoints" },
    { label: "Model version", value: "RP-2.0 (immutable, version-locked)" },
  ];

  return (
    <section ref={ref} style={{ backgroundColor: C.white, paddingTop: m ? 60 : 104, paddingBottom: m ? 60 : 104, paddingLeft: px(m), paddingRight: px(m) }}>
      <div style={{ maxWidth: contentW, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: m ? 40 : 64, ...fadeIn(visible) }}>
          <h2 style={{ fontSize: m ? 28 : 40, fontWeight: 600, lineHeight: 1.08, letterSpacing: "-0.028em", color: C.navy, marginBottom: 12 }}>Overview</h2>
          <p style={{ fontSize: m ? 16 : 18, color: muted, lineHeight: 1.6 }}>
            The RunPayway API provides programmatic access to the Income Stability Score&#8482; engine.
          </p>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: m ? "1fr" : "1fr 1fr", gap: 16, marginBottom: m ? 32 : 48, ...fadeIn(visible, 100) }}>
          {items.map((item, i) => (
            <div key={i} style={{ padding: "16px 20px", borderRadius: 10, backgroundColor: "#FAFAF8", border: "1px solid rgba(14,26,43,0.06)" }}>
              <div style={{ fontSize: 12, fontWeight: 700, letterSpacing: "0.06em", color: C.teal, marginBottom: 6, textTransform: "uppercase" as const }}>{item.label}</div>
              <div style={{ fontSize: 14, color: C.navy, fontWeight: 500, lineHeight: 1.5, fontFamily: item.label === "Base URL" ? mono : "inherit", wordBreak: "break-all" as const }}>{item.value}</div>
            </div>
          ))}
        </div>

        <div style={{ ...fadeIn(visible, 150) }}>
          <div style={{ fontSize: 15, color: muted, lineHeight: 1.7, maxWidth: 720, margin: "0 auto" }}>
            <p style={{ margin: "0 0 12px" }}>
              All scoring endpoints accept a JSON body and return a complete assessment record. The v2 endpoint returns the full <span style={{ fontFamily: mono, fontSize: 13, color: C.purple }}>AssessmentRecord</span> object including scores, bands, constraint hierarchy, fragility analysis, sensitivity tests, risk scenarios, benchmarks, and an integrity manifest. The v1 endpoint wraps the same engine but adapts the output to the v1 response schema.
            </p>
            <p style={{ margin: 0 }}>
              Authentication is required on all endpoints except <span style={{ fontFamily: mono, fontSize: 13, color: C.purple }}>/api/verify-public</span> and <span style={{ fontFamily: mono, fontSize: 13, color: C.purple }}>/api/health</span>. Payment token authentication is also accepted on scoring endpoints for consumer checkout flows.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ================================================================== */
/* SECTION 3 -- ENDPOINTS                                              */
/* ================================================================== */

function EndpointsSection() {
  const { ref, visible } = useInView();
  const m = useMobile();
  const fadeIn = useFadeIn();

  return (
    <section ref={ref} style={{ backgroundColor: "#F5F4F1", paddingTop: m ? 60 : 104, paddingBottom: m ? 60 : 104, paddingLeft: px(m), paddingRight: px(m) }}>
      <div style={{ maxWidth: contentW, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: m ? 48 : 72, ...fadeIn(visible) }}>
          <h2 style={{ fontSize: m ? 28 : 40, fontWeight: 600, lineHeight: 1.08, letterSpacing: "-0.028em", color: C.navy, marginBottom: 12 }}>Endpoints</h2>
          <p style={{ fontSize: m ? 16 : 18, color: muted, lineHeight: 1.6 }}>
            Complete reference for all public-facing API routes.
          </p>
        </div>

        {/* POST /api/v2/score */}
        <div style={{ marginBottom: m ? 56 : 80, ...fadeIn(visible, 50) }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
            <span style={{ display: "inline-block", padding: "4px 10px", borderRadius: 6, backgroundColor: `${C.teal}15`, fontFamily: mono, fontSize: 12, fontWeight: 700, color: C.teal }}>POST</span>
            <span style={{ fontFamily: mono, fontSize: m ? 15 : 17, fontWeight: 600, color: C.navy }}>/api/v2/score</span>
          </div>
          <p style={{ fontSize: 15, color: muted, lineHeight: 1.65, marginBottom: 20, maxWidth: 720 }}>
            Execute a full structural income assessment using the RP-2.0 deterministic engine. Returns the complete <span style={{ fontFamily: mono, fontSize: 13, color: C.purple }}>AssessmentRecord</span> including scores, band classification, constraint hierarchy, fragility analysis, sensitivity tests, risk scenarios, score lift projections, benchmarks, explainability narratives, and an HMAC integrity manifest.
          </p>

          <div style={{ fontSize: 13, fontWeight: 600, color: C.navy, marginBottom: 10 }}>Request body</div>
          <ParamTable params={[
            { name: "raw_inputs", type: "object", required: true, description: "Six diagnostic answers (q1\u2013q6). Each key maps to an answer choice A\u2013E." },
            { name: "raw_inputs.q1_recurring_revenue_base", type: '"A"|"B"|"C"|"D"|"E"', required: true, description: "Recurring revenue base proportion" },
            { name: "raw_inputs.q2_income_concentration", type: '"A"|"B"|"C"|"D"|"E"', required: true, description: "Income source concentration level" },
            { name: "raw_inputs.q3_income_source_diversity", type: '"A"|"B"|"C"|"D"|"E"', required: true, description: "Number of independent income sources" },
            { name: "raw_inputs.q4_forward_revenue_visibility", type: '"A"|"B"|"C"|"D"|"E"', required: true, description: "Months of forward revenue visibility" },
            { name: "raw_inputs.q5_earnings_variability", type: '"A"|"B"|"C"|"D"|"E"', required: true, description: "Month-to-month earnings variability" },
            { name: "raw_inputs.q6_income_continuity_without_labor", type: '"A"|"B"|"C"|"D"|"E"', required: true, description: "Income continuity without active labor" },
            { name: "profile", type: "object", required: true, description: "Structural profile context for the assessment subject" },
            { name: "profile.profile_class", type: "string", required: true, description: '"individual" | "business_owner" | "hybrid"' },
            { name: "profile.operating_structure", type: "string", required: true, description: 'e.g. "solo_service", "small_agency", "retained_advisor"' },
            { name: "profile.primary_income_model", type: "string", required: true, description: 'e.g. "commission", "retainer", "project_fee", "subscription"' },
            { name: "profile.revenue_structure", type: "string", required: true, description: 'e.g. "active_heavy", "hybrid", "recurring_heavy"' },
            { name: "profile.industry_sector", type: "string", required: true, description: 'e.g. "real_estate", "technology", "consulting_professional_services"' },
            { name: "profile.maturity_stage", type: "string", required: true, description: '"early" | "developing" | "established"' },
            { name: "extended_inputs", type: "object", required: false, description: "Optional quality-enrichment inputs for higher diagnostic confidence" },
          ]} />

          <div style={{ fontSize: 13, fontWeight: 600, color: C.navy, marginBottom: 10, marginTop: 24 }}>Example request</div>
          <CodeBlock language="json" code={`{
  "raw_inputs": {
    "q1_recurring_revenue_base": "C",
    "q2_income_concentration": "B",
    "q3_income_source_diversity": "C",
    "q4_forward_revenue_visibility": "B",
    "q5_earnings_variability": "C",
    "q6_income_continuity_without_labor": "D"
  },
  "profile": {
    "profile_class": "individual",
    "operating_structure": "solo_service",
    "primary_income_model": "retainer",
    "revenue_structure": "active_heavy",
    "industry_sector": "consulting_professional_services",
    "maturity_stage": "established"
  }
}`} />

          <div style={{ fontSize: 13, fontWeight: 600, color: C.navy, marginBottom: 10, marginTop: 24 }}>Example response (abbreviated)</div>
          <CodeBlock language="json" code={`{
  "assessment_id": "a1b2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c5d",
  "created_at": "2026-04-08T14:32:00.000Z",
  "model_manifest": {
    "model_version": "RP-2.0",
    "factor_version": "F-2.0",
    "scenario_version": "S-2.0",
    "benchmark_version": "B-2.0",
    "explanation_version": "E-2.0"
  },
  "scores": {
    "overall_score": 54,
    "structure_score": 28,
    "stability_score": 18,
    "continuity_score": 8,
    "concentration_resilience_score": 12,
    "forward_security_score": 10,
    "labor_dependence_score": 4,
    "quality_adjustment": -2,
    "fragility_score": 15
  },
  "bands": {
    "primary_band": "Established Stability",
    "sub_band": "Lower Established",
    "warning_overlays": []
  },
  "constraints": {
    "root_constraint": "high_labor_dependence",
    "primary_constraint": "high_labor_dependence",
    "secondary_constraint": "weak_forward_visibility",
    "dependent_constraint": null,
    "hidden_unlock": "low_persistence"
  },
  "benchmarks": {
    "peer_percentile": 62,
    "cluster_average_score": 48,
    "top_20_threshold": 71,
    "peer_band_distribution": {
      "limited": 18,
      "developing": 34,
      "established": 36,
      "high": 12
    },
    "outlier_dimensions": [],
    "benchmark_methodology": "structural_model",
    "benchmark_note": "Baselines derived from structural income modeling across sector archetypes. Versioned B-2.0."
  },
  "integrity": {
    "input_hash": "sha256:a1b2c3...",
    "output_hash": "sha256:d4e5f6...",
    "manifest_hash": "sha256:789abc...",
    "record_hash": "sha256:def012..."
  }
}`} />

          <div style={{ fontSize: 13, fontWeight: 600, color: C.navy, marginBottom: 10, marginTop: 24 }}>Key response fields</div>
          <ParamTable params={[
            { name: "assessment_id", type: "string (UUID)", required: true, description: "Unique identifier for this assessment record" },
            { name: "model_manifest", type: "object", required: true, description: "Locked model, factor, scenario, benchmark, and explanation versions" },
            { name: "scores.overall_score", type: "number (0\u2013100)", required: true, description: "The Income Stability Score" },
            { name: "bands.primary_band", type: "string", required: true, description: '"Limited Stability" | "Developing Stability" | "Established Stability" | "High Stability"' },
            { name: "constraints", type: "object", required: true, description: "Root, primary, secondary, and dependent constraint hierarchy" },
            { name: "fragility", type: "object", required: true, description: "Fragility score, class, deductions, and failure modes" },
            { name: "sensitivity", type: "object", required: true, description: "Per-factor sensitivity tests with lift projections" },
            { name: "scenarios", type: "array", required: true, description: "Risk scenario simulations with score drops and band shifts" },
            { name: "benchmarks", type: "object | null", required: true, description: "Peer percentile, cluster average, and band distribution" },
            { name: "benchmarks.benchmark_methodology", type: '"structural_model"', required: true, description: "Always structural_model. Baselines are modeled, not sampled." },
            { name: "benchmarks.benchmark_note", type: "string", required: true, description: "Transparency disclosure on baseline derivation methodology" },
            { name: "integrity", type: "object", required: true, description: "HMAC-SHA256 hashes for input, output, manifest, and full record" },
          ]} />
        </div>

        {/* POST /api/v1/score */}
        <div style={{ marginBottom: m ? 56 : 80, ...fadeIn(visible, 100) }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
            <span style={{ display: "inline-block", padding: "4px 10px", borderRadius: 6, backgroundColor: `${C.teal}15`, fontFamily: mono, fontSize: 12, fontWeight: 700, color: C.teal }}>POST</span>
            <span style={{ fontFamily: mono, fontSize: m ? 15 : 17, fontWeight: 600, color: C.navy }}>/api/v1/score</span>
          </div>
          <p style={{ fontSize: 15, color: muted, lineHeight: 1.65, marginBottom: 20, maxWidth: 720 }}>
            V1-compatible scoring endpoint. Uses the same RP-2.0 engine internally but adapts the response to the v1 output schema. Accepts the legacy <span style={{ fontFamily: mono, fontSize: 13, color: C.purple }}>inputs</span> and <span style={{ fontFamily: mono, fontSize: 13, color: C.purple }}>profile</span> format. Suitable for integrations built against the original API contract.
          </p>
          <ParamTable params={[
            { name: "inputs", type: "object", required: true, description: "V1 input format (six questions mapped to answer values)" },
            { name: "profile", type: "object", required: true, description: "V1 profile context (same fields, different key format)" },
            { name: "_payment_token", type: "string", required: false, description: "Signed payment token (alternative to API key auth)" },
            { name: "_payment_payload", type: "object", required: false, description: "Payment token payload for verification" },
          ]} />
        </div>

        {/* POST /api/verify */}
        <div style={{ marginBottom: m ? 56 : 80, ...fadeIn(visible, 100) }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
            <span style={{ display: "inline-block", padding: "4px 10px", borderRadius: 6, backgroundColor: `${C.teal}15`, fontFamily: mono, fontSize: 12, fontWeight: 700, color: C.teal }}>POST</span>
            <span style={{ fontFamily: mono, fontSize: m ? 15 : 17, fontWeight: 600, color: C.navy }}>/api/verify</span>
          </div>
          <p style={{ fontSize: 15, color: muted, lineHeight: 1.65, marginBottom: 20, maxWidth: 720 }}>
            Verify the authenticity of an issued assessment record. Requires API key authentication. Returns the record metadata and a verification statement if the record ID and authorization code match.
          </p>
          <ParamTable params={[
            { name: "record_id", type: "string (UUID)", required: true, description: "The assessment record identifier" },
            { name: "authorization_code", type: "string (hex, 16\u201364 chars)", required: true, description: "The authorization code issued with the assessment" },
          ]} />

          <div style={{ fontSize: 13, fontWeight: 600, color: C.navy, marginBottom: 10, marginTop: 24 }}>Example response</div>
          <CodeBlock language="json" code={`{
  "valid_record": true,
  "record_id": "a1b2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c5d",
  "model_version": "RP-2.0",
  "final_score": 54,
  "stability_band": "Established Stability",
  "assessment_date": "2026-04-08T14:32:00.000Z",
  "issued_timestamp": "2026-04-08T14:32:00.000Z",
  "verified_at": "2026-04-08T15:01:12.000Z",
  "verification_statement": "This record matches a RunPayway\u2122-issued Income Stability Assessment."
}`} />
        </div>

        {/* POST /api/verify-public */}
        <div style={{ marginBottom: m ? 56 : 80, ...fadeIn(visible, 100) }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
            <span style={{ display: "inline-block", padding: "4px 10px", borderRadius: 6, backgroundColor: `${C.teal}15`, fontFamily: mono, fontSize: 12, fontWeight: 700, color: C.teal }}>POST</span>
            <span style={{ fontFamily: mono, fontSize: m ? 15 : 17, fontWeight: 600, color: C.navy }}>/api/verify-public</span>
            <span style={{ fontSize: 11, fontWeight: 600, padding: "3px 8px", borderRadius: 5, backgroundColor: "rgba(31,109,122,0.08)", color: C.teal }}>No auth required</span>
          </div>
          <p style={{ fontSize: 15, color: muted, lineHeight: 1.65, marginBottom: 20, maxWidth: 720 }}>
            Public verification endpoint. Identical to <span style={{ fontFamily: mono, fontSize: 13, color: C.purple }}>/api/verify</span> but does not require API key authentication. Designed for third-party verification workflows where the verifier holds only a record ID and authorization code.
          </p>
          <ParamTable params={[
            { name: "record_id", type: "string (UUID)", required: true, description: "The assessment record identifier" },
            { name: "authorization_code", type: "string (hex, 16\u201364 chars)", required: true, description: "The authorization code issued with the assessment" },
          ]} />
        </div>

        {/* GET /api/v1/snapshot/:id */}
        <div style={{ marginBottom: m ? 56 : 80, ...fadeIn(visible, 100) }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
            <span style={{ display: "inline-block", padding: "4px 10px", borderRadius: 6, backgroundColor: `${C.purple}15`, fontFamily: mono, fontSize: 12, fontWeight: 700, color: C.purple }}>GET</span>
            <span style={{ fontFamily: mono, fontSize: m ? 15 : 17, fontWeight: 600, color: C.navy }}>/api/v1/snapshot/:id</span>
          </div>
          <p style={{ fontSize: 15, color: muted, lineHeight: 1.65, marginBottom: 20, maxWidth: 720 }}>
            Retrieve a previously issued assessment record by its record ID. Returns the full record including profile, inputs, scoring, interpretation, drivers, structural priority, and ruleset checksum. Requires API key authentication.
          </p>
          <ParamTable params={[
            { name: "id", type: "string (UUID)", required: true, description: "Path parameter. The assessment record identifier." },
          ]} />

          <div style={{ fontSize: 13, fontWeight: 600, color: C.navy, marginBottom: 10, marginTop: 24 }}>Example response (abbreviated)</div>
          <CodeBlock language="json" code={`{
  "record_id": "a1b2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c5d",
  "authorization_code": "a1b2c3d4e5f6a7b8",
  "model_version": "RP-2.0",
  "assessment_date_utc": "2026-04-08T14:32:00.000Z",
  "final_score": 54,
  "stability_band": "Established Stability",
  "classification": "individual",
  "operating_structure": "solo_service",
  "primary_income_model": "retainer",
  "industry_sector": "consulting_professional_services",
  "primary_constraint_key": "high_labor_dependence",
  "primary_constraint_label": "High Labor Dependence",
  "driver_1_key": "income_persistence",
  "driver_1_label": "Income Persistence",
  "structural_priority_key": "reduce_labor_dependence",
  "structural_priority_label": "Reduce Labor Dependence",
  "ruleset_checksum": "sha256:abc123..."
}`} />
        </div>

        {/* POST /api/v1/send-report */}
        <div style={{ marginBottom: m ? 56 : 80, ...fadeIn(visible, 100) }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
            <span style={{ display: "inline-block", padding: "4px 10px", borderRadius: 6, backgroundColor: `${C.teal}15`, fontFamily: mono, fontSize: 12, fontWeight: 700, color: C.teal }}>POST</span>
            <span style={{ fontFamily: mono, fontSize: m ? 15 : 17, fontWeight: 600, color: C.navy }}>/api/v1/send-report</span>
          </div>
          <p style={{ fontSize: 15, color: muted, lineHeight: 1.65, marginBottom: 20, maxWidth: 720 }}>
            Deliver an assessment report to a specified email address via Resend. Requires the assessment record fields for report rendering. No API key required (designed for post-checkout delivery).
          </p>
          <ParamTable params={[
            { name: "recipientEmail", type: "string", required: true, description: "Delivery email address" },
            { name: "finalScore", type: "number", required: true, description: "The overall Income Stability Score" },
            { name: "stabilityBand", type: "string", required: true, description: "Band classification label" },
            { name: "recordId", type: "string", required: true, description: "Assessment record ID" },
            { name: "modelVersion", type: "string", required: false, description: 'Model version string. Defaults to "RP-2.0".' },
            { name: "issuedTimestamp", type: "string", required: false, description: "ISO 8601 timestamp of assessment creation" },
            { name: "industrySector", type: "string", required: false, description: "Industry sector for report context" },
            { name: "primaryConstraintLabel", type: "string", required: false, description: "Primary structural constraint label" },
            { name: "peerPercentileLabel", type: "string", required: false, description: "Peer percentile label for benchmarking context" },
            { name: "planKey", type: "string", required: false, description: '"single_assessment" or "annual_monitoring"' },
          ]} />

          <div style={{ fontSize: 13, fontWeight: 600, color: C.navy, marginBottom: 10, marginTop: 24 }}>Example response</div>
          <CodeBlock language="json" code={`{
  "success": true,
  "message": "Report sent successfully",
  "emailId": "re_abc123..."
}`} />
        </div>

        {/* POST /api/v1/data-export */}
        <div style={{ marginBottom: m ? 56 : 80, ...fadeIn(visible, 100) }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
            <span style={{ display: "inline-block", padding: "4px 10px", borderRadius: 6, backgroundColor: `${C.teal}15`, fontFamily: mono, fontSize: 12, fontWeight: 700, color: C.teal }}>POST</span>
            <span style={{ fontFamily: mono, fontSize: m ? 15 : 17, fontWeight: 600, color: C.navy }}>/api/v1/data-export</span>
          </div>
          <p style={{ fontSize: 15, color: muted, lineHeight: 1.65, marginBottom: 20, maxWidth: 720 }}>
            GDPR Article 15 data portability endpoint. Returns the full assessment record as downloadable JSON. Requires API key authentication and valid authorization code.
          </p>
          <ParamTable params={[
            { name: "record_id", type: "string (UUID)", required: true, description: "Assessment record identifier" },
            { name: "authorization_code", type: "string (hex, 64 chars)", required: true, description: "Full authorization code (64-character hex string)" },
          ]} />
        </div>

        {/* GET /api/health */}
        <div style={{ ...fadeIn(visible, 100) }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
            <span style={{ display: "inline-block", padding: "4px 10px", borderRadius: 6, backgroundColor: `${C.purple}15`, fontFamily: mono, fontSize: 12, fontWeight: 700, color: C.purple }}>GET</span>
            <span style={{ fontFamily: mono, fontSize: m ? 15 : 17, fontWeight: 600, color: C.navy }}>/api/health</span>
            <span style={{ fontSize: 11, fontWeight: 600, padding: "3px 8px", borderRadius: 5, backgroundColor: "rgba(31,109,122,0.08)", color: C.teal }}>No auth required</span>
          </div>
          <p style={{ fontSize: 15, color: muted, lineHeight: 1.65, marginBottom: 20, maxWidth: 720 }}>
            Health check endpoint for uptime monitoring. Returns the current model version and server timestamp.
          </p>
          <CodeBlock language="json" code={`{
  "status": "ok",
  "model": "RP-2.0",
  "timestamp": "2026-04-08T14:32:00.000Z"
}`} />
        </div>
      </div>
    </section>
  );
}

/* ================================================================== */
/* SECTION 4 -- AUTHENTICATION                                         */
/* ================================================================== */

function AuthenticationSection() {
  const { ref, visible } = useInView();
  const m = useMobile();
  const fadeIn = useFadeIn();

  return (
    <section ref={ref} style={{ backgroundColor: C.white, paddingTop: m ? 60 : 104, paddingBottom: m ? 60 : 104, paddingLeft: px(m), paddingRight: px(m) }}>
      <div style={{ maxWidth: contentW, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: m ? 40 : 64, ...fadeIn(visible) }}>
          <h2 style={{ fontSize: m ? 28 : 40, fontWeight: 600, lineHeight: 1.08, letterSpacing: "-0.028em", color: C.navy, marginBottom: 12 }}>Authentication</h2>
          <p style={{ fontSize: m ? 16 : 18, color: muted, lineHeight: 1.6 }}>
            API key authentication for all protected endpoints.
          </p>
        </div>

        <div style={{ display: m ? "block" : "grid", gridTemplateColumns: "1fr 1fr", gap: 20, marginBottom: m ? 32 : 48, ...fadeIn(visible, 100) }}>
          <div style={{ padding: m ? 24 : 28, borderRadius: 14, backgroundColor: "#FAFAF8", border: "1px solid rgba(14,26,43,0.06)", marginBottom: m ? 16 : 0 }}>
            <div style={{ fontSize: 12, fontWeight: 700, letterSpacing: "0.08em", color: C.teal, marginBottom: 16 }}>OBTAINING AN API KEY</div>
            <div style={{ display: "flex", flexDirection: "column" as const, gap: 14 }}>
              {[
                "Contact our team at api-access@peoplestar.com or via the contact form with subject \"API Access\".",
                "After review and agreement execution, you will receive a unique API key.",
                "Keys are scoped to your organization and are non-transferable.",
                "API keys are rotated on request. Revocation is immediate.",
              ].map((item, i) => (
                <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 10 }}>
                  <span style={{ fontSize: 13, fontWeight: 700, fontFamily: mono, color: C.teal, flexShrink: 0, marginTop: 1 }}>{i + 1}.</span>
                  <span style={{ fontSize: 14, color: muted, lineHeight: 1.55 }}>{item}</span>
                </div>
              ))}
            </div>
          </div>

          <div style={{ padding: m ? 24 : 28, borderRadius: 14, backgroundColor: "#FAFAF8", border: "1px solid rgba(14,26,43,0.06)" }}>
            <div style={{ fontSize: 12, fontWeight: 700, letterSpacing: "0.08em", color: C.teal, marginBottom: 16 }}>HEADER FORMAT</div>
            <p style={{ fontSize: 14, color: muted, lineHeight: 1.55, marginBottom: 16 }}>
              Include your API key in one of two headers. The server checks <span style={{ fontFamily: mono, fontSize: 13, color: C.purple }}>x-api-key</span> first, then falls back to <span style={{ fontFamily: mono, fontSize: 13, color: C.purple }}>Authorization: Bearer</span>.
            </p>
            <CodeBlock language="http" code={`x-api-key: rp_live_abc123def456

# or

Authorization: Bearer rp_live_abc123def456`} />
          </div>
        </div>

        <div style={{ ...fadeIn(visible, 150) }}>
          <div style={{ fontSize: 13, fontWeight: 600, color: C.navy, marginBottom: 10 }}>Authentication error responses</div>
          <div style={{ overflowX: "auto", borderRadius: 10, border: "1px solid rgba(14,26,43,0.08)" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 14 }}>
              <thead>
                <tr style={{ backgroundColor: "#FAFAF8" }}>
                  <th style={{ textAlign: "left", padding: "10px 14px", fontWeight: 600, color: C.navy, borderBottom: "1px solid rgba(14,26,43,0.08)" }}>Status</th>
                  <th style={{ textAlign: "left", padding: "10px 14px", fontWeight: 600, color: C.navy, borderBottom: "1px solid rgba(14,26,43,0.08)" }}>Body</th>
                  <th style={{ textAlign: "left", padding: "10px 14px", fontWeight: 600, color: C.navy, borderBottom: "1px solid rgba(14,26,43,0.08)" }}>Cause</th>
                </tr>
              </thead>
              <tbody>
                <tr style={{ borderBottom: "1px solid rgba(14,26,43,0.05)" }}>
                  <td style={{ padding: "10px 14px", fontFamily: mono, fontSize: 13, color: "#9B2C2C" }}>401</td>
                  <td style={{ padding: "10px 14px", fontFamily: mono, fontSize: 13, color: muted }}>{`{"error": "Unauthorized"}`}</td>
                  <td style={{ padding: "10px 14px", color: muted }}>Missing or invalid API key</td>
                </tr>
                <tr>
                  <td style={{ padding: "10px 14px", fontFamily: mono, fontSize: 13, color: "#9B2C2C" }}>429</td>
                  <td style={{ padding: "10px 14px", fontFamily: mono, fontSize: 13, color: muted }}>{`{"error": "Rate limit exceeded..."}`}</td>
                  <td style={{ padding: "10px 14px", color: muted }}>Exceeded 10 requests/minute on scoring endpoints</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ================================================================== */
/* SECTION 5 -- SDK EXAMPLES                                           */
/* ================================================================== */

function SdkSection() {
  const { ref, visible } = useInView();
  const m = useMobile();
  const fadeIn = useFadeIn();

  const curlCode = `curl -X POST https://peoplestar.com/RunPayway/api/v2/score \\
  -H "Content-Type: application/json" \\
  -H "x-api-key: rp_live_YOUR_KEY" \\
  -d '{
    "raw_inputs": {
      "q1_recurring_revenue_base": "C",
      "q2_income_concentration": "B",
      "q3_income_source_diversity": "C",
      "q4_forward_revenue_visibility": "B",
      "q5_earnings_variability": "C",
      "q6_income_continuity_without_labor": "D"
    },
    "profile": {
      "profile_class": "individual",
      "operating_structure": "solo_service",
      "primary_income_model": "retainer",
      "revenue_structure": "active_heavy",
      "industry_sector": "consulting_professional_services",
      "maturity_stage": "established"
    }
  }'`;

  const nodeCode = `const response = await fetch(
  "https://peoplestar.com/RunPayway/api/v2/score",
  {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": process.env.RUNPAYWAY_API_KEY,
    },
    body: JSON.stringify({
      raw_inputs: {
        q1_recurring_revenue_base: "C",
        q2_income_concentration: "B",
        q3_income_source_diversity: "C",
        q4_forward_revenue_visibility: "B",
        q5_earnings_variability: "C",
        q6_income_continuity_without_labor: "D",
      },
      profile: {
        profile_class: "individual",
        operating_structure: "solo_service",
        primary_income_model: "retainer",
        revenue_structure: "active_heavy",
        industry_sector: "consulting_professional_services",
        maturity_stage: "established",
      },
    }),
  }
);

const assessment = await response.json();

console.log(assessment.scores.overall_score);
// => 54

console.log(assessment.bands.primary_band);
// => "Established Stability"

console.log(assessment.benchmarks.benchmark_methodology);
// => "structural_model"`;

  const pythonCode = `import requests
import os

response = requests.post(
    "https://peoplestar.com/RunPayway/api/v2/score",
    headers={
        "Content-Type": "application/json",
        "x-api-key": os.environ["RUNPAYWAY_API_KEY"],
    },
    json={
        "raw_inputs": {
            "q1_recurring_revenue_base": "C",
            "q2_income_concentration": "B",
            "q3_income_source_diversity": "C",
            "q4_forward_revenue_visibility": "B",
            "q5_earnings_variability": "C",
            "q6_income_continuity_without_labor": "D",
        },
        "profile": {
            "profile_class": "individual",
            "operating_structure": "solo_service",
            "primary_income_model": "retainer",
            "revenue_structure": "active_heavy",
            "industry_sector": "consulting_professional_services",
            "maturity_stage": "established",
        },
    },
)

assessment = response.json()

print(assessment["scores"]["overall_score"])
# => 54

print(assessment["bands"]["primary_band"])
# => "Established Stability"

print(assessment["benchmarks"]["benchmark_methodology"])
# => "structural_model"`;

  return (
    <section ref={ref} style={{ backgroundColor: "#F5F4F1", paddingTop: m ? 60 : 104, paddingBottom: m ? 60 : 104, paddingLeft: px(m), paddingRight: px(m) }}>
      <div style={{ maxWidth: contentW, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: m ? 40 : 64, ...fadeIn(visible) }}>
          <h2 style={{ fontSize: m ? 28 : 40, fontWeight: 600, lineHeight: 1.08, letterSpacing: "-0.028em", color: C.navy, marginBottom: 12 }}>SDK Examples</h2>
          <p style={{ fontSize: m ? 16 : 18, color: muted, lineHeight: 1.6 }}>
            Complete request and response cycle in your language of choice.
          </p>
        </div>

        <div style={{ ...fadeIn(visible, 100) }}>
          <SdkTabs tabs={[
            { label: "cURL", language: "bash", code: curlCode },
            { label: "Node.js", language: "javascript", code: nodeCode },
            { label: "Python", language: "python", code: pythonCode },
          ]} />
        </div>
      </div>
    </section>
  );
}

/* ================================================================== */
/* SECTION 6 -- ERROR CODES                                            */
/* ================================================================== */

function ErrorCodesSection() {
  const { ref, visible } = useInView();
  const m = useMobile();
  const fadeIn = useFadeIn();

  const errors = [
    { code: "200", label: "OK", description: "Request succeeded. Response body contains the requested data." },
    { code: "400", label: "Bad Request", description: "Invalid or missing parameters. Check required fields and value formats." },
    { code: "401", label: "Unauthorized", description: "Missing, invalid, or expired API key or payment token." },
    { code: "404", label: "Not Found", description: "Record not found or authorization code does not match." },
    { code: "429", label: "Too Many Requests", description: "Rate limit exceeded. Scoring endpoints: 10 requests/minute per IP." },
    { code: "500", label: "Internal Server Error", description: "Unexpected server error. Contact support if persistent." },
    { code: "503", label: "Service Unavailable", description: "Downstream service (email, storage) temporarily unavailable." },
  ];

  return (
    <section ref={ref} style={{ backgroundColor: C.white, paddingTop: m ? 60 : 104, paddingBottom: m ? 60 : 104, paddingLeft: px(m), paddingRight: px(m) }}>
      <div style={{ maxWidth: contentW, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: m ? 40 : 64, ...fadeIn(visible) }}>
          <h2 style={{ fontSize: m ? 28 : 40, fontWeight: 600, lineHeight: 1.08, letterSpacing: "-0.028em", color: C.navy, marginBottom: 12 }}>Error Codes</h2>
          <p style={{ fontSize: m ? 16 : 18, color: muted, lineHeight: 1.6 }}>
            Standard HTTP status codes. All error responses include a JSON body.
          </p>
        </div>

        <div style={{ ...fadeIn(visible, 100) }}>
          <div style={{ overflowX: "auto", borderRadius: 10, border: "1px solid rgba(14,26,43,0.08)", marginBottom: 24 }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 14 }}>
              <thead>
                <tr style={{ backgroundColor: "#FAFAF8" }}>
                  <th style={{ textAlign: "left", padding: "10px 14px", fontWeight: 600, color: C.navy, borderBottom: "1px solid rgba(14,26,43,0.08)", whiteSpace: "nowrap" }}>Status</th>
                  <th style={{ textAlign: "left", padding: "10px 14px", fontWeight: 600, color: C.navy, borderBottom: "1px solid rgba(14,26,43,0.08)", whiteSpace: "nowrap" }}>Label</th>
                  <th style={{ textAlign: "left", padding: "10px 14px", fontWeight: 600, color: C.navy, borderBottom: "1px solid rgba(14,26,43,0.08)" }}>Description</th>
                </tr>
              </thead>
              <tbody>
                {errors.map((e, i) => (
                  <tr key={i} style={{ borderBottom: i < errors.length - 1 ? "1px solid rgba(14,26,43,0.05)" : "none" }}>
                    <td style={{ padding: "10px 14px", fontFamily: mono, fontSize: 13, fontWeight: 600, color: e.code.startsWith("2") ? C.teal : e.code.startsWith("4") ? "#92640A" : "#9B2C2C" }}>{e.code}</td>
                    <td style={{ padding: "10px 14px", fontWeight: 600, color: C.navy, whiteSpace: "nowrap" }}>{e.label}</td>
                    <td style={{ padding: "10px 14px", color: muted, lineHeight: 1.5 }}>{e.description}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div style={{ fontSize: 13, fontWeight: 600, color: C.navy, marginBottom: 10 }}>Error response format</div>
          <CodeBlock language="json" code={`{
  "error": "Human-readable error message"
}`} />
        </div>
      </div>
    </section>
  );
}

/* ================================================================== */
/* SECTION 7 -- CTA                                                    */
/* ================================================================== */

function CtaSection() {
  const { ref, visible } = useInView();
  const m = useMobile();
  const fadeIn = useFadeIn();
  return (
    <section ref={ref} style={{ backgroundColor: C.navy, paddingTop: m ? 60 : 104, paddingBottom: m ? 64 : 112, paddingLeft: px(m), paddingRight: px(m), borderTop: "1px solid rgba(244,241,234,0.04)" }}>
      <div style={{ maxWidth: 640, margin: "0 auto", textAlign: "center" }}>
        <p style={{ fontSize: m ? 18 : 22, fontWeight: 600, color: C.sand, lineHeight: 1.35, marginBottom: 8, ...fadeIn(visible) }}>
          Deterministic. Version-locked. Auditable.
        </p>
        <h2 style={{ fontSize: m ? 28 : 40, fontWeight: 600, lineHeight: 1.08, letterSpacing: "-0.028em", color: C.sand, marginBottom: 32, ...fadeIn(visible, 40) }}>
          Ready to integrate?
        </h2>
        <div style={{ ...fadeIn(visible, 120) }}>
          <Link href="/contact?subject=API%20Access" style={{
            display: "inline-flex", alignItems: "center", justifyContent: "center",
            height: m ? 56 : 60, padding: m ? "0 28px" : "0 32px", width: m ? "100%" : "auto",
            borderRadius: 16,
            backgroundColor: C.white, color: C.navy,
            fontSize: 16, fontWeight: 600, textDecoration: "none",
            boxShadow: "0 8px 24px rgba(14,26,43,0.08)",
            border: `1px solid rgba(244,241,234,0.45)`,
            transition: "transform 200ms, box-shadow 200ms",
          }}
            onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = "0 12px 32px rgba(244,241,234,0.15)"; }}
            onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "0 8px 24px rgba(14,26,43,0.08)"; }}>
            Request API Access
          </Link>
          <p style={{ fontSize: 14, fontWeight: 500, color: "rgba(244,241,234,0.45)", marginTop: 16 }}>
            Enterprise licensing | SLA-backed uptime | Dedicated support
          </p>
        </div>
      </div>
    </section>
  );
}

/* ================================================================== */
/* PAGE EXPORT                                                         */
/* ================================================================== */

export default function DevelopersPage() {
  return (
    <div className="overflow-x-hidden">
      <main>
        <HeroSection />
        <OverviewSection />
        <EndpointsSection />
        <AuthenticationSection />
        <SdkSection />
        <ErrorCodesSection />
        <CtaSection />
      </main>
    </div>
  );
}
