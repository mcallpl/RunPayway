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
  const score = 48;
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
            backgroundColor: "rgba(146,100,10,0.15)",
            border: "1px solid rgba(146,100,10,0.25)",
            marginBottom: 8,
          }}
        >
          <span style={{ width: 6, height: 6, borderRadius: 999, backgroundColor: "#92640A" }} />
          <span style={{ fontSize: 14, fontWeight: 600, color: "#92640A", letterSpacing: "-0.01em" }}>
            Developing Stability
          </span>
        </div>
        <div style={{ fontSize: 13, color: "rgba(244,241,234,0.50)", fontWeight: 500, marginBottom: 16 }}>
          12 points to Established
        </div>

        {/* Enriched diagnostic preview */}
        <div style={{
          textAlign: "left", maxWidth: 260,
          opacity: showLabel ? 1 : 0,
          transform: showLabel ? "translateY(0)" : "translateY(6px)",
          transition: "opacity 600ms ease-out 200ms, transform 600ms ease-out 200ms",
        }}>
          <p style={{ fontSize: 12, color: "rgba(244,241,234,0.40)", lineHeight: 1.5, margin: "0 0 8px" }}>
            Income can likely absorb small disruptions, but one major source loss would place the structure under pressure.
          </p>
          <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
            <span style={{ fontSize: 11, color: "rgba(244,241,234,0.30)" }}>
              Constraint: income concentration
            </span>
            <span style={{ fontSize: 11, color: "rgba(244,241,234,0.30)" }}>
              Stress test: largest source removed &#8594; projected 21
            </span>
          </div>
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
              <RevealText text="Measure how stable your income structure actually is." visible={visible} baseDelay={150} />
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
              A fixed structural assessment based on how your income is built — not how much you make.
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
              <div
                style={{
                  display: "flex",
                  flexWrap: "wrap",
                  alignItems: "center",
                  gap: mobile ? "4px 0" : "4px 0",
                  marginTop: 20,
                }}
              >
                {["Six questions", "Under two minutes", "No bank connection", "No credit pull"].map((item, i, arr) => (
                  <span
                    key={item}
                    style={{
                      fontSize: 12,
                      color: "rgba(244,241,234,0.35)",
                      letterSpacing: "0.02em",
                    }}
                  >
                    {item}{i < arr.length - 1 && <span style={{ margin: "0 8px", color: "rgba(244,241,234,0.18)" }}>&bull;</span>}
                  </span>
                ))}
              </div>
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
/* Dismissable with smooth curtain-close transition. Resets on leave.   */
/* ================================================================== */
function HeroVideo() {
  const mobile = useMobile();
  const [videoSrc, setVideoSrc] = useState("");
  const [dismissed, setDismissed] = useState(false);
  const [closing, setClosing] = useState(false);
  const [collapsed, setCollapsed] = useState(false);

  useEffect(() => {
    const base = window.location.pathname.startsWith("/RunPayway") ? "/RunPayway" : "";
    setVideoSrc(`${base}/hero-video.mp4`);
  }, []);

  const handleClose = () => {
    setClosing(true);
    // Phase 1: curtain close (600ms)
    setTimeout(() => {
      setCollapsed(true);
      // Phase 2: height collapse (400ms)
      setTimeout(() => {
        setDismissed(true);
      }, 400);
    }, 600);
  };

  if (dismissed) return null;

  return (
    <section
      aria-label="Brand video"
      style={{
        backgroundColor: "#000000",
        lineHeight: 0,
        position: "relative",
        overflow: "hidden",
        maxHeight: collapsed ? 0 : 2000,
        opacity: collapsed ? 0 : 1,
        transition: collapsed ? "max-height 400ms cubic-bezier(0.4, 0, 0.2, 1), opacity 400ms ease" : "none",
      }}
    >
      {/* Close button */}
      <button
        onClick={handleClose}
        aria-label="Close video"
        style={{
          position: "absolute",
          top: mobile ? 12 : 20,
          right: mobile ? 12 : 24,
          zIndex: 10,
          width: mobile ? 36 : 40,
          height: mobile ? 36 : 40,
          borderRadius: "50%",
          border: "1px solid rgba(255,255,255,0.20)",
          backgroundColor: "rgba(0,0,0,0.50)",
          backdropFilter: "blur(8px)",
          WebkitBackdropFilter: "blur(8px)",
          color: "rgba(255,255,255,0.70)",
          fontSize: 18,
          fontWeight: 300,
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          transition: "background-color 200ms ease, border-color 200ms ease, color 200ms ease",
          padding: 0,
          lineHeight: 1,
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.backgroundColor = "rgba(0,0,0,0.70)";
          e.currentTarget.style.borderColor = "rgba(255,255,255,0.35)";
          e.currentTarget.style.color = "rgba(255,255,255,0.95)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.backgroundColor = "rgba(0,0,0,0.50)";
          e.currentTarget.style.borderColor = "rgba(255,255,255,0.20)";
          e.currentTarget.style.color = "rgba(255,255,255,0.70)";
        }}
      >
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
          <line x1="4" y1="4" x2="12" y2="12" />
          <line x1="12" y1="4" x2="4" y2="12" />
        </svg>
      </button>

      {/* Curtain overlays — slide in from top and bottom */}
      {closing && (
        <>
          <div style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: "50%",
            backgroundColor: "#0E1A2B",
            zIndex: 5,
            transform: closing && !collapsed ? "translateY(0)" : "translateY(-100%)",
            animation: "curtainTop 600ms cubic-bezier(0.4, 0, 0.2, 1) forwards",
          }} />
          <div style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            height: "50%",
            backgroundColor: "#0E1A2B",
            zIndex: 5,
            transform: closing && !collapsed ? "translateY(0)" : "translateY(100%)",
            animation: "curtainBottom 600ms cubic-bezier(0.4, 0, 0.2, 1) forwards",
          }} />
          <style>{`
            @keyframes curtainTop {
              from { transform: translateY(-100%); }
              to { transform: translateY(0); }
            }
            @keyframes curtainBottom {
              from { transform: translateY(100%); }
              to { transform: translateY(0); }
            }
          `}</style>
        </>
      )}

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
        background: B.sand,
        paddingTop: mobile ? 48 : 64,
        paddingBottom: mobile ? 48 : 64,
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
      label: "Recurring Income",
      accent: B.teal,
      metric: "0%",
      metricLabel: "recurring",
      question: "Recurring income proportion",
      description: "What percentage of your income renews automatically through retainers, subscriptions, or standing contracts.",
    },
    {
      num: "02",
      label: "Concentration",
      accent: B.purple,
      metric: "55%",
      metricLabel: "one client",
      question: "Income concentration",
      description: "How much of your income depends on a single source. The higher the concentration, the greater the structural risk.",
    },
    {
      num: "03",
      label: "Visibility",
      accent: "#D4940A",
      metric: "<30",
      metricLabel: "days booked",
      question: "Forward income visibility",
      description: "How far into the future your income is already committed — booked, contracted, or otherwise locked in.",
    },
    {
      num: "04",
      label: "Continuity",
      accent: "#DC4A4A",
      metric: "100%",
      metricLabel: "labor",
      question: "Income continuity without active labor",
      description: "How long income continues if you stop working. Measures structural dependence on daily effort.",
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
          <h2 style={{
            fontSize: mobile ? S.fsH2.mobile : S.fsH2.desktop, color: B.navy, lineHeight: 1.12,
            letterSpacing: "-0.025em", fontFamily: DISPLAY_FONT, fontWeight: 400, marginBottom: 16,
            opacity: visible ? 1 : 0, transform: visible ? "translateY(0)" : "translateY(16px)",
            transition: "opacity 600ms ease-out, transform 600ms ease-out",
          }}>
            What this score measures.
          </h2>
          <p style={{ fontSize: mobile ? S.fsBody.mobile : S.fsBody.desktop, color: B.muted, lineHeight: 1.65, opacity: visible ? 1 : 0, transition: "opacity 600ms ease-out 100ms" }}>
            Six questions are used to evaluate four structural dimensions of income stability. Each measures a different aspect of how income holds up under pressure.
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
/* INTERACTIVE SIMULATOR SHOWCASE — tab-driven preview                  */
/* ================================================================== */
function SimulatorShowcase({ visible, mobile }: { visible: boolean; mobile: boolean }) {
  const [activeTab, setActiveTab] = useState<number | null>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleTabEnter = (idx: number) => {
    if (timerRef.current) clearTimeout(timerRef.current);
    setActiveTab(idx);
  };

  const handleTabLeave = () => {
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => setActiveTab(null), 6000);
  };

  const tabs = [
    { label: "Model one change", desc: "Test a single structural adjustment" },
    { label: "See projected impact", desc: "Compare current vs simulated score" },
    { label: "Identify priority", desc: "Find which change moves the score most" },
  ];

  // Screen 0: default (score triptych + timeline)
  const screenDefault = (
    <>
      <div style={{ display: "flex", gap: 3, borderRadius: 8, overflow: "hidden", marginBottom: 16 }}>
        {[
          { label: "CURRENT", value: "48", color: "#F4F1EA" },
          { label: "SIMULATED", value: "62", color: B.teal },
          { label: "IMPACT", value: "+14", color: B.teal },
        ].map(col => (
          <div key={col.label} style={{ flex: 1, background: "rgba(244,241,234,0.04)", padding: mobile ? "10px 8px" : "14px 12px", textAlign: "center" }}>
            <div style={{ fontSize: 13, fontWeight: 700, letterSpacing: "0.10em", color: "rgba(244,241,234,0.30)", marginBottom: 4 }}>{col.label}</div>
            <div style={{ fontSize: mobile ? 24 : 32, fontWeight: 300, color: col.color, fontFamily: DISPLAY_FONT, lineHeight: 1 }}>{col.value}</div>
          </div>
        ))}
      </div>
      <div style={{ display: "flex", height: 4, borderRadius: 2, overflow: "hidden", marginBottom: 16, position: "relative" }}>
        <div style={{ flex: 30, backgroundColor: "rgba(220,74,74,0.25)" }} />
        <div style={{ flex: 20, backgroundColor: "rgba(212,148,10,0.25)" }} />
        <div style={{ flex: 25, backgroundColor: "rgba(59,130,246,0.6)" }} />
        <div style={{ flex: 25, backgroundColor: "rgba(26,122,109,0.25)" }} />
        <div style={{ position: "absolute", top: "50%", left: "55%", transform: "translate(-50%, -50%)", width: 8, height: 8, borderRadius: "50%", backgroundColor: "#fff", border: `2px solid ${B.teal}`, boxShadow: `0 0 6px rgba(26,122,109,0.4)` }} />
      </div>
      <div>
        <div style={{ fontSize: 13, fontWeight: 700, letterSpacing: "0.10em", color: "rgba(75,63,174,0.60)", marginBottom: 8, textTransform: "uppercase" as const }}>INCOME TIMELINE</div>
        <svg viewBox="0 0 300 45" style={{ width: "100%", height: mobile ? 32 : 40 }} preserveAspectRatio="xMidYMid meet">
          <defs>
            <linearGradient id="simGrad2" x1="0" y1="0" x2="1" y2="0"><stop offset="0%" stopColor={B.teal} stopOpacity="0.3" /><stop offset="100%" stopColor={B.teal} stopOpacity="1" /></linearGradient>
            <linearGradient id="simArea2" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor={B.teal} stopOpacity="0.10" /><stop offset="100%" stopColor={B.teal} stopOpacity="0" /></linearGradient>
          </defs>
          <path d="M 10,36 L 80,28 L 180,18 L 290,8" fill="none" stroke="url(#simGrad2)" strokeWidth="2" strokeLinecap="round" />
          <path d="M 10,36 L 80,28 L 180,18 L 290,8 L 290,45 L 10,45 Z" fill="url(#simArea2)" />
          {[[10,36],[80,28],[180,18],[290,8]].map(([cx,cy],j) => <circle key={j} cx={cx} cy={cy} r="3.5" fill={j === 0 ? "#F4F1EA" : B.teal} stroke={B.navy} strokeWidth="1.5" />)}
        </svg>
        <div style={{ display: "flex", justifyContent: "space-between", marginTop: 4 }}>
          {["NOW", "3 MO", "6 MO", "12 MO"].map(l => <span key={l} style={{ fontSize: 13, color: "rgba(244,241,234,0.25)", fontWeight: 600 }}>{l}</span>)}
        </div>
      </div>
    </>
  );

  // Screen 1: sliders view
  const screenSliders = (
    <div>
      {["Recurring Revenue", "Source Concentration", "Forward Visibility", "Earnings Consistency", "Labor Independence"].map((dim, i) => (
        <div key={dim} style={{ marginBottom: i < 4 ? 14 : 0 }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
            <span style={{ fontSize: 13, fontWeight: 600, color: "rgba(244,241,234,0.45)", letterSpacing: "0.04em" }}>{dim}</span>
            <span style={{ fontSize: 13, color: "rgba(244,241,234,0.30)" }}>{[15, 55, 25, 50, 10][i]}%</span>
          </div>
          <div style={{ height: 4, backgroundColor: "rgba(244,241,234,0.06)", borderRadius: 2, position: "relative" }}>
            <div style={{ height: 4, backgroundColor: B.teal, borderRadius: 2, width: `${[15, 55, 25, 50, 10][i]}%`, opacity: 0.7 }} />
            <div style={{ position: "absolute", top: "50%", left: `${[15, 55, 25, 50, 10][i]}%`, transform: "translate(-50%, -50%)", width: 10, height: 10, borderRadius: "50%", backgroundColor: "#fff", border: `2px solid ${B.teal}` }} />
          </div>
        </div>
      ))}
    </div>
  );

  // Screen 2: impact ranking
  const screenImpact = (
    <div>
      <div style={{ fontSize: 13, fontWeight: 700, letterSpacing: "0.10em", color: B.teal, marginBottom: 12, textTransform: "uppercase" as const }}>HIGHEST IMPACT CHANGES</div>
      {[
        { action: "Add recurring revenue", lift: "+8", band: "→ Established" },
        { action: "Reduce concentration", lift: "+5", band: "Developing" },
        { action: "Extend visibility", lift: "+4", band: "Developing" },
      ].map((item, i) => (
        <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 0", borderBottom: i < 2 ? "1px solid rgba(244,241,234,0.06)" : "none" }}>
          <div>
            <div style={{ fontSize: 14, fontWeight: 600, color: "#F4F1EA" }}>{item.action}</div>
            <div style={{ fontSize: 13, color: "rgba(244,241,234,0.30)", marginTop: 2 }}>{item.band}</div>
          </div>
          <span style={{ fontSize: mobile ? 20 : 24, fontWeight: 700, color: B.teal, fontFamily: DISPLAY_FONT }}>{item.lift}</span>
        </div>
      ))}
      <div style={{ marginTop: 14, padding: "10px 14px", borderRadius: 8, backgroundColor: "rgba(26,122,109,0.08)", border: `1px solid rgba(26,122,109,0.15)` }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: B.teal, letterSpacing: "0.06em", marginBottom: 2 }}>COMBINED IMPACT</div>
        <div style={{ fontSize: 14, color: "rgba(244,241,234,0.55)" }}>All three changes: 48 &#8594; 65 (+17 points)</div>
      </div>
    </div>
  );

  const screens = [screenSliders, screenDefault, screenImpact];
  const currentScreen = activeTab !== null ? screens[activeTab] : screenDefault;

  return (
    <div style={{
      opacity: visible ? 1 : 0,
      transform: visible ? "translateY(0)" : "translateY(20px)",
      transition: "opacity 700ms ease-out 300ms, transform 700ms ease-out 300ms",
    }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
        <div style={{ fontSize: S.fsLabel, fontWeight: 700, letterSpacing: S.lsLabel, textTransform: "uppercase" as const, color: B.teal }}>
          Stability Simulator
        </div>
        <div style={{ fontSize: 13, color: "rgba(244,241,234,0.30)", fontWeight: 500 }}>Included with report</div>
      </div>

      {/* Main preview area */}
      <div style={{
        backgroundColor: "rgba(244,241,234,0.03)",
        borderRadius: 16,
        border: "1px solid rgba(244,241,234,0.08)",
        padding: mobile ? "20px 16px" : "28px 24px",
        marginBottom: 12,
        boxShadow: "0 12px 48px rgba(0,0,0,0.25)",
        minHeight: mobile ? 200 : 240,
        transition: "border-color 300ms ease",
        borderColor: activeTab !== null ? "rgba(26,122,109,0.25)" : "rgba(244,241,234,0.08)",
      }}>
        <div style={{ transition: "opacity 250ms ease" }} key={activeTab ?? "default"}>
          {currentScreen}
        </div>
      </div>

      {/* Three interactive tabs */}
      <div style={{ display: "grid", gridTemplateColumns: mobile ? "1fr" : "1fr 1fr 1fr", gap: 8 }}>
        {tabs.map((tab, i) => {
          const isActive = activeTab === i;
          return (
            <div
              key={tab.label}
              onMouseEnter={() => handleTabEnter(i)}
              onMouseLeave={handleTabLeave}
              onClick={() => handleTabEnter(i)}
              style={{
                padding: "14px 16px", borderRadius: 10, cursor: "pointer",
                backgroundColor: isActive ? "rgba(26,122,109,0.12)" : "rgba(244,241,234,0.03)",
                border: `1px solid ${isActive ? "rgba(26,122,109,0.30)" : "rgba(244,241,234,0.06)"}`,
                transition: "all 200ms ease",
              }}
            >
              <div style={{ fontSize: 14, fontWeight: 600, color: isActive ? B.teal : "#F4F1EA", marginBottom: 2, transition: "color 200ms ease" }}>{tab.label}</div>
              <div style={{ fontSize: 13, color: isActive ? "rgba(26,122,109,0.60)" : "rgba(244,241,234,0.35)", lineHeight: 1.4, transition: "color 200ms ease" }}>{tab.desc}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
}


/* ================================================================== */
/* SECTION 4: WHAT YOUR REPORT INCLUDES — "The Inventory"              */
/* ================================================================== */
function WhatYourReportSection() {
  const { ref, visible } = useInView();
  const mobile = useMobile();

  const pages = [
    { num: "01", title: "Your Score", detail: "What your number means and what is holding it down", color: B.purple },
    { num: "02", title: "Income Structure", detail: "How your income is built and where pressure sits", color: B.teal },
    { num: "03", title: "Disruption Analysis", detail: "What happens if a client, contract, or work capacity changes", color: "#9B2C2C" },
    { num: "04", title: "Best Next Move", detail: "The one structural change most likely to improve your score", color: B.purple },
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
        {/* Section header */}
        <div style={{ textAlign: "center", marginBottom: mobile ? 40 : 56 }}>
          <div style={{ fontSize: S.fsLabel, fontWeight: 700, letterSpacing: S.lsLabel, textTransform: "uppercase" as const, color: B.teal, marginBottom: 16, opacity: visible ? 1 : 0, transition: "opacity 400ms ease-out" }}>
            What You Get
          </div>
          <h2 style={{
            fontSize: mobile ? S.fsH2.mobile : S.fsH2.desktop, color: "#F4F1EA", lineHeight: S.lhHeading,
            letterSpacing: S.lsHeading, fontFamily: DISPLAY_FONT, fontWeight: 400, marginBottom: S.h2mb,
            opacity: visible ? 1 : 0, transform: visible ? "translateY(0)" : "translateY(16px)",
            transition: "opacity 600ms ease-out, transform 600ms ease-out",
          }}>
            A structural diagnostic.<br />Based on your actual income pattern.
          </h2>
        </div>

        {/* Two-column layout: report pages left, simulator right */}
        <div style={{
          display: mobile ? "flex" : "grid",
          gridTemplateColumns: "1fr 1.4fr",
          gap: mobile ? 32 : 40,
          flexDirection: "column",
          alignItems: mobile ? "stretch" : undefined,
        }}>
          {/* LEFT — 4 report pages as clean list */}
          <div style={{
            opacity: visible ? 1 : 0,
            transform: visible ? "translateY(0)" : "translateY(16px)",
            transition: "opacity 600ms ease-out 100ms, transform 600ms ease-out 100ms",
          }}>
            <div style={{ fontSize: S.fsLabel, fontWeight: 700, letterSpacing: S.lsLabel, textTransform: "uppercase" as const, color: "rgba(244,241,234,0.30)", marginBottom: 20 }}>
              Your Report
            </div>
            {pages.map((page, i) => (
              <div key={page.num} style={{
                display: "flex", gap: 16, alignItems: "flex-start",
                padding: "16px 0",
                borderBottom: i < 4 ? "1px solid rgba(244,241,234,0.06)" : "none",
              }}>
                <div style={{
                  width: 32, height: 32, borderRadius: 8, flexShrink: 0,
                  backgroundColor: "rgba(244,241,234,0.04)",
                  border: `1px solid rgba(244,241,234,0.08)`,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: 13, fontWeight: 700, color: page.color,
                  position: "relative", overflow: "hidden",
                }}>
                  <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 2, backgroundColor: page.color, opacity: 0.6 }} />
                  {page.num}
                </div>
                <div>
                  <div style={{ fontSize: mobile ? 15 : 16, fontWeight: 600, color: "#F4F1EA", marginBottom: 2 }}>{page.title}</div>
                  <div style={{ fontSize: mobile ? 13 : 14, color: "rgba(244,241,234,0.40)", lineHeight: 1.45 }}>{page.detail}</div>
                </div>
              </div>
            ))}
          </div>

          {/* RIGHT — Interactive Simulator showcase */}
          <SimulatorShowcase visible={visible} mobile={mobile} />
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
      title: "Answer six structural questions",
      hook: "",
      desc: "About how your income is built — sources, concentration, visibility, and continuity.",
      color: B.teal,
    },
    {
      num: "02",
      time: "Instant",
      title: "Receive your score and stability band",
      hook: "",
      desc: "Your Income Stability Score out of 100, your band, and the primary constraint holding it down. Free.",
      color: B.purple,
    },
    {
      num: "03",
      time: "$69",
      title: "Unlock the full report",
      hook: "",
      desc: "Disruption analysis, structural action plan, scenario modeling, and a simulator to test changes before you make them.",
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
            Three steps.
          </h2>
        </div>

        {/* Steps — cards with connecting arrows */}
        <div style={{ display: "grid", gridTemplateColumns: mobile ? "1fr" : "1fr auto 1fr auto 1fr", gap: 0, alignItems: "stretch" }}>
          {steps.map((step, i) => {
            const isLast = i === 2;
            return (
              <div key={step.num} style={{ display: "contents" }}>
                {/* Step card */}
                <div
                  style={{
                    position: "relative",
                    padding: mobile ? "28px 24px" : "32px 28px",
                    borderRadius: 14,
                    backgroundColor: isLast ? B.navy : "#FFFFFF",
                    border: isLast ? "none" : "1px solid rgba(14,26,43,0.06)",
                    boxShadow: isLast ? "0 8px 32px rgba(14,26,43,0.15)" : "0 2px 8px rgba(14,26,43,0.04)",
                    overflow: "hidden",
                    opacity: visible ? 1 : 0,
                    transform: visible ? "translateY(0)" : "translateY(20px)",
                    transition: `opacity 500ms ease-out ${150 + i * 120}ms, transform 500ms ease-out ${150 + i * 120}ms`,
                    display: "flex", flexDirection: "column",
                  }}
                >
                  {/* Accent bar */}
                  <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 3, backgroundColor: step.color, opacity: isLast ? 1 : 0.6 }} />

                  {/* Step number + time */}
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
                    <div style={{
                      width: 36, height: 36, borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center",
                      backgroundColor: isLast ? "rgba(244,241,234,0.08)" : step.color === B.purple ? "rgba(75,63,174,0.08)" : "rgba(26,122,109,0.08)",
                      fontSize: 14, fontWeight: 700, color: isLast ? "#F4F1EA" : step.color,
                    }}>
                      {step.num}
                    </div>
                    <span style={{
                      fontSize: S.fsMeta, fontWeight: 700, letterSpacing: "0.04em",
                      color: isLast ? B.teal : B.light,
                      padding: "3px 10px", borderRadius: 100,
                      backgroundColor: isLast ? "rgba(26,122,109,0.12)" : "rgba(14,26,43,0.04)",
                    }}>
                      {step.time}
                    </span>
                  </div>

                  {/* Title */}
                  <h3 style={{
                    fontSize: mobile ? S.fsH3.mobile : S.fsH3.desktop, fontWeight: 600,
                    color: isLast ? "#F4F1EA" : B.navy,
                    marginBottom: 8, letterSpacing: "-0.02em",
                  }}>
                    {step.title}
                  </h3>

                  {/* Description */}
                  <p style={{
                    fontSize: mobile ? S.fsCard.mobile : S.fsCard.desktop,
                    color: isLast ? "rgba(244,241,234,0.50)" : B.muted,
                    lineHeight: 1.65, margin: 0, flex: 1,
                  }}>
                    {step.desc}
                  </p>
                </div>

                {/* Arrow connector between cards (desktop only) */}
                {!isLast && !mobile && (
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "center", width: 40 }}>
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                      <path d="M4 10H16M16 10L11 5M16 10L11 15" stroke={B.light} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Trust row */}
        <div style={{
          display: "flex", flexWrap: "wrap", justifyContent: "center", gap: mobile ? 16 : 32,
          marginTop: mobile ? 32 : 48,
          opacity: visible ? 1 : 0, transition: "opacity 600ms ease-out 400ms",
        }}>
          {["No bank connection", "No credit pull", "No login required", "Private by default"].map((item) => (
            <span key={item} style={{ fontSize: S.fsMeta, color: B.muted, fontWeight: 500 }}>
              {item}
            </span>
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

  const testimonials = [
    { quote: "The score made it obvious that too much of my income came from one source. The report gave me a clearer next step than my own planning notes had.", name: "Sarah M.", role: "Real Estate Agent", score: 28, photo: "https://i.pravatar.cc/88?img=32" },
    { quote: "The value was not the number alone. It was seeing which structural weakness mattered most and what a single change would do to the score.", name: "James R.", role: "Software Contractor", score: 44, photo: "https://i.pravatar.cc/88?img=12" },
    { quote: "The report helped me separate revenue from stability. I had been treating them like the same thing.", name: "Priya K.", role: "Management Consultant", score: 61, photo: "https://i.pravatar.cc/88?img=25" },
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
            From professionals who took the assessment
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
            What the score revealed.
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
                  alt=""
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
          Know your structure before it breaks
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
          Built for people whose income does not arrive on autopilot.
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
          <div style={{ fontSize: S.fsLabel, fontWeight: 600, letterSpacing: S.lsLabel, textTransform: "uppercase" as const, color: "rgba(244,241,234,0.35)", marginBottom: 12 }}>
            Used by professionals in
          </div>
          <p style={{
            fontSize: S.fsMeta, color: "rgba(244,241,234,0.45)", fontWeight: 500, lineHeight: 1.8,
            maxWidth: 640, margin: "0 auto", textAlign: "center",
          }}>
            Real estate{" "}<span style={{ color: "rgba(244,241,234,0.20)", margin: "0 6px" }}>&bull;</span>{" "}
            Consulting{" "}<span style={{ color: "rgba(244,241,234,0.20)", margin: "0 6px" }}>&bull;</span>{" "}
            Software contracting{" "}<span style={{ color: "rgba(244,241,234,0.20)", margin: "0 6px" }}>&bull;</span>{" "}
            Insurance{" "}<span style={{ color: "rgba(244,241,234,0.20)", margin: "0 6px" }}>&bull;</span>{" "}
            Mortgage{" "}<span style={{ color: "rgba(244,241,234,0.20)", margin: "0 6px" }}>&bull;</span>{" "}
            Creative services{" "}<span style={{ color: "rgba(244,241,234,0.20)", margin: "0 6px" }}>&bull;</span>{" "}
            Solo legal{" "}<span style={{ color: "rgba(244,241,234,0.20)", margin: "0 6px" }}>&bull;</span>{" "}
            Financial advisory
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
            transition: "opacity 600ms ease-out 200ms, transform 600ms ease-out 200ms",
          }}
        >
          {/* CARD 1 — Income Stability Score™ */}
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
              Income Stability Score&#8482;
            </div>
            <div style={{ fontSize: 40, fontWeight: 600, color: B.navy, lineHeight: 1, marginBottom: 12 }}>
              $0
            </div>
            <div style={{ marginBottom: 24 }}>
              {["Score out of 100", "Stability band", "Primary constraint", "One recommended direction"].map((item) => (
                <div key={item} style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
                  <span style={{ color: B.teal, fontSize: 12, lineHeight: 1, flexShrink: 0 }}>&#x2713;</span>
                  <span style={{ fontSize: mobile ? S.fsCard.mobile : S.fsCard.desktop, color: B.muted, lineHeight: 1.4 }}>{item}</span>
                </div>
              ))}
            </div>
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

          {/* CARD 2 — RunPayway™ Diagnostic Report $69 */}
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
            <div
              style={{
                fontSize: S.fsLabel, fontWeight: 600, textTransform: "uppercase",
                letterSpacing: S.lsLabel, color: B.teal, marginBottom: 16,
              }}
            >
              RunPayway&#8482; Diagnostic Report
            </div>
            <div style={{ fontSize: 40, fontWeight: 600, color: B.navy, lineHeight: 1, marginBottom: 12 }}>
              $69
            </div>
            <div style={{ marginBottom: 24 }}>
              {["Full structural breakdown", "Ranked disruption scenarios", "Pressure analysis", "Best first improvement", "30-day action roadmap", "Stability Simulator"].map((item) => (
                <div key={item} style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
                  <span style={{ color: B.purple, fontSize: 12, lineHeight: 1, flexShrink: 0 }}>&#x2713;</span>
                  <span style={{ fontSize: mobile ? S.fsCard.mobile : S.fsCard.desktop, color: B.muted, lineHeight: 1.4 }}>{item}</span>
                </div>
              ))}
            </div>
            <a
              href="https://buy.stripe.com/9B66oz48EaYU2lc4IF2Nq05"
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
              Get Diagnostic Report — $69
            </a>
            <p style={{ fontSize: S.fsLabel, color: "rgba(244,241,234,0.35)", textAlign: "center", marginTop: 10, marginBottom: 0 }}>
              30-day satisfaction guarantee
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
              30-day satisfaction guarantee. If the report does not deliver meaningful new insight into your income structure, request a full refund within 30 days.
            </p>
          </div>
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
      q: "What does this measure?",
      a: "How well your income structure holds up under disruption. The score is derived from six structural inputs — recurring income proportion, source concentration, forward visibility, labor dependence, earnings variability, and continuity without active work.",
    },
    {
      q: "What does it not measure?",
      a: "Total income, net worth, creditworthiness, or investment performance. This is a structural assessment, not a financial evaluation. It measures how your income is built, not how much you earn.",
    },
    {
      q: "Why should I trust this score?",
      a: "The scoring model is deterministic — the same answers always produce the same score. No machine learning, no subjective judgment, no financial account access. The methodology is published and the model is version controlled. Every report includes a verifiable record ID.",
    },
    {
      q: "How is this different from revenue or credit tools?",
      a: "Revenue tools measure how much comes in. Credit tools measure borrowing risk. This measures structural stability — whether your income can absorb disruption without collapsing. Different question, different model.",
    },
    {
      q: "What do I get for free?",
      a: "Your score out of 100, your stability band, and the primary structural constraint holding your score down. No payment required.",
    },
    {
      q: "What does the $69 report include?",
      a: "A 4-page structural diagnostic interpreted using your industry, operating structure, and income model. Includes disruption analysis, ranked risk scenarios, a structural action plan with projected score impact, tradeoff analysis, a 30-day roadmap, and the Stability Simulator.",
    },
    {
      q: "What is your refund policy?",
      a: "30-day satisfaction guarantee. If the report does not deliver meaningful new insight into your income structure, request a full refund. Contact us with your record ID.",
    },
    {
      q: "Is my information confidential?",
      a: "Yes. We never collect bank credentials, credit data, or financial account access. Your assessment data is encrypted, never sold, and you can request deletion at any time.",
    },
    {
      q: "Can I retake the assessment?",
      a: "Yes. Each assessment is independent. Retake after a meaningful structural change — a new retainer signed, a client added, a dependency reduced — to see how your score has moved.",
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
            }}>Check Your Score</Link>
          </div>
        )}
        {mobile && (
          <Link href="/pricing" style={{
            fontSize: S.fsMeta, fontWeight: 600, color: B.navy, textDecoration: "none",
            padding: "5px 12px", borderRadius: 5, lineHeight: 1,
            background: "linear-gradient(135deg, #F4F1EA, #E8E5DD)",
            display: "inline-flex", alignItems: "center", justifyContent: "center",
          }}>Check Your Score</Link>
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
          <div style={{ fontSize: S.fsLabel, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase" as const, color: B.purple, marginBottom: 12 }}>Stability Simulator</div>
          <h2 style={{ fontSize: mobile ? S.fsH2.mobile : S.fsH2.desktop, fontFamily: DISPLAY_FONT, fontWeight: 400, color: B.navy, lineHeight: 1.15, letterSpacing: "-0.025em", margin: 0 }}>
            Test how structural changes may affect your score before you make them.
          </h2>
        </div>
        <SimulatorTeaser />
      </div>
    </section>
  );
}

/* ================================================================== */
/* AUTHORITY BLOCK — How the score works                                */
/* ================================================================== */
function AuthorityBlock() {
  const { ref, visible } = useInView();
  const mobile = useMobile();

  const items = [
    { label: "Fixed structural inputs", desc: "Score is derived from six questions about income structure, not financial data" },
    { label: "Deterministic scoring", desc: "Same answers always produce the same score. No machine learning, no subjective judgment" },
    { label: "Measures stability, not wealth", desc: "The score reflects how income holds up under disruption — not how much you earn" },
    { label: "No financial access required", desc: "No bank connection, no credit pull, no account linking" },
    { label: "Methodology published", desc: "Scoring dimensions, weights, and interpretation logic are available for review" },
  ];

  return (
    <section
      ref={ref}
      aria-label="How the score works"
      style={{
        background: "#FFFFFF",
        paddingTop: mobile ? S.sectionY.mobile : S.sectionY.desktop,
        paddingBottom: mobile ? S.sectionY.mobile : S.sectionY.desktop,
        paddingLeft: mobile ? S.padX.mobile : S.padX.desktop,
        paddingRight: mobile ? S.padX.mobile : S.padX.desktop,
      }}
    >
      <div style={{ maxWidth: 720, margin: "0 auto" }}>
        <div style={{ marginBottom: mobile ? 36 : 48, opacity: visible ? 1 : 0, transform: visible ? "translateY(0)" : "translateY(16px)", transition: "opacity 600ms ease-out, transform 600ms ease-out" }}>
          <div style={{ fontSize: S.fsLabel, fontWeight: 700, letterSpacing: S.lsLabel, textTransform: "uppercase" as const, color: B.teal, marginBottom: 16 }}>
            How the score works
          </div>
          <h2 style={{ fontSize: mobile ? S.fsH2.mobile : S.fsH2.desktop, color: B.navy, lineHeight: 1.12, letterSpacing: "-0.025em", fontFamily: DISPLAY_FONT, fontWeight: 400, marginBottom: 0 }}>
            A fixed model. Not an opinion.
          </h2>
        </div>

        <div style={{ opacity: visible ? 1 : 0, transition: "opacity 600ms ease-out 150ms" }}>
          {items.map((item, i) => (
            <div key={item.label} style={{ display: "flex", gap: 16, alignItems: "flex-start", padding: "16px 0", borderTop: `1px solid ${B.border}` }}>
              <span style={{ color: B.teal, fontSize: 14, lineHeight: "24px", flexShrink: 0 }}>&#x2713;</span>
              <div>
                <div style={{ fontSize: mobile ? 15 : 16, fontWeight: 600, color: B.navy, marginBottom: 2 }}>{item.label}</div>
                <div style={{ fontSize: mobile ? 14 : 15, color: B.muted, lineHeight: 1.55 }}>{item.desc}</div>
              </div>
            </div>
          ))}
          <div style={{ borderTop: `1px solid ${B.border}` }} />
        </div>

        {/* Model badge */}
        <div style={{ display: "flex", flexWrap: "wrap", gap: mobile ? 12 : 24, marginTop: 28, opacity: visible ? 1 : 0, transition: "opacity 600ms ease-out 300ms" }}>
          <span style={{ fontSize: S.fsLabel, color: B.light, fontWeight: 600, letterSpacing: "0.04em" }}>
            Model Version: RP-2.0
          </span>
          <span style={{ fontSize: S.fsLabel, color: B.light, fontWeight: 600, letterSpacing: "0.04em" }}>
            Assessment Type: Structural Income Stability Diagnostic
          </span>
        </div>
      </div>
    </section>
  );
}


/* ================================================================== */
/* TRUST STRIP — Governance credibility before pricing                  */
/* ================================================================== */
function TrustStrip() {
  const mobile = useMobile();

  return (
    <section
      aria-label="Trust indicators"
      style={{
        background: B.sand,
        paddingTop: mobile ? 32 : 40,
        paddingBottom: mobile ? 32 : 40,
        paddingLeft: mobile ? S.padX.mobile : S.padX.desktop,
        paddingRight: mobile ? S.padX.mobile : S.padX.desktop,
      }}
    >
      <div style={{
        display: "flex", flexWrap: "wrap", justifyContent: "center", gap: mobile ? "8px 20px" : "8px 36px",
        maxWidth: S.maxW, margin: "0 auto",
      }}>
        {["Methodology published", "Model version controlled", "Deterministic scoring", "Private by default"].map((item) => (
          <span key={item} style={{ fontSize: S.fsMeta, color: B.muted, fontWeight: 500 }}>{item}</span>
        ))}
      </div>
    </section>
  );
}


/* ================================================================== */
/* WHY NOW — Urgency before pricing                                    */
/* ================================================================== */
function WhyNowSection() {
  const { ref, visible } = useInView();
  const mobile = useMobile();

  return (
    <section
      ref={ref}
      aria-label="Why this matters now"
      style={{
        background: B.navy,
        paddingTop: mobile ? S.sectionY.mobile : S.sectionY.desktop,
        paddingBottom: mobile ? S.sectionY.mobile : S.sectionY.desktop,
        paddingLeft: mobile ? S.padX.mobile : S.padX.desktop,
        paddingRight: mobile ? S.padX.mobile : S.padX.desktop,
        textAlign: "center",
      }}
    >
      <div style={{
        maxWidth: 580, margin: "0 auto",
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(16px)",
        transition: "opacity 700ms ease-out, transform 700ms ease-out",
      }}>
        <div style={{ fontSize: S.fsLabel, fontWeight: 700, letterSpacing: S.lsLabel, textTransform: "uppercase" as const, color: B.teal, marginBottom: 16 }}>
          Why this matters
        </div>
        <h2 style={{ fontSize: mobile ? S.fsH2.mobile : S.fsH2.desktop, fontFamily: DISPLAY_FONT, fontWeight: 400, color: "#F4F1EA", lineHeight: 1.15, letterSpacing: "-0.025em", marginBottom: 20 }}>
          Income looks strongest right before pressure arrives.
        </h2>
        <p style={{ fontSize: mobile ? S.fsBody.mobile : S.fsBody.desktop, color: "rgba(244,241,234,0.55)", lineHeight: 1.65, marginBottom: 24 }}>
          Most income problems are not visible in revenue alone. They surface when one source changes, one month slips, or one contract ends. The score is designed to reveal structural weakness before it becomes financial pain.
        </p>
        <p style={{ fontSize: S.fsMeta, color: "rgba(244,241,234,0.30)", margin: 0, fontStyle: "italic" }}>
          The median small business holds just 27 days of cash buffer.
          <span style={{ fontSize: 12, marginLeft: 6 }}>&mdash; JPMorgan Chase Institute, 2016</span>
        </p>
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
        <h2 style={{ fontSize: mobile ? S.fsH2.mobile : S.fsH2.desktop, fontFamily: DISPLAY_FONT, fontWeight: 400, color: "#F4F1EA", lineHeight: 1.15, letterSpacing: "-0.025em", marginBottom: 16 }}>
          Two minutes. Six questions. One structural score.
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
      <HowItWorksSection />
      <FourFactorsSection />
      <AuthorityBlock />
      <WhatYourReportSection />
      <WhyNowSection />
      <TestimonialsSection />
      <TrustStrip />
      <PricingSection />
      <FaqSection openFaq={openFaq} setOpenFaq={setOpenFaq} />
      <DisclaimerSection />
    </div>
  );
}
