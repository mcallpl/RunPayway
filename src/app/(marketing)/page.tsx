"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import logoWhite from "../../../public/runpayway-logo-white.png";
import logoBlue from "../../../public/runpayway-logo-blue.png";

/* ================================================================== */
/* UTILITIES                                                           */
/* ================================================================== */

const canHover = () =>
  typeof window !== "undefined" && window.matchMedia("(hover: hover)").matches;

function useInView(threshold = 0) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    if (rect.top < window.innerHeight + 50 && rect.bottom > 0) { setVisible(true); return; }
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setVisible(true); obs.disconnect(); } },
      { threshold },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);
  return { ref, visible };
}

function useMobile(bp = 768) {
  const [m, setM] = useState(false);
  useEffect(() => {
    const c = () => setM(window.innerWidth <= bp);
    c();
    window.addEventListener("resize", c);
    return () => window.removeEventListener("resize", c);
  }, [bp]);
  return m;
}

function useAnimatedCounter(target: number, trigger: boolean, duration = 1500) {
  const [value, setValue] = useState(0);
  const animated = useRef(false);
  const rafId = useRef(0);
  useEffect(() => {
    if (!trigger || animated.current) return;
    animated.current = true;
    const start = performance.now();
    const step = (now: number) => {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setValue(Math.round(eased * target));
      if (progress < 1) rafId.current = requestAnimationFrame(step);
    };
    rafId.current = requestAnimationFrame(step);
    return () => cancelAnimationFrame(rafId.current);
  }, [trigger, target, duration]);
  return value;
}

/* ================================================================== */
/* DESIGN TOKENS                                                       */
/* ================================================================== */

const C = {
  navy: "#0E1A2B",
  purple: "#4B3FAE",
  teal: "#1F6D7A",
  sand: "#F7F5F0",
  sandAlt: "#FEFEFE",
  white: "#FFFFFF",
  muted: "rgba(14,26,43,0.55)",
  light: "rgba(14,26,43,0.38)",
  border: "rgba(14,26,43,0.06)",
  heroGradient: "linear-gradient(145deg, #0E1A2B 0%, #161430 35%, #3D2F9C 65%, #1F6D7A 100%)",
};

const sp = (n: number) => n * 8;

const T = {
  h1:    { desktop: { fontSize: 44, fontWeight: 600, lineHeight: 1.08 }, mobile: { fontSize: 28, fontWeight: 600, lineHeight: 1.12 } },
  h2:    { desktop: { fontSize: 24, fontWeight: 600, lineHeight: 1.2 }, mobile: { fontSize: 20, fontWeight: 600, lineHeight: 1.2 } },
  h3:    { desktop: { fontSize: 17, fontWeight: 600, lineHeight: 1.3 }, mobile: { fontSize: 16, fontWeight: 600, lineHeight: 1.3 } },
  bodyLg:{ desktop: { fontSize: 17, fontWeight: 400, lineHeight: 1.55 }, mobile: { fontSize: 16, fontWeight: 400, lineHeight: 1.55 } },
  body:  { desktop: { fontSize: 15, fontWeight: 400, lineHeight: 1.65 }, mobile: { fontSize: 15, fontWeight: 400, lineHeight: 1.6 } },
  label: { fontSize: 11, fontWeight: 700, lineHeight: 1.4, letterSpacing: "0.10em", textTransform: "uppercase" as const },
  meta:  { fontSize: 13, fontWeight: 400, lineHeight: 1.5 },
  score: { desktop: { fontSize: 56, fontWeight: 500, lineHeight: 1 }, mobile: { fontSize: 42, fontWeight: 500, lineHeight: 1 } },
  price: { desktop: { fontSize: 40, fontWeight: 500, lineHeight: 1 }, mobile: { fontSize: 34, fontWeight: 500, lineHeight: 1 } },
  nav:   { fontSize: 15, fontWeight: 400 },
  cta:   { fontSize: 15, fontWeight: 600 },
};

const maxW = 1200;
const readW = 740;
const padX = { desktop: 40, mobile: 20 };
const sectionGap = { desktop: sp(10), mobile: sp(8) };

const h2 = (m: boolean) => m ? T.h2.mobile : T.h2.desktop;
const h3 = (m: boolean) => m ? T.h3.mobile : T.h3.desktop;
const bodyLg = (m: boolean) => m ? T.bodyLg.mobile : T.bodyLg.desktop;
const body = (m: boolean) => m ? T.body.mobile : T.body.desktop;
const score = (m: boolean) => m ? T.score.mobile : T.score.desktop;
const price = (m: boolean) => m ? T.price.mobile : T.price.desktop;
const px = (m: boolean) => m ? padX.mobile : padX.desktop;
const secY = (m: boolean) => m ? sectionGap.mobile : sectionGap.desktop;

const cardStyle = {
  borderRadius: 14,
  border: `1px solid ${C.border}`,
  backgroundColor: C.sandAlt,
};

const fadeIn = (visible: boolean, delay = 0) => ({
  opacity: visible ? 1 : 0,
  transform: visible ? "translateY(0)" : "translateY(12px)",
  transition: `opacity 400ms ease-out ${delay}ms, transform 400ms ease-out ${delay}ms`,
});


/* ================================================================== */
/* STICKY NAV                                                          */
/* ================================================================== */
function StickyNav() {
  const m = useMobile();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const stripeUrl = process.env.NEXT_PUBLIC_STRIPE_CHECKOUT_URL || "https://buy.stripe.com/9B66oz48EaYU2lc4IF2Nq05";

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 400);
    window.addEventListener("scroll", fn, { passive: true });
    return () => window.removeEventListener("scroll", fn);
  }, []);

  // Past hero = warm nav. In hero = dark transparent nav.
  const warm = scrolled;
  const navBg = warm ? "rgba(247,245,240,0.97)" : "rgba(14,26,43,0.4)";
  const navBorder = warm ? "1px solid rgba(14,26,43,0.06)" : "1px solid transparent";
  const linkColor = warm ? "rgba(14,26,43,0.55)" : "rgba(244,241,234,0.55)";
  const linkHover = warm ? C.navy : "#F4F1EA";
  const ctaBg = warm ? C.navy : C.sand;
  const ctaColor = warm ? "#F7F5F0" : C.navy;

  return (
    <>
    <nav style={{
      position: "fixed", top: 0, left: 0, right: 0, zIndex: 100,
      backdropFilter: "blur(16px)", WebkitBackdropFilter: "blur(16px)",
      backgroundColor: navBg,
      borderBottom: navBorder,
      transition: "background-color 300ms, border-color 300ms",
      height: m ? 56 : 64, display: "flex", alignItems: "center",
      padding: `0 ${px(m)}px`,
    }}>
      <div style={{ maxWidth: maxW, margin: "0 auto", width: "100%", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <Link href="/" style={{ display: "inline-flex", alignItems: "center" }}>
          <Image src={warm ? logoBlue : logoWhite} alt="RunPayway" width={120} height={14} style={{ height: "auto", transition: "opacity 200ms" }} />
        </Link>
        {!m && (
          <div style={{ display: "flex", alignItems: "center", gap: sp(3) }}>
            {[
              { label: "Command Center", href: "/dashboard" },
              { label: "Sample Report", href: "/sample-report" },
              { label: "Pricing", href: "/pricing" },
            ].map(link => (
              <Link key={link.href} href={link.href} style={{ ...T.nav, color: linkColor, textDecoration: "none", transition: "color 200ms" }}
                onMouseEnter={(e) => { if (canHover()) e.currentTarget.style.color = linkHover; }}
                onMouseLeave={(e) => { e.currentTarget.style.color = linkColor; }}
              >{link.label}</Link>
            ))}
            <a href={stripeUrl} style={{
              ...T.cta, color: ctaColor, textDecoration: "none",
              padding: `${sp(1)}px ${sp(2.5)}px`, borderRadius: 8,
              backgroundColor: ctaBg, transition: "background-color 300ms, color 300ms",
            }}>Get Diagnostic — $69</a>
          </div>
        )}
        {m && (
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <a href={stripeUrl} style={{
              ...T.cta, fontSize: 13, color: ctaColor, textDecoration: "none",
              padding: `6px ${sp(2)}px`, borderRadius: 8,
              backgroundColor: ctaBg, transition: "background-color 300ms, color 300ms",
            }}>$69</a>
            <button onClick={() => setMobileOpen(!mobileOpen)} style={{ background: "none", border: "none", cursor: "pointer", padding: 4, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke={warm ? C.navy : "#F4F1EA"} strokeWidth="1.5" strokeLinecap="round" style={{ transition: "stroke 300ms" }}>
                {mobileOpen ? <><line x1="4" y1="4" x2="16" y2="16" /><line x1="16" y1="4" x2="4" y2="16" /></> : <><line x1="3" y1="6" x2="17" y2="6" /><line x1="3" y1="10" x2="17" y2="10" /><line x1="3" y1="14" x2="17" y2="14" /></>}
              </svg>
            </button>
          </div>
        )}
      </div>
    </nav>

    {/* Mobile menu overlay */}
    {m && mobileOpen && (
      <div style={{ position: "fixed", top: 56, left: 0, right: 0, bottom: 0, zIndex: 99, backgroundColor: "rgba(247,245,240,0.98)", backdropFilter: "blur(12px)", padding: `${sp(4)}px ${px(m)}px` }}>
        <div style={{ display: "flex", flexDirection: "column", gap: sp(1) }}>
          {[
            { label: "Command Center", href: "/dashboard" },
            { label: "Sample Report", href: "/sample-report" },
            { label: "Pricing", href: "/pricing" },
            { label: "How It Works", href: "/how-it-works" },
            { label: "Methodology", href: "/methodology" },
          ].map(link => (
            <Link key={link.href} href={link.href} onClick={() => setMobileOpen(false)}
              style={{ fontSize: 17, fontWeight: 500, color: C.navy, textDecoration: "none", padding: `${sp(2)}px 0`, borderBottom: `1px solid ${C.border}` }}>
              {link.label}
            </Link>
          ))}
        </div>
        <a href={stripeUrl} style={{
          display: "flex", alignItems: "center", justifyContent: "center",
          width: "100%", height: sp(6.5), borderRadius: 10,
          backgroundColor: C.navy, color: "#F7F5F0", ...T.cta,
          textDecoration: "none", marginTop: sp(4),
        }}>
          Get Your Full Diagnostic — $69
        </a>
        <Link href="/diagnostic-portal" onClick={() => setMobileOpen(false)}
          style={{ display: "block", textAlign: "center", ...T.meta, color: C.muted, textDecoration: "underline", textUnderlineOffset: 3, marginTop: sp(2) }}>
          Or start free
        </Link>
      </div>
    )}
    </>
  );
}


/* ================================================================== */
/* HERO                                                                */
/* ================================================================== */
function HeroSection() {
  const { ref, visible } = useInView();
  const m = useMobile();
  const animatedScore = useAnimatedCounter(72, visible, 1500);
  const [showLabel, setShowLabel] = useState(false);

  useEffect(() => {
    if (!visible) return;
    const t = setTimeout(() => setShowLabel(true), 1600);
    return () => clearTimeout(t);
  }, [visible]);

  const ringSize = m ? 180 : 240;
  const radius = 70;
  const strokeWidth = 5;
  const circumference = 2 * Math.PI * radius;
  const targetOffset = (1 - 72 / 100) * circumference;

  return (
    <section ref={ref} aria-label="Hero" style={{ background: C.heroGradient }}>
      <div style={{
        maxWidth: maxW, margin: "0 auto",
        paddingTop: m ? sp(14) : sp(18),
        paddingBottom: m ? sp(10) : sp(14),
        paddingLeft: px(m), paddingRight: px(m),
      }}>
        <div style={{
          display: m ? "block" : "flex",
          alignItems: "center", justifyContent: "space-between", gap: sp(8),
        }}>
          {/* Left text */}
          <div style={{ maxWidth: 620, textAlign: m ? "center" : "left" }}>
            <div style={{
              ...fadeIn(visible),
              ...T.label, color: C.teal, marginBottom: m ? sp(2.5) : sp(3),
            }}>
              Income Stability Score&#8482;
            </div>

            <h1 style={{
              ...fadeIn(visible, 100),
              fontSize: m ? 28 : 44, fontWeight: 500, lineHeight: 1.1,
              color: "#F7F5F0", letterSpacing: "-0.02em",
              marginBottom: m ? sp(3) : sp(4),
            }}>
              Income looks strongest<br />right before pressure arrives.
            </h1>

            <p style={{
              ...fadeIn(visible, 200),
              fontSize: m ? 16 : 17, fontWeight: 400, lineHeight: 1.55,
              color: "rgba(244,241,234,0.50)",
              marginBottom: m ? sp(4) : sp(5),
              maxWidth: m ? undefined : 480,
            }}>
              The Income Stability Score reveals the structural weaknesses in your income — before a disruption makes them obvious.
            </p>

            <div style={fadeIn(visible, 300)}>
              <a
                href={process.env.NEXT_PUBLIC_STRIPE_CHECKOUT_URL || "https://buy.stripe.com/9B66oz48EaYU2lc4IF2Nq05"}
                style={{
                  display: "inline-flex", alignItems: "center", justifyContent: "center",
                  height: sp(6.5), width: m ? "100%" : "auto",
                  paddingLeft: sp(4), paddingRight: sp(4),
                  borderRadius: 10,
                  backgroundColor: C.sand,
                  color: C.navy, ...T.cta,
                  textDecoration: "none",
                  transition: "opacity 200ms ease",
                }}
                onMouseEnter={(e) => { if (canHover()) e.currentTarget.style.opacity = "0.9"; }}
                onMouseLeave={(e) => { e.currentTarget.style.opacity = "1"; }}
              >
                Get Your Full Diagnostic — $69 &#8594;
              </a>

              <div style={{ marginTop: sp(2), display: "flex", alignItems: m ? "center" : "flex-start", gap: sp(2), flexDirection: m ? "column" : "row" }}>
                <Link href="/diagnostic-portal" style={{ ...T.meta, color: "rgba(244,241,234,0.50)", textDecoration: "underline", textUnderlineOffset: 3 }}>
                  Or start free
                </Link>
                <span style={{ ...T.meta, color: "rgba(244,241,234,0.25)" }}>&bull;</span>
                <span style={{ ...T.meta, color: "rgba(244,241,234,0.38)" }}>6 questions &bull; 90 seconds</span>
              </div>
              <button onClick={() => openVideoModal?.()} style={{ marginTop: sp(2), background: "none", border: "none", cursor: "pointer", display: "inline-flex", alignItems: "center", gap: 8, padding: 0 }}>
                <div style={{ width: 28, height: 28, borderRadius: "50%", border: "1px solid rgba(244,241,234,0.25)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <svg width="10" height="10" viewBox="0 0 10 10" fill="rgba(244,241,234,0.60)"><polygon points="2,0 10,5 2,10" /></svg>
                </div>
                <span style={{ fontSize: 13, color: "rgba(244,241,234,0.45)", fontWeight: 500 }}>Watch the film</span>
              </button>
            </div>
          </div>

          {/* Right score ring */}
          <div style={{
            flexShrink: 0, display: "flex", flexDirection: "column", alignItems: "center",
            marginTop: m ? sp(6) : 0,
            ...fadeIn(visible, 300),
          }}>
            <div style={{ position: "relative", width: ringSize, height: ringSize }}>
              <svg width={ringSize} height={ringSize} viewBox="0 0 160 160" style={{ transform: "rotate(-90deg)" }}>
                <circle cx="80" cy="80" r={radius} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth={strokeWidth} />
                <circle cx="80" cy="80" r={radius} fill="none" stroke="url(#scoreGrad)" strokeWidth={strokeWidth}
                  strokeLinecap="round" strokeDasharray={circumference}
                  strokeDashoffset={visible ? targetOffset : circumference}
                  style={{ transition: "stroke-dashoffset 2s cubic-bezier(0.22, 1, 0.36, 1)" }}
                />
                <defs>
                  <linearGradient id="scoreGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor={C.teal} /><stop offset="50%" stopColor={C.purple} /><stop offset="100%" stopColor="#7B6FE0" />
                  </linearGradient>
                </defs>
              </svg>
              <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <span style={{ ...score(m), color: "#F7F5F0", letterSpacing: "-0.03em", fontVariantNumeric: "tabular-nums" }}>
                  {animatedScore}
                </span>
              </div>
            </div>

            <div style={{
              textAlign: "center", marginTop: sp(2),
              opacity: showLabel ? 1 : 0, transform: showLabel ? "translateY(0)" : "translateY(6px)",
              transition: "opacity 400ms ease-out, transform 400ms ease-out",
            }}>
              <div style={{
                display: "inline-flex", alignItems: "center", gap: sp(1),
                padding: `${sp(0.5)}px ${sp(1.5)}px`, borderRadius: 10,
                backgroundColor: "rgba(31,109,122,0.15)", border: "1px solid rgba(31,109,122,0.25)",
                marginBottom: sp(1),
              }}>
                <span style={{ width: 5, height: 5, borderRadius: 999, backgroundColor: C.teal }} />
                <span style={{ ...T.label, color: C.teal }}>Established</span>
              </div>
              <div style={{ ...T.meta, color: "rgba(244,241,234,0.40)", marginBottom: sp(1.5) }}>8 points to High Stability</div>
              <div style={{ ...T.meta, color: "rgba(244,241,234,0.35)" }}>Fragility: Resilient</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* Gradient accent line — transition from hero dark to warm page */
function HeroAccent() {
  return <div style={{ height: 3, background: "linear-gradient(90deg, #4B3FAE 0%, #1F6D7A 50%, rgba(31,109,122,0) 100%)" }} />;
}

/* ================================================================== */
/* HERO VIDEO                                                          */
/* ================================================================== */
function VideoModal() {
  const m = useMobile();
  const [open, setOpen] = useState(false);
  const [videoSrc, setVideoSrc] = useState("");

  useEffect(() => {
    const base = window.location.pathname.startsWith("/RunPayway") ? "/RunPayway" : "";
    setVideoSrc(`${base}/rp-video.mp4`);
  }, []);

  if (!open) return null;

  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 9999, backgroundColor: "rgba(0,0,0,0.90)", display: "flex", alignItems: "center", justifyContent: "center", padding: m ? 16 : 40 }}
      onClick={() => setOpen(false)}>
      <div style={{ position: "relative", maxWidth: 960, width: "100%" }} onClick={e => e.stopPropagation()}>
        <button onClick={() => setOpen(false)} style={{ position: "absolute", top: -44, right: 0, width: 36, height: 36, borderRadius: 8, border: "1px solid rgba(255,255,255,0.20)", backgroundColor: "rgba(0,0,0,0.50)", color: "rgba(255,255,255,0.70)", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", padding: 0 }}>
          <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><line x1="4" y1="4" x2="12" y2="12" /><line x1="12" y1="4" x2="4" y2="12" /></svg>
        </button>
        {videoSrc && (
          <video autoPlay playsInline preload="auto" controls style={{ width: "100%", borderRadius: 12, display: "block" }}>
            <source src={videoSrc} type="video/mp4" />
          </video>
        )}
      </div>
    </div>
  );
}

/* Video trigger — exported so hero can call it */
let openVideoModal: (() => void) | null = null;
function VideoTrigger() {
  const [open, setOpen] = useState(false);
  openVideoModal = () => setOpen(true);
  return open ? <VideoModal /> : null;
}

/* Kept for backward compat — now renders the trigger */
function HeroVideo() {
  return <VideoTrigger />;
}


/* ================================================================== */
/* WHO THIS IS FOR — right after hero                                  */
/* ================================================================== */
function WhoSection() {
  const { ref, visible } = useInView();
  const m = useMobile();

  return (
    <section ref={ref} aria-label="Who this is for" style={{
      background: C.sandAlt,
      paddingTop: secY(m), paddingBottom: secY(m),
      paddingLeft: px(m), paddingRight: px(m),
    }}>
      <div style={{ maxWidth: readW, margin: "0 auto", textAlign: "center", ...fadeIn(visible) }}>
        <div style={{ ...T.label, color: C.teal, marginBottom: sp(2) }}>Who This Is For</div>
        <h2 style={{ ...h2(m), color: C.navy, marginBottom: sp(3) }}>
          If you re-earn your income every month, this is the standard it should be measured against.
        </h2>
        <p style={{ ...body(m), color: C.muted, maxWidth: 560, margin: "0 auto 0" }}>
          Consultants. Contractors. Freelancers. Agency owners. Solo practitioners. Anyone whose income depends on structure, not a payroll system.
        </p>
      </div>
    </section>
  );
}


/* ================================================================== */
/* HOW IT WORKS                                                        */
/* ================================================================== */
function HowItWorksSection() {
  const { ref, visible } = useInView();
  const m = useMobile();

  const steps = [
    { num: "01", title: "Answer six structural questions", desc: "About how your income is built — sources, concentration, visibility, and continuity.", trust: "No bank connection" },
    { num: "02", title: "Receive your score instantly", desc: "Your score out of 100, your stability band, and the primary constraint holding it down.", trust: "No credit pull" },
    { num: "03", title: "Unlock the full diagnostic", desc: "PressureMap, Command Center, industry-specific scripts, and a 12-week roadmap.", trust: "Private by default" },
  ];

  return (
    <section ref={ref} aria-label="How it works" style={{
      background: C.sand,
      paddingTop: secY(m),
      paddingBottom: secY(m),
      paddingLeft: px(m), paddingRight: px(m),
    }}>
      <div style={{ maxWidth: maxW, margin: "0 auto" }}>
        <div style={{ marginBottom: m ? sp(6) : sp(8), ...fadeIn(visible) }}>
          <div style={{ ...T.label, color: C.teal, marginBottom: sp(2) }}>
            How It Works
          </div>
          <h2 style={{
            ...h2(m), color: C.navy, letterSpacing: "-0.01em",
            maxWidth: 500,
          }}>
            Three steps. No financial data required.
          </h2>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: m ? "1fr" : "1fr 1fr 1fr", gap: m ? sp(3) : sp(3) }}>
          {steps.map((s) => (
            <div key={s.num} style={{
              ...cardStyle,
              padding: m ? sp(3.5) : sp(4),
              display: "flex", flexDirection: "column",
              ...fadeIn(visible, 100),
            }}>
              <div style={{
                fontSize: 13, fontWeight: 500, color: C.teal,
                letterSpacing: "0.06em", lineHeight: 1,
                marginBottom: sp(2),
              }}>{s.num}</div>

              <h3 style={{
                ...h3(m), color: C.navy,
                letterSpacing: "-0.01em",
                marginBottom: sp(1.5),
              }}>{s.title}</h3>

              <p style={{
                ...body(m), color: C.muted, margin: 0, flex: 1,
              }}>{s.desc}</p>

              <div style={{
                marginTop: sp(3),
                paddingTop: sp(2),
                borderTop: `1px solid ${C.border}`,
                display: "flex", alignItems: "center", gap: sp(1),
              }}>
                <span style={{ color: C.teal, fontSize: 13 }}>&#x2713;</span>
                <span style={{ ...T.meta, color: C.light }}>{s.trust}</span>
              </div>
            </div>
          ))}
        </div>

        {/* How It Works link */}
        <div style={{ marginTop: m ? sp(5) : sp(6), ...fadeIn(visible, 200) }}>
          <Link href="/how-it-works" style={{
            display: "inline-flex", alignItems: "center", gap: sp(1),
            textDecoration: "none",
            transition: "opacity 200ms ease",
          }}
            onMouseEnter={(e) => { if (canHover()) e.currentTarget.style.opacity = "0.7"; }}
            onMouseLeave={(e) => { e.currentTarget.style.opacity = "1"; }}
          >
            <span style={{ color: C.teal, fontSize: 15, lineHeight: 1, fontWeight: 500 }}>&#x203A;</span>
            <span style={{ fontSize: 15, fontWeight: 500, color: C.navy }}>How It Works</span>
          </Link>
        </div>
      </div>
    </section>
  );
}


/* ================================================================== */
/* WHAT HAPPENS WHEN SOMETHING CHANGES (replaces Four Dimensions)      */
/* ================================================================== */
function ScenarioSection() {
  const { ref, visible } = useInView();
  const m = useMobile();

  const scenarios = [
    {
      title: "Your biggest client leaves",
      desc: "The Score isolates how much of your stability depends on a single source. If one departure drops your score by 30 points, that concentration is the structural risk — not the client relationship.",
    },
    {
      title: "You can\u2019t work for 90 days",
      desc: "Continuity measures what happens to your income when labor stops. The Score reveals whether your structure survives a gap — or collapses with it.",
    },
    {
      title: "A contract doesn\u2019t renew",
      desc: "Visibility tracks how far ahead your income is committed. When a contract ends without a replacement, the Score shows how much of your forward certainty disappears with it.",
    },
  ];

  return (
    <section ref={ref} aria-label="Scenarios" style={{
      background: C.sandAlt,
      paddingTop: secY(m),
      paddingBottom: secY(m),
      paddingLeft: px(m), paddingRight: px(m),
    }}>
      <div style={{ maxWidth: maxW, margin: "0 auto" }}>
        <div style={{ marginBottom: m ? sp(6) : sp(8), ...fadeIn(visible) }}>
          <div style={{ ...T.label, color: C.teal, marginBottom: sp(2) }}>
            Real-World Pressure
          </div>
          <h2 style={{
            ...h2(m), color: C.navy, letterSpacing: "-0.01em",
            maxWidth: 500,
          }}>
            What happens when something changes?
          </h2>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: m ? "1fr" : "1fr 1fr 1fr", gap: m ? sp(3) : sp(3) }}>
          {scenarios.map((s) => (
            <div key={s.title} style={{
              ...cardStyle,
              backgroundColor: C.sand,
              padding: m ? sp(3.5) : sp(4),
              display: "flex", flexDirection: "column",
              ...fadeIn(visible, 100),
            }}>
              <h3 style={{
                ...h3(m), color: C.navy,
                letterSpacing: "-0.01em",
                marginBottom: sp(2),
              }}>{s.title}</h3>

              <p style={{
                ...body(m), color: C.muted, margin: 0,
              }}>{s.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}


/* ================================================================== */
/* WHAT YOU GET                                                        */
/* ================================================================== */
function WhatYouGet() {
  const { ref, visible } = useInView();
  const m = useMobile();

  const features = [
    {
      title: "PressureMap\u2122",
      desc: "AI-powered income zone analysis with peer benchmarks across your sector. See exactly where pressure concentrates in your income structure.",
      accent: C.teal,
    },
    {
      title: "Command Center",
      desc: "A living diagnostic tool: 12-week roadmap with success criteria, industry-specific scripts, what-if simulator, and progress tracking.",
      accent: C.purple,
    },
    {
      title: "Industry-tailored analysis",
      desc: "Benchmarked across 19 sectors. Your score, constraints, and action plan are calibrated to how your specific industry works.",
      accent: C.navy,
    },
  ];

  return (
    <section ref={ref} aria-label="What you get" style={{
      background: C.sand,
      paddingTop: secY(m),
      paddingBottom: secY(m),
      paddingLeft: px(m), paddingRight: px(m),
    }}>
      <div style={{ maxWidth: maxW, margin: "0 auto" }}>
        <div style={{ marginBottom: m ? sp(6) : sp(8), ...fadeIn(visible) }}>
          <div style={{ ...T.label, color: C.teal, marginBottom: sp(2) }}>
            What You Get
          </div>
          <h2 style={{
            ...h2(m), color: C.navy, letterSpacing: "-0.01em",
            maxWidth: 600,
          }}>
            A complete structural diagnostic generated from your submitted inputs.
          </h2>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: m ? "1fr" : "1fr 1fr 1fr", gap: m ? sp(3) : sp(3) }}>
          {features.map((f) => (
            <div key={f.title} style={{
              ...cardStyle,
              padding: m ? sp(3.5) : sp(4),
              display: "flex", flexDirection: "column",
              ...fadeIn(visible, 100),
            }}>
              <div style={{
                width: 6, height: 6, borderRadius: 999, backgroundColor: f.accent,
                marginBottom: sp(2),
              }} />

              <h3 style={{
                ...h3(m), color: C.navy,
                letterSpacing: "-0.01em",
                marginBottom: sp(1.5),
              }}>{f.title}</h3>

              <p style={{
                ...body(m), color: C.muted, margin: 0,
              }}>{f.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}


/* ================================================================== */
/* PRODUCT MOCKUP — phone with embedded UI + floating cards            */
/* ================================================================== */
function ProductMockup() {
  const m = useMobile();
  const { ref, visible } = useInView();
  const basePath = typeof window !== "undefined" && window.location.pathname.startsWith("/RunPayway") ? "/RunPayway" : "";

  return (
    <section ref={ref} aria-label="Product preview" style={{
      background: C.sand,
      paddingTop: m ? sp(4) : sp(6),
      paddingBottom: m ? sp(8) : sp(10),
      paddingLeft: px(m), paddingRight: px(m),
      overflow: "hidden",
    }}>
      <div style={{ maxWidth: 800, margin: "0 auto", position: "relative", ...fadeIn(visible) }}>
        {/* Container for phone + floating elements */}
        <div style={{ position: "relative", display: "flex", justifyContent: "center", minHeight: m ? 360 : 480 }}>

          {/* Left floating card — Root Constraint */}
          <div style={{
            position: "absolute",
            left: m ? -20 : 0,
            top: m ? 40 : 60,
            width: m ? 200 : 260,
            padding: m ? "14px 16px" : "18px 22px",
            backgroundColor: "#FEFEFE",
            borderRadius: 14,
            border: "1px solid rgba(14,26,43,0.06)",
            borderLeft: "3px solid #C53030",
            transform: "rotate(-6deg)",
            zIndex: 1,
            opacity: visible ? 1 : 0,
            transition: "opacity 600ms ease 200ms, transform 600ms ease 200ms",
          }}>
            <div style={{ fontSize: 9, fontWeight: 700, letterSpacing: "0.10em", color: "#C53030", marginBottom: 6, textTransform: "uppercase" as const }}>ROOT CONSTRAINT</div>
            <div style={{ fontSize: m ? 12 : 13, fontWeight: 500, color: C.navy, lineHeight: 1.45 }}>Your largest source represents 55% of income.</div>
            <div style={{ fontSize: 11, color: "#C53030", fontWeight: 500, marginTop: 6 }}>Score drops 38 → 21 if lost</div>
          </div>

          {/* Right floating card — #1 Priority */}
          <div style={{
            position: "absolute",
            right: m ? -20 : 0,
            top: m ? 220 : 280,
            width: m ? 200 : 260,
            padding: m ? "14px 16px" : "18px 22px",
            backgroundColor: "#FEFEFE",
            borderRadius: 14,
            border: "1px solid rgba(14,26,43,0.06)",
            borderLeft: "3px solid #4B3FAE",
            transform: "rotate(4deg)",
            zIndex: 1,
            opacity: visible ? 1 : 0,
            transition: "opacity 600ms ease 400ms, transform 600ms ease 400ms",
          }}>
            <div style={{ fontSize: 9, fontWeight: 700, letterSpacing: "0.10em", color: "#4B3FAE", marginBottom: 6, textTransform: "uppercase" as const }}>YOUR #1 PRIORITY</div>
            <div style={{ fontSize: m ? 12 : 13, fontWeight: 500, color: C.navy, lineHeight: 1.45 }}>Convert one client to a monthly retainer</div>
            <div style={{ fontSize: 13, fontWeight: 600, color: "#1F6D7A", marginTop: 6 }}>+12 pts</div>
          </div>

          {/* Phone image container */}
          <div style={{ position: "relative", zIndex: 2, width: m ? 220 : 300 }}>
            {/* Mini Command Center UI — behind phone, clipped to screen area */}
            <div style={{
              position: "absolute",
              top: m ? 18 : 24,
              left: m ? 18 : 26,
              right: m ? 18 : 26,
              bottom: m ? 22 : 30,
              borderRadius: m ? 20 : 28,
              overflow: "hidden",
              backgroundColor: "#F7F5F0",
              zIndex: 1,
            }}>
              {/* Mini score ring + content */}
              <div style={{ padding: m ? "16px 12px" : "24px 18px", textAlign: "center" }}>
                <div style={{ fontSize: 8, fontWeight: 700, letterSpacing: "0.10em", color: "rgba(14,26,43,0.35)", marginBottom: 8, textTransform: "uppercase" as const }}>COMMAND CENTER</div>

                {/* Score ring */}
                <div style={{ position: "relative", width: m ? 70 : 90, height: m ? 70 : 90, margin: "0 auto 8px" }}>
                  <svg width={m ? 70 : 90} height={m ? 70 : 90} style={{ transform: "rotate(-90deg)" }}>
                    <circle cx={m ? 35 : 45} cy={m ? 35 : 45} r={m ? 28 : 36} fill="none" stroke="rgba(14,26,43,0.06)" strokeWidth={m ? 4 : 5} />
                    <circle cx={m ? 35 : 45} cy={m ? 35 : 45} r={m ? 28 : 36} fill="none" stroke="#2B5EA7" strokeWidth={m ? 4 : 5}
                      strokeDasharray={2 * Math.PI * (m ? 28 : 36)} strokeDashoffset={2 * Math.PI * (m ? 28 : 36) * (1 - 0.51)}
                      strokeLinecap="round" />
                  </svg>
                  <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
                    <span style={{ fontSize: m ? 18 : 24, fontWeight: 300, color: C.navy, lineHeight: 1 }}>51</span>
                    <span style={{ fontSize: m ? 6 : 7, fontWeight: 600, color: "#2B5EA7", marginTop: 2 }}>Established</span>
                  </div>
                </div>

                {/* Mini benchmarking */}
                <div style={{ padding: "6px 8px", borderRadius: 6, backgroundColor: "rgba(75,63,174,0.05)", border: "1px solid rgba(75,63,174,0.08)", marginBottom: 8 }}>
                  <div style={{ fontSize: m ? 7 : 8, fontWeight: 600, color: C.navy }}>Top 62% of Consultants</div>
                  <div style={{ fontSize: m ? 6 : 7, color: "#1F6D7A", fontWeight: 600 }}>+8 above cluster avg</div>
                </div>

                {/* Mini income bar */}
                <div style={{ display: "flex", height: m ? 10 : 14, borderRadius: 4, overflow: "hidden", border: "1px solid rgba(14,26,43,0.06)", marginBottom: 6 }}>
                  <div style={{ width: "38%", backgroundColor: "rgba(197,48,48,0.15)", display: "flex", alignItems: "center", justifyContent: "center" }}><span style={{ fontSize: 6, fontWeight: 600, color: "#9B2C2C" }}>38%</span></div>
                  <div style={{ width: "17%", backgroundColor: "rgba(183,121,31,0.12)", borderLeft: "1px solid #FEFEFE" }} />
                  <div style={{ width: "45%", backgroundColor: "rgba(31,109,122,0.12)", display: "flex", alignItems: "center", justifyContent: "center", borderLeft: "1px solid #FEFEFE" }}><span style={{ fontSize: 6, fontWeight: 600, color: "#1F6D7A" }}>45%</span></div>
                </div>

                {/* Mini PressureMap label */}
                <div style={{ fontSize: m ? 6 : 7, fontWeight: 700, letterSpacing: "0.08em", color: "#4B3FAE", textTransform: "uppercase" as const, marginBottom: 4 }}>PRESSUREMAP&#8482;</div>

                {/* Mini zone cards */}
                {[
                  { label: "INCOME THAT STOPS", pct: "38%", color: "#C53030" },
                  { label: "RECURRING", pct: "17%", color: "#B7791F" },
                  { label: "PROTECTED", pct: "45%", color: "#1F6D7A" },
                ].map(z => (
                  <div key={z.label} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "3px 6px", borderLeft: `2px solid ${z.color}`, borderRadius: 3, marginBottom: 3, backgroundColor: "#FEFEFE", border: "1px solid rgba(14,26,43,0.04)" }}>
                    <span style={{ fontSize: m ? 5 : 6, fontWeight: 600, letterSpacing: "0.04em", color: z.color }}>{z.label}</span>
                    <span style={{ fontSize: m ? 7 : 8, fontWeight: 300, color: z.color }}>{z.pct}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Phone image — on top */}
            <img
              src={`${basePath}/iphone-hand.png`}
              alt="RunPayway Command Center on mobile"
              style={{ width: "100%", height: "auto", position: "relative", zIndex: 2, display: "block" }}
            />
          </div>
        </div>

        {/* Caption */}
        <p style={{ textAlign: "center", ...T.meta, color: C.light, marginTop: sp(3) }}>
          Your Command Center. PressureMap&#8482;. Scripts. Simulator. All in one place.
        </p>
      </div>
    </section>
  );
}


/* ================================================================== */
/* BEFORE / AFTER TRANSFORMATION                                       */
/* ================================================================== */
function TransformationSection() {
  const { ref, visible } = useInView();
  const m = useMobile();

  return (
    <section ref={ref} aria-label="Transformation" style={{
      background: C.sandAlt,
      paddingTop: secY(m), paddingBottom: secY(m),
      paddingLeft: px(m), paddingRight: px(m),
    }}>
      <div style={{ maxWidth: maxW, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: m ? sp(6) : sp(8), ...fadeIn(visible) }}>
          <div style={{ ...T.label, color: C.teal, marginBottom: sp(2) }}>The Difference</div>
          <h2 style={{ ...h2(m), color: C.navy }}>What changes after your assessment</h2>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: m ? "1fr" : "1fr 1fr", gap: sp(3), maxWidth: 800, margin: "0 auto", ...fadeIn(visible, 100) }}>
          {/* Before */}
          <div style={{ ...cardStyle, padding: m ? sp(3.5) : sp(4), borderLeft: `3px solid rgba(14,26,43,0.15)` }}>
            <div style={{ ...T.label, color: C.light, marginBottom: sp(2) }}>BEFORE</div>
            <div style={{ display: "flex", flexDirection: "column", gap: sp(2) }}>
              {[
                "You guess which clients matter most",
                "You react to disruptions after they hit",
                "You track revenue but not structure",
                "You know something feels fragile but not why",
              ].map(t => (
                <div key={t} style={{ display: "flex", alignItems: "flex-start", gap: sp(1) }}>
                  <span style={{ color: C.light, fontSize: 13, flexShrink: 0, marginTop: 2 }}>&mdash;</span>
                  <span style={{ ...body(m), color: C.muted }}>{t}</span>
                </div>
              ))}
            </div>
          </div>

          {/* After */}
          <div style={{ ...cardStyle, padding: m ? sp(3.5) : sp(4), borderLeft: `3px solid ${C.teal}` }}>
            <div style={{ ...T.label, color: C.teal, marginBottom: sp(2) }}>AFTER</div>
            <div style={{ display: "flex", flexDirection: "column", gap: sp(2) }}>
              {[
                "You know exactly which structural weakness to fix first",
                "You have scripts to send to clients today",
                "You can simulate changes before committing",
                "You have a 12-week plan with measurable targets",
              ].map(t => (
                <div key={t} style={{ display: "flex", alignItems: "flex-start", gap: sp(1) }}>
                  <span style={{ color: C.teal, fontSize: 13, flexShrink: 0, marginTop: 2 }}>&#x2713;</span>
                  <span style={{ ...body(m), color: C.navy }}>{t}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}


/* ================================================================== */
/* AUTHORITY QUOTE (replaces testimonials)                             */
/* ================================================================== */
function AuthorityQuote() {
  const { ref, visible } = useInView();
  const m = useMobile();

  return (
    <section ref={ref} aria-label="Authority" style={{
      background: C.sandAlt,
      paddingTop: secY(m), paddingBottom: secY(m),
      paddingLeft: px(m), paddingRight: px(m), textAlign: "center",
    }}>
      <div style={{ maxWidth: readW, margin: "0 auto", ...fadeIn(visible) }}>
        <p style={{
          ...bodyLg(m), color: C.navy, fontStyle: "italic",
          marginBottom: sp(1.5),
        }}>
          &ldquo;The median small business holds just 27 days of cash buffer.&rdquo;
        </p>
        <p style={{ ...T.meta, color: C.light, marginBottom: sp(4) }}>
          &mdash; JPMorgan Chase Institute
        </p>
        <div style={{ borderTop: `1px solid ${C.border}`, paddingTop: sp(3) }}>
          <p style={{ ...body(m), color: C.muted, margin: 0 }}>
            RunPayway reveals the structural reasons why — and what to do about it.
          </p>
        </div>
      </div>
    </section>
  );
}


/* ================================================================== */
/* TRUST STRIP                                                         */
/* ================================================================== */
function TrustStrip() {
  const m = useMobile();
  return (
    <section aria-label="Trust" style={{
      background: C.sand, paddingTop: m ? sp(3) : sp(4), paddingBottom: m ? sp(3) : sp(4),
      paddingLeft: px(m), paddingRight: px(m),
    }}>
      <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: m ? `${sp(1)}px ${sp(2)}px` : `${sp(1)}px ${sp(4)}px`, maxWidth: maxW, margin: "0 auto" }}>
        {["Methodology published", "Model RP-2.0", "Deterministic scoring", "Private by default"].map((item) => (
          <span key={item} style={{ ...T.meta, color: C.light }}>{item}</span>
        ))}
        <Link href="/methodology" style={{ ...T.meta, color: C.teal, textDecoration: "underline", textUnderlineOffset: 3 }}>
          View methodology
        </Link>
      </div>
    </section>
  );
}


/* ================================================================== */
/* PRICING                                                             */
/* ================================================================== */
function PricingSection() {
  const { ref, visible } = useInView();
  const m = useMobile();

  return (
    <section ref={ref} aria-label="Pricing" style={{
      background: C.sand, paddingTop: secY(m), paddingBottom: secY(m),
      paddingLeft: px(m), paddingRight: px(m),
    }}>
      <div style={{ maxWidth: maxW, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: sp(3), ...fadeIn(visible) }}>
          <h2 style={{ ...h2(m), color: C.navy, marginBottom: sp(2) }}>Know your structure before it breaks</h2>
          <p style={{ ...bodyLg(m), color: C.muted, marginBottom: sp(2) }}>
            Built for people whose income does not arrive on autopilot.
          </p>
          <div style={{ display: "inline-flex", alignItems: "center", gap: sp(1), padding: `${sp(0.5)}px ${sp(2)}px`, borderRadius: 20, border: `1px solid ${C.border}`, marginBottom: sp(4) }}>
            <div style={{ width: 4, height: 4, borderRadius: 999, backgroundColor: C.teal }} />
            <span style={{ fontSize: 11, fontWeight: 600, color: C.light, letterSpacing: "0.06em" }}>Scored by Model RP-2.0</span>
          </div>
        </div>


        <div style={{ display: "grid", gridTemplateColumns: m ? "1fr" : "1fr 1fr", gap: sp(3), maxWidth: 720, margin: "0 auto", ...fadeIn(visible, 150) }}>
          {/* Free */}
          <div style={{
            ...cardStyle,
            padding: m ? sp(3.5) : sp(4),
          }}>
            <div style={{ ...T.label, color: C.teal, marginBottom: sp(2) }}>
              Income Stability Score&#8482;
            </div>
            <div style={{ ...price(m), color: C.navy, marginBottom: sp(2) }}>$0</div>
            <div style={{ marginBottom: sp(3) }}>
              {["Score out of 100", "Stability band", "Primary structural constraint", "One recommended direction"].map((item) => (
                <div key={item} style={{ display: "flex", alignItems: "center", gap: sp(1), marginBottom: sp(0.75) }}>
                  <span style={{ color: C.teal, fontSize: 13, flexShrink: 0 }}>&#x2713;</span>
                  <span style={{ ...body(m), color: C.muted }}>{item}</span>
                </div>
              ))}
            </div>
            <Link href="/diagnostic-portal" style={{
              display: "flex", alignItems: "center", justifyContent: "center",
              width: "100%", height: sp(6.5), borderRadius: 10,
              backgroundColor: C.sandAlt, color: C.navy, ...T.cta,
              textDecoration: "none", border: `1px solid ${C.border}`,
              transition: "background-color 200ms ease",
            }}
              onMouseEnter={(e) => { if (!canHover()) return; e.currentTarget.style.backgroundColor = C.sand; }}
              onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = C.sandAlt; }}
            >Start Free Assessment</Link>
          </div>

          {/* Paid */}
          <div style={{
            ...cardStyle,
            border: `1px solid rgba(75,63,174,0.12)`,
            padding: m ? sp(3.5) : sp(4),
          }}>
            <div style={{ ...T.label, color: C.teal, marginBottom: sp(2) }}>
              RunPayway&#8482; Diagnostic Report
            </div>
            <div style={{ ...price(m), color: C.navy, marginBottom: sp(2) }}>$69</div>
            <div style={{ marginBottom: sp(3) }}>
              {[
                "3-page diagnostic report with income composition analysis",
                "PressureMap\u2122 with AI-powered zone analysis",
                "Industry-specific scripts and action plan",
                "12-week roadmap with success criteria",
                "Command Center with what-if simulator",
                "Peer benchmarking across your sector",
              ].map((item) => (
                <div key={item} style={{ display: "flex", alignItems: "flex-start", gap: sp(1), marginBottom: sp(0.75) }}>
                  <span style={{ color: C.purple, fontSize: 13, flexShrink: 0, marginTop: 2 }}>&#x2713;</span>
                  <span style={{ ...body(m), color: C.muted }}>{item}</span>
                </div>
              ))}
            </div>
            <a href={process.env.NEXT_PUBLIC_STRIPE_CHECKOUT_URL || "https://buy.stripe.com/9B66oz48EaYU2lc4IF2Nq05"} style={{
              display: "flex", alignItems: "center", justifyContent: "center",
              width: "100%", height: sp(6.5), borderRadius: 10,
              backgroundColor: C.navy, color: "#F7F5F0", ...T.cta,
              textDecoration: "none",
              transition: "opacity 200ms ease",
            }}
              onMouseEnter={(e) => { if (!canHover()) return; e.currentTarget.style.opacity = "0.9"; }}
              onMouseLeave={(e) => { e.currentTarget.style.opacity = "1"; }}
            >Get Your Full Diagnostic — $69</a>
            <p style={{ ...T.meta, color: C.light, textAlign: "center", marginTop: sp(1.5), marginBottom: 0 }}>30-day satisfaction guarantee</p>
          </div>
        </div>

        <div style={{ textAlign: "center", marginTop: sp(5), ...fadeIn(visible, 250) }}>
          <p style={{ ...body(m), color: C.muted, maxWidth: 560, margin: "0 auto" }}>
            If the report does not deliver meaningful new insight into your income structure, request a full refund within 30 days.
          </p>
        </div>
      </div>
    </section>
  );
}


/* ================================================================== */
/* FAQ                                                                 */
/* ================================================================== */
function FaqSection({ openFaq, setOpenFaq }: { openFaq: number | null; setOpenFaq: (v: number | null) => void }) {
  const { ref, visible } = useInView();
  const m = useMobile();

  const faqs = [
    { q: "What is the Income Stability Score?", a: "A standardized measure of how stable your income structure is under disruption. It evaluates four dimensions — recurring income, concentration, visibility, and continuity — and returns a score out of 100 with a stability band." },
    { q: "Who is this built for?", a: "Independent professionals, freelancers, consultants, contractors, and small business owners — anyone whose income does not arrive automatically every two weeks." },
    { q: "What does the full diagnostic include?", a: "A 3-page diagnostic report with income composition analysis, PressureMap with AI-powered zone analysis, Command Center with what-if simulator, industry-specific scripts, a 12-week roadmap, and peer benchmarking." },
    { q: "How is this different from revenue tracking?", a: "Revenue measures how much you earn. This measures how stable that income is. You can have strong revenue and fragile structure. The Score reveals the difference." },
    { q: "What is the PressureMap?", a: "An AI-powered analysis of your income zones — where pressure concentrates, how your structure compares to peers in your sector, and which zones need attention first." },
    { q: "What is the Command Center?", a: "A living diagnostic tool that includes a what-if simulator to test structural changes, industry-specific scripts, a 12-week roadmap with success criteria, and progress tracking over time." },
    { q: "How long does it take?", a: "Six questions, about 90 seconds. You receive your score and stability band instantly. The full diagnostic is generated immediately after purchase." },
    { q: "Is my data private?", a: "Yes. No bank connections. No credit pulls. No external data access. Your information is private by default." },
  ];

  return (
    <section ref={ref} aria-label="FAQ" style={{
      background: C.sandAlt, paddingTop: secY(m), paddingBottom: secY(m),
      paddingLeft: px(m), paddingRight: px(m),
    }}>
      <div style={{ maxWidth: 820, margin: "0 auto" }}>
        <h2 style={{ ...h2(m), color: C.navy, textAlign: "center", marginBottom: sp(5), ...fadeIn(visible) }}>
          Frequently asked questions
        </h2>

        <div style={fadeIn(visible, 100)}>
          {faqs.map((faq, i) => {
            const isOpen = openFaq === i;
            const panelId = `faq-panel-${i}`;
            const btnId = `faq-btn-${i}`;
            return (
              <div key={i} style={{ borderTop: `1px solid ${C.border}`, transition: "background-color 200ms ease" }}>
                <button id={btnId} onClick={() => setOpenFaq(isOpen ? null : i)} aria-expanded={isOpen} aria-controls={panelId}
                  style={{ width: "100%", padding: `${sp(2.5)}px ${sp(1)}px`, minHeight: 48, display: "flex", alignItems: "center", justifyContent: "space-between", background: "none", border: "none", cursor: "pointer", textAlign: "left" }}>
                  <span style={{ ...h3(m), fontWeight: 500, color: C.navy, paddingRight: sp(2) }}>{faq.q}</span>
                  <svg width="14" height="14" viewBox="0 0 16 16" fill="none" style={{ flexShrink: 0 }} aria-hidden="true">
                    <path d="M3 8h10" stroke={C.navy} strokeWidth="1.5" strokeLinecap="round" />
                    {!isOpen && <path d="M8 3v10" stroke={C.navy} strokeWidth="1.5" strokeLinecap="round" />}
                  </svg>
                </button>
                <div id={panelId} role="region" aria-labelledby={btnId} style={{ maxHeight: isOpen ? 400 : 0, overflow: "hidden", transition: "max-height 200ms ease" }}>
                  <p style={{ ...body(m), color: C.muted, margin: 0, padding: `0 ${sp(1)}px ${sp(2.5)}px` }}>{faq.a}</p>
                </div>
              </div>
            );
          })}
          <div style={{ borderTop: `1px solid ${C.border}` }} />
        </div>

        <div style={{ textAlign: "center", marginTop: sp(5), ...fadeIn(visible, 200) }}>
          <Link href="/diagnostic-portal" style={{ ...T.cta, color: C.navy, textDecoration: "underline", textUnderlineOffset: 4 }}>
            Start Free Assessment &#8594;
          </Link>
        </div>
      </div>
    </section>
  );
}


/* ================================================================== */
/* FINAL CTA                                                           */
/* ================================================================== */
function FinalCta() {
  const { ref, visible } = useInView();
  const m = useMobile();

  return (
    <section ref={ref} aria-label="Final CTA" style={{
      background: C.sand, paddingTop: secY(m), paddingBottom: secY(m),
      paddingLeft: px(m), paddingRight: px(m), textAlign: "center",
    }}>
      <div style={{ maxWidth: 560, margin: "0 auto", ...fadeIn(visible) }}>
        <p style={{ ...bodyLg(m), color: C.navy, marginBottom: sp(3), lineHeight: 1.6 }}>
          Every month you don&rsquo;t address your structural weakness, you&rsquo;re operating on the same fragile foundation. The assessment takes 90 seconds. The insight lasts permanently.
        </p>
        <a href={process.env.NEXT_PUBLIC_STRIPE_CHECKOUT_URL || "https://buy.stripe.com/9B66oz48EaYU2lc4IF2Nq05"} style={{
          display: "inline-flex", alignItems: "center", justifyContent: "center",
          height: sp(6.5), padding: `0 ${sp(5)}px`, borderRadius: 10,
          backgroundColor: C.navy,
          color: "#F7F5F0", ...T.cta, textDecoration: "none",
          transition: "opacity 200ms ease",
        }}
          onMouseEnter={(e) => { if (!canHover()) return; e.currentTarget.style.opacity = "0.9"; }}
          onMouseLeave={(e) => { e.currentTarget.style.opacity = "1"; }}
        >
          Get Your Full Diagnostic — $69 &#8594;
        </a>
        <p style={{ ...T.meta, color: C.light, marginTop: sp(2) }}>
          6 questions. 90 seconds. No financial data required.
        </p>
        <Link href="/diagnostic-portal" style={{ ...T.meta, color: C.light, textDecoration: "underline", textUnderlineOffset: 3, marginTop: sp(1), display: "inline-block" }}>
          Or start free
        </Link>
      </div>
    </section>
  );
}


/* ================================================================== */
/* DISCLAIMER                                                          */
/* ================================================================== */
function DisclaimerSection() {
  const m = useMobile();
  return (
    <section aria-label="Disclaimer" style={{
      background: C.sand, paddingTop: m ? sp(4) : sp(5), paddingBottom: m ? sp(4) : sp(5),
      paddingLeft: px(m), paddingRight: px(m), borderTop: `1px solid ${C.border}`,
    }}>
      <p style={{ ...T.meta, color: C.light, textAlign: "center", maxWidth: 640, margin: "0 auto", lineHeight: 1.6 }}>
        The Income Stability Score&#8482; is a structural income assessment based on information provided by the user.
        It does not provide financial advice, investment advice, credit underwriting, or prediction of future outcomes.
      </p>
    </section>
  );
}


/* ================================================================== */
/* PAGE EXPORT                                                         */
/* ================================================================== */
const FAQ_SCHEMA = {
  "@context": "https://schema.org", "@type": "FAQPage",
  mainEntity: [
    { "@type": "Question", name: "What is the Income Stability Score?", acceptedAnswer: { "@type": "Answer", text: "A standardized measure of how stable your income structure is under disruption. It evaluates four dimensions and returns a score out of 100 with a stability band." } },
    { "@type": "Question", name: "Who is this built for?", acceptedAnswer: { "@type": "Answer", text: "Independent professionals, freelancers, consultants, contractors, and small business owners." } },
    { "@type": "Question", name: "What does the full diagnostic include?", acceptedAnswer: { "@type": "Answer", text: "A 3-page diagnostic report, PressureMap with AI-powered zone analysis, Command Center with what-if simulator, industry-specific scripts, a 12-week roadmap, and peer benchmarking." } },
    { "@type": "Question", name: "How is this different from revenue tracking?", acceptedAnswer: { "@type": "Answer", text: "Revenue measures how much you earn. This measures how stable that income is under disruption." } },
    { "@type": "Question", name: "What is the PressureMap?", acceptedAnswer: { "@type": "Answer", text: "An AI-powered analysis of your income zones — where pressure concentrates and how your structure compares to peers." } },
    { "@type": "Question", name: "What is the Command Center?", acceptedAnswer: { "@type": "Answer", text: "A living diagnostic tool with a what-if simulator, industry-specific scripts, a 12-week roadmap, and progress tracking." } },
    { "@type": "Question", name: "How long does it take?", acceptedAnswer: { "@type": "Answer", text: "Six questions, about 90 seconds. Instant results." } },
    { "@type": "Question", name: "Is my data private?", acceptedAnswer: { "@type": "Answer", text: "Yes. No bank connections. No credit pulls. Private by default." } },
  ],
};

const PRODUCT_SCHEMA = {
  "@context": "https://schema.org", "@type": "Product",
  name: "RunPayway Income Stability Score",
  description: "A structural assessment that measures how stable your income structure is — not how much you make.",
  brand: { "@type": "Brand", name: "RunPayway" },
  offers: [
    { "@type": "Offer", price: "0", priceCurrency: "USD", name: "Income Stability Score", description: "Score, band, primary constraint, and one recommended direction." },
    { "@type": "Offer", price: "69", priceCurrency: "USD", name: "RunPayway Diagnostic Report", description: "Full diagnostic with PressureMap, Command Center, scripts, and 12-week roadmap." },
  ],
};

export default function LandingPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  return (
    <div className="overflow-x-hidden">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(FAQ_SCHEMA) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(PRODUCT_SCHEMA) }} />
      <StickyNav />
      <HeroSection />
      <HeroAccent />
      <HeroVideo />
      <WhoSection />
      <HowItWorksSection />
      <PricingSection />
      <WhatYouGet />
      <ProductMockup />
      <TransformationSection />
      <AuthorityQuote />
      <TrustStrip />
      <FaqSection openFaq={openFaq} setOpenFaq={setOpenFaq} />
      <FinalCta />
      <DisclaimerSection />
    </div>
  );
}
