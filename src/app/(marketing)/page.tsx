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
  sand: "#FAF9F7",
  sandDk: "#F4F1EA",
  offWhite: "#FEFDFB",
  muted: "#4B5563",
  light: "#9CA3AF",
  border: "#E6E9EF",
  gradient: "linear-gradient(135deg, #0E1A2B 0%, #1A1540 40%, #4B3FAE 70%, #1F6D7A 100%)",
};

const S = {
  sectionY:     { desktop: 160, mobile: 88 },
  sectionYsm:   { desktop: 120, mobile: 72 },
  transitionY:  { desktop: 72, mobile: 48 },
  disclaimerY:  { desktop: 24, mobile: 16 },
  maxW:         1060,
  padX:         { desktop: 48, mobile: 24 },
  h1mb:         32,
  h2mb:         20,
  subtextMb:    40,
  paraMb:       20,
  labelMb:      14,
  cardPad:      { desktop: 36, mobile: 24 },
  cardRadius:   16,
  panelRadius:  20,
  gridGap:      24,
  gridGapSm:    16,
  ctaH:         56,
  ctaHsm:       48,
  ctaPadX:      32,
  ctaRadius:    14,
  lhHeading:    1.08,
  lhBody:       1.65,
  lhDense:      1.5,
  lsHeading:    "-0.025em",
  lsHero:       "-0.035em",
  lsLabel:      "0.14em",
};

const spaciousY = { desktop: 200, mobile: 100 };

const DISPLAY_FONT = "'Instrument Serif', Georgia, serif";

function RevealText({ text, visible, baseDelay = 0 }: { text: string; visible: boolean; baseDelay?: number }) {
  return (
    <span>
      {text.split("").map((char, i) => (
        <span
          key={i}
          style={{
            display: "inline-block",
            opacity: visible ? 1 : 0,
            transform: visible ? "translateY(0)" : "translateY(12px)",
            transition: `opacity 300ms ease-out ${baseDelay + i * 25}ms, transform 300ms ease-out ${baseDelay + i * 25}ms`,
          }}
        >
          {char === " " ? "\u00A0" : char}
        </span>
      ))}
    </span>
  );
}


/* ================================================================== */
/* FLOATING PARTICLES — Canvas-based background animation              */
/* ================================================================== */
function FloatingParticles() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Array<{ x: number; y: number; vx: number; vy: number; r: number; o: number }>>([]);
  const rafRef = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resize = () => {
      canvas.width = canvas.offsetWidth * (window.devicePixelRatio || 1);
      canvas.height = canvas.offsetHeight * (window.devicePixelRatio || 1);
      ctx.scale(window.devicePixelRatio || 1, window.devicePixelRatio || 1);
    };
    resize();

    const count = 35;
    const w = canvas.offsetWidth;
    const h = canvas.offsetHeight;
    particlesRef.current = Array.from({ length: count }, () => ({
      x: Math.random() * w,
      y: Math.random() * h,
      vx: (Math.random() - 0.5) * 0.4,
      vy: (Math.random() - 0.5) * 0.3,
      r: 1 + Math.random() * 1.5,
      o: 0.08 + Math.random() * 0.17,
    }));

    const animate = () => {
      const cw = canvas.offsetWidth;
      const ch = canvas.offsetHeight;
      ctx.clearRect(0, 0, cw, ch);

      const dpr = window.devicePixelRatio || 1;
      for (let i = 0; i < particlesRef.current.length; i++) {
        const p = particlesRef.current[i];
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < -10) p.x = cw + 10;
        if (p.x > cw + 10) p.x = -10;
        if (p.y < -10) p.y = ch + 10;
        if (p.y > ch + 10) p.y = -10;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255,255,255,${p.o})`;
        ctx.fill();

        // Draw connections between nearby particles
        for (let j = i + 1; j < particlesRef.current.length; j++) {
          const q = particlesRef.current[j];
          const dx = p.x - q.x;
          const dy = p.y - q.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 120) {
            ctx.beginPath();
            ctx.moveTo(p.x * dpr, p.y * dpr);
            ctx.lineTo(q.x * dpr, q.y * dpr);
            ctx.strokeStyle = `rgba(255,255,255,${0.04 * (1 - dist / 120)})`;
            ctx.lineWidth = 0.5 * dpr;
            ctx.stroke();
          }
        }
      }

      rafRef.current = requestAnimationFrame(animate);
    };

    rafRef.current = requestAnimationFrame(animate);
    window.addEventListener("resize", resize);

    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: "absolute",
        inset: 0,
        width: "100%",
        height: "100%",
        pointerEvents: "none",
      }}
    />
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
              fontSize: mobile ? 52 : 64, fontWeight: 700, color: "#F4F1EA",
              lineHeight: 1, letterSpacing: "-0.03em", fontVariantNumeric: "tabular-nums",
              animation: visible ? "scorePulse 3s ease-in-out infinite 2s" : "none",
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
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&display=swap');
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
          animation: "shimmer 8s ease-in-out infinite",
        }}
      />

      <FloatingParticles />

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
          paddingTop: mobile ? 112 : 240,
          paddingBottom: mobile ? 88 : 200,
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

            <h1
              className="font-semibold"
              style={{
                fontSize: mobile ? 34 : 56,
                color: "#F4F1EA",
                lineHeight: S.lhHeading,
                letterSpacing: S.lsHero,
                marginBottom: S.h1mb,
                maxWidth: mobile ? undefined : 560,
                fontFamily: DISPLAY_FONT,
              }}
            >
              <RevealText text="The fixed standard for measuring income structure stability." visible={visible} baseDelay={200} />
            </h1>

            <p
              className="text-[15px] md:text-[17px]"
              style={{
                color: "rgba(244,241,234,0.75)",
                lineHeight: S.lhBody,
                marginBottom: S.paraMb + 8,
                maxWidth: mobile ? undefined : 480,
                opacity: visible ? 1 : 0,
                transform: visible ? "translateY(0)" : "translateY(10px)",
                transition: "opacity 600ms ease-out 200ms, transform 600ms ease-out 200ms",
              }}
            >
              RunPayway&#8482; measures the structure behind your income &#8212; how much repeats, how concentrated it is, how far ahead it is secured, and how much continues without active work.
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
                <span className="cta-label">Get My Income Stability Score&#8482;</span>
                <span className="cta-arrow cta-arrow-navy" />
              </Link>

              <p
                className="text-[13px] md:text-[14px]"
                style={{ color: "rgba(244,241,234,0.50)", marginTop: 14, letterSpacing: "0.01em", textAlign: mobile ? "center" : "left" }}
              >
                Under 2 minutes &#183; Instant report &#183; No bank connection required
              </p>
            </div>
          </div>

          {/* RIGHT SIDE — Animated Score Ring */}
          <div
            style={{
              flexShrink: 0,
              display: "flex",
              justifyContent: "center",
              marginTop: mobile ? 56 : 0,
              opacity: visible ? 1 : 0,
              transition: "opacity 800ms ease-out 400ms",
            }}
          >
            <AnimatedScoreRing visible={visible} mobile={mobile} />
          </div>
        </div>

        {/* Proof strip */}
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "center",
            gap: mobile ? 12 : 24,
            marginTop: mobile ? 48 : 72,
            opacity: visible ? 1 : 0,
            transition: "opacity 600ms ease-out 600ms",
          }}
        >
          {["Same answers, same score", "No AI in scoring", "No bank connection", "Private by default"].map((item, i) => (
            <span
              key={item}
              className="text-[11px] md:text-[12px]"
              style={{
                color: "rgba(244,241,234,0.40)",
                fontWeight: 500,
                letterSpacing: "0.02em",
                display: "flex",
                alignItems: "center",
                gap: 0,
              }}
            >
              {i > 0 && <span style={{ color: "rgba(244,241,234,0.20)", marginRight: 0 }}>&#183;</span>}
              {item}
            </span>
          ))}
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
/* SECTION 2: THE GAP — "The Revelation"                               */
/* ================================================================== */
function TheGapSection() {
  const { ref, visible } = useInView();
  const mobile = useMobile();

  return (
    <section
      ref={ref}
      aria-label="The Gap"
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
            fontFamily: DISPLAY_FONT,
            marginBottom: mobile ? 40 : 56,
            opacity: visible ? 1 : 0,
            transform: visible ? "translateY(0)" : "translateY(16px)",
            transition: "opacity 600ms ease-out, transform 600ms ease-out",
          }}
        >
          What most scores miss
        </h2>

        {/* Two comparison cards */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: mobile ? "1fr" : "1fr 1fr",
            gap: S.gridGap,
            marginBottom: mobile ? 40 : 56,
            opacity: visible ? 1 : 0,
            transform: visible ? "translateY(0)" : "translateY(16px)",
            transition: "opacity 600ms ease-out 150ms, transform 600ms ease-out 150ms",
          }}
        >
          {/* LEFT — Credit Score */}
          <div
            style={{
              background: "#F8F7F4",
              borderRadius: S.cardRadius,
              border: "1px solid rgba(14,26,43,0.06)",
              borderTop: "3px solid #E2E0DB",
              padding: mobile ? S.cardPad.mobile : S.cardPad.desktop,
            }}
          >
            <div
              style={{
                fontSize: 11, fontWeight: 600, textTransform: "uppercase",
                letterSpacing: S.lsLabel, color: B.light, marginBottom: 16,
              }}
            >
              Credit Score
            </div>
            <p style={{ fontSize: 16, color: "rgba(14,26,43,0.55)", lineHeight: S.lhBody }}>
              Measures how reliably you repay debt.
            </p>
          </div>

          {/* RIGHT — Income Stability Score */}
          <div
            style={{
              background: "#FFFFFF",
              borderRadius: S.cardRadius,
              border: "1px solid rgba(75,63,174,0.12)",
              borderTop: `3px solid ${B.purple}`,
              padding: mobile ? S.cardPad.mobile : S.cardPad.desktop,
              boxShadow: "0 8px 32px rgba(75,63,174,0.08)",
            }}
          >
            <div
              style={{
                fontSize: 11, fontWeight: 600, textTransform: "uppercase",
                letterSpacing: S.lsLabel, color: B.teal, marginBottom: 16,
              }}
            >
              Income Stability Score&#8482;
            </div>
            <p style={{ fontSize: 16, color: "rgba(14,26,43,0.75)", lineHeight: S.lhBody, fontWeight: 500 }}>
              Measures how stable your income structure is.
            </p>
          </div>
        </div>

        {/* Below cards text */}
        <div
          style={{
            textAlign: "center",
            maxWidth: 680,
            margin: "0 auto",
            opacity: visible ? 1 : 0,
            transform: visible ? "translateY(0)" : "translateY(12px)",
            transition: "opacity 600ms ease-out 300ms, transform 600ms ease-out 300ms",
          }}
        >
          <p style={{ fontSize: 17, color: "rgba(14,26,43,0.65)", lineHeight: S.lhBody, marginBottom: 20 }}>
            A credit score does not show whether your income could survive the loss of a major source, how much is already lined up ahead, or how much would continue if active work stopped.
          </p>
          <p style={{ fontSize: 19, color: B.navy, fontWeight: 600 }}>
            RunPayway measures that gap.
          </p>
        </div>
      </div>
    </section>
  );
}


/* ================================================================== */
/* SECTION 3: WHO IT'S FOR — "The Recognition"                         */
/* ================================================================== */
function WhoItsForSection() {
  const { ref, visible } = useInView();
  const mobile = useMobile();

  const industries = "Real Estate \u00B7 Finance \u00B7 Insurance \u00B7 Technology \u00B7 Healthcare \u00B7 Legal \u00B7 Consulting \u00B7 Sales \u00B7 Media \u00B7 Construction \u00B7 Retail \u00B7 Hospitality \u00B7 Transportation \u00B7 Manufacturing \u00B7 Education \u00B7 Nonprofit \u00B7 Agriculture \u00B7 Energy";

  return (
    <section
      ref={ref}
      aria-label="Who it is for"
      style={{
        background: B.sand,
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
            fontFamily: DISPLAY_FONT,
            marginBottom: S.h2mb,
            opacity: visible ? 1 : 0,
            transform: visible ? "translateY(0)" : "translateY(16px)",
            transition: "opacity 600ms ease-out, transform 600ms ease-out",
          }}
        >
          Built for income that does not fit simple scoring
        </h2>

        <p
          className="text-center mx-auto"
          style={{
            fontSize: mobile ? 16 : 18,
            color: B.muted,
            lineHeight: S.lhBody,
            maxWidth: 640,
            marginBottom: mobile ? 48 : 64,
            opacity: visible ? 1 : 0,
            transform: visible ? "translateY(0)" : "translateY(12px)",
            transition: "opacity 600ms ease-out 150ms, transform 600ms ease-out 150ms",
          }}
        >
          RunPayway is designed for business owners, self-employed professionals, commission earners, consultants, agency operators, private practitioners, creators, and anyone whose income depends on clients, contracts, or active effort.
        </p>

        {/* Industry marquee */}
        <div
          style={{
            position: "relative",
            overflow: "hidden",
            opacity: visible ? 1 : 0,
            transition: "opacity 800ms ease-out 300ms",
          }}
        >
          {/* Left fade */}
          <div
            style={{
              position: "absolute", left: 0, top: 0, bottom: 0, width: 80,
              background: `linear-gradient(to right, ${B.sand}, transparent)`,
              zIndex: 1, pointerEvents: "none",
            }}
          />
          {/* Right fade */}
          <div
            style={{
              position: "absolute", right: 0, top: 0, bottom: 0, width: 80,
              background: `linear-gradient(to left, ${B.sand}, transparent)`,
              zIndex: 1, pointerEvents: "none",
            }}
          />

          <div style={{ display: "flex", animation: "marquee 40s linear infinite", width: "max-content" }}>
            <span
              style={{
                fontSize: 13, textTransform: "uppercase", letterSpacing: "0.12em",
                color: "rgba(14,26,43,0.25)", fontWeight: 500, whiteSpace: "nowrap",
                paddingRight: 48,
              }}
            >
              {industries}
            </span>
            <span
              style={{
                fontSize: 13, textTransform: "uppercase", letterSpacing: "0.12em",
                color: "rgba(14,26,43,0.25)", fontWeight: 500, whiteSpace: "nowrap",
                paddingRight: 48,
              }}
            >
              {industries}
            </span>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes marquee {
          from { transform: translateX(0); }
          to { transform: translateX(-50%); }
        }
      `}</style>
    </section>
  );
}


/* ================================================================== */
/* SECTION 4: WHAT YOUR REPORT INCLUDES — "The Inventory"              */
/* ================================================================== */
function WhatYourReportSection() {
  const { ref, visible } = useInView();
  const mobile = useMobile();

  const cards = [
    { num: "01", title: "Your Score", desc: "Score, band, classification scale, key insight, resilience grade, confidence, and continuity.", color: B.purple },
    { num: "02", title: "Why This Score", desc: "Five structural drivers with levels, constraint hierarchy, sensitivity ranking, and interaction effects.", color: B.teal },
    { num: "03", title: "What Could Go Wrong", desc: "Stress test, continuity window, structural scenarios, income mix, and peer comparison.", color: B.navy },
    { num: "04", title: "How to Improve", desc: "Projected score improvements, industry-tailored actions, and what not to do.", color: B.purple },
    { num: "05", title: "What to Do Next", desc: "Action list, 90-day checklist, reassessment triggers, benchmarks, and verification.", color: B.teal },
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
            fontFamily: DISPLAY_FONT,
            marginBottom: S.h2mb,
            opacity: visible ? 1 : 0,
            transform: visible ? "translateY(0)" : "translateY(16px)",
            transition: "opacity 600ms ease-out, transform 600ms ease-out",
          }}
        >
          What your report includes
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
          A 5-page structural diagnostic that shows your score, explains what drives it, identifies where the structure is exposed, and shows what to strengthen next.
        </p>

        {/* Stacked document cards */}
        <div
          style={{
            maxWidth: 620,
            margin: "0 auto",
            opacity: visible ? 1 : 0,
            transform: visible ? "translateY(0)" : "translateY(16px)",
            transition: "opacity 600ms ease-out 200ms, transform 600ms ease-out 200ms",
          }}
        >
          {cards.map((card, i) => (
            <div
              key={card.num}
              style={{
                position: "relative",
                zIndex: i + 1,
                marginBottom: i < cards.length - 1 ? -8 : 0,
                background: "#FFFFFF",
                borderRadius: 12,
                borderLeft: `3px solid ${card.color}`,
                border: "1px solid rgba(14,26,43,0.06)",
                borderLeftWidth: 3,
                borderLeftStyle: "solid",
                borderLeftColor: card.color,
                boxShadow: "0 2px 8px rgba(14,26,43,0.04)",
                padding: mobile ? "20px 20px" : "24px 28px",
                display: "flex",
                gap: 16,
                alignItems: "flex-start",
                transition: "transform 200ms ease",
                cursor: "default",
              }}
              onMouseEnter={(e) => {
                if (!canHover()) return;
                e.currentTarget.style.transform = "translateY(-2px)";
                e.currentTarget.style.boxShadow = "0 4px 16px rgba(14,26,43,0.08)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = "0 2px 8px rgba(14,26,43,0.04)";
              }}
            >
              <span style={{ fontSize: 24, fontWeight: 700, color: "#E2E0DB", lineHeight: 1, flexShrink: 0, minWidth: 32 }}>
                {card.num}
              </span>
              <div>
                <div style={{ fontSize: 17, fontWeight: 600, color: B.navy, marginBottom: 4 }}>
                  {card.title}
                </div>
                <p style={{ fontSize: 15, color: B.muted, lineHeight: S.lhBody, margin: 0 }}>
                  {card.desc}
                </p>
              </div>
            </div>
          ))}
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
        paddingTop: mobile ? spaciousY.mobile : spaciousY.desktop,
        paddingBottom: mobile ? spaciousY.mobile : spaciousY.desktop,
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
            fontFamily: DISPLAY_FONT,
            marginBottom: mobile ? 40 : 56,
            opacity: visible ? 1 : 0,
            transform: visible ? "translateY(0)" : "translateY(16px)",
            transition: "opacity 600ms ease-out, transform 600ms ease-out",
          }}
        >
          A sample result
        </h2>

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
              maxWidth: 560,
              width: "100%",
              background: "#FFFFFF",
              borderRadius: 20,
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
              <div style={{ fontSize: 40, fontWeight: 700, color: B.navy, lineHeight: 1, marginBottom: 12 }}>
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
              <div style={{ fontSize: 32, fontWeight: 700, color: "#F4F1EA" }}>{demoScore}</div>
              <div style={{ fontSize: 13, color: demoBandColor, fontWeight: 600, marginTop: 4 }}>{demoBand}</div>
            </div>
          </div>
        </div>

        {/* Below card text */}
        <p
          className="text-center mx-auto"
          style={{
            fontSize: 14, color: "rgba(244,241,234,0.50)", lineHeight: S.lhBody,
            maxWidth: 560, marginTop: 32,
            opacity: visible ? 1 : 0,
            transition: "opacity 600ms ease-out 500ms",
          }}
        >
          Every report includes your score, structural drivers, constraint hierarchy, stress scenarios, projected improvements, industry-tailored actions, and reassessment triggers.
        </p>
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
    { num: "1", title: "Answer six questions", desc: "About how your income is structured today." },
    { num: "2", title: "The model runs", desc: "Model RP-2.0 calculates your result from fixed scoring rules. No AI. Same answers always produce the same score." },
    { num: "3", title: "Get your full report", desc: "Score, structural breakdown, stress scenarios, improvement paths, and reassessment triggers. Delivered instantly." },
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
      <div className="mx-auto" style={{ maxWidth: S.maxW }}>
        <h2
          className="font-semibold text-center"
          style={{
            fontSize: mobile ? 32 : 48,
            color: B.navy,
            lineHeight: S.lhHeading,
            letterSpacing: S.lsHeading,
            fontFamily: DISPLAY_FONT,
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
                  fontWeight: 700,
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
            fontFamily: DISPLAY_FONT,
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
                  fontSize: 28, fontWeight: 700,
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
        paddingTop: mobile ? spaciousY.mobile : spaciousY.desktop,
        paddingBottom: mobile ? spaciousY.mobile : spaciousY.desktop,
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
            fontFamily: DISPLAY_FONT,
            marginBottom: S.h2mb,
            opacity: visible ? 1 : 0,
            transform: visible ? "translateY(0)" : "translateY(16px)",
            transition: "opacity 600ms ease-out, transform 600ms ease-out",
          }}
        >
          Measure the structure behind your income
        </h2>

        <p
          className="text-center mx-auto"
          style={{
            fontSize: mobile ? 16 : 18,
            color: "rgba(244,241,234,0.80)",
            lineHeight: S.lhBody,
            maxWidth: 560,
            marginBottom: mobile ? 40 : 56,
            opacity: visible ? 1 : 0,
            transform: visible ? "translateY(0)" : "translateY(12px)",
            transition: "opacity 600ms ease-out 100ms, transform 600ms ease-out 100ms",
          }}
        >
          See how stable your income structure is, where it is exposed, and what would strengthen it.
        </p>

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
          {/* CARD 1 — Single Assessment */}
          <div
            style={{
              background: "#FFFFFF",
              borderRadius: 20,
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
              Single Assessment
            </div>
            <div style={{ fontSize: 40, fontWeight: 700, color: B.navy, lineHeight: 1, marginBottom: 12 }}>
              $39
            </div>
            <p style={{ fontSize: 14, color: B.muted, lineHeight: S.lhBody, marginBottom: 24 }}>
              Full 5-page diagnostic &#183; Instant delivery &#183; One-time
            </p>
            <a
              href="https://buy.stripe.com/14A28j48E2socZQa2Z2Nq02"
              className="inline-flex items-center justify-center font-semibold"
              style={{
                width: "100%",
                height: S.ctaH,
                borderRadius: S.ctaRadius,
                backgroundColor: B.navy,
                color: "#FFFFFF",
                fontSize: 15,
                textDecoration: "none",
                transition: "background-color 180ms ease, transform 180ms ease",
                boxShadow: "0 4px 12px rgba(14,26,43,0.20)",
              }}
              onMouseEnter={(e) => {
                if (!canHover()) return;
                e.currentTarget.style.backgroundColor = "#1E293B";
                e.currentTarget.style.transform = "translateY(-1px)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = B.navy;
                e.currentTarget.style.transform = "translateY(0)";
              }}
            >
              Get My Score
            </a>
          </div>

          {/* CARD 2 — Annual Monitoring */}
          <div
            style={{
              background: "#FFFFFF",
              borderRadius: 20,
              padding: mobile ? S.cardPad.mobile : S.cardPad.desktop,
              border: "1px solid rgba(75,63,174,0.20)",
              boxShadow: "0 20px 56px rgba(75,63,174,0.18), 0 8px 24px rgba(0,0,0,0.12), inset 0 1px 0 rgba(255,255,255,0.8), inset 0 0 0 1px rgba(75,63,174,0.06)",
              position: "relative",
              transition: "transform 300ms ease, box-shadow 300ms ease",
            }}
            onMouseEnter={(e) => { if (!canHover()) return; e.currentTarget.style.transform = "translateY(-4px)"; e.currentTarget.style.boxShadow = "0 28px 72px rgba(75,63,174,0.22), 0 12px 32px rgba(0,0,0,0.15), inset 0 1px 0 rgba(255,255,255,0.8), inset 0 0 0 1px rgba(75,63,174,0.08)"; }}
            onMouseLeave={(e) => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "0 20px 56px rgba(75,63,174,0.18), 0 8px 24px rgba(0,0,0,0.12), inset 0 1px 0 rgba(255,255,255,0.8), inset 0 0 0 1px rgba(75,63,174,0.06)"; }}
          >
            {/* RECOMMENDED badge */}
            <div
              style={{
                display: "inline-block",
                fontSize: 9, fontWeight: 700, textTransform: "uppercase",
                letterSpacing: "0.08em",
                backgroundColor: B.purple,
                color: "#FFFFFF",
                padding: "3px 10px",
                borderRadius: 100,
                marginBottom: 12,
              }}
            >
              Recommended
            </div>

            <div
              style={{
                fontSize: 11, fontWeight: 600, textTransform: "uppercase",
                letterSpacing: S.lsLabel, color: B.teal, marginBottom: 16,
              }}
            >
              Annual Monitoring
            </div>
            <div style={{ fontSize: 40, fontWeight: 700, color: B.navy, lineHeight: 1, marginBottom: 12 }}>
              $99
            </div>
            <p style={{ fontSize: 14, color: B.muted, lineHeight: S.lhBody, marginBottom: 24 }}>
              Three assessments over 12 months &#183; Track structural changes
            </p>
            <a
              href="https://buy.stripe.com/aFacMXdJe2so7Fw7UR2Nq03"
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
              Get Annual Monitoring
            </a>
          </div>
        </div>

        {/* Below cards */}
        <div
          style={{
            textAlign: "center",
            marginTop: 32,
            opacity: visible ? 1 : 0,
            transition: "opacity 600ms ease-out 400ms",
          }}
        >
          <p style={{ fontSize: 14, color: "rgba(244,241,234,0.50)", marginBottom: 4 }}>
            No bank connection required &#183; No credit pull &#183; Private by default
          </p>
          <p style={{ fontSize: 14, color: "rgba(244,241,234,0.40)" }}>
            Average completion: under 2 minutes
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
      }}
    >
      <div className="mx-auto" style={{ maxWidth: 720 }}>
        <h2
          className="font-semibold text-center"
          style={{
            fontSize: mobile ? 32 : 48,
            color: B.navy,
            lineHeight: S.lhHeading,
            letterSpacing: S.lsHeading,
            fontFamily: DISPLAY_FONT,
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
            fontFamily: DISPLAY_FONT,
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
      q: "What does the Income Stability Score\u2122 measure?",
      a: "It measures how stable your income structure is based on recurring income, concentration, source diversity, forward visibility, variability, and continuity without active work.",
    },
    {
      q: "How long does the assessment take?",
      a: "Most people complete it in under two minutes.",
    },
    {
      q: "What is included in the report?",
      a: "A 5-page report covering your score and classification, structural drivers and constraint hierarchy, stress scenarios and peer comparison, projected improvements with industry-tailored actions, and a 90-day action checklist with reassessment triggers.",
    },
    {
      q: "Can I retake the assessment?",
      a: "Yes. Retake after a meaningful structural change to see how your score has moved.",
    },
    {
      q: "How is my data handled?",
      a: "No bank connection is required. Your data is private by default and handled according to our privacy and security policies.",
    },
    {
      q: "Do I need exact financial records?",
      a: "No. The assessment works from informed estimates. More accurate inputs produce more precise results, but exact bookkeeping is not required.",
    },
  ];

  return (
    <section
      ref={ref}
      aria-label="FAQ"
      style={{
        background: B.offWhite,
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
            fontFamily: DISPLAY_FONT,
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
            Get My Income Stability Score&#8482; &#8594;
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
        paddingTop: 32,
        paddingBottom: 32,
        paddingLeft: mobile ? S.padX.mobile : S.padX.desktop,
        paddingRight: mobile ? S.padX.mobile : S.padX.desktop,
      }}
    >
      <p
        className="mx-auto text-center"
        style={{
          fontSize: 14,
          color: "rgba(244,241,234,0.45)",
          lineHeight: S.lhBody,
          maxWidth: 720,
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
  const [trustOpen, setTrustOpen] = useState<number | null>(null);

  return (
    <div className="overflow-x-hidden">
      <HeroSection />
      <TheGapSection />
      <WhoItsForSection />
      <SocialProof />
      <WhatYourReportSection />
      <SampleResultSection />
      <HowItWorksSection />
      <WhatItMeasuresSection />
      <PricingSection />
      <TrustSection trustOpen={trustOpen} setTrustOpen={setTrustOpen} />
      <ClassificationSection />
      <FaqSection openFaq={openFaq} setOpenFaq={setOpenFaq} />
      <DisclaimerSection />
    </div>
  );
}
