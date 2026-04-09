"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";

/* ================================================================ */
/* UTILITIES                                                         */
/* ================================================================ */

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

function useReducedMotion() {
  const [r, setR] = useState(false);
  useEffect(() => { setR(window.matchMedia("(prefers-reduced-motion: reduce)").matches); }, []);
  return r;
}

function useFadeIn() {
  const reduced = useReducedMotion();
  return (visible: boolean, delay = 0): React.CSSProperties =>
    reduced ? {} : {
      opacity: visible ? 1 : 0,
      transform: visible ? "translateY(0)" : "translateY(16px)",
      transition: `opacity 600ms cubic-bezier(0.22,1,0.36,1) ${delay}ms, transform 600ms cubic-bezier(0.22,1,0.36,1) ${delay}ms`,
    };
}


/* ================================================================ */
/* DESIGN SYSTEM                                                     */
/* ================================================================ */

const C = {
  navy: "#0E1A2B",
  purple: "#4B3FAE",
  teal: "#1F6D7A",
  sand: "#F4F1EA",
  white: "#FFFFFF",
  panelFill: "#F8F6F1",
  textPrimary: "#131A22",
  textSecondary: "#5E6873",
  textMuted: "#7B848E",
  borderSoft: "#D9D6CF",
  risk: "#C74634",
  moderate: "#D0A23A",
  established: "#1F6D7A",
  protected: "#2A6E49",
  sandText: "#F4F1EA",
  sandMuted: "rgba(244,241,234,0.55)",
  sandLight: "rgba(244,241,234,0.40)",
};

const mono = '"SF Mono", "Fira Code", "IBM Plex Mono", "Courier New", monospace';

const innerW = 1120;
const narrowW = 720;
const explanatoryW = 640;
const sectionPx = (m: boolean) => m ? 24 : 48;
const cardShadow = "0 10px 30px rgba(14,26,43,0.06)";
const ctaShadow = "0 8px 24px rgba(14,26,43,0.12)";


/* ================================================================ */
/* SHARED COMPONENTS                                                 */
/* ================================================================ */

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

function CtaButton({ m, variant = "primary", label }: { m: boolean; variant?: "primary" | "light"; label?: string }) {
  const isPrimary = variant === "primary";
  const text = label || "Get Your Structural Income Report";
  return (
    <Link href="/begin" style={{
      display: "inline-flex", alignItems: "center", justifyContent: "center",
      height: m ? 56 : 60, width: m ? "100%" : "auto",
      padding: m ? "0 28px" : "0 32px",
      borderRadius: 16,
      backgroundColor: isPrimary ? C.navy : C.white,
      color: isPrimary ? C.white : C.navy,
      fontSize: 16, fontWeight: 600, textDecoration: "none",
      boxShadow: isPrimary ? ctaShadow : "0 8px 24px rgba(14,26,43,0.08)",
      border: isPrimary ? "none" : `1px solid ${C.borderSoft}`,
      transition: "transform 200ms, box-shadow 200ms",
    }}
      onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = isPrimary ? "0 12px 32px rgba(14,26,43,0.18)" : "0 12px 32px rgba(14,26,43,0.12)"; }}
      onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = isPrimary ? ctaShadow : "0 8px 24px rgba(14,26,43,0.08)"; }}>
      {text}
    </Link>
  );
}

function CtaMicrocopy({ variant = "dark" }: { variant?: "dark" | "light" }) {
  return (
    <p style={{
      fontSize: 14, fontWeight: 500, lineHeight: 1.45,
      color: variant === "light" ? C.sandLight : C.textMuted,
      marginTop: 16, textAlign: "center",
    }}>
      Takes under 2 minutes. No financial accounts required. Private by default.
    </p>
  );
}


/* ================================================================ */
/* INDUSTRY DATA                                                     */
/* ================================================================ */

const INDUSTRIES = [
  { key: "consulting", name: "Consulting", constraint: "You are the product", desc: "Your clients pay for your time, not a system. If you stop delivering, 85% of your income stops with you.", median: 38, risk: "Labor dependence", atRisk: 78, recurring: 12, protected: 10 },
  { key: "real_estate", name: "Real Estate", constraint: "Pipeline dependency", desc: "One delayed closing or one lost listing can erase a quarter of annual earnings. Nothing is contractually yours until it closes.", median: 29, risk: "Forward visibility", atRisk: 82, recurring: 8, protected: 10 },
  { key: "sales", name: "Sales / Brokerage", constraint: "Nothing carries forward", desc: "Last quarter was strong. But your structure doesn't carry that forward. Next quarter starts from zero unless you close again.", median: 31, risk: "Income persistence", atRisk: 80, recurring: 10, protected: 10 },
  { key: "creative", name: "Freelance / Creative", constraint: "Every month starts at zero", desc: "No project means no income. No retainer means no floor. You are re-earning your entire livelihood every 30 days.", median: 27, risk: "Concentration", atRisk: 85, recurring: 8, protected: 7 },
  { key: "construction", name: "Construction / Trades", constraint: "The next job isn't signed yet", desc: "The current project is solid. The next one is a handshake. Your income has no structural buffer between jobs.", median: 33, risk: "Forward visibility", atRisk: 75, recurring: 15, protected: 10 },
  { key: "media", name: "Media / Entertainment", constraint: "Between projects, income is zero", desc: "Strong projects create strong months. But between them, your income is not low — it is zero. No carry. No residual.", median: 25, risk: "Continuity gap", atRisk: 88, recurring: 5, protected: 7 },
  { key: "insurance", name: "Insurance", constraint: "New business masks renewal erosion", desc: "Strong production quarters feel like growth. But if renewals are slipping underneath, your structure is compounding backwards.", median: 44, risk: "Concentration", atRisk: 55, recurring: 30, protected: 15 },
  { key: "legal", name: "Legal Services", constraint: "Three matters carry the practice", desc: "Count your top three matters. They likely carry 60–70% of your billings. When one concludes, the gap arrives all at once.", median: 41, risk: "Concentration", atRisk: 62, recurring: 22, protected: 16 },
  { key: "technology", name: "Technology", constraint: "One employer, one system, one decision", desc: "Your compensation feels stable because the system around it is stable. But it's one layoff away from a total structural shift.", median: 48, risk: "Source diversity", atRisk: 50, recurring: 35, protected: 15 },
  { key: "finance", name: "Finance / Banking", constraint: "The variable component is the one that matters", desc: "Base salary creates a floor. But the bonus, the production credit — that's where real earnings live. And that part can vanish in one cycle.", median: 46, risk: "Variability", atRisk: 52, recurring: 30, protected: 18 },
  { key: "healthcare", name: "Healthcare", constraint: "One system, no alternatives", desc: "Steady pay from one institution feels safe until the institution restructures. When your sole employer changes models, you have no alternative.", median: 52, risk: "Source diversity", atRisk: 45, recurring: 40, protected: 15 },
  { key: "fitness", name: "Fitness / Wellness", constraint: "Clients cancel. Revenue disappears the same day.", desc: "Your income is a collection of individual decisions that can reverse without notice. One slow month and the calendar empties.", median: 26, risk: "Persistence", atRisk: 84, recurring: 10, protected: 6 },
];


/* ================================================================ */
/* SECTION 1+2 — HERO (includes trust strip)                         */
/* ================================================================ */

function HeroSection() {
  const { ref, visible } = useInView();
  const m = useMobile();
  const fadeIn = useFadeIn();

  return (
    <header ref={ref} style={{ backgroundColor: C.sand }}>
      <style>{`
        @keyframes ringDraw { from { stroke-dashoffset: 745; } to { stroke-dashoffset: 538; } }
      `}</style>

      {/* Trust strip */}
      <div style={{ maxWidth: innerW, margin: "0 auto", paddingTop: m ? 72 : 88, paddingLeft: sectionPx(m), paddingRight: sectionPx(m) }}>
        <div style={{ padding: "10px 0 14px", borderBottom: `1px solid rgba(14,26,43,0.06)`, display: "flex", flexWrap: "wrap" as const, justifyContent: "center", gap: m ? 8 : 32 }}>
          {(m
            ? ["Private by default", "No credit pull"]
            : ["Private by default", "No financial accounts required", "No credit pull"]
          ).map((item, i) => (
            <span key={i} style={{ fontSize: 13, fontWeight: 600, color: C.textSecondary, whiteSpace: "nowrap" }}>{item}</span>
          ))}
        </div>
      </div>

      {/* Hero content */}
      <div style={{ maxWidth: innerW, margin: "0 auto", paddingTop: m ? 32 : 56, paddingBottom: m ? 56 : 88, paddingLeft: sectionPx(m), paddingRight: sectionPx(m), textAlign: "center" }}>

        <h1 style={{ fontSize: m ? 36 : 64, fontWeight: 700, lineHeight: 1.05, letterSpacing: "-0.035em", color: C.navy, maxWidth: 860, margin: "0 auto 28px", ...fadeIn(visible, 50) }}>
          Structural Income. Measured.
        </h1>

        <p style={{ fontSize: m ? 18 : 28, fontWeight: 400, lineHeight: 1.5, color: C.textSecondary, maxWidth: 760, margin: "0 auto 48px", ...fadeIn(visible, 100) }}>
          This is how your income behaves under real conditions.
        </p>

        <p style={{ fontSize: m ? 16 : 18, fontWeight: 400, lineHeight: 1.6, color: C.textSecondary, maxWidth: 680, margin: "0 auto 32px", ...fadeIn(visible, 120) }}>
          RunPayway defines income stability through a deterministic, fixed system. Know how your income holds up under disruption, and whether it&rsquo;s built to last.
        </p>

        <div style={{ display: "flex", flexDirection: "column" as const, alignItems: "center", maxWidth: 560, margin: "0 auto", ...fadeIn(visible, 150) }}>
          <CtaButton m={m} variant="primary" />
          <p style={{ fontSize: 14, fontWeight: 500, lineHeight: 1.45, color: C.textMuted, marginTop: 16, textAlign: "center" }}>
            Takes under 2 minutes | Instant result | Private by default
          </p>
        </div>

        {/* Product preview */}
        <div style={{ maxWidth: 980, margin: "56px auto 0", ...fadeIn(visible, 250) }}>
          <div style={{ backgroundColor: C.navy, borderRadius: 28, padding: m ? 28 : 40, position: "relative", overflow: "hidden" }}>
            <div style={{ display: m ? "block" : "flex", alignItems: "flex-start", gap: 32, position: "relative", zIndex: 1 }}>

              {/* Score module — enhanced */}
              <div style={{ display: "flex", alignItems: "center", gap: 20, marginBottom: m ? 24 : 0, flexShrink: 0 }}>
                <div style={{ position: "relative", width: 80, height: 80, flexShrink: 0 }}>
                  <svg width={80} height={80} style={{ transform: "rotate(-90deg)" }}>
                    <circle cx={40} cy={40} r={34} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth={6} />
                    <circle cx={40} cy={40} r={34} fill="none" stroke="#2B5EA7" strokeWidth={6}
                      strokeDasharray={2 * Math.PI * 34} strokeDashoffset={2 * Math.PI * 34 * (1 - 0.72)}
                      strokeLinecap="round"
                      style={{ animation: visible ? "ringDraw 1.5s cubic-bezier(0.22, 1, 0.36, 1) forwards" : "none", filter: "drop-shadow(0 0 4px rgba(43,94,167,0.30))" }} />
                  </svg>
                  <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <span style={{ fontSize: 24, fontWeight: 300, fontFamily: mono, color: C.sandText, lineHeight: 1 }}>72</span>
                  </div>
                </div>
                <div style={{ textAlign: "left" }}>
                  <div style={{ fontSize: 13, fontWeight: 600, fontFamily: mono, color: C.sandText, marginBottom: 4 }}>72 / 100</div>
                  <div style={{ display: "inline-flex", alignItems: "center", gap: 5, padding: "3px 10px", borderRadius: 100, backgroundColor: "rgba(43,94,167,0.12)", marginBottom: 6 }}>
                    <div style={{ width: 5, height: 5, borderRadius: 2, backgroundColor: "#2B5EA7" }} />
                    <span style={{ fontSize: 11, fontWeight: 600, color: "#2B5EA7" }}>Established Stability</span>
                  </div>
                  <div style={{ fontSize: 13, color: C.sandLight }}>3 points to High Stability</div>
                </div>
              </div>

              {/* Key stats — single-line sections */}
              <div style={{ flex: 1, display: "flex", flexDirection: "column" as const, gap: 8 }}>
                <div style={{ display: m ? "grid" : "flex", gridTemplateColumns: "1fr", gap: 0, borderRadius: 10, overflow: "hidden", border: "1px solid rgba(255,255,255,0.06)" }}>
                  {[
                    { label: "INCOME BUFFER", value: "4.2 months", sub: "if your top client leaves", color: C.teal },
                    { label: "STABILITY TYPE", value: "Uneven", sub: "", color: "#D4A843" },
                    { label: "BIGGEST RISK", value: "Concentration", sub: "Too much from one source", color: "#E57373" },
                  ].map((metric, i, arr) => (
                    <div key={i} style={{ flex: m ? undefined : 1, padding: m ? "10px 14px" : "12px 10px", textAlign: m ? "left" : "center", borderRight: !m && i < arr.length - 1 ? "1px solid rgba(255,255,255,0.06)" : "none", borderBottom: m && i < arr.length - 1 ? "1px solid rgba(255,255,255,0.06)" : "none", backgroundColor: "rgba(255,255,255,0.02)", display: m ? "flex" : "block", alignItems: "center", justifyContent: "space-between" }}>
                      <div style={{ fontSize: 9, fontWeight: 600, letterSpacing: "0.08em", color: C.sandLight, marginBottom: m ? 0 : 4 }}>{metric.label}</div>
                      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                        <div style={{ fontSize: 14, fontWeight: 600, fontFamily: mono, color: metric.color }}>{metric.value}</div>
                        {metric.sub && !m && <div style={{ fontSize: 11, color: C.sandLight, marginTop: 2 }}>{metric.sub}</div>}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div style={{ textAlign: "center", marginTop: 16, position: "relative", zIndex: 1 }}>
              <span style={{ fontSize: 11, color: C.sandLight, letterSpacing: "0.04em" }}>Example output</span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}


/* ================================================================ */
/* SECTION 3 — CATEGORY DECLARATION                                  */
/* ================================================================ */

function CategoryDeclaration() {
  const { ref, visible } = useInView();
  const m = useMobile();
  const fadeIn = useFadeIn();

  return (
    <section ref={ref} style={{ backgroundColor: C.navy, paddingTop: m ? 72 : 120, paddingBottom: m ? 72 : 120, paddingLeft: sectionPx(m), paddingRight: sectionPx(m), position: "relative" as const, overflow: "hidden" }}>
      {/* Subtle grain */}
      <div className="navy-grain" />

      <div style={{ maxWidth: 820, margin: "0 auto", textAlign: "center", position: "relative", zIndex: 1 }}>
        <h2 style={{ fontSize: m ? 28 : 44, fontWeight: 700, lineHeight: 1.08, letterSpacing: "-0.03em", color: C.sandText, marginBottom: 32, ...fadeIn(visible) }}>
          Your income has a structure.
        </h2>

        <p style={{ fontSize: m ? 17 : 20, fontWeight: 400, lineHeight: 1.65, color: "rgba(244,241,234,0.60)", maxWidth: 600, margin: "0 auto 48px", ...fadeIn(visible, 80) }}>
          Not how much you earn. How it&rsquo;s built. Whether it depends on one client, one employer, one deal closing on time. Whether it continues if you stop. Whether it holds when conditions change.
        </p>

        {/* Three pillars */}
        <div style={{ display: m ? "block" : "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 1, maxWidth: 720, margin: "0 auto 48px", borderRadius: 16, overflow: "hidden", ...fadeIn(visible, 120) }}>
          {[
            { label: "Credit scores", measures: "Borrowing behavior" },
            { label: "Income verification", measures: "How much you earn" },
            { label: "RunPayway", measures: "How your income is built", highlight: true },
          ].map((item, i) => (
            <div key={i} style={{
              padding: m ? "20px 24px" : "24px 20px",
              backgroundColor: item.highlight ? "rgba(31,109,122,0.12)" : "rgba(255,255,255,0.03)",
              textAlign: "center",
              marginBottom: m ? 1 : 0,
            }}>
              <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.10em", color: item.highlight ? C.teal : "rgba(244,241,234,0.35)", marginBottom: 8 }}>{item.label.toUpperCase()}</div>
              <div style={{ fontSize: m ? 15 : 16, fontWeight: item.highlight ? 700 : 500, color: item.highlight ? C.teal : "rgba(244,241,234,0.55)" }}>{item.measures}</div>
            </div>
          ))}
        </div>

        <p style={{ fontSize: m ? 17 : 20, fontWeight: 600, lineHeight: 1.5, color: C.sandText, maxWidth: 560, margin: "0 auto", ...fadeIn(visible, 200) }}>
          This is the layer nobody measures.{m ? " " : <br />}Until now.
        </p>
      </div>
    </section>
  );
}


/* ================================================================ */
/* SECTION 4 — PROOF MOMENT                                          */
/* ================================================================ */

function ProofMoment() {
  const { ref, visible } = useInView();
  const m = useMobile();
  const fadeIn = useFadeIn();

  return (
    <section ref={ref} style={{ backgroundColor: C.sand, paddingTop: m ? 72 : 120, paddingBottom: m ? 72 : 120, paddingLeft: sectionPx(m), paddingRight: sectionPx(m) }}>
      <div style={{ maxWidth: innerW, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: m ? 40 : 56, ...fadeIn(visible) }}>
          <h2 style={{ fontSize: m ? 28 : 52, fontWeight: 700, lineHeight: 1.08, letterSpacing: "-0.035em", color: C.navy, marginBottom: 24 }}>
            Same income. Different setup.{m ? " " : <br />}Completely different risk.
          </h2>
          <p style={{ fontSize: m ? 18 : 24, fontWeight: 400, lineHeight: 1.45, color: C.textSecondary }}>
            Two consultants. Same $150K/year income. One breaks first.
          </p>
        </div>

        {/* Comparison cards */}
        <div style={{ display: m ? "block" : "grid", gridTemplateColumns: "1fr 1fr", gap: 24, maxWidth: 960, margin: "0 auto", ...fadeIn(visible, 120) }}>
          {/* Person A — fragile */}
          <div style={{ borderRadius: 20, padding: m ? 28 : 32, backgroundColor: C.white, boxShadow: cardShadow, marginBottom: m ? 20 : 0, position: "relative" as const, overflow: "hidden" }}>
            <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 4, backgroundColor: C.risk }} />
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 20 }}>
              <div style={{ fontSize: 16, fontWeight: 600, color: C.navy }}>$150K / year</div>
              <div style={{ fontSize: 14, fontWeight: 500, color: C.textMuted }}>Freelance Consultant</div>
            </div>
            <PressureBar segments={[
              { pct: 80, color: C.risk, label: "At risk" },
              { pct: 15, color: C.moderate, label: "" },
              { pct: 5, color: C.teal, label: "" },
            ]} height={16} />
            <p style={{ fontSize: 16, color: C.textSecondary, lineHeight: 1.6, margin: "20px 0 24px" }}>
              80% of income depends on one client. No contracts. Nothing repeats. If work stops, income stops.
            </p>
            <div style={{ display: "flex", alignItems: "center", gap: 14, padding: "16px 0 0", borderTop: `1px solid rgba(14,26,43,0.06)` }}>
              <div style={{ position: "relative", width: 52, height: 52, flexShrink: 0 }}>
                <ScoreRing score={31} size={52} stroke={5} color={C.risk} trackColor="rgba(14,26,43,0.06)" />
                <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <span style={{ fontSize: 16, fontWeight: 600, fontFamily: mono, color: C.risk }}>31</span>
                </div>
              </div>
              <div>
                <div style={{ fontSize: 16, fontWeight: 600, color: C.risk }}>Limited Stability</div>
                <div style={{ fontSize: 14, fontWeight: 500, color: C.textMuted }}>One decision away from crisis</div>
              </div>
            </div>
          </div>

          {/* Person B — structured */}
          <div style={{ borderRadius: 20, padding: m ? 28 : 32, backgroundColor: C.white, boxShadow: cardShadow, position: "relative" as const, overflow: "hidden" }}>
            <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 4, backgroundColor: C.teal }} />
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 20 }}>
              <div style={{ fontSize: 16, fontWeight: 600, color: C.navy }}>$150K / year</div>
              <div style={{ fontSize: 14, fontWeight: 500, color: C.textMuted }}>Freelance Consultant</div>
            </div>
            <PressureBar segments={[
              { pct: 25, color: C.risk, label: "At risk" },
              { pct: 35, color: C.moderate, label: "Recurring" },
              { pct: 40, color: C.teal, label: "Protected" },
            ]} height={16} />
            <p style={{ fontSize: 16, color: C.textSecondary, lineHeight: 1.6, margin: "20px 0 24px" }}>
              5 clients, none over 30%. 40% recurring. 3 months of income already locked in. Can absorb a client leaving or a slow quarter.
            </p>
            <div style={{ display: "flex", alignItems: "center", gap: 14, padding: "16px 0 0", borderTop: `1px solid rgba(14,26,43,0.06)` }}>
              <div style={{ position: "relative", width: 52, height: 52, flexShrink: 0 }}>
                <ScoreRing score={74} size={52} stroke={5} color={C.teal} trackColor="rgba(14,26,43,0.06)" />
                <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <span style={{ fontSize: 16, fontWeight: 600, fontFamily: mono, color: C.teal }}>74</span>
                </div>
              </div>
              <div>
                <div style={{ fontSize: 16, fontWeight: 600, color: C.teal }}>Established Stability</div>
                <div style={{ fontSize: 14, fontWeight: 500, color: C.textMuted }}>Can absorb a disruption and keep going</div>
              </div>
            </div>
          </div>
        </div>

        {/* Closing + CTA */}
        <div style={{ textAlign: "center", marginTop: m ? 40 : 56, ...fadeIn(visible, 200) }}>
          <p style={{ fontSize: m ? 20 : 24, fontWeight: 600, color: C.navy, marginBottom: 8 }}>RunPayway measures the difference.</p>
          <p style={{ fontSize: 16, color: C.textSecondary, marginBottom: 32 }}>Every income has a breaking point.</p>
          <CtaButton m={m} variant="primary" />
        </div>
      </div>
    </section>
  );
}


/* ================================================================ */
/* SECTION 5 — WHAT CHANGES                                          */
/* ================================================================ */

function WhatChanges() {
  const { ref, visible } = useInView();
  const m = useMobile();
  const fadeIn = useFadeIn();

  const steps = [
    {
      num: "01",
      step: "Identify",
      desc: "See exactly where your income is exposed\u2014the blind spots you can\u2019t find in a bank statement.",
      detail: "Which source disappearing would hurt the most?",
      icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>,
    },
    {
      num: "02",
      step: "Understand",
      desc: "Know how your income actually behaves under pressure\u2014not how it feels when things are going well.",
      detail: "What happens if you can\u2019t work for 90 days?",
      icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>,
    },
    {
      num: "03",
      step: "Act",
      desc: "Get the exact moves\u2014with scripts, sequences, and projected impact\u2014before the problem arrives.",
      detail: "One structural change could shift your score 15+ points.",
      icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/></svg>,
    },
  ];

  return (
    <section ref={ref} style={{ backgroundColor: C.white, paddingTop: m ? 72 : 120, paddingBottom: m ? 72 : 120, paddingLeft: sectionPx(m), paddingRight: sectionPx(m) }}>
      <div style={{ maxWidth: 960, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: m ? 40 : 64, ...fadeIn(visible) }}>
          <div style={{ fontSize: m ? 13 : 14, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase" as const, color: C.teal, marginBottom: 16 }}>HOW IT WORKS</div>
          <h2 style={{ fontSize: m ? 28 : 40, fontWeight: 600, lineHeight: 1.08, letterSpacing: "-0.028em", color: C.navy, marginBottom: 16 }}>
            From blind spot to structural clarity{m ? " " : <br />}in under two minutes.
          </h2>
          <p style={{ fontSize: 18, fontWeight: 400, lineHeight: 1.6, color: C.textSecondary, maxWidth: 560, margin: "0 auto" }}>
            The diagnostic doesn&rsquo;t just score you. It shows you what to do about it.
          </p>
        </div>

        <div style={{ display: "flex", flexDirection: "column" as const, gap: 0, ...fadeIn(visible, 100) }}>
          {steps.map((item, i) => (
            <div key={i} style={{
              display: m ? "block" : "grid", gridTemplateColumns: "56px 1fr", gap: 24,
              padding: m ? "28px 0" : "36px 0",
              borderTop: i === 0 ? `1px solid rgba(14,26,43,0.06)` : "none",
              borderBottom: `1px solid rgba(14,26,43,0.06)`,
            }}>
              {/* Step number + line */}
              <div style={{ display: "flex", flexDirection: m ? "row" as const : "column" as const, alignItems: m ? "center" : "center", gap: m ? 14 : 8, marginBottom: m ? 16 : 0 }}>
                <div style={{
                  width: 48, height: 48, borderRadius: 14,
                  backgroundColor: C.navy, color: "#fff",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: 14, fontWeight: 700, fontFamily: mono, flexShrink: 0,
                }}>
                  {item.num}
                </div>
                {m && <div style={{ fontSize: 20, fontWeight: 700, color: C.navy }}>{item.step}</div>}
              </div>

              {/* Content */}
              <div>
                {!m && <div style={{ fontSize: 20, fontWeight: 700, color: C.navy, marginBottom: 8 }}>{item.step}</div>}
                <p style={{ fontSize: 16, color: C.textSecondary, lineHeight: 1.65, margin: "0 0 16px" }}>{item.desc}</p>
                <div style={{
                  display: "inline-flex", alignItems: "center", gap: 8,
                  padding: "8px 16px", borderRadius: 10,
                  backgroundColor: `${C.teal}06`, border: `1px solid ${C.teal}15`,
                }}>
                  <div style={{ color: C.teal, flexShrink: 0, display: "flex" }}>{item.icon}</div>
                  <span style={{ fontSize: 14, fontWeight: 600, color: C.navy }}>{item.detail}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}


/* ================================================================ */
/* SECTION 6 — HOW THE SCORING WORKS                                 */
/* ================================================================ */

function ScoringSystem() {
  const { ref, visible } = useInView();
  const m = useMobile();
  const fadeIn = useFadeIn();

  return (
    <section ref={ref} style={{ backgroundColor: C.sand, paddingTop: m ? 72 : 120, paddingBottom: m ? 72 : 120, paddingLeft: sectionPx(m), paddingRight: sectionPx(m) }}>
      <div style={{ maxWidth: narrowW, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: m ? 40 : 56, ...fadeIn(visible) }}>
          <h2 style={{ fontSize: m ? 28 : 40, fontWeight: 600, lineHeight: 1.08, letterSpacing: "-0.028em", color: C.navy, marginBottom: 24 }}>
            A fixed system.{m ? " " : <br />}Not a changing opinion.
          </h2>
          <p style={{ fontSize: 18, fontWeight: 400, lineHeight: 1.6, color: C.textSecondary, maxWidth: explanatoryW, margin: "0 auto" }}>
            No AI. No advisor judgment. No algorithm that changes week to week. Same inputs produce the same result.
          </p>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: m ? 10 : 14, maxWidth: 480, margin: "0 auto", ...fadeIn(visible, 120) }}>
          {[
            { label: "Model", value: "RP-2.0" },
            { label: "Ruleset", value: "Fixed" },
            { label: "Output", value: "Deterministic" },
          ].map((item, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: m ? "16px 24px" : "20px 32px", borderRadius: 16, backgroundColor: C.white, boxShadow: cardShadow }}>
              <div style={{ fontSize: 13, fontWeight: 700, letterSpacing: "0.12em", color: C.textMuted }}>{item.label.toUpperCase()}</div>
              <div style={{ fontSize: m ? 20 : 24, fontWeight: 700, fontFamily: mono, color: C.navy }}>{item.value}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}


/* ================================================================ */
/* SECTION 7 — WHAT YOU RECEIVE                                      */
/* ================================================================ */

function WhatYouReceive() {
  const { ref, visible } = useInView();
  const m = useMobile();
  const fadeIn = useFadeIn();

  return (
    <section ref={ref} style={{ backgroundColor: C.white, paddingTop: m ? 72 : 120, paddingBottom: m ? 72 : 120, paddingLeft: sectionPx(m), paddingRight: sectionPx(m) }}>
      <div style={{ maxWidth: innerW, margin: "0 auto" }}>
        <div style={{ display: m ? "block" : "grid", gridTemplateColumns: "5fr 7fr", gap: 56 }}>

          {/* Left — text */}
          <div style={{ marginBottom: m ? 40 : 0, ...fadeIn(visible) }}>
            <div style={{ fontSize: m ? 13 : 14, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase" as const, color: C.teal, marginBottom: 16 }}>YOUR REPORT</div>
            <h2 style={{ fontSize: m ? 28 : 40, fontWeight: 600, lineHeight: 1.08, letterSpacing: "-0.028em", color: C.navy, marginBottom: 24 }}>
              What your structure reveals
            </h2>
            <p style={{ fontSize: 18, fontWeight: 400, lineHeight: 1.6, color: C.textSecondary, marginBottom: 32 }}>
              Everything generated from your actual numbers — personalized to your industry and your primary constraint.
            </p>
            <div style={{ display: "flex", flexDirection: "column" as const, gap: 16 }}>
              {[
                "Your Structural Income Score and classification band",
                "Primary constraint and exposure analysis",
                "Personalized negotiation scripts built from your numbers",
                "12-week action roadmap with projected milestones",
              ].map((item, i) => (
                <div key={i} style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
                  <div style={{ width: 6, height: 6, borderRadius: "50%", backgroundColor: C.teal, flexShrink: 0, marginTop: 9 }} />
                  <span style={{ fontSize: 16, fontWeight: 500, color: C.textSecondary, lineHeight: 1.45 }}>{item}</span>
                </div>
              ))}
            </div>
            <p style={{ fontSize: 14, fontWeight: 500, color: C.textMuted, marginTop: 32 }}>
              All included with the $69 diagnostic. Lifetime access.
            </p>
          </div>

          {/* Right — product cards */}
          <div style={{ display: "flex", flexDirection: "column" as const, gap: 20, ...fadeIn(visible, 120) }}>

            {/* This Week */}
            <div style={{ backgroundColor: C.navy, borderRadius: 24, padding: m ? 24 : 32 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 18 }}>
                <div style={{ width: 28, height: 28, borderRadius: 8, backgroundColor: `${C.teal}15`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke={C.teal} strokeWidth="2" strokeLinecap="round"><path d="M12 8v4l3 3m6-3a9 9 0 1 1-18 0 9 9 0 0 1 18 0z" /></svg>
                </div>
                <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.08em", color: C.teal }}>THIS WEEK</span>
              </div>
              <div style={{ padding: "14px 16px", borderRadius: 12, backgroundColor: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)", marginBottom: 14 }}>
                <div style={{ fontSize: 16, fontWeight: 600, color: C.sandText, marginBottom: 4 }}>
                  Convert to retainer. <span style={{ fontWeight: 300, fontFamily: mono, color: C.teal }}>Highest impact</span>
                </div>
                <div style={{ fontSize: 13, color: C.sandMuted }}>Your most important conversation this week.</div>
              </div>
              <p style={{ fontSize: 13, color: C.sandLight, margin: 0, lineHeight: 1.55 }}>
                Every time you return, it shows the <strong style={{ color: C.sandText }}>one thing</strong> that matters most right now.
              </p>
            </div>

            {/* Negotiation Playbook */}
            <div style={{ backgroundColor: C.navy, borderRadius: 24, padding: m ? 24 : 32 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 18 }}>
                <div style={{ width: 28, height: 28, borderRadius: 8, backgroundColor: `${C.purple}15`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke={C.purple} strokeWidth="2" strokeLinecap="round"><path d="M11 5H6a2 2 0 0 0-2 2v11a2 2 0 0 0 2 2h11a2 2 0 0 0 2-2v-5m-1.414-9.414a2 2 0 1 1 2.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                </div>
                <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.08em", color: C.purple }}>NEGOTIATION PLAYBOOK</span>
              </div>
              <div style={{ padding: "14px 16px", borderRadius: 12, backgroundColor: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)", marginBottom: 14 }}>
                <div style={{ fontSize: 13, color: C.sandText, marginBottom: 8 }}>Scripts with <strong>your actual numbers</strong>.</div>
                <div style={{ fontSize: 13, color: C.sandMuted, lineHeight: 1.55, fontStyle: "italic" }}>
                  &ldquo;I wanted to propose something that several of my long-term clients have found valuable — an ongoing advisory retainer...&rdquo;
                </div>
              </div>
              <p style={{ fontSize: 13, color: C.sandLight, margin: 0, lineHeight: 1.55 }}>
                Includes what to say if they push back, and how to tell if it worked.
              </p>
            </div>

            {/* 12-Week Roadmap */}
            <div style={{ backgroundColor: C.navy, borderRadius: 24, padding: m ? 24 : 32 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 18 }}>
                <div style={{ width: 28, height: 28, borderRadius: 8, backgroundColor: "rgba(255,255,255,0.06)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke={C.sandText} strokeWidth="2" strokeLinecap="round"><path d="M12 8v4l3 3m6-3a9 9 0 1 1-18 0 9 9 0 0 1 18 0z" /></svg>
                </div>
                <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.08em", color: C.sandText }}>12-WEEK ROADMAP</span>
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
                        <span style={{ fontSize: 11, color: C.sandLight }}>{step.week}</span>
                        <div style={{ fontSize: 14, fontWeight: 500, color: C.sandText }}>{step.action}</div>
                      </div>
                      <span style={{ fontSize: 14, fontFamily: mono, fontWeight: 600, color: C.teal }}>{step.score}</span>
                    </div>
                  </div>
                ))}
              </div>
              <p style={{ fontSize: 13, color: C.sandLight, margin: 0, lineHeight: 1.55 }}>
                Milestones from <strong style={{ color: C.sandText }}>your starting numbers</strong>. Not generic advice.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}


/* ================================================================ */
/* SECTION 8 — USE CASE ARCHITECTURE                                 */
/* ================================================================ */

function UseCaseArchitecture() {
  const { ref, visible } = useInView();
  const m = useMobile();
  const fadeIn = useFadeIn();

  const cases = [
    {
      title: "Individuals",
      sub: "Your income. Measured.",
      hook: "You\u2019ve built something. But do you know if it holds?",
      bullets: [
        "See where your income breaks before it actually does",
        "Know exactly which move raises your stability the fastest",
        "Get negotiation scripts built from your real numbers",
      ],
      stat: "Under 2 minutes",
      statLabel: "TO YOUR SCORE",
      color: C.teal,
      link: "/begin",
      cta: "Begin your assessment",
      icon: <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><circle cx="12" cy="8" r="4"/><path d="M5 20c0-4 3-7 7-7s7 3 7 7"/></svg>,
    },
    {
      title: "Advisors",
      sub: "Your clients\u2019 risk. Quantified.",
      hook: "You already know something\u2019s off in their income. Now you can prove it.",
      bullets: [
        "Run structural assessments for every client in your book",
        "Surface risks they can\u2019t see in a balance sheet",
        "Turn income conversations into planning engagements",
      ],
      stat: "Licensed",
      statLabel: "ADVISOR ACCESS",
      color: C.purple,
      link: "/advisors",
      cta: "See the advisor model",
      icon: <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><path d="M9 12l2 2 4-4"/><path d="M12 3c7.2 0 9 1.8 9 9s-1.8 9-9 9-9-1.8-9-9 1.8-9 9-9z"/></svg>,
    },
    {
      title: "Organizations",
      sub: "Workforce stability. At scale.",
      hook: "Your contractors look fine on paper. Their income structure says otherwise.",
      bullets: [
        "Assess contractor and workforce income stability at scale",
        "One fixed, auditable rule set across the entire organization",
        "API integration for underwriting, onboarding, and compliance",
      ],
      stat: "API",
      statLabel: "INTEGRATION",
      color: C.navy,
      link: "/organizations",
      cta: "Explore enterprise",
      icon: <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></svg>,
    },
  ];

  return (
    <section ref={ref} style={{ backgroundColor: C.sand, paddingTop: m ? 72 : 120, paddingBottom: m ? 72 : 120, paddingLeft: sectionPx(m), paddingRight: sectionPx(m) }}>
      <div style={{ maxWidth: innerW, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: m ? 40 : 64, ...fadeIn(visible) }}>
          <div style={{ fontSize: m ? 13 : 14, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase" as const, color: C.teal, marginBottom: 16 }}>WHO IT&rsquo;S FOR</div>
          <h2 style={{ fontSize: m ? 28 : 40, fontWeight: 600, lineHeight: 1.08, letterSpacing: "-0.028em", color: C.navy, marginBottom: 16 }}>
            One system. Three ways to use it.
          </h2>
          <p style={{ fontSize: 18, fontWeight: 400, color: C.textSecondary, maxWidth: 520, margin: "0 auto" }}>Same fixed rules. Same deterministic output. Different stakes.</p>
        </div>

        <div style={{ display: m ? "block" : "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 24, ...fadeIn(visible, 100) }}>
          {cases.map((uc, i) => (
            <div key={i} style={{
              display: "flex", flexDirection: "column" as const,
              borderRadius: 24, backgroundColor: C.white,
              boxShadow: "0 1px 4px rgba(14,26,43,0.04)",
              border: "1px solid rgba(14,26,43,0.06)",
              position: "relative" as const, overflow: "hidden", marginBottom: m ? 16 : 0,
              transition: "box-shadow 320ms cubic-bezier(0.22, 1, 0.36, 1), transform 320ms cubic-bezier(0.22, 1, 0.36, 1)",
            }}
              onMouseEnter={e => { e.currentTarget.style.boxShadow = "0 16px 48px rgba(14,26,43,0.10), 0 4px 16px rgba(14,26,43,0.06)"; e.currentTarget.style.transform = "translateY(-4px)"; }}
              onMouseLeave={e => { e.currentTarget.style.boxShadow = "0 1px 4px rgba(14,26,43,0.04)"; e.currentTarget.style.transform = "translateY(0)"; }}
            >
              {/* Gradient accent top */}
              <div style={{ height: 4, background: `linear-gradient(90deg, ${uc.color}, ${uc.color}60)` }} />

              <div style={{ padding: m ? "28px 24px 32px" : "36px 32px 36px", flex: 1, display: "flex", flexDirection: "column" as const }}>
                {/* Icon + title row */}
                <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 20 }}>
                  <div style={{ width: 48, height: 48, borderRadius: 14, backgroundColor: `${uc.color}08`, display: "flex", alignItems: "center", justifyContent: "center", color: uc.color, flexShrink: 0 }}>
                    {uc.icon}
                  </div>
                  <div>
                    <div style={{ fontSize: 18, fontWeight: 700, color: C.navy, lineHeight: 1.2 }}>{uc.title}</div>
                    <div style={{ fontSize: 13, fontWeight: 600, color: uc.color, marginTop: 2 }}>{uc.sub}</div>
                  </div>
                </div>

                {/* Hook — the line that speaks to them */}
                <p style={{ fontSize: m ? 16 : 17, fontWeight: 500, color: C.navy, lineHeight: 1.45, margin: "0 0 20px" }}>
                  {uc.hook}
                </p>

                {/* Bullet points */}
                <div style={{ display: "flex", flexDirection: "column" as const, gap: 12, marginBottom: 24, flex: 1 }}>
                  {uc.bullets.map((b, bi) => (
                    <div key={bi} style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
                      <div style={{ width: 5, height: 5, borderRadius: "50%", backgroundColor: uc.color, flexShrink: 0, marginTop: 8 }} />
                      <span style={{ fontSize: 14, color: C.textSecondary, lineHeight: 1.55 }}>{b}</span>
                    </div>
                  ))}
                </div>

                {/* Stat chip */}
                <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "14px 18px", borderRadius: 14, backgroundColor: `${uc.color}06`, marginBottom: 24 }}>
                  <span style={{ fontSize: 22, fontWeight: 700, fontFamily: mono, color: uc.color, lineHeight: 1 }}>{uc.stat}</span>
                  <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.10em", color: `${uc.color}99` }}>{uc.statLabel}</span>
                </div>

                {/* CTA */}
                <Link href={uc.link} className="cta-tick" style={{
                  display: "flex", alignItems: "center", justifyContent: "center",
                  height: 52, borderRadius: 14,
                  backgroundColor: i === 0 ? uc.color : "transparent",
                  color: i === 0 ? "#fff" : C.navy,
                  border: i === 0 ? "none" : `1.5px solid rgba(14,26,43,0.12)`,
                  fontSize: 15, fontWeight: 600, textDecoration: "none",
                  transition: "background 200ms, border-color 200ms, transform 200ms",
                }}
                  onMouseEnter={e => { if (i !== 0) { e.currentTarget.style.borderColor = "rgba(14,26,43,0.25)"; e.currentTarget.style.backgroundColor = "rgba(14,26,43,0.02)"; } }}
                  onMouseLeave={e => { if (i !== 0) { e.currentTarget.style.borderColor = "rgba(14,26,43,0.12)"; e.currentTarget.style.backgroundColor = "transparent"; } }}
                >
                  <span className="tick tick-white" /><span className="cta-label">{uc.cta}</span>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}


/* ================================================================ */
/* SECTION 9 — INDUSTRY PROFILES                                     */
/* ================================================================ */

function IndustryMiniRing({ score, size = 56 }: { score: number; size?: number }) {
  const stroke = 5;
  const r = (size - stroke) / 2;
  const circ = 2 * Math.PI * r;
  const offset = circ - (score / 100) * circ;
  const color = score >= 50 ? C.teal : score >= 30 ? C.moderate : C.risk;
  return (
    <div style={{ position: "relative", width: size, height: size, flexShrink: 0 }}>
      <svg width={size} height={size} style={{ transform: "rotate(-90deg)" }}>
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth={stroke} />
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={color} strokeWidth={stroke}
          strokeDasharray={circ} strokeDashoffset={offset} strokeLinecap="round"
          style={{ transition: "stroke-dashoffset 800ms cubic-bezier(0.22, 1, 0.36, 1), stroke 400ms" }} />
      </svg>
      <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <span style={{ fontSize: size * 0.32, fontWeight: 600, fontFamily: mono, color: "#fff", lineHeight: 1 }}>{score}</span>
      </div>
    </div>
  );
}

function IndustryProfiles() {
  const { ref, visible } = useInView();
  const m = useMobile();
  const fadeIn = useFadeIn();
  const [selected, setSelected] = useState<typeof INDUSTRIES[0] | null>(null);
  const [autoIndex, setAutoIndex] = useState(0);
  const pausedRef = useRef(false);

  // Auto-rotate when nothing manually selected
  useEffect(() => {
    if (!visible) return;
    const interval = setInterval(() => {
      if (!pausedRef.current) setAutoIndex(prev => (prev + 1) % INDUSTRIES.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [visible]);

  const active = selected || INDUSTRIES[autoIndex];
  const bandLabel = active.median >= 50 ? "Established" : active.median >= 30 ? "Developing" : "Limited";
  const bandColor2 = active.median >= 50 ? C.teal : active.median >= 30 ? C.moderate : C.risk;

  return (
    <section ref={ref} style={{ backgroundColor: C.white, paddingTop: m ? 72 : 120, paddingBottom: m ? 72 : 120, paddingLeft: sectionPx(m), paddingRight: sectionPx(m) }}>
      <div style={{ maxWidth: innerW, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: m ? 36 : 56, ...fadeIn(visible) }}>
          <div style={{ fontSize: m ? 13 : 14, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase" as const, color: C.teal, marginBottom: 16 }}>BY INDUSTRY</div>
          <h2 style={{ fontSize: m ? 28 : 40, fontWeight: 600, lineHeight: 1.08, letterSpacing: "-0.028em", color: C.navy, marginBottom: 16 }}>
            Every industry has a structural{m ? " " : <br />}breaking point.
          </h2>
          <p style={{ fontSize: 18, fontWeight: 400, lineHeight: 1.6, color: C.textSecondary, maxWidth: 560, margin: "0 auto" }}>
            Select yours to see where income typically fails&mdash;and why.
          </p>
        </div>

        {/* Split layout: list + insight card */}
        <div style={{ display: m ? "block" : "grid", gridTemplateColumns: "1fr 1.2fr", gap: 32, maxWidth: 1020, margin: "0 auto", ...fadeIn(visible, 100) }}>

          {/* Industry list */}
          <div style={{ display: "grid", gridTemplateColumns: m ? "1fr 1fr" : "1fr 1fr", gap: m ? 8 : 10, marginBottom: m ? 24 : 0 }}>
            {INDUSTRIES.map((ind) => {
              const isActive = active.key === ind.key;
              return (
                <button key={ind.key} onClick={() => { setSelected(ind); pausedRef.current = true; }}
                  style={{
                    display: "flex", alignItems: "center", gap: 10,
                    height: m ? 44 : 48, padding: m ? "0 12px" : "0 16px",
                    borderRadius: 12,
                    backgroundColor: isActive ? C.navy : "transparent",
                    border: isActive ? "1px solid transparent" : "1px solid rgba(14,26,43,0.08)",
                    fontSize: m ? 13 : 14, fontWeight: isActive ? 600 : 500,
                    color: isActive ? "#fff" : C.textSecondary,
                    cursor: "pointer", textAlign: "left" as const, whiteSpace: "nowrap" as const,
                    transition: "all 240ms cubic-bezier(0.22, 1, 0.36, 1)",
                  }}
                  onMouseEnter={e => { if (!isActive) { e.currentTarget.style.backgroundColor = "rgba(14,26,43,0.03)"; e.currentTarget.style.borderColor = "rgba(14,26,43,0.15)"; } }}
                  onMouseLeave={e => { if (!isActive) { e.currentTarget.style.backgroundColor = "transparent"; e.currentTarget.style.borderColor = "rgba(14,26,43,0.08)"; } }}>
                  {isActive && <div style={{ width: 6, height: 6, borderRadius: "50%", backgroundColor: bandColor2, flexShrink: 0 }} />}
                  {ind.name}
                </button>
              );
            })}
          </div>

          {/* Insight card */}
          <div key={active.key} style={{
            backgroundColor: C.navy, borderRadius: 24, padding: m ? "28px 24px" : "36px 40px",
            boxShadow: "0 12px 48px rgba(14,26,43,0.15), 0 4px 16px rgba(14,26,43,0.08)",
            position: "relative" as const, overflow: "hidden",
            animation: "fadeInUp 400ms cubic-bezier(0.22, 1, 0.36, 1) forwards",
          }}>
            {/* Gradient accent top */}
            <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 3, background: `linear-gradient(90deg, ${bandColor2}, ${C.purple})` }} />

            {/* Header: industry + score ring */}
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 24 }}>
              <div>
                <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.10em", color: "rgba(244,241,234,0.40)", marginBottom: 6 }}>STRUCTURAL PROFILE</div>
                <div style={{ fontSize: m ? 20 : 24, fontWeight: 600, color: C.sandText, letterSpacing: "-0.02em" }}>{active.name}</div>
              </div>
              <IndustryMiniRing score={active.median} size={m ? 52 : 64} />
            </div>

            {/* Constraint callout */}
            <div style={{ padding: m ? "14px 16px" : "16px 20px", borderRadius: 14, backgroundColor: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.06)", marginBottom: 20 }}>
              <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.10em", color: C.risk, marginBottom: 6 }}>PRIMARY CONSTRAINT</div>
              <div style={{ fontSize: m ? 15 : 16, fontWeight: 600, color: C.sandText, lineHeight: 1.4 }}>{active.constraint}</div>
            </div>

            {/* Description */}
            <p style={{ fontSize: m ? 14 : 15, color: "rgba(244,241,234,0.55)", lineHeight: 1.7, margin: "0 0 24px" }}>{active.desc}</p>

            {/* Income pressure bar */}
            <div style={{ marginBottom: 20 }}>
              <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.10em", color: "rgba(244,241,234,0.35)", marginBottom: 10 }}>TYPICAL INCOME STRUCTURE</div>
              <div style={{ display: "flex", height: 10, borderRadius: 999, overflow: "hidden" }}>
                <div style={{ width: `${active.atRisk}%`, backgroundColor: C.risk, transition: "width 600ms cubic-bezier(0.22, 1, 0.36, 1)" }} />
                <div style={{ width: `${active.recurring}%`, backgroundColor: C.moderate, transition: "width 600ms cubic-bezier(0.22, 1, 0.36, 1)" }} />
                <div style={{ width: `${active.protected}%`, backgroundColor: C.teal, transition: "width 600ms cubic-bezier(0.22, 1, 0.36, 1)" }} />
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", marginTop: 8 }}>
                <span style={{ fontSize: 11, color: C.risk, fontWeight: 600 }}>At risk {active.atRisk}%</span>
                <span style={{ fontSize: 11, color: C.moderate, fontWeight: 600 }}>Recurring {active.recurring}%</span>
                <span style={{ fontSize: 11, color: C.teal, fontWeight: 600 }}>Protected {active.protected}%</span>
              </div>
            </div>

            {/* Bottom stats row */}
            <div style={{ display: "flex", gap: m ? 12 : 16, paddingTop: 20, borderTop: "1px solid rgba(255,255,255,0.06)" }}>
              <div style={{ flex: 1, textAlign: "center" }}>
                <div style={{ fontSize: 10, fontWeight: 600, letterSpacing: "0.08em", color: "rgba(244,241,234,0.35)", marginBottom: 4 }}>MEDIAN SCORE</div>
                <div style={{ fontSize: 20, fontWeight: 700, fontFamily: mono, color: bandColor2 }}>{active.median}</div>
              </div>
              <div style={{ width: 1, backgroundColor: "rgba(255,255,255,0.06)" }} />
              <div style={{ flex: 1, textAlign: "center" }}>
                <div style={{ fontSize: 10, fontWeight: 600, letterSpacing: "0.08em", color: "rgba(244,241,234,0.35)", marginBottom: 4 }}>STABILITY BAND</div>
                <div style={{ fontSize: 14, fontWeight: 600, color: bandColor2 }}>{bandLabel}</div>
              </div>
              <div style={{ width: 1, backgroundColor: "rgba(255,255,255,0.06)" }} />
              <div style={{ flex: 1, textAlign: "center" }}>
                <div style={{ fontSize: 10, fontWeight: 600, letterSpacing: "0.08em", color: "rgba(244,241,234,0.35)", marginBottom: 4 }}>TOP RISK</div>
                <div style={{ fontSize: 14, fontWeight: 600, color: C.sandText }}>{active.risk}</div>
              </div>
            </div>
          </div>
        </div>

        <p style={{ fontSize: 14, color: C.textMuted, textAlign: "center", marginTop: m ? 32 : 44, lineHeight: 1.6, maxWidth: explanatoryW, marginLeft: "auto", marginRight: "auto" }}>
          Profiles based on structural patterns across each industry. Your individual score depends on your specific setup.
        </p>
      </div>
    </section>
  );
}


/* ================================================================ */
/* SECTION 10 — QUIET AUTHORITY                                      */
/* ================================================================ */

function QuietAuthority() {
  const { ref, visible } = useInView();
  const m = useMobile();
  const fadeIn = useFadeIn();

  return (
    <section ref={ref} style={{ backgroundColor: C.navy, paddingTop: m ? 72 : 120, paddingBottom: m ? 72 : 120, paddingLeft: sectionPx(m), paddingRight: sectionPx(m) }}>
      <div style={{ maxWidth: narrowW, margin: "0 auto", textAlign: "center" }}>
        <h2 style={{ fontSize: m ? 28 : 40, fontWeight: 600, lineHeight: 1.08, letterSpacing: "-0.028em", color: C.sandText, marginBottom: 24, ...fadeIn(visible) }}>
          Used to understand income{m ? " " : <br />}before it is relied on.
        </h2>
        <p style={{ fontSize: 18, fontWeight: 400, lineHeight: 1.6, color: C.sandMuted, marginBottom: m ? 48 : 64, ...fadeIn(visible, 80) }}>
          Applied by individuals, advisors, and organizations to evaluate income structure before significant decisions.
        </p>

        <div style={{ display: "grid", gridTemplateColumns: m ? "1fr 1fr" : "1fr 1fr 1fr 1fr", gap: m ? 16 : 24, ...fadeIn(visible, 160) }}>
          {[
            "No financial accounts required",
            "No credit pull",
            "Private by default",
            "Deterministic output",
          ].map((item, i) => (
            <div key={i} style={{ padding: "16px 12px", borderRadius: 12, border: "1px solid rgba(255,255,255,0.06)" }}>
              <span style={{ fontSize: 14, fontWeight: 500, color: C.sandMuted }}>{item}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}


/* ================================================================ */
/* SECTION 11 — BEFORE YOU BEGIN                                     */
/* ================================================================ */

function BeforeYouBegin() {
  const { ref, visible } = useInView();
  const m = useMobile();
  const fadeIn = useFadeIn();

  return (
    <section ref={ref} style={{ backgroundColor: C.sand, paddingTop: m ? 72 : 120, paddingBottom: m ? 72 : 120, paddingLeft: sectionPx(m), paddingRight: sectionPx(m) }}>
      <div style={{ maxWidth: 680, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: m ? 32 : 48, ...fadeIn(visible) }}>
          <div style={{ fontSize: m ? 13 : 14, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase" as const, color: C.teal, marginBottom: 16 }}>BEFORE YOU BEGIN</div>
          <h2 style={{ fontSize: m ? 28 : 40, fontWeight: 600, lineHeight: 1.08, letterSpacing: "-0.028em", color: C.navy, marginBottom: 24 }}>
            No documents needed.{m ? " " : <br />}No bank connection.
          </h2>
          <p style={{ fontSize: 18, fontWeight: 400, lineHeight: 1.6, color: C.textSecondary, maxWidth: explanatoryW, margin: "0 auto" }}>
            But you&rsquo;ll get the most accurate result if you&rsquo;ve thought about:
          </p>
        </div>

        <div style={{ display: "flex", flexDirection: "column" as const, gap: 16, maxWidth: 560, margin: "0 auto 32px", ...fadeIn(visible, 100) }}>
          {[
            "How many places your income comes from",
            "Whether any single source accounts for most of it",
            "How much of your income is already committed or recurring",
            "What would change if your biggest source went away tomorrow",
          ].map((item, i) => (
            <div key={i} style={{ display: "flex", gap: 14, alignItems: "flex-start" }}>
              <div style={{ width: 6, height: 6, borderRadius: "50%", backgroundColor: C.teal, flexShrink: 0, marginTop: 10 }} />
              <span style={{ fontSize: 17, fontWeight: 500, color: C.navy, lineHeight: 1.5 }}>{item}</span>
            </div>
          ))}
        </div>

        <p style={{ fontSize: 16, fontWeight: 500, color: C.textMuted, textAlign: "center", lineHeight: 1.6, maxWidth: 520, margin: "0 auto", ...fadeIn(visible, 180) }}>
          You don&rsquo;t need exact numbers. Reasonable estimates work.{m ? " " : <br />}The system is built for it.
        </p>
      </div>
    </section>
  );
}


/* ================================================================ */
/* SECTION 12 — FINAL CTA                                            */
/* ================================================================ */

function FinalCta() {
  const { ref, visible } = useInView();
  const m = useMobile();
  const fadeIn = useFadeIn();

  return (
    <section ref={ref} style={{ backgroundColor: C.navy, paddingTop: m ? 88 : 128, paddingBottom: m ? 88 : 128, paddingLeft: sectionPx(m), paddingRight: sectionPx(m), borderTop: "1px solid rgba(255,255,255,0.04)" }}>
      <div style={{ maxWidth: explanatoryW, margin: "0 auto", textAlign: "center" }}>
        <h2 style={{ fontSize: m ? 28 : 52, fontWeight: 700, lineHeight: 1.08, letterSpacing: "-0.035em", color: C.sandText, marginBottom: 20, ...fadeIn(visible) }}>
          Know how your income holds up{m ? " " : <br />}before you rely on it.
        </h2>
        <div style={{ display: "flex", flexDirection: "column" as const, alignItems: "center", ...fadeIn(visible, 160) }}>
          <CtaButton m={m} variant="light" />
          <p style={{ fontSize: 14, fontWeight: 500, lineHeight: 1.45, color: C.sandLight, marginTop: 16, textAlign: "center" }}>
            Under 2 minutes | Instant result | Private by default
          </p>
        </div>
      </div>
    </section>
  );
}


/* StickyCta removed — page has sufficient inline CTAs (hero, proof, final)
   and the fixed bar was covering footer content on all viewports. */


/* ================================================================ */
/* STRUCTURED DATA                                                   */
/* ================================================================ */

const PRODUCT_SCHEMA = {
  "@context": "https://schema.org", "@type": "Product",
  name: "RunPayway\u2122 Income Stability Score\u2122",
  description: "A structural income measurement system that evaluates how income is built — not how much you make.",
  brand: { "@type": "Brand", name: "RunPayway\u2122" },
  offers: [
    { "@type": "Offer", price: "0", priceCurrency: "USD", name: "Income Stability Score\u2122", description: "Score, band, primary constraint, and one recommended direction." },
    { "@type": "Offer", price: "69", priceCurrency: "USD", name: "RunPayway\u2122 Diagnostic Report", description: "Full diagnostic with personalized scripts, 12-week roadmap, and income analysis." },
  ],
};


/* ================================================================ */
/* PAGE EXPORT                                                       */
/* ================================================================ */

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
        <CategoryDeclaration />
        <ProofMoment />
        <WhatChanges />
        <ScoringSystem />
        <WhatYouReceive />
        <UseCaseArchitecture />
        <IndustryProfiles />
        <QuietAuthority />
        <BeforeYouBegin />
        <FinalCta />
      </main>
    </div>
  );
}
