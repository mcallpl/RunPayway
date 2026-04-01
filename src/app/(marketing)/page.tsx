"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import logoWhite from "../../../public/runpayway-logo-white.png";
import logoBlue from "../../../public/runpayway-logo-blue.png";

/* ================================================================== */
/* UTILITIES                                                           */
/* ================================================================== */

const canHover = () =>
  typeof window !== "undefined" && window.matchMedia("(hover: hover)").matches;

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
    c();
    window.addEventListener("resize", c);
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
  const [prefersReduced, setPrefersReduced] = useState(false);
  useEffect(() => {
    setPrefersReduced(window.matchMedia("(prefers-reduced-motion: reduce)").matches);
  }, []);
  return prefersReduced;
}

/* ================================================================== */
/* DESIGN TOKENS — LOCKED                                              */
/* ================================================================== */

const C = {
  navy: "#0E1A2B",
  purple: "#4B3FAE",
  teal: "#1F6D7A",
  sand: "#F4F1EA",
  white: "#FFFFFF",
  muted: "rgba(14,26,43,0.55)",
  light: "rgba(14,26,43,0.38)",
  border: "rgba(14,26,43,0.08)",
  softBorder: "#EAEAEA",
};

const sp = (n: number) => n * 8;

/* Typography — Inter (locked system) */
const T = {
  h1:    { desktop: { fontSize: 60, fontWeight: 600, lineHeight: 1.1, letterSpacing: "-0.02em" }, mobile: { fontSize: 36, fontWeight: 600, lineHeight: 1.12, letterSpacing: "-0.02em" } },
  h2:    { desktop: { fontSize: 40, fontWeight: 600, lineHeight: 1.18, letterSpacing: "-0.02em" }, mobile: { fontSize: 28, fontWeight: 600, lineHeight: 1.2, letterSpacing: "-0.02em" } },
  h3:    { desktop: { fontSize: 24, fontWeight: 500, lineHeight: 1.28 }, mobile: { fontSize: 20, fontWeight: 500, lineHeight: 1.3 } },
  body:  { desktop: { fontSize: 18, fontWeight: 400, lineHeight: 1.6 }, mobile: { fontSize: 16, fontWeight: 400, lineHeight: 1.6 } },
  bodySm:{ desktop: { fontSize: 16, fontWeight: 400, lineHeight: 1.6 }, mobile: { fontSize: 15, fontWeight: 400, lineHeight: 1.6 } },
  meta:  { fontSize: 14, fontWeight: 400, lineHeight: 1.45 },
  micro: { fontSize: 13, fontWeight: 400, lineHeight: 1.45 },
  label: { fontSize: 14, fontWeight: 500, letterSpacing: "0.10em", textTransform: "uppercase" as const },
};

const maxW = 1080;
const padX = { desktop: 40, mobile: 20 };

const h1 = (m: boolean) => m ? T.h1.mobile : T.h1.desktop;
const h2Style = (m: boolean) => m ? T.h2.mobile : T.h2.desktop;
const h3Style = (m: boolean) => m ? T.h3.mobile : T.h3.desktop;
const body = (m: boolean) => m ? T.body.mobile : T.body.desktop;
const bodySm = (m: boolean) => m ? T.bodySm.mobile : T.bodySm.desktop;
const micro = () => T.micro;
const px = (m: boolean) => m ? padX.mobile : padX.desktop;

/* Spacing constants */
const secPad = (m: boolean) => m ? sp(12) : sp(17.5); /* 96/140px */
const heroTopPad = (m: boolean) => m ? sp(16) : sp(20); /* 128/160px */
const textMax = 720;
const heroTextMax = 600;

const cardStyle = {
  borderRadius: 12,
  border: `1px solid ${C.softBorder}`,
  backgroundColor: C.white,
  boxShadow: "0 1px 3px rgba(14,26,43,0.04)",
};

const ctaButton = {
  display: "inline-flex" as const,
  alignItems: "center" as const,
  justifyContent: "center" as const,
  height: 56,
  padding: "0 40px",
  borderRadius: 8,
  backgroundColor: C.navy,
  color: C.white,
  fontSize: 16,
  fontWeight: 600,
  textDecoration: "none" as const,
  border: "none",
  cursor: "pointer" as const,
  transition: "background-color 200ms ease",
};

/* ================================================================== */
/* ANIMATION — RESPECTS REDUCED MOTION                                 */
/* ================================================================== */

function useFadeIn() {
  const reduced = useReducedMotion();
  return (visible: boolean, delay = 0): React.CSSProperties =>
    reduced
      ? {}
      : {
          opacity: visible ? 1 : 0,
          transform: visible ? "translateY(0)" : "translateY(12px)",
          transition: `opacity 500ms ease-out ${delay}ms, transform 500ms ease-out ${delay}ms`,
        };
}


/* ================================================================== */
/* INDUSTRY DROPDOWN — 19 industries with modal cards                  */
/* ================================================================== */

const INDUSTRIES = [
  { name: "Real Estate", headline: "Your income is earned in lumps. Your risk is carried in between.", problem: "A strong year can still rest on a narrow set of closings, a few delayed deals, and a pipeline that looks fuller than it is.\n\nWhen listings stall, buyers hesitate, or one transaction falls apart, earnings do not fade evenly. They drop in gaps.\n\nRunPayway\u2122 evaluates deal concentration, pipeline continuity, and how much of your structure depends on timing going right.", normalization: "This is a common weakness in transaction-based income.", cta: "Stress-test my income structure" },
  { name: "Consulting / Professional Services", headline: "Your revenue may look diversified. Your continuity may not be.", problem: "Many firms and solo operators serve multiple clients, but most earnings still depend on active delivery, retained attention, and continued utilization.\n\nWhen a client leaves or workload softens, revenue rarely has a built-in floor. It resets around available work.\n\nRunPayway\u2122 evaluates client concentration, dependence on active labor, and how much of your structure continues when delivery slows.", normalization: "Many professional practices are productive without being structurally stable.", cta: "Measure my income stability" },
  { name: "Sales / Brokerage", headline: "Your compensation moves in cycles. Your exposure sits between them.", problem: "A healthy quarter can hide how much depends on timing, a few large wins, or a pipeline that has not converted yet.\n\nWhen deal flow slips or closings move out, earnings do not taper. They compress.\n\nRunPayway\u2122 evaluates pipeline dependence, concentration by opportunity size, and how vulnerable your structure is to timing shifts.", normalization: "This pattern is common in commission-driven income.", cta: "Stress-test my income structure" },
  { name: "Construction / Trades", headline: "Your revenue depends on work staying in motion.", problem: "Project-based income often looks solid while jobs are active, even when the next phase of work is not fully secured.\n\nWhen a start date moves, a bid is lost, or collections slow, the gap shows up immediately.\n\nRunPayway\u2122 evaluates project continuity, timing exposure, and how much of your structure depends on the next job arriving on schedule.", normalization: "Many trade businesses feel busy before they feel stable.", cta: "Measure my income stability" },
  { name: "Media / Entertainment", headline: "Your earnings are often tied to opportunities, not continuity.", problem: "Projects, bookings, contracts, and appearances can create strong periods of income without creating a stable underlying structure.\n\nWhen one project ends or the next opportunity is delayed, there is usually no built-in carry.\n\nRunPayway\u2122 evaluates how much of your structure depends on episodic work and how much continues between engagements.", normalization: "High visibility and high stability are not the same thing.", cta: "Run my structural assessment" },
  { name: "Legal Services", headline: "Your income may be active, concentrated, and slower to reveal its risk.", problem: "A practice can look healthy while a small number of matters, clients, or billable patterns are carrying most of the load.\n\nWhen case flow softens or a major matter concludes, the weakness is often felt after the fact.\n\nRunPayway\u2122 evaluates client concentration, forward visibility, and how dependent earnings are on ongoing active work.", normalization: "Many legal practices have momentum without much structural cushion.", cta: "Measure my income stability" },
  { name: "Healthcare", headline: "Your earnings may be steady, but the structure can still be narrow.", problem: "Many healthcare professionals rely on one employer, one system, or one reimbursement environment, even when pay appears consistent.\n\nWhen compensation models shift, hours change, or the primary source is disrupted, flexibility can be limited.\n\nRunPayway\u2122 evaluates source concentration, continuity, and how resilient your structure is when a stable system changes.", normalization: "Consistent pay is not the same as structural protection.", cta: "Measure my income stability" },
  { name: "Insurance", headline: "Your structure may look balanced while one side quietly carries the risk.", problem: "New production creates immediate earnings. Renewals create continuity. The mix between them determines whether the structure is compounding or constantly restarting.\n\nWhen new business slows, future weakness begins early. When retention slips, recurring income erodes underneath you.\n\nRunPayway\u2122 evaluates the balance between production and persistence, and how exposed your structure is if either side weakens.", normalization: "This is a common fault line in hybrid commission models.", cta: "Stress-test my income structure" },
  { name: "Retail / E-Commerce", headline: "Sales can stay active while stability weakens underneath them.", problem: "Revenue may depend on traffic, conversion, platform conditions, repeat demand, and margin discipline all holding at once.\n\nWhen demand softens or costs rise, the structure can tighten quickly even before revenue fully shows the damage.\n\nRunPayway\u2122 evaluates demand sensitivity, revenue continuity, and how exposed your structure is to external shifts you do not control.", normalization: "Many operators mistake movement for stability.", cta: "Run my structural assessment" },
  { name: "Hospitality / Food Service", headline: "Your structure depends on volume showing up on time.", problem: "Revenue is often tied to traffic, seasonality, labor efficiency, and thin margins that leave little room for interruption.\n\nWhen customer flow drops or costs move against you, the pressure is immediate. The structure has very little space to absorb it.\n\nRunPayway\u2122 evaluates volume sensitivity, timing exposure, and how stable the business remains when demand is uneven.", normalization: "This is common in service businesses with narrow operating margin.", cta: "Measure my income stability" },
  { name: "Education", headline: "Your income may be predictable, but still structurally limited.", problem: "Many education roles are tied to one institution, one pay model, and one fixed system with limited ability to expand or replace earnings quickly.\n\nWhen funding, staffing, or contract conditions change, the structure may offer little flexibility in response.\n\nRunPayway\u2122 evaluates concentration, continuity, and how adaptable your earnings structure is under change.", normalization: "Predictability and resilience are not identical.", cta: "Measure my income stability" },
  { name: "Transportation / Logistics", headline: "Your earnings depend on flow staying uninterrupted.", problem: "Routes, contracts, shipment volume, and operational consistency often determine whether revenue holds or slips.\n\nWhen demand weakens, a contract changes, or volume drops, earnings can fall with little structural buffer.\n\nRunPayway\u2122 evaluates demand dependence, timing continuity, and how much of your structure relies on uninterrupted movement.", normalization: "Many operators discover the risk only when volume breaks.", cta: "Stress-test my income structure" },
  { name: "Agriculture", headline: "Your structure is seasonal, variable, and exposed to forces outside your control.", problem: "Strong periods of production can mask how much depends on timing, yield, pricing, and conditions that do not move in your favor on command.\n\nWhen one cycle underperforms, the effect is not minor. It can reset the economics of the entire period.\n\nRunPayway\u2122 evaluates seasonal concentration, continuity across cycles, and how exposed your structure is when one variable moves against you.", normalization: "This is structural risk, not just seasonal uncertainty.", cta: "Run my structural assessment" },
  { name: "Technology", headline: "High earnings can hide a narrow structure.", problem: "Many professionals in technology rely heavily on one employer, one equity story, one bonus framework, or one compensation system.\n\nWhen that source changes, a large share of earnings can shift all at once.\n\nRunPayway\u2122 evaluates source concentration, continuity, and how much of your structure depends on one system continuing to perform.", normalization: "High compensation does not automatically create high stability.", cta: "Measure my income stability" },
  { name: "Energy / Utilities", headline: "Your income may look stable because the system around it looks stable.", problem: "But many roles in this sector depend on regulatory conditions, capital cycles, infrastructure decisions, or market structures outside individual control.\n\nWhen those conditions shift, the structure changes first and the impact follows.\n\nRunPayway\u2122 evaluates external dependency, concentration, and how resilient your earnings structure is under system-level change.", normalization: "Stability in this sector is often conditional, not absolute.", cta: "Measure my income stability" },
  { name: "Finance / Banking", headline: "A stable base can hide a variable structure.", problem: "Many compensation packages combine salary with bonus, production, deal flow, or performance-linked earnings that do not behave the same under pressure.\n\nWhen targets move, markets soften, or activity slows, a meaningful portion of pay can weaken faster than expected.\n\nRunPayway\u2122 evaluates fixed versus performance-dependent earnings and how much of your structure relies on continued output.", normalization: "Many compensation structures appear safer than they are.", cta: "Stress-test my income structure" },
  { name: "Manufacturing", headline: "Your structure depends on output, demand, and timing staying aligned.", problem: "Revenue can look dependable while production schedules, supply conditions, and customer demand are carrying more of the risk than the numbers suggest.\n\nWhen output slows or demand shifts, earnings weaken while operating burden often stays behind.\n\nRunPayway\u2122 evaluates production dependence, demand sensitivity, and how exposed your structure is when alignment breaks.", normalization: "Many operations are efficient without being resilient.", cta: "Run my structural assessment" },
  { name: "Nonprofit / Public Sector", headline: "Your income may be stable, but the structure is often constrained.", problem: "Funding cycles, budget decisions, grant allocations, and institutional limits can create predictable pay with limited control or flexibility.\n\nWhen funding priorities shift, the structure may have very little room to adapt quickly.\n\nRunPayway\u2122 evaluates concentration, institutional dependence, and how resilient your earnings structure is under budget or funding change.", normalization: "Stable does not always mean protected.", cta: "Measure my income stability" },
  { name: "Other", headline: "Your structure may not fit a standard category. That does not reduce the risk.", problem: "Mixed earnings, irregular timing, and multiple income types can create a structure that looks diversified while hiding weak points underneath.\n\nWhen one source slips or timing breaks, the interaction between sources can create pressure faster than expected.\n\nRunPayway\u2122 evaluates how your specific mix behaves under stress and where the structure is most exposed.", normalization: "Non-standard income often carries risk that is harder to see, not less real.", cta: "Run my structural assessment" },
];

function IndustryDropdown({ m, visible }: { m: boolean; visible: boolean }) {
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState<typeof INDUSTRIES[0] | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const fadeIn = useFadeIn();

  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open]);

  /* Focus trap + ESC for modal */
  useEffect(() => {
    if (!selected) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") setSelected(null);
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [selected]);

  return (
    <>
      <div style={{
        marginTop: m ? sp(5) : sp(6),
        paddingTop: m ? sp(4) : sp(5),
        borderTop: "1px solid rgba(255,255,255,0.06)",
        position: "relative", zIndex: 10,
        ...fadeIn(visible, 500),
      }}>
        <div ref={dropdownRef} style={{ position: "relative", display: "inline-block" }}>
          <button
            onClick={() => setOpen(!open)}
            aria-expanded={open}
            style={{
              display: "flex", alignItems: "center", gap: 12,
              background: open ? "rgba(255,255,255,0.08)" : "rgba(255,255,255,0.04)",
              border: "1px solid rgba(255,255,255,0.18)",
              borderRadius: 12, padding: `${sp(1.5)}px ${sp(3)}px`,
              cursor: "pointer", transition: "border-color 200ms ease, background 200ms ease",
              minHeight: 44,
            }}
            onMouseEnter={e => { if (canHover()) { e.currentTarget.style.borderColor = "rgba(255,255,255,0.30)"; e.currentTarget.style.backgroundColor = "rgba(255,255,255,0.08)"; } }}
            onMouseLeave={e => { if (!open) { e.currentTarget.style.borderColor = "rgba(255,255,255,0.18)"; e.currentTarget.style.backgroundColor = "rgba(255,255,255,0.04)"; } }}
          >
            <span style={{ fontSize: 15, fontWeight: 500, color: "rgba(244,241,234,0.55)" }}>Explore industry-specific risk patterns</span>
            <svg width="14" height="14" viewBox="0 0 12 12" fill="none" style={{ marginLeft: 2, transform: open ? "rotate(180deg)" : "rotate(0deg)", transition: "transform 200ms ease" }} aria-hidden="true">
              <path d="M3 4.5L6 7.5L9 4.5" stroke="rgba(244,241,234,0.70)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>

          {open && (
            <div role="listbox" style={{
              position: "absolute", top: "calc(100% + 8px)", left: 0,
              minWidth: m ? 280 : 320, maxHeight: 400, overflowY: "auto",
              backgroundColor: "#0E1424",
              border: "1px solid rgba(255,255,255,0.10)", borderRadius: 14,
              padding: `${sp(1)}px 0`, zIndex: 100,
              boxShadow: "0 16px 48px rgba(0,0,0,0.40)",
            }}>
              {INDUSTRIES.map(ind => (
                <button
                  role="option"
                  aria-selected={false}
                  key={ind.name}
                  onClick={() => { setSelected(ind); setOpen(false); }}
                  style={{
                    display: "block", width: "100%", textAlign: "left",
                    padding: `${sp(1.25)}px ${sp(2.5)}px`,
                    background: "none", border: "none", cursor: "pointer",
                    fontSize: 18, fontWeight: 500, color: "rgba(244,241,234,0.75)",
                    transition: "background 150ms ease, color 150ms ease",
                    minHeight: 44,
                  }}
                  onMouseEnter={e => { e.currentTarget.style.backgroundColor = "rgba(255,255,255,0.08)"; e.currentTarget.style.color = "#F4F1EA"; }}
                  onMouseLeave={e => { e.currentTarget.style.backgroundColor = "transparent"; e.currentTarget.style.color = "rgba(244,241,234,0.75)"; }}
                >
                  {ind.name}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Industry card modal */}
      {selected && (
        <div
          role="dialog"
          aria-labelledby="industry-modal-title"
          aria-modal="true"
          onClick={() => setSelected(null)}
          style={{
            position: "fixed", inset: 0, zIndex: 9999,
            backgroundColor: "rgba(0,0,0,0.75)", backdropFilter: "blur(8px)",
            display: "flex", alignItems: "center", justifyContent: "center",
            padding: m ? 20 : 40,
          }}
        >
          <div
            onClick={e => e.stopPropagation()}
            style={{
              position: "relative",
              maxWidth: 520, width: "100%",
              backgroundColor: C.white, borderRadius: 12,
              padding: m ? `${sp(5)}px ${sp(3)}px ${sp(4)}px` : `${sp(6)}px ${sp(5)}px ${sp(5)}px`,
              boxShadow: "0 24px 64px rgba(0,0,0,0.25), 0 0 0 1px rgba(14,26,43,0.06)",
            }}
          >
            <button
              onClick={() => setSelected(null)}
              aria-label="Close modal"
              style={{
                position: "absolute", top: 16, right: 16,
                width: 44, height: 44, borderRadius: 8,
                border: `1px solid ${C.border}`, backgroundColor: "transparent",
                color: C.muted, cursor: "pointer",
                display: "flex", alignItems: "center", justifyContent: "center", padding: 0,
              }}
            >
              <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" aria-hidden="true"><line x1="4" y1="4" x2="12" y2="12" /><line x1="12" y1="4" x2="4" y2="12" /></svg>
            </button>

            <div style={{
              ...T.label,
              color: C.teal, marginBottom: sp(1.5),
            }}>
              {selected.name}
            </div>

            <h3 id="industry-modal-title" style={{
              fontSize: m ? 20 : 24, fontWeight: 600, lineHeight: 1.4,
              color: C.navy, marginBottom: sp(3),
            }}>
              {selected.headline}
            </h3>

            <div style={{ marginBottom: sp(4) }}>
              {selected.problem.split("\n\n").map((para, i) => (
                <p key={i} style={{
                  ...body(m), color: C.muted,
                  marginBottom: sp(2.5),
                }}>
                  {para}
                </p>
              ))}
            </div>

            {selected.normalization && (
              <p style={{
                ...micro(), color: "rgba(14,26,43,0.45)", marginBottom: sp(5),
                fontStyle: "italic",
              }}>
                {selected.normalization}
              </p>
            )}

            <div style={{
              borderTop: `1px solid ${C.softBorder}`,
              paddingTop: sp(3),
              display: "flex", flexDirection: "column", gap: sp(2),
            }}>
              <Link
                href="/pricing"
                onClick={() => setSelected(null)}
                style={{ ...ctaButton, width: "100%" }}
                onMouseEnter={e => { if (canHover()) e.currentTarget.style.backgroundColor = "#0a1320"; }}
                onMouseLeave={e => { e.currentTarget.style.backgroundColor = C.navy; }}
              >
                {selected.cta}
              </Link>

              <Link
                href="/diagnostic-portal"
                onClick={() => setSelected(null)}
                style={{
                  display: "inline-flex", alignItems: "center", justifyContent: "center",
                  height: 48, padding: "0 32px",
                  borderRadius: 8,
                  backgroundColor: "transparent", color: C.navy,
                  border: `1px solid ${C.softBorder}`,
                  fontSize: 16, fontWeight: 600, textDecoration: "none",
                  transition: "border-color 180ms ease",
                  minHeight: 44,
                }}
                onMouseEnter={e => { if (canHover()) e.currentTarget.style.borderColor = "rgba(14,26,43,0.25)"; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = C.softBorder; }}
              >
                Get my free score first
              </Link>
            </div>
          </div>
        </div>
      )}
    </>
  );
}


/* ================================================================== */
/* VIDEO COMPONENTS                                                    */
/* ================================================================== */
function VideoModal() {
  const m = useMobile();
  const [open, setOpen] = useState(false);
  const [videoSrc, setVideoSrc] = useState("");

  useEffect(() => {
    const base = window.location.pathname.startsWith("/RunPayway") ? "/RunPayway" : "";
    setVideoSrc(`${base}/rp-video.mp4`);
  }, []);

  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") setOpen(false); };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [open]);

  if (!open) return null;

  return (
    <div role="dialog" aria-label="Video player" aria-modal="true" style={{ position: "fixed", inset: 0, zIndex: 9999, backgroundColor: "rgba(0,0,0,0.90)", display: "flex", alignItems: "center", justifyContent: "center", padding: m ? 16 : 40 }}
      onClick={() => setOpen(false)}>
      <div style={{ position: "relative", maxWidth: 960, width: "100%" }} onClick={e => e.stopPropagation()}>
        <button onClick={() => setOpen(false)} aria-label="Close video" style={{ position: "absolute", top: -44, right: 0, width: 44, height: 44, borderRadius: 8, border: "1px solid rgba(255,255,255,0.20)", backgroundColor: "rgba(0,0,0,0.50)", color: "rgba(255,255,255,0.70)", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", padding: 0 }}>
          <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" aria-hidden="true"><line x1="4" y1="4" x2="12" y2="12" /><line x1="12" y1="4" x2="4" y2="12" /></svg>
        </button>
        {videoSrc && (
          <video autoPlay playsInline preload="auto" controls style={{ width: "100%", borderRadius: 12, display: "block" }}>
            <source src={videoSrc} type="video/mp4" />
          </video>
        )}
      </div>
    </div>
  );
}

function VideoTrigger() {
  const [open, setOpen] = useState(false);
  return open ? <VideoModal /> : null;
}

function HeroVideo() {
  return <VideoTrigger />;
}


/* ================================================================== */
/* STICKY NAV                                                          */
/* ================================================================== */
function StickyNav() {
  const m = useMobile();
  const [mobileOpen, setMobileOpen] = useState(false);

  const linkColor = "rgba(244,241,234,0.55)";
  const linkHover = "#F4F1EA";

  const navLinks = [
    { label: "How It Works", href: "/#how-it-works" },
    { label: "Sample Report", href: "/sample-report" },
    { label: "Command Center", href: "/dashboard" },
    { label: "Pricing", href: "/pricing" },
  ];

  const moreLinks = [
    { label: "More", href: "/about" },
    { label: "Sign In", href: "/sign-in" },
  ];

  return (
    <>
    <nav aria-label="Primary" style={{
      position: "fixed", top: 0, left: 0, right: 0, zIndex: 100,
      backgroundColor: C.navy,
      borderBottom: "1px solid rgba(255,255,255,0.06)",
      height: m ? 56 : 64, display: "flex", alignItems: "center",
      padding: `0 ${px(m)}px`,
    }}>
      <div style={{ maxWidth: maxW, margin: "0 auto", width: "100%", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <Link href="/" style={{ display: "inline-flex", alignItems: "center" }}>
          <Image src={logoWhite} alt="RunPayway" width={120} height={14} style={{ height: "auto" }} />
        </Link>
        {!m && (
          <div style={{ display: "flex", alignItems: "center", gap: sp(3) }}>
            {navLinks.map(link => (
              <Link key={link.href} href={link.href} style={{ fontSize: 15, fontWeight: 500, color: linkColor, textDecoration: "none", transition: "color 200ms", minHeight: 44, display: "inline-flex", alignItems: "center" }}
                onMouseEnter={(e) => { if (canHover()) e.currentTarget.style.color = linkHover; }}
                onMouseLeave={(e) => { e.currentTarget.style.color = linkColor; }}
              >{link.label}</Link>
            ))}
            {moreLinks.map(link => (
              <Link key={link.href} href={link.href} style={{ fontSize: 15, fontWeight: 500, color: linkColor, textDecoration: "none", transition: "color 200ms", minHeight: 44, display: "inline-flex", alignItems: "center" }}
                onMouseEnter={(e) => { if (canHover()) e.currentTarget.style.color = linkHover; }}
                onMouseLeave={(e) => { e.currentTarget.style.color = linkColor; }}
              >{link.label}</Link>
            ))}
            <Link href="/diagnostic-portal" style={{
              backgroundColor: C.white, color: C.navy,
              padding: "8px 20px", borderRadius: 8,
              fontSize: 14, fontWeight: 600,
              textDecoration: "none",
              minHeight: 44, display: "inline-flex", alignItems: "center",
            }}>Get My Free Score</Link>
          </div>
        )}
        {m && (
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <Link href="/diagnostic-portal" style={{
              backgroundColor: C.white, color: C.navy,
              padding: "5px 14px", borderRadius: 8,
              fontSize: 14, fontWeight: 600,
              textDecoration: "none",
              minHeight: 44, display: "inline-flex", alignItems: "center",
            }}>Score</Link>
            <button onClick={() => setMobileOpen(!mobileOpen)} aria-label={mobileOpen ? "Close menu" : "Open menu"} aria-expanded={mobileOpen} style={{ background: "none", border: "none", cursor: "pointer", padding: 4, display: "flex", alignItems: "center", justifyContent: "center", width: 44, height: 44 }}>
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="#F4F1EA" strokeWidth="1.5" strokeLinecap="round" aria-hidden="true">
                {mobileOpen ? <><line x1="4" y1="4" x2="16" y2="16" /><line x1="16" y1="4" x2="4" y2="16" /></> : <><line x1="3" y1="6" x2="17" y2="6" /><line x1="3" y1="10" x2="17" y2="10" /><line x1="3" y1="14" x2="17" y2="14" /></>}
              </svg>
            </button>
          </div>
        )}
      </div>
    </nav>

    {/* Mobile menu overlay */}
    {m && mobileOpen && (
      <div style={{ position: "fixed", top: 56, left: 0, right: 0, bottom: 0, zIndex: 99, backgroundColor: C.navy, padding: `${sp(4)}px ${px(m)}px` }}>
        <div style={{ display: "flex", flexDirection: "column", gap: sp(1) }}>
          {[...navLinks, ...moreLinks].map(link => (
            <Link key={link.href} href={link.href} onClick={() => setMobileOpen(false)}
              style={{ fontSize: 16, fontWeight: 500, color: "rgba(244,241,234,0.75)", textDecoration: "none", padding: `${sp(2)}px 0`, borderBottom: "1px solid rgba(255,255,255,0.06)", minHeight: 44, display: "flex", alignItems: "center" }}>
              {link.label}
            </Link>
          ))}
        </div>
        <Link href="/diagnostic-portal" style={{
          display: "flex", alignItems: "center", justifyContent: "center",
          width: "100%", height: 56, borderRadius: 8,
          backgroundColor: C.white, color: C.navy,
          fontSize: 16, fontWeight: 600,
          textDecoration: "none", marginTop: sp(4),
        }}>
          Get My Free Score
        </Link>
      </div>
    )}
    </>
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

  useEffect(() => {
    if (!visible) return;
    const t = setTimeout(() => setShowLabel(true), 1600);
    return () => clearTimeout(t);
  }, [visible]);

  const ringSize = m ? 200 : 240;
  const radius = 70;
  const strokeWidth = 6;
  const circumference = 2 * Math.PI * radius;
  const targetOffset = (1 - 72 / 100) * circumference;

  return (
    <header ref={ref}>
      {/* ── TOP ZONE — Light ── */}
      <div style={{ backgroundColor: C.sand }}>
        <div style={{
          maxWidth: maxW, margin: "0 auto",
          paddingTop: m ? sp(16) : sp(20),
          paddingBottom: m ? sp(8) : sp(12),
          paddingLeft: px(m), paddingRight: px(m),
        }}>
          <div style={{
            display: m ? "block" : "flex",
            alignItems: "center", justifyContent: "space-between", gap: sp(8),
          }}>
            {/* Left — headline + subhead */}
            <div style={{ maxWidth: 560, textAlign: m ? "center" : "left" }}>
              <div style={{
                ...fadeIn(visible),
                ...T.label,
                color: C.teal, marginBottom: sp(2),
              }}>
                Income Stability Score&#8482;
              </div>

              <h1 style={{
                ...fadeIn(visible, 120),
                fontSize: m ? 36 : 50, fontWeight: 600, lineHeight: 1.12, letterSpacing: "-0.02em",
                color: C.navy,
                marginBottom: m ? sp(3) : sp(4),
              }}>
                Know how stable your income is before something tests it.
              </h1>

              <p style={{
                ...fadeIn(visible, 250),
                fontSize: m ? 16 : 22, fontWeight: 400, lineHeight: 1.6,
                color: "#2C3A4B",
                maxWidth: m ? undefined : 480,
              }}>
                RunPayway&#8482; measures the structure of your income — not the size of it — and shows how resilient that structure is when conditions change.
              </p>
            </div>

            {/* Right — Score specimen card */}
            <div style={{
              flexShrink: 0,
              marginTop: m ? sp(6) : 0,
              ...fadeIn(visible, 400),
            }}>
              <div style={{
                ...cardStyle,
                padding: m ? sp(5) : 52,
                maxWidth: 340,
                margin: m ? "0 auto" : undefined,
              }}>
                <div style={{
                  fontSize: 11, fontWeight: 500, letterSpacing: "0.12em", textTransform: "uppercase" as const,
                  color: C.light, marginBottom: sp(3.5),
                }}>
                  Issued Result Preview
                </div>

                <div style={{ marginBottom: sp(3.5) }}>
                  <div style={{ fontSize: 52, fontWeight: 600, color: C.purple, lineHeight: 1, fontVariantNumeric: "tabular-nums", marginBottom: sp(1.5) }} aria-label={`Score: ${animatedScore}`}>
                    {animatedScore}
                  </div>
                  <div style={{
                    fontSize: 18, fontWeight: 500, color: C.navy,
                    opacity: showLabel ? 1 : 0, transition: "opacity 500ms ease-out",
                  }}>
                    Established Stability
                  </div>
                  <div style={{
                    ...T.meta, color: C.muted, marginTop: sp(0.75),
                    opacity: showLabel ? 1 : 0, transition: "opacity 500ms ease-out 100ms",
                  }}>
                    3 points to High Stability
                  </div>
                </div>

                <div style={{ height: 1, backgroundColor: C.softBorder, marginBottom: sp(2.5) }} />

                <div style={{
                  ...T.meta, color: C.muted, marginBottom: sp(1.5),
                  opacity: showLabel ? 1 : 0, transition: "opacity 500ms ease-out 200ms",
                }}>
                  Primary constraint: Income concentration
                </div>
                <div style={{
                  ...T.meta, color: C.muted,
                  opacity: showLabel ? 1 : 0, transition: "opacity 500ms ease-out 300ms",
                }}>
                  Stress test: Largest source removed &rarr; projected 44
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── BOTTOM ZONE — Dark ── */}
      <div style={{ backgroundColor: C.navy }}>
        <div style={{
          maxWidth: maxW, margin: "0 auto",
          paddingTop: m ? sp(6) : sp(8),
          paddingBottom: m ? sp(8) : sp(10),
          paddingLeft: px(m), paddingRight: px(m),
        }}>
          {/* Trust strip */}
          <p style={{
            ...fadeIn(visible, 320),
            ...T.meta, letterSpacing: "0.02em",
            color: "rgba(244,241,234,0.40)",
            marginBottom: m ? sp(4) : sp(5),
            textAlign: m ? "center" : "left",
          }}>
            Deterministic Model RP-2.0 &bull; Fixed scoring rules &bull; Same inputs &rarr; same score &bull; No bank connection &bull; No credit pull
          </p>

          {/* CTA */}
          <div style={{ ...fadeIn(visible, 380), textAlign: m ? "center" : "left" }}>
            <Link
              href="/diagnostic-portal"
              style={{
                display: "inline-flex", alignItems: "center", justifyContent: "center",
                height: 60, width: m ? "100%" : "auto",
                padding: "16px 40px",
                borderRadius: 10,
                backgroundColor: C.white, color: C.navy,
                fontSize: 17, fontWeight: 600, letterSpacing: "-0.01em",
                textDecoration: "none",
                transition: "background-color 200ms ease",
              }}
              onMouseEnter={(e) => { if (!canHover()) return; e.currentTarget.style.backgroundColor = "#E8E5DE"; }}
              onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = C.white; }}
            >
              Get My Income Stability Score
            </Link>

            <p style={{ ...T.meta, color: "rgba(244,241,234,0.38)", marginTop: sp(2.5), letterSpacing: "0.02em" }}>
              Under 2 minutes &bull; Instant result &bull; Private by default
            </p>
          </div>

          {/* Industry dropdown */}
          <div style={{ marginTop: m ? sp(6) : sp(8), position: "relative", zIndex: 10 }}>
            <IndustryDropdown m={m} visible={visible} />
          </div>

          {/* Positioning statement */}
          <div style={{ marginTop: m ? sp(5) : sp(6), borderTop: "1px solid rgba(244,241,234,0.08)", paddingTop: m ? sp(4) : sp(5) }}>
            <p style={{
              ...fadeIn(visible, 600),
              fontSize: m ? 16 : 18, fontWeight: 400, lineHeight: 1.6,
              color: "rgba(244,241,234,0.45)",
              maxWidth: 560,
              textAlign: m ? "center" : "left",
            }}>
              Most financial tools measure outcomes. RunPayway&#8482; measures structure — before outcomes change.
            </p>
          </div>
        </div>
      </div>
    </header>
  );
}


/* ================================================================== */
/* SECTION 2 — POSITIONING BLOCK                                       */
/* ================================================================== */
function PositioningBlock() {
  const { ref, visible } = useInView();
  const m = useMobile();
  const fadeIn = useFadeIn();

  return (
    <section ref={ref} aria-label="Positioning" style={{
      backgroundColor: C.sand,
      borderTop: "1px solid rgba(14,26,43,0.08)",
      paddingTop: secPad(m), paddingBottom: secPad(m),
      paddingLeft: px(m), paddingRight: px(m),
    }}>
      <div style={{ maxWidth: 700, margin: "0 auto", ...fadeIn(visible) }}>
        <h2 style={{ ...h2Style(m), color: C.navy, lineHeight: 1.18, marginBottom: sp(3.5) }}>
          Most people know what they earned.<br />Very few know how stable it is.
        </h2>

        <p style={{ fontSize: 18, fontWeight: 500, lineHeight: 1.6, color: C.navy, marginBottom: sp(3) }}>
          Income stability is not about amount.<br />It is about structure — and whether that structure holds when something changes.
        </p>

        <p style={{ fontSize: 18, fontWeight: 400, lineHeight: 1.6, color: "#2C3A4B", marginBottom: sp(3.5) }}>
          RunPayway&#8482; measures the structural factors that determine how your income actually behaves under pressure:
        </p>

        <div style={{ marginBottom: sp(4.5) }}>
          {[
            "Dependence on a single source",
            "Income secured ahead of time",
            "Income that continues without active work",
            "How earnings change under disruption",
          ].map((item, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: sp(1.5), marginBottom: sp(2) }}>
              <span style={{ width: 5, height: 5, borderRadius: "50%", backgroundColor: C.teal, flexShrink: 0 }} />
              <span style={{ fontSize: 16, fontWeight: 400, lineHeight: 1.6, color: C.navy }}>{item}</span>
            </div>
          ))}
        </div>

        <p style={{ fontSize: 18, fontWeight: 500, lineHeight: 1.6, color: C.navy, marginTop: sp(5) }}>
          This is not a forecast.<br />It is a structural measurement.
        </p>
      </div>
    </section>
  );
}


/* ================================================================== */
/* CONSISTENCY SIGNAL STRIP                                            */
/* ================================================================== */
function ConsistencySignal() {
  return (
    <div style={{
      backgroundColor: C.sand,
      paddingTop: sp(6), paddingBottom: sp(6),
      textAlign: "center",
    }}>
      <p style={{
        ...T.label,
        color: C.light,
        letterSpacing: "0.14em",
      }}>
        Same inputs. Same result. Every time.
      </p>
    </div>
  );
}


/* ================================================================== */
/* SECTION 3 — HOW IT WORKS                                            */
/* ================================================================== */
function HowItWorksSection() {
  const { ref, visible } = useInView();
  const m = useMobile();
  const fadeIn = useFadeIn();

  const stepLabel = { fontSize: 13, fontWeight: 500, letterSpacing: "0.10em", textTransform: "uppercase" as const, color: C.light };
  const stepTitle = { ...h3Style(m), color: C.navy };
  const stepBody = { fontSize: 18, fontWeight: 400, lineHeight: 1.6, color: C.navy };
  const stepList = { fontSize: 16, fontWeight: 400, lineHeight: 1.6, color: "#2C3A4B" };
  const stepClose = { fontSize: 16, fontWeight: 400, lineHeight: 1.6, color: C.muted };
  const stepGap = m ? sp(8) : sp(10);

  return (
    <section id="how-it-works" ref={ref} aria-label="How It Works" style={{
      backgroundColor: C.sand,
      paddingTop: secPad(m), paddingBottom: secPad(m),
      paddingLeft: px(m), paddingRight: px(m),
    }}>
      <div style={{ maxWidth: maxW, margin: "0 auto" }}>

        {/* Header */}
        <div style={{ maxWidth: textMax, marginBottom: sp(6), ...fadeIn(visible) }}>
          <p style={{ fontSize: 13, fontWeight: 500, letterSpacing: "0.10em", textTransform: "uppercase" as const, color: C.teal, marginBottom: sp(2) }}>
            How It Works
          </p>
          <h2 style={{ ...h2Style(m), color: C.navy, lineHeight: 1.18, marginBottom: sp(3.5) }}>
            A structured measurement system.<br />Not an estimate. Not a guess.
          </h2>
          <p style={{ fontSize: 18, fontWeight: 400, lineHeight: 1.6, color: "#2C3A4B" }}>
            Four inputs. Six scored dimensions. One standardized result.
          </p>
        </div>

        {/* ── Step 1 ── */}
        <div style={{ marginBottom: stepGap, ...fadeIn(visible, 100) }}>
          <p style={{ ...stepLabel, marginBottom: sp(1.5) }}>Step 1</p>
          <h3 style={{ ...stepTitle, marginBottom: sp(3) }}>Operating Context</h3>
          <p style={{ ...stepBody, marginBottom: sp(3), maxWidth: textMax }}>
            You define how your income is structured.
          </p>
          <div style={{ marginBottom: sp(3) }}>
            {["Employment classification", "Operating structure", "Income model", "Industry"].map((item, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: sp(1.5), marginBottom: sp(2) }}>
                <span style={{ width: 5, height: 5, borderRadius: "50%", backgroundColor: C.teal, flexShrink: 0 }} />
                <span style={{ ...stepList }}>{item}</span>
              </div>
            ))}
          </div>
          <p style={{ ...stepClose, maxWidth: textMax }}>
            This context does not change the scoring rules.<br />It ensures the result is interpreted within the correct operating environment.
          </p>
        </div>

        {/* Divider */}
        <div style={{ height: 1, backgroundColor: C.softBorder, marginBottom: stepGap }} />

        {/* ── Step 2 ── */}
        <div style={{ marginBottom: stepGap, ...fadeIn(visible, 200) }}>
          <p style={{ ...stepLabel, marginBottom: sp(1.5) }}>Step 2</p>
          <h3 style={{ ...stepTitle, marginBottom: sp(3) }}>Structural Assessment</h3>
          <p style={{ ...stepBody, marginBottom: sp(4), maxWidth: textMax }}>
            Six structural dimensions are evaluated:
          </p>
          <div style={{ display: "grid", gridTemplateColumns: m ? "1fr" : "1fr 1fr", gap: m ? sp(2) : sp(2.5), maxWidth: 780, marginBottom: sp(4) }}>
            {[
              { dim: "Recurrence", sub: "income that continues without re-selling" },
              { dim: "Concentration", sub: "reliance on a single source" },
              { dim: "Source count", sub: "number of independent income streams" },
              { dim: "Forward visibility", sub: "income secured ahead of time" },
              { dim: "Consistency", sub: "variation in earnings over time" },
              { dim: "Labor independence", sub: "income that continues without active work" },
            ].map((d) => (
              <div key={d.dim} style={{ paddingBottom: sp(2), borderBottom: `1px solid ${C.softBorder}` }}>
                <span style={{ fontSize: 16, fontWeight: 500, color: C.navy }}>{d.dim}</span>
                <span style={{ fontSize: 16, fontWeight: 400, color: "#2C3A4B" }}> — {d.sub}</span>
              </div>
            ))}
          </div>
          <p style={{ fontSize: 16, fontWeight: 500, color: C.navy, maxWidth: textMax }}>
            Each dimension is scored using fixed definitions.<br />No interpretation. No subjective adjustment.
          </p>
        </div>

        {/* Divider */}
        <div style={{ height: 1, backgroundColor: C.softBorder, marginBottom: stepGap }} />

        {/* ── Step 3 ── */}
        <div style={{ marginBottom: stepGap, ...fadeIn(visible, 300) }}>
          <p style={{ ...stepLabel, marginBottom: sp(1.5) }}>Step 3</p>
          <h3 style={{ ...stepTitle, marginBottom: sp(3) }}>Score Generation</h3>
          <p style={{ ...stepBody, marginBottom: sp(4), maxWidth: textMax }}>
            The model produces one standardized output:
          </p>
          <div style={{ maxWidth: 400 }}>
            {[
              ["Limited", "0\u201329"],
              ["Developing", "30\u201349"],
              ["Established", "50\u201374"],
              ["High", "75\u2013100"],
            ].map(([band, range]) => (
              <div key={band} style={{ display: "flex", justifyContent: "space-between", paddingTop: sp(1.5), paddingBottom: sp(1.5), borderBottom: `1px solid ${C.softBorder}` }}>
                <span style={{ fontSize: 16, fontWeight: 500, color: C.navy }}>{band}</span>
                <span style={{ fontSize: 16, fontWeight: 400, color: C.muted, fontVariantNumeric: "tabular-nums" }}>{range}</span>
              </div>
            ))}
          </div>
          <p style={{ fontSize: 14, fontWeight: 500, color: C.muted, marginTop: sp(4) }}>
            Deterministic. Version-locked.
          </p>
        </div>

        {/* Divider */}
        <div style={{ height: 1, backgroundColor: C.softBorder, marginBottom: stepGap }} />

        {/* ── Step 4 ── */}
        <div style={{ ...fadeIn(visible, 400) }}>
          <p style={{ ...stepLabel, marginBottom: sp(1.5) }}>Step 4</p>
          <h3 style={{ ...stepTitle, marginBottom: sp(3) }}>Diagnostic Output</h3>
          <p style={{ ...stepBody, marginBottom: sp(4), maxWidth: textMax }}>
            Your score becomes a structured diagnostic:
          </p>
          <div style={{ maxWidth: textMax }}>
            {[
              "Primary structural constraint",
              "Ranked risk scenarios by impact",
              "Structural action priorities",
              "Income composition breakdown",
              "12-week execution roadmap",
              "Command Center simulation",
            ].map(item => (
              <div key={item} style={{ paddingTop: sp(1.5), paddingBottom: sp(1.5), borderBottom: `1px solid ${C.softBorder}` }}>
                <span style={{ ...stepList }}>{item}</span>
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}


/* ================================================================== */
/* SECTION 4 — HOW THE SCORE IS DETERMINED (MERGED)                    */
/* ================================================================== */
function ScoreDetermination() {
  const { ref, visible } = useInView();
  const m = useMobile();
  const fadeIn = useFadeIn();

  const dimStyle = { fontSize: 16, fontWeight: 400, lineHeight: 1.6, color: "#2C3A4B" };
  const dimName = { fontSize: 16, fontWeight: 500, color: C.navy };

  return (
    <section ref={ref} aria-label="How the Score Is Determined" style={{
      backgroundColor: C.white,
      paddingTop: secPad(m), paddingBottom: secPad(m),
      paddingLeft: px(m), paddingRight: px(m),
    }}>
      <div style={{ maxWidth: maxW, margin: "0 auto" }}>

        {/* Header */}
        <div style={{ maxWidth: textMax, marginBottom: sp(6), ...fadeIn(visible) }}>
          <h2 style={{ ...h2Style(m), color: C.navy, lineHeight: 1.18, marginBottom: sp(3) }}>
            How the Score Is Determined
          </h2>
          <p style={{ fontSize: 18, fontWeight: 400, lineHeight: 1.6, color: "#2C3A4B" }}>
            The model evaluates how income is built and how it behaves under pressure.
          </p>
        </div>

        {/* ── 60/40 Framework ── */}
        <div style={{ display: m ? "block" : "flex", gap: sp(5), marginBottom: sp(6), ...fadeIn(visible, 150) }}>

          {/* Structure — 60% */}
          <div style={{ flex: 1, marginBottom: m ? sp(5) : 0 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: sp(2), paddingBottom: sp(2), borderBottom: `1px solid ${C.softBorder}` }}>
              <span style={{ fontSize: 13, fontWeight: 500, letterSpacing: "0.10em", textTransform: "uppercase" as const, color: C.light }}>Structure</span>
              <span style={{ fontSize: 36, fontWeight: 600, color: C.purple, lineHeight: 1 }}>60%</span>
            </div>
            <p style={{ fontSize: 16, fontWeight: 400, lineHeight: 1.6, color: C.muted, marginBottom: sp(3) }}>Measures how income is built.</p>
            {[
              { n: "Recurrence", d: "income that continues without re-selling" },
              { n: "Diversification", d: "distribution across multiple sources" },
              { n: "Visibility", d: "income secured ahead of time" },
              { n: "Concentration balance", d: "reliance on any single source" },
            ].map(item => (
              <div key={item.n} style={{ marginBottom: sp(2) }}>
                <span style={dimName}>{item.n}</span>
                <span style={dimStyle}> — {item.d}</span>
              </div>
            ))}
          </div>

          {/* Stability — 40% */}
          <div style={{ flex: 1 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: sp(2), paddingBottom: sp(2), borderBottom: `1px solid ${C.softBorder}` }}>
              <span style={{ fontSize: 13, fontWeight: 500, letterSpacing: "0.10em", textTransform: "uppercase" as const, color: C.light }}>Stability</span>
              <span style={{ fontSize: 36, fontWeight: 600, color: C.purple, lineHeight: 1 }}>40%</span>
            </div>
            <p style={{ fontSize: 16, fontWeight: 400, lineHeight: 1.6, color: C.muted, marginBottom: sp(3) }}>Measures how income behaves under pressure.</p>
            {[
              { n: "Labor dependence", d: "reliance on active work" },
              { n: "Earnings consistency", d: "variability over time" },
              { n: "Continuity under disruption", d: "resilience when income changes" },
            ].map(item => (
              <div key={item.n} style={{ marginBottom: sp(2) }}>
                <span style={dimName}>{item.n}</span>
                <span style={dimStyle}> — {item.d}</span>
              </div>
            ))}
          </div>
        </div>

        {/* ── Cross-Factor Rules ── */}
        <div style={{ maxWidth: textMax, marginBottom: sp(7), ...fadeIn(visible, 300) }}>
          <p style={{ fontSize: 13, fontWeight: 500, letterSpacing: "0.10em", textTransform: "uppercase" as const, color: C.teal, marginBottom: sp(2) }}>
            Cross-Factor Rules
          </p>
          <p style={{ fontSize: 18, fontWeight: 400, lineHeight: 1.6, color: C.navy, marginBottom: sp(2.5) }}>
            Cross-factor rules account for how weaknesses compound.
          </p>
          <p style={{ fontSize: 16, fontWeight: 400, lineHeight: 1.7, color: "#2C3A4B", marginBottom: sp(1) }}>
            High concentration combined with low forward visibility increases structural risk.
          </p>
          <p style={{ fontSize: 16, fontWeight: 400, lineHeight: 1.7, color: "#2C3A4B" }}>
            Strong recurrence combined with low labor dependence increases structural stability.
          </p>
        </div>

        {/* ── Standardized Output ── */}
        <div style={{ maxWidth: textMax, marginBottom: sp(6), paddingTop: sp(6), borderTop: `1px solid ${C.softBorder}`, ...fadeIn(visible, 400) }}>
          <div style={{ display: m ? "block" : "flex", alignItems: "baseline", gap: sp(2.5), marginBottom: sp(2) }}>
            <span style={{ fontSize: 40, fontWeight: 600, color: C.purple, lineHeight: 1 }}>72</span>
            <span style={{ fontSize: 18, fontWeight: 500, color: C.navy }}>Established Stability</span>
          </div>
          <p style={{ fontSize: 14, fontWeight: 400, color: C.muted, marginBottom: sp(3) }}>
            3 points to High Stability
          </p>
          <p style={{ fontSize: 14, fontWeight: 400, color: C.muted, marginBottom: sp(1) }}>
            Primary constraint: Income concentration
          </p>
          <p style={{ fontSize: 14, fontWeight: 400, color: C.muted }}>
            Stress scenario: Largest source removed &rarr; projected 44
          </p>
        </div>

        {/* ── Closing ── */}
        <p style={{
          fontSize: 18, fontWeight: 500, lineHeight: 1.6, color: C.navy,
          maxWidth: textMax,
          ...fadeIn(visible, 450),
        }}>
          The model does not change.<br />Only the inputs change.
        </p>
      </div>
    </section>
  );
}


/* ================================================================== */
/* SECTION 5 — SAME INCOME / DIFFERENT STABILITY                       */
/* ================================================================== */
function SameIncomeDifferentStability() {
  const { ref, visible } = useInView();
  const m = useMobile();
  const fadeIn = useFadeIn();

  const listItem = (text: string) => (
    <div style={{ display: "flex", alignItems: "flex-start", gap: sp(1.5), marginBottom: 18 }}>
      <span style={{ width: 5, height: 5, borderRadius: "50%", backgroundColor: C.teal, flexShrink: 0, marginTop: 9 }} />
      <span style={{ fontSize: 18, fontWeight: 400, lineHeight: 1.6, color: C.navy }}>{text}</span>
    </div>
  );

  return (
    <section ref={ref} aria-label="Same Income Different Stability" style={{
      backgroundColor: C.sand,
      paddingTop: m ? sp(14) : sp(19), paddingBottom: m ? sp(14) : sp(19),
      paddingLeft: px(m), paddingRight: px(m),
    }}>
      <div style={{ maxWidth: maxW, margin: "0 auto" }}>

        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: sp(7), ...fadeIn(visible) }}>
          <h2 style={{ fontSize: m ? 28 : 44, fontWeight: 600, lineHeight: 1.15, color: C.navy, marginBottom: sp(2.5) }}>
            Same Income. Different Stability.
          </h2>
          <p style={{ fontSize: 20, fontWeight: 400, lineHeight: 1.5, color: "#2C3A4B" }}>
            Same income does not mean equal stability.
          </p>
        </div>

        {/* Panels */}
        <div style={{ display: m ? "block" : "grid", gridTemplateColumns: "1fr 1fr", gap: sp(4), ...fadeIn(visible, 200) }}>

          {/* Person A */}
          <div style={{
            backgroundColor: C.white, borderRadius: 12, padding: m ? sp(4) : 44,
            border: "1px solid rgba(14,26,43,0.08)",
            marginBottom: m ? sp(3) : 0,
          }}>
            <p style={{ fontSize: 14, fontWeight: 500, letterSpacing: "0.08em", textTransform: "uppercase" as const, color: C.teal, marginBottom: sp(2.5) }}>
              Person A
            </p>
            <div style={{ marginBottom: sp(3.5) }}>
              <span style={{ fontSize: 48, fontWeight: 600, color: C.purple, lineHeight: 1 }}>$150,000</span>
              <span style={{ fontSize: 18, fontWeight: 400, color: "#6A7280", marginLeft: sp(1) }}>/ year</span>
            </div>
            {listItem("1 major client (80% of income)")}
            {listItem("No forward contracts")}
            {listItem("Income stops when work stops")}
          </div>

          {/* Person B */}
          <div style={{
            backgroundColor: C.white, borderRadius: 12, padding: m ? sp(4) : 44,
            border: "1px solid rgba(14,26,43,0.08)",
          }}>
            <p style={{ fontSize: 14, fontWeight: 500, letterSpacing: "0.08em", textTransform: "uppercase" as const, color: C.teal, marginBottom: sp(2.5) }}>
              Person B
            </p>
            <div style={{ marginBottom: sp(3.5) }}>
              <span style={{ fontSize: 48, fontWeight: 600, color: C.purple, lineHeight: 1 }}>$150,000</span>
              <span style={{ fontSize: 18, fontWeight: 400, color: "#6A7280", marginLeft: sp(1) }}>/ year</span>
            </div>
            {listItem("5 clients, none over 30%")}
            {listItem("40% recurring retainers")}
            {listItem("3 months of income secured ahead of time")}
          </div>
        </div>

        {/* Closing */}
        <p style={{
          fontSize: 20, fontWeight: 600, lineHeight: 1.5, color: C.navy,
          textAlign: "center", marginTop: sp(7),
          ...fadeIn(visible, 350),
        }}>
          Structure determines stability.
        </p>
      </div>
    </section>
  );
}


/* ================================================================== */
/* SECTION 6 — SOCIAL PROOF                                            */
/* ================================================================== */
function ProofSection() {
  const { ref, visible } = useInView();
  const m = useMobile();
  const fadeIn = useFadeIn();

  const testimonials = [
    { quote: "I knew my income was concentrated. I did not realize one client leaving would change the structure that much. That changed how I approached the next quarter.", name: "Sarah M.", role: "Real Estate Agent" },
    { quote: "I had multiple income sources and still scored lower than I expected. The report showed me that almost none of it was recurring.", name: "James R.", role: "Software Contractor" },
    { quote: "I was tracking revenue, not structure. The score separated the two for the first time and made the weakness clear.", name: "Priya K.", role: "Management Consultant" },
  ];

  return (
    <section ref={ref} aria-label="Social Proof" style={{
      backgroundColor: C.sand,
      paddingTop: secPad(m), paddingBottom: secPad(m),
      paddingLeft: px(m), paddingRight: px(m),
    }}>
      <div style={{ maxWidth: maxW, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: m ? sp(5) : sp(6), ...fadeIn(visible) }}>
          <h2 style={{ ...h2Style(m), color: C.navy }}>What people found when they measured their structure</h2>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: m ? "1fr" : "repeat(3, 1fr)", gap: sp(3.5) }}>
          {testimonials.map((t, i) => (
            <div key={t.name} style={{
              paddingBottom: sp(4),
              borderBottom: `1px solid ${C.softBorder}`,
              ...fadeIn(visible, 150 + i * 100),
            }}>
              <p style={{ ...body(m), color: C.muted, fontStyle: "italic", margin: `0 0 ${sp(3)}px` }}>
                &ldquo;{t.quote}&rdquo;
              </p>
              <div>
                <div style={{ fontSize: 18, fontWeight: 500, color: C.navy, marginBottom: 2 }}>{t.name}</div>
                <div style={{ ...micro(), color: C.muted }}>{t.role}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}


/* ================================================================== */
/* SECTION 7 — DECISION CALMING (NO ANIMATION)                        */
/* ================================================================== */
function DecisionCalming() {
  const m = useMobile();

  return (
    <section aria-label="Before You Decide" style={{
      backgroundColor: C.sand,
      paddingTop: m ? sp(14) : sp(19), paddingBottom: m ? sp(14) : sp(19),
      paddingLeft: px(m), paddingRight: px(m),
    }}>
      <div style={{ maxWidth: maxW, margin: "0 auto" }}>
        <div style={{ maxWidth: 660 }}>
          <h2 style={{ fontSize: m ? 28 : 44, fontWeight: 600, lineHeight: 1.15, color: C.navy, marginBottom: sp(4) }}>
            Before You Decide
          </h2>

          <p style={{ fontSize: 20, fontWeight: 500, lineHeight: 1.55, color: C.navy, marginBottom: sp(3.5) }}>
            You do not need to buy anything right now.
          </p>

          <p style={{ fontSize: 18, fontWeight: 400, lineHeight: 1.65, color: "#2C3A4B", marginBottom: sp(3.5) }}>
            The free score tells you where you stand. If that is enough, you are done. There is no pressure to go further.
          </p>

          <p style={{ fontSize: 18, fontWeight: 400, lineHeight: 1.65, color: "#2C3A4B", marginBottom: sp(3.5) }}>
            The full diagnostic exists for people who want to understand why they scored the way they did — and what to do about it. It is a one-time purchase. No subscription. No upsell.
          </p>

          <p style={{ fontSize: 18, fontWeight: 400, lineHeight: 1.65, color: "#2C3A4B", marginBottom: 0 }}>
            If you are not sure, start with the free score. You can always come back.
          </p>

          <p style={{ fontSize: 20, fontWeight: 500, lineHeight: 1.55, color: C.navy, marginTop: sp(5) }}>
            We built this to be useful. Not urgent.
          </p>
        </div>
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

  const checkItem = (text: string) => (
    <div style={{ display: "flex", alignItems: "flex-start", gap: sp(1.5), marginBottom: 16 }}>
      <span style={{ color: C.teal, fontSize: 13, flexShrink: 0, marginTop: 4 }} aria-hidden="true">&#x2713;</span>
      <span style={{ fontSize: 16, fontWeight: 400, lineHeight: 1.6, color: C.navy }}>{text}</span>
    </div>
  );

  return (
    <section ref={ref} aria-label="Pricing" style={{
      backgroundColor: C.sand,
      paddingTop: m ? sp(14) : sp(20), paddingBottom: m ? sp(14) : sp(20),
      paddingLeft: px(m), paddingRight: px(m),
    }}>
      <div style={{ maxWidth: maxW, margin: "0 auto" }}>

        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: sp(8), ...fadeIn(visible) }}>
          <h2 style={{ fontSize: m ? 28 : 48, fontWeight: 600, lineHeight: 1.15, color: C.navy, marginBottom: sp(3) }}>
            Start with the score.<br />Go deeper only if you need the diagnosis.
          </h2>
          <p style={{ fontSize: m ? 16 : 20, fontWeight: 400, lineHeight: 1.6, color: "#2C3A4B", maxWidth: 620, margin: "0 auto" }}>
            Your score is instant and free. The full diagnostic is available when you want to understand the reasoning behind it.
          </p>
        </div>

        {/* Columns */}
        <div style={{ display: m ? "block" : "grid", gridTemplateColumns: "1fr 1fr", gap: sp(5), maxWidth: 900, margin: "0 auto", ...fadeIn(visible, 150) }}>

          {/* ── Free ── */}
          <div style={{
            backgroundColor: "#F8F7F3", borderRadius: 12, padding: m ? sp(4) : 40,
            border: "1px solid rgba(14,26,43,0.06)",
            display: "flex", flexDirection: "column" as const,
            marginBottom: m ? sp(3) : 0,
          }}>
            <p style={{ fontSize: 13, fontWeight: 500, letterSpacing: "0.08em", textTransform: "uppercase" as const, color: C.teal, marginBottom: sp(2) }}>
              Income Stability Score&#8482;
            </p>
            <div style={{ marginBottom: sp(3) }}>
              <span style={{ fontSize: 48, fontWeight: 600, color: C.purple, lineHeight: 1 }}>$0</span>
            </div>
            <p style={{ fontSize: 16, fontWeight: 400, color: "#6A7280", marginBottom: sp(3) }}>Always free. No credit card.</p>

            <div style={{ marginBottom: sp(4), flex: 1 }}>
              {checkItem("Your score out of 100")}
              {checkItem("Your stability classification")}
              {checkItem("Your primary structural constraint")}
              {checkItem("Your highest-impact improvement")}
            </div>

            <Link href="/diagnostic-portal" style={{
              ...ctaButton, width: "100%", padding: "14px 0",
              height: "auto", fontSize: 16,
            }}
              onMouseEnter={(e) => { if (!canHover()) return; e.currentTarget.style.backgroundColor = "#0a1320"; }}
              onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = C.navy; }}
            >Start Free Assessment</Link>
          </div>

          {/* ── Paid ── */}
          <div style={{
            backgroundColor: C.white, borderRadius: 12, padding: m ? sp(4) : 44,
            border: "1px solid rgba(14,26,43,0.12)",
            boxShadow: "0 1px 4px rgba(14,26,43,0.04)",
            display: "flex", flexDirection: "column" as const,
          }}>
            <p style={{ fontSize: 13, fontWeight: 500, letterSpacing: "0.08em", textTransform: "uppercase" as const, color: C.teal, marginBottom: sp(2) }}>
              RunPayway&#8482; Diagnostic Report
            </p>
            <div style={{ marginBottom: sp(1) }}>
              <span style={{ fontSize: 48, fontWeight: 600, color: C.purple, lineHeight: 1 }}>$69</span>
            </div>
            <p style={{ fontSize: 16, fontWeight: 400, color: "#6A7280", marginBottom: sp(3) }}>One-time. No subscription.</p>

            {/* Primary driver */}
            <p style={{ fontSize: 18, fontWeight: 500, lineHeight: 1.55, color: C.navy, marginBottom: sp(3) }}>
              See exactly why your income structure scores the way it does — and what would break it.
            </p>

            {/* Report outputs */}
            <p style={{ fontSize: 13, fontWeight: 500, letterSpacing: "0.08em", textTransform: "uppercase" as const, color: C.light, marginBottom: sp(1.5) }}>
              Diagnostic Report
            </p>
            <div style={{ marginBottom: sp(3) }}>
              {checkItem("Your primary structural constraint")}
              {checkItem("Where your income is most exposed")}
              {checkItem("What happens if your largest source drops")}
              {checkItem("The fastest way to improve your score")}
              {checkItem("A clear, step-by-step path forward")}
            </div>

            {/* Command Center */}
            <p style={{ fontSize: 13, fontWeight: 500, letterSpacing: "0.08em", textTransform: "uppercase" as const, color: C.light, marginBottom: sp(1.5) }}>
              Command Center
            </p>
            <div style={{ marginBottom: sp(4), flex: 1 }}>
              {checkItem("PressureMap\u2122 structural analysis")}
              {checkItem("What-if simulator for testing changes")}
              {checkItem("12-week execution roadmap")}
              {checkItem("Industry-specific benchmarks")}
            </div>

            <a href={process.env.NEXT_PUBLIC_STRIPE_CHECKOUT_URL || "https://buy.stripe.com/9B66oz48EaYU2lc4IF2Nq05"} style={{
              ...ctaButton, width: "100%", padding: "16px 0",
              height: "auto", fontSize: 16,
            }}
              onMouseEnter={(e) => { if (!canHover()) return; e.currentTarget.style.backgroundColor = "#0a1320"; }}
              onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = C.navy; }}
            >Get Full Diagnostic</a>

            <p style={{ fontSize: 14, fontWeight: 400, color: "#6A7280", textAlign: "center", marginTop: sp(2), marginBottom: 0 }}>
              Private by default. One-time analysis.
            </p>
          </div>
        </div>

        {/* Trust line */}
        <p style={{ fontSize: 15, fontWeight: 400, color: "#6A7280", textAlign: "center", marginTop: sp(6) }}>
          No account required. No preparation needed.
        </p>
      </div>
    </section>
  );
}


/* ================================================================== */
/* SECTION 9 — FAQ                                                     */
/* ================================================================== */
function FaqSection({ openFaq, setOpenFaq }: { openFaq: number | null; setOpenFaq: (v: number | null) => void }) {
  const { ref, visible } = useInView();
  const m = useMobile();
  const fadeIn = useFadeIn();

  const faqs = [
    { q: "How will the Income Stability Score impact my financial future?", a: "The Income Stability Score\u2122 measures how your income is structured and how that structure holds up under change. It gives you a clear, standardized view of where you stand \u2014 so you can make informed decisions about what to protect or adjust." },
    { q: "Who is the Income Stability Score designed for?", a: "Anyone whose income does not arrive in a fixed paycheck. Freelancers, contractors, consultants, business owners, agents, and professionals with variable or blended income structures." },
    { q: "What exactly do I get with the full diagnostic?", a: "A structured analysis of why you scored the way you did, where your income is most exposed, and what specific changes would improve your stability. It includes ranked risk scenarios, action priorities, and a 12-week execution roadmap." },
    { q: "How is the Income Stability Score different from just tracking my revenue?", a: "Revenue tells you how much came in. The score tells you how reliably it keeps coming in \u2014 and what would happen if something changed. Two people earning the same amount can have very different structural stability." },
    { q: "What is the PressureMap\u2122 and how does it help me?", a: "PressureMap\u2122 identifies the parts of your income structure most likely to weaken first under disruption. It shows where pressure concentrates so you can focus improvements on the areas that matter most." },
    { q: "What is the Command Center and how do I use it?", a: "The Command Center is where your diagnostic becomes actionable. It includes a what-if simulator to test structural changes, a 12-week roadmap, and industry-specific benchmarks \u2014 all based on your score." },
    { q: "How long does it take to get my results?", a: "The free score is delivered instantly \u2014 under two minutes. The full diagnostic report is available immediately after purchase." },
    { q: "Is my information private?", a: "Yes. There is no bank connection, no credit pull, and no external data access. Your result is based entirely on the information you provide. Private by default." },
  ];

  return (
    <section ref={ref} aria-label="Frequently Asked Questions" style={{
      backgroundColor: C.white,
      paddingTop: secPad(m), paddingBottom: secPad(m),
      paddingLeft: px(m), paddingRight: px(m),
    }}>
      <div style={{ maxWidth: 820, margin: "0 auto" }}>
        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: m ? sp(4) : sp(5), ...fadeIn(visible) }}>
          <h2 style={{ ...h2Style(m), color: C.navy, marginBottom: sp(2.5) }}>
            Frequently Asked Questions
          </h2>
          <p style={{ fontSize: m ? 16 : 18, fontWeight: 400, lineHeight: 1.6, color: "#2C3A4B", maxWidth: 560, margin: "0 auto" }}>
            Most people don&#8217;t have all the answers right now. We&#8217;re here to give you clarity on your next step.
          </p>
        </div>

        {/* Accordion */}
        <div style={{ ...fadeIn(visible, 100), marginBottom: sp(6) }}>
          {faqs.map((faq, i) => {
            const isOpen = openFaq === i;
            const panelId = `faq-panel-${i}`;
            const btnId = `faq-btn-${i}`;
            return (
              <div key={i} style={{ borderTop: `1px solid ${C.softBorder}` }}>
                <h3 style={{ margin: 0 }}>
                  <button id={btnId} onClick={() => setOpenFaq(isOpen ? null : i)} aria-expanded={isOpen} aria-controls={panelId}
                    style={{
                      width: "100%", padding: `${sp(3)}px 0`, minHeight: 48,
                      display: "flex", alignItems: "center", justifyContent: "space-between",
                      background: "none", border: "none", cursor: "pointer", textAlign: "left",
                      transition: "color 200ms ease",
                    }}>
                    <span style={{ fontSize: m ? 18 : 20, fontWeight: 500, color: C.navy, paddingRight: sp(2), lineHeight: 1.4 }}>{faq.q}</span>
                    <svg width="14" height="14" viewBox="0 0 16 16" fill="none" style={{ flexShrink: 0, transition: "transform 300ms ease", transform: isOpen ? "rotate(45deg)" : "rotate(0deg)" }} aria-hidden="true">
                      <path d="M3 8h10" stroke={C.navy} strokeWidth="1.5" strokeLinecap="round" />
                      <path d="M8 3v10" stroke={C.navy} strokeWidth="1.5" strokeLinecap="round" />
                    </svg>
                  </button>
                </h3>
                <div id={panelId} role="region" aria-labelledby={btnId} style={{
                  maxHeight: isOpen ? 500 : 0, overflow: "hidden",
                  transition: "max-height 300ms ease",
                }}>
                  <p style={{ fontSize: 18, fontWeight: 400, lineHeight: 1.65, color: "#2C3A4B", margin: 0, padding: `0 0 ${sp(3)}px` }}>{faq.a}</p>
                </div>
              </div>
            );
          })}
          <div style={{ borderTop: `1px solid ${C.softBorder}` }} />
        </div>

        {/* Bottom CTA */}
        <div style={{ textAlign: "center", ...fadeIn(visible, 200) }}>
          <p style={{ fontSize: 18, fontWeight: 400, lineHeight: 1.6, color: "#2C3A4B", marginBottom: sp(3) }}>
            Still have questions? Get in touch for personalized guidance.
          </p>
          <Link href="/contact" style={{
            ...ctaButton,
            padding: "16px 40px", height: "auto",
          }}
            onMouseEnter={(e) => { if (!canHover()) return; e.currentTarget.style.backgroundColor = "#0a1320"; }}
            onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = C.navy; }}
          >Contact Us</Link>
        </div>
      </div>
    </section>
  );
}


/* ================================================================== */
/* SECTION 10 — FINAL CTA                                              */
/* ================================================================== */
function FinalCta() {
  const { ref, visible } = useInView();
  const m = useMobile();
  const fadeIn = useFadeIn();

  return (
    <section ref={ref} aria-label="Final Call to Action" style={{
      backgroundColor: C.sand,
      paddingTop: m ? sp(14) : sp(22), paddingBottom: m ? sp(14) : sp(22),
      paddingLeft: px(m), paddingRight: px(m), textAlign: "center",
    }}>
      <div style={{ maxWidth: 660, margin: "0 auto", ...fadeIn(visible) }}>
        <h2 style={{ fontSize: m ? 28 : 44, fontWeight: 600, lineHeight: 1.15, color: C.navy, marginBottom: sp(4) }}>
          Take Your Time. Understand What You&#8217;re Really Getting.
        </h2>

        <p style={{ fontSize: 20, fontWeight: 500, lineHeight: 1.55, color: C.navy, marginBottom: sp(3.5), textAlign: "left" }}>
          Your income has a structure. Now you can see it.
        </p>

        <p style={{ fontSize: 18, fontWeight: 400, lineHeight: 1.65, color: "#2C3A4B", marginBottom: sp(3.5), textAlign: "left" }}>
          The free score takes under two minutes and shows you exactly where your income stands. No preparation required.
        </p>

        <p style={{ fontSize: 18, fontWeight: 400, lineHeight: 1.65, color: "#2C3A4B", marginBottom: sp(5), textAlign: "left" }}>
          When you are ready for the full picture — why you scored the way you did, where the structure is exposed, and what to change — the diagnostic is there.
        </p>

        <p style={{ fontSize: 18, fontWeight: 400, lineHeight: 1.6, color: "#2C3A4B", marginBottom: sp(4), textAlign: "center" }}>
          Start with the score. Go deeper only if you need to.
        </p>

        <div style={{ textAlign: "center" }}>
          <Link href="/diagnostic-portal" style={{
            display: "inline-flex", alignItems: "center", justifyContent: "center",
            height: 60, padding: "0 48px", borderRadius: 10,
            backgroundColor: C.navy, color: C.white,
            fontSize: 17, fontWeight: 600, letterSpacing: "-0.01em",
            textDecoration: "none",
            transition: "background-color 200ms ease",
          }}
            onMouseEnter={(e) => { if (!canHover()) return; e.currentTarget.style.backgroundColor = "#0a1320"; }}
            onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = C.navy; }}
          >
            Start Free Assessment
          </Link>

          <p style={{ ...T.meta, color: C.muted, marginTop: sp(2.5) }}>
            Under 2 minutes &bull; Instant result &bull; Private by default
          </p>
        </div>

        {/* Disclaimer */}
        <p style={{ ...T.micro, color: C.light, textAlign: "center", maxWidth: 640, margin: `${sp(8)}px auto 0`, lineHeight: 1.6 }}>
          The Income Stability Score&#8482; is a structural income assessment based on information provided by the user. It does not provide financial advice, investment advice, credit underwriting, or prediction of future outcomes.
        </p>
      </div>
    </section>
  );
}


/* ================================================================== */
/* DISCLAIMER                                                          */
/* ================================================================== */
/* ================================================================== */
/* FOOTER                                                              */
/* ================================================================== */
function Footer() {
  const m = useMobile();
  const [email, setEmail] = useState("");

  const colHeadStyle: React.CSSProperties = {
    ...T.label,
    color: C.navy, marginBottom: sp(2),
  };

  const linkStyle: React.CSSProperties = {
    fontSize: 15, fontWeight: 400, color: C.muted, textDecoration: "none",
    display: "block", marginBottom: sp(1.5), transition: "color 200ms",
    lineHeight: 1.5,
  };

  return (
    <footer style={{
      backgroundColor: C.white,
      borderTop: `1px solid ${C.softBorder}`,
      paddingTop: m ? sp(8) : sp(10), paddingBottom: sp(6),
      paddingLeft: px(m), paddingRight: px(m),
    }}>
      <div style={{ maxWidth: maxW, margin: "0 auto" }}>
        {/* Columns */}
        <div style={{
          display: "grid",
          gridTemplateColumns: m ? "1fr 1fr" : "1fr 1fr 1fr 1.5fr 0.8fr",
          gap: m ? sp(4) : sp(3),
          marginBottom: sp(6),
        }}>
          {/* Product */}
          <div>
            <div style={colHeadStyle}>Product</div>
            {[
              { label: "How It Works", href: "/#how-it-works" },
              { label: "Sample Report", href: "/sample-report" },
              { label: "Command Center", href: "/dashboard" },
              { label: "Methodology", href: "/methodology" },
              { label: "Pricing", href: "/pricing" },
            ].map(l => (
              <Link key={l.href} href={l.href} style={linkStyle}
                onMouseEnter={e => { e.currentTarget.style.color = C.navy; }}
                onMouseLeave={e => { e.currentTarget.style.color = C.muted; }}
              >{l.label}</Link>
            ))}
          </div>

          {/* Company */}
          <div>
            <div style={colHeadStyle}>Company</div>
            {[
              { label: "About", href: "/about" },
              { label: "Contact", href: "/contact" },
            ].map(l => (
              <Link key={l.href} href={l.href} style={linkStyle}
                onMouseEnter={e => { e.currentTarget.style.color = C.navy; }}
                onMouseLeave={e => { e.currentTarget.style.color = C.muted; }}
              >{l.label}</Link>
            ))}
          </div>

          {/* Governance */}
          <div>
            <div style={colHeadStyle}>Governance</div>
            {[
              { label: "Privacy Policy", href: "/privacy" },
              { label: "Terms of Use", href: "/terms" },
              { label: "Accessibility", href: "/accessibility" },
              { label: "Acceptable Use Policy", href: "/acceptable-use" },
              { label: "Security Practices", href: "/security" },
              { label: "Model Version Policy", href: "/model-version" },
            ].map(l => (
              <Link key={l.href} href={l.href} style={linkStyle}
                onMouseEnter={e => { e.currentTarget.style.color = C.navy; }}
                onMouseLeave={e => { e.currentTarget.style.color = C.muted; }}
              >{l.label}</Link>
            ))}
          </div>

          {/* Enterprise */}
          <div>
            <div style={colHeadStyle}>Enterprise</div>
            <p style={{ fontSize: 14, color: "rgba(244,241,234,0.55)", marginBottom: sp(2), lineHeight: 1.5 }}>
              RunPayway&#8482; for Organizations
            </p>
            <div style={{ display: "flex", gap: 8 }}>
              <input
                type="email"
                placeholder="Work email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                aria-label="Work email for enterprise waitlist"
                style={{
                  flex: 1, padding: "8px 12px", borderRadius: 6,
                  border: `1px solid ${C.softBorder}`,
                  backgroundColor: C.sand,
                  color: C.navy, fontSize: 14,
                  outline: "none", minHeight: 44,
                }}
              />
              <button
                onClick={() => { if (email) { setEmail(""); } }}
                style={{
                  padding: "8px 16px", borderRadius: 6,
                  backgroundColor: C.navy,
                  border: "none",
                  color: C.white, fontSize: 13, fontWeight: 600,
                  cursor: "pointer", whiteSpace: "nowrap", minHeight: 44,
                }}
              >
                Join the Waitlist
              </button>
            </div>
          </div>

          {/* Social */}
          <div>
            <div style={colHeadStyle}>Social</div>
            {[
              { label: "LinkedIn", href: "https://linkedin.com" },
              { label: "X", href: "https://x.com" },
              { label: "Instagram", href: "https://instagram.com" },
            ].map(l => (
              <a key={l.label} href={l.href} target="_blank" rel="noopener noreferrer" style={linkStyle}
                onMouseEnter={e => { e.currentTarget.style.color = C.navy; }}
                onMouseLeave={e => { e.currentTarget.style.color = C.muted; }}
              >{l.label}</a>
            ))}
          </div>
        </div>

        {/* Disclaimer */}
        <div style={{ borderTop: `1px solid ${C.softBorder}`, paddingTop: sp(4), marginBottom: sp(3) }}>
          <p style={{ ...T.micro, color: C.light, textAlign: "center", maxWidth: 640, margin: "0 auto", marginBottom: sp(3) }}>
            The Income Stability Score&#8482; is a structural income assessment based on information provided by the user.
            It does not provide financial advice, investment advice, credit underwriting, or prediction of future outcomes.
          </p>

          {/* Language line */}
          <p style={{ fontSize: 13, color: C.light, textAlign: "center", marginBottom: sp(2) }}>
            Available in: English &bull; Espa&ntilde;ol (Q3 2026) &bull; Portugu&ecirc;s (Q4 2026) &bull; &#2361;&#2367;&#2344;&#2381;&#2342;&#2368; (Q4 2026)
          </p>
        </div>

        {/* Authority line */}
        <p style={{ fontSize: 13, color: C.light, textAlign: "center", marginBottom: sp(2) }}>
          A structural income measurement system.
        </p>

        {/* Legal */}
        <p style={{ ...T.micro, color: C.light, textAlign: "center", lineHeight: 1.6, maxWidth: 700, margin: "0 auto" }}>
          &copy; 2026 RunPayway&#8482;. All rights reserved. RunPayway&#8482; is a product of PeopleStar Enterprises, LLC. Orange County, California, USA. Structural Stability Model RP-2.0.
        </p>
      </div>
    </footer>
  );
}


/* ================================================================== */
/* STRUCTURED DATA                                                     */
/* ================================================================== */
const FAQ_SCHEMA = {
  "@context": "https://schema.org", "@type": "FAQPage",
  mainEntity: [
    { "@type": "Question", name: "What is the Income Stability Score?", acceptedAnswer: { "@type": "Answer", text: "A standardized measure of how stable your income structure is under disruption. It evaluates six dimensions and returns a score out of 100 with a stability band." } },
    { "@type": "Question", name: "Who is this built for?", acceptedAnswer: { "@type": "Answer", text: "Independent professionals, freelancers, consultants, contractors, and small business owners." } },
    { "@type": "Question", name: "What does the full diagnostic include?", acceptedAnswer: { "@type": "Answer", text: "A full diagnostic report, PressureMap with zone analysis, Command Center with what-if simulator, industry-specific scripts, a 12-week roadmap, and peer benchmarking." } },
    { "@type": "Question", name: "How is this different from revenue tracking?", acceptedAnswer: { "@type": "Answer", text: "Revenue measures how much you earn. This measures how stable that income is under disruption." } },
    { "@type": "Question", name: "What is the PressureMap?", acceptedAnswer: { "@type": "Answer", text: "A structural analysis of your income zones — where pressure concentrates and how your structure compares to peers." } },
    { "@type": "Question", name: "What is the Command Center?", acceptedAnswer: { "@type": "Answer", text: "A diagnostic tool with a what-if simulator, industry-specific scripts, a 12-week roadmap, and progress tracking." } },
    { "@type": "Question", name: "How long does it take?", acceptedAnswer: { "@type": "Answer", text: "Under two minutes. Instant results." } },
    { "@type": "Question", name: "Is my data private?", acceptedAnswer: { "@type": "Answer", text: "Yes. No bank connections. No credit pulls. Private by default." } },
  ],
};

const PRODUCT_SCHEMA = {
  "@context": "https://schema.org", "@type": "Product",
  name: "RunPayway Income Stability Score",
  description: "A structural assessment that measures how stable your income structure is — not how much you make.",
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
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  return (
    <div className="overflow-x-hidden">
      {/* Skip link */}
      <a
        href="#main-content"
        style={{
          position: "absolute", left: "-9999px", top: "auto",
          width: 1, height: 1, overflow: "hidden",
          zIndex: 9999, padding: "12px 24px",
          backgroundColor: C.navy, color: C.white,
          fontSize: 14, fontWeight: 600, textDecoration: "none",
          borderRadius: 8,
        }}
        onFocus={e => {
          e.currentTarget.style.position = "fixed";
          e.currentTarget.style.left = "16px";
          e.currentTarget.style.top = "16px";
          e.currentTarget.style.width = "auto";
          e.currentTarget.style.height = "auto";
        }}
        onBlur={e => {
          e.currentTarget.style.position = "absolute";
          e.currentTarget.style.left = "-9999px";
          e.currentTarget.style.width = "1px";
          e.currentTarget.style.height = "1px";
        }}
      >
        Skip to main content
      </a>

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(FAQ_SCHEMA) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(PRODUCT_SCHEMA) }} />
      <StickyNav />
      <main id="main-content">
        <HeroSection />
        <HeroVideo />
        <PositioningBlock />
        <HowItWorksSection />
        <ScoreDetermination />
        <SameIncomeDifferentStability />
        <ProofSection />
        <DecisionCalming />
        <FaqSection openFaq={openFaq} setOpenFaq={setOpenFaq} />
        <PricingSection />
        <FinalCta />
      </main>
    </div>
  );
}
