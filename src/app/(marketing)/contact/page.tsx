"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";

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

const canHover = () =>
  typeof window !== "undefined" && window.matchMedia("(hover: hover)").matches;

/* ------------------------------------------------------------------ */
/*  Brand tokens                                                       */
/* ------------------------------------------------------------------ */

const B = {
  navy: "#0E1A2B",
  purple: "#4B3FAE",
  teal: "#1F6D7A",
  sand: "#F7F6F3",
  sandDk: "#EDECEA",
  muted: "#6B7280",
  light: "#9CA3AF",
  gradient: "linear-gradient(135deg, #0E1A2B 0%, #4B3FAE 50%, #1F6D7A 100%)",
};

/* ------------------------------------------------------------------ */
/*  Page                                                               */
/* ------------------------------------------------------------------ */

export default function ContactPage() {
  const mobile = useMobile();
  const heroAnim = useInView();
  const formAnim = useInView();
  const sideAnim = useInView();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [btnHovered, setBtnHovered] = useState(false);

  const inputStyle: React.CSSProperties = {
    width: "100%",
    height: 48,
    padding: "0 16px",
    borderRadius: 10,
    border: "1px solid rgba(14,26,43,0.12)",
    background: B.sand,
    fontSize: 14,
    color: B.navy,
    outline: "none",
    transition: "border-color 180ms ease",
    boxSizing: "border-box",
  };

  const labelStyle: React.CSSProperties = {
    display: "block",
    fontSize: 12,
    fontWeight: 600,
    color: B.navy,
    letterSpacing: "0.04em",
    textTransform: "uppercase",
    marginBottom: 8,
  };

  return (
    <div style={{ background: "#FFFFFF" }}>
      {/* ============================================================ */}
      {/*  Hero                                                        */}
      {/* ============================================================ */}
      <section
        style={{
          position: "relative",
          overflow: "hidden",
          background: B.gradient,
          paddingTop: mobile ? 72 : 100,
          paddingBottom: mobile ? 72 : 100,
        }}
      >
        {/* Grain overlay */}
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
            <span style={{ fontSize: 12, fontWeight: 600, color: "rgba(255,255,255,0.70)", letterSpacing: "0.06em", textTransform: "uppercase" }}>
              Contact
            </span>
          </div>

          <h1
            style={{
              fontSize: mobile ? 30 : 44,
              fontWeight: 700,
              color: "#FFFFFF",
              letterSpacing: "-0.03em",
              lineHeight: 1.15,
              marginBottom: 24,
            }}
          >
            Contact RunPayway™
          </h1>

          <p
            style={{
              fontSize: mobile ? 15 : 18,
              color: "rgba(255,255,255,0.65)",
              lineHeight: 1.7,
              maxWidth: 600,
              margin: "0 auto 16px",
            }}
          >
            For questions regarding the Income Stability Score™, assessment reports, verification records, or platform information, please submit the inquiry form below.
          </p>

          <p style={{ fontSize: mobile ? 14 : 15, color: "rgba(255,255,255,0.45)", lineHeight: 1.7, maxWidth: 480, margin: "0 auto 8px" }}>
            RunPayway™ inquiries are reviewed by the platform team.
          </p>

          <p style={{ fontSize: 14, color: "rgba(255,255,255,0.40)" }}>
            Responses are typically provided within two business days.
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
          background: B.sand,
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
              background: "#FFFFFF",
              borderRadius: 20,
              border: "1px solid rgba(14,26,43,0.06)",
              padding: mobile ? "32px 24px" : "40px 40px",
              boxShadow: "0 8px 32px rgba(14,26,43,0.06)",
              opacity: formAnim.visible ? 1 : 0,
              transform: formAnim.visible ? "translateY(0)" : "translateY(24px)",
              transition: "opacity 700ms ease, transform 700ms ease",
            }}
          >
            <div style={{ fontSize: 12, fontWeight: 600, color: B.purple, letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 10 }}>
              Submit an Inquiry
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
                onFocus={(e) => { e.currentTarget.style.borderColor = B.purple; }}
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
                onFocus={(e) => { e.currentTarget.style.borderColor = B.purple; }}
                onBlur={(e) => { e.currentTarget.style.borderColor = "rgba(14,26,43,0.12)"; }}
              />
            </div>

            {/* Subject */}
            <div style={{ marginBottom: 20 }}>
              <label style={labelStyle}>Subject</label>
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
                  color: subject ? B.navy : B.light,
                  cursor: "pointer",
                }}
                onFocus={(e) => { e.currentTarget.style.borderColor = B.purple; }}
                onBlur={(e) => { e.currentTarget.style.borderColor = "rgba(14,26,43,0.12)"; }}
              >
                <option value="" disabled>Select a subject</option>
                <option value="general">General Inquiry</option>
                <option value="assessment">Assessment Question</option>
                <option value="verification">Verification Question</option>
                <option value="technical">Technical Issue</option>
                <option value="partnership">Partnership Inquiry</option>
                <option value="other">Other</option>
              </select>
            </div>

            {/* Message */}
            <div style={{ marginBottom: 28 }}>
              <label style={labelStyle}>Message</label>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Describe your question or inquiry..."
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
                onFocus={(e) => { e.currentTarget.style.borderColor = B.purple; }}
                onBlur={(e) => { e.currentTarget.style.borderColor = "rgba(14,26,43,0.12)"; }}
              />
            </div>

            {/* Submit button */}
            <button
              onMouseEnter={() => canHover() && setBtnHovered(true)}
              onMouseLeave={() => setBtnHovered(false)}
              style={{
                width: "100%",
                height: 52,
                borderRadius: 12,
                background: btnHovered ? "#3D33A0" : B.purple,
                color: "#FFFFFF",
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
              Submit Inquiry
            </button>

            {/* Security line */}
            <div style={{ height: 1, background: "rgba(14,26,43,0.06)", margin: "24px 0 16px" }} />
            <div style={{ display: "flex", flexDirection: "column", gap: 4, alignItems: "center" }}>
              <span style={{ fontSize: 12, color: B.light }}>Secure form submission</span>
              <span style={{ fontSize: 12, color: B.light }}>Encrypted data transmission</span>
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
                background: "#FFFFFF",
                borderRadius: 16,
                border: "1px solid rgba(14,26,43,0.06)",
                padding: mobile ? "24px 24px" : "28px 28px",
                boxShadow: "0 2px 8px rgba(14,26,43,0.04)",
              }}
            >
              <div style={{ fontSize: 12, fontWeight: 600, color: B.purple, letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 14 }}>
                Response Expectations
              </div>
              <p style={{ fontSize: 14, color: B.muted, lineHeight: 1.75, marginBottom: 10 }}>
                All inquiries are reviewed by the RunPayway™ team.
              </p>
              <p style={{ fontSize: 14, color: B.muted, lineHeight: 1.75, marginBottom: 10 }}>
                Responses are typically provided within two business days.
              </p>
              <p style={{ fontSize: 14, color: B.muted, lineHeight: 1.75 }}>
                If your question relates to a specific assessment, please include your Record ID if available.
              </p>
            </div>

            {/* Alternative Resources */}
            <div
              style={{
                background: "#FFFFFF",
                borderRadius: 16,
                border: "1px solid rgba(14,26,43,0.06)",
                padding: mobile ? "24px 24px" : "28px 28px",
                boxShadow: "0 2px 8px rgba(14,26,43,0.04)",
              }}
            >
              <div style={{ fontSize: 12, fontWeight: 600, color: B.purple, letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 14 }}>
                Alternative Resources
              </div>
              <p style={{ fontSize: 14, color: B.muted, lineHeight: 1.75, marginBottom: 16 }}>
                Many common questions are answered in the following resources:
              </p>
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {[
                  { href: "/faq", label: "FAQ" },
                  { href: "/methodology", label: "Methodology" },
                  { href: "/verify", label: "Verify a Score" },
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
                      background: B.sand,
                      fontSize: 14,
                      fontWeight: 600,
                      color: B.navy,
                      textDecoration: "none",
                      transition: "background 180ms ease",
                    }}
                    onMouseEnter={(e) => { if (canHover()) e.currentTarget.style.background = B.sandDk; }}
                    onMouseLeave={(e) => { e.currentTarget.style.background = B.sand; }}
                  >
                    {link.label}
                    <span style={{ color: B.purple, fontSize: 14 }}>→</span>
                  </Link>
                ))}
              </div>
              <p style={{ fontSize: 13, color: B.light, lineHeight: 1.7, marginTop: 14 }}>
                These sections provide detailed information about the Income Stability Score™, the RunPayway assessment process, and assessment verification.
              </p>
            </div>

            {/* Security Notice */}
            <div
              style={{
                background: "#FFFFFF",
                borderRadius: 16,
                border: "1px solid rgba(14,26,43,0.06)",
                padding: mobile ? "24px 24px" : "28px 28px",
                boxShadow: "0 2px 8px rgba(14,26,43,0.04)",
              }}
            >
              <div style={{ fontSize: 12, fontWeight: 600, color: B.purple, letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 14 }}>
                Security Notice
              </div>
              <p style={{ fontSize: 14, color: B.muted, lineHeight: 1.75, marginBottom: 10 }}>
                Do not include sensitive financial information in your message.
              </p>
              <p style={{ fontSize: 14, color: B.muted, lineHeight: 1.75 }}>
                The contact form is intended for general platform inquiries and support questions.
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
          position: "relative",
          overflow: "hidden",
          background: B.gradient,
          paddingTop: mobile ? 56 : 72,
          paddingBottom: mobile ? 56 : 72,
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

        {[180, 320, 480].map((size, i) => (
          <div
            key={size}
            style={{
              position: "absolute",
              top: "50%",
              left: "50%",
              width: size,
              height: size,
              borderRadius: "50%",
              transform: "translate(-50%, -50%)",
              border: `1px solid rgba(255,255,255,${0.06 - i * 0.015})`,
              pointerEvents: "none",
            }}
          />
        ))}

        <div
          className="mx-auto"
          style={{
            position: "relative",
            zIndex: 1,
            maxWidth: 600,
            paddingLeft: mobile ? 24 : 40,
            paddingRight: mobile ? 24 : 40,
            textAlign: "center",
          }}
        >
          <div style={{ fontSize: mobile ? 22 : 28, fontWeight: 700, color: "#FFFFFF", letterSpacing: "-0.02em", marginBottom: 8 }}>
            RunPayway™
          </div>
          <div style={{ fontSize: mobile ? 15 : 17, color: "rgba(255,255,255,0.60)", marginBottom: 24 }}>
            Income Stability Score™
          </div>
          <p style={{ fontSize: 12, color: "rgba(255,255,255,0.30)", letterSpacing: "0.02em" }}>
            Powered by Structural Stability Model RP-1.0
          </p>
        </div>
      </section>
    </div>
  );
}
