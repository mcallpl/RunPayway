"use client";

import { useEffect, useState, useRef, useCallback, Suspense } from "react";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
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
  { id: "phase-progress", label: "History", color: B.taupe },
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
  const glowSize = size * 1.5;

  return (
    <div role="img" aria-label={`Income Stability Score: ${score} out of 100`} style={{ position: "relative", width: size, height: size, flexShrink: 0 }}>
      <svg width={size} height={size} style={{ transform: "rotate(-90deg)", position: "relative", zIndex: 1 }}>
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="rgba(14,26,43,0.06)" strokeWidth={stroke} />
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={color} strokeWidth={stroke}
          strokeDasharray={circ} strokeDashoffset={offset} strokeLinecap="round"
          style={{ transition: "stroke-dashoffset 1.2s cubic-bezier(0.22, 1, 0.36, 1), stroke 0.4s" }} />
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
    weak_durability: `Your income quality score indicates fragility. The contracts and agreements backing your income may not withstand market pressure.`,
    shallow_continuity: `Your income runway is critically short. If active work stops, income drops to near zero within weeks. Building any continuity buffer is the priority.`,
  };
  if (n[c]) return n[c];
  // Anti-fallback: never return generic text. Use the constraint key to generate a meaningful sentence.
  const readable = c.replace(/_/g, " ");
  console.warn(`[RunPayway] Missing constraint narrative for: "${c}". Add it to constraintNarrative().`);
  return `Your primary area — ${readable} — is the biggest lever for improving your score. Addressing this directly will have more impact than any other change.`;
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
    // Detect paid status — only redirect explicitly free users who have data
    try {
      const ps = JSON.parse(sessionStorage.getItem("rp_purchase_session") || localStorage.getItem("rp_purchase_session") || "{}");
      if (ps.plan_key && ps.plan_key !== "free") {
        setIsPaid(true);
      } else if (ps.plan_key === "free" && stored) {
        // Only redirect if they're free AND have assessment data
        // (if no data, let them see the empty state with CTA to purchase)
        window.location.replace("/free-score");
        return;
      }
    } catch { /* */ }
    const hasVisited = localStorage.getItem("rp_cc_visited");
    const hasData = !!stored && stored !== "null";
    if (!hasVisited && hasData) { setShowWelcome(true); }
    localStorage.setItem("rp_cc_visited", "1");
    setDataLoaded(true);
  }, [searchParams]);

  useEffect(() => {
    const t = setTimeout(() => setMinTimeElapsed(true), 600);
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
        : `${persInc}% protected is a real advantage in ${indName.toLowerCase()}. This zone keeps generating revenue through disruptions, illness, and market shifts.`,
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
  const phases = [{ weeks: "Week 1–2", effortLabel: "Quick win" }, { weeks: "Week 3–4", effortLabel: "Active effort" }, { weeks: "Week 5–8", effortLabel: "Bigger changes" }, { weeks: "Week 9–12", effortLabel: "Compound & maintain" }];

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

  /* Loading state — shows enterprise card while hydrating */
  if (!hydrated) {
    return (
      <>
        <title>Dashboard | RunPayway™</title>
        <div style={{ maxWidth: 680, margin: "0 auto", paddingTop: 100, fontFamily: sans }}>
          <div style={{
            backgroundColor: C.white, borderRadius: 16,
            border: `1px solid #E5E7EB`, padding: 64, textAlign: "center",
            boxShadow: "0 2px 8px rgba(14,26,43,0.03)",
          }}>
            <div style={{ fontSize: 11, fontWeight: 500, letterSpacing: "0.12em", textTransform: "uppercase" as const, color: C.light, marginBottom: 32 }}>
              Dashboard
            </div>
            <div style={{ display: "flex", justifyContent: "center", marginBottom: 32 }}>
              <div style={{ width: 64, height: 64, borderRadius: "50%", border: `3px solid ${C.softBorder}`, borderTopColor: C.teal, animation: "cc-spin 1s linear infinite" }} />
            </div>
            <div style={{ fontSize: 18, fontWeight: 500, color: C.navy, marginBottom: 8, lineHeight: 1.4 }}>
              Loading Dashboard
            </div>
            <div style={{ fontSize: 14, fontWeight: 400, color: C.muted, lineHeight: 1.5 }}>
              Analyzing your income &bull; Model RP-2.0
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
          title: "Income Stability Score\u2122",
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
          title: "What Could Go Wrong",
          icon: "alert",
          desc: "See how your score holds up if your top client leaves or you can't work for 90 days.",
          hover: "Two real scenarios. Two honest numbers. Most people are surprised by how much their score drops under pressure they assumed was unlikely — until it happens.",
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
          hover: "Not generic advice. Each milestone references your actual percentages: 'Reliance on top source drops from 72% to below 57%.' Score checkpoints at every stage. Completion tracking that shows your progress in real time.",
        },
      ],
    },
    {
      phase: "Test Your Options",
      color: B.teal,
      tint: "rgba(31,109,122,0.02)",
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
                Everything about how your income is built — in one place.
              </h1>
              <p style={{ fontSize: 17, color: B.navy, opacity: 0.6, margin: "0 0 32px", lineHeight: 1.65, maxWidth: 520, marginLeft: "auto", marginRight: "auto" }}>
                Your report, simulator, action plan, and progress tracker. Complete an assessment to unlock everything below.
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
                See what your income can actually withstand.
              </h2>
              <p style={{ fontSize: 16, color: C.sandMuted, margin: "0 0 28px", lineHeight: 1.65, maxWidth: 460, marginLeft: "auto", marginRight: "auto" }}>
                One assessment. Every section above populates with your real data. No samples. No hypotheticals. Just the truth about how your income is built.
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
              <p style={{ fontSize: 14, color: B.taupe, margin: "0 0 4px" }}>RunPayway&#8482; &middot; Model RP-2.0 &middot; PeopleStar Enterprises, INC.</p>
              <p style={{ fontSize: 12, color: `${B.taupe}80`, margin: 0 }}>Fixed rules &middot; Same answers, same score &middot; Private by default</p>
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

          {/* ── MERGED: Score + This Week — one unified top section ── */}
          {(() => {
            const nextStep = roadmap.find((_, i) => !completedSteps.includes(i));
            const nextMove = nextStep ? topMoves.find(m => m.id === nextStep.pid) : topMoves[0];
            const nextScript = nextMove ? scripts.find(s =>
              (nextMove.id === "convert_retainer" && s.id.includes("retainer")) ||
              (nextMove.id === "add_client" && (s.id.includes("diversi") || s.id.includes("referral"))) ||
              (nextMove.id === "build_passive" && s.id.includes("referral")) ||
              (nextMove.id === "lock_forward" && s.id.includes("retainer"))
            ) || scripts[0] : null;
            const stepsTotal = roadmap.length;
            const stepsDone = completedSteps.length;

            const copyBriefing = () => {
              const text = `RunPayway™ Weekly Briefing — ${custName || "Assessment"}\n\nScore: ${dScore}/100 (${dBand})\n${gap > 0 ? `${gap} points to ${nextB} Stability` : "Highest band achieved"}\n\nThis week: ${nextMove?.label || "Complete Step 1"}\nProjected impact: +${nextMove?.lift || 0} points → ${nextMove?.projected || dScore}\n\n${stepsDone}/${stepsTotal} steps completed · ${daysSince} days since assessment\n\n— RunPayway™ Dashboard`;
              navigator.clipboard.writeText(text);
            };

            return (
              <div style={{ marginBottom: 36, animation: "fadeSlideIn 600ms ease-out" }}>
                <div style={{ padding: mobile ? "28px 22px" : "40px 44px", borderRadius: mobile ? 16 : 24, backgroundColor: B.surface, border: `1px solid ${B.stone}`, boxShadow: "0 1px 4px rgba(14,26,43,0.03)" }}>

                  {/* Top row: Score ring + context — generous spacing */}
                  <div style={{ display: "flex", alignItems: "center", gap: mobile ? 20 : 40, marginBottom: 28 }} className="d-score-hero">
                    <ScoreRing score={dScore} size={mobile ? 100 : 140} stroke={mobile ? 6 : 7} />
                    <div style={{ flex: 1 }}>
                      <div style={{ marginBottom: 8 }}>
                        {custName && <span style={{ fontSize: 17, fontWeight: 600, color: B.navy }}>{custName}</span>}
                        {custName && indLabel && <span style={{ color: B.taupe }}> · </span>}
                        {indLabel && <span style={{ fontSize: 14, color: B.taupe }}>{indLabel}</span>}
                      </div>
                      <div style={{ fontSize: mobile ? 15 : 17, color: B.muted, lineHeight: 1.55, marginBottom: 6 }}>
                        {gap > 0
                          ? <>{gap} points from <span style={{ fontWeight: 600, color: B.navy }}>{nextB} Stability</span>.</>
                          : <span style={{ fontWeight: 600, color: B.teal }}>Highest band achieved.</span>
                        }
                      </div>
                      {bm && indLabel && (
                        <div style={{ fontSize: 14, color: B.teal, fontWeight: 500 }}>
                          Top {100 - Math.round(bm.peer_percentile)}% of {indLabel.toLowerCase()} professionals
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Metrics — clean, no tooltips cluttering */}
                  <div style={{ display: "flex", gap: 12, marginBottom: 28 }} className="d-metrics">
                    {[
                      { label: "Income Buffer", value: contMo < 1 ? "< 1 mo" : `${contMo.toFixed(1)} mo`, color: contMo < 3 ? B.red : B.teal },
                      { label: "If Top Source Leaves", value: `−${riskDrop} pts`, color: riskDrop > 15 ? B.red : B.amber },
                      { label: "Stability Type", value: fragLabel, color: fragLabel === "Brittle" || fragLabel === "Fragile" ? B.red : fragLabel === "Resilient" || fragLabel === "Supported" ? B.teal : B.amber },
                    ].map((m) => (
                      <div key={m.label} style={{ flex: 1, padding: mobile ? "12px 10px" : "14px 16px", textAlign: "center" as const, borderRadius: 10, backgroundColor: "#FAFAFA" }}>
                        <div style={{ fontSize: 10, fontWeight: 600, letterSpacing: "0.06em", color: B.taupe, marginBottom: 4 }}>{m.label.toUpperCase()}</div>
                        <div style={{ fontSize: 18, fontWeight: 600, fontFamily: mono, color: m.color }}>{m.value}</div>
                      </div>
                    ))}
                  </div>

                  {/* This Week — lead with the sentence, not labels */}
                  {topMoves.length > 0 && (
                    <div style={{ padding: mobile ? "20px 18px" : "24px 28px", borderRadius: 16, backgroundColor: `${B.teal}03`, borderLeft: `3px solid ${B.teal}` }}>
                      {stepsDone >= stepsTotal ? (
                        <>
                          <div style={{ fontSize: mobile ? 17 : 19, fontWeight: 500, color: B.navy, lineHeight: 1.4, marginBottom: 6 }}>
                            You've completed every step. That's real progress.
                          </div>
                          <p style={{ fontSize: 14, color: B.muted, margin: 0, lineHeight: 1.55 }}>
                            Time to reassess and see how your score has changed.
                          </p>
                        </>
                      ) : nextMove ? (
                        <>
                          <div style={{ fontSize: mobile ? 17 : 19, fontWeight: 500, color: B.navy, lineHeight: 1.4, marginBottom: 8 }}>
                            Focus on one thing: <strong>{nextMove.label.toLowerCase()}</strong>.
                          </div>
                          <p style={{ fontSize: 14, color: B.muted, margin: "0 0 12px", lineHeight: 1.55 }}>
                            You don't need to do everything at once. This is the single move that matters most right now.
                          </p>
                          {/* Micro-actions — the 5-minute version */}
                          {(() => {
                            const microSteps: Record<string, string[]> = {
                              convert_retainer: ["Open your contacts and find your top client's name", "Draft a 2-sentence message proposing a monthly arrangement", "Send it today — the script is ready for you below"],
                              add_client: ["Think of one person in your network who could refer work to you", "Write them a short message reconnecting", "Ask for a 15-minute call this week"],
                              build_passive: ["List one thing you've built that others have asked about", "Outline a simple version someone could buy or subscribe to", "Set a deadline to launch it within 30 days"],
                              lock_forward: ["Identify your top 2 clients whose agreements expire soon", "Draft a renewal or extension proposal with clear terms", "Send it before the end of this week"],
                            };
                            const steps = microSteps[nextMove.id];
                            if (!steps) return null;
                            return (
                              <div style={{ marginBottom: 12 }}>
                                <div style={{ fontSize: 12, fontWeight: 600, color: B.teal, marginBottom: 8 }}>YOUR NEXT 3 MOVES</div>
                                {steps.map((s, si) => (
                                  <div key={si} style={{ display: "flex", gap: 10, alignItems: "flex-start", marginBottom: 6 }}>
                                    <span style={{ fontSize: 13, fontFamily: mono, fontWeight: 600, color: B.teal, flexShrink: 0, marginTop: 1 }}>{si + 1}.</span>
                                    <span style={{ fontSize: 14, color: B.navy, lineHeight: 1.5 }}>{s}</span>
                                  </div>
                                ))}
                              </div>
                            );
                          })()}
                          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                            {nextScript && (
                              <button onClick={() => {
                                const el = document.getElementById("phase-plan");
                                if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
                                setTimeout(() => setExpandedPlaybook(nextMove?.id || null), 500);
                              }} style={{ fontSize: 14, fontWeight: 600, color: B.teal, background: "none", border: "none", cursor: "pointer", padding: 0, minHeight: 36 }}>
                                Open the script &rarr;
                              </button>
                            )}
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

                  {/* View Report — single action */}
                  <div style={{ marginTop: 20, textAlign: mobile ? "center" : "right" as const }}>
                    <Link href="/review" style={{ fontSize: 13, fontWeight: 500, color: B.taupe, textDecoration: "none", display: "inline-flex", alignItems: "center", minHeight: 36, transition: "color 150ms" }}
                      onMouseEnter={(e) => { e.currentTarget.style.color = B.navy; }}
                      onMouseLeave={(e) => { e.currentTarget.style.color = B.taupe; }}>
                      View full report &rarr;
                    </Link>
                  </div>
                </div>
              </div>
            );
          })()}

          {/* ════════════════════════════════════════════════════════ */}
          {/*  DIAGNOSE — PressureMap (now after Plan)                  */}
          {/* ════════════════════════════════════════════════════════ */}
          <PhaseSep label="Your Diagnosis" color={B.purple} tint="rgba(75,63,174,0.02)" id="phase-diagnosis" mobile={mobile}>

          {/* 2. PRESSUREMAP™ */}
          <section className="cc-section" style={{ padding: mobile ? "32px 22px" : "44px 48px", borderRadius: 24, backgroundColor: B.surface, border: `1px solid ${B.stone}`, marginBottom: 24, boxShadow: "0 1px 4px rgba(14,26,43,0.03)" }}>

            {/* Header — clean, confident */}
            <div style={{ marginBottom: 28 }}>
              <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.12em", color: B.teal, marginBottom: 10 }}>PRESSUREMAP™{indLabel ? ` — ${indLabel.toUpperCase()}` : ""}</div>
              <p style={{ fontSize: mobile ? 18 : 22, fontWeight: 500, color: B.navy, margin: 0, lineHeight: 1.35 }}>
                {activeInc >= 60
                  ? `${activeInc}% of your income stops the moment you stop. Here's how that breaks down.`
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
                <div key={z.id} style={{ padding: mobile ? "18px 16px" : "22px 28px", borderRadius: 14, backgroundColor: "#FAFAFA", borderLeft: `3px solid ${z.color}` }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 6 }}>
                    <span style={{ fontSize: 15, fontWeight: 600, color: B.navy }}>{z.label} — <span style={{ fontFamily: mono, color: z.color }}>{z.pct}%</span></span>
                    {z.peer && <span style={{ fontSize: 12, color: B.taupe }}>{z.peer}</span>}
                  </div>
                  <p style={{ fontSize: 14, color: B.muted, margin: 0, lineHeight: 1.6 }}>{z.txt}</p>
                </div>
              ))}
            </div>

            {/* Biggest risk — clean, below zones */}
            <div style={{ marginTop: 24, padding: mobile ? "20px 18px" : "24px 28px", borderRadius: 14, backgroundColor: `${B.red}04`, borderLeft: `3px solid ${B.red}` }}>
              <p style={{ fontSize: mobile ? 16 : 18, fontWeight: 500, color: B.navy, margin: "0 0 8px", lineHeight: 1.4 }}>
                If your top source leaves, your score drops {dScore - stLCDrop < 30 && dScore >= 30 ? "into Limited Stability." : `from ${dScore} to ${dScore - stLCDrop}.`}
              </p>
              <p style={{ fontSize: 14, color: B.muted, margin: 0, lineHeight: 1.6 }}>{constraintNarrative(rootCon, base)}</p>
            </div>
          </section>

          {/* Removed: secondary constraint, model stamps — noise that doesn't answer "what does this do for me?" */}

          {/* Stress tests — what could go wrong */}
          <section style={{ marginBottom: 24 }}>
            <div style={{ display: "flex", gap: mobile ? 12 : 16, flexDirection: mobile ? "column" : "row" }} className="d-2col">
              {[
                { label: "Your biggest client stops paying", insight: `Your score drops to ${stLC.overall_score}.${stLC.overall_score < 30 && dScore >= 30 ? " That puts you in Limited Stability." : ""}`, val: `${dScore} → ${stLC.overall_score}` },
                { label: "You can't work for 90 days", insight: `Your score drops to ${stNW.overall_score}.${stNW.overall_score < 30 && dScore >= 30 ? " That puts you in Limited Stability." : ""}`, val: `${dScore} → ${stNW.overall_score}` },
              ].map(row => (
                <div key={row.label} style={{ flex: 1, padding: mobile ? "22px 18px" : "26px 28px", borderRadius: 16, backgroundColor: "#FAFAFA", borderLeft: `3px solid ${B.red}` }}>
                  <p style={{ fontSize: 15, fontWeight: 500, color: B.navy, margin: "0 0 6px", lineHeight: 1.4 }}>{row.label}</p>
                  <p style={{ fontSize: 14, color: B.muted, margin: "0 0 8px", lineHeight: 1.55 }}>{row.insight}</p>
                  <span style={{ fontSize: 13, fontFamily: mono, color: B.red }}>{row.val}</span>
                </div>
              ))}
            </div>
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
              const whoMap: Record<string, string> = {
                convert_retainer: "Your largest or most active client — the one you'd most want on a recurring agreement",
                add_client: "A prospect in an adjacent vertical, or a referral partner who serves your ideal clients",
                build_passive: "Your existing audience or network — people who already trust your expertise",
                lock_forward: "Your top 2-3 current clients — the ones most likely to commit to next quarter",
              };
              const whenMap: Record<string, string> = {
                convert_retainer: "After completing a successful project, or before a contract renewal",
                add_client: "When your pipeline has capacity — don't wait until you need it urgently",
                build_passive: "When you have proven frameworks or content that others would pay for",
                lock_forward: "60-90 days before current commitments expire, or at a quarterly review",
              };
              const objectionMap: Record<string, string> = {
                convert_retainer: "\"We prefer project-based.\" → \"I understand. What if we kept the project scope but added a monthly advisory layer for the strategic questions that come up between projects?\"",
                add_client: "\"We already have someone.\" → \"That makes sense. I'm not looking to replace — I'm exploring whether there's a gap I could fill in [specific area]. Would a quick conversation be worth it?\"",
                build_passive: "\"Why would I pay for something I could figure out myself?\" → \"You absolutely could. This saves you the 40 hours I spent building and testing it. Most people value the shortcut.\"",
                lock_forward: "\"We can't commit that far out.\" → \"I get it. What if we locked in the rate and scope, with a 30-day cancellation clause? You get certainty without the risk.\"",
              };
              const successMap: Record<string, string> = {
                convert_retainer: "They ask about pricing, scope, or \"how would this work?\" — that's interest. Send the proposal within 24 hours.",
                add_client: "They agree to a call or introduction. Any response that isn't \"no\" is forward motion.",
                build_passive: "Someone asks \"where can I buy this?\" or shares it with their network.",
                lock_forward: "They sign a commitment or say \"send me the terms.\" Written > verbal.",
              };
              const briefingMap: Record<string, string> = {
                convert_retainer: `Right now, only ${base.income_persistence_pct}% of your income recurs automatically. The rest must be re-earned every month. Converting your largest client to a retainer would move persistence from ${base.income_persistence_pct}% to ~${Math.min(70, base.income_persistence_pct + 20)}% — and your score from ${dScore} to ${move.projected}.`,
                add_client: `Your top source carries ${base.largest_source_pct}% of your income. If that relationship changes, your score drops from ${dScore} to ${dScore - stLCDrop}. Adding one meaningful source would reduce that exposure and lift your score by ${move.lift} points.`,
                build_passive: `${base.labor_dependence_pct}% of your income requires your active daily work. If you can't work for 90 days, your score drops by ${stNWDrop} points. Building one passive stream creates a floor that protects you.`,
                lock_forward: `Only ${base.forward_secured_pct}% of your income is committed forward. You're re-selling your time every month. Locking in next quarter's revenue would move visibility from ${base.forward_secured_pct}% to ~${Math.min(50, base.forward_secured_pct + 15)}%.`,
              };
              const openingLine = sc ? sc.script.split("\n").find(l => l.trim().length > 20 && !l.includes("[")) || "" : "";

              return {
                id: move.id, lift: move.lift, projected: move.projected, band: move.resBand,
                effort: move.effort, speed: move.speed,
                title: sc?.title || move.label, context: sc?.context || move.description,
                script: sc ? personalize(sc.script) : "",
                briefing: briefingMap[move.id] || "",
                who: whoMap[move.id] || "",
                when: whenMap[move.id] || "",
                opening: openingLine.trim(),
                objection: objectionMap[move.id] || "",
                success: successMap[move.id] || "",
              };
            });
            if (playbookMoves.length === 0) return null;
            const copyPB = (text: string, id: string) => { navigator.clipboard.writeText(text).then(() => { setCopiedPlaybook(id); setTimeout(() => setCopiedPlaybook(null), 2500); }); };

            return (
              <section className="cc-section" style={{ marginBottom: 24, padding: mobile ? "32px 22px" : "44px 48px", borderRadius: 24, backgroundColor: B.surface, border: `1px solid ${B.stone}`, boxShadow: "0 1px 4px rgba(14,26,43,0.03)" }}>
                <div style={{ marginBottom: 28 }}>
                  <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.12em", color: B.teal, marginBottom: 10 }}>NEGOTIATION PLAYBOOK{indLabel ? ` — ${indLabel.toUpperCase()}` : ""}</div>
                  <p style={{ fontSize: mobile ? 18 : 22, fontWeight: 500, color: B.navy, margin: "0 0 10px", lineHeight: 1.35 }}>
                    {playbookMoves.length} conversations that would move your score. Here's exactly what to say.
                  </p>
                  <p style={{ fontSize: 15, color: B.muted, lineHeight: 1.6, margin: 0 }}>
                    Each script uses your actual numbers and is written for {indLabel.toLowerCase() || "your industry"}.
                  </p>
                </div>
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
                            <p style={{ fontSize: 14, color: B.muted, margin: "0 0 6px", lineHeight: 1.5 }}>{play.context}</p>
                            {play.who && !isExp && <p style={{ fontSize: 13, color: B.teal, margin: 0, fontWeight: 500 }}>Talk to: {play.who.length > 80 ? play.who.substring(0, 80) + "..." : play.who}</p>}
                          </div>
                          <div style={{ display: "flex", alignItems: "center", gap: 8, flexShrink: 0, marginTop: 4 }}>
                            <span style={{ fontSize: 16, fontWeight: 600, fontFamily: mono, color: B.teal }}>+{play.lift}</span>
                            <span style={{ fontSize: 14, color: B.taupe, transition: "transform 200ms", transform: isExp ? "rotate(180deg)" : "rotate(0deg)" }}>&#9660;</span>
                          </div>
                        </button>
                        {isExp && (
                          <div style={{ padding: mobile ? "0 16px 20px" : "0 24px 24px" }}>
                            {/* Why this matters for YOU */}
                            {play.briefing && (
                              <div style={{ padding: "14px 16px", borderRadius: 10, borderLeft: `3px solid ${B.teal}`, backgroundColor: `${B.teal}04`, marginBottom: 16 }}>
                                <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.06em", color: B.teal, marginBottom: 4 }}>WHY THIS MATTERS FOR YOU</div>
                                <p style={{ fontSize: 14, color: B.navy, margin: 0, lineHeight: 1.55 }}>{play.briefing}</p>
                              </div>
                            )}

                            {/* Who / When / Effort */}
                            <div style={{ display: "grid", gridTemplateColumns: mobile ? "1fr" : "1fr 1fr", gap: 10, marginBottom: 16 }}>
                              {play.who && (
                                <div style={{ padding: "10px 14px", borderRadius: 8, backgroundColor: B.white, border: `1px solid ${B.stone}` }}>
                                  <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.06em", color: B.purple, marginBottom: 3 }}>WHO TO TALK TO</div>
                                  <div style={{ fontSize: 13, color: B.navy, lineHeight: 1.45 }}>{play.who}</div>
                                </div>
                              )}
                              {play.when && (
                                <div style={{ padding: "10px 14px", borderRadius: 8, backgroundColor: B.white, border: `1px solid ${B.stone}` }}>
                                  <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.06em", color: B.purple, marginBottom: 3 }}>WHEN TO USE</div>
                                  <div style={{ fontSize: 13, color: B.navy, lineHeight: 1.45 }}>{play.when}</div>
                                </div>
                              )}
                            </div>

                            {/* The script */}
                            {play.script && (
                              <div style={{ position: "relative", marginBottom: 16 }}>
                                <pre style={{ fontSize: 14, color: B.navy, lineHeight: 1.65, whiteSpace: "pre-wrap" as const, margin: 0, padding: mobile ? "16px 14px" : "20px 24px", backgroundColor: B.white, borderRadius: 10, border: `1px solid ${B.stone}`, fontFamily: sans }}>{play.script}</pre>
                                <button aria-label="Copy playbook script to clipboard" onClick={() => copyPB(play.script, play.id)}
                                  style={{ position: "absolute", top: 10, right: 10, fontSize: 13, fontWeight: 600, color: copiedPlaybook === play.id ? B.teal : B.muted, backgroundColor: copiedPlaybook === play.id ? `${B.teal}08` : "#FAFAFA", border: `1px solid ${B.stone}`, borderRadius: 8, padding: "8px 14px", cursor: "pointer", minHeight: 36, transition: "all 200ms" }}>
                                  {copiedPlaybook === play.id ? "Copied!" : "Copy"}
                                </button>
                              </div>
                            )}

                            {/* Objection handler + Success signal */}
                            <div style={{ display: "grid", gridTemplateColumns: mobile ? "1fr" : "1fr 1fr", gap: 10 }}>
                              {play.objection && (
                                <div style={{ padding: "10px 14px", borderRadius: 8, backgroundColor: B.white, border: `1px solid ${B.stone}` }}>
                                  <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.06em", color: B.red, marginBottom: 3 }}>IF THEY PUSH BACK</div>
                                  <div style={{ fontSize: 13, color: B.navy, lineHeight: 1.5 }}>{play.objection}</div>
                                </div>
                              )}
                              {play.success && (
                                <div style={{ padding: "10px 14px", borderRadius: 8, backgroundColor: B.white, border: `1px solid ${B.stone}` }}>
                                  <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.06em", color: B.teal, marginBottom: 3 }}>SUCCESS SIGNAL</div>
                                  <div style={{ fontSize: 13, color: B.navy, lineHeight: 1.5 }}>{play.success}</div>
                                </div>
                              )}
                            </div>
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

          {/* 4. 12-WEEK ROADMAP — timeline with dynamic milestones */}
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
                          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                            <span style={{ fontSize: 15, fontWeight: 500, color: B.teal, textDecoration: "line-through", opacity: 0.7 }}>{step.action}</span>
                            <span style={{ fontSize: 12, fontFamily: mono, color: B.teal }}>+{step.lift} pts</span>
                          </div>
                        </div>
                      ) : isFirst ? (
                        /* Active step — fully expanded */
                        <div style={{ padding: mobile ? "20px 18px" : "24px 28px", borderRadius: 16, backgroundColor: `${B.purple}03`, border: `1px solid ${B.purple}15` }}>
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
                        </div>
                      ) : (
                        /* Future step — collapsed, just the title */
                        <div style={{ padding: "14px 20px", borderRadius: 12, backgroundColor: "#FAFAFA", border: `1px solid ${B.stone}`, opacity: 0.6 }}>
                          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                            <span style={{ fontSize: 15, fontWeight: 500, color: B.navy }}>{step.action}</span>
                            <span style={{ fontSize: 12, color: B.taupe }}>{step.weeks}</span>
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

                {/* Removed: Goal Mode, Save Paths, Compare Paths, Timeline projections
                   — didn't answer "what is this going to do for me?" */}

                {/* SCENARIO RESULT — clean, answers "what would this do for me?" */}
                {effectivePreset && aPO && (
                  <div style={{ padding: mobile ? "22px 20px" : "24px 28px", borderRadius: 16, backgroundColor: "#FAFAFA", borderLeft: `3px solid ${sDelta >= 0 ? B.teal : B.red}` }}>
                    <p style={{ fontSize: 16, fontWeight: 500, color: B.navy, margin: "0 0 8px", lineHeight: 1.4 }}>
                      {sDelta > 0
                        ? `If you ${aPO.label.toLowerCase()}, your score goes from ${dScore} to ${sResult.overall_score}.`
                        : sDelta < 0
                        ? `If ${aPO.label.toLowerCase().replace("lose ", "you lose ").replace("can't", "you can't")}, your score drops from ${dScore} to ${sResult.overall_score}.`
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
          {/*  MONITOR — Score history (multi-assessment only)          */}
          {/* ════════════════════════════════════════════════════════ */}
          <PhaseSep label="History" color={B.taupe} tint="rgba(14,26,43,0.01)" id="phase-progress" mobile={mobile}>

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

          {/* ── YOUR INCOME WHEN YOU WERE ASSESSED ── */}
          <section className="cc-section" style={{ marginTop: 24, padding: mobile ? "28px 20px" : "36px 40px", borderRadius: 20, backgroundColor: B.surface, border: `1px solid ${B.stone}`, boxShadow: "0 1px 4px rgba(14,26,43,0.03)" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 20 }}>
              <div style={{ width: 32, height: 32, borderRadius: 8, backgroundColor: `${B.purple}08`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={B.purple} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 8v4l3 3m6-3a9 9 0 1 1-18 0 9 9 0 0 1 18 0z" /></svg>
              </div>
              <div>
                <div style={{ fontSize: 12, fontWeight: 700, letterSpacing: "0.08em", color: B.purple }}>YOUR INCOME WHEN YOU WERE ASSESSED</div>
                {assessedDate && <div style={{ fontSize: 13, color: B.taupe }}>{assessedDate}</div>}
              </div>
            </div>
            <p style={{ fontSize: 14, color: B.muted, margin: "0 0 20px", lineHeight: 1.5 }}>Tap any area below to see what may have changed since your assessment.</p>

            <div style={{ display: "flex", flexDirection: "column" as const, gap: 0 }}>
              {(() => {
                const ind = indLabel.toLowerCase() || "your industry";
                const pct = base.income_persistence_pct;
                const conc = base.largest_source_pct;
                const srcs = base.source_diversity_count;
                const fwd = base.forward_secured_pct;
                const varLvl = base.income_variability_level;
                const labr = base.labor_dependence_pct;

                const tipsByIndustry: Record<string, Record<string, string>> = {
                  default: {
                    recurrence: `You reported ${pct}% recurring. If you have signed even one new retainer, subscription, or recurring agreement since then, this number has moved. ${pct < 30 ? "At your level, a single recurring contract could shift this 10+ points." : "Even a modest increase compounds over time."}`,
                    concentration: `Your top source was carrying ${conc}% of your income. ${conc > 60 ? "That is dangerously high — if you have added any new source above 10%, your concentration has improved." : "If your largest client has grown or shrunk since then, this has shifted."}`,
                    diversification: `You had ${srcs} income source${srcs === 1 ? "" : "s"}. Count them now. ${srcs <= 2 ? "Adding even one meaningful source would change your diversification score significantly." : "If any source has gone away or a new one has emerged, this dimension has moved."}`,
                    forward: `Only ${fwd}% of your income was secured forward. ${fwd < 20 ? "That means you were re-earning almost everything month to month. Any new signed commitment changes this." : "If you have locked in any new contracts or extended existing ones, your visibility has improved."}`,
                    variability: `Your variability was ${varLvl}. ${varLvl === "high" || varLvl === "very_high" ? "If your month-to-month income has become more consistent — through retainers, contracts, or diversification — this has changed." : "If your income has become more or less predictable since then, this dimension has shifted."}`,
                    labor: `${labr}% of your income required your active daily work. ${labr > 70 ? "That is high. If you have created any revenue that continues without your involvement — even a small stream — this number has dropped." : "If you have automated, delegated, or built passive income since then, this has improved."}`,
                  },
                  consulting_professional_services: {
                    recurrence: `At ${pct}%, ${pct < 40 ? "most of your consulting income resets every month. If you have converted even one project client to a monthly retainer since then, this has changed." : "you have some recurring base. If you have added or lost a retainer, this number has moved."}`,
                    concentration: `Your top client carried ${conc}% of your billings. ${conc > 50 ? "In consulting, that means one client decision could cut your income in half. Have you landed any new engagements that reduce that dependency?" : "Has your client mix shifted? A new engagement or a completed project changes this."}`,
                    diversification: `You had ${srcs} consulting client${srcs === 1 ? "" : "s"} contributing meaningfully. ${srcs <= 2 ? "Opening a conversation with one prospect in a new vertical would change this. Have you done that?" : "Has any client relationship ended or a new one begun?"}`,
                    forward: `Only ${fwd}% was committed forward. ${fwd < 25 ? "In consulting, that means you were selling your time month to month. Have you secured any prepaid retainers or signed SOWs for next quarter?" : "Have your forward commitments changed? In consulting, visibility resets every 90 days."}`,
                    variability: `Your billing variability was ${varLvl}. ${varLvl === "high" || varLvl === "very_high" ? "Converting to retainers is the fastest fix in consulting. Have you done that?" : "Has your monthly billing pattern become more or less consistent since your assessment?"}`,
                    labor: `${labr}% of your income required your active delivery. ${labr > 70 ? "That is typical in consulting — but it means you cannot step away. Have you packaged any methodology into a course, template, or licensed framework?" : "Has your delivery model changed? Delegating work or licensing IP reduces this."}`,
                  },
                  real_estate: {
                    recurrence: `At ${pct}% recurring, ${pct < 30 ? "almost all your real estate income resets between transactions. A single property management retainer at $2-3K/month would move this meaningfully." : "you have some recurring base. Has any management contract or advisory retainer started or ended since then?"}`,
                    concentration: `${conc}% from your top source. ${conc > 60 ? "In real estate, that could be one buyer relationship or one development project. If that deal closed or a new listing relationship opened, this has shifted." : "Has your mix of residential, commercial, or referral income changed?"}`,
                    diversification: `${srcs} source${srcs === 1 ? "" : "s"}. ${srcs <= 2 ? "Have you opened a referral relationship with a mortgage broker, attorney, or builder? That is a new source." : "Has any referral partnership or income channel started or ended?"}`,
                    forward: `${fwd}% secured forward. ${fwd < 20 ? "Your pipeline was almost entirely speculative. Have you pre-signed any listing agreements or locked in any management contracts for next quarter?" : "How does your current pipeline of signed listings and contracts compare?"}`,
                    variability: `Variability was ${varLvl}. ${varLvl === "high" || varLvl === "very_high" ? "Real estate income is inherently lumpy between closings. Have you added any monthly management fees or advisory retainers to smooth the gaps?" : "Has your closing cadence become more or less regular since your assessment?"}`,
                    labor: `${labr}% required your personal involvement. ${labr > 70 ? "Every showing, negotiation, and closing depended on you. Have you hired a showing assistant, built a referral fee structure, or started any investment income?" : "Has your delegation or passive income changed?"}`,
                  },
                  technology: {
                    recurrence: `${pct}% recurring. ${pct < 40 ? "If your income is primarily salary + variable, the variable portion is what resets. Have you added any SaaS revenue, support contracts, or recurring consulting alongside your role?" : "Has your comp structure shifted? A new equity vesting schedule or contract renewal changes this."}`,
                    concentration: `${conc}% from one source. ${conc > 70 ? "In tech, that usually means one employer. If you are still at the same company with the same comp structure, this has not changed. A side project, freelance client, or advisory role would move it." : "Has your employment changed, or have you added any independent income?"}`,
                    diversification: `${srcs} source${srcs === 1 ? "" : "s"}. ${srcs === 1 ? "You are entirely dependent on one paycheck. Have you started any freelance work, launched a side product, or taken an advisory role? Even one additional source changes this." : "Has any income source started or ended?"}`,
                    forward: `${fwd}% locked forward. ${fwd < 30 ? "If you are on at-will employment, your forward visibility is technically zero. A multi-year contract, retention bonus, or prepaid consulting agreement would change this." : "Has your contract term or guaranteed period changed?"}`,
                    variability: `Variability was ${varLvl}. In tech, this is driven by bonus timing, equity vesting, and project-based compensation. ${varLvl === "moderate" || varLvl === "high" ? "Has your variable comp become more or less predictable?" : "Has your compensation structure shifted since your assessment?"}`,
                    labor: `${labr}% required your active work. ${labr > 80 ? "Your entire income depends on you showing up. Have you built any tools, open-source contributions with sponsorship, courses, or IP that earns while you sleep?" : "Has your passive or semi-passive income changed?"}`,
                  },
                  sales_brokerage: {
                    recurrence: `${pct}% recurring. ${pct < 25 ? "Almost everything you earn resets at the start of each quarter. Have you moved any accounts to managed services, retainers, or recurring billing since your assessment?" : "Has your mix of recurring vs. transactional revenue shifted?"}`,
                    concentration: `${conc}% from your top account. ${conc > 50 ? "One account decision could cut your earnings in half. Have you closed any new accounts at 10%+ of revenue?" : "Has your account distribution changed?"}`,
                    diversification: `${srcs} revenue source${srcs === 1 ? "" : "s"}. ${srcs <= 3 ? "Have you opened any new territories, product lines, or cross-sell relationships? In sales, diversification is about pipeline breadth." : "Has any territory or product line been added or removed?"}`,
                    forward: `${fwd}% committed forward. ${fwd < 20 ? "Your pipeline was mostly in negotiation, not closed. How many deals have you signed since then? Signed > verbal." : "Has your signed-deal backlog grown or shrunk?"}`,
                    variability: `Variability was ${varLvl}. ${varLvl === "high" || varLvl === "very_high" ? "Commission-heavy comp is inherently volatile. Have you negotiated a higher base, or built enough recurring accounts to smooth the cycles?" : "Has your quarterly performance become more or less consistent?"}`,
                    labor: `${labr}% from active selling. ${labr > 75 ? "If you stop selling, income stops. Have you built any trailing commissions, renewal residuals, or managed account fees that pay without new deals?" : "Has your residual income stream changed?"}`,
                  },
                  finance_banking: {
                    recurrence: `${pct}% recurring. ${pct > 50 ? "Your salary provides a decent floor. Has your base-to-bonus ratio changed, or have you added any recurring advisory fees?" : "The variable component — bonus, production credits — is what resets. Has your compensation structure been adjusted?"}`,
                    concentration: `${conc}% from one source. ${conc > 80 ? "That is almost certainly one employer. In finance, the only way to reduce this is a side practice, advisory role, or investment income. Have you added anything?" : "Has your income become more or less dependent on your primary institution?"}`,
                    diversification: `${srcs} source${srcs === 1 ? "" : "s"}. ${srcs === 1 ? "Your entire financial career flows through one institution. An advisory board seat, consulting engagement, or investment income would create a second source." : "Has your mix of income streams changed?"}`,
                    forward: `${fwd}% secured forward. In finance, this is usually your contract term. ${fwd < 30 ? "If you are on annual review cycles, your visibility resets every 12 months. Has your contract or guaranteed period changed?" : "Has your employment agreement been renewed or extended?"}`,
                    variability: `Variability was ${varLvl}. ${varLvl === "high" ? "Your bonus or production credit swings are significant. Has the market environment, your desk performance, or your comp plan changed?" : "Has your variable compensation become more or less predictable?"}`,
                    labor: `${labr}% required your active presence. ${labr > 70 ? "If you stepped away for 90 days, what would continue? Have you built any fee-based advisory book, investment income, or royalty streams?" : "Has your passive income changed?"}`,
                  },
                  insurance: {
                    recurrence: `${pct}% recurring. ${pct > 40 ? "Your renewal book is your structural advantage. Has your retention rate changed? Even a 5% shift in retention significantly moves this number." : "Your book is heavily dependent on new production. Have renewals increased, or have you acquired any existing book of business?"}`,
                    concentration: `${conc}% from your top source. ${conc > 50 ? "One large commercial policy or one key personal lines relationship could be carrying this. Has that account renewed, grown, or left?" : "Has your policy distribution shifted?"}`,
                    diversification: `${srcs} source${srcs === 1 ? "" : "s"}. Have you added any new lines of coverage — commercial, group benefits, or specialty? ${srcs <= 2 ? "In insurance, adding one new line can create an entirely independent revenue stream." : "Has any line of business grown or been discontinued?"}`,
                    forward: `${fwd}% secured. ${fwd < 30 ? "Your forward visibility depends on renewal probability. How many policies are up in the next 90 days with high retention likelihood?" : "Has your renewal pipeline changed?"}`,
                    variability: `Variability was ${varLvl}. ${varLvl === "high" || varLvl === "very_high" ? "New business production swings are masking your renewal base. Has your new-to-renewal ratio shifted?" : "Has your monthly income become more or less consistent?"}`,
                    labor: `${labr}% from active work. ${labr > 60 ? "Your book generates renewals, but you are still personally servicing and producing. Have you hired a service team or built any passive income from trailing commissions?" : "Has your servicing model changed?"}`,
                  },
                  legal_services: {
                    recurrence: `${pct}% recurring. ${pct < 30 ? "Almost all your income is matter-based — it ends when the matter ends. Have you signed any retainer agreements or ongoing advisory arrangements?" : "Has any retainer started or concluded since your assessment?"}`,
                    concentration: `Your top source was ${conc}% of billings. ${conc > 50 ? "That means your top 1-2 matters are carrying the practice. Have any of those matters concluded, or have you opened significant new engagements?" : "Has your matter distribution changed?"}`,
                    diversification: `${srcs} source${srcs === 1 ? "" : "s"}. ${srcs <= 3 ? "In legal, adding a referral relationship with an accountant, financial advisor, or complementary firm creates a new pipeline." : "Has your client referral network expanded or contracted?"}`,
                    forward: `${fwd}% committed. ${fwd < 20 ? "You were essentially billing on current matters with no forward pipeline locked. Have you signed any retainers or pre-committed engagements for next quarter?" : "Has your committed engagement calendar changed?"}`,
                    variability: `Variability was ${varLvl}. ${varLvl === "high" ? "Matter-based billing is inherently uneven. Have you added any flat-fee arrangements or retainers that create monthly consistency?" : "Has your utilization pattern changed?"}`,
                    labor: `${labr}% from your personal billable hours. ${labr > 80 ? "If you cannot bill, you do not earn. Have you created any of-counsel arrangements, legal templates for licensing, or training content?" : "Has your revenue model shifted away from personal hours?"}`,
                  },
                  healthcare: {
                    recurrence: `${pct}% recurring. ${pct > 60 ? "Your salary provides stability. Has your contract been renewed or modified? Any shift from employed to independent or vice versa changes this." : "Has your employment arrangement changed? Locum vs. employed vs. private practice creates very different recurrence profiles."}`,
                    concentration: `${conc}% from one source. ${conc > 80 ? "Almost certainly one health system or employer. The only structural change is adding a second income source — telemedicine, consulting, expert witness work, or a side practice." : "Has your income source mix changed?"}`,
                    diversification: `${srcs} source${srcs === 1 ? "" : "s"}. ${srcs === 1 ? "Your entire income flows through one institution. Have you started any telemedicine work, consulting, teaching, speaking, or advisory board positions?" : "Has any secondary income source started or ended?"}`,
                    forward: `${fwd}% secured. ${fwd < 30 ? "If you are on a short-term contract or per diem arrangement, your forward visibility is minimal. Has your contract term been extended?" : "Has your employment agreement changed in length or terms?"}`,
                    variability: `Variability was ${varLvl}. ${varLvl === "high" ? "Your compensation swings with productivity — RVUs, patient volume, or shift availability. Has your compensation model been restructured?" : "Has your income stability shifted?"}`,
                    labor: `${labr}% from your clinical work. ${labr > 85 ? "You stop seeing patients, income stops. Have you created any courses, content, advisory relationships, or intellectual property that earns independently?" : "Has your non-clinical income changed?"}`,
                  },
                  construction_trades: {
                    recurrence: `${pct}% recurring. ${pct < 20 ? "Your income is entirely project-to-project. Have you signed any maintenance contracts, recurring service agreements, or property management deals?" : "Has any recurring maintenance or service contract started or ended?"}`,
                    concentration: `${conc}% from your top client. ${conc > 60 ? "In construction, that is usually one GC or one developer relationship. If that relationship has changed — or a new one has started — this number has moved." : "Has your GC or builder relationship mix shifted?"}`,
                    diversification: `${srcs} source${srcs === 1 ? "" : "s"}. ${srcs <= 2 ? "Have you bid on a new type of project, added a subcontracting relationship, or expanded into a new geographic area?" : "Has your project mix or trade partner network changed?"}`,
                    forward: `${fwd}% committed. ${fwd < 15 ? "Your next job was essentially a handshake. Have you signed any new contracts or been awarded any bids since your assessment?" : "How does your signed backlog compare to when you were assessed?"}`,
                    variability: `Variability was ${varLvl}. ${varLvl === "high" || varLvl === "very_high" ? "Seasonal swings and bid timing create gaps. Have you added any off-season work, maintenance contracts, or indoor trade services?" : "Has your project flow become more or less consistent?"}`,
                    labor: `${labr}% required you on site. ${labr > 80 ? "If you cannot physically work, income stops immediately. Have you hired any crew that can run jobs without your presence, or started any equipment rental or subcontracting income?" : "Has your crew or delegation model changed?"}`,
                  },
                  creative_media: {
                    recurrence: `${pct}% recurring. ${pct < 20 ? "Between projects, your income is zero. Have you signed any retainer clients, content subscriptions, or recurring production agreements?" : "Has any recurring creative engagement started or ended?"}`,
                    concentration: `${conc}% from your top client. ${conc > 50 ? "One production house, agency, or brand is carrying half your income. Have you added any new client relationships?" : "Has your client portfolio shifted?"}`,
                    diversification: `${srcs} source${srcs === 1 ? "" : "s"}. ${srcs <= 2 ? "Have you started licensing existing content, selling templates, or offering a new service like consulting or training alongside production?" : "Has any creative income stream started or ended?"}`,
                    forward: `${fwd}% committed. ${fwd < 15 ? "You had almost nothing signed for next quarter. Have you booked any new projects, locked in any production calendars, or signed any retainers?" : "How does your booked calendar compare?"}`,
                    variability: `Variability was ${varLvl}. ${varLvl === "high" || varLvl === "very_high" ? "Feast-or-famine is the creative industry norm. Have retainer clients or recurring content deals smoothed your monthly income?" : "Has your project consistency changed?"}`,
                    labor: `${labr}% from your personal creative work. ${labr > 80 ? "No production, no income. Have you created any digital products, templates, courses, stock content, or licensed IP that earns between projects?" : "Has your passive creative income changed?"}`,
                  },
                  education_training: {
                    recurrence: `${pct}% recurring. ${pct > 60 ? "Your institutional salary is stable. Has your contract been renewed, or have you added any recurring income like course royalties or tutoring subscriptions?" : "Has your employment arrangement changed — contract renewal, course load, or additional income sources?"}`,
                    concentration: `${conc}% from one source. ${conc > 80 ? "One school or institution. Have you added any speaking, consulting, online course, or publishing income outside that institution?" : "Has your institutional dependency changed?"}`,
                    diversification: `${srcs} source${srcs === 1 ? "" : "s"}. ${srcs === 1 ? "Your paycheck comes from one place. Have you created any online courses, published any materials, or started any tutoring or consulting work?" : "Has any secondary income source started or ended?"}`,
                    forward: `${fwd}% secured. ${fwd < 40 ? "If you are on annual contracts or adjunct status, your visibility resets regularly. Has your contract been extended to a multi-year term?" : "Has your contract duration changed?"}`,
                    variability: `Variability was ${varLvl}. ${varLvl === "high" ? "Adjunct, hourly, or course-load-dependent pay creates variability. Has your compensation model become more stable?" : "Has your pay structure changed?"}`,
                    labor: `${labr}% from your teaching hours. ${labr > 80 ? "If you do not teach, you do not earn. Have you created any curriculum for licensing, books, digital courses, or frameworks that generate revenue independently?" : "Has your non-teaching income changed?"}`,
                  },
                  retail_ecommerce: {
                    recurrence: `${pct}% recurring. ${pct < 25 ? "Almost all revenue depends on new transactions. Have you launched any subscription boxes, membership programs, or auto-ship options?" : "Has your subscription or recurring revenue program grown or shrunk?"}`,
                    concentration: `${conc}% from your top channel. ${conc > 60 ? "You are heavily dependent on one platform or storefront. Have you added any marketplace, wholesale, or direct channel?" : "Has your channel mix shifted?"}`,
                    diversification: `${srcs} source${srcs === 1 ? "" : "s"}. ${srcs <= 2 ? "Have you added a new marketplace (Amazon, Etsy, wholesale), a retail location, or a B2B channel?" : "Has any sales channel been added or removed?"}`,
                    forward: `${fwd}% committed. ${fwd < 15 ? "Almost no revenue was pre-sold. Have you secured any wholesale commitments, subscription pre-pays, or pre-order campaigns?" : "Has your pre-committed revenue changed?"}`,
                    variability: `Variability was ${varLvl}. ${varLvl === "high" || varLvl === "very_high" ? "Retail is seasonal and traffic-dependent. Have subscriptions, corporate accounts, or diversified channels smoothed your monthly revenue?" : "Has your revenue consistency changed?"}`,
                    labor: `${labr}% from your daily operations. ${labr > 70 ? "You are the business. Have you hired staff, automated fulfillment, or outsourced any operations that previously required your daily involvement?" : "Has your operational delegation changed?"}`,
                  },
                  hospitality: {
                    recurrence: `${pct}% recurring. ${pct < 15 ? "Your revenue is almost entirely traffic-dependent. Have you signed any catering contracts, corporate accounts, or event retainers?" : "Has your recurring contract or account revenue changed?"}`,
                    concentration: `${conc}% from your top source. ${conc > 50 ? "You are heavily dependent on one type of revenue — likely walk-in or one major platform. Have you diversified into delivery, catering, or events?" : "Has your revenue channel mix shifted?"}`,
                    diversification: `${srcs} source${srcs === 1 ? "" : "s"}. ${srcs <= 2 ? "Have you added events, delivery partnerships, packaged products, or branded merchandise?" : "Has any revenue stream been added or lost?"}`,
                    forward: `${fwd}% committed. ${fwd < 10 ? "You had almost no pre-booked revenue. Have you secured any event bookings, corporate catering commitments, or seasonal reservations?" : "Has your forward booking calendar changed?"}`,
                    variability: `Variability was ${varLvl}. ${varLvl === "high" || varLvl === "very_high" ? "Daily traffic fluctuations drive your income. Have corporate accounts, pre-booked events, or delivery contracts created any consistency?" : "Has your daily revenue predictability changed?"}`,
                    labor: `${labr}% required your presence. ${labr > 80 ? "If you are not there, the business does not run. Have you hired a manager, built any revenue streams that operate without you, or expanded to a managed location?" : "Has your operational involvement changed?"}`,
                  },
                  transportation: {
                    recurrence: `${pct}% recurring. ${pct < 25 ? "Most of your loads are spot market. Have you signed any dedicated contracts, long-term freight agreements, or recurring routes?" : "Has your contract vs. spot ratio shifted?"}`,
                    concentration: `${conc}% from your top shipper. ${conc > 60 ? "One shipper or broker controls most of your revenue. Have you added any new freight relationships or direct shipper contracts?" : "Has your shipper or broker mix changed?"}`,
                    diversification: `${srcs} source${srcs === 1 ? "" : "s"}. ${srcs <= 2 ? "Have you added any new lanes, freight types, or broker relationships?" : "Has your freight network expanded or contracted?"}`,
                    forward: `${fwd}% contracted. ${fwd < 20 ? "Almost all revenue was day-to-day. Have you locked in any dedicated routes or contracted freight for the next quarter?" : "Has your contracted backlog changed?"}`,
                    variability: `Variability was ${varLvl}. ${varLvl === "high" || varLvl === "very_high" ? "Spot market rates swing daily. Have dedicated contracts reduced your exposure to rate volatility?" : "Has your load consistency improved?"}`,
                    labor: `${labr}% from your personal driving. ${labr > 85 ? "No driving, no income. Have you added any trucks, hired any drivers, or built any brokerage income that earns without you behind the wheel?" : "Has your fleet or brokerage model changed?"}`,
                  },
                  agriculture: {
                    recurrence: `${pct}% recurring. ${pct < 20 ? "Your income is seasonal and harvest-dependent. Have you added any CSA subscriptions, forward contracts, or recurring supply agreements?" : "Has your contracted or subscription revenue changed?"}`,
                    concentration: `${conc}% from your top buyer. ${conc > 60 ? "You are heavily dependent on one market or buyer. Have you added farmers market sales, a CSA program, or a wholesale channel?" : "Has your buyer distribution shifted?"}`,
                    diversification: `${srcs} source${srcs === 1 ? "" : "s"}. ${srcs <= 2 ? "Have you added value-added products, agritourism, equipment rental, or a new crop/livestock category?" : "Has any revenue stream been added or discontinued?"}`,
                    forward: `${fwd}% contracted. ${fwd < 20 ? "Almost all revenue depended on harvest timing and spot pricing. Have you pre-sold any production through forward contracts or CSA commitments?" : "Has your pre-sold production percentage changed?"}`,
                    variability: `Variability was ${varLvl}. ${varLvl === "high" || varLvl === "very_high" ? "Weather, pricing, and yields create enormous swings. Have diversified crops, storage capacity, or forward contracts reduced your exposure?" : "Has your revenue stability shifted?"}`,
                    labor: `${labr}% from your daily field work. ${labr > 80 ? "If you cannot physically work the land, income stops. Have you added any leasing income, hired seasonal crews, or created value-added products that sell year-round?" : "Has your operational model changed?"}`,
                  },
                  energy: {
                    recurrence: `${pct}% recurring. ${pct > 50 ? "Your employment provides a stable base. Has your contract been renewed, or have you added any consulting or advisory income?" : "Has your contract structure changed? Longer-term agreements increase recurrence in energy."}`,
                    concentration: `${conc}% from one source. ${conc > 80 ? "One employer or one project site. In energy, the only diversification is adding consulting, training, or advisory work alongside your primary role." : "Has your employer or project dependency changed?"}`,
                    diversification: `${srcs} source${srcs === 1 ? "" : "s"}. ${srcs === 1 ? "Have you added any consulting, expert witness, training, or advisory board positions in the energy sector?" : "Has any secondary income source changed?"}`,
                    forward: `${fwd}% secured. ${fwd < 30 ? "Project-based energy work has limited forward visibility. Has your contract been extended or renewed?" : "Has your contract term or project commitment changed?"}`,
                    variability: `Variability was ${varLvl}. In energy, this ties to commodity cycles, project milestones, and regulatory shifts. ${varLvl === "high" ? "Has your compensation become less tied to production volumes or commodity prices?" : "Has your compensation structure changed?"}`,
                    labor: `${labr}% from your active on-site work. ${labr > 75 ? "Have you built any income from patents, licensing, advisory roles, or training programs that continue without your on-site presence?" : "Has your passive or advisory income changed?"}`,
                  },
                  manufacturing: {
                    recurrence: `${pct}% recurring. ${pct < 30 ? "Revenue depends on new orders. Have you signed any long-term supply agreements, recurring purchase orders, or blanket contracts?" : "Has your contracted recurring revenue changed?"}`,
                    concentration: `${conc}% from your top customer. ${conc > 50 ? "In manufacturing, losing one major account can be devastating. Have you added any new customers at 10%+ of revenue?" : "Has your customer concentration shifted?"}`,
                    diversification: `${srcs} source${srcs === 1 ? "" : "s"}. ${srcs <= 3 ? "Have you added new product lines, private label agreements, or distribution channels since your assessment?" : "Has your product or customer mix changed?"}`,
                    forward: `${fwd}% committed. ${fwd < 25 ? "Your order backlog was thin. How does your current backlog compare? Signed POs and blanket orders are your visibility." : "Has your order backlog grown or shrunk?"}`,
                    variability: `Variability was ${varLvl}. ${varLvl === "high" || varLvl === "very_high" ? "Demand swings and customer timing create volatility. Have long-term contracts or diversified customers stabilized your production schedule?" : "Has your production consistency improved?"}`,
                    labor: `${labr}% from your daily management. ${labr > 70 ? "The operation depends on you. Have you automated any processes, hired operational management, or built any licensing or private label income?" : "Has your operational delegation changed?"}`,
                  },
                  nonprofit: {
                    recurrence: `${pct}% recurring. ${pct < 30 ? "Most funding is one-time grants or campaigns. Have you built any monthly donor programs, annual memberships, or multi-year grant commitments?" : "Has your recurring funding base grown or declined?"}`,
                    concentration: `${conc}% from your top funder. ${conc > 50 ? "One foundation or government grant is carrying the organization. Have you diversified into earned revenue, events, or new grant sources?" : "Has your funding concentration shifted?"}`,
                    diversification: `${srcs} source${srcs === 1 ? "" : "s"}. ${srcs <= 2 ? "Have you added fee-for-service programs, social enterprise revenue, events, or new institutional funders?" : "Has your revenue mix changed?"}`,
                    forward: `${fwd}% committed. ${fwd < 25 ? "Most funding was pending or speculative. Have you secured any multi-year commitments, pledged gifts, or contracted program revenue?" : "Has your committed funding pipeline changed?"}`,
                    variability: `Variability was ${varLvl}. ${varLvl === "high" || varLvl === "very_high" ? "Grant cycles and campaign timing create unpredictability. Have monthly giving programs or earned revenue created any consistency?" : "Has your funding predictability improved?"}`,
                    labor: `${labr}% from active fundraising. ${labr > 70 ? "If you stop fundraising, revenue dries up. Have you built any endowment income, earned revenue programs, or self-sustaining program fees?" : "Has your revenue model shifted toward earned income?"}`,
                  },
                  fitness_wellness: {
                    recurrence: `${pct}% recurring. ${pct < 30 ? "Most income comes from individual session bookings. Have you launched any membership packages, monthly subscriptions, or auto-renewing session bundles?" : "Has your membership or subscription revenue grown?"}`,
                    concentration: `${conc}% from your top source. ${conc > 50 ? "A few high-frequency clients carry most of your revenue. If one of them stops, your income drops immediately. Have you diversified your client base?" : "Has your client concentration changed?"}`,
                    diversification: `${srcs} source${srcs === 1 ? "" : "s"}. ${srcs <= 2 ? "Have you added group classes, online programs, corporate wellness contracts, or product sales alongside 1-on-1 sessions?" : "Has your service offering expanded or contracted?"}`,
                    forward: `${fwd}% committed. ${fwd < 20 ? "Clients could cancel tomorrow with no penalty. Have you moved any clients to prepaid packages, 3-month commitments, or annual memberships?" : "Has your committed client base changed?"}`,
                    variability: `Variability was ${varLvl}. ${varLvl === "high" || varLvl === "very_high" ? "Cancellations and seasonal dips create unpredictable months. Have memberships or prepaid packages created any consistency?" : "Has your session volume become more predictable?"}`,
                    labor: `${labr}% from your personal training hours. ${labr > 85 ? "No sessions, no income. Have you created any digital programs, online courses, workout plans, or content that earns while you are not training?" : "Has your digital or passive income changed?"}`,
                  },
                };
                const tips = tipsByIndustry[sectorKey] || tipsByIndustry.default;

                return [
                  { label: "Recurrence", value: `${base.income_persistence_pct}% of your income recurs automatically`, key: "recurrence", tip: tips.recurrence },
                  { label: "Concentration", value: `Your largest source carries ${base.largest_source_pct}% of income`, key: "concentration", tip: tips.concentration },
                  { label: "Diversification", value: `You have ${base.source_diversity_count} income source${base.source_diversity_count === 1 ? "" : "s"}`, key: "diversification", tip: tips.diversification },
                  { label: "Forward Visibility", value: `${base.forward_secured_pct}% of your income is secured forward`, key: "forward", tip: tips.forward },
                  { label: "Variability", value: `Your income variability is ${base.income_variability_level}`, key: "variability", tip: tips.variability },
                  { label: "Labor Dependence", value: `${base.labor_dependence_pct}% requires your active work`, key: "labor", tip: tips.labor },
                ].map((item, i, arr) => (
                  <div key={i}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "14px 0", borderBottom: snapshotTip === item.key ? "none" : (i < arr.length - 1 ? `1px solid ${B.stone}` : "none"), cursor: "pointer" }}
                      onClick={() => setSnapshotTip(snapshotTip === item.key ? null : item.key)}>
                      <div>
                        <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: "0.06em", color: B.taupe, marginBottom: 2 }}>{item.label.toUpperCase()}</div>
                        <div style={{ fontSize: 15, color: B.navy }}>{item.value}</div>
                      </div>
                      <span style={{ fontSize: 13, color: snapshotTip === item.key ? B.purple : B.taupe, fontStyle: "italic", flexShrink: 0, marginLeft: 16, transition: "color 150ms" }}>
                        {snapshotTip === item.key ? "Close" : "Is this still true?"}
                      </span>
                    </div>
                    {snapshotTip === item.key && (
                      <div style={{ padding: mobile ? "12px 14px" : "14px 18px", marginBottom: 10, borderRadius: 10, backgroundColor: `${B.purple}04`, borderLeft: `3px solid ${B.purple}20`, animation: "fadeSlideIn 200ms ease-out" }}>
                        <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.06em", color: B.purple, marginBottom: 4 }}>TIP FOR {ind.toUpperCase()}</div>
                        <p style={{ fontSize: 14, color: B.navy, margin: 0, lineHeight: 1.55 }}>{item.tip}</p>
                      </div>
                    )}
                  </div>
                ));
              })()}
            </div>

            <div style={{ marginTop: 24, padding: mobile ? "18px 16px" : "20px 24px", borderRadius: 12, backgroundColor: "#FAFAFA", textAlign: "center" }}>
              <p style={{ fontSize: 15, color: B.navy, margin: "0 0 16px", lineHeight: 1.55 }}>
                If your structure has changed, your score may not reflect where you are today.
              </p>
              <Link href="/pricing" style={{
                display: "inline-flex", alignItems: "center", justifyContent: "center",
                height: 48, padding: "0 28px", borderRadius: 10,
                backgroundColor: B.navy, color: B.white,
                fontSize: 15, fontWeight: 600, textDecoration: "none",
                transition: "background 150ms",
              }}
                onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.backgroundColor = "#2a2248"; }}
                onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.backgroundColor = B.navy; }}>
                Take a New Assessment &mdash; $69
              </Link>
            </div>
          </section>

          </PhaseSep>

          {/* ── RECORD CARD ── */}
          {(() => {
            const recordId = (r?.record_id as string) || "";
            const modelVer = (r?.model_version as string) || "RP-2.0";
            const shortId = recordId.length > 8 ? recordId.slice(0, 8) : recordId;
            const copyId = () => { if (recordId) { navigator.clipboard.writeText(recordId); setCopiedRecord(true); setTimeout(() => setCopiedRecord(false), 2000); } };
            if (!recordId || recordId.startsWith("sim-")) return null;
            return (
              <div style={{ marginTop: 32, padding: mobile ? "20px 20px" : "24px 28px", borderRadius: 14, backgroundColor: "#FAFAFA", border: `1px solid ${B.stone}`, textAlign: "center" }}>
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

          {/* Minimal footer */}
          <div style={{ paddingTop: 32, textAlign: "center" }}>
            <p style={{ fontSize: 12, color: `${B.taupe}60`, margin: 0 }}>RunPayway™ &middot; PeopleStar Enterprises, INC.</p>
          </div>
        </div>
      </div>
    </>
  );
}

export default function DashboardPage() {
  return <Suspense><DashboardContent /></Suspense>;
}
