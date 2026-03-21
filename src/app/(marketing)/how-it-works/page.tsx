"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";

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
  sand: "#FAF9F7",
  sandDk: "#F4F1EA",
  offWhite: "#FEFDFB",
  muted: "#4B5563",
  light: "#9CA3AF",
  border: "#E6E9EF",
  gradient:
    "linear-gradient(135deg, #0E1A2B 0%, #1A1540 40%, #4B3FAE 70%, #1F6D7A 100%)",
  bandLimited: "#DC2626",
  bandDeveloping: "#D97706",
  bandEstablished: "#2563EB",
  bandHigh: "#16A34A",
};

const S = {
  sectionY: { desktop: 160, mobile: 88 },
  sectionYsm: { desktop: 120, mobile: 72 },
  transitionY: { desktop: 72, mobile: 48 },
  disclaimerY: { desktop: 24, mobile: 16 },
  maxW: 1060,
  padX: { desktop: 48, mobile: 24 },
  h1mb: 28,
  h2mb: 24,
  subtextMb: 56,
  paraMb: 24,
  labelMb: 16,
  cardPad: { desktop: 36, mobile: 24 },
  cardRadius: 16,
  panelRadius: 20,
  gridGap: 24,
  gridGapSm: 16,
  ctaH: 56,
  ctaHsm: 46,
  ctaPadX: 32,
  ctaRadius: 14,
  lhHeading: 1.08,
  lhBody: 1.75,
  lhDense: 1.5,
  lsHeading: "-0.025em",
  lsHero: "-0.035em",
  lsLabel: "0.14em",
};

const STRIPE_SINGLE = "https://buy.stripe.com/14A28j48E2socZQa2Z2Nq02";

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
              fontWeight: 700,
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
              fontWeight: 700,
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
            RunPayway turns six answers about your income structure into a fixed
            0&ndash;100 score, a complete structural breakdown, and a clear path
            to improvement &mdash; all under Model RP-2.0.
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
      body: "Each question measures a specific structural dimension \u2014 recurring income, concentration, forward visibility, variability, source diversity, and continuity without active work.",
    },
    {
      num: "2",
      title: "The model scores",
      subtitle: "Fixed rules, no AI",
      body: "Model RP-2.0 calculates your score from fixed scoring rules. The same answers always produce the same result. No AI, no human judgment, no variability.",
    },
    {
      num: "3",
      title: "Get your full report",
      subtitle: "Delivered instantly",
      body: "A 5-page diagnostic covering your score, what drives it, where the structure is exposed, how to improve, and what to do next. Personalized to your industry.",
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
              fontWeight: 600,
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
            fontWeight: 700,
          }}
        >
          {step.num}
        </span>
      </div>

      <h3
        style={{
          fontSize: 18,
          fontWeight: 700,
          color: B.navy,
          letterSpacing: S.lsHeading,
          marginBottom: 4,
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
      desc: "Where do you stand? Score, band, classification scale, key insight, resilience grade, and confidence level.",
      accent: B.purple,
    },
    {
      num: "02",
      title: "Why This Score",
      desc: "What is driving the result? Five structural drivers, constraint hierarchy, sensitivity ranking, and interaction effects.",
      accent: B.teal,
    },
    {
      num: "03",
      title: "What Could Go Wrong",
      desc: "Where is the structure exposed? Stress test, continuity window, structural scenarios, income mix, and peer comparison.",
      accent: B.purple,
    },
    {
      num: "04",
      title: "How to Improve",
      desc: "What would strengthen it? Projected score improvements, industry-tailored actions, and what not to do.",
      accent: B.teal,
    },
    {
      num: "05",
      title: "What to Do Next",
      desc: "What are the next steps? Action list, 90-day checklist, reassessment triggers, benchmarks, and verification.",
      accent: B.purple,
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
              fontWeight: 600,
              letterSpacing: S.lsHeading,
              lineHeight: S.lhHeading,
              marginBottom: 12,
            }}
          >
            What your report covers
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
            Each page answers one question about your income structure.
          </p>
        </div>

        {/* Stacked document cards */}
        <div
          style={{
            maxWidth: 700,
            margin: "0 auto",
            display: "flex",
            flexDirection: "column",
            gap: 16,
          }}
        >
          {pages.map((page, i) => (
            <ReportCard
              key={page.num}
              page={page}
              index={i}
              visible={visible}
              mobile={mobile}
            />
          ))}
        </div>

        {/* Sample report link */}
        <div
          style={{
            textAlign: "center",
            marginTop: 40,
            opacity: visible ? 1 : 0,
            transition: "opacity 0.5s ease-out 600ms",
          }}
        >
          <Link
            href="/sample-report"
            style={{
              fontSize: 15,
              fontWeight: 600,
              color: B.purple,
              textDecoration: "none",
              borderBottom: `1px solid rgba(75,63,174,0.3)`,
              paddingBottom: 2,
            }}
          >
            View the sample report &rarr;
          </Link>
        </div>
      </div>
    </section>
  );
}

function ReportCard({
  page,
  index,
  visible,
  mobile,
}: {
  page: { num: string; title: string; desc: string; accent: string };
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
        display: "flex",
        alignItems: "stretch",
        backgroundColor: B.sand,
        borderRadius: S.cardRadius,
        border: "1px solid rgba(14,26,43,0.06)",
        boxShadow: hovered
          ? "0 6px 20px rgba(14,26,43,0.07)"
          : "0 1px 4px rgba(14,26,43,0.03)",
        overflow: "hidden",
        opacity: visible ? 1 : 0,
        transform: visible
          ? hovered
            ? "translateY(-2px)"
            : "translateY(0)"
          : "translateY(12px)",
        transition: `opacity 0.5s ease-out ${index * 80}ms, transform 0.35s ease-out ${index * 80}ms, box-shadow 0.3s ease`,
      }}
    >
      {/* Left accent border */}
      <div
        style={{
          width: 4,
          flexShrink: 0,
          backgroundColor: page.accent,
          borderRadius: "16px 0 0 16px",
        }}
      />

      <div
        style={{
          flex: 1,
          padding: mobile ? "20px 20px 20px 20px" : "28px 32px 28px 28px",
          position: "relative",
        }}
      >
        {/* Large faded number */}
        <div
          style={{
            position: "absolute",
            top: mobile ? 12 : 16,
            right: mobile ? 16 : 24,
            fontSize: mobile ? 44 : 56,
            fontWeight: 800,
            color: "rgba(14,26,43,0.04)",
            lineHeight: 1,
            pointerEvents: "none",
          }}
        >
          {page.num}
        </div>

        <h3
          style={{
            fontSize: mobile ? 16 : 18,
            fontWeight: 700,
            color: B.navy,
            letterSpacing: S.lsHeading,
            marginBottom: 8,
          }}
        >
          {page.title}
        </h3>
        <p
          style={{
            fontSize: 14,
            color: B.muted,
            lineHeight: S.lhBody,
            margin: 0,
            maxWidth: 540,
          }}
        >
          {page.desc}
        </p>
      </div>
    </div>
  );
}

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
      desc: "Income structure is fragile and depends heavily on active work.",
    },
    {
      range: "30\u201349",
      label: "Developing Stability",
      color: B.bandDeveloping,
      width: "20%",
      desc: "Some support exists, but the structure is still exposed.",
    },
    {
      range: "50\u201374",
      label: "Established Stability",
      color: B.bandEstablished,
      width: "25%",
      desc: "Income reflects meaningful stability and stronger protection.",
    },
    {
      range: "75\u2013100",
      label: "High Stability",
      color: B.bandHigh,
      width: "25%",
      desc: "Income structure is durable and less dependent on constant effort.",
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
              fontWeight: 600,
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
                    fontWeight: 700,
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
      title: "Recurring or Continuing Income",
      desc: "How much income continues from existing sources without new acquisition.",
      accent: B.teal,
    },
    {
      num: "02",
      title: "Income Concentration",
      desc: "How much depends on your single largest source.",
      accent: B.purple,
    },
    {
      num: "03",
      title: "Source Diversity",
      desc: "How many meaningful income sources support the structure.",
      accent: B.teal,
    },
    {
      num: "04",
      title: "Forward Visibility",
      desc: "How far ahead income is already committed or scheduled.",
      accent: B.purple,
    },
    {
      num: "05",
      title: "Income Variability",
      desc: "How sharply income moves between strong and weak months.",
      accent: B.teal,
    },
    {
      num: "06",
      title: "Continuity Without Active Work",
      desc: "How much income would continue if active work stopped for 90 days.",
      accent: B.purple,
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
              fontWeight: 600,
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

        {/* 2x3 grid */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: mobile ? "1fr" : "1fr 1fr",
            gap: S.gridGap,
            maxWidth: 800,
            margin: "0 auto",
          }}
        >
          {dimensions.map((dim, i) => (
            <DimensionCard
              key={dim.num}
              dim={dim}
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

function DimensionCard({
  dim,
  index,
  visible,
  mobile,
}: {
  dim: { num: string; title: string; desc: string; accent: string };
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
        display: "flex",
        alignItems: "stretch",
        backgroundColor: B.sand,
        borderRadius: S.cardRadius,
        border: "1px solid rgba(14,26,43,0.06)",
        boxShadow: hovered
          ? "0 6px 20px rgba(14,26,43,0.07)"
          : "0 1px 4px rgba(14,26,43,0.03)",
        overflow: "hidden",
        position: "relative",
        opacity: visible ? 1 : 0,
        transform: visible
          ? hovered
            ? "translateY(-2px)"
            : "translateY(0)"
          : "translateY(12px)",
        transition: `opacity 0.5s ease-out ${index * 80}ms, transform 0.35s ease-out ${index * 80}ms, box-shadow 0.3s ease`,
      }}
    >
      {/* Left accent bar */}
      <div
        style={{
          width: 4,
          flexShrink: 0,
          backgroundColor: dim.accent,
          borderRadius: "16px 0 0 16px",
        }}
      />

      <div
        style={{
          flex: 1,
          padding: mobile ? "20px 20px 20px 20px" : "24px 28px 24px 24px",
          position: "relative",
        }}
      >
        {/* Large faded number top-right */}
        <div
          style={{
            position: "absolute",
            top: mobile ? 10 : 12,
            right: mobile ? 14 : 20,
            fontSize: mobile ? 40 : 48,
            fontWeight: 800,
            color: "rgba(14,26,43,0.04)",
            lineHeight: 1,
            pointerEvents: "none",
          }}
        >
          {dim.num}
        </div>

        <h3
          style={{
            fontSize: 16,
            fontWeight: 700,
            color: B.navy,
            letterSpacing: S.lsHeading,
            marginBottom: 8,
          }}
        >
          {dim.title}
        </h3>
        <p
          style={{
            fontSize: 14,
            color: B.muted,
            lineHeight: S.lhBody,
            margin: 0,
            maxWidth: 300,
          }}
        >
          {dim.desc}
        </p>
      </div>
    </div>
  );
}

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
              fontWeight: 600,
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
      <SixDimensions />
      <CtaSection />
    </div>
  );
}
