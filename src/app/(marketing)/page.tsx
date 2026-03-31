"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import logoWhite from "../../../public/runpayway-logo-white.png";
import logoBlue from "../../../public/runpayway-logo-blue.png";
import iphoneHand from "../../../public/iphone-hand.png";

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

const SERIF = "'DM Serif Display', Georgia, serif";

const C = {
  navy: "#0E1A2B",
  purple: "#4B3FAE",
  teal: "#1F6D7A",
  sand: "#F8F6F6",
  sandBg: "#F8F6F6",
  white: "#FFFFFF",
  muted: "rgba(14,26,43,0.55)",
  light: "rgba(14,26,43,0.38)",
  border: "rgba(14,26,43,0.08)",
  heroGradient: "linear-gradient(145deg, #0E1A2B 0%, #161430 35%, #3D2F9C 65%, #1F6D7A 100%)",
};

const sp = (n: number) => n * 8;

const T = {
  h1:    { desktop: { fontSize: 52, fontWeight: 600, lineHeight: 1.08 }, mobile: { fontSize: 30, fontWeight: 600, lineHeight: 1.1 } },
  h2:    { desktop: { fontSize: 32, fontWeight: 600, lineHeight: 1.15 }, mobile: { fontSize: 26, fontWeight: 600, lineHeight: 1.15 } },
  h3:    { desktop: { fontSize: 20, fontWeight: 600, lineHeight: 1.3 },  mobile: { fontSize: 18, fontWeight: 600, lineHeight: 1.3 } },
  bodyLg:{ desktop: { fontSize: 20, fontWeight: 400, lineHeight: 1.45 }, mobile: { fontSize: 18, fontWeight: 400, lineHeight: 1.5 } },
  body:  { desktop: { fontSize: 16, fontWeight: 400, lineHeight: 1.65 }, mobile: { fontSize: 16, fontWeight: 400, lineHeight: 1.6 } },
  label: { fontSize: 14, fontWeight: 500, lineHeight: 1.45 },
  meta:  { fontSize: 13, fontWeight: 500, lineHeight: 1.4 },
  score: { desktop: { fontSize: 64, fontWeight: 600, lineHeight: 1 }, mobile: { fontSize: 48, fontWeight: 600, lineHeight: 1 } },
  price: { desktop: { fontSize: 48, fontWeight: 600, lineHeight: 1 }, mobile: { fontSize: 40, fontWeight: 600, lineHeight: 1 } },
  nav:   { fontSize: 15, fontWeight: 500 },
  cta:   { fontSize: 15, fontWeight: 600 },
};

const maxW = 1200;
const readW = 740;
const heroW = 660;
const padX = { desktop: 40, mobile: 20 };
const sectionGap = { desktop: sp(12), mobile: sp(9) };

const h1 = (m: boolean) => m ? T.h1.mobile : T.h1.desktop;
const h2 = (m: boolean) => m ? T.h2.mobile : T.h2.desktop;
const h3 = (m: boolean) => m ? T.h3.mobile : T.h3.desktop;
const bodyLg = (m: boolean) => m ? T.bodyLg.mobile : T.bodyLg.desktop;
const body = (m: boolean) => m ? T.body.mobile : T.body.desktop;
const score = (m: boolean) => m ? T.score.mobile : T.score.desktop;
const price = (m: boolean) => m ? T.price.mobile : T.price.desktop;
const px = (m: boolean) => m ? padX.mobile : padX.desktop;
const secY = (m: boolean) => m ? sectionGap.mobile : sectionGap.desktop;

const cardStyle = {
  borderRadius: 18,
  border: `1px solid ${C.border}`,
  backgroundColor: "#FFFFFF",
  boxShadow: "0 2px 12px rgba(14,26,43,0.04), 0 8px 32px rgba(14,26,43,0.03)",
};

const fadeIn = (visible: boolean, delay = 0) => ({
  opacity: visible ? 1 : 0,
  transform: visible ? "translateY(0)" : "translateY(16px)",
  transition: `opacity 600ms ease-out ${delay}ms, transform 600ms ease-out ${delay}ms`,
});


/* ================================================================== */
/* STICKY NAV — today's warm/dark adaptive nav with hamburger          */
/* ================================================================== */
function StickyNav() {
  const m = useMobile();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

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
            <Link href="/pricing" style={{
              ...T.cta, color: ctaColor, textDecoration: "none",
              padding: `${sp(1)}px ${sp(2.5)}px`, borderRadius: 8,
              backgroundColor: ctaBg, transition: "background-color 300ms, color 300ms",
            }}>Get My Free Score</Link>
          </div>
        )}
        {m && (
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <Link href="/pricing" style={{
              ...T.cta, fontSize: 13, color: ctaColor, textDecoration: "none",
              padding: `6px ${sp(2)}px`, borderRadius: 8,
              backgroundColor: ctaBg, transition: "background-color 300ms, color 300ms",
            }}>Score</Link>
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
        <Link href="/pricing" style={{
          display: "flex", alignItems: "center", justifyContent: "center",
          width: "100%", height: sp(6.5), borderRadius: 10,
          backgroundColor: C.navy, color: "#F7F5F0", ...T.cta,
          textDecoration: "none", marginTop: sp(4),
        }}>
          Get My Free Score
        </Link>
      </div>
    )}
    </>
  );
}


/* ================================================================== */
/* HERO — yesterday's copy/interaction + today's social proof bar      */
/* ================================================================== */
function HeroSection() {
  const { ref, visible } = useInView();
  const m = useMobile();
  const animatedScore = useAnimatedCounter(48, visible, 1500);
  const [showLabel, setShowLabel] = useState(false);

  useEffect(() => {
    if (!visible) return;
    const t = setTimeout(() => setShowLabel(true), 1600);
    return () => clearTimeout(t);
  }, [visible]);

  const ringSize = m ? 200 : 260;
  const radius = 70;
  const strokeWidth = 6;
  const circumference = 2 * Math.PI * radius;
  const targetOffset = (1 - 48 / 100) * circumference;

  return (
    <section ref={ref} aria-label="Hero" style={{ background: C.heroGradient }}>
      <div style={{
        maxWidth: maxW, margin: "0 auto",
        paddingTop: m ? sp(16) : sp(20),
        paddingBottom: m ? sp(10) : sp(16),
        paddingLeft: px(m), paddingRight: px(m),
      }}>
        <div style={{
          display: m ? "block" : "flex",
          alignItems: "center", justifyContent: "space-between", gap: sp(8),
        }}>
          {/* Left — text */}
          <div style={{ maxWidth: 720, textAlign: m ? "center" : "left" }}>
            <div style={{
              ...fadeIn(visible),
              ...T.label, fontWeight: 600, letterSpacing: "0.12em", textTransform: "uppercase" as const,
              color: C.teal, marginBottom: m ? sp(3) : sp(4),
            }}>
              Income Stability Score&#8482;
            </div>

            <h1 style={{
              ...fadeIn(visible, 120),
              fontSize: m ? 38 : 64, fontWeight: 600, lineHeight: 1.04,
              color: C.sand, letterSpacing: "-0.03em",
              marginBottom: m ? sp(3) : sp(5),
            }}>
              Measure how stable<br />your income structure<br />actually is.
            </h1>

            <p style={{
              ...fadeIn(visible, 250),
              fontSize: m ? 18 : 20, fontWeight: 400, lineHeight: 1.5,
              color: "rgba(244,241,234,0.50)",
              marginBottom: m ? sp(5) : sp(6),
              maxWidth: m ? undefined : 500,
            }}>
              A fixed structural assessment based on how your income is built — not how much you make.
            </p>

            <div style={fadeIn(visible, 380)}>
              <Link
                href="/pricing"
                className="cta-tick inline-flex items-center justify-center"
                style={{
                  height: sp(7), width: m ? "100%" : "auto",
                  paddingLeft: sp(5), paddingRight: sp(5),
                  borderRadius: sp(1.25),
                  background: `linear-gradient(135deg, ${C.sand} 0%, #EDECEA 100%)`,
                  color: C.navy, ...T.cta, letterSpacing: "-0.01em",
                  border: `1px solid rgba(244,241,234,0.92)`,
                  boxShadow: "inset 0 1px 0 rgba(255,255,255,0.4), 0 8px 24px rgba(0,0,0,0.20)",
                  transition: "transform 180ms ease, box-shadow 180ms ease",
                  textDecoration: "none",
                }}
                onMouseEnter={(e) => { if (!canHover()) return; e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = "inset 0 1px 0 rgba(255,255,255,0.4), 0 12px 32px rgba(0,0,0,0.25)"; }}
                onMouseLeave={(e) => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "inset 0 1px 0 rgba(255,255,255,0.4), 0 8px 24px rgba(0,0,0,0.20)"; }}
              >
                <span className="tick tick-navy" />
                <span className="cta-label">Get My Free Score</span>
                <span className="cta-arrow cta-arrow-navy" />
              </Link>

              <p style={{ ...T.meta, color: "rgba(244,241,234,0.42)", marginTop: sp(3) }}>
                Under two minutes &bull; No bank connection &bull; No credit pull
              </p>
            </div>
          </div>

          {/* Right — score ring */}
          <div style={{
            flexShrink: 0, display: "flex", flexDirection: "column", alignItems: "center",
            marginTop: m ? sp(7) : 0,
            ...fadeIn(visible, 400),
          }}>
            <div style={{ position: "relative", width: ringSize, height: ringSize }}>
              <svg width={ringSize} height={ringSize} viewBox="0 0 160 160" style={{ transform: "rotate(-90deg)" }}>
                <circle cx="80" cy="80" r={radius} fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth={strokeWidth} />
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
                <span style={{ ...score(m), color: C.sand, letterSpacing: "-0.03em", fontVariantNumeric: "tabular-nums" }}>
                  {animatedScore}
                </span>
              </div>
            </div>

            <div style={{
              textAlign: "center", marginTop: sp(2),
              opacity: showLabel ? 1 : 0, transform: showLabel ? "translateY(0)" : "translateY(6px)",
              transition: "opacity 500ms ease-out, transform 500ms ease-out",
            }}>
              <div style={{
                display: "inline-flex", alignItems: "center", gap: sp(1),
                padding: `${sp(0.75)}px ${sp(2)}px`, borderRadius: 100,
                backgroundColor: "rgba(146,100,10,0.15)", border: "1px solid rgba(146,100,10,0.25)",
                marginBottom: sp(1),
              }}>
                <span style={{ width: 6, height: 6, borderRadius: 999, backgroundColor: "#92640A" }} />
                <span style={{ ...T.label, fontWeight: 600, color: "#92640A" }}>Developing Stability</span>
              </div>
              <div style={{ ...T.meta, color: "rgba(244,241,234,0.45)", marginBottom: sp(2) }}>12 points to Established</div>
              <div style={{ display: "flex", flexDirection: "column", gap: sp(0.75), textAlign: "left" }}>
                <span style={{ ...T.meta, color: "rgba(244,241,234,0.42)" }}>Primary constraint: Income concentration</span>
                <span style={{ ...T.meta, color: "rgba(244,241,234,0.42)" }}>Stress test: Largest source removed &#8594; projected 21</span>
              </div>
            </div>
          </div>
        </div>

        {/* Social proof bar — from today */}
        <div style={{
          marginTop: m ? sp(5) : sp(6),
          paddingTop: m ? sp(4) : sp(5),
          borderTop: "1px solid rgba(255,255,255,0.06)",
          display: "flex", alignItems: "center", justifyContent: m ? "center" : "flex-start",
          gap: m ? sp(3) : sp(5), flexWrap: "wrap",
          ...fadeIn(visible, 500),
        }}>
          {[
            { val: "19", label: "industries benchmarked" },
            { val: "4", label: "structural dimensions" },
            { val: "90s", label: "to complete" },
          ].map(s => (
            <div key={s.label} style={{ display: "flex", alignItems: "baseline", gap: 6 }}>
              <span style={{ fontFamily: SERIF, fontSize: 20, color: "#F4F1EA" }}>{s.val}</span>
              <span style={{ fontSize: 12, color: "rgba(244,241,234,0.30)" }}>{s.label}</span>
            </div>
          ))}
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
/* HERO VIDEO — today's modal approach                                 */
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

function VideoTrigger() {
  const [open, setOpen] = useState(false);
  return open ? <VideoModal /> : null;
}

function HeroVideo() {
  return <VideoTrigger />;
}


/* ================================================================== */
/* HOW IT WORKS — today's vertical timeline version                    */
/* ================================================================== */
function HowItWorksSection() {
  const { ref, visible } = useInView();
  const m = useMobile();

  const steps = [
    { num: "01", title: "Answer structural questions", desc: "About how your income is built — sources, concentration, visibility, and continuity.", trust: "No bank connection", icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none"><path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" stroke={C.teal} strokeWidth="1.5" strokeLinecap="round" /></svg> },
    { num: "02", title: "Receive your score instantly", desc: "A score out of 100, your stability band, and the primary constraint holding your income down.", trust: "No credit pull", icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="9" stroke={C.purple} strokeWidth="1.5" /><path d="M12 7v5l3 3" stroke={C.purple} strokeWidth="1.5" strokeLinecap="round" /></svg> },
    { num: "03", title: "Unlock the full diagnostic", desc: "PressureMap, Command Center, industry-specific scripts, and a 12-week roadmap — yours to keep.", trust: "Private by default", icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none"><path d="M12 15V9m0 0l-3 3m3-3l3 3M21 12a9 9 0 11-18 0 9 9 0 0118 0z" stroke={C.navy} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg> },
  ];

  const accents = [C.teal, C.purple, C.navy];

  return (
    <section ref={ref} aria-label="How it works" style={{
      background: C.sand,
      paddingTop: m ? sp(8) : sp(10),
      paddingBottom: m ? sp(8) : sp(10),
      paddingLeft: px(m), paddingRight: px(m),
    }}>
      <div style={{ maxWidth: 720, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: m ? sp(6) : sp(7), ...fadeIn(visible) }}>
          <div style={{ ...T.label, color: C.teal, marginBottom: sp(2) }}>
            How It Works
          </div>
          <h2 style={{ ...h2(m), color: C.navy }}>
            90 seconds. No financial data. Just structure.
          </h2>
        </div>

        {/* Timeline */}
        <div style={{ position: "relative" }}>
          {/* Vertical connector line */}
          {!m && (
            <div style={{
              position: "absolute", left: 28, top: 48, bottom: 48,
              width: 1, background: `linear-gradient(180deg, ${C.teal}, ${C.purple}, ${C.navy})`,
              opacity: visible ? 0.2 : 0,
              transition: "opacity 800ms ease 400ms",
            }} />
          )}

          {steps.map((s, i) => (
            <div key={s.num} style={{
              display: "flex",
              gap: m ? sp(2.5) : sp(4),
              alignItems: "flex-start",
              marginBottom: i < 2 ? (m ? sp(5) : sp(6)) : 0,
              ...fadeIn(visible, 150 + i * 150),
            }}>
              {/* Step number circle */}
              <div style={{
                width: 56, height: 56, borderRadius: 16,
                backgroundColor: `${accents[i]}08`,
                border: `1px solid ${accents[i]}18`,
                display: "flex", alignItems: "center", justifyContent: "center",
                flexShrink: 0,
                position: "relative",
                zIndex: 1,
              }}>
                <span style={{ fontFamily: SERIF, fontSize: 22, color: accents[i], lineHeight: 1 }}>{s.num}</span>
              </div>

              {/* Step content */}
              <div style={{ flex: 1, paddingTop: 4 }}>
                <h3 style={{ ...h3(m), color: C.navy, marginBottom: sp(1) }}>{s.title}</h3>
                <p style={{ ...body(m), color: C.muted, margin: `0 0 ${sp(1.5)}px` }}>{s.desc}</p>
                <div style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: `4px 12px`, borderRadius: 20, backgroundColor: `${accents[i]}08`, border: `1px solid ${accents[i]}12` }}>
                  <span style={{ color: accents[i], fontSize: 11 }}>&#x2713;</span>
                  <span style={{ fontSize: 12, fontWeight: 600, color: accents[i], letterSpacing: "0.02em" }}>{s.trust}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div style={{ textAlign: "center", marginTop: m ? sp(6) : sp(8), ...fadeIn(visible, 600) }}>
          <Link href="/how-it-works" style={{
            display: "inline-flex", alignItems: "center", gap: sp(1),
            ...T.cta, color: C.teal, textDecoration: "none",
            transition: "opacity 200ms ease",
          }}
            onMouseEnter={(e) => { if (canHover()) e.currentTarget.style.opacity = "0.7"; }}
            onMouseLeave={(e) => { e.currentTarget.style.opacity = "1"; }}
          >
            See the full methodology &#8594;
          </Link>
        </div>
      </div>
    </section>
  );
}


/* ================================================================== */
/* WHAT THIS SCORE MEASURES — yesterday's 4 dimension cards            */
/* ================================================================== */
function WhatItMeasures() {
  const { ref, visible } = useInView();
  const m = useMobile();
  const [hoverIdx, setHoverIdx] = useState<number | null>(null);

  const dims = [
    { num: "01", label: "Recurring Income", accent: C.teal, metric: "0%", metricLabel: "recurring",
      title: "Recurring income proportion",
      desc: "What percentage of your income renews automatically through retainers, subscriptions, or standing contracts." },
    { num: "02", label: "Concentration", accent: C.purple, metric: "55%", metricLabel: "one client",
      title: "Income concentration",
      desc: "How much of your income depends on a single source. Higher concentration increases structural risk." },
    { num: "03", label: "Visibility", accent: "#D4940A", metric: "<30", metricLabel: "days booked",
      title: "Forward income visibility",
      desc: "How far into the future your income is already committed — booked, contracted, or otherwise secured." },
    { num: "04", label: "Continuity", accent: "#DC4A4A", metric: "100%", metricLabel: "labor",
      title: "Income continuity without active labor",
      desc: "How long income continues if you stop working. Measures dependence on daily effort." },
  ];

  return (
    <section ref={ref} aria-label="What this score measures" style={{
      background: C.white,
      paddingTop: m ? sp(10) : sp(16),
      paddingBottom: m ? sp(10) : sp(16),
      paddingLeft: px(m), paddingRight: px(m),
    }}>
      <div style={{ maxWidth: maxW, margin: "0 auto" }}>
        {/* Heading */}
        <div style={{ marginBottom: m ? sp(8) : sp(12), ...fadeIn(visible) }}>
          <div style={{
            ...T.meta, fontWeight: 600, letterSpacing: "0.12em", textTransform: "uppercase" as const,
            color: C.teal, marginBottom: m ? sp(2) : sp(3),
          }}>
            Four Dimensions of Stability
          </div>
          <h2 style={{
            fontSize: m ? 36 : 56, fontWeight: 600, lineHeight: 1.08,
            color: C.navy, letterSpacing: "-0.03em",
            maxWidth: 700, marginBottom: m ? sp(3) : sp(4),
          }}>
            What this score measures.
          </h2>
          <p style={{
            ...bodyLg(m), color: C.muted, maxWidth: 520,
          }}>
            Structural questions are used to evaluate four structural dimensions of income stability.
          </p>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: m ? "1fr" : "1fr 1fr", gap: m ? sp(3) : sp(4) }}>
          {dims.map((d, i) => {
            const hovered = hoverIdx === i;
            return (
              <div key={d.label}
                onMouseEnter={() => canHover() && setHoverIdx(i)}
                onMouseLeave={() => setHoverIdx(null)}
                style={{
                  background: C.purple, borderRadius: sp(1.5),
                  padding: m ? sp(4) : sp(5), position: "relative", overflow: "hidden",
                  transform: hovered ? "translateY(-4px)" : "translateY(0)",
                  boxShadow: hovered
                    ? "0 20px 60px rgba(75,63,174,0.25), 0 8px 24px rgba(14,26,43,0.10)"
                    : "0 2px 4px rgba(75,63,174,0.06), 0 12px 40px rgba(75,63,174,0.10)",
                  transition: "transform 300ms cubic-bezier(0.16, 1, 0.3, 1), box-shadow 300ms ease",
                  ...fadeIn(visible, 150 + i * 100),
                }}>
                {/* Number */}
                <div style={{
                  fontSize: m ? 44 : 56, fontWeight: 600, color: "rgba(255,255,255,0.15)",
                  letterSpacing: "-0.03em", lineHeight: 1,
                  marginBottom: sp(3),
                }}>{d.num}</div>

                {/* Metric — top-right */}
                <div style={{
                  position: "absolute", top: m ? sp(4) : sp(5), right: m ? sp(4) : sp(5),
                  textAlign: "right",
                }}>
                  <div style={{ fontSize: m ? 28 : 36, fontWeight: 600, color: "rgba(255,255,255,0.90)", letterSpacing: "-0.02em", lineHeight: 1 }}>{d.metric}</div>
                  <div style={{ ...T.meta, color: "rgba(255,255,255,0.40)", textTransform: "uppercase" as const, marginTop: 4 }}>{d.metricLabel}</div>
                </div>

                {/* Title */}
                <h3 style={{
                  fontSize: m ? 20 : 24, fontWeight: 600, color: "#FFFFFF",
                  lineHeight: 1.2, letterSpacing: "-0.02em",
                  marginBottom: sp(2),
                }}>{d.title}</h3>

                {/* Description */}
                <p style={{
                  fontSize: m ? 15 : 16, fontWeight: 400, lineHeight: 1.6,
                  color: "rgba(255,255,255,0.55)", margin: 0,
                }}>{d.desc}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}


/* ================================================================== */
/* PRODUCT MOCKUP — today's version (text left, phone right)           */
/* ================================================================== */
function ProductMockup() {
  const m = useMobile();
  const { ref, visible } = useInView();

  const features = [
    "Score, stability band, and root constraint — instantly",
    "PressureMap\u2122 with AI-powered zone analysis",
    "What-if simulator to test structural changes",
    "Industry-specific scripts you can send today",
    "12-week roadmap with success criteria",
  ];

  return (
    <section ref={ref} aria-label="Product preview" style={{
      background: "#F8F6F6",
      paddingTop: m ? sp(10) : sp(14),
      paddingBottom: 0,
      overflow: "visible",
    }}>
      <div style={{ maxWidth: maxW, margin: "0 auto", ...fadeIn(visible), paddingLeft: px(m), paddingRight: px(m) }}>
        <div style={{
          display: m ? "block" : "flex",
          position: "relative",
        }}>
          {/* LEFT — text panel */}
          <div style={{
            flex: m ? undefined : "0 0 40%",
            padding: m ? `${sp(5)}px 0` : `${sp(6)}px 0 ${sp(6)}px`,
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
          }}>
            <h2 style={{
              fontFamily: SERIF, fontWeight: 400,
              fontSize: m ? 26 : 32, lineHeight: 1.15,
              color: C.navy,
              marginBottom: sp(3),
            }}>
              RunPayway&#174;
            </h2>

            <div style={{ display: "flex", flexDirection: "column", gap: sp(2), marginBottom: sp(4) }}>
              {features.map(f => (
                <div key={f} style={{ display: "flex", alignItems: "flex-start", gap: sp(1.5) }}>
                  <svg width="18" height="18" viewBox="0 0 18 18" style={{ flexShrink: 0, marginTop: 2 }}>
                    <circle cx="9" cy="9" r="9" fill="rgba(31,109,122,0.12)" />
                    <path d="M5.5 9.2L7.8 11.5L12.5 6.5" stroke={C.teal} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
                  </svg>
                  <span style={{ fontSize: 15, color: C.navy, lineHeight: 1.55 }}>{f}</span>
                </div>
              ))}
            </div>

            <Link href="/sample-report" style={{
              display: "inline-flex", alignItems: "center", gap: sp(1),
              ...T.cta, color: C.teal, textDecoration: "none",
              transition: "opacity 200ms",
            }}
              onMouseEnter={(e) => { if (canHover()) e.currentTarget.style.opacity = "0.7"; }}
              onMouseLeave={(e) => { e.currentTarget.style.opacity = "1"; }}
            >
              Explore the Sample Report &#8594;
            </Link>
          </div>

          {/* RIGHT — phone image, pops above section */}
          <div style={{
            flex: m ? undefined : 1,
            position: "relative",
            minHeight: m ? 380 : 480,
            display: "flex",
            alignItems: "flex-end",
            justifyContent: m ? "center" : "flex-end",
          }}>
            <div style={{
              width: m ? "100%" : "105%",
              maxWidth: m ? 420 : 660,
              marginTop: m ? 0 : -60,
            }}>
              <Image
                src={iphoneHand}
                alt="RunPayway Command Center on mobile"
                style={{
                  width: "100%", height: "auto", display: "block",
                }}
                priority
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}


/* ================================================================== */
/* PRESSURE NARRATIVE — today's version (scenarios + JPMorgan + B/A)   */
/* ================================================================== */
function PressureNarrative() {
  const { ref, visible } = useInView();
  const m = useMobile();

  const scenarios = [
    {
      label: "Concentration",
      title: "Your biggest client leaves.",
      desc: "The Score isolates how much of your stability depends on a single source. If one departure drops your score by 30 points, that concentration is the structural risk — not the client relationship.",
      stat: "\u221230 pts",
      statLabel: "potential impact",
      accent: "#C53030",
    },
    {
      label: "Continuity",
      title: "You can\u2019t work for 90 days.",
      desc: "Continuity measures what happens to your income when labor stops. The Score reveals whether your structure survives a gap — or collapses with it.",
      stat: "27 days",
      statLabel: "median cash buffer",
      accent: "#B7791F",
    },
    {
      label: "Visibility",
      title: "A contract doesn\u2019t renew.",
      desc: "Visibility tracks how far ahead your income is committed. When a contract ends without a replacement, the Score shows how much of your forward certainty disappears with it.",
      stat: "0 days",
      statLabel: "advance warning",
      accent: C.teal,
    },
  ];

  return (
    <section ref={ref} aria-label="Pressure narrative" style={{
      background: C.navy,
      paddingTop: m ? sp(8) : sp(10),
      paddingBottom: m ? sp(8) : sp(10),
      paddingLeft: px(m), paddingRight: px(m),
      position: "relative",
      overflow: "hidden",
    }}>
      {/* Subtle radial glow */}
      <div style={{
        position: "absolute", top: "-30%", right: "-10%",
        width: 600, height: 600, borderRadius: "50%",
        background: "radial-gradient(circle, rgba(75,63,174,0.08) 0%, transparent 70%)",
        pointerEvents: "none",
      }} />

      <div style={{ maxWidth: 900, margin: "0 auto", position: "relative", zIndex: 1 }}>
        {/* Opening — emotional hook */}
        <div style={{ textAlign: "center", marginBottom: m ? sp(6) : sp(7), ...fadeIn(visible) }}>
          <div style={{ ...T.label, color: C.teal, marginBottom: sp(2.5) }}>
            The Pressure You Already Feel
          </div>
          <h2 style={{
            ...h2(m), color: "#F4F1EA",
            fontSize: m ? 26 : 36,
            maxWidth: 640, margin: "0 auto",
            marginBottom: sp(3),
          }}>
            You already know something is fragile. The Score tells you exactly where.
          </h2>
          <p style={{ ...body(m), color: "rgba(244,241,234,0.45)", maxWidth: 500, margin: "0 auto" }}>
            These aren&rsquo;t hypotheticals. They&rsquo;re the three structural failures that collapse independent income.
          </p>
        </div>

        {/* Scenario cards — staggered */}
        <div style={{ display: "flex", flexDirection: "column", gap: m ? sp(4) : sp(5) }}>
          {scenarios.map((s, i) => (
            <div key={s.label} style={{
              display: m ? "block" : "flex",
              alignItems: "stretch",
              gap: 0,
              borderRadius: 18,
              overflow: "hidden",
              backgroundColor: "rgba(255,255,255,0.03)",
              border: "1px solid rgba(255,255,255,0.06)",
              flexDirection: i % 2 === 1 ? "row-reverse" : "row",
              ...fadeIn(visible, 200 + i * 150),
            }}>
              {/* Stat callout */}
              <div style={{
                flex: m ? "none" : "0 0 180px",
                display: "flex", flexDirection: m ? "row" : "column",
                alignItems: "center", justifyContent: "center",
                gap: m ? 12 : 0,
                padding: m ? `${sp(2.5)}px ${sp(3)}px` : sp(4),
                backgroundColor: `${s.accent}10`,
                borderBottom: m ? `1px solid rgba(255,255,255,0.04)` : "none",
                borderRight: !m && i % 2 === 0 ? `1px solid rgba(255,255,255,0.04)` : "none",
                borderLeft: !m && i % 2 === 1 ? `1px solid rgba(255,255,255,0.04)` : "none",
              }}>
                <span style={{
                  fontFamily: SERIF, fontSize: m ? 28 : 40, color: s.accent,
                  lineHeight: 1, letterSpacing: "-0.02em",
                }}>{s.stat}</span>
                <span style={{ fontSize: 11, fontWeight: 600, letterSpacing: "0.06em", color: "rgba(244,241,234,0.35)", marginTop: m ? 0 : 8, textTransform: "uppercase" as const, textAlign: "center" }}>
                  {s.statLabel}
                </span>
              </div>

              {/* Content */}
              <div style={{ flex: 1, padding: m ? sp(3) : `${sp(4)}px ${sp(5)}px` }}>
                <div style={{ ...T.label, color: s.accent, marginBottom: sp(1.5) }}>{s.label}</div>
                <h3 style={{ fontFamily: SERIF, fontSize: m ? 20 : 24, fontWeight: 400, color: "#F4F1EA", marginBottom: sp(2), lineHeight: 1.2 }}>
                  {s.title}
                </h3>
                <p style={{ ...body(m), color: "rgba(244,241,234,0.50)", margin: 0 }}>
                  {s.desc}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Authority stat — woven inline */}
        <div style={{
          textAlign: "center", marginTop: m ? sp(8) : sp(10),
          ...fadeIn(visible, 700),
        }}>
          <div style={{
            display: "inline-flex", flexDirection: "column", alignItems: "center",
            padding: `${sp(4)}px ${sp(5)}px`,
            borderRadius: 18,
            backgroundColor: "rgba(255,255,255,0.02)",
            border: "1px solid rgba(255,255,255,0.06)",
          }}>
            <p style={{
              fontFamily: SERIF, fontSize: m ? 18 : 22, color: "#F4F1EA",
              lineHeight: 1.4, fontStyle: "italic", margin: `0 0 ${sp(1.5)}px`,
              maxWidth: 480,
            }}>
              &ldquo;The median small business holds just 27 days of cash buffer.&rdquo;
            </p>
            <span style={{ fontSize: 13, color: "rgba(244,241,234,0.30)", fontWeight: 400 }}>
              &mdash; JPMorgan Chase Institute
            </span>
          </div>
        </div>

        {/* Transformation — compact before/after */}
        <div style={{
          display: "grid", gridTemplateColumns: m ? "1fr" : "1fr 1fr",
          gap: sp(3), marginTop: m ? sp(8) : sp(10),
          maxWidth: 720, margin: `${m ? sp(8) : sp(10)}px auto 0`,
          ...fadeIn(visible, 800),
        }}>
          <div style={{ padding: m ? sp(3) : sp(4), borderRadius: 16, backgroundColor: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)" }}>
            <div style={{ ...T.label, color: "rgba(244,241,234,0.25)", marginBottom: sp(2.5) }}>Without the Score</div>
            {[
              "You guess which clients matter most",
              "You react to disruptions after they hit",
              "You track revenue but not structure",
            ].map(t => (
              <div key={t} style={{ display: "flex", alignItems: "flex-start", gap: sp(1), marginBottom: sp(1.5) }}>
                <span style={{ color: "rgba(244,241,234,0.20)", fontSize: 13, flexShrink: 0, marginTop: 2 }}>&mdash;</span>
                <span style={{ ...body(m), color: "rgba(244,241,234,0.40)" }}>{t}</span>
              </div>
            ))}
          </div>

          <div style={{ padding: m ? sp(3) : sp(4), borderRadius: 16, backgroundColor: "rgba(31,109,122,0.06)", border: "1px solid rgba(31,109,122,0.12)" }}>
            <div style={{ ...T.label, color: C.teal, marginBottom: sp(2.5) }}>With the Score</div>
            {[
              "You know exactly which weakness to fix first",
              "You have scripts to send to clients today",
              "You can simulate changes before committing",
            ].map(t => (
              <div key={t} style={{ display: "flex", alignItems: "flex-start", gap: sp(1), marginBottom: sp(1.5) }}>
                <span style={{ color: C.teal, fontSize: 13, flexShrink: 0, marginTop: 2 }}>&#x2713;</span>
                <span style={{ ...body(m), color: "rgba(244,241,234,0.65)" }}>{t}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}


/* ================================================================== */
/* HOW THE SCORE WORKS (Authority) — yesterday's version               */
/* ================================================================== */
function AuthorityBlock() {
  const { ref, visible } = useInView();
  const m = useMobile();

  const items = [
    { label: "Fixed structural inputs", desc: "Derived from your submitted income structure — not financial accounts" },
    { label: "Deterministic scoring", desc: "Same answers always produce the same score" },
    { label: "Measures stability, not wealth", desc: "Focuses on how income holds up under disruption" },
    { label: "No financial access required", desc: "No bank connection, no credit pull" },
    { label: "Methodology published", desc: "Scoring logic, dimensions, and interpretation are transparent" },
  ];

  return (
    <section ref={ref} aria-label="How the score works" style={{
      background: C.sandBg,
      paddingTop: m ? sp(10) : sp(16),
      paddingBottom: m ? sp(10) : sp(16),
      paddingLeft: px(m), paddingRight: px(m),
    }}>
      <div style={{ maxWidth: maxW, margin: "0 auto" }}>
        {/* Heading */}
        <div style={{ marginBottom: m ? sp(8) : sp(12), ...fadeIn(visible) }}>
          <div style={{
            ...T.meta, fontWeight: 600, letterSpacing: "0.12em", textTransform: "uppercase" as const,
            color: C.teal, marginBottom: m ? sp(2) : sp(3),
          }}>
            How The Score Works
          </div>
          <h2 style={{
            fontSize: m ? 36 : 56, fontWeight: 600, lineHeight: 1.08,
            color: C.navy, letterSpacing: "-0.03em",
            maxWidth: 600,
          }}>
            A fixed model.<br />Not an opinion.
          </h2>
        </div>

        {/* Items */}
        <div style={{ maxWidth: readW, ...fadeIn(visible, 150) }}>
          {items.map((item, i) => (
            <div key={item.label} style={{
              display: "flex", gap: sp(2.5), alignItems: "flex-start",
              padding: `${sp(3)}px 0`,
              borderTop: `1px solid ${C.border}`,
            }}>
              <span style={{ color: C.teal, fontSize: 16, lineHeight: "28px", flexShrink: 0, fontWeight: 600 }}>&#x2713;</span>
              <div>
                <div style={{
                  fontSize: m ? 17 : 20, fontWeight: 600, color: C.navy,
                  letterSpacing: "-0.01em", marginBottom: sp(0.75),
                }}>{item.label}</div>
                <div style={{ ...bodyLg(m), color: C.muted }}>{item.desc}</div>
              </div>
            </div>
          ))}
          <div style={{ borderTop: `1px solid ${C.border}` }} />
        </div>

        {/* Model badge */}
        <div style={{ display: "flex", flexWrap: "wrap", gap: sp(4), marginTop: m ? sp(6) : sp(8), ...fadeIn(visible, 300) }}>
          <span style={{ ...T.label, color: C.light, fontWeight: 500 }}>Model Version: RP-2.0</span>
          <span style={{ ...T.label, color: C.light, fontWeight: 500 }}>Assessment Type: Structural Income Stability Diagnostic</span>
        </div>

        {/* Large methodology link */}
        <div style={{ marginTop: m ? sp(8) : sp(10), ...fadeIn(visible, 400) }}>
          <Link href="/methodology" style={{
            display: "inline-flex", alignItems: "center", gap: sp(1.5),
            textDecoration: "none", transition: "opacity 200ms ease",
          }}
            onMouseEnter={(e) => { if (canHover()) e.currentTarget.style.opacity = "0.7"; }}
            onMouseLeave={(e) => { e.currentTarget.style.opacity = "1"; }}
          >
            <span style={{ color: C.teal, fontSize: m ? 32 : 44, lineHeight: 1, fontWeight: 600 }}>&#x203A;</span>
            <span style={{ fontSize: m ? 28 : 40, fontWeight: 600, color: C.navy, letterSpacing: "-0.02em" }}>View full methodology</span>
          </Link>
        </div>
      </div>
    </section>
  );
}


/* ================================================================== */
/* WHAT YOU GET — today's 3 feature cards version                      */
/* ================================================================== */
function WhatYouGet() {
  const { ref, visible } = useInView();
  const m = useMobile();

  const features = [
    {
      title: "PressureMap\u2122",
      desc: "See exactly where pressure concentrates. AI-powered zone analysis with peer benchmarks across your sector.",
      accent: C.teal,
      icon: <svg width="28" height="28" viewBox="0 0 28 28" fill="none"><rect x="3" y="3" width="22" height="22" rx="4" stroke={C.teal} strokeWidth="1.5" /><path d="M9 18l4-6 3 3 4-6" stroke={C.teal} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>,
    },
    {
      title: "Command Center",
      desc: "A living diagnostic tool: what-if simulator, industry scripts, 12-week roadmap, and progress tracking.",
      accent: C.purple,
      icon: <svg width="28" height="28" viewBox="0 0 28 28" fill="none"><rect x="4" y="6" width="20" height="16" rx="3" stroke={C.purple} strokeWidth="1.5" /><path d="M10 14l3 3 5-6" stroke={C.purple} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>,
    },
    {
      title: "Industry-calibrated",
      desc: "Benchmarked across 19 sectors. Your score, constraints, and action plan are tuned to how your industry works.",
      accent: C.navy,
      icon: <svg width="28" height="28" viewBox="0 0 28 28" fill="none"><circle cx="14" cy="14" r="10" stroke={C.navy} strokeWidth="1.5" /><path d="M14 8v6l4 2" stroke={C.navy} strokeWidth="1.5" strokeLinecap="round" /></svg>,
    },
  ];

  return (
    <section ref={ref} aria-label="What you get" style={{
      background: C.white,
      paddingTop: m ? sp(8) : sp(10),
      paddingBottom: m ? sp(8) : sp(10),
      paddingLeft: px(m), paddingRight: px(m),
    }}>
      <div style={{ maxWidth: maxW, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: m ? sp(6) : sp(7), ...fadeIn(visible) }}>
          <div style={{ ...T.label, color: C.teal, marginBottom: sp(2) }}>
            What You Get
          </div>
          <h2 style={{
            ...h2(m), color: C.navy, maxWidth: 600, margin: "0 auto",
          }}>
            Three tools that turn uncertainty into a plan.
          </h2>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: m ? "1fr" : "1fr 1fr 1fr", gap: m ? sp(3) : sp(4) }}>
          {features.map((f, i) => (
            <div key={f.title} style={{
              ...cardStyle,
              padding: m ? sp(3.5) : sp(5),
              display: "flex", flexDirection: "column",
              transition: "transform 300ms ease, box-shadow 300ms ease",
              ...fadeIn(visible, 100 + i * 100),
            }}
              onMouseEnter={(e) => { if (!canHover()) return; e.currentTarget.style.transform = "translateY(-4px)"; e.currentTarget.style.boxShadow = "0 8px 32px rgba(14,26,43,0.08), 0 16px 64px rgba(14,26,43,0.06)"; }}
              onMouseLeave={(e) => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = cardStyle.boxShadow; }}
            >
              <div style={{
                width: 52, height: 52, borderRadius: 14,
                backgroundColor: `${f.accent}08`,
                border: `1px solid ${f.accent}12`,
                display: "flex", alignItems: "center", justifyContent: "center",
                marginBottom: sp(3),
              }}>
                {f.icon}
              </div>

              <h3 style={{
                ...h3(m), color: C.navy, fontSize: m ? 18 : 20,
                marginBottom: sp(1.5),
              }}>{f.title}</h3>

              <p style={{
                ...body(m), color: C.muted, margin: 0,
              }}>{f.desc}</p>
            </div>
          ))}
        </div>

        {/* Trust anchors */}
        <div style={{
          display: "flex", flexWrap: "wrap", justifyContent: "center",
          gap: m ? sp(2) : sp(4),
          marginTop: m ? sp(6) : sp(8),
          ...fadeIn(visible, 400),
        }}>
          {[
            { label: "Methodology published", href: "/methodology" },
            { label: "Model RP-2.0" },
            { label: "Deterministic scoring" },
            { label: "Private by default" },
          ].map(item => (
            item.href ? (
              <Link key={item.label} href={item.href} style={{
                display: "inline-flex", alignItems: "center", gap: 6,
                fontSize: 13, color: C.teal, textDecoration: "none",
                padding: `6px 14px`, borderRadius: 20,
                backgroundColor: "rgba(31,109,122,0.05)", border: "1px solid rgba(31,109,122,0.10)",
              }}>
                <span style={{ fontSize: 11 }}>&#x2713;</span> {item.label}
              </Link>
            ) : (
              <span key={item.label} style={{
                display: "inline-flex", alignItems: "center", gap: 6,
                fontSize: 13, color: C.light,
                padding: `6px 14px`, borderRadius: 20,
                backgroundColor: "rgba(14,26,43,0.02)", border: `1px solid ${C.border}`,
              }}>
                <span style={{ fontSize: 11, color: C.teal }}>&#x2713;</span> {item.label}
              </span>
            )
          ))}
        </div>
      </div>
    </section>
  );
}


/* ================================================================== */
/* WHY THIS MATTERS — yesterday's version                              */
/* ================================================================== */
function WhyNowSection() {
  const { ref, visible } = useInView();
  const m = useMobile();

  return (
    <section ref={ref} aria-label="Why this matters" style={{
      background: C.white, paddingTop: secY(m), paddingBottom: secY(m),
      paddingLeft: px(m), paddingRight: px(m), textAlign: "center",
    }}>
      <div style={{ maxWidth: readW, margin: "0 auto", ...fadeIn(visible) }}>
        <h2 style={{ ...h2(m), color: C.navy, marginBottom: sp(2.5) }}>Income looks strongest right before pressure arrives.</h2>
        <p style={{ ...bodyLg(m), color: C.muted, marginBottom: sp(2) }}>
          Most income problems are not visible in revenue alone.<br />
          They surface when one source changes, one month slips, or one contract ends.
        </p>
        <p style={{ ...body(m), color: C.muted, marginBottom: sp(4) }}>
          This score is designed to reveal structural weakness before it becomes financial pain.
        </p>
        <div style={{ borderTop: `1px solid ${C.border}`, paddingTop: sp(3) }}>
          <p style={{ ...T.label, color: C.light, fontStyle: "italic", margin: 0 }}>
            The median small business holds just 27 days of cash buffer.
            <span style={{ ...T.meta, fontStyle: "normal", marginLeft: sp(1) }}>&mdash; JPMorgan Chase Institute</span>
          </p>
        </div>
      </div>
    </section>
  );
}


/* ================================================================== */
/* PROOF (Testimonials) — yesterday's version                          */
/* ================================================================== */
function ProofSection() {
  const { ref, visible } = useInView();
  const m = useMobile();

  const testimonials = [
    { quote: "The score made it obvious that too much of my income came from one source. The report gave me a clearer next step than my own planning notes had.", name: "Sarah M.", role: "Real Estate Agent", score: 28 },
    { quote: "The value was not the number alone. It was seeing which structural weakness mattered most and what a single change would do to the score.", name: "James R.", role: "Software Contractor", score: 44 },
    { quote: "The report helped me separate revenue from stability. I had been treating them like the same thing.", name: "Priya K.", role: "Management Consultant", score: 61 },
  ];

  return (
    <section ref={ref} aria-label="Proof" style={{
      background: C.navy, paddingTop: secY(m), paddingBottom: secY(m),
      paddingLeft: px(m), paddingRight: px(m),
    }}>
      <div style={{ maxWidth: maxW, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: sp(5), ...fadeIn(visible) }}>
          <h2 style={{ ...h2(m), color: C.sand }}>What the assessment revealed.</h2>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: m ? "1fr" : "repeat(3, 1fr)", gap: sp(2.5) }}>
          {testimonials.map((t, i) => (
            <div key={t.name} style={{
              backgroundColor: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)",
              borderRadius: sp(1), padding: m ? sp(3.5) : sp(4),
              display: "flex", flexDirection: "column",
              ...fadeIn(visible, 150 + i * 100),
            }}>
              <p style={{ ...body(m), color: "rgba(244,241,234,0.70)", fontStyle: "italic", margin: `0 0 ${sp(2.5)}px`, flex: 1 }}>
                &ldquo;{t.quote}&rdquo;
              </p>
              <div style={{ borderTop: "1px solid rgba(244,241,234,0.06)", paddingTop: sp(2) }}>
                <div style={{ ...T.label, fontWeight: 600, color: C.sand, marginBottom: 2 }}>{t.name}</div>
                <div style={{ ...T.meta, color: "rgba(244,241,234,0.42)" }}>{t.role} &middot; Score: {t.score}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}


/* ================================================================== */
/* TRUST STRIP — yesterday's version                                   */
/* ================================================================== */
function TrustStrip() {
  const m = useMobile();
  return (
    <section aria-label="Trust" style={{
      background: C.sandBg, paddingTop: m ? sp(4) : sp(5), paddingBottom: m ? sp(4) : sp(5),
      paddingLeft: px(m), paddingRight: px(m),
    }}>
      <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: m ? `${sp(1)}px ${sp(2.5)}px` : `${sp(1)}px ${sp(4.5)}px`, maxWidth: maxW, margin: "0 auto" }}>
        {["Methodology published", "Model version controlled", "Deterministic scoring", "Private by default"].map((item) => (
          <span key={item} style={{ ...T.label, color: C.muted, fontWeight: 500 }}>{item}</span>
        ))}
      </div>
    </section>
  );
}


/* ================================================================== */
/* PRICING — today's version (light bg with clear tiers)               */
/* ================================================================== */
function PricingSection() {
  const { ref, visible } = useInView();
  const m = useMobile();

  return (
    <section ref={ref} aria-label="Pricing" style={{
      background: `linear-gradient(180deg, ${C.white} 0%, ${C.sand} 100%)`,
      paddingTop: m ? sp(10) : sp(14), paddingBottom: m ? sp(10) : sp(14),
      paddingLeft: px(m), paddingRight: px(m),
    }}>
      <div style={{ maxWidth: maxW, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: m ? sp(6) : sp(8), ...fadeIn(visible) }}>
          <div style={{ ...T.label, color: C.teal, marginBottom: sp(2) }}>One Assessment, Permanent Insight</div>
          <h2 style={{ ...h2(m), color: C.navy, marginBottom: sp(2) }}>
            The cost of not knowing is higher than $69.
          </h2>
          <p style={{ ...body(m), color: C.muted, maxWidth: 500, margin: "0 auto" }}>
            One lost client. One missed renewal. One gap you didn&rsquo;t see coming. The diagnostic pays for itself the first time you avoid a structural surprise.
          </p>
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
              backgroundColor: C.white, color: C.navy, ...T.cta,
              textDecoration: "none", border: `1px solid ${C.border}`,
              transition: "background-color 200ms ease",
            }}
              onMouseEnter={(e) => { if (!canHover()) return; e.currentTarget.style.backgroundColor = C.sand; }}
              onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = C.white; }}
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
/* FAQ — today's version (better questions)                            */
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
    { q: "How long does it take?", a: "About 90 seconds. You receive your score and stability band instantly. The full diagnostic is generated immediately after purchase." },
    { q: "Is my data private?", a: "Yes. No bank connections. No credit pulls. No external data access. Your information is private by default." },
  ];

  return (
    <section ref={ref} aria-label="FAQ" style={{
      background: C.white, paddingTop: secY(m), paddingBottom: secY(m),
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
          <Link href="/pricing" style={{ ...T.cta, color: C.purple, textDecoration: "underline", textUnderlineOffset: 4 }}>
            Get My Free Score &#8594;
          </Link>
        </div>
      </div>
    </section>
  );
}


/* ================================================================== */
/* FINAL CTA — today's emotional close version                         */
/* ================================================================== */
function FinalCta() {
  const { ref, visible } = useInView();
  const m = useMobile();

  return (
    <section ref={ref} aria-label="Final CTA" style={{
      background: "#F8F6F6",
      paddingTop: m ? sp(8) : sp(10),
      paddingBottom: m ? sp(8) : sp(10),
      paddingLeft: px(m), paddingRight: px(m), textAlign: "center",
    }}>
      <div style={{ maxWidth: 600, margin: "0 auto", ...fadeIn(visible) }}>
        <h2 style={{
          fontFamily: SERIF, fontSize: m ? 26 : 34, fontWeight: 400,
          color: C.navy, lineHeight: 1.2,
          marginBottom: sp(3),
        }}>
          The structure won&rsquo;t fix itself.
        </h2>
        <p style={{ ...bodyLg(m), color: C.muted, marginBottom: sp(5), lineHeight: 1.65, maxWidth: 480, margin: `0 auto ${sp(5)}px` }}>
          Every month on the same fragile foundation is a month closer to the disruption that reveals it. The assessment takes 90 seconds. The insight is permanent.
        </p>

        <a href={process.env.NEXT_PUBLIC_STRIPE_CHECKOUT_URL || "https://buy.stripe.com/9B66oz48EaYU2lc4IF2Nq05"} style={{
          display: "inline-flex", alignItems: "center", justifyContent: "center",
          height: sp(7), padding: `0 ${sp(5)}px`, borderRadius: 12,
          backgroundColor: C.navy,
          color: "#F7F5F0", ...T.cta, fontSize: 16, textDecoration: "none",
          boxShadow: "0 4px 16px rgba(14,26,43,0.15)",
          transition: "transform 200ms ease, box-shadow 200ms ease",
        }}
          onMouseEnter={(e) => { if (!canHover()) return; e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = "0 8px 24px rgba(14,26,43,0.20)"; }}
          onMouseLeave={(e) => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "0 4px 16px rgba(14,26,43,0.15)"; }}
        >
          Get Your Full Diagnostic — $69 &#8594;
        </a>

        <div style={{ marginTop: sp(3), display: "flex", alignItems: "center", justifyContent: "center", gap: sp(2), flexWrap: "wrap" }}>
          <Link href="/diagnostic-portal" style={{ ...T.meta, color: C.muted, textDecoration: "underline", textUnderlineOffset: 3 }}>
            Or start free
          </Link>
          <span style={{ color: C.light, fontSize: 11 }}>&bull;</span>
          <span style={{ ...T.meta, color: C.light }}>90 seconds</span>
          <span style={{ color: C.light, fontSize: 11 }}>&bull;</span>
          <span style={{ ...T.meta, color: C.light }}>30-day guarantee</span>
        </div>
      </div>
    </section>
  );
}


/* ================================================================== */
/* DISCLAIMER — today's version                                        */
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
    { "@type": "Question", name: "How long does it take?", acceptedAnswer: { "@type": "Answer", text: "About 90 seconds. Instant results." } },
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
      <HowItWorksSection />
      <WhatItMeasures />
      <ProductMockup />
      <PressureNarrative />
      <AuthorityBlock />
      <WhatYouGet />
      <WhyNowSection />
      <ProofSection />
      <TrustStrip />
      <PricingSection />
      <FaqSection openFaq={openFaq} setOpenFaq={setOpenFaq} />
      <FinalCta />
      <DisclaimerSection />
    </div>
  );
}
