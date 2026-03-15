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

export default function CreateAccountPage() {
  const mobile = useMobile();
  const heroAnim = useInView();
  const formAnim = useInView();
  const infoAnim = useInView();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [btnHovered, setBtnHovered] = useState(false);

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
              Annual Monitoring
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
            Create Your Account
          </h1>

          <p
            style={{
              fontSize: mobile ? 15 : 18,
              color: "rgba(255,255,255,0.65)",
              lineHeight: 1.7,
              maxWidth: 520,
              margin: "0 auto 8px",
            }}
          >
            Set up your Monitoring Portal account to access your three Income Stability Assessments.
          </p>

          <p style={{ fontSize: 14, color: "rgba(255,255,255,0.40)" }}>
            Structural Stability Model RP-1.0
          </p>
        </div>
      </section>

      {/* ============================================================ */}
      {/*  Create account form                                         */}
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
            maxWidth: 900,
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
              flex: 1,
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
            {/* Annual Monitoring badge */}
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
                padding: "5px 14px",
                borderRadius: 8,
                background: "rgba(75,63,174,0.08)",
                marginBottom: 20,
              }}
            >
              <span style={{ width: 8, height: 8, borderRadius: "50%", background: B.purple }} />
              <span style={{ fontSize: 11, fontWeight: 700, color: B.purple, letterSpacing: "0.04em", textTransform: "uppercase" }}>
                Annual Monitoring Subscriber
              </span>
            </div>

            <h2
              style={{
                fontSize: mobile ? 22 : 26,
                fontWeight: 700,
                color: B.navy,
                letterSpacing: "-0.02em",
                marginBottom: 12,
              }}
            >
              Create Account
            </h2>

            <p style={{ fontSize: 14, color: B.muted, lineHeight: 1.7, marginBottom: 28 }}>
              Create your account to access the Monitoring Portal. You can take your three assessments at any time within your 12-month subscription.
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
                Create Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Create a secure password"
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

            {/* Confirm Password */}
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
                Confirm Password
              </label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm your password"
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

            {/* Create Account button */}
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
              Create Account
            </button>

            {/* Sign in link */}
            <div style={{ textAlign: "center", marginTop: 20 }}>
              <span style={{ fontSize: 13, color: B.muted }}>Already have an account? </span>
              <Link
                href="/sign-in"
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
                Sign In
              </Link>
            </div>

            {/* Security line */}
            <div style={{ height: 1, background: "rgba(14,26,43,0.06)", margin: "24px 0 16px" }} />
            <div style={{ display: "flex", flexDirection: "column", gap: 4, alignItems: "center" }}>
              <span style={{ fontSize: 12, color: B.light }}>Secure authentication</span>
              <span style={{ fontSize: 12, color: B.light }}>Encrypted session management</span>
            </div>
          </div>

          {/* Right — What you get */}
          <div
            ref={infoAnim.ref}
            style={{
              flex: 1,
              opacity: infoAnim.visible ? 1 : 0,
              transform: infoAnim.visible ? "translateY(0)" : "translateY(24px)",
              transition: "opacity 700ms ease 140ms, transform 700ms ease 140ms",
            }}
          >
            <div style={{ fontSize: 12, fontWeight: 600, color: B.purple, letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 14 }}>
              Your Monitoring Plan Includes
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 0, marginBottom: 28 }}>
              {[
                ["3 Income Stability Assessments", "Take at any time within 12 months"],
                ["Monitoring Portal Access", "View your timeline and historical scores"],
                ["Full Diagnostic Reports", "Score, classification, and improvement path"],
                ["Score Verification", "Each assessment receives a unique verification ID"],
              ].map(([title, desc], i) => (
                <div
                  key={title}
                  style={{
                    display: "flex",
                    gap: 16,
                    padding: "18px 0",
                    borderBottom: i < 3 ? "1px solid rgba(14,26,43,0.06)" : "none",
                  }}
                >
                  <div
                    style={{
                      width: 36,
                      height: 36,
                      borderRadius: 10,
                      background: "rgba(75,63,174,0.08)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: 0,
                    }}
                  >
                    <span style={{ fontSize: 14, fontWeight: 700, color: B.purple }}>{i + 1}</span>
                  </div>
                  <div>
                    <div style={{ fontSize: 15, fontWeight: 600, color: B.navy, marginBottom: 2 }}>{title}</div>
                    <div style={{ fontSize: 13, color: B.muted, lineHeight: 1.6 }}>{desc}</div>
                  </div>
                </div>
              ))}
            </div>

            {/* Account notice */}
            <div
              style={{
                padding: mobile ? "20px 20px" : "24px 24px",
                borderRadius: 14,
                background: "#FFFFFF",
                border: "1px solid rgba(14,26,43,0.06)",
              }}
            >
              <div style={{ fontSize: 12, fontWeight: 600, color: B.purple, letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 10 }}>
                Account Access
              </div>
              <p style={{ fontSize: 14, color: B.muted, lineHeight: 1.7, marginBottom: 8 }}>
                Portal accounts are exclusively available to Annual Monitoring subscribers.
              </p>
              <p style={{ fontSize: 14, color: B.muted, lineHeight: 1.7 }}>
                Single Assessment customers do not need an account — reports are generated instantly after completing the diagnostic.
              </p>
            </div>
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
