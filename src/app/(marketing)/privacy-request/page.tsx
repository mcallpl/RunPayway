"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { C, sans, sp, canHover } from "@/lib/design-tokens";

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

export default function PrivacyRequestPage() {
  const mobile = useMobile();
  const heroAnim = useInView();
  const formAnim = useInView();
  const sideAnim = useInView();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [requestType, setRequestType] = useState("");
  const [recordId, setRecordId] = useState("");
  const [message, setMessage] = useState("");
  const [btnHovered, setBtnHovered] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const inputStyle: React.CSSProperties = {
    width: "100%",
    height: 48,
    padding: "0 16px",
    borderRadius: 10,
    border: "1px solid rgba(14,26,43,0.12)",
    background: C.sand,
    fontSize: 14,
    color: C.navy,
    outline: "none",
    transition: "border-color 180ms ease",
    boxSizing: "border-box",
  };

  const labelStyle: React.CSSProperties = {
    display: "block",
    fontSize: 12,
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
          position: "relative",
          overflow: "hidden",
          background: gradient,
          paddingTop: mobile ? 72 : 100,
          paddingBottom: mobile ? 72 : 100,
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: 0,
            opacity: 0.15,
            mixBlendMode: "soft-light",
            pointerEvents: "none",
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='g'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23g)'/%3E%3C/svg%3E")`,
            backgroundSize: "180px 180px",
          }}
        />

        <div
          ref={heroAnim.ref}
          className="mx-auto"
          style={{
            position: "relative",
            zIndex: 1,
            maxWidth: 820,
            paddingLeft: mobile ? 24 : 40,
            paddingRight: mobile ? 24 : 40,
            textAlign: "center",
            opacity: heroAnim.visible ? 1 : 0,
            transform: heroAnim.visible ? "translateY(0)" : "translateY(24px)",
            transition: "opacity 700ms ease, transform 700ms ease",
          }}
        >
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              padding: "6px 16px",
              borderRadius: 100,
              border: "1px solid rgba(255,255,255,0.12)",
              background: "rgba(255,255,255,0.06)",
              marginBottom: 28,
            }}
          >
            <span style={{ fontSize: 12, fontWeight: 600, color: C.sandText, letterSpacing: "0.06em", textTransform: "uppercase" }}>
              Privacy
            </span>
          </div>

          <h1
            style={{
              fontSize: mobile ? 30 : 44,
              fontWeight: 700,
              color: C.sandText,
              letterSpacing: "-0.03em",
              lineHeight: 1.15,
              marginBottom: 20,
            }}
          >
            Privacy Request
          </h1>

          <p
            style={{
              fontSize: mobile ? 15 : 18,
              color: C.sandMuted,
              lineHeight: 1.7,
              maxWidth: 560,
              margin: "0 auto 8px",
            }}
          >
            Submit a privacy inquiry or exercise your privacy rights under applicable law.
          </p>

          <p style={{ fontSize: 14, color: C.sandLight }}>
            RunPayway™ · Income Stability Score™
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
            paddingLeft: mobile ? 20 : 40,
            paddingRight: mobile ? 20 : 40,
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
              borderRadius: 20,
              border: "1px solid rgba(14,26,43,0.06)",
              padding: mobile ? "32px 24px" : "40px 40px",
              boxShadow: "0 8px 32px rgba(14,26,43,0.06)",
              opacity: formAnim.visible ? 1 : 0,
              transform: formAnim.visible ? "translateY(0)" : "translateY(24px)",
              transition: "opacity 700ms ease, transform 700ms ease",
            }}
          >
            <div style={{ fontSize: 12, fontWeight: 600, color: C.purple, letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 10 }}>
              Privacy Request Form
            </div>
            <div style={{ height: 1, background: "rgba(14,26,43,0.06)", marginBottom: 28 }} />

            {/* Full Name */}
            <div style={{ marginBottom: 20 }}>
              <label style={labelStyle}>Full Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your full name"
                style={inputStyle}
                onFocus={(e) => { e.currentTarget.style.borderColor = C.purple; }}
                onBlur={(e) => { e.currentTarget.style.borderColor = "rgba(14,26,43,0.12)"; }}
              />
            </div>

            {/* Email Address */}
            <div style={{ marginBottom: 20 }}>
              <label style={labelStyle}>Email Address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                style={inputStyle}
                onFocus={(e) => { e.currentTarget.style.borderColor = C.purple; }}
                onBlur={(e) => { e.currentTarget.style.borderColor = "rgba(14,26,43,0.12)"; }}
              />
            </div>

            {/* Request Type */}
            <div style={{ marginBottom: 20 }}>
              <label style={labelStyle}>Request Type</label>
              <select
                value={requestType}
                onChange={(e) => setRequestType(e.target.value)}
                style={{
                  ...inputStyle,
                  appearance: "none",
                  backgroundImage: `url("data:image/svg+xml,%3Csvg width='12' height='7' viewBox='0 0 12 7' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M1 1L6 6L11 1' stroke='%239CA3AF' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E")`,
                  backgroundRepeat: "no-repeat",
                  backgroundPosition: "right 16px center",
                  paddingRight: 44,
                  color: requestType ? C.navy : C.light,
                  cursor: "pointer",
                }}
                onFocus={(e) => { e.currentTarget.style.borderColor = C.purple; }}
                onBlur={(e) => { e.currentTarget.style.borderColor = "rgba(14,26,43,0.12)"; }}
              >
                <option value="" disabled>Select request type</option>
                <option value="access">Request Access to Personal Information</option>
                <option value="correction">Request Correction of Personal Information</option>
                <option value="deletion">Request Deletion of Personal Information</option>
                <option value="limitation">Request Limitation of Processing</option>
                <option value="inquiry">General Privacy Inquiry</option>
              </select>
            </div>

            {/* Record ID (optional) */}
            <div style={{ marginBottom: 20 }}>
              <label style={labelStyle}>
                Record ID <span style={{ fontWeight: 400, textTransform: "none", color: C.light }}>(optional)</span>
              </label>
              <input
                type="text"
                value={recordId}
                onChange={(e) => setRecordId(e.target.value)}
                placeholder="If related to a specific assessment"
                style={{ ...inputStyle, fontFamily: "monospace" }}
                onFocus={(e) => { e.currentTarget.style.borderColor = C.purple; }}
                onBlur={(e) => { e.currentTarget.style.borderColor = "rgba(14,26,43,0.12)"; }}
              />
            </div>

            {/* Message */}
            <div style={{ marginBottom: 28 }}>
              <label style={labelStyle}>Details</label>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Describe your privacy request or inquiry..."
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
                onBlur={(e) => { e.currentTarget.style.borderColor = "rgba(14,26,43,0.12)"; }}
              />
            </div>

            {/* Submit */}
            {submitted ? (
              <div
                style={{
                  padding: "24px 20px",
                  borderRadius: 12,
                  background: "rgba(75,63,174,0.06)",
                  border: "1px solid rgba(75,63,174,0.12)",
                  textAlign: "center",
                }}
              >
                <div style={{ fontSize: 20, marginBottom: 8 }}>&#10003;</div>
                <div style={{ fontSize: 15, fontWeight: 600, color: C.navy, marginBottom: 6 }}>
                  Privacy Request Initiated
                </div>
                <p style={{ fontSize: 13, color: C.muted, lineHeight: 1.7, margin: 0 }}>
                  Your email client should have opened with the pre-filled request.
                  If it did not, please submit your request through our{" "}
                  <Link href="/contact" style={{ color: C.purple, textDecoration: "none", fontWeight: 600 }}>
                    contact page
                  </Link>.
                </p>
              </div>
            ) : (
              <button
                onClick={() => {
                  const requestTypeLabels: Record<string, string> = {
                    access: "Request Access to Personal Information",
                    correction: "Request Correction of Personal Information",
                    deletion: "Request Deletion of Personal Information",
                    limitation: "Request Limitation of Processing",
                    inquiry: "General Privacy Inquiry",
                  };

                  const subject = encodeURIComponent(
                    `Privacy Request: ${requestTypeLabels[requestType] || requestType || "General Inquiry"}`
                  );

                  const bodyParts = [
                    `Full Name: ${name}`,
                    `Email: ${email}`,
                    `Request Type: ${requestTypeLabels[requestType] || requestType || "Not specified"}`,
                    recordId ? `Record ID: ${recordId}` : "",
                    "",
                    "Details:",
                    message || "(No additional details provided)",
                    "",
                    "---",
                    "Submitted via RunPayway™ Privacy Request Form",
                  ].filter(Boolean);

                  const bodyEncoded = encodeURIComponent(bodyParts.join("\n"));

                  window.location.href = `mailto:privacy@peoplestar.com?subject=${subject}&body=${bodyEncoded}`;
                  setSubmitted(true);
                }}
                onMouseEnter={() => canHover() && setBtnHovered(true)}
                onMouseLeave={() => setBtnHovered(false)}
                style={{
                  width: "100%",
                  height: 52,
                  borderRadius: 12,
                  background: btnHovered ? "#3D33A0" : C.purple,
                  color: C.white,
                  fontSize: 15,
                  fontWeight: 600,
                  letterSpacing: "-0.01em",
                  border: "none",
                  cursor: "pointer",
                  boxShadow: "0 6px 16px rgba(75,63,174,0.25)",
                  transition: "background 180ms ease, transform 180ms ease",
                  transform: btnHovered ? "translateY(-1px)" : "translateY(0)",
                }}
              >
                Submit Privacy Request
              </button>
            )}

            {/* Security */}
            <div style={{ height: 1, background: "rgba(14,26,43,0.06)", margin: "24px 0 16px" }} />
            <div style={{ display: "flex", flexDirection: "column", gap: 4, alignItems: "center" }}>
              <span style={{ fontSize: 12, color: C.light }}>Secure form submission</span>
              <span style={{ fontSize: 12, color: C.light }}>Encrypted data transmission</span>
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
            {/* Your Rights */}
            <div
              style={{
                background: C.white,
                borderRadius: 16,
                border: "1px solid rgba(14,26,43,0.06)",
                padding: mobile ? "24px 20px" : "28px 28px",
                boxShadow: "0 2px 8px rgba(14,26,43,0.04)",
              }}
            >
              <div style={{ fontSize: 12, fontWeight: 600, color: C.purple, letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 14 }}>
                Your Privacy Rights
              </div>
              <p style={{ fontSize: 14, color: C.muted, lineHeight: 1.75, marginBottom: 12 }}>
                Depending on your jurisdiction, you may have the right to:
              </p>
              <ul style={{ padding: 0, margin: "0 0 12px", listStyle: "none" }}>
                {[
                  "Request access to personal information",
                  "Request correction of inaccurate information",
                  "Request deletion of personal information",
                  "Request limitation of processing",
                ].map((item) => (
                  <li
                    key={item}
                    style={{
                      fontSize: 14,
                      color: C.muted,
                      lineHeight: 1.75,
                      paddingLeft: 18,
                      position: "relative",
                    }}
                  >
                    <span style={{ position: "absolute", left: 0, color: C.purple, fontSize: 10, lineHeight: "24px" }}>●</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            {/* Verification */}
            <div
              style={{
                background: C.white,
                borderRadius: 16,
                border: "1px solid rgba(14,26,43,0.06)",
                padding: mobile ? "24px 20px" : "28px 28px",
                boxShadow: "0 2px 8px rgba(14,26,43,0.04)",
              }}
            >
              <div style={{ fontSize: 12, fontWeight: 600, color: C.purple, letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 14 }}>
                Identity Verification
              </div>
              <p style={{ fontSize: 14, color: C.muted, lineHeight: 1.75, marginBottom: 10 }}>
                Identity verification may be required before processing your request.
              </p>
              <p style={{ fontSize: 14, color: C.muted, lineHeight: 1.75 }}>
                Verified requests will be responded to within applicable legal timeframes.
              </p>
            </div>

            {/* Privacy Policy link */}
            <div
              style={{
                background: C.white,
                borderRadius: 16,
                border: "1px solid rgba(14,26,43,0.06)",
                padding: mobile ? "24px 20px" : "28px 28px",
                boxShadow: "0 2px 8px rgba(14,26,43,0.04)",
              }}
            >
              <div style={{ fontSize: 12, fontWeight: 600, color: C.purple, letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 14 }}>
                Privacy Policy
              </div>
              <p style={{ fontSize: 14, color: C.muted, lineHeight: 1.75, marginBottom: 14 }}>
                For full details on how RunPayway™ collects, uses, and protects your information, review the Privacy Policy.
              </p>
              <Link
                href="/privacy-policy"
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
                onMouseEnter={(e) => { if (canHover()) e.currentTarget.style.background = "#EDECEA"; }}
                onMouseLeave={(e) => { e.currentTarget.style.background = C.sand; }}
              >
                Privacy Policy
                <span style={{ color: C.purple, fontSize: 14 }}>→</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/*  Brand bar                                                   */}
      {/* ============================================================ */}
      <div style={{ background: gradient, padding: "16px 0", textAlign: "center" }}>
        <span style={{ fontSize: 12, color: C.sandLight, letterSpacing: "0.02em" }}>
          Powered by RunPayway&#8482; Structural Stability Model
        </span>
      </div>
    </div>
  );
}
