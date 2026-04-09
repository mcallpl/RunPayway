"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useLanguage } from "@/lib/i18n";
import { C, sans } from "@/lib/design-tokens";

/* ================================================================== */
/* UTILITIES                                                           */
/* ================================================================== */

function useMobile(bp = 768) {
  const [m, setM] = useState(false);
  useEffect(() => { const c = () => setM(window.innerWidth <= bp); c(); window.addEventListener("resize", c); return () => window.removeEventListener("resize", c); }, [bp]);
  return m;
}

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

/* ================================================================== */
/* TOKENS                                                              */
/* ================================================================== */

const muted = "rgba(14,26,43,0.68)";
const light = "rgba(14,26,43,0.62)";
const border = "#E5E7EB";

/* ================================================================== */
/* PAGE                                                                */
/* ================================================================== */

export default function ContactPage() {
  const mobile = useMobile();
  const { t } = useLanguage();
  const heroAnim = useInView();
  const formAnim = useInView();
  const sideAnim = useInView();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [sendError, setSendError] = useState("");

  const handleSubmit = async () => {
    if (!name.trim() || !email.trim() || !message.trim()) return;
    setSending(true); setSendError("");
    try {
      const res = await fetch("https://runpayway-pressuremap.mcallpl.workers.dev/contact", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: name.trim(), email: email.trim(), subject, message: message.trim() }),
      });
      if (res.ok) { setSent(true); } else { setSendError("Failed to send. Please try again."); }
    } catch { setSendError("Failed to send. Please try again."); }
    finally { setSending(false); }
  };

  const canSubmit = name.trim() && email.trim() && message.trim() && !sending;

  const inputStyle: React.CSSProperties = {
    width: "100%", height: 48, padding: "0 18px", borderRadius: 12,
    border: `1px solid ${border}`, background: "#FAFAFA",
    fontSize: 15, fontFamily: sans, color: C.navy, outline: "none",
    transition: "border-color 200ms ease", boxSizing: "border-box",
  };

  const labelStyle: React.CSSProperties = {
    display: "block", fontSize: 11, fontWeight: 600, color: C.navy,
    letterSpacing: "0.10em", textTransform: "uppercase", marginBottom: 8,
  };

  const fade = (v: boolean, d = 0): React.CSSProperties => ({
    opacity: v ? 1 : 0, transform: v ? "translateY(0)" : "translateY(10px)",
    transition: `opacity 500ms ease-out ${d}ms, transform 500ms ease-out ${d}ms`,
  });

  return (
    <div style={{ background: "#FAFAFA", fontFamily: sans }}>

      {/* HERO */}
      <header style={{ backgroundColor: C.sand, position: "relative", overflow: "hidden", paddingTop: mobile ? 104 : 152, paddingBottom: mobile ? 56 : 88, paddingLeft: mobile ? 24 : 48, paddingRight: mobile ? 24 : 48 }}>
        <div ref={heroAnim.ref} style={{ maxWidth: 860, margin: "0 auto", textAlign: "center", position: "relative", zIndex: 1, ...fade(heroAnim.visible) }}>
          <div style={{ fontSize: mobile ? 13 : 14, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase" as const, color: C.teal, marginBottom: 16 }}>
            {t.contact.heroTag}
          </div>
          <h1 style={{ fontSize: mobile ? 38 : 64, fontWeight: 700, color: C.navy, letterSpacing: "-0.035em", lineHeight: 1.05, marginBottom: 24 }}>
            {t.contact.heroTitle}
          </h1>
          <p style={{ fontSize: mobile ? 18 : 22, fontWeight: 400, color: muted, lineHeight: 1.5, maxWidth: 620, margin: "0 auto 16px" }}>
            {t.contact.heroDesc}
          </p>
          <p style={{ fontSize: mobile ? 15 : 16, fontWeight: 600, color: C.navy }}>
            {t.contact.heroResponse}
          </p>
        </div>
      </header>

      {/* FORM + SIDEBAR */}
      <section style={{ paddingTop: mobile ? 56 : 112, paddingBottom: mobile ? 56 : 112 }}>
        <div style={{ maxWidth: 1040, margin: "0 auto", paddingLeft: mobile ? 24 : 24, paddingRight: mobile ? 24 : 24, display: "flex", flexDirection: mobile ? "column" : "row", gap: mobile ? 28 : 36, alignItems: "start" }}>

          {/* Form card */}
          <div ref={formAnim.ref} style={{
            flex: 1.2, background: C.white, borderRadius: 16, border: `1px solid ${border}`,
            padding: mobile ? "32px 24px" : "44px 44px",
            boxShadow: "0 2px 12px rgba(14,26,43,0.04)",
            ...fade(formAnim.visible),
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 12 }}>
              <div style={{ width: 4, height: 24, borderRadius: 2, backgroundColor: C.purple, opacity: 0.30, flexShrink: 0 }} />
              <span style={{ fontSize: 11, fontWeight: 700, color: C.purple, letterSpacing: "0.14em", textTransform: "uppercase" as const }}>{t.contact.formTag}</span>
              <div style={{ height: 1, flex: 1, background: `linear-gradient(90deg, ${C.purple}10 0%, transparent 100%)` }} />
            </div>
            <p style={{ fontSize: 15, color: muted, lineHeight: 1.6, marginBottom: 28 }}>
              {t.contact.formDesc}
            </p>

            <div style={{ marginBottom: 22 }}>
              <label style={labelStyle}>{t.contact.fullName} <span style={{ color: "#C0392B" }}>*</span></label>
              <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder={t.contact.fullNamePlaceholder} required aria-required="true" style={inputStyle}
                onFocus={e => { e.currentTarget.style.borderColor = C.purple; }} onBlur={e => { e.currentTarget.style.borderColor = border; }} />
            </div>

            <div style={{ marginBottom: 22 }}>
              <label style={labelStyle}>{t.contact.emailAddress} <span style={{ color: "#C0392B" }}>*</span></label>
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder={t.contact.emailPlaceholder} required aria-required="true" style={inputStyle}
                onFocus={e => { e.currentTarget.style.borderColor = C.purple; }} onBlur={e => { e.currentTarget.style.borderColor = border; }} />
            </div>

            <div style={{ marginBottom: 22 }}>
              <label style={labelStyle}>{t.contact.subject}</label>
              <select value={subject} onChange={(e) => setSubject(e.target.value)} style={{
                ...inputStyle, appearance: "none" as const, paddingRight: 44, cursor: "pointer", color: subject ? C.navy : light,
                backgroundImage: `url("data:image/svg+xml,%3Csvg width='12' height='7' viewBox='0 0 12 7' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M1 1L6 6L11 1' stroke='%239CA3AF' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E")`,
                backgroundRepeat: "no-repeat", backgroundPosition: "right 16px center",
              }}
                onFocus={e => { e.currentTarget.style.borderColor = C.purple; }} onBlur={e => { e.currentTarget.style.borderColor = border; }}>
                <option value="" disabled>{t.contact.subjectPlaceholder}</option>
                <option value="general">{t.contact.subjectGeneral}</option>
                <option value="assessment">{t.contact.subjectAssessment}</option>
                <option value="dashboard">Dashboard</option>
                <option value="advisory">Advisory Licensing</option>
                <option value="organization">Organization Licensing</option>
                <option value="enterprise">Enterprise</option>
                <option value="technical">{t.contact.subjectTechnical}</option>
                <option value="partnership">{t.contact.subjectPartnership}</option>
                <option value="other">{t.contact.subjectOther}</option>
              </select>
            </div>

            <div style={{ marginBottom: 28 }}>
              <label style={labelStyle}>{t.contact.message} <span style={{ color: "#C0392B" }}>*</span></label>
              <textarea value={message} onChange={(e) => setMessage(e.target.value)} placeholder={t.contact.messagePlaceholder} required aria-required="true" rows={5}
                style={{ ...inputStyle, height: "auto", padding: "14px 18px", resize: "vertical" as const, minHeight: 130, fontFamily: "inherit", lineHeight: 1.6 }}
                onFocus={e => { e.currentTarget.style.borderColor = C.purple; }} onBlur={e => { e.currentTarget.style.borderColor = border; }} />
            </div>

            {sent ? (
              <div style={{ width: "100%", height: 56, borderRadius: 14, background: `${C.teal}08`, border: `1px solid ${C.teal}18`, display: "flex", alignItems: "center", justifyContent: "center", color: C.teal, fontSize: 15, fontWeight: 600 }}>
                Message sent. We will be in touch.
              </div>
            ) : (
              <>
                <button onClick={handleSubmit} disabled={!canSubmit} style={{
                  width: "100%", height: 60, borderRadius: 16,
                  background: canSubmit ? C.navy : "rgba(14,26,43,0.08)",
                  color: canSubmit ? C.white : light,
                  fontSize: 16, fontWeight: 600, border: "none",
                  cursor: canSubmit ? "pointer" : "not-allowed",
                  boxShadow: canSubmit ? "0 8px 24px rgba(14,26,43,0.12)" : "none",
                  transition: "background 200ms ease, box-shadow 200ms ease, transform 200ms ease",
                }}
                  onMouseEnter={e => { if (canSubmit) { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = "0 12px 32px rgba(14,26,43,0.18)"; } }}
                  onMouseLeave={e => { if (canSubmit) { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "0 8px 24px rgba(14,26,43,0.12)"; } }}>
                  {sending ? "Sending..." : t.contact.submit}
                </button>
                {sendError && <p role="alert" aria-live="assertive" style={{ fontSize: 13, color: "#C0392B", marginTop: 8, textAlign: "center" }}>{sendError}</p>}
              </>
            )}

            <div style={{ height: 1, background: border, margin: "28px 0 16px" }} />
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={light} strokeWidth="2" strokeLinecap="round"><path d="M12 15v2m-6 4h12a2 2 0 0 0 2-2v-6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2zm10-10V7a4 4 0 0 0-8 0v4h8z" /></svg>
              <span style={{ fontSize: 13, fontWeight: 600, color: light }}>{t.contact.secureForm}</span>
              <span style={{ fontSize: 13, color: light }}>&middot;</span>
              <span style={{ fontSize: 13, color: light }}>{t.contact.encryptedData}</span>
            </div>
          </div>

          {/* Sidebar */}
          <div ref={sideAnim.ref} style={{ flex: 0.8, display: "flex", flexDirection: "column" as const, gap: mobile ? 16 : 20, ...fade(sideAnim.visible, 120) }}>
            {/* Response Expectations */}
            <div style={{ background: C.white, borderRadius: 14, border: `1px solid ${border}`, padding: mobile ? "24px 24px" : "28px 28px", boxShadow: "0 1px 4px rgba(14,26,43,0.03)" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
                <div style={{ width: 36, height: 36, borderRadius: 8, backgroundColor: `${C.purple}08`, border: `1px solid ${C.purple}10`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={C.purple} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 8v4l3 3m6-3a9 9 0 1 1-18 0 9 9 0 0 1 18 0z" /></svg>
                </div>
                <span style={{ fontSize: 11, fontWeight: 700, color: C.purple, letterSpacing: "0.12em", textTransform: "uppercase" as const }}>{t.contact.responseTag}</span>
              </div>
              <p style={{ fontSize: 14, color: muted, lineHeight: 1.65, marginBottom: 8 }}>{t.contact.responseP1}</p>
              <p style={{ fontSize: 14, color: muted, lineHeight: 1.65, marginBottom: 8 }}>{t.contact.responseP2}</p>
              <p style={{ fontSize: 14, color: muted, lineHeight: 1.65, margin: 0 }}>{t.contact.responseP3}</p>
            </div>

            {/* Resources */}
            <div style={{ background: C.white, borderRadius: 14, border: `1px solid ${border}`, padding: mobile ? "24px 24px" : "28px 28px", boxShadow: "0 1px 4px rgba(14,26,43,0.03)" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
                <div style={{ width: 36, height: 36, borderRadius: 8, backgroundColor: `${C.teal}08`, border: `1px solid ${C.teal}10`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={C.teal} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>
                </div>
                <span style={{ fontSize: 11, fontWeight: 700, color: C.teal, letterSpacing: "0.12em", textTransform: "uppercase" as const }}>{t.contact.resourcesTag}</span>
              </div>
              <p style={{ fontSize: 14, color: muted, lineHeight: 1.65, marginBottom: 16 }}>{t.contact.resourcesDesc}</p>
              <div style={{ display: "flex", flexDirection: "column" as const, gap: 8 }}>
                {[
                  { href: "/faq", label: t.nav.faq },
                  { href: "/methodology", label: t.nav.methodology },
                  { href: "/sample-report", label: "Sample Report" },
                ].map((link) => (
                  <Link key={link.label} href={link.href} style={{
                    display: "flex", alignItems: "center", justifyContent: "space-between",
                    padding: "14px 18px", borderRadius: 12, background: "#FAFAFA", border: `1px solid ${border}`,
                    fontSize: 14, fontWeight: 600, color: C.navy, textDecoration: "none",
                    transition: "border-color 200ms ease",
                  }}
                    onMouseEnter={e => { e.currentTarget.style.borderColor = `${C.teal}30`; }}
                    onMouseLeave={e => { e.currentTarget.style.borderColor = border; }}>
                    {link.label}
                    <span style={{ color: C.teal, fontSize: 14 }}>&rarr;</span>
                  </Link>
                ))}
              </div>
              <p style={{ fontSize: 13, color: light, lineHeight: 1.6, marginTop: 14, marginBottom: 0 }}>{t.contact.resourcesNote}</p>
            </div>

            {/* Security */}
            <div style={{ background: C.white, borderRadius: 14, border: `1px solid ${border}`, padding: mobile ? "24px 24px" : "28px 28px", boxShadow: "0 1px 4px rgba(14,26,43,0.03)" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
                <div style={{ width: 36, height: 36, borderRadius: 8, backgroundColor: `${C.navy}06`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={C.navy} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 15v2m-6 4h12a2 2 0 0 0 2-2v-6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2zm10-10V7a4 4 0 0 0-8 0v4h8z" /></svg>
                </div>
                <span style={{ fontSize: 11, fontWeight: 700, color: C.navy, letterSpacing: "0.12em", textTransform: "uppercase" as const }}>{t.contact.securityTag}</span>
              </div>
              <p style={{ fontSize: 14, color: muted, lineHeight: 1.65, marginBottom: 8 }}>{t.contact.securityP1}</p>
              <p style={{ fontSize: 14, color: muted, lineHeight: 1.65, margin: 0 }}>{t.contact.securityP2}</p>
            </div>
          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section style={{ backgroundColor: C.navy, paddingTop: mobile ? 88 : 128, paddingBottom: mobile ? 88 : 128, paddingLeft: mobile ? 24 : 48, paddingRight: mobile ? 24 : 48 }}>
        <div style={{ maxWidth: 640, margin: "0 auto", textAlign: "center" }}>
          <h2 style={{ fontSize: mobile ? 28 : 40, fontWeight: 600, lineHeight: 1.08, letterSpacing: "-0.028em", color: C.sandText, marginBottom: 32 }}>
            {t.contact.closingSubtitle}
          </h2>
          <Link href="/begin" style={{
            display: "inline-flex", alignItems: "center", justifyContent: "center",
            height: mobile ? 56 : 60, width: mobile ? "100%" : "auto",
            padding: mobile ? "0 28px" : "0 32px",
            borderRadius: 16, backgroundColor: C.white, color: C.navy,
            fontSize: 16, fontWeight: 600, textDecoration: "none",
            boxShadow: "0 8px 24px rgba(14,26,43,0.08)",
            border: `1px solid rgba(244,241,234,0.45)`,
            transition: "transform 200ms, box-shadow 200ms",
          }}
            onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = "0 12px 32px rgba(14,26,43,0.12)"; }}
            onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "0 8px 24px rgba(14,26,43,0.08)"; }}>
            Get Your Structural Income Report
          </Link>
          <p style={{ fontSize: 14, fontWeight: 500, color: "rgba(244,241,234,0.40)", marginTop: 16 }}>
            Under 2 minutes | Instant result | Private by default
          </p>
          <p style={{ fontSize: 13, color: "rgba(244,241,234,0.30)", marginTop: 24, letterSpacing: "0.04em" }}>
            {t.contact.poweredBy}
          </p>
        </div>
      </section>
    </div>
  );
}
