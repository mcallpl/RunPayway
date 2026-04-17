"use client";

import { useState } from "react";
import { C, sans } from "@/lib/design-tokens";
import { buildAdvisorQuestions } from "@/lib/advisor-questions";
import { mapIndustryToSector } from "@/lib/industry-map";
import { WORKER_URL } from "@/lib/config";
import { generateInterpretation, INTERPRETATION_AGENT_VERSION } from "@/lib/agents/interpretation";
import { runGatekeeper } from "@/lib/agents/gatekeeper";
import {
  createInitialState,
  advanceIntake,
  extractInputs,
  getStepIndex,
  TOTAL_STEPS,
  INTAKE_AGENT_VERSION,
  type IntakeState,
  type IntakeStep,
} from "@/lib/agents/intake-agent";
import type { CanonicalAdvisorRecord, InterpretationResult } from "@/lib/engine/v2/schemas/canonical-record";

/* ── Profile field option maps ── */
const structureMap: Record<string, string> = {
  "Employee (W-2)": "solo_service",
  "Independent Contractor": "solo_service",
  "Business Owner / Firm": "small_agency",
  "Partnership": "small_agency",
  "Nonprofit Organization": "small_agency",
};
const modelMap: Record<string, string> = {
  "Employee Salary": "salary",
  "Commission-Based": "commission",
  "Contract-Based": "project_fee",
  "Consulting / Client Services": "retainer",
  "Agency / Brokerage Income": "commission",
  "Project-Based Work": "project_fee",
  "Subscription / Retainer Services": "subscription",
  "Licensing / Royalty Income": "licensing",
  "Product Sales": "ecommerce",
  "Digital Product Sales": "digital_products",
  "Real Estate Rental Income": "rental",
  "Real Estate Brokerage Income": "commission",
  "Hybrid Multiple Income Sources": "mixed_services",
};
const revenueMap: Record<string, string> = {
  "Mostly One-Time Payments": "active_heavy",
  "Repeat Clients / Returning Customers": "hybrid",
  "Monthly Recurring Payments": "recurring_heavy",
  "Contracted Multi-Month Revenue": "recurring_heavy",
  "Long-Term Recurring Income": "asset_heavy",
  "Mixed Revenue Structure": "mixed",
};

const PROFILE_FIELDS: {
  step: IntakeStep;
  label: string;
  description: string;
  options: { display: string; value: string }[];
  mapper: Record<string, string>;
}[] = [
  {
    step: "operating_structure",
    label: "Operating structure",
    description: "How is your client's income legally structured?",
    options: [
      { display: "Employee (W-2)", value: "solo_service" },
      { display: "Independent Contractor", value: "solo_service" },
      { display: "Business Owner / Firm", value: "small_agency" },
      { display: "Partnership", value: "small_agency" },
      { display: "Nonprofit Organization", value: "small_agency" },
    ],
    mapper: structureMap,
  },
  {
    step: "primary_income_model",
    label: "Primary income model",
    description: "What best describes how your client earns income?",
    options: [
      { display: "Employee Salary", value: "salary" },
      { display: "Commission-Based", value: "commission" },
      { display: "Contract-Based", value: "project_fee" },
      { display: "Consulting / Client Services", value: "retainer" },
      { display: "Agency / Brokerage Income", value: "commission" },
      { display: "Project-Based Work", value: "project_fee" },
      { display: "Subscription / Retainer Services", value: "subscription" },
      { display: "Licensing / Royalty Income", value: "licensing" },
      { display: "Product Sales", value: "ecommerce" },
      { display: "Digital Product Sales", value: "digital_products" },
      { display: "Real Estate Rental Income", value: "rental" },
      { display: "Real Estate Brokerage Income", value: "commission" },
      { display: "Hybrid Multiple Income Sources", value: "mixed_services" },
    ],
    mapper: modelMap,
  },
  {
    step: "revenue_structure",
    label: "Revenue structure",
    description: "How does your client's income repeat or recur?",
    options: [
      { display: "Mostly One-Time Payments", value: "active_heavy" },
      { display: "Repeat Clients / Returning Customers", value: "hybrid" },
      { display: "Monthly Recurring Payments", value: "recurring_heavy" },
      { display: "Contracted Multi-Month Revenue", value: "recurring_heavy" },
      { display: "Long-Term Recurring Income", value: "asset_heavy" },
      { display: "Mixed Revenue Structure", value: "mixed" },
    ],
    mapper: revenueMap,
  },
  {
    step: "years_in_structure",
    label: "Years in this structure",
    description: "How long has your client operated under this income structure?",
    options: [
      { display: "Less than 1 year", value: "Less than 1 year" },
      { display: "1–3 years", value: "1–3 years" },
      { display: "3–5 years", value: "3–5 years" },
      { display: "5+ years", value: "5+ years" },
    ],
    mapper: {},
  },
];

/* ── Props ── */
interface InlineAssessmentProps {
  clientId: string;
  clientName: string;
  industry: string;
  advisorCode: string;
  mobile: boolean;
  onComplete: (result: {
    score: number;
    band: string;
    topRisk: string;
    assessmentId: string;
    canonicalRecord: CanonicalAdvisorRecord;
    interpretation: InterpretationResult;
  }) => void;
  onCancel: () => void;
}

/* ── Component ── */
export default function InlineAssessment({
  clientId,
  clientName,
  industry,
  advisorCode,
  mobile,
  onComplete,
  onCancel,
}: InlineAssessmentProps) {
  const sector = mapIndustryToSector(industry);
  const questions = buildAdvisorQuestions(sector);

  const [intakeState, setIntakeState] = useState<IntakeState>(() => createInitialState(sector));
  const [scoring, setScoring] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const currentStep = intakeState.currentStep;
  const stepIndex = getStepIndex(currentStep);
  const isProfileStep = ["operating_structure", "primary_income_model", "revenue_structure", "years_in_structure"].includes(currentStep);
  const isQuestionStep = currentStep.startsWith("q") && currentStep.length === 2;
  const qIndex = isQuestionStep ? parseInt(currentStep.slice(1)) - 1 : -1;

  const progressPct = (stepIndex / TOTAL_STEPS) * 100;

  /* ── Handle profile button selection (auto-advances) ── */
  const handleProfileSelect = (step: IntakeStep, displayValue: string, engineValue: string) => {
    const next = advanceIntake(intakeState, { field: step, value: engineValue });
    setIntakeState(next);
    setError(next.errors.length > 0 ? next.errors[0] : null);
    // suppress unused displayValue warning
    void displayValue;
  };

  /* ── Handle question answer (auto-advances) ── */
  const handleAnswer = (letter: string) => {
    const next = advanceIntake(intakeState, { field: currentStep, value: letter });
    setIntakeState(next);
    setError(next.errors.length > 0 ? next.errors[0] : null);
  };

  /* ── Handle back ── */
  const handleBack = () => {
    const prevStepIdx = Math.max(0, stepIndex - 1);
    const steps: IntakeStep[] = ["operating_structure", "primary_income_model", "revenue_structure", "years_in_structure", "q1", "q2", "q3", "q4", "q5", "q6"];
    let rebuilt = createInitialState(sector);
    for (let i = 0; i < prevStepIdx; i++) {
      const s = steps[i];
      let val = "";
      if (s === "operating_structure") val = intakeState.operatingStructure;
      else if (s === "primary_income_model") val = intakeState.primaryIncomeModel;
      else if (s === "revenue_structure") val = intakeState.revenueStructure;
      else if (s === "years_in_structure") val = intakeState.yearsInStructure;
      else if (s.startsWith("q")) {
        const qi = parseInt(s.slice(1)) - 1;
        val = intakeState.answers[qi] || "";
      }
      if (val) rebuilt = advanceIntake(rebuilt, { field: s, value: val });
    }
    setIntakeState(rebuilt);
    setError(null);
  };

  /* ── Run scoring pipeline ── */
  const runScoring = async () => {
    const extracted = extractInputs(intakeState);
    if (!extracted) { setError("Incomplete assessment data."); return; }

    setScoring(true);
    setError(null);

    try {
      const { executeAssessment } = await import("@/lib/engine/v2/index");
      const assessmentRecord = executeAssessment({ rawInputs: extracted.rawInputs, profile: extracted.profile });
      const interpretation = generateInterpretation(assessmentRecord, clientName, sector);

      const gatekeeperResult = await runGatekeeper({
        advisorCode, clientId, clientName,
        profile: extracted.profile,
        rawInputs: extracted.rawInputs,
        interpretation,
        intakeAgentVersion: INTAKE_AGENT_VERSION,
        interpretationAgentVersion: INTERPRETATION_AGENT_VERSION,
      });

      if (!gatekeeperResult.valid || !gatekeeperResult.record) {
        setError(`Validation failed: ${gatekeeperResult.errors.join(", ")}`);
        setScoring(false);
        return;
      }

      const canonicalRecord = gatekeeperResult.record;

      try {
        await fetch(`${WORKER_URL}/advisor/save-record`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            advisor_code: advisorCode,
            record_id: canonicalRecord.record_id,
            client_id: clientId,
            client_name: clientName,
            industry_sector: sector,
            score: interpretation.score,
            band: interpretation.band,
            top_risk: interpretation.top_risk,
            checksum: canonicalRecord.checksum,
            model_version: canonicalRecord.model_version,
            record_data: JSON.stringify(canonicalRecord),
          }),
        });
      } catch { /* non-blocking */ }

      try {
        await fetch(`${WORKER_URL}/advisor/meter`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ advisor_code: advisorCode, assessment_id: canonicalRecord.record_id, client_name: clientName }),
        });
      } catch { /* non-blocking */ }

      onComplete({ score: interpretation.score, band: interpretation.band, topRisk: interpretation.top_risk, assessmentId: canonicalRecord.record_id, canonicalRecord, interpretation });
    } catch {
      setError("Assessment failed. Please try again.");
      setScoring(false);
    }
  };

  /* ── Shared layout shell ── */
  const shell = (children: React.ReactNode) => (
    <div style={{
      marginTop: 16,
      borderRadius: 16,
      border: `1px solid rgba(14,26,43,0.10)`,
      backgroundColor: C.white,
      overflow: "hidden",
    }}>
      {/* Header strip */}
      <div style={{
        padding: mobile ? "14px 16px" : "14px 20px",
        borderBottom: `1px solid rgba(14,26,43,0.07)`,
        display: "flex", alignItems: "center", justifyContent: "space-between",
        backgroundColor: "rgba(14,26,43,0.02)",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          {stepIndex > 0 && currentStep !== "review" && (
            <button
              onClick={handleBack}
              style={{
                background: "none", border: "none", cursor: "pointer",
                fontSize: 13, fontWeight: 600, color: C.textMuted,
                padding: 0, fontFamily: sans, lineHeight: 1,
              }}
            >
              ←
            </button>
          )}
          <span style={{ fontSize: 13, fontWeight: 600, color: C.navy, fontFamily: sans }}>
            {clientName}
          </span>
          {currentStep !== "review" && (
            <span style={{
              fontSize: 11, fontWeight: 600, color: C.teal,
              letterSpacing: "0.07em", textTransform: "uppercase",
              fontFamily: sans,
            }}>
              {isProfileStep
                ? `Setup ${["operating_structure","primary_income_model","revenue_structure","years_in_structure"].indexOf(currentStep as string) + 1} of 4`
                : isQuestionStep
                ? `Question ${qIndex + 1} of 6`
                : ""}
            </span>
          )}
        </div>
        <button
          onClick={onCancel}
          style={{
            background: "none", border: "none", cursor: "pointer",
            fontSize: 13, color: C.textMuted, fontFamily: sans, padding: 0,
          }}
        >
          Cancel
        </button>
      </div>

      {/* Progress bar */}
      <div style={{ height: 2, backgroundColor: "rgba(14,26,43,0.05)" }}>
        <div style={{
          height: "100%", backgroundColor: C.teal,
          width: `${progressPct}%`,
          transition: "width 300ms cubic-bezier(0.22,1,0.36,1)",
        }} />
      </div>

      {/* Body */}
      <div style={{ padding: mobile ? "20px 16px" : "24px 24px" }}>
        {children}
      </div>
    </div>
  );

  /* ── Scoring ── */
  if (scoring) {
    return shell(
      <div style={{ textAlign: "center", padding: "20px 0" }}>
        <div style={{
          width: 32, height: 32, borderRadius: "50%",
          border: `2px solid rgba(31,109,122,0.15)`, borderTopColor: C.teal,
          margin: "0 auto 16px",
          animation: "spin 0.8s linear infinite",
        }} />
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        <p style={{ fontSize: 14, fontWeight: 500, color: C.textSecondary, margin: 0, fontFamily: sans }}>
          Scoring {clientName}&rsquo;s income structure&hellip;
        </p>
      </div>
    );
  }

  /* ── Review ── */
  if (currentStep === "review") {
    return shell(
      <div>
        <p style={{ fontSize: 14, color: C.textSecondary, margin: "0 0 20px", fontFamily: sans, lineHeight: 1.6 }}>
          All fields complete. Generate the Income Stability Score™ for {clientName}.
        </p>

        {intakeState.ambiguityFlags.length > 0 && (
          <div style={{ marginBottom: 16 }}>
            {intakeState.ambiguityFlags.map((flag, i) => (
              <div key={i} style={{
                padding: "10px 14px", borderRadius: 8, marginBottom: 8,
                backgroundColor: "rgba(208,162,58,0.06)", border: "1px solid rgba(208,162,58,0.18)",
              }}>
                <p style={{ fontSize: 13, color: C.moderate, margin: 0, fontWeight: 600, fontFamily: sans }}>{flag}</p>
              </div>
            ))}
          </div>
        )}

        <div style={{ display: "flex", gap: 10 }}>
          <button onClick={handleBack} style={{
            padding: "10px 20px", fontSize: 14, fontWeight: 600, fontFamily: sans,
            color: C.textMuted, backgroundColor: "transparent",
            border: `1px solid rgba(14,26,43,0.14)`, borderRadius: 10, cursor: "pointer",
          }}>
            Back
          </button>
          <button onClick={runScoring} style={{
            padding: "10px 28px", fontSize: 14, fontWeight: 600, fontFamily: sans,
            color: C.white, backgroundColor: C.teal,
            border: "none", borderRadius: 10, cursor: "pointer",
            letterSpacing: "0.01em",
          }}>
            Generate Score
          </button>
        </div>

        {error && <p style={{ fontSize: 13, color: C.risk, margin: "12px 0 0", fontFamily: sans }}>{error}</p>}
      </div>
    );
  }

  /* ── Profile steps — button grid (replaces selects) ── */
  if (isProfileStep) {
    const field = PROFILE_FIELDS.find(f => f.step === currentStep);
    if (!field) return null;

    // Use 2-col grid for larger option sets, 1-col for small
    const useTwoCol = field.options.length >= 6;

    return shell(
      <div>
        <div style={{ marginBottom: 20 }}>
          <div style={{
            fontSize: 11, fontWeight: 700, letterSpacing: "0.10em",
            textTransform: "uppercase", color: C.teal, marginBottom: 8, fontFamily: sans,
          }}>
            {field.label}
          </div>
          <p style={{ fontSize: 14, color: C.textSecondary, margin: 0, fontFamily: sans, lineHeight: 1.5 }}>
            {field.description}
          </p>
        </div>

        {intakeState.ambiguityFlags.length > 0 && (
          <div style={{ marginBottom: 14 }}>
            {intakeState.ambiguityFlags.map((flag, i) => (
              <div key={i} style={{
                padding: "8px 12px", borderRadius: 8, marginBottom: 6,
                backgroundColor: "rgba(208,162,58,0.06)", border: "1px solid rgba(208,162,58,0.18)",
              }}>
                <p style={{ fontSize: 13, color: C.moderate, margin: 0, fontFamily: sans }}>{flag}</p>
              </div>
            ))}
          </div>
        )}

        <div style={{
          display: "grid",
          gridTemplateColumns: useTwoCol && !mobile ? "1fr 1fr" : "1fr",
          gap: 7,
        }}>
          {field.options.map(opt => (
            <button
              key={opt.display}
              onClick={() => handleProfileSelect(currentStep, opt.display, opt.value)}
              style={{
                padding: "12px 14px",
                backgroundColor: C.white,
                border: `1.5px solid rgba(14,26,43,0.10)`,
                borderRadius: 10, cursor: "pointer",
                textAlign: "left", fontFamily: sans,
                fontSize: 13, fontWeight: 500, color: C.textPrimary,
                display: "flex", alignItems: "center", justifyContent: "space-between",
                transition: "border-color 130ms, background-color 130ms",
              }}
              onMouseEnter={e => {
                e.currentTarget.style.borderColor = C.teal;
                e.currentTarget.style.backgroundColor = "rgba(31,109,122,0.03)";
              }}
              onMouseLeave={e => {
                e.currentTarget.style.borderColor = "rgba(14,26,43,0.10)";
                e.currentTarget.style.backgroundColor = C.white;
              }}
            >
              <span style={{ lineHeight: 1.3 }}>{opt.display}</span>
              <span style={{ color: "rgba(14,26,43,0.22)", fontSize: 12, flexShrink: 0, marginLeft: 10 }}>→</span>
            </button>
          ))}
        </div>

        {error && <p style={{ fontSize: 13, color: C.risk, margin: "12px 0 0", fontFamily: sans }}>{error}</p>}
      </div>
    );
  }

  /* ── Question steps ── */
  if (isQuestionStep && qIndex >= 0 && qIndex < 6) {
    const q = questions[qIndex];
    const selectedAnswer = intakeState.answers[qIndex] || "";

    return shell(
      <div>
        <div style={{ marginBottom: 18 }}>
          <div style={{
            fontSize: 11, fontWeight: 700, letterSpacing: "0.10em",
            textTransform: "uppercase", color: C.teal, marginBottom: 8, fontFamily: sans,
          }}>
            {q.title}
          </div>
          <p style={{ fontSize: 15, fontWeight: 600, color: C.navy, margin: "0 0 4px", lineHeight: 1.35, fontFamily: sans }}>
            {q.prompt}
          </p>
          {q.note && (
            <p style={{ fontSize: 13, color: C.textSecondary, margin: 0, lineHeight: 1.5, fontFamily: sans }}>
              {q.note}
            </p>
          )}
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 7 }}>
          {q.options.map(opt => {
            const isSelected = selectedAnswer === opt.letter;
            return (
              <button
                key={opt.letter}
                onClick={() => handleAnswer(opt.letter)}
                style={{
                  display: "flex", alignItems: "center", gap: 12,
                  padding: "11px 14px", borderRadius: 10, cursor: "pointer",
                  border: isSelected ? `1.5px solid ${C.teal}` : `1.5px solid rgba(14,26,43,0.09)`,
                  backgroundColor: isSelected ? "rgba(31,109,122,0.05)" : C.white,
                  textAlign: "left", fontFamily: sans, fontSize: 13, color: C.textPrimary,
                  transition: "border-color 130ms, background-color 130ms",
                  boxShadow: isSelected ? `0 0 0 2px rgba(31,109,122,0.12)` : "none",
                }}
              >
                {/* Radio circle */}
                <div style={{
                  width: 20, height: 20, borderRadius: "50%", flexShrink: 0,
                  border: `2px solid ${isSelected ? C.teal : "rgba(14,26,43,0.18)"}`,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  transition: "border-color 130ms",
                }}>
                  {isSelected && (
                    <div style={{ width: 9, height: 9, borderRadius: "50%", backgroundColor: C.teal }} />
                  )}
                </div>
                <span style={{ fontWeight: isSelected ? 600 : 400, lineHeight: 1.35 }}>
                  {opt.text}
                </span>
              </button>
            );
          })}
        </div>

        {error && <p style={{ fontSize: 13, color: C.risk, margin: "12px 0 0", fontFamily: sans }}>{error}</p>}
      </div>
    );
  }

  return null;
}
