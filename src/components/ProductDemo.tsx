"use client";

import { useState, useEffect, useRef, useCallback, useMemo } from "react";

/* ═══════════════════════════════════════════════════════════════════
   ProductDemo — Eclectic Masterpiece

   Organic flowing curves meet precise data.
   Particles scatter on risk, coalesce on resolution.
   Concentric rings radiate on the score reveal.
   Every scene has its own visual soul.
   ═══════════════════════════════════════════════════════════════════ */

const SERIF = "'DM Serif Display', Georgia, serif";
const SANS = "'Inter', system-ui, -apple-system, sans-serif";

const C = {
  ink: "#0A0F18",
  navy: "#0E1A2B",
  purple: "#4B3FAE",
  teal: "#1A7A6D",
  cream: "#F4F1EA",
  developing: "#92640A",
  limited: "#9B2C2C",
  lavender: "#7B6FE0",
};

/* ── Math ── */
function easeOutQuart(t: number) { return 1 - Math.pow(1 - t, 4); }
function easeInOutCubic(t: number) { return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2; }

/* ── Animated counter ── */
function useCounter(target: number, duration: number, active: boolean, delay = 0) {
  const [v, setV] = useState(0);
  useEffect(() => {
    if (!active) { setV(0); return; }
    let raf: number;
    let t0 = 0;
    const start = () => {
      t0 = performance.now();
      const tick = (now: number) => {
        const pr = Math.min((now - t0) / duration, 1);
        setV(Math.round(easeOutQuart(pr) * target));
        if (pr < 1) raf = requestAnimationFrame(tick);
      };
      raf = requestAnimationFrame(tick);
    };
    const timer = setTimeout(start, delay);
    return () => { clearTimeout(timer); cancelAnimationFrame(raf); };
  }, [target, duration, active, delay]);
  return v;
}

/* ── Seeded random for consistent particle positions ── */
function seededRandom(seed: number) {
  const x = Math.sin(seed * 127.1 + 311.7) * 43758.5453;
  return x - Math.floor(x);
}

/* ── Scene choreography ── */
const SCENES = [
  { id: "black",       duration: 1200 },
  { id: "hook1",       duration: 3600 },
  { id: "hook2",       duration: 3200 },
  { id: "breath1",     duration: 700  },
  { id: "method",      duration: 3000 },
  { id: "breath2",     duration: 600  },
  { id: "ringBuild",   duration: 5400 },
  { id: "band",        duration: 3200 },
  { id: "breath3",     duration: 500  },
  { id: "pages",       duration: 4200 },
  { id: "simulator",   duration: 5400 },
  { id: "breath4",     duration: 500  },
  { id: "riskFlash",   duration: 4400 },
  { id: "fix",         duration: 3600 },
  { id: "breath5",     duration: 600  },
  { id: "closer1",     duration: 3800 },
  { id: "closer2",     duration: 3200 },
  { id: "endFrame",    duration: 4200 },
];

const TOTAL = SCENES.reduce((s, sc) => s + sc.duration, 0);

/* ═══════════════════════════════════════════════════════════════════ */

export default function ProductDemo({ autoPlay = true }: { autoPlay?: boolean }) {
  const [idx, setIdx] = useState(-1);
  const [p, setP] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [globalTime, setGlobalTime] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const t0 = useRef(0);
  const globalT0 = useRef(0);
  const rafRef = useRef(0);

  const advance = useCallback(() => {
    setIdx(prev => {
      if (prev + 1 >= SCENES.length) {
        setTimeout(() => {
          setIdx(-1); setP(0);
          setTimeout(() => { t0.current = performance.now(); setIdx(0); }, 50);
        }, 1400);
        return prev;
      }
      t0.current = performance.now();
      return prev + 1;
    });
  }, []);

  useEffect(() => {
    if (!playing || idx < 0 || idx >= SCENES.length) return;
    const dur = SCENES[idx].duration;
    const tick = () => {
      const now = performance.now();
      const e = now - t0.current;
      setP(Math.min(e / dur, 1));
      setGlobalTime((now - globalT0.current) / 1000);
      if (e < dur) rafRef.current = requestAnimationFrame(tick);
      else advance();
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, [playing, idx, advance]);

  const play = useCallback(() => {
    setIdx(-1); setP(0); setPlaying(true);
    globalT0.current = performance.now();
    setTimeout(() => { t0.current = performance.now(); setIdx(0); }, 50);
  }, []);

  useEffect(() => {
    if (!autoPlay) return;
    const el = containerRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting && !playing) { play(); obs.disconnect(); }
    }, { threshold: 0.35 });
    obs.observe(el);
    return () => obs.disconnect();
  }, [autoPlay, playing, play]);

  const id = idx >= 0 && idx < SCENES.length ? SCENES[idx].id : "";

  /* ── Counters ── */
  const scoreNum = useCounter(48, 2400, id === "ringBuild", 600);
  const simTo = useCounter(67, 1600, id === "simulator" && p > 0.25, 0);
  const sliderPct = id === "simulator" && p > 0.2 ? easeInOutCubic(Math.min((p - 0.2) / 0.5, 1)) : 0;
  const ringProgress = id === "ringBuild" ? easeOutQuart(Math.min(p / 0.6, 1)) * (48 / 100) : 0;

  /* ── Particles (seeded, stable across renders) ── */
  const particles = useMemo(() =>
    Array.from({ length: 40 }, (_, i) => ({
      x: seededRandom(i * 2) * 100,
      y: seededRandom(i * 2 + 1) * 100,
      size: 1 + seededRandom(i * 3) * 2.5,
      speed: 0.3 + seededRandom(i * 4) * 0.7,
      phase: seededRandom(i * 5) * Math.PI * 2,
    })), []);

  /* ── Kinetic text ── */
  const kineticWords = (text: string, staggerMs: number) => {
    const words = text.split(" ");
    return words.map((word, i) => {
      const delay = (i * staggerMs) / (SCENES[idx]?.duration || 3000);
      const visible = p > delay;
      return (
        <span key={i} style={{
          display: "inline-block", marginRight: "0.32em",
          opacity: visible ? 1 : 0,
          transform: visible ? "translateY(0)" : "translateY(18px)",
          transition: "opacity 600ms ease-out, transform 700ms cubic-bezier(0.22, 1, 0.36, 1)",
        }}>
          {word}
        </span>
      );
    });
  };

  /* ── Determine if risk-related scene (for particle chaos) ── */
  const isRisk = id === "riskFlash";
  const isCalm = id === "fix" || id === "closer1" || id === "closer2" || id === "endFrame";

  return (
    <div
      ref={containerRef}
      style={{
        position: "relative",
        width: "100%",
        maxWidth: 760,
        margin: "0 auto",
        aspectRatio: "16 / 9",
        borderRadius: 16,
        overflow: "hidden",
        background: C.ink,
        boxShadow: "0 32px 100px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,255,255,0.04)",
      }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display&family=Inter:wght@200;300;400;500;600;700&display=swap');
        @keyframes demoFlash { 0% { opacity: 1; } 100% { opacity: 0; } }
        @keyframes demoMeshA {
          0%   { transform: translate(0%, 0%) scale(1); }
          33%  { transform: translate(18%, -12%) scale(1.15); }
          66%  { transform: translate(-8%, 15%) scale(0.9); }
          100% { transform: translate(0%, 0%) scale(1); }
        }
        @keyframes demoMeshB {
          0%   { transform: translate(0%, 0%) scale(1); }
          33%  { transform: translate(-15%, 10%) scale(1.1); }
          66%  { transform: translate(12%, -8%) scale(1.15); }
          100% { transform: translate(0%, 0%) scale(1); }
        }
        @keyframes demoMeshC {
          0%   { transform: translate(0%, 0%) scale(1); }
          33%  { transform: translate(10%, 18%) scale(1.12); }
          66%  { transform: translate(-14%, -10%) scale(0.88); }
          100% { transform: translate(0%, 0%) scale(1); }
        }
        @keyframes demoFloat {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-6px); }
        }
        @keyframes demoRingPulse {
          0%, 100% { opacity: 0.15; transform: scale(1); }
          50% { opacity: 0.25; transform: scale(1.02); }
        }
      `}</style>

      {/* ══════════════════════════════════════════════════ */}
      {/* LAYER 1: Gradient mesh — organic color movement    */}
      {/* ══════════════════════════════════════════════════ */}
      <div style={{
        position: "absolute", inset: "-50%", pointerEvents: "none",
        opacity: id === "black" ? 0 : 0.7,
        transition: "opacity 2.5s ease",
      }}>
        <div style={{
          position: "absolute", top: "10%", left: "25%", width: "55%", height: "55%",
          borderRadius: "50%",
          background: `radial-gradient(circle, rgba(75,63,174,${isRisk ? 0.20 : 0.12}) 0%, transparent 70%)`,
          filter: "blur(70px)",
          animation: "demoMeshA 26s ease-in-out infinite",
          transition: "background 1s ease",
        }} />
        <div style={{
          position: "absolute", top: "35%", left: "45%", width: "50%", height: "50%",
          borderRadius: "50%",
          background: `radial-gradient(circle, rgba(26,122,109,${isCalm ? 0.14 : 0.08}) 0%, transparent 70%)`,
          filter: "blur(55px)",
          animation: "demoMeshB 30s ease-in-out infinite",
          transition: "background 1s ease",
        }} />
        <div style={{
          position: "absolute", top: "20%", left: "8%", width: "40%", height: "45%",
          borderRadius: "50%",
          background: `radial-gradient(circle, rgba(123,111,224,${isRisk ? 0.02 : 0.05}) 0%, transparent 70%)`,
          filter: "blur(50px)",
          animation: "demoMeshC 34s ease-in-out infinite",
          transition: "background 1s ease",
        }} />
        {/* Risk: warm red bloom */}
        {isRisk && (
          <div style={{
            position: "absolute", top: "30%", left: "30%", width: "40%", height: "40%",
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(155,44,44,0.12) 0%, transparent 65%)",
            filter: "blur(40px)",
            opacity: Math.min(p / 0.1, 1),
            transition: "opacity 400ms ease",
          }} />
        )}
      </div>

      {/* ══════════════════════════════════════════════════ */}
      {/* LAYER 2: Floating particles — alive, responsive    */}
      {/* ══════════════════════════════════════════════════ */}
      <div style={{ position: "absolute", inset: 0, pointerEvents: "none", opacity: id === "black" ? 0 : 0.6, transition: "opacity 2s ease" }}>
        {particles.map((pt, i) => {
          const t = globalTime * pt.speed + pt.phase;
          const drift = isRisk ? 12 : 3;
          const scatter = isRisk ? (seededRandom(i * 7) - 0.5) * 40 : 0;
          const x = pt.x + Math.sin(t * 0.7) * drift + scatter;
          const y = pt.y + Math.cos(t * 0.5) * drift + (isRisk ? (seededRandom(i * 8) - 0.5) * 30 : 0);
          const opacity = isRisk ? 0.08 + seededRandom(i * 9) * 0.15 : (isCalm ? 0.06 + seededRandom(i * 9) * 0.12 : 0.04 + seededRandom(i * 9) * 0.08);
          const color = isRisk ? C.limited : (i % 3 === 0 ? C.teal : i % 3 === 1 ? C.purple : C.lavender);
          return (
            <div key={i} style={{
              position: "absolute",
              left: `${Math.max(0, Math.min(100, x))}%`,
              top: `${Math.max(0, Math.min(100, y))}%`,
              width: pt.size,
              height: pt.size,
              borderRadius: "50%",
              background: color,
              opacity,
              transition: isRisk ? "all 600ms ease" : "all 2s ease",
              boxShadow: pt.size > 2.5 ? `0 0 ${pt.size * 3}px ${color}44` : "none",
            }} />
          );
        })}
      </div>

      {/* ══════════════════════════════════════════════════ */}
      {/* LAYER 3: Flowing abstract curves — organic lines   */}
      {/* ══════════════════════════════════════════════════ */}
      {id !== "black" && !id.startsWith("breath") && (
        <svg style={{ position: "absolute", inset: 0, width: "100%", height: "100%", pointerEvents: "none", opacity: 0.06 }} viewBox="0 0 760 428" preserveAspectRatio="none">
          <defs>
            <linearGradient id="curveGrad1" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor={C.teal} stopOpacity="0" />
              <stop offset="50%" stopColor={C.teal} stopOpacity="1" />
              <stop offset="100%" stopColor={C.purple} stopOpacity="0" />
            </linearGradient>
            <linearGradient id="curveGrad2" x1="1" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={C.purple} stopOpacity="0" />
              <stop offset="50%" stopColor={C.lavender} stopOpacity="0.8" />
              <stop offset="100%" stopColor={C.teal} stopOpacity="0" />
            </linearGradient>
          </defs>
          {/* Curve 1 — sweeping arc */}
          <path
            d={`M -50,${300 + Math.sin(globalTime * 0.3) * 30} Q ${200 + Math.sin(globalTime * 0.2) * 50},${150 + Math.cos(globalTime * 0.25) * 40} ${500 + Math.sin(globalTime * 0.15) * 30},${350 + Math.cos(globalTime * 0.2) * 25} T 810,${200 + Math.sin(globalTime * 0.18) * 35}`}
            fill="none" stroke="url(#curveGrad1)" strokeWidth="1.5"
          />
          {/* Curve 2 — counter arc */}
          <path
            d={`M -30,${100 + Math.cos(globalTime * 0.22) * 25} Q ${300 + Math.cos(globalTime * 0.18) * 40},${320 + Math.sin(globalTime * 0.28) * 35} ${600 + Math.cos(globalTime * 0.2) * 30},${80 + Math.sin(globalTime * 0.15) * 30} T 790,${280 + Math.cos(globalTime * 0.22) * 25}`}
            fill="none" stroke="url(#curveGrad2)" strokeWidth="1"
          />
        </svg>
      )}

      {/* ══════════════════════════════════════════════════ */}
      {/* LAYER 4: Film grain                                */}
      {/* ══════════════════════════════════════════════════ */}
      <div style={{
        position: "absolute", inset: 0, pointerEvents: "none", zIndex: 10, mixBlendMode: "overlay", opacity: 0.04,
        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='256' height='256' filter='url(%23n)' opacity='1'/%3E%3C/svg%3E")`,
        backgroundSize: "128px 128px",
      }} />

      {/* ══════════════════════════════════════════════════ */}
      {/* LAYER 5: Content                                   */}
      {/* ══════════════════════════════════════════════════ */}
      <div style={{
        position: "relative", zIndex: 5, width: "100%", height: "100%",
        display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
        padding: "28px 48px",
        fontFamily: SANS,
      }}>

        {id === "black" && <div />}
        {id.startsWith("breath") && <div />}

        {/* ═══ HOOK 1 — word by word ═══ */}
        {id === "hook1" && (
          <div style={{ textAlign: "center", maxWidth: 500 }}>
            <p style={{
              fontFamily: SERIF, fontSize: 34, fontWeight: 400,
              color: C.cream, lineHeight: 1.22, letterSpacing: "-0.025em",
              margin: 0,
            }}>
              {kineticWords("What happens to your income if your biggest client leaves tomorrow?", 170)}
            </p>
          </div>
        )}

        {/* ═══ HOOK 2 ═══ */}
        {id === "hook2" && (
          <div style={{
            textAlign: "center", maxWidth: 380,
            opacity: p < 0.82 ? Math.min(p / 0.15, 1) : Math.max(0, 1 - (p - 0.82) / 0.18),
            transform: `translateY(${(1 - Math.min(p / 0.15, 1)) * 6}px)`,
          }}>
            <p style={{ fontFamily: SERIF, fontSize: 20, fontWeight: 400, color: "rgba(244,241,234,0.50)", lineHeight: 1.55, letterSpacing: "-0.01em", margin: 0 }}>
              Most people don&rsquo;t know the answer.
            </p>
          </div>
        )}

        {/* ═══ METHOD ═══ */}
        {id === "method" && (
          <div style={{
            textAlign: "center",
            opacity: p < 0.82 ? Math.min(p / 0.18, 1) : Math.max(0, 1 - (p - 0.82) / 0.18),
          }}>
            <div style={{
              fontSize: 11, fontWeight: 600, letterSpacing: "0.18em",
              textTransform: "uppercase" as const, color: C.teal, marginBottom: 22,
              opacity: p > 0.08 ? 1 : 0, transition: "opacity 700ms ease",
            }}>
              Under two minutes
            </div>
            <p style={{
              fontFamily: SERIF, fontSize: 17, fontWeight: 400, color: "rgba(244,241,234,0.42)",
              lineHeight: 1.6, letterSpacing: "-0.01em", margin: 0, maxWidth: 300,
            }}>
              A short structural diagnostic.<br />No bank connection. No credit pull.
            </p>
          </div>
        )}

        {/* ═══ SCORE RING — with concentric pulse rings ═══ */}
        {id === "ringBuild" && (
          <div style={{ textAlign: "center" }}>
            <div style={{ position: "relative", width: 220, height: 220, margin: "0 auto" }}>
              {/* Concentric pulse rings — radiating outward */}
              {[1, 2, 3].map(ring => (
                <div key={ring} style={{
                  position: "absolute", inset: `${-ring * 18}px`,
                  borderRadius: "50%",
                  border: `1px solid rgba(75,63,174,${0.04 / ring})`,
                  opacity: p > 0.3 ? 1 : 0,
                  transform: `scale(${p > 0.3 ? 1 : 0.9})`,
                  transition: `all ${800 + ring * 200}ms cubic-bezier(0.22, 1, 0.36, 1) ${ring * 150}ms`,
                  animation: p > 0.5 ? `demoRingPulse ${3 + ring}s ease-in-out infinite ${ring * 0.5}s` : "none",
                }} />
              ))}

              <svg viewBox="0 0 200 200" style={{ width: "100%", height: "100%", transform: "rotate(-90deg)", position: "relative", zIndex: 2 }}>
                <defs>
                  <linearGradient id="demoRingGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor={C.teal} />
                    <stop offset="50%" stopColor={C.purple} />
                    <stop offset="100%" stopColor={C.lavender} />
                  </linearGradient>
                </defs>
                <circle cx="100" cy="100" r="85" fill="none" stroke="rgba(244,241,234,0.04)" strokeWidth="2.5" />
                <circle cx="100" cy="100" r="85" fill="none" stroke="url(#demoRingGrad)" strokeWidth="3"
                  strokeLinecap="round"
                  strokeDasharray={2 * Math.PI * 85}
                  strokeDashoffset={(2 * Math.PI * 85) * (1 - ringProgress)}
                />
                {ringProgress > 0.05 && (() => {
                  const angle = ringProgress * 2 * Math.PI;
                  const x = 100 + 85 * Math.cos(angle - Math.PI / 2);
                  const y = 100 + 85 * Math.sin(angle - Math.PI / 2);
                  return (
                    <>
                      <circle cx={x} cy={y} r="8" fill={`${C.teal}22`} style={{ filter: "blur(4px)" }} />
                      <circle cx={x} cy={y} r="3" fill={C.teal} opacity="0.8" />
                    </>
                  );
                })()}
              </svg>

              <div style={{
                position: "absolute", inset: 0, zIndex: 3,
                display: "flex", alignItems: "center", justifyContent: "center",
              }}>
                <span style={{
                  fontSize: 80, fontWeight: 200, color: C.cream,
                  letterSpacing: "-0.05em", fontVariantNumeric: "tabular-nums",
                  fontFamily: SANS, lineHeight: 1,
                  opacity: p > 0.1 ? 1 : 0, transition: "opacity 500ms ease",
                }}>
                  {scoreNum}
                </span>
              </div>
            </div>
            <div style={{
              marginTop: 20, fontSize: 13, fontWeight: 400,
              color: "rgba(244,241,234,0.30)", letterSpacing: "0.08em",
              opacity: p > 0.55 ? Math.min((p - 0.55) / 0.12, 1) : 0,
            }}>
              out of 100
            </div>
          </div>
        )}

        {/* ═══ BAND ═══ */}
        {id === "band" && (
          <div style={{
            textAlign: "center",
            opacity: p < 0.82 ? Math.min(p / 0.15, 1) : Math.max(0, 1 - (p - 0.82) / 0.18),
          }}>
            <div style={{
              display: "inline-flex", alignItems: "center", gap: 10,
              padding: "12px 32px", borderRadius: 100,
              background: "rgba(146,100,10,0.06)",
              border: "1px solid rgba(146,100,10,0.14)",
            }}>
              <div style={{ width: 7, height: 7, borderRadius: "50%", background: C.developing }} />
              <span style={{ fontSize: 15, fontWeight: 500, color: C.developing, letterSpacing: "0.01em" }}>
                Developing Stability
              </span>
            </div>
            <div style={{
              marginTop: 20, fontFamily: SERIF, fontSize: 14, color: "rgba(244,241,234,0.32)",
              opacity: p > 0.3 ? 1 : 0, transition: "opacity 700ms ease",
              letterSpacing: "-0.01em",
            }}>
              34th percentile among professionals
            </div>
          </div>
        )}

        {/* ═══ PAGES ═══ */}
        {id === "pages" && (
          <div style={{ textAlign: "center", width: "100%", opacity: p < 0.82 ? 1 : Math.max(0, 1 - (p - 0.82) / 0.18) }}>
            <div style={{
              fontFamily: SERIF, fontSize: 16, fontWeight: 400, color: "rgba(244,241,234,0.38)",
              marginBottom: 32, letterSpacing: "-0.01em",
              opacity: p > 0.05 ? 1 : 0, transition: "opacity 700ms ease",
            }}>
              Five pages. Every number is yours.
            </div>
            <div style={{ display: "flex", justifyContent: "center", gap: 10 }}>
              {["Score", "Structure", "Risks", "Deep Dive", "Action"].map((label, i) => (
                <div key={label} style={{
                  width: 80, height: 106, borderRadius: 10,
                  background: "rgba(244,241,234,0.025)",
                  border: "1px solid rgba(244,241,234,0.05)",
                  display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
                  gap: 10,
                  opacity: p > (0.1 + i * 0.08) ? 1 : 0,
                  transform: p > (0.1 + i * 0.08) ? "translateY(0) scale(1)" : "translateY(28px) scale(0.93)",
                  transition: `all 900ms cubic-bezier(0.22, 1, 0.36, 1) ${i * 70}ms`,
                  animation: p > (0.4 + i * 0.08) ? `demoFloat ${3 + i * 0.4}s ease-in-out infinite ${i * 0.3}s` : "none",
                }}>
                  <span style={{ fontSize: 10, fontWeight: 700, color: C.purple, opacity: 0.45 }}>0{i + 1}</span>
                  <span style={{ fontSize: 10, fontWeight: 500, color: "rgba(244,241,234,0.45)" }}>{label}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ═══ SIMULATOR ═══ */}
        {id === "simulator" && (
          <div style={{ width: "100%", maxWidth: 360, opacity: p < 0.86 ? Math.min(p / 0.1, 1) : Math.max(0, 1 - (p - 0.86) / 0.14) }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 28 }}>
              <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase" as const, color: C.teal }}>Score Simulator&#8482;</span>
              <span style={{ fontSize: 9, fontWeight: 500, letterSpacing: "0.08em", color: "rgba(244,241,234,0.20)" }}>LIVE</span>
            </div>

            <div style={{ display: "flex", gap: 2, borderRadius: 8, overflow: "hidden", marginBottom: 28 }}>
              {[
                { label: "CURRENT", value: "48", color: C.cream },
                { label: "SIMULATED", value: p > 0.3 ? String(simTo) : "48", color: p > 0.3 ? C.teal : "rgba(244,241,234,0.5)" },
                { label: "IMPACT", value: p > 0.3 ? `+${simTo - 48}` : "\u2014", color: p > 0.3 ? C.teal : "rgba(244,241,234,0.18)" },
              ].map(col => (
                <div key={col.label} style={{ flex: 1, background: "rgba(244,241,234,0.025)", padding: "14px 8px", textAlign: "center" }}>
                  <div style={{ fontSize: 7, fontWeight: 700, letterSpacing: "0.14em", color: "rgba(244,241,234,0.18)", marginBottom: 6 }}>{col.label}</div>
                  <div style={{ fontSize: 28, fontWeight: 200, color: col.color, fontFamily: SANS, lineHeight: 1, transition: "color 600ms ease", letterSpacing: "-0.03em" }}>{col.value}</div>
                </div>
              ))}
            </div>

            <div>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 10 }}>
                <span style={{ fontSize: 12, fontWeight: 400, color: "rgba(244,241,234,0.45)" }}>Recurring Revenue</span>
                <span style={{ fontSize: 12, fontWeight: 600, color: C.teal, fontVariantNumeric: "tabular-nums" }}>{Math.round(15 + sliderPct * 45)}%</span>
              </div>
              <div style={{ height: 2, borderRadius: 1, background: "rgba(244,241,234,0.06)", position: "relative" }}>
                <div style={{ height: "100%", borderRadius: 1, background: `linear-gradient(90deg, ${C.teal}99, ${C.purple})`, width: `${15 + sliderPct * 45}%`, transition: "width 60ms linear" }} />
                <div style={{
                  position: "absolute", top: "50%", left: `${15 + sliderPct * 45}%`,
                  transform: "translate(-50%, -50%)",
                  width: 14, height: 14, borderRadius: "50%",
                  background: C.cream, border: `2px solid ${C.teal}`,
                  boxShadow: `0 0 20px rgba(26,122,109,0.3)`,
                  transition: "left 60ms linear",
                }} />
              </div>
            </div>
          </div>
        )}

        {/* ═══ RISK — particles scatter, red bloom ═══ */}
        {id === "riskFlash" && (
          <div style={{ textAlign: "center", width: "100%", maxWidth: 360 }}>
            {p < 0.12 && (
              <div style={{
                position: "absolute", inset: 0, zIndex: 6, pointerEvents: "none",
                background: "radial-gradient(circle at 50% 50%, rgba(155,44,44,0.18) 0%, transparent 65%)",
                animation: "demoFlash 700ms ease-out forwards",
              }} />
            )}
            <div style={{
              opacity: p < 0.82 ? Math.min(p / 0.1, 1) : Math.max(0, 1 - (p - 0.82) / 0.18),
            }}>
              <div style={{ fontFamily: SERIF, fontSize: 15, fontWeight: 400, color: "rgba(244,241,234,0.40)", marginBottom: 28, letterSpacing: "-0.01em" }}>
                If you lose your top client
              </div>
              <div style={{ display: "flex", alignItems: "baseline", justifyContent: "center", gap: 18 }}>
                <span style={{ fontSize: 60, fontWeight: 200, fontFamily: SANS, color: C.cream, letterSpacing: "-0.05em" }}>48</span>
                <span style={{ fontSize: 18, color: "rgba(244,241,234,0.15)" }}>&rarr;</span>
                <span style={{ fontSize: 60, fontWeight: 200, fontFamily: SANS, color: C.limited, letterSpacing: "-0.05em",
                  opacity: p > 0.18 ? 1 : 0, transition: "opacity 600ms ease",
                }}>31</span>
              </div>
            </div>
          </div>
        )}

        {/* ═══ FIX — particles coalesce, teal returns ═══ */}
        {id === "fix" && (
          <div style={{
            textAlign: "center",
            opacity: p < 0.82 ? Math.min(p / 0.15, 1) : Math.max(0, 1 - (p - 0.82) / 0.18),
          }}>
            <div style={{ fontFamily: SERIF, fontSize: 15, fontWeight: 400, color: "rgba(244,241,234,0.40)", marginBottom: 28, letterSpacing: "-0.01em" }}>
              Secure a monthly retainer
            </div>
            <span style={{ fontSize: 60, fontWeight: 200, fontFamily: SANS, color: C.teal, letterSpacing: "-0.05em" }}>
              +12
            </span>
          </div>
        )}

        {/* ═══ CLOSER 1 ═══ */}
        {id === "closer1" && (
          <div style={{ textAlign: "center", maxWidth: 480 }}>
            <p style={{
              fontFamily: SERIF, fontSize: 36, fontWeight: 400,
              color: C.cream, lineHeight: 1.2, letterSpacing: "-0.025em", margin: 0,
              opacity: Math.min(p / 0.18, 1),
              transform: `translateY(${(1 - Math.min(p / 0.18, 1)) * 10}px)`,
              transition: "transform 1.4s cubic-bezier(0.22, 1, 0.36, 1)",
            }}>
              Your income has a structure.
            </p>
          </div>
        )}

        {/* ═══ CLOSER 2 ═══ */}
        {id === "closer2" && (
          <div style={{ textAlign: "center", maxWidth: 480 }}>
            <p style={{
              fontFamily: SERIF, fontSize: 36, fontWeight: 400,
              color: "rgba(244,241,234,0.42)", lineHeight: 1.2,
              letterSpacing: "-0.025em", margin: 0,
              opacity: Math.min(p / 0.2, 1),
            }}>
              Now you can see it.
            </p>
          </div>
        )}

        {/* ═══ END FRAME ═══ */}
        {id === "endFrame" && (
          <div style={{ textAlign: "center", opacity: Math.min(p / 0.18, 1) }}>
            <p style={{
              fontFamily: SERIF, fontSize: 30, fontWeight: 400,
              color: C.cream, lineHeight: 1.3, letterSpacing: "-0.02em",
              margin: "0 0 36px",
            }}>
              What&rsquo;s your number?
            </p>
            <div style={{
              display: "inline-flex", alignItems: "center", justifyContent: "center",
              padding: "15px 48px", borderRadius: 14,
              background: C.cream,
              opacity: p > 0.22 ? 1 : 0,
              transform: p > 0.22 ? "translateY(0)" : "translateY(6px)",
              transition: "all 800ms cubic-bezier(0.22, 1, 0.36, 1)",
            }}>
              <span style={{ fontSize: 15, fontWeight: 600, color: C.navy, letterSpacing: "-0.01em" }}>
                Get My Free Score
              </span>
            </div>
            <div style={{
              marginTop: 22, fontSize: 11, fontWeight: 400, letterSpacing: "0.08em",
              color: "rgba(244,241,234,0.25)",
              opacity: p > 0.38 ? 1 : 0, transition: "opacity 800ms ease",
            }}>
              Free &middot; Under 2 minutes &middot; No bank connection
            </div>
          </div>
        )}

        {idx < 0 && !playing && <div />}
      </div>

      {/* ── Progress — barely there ── */}
      {playing && idx >= 0 && idx < SCENES.length && (
        <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: 1, background: "rgba(244,241,234,0.03)", zIndex: 11 }}>
          <div style={{
            height: "100%",
            background: `linear-gradient(90deg, ${C.teal}55, ${C.purple}55)`,
            width: `${((SCENES.slice(0, idx).reduce((s, sc) => s + sc.duration, 0) + p * (SCENES[idx]?.duration || 0)) / TOTAL) * 100}%`,
            transition: "width 60ms linear",
          }} />
        </div>
      )}
    </div>
  );
}
