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
const secPad = (m: boolean) => m ? 56 : 112;
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

/* Animated dimension bar */
function DimensionBar({ label, value, color, visible, delay }: { label: string; value: number; color: string; visible: boolean; delay: number }) {
  return (
    <div style={{ marginBottom: 14 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 5 }}>
        <span style={{ fontSize: 13, fontWeight: 500, color: "rgba(244,241,234,0.55)" }}>{label}</span>
        <span style={{ fontSize: 13, fontWeight: 600, fontFamily: mono, color }}>{value}%</span>
      </div>
      <div style={{ height: 6, borderRadius: 3, backgroundColor: "rgba(255,255,255,0.06)", overflow: "hidden" }}>
        <div style={{ height: "100%", borderRadius: 3, backgroundColor: color, width: visible ? `${value}%` : "0%", transition: `width 1s cubic-bezier(0.22, 1, 0.36, 1) ${delay}ms`, boxShadow: `0 0 8px ${color}30` }} />
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
        Under 2 minutes &bull; Instant result &bull; Private by default
      </p>
    </div>
  );
}


/* ================================================================== */
/* INDUSTRY DATA                                                       */
/* ================================================================== */

const INDUSTRIES = [
  { key: "consulting", name: "Consulting", avg: 38, constraint: "You are the product", risk: "Your clients pay for your time, not a system. If you stop delivering, 85% of your income stops with you. You can't take a month off without the math changing.", cta: "Measure my income stability" },
  { key: "real_estate", name: "Real Estate", avg: 34, constraint: "Pipeline dependency", risk: "One delayed closing or one lost listing can erase a quarter of annual earnings. Your pipeline looks full — but nothing in it is contractually yours until it closes.", cta: "Stress-test my income structure" },
  { key: "sales", name: "Sales / Brokerage", avg: 31, constraint: "Nothing is guaranteed past this quarter", risk: "Last quarter was strong. But your structure doesn't carry that forward. Next quarter starts from zero unless you close again.", cta: "Stress-test my income structure" },
  { key: "creative", name: "Freelance / Creative", avg: 27, constraint: "Every month starts at zero", risk: "No project means no income. No retainer means no floor. You are re-earning your entire livelihood every 30 days, and the pipeline between projects is silence.", cta: "Measure my income stability" },
  { key: "construction", name: "Construction / Trades", avg: 29, constraint: "The next job isn't signed yet", risk: "The current project is solid. The next one is a handshake. Your income has no structural buffer between jobs — when one ends, the clock starts.", cta: "Measure my income stability" },
  { key: "media", name: "Media / Entertainment", avg: 28, constraint: "Between projects, income is zero", risk: "Strong projects create strong months. But between them, your income is not low — it is zero. No carry. No residual. Every engagement starts from scratch.", cta: "Run my structural assessment" },
  { key: "insurance", name: "Insurance", avg: 43, constraint: "New business masks renewal erosion", risk: "Strong production quarters feel like growth. But if renewals are quietly slipping underneath, your structure is compounding backwards — and you won't see it until new business slows.", cta: "Stress-test my income structure" },
  { key: "legal", name: "Legal Services", avg: 40, constraint: "Three matters carry the practice", risk: "Count your top three matters. They likely carry 60-70% of your billings. When one concludes, the gap doesn't build gradually — it arrives all at once.", cta: "Measure my income stability" },
  { key: "technology", name: "Technology", avg: 42, constraint: "One employer, one system, one decision", risk: "Your compensation feels stable because the system around it is stable. But it's one layoff, one reorg, one equity reset away from a total structural shift — and you have no second source.", cta: "Measure my income stability" },
  { key: "finance", name: "Finance / Banking", avg: 44, constraint: "The variable component is the one that matters", risk: "Base salary creates a floor. But the bonus, the production credit, the performance component — that's where the real earnings live. And that's the part that can vanish in one cycle.", cta: "Stress-test my income structure" },
  { key: "healthcare", name: "Healthcare", avg: 46, constraint: "One system, no alternatives", risk: "Steady pay from one institution feels safe until the institution restructures. When your sole employer changes compensation models, hours, or staffing — you have no structural alternative.", cta: "Measure my income stability" },
  { key: "fitness", name: "Fitness / Wellness", avg: 30, constraint: "Clients cancel. Revenue disappears the same day.", risk: "Your income is a collection of individual decisions that can reverse without notice. One slow month, one seasonal dip, one competitor opens nearby — and the calendar empties faster than you can fill it.", cta: "Run my structural assessment" },
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
              Your income has a structure.{m ? " " : <br />}You&#8217;ve never seen it.
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
                  { label: "RUNWAY", value: "4.2 mo", color: C.teal },
                  { label: "RISK", value: "\u221218", color: "#E57373" },
                  { label: "FRAGILITY", value: "Uneven", color: "#D4A843" },
                ].map((metric, i, arr) => (
                  <div key={i} style={{ flex: 1, padding: "8px 0", textAlign: "center", borderRight: i < arr.length - 1 ? "1px solid rgba(255,255,255,0.06)" : "none", backgroundColor: "rgba(255,255,255,0.02)" }}>
                    <div style={{ fontSize: 9, fontWeight: 600, letterSpacing: "0.08em", color: "rgba(244,241,234,0.35)", marginBottom: 3 }}>{metric.label}</div>
                    <div style={{ fontSize: 13, fontWeight: 600, fontFamily: mono, color: metric.color }}>{metric.value}</div>
                  </div>
                ))}
              </div>

              {/* Constraint hint */}
              <div style={{ padding: "10px 12px", borderRadius: 8, borderLeft: `2px solid #E57373`, backgroundColor: "rgba(255,255,255,0.02)", position: "relative", zIndex: 1 }}>
                <div style={{ fontSize: 9, fontWeight: 700, letterSpacing: "0.06em", color: "#E57373", marginBottom: 3 }}>ROOT CONSTRAINT</div>
                <div style={{ fontSize: 13, color: "rgba(244,241,234,0.55)", lineHeight: 1.4 }}>Income concentration — one source carries most of the structure.</div>
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
            Model RP-2.0 &bull; 6 structural dimensions &bull; Deterministic output &bull; No bank connection
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
            See what your industry&#8217;s income structure looks like.
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
            <p style={{ fontSize: 15, color: light, marginBottom: 4 }}>Select an industry above to see its primary structural risk.</p>
            <p style={{ fontSize: 14, color: light }}>Don&#8217;t see yours? The assessment works for <strong style={{ color: C.navy }}>any income structure</strong> — these are examples.</p>
          </div>
        )}

        {/* Reveal */}
        {selected && (
          <div style={{ maxWidth: 720, margin: "36px auto 0", padding: m ? "24px 16px" : "28px 36px", borderRadius: 16, backgroundColor: C.navy, boxShadow: "0 8px 40px rgba(14,26,43,0.12)", animation: "fadeSlideIn 400ms ease-out" }}>
            <div style={{ fontSize: 12, fontWeight: 700, letterSpacing: "0.08em", color: "#E57373", marginBottom: 10 }}>{selected.constraint.toUpperCase()}</div>
            <p style={{ fontSize: m ? 16 : 17, color: "rgba(244,241,234,0.70)", lineHeight: 1.65, margin: "0 0 20px" }}>{selected.risk}</p>
            <Link href="/pricing" style={{ fontSize: 15, fontWeight: 600, color: C.teal, textDecoration: "none", display: "inline-flex", alignItems: "center", gap: 6, minHeight: 44 }}>
              {selected.cta} &rarr;
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

        {/* Self-reflection prompt */}
        <div style={{ textAlign: "center", marginTop: m ? 48 : 80, ...fadeIn(visible, 220) }}>
          <p style={{ fontSize: m ? 20 : 24, fontWeight: 500, color: C.navy, marginBottom: 8 }}>Which structure looks more like yours?</p>
          <p style={{ fontSize: 16, color: light, lineHeight: 1.6 }}>The income is the same. The structure is not. That&#8217;s what RunPayway measures.</p>
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
    <section ref={ref} style={{ backgroundColor: C.white, paddingTop: m ? 56 : 96, paddingBottom: m ? 56 : 96, paddingLeft: px(m), paddingRight: px(m) }}>
      <div style={{ maxWidth: contentW, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: m ? 40 : 64, ...fadeIn(visible) }}>
          <div style={{ fontSize: 12, fontWeight: 700, letterSpacing: "0.10em", color: C.teal, marginBottom: 14 }}>COMMAND CENTER</div>
          <h2 style={{ fontSize: m ? 28 : 44, fontWeight: 700, lineHeight: 1.1, letterSpacing: "-0.02em", color: C.navy, marginBottom: 14 }}>
            Your score is the starting point.{m ? " " : <br />}This is what happens next.
          </h2>
          <p style={{ fontSize: m ? 16 : 17, color: muted, lineHeight: 1.65, maxWidth: 520, margin: "0 auto" }}>
            Every tool runs on your actual structure — personalized to your industry, your constraint, and your numbers.
          </p>
        </div>

        {/* Three preview cards */}
        <div style={{ display: m ? "block" : "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 20, maxWidth: 960, margin: "0 auto", ...fadeIn(visible, 120) }}>

          {/* Card 1 — This Week */}
          <div style={{ backgroundColor: "#FAFAFA", borderRadius: 16, padding: m ? 24 : 28, boxShadow: elevation.card, marginBottom: m ? 16 : 0, position: "relative" as const, overflow: "hidden" }}>
            <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 3, backgroundColor: `${C.teal}25` }} />
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16 }}>
              <div style={{ width: 28, height: 28, borderRadius: 8, backgroundColor: `${C.teal}08`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke={C.teal} strokeWidth="2" strokeLinecap="round"><path d="M12 8v4l3 3m6-3a9 9 0 1 1-18 0 9 9 0 0 1 18 0z" /></svg>
              </div>
              <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.08em", color: C.teal }}>THIS WEEK</span>
            </div>

            {/* Mock priority */}
            <div style={{ padding: "14px 16px", borderRadius: 10, backgroundColor: C.white, border: `1px solid ${C.teal}12`, marginBottom: 14 }}>
              <div style={{ fontSize: 16, fontWeight: 600, color: C.navy, marginBottom: 4 }}>
                Convert to retainer. <span style={{ fontWeight: 300, fontFamily: mono, color: C.teal }}>+11</span>
              </div>
              <div style={{ fontSize: 13, color: muted }}>Your highest-leverage conversation this week.</div>
            </div>

            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ fontSize: 12, color: light }}>Day 7 &middot; 0/4 steps</span>
              <span style={{ fontSize: 12, fontWeight: 600, color: C.teal }}>Open script &rarr;</span>
            </div>

            <div style={{ marginTop: 16, paddingTop: 12, borderTop: `1px solid rgba(14,26,43,0.05)` }}>
              <p style={{ fontSize: 13, color: muted, margin: 0, lineHeight: 1.5 }}>
                Every time you open the Command Center, it tells you the <strong style={{ color: C.navy }}>one thing</strong> that matters most right now.
              </p>
            </div>
          </div>

          {/* Card 2 — Negotiation Playbook */}
          <div style={{ backgroundColor: "#FAFAFA", borderRadius: 16, padding: m ? 24 : 28, boxShadow: elevation.card, marginBottom: m ? 16 : 0, position: "relative" as const, overflow: "hidden" }}>
            <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 3, backgroundColor: `${C.purple}25` }} />
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16 }}>
              <div style={{ width: 28, height: 28, borderRadius: 8, backgroundColor: `${C.purple}08`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke={C.purple} strokeWidth="2" strokeLinecap="round"><path d="M11 5H6a2 2 0 0 0-2 2v11a2 2 0 0 0 2 2h11a2 2 0 0 0 2-2v-5m-1.414-9.414a2 2 0 1 1 2.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
              </div>
              <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.08em", color: C.purple }}>NEGOTIATION PLAYBOOK</span>
            </div>

            {/* Mock script snippet */}
            <div style={{ padding: "14px 16px", borderRadius: 10, backgroundColor: C.white, border: `1px solid rgba(14,26,43,0.06)`, marginBottom: 12 }}>
              <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.06em", color: C.purple, marginBottom: 6 }}>WHO TO TALK TO</div>
              <div style={{ fontSize: 13, color: C.navy, marginBottom: 10 }}>Your largest or most active client</div>
              <div style={{ fontSize: 13, color: muted, lineHeight: 1.55, fontStyle: "italic" }}>
                &ldquo;I wanted to propose something that several of my long-term clients have found valuable — an ongoing advisory retainer...&rdquo;
              </div>
            </div>

            <div style={{ display: "flex", gap: 8 }}>
              <span style={{ fontSize: 11, fontWeight: 600, color: C.teal, padding: "3px 8px", borderRadius: 6, backgroundColor: `${C.teal}06` }}>+11 pts</span>
              <span style={{ fontSize: 11, fontWeight: 600, color: light, padding: "3px 8px", borderRadius: 6, backgroundColor: "#F0F0F0" }}>Copy to clipboard</span>
            </div>

            <div style={{ marginTop: 14, paddingTop: 12, borderTop: `1px solid rgba(14,26,43,0.05)` }}>
              <p style={{ fontSize: 13, color: muted, margin: 0, lineHeight: 1.5 }}>
                Word-for-word scripts with <strong style={{ color: C.navy }}>your actual numbers</strong>, objection handlers, and success signals.
              </p>
            </div>
          </div>

          {/* Card 3 — 12-Week Roadmap */}
          <div style={{ backgroundColor: "#FAFAFA", borderRadius: 16, padding: m ? 24 : 28, boxShadow: elevation.card, position: "relative" as const, overflow: "hidden" }}>
            <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 3, backgroundColor: `${C.navy}20` }} />
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16 }}>
              <div style={{ width: 28, height: 28, borderRadius: 8, backgroundColor: `${C.navy}06`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke={C.navy} strokeWidth="2" strokeLinecap="round"><path d="M12 8v4l3 3m6-3a9 9 0 1 1-18 0 9 9 0 0 1 18 0z" /></svg>
              </div>
              <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.08em", color: C.navy }}>12-WEEK ROADMAP</span>
            </div>

            {/* Mock milestone */}
            <div style={{ position: "relative", paddingLeft: 20, marginBottom: 14 }}>
              <div style={{ position: "absolute", left: 5, top: 0, bottom: 0, width: 2, backgroundColor: "rgba(14,26,43,0.06)" }} />
              {[
                { week: "WK 1\u20132", action: "Convert to retainer", score: "62" },
                { week: "WK 3\u20134", action: "Add a new client", score: "70" },
                { week: "WK 5\u20138", action: "Build passive stream", score: "75" },
              ].map((step, i) => (
                <div key={i} style={{ position: "relative", marginBottom: 10 }}>
                  <div style={{ position: "absolute", left: -16, top: 3, width: 10, height: 10, borderRadius: "50%", backgroundColor: i === 0 ? C.teal : "#FAFAFA", border: `2px solid ${i === 0 ? C.teal : "rgba(14,26,43,0.12)"}` }} />
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                    <div>
                      <span style={{ fontSize: 11, color: light }}>{step.week}</span>
                      <div style={{ fontSize: 13, fontWeight: 500, color: C.navy }}>{step.action}</div>
                    </div>
                    <span style={{ fontSize: 13, fontFamily: mono, fontWeight: 600, color: C.teal }}>{step.score}</span>
                  </div>
                </div>
              ))}
            </div>

            <div style={{ padding: "10px 12px", borderRadius: 8, backgroundColor: C.white, border: `1px solid ${C.teal}10` }}>
              <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.06em", color: C.teal, marginBottom: 2 }}>MILESTONE</div>
              <div style={{ fontSize: 12, color: C.navy }}>Concentration drops from 72% to below 57%</div>
            </div>

            <div style={{ marginTop: 14, paddingTop: 12, borderTop: `1px solid rgba(14,26,43,0.05)` }}>
              <p style={{ fontSize: 13, color: muted, margin: 0, lineHeight: 1.5 }}>
                Dynamic milestones calculated from <strong style={{ color: C.navy }}>your starting numbers</strong>. Not generic advice.
              </p>
            </div>
          </div>
        </div>

        {/* Bottom line */}
        <div style={{ textAlign: "center", marginTop: m ? 32 : 48, ...fadeIn(visible, 220) }}>
          <p style={{ fontSize: m ? 16 : 18, fontWeight: 500, color: C.navy, marginBottom: 6 }}>All included with the $69 diagnostic.</p>
          <p style={{ fontSize: 15, color: light }}>Lifetime access. Updates every time you come back.</p>
        </div>
      </div>
    </section>
  );
}


/* ================================================================== */
/* SECTION 5 — THE SYSTEM (steps first, then visualization)            */
/*           + FINAL CTA + TRUST (merged, no standalone trust section) */
/* ================================================================== */

function TheSystemAndCta() {
  const { ref, visible } = useInView();
  const m = useMobile();
  const fadeIn = useFadeIn();
  return (
    <section ref={ref} style={{ backgroundColor: C.navy, paddingTop: m ? 64 : 120, paddingBottom: m ? 72 : 120, paddingLeft: px(m), paddingRight: px(m), position: "relative", overflow: "hidden" }}>
      <div style={{ position: "absolute", top: "30%", left: "50%", width: m ? 300 : 600, height: m ? 300 : 600, transform: "translate(-50%, -50%)", borderRadius: "50%", background: `radial-gradient(circle, ${C.purple}08 0%, transparent 70%)`, pointerEvents: "none" }} />
      <div style={{ maxWidth: 880, margin: "0 auto", position: "relative", zIndex: 1 }}>

        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: m ? 48 : 72, ...fadeIn(visible) }}>
          <div style={{ fontSize: 12, fontWeight: 700, letterSpacing: "0.10em", color: C.teal, marginBottom: 16 }}>THE SYSTEM</div>
          <h2 style={{ fontSize: m ? 28 : 44, fontWeight: 500, lineHeight: 1.12, letterSpacing: "-0.02em", color: C.sand, marginBottom: 20 }}>
            Not a budget. Not a forecast.{m ? " " : <br />}A structural measurement.
          </h2>
          <p style={{ fontSize: 17, color: "rgba(244,241,234,0.50)", lineHeight: 1.7, maxWidth: 560, margin: "0 auto" }}>
            RunPayway™ evaluates 6 fixed structural dimensions of your income. A deterministic model. Same inputs always produce the same score.
          </p>
        </div>

        {/* Steps first (context), then visualization (proof) */}
        <div style={{ display: m ? "block" : "flex", gap: 40, marginBottom: m ? 56 : 88, ...fadeIn(visible, 100) }}>
          {/* Left — 3 steps (context comes first) */}
          <div style={{ flex: 1, display: "flex", flexDirection: "column" as const, gap: 16, marginBottom: m ? 24 : 0 }}>
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
          {/* Right — animated 6 dimensions (proof) */}
          <div style={{ flex: 1, padding: m ? "24px 16px" : "28px 24px", borderRadius: 14, backgroundColor: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)" }}>
            <div style={{ fontSize: 12, fontWeight: 700, letterSpacing: "0.08em", color: C.teal, marginBottom: 20 }}>6 STRUCTURAL DIMENSIONS</div>
            <DimensionBar label="Income Persistence" value={45} color={C.teal} visible={visible} delay={300} />
            <DimensionBar label="Source Concentration" value={72} color="#D4A843" visible={visible} delay={450} />
            <DimensionBar label="Source Diversity" value={33} color="#E57373" visible={visible} delay={600} />
            <DimensionBar label="Forward Visibility" value={28} color="#E57373" visible={visible} delay={750} />
            <DimensionBar label="Income Variability" value={55} color={C.teal} visible={visible} delay={900} />
            <DimensionBar label="Labor Dependence" value={85} color="#E57373" visible={visible} delay={1050} />
            <div style={{ marginTop: 16, paddingTop: 14, borderTop: "1px solid rgba(255,255,255,0.06)", display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
              <span style={{ fontSize: 12, color: "rgba(244,241,234,0.50)" }}>Composite score</span>
              <span style={{ fontSize: 24, fontWeight: 300, fontFamily: mono, color: C.sand }}>{visible ? "42" : "\u2014"}</span>
            </div>
          </div>
        </div>

        {/* What you get */}
        <div style={{ marginBottom: m ? 64 : 104, ...fadeIn(visible, 200) }}>
          <div style={{ fontSize: 12, fontWeight: 700, letterSpacing: "0.10em", color: C.teal, textAlign: "center", marginBottom: 20 }}>INCLUDED WITH YOUR DIAGNOSTIC</div>
          <div style={{ display: "grid", gridTemplateColumns: m ? "1fr" : "1fr 1fr", gap: 12 }}>
            {[
              { title: "Negotiation Playbook", desc: "Word-for-word scripts with your data, objection handlers, and success signals." },
              { title: "12-Week Roadmap", desc: "Visual timeline with dynamic milestones from your actual numbers." },
              { title: "PressureMap\u2122", desc: "Your income broken into three zones — what stops, what recurs, what is protected." },
              { title: "What-If Simulator", desc: "Model changes before you commit. See the exact score impact." },
            ].map((t, i) => (
              <div key={i} style={{ padding: m ? "16px 14px" : "18px 20px", borderRadius: 10, border: "1px solid rgba(255,255,255,0.06)", backgroundColor: "rgba(255,255,255,0.02)" }}>
                <div style={{ fontSize: 15, fontWeight: 600, color: C.sand, marginBottom: 4 }}>{t.title}</div>
                <p style={{ fontSize: 14, color: "rgba(244,241,234,0.45)", margin: 0, lineHeight: 1.55 }}>{t.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* ── FINAL CTA ── */}
        <div style={{ maxWidth: 640, margin: "0 auto", textAlign: "center", ...fadeIn(visible, 300) }}>
          <div style={{ width: 56, height: 1, background: `linear-gradient(90deg, transparent, ${C.teal}30, transparent)`, margin: "0 auto 48px" }} />
          <h2 style={{ fontSize: m ? 26 : 40, fontWeight: 500, lineHeight: 1.12, letterSpacing: "-0.02em", color: C.sand, marginBottom: 20 }}>
            Your income is already being tested.{m ? " " : <br />}Now you can see how it holds.
          </h2>
          <p style={{ fontSize: 17, color: "rgba(244,241,234,0.45)", lineHeight: 1.65, marginBottom: 44 }}>
            Start with the free score. Unlock the full diagnostic when you&#8217;re ready to act.
          </p>
          <div style={{ display: "flex", justifyContent: "center", marginBottom: m ? 48 : 72 }}>
            <CtaButton m={m} variant="light" />
          </div>

          {/* Trust signals — woven into CTA area */}
          <div style={{ display: "grid", gridTemplateColumns: m ? "1fr 1fr" : "1fr 1fr 1fr 1fr", gap: m ? 12 : 16 }}>
            {[
              { title: "No bank connection", desc: "We never access your accounts." },
              { title: "No credit pull", desc: "Zero impact on your credit." },
              { title: "Private by default", desc: "Your data is never sold." },
              { title: "Deterministic", desc: "Same inputs \u2192 same score." },
            ].map((t, i) => (
              <div key={i} style={{ textAlign: "center", padding: m ? "14px 8px" : "16px 12px", borderRadius: 10, backgroundColor: "rgba(255,255,255,0.02)" }}>
                <div style={{ fontSize: 13, fontWeight: 600, color: "rgba(244,241,234,0.55)", marginBottom: 2 }}>{t.title}</div>
                <div style={{ fontSize: 12, color: "rgba(244,241,234,0.45)" }}>{t.desc}</div>
              </div>
            ))}
          </div>
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
  description: "A structural assessment that measures how stable your income structure is \u2014 not how much you make.",
  brand: { "@type": "Brand", name: "RunPayway™" },
  offers: [
    { "@type": "Offer", price: "0", priceCurrency: "USD", name: "Income Stability Score™", description: "Score, band, primary constraint, and one recommended direction." },
    { "@type": "Offer", price: "69", priceCurrency: "USD", name: "RunPayway™ Diagnostic Report", description: "Full diagnostic with PressureMap™, Command Center, scripts, and 12-week roadmap." },
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
        <CommandCenterPreview />
        <TheSystemAndCta />
      </main>
      <StickyMobileCta />
    </div>
  );
}
