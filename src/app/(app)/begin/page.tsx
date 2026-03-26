"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import logoWhite from "../../../../public/runpayway-logo-white.png";

/* ------------------------------------------------------------------ */
/*  Hooks                                                              */
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

/* ------------------------------------------------------------------ */
/*  Design tokens                                                      */
/* ------------------------------------------------------------------ */

const B = {
  navy: "#0E1A2B",
  purple: "#4B3FAE",
  teal: "#1F6D7A",
  cream: "#F4F1EA",
  gradient: "linear-gradient(135deg, #0E1A2B 0%, #1A1540 40%, #4B3FAE 70%, #1F6D7A 100%)",
};

const DISPLAY_FONT = "'DM Serif Display', Georgia, serif";

/* ------------------------------------------------------------------ */
/*  Page                                                               */
/* ------------------------------------------------------------------ */

export default function BeginPage() {
  const mobile = useMobile();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
    // Create free session so diagnostic-portal allows entry
    const existing = sessionStorage.getItem("rp_purchase_session");
    if (!existing) {
      sessionStorage.setItem("rp_purchase_session", JSON.stringify({ plan_key: "free", status: "paid" }));
    }
    // Mark as free plan for upgrade detection
    localStorage.setItem("rp_previous_plan", "free");
    requestAnimationFrame(() => setVisible(true));
  }, []);

  const steps = [
    { num: "1", title: "Set up your profile", desc: "Your industry, income model, and operating structure." },
    { num: "2", title: "Take the assessment", desc: "A short diagnostic about how your income is structured today." },
    { num: "3", title: "Get your score", desc: "Instantly, on screen, free." },
  ];

  return (
    <>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display&display=swap');`}</style>
      <div
        style={{
          position: "fixed",
          inset: 0,
          background: B.gradient,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          overflow: "auto",
        }}
      >
        {/* Radial glow */}
        <div style={{ position: "absolute", top: "30%", left: "50%", width: 800, height: 800, transform: "translate(-50%, -50%)", background: "radial-gradient(circle, rgba(75,63,174,0.20) 0%, transparent 70%)", pointerEvents: "none" }} />

        <div
          style={{
            position: "relative",
            zIndex: 1,
            width: "100%",
            maxWidth: 520,
            padding: mobile ? "60px 24px" : "0 24px",
            textAlign: "center",
            opacity: visible ? 1 : 0,
            transform: visible ? "translateY(0)" : "translateY(20px)",
            transition: "opacity 0.7s ease-out, transform 0.7s ease-out",
          }}
        >
          {/* Logo */}
          <Image
            src={logoWhite}
            alt="RunPayway&#8482;"
            width={mobile ? 120 : 140}
            height={16}
            style={{ height: "auto", marginBottom: mobile ? 40 : 48 }}
          />

          {/* Overline */}
          <div style={{ fontSize: 13, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase" as const, color: B.teal, marginBottom: 20 }}>
            Income Stability Score&#8482;
          </div>

          {/* Headline */}
          <h1
            style={{
              fontSize: mobile ? 28 : 36,
              fontFamily: DISPLAY_FONT,
              fontWeight: 400,
              letterSpacing: "-0.02em",
              lineHeight: 1.15,
              color: B.cream,
              marginBottom: 40,
            }}
          >
            You are about to take a structural income assessment.
          </h1>

          {/* Steps */}
          <div style={{ display: "flex", flexDirection: "column", gap: 0, marginBottom: 40, textAlign: "left" }}>
            {steps.map((step, i) => (
              <div
                key={step.num}
                style={{
                  display: "flex",
                  gap: 16,
                  alignItems: "flex-start",
                  padding: "20px 0",
                  borderTop: i === 0 ? "1px solid rgba(244,241,234,0.08)" : "none",
                  borderBottom: "1px solid rgba(244,241,234,0.08)",
                  opacity: visible ? 1 : 0,
                  transform: visible ? "translateY(0)" : "translateY(12px)",
                  transition: `opacity 0.5s ease-out ${300 + i * 150}ms, transform 0.5s ease-out ${300 + i * 150}ms`,
                }}
              >
                <div
                  style={{
                    width: 32,
                    height: 32,
                    borderRadius: "50%",
                    backgroundColor: "rgba(244,241,234,0.06)",
                    border: "1px solid rgba(244,241,234,0.10)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                  }}
                >
                  <span style={{ fontSize: 13, fontWeight: 700, color: B.cream }}>{step.num}</span>
                </div>
                <div>
                  <div style={{ fontSize: 16, fontWeight: 600, color: B.cream, marginBottom: 4 }}>{step.title}</div>
                  <div style={{ fontSize: 14, color: "rgba(244,241,234,0.50)", lineHeight: 1.65 }}>{step.desc}</div>
                </div>
              </div>
            ))}
          </div>

          {/* CTA */}
          <Link
            href="/diagnostic-portal"
            style={{
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              width: "100%",
              maxWidth: 360,
              height: mobile ? 52 : 56,
              borderRadius: 12,
              background: "linear-gradient(135deg, #F4F1EA 0%, #EDECEA 100%)",
              color: B.navy,
              fontSize: 16,
              fontWeight: 600,
              textDecoration: "none",
              letterSpacing: "-0.01em",
              boxShadow: "0 12px 32px rgba(0,0,0,0.25)",
              transition: "transform 200ms ease, box-shadow 200ms ease",
            }}
            onMouseEnter={(e) => { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = "0 16px 40px rgba(0,0,0,0.30)"; }}
            onMouseLeave={(e) => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "0 12px 32px rgba(0,0,0,0.25)"; }}
          >
            Begin Assessment
          </Link>

          {/* Trust line */}
          <div style={{ marginTop: 24, display: "flex", flexWrap: "wrap", justifyContent: "center", gap: mobile ? 12 : 20 }}>
            {["No bank connection", "No credit pull", "Private by default"].map((badge) => (
              <span key={badge} style={{ fontSize: 13, color: "rgba(244,241,234,0.35)", letterSpacing: "0.02em" }}>
                {badge}
              </span>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
