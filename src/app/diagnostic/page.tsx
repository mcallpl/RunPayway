"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { QUESTIONS } from "@/lib/engine/questions";
import { RESPONSE_VALUES } from "@/lib/engine/constants";

export default function DiagnosticPage() {
  const router = useRouter();
  const [currentQ, setCurrentQ] = useState(0);
  const [responses, setResponses] = useState<(number | null)[]>(
    Array(7).fill(null)
  );
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const setup = sessionStorage.getItem("rp_setup");
    if (!setup) {
      router.replace("/setup");
    }
  }, [router]);

  const question = QUESTIONS[currentQ];
  const selected = responses[currentQ];

  const handleSelect = (optionIndex: number) => {
    const value = RESPONSE_VALUES[optionIndex];
    setResponses((prev) => {
      const next = [...prev];
      next[currentQ] = value;
      return next;
    });
  };

  const handleNext = async () => {
    if (currentQ < 6) {
      setCurrentQ(currentQ + 1);
    } else {
      await handleSubmit();
    }
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    try {
      const setup = JSON.parse(sessionStorage.getItem("rp_setup") || "{}");
      const res = await fetch("/api/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ setup, responses }),
      });
      const data = await res.json();
      if (data.engineOutput) {
        sessionStorage.setItem(
          "rp_report",
          JSON.stringify(data.engineOutput)
        );
        router.push(`/report?id=${data.engineOutput.referenceId}`);
      }
    } catch {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <div className="flex items-center justify-between px-6 py-4">
        <span className="text-sm font-semibold tracking-wide">RUNPAYWAY™</span>
        <span className="text-xs text-neutral-500">
          Model RP-1.0 | Version 1.0
        </span>
      </div>
      <div className="border-t border-neutral-200" />

      <div className="flex-1 flex items-center justify-center px-6">
        <div className="max-w-lg w-full">
          <div className="mb-8 flex gap-1.5">
            {Array.from({ length: 7 }, (_, i) => (
              <div
                key={i}
                className={`h-1 flex-1 ${
                  i <= currentQ ? "bg-neutral-900" : "bg-neutral-200"
                }`}
              />
            ))}
          </div>

          <p className="text-xs text-neutral-400 mb-2">
            {question.key} — {question.pillar}
          </p>
          <h2 className="text-lg font-semibold mb-6">{question.text}</h2>

          <div className="space-y-2">
            {question.options.map((option, i) => {
              const value = RESPONSE_VALUES[i];
              const isSelected = selected === value;
              return (
                <button
                  key={i}
                  onClick={() => handleSelect(i)}
                  className={`w-full border px-4 py-3 text-sm text-left transition-colors ${
                    isSelected
                      ? "border-neutral-900 bg-neutral-50"
                      : "border-neutral-300 hover:border-neutral-500"
                  }`}
                >
                  {option}
                </button>
              );
            })}
          </div>

          <div className="mt-8 flex justify-between">
            {currentQ > 0 ? (
              <button
                onClick={() => setCurrentQ(currentQ - 1)}
                className="text-sm text-neutral-500 hover:text-neutral-900"
              >
                Back
              </button>
            ) : (
              <div />
            )}
            <button
              onClick={handleNext}
              disabled={selected === null || submitting}
              className={`px-6 py-2 text-sm font-medium transition-colors ${
                selected !== null && !submitting
                  ? "bg-neutral-900 text-white hover:bg-neutral-800"
                  : "bg-neutral-200 text-neutral-400 cursor-not-allowed"
              }`}
            >
              {submitting
                ? "Submitting..."
                : currentQ === 6
                  ? "Submit Diagnostic"
                  : "Continue"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
