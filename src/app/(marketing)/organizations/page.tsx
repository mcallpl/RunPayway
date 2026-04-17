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

const mono = "'SF Mono', 'Fira Code', 'Fira Mono', 'Roboto Mono', monospace";
const innerW = 1120;
const narrowW = 720;
const explanatoryW = 640;
const sectionPx = (m: boolean) => m ? 24 : 48;
const cardShadow = "0 10px 30px rgba(14,26,43,0.06)";
const ctaShadow = "0 8px 24px rgba(14,26,43,0.12)";
const border = "rgba(14,26,43,0.12)";
const purple = "#4B3FAE";


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
          FOR ENTERPRISES
        </div>
        <h1 style={{ fontSize: m ? 30 : 64, fontWeight: 700, lineHeight: 1.1, letterSpacing: "-0.035em", color: C.navy, marginBottom: 24, ...fadeIn(visible, 50) }}>
          Standardize and Scale Income{m ? " " : <br />}Structure Assessment with{m ? " " : <br />}One Fixed Methodology
        </h1>
        <p style={{ fontSize: m ? 18 : 24, fontWeight: 400, lineHeight: 1.5, color: C.textSecondary, maxWidth: narrowW, margin: "0 auto 24px", ...fadeIn(visible, 100) }}>
          Every department evaluates income differently. RunPayway\u2122 gives everyone the same ruler.
        </p>
        <div style={{ display: "flex", justifyContent: "center", gap: m ? 12 : 20, flexWrap: "wrap" as const, ...fadeIn(visible, 150) }}>
          {["API-ready", "Consistent", "Compliant by design"].map((badge, i) => (
            <span key={i} style={{ fontSize: m ? 13 : 14, fontWeight: 600, color: C.teal, padding: "5px 12px", borderRadius: 100, backgroundColor: "rgba(31,109,122,0.06)" }}>
              {badge}
            </span>
          ))}
        </div>
      </div>
    </header>
  );
}


/* ================================================================ */
/* SECTION 2 — THE PROBLEM                                           */
/* ================================================================ */

function ProblemSection() {
  const { ref, visible } = useInView();
  const m = useMobile();
  const fadeIn = useFadeIn();

  const cards = [
    { title: "Lending", desc: "Underwriters assess income manually. Different analysts reach different conclusions on the same applicant." },
    { title: "Workforce", desc: "HR teams have no standardized way to assess the income stability of contractors, freelancers, or gig workers." },
    { title: "Advisory", desc: "Financial advisors evaluate client risk subjectively. Two advisors looking at the same client see different things." },
  ];

  return (
    <section ref={ref} style={{ backgroundColor: C.white, paddingTop: m ? 72 : 120, paddingBottom: m ? 72 : 120, paddingLeft: sectionPx(m), paddingRight: sectionPx(m) }}>
      <div style={{ maxWidth: innerW, margin: "0 auto" }}>
        <div style={{ textAlign: "center", maxWidth: narrowW, margin: "0 auto", marginBottom: m ? 40 : 56 }}>
          <h2 style={{ fontSize: m ? 28 : 40, fontWeight: 600, lineHeight: 1.08, letterSpacing: "-0.028em", color: C.navy, marginBottom: 16, ...fadeIn(visible) }}>
            The Problem: Everyone Evaluates{m ? " " : <br />}Income Differently
          </h2>
          <p style={{ fontSize: 18, fontWeight: 400, lineHeight: 1.6, color: C.textSecondary, ...fadeIn(visible, 50) }}>
            Different teams, different people, different conclusions — on the same applicant. RunPayway™ gives everyone the same ruler.
          </p>
        </div>

        <div style={{ display: m ? "block" : "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 24, ...fadeIn(visible, 100) }}>
          {cards.map((card, i) => (
            <div key={i} style={{ padding: m ? 24 : 28, borderRadius: 16, backgroundColor: C.white, border: `1px solid ${C.borderSoft}`, borderLeft: `4px solid ${C.navy}`, boxShadow: cardShadow, marginBottom: m ? 16 : 0 }}>
              <h3 style={{ fontSize: 20, fontWeight: 700, color: C.navy, marginBottom: 12 }}>{card.title}</h3>
              <p style={{ fontSize: 16, fontWeight: 400, lineHeight: 1.6, color: C.textSecondary, margin: 0 }}>{card.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}


/* ================================================================ */
/* SECTION 3 — THE SYSTEM                                            */
/* ================================================================ */

function SystemSection() {
  const { ref, visible } = useInView();
  const m = useMobile();
  const fadeIn = useFadeIn();

  const attrs = [
    { title: "Consistent", desc: "Identical inputs always produce identical results. No variability, no exceptions." },
    { title: "Version-Controlled", desc: "Every model version is locked and immutable. Scores are always traceable to their methodology." },
    { title: "Auditable", desc: "Every assessment is stamped with model version, timestamp, and authentication code. Fully traceable." },
    { title: "Private by Default", desc: "No bank accounts. No credit pull. No financial data required. Assessment inputs only." },
  ];

  return (
    <section ref={ref} style={{ backgroundColor: C.sand, paddingTop: m ? 72 : 120, paddingBottom: m ? 72 : 120, paddingLeft: sectionPx(m), paddingRight: sectionPx(m) }}>
      <div style={{ maxWidth: innerW, margin: "0 auto" }}>
        <div style={{ textAlign: "center", maxWidth: narrowW, margin: "0 auto", marginBottom: m ? 40 : 56 }}>
          <h2 style={{ fontSize: m ? 28 : 40, fontWeight: 600, lineHeight: 1.08, letterSpacing: "-0.028em", color: C.navy, marginBottom: 16, ...fadeIn(visible) }}>
            One System. One Answer.{m ? " " : <br />}Every Time.
          </h2>
          <p style={{ fontSize: 18, fontWeight: 400, lineHeight: 1.6, color: C.textSecondary, ...fadeIn(visible, 50) }}>
            The Income Stability Score™ uses the same fixed rules for every assessment — no machine learning, no judgment. The same inputs always produce the same score.
          </p>
        </div>

        <div style={{ display: m ? "block" : "grid", gridTemplateColumns: "1fr 1fr", gap: 24, ...fadeIn(visible, 100) }}>
          {attrs.map((attr, i) => (
            <div key={i} style={{ padding: m ? 24 : 28, borderRadius: 16, backgroundColor: C.white, border: `1px solid ${C.borderSoft}`, borderLeft: `4px solid ${C.navy}`, boxShadow: cardShadow, marginBottom: m ? 16 : 0 }}>
              <h3 style={{ fontSize: 20, fontWeight: 700, color: C.navy, marginBottom: 12 }}>{attr.title}</h3>
              <p style={{ fontSize: 16, fontWeight: 400, lineHeight: 1.6, color: C.textSecondary, margin: 0 }}>{attr.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}


/* ================================================================ */
/* SECTION 4 — INTEGRATION                                           */
/* ================================================================ */

function IntegrationSection() {
  const { ref, visible } = useInView();
  const m = useMobile();
  const fadeIn = useFadeIn();

  const items = [
    { num: "01", title: "API Access", desc: "Programmatically access scoring and income breakdowns. Send inputs via API, receive scores, bands, and risk factors as JSON." },
    { num: "02", title: "Batch Assessment", desc: "Assess hundreds of income profiles at once using the fixed model. Upload inputs, receive standardized, comparable results." },
    { num: "03", title: "White-Label Reporting", desc: "Generate branded reports with your organization\u2019s identity. Same data, same methodology, your brand. Powered by RunPayway\u2122." },
  ];

  return (
    <section ref={ref} style={{ backgroundColor: C.white, paddingTop: m ? 72 : 120, paddingBottom: m ? 72 : 120, paddingLeft: sectionPx(m), paddingRight: sectionPx(m) }}>
      <div style={{ maxWidth: innerW, margin: "0 auto" }}>
        <div style={{ textAlign: "center", maxWidth: narrowW, margin: "0 auto", marginBottom: m ? 40 : 56 }}>
          <h2 style={{ fontSize: m ? 28 : 40, fontWeight: 600, lineHeight: 1.08, letterSpacing: "-0.028em", color: C.navy, marginBottom: 16, ...fadeIn(visible) }}>
            Built for Integration
          </h2>
          <p style={{ fontSize: 18, fontWeight: 400, lineHeight: 1.6, color: C.textSecondary, ...fadeIn(visible, 50) }}>
            RunPayway™ is designed to fit into your existing infrastructure.
          </p>
        </div>

        <div style={{ maxWidth: 720, margin: "0 auto", display: "flex", flexDirection: "column" as const, gap: 24, ...fadeIn(visible, 100) }}>
          {items.map((item, i) => {
            const stepColors = [C.teal, purple, C.navy];
            return (
            <div key={i} style={{ display: "flex", gap: m ? 16 : 24, alignItems: "flex-start", padding: m ? 24 : 28, borderRadius: 16, backgroundColor: C.white, border: `1px solid ${C.borderSoft}`, borderLeft: `4px solid ${stepColors[i]}`, boxShadow: cardShadow }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: "#FFFFFF", fontFamily: mono, flexShrink: 0, width: 32, height: 32, borderRadius: "50%", backgroundColor: stepColors[i], display: "flex", alignItems: "center", justifyContent: "center" }}>{item.num}</div>
              <div>
                <h3 style={{ fontSize: 20, fontWeight: 700, color: C.navy, marginBottom: 8 }}>{item.title}</h3>
                <p style={{ fontSize: 16, fontWeight: 400, lineHeight: 1.6, color: C.textSecondary, margin: 0 }}>{item.desc}</p>
              </div>
            </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}


/* ================================================================ */
/* SECTION 5 — COMPLIANCE                                            */
/* ================================================================ */

function ComplianceSection() {
  const { ref, visible } = useInView();
  const m = useMobile();
  const fadeIn = useFadeIn();

  const categories = [
    {
      label: "Security",
      color: C.navy,
      items: [
        { title: "SOC 2 Type II", desc: "Designed for compliance" },
        { title: "ISO 27001", desc: "Informed by ISMS framework" },
      ],
    },
    {
      label: "Privacy",
      color: C.teal,
      items: [
        { title: "GDPR", desc: "Data Processing Agreement available" },
        { title: "CCPA/CPRA", desc: "California privacy rights supported" },
        { title: "Data Processing Agreement", desc: "Published and available" },
      ],
    },
    {
      label: "Auditability",
      color: purple,
      items: [
        { title: "Model Version Policy", desc: "Immutable, version-controlled methodology" },
      ],
    },
  ];

  return (
    <section ref={ref} style={{ backgroundColor: C.sand, paddingTop: m ? 72 : 120, paddingBottom: m ? 72 : 120, paddingLeft: sectionPx(m), paddingRight: sectionPx(m) }}>
      <div style={{ maxWidth: innerW, margin: "0 auto" }}>
        <div style={{ textAlign: "center", maxWidth: narrowW, margin: "0 auto", marginBottom: m ? 40 : 56 }}>
          <h2 style={{ fontSize: m ? 28 : 40, fontWeight: 600, lineHeight: 1.08, letterSpacing: "-0.028em", color: C.navy, marginBottom: 16, ...fadeIn(visible) }}>
            Enterprise Compliance Readiness
          </h2>
          <p style={{ fontSize: 18, fontWeight: 400, lineHeight: 1.6, color: C.textSecondary, ...fadeIn(visible, 50) }}>
            RunPayway™ is designed to align with the security and privacy frameworks your organization requires.
          </p>
        </div>

        <div style={{ display: "flex", flexDirection: "column" as const, gap: 40, ...fadeIn(visible, 100) }}>
          {categories.map((cat, ci) => (
            <div key={ci}>
              <div style={{ fontSize: 12, fontWeight: 700, letterSpacing: "0.10em", textTransform: "uppercase" as const, color: cat.color, marginBottom: 16 }}>{cat.label}</div>
              <div style={{ display: m ? "block" : "grid", gridTemplateColumns: cat.items.length === 1 ? "1fr" : cat.items.length === 2 ? "1fr 1fr" : "1fr 1fr 1fr", gap: 24 }}>
                {cat.items.map((item, i) => (
                  <div key={i} style={{ padding: m ? 24 : 28, borderRadius: 16, backgroundColor: C.white, border: `1px solid ${C.borderSoft}`, borderLeft: `4px solid ${cat.color}`, boxShadow: cardShadow, marginBottom: m ? 16 : 0 }}>
                    <h3 style={{ fontSize: 18, fontWeight: 700, color: C.navy, marginBottom: 8 }}>{item.title}</h3>
                    <p style={{ fontSize: 15, fontWeight: 400, lineHeight: 1.6, color: C.textSecondary, margin: 0 }}>{item.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
        <div style={{ textAlign: "center", marginTop: 32, ...fadeIn(visible, 150) }}>
          <Link href="/methodology" style={{ fontSize: 14, fontWeight: 600, color: C.navy, textDecoration: "none" }}>
            Read our full methodology &rarr;
          </Link>
        </div>
      </div>
    </section>
  );
}


/* ================================================================ */
/* SECTION 6 — USE CASES                                             */
/* ================================================================ */

function UseCasesSection() {
  const { ref, visible } = useInView();
  const m = useMobile();
  const fadeIn = useFadeIn();

  const cases = [
    { title: "Lending & Underwriting", color: C.navy, icon: "\u{1F3E6}", desc: "Integrate an income stability layer into credit decisions. Standardize income assessment across different analysts and eliminate subjective variation." },
    { title: "Workforce Platforms", color: C.teal, icon: "\u{1F465}", desc: "Quickly assess contractor and freelancer income stability at onboarding and renewal. One consistent standard across your entire platform." },
    { title: "Advisory Platforms", color: purple, icon: "\u{1F4CA}", desc: "Give financial advisors a standardized tool to evaluate client income risk, making assessments consistent across your entire client base." },
    { title: "Benefits & Insurance", color: "#2D6A4F", icon: "\u{1F6E1}", desc: "Use income structure evaluation for eligibility determination, risk pricing, or coverage decisions. Replace subjective review with fixed methodology." },
  ];

  return (
    <section ref={ref} style={{ backgroundColor: C.white, paddingTop: m ? 72 : 120, paddingBottom: m ? 72 : 120, paddingLeft: sectionPx(m), paddingRight: sectionPx(m) }}>
      <div style={{ maxWidth: innerW, margin: "0 auto" }}>
        <div style={{ textAlign: "center", maxWidth: narrowW, margin: "0 auto", marginBottom: m ? 40 : 56 }}>
          <h2 style={{ fontSize: m ? 28 : 40, fontWeight: 600, lineHeight: 1.08, letterSpacing: "-0.028em", color: C.navy, marginBottom: 16, ...fadeIn(visible) }}>
            Where Enterprises Apply RunPayway™
          </h2>
        </div>

        <div style={{ display: m ? "block" : "grid", gridTemplateColumns: "1fr 1fr", gap: 24, ...fadeIn(visible, 100) }}>
          {cases.map((item, i) => (
            <div key={i} style={{ padding: m ? 24 : 28, borderRadius: 16, backgroundColor: C.white, border: `1px solid ${C.borderSoft}`, borderLeft: `4px solid ${item.color}`, boxShadow: cardShadow, marginBottom: m ? 16 : 0 }}>
              <div style={{ fontSize: 22, marginBottom: 8 }}>{item.icon}</div>
              <h3 style={{ fontSize: 20, fontWeight: 700, color: C.navy, marginBottom: 12 }}>{item.title}</h3>
              <p style={{ fontSize: 16, fontWeight: 400, lineHeight: 1.6, color: C.textSecondary, margin: 0 }}>{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}


/* ================================================================ */
/* SECTION 7 — REQUEST ACCESS FORM                                   */
/* ================================================================ */

function RequestAccessSection() {
  const { ref, visible } = useInView();
  const m = useMobile();
  const fadeIn = useFadeIn();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [org, setOrg] = useState("");
  const [role, setRole] = useState("");
  const [useCase, setUseCase] = useState("");
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [sendError, setSendError] = useState("");

  const handleSubmit = async () => {
    if (!name.trim() || !email.trim() || !org.trim()) return;
    setSending(true); setSendError("");
    try {
      const res = await fetch(`${WORKER_URL}/contact`, {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          email: email.trim(),
          subject: "enterprise-briefing",
          message: `Organization: ${org.trim()}\nRole: ${role.trim()}\nUse Case: ${useCase}\n\n${message.trim()}`,
        }),
      });
      if (res.ok) { setSent(true); } else { setSendError("Failed to send. Please try again."); }
    } catch { setSendError("Failed to send. Please try again."); }
    finally { setSending(false); }
  };

  const canSubmit = name.trim() && email.trim() && org.trim() && !sending;

  const inputStyle: React.CSSProperties = {
    width: "100%", height: 56, padding: "0 18px", borderRadius: 16,
    border: `1px solid ${border}`, background: "#FAFAFA",
    fontSize: 16, color: C.navy, outline: "none",
    transition: "border-color 200ms ease", boxSizing: "border-box",
  };

  const labelStyle: React.CSSProperties = {
    display: "block", fontSize: 11, fontWeight: 600, color: C.navy,
    letterSpacing: "0.10em", textTransform: "uppercase", marginBottom: 8,
  };

  return (
    <section ref={ref} id="enterprise-form" style={{ backgroundColor: C.sand, paddingTop: m ? 72 : 120, paddingBottom: m ? 72 : 120, paddingLeft: sectionPx(m), paddingRight: sectionPx(m) }}>
      <div style={{ maxWidth: 680, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: m ? 32 : 48 }}>
          <h2 style={{ fontSize: m ? 28 : 40, fontWeight: 600, lineHeight: 1.08, letterSpacing: "-0.028em", color: C.navy, marginBottom: 16, ...fadeIn(visible) }}>
            Request Your Enterprise Briefing
          </h2>
          <p style={{ fontSize: 18, fontWeight: 400, lineHeight: 1.6, color: C.textSecondary, ...fadeIn(visible, 50) }}>
            Gain access to a customized demo and detailed insights for applying RunPayway™ to your organization. We&#8217;ll follow up within two business days.
          </p>
        </div>

        <div style={{ background: C.white, borderRadius: 20, boxShadow: cardShadow, padding: m ? "32px 24px" : 40, ...fadeIn(visible, 100) }}>

          {/* Full Name */}
          <div style={{ marginBottom: 22 }}>
            <label style={labelStyle}>Full Name <span style={{ color: "#C0392B" }}>*</span></label>
            <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Your full name" required aria-required="true" style={inputStyle}
              onFocus={e => { e.currentTarget.style.borderColor = purple; }} onBlur={e => { e.currentTarget.style.borderColor = `rgba(14,26,43,0.12)`; }} />
          </div>

          {/* Work Email */}
          <div style={{ marginBottom: 22 }}>
            <label style={labelStyle}>Work Email <span style={{ color: "#C0392B" }}>*</span></label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@company.com" required aria-required="true" style={inputStyle}
              onFocus={e => { e.currentTarget.style.borderColor = purple; }} onBlur={e => { e.currentTarget.style.borderColor = `rgba(14,26,43,0.12)`; }} />
          </div>

          {/* Organization Name */}
          <div style={{ marginBottom: 22 }}>
            <label style={labelStyle}>Organization Name <span style={{ color: "#C0392B" }}>*</span></label>
            <input type="text" value={org} onChange={(e) => setOrg(e.target.value)} placeholder="Your organization" required aria-required="true" style={inputStyle}
              onFocus={e => { e.currentTarget.style.borderColor = purple; }} onBlur={e => { e.currentTarget.style.borderColor = `rgba(14,26,43,0.12)`; }} />
          </div>

          {/* Role / Title */}
          <div style={{ marginBottom: 22 }}>
            <label style={labelStyle}>Role / Title</label>
            <input type="text" value={role} onChange={(e) => setRole(e.target.value)} placeholder="Your role or title" style={inputStyle}
              onFocus={e => { e.currentTarget.style.borderColor = purple; }} onBlur={e => { e.currentTarget.style.borderColor = `rgba(14,26,43,0.12)`; }} />
          </div>

          {/* Use Case */}
          <div style={{ marginBottom: 22 }}>
            <label style={labelStyle}>Use Case</label>
            <select value={useCase} onChange={(e) => setUseCase(e.target.value)} style={{
              ...inputStyle, appearance: "none" as const, paddingRight: 44, cursor: "pointer", color: useCase ? C.navy : C.textMuted,
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='12' height='7' viewBox='0 0 12 7' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M1 1L6 6L11 1' stroke='%239CA3AF' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E")`,
              backgroundRepeat: "no-repeat", backgroundPosition: "right 16px center",
            }}
              onFocus={e => { e.currentTarget.style.borderColor = purple; }} onBlur={e => { e.currentTarget.style.borderColor = `rgba(14,26,43,0.12)`; }}>
              <option value="" disabled>Select your use case</option>
              <option value="Lending / Underwriting">Lending / Underwriting</option>
              <option value="Workforce / HR Platform">Workforce / HR Platform</option>
              <option value="Advisory Platform">Advisory Platform</option>
              <option value="Insurance / Benefits">Insurance / Benefits</option>
              <option value="Government / Public Sector">Government / Public Sector</option>
              <option value="Other">Other</option>
            </select>
          </div>

          {/* Message */}
          <div style={{ marginBottom: 28 }}>
            <label style={labelStyle}>Tell us about your use case</label>
            <textarea value={message} onChange={(e) => setMessage(e.target.value)} placeholder="Describe how you plan to use RunPayway\u2122" rows={5}
              style={{ ...inputStyle, height: "auto", padding: "14px 18px", resize: "vertical" as const, minHeight: 130, fontFamily: "inherit", lineHeight: 1.6 }}
              onFocus={e => { e.currentTarget.style.borderColor = purple; }} onBlur={e => { e.currentTarget.style.borderColor = `rgba(14,26,43,0.12)`; }} />
          </div>

          {sent ? (
            <div style={{ width: "100%", height: 60, borderRadius: 16, background: `${C.teal}08`, border: `1px solid ${C.teal}18`, display: "flex", alignItems: "center", justifyContent: "center", color: C.teal, fontSize: 15, fontWeight: 600 }}>
              Briefing request submitted. We&#8217;ll be in touch within five business days.
            </div>
          ) : (
            <>
              <button onClick={handleSubmit} disabled={!canSubmit} style={{
                width: "100%", height: 60, borderRadius: 16,
                background: canSubmit ? purple : "rgba(14,26,43,0.08)",
                color: canSubmit ? C.white : C.textMuted,
                fontSize: 16, fontWeight: 600, border: "none",
                cursor: canSubmit ? "pointer" : "not-allowed",
                boxShadow: canSubmit ? ctaShadow : "none",
                transition: "background 200ms ease, box-shadow 200ms ease, transform 200ms ease",
              }}
                onMouseEnter={e => { if (canSubmit) { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = "0 12px 32px rgba(14,26,43,0.18)"; } }}
                onMouseLeave={e => { if (canSubmit) { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = ctaShadow; } }}>
                {sending ? "Submitting..." : "Request Enterprise Briefing"}
              </button>
              {sendError && <p role="alert" aria-live="assertive" style={{ fontSize: 13, color: "#C0392B", marginTop: 8, textAlign: "center" }}>{sendError}</p>}
            </>
          )}

          <div style={{ height: 1, background: border, margin: "28px 0 16px" }} />
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={C.textMuted} strokeWidth="2" strokeLinecap="round"><path d="M12 15v2m-6 4h12a2 2 0 0 0 2-2v-6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2zm10-10V7a4 4 0 0 0-8 0v4h8z" /></svg>
            <span style={{ fontSize: 13, fontWeight: 600, color: C.textMuted }}>Secure form submission | Encrypted data transmission</span>
          </div>
        </div>
      </div>
    </section>
  );
}


/* ================================================================ */
/* SECTION 8 — FINAL CTA                                             */
/* ================================================================ */

function FinalCta() {
  const { ref, visible } = useInView();
  const m = useMobile();
  const fadeIn = useFadeIn();

  const scrollToForm = (e: React.MouseEvent) => {
    e.preventDefault();
    const el = document.getElementById("enterprise-form");
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section ref={ref} style={{ backgroundColor: C.navy, paddingTop: m ? 88 : 128, paddingBottom: m ? 88 : 128, paddingLeft: sectionPx(m), paddingRight: sectionPx(m) }}>
      <div style={{ maxWidth: explanatoryW, margin: "0 auto", textAlign: "center" }}>
        <h2 style={{ fontSize: m ? 28 : 40, fontWeight: 600, lineHeight: 1.08, letterSpacing: "-0.028em", color: C.sandText, marginBottom: 32, ...fadeIn(visible) }}>
          Remove subjectivity from{m ? " " : <br />}income evaluation.{m ? " " : <br />}Deploy a fixed standard.
        </h2>
        <div style={{ display: "flex", flexDirection: "column" as const, alignItems: "center", ...fadeIn(visible, 100) }}>
          <button onClick={scrollToForm} style={{
            display: "inline-flex", alignItems: "center", justifyContent: "center",
            height: m ? 56 : 60, width: m ? "100%" : "auto",
            padding: m ? "0 28px" : "0 32px",
            borderRadius: 16, backgroundColor: C.white, color: purple,
            fontSize: 16, fontWeight: 600,
            boxShadow: "0 8px 24px rgba(14,26,43,0.08)",
            border: `1px solid ${C.borderSoft}`,
            cursor: "pointer",
            transition: "transform 200ms, box-shadow 200ms",
          }}
            onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = "0 12px 32px rgba(14,26,43,0.12)"; }}
            onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "0 8px 24px rgba(14,26,43,0.08)"; }}>
            Request Enterprise Briefing
          </button>
          <p style={{ fontSize: 14, fontWeight: 500, color: C.sandLight, marginTop: 16 }}>
            Consistent | Version-controlled | Compliant by design
          </p>
        </div>
      </div>
    </section>
  );
}


/* ================================================================ */
/* PAGE EXPORT                                                       */
/* ================================================================ */

export default function OrganizationsPage() {
  return (
    <div className="overflow-x-hidden">
      <main>
        <HeroSection />
        <ProblemSection />
        <SystemSection />
        <IntegrationSection />
        <ComplianceSection />
        <UseCasesSection />
        <RequestAccessSection />
        <FinalCta />
      </main>
    </div>
  );
}
