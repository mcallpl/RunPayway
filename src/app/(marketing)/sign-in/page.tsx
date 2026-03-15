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

export default function SignInPage() {
  const mobile = useMobile();
  const heroAnim = useInView();
  const formAnim = useInView();
  const monitorAnim = useInView();
  const timelineAnim = useInView();
  const singleAnim = useInView();
  const noticeAnim = useInView();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [btnHovered, setBtnHovered] = useState(false);
  const [forgotHovered, setForgotHovered] = useState(false);

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
              Monitoring Portal
            </span>
          </div>

          <h1
            style={{
              fontSize: mobile ? 30 : 44,
              fontWeight: 700,
              color: "#FFFFFF",
              letterSpacing: "-0.03em",
              lineHeight: 1.15,
              marginBottom: 20,
            }}
          >
            RunPayway™ Monitoring Portal
          </h1>

          <p
            style={{
              fontSize: mobile ? 15 : 18,
              color: "rgba(255,255,255,0.65)",
              lineHeight: 1.7,
              maxWidth: 480,
              margin: "0 auto 8px",
            }}
          >
            Income Stability Score™
          </p>

          <p style={{ fontSize: 14, color: "rgba(255,255,255,0.40)" }}>
            Structural Stability Model RP-1.0
          </p>
        </div>
      </section>

      {/* ============================================================ */}
      {/*  Sign-in form                                                */}
      {/* ============================================================ */}
      <section
        style={{
          paddingTop: mobile ? 56 : 80,
          paddingBottom: mobile ? 56 : 80,
          background: B.sand,
        }}
      >
        <div
          ref={formAnim.ref}
          className="mx-auto"
          style={{
            maxWidth: 480,
            paddingLeft: mobile ? 20 : 40,
            paddingRight: mobile ? 20 : 40,
            opacity: formAnim.visible ? 1 : 0,
            transform: formAnim.visible ? "translateY(0)" : "translateY(24px)",
            transition: "opacity 700ms ease, transform 700ms ease",
          }}
        >
          <div
            style={{
              background: "#FFFFFF",
              borderRadius: 20,
              border: "1px solid rgba(14,26,43,0.06)",
              padding: mobile ? "32px 24px" : "40px 40px",
              boxShadow: "0 8px 32px rgba(14,26,43,0.06)",
            }}
          >
            <h2
              style={{
                fontSize: mobile ? 22 : 26,
                fontWeight: 700,
                color: B.navy,
                letterSpacing: "-0.02em",
                marginBottom: 12,
              }}
            >
              Sign In
            </h2>

            <p style={{ fontSize: 14, color: B.muted, lineHeight: 1.7, marginBottom: 8 }}>
              This portal is available to Annual Monitoring subscribers.
            </p>
            <p style={{ fontSize: 14, color: B.muted, lineHeight: 1.7, marginBottom: 28 }}>
              Sign in to access your monitoring timeline and historical Income Stability Assessments.
            </p>

            {/* Email */}
            <div style={{ marginBottom: 20 }}>
              <label
                style={{
                  display: "block",
                  fontSize: 12,
                  fontWeight: 600,
                  color: B.navy,
                  letterSpacing: "0.04em",
                  textTransform: "uppercase",
                  marginBottom: 8,
                }}
              >
                Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                style={{
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
                }}
                onFocus={(e) => { e.currentTarget.style.borderColor = B.purple; }}
                onBlur={(e) => { e.currentTarget.style.borderColor = "rgba(14,26,43,0.12)"; }}
              />
            </div>

            {/* Password */}
            <div style={{ marginBottom: 28 }}>
              <label
                style={{
                  display: "block",
                  fontSize: 12,
                  fontWeight: 600,
                  color: B.navy,
                  letterSpacing: "0.04em",
                  textTransform: "uppercase",
                  marginBottom: 8,
                }}
              >
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                style={{
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
                }}
                onFocus={(e) => { e.currentTarget.style.borderColor = B.purple; }}
                onBlur={(e) => { e.currentTarget.style.borderColor = "rgba(14,26,43,0.12)"; }}
              />
            </div>

            {/* Sign In button */}
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
              Sign In
            </button>

            {/* Forgot password */}
            <div style={{ textAlign: "center", marginTop: 16 }}>
              <button
                onMouseEnter={() => canHover() && setForgotHovered(true)}
                onMouseLeave={() => setForgotHovered(false)}
                style={{
                  background: "none",
                  border: "none",
                  fontSize: 13,
                  fontWeight: 500,
                  color: forgotHovered ? B.purple : B.muted,
                  cursor: "pointer",
                  transition: "color 180ms ease",
                  padding: 0,
                }}
              >
                Forgot Password
              </button>
            </div>

            {/* Don't have an account */}
            <div style={{ textAlign: "center", marginTop: 20 }}>
              <span style={{ fontSize: 13, color: B.muted }}>Don&apos;t have an account? </span>
              <Link
                href="/pricing"
                style={{
                  fontSize: 13,
                  fontWeight: 600,
                  color: B.purple,
                  textDecoration: "none",
                  borderBottom: "1px solid rgba(75,63,174,0.30)",
                  transition: "border-color 180ms ease",
                }}
                onMouseEnter={(e) => { e.currentTarget.style.borderColor = B.purple; }}
                onMouseLeave={(e) => { e.currentTarget.style.borderColor = "rgba(75,63,174,0.30)"; }}
              >
                Get Annual Monitoring
              </Link>
            </div>

            {/* Security line */}
            <div style={{ height: 1, background: "rgba(14,26,43,0.06)", margin: "24px 0 16px" }} />
            <div style={{ display: "flex", flexDirection: "column", gap: 4, alignItems: "center" }}>
              <span style={{ fontSize: 12, color: B.light }}>Secure authentication</span>
              <span style={{ fontSize: 12, color: B.light }}>Encrypted session management</span>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/*  Annual Monitoring upsell                                    */}
      {/* ============================================================ */}
      <section
        style={{
          paddingTop: mobile ? 56 : 80,
          paddingBottom: mobile ? 56 : 80,
          background: "#FFFFFF",
        }}
      >
        <div
          ref={monitorAnim.ref}
          className="mx-auto"
          style={{
            maxWidth: 860,
            paddingLeft: mobile ? 20 : 40,
            paddingRight: mobile ? 20 : 40,
            display: "flex",
            flexDirection: mobile ? "column" : "row",
            gap: mobile ? 32 : 40,
            alignItems: "start",
            opacity: monitorAnim.visible ? 1 : 0,
            transform: monitorAnim.visible ? "translateY(0)" : "translateY(24px)",
            transition: "opacity 700ms ease, transform 700ms ease",
          }}
        >
          {/* Annual monitoring card */}
          <div
            style={{
              flex: 1,
              background: "#FFFFFF",
              borderRadius: 20,
              border: "1px solid rgba(75,63,174,0.20)",
              padding: mobile ? "32px 24px" : "36px 36px",
              boxShadow: "0 8px 24px rgba(75,63,174,0.08)",
              position: "relative",
            }}
          >
            {/* Recommended badge */}
            <div
              style={{
                position: "absolute",
                top: -14,
                left: mobile ? 24 : 36,
                padding: "5px 18px",
                borderRadius: 100,
                background: B.purple,
                color: "#FFFFFF",
                fontSize: 11,
                fontWeight: 700,
                letterSpacing: "0.06em",
                textTransform: "uppercase",
                whiteSpace: "nowrap",
              }}
            >
              Annual Monitoring
            </div>

            <div style={{ display: "flex", alignItems: "baseline", gap: 8, marginTop: 8, marginBottom: 4 }}>
              <span style={{ fontSize: mobile ? 44 : 52, fontWeight: 700, color: B.navy, lineHeight: 1, letterSpacing: "-0.03em" }}>$99</span>
            </div>
            <div style={{ fontSize: 14, fontWeight: 600, color: B.purple, marginBottom: 16 }}>
              $33 per assessment
            </div>

            <p style={{ fontSize: 15, color: B.muted, lineHeight: 1.75, marginBottom: 20 }}>
              Three assessments that can be taken at any time within one year, measuring how the structural stability of your income evolves over time.
            </p>

            <div style={{ fontSize: 12, color: B.light, marginBottom: 20 }}>
              Secure checkout via Stripe
            </div>

            <Link
              href="/checkout-placeholder?plan=monitoring"
              className="inline-flex items-center justify-center font-semibold"
              style={{
                width: "100%",
                height: 52,
                borderRadius: 12,
                background: B.purple,
                color: "#FFFFFF",
                fontSize: 15,
                letterSpacing: "-0.01em",
                border: "none",
                boxShadow: "0 6px 16px rgba(75,63,174,0.25)",
                transition: "background 180ms ease, transform 180ms ease",
              }}
              onMouseEnter={(e) => {
                if (!canHover()) return;
                e.currentTarget.style.background = "#3D33A0";
                e.currentTarget.style.transform = "translateY(-1px)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = B.purple;
                e.currentTarget.style.transform = "translateY(0)";
              }}
            >
              Start Monitoring →
            </Link>
          </div>

          {/* Timeline */}
          <div
            ref={timelineAnim.ref}
            style={{
              flex: 1,
              opacity: timelineAnim.visible ? 1 : 0,
              transform: timelineAnim.visible ? "translateY(0)" : "translateY(24px)",
              transition: "opacity 700ms ease 140ms, transform 700ms ease 140ms",
            }}
          >
            <div style={{ fontSize: 12, fontWeight: 600, color: B.purple, letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 14 }}>
              Annual Monitoring Timeline
            </div>
            <p style={{ fontSize: 15, color: B.muted, lineHeight: 1.75, marginBottom: 24 }}>
              Each monitoring plan includes three assessments that can be taken at any time within one year.
            </p>

            <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
              {[
                ["Assessment 1", "Any time"],
                ["Assessment 2", "Any time"],
                ["Assessment 3", "Any time"],
              ].map(([label, month], i) => (
                <div
                  key={label}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 16,
                    padding: "16px 0",
                    borderBottom: i < 2 ? "1px solid rgba(14,26,43,0.06)" : "none",
                  }}
                >
                  <div
                    style={{
                      width: 36,
                      height: 36,
                      borderRadius: 10,
                      background: i === 0 ? B.navy : "rgba(14,26,43,0.06)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: 0,
                    }}
                  >
                    <span style={{ fontSize: 14, fontWeight: 700, color: i === 0 ? "#FFFFFF" : B.navy }}>{i + 1}</span>
                  </div>
                  <div>
                    <div style={{ fontSize: 14, fontWeight: 600, color: B.navy }}>{label}</div>
                    <div style={{ fontSize: 12, color: B.light }}>{month}</div>
                  </div>
                </div>
              ))}
            </div>

            <p style={{ fontSize: 13, color: B.light, marginTop: 16 }}>
              All three assessments must be used within 12 months of purchase. Each measures the structural stability of income at the time it is issued.
            </p>
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/*  Single Assessment + Portal Notice                          */}
      {/* ============================================================ */}
      <section
        style={{
          paddingTop: mobile ? 56 : 80,
          paddingBottom: mobile ? 56 : 80,
          background: B.sand,
        }}
      >
        <div
          className="mx-auto"
          style={{
            maxWidth: 860,
            paddingLeft: mobile ? 20 : 40,
            paddingRight: mobile ? 20 : 40,
            display: "grid",
            gridTemplateColumns: mobile ? "1fr" : "1fr 1fr",
            gap: mobile ? 24 : 28,
          }}
        >
          {/* Single Assessment */}
          <div
            ref={singleAnim.ref}
            style={{
              background: "#FFFFFF",
              borderRadius: 16,
              border: "1px solid rgba(14,26,43,0.06)",
              padding: mobile ? "28px 24px" : "36px 36px",
              boxShadow: "0 2px 8px rgba(14,26,43,0.04)",
              opacity: singleAnim.visible ? 1 : 0,
              transform: singleAnim.visible ? "translateY(0)" : "translateY(20px)",
              transition: "opacity 600ms ease, transform 600ms ease",
            }}
          >
            <div style={{ fontSize: 12, fontWeight: 600, color: B.purple, letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 14 }}>
              Single Assessment Customers
            </div>
            <p style={{ fontSize: 15, color: B.muted, lineHeight: 1.75, marginBottom: 12 }}>
              Single Assessment reports are generated immediately after completing the diagnostic and do not require an account login.
            </p>
            <p style={{ fontSize: 15, color: B.muted, lineHeight: 1.75, marginBottom: 24 }}>
              To generate a new assessment, simply purchase another diagnostic.
            </p>
            <Link
              href="/checkout-placeholder?plan=single"
              className="inline-flex items-center justify-center font-semibold"
              style={{
                height: 44,
                paddingLeft: 22,
                paddingRight: 22,
                borderRadius: 10,
                background: B.navy,
                color: "#FFFFFF",
                fontSize: 14,
                letterSpacing: "-0.01em",
                border: "none",
                boxShadow: "0 4px 12px rgba(14,26,43,0.15)",
                transition: "background 180ms ease, transform 180ms ease",
              }}
              onMouseEnter={(e) => {
                if (!canHover()) return;
                e.currentTarget.style.background = "#1a2a40";
                e.currentTarget.style.transform = "translateY(-1px)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = B.navy;
                e.currentTarget.style.transform = "translateY(0)";
              }}
            >
              Get Assessment →
            </Link>
          </div>

          {/* Portal Access Notice */}
          <div
            ref={noticeAnim.ref}
            style={{
              background: "#FFFFFF",
              borderRadius: 16,
              border: "1px solid rgba(14,26,43,0.06)",
              padding: mobile ? "28px 24px" : "36px 36px",
              boxShadow: "0 2px 8px rgba(14,26,43,0.04)",
              opacity: noticeAnim.visible ? 1 : 0,
              transform: noticeAnim.visible ? "translateY(0)" : "translateY(20px)",
              transition: "opacity 600ms ease 100ms, transform 600ms ease 100ms",
            }}
          >
            <div style={{ fontSize: 12, fontWeight: 600, color: B.purple, letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 14 }}>
              Portal Access Notice
            </div>
            <p style={{ fontSize: 15, color: B.muted, lineHeight: 1.75, marginBottom: 12 }}>
              The RunPayway™ Monitoring Portal is designed for subscribers who are tracking structural income stability over time.
            </p>
            <p style={{ fontSize: 15, color: B.muted, lineHeight: 1.75 }}>
              Assessments issued through the portal are generated using fixed scoring criteria defined under Structural Stability Model RP-1.0.
            </p>
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/*  Model reference bar                                         */}
      {/* ============================================================ */}
      <div
        style={{
          background: B.gradient,
          padding: "16px 0",
          textAlign: "center",
        }}
      >
        <span style={{ fontSize: 12, color: "rgba(255,255,255,0.35)", letterSpacing: "0.02em" }}>
          Powered by Structural Stability Model RP-1.0
        </span>
      </div>
    </div>
  );
}
