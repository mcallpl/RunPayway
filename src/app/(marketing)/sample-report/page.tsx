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
  sand: "#F7F6F3",
  sandDk: "#EDECEA",
  muted: "#6B7280",
  light: "#9CA3AF",
  gradient: "linear-gradient(135deg, #0E1A2B 0%, #4B3FAE 50%, #1F6D7A 100%)",
};

const S = {
  sectionY:     { desktop: 160, mobile: 88 },
  sectionYsm:   { desktop: 120, mobile: 72 },
  transitionY:  { desktop: 72, mobile: 48 },
  disclaimerY:  { desktop: 64, mobile: 48 },
  maxW:         1060,
  padX:         { desktop: 48, mobile: 24 },
  h1mb:         28,
  h2mb:         24,
  subtextMb:    56,
  paraMb:       24,
  labelMb:      16,
  cardPad:      { desktop: 36, mobile: 24 },
  cardRadius:   16,
  panelRadius:  20,
  gridGap:      24,
  gridGapSm:    16,
  ctaH:         56,
  ctaHsm:       46,
  ctaPadX:      32,
  ctaRadius:    14,
  lhHeading:    1.08,
  lhBody:       1.75,
  lhDense:      1.5,
  lsHeading:    "-0.025em",
  lsHero:       "-0.035em",
  lsLabel:      "0.14em",
};


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
        backgroundColor: "#ffffff",
        paddingTop: mobile ? S.sectionY.mobile : S.sectionY.desktop,
        paddingBottom: mobile ? S.sectionYsm.mobile : S.sectionYsm.desktop,
      }}
    >
      <div style={{ maxWidth: S.maxW, marginLeft: "auto", marginRight: "auto", paddingLeft: mobile ? S.padX.mobile : S.padX.desktop, paddingRight: mobile ? S.padX.mobile : S.padX.desktop }}>
        <div
          style={{
            textAlign: "center",
            opacity: visible ? 1 : 0,
            transform: visible ? "translateY(0)" : "translateY(16px)",
            transition: "opacity 0.6s ease-out, transform 0.6s ease-out",
          }}
        >
          <div
            className="text-[11px] uppercase"
            style={{ color: B.teal, fontWeight: 700, letterSpacing: S.lsLabel, marginBottom: 20 }}
          >
            Model RP-2.0
          </div>
          <h1
            className="text-[36px] md:text-[52px]"
            style={{
              color: B.navy,
              fontWeight: 700,
              letterSpacing: S.lsHero,
              lineHeight: S.lhHeading,
              marginBottom: S.h1mb,
            }}
          >
            Sample Report
          </h1>
          <p
            className="text-[16px] md:text-[18px]"
            style={{ color: B.muted, lineHeight: S.lhBody, maxWidth: 600, marginLeft: "auto", marginRight: "auto" }}
          >
            This is a demonstration assessment for a consulting professional. Every RunPayway report follows this exact structure, generated deterministically by Model RP-2.0.
          </p>
        </div>
      </div>
    </section>
  );
}


/* ================================================================== */
/* PAGE 1: SCORE OVERVIEW                                              */
/* ================================================================== */
function ScoreOverview() {
  const { ref, visible } = useInView();
  const mobile = useMobile();
  const [animScore, setAnimScore] = useState(0);
  const [hasAnimated, setHasAnimated] = useState(false);

  useEffect(() => {
    if (!visible || hasAnimated) return;
    setHasAnimated(true);
    const target = 78;
    const duration = 1000;
    const start = performance.now();
    const animate = (now: number) => {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setAnimScore(Math.round(eased * target));
      if (progress < 1) requestAnimationFrame(animate);
    };
    requestAnimationFrame(animate);
  }, [visible, hasAnimated]);

  return (
    <section
      ref={ref}
      aria-label="Score Overview"
      style={{
        backgroundColor: B.sand,
        paddingTop: mobile ? S.sectionY.mobile : S.sectionY.desktop,
        paddingBottom: mobile ? S.sectionY.mobile : S.sectionY.desktop,
      }}
    >
      <div style={{ maxWidth: S.maxW, marginLeft: "auto", marginRight: "auto", paddingLeft: mobile ? S.padX.mobile : S.padX.desktop, paddingRight: mobile ? S.padX.mobile : S.padX.desktop }}>
        {/* Section label */}
        <div
          style={{
            textAlign: "center",
            marginBottom: S.subtextMb,
            opacity: visible ? 1 : 0,
            transform: visible ? "translateY(0)" : "translateY(12px)",
            transition: "opacity 0.5s ease-out, transform 0.5s ease-out",
          }}
        >
          <div className="text-[11px] uppercase" style={{ color: B.teal, fontWeight: 700, letterSpacing: S.lsLabel, marginBottom: 16 }}>
            Report Page 1 of 5
          </div>
          <h2 className="text-[28px] md:text-[40px]" style={{ color: B.navy, fontWeight: 600, letterSpacing: S.lsHeading, marginBottom: 12 }}>
            Your Income Stability Score
          </h2>
          <p className="text-[15px] md:text-[16px]" style={{ color: B.muted, lineHeight: S.lhBody, maxWidth: 560, marginLeft: "auto", marginRight: "auto" }}>
            A single number that captures the structural durability of your income.
          </p>
        </div>

        {/* Score card */}
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
              <span className="text-[48px] md:text-[56px]" style={{ fontWeight: 700, color: B.navy, lineHeight: 1 }}>{animScore}</span>
              <span className="text-[16px] md:text-[18px]" style={{ fontWeight: 600, color: B.teal }}>Established Stability</span>
            </div>
            <div className="text-[13px]" style={{ color: B.muted, marginBottom: 28 }}>
              <span style={{ fontWeight: 600, color: B.navy }}>72nd percentile</span> among Professional Services
            </div>

            {/* Divider */}
            <div style={{ height: 1, background: "rgba(14,26,43,0.06)", marginBottom: 24 }} />

            {/* Key metrics grid */}
            <div style={{ display: "grid", gridTemplateColumns: mobile ? "1fr" : "1fr 1fr", gap: 24 }}>
              {/* Income Continuity */}
              <div>
                <div className="text-[10px] uppercase" style={{ color: B.teal, fontWeight: 600, letterSpacing: "0.12em", marginBottom: 8 }}>
                  Income Continuity
                </div>
                <div className="text-[28px]" style={{ fontWeight: 700, color: B.navy, marginBottom: 4 }}>38%</div>
                <p className="text-[13px]" style={{ color: "rgba(14,26,43,0.60)", lineHeight: 1.5 }}>
                  of income continues without active work
                </p>
              </div>

              {/* Stress Test */}
              <div>
                <div className="text-[10px] uppercase" style={{ color: B.teal, fontWeight: 600, letterSpacing: "0.12em", marginBottom: 8 }}>
                  Stress Test
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
                  <span className="text-[28px]" style={{ fontWeight: 700, color: B.navy }}>78</span>
                  <span className="text-[16px]" style={{ color: B.light }}>&rarr;</span>
                  <span className="text-[28px]" style={{ fontWeight: 700, color: "#DC2626" }}>56</span>
                </div>
                <p className="text-[13px]" style={{ color: "rgba(14,26,43,0.60)", lineHeight: 1.5 }}>
                  score under largest-source removal
                </p>
              </div>

              {/* How Resilient */}
              <div>
                <div className="text-[10px] uppercase" style={{ color: B.teal, fontWeight: 600, letterSpacing: "0.12em", marginBottom: 8 }}>
                  How Resilient
                </div>
                <div className="text-[20px]" style={{ fontWeight: 700, color: B.navy, marginBottom: 4 }}>Supported</div>
                <p className="text-[13px]" style={{ color: "rgba(14,26,43,0.60)", lineHeight: 1.5 }}>
                  income has structural backing
                </p>
              </div>

              {/* Confidence */}
              <div>
                <div className="text-[10px] uppercase" style={{ color: B.teal, fontWeight: 600, letterSpacing: "0.12em", marginBottom: 8 }}>
                  Confidence
                </div>
                <div className="text-[20px]" style={{ fontWeight: 700, color: B.navy, marginBottom: 4 }}>High</div>
                <p className="text-[13px]" style={{ color: "rgba(14,26,43,0.60)", lineHeight: 1.5 }}>
                  all six inputs provided
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}


/* ================================================================== */
/* CLASSIFICATION SCALE                                                */
/* ================================================================== */
function ClassificationBands() {
  const { ref, visible } = useInView();
  const mobile = useMobile();

  const bands = [
    { range: "0\u201329", label: "Limited", color: "#DC2626", desc: "Income structure is fragile and depends heavily on active work." },
    { range: "30\u201349", label: "Developing", color: "#F59E0B", desc: "Some structural support exists, but exposure remains significant." },
    { range: "50\u201374", label: "Established", color: B.teal, desc: "Meaningful stability with better structural protection.", active: true },
    { range: "75\u2013100", label: "High", color: B.navy, desc: "Durable income structure, less dependent on constant effort." },
  ];

  return (
    <section
      ref={ref}
      aria-label="Classification Bands"
      style={{
        backgroundColor: "#ffffff",
        paddingTop: mobile ? S.sectionY.mobile : S.sectionY.desktop,
        paddingBottom: mobile ? S.sectionY.mobile : S.sectionY.desktop,
      }}
    >
      <div style={{ maxWidth: S.maxW, marginLeft: "auto", marginRight: "auto", paddingLeft: mobile ? S.padX.mobile : S.padX.desktop, paddingRight: mobile ? S.padX.mobile : S.padX.desktop }}>
        <div
          style={{
            textAlign: "center",
            marginBottom: S.subtextMb,
            opacity: visible ? 1 : 0,
            transform: visible ? "translateY(0)" : "translateY(12px)",
            transition: "opacity 0.5s ease-out, transform 0.5s ease-out",
          }}
        >
          <h2 className="text-[28px] md:text-[36px]" style={{ color: B.navy, fontWeight: 600, letterSpacing: S.lsHeading, marginBottom: 12 }}>
            Classification Scale
          </h2>
          <p className="text-[15px]" style={{ color: B.muted, lineHeight: S.lhBody, maxWidth: 560, marginLeft: "auto", marginRight: "auto" }}>
            Every score maps to a fixed stability band. This sample scores 78 — Established Stability.
          </p>
        </div>

        <div style={{ maxWidth: 720, margin: "0 auto" }}>
          {bands.map((band, i) => (
            <div
              key={band.label}
              style={{
                display: "flex",
                alignItems: mobile ? "flex-start" : "center",
                flexDirection: mobile ? "column" : "row",
                gap: mobile ? 8 : 24,
                padding: mobile ? "20px 16px" : "20px 28px",
                marginBottom: i < bands.length - 1 ? 2 : 0,
                borderRadius: S.cardRadius,
                backgroundColor: band.active ? "rgba(31,109,122,0.06)" : "transparent",
                border: band.active ? `1px solid rgba(31,109,122,0.15)` : "1px solid transparent",
                opacity: visible ? 1 : 0,
                transform: visible ? "translateY(0)" : "translateY(12px)",
                transition: `opacity 0.5s ease-out ${i * 80}ms, transform 0.5s ease-out ${i * 80}ms`,
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 12, minWidth: mobile ? "auto" : 180 }}>
                <div style={{ width: 12, height: 12, borderRadius: "50%", backgroundColor: band.color, flexShrink: 0 }} />
                <span className="text-[14px]" style={{ fontWeight: 700, color: B.navy, minWidth: 90 }}>{band.range}</span>
                <span className="text-[14px]" style={{ fontWeight: 600, color: band.color }}>{band.label}</span>
              </div>
              <p className="text-[13px]" style={{ color: B.muted, lineHeight: 1.5, margin: 0 }}>
                {band.desc}
              </p>
              {band.active && (
                <span className="text-[11px] uppercase" style={{ color: B.teal, fontWeight: 700, letterSpacing: "0.08em", flexShrink: 0, marginLeft: mobile ? 0 : "auto" }}>
                  This score
                </span>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}


/* ================================================================== */
/* PAGE 2: WHY THIS SCORE                                              */
/* ================================================================== */
function WhyThisScore() {
  const { ref, visible } = useInView();
  const mobile = useMobile();

  const drivers = [
    { label: "Income Source Count", value: 72, desc: "3 active sources detected" },
    { label: "Source Diversification", value: 58, desc: "Moderate concentration in primary source" },
    { label: "Income Predictability", value: 85, desc: "Strong recurring revenue patterns" },
    { label: "Forward Commitment", value: 64, desc: "4 months of contracted income ahead" },
    { label: "Continuity Ratio", value: 38, desc: "38% continues without active work" },
  ];

  return (
    <section
      ref={ref}
      aria-label="Why This Score"
      style={{
        backgroundColor: B.sand,
        paddingTop: mobile ? S.sectionY.mobile : S.sectionY.desktop,
        paddingBottom: mobile ? S.sectionY.mobile : S.sectionY.desktop,
      }}
    >
      <div style={{ maxWidth: S.maxW, marginLeft: "auto", marginRight: "auto", paddingLeft: mobile ? S.padX.mobile : S.padX.desktop, paddingRight: mobile ? S.padX.mobile : S.padX.desktop }}>
        <div
          style={{
            textAlign: "center",
            marginBottom: S.subtextMb,
            opacity: visible ? 1 : 0,
            transform: visible ? "translateY(0)" : "translateY(12px)",
            transition: "opacity 0.5s ease-out, transform 0.5s ease-out",
          }}
        >
          <div className="text-[11px] uppercase" style={{ color: B.teal, fontWeight: 700, letterSpacing: S.lsLabel, marginBottom: 16 }}>
            Report Page 2 of 5
          </div>
          <h2 className="text-[28px] md:text-[40px]" style={{ color: B.navy, fontWeight: 600, letterSpacing: S.lsHeading, marginBottom: 12 }}>
            Why This Score
          </h2>
          <p className="text-[15px]" style={{ color: B.muted, lineHeight: S.lhBody, maxWidth: 560, marginLeft: "auto", marginRight: "auto" }}>
            Five structural drivers determine the overall score. Each is measured independently and contributes to the final result.
          </p>
        </div>

        <div style={{ maxWidth: 640, margin: "0 auto" }}>
          {drivers.map((d, i) => (
            <div
              key={d.label}
              style={{
                marginBottom: i < drivers.length - 1 ? 20 : 0,
                opacity: visible ? 1 : 0,
                transform: visible ? "translateY(0)" : "translateY(12px)",
                transition: `opacity 0.5s ease-out ${i * 80}ms, transform 0.5s ease-out ${i * 80}ms`,
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 8 }}>
                <span className="text-[14px]" style={{ fontWeight: 600, color: B.navy }}>{d.label}</span>
                <span className="text-[14px]" style={{ fontWeight: 700, color: B.teal }}>{d.value}/100</span>
              </div>
              {/* Bar */}
              <div style={{ height: 8, borderRadius: 4, backgroundColor: "rgba(14,26,43,0.06)", marginBottom: 6, overflow: "hidden" }}>
                <div style={{
                  height: "100%",
                  borderRadius: 4,
                  background: B.gradient,
                  width: visible ? `${d.value}%` : "0%",
                  transition: `width 0.8s ease-out ${200 + i * 100}ms`,
                }} />
              </div>
              <p className="text-[12px]" style={{ color: B.muted, margin: 0, lineHeight: 1.5 }}>{d.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}


/* ================================================================== */
/* PAGE 3: WHAT COULD GO WRONG                                         */
/* ================================================================== */
function WhatCouldGoWrong() {
  const { ref, visible } = useInView();
  const mobile = useMobile();

  const scenarios = [
    { title: "Largest Source Removed", drop: "78 \u2192 56", band: "Established \u2192 Established", severity: "Moderate", desc: "Removing the single largest income source causes a 22-point drop but the score remains in the Established band." },
    { title: "Two Sources Lost", drop: "78 \u2192 41", band: "Established \u2192 Developing", severity: "High", desc: "Losing two income sources pushes the score into Developing territory, exposing structural fragility." },
    { title: "All Variable Income Stops", drop: "78 \u2192 48", band: "Established \u2192 Developing", severity: "High", desc: "If all variable and project-based income ceased, only recurring commitments would sustain the score." },
  ];

  return (
    <section
      ref={ref}
      aria-label="Stress Scenarios"
      style={{
        backgroundColor: "#ffffff",
        paddingTop: mobile ? S.sectionY.mobile : S.sectionY.desktop,
        paddingBottom: mobile ? S.sectionY.mobile : S.sectionY.desktop,
      }}
    >
      <div style={{ maxWidth: S.maxW, marginLeft: "auto", marginRight: "auto", paddingLeft: mobile ? S.padX.mobile : S.padX.desktop, paddingRight: mobile ? S.padX.mobile : S.padX.desktop }}>
        <div
          style={{
            textAlign: "center",
            marginBottom: S.subtextMb,
            opacity: visible ? 1 : 0,
            transform: visible ? "translateY(0)" : "translateY(12px)",
            transition: "opacity 0.5s ease-out, transform 0.5s ease-out",
          }}
        >
          <div className="text-[11px] uppercase" style={{ color: B.teal, fontWeight: 700, letterSpacing: S.lsLabel, marginBottom: 16 }}>
            Report Page 3 of 5
          </div>
          <h2 className="text-[28px] md:text-[40px]" style={{ color: B.navy, fontWeight: 600, letterSpacing: S.lsHeading, marginBottom: 12 }}>
            What Could Go Wrong
          </h2>
          <p className="text-[15px]" style={{ color: B.muted, lineHeight: S.lhBody, maxWidth: 560, marginLeft: "auto", marginRight: "auto" }}>
            Stress scenarios show how the score would change under adverse conditions. These are deterministic projections, not predictions.
          </p>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: mobile ? "1fr" : "1fr 1fr 1fr", gap: S.gridGap, maxWidth: 880, margin: "0 auto" }}>
          {scenarios.map((s, i) => (
            <div
              key={s.title}
              style={{
                backgroundColor: B.sand,
                borderRadius: S.panelRadius,
                padding: mobile ? S.cardPad.mobile : S.cardPad.desktop,
                border: "1px solid rgba(14,26,43,0.06)",
                opacity: visible ? 1 : 0,
                transform: visible ? "translateY(0)" : "translateY(16px)",
                transition: `opacity 0.6s ease-out ${i * 100}ms, transform 0.6s ease-out ${i * 100}ms`,
              }}
            >
              <div className="text-[11px] uppercase" style={{ color: s.severity === "High" ? "#DC2626" : "#F59E0B", fontWeight: 700, letterSpacing: "0.08em", marginBottom: 12 }}>
                {s.severity} Impact
              </div>
              <h3 className="text-[16px]" style={{ fontWeight: 700, color: B.navy, marginBottom: 12 }}>{s.title}</h3>
              <div className="text-[22px]" style={{ fontWeight: 700, color: B.navy, marginBottom: 4 }}>{s.drop}</div>
              <div className="text-[12px]" style={{ color: B.teal, fontWeight: 600, marginBottom: 16 }}>{s.band}</div>
              <p className="text-[13px]" style={{ color: B.muted, lineHeight: 1.6, margin: 0 }}>{s.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}


/* ================================================================== */
/* PAGE 4: HOW TO IMPROVE                                              */
/* ================================================================== */
function HowToImprove() {
  const { ref, visible } = useInView();
  const mobile = useMobile();

  const improvements = [
    { rank: "01", title: "Extend Forward Commitments", impact: "+6 to +10 pts", desc: "Increase the share of income committed before the month begins. Longer contract windows and retainer agreements directly lift the Forward Commitment driver." },
    { rank: "02", title: "Add a Recurring Revenue Source", impact: "+4 to +7 pts", desc: "Introduce at least one additional source with predictable monthly or quarterly deposits. This strengthens both diversification and continuity." },
    { rank: "03", title: "Reduce Largest-Source Concentration", impact: "+3 to +5 pts", desc: "Shift income distribution so no single source exceeds 50% of total. This reduces stress-test exposure and improves structural resilience." },
  ];

  return (
    <section
      ref={ref}
      aria-label="Improvement Paths"
      style={{
        backgroundColor: B.sand,
        paddingTop: mobile ? S.sectionY.mobile : S.sectionY.desktop,
        paddingBottom: mobile ? S.sectionY.mobile : S.sectionY.desktop,
      }}
    >
      <div style={{ maxWidth: S.maxW, marginLeft: "auto", marginRight: "auto", paddingLeft: mobile ? S.padX.mobile : S.padX.desktop, paddingRight: mobile ? S.padX.mobile : S.padX.desktop }}>
        <div
          style={{
            textAlign: "center",
            marginBottom: S.subtextMb,
            opacity: visible ? 1 : 0,
            transform: visible ? "translateY(0)" : "translateY(12px)",
            transition: "opacity 0.5s ease-out, transform 0.5s ease-out",
          }}
        >
          <div className="text-[11px] uppercase" style={{ color: B.teal, fontWeight: 700, letterSpacing: S.lsLabel, marginBottom: 16 }}>
            Report Page 4 of 5
          </div>
          <h2 className="text-[28px] md:text-[40px]" style={{ color: B.navy, fontWeight: 600, letterSpacing: S.lsHeading, marginBottom: 12 }}>
            How to Improve
          </h2>
          <p className="text-[15px]" style={{ color: B.muted, lineHeight: S.lhBody, maxWidth: 560, marginLeft: "auto", marginRight: "auto" }}>
            Ranked improvement opportunities tailored to this income profile. Each path shows the estimated score impact.
          </p>
        </div>

        <div style={{ maxWidth: 700, margin: "0 auto" }}>
          {improvements.map((item, i) => (
            <div
              key={item.rank}
              style={{
                display: "flex",
                gap: mobile ? 16 : 28,
                alignItems: "flex-start",
                marginBottom: i < improvements.length - 1 ? 36 : 0,
                opacity: visible ? 1 : 0,
                transform: visible ? "translateY(0)" : "translateY(12px)",
                transition: `opacity 0.5s ease-out ${i * 100}ms, transform 0.5s ease-out ${i * 100}ms`,
              }}
            >
              <div
                className="text-[28px]"
                style={{
                  fontWeight: 800,
                  color: "rgba(75,63,174,0.15)",
                  lineHeight: 1,
                  flexShrink: 0,
                  minWidth: 40,
                  paddingTop: 2,
                }}
              >
                {item.rank}
              </div>
              <div>
                <h3 className="text-[16px]" style={{ fontWeight: 700, color: B.navy, marginBottom: 6 }}>{item.title}</h3>
                <div className="text-[13px]" style={{ color: B.teal, fontWeight: 600, marginBottom: 10 }}>{item.impact}</div>
                <p className="text-[14px]" style={{ color: B.muted, lineHeight: S.lhBody, margin: 0 }}>{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}


/* ================================================================== */
/* PAGE 5 PREVIEW: FULL REPORT SUMMARY                                 */
/* ================================================================== */
function FullReportPreview() {
  const { ref, visible } = useInView();
  const mobile = useMobile();

  const sections = [
    { page: "Page 1", title: "Score & Classification", items: ["Overall score and stability band", "Percentile ranking within industry", "Income continuity estimate", "Confidence level"] },
    { page: "Page 2", title: "Why This Score", items: ["Five structural drivers with individual scores", "Contribution bars for each dimension", "Strengths and weaknesses identified"] },
    { page: "Page 3", title: "What Could Go Wrong", items: ["Multiple stress scenarios modeled", "Band migration analysis", "Sensitivity to income disruption"] },
    { page: "Page 4", title: "How to Improve", items: ["Ranked improvement opportunities", "Estimated point impact per action", "Tailored to your income structure"] },
    { page: "Page 5", title: "Model Verification", items: ["SHA-256 assessment hash", "Model version and timestamp", "Reassessment triggers", "Industry-tailored actions"] },
  ];

  return (
    <section
      ref={ref}
      aria-label="Full Report Preview"
      style={{
        backgroundColor: "#ffffff",
        paddingTop: mobile ? S.sectionY.mobile : S.sectionY.desktop,
        paddingBottom: mobile ? S.sectionY.mobile : S.sectionY.desktop,
      }}
    >
      <div style={{ maxWidth: S.maxW, marginLeft: "auto", marginRight: "auto", paddingLeft: mobile ? S.padX.mobile : S.padX.desktop, paddingRight: mobile ? S.padX.mobile : S.padX.desktop }}>
        <div
          style={{
            textAlign: "center",
            marginBottom: S.subtextMb,
            opacity: visible ? 1 : 0,
            transform: visible ? "translateY(0)" : "translateY(12px)",
            transition: "opacity 0.5s ease-out, transform 0.5s ease-out",
          }}
        >
          <h2 className="text-[28px] md:text-[36px]" style={{ color: B.navy, fontWeight: 600, letterSpacing: S.lsHeading, marginBottom: 12 }}>
            Every Report Contains 5 Pages
          </h2>
          <p className="text-[15px]" style={{ color: B.muted, lineHeight: S.lhBody, maxWidth: 560, marginLeft: "auto", marginRight: "auto" }}>
            A complete structural assessment of your income — not a summary, but a full analysis generated by Model RP-2.0.
          </p>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: mobile ? "1fr" : "1fr 1fr", gap: S.gridGap, maxWidth: 800, margin: "0 auto" }}>
          {sections.map((s, i) => (
            <div
              key={s.page}
              style={{
                backgroundColor: B.sand,
                borderRadius: S.cardRadius,
                padding: mobile ? S.cardPad.mobile : S.cardPad.desktop,
                border: "1px solid rgba(14,26,43,0.06)",
                opacity: visible ? 1 : 0,
                transform: visible ? "translateY(0)" : "translateY(12px)",
                transition: `opacity 0.5s ease-out ${i * 80}ms, transform 0.5s ease-out ${i * 80}ms`,
                ...(i === sections.length - 1 && !mobile ? { gridColumn: "1 / -1", maxWidth: 380, justifySelf: "center", width: "100%" } : {}),
              }}
            >
              <div className="text-[10px] uppercase" style={{ color: B.teal, fontWeight: 700, letterSpacing: "0.12em", marginBottom: 10 }}>
                {s.page}
              </div>
              <h3 className="text-[16px]" style={{ fontWeight: 700, color: B.navy, marginBottom: 14 }}>{s.title}</h3>
              <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
                {s.items.map((item) => (
                  <li key={item} className="text-[13px]" style={{ color: B.muted, lineHeight: 1.6, paddingLeft: 14, position: "relative", marginBottom: 4 }}>
                    <span style={{ position: "absolute", left: 0, color: B.teal }}>&#8226;</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
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
        backgroundColor: B.sand,
        paddingTop: mobile ? S.sectionY.mobile : S.sectionY.desktop,
        paddingBottom: mobile ? S.sectionY.mobile : S.sectionY.desktop,
      }}
    >
      <div style={{ maxWidth: S.maxW, marginLeft: "auto", marginRight: "auto", paddingLeft: mobile ? S.padX.mobile : S.padX.desktop, paddingRight: mobile ? S.padX.mobile : S.padX.desktop }}>
        <div
          style={{
            textAlign: "center",
            opacity: visible ? 1 : 0,
            transform: visible ? "translateY(0)" : "translateY(16px)",
            transition: "opacity 0.6s ease-out, transform 0.6s ease-out",
          }}
        >
          <h2 className="text-[28px] md:text-[40px]" style={{ color: B.navy, fontWeight: 600, letterSpacing: S.lsHeading, marginBottom: S.h2mb }}>
            Get Your Own Score
          </h2>
          <p className="text-[15px] md:text-[16px]" style={{ color: B.muted, lineHeight: S.lhBody, maxWidth: 480, marginLeft: "auto", marginRight: "auto", marginBottom: 40 }}>
            See how your income structure compares. Takes under two minutes, no bank connection required.
          </p>
          <Link
            href="/pricing"
            onMouseEnter={() => canHover() && setHovered(true)}
            onMouseLeave={() => setHovered(false)}
            style={{
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              height: mobile ? S.ctaHsm : S.ctaH,
              paddingLeft: S.ctaPadX,
              paddingRight: S.ctaPadX,
              borderRadius: S.ctaRadius,
              background: hovered ? B.purple : B.gradient,
              color: "#ffffff",
              fontSize: 15,
              fontWeight: 600,
              letterSpacing: "0.01em",
              textDecoration: "none",
              boxShadow: hovered ? "0 8px 24px rgba(75,63,174,0.25)" : "0 4px 16px rgba(14,26,43,0.12)",
              transition: "background 260ms ease, box-shadow 260ms ease",
            }}
          >
            View Pricing
          </Link>
        </div>
      </div>
    </section>
  );
}


/* ================================================================== */
/* MODEL BADGE                                                         */
/* ================================================================== */
function ModelBadge() {
  const mobile = useMobile();

  return (
    <section
      aria-label="Model Badge"
      style={{
        backgroundColor: "#ffffff",
        paddingTop: mobile ? S.disclaimerY.mobile : S.disclaimerY.desktop,
        paddingBottom: mobile ? S.disclaimerY.mobile : S.disclaimerY.desktop,
      }}
    >
      <div style={{ maxWidth: S.maxW, marginLeft: "auto", marginRight: "auto", paddingLeft: mobile ? S.padX.mobile : S.padX.desktop, paddingRight: mobile ? S.padX.mobile : S.padX.desktop, textAlign: "center" }}>
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 10,
            padding: "10px 20px",
            borderRadius: 100,
            backgroundColor: B.sand,
            border: "1px solid rgba(14,26,43,0.06)",
          }}
        >
          <div style={{ width: 8, height: 8, borderRadius: "50%", background: B.gradient }} />
          <span className="text-[12px]" style={{ color: B.navy, fontWeight: 600, letterSpacing: "0.04em" }}>
            Model RP-2.0
          </span>
        </div>
        <p className="text-[12px]" style={{ color: B.light, marginTop: 16, lineHeight: 1.5 }}>
          This sample report is for demonstration purposes only. Actual assessments are generated from individual input data and may produce different results.
        </p>
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
      <ScoreOverview />
      <ClassificationBands />
      <WhyThisScore />
      <WhatCouldGoWrong />
      <HowToImprove />
      <FullReportPreview />
      <CtaSection />
      <ModelBadge />
    </div>
  );
}
