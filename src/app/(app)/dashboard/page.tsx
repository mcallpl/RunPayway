"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { simulateScore, SIMULATOR_PRESETS, projectTimeline } from "@/lib/engine/v2/simulate";
import type { CanonicalInput } from "@/lib/engine/v2/types";
import SuiteHeader from "@/components/SuiteHeader";
import SuiteCTA from "@/components/SuiteCTA";
import AnimatedNumber from "@/components/AnimatedNumber";
import { SAMPLE_PROFILES, IS_SAMPLE } from "@/lib/sample-data";

/* ------------------------------------------------------------------ */
/*  Brand tokens                                                       */
/* ------------------------------------------------------------------ */
const B = {
  navy: "#0E1A2B",
  purple: "#4B3FAE",
  teal: "#1F6D7A",
  white: "#FFFFFF",
  stone: "rgba(14,26,43,0.08)",
  taupe: "rgba(14,26,43,0.36)",
  muted: "rgba(14,26,43,0.52)",
  red: "#C53030",
  amber: "#B7791F",
  bandLimited: "#9B2C2C",
  bandDeveloping: "#92640A",
  bandEstablished: "#2B5EA7",
  bandHigh: "#1F6D7A",
};

interface AssessmentSummary {
  record_id: string;
  final_score: number;
  stability_band: string;
  assessment_date_utc: string;
  issued_timestamp_utc?: string;
}

function bandColor(s: number): string {
  return s >= 75 ? B.bandHigh : s >= 50 ? B.bandEstablished : s >= 30 ? B.bandDeveloping : B.bandLimited;
}

function formatDate(d: string): string {
  try { return new Date(d).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }); } catch { return d; }
}

/* ------------------------------------------------------------------ */
/*  Main page                                                          */
/* ------------------------------------------------------------------ */
export default function DashboardPage() {
  const router = useRouter();
  const [record, setRecord] = useState<Record<string, unknown> | null>(null);
  const [assessments, setAssessments] = useState<AssessmentSummary[]>([]);
  const [mobile, setMobile] = useState(false);
  const [planType, setPlanType] = useState<"single" | "monitoring">("single");
  const [assessmentsUsed, setAssessmentsUsed] = useState(1);
  const [assessmentsTotal, setAssessmentsTotal] = useState(1);
  const [demoProfile, setDemoProfile] = useState(1);
  const [accessCode, setAccessCode] = useState("");
  const [codeError, setCodeError] = useState<string | null>(null);

  useEffect(() => {
    const check = () => setMobile(window.innerWidth <= 640);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  useEffect(() => {
    // Load current record
    let stored = sessionStorage.getItem("rp_record");
    if (!stored) stored = localStorage.getItem("rp_record");
    if (stored) { try { setRecord(JSON.parse(stored)); } catch { /* */ } }

    // Load history
    try {
      const records = JSON.parse(localStorage.getItem("rp_records") || "[]") as AssessmentSummary[];
      setAssessments(records.sort((a, b) => new Date(b.assessment_date_utc || b.issued_timestamp_utc || "").getTime() - new Date(a.assessment_date_utc || a.issued_timestamp_utc || "").getTime()));
    } catch { /* */ }

    // Detect plan type
    try {
      const purchaseRaw = sessionStorage.getItem("rp_purchase_session");
      if (purchaseRaw) {
        const ps = JSON.parse(purchaseRaw);
        if (ps.plan_key === "annual_monitoring") {
          setPlanType("monitoring");
          setAssessmentsTotal(ps.assessments_total || 3);
          setAssessmentsUsed(ps.assessments_used || 1);
        }
      }
    } catch { /* */ }
  }, []);

  // ── Use real data or sample ──
  const isDemo = IS_SAMPLE(record);
  const r = isDemo ? SAMPLE_PROFILES[demoProfile].record : record!;

  const score = (r?.final_score as number) || 0;
  const band = (r?.stability_band as string) || "";
  const v2 = r?._v2 as Record<string, unknown> | undefined;
  const ni = v2?.normalized_inputs as Record<string, number | string> | undefined;
  const hasData = score > 0;

  const activeIncome = (r?.active_income_level as number) || 0;
  const semiIncome = (r?.semi_persistent_income_level as number) || 0;
  const persistentIncome = (r?.persistent_income_level as number) || 0;
  const issuedDate = (r?.issued_timestamp_utc as string) || (r?.assessment_date_utc as string) || "";
  const daysSince = issuedDate ? Math.floor((Date.now() - new Date(issuedDate).getTime()) / (1000 * 60 * 60 * 24)) : 0;
  const continuityMonths = (r?.income_continuity_months as number) || 0;
  const riskDrop = (r?.risk_scenario_drop as number) || 0;

  // ── Inputs for simulation ──
  const baseInputs: CanonicalInput = ni ? {
    income_persistence_pct: ni.income_persistence_pct as number,
    largest_source_pct: ni.largest_source_pct as number,
    source_diversity_count: ni.source_diversity_count as number,
    forward_secured_pct: ni.forward_secured_pct as number,
    income_variability_level: (ni.income_variability_level || "moderate") as CanonicalInput["income_variability_level"],
    labor_dependence_pct: ni.labor_dependence_pct as number,
  } : { income_persistence_pct: 25, largest_source_pct: 60, source_diversity_count: 2, forward_secured_pct: 15, income_variability_level: "moderate" as const, labor_dependence_pct: 70 };

  const qualityScore = ((v2?.quality as Record<string, number>)?.quality_score) ?? 5;

  // ── Top 3 scenario quick-launches ──
  const scenarios = SIMULATOR_PRESETS
    .filter(p => !["lose_top_client", "cant_work_90_days"].includes(p.id))
    .map(p => {
      const result = simulateScore(p.modify(baseInputs), qualityScore);
      return { ...p, lift: result.overall_score - (hasData ? score : result.overall_score), projected: result.overall_score };
    })
    .filter(p => p.lift > 0)
    .sort((a, b) => b.lift - a.lift)
    .slice(0, 3);

  // ── Timeline projection ──
  const bestPreset = SIMULATOR_PRESETS.find(p => p.id === scenarios[0]?.id);
  const timeline = bestPreset ? projectTimeline(baseInputs, bestPreset.modify(baseInputs), qualityScore) : [];

  // ── Goal ──
  const nextThreshold = score < 30 ? 30 : score < 50 ? 50 : score < 75 ? 75 : 100;
  const nextBandLabel = score < 30 ? "Developing" : score < 50 ? "Established" : score < 75 ? "High" : "Maximum";
  const gap = nextThreshold - score;
  const progress = Math.min(100, (score / nextThreshold) * 100);

  // ── Reassessment readiness ──
  const reassessChecks = [
    { label: "Signed a new retainer or recurring agreement", key: "retainer" },
    { label: "Added a new independent income source", key: "source" },
    { label: "Reduced your largest client below 40% of income", key: "concentration" },
    { label: "Created a passive or semi-passive income stream", key: "passive" },
  ];
  const [checkedItems, setCheckedItems] = useState<string[]>([]);
  useEffect(() => {
    try { setCheckedItems(JSON.parse(localStorage.getItem("rp_reassess_checks") || "[]")); } catch { /* */ }
  }, []);
  const toggleCheck = (key: string) => {
    setCheckedItems(prev => {
      const updated = prev.includes(key) ? prev.filter(k => k !== key) : [...prev, key];
      localStorage.setItem("rp_reassess_checks", JSON.stringify(updated));
      return updated;
    });
  };

  // ── Access code handler (for customers landing directly on Dashboard) ──
  const handleCodeSubmit = () => {
    setCodeError(null);
    const trimmed = accessCode.trim();
    if (!trimmed) { setCodeError("Paste your Access Code."); return; }
    try {
      const decoded = JSON.parse(atob(trimmed));
      if (typeof decoded.p !== "number" || typeof decoded.c !== "number" || typeof decoded.l !== "number") { setCodeError("Invalid code."); return; }
      const newRecord = { record_id: `sim-${Date.now()}`, authorization_code: "", model_version: "RP-2.0", assessment_date_utc: new Date().toISOString(), issued_timestamp_utc: new Date().toISOString(), final_score: 0, stability_band: "", assessment_title: decoded.n || "", classification: "", operating_structure: "", primary_income_model: decoded.m || "", industry_sector: decoded.i || "", _v2: { normalized_inputs: { income_persistence_pct: decoded.p, largest_source_pct: decoded.c, source_diversity_count: decoded.s, forward_secured_pct: decoded.f, income_variability_level: decoded.v || "moderate", labor_dependence_pct: decoded.l }, quality: { quality_score: decoded.q || 5 } } };
      sessionStorage.setItem("rp_record", JSON.stringify(newRecord));
      sessionStorage.setItem("rp_sim_code", trimmed);
      window.location.reload();
    } catch { setCodeError("Invalid code. Copy the full code from your report."); }
  };

  // ── Countdown message ──
  const countdownMsg = daysSince === 0 ? "Your action plan is fresh. Start today."
    : daysSince <= 7 ? `${daysSince} days since your assessment. Your plan is still new.`
    : daysSince <= 30 ? `${daysSince} days. Have you made a structural change yet?`
    : daysSince <= 60 ? `${daysSince} days at the same score. Time to take action.`
    : daysSince <= 90 ? `${daysSince} days. Your competitors are moving. Are you?`
    : `${daysSince} days since your last assessment. It is time to reassess.`;

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#FAFAFA", fontFamily: "'Inter', system-ui, sans-serif" }}>
      <SuiteHeader current="dashboard" />

      <div style={{ maxWidth: 760, margin: "0 auto", padding: mobile ? "28px 16px 60px" : "48px 28px 80px" }}>

        {/* ── Header ── */}
        <div style={{ marginBottom: 36 }}>
          <div style={{ fontSize: 10, fontWeight: 600, letterSpacing: "0.14em", color: B.taupe, textTransform: "uppercase" as const, marginBottom: 8 }}>RUNPAYWAY&#8482; DASHBOARD</div>
          <h1 style={{ fontSize: mobile ? 24 : 32, fontWeight: 300, color: B.navy, letterSpacing: "-0.03em", lineHeight: 1.15, marginBottom: 0 }}>Your Financial Command Center</h1>

          {/* Demo band selector */}
          {isDemo && (
            <div style={{ display: "flex", gap: 8, marginTop: 16, flexWrap: "wrap" as const }}>
              {SAMPLE_PROFILES.map((p, i) => (
                <button key={p.id} onClick={() => setDemoProfile(i)}
                  style={{
                    padding: "6px 14px", borderRadius: 6, fontSize: 12, fontWeight: demoProfile === i ? 600 : 400,
                    color: demoProfile === i ? "#FFFFFF" : B.muted,
                    backgroundColor: demoProfile === i ? (p.id === "limited" ? B.red : p.id === "developing" ? B.amber : p.id === "established" ? B.bandEstablished : B.teal) : "transparent",
                    border: `1px solid ${demoProfile === i ? "transparent" : B.stone}`,
                    cursor: "pointer", transition: "all 200ms",
                  }}
                >{p.bandShort}</button>
              ))}
            </div>
          )}
        </div>

        {/* Sample banner with inline code input */}
        {isDemo && (
          <div style={{ padding: "16px 20px", borderRadius: 8, backgroundColor: `${B.purple}05`, border: `1px solid ${B.purple}12`, marginBottom: 24 }}>
            <div style={{ display: "flex", flexDirection: mobile ? "column" : "row", gap: 12, alignItems: mobile ? "stretch" : "center" }}>
              <div style={{ flex: 1 }}>
                <span style={{ fontSize: 11, fontWeight: 600, color: B.purple, letterSpacing: "0.08em" }}>SAMPLE DATA</span>
                <p style={{ fontSize: 12, color: B.muted, margin: "4px 0 0" }}>Enter your access code to load your real numbers.</p>
              </div>
              <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                <input
                  value={accessCode}
                  onChange={(e) => { setAccessCode(e.target.value); setCodeError(null); }}
                  placeholder="Paste access code"
                  style={{ padding: "8px 12px", fontSize: 11, fontFamily: "monospace", border: `1px solid ${B.stone}`, borderRadius: 6, outline: "none", width: mobile ? "100%" : 200, boxSizing: "border-box" as const }}
                  onKeyDown={(e) => { if (e.key === "Enter") handleCodeSubmit(); }}
                />
                <button onClick={handleCodeSubmit} style={{ padding: "8px 16px", fontSize: 12, fontWeight: 600, color: B.white, backgroundColor: B.purple, border: "none", borderRadius: 6, cursor: "pointer", whiteSpace: "nowrap" as const }}>Load</button>
              </div>
            </div>
            {codeError && <div style={{ fontSize: 11, color: B.red, marginTop: 6 }}>{codeError}</div>}
          </div>
        )}

        {/* ══════════ #1 PRIORITY — single focus ══════════ */}
        {hasData && scenarios.length > 0 && (
          <div style={{ padding: mobile ? "20px 16px" : "24px 28px", border: `1px solid ${B.stone}`, borderLeft: `3px solid ${B.purple}`, borderRadius: 10, marginBottom: 24 }}>
            <div style={{ fontSize: 9, fontWeight: 600, letterSpacing: "0.14em", color: B.purple, textTransform: "uppercase" as const, marginBottom: 8 }}>YOUR #1 PRIORITY RIGHT NOW</div>
            <div style={{ fontSize: mobile ? 18 : 22, fontWeight: 600, color: B.navy, lineHeight: 1.25, marginBottom: 8, letterSpacing: "-0.02em" }}>{scenarios[0].label}</div>
            <p style={{ fontSize: 13, color: B.muted, margin: "0 0 12px", lineHeight: 1.6 }}>{scenarios[0].description}</p>
            <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
              <span style={{ fontSize: 18, fontWeight: 300, color: B.teal }}>+{scenarios[0].lift} points</span>
              <button onClick={() => router.push("/simulator")} style={{ fontSize: 12, fontWeight: 600, color: B.purple, background: "none", border: `1px solid ${B.purple}22`, borderRadius: 6, padding: "6px 14px", cursor: "pointer" }}>
                Model this change &rarr;
              </button>
            </div>
          </div>
        )}

        {/* ══════════ PLAN STATUS ($149 vs $69) ══════════ */}
        {hasData && (
          <div style={{ padding: "14px 20px", border: `1px solid ${B.stone}`, borderRadius: 8, marginBottom: 24, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            {planType === "monitoring" ? (
              <>
                <div>
                  <div style={{ fontSize: 10, fontWeight: 600, letterSpacing: "0.10em", color: B.teal, textTransform: "uppercase" as const, marginBottom: 2 }}>MONITORING PLAN</div>
                  <span style={{ fontSize: 13, color: B.navy }}>Assessment {assessmentsUsed} of {assessmentsTotal} used</span>
                  <span style={{ fontSize: 11, color: B.muted, marginLeft: 8 }}>&middot; 12-month access</span>
                </div>
                <div style={{ height: 6, width: 80, backgroundColor: B.stone, borderRadius: 3, overflow: "hidden" }}>
                  <div style={{ height: "100%", borderRadius: 3, backgroundColor: B.teal, width: `${(assessmentsUsed / assessmentsTotal) * 100}%` }} />
                </div>
              </>
            ) : (
              <>
                <div>
                  <div style={{ fontSize: 10, fontWeight: 600, letterSpacing: "0.10em", color: B.taupe, textTransform: "uppercase" as const, marginBottom: 2 }}>SINGLE ASSESSMENT</div>
                  <span style={{ fontSize: 12, color: B.muted }}>Upgrade to track progress over 12 months with 3 assessments.</span>
                </div>
                <Link href="/pricing" style={{ fontSize: 11, fontWeight: 600, color: B.purple, textDecoration: "none", flexShrink: 0 }}>Upgrade &rarr;</Link>
              </>
            )}
          </div>
        )}

        {/* ══════════ SCORE + GOAL ══════════ */}
        <div style={{ display: "flex", gap: 16, marginBottom: 24, flexDirection: mobile ? "column" : "row" }}>
          {/* Score */}
          <div style={{ flex: 1, padding: "24px", border: `1px solid ${B.stone}`, borderRadius: 10 }}>
            <div style={{ fontSize: 10, color: B.taupe, fontWeight: 500, marginBottom: 8 }}>INCOME STABILITY SCORE</div>
            <div style={{ display: "flex", alignItems: "baseline", gap: 4 }}>
              {hasData ? <AnimatedNumber value={score} style={{ fontSize: 48, fontWeight: 300, color: B.navy, letterSpacing: "-0.03em", lineHeight: 1 }} /> : <span style={{ fontSize: 48, fontWeight: 300, color: B.navy, letterSpacing: "-0.03em", lineHeight: 1 }}>—</span>}
              {hasData && <span style={{ fontSize: 16, fontWeight: 300, color: B.taupe }}>/100</span>}
            </div>
            {hasData && (
              <div style={{ display: "flex", alignItems: "center", gap: 6, marginTop: 8 }}>
                <div style={{ width: 6, height: 6, borderRadius: 1, backgroundColor: bandColor(score) }} />
                <span style={{ fontSize: 12, fontWeight: 500, color: bandColor(score) }}>{band}</span>
              </div>
            )}
          </div>

          {/* Goal progress */}
          {hasData && (
            <div style={{ flex: 1, padding: "24px", border: `1px solid ${B.stone}`, borderRadius: 10 }}>
              <div style={{ fontSize: 10, color: B.taupe, fontWeight: 500, marginBottom: 8 }}>
                {gap > 0 ? `${gap} POINTS TO ${nextBandLabel.toUpperCase()}` : "HIGHEST BAND"}
              </div>
              <div style={{ height: 6, backgroundColor: B.stone, borderRadius: 3, overflow: "hidden", marginBottom: 10 }}>
                <div style={{ height: "100%", borderRadius: 3, backgroundColor: bandColor(score), width: `${progress}%`, transition: "width 600ms ease" }} />
              </div>
              <div style={{ fontSize: 12, color: B.muted, lineHeight: 1.5 }}>{countdownMsg}</div>
            </div>
          )}
        </div>

        {/* ══════════ SCORE COMPARISON (2+ assessments) ══════════ */}
        {assessments.length >= 2 && (() => {
          const current = assessments[0];
          const previous = assessments[1];
          const diff = current.final_score - previous.final_score;
          return (
            <div style={{ padding: "18px 24px", border: `1px solid ${diff > 0 ? `${B.teal}20` : B.stone}`, borderRadius: 10, marginBottom: 24 }}>
              <div style={{ fontSize: 10, fontWeight: 600, letterSpacing: "0.12em", color: diff > 0 ? B.teal : B.red, marginBottom: 10 }}>
                {diff > 0 ? "SCORE IMPROVED" : diff === 0 ? "NO CHANGE" : "SCORE DECREASED"}
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                <span style={{ fontSize: 24, fontWeight: 300, color: B.taupe }}>{previous.final_score}</span>
                <span style={{ fontSize: 14, color: B.taupe }}>&rarr;</span>
                <span style={{ fontSize: 24, fontWeight: 300, color: B.navy }}>{current.final_score}</span>
                <span style={{ fontSize: 16, fontWeight: 600, color: diff > 0 ? B.teal : diff < 0 ? B.red : B.taupe, marginLeft: 4 }}>{diff > 0 ? "+" : ""}{diff}</span>
              </div>
            </div>
          );
        })()}

        {/* ══════════ INCOME STRUCTURE SNAPSHOT ══════════ */}
        {hasData && (
          <div style={{ padding: "20px 24px", border: `1px solid ${B.stone}`, borderRadius: 10, marginBottom: 24 }}>
            <div style={{ fontSize: 10, fontWeight: 600, letterSpacing: "0.12em", color: B.taupe, marginBottom: 12 }}>INCOME STRUCTURE</div>
            <div style={{ display: "flex", height: 32, borderRadius: 6, overflow: "hidden", marginBottom: 10, border: `1px solid ${B.stone}` }}>
              {activeIncome > 0 && <div style={{ width: `${activeIncome}%`, backgroundColor: `${B.red}22`, display: "flex", alignItems: "center", justifyContent: "center" }}><span style={{ fontSize: 10, fontWeight: 600, color: B.red }}>{activeIncome}%</span></div>}
              {semiIncome > 0 && <div style={{ width: `${semiIncome}%`, backgroundColor: `${B.amber}15`, display: "flex", alignItems: "center", justifyContent: "center" }}><span style={{ fontSize: 10, fontWeight: 600, color: B.amber }}>{semiIncome}%</span></div>}
              {persistentIncome > 0 && <div style={{ width: `${persistentIncome}%`, backgroundColor: `${B.teal}15`, display: "flex", alignItems: "center", justifyContent: "center" }}><span style={{ fontSize: 10, fontWeight: 600, color: B.teal }}>{persistentIncome}%</span></div>}
            </div>
            <div style={{ display: "flex", gap: 16, flexWrap: "wrap" as const }}>
              <span style={{ fontSize: 11, color: B.muted }}><span style={{ color: B.red, fontWeight: 600 }}>{activeIncome}%</span> stops when you stop</span>
              <span style={{ fontSize: 11, color: B.muted }}><span style={{ color: B.amber, fontWeight: 600 }}>{semiIncome}%</span> repeats for now</span>
              <span style={{ fontSize: 11, color: B.muted }}><span style={{ color: B.teal, fontWeight: 600 }}>{persistentIncome}%</span> keeps going without you</span>
            </div>
            <div style={{ marginTop: 10, fontSize: 12, color: B.muted }}>
              <Link href="/pressuremap" style={{ color: B.purple, fontWeight: 500, textDecoration: "none" }}>See full breakdown in PressureMap &rarr;</Link>
            </div>
          </div>
        )}

        {/* ══════════ SCENARIO QUICK-LAUNCH ══════════ */}
        {scenarios.length > 0 && (
          <div style={{ marginBottom: 24 }}>
            <div style={{ fontSize: 10, fontWeight: 600, letterSpacing: "0.12em", color: B.taupe, marginBottom: 12 }}>YOUR TOP MOVES</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {scenarios.map((s, i) => (
                <div key={s.id} onClick={() => router.push("/simulator")}
                  style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "14px 20px", border: `1px solid ${B.stone}`, borderLeft: `3px solid ${i === 0 ? B.purple : i === 1 ? B.teal : B.navy}`, borderRadius: 8, cursor: "pointer", transition: "box-shadow 200ms" }}
                  onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.boxShadow = "0 2px 8px rgba(14,26,43,0.06)"; }}
                  onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.boxShadow = "none"; }}
                >
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 600, color: B.navy, marginBottom: 2 }}>{s.label}</div>
                    <div style={{ fontSize: 11, color: B.muted }}>{s.description}</div>
                  </div>
                  <div style={{ textAlign: "right", flexShrink: 0, marginLeft: 16 }}>
                    <div style={{ fontSize: 16, fontWeight: 300, color: B.teal }}>+{s.lift}</div>
                    <div style={{ fontSize: 9, color: B.taupe }}>points</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ══════════ TIMELINE PROJECTION ══════════ */}
        {hasData && timeline.length > 0 && (
          <div style={{ padding: "20px 24px", border: `1px solid ${B.stone}`, borderRadius: 10, marginBottom: 24 }}>
            <div style={{ fontSize: 10, fontWeight: 600, letterSpacing: "0.12em", color: B.taupe, marginBottom: 14 }}>PROJECTED TRAJECTORY</div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", height: 80, gap: 2, marginBottom: 8 }}>
              {/* Current */}
              <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
                <span style={{ fontSize: 14, fontWeight: 300, color: B.navy }}>{score}</span>
                <div style={{ width: "100%", height: `${Math.max(10, score * 0.7)}%`, backgroundColor: `${bandColor(score)}22`, borderRadius: "4px 4px 0 0" }} />
                <span style={{ fontSize: 9, color: B.taupe }}>Now</span>
              </div>
              {timeline.map((t, i) => (
                <div key={i} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
                  <span style={{ fontSize: 14, fontWeight: 300, color: t.delta > 0 ? B.teal : B.navy }}>{t.score}</span>
                  <div style={{ width: "100%", height: `${Math.max(10, t.score * 0.7)}%`, backgroundColor: `${B.teal}22`, borderRadius: "4px 4px 0 0" }} />
                  <span style={{ fontSize: 9, color: B.taupe }}>{t.label || `${[3, 6, 12][i]}mo`}</span>
                </div>
              ))}
            </div>
            <p style={{ fontSize: 11, color: B.muted, margin: 0, lineHeight: 1.5 }}>
              If you implement your top recommended action, structural improvements compound over time. Early gains unlock interaction bonuses.
            </p>
          </div>
        )}

        {/* ══════════ KEY METRICS ══════════ */}
        {hasData && (
          <div style={{ display: "flex", gap: 12, marginBottom: 24, flexDirection: mobile ? "column" : "row" }}>
            {[
              { label: "Income runway", value: continuityMonths < 1 ? "< 1 month" : `${continuityMonths} months`, color: continuityMonths < 3 ? B.red : B.teal },
              { label: "Biggest source risk", value: `−${riskDrop} pts`, color: riskDrop > 15 ? B.red : B.amber },
              { label: "Days since assessment", value: String(daysSince), color: daysSince > 90 ? B.red : daysSince > 30 ? B.amber : B.teal },
            ].map((m) => (
              <div key={m.label} style={{ flex: 1, padding: "14px 18px", border: `1px solid ${B.stone}`, borderRadius: 8 }}>
                <div style={{ fontSize: 10, color: B.taupe, fontWeight: 500, marginBottom: 4 }}>{m.label}</div>
                <div style={{ fontSize: 20, fontWeight: 300, color: m.color, letterSpacing: "-0.02em" }}>{m.value}</div>
              </div>
            ))}
          </div>
        )}

        {/* ══════════ REASSESSMENT READINESS ══════════ */}
        {hasData && (
          <div style={{ padding: "20px 24px", border: `1px solid ${B.stone}`, borderRadius: 10, marginBottom: 24 }}>
            <div style={{ fontSize: 10, fontWeight: 600, letterSpacing: "0.12em", color: B.taupe, marginBottom: 12 }}>REASSESSMENT READINESS</div>
            <p style={{ fontSize: 12, color: B.muted, margin: "0 0 14px", lineHeight: 1.5 }}>Have you made any of these structural changes since your last assessment?</p>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {reassessChecks.map((check) => (
                <div key={check.key} onClick={() => toggleCheck(check.key)}
                  style={{ display: "flex", alignItems: "center", gap: 10, padding: "8px 12px", borderRadius: 6, cursor: "pointer", border: `1px solid ${checkedItems.includes(check.key) ? `${B.teal}25` : B.stone}`, transition: "all 200ms" }}>
                  <div style={{ width: 18, height: 18, borderRadius: 4, border: `1.5px solid ${checkedItems.includes(check.key) ? B.teal : "rgba(14,26,43,0.18)"}`, backgroundColor: checkedItems.includes(check.key) ? B.teal : "transparent", display: "flex", alignItems: "center", justifyContent: "center", transition: "all 200ms", flexShrink: 0 }}>
                    {checkedItems.includes(check.key) && <span style={{ color: B.white, fontSize: 11, fontWeight: 700 }}>&#10003;</span>}
                  </div>
                  <span style={{ fontSize: 13, color: checkedItems.includes(check.key) ? B.navy : B.muted, fontWeight: checkedItems.includes(check.key) ? 500 : 400 }}>{check.label}</span>
                </div>
              ))}
            </div>
            {checkedItems.length >= 2 && (
              <div style={{ marginTop: 14, padding: "12px 16px", borderRadius: 6, backgroundColor: `${B.teal}06`, border: `1px solid ${B.teal}15` }}>
                <div style={{ fontSize: 13, fontWeight: 600, color: B.teal, marginBottom: 4 }}>You may be ready to reassess.</div>
                <p style={{ fontSize: 12, color: B.muted, margin: "0 0 8px" }}>With {checkedItems.length} structural changes, a new assessment could show meaningful score improvement.</p>
                <Link href="/pricing" style={{ fontSize: 12, fontWeight: 600, color: B.purple, textDecoration: "none" }}>Get a new assessment &rarr;</Link>
              </div>
            )}
          </div>
        )}

        {/* ══════════ SCORE HISTORY ══════════ */}
        {assessments.length > 0 && (
          <div style={{ padding: "20px 24px", border: `1px solid ${B.stone}`, borderRadius: 10, marginBottom: 32 }}>
            <div style={{ fontSize: 10, fontWeight: 600, letterSpacing: "0.12em", color: B.taupe, marginBottom: 12 }}>ASSESSMENT HISTORY</div>
            {assessments.slice(0, 5).map((a, i) => {
              const prev = i < assessments.length - 1 ? assessments[i + 1].final_score : null;
              const diff = prev !== null ? a.final_score - prev : null;
              return (
                <div key={a.record_id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "8px 0", borderBottom: i < Math.min(assessments.length, 5) - 1 ? `1px solid ${B.stone}` : "none" }}>
                  <div>
                    <span style={{ fontSize: 13, fontWeight: 500, color: B.navy }}>{formatDate(a.assessment_date_utc || a.issued_timestamp_utc || "")}</span>
                    <span style={{ fontSize: 11, color: B.taupe, marginLeft: 8 }}>{a.stability_band}</span>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <span style={{ fontSize: 16, fontWeight: 300, color: bandColor(a.final_score) }}>{a.final_score}</span>
                    {diff !== null && diff !== 0 && <span style={{ fontSize: 11, fontWeight: 600, color: diff > 0 ? B.teal : B.red }}>{diff > 0 ? `+${diff}` : diff}</span>}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* ── CTA ── */}
        <SuiteCTA page="dashboard" />

        {/* ── Footer ── */}
        <div style={{ marginTop: 32, paddingTop: 16, borderTop: `1px solid ${B.stone}`, textAlign: "center" }}>
          <p style={{ fontSize: 10, color: B.taupe, margin: 0, fontStyle: "italic" }}>RunPayway&#8482; Stability Suite &mdash; Dashboard. A proprietary tool by PeopleStar Enterprises.</p>
        </div>
      </div>
    </div>
  );
}
