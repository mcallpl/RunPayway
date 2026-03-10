"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";

const ANSWER_MAP: Record<string, number> = {
  A: 0,
  B: 25,
  C: 50,
  D: 75,
  E: 100,
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
    prompt:
      "What percentage of your income renews automatically through an existing agreement or subscription?",
    examples: [
      "subscription services",
      "contract retainers",
      "licensing or royalty income",
      "recurring service agreements",
    ],
    definition:
      "Recurring income renews without requiring new client acquisition.",
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
    prompt:
      "Over the previous 12 months, what percentage of your income came from your single largest income source?",
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
    prompt:
      "Over the previous 12 months, how many income sources each generated at least 10% of your total income?",
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
    prompt:
      "How many months of income are currently secured under signed or enforceable agreements?",
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
    prompt:
      "Over the previous 12 months, how much did your monthly income fluctuate between the highest and lowest months?",
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
    prompt:
      "If active work stopped for 90 consecutive days, what percentage of your income would continue automatically?",
    examples: [
      "subscriptions",
      "contract retainers",
      "royalties",
      "asset distributions",
    ],
    definition:
      "Income that continues without new work, client acquisition, or servicing activity.",
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

export default function DiagnosticPage() {
  const router = useRouter();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<(string | null)[]>(
    Array(6).fill(null)
  );
  const [submitting, setSubmitting] = useState(false);
  const [showLoading, setShowLoading] = useState(false);
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

  const q = QUESTIONS[currentQuestion];
  const selected = answers[currentQuestion];
  const allAnswered = answers.every((a) => a !== null);

  const selectAnswer = useCallback((letter: string) => {
    setAnswers((prev) => {
      const next = [...prev];
      next[currentQuestion] = letter;
      saveAnswersToStorage(next);
      return next;
    });
  }, [currentQuestion]);

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
      const res = await fetch("/api/v1/score", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ profile, inputs }),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Submission failed");
      }

      const record = await res.json();
      sessionStorage.setItem("rp_record", JSON.stringify(record));
      localStorage.removeItem(STORAGE_KEY);

      // Show loading card for 3 seconds
      setShowLoading(true);
      setTimeout(() => {
        router.push("/review");
      }, 3000);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Submission failed");
      setSubmitting(false);
    }
  };

  // Loading card
  if (showLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center space-y-6">
          <h2 className="text-lg font-semibold" style={{ color: "#0E1A2B" }}>
            Analyzing Your Income Structure
          </h2>
          <p className="text-sm" style={{ color: "#6B7280" }}>
            Evaluating structural income patterns using Model RP-1.0.
          </p>
          <div className="w-64 h-1.5 rounded-full mx-auto overflow-hidden" style={{ backgroundColor: "#EDE9E0" }}>
            <div
              className="h-full rounded-full"
              style={{
                backgroundColor: "#4B3FAE",
                animation: "loadProgress 2.8s ease-in-out forwards",
              }}
            />
          </div>
          <style>{`
            @keyframes loadProgress {
              0% { width: 0%; }
              60% { width: 70%; }
              100% { width: 100%; }
            }
          `}</style>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-semibold text-neutral-900">
          Income Stability Diagnostic
        </h1>
        <p className="text-sm text-neutral-500 mt-1">
          Select the option that most accurately reflects your income structure
          over the previous 12 months.
        </p>
      </div>

      {/* Progress */}
      <div className="flex gap-1.5">
        {QUESTIONS.map((_, i) => (
          <div
            key={i}
            className={`h-1 flex-1 rounded-full transition-colors ${
              answers[i] !== null
                ? "bg-neutral-800"
                : i === currentQuestion
                ? "bg-neutral-400"
                : "bg-neutral-200"
            }`}
          />
        ))}
      </div>

      {/* Question */}
      <div className="border border-gray-200 rounded-lg bg-white p-6 space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-xs text-neutral-400 font-medium">
            Question {q.number} of 6
          </span>
        </div>

        <h2 className="text-base font-semibold text-neutral-900">{q.title}</h2>
        <p className="text-sm text-neutral-700">{q.prompt}</p>

        {q.examples && (
          <div className="text-xs text-neutral-500">
            <span className="font-medium">Examples may include:</span>
            <ul className="list-disc list-inside mt-1 space-y-0.5">
              {q.examples.map((ex) => (
                <li key={ex}>{ex}</li>
              ))}
            </ul>
          </div>
        )}

        {q.note && (
          <p className="text-xs text-neutral-500 italic">{q.note}</p>
        )}

        <div className="space-y-2 pt-2">
          {q.options.map((opt) => (
            <button
              key={opt.letter}
              onClick={() => selectAnswer(opt.letter)}
              className={`option-card w-full text-left flex items-center gap-3 ${
                selected === opt.letter ? "selected" : ""
              }`}
            >
              <span
                className={`w-7 h-7 rounded-full border flex items-center justify-center text-xs font-medium shrink-0 ${
                  selected === opt.letter
                    ? "border-neutral-700 bg-neutral-800 text-white"
                    : "border-neutral-300 text-neutral-500"
                }`}
              >
                {opt.letter}
              </span>
              <span className="text-sm text-neutral-700">{opt.text}</span>
            </button>
          ))}
        </div>

        {q.definition && (
          <p className="text-xs text-neutral-400 pt-2 border-t border-gray-100">
            {q.definition}
          </p>
        )}
      </div>

      {/* Navigation */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => setCurrentQuestion(Math.max(0, currentQuestion - 1))}
          disabled={currentQuestion === 0}
          className="text-sm text-neutral-500 hover:text-neutral-800 disabled:opacity-30 disabled:cursor-not-allowed"
        >
          Previous
        </button>

        <div className="flex gap-3">
          {currentQuestion < 5 && (
            <button
              onClick={() =>
                setCurrentQuestion(Math.min(5, currentQuestion + 1))
              }
              disabled={selected === null}
              className="px-5 py-2 text-sm font-medium bg-neutral-900 text-white rounded disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Next
            </button>
          )}

          {currentQuestion === 5 && (
            <button
              onClick={handleSubmit}
              disabled={!allAnswered || submitting}
              className="px-5 py-2 text-sm font-medium bg-neutral-900 text-white rounded disabled:opacity-40 disabled:cursor-not-allowed"
            >
              {submitting ? "Processing..." : "Submit Diagnostic"}
            </button>
          )}
        </div>
      </div>

      {error && (
        <div className="text-sm text-red-600 bg-red-50 border border-red-200 rounded p-3">
          {error}
        </div>
      )}
    </div>
  );
}
