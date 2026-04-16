"use client";

import { useState } from "react";
import { C, mono, sans } from "@/lib/design-tokens";
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

/* ── Display-name → engine-value mappers ── */
const structureMap: Record<string, string> = { "Employee (W-2)": "solo_service", "Independent Contractor": "solo_service", "Business Owner / Firm": "small_agency", "Partnership": "small_agency", "Nonprofit Organization": "small_agency" };
const modelMap: Record<string, string> = { "Employee Salary": "salary", "Commission-Based": "commission", "Contract-Based": "project_fee", "Consulting / Client Services": "retainer", "Agency / Brokerage Income": "commission", "Project-Based Work": "project_fee", "Subscription / Retainer Services": "subscription", "Licensing / Royalty Income": "licensing", "Product Sales": "ecommerce", "Digital Product Sales": "digital_products", "Real Estate Rental Income": "rental", "Real Estate Brokerage Income": "commission", "Hybrid Multiple Income Sources": "mixed_services" };
const revenueMap: Record<string, string> = { "Mostly One-Time Payments": "active_heavy", "Repeat Clients / Returning Customers": "hybrid", "Monthly Recurring Payments": "recurring_heavy", "Contracted Multi-Month Revenue": "recurring_heavy", "Long-Term Recurring Income": "asset_heavy", "Mixed Revenue Structure": "mixed" };

/* ── Display options ── */
const PROFILE_FIELDS: { step: IntakeStep; label: string; options: { display: string; value: string }[]; mapper: Record<string, string> }[] = [
  {
    step: "operating_structure", label: "Operating structure",
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
    step: "primary_income_model", label: "Primary income model",
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
    step: "revenue_structure", label: "Revenue structure",
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
    step: "years_in_structure", label: "Years in this structure",
    options: [
      { display: "Less than 1 year", value: "Less than 1 year" },
      { display: "1\u20133 years", value: "1\u20133 years" },
      { display: "3\u20135 years", value: "3\u20135 years" },
      { display: "5+ years", value: "5+ years" },
    ],
    mapper: {},
  },
];

/* ─�� Props ── */
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

  // Intake Agent is the single source of truth for flow state
  const [intakeState, setIntakeState] = useState<IntakeState>(() => createInitialState(sector));
  const [scoring, setScoring] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Track display values for selects (agent stores engine values)
  const [displayValues, setDisplayValues] = useState<Record<string, string>>({});

  const currentStep = intakeState.currentStep;
  const stepIndex = getStepIndex(currentStep);
  const isProfileStep = ["operating_structure", "primary_income_model", "revenue_structure", "years_in_structure"].includes(currentStep);
  const isQuestionStep = currentStep.startsWith("q") && currentStep.length === 2;
  const qIndex = isQuestionStep ? parseInt(currentStep.slice(1)) - 1 : -1;

  /* ── Styles ── */
  const selectStyle: React.CSSProperties = {
    width: "100%", padding: "12px 14px", fontSize: 15, fontFamily: sans,
    border: `1px solid ${C.borderSoft}`, borderRadius: 10,
    backgroundColor: C.panelFill, color: C.textPrimary, outline: "none", boxSizing: "border-box",
    appearance: "none" as const,
    backgroundImage: `url("data:image/svg+xml,%3Csvg width='12' height='8' viewBox='0 0 12 8' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M1 1.5L6 6.5L11 1.5' stroke='%235E6873' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E")`,
    backgroundRepeat: "no-repeat",
    backgroundPosition: "right 14px center",
    paddingRight: 36,
  };

  /* ── Handle profile field selection ── */
  const handleProfileSelect = (step: IntakeStep, displayValue: string, engineValue: string) => {
    setDisplayValues(prev => ({ ...prev, [step]: displayValue }));
    const next = advanceIntake(intakeState, { field: step, value: engineValue });
    setIntakeState(next);
    setError(next.errors.length > 0 ? next.errors[0] : null);
  };

  /* ── Handle question answer ── */
  const handleAnswer = (letter: string) => {
    const next = advanceIntake(intakeState, { field: currentStep, value: letter });
    setIntakeState(next);
    setError(next.errors.length > 0 ? next.errors[0] : null);
  };

  /* ── Handle back navigation ── */
  const handleBack = () => {
    // Reconstruct previous step by creating a new state and replaying
    // For simplicity, rebuild from scratch up to the previous step
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
    if (!extracted) {
      setError("Incomplete assessment data.");
      return;
    }

    setScoring(true);
    setError(null);

    try {
      // 1. Run engine
      const { executeAssessment } = await import("@/lib/engine/v2/index");
      const assessmentRecord = executeAssessment({
        rawInputs: extracted.rawInputs,
        profile: extracted.profile,
      });

      // 2. Interpretation Agent
      const interpretation = generateInterpretation(assessmentRecord, clientName, sector);

      // 3. Gatekeeper — validate, stamp, issue canonical record
      const gatekeeperResult = await runGatekeeper({
        advisorCode,
        clientId,
        clientName,
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

      // 4. Persist record to server
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
      } catch { /* persistence failure shouldn't block results */ }

      // 5. Meter usage
      try {
        await fetch(`${WORKER_URL}/advisor/meter`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            advisor_code: advisorCode,
            assessment_id: canonicalRecord.record_id,
            client_name: clientName,
          }),
        });
      } catch { /* metering failure shouldn't block results */ }

      onComplete({
        score: interpretation.score,
        band: interpretation.band,
        topRisk: interpretation.top_risk,
        assessmentId: canonicalRecord.record_id,
        canonicalRecord,
        interpretation,
      });
    } catch {
      setError("Assessment failed. Please try again.");
      setScoring(false);
    }
  };

  /* ── Container ── */
  const container: React.CSSProperties = {
    marginTop: 12, padding: mobile ? "20px 16px" : "24px 24px", borderRadius: 14,
    backgroundColor: "rgba(31,109,122,0.03)", border: `1px solid rgba(31,109,122,0.10)`,
  };

  const cancelBtn = (
    <button onClick={onCancel} style={{
      fontSize: 13, color: C.textMuted, background: "none", border: "none", cursor: "pointer",
      textDecoration: "underline", textUnderlineOffset: "2px", fontFamily: sans,
    }}>
      Cancel
    </button>
  );

  /* ── Scoring state ── */
  if (scoring) {
    return (
      <div style={{ ...container, textAlign: "center", padding: "32px 24px" }}>
        <div style={{
          width: 36, height: 36, borderRadius: 18, margin: "0 auto 16px",
          border: `3px solid ${C.border}`, borderTopColor: C.teal,
          animation: "spin 0.8s linear infinite",
        }} />
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        <p style={{ fontSize: 15, color: C.textSecondary, margin: 0 }}>
          Scoring {clientName}&rsquo;s income structure...
        </p>
      </div>
    );
  }

  /* ── Review step ── */
  if (currentStep === "review") {
    return (
      <div style={container}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
          <p style={{ fontSize: 15, fontWeight: 700, color: C.navy, margin: 0 }}>
            Review &mdash; {clientName}
          </p>
          {cancelBtn}
        </div>
        <p style={{ fontSize: 13, color: C.textSecondary, margin: "0 0 16px" }}>
          All fields complete. Confirm to generate the Income Stability Score&#8482;.
        </p>

        {intakeState.ambiguityFlags.length > 0 && (
          <div style={{ marginBottom: 16 }}>
            {intakeState.ambiguityFlags.map((flag, i) => (
              <div key={i} style={{
                padding: "10px 14px", borderRadius: 8, marginBottom: 8,
                backgroundColor: "rgba(208,162,58,0.08)", border: "1px solid rgba(208,162,58,0.20)",
              }}>
                <p style={{ fontSize: 13, color: C.moderate, margin: 0, fontWeight: 600 }}>
                  {flag}
                </p>
              </div>
            ))}
          </div>
        )}

        <div style={{ display: "flex", gap: 10 }}>
          <button onClick={handleBack} style={{
            padding: "10px 20px", fontSize: 14, fontWeight: 600, fontFamily: sans,
            color: C.textMuted, backgroundColor: "transparent",
            border: `1px solid ${C.borderSoft}`, borderRadius: 10, cursor: "pointer",
          }}>
            Back
          </button>
          <button onClick={runScoring} style={{
            padding: "10px 24px", fontSize: 14, fontWeight: 600, fontFamily: sans,
            color: C.white, backgroundColor: C.teal,
            border: "none", borderRadius: 10, cursor: "pointer",
          }}>
            Generate Score
          </button>
        </div>

        {error && <p style={{ fontSize: 13, color: C.risk, margin: "12px 0 0" }}>{error}</p>}
      </div>
    );
  }

  /* ── Profile steps ── */
  if (isProfileStep) {
    const field = PROFILE_FIELDS.find(f => f.step === currentStep);
    if (!field) return null;

    const progressPct = (stepIndex / TOTAL_STEPS) * 100;

    return (
      <div style={container}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
          <p style={{ fontSize: 15, fontWeight: 700, color: C.navy, margin: 0 }}>
            Assess {clientName}
          </p>
          {cancelBtn}
        </div>

        {/* Progress */}
        <div style={{ height: 4, borderRadius: 2, backgroundColor: "rgba(31,109,122,0.10)", marginBottom: 16 }}>
          <div style={{ height: "100%", borderRadius: 2, backgroundColor: C.teal, width: `${progressPct}%`, transition: "width 300ms" }} />
        </div>

        <p style={{ fontSize: 13, color: C.textSecondary, margin: "0 0 12px" }}>
          Classify your client&rsquo;s income structure.
        </p>

        {/* Ambiguity warnings */}
        {intakeState.ambiguityFlags.length > 0 && (
          <div style={{ marginBottom: 12 }}>
            {intakeState.ambiguityFlags.map((flag, i) => (
              <div key={i} style={{
                padding: "10px 14px", borderRadius: 8, marginBottom: 8,
                backgroundColor: "rgba(208,162,58,0.08)", border: "1px solid rgba(208,162,58,0.20)",
              }}>
                <p style={{ fontSize: 13, color: C.moderate, margin: 0 }}>
                  {flag}
                </p>
              </div>
            ))}
          </div>
        )}

        <label style={{ fontSize: 13, fontWeight: 600, color: C.textPrimary, fontFamily: sans, marginBottom: 6, display: "block" }}>
          {field.label}
        </label>
        <select
          value={displayValues[currentStep] || ""}
          onChange={e => {
            const display = e.target.value;
            const engine = field.mapper[display] || display;
            handleProfileSelect(currentStep, display, engine);
          }}
          style={{ ...selectStyle, color: displayValues[currentStep] ? C.textPrimary : C.textMuted, marginBottom: 12 }}
        >
          <option value="" disabled>Select</option>
          {field.options.map(o => <option key={o.display} value={o.display}>{o.display}</option>)}
        </select>

        {stepIndex > 0 && (
          <button onClick={handleBack} style={{
            padding: "8px 16px", fontSize: 13, fontWeight: 600, fontFamily: sans,
            color: C.textMuted, backgroundColor: "transparent",
            border: `1px solid ${C.borderSoft}`, borderRadius: 8, cursor: "pointer",
          }}>
            Back
          </button>
        )}

        {error && <p style={{ fontSize: 13, color: C.risk, margin: "8px 0 0" }}>{error}</p>}
      </div>
    );
  }

  /* ── Question steps ── */
  if (isQuestionStep && qIndex >= 0 && qIndex < 6) {
    const q = questions[qIndex];
    const selectedAnswer = intakeState.answers[qIndex] || "";
    const progressPct = (stepIndex / TOTAL_STEPS) * 100;

    return (
      <div style={container}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
          <p style={{ fontSize: 13, fontWeight: 600, color: C.teal, margin: 0, textTransform: "uppercase", letterSpacing: "0.06em" }}>
            Question {qIndex + 1} of 6
          </p>
          {cancelBtn}
        </div>

        {/* Progress */}
        <div style={{ height: 4, borderRadius: 2, backgroundColor: "rgba(31,109,122,0.10)", marginBottom: 16 }}>
          <div style={{ height: "100%", borderRadius: 2, backgroundColor: C.teal, width: `${progressPct}%`, transition: "width 300ms" }} />
        </div>

        <p style={{ fontSize: 11, fontWeight: 600, color: C.textMuted, margin: "0 0 4px", textTransform: "uppercase", letterSpacing: "0.06em" }}>
          {q.title}
        </p>
        <p style={{ fontSize: 16, fontWeight: 600, color: C.navy, margin: "0 0 6px", lineHeight: 1.4 }}>
          {q.prompt}
        </p>
        {q.note && (
          <p style={{ fontSize: 13, color: C.textSecondary, margin: "0 0 14px", lineHeight: 1.4 }}>
            {q.note}
          </p>
        )}

        <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 16 }}>
          {q.options.map(opt => {
            const isSelected = selectedAnswer === opt.letter;
            return (
              <button
                key={opt.letter}
                onClick={() => handleAnswer(opt.letter)}
                style={{
                  display: "flex", alignItems: "center", gap: 12,
                  padding: "12px 16px", borderRadius: 10, cursor: "pointer",
                  border: isSelected ? `2px solid ${C.teal}` : `1px solid ${C.borderSoft}`,
                  backgroundColor: isSelected ? "rgba(31,109,122,0.06)" : C.white,
                  textAlign: "left", fontFamily: sans, fontSize: 14, color: C.textPrimary,
                  transition: "border-color 150ms, background-color 150ms",
                }}
              >
                <span style={{
                  width: 28, height: 28, borderRadius: 8, flexShrink: 0,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: 13, fontWeight: 700, fontFamily: mono,
                  color: isSelected ? C.white : C.textMuted,
                  backgroundColor: isSelected ? C.teal : C.panelFill,
                  transition: "all 150ms",
                }}>
                  {opt.letter}
                </span>
                {opt.text}
              </button>
            );
          })}
        </div>

        <button onClick={handleBack} style={{
          padding: "10px 20px", fontSize: 14, fontWeight: 600, fontFamily: sans,
          color: C.textMuted, backgroundColor: "transparent",
          border: `1px solid ${C.borderSoft}`, borderRadius: 10, cursor: "pointer",
        }}>
          Back
        </button>

        {error && <p style={{ fontSize: 13, color: C.risk, margin: "12px 0 0" }}>{error}</p>}
      </div>
    );
  }

  return null;
}
