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
type Decision = "mortgage" | "expansion" | "investment" | "timeoff" | "hiring" | "retirement" | null;

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
    single: "Income dependency reduces continuity under disruption",
    dual: "Concentration creates visibility gap",
    low_visibility: "Forward visibility is not established",
    high_variability: "Income variability introduces structural risk",
  };

  const constraint = inputs.concentration === "single"
    ? constraints.single
    : inputs.visibility < 6
    ? constraints.low_visibility
    : constraints.dual;

  return { score, band, constraint, alignment: score >= 60 };
}

function getDecisionLabel(d: Decision): string {
  return {
    mortgage: "Mortgage commitment",
    expansion: "Business expansion",
    investment: "Investment",
    timeoff: "Time off",
    hiring: "Hiring",
    retirement: "Retirement transition",
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
/* MOBILE DECISION VERIFICATION FLOW                                */
/* ================================================================ */

function MobileDecisionFlow() {
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

  const sectionRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (sectionRef.current) {
      setTimeout(() => {
        sectionRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 100);
    }
  }, [section]);

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

      {section === "landing" && (
        <section ref={sectionRef} style={{ backgroundColor: C.sand, padding: "72px 20px", minHeight: "100vh", display: "flex", flexDirection: "column", justifyContent: "center" }}>
          <div style={{ maxWidth: 420, margin: "0 auto" }}>
            <h1 style={{ fontSize: 28, fontWeight: 700, lineHeight: 1.1, letterSpacing: "-0.03em", color: C.navy, marginBottom: 32 }}>
              Major financial decisions require income verification.
            </h1>
            <p style={{ fontSize: 18, fontWeight: 600, lineHeight: 1.4, color: C.textSecondary, marginBottom: 24 }}>
              This defines whether it holds.
            </p>
            <div style={{ padding: "20px", backgroundColor: C.white, borderRadius: 12, border: `1px solid ${C.borderSoft}`, marginBottom: 24 }}>
              <p style={{ fontSize: 13, fontWeight: 600, color: C.teal, letterSpacing: "0.06em", marginBottom: 8 }}>STANDARD DECLARATION</p>
              <p style={{ fontSize: 14, color: C.textPrimary, lineHeight: 1.5, margin: 0 }}>
                RunPayway™ establishes a standardized method for evaluating income structure prior to financial decisions.
              </p>
            </div>
            <button onClick={() => setSection("decision")} style={{ width: "100%", height: 56, backgroundColor: C.navy, color: C.white, border: "none", borderRadius: 12, fontSize: 16, fontWeight: 600, cursor: "pointer", transition: "all 200ms" }}
              onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = "0 12px 32px rgba(14,26,43,0.20)"; }}
              onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "0 8px 24px rgba(14,26,43,0.12)"; }}>
              Start Verification →
            </button>
            <p style={{ fontSize: 13, color: C.textMuted, textAlign: "center", marginTop: 14 }}>
              Answer 6 structural inputs. Verification occurs immediately.
            </p>
          </div>
        </section>
      )}

      {(section === "decision" || section === "input" || section === "result" || section === "checkout" || section === "success") && (
        <section ref={section === "decision" ? sectionRef : undefined} style={{ backgroundColor: C.white, padding: "72px 20px", minHeight: section === "decision" ? "100vh" : "auto", display: "flex", flexDirection: "column", justifyContent: section === "decision" ? "center" : "flex-start" }}>
          <div style={{ maxWidth: 420, margin: "0 auto", width: "100%" }}>
            <h2 style={{ fontSize: 22, fontWeight: 600, lineHeight: 1.2, letterSpacing: "-0.02em", color: C.navy, marginBottom: 32 }}>
              This decision requires verification
            </h2>
            <p style={{ fontSize: 14, color: C.textMuted, marginBottom: 28 }}>
              Select the decision requiring structural verification.
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: 12, marginBottom: 48 }}>
              {(["mortgage", "expansion", "investment", "timeoff", "hiring", "retirement"] as Decision[]).map((d) => (
                <button key={d} onClick={() => handleDecisionSelect(d)} style={{ padding: "20px", backgroundColor: selectedDecision === d ? C.navy : C.panelFill, color: selectedDecision === d ? C.white : C.navy, border: selectedDecision === d ? "none" : `1px solid ${C.borderSoft}`, borderRadius: 12, fontSize: 15, fontWeight: 600, cursor: "pointer", transition: "all 200ms", textAlign: "left" }}>
                  {getDecisionLabel(d)}
                </button>
              ))}
            </div>
          </div>
        </section>
      )}

      {(section === "input" || section === "result" || section === "checkout" || section === "success") && (
        <section ref={section === "input" ? sectionRef : undefined} style={{ backgroundColor: C.panelFill, padding: "72px 20px", minHeight: section === "input" ? "100vh" : "auto" }}>
          <div style={{ maxWidth: 420, margin: "0 auto", width: "100%" }}>
            {section === "input" && (
              <>
                <h2 style={{ fontSize: 22, fontWeight: 600, lineHeight: 1.2, letterSpacing: "-0.02em", color: C.navy, marginBottom: 24 }}>
                  Define how income is structured
                </h2>
                <div style={{ padding: "16px", backgroundColor: C.navy, borderRadius: 10, marginBottom: 32 }}>
                  <p style={{ fontSize: 12, color: C.sandMuted, margin: 0, lineHeight: 1.5 }}>
                    Inputs define the result. No external data is used.
                  </p>
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: 28, marginBottom: 32 }}>
                  <div>
                    <label style={{ fontSize: 13, fontWeight: 600, color: C.teal, display: "block", marginBottom: 8, letterSpacing: "0.06em" }}>CONCENTRATION</label>
                    <p style={{ fontSize: 13, color: C.textSecondary, marginBottom: 12, lineHeight: 1.5 }}>How many clients or primary income sources define your earnings?</p>
                    <div style={{ display: "flex", gap: 8 }}>
                      {["single", "dual", "diverse"].map((val) => (
                        <button key={val} onClick={() => handleInputChange("concentration", val)} style={{ flex: 1, padding: "12px", backgroundColor: inputs.concentration === val ? C.navy : C.white, color: inputs.concentration === val ? C.white : C.textPrimary, border: `1px solid ${inputs.concentration === val ? C.navy : C.borderSoft}`, borderRadius: 8, fontSize: 13, fontWeight: 600, cursor: "pointer", transition: "all 150ms" }}>
                          {val === "single" ? "1" : val === "dual" ? "2–3" : "4+"}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <label style={{ fontSize: 13, fontWeight: 600, color: C.teal, display: "block", marginBottom: 8, letterSpacing: "0.06em" }}>SOURCES</label>
                    <p style={{ fontSize: 13, color: C.textSecondary, marginBottom: 12, lineHeight: 1.5 }}>Number of distinct income streams or revenue channels contributing to income.</p>
                    <input type="range" min="1" max="10" value={inputs.sources} onChange={e => handleInputChange("sources", parseInt(e.target.value))} style={{ width: "100%", cursor: "pointer" }} />
                    <div style={{ fontSize: 14, fontWeight: 600, color: C.navy, marginTop: 8 }}>{inputs.sources} {inputs.sources === 1 ? "source" : "sources"}</div>
                  </div>
                  <div>
                    <label style={{ fontSize: 13, fontWeight: 600, color: C.teal, display: "block", marginBottom: 8, letterSpacing: "0.06em" }}>VISIBILITY</label>
                    <p style={{ fontSize: 13, color: C.textSecondary, marginBottom: 12, lineHeight: 1.5 }}>How far forward can you reliably project income with confidence?</p>
                    <input type="range" min="0" max="24" value={inputs.visibility} onChange={e => handleInputChange("visibility", parseInt(e.target.value))} style={{ width: "100%", cursor: "pointer" }} />
                    <div style={{ fontSize: 14, fontWeight: 600, color: C.navy, marginTop: 8 }}>{inputs.visibility} {inputs.visibility === 1 ? "month" : "months"}</div>
                  </div>
                </div>
                <button onClick={handleGenerateResult} style={{ width: "100%", height: 56, backgroundColor: C.navy, color: C.white, border: "none", borderRadius: 12, fontSize: 16, fontWeight: 600, cursor: "pointer", transition: "all 200ms" }}
                  onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = "0 12px 32px rgba(14,26,43,0.20)"; }}
                  onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "0 8px 24px rgba(14,26,43,0.12)"; }}>
                  Generate Result →
                </button>
              </>
            )}
          </div>
        </section>
      )}

      {result && (section === "result" || section === "checkout" || section === "success") && (
        <section ref={section === "result" ? sectionRef : undefined} style={{ backgroundColor: C.white, padding: "72px 20px", minHeight: section === "result" ? "100vh" : "auto" }}>
          <div style={{ maxWidth: 420, margin: "0 auto", width: "100%" }}>
            <h1 style={{ fontSize: 26, fontWeight: 700, lineHeight: 1.1, letterSpacing: "-0.02em", color: C.navy, marginBottom: 16 }}>
              Income Stability Result
            </h1>
            <div style={{ fontSize: 11, color: C.textMuted, marginBottom: 28, lineHeight: 1.6, letterSpacing: "0.05em" }}>
              <div>Record ID: RS-{Math.random().toString(36).substr(2, 9).toUpperCase()}</div>
              <div>Model: RP-2.0</div>
              <div>Timestamp: {new Date().toISOString().split('T')[0]}</div>
            </div>
            <div style={{ backgroundColor: C.navy, borderRadius: 16, padding: "24px", marginBottom: 32, position: "relative", overflow: "hidden" }}>
              <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 3, background: `linear-gradient(90deg, ${C.teal}, ${C.purple})` }} />
              <div style={{ fontSize: 11, fontWeight: 600, color: C.teal, letterSpacing: "0.08em", marginBottom: 12 }}>SCORE</div>
              <div style={{ fontSize: 48, fontWeight: 700, fontFamily: mono, color: C.sandText, marginBottom: 4, lineHeight: 1 }}>
                {result.score}
              </div>
              <div style={{ fontSize: 13, fontWeight: 600, color: C.sandText, marginBottom: 4 }}>/100</div>
              <div style={{ fontSize: 14, fontWeight: 600, color: getDecisionColor(result.band), display: "inline-block", padding: "6px 12px", backgroundColor: `${getDecisionColor(result.band)}15`, borderRadius: 8, marginTop: 12 }}>
                {result.band} Stability
              </div>
              <div style={{ fontSize: 11, fontWeight: 600, color: "rgba(244,241,234,0.40)", marginTop: 12, letterSpacing: "0.06em" }}>
                OUTPUT DERIVED FROM FIXED STRUCTURAL INPUTS
              </div>
              <div style={{ fontSize: 11, color: "rgba(244,241,234,0.30)", marginTop: 8, lineHeight: 1.4 }}>
                This result can be verified and reproduced under identical inputs.
              </div>
            </div>
            <div style={{ padding: "20px", backgroundColor: C.panelFill, borderRadius: 12, border: `1px solid ${C.borderSoft}`, marginBottom: 28 }}>
              <p style={{ fontSize: 12, fontWeight: 600, color: C.teal, letterSpacing: "0.06em", marginBottom: 8 }}>PRIMARY CONSTRAINT</p>
              <p style={{ fontSize: 15, fontWeight: 600, color: C.navy, lineHeight: 1.5, margin: 0 }}>
                {result.constraint}
              </p>
            </div>
            <div style={{ padding: "20px", backgroundColor: C.navy, borderRadius: 12, marginBottom: 24 }}>
              <p style={{ fontSize: 12, fontWeight: 600, color: C.teal, letterSpacing: "0.06em", marginBottom: 8 }}>DECISION VALIDATION</p>
              <p style={{ fontSize: 15, fontWeight: 600, color: C.sandText, lineHeight: 1.5, marginBottom: 12 }}>
                {getDecisionLabel(selectedDecision)}
              </p>
              <p style={{ fontSize: 14, color: result.alignment ? C.protected : C.risk, fontWeight: 600, marginBottom: 8 }}>
                {result.alignment ? "Structurally aligned" : "Not structurally aligned"}
              </p>
              <p style={{ fontSize: 13, color: C.sandMuted, lineHeight: 1.5, margin: 0 }}>
                Under current structure, this income may not sustain this obligation if conditions change.
              </p>
            </div>
            <div style={{ padding: "20px", backgroundColor: C.panelFill, borderRadius: 12, border: `1px solid ${C.borderSoft}`, marginBottom: 28 }}>
              <p style={{ fontSize: 12, fontWeight: 600, color: C.teal, letterSpacing: "0.06em", marginBottom: 8 }}>STRUCTURAL CONFIDENCE</p>
              <p style={{ fontSize: 14, fontWeight: 600, color: C.navy, marginBottom: 8 }}>
                {result.score >= 60 ? "Defined" : result.score >= 40 ? "Moderate" : "Low"}
              </p>
              <p style={{ fontSize: 13, color: C.textSecondary, lineHeight: 1.5, margin: 0 }}>
                Confidence reflects clarity and consistency of structural inputs.
              </p>
            </div>
            <div style={{ padding: "20px", backgroundColor: "rgba(31,109,122,0.06)", borderRadius: 12, border: `1px solid rgba(31,109,122,0.15)`, marginBottom: 24 }}>
              <p style={{ fontSize: 13, color: C.established, lineHeight: 1.6, margin: 0 }}>
                This evaluation reflects income structure only. External factors are not included.
              </p>
            </div>
            <div style={{ padding: "20px", backgroundColor: "rgba(14,26,43,0.04)", borderRadius: 12, border: `1px solid ${C.borderSoft}`, marginBottom: 32 }}>
              <p style={{ fontSize: 13, fontWeight: 600, color: C.navy, marginBottom: 12 }}>Full structural verification required</p>
              <p style={{ fontSize: 13, color: C.textSecondary, lineHeight: 1.6, margin: 0 }}>
                Complete structural definition is required to validate this decision.
              </p>
            </div>
            {section === "result" && (
              <button onClick={handleCheckout} style={{ width: "100%", height: 56, backgroundColor: C.navy, color: C.white, border: "none", borderRadius: 12, fontSize: 16, fontWeight: 600, cursor: "pointer", transition: "all 200ms" }}
                onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = "0 12px 32px rgba(14,26,43,0.20)"; }}
                onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "0 8px 24px rgba(14,26,43,0.12)"; }}>
                Unlock Full Verification →
              </button>
            )}
          </div>
        </section>
      )}

      {(section === "checkout" || section === "success") && (
        <section ref={section === "checkout" ? sectionRef : undefined} style={{ backgroundColor: C.panelFill, padding: "72px 20px", minHeight: section === "checkout" ? "100vh" : "auto" }}>
          <div style={{ maxWidth: 420, margin: "0 auto", width: "100%" }}>
            <h1 style={{ fontSize: 26, fontWeight: 700, lineHeight: 1.1, letterSpacing: "-0.02em", color: C.navy, marginBottom: 28 }}>
              Complete verification
            </h1>
            {section === "checkout" && (
              <>
                <div style={{ padding: "20px", backgroundColor: C.navy, borderRadius: 12, marginBottom: 32 }}>
                  <p style={{ fontSize: 13, fontWeight: 600, color: C.teal, letterSpacing: "0.06em", marginBottom: 8 }}>FULL STRUCTURAL VERIFICATION</p>
                  <p style={{ fontSize: 14, color: C.sandText, lineHeight: 1.5, margin: 0 }}>
                    Complete structural definition unlocks your decision validation and full report.
                  </p>
                </div>
                <div style={{ padding: "16px", backgroundColor: C.panelFill, borderRadius: 12, border: `1px solid ${C.borderSoft}`, marginBottom: 28 }}>
                  <p style={{ fontSize: 12, fontWeight: 600, color: C.teal, letterSpacing: "0.06em", marginBottom: 8 }}>WHAT YOU RECEIVE</p>
                  <ul style={{ fontSize: 13, color: C.textSecondary, lineHeight: 1.8, margin: 0, paddingLeft: "20px" }}>
                    <li>Complete structural analysis of your income</li>
                    <li>Decision validation against your specific structure</li>
                    <li>Auditable record with timestamp and model version</li>
                    <li>Identification of primary structural constraints</li>
                    <li>Actionable steps to improve income stability</li>
                  </ul>
                </div>
                <div style={{ marginBottom: 28 }}>
                  <p style={{ fontSize: 13, fontWeight: 600, color: C.teal, marginBottom: 12, letterSpacing: "0.06em" }}>EXPRESS PAY</p>
                  <button style={{ width: "100%", padding: "16px", marginBottom: 10, backgroundColor: C.navy, color: C.white, border: "none", borderRadius: 8, fontSize: 14, fontWeight: 600, cursor: "pointer", transition: "all 150ms" }}>🍎 Apple Pay</button>
                  <button style={{ width: "100%", padding: "16px", backgroundColor: C.navy, color: C.white, border: "none", borderRadius: 8, fontSize: 14, fontWeight: 600, cursor: "pointer", transition: "all 150ms" }}>🔵 Google Pay</button>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 28 }}>
                  <div style={{ flex: 1, height: 1, backgroundColor: C.divider }} />
                  <span style={{ fontSize: 12, color: C.textMuted, fontWeight: 500 }}>OR</span>
                  <div style={{ flex: 1, height: 1, backgroundColor: C.divider }} />
                </div>
                <div style={{ marginBottom: 28 }}>
                  <p style={{ fontSize: 13, fontWeight: 600, color: C.teal, marginBottom: 12, letterSpacing: "0.06em" }}>CARD</p>
                  <input type="text" placeholder="Card number" style={{ width: "100%", padding: "12px 16px", marginBottom: 10, border: `1px solid ${C.borderSoft}`, borderRadius: 8, fontSize: 14, backgroundColor: C.white }} />
                  <div style={{ display: "flex", gap: 10, marginBottom: 10 }}>
                    <input type="text" placeholder="MM/YY" style={{ flex: 1, padding: "12px 16px", border: `1px solid ${C.borderSoft}`, borderRadius: 8, fontSize: 14, backgroundColor: C.white }} />
                    <input type="text" placeholder="CVC" style={{ width: 80, padding: "12px 16px", border: `1px solid ${C.borderSoft}`, borderRadius: 8, fontSize: 14, backgroundColor: C.white }} />
                  </div>
                  <input type="email" placeholder="Email" style={{ width: "100%", padding: "12px 16px", border: `1px solid ${C.borderSoft}`, borderRadius: 8, fontSize: 14, backgroundColor: C.white }} />
                </div>
                <div style={{ padding: "12px 16px", backgroundColor: C.white, borderRadius: 8, border: `1px solid ${C.borderSoft}`, marginBottom: 28 }}>
                  <p style={{ fontSize: 11, color: C.textMuted, margin: 0, lineHeight: 1.5, fontWeight: 500 }}>
                    🔒 Secure payment processing via Stripe. All data encrypted end-to-end.
                  </p>
                </div>
                <div style={{ padding: "16px", backgroundColor: "rgba(199,70,52,0.06)", borderRadius: 8, border: `1px solid rgba(199,70,52,0.12)`, marginBottom: 28 }}>
                  <p style={{ fontSize: 13, fontWeight: 600, color: C.risk, marginBottom: 4 }}>Decision validation requires complete definition</p>
                  <p style={{ fontSize: 12, color: C.textSecondary, margin: 0, lineHeight: 1.5 }}>
                    Proceeding without structural verification introduces measurable risk to your decision.
                  </p>
                </div>
                <button onClick={handlePaymentSuccess} style={{ width: "100%", height: 56, backgroundColor: C.navy, color: C.white, border: "none", borderRadius: 12, fontSize: 16, fontWeight: 600, cursor: "pointer", transition: "all 200ms" }}
                  onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = "0 12px 32px rgba(14,26,43,0.20)"; }}
                  onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "0 8px 24px rgba(14,26,43,0.12)"; }}>
                  Unlock Full Verification — $69
                </button>
                <p style={{ fontSize: 12, color: C.textMuted, textAlign: "center", marginTop: 14 }}>
                  Verification precedes commitment.
                </p>
              </>
            )}
          </div>
        </section>
      )}

      {section === "success" && (
        <section ref={sectionRef} style={{ backgroundColor: C.navy, padding: "72px 20px", minHeight: "100vh", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center" }}>
          <div style={{ maxWidth: 420, margin: "0 auto", textAlign: "center" }}>
            <h1 style={{ fontSize: 32, fontWeight: 700, lineHeight: 1.1, letterSpacing: "-0.03em", color: C.sandText, marginBottom: 24 }}>
              Verification complete
            </h1>
            <p style={{ fontSize: 16, color: C.sandMuted, lineHeight: 1.6, marginBottom: 32 }}>
              Your decision is now fully defined.
            </p>
            <button style={{ width: "100%", height: 56, backgroundColor: C.teal, color: C.white, border: "none", borderRadius: 12, fontSize: 16, fontWeight: 600, cursor: "pointer", transition: "all 200ms" }}
              onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = "0 12px 32px rgba(31,109,122,0.30)"; }}
              onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "0 8px 24px rgba(31,109,122,0.20)"; }}>
              View Full Report →
            </button>
          </div>
        </section>
      )}
    </div>
  );
}

/* ================================================================ */
/* DESKTOP INSTITUTIONAL LANDING (CSS-based responsive)             */
/* ================================================================ */

function DesktopInstitutionalLanding() {
  return (
    <div style={{ backgroundColor: C.white }}>
      {/* Hero */}
      <section style={{ padding: "100px 40px", backgroundColor: C.white }}>
        <div style={{ maxWidth: 1100, margin: "0 auto", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 64, alignItems: "center" }}>
          <div>
            <h1 style={{ fontSize: 52, fontWeight: 600, lineHeight: 1.1, letterSpacing: "-0.03em", color: C.navy, marginBottom: 32 }}>
              Major financial decisions require income verification.<br />
              <span style={{ fontWeight: 400 }}>This defines whether it holds.</span>
            </h1>
            <p style={{ fontSize: 16, fontWeight: 500, color: C.textSecondary, marginBottom: 24, lineHeight: 1.6 }}>
              Used before mortgage, investment, and major financial commitments.
            </p>
            <div style={{ padding: "24px", backgroundColor: C.navy, borderRadius: 12, marginBottom: 32, opacity: 0.8 }}>
              <p style={{ fontSize: 13, fontWeight: 600, color: C.teal, letterSpacing: "0.06em", marginBottom: 12 }}>System basis</p>
              <ul style={{ fontSize: 14, color: C.sandText, lineHeight: 1.8, margin: 0, paddingLeft: 0, listStyle: "none" }}>
                <li>Required before financial commitment</li>
                <li>Verified using fixed structural rules</li>
                <li>Same inputs produce the same result</li>
                <li>Applied consistently across evaluated income structures</li>
              </ul>
            </div>
            <p style={{ fontSize: 14, fontWeight: 500, color: C.textSecondary, marginBottom: 32 }}>
              <strong style={{ color: C.navy }}>Unverified income introduces structural risk.</strong>
            </p>
            <button style={{ padding: "16px 32px", backgroundColor: C.navy, color: C.white, border: "none", borderRadius: 12, fontSize: 16, fontWeight: 600, cursor: "pointer", transition: "all 200ms" }}
              onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = "0 12px 32px rgba(14,26,43,0.20)"; }}
              onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "0 8px 24px rgba(14,26,43,0.12)"; }}>
              Start Verification →
            </button>
            <p style={{ fontSize: 13, color: C.textMuted, marginTop: 16 }}>
              Answer 6 structural inputs. Receive classification immediately.
            </p>
            <p style={{ fontSize: 12, color: C.textMuted, marginTop: 16, letterSpacing: "0.05em" }}>
              Free · Private · No documents · Immediate result
            </p>
          </div>
          <div style={{ backgroundColor: C.navy, borderRadius: 20, padding: "40px 32px", position: "relative", overflow: "hidden" }}>
            <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 3, background: `linear-gradient(90deg, ${C.teal}, ${C.purple})` }} />
            <div style={{ fontSize: 11, fontWeight: 600, color: C.teal, letterSpacing: "0.08em", marginBottom: 20 }}>EXAMPLE OUTCOME</div>
            <div style={{ fontSize: 64, fontWeight: 700, fontFamily: mono, color: C.sandText, lineHeight: 1, marginBottom: 8 }}>72</div>
            <div style={{ fontSize: 14, fontWeight: 600, color: C.sandText, marginBottom: 24 }}>/100</div>
            <div style={{ fontSize: 14, fontWeight: 600, color: C.established, display: "inline-block", padding: "8px 16px", backgroundColor: `${C.established}15`, borderRadius: 10, marginBottom: 24 }}>
              Established Stability
            </div>
            <div style={{ display: "flex", height: 10, borderRadius: 999, overflow: "hidden", marginBottom: 12 }}>
              <div style={{ width: "28%", backgroundColor: C.established }} />
              <div style={{ width: "40%", backgroundColor: C.moderate }} />
              <div style={{ width: "32%", backgroundColor: C.risk }} />
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", gap: 8 }}>
              <span style={{ fontSize: 11, fontWeight: 600, color: C.established }}>Protected</span>
              <span style={{ fontSize: 11, fontWeight: 600, color: C.moderate }}>Recurring</span>
              <span style={{ fontSize: 11, fontWeight: 600, color: C.risk }}>At Risk</span>
            </div>
            <div style={{ marginTop: 20, paddingTop: 20, borderTop: "1px solid rgba(255,255,255,0.10)" }}>
              <p style={{ fontSize: 12, color: C.sandLight, margin: 0, lineHeight: 1.5 }}>
                RunPayway™ establishes a standardized method for evaluating income structure prior to financial decisions.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Decision Entry */}
      <section style={{ padding: "80px 40px", backgroundColor: C.panelFill }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <h2 style={{ fontSize: 32, fontWeight: 600, color: C.navy, marginBottom: 12, letterSpacing: "-0.02em" }}>
            This decision requires verification
          </h2>
          <p style={{ fontSize: 15, color: C.textSecondary, marginBottom: 32, lineHeight: 1.6 }}>
            Select the decision being evaluated.
          </p>
          <p style={{ fontSize: 13, color: C.textMuted, marginBottom: 32 }}>
            Verification is based on this selection.
          </p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 20, marginBottom: 48 }}>
            {(["Mortgage commitment", "Business expansion", "Hiring", "Investment", "Time off", "Retirement transition"] as string[]).map((label) => (
              <button key={label} style={{ padding: "28px", backgroundColor: C.white, border: `1px solid ${C.borderSoft}`, borderRadius: 12, fontSize: 15, fontWeight: 600, color: C.navy, cursor: "pointer", textAlign: "left", transition: "all 200ms" }}
                onMouseEnter={e => { e.currentTarget.style.backgroundColor = C.navy; e.currentTarget.style.color = C.white; e.currentTarget.style.borderColor = C.navy; }}
                onMouseLeave={e => { e.currentTarget.style.backgroundColor = C.white; e.currentTarget.style.color = C.navy; e.currentTarget.style.borderColor = C.borderSoft; }}>
                {label}
              </button>
            ))}
          </div>
          <div style={{ backgroundColor: C.navy, borderRadius: 12, padding: "24px" }}>
            <p style={{ fontSize: 14, color: C.sandMuted, margin: 0, lineHeight: 1.6 }}>
              Each decision is evaluated against income structure. Verification occurs immediately after input.
            </p>
          </div>
        </div>
      </section>

      {/* What You Receive - Decision Output Preview */}
      <section style={{ padding: "80px 40px", backgroundColor: C.panelFill }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <h2 style={{ fontSize: 32, fontWeight: 600, color: C.navy, marginBottom: 32, letterSpacing: "-0.02em" }}>
            Classification output
          </h2>
          <div style={{ maxWidth: 600, margin: "0 auto", backgroundColor: C.panelFill, borderRadius: 12, padding: "40px", marginBottom: 32 }}>
            <p style={{ fontSize: 14, fontWeight: 600, color: C.navy, marginBottom: 24 }}>Example: Mortgage commitment</p>
            <div style={{ padding: "20px", backgroundColor: C.white, borderRadius: 10, marginBottom: 20, borderLeft: `4px solid ${C.risk}` }}>
              <p style={{ fontSize: 12, fontWeight: 600, color: C.textMuted, margin: "0 0 8px", letterSpacing: "0.05em" }}>STRUCTURAL STATUS</p>
              <p style={{ fontSize: 15, fontWeight: 600, color: C.risk, margin: 0 }}>Not structurally aligned</p>
            </div>
            <div style={{ padding: "20px", backgroundColor: C.white, borderRadius: 10, marginBottom: 20 }}>
              <p style={{ fontSize: 12, fontWeight: 600, color: C.textMuted, margin: "0 0 8px", letterSpacing: "0.05em" }}>PRIMARY CONSTRAINT</p>
              <p style={{ fontSize: 15, color: C.textPrimary, margin: 0 }}>Income dependency reduces continuity under disruption</p>
            </div>
            <div style={{ padding: "20px", backgroundColor: C.white, borderRadius: 10 }}>
              <p style={{ fontSize: 12, fontWeight: 600, color: C.textMuted, margin: "0 0 8px", letterSpacing: "0.05em" }}>IMPLICATION</p>
              <p style={{ fontSize: 15, color: C.textPrimary, margin: 0 }}>Continuity is not established under current structure</p>
            </div>
          </div>
          <p style={{ fontSize: 14, color: C.textSecondary, marginBottom: 8, textAlign: "center" }}>
            Classification determines decision alignment.
          </p>
          <p style={{ fontSize: 14, color: C.textSecondary, textAlign: "center" }}>
            Full report shows structural factors and verification criteria.
          </p>
        </div>
      </section>

      {/* Evaluation Assessment */}
      <section style={{ padding: "80px 40px", backgroundColor: C.white }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <h2 style={{ fontSize: 32, fontWeight: 600, color: C.navy, marginBottom: 12, letterSpacing: "-0.02em", textAlign: "center" }}>
            Evaluate your income structure
          </h2>
          <p style={{ fontSize: 15, color: C.textSecondary, marginBottom: 40, lineHeight: 1.7, textAlign: "center" }}>
            Answer 6 structural questions. Receive your classification in 90 seconds.
          </p>
          <div className="verification-flow" style={{ backgroundColor: C.panelFill, borderRadius: 12, overflow: "hidden", border: `1px solid ${C.borderSoft}` }}>
            <div style={{ backgroundColor: C.navy, padding: "20px", textAlign: "center" }}>
              <p style={{ fontSize: 13, fontWeight: 600, color: C.teal, letterSpacing: "0.08em", margin: 0 }}>INCOME STRUCTURE EVALUATION</p>
            </div>
            <div style={{ padding: "40px", minHeight: 300, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <div style={{ textAlign: "center" }}>
                <p style={{ fontSize: 15, color: C.textSecondary, marginBottom: 24 }}>
                  Evaluate your income structure. Classification is immediate and permanent.
                </p>
                <button style={{ padding: "16px 40px", backgroundColor: C.navy, color: C.white, border: "none", borderRadius: 12, fontSize: 16, fontWeight: 600, cursor: "pointer", transition: "all 200ms" }}
                  onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = "0 12px 32px rgba(14,26,43,0.20)"; }}
                  onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "0 8px 24px rgba(14,26,43,0.12)"; }}>
                  Start Verification →
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Reality */}
      <section style={{ padding: "80px 40px", backgroundColor: C.panelFill }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <h2 style={{ fontSize: 32, fontWeight: 600, color: C.navy, marginBottom: 24, letterSpacing: "-0.02em" }}>
            When structure changes, commitments break
          </h2>
          <p style={{ fontSize: 15, color: C.textSecondary, lineHeight: 1.7, marginBottom: 20 }}>
            A consultant losing one client. A contractor with no retainer agreements. A sales professional hitting a slow market. Income doesn't disappear—structure fails.
          </p>
          <ul style={{ fontSize: 15, color: C.textPrimary, lineHeight: 1.8, margin: "0 0 24px", paddingLeft: 0, listStyle: "none" }}>
            <li>• Mortgage becomes unsustainable</li>
            <li>• Hiring commitments reverse</li>
            <li>• Investment capital is at risk</li>
          </ul>
          <p style={{ fontSize: 14, color: C.textSecondary }}>
            This is not volatility. This is structural failure.
          </p>
        </div>
      </section>

      {/* Contrast */}
      <section style={{ padding: "80px 40px", backgroundColor: C.white }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <h2 style={{ fontSize: 32, fontWeight: 600, color: C.navy, marginBottom: 32, letterSpacing: "-0.02em" }}>
            Same income. Different stability.
          </h2>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 32, marginBottom: 32 }}>
            <div style={{ padding: "32px", backgroundColor: C.white, border: `1px solid ${C.borderSoft}`, borderRadius: 12, position: "relative", overflow: "hidden" }}>
              <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 4, backgroundColor: C.risk }} />
              <p style={{ fontSize: 15, fontWeight: 600, color: C.navy, marginBottom: 8 }}>Freelancer</p>
              <p style={{ fontSize: 13, color: C.textSecondary, marginBottom: 20 }}>$150K / 1 client<br />No contracts</p>
              <div style={{ display: "flex", height: 8, borderRadius: 999, overflow: "hidden", marginBottom: 20 }}>
                <div style={{ width: "80%", backgroundColor: C.risk }} />
                <div style={{ width: "20%", backgroundColor: C.moderate }} />
              </div>
              <p style={{ fontSize: 32, fontWeight: 700, fontFamily: mono, color: C.risk, margin: "0 0 8px" }}>31</p>
              <p style={{ fontSize: 13, fontWeight: 600, color: C.risk }}>At Risk</p>
              <p style={{ fontSize: 12, color: C.textMuted, marginTop: 16 }}>Loss of one client = 100% income loss</p>
            </div>
            <div style={{ padding: "32px", backgroundColor: C.white, border: `1px solid ${C.borderSoft}`, borderRadius: 12, position: "relative", overflow: "hidden" }}>
              <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 4, backgroundColor: C.established }} />
              <p style={{ fontSize: 15, fontWeight: 600, color: C.navy, marginBottom: 8 }}>Diversified</p>
              <p style={{ fontSize: 13, color: C.textSecondary, marginBottom: 20 }}>$150K / 5 clients<br />40% recurring</p>
              <div style={{ display: "flex", height: 8, borderRadius: 999, overflow: "hidden", marginBottom: 20 }}>
                <div style={{ width: "40%", backgroundColor: C.established }} />
                <div style={{ width: "35%", backgroundColor: C.moderate }} />
                <div style={{ width: "25%", backgroundColor: C.risk }} />
              </div>
              <p style={{ fontSize: 32, fontWeight: 700, fontFamily: mono, color: C.established, margin: "0 0 8px" }}>74</p>
              <p style={{ fontSize: 13, fontWeight: 600, color: C.established }}>Established</p>
              <p style={{ fontSize: 12, color: C.textMuted, marginTop: 16 }}>Loss of one client = 20% income impact</p>
            </div>
          </div>
          <p style={{ fontSize: 15, color: C.textSecondary, marginBottom: 12 }}>
            Same income. Different structural vulnerability.
          </p>
          <p style={{ fontSize: 14, color: C.textSecondary }}>
            The 31 score is not "bad income." The 74 score is not "good income." The difference is structural resilience under disruption.
          </p>
        </div>
      </section>

      {/* Core Positioning */}
      <section style={{ padding: "80px 40px", backgroundColor: C.panelFill }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <h2 style={{ fontSize: 32, fontWeight: 600, color: C.navy, marginBottom: 24, letterSpacing: "-0.02em" }}>
            RunPayway™ defines how income stability is measured.
          </h2>
          <p style={{ fontSize: 15, color: C.textSecondary, lineHeight: 1.7, marginBottom: 16 }}>
            It determines whether income holds when conditions change.
          </p>
          <p style={{ fontSize: 14, color: C.textSecondary }}>
            The same model is applied to every profile. The output is fixed. The inputs determine the result.
          </p>
        </div>
      </section>

      {/* Income Appears Stable Until Structure Fails */}
      <section style={{ padding: "80px 40px", backgroundColor: C.panelFill }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <h2 style={{ fontSize: 32, fontWeight: 600, color: C.navy, marginBottom: 24, letterSpacing: "-0.02em" }}>
            Income appears stable until structure fails.
          </h2>
          <p style={{ fontSize: 15, color: C.textSecondary, lineHeight: 1.7, marginBottom: 24 }}>
            General income assumptions do not define stability.
          </p>
          <ul style={{ fontSize: 15, color: C.textPrimary, lineHeight: 1.8, margin: 0, paddingLeft: 0, listStyle: "none" }}>
            <li>• Concentration</li>
            <li>• Continuity</li>
            <li>• Visibility</li>
            <li>• Contractual security</li>
            <li>• Activity dependence</li>
          </ul>
          <p style={{ fontSize: 14, color: C.textSecondary, marginTop: 24 }}>
            RunPayway™ defines what determines the score.
          </p>
        </div>
      </section>

      {/* Decision Requirement */}
      <section style={{ padding: "80px 40px", backgroundColor: C.panelFill }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <h2 style={{ fontSize: 32, fontWeight: 600, color: C.navy, marginBottom: 28, letterSpacing: "-0.02em" }}>
            These decisions require income stability
          </h2>
          <ul style={{ fontSize: 15, color: C.textPrimary, lineHeight: 1.9, margin: "0 0 28px", paddingLeft: 0, listStyle: "none" }}>
            <li>• Mortgage commitment requires income continuity</li>
            <li>• Hiring requires sustained income obligations</li>
            <li>• Investment requires structural resilience</li>
          </ul>
          <p style={{ fontSize: 14, color: C.textSecondary, marginBottom: 32 }}>
            Verification precedes commitment.
          </p>
          <button style={{ padding: "16px 32px", backgroundColor: C.navy, color: C.white, border: "none", borderRadius: 12, fontSize: 16, fontWeight: 600, cursor: "pointer", transition: "all 200ms" }}
            onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = "0 12px 32px rgba(14,26,43,0.20)"; }}
            onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "0 8px 24px rgba(14,26,43,0.12)"; }}>
            Start Verification →
          </button>
        </div>
      </section>


      {/* How It Works */}
      <section style={{ padding: "80px 40px", backgroundColor: C.white }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <h2 style={{ fontSize: 32, fontWeight: 600, color: C.navy, marginBottom: 24, letterSpacing: "-0.02em" }}>
            How income stability is verified
          </h2>
          <p style={{ fontSize: 15, color: C.textSecondary, lineHeight: 1.7, marginBottom: 24 }}>
            Inputs are processed using fixed structural factors.
          </p>
          <ul style={{ fontSize: 15, color: C.textPrimary, lineHeight: 1.8, margin: "0 0 24px", paddingLeft: 0, listStyle: "none" }}>
            <li>• Stability classification</li>
            <li>• Primary structural constraint</li>
            <li>• Full structural analysis</li>
          </ul>
          <p style={{ fontSize: 14, color: C.textSecondary }}>
            The same model is applied to every profile. Outputs are derived solely from submitted inputs. Same inputs produce the same result.
          </p>
        </div>
      </section>

      {/* Value */}
      <section style={{ padding: "80px 40px", backgroundColor: C.panelFill }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <h2 style={{ fontSize: 32, fontWeight: 600, color: C.navy, marginBottom: 24, letterSpacing: "-0.02em" }}>
            Income is tracked. Stability is not.
          </h2>
          <p style={{ fontSize: 15, color: C.textSecondary, lineHeight: 1.7 }}>
            A credit score reflects borrowing behavior. An Income Stability Score™ defines whether income holds. Both are required for informed financial decisions.
          </p>
        </div>
      </section>

      {/* Pricing */}
      <section style={{ padding: "80px 40px", backgroundColor: C.white }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <h2 style={{ fontSize: 32, fontWeight: 600, color: C.navy, marginBottom: 24, letterSpacing: "-0.02em" }}>
            Start with classification. Complete with verification.
          </h2>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 32, marginBottom: 40 }}>
            <div style={{ padding: "40px", backgroundColor: C.panelFill, border: `1px solid ${C.borderSoft}`, borderRadius: 12 }}>
              <p style={{ fontSize: 12, fontWeight: 600, color: C.teal, letterSpacing: "0.08em", marginBottom: 16 }}>FREE — STABILITY CLASS</p>
              <ul style={{ fontSize: 14, color: C.textPrimary, lineHeight: 1.8, margin: 0, paddingLeft: 0, listStyle: "none" }}>
                <li>• Classification</li>
                <li>• Primary structural constraint</li>
              </ul>
            </div>
            <div style={{ padding: "40px", backgroundColor: C.panelFill, borderRadius: 12, borderLeft: `4px solid ${C.teal}` }}>
              <p style={{ fontSize: 12, fontWeight: 600, color: C.teal, letterSpacing: "0.08em", marginBottom: 16 }}>$69 — FULL REPORT</p>
              <ul style={{ fontSize: 14, color: C.textPrimary, lineHeight: 1.8, margin: 0, paddingLeft: 0, listStyle: "none" }}>
                <li>• Score (0–100)</li>
                <li>• Structural breakdown</li>
                <li>• Constraint definition</li>
                <li>• Decision verification</li>
              </ul>
            </div>
          </div>
          <div style={{ backgroundColor: C.navy, borderRadius: 12, padding: "32px", textAlign: "center" }}>
            <p style={{ fontSize: 14, color: C.sandText, margin: 0, lineHeight: 1.8 }}>
              The classification defines position. The report defines what determines your score. Full verification is required before financial commitment.
            </p>
          </div>
        </div>
      </section>

      {/* Structure Can Change */}
      <section style={{ padding: "80px 40px", backgroundColor: C.panelFill }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <h2 style={{ fontSize: 32, fontWeight: 600, color: C.navy, marginBottom: 24, letterSpacing: "-0.02em" }}>
            Structure can change.
          </h2>
          <p style={{ fontSize: 15, color: C.textSecondary, lineHeight: 1.7, marginBottom: 20 }}>
            One structural constraint determines the score.
          </p>
          <p style={{ fontSize: 15, color: C.textSecondary, marginBottom: 20 }}>
            Measurement → structural change → reassessment
          </p>
          <p style={{ fontSize: 14, color: C.textSecondary }}>
            The same model is applied at each step.
          </p>
        </div>
      </section>

      {/* System Integrity */}
      <section style={{ padding: "80px 40px", backgroundColor: C.white }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <h2 style={{ fontSize: 32, fontWeight: 600, color: C.navy, marginBottom: 32, letterSpacing: "-0.02em" }}>
            System integrity
          </h2>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 40, marginBottom: 32 }}>
            <div>
              <h3 style={{ fontSize: 15, fontWeight: 600, color: C.navy, marginBottom: 16 }}>Methodology</h3>
              <ul style={{ fontSize: 14, color: C.textPrimary, lineHeight: 1.9, margin: 0, paddingLeft: 0, listStyle: "none" }}>
                <li>• Fixed structural factors</li>
                <li>• No subjective input</li>
                <li>• Inputs determine output exclusively</li>
                <li>• Model version stamped on every result</li>
              </ul>
            </div>
            <div>
              <h3 style={{ fontSize: 15, fontWeight: 600, color: C.navy, marginBottom: 16 }}>Auditability</h3>
              <ul style={{ fontSize: 14, color: C.textPrimary, lineHeight: 1.9, margin: 0, paddingLeft: 0, listStyle: "none" }}>
                <li>• Every classification timestamped</li>
                <li>• Version-locked to model release</li>
                <li>• Permanent record for income snapshot</li>
                <li>• Reassessment required for structural change</li>
              </ul>
            </div>
          </div>
          <p style={{ fontSize: 14, color: C.textSecondary, marginBottom: 16 }}>
            This is a standardized measurement system. Not an estimate. Not a forecast. Results are derived exclusively from structure, not from income level or credit history.
          </p>
          <p style={{ fontSize: 14, color: C.textSecondary, marginBottom: 16 }}>
            Classifications are permanent for the evaluated income structure. If structure changes, reassessment is required—prior classification remains in archive.
          </p>
          <p style={{ fontSize: 14, color: C.textSecondary, marginBottom: 32 }}>
            Used where income stability must be evaluated and verified before financial commitment.
          </p>
          <div style={{ display: "flex", gap: 24, justifyContent: "flex-start" }}>
            <button style={{ padding: "12px 28px", backgroundColor: C.navy, color: C.white, border: "none", borderRadius: 10, fontSize: 14, fontWeight: 600, cursor: "pointer", transition: "all 200ms" }}
              onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-2px)"; }}
              onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; }}>
              For Advisors
            </button>
            <button style={{ padding: "12px 28px", backgroundColor: C.navy, color: C.white, border: "none", borderRadius: 10, fontSize: 14, fontWeight: 600, cursor: "pointer", transition: "all 200ms" }}
              onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-2px)"; }}
              onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; }}>
              For Organizations
            </button>
          </div>
        </div>
      </section>

      {/* Workflow Integration */}
      <section style={{ padding: "80px 40px", backgroundColor: C.panelFill }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <h2 style={{ fontSize: 32, fontWeight: 600, color: C.navy, marginBottom: 32, letterSpacing: "-0.02em" }}>
            Implementation workflow
          </h2>
          <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: 32 }}>
            <div>
              <h3 style={{ fontSize: 16, fontWeight: 600, color: C.navy, marginBottom: 20 }}>Mortgage Underwriting</h3>
              <ol style={{ fontSize: 14, color: C.textPrimary, lineHeight: 2, margin: 0, paddingLeft: 20, listStyle: "decimal" }}>
                <li>Borrower submits income documentation (tax returns, contracts, bank statements)</li>
                <li>Loan officer evaluates 6 structural factors: concentration, continuity, visibility, contracts, activity dependence, variability</li>
                <li>Classification returned in 90 seconds (Free: Stability Class; Full: Income Stability Score™ with structural breakdown)</li>
                <li>Score locked to file with timestamp and model version (RP-2.0)</li>
                <li>Classification used in pre-approval decision framework</li>
                <li>Score remains permanent for this income snapshot; reassessment required if income structure changes</li>
              </ol>
            </div>
          </div>
          <div style={{ backgroundColor: C.navy, borderRadius: 12, padding: "32px", marginTop: 32, textAlign: "center" }}>
            <p style={{ fontSize: 14, color: C.sandText, margin: 0, lineHeight: 1.8 }}>
              Classification is permanent and auditable. Prior evaluations remain archival. Reassess quarterly for variable income or immediately upon structural change.
            </p>
          </div>
        </div>
      </section>

      {/* Final Close */}
      <section style={{ padding: "100px 40px", backgroundColor: C.navy }}>
        <div style={{ maxWidth: 1100, margin: "0 auto", textAlign: "center" }}>
          <h2 style={{ fontSize: 36, fontWeight: 600, color: C.sandText, marginBottom: 24, lineHeight: 1.3, letterSpacing: "-0.02em" }}>
            Major financial decisions require income verification.
          </h2>
          <p style={{ fontSize: 16, color: C.sandMuted, marginBottom: 8, lineHeight: 1.6 }}>
            Verification precedes commitment.
          </p>
          <p style={{ fontSize: 16, color: C.sandMuted, marginBottom: 8, lineHeight: 1.6 }}>
            RunPayway™ defines whether income stability holds.
          </p>
          <p style={{ fontSize: 15, fontWeight: 500, color: C.teal, marginBottom: 32 }}>
            This is not defined until verified.
          </p>
          <button style={{ padding: "16px 40px", backgroundColor: C.teal, color: C.white, border: "none", borderRadius: 12, fontSize: 16, fontWeight: 600, cursor: "pointer", transition: "all 200ms" }}
            onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = "0 12px 32px rgba(31,109,122,0.30)"; }}
            onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "0 8px 24px rgba(31,109,122,0.20)"; }}>
            Start Verification →
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer style={{ backgroundColor: C.navy, borderTop: `1px solid rgba(255,255,255,0.10)`, padding: "40px", textAlign: "center" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <p style={{ fontSize: 12, color: C.sandLight, lineHeight: 1.8, margin: 0 }}>
            © 2026 RunPayway™. All rights reserved. RunPayway™ is a product of PeopleStar Enterprises, LLC. Orange County, California, USA. Structural Stability Model RP-2.0.
          </p>
        </div>
      </footer>
    </div>
  );
}

/* ================================================================ */
/* MAIN COMPONENT                                                     */
/* ================================================================ */

export default function Page() {
  return (
    <div>
      <style>{`
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", "Inter", Roboto, "Helvetica Neue", Arial, sans-serif; }
        html { scroll-behavior: smooth; }

        @media (max-width: 768px) {
          .desktop-only { display: none !important; }
          .verification-flow { max-width: 100%; }
        }

        @media (min-width: 769px) {
          .mobile-landing { display: none !important; }
          .verification-flow { max-width: 600px; margin: 0 auto; }
        }
      `}</style>

      <div className="mobile-only">
        <MobileDecisionFlow />
      </div>

      <div className="desktop-only">
        <DesktopInstitutionalLanding />
      </div>
    </div>
  );
}
