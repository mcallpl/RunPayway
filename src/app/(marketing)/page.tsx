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
  teal: "#1F6D7A",
  sand: "#F4F1EA",
  sandDk: "#F4F1EA",
  offWhite: "#FFFFFF",
  muted: "rgba(14,26,43,0.58)",
  light: "rgba(14,26,43,0.42)",
  border: "#E6E9EF",
  gradient: "linear-gradient(135deg, #0E1A2B 0%, #1A1540 40%, #4B3FAE 70%, #1F6D7A 100%)",
};

const S = {
  sectionY:     { desktop: 140, mobile: 80 },
  sectionYlg:   { desktop: 160, mobile: 88 },
  sectionYsm:   { desktop: 100, mobile: 64 },
  transitionY:  { desktop: 56, mobile: 40 },
  maxW:         1100,
  subtextMaxW:  540,
  padX:         { desktop: 56, mobile: 24 },
  h1mb:         24,
  h2mb:         20,
  subtextMb:    48,
  paraMb:       20,
  labelMb:      14,
  cardPad:      { desktop: 36, mobile: 24 },
  cardRadius:   12,
  panelRadius:  16,
  gridGap:      24,
  gridGapSm:    16,
  ctaH:         52,
  ctaHsm:       44,
  ctaPadX:      32,
  ctaRadius:    12,
  lhHeading:    1.1,
  lhBody:       1.65,
  lhDense:      1.5,
  lsHeading:    "-0.02em",
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
`}</style>
      {/* Gradient mesh */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `
            radial-gradient(ellipse 80% 60% at 70% 20%, rgba(75,63,174,0.18) 0%, transparent 60%),
            radial-gradient(ellipse 60% 50% at 20% 80%, rgba(31,109,122,0.12) 0%, transparent 55%),
            radial-gradient(ellipse 40% 40% at 50% 50%, rgba(75,63,174,0.08) 0%, transparent 50%)
          `,
        }}
      />

      {/* Shimmer overlay */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: "linear-gradient(120deg, transparent 30%, rgba(255,255,255,0.02) 50%, transparent 70%)",
          backgroundSize: "200% 100%",
          animation: "shimmer 8s ease-in-out 1",
        }}
      />


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
          paddingTop: mobile ? 100 : 180,
          paddingBottom: mobile ? 80 : 160,
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
                fontSize: mobile ? 36 : 64,
                fontWeight: 400,
                color: "#F4F1EA",
                lineHeight: 1.05,
                letterSpacing: "-0.025em",
                marginBottom: S.h1mb,
                maxWidth: mobile ? undefined : 600,
                fontFamily: DISPLAY_FONT,
              }}
            >
              <RevealText text="Could your income survive the next 60 days?" visible={visible} baseDelay={200} />
            </h1>

            <p
              style={{
                fontSize: mobile ? 15 : 18,
                color: "rgba(244,241,234,0.65)",
                lineHeight: 1.7,
                marginBottom: 12,
                maxWidth: mobile ? undefined : 500,
                opacity: visible ? 1 : 0,
                transform: visible ? "translateY(0)" : "translateY(10px)",
                transition: "opacity 600ms ease-out 200ms, transform 600ms ease-out 200ms",
              }}
            >
              Most people don&#8217;t know until it&#8217;s too late. Answer 6 questions. Get your score in under 2 minutes. See exactly where your income is vulnerable.
            </p>

            <p
              style={{
                fontSize: mobile ? 13 : 14,
                color: "rgba(244,241,234,0.40)",
                lineHeight: 1.6,
                marginBottom: 36,
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
                href="/diagnostic-portal"
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
                <span className="cta-label">Get My Free Score</span>
                <span className="cta-arrow cta-arrow-navy" />
              </Link>

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

      <style>{`
        @keyframes shimmer {
          0%, 100% { background-position: -200% 0; }
          50% { background-position: 200% 0; }
        }
      `}</style>
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
        background: "#FFFFFF",
        paddingTop: mobile ? 56 : 80,
        paddingBottom: mobile ? 56 : 80,
        paddingLeft: mobile ? S.padX.mobile : S.padX.desktop,
        paddingRight: mobile ? S.padX.mobile : S.padX.desktop,
      }}
    >
      <div
        className="mx-auto"
        style={{
          maxWidth: 720,
          textAlign: "center",
          opacity: visible ? 1 : 0,
          transform: visible ? "translateY(0)" : "translateY(16px)",
          transition: "opacity 700ms ease-out, transform 700ms ease-out",
        }}
      >
        <p
          style={{
            fontSize: mobile ? 18 : 24,
            fontFamily: DISPLAY_FONT,
            fontWeight: 400,
            color: B.navy,
            lineHeight: 1.45,
            letterSpacing: "-0.01em",
            margin: 0,
          }}
        >
          The average self-employed professional has less than 30 days of income protection.
          Most don&#8217;t find out until a client leaves, a contract ends, or they can&#8217;t work.
        </p>
        <div
          style={{
            width: 40,
            height: 2,
            backgroundColor: B.teal,
            margin: "28px auto 0",
            borderRadius: 1,
            opacity: visible ? 1 : 0,
            transition: "opacity 600ms ease-out 400ms",
          }}
        />
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
      number: "I",
      label: "Recurrence",
      question: "Do you rebuild your income from scratch every month?",
      description: "If none of your income repeats automatically — no retainers, no subscriptions, no recurring contracts — you start at zero every month. That is structurally fragile.",
    },
    {
      number: "II",
      label: "Concentration",
      question: "Would losing one client wipe out half your income?",
      description: "If too much depends on a single source, one lost contract or one client decision can collapse your entire income. Diversification is structural protection.",
    },
    {
      number: "III",
      label: "Visibility",
      question: "Do you know what you will earn next month — or are you guessing?",
      description: "If your upcoming income is not already committed — booked, contracted, or locked in — you have no forward visibility. That means no ability to plan.",
    },
    {
      number: "IV",
      label: "Passivity",
      question: "If you stopped working today, when does the money stop?",
      description: "If 100% of your income requires your daily effort, any disruption — illness, burnout, a slow month — immediately threatens everything.",
    },
  ];

  return (
    <section
      ref={ref}
      aria-label="What RunPayway™ Measures"
      style={{
        background: "linear-gradient(180deg, #FFFFFF 0%, #F8F6F2 100%)",
        paddingTop: mobile ? S.sectionY.mobile : S.sectionY.desktop,
        paddingBottom: mobile ? S.sectionY.mobile : S.sectionY.desktop,
        paddingLeft: mobile ? S.padX.mobile : S.padX.desktop,
        paddingRight: mobile ? S.padX.mobile : S.padX.desktop,
      }}
    >
      <div className="mx-auto" style={{ maxWidth: S.maxW }}>
        {/* Section header */}
        <div
          style={{
            textAlign: "center",
            marginBottom: mobile ? 56 : 80,
            opacity: visible ? 1 : 0,
            transform: visible ? "translateY(0)" : "translateY(16px)",
            transition: "opacity 600ms ease-out, transform 600ms ease-out",
          }}
        >
          <div
            style={{
              fontSize: 11, fontWeight: 600, textTransform: "uppercase",
              letterSpacing: S.lsLabel, color: B.teal, marginBottom: 16,
            }}
          >
            Why income disappears
          </div>
          <h2
            style={{
              fontSize: mobile ? 32 : 52,
              color: B.navy,
              lineHeight: 1.08,
              letterSpacing: "-0.025em",
              fontFamily: DISPLAY_FONT, fontWeight: 400,
              marginBottom: 24,
            }}
          >
            The four reasons income falls apart
          </h2>
          <p style={{ fontSize: mobile ? 15 : 18, color: "rgba(14,26,43,0.48)", lineHeight: 1.7, maxWidth: 540, margin: "0 auto" }}>
            Your Income Stability Score&#8482; measures these four structural risks. If any one of them is weak, your income is exposed.
          </p>
        </div>

        {/* Four factors — editorial list */}
        <div style={{ maxWidth: 800, margin: "0 auto" }}>
          {factors.map((f, i) => (
            <div
              key={f.label}
              style={{
                display: mobile ? "block" : "flex",
                alignItems: "flex-start",
                gap: 40,
                paddingTop: i === 0 ? 0 : (mobile ? 40 : 56),
                paddingBottom: mobile ? 40 : 56,
                borderBottom: i < factors.length - 1 ? "1px solid rgba(14,26,43,0.08)" : "none",
                opacity: visible ? 1 : 0,
                transform: visible ? "translateY(0)" : "translateY(16px)",
                transition: `opacity 600ms ease-out ${200 + i * 120}ms, transform 600ms ease-out ${200 + i * 120}ms`,
              }}
            >
              {/* Left — numeral + label */}
              <div style={{ minWidth: mobile ? undefined : 180, marginBottom: mobile ? 16 : 0 }}>
                <div
                  style={{
                    fontSize: 32, fontWeight: 300, color: B.teal,
                    letterSpacing: "0.04em", lineHeight: 1, marginBottom: 8,
                    fontFamily: DISPLAY_FONT,
                  }}
                >
                  {f.number}
                </div>
                <div
                  style={{
                    fontSize: 13, fontWeight: 600, textTransform: "uppercase",
                    letterSpacing: "0.06em", color: B.navy,
                  }}
                >
                  {f.label}
                </div>
              </div>

              {/* Right — question + description */}
              <div style={{ flex: 1 }}>
                <div
                  style={{
                    fontSize: mobile ? 22 : 26,
                    fontWeight: 400,
                    color: B.navy,
                    lineHeight: 1.25,
                    letterSpacing: "-0.015em",
                    marginBottom: 14,
                    fontFamily: DISPLAY_FONT,
                  }}
                >
                  {f.question}
                </div>
                <p style={{ fontSize: 15, color: "rgba(14,26,43,0.55)", lineHeight: 1.7, margin: 0 }}>
                  {f.description}
                </p>
              </div>
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
        paddingTop: mobile ? 80 : 120,
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
                fontSize: mobile ? 32 : 48,
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
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8, marginBottom: 20 }}>
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
                      href="/diagnostic-portal"
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
  const [activeTab, setActiveTab] = useState(0);

  const pages = [
    { num: "01", title: "Your Score", question: "Where do I stand?", desc: "You will know your exact number — and whether you should be worried.", color: B.purple },
    { num: "02", title: "How Your Income Is Built", question: "Why this score?", desc: "You will see the one structural weakness most likely to cost you — and how you compare to peers in your industry with actual numbers.", color: B.teal },
    { num: "03", title: "Your Income Deep Dive", question: "How deep does it go?", desc: "You will understand exactly why your income is vulnerable — six dimensions scored, fragility classified, and every cross-factor penalty explained.", color: B.navy },
    { num: "04", title: "Your Biggest Risks", question: "What could go wrong?", desc: "You will know what happens if your biggest client leaves tomorrow, if you cannot work for 90 days, or if your industry contracts — each scenario scored.", color: B.purple },
    { num: "05", title: "Your Action Plan", question: "What do I do about it?", desc: "You will have 3 specific things to do this quarter — tailored to your industry, income model, and operating structure. Plus an advisor discussion guide you can share.", color: B.teal },
  ];

  return (
    <section
      ref={ref}
      aria-label="What your report includes"
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
            fontSize: mobile ? 32 : 48,
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
          What the report tells you
        </h2>

        <p
          className="text-center mx-auto"
          style={{
            fontSize: mobile ? 16 : 18,
            color: B.muted,
            lineHeight: S.lhBody,
            maxWidth: 640,
            marginBottom: mobile ? 40 : 56,
            opacity: visible ? 1 : 0,
            transform: visible ? "translateY(0)" : "translateY(12px)",
            transition: "opacity 600ms ease-out 100ms, transform 600ms ease-out 100ms",
          }}
        >
          Five pages. Each one answers a question you need answered before something goes wrong.
        </p>

        {/* Tab navigation */}
        <div
          style={{
            opacity: visible ? 1 : 0,
            transform: visible ? "translateY(0)" : "translateY(16px)",
            transition: "opacity 600ms ease-out 200ms, transform 600ms ease-out 200ms",
          }}
        >
          <div style={{
            display: "flex",
            gap: 0,
            maxWidth: 700,
            margin: "0 auto 32px",
            borderBottom: `2px solid ${B.border}`,
          }}>
            {pages.map((page, i) => (
              <button
                key={page.num}
                onClick={() => setActiveTab(i)}
                style={{
                  flex: 1,
                  padding: "14px 8px",
                  background: "none",
                  border: "none",
                  borderBottom: activeTab === i ? `2px solid ${B.purple}` : "2px solid transparent",
                  marginBottom: -2,
                  cursor: "pointer",
                  transition: "all 200ms ease",
                  color: activeTab === i ? B.navy : B.light,
                  fontSize: 13,
                  fontWeight: activeTab === i ? 700 : 500,
                  letterSpacing: "0.01em",
                }}
              >
                {page.num}. {page.title}
              </button>
            ))}
          </div>

          {/* Tab content — preview card */}
          <div style={{
            maxWidth: 700,
            margin: "0 auto",
            backgroundColor: "#ffffff",
            borderRadius: 16,
            border: "1px solid rgba(14,26,43,0.06)",
            boxShadow: "0 8px 32px rgba(14,26,43,0.06), 0 2px 8px rgba(14,26,43,0.03)",
            padding: mobile ? 24 : 36,
            position: "relative",
            overflow: "hidden",
            minHeight: 200,
          }}>
            {/* Top accent bar */}
            <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 3, background: `linear-gradient(90deg, ${pages[activeTab].color}, ${B.teal})` }} />

            <div style={{ display: "flex", alignItems: "flex-start", gap: 20 }}>
              <span style={{
                fontSize: 48,
                fontWeight: 800,
                color: "rgba(14,26,43,0.05)",
                lineHeight: 1,
                flexShrink: 0,
              }}>
                {pages[activeTab].num}
              </span>
              <div style={{ flex: 1 }}>
                <h3 style={{
                  fontSize: 20,
                  fontWeight: 600,
                  color: B.navy,
                  marginBottom: 8,
                  letterSpacing: "-0.02em",
                }}>
                  {pages[activeTab].title}
                </h3>
                <p style={{
                  fontSize: 14,
                  color: B.muted,
                  lineHeight: 1.7,
                  marginBottom: 16,
                }}>
                  {pages[activeTab].question}
                </p>
                <p style={{
                  fontSize: 15,
                  color: "rgba(14,26,43,0.70)",
                  lineHeight: 1.7,
                  margin: 0,
                }}>
                  {pages[activeTab].desc}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Sample report link */}
        <div
          style={{
            textAlign: "center",
            marginTop: 40,
            opacity: visible ? 1 : 0,
            transition: "opacity 600ms ease-out 400ms",
          }}
        >
          <Link
            href="/sample-report"
            style={{
              fontSize: 15, color: B.purple, fontWeight: 500,
              textDecoration: "underline", textUnderlineOffset: 4,
            }}
          >
            View the sample report &#8594;
          </Link>
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
            fontSize: mobile ? 32 : 48,
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
            fontSize: mobile ? 16 : 18,
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
              borderRadius: 12,
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
                  gridTemplateColumns: mobile ? "1fr 1fr" : "repeat(4, 1fr)",
                  gap: 16,
                  marginBottom: 20,
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
              <div style={{ display: "flex", gap: 16, marginBottom: 16 }}>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 11, textTransform: "uppercase", letterSpacing: S.lsLabel, color: B.light, marginBottom: 4, fontWeight: 600 }}>Main Constraint</div>
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
            href="/diagnostic-portal"
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
    { num: "1", title: "Answer six questions", desc: "About how your income is structured today. Takes under two minutes." },
    { num: "2", title: "Get your free score", desc: "See your score, stability band, peer percentile, and one key insight — instantly, at no cost." },
    { num: "3", title: "Unlock the full report — $99", desc: "Get the complete 5-page breakdown: what is weak, what would break, and exactly what to do about it. If it does not reveal something new, full refund." },
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
      <div className="mx-auto" style={{ maxWidth: S.maxW }}>
        <h2
          className="font-semibold text-center"
          style={{
            fontSize: mobile ? 32 : 48,
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
          How it works
        </h2>

        <p
          className="text-center"
          style={{
            fontSize: mobile ? 16 : 18,
            color: B.muted,
            lineHeight: S.lhBody,
            marginBottom: mobile ? 40 : 56,
            opacity: visible ? 1 : 0,
            transform: visible ? "translateY(0)" : "translateY(12px)",
            transition: "opacity 600ms ease-out 100ms, transform 600ms ease-out 100ms",
          }}
        >
          Six questions. Under two minutes. Full structural diagnosis.
        </p>

        {/* Steps grid */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: mobile ? "1fr" : "repeat(3, 1fr)",
            gap: S.gridGap,
            position: "relative",
            opacity: visible ? 1 : 0,
            transform: visible ? "translateY(0)" : "translateY(16px)",
            transition: "opacity 600ms ease-out 200ms, transform 600ms ease-out 200ms",
          }}
        >
          {/* Connecting line between cards (desktop only) */}
          {!mobile && (
            <div
              style={{
                position: "absolute",
                top: 58,
                left: "calc(33.333% + 12px)",
                right: "calc(33.333% + 12px)",
                height: 1,
                borderTop: "1px dashed rgba(14,26,43,0.10)",
                pointerEvents: "none",
                zIndex: 0,
              }}
            />
          )}

          {steps.map((step, i) => (
            <div
              key={step.num}
              style={{
                background: "#FFFFFF",
                borderRadius: S.cardRadius,
                border: "1px solid rgba(14,26,43,0.06)",
                boxShadow: "0 1px 3px rgba(14,26,43,0.04), 0 8px 24px rgba(14,26,43,0.03)",
                padding: mobile ? S.cardPad.mobile : S.cardPad.desktop,
                textAlign: "center",
                position: "relative",
                zIndex: 1,
                transition: "transform 250ms ease, box-shadow 250ms ease, border-color 250ms ease",
              }}
              onMouseEnter={(e) => {
                if (!canHover()) return;
                e.currentTarget.style.transform = "translateY(-4px)";
                e.currentTarget.style.boxShadow = "0 4px 12px rgba(14,26,43,0.06), 0 16px 40px rgba(14,26,43,0.06)";
                e.currentTarget.style.borderColor = "rgba(75,63,174,0.12)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = "0 1px 3px rgba(14,26,43,0.04), 0 8px 24px rgba(14,26,43,0.03)";
                e.currentTarget.style.borderColor = "rgba(14,26,43,0.06)";
              }}
            >
              {/* Step number badge */}
              <div
                style={{
                  width: 44, height: 44,
                  borderRadius: 12,
                  backgroundColor: B.purple,
                  color: "#FFFFFF",
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 18,
                  fontWeight: 600,
                  marginBottom: 20,
                  boxShadow: "0 4px 12px rgba(75,63,174,0.25)",
                }}
              >
                {step.num}
              </div>

              <div style={{ fontSize: 20, fontWeight: 600, color: B.navy, marginBottom: 8 }}>
                {step.title}
              </div>
              <p style={{ fontSize: 15, color: B.muted, lineHeight: S.lhBody, margin: 0 }}>
                {step.desc}
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
          Powered by Model RP-2.0
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
            fontSize: mobile ? 32 : 48,
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
            fontSize: mobile ? 16 : 18,
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
                borderRadius: 12,
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

  // PLACEHOLDER — Replace with real testimonials before launch
  const testimonials = [
    { quote: "I had no idea 92% of my income depended on one client. The stress test was a wake-up call.", name: "Sarah M.", role: "Real Estate Agent", score: 28 },
    { quote: "The cross-factor breakdown showed me exactly why my score was being penalized. No other tool does that.", name: "James R.", role: "Software Contractor", score: 44 },
    { quote: "I shared the advisor guide with my accountant. She said it was more useful than most reports she sees.", name: "Priya K.", role: "Management Consultant", score: 61 },
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
              fontSize: mobile ? 28 : 40,
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
              {/* Score badge */}
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 20 }}>
                <div style={{ width: 36, height: 36, borderRadius: 8, background: "rgba(75,63,174,0.15)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <span style={{ fontSize: 14, fontWeight: 700, color: "#F4F1EA" }}>{t.score}</span>
                </div>
                <span style={{ fontSize: 12, color: "rgba(244,241,234,0.40)" }}>
                  Score: {t.score}/100
                </span>
              </div>

              {/* Quote */}
              <p style={{ fontSize: 15, color: "rgba(244,241,234,0.80)", lineHeight: 1.65, margin: "0 0 20px", flex: 1, fontStyle: "italic" }}>
                &ldquo;{t.quote}&rdquo;
              </p>

              {/* Attribution */}
              <div>
                <div style={{ fontSize: 14, fontWeight: 600, color: "#F4F1EA" }}>{t.name}</div>
                <div style={{ fontSize: 12, color: "rgba(244,241,234,0.45)" }}>{t.role}</div>
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
            fontSize: mobile ? 30 : 44,
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
            fontSize: mobile ? 16 : 18,
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
              borderRadius: 12,
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
              href="/diagnostic-portal"
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
              borderRadius: 12,
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
              Full 5-page report &#183; All engine data &#183; Advisor guide
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
          <div style={{ display: "inline-block", padding: "16px 32px", borderRadius: 12, border: "1px solid rgba(244,241,234,0.12)", marginBottom: 20 }}>
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
        "AI does not determine assessment results",
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
            fontSize: mobile ? 32 : 48,
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
                  borderRadius: 12,
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
            fontSize: mobile ? 32 : 48,
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
            fontSize: mobile ? 16 : 18,
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
            gridTemplateColumns: mobile ? "1fr 1fr" : "repeat(4, 1fr)",
            gap: mobile ? 20 : S.gridGap,
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
      a: "A 5-page report with your score breakdown, six structural indicators, fragility and confidence classification, cross-factor interaction effects, industry-specific risk scenarios, a personalized action plan, and an advisor discussion guide.",
    },
    {
      q: "What if the report doesn\u2019t tell me anything new?",
      a: "Email support@runpayway.com for a full refund. No questions asked.",
    },
    {
      q: "How long does it take?",
      a: "Under two minutes. Six questions. Your free score is delivered instantly.",
    },
    {
      q: "Do you need access to my bank accounts?",
      a: "No. RunPayway™ never connects to a bank, pulls credit, or accesses financial accounts. You answer six questions and the model generates your assessment from those inputs alone.",
    },
    {
      q: "Can I retake it later?",
      a: "Yes. Retake after a meaningful structural change to see how your score has moved. Your report includes a recommended reassessment date.",
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
            fontSize: mobile ? 32 : 48,
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
            href="/diagnostic-portal"
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
        paddingTop: mobile ? 80 : 100,
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
                fontSize: mobile ? 28 : 40,
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
            <div style={{ borderRadius: 12, border: "1px solid rgba(14,26,43,0.08)", overflow: "hidden", boxShadow: "0 8px 32px rgba(14,26,43,0.06)" }}>
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
