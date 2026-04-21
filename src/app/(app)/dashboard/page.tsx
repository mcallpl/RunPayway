"use client";

import { useEffect, useState, useRef, useCallback, Suspense } from "react";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import { fetchSimulationBatch, fetchSimulation, fetchTimeline, fetchPresets, fetchActionScripts } from "@/lib/worker-api";
import type { SimulationResult, PresetMeta, ActionScript, CanonicalInputs, TimelinePoint } from "@/lib/worker-api";
import SuiteHeader from "@/components/SuiteHeader";
import ShareableScoreCard from "@/components/ShareableScoreCard";
// Sample data removed — empty state teasers replace demo mode
import { C, mono, sans, bandColor } from "@/lib/design-tokens";
import { getVocabulary } from "@/lib/industry-vocabulary";
import { normSector, formatIndustry, SECTOR_MAP } from "@/lib/sector-map";
import { WORKER_URL } from "@/lib/config";

/* ================================================================== */
/*  BRAND TOKENS  (mapped from shared design-tokens)                   */
/* ================================================================== */
const B = {
  navy: C.navy,
  purple: C.purple,
  teal: C.teal,
  white: C.white,
  bg: "#FAFAFA",
  surface: C.white,
  stone: "#E5E7EB",
  taupe: C.light,
  muted: C.muted,
  faint: "#E5E7EB",
  red: C.bandLimited,
  amber: C.bandDeveloping,
  bandLimited: C.bandLimited,
  bandDeveloping: C.bandDeveloping,
  bandEstablished: C.bandEstablished,
  bandHigh: C.bandHigh,
};

/*  TYPE SCALE — 5 levels, optimized for clarity
    H1: 24px  — section headlines
    H2: 18px  — card titles, move labels
    Body: 16px — primary readable text
    Small: 14px — secondary, peer comparisons
    Label: 12px — uppercase section markers, metadata
*/

/* ================================================================== */
/*  PHASE NAV CONFIG                                                   */
/* ================================================================== */
const PHASE_NAV = [
  { id: "phase-diagnosis", label: "Your Score", color: B.purple },
  { id: "phase-explore", label: "Explore", color: B.teal },
  { id: "phase-plan", label: "Your Plan", color: B.navy },
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
  const color = bandColor(score);
  const bandLabel = score >= 75 ? "High Stability" : score >= 50 ? "Established Stability" : score >= 30 ? "Developing Stability" : "Limited Stability";

  return (
    <div role="img" aria-label={`Income Stability Score™: ${score} out of 100`} style={{ position: "relative", width: size, height: size, flexShrink: 0 }}>
      <defs>
        <style>{`
          @keyframes scoreGlow { 0%, 100% { opacity: 0.4; } 50% { opacity: 0.8; } }
          .score-ring-glow { animation: scoreGlow 3s ease-in-out infinite; }
        `}</style>
      </defs>
      <svg width={size} height={size} style={{ transform: "rotate(-90deg)", position: "relative", zIndex: 1 }}>
        <defs>
          <filter id={`scoreGlow${score}`} x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="2" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="rgba(14,26,43,0.04)" strokeWidth={stroke} />
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={color} strokeWidth={stroke}
          strokeDasharray={circ} strokeDashoffset={offset} strokeLinecap="round" filter={`url(#scoreGlow${score})`}
          style={{ transition: "stroke-dashoffset 1.2s cubic-bezier(0.22, 1, 0.36, 1), stroke 0.4s" }} />
      </svg>
      <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", zIndex: 2 }}>
        <span style={{ fontSize: size * 0.32, fontWeight: 200, fontFamily: mono, color: B.navy, lineHeight: 1, letterSpacing: "-0.06em" }}>{score}</span>
        <span style={{ fontSize: Math.max(size * 0.07, 8), fontWeight: 700, color, marginTop: 6, letterSpacing: "0.06em", opacity: 0.8 }}>{bandLabel}</span>
      </div>
    </div>
  );
}

/* ================================================================== */
/*  PHASE SEPARATOR — wrapper with branded edge mark + tinted bg       */
/* ================================================================== */
function PhaseSep({ label, color, tint, children, id, mobile }: { label: string; color: string; tint?: string; children?: React.ReactNode; id?: string; mobile?: boolean }) {
  return (
    <div id={id} className="d-phase" style={{ margin: 0, padding: mobile ? "0 0 32px" : "0 0 40px", backgroundColor: tint || "transparent", borderRadius: 4, overflow: "hidden" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 14, padding: mobile ? "36px 0 20px" : "56px 0 28px" }}>
        <div style={{ width: 4, height: 40, borderRadius: 2, backgroundColor: color, opacity: 0.30, flexShrink: 0 }} />
        <span style={{ fontSize: 12, fontWeight: 700, letterSpacing: "0.12em", color, textTransform: "uppercase" as const, whiteSpace: "nowrap" as const }}>{label}</span>
        <div style={{ height: 1, flex: 1, background: `linear-gradient(90deg, ${color}12 0%, transparent 100%)` }} />
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

  if (mobile) {
    // Bottom horizontal nav on mobile — avoids content overlap
    return (
      <div style={{
        position: "fixed",
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 100,
        display: "flex",
        justifyContent: "space-around",
        alignItems: "center",
        backgroundColor: "rgba(255,255,255,0.96)",
        backdropFilter: "blur(12px)",
        WebkitBackdropFilter: "blur(12px)",
        borderTop: "1px solid rgba(14,26,43,0.08)",
        padding: "8px 0 max(8px, env(safe-area-inset-bottom))",
      }}>
        {PHASE_NAV.map(p => {
          const isActive = activePhase === p.id;
          return (
            <button
              key={p.id}
              onClick={() => scrollTo(p.id)}
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 4,
                background: "none",
                border: "none",
                cursor: "pointer",
                padding: "6px 12px",
                minHeight: 44,
                minWidth: 44,
              }}
              aria-label={p.label}
            >
              <div style={{
                width: 8,
                height: 8,
                borderRadius: "50%",
                backgroundColor: isActive ? p.color : p.color + "40",
                transition: "background-color 200ms",
              }} />
              <span style={{
                fontSize: 10,
                fontWeight: isActive ? 700 : 500,
                color: isActive ? p.color : B.taupe,
                letterSpacing: "0.02em",
                transition: "color 200ms",
              }}>{p.label}</span>
            </button>
          );
        })}
      </div>
    );
  }

  return (
    <div style={{
      position: "fixed",
      right: 16,
      top: "50%",
      transform: "translateY(-50%)",
      zIndex: 100,
      display: "flex",
      flexDirection: "column",
      gap: 12,
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
              background: isActive ? B.surface : "rgba(255,255,255,0.92)",
              border: `1px solid ${isActive ? p.color + "30" : "rgba(14,26,43,0.06)"}`,
              borderRadius: 20,
              padding: "6px 14px 6px 8px",
              cursor: "pointer",
              transition: "all 200ms",
              boxShadow: isActive ? `0 2px 8px ${p.color}18` : "0 1px 4px rgba(0,0,0,0.06)",
            }}
            aria-label={p.label}
          >
            <div style={{
              width: 8,
              height: 8,
              borderRadius: "50%",
              backgroundColor: isActive ? p.color : p.color + "40",
              flexShrink: 0,
              transition: "background-color 200ms",
            }} />
            <span style={{
              fontSize: 11,
              fontWeight: isActive ? 700 : 500,
              color: isActive ? p.color : B.taupe,
              letterSpacing: "0.04em",
              whiteSpace: "nowrap" as const,
              transition: "color 200ms",
            }}>{p.label}</span>
          </button>
        );
      })}
    </div>
  );
}

/* ================================================================== */
/*  STRIPE URL                                                         */
/* ================================================================== */
const STRIPE_URL = "https://buy.stripe.com/9B66oz48EaYU2lc4IF2Nq05";

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
  retail_ecommerce: { general: "In retail, businesses with subscription or membership models score 32% higher than transaction-only.", redAvg: 60, greenAvg: 8 },
  hospitality: { general: "In hospitality, operators with recurring catering or event contracts score 30 points higher than walk-in dependent.", redAvg: 65, greenAvg: 6 },
  transportation: { general: "In transportation, operators with contract routes or retainer clients score 28 points higher than spot-market dependent.", redAvg: 62, greenAvg: 8 },
  manufacturing: { general: "In manufacturing, firms with long-term supply agreements score 35 points higher than order-by-order operations.", redAvg: 55, greenAvg: 14 },
  nonprofit: { general: "In nonprofit, organizations with recurring donor programs score 40% higher than grant-cycle dependent.", redAvg: 60, greenAvg: 10 },
  agriculture: { general: "In agriculture, operations with forward contracts or subscription CSAs score 30 points higher than market-price dependent.", redAvg: 65, greenAvg: 6 },
  energy: { general: "In energy, providers with long-term service contracts score 32 points higher than project-based operations.", redAvg: 55, greenAvg: 12 },
  default: { general: "Across all sectors, professionals with at least one recurring income source score 35% higher.", redAvg: 58, greenAvg: 12 },
};

/* ================================================================== */
/*  CONSTRAINT NARRATIVES                                              */
/* ================================================================== */
function constraintNarrative(c: string, i: CanonicalInputs, sector: string): string {
  // Pull industry-specific language first, fall back to templated numbers
  const vocab = getVocabulary(sector);
  if (vocab.constraints[c]) return vocab.constraints[c];
  const n: Record<string, string> = {
    high_concentration: `Your largest source represents ${i.largest_source_pct}% of income. If that single relationship changes, ${i.largest_source_pct}% of your revenue is exposed in one decision.`,
    weak_forward_visibility: `Only ${i.forward_secured_pct}% of your income is committed forward. You are re-selling your time every month.`,
    high_labor_dependence: `${i.labor_dependence_pct}% of your income requires your active daily work. A 90-day disruption stops ${i.labor_dependence_pct}% of income.`,
    low_persistence: `Only ${i.income_persistence_pct}% of your income repeats automatically. The rest must be re-earned from scratch each month.`,
    low_source_diversity: `You have ${i.source_diversity_count} income source${i.source_diversity_count === 1 ? "" : "s"}. A single client decision has outsized power over your stability.`,
    high_variability: `Your income variability is ${i.income_variability_level}. Month-to-month swings make it harder to plan, save, and invest.`,
    weak_durability: `Your income quality score is developing. The contracts and agreements backing your income are exposed to market pressure.`,
    shallow_continuity: `Your income runway is critically short. If active work stops, income shifts to near zero within weeks. Building any continuity buffer is the priority.`,
  };
  return n[c] || `Your primary area — ${c.replace(/_/g, " ")} — is the biggest lever for improving your score.`;
}

/* ================================================================== */
/*  SHARE SCORE IMAGE                                                  */
/* ================================================================== */
function generateScoreImage(score: number, bandLabel: string, name: string, color: string): Promise<string> {
  return new Promise((resolve) => {
    const canvas = document.createElement("canvas");
    canvas.width = 600; canvas.height = 320;
    const ctx = canvas.getContext("2d")!;
    ctx.fillStyle = C.navy; ctx.beginPath(); ctx.roundRect(0, 0, 600, 320, 16); ctx.fill();
    const cx = 150, cy = 160, r = 60, lw = 8;
    ctx.beginPath(); ctx.arc(cx, cy, r, 0, Math.PI * 2); ctx.strokeStyle = C.sandBorder; ctx.lineWidth = lw; ctx.stroke();
    ctx.beginPath(); ctx.arc(cx, cy, r, -Math.PI / 2, -Math.PI / 2 + (score / 100) * Math.PI * 2); ctx.strokeStyle = color; ctx.lineWidth = lw; ctx.lineCap = "round"; ctx.stroke();
    ctx.fillStyle = C.white; ctx.font = "300 48px 'SF Mono', 'Fira Code', monospace"; ctx.textAlign = "center"; ctx.fillText(String(score), cx, cy + 16);
    ctx.fillStyle = color; ctx.font = "600 11px Inter, system-ui, sans-serif"; ctx.fillText(bandLabel.toUpperCase(), cx, cy + 36);
    ctx.textAlign = "left";
    ctx.fillStyle = C.sandLight; ctx.font = "600 11px Inter, system-ui, sans-serif";
    ctx.fillText("INCOME STABILITY SCORE", 260, 100);
    ctx.fillStyle = C.white; ctx.font = "600 22px Inter, system-ui, sans-serif";
    ctx.fillText(name || "RunPayway™ Assessment", 260, 132);
    ctx.fillStyle = color; ctx.font = "600 16px Inter, system-ui, sans-serif";
    ctx.fillText(bandLabel, 260, 162);
    ctx.fillStyle = C.sandMuted; ctx.font = "400 13px Inter, system-ui, sans-serif";
    ctx.fillText("Assessed by RunPayway\u2122 \u00b7 Model RP-2.0", 260, 200);
    ctx.fillStyle = C.sandLight; ctx.font = "700 11px Inter, system-ui, sans-serif";
    ctx.fillText("RUNPAYWAY\u2122", 260, 270);
    resolve(canvas.toDataURL("image/png"));
  });
}

/* ================================================================== */
/*  MAIN                                                               */
/* ================================================================== */
function DashboardContent() {
  const [record, setRecord] = useState<Record<string, unknown> | null>(null);
  const [dataLoaded, setDataLoaded] = useState(false);
  const [minTimeElapsed, setMinTimeElapsed] = useState(false);
  const hydrated = dataLoaded && minTimeElapsed;
  const [assessments, setAssessments] = useState<{ record_id: string; final_score: number; stability_band: string; assessment_date_utc: string; issued_timestamp_utc?: string }[]>([]);
  const [mobile, setMobile] = useState(false);
  const [accessCode, setAccessCode] = useState("");
  const [codeError, setCodeError] = useState<string | null>(null);
  const [showWelcome, setShowWelcome] = useState(false);
  const [quickToggles, setQuickToggles] = useState<Record<string, boolean>>({});
  const [activePreset, setActivePreset] = useState<string | null>(null);
  const [savedScenarios, setSavedScenarios] = useState<{ name: string; score: number; band: string; lift: number }[]>(() => {
    try { return JSON.parse(localStorage.getItem("rp_saved_scenarios") || "[]"); } catch { return []; }
  });
  const [expandedScript, setExpandedScript] = useState<string | null>(null);
  const [copiedScript, setCopiedScript] = useState<string | null>(null);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);
  const [checkedItems, setCheckedItems] = useState<string[]>([]);
  const shareRef = useRef<HTMLAnchorElement>(null);
  const [shareUrl, setShareUrl] = useState<string | null>(null);
  const [activePhase, setActivePhase] = useState("phase-diagnosis");
  const [whatIfOpen, setWhatIfOpen] = useState(true);
  const [goalTarget, setGoalTarget] = useState<number | null>(null);
  const [tooltipOpen, setTooltipOpen] = useState<string | null>(null);
  const [isPaid, setIsPaid] = useState(false);
  const [copiedPlaybook, setCopiedPlaybook] = useState<string | null>(null);
  const [expandedPlaybook, setExpandedPlaybook] = useState<string | null>(null);
  const [copiedRecord, setCopiedRecord] = useState(false);
  const [snapshotTip, setSnapshotTip] = useState<string | null>(null);
  const [expandedTipText, setExpandedTipText] = useState<Record<string, boolean>>({});
  const [showShareModal, setShowShareModal] = useState(false);
  const [simResults, setSimResults] = useState<Record<string, SimulationResult> | null>(null);
  const [activeTimeline, setActiveTimeline] = useState<TimelinePoint[] | null>(null);
  const [presetMeta, setPresetMeta] = useState<PresetMeta[]>([]);
  const [workerScripts, setWorkerScripts] = useState<ActionScript[]>([]);
  const [simLoading, setSimLoading] = useState(true);
  const [serverEntitlements, setServerEntitlements] = useState<{ remaining: number; total: number; plan_key: string } | null>(null);
  const [advisorGoal, setAdvisorGoal] = useState("");
  const [advisorResponse, setAdvisorResponse] = useState<{ guidance: string; recommended_steps: string[]; timeline_estimate: string } | null>(null);
  const [advisorLoading, setAdvisorLoading] = useState(false);

  /* ── IntersectionObserver for phase nav ── */
  useEffect(() => {
    if (!hydrated) return;
    if (typeof IntersectionObserver === "undefined") return;
    const ids = PHASE_NAV.map(p => p.id);
    const observer = new IntersectionObserver(
      (entries) => {
        // Find the most visible section
        let best: IntersectionObserverEntry | null = null;
        for (const entry of entries) {
          if (entry.isIntersecting) {
            if (!best || entry.intersectionRatio > best.intersectionRatio) {
              best = entry;
            }
          }
        }
        if (best) setActivePhase(best.target.id);
      },
      { rootMargin: "-10% 0px -40% 0px", threshold: [0, 0.1, 0.25, 0.5] }
    );
    // Wait a tick for DOM to settle after hydration
    const timeout = setTimeout(() => {
      for (const id of ids) {
        const el = document.getElementById(id);
        if (el) observer.observe(el);
      }
    }, 200);
    return () => { clearTimeout(timeout); observer.disconnect(); };
  }, [hydrated]);

  useEffect(() => { const c = () => setMobile(window.innerWidth <= 768); c(); window.addEventListener("resize", c); return () => window.removeEventListener("resize", c); }, []);

  // Scroll-triggered entrance animations
  useEffect(() => {
    if (!hydrated || typeof IntersectionObserver === "undefined") return;
    const observer = new IntersectionObserver((entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) { entry.target.classList.add("cc-visible"); observer.unobserve(entry.target); }
      }
    }, { rootMargin: "0px 0px -60px 0px", threshold: 0.05 });
    const timeout = setTimeout(() => {
      document.querySelectorAll(".cc-section").forEach(el => observer.observe(el));
    }, 100);
    return () => { clearTimeout(timeout); observer.disconnect(); };
  }, [hydrated]);

  // Persist saved scenarios
  useEffect(() => { localStorage.setItem("rp_saved_scenarios", JSON.stringify(savedScenarios)); }, [savedScenarios]);

  /* ── Load data from storage or URL ?code= parameter ── */
  const searchParams = useSearchParams();
  const router = useRouter();
  useEffect(() => {
    // Check for ?code= in URL (bookmarkable unique link)
    // Check for ?record= in URL (email link — loads from cloud)
    const urlRecord = searchParams.get("record");
    if (urlRecord) {
      (async () => {
        try {
          const res = await fetch(`${WORKER_URL}/get-record`, {
            method: "POST", headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ id: urlRecord }),
          });
          if (res.ok) {
            const data = await res.json();
            if (data.record_data) {
              const parsed = typeof data.record_data === "string" ? JSON.parse(data.record_data) : data.record_data;
              sessionStorage.setItem("rp_record", JSON.stringify(parsed));
              localStorage.setItem("rp_record", JSON.stringify(parsed));
              setRecord(parsed);
              if (!localStorage.getItem("rp_cc_visited")) { setShowWelcome(true); }
              localStorage.setItem("rp_cc_visited", "1");
              setDataLoaded(true);
              return;
            }
          }
        } catch { /* cloud load failed, fall through */ }
        setDataLoaded(true);
      })();
      return;
    }

    // Check for ?code= in URL (bookmarkable simulator link)
    const urlCode = searchParams.get("code");
    if (urlCode) {
      try {
        const d = JSON.parse(atob(urlCode));
        if (typeof d.p === "number" && typeof d.c === "number" && typeof d.l === "number") {
          const nr = { record_id: `sim-${Date.now()}`, authorization_code: "", model_version: "RP-2.0", assessment_date_utc: new Date().toISOString(), issued_timestamp_utc: new Date().toISOString(), final_score: d.o || 0, stability_band: d.b || "", assessment_title: d.n || "", classification: "", operating_structure: "", primary_income_model: d.m || "", industry_sector: d.i || "", _v2: { normalized_inputs: { income_persistence_pct: d.p, largest_source_pct: d.c, source_diversity_count: d.s, forward_secured_pct: d.f, income_variability_level: d.v || "moderate", labor_dependence_pct: d.l }, quality: { quality_score: d.q || 5 } } };
          sessionStorage.setItem("rp_record", JSON.stringify(nr));
          sessionStorage.setItem("rp_sim_code", urlCode);
          // Access code comes from paid report — grant full access
          setIsPaid(true);
          const codeSession = { plan_key: "single_assessment", status: "paid", checkout_provider: "access_code" };
          sessionStorage.setItem("rp_purchase_session", JSON.stringify(codeSession));
          localStorage.setItem("rp_purchase_session", JSON.stringify(codeSession));
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
    try {
      const ps = JSON.parse(sessionStorage.getItem("rp_purchase_session") || localStorage.getItem("rp_purchase_session") || "{}");
      if (ps.plan_key && ps.plan_key !== "free") {
        setIsPaid(true);
      } else if (ps.plan_key === "free" && stored) {
        window.location.replace("/RunPayway/free-score");
        return;
      }
    } catch { /* */ }
    const hasVisited = localStorage.getItem("rp_cc_visited");
    const hasData = !!stored && stored !== "null";
    if (!hasVisited && hasData) { setShowWelcome(true); }
    localStorage.setItem("rp_cc_visited", "1");
    setDataLoaded(true);
  }, [searchParams, router]);

  // Fetch server-side entitlements for accurate remaining count
  useEffect(() => {
    if (!dataLoaded) return;
    (async () => {
      try {
        const ps = JSON.parse(sessionStorage.getItem("rp_purchase_session") || localStorage.getItem("rp_purchase_session") || "{}");
        const email = ps.customer_email || "";
        if (!email) return;
        const res = await fetch(`${WORKER_URL}/entitlement/lookup`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email }),
        });
        if (res.ok) {
          const data = await res.json();
          if (data?.entitlements && Array.isArray(data.entitlements) && data.entitlements.length > 0) {
            // Use the most relevant entitlement (most remaining, or most recent)
            const best = data.entitlements.reduce((a: Record<string, unknown>, b: Record<string, unknown>) =>
              ((b.remaining as number) || 0) > ((a.remaining as number) || 0) ? b : a
            , data.entitlements[0]);
            setServerEntitlements({
              remaining: (best.remaining as number) || 0,
              total: (best.total as number) || 0,
              plan_key: (best.plan_key as string) || "",
            });
          }
        }
      } catch { /* Entitlement lookup failed — fall back to localStorage count */ }
    })();
  }, [dataLoaded]);

  useEffect(() => {
    const t = setTimeout(() => setMinTimeElapsed(true), 600);
    return () => clearTimeout(t);
  }, []);

  // Redirect to login if no record found after data loading
  useEffect(() => {
    if (dataLoaded && !record && typeof window !== "undefined") {
      router.push("/dashboard/login");
    }
  }, [dataLoaded, record, router]);

  const handleCodeSubmit = () => {
    setCodeError(null); const trimmed = accessCode.trim();
    if (!trimmed) { setCodeError("Paste your Access Code."); return; }
    try {
      const d = JSON.parse(atob(trimmed));
      if (typeof d.p !== "number" || typeof d.c !== "number" || typeof d.l !== "number") { setCodeError("Invalid code."); return; }
      const nr = { record_id: `sim-${Date.now()}`, authorization_code: "", model_version: "RP-2.0", assessment_date_utc: new Date().toISOString(), issued_timestamp_utc: new Date().toISOString(), final_score: d.o || 0, stability_band: d.b || "", assessment_title: d.n || "", classification: "", operating_structure: "", primary_income_model: d.m || "", industry_sector: d.i || "", _v2: { normalized_inputs: { income_persistence_pct: d.p, largest_source_pct: d.c, source_diversity_count: d.s, forward_secured_pct: d.f, income_variability_level: d.v || "moderate", labor_dependence_pct: d.l }, quality: { quality_score: d.q || 5 } } };
      sessionStorage.setItem("rp_record", JSON.stringify(nr)); sessionStorage.setItem("rp_sim_code", trimmed);
      // Access code comes from paid report — grant full access
      const codeSession = { plan_key: "single_assessment", status: "paid", checkout_provider: "access_code" };
      sessionStorage.setItem("rp_purchase_session", JSON.stringify(codeSession));
      localStorage.setItem("rp_purchase_session", JSON.stringify(codeSession));
      window.location.reload();
    } catch { setCodeError("Invalid code. Copy the full code from your report."); }
  };

  const handleAdvisorAnalyze = async () => {
    if (!advisorGoal.trim()) return;
    setAdvisorLoading(true);
    try {
      const res = await fetch("/api/v1/advisor-analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          goal: advisorGoal,
          industry: sector || "General",
          score: dScore,
          band: band,
          dimensions: {
            persistence_pct: i?.income_persistence_pct || 0,
            source_diversity_count: i?.source_diversity_count || 0,
            forward_secured_pct: i?.forward_secured_pct || 0,
            largest_source_pct: i?.largest_source_pct || 0,
            earnings_variability: i?.income_variability_level || "moderate",
            labor_dependence_pct: i?.labor_dependence_pct || 0,
          },
          roadmapSteps: roadmap.map(s => ({ action: s.action, lift: s.lift, desc: s.desc })),
        }),
      });
      if (res.ok) {
        const data = await res.json();
        setAdvisorResponse(data);
      }
    } catch { /* API failed, show fallback */ }
    setAdvisorLoading(false);
  };

  /* ── Derived ── */
  const hasRecord = !!record;
  const r = record || ({} as Record<string, unknown>);
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
  const indLabel = sector ? formatIndustry(sector) : "";
  const assessedDate = issuedDate ? new Date(issuedDate).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" }) : "";

  const base: CanonicalInputs = ni ? {
    income_persistence_pct: ni.income_persistence_pct as number, largest_source_pct: ni.largest_source_pct as number,
    source_diversity_count: ni.source_diversity_count as number, forward_secured_pct: ni.forward_secured_pct as number,
    income_variability_level: (ni.income_variability_level || "moderate") as string,
    labor_dependence_pct: ni.labor_dependence_pct as number,
  } : { income_persistence_pct: 25, largest_source_pct: 60, source_diversity_count: 2, forward_secured_pct: 15, income_variability_level: "moderate" as const, labor_dependence_pct: 70 };

  const qScore = ((v2?.quality as Record<string, number>)?.quality_score) ?? 5;

  /* ── Fetch all simulations from worker (async, stored in state) ── */
  useEffect(() => {
    if (!hasRecord) return;
    const scenarios = [
      { id: "base" },
      { id: "add_client", preset_id: "add_client" },
      { id: "convert_retainer", preset_id: "convert_retainer" },
      { id: "build_passive", preset_id: "build_passive" },
      { id: "lock_forward", preset_id: "lock_forward" },
      { id: "lose_top_client", preset_id: "lose_top_client" },
      { id: "cant_work_90_days", preset_id: "cant_work_90_days" },
    ];
    setSimLoading(true);
    fetchSimulationBatch(base, scenarios, qScore)
      .then(results => { setSimResults(results); setSimLoading(false); })
      .catch(err => { console.error("Simulation batch failed:", err); setSimLoading(false); });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hasRecord, score]);

  /* ── Fetch presets metadata ── */
  useEffect(() => {
    fetchPresets(sector || undefined)
      .then(setPresetMeta)
      .catch(err => console.error("Presets fetch failed:", err));
  }, [sector]);

  /* ── Fetch action scripts from worker ── */
  useEffect(() => {
    if (!sector) return;
    const sKey = normSector(sector);
    fetchActionScripts(sKey)
      .then(raw => setWorkerScripts(raw))
      .catch(err => console.error("Action scripts fetch failed:", err));
  }, [sector]);

  const baseRes = simResults?.base ?? null;
  const dScore = score > 0 ? score : (baseRes?.overall_score ?? 0);
  const dBand = band || (baseRes?.band ?? "");
  const sectorKey = normSector(sector);
  const indData = IND[sectorKey] || IND.default;
  // Adapt worker ActionScript shape (body, sector) to dashboard-expected shape (script, context)
  const scripts = workerScripts.map(s => ({ id: s.id, title: s.title, context: "", script: s.body, sector: s.sector }));

  /* ── PressureMap ── */
  const rootCon = con?.root_constraint || "weak_forward_visibility";
  const secCon = con?.secondary_constraint || "";
  const conPreset: Record<string, string> = { high_concentration: "add_client", weak_forward_visibility: "lock_forward", high_labor_dependence: "build_passive", low_persistence: "convert_retainer", low_source_diversity: "add_client", high_variability: "convert_retainer", weak_durability: "convert_retainer", shallow_continuity: "build_passive" };
  const liftOf = (pid: string) => { const r = simResults?.[pid]; if (!r) return { s: dScore, l: 0 }; return { s: r.overall_score, l: Math.max(0, r.overall_score - dScore) }; };
  const redP = conPreset[rootCon] || "convert_retainer";
  const redR = liftOf(redP);
  const grnP = rootCon === "high_labor_dependence" ? "lock_forward" : "build_passive";
  const grnR = liftOf(grnP);

  /* ── Stress drops for consequence pairing ── */
  const stLCDrop = dScore - (simResults?.lose_top_client?.overall_score ?? dScore);
  const stNWDrop = dScore - (simResults?.cant_work_90_days?.overall_score ?? dScore);

  const indName = indLabel || "your sector";
  const severity = (pct: number, avg: number): "critical" | "elevated" | "managed" => pct > avg + 10 ? "critical" : pct > avg - 5 ? "elevated" : "managed";
  const redSev = severity(activeInc, indData.redAvg);
  const grnSev = severity(indData.greenAvg, persInc); // inverted: low protected = bad

  const redAction = presetMeta.find(p => p.id === redP);
  const grnAction = presetMeta.find(p => p.id === grnP);

  const zones = [
    { id: "active", label: "Income That Stops", pct: activeInc, color: B.red, lift: redR.l, sev: redSev,
      txt: activeInc >= 70
        ? `In ${indName.toLowerCase()}, ${activeInc}% active income is critically high. If you cannot work for 90 days, your score would shift by ${stNWDrop} points. Industry baseline: ${indData.redAvg}% — you are ${activeInc - indData.redAvg}% above that.`
        : activeInc >= 40
        ? `${activeInc}% of your income requires active daily work. In ${indName.toLowerCase()}, the industry baseline is ${indData.redAvg}%. ${activeInc > indData.redAvg ? `You are ${activeInc - indData.redAvg}% more exposed than the baseline.` : `You are ${indData.redAvg - activeInc}% below the industry baseline.`}`
        : `${activeInc}% active income is well below the ${indName.toLowerCase()} baseline of ${indData.redAvg}%. Your structure has meaningful protection against work stoppages.`,
      peer: `${Math.abs(activeInc - indData.redAvg)}% ${activeInc > indData.redAvg ? "above" : "below"} ${indName.toLowerCase()} avg (${indData.redAvg}%)`,
      action: redAction ? `Fix: ${redAction.label}` : null },
    { id: "semi", label: "Recurring For Now", pct: semiInc, color: B.amber, lift: 0, sev: "elevated" as const,
      txt: semiInc < 15
        ? `Only ${semiInc}% has any repeating structure. In ${indName.toLowerCase()}, this leaves you re-earning almost everything from scratch each month.`
        : semiInc < 35
        ? `${semiInc}% repeats on short cycles — retainers, subscriptions, or month-to-month contracts. Cancelable, but a working buffer for ${indName.toLowerCase()} professionals.`
        : `${semiInc}% recurring is a solid foundation. The next step for ${indName.toLowerCase()} professionals is converting this to fully protected income with longer commitments.`,
      peer: null as string | null,
      action: null as string | null },
    { id: "persistent", label: "Protected Income", pct: persInc, color: B.teal, lift: grnR.l, sev: grnSev,
      txt: persInc < 10
        ? `Only ${persInc}% would continue if you stopped entirely. The ${indName.toLowerCase()} industry baseline is ${indData.greenAvg}%. Building this zone is the single most durable improvement available.`
        : persInc < 25
        ? `${persInc}% protected gives some runway. ${persInc > indData.greenAvg ? `You are ${persInc - indData.greenAvg}% above the modeled industry baseline.` : `The ${indName.toLowerCase()} industry baseline is ${indData.greenAvg}% — you are ${indData.greenAvg - persInc}% below the modeled industry baseline.`}`
        : `${persInc}% protected is a real advantage in ${indName.toLowerCase()}. This zone keeps generating revenue through disruptions, illness, and market shifts.`,
      peer: `${Math.abs(persInc - indData.greenAvg)}% ${persInc > indData.greenAvg ? "above" : "below"} ${indName.toLowerCase()} avg (${indData.greenAvg}%)`,
      action: grnAction ? `Fix: ${grnAction.label}` : null },
  ];

  /* ── Top moves ── */
  const growthIds = ["add_client", "convert_retainer", "build_passive", "lock_forward"];
  const topMoves = growthIds.map(pid => {
    const meta = presetMeta.find(p => p.id === pid);
    const res = simResults?.[pid];
    if (!res) return null;
    return { id: pid, label: meta?.label || pid.replace(/_/g, " ").replace(/\b\w/g, c => c.toUpperCase()), description: meta?.description || "", lift: res.overall_score - dScore, projected: res.overall_score, resBand: res.band, effort: pid === "lock_forward" || pid === "convert_retainer" ? "Low" as const : "High" as const, speed: pid === "lock_forward" || pid === "convert_retainer" ? "Fast" as const : "Gradual" as const };
  }).filter((p): p is NonNullable<typeof p> => p !== null && p.lift > 0).sort((a, b) => b.lift - a.lift);

  const scriptFor = (pid: string) => { if (!scripts.length) return null; if (pid === "convert_retainer") return scripts.find(s => s.id.includes("retainer")) || scripts[0]; if (pid === "add_client") return scripts.find(s => s.id.includes("diversi") || s.id.includes("referral")) || scripts[1]; if (pid === "build_passive") return scripts[2] || scripts[0]; return scripts[0]; };

  /* ── Roadmap — enriched with success criteria, zone connection, effort, cumulative progress ── */
  const phases = [{ weeks: "Week 1–2", effortLabel: "Quick win" }, { weeks: "Week 3–4", effortLabel: "Active effort" }, { weeks: "Week 5–8", effortLabel: "Bigger changes" }, { weeks: "Week 9–12", effortLabel: "Compound & maintain" }];

  const zoneForPreset: Record<string, string> = {
    add_client: "Reduces active income exposure (red zone)",
    convert_retainer: "Builds recurring income (amber → green zone)",
    build_passive: "Grows protected income (green zone)",
    lock_forward: "Improves forward visibility",
  };

  const vocabDash = getVocabulary(sector);

  const getIndustryAction = (pid: string): string => {
    const vocabAction = vocabDash.actions[pid as keyof typeof vocabDash.actions];
    return vocabAction || "";
  };

  let cumulativeScore = dScore;
  const roadmap = topMoves.slice(0, 4).map((m, i) => {
    const projected = cumulativeScore + m.lift;
    const step = {
      ...phases[i],
      action: vocabDash?.actionLabels?.[m.id as keyof typeof vocabDash.actionLabels] || m.label,
      pid: m.id,
      lift: m.lift,
      desc: getIndustryAction(m.id) || m.description,
      zone: zoneForPreset[m.id] || "",
      target: `Target: Score moves from ${cumulativeScore} to ${projected} by end of ${phases[i].weeks}.`,
      cumulativeFrom: cumulativeScore,
      cumulativeTo: projected,
    };
    cumulativeScore = projected;
    return step;
  });
  const totalLift = cumulativeScore - dScore;

  const toggleStep = useCallback((idx: number) => { setCompletedSteps(prev => { const n = prev.includes(idx) ? prev.filter(i => i !== idx) : [...prev, idx]; localStorage.setItem("rp_roadmap_steps", JSON.stringify(n)); return n; }); }, []);

  /* ── Quick progress ── */
  const qActions = [
    { id: "client", label: "Added a new client", pid: "add_client" },
    { id: "retainer", label: "Signed a retainer", pid: "convert_retainer" },
    { id: "passive", label: "Built passive income", pid: "build_passive" },
    { id: "forward", label: "Secured forward revenue", pid: "lock_forward" },
  ];
  const qCount = Object.values(quickToggles).filter(Boolean).length;
  /* Quick toggles — fire debounced fetch when toggles change */
  const [qResult, setQResult] = useState<SimulationResult | null>(null);
  useEffect(() => {
    if (qCount === 0 || !hasRecord) { setQResult(null); return; }
    // Build composite modified_inputs from active toggles
    const activeIds = qActions.filter(a => quickToggles[a.id]).map(a => a.pid);
    // Fire individual sim with combined preset IDs — worker applies them in sequence
    const scenarios = activeIds.map(pid => ({ id: pid, preset_id: pid }));
    const timer = setTimeout(() => {
      fetchSimulationBatch(base, [{ id: "quick_composite", preset_id: activeIds[0] }, ...scenarios.slice(1)], qScore)
        .then(results => {
          // Get the last scenario result as composite
          const lastKey = Object.keys(results).pop();
          if (lastKey) setQResult(results[lastKey]);
        })
        .catch(err => console.error("Quick toggle sim failed:", err));
    }, 300);
    return () => clearTimeout(timer);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [qCount, quickToggles, hasRecord]);
  const qLift = qCount > 0 && qResult ? qResult.overall_score - dScore : 0;

  /* ── Scenario — auto-select best preset ── */
  const effectivePreset = activePreset ?? (topMoves[0]?.id || null);
  const aPO = presetMeta.find(p => p.id === effectivePreset);
  const sResult = effectivePreset ? simResults?.[effectivePreset] ?? null : null;
  const sDelta = sResult ? sResult.overall_score - dScore : 0;

  /* ── Timeline — fetch when scenario changes ── */
  useEffect(() => {
    if (!effectivePreset || !hasRecord || !sResult) { setActiveTimeline(null); return; }
    // Build target inputs: we approximate by using the scenario result's factor_scores
    // The worker handles the preset application internally via preset_id in batch
    fetchTimeline(base, base, qScore)
      .then(setActiveTimeline)
      .catch(err => { console.error("Timeline fetch failed:", err); setActiveTimeline(null); });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [effectivePreset, hasRecord]);
  const sTL: TimelinePoint[] = activeTimeline || [];

  /* ── Stress ── */
  const stLC = simResults?.lose_top_client ?? null;
  const stNW = simResults?.cant_work_90_days ?? null;

  /* ── Progress ── */
  const nextT = dScore < 30 ? 30 : dScore < 50 ? 50 : dScore < 75 ? 75 : 100;
  const nextB = dScore < 30 ? "Developing Stability" : dScore < 50 ? "Established Stability" : dScore < 75 ? "High Stability" : "Maximum";
  const gap = nextT - dScore;

  /* ── Reassessment — merged with progress check (Change 4) ── */
  const returnMsg = qCount >= 2 ? "You have made enough changes to warrant a reassessment." : topMoves[0] ? `Come back after you ${topMoves[0].label.toLowerCase()}. Worth +${topMoves[0].lift} points.` : "Come back after making a change.";

  const copyScript = (txt: string, id: string) => { navigator.clipboard.writeText(txt).then(() => { setCopiedScript(id); setTimeout(() => setCopiedScript(null), 2000); }); };

  const handleShare = async () => {
    const bl = dScore >= 75 ? "High Stability" : dScore >= 50 ? "Established Stability" : dScore >= 30 ? "Developing Stability" : "Limited Stability";
    const url = await generateScoreImage(dScore, bl, custName, bandColor(dScore));
    setShareUrl(url);
    setTimeout(() => { if (shareRef.current) shareRef.current.click(); setShareUrl(null); }, 150);
  };

  /* ================================================================ */
  /*  RENDER                                                           */
  /* ================================================================ */

  /* Loading state — skeleton screen matching real dashboard layout */
  if (!hydrated) {
    const skBone = (w: string | number, h: number, r = 12, extra?: React.CSSProperties): React.CSSProperties => ({
      width: w, height: h, borderRadius: r,
      backgroundColor: "rgba(14,26,43,0.06)",
      animation: "skeletonPulse 1.5s ease-in-out infinite",
      ...extra,
    });
    return (
      <>
        <title>Dashboard | RunPayway™</title>
        <style>{`
          @keyframes skeletonPulse {
            0%, 100% { opacity: 0.4; }
            50% { opacity: 0.7; }
          }
          @keyframes fadeIn {
            from { opacity: 0; transform: translateY(4px); }
            to { opacity: 1; transform: translateY(0); }
          }
        `}</style>
        <div style={{ minHeight: "100vh", backgroundColor: C.sand, fontFamily: sans }}>
          <SuiteHeader current="dashboard" />

          <div style={{ maxWidth: 960, margin: "0 auto", padding: mobile ? "20px 28px 120px" : "48px 36px 96px" }}>

            {/* Skeleton: Score hero card */}
            <div style={{ marginBottom: 36 }}>
              <div style={{ padding: mobile ? "28px 22px" : "40px 44px", borderRadius: mobile ? 16 : 24, backgroundColor: C.white, border: "1px solid #E5E7EB", boxShadow: "0 1px 4px rgba(14,26,43,0.03)" }}>

                {/* Score ring + context row */}
                <div style={{ display: "flex", alignItems: mobile ? "center" : "center", gap: mobile ? 20 : 40, marginBottom: 28, flexDirection: mobile ? "column" : "row" }}>
                  {/* Pulsing circle for score ring */}
                  <div style={{ ...skBone(mobile ? 100 : 140, mobile ? 100 : 140, 999), flexShrink: 0 }} />
                  {/* Text lines */}
                  <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 10, alignItems: mobile ? "center" : "flex-start" }}>
                    <div style={skBone(180, 18, 8)} />
                    <div style={skBone(240, 14, 8)} />
                    <div style={skBone(160, 12, 8)} />
                  </div>
                </div>

                {/* Metrics row */}
                <div style={{ display: "flex", gap: 12, marginBottom: 28, flexDirection: mobile ? "column" : "row" }}>
                  {[1, 2, 3].map(i => (
                    <div key={i} style={{ flex: 1, padding: mobile ? "12px 14px" : "14px 16px", borderRadius: 10, backgroundColor: `${B.teal}03`, display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}>
                      <div style={skBone(80, 10, 6)} />
                      <div style={skBone(60, 20, 8)} />
                    </div>
                  ))}
                </div>

                {/* This Week section */}
                <div style={{ padding: mobile ? "20px 20px" : "24px 28px", borderRadius: 16, backgroundColor: "rgba(14,26,43,0.015)", borderLeft: `3px solid ${C.teal}20` }}>
                  <div style={skBone("80%", 18, 8, { marginBottom: 10 })} />
                  <div style={skBone("60%", 14, 8)} />
                </div>
              </div>
            </div>

            {/* Skeleton: Content cards */}
            {[1, 2, 3, 4].map(i => (
              <div key={i} style={{
                marginBottom: 20,
                padding: mobile ? "24px 20px" : "32px 36px",
                borderRadius: 16,
                backgroundColor: C.white,
                border: "1px solid #E5E7EB",
                boxShadow: "0 1px 4px rgba(14,26,43,0.03)",
                animationDelay: `${i * 0.15}s`,
              }}>
                {/* Section label */}
                <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 18 }}>
                  <div style={skBone(4, 24, 2)} />
                  <div style={skBone(120, 12, 6)} />
                </div>
                {/* Content lines */}
                <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                  <div style={skBone("100%", 14, 8)} />
                  <div style={skBone("85%", 14, 8)} />
                  <div style={skBone("70%", 14, 8)} />
                </div>
              </div>
            ))}

          </div>
        </div>
      </>
    );
  }

  /* ================================================================ */
  /*  EMPTY STATE — no record loaded                                   */
  /* ================================================================ */
  const TEASERS = [
    {
      phase: "Your Diagnosis",
      color: B.purple,
      tint: "rgba(75,63,174,0.02)",
      sections: [
        {
          title: "Income Stability Score™\u2122",
          icon: "ring",
          desc: "Your score from 0 to 100. Your stability band. Your distance to the next level.",
          hover: "Most people have never seen their income reduced to one honest number. This score strips away the narratives you tell yourself and shows what would actually survive if something changed. Three key metrics — Income Buffer, Top Source Risk, and Stability Type — tell you exactly where you stand.",
        },
        {
          title: "PressureMap\u2122",
          icon: "map",
          desc: "Your income broken into three zones: what stops, what recurs, and what is protected.",
          hover: "Income that stops if you stop. Income that recurs but can be cancelled. Income that continues no matter what. Most people discover that the zone they assumed was safe is actually the most exposed. The PressureMap™ shows what you have been avoiding.",
        },
        {
          title: "Biggest Risk",
          icon: "target",
          desc: "The single area doing the most damage to your score.",
          hover: "Every income setup has a bottleneck — one area suppressing your score more than all the others combined. This identifies the exact lever that moves the needle, so you stop wasting effort on changes that feel productive but change nothing.",
        },
        {
          title: "What To Strengthen",
          icon: "alert",
          desc: "See how your score holds up if your top client leaves or you can't work for 90 days.",
          hover: "Two real scenarios. Two honest numbers. Most people are surprised by how much their score shifts under pressure they assumed was unlikely — until it happens.",
        },
      ],
    },
    {
      phase: "Your Plan",
      color: B.navy,
      tint: "rgba(14,26,43,0.015)",
      sections: [
        {
          title: "Negotiation Playbook",
          icon: "script",
          desc: "Word-for-word scripts built from your biggest risk, your industry, and your actual numbers.",
          hover: "Knowing what to do is not the hard part. The hard part is knowing what to say. Each script tells you who to talk to, when to use it, the exact words, how to handle pushback, and what a successful response looks like. Personalized with your actual numbers — not a template.",
        },
        {
          title: "12-Week Roadmap",
          icon: "path",
          desc: "A visual timeline with dynamic milestones calculated from your starting numbers.",
          hover: "Not generic advice. Each milestone references your actual percentages: 'Reliance on top source shifts from 72% to below 57%.' Score checkpoints at every stage. Completion tracking that shows your progress in real time.",
        },
      ],
    },
    {
      phase: "Test Your Options",
      color: B.teal,
      tint: "rgba(14,26,43,0.015)",
      sections: [
        {
          title: "What-If Simulator",
          icon: "sim",
          desc: "Model changes before you commit. See the exact score impact.",
          hover: "Add a client, convert to a retainer, build a passive stream. See exactly how each move changes your score, your band, and your trajectory. Save paths. Compare outcomes. You stop guessing and start engineering.",
        },
        {
          title: "Goal Mode",
          icon: "goal",
          desc: "Pick a target level. See the minimum moves required to reach it.",
          hover: "Goal Mode works backwards from the target. It finds the fewest changes needed to cross the threshold. Sometimes it is one move. Sometimes the math says you need two. Either way, you know before you start.",
        },
      ],
    },
    {
      phase: "History",
      color: B.taupe,
      tint: "rgba(14,26,43,0.01)",
      sections: [
        {
          title: "Your Snapshot",
          icon: "track",
          desc: "See exactly how you answered the 6 dimensions — and whether anything has changed.",
          hover: "Your assessment captured a specific moment in time. As you implement changes — sign a retainer, add a client, lock in forward revenue — things evolve. This snapshot lets you see what has changed and when it is time to reassess.",
        },
        {
          title: "Score History",
          icon: "track",
          desc: "Track your score across multiple assessments. See what changed in each area over time.",
          hover: "Each reassessment adds to your timeline. See how your score moved, which dimensions improved, and how your peer benchmark evolved. Available with multiple assessments.",
        },
      ],
    },
  ];

  if (!hasRecord) {
    return (
      <>
        <title>Dashboard | RunPayway™</title>
        <style>{`
          @keyframes fadeSlideIn { from { opacity: 0; transform: translateY(12px); } to { opacity: 1; transform: translateY(0); } }
          @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
          @keyframes slideInUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }

          .cc-teaser-card { position: relative; }
          .cc-teaser-card .cc-hover-reveal { opacity: 0; max-height: 0; overflow: hidden; transition: opacity 300ms ease, max-height 400ms ease; }
          .cc-teaser-card:hover .cc-hover-reveal, .cc-teaser-card:focus-within .cc-hover-reveal { opacity: 1; max-height: 200px; }

          .d-phase { animation: slideInUp 600ms cubic-bezier(0.22, 1, 0.36, 1) both; }
          .d-phase:nth-of-type(2) { animation-delay: 100ms; }
          .d-phase:nth-of-type(3) { animation-delay: 200ms; }
          .d-phase:nth-of-type(4) { animation-delay: 300ms; }

          @media(max-width:640px){
            .cc-teaser-card .cc-hover-reveal { opacity: 1; max-height: 200px; }
          }
        `}</style>
        <div style={{ minHeight: "100vh", backgroundColor: C.sand, fontFamily: sans }}>
          <SuiteHeader current="dashboard" />

          <div style={{ maxWidth: 720, margin: "0 auto", padding: mobile ? "24px 28px 100px" : "48px 36px 96px" }}>

            {/* Hero */}
            <div style={{ textAlign: "center", marginBottom: mobile ? 36 : 48, animation: "fadeSlideIn 600ms ease-out" }}>
              <div style={{ fontSize: 12, fontWeight: 700, letterSpacing: "0.14em", color: B.teal, marginBottom: 16 }}>YOUR DASHBOARD IS READY</div>
              <h1 style={{ fontSize: mobile ? 28 : 36, fontWeight: 300, color: B.navy, margin: "0 0 14px", lineHeight: 1.25, letterSpacing: "-0.02em" }}>
                Unlock your personalized action plan.
              </h1>
              <p style={{ fontSize: 17, color: B.navy, opacity: 0.6, margin: "0 0 28px", lineHeight: 1.65, maxWidth: 520, marginLeft: "auto", marginRight: "auto" }}>
                Your stability class showed you where you stand. Your full report + dashboard shows you exactly what to do about it.
              </p>
              <div style={{ display: "flex", flexDirection: "column" as const, gap: 14, maxWidth: 440, margin: "0 auto 24px", textAlign: "left" as const }}>
                {[
                  "Your personalized action plan with projected score improvements",
                  "Word-for-word negotiation scripts built from your income data",
                  "12-week roadmap with weekly milestones",
                  "What-If Explorer to test scenarios before you act",
                  "Progress tracking across reassessments",
                  "Lifetime access to your dashboard",
                ].map((item, i) => (
                  <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 12 }}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#1F6D7A" strokeWidth="2" strokeLinecap="round" style={{ flexShrink: 0, marginTop: 3 }}><path d="M20 6L9 17l-5-5"/></svg>
                    <span style={{ fontSize: 16, color: B.navy, opacity: 0.75, lineHeight: 1.5 }}>{item}</span>
                  </div>
                ))}
              </div>
              <p style={{ fontSize: 16, fontWeight: 600, color: B.teal, textAlign: "center", marginBottom: 24 }}>$69 · One assessment. Lifetime access.</p>
              <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" as const }}>
                <a href={STRIPE_URL} style={{
                  display: "inline-flex", alignItems: "center", justifyContent: "center",
                  height: 60, padding: "0 36px", borderRadius: 16,
                  backgroundColor: B.navy,
                  color: "#FFF", fontSize: 16, fontWeight: 600, textDecoration: "none",
                  boxShadow: "0 8px 24px rgba(14,26,43,0.12)",
                  transition: "transform 200ms, box-shadow 200ms",
                }}
                  onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = "0 12px 32px rgba(14,26,43,0.18)"; }}
                  onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "0 8px 24px rgba(14,26,43,0.12)"; }}
                >Get Your Full Report</a>
              </div>
            </div>

            {/* Access Code link */}
            <div style={{ textAlign: "center", marginBottom: mobile ? 32 : 48 }}>
              <Link href="/access-code" style={{ fontSize: 15, fontWeight: 500, color: B.navy, opacity: 0.5, textDecoration: "none", borderBottom: `1px solid ${B.stone}`, paddingBottom: 2, transition: "opacity 150ms" }}>
                Already have a report? Enter your access code &rarr;
              </Link>
            </div>

            {/* Phase teasers */}
            {TEASERS.map((phase, pi) => (
              <div key={pi} style={{ marginBottom: mobile ? 28 : 40 }}>
                {/* Phase header */}
                <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 16 }}>
                  <div style={{ width: 4, height: 32, borderRadius: 2, backgroundColor: phase.color, opacity: 0.30 }} />
                  <span style={{ fontSize: 12, fontWeight: 700, letterSpacing: "0.12em", color: phase.color, textTransform: "uppercase" as const }}>{phase.phase}</span>
                  <div style={{ height: 1, flex: 1, background: `linear-gradient(90deg, ${phase.color}12 0%, transparent 100%)` }} />
                </div>

                {/* Section cards */}
                <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                  {phase.sections.map((sec, si) => (
                    <div key={si} className="cc-teaser-card"
                      style={{
                        padding: mobile ? "22px 20px" : "28px 32px",
                        borderRadius: 14,
                        border: `1px solid ${B.stone}`,
                        backgroundColor: B.surface,
                        cursor: "default",
                        transition: "border-color 200ms, box-shadow 200ms",
                        boxShadow: "0 1px 3px rgba(14,26,43,0.02)",
                      }}
                      onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.borderColor = `${phase.color}30`; (e.currentTarget as HTMLElement).style.boxShadow = `0 2px 12px ${phase.color}08`; }}
                      onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.borderColor = B.stone; (e.currentTarget as HTMLElement).style.boxShadow = "0 1px 3px rgba(14,26,43,0.02)"; }}
                    >
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 8 }}>
                        <div style={{ fontSize: 18, fontWeight: 600, color: B.navy }}>{sec.title}</div>
                        <div style={{ width: 28, height: 28, borderRadius: 8, backgroundColor: `${phase.color}08`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, marginLeft: 12 }}>
                          <div style={{ width: 8, height: 8, borderRadius: "50%", backgroundColor: `${phase.color}40` }} />
                        </div>
                      </div>
                      <p style={{ fontSize: 16, color: B.navy, opacity: 0.55, margin: 0, lineHeight: 1.6 }}>{sec.desc}</p>
                      {/* Hover reveal — psychological depth */}
                      <div className="cc-hover-reveal">
                        <div style={{ marginTop: 16, paddingTop: 16, borderTop: `1px solid ${phase.color}10` }}>
                          <p style={{ fontSize: 15, color: B.navy, opacity: 0.75, margin: 0, lineHeight: 1.7 }}>{sec.hover}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}

            {/* Bottom CTA */}
            <div style={{ textAlign: "center", padding: mobile ? "40px 24px" : "56px 48px", borderRadius: 20, background: `linear-gradient(135deg, ${B.navy} 0%, #1a1840 50%, ${B.purple} 100%)`, boxShadow: "0 8px 32px rgba(14,26,43,0.12)" }}>
              <div style={{ fontSize: 12, fontWeight: 700, letterSpacing: "0.12em", color: B.teal, marginBottom: 16 }}>READY?</div>
              <h2 style={{ fontSize: mobile ? 22 : 28, fontWeight: 300, color: C.sandText, margin: "0 0 14px", lineHeight: 1.3 }}>
                Your income has a structure. Now see yours.
              </h2>
              <p style={{ fontSize: 16, color: C.sandMuted, margin: "0 0 28px", lineHeight: 1.65, maxWidth: 460, marginLeft: "auto", marginRight: "auto" }}>
                Score, scripts, roadmap, and lifetime dashboard access. Under 2 minutes to complete.
              </p>
              <a href={STRIPE_URL} style={{
                display: "inline-flex", alignItems: "center", justifyContent: "center",
                height: 60, padding: "0 36px", borderRadius: 16,
                backgroundColor: C.white, border: `1px solid ${C.sandLight}`,
                color: B.navy, fontSize: 16, fontWeight: 600, textDecoration: "none",
                boxShadow: "0 8px 24px rgba(14,26,43,0.08)",
                transition: "transform 200ms, box-shadow 200ms",
              }}
                onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = "0 12px 32px rgba(244,241,234,0.15)"; }}
                onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "0 8px 24px rgba(14,26,43,0.08)"; }}
              >Get Your Full Report</a>
            </div>

            {/* Footer */}
            <div style={{ paddingTop: 32, textAlign: "center" }}>
              <p style={{ fontSize: 14, color: B.taupe, margin: "0 0 4px" }}>RunPayway™ | PeopleStar Enterprises, INC.</p>
              <p style={{ fontSize: 12, color: `${B.taupe}80`, margin: 0 }}>Consistent scoring | Private by default</p>
            </div>
          </div>
        </div>
        {mobile && <PhaseNav activePhase="" mobile={mobile} />}
      </>
    );
  }

  return (
    <>
      <title>Dashboard | RunPayway™</title>
      <div style={{ minHeight: "100vh", backgroundColor: B.bg, fontFamily: sans }}>
        <style>{`
          @media(max-width:640px){
            .d-2col{flex-direction:column!important;}
            .d-3col{grid-template-columns:1fr!important;}
            .d-metrics{flex-direction:column!important;}
            .d-compare{flex-direction:column!important;}
            .d-score-hero{flex-direction:column!important;align-items:center!important;text-align:center!important;}
            .d-phase{margin:0!important;padding:0 0 24px!important;}
          }
          @keyframes fadeSlideIn { from { opacity: 0; transform: translateY(12px); } to { opacity: 1; transform: translateY(0); } }
          .cc-section { opacity: 0; transform: translateY(16px); transition: opacity 500ms ease, transform 500ms ease; }
          .cc-section.cc-visible { opacity: 1; transform: translateY(0); }
        `}</style>
        <SuiteHeader current="dashboard" />
        {shareUrl && <a ref={shareRef} href={shareUrl} download={`runpayway-score-${dScore}.png`} style={{ display: "none" }}>dl</a>}

        {/* Phase nav */}
        <PhaseNav activePhase={activePhase} mobile={mobile} />

        <div style={{ maxWidth: 960, margin: "0 auto", padding: mobile ? "20px 28px 120px" : "48px 36px 96px", overflow: "hidden" }}>

          {/* ── MERGED: Score + This Week — one unified top section ── */}
          {(() => {
            const nextStep = roadmap.find((_, i) => !completedSteps.includes(i));
            const nextMove = nextStep ? topMoves.find(m => m.id === nextStep.pid) : topMoves[0];
            const stepsTotal = roadmap.length;
            const stepsDone = completedSteps.length;

            return (
              <div id="phase-diagnosis" style={{ marginBottom: 48, animation: "fadeSlideIn 600ms ease-out" }}>
                <div style={{ padding: mobile ? "36px 24px" : "56px 52px", borderRadius: mobile ? 20 : 28, backgroundColor: B.surface, border: `1px solid rgba(14,26,43,0.06)`, boxShadow: "0 2px 8px rgba(14,26,43,0.04)" }}>

                  {/* Top row: Score ring + context — generous spacing */}
                  <div style={{ display: "flex", alignItems: "center", gap: mobile ? 24 : 48, marginBottom: 36 }} className="d-score-hero">
                    <ScoreRing score={dScore} size={mobile ? 110 : 160} stroke={mobile ? 6 : 8} />
                    <div style={{ flex: 1 }}>
                      <div style={{ marginBottom: 12 }}>
                        {custName && <span style={{ fontSize: mobile ? 18 : 20, fontWeight: 500, color: B.navy, letterSpacing: "-0.01em" }}>{custName}</span>}
                        {custName && indLabel && <span style={{ color: "rgba(14,26,43,0.20)" }}> · </span>}
                        {indLabel && <span style={{ fontSize: mobile ? 14 : 15, color: B.taupe, fontWeight: 400 }}>{indLabel}</span>}
                      </div>
                      <div style={{ fontSize: mobile ? 16 : 18, color: B.navy, lineHeight: 1.6, marginBottom: 10, fontWeight: 400 }}>
                        {gap > 0
                          ? <>{gap} points to <span style={{ fontWeight: 600, color: B.navy }}>{nextB}</span></>
                          : <span style={{ fontWeight: 600, color: B.teal }}>Highest band achieved.</span>
                        }
                      </div>
                      {bm && indLabel && (
                        <div style={{ fontSize: mobile ? 13 : 14, color: B.teal, fontWeight: 500, opacity: 0.9 }}>
                          {bm.peer_percentile > 70 ? "Above industry baseline" : bm.peer_percentile >= 40 ? "At industry baseline" : "Below industry baseline"}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Metrics — refined, minimal design */}
                  <div style={{ display: "flex", gap: mobile ? 10 : 16, marginBottom: 32 }} className="d-metrics">
                    {[
                      { label: "Income Buffer", value: contMo < 1 ? "< 1 mo" : `${contMo.toFixed(1)} mo`, color: contMo < 3 ? B.red : B.teal },
                      { label: vocabDash.scenarios.lose_top_client.split(/[.!?]/)[0].slice(0, 40) || "If Top Source Leaves", value: `−${riskDrop} pts`, color: riskDrop > 15 ? B.red : B.amber },
                      { label: "Stability Type", value: fragLabel, color: fragLabel === "Brittle" || fragLabel === "Fragile" ? B.red : fragLabel === "Resilient" || fragLabel === "Supported" ? B.teal : B.amber },
                    ].map((m) => (
                      <div key={m.label} style={{ flex: 1, padding: mobile ? "18px 14px" : "20px 18px", textAlign: "center" as const, borderRadius: 12, backgroundColor: "transparent", border: `1px solid rgba(14,26,43,0.08)`, transition: "border-color 200ms, background-color 200ms" }}>
                        <div style={{ fontSize: mobile ? 9 : 10, fontWeight: 700, letterSpacing: "0.08em", color: "rgba(14,26,43,0.50)", marginBottom: 8, wordBreak: "break-word" as const }}>{m.label.toUpperCase()}</div>
                        <div style={{ fontSize: mobile ? 17 : 19, fontWeight: 600, fontFamily: mono, color: m.color, lineHeight: 1 }}>{m.value}</div>
                      </div>
                    ))}
                  </div>

                  {/* This Week — lead with the sentence, not labels */}
                  {topMoves.length > 0 && (
                    <div style={{ padding: mobile ? "24px 22px" : "32px 36px", borderRadius: 16, backgroundColor: "transparent", border: `1px solid rgba(14,26,43,0.08)`, borderLeft: `3px solid ${B.teal}` }}>
                      {stepsDone >= stepsTotal ? (
                        <>
                          <div style={{ fontSize: mobile ? 18 : 20, fontWeight: 500, color: B.navy, lineHeight: 1.45, marginBottom: 8 }}>
                            You've completed every step.
                          </div>
                          <p style={{ fontSize: mobile ? 14 : 15, color: B.muted, margin: 0, lineHeight: 1.6, fontWeight: 400 }}>
                            Time to reassess and see how your score has changed.
                          </p>
                        </>
                      ) : nextMove ? (
                        <>
                          <div style={{ fontSize: mobile ? 18 : 20, fontWeight: 500, color: B.navy, lineHeight: 1.45, marginBottom: 10 }}>
                            Focus on: <strong style={{ fontWeight: 600, color: B.navy }}>{(vocabDash?.actionLabels?.[nextMove.id as keyof typeof vocabDash.actionLabels] || nextMove.label).toLowerCase()}</strong>
                          </div>
                          <p style={{ fontSize: mobile ? 14 : 15, color: B.muted, margin: "0 0 14px", lineHeight: 1.6, fontWeight: 400 }}>
                            One move at a time. This is the most impactful thing you can do right now.
                          </p>
                          {/* Micro-actions — the 5-minute version */}
                          {(() => {
                            const vocabSteps = vocabDash?.microSteps?.[nextMove.id as keyof typeof vocabDash.microSteps];
                            const steps = vocabSteps && vocabSteps.length > 0 ? vocabSteps : null;
                            if (!steps) return null;
                            return (
                              <div style={{ marginBottom: 12 }}>
                                <div style={{ fontSize: mobile ? 11 : 12, fontWeight: 600, color: B.teal, marginBottom: 8 }}>YOUR NEXT 3 MOVES</div>
                                {steps.map((s, si) => (
                                  <div key={si} style={{ display: "flex", gap: mobile ? 8 : 10, alignItems: "flex-start", marginBottom: mobile ? 8 : 6 }}>
                                    <span style={{ fontSize: mobile ? 12 : 13, fontFamily: mono, fontWeight: 600, color: B.teal, flexShrink: 0, marginTop: 1 }}>{si + 1}.</span>
                                    <span style={{ fontSize: mobile ? 13 : 14, color: B.navy, lineHeight: 1.5 }}>{s}</span>
                                  </div>
                                ))}
                              </div>
                            );
                          })()}
                          <div style={{ display: "flex", justifyContent: "flex-end", alignItems: "center" }}>
                            <span style={{ fontSize: 12, color: B.taupe }}>
                              {stepsDone > 0 && <>{stepsDone}/{stepsTotal} done · </>}{daysSince > 0 ? `Day ${daysSince}` : "Today"}
                            </span>
                          </div>
                        </>
                      ) : (
                        <div style={{ fontSize: mobile ? 17 : 19, fontWeight: 500, color: B.navy, lineHeight: 1.4 }}>
                          Start with your first move. Scroll down to see the plan.
                        </div>
                      )}
                    </div>
                  )}

                  {/* View Report + Share — actions row */}
                  <div style={{ marginTop: mobile ? 16 : 20, display: "flex", justifyContent: mobile ? "center" : "flex-end", alignItems: "center", gap: mobile ? 12 : 20, flexWrap: "wrap" }}>
                    <button
                      onClick={() => setShowShareModal(true)}
                      style={{ fontSize: mobile ? 12 : 13, fontWeight: 500, color: B.taupe, background: "none", border: `1px solid ${B.stone}`, borderRadius: 8, padding: mobile ? "8px 12px" : "6px 14px", cursor: "pointer", fontFamily: sans, display: "inline-flex", alignItems: "center", gap: 6, transition: "border-color 150ms, color 150ms", minHeight: 32 }}
                      onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.borderColor = B.purple; (e.currentTarget as HTMLElement).style.color = B.purple; }}
                      onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.borderColor = B.stone; (e.currentTarget as HTMLElement).style.color = B.taupe; }}
                    >
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M4 12v8a2 2 0 002 2h12a2 2 0 002-2v-8"/><polyline points="16 6 12 2 8 6"/><line x1="12" y1="2" x2="12" y2="15"/></svg>
                      Share Score
                    </button>
                    <Link href="/review" style={{ fontSize: mobile ? 12 : 13, fontWeight: 500, color: B.taupe, textDecoration: "none", display: "inline-flex", alignItems: "center", minHeight: mobile ? 32 : 36, padding: mobile ? "0 8px" : "0", transition: "color 150ms" }}
                      onMouseEnter={(e) => { e.currentTarget.style.color = B.navy; }}
                      onMouseLeave={(e) => { e.currentTarget.style.color = B.taupe; }}>
                      View full report &rarr;
                    </Link>
                    <button
                      onClick={() => {
                        sessionStorage.removeItem("rp_record");
                        localStorage.removeItem("rp_record");
                        sessionStorage.removeItem("rp_purchase_session");
                        localStorage.removeItem("rp_purchase_session");
                        router.push("/dashboard/login");
                      }}
                      style={{ fontSize: 12, fontWeight: 500, color: "rgba(14,26,43,0.40)", background: "none", border: "none", cursor: "pointer", padding: "6px 0", fontFamily: sans, transition: "color 150ms" }}
                      onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.color = "rgba(14,26,43,0.60)"; }}
                      onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.color = "rgba(14,26,43,0.40)"; }}
                    >
                      Sign out
                    </button>
                  </div>
                </div>
              </div>
            );
          })()}

          {/* Share Score Modal */}
          {showShareModal && (
            <div style={{ position: "fixed", inset: 0, zIndex: 10000, background: "rgba(14,26,43,0.60)", backdropFilter: "blur(8px)", WebkitBackdropFilter: "blur(8px)", display: "flex", alignItems: "center", justifyContent: "center", padding: 24 }} onClick={() => setShowShareModal(false)}>
              <div style={{ maxWidth: 620, width: "100%", maxHeight: "90vh", overflow: "auto", borderRadius: 16, background: C.sand, padding: mobile ? 20 : 32, boxShadow: "0 24px 80px rgba(14,26,43,0.25)" }} onClick={(e: React.MouseEvent) => e.stopPropagation()}>
                <ShareableScoreCard
                  score={score}
                  band={band}
                  accessCode={(() => { const rid = (r?.record_id as string) || ""; return rid.length > 8 ? rid.slice(0, 8).toUpperCase() : rid.toUpperCase(); })()}
                  industry={sector ? (() => { const words = sector.replace(/_/g, " ").split(" "); return words.map((w: string) => w.charAt(0).toUpperCase() + w.slice(1)).join(" "); })() : ""}
                  name={custName}
                  onClose={() => setShowShareModal(false)}
                />
              </div>
            </div>
          )}

          {/* ════════════════════════════════════════════════════════ */}
          {/*  AI ADVISOR — personalized guidance                        */}
          {/* ════════════════════════════════════════════════════════ */}
          <div style={{ marginBottom: 40 }}>
            <div style={{ padding: mobile ? "28px 22px" : "40px 44px", borderRadius: 24, backgroundColor: B.surface, border: `1px solid ${B.stone}`, boxShadow: "0 1px 4px rgba(14,26,43,0.03)" }}>
              <div style={{ marginBottom: 20 }}>
                <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.12em", color: B.purple, marginBottom: 12 }}>WHAT DO YOU WANT TO UNLOCK?</div>
                <div style={{ fontSize: mobile ? 18 : 22, fontWeight: 500, color: B.navy, margin: "0 0 6px", lineHeight: 1.35 }}>
                  Get personalized guidance
                </div>
                <p style={{ fontSize: 14, color: B.muted, margin: 0, lineHeight: 1.6 }}>
                  Tell us what matters to you, and we'll show you the exact moves that unlock it for your situation.
                </p>
              </div>

              <div style={{ display: "flex", gap: 12, marginBottom: 16, flexDirection: mobile ? "column" : "row" }}>
                <input
                  type="text"
                  placeholder="e.g., 'I want to take 2 weeks off without losing income'"
                  value={advisorGoal}
                  onChange={(e) => setAdvisorGoal(e.target.value)}
                  disabled={advisorLoading}
                  onKeyDown={(e) => { if (e.key === "Enter") handleAdvisorAnalyze(); }}
                  style={{
                    flex: 1,
                    padding: "12px 16px",
                    fontSize: 14,
                    fontFamily: sans,
                    border: `1px solid ${B.stone}`,
                    borderRadius: 10,
                    backgroundColor: B.white,
                    color: B.navy,
                    outline: "none",
                    transition: "border-color 150ms",
                  }}
                  onFocus={(e) => { e.currentTarget.style.borderColor = `${B.teal}40`; }}
                  onBlur={(e) => { e.currentTarget.style.borderColor = B.stone; }}
                />
                <button
                  onClick={handleAdvisorAnalyze}
                  disabled={advisorLoading || !advisorGoal.trim()}
                  style={{
                    height: 44,
                    padding: "0 24px",
                    fontSize: 14,
                    fontWeight: 600,
                    color: advisorLoading || !advisorGoal.trim() ? "rgba(14,26,43,0.30)" : B.white,
                    backgroundColor: advisorLoading || !advisorGoal.trim() ? "rgba(31,109,122,0.10)" : B.teal,
                    border: "none",
                    borderRadius: 10,
                    cursor: advisorLoading || !advisorGoal.trim() ? "not-allowed" : "pointer",
                    transition: "all 150ms",
                    fontFamily: sans,
                    whiteSpace: "nowrap",
                  }}
                  onMouseEnter={(e) => {
                    if (!advisorLoading && advisorGoal.trim()) {
                      (e.currentTarget as HTMLButtonElement).style.backgroundColor = "rgba(31,109,122,0.85)";
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!advisorLoading && advisorGoal.trim()) {
                      (e.currentTarget as HTMLButtonElement).style.backgroundColor = B.teal;
                    }
                  }}
                >
                  {advisorLoading ? "Analyzing..." : "Get Guidance"}
                </button>
              </div>

              {advisorResponse && (
                <div style={{ padding: "20px 24px", borderRadius: 12, backgroundColor: `${B.teal}06`, border: `1px solid ${B.teal}15` }}>
                  <div style={{ fontSize: 12, fontWeight: 700, color: B.teal, letterSpacing: "0.08em", marginBottom: 12, textTransform: "uppercase" }}>Advisor's Take</div>
                  <p style={{ fontSize: 14, color: B.navy, margin: "0 0 12px", lineHeight: 1.65, whiteSpace: "pre-wrap" }}>
                    {advisorResponse.guidance}
                  </p>
                  {advisorResponse.timeline_estimate && (
                    <div style={{ fontSize: 12, color: B.taupe, marginTop: 12, paddingTop: 12, borderTop: `1px solid ${B.teal}20` }}>
                      <strong>Timeline:</strong> {advisorResponse.timeline_estimate}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* ════════════════════════════════════════════════════════ */}
          {/*  EXPLORE — PressureMap + What-If (context & exploration)  */}
          {/* ════════════════════════════════════════════════════════ */}
          <PhaseSep label="Explore" color={B.teal} tint="rgba(14,26,43,0.015)" id="phase-explore" mobile={mobile}>

          {/* PRESSUREMAP™ — moved here from top for context-after-action order */}
          <section className="cc-section" style={{ padding: mobile ? "32px 22px" : "44px 48px", borderRadius: 24, backgroundColor: B.surface, border: `1px solid ${B.stone}`, marginBottom: 24, boxShadow: "0 1px 4px rgba(14,26,43,0.03)" }}>

            {/* Header — clean, confident */}
            <div style={{ marginBottom: 28 }}>
              <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.12em", color: B.teal, marginBottom: 10 }}>PRESSUREMAP™{indLabel ? ` — ${indLabel.toUpperCase()}` : ""}</div>
              <p style={{ fontSize: mobile ? 18 : 22, fontWeight: 500, color: B.navy, margin: 0, lineHeight: 1.35 }}>
                {activeInc >= 60
                  ? `${activeInc}% of your income stops the moment you stop. Here's how that is structured.`
                  : persInc >= 30
                  ? `${persInc}% of your income is protected. Here's where the rest stands.`
                  : `Your income splits into three zones. Here's what each one means for you.`
                }
              </p>
            </div>

            {/* Visual bar — larger, more breathing room */}
            <div style={{ marginBottom: 28 }}>
              <div style={{ display: "flex", height: 16, borderRadius: 8, overflow: "hidden", marginBottom: 10 }}>
                {zones.map(z => z.pct > 0 ? <div key={z.id} style={{ width: `${z.pct}%`, backgroundColor: `${z.color}35`, borderRight: z.id !== "persistent" ? `2px solid ${B.white}` : "none" }} /> : null)}
              </div>
              <div style={{ display: "flex" }}>
                {zones.map(z => z.pct > 0 ? <div key={`label-${z.id}`} style={{ width: `${z.pct}%` }}>{z.pct >= 10 && <span style={{ fontSize: 12, fontWeight: 600, color: z.color }}>{z.label} <span style={{ fontFamily: mono }}>{z.pct}%</span></span>}</div> : null)}
              </div>
            </div>

            {/* Industry insight — one confident sentence */}
            {indData.general && (
              <p style={{ fontSize: 15, fontWeight: 500, color: B.teal, margin: "0 0 28px", lineHeight: 1.5, borderLeft: `3px solid ${B.teal}`, paddingLeft: 16 }}>
                {indData.general}
              </p>
            )}

            {/* Zone cards — insight-first, data secondary */}
            <div style={{ display: "flex", flexDirection: "column" as const, gap: 12 }}>
              {zones.map(z => (
                <div key={z.id} style={{ padding: mobile ? "18px 20px" : "22px 28px", borderRadius: 14, backgroundColor: "rgba(14,26,43,0.015)", borderLeft: `3px solid ${z.color}` }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 6 }}>
                    <span style={{ fontSize: 15, fontWeight: 600, color: B.navy }}>{z.label} — <span style={{ fontFamily: mono, color: z.color }}>{z.pct}%</span></span>
                    {z.peer && <span style={{ fontSize: 12, color: B.taupe }}>{z.peer}</span>}
                  </div>
                  <p style={{ fontSize: 14, color: B.muted, margin: 0, lineHeight: 1.6 }}>{z.txt}</p>
                </div>
              ))}
            </div>

            {/* What to strengthen — clean, below zones */}
            <div style={{ marginTop: 24, padding: mobile ? "20px 20px" : "24px 28px", borderRadius: 14, backgroundColor: `${B.red}04`, borderLeft: `3px solid ${B.red}` }}>
              <p style={{ fontSize: mobile ? 16 : 18, fontWeight: 500, color: B.navy, margin: "0 0 8px", lineHeight: 1.4 }}>
                {vocabDash.scenarios.lose_top_client.split(/[.!?]/)[0]}  — your score would shift {dScore - stLCDrop < 30 && dScore >= 30 ? "into Limited Stability in this scenario." : `from ${dScore} to ${dScore - stLCDrop} in this scenario.`}
              </p>
              <p style={{ fontSize: 14, color: B.muted, margin: 0, lineHeight: 1.6 }}>{constraintNarrative(rootCon, base, sector)}</p>
            </div>
          </section>

          {/* What-If Explorer — categorized, visual, recommended */}
          <section className="cc-section">
            <button onClick={() => setWhatIfOpen(!whatIfOpen)}
              style={{ width: "100%", display: "flex", justifyContent: "space-between", alignItems: "center", padding: mobile ? "24px 22px" : "28px 32px", border: `1px solid ${B.stone}`, borderRadius: whatIfOpen ? "14px 14px 0 0" : 14, backgroundColor: B.surface, cursor: "pointer", transition: "border-radius 200ms", boxShadow: "0 1px 3px rgba(14,26,43,0.02)", boxSizing: "border-box" as const }}>
              <div style={{ textAlign: "left" as const, flex: 1 }}>
                <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.12em", color: B.teal, marginBottom: 4 }}>WHAT-IF EXPLORER</div>
                <div style={{ fontSize: 14, color: B.muted }}>Test changes before you commit. See the exact score impact.</div>
              </div>
              {!whatIfOpen && topMoves[0] && (
                <div style={{ textAlign: "right" as const, flexShrink: 0, marginLeft: 16, marginRight: 8 }}>
                  <div style={{ fontSize: 16, fontWeight: 300, fontFamily: mono, color: B.teal }}>+{topMoves[0].lift}</div>
                  <div style={{ fontSize: 11, color: B.taupe }}>best move</div>
                </div>
              )}
              <span style={{ fontSize: 16, color: B.taupe, flexShrink: 0, marginLeft: 16, transition: "transform 200ms", transform: whatIfOpen ? "rotate(180deg)" : "rotate(0deg)" }}>▼</span>
            </button>

            {whatIfOpen && (() => {
              const growthPresetsMeta = presetMeta.filter(p => !["lose_top_client", "cant_work_90_days"].includes(p.id));
              const stressPresetsMeta = presetMeta.filter(p => ["lose_top_client", "cant_work_90_days"].includes(p.id));

              return (
              <div style={{ border: `1px solid ${B.stone}`, borderTop: "none", borderRadius: "0 0 14px 14px", backgroundColor: B.surface, padding: mobile ? "24px 20px" : "28px 32px" }}>

                {simLoading && !simResults ? (
                  <div style={{ textAlign: "center", padding: "24px 0", color: B.taupe, fontSize: 14 }}>Loading simulations...</div>
                ) : (
                <>
                {/* GROWTH MOVES */}
                <div style={{ fontSize: 12, fontWeight: 700, letterSpacing: "0.08em", color: B.teal, marginBottom: 12 }}>GROWTH MOVES</div>
                <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 24 }}>
                  {growthPresetsMeta.map((pr) => {
                    const res = simResults?.[pr.id]; const lift = res ? res.overall_score - dScore : 0;
                    const isA = effectivePreset === pr.id;
                    const isTop = topMoves[0]?.id === pr.id;
                    const why = isTop ? `Recommended \u2014 addresses your root constraint (${rootCon.replace(/_/g, " ")})` : null;
                    return (
                      <button key={pr.id} onClick={() => setActivePreset(isA && activePreset === pr.id ? null : pr.id)}
                        style={{ padding: "18px 22px", textAlign: "left" as const, borderRadius: 14, cursor: "pointer", transition: "all 200ms", border: `1px solid ${isA ? `${B.purple}30` : isTop ? `${B.teal}15` : B.stone}`, backgroundColor: isA ? `${B.purple}04` : isTop ? `${B.teal}02` : "rgba(14,26,43,0.015)", minHeight: 48 }}>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12, marginBottom: 4 }}>
                          <div style={{ display: "flex", alignItems: "center", gap: 8, minWidth: 0 }}>
                            <span style={{ fontSize: mobile ? 13 : 14, fontWeight: 600, color: isA ? B.navy : B.muted }}>{pr.label}</span>
                            {isTop && <span style={{ fontSize: 11, fontWeight: 600, padding: "2px 8px", borderRadius: 10, backgroundColor: `${B.teal}10`, color: B.teal, flexShrink: 0 }}>#1</span>}
                          </div>
                          <span style={{ fontSize: 14, fontWeight: 600, fontFamily: mono, color: B.teal, flexShrink: 0, whiteSpace: "nowrap" as const }}>+{lift}</span>
                        </div>
                        <p style={{ fontSize: 14, color: B.taupe, margin: 0, lineHeight: 1.6 }}>{pr.description}</p>
                        {why && <p style={{ fontSize: 12, color: B.teal, margin: "6px 0 0", fontWeight: 500 }}>{why}</p>}
                      </button>
                    );
                  })}
                </div>

                {/* STRESS TESTS */}
                <div style={{ fontSize: 12, fontWeight: 700, letterSpacing: "0.08em", color: B.red, marginBottom: 12 }}>STRESS TESTS</div>
                <div style={{ display: "flex", gap: 8, marginBottom: 24, flexDirection: mobile ? "column" : "row" }}>
                  {stressPresetsMeta.map(pr => {
                    const res = simResults?.[pr.id]; const lift = res ? res.overall_score - dScore : 0;
                    const isA = effectivePreset === pr.id;
                    const scenarioKey = pr.id as keyof typeof vocabDash.scenarios;
                    const vocabScenario = vocabDash.scenarios[scenarioKey];
                    const scenarioLabel = vocabScenario ? vocabScenario.split(/[.!?]/)[0] : pr.label;
                    const scenarioDesc = vocabScenario || pr.description;
                    return (
                      <button key={pr.id} onClick={() => setActivePreset(isA && activePreset === pr.id ? null : pr.id)}
                        style={{ flex: 1, padding: "16px 20px", textAlign: "left" as const, borderRadius: 12, cursor: "pointer", transition: "all 200ms", border: `1px solid ${isA ? `${B.red}40` : B.stone}`, backgroundColor: isA ? `${B.red}04` : "transparent", minHeight: 48 }}>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12, marginBottom: 4 }}>
                          <span style={{ fontSize: mobile ? 13 : 14, fontWeight: 600, color: isA ? B.navy : B.muted }}>{scenarioLabel}</span>
                          <span style={{ fontSize: 14, fontWeight: 600, fontFamily: mono, color: B.red, flexShrink: 0, whiteSpace: "nowrap" as const }}>{lift}</span>
                        </div>
                        <p style={{ fontSize: 14, color: B.taupe, margin: 0, lineHeight: 1.6 }}>{scenarioDesc}</p>
                      </button>
                    );
                  })}
                </div>
                </>
                )}

                {/* SCENARIO RESULT — clean, answers "what would this do for me?" */}
                {effectivePreset && aPO && sResult && (
                  <div style={{ padding: mobile ? "22px 20px" : "24px 28px", borderRadius: 16, backgroundColor: "rgba(14,26,43,0.015)", borderLeft: `3px solid ${sDelta >= 0 ? B.teal : B.red}` }}>
                    <p style={{ fontSize: 16, fontWeight: 500, color: B.navy, margin: "0 0 8px", lineHeight: 1.4 }}>
                      {sDelta > 0
                        ? `If you ${aPO.label.toLowerCase()}, your score goes from ${dScore} to ${sResult.overall_score}.`
                        : sDelta < 0
                        ? `If ${aPO.label.toLowerCase().replace("lose ", "you lose ").replace("can't", "you can't")}, your score would shift from ${dScore} to ${sResult.overall_score}.`
                        : `${aPO.label} would not change your score.`
                      }
                    </p>
                    {sResult.band !== dBand && <p style={{ fontSize: 14, fontWeight: 500, color: sDelta >= 0 ? B.teal : B.red, margin: "0 0 6px" }}>That moves you to {sResult.band}.</p>}
                    <p style={{ fontSize: 14, color: B.muted, margin: 0, lineHeight: 1.55 }}>{aPO.description}</p>
                  </div>
                )}
              </div>
              );
            })()}
          </section>

          </PhaseSep>

          {/* ════════════════════════════════════════════════════════ */}
          {/*  YOUR PLAN — "What should I do?" (action-first)          */}
          {/* ════════════════════════════════════════════════════════ */}
          <PhaseSep label="Your Plan" color={B.navy} tint="rgba(14,26,43,0.015)" id="phase-plan" mobile={mobile}>

          {/* 12-WEEK ROADMAP — moved first for action-first order */}
          {roadmap.length > 1 && (
            <section className="cc-section" style={{ padding: mobile ? "32px 22px" : "44px 48px", borderRadius: 24, backgroundColor: B.surface, border: `1px solid ${B.stone}`, boxShadow: "0 1px 4px rgba(14,26,43,0.03)" }}>
              <div style={{ marginBottom: 24 }}>
                <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.12em", color: B.purple, marginBottom: 10 }}>12-WEEK ROADMAP</div>
                <p style={{ fontSize: mobile ? 18 : 22, fontWeight: 500, color: B.navy, margin: "0 0 6px", lineHeight: 1.35 }}>
                  {totalLift > 0 ? `${roadmap.length} moves. ${dScore} → ${dScore + totalLift}. Here's the order.` : "Your execution timeline."}
                </p>
                {completedSteps.length > 0 && <p style={{ fontSize: 14, color: B.teal, fontWeight: 500, margin: 0 }}>{completedSteps.length} of {roadmap.length} complete</p>}
              </div>

              {/* Timeline steps */}
              <div style={{ position: "relative", paddingLeft: mobile ? 28 : 36 }}>
                {/* Vertical timeline line */}
                <div style={{ position: "absolute", left: mobile ? 13 : 17, top: 0, bottom: 0, width: 2, backgroundColor: B.stone }} />

                {roadmap.map((step, i) => {
                  const done = completedSteps.includes(i);
                  const prevDone = i === 0 || completedSteps.includes(i - 1);
                  const isFirst = !done && prevDone && !completedSteps.includes(i);
                  const plainMilestone: Record<string, string> = {
                    add_client: "No single client carries more than half your income",
                    convert_retainer: "At least some of your income repeats automatically each month",
                    build_passive: "You have income that comes in whether you work that day or not",
                    lock_forward: "Next quarter's revenue is already committed — not hoped for",
                  };
                  const timeEstimate: Record<string, string> = {
                    add_client: "2–4 weeks",
                    convert_retainer: "1–2 conversations",
                    build_passive: "4–8 weeks to set up",
                    lock_forward: "1–3 conversations",
                  };
                  const successSignal: Record<string, string> = {
                    add_client: "You've signed a new client or agreement that generates real revenue",
                    convert_retainer: "A client has agreed to a recurring arrangement — even a small one",
                    build_passive: "Revenue came in that didn't require your active work that week",
                    lock_forward: "You have a signed commitment for income beyond this month",
                  };
                  return (
                    <div key={i} style={{ position: "relative", marginBottom: i < roadmap.length - 1 ? 20 : 0, transition: "opacity 300ms" }}>
                      {/* Timeline dot */}
                      <button role="checkbox" aria-checked={done} aria-label={`Mark step ${i + 1} as ${done ? 'incomplete' : 'complete'}`} onClick={() => toggleStep(i)} style={{ position: "absolute", left: mobile ? -28 : -36, top: done ? 6 : isFirst ? 14 : 6, width: 28, height: 28, borderRadius: "50%", backgroundColor: done ? B.teal : isFirst ? B.purple : `${B.teal}08`, border: `2px solid ${done ? B.teal : isFirst ? B.purple : `${B.teal}40`}`, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", transition: "all 200ms", zIndex: 1 }}>
                        {done ? <span style={{ color: B.white, fontSize: 12, fontWeight: 700 }}>&#10003;</span> : <span style={{ fontSize: 12, fontWeight: 700, color: isFirst ? B.white : B.teal }}>{i + 1}</span>}
                      </button>

                      {/* Completed step — compact with celebration */}
                      {done ? (
                        <div style={{ padding: "14px 20px", borderRadius: 12, backgroundColor: `${B.teal}04`, border: `1px solid ${B.teal}12` }}>
                          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12 }}>
                            <span style={{ fontSize: 15, fontWeight: 500, color: B.teal, textDecoration: "line-through", opacity: 0.7 }}>{step.action}</span>
                            <span style={{ fontSize: 12, fontFamily: mono, color: B.teal, flexShrink: 0, whiteSpace: "nowrap" as const }}>+{step.lift} pts</span>
                          </div>
                        </div>
                      ) : isFirst ? (
                        /* Active step — fully expanded */
                        <div style={{ padding: mobile ? "20px 20px" : "24px 28px", borderRadius: 16, backgroundColor: `${B.purple}03`, border: `1px solid ${B.purple}15` }}>
                          <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.10em", color: B.purple, marginBottom: 10 }}>YOUR CURRENT STEP</div>

                          <div style={{ fontSize: 17, fontWeight: 600, color: B.navy, marginBottom: 6, lineHeight: 1.3 }}>{step.action}</div>
                          <p style={{ fontSize: 14, color: B.muted, margin: "0 0 14px", lineHeight: 1.6 }}>{step.desc}</p>

                          <div style={{ display: "flex", gap: mobile ? 8 : 16, marginBottom: 14, flexWrap: "wrap" as const }}>
                            <span style={{ fontSize: 12, color: B.taupe }}>{step.weeks}</span>
                            {timeEstimate[step.pid] && <span style={{ fontSize: 12, color: B.taupe }}>Takes {timeEstimate[step.pid]}</span>}
                            <span style={{ fontSize: 12, color: B.taupe }}>{step.effortLabel}</span>
                          </div>

                          <div style={{ padding: "14px 16px", borderRadius: 10, backgroundColor: B.white, borderLeft: `3px solid ${B.teal}` }}>
                            <div style={{ fontSize: 13, fontWeight: 500, color: B.navy, marginBottom: 6 }}>{plainMilestone[step.pid] || step.target}</div>
                            {successSignal[step.pid] && (
                              <p style={{ fontSize: 13, color: B.muted, margin: "0 0 6px", lineHeight: 1.5 }}>
                                <span style={{ fontWeight: 600, color: B.teal }}>Done when:</span> {successSignal[step.pid]}
                              </p>
                            )}
                            <span style={{ fontSize: 12, fontFamily: mono, color: B.taupe }}>Score: {step.cumulativeFrom} → {step.cumulativeTo}</span>
                          </div>
                          {(() => {
                            const sc = scriptFor(step.pid);
                            const personalize = (text: string) => text
                              .replace(/\[Client Name\]/g, "your client")
                              .replace(/\[Contact Name\]/g, "[Contact Name]")
                              .replace(/\[Partner Name\]/g, "[Partner Name]")
                              .replace(/\[Broker Name\]/g, "[Contact Name]")
                              .replace(/\[X\]/g, String(Math.max(2, Math.round(base.source_diversity_count))))
                              .replace(/\[X hours\]/g, "10 hours")
                              .replace(/\[X years\]/g, "5+ years")
                              .replace(/\[X properties[^\]]*\]/g, "multiple properties")
                              .replace(/\[\$ amount\]/g, "$2,500")
                              .replace(/\[project name\]/g, "recent engagement")
                              .replace(/\[current industry\]/g, indLabel.toLowerCase() || "your industry")
                              .replace(/\[new vertical\]/g, "an adjacent vertical")
                              .replace(/\[their (company|service|clients)\]/g, "their organization")
                              .replace(/\[your (service|expertise area)\]/g, "your area of focus");
                            if (!sc) return null;
                            const scriptText = personalize(sc.script);
                            const isScriptOpen = expandedPlaybook === step.pid;
                            return (
                              <div style={{ marginTop: 14 }}>
                                <button onClick={() => setExpandedPlaybook(isScriptOpen ? null : step.pid)}
                                  style={{ fontSize: 13, fontWeight: 600, color: B.teal, background: "none", border: "none", cursor: "pointer", padding: 0, minHeight: 36 }}>
                                  {isScriptOpen ? "Hide script ↑" : "What to say →"}
                                </button>
                                {isScriptOpen && (
                                  <div style={{ marginTop: 10, position: "relative" }}>
                                    <pre style={{ fontSize: mobile ? 12 : 13, color: B.navy, lineHeight: 1.65, whiteSpace: "pre-wrap" as const, wordBreak: "break-word" as const, margin: 0, padding: mobile ? "14px 16px" : "16px 20px", backgroundColor: B.white, borderRadius: 10, border: `1px solid ${B.stone}`, fontFamily: sans }}>
                                      {scriptText}
                                    </pre>
                                    <button aria-label="Copy script" onClick={() => { navigator.clipboard.writeText(scriptText).then(() => { setCopiedPlaybook(step.pid); setTimeout(() => setCopiedPlaybook(null), 2000); }); }}
                                      style={{ position: "absolute", top: 8, right: 8, fontSize: 12, fontWeight: 600, color: copiedPlaybook === step.pid ? B.teal : B.muted, backgroundColor: copiedPlaybook === step.pid ? `${B.teal}08` : "#FAFAFA", border: `1px solid ${B.stone}`, borderRadius: 6, padding: "6px 12px", cursor: "pointer", minHeight: 32, transition: "all 200ms" }}>
                                      {copiedPlaybook === step.pid ? "Copied!" : "Copy"}
                                    </button>
                                  </div>
                                )}
                              </div>
                            );
                          })()}
                        </div>
                      ) : (
                        /* Future step — collapsed, muted but readable */
                        <div style={{ padding: "14px 20px", borderRadius: 12, backgroundColor: `${B.purple}03`, border: `1px solid rgba(14,26,43,0.08)` }}>
                          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12 }}>
                            <div style={{ display: "flex", alignItems: "center", gap: 8, minWidth: 0 }}>
                              <span style={{ fontSize: 9, fontWeight: 700, letterSpacing: "0.08em", color: B.taupe, padding: "2px 6px", borderRadius: 4, backgroundColor: "rgba(14,26,43,0.04)", flexShrink: 0 }}>UPCOMING</span>
                              <span style={{ fontSize: 15, fontWeight: 500, color: B.muted }}>{step.action}</span>
                            </div>
                            <span style={{ fontSize: 12, color: B.taupe, flexShrink: 0, whiteSpace: "nowrap" as const }}>{step.weeks}</span>
                          </div>
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
          {/*  PROGRESS — Score history (multi-assessment only)         */}
          {/* ════════════════════════════════════════════════════════ */}
          <PhaseSep label="Progress" color={B.taupe} tint="rgba(14,26,43,0.01)" id="phase-progress" mobile={mobile}>

          {/* ──── Score History + Factor Deltas + Benchmark Evolution ──── */}
          {assessments.length >= 2 && (
            <section className="cc-section" style={{ marginBottom: 20, padding: mobile ? "28px 24px" : "36px 40px", border: `1px solid ${B.stone}`, borderRadius: 16, backgroundColor: B.surface, boxShadow: "0 1px 4px rgba(14,26,43,0.03)" }}>
              <div style={{ fontSize: 12, fontWeight: 700, letterSpacing: "0.10em", color: B.purple, marginBottom: 10 }}>STABILITY MONITORING</div>
              <div style={{ fontSize: 16, fontWeight: 600, color: B.navy, marginBottom: 4 }}>Score History</div>
              <p style={{ fontSize: 14, color: B.muted, margin: "0 0 20px" }}>{assessments.length} assessments tracked. {serverEntitlements ? (serverEntitlements.remaining > 0 ? `${serverEntitlements.remaining} remaining on your plan.` : "All assessments completed.") : (assessments.length < 3 ? `${3 - assessments.length} remaining on your plan.` : "All assessments completed.")}</p>

              {/* Score timeline visual */}
              <div style={{ display: "flex", alignItems: "flex-end", gap: mobile ? 12 : 24, marginBottom: 24, padding: "20px 0" }}>
                {assessments.slice().reverse().map((a, i) => {
                  const isLatest = i === assessments.slice().reverse().length - 1;
                  const aColor = bandColor(a.final_score);
                  const barH = Math.max(40, (a.final_score / 100) * 140);
                  return (
                    <div key={i} style={{ flex: 1, textAlign: "center" as const }}>
                      <div style={{ fontSize: 11, color: B.taupe, marginBottom: 6 }}>
                        {new Date(a.assessment_date_utc || a.issued_timestamp_utc).toLocaleDateString("en-US", { month: "short", year: "numeric" })}
                      </div>
                      <div style={{ height: barH, backgroundColor: isLatest ? aColor : `${aColor}40`, borderRadius: 6, margin: "0 auto", width: mobile ? "100%" : 56, display: "flex", alignItems: "flex-end", justifyContent: "center", paddingBottom: 8, transition: "height 600ms ease" }}>
                        <span style={{ fontFamily: mono, fontSize: isLatest ? 20 : 16, fontWeight: isLatest ? 700 : 400, color: isLatest ? "#FFF" : aColor }}>{a.final_score}</span>
                      </div>
                      <div style={{ fontSize: 10, color: isLatest ? aColor : B.taupe, fontWeight: isLatest ? 600 : 400, marginTop: 4 }}>
                        {i === 0 ? "First" : isLatest ? "Latest" : `#${i + 1}`}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Score delta summary */}
              {(() => {
                const first = assessments[assessments.length - 1];
                const latest = assessments[0];
                const totalDelta = latest.final_score - first.final_score;
                return (
                  <div style={{ display: "flex", gap: 12, marginBottom: 20, flexWrap: "wrap" as const }}>
                    <div style={{ flex: 1, minWidth: 120, padding: "14px 16px", borderRadius: 10, backgroundColor: `${B.stone}`, textAlign: "center" as const }}>
                      <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.08em", color: B.taupe, marginBottom: 4 }}>FIRST SCORE</div>
                      <div style={{ fontFamily: mono, fontSize: 24, fontWeight: 300, color: B.taupe }}>{first.final_score}</div>
                    </div>
                    <div style={{ flex: 1, minWidth: 120, padding: "14px 16px", borderRadius: 10, backgroundColor: `${B.stone}`, textAlign: "center" as const }}>
                      <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.08em", color: B.taupe, marginBottom: 4 }}>LATEST SCORE</div>
                      <div style={{ fontFamily: mono, fontSize: 24, fontWeight: 300, color: B.navy }}>{latest.final_score}</div>
                    </div>
                    <div style={{ flex: 1, minWidth: 120, padding: "14px 16px", borderRadius: 10, backgroundColor: totalDelta > 0 ? `${B.teal}06` : totalDelta < 0 ? "rgba(155,44,44,0.04)" : `${B.stone}`, border: `1px solid ${totalDelta > 0 ? `${B.teal}18` : totalDelta < 0 ? "rgba(155,44,44,0.10)" : B.stone}`, textAlign: "center" as const }}>
                      <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.08em", color: totalDelta > 0 ? B.teal : totalDelta < 0 ? B.red : B.taupe, marginBottom: 4 }}>TOTAL CHANGE</div>
                      <div style={{ fontFamily: mono, fontSize: 24, fontWeight: 600, color: totalDelta > 0 ? B.teal : totalDelta < 0 ? B.red : B.taupe }}>{totalDelta > 0 ? "+" : ""}{totalDelta}</div>
                    </div>
                  </div>
                );
              })()}

              {/* Factor-level deltas */}
              {(() => {
                const first = assessments[assessments.length - 1];
                const latest = assessments[0];
                const fNi = first._v2?.normalized_inputs as Record<string, number> | undefined;
                const lNi = latest._v2?.normalized_inputs as Record<string, number> | undefined;
                if (!fNi || !lNi) return null;
                const factors = [
                  { key: "income_persistence_pct", label: "Income That Repeats" },
                  { key: "largest_source_pct", label: "Reliance on Top Source", invert: true },
                  { key: "source_diversity_count", label: "Number of Sources" },
                  { key: "forward_secured_pct", label: "Income Locked In Ahead" },
                  { key: "labor_dependence_pct", label: "Income Without You Working", invert: true },
                ];
                return (
                  <div style={{ marginBottom: 20 }}>
                    <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.10em", color: B.navy, marginBottom: 12 }}>WHAT CHANGED IN EACH AREA</div>
                    {factors.map(f => {
                      const fVal = (fNi[f.key] as number) ?? 0;
                      const lVal = (lNi[f.key] as number) ?? 0;
                      const rawDelta = lVal - fVal;
                      const delta = f.invert ? -rawDelta : rawDelta;
                      const direction = delta > 0 ? "improved" : delta < 0 ? "declined" : "unchanged";
                      return (
                        <div key={f.key} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 0", borderBottom: `1px solid ${B.stone}` }}>
                          <span style={{ fontSize: 14, fontWeight: 500, color: B.navy }}>{f.label}</span>
                          <span style={{ fontFamily: mono, fontSize: 14, fontWeight: 600, color: direction === "improved" ? B.teal : direction === "declined" ? B.red : B.taupe }}>
                            {direction === "improved" ? "\u2191" : direction === "declined" ? "\u2193" : "\u2013"} {Math.abs(rawDelta) > 0 ? `${f.invert ? (rawDelta > 0 ? "\u2212" : "+") : (rawDelta > 0 ? "+" : "\u2212")}${Math.abs(Math.round(rawDelta))}` : "No change"}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                );
              })()}

              {/* Benchmark evolution */}
              {(() => {
                const first = assessments[assessments.length - 1];
                const latest = assessments[0];
                const fBm = first._v2?.benchmarks as { peer_percentile?: number } | undefined;
                const lBm = latest._v2?.benchmarks as { peer_percentile?: number } | undefined;
                if (!fBm?.peer_percentile || !lBm?.peer_percentile) return null;
                const pDelta = Math.round(lBm.peer_percentile - fBm.peer_percentile);
                return (
                  <div style={{ padding: "16px 20px", borderRadius: 10, backgroundColor: pDelta > 0 ? `${B.teal}05` : `${B.stone}`, border: `1px solid ${pDelta > 0 ? `${B.teal}15` : B.stone}` }}>
                    <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.10em", color: B.taupe, marginBottom: 8 }}>BASELINE COMPARISON</div>
                    <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                      <span style={{ fontFamily: mono, fontSize: 18, color: B.taupe }}>{Math.round(fBm.peer_percentile)}th</span>
                      <span style={{ color: B.taupe }}>→</span>
                      <span style={{ fontFamily: mono, fontSize: 18, fontWeight: 600, color: B.navy }}>{Math.round(lBm.peer_percentile)}th</span>
                      <span style={{ fontFamily: mono, fontSize: 14, fontWeight: 600, color: pDelta > 0 ? B.teal : pDelta < 0 ? B.red : B.taupe }}>{pDelta > 0 ? "+" : ""}{pDelta} percentile</span>
                    </div>
                    <p style={{ fontSize: 13, color: B.muted, marginTop: 8, marginBottom: 0 }}>
                      {pDelta > 0 ? "Your position relative to the industry baseline has improved." : pDelta < 0 ? "Your position relative to the industry baseline has shifted." : "Your baseline position is stable."}
                    </p>
                  </div>
                );
              })()}
            </section>
          )}

          </PhaseSep>

          {/* ── RECORD CARD ── */}
          {(() => {
            const recordId = (r?.record_id as string) || "";
            const modelVer = (r?.model_version as string) || "RP-2.0";
            const shortId = recordId.length > 8 ? recordId.slice(0, 8) : recordId;
            const copyId = () => { if (recordId) { navigator.clipboard.writeText(recordId); setCopiedRecord(true); setTimeout(() => setCopiedRecord(false), 2000); } };
            if (!recordId || recordId.startsWith("sim-")) return null;
            return (
              <div style={{ marginTop: 32, padding: mobile ? "20px 20px" : "24px 28px", borderRadius: 14, backgroundColor: "rgba(14,26,43,0.015)", border: `1px solid ${B.stone}`, textAlign: "center" }}>
                <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.10em", color: B.taupe, marginBottom: 12 }}>ASSESSMENT RECORD</div>
                <div style={{ display: "flex", justifyContent: "center", gap: mobile ? 16 : 32, flexWrap: "wrap" as const, marginBottom: 14 }}>
                  {[
                    { label: "Score", value: String(dScore), color: bandColor(dScore) },
                    { label: "Band", value: dBand.replace(" Stability", ""), color: bandColor(dScore) },
                    { label: "Model", value: modelVer, color: B.navy },
                    { label: "Record", value: shortId, color: B.purple },
                  ].map((f, i) => (
                    <div key={i}>
                      <div style={{ fontSize: 10, fontWeight: 600, letterSpacing: "0.06em", color: B.taupe, marginBottom: 2 }}>{f.label.toUpperCase()}</div>
                      <div style={{ fontSize: 15, fontWeight: 600, fontFamily: mono, color: f.color }}>{f.value}</div>
                    </div>
                  ))}
                  {assessedDate && (
                    <div>
                      <div style={{ fontSize: 10, fontWeight: 600, letterSpacing: "0.06em", color: B.taupe, marginBottom: 2 }}>ASSESSED</div>
                      <div style={{ fontSize: 14, fontWeight: 500, color: B.navy }}>{assessedDate}</div>
                    </div>
                  )}
                </div>
                <button aria-label="Copy record ID to clipboard" onClick={copyId} style={{ fontSize: 12, fontWeight: 600, color: copiedRecord ? B.teal : B.taupe, background: "none", border: `1px solid ${B.stone}`, borderRadius: 6, padding: "6px 14px", cursor: "pointer", minHeight: 32, transition: "color 150ms" }}>
                  {copiedRecord ? "Record ID copied" : "Copy Record ID"}
                </button>
              </div>
            );
          })()}

          {/* Methodology disclosure */}
          <div style={{ paddingTop: 24, textAlign: "center" }}>
            <p style={{ fontSize: 11, color: `${B.taupe}80`, margin: 0, lineHeight: 1.5 }}>
              Industry baselines are derived from structural income modeling across each sector. Distributions are refined as assessment data accumulates. Model RP-2.0.
            </p>
          </div>

          {/* Minimal footer */}
          <div style={{ paddingTop: 32, textAlign: "center" }}>
            <p style={{ fontSize: 12, color: `${B.taupe}60`, margin: 0 }}>RunPayway™ | PeopleStar Enterprises, INC.</p>
          </div>
        </div>
      </div>
    </>
  );
}

export default function DashboardPage() {
  return <Suspense><DashboardContent /></Suspense>;
}
