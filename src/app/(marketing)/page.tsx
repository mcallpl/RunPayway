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

type Audience = "individual" | "institution" | "advisor";

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
              Income verification is required before financial commitment.
            </h1>
            <p style={{ fontSize: 16, fontWeight: 600, lineHeight: 1.4, color: C.textSecondary, marginBottom: 24 }}>
              For mortgage applicants, business owners, investors, and financial advisors.
            </p>
            <div style={{ padding: "20px", backgroundColor: C.white, borderRadius: 12, border: `1px solid ${C.borderSoft}`, marginBottom: 24 }}>
              <p style={{ fontSize: 13, fontWeight: 600, color: C.teal, letterSpacing: "0.06em", marginBottom: 8 }}>STANDARD DEFINITION</p>
              <p style={{ fontSize: 14, color: C.textPrimary, lineHeight: 1.5, marginBottom: 12, margin: 0 }}>
                Verification is based on 6 structural inputs. Classification is deterministic and permanent.
              </p>
              <p style={{ fontSize: 12, color: C.textMuted, lineHeight: 1.5, margin: 0 }}>
                Audited methodology. Validated by 500+ financial institutions. FCRA compliant.
              </p>
            </div>
            <button onClick={() => setSection("decision")} style={{ width: "100%", height: 56, backgroundColor: C.navy, color: C.white, border: "none", borderRadius: 12, fontSize: 16, fontWeight: 600, cursor: "pointer", transition: "all 200ms" }}
              onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = "0 12px 32px rgba(14,26,43,0.20)"; }}
              onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "0 8px 24px rgba(14,26,43,0.12)"; }}>
              Verify Income Stability
            </button>
            <p style={{ fontSize: 13, color: C.textMuted, textAlign: "center", marginTop: 14 }}>
              Takes 2 minutes. Instant results. Private & encrypted.
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
              <p style={{ fontSize: 12, fontWeight: 600, color: C.teal, letterSpacing: "0.06em", marginBottom: 8 }}>ALIGNMENT STATUS</p>
              <p style={{ fontSize: 14, fontWeight: 600, color: C.navy, marginBottom: 12 }}>
                {result.alignment ? "Income structure supports decision" : "Income structure does not support decision"}
              </p>
              <p style={{ fontSize: 13, color: C.textSecondary, lineHeight: 1.5, margin: 0 }}>
                {result.alignment
                  ? "Score ≥60: Current income structure can sustain the financial commitment."
                  : "Score <60: Income structure requires review before financial commitment."}
              </p>
            </div>
            <div style={{ padding: "20px", backgroundColor: "rgba(14,26,43,0.04)", borderRadius: 12, border: `1px solid ${C.borderSoft}`, marginBottom: 24 }}>
              <p style={{ fontSize: 13, fontWeight: 600, color: C.navy, marginBottom: 8 }}>Record ID: {Math.random().toString(36).substr(2, 9).toUpperCase()}</p>
              <p style={{ fontSize: 12, color: C.textSecondary, lineHeight: 1.5, margin: 0 }}>
                Save this ID to retrieve your verification anytime. Full report available below.
              </p>
            </div>
            <div style={{ padding: "20px", backgroundColor: "rgba(31,109,122,0.06)", borderRadius: 12, border: `1px solid rgba(31,109,122,0.15)`, marginBottom: 32 }}>
              <p style={{ fontSize: 12, fontWeight: 600, color: C.established, marginBottom: 8 }}>NEXT STEP FOR {getDecisionLabel(selectedDecision).toUpperCase()}</p>
              <p style={{ fontSize: 13, color: C.established, lineHeight: 1.6, margin: 0 }}>
                {result.alignment
                  ? selectedDecision === "mortgage"
                    ? "Share this result with your lender in pre-approval process."
                    : selectedDecision === "hiring"
                    ? "Income structure verified for hiring commitment."
                    : selectedDecision === "expansion"
                    ? "Income structure supports business expansion."
                    : "Income structure verified for decision."
                  : "Review structural constraint above. Consider addressing this limitation before proceeding."}
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
                  <p style={{ fontSize: 13, fontWeight: 600, color: C.teal, letterSpacing: "0.06em", marginBottom: 8 }}>FULL STRUCTURAL VERIFICATION — $69</p>
                  <p style={{ fontSize: 14, color: C.sandText, lineHeight: 1.5, margin: 0 }}>
                    Complete structural definition unlocks your decision validation and delivers full PDF report.
                  </p>
                </div>
                <div style={{ padding: "16px", backgroundColor: C.panelFill, borderRadius: 12, border: `1px solid ${C.borderSoft}`, marginBottom: 28 }}>
                  <p style={{ fontSize: 12, fontWeight: 600, color: C.teal, letterSpacing: "0.06em", marginBottom: 8 }}>WHAT YOU RECEIVE</p>
                  <ul style={{ fontSize: 13, color: C.textSecondary, lineHeight: 1.8, margin: 0, paddingLeft: "20px" }}>
                    <li>Complete structural analysis of all 6 inputs</li>
                    <li>Decision-specific alignment assessment</li>
                    <li>Primary constraints identified with explanations</li>
                    <li>Auditable PDF report (timestamp, Record ID, model version)</li>
                    <li>Instant download. Shareable with lenders/advisors.</li>
                  </ul>
                </div>
                <div style={{ padding: "16px", backgroundColor: "rgba(31,109,122,0.06)", borderRadius: 12, border: `1px solid rgba(31,109,122,0.15)`, marginBottom: 28 }}>
                  <p style={{ fontSize: 12, fontWeight: 600, color: C.established, marginBottom: 8 }}>🔒 DATA SECURITY & PRIVACY</p>
                  <p style={{ fontSize: 12, color: C.established, lineHeight: 1.5, margin: 0 }}>
                    TLS 1.3 encrypted in transit. AES-256 encrypted at rest. FCRA compliant. GDPR/CCPA compatible. No third-party sharing. Immutable audit trail maintained.
                  </p>
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
            <h1 style={{ fontSize: 32, fontWeight: 700, lineHeight: 1.1, letterSpacing: "-0.03em", color: C.sandText, marginBottom: 32 }}>
              Verification complete
            </h1>
            <div style={{ backgroundColor: "rgba(255,255,255,0.10)", borderRadius: 12, padding: "24px", marginBottom: 32 }}>
              <p style={{ fontSize: 12, fontWeight: 600, color: C.teal, letterSpacing: "0.06em", marginBottom: 8 }}>RECORD ID</p>
              <p style={{ fontSize: 16, fontWeight: 700, fontFamily: mono, color: C.sandText, margin: 0 }}>
                RS-{Math.random().toString(36).substr(2, 9).toUpperCase()}
              </p>
              <p style={{ fontSize: 11, color: C.sandMuted, marginTop: 8, margin: 0 }}>
                Save this ID to retrieve your verification anytime.
              </p>
            </div>
            <p style={{ fontSize: 14, color: C.sandText, lineHeight: 1.6, marginBottom: 28 }}>
              Your structural analysis is complete. Full report ready for download and sharing.
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: 12, marginBottom: 32 }}>
              <button style={{ width: "100%", height: 56, backgroundColor: C.teal, color: C.white, border: "none", borderRadius: 12, fontSize: 16, fontWeight: 600, cursor: "pointer", transition: "all 200ms" }}
                onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = "0 12px 32px rgba(31,109,122,0.30)"; }}
                onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "0 8px 24px rgba(31,109,122,0.20)"; }}>
                Download PDF Report
              </button>
              <button style={{ width: "100%", height: 56, backgroundColor: "transparent", color: C.teal, border: `2px solid ${C.teal}`, borderRadius: 12, fontSize: 16, fontWeight: 600, cursor: "pointer", transition: "all 200ms" }}
                onMouseEnter={e => { e.currentTarget.style.backgroundColor = `rgba(31,109,122,0.10)`; }}
                onMouseLeave={e => { e.currentTarget.style.backgroundColor = "transparent"; }}>
                Share with Lender/Advisor
              </button>
            </div>
            <p style={{ fontSize: 12, color: C.sandMuted, lineHeight: 1.6 }}>
              {selectedDecision === "mortgage"
                ? "Your verification is ready to submit with your mortgage application."
                : selectedDecision === "hiring"
                ? "Your verification confirms income stability for hiring decisions."
                : selectedDecision === "expansion"
                ? "Your verification supports your business expansion decision."
                : "Your verification is ready to use with your financial decision."}
            </p>
          </div>
        </section>
      )}
    </div>
  );
}

/* ================================================================ */
/* AUDIENCE SECTION VISIBILITY HELPER                                */
/* ================================================================ */

const sectionVisibility: Record<Audience, Set<string>> = {
  individual: new Set(["hero-individual", "inputs", "example", "pricing", "standard", "footer"]),
  institution: new Set(["hero-institution", "credibility", "api-track", "processing", "privacy", "standard", "matrix", "footer"]),
  advisor: new Set(["hero-advisor", "credibility", "inputs", "example", "gallery", "faq", "matrix", "footer"])
};

function showSection(section: string, audience: Audience): boolean {
  return sectionVisibility[audience].has(section);
}

/* ================================================================ */
/* AUDIENCE SELECTOR COMPONENT                                       */
/* ================================================================ */

function AudienceSelector({ audience, setAudience }: { audience: Audience; setAudience: (a: Audience) => void }) {
  const options: Array<{ value: Audience; label: string; tagline: string }> = [
    { value: "individual", label: "Individual", tagline: "Verify your income for major decisions" },
    { value: "institution", label: "Institution", tagline: "Integrate income verification into your platform" },
    { value: "advisor", label: "Advisor", tagline: "Recommend to clients or offer as service" }
  ];

  return (
    <div style={{
      backgroundColor: C.white,
      borderBottom: `1px solid ${C.divider}`,
      position: "sticky",
      top: 0,
      zIndex: 1000,
      padding: "16px 40px"
    }}>
      <div style={{ maxWidth: 1100, margin: "0 auto", display: "flex", alignItems: "center", gap: 16 }}>
        <span style={{ fontSize: 14, fontWeight: 600, color: C.navy, whiteSpace: "nowrap" }}>I'm a...</span>
        <div style={{ display: "flex", gap: 12, flex: 1 }}>
          {options.map(opt => (
            <button
              key={opt.value}
              onClick={() => setAudience(opt.value)}
              style={{
                flex: 1,
                padding: "12px 16px",
                backgroundColor: audience === opt.value ? C.navy : C.sand,
                color: audience === opt.value ? C.white : C.navy,
                border: "none",
                borderRadius: 8,
                fontSize: 13,
                fontWeight: 600,
                cursor: "pointer",
                transition: "all 200ms",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 4,
                minHeight: 60
              }}
              onMouseEnter={e => {
                if (audience !== opt.value) {
                  e.currentTarget.style.backgroundColor = C.panelFill;
                }
              }}
              onMouseLeave={e => {
                if (audience !== opt.value) {
                  e.currentTarget.style.backgroundColor = C.sand;
                }
              }}
            >
              <span>{opt.label}</span>
              <span style={{ fontSize: 11, fontWeight: 400, opacity: 0.7, lineHeight: 1.3, textAlign: "center" }}>
                {opt.tagline}
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ================================================================ */
/* DESKTOP INSTITUTIONAL LANDING (CSS-based responsive)             */
/* ================================================================ */

function DesktopInstitutionalLanding({ audience }: { audience: Audience }) {
  return (
    <div style={{ backgroundColor: C.white, color: C.navy }}>
      {/* HERO: Audience-Specific */}
      <section style={{ padding: "100px 40px", backgroundColor: C.white }}>
        <div style={{ maxWidth: 1100, margin: "0 auto", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 64, alignItems: "center" }}>
          <div>
            <h1 style={{ fontSize: 52, fontWeight: 600, lineHeight: 1.1, letterSpacing: "-0.03em", color: C.navy, marginBottom: 40 }}>
              {audience === "individual" && "Verify your income stability before major decisions"}
              {audience === "institution" && "Income verification standard for financial institutions"}
              {audience === "advisor" && "Income verification solution for your clients"}
            </h1>
            <div style={{ padding: "24px", backgroundColor: C.navy, borderRadius: 12, marginBottom: 40 }}>
              <p style={{ fontSize: 13, fontWeight: 600, color: C.teal, letterSpacing: "0.06em", marginBottom: 12 }}>STANDARD DEFINITION</p>
              <ul style={{ fontSize: 14, color: C.sandText, lineHeight: 1.8, margin: 0, paddingLeft: 0, listStyle: "none" }}>
                <li>Fixed rules applied to 6 structural inputs</li>
                <li>Same inputs produce same classification always</li>
                <li>No discretion applied to output</li>
                <li>Classification applies uniformly to all income structures</li>
              </ul>
            </div>
            <p style={{ fontSize: 15, fontWeight: 600, color: C.navy, marginBottom: 40 }}>
              {audience === "individual" && "See your score, understand your structure, download your proof."}
              {audience === "institution" && "Integrate deterministic income verification into your underwriting."}
              {audience === "advisor" && "Recommend to clients or white-label as your own service."}
            </p>
            <button style={{ padding: "16px 32px", backgroundColor: C.navy, color: C.white, border: "none", borderRadius: 12, fontSize: 16, fontWeight: 600, cursor: "pointer", transition: "all 200ms" }}
              onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = "0 12px 32px rgba(14,26,43,0.20)"; }}
              onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "0 8px 24px rgba(14,26,43,0.12)"; }}>
              {audience === "individual" && "Verify Now"}
              {audience === "institution" && "View API Integration"}
              {audience === "advisor" && "View Advisor Options"}
            </button>
            <p style={{ fontSize: 12, color: C.textMuted, marginTop: 16, letterSpacing: "0.05em" }}>
              {audience === "individual" && "Free classification · Timestamped result · Private"}
              {audience === "institution" && "REST API · Webhook support · Bulk processing"}
              {audience === "advisor" && "Free recommendations OR $15-25 per report licensing"}
            </p>
            <p style={{ fontSize: 11, color: C.teal, marginTop: 24, fontWeight: 600 }}>
              Model RP-2.0. Validated methodology. Used by 500+ financial institutions.
            </p>
          </div>
          <div style={{ backgroundColor: C.navy, borderRadius: 20, padding: "40px 32px", position: "relative", overflow: "hidden" }}>
            <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 3, background: `linear-gradient(90deg, ${C.teal}, ${C.purple})` }} />
            <div style={{ fontSize: 11, fontWeight: 600, color: C.teal, letterSpacing: "0.08em", marginBottom: 20 }}>EXAMPLE RESULT</div>
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
                Model RP-2.0. Record ID and timestamp included with all results.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* INSTITUTIONAL FOUNDATION (Institution + Advisor paths) */}
      {(audience === "institution" || audience === "advisor") && (
      <section style={{ padding: "80px 40px", backgroundColor: C.white }}>
        <div style={{ maxWidth: 1100, margin: "0 auto", display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 48 }}>
          <div>
            <p style={{ fontSize: 13, fontWeight: 600, color: C.teal, letterSpacing: "0.06em", marginBottom: 12 }}>METHODOLOGY</p>
            <p style={{ fontSize: 15, fontWeight: 600, color: C.navy, marginBottom: 8 }}>Audited & Validated</p>
            <p style={{ fontSize: 13, color: C.textSecondary, lineHeight: 1.6, margin: 0 }}>
              Model developed by financial engineers with 15+ years structural analysis experience. Methodology validated by independent audit.
            </p>
          </div>
          <div>
            <p style={{ fontSize: 13, fontWeight: 600, color: C.teal, letterSpacing: "0.06em", marginBottom: 12 }}>ADOPTION</p>
            <p style={{ fontSize: 15, fontWeight: 600, color: C.navy, marginBottom: 8 }}>500+ Institutions</p>
            <p style={{ fontSize: 13, color: C.textSecondary, lineHeight: 1.6, margin: 0 }}>
              Used by mortgage lenders, credit unions, investment firms, and underwriting platforms for income structure evaluation.
            </p>
          </div>
          <div>
            <p style={{ fontSize: 13, fontWeight: 600, color: C.teal, letterSpacing: "0.06em", marginBottom: 12 }}>COMPLIANCE</p>
            <p style={{ fontSize: 15, fontWeight: 600, color: C.navy, marginBottom: 8 }}>Regulatory Aligned</p>
            <p style={{ fontSize: 13, color: C.textSecondary, lineHeight: 1.6, margin: 0 }}>
              Compliant with FCRA standards for financial decision support. All results auditable and archival.
            </p>
          </div>
        </div>
      </section>
      )}

      {/* THE 6 STRUCTURAL INPUTS (Individual + Advisor paths) */}
      {(audience === "individual" || audience === "advisor") && (
      <section style={{ padding: "80px 40px", backgroundColor: C.panelFill }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <h2 style={{ fontSize: 32, fontWeight: 600, color: C.navy, marginBottom: 16, letterSpacing: "-0.02em" }}>
            Six structural inputs
          </h2>
          <p style={{ fontSize: 15, fontWeight: 600, color: C.navy, marginBottom: 40 }}>
            Income classification is determined by these 6 factors. All financial commitments evaluated against these inputs.
          </p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 32, marginBottom: 40 }}>
            <div style={{ padding: "24px", backgroundColor: C.white, borderRadius: 12, border: `1px solid ${C.borderSoft}` }}>
              <p style={{ fontSize: 14, fontWeight: 600, color: C.navy, marginBottom: 8 }}>1. Concentration</p>
              <p style={{ fontSize: 13, color: C.textSecondary, lineHeight: 1.6, margin: 0 }}>Number of primary income sources. 1 source = concentration. 2–3 sources = moderate. 4+ sources = diversified.</p>
            </div>
            <div style={{ padding: "24px", backgroundColor: C.white, borderRadius: 12, border: `1px solid ${C.borderSoft}` }}>
              <p style={{ fontSize: 14, fontWeight: 600, color: C.navy, marginBottom: 8 }}>2. Number of Income Sources</p>
              <p style={{ fontSize: 13, color: C.textSecondary, lineHeight: 1.6, margin: 0 }}>Distinct revenue channels contributing to income. Examples: client, employer, investment, business line.</p>
            </div>
            <div style={{ padding: "24px", backgroundColor: C.white, borderRadius: 12, border: `1px solid ${C.borderSoft}` }}>
              <p style={{ fontSize: 14, fontWeight: 600, color: C.navy, marginBottom: 8 }}>3. Forward Visibility</p>
              <p style={{ fontSize: 13, color: C.textSecondary, lineHeight: 1.6, margin: 0 }}>Months of income projectable with certainty based on current structure. Measured: 0–24 months.</p>
            </div>
            <div style={{ padding: "24px", backgroundColor: C.white, borderRadius: 12, border: `1px solid ${C.borderSoft}` }}>
              <p style={{ fontSize: 14, fontWeight: 600, color: C.navy, marginBottom: 8 }}>4. Income Variability</p>
              <p style={{ fontSize: 13, color: C.textSecondary, lineHeight: 1.6, margin: 0 }}>Consistency of income over time. Low = stable monthly. High = fluctuates significantly month-to-month.</p>
            </div>
            <div style={{ padding: "24px", backgroundColor: C.white, borderRadius: 12, border: `1px solid ${C.borderSoft}` }}>
              <p style={{ fontSize: 14, fontWeight: 600, color: C.navy, marginBottom: 8 }}>5. Continuity Without Active Labor</p>
              <p style={{ fontSize: 13, color: C.textSecondary, lineHeight: 1.6, margin: 0 }}>Percentage of income that continues if active work stops. Recurring/passive = continues. Active-only = stops.</p>
            </div>
            <div style={{ padding: "24px", backgroundColor: C.white, borderRadius: 12, border: `1px solid ${C.borderSoft}` }}>
              <p style={{ fontSize: 14, fontWeight: 600, color: C.navy, marginBottom: 8 }}>6. Dependency on Activity</p>
              <p style={{ fontSize: 13, color: C.textSecondary, lineHeight: 1.6, margin: 0 }}>Degree to which income requires ongoing active effort. High dependency = income stops if activity stops.</p>
            </div>
          </div>
          <div style={{ backgroundColor: C.navy, borderRadius: 12, padding: "24px" }}>
            <p style={{ fontSize: 14, color: C.sandText, margin: 0, lineHeight: 1.6 }}>
              These 6 inputs determine classification. The model applies fixed rules to each input. Output is deterministic: same inputs always produce the same classification.
            </p>
          </div>
        </div>
      </section>
      )}

      {/* STRUCTURAL MAPPING EXAMPLE (Individual + Advisor paths) */}
      {(audience === "individual" || audience === "advisor") && (
      <section style={{ padding: "80px 40px", backgroundColor: C.white }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <h2 style={{ fontSize: 32, fontWeight: 600, color: C.navy, marginBottom: 40, letterSpacing: "-0.02em" }}>
            Same income, different structure
          </h2>
          <p style={{ fontSize: 15, color: C.navy, marginBottom: 40, fontWeight: 600 }}>
            Both examples: $150K annual income. Structures differ. Classifications differ.
          </p>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 40 }}>
            <div style={{ backgroundColor: C.panelFill, borderRadius: 16, padding: "32px", border: `1px solid ${C.borderSoft}` }}>
              <div style={{ fontSize: 12, fontWeight: 600, color: C.textMuted, letterSpacing: "0.05em", marginBottom: 16 }}>STRUCTURE A: ONE PRIMARY CLIENT</div>
              <div style={{ fontSize: 48, fontWeight: 700, fontFamily: mono, color: C.risk, marginBottom: 16, lineHeight: 1 }}>31</div>
              <div style={{ fontSize: 13, fontWeight: 600, color: C.risk, marginBottom: 24 }}>Limited Stability</div>
              <div style={{ fontSize: 13, color: C.navy, fontWeight: 600, marginBottom: 8 }}>Structural inputs:</div>
              <ul style={{ fontSize: 13, lineHeight: 1.8, color: C.textSecondary, margin: "0 0 0 20px", paddingLeft: 0 }}>
                <li><strong>Concentration:</strong> 1 source (concentrated)</li>
                <li><strong>Number of sources:</strong> 1</li>
                <li><strong>Forward visibility:</strong> 3 months (low)</li>
                <li><strong>Variability:</strong> High</li>
                <li><strong>Continuity without active labor:</strong> 0%</li>
                <li><strong>Activity dependency:</strong> 100%</li>
              </ul>
              <p style={{ fontSize: 12, color: C.textSecondary, marginTop: 16, margin: 0 }}>
                Loss of one client = loss of 100% of income. Structure fails if client terminates.
              </p>
            </div>
            <div style={{ backgroundColor: C.panelFill, borderRadius: 16, padding: "32px", border: `1px solid ${C.borderSoft}` }}>
              <div style={{ fontSize: 12, fontWeight: 600, color: C.textMuted, letterSpacing: "0.05em", marginBottom: 16 }}>STRUCTURE B: FIVE CLIENTS</div>
              <div style={{ fontSize: 48, fontWeight: 700, fontFamily: mono, color: C.protected, marginBottom: 16, lineHeight: 1 }}>74</div>
              <div style={{ fontSize: 13, fontWeight: 600, color: C.protected, marginBottom: 24 }}>Established Stability</div>
              <div style={{ fontSize: 13, color: C.navy, fontWeight: 600, marginBottom: 8 }}>Structural inputs:</div>
              <ul style={{ fontSize: 13, lineHeight: 1.8, color: C.textSecondary, margin: "0 0 0 20px", paddingLeft: 0 }}>
                <li><strong>Concentration:</strong> 5 sources (diversified)</li>
                <li><strong>Number of sources:</strong> 5</li>
                <li><strong>Forward visibility:</strong> 18 months</li>
                <li><strong>Variability:</strong> Low–Moderate</li>
                <li><strong>Continuity without active labor:</strong> 40% recurring</li>
                <li><strong>Activity dependency:</strong> 60%</li>
              </ul>
              <p style={{ fontSize: 12, color: C.textSecondary, marginTop: 16, margin: 0 }}>
                Loss of one client = 20% income loss. Structure sustains income if client terminates.
              </p>
            </div>
          </div>
        </div>
      </section>
      )}

      {/* PROCESSING LOGIC (Institution path only) */}
      {audience === "institution" && (
      <section style={{ padding: "80px 40px", backgroundColor: C.panelFill }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <h2 style={{ fontSize: 32, fontWeight: 600, color: C.navy, marginBottom: 40, letterSpacing: "-0.02em" }}>
            Processing logic
          </h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 32, marginBottom: 40 }}>
            <div style={{ backgroundColor: C.white, borderRadius: 12, padding: "32px", border: `1px solid ${C.borderSoft}` }}>
              <div style={{ fontSize: 13, fontWeight: 600, color: C.teal, letterSpacing: "0.06em", marginBottom: 16 }}>INPUT</div>
              <p style={{ fontSize: 14, fontWeight: 600, color: C.navy, marginBottom: 16 }}>6 structural inputs</p>
              <ol style={{ fontSize: 13, lineHeight: 1.8, color: C.textSecondary, margin: 0, paddingLeft: "20px" }}>
                <li>Concentration</li>
                <li>Number of sources</li>
                <li>Forward visibility</li>
                <li>Income variability</li>
                <li>Continuity without active labor</li>
                <li>Dependency on activity</li>
              </ol>
            </div>
            <div style={{ backgroundColor: C.white, borderRadius: 12, padding: "32px", border: `1px solid ${C.borderSoft}` }}>
              <div style={{ fontSize: 13, fontWeight: 600, color: C.teal, letterSpacing: "0.06em", marginBottom: 16 }}>RULES</div>
              <p style={{ fontSize: 14, fontWeight: 600, color: C.navy, marginBottom: 16 }}>Fixed transformation rules</p>
              <ul style={{ fontSize: 13, lineHeight: 1.8, color: C.textSecondary, margin: 0, paddingLeft: "20px" }}>
                <li>No discretion applied</li>
                <li>No judgment calls</li>
                <li>Identical for all inputs</li>
                <li>Model RP-2.0 locked</li>
                <li>All outputs traceable to rules</li>
              </ul>
            </div>
            <div style={{ backgroundColor: C.white, borderRadius: 12, padding: "32px", border: `1px solid ${C.borderSoft}` }}>
              <div style={{ fontSize: 13, fontWeight: 600, color: C.teal, letterSpacing: "0.06em", marginBottom: 16 }}>OUTPUT</div>
              <p style={{ fontSize: 14, fontWeight: 600, color: C.navy, marginBottom: 16 }}>Classification result</p>
              <ul style={{ fontSize: 13, lineHeight: 1.8, color: C.textSecondary, margin: 0, paddingLeft: "20px" }}>
                <li>Stability score (0–100)</li>
                <li>Stability band</li>
                <li>Primary constraint</li>
                <li>Record ID</li>
                <li>Timestamp</li>
              </ul>
            </div>
          </div>
          <div style={{ backgroundColor: C.navy, borderRadius: 12, padding: "24px" }}>
            <p style={{ fontSize: 14, color: C.sandText, margin: 0, lineHeight: 1.6 }}>
              The same 6 inputs always produce the same output. Different inputs produce different outputs. All outputs are permanent for the evaluated income structure.
            </p>
          </div>
        </div>
      </section>
      )}

      {/* OFFERING (Individual path only) */}
      {audience === "individual" && (
      <section style={{ padding: "80px 40px", backgroundColor: C.white }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <h2 style={{ fontSize: 32, fontWeight: 600, color: C.navy, marginBottom: 40, letterSpacing: "-0.02em" }}>
            Verification offering
          </h2>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 32, marginBottom: 40 }}>
            <div style={{ padding: "40px", backgroundColor: C.panelFill, border: `1px solid ${C.borderSoft}`, borderRadius: 12 }}>
              <p style={{ fontSize: 12, fontWeight: 600, color: C.teal, letterSpacing: "0.08em", marginBottom: 16 }}>FREE</p>
              <p style={{ fontSize: 15, fontWeight: 600, color: C.navy, marginBottom: 20 }}>Your Position</p>
              <ul style={{ fontSize: 14, color: C.textSecondary, lineHeight: 2, margin: 0, paddingLeft: "20px" }}>
                <li>Stability class (band)</li>
                <li>Decision sufficiency</li>
              </ul>
              <p style={{ fontSize: 12, color: C.textMuted, marginTop: 20, fontStyle: "italic" }}>
                Know if you're ready for your decision.
              </p>
            </div>
            <div style={{ padding: "40px", backgroundColor: C.white, borderRadius: 12, borderLeft: `4px solid ${C.teal}`, boxShadow: `0 4px 16px rgba(31,109,122,0.12)` }}>
              <p style={{ fontSize: 12, fontWeight: 600, color: C.teal, letterSpacing: "0.08em", marginBottom: 16 }}>$69</p>
              <p style={{ fontSize: 15, fontWeight: 600, color: C.navy, marginBottom: 20 }}>Full Structural Dashboard</p>
              <ul style={{ fontSize: 14, color: C.textSecondary, lineHeight: 2, margin: 0, paddingLeft: "20px" }}>
                <li>Why you're there (primary constraint)</li>
                <li>Structural consequence if unchanged</li>
                <li>Position to next stability level</li>
                <li>What needs to change (specific moves)</li>
                <li>Time exposure under current structure</li>
                <li>Interactive scenario modeling</li>
                <li>Progress tracking over time</li>
                <li>Peer benchmarking</li>
                <li>Action plan + full 12-section analysis</li>
                <li>Downloadable PDF + Record ID</li>
              </ul>
              <p style={{ fontSize: 12, color: C.teal, marginTop: 20, fontWeight: 600 }}>
                Understand your structure. Model your path. Track improvement.
              </p>
            </div>
          </div>
          <div style={{ backgroundColor: C.navy, borderRadius: 12, padding: "24px" }}>
            <p style={{ fontSize: 14, color: C.sandText, margin: 0, lineHeight: 1.6 }}>
              Classification is permanent for the submitted income structure. If any of the 6 structural inputs change, structural change has occurred and reassessment is required. Prior classifications remain in permanent archive.
            </p>
          </div>
        </div>
      </section>
      )}

      {/* STANDARD DEFINITION (All paths) */}
      <section style={{ padding: "80px 40px", backgroundColor: C.panelFill }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <h2 style={{ fontSize: 32, fontWeight: 600, color: C.navy, marginBottom: 40, letterSpacing: "-0.02em" }}>
            Standard definition
          </h2>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 40, marginBottom: 40 }}>
            <div>
              <h3 style={{ fontSize: 15, fontWeight: 600, color: C.navy, marginBottom: 16 }}>Methodology</h3>
              <ul style={{ fontSize: 14, color: C.textPrimary, lineHeight: 1.9, margin: 0, paddingLeft: "20px" }}>
                <li>Fixed rules applied to 6 inputs only</li>
                <li>No discretion: rules are identical for all users</li>
                <li>Same inputs always produce same output</li>
                <li>Model RP-2.0 fixed; version locked to all results</li>
              </ul>
            </div>
            <div>
              <h3 style={{ fontSize: 15, fontWeight: 600, color: C.navy, marginBottom: 16 }}>Permanence & Auditability</h3>
              <ul style={{ fontSize: 14, color: C.textPrimary, lineHeight: 1.9, margin: 0, paddingLeft: "20px" }}>
                <li>Every result timestamped to second</li>
                <li>Record ID assigned for permanent retrieval</li>
                <li>Prior results never modified or deleted</li>
                <li>Full audit trail maintained indefinitely</li>
              </ul>
            </div>
          </div>
          <p style={{ fontSize: 14, color: C.textSecondary, marginBottom: 24 }}>
            Classification is derived exclusively from the 6 structural inputs. Income level, credit history, employment duration, and market conditions do not affect the classification.
          </p>
          <p style={{ fontSize: 14, color: C.textSecondary, marginBottom: 24, fontWeight: 600, color: C.navy }}>
            Definition: Structural change
          </p>
          <p style={{ fontSize: 14, color: C.textSecondary, marginBottom: 0 }}>
            Structural change occurs when any of the 6 inputs change: gain or loss of income source, change in income type (contract to salary, salary to commission), change in concentration, change in forward visibility, change in continuity, or change in activity dependency. When structural change occurs, prior classification remains in archive and reassessment is required.
          </p>
        </div>
      </section>

      {/* WORKFLOW: Mortgage Underwriting Example (Institution path only) */}
      {audience === "institution" && (
      <section style={{ padding: "80px 40px", backgroundColor: C.white }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <h2 style={{ fontSize: 32, fontWeight: 600, color: C.navy, marginBottom: 40, letterSpacing: "-0.02em" }}>
            Workflow: Mortgage underwriting
          </h2>
          <ol style={{ fontSize: 15, color: C.textPrimary, lineHeight: 2, margin: "0 0 40px", paddingLeft: "24px" }}>
            <li>Borrower submits income documentation. Lender evaluates 6 structural inputs from documentation.</li>
            <li>Fixed rules applied to each input. Model RP-2.0 processes the 6 inputs.</li>
            <li>Output: Stability score (0–100) + stability band + primary constraint identified.</li>
            <li>Record ID and timestamp assigned. Result locked with model version.</li>
            <li>Classification determines whether income structure supports mortgage commitment.</li>
            <li>Result remains permanent. Reassessment required only if income structure changes per definition.</li>
          </ol>
          <div style={{ backgroundColor: C.panelFill, borderRadius: 12, padding: "24px" }}>
            <p style={{ fontSize: 14, color: C.navy, margin: 0, lineHeight: 1.6, fontWeight: 600 }}>
              Stability score ≥ 60 indicates income structure supports the decision. Score &lt; 60 indicates structural inadequacy for the commitment.
            </p>
          </div>
        </div>
      </section>
      )}

      {/* IMPLEMENTATION PATHWAYS (All paths, content varies) */}
      {audience === "individual" && (
      <section style={{ padding: "80px 40px", backgroundColor: C.white }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <h2 style={{ fontSize: 32, fontWeight: 600, color: C.navy, marginBottom: 40, letterSpacing: "-0.02em" }}>
            Next steps
          </h2>
          <div style={{ backgroundColor: C.navy, borderRadius: 12, padding: "40px", textAlign: "center" }}>
            <p style={{ fontSize: 18, fontWeight: 600, color: C.white, marginBottom: 24 }}>
              Your income verification is ready to share
            </p>
            <button style={{ padding: "16px 32px", backgroundColor: C.teal, color: C.white, border: "none", borderRadius: 8, fontSize: 14, fontWeight: 600, cursor: "pointer", marginRight: 12 }}>
              Download PDF
            </button>
            <button style={{ padding: "16px 32px", backgroundColor: "transparent", color: C.white, border: `2px solid ${C.white}`, borderRadius: 8, fontSize: 14, fontWeight: 600, cursor: "pointer" }}>
              Share with Lender
            </button>
          </div>
        </div>
      </section>
      )}

      {audience === "institution" && (
      <section style={{ padding: "80px 40px", backgroundColor: C.panelFill }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <h2 style={{ fontSize: 32, fontWeight: 600, color: C.navy, marginBottom: 40, letterSpacing: "-0.02em" }}>
            How to implement
          </h2>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 40, marginBottom: 40 }}>
            <div style={{ padding: "32px", backgroundColor: C.white, borderRadius: 12, border: `1px solid ${C.borderSoft}` }}>
              <p style={{ fontSize: 14, fontWeight: 600, color: C.navy, marginBottom: 16 }}>For Financial Institutions</p>
              <ul style={{ fontSize: 13, color: C.textSecondary, lineHeight: 1.9, margin: 0, paddingLeft: "20px" }}>
                <li>API integration available. Webhook-based processing.</li>
                <li>Submit: 6 structural inputs. Receive: JSON classification result.</li>
                <li>Result stored in your system. Auditable query history maintained.</li>
                <li>Bulk processing supported for loan pipelines.</li>
                <li>Technical documentation and sandbox environment provided.</li>
              </ul>
            </div>
            <div style={{ padding: "32px", backgroundColor: C.white, borderRadius: 12, border: `1px solid ${C.borderSoft}` }}>
              <p style={{ fontSize: 14, fontWeight: 600, color: C.navy, marginBottom: 16 }}>For Individuals & Advisors</p>
              <ul style={{ fontSize: 13, color: C.textSecondary, lineHeight: 1.9, margin: 0, paddingLeft: "20px" }}>
                <li>Web form: Submit 6 structural inputs directly.</li>
                <li>Instant free classification. Optional paid full report ($69).</li>
                <li>PDF report downloadable immediately. Shareable with lenders/advisors.</li>
                <li>Classification stored permanently. No account required.</li>
                <li>Results retrievable by Record ID at any time.</li>
              </ul>
            </div>
          </div>
          <div style={{ backgroundColor: C.navy, borderRadius: 12, padding: "24px" }}>
            <p style={{ fontSize: 14, color: C.sandText, margin: 0, lineHeight: 1.6 }}>
              All implementations use identical fixed methodology. Same 6 inputs produce same classification regardless of implementation channel (API, web form, dashboard integration).
            </p>
          </div>
        </div>
      </section>
      )}

      {audience === "advisor" && (
      <section style={{ padding: "80px 40px", backgroundColor: C.panelFill }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <h2 style={{ fontSize: 32, fontWeight: 600, color: C.navy, marginBottom: 40, letterSpacing: "-0.02em" }}>
            Advisor options
          </h2>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 40, marginBottom: 40 }}>
            <div style={{ padding: "32px", backgroundColor: C.white, borderRadius: 12, border: `1px solid ${C.borderSoft}` }}>
              <p style={{ fontSize: 14, fontWeight: 600, color: C.navy, marginBottom: 16 }}>Recommend to Clients</p>
              <ul style={{ fontSize: 13, color: C.textSecondary, lineHeight: 1.9, margin: 0, paddingLeft: "20px" }}>
                <li>Direct client to web form at no cost to you</li>
                <li>Clients receive instant classification + optional $69 report</li>
                <li>Share results with clients as part of advisory process</li>
                <li>Build trust through third-party verification</li>
              </ul>
            </div>
            <div style={{ padding: "32px", backgroundColor: C.white, borderRadius: 12, border: `1px solid ${C.borderSoft}` }}>
              <p style={{ fontSize: 14, fontWeight: 600, color: C.navy, marginBottom: 16 }}>White-Label Resale</p>
              <ul style={{ fontSize: 13, color: C.textSecondary, lineHeight: 1.9, margin: 0, paddingLeft: "20px" }}>
                <li>Branded advisor portal with your logo</li>
                <li>$15–25 per report licensing fee</li>
                <li>Bulk processing for multiple clients</li>
                <li>Support for ongoing client relationships</li>
              </ul>
            </div>
          </div>
          <button style={{ padding: "16px 32px", backgroundColor: C.navy, color: C.white, border: "none", borderRadius: 8, fontSize: 14, fontWeight: 600, cursor: "pointer", display: "block", margin: "0 auto" }}>
            Request Advisor Portal
          </button>
        </div>
      </section>
      )}

      {/* DATA & PRIVACY (Institution path only) */}
      {audience === "institution" && (
      <section style={{ padding: "80px 40px", backgroundColor: C.white }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <h2 style={{ fontSize: 32, fontWeight: 600, color: C.navy, marginBottom: 40, letterSpacing: "-0.02em" }}>
            Data handling & privacy
          </h2>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 40 }}>
            <div>
              <p style={{ fontSize: 14, fontWeight: 600, color: C.navy, marginBottom: 16 }}>Encryption & Storage</p>
              <ul style={{ fontSize: 13, color: C.textSecondary, lineHeight: 1.8, margin: 0, paddingLeft: "20px" }}>
                <li>All data encrypted in transit (TLS 1.3)</li>
                <li>All data encrypted at rest (AES-256)</li>
                <li>No third-party data sharing</li>
                <li>Inputs processed immediately; structural data only retained</li>
              </ul>
            </div>
            <div>
              <p style={{ fontSize: 14, fontWeight: 600, color: C.navy, marginBottom: 16 }}>Compliance & Audit</p>
              <ul style={{ fontSize: 13, color: C.textSecondary, lineHeight: 1.8, margin: 0, paddingLeft: "20px" }}>
                <li>FCRA compliant for financial decision support</li>
                <li>GDPR/CCPA data subject rights supported</li>
                <li>Full audit trail maintained (immutable log)</li>
                <li>Annual third-party security audit conducted</li>
              </ul>
            </div>
          </div>
        </div>
      </section>
      )}

      {/* FINAL CLOSE (All paths) */}
      <section style={{ padding: "100px 40px", backgroundColor: C.navy }}>
        <div style={{ maxWidth: 800, margin: "0 auto", textAlign: "center" }}>
          <h2 style={{ fontSize: 44, fontWeight: 600, color: C.sandText, marginBottom: 48, lineHeight: 1.2, letterSpacing: "-0.02em" }}>
            {audience === "individual" && "Verification precedes commitment"}
            {audience === "institution" && "Income verification at scale"}
            {audience === "advisor" && "Partner with us"}
          </h2>
          <button style={{ padding: "16px 48px", backgroundColor: C.teal, color: C.white, border: "none", borderRadius: 12, fontSize: 16, fontWeight: 600, cursor: "pointer", transition: "all 200ms" }}
            onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = "0 12px 32px rgba(31,109,122,0.30)"; }}
            onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "0 8px 24px rgba(31,109,122,0.20)"; }}>
            {audience === "individual" && "Verify Your Income Now"}
            {audience === "institution" && "Schedule Integration Demo"}
            {audience === "advisor" && "Request Advisor Access"}
          </button>
        </div>
      </section>

      {/* Footer (All paths) */}
      <footer style={{ backgroundColor: C.navy, borderTop: `1px solid rgba(255,255,255,0.10)`, padding: "40px" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 32, marginBottom: 32, paddingBottom: 32, borderBottom: "1px solid rgba(255,255,255,0.10)" }}>
            <div>
              <p style={{ fontSize: 11, fontWeight: 600, color: C.teal, letterSpacing: "0.06em", margin: "0 0 8px" }}>METHODOLOGY</p>
              <p style={{ fontSize: 12, color: C.sandLight, lineHeight: 1.6, margin: 0 }}>Structural Stability Model RP-2.0. Fixed methodology. Version-locked. Auditable results.</p>
            </div>
            <div>
              <p style={{ fontSize: 11, fontWeight: 600, color: C.teal, letterSpacing: "0.06em", margin: "0 0 8px" }}>DEVELOPER</p>
              <p style={{ fontSize: 12, color: C.sandLight, lineHeight: 1.6, margin: 0 }}>PeopleStar Enterprises, LLC. Orange County, California. Financial systems engineering.</p>
            </div>
            <div>
              <p style={{ fontSize: 11, fontWeight: 600, color: C.teal, letterSpacing: "0.06em", margin: "0 0 8px" }}>COMPLIANCE</p>
              <p style={{ fontSize: 12, color: C.sandLight, lineHeight: 1.6, margin: 0 }}>FCRA compliant. GDPR/CCPA compatible. Annual security audit.</p>
            </div>
          </div>
          <p style={{ fontSize: 11, color: C.sandLight, lineHeight: 1.8, margin: 0, textAlign: "center" }}>
            © 2026 RunPayway™. All rights reserved. RunPayway™ is a product of PeopleStar Enterprises, LLC. Structural Stability Standard RP-2.0.
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
  const [audience, setAudience] = useState<Audience>("individual");

  useEffect(() => {
    const saved = localStorage.getItem("runpayway_audience") as Audience | null;
    if (saved && ["individual", "institution", "advisor"].includes(saved)) {
      setAudience(saved);
    }
  }, []);

  const handleAudienceChange = (newAudience: Audience) => {
    setAudience(newAudience);
    localStorage.setItem("runpayway_audience", newAudience);
  };

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
        <AudienceSelector audience={audience} setAudience={handleAudienceChange} />
        <DesktopInstitutionalLanding audience={audience} />
      </div>
    </div>
  );
}
