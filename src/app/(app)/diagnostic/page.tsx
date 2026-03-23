"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
// Dynamic imports — loaded at runtime only (prevents static export bundling issues with zod/crypto)
const loadV2Engine = () => import("@/lib/client-engine-v2");
const loadAdapter = () => import("@/lib/v2-to-v1-adapter");

/* ------------------------------------------------------------------ */
/*  Brand tokens                                                       */
/* ------------------------------------------------------------------ */

const B = {
  navy: "#0E1A2B",
  purple: "#4B3FAE",
  teal: "#1F6D7A",
  sand: "#F7F6F3",
  sandDk: "#EDECEA",
  muted: "#6B7280",
  light: "#9CA3AF",
  gradient: "linear-gradient(135deg, #0E1A2B 0%, #4B3FAE 50%, #1F6D7A 100%)",
};

/* ------------------------------------------------------------------ */
/*  Data                                                               */
/* ------------------------------------------------------------------ */

const ANSWER_MAP: Record<string, number> = {
  A: 0, B: 25, C: 50, D: 75, E: 100,
};

const STORAGE_KEY = "runpayway_diagnostic_state";
const STORAGE_EXPIRY_DAYS = 7;

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

/* ------------------------------------------------------------------ */
/*  Storage                                                            */
/* ------------------------------------------------------------------ */

function saveAnswersToStorage(answers: (string | null)[]) {
  const data = { answers, timestamp: Date.now() };
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

function loadAnswersFromStorage(): (string | null)[] | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const data = JSON.parse(raw);
    const age = Date.now() - data.timestamp;
    if (age > STORAGE_EXPIRY_DAYS * 24 * 60 * 60 * 1000) {
      localStorage.removeItem(STORAGE_KEY);
      return null;
    }
    return data.answers;
  } catch {
    return null;
  }
}

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
  const [assessmentTitle, setAssessmentTitle] = useState("");
  const [elapsed, setElapsed] = useState(0);

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
    // Payment gate — check sessionStorage first, fall back to localStorage
    let session = sessionStorage.getItem("rp_purchase_session");
    if (!session) {
      const stored = localStorage.getItem("rp_purchase_session");
      if (stored) {
        sessionStorage.setItem("rp_purchase_session", stored);
        session = stored;
      }
    }
    if (!session) {
      router.push("/pricing");
      return;
    }
    try {
      const parsed = JSON.parse(session);
      if (parsed.status !== "paid") {
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
    const saved = loadAnswersFromStorage();
    if (saved && saved.length === 6) {
      setAnswers(saved);
      const firstUnanswered = saved.findIndex((a) => a === null);
      if (firstUnanswered >= 0) setCurrentQuestion(firstUnanswered);
      else setCurrentQuestion(5);
    }
  }, [router]);

  // Live elapsed timer
  useEffect(() => {
    if (showLoading) return;
    const timer = setInterval(() => setElapsed((s) => s + 1), 1000);
    return () => clearInterval(timer);
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

  const q = QUESTIONS[currentQuestion];
  const selected = answers[currentQuestion];
  const allAnswered = answers.every((a) => a !== null);

  const selectAnswer = useCallback((letter: string) => {
    if (transitioning) return; // Guard against accidental selection during transition
    setError(null);
    setAnswers((prev) => {
      const next = [...prev];
      next[currentQuestion] = letter;
      saveAnswersToStorage(next);
      return next;
    });

    // Auto-advance after selection (except last question)
    if (currentQuestion < 5) {
      setTimeout(() => {
        setTransitioning(true);
        setTimeout(() => {
          setCurrentQuestion((prev) => Math.min(5, prev + 1));
          setTimeout(() => setTransitioning(false), 100); // Extra guard after render
        }, 300);
      }, 500); // Longer delay on mobile to prevent ghost taps
    }
  }, [currentQuestion, transitioning]);

  const goTo = (index: number) => {
    setError(null);
    setTransitioning(true);
    setTimeout(() => {
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

      sessionStorage.setItem("rp_record", JSON.stringify(record));

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
      localStorage.setItem("rp_records", JSON.stringify(stored));

      localStorage.removeItem(STORAGE_KEY);
      setAssessmentTitle(profile.assessment_title || "");
      setShowLoading(true);
      // Route based on plan type
      const planKey = (() => {
        try {
          const ps = JSON.parse(sessionStorage.getItem("rp_purchase_session") || "{}");
          return ps.plan_key || "free";
        } catch { return "free"; }
      })();
      setTimeout(() => {
        router.push(planKey === "free" ? "/free-score" : "/review");
      }, 5000);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Submission failed";
      setError(message);
      setSubmitting(false);
    }
  };

  /* ================================================================ */
  /*  Processing screen                                               */
  /* ================================================================ */
  if (showLoading) {
    return (
      <div style={{ position: "fixed", inset: 0, zIndex: 9999, background: "linear-gradient(135deg, #0E1A2B 0%, #1A1540 40%, #4B3FAE 70%, #1F6D7A 100%)", overflowY: "auto" }}>
      <div style={{ position: "absolute", top: "30%", left: "50%", width: 800, height: 800, transform: "translate(-50%, -50%)", background: "radial-gradient(circle, rgba(75,63,174,0.20) 0%, transparent 70%)", pointerEvents: "none" }} />
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "100vh",
          position: "relative",
          zIndex: 1,
        }}
      >
        <div style={{ textAlign: "center", maxWidth: 420, padding: "0 24px" }}>
          {/* Spinner */}
          <div style={{ width: 44, height: 44, borderRadius: "50%", border: "3px solid rgba(255,255,255,0.12)", borderTopColor: "#ffffff", margin: "0 auto 28px", animation: "rp-spin 0.8s linear infinite" }} />

          <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase" as const, color: "rgba(244,241,234,0.45)", marginBottom: 16 }}>
            GENERATING YOUR ASSESSMENT
          </div>

          <h2 style={{ fontSize: 24, fontWeight: 600, color: "#F4F1EA", letterSpacing: "-0.02em", marginBottom: 8 }}>
            Income Stability Score&#8482;
          </h2>
          {assessmentTitle && (
            <p style={{ fontSize: 15, fontWeight: 500, color: "rgba(244,241,234,0.60)", marginBottom: 32 }}>
              Preparing report for {assessmentTitle}
            </p>
          )}

          {/* Processing steps */}
          <div style={{ display: "flex", flexDirection: "column", gap: 0, textAlign: "left", marginBottom: 32 }}>
            {PROCESSING_STEPS.map((step, i) => (
              <div
                key={step}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 14,
                  padding: "12px 0",
                  borderBottom: i < PROCESSING_STEPS.length - 1 ? "1px solid rgba(244,241,234,0.06)" : "none",
                  opacity: i <= loadingStep ? 1 : 0.3,
                  transition: "opacity 400ms ease",
                }}
              >
                <div
                  style={{
                    width: 22,
                    height: 22,
                    borderRadius: "50%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    background: i < loadingStep ? "rgba(31,109,122,0.30)" : i === loadingStep ? "rgba(75,63,174,0.30)" : "rgba(244,241,234,0.06)",
                    border: `1px solid ${i < loadingStep ? "rgba(31,109,122,0.40)" : i === loadingStep ? "rgba(75,63,174,0.40)" : "rgba(244,241,234,0.08)"}`,
                    transition: "background 400ms ease, border-color 400ms ease",
                    flexShrink: 0,
                  }}
                >
                  {i < loadingStep ? (
                    <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
                      <path d="M1 4L3.5 6.5L9 1" stroke="#1F6D7A" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  ) : i === loadingStep ? (
                    <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#F4F1EA", animation: "rp-pulse 1s ease-in-out infinite" }} />
                  ) : null}
                </div>
                <span style={{ fontSize: 13, fontWeight: i <= loadingStep ? 500 : 400, color: i <= loadingStep ? "#F4F1EA" : "rgba(244,241,234,0.30)" }}>
                  {step}
                </span>
              </div>
            ))}
          </div>

          {/* Progress bar */}
          <div style={{ height: 2, borderRadius: 2, background: "rgba(244,241,234,0.08)", overflow: "hidden" }}>
            <div
              style={{
                height: "100%",
                borderRadius: 2,
                background: "linear-gradient(90deg, #4B3FAE, #1F6D7A)",
                animation: "loadProgress 3.4s ease-in-out forwards",
              }}
            />
          </div>

          <style>{`
            @keyframes loadProgress {
              0% { width: 0%; }
              30% { width: 40%; }
              70% { width: 80%; }
              100% { width: 100%; }
            }
            @keyframes rp-spin { to { transform: rotate(360deg); } }
            @keyframes rp-pulse { 0%, 100% { opacity: 0.3; } 50% { opacity: 1; } }
          `}</style>
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
      <div style={{ position: "fixed", inset: 0, zIndex: 9999, background: "#F7F6F3", overflowY: "auto" }}>
      {/* Dark branded header */}
      <div style={{ background: B.navy, padding: "20px 24px", textAlign: "center" }}>
        <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase" as const, color: "rgba(244,241,234,0.45)" }}>
          Income Stability Score&#8482; &middot; Model RP-2.0
        </div>
      </div>
      <div style={{ maxWidth: 860, margin: "0 auto", padding: "32px 24px 48px", display: "flex", flexDirection: "column", gap: 0, minHeight: "70vh" }}>
        <div style={{ marginBottom: 28 }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 8 }}>
            <div style={{ fontSize: 11, fontWeight: 600, color: B.purple, letterSpacing: "0.08em", textTransform: "uppercase" as const }}>
              Review Your Answers
            </div>
            <span style={{ fontSize: 11, color: B.light, fontFeatureSettings: "'tnum'" }}>
              {Math.floor(elapsed / 60)}:{(elapsed % 60).toString().padStart(2, "0")}
            </span>
          </div>
          <h2 style={{ fontSize: 22, fontWeight: 700, color: B.navy, letterSpacing: "-0.02em", marginBottom: 6 }}>
            Confirm before we generate your score
          </h2>
          <p style={{ fontSize: 14, color: B.muted, lineHeight: 1.6 }}>
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
                  gap: 16,
                  padding: "18px 20px",
                  borderRadius: 12,
                  border: "1px solid rgba(14,26,43,0.06)",
                  background: "#FFFFFF",
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
                  background: "rgba(75,63,174,0.06)", color: B.purple,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: 12, fontWeight: 700, flexShrink: 0,
                }}>{question.number}</div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 13, fontWeight: 600, color: B.navy, marginBottom: 2 }}>
                    {question.title}
                  </div>
                  <div style={{ fontSize: 13, color: B.muted }}>
                    {selectedOption?.text || "Not answered"}
                  </div>
                </div>
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none" style={{ flexShrink: 0 }}>
                  <path d="M10.5 6.5L13 4L10 1L7.5 3.5M10.5 6.5L4.5 12.5H1V9.5L7.5 3.5M10.5 6.5L7.5 3.5" stroke={B.light} strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
            );
          })}
        </div>

        <div style={{ marginTop: 24, display: "flex", gap: 12, alignItems: "center", justifyContent: "space-between" }}>
          <button
            onClick={() => { setShowReview(false); setCurrentQuestion(5); }}
            style={{ fontSize: 13, fontWeight: 500, color: B.muted, background: "none", border: "none", cursor: "pointer", padding: "8px 0" }}
          >
            Back to questions
          </button>
          <button
            onClick={handleSubmit}
            disabled={!allAnswered || submitting}
            style={{
              height: 48, paddingLeft: 28, paddingRight: 28, borderRadius: 12,
              background: !allAnswered || submitting ? "rgba(14,26,43,0.08)" : B.purple,
              color: !allAnswered || submitting ? B.light : "#FFFFFF",
              fontSize: 15, fontWeight: 600, border: "none",
              cursor: !allAnswered || submitting ? "not-allowed" : "pointer",
              boxShadow: allAnswered && !submitting ? "0 6px 16px rgba(75,63,174,0.25)" : "none",
              transition: "background 180ms ease",
            }}
          >
            {submitting ? "Processing..." : "Confirm & Generate Score"}
          </button>
        </div>

        {error && (
          <div style={{ marginTop: 12, padding: "12px 16px", borderRadius: 10, background: "rgba(220,38,38,0.06)", border: "1px solid rgba(220,38,38,0.12)" }}>
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
    <div style={{
      position: "fixed", inset: 0, zIndex: 9999,
      background: "#F7F6F3",
      overflowY: "auto",
    }}>
    {/* Dark branded header */}
    <div style={{ background: B.navy, padding: "16px 24px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
      <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase" as const, color: "rgba(244,241,234,0.45)" }}>
        Income Stability Score&#8482;
      </div>
      <div style={{ fontSize: 11, fontWeight: 500, color: "rgba(244,241,234,0.30)" }}>
        Model RP-2.0
      </div>
    </div>
    <div style={{ maxWidth: 860, margin: "0 auto", padding: "28px 24px 48px", display: "flex", flexDirection: "column", gap: 0, minHeight: "70vh" }}>
      {/* Top bar — factor label + progress */}
      <div style={{ marginBottom: 28 }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
          <div>
            <div style={{ fontSize: 11, fontWeight: 600, color: B.purple, letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 4 }}>
              Question {q.number} of 6
            </div>
            <div style={{ fontSize: 11, color: B.light }}>
              Based on your previous 12 months
            </div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <span style={{ fontSize: 11, color: B.light, fontFeatureSettings: "'tnum'" }}>
              {Math.floor(elapsed / 60)}:{(elapsed % 60).toString().padStart(2, "0")}
            </span>
            <span style={{ fontSize: 11, color: "rgba(14,26,43,0.10)" }}>|</span>
            <span style={{ fontSize: 11, color: B.light }}></span>
          </div>
        </div>

        {/* Progress bar */}
        <div style={{ display: "flex", gap: 4 }}>
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
                  ? B.purple
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
            <div style={{ width: 5, height: 5, borderRadius: 99, background: B.teal }} />
            <span style={{ fontSize: 11, fontWeight: 500, color: B.teal }}>
              {currentQuestion === 3 ? "Halfway there — your score is being calculated." : currentQuestion === 4 ? "Almost done — one factor remaining." : "All factors captured — ready to generate."}
            </span>
          </div>
        )}
      </div>

      {/* Question card */}
      <div
        style={{
          background: "#FFFFFF",
          borderRadius: 16,
          border: "1px solid rgba(14,26,43,0.06)",
          padding: "32px 28px",
          flex: 1,
          display: "flex",
          flexDirection: "column",
          opacity: transitioning ? 0 : 1,
          transform: transitioning ? "translateY(8px)" : "translateY(0)",
          transition: "opacity 200ms ease, transform 200ms ease",
        }}
      >
        {/* Factor title */}
        <h2 style={{ fontSize: 20, fontWeight: 700, color: B.navy, letterSpacing: "-0.02em", marginBottom: 12 }}>
          {q.title}
        </h2>

        {/* Question prompt */}
        <p style={{ fontSize: 15, color: B.muted, lineHeight: 1.7, marginBottom: 8 }}>
          {q.prompt}
        </p>

        {/* Examples */}
        {q.examples && (
          <div style={{ marginBottom: 8 }}>
            <span style={{ fontSize: 12, fontWeight: 600, color: B.light }}>Examples: </span>
            <span style={{ fontSize: 12, color: B.light }}>{q.examples.join(", ")}</span>
          </div>
        )}

        {/* Note */}
        {q.note && (
          <p style={{ fontSize: 12, color: B.light, fontStyle: "italic", marginBottom: 8 }}>
            {q.note}
          </p>
        )}

        {/* Options */}
        <div style={{ display: "flex", flexDirection: "column", gap: 8, marginTop: 16, flex: 1 }}>
          {q.options.map((opt) => {
            const isSelected = selected === opt.letter;
            return (
              <button
                key={opt.letter}
                onClick={() => !transitioning && selectAnswer(opt.letter)}
                disabled={transitioning}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 16,
                  padding: "16px 20px",
                  borderRadius: 12,
                  border: `1px solid ${isSelected ? B.purple : "rgba(14,26,43,0.08)"}`,
                  background: isSelected ? "rgba(75,63,174,0.04)" : "#FFFFFF",
                  cursor: transitioning ? "default" : "pointer",
                  textAlign: "left",
                  transition: "border-color 160ms ease, background 160ms ease, transform 120ms ease",
                  transform: isSelected ? "scale(1)" : "scale(1)",
                  width: "100%",
                  pointerEvents: transitioning ? "none" : "auto",
                }}
              >
                {/* Selection indicator */}
                <div
                  style={{
                    width: 22,
                    height: 22,
                    borderRadius: "50%",
                    border: `2px solid ${isSelected ? B.purple : "rgba(14,26,43,0.15)"}`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                    transition: "border-color 160ms ease",
                  }}
                >
                  {isSelected && (
                    <div style={{ width: 10, height: 10, borderRadius: "50%", background: B.purple }} />
                  )}
                </div>

                {/* Option text */}
                <span style={{ fontSize: 15, fontWeight: isSelected ? 600 : 400, color: isSelected ? B.navy : B.muted, transition: "color 160ms ease" }}>
                  {opt.text}
                </span>

                {/* Selected check */}
                {isSelected && (
                  <svg style={{ marginLeft: "auto", flexShrink: 0 }} width="16" height="12" viewBox="0 0 16 12" fill="none">
                    <path d="M1 6L5.5 10.5L15 1" stroke={B.purple} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                )}
              </button>
            );
          })}
        </div>

        {/* Definition */}
        {q.definition && (
          <div style={{ marginTop: 20, paddingTop: 16, borderTop: "1px solid rgba(14,26,43,0.06)" }}>
            <p style={{ fontSize: 12, color: B.light, lineHeight: 1.6 }}>
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
            color: B.muted,
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
                paddingLeft: 24,
                paddingRight: 24,
                borderRadius: 10,
                background: selected === null ? "rgba(14,26,43,0.08)" : B.navy,
                color: selected === null ? B.light : "#FFFFFF",
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
              onClick={() => setShowReview(true)}
              disabled={!allAnswered}
              style={{
                height: 48,
                paddingLeft: 28,
                paddingRight: 28,
                borderRadius: 12,
                background: !allAnswered ? "rgba(14,26,43,0.08)" : B.purple,
                color: !allAnswered ? B.light : "#FFFFFF",
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
