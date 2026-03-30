"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { simulateScore, SIMULATOR_PRESETS, projectTimeline } from "@/lib/engine/v2/simulate";
import type { CanonicalInput } from "@/lib/engine/v2/types";
import type { TimelinePoint } from "@/lib/engine/v2/simulate";
import { getScriptsForSector } from "@/lib/action-scripts";
import SuiteHeader from "@/components/SuiteHeader";
import AnimatedNumber from "@/components/AnimatedNumber";
import { SAMPLE_PROFILES, IS_SAMPLE } from "@/lib/sample-data";

/* ================================================================== */
/*  BRAND TOKENS                                                       */
/* ================================================================== */
const B = {
  navy: "#0E1A2B",
  purple: "#4B3FAE",
  teal: "#1F6D7A",
  white: "#FFFFFF",
  bg: "#FAFAFA",
  surface: "#FFFFFF",
  stone: "rgba(14,26,43,0.08)",
  taupe: "rgba(14,26,43,0.36)",
  muted: "rgba(14,26,43,0.52)",
  faint: "rgba(14,26,43,0.20)",
  red: "#C53030",
  amber: "#B7791F",
  bandLimited: "#9B2C2C",
  bandDeveloping: "#92640A",
  bandEstablished: "#2B5EA7",
  bandHigh: "#1F6D7A",
};

const INTER = "'Inter', system-ui, -apple-system, sans-serif";

function bc(s: number): string {
  return s >= 75 ? B.bandHigh : s >= 50 ? B.bandEstablished : s >= 30 ? B.bandDeveloping : B.bandLimited;
}

/* ================================================================== */
/*  INDUSTRY CONTEXT — one-liner insights by sector                    */
/* ================================================================== */
const INDUSTRY_INSIGHTS: Record<string, string> = {
  consulting: "In consulting, 72% of income instability comes from client concentration and project-based billing cycles.",
  consulting_professional_services: "In professional services, firms with 3+ retainer clients score 40% higher on average.",
  real_estate: "In real estate, agents with recurring property management income score 2x higher than transaction-only agents.",
  technology: "In tech, professionals with SaaS or licensing revenue score 35% higher than those on project-based billing.",
  healthcare: "In healthcare, practitioners with membership models average 28 points higher than fee-for-service only.",
  sales_brokerage: "In sales, brokers with managed account channels score 45% higher than pure commission earners.",
  finance_banking: "In finance, advisors with AUM-based recurring fees score 50% higher than transaction-based professionals.",
  insurance: "In insurance, agents with renewal books score 38% higher than those dependent on new policy sales.",
  legal_services: "In legal services, firms with general counsel retainers average 32 points higher than hourly-billing practices.",
  creative_media: "In creative work, professionals with licensing or royalty income score 40% higher than project-only creators.",
  education_training: "In education, trainers with course licensing or subscription models score 35% higher than per-session billing.",
  fitness_wellness: "In fitness, coaches with membership models average 30 points higher than session-based billing.",
  construction_trades: "In trades, contractors with maintenance agreements score 28 points higher than bid-only businesses.",
  default: "Across all sectors, professionals with at least one recurring income source score 35% higher on average.",
};

/* ================================================================== */
/*  MAIN PAGE                                                          */
/* ================================================================== */
export default function DashboardPage() {
  /* ── State ── */
  const [record, setRecord] = useState<Record<string, unknown> | null>(null);
  const [assessments, setAssessments] = useState<{ record_id: string; final_score: number; stability_band: string; assessment_date_utc: string; issued_timestamp_utc?: string }[]>([]);
  const [mobile, setMobile] = useState(false);
  const [demoProfile, setDemoProfile] = useState(1);
  const [accessCode, setAccessCode] = useState("");
  const [codeError, setCodeError] = useState<string | null>(null);

  // Quick progress check
  const [quickToggles, setQuickToggles] = useState<Record<string, boolean>>({});

  // Scenario lab
  const [activePreset, setActivePreset] = useState<string | null>(null);
  const [savedScenarios, setSavedScenarios] = useState<{ name: string; score: number; band: string; lift: number }[]>([]);

  // Scripts
  const [expandedScript, setExpandedScript] = useState<string | null>(null);
  const [copiedScript, setCopiedScript] = useState<string | null>(null);

  // Reassessment
  const [checkedItems, setCheckedItems] = useState<string[]>([]);

  /* ── Responsive ── */
  useEffect(() => {
    const check = () => setMobile(window.innerWidth <= 700);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  /* ── Load data ── */
  useEffect(() => {
    let stored = sessionStorage.getItem("rp_record");
    if (!stored) stored = localStorage.getItem("rp_record");
    if (stored) { try { setRecord(JSON.parse(stored)); } catch { /* */ } }

    try {
      const records = JSON.parse(localStorage.getItem("rp_records") || "[]");
      setAssessments(records.sort((a: { assessment_date_utc: string; issued_timestamp_utc?: string }, b: { assessment_date_utc: string; issued_timestamp_utc?: string }) => new Date(b.assessment_date_utc || b.issued_timestamp_utc || "").getTime() - new Date(a.assessment_date_utc || a.issued_timestamp_utc || "").getTime()));
    } catch { /* */ }

    try { setCheckedItems(JSON.parse(localStorage.getItem("rp_reassess_checks") || "[]")); } catch { /* */ }
  }, []);

  /* ── Access code handler ── */
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

  /* ── Derived data ── */
  const isDemo = IS_SAMPLE(record);
  const r = isDemo ? SAMPLE_PROFILES[demoProfile].record : record!;

  const score = (r?.final_score as number) || 0;
  const band = (r?.stability_band as string) || "";
  const v2 = r?._v2 as Record<string, unknown> | undefined;
  const ni = v2?.normalized_inputs as Record<string, number | string> | undefined;
  const benchmarking = v2?.benchmarking as { peer_percentile: number; cluster_label: string; cluster_average_score: number } | undefined;
  const constraints = v2?.constraints as { root_constraint: string; secondary_constraint?: string } | undefined;
  const fragility = v2?.fragility as { fragility_class: string } | undefined;

  const activeIncome = (r?.active_income_level as number) || 0;
  const semiIncome = (r?.semi_persistent_income_level as number) || 0;
  const persistentIncome = (r?.persistent_income_level as number) || 0;
  const continuityMonths = (r?.income_continuity_months as number) || 0;
  const riskDrop = (r?.risk_scenario_drop as number) || 0;
  const issuedDate = (r?.issued_timestamp_utc as string) || (r?.assessment_date_utc as string) || "";
  const daysSince = issuedDate ? Math.floor((Date.now() - new Date(issuedDate).getTime()) / (1000 * 60 * 60 * 24)) : 0;
  const industrySector = (r?.industry_sector as string) || "";
  const fragilityLabel = fragility?.fragility_class ? fragility.fragility_class.charAt(0).toUpperCase() + fragility.fragility_class.slice(1) : "—";

  /* ── Base inputs ── */
  const baseInputs: CanonicalInput = ni ? {
    income_persistence_pct: ni.income_persistence_pct as number,
    largest_source_pct: ni.largest_source_pct as number,
    source_diversity_count: ni.source_diversity_count as number,
    forward_secured_pct: ni.forward_secured_pct as number,
    income_variability_level: (ni.income_variability_level || "moderate") as CanonicalInput["income_variability_level"],
    labor_dependence_pct: ni.labor_dependence_pct as number,
  } : { income_persistence_pct: 25, largest_source_pct: 60, source_diversity_count: 2, forward_secured_pct: 15, income_variability_level: "moderate" as const, labor_dependence_pct: 70 };

  const qualityScore = ((v2?.quality as Record<string, number>)?.quality_score) ?? 5;
  const baseResult = simulateScore(baseInputs, qualityScore);
  const displayScore = score > 0 ? score : baseResult.overall_score;

  /* ── Industry insight ── */
  const industryInsight = INDUSTRY_INSIGHTS[industrySector] || INDUSTRY_INSIGHTS.default;

  /* ── Industry scripts ── */
  const scripts = industrySector ? getScriptsForSector(industrySector) : [];

  /* ── Top moves (ranked presets, positive only) ── */
  const topMoves = SIMULATOR_PRESETS
    .filter(p => !["lose_top_client", "cant_work_90_days"].includes(p.id))
    .map(p => {
      const result = simulateScore(p.modify(baseInputs), qualityScore);
      const lift = result.overall_score - displayScore;
      const effort: string = p.id === "lock_forward" || p.id === "convert_retainer" ? "Low" : "High";
      const speed: string = p.id === "lock_forward" || p.id === "convert_retainer" ? "Fast" : "Gradual";
      return { ...p, lift, projected: result.overall_score, resultBand: result.band, effort, speed };
    })
    .filter(p => p.lift > 0)
    .sort((a, b) => b.lift - a.lift);

  /* ── Script mapping ── */
  const getScriptForPreset = (presetId: string) => {
    if (scripts.length === 0) return null;
    if (presetId === "convert_retainer") return scripts.find(s => s.id.includes("retainer")) || scripts[0];
    if (presetId === "add_client") return scripts.find(s => s.id.includes("diversi") || s.id.includes("referral")) || scripts[1];
    if (presetId === "build_passive") return scripts[2] || scripts[0];
    if (presetId === "lock_forward") return scripts[0];
    return scripts[0];
  };

  /* ── 12-Week Roadmap ── */
  const roadmapPhases = [
    { weeks: "Week 1–2", phase: "Immediate" },
    { weeks: "Week 3–4", phase: "Build momentum" },
    { weeks: "Week 5–8", phase: "Structural shift" },
    { weeks: "Week 9–12", phase: "Compound & stabilize" },
  ];
  const roadmapSteps = topMoves.slice(0, 4).map((move, i) => ({
    ...roadmapPhases[i],
    action: move.label,
    presetId: move.id,
    lift: move.lift,
    description: move.description,
  }));

  /* ── Quick progress check ── */
  const quickActions = [
    { id: "client", label: "Added a new client or income source", presetId: "add_client" },
    { id: "retainer", label: "Signed a retainer or recurring agreement", presetId: "convert_retainer" },
    { id: "passive", label: "Created passive or semi-passive income", presetId: "build_passive" },
    { id: "forward", label: "Secured next quarter with commitments", presetId: "lock_forward" },
  ];

  let quickInputs = { ...baseInputs };
  const activeQuickCount = Object.values(quickToggles).filter(Boolean).length;
  for (const action of quickActions) {
    if (quickToggles[action.id]) {
      const preset = SIMULATOR_PRESETS.find(p => p.id === action.presetId);
      if (preset) quickInputs = preset.modify(quickInputs);
    }
  }
  const quickResult = simulateScore(quickInputs, qualityScore);
  const quickLift = activeQuickCount > 0 ? quickResult.overall_score - displayScore : 0;

  /* ── Zone data (Income X-Ray) ── */
  const rootConstraint = constraints?.root_constraint || "weak_forward_visibility";
  const constraintPreset: Record<string, string> = {
    high_concentration: "add_client", weak_forward_visibility: "lock_forward",
    high_labor_dependence: "build_passive", low_persistence: "convert_retainer",
    low_source_diversity: "add_client", high_variability: "convert_retainer",
  };
  const getPresetLift = (presetId: string) => {
    const preset = SIMULATOR_PRESETS.find(p => p.id === presetId);
    if (!preset) return { score: displayScore, lift: 0 };
    const result = simulateScore(preset.modify(baseInputs), qualityScore);
    return { score: result.overall_score, lift: Math.max(0, result.overall_score - displayScore) };
  };
  const redPreset = constraintPreset[rootConstraint] || "convert_retainer";
  const redResult = getPresetLift(redPreset);
  const greenPreset = rootConstraint === "high_labor_dependence" ? "lock_forward" : "build_passive";
  const greenResult = getPresetLift(greenPreset);

  const zones = [
    { id: "active", label: "Stops When You Stop", pct: activeIncome, color: B.red, lift: redResult.lift },
    { id: "semi", label: "Recurring For Now", pct: semiIncome, color: B.amber, lift: 0 },
    { id: "persistent", label: "Protected", pct: persistentIncome, color: B.teal, lift: greenResult.lift },
  ];

  /* ── Scenario Lab ── */
  const activePresetObj = SIMULATOR_PRESETS.find(p => p.id === activePreset);
  const scenarioInputs = activePresetObj ? activePresetObj.modify(baseInputs) : baseInputs;
  const scenarioResult = activePresetObj ? simulateScore(scenarioInputs, qualityScore) : baseResult;
  const scenarioDelta = activePresetObj ? scenarioResult.overall_score - displayScore : 0;
  const scenarioTimeline: TimelinePoint[] = activePresetObj ? projectTimeline(baseInputs, scenarioInputs, qualityScore) : [];

  /* ── Stress tests ── */
  const stressLC = simulateScore(SIMULATOR_PRESETS.find(p => p.id === "lose_top_client")!.modify(baseInputs), qualityScore);
  const stressNW = simulateScore(SIMULATOR_PRESETS.find(p => p.id === "cant_work_90_days")!.modify(baseInputs), qualityScore);

  /* ── Progress ── */
  const nextThreshold = displayScore < 30 ? 30 : displayScore < 50 ? 50 : displayScore < 75 ? 75 : 100;
  const nextBandLabel = displayScore < 30 ? "Developing" : displayScore < 50 ? "Established" : displayScore < 75 ? "High" : "Maximum";
  const gap = nextThreshold - displayScore;
  const progress = Math.min(100, (displayScore / nextThreshold) * 100);

  /* ── Reassessment ── */
  const reassessChecks = [
    { label: "Signed a new retainer or recurring agreement", key: "retainer" },
    { label: "Added a new independent income source", key: "source" },
    { label: "Reduced your largest client below 40%", key: "concentration" },
    { label: "Created a passive income stream", key: "passive" },
  ];
  const toggleCheck = (key: string) => {
    setCheckedItems(prev => {
      const updated = prev.includes(key) ? prev.filter(k => k !== key) : [...prev, key];
      localStorage.setItem("rp_reassess_checks", JSON.stringify(updated));
      return updated;
    });
  };

  /* ── Return trigger message ── */
  const returnTrigger = checkedItems.length >= 2
    ? "You have made enough structural changes to warrant a reassessment."
    : topMoves[0]
      ? `Come back after you ${topMoves[0].label.toLowerCase()}. That single change is worth +${topMoves[0].lift} points.`
      : "Come back after making a structural change to your income.";

  /* ── Copy script helper ── */
  const copyScript = (text: string, id: string) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopiedScript(id);
      setTimeout(() => setCopiedScript(null), 2000);
    });
  };

  /* ================================================================ */
  /*  RENDER                                                           */
  /* ================================================================ */
  return (
    <div style={{ minHeight: "100vh", backgroundColor: B.bg, fontFamily: INTER }}>
      <style>{`
        @media(max-width:700px){
          .d-2col{flex-direction:column!important;}
          .d-3col{grid-template-columns:1fr!important;}
          .d-metrics{flex-direction:column!important;}
          .d-compare{flex-direction:column!important;}
        }
      `}</style>
      <SuiteHeader current="dashboard" />

      <div style={{ maxWidth: 880, margin: "0 auto", padding: mobile ? "24px 16px 60px" : "40px 32px 80px" }}>

        {/* ═══════════════════════════════════════════════════════════ */}
        {/* DEMO CONTROLS                                              */}
        {/* ═══════════════════════════════════════════════════════════ */}
        {isDemo && (
          <div style={{ padding: "14px 20px", borderRadius: 10, backgroundColor: `${B.purple}05`, border: `1px solid ${B.purple}12`, marginBottom: 28 }}>
            <div style={{ display: "flex", flexDirection: mobile ? "column" : "row", gap: 12, alignItems: mobile ? "stretch" : "center" }}>
              <div style={{ display: "flex", gap: 6, alignItems: "center", flex: 1 }}>
                <span style={{ fontSize: 11, fontWeight: 700, color: B.purple, letterSpacing: "0.08em" }}>SAMPLE</span>
                {SAMPLE_PROFILES.map((p, i) => (
                  <button key={p.id} onClick={() => { setDemoProfile(i); setActivePreset(null); setSavedScenarios([]); setQuickToggles({}); }}
                    style={{ padding: "5px 12px", borderRadius: 5, fontSize: 12, fontWeight: demoProfile === i ? 600 : 400, color: demoProfile === i ? "#FFF" : B.muted, backgroundColor: demoProfile === i ? (p.id === "limited" ? B.red : p.id === "developing" ? B.amber : p.id === "established" ? B.bandEstablished : B.teal) : "transparent", border: `1px solid ${demoProfile === i ? "transparent" : B.stone}`, cursor: "pointer", transition: "all 150ms" }}
                  >{p.bandShort}</button>
                ))}
              </div>
              <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
                <input value={accessCode} onChange={(e) => { setAccessCode(e.target.value); setCodeError(null); }} placeholder="Paste access code" onKeyDown={(e) => { if (e.key === "Enter") handleCodeSubmit(); }}
                  style={{ padding: "7px 12px", fontSize: 12, fontFamily: "monospace", border: `1px solid ${B.stone}`, borderRadius: 5, outline: "none", width: mobile ? "100%" : 200, boxSizing: "border-box" as const }} />
                <button onClick={handleCodeSubmit} style={{ padding: "7px 16px", fontSize: 12, fontWeight: 600, color: B.white, backgroundColor: B.purple, border: "none", borderRadius: 5, cursor: "pointer", whiteSpace: "nowrap" as const }}>Load</button>
              </div>
            </div>
            {codeError && <div style={{ fontSize: 11, color: B.red, marginTop: 6 }}>{codeError}</div>}
          </div>
        )}

        {/* ═══════════════════════════════════════════════════════════ */}
        {/* 1. SCORE + BENCHMARKING                                    */}
        {/* ═══════════════════════════════════════════════════════════ */}
        <section style={{ marginBottom: 36 }}>
          <div style={{ padding: mobile ? "28px 20px" : "32px 36px", border: `1px solid ${B.stone}`, borderRadius: 14, backgroundColor: B.surface }}>
            <div style={{ display: "flex", alignItems: "center", gap: 24, marginBottom: 20 }}>
              <div>
                <AnimatedNumber value={displayScore} style={{ fontSize: 64, fontWeight: 300, color: B.navy, letterSpacing: "-0.04em", lineHeight: 1, display: "block" }} />
                <span style={{ fontSize: 14, fontWeight: 300, color: B.taupe }}>/100</span>
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
                  <div style={{ width: 10, height: 10, borderRadius: 3, backgroundColor: bc(displayScore) }} />
                  <span style={{ fontSize: 17, fontWeight: 600, color: bc(displayScore) }}>{band || baseResult.band}</span>
                </div>
                <div style={{ height: 7, backgroundColor: B.stone, borderRadius: 4, overflow: "hidden", marginBottom: 8 }}>
                  <div style={{ height: "100%", borderRadius: 4, backgroundColor: bc(displayScore), width: `${progress}%`, transition: "width 600ms ease" }} />
                </div>
                <span style={{ fontSize: 14, color: B.muted }}>{gap > 0 ? `${gap} points to ${nextBandLabel}` : "Highest band achieved"}</span>
              </div>
            </div>

            {/* Benchmarking */}
            {benchmarking && (
              <div style={{ padding: "16px 20px", borderRadius: 10, backgroundColor: `${B.purple}05`, border: `1px solid ${B.purple}08`, marginBottom: 16 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap" as const, gap: 8 }}>
                  <div>
                    <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.10em", color: B.purple, marginBottom: 4 }}>PEER RANKING</div>
                    <div style={{ fontSize: 16, fontWeight: 600, color: B.navy }}>
                      Top {100 - benchmarking.peer_percentile}% of {benchmarking.cluster_label}
                    </div>
                  </div>
                  <div style={{ textAlign: "right" as const }}>
                    <div style={{ fontSize: 14, color: B.muted }}>Cluster avg: <span style={{ fontWeight: 600, color: B.navy }}>{benchmarking.cluster_average_score}</span></div>
                    <div style={{ fontSize: 14, color: displayScore > benchmarking.cluster_average_score ? B.teal : B.red, fontWeight: 600 }}>
                      {displayScore > benchmarking.cluster_average_score ? `+${displayScore - benchmarking.cluster_average_score} above` : `${displayScore - benchmarking.cluster_average_score} below`} average
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Quick metrics row */}
            <div style={{ display: "flex", gap: 10, flexWrap: "wrap" as const }} className="d-metrics">
              {[
                { label: "Runway", value: continuityMonths < 1 ? "< 1 mo" : `${continuityMonths.toFixed(1)} mo`, color: continuityMonths < 3 ? B.red : B.teal },
                { label: "Risk if top source leaves", value: `−${riskDrop}`, color: riskDrop > 15 ? B.red : B.amber },
                { label: "Fragility", value: fragilityLabel, color: fragilityLabel === "Brittle" || fragilityLabel === "Fragile" ? B.red : fragilityLabel === "Resilient" ? B.teal : B.amber },
              ].map((m) => (
                <div key={m.label} style={{ flex: 1, minWidth: 120, padding: "12px 16px", border: `1px solid ${B.stone}`, borderRadius: 8, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ fontSize: 13, color: B.taupe }}>{m.label}</span>
                  <span style={{ fontSize: 17, fontWeight: 300, color: m.color }}>{m.value}</span>
                </div>
              ))}
            </div>

            {/* Industry context */}
            <p style={{ fontSize: 13, color: B.taupe, margin: "16px 0 0", lineHeight: 1.5, fontStyle: "italic" }}>{industryInsight}</p>
          </div>
        </section>

        {/* ═══════════════════════════════════════════════════════════ */}
        {/* 2. YOUR #1 MOVE — with script right there                  */}
        {/* ═══════════════════════════════════════════════════════════ */}
        {topMoves.length > 0 && (() => {
          const move = topMoves[0];
          const script = getScriptForPreset(move.id);
          return (
            <section style={{ marginBottom: 36 }}>
              <div style={{ border: `1px solid ${B.stone}`, borderLeft: `4px solid ${B.purple}`, borderRadius: 14, backgroundColor: B.surface, overflow: "hidden" }}>
                <div style={{ padding: mobile ? "24px 20px" : "28px 32px" }}>
                  <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.12em", color: B.purple, marginBottom: 8 }}>YOUR #1 PRIORITY</div>
                  <div style={{ fontSize: 20, fontWeight: 600, color: B.navy, lineHeight: 1.3, marginBottom: 8 }}>{move.label}</div>
                  <p style={{ fontSize: 15, color: B.muted, margin: "0 0 14px", lineHeight: 1.6 }}>{move.description}</p>
                  <div style={{ display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap" as const }}>
                    <span style={{ fontSize: 20, fontWeight: 300, color: B.teal }}>+{move.lift} pts</span>
                    {move.resultBand !== (band || baseResult.band) && (
                      <span style={{ fontSize: 13, fontWeight: 600, color: B.purple, backgroundColor: `${B.purple}08`, padding: "4px 12px", borderRadius: 20 }}>→ {move.resultBand}</span>
                    )}
                    <span style={{ fontSize: 12, color: B.taupe, backgroundColor: B.stone, padding: "3px 10px", borderRadius: 20 }}>{move.effort} effort · {move.speed}</span>
                  </div>
                </div>

                {/* Script — always visible for #1 priority */}
                {script && (
                  <div style={{ padding: mobile ? "20px 20px" : "24px 32px", borderTop: `1px solid ${B.stone}`, backgroundColor: `${B.purple}02` }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
                      <div>
                        <div style={{ fontSize: 14, fontWeight: 600, color: B.navy }}>{script.title}</div>
                        <div style={{ fontSize: 13, color: B.muted }}>{script.context}</div>
                      </div>
                      <button onClick={() => copyScript(script.script, script.id)}
                        style={{ fontSize: 13, fontWeight: 600, color: copiedScript === script.id ? B.teal : B.purple, backgroundColor: copiedScript === script.id ? `${B.teal}08` : `${B.purple}08`, border: "none", borderRadius: 8, padding: "10px 18px", cursor: "pointer", whiteSpace: "nowrap" as const }}>
                        {copiedScript === script.id ? "Copied!" : "Copy Script"}
                      </button>
                    </div>
                    <pre style={{ fontSize: 14, color: B.navy, lineHeight: 1.7, whiteSpace: "pre-wrap" as const, margin: 0, padding: "18px 20px", backgroundColor: B.surface, borderRadius: 10, border: `1px solid ${B.stone}`, fontFamily: INTER }}>{script.script}</pre>
                  </div>
                )}
              </div>
            </section>
          );
        })()}

        {/* ═══════════════════════════════════════════════════════════ */}
        {/* 3. 12-WEEK ACTION ROADMAP                                  */}
        {/* ═══════════════════════════════════════════════════════════ */}
        {roadmapSteps.length > 1 && (
          <section style={{ marginBottom: 36 }}>
            <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.12em", color: B.taupe, marginBottom: 16 }}>YOUR 12-WEEK ROADMAP</div>

            <div style={{ border: `1px solid ${B.stone}`, borderRadius: 14, backgroundColor: B.surface, overflow: "hidden" }}>
              {roadmapSteps.map((step, i) => {
                const script = getScriptForPreset(step.presetId);
                const isExpanded = expandedScript === `roadmap-${i}`;
                return (
                  <div key={i} style={{ borderBottom: i < roadmapSteps.length - 1 ? `1px solid ${B.stone}` : "none" }}>
                    <div style={{ padding: mobile ? "18px 16px" : "20px 28px", display: "flex", gap: 16, alignItems: "flex-start" }}>
                      {/* Phase indicator */}
                      <div style={{ flexShrink: 0, textAlign: "center" as const, minWidth: 56 }}>
                        <div style={{ width: 28, height: 28, borderRadius: "50%", backgroundColor: i === 0 ? `${B.purple}12` : `${B.teal}08`, border: `1.5px solid ${i === 0 ? B.purple : B.teal}25`, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 4px" }}>
                          <span style={{ fontSize: 12, fontWeight: 700, color: i === 0 ? B.purple : B.teal }}>{i + 1}</span>
                        </div>
                        <div style={{ fontSize: 10, fontWeight: 600, color: B.taupe, lineHeight: 1.2 }}>{step.weeks}</div>
                      </div>

                      {/* Action */}
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: 15, fontWeight: 600, color: B.navy, marginBottom: 4 }}>{step.action}</div>
                        <p style={{ fontSize: 13, color: B.muted, margin: "0 0 8px", lineHeight: 1.5 }}>{step.description}</p>
                        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                          <span style={{ fontSize: 14, fontWeight: 600, color: B.teal }}>+{step.lift} pts</span>
                          {script && (
                            <button onClick={() => setExpandedScript(isExpanded ? null : `roadmap-${i}`)}
                              style={{ fontSize: 12, fontWeight: 600, color: B.purple, background: "none", border: `1px solid ${B.purple}15`, borderRadius: 6, padding: "4px 12px", cursor: "pointer" }}>
                              {isExpanded ? "Hide script ▲" : "Script ▼"}
                            </button>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Expanded script */}
                    {isExpanded && script && (
                      <div style={{ padding: mobile ? "16px 16px 20px" : "16px 28px 24px", backgroundColor: `${B.purple}02` }}>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
                          <span style={{ fontSize: 13, fontWeight: 600, color: B.navy }}>{script.title}</span>
                          <button onClick={() => copyScript(script.script, script.id)}
                            style={{ fontSize: 12, fontWeight: 600, color: copiedScript === script.id ? B.teal : B.purple, backgroundColor: copiedScript === script.id ? `${B.teal}08` : `${B.purple}08`, border: "none", borderRadius: 6, padding: "6px 14px", cursor: "pointer" }}>
                            {copiedScript === script.id ? "Copied!" : "Copy"}
                          </button>
                        </div>
                        <pre style={{ fontSize: 13, color: B.navy, lineHeight: 1.65, whiteSpace: "pre-wrap" as const, margin: 0, padding: "14px 16px", backgroundColor: B.surface, borderRadius: 8, border: `1px solid ${B.stone}`, fontFamily: INTER }}>{script.script}</pre>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </section>
        )}

        {/* ═══════════════════════════════════════════════════════════ */}
        {/* 4. QUICK PROGRESS CHECK                                    */}
        {/* ═══════════════════════════════════════════════════════════ */}
        <section style={{ marginBottom: 36, padding: mobile ? "24px 20px" : "28px 32px", border: `1px solid ${B.stone}`, borderRadius: 14, backgroundColor: B.surface }}>
          <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.12em", color: B.teal, marginBottom: 6 }}>PROGRESS CHECK</div>
          <div style={{ fontSize: 17, fontWeight: 600, color: B.navy, marginBottom: 4 }}>Has anything changed since your assessment?</div>
          <p style={{ fontSize: 14, color: B.muted, margin: "0 0 18px", lineHeight: 1.5 }}>Toggle what you have done. Your estimated score updates instantly.</p>

          <div style={{ display: "flex", gap: 20, flexDirection: mobile ? "column" : "row" }} className="d-2col">
            <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 10 }}>
              {quickActions.map((action) => (
                <button key={action.id} onClick={() => setQuickToggles(prev => ({ ...prev, [action.id]: !prev[action.id] }))}
                  style={{ display: "flex", alignItems: "center", gap: 12, padding: "14px 16px", borderRadius: 10, cursor: "pointer", border: `1px solid ${quickToggles[action.id] ? `${B.teal}30` : B.stone}`, backgroundColor: quickToggles[action.id] ? `${B.teal}05` : "transparent", transition: "all 200ms", textAlign: "left" as const }}>
                  <div style={{ width: 22, height: 22, borderRadius: 6, border: `2px solid ${quickToggles[action.id] ? B.teal : B.faint}`, backgroundColor: quickToggles[action.id] ? B.teal : "transparent", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, transition: "all 200ms" }}>
                    {quickToggles[action.id] && <span style={{ color: "#FFF", fontSize: 11, fontWeight: 700 }}>&#10003;</span>}
                  </div>
                  <span style={{ fontSize: 14, fontWeight: quickToggles[action.id] ? 600 : 400, color: quickToggles[action.id] ? B.navy : B.muted }}>{action.label}</span>
                </button>
              ))}
            </div>

            {/* Estimated score */}
            <div style={{ flex: 0, minWidth: mobile ? "auto" : 190, textAlign: "center" as const, padding: "28px 20px", borderRadius: 12, backgroundColor: activeQuickCount > 0 ? `${B.teal}05` : `${B.stone}`, border: `1px solid ${activeQuickCount > 0 ? `${B.teal}18` : B.stone}`, display: "flex", flexDirection: "column", justifyContent: "center" }}>
              {activeQuickCount > 0 ? (
                <>
                  <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.10em", color: B.teal, marginBottom: 14 }}>ESTIMATED</div>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 10, marginBottom: 8 }}>
                    <span style={{ fontSize: 22, fontWeight: 300, color: B.taupe }}>{displayScore}</span>
                    <span style={{ fontSize: 16, color: B.taupe }}>→</span>
                    <span style={{ fontSize: 34, fontWeight: 300, color: B.teal }}>{quickResult.overall_score}</span>
                  </div>
                  <div style={{ fontSize: 18, fontWeight: 700, color: B.teal }}>+{quickLift}</div>
                  {quickResult.band !== (band || baseResult.band) && (
                    <div style={{ fontSize: 13, color: B.purple, fontWeight: 600, marginTop: 8 }}>→ {quickResult.band}</div>
                  )}
                  <Link href="/pricing" style={{ fontSize: 12, fontWeight: 600, color: B.purple, textDecoration: "none", marginTop: 14 }}>
                    Verify with full reassessment →
                  </Link>
                </>
              ) : (
                <>
                  <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.10em", color: B.taupe, marginBottom: 10 }}>CURRENT</div>
                  <div style={{ fontSize: 40, fontWeight: 300, color: B.navy, lineHeight: 1 }}>{displayScore}</div>
                </>
              )}
            </div>
          </div>
        </section>

        {/* ═══════════════════════════════════════════════════════════ */}
        {/* 5. INCOME STRUCTURE                                        */}
        {/* ═══════════════════════════════════════════════════════════ */}
        <section style={{ marginBottom: 36, padding: mobile ? "24px 20px" : "28px 32px", border: `1px solid ${B.stone}`, borderRadius: 14, backgroundColor: B.surface }}>
          <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.12em", color: B.taupe, marginBottom: 16 }}>INCOME STRUCTURE</div>

          {/* Composition bar */}
          <div style={{ display: "flex", height: 40, borderRadius: 8, overflow: "hidden", border: `1px solid ${B.stone}`, marginBottom: 14 }}>
            {zones.map((z) => z.pct > 0 ? (
              <div key={z.id} style={{ width: `${z.pct}%`, backgroundColor: `${z.color}18`, display: "flex", alignItems: "center", justifyContent: "center", borderRight: z.id !== "persistent" ? `2px solid ${B.white}` : "none" }}>
                {z.pct >= 12 && <span style={{ fontSize: 14, fontWeight: 600, color: z.color }}>{z.pct}%</span>}
              </div>
            ) : null)}
          </div>

          {/* Zone legend + lift */}
          <div style={{ display: "flex", gap: 20, flexWrap: "wrap" as const }}>
            {zones.map((z) => z.pct > 0 ? (
              <div key={z.id} style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <div style={{ width: 10, height: 10, borderRadius: 3, backgroundColor: z.color }} />
                <span style={{ fontSize: 14, color: B.navy }}><strong style={{ color: z.color }}>{z.pct}%</strong> {z.label.toLowerCase()}</span>
                {z.lift > 0 && <span style={{ fontSize: 12, fontWeight: 600, color: B.teal, marginLeft: 4 }}>+{z.lift} if fixed</span>}
              </div>
            ) : null)}
          </div>
        </section>

        {/* ═══════════════════════════════════════════════════════════ */}
        {/* 6. WHAT-IF EXPLORER                                        */}
        {/* ═══════════════════════════════════════════════════════════ */}
        <section style={{ marginBottom: 36 }}>
          <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.12em", color: B.teal, marginBottom: 6 }}>WHAT-IF EXPLORER</div>
          <p style={{ fontSize: 14, color: B.muted, margin: "0 0 16px", lineHeight: 1.5 }}>Test a change before you make it. Save up to 3 paths to compare side by side.</p>

          {/* Preset cards */}
          <div style={{ display: "grid", gridTemplateColumns: mobile ? "1fr" : "repeat(3, 1fr)", gap: 10, marginBottom: 16 }} className="d-3col">
            {SIMULATOR_PRESETS.map((preset) => {
              const result = simulateScore(preset.modify(baseInputs), qualityScore);
              const lift = result.overall_score - displayScore;
              const isActive = activePreset === preset.id;
              const isNeg = lift < 0;
              return (
                <button key={preset.id} onClick={() => setActivePreset(isActive ? null : preset.id)}
                  style={{ padding: "16px 18px", textAlign: "left" as const, borderRadius: 10, cursor: "pointer", transition: "all 200ms", border: `1px solid ${isActive ? (isNeg ? B.red : B.purple) + "40" : B.stone}`, backgroundColor: isActive ? (isNeg ? `${B.red}05` : `${B.purple}06`) : B.surface }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                    <span style={{ fontSize: 14, fontWeight: 600, color: isActive ? B.navy : B.muted }}>{preset.label}</span>
                    <span style={{ fontSize: 15, fontWeight: 700, color: lift >= 0 ? B.teal : B.red }}>{lift > 0 ? "+" : ""}{lift}</span>
                  </div>
                  <p style={{ fontSize: 12, color: B.taupe, margin: 0, lineHeight: 1.4 }}>{preset.description}</p>
                </button>
              );
            })}
          </div>

          {/* Active scenario detail + save */}
          {activePreset && activePresetObj && (
            <div style={{ padding: mobile ? "20px 16px" : "24px 28px", border: `1px solid ${B.stone}`, borderRadius: 12, backgroundColor: B.surface, marginBottom: 16 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 16, flexWrap: "wrap" as const }}>
                <div>
                  <div style={{ fontSize: 17, fontWeight: 600, color: B.navy, marginBottom: 6 }}>{activePresetObj.label}</div>
                  <div style={{ fontSize: 20, fontWeight: 300, color: scenarioDelta >= 0 ? B.teal : B.red }}>
                    {displayScore} → {scenarioResult.overall_score} ({scenarioDelta > 0 ? "+" : ""}{scenarioDelta})
                  </div>
                  {scenarioResult.band !== (band || baseResult.band) && (
                    <div style={{ fontSize: 14, fontWeight: 600, color: B.purple, marginTop: 4 }}>→ {scenarioResult.band}</div>
                  )}
                </div>
                {savedScenarios.length < 3 && scenarioDelta !== 0 && (
                  <button onClick={() => setSavedScenarios(prev => [...prev, { name: activePresetObj.label, score: scenarioResult.overall_score, band: scenarioResult.band, lift: scenarioDelta }])}
                    style={{ fontSize: 13, fontWeight: 600, color: B.teal, backgroundColor: `${B.teal}06`, border: `1px solid ${B.teal}18`, borderRadius: 8, padding: "10px 18px", cursor: "pointer" }}>
                    Save Path ({3 - savedScenarios.length} left)
                  </button>
                )}
              </div>

              {/* Timeline */}
              {scenarioTimeline.length > 0 && (
                <div style={{ marginTop: 20 }}>
                  <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.10em", color: B.taupe, marginBottom: 10 }}>PROJECTED TRAJECTORY</div>
                  <div style={{ display: "flex", gap: 10, flexDirection: mobile ? "column" : "row" }}>
                    <div style={{ flex: 0, padding: "10px 14px", border: `1px solid ${B.stone}`, borderRadius: 8, textAlign: "center" as const }}>
                      <div style={{ fontSize: 10, fontWeight: 600, color: B.taupe }}>NOW</div>
                      <div style={{ fontSize: 20, fontWeight: 300, color: B.navy }}>{displayScore}</div>
                    </div>
                    {scenarioTimeline.map((pt) => (
                      <div key={pt.month} style={{ flex: 1, padding: "10px 14px", border: `1px solid ${B.stone}`, borderRadius: 8, textAlign: "center" as const }}>
                        <div style={{ fontSize: 10, fontWeight: 600, color: B.taupe }}>{pt.label.toUpperCase()}</div>
                        <div style={{ fontSize: 20, fontWeight: 300, color: pt.delta >= 0 ? B.teal : B.red }}>{pt.score}</div>
                        <div style={{ fontSize: 11, color: B.muted, marginTop: 2 }}>{pt.narrative.split(".")[0]}.</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Saved scenarios comparison */}
          {savedScenarios.length > 0 && (
            <div style={{ padding: mobile ? "20px 16px" : "24px 28px", border: `1px solid ${B.stone}`, borderRadius: 12, backgroundColor: B.surface }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
                <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.10em", color: B.purple }}>COMPARE PATHS</div>
                <button onClick={() => setSavedScenarios([])} style={{ fontSize: 12, color: B.muted, background: "none", border: "none", cursor: "pointer", textDecoration: "underline" }}>Clear</button>
              </div>
              <div style={{ display: "flex", gap: 12 }} className="d-compare">
                <div style={{ flex: 1, padding: "18px 16px", borderRadius: 10, border: `1px solid ${B.stone}`, textAlign: "center" as const }}>
                  <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.10em", color: B.taupe, marginBottom: 8 }}>CURRENT</div>
                  <div style={{ fontSize: 32, fontWeight: 300, color: B.navy }}>{displayScore}</div>
                  <div style={{ fontSize: 13, fontWeight: 600, color: bc(displayScore), marginTop: 4 }}>{band || baseResult.band}</div>
                </div>
                {savedScenarios.map((s, i) => (
                  <div key={i} style={{ flex: 1, padding: "18px 16px", borderRadius: 10, border: `1px solid ${B.teal}18`, backgroundColor: `${B.teal}03`, textAlign: "center" as const, position: "relative" }}>
                    <button onClick={() => setSavedScenarios(prev => prev.filter((_, j) => j !== i))} style={{ position: "absolute", top: 6, right: 8, fontSize: 14, color: B.taupe, background: "none", border: "none", cursor: "pointer" }}>×</button>
                    <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.10em", color: B.teal, marginBottom: 8 }}>PATH {String.fromCharCode(65 + i)}</div>
                    <div style={{ fontSize: 32, fontWeight: 300, color: B.teal }}>{s.score}</div>
                    <div style={{ fontSize: 13, fontWeight: 600, color: bc(s.score), marginTop: 4 }}>{s.band}</div>
                    <div style={{ fontSize: 14, fontWeight: 600, color: B.teal, marginTop: 6 }}>+{s.lift}</div>
                    <div style={{ fontSize: 12, color: B.muted, marginTop: 4, lineHeight: 1.3 }}>{s.name}</div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </section>

        {/* ═══════════════════════════════════════════════════════════ */}
        {/* 7. PROGRESS & READINESS                                    */}
        {/* ═══════════════════════════════════════════════════════════ */}
        <section style={{ marginBottom: 36 }}>
          <div style={{ display: "flex", gap: 16, flexDirection: mobile ? "column" : "row" }} className="d-2col">

            {/* Reassessment readiness */}
            <div style={{ flex: 1, padding: mobile ? "24px 20px" : "28px 28px", border: `1px solid ${B.stone}`, borderRadius: 14, backgroundColor: B.surface }}>
              <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.12em", color: B.taupe, marginBottom: 16 }}>REASSESSMENT READINESS</div>
              <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 16 }}>
                {reassessChecks.map((check) => (
                  <div key={check.key} onClick={() => toggleCheck(check.key)}
                    style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 14px", borderRadius: 8, cursor: "pointer", border: `1px solid ${checkedItems.includes(check.key) ? `${B.teal}25` : B.stone}`, transition: "all 150ms" }}>
                    <div style={{ width: 20, height: 20, borderRadius: 5, border: `2px solid ${checkedItems.includes(check.key) ? B.teal : B.faint}`, backgroundColor: checkedItems.includes(check.key) ? B.teal : "transparent", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                      {checkedItems.includes(check.key) && <span style={{ color: "#FFF", fontSize: 10, fontWeight: 700 }}>&#10003;</span>}
                    </div>
                    <span style={{ fontSize: 14, color: checkedItems.includes(check.key) ? B.navy : B.muted }}>{check.label}</span>
                  </div>
                ))}
              </div>
              {checkedItems.length >= 2 ? (
                <div style={{ padding: "14px 16px", borderRadius: 8, backgroundColor: `${B.teal}05`, border: `1px solid ${B.teal}12` }}>
                  <span style={{ fontSize: 14, fontWeight: 600, color: B.teal }}>You may be ready to reassess. </span>
                  <Link href="/pricing" style={{ fontSize: 14, fontWeight: 600, color: B.purple, textDecoration: "none" }}>Get a new assessment →</Link>
                </div>
              ) : (
                <p style={{ fontSize: 13, color: B.taupe, margin: 0, lineHeight: 1.5, fontStyle: "italic" }}>{returnTrigger}</p>
              )}
            </div>

            {/* Right column: history + timing */}
            <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 12 }}>
              {/* Score comparison */}
              {assessments.length >= 2 && (() => {
                const diff = assessments[0].final_score - assessments[1].final_score;
                return (
                  <div style={{ padding: "20px 24px", border: `1px solid ${diff > 0 ? `${B.teal}18` : B.stone}`, borderRadius: 12, backgroundColor: B.surface, display: "flex", alignItems: "center", gap: 14 }}>
                    <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.10em", color: B.taupe }}>HISTORY</div>
                    <span style={{ fontSize: 22, fontWeight: 300, color: B.taupe }}>{assessments[1].final_score}</span>
                    <span style={{ color: B.taupe }}>→</span>
                    <span style={{ fontSize: 22, fontWeight: 300, color: B.navy }}>{assessments[0].final_score}</span>
                    <span style={{ fontSize: 16, fontWeight: 600, color: diff > 0 ? B.teal : diff < 0 ? B.red : B.taupe }}>{diff > 0 ? "+" : ""}{diff}</span>
                  </div>
                );
              })()}

              {/* Stress awareness — compact */}
              <div style={{ padding: "20px 24px", border: `1px solid ${B.stone}`, borderRadius: 12, backgroundColor: B.surface }}>
                <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.10em", color: B.taupe, marginBottom: 12 }}>STRESS RESILIENCE</div>
                {[
                  { label: "If top client leaves", value: `${displayScore} → ${stressLC.overall_score}`, color: B.red },
                  { label: "If you can't work 90 days", value: `${displayScore} → ${stressNW.overall_score}`, color: B.red },
                ].map(row => (
                  <div key={row.label} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "8px 0", borderBottom: `1px solid ${B.stone}` }}>
                    <span style={{ fontSize: 13, color: B.muted }}>{row.label}</span>
                    <span style={{ fontSize: 14, fontWeight: 500, color: row.color }}>{row.value}</span>
                  </div>
                ))}
              </div>

              {/* Days counter */}
              <div style={{ padding: "20px 24px", border: `1px solid ${B.stone}`, borderRadius: 12, backgroundColor: B.surface }}>
                <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.10em", color: daysSince > 60 ? B.red : B.taupe, marginBottom: 6 }}>
                  {daysSince > 0 ? `${daysSince} DAYS SINCE ASSESSMENT` : "ASSESSED TODAY"}
                </div>
                <p style={{ fontSize: 14, color: B.muted, margin: 0, lineHeight: 1.5 }}>
                  {daysSince === 0 ? "Your action plan is fresh. Start with your #1 priority above."
                    : daysSince <= 14 ? "Your plan is new. Focus on the first phase of your roadmap."
                    : daysSince <= 45 ? "You should be in Week 3–4 of your roadmap. Have you made a structural change?"
                    : daysSince <= 90 ? "If you have followed your roadmap, you are likely ready to reassess."
                    : "It has been over 90 days. A reassessment will show how much your structure has changed."}
                </p>
              </div>

              {/* Download */}
              {!isDemo && (
                <button onClick={() => {
                  const stored = sessionStorage.getItem("rp_record") || localStorage.getItem("rp_record");
                  if (!stored) return;
                  const blob = new Blob([stored], { type: "application/json" });
                  const url = URL.createObjectURL(blob);
                  const a = document.createElement("a"); a.href = url; a.download = "runpayway-assessment.json"; a.click();
                  URL.revokeObjectURL(url);
                }} style={{ fontSize: 13, fontWeight: 500, color: B.taupe, background: "none", border: `1px solid ${B.stone}`, borderRadius: 8, padding: "12px 18px", cursor: "pointer", textAlign: "center" as const }}>
                  Download Assessment Data
                </button>
              )}
            </div>
          </div>
        </section>

        {/* ═══════════════════════════════════════════════════════════ */}
        {/* FOOTER                                                     */}
        {/* ═══════════════════════════════════════════════════════════ */}
        <div style={{ paddingTop: 16, borderTop: `1px solid ${B.stone}`, textAlign: "center" }}>
          <p style={{ fontSize: 11, color: B.taupe, margin: 0 }}>RunPayway&#8482; &mdash; A proprietary financial diagnostic by PeopleStar Enterprises.</p>
        </div>
      </div>
    </div>
  );

}
