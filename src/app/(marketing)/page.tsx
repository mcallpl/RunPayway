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
/* DESIGN TOKENS                                                       */
/* ================================================================== */

const SERIF = "'DM Serif Display', Georgia, serif";

const C = {
  navy: "#0E1A2B",
  purple: "#4B3FAE",
  teal: "#1F6D7A",
  sand: "#F8F6F6",
  sandBg: "#F8F6F6",
  white: "#FFFFFF",
  muted: "rgba(14,26,43,0.55)",
  light: "rgba(14,26,43,0.38)",
  border: "rgba(14,26,43,0.08)",
  heroGradient: "linear-gradient(145deg, #0E1A2B 0%, #161430 35%, #3D2F9C 65%, #1F6D7A 100%)",
};

const sp = (n: number) => n * 8;

const T = {
  h1:    { desktop: { fontSize: 56, fontWeight: 600, lineHeight: 1.06 }, mobile: { fontSize: 34, fontWeight: 600, lineHeight: 1.1 } },
  h2:    { desktop: { fontSize: 40, fontWeight: 600, lineHeight: 1.1 }, mobile: { fontSize: 30, fontWeight: 600, lineHeight: 1.15 } },
  h3:    { desktop: { fontSize: 22, fontWeight: 600, lineHeight: 1.3 },  mobile: { fontSize: 20, fontWeight: 600, lineHeight: 1.3 } },
  bodyLg:{ desktop: { fontSize: 20, fontWeight: 400, lineHeight: 1.5 }, mobile: { fontSize: 18, fontWeight: 400, lineHeight: 1.5 } },
  body:  { desktop: { fontSize: 17, fontWeight: 400, lineHeight: 1.65 }, mobile: { fontSize: 16, fontWeight: 400, lineHeight: 1.6 } },
  label: { fontSize: 14, fontWeight: 500, lineHeight: 1.45 },
  meta:  { fontSize: 14, fontWeight: 500, lineHeight: 1.4 },
  score: { desktop: { fontSize: 64, fontWeight: 600, lineHeight: 1 }, mobile: { fontSize: 48, fontWeight: 600, lineHeight: 1 } },
  price: { desktop: { fontSize: 48, fontWeight: 600, lineHeight: 1 }, mobile: { fontSize: 40, fontWeight: 600, lineHeight: 1 } },
  nav:   { fontSize: 15, fontWeight: 500 },
  cta:   { fontSize: 16, fontWeight: 600 },
};

const maxW = 1200;
const padX = { desktop: 40, mobile: 20 };
const sectionGap = { desktop: sp(12), mobile: sp(9) };

const h1 = (m: boolean) => m ? T.h1.mobile : T.h1.desktop;
const h2 = (m: boolean) => m ? T.h2.mobile : T.h2.desktop;
const h3 = (m: boolean) => m ? T.h3.mobile : T.h3.desktop;
const bodyLg = (m: boolean) => m ? T.bodyLg.mobile : T.bodyLg.desktop;
const body = (m: boolean) => m ? T.body.mobile : T.body.desktop;
const score = (m: boolean) => m ? T.score.mobile : T.score.desktop;
const price = (m: boolean) => m ? T.price.mobile : T.price.desktop;
const px = (m: boolean) => m ? padX.mobile : padX.desktop;
const secY = (m: boolean) => m ? sectionGap.mobile : sectionGap.desktop;

const cardStyle = {
  borderRadius: 18,
  border: `1px solid ${C.border}`,
  backgroundColor: "#FFFFFF",
  boxShadow: "0 2px 12px rgba(14,26,43,0.04), 0 8px 32px rgba(14,26,43,0.03)",
};

const fadeIn = (visible: boolean, delay = 0) => ({
  opacity: visible ? 1 : 0,
  transform: visible ? "translateY(0)" : "translateY(16px)",
  transition: `opacity 600ms ease-out ${delay}ms, transform 600ms ease-out ${delay}ms`,
});


/* ================================================================== */
/* STICKY NAV — today's warm/dark adaptive nav with hamburger          */
/* ================================================================== */
function StickyNav() {
  const m = useMobile();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 400);
    window.addEventListener("scroll", fn, { passive: true });
    return () => window.removeEventListener("scroll", fn);
  }, []);

  // Past hero = warm nav. In hero = dark transparent nav.
  const warm = scrolled;
  const navBg = warm ? "rgba(247,245,240,0.97)" : "rgba(14,26,43,0.4)";
  const navBorder = warm ? "1px solid rgba(14,26,43,0.06)" : "1px solid transparent";
  const linkColor = warm ? "rgba(14,26,43,0.55)" : "rgba(244,241,234,0.55)";
  const linkHover = warm ? C.navy : "#F4F1EA";
  const ctaBg = warm ? C.navy : C.sand;
  const ctaColor = warm ? "#F7F5F0" : C.navy;

  return (
    <>
    <nav style={{
      position: "fixed", top: 0, left: 0, right: 0, zIndex: 100,
      backdropFilter: "blur(16px)", WebkitBackdropFilter: "blur(16px)",
      backgroundColor: navBg,
      borderBottom: navBorder,
      transition: "background-color 300ms, border-color 300ms",
      height: m ? 56 : 64, display: "flex", alignItems: "center",
      padding: `0 ${px(m)}px`,
    }}>
      <div style={{ maxWidth: maxW, margin: "0 auto", width: "100%", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <Link href="/" style={{ display: "inline-flex", alignItems: "center" }}>
          <Image src={warm ? logoBlue : logoWhite} alt="RunPayway" width={120} height={14} style={{ height: "auto", transition: "opacity 200ms" }} />
        </Link>
        {!m && (
          <div style={{ display: "flex", alignItems: "center", gap: sp(3) }}>
            {[
              { label: "Command Center", href: "/dashboard" },
              { label: "Sample Report", href: "/sample-report" },
              { label: "Pricing", href: "/pricing" },
            ].map(link => (
              <Link key={link.href} href={link.href} style={{ ...T.nav, color: linkColor, textDecoration: "none", transition: "color 200ms" }}
                onMouseEnter={(e) => { if (canHover()) e.currentTarget.style.color = linkHover; }}
                onMouseLeave={(e) => { e.currentTarget.style.color = linkColor; }}
              >{link.label}</Link>
            ))}
            <Link href="/pricing" style={{
              ...T.cta, color: ctaColor, textDecoration: "none",
              padding: `${sp(1)}px ${sp(2.5)}px`, borderRadius: 8,
              backgroundColor: ctaBg, transition: "background-color 300ms, color 300ms",
            }}>Get My Free Score</Link>
          </div>
        )}
        {m && (
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <Link href="/pricing" style={{
              ...T.cta, fontSize: 14, color: ctaColor, textDecoration: "none",
              padding: `6px ${sp(2)}px`, borderRadius: 8,
              backgroundColor: ctaBg, transition: "background-color 300ms, color 300ms",
            }}>Score</Link>
            <button onClick={() => setMobileOpen(!mobileOpen)} style={{ background: "none", border: "none", cursor: "pointer", padding: 4, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke={warm ? C.navy : "#F4F1EA"} strokeWidth="1.5" strokeLinecap="round" style={{ transition: "stroke 300ms" }}>
                {mobileOpen ? <><line x1="4" y1="4" x2="16" y2="16" /><line x1="16" y1="4" x2="4" y2="16" /></> : <><line x1="3" y1="6" x2="17" y2="6" /><line x1="3" y1="10" x2="17" y2="10" /><line x1="3" y1="14" x2="17" y2="14" /></>}
              </svg>
            </button>
          </div>
        )}
      </div>
    </nav>

    {/* Mobile menu overlay */}
    {m && mobileOpen && (
      <div style={{ position: "fixed", top: 56, left: 0, right: 0, bottom: 0, zIndex: 99, backgroundColor: "rgba(247,245,240,0.98)", backdropFilter: "blur(12px)", padding: `${sp(4)}px ${px(m)}px` }}>
        <div style={{ display: "flex", flexDirection: "column", gap: sp(1) }}>
          {[
            { label: "Command Center", href: "/dashboard" },
            { label: "Sample Report", href: "/sample-report" },
            { label: "Pricing", href: "/pricing" },
            { label: "How It Works", href: "/how-it-works" },
            { label: "Methodology", href: "/methodology" },
          ].map(link => (
            <Link key={link.href} href={link.href} onClick={() => setMobileOpen(false)}
              style={{ fontSize: 17, fontWeight: 500, color: C.navy, textDecoration: "none", padding: `${sp(2)}px 0`, borderBottom: `1px solid ${C.border}` }}>
              {link.label}
            </Link>
          ))}
        </div>
        <Link href="/pricing" style={{
          display: "flex", alignItems: "center", justifyContent: "center",
          width: "100%", height: sp(6.5), borderRadius: 10,
          backgroundColor: C.navy, color: "#F7F5F0", ...T.cta,
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
/* INDUSTRY DROPDOWN — 19 industries with modal cards                  */
/* ================================================================== */

const INDUSTRIES = [
  // Tier 1 — Multiple non-automated streams, highest manual complexity
  { name: "Real Estate", problem: "Miss two closings and half your quarter vanishes. RunPayway scores how your commission structure, seasonal cycles, and deal pipeline actually hold up under pressure — so you can see exactly where your income is exposed before a slow month proves it for you.", cta: "See how agents score" },
  { name: "Consulting / Professional Services", problem: "Three clients paying six figures, then a two-month gap. RunPayway measures your client concentration, contract visibility, and income continuity — the structural factors that determine whether feast-or-famine is your norm or your past.", cta: "Map your client concentration" },
  { name: "Sales / Brokerage", problem: "Commission resets your income to zero every quarter. RunPayway scores how your pipeline structure, deal size concentration, and comp model actually perform under stress — not just in a good quarter.", cta: "Stress-test your pipeline" },
  { name: "Construction / Trades", problem: "Weather delays, seasonal shutdowns, and milestone-based payments create swings invisible on an annual P&L. RunPayway scores the structural gaps subcontractors and independents carry — month by month, not just year over year.", cta: "Score your payment structure" },
  { name: "Media / Entertainment", problem: "Royalties, irregular bookings, and algorithm changes make earnings wildly unpredictable. RunPayway measures whether your income structure has any real floor — or if it's entirely dependent on the next gig landing.", cta: "Measure your income durability" },
  // Tier 2 — Multiple streams, mix of manual and semi-recurring
  { name: "Legal Services", problem: "Contingency fees take years. Partnership draws fluctuate. Billable hours mask the real gap between what you earn and when it arrives. RunPayway scores the structural timing and concentration risk most attorneys never quantify.", cta: "Evaluate your fee structure" },
  { name: "Healthcare", problem: "Practice ownership, shifting reimbursement rates, and patient volume swings create income volatility that salary alone won't reveal. RunPayway maps the structural risk across your revenue mix — including side practices and locum work.", cta: "Assess your practice stability" },
  { name: "Insurance", problem: "Renewals feel safe until a carrier pulls a product or clawbacks hit. RunPayway quantifies the split between your new-business risk and renewal floor — the gap most agents never see until it costs them.", cta: "Quantify your renewal risk" },
  { name: "Retail / E-Commerce", problem: "When Q4 is 40% of your year, your average monthly income is a fiction. RunPayway measures the seasonal concentration, platform dependency, and cash flow structure that determine whether your business survives a slow stretch.", cta: "See your seasonal exposure" },
  { name: "Hospitality / Food Service", problem: "Tip-dependent income and seasonal tourism mean your take-home has almost no floor. RunPayway scores the structural resilience of your earnings — so you know exactly where you stand before a slow month proves it.", cta: "Assess your income floor" },
  // Tier 3 — Multiple streams but some automation or structure present
  { name: "Education", problem: "Adjunct roles, grant cycles, and summer gaps make academic income quietly unstable. RunPayway scores the structural guarantee behind your position — contract visibility, funding dependency, and income continuity year over year.", cta: "Score your contract stability" },
  { name: "Transportation / Logistics", problem: "Per-load pricing, fuel swings, and route availability make every week a negotiation. RunPayway measures the structural risk owner-operators carry — the volatility that per-mile rates never reveal.", cta: "Evaluate your rate stability" },
  { name: "Agriculture", problem: "Crop cycles, commodity swings, and weather risk make your income structurally seasonal in ways no other industry matches. RunPayway scores the resilience of your revenue structure — so one bad harvest doesn't define your year.", cta: "Assess your seasonal structure" },
  { name: "Technology", problem: "RSU cliffs, contractor gaps, and startup equity gambles make tech income surprisingly fragile. RunPayway scores the structural resilience behind your comp — so one vesting pause or layoff doesn't blindside your finances.", cta: "Score your income structure" },
  { name: "Energy / Utilities", problem: "Project-based contracts and commodity pricing create boom-bust cycles. RunPayway measures the structural gaps between projects — the exposure field workers and consultants carry that hourly rates never show.", cta: "Evaluate your project gaps" },
  // Tier 4 — Fewer manual streams, more institutionalized income
  { name: "Finance / Banking", problem: "Bonuses and deferred payouts inflate your W-2 but mask real fragility. RunPayway measures the structural stability underneath — how concentrated, how recurring, how resilient your income actually is when markets shift or comp plans change.", cta: "Measure your true stability" },
  { name: "Manufacturing", problem: "Bulk order dependency and supply chain disruptions create concentration risk most operators underestimate. RunPayway scores how many clients, contracts, and revenue lines actually hold your income together.", cta: "Map your order concentration" },
  { name: "Nonprofit / Public Sector", problem: "Grant-dependent funding and fiscal year budget resets mean your income timeline is set by someone else. RunPayway measures the structural durability of your role — how much of your income persists without active renewal.", cta: "Measure your funding stability" },
  // Always last — catch-all
  { name: "Other", problem: "If you earn outside a traditional W-2 — freelancing, gig work, mixed sources, or anything non-standard — your income has a structure most people never measure. RunPayway scores it across the same six dimensions used for every industry, so you see exactly where you stand.", cta: "See report pricing" },
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
            <span style={{ fontFamily: SERIF, fontSize: 24, fontWeight: 700, color: "#F4F1EA" }}>19</span>
            <span style={{ fontSize: 15, fontWeight: 600, color: "rgba(244,241,234,0.70)", letterSpacing: "0.01em" }}>industries benchmarked</span>
            <svg width="14" height="14" viewBox="0 0 12 12" fill="none" style={{ marginLeft: 2, transform: open ? "rotate(180deg)" : "rotate(0deg)", transition: "transform 200ms ease" }}>
              <path d="M3 4.5L6 7.5L9 4.5" stroke="rgba(244,241,234,0.70)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>

          {open && (
            <div style={{
              position: "absolute", top: "calc(100% + 8px)", left: 0,
              minWidth: m ? 280 : 320, maxHeight: 400, overflowY: "auto",
              backgroundColor: "rgba(14,20,36,0.96)", backdropFilter: "blur(20px)",
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
                    fontSize: 15, fontWeight: 500, color: "rgba(244,241,234,0.75)",
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
              backgroundColor: "#FFFFFF", borderRadius: 20,
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
              ...T.label, fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase" as const,
              color: C.teal, marginBottom: sp(1.5),
            }}>
              {selected.name}
            </div>

            <h3 style={{
              fontSize: m ? 22 : 26, fontWeight: 600, lineHeight: 1.2,
              color: C.navy, letterSpacing: "-0.02em", marginBottom: sp(3),
            }}>
              Your income has a structure. Here&#8217;s what&#8217;s at risk.
            </h3>

            <p style={{
              ...body(m), color: C.muted, marginBottom: sp(4),
              lineHeight: 1.7,
            }}>
              {selected.problem}
            </p>

            <p style={{
              fontSize: 14, fontWeight: 500, lineHeight: 1.6,
              color: "rgba(14,26,43,0.45)", marginBottom: sp(5),
              fontStyle: "italic",
            }}>
              Income structures shift. Many professionals run their report annually to track how their stability evolves over time.
            </p>

            <div style={{
              borderTop: `1px solid ${C.border}`,
              paddingTop: sp(3),
              display: "flex", flexDirection: "column", gap: sp(2),
            }}>
              <Link
                href="/pricing"
                onClick={() => setSelected(null)}
                style={{
                  display: "inline-flex", alignItems: "center", justifyContent: "center",
                  height: sp(6), paddingLeft: sp(4), paddingRight: sp(4),
                  borderRadius: sp(1.25),
                  backgroundColor: C.navy, color: "#FFFFFF",
                  ...T.cta, textDecoration: "none",
                  transition: "transform 180ms ease, box-shadow 180ms ease",
                  boxShadow: "0 4px 16px rgba(14,26,43,0.20)",
                }}
                onMouseEnter={e => { if (canHover()) { e.currentTarget.style.transform = "translateY(-1px)"; e.currentTarget.style.boxShadow = "0 8px 24px rgba(14,26,43,0.25)"; } }}
                onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "0 4px 16px rgba(14,26,43,0.20)"; }}
              >
                {selected.cta}
              </Link>

              <Link
                href="/diagnostic-portal"
                onClick={() => setSelected(null)}
                style={{
                  display: "inline-flex", alignItems: "center", justifyContent: "center",
                  height: sp(6), paddingLeft: sp(4), paddingRight: sp(4),
                  borderRadius: sp(1.25),
                  backgroundColor: "transparent", color: C.navy,
                  border: `1px solid ${C.border}`,
                  ...T.cta, textDecoration: "none",
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
/* HERO — yesterday's copy/interaction + today's social proof bar      */
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

  const ringSize = m ? 230 : 299;
  const radius = 70;
  const strokeWidth = 6;
  const circumference = 2 * Math.PI * radius;
  const targetOffset = (1 - 72 / 100) * circumference;

  return (
    <section ref={ref} aria-label="Hero" style={{ background: C.heroGradient }}>
      <div style={{
        maxWidth: maxW, margin: "0 auto",
        paddingTop: m ? sp(16) : sp(20),
        paddingBottom: m ? sp(10) : sp(16),
        paddingLeft: px(m), paddingRight: px(m),
      }}>
        <div style={{
          display: m ? "block" : "flex",
          alignItems: "center", justifyContent: "space-between", gap: sp(8),
        }}>
          {/* Left — text */}
          <div style={{ maxWidth: 720, textAlign: m ? "center" : "left" }}>
            <div style={{
              ...fadeIn(visible),
              ...T.label, fontWeight: 600, letterSpacing: "0.12em", textTransform: "uppercase" as const,
              color: C.teal, marginBottom: m ? sp(3) : sp(4),
            }}>
              Income Stability Score&#8482;
            </div>

            <h1 style={{
              ...fadeIn(visible, 120),
              fontSize: m ? 40 : 68, fontWeight: 600, lineHeight: 1.04,
              color: C.sand, letterSpacing: "-0.03em",
              marginBottom: m ? sp(3) : sp(5),
            }}>
              We measure how your<br />income holds together.
            </h1>

            <p style={{
              ...fadeIn(visible, 250),
              fontSize: m ? 18 : 22, fontWeight: 400, lineHeight: 1.5,
              color: "rgba(244,241,234,0.50)",
              marginBottom: m ? sp(5) : sp(6),
              maxWidth: m ? undefined : 500,
            }}>
              Not how much you make &#8212; how well it holds up when something breaks.
            </p>

            <div style={fadeIn(visible, 380)}>
              <Link
                href="/diagnostic-portal"
                className="cta-tick inline-flex items-center justify-center"
                style={{
                  height: sp(7), width: m ? "100%" : "auto",
                  paddingLeft: sp(5), paddingRight: sp(5),
                  borderRadius: sp(1.25),
                  background: `linear-gradient(135deg, ${C.sand} 0%, #EDECEA 100%)`,
                  color: C.navy, ...T.cta, letterSpacing: "-0.01em",
                  border: `1px solid rgba(244,241,234,0.92)`,
                  boxShadow: "inset 0 1px 0 rgba(255,255,255,0.4), 0 8px 24px rgba(0,0,0,0.20)",
                  transition: "transform 180ms ease, box-shadow 180ms ease",
                  textDecoration: "none",
                }}
                onMouseEnter={(e) => { if (!canHover()) return; e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = "inset 0 1px 0 rgba(255,255,255,0.4), 0 12px 32px rgba(0,0,0,0.25)"; }}
                onMouseLeave={(e) => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "inset 0 1px 0 rgba(255,255,255,0.4), 0 8px 24px rgba(0,0,0,0.20)"; }}
              >
                <span className="tick tick-navy" />
                <span className="cta-label">Get My Free Score</span>
                <span className="cta-arrow cta-arrow-navy" />
              </Link>

              <p style={{ ...T.meta, color: "rgba(244,241,234,0.42)", marginTop: sp(3) }}>
                Under two minutes &bull; No bank connection &bull; No credit pull
              </p>
            </div>
          </div>

          {/* Right — score ring */}
          <div style={{
            flexShrink: 0, display: "flex", flexDirection: "column", alignItems: "center",
            marginTop: m ? sp(7) : 0,
            ...fadeIn(visible, 400),
          }}>
            <div style={{ position: "relative", width: ringSize, height: ringSize }}>
              <svg width={ringSize} height={ringSize} viewBox="0 0 160 160" style={{ transform: "rotate(-90deg)" }}>
                <circle cx="80" cy="80" r={radius} fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth={strokeWidth} />
                <circle cx="80" cy="80" r={radius} fill="none" stroke="url(#scoreGrad)" strokeWidth={strokeWidth}
                  strokeLinecap="round" strokeDasharray={circumference}
                  strokeDashoffset={visible ? targetOffset : circumference}
                  style={{ transition: "stroke-dashoffset 2s cubic-bezier(0.22, 1, 0.36, 1)" }}
                />
                <defs>
                  <linearGradient id="scoreGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor={C.teal} /><stop offset="50%" stopColor={C.purple} /><stop offset="100%" stopColor="#7B6FE0" />
                  </linearGradient>
                </defs>
              </svg>
              <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <span style={{ ...score(m), color: C.sand, letterSpacing: "-0.03em", fontVariantNumeric: "tabular-nums" }}>
                  {animatedScore}
                </span>
              </div>
            </div>

            <div style={{
              textAlign: "center", marginTop: sp(2),
              opacity: showLabel ? 1 : 0, transform: showLabel ? "translateY(0)" : "translateY(6px)",
              transition: "opacity 500ms ease-out, transform 500ms ease-out",
            }}>
              <div style={{
                display: "inline-flex", alignItems: "center", gap: sp(1),
                padding: `${sp(0.75)}px ${sp(2)}px`, borderRadius: 100,
                backgroundColor: "rgba(31,109,122,0.15)", border: "1px solid rgba(31,109,122,0.25)",
                marginBottom: sp(1),
              }}>
                <span style={{ width: 6, height: 6, borderRadius: 999, backgroundColor: C.teal }} />
                <span style={{ ...T.label, fontWeight: 600, color: C.teal }}>Established Stability</span>
              </div>
              <div style={{ ...T.meta, color: "rgba(244,241,234,0.45)", marginBottom: sp(2) }}>3 points to High Stability</div>
              <div style={{ display: "flex", flexDirection: "column", gap: sp(0.75), textAlign: "left" }}>
                <span style={{ ...T.meta, color: "rgba(244,241,234,0.42)" }}>Primary constraint: Income concentration</span>
                <span style={{ ...T.meta, color: "rgba(244,241,234,0.42)" }}>Stress test: Largest source removed &#8594; projected 44</span>
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
/* HERO VIDEO — today's modal approach                                 */
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
/* HOW IT WORKS — institutional system explanation                     */
/* ================================================================== */
function HowItWorksSection() {
  const { ref, visible } = useInView();
  const m = useMobile();
  const { ref: ref2, visible: v2 } = useInView();
  const { ref: ref3, visible: v3 } = useInView();

  const bg = C.sandBg;

  return (
    <>
    {/* ── OPENING ── */}
    <section ref={ref} aria-label="How It Works" style={{ background: bg, paddingTop: m ? sp(12) : sp(18), paddingBottom: m ? sp(10) : sp(15), paddingLeft: px(m), paddingRight: px(m) }}>
      <div style={{ maxWidth: 1100, margin: "0 auto", ...fadeIn(visible) }}>
        <div style={{ display: m ? "block" : "flex", justifyContent: "space-between", alignItems: "flex-end", gap: sp(8) }}>
          <div style={{ flex: 1, maxWidth: 640 }}>
            <p style={{ fontSize: 13, fontWeight: 700, letterSpacing: "0.14em", color: C.teal, marginBottom: sp(4), textTransform: "uppercase" as const }}>How It Works</p>
            <h2 style={{ fontSize: m ? 42 : 72, fontWeight: 600, lineHeight: 1.0, color: C.navy, letterSpacing: "-0.04em", marginBottom: m ? sp(4) : 0 }}>
              Measured in<br />structure. Not<br />in dollars.
            </h2>
          </div>
          <div style={{ maxWidth: 400, paddingBottom: m ? 0 : sp(1) }}>
            <p style={{ fontSize: m ? 18 : 20, fontWeight: 400, lineHeight: 1.65, color: C.muted, marginBottom: sp(3) }}>
              RunPayway evaluates how your income is built — not how much you make. No accounts. No credit pulls. No financial data.
            </p>
            <p style={{ fontSize: 14, fontWeight: 500, color: C.light }}>Model RP-2.0 &middot; Deterministic &middot; Same inputs &#8594; same result</p>
          </div>
        </div>
      </div>
    </section>

    {/* ── STAGES ── */}
    <section ref={ref2} aria-label="System Process" style={{ background: bg, paddingTop: 0, paddingBottom: m ? sp(10) : sp(15), paddingLeft: px(m), paddingRight: px(m) }}>
      <div style={{ maxWidth: 1100, margin: "0 auto" }}>

        {/* Stage grid — 01 and 02 side by side */}
        <div style={{ display: m ? "block" : "grid", gridTemplateColumns: "1fr 1fr", gap: sp(3), marginBottom: m ? sp(4) : sp(3), ...fadeIn(v2) }}>

          {/* 01 — Structural Profile */}
          <div style={{ backgroundColor: C.navy, borderRadius: 16, padding: m ? sp(4) : sp(5), marginBottom: m ? sp(3) : 0 }}>
            <span style={{ fontSize: m ? 56 : 72, fontWeight: 700, color: "rgba(255,255,255,0.06)", lineHeight: 1, display: "block", marginBottom: sp(3) }}>01</span>
            <h3 style={{ fontSize: m ? 22 : 26, fontWeight: 600, color: "#F4F1EA", lineHeight: 1.2, marginBottom: sp(2) }}>Structural Profile</h3>
            <p style={{ fontSize: m ? 15 : 16, color: "rgba(244,241,234,0.55)", lineHeight: 1.65, margin: 0 }}>
              You provide context about how your income operates — classification, operating structure, income model, and industry. No dollar inputs. No account access.
            </p>
          </div>

          {/* 02 — Structural Assessment */}
          <div style={{ backgroundColor: C.navy, borderRadius: 16, padding: m ? sp(4) : sp(5) }}>
            <span style={{ fontSize: m ? 56 : 72, fontWeight: 700, color: "rgba(255,255,255,0.06)", lineHeight: 1, display: "block", marginBottom: sp(3) }}>02</span>
            <h3 style={{ fontSize: m ? 22 : 26, fontWeight: 600, color: "#F4F1EA", lineHeight: 1.2, marginBottom: sp(2) }}>Structural Assessment</h3>
            <p style={{ fontSize: m ? 15 : 16, color: "rgba(244,241,234,0.55)", lineHeight: 1.65, margin: 0 }}>
              Six fixed questions evaluate the architecture of your income — recurrence, concentration, source count, forward visibility, consistency, and labor independence.
            </p>
          </div>
        </div>

        {/* 6 Dimensions — full-width data table on dark */}
        <div style={{ backgroundColor: C.navy, borderRadius: 16, padding: m ? sp(3) : sp(5), marginBottom: m ? sp(4) : sp(3), ...fadeIn(v2, 100) }}>
          <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.12em", color: "rgba(244,241,234,0.30)", marginBottom: sp(3), textTransform: "uppercase" as const }}>6 Structural Dimensions</p>
          <div style={{ display: "grid", gridTemplateColumns: m ? "1fr" : "1fr 1fr 1fr", gap: 0 }}>
            {[
              { dim: "Recurrence", sub: "Income that renews without re-selling" },
              { dim: "Concentration", sub: "Reliance on your single largest source" },
              { dim: "Source Count", sub: "Number of meaningful income streams" },
              { dim: "Forward Visibility", sub: "Income already secured ahead of time" },
              { dim: "Consistency", sub: "Monthly income fluctuation level" },
              { dim: "Labor Independence", sub: "Income that continues without active work" },
            ].map((d, i) => (
              <div key={d.dim} style={{
                padding: m ? `${sp(2)}px 0` : sp(3),
                borderBottom: m ? `1px solid rgba(255,255,255,0.06)` : (i < 3 ? `1px solid rgba(255,255,255,0.06)` : "none"),
                borderRight: !m && (i % 3 !== 2) ? `1px solid rgba(255,255,255,0.06)` : "none",
              }}>
                <div style={{ fontSize: m ? 16 : 18, fontWeight: 600, color: "#F4F1EA", marginBottom: 4 }}>{d.dim}</div>
                <div style={{ fontSize: 14, color: "rgba(244,241,234,0.40)", lineHeight: 1.45 }}>{d.sub}</div>
              </div>
            ))}
          </div>
          <p style={{ fontSize: 14, fontWeight: 600, color: "rgba(244,241,234,0.30)", marginTop: sp(3) }}>No financial data. Only structural patterns.</p>
        </div>

        {/* Stage grid — 03 and 04 side by side */}
        <div style={{ display: m ? "block" : "grid", gridTemplateColumns: "1fr 1fr", gap: sp(3), ...fadeIn(v2, 200) }}>

          {/* 03 — Score Generation */}
          <div style={{ backgroundColor: "#FFFFFF", borderRadius: 16, padding: m ? sp(4) : sp(5), border: `1px solid ${C.border}`, marginBottom: m ? sp(3) : 0 }}>
            <span style={{ fontSize: m ? 56 : 72, fontWeight: 700, color: "rgba(14,26,43,0.04)", lineHeight: 1, display: "block", marginBottom: sp(3) }}>03</span>
            <h3 style={{ fontSize: m ? 22 : 26, fontWeight: 600, color: C.navy, lineHeight: 1.2, marginBottom: sp(2) }}>Score Generation</h3>
            <p style={{ fontSize: m ? 15 : 16, color: C.muted, lineHeight: 1.65, marginBottom: sp(3) }}>
              A single standardized output: score (0&#8211;100), stability band, primary constraint, distance to next tier, and the highest-leverage improvement.
            </p>
            {/* Bands inline */}
            <div style={{ borderTop: `1px solid ${C.border}`, paddingTop: sp(2) }}>
              {[
                ["Limited", "0\u201329"],
                ["Developing", "30\u201349"],
                ["Established", "50\u201374"],
                ["High", "75\u2013100"],
              ].map(([band, range]) => (
                <div key={band} style={{ display: "flex", justifyContent: "space-between", padding: `${sp(0.75)}px 0` }}>
                  <span style={{ fontSize: 14, fontWeight: 600, color: C.navy }}>{band}</span>
                  <span style={{ fontSize: 14, color: C.light, fontVariantNumeric: "tabular-nums" }}>{range}</span>
                </div>
              ))}
            </div>
          </div>

          {/* 04 — Full Diagnostic */}
          <div style={{ backgroundColor: "#FFFFFF", borderRadius: 16, padding: m ? sp(4) : sp(5), border: `1px solid ${C.border}` }}>
            <span style={{ fontSize: m ? 56 : 72, fontWeight: 700, color: "rgba(14,26,43,0.04)", lineHeight: 1, display: "block", marginBottom: sp(3) }}>04</span>
            <h3 style={{ fontSize: m ? 22 : 26, fontWeight: 600, color: C.navy, lineHeight: 1.2, marginBottom: sp(2) }}>Full Diagnostic</h3>
            <p style={{ fontSize: m ? 15 : 16, color: C.muted, lineHeight: 1.65, marginBottom: sp(3) }}>
              Your score becomes a structured action system.
            </p>
            <div style={{ borderTop: `1px solid ${C.border}`, paddingTop: sp(2) }}>
              {[
                "PressureMap\u2122 analysis",
                "Risk scenarios ranked by damage",
                "Action priorities ranked by impact",
                "Industry-specific scripts",
                "12-week execution roadmap",
                "Command Center simulator",
              ].map(item => (
                <div key={item} style={{ padding: `${sp(0.75)}px 0` }}>
                  <span style={{ fontSize: 14, fontWeight: 500, color: C.navy }}>{item}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>

    {/* ── MODEL + TRUST + CTA ── */}
    <section ref={ref3} aria-label="Model and Trust" style={{ background: C.white, paddingTop: m ? sp(10) : sp(15), paddingBottom: m ? sp(10) : sp(15), paddingLeft: px(m), paddingRight: px(m) }}>
      <div style={{ maxWidth: 1100, margin: "0 auto" }}>

        {/* Model — side by side: 60/40 split as visual blocks */}
        <div style={{ marginBottom: m ? sp(10) : sp(15), ...fadeIn(v3) }}>
          <p style={{ fontSize: 13, fontWeight: 700, letterSpacing: "0.14em", color: C.teal, marginBottom: sp(4), textTransform: "uppercase" as const }}>How the Model Works</p>
          <h3 style={{ fontSize: m ? 30 : 44, fontWeight: 600, color: C.navy, lineHeight: 1.08, letterSpacing: "-0.03em", marginBottom: m ? sp(5) : sp(6) }}>
            Two scoring blocks.<br />Fixed rules. No exceptions.
          </h3>

          <div style={{ display: m ? "block" : "flex", gap: sp(3), marginBottom: sp(5) }}>
            {/* Structure */}
            <div style={{ flex: 6, backgroundColor: C.navy, borderRadius: 14, padding: m ? sp(4) : sp(5), marginBottom: m ? sp(3) : 0 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: sp(3) }}>
                <span style={{ fontSize: 14, fontWeight: 700, letterSpacing: "0.10em", color: "rgba(244,241,234,0.40)", textTransform: "uppercase" as const }}>Structure</span>
                <span style={{ fontSize: m ? 36 : 48, fontWeight: 700, color: "rgba(244,241,234,0.12)" }}>60%</span>
              </div>
              <p style={{ fontSize: 15, color: "rgba(244,241,234,0.50)", lineHeight: 1.6, marginBottom: sp(3) }}>Measures how income is built.</p>
              {["Recurrence", "Diversification", "Visibility", "Concentration balance"].map(item => (
                <p key={item} style={{ fontSize: 15, fontWeight: 500, color: "#F4F1EA", margin: `0 0 ${sp(1)}px` }}>{item}</p>
              ))}
            </div>
            {/* Stability */}
            <div style={{ flex: 4, backgroundColor: C.sandBg, borderRadius: 14, padding: m ? sp(4) : sp(5), border: `1px solid ${C.border}` }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: sp(3) }}>
                <span style={{ fontSize: 14, fontWeight: 700, letterSpacing: "0.10em", color: C.light, textTransform: "uppercase" as const }}>Stability</span>
                <span style={{ fontSize: m ? 36 : 48, fontWeight: 700, color: "rgba(14,26,43,0.06)" }}>40%</span>
              </div>
              <p style={{ fontSize: 15, color: C.muted, lineHeight: 1.6, marginBottom: sp(3) }}>Measures how income behaves.</p>
              {["Labor dependence", "Earnings consistency", "Continuity under disruption"].map(item => (
                <p key={item} style={{ fontSize: 15, fontWeight: 500, color: C.navy, margin: `0 0 ${sp(1)}px` }}>{item}</p>
              ))}
            </div>
          </div>

          {/* Cross-factor — single line */}
          <p style={{ fontSize: m ? 16 : 18, color: C.muted, lineHeight: 1.65, maxWidth: 700 }}>
            Cross-factor interaction rules capture how weaknesses compound. High concentration + low visibility = penalty. Strong recurrence + low labor dependence = boost. Rules are fixed. No machine learning.
          </p>
        </div>

        {/* Does / Does Not — two columns with strong visual weight */}
        <div style={{ marginBottom: m ? sp(10) : sp(15), ...fadeIn(v3, 200) }}>
          <div style={{ display: m ? "block" : "flex", gap: sp(3) }}>
            <div style={{ flex: 1, backgroundColor: C.sandBg, borderRadius: 14, padding: m ? sp(4) : sp(5), marginBottom: m ? sp(3) : 0 }}>
              <p style={{ fontSize: 13, fontWeight: 700, letterSpacing: "0.12em", color: C.teal, marginBottom: sp(3), textTransform: "uppercase" as const }}>This system does</p>
              {[
                "Measure structure, not income level",
                "Produce consistent, repeatable outputs",
                "Identify structural weaknesses precisely",
                "Quantify the improvement path",
              ].map(item => (
                <p key={item} style={{ fontSize: m ? 16 : 18, fontWeight: 500, color: C.navy, margin: `0 0 ${sp(2)}px`, lineHeight: 1.45 }}>{item}</p>
              ))}
            </div>
            <div style={{ flex: 1, backgroundColor: C.sandBg, borderRadius: 14, padding: m ? sp(4) : sp(5) }}>
              <p style={{ fontSize: 13, fontWeight: 700, letterSpacing: "0.12em", color: C.light, marginBottom: sp(3), textTransform: "uppercase" as const }}>This system does not</p>
              {[
                "Access bank accounts",
                "Pull credit data",
                "Use AI to alter scoring",
                "Predict future income",
                "Change results by industry or bias",
              ].map(item => (
                <p key={item} style={{ fontSize: m ? 16 : 18, color: C.light, margin: `0 0 ${sp(2)}px`, lineHeight: 1.45 }}>{item}</p>
              ))}
            </div>
          </div>
          <p style={{ fontSize: m ? 18 : 22, fontWeight: 600, color: C.navy, marginTop: m ? sp(5) : sp(6), textAlign: "center" as const }}>
            This is a classification system. Not a prediction engine.
          </p>
        </div>

      </div>
    </section>
    </>
  );
}










/* ================================================================== */
/* PROOF (Testimonials) — yesterday's version                          */
/* ================================================================== */
function ProofSection() {
  const { ref, visible } = useInView();
  const m = useMobile();

  const testimonials = [
    { quote: "The score made it obvious that too much of my income came from one source. The report gave me a clearer next step than my own planning notes had.", name: "Sarah M.", role: "Real Estate Agent" },
    { quote: "The value was not the number alone. It was seeing which structural weakness mattered most and what a single change would do to the score.", name: "James R.", role: "Software Contractor" },
    { quote: "The report helped me separate revenue from stability. I had been treating them like the same thing.", name: "Priya K.", role: "Management Consultant" },
  ];

  return (
    <section ref={ref} aria-label="Proof" style={{
      background: C.navy, paddingTop: secY(m), paddingBottom: secY(m),
      paddingLeft: px(m), paddingRight: px(m),
    }}>
      <div style={{ maxWidth: maxW, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: sp(5), ...fadeIn(visible) }}>
          <h2 style={{ ...h2(m), color: C.sand }}>What the assessment revealed.</h2>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: m ? "1fr" : "repeat(3, 1fr)", gap: sp(2.5) }}>
          {testimonials.map((t, i) => (
            <div key={t.name} style={{
              backgroundColor: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)",
              borderRadius: sp(1), padding: m ? sp(3.5) : sp(4),
              display: "flex", flexDirection: "column",
              ...fadeIn(visible, 150 + i * 100),
            }}>
              <p style={{ ...body(m), color: "rgba(244,241,234,0.70)", fontStyle: "italic", margin: `0 0 ${sp(2.5)}px`, flex: 1 }}>
                &ldquo;{t.quote}&rdquo;
              </p>
              <div style={{ borderTop: "1px solid rgba(244,241,234,0.06)", paddingTop: sp(2) }}>
                <div style={{ ...T.label, fontWeight: 600, color: C.sand, marginBottom: 2 }}>{t.name}</div>
                <div style={{ ...T.meta, color: "rgba(244,241,234,0.42)" }}>{t.role}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}




/* ================================================================== */
/* PRICING — today's version (light bg with clear tiers)               */
/* ================================================================== */
function PricingSection() {
  const { ref, visible } = useInView();
  const m = useMobile();

  return (
    <section ref={ref} aria-label="Pricing" style={{
      background: `linear-gradient(180deg, ${C.white} 0%, ${C.sand} 100%)`,
      paddingTop: m ? sp(10) : sp(14), paddingBottom: m ? sp(10) : sp(14),
      paddingLeft: px(m), paddingRight: px(m),
    }}>
      <div style={{ maxWidth: maxW, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: m ? sp(6) : sp(8), ...fadeIn(visible) }}>
          <h2 style={{ ...h2(m), color: C.navy, marginBottom: sp(2) }}>
            Start free. Go deeper when you&#8217;re ready.
          </h2>
          <p style={{ ...body(m), color: C.muted, maxWidth: 460, margin: "0 auto" }}>
            Your score is instant and free. The full diagnostic is there when you need it.
          </p>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: m ? "1fr" : "1fr 1fr", gap: sp(3), maxWidth: 720, margin: "0 auto", ...fadeIn(visible, 150) }}>
          {/* Free */}
          <div style={{
            ...cardStyle,
            padding: m ? sp(3.5) : sp(4),
          }}>
            <div style={{ ...T.label, color: C.teal, marginBottom: sp(2) }}>
              Income Stability Score&#8482;
            </div>
            <div style={{ ...price(m), color: C.navy, marginBottom: sp(2) }}>$0</div>
            <div style={{ marginBottom: sp(3) }}>
              {["Score out of 100", "Stability band", "Primary structural constraint", "One recommended direction"].map((item) => (
                <div key={item} style={{ display: "flex", alignItems: "center", gap: sp(1), marginBottom: sp(0.75) }}>
                  <span style={{ color: C.teal, fontSize: 14, flexShrink: 0 }}>&#x2713;</span>
                  <span style={{ ...body(m), color: C.muted }}>{item}</span>
                </div>
              ))}
            </div>
            <Link href="/diagnostic-portal" style={{
              display: "flex", alignItems: "center", justifyContent: "center",
              width: "100%", height: sp(6.5), borderRadius: 10,
              backgroundColor: C.white, color: C.navy, ...T.cta,
              textDecoration: "none", border: `1px solid ${C.border}`,
              transition: "background-color 200ms ease",
            }}
              onMouseEnter={(e) => { if (!canHover()) return; e.currentTarget.style.backgroundColor = C.sand; }}
              onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = C.white; }}
            >Start Free Assessment</Link>
          </div>

          {/* Paid */}
          <div style={{
            ...cardStyle,
            border: `1px solid rgba(75,63,174,0.12)`,
            padding: m ? sp(3.5) : sp(4),
          }}>
            <div style={{ ...T.label, color: C.teal, marginBottom: sp(2) }}>
              RunPayway&#8482; Diagnostic Report
            </div>
            <div style={{ ...price(m), color: C.navy, marginBottom: sp(2) }}>$69</div>
            <div style={{ marginBottom: sp(3) }}>
              {[
                "3-page diagnostic report with income composition analysis",
                "PressureMap\u2122 with AI-powered zone analysis",
                "Industry-specific scripts and action plan",
                "12-week roadmap with success criteria",
                "Command Center with what-if simulator",
                "Peer benchmarking across your sector",
              ].map((item) => (
                <div key={item} style={{ display: "flex", alignItems: "flex-start", gap: sp(1), marginBottom: sp(0.75) }}>
                  <span style={{ color: C.purple, fontSize: 14, flexShrink: 0, marginTop: 2 }}>&#x2713;</span>
                  <span style={{ ...body(m), color: C.muted }}>{item}</span>
                </div>
              ))}
            </div>
            <a href={process.env.NEXT_PUBLIC_STRIPE_CHECKOUT_URL || "https://buy.stripe.com/9B66oz48EaYU2lc4IF2Nq05"} style={{
              display: "flex", alignItems: "center", justifyContent: "center",
              width: "100%", height: sp(6.5), borderRadius: 10,
              backgroundColor: C.navy, color: "#F7F5F0", ...T.cta,
              textDecoration: "none",
              transition: "opacity 200ms ease",
            }}
              onMouseEnter={(e) => { if (!canHover()) return; e.currentTarget.style.opacity = "0.9"; }}
              onMouseLeave={(e) => { e.currentTarget.style.opacity = "1"; }}
            >Get Your Full Diagnostic — $69</a>
            <p style={{ ...T.meta, color: C.light, textAlign: "center", marginTop: sp(1.5), marginBottom: 0 }}>30-day money-back guarantee</p>
          </div>
        </div>
      </div>
    </section>
  );
}


/* ================================================================== */
/* FAQ — today's version (better questions)                            */
/* ================================================================== */
function FaqSection({ openFaq, setOpenFaq }: { openFaq: number | null; setOpenFaq: (v: number | null) => void }) {
  const { ref, visible } = useInView();
  const m = useMobile();

  const faqs = [
    { q: "What is the Income Stability Score?", a: "A standardized measure of how stable your income structure is under disruption. It evaluates six structural dimensions and returns a score out of 100 with a stability band." },
    { q: "Who is this built for?", a: "Independent professionals, freelancers, consultants, contractors, and small business owners — anyone whose income does not arrive automatically every two weeks." },
    { q: "What does the full diagnostic include?", a: "A 3-page diagnostic report with income composition analysis, PressureMap with AI-powered zone analysis, Command Center with what-if simulator, industry-specific scripts, a 12-week roadmap, and peer benchmarking." },
    { q: "How is this different from revenue tracking?", a: "Revenue measures how much you earn. This measures how stable that income is. You can have strong revenue and fragile structure. The Score reveals the difference." },
    { q: "What is the PressureMap?", a: "An AI-powered analysis of your income zones — where pressure concentrates, how your structure compares to peers in your sector, and which zones need attention first." },
    { q: "What is the Command Center?", a: "A living diagnostic tool that includes a what-if simulator to test structural changes, industry-specific scripts, a 12-week roadmap with success criteria, and progress tracking over time." },
    { q: "How long does it take?", a: "About 90 seconds. You receive your score and stability band instantly. The full diagnostic is generated immediately after purchase." },
    { q: "Is my data private?", a: "Yes. No bank connections. No credit pulls. No external data access. Your information is private by default." },
  ];

  return (
    <section ref={ref} aria-label="FAQ" style={{
      background: C.white, paddingTop: secY(m), paddingBottom: secY(m),
      paddingLeft: px(m), paddingRight: px(m),
    }}>
      <div style={{ maxWidth: 820, margin: "0 auto" }}>
        <h2 style={{ ...h2(m), color: C.navy, textAlign: "center", marginBottom: sp(5), ...fadeIn(visible) }}>
          Frequently asked questions
        </h2>

        <div style={fadeIn(visible, 100)}>
          {faqs.map((faq, i) => {
            const isOpen = openFaq === i;
            const panelId = `faq-panel-${i}`;
            const btnId = `faq-btn-${i}`;
            return (
              <div key={i} style={{ borderTop: `1px solid ${C.border}`, transition: "background-color 200ms ease" }}>
                <button id={btnId} onClick={() => setOpenFaq(isOpen ? null : i)} aria-expanded={isOpen} aria-controls={panelId}
                  style={{ width: "100%", padding: `${sp(2.5)}px ${sp(1)}px`, minHeight: 48, display: "flex", alignItems: "center", justifyContent: "space-between", background: "none", border: "none", cursor: "pointer", textAlign: "left" }}>
                  <span style={{ ...h3(m), fontWeight: 500, color: C.navy, paddingRight: sp(2) }}>{faq.q}</span>
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
          <p style={{ ...T.meta, color: C.light }}>
            Still have questions?{" "}
            <Link href="/contact" style={{ color: C.muted, textDecoration: "underline", textUnderlineOffset: 3 }}>Get in touch</Link>
          </p>
        </div>
      </div>
    </section>
  );
}


/* ================================================================== */
/* FINAL CTA — today's emotional close version                         */
/* ================================================================== */
function FinalCta() {
  const { ref, visible } = useInView();
  const m = useMobile();

  return (
    <section ref={ref} aria-label="Final CTA" style={{
      background: "#F8F6F6",
      paddingTop: m ? sp(10) : sp(14),
      paddingBottom: m ? sp(10) : sp(14),
      paddingLeft: px(m), paddingRight: px(m), textAlign: "center",
    }}>
      <div style={{ maxWidth: 600, margin: "0 auto", ...fadeIn(visible) }}>
        <h2 style={{
          fontSize: m ? 32 : 48, fontWeight: 600,
          color: C.navy, lineHeight: 1.08, letterSpacing: "-0.03em",
          marginBottom: sp(3),
        }}>
          See where your income stands.
        </h2>
        <p style={{ fontSize: m ? 17 : 19, fontWeight: 400, color: C.muted, lineHeight: 1.6, marginBottom: sp(6) }}>
          Under two minutes. No accounts. No credit pull.
        </p>

        <Link href="/diagnostic-portal" style={{
          display: "inline-flex", alignItems: "center", justifyContent: "center",
          height: sp(8), padding: `0 ${sp(6)}px`, borderRadius: 10,
          backgroundColor: C.navy,
          color: "#FFFFFF", fontSize: 17, fontWeight: 600, textDecoration: "none",
          boxShadow: "0 4px 16px rgba(14,26,43,0.12)",
          transition: "transform 200ms ease, box-shadow 200ms ease",
        }}
          onMouseEnter={(e) => { if (!canHover()) return; e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = "0 8px 24px rgba(14,26,43,0.18)"; }}
          onMouseLeave={(e) => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "0 4px 16px rgba(14,26,43,0.12)"; }}
        >
          Get Your Free Score
        </Link>
      </div>
    </section>
  );
}


/* ================================================================== */
/* DISCLAIMER — today's version                                        */
/* ================================================================== */
function DisclaimerSection() {
  const m = useMobile();
  return (
    <section aria-label="Disclaimer" style={{
      background: C.sand, paddingTop: m ? sp(4) : sp(5), paddingBottom: m ? sp(4) : sp(5),
      paddingLeft: px(m), paddingRight: px(m), borderTop: `1px solid ${C.border}`,
    }}>
      <p style={{ ...T.meta, color: C.light, textAlign: "center", maxWidth: 640, margin: "0 auto", lineHeight: 1.6 }}>
        The Income Stability Score&#8482; is a structural income assessment based on information provided by the user.
        It does not provide financial advice, investment advice, credit underwriting, or prediction of future outcomes.
      </p>
    </section>
  );
}


/* ================================================================== */
/* PAGE EXPORT                                                         */
/* ================================================================== */
const FAQ_SCHEMA = {
  "@context": "https://schema.org", "@type": "FAQPage",
  mainEntity: [
    { "@type": "Question", name: "What is the Income Stability Score?", acceptedAnswer: { "@type": "Answer", text: "A standardized measure of how stable your income structure is under disruption. It evaluates four dimensions and returns a score out of 100 with a stability band." } },
    { "@type": "Question", name: "Who is this built for?", acceptedAnswer: { "@type": "Answer", text: "Independent professionals, freelancers, consultants, contractors, and small business owners." } },
    { "@type": "Question", name: "What does the full diagnostic include?", acceptedAnswer: { "@type": "Answer", text: "A 3-page diagnostic report, PressureMap with AI-powered zone analysis, Command Center with what-if simulator, industry-specific scripts, a 12-week roadmap, and peer benchmarking." } },
    { "@type": "Question", name: "How is this different from revenue tracking?", acceptedAnswer: { "@type": "Answer", text: "Revenue measures how much you earn. This measures how stable that income is under disruption." } },
    { "@type": "Question", name: "What is the PressureMap?", acceptedAnswer: { "@type": "Answer", text: "An AI-powered analysis of your income zones — where pressure concentrates and how your structure compares to peers." } },
    { "@type": "Question", name: "What is the Command Center?", acceptedAnswer: { "@type": "Answer", text: "A living diagnostic tool with a what-if simulator, industry-specific scripts, a 12-week roadmap, and progress tracking." } },
    { "@type": "Question", name: "How long does it take?", acceptedAnswer: { "@type": "Answer", text: "About 90 seconds. Instant results." } },
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

export default function LandingPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  return (
    <div className="overflow-x-hidden">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(FAQ_SCHEMA) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(PRODUCT_SCHEMA) }} />
      <StickyNav />
      <HeroSection />
      <HeroVideo />
      <HowItWorksSection />
      <ProofSection />
      <PricingSection />
      <FaqSection openFaq={openFaq} setOpenFaq={setOpenFaq} />
      <FinalCta />
      <DisclaimerSection />
    </div>
  );
}
