"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Image from "next/image";
import logoDark from "../../public/runpayway-logo-dark.png";

/* ═══════════════════════════════════════════════════════════════════
   ProductDemo — Cinematic product walkthrough
   Apple-level restraint: one element per scene, slow reveals,
   massive whitespace, typography-driven.
   ═══════════════════════════════════════════════════════════════════ */

const C = {
  navy: "#0E1A2B",
  purple: "#4B3FAE",
  teal: "#1A7A6D",
  sand: "#F4F1EA",
  white: "#FFFFFF",
  bg: "#070F19",
  bandDeveloping: "#92640A",
  bandLimited: "#9B2C2C",
};

const SERIF = "'DM Serif Display', Georgia, serif";

/* ── Easing ── */
function easeOutQuart(t: number) { return 1 - Math.pow(1 - t, 4); }

/* ── Animated counter ── */
function useCounter(target: number, duration: number, active: boolean) {
  const [v, setV] = useState(0);
  useEffect(() => {
    if (!active) { setV(0); return; }
    let raf: number;
    const t0 = performance.now();
    const tick = (now: number) => {
      const p = Math.min((now - t0) / duration, 1);
      setV(Math.round(easeOutQuart(p) * target));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [target, duration, active]);
  return v;
}

/* ── Scene timing ── */
const SCENES = [
  { id: "white",       duration: 1200 },  // blank white breath
  { id: "logo",        duration: 3200 },  // logo alone
  { id: "question",    duration: 3600 },  // single question
  { id: "headline",    duration: 3400 },  // the question
  { id: "score",       duration: 4200 },  // score reveal — the money shot
  { id: "band",        duration: 2800 },  // classification
  { id: "report",      duration: 3600 },  // five pages
  { id: "simulator",   duration: 4400 },  // slider
  { id: "risk",        duration: 3800 },  // risk + fix
  { id: "closer",      duration: 3800 },  // tagline
  { id: "cta",         duration: 3400 },  // CTA
];

const TOTAL = SCENES.reduce((s, sc) => s + sc.duration, 0);

/* ── Fade utility ── */
function sceneFade(progress: number, fadeIn = 0.12, fadeOut = 0.88) {
  if (progress < fadeIn) return progress / fadeIn;
  if (progress > fadeOut) return Math.max(0, 1 - (progress - fadeOut) / (1 - fadeOut));
  return 1;
}

/* ═══════════════════════════════════════════════════════════════════ */

export default function ProductDemo({ autoPlay = true }: { autoPlay?: boolean }) {
  const [idx, setIdx] = useState(-1);
  const [progress, setProgress] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [played, setPlayed] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const t0 = useRef(0);
  const raf = useRef(0);

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
      setProgress(Math.min(e / dur, 1));
      if (e < dur) raf.current = requestAnimationFrame(tick);
      else advance();
    };
    raf.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf.current);
  }, [playing, idx, advance]);

  const play = useCallback(() => {
    setIdx(-1); setProgress(0); setPlaying(true); setPlayed(false);
    setTimeout(() => { t0.current = performance.now(); setIdx(0); }, 50);
  }, []);

  /* Auto-play on scroll */
  useEffect(() => {
    if (!autoPlay || played) return;
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting && !playing && !played) { play(); obs.disconnect(); }
    }, { threshold: 0.4 });
    obs.observe(el);
    return () => obs.disconnect();
  }, [autoPlay, playing, played, play]);

  const scene = idx >= 0 ? SCENES[idx] : null;
  const id = scene?.id || "";
  const fade = sceneFade(progress);

  /* Counters */
  const scoreNum = useCounter(48, 2000, id === "score");
  const simFrom = useCounter(48, 600, id === "simulator");
  const simTo = useCounter(67, 1400, id === "simulator" && progress > 0.3);
  const simSlider = id === "simulator" && progress > 0.25 ? Math.min((progress - 0.25) / 0.45, 1) : 0;

  /* Container background — white for logo scene, dark for the rest */
  const isLight = id === "white" || id === "logo";

  return (
    <div
      ref={ref}
      style={{
        position: "relative",
        width: "100%",
        maxWidth: 720,
        margin: "0 auto",
        aspectRatio: "16 / 9",
        borderRadius: 20,
        overflow: "hidden",
        background: isLight ? C.white : C.bg,
        cursor: !playing ? "pointer" : "default",
        boxShadow: "0 24px 80px rgba(0,0,0,0.35), 0 0 0 1px rgba(255,255,255,0.04)",
        transition: "background 800ms ease",
      }}
      onClick={() => { if (!playing) play(); }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display&family=Inter:wght@300;400;500;600;700&display=swap');
        @keyframes demoPulse { 0%,100% { transform: scale(1); box-shadow: 0 4px 24px rgba(0,0,0,0.15); } 50% { transform: scale(1.02); box-shadow: 0 8px 32px rgba(0,0,0,0.2); } }
      `}</style>

      {/* Subtle ambient glow — dark scenes only */}
      {!isLight && (
        <div style={{
          position: "absolute", inset: 0, pointerEvents: "none", opacity: 0.5,
          background: "radial-gradient(ellipse at 50% 40%, rgba(75,63,174,0.08) 0%, transparent 70%)",
        }} />
      )}

      {/* ── Content ── */}
      <div style={{
        position: "relative", zIndex: 1, width: "100%", height: "100%",
        display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
        padding: "32px 40px",
        fontFamily: "'Inter', system-ui, -apple-system, sans-serif",
      }}>

        {/* ═══ SCENE: White breath ═══ */}
        {id === "white" && <div />}

        {/* ═══ SCENE: Logo on white ═══ */}
        {id === "logo" && (
          <div style={{ opacity: fade, transform: `scale(${0.96 + fade * 0.04})`, transition: "transform 1s ease-out" }}>
            <Image src={logoDark} alt="RunPayway™" width={280} height={62} style={{ objectFit: "contain" }} priority />
          </div>
        )}

        {/* ═══ SCENE: The question ═══ */}
        {id === "question" && (
          <div style={{ textAlign: "center", opacity: fade, transform: `translateY(${(1 - fade) * 8}px)` }}>
            <p style={{ fontFamily: SERIF, fontSize: 28, fontWeight: 400, color: "rgba(244,241,234,0.85)", lineHeight: 1.2, letterSpacing: "-0.02em", margin: 0, maxWidth: 460 }}>
              How stable is your income?
            </p>
          </div>
        )}

        {/* ═══ SCENE: Headline ═══ */}
        {id === "headline" && (
          <div style={{ textAlign: "center", opacity: fade, transform: `translateY(${(1 - fade) * 6}px)` }}>
            <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: "0.14em", textTransform: "uppercase" as const, color: C.teal, marginBottom: 20 }}>
              Under 2 minutes
            </div>
            <p style={{ fontSize: 15, color: "rgba(244,241,234,0.4)", lineHeight: 1.7, maxWidth: 380, margin: "0 auto" }}>
              No bank connection. No credit pull.<br />Just a short structural diagnostic.
            </p>
          </div>
        )}

        {/* ═══ SCENE: Score reveal ═══ */}
        {id === "score" && (
          <div style={{ textAlign: "center", opacity: progress < 0.9 ? 1 : Math.max(0, 1 - (progress - 0.9) / 0.1) }}>
            {/* The number — alone, massive */}
            <div style={{
              fontSize: 96,
              fontWeight: 300,
              fontFamily: "'Inter', sans-serif",
              color: C.sand,
              letterSpacing: "-0.04em",
              lineHeight: 1,
              fontVariantNumeric: "tabular-nums",
              opacity: Math.min(progress / 0.25, 1),
              transform: `scale(${0.9 + Math.min(progress / 0.25, 1) * 0.1})`,
              transition: "transform 0.1s linear",
            }}>
              {scoreNum}
            </div>
            {/* "out of 100" — delayed */}
            <div style={{
              fontSize: 14,
              fontWeight: 400,
              color: "rgba(244,241,234,0.25)",
              letterSpacing: "0.04em",
              marginTop: 12,
              opacity: progress > 0.4 ? Math.min((progress - 0.4) / 0.15, 1) : 0,
            }}>
              out of 100
            </div>
          </div>
        )}

        {/* ═══ SCENE: Band classification ═══ */}
        {id === "band" && (
          <div style={{ textAlign: "center", opacity: fade, transform: `translateY(${(1 - fade) * 6}px)` }}>
            <div style={{
              display: "inline-flex", alignItems: "center", gap: 10,
              padding: "10px 24px", borderRadius: 100,
              background: "rgba(146,100,10,0.08)",
              border: "1px solid rgba(146,100,10,0.15)",
            }}>
              <div style={{ width: 8, height: 8, borderRadius: "50%", background: C.bandDeveloping }} />
              <span style={{ fontSize: 14, fontWeight: 500, color: C.bandDeveloping, letterSpacing: "0.01em" }}>Developing Stability</span>
            </div>
            <div style={{ marginTop: 16, fontSize: 13, color: "rgba(244,241,234,0.3)" }}>
              34th percentile among professionals
            </div>
          </div>
        )}

        {/* ═══ SCENE: Report pages ═══ */}
        {id === "report" && (
          <div style={{ textAlign: "center", width: "100%", opacity: fade }}>
            <div style={{ fontSize: 13, fontWeight: 500, color: "rgba(244,241,234,0.35)", marginBottom: 28, letterSpacing: "0.02em" }}>
              Your 5-page diagnostic report
            </div>
            <div style={{ display: "flex", justifyContent: "center", gap: 8 }}>
              {["Your Score", "Income\nStructure", "Biggest\nRisks", "Deep\nDive", "Action\nPlan"].map((title, i) => (
                <div key={title} style={{
                  width: 80, height: 104, borderRadius: 8,
                  background: "rgba(244,241,234,0.03)",
                  border: "1px solid rgba(244,241,234,0.06)",
                  display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
                  padding: 8,
                  opacity: progress > (i * 0.08 + 0.08) ? 1 : 0,
                  transform: progress > (i * 0.08 + 0.08) ? "translateY(0)" : "translateY(20px)",
                  transition: `all 700ms cubic-bezier(0.22, 1, 0.36, 1) ${i * 80}ms`,
                }}>
                  <div style={{ fontSize: 9, fontWeight: 700, color: C.purple, opacity: 0.7, marginBottom: 6 }}>0{i + 1}</div>
                  <div style={{ fontSize: 9, fontWeight: 500, color: "rgba(244,241,234,0.5)", textAlign: "center", lineHeight: 1.35, whiteSpace: "pre-line" }}>{title}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ═══ SCENE: Simulator ═══ */}
        {id === "simulator" && (
          <div style={{ width: "100%", maxWidth: 340, opacity: fade }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 24 }}>
              <div>
                <div style={{ fontSize: 9, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase" as const, color: C.teal }}>Score Simulator&#8482;</div>
              </div>
              <div style={{ fontSize: 9, color: "rgba(244,241,234,0.2)" }}>MODEL RP-2.0</div>
            </div>

            {/* Score triptych */}
            <div style={{ display: "flex", gap: 2, borderRadius: 8, overflow: "hidden", marginBottom: 24 }}>
              {[
                { label: "CURRENT", value: "48", color: C.sand },
                { label: "SIMULATED", value: progress > 0.35 ? String(simTo) : String(simFrom), color: progress > 0.35 ? C.teal : C.sand },
                { label: "IMPACT", value: progress > 0.35 ? `+${simTo - 48}` : "—", color: progress > 0.35 ? C.teal : "rgba(244,241,234,0.2)" },
              ].map(col => (
                <div key={col.label} style={{ flex: 1, background: "rgba(244,241,234,0.03)", padding: "12px 8px", textAlign: "center" }}>
                  <div style={{ fontSize: 7, fontWeight: 700, letterSpacing: "0.10em", color: "rgba(244,241,234,0.2)", marginBottom: 5 }}>{col.label}</div>
                  <div style={{ fontSize: 24, fontWeight: 300, color: col.color, fontFamily: SERIF, lineHeight: 1, transition: "color 500ms ease" }}>{col.value}</div>
                </div>
              ))}
            </div>

            {/* Slider */}
            <div>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                <span style={{ fontSize: 11, fontWeight: 500, color: "rgba(244,241,234,0.4)" }}>Recurring Revenue</span>
                <span style={{ fontSize: 11, fontWeight: 600, color: C.teal, fontVariantNumeric: "tabular-nums" }}>{Math.round(15 + simSlider * 45)}%</span>
              </div>
              <div style={{ height: 3, borderRadius: 2, background: "rgba(244,241,234,0.06)", position: "relative" }}>
                <div style={{ height: "100%", borderRadius: 2, background: `linear-gradient(90deg, ${C.teal}, ${C.purple})`, width: `${15 + simSlider * 45}%`, transition: "width 80ms linear" }} />
                <div style={{
                  position: "absolute", top: "50%", transform: "translate(-50%, -50%)",
                  left: `${15 + simSlider * 45}%`,
                  width: 12, height: 12, borderRadius: "50%", background: C.white,
                  border: `2px solid ${C.teal}`, boxShadow: `0 0 12px rgba(26,122,109,0.3)`,
                  transition: "left 80ms linear",
                }} />
              </div>
            </div>
          </div>
        )}

        {/* ═══ SCENE: Risk + Action ═══ */}
        {id === "risk" && (
          <div style={{ width: "100%", maxWidth: 320, opacity: fade }}>
            {/* Risk */}
            <div style={{
              padding: "16px 20px", borderRadius: 10, marginBottom: 12,
              background: "rgba(155,44,44,0.04)", border: "1px solid rgba(155,44,44,0.10)",
              opacity: progress > 0.1 ? 1 : 0, transform: progress > 0.1 ? "translateY(0)" : "translateY(8px)",
              transition: "all 700ms cubic-bezier(0.22, 1, 0.36, 1)",
            }}>
              <div style={{ fontSize: 11, color: "rgba(244,241,234,0.35)", marginBottom: 6 }}>If you lose your top client</div>
              <div style={{ display: "flex", alignItems: "baseline", gap: 8 }}>
                <span style={{ fontSize: 28, fontWeight: 300, fontFamily: SERIF, color: C.bandLimited }}>48 → 31</span>
              </div>
            </div>
            {/* Fix */}
            <div style={{
              padding: "16px 20px", borderRadius: 10,
              background: "rgba(26,122,109,0.04)", border: "1px solid rgba(26,122,109,0.10)",
              opacity: progress > 0.4 ? 1 : 0, transform: progress > 0.4 ? "translateY(0)" : "translateY(8px)",
              transition: "all 700ms cubic-bezier(0.22, 1, 0.36, 1)",
            }}>
              <div style={{ fontSize: 11, color: "rgba(244,241,234,0.35)", marginBottom: 6 }}>Secure a monthly retainer</div>
              <span style={{ fontSize: 28, fontWeight: 300, fontFamily: SERIF, color: C.teal }}>+12 pts</span>
            </div>
          </div>
        )}

        {/* ═══ SCENE: Closer ═══ */}
        {id === "closer" && (
          <div style={{ textAlign: "center", maxWidth: 440, opacity: fade }}>
            <p style={{
              fontFamily: SERIF, fontSize: 32, fontWeight: 400, color: C.sand,
              lineHeight: 1.2, letterSpacing: "-0.025em", margin: 0,
            }}>
              Your income has a structure.
            </p>
            <p style={{
              fontFamily: SERIF, fontSize: 32, fontWeight: 400, lineHeight: 1.2,
              letterSpacing: "-0.025em", margin: "8px 0 0",
              color: "rgba(244,241,234,0.35)",
              opacity: progress > 0.25 ? 1 : 0,
              transition: "opacity 800ms ease",
            }}>
              Now you can see it.
            </p>
          </div>
        )}

        {/* ═══ SCENE: CTA ═══ */}
        {id === "cta" && (
          <div style={{ textAlign: "center", opacity: fade }}>
            <div style={{
              display: "inline-flex", alignItems: "center", justifyContent: "center",
              padding: "16px 44px", borderRadius: 14, background: C.sand,
              animation: progress > 0.25 ? "demoPulse 2.5s ease-in-out infinite" : "none",
            }}>
              <span style={{ fontSize: 16, fontWeight: 600, color: C.navy, letterSpacing: "-0.01em" }}>
                Get My Free Score
              </span>
            </div>
            <div style={{
              marginTop: 20, fontSize: 12, color: "rgba(244,241,234,0.25)",
              opacity: progress > 0.2 ? 1 : 0, transition: "opacity 800ms ease",
            }}>
              Free to start &middot; Under 2 minutes &middot; No bank connection
            </div>
          </div>
        )}

        {/* ── Play / replay state ── */}
        {idx < 0 && !playing && (
          <div style={{ textAlign: "center", cursor: "pointer" }}>
            <div style={{
              width: 72, height: 72, borderRadius: "50%",
              background: "rgba(244,241,234,0.06)", border: "1px solid rgba(244,241,234,0.10)",
              display: "flex", alignItems: "center", justifyContent: "center",
              margin: "0 auto 20px",
              transition: "background 200ms ease",
            }}>
              <svg width="18" height="22" viewBox="0 0 18 22" fill="none" style={{ marginLeft: 3 }}>
                <path d="M1 1L17 11L1 21V1Z" fill="rgba(244,241,234,0.6)" />
              </svg>
            </div>
            <div style={{ fontSize: 14, fontWeight: 400, color: "rgba(244,241,234,0.4)", letterSpacing: "0.01em" }}>
              {played ? "Watch again" : "See how it works"}
            </div>
          </div>
        )}
      </div>

      {/* ── Progress bar — razor thin ── */}
      {playing && idx >= 0 && (
        <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: 1.5, background: isLight ? "rgba(14,26,43,0.06)" : "rgba(244,241,234,0.04)" }}>
          <div style={{
            height: "100%",
            background: isLight ? C.navy : `linear-gradient(90deg, ${C.teal}, ${C.purple})`,
            width: `${((SCENES.slice(0, idx).reduce((s, sc) => s + sc.duration, 0) + progress * (SCENES[idx]?.duration || 0)) / TOTAL) * 100}%`,
            transition: "width 80ms linear",
            opacity: 0.6,
          }} />
        </div>
      )}
    </div>
  );
}
