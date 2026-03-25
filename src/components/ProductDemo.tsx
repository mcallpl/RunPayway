"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Image from "next/image";
import logoImg from "../../public/runpayway-logo-full.png";

/* ═══════════════════════════════════════════════════════════════════
   ProductDemo — 38-second auto-playing animated product walkthrough
   Uses real brand tokens and UI patterns from RunPayway
   ═══════════════════════════════════════════════════════════════════ */

const B = {
  navy: "#0E1A2B",
  navyDeep: "#070F19",
  purple: "#4B3FAE",
  teal: "#1A7A6D",
  sand: "#F4F1EA",
  white: "#FFFFFF",
  bandLimited: "#9B2C2C",
  bandDeveloping: "#92640A",
  bandEstablished: "#2B5EA7",
  bandHigh: "#1F6D7A",
};

const DISPLAY = "'DM Serif Display', Georgia, serif";

/* ── Easing ── */
function easeOutCubic(t: number) { return 1 - Math.pow(1 - t, 3); }

/* ── Animated counter hook ── */
function useCounter(target: number, duration: number, active: boolean) {
  const [value, setValue] = useState(0);
  useEffect(() => {
    if (!active) { setValue(0); return; }
    let raf: number;
    const start = performance.now();
    const tick = (now: number) => {
      const elapsed = Math.min((now - start) / duration, 1);
      setValue(Math.round(easeOutCubic(elapsed) * target));
      if (elapsed < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [target, duration, active]);
  return value;
}

/* ── Scene definitions ── */
interface Scene {
  id: string;
  duration: number; // ms
}

const SCENES: Scene[] = [
  { id: "logo",        duration: 2800 },
  { id: "headline",    duration: 2700 },
  { id: "diagnostic",  duration: 4000 },
  { id: "answering",   duration: 3200 },
  { id: "score",       duration: 4000 },
  { id: "report",      duration: 3500 },
  { id: "simulator",   duration: 4200 },
  { id: "risks",       duration: 3800 },
  { id: "scripts",     duration: 3500 },
  { id: "closer",      duration: 3300 },
  { id: "cta",         duration: 3000 },
];

const TOTAL_DURATION = SCENES.reduce((s, sc) => s + sc.duration, 0);

/* ═══════════════════════════════════════════════════════════════════ */

export default function ProductDemo({ autoPlay = true }: { autoPlay?: boolean }) {
  const [sceneIndex, setSceneIndex] = useState(-1);
  const [sceneProgress, setSceneProgress] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [hasPlayed, setHasPlayed] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const startTimeRef = useRef(0);
  const rafRef = useRef<number>(0);

  /* ── Scene progression ── */
  const advanceScene = useCallback(() => {
    setSceneIndex((prev) => {
      const next = prev + 1;
      if (next >= SCENES.length) {
        setIsPlaying(false);
        setHasPlayed(true);
        return prev;
      }
      startTimeRef.current = performance.now();
      return next;
    });
  }, []);

  /* ── Progress ticker ── */
  useEffect(() => {
    if (!isPlaying || sceneIndex < 0 || sceneIndex >= SCENES.length) return;
    const scene = SCENES[sceneIndex];
    const tick = () => {
      const elapsed = performance.now() - startTimeRef.current;
      setSceneProgress(Math.min(elapsed / scene.duration, 1));
      if (elapsed < scene.duration) {
        rafRef.current = requestAnimationFrame(tick);
      } else {
        advanceScene();
      }
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, [isPlaying, sceneIndex, advanceScene]);

  /* ── Start playback ── */
  const play = useCallback(() => {
    setSceneIndex(-1);
    setSceneProgress(0);
    setIsPlaying(true);
    setHasPlayed(false);
    setTimeout(() => {
      startTimeRef.current = performance.now();
      setSceneIndex(0);
    }, 100);
  }, []);

  /* ── Auto-play on scroll into view ── */
  useEffect(() => {
    if (!autoPlay || hasPlayed) return;
    const el = containerRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !isPlaying && !hasPlayed) {
          play();
          obs.disconnect();
        }
      },
      { threshold: 0.5 },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [autoPlay, isPlaying, hasPlayed, play]);

  const scene = sceneIndex >= 0 ? SCENES[sceneIndex] : null;
  const sceneId = scene?.id || "";

  /* ── Fade helper ── */
  const fade = (delay = 0, dur = 0.5) => ({
    opacity: sceneProgress > delay ? Math.min((sceneProgress - delay) / (dur / 1), 1) : 0,
    transform: sceneProgress > delay ? "translateY(0)" : "translateY(12px)",
    transition: `opacity ${dur}s ease-out, transform ${dur}s ease-out`,
  });

  /* ── Score counter for score scene ── */
  const scoreValue = useCounter(48, 1500, sceneId === "score");
  const simScoreFrom = useCounter(48, 800, sceneId === "simulator");
  const simScoreTo = useCounter(67, 1200, sceneId === "simulator" && sceneProgress > 0.35);

  return (
    <div
      ref={containerRef}
      style={{
        position: "relative",
        width: "100%",
        maxWidth: 640,
        margin: "0 auto",
        aspectRatio: "16 / 9",
        borderRadius: 16,
        overflow: "hidden",
        background: B.navyDeep,
        cursor: !isPlaying ? "pointer" : "default",
        boxShadow: "0 20px 60px rgba(0,0,0,0.4), 0 0 0 1px rgba(255,255,255,0.05)",
      }}
      onClick={() => { if (!isPlaying) play(); }}
    >
      {/* ── Keyframe styles ── */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display&family=Inter:wght@400;500;600;700&display=swap');
        @keyframes demoGlow { 0%,100% { opacity: 0.4; } 50% { opacity: 0.7; } }
        @keyframes demoPulse { 0%,100% { transform: scale(1); } 50% { transform: scale(1.03); } }
        @keyframes demoSlide { 0% { transform: translateX(15%); } 100% { transform: translateX(60%); } }
        @keyframes demoType { from { width: 0; } to { width: 100%; } }
        @keyframes demoBlink { 0%,100% { opacity: 1; } 50% { opacity: 0; } }
        @keyframes demoRingDraw {
          0% { stroke-dashoffset: 440; }
          100% { stroke-dashoffset: ${440 - (440 * 48 / 100)}; }
        }
        @keyframes demoFanIn {
          0% { opacity: 0; transform: translateY(20px) scale(0.95); }
          100% { opacity: 1; transform: translateY(0) scale(1); }
        }
        @keyframes demoCountUp {
          0% { opacity: 0; transform: scale(0.8); }
          30% { opacity: 1; }
          100% { transform: scale(1); }
        }
      `}</style>

      {/* ── Ambient background glow ── */}
      <div style={{
        position: "absolute", inset: 0, pointerEvents: "none",
        background: "radial-gradient(ellipse at 30% 40%, rgba(75,63,174,0.12) 0%, transparent 60%), radial-gradient(ellipse at 70% 60%, rgba(26,122,109,0.08) 0%, transparent 60%)",
        animation: "demoGlow 6s ease-in-out infinite",
      }} />

      {/* ── Subtle grid overlay ── */}
      <div style={{
        position: "absolute", inset: 0, pointerEvents: "none", opacity: 0.03,
        backgroundImage: "linear-gradient(rgba(244,241,234,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(244,241,234,0.3) 1px, transparent 1px)",
        backgroundSize: "40px 40px",
      }} />

      {/* ── Content layer ── */}
      <div style={{
        position: "relative", zIndex: 1, width: "100%", height: "100%",
        display: "flex", alignItems: "center", justifyContent: "center",
        padding: "24px 32px",
        fontFamily: "'Inter', system-ui, -apple-system, sans-serif",
      }}>

        {/* ════════════════════════════════════════════════ */}
        {/* SCENE 0: Logo reveal                              */}
        {/* ════════════════════════════════════════════════ */}
        {sceneId === "logo" && (
          <div style={{ textAlign: "center", opacity: sceneProgress < 0.85 ? Math.min(sceneProgress / 0.2, 1) : Math.max(1 - (sceneProgress - 0.85) / 0.15, 0), transform: `scale(${sceneProgress < 0.2 ? 0.9 + 0.1 * (sceneProgress / 0.2) : 1})`, transition: "transform 0.4s ease-out" }}>
            <div style={{ marginBottom: 20, filter: "brightness(10)" }}>
              <Image src={logoImg} alt="RunPayway™" width={200} height={44} style={{ objectFit: "contain" }} />
            </div>
            <div style={{ width: 48, height: 1, background: `linear-gradient(90deg, transparent, ${B.purple}, transparent)`, margin: "0 auto 16px", opacity: Math.min(sceneProgress / 0.3, 0.6) }} />
            <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: "0.14em", textTransform: "uppercase" as const, color: "rgba(244,241,234,0.35)", opacity: Math.min(sceneProgress / 0.4, 1) }}>
              Income Stability Score&#8482;
            </div>
          </div>
        )}

        {/* ════════════════════════════════════════════════ */}
        {/* SCENE 1: Headline question                        */}
        {/* ════════════════════════════════════════════════ */}
        {sceneId === "headline" && (
          <div style={{ textAlign: "center", maxWidth: 420, opacity: sceneProgress < 0.85 ? Math.min(sceneProgress / 0.15, 1) : Math.max(1 - (sceneProgress - 0.85) / 0.15, 0) }}>
            <h2 style={{ fontFamily: DISPLAY, fontSize: 32, fontWeight: 400, color: B.sand, lineHeight: 1.15, letterSpacing: "-0.025em", margin: 0 }}>
              How stable is your income — really?
            </h2>
            <div style={{ width: 40, height: 2, background: B.teal, margin: "20px auto 0", opacity: Math.min(sceneProgress / 0.3, 1), transform: `scaleX(${Math.min(sceneProgress / 0.3, 1)})` }} />
          </div>
        )}

        {/* ════════════════════════════════════════════════ */}
        {/* SCENE 2: Diagnostic question card                 */}
        {/* ════════════════════════════════════════════════ */}
        {sceneId === "diagnostic" && (
          <div style={{ width: "100%", maxWidth: 380, opacity: sceneProgress < 0.85 ? Math.min(sceneProgress / 0.15, 1) : Math.max(1 - (sceneProgress - 0.85) / 0.15, 0) }}>
            {/* Mini header */}
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 12 }}>
              <span style={{ fontSize: 9, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase" as const, color: B.purple }}>Assessment</span>
              <span style={{ fontSize: 9, color: "rgba(244,241,234,0.25)" }}>Under 2 minutes</span>
            </div>
            {/* Card */}
            <div style={{ background: B.white, borderRadius: 12, padding: "20px 18px", boxShadow: "0 8px 32px rgba(0,0,0,0.3)" }}>
              <div style={{ fontSize: 14, fontWeight: 600, color: B.navy, marginBottom: 4 }}>Recurring Revenue Base</div>
              <div style={{ fontSize: 11, color: "rgba(14,26,43,0.45)", marginBottom: 14 }}>What percentage of your income recurs automatically?</div>
              {["0–10%", "11–25%", "26–50%", "51–75%", "76–100%"].map((opt, i) => (
                <div key={opt} style={{
                  display: "flex", alignItems: "center", gap: 10,
                  padding: "9px 12px", borderRadius: 8, marginBottom: i < 4 ? 5 : 0,
                  border: `1px solid ${i === 1 && sceneProgress > 0.55 ? B.purple : "rgba(14,26,43,0.08)"}`,
                  background: i === 1 && sceneProgress > 0.55 ? "rgba(75,63,174,0.04)" : "#fff",
                  transition: "all 300ms ease",
                }}>
                  <div style={{ width: 16, height: 16, borderRadius: "50%", border: `2px solid ${i === 1 && sceneProgress > 0.55 ? B.purple : "rgba(14,26,43,0.12)"}`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, transition: "border-color 300ms" }}>
                    {i === 1 && sceneProgress > 0.55 && <div style={{ width: 8, height: 8, borderRadius: "50%", background: B.purple }} />}
                  </div>
                  <span style={{ fontSize: 12, color: i === 1 && sceneProgress > 0.55 ? B.navy : "rgba(14,26,43,0.55)", fontWeight: i === 1 && sceneProgress > 0.55 ? 600 : 400, transition: "all 300ms" }}>{opt}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ════════════════════════════════════════════════ */}
        {/* SCENE 3: Quick answering montage                  */}
        {/* ════════════════════════════════════════════════ */}
        {sceneId === "answering" && (
          <div style={{ textAlign: "center", opacity: sceneProgress < 0.85 ? Math.min(sceneProgress / 0.1, 1) : Math.max(1 - (sceneProgress - 0.85) / 0.15, 0) }}>
            {/* Progress bar */}
            <div style={{ width: 200, height: 4, borderRadius: 2, background: "rgba(244,241,234,0.08)", margin: "0 auto 24px", overflow: "hidden" }}>
              <div style={{ height: "100%", borderRadius: 2, background: `linear-gradient(90deg, ${B.teal}, ${B.purple})`, width: `${Math.min(sceneProgress * 1.1, 1) * 100}%`, transition: "width 200ms linear" }} />
            </div>
            {/* Cycling question numbers */}
            <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase" as const, color: B.purple, marginBottom: 8 }}>
              Analyzing your income structure
            </div>
            <div style={{ fontFamily: DISPLAY, fontSize: 22, color: B.sand, lineHeight: 1.2, marginBottom: 20 }}>
              {sceneProgress < 0.25 ? "Income Source Diversification" : sceneProgress < 0.5 ? "Forward Revenue Visibility" : sceneProgress < 0.75 ? "Earnings Consistency" : "Income Without Active Work"}
            </div>
            {/* Animated selection dots */}
            <div style={{ display: "flex", justifyContent: "center", gap: 8 }}>
              {[0, 1, 2, 3, 4, 5].map((i) => (
                <div key={i} style={{
                  width: 8, height: 8, borderRadius: "50%",
                  background: (i / 6) < sceneProgress ? B.purple : "rgba(244,241,234,0.12)",
                  transition: "background 400ms ease",
                  transform: (i / 6) < sceneProgress ? "scale(1)" : "scale(0.7)",
                }} />
              ))}
            </div>
            <div style={{ fontSize: 11, color: "rgba(244,241,234,0.3)", marginTop: 16 }}>Quick assessment &middot; No bank connection &middot; No credit pull</div>
          </div>
        )}

        {/* ════════════════════════════════════════════════ */}
        {/* SCENE 4: Score reveal                             */}
        {/* ════════════════════════════════════════════════ */}
        {sceneId === "score" && (
          <div style={{ textAlign: "center", opacity: sceneProgress < 0.85 ? 1 : Math.max(1 - (sceneProgress - 0.85) / 0.15, 0) }}>
            {/* Score ring */}
            <div style={{ position: "relative", width: 160, height: 160, margin: "0 auto 20px" }}>
              <svg viewBox="0 0 160 160" style={{ width: "100%", height: "100%", transform: "rotate(-90deg)" }}>
                <defs>
                  <linearGradient id="demoScoreGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor={B.teal} />
                    <stop offset="50%" stopColor={B.purple} />
                    <stop offset="100%" stopColor="#7B6FE0" />
                  </linearGradient>
                </defs>
                {/* Track */}
                <circle cx="80" cy="80" r="68" fill="none" stroke="rgba(244,241,234,0.06)" strokeWidth="5" />
                {/* Arc */}
                <circle cx="80" cy="68" r="68" fill="none" stroke="url(#demoScoreGrad)" strokeWidth="5" strokeLinecap="round"
                  strokeDasharray="427" strokeDashoffset={427 - (427 * (scoreValue / 100))}
                  style={{ transition: "stroke-dashoffset 100ms linear" }} />
              </svg>
              {/* Score number */}
              <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <span style={{ fontSize: 52, fontWeight: 600, color: B.sand, letterSpacing: "-0.03em", fontVariantNumeric: "tabular-nums", fontFamily: "'Inter', sans-serif" }}>
                  {scoreValue}
                </span>
              </div>
            </div>
            {/* Band + percentile */}
            <div style={{ opacity: sceneProgress > 0.5 ? 1 : 0, transition: "opacity 600ms ease" }}>
              <div style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "6px 14px", borderRadius: 20, background: "rgba(146,100,10,0.12)", marginBottom: 8 }}>
                <div style={{ width: 8, height: 8, borderRadius: "50%", background: B.bandDeveloping }} />
                <span style={{ fontSize: 12, fontWeight: 600, color: B.bandDeveloping }}>Developing Stability</span>
              </div>
              <div style={{ fontSize: 13, color: "rgba(244,241,234,0.4)" }}>34th percentile</div>
            </div>
          </div>
        )}

        {/* ════════════════════════════════════════════════ */}
        {/* SCENE 5: Report pages fan out                     */}
        {/* ════════════════════════════════════════════════ */}
        {sceneId === "report" && (
          <div style={{ textAlign: "center", width: "100%", opacity: sceneProgress < 0.85 ? Math.min(sceneProgress / 0.15, 1) : Math.max(1 - (sceneProgress - 0.85) / 0.15, 0) }}>
            <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase" as const, color: B.teal, marginBottom: 10 }}>Full Report</div>
            <div style={{ fontFamily: DISPLAY, fontSize: 24, color: B.sand, lineHeight: 1.15, marginBottom: 24 }}>
              Unlock the full 5-page report.
            </div>
            {/* Stacked page cards */}
            <div style={{ display: "flex", justifyContent: "center", gap: 6, perspective: 800 }}>
              {["Your Score", "Income Structure", "Biggest Risks", "Deep Dive", "Action Plan"].map((title, i) => (
                <div key={title} style={{
                  width: 72, height: 96, borderRadius: 6, background: "rgba(244,241,234,0.06)", border: "1px solid rgba(244,241,234,0.08)",
                  display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: 6,
                  opacity: sceneProgress > (i * 0.1 + 0.1) ? 1 : 0,
                  transform: sceneProgress > (i * 0.1 + 0.1) ? "translateY(0)" : "translateY(16px)",
                  transition: `all 500ms ease ${i * 100}ms`,
                }}>
                  <div style={{ fontSize: 8, fontWeight: 700, color: B.purple, marginBottom: 4 }}>0{i + 1}</div>
                  <div style={{ fontSize: 8, fontWeight: 600, color: B.sand, textAlign: "center", lineHeight: 1.3 }}>{title}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ════════════════════════════════════════════════ */}
        {/* SCENE 6: Simulator slider                         */}
        {/* ════════════════════════════════════════════════ */}
        {sceneId === "simulator" && (
          <div style={{ width: "100%", maxWidth: 360, opacity: sceneProgress < 0.85 ? Math.min(sceneProgress / 0.12, 1) : Math.max(1 - (sceneProgress - 0.85) / 0.15, 0) }}>
            <div style={{ fontSize: 9, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase" as const, color: B.teal, marginBottom: 4 }}>Score Simulator&#8482;</div>
            <div style={{ fontSize: 7, color: "rgba(244,241,234,0.2)", marginBottom: 16 }}>MODEL RP-2.0</div>
            {/* Score triptych */}
            <div style={{ display: "flex", gap: 2, borderRadius: 8, overflow: "hidden", marginBottom: 16 }}>
              {[
                { label: "CURRENT", value: "48", color: B.sand },
                { label: "SIMULATED", value: sceneProgress > 0.4 ? String(simScoreTo) : String(simScoreFrom), color: sceneProgress > 0.4 ? B.teal : B.sand },
                { label: "IMPACT", value: sceneProgress > 0.4 ? `+${simScoreTo - 48}` : "0", color: sceneProgress > 0.4 ? B.teal : B.sand },
              ].map((col) => (
                <div key={col.label} style={{ flex: 1, background: "rgba(244,241,234,0.04)", padding: "10px 8px", textAlign: "center" }}>
                  <div style={{ fontSize: 7, fontWeight: 700, letterSpacing: "0.10em", color: "rgba(244,241,234,0.25)", marginBottom: 4 }}>{col.label}</div>
                  <div style={{ fontSize: 20, fontWeight: 300, color: col.color, fontFamily: DISPLAY, lineHeight: 1 }}>{col.value}</div>
                </div>
              ))}
            </div>
            {/* Slider */}
            <div style={{ marginBottom: 12 }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                <span style={{ fontSize: 10, fontWeight: 600, color: "rgba(244,241,234,0.5)" }}>Recurring Revenue</span>
                <span style={{ fontSize: 10, fontWeight: 700, color: B.teal }}>{Math.round(15 + (sceneProgress > 0.3 ? Math.min((sceneProgress - 0.3) / 0.4, 1) : 0) * 45)}%</span>
              </div>
              <div style={{ height: 4, borderRadius: 2, background: "rgba(244,241,234,0.08)", position: "relative" }}>
                <div style={{ height: "100%", borderRadius: 2, background: `linear-gradient(90deg, ${B.teal}, ${B.purple})`, width: `${15 + (sceneProgress > 0.3 ? Math.min((sceneProgress - 0.3) / 0.4, 1) : 0) * 45}%`, transition: "width 100ms linear" }} />
                <div style={{
                  position: "absolute", top: "50%", transform: "translate(-50%, -50%)",
                  left: `${15 + (sceneProgress > 0.3 ? Math.min((sceneProgress - 0.3) / 0.4, 1) : 0) * 45}%`,
                  width: 14, height: 14, borderRadius: "50%", background: B.white, border: `2px solid ${B.teal}`,
                  boxShadow: "0 2px 8px rgba(0,0,0,0.3)", transition: "left 100ms linear",
                }} />
              </div>
            </div>
            <div style={{ fontSize: 10, color: "rgba(244,241,234,0.3)", textAlign: "center" }}>
              Drag sliders to model real changes
            </div>
          </div>
        )}

        {/* ════════════════════════════════════════════════ */}
        {/* SCENE 7: Risk scenarios                           */}
        {/* ════════════════════════════════════════════════ */}
        {sceneId === "risks" && (
          <div style={{ width: "100%", maxWidth: 360, opacity: sceneProgress < 0.85 ? Math.min(sceneProgress / 0.12, 1) : Math.max(1 - (sceneProgress - 0.85) / 0.15, 0) }}>
            <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase" as const, color: B.bandLimited, marginBottom: 10 }}>Your Biggest Risks</div>
            {/* Risk card */}
            <div style={{ background: "rgba(155,44,44,0.06)", border: "1px solid rgba(155,44,44,0.15)", borderRadius: 10, padding: "14px 16px", marginBottom: 10, opacity: sceneProgress > 0.15 ? 1 : 0, transform: sceneProgress > 0.15 ? "translateX(0)" : "translateX(-12px)", transition: "all 500ms ease" }}>
              <div style={{ fontSize: 12, fontWeight: 600, color: B.sand, marginBottom: 4 }}>Lose your top client</div>
              <div style={{ display: "flex", alignItems: "baseline", gap: 6 }}>
                <span style={{ fontSize: 22, fontWeight: 600, fontFamily: DISPLAY, color: B.bandLimited }}>48 → 31</span>
                <span style={{ fontSize: 10, color: "rgba(244,241,234,0.35)" }}>score drop</span>
              </div>
            </div>
            {/* Action card */}
            <div style={{ background: "rgba(26,122,109,0.06)", border: `1px solid rgba(26,122,109,0.15)`, borderRadius: 10, padding: "14px 16px", opacity: sceneProgress > 0.45 ? 1 : 0, transform: sceneProgress > 0.45 ? "translateX(0)" : "translateX(-12px)", transition: "all 500ms ease" }}>
              <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase" as const, color: B.teal, marginBottom: 6 }}>Priority 1</div>
              <div style={{ fontSize: 12, fontWeight: 600, color: B.sand, marginBottom: 4 }}>Secure a monthly retainer</div>
              <div style={{ fontSize: 18, fontWeight: 600, fontFamily: DISPLAY, color: B.teal }}>+12 pts</div>
            </div>
          </div>
        )}

        {/* ════════════════════════════════════════════════ */}
        {/* SCENE 8: Scripts                                  */}
        {/* ════════════════════════════════════════════════ */}
        {sceneId === "scripts" && (
          <div style={{ width: "100%", maxWidth: 360, opacity: sceneProgress < 0.85 ? Math.min(sceneProgress / 0.12, 1) : Math.max(1 - (sceneProgress - 0.85) / 0.15, 0) }}>
            <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase" as const, color: B.purple, marginBottom: 10 }}>Ready-to-Send Scripts</div>
            <div style={{ background: "rgba(244,241,234,0.04)", border: "1px solid rgba(244,241,234,0.08)", borderRadius: 10, padding: "16px 18px" }}>
              <div style={{ fontSize: 11, fontWeight: 600, color: B.sand, marginBottom: 10 }}>Retainer Pitch</div>
              <div style={{
                fontSize: 11, color: "rgba(244,241,234,0.45)", lineHeight: 1.6, fontStyle: "italic",
                overflow: "hidden", position: "relative",
              }}>
                <span style={{ display: "inline-block", maxWidth: sceneProgress > 0.2 ? "100%" : "0%", overflow: "hidden", whiteSpace: "nowrap", transition: "max-width 2s ease-out" }}>
                  &ldquo;Hi [Client], I&rsquo;d like to propose a monthly retainer that would give you...&rdquo;
                </span>
              </div>
              {/* Copy button */}
              <div style={{ marginTop: 14, display: "flex", justifyContent: "flex-end" }}>
                <div style={{
                  display: "inline-flex", alignItems: "center", gap: 6, padding: "6px 14px", borderRadius: 6,
                  background: sceneProgress > 0.7 ? "rgba(26,122,109,0.15)" : "rgba(244,241,234,0.06)",
                  border: `1px solid ${sceneProgress > 0.7 ? "rgba(26,122,109,0.3)" : "rgba(244,241,234,0.08)"}`,
                  transition: "all 400ms ease",
                }}>
                  {sceneProgress > 0.7 ? (
                    <>
                      <svg width="12" height="10" viewBox="0 0 12 10" fill="none"><path d="M1 5L4 8L11 1" stroke={B.teal} strokeWidth="2" strokeLinecap="round" /></svg>
                      <span style={{ fontSize: 10, fontWeight: 600, color: B.teal }}>Copied</span>
                    </>
                  ) : (
                    <span style={{ fontSize: 10, fontWeight: 600, color: "rgba(244,241,234,0.4)" }}>Copy script</span>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ════════════════════════════════════════════════ */}
        {/* SCENE 9: Closer                                   */}
        {/* ════════════════════════════════════════════════ */}
        {sceneId === "closer" && (
          <div style={{ textAlign: "center", maxWidth: 400, opacity: Math.min(sceneProgress / 0.15, 1) }}>
            <h2 style={{ fontFamily: DISPLAY, fontSize: 30, fontWeight: 400, color: B.sand, lineHeight: 1.15, letterSpacing: "-0.025em", margin: "0 0 14px" }}>
              Your income has a structure.
            </h2>
            <div style={{ width: 40, height: 2, background: `linear-gradient(90deg, ${B.teal}, ${B.purple})`, margin: "0 auto 14px", opacity: sceneProgress > 0.2 ? 1 : 0, transform: `scaleX(${sceneProgress > 0.2 ? 1 : 0})`, transition: "all 600ms ease" }} />
            <p style={{ fontFamily: DISPLAY, fontSize: 24, fontWeight: 400, color: "rgba(244,241,234,0.5)", lineHeight: 1.2, margin: 0, opacity: sceneProgress > 0.3 ? 1 : 0, transition: "opacity 600ms ease" }}>
              Now you can see it.
            </p>
          </div>
        )}

        {/* ════════════════════════════════════════════════ */}
        {/* SCENE 10: CTA                                     */}
        {/* ════════════════════════════════════════════════ */}
        {sceneId === "cta" && (
          <div style={{ textAlign: "center", opacity: Math.min(sceneProgress / 0.15, 1) }}>
            <div style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", padding: "14px 36px", borderRadius: 12, background: B.sand, animation: sceneProgress > 0.3 ? "demoPulse 2s ease-in-out infinite" : "none", boxShadow: "0 4px 20px rgba(0,0,0,0.2)" }}>
              <span style={{ fontSize: 15, fontWeight: 600, color: B.navy, letterSpacing: "-0.01em" }}>Get My Free Score →</span>
            </div>
            <div style={{ marginTop: 16, fontSize: 12, color: "rgba(244,241,234,0.3)", opacity: sceneProgress > 0.25 ? 1 : 0, transition: "opacity 600ms ease" }}>
              Free to start &middot; Under 2 minutes &middot; No bank connection
            </div>
          </div>
        )}

        {/* ── Pre-play / replay state ── */}
        {sceneIndex < 0 && !isPlaying && (
          <div style={{ textAlign: "center", cursor: "pointer" }}>
            <div style={{ width: 64, height: 64, borderRadius: "50%", background: "rgba(244,241,234,0.08)", border: "1px solid rgba(244,241,234,0.15)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px", transition: "background 200ms" }}>
              <svg width="20" height="24" viewBox="0 0 20 24" fill="none">
                <path d="M2 2L18 12L2 22V2Z" fill={B.sand} />
              </svg>
            </div>
            <div style={{ fontSize: 13, fontWeight: 500, color: "rgba(244,241,234,0.5)" }}>
              {hasPlayed ? "Watch again" : "See how it works"}
            </div>
          </div>
        )}

      </div>

      {/* ── Progress bar ── */}
      {isPlaying && sceneIndex >= 0 && (
        <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: 2, background: "rgba(244,241,234,0.06)" }}>
          <div style={{
            height: "100%", background: `linear-gradient(90deg, ${B.teal}, ${B.purple})`,
            width: `${((SCENES.slice(0, sceneIndex).reduce((s, sc) => s + sc.duration, 0) + sceneProgress * (SCENES[sceneIndex]?.duration || 0)) / TOTAL_DURATION) * 100}%`,
            transition: "width 100ms linear",
          }} />
        </div>
      )}
    </div>
  );
}
