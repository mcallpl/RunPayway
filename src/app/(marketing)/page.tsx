"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import EmailCapture from "@/components/EmailCapture";

/* ================================================================ */
/* HOOKS                                                              */
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
/* DESIGN SYSTEM                                                      */
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
/* SHARED COMPONENTS                                                  */
/* ================================================================ */

function ScoreRing({ score, size, stroke = 8, color, trackColor = "rgba(255,255,255,0.06)" }: {
  score: number; size: number; stroke?: number; color: string; trackColor?: string;
}) {
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
  const text = label || "Get My Stability Class — Free →";
  return (
    <Link href="/begin" style={{
      display: "inline-flex", alignItems: "center", justifyContent: "center",
      height: m ? 56 : 60, width: m ? "100%" : "auto",
      padding: m ? "0 28px" : "0 32px", borderRadius: 16,
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

/* Mobile CTA — always full width, tap-optimized */
function MCta({ label, variant = "primary" }: { label?: string; variant?: "primary" | "light" }) {
  const isPrimary = variant === "primary";
  return (
    <Link href="/begin" style={{
      display: "flex", alignItems: "center", justifyContent: "center",
      height: 56, width: "100%", borderRadius: 14,
      backgroundColor: isPrimary ? C.navy : C.white,
      color: isPrimary ? C.white : C.navy,
      fontSize: 16, fontWeight: 600, textDecoration: "none",
      boxShadow: isPrimary ? ctaShadow : "0 4px 16px rgba(14,26,43,0.08)",
      border: isPrimary ? "none" : `1px solid ${C.borderSoft}`,
    }}>
      {label || "Get My Stability Class — Free →"}
    </Link>
  );
}

/* ================================================================ */
/* INDUSTRY DATA                                                      */
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
/* DESKTOP — SECTION 1: HERO                                         */
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
        <div style={{ display: m ? "block" : "grid", gridTemplateColumns: "1fr 1fr", gap: 64, alignItems: "center", maxWidth: 1080, margin: "0 auto" }}>

          {/* Left — copy */}
          <div style={{ marginBottom: m ? 48 : 0 }}>
            <div style={{ fontSize: 13, fontWeight: 600, letterSpacing: "0.04em", color: C.teal, marginBottom: 20, ...fadeIn(visible) }}>
              Income stability isn&rsquo;t measured. Until now.
            </div>
            <h1 style={{ fontSize: m ? 34 : 52, fontWeight: 700, lineHeight: 1.06, letterSpacing: "-0.032em", color: C.navy, marginBottom: 20, ...fadeIn(visible, 40) }}>
              Is Your Income Stable Enough for Your Next Financial Decision?
            </h1>
            <p style={{ fontSize: m ? 17 : 19, fontWeight: 400, lineHeight: 1.55, color: C.textSecondary, maxWidth: 440, marginBottom: 12, ...fadeIn(visible, 80) }}>
              Find out in 2 minutes&mdash;before you take on risk.
            </p>
            <p style={{ fontSize: m ? 15 : 16, fontWeight: 400, lineHeight: 1.65, color: C.textMuted, maxWidth: 420, marginBottom: 32, ...fadeIn(visible, 100) }}>
              In 2 minutes, you&rsquo;ll know whether your income can support your next move&mdash;or needs to be fixed first.
            </p>
            <div style={{ ...fadeIn(visible, 140) }}>
              <CtaButton m={m} variant="primary" label="Get My Stability Class — Free →" />
              <p style={{ fontSize: 13, fontWeight: 500, color: C.textMuted, marginTop: 14 }}>
                No documents &middot; No accounts connected &middot; Private &middot; Instant result
              </p>
            </div>
            <p style={{ fontSize: 13, fontWeight: 500, color: C.textMuted, marginTop: 20, ...fadeIn(visible, 180) }}>
              For consultants, agents, business owners, and commission earners.
            </p>
          </div>

          {/* Right — score card */}
          <div style={{ ...fadeIn(visible, 200) }}>
            <div style={{ backgroundColor: C.navy, borderRadius: 28, padding: m ? "28px 24px 24px" : "36px 36px 28px", position: "relative", overflow: "hidden" }}>
              <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 3, background: `linear-gradient(90deg, ${C.teal}, ${C.purple})` }} />
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
                <span style={{ fontSize: 10, color: "rgba(244,241,234,0.20)", letterSpacing: "0.04em" }}>Example outcome from full report</span>
              </div>
            </div>
          </div>
        </div>

        {/* Trust strip */}
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
          Methodology published. Scoring version-locked.{" "}
          <Link href="/methodology" style={{ color: C.teal, fontWeight: 600, textDecoration: "none" }}>Read how it works&nbsp;&rarr;</Link>
        </p>
      </div>
    </header>
  );
}

/* ================================================================ */
/* DESKTOP — SECTION 2: PROOF MOMENT                                  */
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

        <div style={{ display: m ? "block" : "grid", gridTemplateColumns: "1fr 1fr", gap: 24, maxWidth: 960, margin: "0 auto", ...fadeIn(visible, 120) }}>
          {/* Person A */}
          <div style={{ borderRadius: 20, padding: m ? 28 : 32, backgroundColor: C.white, boxShadow: cardShadow, marginBottom: m ? 20 : 0, position: "relative" as const, overflow: "hidden" }}>
            <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 4, backgroundColor: C.risk }} />
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 20 }}>
              <div style={{ fontSize: 16, fontWeight: 600, color: C.navy }}>$150K / year</div>
              <div style={{ fontSize: 14, fontWeight: 500, color: C.textMuted }}>Freelance Consultant</div>
            </div>
            <PressureBar segments={[{ pct: 80, color: C.risk, label: "At risk" }, { pct: 15, color: C.moderate, label: "" }, { pct: 5, color: C.teal, label: "" }]} height={16} />
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

          {/* Person B */}
          <div style={{ borderRadius: 20, padding: m ? 28 : 32, backgroundColor: C.white, boxShadow: cardShadow, position: "relative" as const, overflow: "hidden" }}>
            <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 4, backgroundColor: C.teal }} />
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 20 }}>
              <div style={{ fontSize: 16, fontWeight: 600, color: C.navy }}>$150K / year</div>
              <div style={{ fontSize: 14, fontWeight: 500, color: C.textMuted }}>Freelance Consultant</div>
            </div>
            <PressureBar segments={[{ pct: 25, color: C.risk, label: "At risk" }, { pct: 35, color: C.moderate, label: "Recurring" }, { pct: 40, color: C.teal, label: "Protected" }]} height={16} />
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

        <div style={{ textAlign: "center", marginTop: m ? 40 : 56, ...fadeIn(visible, 200) }}>
          <p style={{ fontSize: m ? 18 : 22, fontWeight: 600, color: C.navy, marginBottom: 8 }}>
            Income amount doesn&rsquo;t determine stability. Structure does.
          </p>
          <p style={{ fontSize: 16, color: C.textSecondary, marginBottom: 32 }}>See where yours stands.</p>
          <CtaButton m={m} variant="primary" label="See Where You Stand" />
        </div>
      </div>
    </section>
  );
}

/* ================================================================ */
/* DESKTOP — SECTION 3: CORE DEFINITION BAND                         */
/* ================================================================ */

function CoreDefinitionBand() {
  const { ref, visible } = useInView();
  const m = useMobile();
  const fadeIn = useFadeIn();

  return (
    <section ref={ref} style={{ backgroundColor: C.navy, paddingTop: m ? 60 : 88, paddingBottom: m ? 60 : 88, paddingLeft: 28, paddingRight: 28 }}>
      <div style={{ maxWidth: narrowW, margin: "0 auto", textAlign: "center", ...fadeIn(visible) }}>
        <p style={{ fontSize: m ? 22 : 36, fontWeight: 600, lineHeight: 1.35, letterSpacing: "-0.02em", color: C.sandText, margin: 0 }}>
          RunPayway™ measures how well your income holds up if something changes.
        </p>
      </div>
    </section>
  );
}

/* ================================================================ */
/* DESKTOP — SECTION 4: EXPOSURE REVELATION                          */
/* ================================================================ */

function ExposureSection() {
  const { ref, visible } = useInView();
  const m = useMobile();
  const t = useTablet();
  const fadeIn = useFadeIn();

  const bullets = [
    "One client carries most of your income",
    "Income fluctuates more than expected",
    "You rely on projected income that hasn\u2019t closed",
    "You\u2019re unsure what\u2019s actually secured vs. assumed",
  ];

  return (
    <section ref={ref} style={{ backgroundColor: C.panelFill, paddingTop: m ? 72 : 120, paddingBottom: m ? 72 : 120, paddingLeft: sectionPx(m, t), paddingRight: sectionPx(m, t) }}>
      <div style={{ maxWidth: 800, margin: "0 auto" }}>
        <div style={{ marginBottom: m ? 36 : 48, ...fadeIn(visible) }}>
          <h2 style={{ fontSize: m ? 28 : 44, fontWeight: 700, lineHeight: 1.08, letterSpacing: "-0.03em", color: C.navy, marginBottom: 20 }}>
            Most Income Looks Stable&mdash;Until It&rsquo;s Not
          </h2>
          <p style={{ fontSize: m ? 16 : 18, lineHeight: 1.65, color: C.textSecondary, maxWidth: 580 }}>
            The signs are usually there before the disruption. Most people just don&rsquo;t have a way to read them.
          </p>
        </div>

        <div style={{ marginBottom: m ? 36 : 48, ...fadeIn(visible, 80) }}>
          {bullets.map((b, i) => (
            <div key={i} style={{ display: "flex", gap: 16, alignItems: "flex-start", padding: m ? "14px 0" : "16px 0", borderBottom: `1px solid ${C.borderSoft}` }}>
              <div style={{ width: 6, height: 6, borderRadius: "50%", backgroundColor: C.risk, flexShrink: 0, marginTop: 9 }} />
              <span style={{ fontSize: m ? 16 : 18, color: C.textPrimary, lineHeight: 1.5 }}>{b}</span>
            </div>
          ))}
        </div>

        <div style={{ padding: m ? "24px 20px" : "32px 36px", borderRadius: 20, backgroundColor: C.navy, marginBottom: m ? 36 : 48, ...fadeIn(visible, 160) }}>
          <p style={{ fontSize: m ? 17 : 21, fontWeight: 600, color: C.sandText, lineHeight: 1.45, margin: 0 }}>
            Most income isn&rsquo;t unstable because it&rsquo;s low.{m ? " " : <br />}It&rsquo;s unstable because it&rsquo;s structurally exposed.
          </p>
        </div>

        <div style={{ ...fadeIn(visible, 200) }}>
          <CtaButton m={m} variant="primary" label="Get My Stability Class — Free →" />
        </div>
      </div>
    </section>
  );
}

/* ================================================================ */
/* DESKTOP — SECTION 5: DECISION CONTEXT                             */
/* ================================================================ */

function DecisionContextSection() {
  const { ref, visible } = useInView();
  const m = useMobile();
  const t = useTablet();
  const fadeIn = useFadeIn();

  const decisions = [
    { label: "BORROWING", question: "Can your income support it?", desc: "A mortgage, a lease, a line of credit. Every borrowing decision assumes income continuity. Your score shows whether that assumption is true." },
    { label: "SCALING", question: "Can your income absorb risk?", desc: "Hiring, expanding, investing in growth. Structure determines whether you can afford to be wrong when something doesn\u2019t go to plan." },
    { label: "INVESTING", question: "Can you rely on your income?", desc: "Deploying capital while relying on income requires knowing your floor. Your stability score is that number\u2014before you commit." },
  ];

  return (
    <section ref={ref} style={{ backgroundColor: C.white, paddingTop: m ? 72 : 120, paddingBottom: m ? 72 : 120, paddingLeft: sectionPx(m, t), paddingRight: sectionPx(m, t) }}>
      <div style={{ maxWidth: 960, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: m ? 40 : 56, ...fadeIn(visible) }}>
          <h2 style={{ fontSize: m ? 28 : 40, fontWeight: 600, lineHeight: 1.08, letterSpacing: "-0.028em", color: C.navy }}>
            Where This Matters Most
          </h2>
        </div>

        <div style={{ display: m ? "block" : "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 24, ...fadeIn(visible, 80) }}>
          {decisions.map((d, i) => (
            <div key={i} style={{ borderRadius: 20, padding: m ? "28px 24px" : "36px 32px", backgroundColor: C.panelFill, border: `1px solid ${C.borderSoft}`, marginBottom: m ? 16 : 0 }}>
              <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.12em", color: C.teal, marginBottom: 12 }}>{d.label}</div>
              <div style={{ fontSize: m ? 20 : 22, fontWeight: 700, color: C.navy, lineHeight: 1.25, marginBottom: 14 }}>
                {d.question}
              </div>
              <p style={{ fontSize: 15, color: C.textSecondary, lineHeight: 1.65, margin: 0 }}>{d.desc}</p>
            </div>
          ))}
        </div>

        <div style={{ textAlign: "center", marginTop: m ? 40 : 56, ...fadeIn(visible, 180) }}>
          <p style={{ fontSize: m ? 17 : 20, fontWeight: 600, color: C.navy, marginBottom: 28 }}>
            If income drives the decision, stability determines the outcome.
          </p>
          <CtaButton m={m} variant="primary" label="Get My Stability Class — Free →" />
        </div>
      </div>
    </section>
  );
}

/* ================================================================ */
/* DESKTOP — SECTION 6: HOW IT WORKS                                 */
/* ================================================================ */

function HowItWorksSection() {
  const { ref, visible } = useInView();
  const m = useMobile();
  const t = useTablet();
  const fadeIn = useFadeIn();

  const steps = [
    { num: "01", step: "Answer", desc: "Tell us about your income\u2014how many sources, how they pay, what\u2019s contracted. Takes under two minutes.", detail: "No bank accounts. No documents. Just what you know.", icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 1 1 3 3L7 19l-4 1 1-4Z"/></svg> },
    { num: "02", step: "See your Stability Class", desc: "RunPayway™ analyzes your income structure across 20 measurement engines and returns a stability class instantly.", detail: "Same inputs, same result. Every time.", icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg> },
    { num: "03", step: "Unlock your full score + plan", desc: "Your report shows your score from 0\u2013100, what\u2019s protected, what\u2019s at risk, and the specific moves to strengthen your position.", detail: "Personalized to your industry and income type.", icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8Z"/><path d="M14 2v6h6"/><path d="M16 13H8"/><path d="M16 17H8"/><path d="M10 9H8"/></svg> },
  ];

  return (
    <section ref={ref} style={{ backgroundColor: C.white, paddingTop: m ? 72 : 120, paddingBottom: m ? 72 : 120, paddingLeft: sectionPx(m, t), paddingRight: sectionPx(m, t) }}>
      <div style={{ maxWidth: 960, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: m ? 40 : 64, ...fadeIn(visible) }}>
          <h2 style={{ fontSize: m ? 28 : 40, fontWeight: 600, lineHeight: 1.08, letterSpacing: "-0.028em", color: C.navy, marginBottom: 16 }}>
            How It Works
          </h2>
          <p style={{ fontSize: 16, color: C.textMuted, fontWeight: 500 }}>Same inputs. Same result. Every time.</p>
        </div>

        <div style={{ display: "flex", flexDirection: "column" as const, gap: 0, ...fadeIn(visible, 100) }}>
          {steps.map((item, i) => (
            <div key={i} style={{ display: m ? "block" : "grid", gridTemplateColumns: "56px 1fr", gap: 24, padding: m ? "28px 0" : "36px 0", borderTop: i === 0 ? `1px solid rgba(14,26,43,0.06)` : "none", borderBottom: `1px solid rgba(14,26,43,0.06)` }}>
              <div style={{ display: "flex", flexDirection: m ? "row" as const : "column" as const, alignItems: m ? "center" : "center", gap: m ? 14 : 8, marginBottom: m ? 16 : 0 }}>
                <div style={{ width: 48, height: 48, borderRadius: 14, backgroundColor: C.navy, color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, fontWeight: 700, fontFamily: mono, flexShrink: 0 }}>
                  {item.num}
                </div>
                {m && <div style={{ fontSize: 20, fontWeight: 700, color: C.navy }}>{item.step}</div>}
              </div>
              <div>
                {!m && <div style={{ fontSize: 20, fontWeight: 700, color: C.navy, marginBottom: 8 }}>{item.step}</div>}
                <p style={{ fontSize: 16, color: C.textSecondary, lineHeight: 1.65, margin: "0 0 16px" }}>{item.desc}</p>
                <div style={{ display: "inline-flex", alignItems: "flex-start", gap: 8, padding: m ? "10px 14px" : "8px 16px", borderRadius: 10, backgroundColor: `${C.teal}06`, border: `1px solid ${C.teal}15` }}>
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
/* DESKTOP — SECTION 7: FREE VS FULL (CONVERSION CORE)               */
/* ================================================================ */

function FreeVsFull() {
  const { ref, visible } = useInView();
  const m = useMobile();
  const t = useTablet();
  const fadeIn = useFadeIn();

  return (
    <section ref={ref} style={{ backgroundColor: C.panelFill, paddingTop: m ? 72 : 120, paddingBottom: m ? 72 : 120, paddingLeft: sectionPx(m, t), paddingRight: sectionPx(m, t) }}>
      <div style={{ maxWidth: 960, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: m ? 40 : 56, ...fadeIn(visible) }}>
          <h2 style={{ fontSize: m ? 28 : 40, fontWeight: 600, lineHeight: 1.08, letterSpacing: "-0.028em", color: C.navy, marginBottom: 16 }}>
            Start With Your Stability Class
          </h2>
        </div>

        <div style={{ display: m ? "block" : "grid", gridTemplateColumns: "1fr 1fr", gap: 24, maxWidth: 760, margin: "0 auto", ...fadeIn(visible, 80) }}>
          {/* Free */}
          <div style={{ borderRadius: 20, padding: m ? "28px 24px" : "36px 32px", backgroundColor: C.white, border: `1px solid ${C.borderSoft}`, boxShadow: cardShadow, marginBottom: m ? 20 : 0 }}>
            <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.12em", color: C.teal, marginBottom: 12 }}>FREE</div>
            <div style={{ fontSize: 22, fontWeight: 700, color: C.navy, marginBottom: 20 }}>Stability Class</div>
            {["Stability Class (Limited / Developing / Established / High)", "Immediate clarity on where you stand", "Primary structural risk", "Distance to next class"].map((item, i) => (
              <div key={i} style={{ display: "flex", gap: 10, alignItems: "flex-start", marginBottom: 12 }}>
                <div style={{ width: 5, height: 5, borderRadius: "50%", backgroundColor: C.teal, flexShrink: 0, marginTop: 8 }} />
                <span style={{ fontSize: 14, color: C.textSecondary, lineHeight: 1.5 }}>{item}</span>
              </div>
            ))}
            <div style={{ marginTop: 24 }}>
              <CtaButton m={m} variant="primary" label="Get My Stability Class — Free" />
            </div>
          </div>

          {/* Full report */}
          <div style={{ borderRadius: 20, padding: m ? "28px 24px" : "36px 32px", backgroundColor: C.navy, border: "none", position: "relative" as const, overflow: "hidden" }}>
            <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 3, background: `linear-gradient(90deg, ${C.teal}, ${C.purple})` }} />
            <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.12em", color: C.teal, marginBottom: 12 }}>FULL REPORT — $69</div>
            <div style={{ fontSize: 22, fontWeight: 700, color: C.sandText, marginBottom: 20 }}>Income Stability Score</div>
            {["Score (0\u2013100)", "6-dimension structural breakdown", "Ranked constraints \u2014 what to fix first", "12-week action roadmap", "Negotiation scripts for your industry", "Scenario testing"].map((item, i) => (
              <div key={i} style={{ display: "flex", gap: 10, alignItems: "flex-start", marginBottom: 12 }}>
                <div style={{ width: 5, height: 5, borderRadius: "50%", backgroundColor: C.teal, flexShrink: 0, marginTop: 8 }} />
                <span style={{ fontSize: 14, color: C.sandMuted, lineHeight: 1.5 }}>{item}</span>
              </div>
            ))}
            <div style={{ marginTop: 24 }}>
              <a href="https://buy.stripe.com/9B66oz48EaYU2lc4IF2Nq05" style={{ display: "flex", alignItems: "center", justifyContent: "center", height: m ? 56 : 52, borderRadius: 14, backgroundColor: C.teal, color: C.white, fontSize: 15, fontWeight: 600, textDecoration: "none", boxShadow: "0 8px 24px rgba(31,109,122,0.28)" }}>
                Get Your Full Report &mdash; $69
              </a>
            </div>
          </div>
        </div>

        <div style={{ textAlign: "center", marginTop: m ? 36 : 48, ...fadeIn(visible, 200) }}>
          <p style={{ fontSize: m ? 15 : 17, color: C.textSecondary, lineHeight: 1.65, maxWidth: 560, margin: "0 auto" }}>
            Class shows where you stand.<br />Score shows what moves it.<br />The plan shows how to control it.
          </p>
        </div>
      </div>
    </section>
  );
}

/* ================================================================ */
/* DESKTOP — SECTION 8: TRUST BLOCK                                  */
/* ================================================================ */

function TrustBlock() {
  const { ref, visible } = useInView();
  const m = useMobile();
  const t = useTablet();
  const fadeIn = useFadeIn();

  const points = [
    { label: "Deterministic model", desc: "The same inputs always produce the same output. No variation, no interpretation." },
    { label: "No subjective scoring", desc: "RunPayway\u2122 doesn\u2019t estimate or infer. It measures structure directly from what you report." },
    { label: "Version-locked methodology", desc: "Every report is stamped with the model version used. Your score can always be verified against the published methodology." },
    { label: "Repeatable results", desc: "Retake the assessment with the same inputs tomorrow. You\u2019ll get the same score." },
  ];

  return (
    <section ref={ref} style={{ backgroundColor: C.white, paddingTop: m ? 72 : 120, paddingBottom: m ? 72 : 120, paddingLeft: sectionPx(m, t), paddingRight: sectionPx(m, t) }}>
      <div style={{ maxWidth: 800, margin: "0 auto" }}>
        <div style={{ marginBottom: m ? 40 : 56, ...fadeIn(visible) }}>
          <h2 style={{ fontSize: m ? 28 : 40, fontWeight: 600, lineHeight: 1.08, letterSpacing: "-0.028em", color: C.navy, marginBottom: 16 }}>
            Why This Can Be Trusted
          </h2>
          <p style={{ fontSize: m ? 16 : 18, color: C.textSecondary, lineHeight: 1.65, maxWidth: 560 }}>
            Used to evaluate income structure the way it&rsquo;s analyzed professionally&mdash;with a number, not a feeling.
          </p>
        </div>

        <div style={{ display: m ? "block" : "grid", gridTemplateColumns: "1fr 1fr", gap: 24, marginBottom: m ? 40 : 56, ...fadeIn(visible, 80) }}>
          {points.map((p, i) => (
            <div key={i} style={{ padding: m ? "20px 0" : "28px 32px", borderRadius: m ? 0 : 16, backgroundColor: m ? "transparent" : C.panelFill, borderBottom: m ? `1px solid ${C.borderSoft}` : "none" }}>
              <div style={{ fontSize: 16, fontWeight: 700, color: C.navy, marginBottom: 8 }}>{p.label}</div>
              <p style={{ fontSize: 15, color: C.textSecondary, lineHeight: 1.6, margin: 0 }}>{p.desc}</p>
            </div>
          ))}
        </div>

        <div style={{ padding: m ? "24px 20px" : "28px 36px", borderRadius: 16, backgroundColor: C.navy, ...fadeIn(visible, 160) }}>
          <p style={{ fontSize: m ? 17 : 20, fontWeight: 600, color: C.sandText, margin: 0, lineHeight: 1.4 }}>
            This is not a prediction. It&rsquo;s a measurement.
          </p>
        </div>
      </div>
    </section>
  );
}

/* ================================================================ */
/* DESKTOP — WHAT YOUR SCORE CHANGES (tabbed)                        */
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
          <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase" as const, color: C.teal, marginBottom: 16 }}>WHAT YOUR SCORE DOES</div>
          <h2 style={{ fontSize: m ? 28 : 40, fontWeight: 600, lineHeight: 1.08, letterSpacing: "-0.028em", color: C.navy, marginBottom: 32 }}>
            What changes when you know.
          </h2>
          <div style={{ display: "inline-flex", borderRadius: 12, backgroundColor: "rgba(14,26,43,0.06)", padding: 4, gap: 4 }}>
            {(["individual", "advisor"] as const).map((key) => (
              <button key={key} onClick={() => setTab(key)} style={{ height: 40, padding: "0 24px", borderRadius: 9, border: "none", fontSize: 14, fontWeight: 600, cursor: "pointer", transition: "all 200ms ease", backgroundColor: tab === key ? C.white : "transparent", color: tab === key ? C.navy : C.textMuted, boxShadow: tab === key ? "0 2px 8px rgba(14,26,43,0.10)" : "none" }}>
                {key === "individual" ? "For Individuals" : "For Advisors"}
              </button>
            ))}
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column" as const, ...fadeIn(visible, 100) }}>
          {items.map((item, i) => (
            <div key={`${tab}-${i}`} style={{ display: "flex", gap: m ? 20 : 28, alignItems: "flex-start", padding: m ? "24px 0" : "32px 0", borderTop: `1px solid rgba(14,26,43,0.06)`, borderBottom: i === items.length - 1 ? `1px solid rgba(14,26,43,0.06)` : "none" }}>
              <div style={{ width: m ? 32 : 40, height: m ? 32 : 40, borderRadius: 10, flexShrink: 0, backgroundColor: tab === "individual" ? C.navy : C.purple, display: "flex", alignItems: "center", justifyContent: "center", fontSize: m ? 13 : 15, fontWeight: 700, color: C.white, fontFamily: mono }}>
                {i + 1}
              </div>
              <div>
                <p style={{ fontSize: m ? 16 : 18, fontWeight: 700, color: C.navy, lineHeight: 1.3, margin: "0 0 6px", letterSpacing: "-0.01em" }}>{item.title}</p>
                <p style={{ fontSize: m ? 14 : 15, color: C.textSecondary, lineHeight: 1.6, margin: 0 }}>{item.body}</p>
              </div>
            </div>
          ))}
        </div>

        <div style={{ textAlign: "center", marginTop: m ? 40 : 56, ...fadeIn(visible, 200) }}>
          {tab === "individual" ? (
            <CtaButton m={m} variant="primary" label="Get My Stability Class — Free →" />
          ) : (
            <Link href="/advisor-portal" style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", height: m ? 56 : 60, padding: "0 32px", borderRadius: 16, backgroundColor: C.purple, color: C.white, fontSize: 16, fontWeight: 600, textDecoration: "none", boxShadow: "0 8px 24px rgba(75,63,174,0.20)", transition: "transform 200ms, box-shadow 200ms" }}
              onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = "0 12px 32px rgba(75,63,174,0.30)"; }}
              onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "0 8px 24px rgba(75,63,174,0.20)"; }}>
              See Advisor Plans &rarr;
            </Link>
          )}
        </div>
      </div>
    </section>
  );
}

/* ================================================================ */
/* DESKTOP — SECTION 9: AUTHORITY / SEO DEPTH                        */
/* ================================================================ */

function AuthoritySEOSection() {
  const { ref, visible } = useInView();
  const m = useMobile();
  const t = useTablet();
  const fadeIn = useFadeIn();

  const dimensions = [
    { name: "Recurring", def: "Income that continues without active re-earning. Retainers, subscriptions, renewals, and contracted recurring fees.", link: "/learn/what-is-recurring-income" },
    { name: "Concentration", def: "Dependence on one source, client, or channel. The higher the concentration, the more fragile the structure regardless of income level.", link: "/learn/income-concentration-risk" },
    { name: "Visibility", def: "Income that is already secured and contractually committed, not forecasted. Only visible income is structurally protected.", link: "/learn/income-visibility" },
    { name: "Variability", def: "Consistency of income over time. High variability means your income swings significantly month to month, increasing planning risk.", link: "/learn/income-variability" },
    { name: "Continuity", def: "Income that continues when you stop working actively. Passive, automated, or contracted income that runs without daily input.", link: "/learn/income-continuity" },
  ];

  return (
    <section ref={ref} style={{ backgroundColor: C.white, paddingTop: m ? 72 : 120, paddingBottom: m ? 72 : 120, paddingLeft: sectionPx(m, t), paddingRight: sectionPx(m, t) }}>
      <div style={{ maxWidth: 800, margin: "0 auto" }}>
        <div style={{ marginBottom: m ? 40 : 56, ...fadeIn(visible) }}>
          <h2 style={{ fontSize: m ? 28 : 40, fontWeight: 600, lineHeight: 1.08, letterSpacing: "-0.028em", color: C.navy, marginBottom: 16 }}>
            How Income Stability Is Measured
          </h2>
          <p style={{ fontSize: m ? 16 : 18, color: C.textSecondary, lineHeight: 1.65, maxWidth: 540 }}>
            RunPayway™ evaluates income structure across five dimensions. Together they produce a single score from 0 to 100.
          </p>
        </div>

        <div style={{ ...fadeIn(visible, 80) }}>
          {dimensions.map((d, i) => (
            <div key={i} style={{ display: m ? "block" : "grid", gridTemplateColumns: "160px 1fr", gap: 24, padding: m ? "20px 0" : "28px 0", borderBottom: `1px solid ${C.borderSoft}`, borderTop: i === 0 ? `1px solid ${C.borderSoft}` : "none" }}>
              <div>
                <Link href={d.link} style={{ fontSize: m ? 16 : 17, fontWeight: 700, color: C.navy, textDecoration: "none", borderBottom: `1px solid ${C.borderSoft}`, paddingBottom: 1 }}>
                  {d.name}
                </Link>
              </div>
              <p style={{ fontSize: 15, color: C.textSecondary, lineHeight: 1.65, margin: m ? "8px 0 0" : 0 }}>{d.def}</p>
            </div>
          ))}
        </div>

        <div style={{ marginTop: m ? 32 : 40, ...fadeIn(visible, 160) }}>
          <Link href="/methodology" style={{ fontSize: 15, fontWeight: 600, color: C.teal, textDecoration: "none" }}>
            Read the full methodology &rarr;
          </Link>
        </div>
      </div>
    </section>
  );
}

/* ================================================================ */
/* DESKTOP — SECTION 10: INDUSTRY PROFILES                           */
/* ================================================================ */

function IndustryProfiles() {
  const { ref, visible } = useInView();
  const m = useMobile();
  const t = useTablet();
  const fadeIn = useFadeIn();
  const [selected, setSelected] = useState<typeof INDUSTRIES[0] | null>(null);
  const active = selected;

  return (
    <section ref={ref} style={{ backgroundColor: C.panelFill, paddingTop: m ? 72 : 120, paddingBottom: m ? 72 : 120, paddingLeft: sectionPx(m, t), paddingRight: sectionPx(m, t) }}>
      <div style={{ maxWidth: 960, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: m ? 36 : 56, ...fadeIn(visible) }}>
          <h2 style={{ fontSize: m ? 28 : 40, fontWeight: 600, lineHeight: 1.08, letterSpacing: "-0.028em", color: C.navy, marginBottom: 16 }}>
            Built for Income That Isn&rsquo;t Fixed
          </h2>
          <p style={{ fontSize: m ? 17 : 20, fontWeight: 400, lineHeight: 1.6, color: C.textSecondary, maxWidth: 580, margin: "0 auto 12px" }}>
            Most financial advice assumes your income is stable. RunPayway™ measures whether it actually is.
          </p>
          <p style={{ fontSize: m ? 15 : 17, fontWeight: 500, lineHeight: 1.5, color: C.textMuted, maxWidth: 480, margin: "0 auto" }}>
            Select your industry to see what typically creates the most exposure.
          </p>
        </div>

        <div style={{ display: "flex", flexWrap: "wrap" as const, justifyContent: "center", gap: m ? 8 : 10, maxWidth: 840, margin: "0 auto", marginBottom: active ? (m ? 32 : 40) : 0, ...fadeIn(visible, 80) }}>
          {INDUSTRIES.map((ind) => {
            const isActive = active?.key === ind.key;
            return (
              <button key={ind.key} onClick={() => setSelected(isActive ? null : ind)} style={{ display: "inline-flex", alignItems: "center", gap: 8, height: m ? 40 : 44, padding: m ? "0 14px" : "0 20px", borderRadius: 100, backgroundColor: isActive ? C.navy : "transparent", border: isActive ? "1.5px solid transparent" : `1.5px solid rgba(14,26,43,0.10)`, fontSize: m ? 13 : 14, fontWeight: isActive ? 600 : 500, color: isActive ? "#fff" : C.textSecondary, cursor: "pointer", transition: "all 200ms cubic-bezier(0.22, 1, 0.36, 1)" }}
                onMouseEnter={e => { if (!isActive) { e.currentTarget.style.backgroundColor = "rgba(14,26,43,0.04)"; e.currentTarget.style.borderColor = "rgba(14,26,43,0.18)"; } }}
                onMouseLeave={e => { if (!isActive) { e.currentTarget.style.backgroundColor = "transparent"; e.currentTarget.style.borderColor = "rgba(14,26,43,0.10)"; } }}>
                {ind.name}
              </button>
            );
          })}
        </div>

        {active && (
          <div style={{ maxWidth: 680, margin: "0 auto", borderRadius: 24, backgroundColor: C.navy, boxShadow: "0 16px 56px rgba(14,26,43,0.18), 0 4px 16px rgba(14,26,43,0.08)", position: "relative" as const, overflow: "hidden" }}>
            <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 3, background: `linear-gradient(90deg, ${C.teal}, ${C.purple})` }} />
            <div style={{ padding: m ? "32px 24px" : "44px 48px" }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 24 }}>
                <div>
                  <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.10em", color: C.teal, marginBottom: 8 }}>INDUSTRY PROFILE</div>
                  <div style={{ fontSize: m ? 22 : 28, fontWeight: 700, color: C.sandText, letterSpacing: "-0.02em" }}>{active.name}</div>
                </div>
                <div style={{ padding: "6px 14px", borderRadius: 100, backgroundColor: "rgba(31,109,122,0.12)", flexShrink: 0 }}>
                  <span style={{ fontSize: 12, fontWeight: 600, color: C.teal }}>Calibrated</span>
                </div>
              </div>
              <div style={{ padding: m ? "18px 20px" : "22px 28px", borderRadius: 16, backgroundColor: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.06)", marginBottom: 20 }}>
                <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.10em", color: "rgba(244,241,234,0.35)", marginBottom: 8 }}>THE STRUCTURAL RISK</div>
                <div style={{ fontSize: m ? 17 : 20, fontWeight: 600, color: C.sandText, lineHeight: 1.35 }}>{active.constraint}</div>
              </div>
              <p style={{ fontSize: m ? 15 : 16, color: "rgba(244,241,234,0.55)", lineHeight: 1.7, margin: "0 0 20px" }}>{active.desc}</p>
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
              <Link href={`/industries/${active.slug}`} style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", height: 52, padding: "0 32px", borderRadius: 14, width: m ? "100%" : "auto", backgroundColor: C.teal, color: "#fff", fontSize: 15, fontWeight: 600, textDecoration: "none", boxShadow: "0 8px 24px rgba(31,109,122,0.25)", transition: "transform 200ms, box-shadow 200ms" }}
                onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = "0 12px 32px rgba(31,109,122,0.35)"; }}
                onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "0 8px 24px rgba(31,109,122,0.25)"; }}>
                See your {active.name.split(" /")[0].toLowerCase()} score profile &rarr;
              </Link>
              <Link href="/begin" style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", height: 40, padding: "0 20px", borderRadius: 10, width: m ? "100%" : "auto", backgroundColor: "transparent", color: "rgba(244,241,234,0.50)", fontSize: 13, fontWeight: 500, textDecoration: "none", marginTop: 10, transition: "color 180ms" }}
                onMouseEnter={e => { e.currentTarget.style.color = "rgba(244,241,234,0.80)"; }}
                onMouseLeave={e => { e.currentTarget.style.color = "rgba(244,241,234,0.50)"; }}>
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
/* DESKTOP — SECTION 11: FAQ                                         */
/* ================================================================ */

function FaqSection() {
  const { ref, visible } = useInView();
  const m = useMobile();
  const t = useTablet();
  const fadeIn = useFadeIn();
  const [open, setOpen] = useState<number | null>(null);

  const faqs = [
    { q: "What is income stability?", a: "Income stability measures how reliably your income continues and holds its level when conditions change. It\u2019s determined by your income structure\u2014how many sources you have, what\u2019s contractually secured, how much recurs automatically, and how concentrated your earnings are\u2014not by how much you earn." },
    { q: "How is income stability different from how much I earn?", a: "Two people earning $150K can have completely different stability profiles. One might depend on a single client with no contracts. The other might have five clients, 40% recurring, and three months locked. Income amount describes what you make. Income stability describes how reliable it is." },
    { q: "What is a Stability Class?", a: "A Stability Class is a category that describes the overall structure of your income: Limited, Developing, Established, or High. It\u2019s your free result\u2014immediate context on where you stand relative to structural norms. The full report gives you the numeric score and what specifically drives it." },
    { q: "What is the Income Stability Score?", a: "The Income Stability Score is a number from 0 to 100 that reflects how well your income would hold up under disruption. It\u2019s calculated across five structural dimensions\u2014recurring income, concentration, visibility, variability, and continuity\u2014and is deterministic: same inputs always produce the same score." },
    { q: "Who is RunPayway™ for?", a: "RunPayway™ is built for professionals whose income isn\u2019t fixed\u2014consultants, freelancers, real estate agents, commission earners, business owners, and anyone whose income varies, depends on clients, or isn\u2019t fully secured. It\u2019s also used by financial advisors who want to assess client income structure." },
    { q: "How long does the assessment take?", a: "Under two minutes. You answer simple questions about your income sources, how they\u2019re structured, and what\u2019s contractually secured. No documents required, no financial accounts connected." },
    { q: "What does the full report include?", a: "Your full report includes your Income Stability Score (0\u2013100), a breakdown across all five dimensions, ranked constraints with the highest-impact change identified, a 12-week action roadmap, negotiation scripts for your industry, and lifetime dashboard access." },
    { q: "How is this different from a credit score?", a: "A credit score reflects your borrowing history and repayment behavior. RunPayway\u2122 measures the structural reliability of your income going forward\u2014how it\u2019s built, how concentrated it is, what\u2019s secured vs. assumed. These are different questions. A high credit score doesn\u2019t mean your income is structurally stable." },
    { q: "Is my data private?", a: "Yes. RunPayway™ does not connect to your bank accounts, access your financial records, or share your data with third parties. Your responses are encrypted and used only to generate your score." },
    { q: "What industries does this work for?", a: "RunPayway™ is calibrated for 19 industries including consulting, real estate, sales and brokerage, freelance and creative, legal services, insurance, technology, finance, healthcare, construction, media, retail, and more. The scoring model accounts for structural norms within each industry." },
    { q: "Can I improve my score?", a: "Yes. Your score reflects structure\u2014and structure can be changed. Converting a client to a retainer, adding a contracted source, reducing concentration, or increasing visibility all affect your score. The full report shows which specific changes have the highest impact for your situation." },
    { q: "What is income concentration risk?", a: "Income concentration risk is how much of your income depends on a single source, client, or channel. If one client generates 70% of your revenue, losing them is a structural event\u2014not just a setback. High concentration is one of the most common causes of income instability regardless of total earnings." },
    { q: "How often should I reassess?", a: "Whenever your income structure changes. Onboarding a major new client, losing a contract, transitioning to retainer-based work, or making a significant financial decision are all trigger points. RunPayway™ is designed to be used at decision points, not just once." },
    { q: "What is the methodology?", a: "The RunPayway™ methodology evaluates income structure across five dimensions: recurring income, concentration, visibility, variability, and continuity. The model is deterministic, version-locked, and published\u2014every score is traceable to the methodology that generated it. Read the full methodology at runpayway.com/methodology." },
    { q: "Is there a free version?", a: "Yes. The Stability Class assessment is free. It gives you your class (Limited, Developing, Established, or High), your primary structural risk, and your distance to the next class. The full report\u2014including your numeric score, breakdown, and 12-week plan\u2014is $69." },
  ];

  return (
    <section ref={ref} style={{ backgroundColor: C.white, paddingTop: m ? 72 : 120, paddingBottom: m ? 72 : 120, paddingLeft: sectionPx(m, t), paddingRight: sectionPx(m, t) }}>
      <div style={{ maxWidth: 720, margin: "0 auto" }}>
        <div style={{ marginBottom: m ? 40 : 56, ...fadeIn(visible) }}>
          <h2 style={{ fontSize: m ? 28 : 40, fontWeight: 600, lineHeight: 1.08, letterSpacing: "-0.028em", color: C.navy }}>
            Common Questions
          </h2>
        </div>

        <div style={{ ...fadeIn(visible, 80) }}>
          {faqs.map((faq, i) => (
            <div key={i} style={{ borderBottom: `1px solid ${C.borderSoft}`, borderTop: i === 0 ? `1px solid ${C.borderSoft}` : "none" }}>
              <button onClick={() => setOpen(open === i ? null : i)} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", width: "100%", padding: m ? "18px 0" : "22px 0", background: "none", border: "none", cursor: "pointer", textAlign: "left" as const, gap: 16 }}>
                <span style={{ fontSize: m ? 15 : 16, fontWeight: 600, color: C.navy, lineHeight: 1.4 }}>{faq.q}</span>
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none" style={{ flexShrink: 0, transform: open === i ? "rotate(180deg)" : "rotate(0deg)", transition: "transform 200ms", color: C.textMuted }}>
                  <path d="M5 7.5L10 12.5L15 7.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
              {open === i && (
                <div style={{ paddingBottom: m ? 18 : 22 }}>
                  <p style={{ fontSize: 15, color: C.textSecondary, lineHeight: 1.7, margin: 0 }}>{faq.a}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ================================================================ */
/* DESKTOP — STRUCTURAL INCOME BRIEF (email capture)                 */
/* ================================================================ */

function StructuralIncomeBrief() {
  const { ref, visible } = useInView();
  const m = useMobile();
  const t = useTablet();
  const fadeIn = useFadeIn();

  return (
    <section ref={ref} style={{ backgroundColor: C.navy, paddingTop: m ? 72 : 120, paddingBottom: m ? 72 : 120, paddingLeft: sectionPx(m, t), paddingRight: sectionPx(m, t), position: "relative" as const, overflow: "hidden" }}>
      <div className="navy-grain" />
      <div style={{ maxWidth: explanatoryW, margin: "0 auto", textAlign: "center", position: "relative", zIndex: 1 }}>
        <div style={{ fontSize: m ? 13 : 14, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase" as const, color: C.teal, marginBottom: 16, ...fadeIn(visible) }}>THE STRUCTURAL INCOME BRIEF</div>
        <h2 style={{ fontSize: m ? 28 : 40, fontWeight: 600, lineHeight: 1.12, letterSpacing: "-0.028em", color: C.sandText, marginBottom: 16, ...fadeIn(visible, 60) }}>
          Know what&rsquo;s shifting before{m ? " " : <br />}it hits your income.
        </h2>
        <p style={{ fontSize: m ? 16 : 18, fontWeight: 400, lineHeight: 1.6, color: C.sandMuted, marginBottom: m ? 28 : 36, maxWidth: 520, marginLeft: "auto", marginRight: "auto", ...fadeIn(visible, 120) }}>
          One email per month. Industry-specific income patterns, structural risks most people miss, and the data behind&nbsp;them.
        </p>
        <div style={{ maxWidth: 480, margin: "0 auto", marginBottom: m ? 28 : 36, padding: m ? "16px 18px" : "18px 24px", borderRadius: 14, backgroundColor: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)", textAlign: "left" as const, ...fadeIn(visible, 150) }}>
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
/* DESKTOP — SECTION 12: INTERNAL LINK HUB                           */
/* ================================================================ */

function InternalLinkHub() {
  const { ref, visible } = useInView();
  const m = useMobile();
  const t = useTablet();
  const fadeIn = useFadeIn();

  const links = [
    { label: "What is income stability?", href: "/learn/what-is-income-stability" },
    { label: "Income structure explained", href: "/learn/income-structure-explained" },
    { label: "Recurring vs. variable income", href: "/learn/recurring-vs-variable-income" },
    { label: "Income concentration risk", href: "/learn/income-concentration-risk" },
    { label: "How to improve income stability", href: "/learn/how-to-improve-income-stability" },
    { label: "Income stability vs. credit score", href: "/learn/income-stability-vs-credit-score" },
    { label: "What makes income unstable?", href: "/learn/what-makes-income-unstable" },
    { label: "Income stability for freelancers", href: "/learn/income-stability-freelancers" },
    { label: "How lenders evaluate income", href: "/learn/how-lenders-evaluate-income" },
    { label: "Income stability before buying a home", href: "/learn/income-stability-before-buying-home" },
  ];

  return (
    <section ref={ref} style={{ backgroundColor: C.sand, paddingTop: m ? 72 : 96, paddingBottom: m ? 72 : 96, paddingLeft: sectionPx(m, t), paddingRight: sectionPx(m, t) }}>
      <div style={{ maxWidth: 800, margin: "0 auto" }}>
        <div style={{ marginBottom: m ? 32 : 44, ...fadeIn(visible) }}>
          <h2 style={{ fontSize: m ? 22 : 28, fontWeight: 600, color: C.navy, letterSpacing: "-0.02em" }}>
            Explore Income Stability
          </h2>
        </div>
        <div style={{ display: m ? "block" : "grid", gridTemplateColumns: "1fr 1fr", gap: m ? 0 : 4, ...fadeIn(visible, 60) }}>
          {links.map((link, i) => (
            <Link key={i} href={link.href} style={{ display: "flex", alignItems: "center", gap: 10, padding: m ? "14px 0" : "14px 16px", borderRadius: m ? 0 : 10, textDecoration: "none", borderBottom: m ? `1px solid ${C.borderSoft}` : "none", color: C.navy, fontSize: 15, fontWeight: 500, transition: "background 150ms" }}
              onMouseEnter={e => { if (!m) e.currentTarget.style.backgroundColor = "rgba(14,26,43,0.04)"; }}
              onMouseLeave={e => { if (!m) e.currentTarget.style.backgroundColor = "transparent"; }}>
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none" style={{ flexShrink: 0, color: C.teal }}>
                <path d="M2 6h8M7 3l3 3-3 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              {link.label}
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ================================================================ */
/* DESKTOP — SECTION 13: BREATHING MOMENT                            */
/* ================================================================ */

function BreathingMoment() {
  const { ref, visible } = useInView();
  const m = useMobile();
  const fadeIn = useFadeIn();

  return (
    <section ref={ref} style={{ backgroundColor: C.white, paddingTop: m ? 80 : 120, paddingBottom: m ? 80 : 120, paddingLeft: 28, paddingRight: 28 }}>
      <div style={{ maxWidth: explanatoryW, margin: "0 auto", textAlign: "center", ...fadeIn(visible) }}>
        <h2 style={{ fontSize: m ? 28 : 48, fontWeight: 700, lineHeight: 1.12, letterSpacing: "-0.032em", color: C.navy, margin: 0 }}>
          Your income has a structure.<br />
          <span style={{ color: C.textMuted, fontWeight: 400 }}>Most people never see it.</span>
        </h2>
      </div>
    </section>
  );
}

/* ================================================================ */
/* DESKTOP — FINAL CTA                                               */
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
          Know Where Your Income Stands Before You Rely On It
        </h2>
        <div style={{ display: "flex", flexDirection: "column" as const, alignItems: "center", ...fadeIn(visible, 160) }}>
          <CtaButton m={m} variant="light" label="Get My Stability Class — Free →" />
          <p style={{ fontSize: 14, fontWeight: 500, lineHeight: 1.45, color: C.sandLight, marginTop: 16, textAlign: "center" }}>
            Know in 2 minutes what most people never measure.
          </p>
        </div>
      </div>
    </section>
  );
}

/* ================================================================ */
/* MOBILE — SCREEN 1: HERO                                           */
/* ================================================================ */

function MobileHero() {
  return (
    <header style={{ backgroundColor: C.sand, padding: "80px 28px 64px" }}>
      <p style={{ fontSize: 13, fontWeight: 600, letterSpacing: "0.04em", color: C.teal, marginBottom: 16 }}>
        Income stability isn&rsquo;t measured. Until now.
      </p>
      <h1 style={{ fontSize: 34, fontWeight: 700, lineHeight: 1.06, letterSpacing: "-0.032em", color: C.navy, marginBottom: 16 }}>
        Is Your Income Stable Enough for Your Next Move?
      </h1>
      <p style={{ fontSize: 17, color: C.textSecondary, lineHeight: 1.55, marginBottom: 28 }}>
        Find out in 2 minutes&mdash;before you take on risk.
      </p>

      {/* Score preview */}
      <div style={{ backgroundColor: C.navy, borderRadius: 20, padding: "24px 20px", marginBottom: 28, position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 3, background: `linear-gradient(90deg, ${C.teal}, ${C.purple})` }} />
        <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 16 }}>
          <div style={{ position: "relative", width: 56, height: 56, flexShrink: 0 }}>
            <ScoreRing score={72} size={56} stroke={5} color="#2B5EA7" trackColor="rgba(255,255,255,0.06)" />
            <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <span style={{ fontSize: 18, fontWeight: 300, fontFamily: mono, color: C.sandText }}>72</span>
            </div>
          </div>
          <div>
            <div style={{ fontSize: 13, fontWeight: 600, fontFamily: mono, color: C.sandText, marginBottom: 4 }}>72 / 100</div>
            <div style={{ fontSize: 12, fontWeight: 600, color: "#2B5EA7" }}>Established Stability</div>
          </div>
        </div>
        <div style={{ display: "flex", height: 6, borderRadius: 999, overflow: "hidden" }}>
          <div style={{ width: "28%", backgroundColor: C.teal }} />
          <div style={{ width: "40%", backgroundColor: C.moderate }} />
          <div style={{ width: "32%", backgroundColor: C.risk }} />
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", marginTop: 6 }}>
          <span style={{ fontSize: 10, color: C.teal, fontWeight: 600 }}>Protected</span>
          <span style={{ fontSize: 10, color: C.moderate, fontWeight: 600 }}>Recurring</span>
          <span style={{ fontSize: 10, color: C.risk, fontWeight: 600 }}>At risk</span>
        </div>
        <div style={{ textAlign: "center", marginTop: 12 }}>
          <span style={{ fontSize: 10, color: "rgba(244,241,234,0.20)" }}>Example outcome</span>
        </div>
      </div>

      <MCta label="Get My Stability Class — Free →" />
      <p style={{ fontSize: 13, color: C.textMuted, textAlign: "center", marginTop: 12 }}>
        No documents &middot; Private &middot; Instant result
      </p>
    </header>
  );
}

/* ================================================================ */
/* MOBILE — SCREEN 2: INSTANT BELIEF                                 */
/* ================================================================ */

function MobileInstantBelief() {
  return (
    <section style={{ backgroundColor: C.white, padding: "64px 28px" }}>
      <h2 style={{ fontSize: 26, fontWeight: 700, lineHeight: 1.1, letterSpacing: "-0.025em", color: C.navy, marginBottom: 28 }}>
        Same income.<br />Different stability.
      </h2>

      <div style={{ display: "flex", flexDirection: "column" as const, gap: 16, marginBottom: 28 }}>
        {/* Person A */}
        <div style={{ borderRadius: 16, padding: "20px 20px 18px", backgroundColor: C.white, border: `1.5px solid ${C.borderSoft}`, position: "relative" as const, overflow: "hidden" }}>
          <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 3, backgroundColor: C.risk }} />
          <div style={{ fontSize: 15, fontWeight: 600, color: C.navy, marginBottom: 6 }}>$150K &middot; 1 client &middot; no contracts</div>
          <div style={{ display: "flex", height: 6, borderRadius: 999, overflow: "hidden", marginBottom: 12 }}>
            <div style={{ width: "80%", backgroundColor: C.risk }} />
            <div style={{ width: "20%", backgroundColor: C.moderate }} />
          </div>
          <div style={{ fontSize: 22, fontWeight: 700, fontFamily: mono, color: C.risk }}>31</div>
          <div style={{ fontSize: 13, color: C.risk, fontWeight: 600 }}>Limited Stability</div>
        </div>

        {/* Person B */}
        <div style={{ borderRadius: 16, padding: "20px 20px 18px", backgroundColor: C.white, border: `1.5px solid ${C.borderSoft}`, position: "relative" as const, overflow: "hidden" }}>
          <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 3, backgroundColor: C.teal }} />
          <div style={{ fontSize: 15, fontWeight: 600, color: C.navy, marginBottom: 6 }}>$150K &middot; 5 clients &middot; 40% recurring</div>
          <div style={{ display: "flex", height: 6, borderRadius: 999, overflow: "hidden", marginBottom: 12 }}>
            <div style={{ width: "40%", backgroundColor: C.teal }} />
            <div style={{ width: "35%", backgroundColor: C.moderate }} />
            <div style={{ width: "25%", backgroundColor: C.risk }} />
          </div>
          <div style={{ fontSize: 22, fontWeight: 700, fontFamily: mono, color: C.teal }}>74</div>
          <div style={{ fontSize: 13, color: C.teal, fontWeight: 600 }}>Established Stability</div>
        </div>
      </div>

      <p style={{ fontSize: 16, fontWeight: 600, color: C.navy, marginBottom: 24 }}>
        Income doesn&rsquo;t determine stability. Structure does.
      </p>
      <MCta label="Get My Stability Class — Free →" />
    </section>
  );
}

/* ================================================================ */
/* MOBILE — SCREEN 3: CORE IDEA                                      */
/* ================================================================ */

function MobileCoreIdea() {
  return (
    <section style={{ backgroundColor: C.navy, padding: "64px 28px" }}>
      <p style={{ fontSize: 22, fontWeight: 600, lineHeight: 1.4, letterSpacing: "-0.02em", color: C.sandText, margin: 0, textAlign: "center" }}>
        RunPayway™ measures how well your income holds up if something changes.
      </p>
    </section>
  );
}

/* ================================================================ */
/* MOBILE — SCREEN 4: EXPOSURE                                       */
/* ================================================================ */

function MobileExposure() {
  return (
    <section style={{ backgroundColor: C.panelFill, padding: "64px 28px" }}>
      <h2 style={{ fontSize: 26, fontWeight: 700, lineHeight: 1.1, letterSpacing: "-0.025em", color: C.navy, marginBottom: 24 }}>
        Most income looks stable&mdash;until it&rsquo;s not.
      </h2>

      {[
        "One client carries your income",
        "Income fluctuates more than expected",
        "You rely on projected deals",
        "You\u2019re unsure what\u2019s actually secured",
      ].map((b, i) => (
        <div key={i} style={{ display: "flex", gap: 12, alignItems: "flex-start", padding: "12px 0", borderBottom: `1px solid ${C.borderSoft}` }}>
          <div style={{ width: 5, height: 5, borderRadius: "50%", backgroundColor: C.risk, flexShrink: 0, marginTop: 8 }} />
          <span style={{ fontSize: 16, color: C.textPrimary, lineHeight: 1.5 }}>{b}</span>
        </div>
      ))}

      <p style={{ fontSize: 16, fontWeight: 600, color: C.navy, lineHeight: 1.5, margin: "24px 0" }}>
        Most income isn&rsquo;t unstable because it&rsquo;s low. It&rsquo;s unstable because it&rsquo;s structurally exposed.
      </p>
      <MCta label="Get My Stability Class — Free →" />
    </section>
  );
}

/* ================================================================ */
/* MOBILE — SCREEN 5: DECISION TRIGGER                               */
/* ================================================================ */

function MobileDecisionTrigger() {
  return (
    <section style={{ backgroundColor: C.white, padding: "64px 28px" }}>
      <p style={{ fontSize: 13, fontWeight: 700, letterSpacing: "0.08em", color: C.teal, marginBottom: 20 }}>BEFORE YOU</p>

      {["Take on a mortgage", "Scale your business", "Make an investment"].map((item, i) => (
        <div key={i} style={{ fontSize: 17, fontWeight: 600, color: C.navy, padding: "14px 0", borderBottom: `1px solid ${C.borderSoft}` }}>
          {item}
        </div>
      ))}

      <p style={{ fontSize: 22, fontWeight: 700, color: C.navy, lineHeight: 1.3, margin: "28px 0 28px" }}>
        Ask: Will my income hold up?
      </p>
      <MCta label="Get My Stability Class — Free →" />
    </section>
  );
}

/* ================================================================ */
/* MOBILE — SCREEN 6: HOW IT WORKS                                   */
/* ================================================================ */

function MobileHowItWorks() {
  return (
    <section style={{ backgroundColor: C.sand, padding: "64px 28px" }}>
      <h2 style={{ fontSize: 26, fontWeight: 700, letterSpacing: "-0.025em", color: C.navy, marginBottom: 28 }}>
        How it works
      </h2>

      {[
        { n: "1", label: "Answer simple questions about your income" },
        { n: "2", label: "See your Stability Class instantly" },
        { n: "3", label: "Unlock your full score, breakdown, and plan" },
      ].map((s, i) => (
        <div key={i} style={{ display: "flex", gap: 16, alignItems: "flex-start", padding: "16px 0", borderBottom: `1px solid ${C.borderSoft}` }}>
          <div style={{ width: 36, height: 36, borderRadius: 10, backgroundColor: C.navy, color: C.white, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, fontWeight: 700, fontFamily: mono, flexShrink: 0 }}>
            {s.n}
          </div>
          <span style={{ fontSize: 16, color: C.textPrimary, lineHeight: 1.5, paddingTop: 6 }}>{s.label}</span>
        </div>
      ))}

      <p style={{ fontSize: 14, fontWeight: 600, color: C.textMuted, marginTop: 20 }}>
        Same inputs. Same result. Every time.
      </p>
    </section>
  );
}

/* ================================================================ */
/* MOBILE — SCREEN 7: VALUE (FREE VS FULL)                           */
/* ================================================================ */

function MobileValue() {
  return (
    <section style={{ backgroundColor: C.white, padding: "64px 28px" }}>
      <h2 style={{ fontSize: 26, fontWeight: 700, letterSpacing: "-0.025em", color: C.navy, marginBottom: 28 }}>
        Start with your Stability Class
      </h2>

      <div style={{ borderRadius: 16, padding: "20px", backgroundColor: C.panelFill, marginBottom: 16 }}>
        <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.10em", color: C.teal, marginBottom: 10 }}>FREE</div>
        <div style={{ fontSize: 16, fontWeight: 700, color: C.navy, marginBottom: 8 }}>Stability Class</div>
        {["Stability Class", "Primary structural risk", "Instant clarity"].map((i, k) => (
          <div key={k} style={{ fontSize: 14, color: C.textSecondary, paddingLeft: 12, lineHeight: 1.8 }}>· {i}</div>
        ))}
      </div>

      <div style={{ borderRadius: 16, padding: "20px", backgroundColor: C.navy, marginBottom: 24, position: "relative" as const, overflow: "hidden" }}>
        <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 2, background: `linear-gradient(90deg, ${C.teal}, ${C.purple})` }} />
        <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.10em", color: C.teal, marginBottom: 10 }}>FULL REPORT — $69</div>
        <div style={{ fontSize: 16, fontWeight: 700, color: C.sandText, marginBottom: 8 }}>Income Stability Score</div>
        {["Score (0\u2013100)", "6-dimension breakdown", "What to fix first", "12-week plan", "Scripts for your industry"].map((i, k) => (
          <div key={k} style={{ fontSize: 14, color: C.sandMuted, paddingLeft: 12, lineHeight: 1.8 }}>· {i}</div>
        ))}
      </div>

      <p style={{ fontSize: 15, fontWeight: 600, color: C.navy, marginBottom: 24, lineHeight: 1.6 }}>
        Class shows where you stand.<br />Score shows what moves it.
      </p>
      <MCta label="Get My Stability Class — Free →" />
    </section>
  );
}

/* ================================================================ */
/* MOBILE — SCREEN 8: TRUST                                          */
/* ================================================================ */

function MobileTrust() {
  return (
    <section style={{ backgroundColor: C.panelFill, padding: "64px 28px" }}>
      <h2 style={{ fontSize: 26, fontWeight: 700, letterSpacing: "-0.025em", color: C.navy, marginBottom: 28 }}>
        Why this works
      </h2>

      {[
        "Deterministic model",
        "No guessing or interpretation",
        "Version-locked methodology",
        "Repeatable results",
      ].map((item, i) => (
        <div key={i} style={{ display: "flex", gap: 12, alignItems: "center", padding: "14px 0", borderBottom: `1px solid ${C.borderSoft}` }}>
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <circle cx="8" cy="8" r="7" fill="rgba(31,109,122,0.10)" />
            <path d="M5 8.5L7 10.5L11 6.5" stroke={C.teal} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <span style={{ fontSize: 16, color: C.textPrimary, fontWeight: 500 }}>{item}</span>
        </div>
      ))}

      <div style={{ padding: "20px", borderRadius: 14, backgroundColor: C.navy, marginTop: 28 }}>
        <p style={{ fontSize: 16, fontWeight: 600, color: C.sandText, margin: 0, lineHeight: 1.45 }}>
          This is a measurement.<br />Not an estimate.
        </p>
      </div>
    </section>
  );
}

/* ================================================================ */
/* MOBILE — SCREEN 9: FINAL CLOSE                                    */
/* ================================================================ */

function MobileFinalClose() {
  return (
    <section style={{ backgroundColor: C.navy, padding: "80px 28px", position: "relative" as const, overflow: "hidden" }}>
      <div className="navy-grain" />
      <div style={{ position: "relative", zIndex: 1 }}>
        <h2 style={{ fontSize: 30, fontWeight: 700, lineHeight: 1.1, letterSpacing: "-0.028em", color: C.sandText, marginBottom: 32 }}>
          Know where your income stands before you rely on it.
        </h2>
        <MCta variant="light" label="Get My Stability Class — Free →" />
        <p style={{ fontSize: 13, color: C.sandLight, textAlign: "center", marginTop: 16 }}>
          Know in 2 minutes what most people never measure.
        </p>
      </div>
    </section>
  );
}

/* ================================================================ */
/* STRUCTURED DATA                                                    */
/* ================================================================ */

const PRODUCT_SCHEMA = {
  "@context": "https://schema.org", "@type": "Product",
  name: "RunPayway\u2122 Income Stability Score\u2122",
  description: "A structural income measurement system that evaluates how income is built \u2014 not how much you make.",
  brand: { "@type": "Brand", name: "RunPayway\u2122" },
  offers: [
    { "@type": "Offer", price: "0", priceCurrency: "USD", name: "Stability Class", description: "Stability class, primary structural risk, and distance to next class. Free." },
    { "@type": "Offer", price: "69", priceCurrency: "USD", name: "RunPayway\u2122 Full Report", description: "Income Stability Score, 6-dimension breakdown, 12-week plan, and negotiation scripts." },
  ],
};

/* ================================================================ */
/* PAGE EXPORT                                                        */
/* ================================================================ */

export default function LandingPage() {
  return (
    <div className="overflow-x-hidden">
      <style>{`
        .rp-desktop { display: block; }
        .rp-mobile  { display: none;  }
        @media (max-width: 768px) {
          .rp-desktop { display: none;  }
          .rp-mobile  { display: block; }
        }
      `}</style>

      <a href="#main-content" style={{ position: "absolute", left: "-9999px", top: "auto", width: 1, height: 1, overflow: "hidden", zIndex: 9999, padding: "12px 24px", backgroundColor: C.navy, color: C.white, fontSize: 14, fontWeight: 600, textDecoration: "none", borderRadius: 8 }}
        onFocus={e => { e.currentTarget.style.position = "fixed"; e.currentTarget.style.left = "16px"; e.currentTarget.style.top = "16px"; e.currentTarget.style.width = "auto"; e.currentTarget.style.height = "auto"; }}
        onBlur={e => { e.currentTarget.style.position = "absolute"; e.currentTarget.style.left = "-9999px"; e.currentTarget.style.width = "1px"; e.currentTarget.style.height = "1px"; }}>
        Skip to main content
      </a>

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(PRODUCT_SCHEMA) }} />

      {/* ── DESKTOP VERSION ── */}
      <div className="rp-desktop">
        <main id="main-content">
          <HeroSection />
          <ProofMoment />
          <CoreDefinitionBand />
          <ExposureSection />
          <DecisionContextSection />
          <HowItWorksSection />
          <FreeVsFull />
          <TrustBlock />
          <WhatYourScoreChanges />
          <AuthoritySEOSection />
          <IndustryProfiles />
          <FaqSection />
          <StructuralIncomeBrief />
          <InternalLinkHub />
          <BreathingMoment />
          <FinalCta />
        </main>
      </div>

      {/* ── MOBILE VERSION ── */}
      <div className="rp-mobile">
        <main id="main-content-mobile">
          <MobileHero />
          <MobileInstantBelief />
          <MobileCoreIdea />
          <MobileExposure />
          <MobileDecisionTrigger />
          <MobileHowItWorks />
          <MobileValue />
          <MobileTrust />
          <MobileFinalClose />
        </main>
      </div>
    </div>
  );
}
