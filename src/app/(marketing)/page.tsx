"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import logoWhite from "../../../public/runpayway-logo-white.png";
import SimulatorTeaser from "@/components/SimulatorTeaser";

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
  sectionYsm:  { desktop: 80, mobile: 48 },
  transitionY:  { desktop: 48, mobile: 32 },
  // Layout
  maxW:         1100,
  subtextMaxW:  520,
  padX:         { desktop: 56, mobile: 28 },
  // Vertical gaps (strict 4px grid)
  h1mb:         24,
  h2mb:         20,
  subtextMb:    48,
  paraMb:       16,
  labelMb:      14,
  sectionHeaderMb: { desktop: 56, mobile: 36 },
  // Cards
  cardPad:      { desktop: 36, mobile: 28 },
  cardRadius:   8,
  panelRadius:  12,
  gridGap:      20,
  gridGapSm:    14,
  // CTA
  ctaH:         56,
  ctaHsm:       48,
  ctaPadX:      36,
  ctaRadius:    10,
  // Typography — enterprise legibility scale (nothing under 13px)
  lhHeading:    1.12,
  lhBody:       1.65,
  lhDense:      1.5,
  lsHeading:    "-0.025em",
  lsHero:       "-0.03em",
  lsLabel:      "0.08em",
  // Font sizes
  fsH1:         { desktop: 64, mobile: 40 },
  fsH2:         { desktop: 48, mobile: 32 },
  fsH3:         { desktop: 24, mobile: 20 },
  fsBody:       { desktop: 18, mobile: 16 },
  fsBodySm:     { desktop: 16, mobile: 15 },
  fsLabel:      13,
  fsMeta:       14,
  fsCard:       { desktop: 16, mobile: 15 },
  fsCta:        16,
  fsNav:        15,
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
          Strong structural protection
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
          paddingTop: mobile ? 108 : 160,
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
              style={{
                opacity: visible ? 1 : 0,
                transform: visible ? "translateY(0)" : "translateY(8px)",
                transition: "opacity 500ms ease-out, transform 500ms ease-out",
                fontSize: S.fsLabel, fontWeight: 700, letterSpacing: S.lsLabel, textTransform: "uppercase" as const,
                color: B.teal, marginBottom: 24,
              }}
            >
              Income Stability Score&#8482;
            </div>

            <h1
              style={{
                fontSize: mobile ? S.fsH1.mobile : S.fsH1.desktop,
                fontWeight: 400,
                color: "#F4F1EA",
                lineHeight: 1.04,
                letterSpacing: S.lsHero,
                marginBottom: 28,
                maxWidth: mobile ? undefined : 560,
                fontFamily: DISPLAY_FONT,
              }}
            >
              <RevealText text="Could your income survive the next 60 days?" visible={visible} baseDelay={150} />
            </h1>

            <p
              style={{
                fontSize: mobile ? S.fsBody.mobile : S.fsBody.desktop,
                color: "rgba(244,241,234,0.50)",
                lineHeight: 1.55,
                marginBottom: 36,
                maxWidth: mobile ? undefined : 440,
                opacity: visible ? 1 : 0,
                transition: "opacity 600ms ease-out 300ms",
              }}
            >
              Get your score in under 2 minutes. See exactly where your income is vulnerable.
            </p>

            <div
              style={{
                opacity: visible ? 1 : 0,
                transform: visible ? "translateY(0)" : "translateY(10px)",
                transition: "opacity 500ms ease-out 400ms, transform 500ms ease-out 400ms",
              }}
            >
              <Link
                href="/pricing"
                className="cta-tick inline-flex items-center justify-center font-semibold focus:outline-none focus:ring-2 focus:ring-offset-2"
                style={{
                  height: S.ctaH,
                  width: mobile ? "100%" : "auto",
                  paddingLeft: 36,
                  paddingRight: 36,
                  borderRadius: S.ctaRadius,
                  background: "linear-gradient(135deg, #F4F1EA 0%, #EDECEA 100%)",
                  color: B.navy,
                  fontSize: S.fsCta,
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
              <p style={{ fontSize: S.fsMeta, color: "rgba(244,241,234,0.40)", marginTop: 20 }}>
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
            <AnimatedScoreRing visible={visible} mobile={mobile} />
          </div>
        </div>

      </div>


    </section>
  );
}


/* ================================================================== */
/* HERO VIDEO — 15s cinematic loop below hero                          */
/* ================================================================== */
function HeroVideo() {
  const mobile = useMobile();
  const [videoSrc, setVideoSrc] = useState("");

  useEffect(() => {
    // Detect basePath at runtime for static export compatibility
    const base = window.location.pathname.startsWith("/RunPayway") ? "/RunPayway" : "";
    setVideoSrc(`${base}/hero-video.mp4`);
  }, []);

  return (
    <section
      aria-label="Brand video"
      style={{
        backgroundColor: "#000000",
        lineHeight: 0,
      }}
    >
      {videoSrc && (
        <video
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          style={{
            width: "100%",
            height: "auto",
            display: "block",
          }}
        >
          <source src={videoSrc} type="video/mp4" />
        </video>
      )}
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
        paddingTop: mobile ? 40 : 56,
        paddingBottom: mobile ? 40 : 56,
        paddingLeft: mobile ? S.padX.mobile : S.padX.desktop,
        paddingRight: mobile ? S.padX.mobile : S.padX.desktop,
        marginTop: 0,
        position: "relative" as const,
        zIndex: 10,
      }}
    >
      <div
        style={{
          maxWidth: 600,
          margin: "0 auto",
          textAlign: "center",
          opacity: visible ? 1 : 0,
          transform: visible ? "translateY(0)" : "translateY(16px)",
          transition: "opacity 700ms ease-out, transform 700ms ease-out",
        }}
      >
        <p
          style={{
            fontSize: mobile ? S.fsBody.mobile : S.fsBody.desktop,
            fontFamily: DISPLAY_FONT,
            fontWeight: 400,
            color: B.navy,
            lineHeight: 1.4,
            letterSpacing: S.lsHeading,
            margin: 0,
          }}
        >
          The median small business holds just 27 days of cash buffer.*
        </p>
        <p style={{ fontSize: S.fsLabel, color: "rgba(14,26,43,0.35)", marginTop: 8, fontStyle: "italic" }}>
          *JPMorgan Chase Institute, &ldquo;Cash is King: Flows, Balances, and Buffer Days,&rdquo; September 2016
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

  const [hoverIdx, setHoverIdx] = useState<number | null>(null);

  const factors = [
    {
      num: "01",
      label: "Recurrence",
      accent: B.teal,
      metric: "0%",
      metricLabel: "recurring",
      question: "Do you rebuild your income from scratch every month?",
      description: "No retainers, no subscriptions, no recurring contracts means you start at zero every month.",
    },
    {
      num: "02",
      label: "Concentration",
      accent: B.purple,
      metric: "55%",
      metricLabel: "one client",
      question: "Would losing one client wipe out half your income?",
      description: "One lost contract or one client decision can collapse your entire income structure.",
    },
    {
      num: "03",
      label: "Visibility",
      accent: "#D4940A",
      metric: "<30",
      metricLabel: "days booked",
      question: "Do you know what you will earn next month?",
      description: "If your income is not already committed — booked, contracted, locked in — you are guessing.",
    },
    {
      num: "04",
      label: "Passivity",
      accent: "#DC4A4A",
      metric: "100%",
      metricLabel: "labor",
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
        paddingTop: mobile ? S.sectionY.mobile : S.sectionY.desktop,
        paddingBottom: mobile ? S.sectionY.mobile : S.sectionY.desktop,
        paddingLeft: mobile ? S.padX.mobile : S.padX.desktop,
        paddingRight: mobile ? S.padX.mobile : S.padX.desktop,
      }}
    >
      <div style={{ maxWidth: S.maxW, margin: "0 auto" }}>
        {/* Section header */}
        <div style={{ maxWidth: 560, marginBottom: mobile ? S.sectionHeaderMb.mobile : S.sectionHeaderMb.desktop }}>
          <div style={{ fontSize: S.fsLabel, fontWeight: 700, textTransform: "uppercase" as const, letterSpacing: S.lsLabel, color: B.teal, marginBottom: 16, opacity: visible ? 1 : 0, transition: "opacity 400ms ease-out" }}>
            What We Measure
          </div>
          <h2 style={{
            fontSize: mobile ? S.fsH2.mobile : S.fsH2.desktop, color: B.navy, lineHeight: 1.12,
            letterSpacing: "-0.025em", fontFamily: DISPLAY_FONT, fontWeight: 400, marginBottom: 16,
            opacity: visible ? 1 : 0, transform: visible ? "translateY(0)" : "translateY(16px)",
            transition: "opacity 600ms ease-out, transform 600ms ease-out",
          }}>
            The four structural risks that determine your score
          </h2>
          <p style={{ fontSize: mobile ? S.fsBody.mobile : S.fsBody.desktop, color: B.muted, lineHeight: 1.65, opacity: visible ? 1 : 0, transition: "opacity 600ms ease-out 100ms" }}>
            If any one is weak, your income is exposed. The score quantifies exactly how much.
          </p>
        </div>

        {/* 4 cards — staggered, accented, with metrics */}
        <div style={{ display: "grid", gridTemplateColumns: mobile ? "1fr" : "1fr 1fr", gap: mobile ? 16 : 20 }}>
          {factors.map((f, i) => {
            const isHovered = hoverIdx === i;
            const stagger = !mobile && i % 2 === 1 ? 24 : 0;
            return (
              <div
                key={f.label}
                onMouseEnter={() => canHover() && setHoverIdx(i)}
                onMouseLeave={() => setHoverIdx(null)}
                style={{
                  background: B.navy,
                  borderRadius: 12,
                  padding: mobile ? "28px 24px" : "32px 32px",
                  position: "relative",
                  overflow: "hidden",
                  marginTop: stagger,
                  transform: isHovered ? "translateY(-4px)" : "translateY(0)",
                  boxShadow: isHovered ? "0 12px 40px rgba(14,26,43,0.25)" : "0 4px 16px rgba(14,26,43,0.10)",
                  transition: "transform 250ms ease, box-shadow 250ms ease",
                  opacity: visible ? 1 : 0,
                  ...(visible ? {} : { transform: "translateY(20px)" }),
                  transitionDelay: `${150 + i * 80}ms`,
                  transitionDuration: "500ms",
                  transitionTimingFunction: "ease-out",
                  transitionProperty: "opacity, transform, box-shadow",
                }}
              >
                {/* Colored top accent bar */}
                <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 3, backgroundColor: f.accent, opacity: isHovered ? 1 : 0.6, transition: "opacity 250ms" }} />

                {/* Ambient glow */}
                <div style={{ position: "absolute", top: -30, right: -30, width: 100, height: 100, background: `radial-gradient(circle, ${f.accent}15 0%, transparent 70%)`, pointerEvents: "none" }} />

                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 16 }}>
                  {/* Number + label */}
                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <span style={{ fontSize: mobile ? S.fsH3.mobile : S.fsH3.desktop, fontWeight: 700, color: f.accent, letterSpacing: "-0.02em", fontFamily: DISPLAY_FONT, lineHeight: 1 }}>{f.num}</span>
                    <span style={{ fontSize: S.fsLabel, fontWeight: 700, letterSpacing: "0.10em", textTransform: "uppercase" as const, color: "rgba(244,241,234,0.30)" }}>{f.label}</span>
                  </div>

                  {/* Risk metric */}
                  <div style={{ textAlign: "right" }}>
                    <div style={{ fontSize: mobile ? S.fsH3.mobile : S.fsH3.desktop, fontWeight: 700, color: f.accent, lineHeight: 1, fontVariantNumeric: "tabular-nums" }}>{f.metric}</div>
                    <div style={{ fontSize: S.fsLabel, color: "rgba(244,241,234,0.30)", fontWeight: 500, letterSpacing: "0.04em", textTransform: "uppercase" as const, marginTop: 2 }}>{f.metricLabel}</div>
                  </div>
                </div>

                <h3 style={{ fontSize: mobile ? S.fsH3.mobile : S.fsH3.desktop, fontWeight: 500, color: "#F4F1EA", lineHeight: 1.3, letterSpacing: "-0.015em", marginBottom: 10 }}>
                  {f.question}
                </h3>

                <p style={{ fontSize: mobile ? S.fsCard.mobile : S.fsCard.desktop, color: "rgba(244,241,234,0.45)", lineHeight: 1.6, margin: 0 }}>
                  {f.description}
                </p>
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
    { num: "02", title: "How Your Income Is Built", value: "63% active", detail: "Income composition, stress test drop, continuity window, and structural context for your income model.", color: B.teal },
    { num: "03", title: "Your Biggest Risks", value: "3 scenarios", detail: "Ranked by severity with exact score drops. Plus predictive warnings about mistakes you are likely to make next.", color: "#9B2C2C" },
    { num: "04", title: "Your Income Deep Dive", value: "Full breakdown", detail: "Cross-factor effects, surprising insights, fragility classification, and your income system mapped visually.", color: B.navy },
    { num: "05", title: "Your Action Plan", value: "3 priorities", detail: "Specific actions with projected score impact, tradeoff analysis, and suggested language for your next move.", color: B.teal },
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
          <div style={{ fontSize: S.fsLabel, fontWeight: 700, letterSpacing: S.lsLabel, textTransform: "uppercase" as const, color: B.teal, marginBottom: 16, opacity: visible ? 1 : 0, transition: "opacity 400ms ease-out" }}>
            What You Get
          </div>
          <h2
            style={{
              fontSize: mobile ? S.fsH2.mobile : S.fsH2.desktop,
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
              fontSize: mobile ? S.fsBody.mobile : S.fsBody.desktop,
              color: "rgba(244,241,234,0.55)",
              lineHeight: S.lhBody,
              maxWidth: 520,
              margin: "0 auto",
              opacity: visible ? 1 : 0,
              transition: "opacity 600ms ease-out 100ms",
            }}
          >
            Five pages of analysis. An interactive simulator. Suggested language for your next move. Every number is yours.
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

              <div style={{ fontSize: S.fsLabel, fontWeight: 700, letterSpacing: "0.08em", color: "rgba(244,241,234,0.35)", marginBottom: 12 }}>{page.num}</div>
              <div style={{ fontSize: mobile ? S.fsH3.mobile : S.fsH3.desktop, fontWeight: 600, color: "#F4F1EA", marginBottom: 4, letterSpacing: "-0.01em" }}>{page.title}</div>
              <div style={{ fontSize: mobile ? S.fsH3.mobile : S.fsH3.desktop, fontWeight: 700, color: page.color === B.navy ? B.teal : page.color, marginBottom: 12, letterSpacing: "-0.02em" }}>{page.value}</div>
              <p style={{ fontSize: mobile ? S.fsCard.mobile : S.fsCard.desktop, color: "rgba(244,241,234,0.50)", lineHeight: 1.55, margin: 0 }}>{page.detail}</p>
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
            <div style={{ fontSize: mobile ? S.fsH3.mobile : S.fsH3.desktop, fontWeight: 600, color: "#F4F1EA", marginBottom: 8 }}>What if you added one more client?</div>
            <p style={{ fontSize: mobile ? S.fsCard.mobile : S.fsCard.desktop, color: "rgba(244,241,234,0.55)", lineHeight: 1.6, margin: 0 }}>
              What if you converted to retainers? What if you couldn&#8217;t work for 90 days? The full report includes a tool that answers these questions — with your actual numbers, in real time.
            </p>
          </div>
          <div style={{ display: "flex", gap: 12 }}>
            <Link
              href="/sample-report"
              style={{
                display: "inline-flex", alignItems: "center", justifyContent: "center",
                padding: "10px 24px", borderRadius: 8, fontSize: S.fsMeta, fontWeight: 600,
                color: "#F4F1EA", border: "1px solid rgba(244,241,234,0.20)",
                textDecoration: "none", whiteSpace: "nowrap" as const,
                transition: "border-color 200ms ease",
              }}
            >
              View sample report
            </Link>
          </div>
        </div>

        {/* Lifetime simulator access callout */}
        <div style={{
          marginTop: mobile ? 20 : 28,
          textAlign: "center",
          padding: "16px 24px",
          borderRadius: S.panelRadius,
          border: "1px solid rgba(26,122,109,0.30)",
          background: "rgba(26,122,109,0.08)",
          opacity: visible ? 1 : 0,
          transition: "opacity 600ms ease-out 700ms",
        }}>
          <p style={{ fontSize: mobile ? 15 : 16, fontWeight: 600, color: B.teal, margin: 0, lineHeight: 1.5 }}>
            Lifetime access to your personal simulator &mdash; model any scenario, anytime.
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
      desc: "A short structural diagnostic about how your income works — recurrence, concentration, visibility, and labor dependence. Quick and painless.",
      color: B.teal,
    },
    {
      num: "02",
      time: "Instant",
      title: "See your score",
      hook: "Free. Right now. No strings.",
      desc: "Your Income Stability Score\u2122 out of 100, your stability band, and the single biggest thing holding your income back.",
      color: B.purple,
    },
    {
      num: "03",
      time: "$99",
      title: "Unlock the full diagnostic",
      hook: "Five pages. One clear path forward.",
      desc: "Risk scenarios with exact score drops. Actions with projected impact. Tradeoff analysis. Suggested language for your next move. An interactive simulator. This is not a static document — it is a diagnostic system.",
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
          <div style={{ fontSize: S.fsLabel, fontWeight: 700, letterSpacing: S.lsLabel, textTransform: "uppercase" as const, color: B.teal, marginBottom: 16, opacity: visible ? 1 : 0, transition: "opacity 400ms ease-out" }}>
            How It Works
          </div>
          <h2 style={{
            fontSize: mobile ? S.fsH2.mobile : S.fsH2.desktop, color: B.navy, lineHeight: S.lhHeading,
            letterSpacing: S.lsHeading, fontFamily: DISPLAY_FONT, fontWeight: 400,
            marginBottom: 16,
            opacity: visible ? 1 : 0, transform: visible ? "translateY(0)" : "translateY(16px)",
            transition: "opacity 600ms ease-out, transform 600ms ease-out",
          }}>
            Three steps. No financial data required.
          </h2>
          <p style={{
            fontSize: mobile ? S.fsBody.mobile : S.fsBody.desktop, color: B.muted, lineHeight: S.lhBody, maxWidth: 480,
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
                  fontSize: S.fsLabel, fontWeight: 700, letterSpacing: "0.08em", color: step.color,
                  padding: "4px 10px", borderRadius: 4,
                  backgroundColor: step.color === B.navy ? "rgba(14,26,43,0.06)" : step.color === B.purple ? "rgba(75,63,174,0.08)" : "rgba(31,109,122,0.08)",
                }}>
                  STEP {step.num}
                </div>
                <span style={{ fontSize: S.fsMeta, fontWeight: 600, color: B.light }}>{step.time}</span>
              </div>

              {/* Title */}
              <h3 style={{ fontSize: mobile ? S.fsH3.mobile : S.fsH3.desktop, fontWeight: 600, color: B.navy, marginBottom: 8, letterSpacing: "-0.02em" }}>
                {step.title}
              </h3>

              {/* Hook — the line that sells */}
              <p style={{ fontSize: mobile ? S.fsCard.mobile : S.fsCard.desktop, fontWeight: 600, color: step.color, marginBottom: 12, lineHeight: 1.4 }}>
                {step.hook}
              </p>

              {/* Description */}
              <p style={{ fontSize: mobile ? S.fsCard.mobile : S.fsCard.desktop, color: B.muted, lineHeight: 1.65, margin: 0 }}>
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
    { quote: "I shared the report with my accountant. She said it was more useful than most income documents she sees.", name: "Priya K.", role: "Management Consultant", score: 61, photo: "https://i.pravatar.cc/88?img=25" },
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
              fontSize: S.fsLabel, fontWeight: 600, textTransform: "uppercase",
              letterSpacing: S.lsLabel, color: B.teal, marginBottom: S.labelMb,
            }}
          >
            What customers say
          </div>
          <h2
            style={{
              fontSize: mobile ? S.fsH2.mobile : S.fsH2.desktop,
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
              <p style={{ fontSize: mobile ? S.fsCard.mobile : S.fsCard.desktop, color: "rgba(244,241,234,0.80)", lineHeight: 1.65, margin: "0 0 24px", flex: 1, fontStyle: "italic" }}>
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
                  <div style={{ fontSize: S.fsMeta, fontWeight: 600, color: "#F4F1EA" }}>{t.name}</div>
                  <div style={{ fontSize: S.fsMeta, color: "rgba(244,241,234,0.45)" }}>{t.role} &middot; Score: {t.score}</div>
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
        paddingTop: mobile ? S.sectionY.mobile : S.sectionY.desktop,
        paddingBottom: mobile ? S.sectionY.mobile : S.sectionY.desktop,
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
            fontSize: mobile ? S.fsH2.mobile : S.fsH2.desktop,
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
            fontSize: mobile ? S.fsBody.mobile : S.fsBody.desktop,
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
            <span style={{ fontSize: S.fsMeta, fontWeight: 500, color: "rgba(244,241,234,0.60)", letterSpacing: "0.01em" }}>
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
                fontSize: S.fsLabel, fontWeight: 600, textTransform: "uppercase",
                letterSpacing: S.lsLabel, color: B.teal, marginBottom: 16,
              }}
            >
              Free Score
            </div>
            <div style={{ fontSize: 40, fontWeight: 600, color: B.navy, lineHeight: 1, marginBottom: 12 }}>
              $0
            </div>
            <p style={{ fontSize: mobile ? S.fsCard.mobile : S.fsCard.desktop, color: B.muted, lineHeight: S.lhBody, marginBottom: 24 }}>
              Score &#183; Band &#183; Key insight &#183; What to fix first
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
                fontSize: S.fsCta,
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
                fontSize: S.fsLabel, fontWeight: 600, textTransform: "uppercase",
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
                fontSize: S.fsLabel, fontWeight: 600, textTransform: "uppercase",
                letterSpacing: S.lsLabel, color: B.teal, marginBottom: 16,
              }}
            >
              Complete Assessment
            </div>
            <div style={{ fontSize: 40, fontWeight: 600, color: B.navy, lineHeight: 1, marginBottom: 12 }}>
              $99
            </div>
            <p style={{ fontSize: mobile ? S.fsCard.mobile : S.fsCard.desktop, color: B.muted, lineHeight: S.lhBody, marginBottom: 24 }}>
              Full report &#183; Score simulator &#183; Action plan &#183; Suggested language
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
                fontSize: S.fsCta,
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
            <p style={{ fontSize: S.fsLabel, color: "rgba(244,241,234,0.35)", textAlign: "center", marginTop: 10, marginBottom: 0 }}>
              30-day money-back guarantee.
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
            <p style={{ fontSize: mobile ? S.fsCard.mobile : S.fsCard.desktop, color: "rgba(244,241,234,0.75)", margin: 0, fontWeight: 500 }}>
              If the report doesn&#8217;t reveal at least one insight you didn&#8217;t already know, full refund. No questions.
            </p>
          </div>
          <p style={{ fontSize: S.fsMeta, color: "rgba(244,241,234,0.40)" }}>
            No bank connection &#183; No credit pull &#183; Private by default
          </p>
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
      a: "Your score out of 100, your stability band, and one key insight about what is holding your income back. No payment required.",
    },
    {
      q: "What does the $99 full report include?",
      a: "An interactive score simulator, income runway estimate, risk scenarios with exact score drops, an action plan with projected impact, suggested next-move language, tradeoff analysis, predictive warnings, structural indicators with cross-factor effects, and structural context for your income model.",
    },
    {
      q: "What is your refund policy?",
      a: "Full refund within 30 days — no questions asked. Contact us with your record ID. Refunds processed within 3 business days.",
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
            fontSize: mobile ? S.fsH2.mobile : S.fsH2.desktop,
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
                  <span style={{ fontSize: mobile ? S.fsH3.mobile : S.fsH3.desktop, fontWeight: 500, color: B.navy, paddingRight: 16 }}>
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
                      fontSize: mobile ? S.fsCard.mobile : S.fsCard.desktop, color: B.muted, lineHeight: S.lhBody,
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
              fontSize: S.fsCta, color: B.purple, fontWeight: 500,
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
          fontSize: S.fsMeta,
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
/* MAIN EXPORT                                                         */
/* ================================================================== */
/* ================================================================== */
/* STICKY NAV                                                          */
/* ================================================================== */
function StickyNav() {
  const mobile = useMobile();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <nav style={{
      position: "fixed", top: 0, left: 0, right: 0, zIndex: 100,
      backdropFilter: "blur(16px)",
      backgroundColor: scrolled ? "rgba(14,26,43,0.85)" : "rgba(14,26,43,0.4)",
      borderBottom: scrolled ? "1px solid rgba(244,241,234,0.08)" : "1px solid transparent",
      transition: "background-color 300ms, border-color 300ms",
      padding: mobile ? "10px 20px" : "10px 40px",
    }}>
      <div style={{ maxWidth: S.maxW, margin: "0 auto", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <Image src={logoWhite} alt="RunPayway™" width={120} height={14} style={{ height: "auto" }} />
        </div>
        {!mobile && (
          <div style={{ display: "flex", alignItems: "center", gap: 28 }}>
            {[
              { label: "Methodology", href: "/methodology" },
              { label: "Sample Report", href: "/sample-report" },
              { label: "Pricing", href: "/pricing" },
            ].map(link => (
              <Link key={link.href} href={link.href} style={{ fontSize: S.fsNav, color: "rgba(244,241,234,0.55)", textDecoration: "none", fontWeight: 500, letterSpacing: "-0.01em", transition: "color 200ms" }}
                onMouseEnter={(e) => { if (canHover()) e.currentTarget.style.color = "#F4F1EA"; }}
                onMouseLeave={(e) => { e.currentTarget.style.color = "rgba(244,241,234,0.55)"; }}
              >{link.label}</Link>
            ))}
            <Link href="/pricing" style={{
              fontSize: S.fsMeta, fontWeight: 600, color: B.navy, textDecoration: "none",
              padding: "7px 18px", borderRadius: 6,
              background: "linear-gradient(135deg, #F4F1EA, #E8E5DD)",
              boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
            }}>Get Started</Link>
          </div>
        )}
        {mobile && (
          <Link href="/pricing" style={{
            fontSize: S.fsMeta, fontWeight: 600, color: B.navy, textDecoration: "none",
            padding: "5px 12px", borderRadius: 5, lineHeight: 1,
            background: "linear-gradient(135deg, #F4F1EA, #E8E5DD)",
            display: "inline-flex", alignItems: "center", justifyContent: "center",
          }}>Get Started</Link>
        )}
      </div>
    </nav>
  );
}

/* ================================================================== */
/* SIMULATOR TEASER                                                    */
/* ================================================================== */
function SimulatorTeaserSection() {
  const { ref, visible } = useInView();
  const mobile = useMobile();

  return (
    <section ref={ref} style={{
      background: B.sand,
      paddingTop: mobile ? S.sectionY.mobile : S.sectionY.desktop,
      paddingBottom: mobile ? S.sectionY.mobile : S.sectionY.desktop,
      paddingLeft: mobile ? S.padX.mobile : S.padX.desktop,
      paddingRight: mobile ? S.padX.mobile : S.padX.desktop,
    }}>
      <div style={{
        maxWidth: 520, margin: "0 auto",
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(16px)",
        transition: "opacity 700ms ease-out, transform 700ms ease-out",
      }}>
        <div style={{ textAlign: "center", marginBottom: 28 }}>
          <div style={{ fontSize: S.fsLabel, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase" as const, color: B.purple, marginBottom: 12 }}>Included With Your Report</div>
          <h2 style={{ fontSize: mobile ? S.fsH2.mobile : S.fsH2.desktop, fontFamily: DISPLAY_FONT, fontWeight: 400, color: B.navy, lineHeight: 1.15, letterSpacing: "-0.025em", margin: 0 }}>
            Model scenarios against your actual data.
          </h2>
        </div>
        <SimulatorTeaser />
      </div>
    </section>
  );
}

/* ================================================================== */
/* MID-PAGE CTA                                                        */
/* ================================================================== */
function MidPageCta() {
  const { ref, visible } = useInView();
  const mobile = useMobile();

  return (
    <section ref={ref} style={{
      background: B.navy,
      paddingTop: mobile ? S.sectionY.mobile : S.sectionY.desktop,
      paddingBottom: mobile ? S.sectionY.mobile : S.sectionY.desktop,
      paddingLeft: mobile ? S.padX.mobile : S.padX.desktop,
      paddingRight: mobile ? S.padX.mobile : S.padX.desktop,
      textAlign: "center",
    }}>
      <div style={{
        maxWidth: 540, margin: "0 auto",
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(12px)",
        transition: "opacity 600ms ease-out, transform 600ms ease-out",
      }}>
        <p style={{ fontSize: S.fsLabel, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase" as const, color: B.teal, marginBottom: 16 }}>
          Still here?
        </p>
        <h2 style={{ fontSize: mobile ? S.fsH2.mobile : S.fsH2.desktop, fontFamily: DISPLAY_FONT, fontWeight: 400, color: "#F4F1EA", lineHeight: 1.15, letterSpacing: "-0.025em", marginBottom: 16 }}>
          Your score takes two minutes. The insight lasts longer.
        </h2>
        <p style={{ fontSize: S.fsMeta, color: "rgba(244,241,234,0.50)", marginBottom: 32, lineHeight: 1.6 }}>
          No bank connection. No credit pull. Private by default.
        </p>
        <Link href="/pricing" style={{
          display: "inline-flex", alignItems: "center", justifyContent: "center",
          height: 48, padding: "0 32px", borderRadius: 10,
          background: "linear-gradient(135deg, #F4F1EA, #E8E5DD)",
          color: B.navy, fontSize: S.fsCta, fontWeight: 600, textDecoration: "none",
          boxShadow: "0 4px 20px rgba(0,0,0,0.20)",
        }}>
          Get My Free Score
        </Link>
      </div>
    </section>
  );
}

export default function LandingPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  return (
    <div className="overflow-x-hidden">
      <StickyNav />
      <HeroSection />
      <HeroVideo />
      <BridgeSection />
      <FourFactorsSection />
      <HowItWorksSection />
      <WhatYourReportSection />
      <SimulatorTeaserSection />
      <TestimonialsSection />
      <PricingSection />
      <MidPageCta />
      <FaqSection openFaq={openFaq} setOpenFaq={setOpenFaq} />
      <DisclaimerSection />
    </div>
  );
}
