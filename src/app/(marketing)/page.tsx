"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";

/* Guard for hover-capable devices — prevents stuck states on iOS */
const canHover = () => typeof window !== "undefined" && window.matchMedia("(hover: hover)").matches;

/* Shared hook: triggers visibility when element enters viewport.
   Checks on mount so elements already in view appear immediately. */
function useInView(threshold = 0) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    /* Already in view on mount? Fire immediately */
    const rect = el.getBoundingClientRect();
    if (rect.top < window.innerHeight + 50 && rect.bottom > 0) {
      setVisible(true);
      return;
    }
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setVisible(true); obs.disconnect(); } },
      { threshold },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);

  return { ref, visible };
}

/* Bidirectional variant — does NOT disconnect, so visible toggles on/off as you scroll */
function useInViewBidi(threshold = 0.1) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => setVisible(entry.isIntersecting),
      { threshold },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);

  return { ref, visible };
}

/* Runtime mobile detection — bypasses CSS entirely */
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

/* ────────────────────────────────────────────────────────────────────
   DESIGN TOKENS — Enterprise spacing scale (8px base unit)
   Every value is deliberate. Nothing is arbitrary.
   ──────────────────────────────────────────────────────────────────── */
const S = {
  /* Section vertical rhythm — consistent everywhere */
  sectionY:     { desktop: 160, mobile: 88 },
  sectionYsm:   { desktop: 120, mobile: 72 },
  transitionY:  { desktop: 72, mobile: 48 },
  disclaimerY:  { desktop: 64, mobile: 48 },

  /* Container */
  maxW:         1060,
  padX:         { desktop: 48, mobile: 24 },

  /* Typography rhythm */
  h1mb:         28,
  h2mb:         24,
  subtextMb:    56,
  paraMb:       24,
  labelMb:      16,

  /* Component spacing */
  cardPad:      { desktop: 36, mobile: 24 },
  cardRadius:   16,
  panelRadius:  20,
  gridGap:      24,
  gridGapSm:    16,

  /* CTA buttons */
  ctaH:         56,
  ctaHsm:       46,
  ctaPadX:      32,
  ctaRadius:    14,

  /* Line heights */
  lhHeading:    1.08,
  lhBody:       1.75,
  lhDense:      1.5,

  /* Letter spacing */
  lsHeading:    "-0.025em",
  lsHero:       "-0.035em",
  lsLabel:      "0.14em",
};


/* ================================================================== */
/* SECTION 1: HERO                                                     */
/* ================================================================== */
function HeroSection() {
  const { ref, visible } = useInView();
  const mobile = useMobile();

  return (
    <section
      ref={ref}
      aria-label="Hero"
      className="relative overflow-hidden"
      style={{ background: B.gradient }}
    >
      {/* Ambient glows */}
      <div
        className="absolute pointer-events-none"
        style={{
          width: 900, height: 900, borderRadius: "50%",
          top: "-30%", right: "-15%",
          background: "radial-gradient(circle, rgba(75,63,174,0.18) 0%, transparent 65%)",
        }}
      />
      <div
        className="absolute pointer-events-none"
        style={{
          width: 700, height: 700, borderRadius: "50%",
          bottom: "-20%", left: "-10%",
          background: "radial-gradient(circle, rgba(31,109,122,0.12) 0%, transparent 60%)",
        }}
      />

      <div
        className="relative mx-auto"
        style={{
          maxWidth: S.maxW,
          paddingTop: mobile ? S.sectionY.mobile + 24 : S.sectionY.desktop + 40,
          paddingBottom: mobile ? S.sectionY.mobile : S.sectionY.desktop,
          paddingLeft: mobile ? S.padX.mobile : S.padX.desktop,
          paddingRight: mobile ? S.padX.mobile : S.padX.desktop,
          textAlign: "center",
        }}
      >
        {/* Eyebrow */}
        <div
          className="font-medium uppercase text-[11px] md:text-[12px]"
          style={{
            letterSpacing: S.lsLabel,
            color: "rgba(31,109,122,0.85)",
            marginBottom: S.h2mb,
            opacity: visible ? 1 : 0,
            transform: visible ? "translateY(0)" : "translateY(8px)",
            transition: "opacity 500ms ease-out, transform 500ms ease-out",
          }}
        >
          Income Stability Score&#8482;
        </div>

        {/* Headline */}
        <h1
          className="font-semibold"
          style={{
            fontSize: mobile ? 32 : 52,
            color: "#F4F1EA",
            lineHeight: S.lhHeading,
            letterSpacing: S.lsHero,
            marginBottom: S.h1mb,
            maxWidth: mobile ? undefined : 640,
            marginLeft: "auto",
            marginRight: "auto",
            opacity: visible ? 1 : 0,
            transform: visible ? "translateY(0)" : "translateY(12px)",
            transition: "opacity 600ms ease-out 100ms, transform 600ms ease-out 100ms",
          }}
        >
          How stable is your income, really?
        </h1>

        {/* Body */}
        <p
          className="text-[15px] md:text-[17px]"
          style={{
            color: "rgba(244,241,234,0.75)",
            lineHeight: S.lhBody,
            marginBottom: S.paraMb,
            maxWidth: mobile ? undefined : 580,
            marginLeft: "auto",
            marginRight: "auto",
            opacity: visible ? 1 : 0,
            transform: visible ? "translateY(0)" : "translateY(10px)",
            transition: "opacity 600ms ease-out 200ms, transform 600ms ease-out 200ms",
          }}
        >
          RunPayway measures the structural stability of your income &#8212; how much is recurring, how concentrated it is, how far ahead it is secured, and how much continues without active work. The result is a fixed 0&#8211;100 score under Model RP-2.0.
        </p>

        {/* Subline */}
        <p
          className="text-[16px] md:text-[18px]"
          style={{
            color: "rgba(244,241,234,0.90)",
            lineHeight: S.lhBody,
            maxWidth: mobile ? undefined : 460,
            marginLeft: "auto",
            marginRight: "auto",
            marginBottom: S.h1mb,
            fontWeight: 500,
            opacity: visible ? 1 : 0,
            transform: visible ? "translateY(0)" : "translateY(10px)",
            transition: "opacity 600ms ease-out 280ms, transform 600ms ease-out 280ms",
          }}
        >
          One assessment. One score. Full structural diagnosis.
        </p>

        {/* CTA Button */}
        <div
          style={{
            opacity: visible ? 1 : 0,
            transform: visible ? "translateY(0)" : "translateY(10px)",
            transition: "opacity 500ms ease-out 400ms, transform 500ms ease-out 400ms",
          }}
        >
          <Link
            href="/pricing"
            className="cta-tick inline-flex items-center justify-center font-semibold
                       focus:outline-none focus:ring-2 focus:ring-offset-2"
            style={{
              height: S.ctaH,
              width: mobile ? "100%" : "auto",
              paddingLeft: S.cardPad.desktop,
              paddingRight: S.cardPad.desktop,
              borderRadius: S.ctaRadius,
              background: "linear-gradient(135deg, #F4F1EA 0%, #EDECEA 100%)",
              color: B.navy,
              fontSize: 15,
              letterSpacing: "-0.01em",
              border: "1px solid rgba(244,241,234,0.92)",
              boxShadow: "inset 0 1px 0 rgba(255,255,255,0.5), 0 12px 32px rgba(0,0,0,0.25), 0 2px 6px rgba(0,0,0,0.15)",
              transition: "background 180ms ease, transform 180ms ease, box-shadow 180ms ease",
            }}
            onMouseEnter={(e) => {
              if (!canHover()) return;
              const el = e.currentTarget;
              el.style.background = "linear-gradient(135deg, #EDECEA 0%, #E5E2DA 100%)";
              el.style.transform = "translateY(-2px)";
              el.style.boxShadow = "inset 0 1px 0 rgba(255,255,255,0.5), 0 16px 40px rgba(0,0,0,0.30), 0 2px 8px rgba(0,0,0,0.18)";
            }}
            onMouseLeave={(e) => {
              const el = e.currentTarget;
              el.style.background = "linear-gradient(135deg, #F4F1EA 0%, #EDECEA 100%)";
              el.style.transform = "translateY(0)";
              el.style.boxShadow = "inset 0 1px 0 rgba(255,255,255,0.5), 0 12px 32px rgba(0,0,0,0.25), 0 2px 6px rgba(0,0,0,0.15)";
            }}
            onMouseDown={(e) => { e.currentTarget.style.transform = "translateY(0)"; }}
          >
            <span className="tick tick-navy" />
            <span className="cta-label">Get My Income Stability Score&#8482;</span>
            <span className="cta-arrow cta-arrow-navy" />
          </Link>

          <p
            className="text-[13px] md:text-[14px]"
            style={{ color: "rgba(244,241,234,0.50)", marginTop: 14, letterSpacing: "0.01em", textAlign: "center" }}
          >
            Under 2 minutes &#183; Instant report &#183; No bank connection required
          </p>
        </div>

        {/* Proof strip */}
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "center",
            gap: mobile ? 12 : 24,
            marginTop: mobile ? 40 : 56,
            opacity: visible ? 1 : 0,
            transition: "opacity 600ms ease-out 600ms",
          }}
        >
          {["Same answers, same score", "No AI in scoring", "No bank connection", "Private by default"].map((item, i) => (
            <span
              key={item}
              className="text-[11px] md:text-[12px]"
              style={{
                color: "rgba(244,241,234,0.40)",
                fontWeight: 500,
                letterSpacing: "0.02em",
                display: "flex",
                alignItems: "center",
                gap: i > 0 ? 0 : 0,
              }}
            >
              {i > 0 && <span style={{ marginRight: mobile ? 0 : 0, color: "rgba(244,241,234,0.20)" }}>{mobile ? "" : ""}</span>}
              {item}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}


/* ================================================================== */
/* SECTION 2: THE GAP                                                  */
/* ================================================================== */
function TheGapSection() {
  const { ref, visible } = useInView();
  const mobile = useMobile();

  return (
    <section
      ref={ref}
      aria-label="The Gap"
      style={{
        backgroundColor: "#ffffff",
        paddingTop: mobile ? S.sectionY.mobile : S.sectionY.desktop,
        paddingBottom: mobile ? S.sectionY.mobile : S.sectionY.desktop,
      }}
    >
      <div style={{ maxWidth: S.maxW, marginLeft: "auto", marginRight: "auto", paddingLeft: mobile ? S.padX.mobile : S.padX.desktop, paddingRight: mobile ? S.padX.mobile : S.padX.desktop }}>
        {/* Title */}
        <h2
          className="text-[30px] md:text-[40px]"
          style={{
            color: B.navy,
            fontWeight: 600,
            lineHeight: S.lhHeading,
            letterSpacing: S.lsHeading,
            marginBottom: mobile ? 32 : 48,
            textAlign: "center",
            opacity: visible ? 1 : 0,
            transform: visible ? "translateY(0)" : "translateY(12px)",
            transition: "opacity 0.5s ease-out, transform 0.5s ease-out",
          }}
        >
          What most scores miss
        </h2>

        {/* Comparison cards */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: mobile ? "1fr" : "1fr 1fr",
            gap: S.gridGap,
            maxWidth: 820,
            marginLeft: "auto",
            marginRight: "auto",
            marginBottom: mobile ? 32 : 48,
            opacity: visible ? 1 : 0,
            transform: visible ? "translateY(0)" : "translateY(12px)",
            transition: "opacity 0.5s ease-out 100ms, transform 0.5s ease-out 100ms",
          }}
        >
          {/* Credit Score card */}
          <div
            style={{
              backgroundColor: B.sand,
              borderRadius: S.cardRadius,
              padding: mobile ? S.cardPad.mobile : S.cardPad.desktop,
              border: "1px solid rgba(14,26,43,0.06)",
            }}
          >
            <div
              className="text-[11px] uppercase"
              style={{ color: B.muted, fontWeight: 500, letterSpacing: S.lsLabel, marginBottom: 14 }}
            >
              Credit Score
            </div>
            <p className="text-[15px] md:text-[16px]" style={{ color: "rgba(14,26,43,0.65)", lineHeight: 1.7 }}>
              Measures how reliably you repay debt.
            </p>
          </div>

          {/* Income Stability Score card */}
          <div
            style={{
              backgroundColor: "#ffffff",
              borderRadius: S.cardRadius,
              padding: mobile ? S.cardPad.mobile : S.cardPad.desktop,
              border: `1px solid rgba(75,63,174,0.15)`,
              boxShadow: "0 4px 16px rgba(75,63,174,0.06)",
            }}
          >
            <div
              className="text-[11px] uppercase"
              style={{ color: B.teal, fontWeight: 500, letterSpacing: S.lsLabel, marginBottom: 14 }}
            >
              Income Stability Score&#8482;
            </div>
            <p className="text-[15px] md:text-[16px]" style={{ color: "rgba(14,26,43,0.75)", lineHeight: 1.7 }}>
              Measures how stable your income structure is.
            </p>
          </div>
        </div>

        {/* Body copy */}
        <div
          style={{
            maxWidth: 620,
            marginLeft: "auto",
            marginRight: "auto",
            textAlign: "center",
            opacity: visible ? 1 : 0,
            transform: visible ? "translateY(0)" : "translateY(12px)",
            transition: "opacity 0.5s ease-out 200ms, transform 0.5s ease-out 200ms",
          }}
        >
          <p
            className="text-[15px] md:text-[17px]"
            style={{ color: "rgba(14,26,43,0.65)", lineHeight: S.lhBody, marginBottom: S.paraMb }}
          >
            A credit score does not show whether your income could survive the loss of a major source, how much is already lined up ahead, or how much would continue if active work stopped.
          </p>
          <p
            className="text-[17px] md:text-[19px]"
            style={{ color: B.navy, fontWeight: 500, lineHeight: S.lhDense, letterSpacing: "-0.01em" }}
          >
            RunPayway measures that gap.
          </p>
        </div>
      </div>
    </section>
  );
}


/* ================================================================== */
/* SECTION 3: WHAT YOU GET                                             */
/* ================================================================== */
function WhatYouGetSection() {
  const { ref, visible } = useInView();
  const mobile = useMobile();

  const pages = [
    { title: "Your Score", desc: "Overall score, stability band, classification, resilience grade, and confidence level." },
    { title: "Why This Score", desc: "Structural drivers, constraint hierarchy, interaction effects, and sensitivity ranking." },
    { title: "What Could Go Wrong", desc: "Stress scenarios, income mix breakdown, and peer comparison." },
    { title: "How to Improve", desc: "Projected improvements, prioritized actions tailored to your industry, and what not to do." },
    { title: "What to Do Next", desc: "90-day checklist, reassessment triggers, and benchmark context." },
  ];

  return (
    <section
      ref={ref}
      aria-label="What You Get"
      style={{
        backgroundColor: B.sand,
        paddingTop: mobile ? S.sectionY.mobile : S.sectionY.desktop,
        paddingBottom: mobile ? S.sectionY.mobile : S.sectionY.desktop,
      }}
    >
      <div style={{ maxWidth: S.maxW, marginLeft: "auto", marginRight: "auto", paddingLeft: mobile ? S.padX.mobile : S.padX.desktop, paddingRight: mobile ? S.padX.mobile : S.padX.desktop }}>
        {/* Header */}
        <div
          style={{
            textAlign: "center",
            marginBottom: S.subtextMb,
            opacity: visible ? 1 : 0,
            transform: visible ? "translateY(0)" : "translateY(14px)",
            transition: "opacity 520ms ease-out, transform 520ms ease-out",
          }}
        >
          <h2
            className="text-[30px] md:text-[40px]"
            style={{
              color: B.navy,
              fontWeight: 600,
              lineHeight: S.lhHeading,
              letterSpacing: S.lsHeading,
              marginBottom: S.h2mb,
            }}
          >
            What your report includes
          </h2>
          <p
            className="text-[16px] md:text-[18px] mx-auto"
            style={{ color: "rgba(14,26,43,0.70)", lineHeight: S.lhBody, maxWidth: 640 }}
          >
            A 5-page structural diagnostic that shows your score, explains what drives it, identifies what is most exposed, and recommends what to strengthen next.
          </p>
        </div>

        {/* Pages list */}
        <div
          style={{
            maxWidth: 720,
            margin: "0 auto",
            opacity: visible ? 1 : 0,
            transform: visible ? "translateY(0)" : "translateY(10px)",
            transition: "opacity 520ms ease-out 100ms, transform 520ms ease-out 100ms",
          }}
        >
          {pages.map((page, i) => (
            <div
              key={page.title}
              style={{
                display: "flex",
                alignItems: mobile ? "flex-start" : "center",
                gap: mobile ? 16 : 28,
                padding: mobile ? "20px 0" : "24px 0",
                borderBottom: "1px solid rgba(14,26,43,0.06)",
              }}
            >
              <div
                style={{
                  flexShrink: 0,
                  width: mobile ? 28 : 36,
                  fontSize: mobile ? 14 : 16,
                  fontWeight: 600,
                  color: B.light,
                  letterSpacing: "-0.02em",
                  fontVariantNumeric: "tabular-nums",
                }}
              >
                {String(i + 1).padStart(2, "0")}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div
                  className="text-[16px] md:text-[17px] font-semibold"
                  style={{ color: B.navy, lineHeight: 1.3, marginBottom: 6 }}
                >
                  {page.title}
                </div>
                <p
                  className="text-[14px] md:text-[15px]"
                  style={{ color: "rgba(14,26,43,0.55)", lineHeight: 1.6 }}
                >
                  {page.desc}
                </p>
              </div>
            </div>
          ))}

          {/* Link */}
          <div style={{ marginTop: 32, textAlign: "center" }}>
            <Link
              href="/sample-report"
              className="text-[15px] font-semibold"
              style={{
                color: B.purple,
                textDecoration: "underline",
                textUnderlineOffset: 4,
                letterSpacing: "-0.01em",
                transition: "color 180ms ease",
              }}
              onMouseEnter={(e) => { e.currentTarget.style.color = "#3D33A0"; }}
              onMouseLeave={(e) => { e.currentTarget.style.color = B.purple; }}
            >
              View the sample report &#8594;
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}


/* ================================================================== */
/* SECTION 4: SAMPLE RESULT                                            */
/* ================================================================== */
function SampleResultSection() {
  const { ref, visible } = useInView();
  const mobile = useMobile();

  return (
    <section
      ref={ref}
      aria-label="Sample Result"
      style={{
        backgroundColor: "#ffffff",
        paddingTop: mobile ? S.sectionY.mobile : S.sectionY.desktop,
        paddingBottom: mobile ? S.sectionY.mobile : S.sectionY.desktop,
      }}
    >
      <div style={{ maxWidth: S.maxW, marginLeft: "auto", marginRight: "auto", paddingLeft: mobile ? S.padX.mobile : S.padX.desktop, paddingRight: mobile ? S.padX.mobile : S.padX.desktop }}>
        {/* Header */}
        <h2
          className="text-[30px] md:text-[40px]"
          style={{
            color: B.navy,
            fontWeight: 600,
            letterSpacing: S.lsHeading,
            marginBottom: S.subtextMb,
            textAlign: "center",
            opacity: visible ? 1 : 0,
            transform: visible ? "translateY(0)" : "translateY(12px)",
            transition: "opacity 0.5s ease-out, transform 0.5s ease-out",
          }}
        >
          A sample result
        </h2>

        {/* Preview card */}
        <div
          style={{
            maxWidth: 640,
            margin: "0 auto",
            opacity: visible ? 1 : 0,
            transform: visible ? "translateY(0)" : "translateY(16px)",
            transition: "opacity 0.6s ease-out 100ms, transform 0.6s ease-out 100ms",
          }}
        >
          <div style={{
            backgroundColor: "#ffffff",
            border: "1px solid rgba(14,26,43,0.08)",
            borderRadius: S.panelRadius,
            padding: mobile ? S.cardPad.mobile : S.cardPad.desktop,
            boxShadow: "0 16px 48px rgba(14,26,43,0.08), 0 4px 12px rgba(14,26,43,0.04)",
            position: "relative",
            overflow: "hidden",
          }}>
            {/* Top accent */}
            <div style={{ position: "absolute", top: 0, left: 20, right: 20, height: 3, borderRadius: "0 0 3px 3px", background: B.gradient }} />

            {/* Score */}
            <div className="text-[10px] uppercase" style={{ color: B.light, fontWeight: 600, letterSpacing: "0.12em", marginBottom: 10, marginTop: 8 }}>
              Income Stability Score&#8482;
            </div>
            <div style={{ display: "flex", alignItems: "baseline", gap: 12, marginBottom: 10 }}>
              <span className="text-[40px]" style={{ fontWeight: 700, color: B.navy, lineHeight: 1 }}>78</span>
              <span className="text-[15px]" style={{ fontWeight: 600, color: B.teal }}>Established Stability</span>
            </div>
            <div className="text-[12px]" style={{ color: B.muted, marginBottom: 24 }}>
              <span style={{ fontWeight: 600, color: B.navy }}>72nd percentile</span> within Professional Services
            </div>

            {/* Divider */}
            <div style={{ height: 1, background: "rgba(14,26,43,0.06)", marginBottom: 20 }} />

            {/* Key metrics row */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: mobile ? "1fr 1fr" : "1fr 1fr 1fr 1fr",
                gap: mobile ? 16 : 12,
                marginBottom: 24,
              }}
            >
              <div>
                <div className="text-[10px] uppercase" style={{ color: B.teal, fontWeight: 600, letterSpacing: "0.10em", marginBottom: 6 }}>Continuity</div>
                <div className="text-[16px] font-semibold" style={{ color: B.navy }}>38%</div>
              </div>
              <div>
                <div className="text-[10px] uppercase" style={{ color: B.teal, fontWeight: 600, letterSpacing: "0.10em", marginBottom: 6 }}>Stress Test</div>
                <div className="text-[16px] font-semibold" style={{ color: B.navy }}>
                  78<span className="text-[13px]" style={{ color: B.light, margin: "0 4px" }}>&rarr;</span><span style={{ color: "#DC2626" }}>56</span>
                </div>
              </div>
              <div>
                <div className="text-[10px] uppercase" style={{ color: B.teal, fontWeight: 600, letterSpacing: "0.10em", marginBottom: 6 }}>How Resilient</div>
                <div className="text-[16px] font-semibold" style={{ color: B.navy }}>Supported</div>
              </div>
              <div>
                <div className="text-[10px] uppercase" style={{ color: B.teal, fontWeight: 600, letterSpacing: "0.10em", marginBottom: 6 }}>Confidence</div>
                <div className="text-[16px] font-semibold" style={{ color: B.navy }}>High</div>
              </div>
            </div>

            {/* Divider */}
            <div style={{ height: 1, background: "rgba(14,26,43,0.06)", marginBottom: 20 }} />

            {/* Main Constraint */}
            <div className="text-[10px] uppercase" style={{ color: B.navy, fontWeight: 600, letterSpacing: "0.12em", marginBottom: 8 }}>
              Main Constraint
            </div>
            <p className="text-[14px]" style={{ color: "rgba(14,26,43,0.70)", lineHeight: 1.6, marginBottom: 24 }}>
              Forward visibility could be stronger
            </p>

            {/* Divider */}
            <div style={{ height: 1, background: "rgba(14,26,43,0.06)", marginBottom: 20 }} />

            {/* Best Improvement */}
            <div className="text-[10px] uppercase" style={{ color: B.teal, fontWeight: 600, letterSpacing: "0.12em", marginBottom: 8 }}>
              Best Improvement
            </div>
            <p className="text-[14px]" style={{ color: "rgba(14,26,43,0.70)", lineHeight: 1.6, marginBottom: 24 }}>
              Extend committed income further ahead
            </p>

            {/* Divider */}
            <div style={{ height: 1, background: "rgba(14,26,43,0.06)", marginBottom: 20 }} />

            {/* Verification */}
            <div className="text-[10px] uppercase" style={{ color: B.light, fontWeight: 600, letterSpacing: "0.12em", marginBottom: 6 }}>
              Verification
            </div>
            <p className="text-[13px]" style={{ color: "rgba(14,26,43,0.55)", lineHeight: 1.5 }}>
              Model RP-2.0 &#183; Verified
            </p>
          </div>
        </div>

        {/* Footer */}
        <p
          className="text-[13px] md:text-[14px]"
          style={{ color: B.muted, textAlign: "center", marginTop: 32, maxWidth: 620, marginLeft: "auto", marginRight: "auto", lineHeight: 1.6 }}
        >
          Every report includes score breakdown, structural risks, stress scenarios, improvement paths, and reassessment triggers.
        </p>
      </div>
    </section>
  );
}


/* ================================================================== */
/* SECTION 5: HOW IT WORKS                                             */
/* ================================================================== */
function HowItWorksSection() {
  const { ref, visible } = useInViewBidi(0.15);
  const mobile = useMobile();

  const steps = [
    { num: "1", title: "Answer six questions", desc: "About how your income is structured today." },
    { num: "2", title: "The model runs", desc: "Model RP-2.0 calculates your score from 20 deterministic engines. No AI. Same answers always produce the same result." },
    { num: "3", title: "Get your full report", desc: "Score, structural breakdown, stress scenarios, improvement paths, and reassessment triggers. Delivered instantly." },
  ];

  return (
    <section
      ref={ref}
      aria-label="How It Works"
      style={{
        paddingTop: mobile ? S.sectionY.mobile : S.sectionY.desktop,
        paddingBottom: mobile ? S.sectionY.mobile : S.sectionY.desktop,
        background: B.sand,
      }}
    >
      <div style={{ maxWidth: S.maxW, marginLeft: "auto", marginRight: "auto", paddingLeft: mobile ? S.padX.mobile : S.padX.desktop, paddingRight: mobile ? S.padX.mobile : S.padX.desktop }}>
        {/* Header */}
        <div className="text-center" style={{ marginBottom: S.subtextMb }}>
          <h2
            className="text-[30px] md:text-[40px] font-semibold"
            style={{
              color: B.navy,
              lineHeight: S.lhHeading,
              letterSpacing: S.lsHeading,
              marginBottom: S.h2mb,
              opacity: visible ? 1 : 0,
              transform: visible ? "translateY(0)" : "translateY(12px)",
              transition: "opacity 0.5s ease-out 100ms, transform 0.5s ease-out 100ms",
            }}
          >
            How it works
          </h2>
          <p
            className="text-[16px] md:text-[18px] mx-auto"
            style={{
              color: "rgba(14,26,43,0.70)",
              maxWidth: 520,
              lineHeight: S.lhBody,
              opacity: visible ? 1 : 0,
              transform: visible ? "translateY(0)" : "translateY(12px)",
              transition: "opacity 0.5s ease-out 200ms, transform 0.5s ease-out 200ms",
            }}
          >
            Six questions. Under two minutes. Full structural diagnosis.
          </p>
        </div>

        {/* 3 step cards */}
        <div
          style={{ display: "grid", gridTemplateColumns: mobile ? "1fr" : "repeat(3, 1fr)", gap: S.gridGap, maxWidth: 960, margin: "0 auto" }}
        >
          {steps.map((step, i) => {
            const delay = 300 + i * 120;
            return (
              <article
                key={step.num}
                className="text-center"
                style={{
                  backgroundColor: "#ffffff",
                  borderRadius: S.cardRadius,
                  padding: mobile ? `${S.cardPad.mobile}px` : `${S.cardPad.desktop}px`,
                  border: "1px solid rgba(14,26,43,0.06)",
                  boxShadow: "0 1px 3px rgba(14,26,43,0.04), 0 8px 24px rgba(14,26,43,0.03)",
                  opacity: visible ? 1 : 0,
                  transform: visible ? "translateY(0)" : "translateY(24px)",
                  transition: `opacity 600ms ease-out ${delay}ms, transform 600ms ease-out ${delay}ms, box-shadow 400ms ease, border-color 400ms ease`,
                }}
                onMouseEnter={(e) => {
                  if (!canHover()) return;
                  e.currentTarget.style.boxShadow = "0 4px 16px rgba(14,26,43,0.08), 0 16px 48px rgba(75,63,174,0.08)";
                  e.currentTarget.style.transform = "translateY(-3px)";
                  e.currentTarget.style.borderColor = "rgba(75,63,174,0.12)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.boxShadow = "0 1px 3px rgba(14,26,43,0.04), 0 8px 24px rgba(14,26,43,0.03)";
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.borderColor = "rgba(14,26,43,0.06)";
                }}
              >
                <div
                  className="inline-flex items-center justify-center font-semibold"
                  style={{
                    width: 44, height: 44, borderRadius: 12,
                    backgroundColor: B.purple, color: "#ffffff", fontSize: 17,
                    marginBottom: 24,
                    boxShadow: "0 4px 12px rgba(75,63,174,0.25)",
                  }}
                >
                  {step.num}
                </div>
                <div className="text-[18px] md:text-[20px] font-semibold" style={{ color: B.navy, marginBottom: S.labelMb - 2 }}>
                  {step.title}
                </div>
                <p className="text-[14px] md:text-[15px]" style={{ color: B.muted, lineHeight: S.lhBody }}>
                  {step.desc}
                </p>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}


/* ================================================================== */
/* SECTION 6: WHO IT'S FOR                                             */
/* ================================================================== */
function WhoItsForSection() {
  const { ref, visible } = useInView();
  const mobile = useMobile();

  const types = [
    "Project-based: weak point is usually continuity and forward visibility.",
    "Commission-based: weak point is usually concentration and earnings variability.",
    "Private practice: weak point is usually interruption sensitivity.",
    "Agency: weak point is usually dependence on a small number of major clients.",
    "Creator and hybrid: weak point is usually platform dependence and uneven continuity.",
  ];

  return (
    <section
      ref={ref}
      aria-label="Who It Is For"
      style={{
        backgroundColor: "#ffffff",
        paddingTop: mobile ? S.sectionY.mobile : S.sectionY.desktop,
        paddingBottom: mobile ? S.sectionY.mobile : S.sectionY.desktop,
      }}
    >
      <div style={{ maxWidth: S.maxW, marginLeft: "auto", marginRight: "auto", paddingLeft: mobile ? S.padX.mobile : S.padX.desktop, paddingRight: mobile ? S.padX.mobile : S.padX.desktop }}>
        <div
          style={{
            maxWidth: 680,
            marginLeft: "auto",
            marginRight: "auto",
            textAlign: "center",
            opacity: visible ? 1 : 0,
            transform: visible ? "translateY(0)" : "translateY(14px)",
            transition: "opacity 520ms ease-out, transform 520ms ease-out",
          }}
        >
          <h2
            className="text-[30px] md:text-[40px]"
            style={{
              color: B.navy,
              fontWeight: 600,
              lineHeight: S.lhHeading,
              letterSpacing: S.lsHeading,
              marginBottom: S.h2mb,
            }}
          >
            Built for income that does not fit simple scoring
          </h2>

          <p
            className="text-[16px] md:text-[18px]"
            style={{ color: "rgba(14,26,43,0.70)", lineHeight: S.lhBody, marginBottom: S.subtextMb }}
          >
            RunPayway is designed for business owners, self-employed professionals, commission earners, consultants, agency operators, private practitioners, creators, and anyone with income that depends on clients, contracts, or active effort.
          </p>

          {/* Income type weak points */}
          <div style={{ textAlign: "left", maxWidth: 600, marginLeft: "auto", marginRight: "auto" }}>
            {types.map((item) => (
              <div
                key={item}
                style={{
                  display: "flex",
                  alignItems: "flex-start",
                  gap: 12,
                  padding: "14px 0",
                  borderBottom: "1px solid rgba(14,26,43,0.06)",
                }}
              >
                <span style={{ width: 5, height: 5, borderRadius: 999, backgroundColor: B.teal, marginTop: 8, flexShrink: 0 }} />
                <p className="text-[15px] md:text-[16px]" style={{ color: "rgba(14,26,43,0.65)", lineHeight: 1.6 }}>
                  {item}
                </p>
              </div>
            ))}
          </div>

          <p
            className="text-[15px] md:text-[16px]"
            style={{ color: "rgba(14,26,43,0.70)", lineHeight: S.lhBody, marginTop: 32, fontWeight: 500 }}
          >
            The model stays fixed. The weak point changes by income type.
          </p>
        </div>
      </div>
    </section>
  );
}


/* ================================================================== */
/* SECTION 7: PRICING                                                  */
/* ================================================================== */
function PricingSection() {
  const { ref, visible } = useInView();
  const mobile = useMobile();

  return (
    <section
      ref={ref}
      aria-label="Pricing"
      className="relative overflow-hidden"
      style={{ background: `linear-gradient(180deg, ${B.navy} 0%, #1A1540 40%, ${B.purple} 100%)` }}
    >
      {/* Ambient glows */}
      <div style={{ position: "absolute", top: "-25%", left: "50%", width: 800, height: 800, borderRadius: "50%", transform: "translateX(-50%)", background: "radial-gradient(circle, rgba(75,63,174,0.14) 0%, transparent 60%)", pointerEvents: "none" }} />

      {/* Concentric halos */}
      <div className="absolute pointer-events-none" style={{ width: 320, height: 320, borderRadius: "50%", border: "1px solid rgba(244,241,234,0.06)", top: "50%", left: "50%", transform: "translate(-50%, -50%)" }} />
      <div className="absolute pointer-events-none" style={{ width: 520, height: 520, borderRadius: "50%", border: "1px solid rgba(244,241,234,0.08)", top: "50%", left: "50%", transform: "translate(-50%, -50%)" }} />
      <div className="absolute pointer-events-none" style={{ width: 720, height: 720, borderRadius: "50%", border: "1px solid rgba(244,241,234,0.04)", top: "50%", left: "50%", transform: "translate(-50%, -50%)" }} />

      <div
        className="relative mx-auto"
        style={{
          maxWidth: S.maxW,
          paddingTop: mobile ? S.sectionY.mobile : S.sectionY.desktop,
          paddingBottom: mobile ? S.sectionY.mobile : S.sectionY.desktop,
          paddingLeft: mobile ? S.padX.mobile : S.padX.desktop,
          paddingRight: mobile ? S.padX.mobile : S.padX.desktop,
          textAlign: "center",
        }}
      >
        <div
          style={{
            opacity: visible ? 1 : 0,
            transform: visible ? "translateY(0)" : "translateY(14px)",
            transition: "opacity 520ms ease-out, transform 520ms ease-out",
          }}
        >
          {/* Heading */}
          <h2
            className="font-semibold text-[30px] md:text-[44px]"
            style={{
              color: "#F4F1EA",
              lineHeight: S.lhHeading,
              letterSpacing: S.lsHero,
              maxWidth: 640,
              margin: `0 auto ${S.h2mb}px auto`,
            }}
          >
            Measure the structure behind your income
          </h2>

          <p
            className="text-[16px] md:text-[18px]"
            style={{
              color: "rgba(244,241,234,0.80)",
              lineHeight: S.lhBody,
              maxWidth: 560,
              margin: `0 auto ${S.subtextMb}px auto`,
            }}
          >
            See how stable your income structure is, where it is exposed, and what would strengthen it.
          </p>
        </div>

        {/* Pricing cards */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: mobile ? "1fr" : "1fr 1fr",
            gap: S.gridGap,
            maxWidth: 720,
            margin: "0 auto",
            opacity: visible ? 1 : 0,
            transform: visible ? "translateY(0)" : "translateY(16px)",
            transition: "opacity 520ms ease-out 100ms, transform 520ms ease-out 100ms",
          }}
        >
          {/* Single Assessment */}
          <div
            style={{
              backgroundColor: "#ffffff",
              borderRadius: S.panelRadius,
              padding: mobile ? S.cardPad.mobile : S.cardPad.desktop,
              textAlign: "center",
            }}
          >
            <div className="text-[11px] uppercase font-semibold" style={{ color: B.teal, letterSpacing: S.lsLabel, marginBottom: 12 }}>
              Single Assessment
            </div>
            <div className="text-[40px] font-bold" style={{ color: B.navy, lineHeight: 1, marginBottom: 16 }}>
              $39
            </div>
            <p className="text-[14px]" style={{ color: B.muted, lineHeight: 1.6, marginBottom: 28 }}>
              Full 5-page diagnostic &#183; Instant delivery &#183; One-time
            </p>
            <a
              href="https://buy.stripe.com/14A28j48E2socZQa2Z2Nq02"
              className="cta-tick inline-flex items-center justify-center font-semibold w-full
                         focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#1F6D7A]"
              style={{
                height: S.ctaH,
                paddingLeft: S.ctaPadX,
                paddingRight: S.ctaPadX,
                borderRadius: S.ctaRadius,
                background: B.purple,
                color: "#ffffff",
                fontSize: 15,
                letterSpacing: "-0.01em",
                border: "1px solid rgba(75,63,174,0.90)",
                boxShadow: "0 8px 24px rgba(75,63,174,0.25)",
                transition: "background 180ms ease, transform 180ms ease, box-shadow 180ms ease",
              }}
              onMouseEnter={(e) => {
                if (!canHover()) return;
                const el = e.currentTarget;
                el.style.background = "#3D33A0";
                el.style.transform = "translateY(-1px)";
                el.style.boxShadow = "0 12px 32px rgba(75,63,174,0.35)";
              }}
              onMouseLeave={(e) => {
                const el = e.currentTarget;
                el.style.background = B.purple;
                el.style.transform = "translateY(0)";
                el.style.boxShadow = "0 8px 24px rgba(75,63,174,0.25)";
              }}
              onMouseDown={(e) => { e.currentTarget.style.transform = "translateY(0)"; }}
            >
              <span className="tick tick-white" />
              <span className="cta-label">Get My Score</span>
              <span className="cta-arrow cta-arrow-white" />
            </a>
          </div>

          {/* Annual Monitoring */}
          <div
            style={{
              backgroundColor: "#ffffff",
              borderRadius: S.panelRadius,
              padding: mobile ? S.cardPad.mobile : S.cardPad.desktop,
              textAlign: "center",
            }}
          >
            <div className="text-[11px] uppercase font-semibold" style={{ color: B.teal, letterSpacing: S.lsLabel, marginBottom: 12 }}>
              Annual Monitoring
            </div>
            <div className="text-[40px] font-bold" style={{ color: B.navy, lineHeight: 1, marginBottom: 16 }}>
              $99
            </div>
            <p className="text-[14px]" style={{ color: B.muted, lineHeight: 1.6, marginBottom: 28 }}>
              Three assessments over 12 months &#183; Track structural changes
            </p>
            <a
              href="https://buy.stripe.com/aFacMXdJe2so7Fw7UR2Nq03"
              className="cta-tick inline-flex items-center justify-center font-semibold w-full
                         focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#1F6D7A]"
              style={{
                height: S.ctaH,
                paddingLeft: S.ctaPadX,
                paddingRight: S.ctaPadX,
                borderRadius: S.ctaRadius,
                background: B.purple,
                color: "#ffffff",
                fontSize: 15,
                letterSpacing: "-0.01em",
                border: "1px solid rgba(75,63,174,0.90)",
                boxShadow: "0 8px 24px rgba(75,63,174,0.25)",
                transition: "background 180ms ease, transform 180ms ease, box-shadow 180ms ease",
              }}
              onMouseEnter={(e) => {
                if (!canHover()) return;
                const el = e.currentTarget;
                el.style.background = "#3D33A0";
                el.style.transform = "translateY(-1px)";
                el.style.boxShadow = "0 12px 32px rgba(75,63,174,0.35)";
              }}
              onMouseLeave={(e) => {
                const el = e.currentTarget;
                el.style.background = B.purple;
                el.style.transform = "translateY(0)";
                el.style.boxShadow = "0 8px 24px rgba(75,63,174,0.25)";
              }}
              onMouseDown={(e) => { e.currentTarget.style.transform = "translateY(0)"; }}
            >
              <span className="tick tick-white" />
              <span className="cta-label">Get Annual Monitoring</span>
              <span className="cta-arrow cta-arrow-white" />
            </a>
          </div>
        </div>

        {/* Trust strip */}
        <p
          className="text-[13px] md:text-[14px]"
          style={{ color: "rgba(244,241,234,0.50)", marginTop: 32, letterSpacing: "0.01em" }}
        >
          No bank connection required &#183; No credit pull &#183; Private by default
        </p>
        <p
          className="text-[13px] md:text-[14px]"
          style={{ color: "rgba(244,241,234,0.40)", marginTop: 8 }}
        >
          Average completion: under 2 minutes
        </p>
      </div>
    </section>
  );
}


/* ================================================================== */
/* SECTION 8: TRUST                                                    */
/* ================================================================== */
function TrustSection() {
  const { ref, visible } = useInView();
  const mobile = useMobile();

  const bandColors = [
    { range: "0-29", label: "Limited", color: "#DC2626", width: "29%" },
    { range: "30-49", label: "Developing", color: "#F59E0B", width: "20%" },
    { range: "50-74", label: "Established", color: B.teal, width: "25%" },
    { range: "75-100", label: "High", color: B.navy, width: "26%" },
  ];

  return (
    <section
      ref={ref}
      aria-label="Trust and Governance"
      style={{
        backgroundColor: B.sand,
        paddingTop: mobile ? S.sectionY.mobile : S.sectionY.desktop,
        paddingBottom: mobile ? S.sectionY.mobile : S.sectionY.desktop,
      }}
    >
      <div style={{ maxWidth: S.maxW, marginLeft: "auto", marginRight: "auto", paddingLeft: mobile ? S.padX.mobile : S.padX.desktop, paddingRight: mobile ? S.padX.mobile : S.padX.desktop }}>
        {/* Header */}
        <h2
          className="text-[30px] md:text-[40px]"
          style={{
            color: B.navy,
            fontWeight: 600,
            lineHeight: S.lhHeading,
            letterSpacing: S.lsHeading,
            marginBottom: S.subtextMb,
            textAlign: "center",
            opacity: visible ? 1 : 0,
            transform: visible ? "translateY(0)" : "translateY(12px)",
            transition: "opacity 0.5s ease-out, transform 0.5s ease-out",
          }}
        >
          Model governance
        </h2>

        {/* Three items */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: mobile ? "1fr" : "repeat(3, 1fr)",
            gap: S.gridGap,
            maxWidth: 960,
            margin: "0 auto",
            opacity: visible ? 1 : 0,
            transform: visible ? "translateY(0)" : "translateY(14px)",
            transition: "opacity 520ms ease-out 100ms, transform 520ms ease-out 100ms",
          }}
        >
          {/* Classification Scale */}
          <div
            style={{
              backgroundColor: "#ffffff",
              borderRadius: S.cardRadius,
              padding: mobile ? S.cardPad.mobile : S.cardPad.desktop,
              border: "1px solid rgba(14,26,43,0.06)",
            }}
          >
            <div
              className="text-[11px] uppercase font-semibold"
              style={{ color: B.teal, letterSpacing: S.lsLabel, marginBottom: 16 }}
            >
              Classification Scale
            </div>

            {/* Horizontal color bar */}
            <div style={{ display: "flex", borderRadius: 6, overflow: "hidden", height: 10, marginBottom: 16 }}>
              {bandColors.map((band) => (
                <div key={band.range} style={{ width: band.width, backgroundColor: band.color }} />
              ))}
            </div>

            {/* Band labels */}
            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              {bandColors.map((band) => (
                <div key={band.range} className="text-[12px]" style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <span style={{ width: 8, height: 8, borderRadius: 999, backgroundColor: band.color, flexShrink: 0 }} />
                  <span style={{ color: B.navy, fontWeight: 600 }}>{band.range}</span>
                  <span style={{ color: B.muted }}>{band.label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Model Integrity */}
          <div
            style={{
              backgroundColor: "#ffffff",
              borderRadius: S.cardRadius,
              padding: mobile ? S.cardPad.mobile : S.cardPad.desktop,
              border: "1px solid rgba(14,26,43,0.06)",
            }}
          >
            <div
              className="text-[11px] uppercase font-semibold"
              style={{ color: B.teal, letterSpacing: S.lsLabel, marginBottom: 16 }}
            >
              Model Integrity
            </div>
            <p className="text-[14px]" style={{ color: "rgba(14,26,43,0.65)", lineHeight: 1.7, marginBottom: 12 }}>
              The same answers produce the same score every time. Scoring, scenarios, and classifications are generated from fixed rules.
            </p>
            <p className="text-[14px]" style={{ color: "rgba(14,26,43,0.65)", lineHeight: 1.7, marginBottom: 12 }}>
              No AI determines the result. If the framework changes, it becomes a new version.
            </p>
            <p className="text-[14px] font-semibold" style={{ color: B.navy }}>
              Current: Model RP-2.0
            </p>
          </div>

          {/* Verification */}
          <div
            style={{
              backgroundColor: "#ffffff",
              borderRadius: S.cardRadius,
              padding: mobile ? S.cardPad.mobile : S.cardPad.desktop,
              border: "1px solid rgba(14,26,43,0.06)",
            }}
          >
            <div
              className="text-[11px] uppercase font-semibold"
              style={{ color: B.teal, letterSpacing: S.lsLabel, marginBottom: 16 }}
            >
              Verification
            </div>
            <p className="text-[14px]" style={{ color: "rgba(14,26,43,0.65)", lineHeight: 1.7, marginBottom: 12 }}>
              Every assessment includes a unique record ID, SHA-256 integrity hash, and verification link.
            </p>
            <p className="text-[14px]" style={{ color: "rgba(14,26,43,0.65)", lineHeight: 1.7 }}>
              Reports can be authenticated at runpayway.com/verify.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}


/* ================================================================== */
/* SECTION 9: FAQ                                                      */
/* ================================================================== */
function FaqSection({ openFaq, setOpenFaq }: { openFaq: number | null; setOpenFaq: (v: number | null) => void }) {
  const { ref, visible } = useInView();
  const mobile = useMobile();

  const faqItems = [
    { q: "What does the Income Stability Score\u2122 measure?", a: "It measures how stable your income structure is based on recurring income, concentration, source diversity, forward visibility, variability, and continuity without active work." },
    { q: "How long does the assessment take?", a: "Most people complete it in under two minutes." },
    { q: "What is included in the report?", a: "A 5-page diagnostic including your score, structural breakdown, stress scenarios, projected improvements, industry-tailored actions, reassessment triggers, and peer benchmarks." },
    { q: "Can I retake the assessment?", a: "Yes. Retake after a meaningful structural change to see how your score has moved." },
    { q: "How is my data handled?", a: "No bank connection is required. Your data is private by default and handled according to our privacy and security policies." },
    { q: "Do I need exact financial records?", a: "No. The assessment works from informed estimates. More accurate inputs produce more precise results, but exact bookkeeping is not required." },
  ];

  return (
    <section
      ref={ref}
      aria-label="FAQ"
      style={{
        backgroundColor: "#ffffff",
        paddingTop: mobile ? S.sectionY.mobile : S.sectionY.desktop,
        paddingBottom: mobile ? S.sectionY.mobile : S.sectionY.desktop,
      }}
    >
      <div style={{ maxWidth: S.maxW, marginLeft: "auto", marginRight: "auto", paddingLeft: mobile ? S.padX.mobile : S.padX.desktop, paddingRight: mobile ? S.padX.mobile : S.padX.desktop }}>
        {/* Header */}
        <div
          style={{
            textAlign: "center",
            opacity: visible ? 1 : 0,
            transform: visible ? "translateY(0)" : "translateY(12px)",
            transition: "opacity 0.5s ease-out, transform 0.5s ease-out",
          }}
        >
          <h2
            className="text-[30px] md:text-[40px]"
            style={{
              color: B.navy,
              fontWeight: 600,
              lineHeight: S.lhHeading,
              letterSpacing: S.lsHeading,
              marginBottom: S.subtextMb,
            }}
          >
            Frequently asked questions
          </h2>
        </div>

        {/* FAQ list */}
        <div
          className="mx-auto"
          style={{
            maxWidth: 820,
            opacity: visible ? 1 : 0,
            transform: visible ? "translateY(0)" : "translateY(10px)",
            transition: "opacity 0.5s ease-out 80ms, transform 0.5s ease-out 80ms",
          }}
        >
          {faqItems.map((item, i) => {
            const isOpen = openFaq === i;
            return (
              <div
                key={i}
                style={{
                  borderTop: "1px solid rgba(14,26,43,0.08)",
                  borderBottom: i === faqItems.length - 1 ? "1px solid rgba(14,26,43,0.08)" : "none",
                  backgroundColor: isOpen ? "rgba(75,63,174,0.03)" : "transparent",
                  transition: "background-color 180ms ease",
                }}
              >
                <button
                  onClick={() => setOpenFaq(isOpen ? null : i)}
                  className="w-full flex items-center justify-between text-left group"
                  style={{ padding: "26px 0", gap: 24 }}
                  aria-expanded={isOpen}
                >
                  <span
                    className="text-[17px] md:text-[20px] transition-colors duration-[180ms]"
                    style={{
                      color: isOpen ? B.navy : "rgba(14,26,43,0.80)",
                      fontWeight: 500,
                      lineHeight: 1.45,
                      letterSpacing: "-0.01em",
                    }}
                  >
                    {item.q}
                  </span>
                  {/* Plus/minus indicator */}
                  <svg
                    width="16" height="16" viewBox="0 0 16 16" fill="none"
                    className="shrink-0 transition-colors duration-[180ms]"
                    stroke="rgba(14,26,43,0.40)"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                  >
                    {!isOpen && <line x1="8" y1="2" x2="8" y2="14" />}
                    <line x1="2" y1="8" x2="14" y2="8" />
                  </svg>
                </button>
                {/* Answer area */}
                <div
                  className="overflow-hidden transition-all duration-[220ms] ease-in-out"
                  style={{ maxHeight: isOpen ? 300 : 0, opacity: isOpen ? 1 : 0 }}
                >
                  <p
                    className="text-[15px] md:text-[16px]"
                    style={{
                      color: "rgba(14,26,43,0.65)",
                      fontWeight: 400,
                      lineHeight: 1.75,
                      maxWidth: 680,
                      paddingTop: 14,
                      paddingRight: mobile ? 16 : 48,
                      paddingBottom: 20,
                    }}
                  >
                    {item.a}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom CTA link */}
        <div style={{ textAlign: "center", marginTop: S.subtextMb }}>
          <Link
            href="/pricing"
            className="text-[15px] font-semibold"
            style={{
              color: B.purple,
              textDecoration: "underline",
              textUnderlineOffset: 4,
              letterSpacing: "-0.01em",
              transition: "color 180ms ease",
            }}
            onMouseEnter={(e) => { e.currentTarget.style.color = "#3D33A0"; }}
            onMouseLeave={(e) => { e.currentTarget.style.color = B.purple; }}
          >
            Get My Income Stability Score&#8482; &#8594;
          </Link>
        </div>
      </div>
    </section>
  );
}


/* ================================================================== */
/* SECTION 10: DISCLAIMER                                              */
/* ================================================================== */
function DisclaimerSection() {
  const { ref, visible } = useInView();
  const mobile = useMobile();

  return (
    <section
      ref={ref}
      aria-label="Global Disclaimer"
      className="relative overflow-hidden"
      style={{ background: B.navy }}
    >
      <div
        className="relative mx-auto"
        style={{
          maxWidth: S.maxW,
          paddingTop: mobile ? S.disclaimerY.mobile : S.disclaimerY.desktop,
          paddingBottom: mobile ? S.disclaimerY.mobile : S.disclaimerY.desktop,
          paddingLeft: mobile ? S.padX.mobile : S.padX.desktop,
          paddingRight: mobile ? S.padX.mobile : S.padX.desktop,
          opacity: visible ? 1 : 0,
          transform: visible ? "translateY(0)" : "translateY(8px)",
          transition: "opacity 360ms ease-out, transform 360ms ease-out",
        }}
      >
        {/* Structural divider */}
        <div
          style={{
            height: 1,
            width: "100%",
            background: "linear-gradient(90deg, transparent, rgba(244,241,234,0.12), transparent)",
            marginBottom: 36,
            marginLeft: "auto",
            marginRight: "auto",
          }}
        />

        {/* Label */}
        <h2
          className="font-semibold uppercase text-[11px] md:text-[12px]"
          style={{
            color: "#ffffff",
            letterSpacing: S.lsLabel,
            marginBottom: 12,
            textAlign: "center",
          }}
        >
          Global Disclaimer
        </h2>

        {/* Disclosure text */}
        <div style={{ maxWidth: 720, marginLeft: "auto", marginRight: "auto", textAlign: "center" }}>
          <p
            className="text-[14px] md:text-[15px]"
            style={{
              color: "rgba(244,241,234,0.55)",
              lineHeight: S.lhBody,
              marginBottom: 10,
            }}
          >
            The Income Stability Score&#8482; is a structural income assessment based on information provided by the user.
          </p>
          <p
            className="text-[14px] md:text-[15px]"
            style={{
              color: "rgba(244,241,234,0.55)",
              lineHeight: 1.7,
            }}
          >
            It is not financial advice, investment advice, credit underwriting, or a prediction of future financial outcomes.
          </p>
        </div>
      </div>
    </section>
  );
}


/* ================================================================== */
/* MAIN LANDING PAGE                                                   */
/* ================================================================== */
export default function LandingPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  return (
    <div className="overflow-x-hidden">

      {/* ============ SECTION 1: HERO ============ */}
      <HeroSection />

      {/* ============ SECTION 2: THE GAP ============ */}
      <TheGapSection />

      {/* ============ SECTION 3: WHAT YOU GET ============ */}
      <WhatYouGetSection />

      {/* ============ SECTION 4: SAMPLE RESULT ============ */}
      <SampleResultSection />

      {/* ============ SECTION 5: HOW IT WORKS ============ */}
      <HowItWorksSection />

      {/* ============ SECTION 6: WHO IT'S FOR ============ */}
      <WhoItsForSection />

      {/* ============ SECTION 7: PRICING ============ */}
      <PricingSection />

      {/* ============ SECTION 8: TRUST ============ */}
      <TrustSection />

      {/* ============ SECTION 9: FAQ ============ */}
      <FaqSection openFaq={openFaq} setOpenFaq={setOpenFaq} />

      {/* ============ SECTION 10: DISCLAIMER ============ */}
      <DisclaimerSection />
    </div>
  );
}
