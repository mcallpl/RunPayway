"use client";

import { useState, useEffect, useRef, useCallback } from "react";
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

/* Animated counter hook — counts from 0 to target when triggered */
function useAnimatedCounter(target: number, trigger: boolean, duration = 1500) {
  const [value, setValue] = useState(0);
  const animated = useRef(false);
  useEffect(() => {
    if (!trigger || animated.current) return;
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
  }, [trigger, target, duration]);
  return value;
}

const B = {
  navy: "#0E1A2B",
  purple: "#4B3FAE",
  teal: "#1A7A6D",               // warmer, richer — higher contrast on dark bg
  sand: "#F5F2EC",               // slightly warmer than before
  offWhite: "#FAFAF8",           // not pure white — reduces glare
  muted: "rgba(14,26,43,0.55)",  // slightly softer for body text
  light: "rgba(14,26,43,0.38)",  // metadata / tertiary
  border: "rgba(14,26,43,0.08)", // unified border token
  gradient: "linear-gradient(145deg, #0E1A2B 0%, #161430 35%, #3D2F9C 65%, #1A7A6D 100%)",
};

// ── SPACING SCALE: 4px base, powers of 2 ──
// 4, 8, 12, 16, 24, 32, 48, 64, 80, 96, 120, 160
const S = {
  // Section vertical rhythm
  sectionY:     { desktop: 120, mobile: 72 },
  sectionYlg:   { desktop: 144, mobile: 80 },
  sectionYsm:   { desktop: 80, mobile: 48 },
  transitionY:  { desktop: 48, mobile: 32 },
  // Layout
  maxW:         1100,
  subtextMaxW:  520,
  padX:         { desktop: 56, mobile: 28 },
  // Vertical gaps (strict 4px grid)
  h1mb:         24,
  h2mb:         16,
  subtextMb:    48,
  paraMb:       16,
  labelMb:      12,
  sectionHeaderMb: { desktop: 48, mobile: 32 },
  // Cards
  cardPad:      { desktop: 32, mobile: 24 },
  cardRadius:   8,
  panelRadius:  12,
  gridGap:      16,
  gridGapSm:    12,
  // CTA
  ctaH:         52,
  ctaHsm:       44,
  ctaPadX:      32,
  ctaRadius:    10,
  // Typography
  lhHeading:    1.08,
  lhBody:       1.6,
  lhDense:      1.45,
  lsHeading:    "-0.025em",
  lsHero:       "-0.03em",
  lsLabel:      "0.10em",
};

const DISPLAY_FONT = "'DM Serif Display', Georgia, serif";

function RevealText({ text, visible, baseDelay = 0 }: { text: string; visible: boolean; baseDelay?: number }) {
  return (
    <span>
      {text.split(" ").map((word, i) => (
        <span
          key={i}
          style={{
            display: "inline-block",
            opacity: visible ? 1 : 0,
            transform: visible ? "translateY(0)" : "translateY(10px)",
            transition: `opacity 350ms ease-out ${baseDelay + i * 60}ms, transform 350ms ease-out ${baseDelay + i * 60}ms`,
            marginRight: "0.28em",
          }}
        >
          {word}
        </span>
      ))}
    </span>
  );
}




/* ================================================================== */
/* ANIMATED SCORE RING — SVG with stroke-dasharray animation           */
/* ================================================================== */
function AnimatedScoreRing({ visible, mobile }: { visible: boolean; mobile: boolean }) {
  const score = 78;
  const radius = 70;
  const strokeWidth = 6;
  const circumference = 2 * Math.PI * radius;
  const targetOffset = (1 - score / 100) * circumference;
  const animatedScore = useAnimatedCounter(score, visible, 1500);
  const [showLabel, setShowLabel] = useState(false);

  useEffect(() => {
    if (!visible) return;
    const timer = setTimeout(() => setShowLabel(true), 1600);
    return () => clearTimeout(timer);
  }, [visible]);

  const size = mobile ? 220 : 280;

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
      <div style={{ position: "relative", width: size, height: size }}>
        {/* Soft glow behind ring */}
        <div style={{
          position: "absolute", inset: -24,
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(75,63,174,0.10) 0%, rgba(26,122,109,0.05) 50%, transparent 70%)",
          animation: visible ? "ringGlow 5s ease-in-out infinite" : "none",
          pointerEvents: "none",
        }} />
        <svg
          width={size}
          height={size}
          viewBox="0 0 160 160"
          style={{ transform: "rotate(-90deg)" }}
        >
          {/* Outer atmospheric ring */}
          <circle
            cx="80" cy="80" r={radius + 12}
            fill="none"
            stroke="rgba(255,255,255,0.04)"
            strokeWidth={1}
          />
          <circle
            cx="80" cy="80" r={radius}
            fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth={strokeWidth}
          />
          <circle
            cx="80" cy="80" r={radius}
            fill="none" stroke="url(#scoreGradient)" strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={visible ? targetOffset : circumference}
            style={{ transition: `stroke-dashoffset 2s cubic-bezier(0.22, 1, 0.36, 1)` }}
          />
          {/* Glow dot at arc end */}
          {visible && (
            <circle
              cx="80"
              cy={80 - radius}
              fill="rgba(31,109,122,0.6)"
              r={4}
              style={{
                transform: `rotate(${(score / 100) * 360}deg)`,
                transformOrigin: "80px 80px",
                transition: "transform 2s cubic-bezier(0.22, 1, 0.36, 1)",
                filter: "blur(2px)",
              }}
            />
          )}
          <defs>
            <linearGradient id="scoreGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor={B.teal} />
              <stop offset="50%" stopColor={B.purple} />
              <stop offset="100%" stopColor="#7B6FE0" />
            </linearGradient>
          </defs>
        </svg>
        <div
          style={{
            position: "absolute", inset: 0,
            display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
          }}
        >
          <style>{`
            @keyframes scorePulse {
              0%, 100% { opacity: 1; }
              50% { opacity: 0.85; }
            }
          `}</style>
          <span
            style={{
              fontSize: mobile ? 52 : 64, fontWeight: 600, color: "#F4F1EA",
              lineHeight: 1, letterSpacing: "-0.03em", fontVariantNumeric: "tabular-nums",
              animation: "none",
            }}
          >
            {animatedScore}
          </span>
        </div>
      </div>

      <div
        style={{
          textAlign: "center", marginTop: 16,
          opacity: showLabel ? 1 : 0,
          transform: showLabel ? "translateY(0)" : "translateY(6px)",
          transition: "opacity 500ms ease-out, transform 500ms ease-out",
        }}
      >
        <div
          style={{
            display: "inline-flex", alignItems: "center", gap: 8,
            padding: "6px 16px", borderRadius: 100,
            backgroundColor: "rgba(31,109,122,0.15)",
            border: "1px solid rgba(31,109,122,0.25)",
            marginBottom: 8,
          }}
        >
          <span style={{ width: 6, height: 6, borderRadius: 999, backgroundColor: B.teal }} />
          <span style={{ fontSize: 14, fontWeight: 600, color: B.teal, letterSpacing: "-0.01em" }}>
            High Stability
          </span>
        </div>
        <div style={{ fontSize: 13, color: "rgba(244,241,234,0.50)", fontWeight: 500 }}>
          72nd percentile
        </div>
      </div>
    </div>
  );
}


/* ================================================================== */
/* SECTION 1: HERO — "The Command Center"                              */
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
      <style>{`@import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display&display=swap');
input[type="range"]::-webkit-slider-thumb {
  -webkit-appearance: none;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background: #ffffff;
  border: 2px solid rgba(75,63,174,0.5);
  box-shadow: 0 2px 8px rgba(0,0,0,0.2);
  cursor: pointer;
}
@keyframes ringGlow {
  0%, 100% { opacity: 0.5; }
  50% { opacity: 0.8; }
}
`}</style>

      <div
        className="relative mx-auto"
        style={{
          maxWidth: S.maxW,
          paddingTop: mobile ? 96 : 160,
          paddingBottom: mobile ? 72 : 120,
          paddingLeft: mobile ? S.padX.mobile : S.padX.desktop,
          paddingRight: mobile ? S.padX.mobile : S.padX.desktop,
        }}
      >
        <div
          style={{
            display: mobile ? "block" : "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 64,
          }}
        >
          {/* LEFT SIDE — Text content */}
          <div style={{ flex: 1, textAlign: mobile ? "center" : "left" }}>
            <div
              className="font-medium uppercase text-[11px] md:text-[12px]"
              style={{
                letterSpacing: S.lsLabel,
                color: B.teal,
                marginBottom: S.h2mb,
                opacity: visible ? 1 : 0,
                transform: visible ? "translateY(0)" : "translateY(8px)",
                transition: "opacity 500ms ease-out, transform 500ms ease-out",
              }}
            >
              Income Stability Score&#8482;
            </div>

            <p
              style={{
                fontSize: mobile ? 13 : 15,
                color: "rgba(244,241,234,0.50)",
                lineHeight: 1.6,
                marginBottom: mobile ? 16 : 20,
                opacity: visible ? 1 : 0,
                transition: "opacity 500ms ease-out 100ms",
              }}
            >
              For freelancers, contractors, business owners, and anyone whose income doesn&#8217;t come from a single paycheck.
            </p>

            <h1
              style={{
                fontSize: mobile ? 34 : 56,
                fontWeight: 400,
                color: "#F4F1EA",
                lineHeight: 1.06,
                letterSpacing: S.lsHero,
                marginBottom: S.h1mb,
                maxWidth: mobile ? undefined : 600,
                fontFamily: DISPLAY_FONT,
              }}
            >
              <RevealText text="Could your income survive the next 60 days?" visible={visible} baseDelay={200} />
            </h1>

            <p
              style={{
                fontSize: mobile ? 15 : 16,
                color: "rgba(244,241,234,0.60)",
                lineHeight: S.lhBody,
                marginBottom: S.paraMb,
                maxWidth: mobile ? undefined : 500,
                opacity: visible ? 1 : 0,
                transform: visible ? "translateY(0)" : "translateY(10px)",
                transition: "opacity 600ms ease-out 200ms, transform 600ms ease-out 200ms",
              }}
            >
              Most people don&#8217;t know until it&#8217;s too late. Get your score in under 2 minutes. See exactly where your income is vulnerable.
            </p>

            <p
              style={{
                fontSize: mobile ? 13 : 14,
                color: "rgba(244,241,234,0.35)",
                lineHeight: S.lhDense,
                marginBottom: 32,
                maxWidth: mobile ? undefined : 500,
                opacity: visible ? 1 : 0,
                transition: "opacity 600ms ease-out 300ms",
              }}
            >
              No bank connection. No credit pull. Free to start.
            </p>

            <div
              style={{
                opacity: visible ? 1 : 0,
                transform: visible ? "translateY(0)" : "translateY(10px)",
                transition: "opacity 500ms ease-out 350ms, transform 500ms ease-out 350ms",
              }}
            >
              <Link
                href="/pricing"
                className="cta-tick inline-flex items-center justify-center font-semibold focus:outline-none focus:ring-2 focus:ring-offset-2"
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
                  boxShadow: "inset 0 1px 0 rgba(255,255,255,0.4), 0 8px 24px rgba(0,0,0,0.20), 0 2px 6px rgba(0,0,0,0.12)",
                  transition: "background 180ms ease, transform 180ms ease, box-shadow 180ms ease",
                }}
                onMouseEnter={(e) => {
                  if (!canHover()) return;
                  const el = e.currentTarget;
                  el.style.background = "linear-gradient(135deg, #EDECEA 0%, #E5E2DA 100%)";
                  el.style.transform = "translateY(-2px)";
                  el.style.boxShadow = "inset 0 1px 0 rgba(255,255,255,0.4), 0 12px 32px rgba(0,0,0,0.25), 0 2px 8px rgba(0,0,0,0.15)";
                }}
                onMouseLeave={(e) => {
                  const el = e.currentTarget;
                  el.style.background = "linear-gradient(135deg, #F4F1EA 0%, #EDECEA 100%)";
                  el.style.transform = "translateY(0)";
                  el.style.boxShadow = "inset 0 1px 0 rgba(255,255,255,0.4), 0 8px 24px rgba(0,0,0,0.20), 0 2px 6px rgba(0,0,0,0.12)";
                }}
                onMouseDown={(e) => { e.currentTarget.style.transform = "translateY(0)"; }}
              >
                <span className="tick tick-navy" />
                <span className="cta-label">Get My Free Score</span>
                <span className="cta-arrow cta-arrow-navy" />
              </Link>
              <p style={{ fontSize: 13, color: "rgba(244,241,234,0.30)", marginTop: 16, letterSpacing: "0.01em" }}>
                What happens to your score if your biggest client leaves tomorrow?
              </p>
            </div>
          </div>

          {/* RIGHT SIDE — Animated Score Ring */}
          <div
            style={{
              flexShrink: 0,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              marginTop: mobile ? 56 : 0,
              opacity: visible ? 1 : 0,
              transition: "opacity 800ms ease-out 400ms",
            }}
          >
            <div
              style={{
                fontSize: 11, fontWeight: 600, textTransform: "uppercase",
                letterSpacing: "0.08em", color: "rgba(244,241,234,0.40)",
                marginBottom: 16, textAlign: "center",
              }}
            >
              Sample Score
            </div>
            <AnimatedScoreRing visible={visible} mobile={mobile} />
          </div>
        </div>

      </div>


    </section>
  );
}


/* ================================================================== */
/* BRIDGE — Emotional beat between hero and methodology                 */
/* ================================================================== */
function BridgeSection() {
  const { ref, visible } = useInView();
  const mobile = useMobile();

  return (
    <section
      ref={ref}
      aria-label="Why this matters"
      style={{
        background: B.navy,
        paddingTop: mobile ? 32 : 48,
        paddingBottom: mobile ? 32 : 48,
        paddingLeft: mobile ? S.padX.mobile : S.padX.desktop,
        paddingRight: mobile ? S.padX.mobile : S.padX.desktop,
        borderBottom: "1px solid rgba(244,241,234,0.06)",
      }}
    >
      <div
        style={{
          maxWidth: 680,
          margin: "0 auto",
          textAlign: "center",
          opacity: visible ? 1 : 0,
          transform: visible ? "translateY(0)" : "translateY(12px)",
          transition: "opacity 700ms ease-out, transform 700ms ease-out",
        }}
      >
        <p
          style={{
            fontSize: mobile ? 17 : 21,
            fontFamily: DISPLAY_FONT,
            fontWeight: 400,
            color: "rgba(244,241,234,0.75)",
            lineHeight: 1.4,
            letterSpacing: S.lsHeading,
            margin: 0,
          }}
        >
          The average self-employed professional has less than 30 days of income protection.
          Most don&#8217;t find out until a client leaves, a contract ends, or they can&#8217;t work.
        </p>
      </div>
    </section>
  );
}


/* ================================================================== */
/* SECTION 2: FOUR FACTORS — "What We Measure"                         */
/* ================================================================== */
function FourFactorsSection() {
  const { ref, visible } = useInView();
  const mobile = useMobile();

  const factors = [
    {
      num: "01",
      label: "Recurrence",
      question: "Do you rebuild your income from scratch every month?",
      description: "No retainers, no subscriptions, no recurring contracts means you start at zero every month.",
    },
    {
      num: "02",
      label: "Concentration",
      question: "Would losing one client wipe out half your income?",
      description: "One lost contract or one client decision can collapse your entire income structure.",
    },
    {
      num: "03",
      label: "Visibility",
      question: "Do you know what you will earn next month?",
      description: "If your income is not already committed — booked, contracted, locked in — you are guessing.",
    },
    {
      num: "04",
      label: "Passivity",
      question: "If you stopped working today, when does the money stop?",
      description: "If 100% requires your daily effort, any disruption immediately threatens everything.",
    },
  ];

  return (
    <section
      ref={ref}
      aria-label="What RunPayway™ Measures"
      style={{
        background: "#FFFFFF",
        paddingTop: mobile ? S.sectionYsm.mobile : S.sectionYsm.desktop,
        paddingBottom: mobile ? S.sectionY.mobile : S.sectionY.desktop,
        paddingLeft: mobile ? S.padX.mobile : S.padX.desktop,
        paddingRight: mobile ? S.padX.mobile : S.padX.desktop,
      }}
    >
      <div style={{ maxWidth: S.maxW, margin: "0 auto" }}>
        {/* Section header — left-aligned */}
        <div style={{ maxWidth: 560, marginBottom: mobile ? 40 : 48 }}>
          <div style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase" as const, letterSpacing: S.lsLabel, color: B.teal, marginBottom: 16, opacity: visible ? 1 : 0, transition: "opacity 400ms ease-out" }}>
            What We Measure
          </div>
          <h2 style={{
            fontSize: mobile ? 28 : 42, color: B.navy, lineHeight: 1.12,
            letterSpacing: "-0.025em", fontFamily: DISPLAY_FONT, fontWeight: 400, marginBottom: 16,
            opacity: visible ? 1 : 0, transform: visible ? "translateY(0)" : "translateY(16px)",
            transition: "opacity 600ms ease-out, transform 600ms ease-out",
          }}>
            The four structural risks that determine your score
          </h2>
          <p style={{ fontSize: mobile ? 15 : 16, color: B.muted, lineHeight: 1.65, opacity: visible ? 1 : 0, transition: "opacity 600ms ease-out 100ms" }}>
            If any one is weak, your income is exposed. The score quantifies exactly how much.
          </p>
        </div>

        {/* 4 cards — clean white on subtle bg, left-aligned content */}
        <div style={{ display: "grid", gridTemplateColumns: mobile ? "1fr" : "1fr 1fr", gap: mobile ? 12 : 16 }}>
          {factors.map((f, i) => (
            <div
              key={f.label}
              style={{
                background: B.navy,
                borderRadius: 8,
                padding: mobile ? "28px 24px" : "32px 32px",
                opacity: visible ? 1 : 0,
                transform: visible ? "translateY(0)" : "translateY(20px)",
                transition: `opacity 500ms ease-out ${150 + i * 80}ms, transform 500ms ease-out ${150 + i * 80}ms`,
              }}
            >
              {/* Number + label row */}
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 20 }}>
                <span style={{ fontSize: 12, fontWeight: 700, color: B.teal, letterSpacing: "0.06em" }}>{f.num}</span>
                <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.10em", textTransform: "uppercase" as const, color: "rgba(244,241,234,0.35)" }}>{f.label}</span>
              </div>

              {/* Question — the hook */}
              <h3 style={{ fontSize: mobile ? 19 : 22, fontWeight: 500, color: "#F4F1EA", lineHeight: 1.3, letterSpacing: "-0.015em", marginBottom: 12 }}>
                {f.question}
              </h3>

              {/* Description */}
              <p style={{ fontSize: 14, color: "rgba(244,241,234,0.50)", lineHeight: 1.6, margin: 0 }}>
                {f.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}


/* ================================================================== */
/* SECTION 3: INCOME PATTERNS — "The Recognition"                      */
/* ================================================================== */
function IncomePatterns() {
  const { ref, visible } = useInView();
  const mobile = useMobile();
  const [expanded, setExpanded] = useState<number | null>(null);

  const patterns = [
    {
      label: "Recurring contracts",
      examples: "Retainers, subscriptions, recurring client work",
      score: 78,
      band: "High Stability",
      bandColor: "#16A34A",
      continuity: "68%",
      constraint: "Source concentration",
      stressScore: 52,
      bars: [85, 80, 82, 78, 84, 80],
      drivers: [
        { label: "Continuity", pct: 72, color: "#0F766E" },
        { label: "Income Secured Ahead", pct: 68, color: "#0F766E" },
        { label: "Source Diversification", pct: 45, color: "#D97706" },
      ],
    },
    {
      label: "Project-based",
      examples: "Milestone payments, seasonal cycles, variable invoicing",
      score: 41,
      band: "Developing Stability",
      bandColor: "#D97706",
      continuity: "22%",
      constraint: "Low forward visibility",
      stressScore: 18,
      bars: [30, 90, 20, 75, 45, 85],
      drivers: [
        { label: "Continuity", pct: 30, color: "#DC2626" },
        { label: "Income Secured Ahead", pct: 25, color: "#DC2626" },
        { label: "Source Diversification", pct: 55, color: "#0F766E" },
      ],
    },
    {
      label: "Portfolio income",
      examples: "Royalties, licensing, rental income, dividends",
      score: 82,
      band: "High Stability",
      bandColor: "#16A34A",
      continuity: "85%",
      constraint: "Earnings variability",
      stressScore: 64,
      bars: [60, 62, 58, 65, 60, 63],
      drivers: [
        { label: "Continuity", pct: 88, color: "#0F766E" },
        { label: "Income Secured Ahead", pct: 70, color: "#0F766E" },
        { label: "Source Diversification", pct: 62, color: "#0F766E" },
      ],
    },
    {
      label: "Blended streams",
      examples: "Multiple sources across different patterns",
      score: 63,
      band: "Established Stability",
      bandColor: "#2563EB",
      continuity: "48%",
      constraint: "Labor dependence",
      stressScore: 41,
      bars: [50, 70, 40, 80, 55, 72],
      drivers: [
        { label: "Continuity", pct: 52, color: "#D97706" },
        { label: "Income Secured Ahead", pct: 48, color: "#D97706" },
        { label: "Source Diversification", pct: 75, color: "#0F766E" },
      ],
    },
  ];

  return (
    <section
      ref={ref}
      aria-label="Income Patterns"
      style={{
        background: "linear-gradient(180deg, #F8F6F2 0%, #F4F1EA 100%)",
        paddingTop: mobile ? S.sectionY.mobile : S.sectionY.desktop,
        paddingBottom: mobile ? 80 : 120,
        paddingLeft: mobile ? S.padX.mobile : S.padX.desktop,
        paddingRight: mobile ? S.padX.mobile : S.padX.desktop,
      }}
    >
      <div className="mx-auto" style={{ maxWidth: S.maxW }}>
        {/* Header */}
        <div
          style={{
            display: mobile ? "block" : "flex",
            alignItems: "flex-end",
            justifyContent: "space-between",
            marginBottom: mobile ? 56 : 72,
            opacity: visible ? 1 : 0,
            transform: visible ? "translateY(0)" : "translateY(16px)",
            transition: "opacity 600ms ease-out, transform 600ms ease-out",
          }}
        >
          <div style={{ maxWidth: 560 }}>
            <div
              style={{
                fontSize: 11, fontWeight: 600, textTransform: "uppercase",
                letterSpacing: S.lsLabel, color: B.teal, marginBottom: 16,
              }}
            >
              Income patterns
            </div>
            <h2
              style={{
                fontSize: mobile ? 28 : 42,
                color: B.navy,
                lineHeight: S.lhHeading,
                letterSpacing: S.lsHeading,
                fontFamily: DISPLAY_FONT, fontWeight: 400,
              }}
            >
              Your income has structure. We read it.
            </h2>
          </div>
          <p
            style={{
              fontSize: 16, color: "rgba(14,26,43,0.50)", lineHeight: 1.6,
              maxWidth: 360,
              marginTop: mobile ? 20 : 0,
            }}
          >
            RunPayway&#8482; recognizes how your income actually behaves&#8202;&#8212;&#8202;not just what it totals. Tap a pattern to preview the report.
          </p>
        </div>

        {/* Pattern cards */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: mobile ? "1fr" : "1fr 1fr",
            gap: mobile ? 16 : 20,
          }}
        >
          {patterns.map((p, i) => {
            const isOpen = expanded === i;
            return (
              <div
                key={p.label}
                onClick={() => setExpanded(isOpen ? null : i)}
                style={{
                  background: "#FFFFFF",
                  borderRadius: 16,
                  border: isOpen ? "1px solid rgba(75,63,174,0.18)" : "1px solid rgba(14,26,43,0.05)",
                  padding: mobile ? "32px 28px" : "40px 36px",
                  cursor: "pointer",
                  opacity: visible ? 1 : 0,
                  transform: visible ? "translateY(0)" : "translateY(20px)",
                  transition: `opacity 600ms ease-out ${200 + i * 100}ms, transform 600ms ease-out ${200 + i * 100}ms, border-color 300ms ease, box-shadow 300ms ease`,
                  boxShadow: isOpen ? "0 8px 40px rgba(75,63,174,0.10)" : "none",
                }}
              >
                {/* Rhythm bars + label */}
                <div style={{ display: "flex", alignItems: "flex-end", gap: 3, height: 32, marginBottom: 24 }}>
                  {p.bars.map((h, j) => (
                    <div
                      key={j}
                      style={{
                        width: 4, borderRadius: 2,
                        backgroundColor: j % 2 === 0 ? B.teal : B.purple,
                        opacity: 0.25,
                        height: visible ? `${h}%` : "0%",
                        transition: `height 800ms cubic-bezier(0.22, 1, 0.36, 1) ${400 + i * 100 + j * 80}ms`,
                      }}
                    />
                  ))}
                </div>

                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 8 }}>
                  <div style={{ fontSize: 18, fontWeight: 600, color: B.navy, letterSpacing: "-0.01em" }}>
                    {p.label}
                  </div>
                  <div
                    style={{
                      fontSize: 11, color: "rgba(14,26,43,0.35)", fontWeight: 500,
                      transition: "transform 300ms ease",
                      transform: isOpen ? "rotate(180deg)" : "rotate(0deg)",
                    }}
                  >
                    &#9660;
                  </div>
                </div>
                <p style={{ fontSize: 15, color: "rgba(14,26,43,0.50)", lineHeight: 1.6, marginBottom: isOpen ? 28 : 0 }}>
                  {p.examples}
                </p>

                {/* Report preview — mirrors actual report Page 1 structure */}
                <div
                  style={{
                    maxHeight: isOpen ? 600 : 0,
                    opacity: isOpen ? 1 : 0,
                    overflow: "hidden",
                    transition: "max-height 500ms cubic-bezier(0.22, 1, 0.36, 1), opacity 400ms ease",
                  }}
                >
                  {/* Mini report surface */}
                  <div
                    style={{
                      background: "#F8FAFC",
                      borderRadius: 8,
                      border: "1px solid #E2E8F0",
                      padding: mobile ? 20 : 28,
                      position: "relative",
                      overflow: "hidden",
                    }}
                  >
                    {/* Top accent bar — matches real report */}
                    <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 3, background: "linear-gradient(90deg, #4B3FAE 0%, #1F6D7A 100%)" }} />

                    {/* Header */}
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16, paddingBottom: 10, borderBottom: "1px solid #E2E8F0" }}>
                      <span style={{ fontSize: 10, fontWeight: 500, letterSpacing: "0.14em", textTransform: "uppercase", color: "#94A3B8" }}>
                        Sample Report
                      </span>
                      <span style={{ fontSize: 10, color: "#94A3B8" }}>Income Stability Score&#8482;</span>
                    </div>

                    {/* Score + band */}
                    <div style={{ marginBottom: 20 }}>
                      <div style={{ fontSize: 48, fontWeight: 600, color: "#0F172A", lineHeight: 1 }}>{p.score}</div>
                      <div style={{ display: "inline-flex", alignItems: "center", gap: 6, marginTop: 6 }}>
                        <div style={{ width: 8, height: 8, borderRadius: 2, backgroundColor: p.bandColor }} />
                        <span style={{ fontSize: 14, fontWeight: 500, color: p.bandColor }}>{p.band}</span>
                      </div>
                    </div>

                    {/* Classification scale — matches report */}
                    <div style={{ marginBottom: 20 }}>
                      <div style={{ display: "flex", gap: 2, height: 6, marginBottom: 8 }}>
                        {[
                          { w: 30, color: "#DC2626", tier: "Limited" },
                          { w: 20, color: "#D97706", tier: "Developing" },
                          { w: 25, color: "#2563EB", tier: "Established" },
                          { w: 25, color: "#16A34A", tier: "High" },
                        ].map((seg, si) => (
                          <div key={si} style={{
                            width: `${seg.w}%`, backgroundColor: seg.color,
                            borderRadius: si === 0 ? "3px 0 0 3px" : si === 3 ? "0 3px 3px 0" : 0,
                            opacity: p.bandColor === seg.color ? 1 : 0.2,
                          }} />
                        ))}
                      </div>
                    </div>

                    {/* Metric cards — matches report MetricCard layout */}
                    <div style={{ display: "grid", gridTemplateColumns: mobile ? "1fr" : "1fr 1fr 1fr", gap: 8, marginBottom: 20 }}>
                      <div style={{ background: "#FFFFFF", border: "1px solid #E2E8F0", borderLeft: "3px solid #0F766E", borderRadius: 2, padding: "10px 12px" }}>
                        <div style={{ fontSize: 9, fontWeight: 500, letterSpacing: "0.14em", textTransform: "uppercase", color: "#94A3B8", marginBottom: 4 }}>Continuity</div>
                        <div style={{ fontSize: 16, fontWeight: 600, color: "#0F172A" }}>{p.continuity}</div>
                      </div>
                      <div style={{ background: "#FFFFFF", border: "1px solid #E2E8F0", borderLeft: "3px solid #DC2626", borderRadius: 2, padding: "10px 12px" }}>
                        <div style={{ fontSize: 9, fontWeight: 500, letterSpacing: "0.14em", textTransform: "uppercase", color: "#94A3B8", marginBottom: 4 }}>Stress Test</div>
                        <div style={{ fontSize: 16, fontWeight: 600, color: "#0F172A" }}>{p.score} <span style={{ color: "#94A3B8", fontWeight: 400 }}>&#8594;</span> {p.stressScore}</div>
                      </div>
                      <div style={{ background: "#FFFFFF", border: "1px solid #E2E8F0", borderLeft: "3px solid #4B3FAE", borderRadius: 2, padding: "10px 12px" }}>
                        <div style={{ fontSize: 9, fontWeight: 500, letterSpacing: "0.14em", textTransform: "uppercase", color: "#94A3B8", marginBottom: 4 }}>Constraint</div>
                        <div style={{ fontSize: 13, fontWeight: 600, color: "#0F172A" }}>{p.constraint}</div>
                      </div>
                    </div>

                    {/* Driver bars — matches report Page 2 */}
                    <div style={{ marginBottom: 16 }}>
                      <div style={{ fontSize: 9, fontWeight: 500, letterSpacing: "0.14em", textTransform: "uppercase", color: "#94A3B8", marginBottom: 10 }}>Score Drivers</div>
                      {p.drivers.map((d) => (
                        <div key={d.label} style={{ marginBottom: 10 }}>
                          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                            <span style={{ fontSize: 11, fontWeight: 500, color: "#0F172A" }}>{d.label}</span>
                            <span style={{ fontSize: 11, fontWeight: 600, color: d.color }}>{d.pct}%</span>
                          </div>
                          <div style={{ height: 4, backgroundColor: "#E2E8F0", borderRadius: 2 }}>
                            <div style={{
                              height: "100%", borderRadius: 2, backgroundColor: d.color,
                              width: isOpen ? `${d.pct}%` : "0%",
                              transition: "width 800ms cubic-bezier(0.22, 1, 0.36, 1) 200ms",
                            }} />
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* CTA */}
                    <Link
                      href="/pricing"
                      onClick={(e) => e.stopPropagation()}
                      style={{
                        display: "block", textAlign: "center",
                        fontSize: 13, fontWeight: 600, color: B.purple,
                        letterSpacing: "-0.01em",
                        padding: "10px 0",
                        borderTop: "1px solid #E2E8F0",
                      }}
                    >
                      Get your free score &#8594;
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}


/* ================================================================== */
/* SECTION 4: WHAT YOUR REPORT INCLUDES — "The Inventory"              */
/* ================================================================== */
function WhatYourReportSection() {
  const { ref, visible } = useInView();
  const mobile = useMobile();

  const pages = [
    { num: "01", title: "Your Score", value: "42/100", detail: "Your exact number, what it means for your daily life, and the single most important thing to fix.", color: B.purple },
    { num: "02", title: "How Your Income Is Built", value: "63% active", detail: "Income composition, stress test drop, continuity window, and peer comparison with actual industry numbers.", color: B.teal },
    { num: "03", title: "Your Biggest Risks", value: "3 scenarios", detail: "Ranked by severity with exact score drops. Plus predictive warnings about mistakes you are likely to make next.", color: "#9B2C2C" },
    { num: "04", title: "Your Income Deep Dive", value: "6 dimensions", detail: "Cross-factor effects, surprising insights, fragility classification, and your income system mapped visually.", color: B.navy },
    { num: "05", title: "Your Action Plan", value: "3 priorities", detail: "Specific actions with timeframes, targets, tradeoff analysis, and ready-to-use scripts you can send tomorrow.", color: B.teal },
  ];

  return (
    <section
      ref={ref}
      aria-label="What your report includes"
      style={{
        background: B.navy,
        paddingTop: mobile ? S.sectionY.mobile : S.sectionY.desktop,
        paddingBottom: mobile ? S.sectionY.mobile : S.sectionY.desktop,
        paddingLeft: mobile ? S.padX.mobile : S.padX.desktop,
        paddingRight: mobile ? S.padX.mobile : S.padX.desktop,
      }}
    >
      <div style={{ maxWidth: S.maxW, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: mobile ? 48 : 64 }}>
          <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: S.lsLabel, textTransform: "uppercase" as const, color: B.teal, marginBottom: 16, opacity: visible ? 1 : 0, transition: "opacity 400ms ease-out" }}>
            What You Get
          </div>
          <h2
            style={{
              fontSize: mobile ? 28 : 42,
              color: "#F4F1EA",
              lineHeight: S.lhHeading,
              letterSpacing: S.lsHeading,
              fontFamily: DISPLAY_FONT, fontWeight: 400,
              marginBottom: S.h2mb,
              opacity: visible ? 1 : 0,
              transform: visible ? "translateY(0)" : "translateY(16px)",
              transition: "opacity 600ms ease-out, transform 600ms ease-out",
            }}
          >
            Not a report you read once.<br />A system you use.
          </h2>
          <p
            style={{
              fontSize: mobile ? 15 : 16,
              color: "rgba(244,241,234,0.55)",
              lineHeight: S.lhBody,
              maxWidth: 520,
              margin: "0 auto",
              opacity: visible ? 1 : 0,
              transition: "opacity 600ms ease-out 100ms",
            }}
          >
            Five pages of analysis. An interactive simulator. Ready-to-send scripts. Every number is yours.
          </p>
        </div>

        {/* 5 cards — all visible at once */}
        <div style={{ display: "grid", gridTemplateColumns: mobile ? "1fr" : "repeat(5, 1fr)", gap: mobile ? 12 : 16 }}>
          {pages.map((page, i) => (
            <div
              key={page.num}
              style={{
                background: "rgba(255,255,255,0.04)",
                border: "1px solid rgba(255,255,255,0.08)",
                borderRadius: S.panelRadius,
                padding: mobile ? "20px 20px" : "28px 20px",
                position: "relative",
                overflow: "hidden",
                opacity: visible ? 1 : 0,
                transform: visible ? "translateY(0)" : "translateY(20px)",
                transition: `opacity 500ms ease-out ${150 + i * 80}ms, transform 500ms ease-out ${150 + i * 80}ms`,
              }}
            >
              {/* Top accent line */}
              <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 2, backgroundColor: page.color }} />

              <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.08em", color: "rgba(244,241,234,0.35)", marginBottom: 12 }}>{page.num}</div>
              <div style={{ fontSize: 15, fontWeight: 600, color: "#F4F1EA", marginBottom: 4, letterSpacing: "-0.01em" }}>{page.title}</div>
              <div style={{ fontSize: 20, fontWeight: 700, color: page.color === B.navy ? B.teal : page.color, marginBottom: 12, letterSpacing: "-0.02em" }}>{page.value}</div>
              <p style={{ fontSize: 13, color: "rgba(244,241,234,0.50)", lineHeight: 1.55, margin: 0 }}>{page.detail}</p>
            </div>
          ))}
        </div>

        {/* Simulator callout — the differentiator */}
        <div style={{
          marginTop: mobile ? 24 : 32,
          padding: mobile ? "24px 20px" : "28px 32px",
          background: "rgba(75,63,174,0.25)",
          border: "1px solid rgba(75,63,174,0.40)",
          borderRadius: S.panelRadius,
          display: "flex",
          alignItems: mobile ? "flex-start" : "center",
          flexDirection: mobile ? "column" : "row",
          gap: mobile ? 16 : 32,
          opacity: visible ? 1 : 0,
          transform: visible ? "translateY(0)" : "translateY(16px)",
          transition: "opacity 600ms ease-out 600ms, transform 600ms ease-out 600ms",
        }}>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 16, fontWeight: 600, color: "#F4F1EA", marginBottom: 8 }}>What if you added one more client?</div>
            <p style={{ fontSize: 14, color: "rgba(244,241,234,0.55)", lineHeight: 1.6, margin: 0 }}>
              What if you converted to retainers? What if you couldn&#8217;t work for 90 days? The full report includes a tool that answers these questions — with your actual numbers, in real time.
            </p>
          </div>
          <div style={{ display: "flex", gap: 12 }}>
            <Link
              href="/sample-report"
              style={{
                display: "inline-flex", alignItems: "center", justifyContent: "center",
                padding: "10px 24px", borderRadius: 8, fontSize: 14, fontWeight: 600,
                color: "#F4F1EA", border: "1px solid rgba(244,241,234,0.20)",
                textDecoration: "none", whiteSpace: "nowrap" as const,
                transition: "border-color 200ms ease",
              }}
            >
              View sample report
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}


/* ================================================================== */
/* SECTION 5: SAMPLE RESULT — "The Showcase"                           */
/* ================================================================== */
function SampleResultSection() {
  const { ref, visible } = useInView();
  const mobile = useMobile();
  const cardRef = useRef<HTMLDivElement>(null);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);

  const sampleScore = useAnimatedCounter(78, visible, 1500);
  const continuityVal = useAnimatedCounter(38, visible, 1500);
  const [demoScore, setDemoScore] = useState(78);
  const demoBand = demoScore >= 75 ? "High Stability" : demoScore >= 50 ? "Established Stability" : demoScore >= 30 ? "Developing Stability" : "Limited Stability";
  const demoBandColor = demoScore >= 75 ? "#16A34A" : demoScore >= 50 ? "#2563EB" : demoScore >= 30 ? "#D97706" : "#DC2626";

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!canHover() || mobile) return;
    const card = cardRef.current;
    if (!card) return;
    const rect = card.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const halfW = rect.width / 2;
    const halfH = rect.height / 2;
    const tiltX = ((e.clientX - centerX) / halfW) * 4;
    const tiltY = ((e.clientY - centerY) / halfH) * -4;
    setTilt({ x: tiltX, y: tiltY });
    setIsHovering(true);
  }, [mobile]);

  const handleMouseLeave = useCallback(() => {
    setTilt({ x: 0, y: 0 });
    setIsHovering(false);
  }, []);

  return (
    <section
      ref={ref}
      aria-label="Sample result"
      style={{
        background: `
          linear-gradient(180deg, #0E1A2B 0%, #141225 50%, #1A1540 100%)
        `,
        position: "relative",
        paddingTop: mobile ? S.sectionYlg.mobile : S.sectionYlg.desktop,
        paddingBottom: mobile ? S.sectionYlg.mobile : S.sectionYlg.desktop,
        paddingLeft: mobile ? S.padX.mobile : S.padX.desktop,
        paddingRight: mobile ? S.padX.mobile : S.padX.desktop,
      }}
    >
      {/* Centered radial glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: "radial-gradient(circle at 50% 50%, rgba(75,63,174,0.12) 0%, transparent 60%)",
        }}
      />

      <div className="relative mx-auto" style={{ maxWidth: S.maxW }}>
        <h2
          className="font-semibold text-center"
          style={{
            fontSize: mobile ? 28 : 42,
            color: "#F4F1EA",
            lineHeight: S.lhHeading,
            letterSpacing: S.lsHeading,
            fontFamily: DISPLAY_FONT, fontWeight: 400,
            marginBottom: mobile ? 40 : 56,
            opacity: visible ? 1 : 0,
            transform: visible ? "translateY(0)" : "translateY(16px)",
            transition: "opacity 600ms ease-out, transform 600ms ease-out",
          }}
        >
          This is what clarity looks like.
        </h2>

        <p
          className="text-center mx-auto"
          style={{
            fontSize: mobile ? 15 : 16,
            color: "rgba(244,241,234,0.60)",
            lineHeight: S.lhBody,
            maxWidth: S.subtextMaxW,
            marginBottom: mobile ? 40 : 56,
            opacity: visible ? 1 : 0,
            transform: visible ? "translateY(0)" : "translateY(10px)",
            transition: "opacity 600ms ease-out 100ms, transform 600ms ease-out 100ms",
          }}
        >
          A real score. A real diagnosis. A real path forward. This sample shows a consulting professional scoring 78 out of 100. Yours will be built from your answers.
        </p>

        {/* Premium showcase card */}
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            opacity: visible ? 1 : 0,
            transform: visible ? "translateY(0)" : "translateY(20px)",
            transition: "opacity 800ms ease-out 200ms, transform 800ms ease-out 200ms",
          }}
        >
          <div
            ref={cardRef}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            style={{
              maxWidth: S.subtextMaxW,
              width: "100%",
              background: "#FFFFFF",
              borderRadius: S.panelRadius,
              border: "1px solid rgba(14,26,43,0.08)",
              boxShadow: "0 24px 80px rgba(0,0,0,0.25), 0 8px 24px rgba(0,0,0,0.10), inset 0 1px 0 rgba(255,255,255,0.8)",
              overflow: "hidden",
              transform: isHovering
                ? `perspective(1200px) rotateY(${tilt.x}deg) rotateX(${tilt.y}deg)`
                : "perspective(1200px) rotateY(0deg) rotateX(0deg)",
              transition: isHovering ? "transform 50ms linear" : "transform 400ms ease-out",
            }}
          >
            {/* Top accent gradient */}
            <div style={{ height: 4, background: B.gradient }} />

            <div style={{ padding: mobile ? 24 : 36 }}>
              {/* Overline */}
              <div
                style={{
                  fontSize: 11, fontWeight: 600, textTransform: "uppercase",
                  letterSpacing: S.lsLabel, color: B.light, marginBottom: 16,
                }}
              >
                Income Stability Score&#8482;
              </div>

              {/* Score */}
              <div style={{ fontSize: 40, fontWeight: 600, color: B.navy, lineHeight: 1, marginBottom: 12 }}>
                {sampleScore}
              </div>

              {/* Band badge */}
              <div
                style={{
                  display: "inline-flex", alignItems: "center", gap: 6,
                  padding: "4px 12px", borderRadius: 100,
                  backgroundColor: "rgba(22,163,74,0.08)",
                  border: "1px solid rgba(22,163,74,0.15)",
                  marginBottom: 8,
                }}
              >
                <span style={{ width: 6, height: 6, borderRadius: 999, backgroundColor: "#16A34A" }} />
                <span style={{ fontSize: 13, fontWeight: 600, color: "#16A34A" }}>High Stability</span>
              </div>

              {/* Percentile */}
              <div style={{ fontSize: 12, color: B.light, marginBottom: 20 }}>
                72nd percentile within Professional Services
              </div>

              {/* Divider */}
              <div style={{ height: 1, background: "rgba(14,26,43,0.06)", marginBottom: 20 }} />

              {/* 4 metrics grid */}
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: mobile ? "1fr" : "repeat(4, 1fr)",
                  gap: 12,
                  marginBottom: 16,
                }}
              >
                <div>
                  <div style={{ fontSize: 11, textTransform: "uppercase", letterSpacing: S.lsLabel, color: B.teal, marginBottom: 6, fontWeight: 600 }}>
                    Continuity
                  </div>
                  <div style={{ fontSize: 20, fontWeight: 600, color: B.navy }}>
                    {continuityVal}%
                  </div>
                </div>
                <div>
                  <div style={{ fontSize: 11, textTransform: "uppercase", letterSpacing: S.lsLabel, color: B.teal, marginBottom: 6, fontWeight: 600 }}>
                    Stress Test
                  </div>
                  <div style={{ fontSize: 20, fontWeight: 600, color: B.navy }}>
                    78 &#8594; <span style={{ color: "#DC2626" }}>56</span>
                  </div>
                </div>
                <div>
                  <div style={{ fontSize: 11, textTransform: "uppercase", letterSpacing: S.lsLabel, color: B.teal, marginBottom: 6, fontWeight: 600 }}>
                    How Resilient
                  </div>
                  <div style={{ fontSize: 20, fontWeight: 600, color: B.navy }}>
                    Supported
                  </div>
                </div>
                <div>
                  <div style={{ fontSize: 11, textTransform: "uppercase", letterSpacing: S.lsLabel, color: B.teal, marginBottom: 6, fontWeight: 600 }}>
                    Confidence
                  </div>
                  <div style={{ fontSize: 20, fontWeight: 600, color: B.navy }}>
                    High
                  </div>
                </div>
              </div>

              {/* Divider */}
              <div style={{ height: 1, background: "rgba(14,26,43,0.06)", marginBottom: 16 }} />

              {/* Key insight — matches the report's key insight line */}
              <div style={{ backgroundColor: "#F8FAFC", borderLeft: `3px solid ${B.purple}`, borderRadius: 2, padding: "10px 14px", marginBottom: 16 }}>
                <p style={{ fontSize: 13, color: B.navy, margin: 0, fontWeight: 500, lineHeight: 1.5 }}>
                  The biggest structural weak point is limited forward visibility. Improving forward secured income could add 8 points.
                </p>
              </div>

              {/* Divider */}
              <div style={{ height: 1, background: "rgba(14,26,43,0.06)", marginBottom: 16 }} />

              {/* Constraint + Improvement in a row */}
              <div style={{ display: "flex", flexDirection: mobile ? "column" : "row", gap: mobile ? 12 : 16, marginBottom: 16 }}>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 11, textTransform: "uppercase" as const, letterSpacing: S.lsLabel, color: B.light, marginBottom: 4, fontWeight: 600 }}>Main Constraint</div>
                  <p style={{ fontSize: 13, color: B.muted, margin: 0, lineHeight: 1.5 }}>Forward visibility could be stronger</p>
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 11, textTransform: "uppercase", letterSpacing: S.lsLabel, color: B.teal, marginBottom: 4, fontWeight: 600 }}>Best Improvement</div>
                  <p style={{ fontSize: 13, color: B.muted, margin: 0, lineHeight: 1.5 }}>Extend committed income further ahead</p>
                </div>
              </div>

              {/* Divider */}
              <div style={{ height: 1, background: "rgba(14,26,43,0.06)", marginBottom: 12 }} />

              {/* Verification */}
              <div style={{ fontSize: 12, color: B.light, textAlign: "center" }}>
                Model RP-2.0 &#183; Verified &#183; runpayway.com/verify
              </div>
            </div>
          </div>
        </div>

        {/* Interactive demo */}
        <div style={{ maxWidth: 480, margin: "40px auto 0", textAlign: "center" }}>
          <p style={{ fontSize: 14, color: "rgba(244,241,234,0.50)", marginBottom: 16 }}>
            Drag to explore different scores
          </p>
          <input
            type="range"
            min={0}
            max={100}
            value={demoScore}
            onChange={(e) => setDemoScore(Number(e.target.value))}
            style={{
              width: "100%",
              height: 6,
              appearance: "none",
              background: `linear-gradient(90deg, #DC2626 0%, #DC2626 29%, #D97706 29%, #D97706 49%, #2563EB 49%, #2563EB 74%, #16A34A 74%, #16A34A 100%)`,
              borderRadius: 3,
              outline: "none",
              cursor: "pointer",
            }}
          />
          <div style={{ display: "flex", justifyContent: "space-between", marginTop: 16 }}>
            <div style={{ textAlign: "center" }}>
              <div style={{ fontSize: 32, fontWeight: 600, color: "#F4F1EA" }}>{demoScore}</div>
              <div style={{ fontSize: 13, color: demoBandColor, fontWeight: 600, marginTop: 4 }}>{demoBand}</div>
            </div>
          </div>
        </div>

        {/* Emotional CTA */}
        <div
          className="text-center"
          style={{
            marginTop: mobile ? 40 : 56,
            opacity: visible ? 1 : 0,
            transition: "opacity 600ms ease-out 500ms",
          }}
        >
          <p style={{ fontSize: 17, color: "rgba(244,241,234,0.70)", marginBottom: 20, fontFamily: DISPLAY_FONT, fontWeight: 400 }}>
            What would your number be?
          </p>
          <a
            href="/pricing"
            style={{
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              height: S.ctaH,
              paddingLeft: S.ctaPadX + 8,
              paddingRight: S.ctaPadX + 8,
              borderRadius: S.ctaRadius,
              background: "linear-gradient(135deg, #F4F1EA 0%, #EDECEA 100%)",
              color: B.navy,
              fontSize: 15,
              fontWeight: 600,
              textDecoration: "none",
              border: "1px solid rgba(244,241,234,0.92)",
              boxShadow: "inset 0 1px 0 rgba(255,255,255,0.5), 0 12px 32px rgba(0,0,0,0.25)",
              transition: "transform 180ms ease, box-shadow 180ms ease",
              letterSpacing: "-0.01em",
            }}
            onMouseEnter={(e) => {
              if (!canHover()) return;
              e.currentTarget.style.transform = "translateY(-2px)";
              e.currentTarget.style.boxShadow = "inset 0 1px 0 rgba(255,255,255,0.5), 0 16px 40px rgba(0,0,0,0.30)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.boxShadow = "inset 0 1px 0 rgba(255,255,255,0.5), 0 12px 32px rgba(0,0,0,0.25)";
            }}
          >
            Get My Free Score
          </a>
          <p style={{ fontSize: 13, color: "rgba(244,241,234,0.35)", marginTop: 12 }}>
            Free · Under 2 minutes · No bank connection
          </p>
        </div>
      </div>
    </section>
  );
}


/* ================================================================== */
/* SECTION 6: HOW IT WORKS — "The Mechanism"                           */
/* ================================================================== */
function HowItWorksSection() {
  const { ref, visible } = useInView();
  const mobile = useMobile();

  const steps = [
    {
      num: "01",
      time: "2 min",
      title: "Take the assessment",
      hook: "No bank connection. No credit pull. No login.",
      desc: "A short structural diagnostic about how your income works — recurrence, concentration, visibility, and labor dependence. Under two minutes.",
      color: B.teal,
    },
    {
      num: "02",
      time: "Instant",
      title: "See your score",
      hook: "Free. Right now. No strings.",
      desc: "Your Income Stability Score out of 100, your stability band, your peer percentile, and the single biggest thing holding your income back.",
      color: B.purple,
    },
    {
      num: "03",
      time: "$99",
      title: "Unlock the decision engine",
      hook: "If it doesn\u2019t reveal something new, full refund.",
      desc: "An interactive simulator you play with. Scripts you send tomorrow. Risk scenarios with exact score drops. Actions with specific targets and timelines. This is not a static document — it is a system.",
      color: B.navy,
    },
  ];

  return (
    <section
      ref={ref}
      aria-label="How it works"
      style={{
        background: B.sand,
        paddingTop: mobile ? S.sectionY.mobile : S.sectionY.desktop,
        paddingBottom: mobile ? S.sectionY.mobile : S.sectionY.desktop,
        paddingLeft: mobile ? S.padX.mobile : S.padX.desktop,
        paddingRight: mobile ? S.padX.mobile : S.padX.desktop,
      }}
    >
      <div style={{ maxWidth: S.maxW, margin: "0 auto" }}>
        {/* Header */}
        <div style={{ maxWidth: 600, marginBottom: mobile ? 48 : 64 }}>
          <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: S.lsLabel, textTransform: "uppercase" as const, color: B.teal, marginBottom: 16, opacity: visible ? 1 : 0, transition: "opacity 400ms ease-out" }}>
            How It Works
          </div>
          <h2 style={{
            fontSize: mobile ? 28 : 42, color: B.navy, lineHeight: S.lhHeading,
            letterSpacing: S.lsHeading, fontFamily: DISPLAY_FONT, fontWeight: 400,
            marginBottom: 16,
            opacity: visible ? 1 : 0, transform: visible ? "translateY(0)" : "translateY(16px)",
            transition: "opacity 600ms ease-out, transform 600ms ease-out",
          }}>
            Three steps. Under two minutes.<br />No financial data required.
          </h2>
          <p style={{
            fontSize: mobile ? 15 : 16, color: B.muted, lineHeight: S.lhBody, maxWidth: 480,
            opacity: visible ? 1 : 0, transition: "opacity 600ms ease-out 100ms",
          }}>
            We measure how your income is built — not how much you make. The structure of your revenue determines how stable it actually is.
          </p>
        </div>

        {/* Steps — left-aligned, horizontal with connecting line */}
        <div style={{ display: "flex", flexDirection: mobile ? "column" : "row", gap: 0 }}>
          {steps.map((step, i) => (
            <div
              key={step.num}
              style={{
                flex: 1,
                position: "relative",
                paddingLeft: mobile ? 0 : i === 0 ? 0 : 32,
                paddingRight: mobile ? 0 : i === 2 ? 0 : 32,
                paddingTop: mobile ? (i === 0 ? 0 : 32) : 0,
                paddingBottom: mobile ? (i === 2 ? 0 : 32) : 0,
                borderLeft: !mobile && i > 0 ? "1px solid rgba(14,26,43,0.08)" : "none",
                borderTop: mobile && i > 0 ? "1px solid rgba(14,26,43,0.08)" : "none",
                opacity: visible ? 1 : 0,
                transform: visible ? "translateY(0)" : "translateY(20px)",
                transition: `opacity 500ms ease-out ${150 + i * 120}ms, transform 500ms ease-out ${150 + i * 120}ms`,
              }}
            >
              {/* Top row: number + time */}
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
                <div style={{
                  fontSize: 11, fontWeight: 700, letterSpacing: "0.08em", color: step.color,
                  padding: "4px 10px", borderRadius: 4,
                  backgroundColor: step.color === B.navy ? "rgba(14,26,43,0.06)" : step.color === B.purple ? "rgba(75,63,174,0.08)" : "rgba(31,109,122,0.08)",
                }}>
                  STEP {step.num}
                </div>
                <span style={{ fontSize: 12, fontWeight: 600, color: B.light }}>{step.time}</span>
              </div>

              {/* Title */}
              <h3 style={{ fontSize: mobile ? 20 : 22, fontWeight: 600, color: B.navy, marginBottom: 8, letterSpacing: "-0.02em" }}>
                {step.title}
              </h3>

              {/* Hook — the line that sells */}
              <p style={{ fontSize: 14, fontWeight: 600, color: step.color, marginBottom: 12, lineHeight: 1.4 }}>
                {step.hook}
              </p>

              {/* Description */}
              <p style={{ fontSize: 14, color: B.muted, lineHeight: 1.65, margin: 0 }}>
                {step.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}


/* ================================================================== */
/* SECTION 7: WHAT IT MEASURES — "The Framework"                       */
/* ================================================================== */
function WhatItMeasuresSection() {
  const { ref, visible } = useInView();
  const mobile = useMobile();

  const dimensions = [
    { num: "01", title: "Recurring or Continuing Income", desc: "How much income continues from existing sources without needing new acquisition.", color: B.teal },
    { num: "02", title: "Income Concentration", desc: "How much depends on your single largest source.", color: B.purple },
    { num: "03", title: "Source Diversity", desc: "How many meaningful income sources support the structure.", color: B.teal },
    { num: "04", title: "Forward Visibility", desc: "How far ahead income is already committed or scheduled.", color: B.purple },
    { num: "05", title: "Income Variability", desc: "How sharply income moves between strong and weak months.", color: B.teal },
    { num: "06", title: "Continuity Without Active Work", desc: "How much income would continue if active work stopped for 90 days.", color: B.purple },
  ];

  return (
    <section
      ref={ref}
      aria-label="What it measures"
      style={{
        background: "#FFFFFF",
        paddingTop: mobile ? S.sectionY.mobile : S.sectionY.desktop,
        paddingBottom: mobile ? S.sectionY.mobile : S.sectionY.desktop,
        paddingLeft: mobile ? S.padX.mobile : S.padX.desktop,
        paddingRight: mobile ? S.padX.mobile : S.padX.desktop,
      }}
    >
      <div className="mx-auto" style={{ maxWidth: S.maxW }}>
        <h2
          className="font-semibold text-center"
          style={{
            fontSize: mobile ? 28 : 42,
            color: B.navy,
            lineHeight: S.lhHeading,
            letterSpacing: S.lsHeading,
            fontFamily: DISPLAY_FONT, fontWeight: 400,
            marginBottom: S.h2mb,
            opacity: visible ? 1 : 0,
            transform: visible ? "translateY(0)" : "translateY(16px)",
            transition: "opacity 600ms ease-out, transform 600ms ease-out",
          }}
        >
          What the model measures
        </h2>

        <p
          className="text-center mx-auto"
          style={{
            fontSize: mobile ? 15 : 16,
            color: B.muted,
            lineHeight: S.lhBody,
            maxWidth: 640,
            marginBottom: mobile ? 40 : 56,
            opacity: visible ? 1 : 0,
            transform: visible ? "translateY(0)" : "translateY(12px)",
            transition: "opacity 600ms ease-out 100ms, transform 600ms ease-out 100ms",
          }}
        >
          Your score is built from six structural dimensions. Together, they reveal how stable your income is and how well it holds up under pressure.
        </p>

        {/* 2x3 grid */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: mobile ? "1fr" : "1fr 1fr",
            gap: S.gridGap,
            opacity: visible ? 1 : 0,
            transform: visible ? "translateY(0)" : "translateY(16px)",
            transition: "opacity 600ms ease-out 200ms, transform 600ms ease-out 200ms",
          }}
        >
          {dimensions.map((dim) => (
            <div
              key={dim.num}
              style={{
                background: "#FFFFFF",
                border: "1px solid rgba(14,26,43,0.06)",
                borderRadius: S.panelRadius,
                padding: 28,
                position: "relative",
                borderLeft: `3px solid ${dim.color}`,
                transition: "box-shadow 250ms ease",
              }}
              onMouseEnter={(e) => {
                if (!canHover()) return;
                e.currentTarget.style.boxShadow = "0 4px 16px rgba(14,26,43,0.06)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.boxShadow = "none";
              }}
            >
              {/* Number top-right */}
              <span
                style={{
                  position: "absolute",
                  top: 16, right: 20,
                  fontSize: 28, fontWeight: 600,
                  color: "rgba(14,26,43,0.08)",
                  lineHeight: 1,
                }}
              >
                {dim.num}
              </span>

              <div style={{ fontSize: 16, fontWeight: 600, color: B.navy, marginBottom: 6, paddingRight: 40 }}>
                {dim.title}
              </div>
              <p style={{ fontSize: 14, color: B.muted, lineHeight: S.lhBody, margin: 0 }}>
                {dim.desc}
              </p>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div
          style={{
            textAlign: "center",
            marginTop: 40,
            fontSize: 12,
            fontWeight: 500,
            textTransform: "uppercase",
            letterSpacing: S.lsLabel,
            color: B.light,
            opacity: visible ? 1 : 0,
            transition: "opacity 600ms ease-out 400ms",
          }}
        >
          Official Scoring Framework &#183; Model RP-2.0
        </div>
      </div>
    </section>
  );
}


/* ================================================================== */
/* TESTIMONIALS — Social proof before the ask                           */
/* ================================================================== */
function TestimonialsSection() {
  const { ref, visible } = useInView();
  const mobile = useMobile();

  // PLACEHOLDER — Replace with real testimonials + headshot paths before launch
  // To use real photos: add images to /public/testimonials/ and update the `photo` field
  const testimonials = [
    { quote: "I had no idea 92% of my income depended on one client. The stress test was a wake-up call.", name: "Sarah M.", role: "Real Estate Agent", score: 28, photo: "https://i.pravatar.cc/88?img=32" },
    { quote: "The cross-factor breakdown showed me exactly why my score was being penalized. No other tool does that.", name: "James R.", role: "Software Contractor", score: 44, photo: "https://i.pravatar.cc/88?img=12" },
    { quote: "I shared the advisor guide with my accountant. She said it was more useful than most reports she sees.", name: "Priya K.", role: "Management Consultant", score: 61, photo: "https://i.pravatar.cc/88?img=25" },
  ];

  return (
    <section
      ref={ref}
      aria-label="Customer testimonials"
      style={{
        background: B.navy,
        paddingTop: mobile ? S.sectionY.mobile : S.sectionY.desktop,
        paddingBottom: mobile ? S.sectionY.mobile : S.sectionY.desktop,
        paddingLeft: mobile ? S.padX.mobile : S.padX.desktop,
        paddingRight: mobile ? S.padX.mobile : S.padX.desktop,
      }}
    >
      <div className="mx-auto" style={{ maxWidth: S.maxW }}>
        <div
          style={{
            textAlign: "center",
            marginBottom: mobile ? 40 : 56,
            opacity: visible ? 1 : 0,
            transform: visible ? "translateY(0)" : "translateY(16px)",
            transition: "opacity 600ms ease-out, transform 600ms ease-out",
          }}
        >
          <div
            style={{
              fontSize: 11, fontWeight: 600, textTransform: "uppercase",
              letterSpacing: S.lsLabel, color: B.teal, marginBottom: S.labelMb,
            }}
          >
            What customers say
          </div>
          <h2
            style={{
              fontSize: mobile ? 28 : 42,
              color: "#F4F1EA",
              lineHeight: S.lhHeading,
              letterSpacing: S.lsHeading,
              fontFamily: DISPLAY_FONT, fontWeight: 400,
              marginBottom: S.h2mb,
            }}
          >
            Real people. Real scores. Real insight.
          </h2>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: mobile ? "1fr" : "repeat(3, 1fr)",
            gap: S.gridGap,
          }}
        >
          {testimonials.map((t, i) => (
            <div
              key={t.name}
              style={{
                backgroundColor: "rgba(255,255,255,0.04)",
                border: "1px solid rgba(255,255,255,0.08)",
                borderRadius: S.cardRadius,
                padding: mobile ? S.cardPad.mobile : S.cardPad.desktop,
                display: "flex",
                flexDirection: "column",
                opacity: visible ? 1 : 0,
                transform: visible ? "translateY(0)" : "translateY(20px)",
                transition: `opacity 600ms ease-out ${200 + i * 120}ms, transform 600ms ease-out ${200 + i * 120}ms`,
              }}
            >
              {/* Quote */}
              <p style={{ fontSize: 15, color: "rgba(244,241,234,0.80)", lineHeight: 1.65, margin: "0 0 24px", flex: 1, fontStyle: "italic" }}>
                &ldquo;{t.quote}&rdquo;
              </p>

              {/* Attribution with headshot */}
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <img
                  src={t.photo}
                  alt={t.name}
                  width={44}
                  height={44}
                  style={{ width: 44, height: 44, borderRadius: "50%", objectFit: "cover", flexShrink: 0, border: "2px solid rgba(255,255,255,0.10)" }}
                />
                <div>
                  <div style={{ fontSize: 14, fontWeight: 600, color: "#F4F1EA" }}>{t.name}</div>
                  <div style={{ fontSize: 12, color: "rgba(244,241,234,0.45)" }}>{t.role} &middot; Score: {t.score}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}


/* ================================================================== */
/* SECTION 8: PRICING — "The Decision"                                 */
/* ================================================================== */
function PricingSection() {
  const { ref, visible } = useInView();
  const mobile = useMobile();

  return (
    <section
      ref={ref}
      aria-label="Pricing"
      style={{
        background: "linear-gradient(180deg, #0E1A2B 0%, #1A1540 40%, #4B3FAE 100%)",
        position: "relative",
        overflow: "hidden",
        paddingTop: mobile ? S.sectionYlg.mobile : S.sectionYlg.desktop,
        paddingBottom: mobile ? S.sectionYlg.mobile : S.sectionYlg.desktop,
        paddingLeft: mobile ? S.padX.mobile : S.padX.desktop,
        paddingRight: mobile ? S.padX.mobile : S.padX.desktop,
      }}
    >
      {/* Ambient glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: "radial-gradient(circle at 50% 50%, rgba(75,63,174,0.14) 0%, transparent 60%)",
        }}
      />

      {/* Concentric halo circles */}
      {[320, 480, 640].map((size, i) => (
        <div
          key={size}
          className="absolute pointer-events-none"
          style={{
            width: size, height: size, borderRadius: "50%",
            top: "50%", left: "50%",
            transform: "translate(-50%, -50%)",
            border: `1px solid rgba(255,255,255,${0.04 + i * 0.02})`,
          }}
        />
      ))}

      <div className="relative mx-auto" style={{ maxWidth: S.maxW }}>
        <h2
          className="font-semibold text-center"
          style={{
            fontSize: mobile ? 28 : 42,
            color: "#F4F1EA",
            lineHeight: S.lhHeading,
            letterSpacing: S.lsHeading,
            fontFamily: DISPLAY_FONT, fontWeight: 400,
            marginBottom: S.h2mb,
            opacity: visible ? 1 : 0,
            transform: visible ? "translateY(0)" : "translateY(16px)",
            transition: "opacity 600ms ease-out, transform 600ms ease-out",
          }}
        >
          Find out before it costs you
        </h2>

        <p
          className="text-center mx-auto"
          style={{
            fontSize: mobile ? 15 : 16,
            color: "rgba(244,241,234,0.80)",
            lineHeight: S.lhBody,
            maxWidth: S.subtextMaxW,
            marginBottom: mobile ? 40 : 56,
            opacity: visible ? 1 : 0,
            transform: visible ? "translateY(0)" : "translateY(12px)",
            transition: "opacity 600ms ease-out 100ms, transform 600ms ease-out 100ms",
          }}
        >
          Your free score shows where you stand. The full report shows what to do about it.
        </p>

        {/* Proof line */}
        <div
          className="text-center"
          style={{
            marginBottom: mobile ? 32 : 40,
            opacity: visible ? 1 : 0,
            transition: "opacity 600ms ease-out 200ms",
          }}
        >
          <div style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 8,
            padding: "8px 20px",
            borderRadius: 100,
            backgroundColor: "rgba(255,255,255,0.06)",
            border: "1px solid rgba(255,255,255,0.08)",
          }}>
            <div style={{ width: 6, height: 6, borderRadius: "50%", backgroundColor: B.teal }} />
            <span style={{ fontSize: 13, fontWeight: 500, color: "rgba(244,241,234,0.60)", letterSpacing: "0.01em" }}>
              Professionals across 19 industries
            </span>
          </div>
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
            transition: "opacity 600ms ease-out 200ms, transform 600ms ease-out 200ms",
          }}
        >
          {/* CARD 1 — Free Score */}
          <div
            style={{
              background: "#FFFFFF",
              borderRadius: S.panelRadius,
              padding: mobile ? S.cardPad.mobile : S.cardPad.desktop,
              border: "1px solid rgba(255,255,255,0.15)",
              boxShadow: "0 16px 48px rgba(0,0,0,0.20), 0 4px 12px rgba(0,0,0,0.10), inset 0 1px 0 rgba(255,255,255,0.8)",
              transition: "transform 300ms ease, box-shadow 300ms ease",
            }}
            onMouseEnter={(e) => { if (!canHover()) return; e.currentTarget.style.transform = "translateY(-4px)"; e.currentTarget.style.boxShadow = "0 24px 64px rgba(0,0,0,0.25), 0 8px 20px rgba(0,0,0,0.12), inset 0 1px 0 rgba(255,255,255,0.8)"; }}
            onMouseLeave={(e) => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "0 16px 48px rgba(0,0,0,0.20), 0 4px 12px rgba(0,0,0,0.10), inset 0 1px 0 rgba(255,255,255,0.8)"; }}
          >
            <div
              style={{
                fontSize: 11, fontWeight: 600, textTransform: "uppercase",
                letterSpacing: S.lsLabel, color: B.teal, marginBottom: 16,
              }}
            >
              Free Score
            </div>
            <div style={{ fontSize: 40, fontWeight: 600, color: B.navy, lineHeight: 1, marginBottom: 12 }}>
              $0
            </div>
            <p style={{ fontSize: 14, color: B.muted, lineHeight: S.lhBody, marginBottom: 24 }}>
              Score &#183; Band &#183; Percentile &#183; One key insight
            </p>
            <Link
              href="/pricing"
              className="inline-flex items-center justify-center font-semibold"
              style={{
                width: "100%",
                height: S.ctaH,
                borderRadius: S.ctaRadius,
                backgroundColor: "#FFFFFF",
                color: B.navy,
                fontSize: 15,
                textDecoration: "none",
                border: `1px solid ${B.navy}`,
                transition: "background-color 180ms ease, color 180ms ease, transform 180ms ease",
                boxShadow: "0 4px 12px rgba(14,26,43,0.10)",
              }}
              onMouseEnter={(e) => {
                if (!canHover()) return;
                e.currentTarget.style.backgroundColor = B.navy;
                e.currentTarget.style.color = "#FFFFFF";
                e.currentTarget.style.transform = "translateY(-1px)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = "#FFFFFF";
                e.currentTarget.style.color = B.navy;
                e.currentTarget.style.transform = "translateY(0)";
              }}
            >
              Get My Free Score
            </Link>
          </div>

          {/* CARD 2 — Full Report $99 */}
          <div
            style={{
              background: "#FFFFFF",
              borderRadius: S.panelRadius,
              padding: mobile ? S.cardPad.mobile : S.cardPad.desktop,
              border: "1px solid rgba(75,63,174,0.20)",
              boxShadow: "0 20px 56px rgba(75,63,174,0.18), 0 8px 24px rgba(0,0,0,0.12), inset 0 1px 0 rgba(255,255,255,0.8), inset 0 0 0 1px rgba(75,63,174,0.06)",
              position: "relative",
              transition: "transform 300ms ease, box-shadow 300ms ease",
            }}
            onMouseEnter={(e) => { if (!canHover()) return; e.currentTarget.style.transform = "translateY(-4px)"; e.currentTarget.style.boxShadow = "0 28px 72px rgba(75,63,174,0.22), 0 12px 32px rgba(0,0,0,0.15), inset 0 1px 0 rgba(255,255,255,0.8), inset 0 0 0 1px rgba(75,63,174,0.08)"; }}
            onMouseLeave={(e) => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "0 20px 56px rgba(75,63,174,0.18), 0 8px 24px rgba(0,0,0,0.12), inset 0 1px 0 rgba(255,255,255,0.8), inset 0 0 0 1px rgba(75,63,174,0.06)"; }}
          >
            {/* FULL REPORT badge */}
            <div
              style={{
                display: "inline-block",
                fontSize: 9, fontWeight: 600, textTransform: "uppercase",
                letterSpacing: "0.08em",
                backgroundColor: B.purple,
                color: "#FFFFFF",
                padding: "3px 10px",
                borderRadius: 100,
                marginBottom: 12,
              }}
            >
              Full Report
            </div>

            <div
              style={{
                fontSize: 11, fontWeight: 600, textTransform: "uppercase",
                letterSpacing: S.lsLabel, color: B.teal, marginBottom: 16,
              }}
            >
              Complete Assessment
            </div>
            <div style={{ fontSize: 40, fontWeight: 600, color: B.navy, lineHeight: 1, marginBottom: 12 }}>
              $99
            </div>
            <p style={{ fontSize: 14, color: B.muted, lineHeight: S.lhBody, marginBottom: 24 }}>
              Full report &#183; Score simulator &#183; Scripts &#183; Action plan
            </p>
            <a
              href="https://buy.stripe.com/7sY8wHeNid726Bs8YV2Nq04"
              className="inline-flex items-center justify-center font-semibold"
              style={{
                width: "100%",
                height: S.ctaH,
                borderRadius: S.ctaRadius,
                background: B.gradient,
                color: "#FFFFFF",
                fontSize: 15,
                textDecoration: "none",
                transition: "transform 180ms ease, box-shadow 180ms ease",
                boxShadow: "0 8px 24px rgba(75,63,174,0.30)",
              }}
              onMouseEnter={(e) => {
                if (!canHover()) return;
                e.currentTarget.style.transform = "translateY(-1px)";
                e.currentTarget.style.boxShadow = "0 12px 32px rgba(75,63,174,0.40)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = "0 8px 24px rgba(75,63,174,0.30)";
              }}
            >
              Get Full Report — $99
            </a>
            <p style={{ fontSize: 11, color: "rgba(244,241,234,0.35)", textAlign: "center", marginTop: 10, marginBottom: 0 }}>
              Full refund if it doesn&#8217;t reveal something new.
            </p>
          </div>
        </div>

        {/* Guarantee + trust */}
        <div
          style={{
            textAlign: "center",
            marginTop: 40,
            opacity: visible ? 1 : 0,
            transition: "opacity 600ms ease-out 400ms",
          }}
        >
          <div style={{ display: "inline-block", padding: "16px 32px", borderRadius: S.panelRadius, border: "1px solid rgba(244,241,234,0.12)", marginBottom: 20 }}>
            <p style={{ fontSize: 15, color: "rgba(244,241,234,0.75)", margin: 0, fontWeight: 500 }}>
              If the report doesn&#8217;t reveal at least one insight you didn&#8217;t already know, full refund. No questions.
            </p>
          </div>
          <p style={{ fontSize: 13, color: "rgba(244,241,234,0.40)" }}>
            No bank connection &#183; No credit pull &#183; Private by default &#183; Under 2 minutes
          </p>
        </div>
      </div>
    </section>
  );
}


/* ================================================================== */
/* SECTION 9: TRUST / GOVERNANCE — "The Assurance"                     */
/* ================================================================== */
function TrustSection({ trustOpen, setTrustOpen }: { trustOpen: number | null; setTrustOpen: (v: number | null) => void }) {
  const { ref, visible } = useInView();
  const mobile = useMobile();

  const panels = [
    {
      title: "Consistency",
      color: B.teal,
      items: [
        "Fixed scoring framework under Model RP-2.0",
        "The same answers produce the same result",
        "Fixed deterministic rules — same inputs, same score",
        "Framework changes create a new model version",
      ],
    },
    {
      title: "Transparency",
      color: B.purple,
      items: [
        "Defined measurement categories",
        "Published stability bands",
        "Sample report available for review",
        "Clear report sections and outputs",
      ],
    },
    {
      title: "Verification",
      color: B.navy,
      items: [
        "Unique record ID on each report",
        "Verification support included",
        "Model version shown on every assessment",
        "Report authenticity can be checked online",
      ],
    },
  ];

  return (
    <section
      ref={ref}
      aria-label="Model governance"
      style={{
        background: B.sand,
        paddingTop: mobile ? S.sectionY.mobile : S.sectionY.desktop,
        paddingBottom: mobile ? S.sectionY.mobile : S.sectionY.desktop,
        paddingLeft: mobile ? S.padX.mobile : S.padX.desktop,
        paddingRight: mobile ? S.padX.mobile : S.padX.desktop,
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Subtle texture */}
      <div style={{
        position: "absolute",
        inset: 0,
        opacity: 0.03,
        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
        backgroundSize: "128px 128px",
        pointerEvents: "none",
      }} />
      <div className="mx-auto" style={{ maxWidth: 720 }}>
        <h2
          className="font-semibold text-center"
          style={{
            fontSize: mobile ? 28 : 42,
            color: B.navy,
            lineHeight: S.lhHeading,
            letterSpacing: S.lsHeading,
            fontFamily: DISPLAY_FONT, fontWeight: 400,
            marginBottom: mobile ? 40 : 56,
            opacity: visible ? 1 : 0,
            transform: visible ? "translateY(0)" : "translateY(16px)",
            transition: "opacity 600ms ease-out, transform 600ms ease-out",
          }}
        >
          Model governance
        </h2>

        {/* Accordion panels */}
        <div
          style={{
            opacity: visible ? 1 : 0,
            transform: visible ? "translateY(0)" : "translateY(16px)",
            transition: "opacity 600ms ease-out 150ms, transform 600ms ease-out 150ms",
          }}
        >
          {panels.map((panel, i) => {
            const isOpen = trustOpen === i;
            return (
              <div
                key={panel.title}
                style={{
                  background: "#FFFFFF",
                  borderRadius: S.panelRadius,
                  border: "1px solid rgba(14,26,43,0.06)",
                  marginBottom: 12,
                  overflow: "hidden",
                }}
              >
                <button
                  onClick={() => setTrustOpen(isOpen ? null : i)}
                  style={{
                    width: "100%",
                    padding: "24px 28px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    textAlign: "left",
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                    <span
                      style={{
                        width: 10, height: 10, borderRadius: 999,
                        backgroundColor: panel.color, flexShrink: 0,
                      }}
                    />
                    <span style={{ fontSize: 17, fontWeight: 600, color: B.navy }}>
                      {panel.title}
                    </span>
                  </div>
                  {/* Plus/minus indicator */}
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" style={{ flexShrink: 0 }}>
                    <path d="M3 8h10" stroke={B.navy} strokeWidth="1.5" strokeLinecap="round" />
                    {!isOpen && <path d="M8 3v10" stroke={B.navy} strokeWidth="1.5" strokeLinecap="round" />}
                  </svg>
                </button>

                <div
                  style={{
                    maxHeight: isOpen ? 300 : 0,
                    overflow: "hidden",
                    transition: "max-height 300ms ease",
                  }}
                >
                  <div style={{ padding: "0 28px 24px 28px" }}>
                    {panel.items.map((item) => (
                      <p
                        key={item}
                        style={{
                          fontSize: 15, color: B.muted, margin: 0,
                          marginBottom: 8, lineHeight: S.lhDense,
                          paddingLeft: 22,
                        }}
                      >
                        &#8211; {item}
                      </p>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}


/* ================================================================== */
/* SECTION 10: CLASSIFICATION — "The Spectrum"                         */
/* ================================================================== */
function ClassificationSection() {
  const { ref, visible } = useInView();
  const mobile = useMobile();
  const [barVisible, setBarVisible] = useState(false);

  useEffect(() => {
    if (visible) {
      const timer = setTimeout(() => setBarVisible(true), 100);
      return () => clearTimeout(timer);
    }
  }, [visible]);

  const bands = [
    { range: "0\u201329", label: "Limited Stability", color: "#DC2626", width: "29%", desc: "Income structure is fragile and depends heavily on active work.", delay: 0 },
    { range: "30\u201349", label: "Developing Stability", color: "#D97706", width: "20%", desc: "Some support exists, but the structure is still exposed.", delay: 200 },
    { range: "50\u201374", label: "Established Stability", color: "#2563EB", width: "25%", desc: "Income reflects meaningful stability and stronger protection.", delay: 400 },
    { range: "75\u2013100", label: "High Stability", color: "#16A34A", width: "26%", desc: "Income structure is durable and less dependent on constant effort.", delay: 600 },
  ];

  return (
    <section
      ref={ref}
      aria-label="Classification scale"
      style={{
        background: "#FFFFFF",
        paddingTop: mobile ? S.sectionY.mobile : S.sectionY.desktop,
        paddingBottom: mobile ? S.sectionY.mobile : S.sectionY.desktop,
        paddingLeft: mobile ? S.padX.mobile : S.padX.desktop,
        paddingRight: mobile ? S.padX.mobile : S.padX.desktop,
      }}
    >
      <div className="mx-auto" style={{ maxWidth: S.maxW }}>
        <h2
          className="font-semibold text-center"
          style={{
            fontSize: mobile ? 28 : 42,
            color: B.navy,
            lineHeight: S.lhHeading,
            letterSpacing: S.lsHeading,
            fontFamily: DISPLAY_FONT, fontWeight: 400,
            marginBottom: S.h2mb,
            opacity: visible ? 1 : 0,
            transform: visible ? "translateY(0)" : "translateY(16px)",
            transition: "opacity 600ms ease-out, transform 600ms ease-out",
          }}
        >
          Income Stability Classification Scale
        </h2>

        <p
          className="text-center"
          style={{
            fontSize: mobile ? 15 : 16,
            color: B.muted,
            lineHeight: S.lhBody,
            marginBottom: mobile ? 40 : 56,
            opacity: visible ? 1 : 0,
            transform: visible ? "translateY(0)" : "translateY(12px)",
            transition: "opacity 600ms ease-out 100ms, transform 600ms ease-out 100ms",
          }}
        >
          Every score maps to a fixed stability band under Model RP-2.0.
        </p>

        {/* Animated color bar */}
        <div
          style={{
            display: "flex",
            height: 12,
            borderRadius: 6,
            overflow: "hidden",
            marginBottom: mobile ? 32 : 40,
            opacity: visible ? 1 : 0,
            transition: "opacity 600ms ease-out 200ms",
          }}
        >
          {bands.map((band) => (
            <div
              key={band.range}
              style={{
                backgroundColor: band.color,
                width: barVisible ? band.width : "0%",
                transition: `width 800ms cubic-bezier(0.22, 1, 0.36, 1) ${band.delay}ms`,
              }}
            />
          ))}
        </div>

        {/* Band descriptions */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: mobile ? "1fr" : "repeat(4, 1fr)",
            gap: mobile ? 12 : S.gridGap,
            opacity: visible ? 1 : 0,
            transform: visible ? "translateY(0)" : "translateY(12px)",
            transition: "opacity 600ms ease-out 300ms, transform 600ms ease-out 300ms",
          }}
        >
          {bands.map((band) => (
            <div key={band.range}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
                <span style={{ width: 10, height: 10, borderRadius: 999, backgroundColor: band.color, flexShrink: 0 }} />
                <span style={{ fontSize: 14, fontWeight: 600, color: B.navy }}>{band.range}</span>
              </div>
              <div style={{ fontSize: 14, color: B.navy, marginBottom: 4 }}>{band.label}</div>
              <p style={{ fontSize: 13, color: B.muted, lineHeight: S.lhDense, margin: 0 }}>
                {band.desc}
              </p>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div
          style={{
            textAlign: "center",
            marginTop: 40,
            fontSize: 13,
            color: B.light,
            fontStyle: "italic",
            opacity: visible ? 1 : 0,
            transition: "opacity 600ms ease-out 500ms",
          }}
        >
          Band thresholds are fixed under Model RP-2.0.
        </div>
      </div>
    </section>
  );
}


/* ================================================================== */
/* SECTION 11: FAQ — "The Resolution"                                  */
/* ================================================================== */
function FaqSection({ openFaq, setOpenFaq }: { openFaq: number | null; setOpenFaq: (v: number | null) => void }) {
  const { ref, visible } = useInView();
  const mobile = useMobile();

  const faqs = [
    {
      q: "What do I get for free?",
      a: "Your score out of 100, your stability band, your peer percentile, and one key insight about what is holding your income back. No payment required.",
    },
    {
      q: "What does the $99 full report include?",
      a: "An interactive score simulator, income runway calculator, risk scenarios with exact score drops, an action plan with specific timeframes and targets, ready-to-use scripts (retainer pitch, client outreach, pricing restructure), tradeoff analysis, predictive warnings, six structural indicators, and an advisor discussion guide.",
    },
    {
      q: "What is your refund policy?",
      a: "Full refund within 30 days if the report does not reveal at least one insight you did not already know. Visit our contact page with your record ID. No questions asked. Refunds processed within 3 business days.",
    },
    {
      q: "Is my information confidential?",
      a: "Yes. We never collect bank credentials, credit data, or financial account access. Your data is encrypted, never sold, and you can request deletion at any time.",
    },
    {
      q: "How long does it take?",
      a: "Under two minutes. Your free score is delivered instantly. The full report generates immediately after purchase.",
    },
    {
      q: "Can I retake the assessment?",
      a: "Yes. Each assessment is independent. Retake after a meaningful structural change to see how your score has moved.",
    },
  ];

  return (
    <section
      ref={ref}
      aria-label="FAQ"
      style={{
        background: B.sand,
        paddingTop: mobile ? S.sectionY.mobile : S.sectionY.desktop,
        paddingBottom: mobile ? S.sectionY.mobile : S.sectionY.desktop,
        paddingLeft: mobile ? S.padX.mobile : S.padX.desktop,
        paddingRight: mobile ? S.padX.mobile : S.padX.desktop,
      }}
    >
      <div className="mx-auto" style={{ maxWidth: 820 }}>
        <h2
          className="font-semibold text-center"
          style={{
            fontSize: mobile ? 28 : 42,
            color: B.navy,
            lineHeight: S.lhHeading,
            letterSpacing: S.lsHeading,
            fontFamily: DISPLAY_FONT, fontWeight: 400,
            marginBottom: mobile ? 40 : 56,
            opacity: visible ? 1 : 0,
            transform: visible ? "translateY(0)" : "translateY(16px)",
            transition: "opacity 600ms ease-out, transform 600ms ease-out",
          }}
        >
          Frequently asked questions
        </h2>

        <div
          style={{
            opacity: visible ? 1 : 0,
            transform: visible ? "translateY(0)" : "translateY(16px)",
            transition: "opacity 600ms ease-out 150ms, transform 600ms ease-out 150ms",
          }}
        >
          {faqs.map((faq, i) => {
            const isOpen = openFaq === i;
            return (
              <div
                key={i}
                style={{
                  borderTop: `1px solid ${B.border}`,
                  backgroundColor: isOpen ? "rgba(75,63,174,0.03)" : "transparent",
                  transition: "background-color 200ms ease",
                }}
              >
                <button
                  onClick={() => setOpenFaq(isOpen ? null : i)}
                  style={{
                    width: "100%",
                    padding: "20px 0",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    textAlign: "left",
                    paddingLeft: 4,
                    paddingRight: 4,
                  }}
                >
                  <span style={{ fontSize: 16, fontWeight: 500, color: B.navy, paddingRight: 16 }}>
                    {faq.q}
                  </span>
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" style={{ flexShrink: 0 }}>
                    <path d="M3 8h10" stroke={B.navy} strokeWidth="1.5" strokeLinecap="round" />
                    {!isOpen && <path d="M8 3v10" stroke={B.navy} strokeWidth="1.5" strokeLinecap="round" />}
                  </svg>
                </button>

                <div
                  style={{
                    maxHeight: isOpen ? 200 : 0,
                    overflow: "hidden",
                    transition: "max-height 300ms ease",
                  }}
                >
                  <p
                    style={{
                      fontSize: 15, color: B.muted, lineHeight: S.lhBody,
                      margin: 0, paddingBottom: 20, paddingLeft: 4, paddingRight: 4,
                    }}
                  >
                    {faq.a}
                  </p>
                </div>
              </div>
            );
          })}
          {/* Bottom border */}
          <div style={{ borderTop: `1px solid ${B.border}` }} />
        </div>

        {/* Bottom CTA link */}
        <div
          style={{
            textAlign: "center",
            marginTop: 40,
            opacity: visible ? 1 : 0,
            transition: "opacity 600ms ease-out 300ms",
          }}
        >
          <Link
            href="/pricing"
            style={{
              fontSize: 15, color: B.purple, fontWeight: 500,
              textDecoration: "underline", textUnderlineOffset: 4,
            }}
          >
            Get My Free Score &#8594;
          </Link>
        </div>
      </div>
    </section>
  );
}


/* ================================================================== */
/* SHAREABLE SCORE SECTION                                              */
/* ================================================================== */
function ShareableScoreSection() {
  const mobile = useMobile();

  return (
    <section
      style={{
        background: "#FFFFFF",
        paddingTop: mobile ? S.sectionYsm.mobile : S.sectionYsm.desktop,
        paddingBottom: mobile ? 80 : 100,
        paddingLeft: mobile ? S.padX.mobile : S.padX.desktop,
        paddingRight: mobile ? S.padX.mobile : S.padX.desktop,
      }}
    >
      <div className="mx-auto" style={{ maxWidth: S.maxW }}>
        <div
          style={{
            display: mobile ? "block" : "flex",
            alignItems: "center",
            gap: 64,
          }}
        >
          <div style={{ flex: 1, marginBottom: mobile ? 40 : 0 }}>
            <div
              style={{
                fontSize: 11, fontWeight: 600, textTransform: "uppercase",
                letterSpacing: "0.08em", color: B.teal, marginBottom: 16,
              }}
            >
              Verified &amp; shareable
            </div>
            <h2
              style={{
                fontSize: mobile ? 28 : 42,
                color: B.navy,
                lineHeight: 1.2,
                letterSpacing: "-0.02em",
                fontFamily: DISPLAY_FONT, fontWeight: 400,
                marginBottom: 20,
              }}
            >
              A score you can share
            </h2>
            <p style={{ fontSize: 16, color: "rgba(14,26,43,0.55)", lineHeight: 1.7, maxWidth: 440, marginBottom: 24 }}>
              Every RunPayway&#8482; score is verified, timestamped, and shareable. Send it to a lender, landlord, business partner, or advisor. They can verify it instantly with your unique QR code or verification link.
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {["Share with lenders evaluating your application", "Send to partners assessing your stability", "Provide to clients who want confidence in your durability"].map((item) => (
                <div key={item} style={{ display: "flex", alignItems: "flex-start", gap: 10 }}>
                  <div style={{ width: 6, height: 6, borderRadius: "50%", backgroundColor: B.teal, marginTop: 7, flexShrink: 0 }} />
                  <span style={{ fontSize: 15, color: "rgba(14,26,43,0.60)", lineHeight: 1.6 }}>{item}</span>
                </div>
              ))}
            </div>
          </div>
          <div style={{ flex: 1, maxWidth: 400 }}>
            {/* Preview of shareable score card */}
            <div style={{ borderRadius: S.panelRadius, border: "1px solid rgba(14,26,43,0.08)", overflow: "hidden", boxShadow: "0 8px 32px rgba(14,26,43,0.06)" }}>
              <div style={{ background: "linear-gradient(135deg, #0E1A2B 0%, #1a2d45 100%)", padding: "24px 24px 20px" }}>
                <div style={{ fontSize: 10, fontWeight: 600, color: "rgba(244,241,234,0.50)", letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: 8 }}>INCOME STABILITY SCORE&#8482;</div>
                <div style={{ fontSize: 40, fontWeight: 600, color: "#F4F1EA", lineHeight: 1 }}>72</div>
                <div style={{ display: "inline-flex", alignItems: "center", gap: 6, marginTop: 8 }}>
                  <div style={{ width: 6, height: 6, borderRadius: 2, backgroundColor: "#1F6D7A" }} />
                  <span style={{ fontSize: 13, fontWeight: 500, color: "#1F6D7A" }}>Established Stability</span>
                </div>
              </div>
              <div style={{ padding: "16px 24px 20px", backgroundColor: "#FFFFFF" }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 12 }}>
                  <div>
                    <div style={{ fontSize: 9, color: "rgba(14,26,43,0.42)" }}>Prepared for</div>
                    <div style={{ fontSize: 11, fontWeight: 500, color: "#0E1A2B" }}>Sample Assessment</div>
                  </div>
                  <div>
                    <div style={{ fontSize: 9, color: "rgba(14,26,43,0.42)" }}>Verified</div>
                    <div style={{ fontSize: 11, fontWeight: 500, color: "#0E1A2B" }}>March 2026</div>
                  </div>
                </div>
                <div style={{ fontSize: 10, color: "rgba(14,26,43,0.35)" }}>Verify at peoplestar.com/RunPayway/verify</div>
              </div>
            </div>
            <div style={{ textAlign: "center", marginTop: 12 }}>
              <span style={{ fontSize: 12, color: "rgba(14,26,43,0.40)" }}>Sample score card</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}


/* ================================================================== */
/* SECTION 12: DISCLAIMER — "The Footnote"                             */
/* ================================================================== */
function DisclaimerSection() {
  const mobile = useMobile();

  return (
    <section
      aria-label="Disclaimer"
      style={{
        background: B.navy,
        paddingTop: mobile ? 40 : 48,
        paddingBottom: mobile ? 40 : 48,
        paddingLeft: mobile ? S.padX.mobile : S.padX.desktop,
        paddingRight: mobile ? S.padX.mobile : S.padX.desktop,
      }}
    >
      <p
        className="mx-auto text-center"
        style={{
          fontSize: 13,
          color: "rgba(244,241,234,0.35)",
          lineHeight: S.lhBody,
          maxWidth: 640,
          margin: "0 auto",
        }}
      >
        The Income Stability Score&#8482; is a structural income assessment based on information provided by the user. It is not financial advice, investment advice, credit underwriting, or a prediction of future financial outcomes.
      </p>
    </section>
  );
}


/* ================================================================== */
/* SOCIAL PROOF STRIP                                                   */
/* ================================================================== */
function SocialProof() {
  const { ref, visible } = useInView();
  const mobile = useMobile();

  return (
    <section
      ref={ref}
      style={{
        backgroundColor: B.sand,
        paddingTop: mobile ? 48 : 64,
        paddingBottom: mobile ? 48 : 64,
        paddingLeft: mobile ? S.padX.mobile : S.padX.desktop,
        paddingRight: mobile ? S.padX.mobile : S.padX.desktop,
        borderTop: `1px solid ${B.border}`,
        borderBottom: `1px solid ${B.border}`,
      }}
    >
      <div style={{
        maxWidth: S.maxW,
        marginLeft: "auto",
        marginRight: "auto",
        paddingLeft: mobile ? S.padX.mobile : S.padX.desktop,
        paddingRight: mobile ? S.padX.mobile : S.padX.desktop,
        textAlign: "center",
        opacity: visible ? 1 : 0,
        transition: "opacity 600ms ease-out",
      }}>
        <p style={{
          fontSize: 15,
          fontWeight: 500,
          color: B.muted,
          letterSpacing: "0.01em",
          marginBottom: 20,
        }}>
          Built for professionals across 19 industries
        </p>
        <div style={{
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "center",
          gap: mobile ? 16 : 28,
        }}>
          {["Real Estate", "Finance", "Healthcare", "Consulting", "Technology", "Legal", "Agency", "Creator"].map((industry) => (
            <span
              key={industry}
              style={{
                fontSize: 13,
                fontWeight: 600,
                color: "rgba(14,26,43,0.25)",
                letterSpacing: "0.04em",
                textTransform: "uppercase",
              }}
            >
              {industry}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}


/* ================================================================== */
/* MAIN EXPORT                                                         */
/* ================================================================== */
export default function LandingPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  return (
    <div className="overflow-x-hidden">
      <HeroSection />
      <BridgeSection />
      <FourFactorsSection />
      <HowItWorksSection />
      <WhatYourReportSection />
      <TestimonialsSection />
      <PricingSection />
      <FaqSection openFaq={openFaq} setOpenFaq={setOpenFaq} />
      <DisclaimerSection />
    </div>
  );
}
