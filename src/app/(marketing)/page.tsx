"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";

/* ================================================================== */
/* UTILITIES                                                           */
/* ================================================================== */

function useInView(threshold = 0) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    if (rect.top < window.innerHeight + 50 && rect.bottom > 0) { setVisible(true); return; }
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setVisible(true); obs.disconnect(); } }, { threshold });
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);
  return { ref, visible };
}

function useMobile(bp = 768) {
  const [m, setM] = useState(false);
  useEffect(() => { const c = () => setM(window.innerWidth <= bp); c(); window.addEventListener("resize", c); return () => window.removeEventListener("resize", c); }, [bp]);
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

function useReducedMotion() {
  const [r, setR] = useState(false);
  useEffect(() => { setR(window.matchMedia("(prefers-reduced-motion: reduce)").matches); }, []);
  return r;
}

function useFadeIn() {
  const reduced = useReducedMotion();
  return (visible: boolean, delay = 0): React.CSSProperties =>
    reduced ? {} : { opacity: visible ? 1 : 0, transform: visible ? "translateY(0)" : "translateY(10px)", transition: `opacity 500ms ease-out ${delay}ms, transform 500ms ease-out ${delay}ms` };
}

/* ================================================================== */
/* DESIGN SYSTEM                                                       */
/* ================================================================== */

const C = { navy: "#1C1635", purple: "#4B3FAE", teal: "#1F6D7A", sand: "#F4F1EA", white: "#FFFFFF", border: "#E5E7EB" };
const mono = '"SF Mono", "Fira Code", "IBM Plex Mono", "Courier New", monospace';
const muted = "rgba(14,26,43,0.68)";
const light = "rgba(14,26,43,0.52)";
const contentW = 1040;
const secPad = (m: boolean) => m ? 56 : 112;
const px = (m: boolean) => m ? 20 : 24;

/* Score Ring SVG */
function ScoreRing({ score, size, stroke = 8, color, trackColor = "rgba(255,255,255,0.06)" }: { score: number; size: number; stroke?: number; color: string; trackColor?: string }) {
  const r = (size - stroke) / 2;
  const circ = 2 * Math.PI * r;
  const offset = circ - (score / 100) * circ;
  return (
    <svg width={size} height={size} style={{ transform: "rotate(-90deg)" }}>
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={trackColor} strokeWidth={stroke} />
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={color} strokeWidth={stroke}
        strokeDasharray={circ} strokeDashoffset={offset} strokeLinecap="round"
        style={{ transition: "stroke-dashoffset 1.2s cubic-bezier(0.22, 1, 0.36, 1)", filter: `drop-shadow(0 0 4px ${color}40)` }} />
    </svg>
  );
}

/* Animated dimension bar — fills on scroll */
function DimensionBar({ label, value, color, visible, delay }: { label: string; value: number; color: string; visible: boolean; delay: number }) {
  return (
    <div style={{ marginBottom: 14 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 5 }}>
        <span style={{ fontSize: 13, fontWeight: 500, color: "rgba(244,241,234,0.55)" }}>{label}</span>
        <span style={{ fontSize: 13, fontWeight: 600, fontFamily: mono, color }}>{value}%</span>
      </div>
      <div style={{ height: 6, borderRadius: 3, backgroundColor: "rgba(255,255,255,0.06)", overflow: "hidden" }}>
        <div style={{
          height: "100%", borderRadius: 3, backgroundColor: color,
          width: visible ? `${value}%` : "0%",
          transition: `width 1s cubic-bezier(0.22, 1, 0.36, 1) ${delay}ms`,
          boxShadow: `0 0 8px ${color}30`,
        }} />
      </div>
    </div>
  );
}

/* Pressure bar — horizontal stacked segments */
function PressureBar({ segments, height = 14 }: { segments: { pct: number; color: string; label: string }[]; height?: number }) {
  return (
    <div>
      <div style={{ display: "flex", height, borderRadius: height / 2, overflow: "hidden", marginBottom: 8 }}>
        {segments.map((s, i) => (
          <div key={i} style={{ width: `${s.pct}%`, backgroundColor: s.color, borderRight: i < segments.length - 1 ? "2px solid rgba(255,255,255,0.8)" : "none" }} />
        ))}
      </div>
      <div style={{ display: "flex" }}>
        {segments.map((s, i) => s.pct >= 12 ? (
          <div key={i} style={{ width: `${s.pct}%` }}>
            <span style={{ fontSize: 11, fontWeight: 600, color: s.color }}>{s.label} {s.pct}%</span>
          </div>
        ) : null)}
      </div>
    </div>
  );
}

/* ================================================================== */
/* INDUSTRY DATA                                                       */
/* ================================================================== */

const INDUSTRIES = [
  // Tier 1 — highest pain, income resets constantly
  { key: "consulting", name: "Consulting", avg: 38, constraint: "You are the product", risk: "Your clients pay for your time, not a system. If you stop delivering, 85% of your income stops with you. You can't take a month off without the math changing.", cta: "Measure my income stability" },
  { key: "real_estate", name: "Real Estate", avg: 34, constraint: "Pipeline dependency", risk: "One delayed closing or one lost listing can erase a quarter of annual earnings. Your pipeline looks full — but nothing in it is contractually yours until it closes.", cta: "Stress-test my income structure" },
  { key: "sales", name: "Sales / Brokerage", avg: 31, constraint: "Nothing is guaranteed past this quarter", risk: "Last quarter was strong. But your structure doesn't carry that forward. Next quarter starts from zero unless you close again.", cta: "Stress-test my income structure" },
  { key: "creative", name: "Freelance / Creative", avg: 27, constraint: "Every month starts at zero", risk: "No project means no income. No retainer means no floor. You are re-earning your entire livelihood every 30 days, and the pipeline between projects is silence.", cta: "Measure my income stability" },
  // Tier 2 — high pain, project-based or cyclical
  { key: "construction", name: "Construction / Trades", avg: 29, constraint: "The next job isn't signed yet", risk: "The current project is solid. The next one is a handshake. Your income has no structural buffer between jobs — when one ends, the clock starts.", cta: "Measure my income stability" },
  { key: "media", name: "Media / Entertainment", avg: 28, constraint: "Between projects, income is zero", risk: "Strong projects create strong months. But between them, your income is not low — it is zero. No carry. No residual. Every engagement starts from scratch.", cta: "Run my structural assessment" },
  { key: "insurance", name: "Insurance", avg: 43, constraint: "New business masks renewal erosion", risk: "Strong production quarters feel like growth. But if renewals are quietly slipping underneath, your structure is compounding backwards — and you won't see it until new business slows.", cta: "Stress-test my income structure" },
  { key: "legal", name: "Legal Services", avg: 40, constraint: "Three matters carry the practice", risk: "Count your top three matters. They likely carry 60-70% of your billings. When one concludes, the gap doesn't build gradually — it arrives all at once.", cta: "Measure my income stability" },
  // Tier 3 — moderate pain, hidden concentration risk
  { key: "technology", name: "Technology", avg: 42, constraint: "One employer, one system, one decision", risk: "Your compensation feels stable because the system around it is stable. But it's one layoff, one reorg, one equity reset away from a total structural shift — and you have no second source.", cta: "Measure my income stability" },
  { key: "finance", name: "Finance / Banking", avg: 44, constraint: "The variable component is the one that matters", risk: "Base salary creates a floor. But the bonus, the production credit, the performance component — that's where the real earnings live. And that's the part that can vanish in one cycle.", cta: "Stress-test my income structure" },
  { key: "healthcare", name: "Healthcare", avg: 46, constraint: "One system, no alternatives", risk: "Steady pay from one institution feels safe until the institution restructures. When your sole employer changes compensation models, hours, or staffing — you have no structural alternative.", cta: "Measure my income stability" },
  { key: "fitness", name: "Fitness / Wellness", avg: 30, constraint: "Clients cancel. Revenue disappears the same day.", risk: "Your income is a collection of individual decisions that can reverse without notice. One slow month, one seasonal dip, one competitor opens nearby — and the calendar empties faster than you can fill it.", cta: "Run my structural assessment" },
];

/* ================================================================== */
/* SECTION 1 — HERO + INDUSTRY SELECTOR                                */
/* ================================================================== */

function HeroSection() {
  const { ref, visible } = useInView();
  const m = useMobile();
  const fadeIn = useFadeIn();
  const [selected, setSelected] = useState<typeof INDUSTRIES[0] | null>(null);
  const animatedScore = useAnimatedCounter(selected?.avg || 0, !!selected, 1200);
  const bandColor = (s: number) => s >= 75 ? C.teal : s >= 50 ? "#2B5EA7" : s >= 30 ? "#92640A" : "#9B2C2C";
  const bandLabel = (s: number) => s >= 75 ? "High Stability" : s >= 50 ? "Established" : s >= 30 ? "Developing" : "Limited";

  return (
    <header ref={ref} style={{ backgroundColor: C.navy, position: "relative", overflow: "hidden" }}>
      {/* Ambient glow */}
      <div style={{ position: "absolute", top: "-20%", right: "-10%", width: m ? 400 : 800, height: m ? 400 : 800, borderRadius: "50%", background: `radial-gradient(circle, ${C.purple}10 0%, transparent 70%)`, pointerEvents: "none" }} />
      <div style={{ position: "absolute", bottom: "-30%", left: "-15%", width: m ? 300 : 600, height: m ? 300 : 600, borderRadius: "50%", background: `radial-gradient(circle, ${C.teal}08 0%, transparent 70%)`, pointerEvents: "none" }} />

      <div style={{ maxWidth: contentW, margin: "0 auto", paddingTop: m ? 72 : 140, paddingBottom: m ? 48 : 80, paddingLeft: px(m), paddingRight: px(m), position: "relative", zIndex: 1 }}>

        <div style={{ display: m ? "block" : "flex", alignItems: "center", justifyContent: "space-between", gap: 64 }}>
          {/* Left — headline */}
          <div style={{ maxWidth: 560, textAlign: m ? "center" : "left", marginBottom: m ? 36 : 0 }}>
            <h1 style={{ fontSize: m ? 36 : 56, fontWeight: 700, lineHeight: 1.06, letterSpacing: "-0.03em", color: C.sand, marginBottom: 24, ...fadeIn(visible) }}>
              Your income has a structure.{m ? " " : <br />}You&#8217;ve never seen it.
            </h1>
            <p style={{ fontSize: m ? 16 : 18, color: "rgba(244,241,234,0.55)", lineHeight: 1.7, marginBottom: 28, ...fadeIn(visible, 100) }}>
              RunPayway&#8482; measures how your income holds under pressure — not how much you make.
            </p>
            <div style={{ ...fadeIn(visible, 200) }}>
              <Link href="/pricing" style={{
                display: "inline-flex", alignItems: "center", justifyContent: "center",
                height: 56, width: m ? "100%" : "auto", padding: m ? "0 24px" : "0 44px",
                borderRadius: 12, backgroundColor: C.white, color: C.navy,
                fontSize: m ? 15 : 16, fontWeight: 600, textDecoration: "none",
                boxShadow: "0 2px 16px rgba(244,241,234,0.10)",
                transition: "background-color 200ms, box-shadow 200ms",
              }}
                onMouseEnter={e => { e.currentTarget.style.backgroundColor = "#E8E5DE"; }}
                onMouseLeave={e => { e.currentTarget.style.backgroundColor = C.white; }}>
                Get My Income Stability Score
              </Link>
              <p style={{ fontSize: 14, color: "rgba(244,241,234,0.30)", marginTop: 14, letterSpacing: "0.02em" }}>
                Under 2 minutes &bull; Instant result &bull; Private by default
              </p>
            </div>
          </div>

          {/* Right — pulsing score ring (idle) or industry result */}
          <div style={{ flexShrink: 0, ...fadeIn(visible, 300) }}>
            <div style={{ width: m ? 200 : 240, height: m ? 200 : 240, margin: m ? "0 auto" : undefined, position: "relative" }}>
              {!selected ? (
                /* Idle state — empty pulsing ring inviting interaction */
                <>
                  <style>{`
                    @keyframes ringPulse { 0%, 100% { opacity: 0.3; transform: rotate(-90deg) scale(1); } 50% { opacity: 0.6; transform: rotate(-90deg) scale(1.02); } }
                    @keyframes fadeSlideIn { from { opacity: 0; transform: translateY(16px); } to { opacity: 1; transform: translateY(0); } }
                  `}</style>
                  <svg width={m ? 200 : 240} height={m ? 200 : 240} style={{ animation: "ringPulse 3s ease-in-out infinite" }}>
                    <circle cx={m ? 100 : 120} cy={m ? 100 : 120} r={m ? 88 : 108} fill="none" stroke={`${C.purple}30`} strokeWidth={8} strokeDasharray="12 8" strokeLinecap="round" />
                  </svg>
                  <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
                    <span style={{ fontSize: m ? 14 : 16, fontWeight: 500, color: "rgba(244,241,234,0.35)", textAlign: "center", lineHeight: 1.4 }}>Select your<br />industry below</span>
                  </div>
                </>
              ) : (
                /* Active state — filled ring with score */
                <div style={{ animation: "fadeSlideIn 400ms ease-out" }}>
                  <div style={{ position: "relative", width: m ? 200 : 240, height: m ? 200 : 240 }}>
                    {/* Glow */}
                    <div style={{ position: "absolute", inset: -20, borderRadius: "50%", background: `radial-gradient(circle, ${bandColor(selected.avg)}15 0%, transparent 60%)`, pointerEvents: "none" }} />
                    <ScoreRing score={animatedScore} size={m ? 200 : 240} stroke={8} color={bandColor(animatedScore)} />
                    <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
                      <span style={{ fontSize: m ? 48 : 56, fontWeight: 300, fontFamily: mono, color: C.sand, lineHeight: 1, letterSpacing: "-0.04em" }}>{animatedScore}</span>
                      <span style={{ fontSize: 12, fontWeight: 600, color: bandColor(selected.avg), marginTop: 6, letterSpacing: "0.04em" }}>{bandLabel(selected.avg)}</span>
                      <span style={{ fontSize: 12, color: "rgba(244,241,234,0.35)", marginTop: 4 }}>{selected.name} avg</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Industry selector */}
        <div style={{ marginTop: m ? 36 : 48, ...fadeIn(visible, 250) }}>
          <div style={{ fontSize: 12, fontWeight: 700, letterSpacing: "0.10em", color: C.teal, textAlign: "center", marginBottom: 16 }}>SELECT YOUR INDUSTRY</div>
          <div style={{ display: "grid", gridTemplateColumns: m ? "repeat(2, 1fr)" : "repeat(4, 1fr)", gap: m ? 8 : 10, maxWidth: 800, margin: "0 auto" }}>
            {INDUSTRIES.slice(0, m ? 8 : 12).map(ind => {
              const isActive = selected?.key === ind.key;
              return (
                <button key={ind.key} onClick={() => setSelected(isActive ? null : ind)}
                  style={{
                    padding: m ? "12px 10px" : "14px 16px", borderRadius: 10, cursor: "pointer",
                    border: `1px solid ${isActive ? C.teal + "50" : "rgba(255,255,255,0.06)"}`,
                    backgroundColor: isActive ? `${C.teal}12` : "rgba(255,255,255,0.02)",
                    transition: "all 200ms", textAlign: "left", minHeight: 44,
                  }}
                  onMouseEnter={e => { if (!isActive) e.currentTarget.style.borderColor = "rgba(255,255,255,0.12)"; }}
                  onMouseLeave={e => { if (!isActive) e.currentTarget.style.borderColor = "rgba(255,255,255,0.06)"; }}
                >
                  <span style={{ fontSize: 14, fontWeight: isActive ? 600 : 500, color: isActive ? C.sand : "rgba(244,241,234,0.65)" }}>{ind.name}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Industry risk reveal */}
        {selected && (
          <div style={{ maxWidth: 680, margin: "32px auto 0", padding: m ? "20px 16px" : "24px 28px", borderRadius: 14, backgroundColor: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)", animation: "fadeSlideIn 400ms ease-out" }}>
            <div style={{ fontSize: 12, fontWeight: 700, letterSpacing: "0.08em", color: "#E57373", marginBottom: 8 }}>PRIMARY CONSTRAINT: {selected.constraint.toUpperCase()}</div>
            <p style={{ fontSize: 16, color: "rgba(244,241,234,0.70)", lineHeight: 1.65, margin: "0 0 16px" }}>{selected.risk}</p>
            <Link href="/pricing" style={{ fontSize: 15, fontWeight: 600, color: C.teal, textDecoration: "none" }}>
              {selected.cta} &rarr;
            </Link>
          </div>
        )}

        {/* Credibility signal + trust strip */}
        <div style={{ marginTop: m ? 36 : 48, paddingTop: m ? 20 : 28, borderTop: "1px solid rgba(244,241,234,0.06)", textAlign: "center", ...fadeIn(visible, 400) }}>
          <p style={{ fontSize: 14, fontWeight: 500, color: "rgba(244,241,234,0.40)", letterSpacing: "0.02em", marginBottom: 6 }}>
            Model RP-2.0 &bull; 6 structural dimensions &bull; Deterministic output
          </p>
          <p style={{ fontSize: 13, color: "rgba(244,241,234,0.25)", letterSpacing: "0.03em" }}>
            No bank connection &bull; No credit pull &bull; Version-locked scoring logic
          </p>
        </div>
      </div>
    </header>
  );
}


/* ================================================================== */
/* SECTION 2 — SAME INCOME, DIFFERENT STABILITY                        */
/* ================================================================== */

function SameIncomeProof() {
  const { ref, visible } = useInView();
  const m = useMobile();
  const fadeIn = useFadeIn();
  return (
    <section ref={ref} style={{ backgroundColor: C.white, paddingTop: secPad(m), paddingBottom: secPad(m), paddingLeft: px(m), paddingRight: px(m) }}>
      <div style={{ maxWidth: contentW, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: m ? 36 : 56, ...fadeIn(visible) }}>
          <h2 style={{ fontSize: m ? 28 : 44, fontWeight: 700, lineHeight: 1.1, letterSpacing: "-0.02em", color: C.navy, marginBottom: 14 }}>Same income. Different structure.{m ? " " : <br />}Completely different risk.</h2>
        </div>
        <div style={{ display: m ? "block" : "grid", gridTemplateColumns: "1fr 1fr", gap: 24, maxWidth: 880, margin: "0 auto", ...fadeIn(visible, 120) }}>
          {/* Person A — fragile */}
          <div style={{ borderRadius: 16, padding: m ? 20 : 32, border: `1px solid ${C.border}`, marginBottom: m ? 16 : 0, position: "relative" as const, overflow: "hidden" }}>
            <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 3, backgroundColor: "rgba(155,44,44,0.25)" }} />
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 20 }}>
              <div style={{ fontSize: 15, fontWeight: 600, color: C.navy }}>$150K / year</div>
              <div style={{ fontSize: 13, color: light }}>Freelance Consultant</div>
            </div>
            {/* Pressure bar — heavily red */}
            <PressureBar segments={[
              { pct: 80, color: "#C0392B", label: "At risk" },
              { pct: 15, color: "#D4A843", label: "" },
              { pct: 5, color: C.teal, label: "" },
            ]} height={16} />
            <p style={{ fontSize: 14, color: muted, lineHeight: 1.6, margin: "16px 0 24px" }}>
              80% of income depends on one client. No contracts. No continuity. If work stops, income stops.
            </p>
            <div style={{ display: "flex", alignItems: "center", gap: 14, padding: "16px 0 0", borderTop: `1px solid rgba(14,26,43,0.05)` }}>
              <div style={{ position: "relative", width: 52, height: 52, flexShrink: 0 }}>
                <ScoreRing score={31} size={52} stroke={5} color="#9B2C2C" trackColor="rgba(14,26,43,0.06)" />
                <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <span style={{ fontSize: 16, fontWeight: 600, fontFamily: mono, color: "#9B2C2C" }}>31</span>
                </div>
              </div>
              <div>
                <div style={{ fontSize: 15, fontWeight: 600, color: "#9B2C2C" }}>Limited Stability</div>
                <div style={{ fontSize: 13, color: light }}>One decision away from crisis</div>
              </div>
            </div>
          </div>
          {/* Person B — structured */}
          <div style={{ borderRadius: 16, padding: m ? 20 : 32, border: `1px solid ${C.border}`, position: "relative" as const, overflow: "hidden" }}>
            <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 3, background: `linear-gradient(90deg, ${C.teal}, ${C.purple})` }} />
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 20 }}>
              <div style={{ fontSize: 15, fontWeight: 600, color: C.navy }}>$150K / year</div>
              <div style={{ fontSize: 13, color: light }}>Freelance Consultant</div>
            </div>
            {/* Pressure bar — balanced */}
            <PressureBar segments={[
              { pct: 25, color: "#C0392B", label: "At risk" },
              { pct: 35, color: "#D4A843", label: "Recurring" },
              { pct: 40, color: C.teal, label: "Protected" },
            ]} height={16} />
            <p style={{ fontSize: 14, color: muted, lineHeight: 1.6, margin: "16px 0 24px" }}>
              5 clients, none over 30%. 40% recurring. 3 months secured forward. Structure absorbs disruption.
            </p>
            <div style={{ display: "flex", alignItems: "center", gap: 14, padding: "16px 0 0", borderTop: `1px solid rgba(14,26,43,0.05)` }}>
              <div style={{ position: "relative", width: 52, height: 52, flexShrink: 0 }}>
                <ScoreRing score={74} size={52} stroke={5} color={C.teal} trackColor="rgba(14,26,43,0.06)" />
                <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <span style={{ fontSize: 16, fontWeight: 600, fontFamily: mono, color: C.teal }}>74</span>
                </div>
              </div>
              <div>
                <div style={{ fontSize: 15, fontWeight: 600, color: C.teal }}>Established Stability</div>
                <div style={{ fontSize: 13, color: light }}>Can absorb a disruption and keep going</div>
              </div>
            </div>
          </div>
        </div>
        <p style={{ fontSize: 17, fontWeight: 500, color: C.navy, textAlign: "center", marginTop: m ? 28 : 48, ...fadeIn(visible, 220) }}>The income is the same. The structure is not. That&#8217;s what RunPayway measures.</p>
      </div>
    </section>
  );
}


/* ================================================================== */
/* SECTION 3 — THE SYSTEM (merged: definition + how it works + tools)  */
/* ================================================================== */

function TheSystem() {
  const { ref, visible } = useInView();
  const m = useMobile();
  const fadeIn = useFadeIn();
  return (
    <section ref={ref} style={{ backgroundColor: C.navy, paddingTop: secPad(m), paddingBottom: secPad(m), paddingLeft: px(m), paddingRight: px(m), position: "relative", overflow: "hidden" }}>
      <div style={{ position: "absolute", top: "50%", left: "50%", width: m ? 300 : 600, height: m ? 300 : 600, transform: "translate(-50%, -50%)", borderRadius: "50%", background: `radial-gradient(circle, ${C.purple}08 0%, transparent 70%)`, pointerEvents: "none" }} />
      <div style={{ maxWidth: 880, margin: "0 auto", position: "relative", zIndex: 1 }}>

        {/* What it is */}
        <div style={{ textAlign: "center", marginBottom: m ? 48 : 64, ...fadeIn(visible) }}>
          <div style={{ fontSize: 12, fontWeight: 700, letterSpacing: "0.10em", color: C.teal, marginBottom: 16 }}>THE SYSTEM</div>
          <h2 style={{ fontSize: m ? 28 : 44, fontWeight: 500, lineHeight: 1.12, letterSpacing: "-0.02em", color: C.sand, marginBottom: 20 }}>
            Not a budget. Not a forecast.{m ? " " : <br />}A structural measurement.
          </h2>
          <p style={{ fontSize: 17, color: "rgba(244,241,234,0.50)", lineHeight: 1.7, maxWidth: 560, margin: "0 auto" }}>
            RunPayway evaluates 6 fixed structural dimensions of your income. A deterministic model. Same inputs always produce the same score.
          </p>
        </div>

        {/* System visualization — animated dimension bars + 3 steps side by side */}
        <div style={{ display: m ? "block" : "flex", gap: 40, marginBottom: m ? 48 : 72, ...fadeIn(visible, 100) }}>
          {/* Left — animated 6 dimensions */}
          <div style={{ flex: 1, padding: m ? "24px 16px" : "28px 24px", borderRadius: 14, backgroundColor: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)", marginBottom: m ? 20 : 0 }}>
            <div style={{ fontSize: 12, fontWeight: 700, letterSpacing: "0.08em", color: C.teal, marginBottom: 20 }}>6 STRUCTURAL DIMENSIONS</div>
            <DimensionBar label="Income Persistence" value={45} color={C.teal} visible={visible} delay={200} />
            <DimensionBar label="Source Concentration" value={72} color="#D4A843" visible={visible} delay={350} />
            <DimensionBar label="Source Diversity" value={33} color="#E57373" visible={visible} delay={500} />
            <DimensionBar label="Forward Visibility" value={28} color="#E57373" visible={visible} delay={650} />
            <DimensionBar label="Income Variability" value={55} color={C.teal} visible={visible} delay={800} />
            <DimensionBar label="Labor Dependence" value={85} color="#E57373" visible={visible} delay={950} />
            <div style={{ marginTop: 16, paddingTop: 14, borderTop: "1px solid rgba(255,255,255,0.06)", display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
              <span style={{ fontSize: 12, color: "rgba(244,241,234,0.35)" }}>Composite score</span>
              <span style={{ fontSize: 24, fontWeight: 300, fontFamily: mono, color: C.sand }}>{visible ? "42" : "\u2014"}</span>
            </div>
          </div>
          {/* Right — 3 steps */}
          <div style={{ flex: 1, display: "flex", flexDirection: "column" as const, gap: 16 }}>
            {[
              { num: "01", title: "Describe your structure", desc: "Sources, contracts, concentration, and dependencies. Under 2 minutes." },
              { num: "02", title: "6 fixed dimensions scored", desc: "Persistence, concentration, diversification, forward visibility, variability, labor dependence." },
              { num: "03", title: "One standardized result", desc: "Score 0\u2013100. Band classification. Primary constraint. Recommended direction." },
            ].map((s, i) => (
              <div key={i} style={{ padding: m ? "18px 16px" : "20px 20px", borderRadius: 12, backgroundColor: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)", flex: 1, display: "flex", flexDirection: "column" as const, justifyContent: "center" }}>
                <div style={{ fontSize: 13, fontWeight: 600, fontFamily: mono, color: C.teal, marginBottom: 8 }}>{s.num}</div>
                <div style={{ fontSize: 16, fontWeight: 600, color: C.sand, marginBottom: 6, lineHeight: 1.3 }}>{s.title}</div>
                <p style={{ fontSize: 14, color: "rgba(244,241,234,0.50)", margin: 0, lineHeight: 1.55 }}>{s.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* What you get */}
        <div style={{ ...fadeIn(visible, 200) }}>
          <div style={{ fontSize: 12, fontWeight: 700, letterSpacing: "0.10em", color: C.teal, textAlign: "center", marginBottom: 20 }}>INCLUDED WITH YOUR DIAGNOSTIC</div>
          <div style={{ display: "grid", gridTemplateColumns: m ? "1fr" : "1fr 1fr", gap: 12 }}>
            {[
              { title: "PressureMap\u2122", desc: "See exactly where your income is vulnerable and where it is protected." },
              { title: "What-If Simulator", desc: "Model structural changes before you commit. See the exact score impact." },
              { title: "12-Week Roadmap", desc: "Sequenced action plan with industry-specific scripts." },
              { title: "Goal Mode", desc: "Pick a target band. See the minimum moves required to reach it." },
            ].map((t, i) => (
              <div key={i} style={{ padding: m ? "16px 14px" : "18px 20px", borderRadius: 10, border: "1px solid rgba(255,255,255,0.06)", backgroundColor: "rgba(255,255,255,0.02)" }}>
                <div style={{ fontSize: 15, fontWeight: 600, color: C.sand, marginBottom: 4 }}>{t.title}</div>
                <p style={{ fontSize: 14, color: "rgba(244,241,234,0.45)", margin: 0, lineHeight: 1.55 }}>{t.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}


/* ================================================================== */
/* SECTION 4 — TRUST                                                   */
/* ================================================================== */

function TrustStrip() {
  const { ref, visible } = useInView();
  const m = useMobile();
  const fadeIn = useFadeIn();
  return (
    <section ref={ref} style={{ backgroundColor: C.sand, paddingTop: secPad(m), paddingBottom: secPad(m), paddingLeft: px(m), paddingRight: px(m) }}>
      <div style={{ maxWidth: contentW, margin: "0 auto" }}>
        <h2 style={{ fontSize: m ? 28 : 40, fontWeight: 500, lineHeight: 1.15, letterSpacing: "-0.02em", color: C.navy, textAlign: "center", marginBottom: m ? 36 : 56, ...fadeIn(visible) }}>
          Designed as a measurement system — not a financial tool.
        </h2>
        <div style={{ display: "grid", gridTemplateColumns: m ? "1fr 1fr" : "1fr 1fr 1fr 1fr", gap: 16, ...fadeIn(visible, 100) }}>
          {[
            { title: "No bank connection", desc: "We never access financial accounts.", icon: "M12 15v2m-6 4h12a2 2 0 0 0 2-2v-6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2zm10-10V7a4 4 0 0 0-8 0v4h8z" },
            { title: "No credit pull", desc: "No impact on your credit.", icon: "M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0 1 12 2.944a11.955 11.955 0 0 1-8.618 3.04A12.02 12.02 0 0 0 3 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" },
            { title: "Private by default", desc: "Your data is never sold.", icon: "M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0z M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" },
            { title: "Deterministic scoring", desc: "Same inputs \u2192 same score.", icon: "M4 4v5h.582m15.356 2A8.001 8.001 0 0 0 4.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 0 1-15.357-2m15.357 2H15" },
          ].map((item, i) => (
            <div key={i} style={{ textAlign: "center", padding: m ? 20 : 28, borderRadius: 14, backgroundColor: C.white, border: `1px solid ${C.border}` }}>
              <div style={{ width: 40, height: 40, borderRadius: 10, backgroundColor: `${C.navy}06`, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 14px" }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={C.navy} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d={item.icon} /></svg>
              </div>
              <div style={{ fontSize: 16, fontWeight: 600, color: C.navy, marginBottom: 6 }}>{item.title}</div>
              <p style={{ fontSize: 14, color: muted, lineHeight: 1.6, margin: 0 }}>{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}


/* ================================================================== */
/* SECTION 5 — FINAL CTA                                               */
/* ================================================================== */

function FinalCta() {
  const { ref, visible } = useInView();
  const m = useMobile();
  const fadeIn = useFadeIn();
  return (
    <section ref={ref} style={{ backgroundColor: C.navy, paddingTop: m ? 72 : 120, paddingBottom: m ? 72 : 120, paddingLeft: px(m), paddingRight: px(m), position: "relative", overflow: "hidden" }}>
      <div style={{ position: "absolute", top: "50%", left: "50%", width: m ? 300 : 500, height: m ? 300 : 500, transform: "translate(-50%, -50%)", borderRadius: "50%", background: `radial-gradient(circle, ${C.purple}08 0%, transparent 70%)`, pointerEvents: "none" }} />
      <div style={{ maxWidth: 640, margin: "0 auto", textAlign: "center", position: "relative", zIndex: 1 }}>
        <h2 style={{ fontSize: m ? 28 : 44, fontWeight: 500, lineHeight: 1.12, letterSpacing: "-0.02em", color: C.sand, marginBottom: 20, ...fadeIn(visible) }}>
          Your income is already being tested.{m ? " " : <br />}Now you can see how it holds.
        </h2>
        <p style={{ fontSize: 17, color: "rgba(244,241,234,0.45)", lineHeight: 1.65, marginBottom: 40, ...fadeIn(visible, 80) }}>
          Start with the free score. Unlock the full diagnostic when you&#8217;re ready to act.
        </p>
        <div style={{ ...fadeIn(visible, 160) }}>
          <Link href="/pricing" style={{
            display: "inline-flex", alignItems: "center", justifyContent: "center",
            height: 56, padding: m ? "0 28px" : "0 48px", width: m ? "100%" : "auto", maxWidth: m ? 360 : "none",
            borderRadius: 12, backgroundColor: C.white, color: C.navy,
            fontSize: m ? 15 : 17, fontWeight: 600, textDecoration: "none",
            boxShadow: "0 2px 16px rgba(244,241,234,0.10)",
            transition: "background-color 200ms, box-shadow 200ms",
          }}
            onMouseEnter={e => { e.currentTarget.style.backgroundColor = "#E8E5DE"; }}
            onMouseLeave={e => { e.currentTarget.style.backgroundColor = C.white; }}>
            Start Your Free Assessment
          </Link>
        </div>
      </div>
    </section>
  );
}


/* ================================================================== */
/* STICKY MOBILE CTA                                                   */
/* ================================================================== */

function StickyMobileCta() {
  const m = useMobile();
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 600);
    window.addEventListener("scroll", h, { passive: true });
    return () => window.removeEventListener("scroll", h);
  }, []);
  if (!m || !scrolled) return null;
  return (
    <div style={{
      position: "fixed", bottom: 0, left: 0, right: 0, zIndex: 100,
      padding: "12px 16px max(12px, env(safe-area-inset-bottom))",
      backgroundColor: "rgba(28,22,53,0.97)",
      backdropFilter: "blur(12px)", WebkitBackdropFilter: "blur(12px)",
      borderTop: "1px solid rgba(255,255,255,0.06)",
    }}>
      <Link href="/pricing" style={{
        display: "flex", alignItems: "center", justifyContent: "center",
        height: 48, borderRadius: 10, backgroundColor: C.white, color: C.navy,
        fontSize: 15, fontWeight: 600, textDecoration: "none",
      }}>
        Get My Income Stability Score
      </Link>
    </div>
  );
}


/* ================================================================== */
/* STRUCTURED DATA                                                     */
/* ================================================================== */

const PRODUCT_SCHEMA = {
  "@context": "https://schema.org", "@type": "Product",
  name: "RunPayway Income Stability Score",
  description: "A structural assessment that measures how stable your income structure is \u2014 not how much you make.",
  brand: { "@type": "Brand", name: "RunPayway" },
  offers: [
    { "@type": "Offer", price: "0", priceCurrency: "USD", name: "Income Stability Score", description: "Score, band, primary constraint, and one recommended direction." },
    { "@type": "Offer", price: "69", priceCurrency: "USD", name: "RunPayway Diagnostic Report", description: "Full diagnostic with PressureMap, Command Center, scripts, and 12-week roadmap." },
  ],
};


/* ================================================================== */
/* PAGE EXPORT                                                         */
/* ================================================================== */

export default function LandingPage() {
  return (
    <div className="overflow-x-hidden">
      <a href="#main-content" style={{ position: "absolute", left: "-9999px", top: "auto", width: 1, height: 1, overflow: "hidden", zIndex: 9999, padding: "12px 24px", backgroundColor: C.navy, color: C.white, fontSize: 14, fontWeight: 600, textDecoration: "none", borderRadius: 8 }}
        onFocus={e => { e.currentTarget.style.position = "fixed"; e.currentTarget.style.left = "16px"; e.currentTarget.style.top = "16px"; e.currentTarget.style.width = "auto"; e.currentTarget.style.height = "auto"; }}
        onBlur={e => { e.currentTarget.style.position = "absolute"; e.currentTarget.style.left = "-9999px"; e.currentTarget.style.width = "1px"; e.currentTarget.style.height = "1px"; }}>
        Skip to main content
      </a>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(PRODUCT_SCHEMA) }} />
      <main id="main-content">
        <HeroSection />
        <SameIncomeProof />
        <TheSystem />
        <TrustStrip />
        <FinalCta />
      </main>
      <StickyMobileCta />
    </div>
  );
}
