"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import logoWhite from "../../../public/runpayway-logo-white.png";

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
  const rafId = useRef(0);
  const prevTarget = useRef(0);
  useEffect(() => {
    if (!trigger) { setValue(0); return; }
    if (target === prevTarget.current && value === target) return;
    prevTarget.current = target;
    cancelAnimationFrame(rafId.current);
    const start = performance.now();
    const startValue = value;
    const step = (now: number) => {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setValue(Math.round(startValue + (target - startValue) * eased));
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
const light = "rgba(14,26,43,0.62)";
const contentW = 1040;
const px = (m: boolean) => m ? 20 : 24;

/* Elevation tokens — replace borders with shadow depth */
const elevation = {
  card: "0 1px 3px rgba(14,26,43,0.04), 0 4px 16px rgba(14,26,43,0.03)",
  cardHover: "0 2px 8px rgba(14,26,43,0.06), 0 8px 32px rgba(14,26,43,0.05)",
  cta: "0 2px 8px rgba(28,22,53,0.15), 0 8px 32px rgba(28,22,53,0.10)",
  ctaHover: "0 4px 16px rgba(28,22,53,0.20), 0 12px 48px rgba(28,22,53,0.12)",
};

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

/* CTA button with magnetic styling */
function CtaButton({ m, variant = "light" }: { m: boolean; variant?: "light" | "dark" }) {
  const isLight = variant === "light";
  return (
    <div>
      <Link href="/pricing" style={{
        display: "inline-flex", alignItems: "center", justifyContent: "center",
        height: 56, width: m ? "100%" : "auto", padding: m ? "0 24px" : "0 44px",
        borderRadius: 12,
        background: isLight
          ? `linear-gradient(135deg, ${C.white} 0%, rgba(244,241,234,0.95) 100%)`
          : `linear-gradient(135deg, ${C.navy} 0%, #251e42 100%)`,
        color: isLight ? C.navy : C.white,
        fontSize: m ? 15 : 16, fontWeight: 600, textDecoration: "none",
        boxShadow: isLight ? "0 2px 12px rgba(244,241,234,0.15), 0 8px 32px rgba(244,241,234,0.08)" : elevation.cta,
        transition: "transform 200ms, box-shadow 200ms",
        border: isLight ? "1px solid rgba(244,241,234,0.45)" : "1px solid rgba(255,255,255,0.08)",
      }}
        onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-1px)"; e.currentTarget.style.boxShadow = isLight ? "0 4px 20px rgba(244,241,234,0.20), 0 12px 48px rgba(244,241,234,0.10)" : elevation.ctaHover; }}
        onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = isLight ? "0 2px 12px rgba(244,241,234,0.15), 0 8px 32px rgba(244,241,234,0.08)" : elevation.cta; }}>
        Get My Income Stability Score
      </Link>
      <p style={{ fontSize: 13, color: isLight ? "rgba(244,241,234,0.50)" : light, marginTop: 14, letterSpacing: "0.02em", textAlign: m ? "center" : undefined }}>
        Free &bull; Under 2 minutes &bull; No account required
      </p>
    </div>
  );
}


/* ================================================================== */
/* INDUSTRY DATA                                                       */
/* ================================================================== */

const INDUSTRIES = [
  { key: "consulting", name: "Consulting", avg: 38, constraint: "You are the product", risk: "Your clients pay for your time, not a system. If you stop delivering, 85% of your income stops with you. You can't take a month off without the math changing.", cta: "Measure my income stability" },
  { key: "real_estate", name: "Real Estate", avg: 34, constraint: "Pipeline dependency", risk: "One delayed closing or one lost listing can erase a quarter of annual earnings. Your pipeline looks full — but nothing in it is contractually yours until it closes.", cta: "Stress-test my income" },
  { key: "sales", name: "Sales / Brokerage", avg: 31, constraint: "Nothing is guaranteed past this quarter", risk: "Last quarter was strong. But your structure doesn't carry that forward. Next quarter starts from zero unless you close again.", cta: "Stress-test my income" },
  { key: "creative", name: "Freelance / Creative", avg: 27, constraint: "Every month starts at zero", risk: "No project means no income. No retainer means no floor. You are re-earning your entire livelihood every 30 days, and the pipeline between projects is silence.", cta: "Measure my income stability" },
  { key: "construction", name: "Construction / Trades", avg: 29, constraint: "The next job isn't signed yet", risk: "The current project is solid. The next one is a handshake. Your income has no structural buffer between jobs — when one ends, the clock starts.", cta: "Measure my income stability" },
  { key: "media", name: "Media / Entertainment", avg: 28, constraint: "Between projects, income is zero", risk: "Strong projects create strong months. But between them, your income is not low — it is zero. No carry. No residual. Every engagement starts from scratch.", cta: "Run my assessment" },
  { key: "insurance", name: "Insurance", avg: 43, constraint: "New business masks renewal erosion", risk: "Strong production quarters feel like growth. But if renewals are quietly slipping underneath, your structure is compounding backwards — and you won't see it until new business slows.", cta: "Stress-test my income" },
  { key: "legal", name: "Legal Services", avg: 40, constraint: "Three matters carry the practice", risk: "Count your top three matters. They likely carry 60-70% of your billings. When one concludes, the gap doesn't build gradually — it arrives all at once.", cta: "Measure my income stability" },
  { key: "technology", name: "Technology", avg: 42, constraint: "One employer, one system, one decision", risk: "Your compensation feels stable because the system around it is stable. But it's one layoff, one reorg, one equity reset away from a total structural shift — and you have no second source.", cta: "Measure my income stability" },
  { key: "finance", name: "Finance / Banking", avg: 44, constraint: "The variable component is the one that matters", risk: "Base salary creates a floor. But the bonus, the production credit, the performance component — that's where the real earnings live. And that's the part that can vanish in one cycle.", cta: "Stress-test my income" },
  { key: "healthcare", name: "Healthcare", avg: 46, constraint: "One system, no alternatives", risk: "Steady pay from one institution feels safe until the institution restructures. When your sole employer changes compensation models, hours, or staffing — you have no structural alternative.", cta: "Measure my income stability" },
  { key: "fitness", name: "Fitness / Wellness", avg: 30, constraint: "Clients cancel. Revenue disappears the same day.", risk: "Your income is a collection of individual decisions that can reverse without notice. One slow month, one seasonal dip, one competitor opens nearby — and the calendar empties faster than you can fill it.", cta: "Run my assessment" },
];


/* ================================================================== */
/* SECTION 1 — HERO (clean: headline + CTA + pulsing ring)             */
/* ================================================================== */

function HeroSection() {
  const { ref, visible } = useInView();
  const m = useMobile();
  const fadeIn = useFadeIn();

  return (
    <header ref={ref} style={{ backgroundColor: C.white, position: "relative", overflow: "hidden" }}>
      <style>{`
        @keyframes ringDraw { from { stroke-dashoffset: 745; } to { stroke-dashoffset: 538; } }
        @keyframes fadeSlideIn { from { opacity: 0; transform: translateY(16px); } to { opacity: 1; transform: translateY(0); } }
      `}</style>

      <div style={{ maxWidth: contentW, margin: "0 auto", paddingTop: m ? 40 : 72, paddingBottom: m ? 40 : 64, paddingLeft: px(m), paddingRight: px(m), position: "relative", zIndex: 1 }}>
        <div style={{ display: m ? "block" : "flex", alignItems: "center", justifyContent: "space-between", gap: 64 }}>
          {/* Left — headline */}
          <div style={{ maxWidth: 520, textAlign: m ? "center" : "left", marginBottom: m ? 44 : 0 }}>
            <h1 style={{ fontSize: m ? 36 : 56, fontWeight: 700, lineHeight: 1.06, letterSpacing: "-0.035em", color: C.navy, marginBottom: 32, ...fadeIn(visible) }}>
              Your income has a structure.{m ? " " : <br />}You've never seen it.
            </h1>
            <p style={{ fontSize: m ? 16 : 18, color: muted, lineHeight: 1.7, marginBottom: 40, ...fadeIn(visible, 100) }}>
              RunPayway&#8482; measures how your income holds under pressure — not how much you make.
            </p>
            <div style={{ ...fadeIn(visible, 200) }}>
              <CtaButton m={m} variant="dark" />
            </div>
          </div>

          {/* Right — score preview card */}
          <div style={{ flexShrink: 0, width: m ? "100%" : 340, ...fadeIn(visible, 300) }}>
            <div style={{ backgroundColor: C.navy, borderRadius: 20, padding: m ? "28px 24px" : "32px 28px", position: "relative", overflow: "hidden" }}>
              {/* Subtle glow */}
              <div style={{ position: "absolute", top: "-30%", right: "-20%", width: 200, height: 200, borderRadius: "50%", background: `radial-gradient(circle, ${C.purple}12 0%, transparent 70%)`, pointerEvents: "none" }} />

              {/* Logo */}
              <div style={{ marginBottom: 16, position: "relative", zIndex: 1 }}>
                <Image src={logoWhite} alt="RunPayway" height={18} style={{ opacity: 0.5 }} />
              </div>

              {/* Score ring + number */}
              <div style={{ display: "flex", alignItems: "center", gap: 20, marginBottom: 20, position: "relative", zIndex: 1 }}>
                <div style={{ position: "relative", width: 80, height: 80, flexShrink: 0 }}>
                  <svg width={80} height={80} style={{ transform: "rotate(-90deg)" }}>
                    <circle cx={40} cy={40} r={34} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth={6} />
                    <circle cx={40} cy={40} r={34} fill="none" stroke="#2B5EA7" strokeWidth={6}
                      strokeDasharray={2 * Math.PI * 34} strokeDashoffset={2 * Math.PI * 34 * (1 - 0.72)}
                      strokeLinecap="round"
                      style={{ animation: visible ? "ringDraw 1.5s cubic-bezier(0.22, 1, 0.36, 1) forwards" : "none", filter: "drop-shadow(0 0 4px rgba(43,94,167,0.30))" }} />
                  </svg>
                  <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <span style={{ fontSize: 24, fontWeight: 300, fontFamily: mono, color: C.sand, lineHeight: 1 }}>72</span>
                  </div>
                </div>
                <div>
                  <div style={{ display: "inline-flex", alignItems: "center", gap: 5, padding: "3px 10px", borderRadius: 100, backgroundColor: "rgba(43,94,167,0.12)", marginBottom: 6 }}>
                    <div style={{ width: 5, height: 5, borderRadius: 2, backgroundColor: "#2B5EA7" }} />
                    <span style={{ fontSize: 11, fontWeight: 600, color: "#2B5EA7" }}>Established</span>
                  </div>
                  <div style={{ fontSize: 13, color: "rgba(244,241,234,0.45)" }}>3 pts to High Stability</div>
                </div>
              </div>

              {/* Mini metrics */}
              <div style={{ display: "flex", gap: 0, borderRadius: 8, overflow: "hidden", border: "1px solid rgba(255,255,255,0.06)", marginBottom: 16, position: "relative", zIndex: 1 }}>
                {[
                  { label: "INCOME BUFFER", value: "4.2 mo", color: C.teal },
                  { label: "IF TOP CLIENT LEAVES", value: "\u221218", color: "#E57373" },
                  { label: "STABILITY TYPE", value: "Uneven", color: "#D4A843" },
                ].map((metric, i, arr) => (
                  <div key={i} style={{ flex: 1, padding: "8px 0", textAlign: "center", borderRight: i < arr.length - 1 ? "1px solid rgba(255,255,255,0.06)" : "none", backgroundColor: "rgba(255,255,255,0.02)" }}>
                    <div style={{ fontSize: 9, fontWeight: 600, letterSpacing: "0.08em", color: "rgba(244,241,234,0.35)", marginBottom: 3 }}>{metric.label}</div>
                    <div style={{ fontSize: 13, fontWeight: 600, fontFamily: mono, color: metric.color }}>{metric.value}</div>
                  </div>
                ))}
              </div>

              {/* Constraint hint */}
              <div style={{ padding: "10px 12px", borderRadius: 8, borderLeft: `2px solid #E57373`, backgroundColor: "rgba(255,255,255,0.02)", position: "relative", zIndex: 1 }}>
                <div style={{ fontSize: 9, fontWeight: 700, letterSpacing: "0.06em", color: "#E57373", marginBottom: 3 }}>BIGGEST RISK</div>
                <div style={{ fontSize: 13, color: "rgba(244,241,234,0.55)", lineHeight: 1.4 }}>Too much income from one source — if it stops, most of your earnings stop with it.</div>
              </div>

              {/* Example label */}
              <div style={{ textAlign: "center", marginTop: 14, position: "relative", zIndex: 1 }}>
                <span style={{ fontSize: 11, color: "rgba(244,241,234,0.30)", letterSpacing: "0.04em" }}>Example output &bull; Model RP-2.0</span>
              </div>
            </div>
          </div>
        </div>

        {/* Credibility strip */}
        <div style={{ marginTop: m ? 36 : 56, paddingTop: m ? 20 : 28, borderTop: `1px solid rgba(14,26,43,0.05)`, textAlign: "center", ...fadeIn(visible, 400) }}>
          <p style={{ fontSize: 13, fontWeight: 500, color: light, letterSpacing: "0.02em" }}>
            Free to start &bull; No bank connection &bull; Same answers, same score
          </p>
        </div>
      </div>
    </header>
  );
}


/* ================================================================== */
/* SECTION 2 — INDUSTRY SELECTOR (standalone interactive section)      */
/* ================================================================== */

function IndustrySelector() {
  const { ref, visible } = useInView();
  const m = useMobile();
  const fadeIn = useFadeIn();
  const [selected, setSelected] = useState<typeof INDUSTRIES[0] | null>(null);
  const animatedScore = useAnimatedCounter(selected?.avg || 0, !!selected, 1200);
  const bandColor = (s: number) => s >= 75 ? C.teal : s >= 50 ? "#2B5EA7" : s >= 30 ? "#92640A" : "#9B2C2C";
  const bandLabel = (s: number) => s >= 75 ? "High Stability" : s >= 50 ? "Established" : s >= 30 ? "Developing" : "Limited";

  return (
    <section ref={ref} style={{ backgroundColor: "#F5F4F1", paddingTop: m ? 56 : 96, paddingBottom: m ? 56 : 96, paddingLeft: px(m), paddingRight: px(m) }}>
      <div style={{ maxWidth: contentW, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: m ? 36 : 56, ...fadeIn(visible) }}>
          <div style={{ fontSize: 12, fontWeight: 700, letterSpacing: "0.10em", color: C.teal, marginBottom: 14 }}>EXPLORE</div>
          <h2 style={{ fontSize: m ? 24 : 34, fontWeight: 500, lineHeight: 1.2, letterSpacing: "-0.02em", color: C.navy }}>
            See what income stability looks like in your industry.
          </h2>
        </div>

        {/* Grid */}
        <div style={{ display: "grid", gridTemplateColumns: m ? "repeat(2, 1fr)" : "repeat(4, 1fr)", gap: m ? 8 : 10, maxWidth: 800, margin: "0 auto", ...fadeIn(visible, 100) }}>
          {INDUSTRIES.slice(0, m ? 8 : 12).map(ind => {
            const isActive = selected?.key === ind.key;
            return (
              <button key={ind.key} onClick={() => setSelected(isActive ? null : ind)}
                style={{
                  padding: m ? "12px 10px" : "14px 16px", borderRadius: 10, cursor: "pointer",
                  border: `1px solid ${isActive ? C.teal + "40" : "rgba(14,26,43,0.08)"}`,
                  backgroundColor: isActive ? `${C.teal}08` : C.white,
                  boxShadow: isActive ? `0 0 0 1px ${C.teal}20` : "0 1px 3px rgba(14,26,43,0.03)",
                  transition: "all 200ms", textAlign: "left", minHeight: 44,
                }}
                onMouseEnter={e => { if (!isActive) { e.currentTarget.style.borderColor = "rgba(14,26,43,0.15)"; e.currentTarget.style.boxShadow = elevation.card; } }}
                onMouseLeave={e => { if (!isActive) { e.currentTarget.style.borderColor = "rgba(14,26,43,0.08)"; e.currentTarget.style.boxShadow = "0 1px 3px rgba(14,26,43,0.03)"; } }}
              >
                <span style={{ fontSize: 14, fontWeight: isActive ? 600 : 500, color: isActive ? C.navy : muted }}>{ind.name}</span>
              </button>
            );
          })}
        </div>

        {/* Prompt when nothing selected */}
        {!selected && (
          <div style={{ textAlign: "center", marginTop: m ? 24 : 36, ...fadeIn(visible, 200) }}>
            <p style={{ fontSize: 15, color: light }}>Select your industry to see what's at risk.</p>
          </div>
        )}

        {/* Reveal */}
        {selected && (
          <div style={{ maxWidth: 720, margin: "36px auto 0", padding: m ? "24px 16px" : "28px 36px", borderRadius: 16, backgroundColor: C.navy, boxShadow: "0 8px 40px rgba(14,26,43,0.12)", animation: "fadeSlideIn 400ms ease-out" }}>
            <div style={{ fontSize: 12, fontWeight: 700, letterSpacing: "0.08em", color: "#E57373", marginBottom: 10 }}>{selected.constraint.toUpperCase()}</div>
            <p style={{ fontSize: m ? 16 : 17, color: "rgba(244,241,234,0.70)", lineHeight: 1.65, margin: "0 0 20px" }}>{selected.risk}</p>
            <Link href="/begin" style={{ fontSize: 15, fontWeight: 600, color: C.teal, textDecoration: "none", display: "inline-flex", alignItems: "center", gap: 6, minHeight: 44 }}>
              {selected.cta} — it's free &rarr;
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}


/* ================================================================== */
/* SECTION 3 — SAME INCOME, DIFFERENT STABILITY + self-reflection      */
/* ================================================================== */

function SameIncomeProof() {
  const { ref, visible } = useInView();
  const m = useMobile();
  const fadeIn = useFadeIn();
  return (
    <section ref={ref} style={{ backgroundColor: "#FAFAFA", paddingTop: m ? 56 : 112, paddingBottom: m ? 56 : 112, paddingLeft: px(m), paddingRight: px(m) }}>
      <div style={{ maxWidth: contentW, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: m ? 40 : 64, ...fadeIn(visible) }}>
          <h2 style={{ fontSize: m ? 28 : 44, fontWeight: 700, lineHeight: 1.1, letterSpacing: "-0.02em", color: C.navy }}>Same income. Different structure.{m ? " " : <br />}Completely different risk.</h2>
        </div>
        <div style={{ display: m ? "block" : "grid", gridTemplateColumns: "1fr 1fr", gap: 24, maxWidth: 880, margin: "0 auto", ...fadeIn(visible, 120) }}>
          {/* Person A — fragile */}
          <div style={{ borderRadius: 16, padding: m ? 20 : 32, backgroundColor: C.white, boxShadow: elevation.card, marginBottom: m ? 16 : 0, position: "relative" as const, overflow: "hidden" }}>
            <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 3, backgroundColor: "rgba(155,44,44,0.30)" }} />
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 20 }}>
              <div style={{ fontSize: 15, fontWeight: 600, color: C.navy }}>$150K / year</div>
              <div style={{ fontSize: 13, color: light }}>Freelance Consultant</div>
            </div>
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
          <div style={{ borderRadius: 16, padding: m ? 20 : 32, backgroundColor: C.white, boxShadow: elevation.card, position: "relative" as const, overflow: "hidden" }}>
            <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 3, background: `linear-gradient(90deg, ${C.teal}, ${C.purple})` }} />
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 20 }}>
              <div style={{ fontSize: 15, fontWeight: 600, color: C.navy }}>$150K / year</div>
              <div style={{ fontSize: 13, color: light }}>Freelance Consultant</div>
            </div>
            <PressureBar segments={[
              { pct: 25, color: "#C0392B", label: "At risk" },
              { pct: 35, color: "#D4A843", label: "Recurring" },
              { pct: 40, color: C.teal, label: "Protected" },
            ]} height={16} />
            <p style={{ fontSize: 14, color: muted, lineHeight: 1.6, margin: "16px 0 24px" }}>
              5 clients, none over 30%. 40% recurring. 3 months secured forward. Built to handle disruptions.
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

        {/* Self-reflection prompt */}
        <div style={{ textAlign: "center", marginTop: m ? 48 : 80, ...fadeIn(visible, 220) }}>
          <p style={{ fontSize: m ? 20 : 24, fontWeight: 500, color: C.navy, marginBottom: 8 }}>Which one looks more like yours?</p>
          <p style={{ fontSize: 16, color: light, lineHeight: 1.6 }}>The income is the same. How it's built is not. That's what RunPayway measures.</p>
        </div>
      </div>
    </section>
  );
}


/* ================================================================== */
/* SECTION 3B — WHAT HIGH STABILITY UNLOCKS                            */
/* ================================================================== */

function WhatStabilityUnlocks() {
  const { ref, visible } = useInView();
  const m = useMobile();
  const fadeIn = useFadeIn();
  const unlocks = [
    { icon: "M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0 1 12 2.944a11.955 11.955 0 0 1-8.618 3.04A12.02 12.02 0 0 0 3 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z", title: "Negotiate from strength, not need", desc: "You don't take bad deals because you need the money. You choose the right ones — and walk away from the rest.", color: C.teal },
    { icon: "M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0z", title: "Charge what you're worth", desc: "When your income is stable, there's no desperation pricing. You set your rates and hold firm.", color: C.purple },
    { icon: "M13 7h8m0 0v8m0-8l-8 8-4-4-6 6", title: "Take smart risks", desc: "Launch a new service. Hire someone. Turn down a bad client. Your stable base absorbs the gap while you grow.", color: C.teal },
    { icon: "M19 21V5a2 2 0 0 0-2-2H7a2 2 0 0 0-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v5m-4 0h4", title: "Build something worth more", desc: "A business with stable, diversified income is worth more than one that depends on you showing up every day.", color: C.purple },
  ];
  return (
    <section ref={ref} style={{ backgroundColor: C.white, paddingTop: m ? 56 : 112, paddingBottom: m ? 56 : 112, paddingLeft: px(m), paddingRight: px(m) }}>
      <div style={{ maxWidth: contentW, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: m ? 40 : 64, ...fadeIn(visible) }}>
          <div style={{ fontSize: 12, fontWeight: 700, letterSpacing: "0.10em", color: C.teal, marginBottom: 14 }}>WHEN YOU KNOW YOUR NUMBER</div>
          <h2 style={{ fontSize: m ? 28 : 44, fontWeight: 700, lineHeight: 1.1, letterSpacing: "-0.02em", color: C.navy, marginBottom: 16 }}>
            Once you see how your income is built,{m ? " " : <br />}you start making different decisions.
          </h2>
          <p style={{ fontSize: m ? 16 : 17, color: muted, lineHeight: 1.65, maxWidth: 540, margin: "0 auto" }}>
            The insight changes how you approach everything — not because anyone requires it, but because now you know.
          </p>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: m ? "1fr" : "1fr 1fr", gap: m ? 12 : 16, maxWidth: 760, margin: "0 auto", ...fadeIn(visible, 120) }}>
          {unlocks.map((u, i) => (
            <div key={i} style={{ padding: m ? 20 : 28, borderRadius: 16, backgroundColor: C.white, boxShadow: elevation.card, position: "relative" as const, overflow: "hidden" }}>
              <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 3, backgroundColor: `${u.color}30` }} />
              <div style={{ width: 40, height: 40, borderRadius: 10, backgroundColor: `${u.color}08`, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 14 }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={u.color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d={u.icon} /></svg>
              </div>
              <div style={{ fontSize: 16, fontWeight: 600, color: C.navy, marginBottom: 6, lineHeight: 1.3 }}>{u.title}</div>
              <p style={{ fontSize: 14, color: muted, margin: 0, lineHeight: 1.6 }}>{u.desc}</p>
            </div>
          ))}
        </div>

        <div style={{ textAlign: "center", marginTop: m ? 36 : 56, ...fadeIn(visible, 220) }}>
          <p style={{ fontSize: m ? 16 : 18, color: light, lineHeight: 1.6 }}>This isn't about earning more. It's about <strong style={{ color: C.navy }}>knowing what you're working with</strong> before you make your next move.</p>
        </div>
      </div>
    </section>
  );
}


/* ================================================================== */
/* SECTION 3C — THE MISSING LAYER                                      */
/* ================================================================== */

function TheMissingLayer() {
  const { ref, visible } = useInView();
  const m = useMobile();
  const fadeIn = useFadeIn();

  const layers = [
    {
      label: "FINANCIAL ADVISORY",
      title: "Looks at what you've saved",
      desc: "Financial planning focuses on your assets and goals — but doesn't ask whether the income funding them will still be there next year.",
      faded: true,
    },
    {
      label: "CREDIT SCORE",
      title: "Looks at what you've borrowed",
      desc: "Credit decisions are based on your past payments — but don't account for whether your income can keep supporting them.",
      faded: true,
    },
    {
      label: "RUNPAYWAY&#8482;",
      title: "Shows you how your income is built",
      desc: "Before you make your next financial decision, see for yourself whether your income is stable, diversified, and built to last.",
      faded: false,
    },
  ];

  return (
    <section ref={ref} style={{ backgroundColor: "#F5F4F1", paddingTop: m ? 64 : 112, paddingBottom: m ? 64 : 112, paddingLeft: px(m), paddingRight: px(m) }}>
      <div style={{ maxWidth: 800, margin: "0 auto" }}>

        <div style={{ textAlign: "center", marginBottom: m ? 40 : 64, ...fadeIn(visible) }}>
          <div style={{ fontSize: 12, fontWeight: 700, letterSpacing: "0.10em", color: C.teal, marginBottom: 14 }}>KNOW BEFORE YOU ACT</div>
          <h2 style={{ fontSize: m ? 28 : 44, fontWeight: 700, lineHeight: 1.1, letterSpacing: "-0.02em", color: C.navy, marginBottom: 16 }}>
            Before you borrow, invest, or plan —{m ? " " : <br />}know how your income is actually built.
          </h2>
          <p style={{ fontSize: m ? 16 : 17, color: muted, lineHeight: 1.65, maxWidth: 520, margin: "0 auto" }}>
            Credit scores look at what you've borrowed. Advisors look at what you've saved. Neither shows you how your income holds up. RunPayway does.
          </p>
        </div>

        {/* Stacked layers — bottom = foundation */}
        <div style={{ display: "flex", flexDirection: "column", gap: 0, maxWidth: 680, margin: "0 auto", ...fadeIn(visible, 120) }}>
          {layers.map((layer, i) => {
            const isFoundation = !layer.faded;
            return (
              <div key={i} style={{
                padding: m ? "20px 18px" : "24px 28px",
                borderRadius: i === 0 ? "16px 16px 0 0" : i === layers.length - 1 ? "0 0 16px 16px" : 0,
                backgroundColor: isFoundation ? `${C.teal}06` : C.white,
                borderLeft: isFoundation ? `3px solid ${C.teal}` : `3px solid rgba(14,26,43,0.06)`,
                borderBottom: i < layers.length - 1 ? `1px solid rgba(14,26,43,0.06)` : "none",
                boxShadow: isFoundation ? elevation.card : "none",
                position: "relative" as const,
                overflow: "hidden" as const,
              }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 16 }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.10em", color: isFoundation ? C.teal : light, marginBottom: 6 }}>{layer.label}</div>
                    <div style={{ fontSize: m ? 16 : 18, fontWeight: 600, color: isFoundation ? C.navy : "rgba(14,26,43,0.40)", marginBottom: 4, lineHeight: 1.3 }}>{layer.title}</div>
                    <p style={{ fontSize: 14, color: isFoundation ? muted : "rgba(14,26,43,0.35)", margin: 0, lineHeight: 1.55 }}>{layer.desc}</p>
                  </div>
                  {isFoundation && (
                    <div style={{ flexShrink: 0, width: 44, height: 44, borderRadius: 12, backgroundColor: `${C.teal}12`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={C.teal} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0 1 12 2.944a11.955 11.955 0 0 1-8.618 3.04A12.02 12.02 0 0 0 3 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Bridge statement */}
        <div style={{ textAlign: "center", marginTop: m ? 28 : 40, marginBottom: m ? 40 : 64, ...fadeIn(visible, 220) }}>
          <p style={{ fontSize: 15, color: light, lineHeight: 1.6 }}>
            The best financial decisions start with knowing what your income can actually <strong style={{ color: C.navy }}>withstand</strong>. That's what RunPayway shows you — before you act.
          </p>
        </div>

        {/* Two-column: how RunPayway strengthens credit + advisory */}
        <div style={{ display: m ? "block" : "grid", gridTemplateColumns: "1fr 1fr", gap: 20, maxWidth: 880, margin: "0 auto", ...fadeIn(visible, 300) }}>

          {/* Before borrowing */}
          <div style={{ padding: m ? 24 : 28, borderRadius: 16, backgroundColor: C.white, boxShadow: elevation.card, position: "relative" as const, overflow: "hidden", marginBottom: m ? 16 : 0 }}>
            <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 3, backgroundColor: `${C.teal}30` }} />
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 18 }}>
              <div style={{ width: 36, height: 36, borderRadius: 10, backgroundColor: `${C.teal}08`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={C.teal} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0 1 12 2.944a11.955 11.955 0 0 1-8.618 3.04A12.02 12.02 0 0 0 3 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
              </div>
              <span style={{ fontSize: 15, fontWeight: 600, color: C.navy }}>Before you borrow</span>
            </div>

            {[
              { text: "Know if you can actually afford it", desc: "If one client leaving would make you miss payments, you need to see that clearly before taking on new debt." },
              { text: "See what your tax return doesn't show", desc: "Your earnings look fine on paper. But is that income diversified? Recurring? Locked in ahead? Now you'll know." },
              { text: "Time it right", desc: "If your income is weak right now, strengthen it first. Apply when you're ready — not when you're hoping for the best." },
            ].map((item, i) => (
              <div key={i} style={{ marginBottom: i < 2 ? 14 : 0 }}>
                <div style={{ fontSize: 14, fontWeight: 600, color: C.navy, marginBottom: 3 }}>{item.text}</div>
                <p style={{ fontSize: 13, color: muted, margin: 0, lineHeight: 1.5 }}>{item.desc}</p>
              </div>
            ))}
            <div style={{ marginTop: 18, paddingTop: 14, borderTop: `1px solid rgba(14,26,43,0.06)` }}>
              <p style={{ fontSize: 13, fontWeight: 500, color: C.teal, margin: 0 }}>Be prepared before you take action — not surprised after.</p>
            </div>
          </div>

          {/* Before financial planning */}
          <div style={{ padding: m ? 24 : 28, borderRadius: 16, backgroundColor: C.white, boxShadow: elevation.card, position: "relative" as const, overflow: "hidden" }}>
            <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 3, backgroundColor: `${C.purple}30` }} />
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 18 }}>
              <div style={{ width: 36, height: 36, borderRadius: 10, backgroundColor: `${C.purple}08`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={C.purple} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2M9 5a2 2 0 0 0 2 2h2a2 2 0 0 0 2-2M9 5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2" /></svg>
              </div>
              <span style={{ fontSize: 15, fontWeight: 600, color: C.navy }}>Before you plan</span>
            </div>

            {[
              { text: "Find your blind spots", desc: "If 80% of your income depends on you showing up every day, any plan built without knowing that has a gap." },
              { text: "Know how much buffer you need", desc: "A stability score of 31 means 6–12 months of reserves. A 75 might need 3. Now you know before you decide." },
              { text: "Understand your real risk capacity", desc: "Your risk tolerance isn't just how you feel — it's how your income is built. Fragile income and aggressive investing don't mix." },
            ].map((item, i) => (
              <div key={i} style={{ marginBottom: i < 2 ? 14 : 0 }}>
                <div style={{ fontSize: 14, fontWeight: 600, color: C.navy, marginBottom: 3 }}>{item.text}</div>
                <p style={{ fontSize: 13, color: muted, margin: 0, lineHeight: 1.5 }}>{item.desc}</p>
              </div>
            ))}
            <div style={{ marginTop: 18, paddingTop: 14, borderTop: `1px solid rgba(14,26,43,0.06)` }}>
              <p style={{ fontSize: 13, fontWeight: 500, color: C.purple, margin: 0 }}>Know yourself before you make the next big financial decision.</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}


/* ================================================================== */
/* SECTION 4 — COMMAND CENTER PREVIEW                                  */
/* ================================================================== */

function CommandCenterPreview() {
  const { ref, visible } = useInView();
  const m = useMobile();
  const fadeIn = useFadeIn();
  return (
    <section ref={ref} style={{ backgroundColor: C.white, paddingTop: m ? 64 : 120, paddingBottom: m ? 64 : 120, paddingLeft: px(m), paddingRight: px(m), position: "relative", overflow: "hidden" }}>
      <div style={{ maxWidth: contentW, margin: "0 auto", position: "relative", zIndex: 1 }}>

        {/* Hero headline */}
        <div style={{ textAlign: "center", marginBottom: m ? 48 : 80, ...fadeIn(visible) }}>
          <div style={{ fontSize: 12, fontWeight: 700, letterSpacing: "0.12em", color: C.teal, marginBottom: 18 }}>WHAT YOU GET</div>
          <h2 style={{ fontSize: m ? 32 : 52, fontWeight: 700, lineHeight: 1.06, letterSpacing: "-0.03em", color: C.navy, marginBottom: 20 }}>
            Your score is the starting point.{m ? " " : <br />}This is what happens next.
          </h2>
          <p style={{ fontSize: m ? 16 : 18, color: muted, lineHeight: 1.65, maxWidth: 520, margin: "0 auto" }}>
            Every tool uses your actual numbers — personalized to your industry, your biggest risk, and your goals.
          </p>
        </div>

        {/* Three preview cards */}
        <div style={{ display: m ? "block" : "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 16, maxWidth: 960, margin: "0 auto", ...fadeIn(visible, 120) }}>

          {/* Card 1 — This Week */}
          <div style={{ backgroundColor: C.navy, borderRadius: 16, padding: m ? 24 : 28, border: "1px solid rgba(255,255,255,0.06)", marginBottom: m ? 16 : 0 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 18 }}>
              <div style={{ width: 28, height: 28, borderRadius: 8, backgroundColor: `${C.teal}15`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke={C.teal} strokeWidth="2" strokeLinecap="round"><path d="M12 8v4l3 3m6-3a9 9 0 1 1-18 0 9 9 0 0 1 18 0z" /></svg>
              </div>
              <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.08em", color: C.teal }}>THIS WEEK</span>
            </div>

            <div style={{ padding: "14px 16px", borderRadius: 10, backgroundColor: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)", marginBottom: 14 }}>
              <div style={{ fontSize: 16, fontWeight: 600, color: C.sand, marginBottom: 4 }}>
                Convert to retainer. <span style={{ fontWeight: 300, fontFamily: mono, color: C.teal }}>Highest impact</span>
              </div>
              <div style={{ fontSize: 13, color: "rgba(244,241,234,0.50)" }}>Your highest-leverage conversation this week.</div>
            </div>

            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
              <span style={{ fontSize: 12, color: "rgba(244,241,234,0.40)" }}>Day 7 &middot; 0/4 steps</span>
              <span style={{ fontSize: 12, fontWeight: 600, color: C.teal }}>Open script &rarr;</span>
            </div>

            <div style={{ paddingTop: 14, borderTop: "1px solid rgba(255,255,255,0.06)" }}>
              <p style={{ fontSize: 13, color: "rgba(244,241,234,0.45)", margin: 0, lineHeight: 1.55 }}>
                Every time you return, it shows the <strong style={{ color: C.sand }}>one thing</strong> that matters most right now.
              </p>
            </div>
          </div>

          {/* Card 2 — Negotiation Playbook */}
          <div style={{ backgroundColor: C.navy, borderRadius: 16, padding: m ? 24 : 28, border: "1px solid rgba(255,255,255,0.06)", marginBottom: m ? 16 : 0 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 18 }}>
              <div style={{ width: 28, height: 28, borderRadius: 8, backgroundColor: `${C.purple}15`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke={C.purple} strokeWidth="2" strokeLinecap="round"><path d="M11 5H6a2 2 0 0 0-2 2v11a2 2 0 0 0 2 2h11a2 2 0 0 0 2-2v-5m-1.414-9.414a2 2 0 1 1 2.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
              </div>
              <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.08em", color: C.purple }}>NEGOTIATION PLAYBOOK</span>
            </div>

            <div style={{ padding: "14px 16px", borderRadius: 10, backgroundColor: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)", marginBottom: 14 }}>
              <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.06em", color: C.purple, marginBottom: 6 }}>WHO TO TALK TO</div>
              <div style={{ fontSize: 13, color: C.sand, marginBottom: 10 }}>Your largest or most active client</div>
              <div style={{ fontSize: 13, color: "rgba(244,241,234,0.50)", lineHeight: 1.55, fontStyle: "italic" }}>
                &ldquo;I wanted to propose something that several of my long-term clients have found valuable — an ongoing advisory retainer...&rdquo;
              </div>
            </div>

            <div style={{ marginBottom: 16 }}>
              <span style={{ fontSize: 11, fontWeight: 600, color: C.teal }}>Ready to copy and send</span>
            </div>

            <div style={{ paddingTop: 14, borderTop: "1px solid rgba(255,255,255,0.06)" }}>
              <p style={{ fontSize: 13, color: "rgba(244,241,234,0.45)", margin: 0, lineHeight: 1.55 }}>
                Scripts with <strong style={{ color: C.sand }}>your actual numbers</strong>, objection handlers, and success signals.
              </p>
            </div>
          </div>

          {/* Card 3 — 12-Week Roadmap */}
          <div style={{ backgroundColor: C.navy, borderRadius: 16, padding: m ? 24 : 28, border: "1px solid rgba(255,255,255,0.06)" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 18 }}>
              <div style={{ width: 28, height: 28, borderRadius: 8, backgroundColor: "rgba(255,255,255,0.06)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke={C.sand} strokeWidth="2" strokeLinecap="round"><path d="M12 8v4l3 3m6-3a9 9 0 1 1-18 0 9 9 0 0 1 18 0z" /></svg>
              </div>
              <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.08em", color: C.sand }}>12-WEEK ROADMAP</span>
            </div>

            <div style={{ position: "relative", paddingLeft: 20, marginBottom: 14 }}>
              <div style={{ position: "absolute", left: 5, top: 0, bottom: 0, width: 2, backgroundColor: "rgba(255,255,255,0.06)" }} />
              {[
                { week: "WK 1–2", action: "Convert to retainer", score: "62" },
                { week: "WK 3–4", action: "Add a new client", score: "70" },
                { week: "WK 5–8", action: "Build passive stream", score: "75" },
              ].map((step, i) => (
                <div key={i} style={{ position: "relative", marginBottom: 12 }}>
                  <div style={{ position: "absolute", left: -16, top: 3, width: 10, height: 10, borderRadius: "50%", backgroundColor: i === 0 ? C.teal : "transparent", border: `2px solid ${i === 0 ? C.teal : "rgba(255,255,255,0.15)"}` }} />
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                    <div>
                      <span style={{ fontSize: 11, color: "rgba(244,241,234,0.40)" }}>{step.week}</span>
                      <div style={{ fontSize: 14, fontWeight: 500, color: C.sand }}>{step.action}</div>
                    </div>
                    <span style={{ fontSize: 14, fontFamily: mono, fontWeight: 600, color: C.teal }}>{step.score}</span>
                  </div>
                </div>
              ))}
            </div>

            <div style={{ padding: "10px 14px", borderRadius: 8, backgroundColor: "rgba(255,255,255,0.03)", border: `1px solid ${C.teal}15` }}>
              <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.06em", color: C.teal, marginBottom: 3 }}>MILESTONE</div>
              <div style={{ fontSize: 13, color: C.sand }}>No single client carries more than half your income</div>
            </div>

            <div style={{ marginTop: 14, paddingTop: 14, borderTop: "1px solid rgba(255,255,255,0.06)" }}>
              <p style={{ fontSize: 13, color: "rgba(244,241,234,0.45)", margin: 0, lineHeight: 1.55 }}>
                Milestones from <strong style={{ color: C.sand }}>your starting numbers</strong>. Not generic advice.
              </p>
            </div>
          </div>
        </div>

        {/* Pricing note */}
        <div style={{ textAlign: "center", marginTop: m ? 36 : 56, ...fadeIn(visible, 220) }}>
          <p style={{ fontSize: 15, color: muted, margin: 0 }}>All included with the $69 diagnostic. Lifetime access. <strong style={{ color: C.teal }}>Full refund if it doesn't reveal something new.</strong></p>
        </div>
      </div>
    </section>
  );
}


/* ================================================================== */
/* SECTION 5 — THE SYSTEM (steps first, then visualization)            */
/*           + FINAL CTA + TRUST (merged, no standalone trust section) */
/* ================================================================== */

function FinalCtaAndTrust() {
  const { ref, visible } = useInView();
  const m = useMobile();
  const fadeIn = useFadeIn();
  return (
    <section ref={ref} style={{ backgroundColor: C.navy, paddingTop: m ? 64 : 112, paddingBottom: m ? 72 : 120, paddingLeft: px(m), paddingRight: px(m), position: "relative", overflow: "hidden" }}>
      <div style={{ position: "absolute", top: "30%", left: "50%", width: m ? 300 : 600, height: m ? 300 : 600, transform: "translate(-50%, -50%)", borderRadius: "50%", background: `radial-gradient(circle, ${C.purple}08 0%, transparent 70%)`, pointerEvents: "none" }} />
      <div style={{ maxWidth: 640, margin: "0 auto", textAlign: "center", position: "relative", zIndex: 1 }}>

        <h2 style={{ fontSize: m ? 26 : 40, fontWeight: 500, lineHeight: 1.12, letterSpacing: "-0.02em", color: C.sand, marginBottom: 20, ...fadeIn(visible) }}>
          Be prepared before your next move.{m ? " " : <br />}Not surprised after.
        </h2>
        <p style={{ fontSize: 17, color: "rgba(244,241,234,0.45)", lineHeight: 1.65, marginBottom: 44, ...fadeIn(visible, 80) }}>
          Under 2 minutes. Free to start. See where your income is strong and where it's exposed.
        </p>
        <div style={{ display: "flex", justifyContent: "center", marginBottom: m ? 48 : 72, ...fadeIn(visible, 160) }}>
          <CtaButton m={m} variant="light" />
        </div>

        {/* Trust signals */}
        <div style={{ display: "grid", gridTemplateColumns: m ? "1fr 1fr" : "1fr 1fr 1fr 1fr", gap: m ? 12 : 16, ...fadeIn(visible, 280) }}>
          {[
            { title: "No bank connection", desc: "We never access your accounts." },
            { title: "No credit pull", desc: "Zero impact on your credit." },
            { title: "Private by default", desc: "Your data is never sold." },
            { title: "Consistent", desc: "Same answers → same score." },
          ].map((t, i) => (
            <div key={i} style={{ textAlign: "center", padding: m ? "14px 8px" : "16px 12px", borderRadius: 10, backgroundColor: "rgba(255,255,255,0.02)" }}>
              <div style={{ fontSize: 13, fontWeight: 600, color: "rgba(244,241,234,0.55)", marginBottom: 2 }}>{t.title}</div>
              <div style={{ fontSize: 12, color: "rgba(244,241,234,0.45)" }}>{t.desc}</div>
            </div>
          ))}
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
  name: "RunPayway™ Income Stability Score™",
  description: "An assessment that measures how stable your income is — not how much you make.",
  brand: { "@type": "Brand", name: "RunPayway™" },
  offers: [
    { "@type": "Offer", price: "0", priceCurrency: "USD", name: "Income Stability Score™", description: "Score, band, primary constraint, and one recommended direction." },
    { "@type": "Offer", price: "69", priceCurrency: "USD", name: "RunPayway™ Diagnostic Report", description: "Full diagnostic with personalized scripts, 12-week roadmap, and income analysis." },
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
        <IndustrySelector />
        <SameIncomeProof />
        <WhatStabilityUnlocks />
        <TheMissingLayer />
        <CommandCenterPreview />
        <FinalCtaAndTrust />
      </main>
      <StickyMobileCta />
    </div>
  );
}
