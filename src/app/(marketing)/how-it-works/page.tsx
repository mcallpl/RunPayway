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
      ([entry]) => { if (entry.isIntersecting) { setVisible(true); obs.disconnect(); } },
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
  teal: "#1A7A6D",
  sand: "#F5F2EC",
  offWhite: "#FAFAF8",
  muted: "rgba(14,26,43,0.55)",
  light: "rgba(14,26,43,0.38)",
  border: "rgba(14,26,43,0.08)",
  gradient: "linear-gradient(145deg, #0E1A2B 0%, #161430 35%, #3D2F9C 65%, #1A7A6D 100%)",
  bandLimited: "#9B2C2C",
  bandDeveloping: "#92640A",
  bandEstablished: "#2B5EA7",
  bandHigh: "#1A7A6D",
};

const S = {
  sectionY: { desktop: 120, mobile: 72 },
  maxW: 1100,
  padX: { desktop: 56, mobile: 28 },
  lhHeading: 1.12,
  lhBody: 1.65,
  lsHeading: "-0.025em",
  lsHero: "-0.03em",
  lsLabel: "0.08em",
  fsH1: { desktop: 56, mobile: 36 },
  fsH2: { desktop: 48, mobile: 32 },
  fsH3: { desktop: 24, mobile: 20 },
  fsBody: { desktop: 18, mobile: 16 },
  fsLabel: 13,
  fsMeta: 14,
  fsCard: { desktop: 16, mobile: 15 },
  fsCta: 16,
  ctaH: 56,
  ctaRadius: 10,
  panelRadius: 14,
};

const DISPLAY_FONT = "'DM Serif Display', Georgia, serif";

/* ================================================================== */
/* 1. HERO                                                              */
/* ================================================================== */
function Hero() {
  const { ref, visible } = useInView();
  const mobile = useMobile();

  return (
    <section ref={ref} style={{ background: B.gradient, position: "relative", overflow: "hidden", paddingTop: mobile ? 120 : 160, paddingBottom: mobile ? 72 : 100 }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display&display=swap');`}</style>
      <div style={{ position: "absolute", top: "30%", left: "50%", width: 800, height: 800, transform: "translate(-50%, -50%)", background: "radial-gradient(circle, rgba(75,63,174,0.18) 0%, transparent 70%)", pointerEvents: "none" }} />
      <div style={{ maxWidth: S.maxW, margin: "0 auto", paddingLeft: mobile ? S.padX.mobile : S.padX.desktop, paddingRight: mobile ? S.padX.mobile : S.padX.desktop, position: "relative", zIndex: 1, textAlign: "center" }}>
        <div style={{ opacity: visible ? 1 : 0, transform: visible ? "translateY(0)" : "translateY(20px)", transition: "opacity 0.7s ease-out, transform 0.7s ease-out" }}>
          <div style={{ fontSize: S.fsLabel, textTransform: "uppercase" as const, color: "rgba(250,249,247,0.50)", fontWeight: 600, letterSpacing: S.lsLabel, marginBottom: 24 }}>
            How It Works
          </div>
          <h1 style={{ fontSize: mobile ? S.fsH1.mobile : S.fsH1.desktop, color: "#F4F1EA", fontFamily: DISPLAY_FONT, fontWeight: 400, letterSpacing: S.lsHero, lineHeight: S.lhHeading, marginBottom: 20, maxWidth: 720, margin: "0 auto 20px" }}>
            Fixed questions. One score.<br />Full structural diagnosis.
          </h1>
          <p style={{ fontSize: mobile ? S.fsBody.mobile : S.fsBody.desktop, color: "rgba(250,249,247,0.55)", lineHeight: S.lhBody, maxWidth: 520, margin: "0 auto 12px" }}>
            A structural diagnostic that scores how your income is built — not how much you make.
          </p>
          <p style={{ fontSize: S.fsMeta, color: "rgba(250,249,247,0.35)", margin: 0 }}>
            Same answers, same score. No financial data required.
          </p>
        </div>
      </div>
    </section>
  );
}

/* ================================================================== */
/* 2. THREE STEPS — Card-based with arrows                             */
/* ================================================================== */
function ThreeSteps() {
  const { ref, visible } = useInView();
  const mobile = useMobile();

  const steps = [
    {
      num: "01", time: "2 min", title: "Take the assessment",
      hook: "No bank connection. No credit pull. No login.",
      desc: "A short structural diagnostic about how your income works — recurrence, concentration, visibility, and labor dependence.",
      color: B.teal,
    },
    {
      num: "02", time: "Instant", title: "See your score",
      hook: "Free. Right now. No strings.",
      desc: "Your Income Stability Score\u2122 out of 100, your stability band, and the single biggest structural factor limiting your score.",
      color: B.purple,
    },
    {
      num: "03", time: "$99", title: "Unlock the full diagnostic",
      hook: "Five pages. One clear path forward.",
      desc: "Risk scenarios with exact score drops. Actions with projected impact. Tradeoff analysis. An interactive simulator you keep forever.",
      color: B.navy,
    },
  ];

  return (
    <section ref={ref} style={{ background: B.sand, paddingTop: mobile ? S.sectionY.mobile : S.sectionY.desktop, paddingBottom: mobile ? S.sectionY.mobile : S.sectionY.desktop, paddingLeft: mobile ? S.padX.mobile : S.padX.desktop, paddingRight: mobile ? S.padX.mobile : S.padX.desktop }}>
      <div style={{ maxWidth: S.maxW, margin: "0 auto" }}>
        <div style={{ maxWidth: 600, marginBottom: mobile ? 40 : 56, opacity: visible ? 1 : 0, transform: visible ? "translateY(0)" : "translateY(16px)", transition: "opacity 600ms ease-out, transform 600ms ease-out" }}>
          <div style={{ fontSize: S.fsLabel, fontWeight: 700, letterSpacing: S.lsLabel, textTransform: "uppercase" as const, color: B.teal, marginBottom: 16 }}>The Process</div>
          <h2 style={{ fontSize: mobile ? S.fsH2.mobile : S.fsH2.desktop, color: B.navy, lineHeight: S.lhHeading, letterSpacing: S.lsHeading, fontFamily: DISPLAY_FONT, fontWeight: 400, marginBottom: 16 }}>
            Three steps. No financial data required.
          </h2>
          <p style={{ fontSize: mobile ? S.fsBody.mobile : S.fsBody.desktop, color: B.muted, lineHeight: S.lhBody, maxWidth: 480 }}>
            We measure how your income is built — not how much you make. The structure of your revenue determines how stable it actually is.
          </p>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: mobile ? "1fr" : "1fr auto 1fr auto 1fr", gap: 0, alignItems: "stretch" }}>
          {steps.map((step, i) => {
            const isLast = i === 2;
            return (
              <div key={step.num} style={{ display: "contents" }}>
                <div style={{
                  position: "relative", padding: mobile ? "28px 24px" : "32px 28px", borderRadius: S.panelRadius,
                  backgroundColor: isLast ? B.navy : "#FFFFFF",
                  border: isLast ? "none" : `1px solid ${B.border}`,
                  boxShadow: isLast ? "0 8px 32px rgba(14,26,43,0.15)" : "0 2px 8px rgba(14,26,43,0.04)",
                  overflow: "hidden", display: "flex", flexDirection: "column",
                  opacity: visible ? 1 : 0, transform: visible ? "translateY(0)" : "translateY(20px)",
                  transition: `opacity 500ms ease-out ${150 + i * 120}ms, transform 500ms ease-out ${150 + i * 120}ms`,
                }}>
                  <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 3, backgroundColor: step.color, opacity: isLast ? 1 : 0.6 }} />
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
                    <div style={{ width: 36, height: 36, borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center", backgroundColor: isLast ? "rgba(244,241,234,0.08)" : step.color === B.purple ? "rgba(75,63,174,0.08)" : "rgba(26,122,109,0.08)", fontSize: 14, fontWeight: 700, color: isLast ? "#F4F1EA" : step.color }}>{step.num}</div>
                    <span style={{ fontSize: S.fsMeta, fontWeight: 700, letterSpacing: "0.04em", color: isLast ? B.teal : B.light, padding: "3px 10px", borderRadius: 100, backgroundColor: isLast ? "rgba(26,122,109,0.12)" : "rgba(14,26,43,0.04)" }}>{step.time}</span>
                  </div>
                  <h3 style={{ fontSize: mobile ? S.fsH3.mobile : S.fsH3.desktop, fontWeight: 600, color: isLast ? "#F4F1EA" : B.navy, marginBottom: 8, letterSpacing: "-0.02em" }}>{step.title}</h3>
                  <p style={{ fontSize: mobile ? S.fsCard.mobile : S.fsCard.desktop, fontWeight: 600, color: isLast ? B.teal : step.color, marginBottom: 14, lineHeight: 1.4 }}>{step.hook}</p>
                  <p style={{ fontSize: mobile ? S.fsCard.mobile : S.fsCard.desktop, color: isLast ? "rgba(244,241,234,0.50)" : B.muted, lineHeight: S.lhBody, margin: 0, flex: 1 }}>{step.desc}</p>
                </div>
                {!isLast && !mobile && (
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "center", width: 40 }}>
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M4 10H16M16 10L11 5M16 10L11 15" stroke={B.light} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

/* ================================================================== */
/* 3. WHAT THE MODEL MEASURES — Clean 2-column layout                  */
/* ================================================================== */
function WhatTheModelMeasures() {
  const { ref, visible } = useInView();
  const mobile = useMobile();

  const dimensions = [
    { title: "Recurring Income", desc: "How much income continues from existing sources without new acquisition.", color: B.teal },
    { title: "Source Concentration", desc: "How much depends on your single largest source. One lost client can collapse the structure.", color: B.purple },
    { title: "Source Diversity", desc: "How many meaningful, independent income sources support the structure.", color: B.teal },
    { title: "Forward Visibility", desc: "How far ahead income is already committed, contracted, or scheduled.", color: B.purple },
    { title: "Earnings Consistency", desc: "How stable income is from month to month. High swings reduce structural resilience.", color: "#D97706" },
    { title: "Labor Independence", desc: "What percentage of income continues without your daily effort. The structural ceiling for most.", color: B.navy },
  ];

  return (
    <section ref={ref} style={{ backgroundColor: "#FFFFFF", paddingTop: mobile ? S.sectionY.mobile : S.sectionY.desktop, paddingBottom: mobile ? S.sectionY.mobile : S.sectionY.desktop, paddingLeft: mobile ? S.padX.mobile : S.padX.desktop, paddingRight: mobile ? S.padX.mobile : S.padX.desktop }}>
      <div style={{ maxWidth: S.maxW, margin: "0 auto" }}>
        <div style={{ maxWidth: 560, marginBottom: mobile ? 40 : 56, opacity: visible ? 1 : 0, transform: visible ? "translateY(0)" : "translateY(16px)", transition: "opacity 600ms ease-out, transform 600ms ease-out" }}>
          <div style={{ fontSize: S.fsLabel, fontWeight: 700, textTransform: "uppercase" as const, letterSpacing: S.lsLabel, color: B.teal, marginBottom: 16 }}>The Model</div>
          <h2 style={{ fontSize: mobile ? S.fsH2.mobile : S.fsH2.desktop, color: B.navy, lineHeight: S.lhHeading, letterSpacing: S.lsHeading, fontFamily: DISPLAY_FONT, fontWeight: 400, marginBottom: 16 }}>
            What the score measures.
          </h2>
          <p style={{ fontSize: mobile ? S.fsBody.mobile : S.fsBody.desktop, color: B.muted, lineHeight: S.lhBody }}>
            Each dimension is scored independently and combined into a single 0&#8211;100 result. Fixed rules. Same answers, same score.
          </p>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: mobile ? "1fr" : "1fr 1fr", gap: mobile ? 16 : 20 }}>
          {dimensions.map((dim, i) => (
            <div key={dim.title} style={{
              padding: mobile ? "20px 20px" : "24px 28px", borderRadius: 12,
              backgroundColor: B.sand, border: `1px solid ${B.border}`,
              opacity: visible ? 1 : 0, transform: visible ? "translateY(0)" : "translateY(12px)",
              transition: `opacity 500ms ease-out ${100 + i * 60}ms, transform 500ms ease-out ${100 + i * 60}ms`,
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 8 }}>
                <div style={{ width: 8, height: 8, borderRadius: "50%", backgroundColor: dim.color, flexShrink: 0 }} />
                <h3 style={{ fontSize: mobile ? 17 : 18, fontWeight: 600, color: B.navy, letterSpacing: "-0.01em", margin: 0 }}>{dim.title}</h3>
              </div>
              <p style={{ fontSize: mobile ? S.fsCard.mobile : S.fsCard.desktop, color: B.muted, lineHeight: S.lhBody, margin: 0, paddingLeft: 20 }}>{dim.desc}</p>
            </div>
          ))}
        </div>

        <div style={{ textAlign: "center", marginTop: 32, fontSize: S.fsMeta, color: B.light, opacity: visible ? 1 : 0, transition: "opacity 600ms ease-out 500ms" }}>
          All dimensions are fixed and versioned under Model RP-2.0.
        </div>
      </div>
    </section>
  );
}

/* ================================================================== */
/* 4. CLASSIFICATION SCALE                                             */
/* ================================================================== */
function ClassificationScale() {
  const { ref, visible } = useInView();
  const mobile = useMobile();

  const bands = [
    { range: "0\u201329", label: "Limited", color: B.bandLimited, width: "30%", desc: "Vulnerable. Not yet protected against disruption." },
    { range: "30\u201349", label: "Developing", color: B.bandDeveloping, width: "20%", desc: "Emerging structure. Key gaps remain." },
    { range: "50\u201374", label: "Established", color: B.bandEstablished, width: "25%", desc: "Meaningful protection. Not yet fully resilient." },
    { range: "75\u2013100", label: "High", color: B.bandHigh, width: "25%", desc: "Strong. Resilient against most disruptions." },
  ];

  return (
    <section ref={ref} style={{ backgroundColor: B.sand, paddingTop: mobile ? S.sectionY.mobile : S.sectionY.desktop, paddingBottom: mobile ? S.sectionY.mobile : S.sectionY.desktop, paddingLeft: mobile ? S.padX.mobile : S.padX.desktop, paddingRight: mobile ? S.padX.mobile : S.padX.desktop }}>
      <div style={{ maxWidth: 700, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: 40, opacity: visible ? 1 : 0, transform: visible ? "translateY(0)" : "translateY(12px)", transition: "opacity 500ms ease-out, transform 500ms ease-out" }}>
          <div style={{ fontSize: S.fsLabel, fontWeight: 700, letterSpacing: S.lsLabel, textTransform: "uppercase" as const, color: B.teal, marginBottom: 16 }}>Classification</div>
          <h2 style={{ fontSize: mobile ? S.fsH2.mobile : S.fsH2.desktop, color: B.navy, fontFamily: DISPLAY_FONT, fontWeight: 400, letterSpacing: S.lsHeading, lineHeight: S.lhHeading, marginBottom: 12 }}>
            Four stability bands. Fixed thresholds.
          </h2>
          <p style={{ fontSize: mobile ? S.fsBody.mobile : S.fsBody.desktop, color: B.muted, lineHeight: S.lhBody, maxWidth: 440, margin: "0 auto" }}>
            Every score maps to a fixed band under Model RP-2.0.
          </p>
        </div>

        {/* Animated bar */}
        <div style={{ display: "flex", height: 14, borderRadius: 7, overflow: "hidden", marginBottom: 32 }}>
          {bands.map((band, i) => (
            <div key={band.label} style={{ width: band.width, backgroundColor: band.color, transform: visible ? "scaleX(1)" : "scaleX(0)", transformOrigin: "left center", transition: `transform 0.6s ease-out ${200 + i * 150}ms` }} />
          ))}
        </div>

        {/* Band details */}
        <div style={{ display: "grid", gridTemplateColumns: mobile ? "1fr 1fr" : "repeat(4, 1fr)", gap: mobile ? 20 : 16 }}>
          {bands.map((band, i) => (
            <div key={band.label} style={{ textAlign: "center", opacity: visible ? 1 : 0, transform: visible ? "translateY(0)" : "translateY(8px)", transition: `opacity 400ms ease-out ${300 + i * 100}ms, transform 400ms ease-out ${300 + i * 100}ms` }}>
              <div style={{ width: 10, height: 10, borderRadius: "50%", backgroundColor: band.color, margin: "0 auto 8px" }} />
              <div style={{ fontSize: S.fsMeta, fontWeight: 600, color: B.navy, marginBottom: 2 }}>{band.range}</div>
              <div style={{ fontSize: S.fsMeta, fontWeight: 600, color: band.color, marginBottom: 6 }}>{band.label}</div>
              <div style={{ fontSize: S.fsMeta, color: B.muted, lineHeight: S.lhBody }}>{band.desc}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ================================================================== */
/* 5. WHAT YOUR REPORT COVERS — Clean numbered list                    */
/* ================================================================== */
function ReportCovers() {
  const { ref, visible } = useInView();
  const mobile = useMobile();

  const pages = [
    { num: "01", title: "Your Score", detail: "What it means in plain English, what to fix first, and how far you are from the next band.", color: B.purple },
    { num: "02", title: "How Your Income Is Built", detail: "Composition, stress test, structural indicators, what\u2019s working, and what\u2019s holding you back.", color: B.teal },
    { num: "03", title: "What Could Go Wrong", detail: "Ranked risk scenarios with exact score drops. Fragility classification. Behavioral patterns to watch.", color: B.bandLimited },
    { num: "04", title: "Your Action Plan", detail: "Projected score impact per action, tradeoff analysis, week-by-week execution roadmap.", color: B.purple },
    { num: "05", title: "Methodology + Next Steps", detail: "How the score was calculated, assessment confidence, reassessment triggers, and your verification record.", color: B.teal },
  ];

  return (
    <section ref={ref} style={{ backgroundColor: "#FFFFFF", paddingTop: mobile ? S.sectionY.mobile : S.sectionY.desktop, paddingBottom: mobile ? S.sectionY.mobile : S.sectionY.desktop, paddingLeft: mobile ? S.padX.mobile : S.padX.desktop, paddingRight: mobile ? S.padX.mobile : S.padX.desktop }}>
      <div style={{ maxWidth: 640, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: mobile ? 36 : 48, opacity: visible ? 1 : 0, transform: visible ? "translateY(0)" : "translateY(12px)", transition: "opacity 500ms ease-out, transform 500ms ease-out" }}>
          <div style={{ fontSize: S.fsLabel, fontWeight: 700, letterSpacing: S.lsLabel, textTransform: "uppercase" as const, color: B.teal, marginBottom: 16 }}>The Report</div>
          <h2 style={{ fontSize: mobile ? S.fsH2.mobile : S.fsH2.desktop, color: B.navy, fontFamily: DISPLAY_FONT, fontWeight: 400, letterSpacing: S.lsHeading, lineHeight: S.lhHeading, marginBottom: 12 }}>
            Five pages. Five questions answered.
          </h2>
          <p style={{ fontSize: mobile ? S.fsBody.mobile : S.fsBody.desktop, color: B.muted, lineHeight: S.lhBody }}>
            Each page answers a different question about your income structure.
          </p>
        </div>

        {pages.map((page, i) => (
          <div key={page.num} style={{
            display: "flex", gap: 16, alignItems: "flex-start", padding: "20px 0",
            borderBottom: i < 4 ? `1px solid ${B.border}` : "none",
            opacity: visible ? 1 : 0, transform: visible ? "translateY(0)" : "translateY(10px)",
            transition: `opacity 500ms ease-out ${100 + i * 80}ms, transform 500ms ease-out ${100 + i * 80}ms`,
          }}>
            <div style={{
              width: 36, height: 36, borderRadius: 10, flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center",
              backgroundColor: B.sand, border: `1px solid ${B.border}`,
              fontSize: S.fsLabel, fontWeight: 700, color: page.color, position: "relative", overflow: "hidden",
            }}>
              <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 2, backgroundColor: page.color, opacity: 0.6 }} />
              {page.num}
            </div>
            <div>
              <div style={{ fontSize: mobile ? 16 : 18, fontWeight: 600, color: B.navy, marginBottom: 4 }}>{page.title}</div>
              <p style={{ fontSize: mobile ? S.fsCard.mobile : S.fsCard.desktop, color: B.muted, lineHeight: S.lhBody, margin: 0 }}>{page.detail}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

/* ================================================================== */
/* 6. CTA                                                              */
/* ================================================================== */
function CtaSection() {
  const { ref, visible } = useInView();
  const mobile = useMobile();
  const [hovered, setHovered] = useState(false);

  return (
    <section ref={ref} style={{ background: B.gradient, position: "relative", overflow: "hidden", paddingTop: mobile ? S.sectionY.mobile : S.sectionY.desktop, paddingBottom: mobile ? S.sectionY.mobile : S.sectionY.desktop }}>
      <div style={{ position: "absolute", top: "50%", left: "50%", width: 700, height: 700, transform: "translate(-50%, -50%)", background: "radial-gradient(circle, rgba(75,63,174,0.15) 0%, transparent 70%)", pointerEvents: "none" }} />
      <div style={{ maxWidth: S.maxW, margin: "0 auto", paddingLeft: mobile ? S.padX.mobile : S.padX.desktop, paddingRight: mobile ? S.padX.mobile : S.padX.desktop, position: "relative", zIndex: 1, textAlign: "center" }}>
        <div style={{ opacity: visible ? 1 : 0, transform: visible ? "translateY(0)" : "translateY(16px)", transition: "opacity 600ms ease-out, transform 600ms ease-out" }}>
          <h2 style={{ fontSize: mobile ? S.fsH2.mobile : S.fsH2.desktop, color: "#F4F1EA", fontFamily: DISPLAY_FONT, fontWeight: 400, letterSpacing: S.lsHeading, lineHeight: S.lhHeading, marginBottom: 20 }}>
            See where your income stands.
          </h2>
          <p style={{ fontSize: mobile ? S.fsBody.mobile : S.fsBody.desktop, color: "rgba(250,249,247,0.55)", lineHeight: S.lhBody, maxWidth: 440, margin: "0 auto 40px" }}>
            Your free score shows where you stand. The full report shows what to do about it.
          </p>
          <Link
            href="/pricing"
            onMouseEnter={() => canHover() && setHovered(true)}
            onMouseLeave={() => setHovered(false)}
            style={{
              display: "inline-flex", alignItems: "center", justifyContent: "center",
              height: mobile ? 48 : S.ctaH, paddingLeft: 36, paddingRight: 36, borderRadius: S.ctaRadius,
              backgroundColor: "#F4F1EA", color: B.navy, fontSize: S.fsCta, fontWeight: 600,
              textDecoration: "none", boxShadow: hovered ? "0 8px 28px rgba(0,0,0,0.25)" : "0 4px 16px rgba(0,0,0,0.15)",
              transform: hovered ? "translateY(-2px)" : "translateY(0)", transition: "box-shadow 260ms ease, transform 260ms ease",
            }}
          >
            Get My Free Score
          </Link>
          <div style={{ marginTop: 20, fontSize: S.fsMeta, color: "rgba(250,249,247,0.35)" }}>
            Free to start &#183; No bank connection &#183; No credit pull
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
      <WhatTheModelMeasures />
      <ClassificationScale />
      <ReportCovers />
      <CtaSection />
    </div>
  );
}
