"use client";

import { useEffect, useState, useRef, useCallback, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { simulateScore, SIMULATOR_PRESETS, projectTimeline } from "@/lib/engine/v2/simulate";
import type { CanonicalInput } from "@/lib/engine/v2/types";
import type { TimelinePoint } from "@/lib/engine/v2/simulate";
import { getScriptsForSector } from "@/lib/action-scripts";
import SuiteHeader from "@/components/SuiteHeader";
// Sample data removed — empty state teasers replace demo mode
import { C, mono, sans, bandColor } from "@/lib/design-tokens";

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
function fmtIndustry(s: string): string { return s.replace(/_/g, " ").replace(/\b\w/g, c => c.toUpperCase()); }

/* Map raw dropdown values → lookup keys */
const SECTOR_MAP: Record<string, string> = {
  "Real Estate": "real_estate",
  "Finance / Banking": "finance_banking",
  "Insurance": "insurance",
  "Technology": "technology",
  "Healthcare": "healthcare",
  "Legal Services": "legal_services",
  "Consulting / Professional Services": "consulting_professional_services",
  "Sales / Brokerage": "sales_brokerage",
  "Media / Entertainment": "creative_media",
  "Construction / Trades": "construction_trades",
  "Retail / E-Commerce": "retail_ecommerce",
  "Hospitality / Food Service": "hospitality",
  "Transportation / Logistics": "transportation",
  "Manufacturing": "manufacturing",
  "Education": "education_training",
  "Nonprofit / Public Sector": "nonprofit",
  "Agriculture": "agriculture",
  "Energy / Utilities": "energy",
  "Other": "default",
  // Also match already-normalized keys
  "real_estate": "real_estate",
  "finance_banking": "finance_banking",
  "insurance": "insurance",
  "technology": "technology",
  "healthcare": "healthcare",
  "legal_services": "legal_services",
  "consulting_professional_services": "consulting_professional_services",
  "consulting": "consulting",
  "sales_brokerage": "sales_brokerage",
  "creative_media": "creative_media",
  "construction_trades": "construction_trades",
  "education_training": "education_training",
  "fitness_wellness": "fitness_wellness",
};
function normSector(raw: string): string {
  const match = SECTOR_MAP[raw] || SECTOR_MAP[raw.toLowerCase()];
  if (!match && raw && raw !== "default") console.warn(`[RunPayway] Unmapped sector: "${raw}". Add it to SECTOR_MAP.`);
  return match || "default";
}

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
  const color = bandColor(score);
  const bandLabel = score >= 75 ? "High" : score >= 50 ? "Established" : score >= 30 ? "Developing" : "Limited";
  const glowSize = size * 1.5;

  return (
    <div style={{ position: "relative", width: size, height: size, flexShrink: 0 }}>
      {/* Ambient band-color glow */}
      <div style={{
        position: "absolute",
        top: "50%", left: "50%",
        width: glowSize, height: glowSize,
        transform: "translate(-50%, -50%)",
        borderRadius: "50%",
        background: `radial-gradient(circle, ${color}12 0%, ${color}04 40%, transparent 70%)`,
        pointerEvents: "none",
      }} />
      <svg width={size} height={size} style={{ transform: "rotate(-90deg)", position: "relative", zIndex: 1 }}>
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="rgba(14,26,43,0.06)" strokeWidth={stroke} />
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={color} strokeWidth={stroke}
          strokeDasharray={circ} strokeDashoffset={offset} strokeLinecap="round"
          style={{ transition: "stroke-dashoffset 1.2s cubic-bezier(0.22, 1, 0.36, 1), stroke 0.4s", filter: `drop-shadow(0 0 6px ${color}30)` }} />
      </svg>
      <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", zIndex: 2 }}>
        <span style={{ fontSize: size * 0.28, fontWeight: 300, fontFamily: mono, color: B.navy, lineHeight: 1, letterSpacing: "-0.04em" }}>{score}</span>
        <span style={{ fontSize: size * 0.08, fontWeight: 600, color, marginTop: 4, letterSpacing: "0.04em" }}>{bandLabel}</span>
      </div>
    </div>
  );
}

/* ================================================================== */
/*  PHASE SEPARATOR — wrapper with branded edge mark + tinted bg       */
/* ================================================================== */
function PhaseSep({ label, color, tint, children, id, mobile }: { label: string; color: string; tint?: string; children?: React.ReactNode; id?: string; mobile?: boolean }) {
  return (
    <div id={id} className="d-phase" style={{ margin: mobile ? "0 -16px" : "0 -32px", padding: mobile ? "0 16px 32px" : "0 32px 40px", backgroundColor: tint || "transparent", borderRadius: 4, overflow: "hidden" }}>
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
function constraintNarrative(c: string, i: CanonicalInput): string {
  const n: Record<string, string> = {
    high_concentration: `Your largest source represents ${i.largest_source_pct}% of income. If that single relationship changes, ${i.largest_source_pct}% of your revenue disappears in one decision.`,
    weak_forward_visibility: `Only ${i.forward_secured_pct}% of your income is committed forward. You are re-selling your time every month.`,
    high_labor_dependence: `${i.labor_dependence_pct}% of your income requires your active daily work. A 90-day disruption stops ${i.labor_dependence_pct}% of income.`,
    low_persistence: `Only ${i.income_persistence_pct}% of your income repeats automatically. The rest must be re-earned from scratch each month.`,
    low_source_diversity: `You have ${i.source_diversity_count} income source${i.source_diversity_count === 1 ? "" : "s"}. A single client decision has outsized power over your stability.`,
    high_variability: `Your income variability is ${i.income_variability_level}. Month-to-month swings make it harder to plan, save, and invest.`,
    weak_durability: `Your income quality score indicates structural fragility. The contracts and agreements backing your income may not withstand market pressure.`,
    shallow_continuity: `Your income runway is critically short. If active work stops, income drops to near zero within weeks. Building any continuity buffer is the priority.`,
  };
  if (n[c]) return n[c];
  // Anti-fallback: never return generic text. Use the constraint key to generate a meaningful sentence.
  const readable = c.replace(/_/g, " ");
  console.warn(`[RunPayway] Missing constraint narrative for: "${c}". Add it to constraintNarrative().`);
  return `Your primary structural factor — ${readable} — is the biggest lever for improving your score. Addressing this directly will have more impact than any other change.`;
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

  useEffect(() => { const c = () => setMobile(window.innerWidth <= 640); c(); window.addEventListener("resize", c); return () => window.removeEventListener("resize", c); }, []);

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
  useEffect(() => {
    // Check for ?code= in URL (bookmarkable unique link)
    // Check for ?record= in URL (email link — loads from cloud)
    const urlRecord = searchParams.get("record");
    if (urlRecord) {
      (async () => {
        try {
          const res = await fetch("https://runpayway-pressuremap.mcallpl.workers.dev/get-record", {
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
    // Detect paid status
    try {
      const ps = JSON.parse(sessionStorage.getItem("rp_purchase_session") || localStorage.getItem("rp_purchase_session") || "{}");
      if (ps.plan_key && ps.plan_key !== "free") setIsPaid(true);
    } catch { /* */ }
    const hasVisited = localStorage.getItem("rp_cc_visited");
    const hasData = !!stored && stored !== "null";
    if (!hasVisited && hasData) { setShowWelcome(true); }
    localStorage.setItem("rp_cc_visited", "1");
    setDataLoaded(true);
  }, [searchParams]);

  useEffect(() => {
    const t = setTimeout(() => setMinTimeElapsed(true), 1500);
    return () => clearTimeout(t);
  }, []);

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
  const sectorKey = normSector(sector);
  const indData = IND[sectorKey] || IND.default;
  const scripts = sector ? getScriptsForSector(sectorKey) || getScriptsForSector(sector) : [];

  /* ── PressureMap ── */
  const rootCon = con?.root_constraint || "weak_forward_visibility";
  const secCon = con?.secondary_constraint || "";
  const conPreset: Record<string, string> = { high_concentration: "add_client", weak_forward_visibility: "lock_forward", high_labor_dependence: "build_passive", low_persistence: "convert_retainer", low_source_diversity: "add_client", high_variability: "convert_retainer", weak_durability: "convert_retainer", shallow_continuity: "build_passive" };
  const liftOf = (pid: string) => { const p = SIMULATOR_PRESETS.find(x => x.id === pid); if (!p) return { s: dScore, l: 0 }; const res = simulateScore(p.modify(base), qScore); return { s: res.overall_score, l: Math.max(0, res.overall_score - dScore) }; };
  const redP = conPreset[rootCon] || "convert_retainer";
  const redR = liftOf(redP);
  const grnP = rootCon === "high_labor_dependence" ? "lock_forward" : "build_passive";
  const grnR = liftOf(grnP);

  /* ── Stress drops for consequence pairing ── */
  const stLCDrop = dScore - simulateScore(SIMULATOR_PRESETS.find(p => p.id === "lose_top_client")!.modify(base), qScore).overall_score;
  const stNWDrop = dScore - simulateScore(SIMULATOR_PRESETS.find(p => p.id === "cant_work_90_days")!.modify(base), qScore).overall_score;

  const indName = indLabel || "your sector";
  const severity = (pct: number, avg: number): "critical" | "elevated" | "managed" => pct > avg + 10 ? "critical" : pct > avg - 5 ? "elevated" : "managed";
  const redSev = severity(activeInc, indData.redAvg);
  const grnSev = severity(indData.greenAvg, persInc); // inverted: low protected = bad

  const redAction = SIMULATOR_PRESETS.find(p => p.id === redP);
  const grnAction = SIMULATOR_PRESETS.find(p => p.id === grnP);

  const zones = [
    { id: "active", label: "Income That Stops", pct: activeInc, color: B.red, lift: redR.l, sev: redSev,
      txt: activeInc >= 70
        ? `In ${indName.toLowerCase()}, ${activeInc}% active income is critically high. If you cannot work for 90 days, your score drops by ${stNWDrop} points. Most ${indName.toLowerCase()} professionals average ${indData.redAvg}% — you are ${activeInc - indData.redAvg}% above that.`
        : activeInc >= 40
        ? `${activeInc}% of your income requires active daily work. In ${indName.toLowerCase()}, the average is ${indData.redAvg}%. ${activeInc > indData.redAvg ? `You are ${activeInc - indData.redAvg}% more exposed than your peers.` : `You are ${indData.redAvg - activeInc}% below average — better than most.`}`
        : `${activeInc}% active income is well below the ${indName.toLowerCase()} average of ${indData.redAvg}%. Your structure has meaningful protection against work stoppages.`,
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
        ? `Only ${persInc}% would continue if you stopped entirely. The ${indName.toLowerCase()} average is ${indData.greenAvg}%. Building this zone is the single most durable improvement available.`
        : persInc < 25
        ? `${persInc}% protected gives some runway. ${persInc > indData.greenAvg ? `You are ${persInc - indData.greenAvg}% ahead of the ${indName.toLowerCase()} average.` : `Most ${indName.toLowerCase()} professionals average ${indData.greenAvg}% — you are ${indData.greenAvg - persInc}% behind.`}`
        : `${persInc}% protected is a structural advantage in ${indName.toLowerCase()}. This zone keeps generating revenue through disruptions, illness, and market shifts.`,
      peer: `${Math.abs(persInc - indData.greenAvg)}% ${persInc > indData.greenAvg ? "above" : "below"} ${indName.toLowerCase()} avg (${indData.greenAvg}%)`,
      action: grnAction ? `Fix: ${grnAction.label}` : null },
  ];

  /* ── Top moves ── */
  const topMoves = SIMULATOR_PRESETS.filter(p => !["lose_top_client", "cant_work_90_days"].includes(p.id)).map(p => {
    const res = simulateScore(p.modify(base), qScore);
    return { ...p, lift: res.overall_score - dScore, projected: res.overall_score, resBand: res.band, effort: p.id === "lock_forward" || p.id === "convert_retainer" ? "Low" : "High", speed: p.id === "lock_forward" || p.id === "convert_retainer" ? "Fast" : "Gradual" };
  }).filter(p => p.lift > 0).sort((a, b) => b.lift - a.lift);

  const scriptFor = (pid: string) => { if (!scripts.length) return null; if (pid === "convert_retainer") return scripts.find(s => s.id.includes("retainer")) || scripts[0]; if (pid === "add_client") return scripts.find(s => s.id.includes("diversi") || s.id.includes("referral")) || scripts[1]; if (pid === "build_passive") return scripts[2] || scripts[0]; return scripts[0]; };

  /* ── Roadmap — enriched with success criteria, zone connection, effort, cumulative progress ── */
  const phases = [{ weeks: "Week 1–2", effortLabel: "Quick win" }, { weeks: "Week 3–4", effortLabel: "Active effort" }, { weeks: "Week 5–8", effortLabel: "Structural shift" }, { weeks: "Week 9–12", effortLabel: "Compound & maintain" }];

  const zoneForPreset: Record<string, string> = {
    add_client: "Reduces active income exposure (red zone)",
    convert_retainer: "Builds recurring income (amber → green zone)",
    build_passive: "Grows protected income (green zone)",
    lock_forward: "Improves forward visibility",
  };

  const industryAction: Record<string, Record<string, string>> = {
    convert_retainer: { creative_media: "Convert your biggest production client to a monthly content retainer.", consulting_professional_services: "Offer your top client a monthly advisory retainer instead of project-based billing.", real_estate: "Propose a property management retainer to your highest-volume client.", technology: "Convert your largest project client to a monthly support and development retainer.", healthcare: "Transition your most active patient referral source to a membership arrangement.", default: "Convert your biggest client from project-based to a recurring monthly agreement." },
    add_client: { creative_media: "Pitch a second production house or brand for recurring content work.", consulting_professional_services: "Open a conversation with one prospect in an adjacent vertical.", real_estate: "Build a referral relationship with one new mortgage broker or attorney.", technology: "Identify one adjacent SaaS client or agency that could become a steady source.", default: "Add one new client or revenue source that could reach 15%+ of income within 90 days." },
    build_passive: { creative_media: "License existing content, create a template pack, or launch a paid resource library.", consulting_professional_services: "Package your frameworks into a course, book, or licensed methodology.", real_estate: "Create a property investment guide or neighborhood report subscription.", technology: "Build a micro-SaaS tool, plugin, or template marketplace product.", default: "Create one income stream that produces revenue whether you work that day or not." },
    lock_forward: { creative_media: "Get signed commitments for next quarter's production calendar.", consulting_professional_services: "Secure prepaid quarterly retainer commitments from 2+ clients.", real_estate: "Pre-sign listing agreements or management contracts for the next quarter.", technology: "Lock in quarterly support contracts or prepaid development sprints.", default: "Secure next quarter's revenue with signed commitments, prepaid packages, or retainers." },
  };

  const getIndustryAction = (pid: string): string => {
    const actions = industryAction[pid];
    if (!actions) return "";
    return actions[sectorKey] || actions.default || "";
  };

  let cumulativeScore = dScore;
  const roadmap = topMoves.slice(0, 4).map((m, i) => {
    const projected = cumulativeScore + m.lift;
    const step = {
      ...phases[i],
      action: m.label,
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
    const url = await generateScoreImage(dScore, bl, custName, bandColor(dScore));
    setShareUrl(url);
    setTimeout(() => { if (shareRef.current) shareRef.current.click(); setShareUrl(null); }, 150);
  };

  /* ================================================================ */
  /*  RENDER                                                           */
  /* ================================================================ */

  /* Loading state — shows enterprise card while hydrating */
  if (!hydrated) {
    return (
      <>
        <title>Command Center | RunPayway™</title>
        <div style={{ maxWidth: 680, margin: "0 auto", paddingTop: 100, fontFamily: sans }}>
          <div style={{
            backgroundColor: C.white, borderRadius: 16,
            border: `1px solid #E5E7EB`, padding: 64, textAlign: "center",
            boxShadow: "0 2px 8px rgba(14,26,43,0.03)",
          }}>
            <div style={{ fontSize: 11, fontWeight: 500, letterSpacing: "0.12em", textTransform: "uppercase" as const, color: C.light, marginBottom: 32 }}>
              Command Center
            </div>
            <div style={{ display: "flex", justifyContent: "center", marginBottom: 32 }}>
              <div style={{ width: 64, height: 64, borderRadius: "50%", border: `3px solid ${C.softBorder}`, borderTopColor: C.teal, animation: "cc-spin 1s linear infinite" }} />
            </div>
            <div style={{ fontSize: 18, fontWeight: 500, color: C.navy, marginBottom: 8, lineHeight: 1.4 }}>
              Loading Command Center
            </div>
            <div style={{ fontSize: 14, fontWeight: 400, color: C.muted, lineHeight: 1.5 }}>
              Preparing structural analysis &bull; Model RP-2.0
            </div>
            <div style={{ marginTop: 40, display: "flex", flexDirection: "column", gap: 12 }}>
              <div style={{ height: 12, borderRadius: 6, backgroundColor: C.border, width: "100%" }} />
              <div style={{ height: 12, borderRadius: 6, backgroundColor: C.border, width: "85%" }} />
              <div style={{ height: 12, borderRadius: 6, backgroundColor: C.border, width: "70%" }} />
            </div>
          </div>
          <p style={{ fontSize: 13, fontWeight: 400, color: C.light, textAlign: "center", marginTop: 24, lineHeight: 1.5 }}>
            Private by default &bull; No external data access &bull; Version-locked scoring
          </p>
          <style>{`@keyframes cc-spin { to { transform: rotate(360deg); } }`}</style>
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
          title: "Income Stability Score",
          icon: "ring",
          desc: "A single number that captures how structurally sound your income really is.",
          hover: "Most people have never seen their income reduced to one honest number. This score strips away the narratives you tell yourself and shows what would actually survive if something changed. It is the starting point for every decision that follows.",
        },
        {
          title: "PressureMap\u2122",
          icon: "map",
          desc: "See exactly where your income is vulnerable and where it is protected.",
          hover: "Your income has three zones: income that stops if you stop, income that recurs but can be cancelled, and income that continues no matter what. Most people discover that the zone they assumed was safe is actually the most fragile. The PressureMap™ forces you to see the structure you have been avoiding.",
        },
        {
          title: "Root Constraint",
          icon: "target",
          desc: "The single structural weakness that is suppressing your score the most.",
          hover: "Every income structure has a bottleneck \u2014 one factor doing more damage than all the others combined. People spend months optimizing the wrong things. This identifies the exact lever that moves the needle, so you stop wasting effort on changes that feel productive but change nothing.",
        },
      ],
    },
    {
      phase: "Your Plan",
      color: B.navy,
      tint: "rgba(14,26,43,0.015)",
      sections: [
        {
          title: "12-Week Roadmap",
          icon: "path",
          desc: "A sequenced action plan built from your specific constraints, not generic advice.",
          hover: "Generic financial advice tells you to diversify. This roadmap tells you which move to make first, why that sequence matters, and exactly how many points each step is worth. It is reverse-engineered from your score \u2014 the shortest path between where you are and where the math says you could be.",
        },
        {
          title: "Industry Scripts",
          icon: "script",
          desc: "Word-for-word scripts tailored to your sector for each structural move.",
          hover: "Knowing what to do is not the hard part. The hard part is knowing what to say. These scripts give you the exact language to propose a retainer, renegotiate a contract, or pitch a new arrangement \u2014 written for your industry, not a textbook.",
        },
      ],
    },
    {
      phase: "Test Your Options",
      color: B.teal,
      tint: "rgba(31,109,122,0.02)",
      sections: [
        {
          title: "What-If Explorer",
          icon: "sim",
          desc: "Model structural changes before you commit. See the exact score impact.",
          hover: "Every major income decision is a gamble \u2014 until you can simulate it first. Add a client, convert to a retainer, build a passive stream. See exactly how each move changes your score, your band, and your trajectory. You stop guessing and start engineering.",
        },
        {
          title: "Goal Mode",
          icon: "goal",
          desc: "Pick a target band. See the minimum moves required to reach it.",
          hover: "Most people set financial goals without knowing whether the goal is even structurally possible. Goal Mode works backwards from the target \u2014 it finds the fewest structural changes needed to cross the threshold. Sometimes it is one move. Sometimes the math says you need two. Either way, you know before you start.",
        },
        {
          title: "Stress Tests",
          icon: "stress",
          desc: "What happens if your top client leaves? What if you cannot work for 90 days?",
          hover: "You do not discover how fragile your income is when things are going well. You discover it in a crisis. Stress tests simulate the two scenarios that break most independent earners \u2014 so you can see the damage before it happens and decide whether you can live with it.",
        },
      ],
    },
    {
      phase: "Track Progress",
      color: B.taupe,
      tint: "rgba(14,26,43,0.01)",
      sections: [
        {
          title: "Progress Tracking",
          icon: "track",
          desc: "Toggle structural changes you have made. Your projected score updates instantly.",
          hover: "Change is invisible until you measure it. As you implement your roadmap, toggle each change and watch your projected score shift in real time. It turns abstract progress into a number you can feel \u2014 and it tells you exactly when you have done enough to warrant a reassessment.",
        },
      ],
    },
  ];

  if (!hasRecord) {
    return (
      <>
        <title>Command Center | RunPayway™</title>
        <style>{`
          @keyframes fadeSlideIn { from { opacity: 0; transform: translateY(12px); } to { opacity: 1; transform: translateY(0); } }
          .cc-teaser-card { position: relative; }
          .cc-teaser-card .cc-hover-reveal { opacity: 0; max-height: 0; overflow: hidden; transition: opacity 300ms ease, max-height 400ms ease; }
          .cc-teaser-card:hover .cc-hover-reveal, .cc-teaser-card:focus-within .cc-hover-reveal { opacity: 1; max-height: 200px; }
          @media(max-width:640px){
            .cc-teaser-card .cc-hover-reveal { opacity: 1; max-height: 200px; }
          }
        `}</style>
        <div style={{ minHeight: "100vh", backgroundColor: B.bg, fontFamily: sans }}>
          <SuiteHeader current="dashboard" />

          <div style={{ maxWidth: 720, margin: "0 auto", padding: mobile ? "24px 16px 100px" : "48px 36px 96px" }}>

            {/* Hero */}
            <div style={{ textAlign: "center", marginBottom: mobile ? 36 : 48, animation: "fadeSlideIn 600ms ease-out" }}>
              <div style={{ fontSize: 12, fontWeight: 700, letterSpacing: "0.14em", color: B.teal, marginBottom: 16 }}>COMMAND CENTER</div>
              <h1 style={{ fontSize: mobile ? 28 : 36, fontWeight: 300, color: B.navy, margin: "0 0 14px", lineHeight: 1.25, letterSpacing: "-0.02em" }}>
                The control room for your income structure.
              </h1>
              <p style={{ fontSize: 17, color: B.navy, opacity: 0.6, margin: "0 0 32px", lineHeight: 1.65, maxWidth: 520, marginLeft: "auto", marginRight: "auto" }}>
                Your full diagnostic, simulator, roadmap, and progress tracker — all in one place. Complete an assessment to unlock everything below.
              </p>
              <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" as const }}>
                <a href={STRIPE_URL} style={{
                  display: "inline-flex", alignItems: "center", justifyContent: "center",
                  height: 52, padding: "0 36px", borderRadius: 10,
                  background: `linear-gradient(135deg, ${B.navy} 0%, ${B.purple} 100%)`,
                  color: "#FFF", fontSize: 16, fontWeight: 600, textDecoration: "none",
                  boxShadow: "0 4px 16px rgba(14,26,43,0.15)",
                  transition: "transform 150ms, box-shadow 150ms",
                }}>Get Your Assessment</a>
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
                Find out what your income would actually survive.
              </h2>
              <p style={{ fontSize: 16, color: C.sandMuted, margin: "0 0 28px", lineHeight: 1.65, maxWidth: 460, marginLeft: "auto", marginRight: "auto" }}>
                One assessment. Every section above populates with your real data. No samples. No hypotheticals. Just the structural truth.
              </p>
              <a href={STRIPE_URL} style={{
                display: "inline-flex", alignItems: "center", justifyContent: "center",
                height: 52, padding: "0 36px", borderRadius: 8,
                backgroundColor: C.sandBorder, border: `1px solid ${C.sandLight}`,
                color: C.sandText, fontSize: 16, fontWeight: 600, textDecoration: "none",
              }}>Get Your Assessment &rarr;</a>
            </div>

            {/* Footer */}
            <div style={{ paddingTop: 32, textAlign: "center" }}>
              <p style={{ fontSize: 14, color: B.taupe, margin: "0 0 4px" }}>RunPayway&#8482; &middot; Model RP-2.0 &middot; PeopleStar Enterprises</p>
              <p style={{ fontSize: 12, color: `${B.taupe}80`, margin: 0 }}>Deterministic system &middot; Structural output &middot; Version-controlled logic</p>
            </div>
          </div>
        </div>
        {mobile && <PhaseNav activePhase="" mobile={mobile} />}
      </>
    );
  }

  return (
    <>
      <title>Command Center | RunPayway™</title>
      <div style={{ minHeight: "100vh", backgroundColor: B.bg, fontFamily: sans }}>
        <style>{`
          @media(max-width:640px){
            .d-2col{flex-direction:column!important;}
            .d-3col{grid-template-columns:1fr!important;}
            .d-metrics{flex-direction:column!important;}
            .d-compare{flex-direction:column!important;}
            .d-score-hero{flex-direction:column!important;align-items:center!important;text-align:center!important;}
            .d-phase{margin:0 -16px!important;padding:0 16px 24px!important;}
          }
          @keyframes fadeSlideIn { from { opacity: 0; transform: translateY(12px); } to { opacity: 1; transform: translateY(0); } }
          .cc-section { opacity: 0; transform: translateY(16px); transition: opacity 500ms ease, transform 500ms ease; }
          .cc-section.cc-visible { opacity: 1; transform: translateY(0); }
        `}</style>
        <SuiteHeader current="dashboard" />
        {shareUrl && <a ref={shareRef} href={shareUrl} download={`runpayway-score-${dScore}.png`} style={{ display: "none" }}>dl</a>}

        {/* Phase nav */}
        <PhaseNav activePhase={activePhase} mobile={mobile} />

        <div style={{ maxWidth: 960, margin: "0 auto", padding: mobile ? "20px 16px 120px" : "48px 36px 96px", overflow: "hidden" }}>

          {/* ── SCORE HERO — clean white ── */}
          <div style={{ marginBottom: 32, animation: "fadeSlideIn 600ms ease-out" }}>
            <div style={{ padding: mobile ? "28px 20px" : "40px 44px", borderRadius: mobile ? 16 : 20, backgroundColor: B.surface, border: `1px solid ${B.stone}`, boxShadow: "0 1px 4px rgba(14,26,43,0.03)" }}>
              <div style={{ display: "flex", alignItems: "center", gap: mobile ? 16 : 40 }} className="d-score-hero">
                <ScoreRing score={dScore} size={mobile ? 110 : 160} stroke={mobile ? 7 : 8} />
                <div style={{ flex: 1 }}>
                  {custName && <div style={{ fontSize: 14, color: B.muted, marginBottom: 4 }}>{custName}</div>}
                  <div style={{ fontSize: mobile ? 14 : 15, color: B.muted, marginBottom: 12, lineHeight: 1.55 }}>
                    {gap > 0
                      ? <>{dBand}. <span style={{ fontWeight: 600, color: B.navy }}>{gap} points</span> to {nextB}.</>
                      : <>Highest stability band achieved.</>
                    }
                    {bm && <> Top {100 - bm.peer_percentile}% of {bm.cluster_label.toLowerCase()}.</>}
                  </div>
                  <style>{`
                    .metric-tip-wrap { position: relative; }
                    .metric-tip-wrap .metric-tip { opacity: 0; pointer-events: none; transition: opacity 180ms ease; }
                    @media(hover:hover){ .metric-tip-wrap:hover .metric-tip { opacity: 1; pointer-events: auto; } }
                  `}</style>
                  <div style={{ display: "flex", gap: 0, borderRadius: 10, overflow: "hidden", border: `1px solid ${B.stone}` }} className="d-metrics">
                    {[
                      { label: "Runway", value: contMo < 1 ? "< 1 mo" : `${contMo.toFixed(1)} mo`, color: contMo < 3 ? B.red : B.teal, tip: "How long your income would continue if all active work stopped." },
                      { label: "Top Source Risk", value: `\u2212${riskDrop}`, color: riskDrop > 15 ? B.red : B.amber, tip: "Points lost if your largest source disappears." },
                      { label: "Fragility", value: fragLabel, color: fragLabel === "Brittle" || fragLabel === "Fragile" ? B.red : fragLabel === "Resilient" ? B.teal : B.amber, tip: "How well your structure absorbs shocks." },
                    ].map((m, i, arr) => (
                      <div key={m.label} className="metric-tip-wrap"
                        onClick={() => setTooltipOpen(tooltipOpen === m.label ? null : m.label)}
                        style={{ flex: 1, padding: "10px 14px", textAlign: "center" as const, borderRight: i < arr.length - 1 ? `1px solid ${B.stone}` : "none", cursor: "pointer", WebkitTapHighlightColor: "transparent", backgroundColor: "#FAFAFA" }}>
                        <div style={{ fontSize: 10, fontWeight: 600, letterSpacing: "0.08em", color: B.taupe, marginBottom: 3 }}>
                          {m.label.toUpperCase()}
                        </div>
                        <div style={{ fontSize: 16, fontWeight: 600, fontFamily: mono, color: m.color }}>{m.value}</div>
                        <div className="metric-tip" style={{
                          position: "absolute", bottom: "calc(100% + 8px)", left: "50%", transform: "translateX(-50%)",
                          width: mobile ? 200 : 240, padding: "10px 12px", borderRadius: 8,
                          backgroundColor: B.navy, border: "none",
                          fontSize: 12, lineHeight: 1.5, fontWeight: 400, fontFamily: sans, color: "rgba(244,241,234,0.75)",
                          boxShadow: "0 4px 16px rgba(14,26,43,0.25)",
                          zIndex: 50,
                          ...(tooltipOpen === m.label ? { opacity: 1, pointerEvents: "auto" as const } : {}),
                        }}>
                          {m.tip}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              {/* Compact toolbar */}
              <div style={{ display: "flex", gap: 8, marginTop: 20, justifyContent: mobile ? "center" : "flex-start", flexWrap: "wrap" as const }}>
                <Link href="/review" style={{ fontSize: 13, fontWeight: 600, color: B.navy, textDecoration: "none", padding: "8px 16px", borderRadius: 8, border: `1px solid ${B.stone}`, backgroundColor: B.surface, transition: "background 150ms", display: "inline-flex", alignItems: "center", gap: 6, minHeight: 44 }}
                  onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = "#F5F4F1"; }}
                  onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = B.surface; }}>
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
                  View Report
                </Link>
                <button onClick={handleShare} style={{ fontSize: 13, fontWeight: 600, color: B.muted, padding: "8px 16px", borderRadius: 8, border: `1px solid ${B.stone}`, backgroundColor: "transparent", cursor: "pointer", transition: "color 150ms", display: "inline-flex", alignItems: "center", gap: 6, minHeight: 44 }}
                  onMouseEnter={(e) => { e.currentTarget.style.color = B.navy; }}
                  onMouseLeave={(e) => { e.currentTarget.style.color = B.muted; }}>
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"/><polyline points="16 6 12 2 8 6"/><line x1="12" y1="2" x2="12" y2="15"/></svg>
                  Share
                </button>
                <button onClick={() => {
                  const subject = encodeURIComponent("My Income Stability Assessment");
                  const body = encodeURIComponent(`I completed a RunPayway™ Income Stability Score™ assessment and scored ${dScore}/100 (${dBand}).\n\nThe assessment identified my root structural constraint and provided an action plan. I'd like to discuss the findings with you.\n\nYou can view the methodology at: https://peoplestar.com/RunPayway/methodology`);
                  window.location.href = `mailto:?subject=${subject}&body=${body}`;
                }} style={{ fontSize: 13, fontWeight: 600, color: B.muted, padding: "8px 16px", borderRadius: 8, border: `1px solid ${B.stone}`, backgroundColor: "transparent", cursor: "pointer", transition: "color 150ms", display: "inline-flex", alignItems: "center", gap: 6, minHeight: 44 }}
                  onMouseEnter={(e) => { e.currentTarget.style.color = B.navy; }}
                  onMouseLeave={(e) => { e.currentTarget.style.color = B.muted; }}>
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
                  Email Advisor
                </button>
                {indLabel && <span style={{ fontSize: 11, color: B.taupe, alignSelf: "center", marginLeft: 4 }}>{indLabel} &middot; {assessedDate || "Model RP-2.0"}</span>}
              </div>
            </div>
          </div>

          {/* ════════════════════════════════════════════════════════ */}
          {/*  ORIENT — "Where am I?"                                 */}
          {/* ════════════════════════════════════════════════════════ */}
          <PhaseSep label="Your Diagnosis" color={B.purple} tint="rgba(75,63,174,0.02)" id="phase-diagnosis" mobile={mobile}>

          {/* 2. PRESSUREMAP™ */}
          <section className="cc-section" style={{ padding: mobile ? "28px 20px" : "36px 40px", borderRadius: 20, backgroundColor: B.surface, border: `1px solid ${B.stone}`, marginBottom: 20, boxShadow: "0 1px 4px rgba(14,26,43,0.03)" }}>
            <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", marginBottom: 20 }}>
              <div>
                <div style={{ fontSize: 12, fontWeight: 700, letterSpacing: "0.12em", color: B.teal }}>RUNPAYWAY&#8482; PRESSUREMAP&#8482;</div>
                {indLabel && <p style={{ fontSize: 15, color: B.muted, margin: "6px 0 0" }}>Analysis for {indLabel.toLowerCase()} professionals.</p>}
              </div>
              <div style={{ fontSize: 10, color: B.taupe, textAlign: "right" as const, letterSpacing: "0.04em" }}>
                {assessedDate && <div>{assessedDate}</div>}
                <div>Model RP-2.0</div>
              </div>
            </div>

            <div style={{ padding: mobile ? "20px 16px" : "24px 28px", borderLeft: `4px solid ${B.red}`, borderRadius: 12, backgroundColor: "#FAFAFA", marginBottom: 16 }}>
              <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.10em", color: B.red, marginBottom: 12 }}>ROOT CONSTRAINT</div>
              <p style={{ fontSize: 18, fontWeight: 600, color: B.navy, margin: "0 0 12px", lineHeight: 1.4 }}>
                If your top source leaves, your score drops {dScore - stLCDrop < 30 && dScore >= 30 ? "into Limited Stability." : `from ${dScore} to ${dScore - stLCDrop}.`}
              </p>
              <p style={{ fontSize: 15, color: B.muted, margin: "0 0 12px", lineHeight: 1.65 }}>{constraintNarrative(rootCon, base)}</p>
              <p style={{ fontSize: 14, color: B.red, margin: "0 0 4px", fontWeight: 500 }}>
                Projected impact: <span style={{ fontFamily: mono }}>{dScore}</span> &rarr; <span style={{ fontFamily: mono }}>{dScore - stLCDrop}</span>
              </p>
              {secCon && <p style={{ fontSize: 12, color: B.muted, margin: "12px 0 0" }}>Secondary: {secCon.replace(/_/g, " ").replace(/\b\w/g, c => c.toUpperCase())}</p>}
            </div>

            <div style={{ padding: mobile ? "24px 20px" : "28px 32px", borderRadius: 14, backgroundColor: "#FAFAFA", marginBottom: 14 }}>
              {/* Labels above bar */}
              <div style={{ display: "flex", marginBottom: 6 }}>
                {zones.map(z => z.pct > 0 ? <div key={`label-${z.id}`} style={{ width: `${z.pct}%` }}>{z.pct >= 10 && <span style={{ fontSize: 11, fontWeight: 600, color: z.color }}>{z.label} {z.pct}%</span>}</div> : null)}
              </div>
              <div style={{ display: "flex", height: 12, borderRadius: 6, overflow: "hidden", marginBottom: 14 }}>
                {zones.map(z => z.pct > 0 ? <div key={z.id} style={{ width: `${z.pct}%`, backgroundColor: `${z.color}30`, borderRight: z.id !== "persistent" ? `2px solid ${B.white}` : "none" }} /> : null)}
              </div>
              <p style={{ fontSize: 13, color: B.taupe, margin: 0 }}>{indData.general}</p>
            </div>

            {zones.map(z => (
              <div key={z.id} style={{ padding: mobile ? "18px 16px" : "22px 24px", borderLeft: `3px solid ${z.color}`, borderRadius: 10, backgroundColor: "#FAFAFA", marginBottom: 8 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                  <div style={{ display: "flex", alignItems: "baseline", gap: 8 }}>
                    <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.10em", color: z.color }}>{z.label.toUpperCase()}</span>
                    <span style={{ fontSize: 18, fontWeight: 600, fontFamily: mono, color: z.color }}>{z.pct}%</span>
                    <span style={{ fontSize: 10, fontWeight: 600, padding: "2px 8px", borderRadius: 10, backgroundColor: `${z.sev === "critical" ? "#E57373" : z.sev === "elevated" ? B.amber : B.teal}15`, color: z.sev === "critical" ? "#E57373" : z.sev === "elevated" ? B.amber : B.teal }}>
                      {z.sev === "critical" ? "Needs attention" : z.sev === "elevated" ? "Monitor" : "Healthy"}
                    </span>
                  </div>
                  {z.lift > 0 && <span style={{ fontSize: 13, fontWeight: 600, fontFamily: mono, color: B.teal }}>+{z.lift}</span>}
                </div>
                <p style={{ fontSize: 14, color: B.muted, margin: "0 0 4px", lineHeight: 1.6 }}>{z.txt}</p>
                {z.action && <div style={{ fontSize: 14, fontWeight: 600, color: B.teal }}>{z.action}</div>}
              </div>
            ))}
          </section>

          </PhaseSep>

          {/* ════════════════════════════════════════════════════════ */}
          {/*  DECIDE — "What should I do?"                           */}
          {/* ════════════════════════════════════════════════════════ */}
          <PhaseSep label="Your Plan" color={B.navy} tint="rgba(14,26,43,0.015)" id="phase-plan" mobile={mobile}>

          {/* ── NEGOTIATION PLAYBOOK — white, in Your Plan ── */}
          {(() => {
            const constraintLabels: Record<string, string> = {
              high_concentration: "Income Concentration", weak_forward_visibility: "Forward Visibility",
              high_labor_dependence: "Labor Dependence", low_persistence: "Low Persistence",
              low_source_diversity: "Source Diversity", high_variability: "Income Variability",
              weak_durability: "Weak Durability", shallow_continuity: "Shallow Continuity",
            };
            const playbookMoves = topMoves.slice(0, 3).map(move => {
              const sc = scripts.find(s =>
                (move.id === "convert_retainer" && s.id.includes("retainer")) ||
                (move.id === "add_client" && (s.id.includes("diversi") || s.id.includes("referral"))) ||
                (move.id === "build_passive" && s.id.includes("referral")) ||
                (move.id === "lock_forward" && s.id.includes("retainer"))
              ) || scripts[0];
              const personalize = (text: string) => text
                .replace(/\[Client Name\]/g, custName ? "your client" : "[Client Name]")
                .replace(/\[Contact Name\]/g, "[Contact Name]").replace(/\[Partner Name\]/g, "[Partner Name]")
                .replace(/\[Broker Name\]/g, "[Contact Name]")
                .replace(/\[X\]/g, String(Math.max(2, Math.round(base.source_diversity_count))))
                .replace(/\[X hours\]/g, "10 hours").replace(/\[X years\]/g, "5+ years")
                .replace(/\[X properties[^\]]*\]/g, "multiple properties").replace(/\[\$ amount\]/g, "$2,500")
                .replace(/\[project name\]/g, "recent engagement")
                .replace(/\[current industry\]/g, indLabel.toLowerCase() || "your industry")
                .replace(/\[new vertical\]/g, "an adjacent vertical")
                .replace(/\[their (company|service|clients)\]/g, "their organization")
                .replace(/\[your (service|expertise area)\]/g, "your area of focus");
              return {
                id: move.id, lift: move.lift, projected: move.projected, band: move.resBand,
                effort: move.effort, speed: move.speed,
                title: sc?.title || move.label, context: sc?.context || move.description,
                script: sc ? personalize(sc.script) : "",
                dataPoints: [
                  move.id === "convert_retainer" ? `${base.income_persistence_pct}% of your income currently recurs` : null,
                  move.id === "add_client" ? `Your top source carries ${base.largest_source_pct}% of income` : null,
                  move.id === "build_passive" ? `${base.labor_dependence_pct}% depends on your active work` : null,
                  move.id === "lock_forward" ? `Only ${base.forward_secured_pct}% is secured forward` : null,
                  `Current score: ${dScore} (${dBand})`, `Projected: ${move.projected} (+${move.lift})`,
                ].filter(Boolean) as string[],
              };
            });
            if (playbookMoves.length === 0) return null;
            const copyPB = (text: string, id: string) => { navigator.clipboard.writeText(text).then(() => { setCopiedPlaybook(id); setTimeout(() => setCopiedPlaybook(null), 2500); }); };

            return (
              <section className="cc-section" style={{ marginBottom: 24, padding: mobile ? "28px 20px" : "36px 40px", borderRadius: 20, backgroundColor: B.surface, border: `1px solid ${B.stone}`, boxShadow: "0 1px 4px rgba(14,26,43,0.03)" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 8 }}>
                  <div style={{ width: 36, height: 36, borderRadius: 10, backgroundColor: `${B.teal}08`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={B.teal} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M11 5H6a2 2 0 0 0-2 2v11a2 2 0 0 0 2 2h11a2 2 0 0 0 2-2v-5m-1.414-9.414a2 2 0 1 1 2.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                  </div>
                  <div>
                    <div style={{ fontSize: 12, fontWeight: 700, letterSpacing: "0.10em", color: B.teal }}>NEGOTIATION PLAYBOOK</div>
                    <div style={{ fontSize: 14, color: B.muted }}>Scripts built from your structure</div>
                  </div>
                </div>
                <div style={{ fontSize: mobile ? 20 : 24, fontWeight: 600, color: B.navy, lineHeight: 1.25, marginBottom: 8, marginTop: 20 }}>
                  Your constraint is {constraintLabels[rootCon]?.toLowerCase() || rootCon.replace(/_/g, " ")}.
                </div>
                <p style={{ fontSize: 15, color: B.muted, lineHeight: 1.6, margin: "0 0 24px", maxWidth: 560 }}>
                  These are the exact conversations that move your score. Each script is tailored to {indLabel.toLowerCase() || "your industry"} and uses your actual numbers.
                </p>
                <div style={{ display: "flex", flexDirection: "column" as const, gap: 12 }}>
                  {playbookMoves.map((play, i) => {
                    const isExp = expandedPlaybook === play.id;
                    return (
                      <div key={play.id} style={{ borderRadius: 14, backgroundColor: "#FAFAFA", border: `1px solid ${B.stone}`, overflow: "hidden" }}>
                        <button onClick={() => setExpandedPlaybook(isExp ? null : play.id)}
                          style={{ width: "100%", padding: mobile ? "18px 16px" : "20px 24px", display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 12, background: "none", border: "none", cursor: "pointer", textAlign: "left" as const, minHeight: 44 }}>
                          <div style={{ flex: 1 }}>
                            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4, flexWrap: "wrap" as const }}>
                              <div style={{ width: 24, height: 24, borderRadius: 6, backgroundColor: `${B.teal}08`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                                <span style={{ fontSize: 12, fontWeight: 700, color: B.teal }}>{i + 1}</span>
                              </div>
                              <span style={{ fontSize: 16, fontWeight: 600, color: B.navy }}>{play.title}</span>
                            </div>
                            <p style={{ fontSize: 14, color: B.muted, margin: 0, lineHeight: 1.5 }}>{play.context}</p>
                          </div>
                          <div style={{ display: "flex", alignItems: "center", gap: 8, flexShrink: 0, marginTop: 4 }}>
                            <span style={{ fontSize: 16, fontWeight: 600, fontFamily: mono, color: B.teal }}>+{play.lift}</span>
                            <span style={{ fontSize: 14, color: B.taupe, transition: "transform 200ms", transform: isExp ? "rotate(180deg)" : "rotate(0deg)" }}>&#9660;</span>
                          </div>
                        </button>
                        {isExp && (
                          <div style={{ padding: mobile ? "0 16px 20px" : "0 24px 24px" }}>
                            <div style={{ display: "flex", gap: 6, flexWrap: "wrap" as const, marginBottom: 16 }}>
                              {play.dataPoints.map((dp, j) => (
                                <span key={j} style={{ fontSize: 12, color: B.muted, padding: "4px 10px", borderRadius: 6, backgroundColor: B.white, border: `1px solid ${B.stone}` }}>{dp}</span>
                              ))}
                              <span style={{ fontSize: 12, fontWeight: 600, color: B.teal, padding: "4px 10px", borderRadius: 6, backgroundColor: `${B.teal}06` }}>{play.effort} effort &middot; {play.speed}</span>
                            </div>
                            {play.script && (
                              <div style={{ position: "relative" }}>
                                <pre style={{ fontSize: 14, color: B.navy, lineHeight: 1.65, whiteSpace: "pre-wrap" as const, margin: 0, padding: mobile ? "16px 14px" : "20px 24px", backgroundColor: B.white, borderRadius: 10, border: `1px solid ${B.stone}`, fontFamily: sans }}>{play.script}</pre>
                                <button onClick={() => copyPB(play.script, play.id)}
                                  style={{ position: "absolute", top: 10, right: 10, fontSize: 13, fontWeight: 600, color: copiedPlaybook === play.id ? B.teal : B.muted, backgroundColor: copiedPlaybook === play.id ? `${B.teal}08` : "#FAFAFA", border: `1px solid ${B.stone}`, borderRadius: 8, padding: "8px 14px", cursor: "pointer", minHeight: 36, transition: "all 200ms" }}>
                                  {copiedPlaybook === play.id ? "Copied!" : "Copy"}
                                </button>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
                <div style={{ marginTop: 16, paddingTop: 14, borderTop: `1px solid ${B.stone}`, display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap" as const, gap: 8 }}>
                  <span style={{ fontSize: 13, color: B.taupe }}>Scripts are starting points. Adapt tone and details to your voice.</span>
                  <span style={{ fontSize: 12, color: B.taupe, fontFamily: mono }}>Model RP-2.0 &middot; {indLabel}</span>
                </div>
              </section>
            );
          })()}

          {/* 4. 12-WEEK ROADMAP — enriched */}
          {roadmap.length > 1 && (
            <section className="cc-section" style={{ position: "relative" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 8 }}>
                <div style={{ fontSize: 12, fontWeight: 700, letterSpacing: "0.10em", color: B.taupe }}>YOUR 12-WEEK ROADMAP</div>
                {completedSteps.length > 0 && <span style={{ fontSize: 13, fontWeight: 600, color: B.teal }}>{completedSteps.length}/{roadmap.length} completed</span>}
              </div>
              <div style={{ fontSize: 20, fontWeight: 600, color: B.navy, marginBottom: 16 }}>
                The shortest path from {dScore} to {dScore + totalLift}.
              </div>

              {/* Cumulative progress bar */}
              <div style={{ padding: "16px 24px", border: `1px solid ${B.stone}`, borderRadius: 14, backgroundColor: "#FAFAFA", marginBottom: 20 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 8 }}>
                  <span style={{ fontSize: 13, color: B.taupe }}>Full plan impact</span>
                  <span style={{ fontSize: 14, fontWeight: 600, fontFamily: mono, color: B.teal }}>{dScore} → {dScore + totalLift} (+{totalLift})</span>
                </div>
                <div style={{ height: 8, borderRadius: 4, backgroundColor: "rgba(14,26,43,0.04)", overflow: "hidden" }}>
                  <div style={{ height: "100%", borderRadius: 3, background: `linear-gradient(90deg, ${B.purple} 0%, ${B.teal} 100%)`, width: `${Math.min(100, ((dScore + totalLift) / 100) * 100)}%`, transition: "width 400ms ease" }} />
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", marginTop: 4 }}>
                  <span style={{ fontSize: 11, color: B.taupe }}>Current: {dScore}</span>
                  <span style={{ fontSize: 11, color: B.teal }}>Projected: {dScore + totalLift}</span>
                </div>
              </div>

              <div style={{ border: `1px solid ${B.stone}`, borderRadius: 16, backgroundColor: B.surface, overflow: "hidden", boxShadow: "0 1px 4px rgba(14,26,43,0.03)" }}>
                {roadmap.map((step, i) => {
                  const sc = scriptFor(step.pid); const isExp = expandedScript === `rm-${i}`; const done = completedSteps.includes(i);
                  return (
                    <div key={i} style={{ borderBottom: i < roadmap.length - 1 ? `1px solid ${B.stone}` : "none", opacity: done ? 0.5 : 1, transition: "opacity 300ms" }}>
                      <div style={{ padding: mobile ? "20px 16px" : "22px 28px", display: "flex", gap: 16, alignItems: "flex-start" }}>
                        <div style={{ flexShrink: 0, textAlign: "center" as const, minWidth: 48 }}>
                          <button onClick={() => toggleStep(i)} style={{ width: mobile ? 40 : 36, height: mobile ? 40 : 36, borderRadius: "50%", backgroundColor: done ? B.teal : i === 0 ? `${B.purple}12` : `${B.teal}08`, border: `2px solid ${done ? B.teal : i === 0 ? `${B.purple}30` : `${B.teal}20`}`, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", transition: "all 200ms", margin: "0 auto 4px" }}>
                            {done ? <span style={{ color: B.white, fontSize: 14, fontWeight: 700 }}>&#10003;</span> : <span style={{ fontSize: 14, fontWeight: 700, color: i === 0 ? B.purple : B.teal }}>{i + 1}</span>}
                          </button>
                          <div style={{ fontSize: 11, fontWeight: 600, color: B.taupe, lineHeight: 1.2 }}>{step.weeks}</div>
                        </div>
                        <div style={{ flex: 1 }}>
                          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 4 }}>
                            <div style={{ fontSize: 16, fontWeight: 600, color: done ? B.muted : B.navy, textDecoration: done ? "line-through" : "none" }}>{step.action}</div>
                            <span style={{ fontSize: 16, fontWeight: 300, fontFamily: mono, color: B.teal, flexShrink: 0, marginLeft: 12 }}>+{step.lift}</span>
                          </div>
                          <p style={{ fontSize: 14, color: B.muted, margin: "0 0 8px", lineHeight: 1.55 }}>{step.desc}</p>
                          {/* Zone connection + effort */}
                          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" as const, marginBottom: 8 }}>
                            {step.zone && <span style={{ fontSize: 11, fontWeight: 600, padding: "2px 8px", borderRadius: 10, backgroundColor: `${B.purple}08`, color: B.purple }}>{step.zone}</span>}
                            <span style={{ fontSize: 11, fontWeight: 600, padding: "2px 8px", borderRadius: 10, backgroundColor: B.stone, color: B.taupe }}>{step.effortLabel}</span>
                          </div>
                          {/* Success criteria */}
                          <p style={{ fontSize: 13, color: B.teal, margin: "0 0 8px", fontWeight: 500 }}>{step.target}</p>
                          {sc && <button onClick={() => setExpandedScript(isExp ? null : `rm-${i}`)} style={{ fontSize: 14, fontWeight: 600, color: B.purple, background: "none", border: `1px solid ${B.purple}15`, borderRadius: 8, padding: "10px 16px", cursor: "pointer", minHeight: 44 }}>{isExp ? "Hide script ▲" : "Script ▼"}</button>}
                        </div>
                      </div>
                      {isExp && sc && (
                        <div style={{ padding: mobile ? "16px 16px 24px" : "16px 28px 24px", backgroundColor: `${B.purple}02` }}>
                          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
                            <span style={{ fontSize: 14, fontWeight: 600, color: B.navy }}>{sc.title}</span>
                            <button onClick={() => copyScript(sc.script, sc.id)} style={{ fontSize: 14, fontWeight: 600, color: copiedScript === sc.id ? B.teal : B.purple, backgroundColor: copiedScript === sc.id ? `${B.teal}08` : `${B.purple}08`, border: "none", borderRadius: 8, padding: "10px 16px", cursor: "pointer", minHeight: 44 }}>{copiedScript === sc.id ? "Copied!" : "Copy"}</button>
                          </div>
                          <pre style={{ fontSize: 14, color: B.navy, lineHeight: 1.65, whiteSpace: "pre-wrap" as const, margin: 0, padding: "16px 20px", backgroundColor: B.surface, borderRadius: 10, border: `1px solid ${B.stone}`, fontFamily: sans }}>{sc.script}</pre>
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
          <PhaseSep label="Test Your Options" color={B.teal} tint="rgba(31,109,122,0.02)" id="phase-test" mobile={mobile}>

          {/* What-If Explorer — categorized, visual, recommended */}
          <section className="cc-section">
            <button onClick={() => setWhatIfOpen(!whatIfOpen)}
              style={{ width: "100%", display: "flex", justifyContent: "space-between", alignItems: "center", padding: mobile ? "24px 22px" : "28px 32px", border: `1px solid ${B.stone}`, borderRadius: whatIfOpen ? "14px 14px 0 0" : 14, backgroundColor: B.surface, cursor: "pointer", transition: "border-radius 200ms", boxShadow: "0 1px 3px rgba(14,26,43,0.02)" }}>
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
              const growthPresets = SIMULATOR_PRESETS.filter(p => !["lose_top_client", "cant_work_90_days"].includes(p.id));
              const stressPresets = SIMULATOR_PRESETS.filter(p => ["lose_top_client", "cant_work_90_days"].includes(p.id));

              return (
              <div style={{ border: `1px solid ${B.stone}`, borderTop: "none", borderRadius: "0 0 14px 14px", backgroundColor: B.surface, padding: mobile ? "24px 20px" : "28px 32px" }}>

                {/* GROWTH MOVES */}
                <div style={{ fontSize: 12, fontWeight: 700, letterSpacing: "0.08em", color: B.teal, marginBottom: 12 }}>GROWTH MOVES</div>
                <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 24 }}>
                  {growthPresets.map((pr, idx) => {
                    const res = simulateScore(pr.modify(base), qScore); const lift = res.overall_score - dScore;
                    const isA = effectivePreset === pr.id;
                    const isTop = topMoves[0]?.id === pr.id;
                    const why = isTop ? `Recommended \u2014 addresses your root constraint (${rootCon.replace(/_/g, " ")})` : null;
                    return (
                      <button key={pr.id} onClick={() => setActivePreset(isA && activePreset === pr.id ? null : pr.id)}
                        style={{ padding: "18px 22px", textAlign: "left" as const, borderRadius: 14, cursor: "pointer", transition: "all 200ms", border: `1px solid ${isA ? `${B.purple}30` : isTop ? `${B.teal}15` : B.stone}`, backgroundColor: isA ? `${B.purple}04` : isTop ? `${B.teal}02` : "#FAFAFA", minHeight: 48 }}>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 4 }}>
                          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                            <span style={{ fontSize: 14, fontWeight: 600, color: isA ? B.navy : B.muted }}>{pr.label}</span>
                            {isTop && <span style={{ fontSize: 11, fontWeight: 600, padding: "2px 8px", borderRadius: 10, backgroundColor: `${B.teal}10`, color: B.teal }}>#1</span>}
                          </div>
                          <span style={{ fontSize: 14, fontWeight: 600, fontFamily: mono, color: B.teal }}>+{lift}</span>
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
                  {stressPresets.map(pr => {
                    const res = simulateScore(pr.modify(base), qScore); const lift = res.overall_score - dScore;
                    const isA = effectivePreset === pr.id;
                    return (
                      <button key={pr.id} onClick={() => setActivePreset(isA && activePreset === pr.id ? null : pr.id)}
                        style={{ flex: 1, padding: "16px 20px", textAlign: "left" as const, borderRadius: 12, cursor: "pointer", transition: "all 200ms", border: `1px solid ${isA ? `${B.red}40` : B.stone}`, backgroundColor: isA ? `${B.red}04` : "transparent", minHeight: 48 }}>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 4 }}>
                          <span style={{ fontSize: 14, fontWeight: 600, color: isA ? B.navy : B.muted }}>{pr.label}</span>
                          <span style={{ fontSize: 14, fontWeight: 600, fontFamily: mono, color: B.red }}>{lift}</span>
                        </div>
                        <p style={{ fontSize: 14, color: B.taupe, margin: 0, lineHeight: 1.6 }}>{pr.description}</p>
                      </button>
                    );
                  })}
                </div>

                {/* GOAL MODE — reverse simulator */}
                <div style={{ marginBottom: 24 }}>
                  <div style={{ fontSize: 12, fontWeight: 700, letterSpacing: "0.08em", color: B.purple, marginBottom: 12 }}>GOAL MODE</div>
                  <div style={{ fontSize: mobile ? 16 : 18, fontWeight: 600, color: B.navy, marginBottom: 8 }}>See the minimum structural moves required to cross a band.</div>
                  <p style={{ fontSize: 14, color: B.muted, margin: "0 0 14px", lineHeight: 1.6 }}>
                    Not guesses. Score-based path modeling.
                  </p>
                  <div style={{ display: "flex", gap: 8, flexWrap: "wrap" as const, marginBottom: 16 }}>
                    {[
                      { label: "Developing", target: 30, color: B.bandDeveloping },
                      { label: "Established", target: 50, color: B.bandEstablished },
                      { label: "High", target: 75, color: B.bandHigh },
                    ].filter(g => g.target > dScore).map(g => (
                      <button key={g.target} onClick={() => setGoalTarget(goalTarget === g.target ? null : g.target)}
                        style={{
                          padding: "10px 20px", borderRadius: 10, cursor: "pointer",
                          border: `1px solid ${goalTarget === g.target ? g.color + "50" : B.stone}`,
                          backgroundColor: goalTarget === g.target ? g.color + "08" : "transparent",
                          transition: "all 200ms",
                        }}>
                        <span style={{ fontSize: 14, fontWeight: 600, color: goalTarget === g.target ? g.color : B.muted }}>{g.label} ({g.target}+)</span>
                      </button>
                    ))}
                    {dScore >= 75 && (
                      <div style={{ padding: "10px 20px", borderRadius: 10, border: `1px solid ${B.teal}20`, backgroundColor: `${B.teal}05` }}>
                        <span style={{ fontSize: 14, fontWeight: 600, color: B.teal }}>You are already in the highest band.</span>
                      </div>
                    )}
                  </div>
                  {goalTarget && (() => {
                    // Find minimum combination of moves to reach target
                    const gMoves = SIMULATOR_PRESETS.filter(p => !["lose_top_client", "cant_work_90_days"].includes(p.id));
                    const ranked = gMoves.map(p => {
                      const res = simulateScore(p.modify(base), qScore);
                      return { ...p, projected: res.overall_score, lift: res.overall_score - dScore, band: res.band };
                    }).filter(p => p.lift > 0).sort((a, b) => b.lift - a.lift);

                    // Try single moves first
                    const single = ranked.find(m => m.projected >= goalTarget);
                    if (single) {
                      return (
                        <div style={{ padding: mobile ? "20px 16px" : "20px 24px", borderRadius: 12, border: `1px solid ${B.teal}20`, backgroundColor: `${B.teal}04` }}>
                          <div style={{ fontSize: 12, fontWeight: 600, color: B.teal, marginBottom: 8 }}>1 move gets you there</div>
                          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                            <span style={{ fontSize: 14, fontWeight: 600, color: B.navy }}>{single.label}</span>
                            <span style={{ fontSize: 14, fontWeight: 600, fontFamily: mono, color: B.teal }}>{dScore} → {single.projected}</span>
                          </div>
                          <p style={{ fontSize: 14, color: B.muted, margin: 0, lineHeight: 1.6 }}>{single.description}</p>
                        </div>
                      );
                    }

                    // Try two-move combinations
                    let bestCombo: { moves: typeof ranked; projected: number } | null = null;
                    for (let i = 0; i < ranked.length; i++) {
                      for (let j = i + 1; j < ranked.length; j++) {
                        const combined = ranked[j].modify(ranked[i].modify(base));
                        const res = simulateScore(combined, qScore);
                        if (res.overall_score >= goalTarget && (!bestCombo || res.overall_score < bestCombo.projected)) {
                          bestCombo = { moves: [ranked[i], ranked[j]], projected: res.overall_score };
                        }
                      }
                    }

                    if (bestCombo) {
                      return (
                        <div style={{ padding: mobile ? "20px 16px" : "20px 24px", borderRadius: 12, border: `1px solid ${B.teal}20`, backgroundColor: `${B.teal}04` }}>
                          <div style={{ fontSize: 12, fontWeight: 600, color: B.teal, marginBottom: 12 }}>2 moves get you there</div>
                          {bestCombo.moves.map((m, i) => (
                            <div key={m.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 0", borderBottom: i < bestCombo!.moves.length - 1 ? `1px solid ${B.stone}` : "none" }}>
                              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                                <div style={{ width: 22, height: 22, borderRadius: 6, backgroundColor: `${B.teal}12`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 700, color: B.teal, flexShrink: 0 }}>{i + 1}</div>
                                <span style={{ fontSize: 14, fontWeight: 500, color: B.navy }}>{m.label}</span>
                              </div>
                              <span style={{ fontSize: 14, fontWeight: 600, fontFamily: mono, color: B.teal }}>+{m.lift}</span>
                            </div>
                          ))}
                          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 12, paddingTop: 12, borderTop: `1px solid ${B.teal}15` }}>
                            <span style={{ fontSize: 13, color: B.muted }}>Projected score</span>
                            <span style={{ fontSize: 18, fontWeight: 300, fontFamily: mono, color: B.teal }}>{bestCombo.projected}</span>
                          </div>
                        </div>
                      );
                    }

                    // Can't reach target — show closest
                    const bestSingle = ranked[0];
                    if (!bestSingle) return null;
                    // Try all combinations for the best possible
                    let bestPossible = bestSingle.projected;
                    let bestMoveSet = [bestSingle];
                    for (let i = 0; i < ranked.length; i++) {
                      for (let j = i + 1; j < ranked.length; j++) {
                        const combined = ranked[j].modify(ranked[i].modify(base));
                        const res = simulateScore(combined, qScore);
                        if (res.overall_score > bestPossible) {
                          bestPossible = res.overall_score;
                          bestMoveSet = [ranked[i], ranked[j]];
                        }
                      }
                    }
                    return (
                      <div style={{ padding: mobile ? "20px 16px" : "20px 24px", borderRadius: 12, border: `1px solid ${B.amber}20`, backgroundColor: `${B.amber}04` }}>
                        <div style={{ fontSize: 12, fontWeight: 600, color: B.amber, marginBottom: 8 }}>Closest achievable: {bestPossible}/100</div>
                        <p style={{ fontSize: 14, color: B.muted, margin: "0 0 12px", lineHeight: 1.55 }}>
                          The target of {goalTarget} requires more than structural changes alone. Your best path reaches {bestPossible}, which is {goalTarget - bestPossible} points short. A reassessment after implementing changes may close the remaining gap.
                        </p>
                        {bestMoveSet.map((m, i) => (
                          <div key={m.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "8px 0", borderBottom: i < bestMoveSet.length - 1 ? `1px solid ${B.stone}` : "none" }}>
                            <span style={{ fontSize: 14, fontWeight: 500, color: B.navy }}>{m.label}</span>
                            <span style={{ fontSize: 14, fontWeight: 600, fontFamily: mono, color: B.teal }}>+{m.lift}</span>
                          </div>
                        ))}
                      </div>
                    );
                  })()}
                </div>

                {/* SCENARIO RESULT — visual bar + detail */}
                {effectivePreset && aPO && (
                  <div style={{ padding: mobile ? "28px 20px" : "28px 32px", border: `1px solid ${B.stone}`, borderRadius: 14, marginBottom: 16, boxShadow: "0 1px 4px rgba(14,26,43,0.03)" }}>
                    <div style={{ fontSize: 16, fontWeight: 600, color: B.navy, marginBottom: 12 }}>{aPO.label}</div>

                    {/* Visual before/after bar */}
                    <div style={{ marginBottom: 16 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 8 }}>
                        <div style={{ flex: 1, height: 8, borderRadius: 4, backgroundColor: B.stone, position: "relative", overflow: "hidden" }}>
                          <div style={{ position: "absolute", top: 0, left: 0, height: "100%", borderRadius: 4, backgroundColor: bandColor(dScore), width: `${dScore}%`, opacity: 0.3 }} />
                          <div style={{ position: "absolute", top: 0, left: 0, height: "100%", borderRadius: 4, backgroundColor: sDelta >= 0 ? B.teal : B.red, width: `${sResult.overall_score}%`, transition: "width 400ms ease" }} />
                        </div>
                      </div>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", flexWrap: mobile ? "wrap" as const : "nowrap" as const, gap: mobile ? 4 : 0 }}>
                        <span style={{ fontSize: 13, color: B.taupe }}>Current: <span style={{ fontWeight: 600, fontFamily: mono, color: B.navy }}>{dScore}</span></span>
                        <span style={{ fontSize: 20, fontWeight: 300, fontFamily: mono, color: sDelta >= 0 ? B.teal : B.red }}>{sResult.overall_score}</span>
                        <span style={{ fontSize: 14, fontWeight: 600, fontFamily: mono, color: sDelta >= 0 ? B.teal : B.red }}>{sDelta > 0 ? "+" : ""}{sDelta} pts</span>
                      </div>
                      {sResult.band !== dBand && <div style={{ fontSize: 13, fontWeight: 600, color: B.purple, marginTop: 4 }}>Band shift: {dBand} → {sResult.band}</div>}
                    </div>

                    {/* Save path */}
                    {savedScenarios.length < 3 && sDelta !== 0 && (
                      <button onClick={() => setSavedScenarios(prev => [...prev, { name: aPO.label, score: sResult.overall_score, band: sResult.band, lift: sDelta }])}
                        style={{ fontSize: 13, fontWeight: 600, color: B.teal, backgroundColor: `${B.teal}06`, border: `1px solid ${B.teal}18`, borderRadius: 8, padding: "11px 20px", cursor: "pointer", minHeight: 44, marginBottom: 16, width: mobile ? "100%" : "auto" }}>
                        Save Path ({3 - savedScenarios.length} left)
                      </button>
                    )}

                    {/* Timeline — short milestone summaries */}
                    {sTL.length > 0 && (
                      <div>
                        <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.10em", color: B.taupe, marginBottom: 12 }}>PROJECTED TRAJECTORY</div>
                        <div style={{ display: "flex", gap: 8, flexDirection: mobile ? "column" : "row" }}>
                          <div style={{ flex: mobile ? 1 : 0, padding: "12px 16px", border: `1px solid ${B.stone}`, borderRadius: 8, textAlign: "center" as const, minHeight: 48 }}>
                            <div style={{ fontSize: 10, fontWeight: 600, letterSpacing: "0.06em", color: B.taupe }}>NOW</div>
                            <div style={{ fontSize: 20, fontWeight: 300, fontFamily: mono, color: B.navy }}>{dScore}</div>
                          </div>
                          {sTL.map(pt => {
                            const milestone = pt.delta > 0
                              ? pt.month <= 3 ? "Early momentum" : pt.month <= 6 ? "Changes taking hold" : "Fully embedded"
                              : pt.month <= 3 ? "Immediate impact" : pt.month <= 6 ? "Full damage" : "New baseline";
                            return (
                              <div key={pt.month} style={{ flex: 1, padding: "12px 16px", border: `1px solid ${B.stone}`, borderRadius: 8, textAlign: "center" as const, minHeight: 48 }}>
                                <div style={{ fontSize: 10, fontWeight: 600, letterSpacing: "0.06em", color: B.taupe }}>{pt.label.toUpperCase()}</div>
                                <div style={{ fontSize: 20, fontWeight: 300, fontFamily: mono, color: pt.delta >= 0 ? B.teal : B.red }}>{pt.score}</div>
                                <div style={{ fontSize: 12, color: B.muted, marginTop: 4 }}>{milestone}</div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* COMPARE PATHS — with context */}
                {savedScenarios.length > 0 && (
                  <div style={{ padding: mobile ? "24px 16px" : "24px 28px", border: `1px solid ${B.stone}`, borderRadius: 12 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
                      <div style={{ fontSize: 12, fontWeight: 700, letterSpacing: "0.08em", color: B.purple }}>COMPARE PATHS</div>
                      <button onClick={() => setSavedScenarios([])} style={{ fontSize: 14, color: B.muted, background: "none", border: "none", cursor: "pointer", textDecoration: "underline", minHeight: 44 }}>Clear</button>
                    </div>
                    <div style={{ display: "flex", gap: 12 }} className="d-compare">
                      <div style={{ flex: 1, padding: "20px 16px", borderRadius: 12, border: `1px solid ${B.stone}`, textAlign: "center" as const }}>
                        <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.10em", color: B.taupe, marginBottom: 8 }}>CURRENT</div>
                        <div style={{ fontSize: 28, fontWeight: 300, fontFamily: mono, color: B.navy }}>{dScore}</div>
                        <div style={{ fontSize: 13, fontWeight: 600, color: bandColor(dScore), marginTop: 4 }}>{dBand}</div>
                      </div>
                      {savedScenarios.map((s, i) => (
                        <div key={i} style={{ flex: 1, padding: "20px 16px", borderRadius: 12, border: `1px solid ${B.teal}18`, backgroundColor: `${B.teal}03`, textAlign: "center" as const, position: "relative" }}>
                          <button onClick={() => setSavedScenarios(prev => prev.filter((_, j) => j !== i))} style={{ position: "absolute", top: 4, right: 4, fontSize: 16, color: B.taupe, background: "none", border: "none", cursor: "pointer", minHeight: 44, minWidth: 44, display: "flex", alignItems: "center", justifyContent: "center" }}>&times;</button>
                          <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.10em", color: B.teal, marginBottom: 8 }}>PATH {String.fromCharCode(65 + i)}</div>
                          <div style={{ fontSize: 28, fontWeight: 300, fontFamily: mono, color: s.lift >= 0 ? B.teal : B.red }}>{s.score}</div>
                          <div style={{ fontSize: 13, fontWeight: 600, color: bandColor(s.score), marginTop: 4 }}>{s.band}</div>
                          <div style={{ fontSize: 14, fontWeight: 600, fontFamily: mono, color: s.lift >= 0 ? B.teal : B.red, marginTop: 8 }}>{s.lift > 0 ? "+" : ""}{s.lift}</div>
                          <div style={{ fontSize: 13, color: B.navy, marginTop: 4, fontWeight: 500 }}>{s.name}</div>
                        </div>
                      ))}
                    </div>
                    {savedScenarios.length >= 2 && (() => {
                      const best = savedScenarios.reduce((a, b) => a.score > b.score ? a : b);
                      return (
                        <p style={{ fontSize: 13, color: B.teal, fontWeight: 500, marginTop: 12, textAlign: "center" as const }}>
                          Best path: <span style={{ fontWeight: 600 }}>{best.name}</span> — reaches {best.score}/100 ({best.band})
                        </p>
                      );
                    })()}
                  </div>
                )}
              </div>
              );
            })()}
          </section>

          </PhaseSep>

          {/* ════════════════════════════════════════════════════════ */}
          {/*  MONITOR — "Am I progressing?"                          */}
          {/* ════════════════════════════════════════════════════════ */}
          <PhaseSep label="Track Progress" color={B.taupe} tint="rgba(14,26,43,0.01)" id="phase-progress" mobile={mobile}>

          {/* Change 4: Merged TRACK YOUR PROGRESS section */}
          <section className="cc-section" style={{ marginBottom: 20, padding: mobile ? "28px 24px" : "36px 40px", border: `1px solid ${B.stone}`, borderRadius: 16, backgroundColor: B.surface, boxShadow: "0 1px 4px rgba(14,26,43,0.03)" }}>
            <div style={{ fontSize: 12, fontWeight: 700, letterSpacing: "0.10em", color: B.teal, marginBottom: 10 }}>TRACK YOUR PROGRESS</div>
            <div style={{ fontSize: 16, fontWeight: 600, color: B.navy, marginBottom: 8 }}>Has anything changed?</div>
            <p style={{ fontSize: 14, color: B.muted, margin: "0 0 16px" }}>Toggle what you have done. Score updates instantly.</p>

            <div style={{ display: "flex", gap: 24, flexDirection: mobile ? "column" : "row" }} className="d-2col">
              <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 8 }}>
                {qActions.map(a => (
                  <button key={a.id} onClick={() => setQuickToggles(prev => ({ ...prev, [a.id]: !prev[a.id] }))}
                    style={{ display: "flex", alignItems: "center", gap: 12, padding: "14px 16px", borderRadius: 10, cursor: "pointer", border: `1px solid ${quickToggles[a.id] ? `${B.teal}30` : B.stone}`, backgroundColor: quickToggles[a.id] ? `${B.teal}05` : "transparent", transition: "all 200ms", textAlign: "left" as const, minHeight: 48 }}>
                    <div style={{ width: 24, height: 24, borderRadius: 6, border: `2px solid ${quickToggles[a.id] ? B.teal : B.faint}`, backgroundColor: quickToggles[a.id] ? B.teal : "transparent", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                      {quickToggles[a.id] && <span style={{ color: "#FFF", fontSize: 13, fontWeight: 700 }}>&#10003;</span>}
                    </div>
                    <span style={{ fontSize: 14, fontWeight: quickToggles[a.id] ? 600 : 400, color: quickToggles[a.id] ? B.navy : B.muted }}>{a.label}</span>
                  </button>
                ))}
              </div>
              <div style={{ flex: 0, minWidth: mobile ? "auto" : 200, textAlign: "center" as const, padding: "28px 24px", borderRadius: 12, backgroundColor: qCount > 0 ? `${B.teal}05` : `${B.stone}`, border: `1px solid ${qCount > 0 ? `${B.teal}18` : B.stone}`, display: "flex", flexDirection: "column", justifyContent: "center" }}>
                {qCount > 0 ? (
                  <>
                    <div style={{ fontSize: 12, fontWeight: 700, letterSpacing: "0.08em", color: B.teal, marginBottom: 16 }}>ESTIMATED</div>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8, marginBottom: 8 }}>
                      <span style={{ fontSize: 22, fontWeight: 300, fontFamily: mono, color: B.taupe }}>{dScore}</span>
                      <span style={{ fontSize: 16, color: B.taupe }}>→</span>
                      <span style={{ fontSize: 36, fontWeight: 300, fontFamily: mono, color: B.teal }}>{qResult.overall_score}</span>
                    </div>
                    <div style={{ fontSize: 22, fontWeight: 700, fontFamily: mono, color: B.teal }}>+{qLift}</div>
                    {qResult.band !== dBand && <div style={{ fontSize: 13, color: B.purple, fontWeight: 600, marginTop: 8 }}>→ {qResult.band}</div>}
                    <div style={{ fontSize: 13, color: B.taupe, marginTop: 16 }}>Directional estimate</div>
                  </>
                ) : (
                  <><div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.10em", color: B.taupe, marginBottom: 8 }}>CURRENT</div><div style={{ fontSize: 40, fontWeight: 300, fontFamily: mono, color: B.navy, lineHeight: 1 }}>{dScore}</div></>
                )}
              </div>
            </div>

            {/* Readiness indicator + return message */}
            <div style={{ marginTop: 16, padding: "16px 20px", borderRadius: 10, backgroundColor: qCount >= 2 ? `${B.teal}05` : `${B.stone}`, border: `1px solid ${qCount >= 2 ? `${B.teal}12` : B.stone}` }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap" as const, gap: 8 }}>
                <span style={{ fontSize: 14, fontWeight: 600, color: qCount >= 2 ? B.teal : B.muted }}>{qCount}/4 changes made{qCount >= 2 ? " — you may be ready to reassess" : ""}</span>
              </div>
              {qCount < 2 && <p style={{ fontSize: 14, color: B.taupe, margin: "8px 0 0", lineHeight: 1.6, fontStyle: "italic" }}>{returnMsg}</p>}
            </div>
          </section>

          {/* ──── MONITORING FEATURES — Score History + Factor Deltas + Benchmark Evolution ──── */}
          {assessments.length >= 2 && (
            <section className="cc-section" style={{ marginBottom: 20, padding: mobile ? "28px 24px" : "36px 40px", border: `1px solid ${B.stone}`, borderRadius: 16, backgroundColor: B.surface, boxShadow: "0 1px 4px rgba(14,26,43,0.03)" }}>
              <div style={{ fontSize: 12, fontWeight: 700, letterSpacing: "0.10em", color: B.purple, marginBottom: 10 }}>STABILITY MONITORING</div>
              <div style={{ fontSize: 16, fontWeight: 600, color: B.navy, marginBottom: 4 }}>Score History</div>
              <p style={{ fontSize: 14, color: B.muted, margin: "0 0 20px" }}>{assessments.length} assessments tracked. {assessments.length < 3 ? `${3 - assessments.length} remaining on your plan.` : "All assessments completed."}</p>

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
                  { key: "income_persistence_pct", label: "Recurrence" },
                  { key: "largest_source_pct", label: "Concentration", invert: true },
                  { key: "source_diversity_count", label: "Diversification" },
                  { key: "forward_secured_pct", label: "Forward Visibility" },
                  { key: "labor_dependence_pct", label: "Labor Independence", invert: true },
                ];
                return (
                  <div style={{ marginBottom: 20 }}>
                    <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.10em", color: B.navy, marginBottom: 12 }}>FACTOR-LEVEL CHANGES</div>
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
                    <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.10em", color: B.taupe, marginBottom: 8 }}>PEER BENCHMARK EVOLUTION</div>
                    <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                      <span style={{ fontFamily: mono, fontSize: 18, color: B.taupe }}>{Math.round(fBm.peer_percentile)}th</span>
                      <span style={{ color: B.taupe }}>→</span>
                      <span style={{ fontFamily: mono, fontSize: 18, fontWeight: 600, color: B.navy }}>{Math.round(lBm.peer_percentile)}th</span>
                      <span style={{ fontFamily: mono, fontSize: 14, fontWeight: 600, color: pDelta > 0 ? B.teal : pDelta < 0 ? B.red : B.taupe }}>{pDelta > 0 ? "+" : ""}{pDelta} percentile</span>
                    </div>
                    <p style={{ fontSize: 13, color: B.muted, marginTop: 8, marginBottom: 0 }}>
                      {pDelta > 0 ? "You are pulling ahead of your industry peers." : pDelta < 0 ? "Your relative position has declined." : "Your peer position is unchanged."}
                    </p>
                  </div>
                );
              })()}
            </section>
          )}

          {/* Stress tests — prominent */}
          <section style={{ marginBottom: 24 }}>
            <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.10em", color: "#C0392B", marginBottom: 8 }}>STRESS TESTS</div>
            <p style={{ fontSize: 14, color: B.muted, marginBottom: 16 }}>What your current structure can and cannot absorb.</p>
            <div style={{ display: "flex", gap: 16, flexDirection: mobile ? "column" : "row" }} className="d-2col">
              {[
                { label: "Your biggest client stops paying", desc: "Your largest income source disappears \u2014 along with everything tied to it.", val: `\u2212${dScore - stLC.overall_score}`, drop: stLC.overall_score },
                { label: "You cannot work for 90 days", desc: "Illness, injury, or interruption stops active work \u2014 only passive and pre-committed income continues.", val: `\u2212${dScore - stNW.overall_score}`, drop: stNW.overall_score },
              ].map(row => (
                <div key={row.label} style={{ flex: 1, padding: "24px 28px", border: `1px solid ${B.stone}`, borderRadius: 14, backgroundColor: "#FAFAFA", boxShadow: "0 1px 3px rgba(14,26,43,0.02)" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 8 }}>
                    <span style={{ fontSize: 14, fontWeight: 600, color: B.navy }}>{row.label}</span>
                    <span style={{ fontSize: 18, fontWeight: 600, fontFamily: mono, color: "#C0392B" }}>{row.val}</span>
                  </div>
                  <p style={{ fontSize: 14, color: B.muted, margin: "0 0 8px", lineHeight: 1.6 }}>{row.desc}</p>
                  <span style={{ fontSize: 13, fontFamily: mono, color: B.taupe }}>{dScore} &rarr; {row.drop}</span>
                </div>
              ))}
            </div>
          </section>

          {/* Assessment timing */}
          <div style={{ display: "flex", gap: 16, flexDirection: mobile ? "column" : "row" }} className="d-2col">
            <div style={{ flex: 1, padding: mobile ? "20px 16px" : "20px 24px", border: `1px solid ${B.stone}`, borderRadius: 12, backgroundColor: B.surface }}>
              <div style={{ fontSize: 12, fontWeight: 700, letterSpacing: "0.06em", color: daysSince > 60 ? "#C0392B" : B.taupe, marginBottom: 8 }}>{daysSince > 0 ? `${daysSince} DAYS SINCE ASSESSMENT` : "ASSESSED TODAY"}</div>
              <p style={{ fontSize: 14, color: B.muted, margin: 0, lineHeight: 1.6 }}>
                {daysSince === 0 ? "Start with your #1 priority above." : daysSince <= 14 ? "Focus on the first phase of your roadmap." : daysSince <= 45 ? "You should be in Week 3\u20134. Made a structural change?" : daysSince <= 90 ? "If you followed your roadmap, you may be ready to reassess." : "Over 90 days. A reassessment will show how your structure changed."}
              </p>
            </div>
            <button onClick={() => { const s = sessionStorage.getItem("rp_record") || localStorage.getItem("rp_record"); if (!s) return; const b = new Blob([s], { type: "application/json" }); const u = URL.createObjectURL(b); const a = document.createElement("a"); a.href = u; a.download = "runpayway-assessment.json"; a.click(); URL.revokeObjectURL(u); }}
              style={{ fontSize: 14, fontWeight: 500, color: B.taupe, background: "none", border: `1px solid ${B.stone}`, borderRadius: 8, padding: mobile ? "12px 16px" : "12px 20px", cursor: "pointer", textAlign: "center" as const, minHeight: 44 }}>
              Download Assessment Data
            </button>
          </div>

          </PhaseSep>

          {/* FOOTER */}
          <div style={{ paddingTop: 32, textAlign: "center" }}>
            <p style={{ fontSize: 14, color: B.taupe, margin: "0 0 4px" }}>RunPayway&#8482; &middot; Model RP-2.0 &middot; PeopleStar Enterprises</p>
            <p style={{ fontSize: 12, color: `${B.taupe}80`, margin: 0 }}>Deterministic system &middot; Structural output &middot; Version-controlled logic</p>
          </div>
        </div>
      </div>
    </>
  );
}

export default function DashboardPage() {
  return <Suspense><DashboardContent /></Suspense>;
}
