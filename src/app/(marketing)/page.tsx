"use client";

import { useState, useEffect, useRef } from "react";

/* ================================================================ */
/* HOOKS                                                              */
/* ================================================================ */

function useReducedMotion() {
  const [r, setR] = useState(false);
  useEffect(() => { setR(window.matchMedia("(prefers-reduced-motion: reduce)").matches); }, []);
  return r;
}

function useMobile(bp = 768) {
  const [m, setM] = useState(false);
  useEffect(() => { const c = () => setM(window.innerWidth <= bp); c(); window.addEventListener("resize", c); return () => window.removeEventListener("resize", c); }, [bp]);
  return m;
}

function useFadeIn() {
  const reduced = useReducedMotion();
  return (visible: boolean, delay = 0): React.CSSProperties =>
    reduced ? {} : {
      opacity: visible ? 1 : 0,
      transform: visible ? "translateY(0)" : "translateY(16px)",
      transition: `opacity 600ms cubic-bezier(0.22,1,0.36,1) ${delay}ms, transform 600ms cubic-bezier(0.22,1,0.36,1) ${delay}ms`,
    };
}

/* ================================================================ */
/* DESIGN SYSTEM                                                      */
/* ================================================================ */

const C = {
  navy: "#0E1A2B",
  purple: "#4B3FAE",
  teal: "#1F6D7A",
  sand: "#F4F1EA",
  white: "#FFFFFF",
  panelFill: "#F8F6F1",
  textPrimary: "#131A22",
  textSecondary: "#5E6873",
  textMuted: "#7B848E",
  borderSoft: "#D9D6CF",
  divider: "#EAEAEA",
  risk: "#C74634",
  moderate: "#D0A23A",
  established: "#1F6D7A",
  protected: "#2A6E49",
  sandText: "#F4F1EA",
  sandMuted: "rgba(244,241,234,0.55)",
  sandLight: "rgba(244,241,234,0.40)",
};

const mono = '"SF Mono", "Fira Code", "IBM Plex Mono", "Courier New", monospace';

/* ================================================================ */
/* TYPES                                                              */
/* ================================================================ */

type Section = "landing" | "decision" | "input" | "result" | "checkout" | "success";
type Decision = "mortgage" | "expansion" | "investment" | "timeoff" | null;

interface Inputs {
  incomeType: string;
  concentration: string;
  sources: number;
  visibility: number;
  variability: string;
  continuity: string;
}

interface Result {
  score: number;
  band: "Limited" | "Developing" | "Established" | "High";
  constraint: string;
  alignment: boolean;
  verdict: string;
}

/* ================================================================ */
/* UTILITIES                                                          */
/* ================================================================ */

function generateResult(inputs: Inputs): Result {
  let score = 50;

  if (inputs.concentration === "single") score -= 20;
  if (inputs.concentration === "dual") score -= 5;
  if (inputs.sources >= 5) score += 15;
  if (inputs.sources >= 3) score += 8;
  if (inputs.visibility >= 12) score += 15;
  if (inputs.visibility >= 6) score += 8;
  if (inputs.variability === "high") score -= 15;
  if (inputs.variability === "low") score += 10;
  if (inputs.continuity === "passive") score += 15;
  if (inputs.continuity === "recurring") score += 10;

  score = Math.max(0, Math.min(100, score));

  let band: Result["band"] = "Limited";
  if (score >= 70) band = "High";
  else if (score >= 55) band = "Established";
  else if (score >= 40) band = "Developing";

  const constraints: Record<string, string> = {
    single: "Income concentration reduces continuity",
    dual: "Concentration creates visibility gap",
    low_visibility: "Forward visibility is not established",
    high_variability: "Income variability introduces structural risk",
  };

  const constraint = inputs.concentration === "single"
    ? constraints.single
    : inputs.visibility < 6
    ? constraints.low_visibility
    : constraints.dual;

  const alignment = score >= 60;
  const verdict = alignment
    ? "Structurally aligned with this decision"
    : "Not structurally aligned with this decision";

  return { score, band, constraint, alignment, verdict };
}

function getDecisionLabel(d: Decision): string {
  return {
    mortgage: "Mortgage",
    expansion: "Business Expansion",
    investment: "Investment",
    timeoff: "Time Off",
  }[d || "mortgage"] || "Decision";
}

function getDecisionColor(band: Result["band"]): string {
  return {
    High: C.protected,
    Established: C.established,
    Developing: C.moderate,
    Limited: C.risk,
  }[band];
}

/* ================================================================ */
/* MAIN COMPONENT                                                     */
/* ================================================================ */

export default function VerificationFlow() {
  const m = useMobile();
  const fadeIn = useFadeIn();

  // State
  const [section, setSection] = useState<Section>("landing");
  const [selectedDecision, setSelectedDecision] = useState<Decision>(null);
  const [inputs, setInputs] = useState<Inputs>({
    incomeType: "consultant",
    concentration: "dual",
    sources: 3,
    visibility: 6,
    variability: "moderate",
    continuity: "recurring",
  });
  const [result, setResult] = useState<Result | null>(null);
  const [showStickyBar, setShowStickyBar] = useState(false);

  // Auto-scroll on section change
  const sectionRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (sectionRef.current) {
      setTimeout(() => {
        sectionRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 100);
    }
  }, [section]);

  // Handlers
  const handleDecisionSelect = (d: Decision) => {
    setSelectedDecision(d);
    setShowStickyBar(true);
    setSection("input");
  };

  const handleInputChange = (key: keyof Inputs, value: any) => {
    setInputs(prev => ({ ...prev, [key]: value }));
  };

  const handleGenerateResult = () => {
    const newResult = generateResult(inputs);
    setResult(newResult);
    setSection("result");
  };

  const handleCheckout = () => {
    setSection("checkout");
  };

  const handlePaymentSuccess = () => {
    setSection("success");
  };

  return (
    <div style={{ backgroundColor: C.white, minHeight: "100vh" }}>
      <style>{`
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif; }
        html { scroll-behavior: smooth; }
      `}</style>

      {/* Sticky Decision Bar */}
      {showStickyBar && (
        <div style={{
          position: "sticky",
          top: 0,
          zIndex: 999,
          backgroundColor: C.navy,
          padding: "12px 20px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          borderBottom: `1px solid rgba(255,255,255,0.10)`,
        }}>
          <div>
            <div style={{ fontSize: 11, fontWeight: 600, color: C.teal, letterSpacing: "0.06em" }}>DECISION</div>
            <div style={{ fontSize: 14, fontWeight: 600, color: C.sandText }}>{getDecisionLabel(selectedDecision)}</div>
          </div>
          <div style={{ textAlign: "right" }}>
            <div style={{ fontSize: 11, fontWeight: 600, color: "rgba(244,241,234,0.50)", letterSpacing: "0.06em" }}>STATUS</div>
            <div style={{ fontSize: 13, fontWeight: 600, color: result?.alignment ? C.protected : C.risk }}>
              {result ? (result.alignment ? "Aligned" : "Not aligned") : "Evaluating"}
            </div>
          </div>
        </div>
      )}

      {/* SECTION 1: LANDING */}
      <section ref={section === "landing" ? sectionRef : undefined} style={{
        backgroundColor: C.sand,
        padding: m ? "72px 20px" : "96px 40px",
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
      }}>
        <div style={{ maxWidth: 420, margin: "0 auto" }}>
          <div style={{ opacity: 0, animation: "fadeIn 0.6s ease-out forwards" }}>
            <h1 style={{
              fontSize: m ? 28 : 36,
              fontWeight: 700,
              lineHeight: 1.1,
              letterSpacing: "-0.03em",
              color: C.navy,
              marginBottom: 32,
            }}>
              Major financial decisions require income verification.
            </h1>
            <p style={{
              fontSize: 18,
              fontWeight: 600,
              lineHeight: 1.4,
              color: C.textSecondary,
              marginBottom: 24,
            }}>
              This defines whether it holds.
            </p>
            <div style={{
              padding: "20px",
              backgroundColor: C.white,
              borderRadius: 12,
              border: `1px solid ${C.borderSoft}`,
              marginBottom: 32,
            }}>
              <p style={{ fontSize: 13, fontWeight: 600, color: C.teal, letterSpacing: "0.06em", marginBottom: 8 }}>UNVERIFIED INCOME</p>
              <p style={{ fontSize: 15, color: C.textPrimary, lineHeight: 1.5, margin: 0 }}>
                Introduces structural risk.
              </p>
            </div>
            <div style={{
              padding: "20px",
              backgroundColor: C.navy,
              borderRadius: 12,
              marginBottom: 32,
            }}>
              <p style={{ fontSize: 12, fontWeight: 600, color: C.teal, letterSpacing: "0.06em", marginBottom: 8 }}>AUTHORITY</p>
              <p style={{ fontSize: 13, color: C.sandText, lineHeight: 1.5, margin: 0 }}>
                Fixed model. Same inputs produce the same result.
              </p>
            </div>
            <button onClick={() => setSection("decision")} style={{
              width: "100%",
              height: 56,
              backgroundColor: C.navy,
              color: C.white,
              border: "none",
              borderRadius: 12,
              fontSize: 16,
              fontWeight: 600,
              cursor: "pointer",
              transition: "all 200ms",
            }}
              onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = "0 12px 32px rgba(14,26,43,0.20)"; }}
              onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "0 8px 24px rgba(14,26,43,0.12)"; }}>
              Start Verification →
            </button>
            <p style={{ fontSize: 13, color: C.textMuted, textAlign: "center", marginTop: 16 }}>
              Answer 6 inputs. Result immediately.
            </p>
          </div>
        </div>
      </section>

      {/* SECTION 2: DECISION SELECTION */}
      {(section === "decision" || section === "input" || section === "result" || section === "checkout" || section === "success") && (
        <section ref={section === "decision" ? sectionRef : undefined} style={{
          backgroundColor: C.white,
          padding: m ? "72px 20px" : "96px 40px",
          minHeight: section === "decision" ? "100vh" : "auto",
          display: "flex",
          flexDirection: "column",
          justifyContent: section === "decision" ? "center" : "flex-start",
        }}>
          <div style={{ maxWidth: 420, margin: "0 auto", width: "100%" }}>
            <h2 style={{
              fontSize: 22,
              fontWeight: 600,
              lineHeight: 1.2,
              letterSpacing: "-0.02em",
              color: C.navy,
              marginBottom: 32,
            }}>
              This decision requires verification
            </h2>
            <p style={{
              fontSize: 14,
              color: C.textMuted,
              marginBottom: 28,
            }}>
              Select the decision being evaluated.
            </p>

            <div style={{ display: "flex", flexDirection: "column", gap: 12, marginBottom: 48 }}>
              {(["mortgage", "expansion", "investment", "timeoff"] as Decision[]).map((d) => (
                <button
                  key={d}
                  onClick={() => handleDecisionSelect(d)}
                  style={{
                    padding: "20px",
                    backgroundColor: selectedDecision === d ? C.navy : C.panelFill,
                    color: selectedDecision === d ? C.white : C.navy,
                    border: selectedDecision === d ? "none" : `1px solid ${C.borderSoft}`,
                    borderRadius: 12,
                    fontSize: 15,
                    fontWeight: 600,
                    cursor: "pointer",
                    transition: "all 200ms",
                    textAlign: "left",
                  }}
                  onMouseEnter={e => {
                    if (selectedDecision !== d) {
                      e.currentTarget.style.backgroundColor = "rgba(14,26,43,0.06)";
                      e.currentTarget.style.borderColor = C.navy;
                    }
                  }}
                  onMouseLeave={e => {
                    if (selectedDecision !== d) {
                      e.currentTarget.style.backgroundColor = C.panelFill;
                      e.currentTarget.style.borderColor = C.borderSoft;
                    }
                  }}>
                  {getDecisionLabel(d)}
                </button>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* SECTION 3: INPUT */}
      {(section === "input" || section === "result" || section === "checkout" || section === "success") && (
        <section ref={section === "input" ? sectionRef : undefined} style={{
          backgroundColor: C.panelFill,
          padding: m ? "72px 20px" : "96px 40px",
          minHeight: section === "input" ? "100vh" : "auto",
        }}>
          <div style={{ maxWidth: 420, margin: "0 auto", width: "100%" }}>
            <h2 style={{
              fontSize: 22,
              fontWeight: 600,
              lineHeight: 1.2,
              letterSpacing: "-0.02em",
              color: C.navy,
              marginBottom: 32,
            }}>
              Define how income is structured
            </h2>

            <div style={{ display: "flex", flexDirection: "column", gap: 28 }}>
              {/* Income Type */}
              <div>
                <label style={{ fontSize: 13, fontWeight: 600, color: C.teal, display: "block", marginBottom: 8, letterSpacing: "0.06em" }}>INCOME TYPE</label>
                <select value={inputs.incomeType} onChange={e => handleInputChange("incomeType", e.target.value)} style={{
                  width: "100%",
                  padding: "12px 16px",
                  border: `1px solid ${C.borderSoft}`,
                  borderRadius: 8,
                  fontSize: 14,
                  backgroundColor: C.white,
                  color: C.textPrimary,
                }}>
                  <option value="consultant">Consultant</option>
                  <option value="freelance">Freelance</option>
                  <option value="sales">Sales</option>
                  <option value="business">Business Owner</option>
                </select>
              </div>

              {/* Concentration */}
              <div>
                <label style={{ fontSize: 13, fontWeight: 600, color: C.teal, display: "block", marginBottom: 8, letterSpacing: "0.06em" }}>CONCENTRATION</label>
                <div style={{ display: "flex", gap: 8 }}>
                  {["single", "dual", "diverse"].map((val) => (
                    <button
                      key={val}
                      onClick={() => handleInputChange("concentration", val)}
                      style={{
                        flex: 1,
                        padding: "12px",
                        backgroundColor: inputs.concentration === val ? C.navy : C.white,
                        color: inputs.concentration === val ? C.white : C.textPrimary,
                        border: `1px solid ${inputs.concentration === val ? C.navy : C.borderSoft}`,
                        borderRadius: 8,
                        fontSize: 13,
                        fontWeight: 600,
                        cursor: "pointer",
                        transition: "all 150ms",
                      }}>
                      {val === "single" ? "1 source" : val === "dual" ? "2–3" : "4+"}
                    </button>
                  ))}
                </div>
              </div>

              {/* Sources */}
              <div>
                <label style={{ fontSize: 13, fontWeight: 600, color: C.teal, display: "block", marginBottom: 8, letterSpacing: "0.06em" }}>SOURCES</label>
                <input type="range" min="1" max="10" value={inputs.sources} onChange={e => handleInputChange("sources", parseInt(e.target.value))} style={{ width: "100%", cursor: "pointer" }} />
                <div style={{ fontSize: 14, fontWeight: 600, color: C.navy, marginTop: 8 }}>{inputs.sources} source{inputs.sources > 1 ? "s" : ""}</div>
              </div>

              {/* Visibility */}
              <div>
                <label style={{ fontSize: 13, fontWeight: 600, color: C.teal, display: "block", marginBottom: 8, letterSpacing: "0.06em" }}>FORWARD VISIBILITY (months)</label>
                <input type="range" min="0" max="24" value={inputs.visibility} onChange={e => handleInputChange("visibility", parseInt(e.target.value))} style={{ width: "100%", cursor: "pointer" }} />
                <div style={{ fontSize: 14, fontWeight: 600, color: C.navy, marginTop: 8 }}>{inputs.visibility} months secured</div>
              </div>

              {/* Variability */}
              <div>
                <label style={{ fontSize: 13, fontWeight: 600, color: C.teal, display: "block", marginBottom: 8, letterSpacing: "0.06em" }}>VARIABILITY</label>
                <div style={{ display: "flex", gap: 8 }}>
                  {["low", "moderate", "high"].map((val) => (
                    <button
                      key={val}
                      onClick={() => handleInputChange("variability", val)}
                      style={{
                        flex: 1,
                        padding: "12px",
                        backgroundColor: inputs.variability === val ? C.navy : C.white,
                        color: inputs.variability === val ? C.white : C.textPrimary,
                        border: `1px solid ${inputs.variability === val ? C.navy : C.borderSoft}`,
                        borderRadius: 8,
                        fontSize: 12,
                        fontWeight: 600,
                        cursor: "pointer",
                        transition: "all 150ms",
                      }}>
                      {val.charAt(0).toUpperCase() + val.slice(1)}
                    </button>
                  ))}
                </div>
              </div>

              {/* Continuity */}
              <div>
                <label style={{ fontSize: 13, fontWeight: 600, color: C.teal, display: "block", marginBottom: 8, letterSpacing: "0.06em" }}>CONTINUITY</label>
                <div style={{ display: "flex", gap: 8 }}>
                  {["active", "recurring", "passive"].map((val) => (
                    <button
                      key={val}
                      onClick={() => handleInputChange("continuity", val)}
                      style={{
                        flex: 1,
                        padding: "12px",
                        backgroundColor: inputs.continuity === val ? C.navy : C.white,
                        color: inputs.continuity === val ? C.white : C.textPrimary,
                        border: `1px solid ${inputs.continuity === val ? C.navy : C.borderSoft}`,
                        borderRadius: 8,
                        fontSize: 12,
                        fontWeight: 600,
                        cursor: "pointer",
                        transition: "all 150ms",
                      }}>
                      {val.charAt(0).toUpperCase() + val.slice(1)}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {section === "input" && (
              <button onClick={handleGenerateResult} style={{
                width: "100%",
                height: 56,
                marginTop: 40,
                backgroundColor: C.navy,
                color: C.white,
                border: "none",
                borderRadius: 12,
                fontSize: 16,
                fontWeight: 600,
                cursor: "pointer",
                transition: "all 200ms",
              }}
                onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = "0 12px 32px rgba(14,26,43,0.20)"; }}
                onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "0 8px 24px rgba(14,26,43,0.12)"; }}>
                Generate Result →
              </button>
            )}
          </div>
        </section>
      )}

      {/* SECTION 4: RESULT */}
      {result && (section === "result" || section === "checkout" || section === "success") && (
        <section ref={section === "result" ? sectionRef : undefined} style={{
          backgroundColor: C.white,
          padding: m ? "72px 20px" : "96px 40px",
          minHeight: section === "result" ? "100vh" : "auto",
        }}>
          <div style={{ maxWidth: 420, margin: "0 auto", width: "100%" }}>
            <h1 style={{
              fontSize: 26,
              fontWeight: 700,
              lineHeight: 1.1,
              letterSpacing: "-0.02em",
              color: C.navy,
              marginBottom: 28,
            }}>
              Income Stability Result
            </h1>

            {/* Score Card */}
            <div style={{
              backgroundColor: C.navy,
              borderRadius: 16,
              padding: "24px",
              marginBottom: 32,
              position: "relative",
              overflow: "hidden",
            }}>
              <div style={{
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                height: 3,
                background: `linear-gradient(90deg, ${C.teal}, ${C.purple})`,
              }} />

              <div style={{ fontSize: 11, fontWeight: 600, color: C.teal, letterSpacing: "0.08em", marginBottom: 12 }}>SCORE</div>
              <div style={{ fontSize: 48, fontWeight: 700, fontFamily: mono, color: C.sandText, marginBottom: 4, lineHeight: 1 }}>
                {result.score}
              </div>
              <div style={{ fontSize: 13, fontWeight: 600, color: C.sandText, marginBottom: 4 }}>/100</div>
              <div style={{
                fontSize: 14,
                fontWeight: 600,
                color: getDecisionColor(result.band),
                display: "inline-block",
                padding: "6px 12px",
                backgroundColor: `${getDecisionColor(result.band)}15`,
                borderRadius: 8,
                marginTop: 12,
              }}>
                {result.band} Stability
              </div>

              <div style={{
                fontSize: 11,
                fontWeight: 600,
                color: "rgba(244,241,234,0.40)",
                marginTop: 16,
                letterSpacing: "0.06em",
              }}>
                OUTPUT DERIVED FROM FIXED STRUCTURAL INPUTS
              </div>
            </div>

            {/* Constraint */}
            <div style={{
              padding: "20px",
              backgroundColor: C.panelFill,
              borderRadius: 12,
              border: `1px solid ${C.borderSoft}`,
              marginBottom: 28,
            }}>
              <p style={{ fontSize: 12, fontWeight: 600, color: C.teal, letterSpacing: "0.06em", marginBottom: 8 }}>PRIMARY CONSTRAINT</p>
              <p style={{ fontSize: 15, fontWeight: 600, color: C.navy, lineHeight: 1.5, margin: 0 }}>
                {result.constraint}
              </p>
            </div>

            {/* Decision Validation */}
            <div style={{
              padding: "20px",
              backgroundColor: C.navy,
              borderRadius: 12,
              marginBottom: 28,
            }}>
              <p style={{ fontSize: 12, fontWeight: 600, color: C.teal, letterSpacing: "0.06em", marginBottom: 8 }}>DECISION VALIDATION</p>
              <p style={{ fontSize: 15, fontWeight: 600, color: C.sandText, lineHeight: 1.5, marginBottom: 8 }}>
                {getDecisionLabel(selectedDecision)}
              </p>
              <p style={{
                fontSize: 14,
                color: result.alignment ? C.protected : C.risk,
                fontWeight: 600,
              }}>
                {result.alignment ? "✓ Structurally aligned" : "✗ Not structurally aligned"}
              </p>
              <p style={{ fontSize: 13, color: C.sandMuted, lineHeight: 1.5, marginTop: 8, margin: 0 }}>
                {result.alignment
                  ? "Under current structure, this income sustains this obligation if conditions change."
                  : "Under current structure, this income may not sustain this obligation if conditions change."}
              </p>
            </div>

            {/* Incompletion Signal */}
            <div style={{
              padding: "20px",
              backgroundColor: "rgba(14,26,43,0.04)",
              borderRadius: 12,
              border: `1px solid ${C.borderSoft}`,
              marginBottom: 32,
            }}>
              <p style={{ fontSize: 13, fontWeight: 600, color: C.navy, marginBottom: 12 }}>Full structural verification required</p>
              <p style={{ fontSize: 13, color: C.textSecondary, lineHeight: 1.6, margin: 0 }}>
                This decision is not defined under current output. Missing: full factor scoring, constraint weighting, complete decision validation.
              </p>
            </div>

            {section === "result" && (
              <button onClick={handleCheckout} style={{
                width: "100%",
                height: 56,
                backgroundColor: C.navy,
                color: C.white,
                border: "none",
                borderRadius: 12,
                fontSize: 16,
                fontWeight: 600,
                cursor: "pointer",
                transition: "all 200ms",
              }}
                onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = "0 12px 32px rgba(14,26,43,0.20)"; }}
                onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "0 8px 24px rgba(14,26,43,0.12)"; }}>
                Unlock Full Verification →
              </button>
            )}
          </div>
        </section>
      )}

      {/* SECTION 5: CHECKOUT */}
      {(section === "checkout" || section === "success") && (
        <section ref={section === "checkout" ? sectionRef : undefined} style={{
          backgroundColor: C.panelFill,
          padding: m ? "72px 20px" : "96px 40px",
          minHeight: section === "checkout" ? "100vh" : "auto",
        }}>
          <div style={{ maxWidth: 420, margin: "0 auto", width: "100%" }}>
            <h1 style={{
              fontSize: 26,
              fontWeight: 700,
              lineHeight: 1.1,
              letterSpacing: "-0.02em",
              color: C.navy,
              marginBottom: 28,
            }}>
              Complete verification
            </h1>

            <div style={{
              padding: "20px",
              backgroundColor: C.navy,
              borderRadius: 12,
              marginBottom: 32,
            }}>
              <p style={{ fontSize: 13, fontWeight: 600, color: C.teal, letterSpacing: "0.06em", marginBottom: 8 }}>VERIFICATION REQUIREMENT</p>
              <p style={{ fontSize: 14, color: C.sandText, lineHeight: 1.5, margin: 0 }}>
                Full verification is required to define this decision.
              </p>
            </div>

            {section === "checkout" && (
              <>
                {/* Express Pay */}
                <div style={{ marginBottom: 28 }}>
                  <p style={{ fontSize: 13, fontWeight: 600, color: C.teal, marginBottom: 12, letterSpacing: "0.06em" }}>EXPRESS PAY</p>
                  <button style={{
                    width: "100%",
                    padding: "16px",
                    marginBottom: 10,
                    backgroundColor: C.navy,
                    color: C.white,
                    border: "none",
                    borderRadius: 8,
                    fontSize: 14,
                    fontWeight: 600,
                    cursor: "pointer",
                    transition: "all 150ms",
                  }}
                    onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-1px)"; e.currentTarget.style.boxShadow = "0 6px 16px rgba(14,26,43,0.15)"; }}
                    onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "none"; }}>
                    🍎 Apple Pay
                  </button>
                  <button style={{
                    width: "100%",
                    padding: "16px",
                    backgroundColor: C.navy,
                    color: C.white,
                    border: "none",
                    borderRadius: 8,
                    fontSize: 14,
                    fontWeight: 600,
                    cursor: "pointer",
                    transition: "all 150ms",
                  }}
                    onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-1px)"; e.currentTarget.style.boxShadow = "0 6px 16px rgba(14,26,43,0.15)"; }}
                    onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "none"; }}>
                    🔵 Google Pay
                  </button>
                </div>

                {/* Divider */}
                <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 28 }}>
                  <div style={{ flex: 1, height: 1, backgroundColor: C.divider }} />
                  <span style={{ fontSize: 12, color: C.textMuted, fontWeight: 500 }}>OR</span>
                  <div style={{ flex: 1, height: 1, backgroundColor: C.divider }} />
                </div>

                {/* Card Input */}
                <div style={{ marginBottom: 28 }}>
                  <p style={{ fontSize: 13, fontWeight: 600, color: C.teal, marginBottom: 12, letterSpacing: "0.06em" }}>CARD</p>
                  <input type="text" placeholder="Card number" style={{
                    width: "100%",
                    padding: "12px 16px",
                    marginBottom: 10,
                    border: `1px solid ${C.borderSoft}`,
                    borderRadius: 8,
                    fontSize: 14,
                    backgroundColor: C.white,
                  }} />
                  <div style={{ display: "flex", gap: 10, marginBottom: 10 }}>
                    <input type="text" placeholder="MM/YY" style={{
                      flex: 1,
                      padding: "12px 16px",
                      border: `1px solid ${C.borderSoft}`,
                      borderRadius: 8,
                      fontSize: 14,
                      backgroundColor: C.white,
                    }} />
                    <input type="text" placeholder="CVC" style={{
                      width: 80,
                      padding: "12px 16px",
                      border: `1px solid ${C.borderSoft}`,
                      borderRadius: 8,
                      fontSize: 14,
                      backgroundColor: C.white,
                    }} />
                  </div>
                  <input type="email" placeholder="Email" style={{
                    width: "100%",
                    padding: "12px 16px",
                    border: `1px solid ${C.borderSoft}`,
                    borderRadius: 8,
                    fontSize: 14,
                    backgroundColor: C.white,
                  }} />
                </div>

                {/* Trust */}
                <div style={{
                  padding: "16px",
                  backgroundColor: C.white,
                  borderRadius: 8,
                  border: `1px solid ${C.borderSoft}`,
                  marginBottom: 28,
                }}>
                  <p style={{ fontSize: 12, color: C.textMuted, margin: 0, lineHeight: 1.5 }}>
                    Secure payment via Stripe. Verification unlocks immediately after payment.
                  </p>
                </div>

                {/* Reality Reinforcement */}
                <div style={{
                  padding: "16px",
                  backgroundColor: "rgba(199,70,52,0.06)",
                  borderRadius: 8,
                  border: `1px solid rgba(199,70,52,0.12)`,
                  marginBottom: 28,
                }}>
                  <p style={{ fontSize: 13, fontWeight: 600, color: C.risk, marginBottom: 4 }}>Decision remains incomplete</p>
                  <p style={{ fontSize: 12, color: C.textSecondary, margin: 0, lineHeight: 1.5 }}>
                    This decision is not defined under current output.
                  </p>
                </div>

                <button onClick={handlePaymentSuccess} style={{
                  width: "100%",
                  height: 56,
                  backgroundColor: C.navy,
                  color: C.white,
                  border: "none",
                  borderRadius: 12,
                  fontSize: 16,
                  fontWeight: 600,
                  cursor: "pointer",
                  transition: "all 200ms",
                }}
                  onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = "0 12px 32px rgba(14,26,43,0.20)"; }}
                  onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "0 8px 24px rgba(14,26,43,0.12)"; }}>
                  Unlock Full Verification — $69
                </button>
                <p style={{ fontSize: 12, color: C.textMuted, textAlign: "center", marginTop: 16 }}>
                  Full report unlocks immediately after payment
                </p>
              </>
            )}
          </div>
        </section>
      )}

      {/* SECTION 6: SUCCESS */}
      {section === "success" && (
        <section ref={sectionRef} style={{
          backgroundColor: C.navy,
          padding: m ? "72px 20px" : "96px 40px",
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
        }}>
          <div style={{ maxWidth: 420, margin: "0 auto", textAlign: "center" }}>
            <h1 style={{
              fontSize: 32,
              fontWeight: 700,
              lineHeight: 1.1,
              letterSpacing: "-0.03em",
              color: C.sandText,
              marginBottom: 24,
            }}>
              Verification complete
            </h1>
            <p style={{
              fontSize: 16,
              color: C.sandMuted,
              lineHeight: 1.6,
              marginBottom: 32,
            }}>
              Your decision is now fully defined.
            </p>
            <button style={{
              width: "100%",
              height: 56,
              backgroundColor: C.teal,
              color: C.white,
              border: "none",
              borderRadius: 12,
              fontSize: 16,
              fontWeight: 600,
              cursor: "pointer",
              transition: "all 200ms",
            }}
              onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = "0 12px 32px rgba(31,109,122,0.30)"; }}
              onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "0 8px 24px rgba(31,109,122,0.20)"; }}>
              View Full Report →
            </button>
          </div>
        </section>
      )}

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(16px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}
