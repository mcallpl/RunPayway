"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import { simulateScore, SIMULATOR_PRESETS, projectTimeline } from "@/lib/engine/v2/simulate";
import type { CanonicalInput } from "@/lib/engine/v2/types";
import type { TimelinePoint } from "@/lib/engine/v2/simulate";
import { getScriptsForSector } from "@/lib/action-scripts";
import SuiteHeader from "@/components/SuiteHeader";
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
function bc(s: number): string { return s >= 75 ? B.bandHigh : s >= 50 ? B.bandEstablished : s >= 30 ? B.bandDeveloping : B.bandLimited; }
function formatIndustry(s: string): string { return s.replace(/_/g, " ").replace(/\b\w/g, c => c.toUpperCase()); }

/* ================================================================== */
/*  SCORE RING — SVG animated gauge                                    */
/* ================================================================== */
function ScoreRing({ score, size = 160, stroke = 10 }: { score: number; size?: number; stroke?: number }) {
  const r = (size - stroke) / 2;
  const circ = 2 * Math.PI * r;
  const pct = Math.min(100, Math.max(0, score));
  const offset = circ - (pct / 100) * circ;
  const color = bc(score);
  const bandLabel = score >= 75 ? "High" : score >= 50 ? "Established" : score >= 30 ? "Developing" : "Limited";

  return (
    <div style={{ position: "relative", width: size, height: size, flexShrink: 0 }}>
      <svg width={size} height={size} style={{ transform: "rotate(-90deg)" }}>
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={B.stone} strokeWidth={stroke} />
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={color} strokeWidth={stroke}
          strokeDasharray={circ} strokeDashoffset={offset} strokeLinecap="round"
          style={{ transition: "stroke-dashoffset 1.2s cubic-bezier(0.22, 1, 0.36, 1), stroke 0.4s" }} />
      </svg>
      <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
        <span style={{ fontSize: size * 0.28, fontWeight: 300, color: B.navy, lineHeight: 1, letterSpacing: "-0.04em" }}>{score}</span>
        <span style={{ fontSize: size * 0.075, fontWeight: 600, color, marginTop: 4, letterSpacing: "0.04em" }}>{bandLabel}</span>
      </div>
    </div>
  );
}

/* ================================================================== */
/*  PHASE SEPARATOR                                                    */
/* ================================================================== */
function PhaseSep({ label, color }: { label: string; color: string }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 14, margin: "40px 0 20px" }}>
      <div style={{ height: 1, flex: 1, backgroundColor: B.stone }} />
      <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.14em", color, textTransform: "uppercase" as const, whiteSpace: "nowrap" as const }}>{label}</span>
      <div style={{ height: 1, flex: 1, backgroundColor: B.stone }} />
    </div>
  );
}

/* ================================================================== */
/*  INDUSTRY CONTEXT                                                   */
/* ================================================================== */
const INDUSTRY_INSIGHTS: Record<string, { general: string; redAvg: number; greenAvg: number }> = {
  consulting: { general: "In consulting, 72% of income instability comes from client concentration and project-based billing.", redAvg: 55, greenAvg: 12 },
  consulting_professional_services: { general: "In professional services, firms with 3+ retainer clients score 40% higher on average.", redAvg: 52, greenAvg: 15 },
  real_estate: { general: "In real estate, agents with recurring property management income score 2x higher than transaction-only.", redAvg: 65, greenAvg: 8 },
  technology: { general: "In tech, professionals with SaaS or licensing revenue score 35% higher than project-based billing.", redAvg: 48, greenAvg: 18 },
  healthcare: { general: "In healthcare, practitioners with membership models average 28 points higher than fee-for-service.", redAvg: 58, greenAvg: 10 },
  sales_brokerage: { general: "In sales, brokers with managed account channels score 45% higher than pure commission earners.", redAvg: 62, greenAvg: 8 },
  finance_banking: { general: "In finance, advisors with AUM-based recurring fees score 50% higher than transaction-based.", redAvg: 45, greenAvg: 20 },
  insurance: { general: "In insurance, agents with renewal books score 38% higher than those dependent on new policy sales.", redAvg: 50, greenAvg: 18 },
  legal_services: { general: "In legal services, firms with general counsel retainers average 32 points higher than hourly billing.", redAvg: 58, greenAvg: 10 },
  creative_media: { general: "In creative work, professionals with licensing or royalty income score 40% higher than project-only.", redAvg: 60, greenAvg: 10 },
  education_training: { general: "In education, trainers with course licensing or subscriptions score 35% higher than per-session.", redAvg: 55, greenAvg: 12 },
  fitness_wellness: { general: "In fitness, coaches with membership models average 30 points higher than session-based billing.", redAvg: 62, greenAvg: 8 },
  construction_trades: { general: "In trades, contractors with maintenance agreements score 28 points higher than bid-only.", redAvg: 68, greenAvg: 6 },
  default: { general: "Across all sectors, professionals with at least one recurring income source score 35% higher.", redAvg: 58, greenAvg: 12 },
};

/* ================================================================== */
/*  CONSTRAINT NARRATIVES                                              */
/* ================================================================== */
function getConstraintNarrative(constraint: string, inputs: CanonicalInput): string {
  const n: Record<string, string> = {
    high_concentration: `Your largest source represents ${inputs.largest_source_pct}% of income. If that single relationship changes, ${inputs.largest_source_pct}% of your revenue disappears in one decision.`,
    weak_forward_visibility: `Only ${inputs.forward_secured_pct}% of your income is committed forward. You are re-selling your time every month.`,
    high_labor_dependence: `${inputs.labor_dependence_pct}% of your income requires your active daily work. A 90-day disruption stops ${inputs.labor_dependence_pct}% of income.`,
    low_persistence: `Only ${inputs.income_persistence_pct}% of your income repeats automatically. The rest must be re-earned from scratch each month.`,
    low_source_diversity: `You have ${inputs.source_diversity_count} income source${inputs.source_diversity_count === 1 ? "" : "s"}. A single client decision has outsized power over your stability.`,
    high_variability: `Your income variability is ${inputs.income_variability_level}. Month-to-month swings make it harder to plan, save, and invest.`,
  };
  return n[constraint] || "Your primary structural constraint is limiting your score.";
}

/* ================================================================== */
/*  SHARE SCORE — Canvas to PNG                                        */
/* ================================================================== */
function generateScoreImage(score: number, bandLabel: string, name: string, color: string): Promise<string> {
  return new Promise((resolve) => {
    const canvas = document.createElement("canvas");
    canvas.width = 600;
    canvas.height = 320;
    const ctx = canvas.getContext("2d")!;

    // Background
    ctx.fillStyle = "#0E1A2B";
    ctx.beginPath();
    ctx.roundRect(0, 0, 600, 320, 16);
    ctx.fill();

    // Score ring
    const cx = 150, cy = 160, r = 60, lw = 8;
    ctx.beginPath(); ctx.arc(cx, cy, r, 0, Math.PI * 2); ctx.strokeStyle = "rgba(255,255,255,0.08)"; ctx.lineWidth = lw; ctx.stroke();
    ctx.beginPath(); ctx.arc(cx, cy, r, -Math.PI / 2, -Math.PI / 2 + (score / 100) * Math.PI * 2); ctx.strokeStyle = color; ctx.lineWidth = lw; ctx.lineCap = "round"; ctx.stroke();

    // Score text
    ctx.fillStyle = "#FFFFFF"; ctx.font = "300 48px Inter, system-ui, sans-serif"; ctx.textAlign = "center"; ctx.fillText(String(score), cx, cy + 16);
    ctx.fillStyle = color; ctx.font = "600 11px Inter, system-ui, sans-serif"; ctx.fillText(bandLabel.toUpperCase(), cx, cy + 36);

    // Right side text
    ctx.textAlign = "left";
    ctx.fillStyle = "rgba(255,255,255,0.4)"; ctx.font = "600 10px Inter, system-ui, sans-serif"; ctx.letterSpacing = "0.12em";
    ctx.fillText("INCOME STABILITY SCORE", 260, 100);
    ctx.fillStyle = "#FFFFFF"; ctx.font = "600 22px Inter, system-ui, sans-serif";
    ctx.fillText(name || "RunPayway Assessment", 260, 132);
    ctx.fillStyle = color; ctx.font = "600 16px Inter, system-ui, sans-serif";
    ctx.fillText(bandLabel, 260, 162);
    ctx.fillStyle = "rgba(255,255,255,0.3)"; ctx.font = "400 12px Inter, system-ui, sans-serif";
    ctx.fillText("Assessed by RunPayway\u2122 \u00b7 Model RP-2.0", 260, 200);

    // Logo area
    ctx.fillStyle = "rgba(255,255,255,0.15)"; ctx.font = "700 11px Inter, system-ui, sans-serif";
    ctx.fillText("RUNPAYWAY\u2122", 260, 270);

    resolve(canvas.toDataURL("image/png"));
  });
}

/* ================================================================== */
/*  MAIN PAGE                                                          */
/* ================================================================== */
export default function DashboardPage() {
  const [record, setRecord] = useState<Record<string, unknown> | null>(null);
  const [assessments, setAssessments] = useState<{ record_id: string; final_score: number; stability_band: string; assessment_date_utc: string; issued_timestamp_utc?: string }[]>([]);
  const [mobile, setMobile] = useState(false);
  const [demoProfile, setDemoProfile] = useState(1);
  const [accessCode, setAccessCode] = useState("");
  const [codeError, setCodeError] = useState<string | null>(null);

  // Welcome
  const [showWelcome, setShowWelcome] = useState(false);

  // Quick progress
  const [quickToggles, setQuickToggles] = useState<Record<string, boolean>>({});

  // Scenario
  const [activePreset, setActivePreset] = useState<string | null>(null);
  const [savedScenarios, setSavedScenarios] = useState<{ name: string; score: number; band: string; lift: number }[]>([]);

  // Scripts
  const [expandedScript, setExpandedScript] = useState<string | null>(null);
  const [copiedScript, setCopiedScript] = useState<string | null>(null);

  // Roadmap tracking
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);

  // Reassessment
  const [checkedItems, setCheckedItems] = useState<string[]>([]);

  // Share
  const [shareUrl, setShareUrl] = useState<string | null>(null);

  const shareRef = useRef<HTMLAnchorElement>(null);

  useEffect(() => {
    const check = () => setMobile(window.innerWidth <= 700);
    check(); window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  useEffect(() => {
    let stored = sessionStorage.getItem("rp_record");
    if (!stored) stored = localStorage.getItem("rp_record");
    if (stored) { try { setRecord(JSON.parse(stored)); } catch { /* */ } }
    try { const records = JSON.parse(localStorage.getItem("rp_records") || "[]"); setAssessments(records.sort((a: { assessment_date_utc: string; issued_timestamp_utc?: string }, b: { assessment_date_utc: string; issued_timestamp_utc?: string }) => new Date(b.assessment_date_utc || b.issued_timestamp_utc || "").getTime() - new Date(a.assessment_date_utc || a.issued_timestamp_utc || "").getTime())); } catch { /* */ }
    try { setCheckedItems(JSON.parse(localStorage.getItem("rp_reassess_checks") || "[]")); } catch { /* */ }
    try { setCompletedSteps(JSON.parse(localStorage.getItem("rp_roadmap_steps") || "[]")); } catch { /* */ }

    // First visit detection
    if (!localStorage.getItem("rp_cc_visited")) { setShowWelcome(true); localStorage.setItem("rp_cc_visited", "1"); }
  }, []);

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
  const customerName = (r?.assessment_title as string) || "";
  const fragilityLabel = fragility?.fragility_class ? fragility.fragility_class.charAt(0).toUpperCase() + fragility.fragility_class.slice(1) : "—";
  const industryLabel = industrySector ? formatIndustry(industrySector) : "";

  const baseInputs: CanonicalInput = ni ? {
    income_persistence_pct: ni.income_persistence_pct as number, largest_source_pct: ni.largest_source_pct as number, source_diversity_count: ni.source_diversity_count as number, forward_secured_pct: ni.forward_secured_pct as number, income_variability_level: (ni.income_variability_level || "moderate") as CanonicalInput["income_variability_level"], labor_dependence_pct: ni.labor_dependence_pct as number,
  } : { income_persistence_pct: 25, largest_source_pct: 60, source_diversity_count: 2, forward_secured_pct: 15, income_variability_level: "moderate" as const, labor_dependence_pct: 70 };

  const qualityScore = ((v2?.quality as Record<string, number>)?.quality_score) ?? 5;
  const baseResult = simulateScore(baseInputs, qualityScore);
  const displayScore = score > 0 ? score : baseResult.overall_score;
  const displayBand = band || baseResult.band;
  const industryData = INDUSTRY_INSIGHTS[industrySector] || INDUSTRY_INSIGHTS.default;
  const scripts = industrySector ? getScriptsForSector(industrySector) : [];

  /* ── PressureMap ── */
  const rootConstraint = constraints?.root_constraint || "weak_forward_visibility";
  const secondaryConstraint = constraints?.secondary_constraint || "";
  const constraintPreset: Record<string, string> = { high_concentration: "add_client", weak_forward_visibility: "lock_forward", high_labor_dependence: "build_passive", low_persistence: "convert_retainer", low_source_diversity: "add_client", high_variability: "convert_retainer" };
  const getPresetLift = (pid: string) => { const p = SIMULATOR_PRESETS.find(x => x.id === pid); if (!p) return { score: displayScore, lift: 0 }; const res = simulateScore(p.modify(baseInputs), qualityScore); return { score: res.overall_score, lift: Math.max(0, res.overall_score - displayScore) }; };
  const redPreset = constraintPreset[rootConstraint] || "convert_retainer";
  const redResult = getPresetLift(redPreset);
  const greenPreset = rootConstraint === "high_labor_dependence" ? "lock_forward" : "build_passive";
  const greenResult = getPresetLift(greenPreset);

  const zones = [
    { id: "active", label: "Income That Stops", pct: activeIncome, color: B.red, lift: redResult.lift,
      narrative: activeIncome >= 70 ? `${activeIncome}% of your income disappears the moment you stop. This is your most exposed zone.` : activeIncome >= 40 ? `${activeIncome}% requires active daily work. A sustained disruption creates significant pressure.` : `${activeIncome}% active income is relatively well-managed.`,
      peer: activeIncome > industryData.redAvg ? `${activeIncome - industryData.redAvg}% above your sector avg of ${industryData.redAvg}%` : `${industryData.redAvg - activeIncome}% below your sector avg of ${industryData.redAvg}%` },
    { id: "semi", label: "Recurring For Now", pct: semiIncome, color: B.amber, lift: 0,
      narrative: semiIncome < 15 ? `Only ${semiIncome}% has any repeating structure.` : semiIncome < 35 ? `${semiIncome}% repeats on short cycles. Cancelable, but a working buffer.` : `${semiIncome}% recurring is a solid foundation.`,
      peer: null },
    { id: "persistent", label: "Protected Income", pct: persistentIncome, color: B.teal, lift: greenResult.lift,
      narrative: persistentIncome < 10 ? `Only ${persistentIncome}% would continue if you stopped entirely.` : persistentIncome < 25 ? `${persistentIncome}% protected gives some runway.` : `${persistentIncome}% protected is a structural advantage.`,
      peer: persistentIncome > industryData.greenAvg ? `${persistentIncome - industryData.greenAvg}% above your sector avg of ${industryData.greenAvg}%` : `${industryData.greenAvg - persistentIncome}% below your sector avg of ${industryData.greenAvg}%` },
  ];

  /* ── Top moves ── */
  const topMoves = SIMULATOR_PRESETS.filter(p => !["lose_top_client", "cant_work_90_days"].includes(p.id)).map(p => {
    const res = simulateScore(p.modify(baseInputs), qualityScore); const lift = res.overall_score - displayScore;
    return { ...p, lift, projected: res.overall_score, resultBand: res.band, effort: p.id === "lock_forward" || p.id === "convert_retainer" ? "Low" : "High", speed: p.id === "lock_forward" || p.id === "convert_retainer" ? "Fast" : "Gradual" };
  }).filter(p => p.lift > 0).sort((a, b) => b.lift - a.lift);

  const getScriptForPreset = (pid: string) => { if (!scripts.length) return null; if (pid === "convert_retainer") return scripts.find(s => s.id.includes("retainer")) || scripts[0]; if (pid === "add_client") return scripts.find(s => s.id.includes("diversi") || s.id.includes("referral")) || scripts[1]; if (pid === "build_passive") return scripts[2] || scripts[0]; return scripts[0]; };

  /* ── Roadmap ── */
  const roadmapPhases = [{ weeks: "Week 1–2" }, { weeks: "Week 3–4" }, { weeks: "Week 5–8" }, { weeks: "Week 9–12" }];
  const roadmapSteps = topMoves.slice(0, 4).map((m, i) => ({ ...roadmapPhases[i], action: m.label, presetId: m.id, lift: m.lift, description: m.description }));

  const toggleRoadmapStep = useCallback((idx: number) => {
    setCompletedSteps(prev => {
      const next = prev.includes(idx) ? prev.filter(i => i !== idx) : [...prev, idx];
      localStorage.setItem("rp_roadmap_steps", JSON.stringify(next));
      return next;
    });
  }, []);

  /* ── Quick progress ── */
  const quickActions = [
    { id: "client", label: "Added a new client or income source", presetId: "add_client" },
    { id: "retainer", label: "Signed a retainer or recurring agreement", presetId: "convert_retainer" },
    { id: "passive", label: "Created passive or semi-passive income", presetId: "build_passive" },
    { id: "forward", label: "Secured next quarter with commitments", presetId: "lock_forward" },
  ];
  let quickInputs = { ...baseInputs };
  const activeQuickCount = Object.values(quickToggles).filter(Boolean).length;
  for (const a of quickActions) { if (quickToggles[a.id]) { const p = SIMULATOR_PRESETS.find(x => x.id === a.presetId); if (p) quickInputs = p.modify(quickInputs); } }
  const quickResult = simulateScore(quickInputs, qualityScore);
  const quickLift = activeQuickCount > 0 ? quickResult.overall_score - displayScore : 0;

  /* ── Scenario ── */
  const activePresetObj = SIMULATOR_PRESETS.find(p => p.id === activePreset);
  const scenarioInputs = activePresetObj ? activePresetObj.modify(baseInputs) : baseInputs;
  const scenarioResult = activePresetObj ? simulateScore(scenarioInputs, qualityScore) : baseResult;
  const scenarioDelta = activePresetObj ? scenarioResult.overall_score - displayScore : 0;
  const scenarioTimeline: TimelinePoint[] = activePresetObj ? projectTimeline(baseInputs, scenarioInputs, qualityScore) : [];

  /* ── Stress ── */
  const stressLC = simulateScore(SIMULATOR_PRESETS.find(p => p.id === "lose_top_client")!.modify(baseInputs), qualityScore);
  const stressNW = simulateScore(SIMULATOR_PRESETS.find(p => p.id === "cant_work_90_days")!.modify(baseInputs), qualityScore);

  /* ── Progress ── */
  const nextThreshold = displayScore < 30 ? 30 : displayScore < 50 ? 50 : displayScore < 75 ? 75 : 100;
  const nextBandLabel = displayScore < 30 ? "Developing" : displayScore < 50 ? "Established" : displayScore < 75 ? "High" : "Maximum";
  const gap = nextThreshold - displayScore;

  /* ── Reassessment ── */
  const reassessChecks = [
    { label: "Signed a new retainer or recurring agreement", key: "retainer" },
    { label: "Added a new independent income source", key: "source" },
    { label: "Reduced your largest client below 40%", key: "concentration" },
    { label: "Created a passive income stream", key: "passive" },
  ];
  const toggleCheck = (key: string) => { setCheckedItems(prev => { const u = prev.includes(key) ? prev.filter(k => k !== key) : [...prev, key]; localStorage.setItem("rp_reassess_checks", JSON.stringify(u)); return u; }); };
  const returnTrigger = checkedItems.length >= 2 ? "You have made enough structural changes to warrant a reassessment." : topMoves[0] ? `Come back after you ${topMoves[0].label.toLowerCase()}. That single change is worth +${topMoves[0].lift} points.` : "Come back after making a structural change.";

  const copyScript = (text: string, id: string) => { navigator.clipboard.writeText(text).then(() => { setCopiedScript(id); setTimeout(() => setCopiedScript(null), 2000); }); };

  /* ── Share score ── */
  const handleShare = async () => {
    const bLabel = displayScore >= 75 ? "High Stability" : displayScore >= 50 ? "Established Stability" : displayScore >= 30 ? "Developing Stability" : "Limited Stability";
    const url = await generateScoreImage(displayScore, bLabel, customerName, bc(displayScore));
    setShareUrl(url);
    setTimeout(() => { if (shareRef.current) shareRef.current.click(); }, 100);
  };

  /* ── Assessment date formatted ── */
  const assessedDate = issuedDate ? new Date(issuedDate).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" }) : "";

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
          .d-score-hero{flex-direction:column!important;align-items:center!important;text-align:center!important;}
          .d-score-ring{width:130px!important;height:130px!important;}
        }
        @keyframes fadeSlideIn { from { opacity: 0; transform: translateY(12px); } to { opacity: 1; transform: translateY(0); } }
      `}</style>
      <SuiteHeader current="dashboard" />
      {shareUrl && <a ref={shareRef} href={shareUrl} download={`runpayway-score-${displayScore}.png`} style={{ display: "none" }}>download</a>}

      <div style={{ maxWidth: 880, margin: "0 auto", padding: mobile ? "24px 16px 60px" : "40px 32px 80px" }}>

        {/* ── Personalized header ── */}
        {!isDemo && customerName && (
          <div style={{ marginBottom: 8 }}>
            <span style={{ fontSize: 15, color: B.muted }}>{customerName}&rsquo;s Command Center</span>
            {industryLabel && <span style={{ fontSize: 13, color: B.taupe }}> &middot; {industryLabel}</span>}
          </div>
        )}

        {/* DEMO CONTROLS — large, clear, directive */}
        {isDemo && (
          <div style={{ padding: mobile ? "28px 20px" : "32px 32px", borderRadius: 14, backgroundColor: B.surface, border: `1px solid ${B.purple}15`, marginBottom: 32 }}>
            {/* Headline + direction */}
            <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.12em", color: B.purple, marginBottom: 8 }}>EXPLORE THE COMMAND CENTER</div>
            <div style={{ fontSize: mobile ? 18 : 22, fontWeight: 600, color: B.navy, lineHeight: 1.3, marginBottom: 6 }}>
              This is a preview with sample data.
            </div>
            <p style={{ fontSize: 15, color: B.muted, margin: "0 0 20px", lineHeight: 1.6 }}>
              Select a stability band below to see how the Command Center works for different income structures. Have your report? Paste your access code to load your real data.
            </p>

            {/* Band selector — large buttons */}
            <div style={{ fontSize: 12, fontWeight: 600, color: B.taupe, marginBottom: 10 }}>Select a sample profile:</div>
            <div style={{ display: "flex", gap: 8, marginBottom: 24, flexWrap: "wrap" as const }}>
              {SAMPLE_PROFILES.map((p, i) => (
                <button key={p.id} onClick={() => { setDemoProfile(i); setActivePreset(null); setSavedScenarios([]); setQuickToggles({}); }}
                  style={{ padding: "12px 24px", borderRadius: 10, fontSize: 15, fontWeight: demoProfile === i ? 600 : 400, color: demoProfile === i ? "#FFF" : B.navy, backgroundColor: demoProfile === i ? (p.id === "limited" ? B.red : p.id === "developing" ? B.amber : p.id === "established" ? B.bandEstablished : B.teal) : "transparent", border: `2px solid ${demoProfile === i ? "transparent" : B.stone}`, cursor: "pointer", transition: "all 200ms", minHeight: 48, flex: mobile ? "1 1 45%" : "none" }}
                >{p.label}</button>
              ))}
            </div>

            {/* Access code — prominent */}
            <div style={{ padding: "20px 24px", borderRadius: 12, backgroundColor: `${B.purple}04`, border: `1px solid ${B.purple}10` }}>
              <div style={{ fontSize: 14, fontWeight: 600, color: B.navy, marginBottom: 4 }}>Have your report?</div>
              <p style={{ fontSize: 14, color: B.muted, margin: "0 0 12px" }}>Paste the access code from your report cover page to load your personal data.</p>
              <div style={{ display: "flex", gap: 8, alignItems: mobile ? "stretch" : "center", flexDirection: mobile ? "column" : "row" }}>
                <input value={accessCode} onChange={(e) => { setAccessCode(e.target.value); setCodeError(null); }} placeholder="Paste your access code here" onKeyDown={(e) => { if (e.key === "Enter") handleCodeSubmit(); }}
                  style={{ padding: "12px 16px", fontSize: 14, fontFamily: "monospace", border: `1px solid ${B.stone}`, borderRadius: 8, outline: "none", flex: 1, boxSizing: "border-box" as const, minHeight: 48 }} />
                <button onClick={handleCodeSubmit} style={{ padding: "12px 28px", fontSize: 15, fontWeight: 600, color: B.white, backgroundColor: B.purple, border: "none", borderRadius: 8, cursor: "pointer", whiteSpace: "nowrap" as const, minHeight: 48 }}>Load My Data</button>
              </div>
              {codeError && <div style={{ fontSize: 13, color: B.red, marginTop: 8 }}>{codeError}</div>}
            </div>
          </div>
        )}

        {/* ══════════════ FIRST-VISIT WELCOME ══════════════ */}
        {showWelcome && !isDemo && (
          <div style={{ padding: mobile ? "28px 20px" : "32px 36px", borderRadius: 14, background: `linear-gradient(135deg, ${B.navy} 0%, #1a1840 50%, ${B.purple} 100%)`, marginBottom: 28, animation: "fadeSlideIn 600ms ease-out", position: "relative" }}>
            <button onClick={() => setShowWelcome(false)} style={{ position: "absolute", top: 14, right: 16, fontSize: 16, color: "rgba(255,255,255,0.4)", background: "none", border: "none", cursor: "pointer" }}>×</button>
            <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.12em", color: B.teal, marginBottom: 12 }}>WELCOME TO YOUR COMMAND CENTER</div>
            <div style={{ fontSize: mobile ? 22 : 28, fontWeight: 300, color: "#F4F1EA", lineHeight: 1.2, marginBottom: 12 }}>
              {customerName ? `${customerName}, your` : "Your"} score is <span style={{ fontWeight: 600, color: B.white }}>{displayScore}</span>.
              {benchmarking ? ` That puts you ahead of ${benchmarking.peer_percentile}% of ${benchmarking.cluster_label.toLowerCase()}.` : ""}
            </div>
            <p style={{ fontSize: 15, color: "rgba(244,241,234,0.55)", lineHeight: 1.6, margin: "0 0 16px", maxWidth: 560 }}>
              {gap > 0 ? `You are ${gap} points from ${nextBandLabel} Stability. Your 12-week roadmap below shows exactly how to get there.` : "You have achieved the highest stability band. Your roadmap focuses on maintaining and strengthening this position."}
            </p>
            <button onClick={() => setShowWelcome(false)} style={{ padding: "10px 24px", borderRadius: 8, backgroundColor: "rgba(255,255,255,0.10)", border: "1px solid rgba(255,255,255,0.15)", color: "#F4F1EA", fontSize: 14, fontWeight: 600, cursor: "pointer" }}>
              Show my plan →
            </button>
          </div>
        )}

        {/* ══════════════ ORIENT — "Where am I?" ══════════════ */}
        <PhaseSep label="Your Diagnosis" color={B.purple} />

        {/* 1. SCORE + BENCHMARKING */}
        <section style={{ marginBottom: 28 }}>
          <div style={{ padding: mobile ? "28px 20px" : "32px 36px", border: `1px solid ${B.stone}`, borderRadius: 14, backgroundColor: B.surface }}>
            <div style={{ display: "flex", alignItems: "center", gap: mobile ? 20 : 32 }} className="d-score-hero">
              <ScoreRing score={displayScore} size={mobile ? 130 : 160} />
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 14, color: B.muted, marginBottom: 6 }}>{gap > 0 ? `${gap} points to ${nextBandLabel}` : "Highest band achieved"}</div>
                {benchmarking && (
                  <div style={{ padding: "12px 16px", borderRadius: 8, backgroundColor: `${B.purple}05`, border: `1px solid ${B.purple}08`, marginBottom: 12 }}>
                    <div style={{ fontSize: 16, fontWeight: 600, color: B.navy }}>Top {100 - benchmarking.peer_percentile}% of {benchmarking.cluster_label}</div>
                    <div style={{ fontSize: 14, color: displayScore > benchmarking.cluster_average_score ? B.teal : B.red, fontWeight: 600, marginTop: 2 }}>
                      {displayScore > benchmarking.cluster_average_score ? `+${displayScore - benchmarking.cluster_average_score} above` : `${displayScore - benchmarking.cluster_average_score} below`} cluster avg ({benchmarking.cluster_average_score})
                    </div>
                  </div>
                )}
                <div style={{ display: "flex", gap: 8, flexWrap: "wrap" as const }} className="d-metrics">
                  {[
                    { label: "Runway", value: continuityMonths < 1 ? "< 1 mo" : `${continuityMonths.toFixed(1)} mo`, color: continuityMonths < 3 ? B.red : B.teal },
                    { label: "Top source risk", value: `−${riskDrop}`, color: riskDrop > 15 ? B.red : B.amber },
                    { label: "Fragility", value: fragilityLabel, color: fragilityLabel === "Brittle" || fragilityLabel === "Fragile" ? B.red : fragilityLabel === "Resilient" ? B.teal : B.amber },
                  ].map((m) => (
                    <div key={m.label} style={{ flex: 1, minWidth: 100, padding: "10px 14px", border: `1px solid ${B.stone}`, borderRadius: 8, display: "flex", justifyContent: "space-between", alignItems: "center", minHeight: 44 }}>
                      <span style={{ fontSize: 12, color: B.taupe }}>{m.label}</span>
                      <span style={{ fontSize: 16, fontWeight: 300, color: m.color }}>{m.value}</span>
                    </div>
                  ))}
                </div>
                {/* Share score */}
                <button onClick={handleShare} style={{ marginTop: 10, fontSize: 12, fontWeight: 600, color: B.purple, background: "none", border: `1px solid ${B.purple}15`, borderRadius: 6, padding: "6px 14px", cursor: "pointer", minHeight: 32 }}>
                  Share Your Score ↓
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* 2. PRESSUREMAP™ */}
        <section style={{ marginBottom: 28 }}>
          <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", marginBottom: 14 }}>
            <div>
              <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.12em", color: B.purple }}>RUNPAYWAY&#8482; PRESSUREMAP&#8482;</div>
              {industryLabel && <p style={{ fontSize: 14, color: B.muted, margin: "4px 0 0" }}>Analysis for {industryLabel.toLowerCase()} professionals.</p>}
            </div>
            <div style={{ fontSize: 10, color: B.taupe, textAlign: "right" as const }}>
              {assessedDate && <div>Analyzed {assessedDate}</div>}
              <div>Model RP-2.0</div>
            </div>
          </div>

          {/* Root constraint */}
          <div style={{ padding: mobile ? "20px 16px" : "22px 28px", border: `1px solid ${B.stone}`, borderLeft: `4px solid ${B.red}`, borderRadius: 12, backgroundColor: B.surface, marginBottom: 14 }}>
            <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.10em", color: B.red, marginBottom: 8 }}>ROOT CONSTRAINT</div>
            <p style={{ fontSize: 15, color: B.navy, margin: 0, lineHeight: 1.65 }}>{getConstraintNarrative(rootConstraint, baseInputs)}</p>
            {secondaryConstraint && <p style={{ fontSize: 13, color: B.muted, margin: "10px 0 0", fontStyle: "italic" }}>Secondary: {secondaryConstraint.replace(/_/g, " ").replace(/\b\w/g, c => c.toUpperCase())}</p>}
          </div>

          {/* Composition bar */}
          <div style={{ padding: mobile ? "18px 16px" : "20px 28px", border: `1px solid ${B.stone}`, borderRadius: 12, backgroundColor: B.surface, marginBottom: 10 }}>
            <div style={{ display: "flex", height: 40, borderRadius: 8, overflow: "hidden", border: `1px solid ${B.stone}`, marginBottom: 12 }}>
              {zones.map(z => z.pct > 0 ? <div key={z.id} style={{ width: `${z.pct}%`, backgroundColor: `${z.color}18`, display: "flex", alignItems: "center", justifyContent: "center", borderRight: z.id !== "persistent" ? `2px solid ${B.white}` : "none" }}>{z.pct >= 12 && <span style={{ fontSize: 14, fontWeight: 600, color: z.color }}>{z.pct}%</span>}</div> : null)}
            </div>
            <p style={{ fontSize: 13, color: B.taupe, margin: 0, fontStyle: "italic" }}>{industryData.general}</p>
          </div>

          {/* Zone cards */}
          {zones.map(zone => (
            <div key={zone.id} style={{ padding: mobile ? "16px 14px" : "18px 24px", border: `1px solid ${B.stone}`, borderLeft: `3px solid ${zone.color}`, borderRadius: 10, backgroundColor: B.surface, marginBottom: 8 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 6 }}>
                <div style={{ display: "flex", alignItems: "baseline", gap: 10 }}>
                  <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.10em", color: zone.color }}>{zone.label.toUpperCase()}</span>
                  <span style={{ fontSize: 20, fontWeight: 300, color: zone.color }}>{zone.pct}%</span>
                </div>
                {zone.lift > 0 && <span style={{ fontSize: 13, fontWeight: 600, color: B.teal }}>+{zone.lift} if fixed</span>}
              </div>
              <p style={{ fontSize: 14, color: B.navy, margin: "0 0 4px", lineHeight: 1.55 }}>{zone.narrative}</p>
              {zone.peer && <p style={{ fontSize: 12, color: B.taupe, margin: 0, fontStyle: "italic" }}>{zone.peer}</p>}
            </div>
          ))}
        </section>

        {/* ══════════════ DECIDE — "What should I do?" ══════════════ */}
        <PhaseSep label="Your Plan" color={B.navy} />

        {/* 3. #1 PRIORITY + SCRIPT */}
        {topMoves.length > 0 && (() => {
          const move = topMoves[0]; const script = getScriptForPreset(move.id);
          return (
            <section style={{ marginBottom: 24 }}>
              <div style={{ border: `1px solid ${B.stone}`, borderLeft: `4px solid ${B.purple}`, borderRadius: 14, backgroundColor: B.surface, overflow: "hidden" }}>
                <div style={{ padding: mobile ? "24px 20px" : "28px 32px" }}>
                  <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.12em", color: B.purple, marginBottom: 8 }}>YOUR #1 PRIORITY</div>
                  <div style={{ fontSize: 20, fontWeight: 600, color: B.navy, lineHeight: 1.3, marginBottom: 8 }}>{move.label}</div>
                  <p style={{ fontSize: 15, color: B.muted, margin: "0 0 14px", lineHeight: 1.6 }}>{move.description}</p>
                  <div style={{ display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap" as const }}>
                    <span style={{ fontSize: 20, fontWeight: 300, color: B.teal }}>+{move.lift} pts</span>
                    {move.resultBand !== displayBand && <span style={{ fontSize: 13, fontWeight: 600, color: B.purple, backgroundColor: `${B.purple}08`, padding: "4px 12px", borderRadius: 20 }}>→ {move.resultBand}</span>}
                    <span style={{ fontSize: 12, color: B.taupe, backgroundColor: B.stone, padding: "4px 12px", borderRadius: 20 }}>{move.effort} effort · {move.speed}</span>
                  </div>
                </div>
                {script && (
                  <div style={{ padding: mobile ? "20px 20px" : "24px 32px", borderTop: `1px solid ${B.stone}`, backgroundColor: `${B.purple}02` }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
                      <div><div style={{ fontSize: 14, fontWeight: 600, color: B.navy }}>{script.title}</div><div style={{ fontSize: 13, color: B.muted }}>{script.context}</div></div>
                      <button onClick={() => copyScript(script.script, script.id)} style={{ fontSize: 13, fontWeight: 600, color: copiedScript === script.id ? B.teal : B.purple, backgroundColor: copiedScript === script.id ? `${B.teal}08` : `${B.purple}08`, border: "none", borderRadius: 8, padding: "10px 18px", cursor: "pointer", whiteSpace: "nowrap" as const, minHeight: 40 }}>{copiedScript === script.id ? "Copied!" : "Copy Script"}</button>
                    </div>
                    <pre style={{ fontSize: 14, color: B.navy, lineHeight: 1.7, whiteSpace: "pre-wrap" as const, margin: 0, padding: "18px 20px", backgroundColor: B.surface, borderRadius: 10, border: `1px solid ${B.stone}`, fontFamily: INTER }}>{script.script}</pre>
                  </div>
                )}
              </div>
            </section>
          );
        })()}

        {/* 4. 12-WEEK ROADMAP with progress tracking */}
        {roadmapSteps.length > 1 && (
          <section style={{ marginBottom: 28 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 14 }}>
              <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.12em", color: B.taupe }}>YOUR 12-WEEK ROADMAP</div>
              {completedSteps.length > 0 && <span style={{ fontSize: 12, fontWeight: 600, color: B.teal }}>{completedSteps.length}/{roadmapSteps.length} completed</span>}
            </div>
            <div style={{ border: `1px solid ${B.stone}`, borderRadius: 14, backgroundColor: B.surface, overflow: "hidden" }}>
              {roadmapSteps.map((step, i) => {
                const script = getScriptForPreset(step.presetId);
                const isExpanded = expandedScript === `roadmap-${i}`;
                const isDone = completedSteps.includes(i);
                return (
                  <div key={i} style={{ borderBottom: i < roadmapSteps.length - 1 ? `1px solid ${B.stone}` : "none", opacity: isDone ? 0.55 : 1, transition: "opacity 300ms" }}>
                    <div style={{ padding: mobile ? "18px 14px" : "20px 28px", display: "flex", gap: 14, alignItems: "flex-start" }}>
                      {/* Step indicator + check */}
                      <div style={{ flexShrink: 0, textAlign: "center" as const, minWidth: 48 }}>
                        <button onClick={() => toggleRoadmapStep(i)} style={{ width: 32, height: 32, borderRadius: "50%", backgroundColor: isDone ? B.teal : i === 0 ? `${B.purple}12` : `${B.teal}08`, border: `2px solid ${isDone ? B.teal : i === 0 ? `${B.purple}30` : `${B.teal}20`}`, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", transition: "all 200ms", margin: "0 auto 4px" }}>
                          {isDone ? <span style={{ color: B.white, fontSize: 14, fontWeight: 700 }}>&#10003;</span> : <span style={{ fontSize: 13, fontWeight: 700, color: i === 0 ? B.purple : B.teal }}>{i + 1}</span>}
                        </button>
                        <div style={{ fontSize: 10, fontWeight: 600, color: B.taupe, lineHeight: 1.2 }}>{step.weeks}</div>
                      </div>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: 15, fontWeight: 600, color: isDone ? B.muted : B.navy, marginBottom: 4, textDecoration: isDone ? "line-through" : "none" }}>{step.action}</div>
                        <p style={{ fontSize: 13, color: B.muted, margin: "0 0 8px", lineHeight: 1.5 }}>{step.description}</p>
                        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                          <span style={{ fontSize: 14, fontWeight: 600, color: B.teal }}>+{step.lift} pts</span>
                          {script && <button onClick={() => setExpandedScript(isExpanded ? null : `roadmap-${i}`)} style={{ fontSize: 12, fontWeight: 600, color: B.purple, background: "none", border: `1px solid ${B.purple}15`, borderRadius: 6, padding: "5px 14px", cursor: "pointer", minHeight: 28 }}>{isExpanded ? "Hide script ▲" : "Script ▼"}</button>}
                        </div>
                      </div>
                    </div>
                    {isExpanded && script && (
                      <div style={{ padding: mobile ? "16px 14px 20px" : "16px 28px 24px", backgroundColor: `${B.purple}02` }}>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
                          <span style={{ fontSize: 13, fontWeight: 600, color: B.navy }}>{script.title}</span>
                          <button onClick={() => copyScript(script.script, script.id)} style={{ fontSize: 12, fontWeight: 600, color: copiedScript === script.id ? B.teal : B.purple, backgroundColor: copiedScript === script.id ? `${B.teal}08` : `${B.purple}08`, border: "none", borderRadius: 6, padding: "6px 14px", cursor: "pointer", minHeight: 28 }}>{copiedScript === script.id ? "Copied!" : "Copy"}</button>
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

        {/* ══════════════ ACT — "Let me test it" ══════════════ */}
        <PhaseSep label="Test Your Options" color={B.teal} />

        {/* 5. WHAT-IF EXPLORER */}
        <section style={{ marginBottom: 28 }}>
          <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.12em", color: B.teal, marginBottom: 6 }}>WHAT-IF EXPLORER</div>
          <p style={{ fontSize: 14, color: B.muted, margin: "0 0 16px" }}>Test a change. Save up to 3 paths to compare.</p>
          <div style={{ display: "grid", gridTemplateColumns: mobile ? "1fr" : "repeat(3, 1fr)", gap: 10, marginBottom: 16 }} className="d-3col">
            {SIMULATOR_PRESETS.map(preset => {
              const res = simulateScore(preset.modify(baseInputs), qualityScore); const lift = res.overall_score - displayScore;
              const isActive = activePreset === preset.id; const isNeg = lift < 0;
              return (
                <button key={preset.id} onClick={() => setActivePreset(isActive ? null : preset.id)}
                  style={{ padding: "16px 18px", textAlign: "left" as const, borderRadius: 10, cursor: "pointer", transition: "all 200ms", border: `1px solid ${isActive ? (isNeg ? B.red : B.purple) + "40" : B.stone}`, backgroundColor: isActive ? (isNeg ? `${B.red}05` : `${B.purple}06`) : B.surface, minHeight: 44 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                    <span style={{ fontSize: 14, fontWeight: 600, color: isActive ? B.navy : B.muted }}>{preset.label}</span>
                    <span style={{ fontSize: 15, fontWeight: 700, color: lift >= 0 ? B.teal : B.red }}>{lift > 0 ? "+" : ""}{lift}</span>
                  </div>
                  <p style={{ fontSize: 12, color: B.taupe, margin: 0, lineHeight: 1.4 }}>{preset.description}</p>
                </button>
              );
            })}
          </div>

          {activePreset && activePresetObj && (
            <div style={{ padding: mobile ? "20px 16px" : "24px 28px", border: `1px solid ${B.stone}`, borderRadius: 12, backgroundColor: B.surface, marginBottom: 16 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 16, flexWrap: "wrap" as const }}>
                <div>
                  <div style={{ fontSize: 17, fontWeight: 600, color: B.navy, marginBottom: 6 }}>{activePresetObj.label}</div>
                  <div style={{ fontSize: 20, fontWeight: 300, color: scenarioDelta >= 0 ? B.teal : B.red }}>{displayScore} → {scenarioResult.overall_score} ({scenarioDelta > 0 ? "+" : ""}{scenarioDelta})</div>
                  {scenarioResult.band !== displayBand && <div style={{ fontSize: 14, fontWeight: 600, color: B.purple, marginTop: 4 }}>→ {scenarioResult.band}</div>}
                </div>
                {savedScenarios.length < 3 && scenarioDelta !== 0 && (
                  <button onClick={() => setSavedScenarios(prev => [...prev, { name: activePresetObj.label, score: scenarioResult.overall_score, band: scenarioResult.band, lift: scenarioDelta }])}
                    style={{ fontSize: 13, fontWeight: 600, color: B.teal, backgroundColor: `${B.teal}06`, border: `1px solid ${B.teal}18`, borderRadius: 8, padding: "10px 18px", cursor: "pointer", minHeight: 40 }}>
                    Save Path ({3 - savedScenarios.length} left)
                  </button>
                )}
              </div>
              {scenarioTimeline.length > 0 && (
                <div style={{ marginTop: 20 }}>
                  <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.10em", color: B.taupe, marginBottom: 10 }}>PROJECTED TRAJECTORY</div>
                  <div style={{ display: "flex", gap: 8, flexDirection: mobile ? "column" : "row" }}>
                    <div style={{ flex: 0, padding: "10px 14px", border: `1px solid ${B.stone}`, borderRadius: 8, textAlign: "center" as const, minHeight: 44 }}><div style={{ fontSize: 10, fontWeight: 600, color: B.taupe }}>NOW</div><div style={{ fontSize: 20, fontWeight: 300, color: B.navy }}>{displayScore}</div></div>
                    {scenarioTimeline.map(pt => (
                      <div key={pt.month} style={{ flex: 1, padding: "10px 14px", border: `1px solid ${B.stone}`, borderRadius: 8, textAlign: "center" as const, minHeight: 44 }}>
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

          {savedScenarios.length > 0 && (
            <div style={{ padding: mobile ? "20px 16px" : "24px 28px", border: `1px solid ${B.stone}`, borderRadius: 12, backgroundColor: B.surface }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
                <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.10em", color: B.purple }}>COMPARE PATHS</div>
                <button onClick={() => setSavedScenarios([])} style={{ fontSize: 12, color: B.muted, background: "none", border: "none", cursor: "pointer", textDecoration: "underline" }}>Clear</button>
              </div>
              <div style={{ display: "flex", gap: 12 }} className="d-compare">
                <div style={{ flex: 1, padding: "16px 14px", borderRadius: 10, border: `1px solid ${B.stone}`, textAlign: "center" as const }}>
                  <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.10em", color: B.taupe, marginBottom: 8 }}>CURRENT</div>
                  <div style={{ fontSize: 30, fontWeight: 300, color: B.navy }}>{displayScore}</div>
                  <div style={{ fontSize: 12, fontWeight: 600, color: bc(displayScore), marginTop: 4 }}>{displayBand}</div>
                </div>
                {savedScenarios.map((s, i) => (
                  <div key={i} style={{ flex: 1, padding: "16px 14px", borderRadius: 10, border: `1px solid ${B.teal}18`, backgroundColor: `${B.teal}03`, textAlign: "center" as const, position: "relative" }}>
                    <button onClick={() => setSavedScenarios(prev => prev.filter((_, j) => j !== i))} style={{ position: "absolute", top: 6, right: 8, fontSize: 14, color: B.taupe, background: "none", border: "none", cursor: "pointer" }}>×</button>
                    <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.10em", color: B.teal, marginBottom: 8 }}>PATH {String.fromCharCode(65 + i)}</div>
                    <div style={{ fontSize: 30, fontWeight: 300, color: B.teal }}>{s.score}</div>
                    <div style={{ fontSize: 12, fontWeight: 600, color: bc(s.score), marginTop: 4 }}>{s.band}</div>
                    <div style={{ fontSize: 14, fontWeight: 600, color: B.teal, marginTop: 6 }}>+{s.lift}</div>
                    <div style={{ fontSize: 11, color: B.muted, marginTop: 4 }}>{s.name}</div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </section>

        {/* ══════════════ MONITOR — "Am I progressing?" ══════════════ */}
        <PhaseSep label="Track Progress" color={B.taupe} />

        {/* 6. PROGRESS CHECK */}
        <section style={{ marginBottom: 16, padding: mobile ? "24px 18px" : "28px 32px", border: `1px solid ${B.stone}`, borderRadius: 14, backgroundColor: B.surface }}>
          <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.12em", color: B.teal, marginBottom: 6 }}>PROGRESS CHECK</div>
          <div style={{ fontSize: 17, fontWeight: 600, color: B.navy, marginBottom: 4 }}>Has anything changed?</div>
          <p style={{ fontSize: 14, color: B.muted, margin: "0 0 18px" }}>Toggle what you have done. Score updates instantly.</p>

          <div style={{ display: "flex", gap: 20, flexDirection: mobile ? "column" : "row" }} className="d-2col">
            <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 8 }}>
              {quickActions.map(action => (
                <button key={action.id} onClick={() => setQuickToggles(prev => ({ ...prev, [action.id]: !prev[action.id] }))}
                  style={{ display: "flex", alignItems: "center", gap: 12, padding: "14px 16px", borderRadius: 10, cursor: "pointer", border: `1px solid ${quickToggles[action.id] ? `${B.teal}30` : B.stone}`, backgroundColor: quickToggles[action.id] ? `${B.teal}05` : "transparent", transition: "all 200ms", textAlign: "left" as const, minHeight: 48 }}>
                  <div style={{ width: 22, height: 22, borderRadius: 6, border: `2px solid ${quickToggles[action.id] ? B.teal : B.faint}`, backgroundColor: quickToggles[action.id] ? B.teal : "transparent", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                    {quickToggles[action.id] && <span style={{ color: "#FFF", fontSize: 11, fontWeight: 700 }}>&#10003;</span>}
                  </div>
                  <span style={{ fontSize: 14, fontWeight: quickToggles[action.id] ? 600 : 400, color: quickToggles[action.id] ? B.navy : B.muted }}>{action.label}</span>
                </button>
              ))}
            </div>
            <div style={{ flex: 0, minWidth: mobile ? "auto" : 190, textAlign: "center" as const, padding: "24px 20px", borderRadius: 12, backgroundColor: activeQuickCount > 0 ? `${B.teal}05` : `${B.stone}`, border: `1px solid ${activeQuickCount > 0 ? `${B.teal}18` : B.stone}`, display: "flex", flexDirection: "column", justifyContent: "center" }}>
              {activeQuickCount > 0 ? (
                <>
                  <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.10em", color: B.teal, marginBottom: 12 }}>ESTIMATED</div>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8, marginBottom: 6 }}>
                    <span style={{ fontSize: 20, fontWeight: 300, color: B.taupe }}>{displayScore}</span>
                    <span style={{ fontSize: 16, color: B.taupe }}>→</span>
                    <span style={{ fontSize: 32, fontWeight: 300, color: B.teal }}>{quickResult.overall_score}</span>
                  </div>
                  <div style={{ fontSize: 18, fontWeight: 700, color: B.teal }}>+{quickLift}</div>
                  {quickResult.band !== displayBand && <div style={{ fontSize: 13, color: B.purple, fontWeight: 600, marginTop: 6 }}>→ {quickResult.band}</div>}
                  <div style={{ fontSize: 11, color: B.taupe, marginTop: 10 }}>Directional estimate</div>
                </>
              ) : (
                <><div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.10em", color: B.taupe, marginBottom: 8 }}>CURRENT</div><div style={{ fontSize: 38, fontWeight: 300, color: B.navy, lineHeight: 1 }}>{displayScore}</div></>
              )}
            </div>
          </div>
        </section>

        {/* Reassessment + stress + timing */}
        <div style={{ display: "flex", gap: 14, flexDirection: mobile ? "column" : "row", marginBottom: 28 }} className="d-2col">
          <div style={{ flex: 1, padding: mobile ? "22px 18px" : "24px 24px", border: `1px solid ${B.stone}`, borderRadius: 14, backgroundColor: B.surface }}>
            <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.12em", color: B.taupe, marginBottom: 14 }}>REASSESSMENT READINESS</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 14 }}>
              {reassessChecks.map(check => (
                <div key={check.key} onClick={() => toggleCheck(check.key)} style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 14px", borderRadius: 8, cursor: "pointer", border: `1px solid ${checkedItems.includes(check.key) ? `${B.teal}25` : B.stone}`, transition: "all 150ms", minHeight: 44 }}>
                  <div style={{ width: 20, height: 20, borderRadius: 5, border: `2px solid ${checkedItems.includes(check.key) ? B.teal : B.faint}`, backgroundColor: checkedItems.includes(check.key) ? B.teal : "transparent", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                    {checkedItems.includes(check.key) && <span style={{ color: "#FFF", fontSize: 10, fontWeight: 700 }}>&#10003;</span>}
                  </div>
                  <span style={{ fontSize: 14, color: checkedItems.includes(check.key) ? B.navy : B.muted }}>{check.label}</span>
                </div>
              ))}
            </div>
            {checkedItems.length >= 2 ? (
              <div style={{ padding: "12px 14px", borderRadius: 8, backgroundColor: `${B.teal}05`, border: `1px solid ${B.teal}12` }}><span style={{ fontSize: 14, fontWeight: 600, color: B.teal }}>You may be ready to reassess.</span></div>
            ) : (
              <p style={{ fontSize: 13, color: B.taupe, margin: 0, lineHeight: 1.5, fontStyle: "italic" }}>{returnTrigger}</p>
            )}
          </div>

          <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 10 }}>
            {assessments.length >= 2 && (() => { const diff = assessments[0].final_score - assessments[1].final_score; return (
              <div style={{ padding: "18px 22px", border: `1px solid ${diff > 0 ? `${B.teal}18` : B.stone}`, borderRadius: 12, backgroundColor: B.surface, display: "flex", alignItems: "center", gap: 12 }}>
                <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.10em", color: B.taupe }}>HISTORY</div>
                <span style={{ fontSize: 20, fontWeight: 300, color: B.taupe }}>{assessments[1].final_score}</span><span style={{ color: B.taupe }}>→</span>
                <span style={{ fontSize: 20, fontWeight: 300, color: B.navy }}>{assessments[0].final_score}</span>
                <span style={{ fontSize: 16, fontWeight: 600, color: diff > 0 ? B.teal : diff < 0 ? B.red : B.taupe }}>{diff > 0 ? "+" : ""}{diff}</span>
              </div>
            ); })()}

            <div style={{ padding: "18px 22px", border: `1px solid ${B.stone}`, borderRadius: 12, backgroundColor: B.surface }}>
              <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.10em", color: B.taupe, marginBottom: 10 }}>STRESS RESILIENCE</div>
              {[{ label: "Top client leaves", value: `${displayScore} → ${stressLC.overall_score}`, color: B.red }, { label: "Can't work 90 days", value: `${displayScore} → ${stressNW.overall_score}`, color: B.red }].map(row => (
                <div key={row.label} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "8px 0", borderBottom: `1px solid ${B.stone}` }}>
                  <span style={{ fontSize: 13, color: B.muted }}>{row.label}</span><span style={{ fontSize: 14, fontWeight: 500, color: row.color }}>{row.value}</span>
                </div>
              ))}
            </div>

            <div style={{ padding: "18px 22px", border: `1px solid ${B.stone}`, borderRadius: 12, backgroundColor: B.surface }}>
              <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.10em", color: daysSince > 60 ? B.red : B.taupe, marginBottom: 6 }}>{daysSince > 0 ? `${daysSince} DAYS SINCE ASSESSMENT` : "ASSESSED TODAY"}</div>
              <p style={{ fontSize: 14, color: B.muted, margin: 0, lineHeight: 1.5 }}>
                {daysSince === 0 ? "Start with your #1 priority above." : daysSince <= 14 ? "Focus on the first phase of your roadmap." : daysSince <= 45 ? "You should be in Week 3–4. Made a structural change?" : daysSince <= 90 ? "If you followed your roadmap, you may be ready to reassess." : "Over 90 days. A reassessment will show how your structure changed."}
              </p>
            </div>

            {!isDemo && (
              <button onClick={() => { const s = sessionStorage.getItem("rp_record") || localStorage.getItem("rp_record"); if (!s) return; const b = new Blob([s], { type: "application/json" }); const u = URL.createObjectURL(b); const a = document.createElement("a"); a.href = u; a.download = "runpayway-assessment.json"; a.click(); URL.revokeObjectURL(u); }}
                style={{ fontSize: 13, fontWeight: 500, color: B.taupe, background: "none", border: `1px solid ${B.stone}`, borderRadius: 8, padding: "12px 18px", cursor: "pointer", textAlign: "center" as const, minHeight: 44 }}>
                Download Assessment Data
              </button>
            )}
          </div>
        </div>

        {/* FOOTER */}
        <div style={{ paddingTop: 16, borderTop: `1px solid ${B.stone}`, textAlign: "center" }}>
          <p style={{ fontSize: 11, color: B.taupe, margin: 0 }}>RunPayway&#8482; Command Center &mdash; A proprietary financial diagnostic by PeopleStar Enterprises.</p>
        </div>
      </div>
    </div>
  );
}
