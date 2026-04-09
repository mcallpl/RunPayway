"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import logoBlue from "../../../../public/runpayway-logo-blue.png";
import { C, mono, sans } from "@/lib/design-tokens";
import { trackAssessmentComplete } from "@/lib/analytics";
// Dynamic imports — loaded at runtime only (prevents static export bundling issues with zod/crypto)
const loadV2Engine = () => import("@/lib/client-engine-v2");
const loadAdapter = () => import("@/lib/v2-to-v1-adapter");

/* ------------------------------------------------------------------ */
/*  Data                                                               */
/* ------------------------------------------------------------------ */

const ANSWER_MAP: Record<string, number> = {
  A: 0, B: 25, C: 50, D: 75, E: 100,
};

const STORAGE_KEY = "runpayway_diagnostic_state";

/** Fetch with timeout — prevents page hang if Worker is slow */
function fetchWithTimeout(url: string, opts: RequestInit, timeoutMs = 15000): Promise<Response> {
  return Promise.race([
    fetch(url, opts),
    new Promise<Response>((_, reject) => setTimeout(() => reject(new Error("Timeout")), timeoutMs)),
  ]);
}

interface Question {
  number: number;
  title: string;
  prompt: string;
  examples?: string[];
  note?: string;
  definition?: string;
  options: { letter: string; text: string }[];
}

const QUESTIONS: Question[] = [
  {
    number: 1,
    title: "Recurring Revenue Base",
    prompt: "What percentage of your income renews automatically through an existing agreement or subscription?",
    examples: ["subscription services", "contract retainers", "licensing or royalty income", "recurring service agreements"],
    definition: "Recurring income renews without requiring new client acquisition.",
    options: [
      { letter: "A", text: "0–10%" },
      { letter: "B", text: "11–30%" },
      { letter: "C", text: "31–60%" },
      { letter: "D", text: "61–85%" },
      { letter: "E", text: "86–100%" },
    ],
  },
  {
    number: 2,
    title: "Income Source Diversification",
    prompt: "Over the previous 12 months, how spread out was your income across different sources?",
    examples: ["employer", "client", "contract group", "asset category"],
    note: "Think about how much of your total income depended on any single source.",
    options: [
      { letter: "A", text: "Almost all from one source (90–100%)" },
      { letter: "B", text: "Mostly from one source (70–89%)" },
      { letter: "C", text: "About half from one source (50–69%)" },
      { letter: "D", text: "Spread across a few sources (30–49% from largest)" },
      { letter: "E", text: "Well diversified (under 30% from any single source)" },
    ],
  },
  {
    number: 3,
    title: "Income Source Count",
    prompt: "Over the previous 12 months, how many separate income sources each contributed at least 10% of your total income?",
    note: "Only count sources that contributed 10% or more.",
    options: [
      { letter: "A", text: "1" },
      { letter: "B", text: "2" },
      { letter: "C", text: "3–4" },
      { letter: "D", text: "5–7" },
      { letter: "E", text: "8 or more" },
    ],
  },
  {
    number: 4,
    title: "Forward Revenue Visibility",
    prompt: "How many months of future income are currently secured under signed or enforceable agreements?",
    note: "Only include income that is already contractually committed.",
    options: [
      { letter: "A", text: "Less than 1 month" },
      { letter: "B", text: "1–2 months" },
      { letter: "C", text: "3–5 months" },
      { letter: "D", text: "6–11 months" },
      { letter: "E", text: "12 or more months" },
    ],
  },
  {
    number: 5,
    title: "Earnings Consistency",
    prompt: "Over the previous 12 months, how consistent was your monthly income?",
    note: "Compare your highest and lowest earning months relative to your average.",
    options: [
      { letter: "A", text: "Very inconsistent (fluctuated more than 75%)" },
      { letter: "B", text: "Inconsistent (fluctuated 50–75%)" },
      { letter: "C", text: "Somewhat consistent (fluctuated 25–49%)" },
      { letter: "D", text: "Mostly consistent (fluctuated 10–24%)" },
      { letter: "E", text: "Very consistent (fluctuated less than 10%)" },
    ],
  },
  {
    number: 6,
    title: "Income Without Active Work",
    prompt: "If you stopped working for 90 consecutive days, what percentage of your income would continue automatically?",
    examples: ["subscriptions", "contract retainers", "royalties", "asset distributions"],
    definition: "Income that continues without new work, client acquisition, or active servicing.",
    options: [
      { letter: "A", text: "0%" },
      { letter: "B", text: "1–25%" },
      { letter: "C", text: "26–50%" },
      { letter: "D", text: "51–75%" },
      { letter: "E", text: "76–100%" },
    ],
  },
];

const FIELD_MAP = [
  "recurring_income_proportion",
  "income_concentration",
  "number_of_income_sources",
  "forward_revenue_visibility",
  "earnings_variability",
  "income_continuity_without_active_labor",
];

const PROCESSING_STEPS = [
  "Evaluating structural factors",
  "Calculating pillar scores",
  "Applying classification framework",
  "Generating stability diagnosis",
  "Compiling assessment record",
];

const LOADING_QUOTES = [
  { text: "Income stability is not about how much you earn. It is about how your income is structured.", attr: "RunPayway" },
  { text: "The professionals who weather disruptions are the ones who built recurring revenue before they needed it.", attr: "RunPayway" },
  { text: "Your income has an architecture. Most people have never seen the blueprint.", attr: "RunPayway" },
  { text: "One client at 60% of revenue is not a business relationship. It is a structural dependency.", attr: "RunPayway" },
  { text: "The difference between a $50K year and a $50K year is whether you knew it was coming.", attr: "RunPayway" },
  { text: "Stability is not the absence of risk. It is the presence of structure.", attr: "RunPayway" },
  { text: "Every income has a fragility score. Most people discover theirs after a disruption.", attr: "RunPayway" },
  { text: "The goal is not to eliminate active income. It is to ensure it is not the only kind you have.", attr: "RunPayway" },
  { text: "Forward visibility is the single most undervalued metric in personal finance.", attr: "RunPayway" },
  { text: "Your competitors are not other businesses. Your competitor is structural vulnerability.", attr: "RunPayway" },
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
  html, body { overflow-x: hidden !important; width: 100% !important; max-width: 100vw !important; }
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

  // Mobile detection
  const [mobile, setMobile] = useState(false);
  // Resume prompt — ask user before restoring old session
  const [showResumePrompt, setShowResumePrompt] = useState(false);
  const savedAnswersCacheRef = useRef<(string | null)[] | null>(null);
  // Final card — shows after API work completes, before report
  const [showFinalCard, setShowFinalCard] = useState(false);
  const [finalCardPhase, setFinalCardPhase] = useState(0);
  // Track API completion for loading screen
  const apiDoneRef = useRef(false);

  // Mobile breakpoint detection
  useEffect(() => {
    const check = () => setMobile(window.innerWidth < 640);
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
    // Check for saved answers — prompt user instead of silently restoring
    const saved = loadAnswersFromStorage();
    if (saved && saved.length === 6 && saved.some((a) => a !== null)) {
      savedAnswersCacheRef.current = saved;
      setShowResumePrompt(true);
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

  // Resume prompt handlers
  const handleResumeContinue = useCallback(() => {
    const saved = savedAnswersCacheRef.current;
    if (saved) {
      setAnswers(saved);
      const firstUnanswered = saved.findIndex((a) => a === null);
      if (firstUnanswered >= 0) setCurrentQuestion(firstUnanswered);
      else setCurrentQuestion(5);
    }
    setShowResumePrompt(false);
  }, []);

  const handleResumeStartFresh = useCallback(() => {
    clearAnswerStorage();
    savedAnswersCacheRef.current = null;
    setAnswers(Array(6).fill(null));
    setCurrentQuestion(0);
    setShowResumePrompt(false);
  }, []);

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
      return next;
    });

    if (currentQuestion < 5) {
      // Auto-advance after selection (except last question)
      setTimeout(() => {
        scrollRef.current?.scrollTo({ top: 0 }); // Reset scroll before showing next question
        setCurrentQuestion((prev) => Math.min(5, prev + 1));
        setTimeout(() => setTransitioning(false), 350);
      }, 550);
    } else {
      // Last question — auto-advance to review
      setTimeout(() => {
        setTransitioning(false);
        setShowReview(true);
      }, 550);
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

    const profile = JSON.parse(sessionStorage.getItem("rp_profile") || "{}");
    const inputs: Record<string, number> = {};
    for (let i = 0; i < 6; i++) {
      inputs[FIELD_MAP[i]] = ANSWER_MAP[answers[i]!];
    }

    // Load v2 engine modules dynamically
    const { convertV1InputsToV2, convertV1ProfileToV2, executeClientEngineV2 } = await loadV2Engine();
    const { adaptV2ToV1 } = await loadAdapter();

    // Build v2 raw inputs (answer choices A-E)
    const rawInputsV2 = convertV1InputsToV2(inputs);
    const profileV2 = convertV1ProfileToV2(profile);

    setSubmitting(true);
    setError(null);

    // Show loading screen with quotes IMMEDIATELY
    setAssessmentTitle(profile.assessment_title || "");
    setShowLoading(true);
    apiDoneRef.current = false;
    const loadingStartTime = Date.now();

    try {
      let record;
      try {
        // Try v2 server-side scoring first
        const purchaseSession = JSON.parse(sessionStorage.getItem("rp_purchase_session") || "{}");
        const payloadBody: Record<string, unknown> = {
          raw_inputs: rawInputsV2,
          profile: profileV2,
        };
        if (purchaseSession.payment_token) {
          payloadBody._payment_token = purchaseSession.payment_token;
          payloadBody._payment_payload = {
            plan_key: purchaseSession.plan_key,
            timestamp: purchaseSession.token_timestamp,
            nonce: purchaseSession.token_nonce,
            expires_at: purchaseSession.token_expires_at,
          };
        }
        const res = await fetch("/api/v2/score", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payloadBody),
        });
        if (res.ok) {
          record = adaptV2ToV1(await res.json());
        } else {
          throw new Error("Server unavailable");
        }
      } catch {
        // Client-side v2 fallback
        const v2Result = await executeClientEngineV2({ profile, inputs });
        record = adaptV2ToV1(v2Result);
      }
      // Override assessment_title with user-entered value from profile
      if (profile.assessment_title) {
        (record as Record<string, unknown>).assessment_title = profile.assessment_title;
      }

      // Generate PressureMap via Cloudflare Worker proxy (API key secured server-side)
      try {
        const adapted = record as Record<string, unknown>;
        const v2Data = (adapted._v2 || {}) as Record<string, unknown>;
        const ni = (v2Data.normalized_inputs || {}) as Record<string, unknown>;
        const constraints = ((v2Data.constraints || {}) as Record<string, unknown>);
        const topConstraint = (Array.isArray(constraints.ranked) && constraints.ranked.length > 0)
          ? constraints.ranked[0] as Record<string, string>
          : { factor: "recurrence", label: "Recurring Revenue" };

        const pmRes = await fetchWithTimeout("https://runpayway-pressuremap.mcallpl.workers.dev", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            industry: profile.industry_sector || "",
            operating_structure: profile.operating_structure || "",
            income_model: profile.primary_income_model || "",
            years_in_structure: profile.years_in_structure || "",
            score: (adapted.final_score as number) || 0,
            band: (adapted.stability_band as string) || "",
            weakest_factor: topConstraint.factor || topConstraint.label || "",
            weakest_factor_value: topConstraint.label || "",
            recurrence_pct: (ni.income_persistence_pct as number) || 0,
            concentration_pct: (ni.largest_source_pct as number) || 0,
            forward_visibility_pct: (ni.forward_secured_pct as number) || 0,
            labor_dependence_pct: (ni.labor_dependence_pct as number) || 0,
            variability_level: (ni.income_variability_level as string) || "moderate",
          }),
        });

        if (pmRes.ok) {
          const parsed = await pmRes.json();
          if (parsed.pressure && parsed.tailwind && parsed.leverage_move) {
            (record as Record<string, unknown>).pressure_map = {
              generated_at: new Date().toISOString(),
              industry: profile.industry_sector || "",
              operating_structure: profile.operating_structure || "",
              income_model: profile.primary_income_model || "",
              pressure: parsed.pressure,
              tailwind: parsed.tailwind,
              leverage_move: parsed.leverage_move,
            };
          } else {
            console.error("PressureMap response incomplete:", parsed);
          }
        } else {
          const errText = await pmRes.text();
          console.error("PressureMap Worker error:", pmRes.status, errText);
        }
      } catch (pmErr) { console.error("PressureMap fetch failed:", pmErr); }

      // Generate "In Plain English" via Claude Worker
      try {
        const adapted2 = record as Record<string, unknown>;
        const v2Data2 = (adapted2._v2 || {}) as Record<string, unknown>;
        const ni2 = (v2Data2.normalized_inputs || {}) as Record<string, number | string>;
        const constraints2 = (v2Data2.constraints || {}) as Record<string, unknown>;
        const topC2 = (Array.isArray(constraints2.ranked) && constraints2.ranked.length > 0)
          ? (constraints2.ranked[0] as Record<string, string>).factor || "recurrence"
          : "recurrence";

        const peRes = await fetchWithTimeout("https://runpayway-pressuremap.mcallpl.workers.dev/plain-english", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            industry: profile.industry_sector || "",
            operating_structure: profile.operating_structure || "",
            income_model: profile.primary_income_model || "",
            years_in_structure: profile.years_in_structure || "",
            score: (adapted2.final_score as number) || 0,
            band: (adapted2.stability_band as string) || "",
            weakest_factor: topC2,
            recurrence_pct: (ni2.income_persistence_pct as number) || 0,
            concentration_pct: (ni2.largest_source_pct as number) || 0,
            forward_visibility_pct: (ni2.forward_secured_pct as number) || 0,
            labor_dependence_pct: (ni2.labor_dependence_pct as number) || 0,
            variability_level: (ni2.income_variability_level as string) || "moderate",
            active_income: (record as Record<string, unknown>).active_income_level || 0,
            continuity_months: (record as Record<string, unknown>).income_continuity_months || 0,
            risk_drop: (record as Record<string, unknown>).risk_scenario_drop || 0,
          }),
        });
        if (peRes.ok) {
          const peData = await peRes.json();
          if (peData.interpretation) {
            const expl = (v2Data2.explainability || {}) as Record<string, unknown>;
            expl.why_this_score = peData.interpretation;
            if (peData.why_not_higher) expl.why_not_higher = peData.why_not_higher;
            (v2Data2 as Record<string, unknown>).explainability = expl;
          }
        }
      } catch { /* Plain English generation failed — report uses template */ }

      // Generate Action Plan via Claude Worker
      try {
        const adapted3 = record as Record<string, unknown>;
        const v2Data3 = (adapted3._v2 || {}) as Record<string, unknown>;
        const ni3 = (v2Data3.normalized_inputs || {}) as Record<string, number | string>;
        const constraints3 = (v2Data3.constraints || {}) as Record<string, unknown>;
        const topC3 = (Array.isArray(constraints3.ranked) && constraints3.ranked.length > 0)
          ? (constraints3.ranked[0] as Record<string, string>).factor || "recurrence"
          : "recurrence";
        const lift3 = v2Data3.score_lift_projection as Record<string, unknown> | undefined;
        const topLift = lift3?.highest_single_lift as Record<string, unknown> | undefined;

        const apRes = await fetchWithTimeout("https://runpayway-pressuremap.mcallpl.workers.dev/action-plan", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            industry: profile.industry_sector || "",
            operating_structure: profile.operating_structure || "",
            income_model: profile.primary_income_model || "",
            years_in_structure: profile.years_in_structure || "",
            score: (adapted3.final_score as number) || 0,
            band: (adapted3.stability_band as string) || "",
            weakest_factor: topC3,
            recurrence_pct: (ni3.income_persistence_pct as number) || 0,
            concentration_pct: (ni3.largest_source_pct as number) || 0,
            forward_visibility_pct: (ni3.forward_secured_pct as number) || 0,
            labor_dependence_pct: (ni3.labor_dependence_pct as number) || 0,
            variability_level: (ni3.income_variability_level as string) || "moderate",
            active_income: adapted3.active_income_level || 0,
            continuity_months: adapted3.income_continuity_months || 0,
            risk_drop: adapted3.risk_scenario_drop || 0,
            top_change: topLift?.label || "",
            projected_lift: topLift ? `${topLift.original_score} to ${topLift.projected_score} (+${topLift.lift})` : "",
          }),
        });
        if (apRes.ok) {
          const apData = await apRes.json();
          if (apData.primary_action) {
            (v2Data3 as Record<string, unknown>).ai_action_plan = apData;
          }
        }
      } catch { /* Action plan generation failed — report uses template */ }

      sessionStorage.setItem("rp_record", JSON.stringify(record));
      localStorage.setItem("rp_record", JSON.stringify(record));

      // Save record to cloud database (D1 via Worker)
      try {
        const recAdapted = record as Record<string, unknown>;
        await fetchWithTimeout("https://runpayway-pressuremap.mcallpl.workers.dev/save-record", {
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
          }),
        });
      } catch { /* Cloud save failed — local storage still works */ }

      // Send report email if customer has an email address
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
          await fetchWithTimeout("https://runpayway-pressuremap.mcallpl.workers.dev/send-email", {
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
            }),
          });
        }
      } catch { /* Email send failed — non-blocking */ }

      // Persist record for lookup (v1-adapted field names)
      const stored = JSON.parse(localStorage.getItem("rp_records") || "[]");
      const adapted = record as Record<string, unknown>;
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

      // API work is done — ensure minimum 5s of quote display, then show final card
      apiDoneRef.current = true;
      const elapsedMs = Date.now() - loadingStartTime;
      const remainingMs = Math.max(0, 3000 - elapsedMs);

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
            // Free users: go straight to free-score
            router.push("/free-score");
            return;
          }
          // Paid users: go straight to score reveal
          try {
            const rec = JSON.parse(sessionStorage.getItem("rp_record") || "{}");
            setRevealScore(rec.final_score || 0);
            setRevealBand(rec.stability_band || "");
          } catch { /* */ }
          setShowLoading(false);
          setShowReveal(true);
        }, 600);
      }, remainingMs);

    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Submission failed";
      setError(message);
      setSubmitting(false);
      setShowLoading(false);
    }
  };

  /* ================================================================ */
  /*  Resume prompt — pick up where you left off                       */
  /* ================================================================ */
  if (showResumePrompt) {
    const answeredCount = savedAnswersCacheRef.current?.filter((a) => a !== null).length || 0;
    // Show how long ago the session was saved
    const savedAgo = (() => {
      try {
        const raw = localStorage.getItem(STORAGE_KEY) || sessionStorage.getItem(STORAGE_KEY);
        if (!raw) return "";
        const { savedAt } = JSON.parse(raw);
        if (!savedAt) return "";
        const mins = Math.floor((Date.now() - savedAt) / 60000);
        if (mins < 1) return "just now";
        if (mins === 1) return "1 minute ago";
        if (mins < 60) return `${mins} minutes ago`;
        return `${Math.floor(mins / 60)} hour${Math.floor(mins / 60) > 1 ? "s" : ""} ago`;
      } catch { return ""; }
    })();
    return (
      <div style={{
        position: "fixed", inset: 0, zIndex: 9999,
        background: C.sand,
        display: "flex", alignItems: "center", justifyContent: "center",
        overflowX: "hidden", width: "100%", maxWidth: "100vw",
      }}>
        <style dangerouslySetInnerHTML={{ __html: VIEWPORT_LOCK_CSS }} />
        <div style={{ maxWidth: 420, padding: "0 24px", textAlign: "center" }}>
          <div style={{ width: 48, height: 48, borderRadius: 12, background: "rgba(75,63,174,0.08)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 20px" }}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
              <path d="M12 8v4l3 3" stroke={C.purple} strokeWidth="2" strokeLinecap="round" />
              <circle cx="12" cy="12" r="9" stroke={C.purple} strokeWidth="2" />
            </svg>
          </div>
          <h2 style={{ fontSize: 20, fontWeight: 700, color: C.navy, marginBottom: 8, letterSpacing: "-0.02em" }}>
            Welcome back
          </h2>
          <p style={{ fontSize: 14, color: C.muted, lineHeight: 1.6, marginBottom: 28 }}>
            You have {answeredCount} of 6 questions answered{savedAgo ? ` from ${savedAgo}` : " from a recent session"}. Would you like to pick up where you left off?
          </p>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            <button
              onClick={handleResumeContinue}
              style={{
                height: 48, borderRadius: 12,
                background: C.purple, color: C.white,
                fontSize: 15, fontWeight: 600, border: "none",
                cursor: "pointer", fontFamily: sans,
                boxShadow: "0 4px 16px rgba(75,63,174,0.25)",
              }}
            >
              Continue where I left off
            </button>
            <button
              onClick={handleResumeStartFresh}
              style={{
                height: 44, borderRadius: 10,
                background: "none", color: C.muted,
                fontSize: 14, fontWeight: 500, border: "1px solid rgba(14,26,43,0.10)",
                cursor: "pointer", fontFamily: sans,
              }}
            >
              Start fresh
            </button>
          </div>
        </div>
      </div>
    );
  }

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
              Your full diagnosis and action plan are ready.
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
          </div>

          {/* Model watermark */}
          <div style={{ position: "absolute", bottom: -80, left: "50%", transform: "translateX(-50%)", fontSize: 11, color: "rgba(14,26,43,0.12)", letterSpacing: "0.10em" }}>
            RUNPAYWAY&#8482;
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
        <div style={{ maxWidth: 520, padding: mobile ? "0 20px" : "0 32px", textAlign: "center", width: "100%" }}>
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
            {assessmentTitle ? `Generating diagnosis for ${assessmentTitle}` : "Generating your diagnosis"}
          </div>

          {/* Social proof */}
          <div style={{ fontSize: 12, color: "rgba(14,26,43,0.20)", marginTop: 32 }}>
            Deterministic scoring &middot; Version-locked &middot; Model RP-2.0
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
      <div style={{ background: C.navy, padding: mobile ? "14px 16px" : "16px 24px", textAlign: "center" }}>
        <div style={{ fontSize: mobile ? 11 : 13, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase" as const, color: C.sandMuted }}>
          Income Stability Score&#8482; &middot; Model RP-2.0
        </div>
      </div>
      <div style={{ maxWidth: 860, margin: "0 auto", padding: mobile ? "24px 16px 40px" : "32px 24px 48px", display: "flex", flexDirection: "column", gap: 0, minHeight: "70vh" }}>
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
            style={{ fontSize: 13, fontWeight: 500, color: C.muted, background: "none", border: "none", cursor: "pointer", padding: "8px 0" }}
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
    <div style={{ background: C.navy, padding: mobile ? "14px 16px" : "16px 24px", textAlign: "center" }}>
      <div style={{ fontSize: mobile ? 11 : 13, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase" as const, color: C.sandMuted }}>
        Income Stability Score&#8482;
      </div>
    </div>
    <div style={{ maxWidth: 860, margin: "0 auto", padding: mobile ? "20px 16px 40px" : "28px 24px 48px", display: "flex", flexDirection: "column", gap: 0, minHeight: "70vh", opacity: entered ? 1 : 0, transform: entered ? "translateY(0)" : "translateY(12px)", transition: "opacity 500ms ease-out, transform 500ms ease-out" }}>
      {/* Step breadcrumb */}
      <div style={{ marginBottom: 16, marginTop: 4 }}>
        <StepBreadcrumb activeStep={2} completedSteps={[1]} />
      </div>

      {/* Time estimate — only on first question */}
      {currentQuestion === 0 && (
        <div style={{ fontSize: 13, color: "rgba(14,26,43,0.35)", textAlign: "center", marginBottom: 16 }}>
          6 questions &middot; About 90 seconds
        </div>
      )}

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
          padding: mobile ? "24px 18px" : "32px 28px",
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
                paddingLeft: mobile ? 20 : 24,
                paddingRight: mobile ? 20 : 24,
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
