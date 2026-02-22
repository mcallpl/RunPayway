"use client";

import { useState, useCallback, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Suspense } from "react";
import PageContainer from "@/components/layout/PageContainer";
import CalibrationForm from "@/components/diagnostic/CalibrationForm";
import QuestionView from "@/components/diagnostic/QuestionView";
import ProgressBar from "@/components/diagnostic/ProgressBar";
import { QUESTIONS } from "@/lib/constants";
import type { CalibrationData, AnswerLetter, DiagnosticResponses } from "@/lib/types";

const API_BASE = "https://peoplestar.com/RunPayway/api";

type Phase = "loading" | "calibration" | "diagnostic" | "submitting" | "error";

function AssessContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get("token") || "";

  const [phase, setPhase] = useState<Phase>(token ? "calibration" : "error");
  const [calibration, setCalibration] = useState<CalibrationData>({
    industry: "",
    revenue_model: "",
    role: "",
  });
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [responses, setResponses] = useState<DiagnosticResponses>({});
  const [errorMessage, setErrorMessage] = useState(
    token ? "" : "No access token provided. Please use the link from your purchase confirmation."
  );

  const handleCalibrationSubmit = useCallback(() => {
    setPhase("diagnostic");
  }, []);

  const handleAnswer = useCallback(
    (letter: AnswerLetter) => {
      const questionId = `q${QUESTIONS[currentQuestion].id}`;

      setResponses((prev) => ({
        ...prev,
        [questionId]: letter,
      }));

      // Auto-advance to next question after a short delay (only if not on last question)
      setTimeout(() => {
        if (currentQuestion < QUESTIONS.length - 1) {
          setCurrentQuestion((prev) => prev + 1);
        }
      }, 400);
    },
    [currentQuestion],
  );

  const handleBack = useCallback(() => {
    if (currentQuestion > 0) {
      setCurrentQuestion((prev) => prev - 1);
    } else {
      // Go back to calibration from first question
      setPhase("calibration");
    }
  }, [currentQuestion]);

  const handleNext = useCallback(() => {
    const questionId = `q${QUESTIONS[currentQuestion].id}`;
    if (!responses[questionId]) return; // Must answer first

    if (currentQuestion < QUESTIONS.length - 1) {
      setCurrentQuestion((prev) => prev + 1);
    } else {
      handleSubmit(responses);
    }
  }, [currentQuestion, responses]);

  const handleSubmit = async (finalResponses: DiagnosticResponses) => {
    setPhase("submitting");

    try {
      const response = await fetch(`${API_BASE}/submit_diagnostic.php`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          token,
          industry: calibration.industry,
          revenue_model: calibration.revenue_model,
          role: calibration.role,
          responses: finalResponses,
        }),
      });

      const data = await response.json();

      if (data.success) {
        router.push(`/report/?token=${encodeURIComponent(token)}`);
      } else {
        setPhase("error");
        setErrorMessage(data.error || "An error occurred. Please try again.");
      }
    } catch {
      setPhase("error");
      setErrorMessage(
        "Unable to submit the diagnostic. Please check your connection and try again."
      );
    }
  };

  return (
    <section className="py-12 md:py-20 bg-white min-h-[80vh]">
      <PageContainer>
        <div className="max-w-[700px] mx-auto">
          <div className="mb-10">
            <p className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-2">
              Income Structure Diagnostic
            </p>
            <h1 className="text-2xl md:text-3xl font-bold text-navy-900">
              RunPayway&#8482; Assessment
            </h1>
          </div>

          {phase === "calibration" && (
            <CalibrationForm
              calibration={calibration}
              onChange={setCalibration}
              onSubmit={handleCalibrationSubmit}
            />
          )}

          {phase === "diagnostic" && (
            <div className="space-y-10">
              <ProgressBar
                current={currentQuestion + 1}
                total={QUESTIONS.length}
              />
              <QuestionView
                question={QUESTIONS[currentQuestion]}
                selectedAnswer={
                  responses[`q${QUESTIONS[currentQuestion].id}`] || null
                }
                onAnswer={handleAnswer}
              />
              <div className="flex items-center justify-between pt-6 mt-4 border-t border-gray-100">
                <button
                  type="button"
                  onClick={handleBack}
                  className="text-sm text-gray-500 hover:text-navy-900 transition-colors flex items-center gap-1.5 focus:outline-none focus:ring-2 focus:ring-navy-900 focus:ring-offset-2 px-3 py-2 rounded-none"
                >
                  <span aria-hidden="true">&larr;</span>
                  {currentQuestion === 0 ? "Back to Calibration" : "Previous Question"}
                </button>
                {currentQuestion === QUESTIONS.length - 1 &&
                  responses[`q${QUESTIONS[currentQuestion].id}`] && (
                    <button
                      type="button"
                      onClick={() => handleSubmit(responses)}
                      className="bg-navy-900 text-white px-6 py-2.5 text-sm font-medium hover:bg-navy-800 transition-colors focus:outline-none focus:ring-2 focus:ring-navy-900 focus:ring-offset-2 rounded-none"
                    >
                      Submit &amp; Generate Report
                    </button>
                  )}
              </div>
              <div className="pt-2">
                <p className="text-xs text-gray-400">
                  Calibration: {calibration.industry.replace(/_/g, " ")} &middot;{" "}
                  {calibration.revenue_model.replace(/_/g, " ")} &middot;{" "}
                  {calibration.role.replace(/_/g, " ")}
                </p>
              </div>
            </div>
          )}

          {phase === "submitting" && (
            <div className="text-center py-20">
              <div className="inline-block w-8 h-8 border-2 border-navy-900 border-t-transparent animate-spin mb-6" />
              <p className="text-lg font-semibold text-navy-900 mb-2">
                Generating Your Report
              </p>
              <p className="text-gray-500">
                Processing calibration, scoring, and output analysis...
              </p>
            </div>
          )}

          {phase === "error" && (
            <div className="text-center py-20">
              <p className="text-lg font-semibold text-navy-900 mb-4">
                Something Went Wrong
              </p>
              <p className="text-gray-600 mb-8">{errorMessage}</p>
              {token && (
                <button
                  type="button"
                  onClick={() => {
                    setPhase("calibration");
                    setCurrentQuestion(0);
                    setResponses({});
                    setErrorMessage("");
                  }}
                  className="bg-navy-900 text-white px-8 py-3 font-medium hover:bg-navy-800 transition-colors focus:outline-none focus:ring-2 focus:ring-navy-900 focus:ring-offset-2 rounded-none"
                >
                  Start Over
                </button>
              )}
            </div>
          )}
        </div>
      </PageContainer>
    </section>
  );
}

export default function AssessPage() {
  return (
    <Suspense
      fallback={
        <section className="py-20 bg-white min-h-[80vh]">
          <PageContainer>
            <div className="max-w-[700px] mx-auto text-center">
              <div className="inline-block w-8 h-8 border-2 border-navy-900 border-t-transparent animate-spin mb-6" />
              <p className="text-lg font-semibold text-navy-900">Loading...</p>
            </div>
          </PageContainer>
        </section>
      }
    >
      <AssessContent />
    </Suspense>
  );
}
