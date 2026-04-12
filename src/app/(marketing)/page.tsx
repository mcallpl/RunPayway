"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import EmailCapture from "@/components/EmailCapture";

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

function useTablet() {
  const [t, setT] = useState(false);
  useEffect(() => { const c = () => setT(window.innerWidth > 768 && window.innerWidth <= 1024); c(); window.addEventListener("resize", c); return () => window.removeEventListener("resize", c); }, []);
  return t;
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
const sectionPx = (m: boolean, t?: boolean) => m ? 28 : t ? 56 : 48;
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
  const text = label || "Get Your Income Stability Score";
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
  { key: "consulting", name: "Consulting", constraint: "You are the product", desc: "Your clients pay for your time, not a system. If you stop delivering, 85% of your income stops with you." },
  { key: "real_estate", name: "Real Estate", constraint: "Pipeline dependency", desc: "One delayed closing or one lost listing can erase a quarter of annual earnings. Nothing is contractually yours until it closes." },
  { key: "sales", name: "Sales / Brokerage", constraint: "Nothing carries forward", desc: "Last quarter was strong. But your structure doesn\u2019t carry that forward. Next quarter starts from zero unless you close again." },
  { key: "creative", name: "Freelance / Creative", constraint: "Every month starts at zero", desc: "No project means no income. No retainer means no floor. You are re-earning your entire livelihood every 30 days." },
  { key: "construction", name: "Construction / Trades", constraint: "The next job isn\u2019t signed yet", desc: "The current project is solid. The next one is a handshake. Your income has no structural buffer between jobs." },
  { key: "media", name: "Media / Entertainment", constraint: "Between projects, income is zero", desc: "Strong projects create strong months. But between them, your income is not low \u2014 it is zero. No carry. No residual." },
  { key: "insurance", name: "Insurance", constraint: "New business masks renewal erosion", desc: "Strong production quarters feel like growth. But if renewals are slipping underneath, your structure is compounding backwards." },
  { key: "legal", name: "Legal Services", constraint: "Three matters carry the practice", desc: "Count your top three matters. They likely carry 60\u201370% of your billings. When one concludes, the gap arrives all at once." },
  { key: "technology", name: "Technology", constraint: "One employer, one system, one decision", desc: "Your compensation feels stable because the system around it is stable. But it\u2019s one layoff away from a total structural shift." },
  { key: "finance", name: "Finance / Banking", constraint: "The variable component is the one that matters", desc: "Base salary creates a floor. But the bonus, the production credit \u2014 that\u2019s where real earnings live. And that part can vanish in one cycle." },
  { key: "healthcare", name: "Healthcare", constraint: "One system, no alternatives", desc: "Steady pay from one institution feels safe until the institution restructures. When your sole employer changes models, you have no alternative." },
  { key: "retail", name: "Retail / E-Commerce", constraint: "Revenue is not income", desc: "Sales look strong until you subtract inventory, returns, and platform fees. What you deposit and what you keep are two different numbers." },
  { key: "hospitality", name: "Hospitality / Food Service", constraint: "Demand disappears overnight", desc: "One slow season, one bad review, one shift in foot traffic. Your revenue is a daily vote that customers can stop casting without notice." },
  { key: "transportation", name: "Transportation / Logistics", constraint: "Utilization is everything", desc: "An idle truck or an empty route earns nothing. Your income depends on constant movement \u2014 and one breakdown changes the entire month." },
  { key: "manufacturing", name: "Manufacturing", constraint: "One contract carries the floor", desc: "Your largest buyer likely represents 40%+ of output. If they renegotiate, delay, or leave, your fixed costs don\u2019t shrink with them." },
  { key: "education", name: "Education", constraint: "The ceiling is the structure", desc: "Your income is predictable because the system caps it. Stability is high, but so is the cost of staying \u2014 growth requires leaving." },
  { key: "nonprofit", name: "Nonprofit / Public Sector", constraint: "Funding cycles dictate everything", desc: "Your salary exists because a grant was renewed or a budget was approved. When the cycle turns, positions disappear regardless of performance." },
  { key: "agriculture", name: "Agriculture", constraint: "You can\u2019t control the two things that matter most", desc: "Weather and market price. You plant in hope and harvest in uncertainty. No contract protects you from a bad season." },
  { key: "energy", name: "Energy / Utilities", constraint: "Commodity prices set your margin", desc: "Your operation runs the same whether prices are up or down. But your income doesn\u2019t. One market shift reprices six months of work." },
];


/* ================================================================ */
/* SECTION 1+2 — HERO (includes trust strip)                         */
/* ================================================================ */

function HeroSection() {
  const { ref, visible } = useInView();
  const m = useMobile();
  const t = useTablet();
  const fadeIn = useFadeIn();

  return (
    <header ref={ref} style={{ backgroundColor: C.sand }}>
      <style>{`
        @keyframes ringDraw { from { stroke-dashoffset: 745; } to { stroke-dashoffset: 538; } }
      `}</style>

      <div style={{ maxWidth: innerW, margin: "0 auto", paddingTop: m ? 80 : 112, paddingBottom: m ? 64 : 96, paddingLeft: sectionPx(m, t), paddingRight: sectionPx(m, t) }}>

        {/* Two-column: copy left, product preview right */}
        <div style={{ display: m ? "block" : "grid", gridTemplateColumns: "1fr 1fr", gap: 64, alignItems: "center", maxWidth: 1080, margin: "0 auto" }}>

          {/* Left — copy */}
          <div style={{ marginBottom: m ? 48 : 0 }}>
            {/* Trust badges */}
            <div style={{ display: "flex", flexWrap: "wrap" as const, gap: m ? 12 : 16, marginBottom: m ? 28 : 36, ...fadeIn(visible) }}>
              {["Private by default", "No credit pull", "2-minute assessment"].map((item, i) => (
                <span key={i} style={{ fontSize: 12, fontWeight: 600, letterSpacing: "0.04em", color: C.teal, padding: "5px 12px", borderRadius: 100, border: `1px solid ${C.teal}25`, backgroundColor: `${C.teal}06` }}>{item}</span>
              ))}
            </div>

            <h1 style={{ fontSize: m ? 36 : 56, fontWeight: 700, lineHeight: 1.06, letterSpacing: "-0.035em", color: C.navy, marginBottom: m ? 16 : 20, ...fadeIn(visible, 50) }}>
              Your income has{m ? " " : <br />}a structure.{m ? " " : <br />}Now you can measure&nbsp;it.
            </h1>

            <p style={{ fontSize: m ? 17 : 22, fontWeight: 500, lineHeight: 1.45, color: C.navy, maxWidth: 480, marginBottom: 16, ...fadeIn(visible, 80) }}>
              RunPayway&trade; scores how much of your income is protected, how much is at risk, and what to do about&nbsp;it.
            </p>

            <div style={{ marginBottom: m ? 32 : 40, ...fadeIn(visible, 100) }} />

            <div style={{ ...fadeIn(visible, 150) }}>
              <CtaButton m={m} variant="primary" label="Get Your Income Stability Score" />
              <p style={{ fontSize: 13, fontWeight: 500, color: C.textMuted, marginTop: 14 }}>
                Takes under 2 minutes &middot; No financial accounts required
              </p>
            </div>

          </div>

          {/* Right — product preview (pill shape) */}
          <div style={{ ...fadeIn(visible, 200) }}>
            <div style={{ backgroundColor: C.navy, borderRadius: 28, padding: m ? "28px 24px 24px" : "36px 36px 28px", position: "relative", overflow: "hidden" }}>
              {/* Gradient accent */}
              <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 3, background: `linear-gradient(90deg, ${C.teal}, ${C.purple})` }} />

              {/* Score module — horizontal pill */}
              <div style={{ display: "flex", alignItems: "center", gap: 20, marginBottom: 24 }}>
                <div style={{ position: "relative", width: 72, height: 72, flexShrink: 0 }}>
                  <svg width={72} height={72} style={{ transform: "rotate(-90deg)" }}>
                    <circle cx={36} cy={36} r={30} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth={5} />
                    <circle cx={36} cy={36} r={30} fill="none" stroke="#2B5EA7" strokeWidth={5}
                      strokeDasharray={2 * Math.PI * 30} strokeDashoffset={2 * Math.PI * 30 * (1 - 0.72)}
                      strokeLinecap="round"
                      style={{ animation: visible ? "ringDraw 1.5s cubic-bezier(0.22, 1, 0.36, 1) forwards" : "none", filter: "drop-shadow(0 0 4px rgba(43,94,167,0.30))" }} />
                  </svg>
                  <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <span style={{ fontSize: 22, fontWeight: 300, fontFamily: mono, color: C.sandText, lineHeight: 1 }}>72</span>
                  </div>
                </div>
                <div>
                  <div style={{ fontSize: 12, fontWeight: 600, fontFamily: mono, color: C.sandText, marginBottom: 4 }}>72 / 100</div>
                  <div style={{ display: "inline-flex", alignItems: "center", gap: 5, padding: "3px 10px", borderRadius: 100, backgroundColor: "rgba(43,94,167,0.12)", marginBottom: 4 }}>
                    <div style={{ width: 5, height: 5, borderRadius: 2, backgroundColor: "#2B5EA7" }} />
                    <span style={{ fontSize: 11, fontWeight: 600, color: "#2B5EA7" }}>Established Stability</span>
                  </div>
                  <div style={{ fontSize: 12, color: "rgba(244,241,234,0.40)" }}>3 pts to High Stability</div>
                </div>
              </div>

              {/* Income pressure bar */}
              <div>
                <div style={{ display: "flex", height: 8, borderRadius: 999, overflow: "hidden" }}>
                  <div style={{ width: "28%", backgroundColor: C.teal }} />
                  <div style={{ width: "40%", backgroundColor: C.moderate }} />
                  <div style={{ width: "32%", backgroundColor: C.risk }} />
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", marginTop: 6 }}>
                  <span style={{ fontSize: 10, color: C.teal, fontWeight: 600 }}>Protected 28%</span>
                  <span style={{ fontSize: 10, color: C.moderate, fontWeight: 600 }}>Recurring 40%</span>
                  <span style={{ fontSize: 10, color: C.risk, fontWeight: 600 }}>At risk 32%</span>
                </div>
              </div>

              <div style={{ textAlign: "center", paddingTop: 14 }}>
                <span style={{ fontSize: 10, color: "rgba(244,241,234,0.20)", letterSpacing: "0.04em" }}>Example report</span>
              </div>
            </div>
          </div>
        </div>

        {/* Trust strip — full width */}
        <div style={{ display: "flex", justifyContent: "center", gap: m ? 24 : 56, flexWrap: "wrap" as const, marginTop: m ? 48 : 64, paddingTop: m ? 32 : 40, borderTop: `1px solid ${C.borderSoft}` }}>
          {[
            { label: "19 Industries", sub: "Built for" },
            { label: "Instant", sub: "Results" },
            { label: "No Accounts", sub: "Linked" },
            { label: "Encrypted", sub: "& Private" },
          ].map((item, i) => (
            <div key={i} style={{ textAlign: "center" as const }}>
              <div style={{ fontSize: 16, fontWeight: 700, fontFamily: mono, color: C.navy }}>{item.label}</div>
              <div style={{ fontSize: 11, color: C.textMuted, letterSpacing: "0.06em" }}>{item.sub}</div>
            </div>
          ))}
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
  const t = useTablet();
  const fadeIn = useFadeIn();

  return (
    <section ref={ref} style={{ backgroundColor: C.navy, paddingTop: m ? 72 : 120, paddingBottom: m ? 72 : 120, paddingLeft: sectionPx(m, t), paddingRight: sectionPx(m, t), position: "relative" as const, overflow: "hidden" }}>
      {/* Subtle grain */}
      <div className="navy-grain" />

      <div style={{ maxWidth: 820, margin: "0 auto", textAlign: "center", position: "relative", zIndex: 1 }}>
        <h2 style={{ fontSize: m ? 28 : 44, fontWeight: 700, lineHeight: 1.08, letterSpacing: "-0.03em", color: C.sandText, marginBottom: 32, ...fadeIn(visible) }}>
          Not how much you make.{m ? " " : <br />}How your income is built.
        </h2>

        <p style={{ fontSize: m ? 17 : 20, fontWeight: 400, lineHeight: 1.65, color: "rgba(244,241,234,0.60)", maxWidth: 600, margin: "0 auto 48px", ...fadeIn(visible, 80) }}>
          Whether it depends on one client, one employer, or one deal closing on time. Whether it continues if you stop. Whether it holds when conditions change.
        </p>

        <p style={{ fontSize: m ? 17 : 20, fontWeight: 600, lineHeight: 1.5, color: C.sandText, maxWidth: 560, margin: "0 auto", ...fadeIn(visible, 200) }}>
          RunPayway&trade; measures the layer between earning and&nbsp;keeping.
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
  const t = useTablet();
  const fadeIn = useFadeIn();

  return (
    <section ref={ref} style={{ backgroundColor: C.sand, paddingTop: m ? 72 : 120, paddingBottom: m ? 72 : 120, paddingLeft: sectionPx(m, t), paddingRight: sectionPx(m, t) }}>
      <div style={{ maxWidth: innerW, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: m ? 40 : 56, ...fadeIn(visible) }}>
          <h2 style={{ fontSize: m ? 28 : 52, fontWeight: 700, lineHeight: 1.08, letterSpacing: "-0.035em", color: C.navy, marginBottom: 24 }}>
            Same income. Different setup.{m ? " " : <br />}Completely different risk.
          </h2>
          <p style={{ fontSize: m ? 18 : 24, fontWeight: 400, lineHeight: 1.45, color: C.textSecondary }}>
            Two consultants. Same $150K/year income. Only one is ready for what&rsquo;s next.
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
              One client. No contracts. Nothing recurring.
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
                <div style={{ fontSize: 14, fontWeight: 500, color: C.textMuted }}>One change away from disruption</div>
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
              Five clients. 40% recurring. Three months locked.
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
          <p style={{ fontSize: m ? 20 : 24, fontWeight: 600, color: C.navy, marginBottom: 8 }}>RunPayway&trade; measures the difference.</p>
          <p style={{ fontSize: 16, color: C.textSecondary, marginBottom: 32 }}>See where yours stands.</p>
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
  const t = useTablet();
  const fadeIn = useFadeIn();

  const steps = [
    {
      num: "01",
      step: "Answer",
      desc: "Tell us about your income\u2014how many sources, how they pay, what\u2019s contracted. Takes under two minutes.",
      detail: "No bank accounts. No documents. Just what you know.",
      icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 1 1 3 3L7 19l-4 1 1-4Z"/></svg>,
    },
    {
      num: "02",
      step: "See your score",
      desc: "RunPayway\u2122 analyzes your income structure across 20 engines and returns a stability score from 0\u2013100.",
      detail: "Same inputs, same result. Every time.",
      icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>,
    },
    {
      num: "03",
      step: "Get your plan",
      desc: "Your report shows what\u2019s protected, what\u2019s at risk, and the specific moves to strengthen your position.",
      detail: "Personalized to your industry and income type.",
      icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8Z"/><path d="M14 2v6h6"/><path d="M16 13H8"/><path d="M16 17H8"/><path d="M10 9H8"/></svg>,
    },
  ];

  return (
    <section ref={ref} style={{ backgroundColor: C.white, paddingTop: m ? 72 : 120, paddingBottom: m ? 72 : 120, paddingLeft: sectionPx(m, t), paddingRight: sectionPx(m, t) }}>
      <div style={{ maxWidth: 960, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: m ? 40 : 64, ...fadeIn(visible) }}>
          <h2 style={{ fontSize: m ? 28 : 40, fontWeight: 600, lineHeight: 1.08, letterSpacing: "-0.028em", color: C.navy, marginBottom: 16 }}>
            How it works
          </h2>
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
                  display: "inline-flex", alignItems: "flex-start", gap: 8,
                  padding: m ? "10px 14px" : "8px 16px", borderRadius: 10,
                  backgroundColor: `${C.teal}06`, border: `1px solid ${C.teal}15`,
                }}>
                  <div style={{ color: C.teal, flexShrink: 0, display: "flex", marginTop: 1 }}>{item.icon}</div>
                  <span style={{ fontSize: m ? 13 : 14, fontWeight: 600, color: C.navy, lineHeight: 1.4 }}>{item.detail}</span>
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
/* SECTION 7 — WHAT YOU RECEIVE                                      */
/* ================================================================ */

function WhatYouReceive() {
  const { ref, visible } = useInView();
  const m = useMobile();
  const t = useTablet();
  const fadeIn = useFadeIn();

  return (
    <section ref={ref} style={{ backgroundColor: C.white, paddingTop: m ? 72 : 120, paddingBottom: m ? 72 : 120, paddingLeft: sectionPx(m, t), paddingRight: sectionPx(m, t) }}>
      <div style={{ maxWidth: innerW, margin: "0 auto" }}>

        {/* Centered heading */}
        <div style={{ textAlign: "center", marginBottom: m ? 40 : 56, ...fadeIn(visible) }}>
          <h2 style={{ fontSize: m ? 28 : 40, fontWeight: 600, lineHeight: 1.08, letterSpacing: "-0.028em", color: C.navy, marginBottom: 24 }}>
            What&rsquo;s in your report
          </h2>
          <p style={{ fontSize: 18, fontWeight: 400, lineHeight: 1.6, color: C.textSecondary, maxWidth: explanatoryW, margin: "0 auto" }}>
            Most people don&rsquo;t find out their income is fragile until something breaks. Your report shows you before that&nbsp;happens.
          </p>
        </div>

        {/* Hero product card — score preview */}
        <div style={{ backgroundColor: C.navy, borderRadius: 28, padding: m ? "28px 24px 24px" : "40px 48px 36px", position: "relative", overflow: "hidden", maxWidth: 720, margin: "0 auto", marginBottom: m ? 40 : 56, ...fadeIn(visible, 80) }}>
          <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 3, background: `linear-gradient(90deg, ${C.teal}, ${C.purple})` }} />
          <div style={{ display: "flex", alignItems: "center", gap: 24, marginBottom: 24 }}>
            <div style={{ position: "relative", width: 80, height: 80, flexShrink: 0 }}>
              <ScoreRing score={72} size={80} stroke={6} color="#2B5EA7" trackColor="rgba(255,255,255,0.06)" />
              <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <span style={{ fontSize: 26, fontWeight: 300, fontFamily: mono, color: C.sandText, lineHeight: 1 }}>72</span>
              </div>
            </div>
            <div>
              <div style={{ fontSize: 14, fontWeight: 600, fontFamily: mono, color: C.sandText, marginBottom: 6 }}>72 / 100</div>
              <div style={{ display: "inline-flex", alignItems: "center", gap: 5, padding: "4px 12px", borderRadius: 100, backgroundColor: "rgba(43,94,167,0.12)", marginBottom: 6 }}>
                <div style={{ width: 6, height: 6, borderRadius: 3, backgroundColor: "#2B5EA7" }} />
                <span style={{ fontSize: 12, fontWeight: 600, color: "#2B5EA7" }}>Established Stability</span>
              </div>
              <div style={{ fontSize: 13, color: C.sandMuted }}>How much of your income is protected, recurring, or at&nbsp;risk</div>
            </div>
          </div>
          <div>
            <div style={{ display: "flex", height: 10, borderRadius: 999, overflow: "hidden" }}>
              <div style={{ width: "28%", backgroundColor: C.teal }} />
              <div style={{ width: "40%", backgroundColor: C.moderate }} />
              <div style={{ width: "32%", backgroundColor: C.risk }} />
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", marginTop: 8 }}>
              <span style={{ fontSize: 11, color: C.teal, fontWeight: 600 }}>Protected 28%</span>
              <span style={{ fontSize: 11, color: C.moderate, fontWeight: 600 }}>Recurring 40%</span>
              <span style={{ fontSize: 11, color: C.risk, fontWeight: 600 }}>At risk 32%</span>
            </div>
          </div>
          <div style={{ textAlign: "center", paddingTop: 16 }}>
            <span style={{ fontSize: 10, color: "rgba(244,241,234,0.20)", letterSpacing: "0.04em" }}>Example report</span>
          </div>
        </div>

        {/* Three feature columns */}
        <div style={{ display: m ? "block" : "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 32, maxWidth: 960, margin: "0 auto", marginBottom: m ? 40 : 56, ...fadeIn(visible, 160) }}>

          {/* Your first move */}
          <div style={{ marginBottom: m ? 32 : 0, textAlign: "center" }}>
            <div style={{ width: 48, height: 48, borderRadius: 14, backgroundColor: `${C.teal}10`, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px" }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={C.teal} strokeWidth="1.5" strokeLinecap="round"><path d="M12 8v4l3 3m6-3a9 9 0 1 1-18 0 9 9 0 0 1 18 0z" /></svg>
            </div>
            <div style={{ fontSize: 16, fontWeight: 700, color: C.navy, marginBottom: 8 }}>Your highest-impact move</div>
            <p style={{ fontSize: 15, color: C.textSecondary, lineHeight: 1.55, margin: 0 }}>
              One specific action to take this week&mdash;like converting a client to retainer or diversifying a single-source dependency. Not a suggestion. A&nbsp;directive.
            </p>
          </div>

          {/* Negotiation scripts */}
          <div style={{ marginBottom: m ? 32 : 0, textAlign: "center" }}>
            <div style={{ width: 48, height: 48, borderRadius: 14, backgroundColor: `${C.purple}10`, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px" }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={C.purple} strokeWidth="1.5" strokeLinecap="round"><path d="M11 5H6a2 2 0 0 0-2 2v11a2 2 0 0 0 2 2h11a2 2 0 0 0 2-2v-5m-1.414-9.414a2 2 0 1 1 2.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
            </div>
            <div style={{ fontSize: 16, fontWeight: 700, color: C.navy, marginBottom: 8 }}>Negotiation scripts</div>
            <p style={{ fontSize: 15, color: C.textSecondary, lineHeight: 1.55, margin: 0 }}>
              Exact language to ask for a retainer, renegotiate a rate, or restructure a contract&mdash;built from your income data. Includes responses for common&nbsp;objections.
            </p>
          </div>

          {/* 12-week roadmap */}
          <div style={{ marginBottom: m ? 32 : 0, textAlign: "center" }}>
            <div style={{ width: 48, height: 48, borderRadius: 14, backgroundColor: "rgba(14,26,43,0.06)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px" }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={C.navy} strokeWidth="1.5" strokeLinecap="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8Z"/><path d="M14 2v6h6"/><path d="M16 13H8"/><path d="M16 17H8"/><path d="M10 9H8"/></svg>
            </div>
            <div style={{ fontSize: 16, fontWeight: 700, color: C.navy, marginBottom: 8 }}>12-week roadmap</div>
            <p style={{ fontSize: 15, color: C.textSecondary, lineHeight: 1.55, margin: 0 }}>
              Week-by-week actions with projected score at each milestone. You&rsquo;ll know exactly where you should be by week 4, 8, and&nbsp;12.
            </p>
          </div>
        </div>

        {/* Price + CTA */}
        <div style={{ textAlign: "center", ...fadeIn(visible, 240) }}>
          <p style={{ fontSize: 16, fontWeight: 500, color: C.textSecondary, marginBottom: 8 }}>
            Score, scripts, roadmap, and lifetime access&mdash;$69.
          </p>
          <p style={{ fontSize: 14, color: C.textMuted, marginBottom: 24 }}>
            Less than one hour of billable time. Protects every hour after&nbsp;it.
          </p>
          <CtaButton m={m} variant="primary" />
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
  const t = useTablet();
  const fadeIn = useFadeIn();

  return (
    <section ref={ref} style={{ backgroundColor: C.white, paddingTop: m ? 72 : 120, paddingBottom: m ? 72 : 120, paddingLeft: sectionPx(m, t), paddingRight: sectionPx(m, t) }}>
      <div style={{ maxWidth: innerW, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: m ? 40 : 64, ...fadeIn(visible) }}>
          <h2 style={{ fontSize: m ? 28 : 40, fontWeight: 600, lineHeight: 1.08, letterSpacing: "-0.028em", color: C.navy, marginBottom: 16 }}>
            Built for how you earn
          </h2>
        </div>

        {/* Primary — Individuals — full navy hero */}
        <div style={{
          borderRadius: 28, backgroundColor: C.navy,
          boxShadow: "0 20px 60px rgba(14,26,43,0.25), 0 8px 24px rgba(14,26,43,0.12)",
          position: "relative" as const, overflow: "hidden",
          marginBottom: m ? 24 : 40,
          ...fadeIn(visible, 80),
        }}>
          {/* Gradient accent top */}
          <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 4, background: `linear-gradient(90deg, ${C.teal}, ${C.purple})` }} />

          <div style={{ padding: m ? "36px 24px" : "56px 64px", display: m ? "block" : "grid", gridTemplateColumns: "1fr 1fr", gap: 56, alignItems: "center" }}>
            {/* Left — copy */}
            <div style={{ marginBottom: m ? 36 : 0 }}>
              <div style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "5px 14px", borderRadius: 100, backgroundColor: "rgba(31,109,122,0.15)", marginBottom: 24 }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={C.teal} strokeWidth="1.5" strokeLinecap="round"><circle cx="12" cy="8" r="4"/><path d="M5 20c0-4 3-7 7-7s7 3 7 7"/></svg>
                <span style={{ fontSize: 12, fontWeight: 700, letterSpacing: "0.06em", color: C.teal }}>FOR INDIVIDUALS</span>
              </div>
              <p style={{ fontSize: m ? 22 : 28, fontWeight: 700, color: C.sandText, lineHeight: 1.2, letterSpacing: "-0.02em", marginBottom: 20 }}>
                You earn well. Now see how much of it is actually&nbsp;protected.
              </p>
              <div style={{ display: "flex", flexDirection: "column" as const, gap: 16, marginBottom: 32 }}>
                {[
                  "Know which income source failing would hurt you the most\u2014and how to fix it before it does",
                  "Get the exact conversation to have with your biggest client this week",
                  "See your score move as you make each structural change",
                ].map((b, i) => (
                  <div key={i} style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
                    <div style={{ width: 5, height: 5, borderRadius: "50%", backgroundColor: C.teal, flexShrink: 0, marginTop: 9 }} />
                    <span style={{ fontSize: 15, color: "rgba(244,241,234,0.60)", lineHeight: 1.55 }}>{b}</span>
                  </div>
                ))}
              </div>
              <Link href="/begin" style={{
                display: "inline-flex", alignItems: "center", justifyContent: "center",
                height: 56, padding: "0 36px", borderRadius: 16,
                backgroundColor: C.teal, color: "#fff",
                fontSize: 16, fontWeight: 600, textDecoration: "none",
                boxShadow: "0 8px 28px rgba(31,109,122,0.30)",
                transition: "transform 200ms, box-shadow 200ms",
              }}
                onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = "0 12px 36px rgba(31,109,122,0.40)"; }}
                onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "0 8px 28px rgba(31,109,122,0.30)"; }}
              >
                Get your score &mdash; takes 2 minutes
              </Link>
            </div>

            {/* Right — score preview */}
            <div style={{ backgroundColor: "rgba(255,255,255,0.03)", borderRadius: 20, padding: m ? 24 : 32, border: "1px solid rgba(255,255,255,0.06)" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 20 }}>
                <div style={{ position: "relative", width: 64, height: 64, flexShrink: 0 }}>
                  <ScoreRing score={72} size={64} stroke={5} color="#2B5EA7" trackColor="rgba(255,255,255,0.06)" />
                  <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <span style={{ fontSize: 20, fontWeight: 300, fontFamily: mono, color: C.sandText, lineHeight: 1 }}>72</span>
                  </div>
                </div>
                <div>
                  <div style={{ fontSize: 12, fontWeight: 600, fontFamily: mono, color: C.sandText, marginBottom: 4 }}>72 / 100</div>
                  <div style={{ display: "inline-flex", alignItems: "center", gap: 5, padding: "3px 10px", borderRadius: 100, backgroundColor: "rgba(43,94,167,0.12)" }}>
                    <div style={{ width: 5, height: 5, borderRadius: 2, backgroundColor: "#2B5EA7" }} />
                    <span style={{ fontSize: 11, fontWeight: 600, color: "#2B5EA7" }}>Established Stability</span>
                  </div>
                </div>
              </div>
              <div>
                <div style={{ display: "flex", height: 8, borderRadius: 999, overflow: "hidden" }}>
                  <div style={{ width: "28%", backgroundColor: C.teal }} />
                  <div style={{ width: "40%", backgroundColor: C.moderate }} />
                  <div style={{ width: "32%", backgroundColor: C.risk }} />
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", marginTop: 6 }}>
                  <span style={{ fontSize: 10, color: C.teal, fontWeight: 600 }}>Protected 28%</span>
                  <span style={{ fontSize: 10, color: C.moderate, fontWeight: 600 }}>Recurring 40%</span>
                  <span style={{ fontSize: 10, color: C.risk, fontWeight: 600 }}>At risk 32%</span>
                </div>
              </div>
              <div style={{ textAlign: "center", paddingTop: 12 }}>
                <span style={{ fontSize: 10, color: "rgba(244,241,234,0.20)", letterSpacing: "0.04em" }}>Example report</span>
              </div>
            </div>
          </div>
        </div>

        {/* Secondary — Advisors + Organizations */}
        <div style={{ display: m ? "block" : "grid", gridTemplateColumns: "1fr 1fr", gap: 24, ...fadeIn(visible, 160) }}>
          {/* Advisors — purple accent */}
          <div style={{
            borderRadius: 20, backgroundColor: C.white,
            boxShadow: "0 4px 20px rgba(14,26,43,0.06)",
            borderLeft: `4px solid ${C.purple}`,
            border: `1px solid rgba(14,26,43,0.06)`,
            borderLeftWidth: 4, borderLeftColor: C.purple,
            padding: m ? "28px 24px" : "36px 40px",
            marginBottom: m ? 16 : 0,
            transition: "box-shadow 320ms cubic-bezier(0.22, 1, 0.36, 1), transform 320ms cubic-bezier(0.22, 1, 0.36, 1)",
          }}
            onMouseEnter={e => { e.currentTarget.style.boxShadow = "0 16px 48px rgba(75,63,174,0.12)"; e.currentTarget.style.transform = "translateY(-3px)"; }}
            onMouseLeave={e => { e.currentTarget.style.boxShadow = "0 4px 20px rgba(14,26,43,0.06)"; e.currentTarget.style.transform = "translateY(0)"; }}
          >
            <div style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "4px 12px", borderRadius: 100, backgroundColor: `${C.purple}08`, marginBottom: 20 }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={C.purple} strokeWidth="1.5" strokeLinecap="round"><path d="M9 12l2 2 4-4"/><path d="M12 3c7.2 0 9 1.8 9 9s-1.8 9-9 9-9-1.8-9-9 1.8-9 9-9z"/></svg>
              <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.06em", color: C.purple }}>FOR ADVISORS</span>
            </div>
            <p style={{ fontSize: m ? 18 : 20, fontWeight: 700, color: C.navy, lineHeight: 1.3, marginBottom: 12 }}>
              Give every client a number for the risk you already&nbsp;see.
            </p>
            <p style={{ fontSize: 15, color: C.textSecondary, lineHeight: 1.55, marginBottom: 24 }}>
              Run structural assessments across your book. Turn income conversations into planning engagements with data behind&nbsp;them.
            </p>
            <Link href="/advisors" style={{
              display: "inline-flex", alignItems: "center", justifyContent: "center",
              height: 44, padding: "0 24px", borderRadius: 12,
              backgroundColor: "transparent", color: C.purple,
              border: `1.5px solid ${C.purple}30`,
              fontSize: 14, fontWeight: 600, textDecoration: "none",
              transition: "all 200ms",
            }}
              onMouseEnter={e => { e.currentTarget.style.backgroundColor = `${C.purple}06`; e.currentTarget.style.borderColor = `${C.purple}50`; }}
              onMouseLeave={e => { e.currentTarget.style.backgroundColor = "transparent"; e.currentTarget.style.borderColor = `${C.purple}30`; }}
            >
              See the advisor model
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" style={{ marginLeft: 8 }}><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
            </Link>
          </div>

          {/* Organizations — navy accent */}
          <div style={{
            borderRadius: 20, backgroundColor: C.white,
            boxShadow: "0 4px 20px rgba(14,26,43,0.06)",
            border: `1px solid rgba(14,26,43,0.06)`,
            borderLeftWidth: 4, borderLeftColor: C.navy,
            padding: m ? "28px 24px" : "36px 40px",
            marginBottom: m ? 16 : 0,
            transition: "box-shadow 320ms cubic-bezier(0.22, 1, 0.36, 1), transform 320ms cubic-bezier(0.22, 1, 0.36, 1)",
          }}
            onMouseEnter={e => { e.currentTarget.style.boxShadow = "0 16px 48px rgba(14,26,43,0.10)"; e.currentTarget.style.transform = "translateY(-3px)"; }}
            onMouseLeave={e => { e.currentTarget.style.boxShadow = "0 4px 20px rgba(14,26,43,0.06)"; e.currentTarget.style.transform = "translateY(0)"; }}
          >
            <div style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "4px 12px", borderRadius: 100, backgroundColor: "rgba(14,26,43,0.04)", marginBottom: 20 }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={C.navy} strokeWidth="1.5" strokeLinecap="round"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></svg>
              <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.06em", color: C.navy }}>FOR ORGANIZATIONS</span>
            </div>
            <p style={{ fontSize: m ? 18 : 20, fontWeight: 700, color: C.navy, lineHeight: 1.3, marginBottom: 12 }}>
              Measure workforce income stability before it becomes your&nbsp;liability.
            </p>
            <p style={{ fontSize: 15, color: C.textSecondary, lineHeight: 1.55, marginBottom: 24 }}>
              Assess contractor and employee stability at scale. One auditable system for underwriting, onboarding, and&nbsp;compliance.
            </p>
            <Link href="/organizations" style={{
              display: "inline-flex", alignItems: "center", justifyContent: "center",
              height: 44, padding: "0 24px", borderRadius: 12,
              backgroundColor: "transparent", color: C.navy,
              border: "1.5px solid rgba(14,26,43,0.15)",
              fontSize: 14, fontWeight: 600, textDecoration: "none",
              transition: "all 200ms",
            }}
              onMouseEnter={e => { e.currentTarget.style.backgroundColor = "rgba(14,26,43,0.03)"; e.currentTarget.style.borderColor = "rgba(14,26,43,0.30)"; }}
              onMouseLeave={e => { e.currentTarget.style.backgroundColor = "transparent"; e.currentTarget.style.borderColor = "rgba(14,26,43,0.15)"; }}
            >
              Explore enterprise
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" style={{ marginLeft: 8 }}><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}


/* ================================================================ */
/* SECTION 9 — INDUSTRY PROFILES                                     */
/* ================================================================ */

function IndustryProfiles() {
  const { ref, visible } = useInView();
  const m = useMobile();
  const t = useTablet();
  const fadeIn = useFadeIn();
  const [selected, setSelected] = useState<typeof INDUSTRIES[0] | null>(null);

  const active = selected;

  return (
    <section ref={ref} style={{ backgroundColor: C.white, paddingTop: m ? 72 : 120, paddingBottom: m ? 72 : 120, paddingLeft: sectionPx(m, t), paddingRight: sectionPx(m, t) }}>
      <div style={{ maxWidth: 960, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: m ? 36 : 56, ...fadeIn(visible) }}>
          <h2 style={{ fontSize: m ? 28 : 40, fontWeight: 600, lineHeight: 1.08, letterSpacing: "-0.028em", color: C.navy, marginBottom: 16 }}>
            Find your industry
          </h2>
          <p style={{ fontSize: 18, fontWeight: 400, lineHeight: 1.6, color: C.textSecondary, maxWidth: 480, margin: "0 auto" }}>
            RunPayway&trade; is calibrated for how each industry actually earns. Select yours.
          </p>
        </div>

        {/* Industry pill grid */}
        <div style={{ display: "flex", flexWrap: "wrap" as const, justifyContent: "center", gap: m ? 8 : 10, maxWidth: 840, margin: "0 auto", marginBottom: active ? (m ? 32 : 40) : 0, ...fadeIn(visible, 80) }}>
          {INDUSTRIES.map((ind) => {
            const isActive = active?.key === ind.key;
            return (
              <button key={ind.key} onClick={() => setSelected(isActive ? null : ind)}
                style={{
                  display: "inline-flex", alignItems: "center", gap: 8,
                  height: m ? 40 : 44, padding: m ? "0 14px" : "0 20px",
                  borderRadius: 100,
                  backgroundColor: isActive ? C.navy : "transparent",
                  border: isActive ? "1.5px solid transparent" : `1.5px solid rgba(14,26,43,0.10)`,
                  fontSize: m ? 13 : 14, fontWeight: isActive ? 600 : 500,
                  color: isActive ? "#fff" : C.textSecondary,
                  cursor: "pointer",
                  transition: "all 200ms cubic-bezier(0.22, 1, 0.36, 1)",
                }}
                onMouseEnter={e => { if (!isActive) { e.currentTarget.style.backgroundColor = "rgba(14,26,43,0.04)"; e.currentTarget.style.borderColor = "rgba(14,26,43,0.18)"; } }}
                onMouseLeave={e => { if (!isActive) { e.currentTarget.style.backgroundColor = "transparent"; e.currentTarget.style.borderColor = "rgba(14,26,43,0.10)"; } }}>
                {ind.name}
              </button>
            );
          })}
        </div>

        {/* Elevated reveal card */}
        {active && (
          <div style={{
            maxWidth: 680, margin: "0 auto",
            borderRadius: 24,
            backgroundColor: C.navy,
            boxShadow: "0 16px 56px rgba(14,26,43,0.18), 0 4px 16px rgba(14,26,43,0.08)",
            position: "relative" as const, overflow: "hidden",
          }}>
            {/* Gradient accent top */}
            <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 3, background: `linear-gradient(90deg, ${C.teal}, ${C.purple})` }} />

            <div style={{ padding: m ? "32px 24px" : "44px 48px" }}>
              {/* Industry name + badge */}
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 24 }}>
                <div>
                  <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.10em", color: C.teal, marginBottom: 8 }}>INDUSTRY PROFILE</div>
                  <div style={{ fontSize: m ? 22 : 28, fontWeight: 700, color: C.sandText, letterSpacing: "-0.02em" }}>{active.name}</div>
                </div>
                <div style={{ padding: "6px 14px", borderRadius: 100, backgroundColor: "rgba(31,109,122,0.12)", flexShrink: 0 }}>
                  <span style={{ fontSize: 12, fontWeight: 600, color: C.teal }}>Calibrated</span>
                </div>
              </div>

              {/* Constraint — the headline */}
              <div style={{ padding: m ? "18px 20px" : "22px 28px", borderRadius: 16, backgroundColor: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.06)", marginBottom: 20 }}>
                <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.10em", color: "rgba(244,241,234,0.35)", marginBottom: 8 }}>THE STRUCTURAL RISK</div>
                <div style={{ fontSize: m ? 17 : 20, fontWeight: 600, color: C.sandText, lineHeight: 1.35 }}>{active.constraint}</div>
              </div>

              {/* Description */}
              <p style={{ fontSize: m ? 15 : 16, color: "rgba(244,241,234,0.55)", lineHeight: 1.7, margin: "0 0 28px" }}>{active.desc}</p>

              {/* CTA */}
              <Link href="/begin" style={{
                display: "inline-flex", alignItems: "center", justifyContent: "center",
                height: 52, padding: "0 32px", borderRadius: 14, width: m ? "100%" : "auto",
                backgroundColor: C.teal, color: "#fff",
                fontSize: 15, fontWeight: 600, textDecoration: "none",
                boxShadow: "0 8px 24px rgba(31,109,122,0.25)",
                transition: "transform 200ms, box-shadow 200ms",
              }}
                onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = "0 12px 32px rgba(31,109,122,0.35)"; }}
                onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "0 8px 24px rgba(31,109,122,0.25)"; }}
              >
                Get your {active.name.toLowerCase().split(" /")[0]} income score
              </Link>
            </div>
          </div>
        )}
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
  const t = useTablet();
  const fadeIn = useFadeIn();

  const items = [
    { num: "01", question: "How much of your income renews automatically?", why: "A general sense is all you need" },
    { num: "02", question: "How spread out is your income across sources?", why: "Think sources, not exact amounts" },
    { num: "03", question: "How far ahead is your income already committed?", why: "A rough timeframe works" },
    { num: "04", question: "How consistent is your monthly income?", why: "Your best guess is enough" },
  ];

  return (
    <section ref={ref} style={{ backgroundColor: C.sand, paddingTop: m ? 72 : 120, paddingBottom: m ? 72 : 120, paddingLeft: sectionPx(m, t), paddingRight: sectionPx(m, t) }}>
      <div style={{ maxWidth: 860, margin: "0 auto" }}>
        <div style={{ display: m ? "block" : "grid", gridTemplateColumns: "1fr 1.1fr", gap: 64, alignItems: "start" }}>

          {/* Left — copy */}
          <div style={{ marginBottom: m ? 40 : 0, ...fadeIn(visible) }}>
            <div style={{ fontSize: m ? 13 : 14, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase" as const, color: C.teal, marginBottom: 16 }}>READY IN 2 MINUTES</div>
            <h2 style={{ fontSize: m ? 28 : 36, fontWeight: 600, lineHeight: 1.12, letterSpacing: "-0.028em", color: C.navy, marginBottom: 20 }}>
              No documents.{m ? " " : <br />}No bank connection.{m ? " " : <br />}No account needed.
            </h2>
            <p style={{ fontSize: m ? 16 : 17, fontWeight: 400, lineHeight: 1.6, color: C.textSecondary, marginBottom: 28 }}>
              Under two minutes. The system needs general knowledge of your income structure&mdash;not access to your finances.
            </p>
            <div style={{ padding: m ? "18px 20px" : "20px 24px", borderRadius: 16, backgroundColor: C.white, border: "1px solid rgba(14,26,43,0.06)" }}>
              <div style={{ fontSize: 13, fontWeight: 600, color: C.navy, marginBottom: 6 }}>You don&rsquo;t need exact numbers.</div>
              <p style={{ fontSize: 14, color: C.textSecondary, lineHeight: 1.6, margin: 0 }}>
                Close enough is good enough. The system is built to work with&nbsp;estimates.
              </p>
            </div>
          </div>

          {/* Right — question cards */}
          <div style={{ display: "flex", flexDirection: "column" as const, gap: 0, ...fadeIn(visible, 120) }}>
            {items.map((item, i) => (
              <div key={i} style={{
                display: "flex", gap: m ? 16 : 20, padding: m ? "20px 0" : "24px 0",
                borderBottom: i < items.length - 1 ? "1px solid rgba(14,26,43,0.06)" : "none",
              }}>
                <div style={{
                  width: 36, height: 36, borderRadius: 10, flexShrink: 0,
                  backgroundColor: C.navy, color: "#fff",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: 12, fontWeight: 700, fontFamily: mono,
                }}>
                  {item.num}
                </div>
                <div>
                  <div style={{ fontSize: m ? 15 : 16, fontWeight: 600, color: C.navy, lineHeight: 1.4, marginBottom: 4 }}>{item.question}</div>
                  <div style={{ fontSize: 13, color: C.textMuted, lineHeight: 1.5 }}>{item.why}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}


/* ================================================================ */
/* SECTION 11B — STRUCTURAL INCOME BRIEF (Email Capture)             */
/* ================================================================ */

function StructuralIncomeBrief() {
  const { ref, visible } = useInView();
  const m = useMobile();
  const t = useTablet();
  const fadeIn = useFadeIn();

  return (
    <section ref={ref} style={{ backgroundColor: C.navy, paddingTop: m ? 72 : 120, paddingBottom: m ? 72 : 120, paddingLeft: sectionPx(m, t), paddingRight: sectionPx(m, t), position: "relative" as const, overflow: "hidden" }}>
      {/* Subtle grain */}
      <div className="navy-grain" />

      <div style={{ maxWidth: explanatoryW, margin: "0 auto", textAlign: "center", position: "relative", zIndex: 1 }}>
        <div style={{ fontSize: m ? 13 : 14, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase" as const, color: C.teal, marginBottom: 16, ...fadeIn(visible) }}>
          THE STRUCTURAL INCOME BRIEF
        </div>
        <h2 style={{ fontSize: m ? 28 : 40, fontWeight: 600, lineHeight: 1.12, letterSpacing: "-0.028em", color: C.sandText, marginBottom: 16, ...fadeIn(visible, 60) }}>
          Know what&rsquo;s shifting before{m ? " " : <br />}it hits your income.
        </h2>
        <p style={{ fontSize: m ? 16 : 18, fontWeight: 400, lineHeight: 1.6, color: C.sandMuted, marginBottom: m ? 28 : 36, maxWidth: 520, marginLeft: "auto", marginRight: "auto", ...fadeIn(visible, 120) }}>
          One email per month. Industry-specific income patterns, structural risks most people miss, and the data behind&nbsp;them.
        </p>

        {/* Sample brief preview */}
        <div style={{
          maxWidth: 480, margin: "0 auto", marginBottom: m ? 28 : 36,
          padding: m ? "16px 18px" : "18px 24px",
          borderRadius: 14,
          backgroundColor: "rgba(255,255,255,0.03)",
          border: "1px solid rgba(255,255,255,0.06)",
          textAlign: "left" as const,
          ...fadeIn(visible, 150),
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
            <div style={{ width: 6, height: 6, borderRadius: "50%", backgroundColor: C.teal }} />
            <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.10em", color: "rgba(244,241,234,0.35)" }}>RECENT BRIEF</span>
          </div>
          <p style={{ fontSize: m ? 14 : 15, fontWeight: 500, color: C.sandText, lineHeight: 1.45, margin: 0 }}>
            Why 62% of consulting income is structurally unprotected&mdash;and the three patterns that separate stable from&nbsp;fragile.
          </p>
        </div>

        <div style={{ display: "flex", justifyContent: "center", ...fadeIn(visible, 180) }}>
          <EmailCapture variant="standalone" source="homepage_brief_section" />
        </div>
        <p style={{ fontSize: 13, color: C.sandLight, marginTop: 20, ...fadeIn(visible, 240) }}>
          Unsubscribe anytime. We respect your privacy.
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
  const t = useTablet();
  const fadeIn = useFadeIn();

  return (
    <section ref={ref} style={{ backgroundColor: C.navy, paddingTop: m ? 88 : 128, paddingBottom: m ? 88 : 128, paddingLeft: sectionPx(m, t), paddingRight: sectionPx(m, t), position: "relative" as const, overflow: "hidden" }}>
      <div className="navy-grain" />
      <div style={{ maxWidth: explanatoryW, margin: "0 auto", textAlign: "center", position: "relative", zIndex: 1 }}>
        <h2 style={{ fontSize: m ? 28 : 52, fontWeight: 700, lineHeight: 1.08, letterSpacing: "-0.035em", color: C.sandText, marginBottom: 20, ...fadeIn(visible) }}>
          Your income has a structure.{m ? " " : <br />}See&nbsp;yours.
        </h2>
        <div style={{ display: "flex", flexDirection: "column" as const, alignItems: "center", ...fadeIn(visible, 160) }}>
          <CtaButton m={m} variant="light" />
          <p style={{ fontSize: 14, fontWeight: 500, lineHeight: 1.45, color: C.sandLight, marginTop: 16, textAlign: "center" }}>
            $69 &middot; Score, scripts, roadmap, and lifetime access
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
        <WhatYouReceive />
        <UseCaseArchitecture />
        <IndustryProfiles />
        <BeforeYouBegin />
        <StructuralIncomeBrief />
        <FinalCta />
      </main>
    </div>
  );
}
