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

function bandColor(s: number): string {
  return s >= 75 ? B.bandHigh : s >= 50 ? B.bandEstablished : s >= 30 ? B.bandDeveloping : B.bandLimited;
}

/* ================================================================== */
/*  SECTION LABEL                                                      */
/* ================================================================== */
function SectionLabel({ children, color, sub }: { children: string; color?: string; sub?: string }) {
  return (
    <div style={{ marginBottom: 16 }}>
      <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase" as const, color: color || B.taupe }}>{children}</div>
      {sub && <p style={{ fontSize: 14, color: B.muted, margin: "6px 0 0", lineHeight: 1.6 }}>{sub}</p>}
    </div>
  );
}

/* ================================================================== */
/*  SLIDER                                                             */
/* ================================================================== */
function Slider({ label, value, min, max, step, unit, onChange, accent }: {
  label: string; value: number; min: number; max: number; step: number; unit: string; onChange: (v: number) => void; accent?: string;
}) {
  const pct = Math.max(0, Math.min(100, ((value - min) / (max - min)) * 100));
  const c = accent || B.teal;
  return (
    <div style={{ marginBottom: 24 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 8 }}>
        <span style={{ fontSize: 14, fontWeight: 600, color: B.navy }}>{label}</span>
        <div style={{ display: "flex", alignItems: "baseline", gap: 2 }}>
          <span style={{ fontSize: 18, fontWeight: 300, color: c, fontVariantNumeric: "tabular-nums" }}>{value}</span>
          <span style={{ fontSize: 12, color: B.taupe }}>{unit}</span>
        </div>
      </div>
      <div style={{ position: "relative", height: 28 }}>
        <div style={{ position: "absolute", top: 12, left: 0, right: 0, height: 4, backgroundColor: B.stone, borderRadius: 2 }} />
        <div style={{ position: "absolute", top: 12, left: 0, width: `${pct}%`, height: 4, backgroundColor: c, borderRadius: 2, transition: "width 100ms ease" }} />
        <div style={{ position: "absolute", top: 6, left: `${pct}%`, transform: "translateX(-50%)", width: 16, height: 16, borderRadius: "50%", backgroundColor: B.surface, border: `2px solid ${c}`, boxShadow: "0 1px 4px rgba(14,26,43,0.12)" }} />
        <input type="range" min={min} max={max} step={step} value={value} onChange={(e) => onChange(Number(e.target.value))} style={{ position: "absolute", top: 0, left: 0, width: "100%", height: 28, opacity: 0, cursor: "pointer", margin: 0 }} />
      </div>
      <div style={{ display: "flex", justifyContent: "space-between", marginTop: 4 }}>
        <span style={{ fontSize: 10, color: B.faint }}>{min}{unit}</span>
        <span style={{ fontSize: 10, color: B.faint }}>{max}{unit}</span>
      </div>
    </div>
  );
}

/* ================================================================== */
/*  INTERFACES                                                         */
/* ================================================================== */
interface SavedScenario {
  name: string;
  presetId: string;
  score: number;
  band: string;
  lift: number;
}

interface AssessmentSummary {
  record_id: string;
  final_score: number;
  stability_band: string;
  assessment_date_utc: string;
  issued_timestamp_utc?: string;
}

/* ================================================================== */
/*  MAIN PAGE                                                          */
/* ================================================================== */
export default function DashboardPage() {
  /* ── State ── */
  const [record, setRecord] = useState<Record<string, unknown> | null>(null);
  const [assessments, setAssessments] = useState<AssessmentSummary[]>([]);
  const [mobile, setMobile] = useState(false);
  const [demoProfile, setDemoProfile] = useState(1);
  const [accessCode, setAccessCode] = useState("");
  const [codeError, setCodeError] = useState<string | null>(null);
  const [planType, setPlanType] = useState<"single" | "monitoring">("single");
  const [assessmentsUsed, setAssessmentsUsed] = useState(1);
  const [assessmentsTotal, setAssessmentsTotal] = useState(1);

  // Quick re-score
  const [quickToggles, setQuickToggles] = useState<Record<string, boolean>>({});

  // Scenario lab
  const [activePreset, setActivePreset] = useState<string | null>(null);
  const [savedScenarios, setSavedScenarios] = useState<SavedScenario[]>([]);
  const [showSimulator, setShowSimulator] = useState(false);
  const [sliders, setSliders] = useState<{ recurrence: number; topClient: number; sources: number; monthsBooked: number; passive: number } | null>(null);

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
      const records = JSON.parse(localStorage.getItem("rp_records") || "[]") as AssessmentSummary[];
      setAssessments(records.sort((a, b) => new Date(b.assessment_date_utc || b.issued_timestamp_utc || "").getTime() - new Date(a.assessment_date_utc || a.issued_timestamp_utc || "").getTime()));
    } catch { /* */ }

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
  const fragility = v2?.fragility as { fragility_class: string; fragility_score: number } | undefined;

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

  /* ── Quick Re-Score ── */
  const quickActions = [
    { id: "client", label: "Added a new client or income source", presetId: "add_client", icon: "+" },
    { id: "retainer", label: "Signed a retainer or recurring agreement", presetId: "convert_retainer", icon: "↻" },
    { id: "passive", label: "Created passive or semi-passive income", presetId: "build_passive", icon: "◆" },
    { id: "forward", label: "Secured next quarter with commitments", presetId: "lock_forward", icon: "→" },
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

  /* ── Industry scripts ── */
  const scripts = industrySector ? getScriptsForSector(industrySector) : [];

  /* ── Zone data (PressureMap) ── */
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
    { id: "active", label: "Income That Stops", pct: activeIncome, color: B.red, lift: redResult.lift, projected: redResult.score, presetId: redPreset,
      risk: `${activeIncome}% of your income stops the moment you stop working. One disruption affects ${activeIncome}% of earnings.` },
    { id: "semi", label: "Recurring For Now", pct: semiIncome, color: B.amber, lift: 0, projected: displayScore, presetId: null as string | null,
      risk: semiIncome < 20 ? `Only ${semiIncome}% has any repeating structure.` : `${semiIncome}% repeats, but it is cancelable. Buffer, not foundation.` },
    { id: "persistent", label: "Protected Income", pct: persistentIncome, color: B.teal, lift: greenResult.lift, projected: greenResult.score, presetId: greenPreset,
      risk: persistentIncome >= 30 ? `${persistentIncome}% keeps going without you. Structural protection most professionals lack.` : `Only ${persistentIncome}% continues if you stopped working.` },
  ];

  /* ── Top moves (ranked presets) ── */
  const topMoves = SIMULATOR_PRESETS
    .filter(p => !["lose_top_client", "cant_work_90_days"].includes(p.id))
    .map(p => {
      const result = simulateScore(p.modify(baseInputs), qualityScore);
      const lift = result.overall_score - displayScore;
      const effort: string = p.id === "lock_forward" || p.id === "convert_retainer" ? "Low" : "High";
      const speed: string = p.id === "lock_forward" || p.id === "convert_retainer" ? "Fast" : "Gradual";
      return { ...p, lift, projected: result.overall_score, band: result.band, effort, speed };
    })
    .filter(p => p.lift > 0)
    .sort((a, b) => b.lift - a.lift);

  /* ── Script mapping: match presets to scripts ── */
  const getScriptForPreset = (presetId: string) => {
    if (scripts.length === 0) return null;
    if (presetId === "convert_retainer") return scripts.find(s => s.id.includes("retainer")) || scripts[0];
    if (presetId === "add_client") return scripts.find(s => s.id.includes("diversi") || s.id.includes("referral")) || scripts[1];
    if (presetId === "build_passive") return scripts[2] || scripts[0];
    if (presetId === "lock_forward") return scripts[0];
    return scripts[0];
  };

  /* ── Active scenario ── */
  const activePresetObj = SIMULATOR_PRESETS.find(p => p.id === activePreset);
  const scenarioInputs = activePresetObj ? activePresetObj.modify(baseInputs) : baseInputs;
  const scenarioResult = activePresetObj ? simulateScore(scenarioInputs, qualityScore) : baseResult;
  const scenarioDelta = activePresetObj ? scenarioResult.overall_score - displayScore : 0;
  const scenarioTimeline: TimelinePoint[] = activePresetObj ? projectTimeline(baseInputs, scenarioInputs, qualityScore) : [];

  /* ── Advanced simulator ── */
  const effectiveSliders = sliders || { recurrence: baseInputs.income_persistence_pct, topClient: baseInputs.largest_source_pct, sources: baseInputs.source_diversity_count, monthsBooked: Math.round(baseInputs.forward_secured_pct / 100 * 6 * 2) / 2, passive: 100 - baseInputs.labor_dependence_pct };
  const advInputs: CanonicalInput = sliders ? {
    income_persistence_pct: sliders.recurrence,
    largest_source_pct: sliders.sources <= 1 ? 100 : Math.max(Math.round(100 / sliders.sources), sliders.topClient),
    source_diversity_count: sliders.sources,
    forward_secured_pct: Math.min(100, Math.round(sliders.monthsBooked / 6 * 100)),
    income_variability_level: baseInputs.income_variability_level,
    labor_dependence_pct: Math.max(0, 100 - sliders.passive),
  } : baseInputs;
  const advResult = sliders ? simulateScore(advInputs, qualityScore) : baseResult;
  const advDelta = sliders ? advResult.overall_score - displayScore : 0;
  const advTimeline: TimelinePoint[] = sliders && advDelta !== 0 ? projectTimeline(baseInputs, advInputs, qualityScore) : [];

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
    { label: "Reduced your largest client below 40% of income", key: "concentration" },
    { label: "Created a passive or semi-passive income stream", key: "passive" },
  ];
  const toggleCheck = (key: string) => {
    setCheckedItems(prev => {
      const updated = prev.includes(key) ? prev.filter(k => k !== key) : [...prev, key];
      localStorage.setItem("rp_reassess_checks", JSON.stringify(updated));
      return updated;
    });
  };

  /* ── Countdown ── */
  const countdownMsg = daysSince === 0 ? "Your action plan is fresh. Start today."
    : daysSince <= 7 ? `${daysSince} days since your assessment. Plan is still new.`
    : daysSince <= 30 ? `${daysSince} days. Have you made a structural change yet?`
    : daysSince <= 60 ? `${daysSince} days at the same score. Time to take action.`
    : `${daysSince} days since your last assessment. Time to reassess.`;

  /* ── Copy script helper ── */
  const copyScript = (text: string, id: string) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopiedScript(id);
      setTimeout(() => setCopiedScript(null), 2000);
    });
  };

  /* ── Timeline renderer ── */
  const renderTimeline = (timeline: TimelinePoint[], baseScore: number) => {
    if (timeline.length === 0) return null;
    const allScores = [baseScore, ...timeline.map(t => t.score)];
    const minS = Math.min(...allScores) - 5;
    const maxS = Math.max(...allScores) + 5;
    const range = Math.max(maxS - minS, 10);
    const getY = (s: number) => 100 - ((s - minS) / range) * 100;
    const isPositive = timeline[timeline.length - 1].delta >= 0;
    const accent = isPositive ? B.teal : B.red;

    return (
      <div style={{ padding: mobile ? "20px 16px" : "24px 28px", border: `1px solid ${B.stone}`, borderRadius: 12, backgroundColor: B.surface }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 16 }}>
          <SectionLabel color={B.purple}>Projected Trajectory</SectionLabel>
          <div style={{ textAlign: "right" }}>
            <div style={{ fontSize: 22, fontWeight: 700, color: accent }}>{timeline[timeline.length - 1].delta > 0 ? "+" : ""}{timeline[timeline.length - 1].delta}</div>
            <div style={{ fontSize: 10, fontWeight: 600, color: B.taupe, letterSpacing: "0.06em" }}>12-MONTH</div>
          </div>
        </div>
        <div style={{ position: "relative", height: 120, marginBottom: 20 }}>
          <svg viewBox="0 0 400 120" style={{ width: "100%", height: "100%" }} preserveAspectRatio="none">
            <defs>
              <linearGradient id="aGrad" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor={accent} stopOpacity="0.15" /><stop offset="100%" stopColor={accent} stopOpacity="0" /></linearGradient>
            </defs>
            <path d={`M 20,${getY(baseScore) * 1.2} L 120,${getY(timeline[0].score) * 1.2} L 250,${getY(timeline[1].score) * 1.2} L 380,${getY(timeline[2].score) * 1.2} L 380,120 L 20,120 Z`} fill="url(#aGrad)" />
            <path d={`M 20,${getY(baseScore) * 1.2} L 120,${getY(timeline[0].score) * 1.2} L 250,${getY(timeline[1].score) * 1.2} L 380,${getY(timeline[2].score) * 1.2}`} fill="none" stroke={accent} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
            <circle cx="20" cy={getY(baseScore) * 1.2} r="4" fill={B.navy} stroke={B.bg} strokeWidth="2" />
            {[{ x: 120, pt: timeline[0] }, { x: 250, pt: timeline[1] }, { x: 380, pt: timeline[2] }].map(({ x, pt }) => (
              <g key={pt.month}><circle cx={x} cy={getY(pt.score) * 1.2} r="5" fill={accent} stroke={B.bg} strokeWidth="2" /></g>
            ))}
          </svg>
          <div style={{ position: "absolute", bottom: -4, left: "5%", fontSize: 10, color: B.taupe, fontWeight: 600 }}>NOW</div>
          <div style={{ position: "absolute", bottom: -4, left: "30%", transform: "translateX(-50%)", fontSize: 10, color: B.taupe }}>3 MO</div>
          <div style={{ position: "absolute", bottom: -4, left: "62.5%", transform: "translateX(-50%)", fontSize: 10, color: B.taupe }}>6 MO</div>
          <div style={{ position: "absolute", bottom: -4, right: "5%", fontSize: 10, color: B.taupe }}>12 MO</div>
        </div>
        <div style={{ display: "flex", gap: 10, flexDirection: mobile ? "column" : "row" }}>
          {timeline.map((pt) => (
            <div key={pt.month} style={{ flex: 1, padding: "12px 14px", border: `1px solid ${B.stone}`, borderRadius: 8 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                <span style={{ fontSize: 11, fontWeight: 700, color: B.taupe, letterSpacing: "0.06em" }}>{pt.label.toUpperCase()}</span>
                <span style={{ fontSize: 16, fontWeight: 700, color: pt.delta >= 0 ? B.teal : B.red }}>{pt.score}</span>
              </div>
              <p style={{ fontSize: 12, color: B.muted, margin: 0, lineHeight: 1.45 }}>{pt.narrative}</p>
            </div>
          ))}
        </div>
      </div>
    );
  };

  /* ================================================================ */
  /*  RENDER                                                           */
  /* ================================================================ */
  return (
    <div style={{ minHeight: "100vh", backgroundColor: B.bg, fontFamily: INTER }}>
      <style>{`
        @media(max-width:700px){
          .dash-2col{flex-direction:column!important;}
          .dash-3col{grid-template-columns:1fr!important;}
          .dash-metrics{flex-direction:column!important;}
          .dash-zones{flex-direction:column!important;}
          .dash-scenario-grid{grid-template-columns:1fr!important;}
          .dash-compare{flex-direction:column!important;}
          .dash-upgrade{flex-direction:column!important;}
          .dash-adv-grid{grid-template-columns:1fr!important;}
        }
      `}</style>
      <SuiteHeader current="dashboard" />

      <div style={{ maxWidth: 960, margin: "0 auto", padding: mobile ? "20px 16px 60px" : "36px 32px 80px" }}>

        {/* ═══════════════════════════════════════════════════════════ */}
        {/* DEMO CONTROLS                                              */}
        {/* ═══════════════════════════════════════════════════════════ */}
        {isDemo && (
          <div style={{ padding: "14px 20px", borderRadius: 10, backgroundColor: `${B.purple}05`, border: `1px solid ${B.purple}12`, marginBottom: 24 }}>
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
        {/* 1. SCORE COMMAND CENTER                                     */}
        {/* ═══════════════════════════════════════════════════════════ */}
        <section style={{ marginBottom: 32 }}>
          <div style={{ display: "flex", gap: 20, flexDirection: mobile ? "column" : "row" }} className="dash-2col">

            {/* Score + Band */}
            <div style={{ flex: 2, padding: mobile ? "24px 20px" : "28px 32px", border: `1px solid ${B.stone}`, borderRadius: 12, backgroundColor: B.surface }}>
              <div style={{ display: "flex", alignItems: "center", gap: 20, marginBottom: 16 }}>
                <div>
                  <AnimatedNumber value={displayScore} style={{ fontSize: 60, fontWeight: 300, color: B.navy, letterSpacing: "-0.04em", lineHeight: 1, display: "block" }} />
                  <span style={{ fontSize: 14, fontWeight: 300, color: B.taupe }}>/100</span>
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
                    <div style={{ width: 10, height: 10, borderRadius: 3, backgroundColor: bandColor(displayScore) }} />
                    <span style={{ fontSize: 16, fontWeight: 600, color: bandColor(displayScore) }}>{band || baseResult.band}</span>
                  </div>
                  <div style={{ height: 7, backgroundColor: B.stone, borderRadius: 4, overflow: "hidden", marginBottom: 8 }}>
                    <div style={{ height: "100%", borderRadius: 4, backgroundColor: bandColor(displayScore), width: `${progress}%`, transition: "width 600ms ease" }} />
                  </div>
                  <span style={{ fontSize: 13, color: B.muted }}>{gap > 0 ? `${gap} points to ${nextBandLabel}` : "Highest band achieved"}</span>
                </div>
              </div>

              {/* Benchmarking — prominent */}
              {benchmarking && (
                <div style={{ padding: "14px 18px", borderRadius: 8, backgroundColor: `${B.purple}06`, border: `1px solid ${B.purple}10` }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <div>
                      <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.10em", color: B.purple, marginBottom: 4 }}>PEER RANKING</div>
                      <div style={{ fontSize: 15, fontWeight: 600, color: B.navy }}>
                        Top {100 - benchmarking.peer_percentile}% of {benchmarking.cluster_label}
                      </div>
                    </div>
                    <div style={{ textAlign: "right" }}>
                      <div style={{ fontSize: 13, color: B.muted }}>Cluster avg: <span style={{ fontWeight: 600, color: B.navy }}>{benchmarking.cluster_average_score}</span></div>
                      <div style={{ fontSize: 13, color: displayScore > benchmarking.cluster_average_score ? B.teal : B.red, fontWeight: 600 }}>
                        {displayScore > benchmarking.cluster_average_score ? `+${displayScore - benchmarking.cluster_average_score} above` : `${displayScore - benchmarking.cluster_average_score} below`} average
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Quick metrics */}
            <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 10 }} className="dash-metrics">
              {[
                { label: "Income runway", value: continuityMonths < 1 ? "< 1 mo" : `${continuityMonths.toFixed(1)} mo`, color: continuityMonths < 3 ? B.red : B.teal },
                { label: "Top source risk", value: `−${riskDrop} pts`, color: riskDrop > 15 ? B.red : B.amber },
                { label: "Fragility", value: fragilityLabel, color: fragilityLabel === "Brittle" || fragilityLabel === "Fragile" ? B.red : fragilityLabel === "Resilient" ? B.teal : B.amber },
                { label: "Days since", value: daysSince === 0 ? "Today" : `${daysSince}d`, color: daysSince > 60 ? B.red : daysSince > 30 ? B.amber : B.teal },
              ].map((m) => (
                <div key={m.label} style={{ flex: 1, padding: "14px 18px", border: `1px solid ${B.stone}`, borderRadius: 10, backgroundColor: B.surface, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ fontSize: 13, color: B.taupe }}>{m.label}</span>
                  <span style={{ fontSize: 17, fontWeight: 300, color: m.color }}>{m.value}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Return notification */}
          {!isDemo && daysSince > 7 && (
            <div style={{ marginTop: 12, padding: "12px 18px", borderRadius: 8, border: `1px solid ${daysSince > 60 ? `${B.red}20` : `${B.teal}15`}`, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ fontSize: 13, color: B.navy }}>{countdownMsg}</span>
              {topMoves[0] && <span style={{ fontSize: 13, fontWeight: 600, color: B.teal }}>+{topMoves[0].lift} pts available</span>}
            </div>
          )}
        </section>

        {/* ═══════════════════════════════════════════════════════════ */}
        {/* 2. QUICK RE-SCORE                                          */}
        {/* ═══════════════════════════════════════════════════════════ */}
        <section style={{ marginBottom: 32, padding: mobile ? "24px 20px" : "28px 32px", border: `1px solid ${B.stone}`, borderRadius: 12, backgroundColor: B.surface }}>
          <SectionLabel color={B.teal} sub="Toggle changes you have made since your last assessment. Your score updates instantly.">
            Has Anything Changed?
          </SectionLabel>

          <div style={{ display: "flex", gap: 20, flexDirection: mobile ? "column" : "row" }} className="dash-2col">
            <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 10 }}>
              {quickActions.map((action) => (
                <button key={action.id} onClick={() => setQuickToggles(prev => ({ ...prev, [action.id]: !prev[action.id] }))}
                  style={{ display: "flex", alignItems: "center", gap: 12, padding: "12px 16px", borderRadius: 8, cursor: "pointer", border: `1px solid ${quickToggles[action.id] ? `${B.teal}30` : B.stone}`, backgroundColor: quickToggles[action.id] ? `${B.teal}06` : "transparent", transition: "all 200ms", textAlign: "left" as const }}>
                  <div style={{ width: 22, height: 22, borderRadius: 5, border: `2px solid ${quickToggles[action.id] ? B.teal : B.faint}`, backgroundColor: quickToggles[action.id] ? B.teal : "transparent", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, transition: "all 200ms" }}>
                    {quickToggles[action.id] && <span style={{ color: "#FFF", fontSize: 11, fontWeight: 700 }}>&#10003;</span>}
                  </div>
                  <span style={{ fontSize: 14, fontWeight: quickToggles[action.id] ? 600 : 400, color: quickToggles[action.id] ? B.navy : B.muted }}>{action.label}</span>
                </button>
              ))}
            </div>

            {/* Estimated score display */}
            <div style={{ flex: 0, minWidth: mobile ? "auto" : 200, textAlign: "center", padding: "24px 20px", borderRadius: 10, backgroundColor: activeQuickCount > 0 ? `${B.teal}06` : `${B.stone}`, border: `1px solid ${activeQuickCount > 0 ? `${B.teal}20` : B.stone}` }}>
              <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.10em", color: activeQuickCount > 0 ? B.teal : B.taupe, marginBottom: 12 }}>
                {activeQuickCount > 0 ? "ESTIMATED SCORE" : "YOUR SCORE"}
              </div>
              {activeQuickCount > 0 ? (
                <>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 10, marginBottom: 8 }}>
                    <span style={{ fontSize: 24, fontWeight: 300, color: B.taupe }}>{displayScore}</span>
                    <span style={{ fontSize: 18, color: B.taupe }}>→</span>
                    <span style={{ fontSize: 32, fontWeight: 300, color: B.teal }}>{quickResult.overall_score}</span>
                  </div>
                  <div style={{ fontSize: 18, fontWeight: 700, color: B.teal }}>+{quickLift} pts</div>
                  {quickResult.band !== (band || baseResult.band) && (
                    <div style={{ fontSize: 13, color: B.purple, fontWeight: 600, marginTop: 6 }}>Moves to {quickResult.band}</div>
                  )}
                </>
              ) : (
                <div style={{ fontSize: 36, fontWeight: 300, color: B.navy }}>{displayScore}</div>
              )}
              <div style={{ marginTop: 14 }}>
                <Link href="/pricing" style={{ fontSize: 13, fontWeight: 600, color: B.purple, textDecoration: "none" }}>
                  {activeQuickCount > 0 ? "Verify with full re-assessment →" : "Get a new assessment →"}
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* ═══════════════════════════════════════════════════════════ */}
        {/* 3. TOP MOVES + SCRIPTS                                     */}
        {/* ═══════════════════════════════════════════════════════════ */}
        {topMoves.length > 0 && (
          <section style={{ marginBottom: 32 }}>
            <SectionLabel color={B.purple} sub="Ranked by impact on your score. Each includes a ready-to-use script you can send today.">
              Your Top Moves
            </SectionLabel>

            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {topMoves.map((move, idx) => {
                const script = getScriptForPreset(move.id);
                const isExpanded = expandedScript === move.id;
                return (
                  <div key={move.id} style={{ border: `1px solid ${B.stone}`, borderLeft: `3px solid ${idx === 0 ? B.purple : B.teal}`, borderRadius: 10, backgroundColor: B.surface, overflow: "hidden" }}>
                    <div style={{ padding: mobile ? "18px 16px" : "20px 24px" }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 8 }}>
                        <div style={{ flex: 1 }}>
                          {idx === 0 && <span style={{ fontSize: 10, fontWeight: 700, color: B.purple, letterSpacing: "0.10em", display: "block", marginBottom: 4 }}>HIGHEST IMPACT</span>}
                          <div style={{ fontSize: 16, fontWeight: 600, color: B.navy, lineHeight: 1.3 }}>{move.label}</div>
                          <p style={{ fontSize: 14, color: B.muted, margin: "6px 0 0", lineHeight: 1.55 }}>{move.description}</p>
                        </div>
                        <div style={{ textAlign: "right", flexShrink: 0, marginLeft: 16 }}>
                          <div style={{ fontSize: 22, fontWeight: 300, color: B.teal }}>+{move.lift}</div>
                          <div style={{ fontSize: 11, color: B.taupe }}>points</div>
                        </div>
                      </div>

                      <div style={{ display: "flex", gap: 8, flexWrap: "wrap" as const, alignItems: "center" }}>
                        <span style={{ fontSize: 11, fontWeight: 600, color: B.muted, backgroundColor: `${B.stone}`, padding: "3px 10px", borderRadius: 20 }}>Effort: {move.effort}</span>
                        <span style={{ fontSize: 11, fontWeight: 600, color: B.muted, backgroundColor: `${B.stone}`, padding: "3px 10px", borderRadius: 20 }}>Speed: {move.speed}</span>
                        {move.band !== (band || baseResult.band) && (
                          <span style={{ fontSize: 11, fontWeight: 600, color: B.purple, backgroundColor: `${B.purple}08`, padding: "3px 10px", borderRadius: 20 }}>→ {move.band}</span>
                        )}
                        <div style={{ flex: 1 }} />
                        {script && (
                          <button onClick={() => setExpandedScript(isExpanded ? null : move.id)}
                            style={{ fontSize: 12, fontWeight: 600, color: B.purple, background: "none", border: `1px solid ${B.purple}18`, borderRadius: 6, padding: "6px 14px", cursor: "pointer" }}>
                            {isExpanded ? "Hide Script" : "Use This Script"} {isExpanded ? "▲" : "▼"}
                          </button>
                        )}
                        <button onClick={() => setActivePreset(move.id)}
                          style={{ fontSize: 12, fontWeight: 600, color: B.teal, background: "none", border: `1px solid ${B.teal}18`, borderRadius: 6, padding: "6px 14px", cursor: "pointer" }}>
                          See full model →
                        </button>
                      </div>
                    </div>

                    {/* Expanded script */}
                    {isExpanded && script && (
                      <div style={{ padding: mobile ? "18px 16px" : "20px 24px", borderTop: `1px solid ${B.stone}`, backgroundColor: `${B.purple}03` }}>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
                          <div>
                            <div style={{ fontSize: 13, fontWeight: 600, color: B.navy }}>{script.title}</div>
                            <div style={{ fontSize: 12, color: B.muted }}>{script.context}</div>
                          </div>
                          <button onClick={() => copyScript(script.script, script.id)}
                            style={{ fontSize: 12, fontWeight: 600, color: copiedScript === script.id ? B.teal : B.purple, backgroundColor: copiedScript === script.id ? `${B.teal}08` : `${B.purple}08`, border: "none", borderRadius: 6, padding: "8px 16px", cursor: "pointer" }}>
                            {copiedScript === script.id ? "Copied!" : "Copy Script"}
                          </button>
                        </div>
                        <pre style={{ fontSize: 13, color: B.navy, lineHeight: 1.7, whiteSpace: "pre-wrap" as const, margin: 0, padding: "16px 18px", backgroundColor: B.surface, borderRadius: 8, border: `1px solid ${B.stone}`, fontFamily: INTER }}>{script.script}</pre>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </section>
        )}

        {/* ═══════════════════════════════════════════════════════════ */}
        {/* 4. INCOME X-RAY                                            */}
        {/* ═══════════════════════════════════════════════════════════ */}
        <section style={{ marginBottom: 32 }}>
          <SectionLabel color={B.taupe} sub="Where your income comes from, what survives disruption, and what vanishes the moment you stop.">
            Income X-Ray
          </SectionLabel>

          {/* Composition bar */}
          <div style={{ border: `1px solid ${B.stone}`, borderRadius: 12, backgroundColor: B.surface, padding: mobile ? "20px 16px" : "24px 28px", marginBottom: 16 }}>
            <div style={{ display: "flex", height: 36, borderRadius: 6, overflow: "hidden", border: `1px solid ${B.stone}`, marginBottom: 10 }}>
              {zones.map((z) => z.pct > 0 ? (
                <div key={z.id} style={{ width: `${z.pct}%`, backgroundColor: `${z.color}20`, display: "flex", alignItems: "center", justifyContent: "center", borderRight: z.id !== "persistent" ? `2px solid ${B.white}` : "none" }}>
                  {z.pct >= 10 && <span style={{ fontSize: 13, fontWeight: 600, color: z.color }}>{z.pct}%</span>}
                </div>
              ) : null)}
            </div>
            <div style={{ display: "flex", gap: 16, flexWrap: "wrap" as const }}>
              {zones.map((z) => z.pct > 0 ? (
                <div key={z.id} style={{ display: "flex", alignItems: "center", gap: 6 }}>
                  <div style={{ width: 8, height: 8, borderRadius: 2, backgroundColor: z.color }} />
                  <span style={{ fontSize: 13, color: B.muted }}><span style={{ fontWeight: 600, color: z.color }}>{z.pct}%</span> {z.label.toLowerCase()}</span>
                </div>
              ) : null)}
            </div>
          </div>

          {/* Zone cards */}
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }} className="dash-zones">
            {zones.map((zone) => (
              <div key={zone.id} style={{ padding: mobile ? "18px 16px" : "20px 24px", border: `1px solid ${B.stone}`, borderLeft: `3px solid ${zone.color}`, borderRadius: 10, backgroundColor: B.surface }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 8 }}>
                  <div style={{ display: "flex", alignItems: "baseline", gap: 10 }}>
                    <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.10em", color: zone.color }}>{zone.label.toUpperCase()}</span>
                    <span style={{ fontSize: 20, fontWeight: 300, color: zone.color }}>{zone.pct}%</span>
                  </div>
                  {zone.lift > 0 && <span style={{ fontSize: 15, fontWeight: 600, color: B.teal }}>+{zone.lift} pts if fixed</span>}
                </div>
                <p style={{ fontSize: 14, color: B.navy, margin: 0, lineHeight: 1.6 }}>{zone.risk}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ═══════════════════════════════════════════════════════════ */}
        {/* 5. SCENARIO LAB                                            */}
        {/* ═══════════════════════════════════════════════════════════ */}
        <section style={{ marginBottom: 32 }}>
          <SectionLabel color={B.teal} sub="Test changes before you make them. Save up to 3 paths and compare them side by side.">
            Scenario Lab
          </SectionLabel>

          {/* Preset cards */}
          <div style={{ display: "grid", gridTemplateColumns: mobile ? "1fr" : "repeat(3, 1fr)", gap: 10, marginBottom: 20 }} className="dash-scenario-grid">
            {SIMULATOR_PRESETS.map((preset) => {
              const result = simulateScore(preset.modify(baseInputs), qualityScore);
              const lift = result.overall_score - displayScore;
              const isActive = activePreset === preset.id;
              const isNeg = lift < 0;
              return (
                <button key={preset.id} onClick={() => setActivePreset(isActive ? null : preset.id)}
                  style={{ padding: "16px 18px", textAlign: "left" as const, borderRadius: 10, cursor: "pointer", transition: "all 200ms", border: `1px solid ${isActive ? (isNeg ? B.red : B.purple) + "44" : B.stone}`, backgroundColor: isActive ? (isNeg ? `${B.red}06` : `${B.purple}08`) : B.surface, boxShadow: isActive ? `0 4px 16px ${isNeg ? "rgba(220,74,74,0.08)" : "rgba(75,63,174,0.10)"}` : "none" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                    <span style={{ fontSize: 14, fontWeight: 600, color: isActive ? B.navy : B.muted }}>{preset.label}</span>
                    <span style={{ fontSize: 15, fontWeight: 700, color: lift >= 0 ? B.teal : B.red, fontFamily: INTER }}>{lift > 0 ? "+" : ""}{lift}</span>
                  </div>
                  <p style={{ fontSize: 12, color: B.taupe, margin: 0, lineHeight: 1.45 }}>{preset.description}</p>
                </button>
              );
            })}
          </div>

          {/* Active scenario detail */}
          {activePreset && activePresetObj && (
            <div style={{ padding: mobile ? "20px 16px" : "24px 28px", border: `1px solid ${B.stone}`, borderRadius: 12, backgroundColor: B.surface, marginBottom: 16 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 }}>
                <div>
                  <div style={{ fontSize: 17, fontWeight: 600, color: B.navy, marginBottom: 4 }}>{activePresetObj.label}</div>
                  <div style={{ fontSize: 22, fontWeight: 300, color: scenarioDelta >= 0 ? B.teal : B.red }}>
                    {scenarioDelta > 0 ? "+" : ""}{scenarioDelta} points → {scenarioResult.overall_score}/100
                  </div>
                  {scenarioResult.band !== (band || baseResult.band) && (
                    <div style={{ fontSize: 14, fontWeight: 600, color: B.purple, marginTop: 4 }}>Moves to {scenarioResult.band}</div>
                  )}
                </div>
                {savedScenarios.length < 3 && scenarioDelta !== 0 && (
                  <button onClick={() => {
                    setSavedScenarios(prev => [...prev, { name: activePresetObj.label, presetId: activePreset, score: scenarioResult.overall_score, band: scenarioResult.band, lift: scenarioDelta }]);
                  }} style={{ fontSize: 12, fontWeight: 600, color: B.teal, backgroundColor: `${B.teal}08`, border: `1px solid ${B.teal}18`, borderRadius: 6, padding: "8px 16px", cursor: "pointer", whiteSpace: "nowrap" as const }}>
                    Save Path ({3 - savedScenarios.length} left)
                  </button>
                )}
              </div>
            </div>
          )}

          {/* Scenario timeline */}
          {activePreset && scenarioTimeline.length > 0 && (
            <div style={{ marginBottom: 16 }}>
              {renderTimeline(scenarioTimeline, displayScore)}
            </div>
          )}

          {/* Saved scenarios comparison */}
          {savedScenarios.length > 0 && (
            <div style={{ padding: mobile ? "20px 16px" : "24px 28px", border: `1px solid ${B.stone}`, borderRadius: 12, backgroundColor: B.surface, marginBottom: 16 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
                <SectionLabel color={B.purple}>Compare Your Paths</SectionLabel>
                <button onClick={() => setSavedScenarios([])} style={{ fontSize: 12, color: B.muted, background: "none", border: "none", cursor: "pointer", textDecoration: "underline" }}>Clear all</button>
              </div>
              <div style={{ display: "flex", gap: 12 }} className="dash-compare">
                {/* Current baseline */}
                <div style={{ flex: 1, padding: "18px 16px", borderRadius: 10, border: `1px solid ${B.stone}`, textAlign: "center" as const }}>
                  <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.10em", color: B.taupe, marginBottom: 8 }}>CURRENT</div>
                  <div style={{ fontSize: 32, fontWeight: 300, color: B.navy }}>{displayScore}</div>
                  <div style={{ fontSize: 12, fontWeight: 600, color: bandColor(displayScore), marginTop: 4 }}>{band || baseResult.band}</div>
                </div>
                {savedScenarios.map((s, i) => (
                  <div key={i} style={{ flex: 1, padding: "18px 16px", borderRadius: 10, border: `1px solid ${B.teal}20`, backgroundColor: `${B.teal}04`, textAlign: "center" as const, position: "relative" }}>
                    <button onClick={() => setSavedScenarios(prev => prev.filter((_, j) => j !== i))} style={{ position: "absolute", top: 6, right: 8, fontSize: 14, color: B.taupe, background: "none", border: "none", cursor: "pointer" }}>×</button>
                    <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.10em", color: B.teal, marginBottom: 8 }}>PATH {String.fromCharCode(65 + i)}</div>
                    <div style={{ fontSize: 32, fontWeight: 300, color: B.teal }}>{s.score}</div>
                    <div style={{ fontSize: 12, fontWeight: 600, color: bandColor(s.score), marginTop: 4 }}>{s.band}</div>
                    <div style={{ fontSize: 14, fontWeight: 600, color: B.teal, marginTop: 6 }}>+{s.lift}</div>
                    <div style={{ fontSize: 11, color: B.muted, marginTop: 4, lineHeight: 1.3 }}>{s.name}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Advanced Simulator toggle */}
          <button onClick={() => {
            setShowSimulator(!showSimulator);
            if (!sliders) {
              setSliders({ recurrence: baseInputs.income_persistence_pct, topClient: baseInputs.largest_source_pct, sources: baseInputs.source_diversity_count, monthsBooked: Math.round(baseInputs.forward_secured_pct / 100 * 6 * 2) / 2, passive: 100 - baseInputs.labor_dependence_pct });
            }
          }} style={{ width: "100%", padding: "16px 20px", borderRadius: 10, border: `1px solid ${B.stone}`, backgroundColor: B.surface, cursor: "pointer", display: "flex", justifyContent: "space-between", alignItems: "center", transition: "all 200ms" }}>
            <div style={{ textAlign: "left" as const }}>
              <div style={{ fontSize: 14, fontWeight: 600, color: B.navy }}>Advanced Simulator</div>
              <div style={{ fontSize: 13, color: B.muted }}>Drag sliders to build a custom scenario with precise control</div>
            </div>
            <span style={{ fontSize: 16, color: B.purple, fontWeight: 600 }}>{showSimulator ? "▲" : "▼"}</span>
          </button>

          {/* Advanced simulator panel */}
          {showSimulator && sliders && (
            <div style={{ marginTop: 12, padding: mobile ? "20px 16px" : "24px 28px", border: `1px solid ${B.stone}`, borderRadius: 12, backgroundColor: B.surface }}>
              <div style={{ display: "grid", gridTemplateColumns: mobile ? "1fr" : "1fr 1fr", gap: 32 }} className="dash-adv-grid">
                {/* Sliders */}
                <div>
                  <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.10em", color: B.faint, marginBottom: 20 }}>INCOME STRUCTURE</div>
                  <Slider label="Recurring revenue" value={sliders.recurrence} min={0} max={100} step={5} unit="%" onChange={(v) => setSliders({ ...sliders, recurrence: v })} />
                  <Slider label="Top client share" value={sliders.topClient} min={sliders.sources <= 1 ? 100 : 10} max={100} step={5} unit="%" onChange={(v) => setSliders({ ...sliders, topClient: v })} accent={B.amber} />
                  <Slider label="Income sources" value={sliders.sources} min={1} max={8} step={1} unit="" onChange={(v) => setSliders({ ...sliders, sources: v, topClient: v <= 1 ? 100 : Math.min(sliders.topClient, 100) })} />

                  <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.10em", color: B.faint, marginBottom: 20, marginTop: 8 }}>PREDICTABILITY & RESILIENCE</div>
                  <Slider label="Months booked ahead" value={sliders.monthsBooked} min={0} max={6} step={0.5} unit=" mo" onChange={(v) => setSliders({ ...sliders, monthsBooked: v })} accent={B.bandEstablished} />
                  <Slider label="Passive income" value={sliders.passive} min={0} max={100} step={5} unit="%" onChange={(v) => setSliders({ ...sliders, passive: v })} accent={B.purple} />

                  <button onClick={() => setSliders({ recurrence: baseInputs.income_persistence_pct, topClient: baseInputs.largest_source_pct, sources: baseInputs.source_diversity_count, monthsBooked: Math.round(baseInputs.forward_secured_pct / 100 * 6 * 2) / 2, passive: 100 - baseInputs.labor_dependence_pct })}
                    style={{ fontSize: 12, color: B.muted, background: "none", border: "none", cursor: "pointer", textDecoration: "underline", padding: 0 }}>
                    Reset to current
                  </button>
                </div>

                {/* Results */}
                <div>
                  <div style={{ textAlign: "center", padding: "24px 20px", borderRadius: 10, backgroundColor: advDelta !== 0 ? (advDelta > 0 ? `${B.teal}06` : `${B.red}04`) : `${B.stone}`, border: `1px solid ${advDelta > 0 ? `${B.teal}20` : advDelta < 0 ? `${B.red}15` : B.stone}`, marginBottom: 16 }}>
                    <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.10em", color: advDelta > 0 ? B.teal : advDelta < 0 ? B.red : B.taupe, marginBottom: 10 }}>
                      {advDelta !== 0 ? "SIMULATED SCORE" : "BASELINE SCORE"}
                    </div>
                    <div style={{ fontSize: 48, fontWeight: 300, color: advDelta > 0 ? B.teal : advDelta < 0 ? B.red : B.navy, lineHeight: 1 }}>
                      {advResult.overall_score}
                    </div>
                    <div style={{ fontSize: 13, fontWeight: 600, color: bandColor(advResult.overall_score), marginTop: 8 }}>{advResult.band}</div>
                    {advDelta !== 0 && (
                      <div style={{ fontSize: 18, fontWeight: 700, color: advDelta > 0 ? B.teal : B.red, marginTop: 8 }}>
                        {advDelta > 0 ? "+" : ""}{advDelta} pts
                      </div>
                    )}
                  </div>

                  {/* Stress tests */}
                  <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.10em", color: B.faint, marginBottom: 10 }}>STRESS TESTS</div>
                  {[
                    { label: "Lose top client", drop: stressLC.overall_score - displayScore },
                    { label: "Can't work 90 days", drop: stressNW.overall_score - displayScore },
                    { label: "Income runway", value: `${Math.round(baseResult.continuity_months * 30)}d`, isRunway: true },
                    { label: "Fragility", value: fragilityLabel, isFrag: true },
                  ].map((row) => (
                    <div key={row.label} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 14px", border: `1px solid ${B.stone}`, borderRadius: 8, marginBottom: 6 }}>
                      <span style={{ fontSize: 13, color: B.muted }}>{row.label}</span>
                      {"drop" in row && <span style={{ fontSize: 14, fontWeight: 600, color: B.red }}>{row.drop}</span>}
                      {"isRunway" in row && <span style={{ fontSize: 14, fontWeight: 600, color: baseResult.continuity_months < 1 ? B.red : B.teal }}>{row.value}</span>}
                      {"isFrag" in row && <span style={{ fontSize: 14, fontWeight: 600, color: fragilityLabel === "Brittle" || fragilityLabel === "Fragile" ? B.red : B.teal }}>{row.value}</span>}
                    </div>
                  ))}
                </div>
              </div>

              {/* Advanced timeline */}
              {advTimeline.length > 0 && (
                <div style={{ marginTop: 20 }}>
                  {renderTimeline(advTimeline, displayScore)}
                </div>
              )}
            </div>
          )}
        </section>

        {/* ═══════════════════════════════════════════════════════════ */}
        {/* 6. REASSESSMENT & PROGRESS                                 */}
        {/* ═══════════════════════════════════════════════════════════ */}
        <section style={{ marginBottom: 32 }}>
          <div style={{ display: "flex", gap: 16, flexDirection: mobile ? "column" : "row" }} className="dash-2col">

            {/* Reassessment readiness */}
            <div style={{ flex: 1, padding: mobile ? "20px 16px" : "24px 24px", border: `1px solid ${B.stone}`, borderRadius: 12, backgroundColor: B.surface }}>
              <SectionLabel color={B.taupe}>Reassessment Readiness</SectionLabel>
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {reassessChecks.map((check) => (
                  <div key={check.key} onClick={() => toggleCheck(check.key)}
                    style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 14px", borderRadius: 7, cursor: "pointer", border: `1px solid ${checkedItems.includes(check.key) ? `${B.teal}25` : B.stone}`, transition: "all 150ms" }}>
                    <div style={{ width: 18, height: 18, borderRadius: 4, border: `2px solid ${checkedItems.includes(check.key) ? B.teal : B.faint}`, backgroundColor: checkedItems.includes(check.key) ? B.teal : "transparent", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                      {checkedItems.includes(check.key) && <span style={{ color: "#FFF", fontSize: 10, fontWeight: 700 }}>&#10003;</span>}
                    </div>
                    <span style={{ fontSize: 13, color: checkedItems.includes(check.key) ? B.navy : B.muted }}>{check.label}</span>
                  </div>
                ))}
              </div>
              {checkedItems.length >= 2 && (
                <div style={{ marginTop: 12, padding: "12px 16px", borderRadius: 7, backgroundColor: `${B.teal}06`, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ fontSize: 13, fontWeight: 600, color: B.teal }}>You may be ready to reassess.</span>
                  <Link href="/pricing" style={{ fontSize: 12, fontWeight: 600, color: B.purple, textDecoration: "none" }}>New assessment →</Link>
                </div>
              )}
            </div>

            {/* Score history + plan */}
            <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 12 }}>
              {/* Score comparison */}
              {assessments.length >= 2 && (() => {
                const diff = assessments[0].final_score - assessments[1].final_score;
                return (
                  <div style={{ padding: "18px 22px", border: `1px solid ${diff > 0 ? `${B.teal}20` : B.stone}`, borderRadius: 10, backgroundColor: B.surface, display: "flex", alignItems: "center", gap: 16 }}>
                    <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.10em", color: B.taupe }}>SCORE HISTORY</div>
                    <span style={{ fontSize: 22, fontWeight: 300, color: B.taupe }}>{assessments[1].final_score}</span>
                    <span style={{ color: B.taupe }}>→</span>
                    <span style={{ fontSize: 22, fontWeight: 300, color: B.navy }}>{assessments[0].final_score}</span>
                    <span style={{ fontSize: 16, fontWeight: 600, color: diff > 0 ? B.teal : diff < 0 ? B.red : B.taupe }}>{diff > 0 ? "+" : ""}{diff}</span>
                  </div>
                );
              })()}

              {/* Plan status */}
              <div style={{ padding: "14px 22px", border: `1px solid ${B.stone}`, borderRadius: 10, backgroundColor: B.surface, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                {planType === "monitoring" ? (
                  <>
                    <span style={{ fontSize: 13, color: B.navy }}>Assessment {assessmentsUsed}/{assessmentsTotal} · 12-month plan</span>
                    <div style={{ height: 5, width: 70, backgroundColor: B.stone, borderRadius: 3, overflow: "hidden" }}><div style={{ height: "100%", borderRadius: 3, backgroundColor: B.teal, width: `${(assessmentsUsed / assessmentsTotal) * 100}%` }} /></div>
                  </>
                ) : (
                  <span style={{ fontSize: 13, color: B.muted }}>Single assessment · <Link href="/pricing" style={{ color: B.purple, fontWeight: 600, textDecoration: "none" }}>Upgrade to monitoring plan</Link></span>
                )}
              </div>

              {/* Days counter */}
              <div style={{ padding: "14px 22px", border: `1px solid ${B.stone}`, borderRadius: 10, backgroundColor: B.surface }}>
                <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.10em", color: daysSince > 60 ? B.red : B.taupe, marginBottom: 4 }}>
                  {daysSince > 0 ? `${daysSince} DAYS SINCE ASSESSMENT` : "ASSESSMENT FRESH"}
                </div>
                <p style={{ fontSize: 13, color: B.muted, margin: 0, lineHeight: 1.5 }}>{countdownMsg}</p>
              </div>

              {/* Download data */}
              {!isDemo && (
                <button onClick={() => {
                  const stored = sessionStorage.getItem("rp_record") || localStorage.getItem("rp_record");
                  if (!stored) return;
                  const blob = new Blob([stored], { type: "application/json" });
                  const url = URL.createObjectURL(blob);
                  const a = document.createElement("a"); a.href = url; a.download = "runpayway-assessment.json"; a.click();
                  URL.revokeObjectURL(url);
                }} style={{ fontSize: 12, fontWeight: 500, color: B.taupe, background: "none", border: `1px solid ${B.stone}`, borderRadius: 7, padding: "10px 18px", cursor: "pointer", textAlign: "center" as const }}>
                  Download Assessment Data (JSON)
                </button>
              )}
            </div>
          </div>
        </section>

        {/* ═══════════════════════════════════════════════════════════ */}
        {/* 7. UPGRADE YOUR EXPERIENCE                                 */}
        {/* ═══════════════════════════════════════════════════════════ */}
        <section style={{ marginBottom: 32 }}>
          <div style={{ display: "flex", gap: 16, flexDirection: mobile ? "column" : "row" }} className="dash-upgrade">

            {/* Subscription tier */}
            <div style={{ flex: 1, padding: mobile ? "24px 20px" : "28px 28px", borderRadius: 12, border: `1px solid ${B.purple}15`, background: `linear-gradient(135deg, ${B.purple}06 0%, ${B.teal}04 100%)` }}>
              <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.10em", color: B.purple, marginBottom: 6 }}>MONTHLY ACCESS</div>
              <div style={{ fontSize: 22, fontWeight: 600, color: B.navy, marginBottom: 4 }}>Keep Your Tools Live</div>
              <div style={{ display: "flex", alignItems: "baseline", gap: 4, marginBottom: 16 }}>
                <span style={{ fontSize: 28, fontWeight: 700, color: B.purple }}>$19</span>
                <span style={{ fontSize: 14, color: B.muted }}>/month</span>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 20 }}>
                {["Live Dashboard with updated insights", "Quarterly automatic re-scoring", "Updated PressureMap when markets shift", "Full Simulator access with new scenarios", "Priority support"].map(f => (
                  <div key={f} style={{ display: "flex", alignItems: "flex-start", gap: 8 }}>
                    <span style={{ color: B.teal, fontWeight: 700, flexShrink: 0, marginTop: 1 }}>&#10003;</span>
                    <span style={{ fontSize: 14, color: B.navy, lineHeight: 1.4 }}>{f}</span>
                  </div>
                ))}
              </div>
              <Link href="/pricing" style={{ display: "block", padding: "14px 24px", borderRadius: 10, textAlign: "center" as const, background: `linear-gradient(135deg, ${B.purple} 0%, ${B.teal} 100%)`, color: B.white, fontSize: 15, fontWeight: 600, textDecoration: "none", boxShadow: "0 4px 16px rgba(75,63,174,0.20)" }}>
                Start Monthly Access →
              </Link>
            </div>

            {/* Advisor channel */}
            <div style={{ flex: 1, padding: mobile ? "24px 20px" : "28px 28px", borderRadius: 12, border: `1px solid ${B.teal}15`, backgroundColor: B.surface }}>
              <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.10em", color: B.teal, marginBottom: 6 }}>FOR ADVISORS</div>
              <div style={{ fontSize: 22, fontWeight: 600, color: B.navy, marginBottom: 4 }}>Run Assessments for Clients</div>
              <div style={{ display: "flex", alignItems: "baseline", gap: 4, marginBottom: 16 }}>
                <span style={{ fontSize: 28, fontWeight: 700, color: B.teal }}>$29</span>
                <span style={{ fontSize: 14, color: B.muted }}>/month per seat</span>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 20 }}>
                {["White-label reports with your branding", "Client portal for intake and delivery", "Bulk assessment management", "Advisor dashboard with client overview", "Priority onboarding and support"].map(f => (
                  <div key={f} style={{ display: "flex", alignItems: "flex-start", gap: 8 }}>
                    <span style={{ color: B.teal, fontWeight: 700, flexShrink: 0, marginTop: 1 }}>&#10003;</span>
                    <span style={{ fontSize: 14, color: B.navy, lineHeight: 1.4 }}>{f}</span>
                  </div>
                ))}
              </div>
              <Link href="/pricing" style={{ display: "block", padding: "14px 24px", borderRadius: 10, textAlign: "center" as const, border: `2px solid ${B.teal}`, color: B.teal, fontSize: 15, fontWeight: 600, textDecoration: "none" }}>
                Learn About Advisor Access →
              </Link>
            </div>
          </div>

          {/* RunPayway Verified badge */}
          <div style={{ marginTop: 16, padding: mobile ? "24px 20px" : "24px 28px", borderRadius: 12, border: `1px solid ${B.stone}`, backgroundColor: B.surface, display: "flex", gap: 20, alignItems: mobile ? "stretch" : "center", flexDirection: mobile ? "column" : "row" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 14, flex: 1 }}>
              <div style={{ width: 56, height: 56, borderRadius: 14, background: `linear-gradient(135deg, ${B.navy} 0%, ${B.purple} 100%)`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <span style={{ color: B.white, fontSize: 20, fontWeight: 700 }}>&#10003;</span>
              </div>
              <div>
                <div style={{ fontSize: 16, fontWeight: 600, color: B.navy }}>RunPayway Verified</div>
                <p style={{ fontSize: 14, color: B.muted, margin: "4px 0 0", lineHeight: 1.5 }}>
                  Display your stability score on your website and LinkedIn. Free social proof for you, free marketing for us.
                  {displayScore >= 50 && <span style={{ fontWeight: 600, color: B.teal }}> Your score qualifies.</span>}
                </p>
              </div>
            </div>
            <Link href="/pricing" style={{ padding: "12px 22px", borderRadius: 8, border: `1px solid ${B.purple}20`, color: B.purple, fontSize: 14, fontWeight: 600, textDecoration: "none", textAlign: "center" as const, whiteSpace: "nowrap" as const }}>
              Get Your Badge →
            </Link>
          </div>
        </section>

        {/* ═══════════════════════════════════════════════════════════ */}
        {/* FOOTER                                                     */}
        {/* ═══════════════════════════════════════════════════════════ */}
        <div style={{ paddingTop: 16, borderTop: `1px solid ${B.stone}`, textAlign: "center" }}>
          <p style={{ fontSize: 11, color: B.taupe, margin: 0, fontStyle: "italic" }}>RunPayway&#8482; Command Center &mdash; A proprietary platform by PeopleStar Enterprises.</p>
        </div>
      </div>
    </div>
  );
}
