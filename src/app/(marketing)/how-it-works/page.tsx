"use client";

import { useState, useEffect, useRef } from "react";

/* ------------------------------------------------------------------ */
/*  Shared hooks                                                       */
/* ------------------------------------------------------------------ */

const canHover = () =>
  typeof window !== "undefined" && window.matchMedia("(hover: hover)").matches;

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
/*  Brand tokens                                                       */
/* ------------------------------------------------------------------ */

const B = {
  navy: "#0E1A2B",
  purple: "#4B3FAE",
  teal: "#1F6D7A",
  sand: "#F4F1EA",
  sandDk: "#F4F1EA",
  offWhite: "#FFFFFF",
  muted: "rgba(14,26,43,0.58)",
  light: "rgba(14,26,43,0.42)",
  border: "rgba(14,26,43,0.12)",
  gradient:
    "linear-gradient(135deg, #0E1A2B 0%, #1A1540 40%, #4B3FAE 70%, #1F6D7A 100%)",
  bandLimited: "#9B2C2C",
  bandDeveloping: "#92640A",
  bandEstablished: "#2B5EA7",
  bandHigh: "#1F6D7A",
};

const S = {
  sectionY: { desktop: 120, mobile: 80 },
  sectionYsm: { desktop: 100, mobile: 64 },
  transitionY: { desktop: 56, mobile: 40 },
  disclaimerY: { desktop: 20, mobile: 14 },
  maxW: 1060,
  padX: { desktop: 48, mobile: 24 },
  h1mb: 20,
  h2mb: 20,
  subtextMb: 44,
  paraMb: 20,
  labelMb: 14,
  cardPad: { desktop: 32, mobile: 24 },
  cardRadius: 12,
  panelRadius: 16,
  gridGap: 20,
  gridGapSm: 14,
  ctaH: 52,
  ctaHsm: 44,
  ctaPadX: 28,
  ctaRadius: 12,
  lhHeading: 1.12,
  lhBody: 1.65,
  lhDense: 1.5,
  lsHeading: "-0.02em",
  lsHero: "-0.03em",
  lsLabel: "0.12em",
};

const STRIPE_SINGLE = "https://buy.stripe.com/14A28j48E2socZQa2Z2Nq02";
const DISPLAY_FONT = "'DM Serif Display', Georgia, serif";

/* ================================================================== */
/* 1. HERO — Dark gradient                                             */
/* ================================================================== */
function Hero() {
  const { ref, visible } = useInView();
  const mobile = useMobile();

  return (
    <section
      ref={ref}
      aria-label="How It Works Hero"
      style={{
        background: B.gradient,
        position: "relative",
        overflow: "hidden",
        paddingTop: mobile ? 120 : 160,
        paddingBottom: mobile ? 72 : 100,
      }}
    >
      <style>{`@import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display&display=swap');`}</style>
      {/* Radial glow */}
      <div
        style={{
          position: "absolute",
          top: "30%",
          left: "50%",
          width: 800,
          height: 800,
          transform: "translate(-50%, -50%)",
          background:
            "radial-gradient(circle, rgba(75,63,174,0.18) 0%, transparent 70%)",
          pointerEvents: "none",
        }}
      />

      <div
        style={{
          maxWidth: S.maxW,
          marginLeft: "auto",
          marginRight: "auto",
          paddingLeft: mobile ? S.padX.mobile : S.padX.desktop,
          paddingRight: mobile ? S.padX.mobile : S.padX.desktop,
          position: "relative",
          zIndex: 1,
        }}
      >
        <div
          style={{
            textAlign: "center",
            opacity: visible ? 1 : 0,
            transform: visible ? "translateY(0)" : "translateY(20px)",
            transition: "opacity 0.7s ease-out, transform 0.7s ease-out",
          }}
        >
          <div
            style={{
              fontSize: 11,
              textTransform: "uppercase",
              color: "rgba(250,249,247,0.50)",
              fontWeight: 600,
              letterSpacing: S.lsLabel,
              marginBottom: 24,
            }}
          >
            HOW IT WORKS
          </div>
          <h1
            style={{
              fontSize: mobile ? 32 : 44,
              color: "#FAF9F7",
              fontFamily: DISPLAY_FONT,
              fontWeight: 400,
              letterSpacing: S.lsHero,
              lineHeight: S.lhHeading,
              marginBottom: S.h1mb,
              maxWidth: 720,
              marginLeft: "auto",
              marginRight: "auto",
            }}
          >
            Six questions. Under two minutes.
            <br />
            Full structural diagnosis.
          </h1>
          <p
            style={{
              fontSize: mobile ? 15 : 17,
              color: "rgba(250,249,247,0.70)",
              lineHeight: S.lhBody,
              maxWidth: 600,
              marginLeft: "auto",
              marginRight: "auto",
              margin: "0 auto",
            }}
          >
            RunPayway&#8482; turns six answers about your income into a 0&ndash;100 score, a 5-page diagnostic report, and a clear path to stronger protection &mdash; all under Model RP-2.0.
          </p>
        </div>
      </div>
    </section>
  );
}

/* ================================================================== */
/* 2. THE THREE STEPS — Sand background                                */
/* ================================================================== */
function ThreeSteps() {
  const { ref, visible } = useInView();
  const mobile = useMobile();

  const steps = [
    {
      num: "1",
      title: "Answer six questions",
      subtitle: "About your income structure",
      body: "Each question looks at a different part of your income \u2014 how much repeats, how many sources you depend on, how much is secured ahead of time, how stable it is month to month, and how much continues without daily work.",
    },
    {
      num: "2",
      title: "The model scores",
      subtitle: "Fixed rules, no AI",
      body: "Model RP-2.0 calculates your score using fixed, deterministic rules. The same answers always produce the same result. No AI, no subjective judgment, no variability.",
    },
    {
      num: "3",
      title: "Get your full report",
      subtitle: "Delivered instantly",
      body: "A 5-page diagnostic report covering your score, what it means, your biggest risks, how to raise it, and what to do next. Personalized with your name and industry.",
    },
  ];

  return (
    <section
      ref={ref}
      aria-label="Three Steps"
      style={{
        backgroundColor: B.sand,
        paddingTop: mobile ? S.sectionY.mobile : S.sectionY.desktop,
        paddingBottom: mobile ? S.sectionY.mobile : S.sectionY.desktop,
      }}
    >
      <div
        style={{
          maxWidth: S.maxW,
          marginLeft: "auto",
          marginRight: "auto",
          paddingLeft: mobile ? S.padX.mobile : S.padX.desktop,
          paddingRight: mobile ? S.padX.mobile : S.padX.desktop,
        }}
      >
        {/* Section title */}
        <div
          style={{
            textAlign: "center",
            marginBottom: S.subtextMb,
            opacity: visible ? 1 : 0,
            transform: visible ? "translateY(0)" : "translateY(12px)",
            transition: "opacity 0.5s ease-out, transform 0.5s ease-out",
          }}
        >
          <h2
            style={{
              fontSize: mobile ? 28 : 40,
              color: B.navy,
              fontFamily: DISPLAY_FONT,
              fontWeight: 400,
              letterSpacing: S.lsHeading,
              lineHeight: S.lhHeading,
              marginBottom: 0,
            }}
          >
            How the assessment works
          </h2>
        </div>

        {/* Step cards */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: mobile ? "1fr" : "repeat(3, 1fr)",
            gap: S.gridGap,
            maxWidth: 960,
            margin: "0 auto",
            position: "relative",
          }}
        >
          {/* Dashed connecting line — desktop only */}
          {!mobile && (
            <div
              style={{
                position: "absolute",
                top: 58,
                left: "calc(16.67% + 22px)",
                right: "calc(16.67% + 22px)",
                height: 0,
                borderTop: `2px dashed ${B.border}`,
                zIndex: 0,
                opacity: visible ? 1 : 0,
                transition: "opacity 0.6s ease-out 400ms",
              }}
            />
          )}

          {steps.map((step, i) => (
            <StepCard
              key={step.num}
              step={step}
              index={i}
              visible={visible}
              mobile={mobile}
            />
          ))}
        </div>

        {/* Footer */}
        <div
          style={{
            textAlign: "center",
            marginTop: 40,
            fontSize: 12,
            color: B.muted,
            opacity: visible ? 1 : 0,
            transition: "opacity 0.5s ease-out 500ms",
          }}
        >
          Powered by Model RP-2.0
        </div>
      </div>
    </section>
  );
}

function StepCard({
  step,
  index,
  visible,
  mobile,
}: {
  step: { num: string; title: string; subtitle: string; body: string };
  index: number;
  visible: boolean;
  mobile: boolean;
}) {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      onMouseEnter={() => canHover() && setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        backgroundColor: "#ffffff",
        borderRadius: S.cardRadius,
        border: "1px solid rgba(14,26,43,0.06)",
        boxShadow: hovered
          ? "0 8px 24px rgba(14,26,43,0.08)"
          : "0 2px 8px rgba(14,26,43,0.04)",
        padding: mobile ? S.cardPad.mobile : S.cardPad.desktop,
        textAlign: "center",
        position: "relative",
        zIndex: 1,
        transform: visible
          ? hovered
            ? "translateY(-4px)"
            : "translateY(0)"
          : "translateY(16px)",
        opacity: visible ? 1 : 0,
        transition: `opacity 0.5s ease-out ${index * 120}ms, transform 0.4s ease-out ${index * 120}ms, box-shadow 0.3s ease`,
      }}
    >
      {/* Purple square badge */}
      <div
        style={{
          width: 44,
          height: 44,
          borderRadius: 12,
          backgroundColor: B.purple,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          margin: "0 auto 20px",
        }}
      >
        <span
          style={{
            color: "#ffffff",
            fontSize: 18,
            fontWeight: 600,
          }}
        >
          {step.num}
        </span>
      </div>

      <h3
        style={{
          fontSize: 17,
          fontWeight: 600,
          color: B.navy,
          letterSpacing: S.lsHeading,
          marginBottom: 6,
        }}
      >
        {step.title}
      </h3>

      <div
        style={{
          fontSize: 13,
          fontWeight: 600,
          color: B.teal,
          marginBottom: 16,
        }}
      >
        {step.subtitle}
      </div>

      <p
        style={{
          fontSize: 14,
          color: B.muted,
          lineHeight: S.lhBody,
          margin: 0,
        }}
      >
        {step.body}
      </p>
    </div>
  );
}

/* ================================================================== */
/* 3. WHAT YOUR REPORT COVERS — White background                       */
/* ================================================================== */
function ReportCovers() {
  const { ref, visible } = useInView();
  const mobile = useMobile();

  const pages = [
    {
      num: "01",
      title: "Your Score",
      question: "What is my score?",
      desc: "Your score, your stability band, a plain-English summary, and the single most important thing holding the structure back.",
      icon: <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke={B.purple} strokeWidth="1.5" strokeLinecap="round"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 3"/></svg>,
      accent: B.purple,
    },
    {
      num: "02",
      title: "What This Score Means",
      question: "What does it mean?",
      desc: "What is already working, what is still vulnerable, and a plain-English interpretation of what the score says about your income structure.",
      icon: <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke={B.teal} strokeWidth="1.5" strokeLinecap="round"><path d="M3 12h4l3-9 4 18 3-9h4"/></svg>,
      accent: B.teal,
    },
    {
      num: "03",
      title: "Your Biggest Risks",
      question: "What could hurt it?",
      desc: "What would happen if your largest source disappeared, how long income would continue if work stopped, and how your structure compares to peers.",
      icon: <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke={B.bandLimited} strokeWidth="1.5" strokeLinecap="round"><path d="M12 9v4m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/></svg>,
      accent: B.bandLimited,
    },
    {
      num: "04",
      title: "How to Raise Your Score",
      question: "How can I improve it?",
      desc: "The specific changes that would raise your score the most, with projected point gains and prioritized action steps.",
      icon: <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke={B.bandHigh} strokeWidth="1.5" strokeLinecap="round"><path d="M12 20V10M18 20V4M6 20v-4"/></svg>,
      accent: B.bandHigh,
    },
    {
      num: "05",
      title: "What to Do Next",
      question: "What should I do next?",
      desc: "A clear action plan, a 90-day checklist, when to reassess, and how your score compares to the benchmark.",
      icon: <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke={B.navy} strokeWidth="1.5" strokeLinecap="round"><path d="M9 11l3 3L22 4M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11"/></svg>,
      accent: B.navy,
    },
  ];

  return (
    <section
      ref={ref}
      aria-label="What Your Report Covers"
      style={{
        backgroundColor: "#ffffff",
        paddingTop: mobile ? S.sectionY.mobile : S.sectionY.desktop,
        paddingBottom: mobile ? S.sectionY.mobile : S.sectionY.desktop,
      }}
    >
      <div
        style={{
          maxWidth: S.maxW,
          marginLeft: "auto",
          marginRight: "auto",
          paddingLeft: mobile ? S.padX.mobile : S.padX.desktop,
          paddingRight: mobile ? S.padX.mobile : S.padX.desktop,
        }}
      >
        {/* Heading */}
        <div
          style={{
            textAlign: "center",
            marginBottom: S.subtextMb,
            opacity: visible ? 1 : 0,
            transform: visible ? "translateY(0)" : "translateY(12px)",
            transition: "opacity 0.5s ease-out, transform 0.5s ease-out",
          }}
        >
          <h2
            style={{
              fontSize: mobile ? 28 : 40,
              color: B.navy,
              fontFamily: DISPLAY_FONT,
              fontWeight: 400,
              letterSpacing: S.lsHeading,
              lineHeight: S.lhHeading,
              marginBottom: 12,
            }}
          >
            What you will learn
          </h2>
          <p
            style={{
              fontSize: mobile ? 15 : 18,
              color: B.muted,
              lineHeight: S.lhBody,
              maxWidth: 520,
              marginLeft: "auto",
              marginRight: "auto",
            }}
          >
            Five pages. Five questions answered. One clear path forward.
          </p>
        </div>

        {/* Flowchart layout — vertical line with connected nodes */}
        <div
          style={{
            maxWidth: 640,
            margin: "0 auto",
            position: "relative",
          }}
        >
          {/* Vertical connecting line */}
          {!mobile && (
            <div style={{
              position: "absolute",
              left: 27,
              top: 40,
              bottom: 40,
              width: 1,
              background: "rgba(14,26,43,0.10)",
              opacity: visible ? 1 : 0,
              transition: "opacity 1s ease-out 300ms",
            }} />
          )}

          {pages.map((page, i) => (
            <div
              key={page.num}
              style={{
                display: "flex",
                alignItems: "flex-start",
                gap: mobile ? 16 : 24,
                marginBottom: i < pages.length - 1 ? (mobile ? 24 : 32) : 0,
                paddingLeft: mobile ? 0 : 0,
                opacity: visible ? 1 : 0,
                transform: visible ? "translateY(0)" : "translateY(12px)",
                transition: `opacity 0.5s ease-out ${i * 100}ms, transform 0.5s ease-out ${i * 100}ms`,
              }}
            >
              {/* Node circle */}
              <div style={{
                width: 56,
                height: 56,
                borderRadius: "50%",
                backgroundColor: "#ffffff",
                border: "1px solid rgba(14,26,43,0.10)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
                position: "relative",
                zIndex: 2,
              }}>
                <span style={{ fontSize: 16, fontWeight: 600, color: B.teal }}>{page.num}</span>
              </div>

              {/* Content */}
              <div style={{ flex: 1, paddingTop: 4 }}>
                <div style={{ display: "flex", alignItems: "baseline", gap: 10, marginBottom: 4 }}>
                  <span style={{ fontSize: 11, fontWeight: 600, color: B.teal, textTransform: "uppercase" as const, letterSpacing: "0.08em" }}>Page {page.num}</span>
                  <span style={{ fontSize: 13, color: B.light }}>—</span>
                  <span style={{ fontSize: 13, fontWeight: 500, color: B.muted, fontStyle: "italic" }}>{page.question}</span>
                </div>
                <h3 style={{ fontSize: mobile ? 16 : 17, fontWeight: 600, color: B.navy, marginBottom: 6, letterSpacing: S.lsHeading }}>{page.title}</h3>
                <p style={{ fontSize: 14, color: B.muted, lineHeight: S.lhBody, margin: 0 }}>{page.desc}</p>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}

/* ReportCard removed — replaced by flowchart layout inline */

/* ================================================================== */
/* 4. CLASSIFICATION SCALE — Sand background                           */
/* ================================================================== */
function ClassificationScale() {
  const { ref, visible } = useInView();
  const mobile = useMobile();

  const bands = [
    {
      range: "0\u201329",
      label: "Limited Stability",
      color: B.bandLimited,
      width: "30%",
      desc: "The income structure is vulnerable and not yet protected against disruption.",
    },
    {
      range: "30\u201349",
      label: "Developing Stability",
      color: B.bandDeveloping,
      width: "20%",
      desc: "The structure is developing but still needs stronger protection in key areas.",
    },
    {
      range: "50\u201374",
      label: "Established Stability",
      color: B.bandEstablished,
      width: "25%",
      desc: "The structure has real stability but is not yet fully protected against disruption.",
    },
    {
      range: "75\u2013100",
      label: "High Stability",
      color: B.bandHigh,
      width: "25%",
      desc: "The structure is strong, well-protected, and resilient against most disruptions.",
    },
  ];

  return (
    <section
      ref={ref}
      aria-label="Classification Scale"
      style={{
        backgroundColor: B.sand,
        paddingTop: mobile ? S.sectionY.mobile : S.sectionY.desktop,
        paddingBottom: mobile ? S.sectionY.mobile : S.sectionY.desktop,
      }}
    >
      <div
        style={{
          maxWidth: S.maxW,
          marginLeft: "auto",
          marginRight: "auto",
          paddingLeft: mobile ? S.padX.mobile : S.padX.desktop,
          paddingRight: mobile ? S.padX.mobile : S.padX.desktop,
        }}
      >
        {/* Heading */}
        <div
          style={{
            textAlign: "center",
            marginBottom: S.subtextMb,
            opacity: visible ? 1 : 0,
            transform: visible ? "translateY(0)" : "translateY(12px)",
            transition: "opacity 0.5s ease-out, transform 0.5s ease-out",
          }}
        >
          <h2
            style={{
              fontSize: mobile ? 28 : 40,
              color: B.navy,
              fontFamily: DISPLAY_FONT,
              fontWeight: 400,
              letterSpacing: S.lsHeading,
              lineHeight: S.lhHeading,
              marginBottom: 12,
            }}
          >
            Income Stability Classification Scale
          </h2>
          <p
            style={{
              fontSize: 16,
              color: B.muted,
              lineHeight: S.lhBody,
              maxWidth: 480,
              marginLeft: "auto",
              marginRight: "auto",
            }}
          >
            Every score maps to a fixed stability band under Model RP-2.0.
          </p>
        </div>

        {/* Animated horizontal color bar */}
        <div style={{ maxWidth: 700, margin: "0 auto" }}>
          <div
            style={{
              display: "flex",
              height: 14,
              borderRadius: 7,
              overflow: "hidden",
              marginBottom: 32,
            }}
          >
            {bands.map((band, i) => (
              <div
                key={band.label}
                style={{
                  width: band.width,
                  backgroundColor: band.color,
                  transform: visible ? "scaleX(1)" : "scaleX(0)",
                  transformOrigin: "left center",
                  transition: `transform 0.6s ease-out ${200 + i * 150}ms`,
                }}
              />
            ))}
          </div>

          {/* 4-column grid below */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: mobile ? "1fr 1fr" : "repeat(4, 1fr)",
              gap: mobile ? 20 : 16,
            }}
          >
            {bands.map((band, i) => (
              <div
                key={band.label}
                style={{
                  textAlign: "center",
                  opacity: visible ? 1 : 0,
                  transform: visible ? "translateY(0)" : "translateY(8px)",
                  transition: `opacity 0.4s ease-out ${300 + i * 100}ms, transform 0.4s ease-out ${300 + i * 100}ms`,
                }}
              >
                <div
                  style={{
                    width: 10,
                    height: 10,
                    borderRadius: "50%",
                    backgroundColor: band.color,
                    margin: "0 auto 8px",
                  }}
                />
                <div
                  style={{
                    fontSize: 14,
                    fontWeight: 600,
                    color: B.navy,
                    marginBottom: 2,
                  }}
                >
                  {band.range}
                </div>
                <div
                  style={{
                    fontSize: 13,
                    fontWeight: 600,
                    color: band.color,
                    marginBottom: 6,
                  }}
                >
                  {band.label}
                </div>
                <div
                  style={{
                    fontSize: 12,
                    color: B.muted,
                    lineHeight: 1.5,
                  }}
                >
                  {band.desc}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div
          style={{
            textAlign: "center",
            marginTop: 44,
            fontSize: 13,
            color: B.muted,
            fontStyle: "italic",
            opacity: visible ? 1 : 0,
            transition: "opacity 0.5s ease-out 700ms",
          }}
        >
          Band thresholds are fixed under Model RP-2.0. The same answers produce
          the same score every time.
        </div>
      </div>
    </section>
  );
}

/* ================================================================== */
/* 5. SIX DIMENSIONS — White background                                */
/* ================================================================== */
function SixDimensions() {
  const { ref, visible } = useInView();
  const mobile = useMobile();

  const dimensions = [
    {
      num: "01",
      title: "Recurring Income",
      desc: "How much income continues from existing sources without new acquisition.",
      color: B.teal,
      icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={B.teal} strokeWidth="1.5" strokeLinecap="round"><path d="M17 1l4 4-4 4"/><path d="M3 11V9a4 4 0 014-4h14"/><path d="M7 23l-4-4 4-4"/><path d="M21 13v2a4 4 0 01-4 4H3"/></svg>,
    },
    {
      num: "02",
      title: "Concentration",
      desc: "How much depends on your single largest source.",
      color: B.purple,
      icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={B.purple} strokeWidth="1.5" strokeLinecap="round"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/></svg>,
    },
    {
      num: "03",
      title: "Source Diversity",
      desc: "How many meaningful income sources support the structure.",
      color: B.teal,
      icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={B.teal} strokeWidth="1.5" strokeLinecap="round"><path d="M16 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="8.5" cy="7" r="4"/><path d="M20 8v6M23 11h-6"/></svg>,
    },
    {
      num: "04",
      title: "Forward Visibility",
      desc: "How far ahead income is already committed or scheduled.",
      color: B.purple,
      icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={B.purple} strokeWidth="1.5" strokeLinecap="round"><path d="M2 12h20M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z"/><circle cx="12" cy="12" r="10"/></svg>,
    },
    {
      num: "05",
      title: "Variability",
      desc: "How sharply income moves between strong and weak months.",
      color: "#D97706",
      icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#D97706" strokeWidth="1.5" strokeLinecap="round"><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg>,
    },
    {
      num: "06",
      title: "Continuity",
      desc: "How much income would continue if active work stopped for 90 days.",
      color: B.navy,
      icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={B.navy} strokeWidth="1.5" strokeLinecap="round"><path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z"/><path d="M2 12h20"/><path d="M12 2v20"/></svg>,
    },
  ];

  return (
    <section
      ref={ref}
      aria-label="Six Dimensions"
      style={{
        backgroundColor: "#ffffff",
        paddingTop: mobile ? S.sectionY.mobile : S.sectionY.desktop,
        paddingBottom: mobile ? S.sectionY.mobile : S.sectionY.desktop,
      }}
    >
      <div
        style={{
          maxWidth: S.maxW,
          marginLeft: "auto",
          marginRight: "auto",
          paddingLeft: mobile ? S.padX.mobile : S.padX.desktop,
          paddingRight: mobile ? S.padX.mobile : S.padX.desktop,
        }}
      >
        {/* Heading */}
        <div
          style={{
            textAlign: "center",
            marginBottom: S.subtextMb,
            opacity: visible ? 1 : 0,
            transform: visible ? "translateY(0)" : "translateY(12px)",
            transition: "opacity 0.5s ease-out, transform 0.5s ease-out",
          }}
        >
          <h2
            style={{
              fontSize: mobile ? 28 : 40,
              color: B.navy,
              fontFamily: DISPLAY_FONT,
              fontWeight: 400,
              letterSpacing: S.lsHeading,
              lineHeight: S.lhHeading,
              marginBottom: 12,
            }}
          >
            What the model measures
          </h2>
          <p
            style={{
              fontSize: 16,
              color: B.muted,
              lineHeight: S.lhBody,
              maxWidth: 440,
              marginLeft: "auto",
              marginRight: "auto",
            }}
          >
            Your score is built from six structural dimensions.
          </p>
        </div>

        {/* 3-column icon grid */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: mobile ? "1fr" : "repeat(3, 1fr)",
            gap: mobile ? 24 : 32,
            maxWidth: 900,
            margin: "0 auto",
          }}
        >
          {dimensions.map((dim, i) => (
            <div
              key={dim.num}
              style={{
                textAlign: "center",
                opacity: visible ? 1 : 0,
                transform: visible ? "translateY(0)" : "translateY(16px)",
                transition: `opacity 0.5s ease-out ${i * 80}ms, transform 0.5s ease-out ${i * 80}ms`,
              }}
            >
              {/* Circular icon badge */}
              <div style={{
                width: 64,
                height: 64,
                borderRadius: "50%",
                backgroundColor: `${dim.color}10`,
                border: `1.5px solid ${dim.color}30`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                margin: "0 auto 16px",
              }}>
                {dim.icon}
              </div>
              <div style={{ fontSize: 10, fontWeight: 600, color: dim.color, letterSpacing: "0.1em", textTransform: "uppercase" as const, marginBottom: 6 }}>{dim.num}</div>
              <h3 style={{ fontSize: 16, fontWeight: 600, color: B.navy, marginBottom: 6, letterSpacing: S.lsHeading }}>{dim.title}</h3>
              <p style={{ fontSize: 14, color: B.muted, lineHeight: 1.6, margin: 0, maxWidth: 240, marginLeft: "auto", marginRight: "auto" }}>{dim.desc}</p>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div
          style={{
            textAlign: "center",
            marginTop: 44,
            fontSize: 12,
            color: B.muted,
            opacity: visible ? 1 : 0,
            transition: "opacity 0.5s ease-out 500ms",
          }}
        >
          Official Scoring Framework &middot; Model RP-2.0
        </div>
      </div>
    </section>
  );
}

/* DimensionCard removed — replaced by circular icon grid inline */

/* ================================================================== */
/* 6. CTA — Dark gradient                                              */
/* ================================================================== */
function CtaSection() {
  const { ref, visible } = useInView();
  const mobile = useMobile();
  const [hovered, setHovered] = useState(false);

  return (
    <section
      ref={ref}
      aria-label="Call to Action"
      style={{
        background: B.gradient,
        position: "relative",
        overflow: "hidden",
        paddingTop: mobile ? S.sectionY.mobile : S.sectionY.desktop,
        paddingBottom: mobile ? S.sectionY.mobile : S.sectionY.desktop,
      }}
    >
      {/* Radial glow */}
      <div
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          width: 700,
          height: 700,
          transform: "translate(-50%, -50%)",
          background:
            "radial-gradient(circle, rgba(75,63,174,0.15) 0%, transparent 70%)",
          pointerEvents: "none",
        }}
      />

      <div
        style={{
          maxWidth: S.maxW,
          marginLeft: "auto",
          marginRight: "auto",
          paddingLeft: mobile ? S.padX.mobile : S.padX.desktop,
          paddingRight: mobile ? S.padX.mobile : S.padX.desktop,
          position: "relative",
          zIndex: 1,
        }}
      >
        <div
          style={{
            textAlign: "center",
            opacity: visible ? 1 : 0,
            transform: visible ? "translateY(0)" : "translateY(16px)",
            transition: "opacity 0.6s ease-out, transform 0.6s ease-out",
          }}
        >
          <h2
            style={{
              fontSize: mobile ? 28 : 40,
              color: "#FAF9F7",
              fontFamily: DISPLAY_FONT,
              fontWeight: 400,
              letterSpacing: S.lsHeading,
              lineHeight: S.lhHeading,
              marginBottom: S.h2mb,
            }}
          >
            See where your income stands.
          </h2>
          <p
            style={{
              fontSize: 16,
              color: "rgba(250,249,247,0.70)",
              lineHeight: S.lhBody,
              maxWidth: 440,
              marginLeft: "auto",
              marginRight: "auto",
              marginBottom: 40,
            }}
          >
            Under two minutes. No bank connection. Instant delivery.
          </p>

          <a
            href={STRIPE_SINGLE}
            target="_blank"
            rel="noopener noreferrer"
            onMouseEnter={() => canHover() && setHovered(true)}
            onMouseLeave={() => setHovered(false)}
            style={{
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              height: mobile ? S.ctaHsm : S.ctaH,
              paddingLeft: mobile ? 24 : S.ctaPadX,
              paddingRight: mobile ? 24 : S.ctaPadX,
              borderRadius: S.ctaRadius,
              backgroundColor: "#FAF9F7",
              color: B.navy,
              fontSize: mobile ? 14 : 15,
              fontWeight: 600,
              letterSpacing: "0.01em",
              textDecoration: "none",
              boxShadow: hovered
                ? "0 8px 28px rgba(0,0,0,0.25)"
                : "0 4px 16px rgba(0,0,0,0.15)",
              transform: hovered ? "translateY(-2px)" : "translateY(0)",
              transition:
                "box-shadow 260ms ease, transform 260ms ease",
            }}
          >
            Get My Income Stability Score&trade; &mdash; $39
          </a>

          <div
            style={{
              marginTop: 20,
              fontSize: 12,
              color: "rgba(250,249,247,0.40)",
            }}
          >
            Model RP-2.0 &middot; Private by default
          </div>
        </div>
      </div>
    </section>
  );
}

/* ================================================================== */
/* MAIN EXPORT                                                         */
/* ================================================================== */
export default function HowItWorksPage() {
  return (
    <div>
      <Hero />
      <ThreeSteps />
      <ReportCovers />
      <ClassificationScale />
      <CtaSection />
    </div>
  );
}
