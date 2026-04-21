"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import logoBlue from "../../../../public/runpayway-logo-blue.png";
import { C, mono, sans, bandColor } from "@/lib/design-tokens";
import { trackAssessmentComplete } from "@/lib/analytics";
import { WORKER_URL } from "@/lib/config";
import ShareableScoreCard from "@/components/ShareableScoreCard";
import { getVocabulary } from "@/lib/industry-vocabulary";
import { fetchWithTimeout, fetchWithRetry } from "@/lib/fetch-helpers";
import { buildQuestions, type Question } from "@/lib/questions";
// V2-to-V1 adapter for converting engine output to record format
const loadAdapter = () => import("@/lib/v2-to-v1-adapter");
const loadVocab = () => import("@/lib/industry-vocabulary");
// V2 engine — runs client-side (deterministic, no server secrets needed)
const loadEngine = () => import("@/lib/engine/v2/index");

/* ------------------------------------------------------------------ */
/*  Data                                                               */
/* ------------------------------------------------------------------ */

const ANSWER_MAP: Record<string, number> = {
  A: 0, B: 25, C: 50, D: 75, E: 100,
};

const STORAGE_KEY = "runpayway_diagnostic_state";

const FIELD_MAP = [
  "recurring_income_proportion",
  "income_concentration",
  "number_of_income_sources",
  "forward_revenue_visibility",
  "earnings_variability",
  "income_continuity_without_active_labor",
];

const PROCESSING_STEPS = [
  "Analyzing your responses",
  "Running structural calculations",
  "Building your report",
];

const LOADING_QUOTES = [
  { text: "Analyzing your income across six structural dimensions." },
  { text: "Mapping your income structure across six dimensions." },
  { text: "Building your personalized assessment." },
];

/* ------------------------------------------------------------------ */
/*  Storage                                                            */
/* ------------------------------------------------------------------ */

const SESSION_TTL_MS = 15 * 60 * 1000; // 15 minutes — restore window for accidental exits

function saveAnswersToStorage(answers: (string | null)[]) {
  const data = JSON.stringify({ answers, savedAt: Date.now() });
  sessionStorage.setItem(STORAGE_KEY, data);
  localStorage.setItem(STORAGE_KEY, data);
}

function loadAnswersFromStorage(): (string | null)[] | null {
  try {
    // Prefer sessionStorage (same tab)
    let raw = sessionStorage.getItem(STORAGE_KEY);
    if (!raw) {
      // Fall back to localStorage for crash/accidental-close recovery
      raw = localStorage.getItem(STORAGE_KEY);
      if (raw) sessionStorage.setItem(STORAGE_KEY, raw);
    }
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    // Expire stale sessions — only restore if within TTL
    if (parsed.savedAt && Date.now() - parsed.savedAt > SESSION_TTL_MS) {
      sessionStorage.removeItem(STORAGE_KEY);
      localStorage.removeItem(STORAGE_KEY);
      return null;
    }
    return parsed.answers;
  } catch {
    return null;
  }
}

function clearAnswerStorage() {
  sessionStorage.removeItem(STORAGE_KEY);
  localStorage.removeItem(STORAGE_KEY);
}

/* ------------------------------------------------------------------ */
/*  Viewport lock — prevents horizontal scroll on mobile              */
/* ------------------------------------------------------------------ */

const VIEWPORT_LOCK_CSS = `
  html, body { overflow-x: hidden !important; width: 100% !important; }
  *, *::before, *::after { box-sizing: border-box; }
  @supports (height: 100dvh) { .rp-fixed-full { height: 100dvh !important; } }
`;

/* ------------------------------------------------------------------ */
/*  Step breadcrumb                                                    */
/* ------------------------------------------------------------------ */

function StepBreadcrumb({ activeStep, completedSteps = [] as number[] }: { activeStep: number; completedSteps?: number[] }) {
  const steps = [
    { num: "\u2460", label: "Profile" },
    { num: "\u2461", label: "Assessment" },
    { num: "\u2462", label: "Results" },
  ];
  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 0, marginBottom: 8 }}>
      {steps.map((s, i) => {
        const isActive = i + 1 === activeStep;
        const isCompleted = completedSteps.includes(i + 1);
        return (
          <span key={i} style={{ display: "inline-flex", alignItems: "center", gap: 0 }}>
            <span style={{
              fontSize: 12,
              fontWeight: isActive ? 600 : 400,
              color: isActive ? C.purple : isCompleted ? C.teal : "rgba(14,26,43,0.25)",
              letterSpacing: "0.01em",
            }}>
              {isCompleted ? "\u2713" : s.num} {s.label}
            </span>
            {i < steps.length - 1 && (
              <span style={{ margin: "0 10px", color: "rgba(14,26,43,0.15)", fontSize: 12 }}>&mdash;&mdash;</span>
            )}
          </span>
        );
      })}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Band celebration messages                                          */
/* ------------------------------------------------------------------ */

const BAND_MESSAGES: Record<string, string> = {
  "High Stability": "Exceptional structure.",
  "Established Stability": "Strong foundation.",
  "Developing Stability": "Room to build.",
  "Limited Stability": "A clear starting point.",
};

/* ------------------------------------------------------------------ */
/*  Final card — what's included bullets                               */
/* ------------------------------------------------------------------ */

const INCLUDED_BULLETS = [
  "Income Stability Score™ across 6 structural dimensions",
  "Stability band classification and peer context",
  "Constraint diagnosis — your weakest structural factor",
  "PressureMap\u2122 — AI-generated industry risk analysis",
  "Plain-English interpretation of your score",
  "Personalized action plan with projected score lift",
];

/* ------------------------------------------------------------------ */
/*  Page                                                               */
/* ------------------------------------------------------------------ */

export default function DiagnosticPage() {
  const router = useRouter();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<(string | null)[]>(Array(6).fill(null));
  const [submitting, setSubmitting] = useState(false);
  const [showLoading, setShowLoading] = useState(false);
  const [loadingStep, setLoadingStep] = useState(0);
  const [transitioning, setTransitioning] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showReview, setShowReview] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const [assessmentTitle, setAssessmentTitle] = useState("");
  const [elapsed, setElapsed] = useState(0);
  const [entered, setEntered] = useState(false);
  const [quoteIdx, setQuoteIdx] = useState(0);
  const [quoteFade, setQuoteFade] = useState(true);
  const [showOverlay, setShowOverlay] = useState(false);
  const [reviewExiting, setReviewExiting] = useState(false);
  const [showReveal, setShowReveal] = useState(false);
  const [revealScore, setRevealScore] = useState(0);
  const [revealBand, setRevealBand] = useState("");
  const [revealPhase, setRevealPhase] = useState(0); // 0=counting, 1=band, 2=peer, 3=cta
  const [showShareCard, setShowShareCard] = useState(false);

  // Mobile detection
  const [mobile, setMobile] = useState(false);
  // Final card — shows after API work completes, before report
  const [showFinalCard, setShowFinalCard] = useState(false);
  const [finalCardPhase, setFinalCardPhase] = useState(0);
  // Track API completion for loading screen
  const apiDoneRef = useRef(false);
  // Industry-customized questions
  const [QUESTIONS, setQuestions] = useState<Question[]>(() => buildQuestions(""));

  // Mobile breakpoint detection
  useEffect(() => {
    const check = () => setMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  // Lock user in — prevent back button and tab close
  useEffect(() => {
    const onBeforeUnload = (e: BeforeUnloadEvent) => {
      if (!showLoading && !showReview) {
        e.preventDefault();
      }
    };
    const onPopState = () => {
      window.history.pushState(null, "", window.location.href);
    };
    window.history.pushState(null, "", window.location.href);
    window.addEventListener("beforeunload", onBeforeUnload);
    window.addEventListener("popstate", onPopState);
    return () => {
      window.removeEventListener("beforeunload", onBeforeUnload);
      window.removeEventListener("popstate", onPopState);
    };
  }, [showLoading, showReview]);

  useEffect(() => {
    window.scrollTo(0, 0);
    // Payment gate — check sessionStorage first, fall back to localStorage, then allow free
    let session = sessionStorage.getItem("rp_purchase_session");
    if (!session) {
      const stored = localStorage.getItem("rp_purchase_session");
      if (stored) {
        sessionStorage.setItem("rp_purchase_session", stored);
        session = stored;
      }
    }
    if (!session) {
      // Allow free access — create a free session so users can take the assessment
      const freeSession = JSON.stringify({ plan_key: "free", status: "paid" });
      sessionStorage.setItem("rp_purchase_session", freeSession);
      localStorage.setItem("rp_purchase_session", freeSession);
      session = freeSession;
    }
    try {
      const parsed = JSON.parse(session);
      if (parsed.status !== "paid" && parsed.status !== "active") {
        router.push("/pricing");
        return;
      }
    } catch {
      router.push("/pricing");
      return;
    }
    let profile = sessionStorage.getItem("rp_profile");
    if (!profile) {
      const storedProfile = localStorage.getItem("rp_profile");
      if (storedProfile) {
        sessionStorage.setItem("rp_profile", storedProfile);
        profile = storedProfile;
      }
    }
    if (!profile) {
      router.push("/diagnostic-portal");
      return;
    }
    // Build industry-customized questions from profile
    try {
      const parsed = JSON.parse(profile);
      setQuestions(buildQuestions(parsed.industry_sector || ""));
    } catch { /* fallback already set via default buildQuestions("") */ }
    // Silently restore from crash within session (no resume UI)
    const saved = loadAnswersFromStorage();
    if (saved && saved.length === 6 && saved.some((a) => a !== null)) {
      setAnswers(saved);
      const firstUnanswered = saved.findIndex((a) => a === null);
      if (firstUnanswered >= 0) setCurrentQuestion(firstUnanswered);
      else setCurrentQuestion(5);
    } else {
      clearAnswerStorage();
      localStorage.removeItem("rp_assessment_progress");
    }
    setTimeout(() => setEntered(true), 100);
  }, [router]);

  // Live elapsed timer
  useEffect(() => {
    if (showLoading) return;
    const timer = setInterval(() => setElapsed((s) => s + 1), 1000);
    return () => clearInterval(timer);
  }, [showLoading]);

  // Score reveal animation — count up then cascade phases
  useEffect(() => {
    if (!showReveal || revealScore === 0) return;
    let count = 0;
    const target = revealScore;
    const duration = 2000;
    const stepTime = Math.max(16, Math.floor(duration / target));
    const counter = setInterval(() => {
      count += 1;
      if (count >= target) { count = target; clearInterval(counter); }
      setRevealPhase(0);
      // Use DOM to update the counter (avoid re-render per tick)
      const el = document.getElementById("reveal-score-num");
      if (el) el.textContent = String(count);
    }, stepTime);
    // Phase cascade
    const t1 = setTimeout(() => setRevealPhase(1), duration + 400); // band
    const t2 = setTimeout(() => setRevealPhase(2), duration + 1200); // peer
    const t3 = setTimeout(() => setRevealPhase(3), duration + 2200); // CTA
    return () => { clearInterval(counter); clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); };
  }, [showReveal, revealScore]);

  // Quote rotation
  useEffect(() => {
    if (!showLoading) return;
    setQuoteIdx(Math.floor(Math.random() * LOADING_QUOTES.length));
    const interval = setInterval(() => {
      setQuoteFade(false);
      setTimeout(() => {
        setQuoteIdx(prev => (prev + 1) % LOADING_QUOTES.length);
        setQuoteFade(true);
      }, 400);
    }, 7000);
    return () => clearInterval(interval);
  }, [showLoading]);

  // Processing step animation
  useEffect(() => {
    if (!showLoading) return;
    const interval = setInterval(() => {
      setLoadingStep((prev) => {
        if (prev >= PROCESSING_STEPS.length - 1) {
          clearInterval(interval);
          return prev;
        }
        return prev + 1;
      });
    }, 600);
    return () => clearInterval(interval);
  }, [showLoading]);

  // Final card phase cascade
  useEffect(() => {
    if (!showFinalCard) return;
    setFinalCardPhase(0);
    const t1 = setTimeout(() => setFinalCardPhase(1), 300);
    const t2 = setTimeout(() => setFinalCardPhase(2), 600);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, [showFinalCard]);

  const q = QUESTIONS[currentQuestion];
  const selected = answers[currentQuestion];
  const allAnswered = answers.every((a) => a !== null);

  const selectAnswer = useCallback((letter: string) => {
    if (transitioning) return;
    setTransitioning(true); // Lock immediately to block ghost taps
    setError(null);
    setAnswers((prev) => {
      const next = [...prev];
      next[currentQuestion] = letter;
      saveAnswersToStorage(next);
      // Zeigarnik — persist long-lived progress for abandoned-assessment reminder
      const answeredCount = next.filter((a) => a !== null).length;
      localStorage.setItem("rp_assessment_progress", JSON.stringify({
        questionIndex: currentQuestion,
        timestamp: new Date().toISOString(),
        answersGiven: answeredCount,
      }));
      return next;
    });

    if (currentQuestion < 5) {
      // Auto-advance after selection (except last question)
      // Use longer delay to prevent ghost taps on touch devices (iPad/phone)
      setTimeout(() => {
        scrollRef.current?.scrollTo({ top: 0 });
        setCurrentQuestion((prev) => Math.min(5, prev + 1));
        // Keep transitioning=true for 500ms after question change
        // This blocks pointer events on the new question's options
        // preventing the finger-lift from the previous tap from registering
        setTimeout(() => setTransitioning(false), 500);
      }, 600);
    } else {
      // Last question — auto-advance to review
      setTimeout(() => {
        setTransitioning(false);
        setShowReview(true);
      }, 600);
    }
  }, [currentQuestion, transitioning]);

  const goTo = (index: number) => {
    setError(null);
    setTransitioning(true);
    setTimeout(() => {
      scrollRef.current?.scrollTo({ top: 0 });
      setCurrentQuestion(index);
      setTransitioning(false);
    }, 200);
  };

  const handleSubmit = async () => {
    if (!allAnswered) return;

    const idempotencyKey = crypto.randomUUID();

    const profile = JSON.parse(sessionStorage.getItem("rp_profile") || "{}");

    const { adaptV2ToV1 } = await loadAdapter();

    // Build v2 raw inputs directly from answer choices (A-E)
    const rawInputsV2 = {
      q1_recurring_revenue_base: answers[0] as string,
      q2_income_concentration: answers[1] as string,
      q3_income_source_diversity: answers[2] as string,
      q4_forward_revenue_visibility: answers[3] as string,
      q5_earnings_variability: answers[4] as string,
      q6_income_continuity_without_labor: answers[5] as string,
    };

    // Build v2 profile context from profile fields
    const classMap: Record<string, string> = { "Individual": "individual", "Business Entity": "business_owner", "Team / Partnership": "hybrid" };
    const structureMap: Record<string, string> = { "Employee (W-2)": "solo_service", "Independent Contractor": "solo_service", "Business Owner / Firm": "small_agency", "Partnership": "small_agency", "Nonprofit Organization": "small_agency" };
    const modelMap: Record<string, string> = { "Employee Salary": "salary", "Commission-Based": "commission", "Contract-Based": "project_fee", "Independent Contractor": "project_fee", "Consulting / Client Services": "retainer", "Agency / Brokerage Income": "commission", "Project-Based Work": "project_fee", "Subscription / Retainer Services": "subscription", "Licensing / Royalty Income": "licensing", "Product Sales": "ecommerce", "Digital Product Sales": "digital_products", "Real Estate Rental Income": "rental", "Real Estate Brokerage Income": "commission", "Hybrid Multiple Income Sources": "mixed_services" };
    const revenueMap: Record<string, string> = { "Mostly One-Time Payments": "active_heavy", "Repeat Clients / Returning Customers": "hybrid", "Monthly Recurring Payments": "recurring_heavy", "Contracted Multi-Month Revenue": "recurring_heavy", "Long-Term Recurring Income": "asset_heavy", "Mixed Revenue Structure": "mixed" };
    const sectorMap: Record<string, string> = { "Real Estate": "real_estate", "Finance / Banking": "finance_banking", "Insurance": "insurance", "Technology": "technology", "Healthcare": "healthcare", "Legal Services": "legal_services", "Consulting / Professional Services": "consulting_professional_services", "Sales / Brokerage": "sales_brokerage", "Media / Entertainment": "media_entertainment", "Construction / Trades": "construction_trades", "Retail / E-Commerce": "retail_ecommerce", "Hospitality / Food Service": "hospitality_food_service", "Transportation / Logistics": "transportation_logistics", "Manufacturing": "manufacturing", "Education": "education", "Nonprofit / Public Sector": "nonprofit_public_sector", "Agriculture": "agriculture", "Energy / Utilities": "energy_utilities", "Other": "other" };
    const profileV2 = {
      profile_class: classMap[String(profile.classification ?? "Individual")] ?? "individual",
      operating_structure: structureMap[String(profile.operating_structure ?? "Employee (W-2)")] ?? "solo_service",
      primary_income_model: modelMap[String(profile.primary_income_model ?? "Employee Salary")] ?? "other",
      revenue_structure: revenueMap[String(profile.revenue_structure ?? "Mixed Revenue Structure")] ?? "mixed",
      industry_sector: sectorMap[String(profile.industry_sector ?? "Other")] ?? "other",
      maturity_stage: "developing",
    };

    setSubmitting(true);
    setError(null);

    // ── Entitlement check (non-blocking for free users, gate for paid) ──
    const purchaseSession = (() => {
      try { return JSON.parse(sessionStorage.getItem("rp_purchase_session") || localStorage.getItem("rp_purchase_session") || "{}"); } catch { return {}; }
    })();
    const entEmail = profile.recipient_email || purchaseSession.customer_email || "";
    const entPlanKey = purchaseSession.plan_key || "free";

    if (entEmail && entPlanKey !== "free") {
      try {
        const checkRes = await fetchWithTimeout(`${WORKER_URL}/entitlement/check`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: entEmail, plan_key: entPlanKey }),
        }, 8000);
        if (checkRes.ok) {
          const checkData = await checkRes.json();
          if (checkData?.entitlement_id) {
            sessionStorage.setItem("rp_entitlement_id", checkData.entitlement_id);
          }
          // Allow retakes within 30 days of purchase for single assessments
          if (checkData?.retake === true) {
            // Retake allowed — user can regenerate their report within 30 days
            // Continue without error
          } else if (checkData?.allowed === false) {
            // Only block if not allowed and not a retake
            if (checkData.reason === "expired") {
              setError("Your monitoring plan has expired. Renew to continue.");
            } else if (checkData.reason === "no_entitlement") {
              // Will be handled by auto-create below, don't error here
            } else {
              setError("Unable to process your assessment. Please try again.");
            }
            setSubmitting(false);
            return;
          }
          // For "no_entitlement": auto-create one for this paid user
          if (checkData?.allowed === false && checkData.reason === "no_entitlement") {
            try {
              const createRes = await fetchWithTimeout(`${WORKER_URL}/entitlement/create`, {
                method: "POST", headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email: entEmail, plan_key: entPlanKey, stripe_session_id: purchaseSession.stripe_session_id || null }),
              }, 5000);
              if (createRes.ok) {
                const createData = await createRes.json();
                if (createData?.entitlement?.id) sessionStorage.setItem("rp_entitlement_id", createData.entitlement.id);
              }
            } catch { /* auto-create failed — proceed anyway */ }
          }
        }
      } catch { /* Entitlement check failed — allow scoring via localStorage fallback */ }
    }

    // Show loading screen with quotes IMMEDIATELY
    setAssessmentTitle(profile.assessment_title || "");
    setShowLoading(true);
    apiDoneRef.current = false;
    const loadingStartTime = Date.now();

    try {
      let record;
      // Run the v2 engine client-side (deterministic, no server secrets needed)
      const { executeAssessment } = await loadEngine();
      const v2Result = executeAssessment({
        rawInputs: rawInputsV2,
        profile: profileV2,
      });
      record = adaptV2ToV1(v2Result);
      // Override assessment_title with user-entered value from profile
      if (profile.assessment_title) {
        (record as Record<string, unknown>).assessment_title = profile.assessment_title;
      }

      // ── Save record IMMEDIATELY — score is ready, AI content will be added async ──
      const adapted = record as Record<string, unknown>;
      sessionStorage.setItem("rp_record", JSON.stringify(record));
      localStorage.setItem("rp_record", JSON.stringify(record));

      // Persist record for lookup (v1-adapted field names)
      const stored = JSON.parse(localStorage.getItem("rp_records") || "[]");
      stored.push({
        record_id: adapted.record_id,
        authorization_code: adapted.authorization_code,
        model_version: adapted.model_version ?? "RP-2.0",
        final_score: adapted.final_score,
        stability_band: adapted.stability_band,
        assessment_date_utc: adapted.assessment_date_utc,
        issued_timestamp_utc: adapted.issued_timestamp_utc,
      });
      trackAssessmentComplete(
        (adapted.final_score as number) || 0,
        (adapted.industry_sector as string) || undefined,
      );
      localStorage.setItem("rp_records", JSON.stringify(stored));

      clearAnswerStorage();
      localStorage.removeItem("rp_assessment_progress");
      sessionStorage.removeItem("rp_idempotency_key");

      // ── Route IMMEDIATELY — score is computed, no need to wait for AI ──
      apiDoneRef.current = true;
      const elapsedMs = Date.now() - loadingStartTime;
      const remainingMs = Math.max(0, 1500 - elapsedMs);

      const planKey = (() => {
        try {
          const ps = JSON.parse(sessionStorage.getItem("rp_purchase_session") || "{}");
          return ps.plan_key || "free";
        } catch { return "free"; }
      })();

      setTimeout(() => {
        setLoadingStep(PROCESSING_STEPS.length);
        setTimeout(() => {
          if (planKey === "free") {
            router.push("/free-score");
            return;
          }
          setRevealScore((adapted.final_score as number) || 0);
          setRevealBand((adapted.stability_band as string) || "");
          setShowLoading(false);
          setShowReveal(true);
        }, 600);
      }, remainingMs);

      // ── Background: AI enrichment + persistence (non-blocking) ──
      (async () => {
        try {
          const v2Data = (adapted._v2 || {}) as Record<string, unknown>;
          const ni = (v2Data.normalized_inputs || {}) as Record<string, unknown>;
          const constraints = ((v2Data.constraints || {}) as Record<string, unknown>);
          const topConstraint = (Array.isArray(constraints.ranked) && constraints.ranked.length > 0)
            ? constraints.ranked[0] as Record<string, string>
            : { factor: "recurrence", label: "Recurring Revenue" };
          const topFactor = (Array.isArray(constraints.ranked) && constraints.ranked.length > 0)
            ? (constraints.ranked[0] as Record<string, string>).factor || "recurrence"
            : "recurrence";
          const { getVocabulary } = await loadVocab();
          const vocabCtx = getVocabulary(profile.industry_sector || "").worker_context;
          const lift3 = v2Data.score_lift_projection as Record<string, unknown> | undefined;
          const topLift = lift3?.highest_single_lift as Record<string, unknown> | undefined;

          const sharedBody = {
            industry: profile.industry_sector || "",
            operating_structure: profile.operating_structure || "",
            income_model: profile.primary_income_model || "",
            years_in_structure: profile.years_in_structure || "",
            score: (adapted.final_score as number) || 0,
            band: (adapted.stability_band as string) || "",
            vocab_context: vocabCtx,
            recurrence_pct: (ni.income_persistence_pct as number) || 0,
            concentration_pct: (ni.largest_source_pct as number) || 0,
            forward_visibility_pct: (ni.forward_secured_pct as number) || 0,
            labor_dependence_pct: (ni.labor_dependence_pct as number) || 0,
            variability_level: (ni.income_variability_level as string) || "moderate",
          };

          // Run all 3 Claude API calls + /personalize in PARALLEL
          const [pmResult, peResult, apResult, persResult] = await Promise.allSettled([
            // PressureMap
            fetchWithRetry(WORKER_URL, {
              method: "POST", headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ ...sharedBody, weakest_factor: topConstraint.factor || topConstraint.label || "", weakest_factor_value: topConstraint.label || "" }),
            }).then(async (res) => res.ok ? res.json() : null).catch(() => null),

            // Plain English
            fetchWithRetry(`${WORKER_URL}/plain-english`, {
              method: "POST", headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ ...sharedBody, weakest_factor: topFactor, active_income: adapted.active_income_level || 0, continuity_months: adapted.income_continuity_months || 0, risk_drop: adapted.risk_scenario_drop || 0 }),
            }).then(async (res) => res.ok ? res.json() : null).catch(() => null),

            // Action Plan
            fetchWithRetry(`${WORKER_URL}/action-plan`, {
              method: "POST", headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ ...sharedBody, weakest_factor: topFactor, active_income: adapted.active_income_level || 0, continuity_months: adapted.income_continuity_months || 0, risk_drop: adapted.risk_scenario_drop || 0, top_change: topLift?.label || "", projected_lift: topLift ? `${topLift.original_score} to ${topLift.projected_score} (+${topLift.lift})` : "" }),
            }).then(async (res) => res.ok ? res.json() : null).catch(() => null),

            // Personalize
            fetchWithRetry(`${WORKER_URL}/personalize`, {
              method: "POST", headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                ...sharedBody,
                weakest_factor: topFactor,
                assessment_title: profile.assessment_title || "",
                active_income_pct: adapted.active_income_level || 0,
                persistent_income_pct: adapted.persistent_income_level || 0,
                continuity_months: adapted.income_continuity_months || 0,
                risk_drop: adapted.risk_scenario_drop || 0,
                fragility_class: (v2Data.fragility as Record<string, unknown>)?.fragility_class || "",
                top_lift_action: topLift?.label || "",
                top_lift_points: topLift?.lift || 0,
                projected_score: topLift?.projected_score || 0,
                strongest_factor: "",
              }),
            }).then(async (res) => res.ok ? res.json() : null).catch(() => null),
          ]);

          // Apply AI results to record
          const pmData = pmResult.status === "fulfilled" ? pmResult.value : null;
          if (pmData?.pressure && pmData?.tailwind && pmData?.leverage_move) {
            (record as Record<string, unknown>).pressure_map = {
              generated_at: new Date().toISOString(), industry: profile.industry_sector || "",
              operating_structure: profile.operating_structure || "", income_model: profile.primary_income_model || "",
              pressure: pmData.pressure, tailwind: pmData.tailwind, leverage_move: pmData.leverage_move,
            };
          }

          const peData = peResult.status === "fulfilled" ? peResult.value : null;
          if (peData?.interpretation) {
            const expl = (v2Data.explainability || {}) as Record<string, unknown>;
            expl.why_this_score = peData.interpretation;
            if (peData.why_not_higher) expl.why_not_higher = peData.why_not_higher;
            (v2Data as Record<string, unknown>).explainability = expl;
          }

          const apData = apResult.status === "fulfilled" ? apResult.value : null;
          if (apData?.primary_action) {
            (v2Data as Record<string, unknown>).ai_action_plan = apData;
          }

          const persData = persResult.status === "fulfilled" ? persResult.value : null;
          if (persData) {
            (v2Data as Record<string, unknown>).personalized = persData;
          }

          // Update record in storage with AI-enriched content
          sessionStorage.setItem("rp_record", JSON.stringify(record));
          localStorage.setItem("rp_record", JSON.stringify(record));

          // Save record to cloud database (D1 via Worker)
          try {
            const recAdapted = record as Record<string, unknown>;
            await fetchWithTimeout(`${WORKER_URL}/save-record`, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                id: recAdapted.record_id,
                assessment_title: recAdapted.assessment_title || "",
                industry: profile.industry_sector || "",
                operating_structure: profile.operating_structure || "",
                income_model: profile.primary_income_model || "",
                score: recAdapted.final_score || 0,
                band: recAdapted.stability_band || "",
                record_data: JSON.stringify(record),
                email: profile.recipient_email || "",
                idempotency_key: idempotencyKey,
              }),
            });
          } catch { /* Cloud save failed — local storage still works */ }

          // Decrement entitlement usage (non-blocking)
          try {
            const entitlementId = sessionStorage.getItem("rp_entitlement_id") || localStorage.getItem("rp_entitlement_id") || "";
            if (entitlementId) {
              const recAdaptedForEnt = record as Record<string, unknown>;
              fetchWithTimeout(`${WORKER_URL}/entitlement/use`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                  entitlement_id: entitlementId,
                  assessment_id: recAdaptedForEnt.record_id || "",
                  idempotency_key: idempotencyKey,
                }),
              }, 8000).catch(() => { /* non-blocking */ });
            }
          } catch { /* Entitlement use failed — non-blocking */ }

          // Send report email if customer has an email address (wait for AI content)
          try {
            const emailAddr = profile.recipient_email || "";
            if (emailAddr && emailAddr.includes("@")) {
              const recForEmail = record as Record<string, unknown>;
              const v2ForEmail = ((recForEmail._v2 || {}) as Record<string, unknown>);
              const explForEmail = (v2ForEmail.explainability || {}) as Record<string, string>;
              const constraintsForEmail = (v2ForEmail.constraints || {}) as Record<string, unknown>;
              const rootConstraintEmail = (constraintsForEmail.root_constraint as string) || "";
              const constraintLabels: Record<string, string> = {
                high_concentration: "Too much income depends on one source",
                weak_forward_visibility: "Not enough income secured ahead of time",
                high_labor_dependence: "Too much income stops when work stops",
                low_persistence: "Not enough income repeats on its own",
                low_source_diversity: "Income comes from too few sources",
                high_variability: "Income swings too much month to month",
              };
              const topCEmail = constraintLabels[rootConstraintEmail]
                || ((Array.isArray(constraintsForEmail.ranked) && constraintsForEmail.ranked.length > 0)
                  ? (constraintsForEmail.ranked[0] as Record<string, string>).label || ""
                  : "")
                || "Structural weakness identified";
              const persForEmail = (v2ForEmail.personalized as Record<string, string> | undefined);
              await fetchWithTimeout(`${WORKER_URL}/send-email`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                  to: emailAddr,
                  name: recForEmail.assessment_title || "",
                  score: recForEmail.final_score || 0,
                  band: recForEmail.stability_band || "",
                  industry: profile.industry_sector || "",
                  operating_structure: profile.operating_structure || "",
                  constraint: topCEmail,
                  interpretation: explForEmail.why_this_score || "",
                  record_id: recForEmail.record_id || "",
                  insight_hook: persForEmail?.email_hook || "",
                  projected_score: topLift?.projected_score || 0,
                  projected_lift: topLift?.lift || 0,
                  action_preview: persForEmail?.action_script || "",
                }),
              });
            }
          } catch { /* Email send failed — non-blocking */ }
        } catch { /* Background enrichment failed — record still has engine data */ }
      })();

    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Submission failed";
      setError(message);
      setSubmitting(false);
      setShowLoading(false);
    }
  };


  /* ================================================================ */
  /*  Final card — what's included before report                       */
  /* ================================================================ */

  /* ================================================================ */
  /*  Score Reveal — the "aha" moment                                  */
  /* ================================================================ */
  if (showReveal) {
    const revealColor = revealScore >= 75 ? C.bandHigh : revealScore >= 50 ? C.bandEstablished : revealScore >= 30 ? C.bandDeveloping : C.bandLimited;
    const nextBand = revealScore < 30 ? "Developing Stability" : revealScore < 50 ? "Established Stability" : revealScore < 75 ? "High Stability" : null;
    const gap = nextBand ? (revealScore < 30 ? 30 : revealScore < 50 ? 50 : 75) - revealScore : 0;
    const bandMessage = BAND_MESSAGES[revealBand] || "";

    return (
      <div style={{
        position: "fixed", inset: 0, zIndex: 9999, background: C.sand,
        display: "flex", alignItems: mobile ? "flex-start" : "center", justifyContent: "center",
        overflowX: "hidden", width: "100%", maxWidth: "100vw",
        paddingTop: mobile ? "20vh" : 0,
      }}>
        <style dangerouslySetInnerHTML={{ __html: `${VIEWPORT_LOCK_CSS} @keyframes revealPulse { 0% { transform: scale(1); } 50% { transform: scale(1.05); } 100% { transform: scale(1); } }` }} />
        <div style={{ position: "absolute", top: mobile ? "15%" : "30%", left: "50%", width: mobile ? 360 : 600, height: mobile ? 360 : 600, transform: "translate(-50%, -50%)", background: `radial-gradient(circle, ${revealColor}10 0%, transparent 60%)`, pointerEvents: "none" }} />
        <div style={{ textAlign: "center", maxWidth: 480, padding: mobile ? "0 24px" : "0 24px", position: "relative", zIndex: 1, width: "100%", boxSizing: "border-box" }}>

          {/* Score number — counts up with pulse on reveal */}
          <div style={{ marginBottom: 8, animation: revealPhase >= 1 ? "revealPulse 0.6s ease-out" : "none" }}>
            <span id="reveal-score-num" style={{ fontSize: mobile ? 72 : 96, fontWeight: 200, color: C.navy, letterSpacing: "-0.05em", lineHeight: 1, fontFamily: mono }}>0</span>
            <span style={{ fontSize: mobile ? 22 : 28, fontWeight: 300, color: "rgba(14,26,43,0.20)", marginLeft: 4 }}>/100</span>
          </div>

          {/* Band name — fades in */}
          <div style={{ opacity: revealPhase >= 1 ? 1 : 0, transform: revealPhase >= 1 ? "translateY(0)" : "translateY(12px)", transition: "opacity 600ms ease, transform 600ms ease", marginBottom: 8 }}>
            <div style={{ display: "inline-flex", alignItems: "center", gap: 10, padding: "8px 20px", borderRadius: 24, border: `1px solid ${revealColor}30`, backgroundColor: `${revealColor}08` }}>
              <div style={{ width: 10, height: 10, borderRadius: 3, backgroundColor: revealColor }} />
              <span style={{ fontSize: 16, fontWeight: 600, color: revealColor }}>{revealBand}</span>
            </div>
          </div>

          {/* Band-specific human message */}
          {bandMessage && (
            <div style={{ opacity: revealPhase >= 1 ? 1 : 0, transition: "opacity 600ms ease", marginBottom: 24 }}>
              <p style={{ fontSize: 14, color: "rgba(14,26,43,0.40)", margin: 0 }}>{bandMessage}</p>
            </div>
          )}

          {/* Gap + message — fades in */}
          <div style={{ opacity: revealPhase >= 2 ? 1 : 0, transform: revealPhase >= 2 ? "translateY(0)" : "translateY(12px)", transition: "opacity 600ms ease, transform 600ms ease", marginBottom: 8 }}>
            {nextBand && (
              <p style={{ fontSize: mobile ? 15 : 17, color: "rgba(14,26,43,0.45)", margin: "0 0 8px", lineHeight: 1.5 }}>
                {gap} points from {nextBand}
              </p>
            )}
            <p style={{ fontSize: 14, color: "rgba(14,26,43,0.35)", margin: 0 }}>
              Your full report and action plan are ready.
            </p>
          </div>

          {/* Purchase validation line */}
          <div style={{ opacity: revealPhase >= 2 ? 1 : 0, transition: "opacity 600ms ease", marginBottom: 8 }}>
            <p style={{ fontSize: 13, color: "rgba(14,26,43,0.30)", letterSpacing: "0.02em", margin: "0 0 8px" }}>
              Analyzed across 6 structural dimensions. Deterministic scoring.
            </p>
          </div>

          {/* Spacer before CTA */}
          <div style={{ marginBottom: 24 }} />

          {/* CTA — fades in */}
          <div style={{ opacity: revealPhase >= 3 ? 1 : 0, transform: revealPhase >= 3 ? "translateY(0)" : "translateY(12px)", transition: "opacity 600ms ease, transform 600ms ease" }}>
            <button
              onClick={() => router.push("/dashboard")}
              style={{ padding: mobile ? "14px 32px" : "16px 40px", borderRadius: 12, backgroundColor: C.navy, border: "none", color: C.sandText, fontSize: mobile ? 15 : 17, fontWeight: 600, cursor: "pointer", fontFamily: sans, transition: "background-color 200ms", boxShadow: "0 4px 20px rgba(14,26,43,0.15)" }}
              onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.backgroundColor = "#1a2540"; }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.backgroundColor = C.navy; }}
            >
              Enter Your Dashboard &rarr;
            </button>
            <div style={{ marginTop: 16 }}>
              <button
                onClick={() => setShowShareCard(true)}
                style={{ background: "none", border: "none", fontSize: 13, fontWeight: 500, color: "rgba(14,26,43,0.35)", cursor: "pointer", fontFamily: sans, letterSpacing: "0.02em", transition: "color 150ms" }}
                onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.color = "rgba(14,26,43,0.55)"; }}
                onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.color = "rgba(14,26,43,0.35)"; }}
              >
                Share Your Score
              </button>
            </div>
          </div>

          {/* Share card modal */}
          {showShareCard && (
            <div style={{ position: "fixed", inset: 0, zIndex: 10000, background: "rgba(14,26,43,0.60)", backdropFilter: "blur(8px)", WebkitBackdropFilter: "blur(8px)", display: "flex", alignItems: "center", justifyContent: "center", padding: 24 }} onClick={() => setShowShareCard(false)}>
              <div style={{ maxWidth: 620, width: "100%", maxHeight: "90vh", overflow: "auto", borderRadius: 16, background: C.sand, padding: mobile ? 20 : 32, boxShadow: "0 24px 80px rgba(14,26,43,0.25)" }} onClick={(e) => e.stopPropagation()}>
                <ShareableScoreCard
                  score={revealScore}
                  band={revealBand}
                  accessCode={(() => { try { const rec = JSON.parse(sessionStorage.getItem("rp_record") || "{}"); return rec.record_id ? rec.record_id.slice(0, 8).toUpperCase() : ""; } catch { return ""; } })()}
                  industry={(() => { try { return JSON.parse(sessionStorage.getItem("rp_profile") || "{}").industry_sector || ""; } catch { return ""; } })()}
                  name={(() => { try { return JSON.parse(sessionStorage.getItem("rp_profile") || "{}").assessment_title || ""; } catch { return ""; } })()}
                  onClose={() => setShowShareCard(false)}
                />
              </div>
            </div>
          )}

          {/* Model watermark */}
          <div style={{ position: "absolute", bottom: -80, left: "50%", transform: "translateX(-50%)", fontSize: 11, color: "rgba(14,26,43,0.12)", letterSpacing: "0.10em" }}>
            RUNPAYWAY™
          </div>
        </div>
      </div>
    );
  }

  /* ================================================================ */
  /*  Processing screen                                               */
  /* ================================================================ */
  if (showLoading) {
    return (
      <div style={{
        position: "fixed", inset: 0, zIndex: 9999, background: C.sand,
        display: "flex", flexDirection: "column", alignItems: "center", justifyContent: mobile ? "flex-start" : "center",
        overflowX: "hidden", width: "100%", maxWidth: "100vw",
        paddingTop: mobile ? "25vh" : 0,
      }}>
        <style dangerouslySetInnerHTML={{ __html: `${VIEWPORT_LOCK_CSS} @keyframes quoteLoadBar { 0% { width: 0%; } 30% { width: 35%; } 60% { width: 70%; } 90% { width: 92%; } 100% { width: 100%; } }` }} />

        {/* Quote — the hero of this page */}
        <div style={{ maxWidth: 520, padding: mobile ? "0 28px" : "0 32px", textAlign: "center", width: "100%", boxSizing: "border-box" as const }}>
          <div style={{ minHeight: mobile ? 100 : 140, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <div style={{ opacity: quoteFade ? 1 : 0, transition: "opacity 500ms ease" }}>
              <p style={{ fontSize: mobile ? 18 : 22, fontWeight: 300, color: C.navy, lineHeight: 1.5, margin: "0 0 16px", letterSpacing: "-0.01em" }}>
                &ldquo;{LOADING_QUOTES[quoteIdx]?.text}&rdquo;
              </p>
              <span style={{ fontSize: 11, fontWeight: 600, letterSpacing: "0.12em", color: "rgba(75,63,174,0.45)" }}>
                RUNPAYWAY
              </span>
            </div>
          </div>

          {/* Thin progress bar */}
          <div style={{ width: 200, height: 2, borderRadius: 1, background: "rgba(14,26,43,0.06)", margin: "40px auto 24px", overflow: "hidden" }}>
            <div style={{ height: "100%", borderRadius: 1, background: "rgba(75,63,174,0.30)", animation: "quoteLoadBar 4s ease-in-out forwards" }} />
          </div>

          {/* Subtle status */}
          <div style={{ fontSize: 11, color: "rgba(14,26,43,0.25)", letterSpacing: "0.06em" }}>
            {assessmentTitle ? `Building your report for ${assessmentTitle}` : "Building your report"}
          </div>

          {/* Social proof */}
          <div style={{ fontSize: 12, color: "rgba(14,26,43,0.20)", marginTop: 32 }}>
            Deterministic scoring &middot; Version-locked
          </div>
        </div>
      </div>
    );
  }

  /* ================================================================ */
  /*  Review screen — summary before submission                       */
  /* ================================================================ */
  if (showReview) {
    return (
      <div style={{
        position: "fixed", inset: 0, zIndex: 9999, background: C.sand,
        overflowY: "auto", overflowX: "hidden",
        width: "100%", maxWidth: "100vw",
        opacity: reviewExiting ? 0 : 1, transition: "opacity 400ms ease-out",
      }}>
      <style dangerouslySetInnerHTML={{ __html: VIEWPORT_LOCK_CSS }} />
      {showOverlay && (
        <div style={{
          position: "fixed", inset: 0, zIndex: 10000,
          background: C.white,
          display: "flex", flexDirection: "column",
          alignItems: "center", justifyContent: "center",
          animation: "diagFadeIn 300ms ease-out",
          overflowX: "hidden",
        }}>
          <style>{`@keyframes diagFadeIn { from { opacity: 0; } to { opacity: 1; } } @keyframes rp-pulse { 0%, 100% { opacity: 0.3; } 50% { opacity: 1; } }`}</style>
          <Image
            src={logoBlue}
            alt="RunPayway™"
            width={160}
            height={19}
            style={{ height: "auto", animation: "rp-pulse 1.5s ease-in-out infinite" }}
          />
          <div style={{
            marginTop: 20, width: 40, height: 2,
            background: "linear-gradient(90deg, #1F6D7A, #4B3FAE)",
            borderRadius: 1,
          }} />
        </div>
      )}
      {/* Dark branded header */}
      <div style={{ background: C.navy, padding: mobile ? "14px 24px" : "16px 24px", textAlign: "center" }}>
        <div style={{ fontSize: mobile ? 11 : 13, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase" as const, color: C.sandMuted }}>
          Income Stability Score™
        </div>
      </div>
      <div style={{ maxWidth: 860, margin: "0 auto", padding: mobile ? "24px 24px 40px" : "32px 24px 48px", display: "flex", flexDirection: "column", gap: 0, minHeight: "70vh" }}>
        <div style={{ marginBottom: 28 }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 8 }}>
            <div style={{ fontSize: 13, fontWeight: 600, color: C.purple, letterSpacing: "0.08em", textTransform: "uppercase" as const }}>
              Review Your Answers
            </div>
            <span style={{ fontSize: 13, color: C.light, fontFeatureSettings: "'tnum'" }}>
              {Math.floor(elapsed / 60)}:{(elapsed % 60).toString().padStart(2, "0")}
            </span>
          </div>
          <h2 style={{ fontSize: mobile ? 18 : 22, fontWeight: 700, color: C.navy, letterSpacing: "-0.02em", marginBottom: 6 }}>
            Confirm before we generate your score
          </h2>
          <p style={{ fontSize: 14, color: C.muted, lineHeight: 1.6 }}>
            Review each response. Tap any answer to change it.
          </p>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {QUESTIONS.map((question, i) => {
            const selectedLetter = answers[i];
            const selectedOption = question.options.find((o) => o.letter === selectedLetter);
            return (
              <button
                key={i}
                onClick={() => { setShowReview(false); setCurrentQuestion(i); }}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: mobile ? 12 : 16,
                  padding: mobile ? "14px 14px" : "18px 20px",
                  borderRadius: 12,
                  border: "1px solid rgba(14,26,43,0.06)",
                  background: C.white,
                  cursor: "pointer",
                  textAlign: "left",
                  width: "100%",
                  transition: "border-color 160ms ease, box-shadow 160ms ease",
                }}
                onMouseEnter={(e) => { e.currentTarget.style.borderColor = "rgba(75,63,174,0.20)"; e.currentTarget.style.boxShadow = "0 2px 8px rgba(75,63,174,0.06)"; }}
                onMouseLeave={(e) => { e.currentTarget.style.borderColor = "rgba(14,26,43,0.06)"; e.currentTarget.style.boxShadow = "none"; }}
              >
                <div style={{
                  width: 28, height: 28, borderRadius: "50%",
                  background: "rgba(75,63,174,0.06)", color: C.purple,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: 13, fontWeight: 700, flexShrink: 0,
                }}>{question.number}</div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 13, fontWeight: 600, color: C.navy, marginBottom: 2 }}>
                    {question.title}
                  </div>
                  <div style={{ fontSize: 13, color: C.muted, overflow: "hidden", textOverflow: "ellipsis" }}>
                    {selectedOption?.text || "Not answered"}
                  </div>
                </div>
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none" style={{ flexShrink: 0 }}>
                  <path d="M10.5 6.5L13 4L10 1L7.5 3.5M10.5 6.5L4.5 12.5H1V9.5L7.5 3.5M10.5 6.5L7.5 3.5" stroke={C.light} strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
            );
          })}
        </div>

        <div style={{ marginTop: 24, display: "flex", gap: 12, alignItems: "center", justifyContent: mobile ? "center" : "space-between", flexDirection: mobile ? "column-reverse" : "row" }}>
          <button
            onClick={() => { setShowReview(false); setCurrentQuestion(5); }}
            style={{ fontSize: 13, fontWeight: 500, color: C.muted, background: "none", border: "none", cursor: "pointer", padding: "12px 16px", minHeight: 44 }}
          >
            Back to questions
          </button>
          <button
            className="cta-tick"
            onClick={handleSubmit}
            disabled={!allAnswered || submitting}
            style={{
              height: 48, paddingLeft: 28, paddingRight: 28, borderRadius: 12,
              background: !allAnswered || submitting ? "rgba(14,26,43,0.08)" : C.purple,
              color: !allAnswered || submitting ? C.light : C.white,
              fontSize: 15, fontWeight: 600, border: "none",
              cursor: !allAnswered || submitting ? "not-allowed" : "pointer",
              boxShadow: allAnswered && !submitting ? "0 6px 16px rgba(75,63,174,0.25)" : "none",
              transition: "background 180ms ease",
              width: mobile ? "100%" : "auto",
            }}
          >
            <span className="tick tick-white" />
            {submitting ? "Processing..." : "Confirm & Generate Score"}
          </button>
        </div>

        {error && (
          <div role="alert" aria-live="polite" style={{ marginTop: 12, padding: "12px 16px", borderRadius: 10, background: "rgba(220,38,38,0.06)", border: "1px solid rgba(220,38,38,0.12)" }}>
            <p style={{ fontSize: 13, color: "#DC2626" }}>{error}</p>
          </div>
        )}
      </div>
      </div>
    );
  }

  /* ================================================================ */
  /*  Diagnostic instrument                                           */
  /* ================================================================ */
  return (
    <div ref={scrollRef} style={{
      position: "fixed", inset: 0, zIndex: 9999,
      background: C.sand,
      overflowY: "auto",
      overflowX: "hidden",
      width: "100%",
      maxWidth: "100vw",
      WebkitOverflowScrolling: "touch",
    }}>
    <style dangerouslySetInnerHTML={{ __html: VIEWPORT_LOCK_CSS }} />
    {showOverlay && (
      <div style={{
        position: "fixed", inset: 0, zIndex: 10000,
        background: C.white,
        display: "flex", flexDirection: "column",
        alignItems: "center", justifyContent: "center",
        overflowX: "hidden",
        animation: "diagFadeIn 300ms ease-out",
      }}>
        <style>{`@keyframes diagFadeIn { from { opacity: 0; } to { opacity: 1; } } @keyframes rp-pulse { 0%, 100% { opacity: 0.3; } 50% { opacity: 1; } }`}</style>
        <Image
          src={logoBlue}
          alt="RunPayway™"
          width={160}
          height={19}
          style={{ height: "auto", animation: "rp-pulse 1.5s ease-in-out infinite" }}
        />
        <div style={{
          marginTop: 20, width: 40, height: 2,
          background: "linear-gradient(90deg, #1F6D7A, #4B3FAE)",
          borderRadius: 1,
        }} />
      </div>
    )}
    {/* Dark branded header */}
    <div style={{ background: C.navy, padding: mobile ? "14px 24px" : "16px 24px", textAlign: "center" }}>
      <div style={{ fontSize: mobile ? 11 : 13, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase" as const, color: C.sandMuted }}>
        Income Stability Score™
      </div>
    </div>
    <div style={{ maxWidth: 860, margin: "0 auto", padding: mobile ? "20px 24px 40px" : "28px 24px 48px", display: "flex", flexDirection: "column", gap: 0, minHeight: "70vh", opacity: entered ? 1 : 0, transform: entered ? "translateY(0)" : "translateY(12px)", transition: "opacity 500ms ease-out, transform 500ms ease-out" }}>
      {/* Step breadcrumb */}
      <div style={{ marginBottom: 16, marginTop: 4 }}>
        <StepBreadcrumb activeStep={2} completedSteps={[1]} />
      </div>

      {/* Time estimate — only on first question */}
      {currentQuestion === 0 && (
        <div style={{ fontSize: 13, color: "rgba(14,26,43,0.35)", textAlign: "center", marginBottom: 16 }}>
          6 structural factors &middot; About 90 seconds
        </div>
      )}

      {/* Progress bar */}
      <div style={{ width: "100%", marginBottom: 20 }}>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
          <span style={{ fontSize: 12, fontWeight: 600, color: "rgba(14,26,43,0.40)" }}>Question {currentQuestion + 1} of {QUESTIONS.length}</span>
          <span style={{ fontSize: 12, fontWeight: 600, color: "#1F6D7A" }}>{Math.round(((currentQuestion + 1) / QUESTIONS.length) * 100)}%</span>
        </div>
        <div style={{ height: 4, borderRadius: 2, backgroundColor: "rgba(14,26,43,0.06)", overflow: "hidden" }}>
          <div style={{ height: "100%", borderRadius: 2, backgroundColor: "#1F6D7A", width: `${((currentQuestion + 1) / QUESTIONS.length) * 100}%`, transition: "width 400ms ease" }} />
        </div>
      </div>

      {/* Top bar — factor label + progress */}
      <div style={{ marginBottom: mobile ? 20 : 28 }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
          <div>
            <div style={{ fontSize: 13, fontWeight: 600, color: C.purple, letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 4 }}>
              Question {q.number} of 6
            </div>
            <div style={{ fontSize: 13, color: C.light }}>
              Based on your previous 12 months
            </div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 12, flexShrink: 0 }}>
            <span style={{ fontSize: 13, color: C.light, fontFeatureSettings: "'tnum'", whiteSpace: "nowrap" }}>
              {Math.floor(elapsed / 60)}:{(elapsed % 60).toString().padStart(2, "0")}
            </span>
          </div>
        </div>

        {/* Progress bar */}
        <div style={{ display: "flex", gap: 4, width: "100%", overflow: "hidden" }}>
          {QUESTIONS.map((_, i) => (
            <button
              key={i}
              onClick={() => answers[i] !== null && goTo(i)}
              style={{
                flex: 1,
                height: 4,
                borderRadius: 2,
                border: "none",
                padding: 0,
                cursor: answers[i] !== null ? "pointer" : "default",
                background: answers[i] !== null
                  ? C.purple
                  : i === currentQuestion
                    ? "rgba(75,63,174,0.35)"
                    : "rgba(14,26,43,0.08)",
                transition: "background 300ms ease",
              }}
            />
          ))}
        </div>

        {/* Commitment escalation — halfway message */}
        {currentQuestion >= 3 && !allAnswered && (
          <div style={{ marginTop: 10, display: "flex", alignItems: "center", gap: 6 }}>
            <div style={{ width: 5, height: 5, borderRadius: 99, background: C.teal }} />
            <span style={{ fontSize: 13, fontWeight: 500, color: C.teal }}>
              {currentQuestion === 3 ? "Halfway there — your score is being calculated." : currentQuestion === 4 ? "Almost done — one factor remaining." : "All factors captured — ready to generate."}
            </span>
          </div>
        )}
      </div>

      {/* Question card */}
      <div
        style={{
          background: C.white,
          borderRadius: 16,
          border: "1px solid rgba(14,26,43,0.06)",
          padding: mobile ? "24px 24px" : "32px 28px",
          flex: 1,
          display: "flex",
          flexDirection: "column",
          opacity: transitioning ? 0 : 1,
          transform: transitioning ? "translateX(-20px)" : "translateX(0)",
          transition: "opacity 250ms ease, transform 250ms ease",
        }}
      >
        {/* Factor title */}
        <h2 style={{ fontSize: mobile ? 18 : 20, fontWeight: 700, color: C.navy, letterSpacing: "-0.02em", marginBottom: 12 }}>
          {q.title}
        </h2>

        {/* Question prompt */}
        <p style={{ fontSize: mobile ? 14 : 15, color: C.muted, lineHeight: 1.7, marginBottom: 8 }}>
          {q.prompt}
        </p>

        {/* Examples */}
        {q.examples && (
          <div style={{ marginBottom: 8 }}>
            <span style={{ fontSize: 13, fontWeight: 600, color: C.light }}>Examples: </span>
            <span style={{ fontSize: 13, color: C.light }}>{q.examples.join(", ")}</span>
          </div>
        )}

        {/* Note */}
        {q.note && (
          <p style={{ fontSize: 13, color: C.light, fontStyle: "italic", marginBottom: 8 }}>
            {q.note}
          </p>
        )}

        {/* Options */}
        <div role="radiogroup" aria-label={q.title} style={{ display: "flex", flexDirection: "column", gap: 8, marginTop: 16, flex: 1 }}>
          {q.options.map((opt) => {
            const isSelected = selected === opt.letter;
            return (
              <button
                key={opt.letter}
                role="radio"
                aria-checked={isSelected}
                aria-label={`${opt.letter}: ${opt.text}`}
                onClick={() => !transitioning && selectAnswer(opt.letter)}
                disabled={transitioning}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: mobile ? 12 : 16,
                  padding: mobile ? "14px 14px" : "16px 20px",
                  borderRadius: 12,
                  border: `1px solid ${isSelected ? C.purple : "rgba(14,26,43,0.08)"}`,
                  background: isSelected ? "rgba(75,63,174,0.04)" : C.white,
                  cursor: transitioning ? "default" : "pointer",
                  textAlign: "left",
                  transition: "border-color 160ms ease, background 160ms ease, transform 120ms ease",
                  width: "100%",
                  pointerEvents: transitioning ? "none" : "auto",
                  touchAction: "manipulation",
                  WebkitTapHighlightColor: "transparent",
                  userSelect: "none",
                }}
              >
                {/* Selection indicator */}
                <div
                  style={{
                    width: 22,
                    height: 22,
                    borderRadius: "50%",
                    border: `2px solid ${isSelected ? C.purple : "rgba(14,26,43,0.15)"}`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                    transition: "border-color 160ms ease",
                  }}
                >
                  {isSelected && (
                    <div style={{ width: 10, height: 10, borderRadius: "50%", background: C.purple }} />
                  )}
                </div>

                {/* Option text */}
                <span style={{ fontSize: mobile ? 14 : 15, fontWeight: isSelected ? 600 : 400, color: isSelected ? C.navy : C.muted, transition: "color 160ms ease" }}>
                  {opt.text}
                </span>

                {/* Selected check */}
                {isSelected && (
                  <svg style={{ marginLeft: "auto", flexShrink: 0 }} width="16" height="12" viewBox="0 0 16 12" fill="none">
                    <path d="M1 6L5.5 10.5L15 1" stroke={C.purple} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                )}
              </button>
            );
          })}
        </div>

        {/* Definition */}
        {q.definition && (
          <div style={{ marginTop: 20, paddingTop: 16, borderTop: "1px solid rgba(14,26,43,0.06)" }}>
            <p style={{ fontSize: 13, color: C.light, lineHeight: 1.65 }}>
              {q.definition}
            </p>
          </div>
        )}
      </div>

      {/* Navigation */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginTop: 20,
          paddingTop: 16,
        }}
      >
        <button
          onClick={() => {
            if (currentQuestion === 0) {
              router.push("/diagnostic-portal");
            } else {
              goTo(currentQuestion - 1);
            }
          }}
          style={{
            fontSize: 13,
            fontWeight: 500,
            color: C.muted,
            background: "none",
            border: "none",
            cursor: "pointer",
            padding: "8px 0",
            transition: "color 160ms ease",
          }}
        >
          {currentQuestion === 0 ? "Back to profile" : "Previous"}
        </button>

        <div style={{ display: "flex", gap: 12 }}>
          {currentQuestion < 5 && (
            <button
              onClick={() => goTo(Math.min(5, currentQuestion + 1))}
              disabled={selected === null}
              style={{
                height: 44,
                paddingLeft: mobile ? 24 : 24,
                paddingRight: mobile ? 24 : 24,
                borderRadius: 10,
                background: selected === null ? "rgba(14,26,43,0.08)" : C.navy,
                color: selected === null ? C.light : C.white,
                fontSize: 14,
                fontWeight: 600,
                border: "none",
                cursor: selected === null ? "not-allowed" : "pointer",
                transition: "background 180ms ease",
              }}
            >
              Next Factor
            </button>
          )}

          {currentQuestion === 5 && (
            <button
              onClick={() => {
                setTransitioning(true);
                setShowOverlay(true);
                setTimeout(() => {
                  setShowReview(true);
                  setTransitioning(false);
                  setTimeout(() => setShowOverlay(false), 300);
                }, 1500);
              }}
              disabled={!allAnswered}
              style={{
                height: 48,
                paddingLeft: mobile ? 22 : 28,
                paddingRight: mobile ? 22 : 28,
                borderRadius: 12,
                background: !allAnswered ? "rgba(14,26,43,0.08)" : C.purple,
                color: !allAnswered ? C.light : C.white,
                fontSize: 15,
                fontWeight: 600,
                border: "none",
                cursor: !allAnswered ? "not-allowed" : "pointer",
                boxShadow: allAnswered ? "0 6px 16px rgba(75,63,174,0.25)" : "none",
                transition: "background 180ms ease",
              }}
            >
              Review Answers
            </button>
          )}
        </div>
      </div>

      {error && (
        <div
          role="alert"
          aria-live="polite"
          style={{
            marginTop: 16,
            padding: "14px 20px",
            borderRadius: 12,
            background: "rgba(220,38,38,0.06)",
            border: "1px solid rgba(220,38,38,0.14)",
            fontSize: 14,
            color: "#DC2626",
          }}
        >
          {error}
        </div>
      )}
    </div>
    </div>
  );
}
