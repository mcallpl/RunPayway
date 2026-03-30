"use client";

import { useEffect, useState, useRef, useCallback, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
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
  bg: "#F7F5F0",
  surface: "#FEFEFE",
  stone: "rgba(14,26,43,0.06)",
  taupe: "rgba(14,26,43,0.36)",
  muted: "rgba(14,26,43,0.58)",
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
function fmtIndustry(s: string): string { return s.replace(/_/g, " ").replace(/\b\w/g, c => c.toUpperCase()); }

/*  TYPE SCALE — 6 levels only
    Display: handled by ScoreRing (44px)
    H1: 22px  — section features, welcome headline
    H2: 17px  — card titles, move labels
    Body: 15px — primary readable text
    Small: 13px — secondary, peer comparisons, tags
    Label: 11px — uppercase section markers, metadata
*/

/* ================================================================== */
/*  PHASE NAV CONFIG                                                   */
/* ================================================================== */
const PHASE_NAV = [
  { id: "phase-diagnosis", label: "Diagnosis", color: B.purple },
  { id: "phase-plan", label: "Plan", color: B.navy },
  { id: "phase-test", label: "Test", color: B.teal },
  { id: "phase-progress", label: "Progress", color: B.taupe },
] as const;

/* ================================================================== */
/*  SCORE RING                                                         */
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
        <span style={{ fontSize: size * 0.08, fontWeight: 600, color, marginTop: 4, letterSpacing: "0.04em" }}>{bandLabel}</span>
      </div>
    </div>
  );
}

/* ================================================================== */
/*  PHASE SEPARATOR — wrapper with branded edge mark + tinted bg       */
/* ================================================================== */
function PhaseSep({ label, color, tint, children, id }: { label: string; color: string; tint?: string; children?: React.ReactNode; id?: string }) {
  return (
    <div id={id} className="d-phase" style={{ margin: "0 -32px", padding: "0 32px 32px", backgroundColor: tint || "transparent", borderRadius: 2, overflow: "hidden" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 16, padding: "48px 0 24px" }}>
        <div style={{ width: 5, height: 48, borderRadius: "3px 3px 0 0", backgroundColor: color, opacity: 0.40, flexShrink: 0 }} />
        <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.14em", color, textTransform: "uppercase" as const, whiteSpace: "nowrap" as const }}>{label}</span>
        <div style={{ height: 1, flex: 1, background: `linear-gradient(90deg, ${color}15 0%, transparent 100%)` }} />
      </div>
      {children}
    </div>
  );
}

/* ================================================================== */
/*  STICKY PHASE NAV                                                   */
/* ================================================================== */
function PhaseNav({ activePhase, mobile }: { activePhase: string; mobile: boolean }) {
  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <div style={{
      position: "fixed",
      right: 16,
      top: "50%",
      transform: "translateY(-50%)",
      zIndex: 100,
      display: "flex",
      flexDirection: "column",
      gap: mobile ? 16 : 12,
      alignItems: "flex-end",
    }}>
      {PHASE_NAV.map(p => {
        const isActive = activePhase === p.id;
        return (
          <button
            key={p.id}
            onClick={() => scrollTo(p.id)}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              background: isActive ? B.surface : "rgba(254,254,254,0.85)",
              border: `1px solid ${isActive ? p.color + "40" : B.stone}`,
              borderRadius: 20,
              padding: mobile ? "6px" : "6px 12px 6px 8px",
              cursor: "pointer",
              transition: "all 200ms",
              boxShadow: isActive ? `0 2px 8px ${p.color}18` : "0 1px 4px rgba(0,0,0,0.06)",
            }}
            aria-label={p.label}
          >
            <div style={{
              width: mobile ? 10 : 8,
              height: mobile ? 10 : 8,
              borderRadius: "50%",
              backgroundColor: isActive ? p.color : p.color + "40",
              flexShrink: 0,
              transition: "background-color 200ms",
            }} />
            {!mobile && (
              <span style={{
                fontSize: 11,
                fontWeight: isActive ? 700 : 500,
                color: isActive ? p.color : B.taupe,
                letterSpacing: "0.04em",
                whiteSpace: "nowrap" as const,
                transition: "color 200ms",
              }}>{p.label}</span>
            )}
          </button>
        );
      })}
    </div>
  );
}

/* ================================================================== */
/*  INDUSTRY DATA                                                      */
/* ================================================================== */
const IND: Record<string, { general: string; redAvg: number; greenAvg: number }> = {
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
function constraintNarrative(c: string, i: CanonicalInput): string {
  const n: Record<string, string> = {
    high_concentration: `Your largest source represents ${i.largest_source_pct}% of income. If that single relationship changes, ${i.largest_source_pct}% of your revenue disappears in one decision.`,
    weak_forward_visibility: `Only ${i.forward_secured_pct}% of your income is committed forward. You are re-selling your time every month.`,
    high_labor_dependence: `${i.labor_dependence_pct}% of your income requires your active daily work. A 90-day disruption stops ${i.labor_dependence_pct}% of income.`,
    low_persistence: `Only ${i.income_persistence_pct}% of your income repeats automatically. The rest must be re-earned from scratch each month.`,
    low_source_diversity: `You have ${i.source_diversity_count} income source${i.source_diversity_count === 1 ? "" : "s"}. A single client decision has outsized power over your stability.`,
    high_variability: `Your income variability is ${i.income_variability_level}. Month-to-month swings make it harder to plan, save, and invest.`,
  };
  return n[c] || "Your primary structural constraint is limiting your score.";
}

/* ================================================================== */
/*  SHARE SCORE IMAGE                                                  */
/* ================================================================== */
function generateScoreImage(score: number, bandLabel: string, name: string, color: string): Promise<string> {
  return new Promise((resolve) => {
    const canvas = document.createElement("canvas");
    canvas.width = 600; canvas.height = 320;
    const ctx = canvas.getContext("2d")!;
    ctx.fillStyle = "#0E1A2B"; ctx.beginPath(); ctx.roundRect(0, 0, 600, 320, 16); ctx.fill();
    const cx = 150, cy = 160, r = 60, lw = 8;
    ctx.beginPath(); ctx.arc(cx, cy, r, 0, Math.PI * 2); ctx.strokeStyle = "rgba(255,255,255,0.08)"; ctx.lineWidth = lw; ctx.stroke();
    ctx.beginPath(); ctx.arc(cx, cy, r, -Math.PI / 2, -Math.PI / 2 + (score / 100) * Math.PI * 2); ctx.strokeStyle = color; ctx.lineWidth = lw; ctx.lineCap = "round"; ctx.stroke();
    ctx.fillStyle = "#FFFFFF"; ctx.font = "300 48px Inter, system-ui, sans-serif"; ctx.textAlign = "center"; ctx.fillText(String(score), cx, cy + 16);
    ctx.fillStyle = color; ctx.font = "600 11px Inter, system-ui, sans-serif"; ctx.fillText(bandLabel.toUpperCase(), cx, cy + 36);
    ctx.textAlign = "left";
    ctx.fillStyle = "rgba(255,255,255,0.4)"; ctx.font = "600 11px Inter, system-ui, sans-serif";
    ctx.fillText("INCOME STABILITY SCORE", 260, 100);
    ctx.fillStyle = "#FFFFFF"; ctx.font = "600 22px Inter, system-ui, sans-serif";
    ctx.fillText(name || "RunPayway Assessment", 260, 132);
    ctx.fillStyle = color; ctx.font = "600 16px Inter, system-ui, sans-serif";
    ctx.fillText(bandLabel, 260, 162);
    ctx.fillStyle = "rgba(255,255,255,0.3)"; ctx.font = "400 13px Inter, system-ui, sans-serif";
    ctx.fillText("Assessed by RunPayway\u2122 \u00b7 Model RP-2.0", 260, 200);
    ctx.fillStyle = "rgba(255,255,255,0.15)"; ctx.font = "700 11px Inter, system-ui, sans-serif";
    ctx.fillText("RUNPAYWAY\u2122", 260, 270);
    resolve(canvas.toDataURL("image/png"));
  });
}

/* ================================================================== */
/*  MAIN                                                               */
/* ================================================================== */
function DashboardContent() {
  const [record, setRecord] = useState<Record<string, unknown> | null>(null);
  const [assessments, setAssessments] = useState<{ record_id: string; final_score: number; stability_band: string; assessment_date_utc: string; issued_timestamp_utc?: string }[]>([]);
  const [mobile, setMobile] = useState(false);
  const [demoProfile, setDemoProfile] = useState(1);
  const [accessCode, setAccessCode] = useState("");
  const [codeError, setCodeError] = useState<string | null>(null);
  const [showWelcome, setShowWelcome] = useState(false);
  const [quickToggles, setQuickToggles] = useState<Record<string, boolean>>({});
  const [activePreset, setActivePreset] = useState<string | null>(null);
  const [savedScenarios, setSavedScenarios] = useState<{ name: string; score: number; band: string; lift: number }[]>([]);
  const [expandedScript, setExpandedScript] = useState<string | null>(null);
  const [copiedScript, setCopiedScript] = useState<string | null>(null);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);
  const [checkedItems, setCheckedItems] = useState<string[]>([]);
  const shareRef = useRef<HTMLAnchorElement>(null);
  const [shareUrl, setShareUrl] = useState<string | null>(null);
  const [activePhase, setActivePhase] = useState("phase-diagnosis");
  const [whatIfOpen, setWhatIfOpen] = useState(false);

  /* ── IntersectionObserver for phase nav ── */
  useEffect(() => {
    if (typeof IntersectionObserver === "undefined") return;
    const ids = PHASE_NAV.map(p => p.id);
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting && entry.intersectionRatio > 0) {
            setActivePhase(entry.target.id);
          }
        }
      },
      { rootMargin: "-20% 0px -60% 0px", threshold: 0 }
    );
    const timeout = setTimeout(() => {
      for (const id of ids) {
        const el = document.getElementById(id);
        if (el) observer.observe(el);
      }
    }, 100);
    return () => { clearTimeout(timeout); observer.disconnect(); };
  }, []);

  useEffect(() => { const c = () => setMobile(window.innerWidth <= 700); c(); window.addEventListener("resize", c); return () => window.removeEventListener("resize", c); }, []);

  /* ── Load data from storage or URL ?code= parameter ── */
  const searchParams = useSearchParams();
  useEffect(() => {
    // Check for ?code= in URL (bookmarkable unique link)
    const urlCode = searchParams.get("code");
    if (urlCode) {
      try {
        const d = JSON.parse(atob(urlCode));
        if (typeof d.p === "number" && typeof d.c === "number" && typeof d.l === "number") {
          const nr = { record_id: `sim-${Date.now()}`, authorization_code: "", model_version: "RP-2.0", assessment_date_utc: new Date().toISOString(), issued_timestamp_utc: new Date().toISOString(), final_score: 0, stability_band: "", assessment_title: d.n || "", classification: "", operating_structure: "", primary_income_model: d.m || "", industry_sector: d.i || "", _v2: { normalized_inputs: { income_persistence_pct: d.p, largest_source_pct: d.c, source_diversity_count: d.s, forward_secured_pct: d.f, income_variability_level: d.v || "moderate", labor_dependence_pct: d.l }, quality: { quality_score: d.q || 5 } } };
          sessionStorage.setItem("rp_record", JSON.stringify(nr));
          sessionStorage.setItem("rp_sim_code", urlCode);
          setRecord(nr);
          if (!localStorage.getItem("rp_cc_visited")) { setShowWelcome(true); }
          localStorage.setItem("rp_cc_visited", "1");
          return; // skip normal loading
        }
      } catch { /* invalid code, fall through to normal loading */ }
    }

    let stored = sessionStorage.getItem("rp_record");
    if (!stored) stored = localStorage.getItem("rp_record");
    if (stored) { try { setRecord(JSON.parse(stored)); } catch { /* */ } }
    try { const recs = JSON.parse(localStorage.getItem("rp_records") || "[]"); setAssessments(recs.sort((a: { assessment_date_utc: string; issued_timestamp_utc?: string }, b: { assessment_date_utc: string; issued_timestamp_utc?: string }) => new Date(b.assessment_date_utc || b.issued_timestamp_utc || "").getTime() - new Date(a.assessment_date_utc || a.issued_timestamp_utc || "").getTime())); } catch { /* */ }
    try { setCheckedItems(JSON.parse(localStorage.getItem("rp_reassess_checks") || "[]")); } catch { /* */ }
    try { setCompletedSteps(JSON.parse(localStorage.getItem("rp_roadmap_steps") || "[]")); } catch { /* */ }
    const hasVisited = localStorage.getItem("rp_cc_visited");
    const hasData = !!stored && stored !== "null";
    if (!hasVisited && hasData) { setShowWelcome(true); }
    localStorage.setItem("rp_cc_visited", "1");
  }, [searchParams]);

  const handleCodeSubmit = () => {
    setCodeError(null); const trimmed = accessCode.trim();
    if (!trimmed) { setCodeError("Paste your Access Code."); return; }
    try {
      const d = JSON.parse(atob(trimmed));
      if (typeof d.p !== "number" || typeof d.c !== "number" || typeof d.l !== "number") { setCodeError("Invalid code."); return; }
      const nr = { record_id: `sim-${Date.now()}`, authorization_code: "", model_version: "RP-2.0", assessment_date_utc: new Date().toISOString(), issued_timestamp_utc: new Date().toISOString(), final_score: 0, stability_band: "", assessment_title: d.n || "", classification: "", operating_structure: "", primary_income_model: d.m || "", industry_sector: d.i || "", _v2: { normalized_inputs: { income_persistence_pct: d.p, largest_source_pct: d.c, source_diversity_count: d.s, forward_secured_pct: d.f, income_variability_level: d.v || "moderate", labor_dependence_pct: d.l }, quality: { quality_score: d.q || 5 } } };
      sessionStorage.setItem("rp_record", JSON.stringify(nr)); sessionStorage.setItem("rp_sim_code", trimmed);
      window.location.reload();
    } catch { setCodeError("Invalid code. Copy the full code from your report."); }
  };

  /* ── Derived ── */
  const isDemo = IS_SAMPLE(record);
  const r = isDemo ? SAMPLE_PROFILES[demoProfile].record : record!;
  const score = (r?.final_score as number) || 0;
  const band = (r?.stability_band as string) || "";
  const v2 = r?._v2 as Record<string, unknown> | undefined;
  const ni = v2?.normalized_inputs as Record<string, number | string> | undefined;
  const bm = v2?.benchmarking as { peer_percentile: number; cluster_label: string; cluster_average_score: number } | undefined;
  const con = v2?.constraints as { root_constraint: string; secondary_constraint?: string } | undefined;
  const frag = v2?.fragility as { fragility_class: string } | undefined;
  const activeInc = (r?.active_income_level as number) || 0;
  const semiInc = (r?.semi_persistent_income_level as number) || 0;
  const persInc = (r?.persistent_income_level as number) || 0;
  const contMo = (r?.income_continuity_months as number) || 0;
  const riskDrop = (r?.risk_scenario_drop as number) || 0;
  const issuedDate = (r?.issued_timestamp_utc as string) || (r?.assessment_date_utc as string) || "";
  const daysSince = issuedDate ? Math.floor((Date.now() - new Date(issuedDate).getTime()) / (1000 * 60 * 60 * 24)) : 0;
  const sector = (r?.industry_sector as string) || "";
  const custName = (r?.assessment_title as string) || "";
  const fragLabel = frag?.fragility_class ? frag.fragility_class.charAt(0).toUpperCase() + frag.fragility_class.slice(1) : "—";
  const indLabel = sector ? fmtIndustry(sector) : "";
  const assessedDate = issuedDate ? new Date(issuedDate).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" }) : "";

  const base: CanonicalInput = ni ? {
    income_persistence_pct: ni.income_persistence_pct as number, largest_source_pct: ni.largest_source_pct as number,
    source_diversity_count: ni.source_diversity_count as number, forward_secured_pct: ni.forward_secured_pct as number,
    income_variability_level: (ni.income_variability_level || "moderate") as CanonicalInput["income_variability_level"],
    labor_dependence_pct: ni.labor_dependence_pct as number,
  } : { income_persistence_pct: 25, largest_source_pct: 60, source_diversity_count: 2, forward_secured_pct: 15, income_variability_level: "moderate" as const, labor_dependence_pct: 70 };

  const qScore = ((v2?.quality as Record<string, number>)?.quality_score) ?? 5;
  const baseRes = simulateScore(base, qScore);
  const dScore = score > 0 ? score : baseRes.overall_score;
  const dBand = band || baseRes.band;
  const indData = IND[sector] || IND.default;
  const scripts = sector ? getScriptsForSector(sector) : [];

  /* ── PressureMap ── */
  const rootCon = con?.root_constraint || "weak_forward_visibility";
  const secCon = con?.secondary_constraint || "";
  const conPreset: Record<string, string> = { high_concentration: "add_client", weak_forward_visibility: "lock_forward", high_labor_dependence: "build_passive", low_persistence: "convert_retainer", low_source_diversity: "add_client", high_variability: "convert_retainer" };
  const liftOf = (pid: string) => { const p = SIMULATOR_PRESETS.find(x => x.id === pid); if (!p) return { s: dScore, l: 0 }; const res = simulateScore(p.modify(base), qScore); return { s: res.overall_score, l: Math.max(0, res.overall_score - dScore) }; };
  const redP = conPreset[rootCon] || "convert_retainer";
  const redR = liftOf(redP);
  const grnP = rootCon === "high_labor_dependence" ? "lock_forward" : "build_passive";
  const grnR = liftOf(grnP);

  const zones = [
    { id: "active", label: "Income That Stops", pct: activeInc, color: B.red, lift: redR.l,
      txt: activeInc >= 70 ? `${activeInc}% of your income disappears the moment you stop. This is your most exposed zone.` : activeInc >= 40 ? `${activeInc}% requires active daily work. A sustained disruption creates significant pressure.` : `${activeInc}% active income is relatively well-managed.`,
      peer: activeInc > indData.redAvg ? `${activeInc - indData.redAvg}% above your sector avg of ${indData.redAvg}%` : `${indData.redAvg - activeInc}% below your sector avg of ${indData.redAvg}%` },
    { id: "semi", label: "Recurring For Now", pct: semiInc, color: B.amber, lift: 0,
      txt: semiInc < 15 ? `Only ${semiInc}% has any repeating structure.` : semiInc < 35 ? `${semiInc}% repeats on short cycles. Cancelable, but a working buffer.` : `${semiInc}% recurring is a solid foundation.`,
      peer: null as string | null },
    { id: "persistent", label: "Protected Income", pct: persInc, color: B.teal, lift: grnR.l,
      txt: persInc < 10 ? `Only ${persInc}% would continue if you stopped entirely.` : persInc < 25 ? `${persInc}% protected gives some runway.` : `${persInc}% protected is a structural advantage.`,
      peer: persInc > indData.greenAvg ? `${persInc - indData.greenAvg}% above your sector avg of ${indData.greenAvg}%` : `${indData.greenAvg - persInc}% below your sector avg of ${indData.greenAvg}%` },
  ];

  /* ── Top moves ── */
  const topMoves = SIMULATOR_PRESETS.filter(p => !["lose_top_client", "cant_work_90_days"].includes(p.id)).map(p => {
    const res = simulateScore(p.modify(base), qScore);
    return { ...p, lift: res.overall_score - dScore, projected: res.overall_score, resBand: res.band, effort: p.id === "lock_forward" || p.id === "convert_retainer" ? "Low" : "High", speed: p.id === "lock_forward" || p.id === "convert_retainer" ? "Fast" : "Gradual" };
  }).filter(p => p.lift > 0).sort((a, b) => b.lift - a.lift);

  const scriptFor = (pid: string) => { if (!scripts.length) return null; if (pid === "convert_retainer") return scripts.find(s => s.id.includes("retainer")) || scripts[0]; if (pid === "add_client") return scripts.find(s => s.id.includes("diversi") || s.id.includes("referral")) || scripts[1]; if (pid === "build_passive") return scripts[2] || scripts[0]; return scripts[0]; };

  /* ── Roadmap ── */
  const phases = [{ weeks: "Week 1–2" }, { weeks: "Week 3–4" }, { weeks: "Week 5–8" }, { weeks: "Week 9–12" }];
  const roadmap = topMoves.slice(0, 4).map((m, i) => ({ ...phases[i], action: m.label, pid: m.id, lift: m.lift, desc: m.description }));
  const toggleStep = useCallback((idx: number) => { setCompletedSteps(prev => { const n = prev.includes(idx) ? prev.filter(i => i !== idx) : [...prev, idx]; localStorage.setItem("rp_roadmap_steps", JSON.stringify(n)); return n; }); }, []);

  /* ── Quick progress ── */
  const qActions = [
    { id: "client", label: "Added a new client", pid: "add_client" },
    { id: "retainer", label: "Signed a retainer", pid: "convert_retainer" },
    { id: "passive", label: "Built passive income", pid: "build_passive" },
    { id: "forward", label: "Secured forward revenue", pid: "lock_forward" },
  ];
  let qInputs = { ...base };
  const qCount = Object.values(quickToggles).filter(Boolean).length;
  for (const a of qActions) { if (quickToggles[a.id]) { const p = SIMULATOR_PRESETS.find(x => x.id === a.pid); if (p) qInputs = p.modify(qInputs); } }
  const qResult = simulateScore(qInputs, qScore);
  const qLift = qCount > 0 ? qResult.overall_score - dScore : 0;

  /* ── Scenario — Change 5: auto-select best preset ── */
  const effectivePreset = activePreset ?? (topMoves[0]?.id || null);
  const aPO = SIMULATOR_PRESETS.find(p => p.id === effectivePreset);
  const sInputs = aPO ? aPO.modify(base) : base;
  const sResult = aPO ? simulateScore(sInputs, qScore) : baseRes;
  const sDelta = aPO ? sResult.overall_score - dScore : 0;
  const sTL: TimelinePoint[] = aPO ? projectTimeline(base, sInputs, qScore) : [];

  /* ── Stress ── */
  const stLC = simulateScore(SIMULATOR_PRESETS.find(p => p.id === "lose_top_client")!.modify(base), qScore);
  const stNW = simulateScore(SIMULATOR_PRESETS.find(p => p.id === "cant_work_90_days")!.modify(base), qScore);

  /* ── Progress ── */
  const nextT = dScore < 30 ? 30 : dScore < 50 ? 50 : dScore < 75 ? 75 : 100;
  const nextB = dScore < 30 ? "Developing" : dScore < 50 ? "Established" : dScore < 75 ? "High" : "Maximum";
  const gap = nextT - dScore;

  /* ── Reassessment — merged with progress check (Change 4) ── */
  const returnMsg = qCount >= 2 ? "You have made enough structural changes to warrant a reassessment." : topMoves[0] ? `Come back after you ${topMoves[0].label.toLowerCase()}. Worth +${topMoves[0].lift} points.` : "Come back after making a structural change.";

  const copyScript = (txt: string, id: string) => { navigator.clipboard.writeText(txt).then(() => { setCopiedScript(id); setTimeout(() => setCopiedScript(null), 2000); }); };

  const handleShare = async () => {
    const bl = dScore >= 75 ? "High Stability" : dScore >= 50 ? "Established Stability" : dScore >= 30 ? "Developing Stability" : "Limited Stability";
    const url = await generateScoreImage(dScore, bl, custName, bc(dScore));
    setShareUrl(url);
    setTimeout(() => { if (shareRef.current) shareRef.current.click(); setShareUrl(null); }, 150);
  };

  /* ================================================================ */
  /*  RENDER                                                           */
  /* ================================================================ */
  return (
    <>
      <title>Command Center | RunPayway</title>
      <div style={{ minHeight: "100vh", backgroundColor: B.bg, fontFamily: INTER }}>
        <style>{`
          @media(max-width:700px){
            .d-2col{flex-direction:column!important;}
            .d-3col{grid-template-columns:1fr!important;}
            .d-metrics{flex-direction:column!important;}
            .d-compare{flex-direction:column!important;}
            .d-score-hero{flex-direction:column!important;align-items:center!important;text-align:center!important;}
            .d-phase{margin:0 -16px!important;padding:0 16px 24px!important;}
          }
          @keyframes fadeSlideIn { from { opacity: 0; transform: translateY(12px); } to { opacity: 1; transform: translateY(0); } }
        `}</style>
        <SuiteHeader current="dashboard" />
        {shareUrl && <a ref={shareRef} href={shareUrl} download={`runpayway-score-${dScore}.png`} style={{ display: "none" }}>dl</a>}

        {/* Change 1: Sticky phase nav */}
        <PhaseNav activePhase={activePhase} mobile={mobile} />

        <div style={{ maxWidth: 880, margin: "0 auto", padding: mobile ? "24px 16px 60px" : "40px 32px 80px", overflow: "hidden" }}>

          {/* Personalized header */}
          {!isDemo && custName && (
            <div style={{ marginBottom: 8 }}>
              <span style={{ fontSize: 15, color: B.muted }}>{custName}&rsquo;s Command Center</span>
              {indLabel && <span style={{ fontSize: 13, color: B.taupe }}> &middot; {indLabel}</span>}
            </div>
          )}

          {/* ── FIRST-VISIT WELCOME ── */}
          {showWelcome && !isDemo && (
            <div style={{ padding: mobile ? "28px 20px" : "36px 40px", borderRadius: 16, background: `linear-gradient(135deg, ${B.navy} 0%, #1a1840 50%, ${B.purple} 100%)`, marginBottom: 32, animation: "fadeSlideIn 600ms ease-out", position: "relative" }}>
              <button onClick={() => setShowWelcome(false)} style={{ position: "absolute", top: 16, right: 18, fontSize: 17, color: "rgba(255,255,255,0.4)", background: "none", border: "none", cursor: "pointer", minHeight: 44, minWidth: 44 }}>×</button>
              <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.12em", color: B.teal, marginBottom: 16 }}>WELCOME TO YOUR COMMAND CENTER</div>
              <div style={{ fontSize: mobile ? 22 : 28, fontWeight: 300, color: "#F4F1EA", lineHeight: 1.2, marginBottom: 16 }}>
                {custName ? `${custName}, your` : "Your"} score is <span style={{ fontWeight: 600, color: B.white }}>{dScore}</span>.
                {bm ? ` That puts you ahead of ${bm.peer_percentile}% of ${bm.cluster_label.toLowerCase()}.` : ""}
              </div>
              <p style={{ fontSize: 15, color: "rgba(244,241,234,0.55)", lineHeight: 1.6, margin: "0 0 24px", maxWidth: 560 }}>
                {gap > 0 ? `You are ${gap} points from ${nextB} Stability. Your 12-week roadmap below shows exactly how to get there.` : "You have achieved the highest stability band. Your roadmap focuses on maintaining and strengthening this position."}
              </p>
              <button onClick={() => setShowWelcome(false)} style={{ padding: "12px 28px", borderRadius: 8, backgroundColor: "rgba(255,255,255,0.10)", border: "1px solid rgba(255,255,255,0.15)", color: "#F4F1EA", fontSize: 15, fontWeight: 600, cursor: "pointer", minHeight: 48 }}>
                Show my plan →
              </button>
            </div>
          )}

          {/* ════════════════════════════════════════════════════════ */}
          {/*  ORIENT — "Where am I?"                                 */}
          {/* ════════════════════════════════════════════════════════ */}
          <PhaseSep label="Your Diagnosis" color={B.purple} tint="rgba(75,63,174,0.02)" id="phase-diagnosis">

          {/* 1. SCORE + BENCHMARKING */}
          <section style={{ marginBottom: 24 }}>
            <div style={{ padding: mobile ? "28px 20px" : "32px 36px", border: `1px solid ${B.stone}`, borderRadius: 16, backgroundColor: B.surface }}>
              <div style={{ display: "flex", alignItems: "center", gap: mobile ? 20 : 32 }} className="d-score-hero">
                <ScoreRing score={dScore} size={mobile ? 130 : 160} />
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 15, color: B.muted, marginBottom: 8 }}>{gap > 0 ? `${gap} points to ${nextB}` : "Highest band achieved"}</div>
                  {bm && (
                    <div style={{ padding: "12px 16px", borderRadius: 8, backgroundColor: `${B.purple}05`, border: `1px solid ${B.purple}08`, marginBottom: 16 }}>
                      <div style={{ fontSize: 17, fontWeight: 600, color: B.navy }}>Top {100 - bm.peer_percentile}% of {bm.cluster_label}</div>
                      <div style={{ fontSize: 15, color: dScore > bm.cluster_average_score ? B.teal : B.red, fontWeight: 600, marginTop: 4 }}>
                        {dScore > bm.cluster_average_score ? `+${dScore - bm.cluster_average_score} above` : `${dScore - bm.cluster_average_score} below`} cluster avg ({bm.cluster_average_score})
                      </div>
                    </div>
                  )}
                  <div style={{ display: "flex", gap: 8, flexWrap: "wrap" as const }} className="d-metrics">
                    {[
                      { label: "Runway", value: contMo < 1 ? "< 1 mo" : `${contMo.toFixed(1)} mo`, color: contMo < 3 ? B.red : B.teal },
                      { label: "Top source risk", value: `−${riskDrop}`, color: riskDrop > 15 ? B.red : B.amber },
                      { label: "Fragility", value: fragLabel, color: fragLabel === "Brittle" || fragLabel === "Fragile" ? B.red : fragLabel === "Resilient" ? B.teal : B.amber },
                    ].map(m => (
                      <div key={m.label} style={{ flex: 1, minWidth: 100, padding: "11px 16px", border: `1px solid ${B.stone}`, borderRadius: 8, display: "flex", justifyContent: "space-between", alignItems: "center", minHeight: 44 }}>
                        <span style={{ fontSize: 13, color: B.taupe }}>{m.label}</span>
                        <span style={{ fontSize: 17, fontWeight: 300, color: m.color }}>{m.value}</span>
                      </div>
                    ))}
                  </div>
                  <div style={{ display: "flex", gap: 8, marginTop: 12, flexWrap: "wrap" as const }}>
                    <button onClick={handleShare} style={{ fontSize: 13, fontWeight: 600, color: B.purple, background: "none", border: `1px solid ${B.purple}15`, borderRadius: 8, padding: "8px 16px", cursor: "pointer", minHeight: 36 }}>Share Score ↓</button>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* ── VIEW REPORT — prominent, easy to find ── */}
          {!isDemo && (
            <div style={{ display: "flex", gap: 12, marginBottom: 24, flexDirection: mobile ? "column" : "row" }}>
              <Link href="/review" style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "space-between", padding: "16px 20px", borderRadius: 12, backgroundColor: B.surface, border: `1px solid ${B.stone}`, textDecoration: "none", minHeight: 48, transition: "border-color 200ms" }}
                onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.borderColor = `${B.purple}30`; }}
                onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.borderColor = B.stone; }}>
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <div style={{ width: 32, height: 32, borderRadius: 8, backgroundColor: `${B.purple}08`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={B.purple} strokeWidth="2" strokeLinecap="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
                  </div>
                  <div>
                    <div style={{ fontSize: 15, fontWeight: 600, color: B.navy }}>View Your Report</div>
                    <div style={{ fontSize: 12, color: B.taupe }}>Full diagnostic with key findings</div>
                  </div>
                </div>
                <span style={{ fontSize: 17, color: B.purple }}>→</span>
              </Link>
              <button onClick={handleShare} style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8, padding: "16px 20px", borderRadius: 12, backgroundColor: B.surface, border: `1px solid ${B.stone}`, cursor: "pointer", minHeight: 48, transition: "border-color 200ms" }}
                onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.borderColor = `${B.teal}30`; }}
                onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.borderColor = B.stone; }}>
                <div style={{ width: 32, height: 32, borderRadius: 8, backgroundColor: `${B.teal}08`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={B.teal} strokeWidth="2" strokeLinecap="round"><path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"/><polyline points="16 6 12 2 8 6"/><line x1="12" y1="2" x2="12" y2="15"/></svg>
                </div>
                <div style={{ textAlign: "left" as const }}>
                  <div style={{ fontSize: 15, fontWeight: 600, color: B.navy }}>Share Score</div>
                  <div style={{ fontSize: 12, color: B.taupe }}>Download as image</div>
                </div>
              </button>
            </div>
          )}

          {/* 2. PRESSUREMAP™ */}
          <section>
            <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", marginBottom: 16 }}>
              <div>
                <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.12em", color: B.purple }}>RUNPAYWAY&#8482; PRESSUREMAP&#8482;</div>
                {indLabel && <p style={{ fontSize: 15, color: B.muted, margin: "4px 0 0" }}>Analysis for {indLabel.toLowerCase()} professionals.</p>}
              </div>
              <div style={{ fontSize: 11, color: B.taupe, textAlign: "right" as const }}>
                {assessedDate && <div>Analyzed {assessedDate}</div>}
                <div>Model RP-2.0</div>
              </div>
            </div>

            <div style={{ padding: mobile ? "20px 16px" : "24px 28px", border: `1px solid ${B.stone}`, borderLeft: `4px solid ${B.red}`, borderRadius: 12, backgroundColor: B.surface, marginBottom: 16 }}>
              <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.10em", color: B.red, marginBottom: 8 }}>ROOT CONSTRAINT</div>
              <p style={{ fontSize: 15, color: B.navy, margin: 0, lineHeight: 1.65 }}>{constraintNarrative(rootCon, base)}</p>
              {secCon && <p style={{ fontSize: 13, color: B.muted, margin: "8px 0 0", fontStyle: "italic" }}>Secondary: {secCon.replace(/_/g, " ").replace(/\b\w/g, c => c.toUpperCase())}</p>}
            </div>

            <div style={{ padding: mobile ? "20px 16px" : "22px 28px", border: `1px solid ${B.stone}`, borderRadius: 12, backgroundColor: B.surface, marginBottom: 12 }}>
              <div style={{ display: "flex", height: 40, borderRadius: 8, overflow: "hidden", border: `1px solid ${B.stone}`, marginBottom: 12 }}>
                {zones.map(z => z.pct > 0 ? <div key={z.id} style={{ width: `${z.pct}%`, backgroundColor: `${z.color}18`, display: "flex", alignItems: "center", justifyContent: "center", borderRight: z.id !== "persistent" ? `2px solid ${B.white}` : "none" }}>{z.pct >= 12 && <span style={{ fontSize: 15, fontWeight: 600, color: z.color }}>{z.pct}%</span>}</div> : null)}
              </div>
              <p style={{ fontSize: 13, color: B.taupe, margin: 0, fontStyle: "italic" }}>{indData.general}</p>
            </div>

            {zones.map(z => (
              <div key={z.id} style={{ padding: mobile ? "16px 16px" : "20px 24px", border: `1px solid ${B.stone}`, borderLeft: `3px solid ${z.color}`, borderRadius: 12, backgroundColor: B.surface, marginBottom: 8 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 8 }}>
                  <div style={{ display: "flex", alignItems: "baseline", gap: 8 }}>
                    <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.10em", color: z.color }}>{z.label.toUpperCase()}</span>
                    <span style={{ fontSize: 22, fontWeight: 300, color: z.color }}>{z.pct}%</span>
                  </div>
                  {z.lift > 0 && <span style={{ fontSize: 13, fontWeight: 600, color: B.teal }}>+{z.lift} if fixed</span>}
                </div>
                <p style={{ fontSize: 15, color: B.navy, margin: "0 0 4px", lineHeight: 1.6 }}>{z.txt}</p>
                {z.peer && <p style={{ fontSize: 13, color: B.taupe, margin: 0, fontStyle: "italic" }}>{z.peer}</p>}
              </div>
            ))}
          </section>

          {/* Change 3: Demo card moves AFTER score + PressureMap */}
          {isDemo && (
            <div style={{ padding: mobile ? "16px 16px" : "16px 24px", borderRadius: 12, backgroundColor: B.surface, border: `1px solid ${B.purple}15`, marginTop: 16 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap" as const }}>
                <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.10em", color: B.purple, whiteSpace: "nowrap" as const }}>SAMPLE DATA</div>
                <div style={{ display: "flex", gap: 4, flexWrap: "wrap" as const }}>
                  {SAMPLE_PROFILES.map((p, i) => (
                    <button key={p.id} onClick={() => { setDemoProfile(i); setActivePreset(null); setSavedScenarios([]); setQuickToggles({}); }}
                      style={{ padding: "6px 12px", borderRadius: 20, fontSize: 13, fontWeight: demoProfile === i ? 600 : 400, color: demoProfile === i ? "#FFF" : B.navy, backgroundColor: demoProfile === i ? (p.id === "limited" ? B.red : p.id === "developing" ? B.amber : p.id === "established" ? B.bandEstablished : B.teal) : "transparent", border: `1.5px solid ${demoProfile === i ? "transparent" : B.stone}`, cursor: "pointer", transition: "all 200ms", minHeight: 32, lineHeight: 1 }}
                    >{p.label}</button>
                  ))}
                </div>
                <div style={{ height: 24, width: 1, backgroundColor: B.stone, flexShrink: 0 }} />
                <div style={{ display: "flex", gap: 6, flex: 1, minWidth: 200 }}>
                  <input value={accessCode} onChange={(e) => { setAccessCode(e.target.value); setCodeError(null); }} placeholder="Paste access code" onKeyDown={(e) => { if (e.key === "Enter") handleCodeSubmit(); }}
                    style={{ padding: "8px 12px", fontSize: 13, fontFamily: "monospace", border: `1px solid ${B.stone}`, borderRadius: 8, outline: "none", flex: 1, boxSizing: "border-box" as const, minHeight: 36 }} />
                  <button onClick={handleCodeSubmit} style={{ padding: "8px 16px", fontSize: 13, fontWeight: 600, color: B.white, backgroundColor: B.purple, border: "none", borderRadius: 8, cursor: "pointer", whiteSpace: "nowrap" as const, minHeight: 36 }}>Load</button>
                </div>
              </div>
              {codeError && <div style={{ fontSize: 13, color: B.red, marginTop: 6 }}>{codeError}</div>}
            </div>
          )}

          </PhaseSep>

          {/* ════════════════════════════════════════════════════════ */}
          {/*  DECIDE — "What should I do?"                           */}
          {/* ════════════════════════════════════════════════════════ */}
          <PhaseSep label="Your Plan" color={B.navy} tint="rgba(14,26,43,0.015)" id="phase-plan">

          {/* 3. #1 PRIORITY */}
          {topMoves.length > 0 && (() => {
            const mv = topMoves[0]; const sc = scriptFor(mv.id);
            return (
              <section style={{ marginBottom: 24 }}>
                <div style={{ border: `1px solid ${B.stone}`, borderLeft: `4px solid ${B.purple}`, borderRadius: 16, backgroundColor: B.surface, overflow: "hidden" }}>
                  <div style={{ padding: mobile ? "24px 20px" : "28px 32px" }}>
                    <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.12em", color: B.purple, marginBottom: 8 }}>YOUR #1 PRIORITY</div>
                    <div style={{ fontSize: 22, fontWeight: 600, color: B.navy, lineHeight: 1.3, marginBottom: 8 }}>{mv.label}</div>
                    <p style={{ fontSize: 15, color: B.muted, margin: "0 0 16px", lineHeight: 1.6 }}>{mv.description}</p>
                    <div style={{ display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap" as const }}>
                      <span style={{ fontSize: 22, fontWeight: 300, color: B.teal }}>+{mv.lift} pts</span>
                      {mv.resBand !== dBand && <span style={{ fontSize: 13, fontWeight: 600, color: B.purple, backgroundColor: `${B.purple}08`, padding: "4px 12px", borderRadius: 20 }}>→ {mv.resBand}</span>}
                      <span style={{ fontSize: 13, color: B.taupe, backgroundColor: B.stone, padding: "4px 12px", borderRadius: 20 }}>{mv.effort} effort · {mv.speed}</span>
                    </div>
                  </div>
                  {sc && (
                    <div style={{ padding: mobile ? "20px 20px" : "24px 32px", borderTop: `1px solid ${B.stone}`, backgroundColor: `${B.purple}02` }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
                        <div><div style={{ fontSize: 15, fontWeight: 600, color: B.navy }}>{sc.title}</div><div style={{ fontSize: 13, color: B.muted, marginTop: 2 }}>{sc.context}</div></div>
                        <button onClick={() => copyScript(sc.script, sc.id)} style={{ fontSize: 13, fontWeight: 600, color: copiedScript === sc.id ? B.teal : B.purple, backgroundColor: copiedScript === sc.id ? `${B.teal}08` : `${B.purple}08`, border: "none", borderRadius: 8, padding: "11px 20px", cursor: "pointer", whiteSpace: "nowrap" as const, minHeight: 44 }}>{copiedScript === sc.id ? "Copied!" : "Copy Script"}</button>
                      </div>
                      <pre style={{ fontSize: 15, color: B.navy, lineHeight: 1.7, whiteSpace: "pre-wrap" as const, margin: 0, padding: "20px 24px", backgroundColor: B.surface, borderRadius: 12, border: `1px solid ${B.stone}`, fontFamily: INTER }}>{sc.script}</pre>
                    </div>
                  )}
                </div>
              </section>
            );
          })()}

          {/* 4. 12-WEEK ROADMAP */}
          {roadmap.length > 1 && (
            <section>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 16 }}>
                <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.12em", color: B.taupe }}>YOUR 12-WEEK ROADMAP</div>
                {completedSteps.length > 0 && <span style={{ fontSize: 13, fontWeight: 600, color: B.teal }}>{completedSteps.length}/{roadmap.length} completed</span>}
              </div>
              <div style={{ border: `1px solid ${B.stone}`, borderRadius: 16, backgroundColor: B.surface, overflow: "hidden" }}>
                {roadmap.map((step, i) => {
                  const sc = scriptFor(step.pid); const isExp = expandedScript === `rm-${i}`; const done = completedSteps.includes(i);
                  return (
                    <div key={i} style={{ borderBottom: i < roadmap.length - 1 ? `1px solid ${B.stone}` : "none", opacity: done ? 0.5 : 1, transition: "opacity 300ms" }}>
                      <div style={{ padding: mobile ? "20px 16px" : "22px 28px", display: "flex", gap: 16, alignItems: "flex-start" }}>
                        <div style={{ flexShrink: 0, textAlign: "center" as const, minWidth: 48 }}>
                          <button onClick={() => toggleStep(i)} style={{ width: 36, height: 36, borderRadius: "50%", backgroundColor: done ? B.teal : i === 0 ? `${B.purple}12` : `${B.teal}08`, border: `2px solid ${done ? B.teal : i === 0 ? `${B.purple}30` : `${B.teal}20`}`, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", transition: "all 200ms", margin: "0 auto 4px" }}>
                            {done ? <span style={{ color: B.white, fontSize: 15, fontWeight: 700 }}>&#10003;</span> : <span style={{ fontSize: 15, fontWeight: 700, color: i === 0 ? B.purple : B.teal }}>{i + 1}</span>}
                          </button>
                          <div style={{ fontSize: 11, fontWeight: 600, color: B.taupe, lineHeight: 1.2 }}>{step.weeks}</div>
                        </div>
                        <div style={{ flex: 1 }}>
                          <div style={{ fontSize: 17, fontWeight: 600, color: done ? B.muted : B.navy, marginBottom: 4, textDecoration: done ? "line-through" : "none" }}>{step.action}</div>
                          <p style={{ fontSize: 15, color: B.muted, margin: "0 0 8px", lineHeight: 1.55 }}>{step.desc}</p>
                          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                            <span style={{ fontSize: 15, fontWeight: 600, color: B.teal }}>+{step.lift} pts</span>
                            {sc && <button onClick={() => setExpandedScript(isExp ? null : `rm-${i}`)} style={{ fontSize: 13, fontWeight: 600, color: B.purple, background: "none", border: `1px solid ${B.purple}15`, borderRadius: 8, padding: "6px 16px", cursor: "pointer", minHeight: 32 }}>{isExp ? "Hide script ▲" : "Script ▼"}</button>}
                          </div>
                        </div>
                      </div>
                      {isExp && sc && (
                        <div style={{ padding: mobile ? "16px 16px 24px" : "16px 28px 24px", backgroundColor: `${B.purple}02` }}>
                          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
                            <span style={{ fontSize: 15, fontWeight: 600, color: B.navy }}>{sc.title}</span>
                            <button onClick={() => copyScript(sc.script, sc.id)} style={{ fontSize: 13, fontWeight: 600, color: copiedScript === sc.id ? B.teal : B.purple, backgroundColor: copiedScript === sc.id ? `${B.teal}08` : `${B.purple}08`, border: "none", borderRadius: 8, padding: "8px 16px", cursor: "pointer", minHeight: 36 }}>{copiedScript === sc.id ? "Copied!" : "Copy"}</button>
                          </div>
                          <pre style={{ fontSize: 15, color: B.navy, lineHeight: 1.65, whiteSpace: "pre-wrap" as const, margin: 0, padding: "16px 20px", backgroundColor: B.surface, borderRadius: 10, border: `1px solid ${B.stone}`, fontFamily: INTER }}>{sc.script}</pre>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </section>
          )}

          </PhaseSep>

          {/* ════════════════════════════════════════════════════════ */}
          {/*  ACT — "Let me test it"                                 */}
          {/* ════════════════════════════════════════════════════════ */}
          <PhaseSep label="Test Your Options" color={B.teal} tint="rgba(31,109,122,0.02)" id="phase-test">

          {/* Change 2: Collapsible What-If Explorer */}
          <section>
            <button
              onClick={() => setWhatIfOpen(!whatIfOpen)}
              style={{
                width: "100%",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                padding: mobile ? "20px 20px" : "22px 28px",
                border: `1px solid ${B.stone}`,
                borderRadius: whatIfOpen ? "12px 12px 0 0" : 12,
                backgroundColor: B.surface,
                cursor: "pointer",
                transition: "border-radius 200ms",
              }}
            >
              <div style={{ textAlign: "left" as const, flex: 1 }}>
                <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.12em", color: B.teal, marginBottom: 4 }}>WHAT-IF EXPLORER</div>
                <div style={{ fontSize: 15, color: B.muted }}>Test your options — what would happen if you changed something?</div>
              </div>
              {!whatIfOpen && topMoves[0] && (
                <div style={{ textAlign: "right" as const, flexShrink: 0, marginLeft: 16, marginRight: 8 }}>
                  <div style={{ fontSize: 17, fontWeight: 300, color: B.teal }}>+{topMoves[0].lift}</div>
                  <div style={{ fontSize: 11, color: B.taupe }}>best move</div>
                </div>
              )}
              <span style={{ fontSize: 17, color: B.taupe, flexShrink: 0, marginLeft: 16, transition: "transform 200ms", transform: whatIfOpen ? "rotate(180deg)" : "rotate(0deg)" }}>▼</span>
            </button>

            {whatIfOpen && (
              <div style={{ border: `1px solid ${B.stone}`, borderTop: "none", borderRadius: "0 0 12px 12px", backgroundColor: B.surface, padding: mobile ? "20px 16px" : "24px 28px" }}>
                <div style={{ display: "grid", gridTemplateColumns: mobile ? "1fr" : "repeat(3, 1fr)", gap: 8, marginBottom: 16 }} className="d-3col">
                  {SIMULATOR_PRESETS.map(pr => {
                    const res = simulateScore(pr.modify(base), qScore); const lift = res.overall_score - dScore;
                    const isA = effectivePreset === pr.id; const neg = lift < 0;
                    return (
                      <button key={pr.id} onClick={() => setActivePreset(isA && activePreset === pr.id ? null : pr.id)}
                        style={{ padding: "16px 20px", textAlign: "left" as const, borderRadius: 12, cursor: "pointer", transition: "all 200ms", border: `1px solid ${isA ? (neg ? B.red : B.purple) + "40" : B.stone}`, backgroundColor: isA ? (neg ? `${B.red}05` : `${B.purple}06`) : "transparent", minHeight: 48 }}>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                          <span style={{ fontSize: 15, fontWeight: 600, color: isA ? B.navy : B.muted }}>{pr.label}</span>
                          <span style={{ fontSize: 17, fontWeight: 700, color: lift >= 0 ? B.teal : B.red }}>{lift > 0 ? "+" : ""}{lift}</span>
                        </div>
                        <p style={{ fontSize: 13, color: B.taupe, margin: 0, lineHeight: 1.45 }}>{pr.description}</p>
                      </button>
                    );
                  })}
                </div>

                {effectivePreset && aPO && (
                  <div style={{ padding: mobile ? "24px 16px" : "24px 28px", border: `1px solid ${B.stone}`, borderRadius: 12, backgroundColor: "transparent", marginBottom: 16 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 16, flexWrap: "wrap" as const }}>
                      <div>
                        <div style={{ fontSize: 17, fontWeight: 600, color: B.navy, marginBottom: 8 }}>{aPO.label}</div>
                        <div style={{ fontSize: 22, fontWeight: 300, color: sDelta >= 0 ? B.teal : B.red }}>{dScore} → {sResult.overall_score} ({sDelta > 0 ? "+" : ""}{sDelta})</div>
                        {sResult.band !== dBand && <div style={{ fontSize: 15, fontWeight: 600, color: B.purple, marginTop: 4 }}>→ {sResult.band}</div>}
                      </div>
                      {savedScenarios.length < 3 && sDelta !== 0 && (
                        <button onClick={() => setSavedScenarios(prev => [...prev, { name: aPO.label, score: sResult.overall_score, band: sResult.band, lift: sDelta }])}
                          style={{ fontSize: 13, fontWeight: 600, color: B.teal, backgroundColor: `${B.teal}06`, border: `1px solid ${B.teal}18`, borderRadius: 8, padding: "11px 20px", cursor: "pointer", minHeight: 44 }}>
                          Save Path ({3 - savedScenarios.length} left)
                        </button>
                      )}
                    </div>
                    {sTL.length > 0 && (
                      <div style={{ marginTop: 24 }}>
                        <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.10em", color: B.taupe, marginBottom: 12 }}>PROJECTED TRAJECTORY</div>
                        <div style={{ display: "flex", gap: 8, flexDirection: mobile ? "column" : "row" }}>
                          <div style={{ flex: 0, padding: "12px 16px", border: `1px solid ${B.stone}`, borderRadius: 8, textAlign: "center" as const, minHeight: 48 }}><div style={{ fontSize: 11, fontWeight: 600, color: B.taupe }}>NOW</div><div style={{ fontSize: 22, fontWeight: 300, color: B.navy }}>{dScore}</div></div>
                          {sTL.map(pt => (
                            <div key={pt.month} style={{ flex: 1, padding: "12px 16px", border: `1px solid ${B.stone}`, borderRadius: 8, textAlign: "center" as const, minHeight: 48 }}>
                              <div style={{ fontSize: 11, fontWeight: 600, color: B.taupe }}>{pt.label.toUpperCase()}</div>
                              <div style={{ fontSize: 22, fontWeight: 300, color: pt.delta >= 0 ? B.teal : B.red }}>{pt.score}</div>
                              <div style={{ fontSize: 13, color: B.muted, marginTop: 4 }}>{pt.narrative.split(".")[0]}.</div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {savedScenarios.length > 0 && (
                  <div style={{ padding: mobile ? "24px 16px" : "24px 28px", border: `1px solid ${B.stone}`, borderRadius: 12, backgroundColor: "transparent" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
                      <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.10em", color: B.purple }}>COMPARE PATHS</div>
                      <button onClick={() => setSavedScenarios([])} style={{ fontSize: 13, color: B.muted, background: "none", border: "none", cursor: "pointer", textDecoration: "underline", minHeight: 32 }}>Clear</button>
                    </div>
                    <div style={{ display: "flex", gap: 12 }} className="d-compare">
                      <div style={{ flex: 1, padding: "20px 16px", borderRadius: 12, border: `1px solid ${B.stone}`, textAlign: "center" as const }}>
                        <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.10em", color: B.taupe, marginBottom: 8 }}>CURRENT</div>
                        <div style={{ fontSize: 32, fontWeight: 300, color: B.navy }}>{dScore}</div>
                        <div style={{ fontSize: 13, fontWeight: 600, color: bc(dScore), marginTop: 4 }}>{dBand}</div>
                      </div>
                      {savedScenarios.map((s, i) => (
                        <div key={i} style={{ flex: 1, padding: "20px 16px", borderRadius: 12, border: `1px solid ${B.teal}18`, backgroundColor: `${B.teal}03`, textAlign: "center" as const, position: "relative" }}>
                          <button onClick={() => setSavedScenarios(prev => prev.filter((_, j) => j !== i))} style={{ position: "absolute", top: 8, right: 10, fontSize: 15, color: B.taupe, background: "none", border: "none", cursor: "pointer", minHeight: 32, minWidth: 32 }}>×</button>
                          <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.10em", color: B.teal, marginBottom: 8 }}>PATH {String.fromCharCode(65 + i)}</div>
                          <div style={{ fontSize: 32, fontWeight: 300, color: B.teal }}>{s.score}</div>
                          <div style={{ fontSize: 13, fontWeight: 600, color: bc(s.score), marginTop: 4 }}>{s.band}</div>
                          <div style={{ fontSize: 15, fontWeight: 600, color: B.teal, marginTop: 8 }}>+{s.lift}</div>
                          <div style={{ fontSize: 13, color: B.muted, marginTop: 4 }}>{s.name}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </section>

          </PhaseSep>

          {/* ════════════════════════════════════════════════════════ */}
          {/*  MONITOR — "Am I progressing?"                          */}
          {/* ════════════════════════════════════════════════════════ */}
          <PhaseSep label="Track Progress" color={B.taupe} tint="rgba(14,26,43,0.01)" id="phase-progress">

          {/* Change 4: Merged TRACK YOUR PROGRESS section */}
          <section style={{ marginBottom: 16, padding: mobile ? "24px 20px" : "28px 32px", border: `1px solid ${B.stone}`, borderRadius: 16, backgroundColor: B.surface }}>
            <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.12em", color: B.teal, marginBottom: 8 }}>TRACK YOUR PROGRESS</div>
            <div style={{ fontSize: 17, fontWeight: 600, color: B.navy, marginBottom: 8 }}>Has anything changed?</div>
            <p style={{ fontSize: 15, color: B.muted, margin: "0 0 16px" }}>Toggle what you have done. Score updates instantly.</p>

            <div style={{ display: "flex", gap: 24, flexDirection: mobile ? "column" : "row" }} className="d-2col">
              <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 8 }}>
                {qActions.map(a => (
                  <button key={a.id} onClick={() => setQuickToggles(prev => ({ ...prev, [a.id]: !prev[a.id] }))}
                    style={{ display: "flex", alignItems: "center", gap: 12, padding: "14px 16px", borderRadius: 10, cursor: "pointer", border: `1px solid ${quickToggles[a.id] ? `${B.teal}30` : B.stone}`, backgroundColor: quickToggles[a.id] ? `${B.teal}05` : "transparent", transition: "all 200ms", textAlign: "left" as const, minHeight: 48 }}>
                    <div style={{ width: 24, height: 24, borderRadius: 6, border: `2px solid ${quickToggles[a.id] ? B.teal : B.faint}`, backgroundColor: quickToggles[a.id] ? B.teal : "transparent", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                      {quickToggles[a.id] && <span style={{ color: "#FFF", fontSize: 13, fontWeight: 700 }}>&#10003;</span>}
                    </div>
                    <span style={{ fontSize: 15, fontWeight: quickToggles[a.id] ? 600 : 400, color: quickToggles[a.id] ? B.navy : B.muted }}>{a.label}</span>
                  </button>
                ))}
              </div>
              <div style={{ flex: 0, minWidth: mobile ? "auto" : 200, textAlign: "center" as const, padding: "28px 24px", borderRadius: 12, backgroundColor: qCount > 0 ? `${B.teal}05` : `${B.stone}`, border: `1px solid ${qCount > 0 ? `${B.teal}18` : B.stone}`, display: "flex", flexDirection: "column", justifyContent: "center" }}>
                {qCount > 0 ? (
                  <>
                    <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.10em", color: B.teal, marginBottom: 16 }}>ESTIMATED</div>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8, marginBottom: 8 }}>
                      <span style={{ fontSize: 22, fontWeight: 300, color: B.taupe }}>{dScore}</span>
                      <span style={{ fontSize: 17, color: B.taupe }}>→</span>
                      <span style={{ fontSize: 36, fontWeight: 300, color: B.teal }}>{qResult.overall_score}</span>
                    </div>
                    <div style={{ fontSize: 22, fontWeight: 700, color: B.teal }}>+{qLift}</div>
                    {qResult.band !== dBand && <div style={{ fontSize: 13, color: B.purple, fontWeight: 600, marginTop: 8 }}>→ {qResult.band}</div>}
                    <div style={{ fontSize: 13, color: B.taupe, marginTop: 16 }}>Directional estimate</div>
                  </>
                ) : (
                  <><div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.10em", color: B.taupe, marginBottom: 8 }}>CURRENT</div><div style={{ fontSize: 40, fontWeight: 300, color: B.navy, lineHeight: 1 }}>{dScore}</div></>
                )}
              </div>
            </div>

            {/* Readiness indicator + return message */}
            <div style={{ marginTop: 16, padding: "16px 20px", borderRadius: 10, backgroundColor: qCount >= 2 ? `${B.teal}05` : `${B.stone}`, border: `1px solid ${qCount >= 2 ? `${B.teal}12` : B.stone}` }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap" as const, gap: 8 }}>
                <span style={{ fontSize: 15, fontWeight: 600, color: qCount >= 2 ? B.teal : B.muted }}>{qCount}/4 changes made{qCount >= 2 ? " — you may be ready to reassess" : ""}</span>
              </div>
              {qCount < 2 && <p style={{ fontSize: 13, color: B.taupe, margin: "8px 0 0", lineHeight: 1.55, fontStyle: "italic" }}>{returnMsg}</p>}
            </div>
          </section>

          {/* Stress + timing cards (separate) */}
          <div style={{ display: "flex", gap: 16, flexDirection: mobile ? "column" : "row" }} className="d-2col">
            <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 12 }}>
              {assessments.length >= 2 && (() => { const diff = assessments[0].final_score - assessments[1].final_score; return (
                <div style={{ padding: "20px 24px", border: `1px solid ${diff > 0 ? `${B.teal}18` : B.stone}`, borderRadius: 12, backgroundColor: B.surface, display: "flex", alignItems: "center", gap: 16 }}>
                  <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.10em", color: B.taupe }}>HISTORY</div>
                  <span style={{ fontSize: 22, fontWeight: 300, color: B.taupe }}>{assessments[1].final_score}</span><span style={{ color: B.taupe }}>→</span>
                  <span style={{ fontSize: 22, fontWeight: 300, color: B.navy }}>{assessments[0].final_score}</span>
                  <span style={{ fontSize: 17, fontWeight: 600, color: diff > 0 ? B.teal : diff < 0 ? B.red : B.taupe }}>{diff > 0 ? "+" : ""}{diff}</span>
                </div>
              ); })()}

              <div style={{ padding: "20px 24px", border: `1px solid ${B.stone}`, borderRadius: 12, backgroundColor: B.surface }}>
                <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.10em", color: B.taupe, marginBottom: 12 }}>STRESS RESILIENCE</div>
                {[{ label: "Top client leaves", val: `${dScore} → ${stLC.overall_score}` }, { label: "Can't work 90 days", val: `${dScore} → ${stNW.overall_score}` }].map(row => (
                  <div key={row.label} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "8px 0", borderBottom: `1px solid ${B.stone}` }}>
                    <span style={{ fontSize: 15, color: B.muted }}>{row.label}</span><span style={{ fontSize: 15, fontWeight: 500, color: B.red }}>{row.val}</span>
                  </div>
                ))}
              </div>
            </div>

            <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 12 }}>
              <div style={{ padding: "20px 24px", border: `1px solid ${B.stone}`, borderRadius: 12, backgroundColor: B.surface }}>
                <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.10em", color: daysSince > 60 ? B.red : B.taupe, marginBottom: 8 }}>{daysSince > 0 ? `${daysSince} DAYS SINCE ASSESSMENT` : "ASSESSED TODAY"}</div>
                <p style={{ fontSize: 15, color: B.muted, margin: 0, lineHeight: 1.55 }}>
                  {daysSince === 0 ? "Start with your #1 priority above." : daysSince <= 14 ? "Focus on the first phase of your roadmap." : daysSince <= 45 ? "You should be in Week 3–4. Made a structural change?" : daysSince <= 90 ? "If you followed your roadmap, you may be ready to reassess." : "Over 90 days. A reassessment will show how your structure changed."}
                </p>
              </div>

              {!isDemo && (
                <button onClick={() => { const s = sessionStorage.getItem("rp_record") || localStorage.getItem("rp_record"); if (!s) return; const b = new Blob([s], { type: "application/json" }); const u = URL.createObjectURL(b); const a = document.createElement("a"); a.href = u; a.download = "runpayway-assessment.json"; a.click(); URL.revokeObjectURL(u); }}
                  style={{ fontSize: 13, fontWeight: 500, color: B.taupe, background: "none", border: `1px solid ${B.stone}`, borderRadius: 8, padding: "12px 20px", cursor: "pointer", textAlign: "center" as const, minHeight: 44 }}>
                  Download Assessment Data
                </button>
              )}
            </div>
          </div>

          </PhaseSep>

          {/* FOOTER */}
          <div style={{ paddingTop: 32, textAlign: "center" }}>
            <Link href="/pricing" style={{ fontSize: 15, color: B.muted, textDecoration: "none", lineHeight: 1.6 }}>
              Your score is a snapshot. <span style={{ color: B.purple, fontWeight: 600 }}>The annual plan tracks how it moves.</span>
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}

export default function DashboardPage() {
  return <Suspense><DashboardContent /></Suspense>;
}
