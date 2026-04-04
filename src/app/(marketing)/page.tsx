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
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setVisible(true); obs.disconnect(); } },
      { threshold },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);
  return { ref, visible };
}

function useMobile(bp = 768) {
  const [m, setM] = useState(false);
  useEffect(() => {
    const c = () => setM(window.innerWidth <= bp);
    c(); window.addEventListener("resize", c);
    return () => window.removeEventListener("resize", c);
  }, [bp]);
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
    reduced ? {} : {
      opacity: visible ? 1 : 0,
      transform: visible ? "translateY(0)" : "translateY(8px)",
      transition: `opacity 400ms ease-out ${delay}ms, transform 400ms ease-out ${delay}ms`,
    };
}

/* ================================================================== */
/* DESIGN SYSTEM (LOCKED)                                              */
/* ================================================================== */

const C = {
  navy: "#0E1A2B",
  purple: "#4B3FAE",
  teal: "#1F6D7A",
  sand: "#F4F1EA",
  white: "#FFFFFF",
  border: "#E5E7EB",
};

const mono = '"SF Mono", "Fira Code", "IBM Plex Mono", "Courier New", monospace';
const muted = "rgba(14,26,43,0.55)";
const light = "rgba(14,26,43,0.38)";
const contentW = 1040;
const secPad = (m: boolean) => m ? 48 : 96;
const px = (m: boolean) => m ? 20 : 24;

const STRIPE = process.env.NEXT_PUBLIC_STRIPE_CHECKOUT_URL || "https://buy.stripe.com/9B66oz48EaYU2lc4IF2Nq05";

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
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [onClose]);

  return (
    <div role="dialog" aria-labelledby="ind-modal-title" aria-modal="true" onClick={onClose}
      style={{ position: "fixed", inset: 0, zIndex: 9999, backgroundColor: "rgba(0,0,0,0.75)", backdropFilter: "blur(8px)", display: "flex", alignItems: "center", justifyContent: "center", padding: m ? 20 : 40 }}>
      <div onClick={e => e.stopPropagation()} style={{ position: "relative", maxWidth: 520, width: "100%", backgroundColor: C.white, borderRadius: 12, padding: m ? "40px 24px 32px" : "48px 40px 40px" }}>
        <button onClick={onClose} aria-label="Close" style={{ position: "absolute", top: 16, right: 16, width: 44, height: 44, borderRadius: 8, border: `1px solid ${C.border}`, backgroundColor: "transparent", color: muted, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", padding: 0 }}>
          <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><line x1="4" y1="4" x2="12" y2="12" /><line x1="12" y1="4" x2="4" y2="12" /></svg>
        </button>
        <div style={{ fontSize: 11, fontWeight: 500, letterSpacing: "0.10em", textTransform: "uppercase" as const, color: C.teal, marginBottom: 12 }}>{industry.name}</div>
        <h3 id="ind-modal-title" style={{ fontSize: m ? 20 : 24, fontWeight: 600, lineHeight: 1.3, color: C.navy, marginBottom: 24 }}>{industry.headline}</h3>
        {industry.problem.split("\n\n").map((para, i) => (
          <p key={i} style={{ fontSize: 16, color: muted, lineHeight: 1.65, marginBottom: 16 }}>{para}</p>
        ))}
        <div style={{ borderTop: `1px solid ${C.border}`, paddingTop: 24, marginTop: 24 }}>
          <Link href="/pricing" onClick={onClose} style={{ display: "flex", alignItems: "center", justifyContent: "center", height: 52, borderRadius: 10, backgroundColor: C.navy, color: C.white, fontSize: 16, fontWeight: 600, textDecoration: "none", transition: "background-color 200ms" }}
            onMouseEnter={e => { e.currentTarget.style.backgroundColor = "#1a2540"; }}
            onMouseLeave={e => { e.currentTarget.style.backgroundColor = C.navy; }}>
            {industry.cta}
          </Link>
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
  const animatedScore = useAnimatedCounter(72, visible, 1500);
  const [showLabel, setShowLabel] = useState(false);

  useEffect(() => { if (!visible) return; const t = setTimeout(() => setShowLabel(true), 1600); return () => clearTimeout(t); }, [visible]);

  return (
    <header ref={ref} style={{ backgroundColor: C.navy }}>
      <div style={{ maxWidth: contentW, margin: "0 auto", paddingTop: m ? 80 : 120, paddingBottom: m ? 48 : 80, paddingLeft: px(m), paddingRight: px(m) }}>
        <div style={{ display: m ? "block" : "flex", alignItems: "center", justifyContent: "space-between", gap: 64 }}>
          <div style={{ maxWidth: 540, textAlign: m ? "center" : "left" }}>
            <div style={{ fontSize: 11, fontWeight: 500, letterSpacing: "0.12em", textTransform: "uppercase" as const, color: C.teal, marginBottom: 16, ...fadeIn(visible) }}>
              Income Stability Score&#8482;
            </div>
            <h1 style={{ fontSize: m ? 36 : 52, fontWeight: 600, lineHeight: 1.1, letterSpacing: "-0.02em", color: C.sand, marginBottom: m ? 20 : 24, ...fadeIn(visible, 80) }}>
              Your income might be strong.{m ? " " : <br />}Your structure might not.
            </h1>
            <p style={{ fontSize: 16, color: "rgba(244,241,234,0.55)", lineHeight: 1.65, maxWidth: m ? undefined : 460, marginBottom: 16, ...fadeIn(visible, 140) }}>
              Most people never measure how stable their income actually is — until something breaks it.
            </p>
            <p style={{ fontSize: 16, fontWeight: 500, color: "rgba(244,241,234,0.70)", lineHeight: 1.55, maxWidth: m ? undefined : 460, marginBottom: 16, ...fadeIn(visible, 180) }}>
              Your income already has a structure.{m ? " " : <br />}You just don&#8217;t see how exposed it is yet.
            </p>
            <p style={{ fontSize: 16, color: "rgba(244,241,234,0.50)", lineHeight: 1.65, maxWidth: m ? undefined : 460, marginBottom: m ? 32 : 40, ...fadeIn(visible, 220) }}>
              RunPayway&#8482; measures the structure of your income — not the size of it — and shows how it holds under pressure.
            </p>
            <div style={{ ...fadeIn(visible, 280) }}>
              <Link href="/pricing" style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", height: 52, width: m ? "100%" : "auto", padding: "0 40px", borderRadius: 10, backgroundColor: C.white, color: C.navy, fontSize: 16, fontWeight: 600, textDecoration: "none", transition: "background-color 200ms" }}
                onMouseEnter={e => { e.currentTarget.style.backgroundColor = "#E8E5DE"; }}
                onMouseLeave={e => { e.currentTarget.style.backgroundColor = C.white; }}>
                Get My Income Stability Score
              </Link>
              <p style={{ fontSize: 13, color: "rgba(244,241,234,0.38)", marginTop: 14 }}>Under 2 minutes &bull; Instant result &bull; Private by default</p>
            </div>
          </div>
          <div style={{ flexShrink: 0, marginTop: m ? 40 : 0, ...fadeIn(visible, 350) }}>
            <div style={{ backgroundColor: C.white, borderRadius: 12, padding: m ? 28 : 36, maxWidth: m ? "100%" : 300, margin: m ? "0 auto" : undefined, border: `1px solid ${C.border}` }}>
              <div style={{ fontSize: 11, fontWeight: 500, letterSpacing: "0.10em", textTransform: "uppercase" as const, color: light, marginBottom: 20 }}>Income Stability Score</div>
              <div style={{ textAlign: "center", marginBottom: 12 }}>
                <div style={{ fontSize: 52, fontWeight: 300, color: C.purple, lineHeight: 1, fontFamily: mono, opacity: showLabel ? 1 : 0, transition: "opacity 500ms ease-out" }}>{animatedScore}</div>
                <div style={{ fontFamily: mono, fontSize: 13, color: light, marginTop: 4, opacity: showLabel ? 1 : 0, transition: "opacity 500ms ease-out 50ms" }}>/100</div>
              </div>
              <div style={{ display: "flex", justifyContent: "center", opacity: showLabel ? 1 : 0, transition: "opacity 500ms ease-out 100ms" }}>
                <div style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "4px 12px", borderRadius: 100, backgroundColor: "rgba(43,94,167,0.08)" }}>
                  <div style={{ width: 6, height: 6, borderRadius: "50%", backgroundColor: "#2B5EA7" }} />
                  <span style={{ fontSize: 11, fontWeight: 600, color: "#2B5EA7" }}>Established Stability</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div style={{ marginTop: m ? 40 : 56, paddingTop: m ? 24 : 32, borderTop: "1px solid rgba(244,241,234,0.08)", ...fadeIn(visible, 400) }}>
          <p style={{ fontSize: 13, letterSpacing: "0.02em", color: "rgba(244,241,234,0.30)", textAlign: m ? "center" : "left" }}>
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
    <section ref={ref} style={{ backgroundColor: C.navy, paddingTop: m ? 32 : 48, paddingBottom: m ? 32 : 48, paddingLeft: px(m), paddingRight: px(m) }}>
      <div style={{ maxWidth: contentW, margin: "0 auto", ...fadeIn(visible) }}>
        <div style={{ display: "grid", gridTemplateColumns: m ? "1fr 1fr" : "1fr 1fr 1fr 1fr", gap: m ? 10 : 14, marginBottom: m ? 16 : 20 }}>
          {[
            { name: "Freelancers", line: "Every month resets unless structure prevents it." },
            { name: "Contractors", line: "Strong projects hide instability between them." },
            { name: "Business Owners", line: "Revenue can grow while structure weakens underneath." },
            { name: "Commission Earners", line: "Income cycles. Exposure sits between them." },
          ].map((ind, i) => (
            <div key={i} style={{ padding: m ? "12px 14px" : "14px 16px", borderRadius: 10, border: "1px solid rgba(244,241,234,0.08)", backgroundColor: "rgba(244,241,234,0.04)" }}>
              <div style={{ fontSize: 12, fontWeight: 600, color: "rgba(244,241,234,0.55)", marginBottom: 6 }}>{ind.name}</div>
              <div style={{ fontSize: 12, color: "rgba(244,241,234,0.30)", lineHeight: 1.5 }}>{ind.line}</div>
            </div>
          ))}
        </div>
        <div ref={dropRef} style={{ position: "relative", display: "inline-block" }}>
          <button onClick={() => setShowAll(!showAll)} style={{ display: "inline-flex", alignItems: "center", gap: 6, background: "none", border: "none", cursor: "pointer", padding: 0, fontSize: 13, fontWeight: 500, color: "rgba(244,241,234,0.40)", transition: "color 200ms" }}
            onMouseEnter={e => { e.currentTarget.style.color = "rgba(244,241,234,0.65)"; }}
            onMouseLeave={e => { e.currentTarget.style.color = "rgba(244,241,234,0.40)"; }}>
            Explore all 19 industries
            <svg width="10" height="10" viewBox="0 0 12 12" fill="none" style={{ transform: showAll ? "rotate(180deg)" : "rotate(0deg)", transition: "transform 200ms" }}><path d="M3 4.5L6 7.5L9 4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
          </button>
          {showAll && (
            <div style={{ position: "absolute", top: "calc(100% + 8px)", left: 0, minWidth: m ? "calc(100vw - 40px)" : 320, maxHeight: 400, overflowY: "auto", backgroundColor: "#0E1424", border: "1px solid rgba(255,255,255,0.10)", borderRadius: 12, padding: "8px 0", zIndex: 100, boxShadow: "0 16px 48px rgba(0,0,0,0.40)" }}>
              {INDUSTRIES.map(ind => (
                <button key={ind.name} onClick={() => { setSelectedIndustry(ind); setShowAll(false); }}
                  style={{ display: "block", width: "100%", textAlign: "left", padding: "10px 20px", background: "none", border: "none", cursor: "pointer", fontSize: 15, fontWeight: 500, color: "rgba(244,241,234,0.70)", transition: "background 150ms, color 150ms", minHeight: 44 }}
                  onMouseEnter={e => { e.currentTarget.style.backgroundColor = "rgba(255,255,255,0.06)"; e.currentTarget.style.color = "#F4F1EA"; }}
                  onMouseLeave={e => { e.currentTarget.style.backgroundColor = "transparent"; e.currentTarget.style.color = "rgba(244,241,234,0.70)"; }}>
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
        <div style={{ textAlign: "center", marginBottom: m ? 32 : 48, ...fadeIn(visible) }}>
          <h2 style={{ fontSize: m ? 28 : 32, fontWeight: 600, lineHeight: 1.2, color: C.navy, marginBottom: 12 }}>Same income. Different stability.</h2>
          <p style={{ fontSize: 16, color: muted }}>Same income does not mean equal stability.</p>
        </div>
        <div style={{ display: m ? "block" : "grid", gridTemplateColumns: "1fr 1fr", gap: 24, maxWidth: 860, margin: "0 auto", ...fadeIn(visible, 120) }}>
          <div style={{ backgroundColor: "#FAFAFA", borderRadius: 12, padding: m ? 24 : 32, border: `1px solid ${C.border}`, marginBottom: m ? 16 : 0 }}>
            <div style={{ fontSize: 14, fontWeight: 500, color: light, marginBottom: 8 }}>$150K / year</div>
            <div style={{ display: "flex", flexDirection: "column" as const, gap: 8, marginBottom: 24 }}>
              {["1 client = 80% of income", "No forward contracts", "Income stops if work stops"].map((t, i) => (
                <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 8 }}><span style={{ width: 5, height: 5, borderRadius: "50%", backgroundColor: "#9B2C2C", flexShrink: 0, marginTop: 7 }} /><span style={{ fontSize: 15, color: muted, lineHeight: 1.5 }}>{t}</span></div>
              ))}
            </div>
            <div style={{ borderTop: `1px solid ${C.border}`, paddingTop: 20 }}>
              <span style={{ fontSize: 36, fontWeight: 300, fontFamily: mono, color: "#9B2C2C" }}>31</span>
              <span style={{ fontSize: 14, fontWeight: 600, color: "#9B2C2C", marginLeft: 12 }}>Limited Stability</span>
            </div>
          </div>
          <div style={{ backgroundColor: "#FAFAFA", borderRadius: 12, padding: m ? 24 : 32, border: `1px solid ${C.border}` }}>
            <div style={{ fontSize: 14, fontWeight: 500, color: light, marginBottom: 8 }}>$150K / year</div>
            <div style={{ display: "flex", flexDirection: "column" as const, gap: 8, marginBottom: 24 }}>
              {["5 clients, none over 30%", "40% recurring revenue", "3 months secured forward"].map((t, i) => (
                <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 8 }}><span style={{ width: 5, height: 5, borderRadius: "50%", backgroundColor: C.teal, flexShrink: 0, marginTop: 7 }} /><span style={{ fontSize: 15, color: muted, lineHeight: 1.5 }}>{t}</span></div>
              ))}
            </div>
            <div style={{ borderTop: `1px solid ${C.border}`, paddingTop: 20 }}>
              <span style={{ fontSize: 36, fontWeight: 300, fontFamily: mono, color: C.teal }}>74</span>
              <span style={{ fontSize: 14, fontWeight: 600, color: C.teal, marginLeft: 12 }}>Established Stability</span>
            </div>
          </div>
        </div>
        <p style={{ fontSize: 16, fontWeight: 500, color: muted, textAlign: "center", marginTop: m ? 24 : 36, ...fadeIn(visible, 200) }}>Structure determines stability.</p>
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
      <div style={{ maxWidth: 700, margin: "0 auto", textAlign: "center" }}>
        <h2 style={{ fontSize: m ? 28 : 32, fontWeight: 600, lineHeight: 1.2, color: C.navy, marginBottom: 20, ...fadeIn(visible) }}>
          This is not a budgeting tool.{m ? " " : <br />}Not a credit score. Not a forecast.
        </h2>
        <p style={{ fontSize: 16, color: muted, lineHeight: 1.65, marginBottom: 12, ...fadeIn(visible, 80) }}>Those measure what happened — or guess what might.</p>
        <p style={{ fontSize: 16, color: muted, lineHeight: 1.65, marginBottom: 24, ...fadeIn(visible, 120) }}>RunPayway&#8482; measures how your income is built — right now.</p>
        <div style={{ ...fadeIn(visible, 180) }}>
          <p style={{ fontSize: 16, fontWeight: 500, color: C.navy, lineHeight: 1.55, marginBottom: 4 }}>A fixed model. A reproducible result.</p>
          <p style={{ fontSize: 16, fontWeight: 500, color: C.navy, lineHeight: 1.55 }}>The same inputs always produce the same score.</p>
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
        <h2 style={{ fontSize: m ? 28 : 32, fontWeight: 600, lineHeight: 1.2, color: C.navy, textAlign: "center", marginBottom: m ? 40 : 48, ...fadeIn(visible) }}>How it works</h2>
        <div style={{ display: m ? "block" : "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 32, marginBottom: m ? 32 : 48, ...fadeIn(visible, 100) }}>
          {[
            { num: "01", title: "Define your income structure" },
            { num: "02", title: "6 fixed structural dimensions", sub: "No interpretation. No variation." },
            { num: "03", title: "Receive one standardized score" },
          ].map((s, i) => (
            <div key={i} style={{ marginBottom: m ? 24 : 0 }}>
              <div style={{ fontSize: 11, fontWeight: 500, letterSpacing: "0.12em", color: C.teal, marginBottom: 10 }}>{s.num}</div>
              <div style={{ fontSize: 20, fontWeight: 600, color: C.navy, marginBottom: s.sub ? 8 : 0, lineHeight: 1.3 }}>{s.title}</div>
              {s.sub && <p style={{ fontSize: 14, color: muted, margin: 0 }}>{s.sub}</p>}
            </div>
          ))}
        </div>
        <div style={{ display: "flex", gap: m ? 8 : 12, justifyContent: "center", flexWrap: "wrap" as const, marginBottom: 20, ...fadeIn(visible, 180) }}>
          {[
            { label: "Limited", range: "0\u201329", color: "#9B2C2C" },
            { label: "Developing", range: "30\u201349", color: "#92640A" },
            { label: "Established", range: "50\u201374", color: "#2B5EA7" },
            { label: "High", range: "75\u2013100", color: C.teal },
          ].map(b => (
            <div key={b.label} style={{ display: "flex", alignItems: "center", gap: 8, padding: "6px 14px", borderRadius: 8, border: `1px solid ${C.border}` }}>
              <div style={{ width: 8, height: 8, borderRadius: 2, backgroundColor: b.color }} />
              <span style={{ fontSize: 13, fontWeight: 500, color: C.navy }}>{b.label}</span>
              <span style={{ fontSize: 12, color: light }}>{b.range}</span>
            </div>
          ))}
        </div>
        <p style={{ fontSize: 13, color: light, textAlign: "center", ...fadeIn(visible, 220) }}>Deterministic &bull; Version-locked</p>
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
    <section ref={ref} style={{ backgroundColor: C.sand, paddingTop: secPad(m), paddingBottom: secPad(m), paddingLeft: px(m), paddingRight: px(m) }}>
      <div style={{ maxWidth: 700, margin: "0 auto" }}>
        <h2 style={{ fontSize: m ? 28 : 32, fontWeight: 600, lineHeight: 1.2, color: C.navy, textAlign: "center", marginBottom: m ? 32 : 48, ...fadeIn(visible) }}>
          Your score shows where your structure holds.{m ? " " : <br />}And where it fails first.
        </h2>
        <div style={{ backgroundColor: C.white, borderRadius: 12, padding: m ? 24 : 36, border: `1px solid ${C.border}`, ...fadeIn(visible, 120) }}>
          <div style={{ display: "flex", alignItems: "baseline", gap: 12, marginBottom: 6 }}>
            <span style={{ fontSize: 48, fontWeight: 300, fontFamily: mono, color: C.purple, lineHeight: 1 }}>72</span>
            <span style={{ fontSize: 14, color: light }}>/100</span>
          </div>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "4px 12px", borderRadius: 100, backgroundColor: "rgba(43,94,167,0.08)", marginBottom: 24 }}>
            <div style={{ width: 6, height: 6, borderRadius: "50%", backgroundColor: "#2B5EA7" }} />
            <span style={{ fontSize: 11, fontWeight: 600, color: "#2B5EA7" }}>Established Stability</span>
          </div>
          <div style={{ height: 1, backgroundColor: C.border, marginBottom: 20 }} />
          <div style={{ fontSize: 14, fontWeight: 500, color: light, marginBottom: 8 }}>Primary constraint: <span style={{ color: C.navy }}>Income concentration</span></div>
          <p style={{ fontSize: 16, fontWeight: 500, color: C.navy, lineHeight: 1.55, marginBottom: 20 }}>Your structure is stable — but one source puts most of it at risk.</p>
          <div style={{ padding: "16px 20px", borderRadius: 10, backgroundColor: "rgba(155,44,44,0.04)", border: "1px solid rgba(155,44,44,0.08)" }}>
            <div style={{ fontSize: 14, color: muted, marginBottom: 4 }}>If that source disappears:</div>
            <div style={{ display: "flex", alignItems: "baseline", gap: 8 }}>
              <span style={{ fontSize: 20, fontWeight: 500, fontFamily: mono, color: "#9B2C2C" }}>72 &rarr; 44</span>
              <span style={{ fontSize: 13, color: "#9B2C2C" }}>(Developing Stability)</span>
            </div>
          </div>
        </div>
        <p style={{ fontSize: 13, color: light, textAlign: "center", marginTop: 24, ...fadeIn(visible, 200) }}>The model does not change. Only the inputs change.</p>
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
    <section ref={ref} style={{ backgroundColor: C.navy, paddingTop: secPad(m), paddingBottom: secPad(m), paddingLeft: px(m), paddingRight: px(m) }}>
      <div style={{ maxWidth: contentW, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: m ? 32 : 48, ...fadeIn(visible) }}>
          <h2 style={{ fontSize: m ? 28 : 32, fontWeight: 600, lineHeight: 1.2, color: C.sand, marginBottom: 12 }}>This is where your structure changes.</h2>
          <p style={{ fontSize: 16, color: "rgba(244,241,234,0.55)", lineHeight: 1.65 }}>Test structural changes. See the exact score impact. Improve deliberately.</p>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: m ? "1fr" : "1fr 1fr", gap: 14, maxWidth: 860, margin: "0 auto", ...fadeIn(visible, 120) }}>
          {[
            { label: "Score Breakdown", desc: "See how each of the 6 structural dimensions contributes to your score." },
            { label: "What-If Simulator", desc: "Test changes before you commit. See the exact score impact." },
            { label: "12-Week Roadmap", desc: "Step-by-step plan with industry-specific guidance and cumulative projections." },
            { label: "Goal Mode", desc: "Pick a target band. See the minimum moves to get there." },
          ].map((mod, i) => (
            <div key={i} style={{ padding: m ? 20 : 24, borderRadius: 12, backgroundColor: "rgba(244,241,234,0.04)", border: "1px solid rgba(244,241,234,0.06)" }}>
              <div style={{ fontSize: 16, fontWeight: 600, color: C.sand, marginBottom: 8 }}>{mod.label}</div>
              <p style={{ fontSize: 14, color: "rgba(244,241,234,0.45)", lineHeight: 1.6, margin: 0 }}>{mod.desc}</p>
            </div>
          ))}
        </div>
        <p style={{ fontSize: 13, color: "rgba(244,241,234,0.30)", textAlign: "center", marginTop: m ? 24 : 32, ...fadeIn(visible, 200) }}>Included with diagnostic</p>
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
    <div style={{ display: "flex", alignItems: "flex-start", gap: 10, marginBottom: 12 }}>
      <span style={{ color: C.teal, fontSize: 14, flexShrink: 0, marginTop: 2 }}>&#10003;</span>
      <span style={{ fontSize: 15, color: muted, lineHeight: 1.55 }}>{text}</span>
    </div>
  );

  return (
    <section ref={ref} style={{ backgroundColor: C.white, paddingTop: secPad(m), paddingBottom: secPad(m), paddingLeft: px(m), paddingRight: px(m) }}>
      <div style={{ maxWidth: contentW, margin: "0 auto" }}>
        {/* Bridge */}
        <div style={{ textAlign: "center", marginBottom: m ? 32 : 48, ...fadeIn(visible) }}>
          <p style={{ fontSize: 16, color: muted, lineHeight: 1.65, marginBottom: 4 }}>You can stop at the score.</p>
          <p style={{ fontSize: 16, fontWeight: 500, color: C.navy, lineHeight: 1.65 }}>Or you can see exactly what to change.</p>
        </div>
        <div style={{ display: m ? "block" : "grid", gridTemplateColumns: "1fr 1fr", gap: 24, maxWidth: 860, margin: "0 auto", ...fadeIn(visible, 120) }}>
          {/* Free */}
          <div style={{ backgroundColor: C.white, borderRadius: 12, padding: 24, border: `1px solid ${C.border}`, display: "flex", flexDirection: "column" as const, marginBottom: m ? 16 : 0 }}>
            <div style={{ fontSize: 11, fontWeight: 500, letterSpacing: "0.10em", textTransform: "uppercase" as const, color: C.teal, marginBottom: 20 }}>Income Stability Score&#8482;</div>
            <div style={{ marginBottom: 4 }}><span style={{ fontSize: 40, fontWeight: 600, fontFamily: mono, color: C.navy, lineHeight: 1 }}>$0</span></div>
            <div style={{ fontSize: 13, color: light, marginBottom: 24 }}>always free</div>
            <div style={{ marginBottom: 24, flex: 1 }}>
              {check("Score (0\u2013100)")}{check("Stability band")}{check("Primary constraint")}{check("Improvement direction")}
            </div>
            <Link href="/begin" style={{ display: "flex", alignItems: "center", justifyContent: "center", height: 48, borderRadius: 10, backgroundColor: C.white, color: C.navy, border: `1px solid ${C.navy}`, fontSize: 15, fontWeight: 600, textDecoration: "none", transition: "background-color 200ms" }}
              onMouseEnter={e => { e.currentTarget.style.backgroundColor = "#f5f4f1"; }}
              onMouseLeave={e => { e.currentTarget.style.backgroundColor = C.white; }}>
              Start Free Assessment
            </Link>
          </div>
          {/* Diagnostic */}
          <div style={{ backgroundColor: C.white, borderRadius: 12, padding: 24, border: `1px solid rgba(14,26,43,0.15)`, display: "flex", flexDirection: "column" as const, position: "relative" as const, overflow: "hidden" }}>
            <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 3, background: `linear-gradient(90deg, ${C.purple}, ${C.teal})` }} />
            <div style={{ fontSize: 11, fontWeight: 500, letterSpacing: "0.10em", textTransform: "uppercase" as const, color: C.purple, marginTop: 4, marginBottom: 20 }}>RunPayway&#8482; Diagnostic</div>
            <div style={{ marginBottom: 4 }}><span style={{ fontSize: 40, fontWeight: 600, fontFamily: mono, color: C.navy, lineHeight: 1 }}>$69</span></div>
            <div style={{ fontSize: 13, color: light, marginBottom: 20 }}>one-time</div>
            <p style={{ fontSize: 15, fontWeight: 500, color: C.navy, lineHeight: 1.55, marginBottom: 20 }}>See exactly what would break your income — before it happens.</p>
            <div style={{ marginBottom: 24, flex: 1 }}>
              {check("Structural breakdown")}{check("Risk scenarios")}{check("Score drivers")}{check("Improvement plan")}{check("12-week roadmap")}
            </div>
            <a href={STRIPE} style={{ display: "flex", alignItems: "center", justifyContent: "center", height: 52, borderRadius: 10, backgroundColor: C.navy, color: C.white, fontSize: 15, fontWeight: 600, textDecoration: "none", transition: "background-color 200ms" }}
              onMouseEnter={e => { e.currentTarget.style.backgroundColor = "#1a2540"; }}
              onMouseLeave={e => { e.currentTarget.style.backgroundColor = C.navy; }}>
              Unlock Full Diagnostic &mdash; $69
            </a>
            <p style={{ fontSize: 13, fontWeight: 500, color: C.teal, textAlign: "center", marginTop: 10, marginBottom: 0 }}>If it doesn&#8217;t reveal something new, full refund.</p>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ================================================================== */
/* SECTION 9 — FEATURE COMPARISON                                      */
/* ================================================================== */

function FeatureComparison() {
  const { ref, visible } = useInView();
  const m = useMobile();
  const fadeIn = useFadeIn();
  const rows = [
    { feature: "Score (0\u2013100)", free: true, paid: true },
    { feature: "Stability band", free: true, paid: true },
    { feature: "Primary constraint", free: true, paid: true },
    { feature: "Improvement direction", free: true, paid: true },
    { feature: "Full structural breakdown", free: false, paid: true },
    { feature: "PressureMap\u2122 analysis", free: false, paid: true },
    { feature: "Ranked disruption scenarios", free: false, paid: true },
    { feature: "What-If Simulator + Goal Mode", free: false, paid: true },
    { feature: "12-week execution roadmap", free: false, paid: true },
    { feature: "Industry-specific scripts", free: false, paid: true },
    { feature: "Command Center access", free: false, paid: true },
  ];
  return (
    <section ref={ref} style={{ backgroundColor: C.sand, paddingTop: secPad(m), paddingBottom: secPad(m), paddingLeft: px(m), paddingRight: px(m) }}>
      <div style={{ maxWidth: 860, margin: "0 auto" }}>
        <h2 style={{ fontSize: m ? 28 : 32, fontWeight: 600, lineHeight: 1.2, color: C.navy, textAlign: "center", marginBottom: 12, ...fadeIn(visible) }}>What you see vs what you unlock</h2>
        <p style={{ fontSize: 14, color: muted, textAlign: "center", marginBottom: m ? 32 : 48, ...fadeIn(visible, 60) }}>Everything below is unlocked with the diagnostic.</p>
        <div style={{ overflowX: "auto", ...fadeIn(visible, 120) }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead><tr>
              <th style={{ textAlign: "left", padding: "12px 16px", borderBottom: `2px solid rgba(14,26,43,0.10)`, color: C.navy, fontWeight: 600, fontSize: 14 }}>Feature</th>
              <th style={{ textAlign: "center", padding: "12px 16px", borderBottom: `2px solid rgba(14,26,43,0.10)`, color: C.teal, fontWeight: 600, fontSize: 14, minWidth: 80 }}>Free</th>
              <th style={{ textAlign: "center", padding: "12px 16px", borderBottom: `2px solid rgba(14,26,43,0.10)`, color: C.purple, fontWeight: 600, fontSize: 14, minWidth: 80 }}>Diagnostic</th>
            </tr></thead>
            <tbody>{rows.map((row, i) => (
              <tr key={i}>
                <td style={{ padding: "10px 16px", borderBottom: `1px solid ${C.border}`, color: muted, fontSize: 14 }}>{row.feature}</td>
                <td style={{ padding: "10px 16px", borderBottom: `1px solid ${C.border}`, textAlign: "center" }}>{row.free ? <span style={{ color: C.teal, fontWeight: 600 }}>&#10003;</span> : <span style={{ color: light }}>&mdash;</span>}</td>
                <td style={{ padding: "10px 16px", borderBottom: `1px solid ${C.border}`, textAlign: "center" }}><span style={{ color: C.purple, fontWeight: 600 }}>&#10003;</span></td>
              </tr>
            ))}</tbody>
          </table>
        </div>
      </div>
    </section>
  );
}

/* ================================================================== */
/* SECTION 10 — TRANSFORMATION PROOF                                   */
/* ================================================================== */

function TransformationProof() {
  const { ref, visible } = useInView();
  const m = useMobile();
  const fadeIn = useFadeIn();
  return (
    <section ref={ref} style={{ backgroundColor: C.white, paddingTop: secPad(m), paddingBottom: secPad(m), paddingLeft: px(m), paddingRight: px(m) }}>
      <div style={{ maxWidth: contentW, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: m ? 32 : 48, ...fadeIn(visible) }}>
          <h2 style={{ fontSize: m ? 28 : 32, fontWeight: 600, lineHeight: 1.2, color: C.navy, marginBottom: 12 }}>They didn&#8217;t earn more.{m ? " " : <br />}They changed their structure.</h2>
          <p style={{ fontSize: 14, color: muted }}>Structural changes — not income increases — drove these results.</p>
        </div>
        <div style={{ display: "flex", gap: m ? 16 : 32, justifyContent: "center", flexWrap: "wrap" as const, marginBottom: m ? 32 : 48, ...fadeIn(visible, 120) }}>
          {[{ before: 34, after: 61 }, { before: 28, after: 52 }, { before: 42, after: 67 }].map((r, i) => (
            <div key={i} style={{ textAlign: "center", padding: m ? "24px 20px" : "28px 32px", borderRadius: 12, border: `1px solid ${C.border}`, minWidth: m ? 140 : 180 }}>
              <div style={{ display: "flex", alignItems: "baseline", justifyContent: "center", gap: 8 }}>
                <span style={{ fontSize: 28, fontWeight: 300, fontFamily: mono, color: light }}>{r.before}</span>
                <span style={{ fontSize: 14, color: light }}>&rarr;</span>
                <span style={{ fontSize: 28, fontWeight: 300, fontFamily: mono, color: C.teal }}>{r.after}</span>
              </div>
            </div>
          ))}
        </div>
        <div style={{ textAlign: "center", ...fadeIn(visible, 200) }}>
          <p style={{ fontSize: 16, color: muted, marginBottom: 4 }}>The score reveals the weakness.</p>
          <p style={{ fontSize: 16, color: muted }}>The action changes the outcome.</p>
        </div>
      </div>
    </section>
  );
}

/* ================================================================== */
/* SECTION 11 — TRUST STRIP                                            */
/* ================================================================== */

function TrustStrip() {
  const { ref, visible } = useInView();
  const m = useMobile();
  const fadeIn = useFadeIn();
  return (
    <section ref={ref} style={{ backgroundColor: C.sand, paddingTop: secPad(m), paddingBottom: secPad(m), paddingLeft: px(m), paddingRight: px(m) }}>
      <div style={{ maxWidth: contentW, margin: "0 auto" }}>
        <h2 style={{ fontSize: m ? 28 : 32, fontWeight: 600, lineHeight: 1.2, color: C.navy, textAlign: "center", marginBottom: m ? 32 : 48, ...fadeIn(visible) }}>
          Designed as a measurement system — not a financial tool.
        </h2>
        <div style={{ display: "grid", gridTemplateColumns: m ? "1fr 1fr" : "1fr 1fr 1fr 1fr", gap: 16, ...fadeIn(visible, 100) }}>
          {[
            { title: "No bank connection", desc: "We never access financial accounts." },
            { title: "No credit pull", desc: "No impact on your credit." },
            { title: "Private by default", desc: "Your data is never sold." },
            { title: "Deterministic scoring", desc: "Same inputs \u2192 same score." },
          ].map((item, i) => (
            <div key={i} style={{ textAlign: "center", padding: m ? 16 : 24 }}>
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
/* SECTION 12 — FINAL CTA                                              */
/* ================================================================== */

function FinalCta() {
  const { ref, visible } = useInView();
  const m = useMobile();
  const fadeIn = useFadeIn();
  return (
    <section ref={ref} style={{ backgroundColor: C.navy, paddingTop: m ? 64 : 96, paddingBottom: m ? 64 : 96, paddingLeft: px(m), paddingRight: px(m) }}>
      <div style={{ maxWidth: 700, margin: "0 auto", textAlign: "center" }}>
        <h2 style={{ fontSize: m ? 28 : 32, fontWeight: 600, lineHeight: 1.2, color: C.sand, marginBottom: 16, ...fadeIn(visible) }}>
          Your income is already being tested.{m ? " " : <br />}Now you can see how it holds.
        </h2>
        <p style={{ fontSize: 15, color: "rgba(244,241,234,0.50)", lineHeight: 1.65, marginBottom: 8, ...fadeIn(visible, 60) }}>Start with the free score.</p>
        <p style={{ fontSize: 15, color: "rgba(244,241,234,0.50)", lineHeight: 1.65, marginBottom: 32, ...fadeIn(visible, 100) }}>Unlock the diagnostic when you&#8217;re ready to act.</p>
        <div style={{ ...fadeIn(visible, 160) }}>
          <Link href="/pricing" style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", height: 52, padding: "0 40px", borderRadius: 10, backgroundColor: C.white, color: C.navy, fontSize: 16, fontWeight: 600, textDecoration: "none", transition: "background-color 200ms" }}
            onMouseEnter={e => { e.currentTarget.style.backgroundColor = "#E8E5DE"; }}
            onMouseLeave={e => { e.currentTarget.style.backgroundColor = C.white; }}>
            Start Your Free Assessment
          </Link>
          <p style={{ fontSize: 13, color: "rgba(244,241,234,0.38)", marginTop: 14 }}>Under 2 minutes &bull; Instant result &bull; Private by default</p>
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
        <FeatureComparison />
        <TransformationProof />
        <TrustStrip />
        <FinalCta />
      </main>
    </div>
  );
}
