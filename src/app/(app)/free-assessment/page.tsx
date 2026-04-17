"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { buildFreeQuestions } from "@/lib/questions-free";
import { trackAssessmentComplete } from "@/lib/analytics";

const loadEngine = () => import("@/lib/engine/v2/index");
const loadAdapter = () => import("@/lib/v2-to-v1-adapter");

/* ================================================================ */
/* DESIGN TOKENS                                                     */
/* ================================================================ */

const C = {
  navy:   "#0E1A2B",
  purple: "#4B3FAE",
  teal:   "#1F6D7A",
  sand:   "#F4F1EA",
  white:  "#FFFFFF",
  border: "rgba(14,26,43,0.09)",
  text:   "#131A22",
  muted:  "#5E6873",
  light:  "rgba(14,26,43,0.38)",
};

const sans = "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif";
const mono = '"SF Mono","Fira Code","IBM Plex Mono","Courier New",monospace';

/* ================================================================ */
/* DATA                                                              */
/* ================================================================ */

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

type Step = "entrance" | "industry" | "questions" | "calculating";

export default function FreeAssessmentPage() {
  const router = useRouter();
  const [step, setStep] = useState<Step>("entrance");
  const [entranceVisible, setEntranceVisible] = useState(false);
  const [industry, setIndustry] = useState("");
  const [currentQ, setCurrentQ] = useState(0);
  const [answers, setAnswers] = useState<(string | null)[]>(Array(QUESTIONS.length).fill(null));
  const [selected, setSelected] = useState<string | null>(null);
  const [fading, setFading] = useState(false);
  const [mobile, setMobile] = useState(false);
  const [calcDot, setCalcDot] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const c = () => setMobile(window.innerWidth <= 768);
    c();
    window.addEventListener("resize", c);
    return () => window.removeEventListener("resize", c);
  }, []);

  // Entrance fade-in
  useEffect(() => {
    const t = setTimeout(() => setEntranceVisible(true), 80);
    return () => clearTimeout(t);
  }, []);

  // Auto-advance entrance after 2s
  useEffect(() => {
    if (step !== "entrance") return;
    const t = setTimeout(() => advanceTo("industry"), 2200);
    return () => clearTimeout(t);
  }, [step]);

  // Calculating dots
  useEffect(() => {
    if (step !== "calculating") return;
    const interval = setInterval(() => setCalcDot(d => (d + 1) % 4), 380);
    return () => clearInterval(interval);
  }, [step]);

  // Free session
  useEffect(() => {
    const existing = sessionStorage.getItem("rp_purchase_session") || localStorage.getItem("rp_purchase_session");
    if (!existing) {
      const sess = JSON.stringify({ plan_key: "free", status: "paid" });
      sessionStorage.setItem("rp_purchase_session", sess);
      localStorage.setItem("rp_purchase_session", sess);
    }
    localStorage.setItem("rp_previous_plan", "free");
  }, []);

  const advanceTo = (next: Step) => {
    setFading(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
    setTimeout(() => {
      setStep(next);
      setFading(false);
    }, 320);
  };

  const handleIndustrySelect = (ind: string) => {
    setIndustry(ind);
    advanceTo("questions");
  };

  const handleSelect = (letter: string) => setSelected(letter);

  const handleNext = () => {
    if (!selected) return;
    const updated = [...answers];
    updated[currentQ] = selected;
    setAnswers(updated);

    if (currentQ < QUESTIONS.length - 1) {
      setFading(true);
      window.scrollTo({ top: 0, behavior: "smooth" });
      setTimeout(() => {
        setCurrentQ(q => q + 1);
        setSelected(null);
        setFading(false);
      }, 280);
    } else {
      runAssessment(updated);
    }
  };

  const handleBack = () => {
    if (currentQ === 0) {
      setSelected(null);
      advanceTo("industry");
      return;
    }
    setFading(true);
    setTimeout(() => {
      setCurrentQ(q => q - 1);
      setSelected(answers[currentQ - 1]);
      setFading(false);
    }, 200);
  };

  const runAssessment = async (finalAnswers: (string | null)[]) => {
    setStep("calculating");
    window.scrollTo({ top: 0 });

    try {
      const { executeAssessment } = await loadEngine();
      const { adaptV2ToV1 } = await loadAdapter();

      const rawInputs = {
        q1_recurring_revenue_base:          finalAnswers[0] as string,
        q2_income_concentration:            finalAnswers[1] as string,
        q3_income_source_diversity:         finalAnswers[2] as string,
        q4_forward_revenue_visibility:      finalAnswers[3] as string,
        q5_earnings_variability:            finalAnswers[4] as string,
        q6_income_continuity_without_labor: finalAnswers[5] as string,
      };

      const revenueStructure = (a: string) =>
        a === "A" || a === "B" ? "active_heavy" : a === "C" ? "hybrid" : "recurring_heavy";

      const profileV2 = {
        profile_class:        "individual",
        operating_structure:  "solo_service",
        primary_income_model: "mixed_services",
        revenue_structure:    revenueStructure(finalAnswers[0] as string),
        industry_sector:      SECTOR_MAP[industry] ?? "other",
        maturity_stage:       "developing",
      };

      const v2Result = executeAssessment({ rawInputs, profile: profileV2 });
      const record   = adaptV2ToV1(v2Result) as Record<string, unknown>;

      sessionStorage.setItem("rp_record", JSON.stringify(record));
      localStorage.setItem("rp_record",  JSON.stringify(record));

      const stored = JSON.parse(localStorage.getItem("rp_records") || "[]");
      stored.push({
        record_id:            record.record_id,
        authorization_code:   record.authorization_code,
        model_version:        record.model_version ?? "RP-2.0",
        final_score:          record.final_score,
        stability_band:       record.stability_band,
        assessment_date_utc:  record.assessment_date_utc,
        issued_timestamp_utc: record.issued_timestamp_utc,
      });
      localStorage.setItem("rp_records", JSON.stringify(stored));

      trackAssessmentComplete((record.final_score as number) || 0, industry || undefined);

      setTimeout(() => router.push("/free-score"), 900);
    } catch {
      router.push("/diagnostic-portal");
    }
  };

  /* ================================================================ */
  /* ENTRANCE                                                          */
  /* ================================================================ */

  if (step === "entrance") {
    return (
      <div
        onClick={() => advanceTo("industry")}
        style={{
          position: "fixed", inset: 0, zIndex: 9999,
          backgroundColor: C.navy,
          display: "flex", flexDirection: "column",
          alignItems: "center", justifyContent: "center",
          cursor: "pointer", userSelect: "none",
        }}
      >
        <div style={{
          textAlign: "center",
          opacity: entranceVisible ? 1 : 0,
          transform: entranceVisible ? "translateY(0)" : "translateY(12px)",
          transition: "opacity 700ms cubic-bezier(0.22,1,0.36,1), transform 700ms cubic-bezier(0.22,1,0.36,1)",
        }}>
          <div style={{
            fontSize: 11, fontWeight: 700, letterSpacing: "0.16em",
            textTransform: "uppercase", color: C.teal, marginBottom: 36,
            fontFamily: sans,
          }}>
            RunPayway™
          </div>
          <div style={{
            width: 72, height: 72, borderRadius: "50%",
            border: `1.5px solid rgba(31,109,122,0.30)`,
            display: "flex", alignItems: "center", justifyContent: "center",
            margin: "0 auto 36px",
          }}>
            <div style={{
              width: 10, height: 10, borderRadius: "50%",
              backgroundColor: C.teal,
              boxShadow: `0 0 16px ${C.teal}60`,
            }} />
          </div>
          <h1 style={{
            fontFamily: sans, fontSize: mobile ? 22 : 28, fontWeight: 300,
            letterSpacing: "-0.025em", color: C.sand,
            margin: "0 0 10px",
          }}>
            Income Stability Assessment
          </h1>
          <p style={{
            fontFamily: mono, fontSize: 12, color: "rgba(244,241,234,0.35)",
            margin: "0 0 48px", letterSpacing: "0.04em",
          }}>
            Free &nbsp;&middot;&nbsp; Model RP-2.0 &nbsp;&middot;&nbsp; Deterministic
          </p>
          <p style={{ fontFamily: sans, fontSize: 12, color: "rgba(244,241,234,0.25)", margin: 0 }}>
            Click anywhere to begin
          </p>
        </div>
      </div>
    );
  }

  /* ================================================================ */
  /* CALCULATING                                                       */
  /* ================================================================ */

  if (step === "calculating") {
    return (
      <div style={{
        position: "fixed", inset: 0, backgroundColor: C.navy,
        display: "flex", flexDirection: "column",
        alignItems: "center", justifyContent: "center",
        fontFamily: sans,
      }}>
        <div style={{ textAlign: "center" }}>
          <div style={{
            fontSize: 11, fontWeight: 700, letterSpacing: "0.14em",
            textTransform: "uppercase", color: C.teal, marginBottom: 40,
          }}>
            RunPayway™
          </div>
          <div style={{
            width: 48, height: 48, borderRadius: "50%",
            border: `2px solid rgba(31,109,122,0.20)`,
            borderTopColor: C.teal,
            margin: "0 auto 32px",
            animation: "spin 0.9s linear infinite",
          }} />
          <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
          <p style={{ fontSize: mobile ? 18 : 22, fontWeight: 300, color: C.sand, margin: "0 0 8px", letterSpacing: "-0.02em" }}>
            Determining your stability class{".".repeat(calcDot)}
          </p>
          <p style={{ fontSize: 12, color: "rgba(244,241,234,0.30)", margin: 0, fontFamily: mono }}>
            Model RP-2.0 · Deterministic
          </p>
        </div>
      </div>
    );
  }

  /* ================================================================ */
  /* INDUSTRY SELECTION                                                */
  /* ================================================================ */

  if (step === "industry") {
    return (
      <div style={{
        minHeight: "100vh", backgroundColor: C.sand, fontFamily: sans,
        opacity: fading ? 0 : 1, transition: "opacity 320ms ease",
      }}>
        <div style={{
          maxWidth: 640, margin: "0 auto",
          padding: mobile ? "48px 24px 72px" : "72px 32px 96px",
        }}>
          <div style={{ marginBottom: 40 }}>
            <div style={{
              fontSize: 11, fontWeight: 700, letterSpacing: "0.13em",
              textTransform: "uppercase", color: C.teal, marginBottom: 16,
            }}>
              RunPayway™ &nbsp;&middot;&nbsp; Free Assessment
            </div>
            <h1 style={{
              fontSize: mobile ? 26 : 32, fontWeight: 700, color: C.navy,
              marginBottom: 10, lineHeight: 1.15, letterSpacing: "-0.03em",
            }}>
              What field are you in?
            </h1>
            <p style={{ fontSize: 15, color: C.muted, lineHeight: 1.6, margin: 0, maxWidth: 420 }}>
              This helps contextualize your stability class. No other personal information required.
            </p>
          </div>

          <div style={{
            display: "grid",
            gridTemplateColumns: mobile ? "1fr" : "1fr 1fr",
            gap: 8,
          }}>
            {INDUSTRIES.map((ind) => (
              <button
                key={ind}
                onClick={() => handleIndustrySelect(ind)}
                style={{
                  padding: "14px 18px",
                  backgroundColor: C.white,
                  border: `1.5px solid ${C.border}`,
                  borderRadius: 12, cursor: "pointer",
                  fontSize: 14, fontWeight: 500, color: C.text,
                  textAlign: "left", fontFamily: sans,
                  display: "flex", alignItems: "center", justifyContent: "space-between",
                  transition: "border-color 140ms, background-color 140ms, transform 140ms",
                  lineHeight: 1.3,
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.borderColor = C.purple;
                  e.currentTarget.style.backgroundColor = "rgba(75,63,174,0.03)";
                  e.currentTarget.style.transform = "translateY(-1px)";
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.borderColor = C.border;
                  e.currentTarget.style.backgroundColor = C.white;
                  e.currentTarget.style.transform = "translateY(0)";
                }}
              >
                <span>{ind}</span>
                <span style={{ color: "rgba(14,26,43,0.25)", fontSize: 13, flexShrink: 0, marginLeft: 12 }}>→</span>
              </button>
            ))}
          </div>

          <p style={{ fontSize: 12, color: C.light, textAlign: "center", marginTop: 28, marginBottom: 0 }}>
            RunPayway™ &nbsp;&middot;&nbsp; Model RP-2.0 &nbsp;&middot;&nbsp; Not financial advice
          </p>
        </div>
      </div>
    );
  }

  /* ================================================================ */
  /* QUESTIONS                                                         */
  /* ================================================================ */

  const q = QUESTIONS[currentQ];
  const progressPct = ((currentQ + 1) / QUESTIONS.length) * 100;

  return (
    <div style={{
      minHeight: "100vh", backgroundColor: C.sand, fontFamily: sans,
      opacity: fading ? 0 : 1, transition: "opacity 280ms ease",
    }}>

      {/* Fixed progress bar */}
      <div style={{ position: "fixed", top: 0, left: 0, right: 0, height: 3, backgroundColor: "rgba(14,26,43,0.06)", zIndex: 100 }}>
        <div style={{
          height: "100%", backgroundColor: C.teal,
          width: `${progressPct}%`,
          transition: "width 400ms cubic-bezier(0.22,1,0.36,1)",
        }} />
      </div>

      <div ref={containerRef} style={{
        maxWidth: 580, margin: "0 auto",
        padding: mobile ? "56px 24px 80px" : "80px 32px 96px",
      }}>

        {/* Top row */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 44 }}>
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
          <div style={{ display: "flex", gap: 5 }}>
            {QUESTIONS.map((_, i) => (
              <div
                key={i}
                style={{
                  width: i === currentQ ? 20 : 6,
                  height: 6, borderRadius: 3,
                  backgroundColor: i <= currentQ ? C.teal : "rgba(14,26,43,0.10)",
                  transition: "width 300ms, background-color 300ms",
                }}
              />
            ))}
          </div>
          <span style={{ fontFamily: mono, fontSize: 11, color: C.light }}>
            {currentQ + 1} / {QUESTIONS.length}
          </span>
        </div>

        {/* Question header */}
        <div style={{ marginBottom: 32 }}>
          <div style={{
            fontSize: 11, fontWeight: 700, letterSpacing: "0.11em",
            textTransform: "uppercase", color: C.teal, marginBottom: 14,
          }}>
            {q.title}
          </div>
          <h2 style={{
            fontSize: mobile ? 21 : 25, fontWeight: 700, color: C.navy,
            lineHeight: 1.25, letterSpacing: "-0.025em",
            marginBottom: q.hint ? 10 : 0,
          }}>
            {q.prompt}
          </h2>
          {q.hint && (
            <p style={{ fontSize: 14, color: C.muted, lineHeight: 1.65, margin: 0 }}>
              {q.hint}
            </p>
          )}
        </div>

        {/* Options — radio circle style, no letter badges */}
        <div role="radiogroup" aria-label={q.title} style={{ display: "flex", flexDirection: "column", gap: 9, marginBottom: 36 }}>
          {q.options.map((opt) => {
            const isSelected = selected === opt.letter;
            return (
              <button
                key={opt.letter}
                role="radio"
                aria-checked={isSelected}
                onClick={() => handleSelect(opt.letter)}
                style={{
                  width: "100%", padding: "15px 18px",
                  backgroundColor: isSelected ? "rgba(75,63,174,0.04)" : C.white,
                  border: `1.5px solid ${isSelected ? C.purple : C.border}`,
                  borderRadius: 12, cursor: "pointer",
                  display: "flex", alignItems: "center", gap: 14,
                  textAlign: "left", fontFamily: sans,
                  transition: "border-color 140ms, background-color 140ms",
                  boxShadow: isSelected ? "0 0 0 3px rgba(75,63,174,0.08)" : "none",
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
                <div style={{
                  width: 22, height: 22, borderRadius: "50%", flexShrink: 0,
                  border: `2px solid ${isSelected ? C.purple : "rgba(14,26,43,0.18)"}`,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  transition: "border-color 140ms",
                }}>
                  {isSelected && (
                    <div style={{ width: 10, height: 10, borderRadius: "50%", backgroundColor: C.purple }} />
                  )}
                </div>
                <span style={{
                  fontSize: 15, lineHeight: 1.4,
                  fontWeight: isSelected ? 600 : 400,
                  color: isSelected ? C.navy : C.text,
                }}>
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
            backgroundColor: selected ? C.purple : "rgba(14,26,43,0.07)",
            color: selected ? C.white : C.light,
            border: "none", cursor: selected ? "pointer" : "default",
            fontSize: 15, fontWeight: 600, fontFamily: sans,
            transition: "background-color 200ms, color 200ms",
          }}
        >
          {currentQ === QUESTIONS.length - 1 ? "See My Stability Class →" : "Continue →"}
        </button>

        <p style={{ fontSize: 12, color: C.light, textAlign: "center", marginTop: 16, marginBottom: 0 }}>
          RunPayway™ &nbsp;&middot;&nbsp; Free &nbsp;&middot;&nbsp; No account required
        </p>
      </div>
    </div>
  );
}
