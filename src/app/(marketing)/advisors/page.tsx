"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { WORKER_URL } from "@/lib/config";

/* ================================================================ */
/* UTILITIES                                                         */
/* ================================================================ */

function useInView(threshold = 0) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    if (rect.top < window.innerHeight + 50 && rect.bottom > 0) { setVisible(true); return; }
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setVisible(true); obs.disconnect(); } }, { threshold });
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);
  return { ref, visible };
}

function useMobile(bp = 768) {
  const [m, setM] = useState(false);
  useEffect(() => { const c = () => setM(window.innerWidth <= bp); c(); window.addEventListener("resize", c); return () => window.removeEventListener("resize", c); }, [bp]);
  return m;
}

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
/* DESIGN SYSTEM                                                     */
/* ================================================================ */

const C = {
  navy: "#0E1A2B",
  teal: "#1F6D7A",
  sand: "#F4F1EA",
  white: "#FFFFFF",
  textSecondary: "#5E6873",
  textMuted: "#7B848E",
  borderSoft: "#D9D6CF",
  sandText: "#F4F1EA",
  sandMuted: "rgba(244,241,234,0.55)",
  sandLight: "rgba(244,241,234,0.40)",
};

const mono = '"SF Mono", "Fira Code", "IBM Plex Mono", "Courier New", monospace';
const innerW = 1120;
const narrowW = 720;
const explanatoryW = 640;
const sectionPx = (m: boolean) => m ? 24 : 48;
const cardShadow = "0 10px 30px rgba(14,26,43,0.06)";
const ctaShadow = "0 8px 24px rgba(14,26,43,0.12)";


/* ================================================================ */
/* SECTION 1 — HERO                                                  */
/* ================================================================ */

function HeroSection() {
  const { ref, visible } = useInView();
  const m = useMobile();
  const fadeIn = useFadeIn();

  return (
    <header ref={ref} style={{ backgroundColor: C.sand, paddingTop: m ? 104 : 152, paddingBottom: m ? 56 : 88, paddingLeft: sectionPx(m), paddingRight: sectionPx(m) }}>
      <div style={{ maxWidth: 860, margin: "0 auto", textAlign: "center" }}>
        <div style={{ fontSize: m ? 13 : 14, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase" as const, color: C.teal, marginBottom: 16, ...fadeIn(visible) }}>
          FOR ADVISORS
        </div>
        <h1 style={{ fontSize: m ? 30 : 64, fontWeight: 700, lineHeight: 1.1, letterSpacing: "-0.035em", color: C.navy, marginBottom: 24, ...fadeIn(visible, 50) }}>
          Evaluate and Mitigate Client{m ? " " : <br />}Income Risk Before It Becomes{m ? " " : <br />}a Problem
        </h1>
        <p style={{ fontSize: m ? 18 : 24, fontWeight: 400, lineHeight: 1.5, color: C.textSecondary, maxWidth: narrowW, margin: "0 auto 24px", ...fadeIn(visible, 100) }}>
          Your clients tell you what they earn. Not how it&rsquo;s built. RunPayway&#8482; gives you a standardized way to assess income structure&mdash;and act on it before problems surface.
        </p>
        <div style={{ display: "flex", justifyContent: "center", gap: m ? 12 : 24, flexWrap: "wrap" as const, ...fadeIn(visible, 150) }}>
          {["Standardized methodology", "Fixed rules", "Private by default"].map((badge, i) => (
            <span key={i} style={{ fontSize: 14, fontWeight: 600, color: C.teal, padding: "5px 12px", borderRadius: 100, backgroundColor: "rgba(31,109,122,0.06)", border: "1px solid rgba(31,109,122,0.15)" }}>{badge}</span>
          ))}
        </div>
      </div>
    </header>
  );
}


/* ================================================================ */
/* SECTION 2 — THE PROBLEM                                           */
/* ================================================================ */

function TheProblem() {
  const { ref, visible } = useInView();
  const m = useMobile();
  const fadeIn = useFadeIn();

  const cards = [
    { says: "Client says: \u2018$200K/year\u2019", hidden: "You don\u2019t know: 80% depends on one client" },
    { says: "Client says: \u2018Business is stable\u2019", hidden: "You don\u2019t know: Nothing is recurring or contracted" },
    { says: "Client says: \u2018I have multiple sources\u2019", hidden: "You don\u2019t know: All sources require active work" },
  ];

  return (
    <section ref={ref} style={{ backgroundColor: C.white, paddingTop: m ? 72 : 120, paddingBottom: m ? 72 : 120, paddingLeft: sectionPx(m), paddingRight: sectionPx(m) }}>
      <div style={{ maxWidth: innerW, margin: "0 auto" }}>
        <div style={{ maxWidth: 680, margin: "0 auto 56px", textAlign: "center" }}>
          <h2 style={{ fontSize: m ? 28 : 40, fontWeight: 600, lineHeight: 1.08, letterSpacing: "-0.028em", color: C.navy, marginBottom: 16, ...fadeIn(visible) }}>
            The Gap in Client Assessment
          </h2>
          <p style={{ fontSize: 18, fontWeight: 400, lineHeight: 1.6, color: C.textSecondary, ...fadeIn(visible, 50) }}>
            You evaluate assets, liabilities, and cash flow. But income structure&nbsp;&mdash; how income is built, how it holds under pressure, and what&rsquo;s most exposed&nbsp;&mdash; is invisible. Until now.
          </p>
        </div>
        <div style={{ display: m ? "block" : "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 24, ...fadeIn(visible, 100) }}>
          {cards.map((card, i) => (
            <div key={i} style={{ padding: 28, borderRadius: 16, backgroundColor: C.white, boxShadow: cardShadow, border: `1px solid ${C.borderSoft}`, borderLeft: "4px solid #4B3FAE", marginBottom: m ? 16 : 0 }}>
              <p style={{ fontSize: 16, fontWeight: 600, color: C.navy, marginBottom: 12, lineHeight: 1.4 }}>{card.says}</p>
              <p style={{ fontSize: 15, fontWeight: 400, color: C.textSecondary, lineHeight: 1.5, margin: 0 }}>{card.hidden}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}


/* ================================================================ */
/* SECTION 3 — WHAT RUNPAYWAY SHOWS YOU                              */
/* ================================================================ */

function WhatItReveals() {
  const { ref, visible } = useInView();
  const m = useMobile();
  const fadeIn = useFadeIn();

  const items = [
    "Income Stability Score (0\u2013100) \u2014 where they stand",
    "Stability classification \u2014 Limited, Developing, Established, or High Stability",
    "Biggest income risk \u2014 what limits their stability",
    "Stress test outcomes \u2014 what happens if a source disappears",
    "Distance to next level \u2014 how far from the next stability band",
  ];

  return (
    <section ref={ref} style={{ backgroundColor: C.sand, paddingTop: m ? 72 : 120, paddingBottom: m ? 72 : 120, paddingLeft: sectionPx(m), paddingRight: sectionPx(m) }}>
      <div style={{ maxWidth: 680, margin: "0 auto" }}>
        <h2 style={{ fontSize: m ? 28 : 40, fontWeight: 600, lineHeight: 1.08, letterSpacing: "-0.028em", color: C.navy, marginBottom: 12, ...fadeIn(visible) }}>
          What the System Reveals About Your Client
        </h2>
        <p style={{ fontSize: 18, fontWeight: 400, lineHeight: 1.6, color: C.textSecondary, marginBottom: 32, ...fadeIn(visible, 50) }}>
          Every assessment produces a fixed, consistent result. No interpretation. No variation.
        </p>
        <div style={{ display: "flex", flexDirection: "column" as const, gap: 14, ...fadeIn(visible, 100) }}>
          {items.map((item, i) => (
            <div key={i} style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#1F6D7A" strokeWidth="2" strokeLinecap="round" style={{ flexShrink: 0, marginTop: 5 }}><path d="M20 6L9 17l-5-5"/></svg>
              <span style={{ fontSize: 17, color: C.textSecondary, lineHeight: 1.6 }}>{item}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}


/* ================================================================ */
/* SECTION 4 — HOW IT WORKS FOR ADVISORS                             */
/* ================================================================ */

function HowItWorks() {
  const { ref, visible } = useInView();
  const m = useMobile();
  const fadeIn = useFadeIn();

  const steps = [
    { num: "01", title: "Assess", desc: "Run the assessment on behalf of your client. Under 2 minutes. No financial documents required." },
    { num: "02", title: "Review", desc: "Receive the score, structural breakdown, stress test, and main vulnerability \u2014 all generated from fixed rules." },
    { num: "03", title: "Act", desc: "Use the results to inform client conversations, identify risk, and build a plan before problems surface." },
  ];

  return (
    <section ref={ref} style={{ backgroundColor: C.white, paddingTop: m ? 72 : 120, paddingBottom: m ? 72 : 120, paddingLeft: sectionPx(m), paddingRight: sectionPx(m) }}>
      <div style={{ maxWidth: innerW, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: 48, ...fadeIn(visible) }}>
          <h2 style={{ fontSize: m ? 28 : 40, fontWeight: 600, lineHeight: 1.08, letterSpacing: "-0.028em", color: C.navy }}>
            Three Steps. Standardized Result.
          </h2>
        </div>
        <div style={{ display: m ? "block" : "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 24, ...fadeIn(visible, 100) }}>
          {steps.map((step, i) => (
            <div key={i} style={{ padding: 28, borderRadius: 16, backgroundColor: C.white, boxShadow: cardShadow, borderLeft: "4px solid #4B3FAE", marginBottom: m ? 16 : 0 }}>
              <div style={{ fontSize: 32, fontWeight: 700, fontFamily: mono, color: C.teal, marginBottom: 12 }}>{step.num}</div>
              <div style={{ fontSize: 20, fontWeight: 600, color: C.navy, marginBottom: 8 }}>{step.title}</div>
              <p style={{ fontSize: 15, fontWeight: 400, color: C.textSecondary, lineHeight: 1.55, margin: 0 }}>{step.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}


/* ================================================================ */
/* SECTION 5 — USE CASES                                             */
/* ================================================================ */

function UseCases() {
  const { ref, visible } = useInView();
  const m = useMobile();
  const fadeIn = useFadeIn();

  const cases = [
    { title: "Pre-Onboarding Risk Assessment", desc: "Quickly assess income structure before onboarding clients. Know what you\u2019re inheriting." },
    { title: "Annual Income Review", desc: "Add income stability to your annual review, alongside assets and liabilities. See the full picture." },
    { title: "Client Retention", desc: "Identify clients at risk before they experience income-related problems. Act before the crisis." },
    { title: "Practice Differentiation", desc: "Stand out from competitors by offering a unique income risk assessment no one else has." },
  ];

  return (
    <section ref={ref} style={{ backgroundColor: C.sand, paddingTop: m ? 72 : 120, paddingBottom: m ? 72 : 120, paddingLeft: sectionPx(m), paddingRight: sectionPx(m) }}>
      <div style={{ maxWidth: innerW, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: 48, ...fadeIn(visible) }}>
          <h2 style={{ fontSize: m ? 28 : 40, fontWeight: 600, lineHeight: 1.08, letterSpacing: "-0.028em", color: C.navy }}>
            Where Advisors Apply RunPayway&#8482;
          </h2>
        </div>
        <div style={{ display: m ? "block" : "grid", gridTemplateColumns: "1fr 1fr", gap: 24, ...fadeIn(visible, 100) }}>
          {cases.map((c, i) => (
            <div key={i} style={{ padding: 28, borderRadius: 16, backgroundColor: C.white, boxShadow: cardShadow, borderLeft: "4px solid #4B3FAE", marginBottom: m ? 16 : 0 }}>
              <div style={{ fontSize: 18, fontWeight: 600, color: C.navy, marginBottom: 8 }}>{c.title}</div>
              <p style={{ fontSize: 15, fontWeight: 400, color: C.textSecondary, lineHeight: 1.55, margin: 0 }}>{c.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}


/* ================================================================ */
/* SECTION 6 — WHAT YOU GET                                          */
/* ================================================================ */

function WhatYouGet() {
  const { ref, visible } = useInView();
  const m = useMobile();
  const fadeIn = useFadeIn();

  const items = [
    { title: "Full 4-Page Diagnostic Report", desc: "Actionable insights tailored to each client\u2019s unique income structure." },
    { title: "Complete Dashboard", desc: "Score breakdowns, stress testing, and real-time performance insights per client." },
    { title: "Client-Ready PDF Output", desc: "Download and share a polished report directly with your client." },
    { title: "Standardized Methodology", desc: "Run consistent assessments with fixed, transparent rules across your entire book." },
    { title: "Run Assessments on Behalf of Clients", desc: "No client login required. You run it, they receive the results." },
    { title: "White-Label Reporting", desc: "For enterprise advisors \u2014 branded reports with your firm\u2019s identity." },
  ];

  return (
    <section ref={ref} style={{ backgroundColor: C.white, paddingTop: m ? 72 : 120, paddingBottom: m ? 72 : 120, paddingLeft: sectionPx(m), paddingRight: sectionPx(m) }}>
      <div style={{ maxWidth: innerW, margin: "0 auto" }}>
        <h2 style={{ fontSize: m ? 28 : 40, fontWeight: 600, lineHeight: 1.08, letterSpacing: "-0.028em", color: C.navy, marginBottom: 32, textAlign: "center", ...fadeIn(visible) }}>
          What Advisors Get with Access
        </h2>
        <div style={{ display: "grid", gridTemplateColumns: m ? "1fr" : "1fr 1fr", gap: 20, ...fadeIn(visible, 100) }}>
          {items.map((item, i) => (
            <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 14, padding: 24, borderRadius: 16, backgroundColor: C.white, boxShadow: cardShadow, border: `1px solid ${C.borderSoft}`, borderLeft: "4px solid #4B3FAE" }}>
              <span style={{ color: C.teal, fontSize: 16, flexShrink: 0, marginTop: 2 }}>&#10003;</span>
              <div>
                <span style={{ fontSize: 16, fontWeight: 600, color: C.navy }}>{item.title}</span>
                <span style={{ fontSize: 15, color: C.textSecondary }}> &mdash; {item.desc}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}


/* ================================================================ */
/* SECTION 7 — SYSTEM INTEGRITY                                      */
/* ================================================================ */

function SystemIntegrity() {
  const { ref, visible } = useInView();
  const m = useMobile();
  const fadeIn = useFadeIn();

  const badges = [
    "Consistent output",
    "No financial accounts required",
    "Private by default",
    "Version-controlled methodology",
  ];

  return (
    <section ref={ref} style={{ backgroundColor: C.navy, paddingTop: m ? 72 : 120, paddingBottom: m ? 72 : 120, paddingLeft: sectionPx(m), paddingRight: sectionPx(m), position: "relative", overflow: "hidden" }}>
      <div style={{ maxWidth: 880, margin: "0 auto", position: "relative", zIndex: 1 }}>
        <div style={{ textAlign: "center", marginBottom: m ? 40 : 56, ...fadeIn(visible) }}>
          <h2 style={{ fontSize: m ? 28 : 40, fontWeight: 600, lineHeight: 1.08, letterSpacing: "-0.028em", color: C.sandText, marginBottom: 12 }}>
            Same System. Same Rules. Every Client.
          </h2>
          <p style={{ fontSize: 18, fontWeight: 400, lineHeight: 1.6, color: C.sandMuted, maxWidth: 640, margin: "0 auto" }}>
            Every assessment uses the same fixed model. No AI. No subjective judgment. Same inputs always produce the same result&nbsp;&mdash; regardless of who runs the assessment.
          </p>
        </div>
        <div style={{ display: m ? "grid" : "grid", gridTemplateColumns: m ? "1fr 1fr" : "1fr 1fr 1fr 1fr", gap: 16, ...fadeIn(visible, 100) }}>
          {badges.map((badge, i) => (
            <div key={i} style={{ padding: m ? 16 : 20, borderRadius: 12, backgroundColor: "rgba(255,255,255,0.04)", border: "1px solid rgba(244,241,234,0.08)", textAlign: "center" }}>
              <span style={{ fontSize: 14, fontWeight: 600, color: C.sandMuted }}>{badge}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}


/* ================================================================ */
/* SECTION 8 — REQUEST ACCESS FORM                                   */
/* ================================================================ */

function RequestAccessForm() {
  const { ref, visible } = useInView();
  const m = useMobile();
  const fadeIn = useFadeIn();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [firm, setFirm] = useState("");
  const [role, setRole] = useState("");
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [sendError, setSendError] = useState("");

  const canSubmit = name.trim() && email.trim() && message.trim() && !sending;

  const handleSubmit = async () => {
    if (!canSubmit) return;
    setSending(true); setSendError("");
    try {
      const res = await fetch(`${WORKER_URL}/contact`, {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          email: email.trim(),
          subject: "advisor-access",
          message: `Firm: ${firm.trim()}\nRole: ${role}\n\n${message.trim()}`,
        }),
      });
      if (res.ok) { setSent(true); } else { setSendError("Failed to send. Please try again."); }
    } catch { setSendError("Failed to send. Please try again."); }
    finally { setSending(false); }
  };

  const inputStyle: React.CSSProperties = {
    width: "100%", height: 56, padding: "0 18px", borderRadius: 16,
    border: "1px solid rgba(14,26,43,0.12)", background: "#FAFAFA",
    fontSize: 16, color: C.navy, outline: "none",
    transition: "border-color 200ms ease", boxSizing: "border-box",
  };

  const labelStyle: React.CSSProperties = {
    display: "block", fontSize: 12, fontWeight: 600, color: C.navy,
    marginBottom: 8,
  };

  return (
    <section ref={ref} id="advisor-form" style={{ backgroundColor: C.sand, paddingTop: m ? 72 : 120, paddingBottom: m ? 72 : 120, paddingLeft: sectionPx(m), paddingRight: sectionPx(m) }}>
      <div style={{ maxWidth: 640, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: 40, ...fadeIn(visible) }}>
          <h2 style={{ fontSize: m ? 28 : 40, fontWeight: 600, lineHeight: 1.08, letterSpacing: "-0.028em", color: C.navy, marginBottom: 12 }}>
            Request Advisor Access Now
          </h2>
          <p style={{ fontSize: 18, fontWeight: 400, lineHeight: 1.6, color: C.textSecondary }}>
            Get access to the tools that help you evaluate income risk for your clients. Our team will follow up within two business days.
          </p>
        </div>

        <div style={{ backgroundColor: C.white, borderRadius: 20, boxShadow: cardShadow, padding: m ? 24 : 40, ...fadeIn(visible, 100) }}>
          {sent ? (
            <div style={{ textAlign: "center", padding: "32px 0" }}>
              <div style={{ width: 48, height: 48, borderRadius: "50%", backgroundColor: `${C.teal}15`, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px" }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={C.teal} strokeWidth="2.5" strokeLinecap="round"><path d="M9 12l2 2 4-4" /></svg>
              </div>
              <p style={{ fontSize: 18, fontWeight: 600, color: C.navy, marginBottom: 8 }}>Request submitted.</p>
              <p style={{ fontSize: 16, fontWeight: 400, color: C.textSecondary }}>We&rsquo;ll be in touch within two business days.</p>
            </div>
          ) : (
            <>
              <div style={{ marginBottom: 20 }}>
                <label style={labelStyle}>Full Name</label>
                <input
                  type="text" value={name} onChange={e => setName(e.target.value)}
                  placeholder="Your full name"
                  style={inputStyle}
                  onFocus={e => { e.currentTarget.style.borderColor = "#4B3FAE"; }}
                  onBlur={e => { e.currentTarget.style.borderColor = "rgba(14,26,43,0.12)"; }}
                />
              </div>

              <div style={{ marginBottom: 20 }}>
                <label style={labelStyle}>Email</label>
                <input
                  type="email" value={email} onChange={e => setEmail(e.target.value)}
                  placeholder="you@firm.com"
                  style={inputStyle}
                  onFocus={e => { e.currentTarget.style.borderColor = "#4B3FAE"; }}
                  onBlur={e => { e.currentTarget.style.borderColor = "rgba(14,26,43,0.12)"; }}
                />
              </div>

              <div style={{ marginBottom: 20 }}>
                <label style={labelStyle}>Firm / Practice Name</label>
                <input
                  type="text" value={firm} onChange={e => setFirm(e.target.value)}
                  placeholder="Your firm or practice"
                  style={inputStyle}
                  onFocus={e => { e.currentTarget.style.borderColor = "#4B3FAE"; }}
                  onBlur={e => { e.currentTarget.style.borderColor = "rgba(14,26,43,0.12)"; }}
                />
              </div>

              <div style={{ marginBottom: 20 }}>
                <label style={labelStyle}>Role</label>
                <div style={{ position: "relative" }}>
                  <select
                    value={role} onChange={e => setRole(e.target.value)}
                    style={{
                      ...inputStyle,
                      appearance: "none" as const,
                      WebkitAppearance: "none" as const,
                      cursor: "pointer",
                      color: role ? C.navy : C.textMuted,
                    }}
                    onFocus={e => { e.currentTarget.style.borderColor = "#4B3FAE"; }}
                    onBlur={e => { e.currentTarget.style.borderColor = "rgba(14,26,43,0.12)"; }}
                  >
                    <option value="" disabled>Select your role</option>
                    <option value="Financial Advisor">Financial Advisor</option>
                    <option value="Wealth Manager">Wealth Manager</option>
                    <option value="Insurance Agent">Insurance Agent</option>
                    <option value="Accountant/CPA">Accountant/CPA</option>
                    <option value="Tax Professional">Tax Professional</option>
                    <option value="Other">Other</option>
                  </select>
                  <svg
                    width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={C.textMuted} strokeWidth="2" strokeLinecap="round"
                    style={{ position: "absolute", right: 18, top: "50%", transform: "translateY(-50%)", pointerEvents: "none" }}
                  >
                    <polyline points="6 9 12 15 18 9" />
                  </svg>
                </div>
              </div>

              <div style={{ marginBottom: 24 }}>
                <label style={labelStyle}>How would you use RunPayway&#8482;?</label>
                <textarea
                  value={message} onChange={e => setMessage(e.target.value)}
                  placeholder="Tell us about your use case..."
                  rows={4}
                  style={{
                    ...inputStyle,
                    height: "auto",
                    padding: "16px 18px",
                    resize: "vertical" as const,
                    lineHeight: 1.5,
                  }}
                  onFocus={e => { e.currentTarget.style.borderColor = "#4B3FAE"; }}
                  onBlur={e => { e.currentTarget.style.borderColor = "rgba(14,26,43,0.12)"; }}
                />
              </div>

              {sendError && (
                <p style={{ fontSize: 14, color: "#C0392B", marginBottom: 16, textAlign: "center" }}>{sendError}</p>
              )}

              <button
                onClick={handleSubmit}
                disabled={!canSubmit}
                style={{
                  width: "100%", height: 60, borderRadius: 16,
                  backgroundColor: canSubmit ? "#4B3FAE" : "rgba(75,63,174,0.35)",
                  color: C.white, fontSize: 16, fontWeight: 600,
                  border: "none", cursor: canSubmit ? "pointer" : "default",
                  transition: "transform 200ms, box-shadow 200ms",
                  boxShadow: ctaShadow,
                }}
                onMouseEnter={e => { if (canSubmit) { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = "0 12px 32px rgba(14,26,43,0.16)"; } }}
                onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = ctaShadow; }}
              >
                {sending ? "Submitting\u2026" : "Request Access"}
              </button>
            </>
          )}
        </div>

        <p style={{ fontSize: 13, fontWeight: 500, color: C.textMuted, textAlign: "center", marginTop: 16, ...fadeIn(visible, 150) }}>
          Secure form submission | Encrypted data transmission
        </p>
      </div>
    </section>
  );
}


/* ================================================================ */
/* FINAL CTA                                                         */
/* ================================================================ */

function FinalCta() {
  const { ref, visible } = useInView();
  const m = useMobile();
  const fadeIn = useFadeIn();

  const scrollToForm = (e: React.MouseEvent) => {
    e.preventDefault();
    const el = document.getElementById("advisor-form");
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section ref={ref} style={{ backgroundColor: C.navy, paddingTop: m ? 88 : 128, paddingBottom: m ? 88 : 128, paddingLeft: sectionPx(m), paddingRight: sectionPx(m) }}>
      <div style={{ maxWidth: explanatoryW, margin: "0 auto", textAlign: "center" }}>
        <h2 style={{ fontSize: m ? 28 : 40, fontWeight: 600, lineHeight: 1.08, letterSpacing: "-0.028em", color: C.sandText, marginBottom: 32, ...fadeIn(visible) }}>
          Your clients&rsquo; income has a structure.{m ? " " : <br />}Now you can measure it.
        </h2>
        <div style={{ display: "flex", flexDirection: "column" as const, alignItems: "center", ...fadeIn(visible, 100) }}>
          <button
            onClick={scrollToForm}
            style={{
              display: "inline-flex", alignItems: "center", justifyContent: "center",
              height: m ? 56 : 60, width: m ? "100%" : "auto",
              padding: m ? "0 28px" : "0 32px",
              borderRadius: 16, backgroundColor: C.white, color: C.navy,
              fontSize: 16, fontWeight: 600,
              boxShadow: "0 8px 24px rgba(14,26,43,0.08)",
              border: `1px solid ${C.borderSoft}`,
              cursor: "pointer",
              transition: "transform 200ms, box-shadow 200ms",
            }}
            onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = "0 12px 32px rgba(14,26,43,0.12)"; }}
            onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "0 8px 24px rgba(14,26,43,0.08)"; }}
          >
            Request Advisor Access
          </button>
          <p style={{ fontSize: 14, fontWeight: 500, color: C.sandLight, marginTop: 16 }}>
            Under 2 minutes per assessment | Private by default
          </p>
        </div>
      </div>
    </section>
  );
}


/* ================================================================ */
/* PAGE EXPORT                                                       */
/* ================================================================ */

export default function AdvisorsPage() {
  return (
    <div className="overflow-x-hidden">
      <main>
        <HeroSection />
        <TheProblem />
        <WhatItReveals />
        <HowItWorks />
        <UseCases />
        <WhatYouGet />
        <SystemIntegrity />
        <RequestAccessForm />
        <FinalCta />
      </main>
    </div>
  );
}
