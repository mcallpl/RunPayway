"use client";

import { useState, useEffect, useRef } from "react";

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

const STRIPE_SINGLE = "https://buy.stripe.com/14A28j48E2socZQa2Z2Nq02";

/* ------------------------------------------------------------------ */
/*  Shared hooks                                                       */
/* ------------------------------------------------------------------ */
const canHover = () =>
  typeof window !== "undefined" &&
  window.matchMedia("(hover: hover)").matches;

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

function useAnimatedCounter(target: number, active: boolean, duration = 1500) {
  const [value, setValue] = useState(0);
  const animated = useRef(false);
  useEffect(() => {
    if (!active || animated.current) return;
    animated.current = true;
    const start = performance.now();
    const step = (now: number) => {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setValue(Math.round(eased * target));
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [active, target, duration]);
  return value;
}

/* ------------------------------------------------------------------ */
/*  Shared card wrapper                                                */
/* ------------------------------------------------------------------ */
function ReportCard({
  children,
  visible,
  delay = 0,
  mobile,
}: {
  children: React.ReactNode;
  visible: boolean;
  delay?: number;
  mobile: boolean;
}) {
  const [hovered, setHovered] = useState(false);
  return (
    <div
      onMouseEnter={() => canHover() && setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        maxWidth: 700,
        margin: "0 auto",
        backgroundColor: "#ffffff",
        border: "1px solid rgba(14,26,43,0.06)",
        borderRadius: 16,
        boxShadow: hovered
          ? "0 12px 40px rgba(14,26,43,0.10), 0 4px 12px rgba(14,26,43,0.05)"
          : "0 8px 32px rgba(14,26,43,0.06), 0 2px 8px rgba(14,26,43,0.03)",
        padding: mobile ? 24 : 32,
        position: "relative",
        overflow: "hidden",
        opacity: visible ? 1 : 0,
        transform: visible
          ? hovered
            ? "translateY(-2px)"
            : "translateY(0)"
          : "translateY(20px)",
        transition: `opacity 0.6s ease-out ${delay}ms, transform 0.4s ease-out ${visible ? 0 : delay}ms, box-shadow 0.3s ease`,
      }}
    >
      {/* Gradient accent bar */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: 3,
          background: `linear-gradient(90deg, ${B.purple}, ${B.teal})`,
        }}
      />
      {children}
    </div>
  );
}

function CardFooter({
  left,
  right,
}: {
  left: string;
  right: string;
}) {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        marginTop: 28,
        paddingTop: 16,
        borderTop: "1px solid rgba(14,26,43,0.06)",
      }}
    >
      <span style={{ fontSize: 11, color: B.light, fontWeight: 500 }}>
        {left}
      </span>
      <span style={{ fontSize: 11, color: B.light, fontWeight: 500 }}>
        {right}
      </span>
    </div>
  );
}

function SectionLabel({ label }: { label: string }) {
  const { ref, visible } = useInView();
  return (
    <div
      ref={ref}
      style={{
        textAlign: "center",
        padding: "48px 0 32px",
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(8px)",
        transition: "opacity 0.5s ease-out, transform 0.5s ease-out",
      }}
    >
      <span
        style={{
          fontSize: 11,
          fontWeight: 700,
          color: B.teal,
          letterSpacing: "0.14em",
          textTransform: "uppercase",
        }}
      >
        {label}
      </span>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Fade overlay component for progressive reveal                      */
/* ------------------------------------------------------------------ */
function FadeOverlay({
  overlayText,
  backgroundColor,
  fadeHeight,
  children,
}: {
  overlayText: string;
  backgroundColor: string;
  fadeHeight: number;
  children: React.ReactNode;
}) {
  return (
    <div style={{ position: "relative", overflow: "hidden", maxHeight: fadeHeight }}>
      <div>{children}</div>
      <div
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          height: "60%",
          background: `linear-gradient(180deg, transparent 0%, ${backgroundColor} 70%)`,
          display: "flex",
          alignItems: "flex-end",
          justifyContent: "center",
          paddingBottom: 24,
        }}
      >
        <div style={{ textAlign: "center" }}>
          <p style={{ fontSize: 15, color: B.navy, fontWeight: 500, marginBottom: 8 }}>
            {overlayText}
          </p>
          <a
            href={STRIPE_SINGLE}
            target="_blank"
            rel="noopener noreferrer"
            style={{ fontSize: 14, color: B.purple, fontWeight: 600, textDecoration: "underline" }}
          >
            Get my report &rarr;
          </a>
        </div>
      </div>
    </div>
  );
}

/* ================================================================== */
/* HERO                                                                */
/* ================================================================== */
function Hero() {
  const { ref, visible } = useInView();
  const mobile = useMobile();

  return (
    <section
      ref={ref}
      aria-label="Sample Report Hero"
      style={{
        background: B.gradient,
        position: "relative",
        overflow: "hidden",
        paddingTop: 160,
        paddingBottom: 100,
      }}
    >
      <div
        style={{
          position: "absolute",
          top: "30%",
          left: "50%",
          width: 800,
          height: 800,
          transform: "translate(-50%, -50%)",
          background:
            "radial-gradient(circle, rgba(75,63,174,0.25) 0%, transparent 70%)",
          pointerEvents: "none",
        }}
      />
      <div
        style={{
          maxWidth: 800,
          marginLeft: "auto",
          marginRight: "auto",
          paddingLeft: mobile ? 24 : 48,
          paddingRight: mobile ? 24 : 48,
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
              fontWeight: 700,
              letterSpacing: "0.14em",
              textTransform: "uppercase",
              color: "rgba(250,249,247,0.50)",
              marginBottom: 24,
            }}
          >
            SAMPLE REPORT
          </div>
          <h1
            className="text-[32px] md:text-[44px]"
            style={{
              color: "#FAF9F7",
              fontWeight: 700,
              letterSpacing: "-0.035em",
              lineHeight: 1.08,
              marginBottom: 24,
            }}
          >
            See what your report looks like.
          </h1>
          <p
            className="text-[15px] md:text-[17px]"
            style={{
              color: "rgba(250,249,247,0.70)",
              lineHeight: 1.75,
              maxWidth: 560,
              marginLeft: "auto",
              marginRight: "auto",
            }}
          >
            This is a sample report for a consulting professional scoring 78 out
            of 100. Your report will be personalized to your income structure,
            industry, and profile.
          </p>
        </div>
      </div>
    </section>
  );
}

/* ================================================================== */
/* PAGE 1: YOUR SCORE — ~90% REVEALED                                  */
/* ================================================================== */
function Page1Score() {
  const { ref, visible } = useInView();
  const mobile = useMobile();
  const score = useAnimatedCounter(78, visible, 1500);

  const bandSegments = [
    { range: "0\u201329", label: "Limited Stability", color: B.bandLimited },
    { range: "30\u201349", label: "Developing Stability", color: B.bandDeveloping },
    { range: "50\u201374", label: "Established Stability", color: B.bandEstablished },
    { range: "75\u2013100", label: "High Stability", color: B.bandHigh, active: true },
  ];

  const metrics = [
    { label: "Continuity", value: "38%", accent: B.teal },
    { label: "Stress Test", value: "78 \u2192 56", accent: B.bandLimited },
    {
      label: "Main Constraint",
      value: "Too little income secured ahead",
      accent: B.purple,
      small: true,
    },
    { label: "How Resilient", value: "Supported", accent: B.bandHigh },
  ];

  return (
    <section
      ref={ref}
      aria-label="Page 1 — Your Score"
      style={{
        backgroundColor: "#ffffff",
        paddingTop: mobile ? 48 : 0,
        paddingBottom: mobile ? 48 : 64,
        paddingLeft: mobile ? 16 : 24,
        paddingRight: mobile ? 16 : 24,
      }}
    >
      <SectionLabel label="PAGE 1 — WHERE DO I STAND?" />
      <ReportCard visible={visible} mobile={mobile} delay={100}>
        {/* Header */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 24,
            marginTop: 8,
            flexWrap: "wrap",
            gap: 8,
          }}
        >
          <span
            style={{
              fontSize: 13,
              fontWeight: 700,
              color: B.navy,
              letterSpacing: "0.06em",
            }}
          >
            RUNPAYWAY&trade;
          </span>
          <span style={{ fontSize: 11, color: B.light }}>
            Income Stability Score&trade; &middot; Model RP-2.0
          </span>
        </div>

        {/* Overline + title */}
        <div
          style={{
            fontSize: 10,
            fontWeight: 700,
            letterSpacing: "0.14em",
            textTransform: "uppercase",
            color: B.teal,
            marginBottom: 8,
          }}
        >
          YOUR INCOME STABILITY REPORT
        </div>
        <h2
          style={{
            fontSize: 22,
            fontWeight: 700,
            color: B.navy,
            marginBottom: 20,
          }}
        >
          Your Score
        </h2>

        {/* Score + band */}
        <div
          style={{
            display: "flex",
            alignItems: "baseline",
            gap: 16,
            marginBottom: 8,
          }}
        >
          <span
            className="text-[48px] md:text-[64px]"
            style={{ fontWeight: 700, color: B.navy, lineHeight: 1 }}
          >
            {score}
          </span>
          <span
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 6,
              backgroundColor: "rgba(22,163,74,0.08)",
              color: B.bandHigh,
              fontWeight: 600,
              fontSize: 14,
              padding: "4px 14px",
              borderRadius: 100,
            }}
          >
            <span
              style={{
                width: 8,
                height: 8,
                borderRadius: "50%",
                backgroundColor: B.bandHigh,
              }}
            />
            High Stability
          </span>
        </div>
        <div
          style={{
            fontSize: 13,
            color: B.muted,
            marginBottom: 28,
          }}
        >
          <span style={{ fontWeight: 600, color: B.navy }}>
            72nd percentile
          </span>{" "}
          among Professional Services
        </div>

        {/* Classification scale bar */}
        <div style={{ marginBottom: 8 }}>
          <div
            style={{
              display: "flex",
              borderRadius: 6,
              overflow: "hidden",
              height: 10,
            }}
          >
            {bandSegments.map((seg) => (
              <div
                key={seg.label}
                style={{
                  flex:
                    seg.label === "High"
                      ? 26
                      : seg.label === "Limited"
                        ? 30
                        : seg.label === "Developing"
                          ? 20
                          : 25,
                  backgroundColor: seg.color,
                  opacity: seg.active ? 1 : 0.25,
                }}
              />
            ))}
          </div>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              marginTop: 6,
            }}
          >
            {bandSegments.map((seg) => (
              <span
                key={seg.label}
                style={{
                  fontSize: 10,
                  color: seg.active ? seg.color : B.light,
                  fontWeight: seg.active ? 700 : 500,
                }}
              >
                {seg.range} {seg.label}
              </span>
            ))}
          </div>
        </div>

        {/* Divider */}
        <div
          style={{
            height: 1,
            background: "rgba(14,26,43,0.06)",
            margin: "24px 0",
          }}
        />

        {/* Key insight */}
        <div
          style={{
            borderLeft: `3px solid ${B.purple}`,
            padding: "14px 18px",
            backgroundColor: "rgba(75,63,174,0.04)",
            borderRadius: "0 8px 8px 0",
            marginBottom: 24,
          }}
        >
          <p
            style={{
              fontSize: 14,
              color: B.navy,
              lineHeight: 1.6,
              margin: 0,
              fontWeight: 500,
            }}
          >
            The biggest structural weak point is limited forward visibility.
            Improving forward secured income could add 8 points.
          </p>
        </div>

        {/* 4 metric cards */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: mobile ? "1fr" : "1fr 1fr 1fr 1fr",
            gap: 12,
            marginBottom: 24,
          }}
        >
          {metrics.map((m) => (
            <div
              key={m.label}
              style={{
                borderLeft: `3px solid ${m.accent}`,
                padding: "12px 14px",
                backgroundColor: B.sand,
                borderRadius: "0 8px 8px 0",
              }}
            >
              <div
                style={{
                  fontSize: 10,
                  fontWeight: 700,
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                  color: B.light,
                  marginBottom: 6,
                }}
              >
                {m.label}
              </div>
              <div
                style={{
                  fontSize: m.small ? 12 : 16,
                  fontWeight: 700,
                  color: B.navy,
                  lineHeight: 1.3,
                }}
              >
                {m.value}
              </div>
            </div>
          ))}
        </div>

        {/* Metadata row */}
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: mobile ? 8 : 16,
            fontSize: 12,
            color: B.muted,
          }}
        >
          <span>
            Confidence: <strong style={{ color: B.navy }}>High</strong>
          </span>
          <span style={{ color: B.light }}>&middot;</span>
          <span>
            Durability: <strong style={{ color: B.navy }}>Durable</strong>
          </span>
          <span style={{ color: B.light }}>&middot;</span>
          <span>
            Structure: <strong style={{ color: B.navy }}>42/60</strong>
          </span>
          <span style={{ color: B.light }}>&middot;</span>
          <span>
            Stability: <strong style={{ color: B.navy }}>29/40</strong>
          </span>
        </div>

        <CardFooter left="Your Score · Page 1" right="Model RP-2.0" />
      </ReportCard>
    </section>
  );
}

/* ================================================================== */
/* PAGE 2: WHY THIS SCORE — ~65% REVEALED                             */
/* ================================================================== */
function Page2WhyThisScore() {
  const { ref, visible } = useInView();
  const mobile = useMobile();

  const drivers = [
    { label: "Continuity", level: "Moderate", pct: 45, color: B.bandDeveloping },
    { label: "Income Secured Ahead", level: "Low", pct: 18, color: B.bandLimited },
    { label: "Source Diversification", level: "Moderate", pct: 50, color: B.bandDeveloping },
    { label: "Dependence on Work", level: "High", pct: 75, color: B.bandLimited },
    { label: "Dependence on One Source", level: "Moderate", pct: 50, color: B.bandDeveloping },
  ];

  const constraints = [
    { rank: "PRIMARY", text: "Too little income secured ahead" },
    { rank: "SECONDARY", text: "Too much dependence on active work" },
    { rank: "CONTRIBUTING", text: "Income does not continue long enough" },
  ];

  const improvements = [
    { change: "+15 forward secured %", pts: "+8 pts", best: true },
    { change: "\u221215 labor dependence %", pts: "+5 pts", best: false },
    { change: "+15 income persistence %", pts: "+3 pts", best: false },
  ];

  return (
    <section
      ref={ref}
      aria-label="Page 2 — Why This Score"
      style={{
        backgroundColor: B.sand,
        paddingTop: mobile ? 48 : 0,
        paddingBottom: mobile ? 48 : 64,
        paddingLeft: mobile ? 16 : 24,
        paddingRight: mobile ? 16 : 24,
      }}
    >
      <SectionLabel label="PAGE 2 — WHY THIS SCORE?" />
      <ReportCard visible={visible} mobile={mobile} delay={100}>
        <h2
          style={{
            fontSize: 22,
            fontWeight: 700,
            color: B.navy,
            marginBottom: 24,
            marginTop: 8,
          }}
        >
          Why This Score
        </h2>

        {/* Driver bars — fully visible */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: mobile ? "1fr" : "1.4fr 1fr",
            gap: mobile ? 28 : 32,
            marginBottom: 28,
          }}
        >
          {/* LEFT: drivers */}
          <div>
            {drivers.map((d, i) => (
              <div
                key={d.label}
                style={{ marginBottom: i < drivers.length - 1 ? 18 : 0 }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "baseline",
                    marginBottom: 6,
                  }}
                >
                  <span
                    style={{ fontSize: 13, fontWeight: 600, color: B.navy }}
                  >
                    {d.label}
                  </span>
                  <span
                    style={{
                      fontSize: 11,
                      fontWeight: 600,
                      color: d.color,
                    }}
                  >
                    {d.level}
                  </span>
                </div>
                <div
                  style={{
                    height: 7,
                    borderRadius: 4,
                    backgroundColor: "rgba(14,26,43,0.06)",
                    overflow: "hidden",
                  }}
                >
                  <div
                    style={{
                      height: "100%",
                      borderRadius: 4,
                      backgroundColor: d.color,
                      width: visible ? `${d.pct}%` : "0%",
                      transition: `width 0.8s ease-out ${200 + i * 100}ms`,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>

          {/* RIGHT: Constraint Hierarchy — fully visible */}
          <div
            style={{
              backgroundColor: B.sand,
              borderRadius: 12,
              padding: mobile ? 16 : 20,
            }}
          >
            <div
              style={{
                fontSize: 10,
                fontWeight: 700,
                letterSpacing: "0.12em",
                textTransform: "uppercase",
                color: B.teal,
                marginBottom: 16,
              }}
            >
              CONSTRAINT HIERARCHY
            </div>
            {constraints.map((c, i) => (
              <div
                key={c.rank}
                style={{
                  marginBottom: i < constraints.length - 1 ? 14 : 0,
                }}
              >
                <div
                  style={{
                    fontSize: 9,
                    fontWeight: 700,
                    letterSpacing: "0.1em",
                    color:
                      c.rank === "PRIMARY"
                        ? B.bandLimited
                        : c.rank === "SECONDARY"
                          ? B.bandDeveloping
                          : B.light,
                    marginBottom: 3,
                    textTransform: "uppercase",
                  }}
                >
                  {c.rank}
                </div>
                <div
                  style={{
                    fontSize: 13,
                    color: B.navy,
                    fontWeight: 500,
                    lineHeight: 1.4,
                  }}
                >
                  {c.text}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Divider */}
        <div
          style={{
            height: 1,
            background: "rgba(14,26,43,0.06)",
            margin: "4px 0 24px",
          }}
        />

        {/* Sensitivity ranking — FADED: first item visible, rest hidden */}
        <FadeOverlay
          overlayText="Full sensitivity analysis included in your report"
          backgroundColor="#ffffff"
          fadeHeight={180}
        >
          <div
            style={{
              fontSize: 14,
              fontWeight: 700,
              color: B.navy,
              marginBottom: 14,
            }}
          >
            Which changes help most
          </div>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: mobile ? "1fr" : "1fr 1fr 1fr",
              gap: 10,
            }}
          >
            {improvements.map((imp, i) => (
              <div
                key={i}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  padding: "10px 14px",
                  backgroundColor: B.sand,
                  borderRadius: 8,
                  border: imp.best
                    ? "1px solid rgba(22,163,74,0.2)"
                    : "1px solid rgba(14,26,43,0.06)",
                }}
              >
                <span
                  style={{
                    fontSize: 14,
                    fontWeight: 700,
                    color: B.light,
                    flexShrink: 0,
                  }}
                >
                  {i + 1}.
                </span>
                <div>
                  <div
                    style={{
                      fontSize: 12,
                      color: B.navy,
                      fontWeight: 500,
                      marginBottom: 2,
                    }}
                  >
                    {imp.change}
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                    <span
                      style={{
                        fontSize: 13,
                        fontWeight: 700,
                        color: B.bandHigh,
                      }}
                    >
                      {imp.pts}
                    </span>
                    {imp.best && (
                      <span
                        style={{
                          fontSize: 9,
                          fontWeight: 700,
                          letterSpacing: "0.06em",
                          color: "#ffffff",
                          backgroundColor: B.bandHigh,
                          padding: "2px 6px",
                          borderRadius: 4,
                          textTransform: "uppercase",
                        }}
                      >
                        BEST
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </FadeOverlay>

        <CardFooter left="Why This Score · Page 2" right="Model RP-2.0" />
      </ReportCard>
    </section>
  );
}

/* ================================================================== */
/* PAGE 3: WHAT COULD GO WRONG — ~40% REVEALED                        */
/* ================================================================== */
function Page3WhatCouldGoWrong() {
  const { ref, visible } = useInView();
  const mobile = useMobile();

  const scenarios = [
    {
      severity: "SIGNIFICANT",
      title: "Largest Source Removed",
      from: 78,
      to: 56,
      diff: -22,
      bandDrop: null,
    },
    {
      severity: "BAND DROP",
      title: "Active Labor Interrupted",
      from: 78,
      to: 34,
      diff: -44,
      bandDrop: "Limited Stability",
    },
    {
      severity: "MODERATE",
      title: "Forward Commitments Delayed",
      from: 78,
      to: 65,
      diff: -13,
      bandDrop: null,
    },
  ];

  const structureMix = [
    { label: "Active", pct: 62, color: B.navy },
    { label: "Recurring", pct: 25, color: B.teal },
    { label: "Built-In", pct: 13, color: B.purple },
  ];

  return (
    <section
      ref={ref}
      aria-label="Page 3 — What Could Go Wrong"
      style={{
        backgroundColor: "#ffffff",
        paddingTop: mobile ? 48 : 0,
        paddingBottom: mobile ? 48 : 64,
        paddingLeft: mobile ? 16 : 24,
        paddingRight: mobile ? 16 : 24,
      }}
    >
      <SectionLabel label="PAGE 3 — WHAT COULD GO WRONG?" />
      <ReportCard visible={visible} mobile={mobile} delay={100}>
        <h2
          style={{
            fontSize: 22,
            fontWeight: 700,
            color: B.navy,
            marginBottom: 24,
            marginTop: 8,
          }}
        >
          What Could Go Wrong
        </h2>

        {/* Two summary cards — VISIBLE */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: mobile ? "1fr" : "1fr 1fr",
            gap: 12,
            marginBottom: 24,
          }}
        >
          <div
            style={{
              padding: "18px 20px",
              backgroundColor: B.sand,
              borderRadius: 12,
              textAlign: "center",
            }}
          >
            <div
              style={{
                fontSize: 10,
                fontWeight: 700,
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                color: B.light,
                marginBottom: 10,
              }}
            >
              STRESS TEST
            </div>
            <div
              style={{
                display: "flex",
                alignItems: "baseline",
                justifyContent: "center",
                gap: 8,
              }}
            >
              <span style={{ fontSize: 32, fontWeight: 700, color: B.navy }}>
                78
              </span>
              <span style={{ fontSize: 18, color: B.light }}>&rarr;</span>
              <span
                style={{
                  fontSize: 32,
                  fontWeight: 700,
                  color: B.bandLimited,
                }}
              >
                56
              </span>
            </div>
          </div>
          <div
            style={{
              padding: "18px 20px",
              backgroundColor: B.sand,
              borderRadius: 12,
              textAlign: "center",
            }}
          >
            <div
              style={{
                fontSize: 10,
                fontWeight: 700,
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                color: B.light,
                marginBottom: 10,
              }}
            >
              CONTINUITY WINDOW
            </div>
            <div style={{ fontSize: 32, fontWeight: 700, color: B.navy }}>
              4{" "}
              <span style={{ fontSize: 16, fontWeight: 500, color: B.muted }}>
                months
              </span>
            </div>
          </div>
        </div>

        {/* BELOW: scenarios, income mix, peer comparison — FADED */}
        <FadeOverlay
          overlayText="See your full risk exposure and peer comparison"
          backgroundColor="#ffffff"
          fadeHeight={320}
        >
          {/* Scenario rows */}
          <div style={{ marginBottom: 24 }}>
            {scenarios.map((s, i) => (
              <div
                key={s.title}
                style={{
                  display: "flex",
                  alignItems: mobile ? "flex-start" : "center",
                  flexDirection: mobile ? "column" : "row",
                  gap: mobile ? 6 : 16,
                  padding: "14px 16px",
                  backgroundColor: i % 2 === 0 ? B.sand : "transparent",
                  borderRadius: 8,
                  marginBottom: 4,
                }}
              >
                <span
                  style={{
                    fontSize: 9,
                    fontWeight: 700,
                    letterSpacing: "0.08em",
                    textTransform: "uppercase",
                    color:
                      s.severity === "BAND DROP"
                        ? B.bandLimited
                        : s.severity === "SIGNIFICANT"
                          ? B.bandDeveloping
                          : B.muted,
                    minWidth: mobile ? "auto" : 90,
                    flexShrink: 0,
                  }}
                >
                  {s.severity}
                </span>
                <span
                  style={{
                    fontSize: 13,
                    fontWeight: 600,
                    color: B.navy,
                    flex: 1,
                  }}
                >
                  {s.title}
                </span>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 6,
                    flexShrink: 0,
                  }}
                >
                  <span style={{ fontSize: 14, fontWeight: 700, color: B.navy }}>
                    {s.from}
                  </span>
                  <span style={{ fontSize: 12, color: B.light }}>&rarr;</span>
                  <span
                    style={{
                      fontSize: 14,
                      fontWeight: 700,
                      color: B.bandLimited,
                    }}
                  >
                    {s.to}
                  </span>
                  <span
                    style={{
                      fontSize: 11,
                      color: B.bandLimited,
                      fontWeight: 600,
                    }}
                  >
                    ({s.diff})
                  </span>
                  {s.bandDrop && (
                    <span
                      style={{
                        fontSize: 10,
                        fontWeight: 600,
                        color: "#ffffff",
                        backgroundColor: B.bandLimited,
                        padding: "2px 8px",
                        borderRadius: 4,
                        marginLeft: 4,
                      }}
                    >
                      {s.bandDrop}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Income Structure Mix */}
          <div
            style={{
              fontSize: 12,
              fontWeight: 700,
              color: B.navy,
              marginBottom: 10,
            }}
          >
            Income Structure Mix
          </div>
          <div
            style={{
              display: "flex",
              borderRadius: 6,
              overflow: "hidden",
              height: 10,
              marginBottom: 8,
            }}
          >
            {structureMix.map((s) => (
              <div
                key={s.label}
                style={{ flex: s.pct, backgroundColor: s.color }}
              />
            ))}
          </div>
          <div
            style={{
              display: "flex",
              gap: 16,
              flexWrap: "wrap",
              marginBottom: 24,
            }}
          >
            {structureMix.map((s) => (
              <div
                key={s.label}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 6,
                  fontSize: 11,
                  color: B.muted,
                }}
              >
                <span
                  style={{
                    width: 8,
                    height: 8,
                    borderRadius: 2,
                    backgroundColor: s.color,
                    flexShrink: 0,
                  }}
                />
                {s.label} {s.pct}%
              </div>
            ))}
          </div>

          {/* Peer comparison bar */}
          <div
            style={{
              fontSize: 12,
              fontWeight: 700,
              color: B.navy,
              marginBottom: 10,
            }}
          >
            Peer Comparison — Professional Services
          </div>
          <div
            style={{
              display: "flex",
              borderRadius: 6,
              overflow: "hidden",
              height: 10,
              marginBottom: 8,
            }}
          >
            <div
              style={{ flex: 12, backgroundColor: B.bandLimited, opacity: 0.6 }}
            />
            <div
              style={{ flex: 22, backgroundColor: B.bandDeveloping, opacity: 0.6 }}
            />
            <div
              style={{ flex: 38, backgroundColor: B.bandEstablished, opacity: 0.6 }}
            />
            <div
              style={{ flex: 28, backgroundColor: B.bandHigh, opacity: 0.8 }}
            />
          </div>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              fontSize: 10,
              color: B.light,
            }}
          >
            <span>Limited (12%)</span>
            <span>Developing (22%)</span>
            <span>Established (38%)</span>
            <span>High (28%)</span>
          </div>
        </FadeOverlay>

        <CardFooter left="What Could Go Wrong · Page 3" right="Model RP-2.0" />
      </ReportCard>
    </section>
  );
}

/* ================================================================== */
/* PAGE 4: HOW TO IMPROVE — ~20% REVEALED                             */
/* ================================================================== */
function Page4HowToImprove() {
  const { ref, visible } = useInView();
  const mobile = useMobile();

  return (
    <section
      ref={ref}
      aria-label="Page 4 — How to Improve"
      style={{
        backgroundColor: B.sand,
        paddingTop: mobile ? 48 : 0,
        paddingBottom: mobile ? 48 : 64,
        paddingLeft: mobile ? 16 : 24,
        paddingRight: mobile ? 16 : 24,
      }}
    >
      <SectionLabel label="PAGE 4 — HOW TO IMPROVE?" />
      <ReportCard visible={visible} mobile={mobile} delay={100}>
        <h2
          style={{
            fontSize: 22,
            fontWeight: 700,
            color: B.navy,
            marginBottom: 24,
            marginTop: 8,
          }}
        >
          How to Improve
        </h2>

        {/* First line — VISIBLE */}
        <div
          style={{
            display: "flex",
            alignItems: mobile ? "flex-start" : "center",
            flexDirection: mobile ? "column" : "row",
            gap: mobile ? 6 : 16,
            padding: "12px 16px",
            backgroundColor: B.sand,
            borderRadius: 8,
            marginBottom: 4,
          }}
        >
          <span
            style={{
              fontSize: 10,
              fontWeight: 700,
              color: B.light,
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              minWidth: mobile ? "auto" : 60,
              flexShrink: 0,
            }}
          >
            Option 1
          </span>
          <span
            style={{
              fontSize: 13,
              fontWeight: 600,
              color: B.navy,
              flex: 1,
            }}
          >
            Extend Forward Visibility
          </span>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 6,
              flexShrink: 0,
            }}
          >
            <span style={{ fontSize: 14, fontWeight: 700, color: B.navy }}>
              78
            </span>
            <span style={{ fontSize: 12, color: B.light }}>&rarr;</span>
            <span
              style={{ fontSize: 14, fontWeight: 700, color: B.bandHigh }}
            >
              86
            </span>
            <span
              style={{ fontSize: 11, fontWeight: 600, color: B.bandHigh }}
            >
              (+8)
            </span>
          </div>
        </div>

        {/* Everything else — BLURRED */}
        <div style={{ position: "relative" }}>
          <div
            style={{
              filter: "blur(6px)",
              pointerEvents: "none",
              userSelect: "none",
            }}
          >
            {/* Option 2 */}
            <div
              style={{
                display: "flex",
                alignItems: mobile ? "flex-start" : "center",
                flexDirection: mobile ? "column" : "row",
                gap: mobile ? 6 : 16,
                padding: "12px 16px",
                borderRadius: 8,
                marginBottom: 4,
              }}
            >
              <span
                style={{
                  fontSize: 10,
                  fontWeight: 700,
                  color: B.light,
                  letterSpacing: "0.08em",
                  textTransform: "uppercase",
                  minWidth: mobile ? "auto" : 60,
                  flexShrink: 0,
                }}
              >
                Option 2
              </span>
              <span
                style={{ fontSize: 13, fontWeight: 600, color: B.navy, flex: 1 }}
              >
                Reduce Labor Dependence
              </span>
              <div style={{ display: "flex", alignItems: "center", gap: 6, flexShrink: 0 }}>
                <span style={{ fontSize: 14, fontWeight: 700, color: B.navy }}>78</span>
                <span style={{ fontSize: 12, color: B.light }}>&rarr;</span>
                <span style={{ fontSize: 14, fontWeight: 700, color: B.bandHigh }}>83</span>
                <span style={{ fontSize: 11, fontWeight: 600, color: B.bandHigh }}>(+5)</span>
              </div>
            </div>

            {/* Option 3 */}
            <div
              style={{
                display: "flex",
                alignItems: mobile ? "flex-start" : "center",
                flexDirection: mobile ? "column" : "row",
                gap: mobile ? 6 : 16,
                padding: "12px 16px",
                backgroundColor: B.sand,
                borderRadius: 8,
                marginBottom: 4,
              }}
            >
              <span
                style={{
                  fontSize: 10,
                  fontWeight: 700,
                  color: B.light,
                  letterSpacing: "0.08em",
                  textTransform: "uppercase",
                  minWidth: mobile ? "auto" : 60,
                  flexShrink: 0,
                }}
              >
                Option 3
              </span>
              <span
                style={{ fontSize: 13, fontWeight: 600, color: B.navy, flex: 1 }}
              >
                Increase Persistent Revenue
              </span>
              <div style={{ display: "flex", alignItems: "center", gap: 6, flexShrink: 0 }}>
                <span style={{ fontSize: 14, fontWeight: 700, color: B.navy }}>78</span>
                <span style={{ fontSize: 12, color: B.light }}>&rarr;</span>
                <span style={{ fontSize: 14, fontWeight: 700, color: B.bandHigh }}>81</span>
                <span style={{ fontSize: 11, fontWeight: 600, color: B.bandHigh }}>(+3)</span>
              </div>
            </div>

            {/* Combined score */}
            <div
              style={{
                textAlign: "center",
                padding: "16px 20px",
                backgroundColor: "rgba(75,63,174,0.04)",
                borderRadius: 10,
                marginBottom: 28,
                border: "1px solid rgba(75,63,174,0.08)",
                marginTop: 20,
              }}
            >
              <span style={{ fontSize: 13, color: B.muted }}>Combined: </span>
              <span style={{ fontSize: 15, fontWeight: 700, color: B.navy }}>
                Score would reach{" "}
              </span>
              <span style={{ fontSize: 20, fontWeight: 700, color: B.purple }}>91</span>
              <span style={{ fontSize: 13, fontWeight: 600, color: B.bandHigh }}>
                {" "}(+13 points)
              </span>
            </div>

            {/* Divider */}
            <div
              style={{
                height: 1,
                background: "rgba(14,26,43,0.06)",
                marginBottom: 24,
              }}
            />

            {/* 3 priority actions */}
            <div style={{ marginBottom: 24 }}>
              {[
                { rank: 1, title: "Extend forward commitments", desc: "Create more income already committed before the month begins." },
                { rank: 2, title: "Reduce dependence on active work", desc: "Build income that continues without daily effort." },
                { rank: 3, title: "Strengthen recurring base", desc: "Convert one-time work into repeating revenue." },
              ].map((p, i) => (
                <div
                  key={p.rank}
                  style={{
                    display: "flex",
                    gap: 14,
                    alignItems: "flex-start",
                    marginBottom: i < 2 ? 18 : 0,
                  }}
                >
                  <div
                    style={{
                      width: 26,
                      height: 26,
                      borderRadius: "50%",
                      backgroundColor: "rgba(75,63,174,0.08)",
                      color: B.purple,
                      fontSize: 12,
                      fontWeight: 700,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: 0,
                      marginTop: 1,
                    }}
                  >
                    {p.rank}
                  </div>
                  <div>
                    <div
                      style={{
                        fontSize: 14,
                        fontWeight: 600,
                        color: B.navy,
                        marginBottom: 3,
                      }}
                    >
                      {p.title}
                    </div>
                    <div
                      style={{ fontSize: 13, color: B.muted, lineHeight: 1.5 }}
                    >
                      {p.desc}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Overlay on blurred area */}
          <div
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <div style={{ textAlign: "center" }}>
              <p
                style={{
                  fontSize: 15,
                  color: B.navy,
                  fontWeight: 500,
                  marginBottom: 8,
                }}
              >
                Your improvement path is waiting
              </p>
              <a
                href={STRIPE_SINGLE}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  fontSize: 14,
                  color: B.purple,
                  fontWeight: 600,
                  textDecoration: "underline",
                }}
              >
                Get my report &rarr;
              </a>
            </div>
          </div>
        </div>

        <CardFooter left="How to Improve · Page 4" right="Model RP-2.0" />
      </ReportCard>
    </section>
  );
}

/* ================================================================== */
/* PAGE 5: WHAT TO DO NEXT — ~5% REVEALED (LOCKED)                     */
/* ================================================================== */
function Page5WhatToDoNext() {
  const { ref, visible } = useInView();
  const mobile = useMobile();
  const [hovered, setHovered] = useState(false);

  return (
    <section
      ref={ref}
      aria-label="Page 5 — What to Do Next"
      style={{
        backgroundColor: "#ffffff",
        paddingTop: mobile ? 48 : 0,
        paddingBottom: mobile ? 48 : 64,
        paddingLeft: mobile ? 16 : 24,
        paddingRight: mobile ? 16 : 24,
      }}
    >
      <SectionLabel label="PAGE 5 — WHAT TO DO NEXT?" />
      <ReportCard visible={visible} mobile={mobile} delay={100}>
        {/* Title — visible but dimmed */}
        <h2
          style={{
            fontSize: 22,
            fontWeight: 700,
            color: B.navy,
            marginBottom: 24,
            marginTop: 8,
            opacity: 0.5,
          }}
        >
          What to Do Next
        </h2>

        {/* ALL content — heavily blurred */}
        <div style={{ position: "relative" }}>
          <div
            style={{
              filter: "blur(8px)",
              pointerEvents: "none",
              userSelect: "none",
            }}
          >
            {/* Main takeaway */}
            <div
              style={{
                borderLeft: `3px solid ${B.teal}`,
                padding: "14px 18px",
                backgroundColor: "rgba(31,109,122,0.04)",
                borderRadius: "0 8px 8px 0",
                marginBottom: 24,
              }}
            >
              <p
                style={{
                  fontSize: 14,
                  color: B.navy,
                  lineHeight: 1.6,
                  margin: 0,
                  fontWeight: 500,
                }}
              >
                Your income scores in the High Stability band, but forward
                visibility is the clear structural gap. Addressing it first
                creates the largest improvement per effort.
              </p>
            </div>

            {/* Do / Avoid side by side */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: mobile ? "1fr" : "1fr 1fr",
                gap: 16,
                marginBottom: 28,
              }}
            >
              <div
                style={{
                  padding: "16px 18px",
                  backgroundColor: "rgba(22,163,74,0.04)",
                  borderRadius: 10,
                  border: "1px solid rgba(22,163,74,0.08)",
                }}
              >
                <div
                  style={{
                    fontSize: 10,
                    fontWeight: 700,
                    letterSpacing: "0.1em",
                    textTransform: "uppercase",
                    color: B.bandHigh,
                    marginBottom: 12,
                  }}
                >
                  DO
                </div>
                {[
                  "Extend at least one client engagement into a forward commitment.",
                  "Diversify income so no single source exceeds 40% of total.",
                  "Introduce a recurring revenue component that pays monthly.",
                ].map((item, i) => (
                  <div
                    key={i}
                    style={{
                      display: "flex",
                      gap: 8,
                      marginBottom: i < 2 ? 10 : 0,
                      fontSize: 13,
                      color: B.navy,
                      lineHeight: 1.5,
                    }}
                  >
                    <span style={{ fontWeight: 700, color: B.bandHigh, flexShrink: 0 }}>
                      {i + 1}.
                    </span>
                    <span>{item}</span>
                  </div>
                ))}
              </div>

              <div
                style={{
                  padding: "16px 18px",
                  backgroundColor: "rgba(220,38,38,0.03)",
                  borderRadius: 10,
                  border: "1px solid rgba(220,38,38,0.08)",
                }}
              >
                <div
                  style={{
                    fontSize: 10,
                    fontWeight: 700,
                    letterSpacing: "0.1em",
                    textTransform: "uppercase",
                    color: B.bandLimited,
                    marginBottom: 12,
                  }}
                >
                  AVOID
                </div>
                {[
                  "Taking on more project work without structural terms.",
                  "Relying on a single client for majority of income.",
                  "Deferring changes until income disruption occurs.",
                ].map((item, i) => (
                  <div
                    key={i}
                    style={{
                      display: "flex",
                      gap: 8,
                      marginBottom: i < 2 ? 10 : 0,
                      fontSize: 13,
                      color: B.navy,
                      lineHeight: 1.5,
                    }}
                  >
                    <span style={{ fontWeight: 600, color: B.bandLimited, flexShrink: 0 }}>
                      &mdash;
                    </span>
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* 90-Day Checklist */}
            <div
              style={{
                fontSize: 14,
                fontWeight: 700,
                color: B.navy,
                marginBottom: 14,
              }}
            >
              90-Day Checklist
            </div>
            <div
              style={{
                padding: "16px 18px",
                backgroundColor: B.sand,
                borderRadius: 10,
                marginBottom: 24,
              }}
            >
              {[
                "Create one forward-committed revenue arrangement",
                "Reduce dependence on the single largest source",
                "Add one recurring income component",
              ].map((item, i) => (
                <div
                  key={i}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 12,
                    marginBottom: i < 2 ? 12 : 0,
                  }}
                >
                  <div
                    style={{
                      width: 20,
                      height: 20,
                      borderRadius: "50%",
                      border: `2px solid ${B.border}`,
                      flexShrink: 0,
                    }}
                  />
                  <span style={{ fontSize: 13, color: B.navy, lineHeight: 1.4 }}>
                    {item}
                  </span>
                </div>
              ))}
            </div>

            {/* Reassessment + verification */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: mobile ? "1fr" : "1fr 1fr",
                gap: 12,
              }}
            >
              <div
                style={{
                  padding: "16px 18px",
                  backgroundColor: "rgba(75,63,174,0.04)",
                  borderRadius: 10,
                  border: "1px solid rgba(75,63,174,0.08)",
                }}
              >
                <div style={{ fontSize: 18, fontWeight: 700, color: B.navy }}>
                  Reassess in 92 days
                </div>
              </div>
              <div
                style={{
                  padding: "16px 18px",
                  backgroundColor: B.sand,
                  borderRadius: 10,
                  border: "1px solid rgba(14,26,43,0.06)",
                }}
              >
                <div style={{ fontSize: 12, color: B.muted }}>
                  Record ID: RPW-2026-SAMPLE
                </div>
              </div>
            </div>
          </div>

          {/* Large centered overlay */}
          <div
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <p
              style={{
                fontSize: 18,
                color: B.navy,
                fontWeight: 600,
                marginBottom: 20,
              }}
            >
              Your personalized action plan
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
                height: 48,
                paddingLeft: 32,
                paddingRight: 32,
                borderRadius: 12,
                backgroundColor: B.sandDk,
                color: B.navy,
                fontSize: 15,
                fontWeight: 700,
                letterSpacing: "0.01em",
                textDecoration: "none",
                border: "1px solid rgba(14,26,43,0.08)",
                boxShadow: hovered
                  ? "0 6px 20px rgba(14,26,43,0.10)"
                  : "0 2px 8px rgba(14,26,43,0.06)",
                transform: hovered ? "translateY(-1px)" : "translateY(0)",
                transition: "box-shadow 260ms ease, transform 260ms ease",
              }}
            >
              Get My Income Stability Score&trade; &mdash; $39
            </a>
          </div>
        </div>

        <CardFooter left="What to Do Next · Page 5" right="Model RP-2.0" />
      </ReportCard>
    </section>
  );
}

/* ================================================================== */
/* CTA                                                                 */
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
        paddingTop: mobile ? 88 : 120,
        paddingBottom: mobile ? 88 : 120,
      }}
    >
      <div
        style={{
          position: "absolute",
          top: "40%",
          left: "50%",
          width: 700,
          height: 700,
          transform: "translate(-50%, -50%)",
          background:
            "radial-gradient(circle, rgba(75,63,174,0.30) 0%, transparent 70%)",
          pointerEvents: "none",
        }}
      />
      <div
        style={{
          maxWidth: 640,
          marginLeft: "auto",
          marginRight: "auto",
          paddingLeft: mobile ? 24 : 48,
          paddingRight: mobile ? 24 : 48,
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
          <h2
            className="text-[28px] md:text-[40px]"
            style={{
              color: "#FAF9F7",
              fontWeight: 700,
              letterSpacing: "-0.03em",
              lineHeight: 1.1,
              marginBottom: 20,
            }}
          >
            Get your own Income Stability Score&trade;
          </h2>
          <p
            style={{
              fontSize: 16,
              color: "rgba(250,249,247,0.70)",
              lineHeight: 1.7,
              marginBottom: 36,
              maxWidth: 440,
              marginLeft: "auto",
              marginRight: "auto",
            }}
          >
            Under two minutes. Full structural diagnosis. Instant delivery.
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
              height: mobile ? 48 : 56,
              paddingLeft: 36,
              paddingRight: 36,
              borderRadius: 14,
              backgroundColor: "#FAF9F7",
              color: B.navy,
              fontSize: 15,
              fontWeight: 700,
              letterSpacing: "0.01em",
              textDecoration: "none",
              boxShadow: hovered
                ? "0 8px 28px rgba(0,0,0,0.20)"
                : "0 4px 16px rgba(0,0,0,0.12)",
              transform: hovered ? "translateY(-1px)" : "translateY(0)",
              transition: "box-shadow 260ms ease, transform 260ms ease",
            }}
          >
            Get My Score &mdash; $39
          </a>
          <div
            style={{
              marginTop: 20,
              fontSize: 12,
              color: "rgba(250,249,247,0.40)",
              letterSpacing: "0.02em",
            }}
          >
            Model RP-2.0 &middot; No bank connection &middot; Private by
            default
          </div>
        </div>
      </div>
    </section>
  );
}

/* ================================================================== */
/* MAIN EXPORT                                                         */
/* ================================================================== */
export default function SampleReportPage() {
  return (
    <div>
      <Hero />
      <Page1Score />
      <Page2WhyThisScore />
      <Page3WhatCouldGoWrong />
      <Page4HowToImprove />
      <Page5WhatToDoNext />
      <CtaSection />
    </div>
  );
}
