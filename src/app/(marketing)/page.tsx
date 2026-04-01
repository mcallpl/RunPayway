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
};

const sp = (n: number) => n * 8;

/* Typography — Inter */
const T = {
  h1:    { desktop: { fontSize: 40, fontWeight: 600, lineHeight: 1.5 }, mobile: { fontSize: 32, fontWeight: 600, lineHeight: 1.5 } },
  h2:    { desktop: { fontSize: 28, fontWeight: 600, lineHeight: 1.5 }, mobile: { fontSize: 24, fontWeight: 600, lineHeight: 1.5 } },
  h3:    { desktop: { fontSize: 20, fontWeight: 500, lineHeight: 1.5 }, mobile: { fontSize: 18, fontWeight: 500, lineHeight: 1.5 } },
  body:  { desktop: { fontSize: 16, fontWeight: 400, lineHeight: 1.6 }, mobile: { fontSize: 15, fontWeight: 400, lineHeight: 1.6 } },
  micro: { desktop: { fontSize: 13, fontWeight: 400, lineHeight: 1.5 }, mobile: { fontSize: 12, fontWeight: 400, lineHeight: 1.5 } },
};

const maxW = 1100;
const padX = { desktop: 40, mobile: 20 };

const h1 = (m: boolean) => m ? T.h1.mobile : T.h1.desktop;
const h2Style = (m: boolean) => m ? T.h2.mobile : T.h2.desktop;
const h3Style = (m: boolean) => m ? T.h3.mobile : T.h3.desktop;
const body = (m: boolean) => m ? T.body.mobile : T.body.desktop;
const micro = (m: boolean) => m ? T.micro.mobile : T.micro.desktop;
const px = (m: boolean) => m ? padX.mobile : padX.desktop;

const cardStyle = {
  borderRadius: 12,
  border: `1px solid ${C.border}`,
  backgroundColor: C.white,
};

const fadeIn = (visible: boolean, delay = 0) => ({
  opacity: visible ? 1 : 0,
  transform: visible ? "translateY(0)" : "translateY(16px)",
  transition: `opacity 600ms ease-out ${delay}ms, transform 600ms ease-out ${delay}ms`,
});

const ctaButton = {
  display: "inline-flex" as const,
  alignItems: "center" as const,
  justifyContent: "center" as const,
  height: 48,
  padding: "0 32px",
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

  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open]);

  return (
    <>
      <div style={{
        marginTop: m ? sp(5) : sp(6),
        paddingTop: m ? sp(4) : sp(5),
        borderTop: "1px solid rgba(255,255,255,0.06)",
        ...fadeIn(visible, 500),
      }}>
        <div ref={dropdownRef} style={{ position: "relative", display: "inline-block" }}>
          <button
            onClick={() => setOpen(!open)}
            style={{
              display: "flex", alignItems: "center", gap: 12,
              background: open ? "rgba(255,255,255,0.08)" : "rgba(255,255,255,0.04)",
              border: "1px solid rgba(255,255,255,0.18)",
              borderRadius: 12, padding: `${sp(1.5)}px ${sp(3)}px`,
              cursor: "pointer", transition: "border-color 200ms ease, background 200ms ease, box-shadow 200ms ease",
              boxShadow: open ? "0 4px 20px rgba(0,0,0,0.20)" : "0 2px 12px rgba(0,0,0,0.10)",
            }}
            onMouseEnter={e => { if (canHover()) { e.currentTarget.style.borderColor = "rgba(255,255,255,0.30)"; e.currentTarget.style.backgroundColor = "rgba(255,255,255,0.08)"; e.currentTarget.style.boxShadow = "0 4px 20px rgba(0,0,0,0.20)"; } }}
            onMouseLeave={e => { if (!open) { e.currentTarget.style.borderColor = "rgba(255,255,255,0.18)"; e.currentTarget.style.backgroundColor = "rgba(255,255,255,0.04)"; e.currentTarget.style.boxShadow = "0 2px 12px rgba(0,0,0,0.10)"; } }}
          >
            <span style={{ fontSize: 24, fontWeight: 700, color: C.teal }}>19</span>
            <span style={{ fontSize: 18, fontWeight: 600, color: "rgba(244,241,234,0.70)", letterSpacing: "0.01em" }}>industries benchmarked</span>
            <svg width="14" height="14" viewBox="0 0 12 12" fill="none" style={{ marginLeft: 2, transform: open ? "rotate(180deg)" : "rotate(0deg)", transition: "transform 200ms ease" }}>
              <path d="M3 4.5L6 7.5L9 4.5" stroke="rgba(244,241,234,0.70)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>

          {open && (
            <div style={{
              position: "absolute", top: "calc(100% + 8px)", left: 0,
              minWidth: m ? 280 : 320, maxHeight: 400, overflowY: "auto",
              backgroundColor: "#0E1424",
              border: "1px solid rgba(255,255,255,0.10)", borderRadius: 14,
              padding: `${sp(1)}px 0`, zIndex: 100,
              boxShadow: "0 16px 48px rgba(0,0,0,0.40)",
              animation: "dropIn 200ms ease-out",
            }}>
              {INDUSTRIES.map(ind => (
                <button
                  key={ind.name}
                  onClick={() => { setSelected(ind); setOpen(false); }}
                  style={{
                    display: "block", width: "100%", textAlign: "left",
                    padding: `${sp(1.25)}px ${sp(2.5)}px`,
                    background: "none", border: "none", cursor: "pointer",
                    fontSize: 18, fontWeight: 500, color: "rgba(244,241,234,0.75)",
                    transition: "background 150ms ease, color 150ms ease",
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
          onClick={() => setSelected(null)}
          style={{
            position: "fixed", inset: 0, zIndex: 9999,
            backgroundColor: "rgba(0,0,0,0.75)", backdropFilter: "blur(8px)",
            display: "flex", alignItems: "center", justifyContent: "center",
            padding: m ? 20 : 40,
            animation: "fadeInOverlay 250ms ease-out",
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
              animation: "cardIn 300ms cubic-bezier(0.22, 1, 0.36, 1)",
            }}
          >
            <button
              onClick={() => setSelected(null)}
              style={{
                position: "absolute", top: 16, right: 16,
                width: 32, height: 32, borderRadius: 8,
                border: `1px solid ${C.border}`, backgroundColor: "transparent",
                color: C.muted, cursor: "pointer",
                display: "flex", alignItems: "center", justifyContent: "center", padding: 0,
              }}
            >
              <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><line x1="4" y1="4" x2="12" y2="12" /><line x1="12" y1="4" x2="4" y2="12" /></svg>
            </button>

            <div style={{
              fontSize: 13, fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase" as const,
              color: C.teal, marginBottom: sp(1.5),
            }}>
              {selected.name}
            </div>

            <h3 style={{
              fontSize: m ? 20 : 24, fontWeight: 600, lineHeight: 1.4,
              color: C.navy, marginBottom: sp(3),
            }}>
              {selected.headline}
            </h3>

            <div style={{ marginBottom: sp(4) }}>
              {selected.problem.split("\n\n").map((para, i) => (
                <p key={i} style={{
                  fontSize: 16, fontWeight: 400, color: C.muted,
                  lineHeight: 1.6, marginBottom: sp(2),
                }}>
                  {para}
                </p>
              ))}
            </div>

            {selected.normalization && (
              <p style={{
                fontSize: 13, fontWeight: 400, lineHeight: 1.5,
                color: "rgba(14,26,43,0.45)", marginBottom: sp(5),
                fontStyle: "italic",
              }}>
                {selected.normalization}
              </p>
            )}

            <div style={{
              borderTop: `1px solid ${C.border}`,
              paddingTop: sp(3),
              display: "flex", flexDirection: "column", gap: sp(2),
            }}>
              <Link
                href="/pricing"
                onClick={() => setSelected(null)}
                style={{
                  ...ctaButton,
                  width: "100%",
                }}
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
                  border: `1px solid ${C.border}`,
                  fontSize: 16, fontWeight: 600, textDecoration: "none",
                  transition: "border-color 180ms ease",
                }}
                onMouseEnter={e => { if (canHover()) e.currentTarget.style.borderColor = "rgba(14,26,43,0.25)"; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = C.border; }}
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

  if (!open) return null;

  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 9999, backgroundColor: "rgba(0,0,0,0.90)", display: "flex", alignItems: "center", justifyContent: "center", padding: m ? 16 : 40 }}
      onClick={() => setOpen(false)}>
      <div style={{ position: "relative", maxWidth: 960, width: "100%" }} onClick={e => e.stopPropagation()}>
        <button onClick={() => setOpen(false)} style={{ position: "absolute", top: -44, right: 0, width: 36, height: 36, borderRadius: 8, border: "1px solid rgba(255,255,255,0.20)", backgroundColor: "rgba(0,0,0,0.50)", color: "rgba(255,255,255,0.70)", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", padding: 0 }}>
          <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><line x1="4" y1="4" x2="12" y2="12" /><line x1="12" y1="4" x2="4" y2="12" /></svg>
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

  return (
    <>
    <nav style={{
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
            {[
              { label: "Command Center", href: "/dashboard" },
              { label: "Sample Report", href: "/sample-report" },
              { label: "Pricing", href: "/pricing" },
            ].map(link => (
              <Link key={link.href} href={link.href} style={{ fontSize: 14, fontWeight: 500, color: linkColor, textDecoration: "none", transition: "color 200ms" }}
                onMouseEnter={(e) => { if (canHover()) e.currentTarget.style.color = linkHover; }}
                onMouseLeave={(e) => { e.currentTarget.style.color = linkColor; }}
              >{link.label}</Link>
            ))}
            <Link href="/diagnostic-portal" style={{
              backgroundColor: C.navy, color: C.white,
              padding: "8px 20px", borderRadius: 8,
              fontSize: 14, fontWeight: 600,
              textDecoration: "none",
              border: "1px solid rgba(255,255,255,0.15)",
            }}>Get My Free Score</Link>
          </div>
        )}
        {m && (
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <Link href="/diagnostic-portal" style={{
              backgroundColor: C.navy, color: C.white,
              padding: "5px 14px", borderRadius: 8,
              fontSize: 14, fontWeight: 600,
              textDecoration: "none",
              border: "1px solid rgba(255,255,255,0.15)",
            }}>Score</Link>
            <button onClick={() => setMobileOpen(!mobileOpen)} style={{ background: "none", border: "none", cursor: "pointer", padding: 4, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="#F4F1EA" strokeWidth="1.5" strokeLinecap="round">
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
          {[
            { label: "Command Center", href: "/dashboard" },
            { label: "Sample Report", href: "/sample-report" },
            { label: "Pricing", href: "/pricing" },
          ].map(link => (
            <Link key={link.href} href={link.href} onClick={() => setMobileOpen(false)}
              style={{ fontSize: 16, fontWeight: 500, color: "rgba(244,241,234,0.75)", textDecoration: "none", padding: `${sp(2)}px 0`, borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
              {link.label}
            </Link>
          ))}
        </div>
        <Link href="/diagnostic-portal" style={{
          display: "flex", alignItems: "center", justifyContent: "center",
          width: "100%", height: 48, borderRadius: 8,
          backgroundColor: C.navy, color: C.white,
          fontSize: 16, fontWeight: 600,
          textDecoration: "none", marginTop: sp(4),
          border: "1px solid rgba(255,255,255,0.15)",
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
    <section ref={ref} aria-label="Hero" style={{ backgroundColor: C.navy }}>
      <div style={{
        maxWidth: maxW, margin: "0 auto",
        paddingTop: m ? sp(14) : sp(18),
        paddingBottom: m ? sp(10) : sp(14),
        paddingLeft: px(m), paddingRight: px(m),
      }}>
        <div style={{
          display: m ? "block" : "flex",
          alignItems: "center", justifyContent: "space-between", gap: sp(8),
        }}>
          {/* Left — text */}
          <div style={{ maxWidth: 600, textAlign: m ? "center" : "left" }}>
            <div style={{
              ...fadeIn(visible),
              fontSize: 13, fontWeight: 500, letterSpacing: "0.12em", textTransform: "uppercase" as const,
              color: C.teal, marginBottom: m ? sp(3) : sp(4),
            }}>
              Income Stability Score&#8482;
            </div>

            <h1 style={{
              ...fadeIn(visible, 120),
              ...h1(m),
              color: C.sand,
              marginBottom: m ? sp(3) : sp(4),
            }}>
              Know how stable your income is before something tests it.
            </h1>

            <p style={{
              ...fadeIn(visible, 250),
              ...body(m),
              color: "rgba(244,241,234,0.50)",
              marginBottom: m ? sp(4) : sp(5),
              maxWidth: m ? undefined : 500,
            }}>
              RunPayway&#8482; measures how your income is built — not how much you make — and shows how well it holds up under real-world disruption.
            </p>

            {/* Trust strip */}
            <p style={{
              ...fadeIn(visible, 320),
              ...micro(m),
              color: "rgba(244,241,234,0.35)",
              marginBottom: m ? sp(4) : sp(5),
            }}>
              Deterministic Model RP-2.0 &bull; Same inputs &rarr; same score &bull; No bank connection &bull; No credit pull
            </p>

            <div style={fadeIn(visible, 380)}>
              <Link
                href="/diagnostic-portal"
                style={{
                  display: "inline-flex", alignItems: "center", justifyContent: "center",
                  height: 48, width: m ? "100%" : "auto",
                  padding: "0 32px",
                  borderRadius: 8,
                  backgroundColor: C.white, color: C.navy,
                  fontSize: 16, fontWeight: 600,
                  textDecoration: "none",
                  transition: "background-color 200ms ease",
                }}
                onMouseEnter={(e) => { if (!canHover()) return; e.currentTarget.style.backgroundColor = "#E8E5DE"; }}
                onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = C.white; }}
              >
                Get My Free Score
              </Link>

              <p style={{ ...micro(m), color: "rgba(244,241,234,0.35)", marginTop: sp(2) }}>
                Under 2 minutes &bull; Instant result &bull; Private by default
              </p>
            </div>
          </div>

          {/* Right — Example Panel */}
          <div style={{
            flexShrink: 0,
            marginTop: m ? sp(7) : 0,
            ...fadeIn(visible, 400),
          }}>
            <div style={{
              ...cardStyle,
              padding: sp(4),
              maxWidth: 320,
              margin: m ? "0 auto" : undefined,
            }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: sp(2) }}>
                {/* Score ring + number */}
                <div style={{ position: "relative", width: 80, height: 80 }}>
                  <svg width={80} height={80} viewBox="0 0 160 160" style={{ transform: "rotate(-90deg)" }}>
                    <circle cx="80" cy="80" r={radius} fill="none" stroke="rgba(14,26,43,0.08)" strokeWidth={strokeWidth} />
                    <circle cx="80" cy="80" r={radius} fill="none" stroke={C.teal} strokeWidth={strokeWidth}
                      strokeLinecap="round" strokeDasharray={circumference}
                      strokeDashoffset={visible ? targetOffset : circumference}
                      style={{ transition: "stroke-dashoffset 2s cubic-bezier(0.22, 1, 0.36, 1)" }}
                    />
                  </svg>
                  <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <span style={{ fontSize: 24, fontWeight: 600, color: C.purple, fontVariantNumeric: "tabular-nums" }}>
                      {animatedScore}
                    </span>
                  </div>
                </div>
                <div style={{ textAlign: "right" }}>
                  <div style={{ fontSize: 40, fontWeight: 600, color: C.purple }}>{animatedScore}</div>
                </div>
              </div>

              <div style={{
                fontSize: 16, fontWeight: 500, color: C.navy, marginBottom: sp(0.5),
                opacity: showLabel ? 1 : 0, transition: "opacity 500ms ease-out",
              }}>
                Established Stability
              </div>
              <div style={{
                ...micro(m), color: C.muted, marginBottom: sp(2),
                opacity: showLabel ? 1 : 0, transition: "opacity 500ms ease-out 100ms",
              }}>
                3 points to High Stability
              </div>

              <div style={{ height: 1, backgroundColor: C.border, marginBottom: sp(2) }} />

              <div style={{
                ...micro(m), color: C.muted, marginBottom: sp(1),
                opacity: showLabel ? 1 : 0, transition: "opacity 500ms ease-out 200ms",
              }}>
                Primary constraint: Income concentration
              </div>
              <div style={{
                ...micro(m), color: C.muted,
                opacity: showLabel ? 1 : 0, transition: "opacity 500ms ease-out 300ms",
              }}>
                Stress test: Largest source removed &rarr; projected 44
              </div>
            </div>
          </div>
        </div>

        {/* Industry dropdown bar */}
        <IndustryDropdown m={m} visible={visible} />
      </div>
    </section>
  );
}


/* ================================================================== */
/* SECTION 2 — POSITIONING BLOCK                                       */
/* ================================================================== */
function PositioningBlock() {
  const { ref, visible } = useInView();
  const m = useMobile();

  return (
    <section ref={ref} aria-label="Positioning" style={{
      backgroundColor: C.sand,
      paddingTop: sp(12), paddingBottom: sp(12),
      paddingLeft: px(m), paddingRight: px(m),
    }}>
      <div style={{ maxWidth: 720, margin: "0 auto", ...fadeIn(visible) }}>
        <h2 style={{ ...h2Style(m), color: C.navy, marginBottom: sp(4) }}>
          Most people track income. Very few understand how stable it is.
        </h2>

        <p style={{ ...body(m), color: C.muted, marginBottom: sp(3) }}>
          Income stability is not about how much you earn. It is about how your income is built — and whether the structure holds when conditions change.
        </p>

        <p style={{ ...body(m), color: C.muted, marginBottom: sp(4) }}>
          RunPayway&#8482; measures the structural properties of your income:
        </p>

        <div style={{ marginBottom: sp(4) }}>
          {[
            "How dependent you are on single sources",
            "How much income is already secured ahead of time",
            "How much continues without active work",
            "How your income behaves under disruption",
          ].map((item, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: sp(1.5), marginBottom: sp(1.5) }}>
              <span style={{ width: 6, height: 6, borderRadius: "50%", backgroundColor: C.teal, flexShrink: 0 }} />
              <span style={{ ...body(m), color: C.navy }}>{item}</span>
            </div>
          ))}
        </div>

        <p style={{ ...body(m), fontWeight: 500, color: C.navy }}>
          This is not a forecast. It is a structural measurement.
        </p>
      </div>
    </section>
  );
}


/* ================================================================== */
/* SECTION 3 — HOW IT WORKS                                            */
/* ================================================================== */
function HowItWorksSection() {
  const { ref, visible } = useInView();
  const m = useMobile();
  const { ref: ref2, visible: v2 } = useInView();
  const { ref: ref3, visible: v3 } = useInView();
  const { ref: ref4, visible: v4 } = useInView();

  return (
    <section ref={ref} aria-label="How It Works" style={{
      backgroundColor: C.white,
      paddingTop: sp(12), paddingBottom: sp(12),
      paddingLeft: px(m), paddingRight: px(m),
    }}>
      <div style={{ maxWidth: maxW, margin: "0 auto" }}>
        {/* Title */}
        <div style={{ marginBottom: sp(6), ...fadeIn(visible) }}>
          <p style={{ fontSize: 13, fontWeight: 500, letterSpacing: "0.12em", color: C.teal, marginBottom: sp(2), textTransform: "uppercase" as const }}>
            How It Works
          </p>
          <h2 style={{ ...h2Style(m), color: C.navy, marginBottom: sp(2) }}>
            A structured measurement system. Not an estimate. Not a guess.
          </h2>
          <p style={{ ...body(m), color: C.muted, maxWidth: 700 }}>
            RunPayway&#8482; evaluates your income using a fixed model with defined inputs, scoring rules, and output logic.
          </p>
        </div>

        {/* Step 1 — Structural Profile */}
        <div ref={ref2} style={{
          ...cardStyle, padding: sp(4), marginBottom: sp(3),
          ...fadeIn(v2),
        }}>
          <p style={{ fontSize: 13, fontWeight: 500, letterSpacing: "0.12em", color: C.teal, marginBottom: sp(1.5), textTransform: "uppercase" as const }}>Step 1</p>
          <h3 style={{ ...h3Style(m), color: C.navy, marginBottom: sp(2) }}>Structural Profile</h3>
          <p style={{ ...body(m), color: C.muted, marginBottom: sp(3) }}>
            You provide context about how your income operates. The model uses four structural inputs:
          </p>
          <div>
            {["Employment classification", "Operating structure", "Income model", "Industry"].map((item, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: sp(1.5), marginBottom: sp(1) }}>
                <span style={{ width: 5, height: 5, borderRadius: "50%", backgroundColor: C.teal, flexShrink: 0 }} />
                <span style={{ ...body(m), color: C.navy }}>{item}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Step 2 — 6 Dimensions */}
        <div ref={ref3} style={{ marginBottom: sp(3), ...fadeIn(v3) }}>
          <div style={{ ...cardStyle, padding: sp(4), marginBottom: sp(2) }}>
            <p style={{ fontSize: 13, fontWeight: 500, letterSpacing: "0.12em", color: C.teal, marginBottom: sp(1.5), textTransform: "uppercase" as const }}>Step 2</p>
            <h3 style={{ ...h3Style(m), color: C.navy, marginBottom: sp(3) }}>Structural Assessment — 6 Dimensions</h3>
            <div style={{ display: "grid", gridTemplateColumns: m ? "1fr" : "1fr 1fr 1fr", gap: sp(3) }}>
              {[
                { dim: "Recurrence", sub: "Income that renews without re-selling" },
                { dim: "Concentration", sub: "Reliance on your single largest source" },
                { dim: "Source Count", sub: "Number of meaningful income streams" },
                { dim: "Forward Visibility", sub: "Income already secured ahead of time" },
                { dim: "Consistency", sub: "Monthly income fluctuation level" },
                { dim: "Labor Independence", sub: "Income that continues without active work" },
              ].map((d) => (
                <div key={d.dim} style={{ ...cardStyle, padding: sp(3) }}>
                  <div style={{ fontSize: 16, fontWeight: 500, color: C.navy, marginBottom: sp(0.5) }}>{d.dim}</div>
                  <div style={{ ...micro(m), color: C.muted }}>{d.sub}</div>
                </div>
              ))}
            </div>
          </div>
          <p style={{ ...micro(m), color: C.muted, textAlign: "center" }}>
            Each dimension is scored using defined rules. No interpretation. No subjectivity.
          </p>
        </div>

        {/* Step 3 — Score Generation */}
        <div ref={ref4} style={{
          ...cardStyle, padding: sp(4), marginBottom: sp(3),
          ...fadeIn(v4),
        }}>
          <p style={{ fontSize: 13, fontWeight: 500, letterSpacing: "0.12em", color: C.teal, marginBottom: sp(1.5), textTransform: "uppercase" as const }}>Step 3</p>
          <h3 style={{ ...h3Style(m), color: C.navy, marginBottom: sp(2) }}>Score Generation</h3>
          <p style={{ ...body(m), color: C.muted, marginBottom: sp(3) }}>
            A single standardized output: score (0-100), stability band, primary constraint, and distance to next tier.
          </p>
          <div style={{ borderTop: `1px solid ${C.border}`, paddingTop: sp(2), marginBottom: sp(2) }}>
            {[
              ["Limited", "0\u201329"],
              ["Developing", "30\u201349"],
              ["Established", "50\u201374"],
              ["High", "75\u2013100"],
            ].map(([band, range]) => (
              <div key={band} style={{ display: "flex", justifyContent: "space-between", padding: `${sp(0.75)}px 0` }}>
                <span style={{ ...body(m), fontWeight: 500, color: C.navy }}>{band}</span>
                <span style={{ ...body(m), color: C.muted, fontVariantNumeric: "tabular-nums" }}>{range}</span>
              </div>
            ))}
          </div>
          <p style={{ ...micro(m), color: C.muted }}>Same inputs &rarr; same score.</p>
        </div>

        {/* Step 4 — Full Diagnostic */}
        <div style={{
          ...cardStyle, padding: sp(4),
          ...fadeIn(v4, 150),
        }}>
          <p style={{ fontSize: 13, fontWeight: 500, letterSpacing: "0.12em", color: C.teal, marginBottom: sp(1.5), textTransform: "uppercase" as const }}>Step 4</p>
          <h3 style={{ ...h3Style(m), color: C.navy, marginBottom: sp(2) }}>Full Diagnostic</h3>
          <p style={{ ...body(m), color: C.muted, marginBottom: sp(3) }}>
            Your score becomes a structured action system.
          </p>
          <div style={{ borderTop: `1px solid ${C.border}`, paddingTop: sp(2) }}>
            {[
              "PressureMap\u2122 analysis",
              "Risk scenarios ranked by damage",
              "Action priorities ranked by impact",
              "Industry-specific examples",
              "12-week execution roadmap",
              "Command Center simulator",
            ].map(item => (
              <div key={item} style={{ display: "flex", alignItems: "center", gap: sp(1.5), padding: `${sp(1)}px 0` }}>
                <span style={{ color: C.teal, fontSize: 14, flexShrink: 0 }}>&#x2713;</span>
                <span style={{ ...body(m), color: C.navy }}>{item}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}


/* ================================================================== */
/* SECTION 4 — MODEL CREDIBILITY                                       */
/* ================================================================== */
function ModelCredibility() {
  const { ref, visible } = useInView();
  const m = useMobile();

  return (
    <section ref={ref} aria-label="Model Credibility" style={{
      backgroundColor: C.sand,
      paddingTop: sp(12), paddingBottom: sp(12),
      paddingLeft: px(m), paddingRight: px(m),
    }}>
      <div style={{ maxWidth: maxW, margin: "0 auto" }}>
        <h2 style={{ ...h2Style(m), color: C.navy, marginBottom: sp(5), ...fadeIn(visible) }}>
          How the Model Is Built
        </h2>

        <div style={{ display: m ? "block" : "grid", gridTemplateColumns: "1fr 1fr", gap: sp(3), marginBottom: sp(4), ...fadeIn(visible, 150) }}>
          {/* Structure — 60% */}
          <div style={{ ...cardStyle, padding: sp(4), marginBottom: m ? sp(3) : 0 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: sp(3) }}>
              <span style={{ fontSize: 13, fontWeight: 500, letterSpacing: "0.10em", color: C.muted, textTransform: "uppercase" as const }}>Structure</span>
              <span style={{ fontSize: 40, fontWeight: 600, color: C.purple }}>60%</span>
            </div>
            <p style={{ ...body(m), color: C.muted, marginBottom: sp(3) }}>Measures how income is built.</p>
            {["Recurrence", "Diversification", "Visibility", "Concentration balance"].map(item => (
              <div key={item} style={{ display: "flex", alignItems: "center", gap: sp(1.5), marginBottom: sp(1.5) }}>
                <span style={{ width: 5, height: 5, borderRadius: "50%", backgroundColor: C.teal, flexShrink: 0 }} />
                <span style={{ ...body(m), color: C.navy }}>{item}</span>
              </div>
            ))}
          </div>

          {/* Stability — 40% */}
          <div style={{ ...cardStyle, padding: sp(4) }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: sp(3) }}>
              <span style={{ fontSize: 13, fontWeight: 500, letterSpacing: "0.10em", color: C.muted, textTransform: "uppercase" as const }}>Stability</span>
              <span style={{ fontSize: 40, fontWeight: 600, color: C.purple }}>40%</span>
            </div>
            <p style={{ ...body(m), color: C.muted, marginBottom: sp(3) }}>Measures how income behaves.</p>
            {["Labor dependence", "Earnings consistency", "Continuity under disruption"].map(item => (
              <div key={item} style={{ display: "flex", alignItems: "center", gap: sp(1.5), marginBottom: sp(1.5) }}>
                <span style={{ width: 5, height: 5, borderRadius: "50%", backgroundColor: C.teal, flexShrink: 0 }} />
                <span style={{ ...body(m), color: C.navy }}>{item}</span>
              </div>
            ))}
          </div>
        </div>

        <p style={{ ...body(m), color: C.muted, marginBottom: sp(3), ...fadeIn(visible, 300) }}>
          Cross-factor interaction rules capture how weaknesses compound. High concentration + low visibility = penalty. Strong recurrence + low labor dependence = boost. Rules are fixed.
        </p>

        <p style={{ ...body(m), fontWeight: 500, color: C.navy, ...fadeIn(visible, 350) }}>
          The model does not change. Only the inputs change.
        </p>
      </div>
    </section>
  );
}


/* ================================================================== */
/* SECTION 5 — REAL EXAMPLE                                            */
/* ================================================================== */
function RealExample() {
  const { ref, visible } = useInView();
  const m = useMobile();

  return (
    <section ref={ref} aria-label="Real Example" style={{
      backgroundColor: C.white,
      paddingTop: sp(12), paddingBottom: sp(12),
      paddingLeft: px(m), paddingRight: px(m),
    }}>
      <div style={{ maxWidth: maxW, margin: "0 auto" }}>
        <h2 style={{ ...h2Style(m), color: C.navy, marginBottom: sp(2), textAlign: "center", ...fadeIn(visible) }}>
          Same Income. Different Stability.
        </h2>
        <p style={{ ...body(m), color: C.muted, textAlign: "center", marginBottom: sp(5), ...fadeIn(visible, 100) }}>
          Two people earning $150,000 per year. Completely different structures.
        </p>

        <div style={{ display: m ? "block" : "grid", gridTemplateColumns: "1fr 1fr", gap: sp(3), ...fadeIn(visible, 200) }}>
          {/* Person A */}
          <div style={{ ...cardStyle, padding: sp(4), marginBottom: m ? sp(3) : 0 }}>
            <p style={{ fontSize: 13, fontWeight: 500, letterSpacing: "0.12em", color: C.teal, marginBottom: sp(1.5), textTransform: "uppercase" as const }}>Person A</p>
            <div style={{ fontSize: 28, fontWeight: 600, color: C.navy, marginBottom: sp(2) }}>$150,000<span style={{ fontSize: 16, fontWeight: 400, color: C.muted }}> / year</span></div>
            <div style={{ borderTop: `1px solid ${C.border}`, paddingTop: sp(2) }}>
              {["1 major client (80% of income)", "No forward contracts", "Fully active income — stops when work stops"].map((item, i) => (
                <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: sp(1.5), marginBottom: sp(1.5) }}>
                  <span style={{ width: 5, height: 5, borderRadius: "50%", backgroundColor: "rgba(14,26,43,0.25)", flexShrink: 0, marginTop: 8 }} />
                  <span style={{ ...body(m), color: C.muted }}>{item}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Person B */}
          <div style={{ ...cardStyle, padding: sp(4) }}>
            <p style={{ fontSize: 13, fontWeight: 500, letterSpacing: "0.12em", color: C.teal, marginBottom: sp(1.5), textTransform: "uppercase" as const }}>Person B</p>
            <div style={{ fontSize: 28, fontWeight: 600, color: C.navy, marginBottom: sp(2) }}>$150,000<span style={{ fontSize: 16, fontWeight: 400, color: C.muted }}> / year</span></div>
            <div style={{ borderTop: `1px solid ${C.border}`, paddingTop: sp(2) }}>
              {["5 clients, none over 30%", "40% recurring retainers", "3 months of income secured ahead of time"].map((item, i) => (
                <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: sp(1.5), marginBottom: sp(1.5) }}>
                  <span style={{ width: 5, height: 5, borderRadius: "50%", backgroundColor: C.teal, flexShrink: 0, marginTop: 8 }} />
                  <span style={{ ...body(m), color: C.navy }}>{item}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <p style={{ ...body(m), fontWeight: 500, color: C.navy, textAlign: "center", marginTop: sp(4), ...fadeIn(visible, 350) }}>
          Same income. Different stability.
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

  const testimonials = [
    { quote: "I knew my income was concentrated. I didn\u2019t know that one client leaving would drop my stability by 30 points. That changed how I structured my next quarter.", name: "Sarah M.", role: "Real Estate Agent" },
    { quote: "I had five income sources and still scored low. The report showed me why \u2014 almost none of it was recurring. I converted one client to a retainer within two weeks.", name: "James R.", role: "Software Contractor" },
    { quote: "I was tracking revenue, not structure. The score separated the two for the first time. Now I know exactly what to protect and what to build.", name: "Priya K.", role: "Management Consultant" },
  ];

  return (
    <section ref={ref} aria-label="Proof" style={{
      backgroundColor: C.sand,
      paddingTop: sp(12), paddingBottom: sp(12),
      paddingLeft: px(m), paddingRight: px(m),
    }}>
      <div style={{ maxWidth: maxW, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: sp(5), ...fadeIn(visible) }}>
          <h2 style={{ ...h2Style(m), color: C.navy }}>They measured. Then they moved.</h2>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: m ? "1fr" : "repeat(3, 1fr)", gap: sp(3) }}>
          {testimonials.map((t, i) => (
            <div key={t.name} style={{
              ...cardStyle, padding: sp(4),
              display: "flex", flexDirection: "column",
              ...fadeIn(visible, 150 + i * 100),
            }}>
              <p style={{ ...body(m), color: C.muted, fontStyle: "italic", margin: `0 0 ${sp(3)}px`, flex: 1 }}>
                &ldquo;{t.quote}&rdquo;
              </p>
              <div style={{ borderTop: `1px solid ${C.border}`, paddingTop: sp(2) }}>
                <div style={{ fontSize: 16, fontWeight: 500, color: C.navy, marginBottom: 2 }}>{t.name}</div>
                <div style={{ ...micro(m), color: C.muted }}>{t.role}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}


/* ================================================================== */
/* SECTION 7 — DECISION CALMING                                        */
/* ================================================================== */
function DecisionCalming() {
  const m = useMobile();

  return (
    <section aria-label="Before You Decide" style={{
      backgroundColor: C.white,
      paddingTop: sp(12), paddingBottom: sp(12),
      paddingLeft: px(m), paddingRight: px(m),
    }}>
      <div style={{ maxWidth: 640, margin: "0 auto" }}>
        <h2 style={{ ...h2Style(m), color: C.navy, marginBottom: sp(4) }}>
          Before You Decide
        </h2>

        <p style={{ ...body(m), color: C.muted, marginBottom: sp(3) }}>
          You do not need to buy anything right now.
        </p>

        <p style={{ ...body(m), color: C.muted, marginBottom: sp(3) }}>
          The free score tells you where you stand. If that is enough, you are done. There is no pressure to go further.
        </p>

        <p style={{ ...body(m), color: C.muted, marginBottom: sp(3) }}>
          The full diagnostic exists for people who want to understand why they scored the way they did — and what to do about it. It is a one-time purchase. No subscription. No upsell.
        </p>

        <p style={{ ...body(m), color: C.muted, marginBottom: sp(3) }}>
          If you are not sure, start with the free score. You can always come back.
        </p>

        <p style={{ ...body(m), color: C.muted }}>
          We built this to be useful, not urgent.
        </p>
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

  return (
    <section ref={ref} aria-label="Pricing" style={{
      backgroundColor: C.sand,
      paddingTop: sp(12), paddingBottom: sp(12),
      paddingLeft: px(m), paddingRight: px(m),
    }}>
      <div style={{ maxWidth: maxW, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: sp(6), ...fadeIn(visible) }}>
          <h2 style={{ ...h2Style(m), color: C.navy, marginBottom: sp(2) }}>
            Start free. Go deeper when you&#8217;re ready.
          </h2>
          <p style={{ ...body(m), color: C.muted, maxWidth: 460, margin: "0 auto" }}>
            Your score is instant and free. The full diagnostic is there when you need it.
          </p>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: m ? "1fr" : "1fr 1fr", gap: sp(3), maxWidth: 780, margin: "0 auto", ...fadeIn(visible, 150) }}>
          {/* Free */}
          <div style={{
            ...cardStyle, padding: sp(4),
            display: "flex", flexDirection: "column" as const,
          }}>
            <div style={{ fontSize: 13, fontWeight: 500, letterSpacing: "0.12em", color: C.teal, marginBottom: sp(2), textTransform: "uppercase" as const }}>
              Income Stability Score&#8482;
            </div>
            <div style={{ fontSize: 40, fontWeight: 600, color: C.navy, marginBottom: sp(1) }}>$0</div>
            <p style={{ ...micro(m), color: C.muted, marginBottom: sp(3) }}>Always free. No credit card.</p>
            <div style={{ marginBottom: sp(4), flex: 1 }}>
              {["Your score out of 100", "Your stability classification", "The #1 weakness holding you back", "Your single highest-impact move"].map((item) => (
                <div key={item} style={{ display: "flex", alignItems: "center", gap: sp(1.5), marginBottom: sp(1.25) }}>
                  <span style={{ color: C.teal, fontSize: 14, flexShrink: 0 }}>&#x2713;</span>
                  <span style={{ ...body(m), color: C.muted }}>{item}</span>
                </div>
              ))}
            </div>
            <Link href="/diagnostic-portal" style={{
              ...ctaButton,
              width: "100%",
            }}
              onMouseEnter={(e) => { if (!canHover()) return; e.currentTarget.style.backgroundColor = "#0a1320"; }}
              onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = C.navy; }}
            >Start Free Assessment</Link>
          </div>

          {/* Paid */}
          <div style={{
            ...cardStyle, padding: sp(4),
            display: "flex", flexDirection: "column" as const,
          }}>
            <div style={{ fontSize: 13, fontWeight: 500, letterSpacing: "0.12em", color: C.teal, marginBottom: sp(2), textTransform: "uppercase" as const }}>
              RunPayway&#8482; Diagnostic Report
            </div>
            <div style={{ fontSize: 40, fontWeight: 600, color: C.navy, marginBottom: sp(1) }}>$69</div>
            <p style={{ ...micro(m), color: C.muted, marginBottom: sp(3) }}>One-time. Includes everything.</p>
            <div style={{ marginBottom: sp(4), flex: 1 }}>
              {[
                "Full structural diagnosis with income composition breakdown",
                "PressureMap\u2122 showing exactly where your income is exposed",
                "Scripts you can send to clients this week",
                "12-week roadmap built for your specific structure",
                "Simulator to test changes before you commit",
                "See how you compare to others in your industry",
              ].map((item) => (
                <div key={item} style={{ display: "flex", alignItems: "flex-start", gap: sp(1.5), marginBottom: sp(1.25) }}>
                  <span style={{ color: C.teal, fontSize: 14, flexShrink: 0, marginTop: 2 }}>&#x2713;</span>
                  <span style={{ ...body(m), color: C.muted }}>{item}</span>
                </div>
              ))}
            </div>
            <a href={process.env.NEXT_PUBLIC_STRIPE_CHECKOUT_URL || "https://buy.stripe.com/9B66oz48EaYU2lc4IF2Nq05"} style={{
              ...ctaButton,
              width: "100%",
            }}
              onMouseEnter={(e) => { if (!canHover()) return; e.currentTarget.style.backgroundColor = "#0a1320"; }}
              onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = C.navy; }}
            >Get Full Diagnostic — $69</a>
            <p style={{ ...micro(m), color: C.muted, textAlign: "center", marginTop: sp(2), marginBottom: 0 }}>
              One-time analysis &bull; No subscription &bull; Private by default
            </p>
          </div>
        </div>
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

  const faqs = [
    { q: "What is the Income Stability Score?", a: "A single number from 0 to 100 that measures how well your income structure holds up under disruption. It evaluates six dimensions of your income and classifies you into a stability band. Same answers always produce the same score." },
    { q: "Who is this for?", a: "Anyone whose income doesn\u2019t arrive automatically every two weeks. Freelancers, consultants, contractors, agents, business owners \u2014 anyone who earns outside a traditional W-2." },
    { q: "What do I get with the full diagnostic?", a: "A structural diagnosis that shows exactly where your income is exposed, the three highest-impact changes you can make, scripts to use in real conversations, a 12-week roadmap, and a simulator to test changes before you commit." },
    { q: "How is this different from tracking my revenue?", a: "Revenue tells you how much came in. This tells you how reliably it keeps coming in. Two people earning the same amount can have completely different stability. The Score reveals the difference." },
    { q: "What is the PressureMap?", a: "A structural map of where your income breaks under pressure \u2014 which zones are exposed, how you compare to peers in your industry, and which weakness to address first." },
    { q: "What is the Command Center?", a: "Your operational dashboard after purchase. It includes a simulator to test structural changes, industry-specific scripts, a week-by-week roadmap, and progress tracking." },
    { q: "How long does this take?", a: "Under two minutes. You answer six structural questions and see your score instantly. No financial data required. No documents to upload." },
    { q: "Is my information private?", a: "Completely. We never access bank accounts, pull credit, or connect to external financial data. Your information stays with you." },
  ];

  return (
    <section ref={ref} aria-label="FAQ" style={{
      backgroundColor: C.white,
      paddingTop: sp(12), paddingBottom: sp(12),
      paddingLeft: px(m), paddingRight: px(m),
    }}>
      <div style={{ maxWidth: 820, margin: "0 auto" }}>
        <h2 style={{ ...h2Style(m), color: C.navy, textAlign: "center", marginBottom: sp(5), ...fadeIn(visible) }}>
          Frequently asked questions
        </h2>

        <div style={fadeIn(visible, 100)}>
          {faqs.map((faq, i) => {
            const isOpen = openFaq === i;
            const panelId = `faq-panel-${i}`;
            const btnId = `faq-btn-${i}`;
            return (
              <div key={i} style={{ borderTop: `1px solid ${C.border}` }}>
                <button id={btnId} onClick={() => setOpenFaq(isOpen ? null : i)} aria-expanded={isOpen} aria-controls={panelId}
                  style={{ width: "100%", padding: `${sp(2.5)}px ${sp(1)}px`, minHeight: 48, display: "flex", alignItems: "center", justifyContent: "space-between", background: "none", border: "none", cursor: "pointer", textAlign: "left" }}>
                  <span style={{ ...h3Style(m), color: C.navy, paddingRight: sp(2) }}>{faq.q}</span>
                  <svg width="14" height="14" viewBox="0 0 16 16" fill="none" style={{ flexShrink: 0 }} aria-hidden="true">
                    <path d="M3 8h10" stroke={C.navy} strokeWidth="1.5" strokeLinecap="round" />
                    {!isOpen && <path d="M8 3v10" stroke={C.navy} strokeWidth="1.5" strokeLinecap="round" />}
                  </svg>
                </button>
                <div id={panelId} role="region" aria-labelledby={btnId} style={{ maxHeight: isOpen ? 400 : 0, overflow: "hidden", transition: "max-height 200ms ease" }}>
                  <p style={{ ...body(m), color: C.muted, margin: 0, padding: `0 ${sp(1)}px ${sp(2.5)}px` }}>{faq.a}</p>
                </div>
              </div>
            );
          })}
          <div style={{ borderTop: `1px solid ${C.border}` }} />
        </div>

        <div style={{ textAlign: "center", marginTop: sp(5) }}>
          <p style={{ ...micro(m), color: C.light }}>
            Still have questions?{" "}
            <Link href="/contact" style={{ color: C.muted, textDecoration: "underline", textUnderlineOffset: 3 }}>Get in touch</Link>
          </p>
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

  return (
    <section ref={ref} aria-label="Final CTA" style={{
      backgroundColor: C.sand,
      paddingTop: sp(12), paddingBottom: sp(12),
      paddingLeft: px(m), paddingRight: px(m), textAlign: "center",
    }}>
      <div style={{ maxWidth: 600, margin: "0 auto", ...fadeIn(visible) }}>
        <h2 style={{ ...h2Style(m), color: C.navy, marginBottom: sp(3) }}>
          See How Stable Your Income Really Is
        </h2>
        <p style={{ ...body(m), color: C.muted, marginBottom: sp(5) }}>
          Most people don&#8217;t find out until something breaks. You can know now.
        </p>

        <Link href="/diagnostic-portal" style={{
          ...ctaButton,
          transition: "background-color 200ms ease",
        }}
          onMouseEnter={(e) => { if (!canHover()) return; e.currentTarget.style.backgroundColor = "#0a1320"; }}
          onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = C.navy; }}
        >
          Get Your Free Score
        </Link>

        <p style={{ ...micro(m), color: C.muted, marginTop: sp(2) }}>
          Under 2 minutes &bull; No credit pull &bull; No bank connection
        </p>
      </div>
    </section>
  );
}


/* ================================================================== */
/* DISCLAIMER                                                          */
/* ================================================================== */
function DisclaimerSection() {
  const m = useMobile();
  return (
    <section aria-label="Disclaimer" style={{
      backgroundColor: C.sand, paddingTop: sp(5), paddingBottom: sp(5),
      paddingLeft: px(m), paddingRight: px(m), borderTop: `1px solid ${C.border}`,
    }}>
      <p style={{ ...micro(m), color: C.light, textAlign: "center", maxWidth: 640, margin: "0 auto" }}>
        The Income Stability Score&#8482; is a structural income assessment based on information provided by the user.
        It does not provide financial advice, investment advice, credit underwriting, or prediction of future outcomes.
      </p>
    </section>
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
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(FAQ_SCHEMA) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(PRODUCT_SCHEMA) }} />
      <StickyNav />
      <HeroSection />
      <HeroVideo />
      <PositioningBlock />
      <HowItWorksSection />
      <ModelCredibility />
      <RealExample />
      <ProofSection />
      <DecisionCalming />
      <PricingSection />
      <FaqSection openFaq={openFaq} setOpenFaq={setOpenFaq} />
      <FinalCta />
      <DisclaimerSection />
    </div>
  );
}
