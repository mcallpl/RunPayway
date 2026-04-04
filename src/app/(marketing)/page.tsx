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

const C = { navy: "#0E1A2B", purple: "#4B3FAE", teal: "#1F6D7A", sand: "#F4F1EA", white: "#FFFFFF", border: "#E5E7EB" };
const mono = '"SF Mono", "Fira Code", "IBM Plex Mono", "Courier New", monospace';
const muted = "rgba(14,26,43,0.55)";
const light = "rgba(14,26,43,0.38)";
const contentW = 1040;
const secPad = (m: boolean) => m ? 56 : 112;
const px = (m: boolean) => m ? 20 : 24;
const STRIPE = process.env.NEXT_PUBLIC_STRIPE_CHECKOUT_URL || "https://buy.stripe.com/9B66oz48EaYU2lc4IF2Nq05";

/* Score Ring SVG — reusable instrument component */
function ScoreRing({ score, size, stroke = 8, color }: { score: number; size: number; stroke?: number; color: string }) {
  const r = (size - stroke) / 2;
  const circ = 2 * Math.PI * r;
  const offset = circ - (score / 100) * circ;
  return (
    <svg width={size} height={size} style={{ transform: "rotate(-90deg)" }}>
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="rgba(14,26,43,0.06)" strokeWidth={stroke} />
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={color} strokeWidth={stroke}
        strokeDasharray={circ} strokeDashoffset={offset} strokeLinecap="round"
        style={{ transition: "stroke-dashoffset 1.2s cubic-bezier(0.22, 1, 0.36, 1)" }} />
    </svg>
  );
}

/* ================================================================== */
/* INDUSTRY DATA                                                       */
/* ================================================================== */

const INDUSTRIES = [
  { name: "Real Estate", headline: "Your income is earned in lumps. Your risk is carried in between.", problem: "A strong year can still rest on a narrow set of closings, a few delayed deals, and a pipeline that looks fuller than it is.\n\nWhen listings stall, buyers hesitate, or one transaction falls apart, earnings do not fade evenly. They drop in gaps.\n\nRunPayway\u2122 evaluates deal concentration, pipeline continuity, and how much of your structure depends on timing going right.", cta: "Stress-test my income structure" },
  { name: "Consulting / Professional Services", headline: "Your revenue may look diversified. Your continuity may not be.", problem: "Many firms and solo operators serve multiple clients, but most earnings still depend on active delivery, retained attention, and continued utilization.\n\nWhen a client leaves or workload softens, revenue rarely has a built-in floor. It resets around available work.\n\nRunPayway\u2122 evaluates client concentration, dependence on active labor, and how much of your structure continues when delivery slows.", cta: "Measure my income stability" },
  { name: "Sales / Brokerage", headline: "Your compensation moves in cycles. Your exposure sits between them.", problem: "A healthy quarter can hide how much depends on timing, a few large wins, or a pipeline that has not converted yet.\n\nWhen deal flow slips or closings move out, earnings do not taper. They compress.\n\nRunPayway\u2122 evaluates pipeline dependence, concentration by opportunity size, and how vulnerable your structure is to timing shifts.", cta: "Stress-test my income structure" },
  { name: "Technology", headline: "High earnings can hide a narrow structure.", problem: "Many professionals in technology rely heavily on one employer, one equity story, one bonus framework, or one compensation system.\n\nWhen that source changes, a large share of earnings can shift all at once.\n\nRunPayway\u2122 evaluates source concentration, continuity, and how much of your structure depends on one system continuing to perform.", cta: "Measure my income stability" },
  { name: "Finance / Banking", headline: "A stable base can hide a variable structure.", problem: "Many compensation packages combine salary with bonus, production, deal flow, or performance-linked earnings that do not behave the same under pressure.\n\nWhen targets move, markets soften, or activity slows, a meaningful portion of pay can weaken faster than expected.\n\nRunPayway\u2122 evaluates fixed versus performance-dependent earnings and how much of your structure relies on continued output.", cta: "Stress-test my income structure" },
  { name: "Healthcare", headline: "Your earnings may be steady, but the structure can still be narrow.", problem: "Many healthcare professionals rely on one employer, one system, or one reimbursement environment, even when pay appears consistent.\n\nWhen compensation models shift, hours change, or the primary source is disrupted, flexibility can be limited.\n\nRunPayway\u2122 evaluates source concentration, continuity, and how resilient your structure is when a stable system changes.", cta: "Measure my income stability" },
  { name: "Insurance", headline: "Your structure may look balanced while one side quietly carries the risk.", problem: "New production creates immediate earnings. Renewals create continuity. The mix between them determines whether the structure is compounding or constantly restarting.\n\nWhen new business slows, future weakness begins early. When retention slips, recurring income erodes underneath you.\n\nRunPayway\u2122 evaluates the balance between production and persistence, and how exposed your structure is if either side weakens.", cta: "Stress-test my income structure" },
  { name: "Legal Services", headline: "Your income may be active, concentrated, and slower to reveal its risk.", problem: "A practice can look healthy while a small number of matters, clients, or billable patterns are carrying most of the load.\n\nWhen case flow softens or a major matter concludes, the weakness is often felt after the fact.\n\nRunPayway\u2122 evaluates client concentration, forward visibility, and how dependent earnings are on ongoing active work.", cta: "Measure my income stability" },
  { name: "Construction / Trades", headline: "Your revenue depends on work staying in motion.", problem: "Project-based income often looks solid while jobs are active, even when the next phase of work is not fully secured.\n\nWhen a start date moves, a bid is lost, or collections slow, the gap shows up immediately.\n\nRunPayway\u2122 evaluates project continuity, timing exposure, and how much of your structure depends on the next job arriving on schedule.", cta: "Measure my income stability" },
  { name: "Media / Entertainment", headline: "Your earnings are often tied to opportunities, not continuity.", problem: "Projects, bookings, contracts, and appearances can create strong periods of income without creating a stable underlying structure.\n\nWhen one project ends or the next opportunity is delayed, there is usually no built-in carry.\n\nRunPayway\u2122 evaluates how much of your structure depends on episodic work and how much continues between engagements.", cta: "Run my structural assessment" },
  { name: "Education", headline: "Your income may be predictable, but still structurally limited.", problem: "Many education roles are tied to one institution, one pay model, and one fixed system with limited ability to expand or replace earnings quickly.\n\nWhen funding, staffing, or contract conditions change, the structure may offer little flexibility in response.\n\nRunPayway\u2122 evaluates concentration, continuity, and how adaptable your earnings structure is under change.", cta: "Measure my income stability" },
  { name: "Retail / E-Commerce", headline: "Sales can stay active while stability weakens underneath them.", problem: "Revenue may depend on traffic, conversion, platform conditions, repeat demand, and margin discipline all holding at once.\n\nWhen demand softens or costs rise, the structure can tighten quickly even before revenue fully shows the damage.\n\nRunPayway\u2122 evaluates demand sensitivity, revenue continuity, and how exposed your structure is to external shifts you do not control.", cta: "Run my structural assessment" },
  { name: "Hospitality / Food Service", headline: "Your structure depends on volume showing up on time.", problem: "Revenue is often tied to traffic, seasonality, labor efficiency, and thin margins that leave little room for interruption.\n\nWhen customer flow drops or costs move against you, the pressure is immediate.\n\nRunPayway\u2122 evaluates volume sensitivity, timing exposure, and how stable the business remains when demand is uneven.", cta: "Measure my income stability" },
  { name: "Transportation / Logistics", headline: "Your earnings depend on flow staying uninterrupted.", problem: "Routes, contracts, shipment volume, and operational consistency often determine whether revenue holds or slips.\n\nWhen demand weakens, a contract changes, or volume drops, earnings can fall with little structural buffer.\n\nRunPayway\u2122 evaluates demand dependence, timing continuity, and how much of your structure relies on uninterrupted movement.", cta: "Stress-test my income structure" },
  { name: "Agriculture", headline: "Your structure is seasonal, variable, and exposed to forces outside your control.", problem: "Strong periods of production can mask how much depends on timing, yield, pricing, and conditions that do not move in your favor on command.\n\nWhen one cycle underperforms, the effect is not minor. It can reset the economics of the entire period.\n\nRunPayway\u2122 evaluates seasonal concentration, continuity across cycles, and how exposed your structure is when one variable moves against you.", cta: "Run my structural assessment" },
  { name: "Energy / Utilities", headline: "Your income may look stable because the system around it looks stable.", problem: "Many roles in this sector depend on regulatory conditions, capital cycles, infrastructure decisions, or market structures outside individual control.\n\nWhen those conditions shift, the structure changes first and the impact follows.\n\nRunPayway\u2122 evaluates external dependency, concentration, and how resilient your earnings structure is under system-level change.", cta: "Measure my income stability" },
  { name: "Manufacturing", headline: "Your structure depends on output, demand, and timing staying aligned.", problem: "Revenue can look dependable while production schedules, supply conditions, and customer demand are carrying more of the risk than the numbers suggest.\n\nWhen output slows or demand shifts, earnings weaken while operating burden often stays behind.\n\nRunPayway\u2122 evaluates production dependence, demand sensitivity, and how exposed your structure is when alignment breaks.", cta: "Run my structural assessment" },
  { name: "Nonprofit / Public Sector", headline: "Your income may be stable, but the structure is often constrained.", problem: "Funding cycles, budget decisions, grant allocations, and institutional limits can create predictable pay with limited control or flexibility.\n\nWhen funding priorities shift, the structure may have very little room to adapt quickly.\n\nRunPayway\u2122 evaluates concentration, institutional dependence, and how resilient your earnings structure is under budget or funding change.", cta: "Measure my income stability" },
  { name: "Other", headline: "Your structure may not fit a standard category. That does not reduce the risk.", problem: "Mixed earnings, irregular timing, and multiple income types can create a structure that looks diversified while hiding weak points underneath.\n\nWhen one source slips or timing breaks, the interaction between sources can create pressure faster than expected.\n\nRunPayway\u2122 evaluates how your specific mix behaves under stress and where the structure is most exposed.", cta: "Run my structural assessment" },
];

function IndustryModal({ industry, onClose, m }: { industry: typeof INDUSTRIES[0]; onClose: () => void; m: boolean }) {
  useEffect(() => { const h = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); }; document.addEventListener("keydown", h); return () => document.removeEventListener("keydown", h); }, [onClose]);
  return (
    <div role="dialog" aria-modal="true" onClick={onClose} style={{ position: "fixed", inset: 0, zIndex: 9999, backgroundColor: "rgba(0,0,0,0.75)", backdropFilter: "blur(12px)", display: "flex", alignItems: "center", justifyContent: "center", padding: m ? 20 : 40 }}>
      <div onClick={e => e.stopPropagation()} style={{ position: "relative", maxWidth: 520, width: "100%", backgroundColor: C.white, borderRadius: 16, padding: m ? "40px 24px 32px" : "48px 40px 40px", boxShadow: "0 24px 80px rgba(0,0,0,0.25)" }}>
        <button onClick={onClose} aria-label="Close" style={{ position: "absolute", top: 16, right: 16, width: 44, height: 44, borderRadius: 8, border: `1px solid ${C.border}`, backgroundColor: "transparent", color: muted, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", padding: 0 }}>
          <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><line x1="4" y1="4" x2="12" y2="12" /><line x1="12" y1="4" x2="4" y2="12" /></svg>
        </button>
        <div style={{ fontSize: 11, fontWeight: 500, letterSpacing: "0.12em", textTransform: "uppercase" as const, color: C.teal, marginBottom: 12 }}>{industry.name}</div>
        <h3 style={{ fontSize: m ? 20 : 24, fontWeight: 600, lineHeight: 1.3, color: C.navy, marginBottom: 24 }}>{industry.headline}</h3>
        {industry.problem.split("\n\n").map((p, i) => (<p key={i} style={{ fontSize: 16, color: muted, lineHeight: 1.65, marginBottom: 16 }}>{p}</p>))}
        <div style={{ borderTop: `1px solid ${C.border}`, paddingTop: 24, marginTop: 24 }}>
          <Link href="/pricing" onClick={onClose} style={{ display: "flex", alignItems: "center", justifyContent: "center", height: 52, borderRadius: 10, backgroundColor: C.navy, color: C.white, fontSize: 16, fontWeight: 600, textDecoration: "none" }}>{industry.cta}</Link>
        </div>
      </div>
    </div>
  );
}


/* ================================================================== */
/* SECTION 1 — HERO                                                    */
/* ================================================================== */

function HeroSection() {
  const { ref, visible } = useInView();
  const m = useMobile();
  const fadeIn = useFadeIn();
  const animatedScore = useAnimatedCounter(72, visible, 1800);
  const [showLabel, setShowLabel] = useState(false);
  useEffect(() => { if (!visible) return; const t = setTimeout(() => setShowLabel(true), 1900); return () => clearTimeout(t); }, [visible]);

  const dims = [
    { label: "Recurrence", value: 65, color: C.teal },
    { label: "Concentration", value: 40, color: "#C0392B" },
    { label: "Diversification", value: 70, color: C.teal },
    { label: "Visibility", value: 55, color: "#B58900" },
    { label: "Consistency", value: 80, color: C.teal },
    { label: "Independence", value: 45, color: "#B58900" },
  ];

  return (
    <header ref={ref} style={{ backgroundColor: C.navy, position: "relative", overflow: "hidden" }}>
      {/* Subtle radial glow */}
      <div style={{ position: "absolute", top: "-20%", right: "-10%", width: 800, height: 800, borderRadius: "50%", background: `radial-gradient(circle, ${C.purple}08 0%, transparent 70%)`, pointerEvents: "none" }} />
      <div style={{ position: "absolute", bottom: "-30%", left: "-15%", width: 600, height: 600, borderRadius: "50%", background: `radial-gradient(circle, ${C.teal}06 0%, transparent 70%)`, pointerEvents: "none" }} />

      <div style={{ maxWidth: contentW, margin: "0 auto", paddingTop: m ? 80 : 140, paddingBottom: m ? 56 : 100, paddingLeft: px(m), paddingRight: px(m), position: "relative", zIndex: 1 }}>
        <div style={{ display: m ? "block" : "flex", alignItems: "center", justifyContent: "space-between", gap: 80 }}>
          {/* Left — copy */}
          <div style={{ maxWidth: 520, textAlign: m ? "center" : "left" }}>
            <div style={{ fontSize: 11, fontWeight: 500, letterSpacing: "0.14em", textTransform: "uppercase" as const, color: C.teal, marginBottom: 20, ...fadeIn(visible) }}>
              Income Stability Score&#8482;
            </div>
            <h1 style={{ fontSize: m ? 38 : 56, fontWeight: 600, lineHeight: 1.08, letterSpacing: "-0.03em", color: "#F4F1EA", marginBottom: 24, ...fadeIn(visible, 80) }}>
              Your income might be strong.{m ? " " : <br />}Your structure might not.
            </h1>
            <p style={{ fontSize: 17, color: "rgba(244,241,234,0.50)", lineHeight: 1.65, maxWidth: m ? undefined : 440, marginBottom: 16, ...fadeIn(visible, 160) }}>
              Most people never measure how stable their income actually is — until something breaks it.
            </p>
            <p style={{ fontSize: 17, fontWeight: 500, color: "rgba(244,241,234,0.72)", lineHeight: 1.5, maxWidth: m ? undefined : 440, marginBottom: 16, ...fadeIn(visible, 220) }}>
              Your income already has a structure.{m ? " " : <br />}You just don&#8217;t see how exposed it is yet.
            </p>
            <p style={{ fontSize: 16, color: "rgba(244,241,234,0.42)", lineHeight: 1.65, maxWidth: m ? undefined : 440, marginBottom: m ? 36 : 44, ...fadeIn(visible, 280) }}>
              RunPayway&#8482; measures the structure of your income — not the size of it — and shows how it holds under pressure.
            </p>
            <div style={{ ...fadeIn(visible, 340) }}>
              <Link href="/pricing" style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", height: 56, width: m ? "100%" : "auto", padding: m ? "0 24px" : "0 44px", borderRadius: 12, backgroundColor: C.white, color: C.navy, fontSize: m ? 15 : 16, fontWeight: 600, textDecoration: "none", transition: "background-color 200ms, box-shadow 200ms", boxShadow: "0 2px 12px rgba(244,241,234,0.10)" }}
                onMouseEnter={e => { e.currentTarget.style.backgroundColor = "#E8E5DE"; e.currentTarget.style.boxShadow = "0 4px 20px rgba(244,241,234,0.15)"; }}
                onMouseLeave={e => { e.currentTarget.style.backgroundColor = C.white; e.currentTarget.style.boxShadow = "0 2px 12px rgba(244,241,234,0.10)"; }}>
                Get My Income Stability Score
              </Link>
              <p style={{ fontSize: 13, color: "rgba(244,241,234,0.32)", marginTop: 16, letterSpacing: "0.03em" }}>Under 2 minutes &bull; Instant result &bull; Private by default</p>
            </div>
          </div>

          {/* Right — Instrument Card */}
          <div style={{ flexShrink: 0, marginTop: m ? 48 : 0, ...fadeIn(visible, 400) }}>
            <div style={{ backgroundColor: "rgba(255,255,255,0.03)", borderRadius: 20, padding: 3, border: "1px solid rgba(244,241,234,0.06)" }}>
              <div style={{ backgroundColor: C.white, borderRadius: 17, padding: m ? 28 : 36, maxWidth: m ? "100%" : 340, margin: m ? "0 auto" : undefined, position: "relative" }}>
                {/* Header */}
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
                  <div style={{ fontSize: 10, fontWeight: 600, letterSpacing: "0.12em", textTransform: "uppercase" as const, color: light }}>Income Stability Score</div>
                  <div style={{ fontSize: 9, fontWeight: 500, letterSpacing: "0.08em", color: C.teal, padding: "3px 8px", borderRadius: 4, backgroundColor: `${C.teal}08` }}>RP-2.0</div>
                </div>

                {/* Score Ring */}
                <div style={{ position: "relative", width: m ? 140 : 160, height: m ? 140 : 160, margin: "0 auto 20px" }}>
                  <ScoreRing score={animatedScore} size={m ? 140 : 160} stroke={10} color="#2B5EA7" />
                  <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
                    <span style={{ fontSize: m ? 40 : 48, fontWeight: 300, fontFamily: mono, color: C.navy, lineHeight: 1, letterSpacing: "-0.04em", opacity: showLabel ? 1 : 0, transition: "opacity 500ms ease-out" }}>{animatedScore}</span>
                    <span style={{ fontSize: 12, color: light, marginTop: 2, opacity: showLabel ? 1 : 0, transition: "opacity 500ms ease-out 100ms" }}>/100</span>
                  </div>
                </div>

                {/* Band */}
                <div style={{ display: "flex", justifyContent: "center", marginBottom: 20, opacity: showLabel ? 1 : 0, transition: "opacity 500ms ease-out 200ms" }}>
                  <div style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "5px 14px", borderRadius: 100, backgroundColor: "rgba(43,94,167,0.06)", border: "1px solid rgba(43,94,167,0.10)" }}>
                    <div style={{ width: 6, height: 6, borderRadius: 2, backgroundColor: "#2B5EA7" }} />
                    <span style={{ fontSize: 11, fontWeight: 600, color: "#2B5EA7", letterSpacing: "0.02em" }}>Established Stability</span>
                  </div>
                </div>

                {/* Dimension bars */}
                <div style={{ borderTop: `1px solid rgba(14,26,43,0.05)`, paddingTop: 16, opacity: showLabel ? 1 : 0, transition: "opacity 600ms ease-out 400ms" }}>
                  {dims.map((d, i) => (
                    <div key={i} style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: i < dims.length - 1 ? 8 : 0 }}>
                      <span style={{ fontSize: 10, fontWeight: 500, color: light, width: 72, flexShrink: 0, letterSpacing: "0.01em" }}>{d.label}</span>
                      <div style={{ flex: 1, height: 4, borderRadius: 2, backgroundColor: "rgba(14,26,43,0.04)", overflow: "hidden" }}>
                        <div style={{ height: "100%", borderRadius: 2, backgroundColor: d.color, width: `${d.value}%`, transition: "width 1s cubic-bezier(0.22, 1, 0.36, 1)" }} />
                      </div>
                    </div>
                  ))}
                </div>

                {/* Constraint indicator */}
                <div style={{ marginTop: 16, padding: "8px 12px", borderRadius: 6, backgroundColor: "rgba(192,57,43,0.04)", border: "1px solid rgba(192,57,43,0.08)", opacity: showLabel ? 1 : 0, transition: "opacity 600ms ease-out 600ms" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                    <div style={{ width: 4, height: 4, borderRadius: 1, backgroundColor: "#C0392B" }} />
                    <span style={{ fontSize: 10, fontWeight: 500, color: "#C0392B", letterSpacing: "0.02em" }}>Constraint: Income concentration</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Trust strip */}
        <div style={{ marginTop: m ? 48 : 72, paddingTop: m ? 28 : 36, borderTop: "1px solid rgba(244,241,234,0.06)", ...fadeIn(visible, 500) }}>
          <p style={{ fontSize: 12, letterSpacing: "0.04em", color: "rgba(244,241,234,0.25)", textAlign: m ? "center" : "left" }}>
            Model RP-2.0 &bull; Version-locked &bull; Deterministic output &bull; Same inputs &rarr; same score &bull; No bank connection &bull; No credit pull
          </p>
        </div>
      </div>
    </header>
  );
}


/* ================================================================== */
/* SECTION 2 — INDUSTRY SIGNAL                                         */
/* ================================================================== */

function IndustrySignal() {
  const { ref, visible } = useInView();
  const m = useMobile();
  const fadeIn = useFadeIn();
  const [selectedIndustry, setSelectedIndustry] = useState<typeof INDUSTRIES[0] | null>(null);
  const [showAll, setShowAll] = useState(false);
  const dropRef = useRef<HTMLDivElement>(null);
  useEffect(() => { if (!showAll) return; const h = (e: MouseEvent) => { if (dropRef.current && !dropRef.current.contains(e.target as Node)) setShowAll(false); }; document.addEventListener("mousedown", h); return () => document.removeEventListener("mousedown", h); }, [showAll]);

  return (
    <section ref={ref} style={{ backgroundColor: C.navy, paddingTop: m ? 36 : 56, paddingBottom: m ? 36 : 56, paddingLeft: px(m), paddingRight: px(m), borderTop: "1px solid rgba(244,241,234,0.04)" }}>
      <div style={{ maxWidth: contentW, margin: "0 auto", ...fadeIn(visible) }}>
        <div style={{ display: "grid", gridTemplateColumns: m ? "1fr 1fr" : "1fr 1fr 1fr 1fr", gap: m ? 10 : 14, marginBottom: m ? 16 : 20 }}>
          {[
            { name: "Freelancers", line: "Every month resets unless structure prevents it." },
            { name: "Contractors", line: "Strong projects hide instability between them." },
            { name: "Business Owners", line: "Revenue can grow while structure weakens underneath." },
            { name: "Commission Earners", line: "Income cycles. Exposure sits between them." },
          ].map((ind, i) => (
            <div key={i} style={{ padding: m ? "14px 16px" : "18px 20px", borderRadius: 12, border: "1px solid rgba(244,241,234,0.08)", backgroundColor: "rgba(244,241,234,0.03)" }}>
              <div style={{ fontSize: 12, fontWeight: 600, color: "rgba(244,241,234,0.65)", marginBottom: 6, letterSpacing: "0.01em" }}>{ind.name}</div>
              <div style={{ fontSize: 13, color: "rgba(244,241,234,0.35)", lineHeight: 1.5 }}>{ind.line}</div>
            </div>
          ))}
        </div>
        <div ref={dropRef} style={{ position: "relative", display: "inline-block" }}>
          <button onClick={() => setShowAll(!showAll)} style={{ display: "inline-flex", alignItems: "center", gap: 6, background: "none", border: "none", cursor: "pointer", padding: "6px 0", fontSize: 13, fontWeight: 500, color: "rgba(244,241,234,0.35)", transition: "color 200ms" }}
            onMouseEnter={e => { e.currentTarget.style.color = "rgba(244,241,234,0.60)"; }}
            onMouseLeave={e => { e.currentTarget.style.color = "rgba(244,241,234,0.35)"; }}>
            Explore all 19 industries
            <svg width="10" height="10" viewBox="0 0 12 12" fill="none" style={{ transform: showAll ? "rotate(180deg)" : "rotate(0deg)", transition: "transform 200ms" }}><path d="M3 4.5L6 7.5L9 4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
          </button>
          {showAll && (
            <div style={{ position: "absolute", bottom: "calc(100% + 8px)", left: 0, minWidth: m ? "calc(100vw - 40px)" : 340, maxHeight: 420, overflowY: "auto", backgroundColor: "#0A0F1A", border: "1px solid rgba(255,255,255,0.10)", borderRadius: 14, padding: "8px 0", zIndex: 9000, boxShadow: "0 -12px 60px rgba(0,0,0,0.50)" }}>
              {INDUSTRIES.map(ind => (
                <button key={ind.name} onClick={() => { setSelectedIndustry(ind); setShowAll(false); }}
                  style={{ display: "block", width: "100%", textAlign: "left", padding: "12px 22px", background: "none", border: "none", cursor: "pointer", fontSize: 15, fontWeight: 500, color: "rgba(244,241,234,0.75)", transition: "background 150ms, color 150ms", minHeight: 44 }}
                  onMouseEnter={e => { e.currentTarget.style.backgroundColor = "rgba(255,255,255,0.06)"; e.currentTarget.style.color = "#F4F1EA"; }}
                  onMouseLeave={e => { e.currentTarget.style.backgroundColor = "transparent"; e.currentTarget.style.color = "rgba(244,241,234,0.75)"; }}>
                  {ind.name}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
      {selectedIndustry && <IndustryModal industry={selectedIndustry} onClose={() => setSelectedIndustry(null)} m={m} />}
    </section>
  );
}


/* ================================================================== */
/* SECTION 3 — SAME INCOME PROOF                                       */
/* ================================================================== */

function SameIncomeProof() {
  const { ref, visible } = useInView();
  const m = useMobile();
  const fadeIn = useFadeIn();
  return (
    <section ref={ref} style={{ backgroundColor: C.white, paddingTop: secPad(m), paddingBottom: secPad(m), paddingLeft: px(m), paddingRight: px(m) }}>
      <div style={{ maxWidth: contentW, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: m ? 36 : 56, ...fadeIn(visible) }}>
          <div style={{ fontSize: 11, fontWeight: 500, letterSpacing: "0.12em", textTransform: "uppercase" as const, color: C.teal, marginBottom: 16 }}>The core problem</div>
          <h2 style={{ fontSize: m ? 30 : 40, fontWeight: 600, lineHeight: 1.15, letterSpacing: "-0.02em", color: C.navy, marginBottom: 14 }}>Same income. Different stability.</h2>
          <p style={{ fontSize: 17, color: muted }}>Same income does not mean equal stability.</p>
        </div>
        <div style={{ display: m ? "block" : "grid", gridTemplateColumns: "1fr 1fr", gap: 24, maxWidth: 880, margin: "0 auto", ...fadeIn(visible, 120) }}>
          {/* Person A */}
          <div style={{ backgroundColor: C.white, borderRadius: 16, padding: m ? 28 : 36, border: `1px solid ${C.border}`, marginBottom: m ? 16 : 0, position: "relative" as const, overflow: "hidden" }}>
            <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 3, backgroundColor: "rgba(155,44,44,0.20)" }} />
            <div style={{ fontSize: 13, fontWeight: 500, color: light, marginBottom: 12 }}>$150K / year</div>
            <div style={{ display: "flex", flexDirection: "column" as const, gap: 10, marginBottom: 28 }}>
              {["1 client = 80% of income", "No forward contracts", "Income stops if work stops"].map((t, i) => (
                <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 10 }}><span style={{ width: 5, height: 5, borderRadius: "50%", backgroundColor: "#C0392B", flexShrink: 0, marginTop: 7 }} /><span style={{ fontSize: 15, color: muted, lineHeight: 1.55 }}>{t}</span></div>
              ))}
            </div>
            <div style={{ borderTop: `1px solid rgba(14,26,43,0.05)`, paddingTop: 24, display: "flex", alignItems: "center", gap: 16 }}>
              <div style={{ position: "relative", width: 56, height: 56, flexShrink: 0 }}>
                <ScoreRing score={31} size={56} stroke={5} color="#9B2C2C" />
                <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <span style={{ fontSize: 16, fontWeight: 600, fontFamily: mono, color: "#9B2C2C" }}>31</span>
                </div>
              </div>
              <div>
                <div style={{ fontSize: 14, fontWeight: 600, color: "#9B2C2C" }}>Limited Stability</div>
                <div style={{ fontSize: 12, color: light }}>Highly vulnerable</div>
              </div>
            </div>
          </div>
          {/* Person B */}
          <div style={{ backgroundColor: C.white, borderRadius: 16, padding: m ? 28 : 36, border: `1px solid ${C.border}`, position: "relative" as const, overflow: "hidden" }}>
            <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 3, background: `linear-gradient(90deg, ${C.teal}, ${C.purple})` }} />
            <div style={{ fontSize: 13, fontWeight: 500, color: light, marginBottom: 12 }}>$150K / year</div>
            <div style={{ display: "flex", flexDirection: "column" as const, gap: 10, marginBottom: 28 }}>
              {["5 clients, none over 30%", "40% recurring revenue", "3 months secured forward"].map((t, i) => (
                <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 10 }}><span style={{ width: 5, height: 5, borderRadius: "50%", backgroundColor: C.teal, flexShrink: 0, marginTop: 7 }} /><span style={{ fontSize: 15, color: muted, lineHeight: 1.55 }}>{t}</span></div>
              ))}
            </div>
            <div style={{ borderTop: `1px solid rgba(14,26,43,0.05)`, paddingTop: 24, display: "flex", alignItems: "center", gap: 16 }}>
              <div style={{ position: "relative", width: 56, height: 56, flexShrink: 0 }}>
                <ScoreRing score={74} size={56} stroke={5} color={C.teal} />
                <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <span style={{ fontSize: 16, fontWeight: 600, fontFamily: mono, color: C.teal }}>74</span>
                </div>
              </div>
              <div>
                <div style={{ fontSize: 14, fontWeight: 600, color: C.teal }}>Established Stability</div>
                <div style={{ fontSize: 12, color: light }}>Stable under typical conditions</div>
              </div>
            </div>
          </div>
        </div>
        <p style={{ fontSize: 17, fontWeight: 500, color: C.navy, textAlign: "center", marginTop: m ? 28 : 44, ...fadeIn(visible, 220) }}>Structure determines stability.</p>
      </div>
    </section>
  );
}


/* ================================================================== */
/* SECTION 4 — SYSTEM DEFINITION                                       */
/* ================================================================== */

function SystemDefinition() {
  const { ref, visible } = useInView();
  const m = useMobile();
  const fadeIn = useFadeIn();
  return (
    <section ref={ref} style={{ backgroundColor: C.sand, paddingTop: secPad(m), paddingBottom: secPad(m), paddingLeft: px(m), paddingRight: px(m) }}>
      <div style={{ maxWidth: 720, margin: "0 auto", textAlign: "center" }}>
        <h2 style={{ fontSize: m ? 30 : 40, fontWeight: 600, lineHeight: 1.15, letterSpacing: "-0.02em", color: C.navy, marginBottom: 24, ...fadeIn(visible) }}>
          This is not a budgeting tool.{m ? " " : <br />}Not a credit score. Not a forecast.
        </h2>
        <p style={{ fontSize: 17, color: muted, lineHeight: 1.65, marginBottom: 12, ...fadeIn(visible, 80) }}>Those measure what happened — or guess what might.</p>
        <p style={{ fontSize: 17, color: muted, lineHeight: 1.65, marginBottom: 32, ...fadeIn(visible, 120) }}>RunPayway&#8482; measures how your income is built — right now.</p>
        <div style={{ padding: "20px 28px", borderRadius: 12, backgroundColor: C.white, border: `1px solid ${C.border}`, display: "inline-block", ...fadeIn(visible, 200) }}>
          <p style={{ fontSize: 16, fontWeight: 500, color: C.navy, lineHeight: 1.55, margin: "0 0 4px" }}>A fixed model. A reproducible result.</p>
          <p style={{ fontSize: 16, fontWeight: 500, color: C.navy, lineHeight: 1.55, margin: 0 }}>The same inputs always produce the same score.</p>
        </div>
      </div>
    </section>
  );
}


/* ================================================================== */
/* SECTION 5 — HOW IT WORKS                                            */
/* ================================================================== */

function HowItWorks() {
  const { ref, visible } = useInView();
  const m = useMobile();
  const fadeIn = useFadeIn();
  return (
    <section ref={ref} style={{ backgroundColor: C.white, paddingTop: secPad(m), paddingBottom: secPad(m), paddingLeft: px(m), paddingRight: px(m) }}>
      <div style={{ maxWidth: contentW, margin: "0 auto" }}>
        <h2 style={{ fontSize: m ? 30 : 40, fontWeight: 600, lineHeight: 1.15, letterSpacing: "-0.02em", color: C.navy, textAlign: "center", marginBottom: m ? 44 : 64, ...fadeIn(visible) }}>How it works</h2>
        <div style={{ display: m ? "block" : "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 40, marginBottom: m ? 40 : 56, ...fadeIn(visible, 100) }}>
          {[
            { num: "01", title: "Define your income structure", desc: "Sources, contracts, dependencies." },
            { num: "02", title: "6 fixed structural dimensions", desc: "No interpretation. No variation." },
            { num: "03", title: "Receive one standardized score", desc: "0\u2013100 with band classification." },
          ].map((s, i) => (
            <div key={i} style={{ marginBottom: m ? 28 : 0 }}>
              <div style={{ width: 40, height: 40, borderRadius: 10, backgroundColor: `${C.teal}08`, border: `1px solid ${C.teal}12`, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 16 }}>
                <span style={{ fontSize: 13, fontWeight: 600, fontFamily: mono, color: C.teal }}>{s.num}</span>
              </div>
              <div style={{ fontSize: 20, fontWeight: 600, color: C.navy, marginBottom: 8, lineHeight: 1.3 }}>{s.title}</div>
              <p style={{ fontSize: 15, color: muted, margin: 0, lineHeight: 1.6 }}>{s.desc}</p>
            </div>
          ))}
        </div>
        <div style={{ display: "flex", gap: m ? 8 : 12, justifyContent: "center", flexWrap: "wrap" as const, marginBottom: 20, ...fadeIn(visible, 200) }}>
          {[
            { label: "Limited", range: "0\u201329", color: "#9B2C2C" },
            { label: "Developing", range: "30\u201349", color: "#92640A" },
            { label: "Established", range: "50\u201374", color: "#2B5EA7" },
            { label: "High", range: "75\u2013100", color: C.teal },
          ].map(b => (
            <div key={b.label} style={{ display: "flex", alignItems: "center", gap: 8, padding: "8px 16px", borderRadius: 8, border: `1px solid ${C.border}`, backgroundColor: "#FAFAFA" }}>
              <div style={{ width: 8, height: 8, borderRadius: 2, backgroundColor: b.color }} />
              <span style={{ fontSize: 13, fontWeight: 600, color: C.navy }}>{b.label}</span>
              <span style={{ fontSize: 12, color: light }}>{b.range}</span>
            </div>
          ))}
        </div>
        <p style={{ fontSize: 13, color: light, textAlign: "center", letterSpacing: "0.03em", ...fadeIn(visible, 260) }}>Deterministic &bull; Version-locked</p>
      </div>
    </section>
  );
}


/* ================================================================== */
/* SECTION 6 — RESULT PREVIEW                                          */
/* ================================================================== */

function ResultPreview() {
  const { ref, visible } = useInView();
  const m = useMobile();
  const fadeIn = useFadeIn();
  return (
    <section ref={ref} style={{ backgroundColor: C.navy, paddingTop: secPad(m), paddingBottom: secPad(m), paddingLeft: px(m), paddingRight: px(m), position: "relative", overflow: "hidden" }}>
      <div style={{ position: "absolute", top: "50%", left: "50%", width: 600, height: 600, transform: "translate(-50%, -50%)", borderRadius: "50%", background: `radial-gradient(circle, ${C.purple}06 0%, transparent 70%)`, pointerEvents: "none" }} />
      <div style={{ maxWidth: 720, margin: "0 auto", position: "relative", zIndex: 1 }}>
        <h2 style={{ fontSize: m ? 30 : 40, fontWeight: 600, lineHeight: 1.15, letterSpacing: "-0.02em", color: "#F4F1EA", textAlign: "center", marginBottom: m ? 36 : 56, ...fadeIn(visible) }}>
          Your score shows where your structure holds.{m ? " " : <br />}And where it fails first.
        </h2>
        <div style={{ backgroundColor: C.white, borderRadius: 16, padding: m ? 28 : 40, border: "1px solid rgba(14,26,43,0.06)", boxShadow: "0 8px 40px rgba(0,0,0,0.12)", ...fadeIn(visible, 120) }}>
          <div style={{ display: "flex", alignItems: "center", gap: 20, marginBottom: 24 }}>
            <div style={{ position: "relative", width: 72, height: 72, flexShrink: 0 }}>
              <ScoreRing score={72} size={72} stroke={7} color="#2B5EA7" />
              <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <span style={{ fontSize: 22, fontWeight: 300, fontFamily: mono, color: C.navy }}>72</span>
              </div>
            </div>
            <div>
              <div style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "4px 12px", borderRadius: 100, backgroundColor: "rgba(43,94,167,0.06)", border: "1px solid rgba(43,94,167,0.10)", marginBottom: 6 }}>
                <div style={{ width: 6, height: 6, borderRadius: 2, backgroundColor: "#2B5EA7" }} />
                <span style={{ fontSize: 11, fontWeight: 600, color: "#2B5EA7" }}>Established Stability</span>
              </div>
              <div style={{ fontSize: 13, color: muted }}>3 points to High Stability</div>
            </div>
          </div>
          <div style={{ height: 1, backgroundColor: "rgba(14,26,43,0.05)", marginBottom: 20 }} />
          <div style={{ fontSize: 13, fontWeight: 500, color: light, marginBottom: 8 }}>Primary constraint: <span style={{ color: C.navy }}>Income concentration</span></div>
          <p style={{ fontSize: 17, fontWeight: 500, color: C.navy, lineHeight: 1.5, marginBottom: 24 }}>Your structure is stable — but one source puts most of it at risk.</p>
          <div style={{ padding: "18px 22px", borderRadius: 12, backgroundColor: "rgba(192,57,43,0.04)", border: "1px solid rgba(192,57,43,0.08)" }}>
            <div style={{ fontSize: 13, color: muted, marginBottom: 6 }}>If that source disappears:</div>
            <div style={{ display: "flex", alignItems: "baseline", gap: 10 }}>
              <span style={{ fontSize: 22, fontWeight: 300, fontFamily: mono, color: "#C0392B" }}>72 &rarr; 44</span>
              <span style={{ fontSize: 13, fontWeight: 500, color: "#C0392B" }}>Developing Stability</span>
            </div>
          </div>
        </div>
        <p style={{ fontSize: 13, color: "rgba(244,241,234,0.30)", textAlign: "center", marginTop: 28, letterSpacing: "0.03em", ...fadeIn(visible, 220) }}>The model does not change. Only the inputs change.</p>
      </div>
    </section>
  );
}


/* ================================================================== */
/* SECTION 7 — COMMAND CENTER                                          */
/* ================================================================== */

function CommandCenter() {
  const { ref, visible } = useInView();
  const m = useMobile();
  const fadeIn = useFadeIn();
  return (
    <section ref={ref} style={{ backgroundColor: C.white, paddingTop: secPad(m), paddingBottom: secPad(m), paddingLeft: px(m), paddingRight: px(m) }}>
      <div style={{ maxWidth: contentW, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: m ? 36 : 56, ...fadeIn(visible) }}>
          <div style={{ fontSize: 11, fontWeight: 500, letterSpacing: "0.12em", textTransform: "uppercase" as const, color: C.teal, marginBottom: 16 }}>Command Center</div>
          <h2 style={{ fontSize: m ? 30 : 40, fontWeight: 600, lineHeight: 1.15, letterSpacing: "-0.02em", color: C.navy, marginBottom: 14 }}>This is where your structure changes.</h2>
          <p style={{ fontSize: 17, color: muted, lineHeight: 1.65 }}>Test structural changes. See the exact score impact. Improve deliberately.</p>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: m ? "1fr" : "1fr 1fr", gap: 16, maxWidth: 880, margin: "0 auto", ...fadeIn(visible, 120) }}>
          {[
            { label: "Score Breakdown", desc: "See how each of the 6 structural dimensions contributes to your score.", icon: "M9 19v-6a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v6M15 19v-6a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v6M9 13V5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v8" },
            { label: "What-If Simulator", desc: "Test changes before you commit. See the exact score impact.", icon: "M13 10V3L4 14h7v7l9-11h-7z" },
            { label: "12-Week Roadmap", desc: "Step-by-step plan with industry-specific guidance and cumulative projections.", icon: "M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2M9 5a2 2 0 0 0 2 2h2a2 2 0 0 0 2-2M9 5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2" },
            { label: "Goal Mode", desc: "Pick a target band. See the minimum moves to get there.", icon: "M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" },
          ].map((mod, i) => (
            <div key={i} style={{ padding: m ? 24 : 28, borderRadius: 14, border: `1px solid ${C.border}`, backgroundColor: "#FAFAFA", transition: "border-color 200ms" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 10 }}>
                <div style={{ width: 36, height: 36, borderRadius: 8, backgroundColor: `${C.teal}08`, border: `1px solid ${C.teal}10`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={C.teal} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d={mod.icon} /></svg>
                </div>
                <span style={{ fontSize: 17, fontWeight: 600, color: C.navy }}>{mod.label}</span>
              </div>
              <p style={{ fontSize: 14, color: muted, lineHeight: 1.6, margin: 0 }}>{mod.desc}</p>
            </div>
          ))}
        </div>
        <p style={{ fontSize: 13, color: light, textAlign: "center", marginTop: m ? 24 : 36, letterSpacing: "0.03em", ...fadeIn(visible, 220) }}>Included with diagnostic</p>
      </div>
    </section>
  );
}


/* ================================================================== */
/* SECTION 8 — PRICING                                                 */
/* ================================================================== */

function PricingSection() {
  const { ref, visible } = useInView();
  const m = useMobile();
  const fadeIn = useFadeIn();
  const check = (text: string) => (
    <div style={{ display: "flex", alignItems: "flex-start", gap: 10, marginBottom: 14 }}>
      <span style={{ color: C.teal, fontSize: 14, flexShrink: 0, marginTop: 2 }}>&#10003;</span>
      <span style={{ fontSize: 15, color: muted, lineHeight: 1.55 }}>{text}</span>
    </div>
  );

  return (
    <section ref={ref} style={{ backgroundColor: C.sand, paddingTop: secPad(m), paddingBottom: secPad(m), paddingLeft: px(m), paddingRight: px(m) }}>
      <div style={{ maxWidth: contentW, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: m ? 36 : 56, ...fadeIn(visible) }}>
          <p style={{ fontSize: 17, color: muted, lineHeight: 1.65, marginBottom: 4 }}>You can stop at the score.</p>
          <p style={{ fontSize: 17, fontWeight: 500, color: C.navy, lineHeight: 1.65 }}>Or you can see exactly what to change.</p>
        </div>
        <div style={{ display: m ? "block" : "grid", gridTemplateColumns: "1fr 1fr", gap: 24, maxWidth: 880, margin: "0 auto", ...fadeIn(visible, 120) }}>
          {/* Free */}
          <div style={{ backgroundColor: C.white, borderRadius: 16, padding: m ? 28 : 32, border: `1px solid ${C.border}`, display: "flex", flexDirection: "column" as const, marginBottom: m ? 16 : 0, position: "relative" as const, overflow: "hidden" }}>
            <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 3, backgroundColor: "rgba(14,26,43,0.06)" }} />
            <div style={{ fontSize: 11, fontWeight: 500, letterSpacing: "0.12em", textTransform: "uppercase" as const, color: C.teal, marginTop: 4, marginBottom: 24 }}>Income Stability Score&#8482;</div>
            <div style={{ marginBottom: 4 }}><span style={{ fontSize: 44, fontWeight: 600, fontFamily: mono, color: C.navy, lineHeight: 1 }}>$0</span></div>
            <div style={{ fontSize: 13, color: light, marginBottom: 28 }}>always free</div>
            <div style={{ marginBottom: 28, flex: 1 }}>
              {check("Score (0\u2013100)")}{check("Stability band")}{check("Primary constraint")}{check("Improvement direction")}
            </div>
            <Link href="/begin" style={{ display: "flex", alignItems: "center", justifyContent: "center", height: 52, borderRadius: 12, backgroundColor: C.white, color: C.navy, border: `1px solid ${C.navy}`, fontSize: 15, fontWeight: 600, textDecoration: "none", transition: "background-color 200ms" }}
              onMouseEnter={e => { e.currentTarget.style.backgroundColor = "#f5f4f1"; }}
              onMouseLeave={e => { e.currentTarget.style.backgroundColor = C.white; }}>
              Start Free Assessment
            </Link>
          </div>
          {/* Diagnostic */}
          <div style={{ backgroundColor: C.white, borderRadius: 16, padding: m ? 28 : 32, border: `1px solid rgba(14,26,43,0.12)`, display: "flex", flexDirection: "column" as const, position: "relative" as const, overflow: "hidden", boxShadow: "0 4px 24px rgba(14,26,43,0.06)" }}>
            <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 3, background: `linear-gradient(90deg, ${C.purple}, ${C.teal})` }} />
            <div style={{ fontSize: 11, fontWeight: 500, letterSpacing: "0.12em", textTransform: "uppercase" as const, color: C.purple, marginTop: 4, marginBottom: 24 }}>RunPayway&#8482; Diagnostic</div>
            <div style={{ marginBottom: 4 }}><span style={{ fontSize: 44, fontWeight: 600, fontFamily: mono, color: C.navy, lineHeight: 1 }}>$69</span></div>
            <div style={{ fontSize: 13, color: light, marginBottom: 20 }}>one-time</div>
            <p style={{ fontSize: 16, fontWeight: 500, color: C.navy, lineHeight: 1.55, marginBottom: 24 }}>See exactly what would break your income — before it happens.</p>
            <div style={{ marginBottom: 28, flex: 1 }}>
              {check("Structural breakdown")}{check("Risk scenarios")}{check("Score drivers")}{check("Improvement plan")}{check("12-week roadmap")}
            </div>
            <a href={STRIPE} style={{ display: "flex", alignItems: "center", justifyContent: "center", height: 52, borderRadius: 12, backgroundColor: C.navy, color: C.white, fontSize: 15, fontWeight: 600, textDecoration: "none", transition: "background-color 200ms" }}
              onMouseEnter={e => { e.currentTarget.style.backgroundColor = "#1a2540"; }}
              onMouseLeave={e => { e.currentTarget.style.backgroundColor = C.navy; }}>
              Unlock Full Diagnostic &mdash; $69
            </a>
            <p style={{ fontSize: 13, fontWeight: 500, color: C.teal, textAlign: "center", marginTop: 12, marginBottom: 0 }}>If it doesn&#8217;t reveal something new, full refund.</p>
          </div>
        </div>
      </div>
    </section>
  );
}


/* ================================================================== */
/* SECTION 9 — TRANSFORMATION PROOF                                    */
/* ================================================================== */

function TransformationProof() {
  const { ref, visible } = useInView();
  const m = useMobile();
  const fadeIn = useFadeIn();
  const results = [
    { before: 34, after: 61, constraint: "80% client concentration", action: "Restructured to multiple clients. Added retainers." },
    { before: 28, after: 52, constraint: "Zero recurring income", action: "Converted project work into recurring revenue." },
    { before: 42, after: 67, constraint: "No forward visibility", action: "Secured forward contracts and extended engagements." },
  ];
  return (
    <section ref={ref} style={{ backgroundColor: C.white, paddingTop: secPad(m), paddingBottom: secPad(m), paddingLeft: px(m), paddingRight: px(m) }}>
      <div style={{ maxWidth: contentW, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: m ? 36 : 56, ...fadeIn(visible) }}>
          <h2 style={{ fontSize: m ? 30 : 40, fontWeight: 600, lineHeight: 1.15, letterSpacing: "-0.02em", color: C.navy, marginBottom: 14 }}>They didn&#8217;t earn more.{m ? " " : <br />}They changed their structure.</h2>
          <p style={{ fontSize: 15, color: muted }}>Structural changes — not income increases — drove these results.</p>
        </div>
        <div style={{ display: m ? "block" : "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 20, ...fadeIn(visible, 120) }}>
          {results.map((r, i) => (
            <div key={i} style={{ padding: m ? 24 : 28, borderRadius: 14, border: `1px solid ${C.border}`, backgroundColor: "#FAFAFA", marginBottom: m ? 12 : 0 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 16 }}>
                <div style={{ position: "relative", width: 48, height: 48, flexShrink: 0 }}>
                  <ScoreRing score={r.before} size={48} stroke={4} color="rgba(14,26,43,0.12)" />
                  <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <span style={{ fontSize: 14, fontWeight: 500, fontFamily: mono, color: light }}>{r.before}</span>
                  </div>
                </div>
                <svg width="16" height="12" viewBox="0 0 16 12" fill="none"><path d="M1 6h14M11 1l4 5-4 5" stroke={C.teal} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
                <div style={{ position: "relative", width: 48, height: 48, flexShrink: 0 }}>
                  <ScoreRing score={r.after} size={48} stroke={4} color={C.teal} />
                  <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <span style={{ fontSize: 14, fontWeight: 600, fontFamily: mono, color: C.teal }}>{r.after}</span>
                  </div>
                </div>
              </div>
              <div style={{ fontSize: 12, color: light, marginBottom: 8 }}>Constraint: {r.constraint}</div>
              <p style={{ fontSize: 14, color: muted, lineHeight: 1.55, margin: 0 }}>{r.action}</p>
            </div>
          ))}
        </div>
        <div style={{ textAlign: "center", marginTop: m ? 28 : 44, ...fadeIn(visible, 220) }}>
          <p style={{ fontSize: 17, color: muted, marginBottom: 4 }}>The score reveals the weakness.</p>
          <p style={{ fontSize: 17, fontWeight: 500, color: C.navy }}>The action changes the outcome.</p>
        </div>
      </div>
    </section>
  );
}


/* ================================================================== */
/* SECTION 10 — TRUST STRIP                                            */
/* ================================================================== */

function TrustStrip() {
  const { ref, visible } = useInView();
  const m = useMobile();
  const fadeIn = useFadeIn();
  return (
    <section ref={ref} style={{ backgroundColor: C.sand, paddingTop: secPad(m), paddingBottom: secPad(m), paddingLeft: px(m), paddingRight: px(m) }}>
      <div style={{ maxWidth: contentW, margin: "0 auto" }}>
        <h2 style={{ fontSize: m ? 30 : 40, fontWeight: 600, lineHeight: 1.15, letterSpacing: "-0.02em", color: C.navy, textAlign: "center", marginBottom: m ? 36 : 56, ...fadeIn(visible) }}>
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
              <div style={{ fontSize: 15, fontWeight: 600, color: C.navy, marginBottom: 6 }}>{item.title}</div>
              <p style={{ fontSize: 13, color: muted, lineHeight: 1.55, margin: 0 }}>{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}


/* ================================================================== */
/* SECTION 11 — FINAL CTA                                              */
/* ================================================================== */

function FinalCta() {
  const { ref, visible } = useInView();
  const m = useMobile();
  const fadeIn = useFadeIn();
  return (
    <section ref={ref} style={{ backgroundColor: C.navy, paddingTop: m ? 72 : 120, paddingBottom: m ? 72 : 120, paddingLeft: px(m), paddingRight: px(m), position: "relative", overflow: "hidden" }}>
      <div style={{ position: "absolute", top: "50%", left: "50%", width: 500, height: 500, transform: "translate(-50%, -50%)", borderRadius: "50%", background: `radial-gradient(circle, ${C.purple}06 0%, transparent 70%)`, pointerEvents: "none" }} />
      <div style={{ maxWidth: 700, margin: "0 auto", textAlign: "center", position: "relative", zIndex: 1 }}>
        <h2 style={{ fontSize: m ? 32 : 44, fontWeight: 600, lineHeight: 1.12, letterSpacing: "-0.02em", color: "#F4F1EA", marginBottom: 20, ...fadeIn(visible) }}>
          Your income is already being tested.{m ? " " : <br />}Now you can see how it holds.
        </h2>
        <p style={{ fontSize: 16, color: "rgba(244,241,234,0.45)", lineHeight: 1.65, marginBottom: 8, ...fadeIn(visible, 60) }}>Start with the free score.</p>
        <p style={{ fontSize: 16, color: "rgba(244,241,234,0.45)", lineHeight: 1.65, marginBottom: 40, ...fadeIn(visible, 100) }}>Unlock the diagnostic when you&#8217;re ready to act.</p>
        <div style={{ ...fadeIn(visible, 180) }}>
          <Link href="/pricing" style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", height: 56, padding: m ? "0 28px" : "0 48px", width: m ? "100%" : "auto", maxWidth: m ? 360 : "none", borderRadius: 12, backgroundColor: C.white, color: C.navy, fontSize: m ? 15 : 17, fontWeight: 600, textDecoration: "none", transition: "background-color 200ms, box-shadow 200ms", boxShadow: "0 2px 16px rgba(244,241,234,0.10)" }}
            onMouseEnter={e => { e.currentTarget.style.backgroundColor = "#E8E5DE"; e.currentTarget.style.boxShadow = "0 4px 24px rgba(244,241,234,0.15)"; }}
            onMouseLeave={e => { e.currentTarget.style.backgroundColor = C.white; e.currentTarget.style.boxShadow = "0 2px 16px rgba(244,241,234,0.10)"; }}>
            Start Your Free Assessment
          </Link>
          <p style={{ fontSize: 13, color: "rgba(244,241,234,0.30)", marginTop: 16, letterSpacing: "0.03em" }}>Under 2 minutes &bull; Instant result &bull; Private by default</p>
        </div>
      </div>
    </section>
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
        <IndustrySignal />
        <SameIncomeProof />
        <SystemDefinition />
        <HowItWorks />
        <ResultPreview />
        <CommandCenter />
        <PricingSection />
        <TransformationProof />
        <TrustStrip />
        <FinalCta />
      </main>
    </div>
  );
}
