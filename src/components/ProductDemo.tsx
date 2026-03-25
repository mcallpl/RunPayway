"use client";

import { useState, useEffect, useRef, useCallback } from "react";

/* ═══════════════════════════════════════════════════════════════════
   ProductDemo — Cinematic installation piece

   Treat it like the lead at a world-renowned art gallery.
   Every frame is a composition. Every transition is deliberate.
   Silence between the notes.
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
        const p = Math.min((now - t0) / duration, 1);
        setV(Math.round(easeOutQuart(p) * target));
        if (p < 1) raf = requestAnimationFrame(tick);
      };
      raf = requestAnimationFrame(tick);
    };
    const timer = setTimeout(start, delay);
    return () => { clearTimeout(timer); cancelAnimationFrame(raf); };
  }, [target, duration, active, delay]);
  return v;
}

/* ── Scene choreography ── */
const SCENES = [
  { id: "black",       duration: 1400 },
  { id: "hook1",       duration: 3200 },
  { id: "hook2",       duration: 3000 },
  { id: "breath1",     duration: 800  },
  { id: "method",      duration: 2800 },
  { id: "breath2",     duration: 600  },
  { id: "ringBuild",   duration: 5000 },
  { id: "band",        duration: 3200 },
  { id: "breath3",     duration: 500  },
  { id: "pages",       duration: 4000 },
  { id: "simulator",   duration: 5200 },
  { id: "breath4",     duration: 500  },
  { id: "riskFlash",   duration: 4200 },
  { id: "fix",         duration: 3400 },
  { id: "breath5",     duration: 600  },
  { id: "closer1",     duration: 3600 },
  { id: "closer2",     duration: 3000 },
  { id: "endFrame",    duration: 4000 },
];

const TOTAL = SCENES.reduce((s, sc) => s + sc.duration, 0);

/* ═══════════════════════════════════════════════════════════════════ */

export default function ProductDemo({ autoPlay = true }: { autoPlay?: boolean }) {
  const [idx, setIdx] = useState(-1);
  const [p, setP] = useState(0); // progress 0..1 within scene
  const [playing, setPlaying] = useState(false);
  const [played, setPlayed] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const t0 = useRef(0);
  const rafRef = useRef(0);

  const advance = useCallback(() => {
    setIdx(prev => {
      if (prev + 1 >= SCENES.length) { setPlaying(false); setPlayed(true); return prev; }
      t0.current = performance.now();
      return prev + 1;
    });
  }, []);

  useEffect(() => {
    if (!playing || idx < 0 || idx >= SCENES.length) return;
    const dur = SCENES[idx].duration;
    const tick = () => {
      const e = performance.now() - t0.current;
      setP(Math.min(e / dur, 1));
      if (e < dur) rafRef.current = requestAnimationFrame(tick);
      else advance();
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, [playing, idx, advance]);

  const play = useCallback(() => {
    setIdx(-1); setP(0); setPlaying(true); setPlayed(false);
    setTimeout(() => { t0.current = performance.now(); setIdx(0); }, 50);
  }, []);

  /* Auto-play on scroll into view */
  useEffect(() => {
    if (!autoPlay || played) return;
    const el = containerRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting && !playing && !played) { play(); obs.disconnect(); }
    }, { threshold: 0.35 });
    obs.observe(el);
    return () => obs.disconnect();
  }, [autoPlay, playing, played, play]);

  const id = idx >= 0 && idx < SCENES.length ? SCENES[idx].id : "";

  /* ── Counters ── */
  const scoreNum = useCounter(48, 2400, id === "ringBuild", 400);
  const simTo = useCounter(67, 1600, id === "simulator" && p > 0.25, 0);
  const sliderPct = id === "simulator" && p > 0.2 ? easeInOutCubic(Math.min((p - 0.2) / 0.5, 1)) : 0;
  const ringProgress = id === "ringBuild" ? easeOutQuart(Math.min(p / 0.65, 1)) * (48 / 100) : 0;

  /* ── Word-by-word kinetic text ── */
  const kineticWords = (text: string, staggerMs: number) => {
    const words = text.split(" ");
    return words.map((word, i) => {
      const wordDelay = (i * staggerMs) / (SCENES[idx]?.duration || 3000);
      const visible = p > wordDelay;
      return (
        <span key={i} style={{
          display: "inline-block", marginRight: "0.3em",
          opacity: visible ? 1 : 0,
          transform: visible ? "translateY(0)" : "translateY(14px)",
          transition: "opacity 500ms ease-out, transform 600ms cubic-bezier(0.22, 1, 0.36, 1)",
        }}>
          {word}
        </span>
      );
    });
  };

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
        cursor: !playing ? "pointer" : "default",
        boxShadow: "0 32px 100px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,255,255,0.03)",
      }}
      onClick={() => { if (!playing) play(); }}
    >
      {/* ── Styles ── */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display&family=Inter:wght@300;400;500;600;700&display=swap');
        @keyframes demoFlash { 0% { opacity: 0.8; } 100% { opacity: 0; } }
        @keyframes demoCursorBlink { 0%,100% { opacity: 1; } 50% { opacity: 0; } }
      `}</style>

      {/* ── Film grain overlay ── */}
      <div style={{
        position: "absolute", inset: 0, pointerEvents: "none", zIndex: 10, mixBlendMode: "overlay", opacity: 0.04,
        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='256' height='256' filter='url(%23n)' opacity='1'/%3E%3C/svg%3E")`,
        backgroundSize: "128px 128px",
      }} />

      {/* ── Ambient light — very subtle ── */}
      <div style={{
        position: "absolute", inset: 0, pointerEvents: "none",
        background: "radial-gradient(ellipse at 50% 45%, rgba(75,63,174,0.06) 0%, transparent 65%)",
        opacity: id === "black" || id.startsWith("breath") ? 0 : 0.8,
        transition: "opacity 1s ease",
      }} />

      {/* ── Content ── */}
      <div style={{
        position: "relative", zIndex: 2, width: "100%", height: "100%",
        display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
        padding: "28px 48px",
        fontFamily: SANS,
      }}>

        {/* ═══ BLACK — emptiness ═══ */}
        {id === "black" && <div />}

        {/* ═══ HOOK 1 — word by word, the anxiety trigger ═══ */}
        {id === "hook1" && (
          <div style={{ textAlign: "center", maxWidth: 480 }}>
            <p style={{
              fontFamily: SERIF, fontSize: 30, fontWeight: 400,
              color: C.cream, lineHeight: 1.25, letterSpacing: "-0.02em",
              margin: 0,
            }}>
              {kineticWords("What happens to your income if your biggest client leaves tomorrow?", 180)}
            </p>
          </div>
        )}

        {/* ═══ HOOK 2 — the uncomfortable truth ═══ */}
        {id === "hook2" && (
          <div style={{
            textAlign: "center", maxWidth: 360,
            opacity: p < 0.85 ? Math.min(p / 0.15, 1) : Math.max(0, 1 - (p - 0.85) / 0.15),
            transform: `translateY(${(1 - Math.min(p / 0.15, 1)) * 6}px)`,
          }}>
            <p style={{ fontSize: 16, fontWeight: 400, color: "rgba(244,241,234,0.35)", lineHeight: 1.7, margin: 0 }}>
              Most people don&rsquo;t know the answer.
            </p>
          </div>
        )}

        {/* ═══ BREATHS — empty beats ═══ */}
        {id.startsWith("breath") && <div />}

        {/* ═══ METHOD — how it works ═══ */}
        {id === "method" && (
          <div style={{
            textAlign: "center",
            opacity: p < 0.85 ? Math.min(p / 0.18, 1) : Math.max(0, 1 - (p - 0.85) / 0.15),
          }}>
            <div style={{
              fontSize: 12, fontWeight: 500, letterSpacing: "0.12em",
              textTransform: "uppercase" as const, color: C.teal, marginBottom: 16,
              opacity: p > 0.08 ? 1 : 0, transition: "opacity 600ms ease",
            }}>
              Under 2 minutes
            </div>
            <p style={{
              fontSize: 15, fontWeight: 400, color: "rgba(244,241,234,0.3)",
              lineHeight: 1.7, margin: 0, maxWidth: 320,
            }}>
              A short structural diagnostic.<br />No bank connection. No credit pull.
            </p>
          </div>
        )}

        {/* ═══ SCORE RING — the centerpiece ═══ */}
        {id === "ringBuild" && (
          <div style={{ textAlign: "center" }}>
            <div style={{ position: "relative", width: 200, height: 200, margin: "0 auto" }}>
              <svg viewBox="0 0 200 200" style={{ width: "100%", height: "100%", transform: "rotate(-90deg)" }}>
                <defs>
                  <linearGradient id="demoRingGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor={C.teal} />
                    <stop offset="50%" stopColor={C.purple} />
                    <stop offset="100%" stopColor="#7B6FE0" />
                  </linearGradient>
                </defs>
                {/* Track */}
                <circle cx="100" cy="100" r="82" fill="none" stroke="rgba(244,241,234,0.04)" strokeWidth="3" />
                {/* Arc — draws in */}
                <circle cx="100" cy="100" r="82" fill="none" stroke="url(#demoRingGrad)" strokeWidth="3.5"
                  strokeLinecap="round"
                  strokeDasharray={2 * Math.PI * 82}
                  strokeDashoffset={(2 * Math.PI * 82) * (1 - ringProgress)}
                />
                {/* Glow dot at end of arc */}
                {ringProgress > 0.05 && (() => {
                  const angle = ringProgress * 2 * Math.PI;
                  const x = 100 + 82 * Math.cos(angle - Math.PI / 2);  // -90deg offset
                  const y = 100 + 82 * Math.sin(angle - Math.PI / 2);
                  return <circle cx={x} cy={y} r="5" fill="rgba(26,122,109,0.4)" style={{ filter: "blur(3px)" }} />;
                })()}
              </svg>
              {/* Number in center */}
              <div style={{
                position: "absolute", inset: 0,
                display: "flex", alignItems: "center", justifyContent: "center",
              }}>
                <span style={{
                  fontSize: 72, fontWeight: 300, color: C.cream,
                  letterSpacing: "-0.04em", fontVariantNumeric: "tabular-nums",
                  fontFamily: SANS, lineHeight: 1,
                  opacity: p > 0.08 ? 1 : 0,
                  transition: "opacity 400ms ease",
                }}>
                  {scoreNum}
                </span>
              </div>
            </div>
            {/* "out of 100" — arrives late */}
            <div style={{
              marginTop: 16, fontSize: 13, fontWeight: 400,
              color: "rgba(244,241,234,0.2)", letterSpacing: "0.06em",
              opacity: p > 0.55 ? Math.min((p - 0.55) / 0.12, 1) : 0,
            }}>
              out of 100
            </div>
          </div>
        )}

        {/* ═══ BAND — classification ═══ */}
        {id === "band" && (
          <div style={{
            textAlign: "center",
            opacity: p < 0.82 ? Math.min(p / 0.15, 1) : Math.max(0, 1 - (p - 0.82) / 0.18),
          }}>
            <div style={{
              display: "inline-flex", alignItems: "center", gap: 10,
              padding: "10px 28px", borderRadius: 100,
              background: "rgba(146,100,10,0.06)",
              border: "1px solid rgba(146,100,10,0.12)",
            }}>
              <div style={{ width: 7, height: 7, borderRadius: "50%", background: C.developing }} />
              <span style={{ fontSize: 14, fontWeight: 500, color: C.developing, letterSpacing: "0.01em" }}>
                Developing Stability
              </span>
            </div>
            <div style={{
              marginTop: 18, fontSize: 13, color: "rgba(244,241,234,0.22)",
              opacity: p > 0.3 ? 1 : 0, transition: "opacity 700ms ease",
            }}>
              34th percentile
            </div>
          </div>
        )}

        {/* ═══ PAGES — five cards, staggered ═══ */}
        {id === "pages" && (
          <div style={{ textAlign: "center", width: "100%", opacity: p < 0.85 ? 1 : Math.max(0, 1 - (p - 0.85) / 0.15) }}>
            <div style={{
              fontSize: 12, fontWeight: 400, color: "rgba(244,241,234,0.25)",
              marginBottom: 28, letterSpacing: "0.04em",
              opacity: p > 0.05 ? 1 : 0, transition: "opacity 600ms ease",
            }}>
              Five pages. Every number is yours.
            </div>
            <div style={{ display: "flex", justifyContent: "center", gap: 10 }}>
              {["Score", "Structure", "Risks", "Deep Dive", "Action"].map((label, i) => (
                <div key={label} style={{
                  width: 76, height: 100, borderRadius: 8,
                  background: "rgba(244,241,234,0.02)",
                  border: "1px solid rgba(244,241,234,0.05)",
                  display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
                  gap: 8,
                  opacity: p > (0.08 + i * 0.07) ? 1 : 0,
                  transform: p > (0.08 + i * 0.07) ? "translateY(0) scale(1)" : "translateY(24px) scale(0.95)",
                  transition: `all 800ms cubic-bezier(0.22, 1, 0.36, 1) ${i * 60}ms`,
                }}>
                  <span style={{ fontSize: 9, fontWeight: 700, color: C.purple, opacity: 0.5 }}>0{i + 1}</span>
                  <span style={{ fontSize: 9, fontWeight: 500, color: "rgba(244,241,234,0.4)" }}>{label}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ═══ SIMULATOR — the slider drags itself ═══ */}
        {id === "simulator" && (
          <div style={{ width: "100%", maxWidth: 360, opacity: p < 0.88 ? Math.min(p / 0.1, 1) : Math.max(0, 1 - (p - 0.88) / 0.12) }}>
            {/* Header */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 28 }}>
              <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase" as const, color: C.teal }}>Score Simulator&#8482;</span>
              <span style={{ fontSize: 9, color: "rgba(244,241,234,0.15)" }}>LIVE</span>
            </div>

            {/* Triptych */}
            <div style={{ display: "flex", gap: 2, borderRadius: 8, overflow: "hidden", marginBottom: 28 }}>
              {[
                { label: "CURRENT", value: "48", color: C.cream },
                { label: "SIMULATED", value: p > 0.3 ? String(simTo) : "48", color: p > 0.3 ? C.teal : "rgba(244,241,234,0.5)" },
                { label: "IMPACT", value: p > 0.3 ? `+${simTo - 48}` : "—", color: p > 0.3 ? C.teal : "rgba(244,241,234,0.15)" },
              ].map(col => (
                <div key={col.label} style={{ flex: 1, background: "rgba(244,241,234,0.02)", padding: "14px 8px", textAlign: "center" }}>
                  <div style={{ fontSize: 7, fontWeight: 700, letterSpacing: "0.12em", color: "rgba(244,241,234,0.15)", marginBottom: 6 }}>{col.label}</div>
                  <div style={{ fontSize: 26, fontWeight: 300, color: col.color, fontFamily: SERIF, lineHeight: 1, transition: "color 600ms ease" }}>{col.value}</div>
                </div>
              ))}
            </div>

            {/* Slider */}
            <div>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 10 }}>
                <span style={{ fontSize: 11, fontWeight: 400, color: "rgba(244,241,234,0.35)" }}>Recurring Revenue</span>
                <span style={{ fontSize: 11, fontWeight: 600, color: C.teal, fontVariantNumeric: "tabular-nums" }}>{Math.round(15 + sliderPct * 45)}%</span>
              </div>
              <div style={{ height: 2, borderRadius: 1, background: "rgba(244,241,234,0.05)", position: "relative" }}>
                <div style={{ height: "100%", borderRadius: 1, background: `linear-gradient(90deg, ${C.teal}88, ${C.purple})`, width: `${15 + sliderPct * 45}%`, transition: "width 60ms linear" }} />
                <div style={{
                  position: "absolute", top: "50%", left: `${15 + sliderPct * 45}%`,
                  transform: "translate(-50%, -50%)",
                  width: 14, height: 14, borderRadius: "50%",
                  background: C.cream, border: `2px solid ${C.teal}`,
                  boxShadow: `0 0 16px rgba(26,122,109,0.25)`,
                  transition: "left 60ms linear",
                }} />
              </div>
            </div>
          </div>
        )}

        {/* ═══ RISK FLASH — the gut punch ═══ */}
        {id === "riskFlash" && (
          <div style={{ textAlign: "center", width: "100%", maxWidth: 340 }}>
            {/* Red flash overlay */}
            {p < 0.15 && (
              <div style={{
                position: "absolute", inset: 0, zIndex: 3, pointerEvents: "none",
                background: "radial-gradient(circle at 50% 50%, rgba(155,44,44,0.12) 0%, transparent 70%)",
                animation: "demoFlash 600ms ease-out forwards",
              }} />
            )}
            <div style={{
              opacity: p < 0.82 ? Math.min(p / 0.12, 1) : Math.max(0, 1 - (p - 0.82) / 0.18),
            }}>
              <div style={{ fontSize: 13, fontWeight: 400, color: "rgba(244,241,234,0.3)", marginBottom: 20 }}>
                If you lose your top client
              </div>
              <div style={{ display: "flex", alignItems: "baseline", justifyContent: "center", gap: 12 }}>
                <span style={{ fontSize: 48, fontWeight: 300, fontFamily: SANS, color: C.cream, letterSpacing: "-0.03em" }}>48</span>
                <span style={{ fontSize: 20, color: "rgba(244,241,234,0.15)" }}>&rarr;</span>
                <span style={{ fontSize: 48, fontWeight: 300, fontFamily: SANS, color: C.limited, letterSpacing: "-0.03em",
                  opacity: p > 0.2 ? 1 : 0, transition: "opacity 500ms ease",
                }}>31</span>
              </div>
            </div>
          </div>
        )}

        {/* ═══ FIX — the antidote ═══ */}
        {id === "fix" && (
          <div style={{
            textAlign: "center",
            opacity: p < 0.82 ? Math.min(p / 0.15, 1) : Math.max(0, 1 - (p - 0.82) / 0.18),
          }}>
            <div style={{ fontSize: 13, fontWeight: 400, color: "rgba(244,241,234,0.3)", marginBottom: 20 }}>
              Secure a monthly retainer
            </div>
            <span style={{ fontSize: 48, fontWeight: 300, fontFamily: SANS, color: C.teal, letterSpacing: "-0.03em" }}>
              +12
            </span>
          </div>
        )}

        {/* ═══ CLOSER 1 ═══ */}
        {id === "closer1" && (
          <div style={{ textAlign: "center", maxWidth: 440 }}>
            <p style={{
              fontFamily: SERIF, fontSize: 30, fontWeight: 400,
              color: C.cream, lineHeight: 1.25, letterSpacing: "-0.025em", margin: 0,
              opacity: Math.min(p / 0.2, 1),
              transform: `translateY(${(1 - Math.min(p / 0.2, 1)) * 8}px)`,
              transition: "transform 1s cubic-bezier(0.22, 1, 0.36, 1)",
            }}>
              Your income has a structure.
            </p>
          </div>
        )}

        {/* ═══ CLOSER 2 ═══ */}
        {id === "closer2" && (
          <div style={{ textAlign: "center", maxWidth: 440 }}>
            <p style={{
              fontFamily: SERIF, fontSize: 30, fontWeight: 400,
              color: "rgba(244,241,234,0.35)", lineHeight: 1.25,
              letterSpacing: "-0.025em", margin: 0,
              opacity: Math.min(p / 0.2, 1),
            }}>
              Now you can see it.
            </p>
          </div>
        )}

        {/* ═══ END FRAME — the question, not a button ═══ */}
        {id === "endFrame" && (
          <div style={{ textAlign: "center", opacity: Math.min(p / 0.2, 1) }}>
            <p style={{
              fontFamily: SERIF, fontSize: 26, fontWeight: 400,
              color: C.cream, lineHeight: 1.3, letterSpacing: "-0.02em",
              margin: "0 0 28px",
            }}>
              What&rsquo;s your number?
            </p>
            <div style={{
              display: "inline-flex", alignItems: "center", justifyContent: "center",
              padding: "14px 40px", borderRadius: 12,
              background: C.cream,
              opacity: p > 0.25 ? 1 : 0,
              transform: p > 0.25 ? "translateY(0)" : "translateY(8px)",
              transition: "all 700ms cubic-bezier(0.22, 1, 0.36, 1)",
            }}>
              <span style={{ fontSize: 15, fontWeight: 600, color: C.navy }}>
                Get My Free Score
              </span>
            </div>
            <div style={{
              marginTop: 18, fontSize: 11, color: "rgba(244,241,234,0.2)",
              opacity: p > 0.4 ? 1 : 0, transition: "opacity 800ms ease",
            }}>
              Free &middot; Under 2 minutes &middot; No bank connection
            </div>
          </div>
        )}

        {/* ── Play / replay ── */}
        {idx < 0 && !playing && (
          <div style={{ textAlign: "center", cursor: "pointer" }}>
            <div style={{
              width: 80, height: 80, borderRadius: "50%",
              background: "rgba(244,241,234,0.04)",
              border: "1px solid rgba(244,241,234,0.08)",
              display: "flex", alignItems: "center", justifyContent: "center",
              margin: "0 auto 24px",
            }}>
              <svg width="18" height="22" viewBox="0 0 18 22" fill="none" style={{ marginLeft: 3 }}>
                <path d="M1 1L17 11L1 21V1Z" fill="rgba(244,241,234,0.5)" />
              </svg>
            </div>
            <div style={{ fontSize: 13, fontWeight: 400, color: "rgba(244,241,234,0.3)", letterSpacing: "0.02em" }}>
              {played ? "Watch again" : "See how it works"}
            </div>
          </div>
        )}

      </div>

      {/* ── Progress — barely there ── */}
      {playing && idx >= 0 && idx < SCENES.length && (
        <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: 1, background: "rgba(244,241,234,0.03)" }}>
          <div style={{
            height: "100%",
            background: `linear-gradient(90deg, ${C.teal}66, ${C.purple}66)`,
            width: `${((SCENES.slice(0, idx).reduce((s, sc) => s + sc.duration, 0) + p * (SCENES[idx]?.duration || 0)) / TOTAL) * 100}%`,
            transition: "width 60ms linear",
          }} />
        </div>
      )}
    </div>
  );
}
