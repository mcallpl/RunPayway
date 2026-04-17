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
  { key: "consulting", slug: "consulting", name: "Consulting", constraint: "You are the product", desc: "Your clients pay for your time, not a system. If you stop delivering, 85% of your income stops with you.", prep: ["Know what % of your income comes from your single largest client", "Know whether your current work is contracted, retainer, or project-by-project", "Think about what your income looks like in month 2 if you sign nothing new today"] },
  { key: "real_estate", slug: "real-estate", name: "Real Estate", constraint: "Pipeline dependency", desc: "One delayed closing or one lost listing can erase a quarter of annual earnings. Nothing is contractually yours until it closes.", prep: ["Know how many deals are under signed contract vs. verbal pipeline right now", "Know roughly what % of last year\u2019s income came from your top 1\u20132 closings", "Think about whether you have any income that continues between transactions"] },
  { key: "sales", slug: "sales-brokerage", name: "Sales / Brokerage", constraint: "Nothing carries forward", desc: "Last quarter was strong. But your structure doesn\u2019t carry that forward. Next quarter starts from zero unless you close again.", prep: ["Know what % of this quarter\u2019s earnings will carry forward automatically", "Know how many separate commission sources your income comes from", "Think about what your income is in a month where no deals close"] },
  { key: "creative", slug: "freelance-creative", name: "Freelance / Creative", constraint: "Every month starts at zero", desc: "No project means no income. No retainer means no floor. You are re-earning your entire livelihood every 30 days.", prep: ["Know how many clients are actively paying you right now", "Know whether any of your income repeats without you re-selling it", "Think about what your income would be if you signed nothing new for 30 days"] },
  { key: "construction", slug: "construction-trades", name: "Construction / Trades", constraint: "The next job isn\u2019t signed yet", desc: "The current project is solid. The next one is a handshake. Your income has no structural buffer between jobs.", prep: ["Know how many months of signed work you currently have in backlog", "Know what % of your jobs come from repeat vs. new customers", "Think about whether your income stops completely between projects"] },
  { key: "media", slug: "media-entertainment", name: "Media / Entertainment", constraint: "Between projects, income is zero", desc: "Strong projects create strong months. But between them, your income is not low \u2014 it is zero. No carry. No residual.", prep: ["Know how many months your current projects or contracts run", "Know whether you have any income that continues between active engagements", "Think about what your income looks like in a month with no active project"] },
  { key: "insurance", slug: "insurance", name: "Insurance", constraint: "New business masks renewal erosion", desc: "Strong production quarters feel like growth. But if renewals are slipping underneath, your structure is compounding backwards.", prep: ["Know what % of your income is renewals vs. new production", "Know whether your renewal book is growing, flat, or declining", "Think about how much your income would drop if new sales stopped for 90 days"] },
  { key: "legal", slug: "legal-services", name: "Legal Services", constraint: "Three matters carry the practice", desc: "Count your top three matters. They likely carry 60\u201370% of your billings. When one concludes, the gap arrives all at once.", prep: ["Know how many active matters you currently have", "Know what % of your billings come from your top 2\u20133 matters", "Think about whether any of your income is on retainer vs. matter-by-matter"] },
  { key: "technology", slug: "technology", name: "Technology", constraint: "One employer, one system, one decision", desc: "Your compensation feels stable because the system around it is stable. But it\u2019s one layoff away from a total structural shift.", prep: ["Know what % of your total compensation is variable \u2014 bonus, equity, or commissions", "Know how many income sources you have outside your primary employer", "Think about what your income looks like if your role was eliminated today"] },
  { key: "finance", slug: "finance-banking", name: "Finance / Banking", constraint: "The variable component is the one that matters", desc: "Base salary creates a floor. But the bonus, the production credit \u2014 that\u2019s where real earnings live. And that part can vanish in one cycle.", prep: ["Know what % of your annual compensation is variable vs. fixed base", "Know whether your base salary alone would cover your financial obligations", "Think about how tied your income is to market conditions or deal flow"] },
  { key: "healthcare", slug: "healthcare", name: "Healthcare", constraint: "One system, no alternatives", desc: "Steady pay from one institution feels safe until the institution restructures. When your sole employer changes models, you have no alternative.", prep: ["Know whether your income comes from one institution or multiple sources", "Know what your income would look like if your primary employer restructured", "Think about whether any of your income continues when you\u2019re not actively working"] },
  { key: "retail", slug: "retail-ecommerce", name: "Retail / E-Commerce", constraint: "Revenue is not income", desc: "Sales look strong until you subtract inventory, returns, and platform fees. What you deposit and what you keep are two different numbers.", prep: ["Know how much your monthly revenue varies from your best to your slowest month", "Know whether you rely on one core product or have multiple lines", "Think about what % of your revenue comes from returning vs. new customers"] },
  { key: "hospitality", slug: "hospitality", name: "Hospitality / Food Service", constraint: "Demand disappears overnight", desc: "One slow season, one bad review, one shift in foot traffic. Your revenue is a daily vote that customers can stop casting without notice.", prep: ["Know what your income looks like in your slowest month of the year", "Know how much of your revenue is tied to foot traffic vs. contracted events", "Think about how quickly your income would change if demand shifted"] },
  { key: "transportation", slug: "transportation-logistics", name: "Transportation / Logistics", constraint: "Utilization is everything", desc: "An idle truck or an empty route earns nothing. Your income depends on constant movement \u2014 and one breakdown changes the entire month.", prep: ["Know how many active clients or contracts you currently have", "Know what happens to your income if your largest route or client pauses", "Think about whether your income is consistent or heavily tied to utilization"] },
  { key: "manufacturing", slug: "manufacturing", name: "Manufacturing", constraint: "One contract carries the floor", desc: "Your largest buyer likely represents 40%+ of output. If they renegotiate, delay, or leave, your fixed costs don\u2019t shrink with them.", prep: ["Know what % of your output goes to your single largest buyer", "Know whether your current contracts are signed agreements or ongoing relationships", "Think about how your fixed costs compare to your income in a slow month"] },
  { key: "education", slug: "education", name: "Education", constraint: "The ceiling is the structure", desc: "Your income is predictable because the system caps it. Stability is high, but so is the cost of staying \u2014 growth requires leaving.", prep: ["Know whether your income comes from one institution or multiple sources", "Know what your income would be if your primary position ended today", "Think about whether you have any income outside your primary teaching or instruction role"] },
  { key: "nonprofit", slug: "nonprofit", name: "Nonprofit / Public Sector", constraint: "Funding cycles dictate everything", desc: "Your salary exists because a grant was renewed or a budget was approved. When the cycle turns, positions disappear regardless of performance.", prep: ["Know whether your position is grant-funded, budget-funded, or both", "Know when your current funding cycle ends", "Think about whether your income could continue if the primary funding source changed"] },
  { key: "agriculture", slug: "agriculture", name: "Agriculture", constraint: "You can\u2019t control the two things that matter most", desc: "Weather and market price. You plant in hope and harvest in uncertainty. No contract protects you from a bad season.", prep: ["Know whether you have any contracted sales vs. open market sales", "Know how much last year\u2019s income varied from a typical year", "Think about what % of your income comes from one crop, product, or buyer"] },
  { key: "energy", slug: "energy-utilities", name: "Energy / Utilities", constraint: "Commodity prices set your margin", desc: "Your operation runs the same whether prices are up or down. But your income doesn\u2019t. One market shift reprices six months of work.", prep: ["Know whether your income is tied to commodity prices or contracted rates", "Know how much your income varied month-to-month last year", "Think about whether your customers are under long-term contracts or spot pricing"] },
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
            {/* Persona eyebrow */}
            <div style={{ marginBottom: m ? 20 : 24, ...fadeIn(visible) }}>
              <span style={{
                fontSize: 12, fontWeight: 700, letterSpacing: "0.06em",
                color: C.teal, textTransform: "uppercase" as const,
              }}>
                Freelancer &middot; Founder &middot; Agent &middot; Consultant &middot; Creator &middot; Contractor
              </span>
            </div>

            <h1 style={{ fontSize: m ? 36 : 56, fontWeight: 700, lineHeight: 1.06, letterSpacing: "-0.035em", color: C.navy, marginBottom: m ? 16 : 20, ...fadeIn(visible, 50) }}>
              Your income has{m ? " " : <br />}a structure.{m ? " " : <br />}Now you can measure&nbsp;it.
            </h1>

            <p style={{ fontSize: m ? 17 : 22, fontWeight: 500, lineHeight: 1.45, color: C.navy, maxWidth: 480, marginBottom: 16, ...fadeIn(visible, 80) }}>
              RunPayway™ scores how stable your income actually is — what&apos;s protected, what&apos;s at risk, and what to do about&nbsp;it.
            </p>

            {/* Trust badges */}
            <div style={{ display: "flex", flexWrap: "wrap" as const, gap: m ? 10 : 12, marginBottom: m ? 32 : 40, ...fadeIn(visible, 100) }}>
              {["$69 — full report", "Private by default", "No credit pull", "2-minute assessment"].map((item, i) => (
                <span key={i} style={{ fontSize: 12, fontWeight: 600, letterSpacing: "0.04em", color: C.teal, padding: "5px 12px", borderRadius: 100, border: `1px solid ${C.teal}25`, backgroundColor: `${C.teal}06` }}>{item}</span>
              ))}
            </div>

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

        <p style={{ fontSize: 14, fontWeight: 500, color: C.textMuted, marginTop: 24, textAlign: "center" }}>
          Methodology published. Scoring version-locked. <Link href="/methodology" style={{ color: C.teal, fontWeight: 600, textDecoration: "none" }}>Read how it works&nbsp;&rarr;</Link>
        </p>
      </div>
    </header>
  );
}


/* ================================================================ */
/* SECTION 2 — PROOF MOMENT                                          */
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
          <p style={{ fontSize: m ? 20 : 24, fontWeight: 600, color: C.navy, marginBottom: 8 }}>RunPayway™ measures whether your income holds up when things change.</p>
          <p style={{ fontSize: 16, color: C.textSecondary, marginBottom: 32 }}>See where yours stands.</p>
          <CtaButton m={m} variant="primary" label="See Where You Stand" />
        </div>
      </div>
    </section>
  );
}


/* ================================================================ */
/* SECTION 4B — CONSEQUENCE                                          */
/* ================================================================ */

function ConsequenceSection() {
  const { ref, visible } = useInView();
  const m = useMobile();
  const t = useTablet();
  const fadeIn = useFadeIn();

  const scenarios = [
    {
      label: "OVERCOMMITMENT",
      text: "You take on a mortgage based on income that looks stable on paper. Structurally, it was one deal closing away from a gap.",
    },
    {
      label: "UNDERCONFIDENCE",
      text: "You pass on an opportunity \u2014 a hire, an investment, a move \u2014 because you weren\u2019t sure your income could support it. It could have. You just didn\u2019t have a number.",
    },
    {
      label: "LATE DISCOVERY",
      text: "You find out your income is fragile when a client doesn\u2019t renew. You didn\u2019t know that one relationship was carrying 70% of your structure.",
    },
  ];

  return (
    <section ref={ref} style={{ backgroundColor: C.navy, paddingTop: m ? 72 : 120, paddingBottom: m ? 72 : 120, paddingLeft: sectionPx(m, t), paddingRight: sectionPx(m, t), position: "relative" as const, overflow: "hidden" }}>
      <div className="navy-grain" />
      <div style={{ maxWidth: 960, margin: "0 auto", position: "relative", zIndex: 1 }}>

        <div style={{ textAlign: "center", marginBottom: m ? 48 : 72, ...fadeIn(visible) }}>
          <h2 style={{ fontSize: m ? 28 : 44, fontWeight: 700, lineHeight: 1.08, letterSpacing: "-0.03em", color: C.sandText, marginBottom: 20 }}>
            The problem isn&rsquo;t a fragile income.{m ? " " : <br />}It&rsquo;s not knowing.
          </h2>
          <p style={{ fontSize: m ? 17 : 20, fontWeight: 400, lineHeight: 1.6, color: "rgba(244,241,234,0.55)", maxWidth: 560, margin: "0 auto" }}>
            If your income is exposed, you&rsquo;re making decisions &mdash; what to spend, what to borrow, what risk to take &mdash; based on an assumption you&rsquo;ve never tested.
          </p>
        </div>

        <div style={{ display: m ? "block" : "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 1, backgroundColor: "rgba(255,255,255,0.06)", borderRadius: 20, overflow: "hidden", marginBottom: m ? 48 : 64, ...fadeIn(visible, 100) }}>
          {scenarios.map((s, i) => (
            <div key={i} style={{ padding: m ? "28px 24px" : "40px 36px", backgroundColor: C.navy, marginBottom: m && i < 2 ? 1 : 0 }}>
              <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.12em", color: C.teal, marginBottom: 16 }}>{s.label}</div>
              <p style={{ fontSize: m ? 15 : 16, color: "rgba(244,241,234,0.70)", lineHeight: 1.65, margin: 0 }}>{s.text}</p>
            </div>
          ))}
        </div>

        <div style={{ textAlign: "center", ...fadeIn(visible, 200) }}>
          <p style={{ fontSize: m ? 18 : 22, fontWeight: 600, color: C.sandText, marginBottom: 8, letterSpacing: "-0.01em" }}>
            A score doesn&rsquo;t change your income.
          </p>
          <p style={{ fontSize: m ? 16 : 19, fontWeight: 400, color: "rgba(244,241,234,0.55)", marginBottom: 36 }}>
            It changes what you know about it. And what you know changes every decision after.
          </p>
          <CtaButton m={m} variant="light" label="Find Out Where You Stand" />
        </div>
      </div>
    </section>
  );
}


/* ================================================================ */
/* SECTION 4C — WHAT YOUR SCORE CHANGES                              */
/* ================================================================ */

function WhatYourScoreChanges() {
  const { ref, visible } = useInView();
  const m = useMobile();
  const t = useTablet();
  const fadeIn = useFadeIn();
  const [tab, setTab] = useState<"individual" | "advisor">("individual");

  const INDIVIDUAL_ITEMS = [
    { title: "You find out if your income would survive a disruption \u2014 before one happens.", body: "One client leaves. A deal delays. Work slows. Your score shows whether your income holds." },
    { title: "You make financial decisions on structure, not assumption.", body: "Mortgages, leases, investments \u2014 almost everyone makes these based on income amount. Your score shows whether your structure can actually support them." },
    { title: "You know exactly what to fix first.", body: "Not \u201cdiversify your income.\u201d The specific change with the highest impact on your score \u2014 ranked and explained." },
    { title: "You see your income the way lenders and advisors see it.", body: "With a number. Not a feeling." },
    { title: "Progress becomes measurable.", body: "Add a retainer. Sign a longer contract. Reduce concentration. Your score reflects each change. You know it\u2019s working." },
  ];

  const ADVISOR_ITEMS = [
    { title: "You put a number on the risk you already see.", body: "You know which clients are exposed. Now you have a score to show them. Data moves conversations that intuition can\u2019t." },
    { title: "You open planning engagements that wouldn\u2019t exist without it.", body: "\u201cLet\u2019s get you from 42 to 65 by year-end\u201d creates an engagement. \u201cYou should diversify\u201d creates a nod." },
    { title: "You surface hidden risk before it becomes a crisis.", body: "Clients with fragile income often don\u2019t know it. A score of 31 is harder to dismiss than your concern." },
    { title: "Every client has a documented income stability record on file.", body: "Standardized inputs. Auditable output. Consistent across your entire book." },
    { title: "You see which clients need attention before they call you.", body: "Know who\u2019s at Limited Stability before the disruption arrives." },
  ];

  const items = tab === "individual" ? INDIVIDUAL_ITEMS : ADVISOR_ITEMS;

  return (
    <section ref={ref} style={{ backgroundColor: C.panelFill, paddingTop: m ? 72 : 120, paddingBottom: m ? 72 : 120, paddingLeft: sectionPx(m, t), paddingRight: sectionPx(m, t) }}>
      <div style={{ maxWidth: 720, margin: "0 auto" }}>

        <div style={{ textAlign: "center", marginBottom: m ? 40 : 56, ...fadeIn(visible) }}>
          <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase" as const, color: C.teal, marginBottom: 16 }}>
            WHAT YOUR SCORE DOES
          </div>
          <h2 style={{ fontSize: m ? 28 : 40, fontWeight: 600, lineHeight: 1.08, letterSpacing: "-0.028em", color: C.navy, marginBottom: 32 }}>
            What changes when you know.
          </h2>
          <div style={{ display: "inline-flex", borderRadius: 12, backgroundColor: "rgba(14,26,43,0.06)", padding: 4, gap: 4 }}>
            {(["individual", "advisor"] as const).map((key) => (
              <button key={key} onClick={() => setTab(key)} style={{
                height: 40, padding: "0 24px", borderRadius: 9, border: "none",
                fontSize: 14, fontWeight: 600, cursor: "pointer",
                transition: "all 200ms ease",
                backgroundColor: tab === key ? C.white : "transparent",
                color: tab === key ? C.navy : C.textMuted,
                boxShadow: tab === key ? "0 2px 8px rgba(14,26,43,0.10)" : "none",
              }}>
                {key === "individual" ? "For Individuals" : "For Advisors"}
              </button>
            ))}
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column" as const, ...fadeIn(visible, 100) }}>
          {items.map((item, i) => (
            <div key={`${tab}-${i}`} style={{
              display: "flex", gap: m ? 20 : 28, alignItems: "flex-start",
              padding: m ? "24px 0" : "32px 0",
              borderTop: `1px solid rgba(14,26,43,0.06)`,
              borderBottom: i === items.length - 1 ? `1px solid rgba(14,26,43,0.06)` : "none",
            }}>
              <div style={{
                width: m ? 32 : 40, height: m ? 32 : 40, borderRadius: 10, flexShrink: 0,
                backgroundColor: tab === "individual" ? C.navy : C.purple,
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: m ? 13 : 15, fontWeight: 700, color: C.white, fontFamily: mono,
              }}>
                {i + 1}
              </div>
              <div>
                <p style={{ fontSize: m ? 16 : 18, fontWeight: 700, color: C.navy, lineHeight: 1.3, margin: "0 0 6px", letterSpacing: "-0.01em" }}>
                  {item.title}
                </p>
                <p style={{ fontSize: m ? 14 : 15, color: C.textSecondary, lineHeight: 1.6, margin: 0 }}>
                  {item.body}
                </p>
              </div>
            </div>
          ))}
        </div>

        <div style={{ textAlign: "center", marginTop: m ? 40 : 56, ...fadeIn(visible, 200) }}>
          {tab === "individual" ? (
            <CtaButton m={m} variant="primary" label="Get Your Income Stability Score" />
          ) : (
            <Link href="/advisor-portal" style={{
              display: "inline-flex", alignItems: "center", justifyContent: "center",
              height: m ? 56 : 60, padding: "0 32px", borderRadius: 16,
              backgroundColor: C.purple, color: C.white,
              fontSize: 16, fontWeight: 600, textDecoration: "none",
              boxShadow: "0 8px 24px rgba(75,63,174,0.20)",
              transition: "transform 200ms, box-shadow 200ms",
            }}
              onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = "0 12px 32px rgba(75,63,174,0.30)"; }}
              onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "0 8px 24px rgba(75,63,174,0.20)"; }}
            >
              See Advisor Plans &rarr;
            </Link>
          )}
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
          <CtaButton m={m} variant="primary" label="Get Your Full Report — $69" />
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
            Earning more doesn&rsquo;t mean earning safely.
          </h2>
          <p style={{ fontSize: m ? 17 : 20, fontWeight: 400, lineHeight: 1.6, color: C.textSecondary, maxWidth: 580, margin: "0 auto 12px" }}>
            Most financial advice assumes your income is stable. RunPayway™ measures whether it actually is &mdash; how much would survive if a client left, a deal delayed, or work slowed down.
          </p>
          <p style={{ fontSize: m ? 15 : 17, fontWeight: 500, lineHeight: 1.5, color: C.textMuted, maxWidth: 480, margin: "0 auto" }}>
            Select your industry to see what typically creates the most exposure.
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
              <p style={{ fontSize: m ? 15 : 16, color: "rgba(244,241,234,0.55)", lineHeight: 1.7, margin: "0 0 20px" }}>{active.desc}</p>

              {/* Before your assessment */}
              <div style={{ padding: m ? "16px 18px" : "18px 24px", borderRadius: 14, backgroundColor: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)", marginBottom: 28 }}>
                <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.10em", color: "rgba(244,241,234,0.30)", marginBottom: 12 }}>BEFORE YOUR ASSESSMENT</div>
                <div style={{ display: "flex", flexDirection: "column" as const, gap: 10 }}>
                  {active.prep.map((item, i) => (
                    <div key={i} style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
                      <div style={{ width: 4, height: 4, borderRadius: "50%", backgroundColor: C.teal, flexShrink: 0, marginTop: 7 }} />
                      <span style={{ fontSize: m ? 13 : 14, color: "rgba(244,241,234,0.55)", lineHeight: 1.5 }}>{item}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* CTA — industry page is primary (education before conversion) */}
              <Link href={`/industries/${active.slug}`} style={{
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
                See your {active.name.split(" /")[0].toLowerCase()} score profile &rarr;
              </Link>
              <Link href="/begin" style={{
                display: "inline-flex", alignItems: "center", justifyContent: "center",
                height: 40, padding: "0 20px", borderRadius: 10, width: m ? "100%" : "auto",
                backgroundColor: "transparent", color: "rgba(244,241,234,0.50)",
                fontSize: 13, fontWeight: 500, textDecoration: "none",
                marginTop: 10,
                transition: "color 180ms",
              }}
                onMouseEnter={e => { e.currentTarget.style.color = "rgba(244,241,234,0.80)"; }}
                onMouseLeave={e => { e.currentTarget.style.color = "rgba(244,241,234,0.50)"; }}
              >
                Or start the assessment now
              </Link>
            </div>
          </div>
        )}
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
    { "@type": "Offer", price: "69", priceCurrency: "USD", name: "RunPayway\u2122 Full Report", description: "Your score breakdown, what's at risk, a 12-week plan, and scripts you can use this week." },
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
        <ConsequenceSection />
        <ProofMoment />
        <WhatYourScoreChanges />
        <WhatChanges />
        <WhatYouReceive />
        <IndustryProfiles />
        <StructuralIncomeBrief />
        <FinalCta />
      </main>
    </div>
  );
}
