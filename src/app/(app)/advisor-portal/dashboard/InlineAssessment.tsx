"use client";

import { useState } from "react";
import Link from "next/link";
import { C, mono, sans } from "@/lib/design-tokens";
import { buildAdvisorQuestions } from "@/lib/advisor-questions";
import { mapIndustryToSector } from "@/lib/industry-map";
import { WORKER_URL } from "@/lib/config";

/* ── Profile field options (same as consumer diagnostic) ── */
const OPERATING_STRUCTURES = [
  "Employee (W-2)",
  "Independent Contractor",
  "Business Owner / Firm",
  "Partnership",
  "Nonprofit Organization",
];

const INCOME_MODELS = [
  "Employee Salary",
  "Commission-Based",
  "Contract-Based",
  "Consulting / Client Services",
  "Agency / Brokerage Income",
  "Project-Based Work",
  "Subscription / Retainer Services",
  "Licensing / Royalty Income",
  "Product Sales",
  "Digital Product Sales",
  "Real Estate Rental Income",
  "Real Estate Brokerage Income",
  "Hybrid Multiple Income Sources",
];

const REVENUE_STRUCTURES = [
  "Mostly One-Time Payments",
  "Repeat Clients / Returning Customers",
  "Monthly Recurring Payments",
  "Contracted Multi-Month Revenue",
  "Long-Term Recurring Income",
  "Mixed Revenue Structure",
];

const YEARS_OPTIONS = [
  "Less than 1 year",
  "1\u20133 years",
  "3\u20135 years",
  "5+ years",
];

/* ── Profile-to-engine mappers (same as diagnostic/page.tsx) ── */
const structureMap: Record<string, string> = { "Employee (W-2)": "solo_service", "Independent Contractor": "solo_service", "Business Owner / Firm": "small_agency", "Partnership": "small_agency", "Nonprofit Organization": "small_agency" };
const modelMap: Record<string, string> = { "Employee Salary": "salary", "Commission-Based": "commission", "Contract-Based": "project_fee", "Consulting / Client Services": "retainer", "Agency / Brokerage Income": "commission", "Project-Based Work": "project_fee", "Subscription / Retainer Services": "subscription", "Licensing / Royalty Income": "licensing", "Product Sales": "ecommerce", "Digital Product Sales": "digital_products", "Real Estate Rental Income": "rental", "Real Estate Brokerage Income": "commission", "Hybrid Multiple Income Sources": "mixed_services" };
const revenueMap: Record<string, string> = { "Mostly One-Time Payments": "active_heavy", "Repeat Clients / Returning Customers": "hybrid", "Monthly Recurring Payments": "recurring_heavy", "Contracted Multi-Month Revenue": "recurring_heavy", "Long-Term Recurring Income": "asset_heavy", "Mixed Revenue Structure": "mixed" };

/* ── Constraint key to display label ── */
const CONSTRAINT_LABELS: Record<string, string> = {
  weak_forward_visibility: "Forward Visibility",
  high_labor_dependence: "Labor Dependence",
  high_concentration: "Income Concentration",
  low_persistence: "Low Persistence",
  high_variability: "Income Variability",
  weak_durability: "Source Diversity",
  shallow_continuity: "Source Diversity",
};

/* ── Types ── */
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
  }) => void;
  onCancel: () => void;
}

type Step = "profile" | "questions" | "scoring" | "done";

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
  const [step, setStep] = useState<Step>("profile");

  /* Profile fields */
  const [operatingStructure, setOperatingStructure] = useState("");
  const [incomeModel, setIncomeModel] = useState("");
  const [revenueStructure, setRevenueStructure] = useState("");
  const [yearsInStructure, setYearsInStructure] = useState("");

  /* Questions */
  const sector = mapIndustryToSector(industry);
  const questions = buildAdvisorQuestions(sector);
  const [currentQ, setCurrentQ] = useState(0);
  const [answers, setAnswers] = useState<string[]>([]);

  /* Result */
  const [error, setError] = useState<string | null>(null);

  /* Styles */
  const inputStyle: React.CSSProperties = {
    width: "100%", padding: "12px 14px", fontSize: 15, fontFamily: sans,
    border: `1px solid ${C.borderSoft}`, borderRadius: 10,
    backgroundColor: C.panelFill, color: C.textPrimary, outline: "none", boxSizing: "border-box",
  };
  const selectStyle: React.CSSProperties = {
    ...inputStyle,
    appearance: "none" as const,
    backgroundImage: `url("data:image/svg+xml,%3Csvg width='12' height='8' viewBox='0 0 12 8' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M1 1.5L6 6.5L11 1.5' stroke='%235E6873' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E")`,
    backgroundRepeat: "no-repeat",
    backgroundPosition: "right 14px center",
    paddingRight: 36,
  };
  const labelStyle: React.CSSProperties = {
    fontSize: 13, fontWeight: 600, color: C.textPrimary, fontFamily: sans, marginBottom: 4, display: "block",
  };

  /* ── Step 1: Profile ── */
  if (step === "profile") {
    const canContinue = operatingStructure && incomeModel && revenueStructure && yearsInStructure;
    return (
      <div style={{
        marginTop: 12, padding: mobile ? "20px 16px" : "24px 24px", borderRadius: 14,
        backgroundColor: "rgba(31,109,122,0.03)", border: `1px solid rgba(31,109,122,0.10)`,
      }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
          <p style={{ fontSize: 15, fontWeight: 700, color: C.navy, margin: 0 }}>
            Assess {clientName}
          </p>
          <button onClick={onCancel} style={{
            fontSize: 13, color: C.textMuted, background: "none", border: "none", cursor: "pointer",
            textDecoration: "underline", textUnderlineOffset: "2px", fontFamily: sans,
          }}>
            Cancel
          </button>
        </div>

        <p style={{ fontSize: 13, color: C.textSecondary, margin: "0 0 16px" }}>
          Step 1 of 2 &mdash; Classify your client&rsquo;s income structure.
        </p>

        <div style={{ display: "grid", gridTemplateColumns: mobile ? "1fr" : "1fr 1fr", gap: 12 }}>
          <div>
            <label style={labelStyle}>Operating structure</label>
            <select value={operatingStructure} onChange={e => setOperatingStructure(e.target.value)} style={{ ...selectStyle, color: operatingStructure ? C.textPrimary : C.textMuted }}>
              <option value="" disabled>Select</option>
              {OPERATING_STRUCTURES.map(o => <option key={o} value={o}>{o}</option>)}
            </select>
          </div>
          <div>
            <label style={labelStyle}>Primary income model</label>
            <select value={incomeModel} onChange={e => setIncomeModel(e.target.value)} style={{ ...selectStyle, color: incomeModel ? C.textPrimary : C.textMuted }}>
              <option value="" disabled>Select</option>
              {INCOME_MODELS.map(o => <option key={o} value={o}>{o}</option>)}
            </select>
          </div>
          <div>
            <label style={labelStyle}>Revenue structure</label>
            <select value={revenueStructure} onChange={e => setRevenueStructure(e.target.value)} style={{ ...selectStyle, color: revenueStructure ? C.textPrimary : C.textMuted }}>
              <option value="" disabled>Select</option>
              {REVENUE_STRUCTURES.map(o => <option key={o} value={o}>{o}</option>)}
            </select>
          </div>
          <div>
            <label style={labelStyle}>Years in this structure</label>
            <select value={yearsInStructure} onChange={e => setYearsInStructure(e.target.value)} style={{ ...selectStyle, color: yearsInStructure ? C.textPrimary : C.textMuted }}>
              <option value="" disabled>Select</option>
              {YEARS_OPTIONS.map(o => <option key={o} value={o}>{o}</option>)}
            </select>
          </div>
        </div>

        <button
          onClick={() => canContinue && setStep("questions")}
          disabled={!canContinue}
          style={{
            marginTop: 16, padding: "12px 24px", fontSize: 15, fontWeight: 600, fontFamily: sans,
            color: C.white, backgroundColor: canContinue ? C.teal : C.textMuted,
            border: "none", borderRadius: 10, cursor: canContinue ? "pointer" : "default",
            opacity: canContinue ? 1 : 0.5,
          }}
        >
          Continue to questions
        </button>
      </div>
    );
  }

  /* ── Step 2: Questions (one at a time) ── */
  if (step === "questions") {
    const q = questions[currentQ];
    const selectedAnswer = answers[currentQ] || "";

    const handleAnswer = (letter: string) => {
      const next = [...answers];
      next[currentQ] = letter;
      setAnswers(next);
    };

    const handleNext = async () => {
      if (!selectedAnswer) return;
      if (currentQ < 5) {
        setCurrentQ(currentQ + 1);
      } else {
        // All 6 answered — score
        setStep("scoring");
        setError(null);

        try {
          const rawInputsV2 = {
            q1_recurring_revenue_base: answers[0],
            q2_income_concentration: answers[1],
            q3_income_source_diversity: answers[2],
            q4_forward_revenue_visibility: answers[3],
            q5_earnings_variability: answers[4],
            q6_income_continuity_without_labor: selectedAnswer, // current answer for q6
          };

          const profileV2 = {
            profile_class: "individual" as const,
            operating_structure: structureMap[operatingStructure] || "solo_service",
            primary_income_model: modelMap[incomeModel] || "other",
            revenue_structure: revenueMap[revenueStructure] || "mixed",
            industry_sector: sector,
            maturity_stage: "developing" as const,
          };

          const { executeAssessment } = await import("@/lib/engine/v2/index");
          const record = executeAssessment({
            rawInputs: rawInputsV2,
            profile: profileV2,
          });

          const score = record.scores.overall_score;
          const band = record.bands.primary_band;
          const topRiskKey = record.constraints.root_constraint || record.constraints.primary_constraint;
          const topRisk = CONSTRAINT_LABELS[topRiskKey] || "Income Concentration";
          const assessmentId = record.assessment_id;

          // Meter usage
          try {
            await fetch(`${WORKER_URL}/advisor/meter`, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                advisor_code: advisorCode,
                assessment_id: assessmentId,
                client_name: clientName,
              }),
            });
          } catch { /* metering failure shouldn't block results */ }

          onComplete({ score, band, topRisk, assessmentId });
        } catch (err) {
          setError("Assessment failed. Please try again.");
          setStep("questions");
        }
      }
    };

    const handleBack = () => {
      if (currentQ > 0) {
        setCurrentQ(currentQ - 1);
      } else {
        setStep("profile");
      }
    };

    return (
      <div style={{
        marginTop: 12, padding: mobile ? "20px 16px" : "24px 24px", borderRadius: 14,
        backgroundColor: "rgba(31,109,122,0.03)", border: `1px solid rgba(31,109,122,0.10)`,
      }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
          <p style={{ fontSize: 13, fontWeight: 600, color: C.teal, margin: 0, textTransform: "uppercase", letterSpacing: "0.06em" }}>
            Question {currentQ + 1} of 6
          </p>
          <button onClick={onCancel} style={{
            fontSize: 13, color: C.textMuted, background: "none", border: "none", cursor: "pointer",
            textDecoration: "underline", textUnderlineOffset: "2px", fontFamily: sans,
          }}>
            Cancel
          </button>
        </div>

        {/* Progress bar */}
        <div style={{ height: 4, borderRadius: 2, backgroundColor: "rgba(31,109,122,0.10)", marginBottom: 16 }}>
          <div style={{
            height: "100%", borderRadius: 2, backgroundColor: C.teal,
            width: `${((currentQ + (selectedAnswer ? 1 : 0)) / 6) * 100}%`,
            transition: "width 300ms",
          }} />
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

        <div style={{ display: "flex", gap: 10 }}>
          <button onClick={handleBack} style={{
            padding: "10px 20px", fontSize: 14, fontWeight: 600, fontFamily: sans,
            color: C.textMuted, backgroundColor: "transparent",
            border: `1px solid ${C.borderSoft}`, borderRadius: 10, cursor: "pointer",
          }}>
            Back
          </button>
          <button
            onClick={handleNext}
            disabled={!selectedAnswer}
            style={{
              padding: "10px 24px", fontSize: 14, fontWeight: 600, fontFamily: sans,
              color: C.white, backgroundColor: selectedAnswer ? C.teal : C.textMuted,
              border: "none", borderRadius: 10, cursor: selectedAnswer ? "pointer" : "default",
              opacity: selectedAnswer ? 1 : 0.5,
            }}
          >
            {currentQ < 5 ? "Next" : "Score"}
          </button>
        </div>

        {error && (
          <p style={{ fontSize: 13, color: C.risk, margin: "12px 0 0", fontFamily: sans }}>{error}</p>
        )}
      </div>
    );
  }

  /* ── Step 3: Scoring (brief loading) ── */
  if (step === "scoring") {
    return (
      <div style={{
        marginTop: 12, padding: "32px 24px", borderRadius: 14,
        backgroundColor: "rgba(31,109,122,0.03)", border: `1px solid rgba(31,109,122,0.10)`,
        textAlign: "center",
      }}>
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

  return null;
}
