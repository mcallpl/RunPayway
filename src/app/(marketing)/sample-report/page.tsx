"use client";

import { useState, useEffect, useRef } from "react";

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

const STRIPE_SINGLE = "https://buy.stripe.com/14A28j48E2socZQa2Z2Nq02";
const DISPLAY_FONT = "'DM Serif Display', Georgia, serif";
const FONT_IMPORT = `@import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display&display=swap');`;

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
  blurLevel = 0,
}: {
  children: React.ReactNode;
  visible: boolean;
  delay?: number;
  mobile: boolean;
  blurLevel?: number;
}) {
  return (
    <div
      style={{
        maxWidth: 700,
        margin: "0 auto",
        backgroundColor: "#ffffff",
        border: "1px solid rgba(14,26,43,0.06)",
        borderRadius: 12,
        boxShadow: "0 8px 32px rgba(14,26,43,0.06), 0 2px 8px rgba(14,26,43,0.03)",
        padding: mobile ? 24 : 32,
        position: "relative",
        overflow: "hidden",
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(20px)",
        transition: `opacity 0.6s ease-out ${delay}ms, transform 0.4s ease-out ${visible ? 0 : delay}ms`,
        filter: blurLevel > 0 ? `blur(${blurLevel}px)` : "none",
      }}
    >
      {/* Gradient accent bar */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: 2,
          background: `linear-gradient(90deg, ${B.purple}, ${B.teal})`,
        }}
      />
      {children}
    </div>
  );
}

function PageArrow({ visible }: { visible: boolean }) {
  return (
    <div style={{ textAlign: "center", padding: "20px 0", opacity: visible ? 0.3 : 0, transition: "opacity 0.5s ease-out" }}>
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={B.navy} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 5v14M19 12l-7 7-7-7" />
      </svg>
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
          fontWeight: 600,
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
      <style>{`@import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display&display=swap');`}</style>
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
              fontWeight: 600,
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
              fontFamily: DISPLAY_FONT,
              fontWeight: 400,
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
/* PAGE 1: YOUR SCORE                                                   */
/* ================================================================== */
function Page1Score() {
  const { ref, visible } = useInView();
  const mobile = useMobile();
  const score = useAnimatedCounter(78, visible, 1500);

  return (
    <section ref={ref} aria-label="Page 1 — Your Score" style={{ backgroundColor: "#F8F6F2", paddingTop: mobile ? 24 : 0, paddingBottom: mobile ? 24 : 32, paddingLeft: mobile ? 16 : 24, paddingRight: mobile ? 16 : 24 }}>
      <ReportCard visible={visible} mobile={mobile} delay={100} blurLevel={0}>
        {/* Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20, marginTop: 8, paddingBottom: 12, borderBottom: "1px solid rgba(14,26,43,0.12)" }}>
          <span style={{ fontSize: 13, fontWeight: 600, color: B.navy, letterSpacing: "0.06em" }}>RUNPAYWAY&trade;</span>
          <span style={{ fontSize: 11, color: B.light }}>Income Stability Score&trade; &middot; Model RP-2.0</span>
        </div>

        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 8 }}>
          <div style={{ fontSize: 10, fontWeight: 600, letterSpacing: "0.12em", textTransform: "uppercase", color: B.teal }}>YOUR INCOME STABILITY REPORT</div>
          <div style={{ flexShrink: 0, textAlign: "center" }}>
            <div style={{ width: 64, height: 64, backgroundColor: B.sand, border: "1px solid rgba(14,26,43,0.08)", borderRadius: 4, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
                <rect x="4" y="4" width="12" height="12" rx="1" fill={B.navy} />
                <rect x="32" y="4" width="12" height="12" rx="1" fill={B.navy} />
                <rect x="4" y="32" width="12" height="12" rx="1" fill={B.navy} />
                <rect x="7" y="7" width="6" height="6" rx="0.5" fill="#FFFFFF" />
                <rect x="35" y="7" width="6" height="6" rx="0.5" fill="#FFFFFF" />
                <rect x="7" y="35" width="6" height="6" rx="0.5" fill="#FFFFFF" />
                <rect x="9" y="9" width="2" height="2" fill={B.navy} />
                <rect x="37" y="9" width="2" height="2" fill={B.navy} />
                <rect x="9" y="37" width="2" height="2" fill={B.navy} />
                <rect x="20" y="4" width="3" height="3" fill={B.navy} />
                <rect x="20" y="10" width="3" height="3" fill={B.navy} />
                <rect x="26" y="4" width="3" height="3" fill={B.navy} />
                <rect x="20" y="20" width="3" height="3" fill={B.navy} />
                <rect x="26" y="20" width="3" height="3" fill={B.navy} />
                <rect x="32" y="20" width="3" height="3" fill={B.navy} />
                <rect x="20" y="26" width="3" height="3" fill={B.navy} />
                <rect x="32" y="26" width="3" height="3" fill={B.navy} />
                <rect x="38" y="26" width="3" height="3" fill={B.navy} />
                <rect x="26" y="32" width="3" height="3" fill={B.navy} />
                <rect x="32" y="32" width="3" height="3" fill={B.navy} />
                <rect x="38" y="38" width="3" height="3" fill={B.navy} />
                <rect x="20" y="38" width="3" height="3" fill={B.navy} />
              </svg>
            </div>
            <div style={{ fontSize: 9, color: B.light, marginTop: 3 }}>Scan to verify</div>
          </div>
        </div>
        <h2 style={{ fontSize: 22, fontFamily: DISPLAY_FONT, fontWeight: 400, color: B.navy, marginBottom: 16 }}>Your Score</h2>

        {/* Score + band */}
        <div style={{ marginBottom: 20 }}>
          <div style={{ fontSize: 64, fontWeight: 600, color: B.navy, lineHeight: 1, marginBottom: 8 }}>{score}</div>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 8 }}>
            <div style={{ width: 10, height: 10, borderRadius: 2, backgroundColor: B.bandHigh }} />
            <span style={{ fontSize: 16, fontWeight: 500, color: B.bandHigh }}>High Stability</span>
          </div>
          <div style={{ fontSize: 12, color: B.muted, marginTop: 6 }}>72nd percentile among Professional Services professionals in this benchmark</div>
        </div>

        {/* Classification scale */}
        <div style={{ marginBottom: 20 }}>
          <div style={{ fontSize: 10, fontWeight: 600, letterSpacing: "0.12em", textTransform: "uppercase", color: B.light, marginBottom: 8 }}>WHERE YOU LAND</div>
          <div style={{ display: "flex", gap: 2, height: 8, marginBottom: 8 }}>
            {[{ w: 30, color: B.bandLimited, active: false }, { w: 20, color: B.bandDeveloping, active: false }, { w: 25, color: B.bandEstablished, active: false }, { w: 25, color: B.bandHigh, active: true }].map((seg, i) => (
              <div key={i} style={{ width: `${seg.w}%`, backgroundColor: seg.color, borderRadius: i === 0 ? "3px 0 0 3px" : i === 3 ? "0 3px 3px 0" : 0, opacity: seg.active ? 1 : 0.25 }} />
            ))}
          </div>
          <div style={{ display: "flex", gap: 2 }}>
            {[{ range: "0–29", label: "Limited Stability", active: false }, { range: "30–49", label: "Developing Stability", active: false }, { range: "50–74", label: "Established Stability", active: false }, { range: "75–100", label: "High Stability", active: true }].map((b) => (
              <div key={b.range} style={{ flex: 1, opacity: b.active ? 1 : 0.5 }}>
                <div style={{ fontSize: 10, color: b.active ? B.bandHigh : B.light, fontWeight: b.active ? 600 : 400 }}>{b.range}</div>
                <div style={{ fontSize: 10, color: b.active ? B.navy : B.light, fontWeight: b.active ? 600 : 400 }}>{b.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Summary */}
        <p style={{ fontSize: 12, color: B.muted, lineHeight: 1.65, marginBottom: 10 }}>
          Sample Professional Services scored 78 out of 100. The income structure is strong, with substantial protection already in place. The focus now is on preserving strength and tightening remaining weak points.
        </p>
        <p style={{ fontSize: 11, color: B.teal, fontWeight: 500, marginBottom: 16 }}>
          Why this matters: income that looks fine today can still be structurally weak if too much depends on active work, one source, or income that is not secured ahead of time.
        </p>

        {/* Callout box */}
        <div style={{ backgroundColor: B.sand, border: "1px solid rgba(14,26,43,0.06)", borderLeft: `3px solid ${B.purple}`, borderRadius: 4, padding: "12px 16px", marginBottom: 16 }}>
          <p style={{ fontSize: 12, color: B.navy, lineHeight: 1.6, margin: 0, fontWeight: 500 }}>
            The main thing holding this profile back right now: not enough income secured ahead of time. Fixing this could raise the score by about 8 points.
          </p>
        </div>

        {/* 4 metric cards */}
        <div style={{ display: "grid", gridTemplateColumns: mobile ? "1fr 1fr" : "1fr 1fr 1fr 1fr", gap: 10, marginBottom: 20 }}>
          {[
            { label: "INCOME THAT WOULD CONTINUE IF YOU STOPPED WORKING TODAY", value: "38%", body: "A moderate level of continuity." },
            { label: "IF THE LARGEST INCOME SOURCE DISAPPEARED", value: "78 → 56", body: "Too much still depends on one source." },
            { label: "MAIN REASON THE SCORE IS HELD BACK", value: "Not enough income secured ahead of time", body: "More income needs to be committed before each month begins." },
            { label: "OVERALL DURABILITY", value: "Strong protection", body: "The structure holds up well under most common disruptions." },
          ].map((m) => (
            <div key={m.label} style={{ backgroundColor: B.sand, border: "1px solid rgba(14,26,43,0.06)", borderRadius: 4, padding: "12px 14px" }}>
              <div style={{ fontSize: 9, fontWeight: 600, letterSpacing: "0.12em", textTransform: "uppercase", color: B.teal, marginBottom: 6 }}>{m.label}</div>
              <div style={{ fontSize: 13, fontWeight: 600, color: B.navy, marginBottom: 4, lineHeight: 1.3 }}>{m.value}</div>
              <div style={{ fontSize: 10, color: B.muted, lineHeight: 1.5 }}>{m.body}</div>
            </div>
          ))}
        </div>

        {/* Profile row */}
        <div style={{ display: "flex", justifyContent: "space-between", paddingTop: 12, borderTop: "1px solid rgba(14,26,43,0.12)", marginBottom: 12 }}>
          {[["Prepared for", "Sample Professional Services"], ["Industry", "Professional Services"], ["Date Issued", "2026-03-22"], ["Record ID", "a1b2c3d4"]].map(([l, v]) => (
            <div key={l}>
              <div style={{ fontSize: 10, color: B.light }}>{l}</div>
              <div style={{ fontSize: 11, fontWeight: 500, color: B.navy }}>{v}</div>
            </div>
          ))}
        </div>

        <p style={{ fontSize: 10, color: B.light, lineHeight: 1.5, margin: 0, fontStyle: "italic" }}>
          The Income Stability Score is a present-state assessment based on information provided by the user. It does not provide financial advice and does not predict future financial outcomes.
        </p>

        <CardFooter left="Your Score · Page 1" right="Model RP-2.0 · runpayway.com/methodology" />
      </ReportCard>
    </section>
  );
}

/* ================================================================== */
/* PAGE 2: WHAT THIS SCORE MEANS                                       */
/* ================================================================== */
function Page2WhyThisScore() {
  const { ref, visible } = useInView();
  const mobile = useMobile();

  return (
    <section ref={ref} aria-label="Page 2 — What This Score Means" style={{ backgroundColor: "#F8F6F2", paddingTop: mobile ? 24 : 0, paddingBottom: mobile ? 24 : 32, paddingLeft: mobile ? 16 : 24, paddingRight: mobile ? 16 : 24 }}>
      <ReportCard visible={visible} mobile={mobile} delay={100} blurLevel={1.5}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20, marginTop: 8, paddingBottom: 12, borderBottom: "1px solid rgba(14,26,43,0.12)" }}>
          <span style={{ fontSize: 13, fontWeight: 600, color: B.navy, letterSpacing: "0.06em" }}>RUNPAYWAY&trade;</span>
          <span style={{ fontSize: 11, color: B.light }}>Income Stability Score&trade; &middot; Model RP-2.0</span>
        </div>

        <h2 style={{ fontSize: 22, fontFamily: DISPLAY_FONT, fontWeight: 400, color: B.navy, marginBottom: 10 }}>What This Score Means</h2>
        <p style={{ fontSize: 12, color: B.muted, lineHeight: 1.65, marginBottom: 24 }}>
          Sample Professional Services scored 78 out of 100. This is a strong score. The structure already has substantial protection, with only limited weaknesses remaining.
        </p>

        {/* What is already working */}
        <div style={{ fontSize: 10, fontWeight: 600, letterSpacing: "0.12em", textTransform: "uppercase", color: B.teal, marginBottom: 10 }}>WHAT IS ALREADY WORKING</div>
        <div style={{ display: "flex", flexDirection: "column", gap: 16, marginBottom: 24 }}>
          <div>
            <div style={{ fontSize: 13, fontWeight: 600, color: B.navy, marginBottom: 4 }}>The structure is already strong</div>
            <p style={{ fontSize: 12, color: B.muted, margin: 0, lineHeight: 1.6 }}>Protection is already substantial. The focus is refinement rather than repair.</p>
          </div>
          <div>
            <div style={{ fontSize: 13, fontWeight: 600, color: B.navy, marginBottom: 4 }}>Some income would continue even if active work stopped</div>
            <p style={{ fontSize: 12, color: B.muted, margin: 0, lineHeight: 1.6 }}>38% of your income would likely keep coming in if active work stopped today.</p>
          </div>
          <div>
            <div style={{ fontSize: 13, fontWeight: 600, color: B.navy, marginBottom: 4 }}>The opportunity is refinement, not rebuilding</div>
            <p style={{ fontSize: 12, color: B.muted, margin: 0, lineHeight: 1.6 }}>The foundation is working. The next gains come from strengthening what is already in place.</p>
          </div>
        </div>

        <div style={{ height: 1, backgroundColor: "rgba(14,26,43,0.12)", margin: "0 0 20px" }} />

        {/* What is still vulnerable */}
        <div style={{ fontSize: 10, fontWeight: 600, letterSpacing: "0.12em", textTransform: "uppercase", color: B.teal, marginBottom: 10 }}>WHAT IS STILL VULNERABLE</div>
        <div style={{ display: "flex", flexDirection: "column", gap: 16, marginBottom: 24 }}>
          <div>
            <div style={{ fontSize: 13, fontWeight: 600, color: B.navy, marginBottom: 4 }}>More income needs to be secured ahead of time</div>
            <p style={{ fontSize: 12, color: B.muted, margin: 0, lineHeight: 1.6 }}>The next gains will come from having more income already committed before the month begins.</p>
          </div>
          <div>
            <div style={{ fontSize: 13, fontWeight: 600, color: B.navy, marginBottom: 4 }}>Too much still depends on one source</div>
            <p style={{ fontSize: 12, color: B.muted, margin: 0, lineHeight: 1.6 }}>If the largest income source disappeared, the score would likely fall from 78 to 56. That is still too large a drop.</p>
          </div>
        </div>

        <div style={{ height: 1, backgroundColor: "rgba(14,26,43,0.12)", margin: "0 0 20px" }} />

        {/* Interpretation */}
        <div style={{ fontSize: 10, fontWeight: 600, letterSpacing: "0.12em", textTransform: "uppercase", color: B.teal, marginBottom: 10 }}>PLAIN-ENGLISH INTERPRETATION</div>
        <p style={{ fontSize: 12, color: B.navy, lineHeight: 1.65, marginBottom: 20 }}>
          This is a strong score. The structure is already well-protected. The next gains come from preserving continuity, reducing residual risk, and maintaining strength over time.
        </p>

        {/* Bottom line */}
        <div style={{ backgroundColor: B.sand, border: "1px solid rgba(14,26,43,0.06)", borderLeft: `3px solid ${B.purple}`, borderRadius: 4, padding: "12px 16px" }}>
          <div style={{ fontSize: 10, fontWeight: 600, letterSpacing: "0.12em", textTransform: "uppercase", color: B.teal, marginBottom: 6 }}>BOTTOM LINE</div>
          <p style={{ fontSize: 12, color: B.navy, margin: 0, fontWeight: 500 }}>
            Sample Professional Services is strong. The next gains come from preserving resilience and reducing remaining weak points.
          </p>
        </div>

        <CardFooter left="What This Score Means · Page 2" right="Model RP-2.0 · runpayway.com/methodology" />
      </ReportCard>
    </section>
  );
}

/* ================================================================== */
/* PAGE 3: YOUR BIGGEST RISKS                                          */
/* ================================================================== */
function Page3WhatCouldGoWrong() {
  const { ref, visible } = useInView();
  const mobile = useMobile();

  return (
    <section ref={ref} aria-label="Page 3 — Your Biggest Risks" style={{ backgroundColor: "#F8F6F2", paddingTop: mobile ? 24 : 0, paddingBottom: mobile ? 24 : 32, paddingLeft: mobile ? 16 : 24, paddingRight: mobile ? 16 : 24 }}>
      <ReportCard visible={visible} mobile={mobile} delay={100} blurLevel={3}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20, marginTop: 8, paddingBottom: 12, borderBottom: "1px solid rgba(14,26,43,0.12)" }}>
          <span style={{ fontSize: 13, fontWeight: 600, color: B.navy, letterSpacing: "0.06em" }}>RUNPAYWAY&trade;</span>
          <span style={{ fontSize: 11, color: B.light }}>Income Stability Score&trade; &middot; Model RP-2.0</span>
        </div>

        <h2 style={{ fontSize: 22, fontFamily: DISPLAY_FONT, fontWeight: 400, color: B.navy, marginBottom: 10 }}>Your Biggest Risks</h2>
        <p style={{ fontSize: 12, color: B.muted, lineHeight: 1.65, marginBottom: 20 }}>
          This page shows the main risks that could still weaken your income, even from a position of strength.
        </p>

        {/* Two cards */}
        <div style={{ display: "flex", gap: 12, marginBottom: 20 }}>
          <div style={{ flex: 3, backgroundColor: B.sand, border: "1px solid rgba(14,26,43,0.06)", borderRadius: 4, padding: "14px 18px" }}>
            <div style={{ fontSize: 10, fontWeight: 600, letterSpacing: "0.12em", textTransform: "uppercase", color: B.teal, marginBottom: 8 }}>IF YOUR LARGEST INCOME SOURCE DISAPPEARED</div>
            <div style={{ display: "flex", alignItems: "baseline", gap: 8, marginBottom: 6 }}>
              <span style={{ fontSize: 24, fontWeight: 600, color: B.navy }}>78</span>
              <span style={{ fontSize: 14, color: B.light }}>{"\u2192"}</span>
              <span style={{ fontSize: 24, fontWeight: 600, color: B.bandLimited }}>56</span>
            </div>
            <p style={{ fontSize: 11, color: B.muted, margin: 0, lineHeight: 1.5 }}>If the largest source disappeared, the score would drop sharply. Too much still depends on one source.</p>
          </div>
          <div style={{ flex: 2, backgroundColor: B.sand, border: "1px solid rgba(14,26,43,0.06)", borderRadius: 4, padding: "14px 18px" }}>
            <div style={{ fontSize: 10, fontWeight: 600, letterSpacing: "0.12em", textTransform: "uppercase", color: B.teal, marginBottom: 8 }}>HOW LONG INCOME WOULD CONTINUE IF WORK STOPPED</div>
            <div style={{ fontSize: 18, fontWeight: 600, color: B.navy, marginBottom: 4 }}>Estimated: 8.2 months</div>
            <p style={{ fontSize: 11, color: B.muted, margin: 0, lineHeight: 1.5 }}>A meaningful level of continuity. Longer is better.</p>
          </div>
        </div>

        {/* Scenarios */}
        <div style={{ fontSize: 10, fontWeight: 600, letterSpacing: "0.12em", textTransform: "uppercase", color: B.teal, marginBottom: 10 }}>WHAT COULD HURT YOUR SCORE MOST</div>
        {[
          { severity: "HIGH", title: "You are unable to work for an extended period", body: "This would meaningfully weaken the current level of protection.", score: "78 \u2192 62" },
          { severity: "MODERATE", title: "An income channel you rely on changes its terms", body: "This would noticeably reduce the structure's current protection.", score: "78 \u2192 70" },
          { severity: "MODERATE", title: "You lose a key client or contract", body: "This would noticeably reduce the structure's current protection.", score: "78 \u2192 72" },
        ].map((s) => (
          <div key={s.title} style={{ padding: "10px 0", borderBottom: "1px solid rgba(14,26,43,0.12)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 4 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <span style={{ fontSize: 10, fontWeight: 600, color: s.severity === "HIGH" ? B.bandDeveloping : B.muted, minWidth: 60 }}>{s.severity}</span>
                <span style={{ fontSize: 12, fontWeight: 600, color: B.navy }}>{s.title}</span>
              </div>
              <span style={{ fontSize: 11, color: B.navy, flexShrink: 0 }}>{s.score}</span>
            </div>
            <div style={{ paddingLeft: 70 }}>
              <p style={{ fontSize: 11, color: B.muted, margin: 0 }}>{s.body}</p>
            </div>
          </div>
        ))}

        {/* Income mix */}
        <div style={{ marginTop: 20 }}>
          <div style={{ fontSize: 10, fontWeight: 600, letterSpacing: "0.12em", textTransform: "uppercase", color: B.teal, marginBottom: 8 }}>HOW THE INCOME IS CURRENTLY BUILT</div>
          <div style={{ display: "flex", gap: 2, height: 8, marginBottom: 10 }}>
            <div style={{ width: "42%", backgroundColor: B.navy, borderRadius: 1 }} />
            <div style={{ width: "28%", backgroundColor: B.light, borderRadius: 1 }} />
            <div style={{ width: "30%", backgroundColor: B.teal, borderRadius: 1 }} />
          </div>
          <div style={{ display: "flex", gap: 16, fontSize: 11 }}>
            <span><span style={{ display: "inline-block", width: 8, height: 8, backgroundColor: B.navy, borderRadius: 1, marginRight: 6 }} />Earned through active work — 42%</span>
            <span><span style={{ display: "inline-block", width: 8, height: 8, backgroundColor: B.light, borderRadius: 1, marginRight: 6 }} />Repeatable income — 28%</span>
            <span><span style={{ display: "inline-block", width: 8, height: 8, backgroundColor: B.teal, borderRadius: 1, marginRight: 6 }} />Continues without daily work — 30%</span>
          </div>
        </div>

        <CardFooter left="Your Biggest Risks · Page 3" right="Model RP-2.0 · runpayway.com/methodology" />
      </ReportCard>
    </section>
  );
}

/* ================================================================== */
/* PAGE 4: HOW TO RAISE YOUR SCORE                                     */
/* ================================================================== */
function Page4HowToImprove() {
  const { ref, visible } = useInView();
  const mobile = useMobile();

  return (
    <section ref={ref} aria-label="Page 4 — How to Raise Your Score" style={{ backgroundColor: "#F8F6F2", paddingTop: mobile ? 24 : 0, paddingBottom: mobile ? 24 : 32, paddingLeft: mobile ? 16 : 24, paddingRight: mobile ? 16 : 24 }}>
      <ReportCard visible={visible} mobile={mobile} delay={100} blurLevel={5}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20, marginTop: 8, paddingBottom: 12, borderBottom: "1px solid rgba(14,26,43,0.12)" }}>
          <span style={{ fontSize: 13, fontWeight: 600, color: B.navy, letterSpacing: "0.06em" }}>RUNPAYWAY&trade;</span>
          <span style={{ fontSize: 11, color: B.light }}>Income Stability Score&trade; &middot; Model RP-2.0</span>
        </div>

        <h2 style={{ fontSize: 22, fontFamily: DISPLAY_FONT, fontWeight: 400, color: B.navy, marginBottom: 10 }}>How to Raise Your Score</h2>
        <p style={{ fontSize: 12, color: B.muted, lineHeight: 1.65, marginBottom: 20 }}>
          The fastest way to raise this score is not just to work more. It is to improve how the income is structured — with more income secured ahead of time, less dependence on one source, and more income that continues without daily effort.
        </p>

        {/* Band boxes */}
        <div style={{ display: "flex", gap: 12, marginBottom: 20 }}>
          <div style={{ flex: 1, backgroundColor: B.sand, border: "1px solid rgba(14,26,43,0.06)", borderLeft: `3px solid ${B.bandHigh}`, borderRadius: 4, padding: "12px 16px" }}>
            <div style={{ fontSize: 10, fontWeight: 600, letterSpacing: "0.12em", textTransform: "uppercase", color: B.teal, marginBottom: 6 }}>CURRENT BAND</div>
            <div style={{ fontSize: 13, fontWeight: 600, color: B.bandHigh }}>High Stability | 78</div>
            <p style={{ fontSize: 10, color: B.muted, margin: "6px 0 0" }}>The structure is strong, with only limited areas left to refine.</p>
          </div>
          <div style={{ flex: 1, backgroundColor: B.sand, border: "1px solid rgba(14,26,43,0.06)", borderLeft: `3px solid ${B.bandHigh}`, borderRadius: 4, padding: "12px 16px" }}>
            <div style={{ fontSize: 10, fontWeight: 600, letterSpacing: "0.12em", textTransform: "uppercase", color: B.teal, marginBottom: 6 }}>NEXT TARGET</div>
            <div style={{ fontSize: 13, fontWeight: 600, color: B.navy }}>Maintain Current</div>
            <p style={{ fontSize: 10, color: B.muted, margin: "6px 0 0" }}>The focus now is not a new band. It is preserving strength and reducing remaining weak points.</p>
          </div>
        </div>

        {/* Improvement rows */}
        <div style={{ fontSize: 10, fontWeight: 600, letterSpacing: "0.12em", textTransform: "uppercase", color: B.teal, marginBottom: 10 }}>IF YOU MADE THESE CHANGES</div>
        <p style={{ fontSize: 11, color: B.muted, marginBottom: 12 }}>These are the changes that would likely raise your score the most.</p>
        {[
          { num: "1", title: "Secure more income before next month begins", lift: "+8 points", result: "\u2192 86" },
          { num: "2", title: "Reduce reliance on the largest source", lift: "+5 points", result: "\u2192 83" },
          { num: "3", title: "Build more repeatable income", lift: "+3 points", result: "\u2192 81" },
        ].map((r) => (
          <div key={r.num} style={{ padding: "10px 0", borderBottom: "1px solid rgba(14,26,43,0.12)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <span style={{ fontSize: 16, fontWeight: 600, color: B.purple, minWidth: 20 }}>{r.num}</span>
                <span style={{ fontSize: 12, fontWeight: 600, color: B.navy }}>{r.title}</span>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 6, flexShrink: 0 }}>
                <span style={{ fontSize: 11, fontWeight: 600, color: B.teal }}>{r.lift}</span>
                <span style={{ fontSize: 10, color: B.muted }}>{r.result}</span>
              </div>
            </div>
          </div>
        ))}
        <p style={{ fontSize: 11, color: B.muted, marginTop: 10, fontStyle: "italic" }}>These changes would further strengthen an already strong structure.</p>

        {/* Priorities */}
        <div style={{ marginTop: 20, display: "flex", flexDirection: "column", gap: 14 }}>
          {[
            { rank: "Priority 1", title: "Secure more income ahead of time", body: "Lock in income before each month begins \u2014 retainers, multi-month agreements, advance bookings, or recurring contracts." },
            { rank: "Priority 2", title: "Reduce reliance on the largest source", body: "Add or strengthen dependable secondary sources so the structure is not overexposed to one client or channel." },
            { rank: "Priority 3", title: "Build more repeatable income", body: "Convert one-time work into income that repeats, renews, or continues without needing to be rebuilt each time." },
          ].map((p) => (
            <div key={p.rank} style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
              <span style={{ fontSize: 10, fontWeight: 600, color: B.purple, minWidth: 56, paddingTop: 2 }}>{p.rank}</span>
              <div>
                <div style={{ fontSize: 12, fontWeight: 600, color: B.navy, marginBottom: 3 }}>{p.title}</div>
                <p style={{ fontSize: 11, color: B.muted, margin: 0, lineHeight: 1.5 }}>{p.body}</p>
              </div>
            </div>
          ))}
        </div>

        <CardFooter left="How to Raise Your Score · Page 4" right="Model RP-2.0 · runpayway.com/methodology" />
      </ReportCard>
    </section>
  );
}

/* ================================================================== */
/* PAGE 5: WHAT TO DO NEXT                                             */
/* ================================================================== */
function Page5WhatToDoNext() {
  const { ref, visible } = useInView();
  const mobile = useMobile();

  return (
    <section ref={ref} aria-label="Page 5 — What to Do Next" style={{ backgroundColor: "#F8F6F2", paddingTop: mobile ? 24 : 0, paddingBottom: mobile ? 24 : 32, paddingLeft: mobile ? 16 : 24, paddingRight: mobile ? 16 : 24 }}>
      <ReportCard visible={visible} mobile={mobile} delay={100} blurLevel={7}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20, marginTop: 8, paddingBottom: 12, borderBottom: "1px solid rgba(14,26,43,0.12)" }}>
          <span style={{ fontSize: 13, fontWeight: 600, color: B.navy, letterSpacing: "0.06em" }}>RUNPAYWAY&trade;</span>
          <span style={{ fontSize: 11, color: B.light }}>Income Stability Score&trade; &middot; Model RP-2.0</span>
        </div>

        <h2 style={{ fontSize: 22, fontFamily: DISPLAY_FONT, fontWeight: 400, color: B.navy, marginBottom: 10 }}>What to Do Next</h2>
        <p style={{ fontSize: 12, color: B.muted, lineHeight: 1.65, marginBottom: 20 }}>
          The priority now is to preserve strength, reduce residual vulnerabilities, and maintain continuity over time.
        </p>

        {/* Two columns */}
        <div style={{ display: "flex", gap: 20, marginBottom: 20 }}>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 13, fontWeight: 600, color: B.navy, marginBottom: 8 }}>What to do next</div>
            {["Lock in at least one income source committed for more than one month", "Reduce how much the structure depends on the single largest source", "Build more income that repeats or continues without daily work", "Know more of next month\u2019s income before the month begins", "Reassess only after these changes are actually live"].map((item, i) => (
              <div key={i} style={{ fontSize: 11, color: B.navy, display: "flex", gap: 8, marginBottom: 5 }}>
                <span style={{ color: B.purple, fontWeight: 600, flexShrink: 0 }}>{i + 1}.</span>{item}
              </div>
            ))}
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 13, fontWeight: 600, color: B.navy, marginBottom: 8 }}>What not to prioritize yet</div>
            {["Working more without improving the structure underneath it", "Short bursts of output that do not improve durability", "Temporary spikes that disappear when work stops"].map((item) => (
              <div key={item} style={{ fontSize: 11, color: B.muted, display: "flex", gap: 8, marginBottom: 5 }}>
                <span style={{ color: B.light }}>{"\u2014"}</span>{item}
              </div>
            ))}
          </div>
        </div>

        {/* 90-day plan */}
        <div style={{ fontSize: 10, fontWeight: 600, letterSpacing: "0.12em", textTransform: "uppercase", color: B.teal, marginBottom: 10 }}>YOUR 90-DAY ACTION PLAN</div>
        {["Create one offer or agreement that secures income ahead for more than one month.", "Identify the largest source and reduce how much the structure depends on it.", "Add one income stream that repeats or continues without daily work.", "Know more of next month\u2019s income before the month begins.", "Reassess only after the changes are active and producing real improvement."].map((item, i) => (
          <div key={i} style={{ display: "flex", gap: 12, alignItems: "flex-start", padding: "8px 0", borderBottom: "1px solid rgba(14,26,43,0.12)" }}>
            <div style={{ width: 14, height: 14, borderRadius: "50%", border: "1.5px solid rgba(14,26,43,0.12)", flexShrink: 0, marginTop: 1 }} />
            <span style={{ fontSize: 11, color: B.navy }}>{item}</span>
          </div>
        ))}

        {/* Bottom cards */}
        <div style={{ display: "flex", gap: 12, marginTop: 20 }}>
          <div style={{ flex: 1, backgroundColor: B.sand, border: "1px solid rgba(14,26,43,0.06)", borderRadius: 4, padding: "12px 16px" }}>
            <div style={{ fontSize: 10, fontWeight: 600, letterSpacing: "0.12em", textTransform: "uppercase", color: B.teal, marginBottom: 6 }}>WHEN TO REASSESS</div>
            <div style={{ fontSize: 13, fontWeight: 600, color: B.navy }}>2026-09-22</div>
            <div style={{ fontSize: 12, fontWeight: 600, color: B.purple, marginBottom: 4 }}>183 days from now</div>
            <p style={{ fontSize: 10, color: B.muted, margin: 0, lineHeight: 1.5 }}>Reassess after real improvement is in place, not after a short-term spike.</p>
          </div>
          <div style={{ flex: 1, backgroundColor: B.sand, border: "1px solid rgba(14,26,43,0.06)", borderRadius: 4, padding: "12px 16px" }}>
            <div style={{ fontSize: 10, fontWeight: 600, letterSpacing: "0.12em", textTransform: "uppercase", color: B.teal, marginBottom: 6 }}>HOW YOU COMPARE</div>
            <div style={{ fontSize: 11, color: B.navy }}>Peer average: <strong>52</strong></div>
            <div style={{ fontSize: 11, color: B.navy }}>Top 20% threshold: <strong>72</strong></div>
            <div style={{ fontSize: 11, color: B.navy }}>Your percentile: <strong style={{ color: B.purple }}>72nd</strong></div>
            <p style={{ fontSize: 10, color: B.muted, margin: "6px 0 0", fontStyle: "italic" }}>This score is above both the peer average and the top 20% benchmark. The focus now is maintaining this position.</p>
          </div>
        </div>

        <CardFooter left="What to Do Next · Page 5" right="Model RP-2.0 · runpayway.com/methodology" />
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
              fontFamily: DISPLAY_FONT,
              fontWeight: 400,
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
              fontWeight: 600,
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
function ArrowBetweenPages() {
  const { ref, visible } = useInView();
  return (
    <div ref={ref} style={{ backgroundColor: "#F8F6F2", paddingTop: 8, paddingBottom: 8 }}>
      <PageArrow visible={visible} />
    </div>
  );
}

export default function SampleReportPage() {
  return (
    <div style={{ backgroundColor: "#F8F6F2" }}>
      <Hero />
      <div style={{ paddingTop: 8 }} />
      <Page1Score />
      <ArrowBetweenPages />
      <Page2WhyThisScore />
      <ArrowBetweenPages />
      <Page3WhatCouldGoWrong />
      <ArrowBetweenPages />
      <Page4HowToImprove />
      <ArrowBetweenPages />
      <Page5WhatToDoNext />
      <div style={{ paddingTop: 8 }} />
      <CtaSection />
    </div>
  );
}
