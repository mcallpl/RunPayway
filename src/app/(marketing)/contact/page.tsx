"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useLanguage } from "@/lib/i18n";
import { C, T, mono, sans, maxW, sp, secPad, px, h1, h2Style, body, cardStyle, canHover } from "@/lib/design-tokens";

/* ------------------------------------------------------------------ */
/*  Shared hooks                                                       */
/* ------------------------------------------------------------------ */

function useMobile(breakpoint = 768) {
  const [mobile, setMobile] = useState(false);
  useEffect(() => {
    const check = () => setMobile(window.innerWidth <= breakpoint);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, [breakpoint]);
  return mobile;
}

function useInView(threshold = 0) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    if (rect.top < window.innerHeight + 50 && rect.bottom > 0) {
      setVisible(true);
      return;
    }
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          obs.disconnect();
        }
      },
      { threshold },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);
  return { ref, visible };
}

/* ------------------------------------------------------------------ */
/*  Brand tokens                                                       */
/* ------------------------------------------------------------------ */

const gradient = C.navy;

/* ------------------------------------------------------------------ */
/*  Page                                                               */
/* ------------------------------------------------------------------ */

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
  const [btnHovered, setBtnHovered] = useState(false);
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [sendError, setSendError] = useState("");

  const handleSubmit = async () => {
    if (!name.trim() || !email.trim() || !message.trim()) return;
    setSending(true);
    setSendError("");
    try {
      const res = await fetch("https://runpayway-pressuremap.mcallpl.workers.dev/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: name.trim(), email: email.trim(), subject, message: message.trim() }),
      });
      if (res.ok) {
        setSent(true);
      } else {
        setSendError("Failed to send. Please try again.");
      }
    } catch {
      setSendError("Failed to send. Please try again.");
    } finally {
      setSending(false);
    }
  };

  const inputStyle: React.CSSProperties = {
    width: "100%",
    height: 48,
    padding: "0 16px",
    borderRadius: 10,
    border: `1px solid ${C.border}`,
    background: C.sand,
    fontSize: 14,
    fontFamily: sans,
    color: C.navy,
    outline: "none",
    transition: "border-color 180ms ease",
    boxSizing: "border-box",
  };

  const labelStyle: React.CSSProperties = {
    display: "block",
    fontSize: 13,
    fontWeight: 600,
    color: C.navy,
    letterSpacing: "0.04em",
    textTransform: "uppercase",
    marginBottom: 8,
  };

  return (
    <div style={{ background: C.white, fontFamily: sans }}>
      {/* ============================================================ */}
      {/*  Hero                                                        */}
      {/* ============================================================ */}
      <section
        style={{
          backgroundColor: C.navy,
          paddingTop: mobile ? 120 : 180,
          paddingBottom: mobile ? 80 : 120,
          paddingLeft: px(mobile),
          paddingRight: px(mobile),
        }}
      >
        <div
          ref={heroAnim.ref}
          style={{
            maxWidth: maxW,
            margin: "0 auto",
            textAlign: "center",
            opacity: heroAnim.visible ? 1 : 0,
            transform: heroAnim.visible ? "translateY(0)" : "translateY(24px)",
            transition: "opacity 700ms ease, transform 700ms ease",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 12, marginBottom: 28 }}>
            <span style={{ ...T.label, color: C.teal }}>{t.contact.heroTag}</span>
            <span style={{ fontSize: 11, fontFamily: mono, fontWeight: 500, color: C.sandLight, padding: "3px 8px", borderRadius: 4, border: `1px solid ${C.sandBorder}` }}>RP-2.0</span>
          </div>

          <h1 style={{ ...h1(mobile), color: C.sandText, lineHeight: 1.08, letterSpacing: "-0.03em", marginBottom: 24 }}>
            {t.contact.heroTitle}
          </h1>

          <p style={{ ...body(mobile), color: C.sandMuted, maxWidth: 560, margin: "0 auto 16px" }}>
            {t.contact.heroDesc}
          </p>

          <p style={{ ...T.meta, color: C.sandLight }}>
            {t.contact.heroResponse}
          </p>
        </div>
      </section>

      {/* ============================================================ */}
      {/*  Form + sidebar                                              */}
      {/* ============================================================ */}
      <section
        style={{
          paddingTop: mobile ? 56 : 80,
          paddingBottom: mobile ? 64 : 96,
          background: C.sand,
        }}
      >
        <div
          className="mx-auto"
          style={{
            maxWidth: 940,
            paddingLeft: mobile ? 24 : 40,
            paddingRight: mobile ? 24 : 40,
            display: "flex",
            flexDirection: mobile ? "column" : "row",
            gap: mobile ? 32 : 40,
            alignItems: "start",
          }}
        >
          {/* Form card */}
          <div
            ref={formAnim.ref}
            style={{
              flex: 1.2,
              background: C.white,
              borderRadius: 12,
              border: `1px solid ${C.border}`,
              padding: mobile ? "32px 24px" : "40px 40px",
              boxShadow: "0 8px 32px rgba(14,26,43,0.06)",
              opacity: formAnim.visible ? 1 : 0,
              transform: formAnim.visible ? "translateY(0)" : "translateY(24px)",
              transition: "opacity 700ms ease, transform 700ms ease",
            }}
          >
            <div style={{ fontSize: 13, fontWeight: 600, color: C.purple, letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 10 }}>
              {t.contact.formTag}
            </div>
            <div style={{ height: 1, background: C.border, marginBottom: 28 }} />

            {/* Full Name */}
            <div style={{ marginBottom: 20 }}>
              <label style={labelStyle}>{t.contact.fullName}</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder={t.contact.fullNamePlaceholder}
                style={inputStyle}
                onFocus={(e) => { e.currentTarget.style.borderColor = C.purple; }}
                onBlur={(e) => { e.currentTarget.style.borderColor = C.border; }}
              />
            </div>

            {/* Email Address */}
            <div style={{ marginBottom: 20 }}>
              <label style={labelStyle}>{t.contact.emailAddress}</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={t.contact.emailPlaceholder}
                style={inputStyle}
                onFocus={(e) => { e.currentTarget.style.borderColor = C.purple; }}
                onBlur={(e) => { e.currentTarget.style.borderColor = C.border; }}
              />
            </div>

            {/* Subject */}
            <div style={{ marginBottom: 20 }}>
              <label style={labelStyle}>{t.contact.subject}</label>
              <select
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                style={{
                  ...inputStyle,
                  appearance: "none",
                  backgroundImage: `url("data:image/svg+xml,%3Csvg width='12' height='7' viewBox='0 0 12 7' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M1 1L6 6L11 1' stroke='%239CA3AF' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E")`,
                  backgroundRepeat: "no-repeat",
                  backgroundPosition: `right 16px center`,
                  paddingRight: 44,
                  color: subject ? C.navy : C.light,
                  cursor: "pointer",
                }}
                onFocus={(e) => { e.currentTarget.style.borderColor = C.purple; }}
                onBlur={(e) => { e.currentTarget.style.borderColor = C.border; }}
              >
                <option value="" disabled>{t.contact.subjectPlaceholder}</option>
                <option value="general">{t.contact.subjectGeneral}</option>
                <option value="assessment">{t.contact.subjectAssessment}</option>
                <option value="command_center">Command Center</option>
                <option value="enterprise">Enterprise</option>
                <option value="technical">{t.contact.subjectTechnical}</option>
                <option value="partnership">{t.contact.subjectPartnership}</option>
                <option value="other">{t.contact.subjectOther}</option>
              </select>
            </div>

            {/* Message */}
            <div style={{ marginBottom: 28 }}>
              <label style={labelStyle}>{t.contact.message}</label>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder={t.contact.messagePlaceholder}
                rows={5}
                style={{
                  ...inputStyle,
                  height: "auto",
                  padding: "14px 16px",
                  resize: "vertical",
                  minHeight: 120,
                  fontFamily: "inherit",
                  lineHeight: 1.6,
                }}
                onFocus={(e) => { e.currentTarget.style.borderColor = C.purple; }}
                onBlur={(e) => { e.currentTarget.style.borderColor = C.border; }}
              />
            </div>

            {/* Submit button */}
            {sent ? (
              <div style={{
                width: "100%", height: 52, borderRadius: 12,
                background: "rgba(31,109,122,0.08)", border: "1px solid rgba(31,109,122,0.20)",
                display: "flex", alignItems: "center", justifyContent: "center",
                color: C.teal, fontSize: 15, fontWeight: 600,
              }}>
                Message sent. We will be in touch.
              </div>
            ) : (
              <>
                <button
                  onClick={handleSubmit}
                  disabled={sending || !name.trim() || !email.trim() || !message.trim()}
                  onMouseEnter={() => canHover() && setBtnHovered(true)}
                  onMouseLeave={() => setBtnHovered(false)}
                  style={{
                    width: "100%",
                    height: 52,
                    borderRadius: 12,
                    background: sending ? "rgba(75,63,174,0.5)" : btnHovered ? "#3D33A0" : C.purple,
                    color: C.white,
                    fontSize: 16,
                    fontWeight: 600,
                    letterSpacing: "-0.01em",
                    border: "none",
                    cursor: sending ? "wait" : "pointer",
                    boxShadow: "0 6px 16px rgba(75,63,174,0.25)",
                    transition: "background 180ms ease, transform 180ms ease",
                    transform: btnHovered ? "translateY(-1px)" : "translateY(0)",
                    opacity: (!name.trim() || !email.trim() || !message.trim()) ? 0.5 : 1,
                  }}
                >
                  {sending ? "Sending..." : t.contact.submit}
                </button>
                {sendError && <p style={{ fontSize: 13, color: "#9B2C2C", marginTop: 8, textAlign: "center" }}>{sendError}</p>}
              </>
            )}

            {/* Security line */}
            <div style={{ height: 1, background: C.border, margin: "24px 0 16px" }} />
            <div style={{ display: "flex", flexDirection: "column", gap: 4, alignItems: "center" }}>
              <span style={{ fontSize: 14, color: C.light }}>{t.contact.secureForm}</span>
              <span style={{ fontSize: 14, color: C.light }}>{t.contact.encryptedData}</span>
            </div>
          </div>

          {/* Sidebar */}
          <div
            ref={sideAnim.ref}
            style={{
              flex: 0.8,
              display: "flex",
              flexDirection: "column",
              gap: mobile ? 20 : 24,
              opacity: sideAnim.visible ? 1 : 0,
              transform: sideAnim.visible ? "translateY(0)" : "translateY(24px)",
              transition: "opacity 700ms ease 140ms, transform 700ms ease 140ms",
            }}
          >
            {/* Response Expectations */}
            <div
              style={{
                background: C.white,
                borderRadius: 12,
                border: `1px solid ${C.border}`,
                padding: mobile ? "24px 24px" : "28px 28px",
                boxShadow: "0 2px 8px rgba(14,26,43,0.04)",
              }}
            >
              <div style={{ fontSize: 13, fontWeight: 600, color: C.purple, letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 14 }}>
                {t.contact.responseTag}
              </div>
              <p style={{ fontSize: 14, color: C.muted, lineHeight: 1.65, marginBottom: 10 }}>
                {t.contact.responseP1}
              </p>
              <p style={{ fontSize: 14, color: C.muted, lineHeight: 1.65, marginBottom: 10 }}>
                {t.contact.responseP2}
              </p>
              <p style={{ fontSize: 14, color: C.muted, lineHeight: 1.65 }}>
                {t.contact.responseP3}
              </p>
            </div>

            {/* Alternative Resources */}
            <div
              style={{
                background: C.white,
                borderRadius: 12,
                border: `1px solid ${C.border}`,
                padding: mobile ? "24px 24px" : "28px 28px",
                boxShadow: "0 2px 8px rgba(14,26,43,0.04)",
              }}
            >
              <div style={{ fontSize: 13, fontWeight: 600, color: C.purple, letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 14 }}>
                {t.contact.resourcesTag}
              </div>
              <p style={{ fontSize: 14, color: C.muted, lineHeight: 1.65, marginBottom: 16 }}>
                {t.contact.resourcesDesc}
              </p>
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {[
                  { href: "/faq", label: t.nav.faq },
                  { href: "/methodology", label: t.nav.methodology },
                  { href: "/dashboard", label: "Command Center" },
                ].map((link) => (
                  <Link
                    key={link.label}
                    href={link.href}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      padding: "12px 16px",
                      borderRadius: 10,
                      background: C.sand,
                      fontSize: 14,
                      fontWeight: 600,
                      color: C.navy,
                      textDecoration: "none",
                      transition: "background 180ms ease",
                    }}
                    onMouseEnter={(e) => { if (canHover()) e.currentTarget.style.background = C.sand; }}
                    onMouseLeave={(e) => { e.currentTarget.style.background = C.sand; }}
                  >
                    {link.label}
                    <span style={{ color: C.purple, fontSize: 14 }}>→</span>
                  </Link>
                ))}
              </div>
              <p style={{ fontSize: 14, color: C.light, lineHeight: 1.65, marginTop: 14 }}>
                {t.contact.resourcesNote}
              </p>
            </div>

            {/* Security Notice */}
            <div
              style={{
                background: C.white,
                borderRadius: 12,
                border: `1px solid ${C.border}`,
                padding: mobile ? "24px 24px" : "28px 28px",
                boxShadow: "0 2px 8px rgba(14,26,43,0.04)",
              }}
            >
              <div style={{ fontSize: 13, fontWeight: 600, color: C.purple, letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 14 }}>
                {t.contact.securityTag}
              </div>
              <p style={{ fontSize: 14, color: C.muted, lineHeight: 1.65, marginBottom: 10 }}>
                {t.contact.securityP1}
              </p>
              <p style={{ fontSize: 14, color: C.muted, lineHeight: 1.65 }}>
                {t.contact.securityP2}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/*  Closing brand bar                                           */}
      {/* ============================================================ */}
      <section
        style={{
          backgroundColor: C.navy,
          paddingTop: mobile ? 56 : 72,
          paddingBottom: mobile ? 56 : 72,
          paddingLeft: px(mobile),
          paddingRight: px(mobile),
        }}
      >
        <div style={{ maxWidth: 600, margin: "0 auto", textAlign: "center" }}>
          <div style={{ fontSize: mobile ? 22 : 28, fontWeight: 600, fontFamily: sans, color: C.sandText, letterSpacing: "-0.02em", marginBottom: 8 }}>
            RunPayway™
          </div>
          <div style={{ fontSize: mobile ? 16 : 18, color: C.sandMuted, lineHeight: 1.65, marginBottom: 24 }}>
            {t.contact.closingSubtitle}
          </div>
          <p style={{ fontSize: 14, color: C.sandLight, letterSpacing: "0.02em" }}>
            {t.contact.poweredBy}
          </p>
        </div>
      </section>
    </div>
  );
}
