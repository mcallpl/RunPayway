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

const C = { navy: "#1C1635", purple: "#4B3FAE", teal: "#1F6D7A", sand: "#F4F1EA", white: "#FFFFFF", border: "#E5E7EB" };
const mono = '"SF Mono", "Fira Code", "IBM Plex Mono", "Courier New", monospace';
const muted = "rgba(14,26,43,0.68)";
const light = "rgba(14,26,43,0.52)";
const contentW = 1040;
const secPad = (m: boolean) => m ? 56 : 112;
const px = (m: boolean) => m ? 20 : 24;

/* Score Ring SVG */
function ScoreRing({ score, size, stroke = 8, color }: { score: number; size: number; stroke?: number; color: string }) {
  const r = (size - stroke) / 2;
  const circ = 2 * Math.PI * r;
  const offset = circ - (score / 100) * circ;
  return (
    <svg width={size} height={size} style={{ transform: "rotate(-90deg)" }}>
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth={stroke} />
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
  { key: "consulting", name: "Consulting", avg: 38, constraint: "High labor dependence", risk: "If you stop working, 85% of income stops with you. Your clients pay for your time — not a system.", cta: "Measure my income stability" },
  { key: "real_estate", name: "Real Estate", avg: 34, constraint: "Income concentration", risk: "One delayed closing or lost listing can erase a quarter of annual earnings. Your pipeline looks fuller than it is.", cta: "Stress-test my income structure" },
  { key: "sales", name: "Sales / Brokerage", avg: 31, constraint: "Weak forward visibility", risk: "Your last quarter was strong. But nothing in your structure guarantees the next one will be.", cta: "Stress-test my income structure" },
  { key: "technology", name: "Technology", avg: 42, constraint: "Source concentration", risk: "One employer, one equity story, one bonus framework. If that system changes, everything moves at once.", cta: "Measure my income stability" },
  { key: "finance", name: "Finance / Banking", avg: 44, constraint: "Performance dependence", risk: "Salary creates a floor. But the variable component that makes the job worth it can vanish in one cycle.", cta: "Stress-test my income structure" },
  { key: "healthcare", name: "Healthcare", avg: 46, constraint: "Source concentration", risk: "Steady pay from one system feels safe — until the system restructures, and you have no alternative.", cta: "Measure my income stability" },
  { key: "legal", name: "Legal Services", avg: 40, constraint: "Client concentration", risk: "Three matters carry 70% of your billings. When one concludes, the gap is immediate.", cta: "Measure my income stability" },
  { key: "insurance", name: "Insurance", avg: 43, constraint: "Production dependence", risk: "Renewals create continuity. But if new production slows, the structure starts compounding backwards.", cta: "Stress-test my income structure" },
  { key: "construction", name: "Construction / Trades", avg: 29, constraint: "Forward visibility", risk: "The current job is solid. The next one is a handshake. Your income has no buffer between projects.", cta: "Measure my income stability" },
  { key: "media", name: "Media / Entertainment", avg: 27, constraint: "No persistence", risk: "Between projects, your income is zero. No carry. No residual. Every engagement starts from scratch.", cta: "Run my structural assessment" },
  { key: "education", name: "Education", avg: 48, constraint: "Structural rigidity", risk: "Predictable pay from one institution. But when funding shifts or contracts change, you have no lever to pull.", cta: "Measure my income stability" },
  { key: "other", name: "Other Industry", avg: 36, constraint: "Mixed exposure", risk: "Your structure may not fit a standard category. That doesn't reduce the risk — it hides it.", cta: "Run my structural assessment" },
];

/* ================================================================== */
/* SECTION 1 — HERO + INDUSTRY SELECTOR                                */
/* ================================================================== */

function HeroSection() {
  const { ref, visible } = useInView();
  const m = useMobile();
  const fadeIn = useFadeIn();
  const [selected, setSelected] = useState<typeof INDUSTRIES[0] | null>(null);
  const animatedScore = useAnimatedCounter(selected?.avg || 0, !!selected, 1200);
  const bandColor = (s: number) => s >= 75 ? C.teal : s >= 50 ? "#2B5EA7" : s >= 30 ? "#92640A" : "#9B2C2C";
  const bandLabel = (s: number) => s >= 75 ? "High Stability" : s >= 50 ? "Established" : s >= 30 ? "Developing" : "Limited";

  return (
    <header ref={ref} style={{ backgroundColor: C.navy, position: "relative", overflow: "hidden" }}>
      {/* Ambient glow */}
      <div style={{ position: "absolute", top: "-20%", right: "-10%", width: m ? 400 : 800, height: m ? 400 : 800, borderRadius: "50%", background: `radial-gradient(circle, ${C.purple}10 0%, transparent 70%)`, pointerEvents: "none" }} />
      <div style={{ position: "absolute", bottom: "-30%", left: "-15%", width: m ? 300 : 600, height: m ? 300 : 600, borderRadius: "50%", background: `radial-gradient(circle, ${C.teal}08 0%, transparent 70%)`, pointerEvents: "none" }} />

      <div style={{ maxWidth: contentW, margin: "0 auto", paddingTop: m ? 72 : 140, paddingBottom: m ? 48 : 80, paddingLeft: px(m), paddingRight: px(m), position: "relative", zIndex: 1 }}>

        {/* Headline */}
        <div style={{ textAlign: "center", maxWidth: 700, margin: "0 auto", marginBottom: m ? 40 : 56 }}>
          <h1 style={{ fontSize: m ? 32 : 52, fontWeight: 600, lineHeight: 1.08, letterSpacing: "-0.03em", color: C.sand, marginBottom: 20, ...fadeIn(visible) }}>
            Your income has a structure.{m ? " " : <br />}You&#8217;ve never seen it.
          </h1>
          <p style={{ fontSize: m ? 16 : 18, color: "rgba(244,241,234,0.50)", lineHeight: 1.7, marginBottom: 8, ...fadeIn(visible, 100) }}>
            RunPayway&#8482; measures how your income holds under pressure — not how much you make.
          </p>
          <p style={{ fontSize: 14, color: "rgba(244,241,234,0.30)", letterSpacing: "0.03em", ...fadeIn(visible, 160) }}>
            Under 2 minutes &bull; Instant result &bull; Private by default
          </p>
        </div>

        {/* Industry selector */}
        <div style={{ maxWidth: 800, margin: "0 auto", ...fadeIn(visible, 200) }}>
          <div style={{ fontSize: 12, fontWeight: 700, letterSpacing: "0.10em", color: C.teal, textAlign: "center", marginBottom: 16 }}>SELECT YOUR INDUSTRY</div>
          <div style={{ display: "grid", gridTemplateColumns: m ? "repeat(2, 1fr)" : "repeat(4, 1fr)", gap: m ? 8 : 10 }}>
            {INDUSTRIES.slice(0, m ? 8 : 12).map(ind => {
              const isActive = selected?.key === ind.key;
              return (
                <button key={ind.key} onClick={() => setSelected(isActive ? null : ind)}
                  style={{
                    padding: m ? "12px 10px" : "14px 16px", borderRadius: 10, cursor: "pointer",
                    border: `1px solid ${isActive ? C.teal + "50" : "rgba(255,255,255,0.06)"}`,
                    backgroundColor: isActive ? `${C.teal}12` : "rgba(255,255,255,0.02)",
                    transition: "all 200ms", textAlign: "left", minHeight: 44,
                  }}
                  onMouseEnter={e => { if (!isActive) e.currentTarget.style.borderColor = "rgba(255,255,255,0.12)"; }}
                  onMouseLeave={e => { if (!isActive) e.currentTarget.style.borderColor = "rgba(255,255,255,0.06)"; }}
                >
                  <span style={{ fontSize: 14, fontWeight: isActive ? 600 : 500, color: isActive ? C.sand : "rgba(244,241,234,0.65)" }}>{ind.name}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Industry reveal — appears when selected */}
        {selected && (
          <div style={{ maxWidth: 680, margin: "40px auto 0", animation: "fadeSlideIn 400ms ease-out" }}>
            <div style={{ display: m ? "block" : "flex", gap: 32, alignItems: "center" }}>
              {/* Score ring */}
              <div style={{ flexShrink: 0, textAlign: "center", marginBottom: m ? 24 : 0 }}>
                <div style={{ position: "relative", width: 130, height: 130, margin: "0 auto" }}>
                  <ScoreRing score={animatedScore} size={130} stroke={8} color={bandColor(animatedScore)} />
                  <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
                    <span style={{ fontSize: 36, fontWeight: 300, fontFamily: mono, color: C.sand, lineHeight: 1, letterSpacing: "-0.04em" }}>{animatedScore}</span>
                    <span style={{ fontSize: 11, fontWeight: 600, color: bandColor(selected.avg), marginTop: 4, letterSpacing: "0.04em" }}>{bandLabel(selected.avg)}</span>
                  </div>
                </div>
                <div style={{ fontSize: 12, color: "rgba(244,241,234,0.35)", marginTop: 8 }}>{selected.name} avg</div>
              </div>
              {/* Risk narrative */}
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 12, fontWeight: 700, letterSpacing: "0.08em", color: "#E57373", marginBottom: 8 }}>PRIMARY CONSTRAINT: {selected.constraint.toUpperCase()}</div>
                <p style={{ fontSize: 16, color: "rgba(244,241,234,0.70)", lineHeight: 1.65, margin: "0 0 20px" }}>{selected.risk}</p>
                <Link href="/pricing" style={{
                  display: "inline-flex", alignItems: "center", justifyContent: "center",
                  height: 48, padding: "0 28px", borderRadius: 10,
                  backgroundColor: C.white, color: C.navy,
                  fontSize: 15, fontWeight: 600, textDecoration: "none",
                  transition: "background-color 200ms",
                }}
                  onMouseEnter={e => { e.currentTarget.style.backgroundColor = "#E8E5DE"; }}
                  onMouseLeave={e => { e.currentTarget.style.backgroundColor = C.white; }}>
                  {selected.cta}
                </Link>
              </div>
            </div>
          </div>
        )}

        {/* Default CTA — hidden when industry is selected */}
        {!selected && (
          <div style={{ textAlign: "center", marginTop: 40, ...fadeIn(visible, 300) }}>
            <Link href="/pricing" style={{
              display: "inline-flex", alignItems: "center", justifyContent: "center",
              height: 56, width: m ? "100%" : "auto", padding: m ? "0 24px" : "0 44px",
              borderRadius: 12, backgroundColor: C.white, color: C.navy,
              fontSize: m ? 15 : 16, fontWeight: 600, textDecoration: "none",
              boxShadow: "0 2px 12px rgba(244,241,234,0.10)",
              transition: "background-color 200ms, box-shadow 200ms",
            }}
              onMouseEnter={e => { e.currentTarget.style.backgroundColor = "#E8E5DE"; }}
              onMouseLeave={e => { e.currentTarget.style.backgroundColor = C.white; }}>
              Get My Income Stability Score
            </Link>
          </div>
        )}

        {/* Trust strip */}
        <div style={{ marginTop: m ? 36 : 48, paddingTop: m ? 20 : 28, borderTop: "1px solid rgba(244,241,234,0.06)", ...fadeIn(visible, 400) }}>
          <p style={{ fontSize: 13, letterSpacing: "0.04em", color: "rgba(244,241,234,0.30)", textAlign: "center" }}>
            Model RP-2.0 &bull; Version-locked &bull; Deterministic output &bull; No bank connection &bull; No credit pull
          </p>
        </div>
      </div>
      <style>{`@keyframes fadeSlideIn { from { opacity: 0; transform: translateY(16px); } to { opacity: 1; transform: translateY(0); } }`}</style>
    </header>
  );
}


/* ================================================================== */
/* SECTION 2 — SAME INCOME, DIFFERENT STABILITY                        */
/* ================================================================== */

function SameIncomeProof() {
  const { ref, visible } = useInView();
  const m = useMobile();
  const fadeIn = useFadeIn();
  return (
    <section ref={ref} style={{ backgroundColor: C.white, paddingTop: secPad(m), paddingBottom: secPad(m), paddingLeft: px(m), paddingRight: px(m) }}>
      <div style={{ maxWidth: contentW, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: m ? 36 : 56, ...fadeIn(visible) }}>
          <h2 style={{ fontSize: m ? 26 : 40, fontWeight: 600, lineHeight: 1.12, letterSpacing: "-0.02em", color: C.navy, marginBottom: 14 }}>Same income. Different structure.{m ? " " : <br />}Completely different risk.</h2>
        </div>
        <div style={{ display: m ? "block" : "grid", gridTemplateColumns: "1fr 1fr", gap: 24, maxWidth: 880, margin: "0 auto", ...fadeIn(visible, 120) }}>
          {/* Person A — fragile */}
          <div style={{ borderRadius: 16, padding: m ? 20 : 36, border: `1px solid ${C.border}`, marginBottom: m ? 16 : 0, position: "relative" as const, overflow: "hidden" }}>
            <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 3, backgroundColor: "rgba(155,44,44,0.25)" }} />
            <div style={{ fontSize: 14, fontWeight: 500, color: light, marginBottom: 16 }}>$150K / year &mdash; Freelance Consultant</div>
            <div style={{ display: "flex", flexDirection: "column" as const, gap: 10, marginBottom: 28 }}>
              {["1 client = 80% of income", "No forward contracts", "Income stops if work stops"].map((t, i) => (
                <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 10 }}><span style={{ width: 5, height: 5, borderRadius: "50%", backgroundColor: "#9B2C2C", flexShrink: 0, marginTop: 7 }} /><span style={{ fontSize: 15, color: muted, lineHeight: 1.6 }}>{t}</span></div>
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
                <div style={{ fontSize: 15, fontWeight: 600, color: "#9B2C2C" }}>Limited Stability</div>
                <div style={{ fontSize: 14, color: light }}>One client decision away from crisis</div>
              </div>
            </div>
          </div>
          {/* Person B — structured */}
          <div style={{ borderRadius: 16, padding: m ? 20 : 36, border: `1px solid ${C.border}`, position: "relative" as const, overflow: "hidden" }}>
            <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 3, background: `linear-gradient(90deg, ${C.teal}, ${C.purple})` }} />
            <div style={{ fontSize: 14, fontWeight: 500, color: light, marginBottom: 16 }}>$150K / year &mdash; Freelance Consultant</div>
            <div style={{ display: "flex", flexDirection: "column" as const, gap: 10, marginBottom: 28 }}>
              {["5 clients, none over 30%", "40% recurring revenue", "3 months secured forward"].map((t, i) => (
                <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 10 }}><span style={{ width: 5, height: 5, borderRadius: "50%", backgroundColor: C.teal, flexShrink: 0, marginTop: 7 }} /><span style={{ fontSize: 15, color: muted, lineHeight: 1.6 }}>{t}</span></div>
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
                <div style={{ fontSize: 15, fontWeight: 600, color: C.teal }}>Established Stability</div>
                <div style={{ fontSize: 14, color: light }}>Can absorb a disruption and keep going</div>
              </div>
            </div>
          </div>
        </div>
        <p style={{ fontSize: 17, fontWeight: 500, color: C.navy, textAlign: "center", marginTop: m ? 28 : 48, ...fadeIn(visible, 220) }}>The income is the same. The structure is not. That&#8217;s what RunPayway measures.</p>
      </div>
    </section>
  );
}


/* ================================================================== */
/* SECTION 3 — THE SYSTEM (merged: definition + how it works + tools)  */
/* ================================================================== */

function TheSystem() {
  const { ref, visible } = useInView();
  const m = useMobile();
  const fadeIn = useFadeIn();
  return (
    <section ref={ref} style={{ backgroundColor: C.navy, paddingTop: secPad(m), paddingBottom: secPad(m), paddingLeft: px(m), paddingRight: px(m), position: "relative", overflow: "hidden" }}>
      <div style={{ position: "absolute", top: "50%", left: "50%", width: m ? 300 : 600, height: m ? 300 : 600, transform: "translate(-50%, -50%)", borderRadius: "50%", background: `radial-gradient(circle, ${C.purple}08 0%, transparent 70%)`, pointerEvents: "none" }} />
      <div style={{ maxWidth: 800, margin: "0 auto", position: "relative", zIndex: 1 }}>

        {/* What it is */}
        <div style={{ textAlign: "center", marginBottom: m ? 48 : 72, ...fadeIn(visible) }}>
          <div style={{ fontSize: 12, fontWeight: 700, letterSpacing: "0.10em", color: C.teal, marginBottom: 16 }}>THE SYSTEM</div>
          <h2 style={{ fontSize: m ? 26 : 40, fontWeight: 600, lineHeight: 1.12, letterSpacing: "-0.02em", color: C.sand, marginBottom: 20 }}>
            Not a budget. Not a forecast.{m ? " " : <br />}A structural measurement.
          </h2>
          <p style={{ fontSize: 17, color: "rgba(244,241,234,0.50)", lineHeight: 1.7, maxWidth: 560, margin: "0 auto" }}>
            RunPayway evaluates 6 fixed structural dimensions of your income. A deterministic model. Same inputs always produce the same score.
          </p>
        </div>

        {/* 3 steps */}
        <div style={{ display: m ? "block" : "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 24, marginBottom: m ? 48 : 72, ...fadeIn(visible, 100) }}>
          {[
            { num: "01", title: "Describe your structure", desc: "Sources, contracts, concentration, and dependencies. Under 2 minutes." },
            { num: "02", title: "6 structural dimensions", desc: "Persistence, concentration, diversification, forward visibility, variability, labor dependence." },
            { num: "03", title: "One standardized score", desc: "0\u2013100. Band classification. Primary constraint. Recommended direction." },
          ].map((s, i) => (
            <div key={i} style={{ marginBottom: m ? 24 : 0, padding: m ? "20px 16px" : "24px 20px", borderRadius: 12, backgroundColor: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" }}>
              <div style={{ fontSize: 13, fontWeight: 600, fontFamily: mono, color: C.teal, marginBottom: 12 }}>{s.num}</div>
              <div style={{ fontSize: 17, fontWeight: 600, color: C.sand, marginBottom: 8, lineHeight: 1.3 }}>{s.title}</div>
              <p style={{ fontSize: 14, color: "rgba(244,241,234,0.50)", margin: 0, lineHeight: 1.6 }}>{s.desc}</p>
            </div>
          ))}
        </div>

        {/* What you get */}
        <div style={{ ...fadeIn(visible, 200) }}>
          <div style={{ fontSize: 12, fontWeight: 700, letterSpacing: "0.10em", color: C.teal, textAlign: "center", marginBottom: 20 }}>INCLUDED WITH YOUR DIAGNOSTIC</div>
          <div style={{ display: "grid", gridTemplateColumns: m ? "1fr" : "1fr 1fr", gap: 12 }}>
            {[
              { title: "PressureMap\u2122", desc: "See exactly where your income is vulnerable and where it is protected." },
              { title: "What-If Simulator", desc: "Model structural changes before you commit. See the exact score impact." },
              { title: "12-Week Roadmap", desc: "Sequenced action plan with industry-specific scripts." },
              { title: "Goal Mode", desc: "Pick a target band. See the minimum moves required to reach it." },
            ].map((t, i) => (
              <div key={i} style={{ padding: m ? "16px 14px" : "18px 20px", borderRadius: 10, border: "1px solid rgba(255,255,255,0.06)", backgroundColor: "rgba(255,255,255,0.02)" }}>
                <div style={{ fontSize: 15, fontWeight: 600, color: C.sand, marginBottom: 4 }}>{t.title}</div>
                <p style={{ fontSize: 14, color: "rgba(244,241,234,0.45)", margin: 0, lineHeight: 1.55 }}>{t.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}


/* ================================================================== */
/* SECTION 4 — TRUST                                                   */
/* ================================================================== */

function TrustStrip() {
  const { ref, visible } = useInView();
  const m = useMobile();
  const fadeIn = useFadeIn();
  return (
    <section ref={ref} style={{ backgroundColor: C.sand, paddingTop: secPad(m), paddingBottom: secPad(m), paddingLeft: px(m), paddingRight: px(m) }}>
      <div style={{ maxWidth: contentW, margin: "0 auto" }}>
        <h2 style={{ fontSize: m ? 26 : 36, fontWeight: 600, lineHeight: 1.15, letterSpacing: "-0.02em", color: C.navy, textAlign: "center", marginBottom: m ? 36 : 56, ...fadeIn(visible) }}>
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
              <div style={{ fontSize: 16, fontWeight: 600, color: C.navy, marginBottom: 6 }}>{item.title}</div>
              <p style={{ fontSize: 14, color: muted, lineHeight: 1.6, margin: 0 }}>{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}


/* ================================================================== */
/* SECTION 5 — FINAL CTA                                               */
/* ================================================================== */

function FinalCta() {
  const { ref, visible } = useInView();
  const m = useMobile();
  const fadeIn = useFadeIn();
  return (
    <section ref={ref} style={{ backgroundColor: C.navy, paddingTop: m ? 72 : 120, paddingBottom: m ? 72 : 120, paddingLeft: px(m), paddingRight: px(m), position: "relative", overflow: "hidden" }}>
      <div style={{ position: "absolute", top: "50%", left: "50%", width: m ? 300 : 500, height: m ? 300 : 500, transform: "translate(-50%, -50%)", borderRadius: "50%", background: `radial-gradient(circle, ${C.purple}08 0%, transparent 70%)`, pointerEvents: "none" }} />
      <div style={{ maxWidth: 640, margin: "0 auto", textAlign: "center", position: "relative", zIndex: 1 }}>
        <h2 style={{ fontSize: m ? 26 : 40, fontWeight: 600, lineHeight: 1.12, letterSpacing: "-0.02em", color: C.sand, marginBottom: 20, ...fadeIn(visible) }}>
          Your income is already being tested.{m ? " " : <br />}Now you can see how it holds.
        </h2>
        <p style={{ fontSize: 17, color: "rgba(244,241,234,0.45)", lineHeight: 1.65, marginBottom: 40, ...fadeIn(visible, 80) }}>
          Start with the free score. Unlock the full diagnostic when you&#8217;re ready to act.
        </p>
        <div style={{ ...fadeIn(visible, 160) }}>
          <Link href="/pricing" style={{
            display: "inline-flex", alignItems: "center", justifyContent: "center",
            height: 56, padding: m ? "0 28px" : "0 48px", width: m ? "100%" : "auto", maxWidth: m ? 360 : "none",
            borderRadius: 12, backgroundColor: C.white, color: C.navy,
            fontSize: m ? 15 : 17, fontWeight: 600, textDecoration: "none",
            boxShadow: "0 2px 16px rgba(244,241,234,0.10)",
            transition: "background-color 200ms, box-shadow 200ms",
          }}
            onMouseEnter={e => { e.currentTarget.style.backgroundColor = "#E8E5DE"; }}
            onMouseLeave={e => { e.currentTarget.style.backgroundColor = C.white; }}>
            Start Your Free Assessment
          </Link>
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
        <SameIncomeProof />
        <TheSystem />
        <TrustStrip />
        <FinalCta />
      </main>
      <StickyMobileCta />
    </div>
  );
}
