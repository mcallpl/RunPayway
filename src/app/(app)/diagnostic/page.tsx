"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { executeClientEngine } from "@/lib/client-engine";

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
    title: "Income Concentration",
    prompt: "Over the previous 12 months, what percentage of your income came from your single largest income source?",
    examples: ["employer", "client", "contract group", "asset category"],
    options: [
      { letter: "A", text: "90–100%" },
      { letter: "B", text: "70–89%" },
      { letter: "C", text: "50–69%" },
      { letter: "D", text: "30–49%" },
      { letter: "E", text: "Under 30%" },
    ],
  },
  {
    number: 3,
    title: "Income Source Count",
    prompt: "Over the previous 12 months, how many income sources each generated at least 10% of your total income?",
    note: "Only sources contributing 10% or more should be counted.",
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
    prompt: "How many months of income are currently secured under signed or enforceable agreements?",
    note: "Include only income that is already contractually committed.",
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
    title: "Earnings Variability",
    prompt: "Over the previous 12 months, how much did your monthly income fluctuate between the highest and lowest months?",
    note: "Measured relative to your average monthly income.",
    options: [
      { letter: "A", text: "More than 75%" },
      { letter: "B", text: "50–75%" },
      { letter: "C", text: "25–49%" },
      { letter: "D", text: "10–24%" },
      { letter: "E", text: "Less than 10%" },
    ],
  },
  {
    number: 6,
    title: "Income Continuity Without Active Labor",
    prompt: "If active work stopped for 90 consecutive days, what percentage of your income would continue automatically?",
    examples: ["subscriptions", "contract retainers", "royalties", "asset distributions"],
    definition: "Income that continues without new work, client acquisition, or servicing activity.",
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

  useEffect(() => {
    window.scrollTo(0, 0);
    const profile = sessionStorage.getItem("rp_profile");
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
          setTransitioning(false);
        }, 300);
      }, 400);
    }
  }, [currentQuestion]);

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

    setSubmitting(true);
    setError(null);

    try {
      const record = await executeClientEngine({ profile, inputs });
      sessionStorage.setItem("rp_record", JSON.stringify(record));
      localStorage.removeItem(STORAGE_KEY);
      setShowLoading(true);
      setTimeout(() => {
        router.push("/review");
      }, 3600);
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
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "70vh",
        }}
      >
        <div style={{ textAlign: "center", maxWidth: 400, padding: "0 24px" }}>
          {/* Model badge */}
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              padding: "5px 14px",
              borderRadius: 8,
              background: "rgba(75,63,174,0.06)",
              marginBottom: 24,
            }}
          >
            <div style={{ width: 6, height: 6, borderRadius: "50%", background: B.purple, animation: "pulse 1.2s ease-in-out infinite" }} />
            <span style={{ fontSize: 11, fontWeight: 700, color: B.purple, letterSpacing: "0.06em", textTransform: "uppercase" }}>
              Model RP-1.0
            </span>
          </div>

          <h2 style={{ fontSize: 22, fontWeight: 700, color: B.navy, letterSpacing: "-0.02em", marginBottom: 8 }}>
            Generating Your Assessment
          </h2>
          <p style={{ fontSize: 14, color: B.muted, lineHeight: 1.6, marginBottom: 32 }}>
            Structural Stability Model RP-1.0 is evaluating your income structure.
          </p>

          {/* Processing steps */}
          <div style={{ display: "flex", flexDirection: "column", gap: 0, textAlign: "left", marginBottom: 32 }}>
            {PROCESSING_STEPS.map((step, i) => (
              <div
                key={step}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 14,
                  padding: "10px 0",
                  borderBottom: i < PROCESSING_STEPS.length - 1 ? "1px solid rgba(14,26,43,0.04)" : "none",
                  opacity: i <= loadingStep ? 1 : 0.25,
                  transition: "opacity 400ms ease",
                }}
              >
                <div
                  style={{
                    width: 20,
                    height: 20,
                    borderRadius: "50%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    background: i < loadingStep ? B.teal : i === loadingStep ? B.purple : "rgba(14,26,43,0.08)",
                    transition: "background 400ms ease",
                    flexShrink: 0,
                  }}
                >
                  {i < loadingStep ? (
                    <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
                      <path d="M1 4L3.5 6.5L9 1" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  ) : i === loadingStep ? (
                    <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#fff" }} />
                  ) : null}
                </div>
                <span style={{ fontSize: 13, fontWeight: i <= loadingStep ? 500 : 400, color: i <= loadingStep ? B.navy : B.light }}>
                  {step}
                </span>
              </div>
            ))}
          </div>

          {/* Progress bar */}
          <div style={{ height: 3, borderRadius: 2, background: B.sandDk, overflow: "hidden" }}>
            <div
              style={{
                height: "100%",
                borderRadius: 2,
                background: B.gradient,
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
            @keyframes pulse {
              0%, 100% { opacity: 1; }
              50% { opacity: 0.4; }
            }
          `}</style>
        </div>
      </div>
    );
  }

  /* ================================================================ */
  /*  Diagnostic instrument                                           */
  /* ================================================================ */
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 0, minHeight: "70vh" }}>
      {/* Top bar — factor label + progress */}
      <div style={{ marginBottom: 32 }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
          <div>
            <div style={{ fontSize: 11, fontWeight: 600, color: B.purple, letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 4 }}>
              Structural Factor {q.number} of 6
            </div>
            <div style={{ fontSize: 11, color: B.light }}>
              Assessment Timeframe: Previous 12 months
            </div>
          </div>
          <div style={{ fontSize: 11, color: B.light }}>
            Model RP-1.0
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
                onClick={() => selectAnswer(opt.letter)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 16,
                  padding: "16px 20px",
                  borderRadius: 12,
                  border: `1px solid ${isSelected ? B.purple : "rgba(14,26,43,0.08)"}`,
                  background: isSelected ? "rgba(75,63,174,0.04)" : "#FFFFFF",
                  cursor: "pointer",
                  textAlign: "left",
                  transition: "border-color 160ms ease, background 160ms ease, transform 120ms ease",
                  transform: isSelected ? "scale(1)" : "scale(1)",
                  width: "100%",
                }}
              >
                {/* Letter indicator */}
                <div
                  style={{
                    width: 32,
                    height: 32,
                    borderRadius: 8,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    background: isSelected ? B.purple : "rgba(14,26,43,0.04)",
                    color: isSelected ? "#FFFFFF" : B.muted,
                    fontSize: 13,
                    fontWeight: 700,
                    flexShrink: 0,
                    transition: "background 160ms ease, color 160ms ease",
                  }}
                >
                  {opt.letter}
                </div>

                {/* Option text */}
                <span style={{ fontSize: 15, fontWeight: isSelected ? 600 : 400, color: isSelected ? B.navy : B.muted, transition: "color 160ms ease" }}>
                  {opt.text}
                </span>

                {/* Selected check */}
                {isSelected && (
                  <div style={{ marginLeft: "auto", flexShrink: 0 }}>
                    <svg width="16" height="12" viewBox="0 0 16 12" fill="none">
                      <path d="M1 6L5.5 10.5L15 1" stroke={B.purple} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </div>
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
          onClick={() => goTo(Math.max(0, currentQuestion - 1))}
          disabled={currentQuestion === 0}
          style={{
            fontSize: 13,
            fontWeight: 500,
            color: currentQuestion === 0 ? "rgba(14,26,43,0.20)" : B.muted,
            background: "none",
            border: "none",
            cursor: currentQuestion === 0 ? "not-allowed" : "pointer",
            padding: "8px 0",
            transition: "color 160ms ease",
          }}
        >
          Previous
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
              onClick={handleSubmit}
              disabled={!allAnswered || submitting}
              style={{
                height: 48,
                paddingLeft: 28,
                paddingRight: 28,
                borderRadius: 12,
                background: !allAnswered || submitting ? "rgba(14,26,43,0.08)" : B.purple,
                color: !allAnswered || submitting ? B.light : "#FFFFFF",
                fontSize: 15,
                fontWeight: 600,
                border: "none",
                cursor: !allAnswered || submitting ? "not-allowed" : "pointer",
                boxShadow: allAnswered && !submitting ? "0 6px 16px rgba(75,63,174,0.25)" : "none",
                transition: "background 180ms ease",
              }}
            >
              {submitting ? "Processing..." : "Generate Assessment"}
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
  );
}
