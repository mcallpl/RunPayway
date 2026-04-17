"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { buildFreeQuestions } from "@/lib/questions-free";
import { trackAssessmentComplete } from "@/lib/analytics";

const loadEngine = () => import("@/lib/engine/v2/index");
const loadAdapter = () => import("@/lib/v2-to-v1-adapter");

/* ================================================================ */
/* DESIGN                                                            */
/* ================================================================ */

const C = {
  navy: "#0E1A2B",
  purple: "#4B3FAE",
  teal: "#1F6D7A",
  sand: "#F4F1EA",
  white: "#FFFFFF",
  border: "rgba(14,26,43,0.09)",
  text: "#131A22",
  muted: "#5E6873",
  light: "rgba(14,26,43,0.40)",
};

const sans = "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif";

const INDUSTRIES = [
  "Real Estate",
  "Finance / Banking",
  "Insurance",
  "Technology",
  "Healthcare",
  "Legal Services",
  "Consulting / Professional Services",
  "Sales / Brokerage",
  "Media / Entertainment",
  "Construction / Trades",
  "Retail / E-Commerce",
  "Hospitality / Food Service",
  "Transportation / Logistics",
  "Manufacturing",
  "Education",
  "Nonprofit / Public Sector",
  "Agriculture",
  "Energy / Utilities",
  "Other",
];

const SECTOR_MAP: Record<string, string> = {
  "Real Estate": "real_estate",
  "Finance / Banking": "finance_banking",
  "Insurance": "insurance",
  "Technology": "technology",
  "Healthcare": "healthcare",
  "Legal Services": "legal_services",
  "Consulting / Professional Services": "consulting_professional_services",
  "Sales / Brokerage": "sales_brokerage",
  "Media / Entertainment": "media_entertainment",
  "Construction / Trades": "construction_trades",
  "Retail / E-Commerce": "retail_ecommerce",
  "Hospitality / Food Service": "hospitality_food_service",
  "Transportation / Logistics": "transportation_logistics",
  "Manufacturing": "manufacturing",
  "Education": "education",
  "Nonprofit / Public Sector": "nonprofit_public_sector",
  "Agriculture": "agriculture",
  "Energy / Utilities": "energy_utilities",
  "Other": "other",
};

const QUESTIONS = buildFreeQuestions();

/* ================================================================ */
/* MAIN                                                              */
/* ================================================================ */

export default function FreeAssessmentPage() {
  const router = useRouter();
  const [step, setStep] = useState<"industry" | "questions" | "calculating">("industry");
  const [industry, setIndustry] = useState("");
  const [currentQ, setCurrentQ] = useState(0);
  const [answers, setAnswers] = useState<(string | null)[]>(Array(QUESTIONS.length).fill(null));
  const [selected, setSelected] = useState<string | null>(null);
  const [transitioning, setTransitioning] = useState(false);
  const [mobile, setMobile] = useState(false);
  const [calcDot, setCalcDot] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const c = () => setMobile(window.innerWidth <= 768);
    c();
    window.addEventListener("resize", c);
    return () => window.removeEventListener("resize", c);
  }, []);

  // Set up free session
  useEffect(() => {
    const existing = sessionStorage.getItem("rp_purchase_session") || localStorage.getItem("rp_purchase_session");
    if (!existing) {
      const sess = JSON.stringify({ plan_key: "free", status: "paid" });
      sessionStorage.setItem("rp_purchase_session", sess);
      localStorage.setItem("rp_purchase_session", sess);
    }
    localStorage.setItem("rp_previous_plan", "free");
  }, []);

  // Calculating dots animation
  useEffect(() => {
    if (step !== "calculating") return;
    const interval = setInterval(() => setCalcDot(d => (d + 1) % 4), 400);
    return () => clearInterval(interval);
  }, [step]);

  const scrollTop = () => window.scrollTo({ top: 0, behavior: "smooth" });

  /* Industry selection → first question */
  const handleIndustrySelect = (ind: string) => {
    setIndustry(ind);
    setTransitioning(true);
    scrollTop();
    setTimeout(() => {
      setStep("questions");
      setTransitioning(false);
    }, 300);
  };

  /* Select answer for current question */
  const handleSelect = (letter: string) => {
    setSelected(letter);
  };

  /* Advance to next question or submit */
  const handleNext = () => {
    if (!selected) return;
    const updated = [...answers];
    updated[currentQ] = selected;
    setAnswers(updated);

    if (currentQ < QUESTIONS.length - 1) {
      setTransitioning(true);
      scrollTop();
      setTimeout(() => {
        setCurrentQ(q => q + 1);
        setSelected(null);
        setTransitioning(false);
      }, 280);
    } else {
      // All answered — calculate
      runAssessment(updated);
    }
  };

  /* Go back a question */
  const handleBack = () => {
    if (currentQ === 0) {
      setStep("industry");
      setCurrentQ(0);
      setAnswers(Array(QUESTIONS.length).fill(null));
      setSelected(null);
      return;
    }
    setTransitioning(true);
    setTimeout(() => {
      setCurrentQ(q => q - 1);
      setSelected(answers[currentQ - 1]);
      setTransitioning(false);
    }, 200);
  };

  const runAssessment = async (finalAnswers: (string | null)[]) => {
    setStep("calculating");
    scrollTop();

    try {
      const { executeAssessment } = await loadEngine();
      const { adaptV2ToV1 } = await loadAdapter();

      const rawInputs = {
        q1_recurring_revenue_base: finalAnswers[0] as string,
        q2_income_concentration: finalAnswers[1] as string,
        q3_income_source_diversity: finalAnswers[2] as string,
        q4_forward_revenue_visibility: finalAnswers[3] as string,
        q5_earnings_variability: finalAnswers[4] as string,
        q6_income_continuity_without_labor: finalAnswers[5] as string,
      };

      // Derive revenue_structure from Q1 answer
      const revenueStructure = (a: string) => {
        if (a === "A" || a === "B") return "active_heavy";
        if (a === "C") return "hybrid";
        return "recurring_heavy";
      };

      const profileV2 = {
        profile_class: "individual",
        operating_structure: "solo_service",
        primary_income_model: "mixed_services",
        revenue_structure: revenueStructure(finalAnswers[0] as string),
        industry_sector: SECTOR_MAP[industry] ?? "other",
        maturity_stage: "developing",
      };

      const v2Result = executeAssessment({ rawInputs, profile: profileV2 });
      const record = adaptV2ToV1(v2Result) as Record<string, unknown>;

      // Store record
      sessionStorage.setItem("rp_record", JSON.stringify(record));
      localStorage.setItem("rp_record", JSON.stringify(record));

      // Store in records history
      const stored = JSON.parse(localStorage.getItem("rp_records") || "[]");
      stored.push({
        record_id: record.record_id,
        authorization_code: record.authorization_code,
        model_version: record.model_version ?? "RP-2.0",
        final_score: record.final_score,
        stability_band: record.stability_band,
        assessment_date_utc: record.assessment_date_utc,
        issued_timestamp_utc: record.issued_timestamp_utc,
      });
      localStorage.setItem("rp_records", JSON.stringify(stored));

      trackAssessmentComplete(
        (record.final_score as number) || 0,
        industry || undefined,
      );

      // Brief pause for effect, then route
      setTimeout(() => {
        router.push("/free-score");
      }, 1200);

    } catch (err) {
      console.error("Assessment error:", err);
      router.push("/diagnostic-portal");
    }
  };

  const q = QUESTIONS[currentQ];
  const progress = ((currentQ) / QUESTIONS.length) * 100;

  /* ================================================================ */
  /* RENDER                                                            */
  /* ================================================================ */

  // Calculating state
  if (step === "calculating") {
    return (
      <div style={{
        minHeight: "100vh", backgroundColor: C.navy,
        display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
        fontFamily: sans, padding: 40,
      }}>
        <div style={{ textAlign: "center" }}>
          <div style={{ fontSize: 13, fontWeight: 600, letterSpacing: "0.12em", textTransform: "uppercase", color: C.teal, marginBottom: 32 }}>
            RunPayway™
          </div>
          <div style={{ fontSize: mobile ? 22 : 28, fontWeight: 300, color: C.sand, marginBottom: 12, letterSpacing: "-0.02em" }}>
            Calculating your stability class
            {".".repeat(calcDot)}
          </div>
          <p style={{ fontSize: 14, color: "rgba(244,241,234,0.45)", margin: 0 }}>
            Model RP-2.0 · Deterministic
          </p>
        </div>
      </div>
    );
  }

  // Industry selection
  if (step === "industry") {
    return (
      <div style={{ minHeight: "100vh", backgroundColor: C.sand, fontFamily: sans }}>
        <div style={{
          maxWidth: 560, margin: "0 auto",
          padding: mobile ? "48px 28px 64px" : "72px 24px 96px",
          opacity: transitioning ? 0 : 1,
          transition: "opacity 300ms ease",
        }}>
          {/* Header */}
          <div style={{ marginBottom: 40 }}>
            <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: C.teal, marginBottom: 16 }}>
              Free Assessment &middot; RunPayway™
            </div>
            <h1 style={{ fontSize: mobile ? 28 : 36, fontWeight: 700, color: C.navy, marginBottom: 12, lineHeight: 1.15, letterSpacing: "-0.03em" }}>
              What field are you in?
            </h1>
            <p style={{ fontSize: 16, color: C.muted, lineHeight: 1.6, margin: 0 }}>
              This helps us contextualize your stability class. No other personal information is required.
            </p>
          </div>

          {/* Industry grid */}
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {INDUSTRIES.map((ind) => (
              <button
                key={ind}
                onClick={() => handleIndustrySelect(ind)}
                style={{
                  width: "100%", padding: "14px 18px",
                  backgroundColor: C.white, border: `1.5px solid ${C.border}`,
                  borderRadius: 12, cursor: "pointer",
                  fontSize: 15, fontWeight: 500, color: C.text,
                  textAlign: "left", fontFamily: sans,
                  transition: "border-color 150ms, background-color 150ms",
                  display: "flex", alignItems: "center", justifyContent: "space-between",
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.borderColor = C.purple;
                  e.currentTarget.style.backgroundColor = "rgba(75,63,174,0.03)";
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.borderColor = C.border;
                  e.currentTarget.style.backgroundColor = C.white;
                }}
              >
                <span>{ind}</span>
                <span style={{ color: C.light, fontSize: 16 }}>→</span>
              </button>
            ))}
          </div>

          <p style={{ fontSize: 12, color: C.light, textAlign: "center", marginTop: 24, marginBottom: 0 }}>
            RunPayway™ · Model RP-2.0 · Not financial advice
          </p>
        </div>
      </div>
    );
  }

  // Questions
  return (
    <div style={{ minHeight: "100vh", backgroundColor: C.sand, fontFamily: sans }}>

      {/* Progress bar */}
      <div style={{ position: "fixed", top: 0, left: 0, right: 0, height: 3, backgroundColor: "rgba(14,26,43,0.06)", zIndex: 100 }}>
        <div style={{
          height: "100%", backgroundColor: C.teal,
          width: `${progress}%`,
          transition: "width 400ms cubic-bezier(0.22,1,0.36,1)",
        }} />
      </div>

      <div ref={containerRef} style={{
        maxWidth: 560, margin: "0 auto",
        padding: mobile ? "56px 28px 80px" : "80px 24px 96px",
        opacity: transitioning ? 0 : 1,
        transition: "opacity 280ms ease",
      }}>

        {/* Step indicator */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 36 }}>
          <button
            onClick={handleBack}
            style={{
              background: "none", border: "none", cursor: "pointer",
              fontSize: 13, fontWeight: 600, color: C.muted,
              padding: 0, fontFamily: sans,
            }}
          >
            ← Back
          </button>
          <span style={{ fontSize: 12, fontWeight: 600, color: C.light }}>
            {currentQ + 1} of {QUESTIONS.length}
          </span>
        </div>

        {/* Question */}
        <div style={{ marginBottom: 36 }}>
          <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.10em", textTransform: "uppercase", color: C.teal, marginBottom: 14 }}>
            {q.title}
          </div>
          <h2 style={{
            fontSize: mobile ? 22 : 26, fontWeight: 700, color: C.navy,
            lineHeight: 1.25, letterSpacing: "-0.025em", marginBottom: q.hint ? 12 : 0,
          }}>
            {q.prompt}
          </h2>
          {q.hint && (
            <p style={{ fontSize: 14, color: C.muted, lineHeight: 1.6, margin: 0 }}>
              {q.hint}
            </p>
          )}
        </div>

        {/* Options */}
        <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 36 }}>
          {q.options.map((opt) => {
            const isSelected = selected === opt.letter;
            return (
              <button
                key={opt.letter}
                onClick={() => handleSelect(opt.letter)}
                style={{
                  width: "100%", padding: "16px 18px",
                  backgroundColor: isSelected ? "rgba(75,63,174,0.06)" : C.white,
                  border: `1.5px solid ${isSelected ? C.purple : C.border}`,
                  borderRadius: 12, cursor: "pointer",
                  display: "flex", alignItems: "center", gap: 14,
                  textAlign: "left", fontFamily: sans,
                  transition: "border-color 150ms, background-color 150ms",
                }}
                onMouseEnter={e => {
                  if (!isSelected) {
                    e.currentTarget.style.borderColor = "rgba(75,63,174,0.35)";
                    e.currentTarget.style.backgroundColor = "rgba(75,63,174,0.02)";
                  }
                }}
                onMouseLeave={e => {
                  if (!isSelected) {
                    e.currentTarget.style.borderColor = C.border;
                    e.currentTarget.style.backgroundColor = C.white;
                  }
                }}
              >
                {/* Letter badge */}
                <div style={{
                  width: 28, height: 28, borderRadius: 8, flexShrink: 0,
                  backgroundColor: isSelected ? C.purple : "rgba(14,26,43,0.06)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  transition: "background-color 150ms",
                }}>
                  <span style={{ fontSize: 12, fontWeight: 700, color: isSelected ? C.white : C.muted }}>
                    {opt.letter}
                  </span>
                </div>
                <span style={{ fontSize: 15, fontWeight: isSelected ? 600 : 400, color: isSelected ? C.navy : C.text, lineHeight: 1.4 }}>
                  {opt.text}
                </span>
              </button>
            );
          })}
        </div>

        {/* Continue */}
        <button
          onClick={handleNext}
          disabled={!selected}
          style={{
            width: "100%", height: 54, borderRadius: 14,
            backgroundColor: selected ? C.purple : "rgba(14,26,43,0.08)",
            color: selected ? C.white : C.light,
            border: "none", cursor: selected ? "pointer" : "default",
            fontSize: 16, fontWeight: 600, fontFamily: sans,
            transition: "background-color 200ms, color 200ms",
          }}
        >
          {currentQ === QUESTIONS.length - 1 ? "See My Stability Class" : "Continue →"}
        </button>

        <p style={{ fontSize: 12, color: C.light, textAlign: "center", marginTop: 16, marginBottom: 0 }}>
          RunPayway™ · Free · No account required
        </p>
      </div>
    </div>
  );
}
