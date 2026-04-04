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

const STRIPE = "https://buy.stripe.com/9B66oz48EaYU2lc4IF2Nq05";
const STRIPE_ANNUAL = "https://buy.stripe.com/14A14fbB67MIcZQ3EB2Nq06";


/* ================================================================== */
/* SECTION 1 — HERO                                                    */
/* ================================================================== */

function HeroSection() {
  const { ref, visible } = useInView();
  const m = useMobile();
  const fadeIn = useFadeIn();
  return (
    <header ref={ref} style={{ backgroundColor: C.navy, position: "relative", overflow: "hidden", paddingTop: m ? 80 : 140, paddingBottom: m ? 56 : 100, paddingLeft: px(m), paddingRight: px(m) }}>
      <div style={{ position: "absolute", top: "-20%", right: "-10%", width: 600, height: 600, borderRadius: "50%", background: `radial-gradient(circle, ${C.purple}06 0%, transparent 70%)`, pointerEvents: "none" }} />
      <div style={{ maxWidth: 780, margin: "0 auto", textAlign: "center", position: "relative", zIndex: 1 }}>
        <h1 style={{ fontSize: m ? 36 : 52, fontWeight: 600, lineHeight: 1.08, letterSpacing: "-0.03em", color: "#F4F1EA", marginBottom: 24, ...fadeIn(visible) }}>
          Your income will be tested.{m ? " " : <br />}This shows whether it holds.
        </h1>
        <p style={{ fontSize: 17, color: "rgba(244,241,234,0.50)", lineHeight: 1.65, marginBottom: 16, ...fadeIn(visible, 100) }}>
          Measure the structural integrity of your income before conditions force the answer.
        </p>
        <p style={{ fontSize: 15, color: "rgba(244,241,234,0.35)", lineHeight: 1.55, marginBottom: 32, ...fadeIn(visible, 180) }}>
          Free score instantly. Full diagnostic for $69. Track your structure over time for $149/year.
        </p>
        <p style={{ fontSize: 12, color: "rgba(244,241,234,0.25)", letterSpacing: "0.04em", ...fadeIn(visible, 260) }}>
          No bank connection &bull; Instant results &bull; Full refund guarantee
        </p>
      </div>
    </header>
  );
}


/* ================================================================== */
/* SECTION 2 — VALUE FRAME                                             */
/* ================================================================== */

function ValueFrame() {
  const { ref, visible } = useInView();
  const m = useMobile();
  const fadeIn = useFadeIn();
  return (
    <section ref={ref} style={{ backgroundColor: C.sand, paddingTop: m ? 48 : 80, paddingBottom: m ? 48 : 80, paddingLeft: px(m), paddingRight: px(m) }}>
      <div style={{ maxWidth: 720, margin: "0 auto", textAlign: "center" }}>
        <h2 style={{ fontSize: m ? 30 : 40, fontWeight: 600, lineHeight: 1.15, letterSpacing: "-0.02em", color: C.navy, marginBottom: 24, ...fadeIn(visible) }}>
          The score shows where you stand.{m ? " " : <br />}The diagnostic shows what breaks — and what to fix.
        </h2>
        <p style={{ fontSize: 17, color: muted, lineHeight: 1.65, marginBottom: 12, ...fadeIn(visible, 80) }}>Without the diagnostic, you see the number.</p>
        <p style={{ fontSize: 17, fontWeight: 500, color: C.navy, lineHeight: 1.65, ...fadeIn(visible, 140) }}>With it, you see the structure behind it.</p>
      </div>
    </section>
  );
}


/* ================================================================== */
/* SECTION 3 — PRICING CARDS                                           */
/* ================================================================== */

function PricingCards() {
  const { ref, visible } = useInView();
  const m = useMobile();
  const fadeIn = useFadeIn();
  const check = (text: string, color = C.teal) => (
    <div style={{ display: "flex", alignItems: "flex-start", gap: 10, marginBottom: 14 }}>
      <span style={{ color, fontSize: 14, flexShrink: 0, marginTop: 2 }}>&#10003;</span>
      <span style={{ fontSize: 15, lineHeight: 1.55 }}>{text}</span>
    </div>
  );

  return (
    <section ref={ref} style={{ backgroundColor: C.white, paddingTop: secPad(m), paddingBottom: secPad(m), paddingLeft: px(m), paddingRight: px(m) }}>
      <div style={{ maxWidth: contentW, margin: "0 auto" }}>
        <div style={{ display: m ? "block" : "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 20, alignItems: "start", ...fadeIn(visible) }}>

          {/* FREE */}
          <div style={{ backgroundColor: C.white, borderRadius: 16, padding: m ? 28 : 32, border: `1px solid ${C.border}`, display: "flex", flexDirection: "column" as const, marginBottom: m ? 16 : 0, position: "relative" as const, overflow: "hidden" }}>
            <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 3, backgroundColor: "rgba(14,26,43,0.06)" }} />
            <div style={{ fontSize: 11, fontWeight: 500, letterSpacing: "0.12em", textTransform: "uppercase" as const, color: C.teal, marginTop: 4, marginBottom: 24 }}>
              Income Stability Score&#8482;
            </div>
            <div style={{ marginBottom: 4 }}>
              <span style={{ fontSize: 44, fontWeight: 600, fontFamily: mono, color: C.navy, lineHeight: 1 }}>$0</span>
            </div>
            <div style={{ fontSize: 13, color: light, marginBottom: 28 }}>always free</div>
            <div style={{ marginBottom: 28, flex: 1, color: muted }}>
              {check("Score (0\u2013100)")}
              {check("Stability band classification")}
              {check("Primary structural constraint")}
              {check("Distance to next band")}
              {check("Industry percentile benchmark")}
            </div>
            <Link href="/begin" style={{ display: "flex", alignItems: "center", justifyContent: "center", height: 52, borderRadius: 12, backgroundColor: C.white, color: C.navy, border: `1px solid ${C.navy}`, fontSize: 15, fontWeight: 600, textDecoration: "none", transition: "background-color 200ms" }}
              onMouseEnter={e => { e.currentTarget.style.backgroundColor = "#f5f4f1"; }}
              onMouseLeave={e => { e.currentTarget.style.backgroundColor = C.white; }}>
              Get My Free Score
            </Link>
            <p style={{ fontSize: 13, color: light, textAlign: "center", marginTop: 12, marginBottom: 0 }}>
              Takes about 90 seconds. No account required.
            </p>
          </div>

          {/* DIAGNOSTIC (PRIMARY) */}
          <div style={{ backgroundColor: C.white, borderRadius: 16, padding: m ? 28 : 32, border: `1px solid rgba(14,26,43,0.12)`, display: "flex", flexDirection: "column" as const, position: "relative" as const, overflow: "hidden", boxShadow: "0 4px 24px rgba(14,26,43,0.06)", transform: m ? "none" : "scale(1.02)" }}>
            <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 3, background: `linear-gradient(90deg, ${C.purple}, ${C.teal})` }} />
            <div style={{ fontSize: 11, fontWeight: 500, letterSpacing: "0.12em", textTransform: "uppercase" as const, color: C.purple, marginTop: 4, marginBottom: 24 }}>
              RunPayway&#8482; Diagnostic
            </div>
            <div style={{ marginBottom: 4 }}>
              <span style={{ fontSize: 44, fontWeight: 600, fontFamily: mono, color: C.navy, lineHeight: 1 }}>$69</span>
            </div>
            <div style={{ fontSize: 13, color: light, marginBottom: 20 }}>one-time</div>
            <p style={{ fontSize: 16, fontWeight: 500, color: C.navy, lineHeight: 1.55, marginBottom: 24 }}>
              See exactly why your score is what it is — and what changes it.
            </p>
            <div style={{ marginBottom: 28, flex: 1, color: muted }}>
              {check("Full structural breakdown across all six dimensions")}
              {check("PressureMap\u2122 structural intelligence")}
              {check("Ranked disruption scenarios with exact score drops")}
              {check("Highest-impact actions with projected score movement")}
              {check("30-day execution roadmap")}
              {check("Command Center access")}
            </div>
            <a href={STRIPE} style={{ display: "flex", alignItems: "center", justifyContent: "center", height: 56, borderRadius: 12, backgroundColor: C.navy, color: C.white, fontSize: 16, fontWeight: 600, textDecoration: "none", transition: "background-color 200ms, box-shadow 200ms", boxShadow: "0 2px 12px rgba(14,26,43,0.10)" }}
              onMouseEnter={e => { e.currentTarget.style.backgroundColor = "#1a2540"; e.currentTarget.style.boxShadow = "0 4px 20px rgba(14,26,43,0.15)"; }}
              onMouseLeave={e => { e.currentTarget.style.backgroundColor = C.navy; e.currentTarget.style.boxShadow = "0 2px 12px rgba(14,26,43,0.10)"; }}>
              Unlock Full Diagnostic &mdash; $69
            </a>
            <p style={{ fontSize: 13, fontWeight: 500, color: C.teal, textAlign: "center", marginTop: 12, marginBottom: 0 }}>
              If it doesn&#8217;t reveal something new, full refund.
            </p>
          </div>

          {/* MONITORING */}
          <div style={{ backgroundColor: C.navy, borderRadius: 16, padding: m ? 28 : 32, display: "flex", flexDirection: "column" as const, position: "relative" as const, overflow: "hidden", marginTop: m ? 16 : 0 }}>
            <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 3, background: `linear-gradient(90deg, ${C.teal}, ${C.purple})` }} />
            <div style={{ fontSize: 11, fontWeight: 500, letterSpacing: "0.12em", textTransform: "uppercase" as const, color: C.teal, marginTop: 4, marginBottom: 24 }}>
              RunPayway&#8482; Monitoring
            </div>
            <div style={{ marginBottom: 4 }}>
              <span style={{ fontSize: 44, fontWeight: 600, fontFamily: mono, color: C.sand, lineHeight: 1 }}>$149</span>
              <span style={{ fontSize: 15, color: "rgba(244,241,234,0.40)", marginLeft: 8 }}>/year</span>
            </div>
            <div style={{ fontSize: 14, color: "rgba(244,241,234,0.40)", marginBottom: 24 }}>Track how your structure evolves — not just your score.</div>
            <div style={{ marginBottom: 28, flex: 1, color: "rgba(244,241,234,0.60)" }}>
              {check("3 full assessments within 12 months", C.teal)}
              {check("Score history timeline", C.teal)}
              {check("Factor-level change tracking", C.teal)}
              {check("Benchmark evolution over time", C.teal)}
              {check("Monitoring portal access", C.teal)}
            </div>
            <a href={STRIPE_ANNUAL} style={{ display: "flex", alignItems: "center", justifyContent: "center", height: 52, borderRadius: 12, backgroundColor: C.white, color: C.navy, fontSize: 15, fontWeight: 600, textDecoration: "none", transition: "opacity 200ms" }}
              onMouseEnter={e => { e.currentTarget.style.opacity = "0.9"; }}
              onMouseLeave={e => { e.currentTarget.style.opacity = "1"; }}>
              Start Monitoring &mdash; $149
            </a>
            <p style={{ fontSize: 13, color: "rgba(244,241,234,0.30)", textAlign: "center", marginTop: 12, marginBottom: 0 }}>
              Full Command Center access included.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}


/* ================================================================== */
/* SECTION 4 — WHY UPGRADE                                             */
/* ================================================================== */

function WhyUpgrade() {
  const { ref, visible } = useInView();
  const m = useMobile();
  const fadeIn = useFadeIn();
  return (
    <section ref={ref} style={{ backgroundColor: C.sand, paddingTop: secPad(m), paddingBottom: secPad(m), paddingLeft: px(m), paddingRight: px(m) }}>
      <div style={{ maxWidth: 720, margin: "0 auto" }}>
        <h2 style={{ fontSize: m ? 30 : 40, fontWeight: 600, lineHeight: 1.15, letterSpacing: "-0.02em", color: C.navy, marginBottom: 24, ...fadeIn(visible) }}>Why people upgrade</h2>
        <p style={{ fontSize: 17, color: muted, lineHeight: 1.65, marginBottom: 24, ...fadeIn(visible, 80) }}>The score shows where you stand.</p>
        <p style={{ fontSize: 17, color: muted, lineHeight: 1.65, marginBottom: 8, ...fadeIn(visible, 120) }}>The diagnostic shows:</p>
        <div style={{ marginBottom: 28, ...fadeIn(visible, 160) }}>
          {["what is fragile", "what breaks first", "what to fix first"].map((item, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 10 }}>
              <span style={{ width: 5, height: 5, borderRadius: "50%", backgroundColor: C.teal, flexShrink: 0 }} />
              <span style={{ fontSize: 17, fontWeight: 500, color: C.navy }}>{item}</span>
            </div>
          ))}
        </div>
        <div style={{ padding: "20px 28px", borderRadius: 14, backgroundColor: C.white, border: `1px solid ${C.border}`, display: "inline-block", ...fadeIn(visible, 220) }}>
          <p style={{ fontSize: 16, color: light, marginBottom: 4 }}>Without it, you&#8217;re guessing.</p>
          <p style={{ fontSize: 16, fontWeight: 500, color: C.navy, margin: 0 }}>With it, you&#8217;re executing.</p>
        </div>
      </div>
    </section>
  );
}


/* ================================================================== */
/* SECTION 5 — REPORT BREAKDOWN                                        */
/* ================================================================== */

function ReportBreakdown() {
  const { ref, visible } = useInView();
  const m = useMobile();
  const fadeIn = useFadeIn();
  const pages = [
    { num: "01", title: "Cover & Score", desc: "Your score, band, constraint, and distance to next level.", icon: "M9 19v-6a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v6M15 19v-6a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v6M9 13V5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v8" },
    { num: "02", title: "Key Findings", desc: "PressureMap\u2122, structure breakdown, strengths, constraint.", icon: "M21 21l-6-6m2-5a7 7 0 1 1-14 0 7 7 0 0 1 14 0z" },
    { num: "03", title: "Stability Plan", desc: "Ranked actions, projected impact, 30-day roadmap.", icon: "M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2M9 5a2 2 0 0 0 2 2h2a2 2 0 0 0 2-2M9 5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2" },
    { num: "04", title: "Stress Testing", desc: "Disruption scenarios, score drops, fragility analysis.", icon: "M13 10V3L4 14h7v7l9-11h-7z" },
  ];
  return (
    <section ref={ref} style={{ backgroundColor: C.white, paddingTop: secPad(m), paddingBottom: secPad(m), paddingLeft: px(m), paddingRight: px(m) }}>
      <div style={{ maxWidth: contentW, margin: "0 auto" }}>
        <h2 style={{ fontSize: m ? 30 : 40, fontWeight: 600, lineHeight: 1.15, letterSpacing: "-0.02em", color: C.navy, marginBottom: 16, ...fadeIn(visible) }}>Four pages. Nothing withheld.</h2>
        <p style={{ fontSize: 17, color: muted, lineHeight: 1.65, marginBottom: m ? 36 : 56, maxWidth: 560, ...fadeIn(visible, 80) }}>
          Every section generated from your structural inputs and interpreted through your industry and income model.
        </p>
        <div style={{ display: "grid", gridTemplateColumns: m ? "1fr" : "1fr 1fr", gap: 16, ...fadeIn(visible, 140) }}>
          {pages.map((p, i) => (
            <div key={i} style={{ padding: m ? 24 : 28, borderRadius: 14, border: `1px solid ${C.border}`, backgroundColor: "#FAFAFA" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 14 }}>
                <div style={{ width: 36, height: 36, borderRadius: 8, backgroundColor: `${C.teal}08`, border: `1px solid ${C.teal}12`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={C.teal} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d={p.icon} /></svg>
                </div>
                <div>
                  <div style={{ fontSize: 11, fontWeight: 500, letterSpacing: "0.10em", color: C.teal }}>{p.num}</div>
                  <div style={{ fontSize: 17, fontWeight: 600, color: C.navy }}>{p.title}</div>
                </div>
              </div>
              <p style={{ fontSize: 14, color: muted, lineHeight: 1.6, margin: 0 }}>{p.desc}</p>
            </div>
          ))}
        </div>
        <div style={{ marginTop: 24, ...fadeIn(visible, 220) }}>
          <Link href="/sample-report" style={{ fontSize: 14, fontWeight: 500, color: C.teal, textDecoration: "none", transition: "opacity 200ms" }}
            onMouseEnter={e => { e.currentTarget.style.opacity = "0.7"; }}
            onMouseLeave={e => { e.currentTarget.style.opacity = "1"; }}>
            View sample report &rarr;
          </Link>
        </div>
      </div>
    </section>
  );
}


/* ================================================================== */
/* SECTION 6 — TRANSFORMATION PROOF                                    */
/* ================================================================== */

function ScoreRing({ score, size, stroke = 4, color }: { score: number; size: number; stroke?: number; color: string }) {
  const r = (size - stroke) / 2;
  const circ = 2 * Math.PI * r;
  const offset = circ - (score / 100) * circ;
  return (
    <svg width={size} height={size} style={{ transform: "rotate(-90deg)" }}>
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="rgba(14,26,43,0.06)" strokeWidth={stroke} />
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={color} strokeWidth={stroke} strokeDasharray={circ} strokeDashoffset={offset} strokeLinecap="round" />
    </svg>
  );
}

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
    <section ref={ref} style={{ backgroundColor: C.sand, paddingTop: secPad(m), paddingBottom: secPad(m), paddingLeft: px(m), paddingRight: px(m) }}>
      <div style={{ maxWidth: contentW, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: m ? 36 : 56, ...fadeIn(visible) }}>
          <h2 style={{ fontSize: m ? 30 : 40, fontWeight: 600, lineHeight: 1.15, letterSpacing: "-0.02em", color: C.navy, marginBottom: 14 }}>The score reveals the weakness.{m ? " " : <br />}The action changes the outcome.</h2>
        </div>
        <div style={{ display: m ? "block" : "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 20, ...fadeIn(visible, 120) }}>
          {results.map((r, i) => (
            <div key={i} style={{ padding: m ? 24 : 28, borderRadius: 14, border: `1px solid ${C.border}`, backgroundColor: C.white, marginBottom: m ? 12 : 0 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 16 }}>
                <div style={{ position: "relative", width: 48, height: 48, flexShrink: 0 }}>
                  <ScoreRing score={r.before} size={48} color="rgba(14,26,43,0.12)" />
                  <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center" }}><span style={{ fontSize: 14, fontWeight: 500, fontFamily: mono, color: light }}>{r.before}</span></div>
                </div>
                <svg width="16" height="12" viewBox="0 0 16 12" fill="none"><path d="M1 6h14M11 1l4 5-4 5" stroke={C.teal} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
                <div style={{ position: "relative", width: 48, height: 48, flexShrink: 0 }}>
                  <ScoreRing score={r.after} size={48} color={C.teal} />
                  <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center" }}><span style={{ fontSize: 14, fontWeight: 600, fontFamily: mono, color: C.teal }}>{r.after}</span></div>
                </div>
              </div>
              <div style={{ fontSize: 12, color: light, marginBottom: 8 }}>Constraint: {r.constraint}</div>
              <p style={{ fontSize: 14, color: muted, lineHeight: 1.55, margin: 0 }}>{r.action}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}


/* ================================================================== */
/* SECTION 7 — TRUST BLOCK                                             */
/* ================================================================== */

function TrustBlock() {
  const { ref, visible } = useInView();
  const m = useMobile();
  const fadeIn = useFadeIn();
  const items = [
    { title: "No bank connection", desc: "We never access financial accounts.", icon: "M12 15v2m-6 4h12a2 2 0 0 0 2-2v-6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2zm10-10V7a4 4 0 0 0-8 0v4h8z" },
    { title: "No credit pull", desc: "No impact on your credit.", icon: "M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0 1 12 2.944a11.955 11.955 0 0 1-8.618 3.04A12.02 12.02 0 0 0 3 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" },
    { title: "Private by default", desc: "Your data is never sold.", icon: "M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0z M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" },
    { title: "Deterministic system", desc: "Same inputs \u2192 same score.", icon: "M4 4v5h.582m15.356 2A8.001 8.001 0 0 0 4.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 0 1-15.357-2m15.357 2H15" },
  ];
  return (
    <section ref={ref} style={{ backgroundColor: C.white, paddingTop: secPad(m), paddingBottom: secPad(m), paddingLeft: px(m), paddingRight: px(m) }}>
      <div style={{ maxWidth: contentW, margin: "0 auto" }}>
        <h2 style={{ fontSize: m ? 30 : 40, fontWeight: 600, lineHeight: 1.15, letterSpacing: "-0.02em", color: C.navy, textAlign: "center", marginBottom: m ? 36 : 56, ...fadeIn(visible) }}>
          Designed as a measurement system — not a financial tool.
        </h2>
        <div style={{ display: "grid", gridTemplateColumns: m ? "1fr 1fr" : "1fr 1fr 1fr 1fr", gap: 16, ...fadeIn(visible, 100) }}>
          {items.map((item, i) => (
            <div key={i} style={{ textAlign: "center", padding: m ? 20 : 28, borderRadius: 14, backgroundColor: "#FAFAFA", border: `1px solid ${C.border}` }}>
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
/* SECTION 8 — FAQ                                                     */
/* ================================================================== */

function FaqSection() {
  const { ref, visible } = useInView();
  const m = useMobile();
  const fadeIn = useFadeIn();
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const faqs = [
    { q: "What do I get for free?", a: "Your score out of 100, your stability band, your primary structural constraint, distance to next band, and your industry percentile benchmark. No account required." },
    { q: "What does the Diagnostic include?", a: "A full structural breakdown of your score across all six dimensions, PressureMap\u2122 analysis, ranked disruption scenarios, highest-impact actions with projected score movement, a 30-day execution roadmap, and Command Center access." },
    { q: "What does Monitoring include?", a: "Three full assessments within 12 months, score history timeline, factor-level change tracking, benchmark evolution over time, and monitoring portal access. Full Command Center access included." },
    { q: "How is the score calculated?", a: "The score is produced by a deterministic model that evaluates six structural dimensions of your income. The model is fixed, versioned, and produces identical output for identical inputs. No AI or subjective interpretation is involved in scoring." },
    { q: "Is my information confidential?", a: "Yes. There is no bank connection, no credit pull, and no external data access. Your result is based entirely on the information you provide. Your data is never sold." },
    { q: "What is the refund policy?", a: "If the diagnostic does not reveal at least one structural insight you did not already know, you receive a full refund. No conditions." },
  ];
  return (
    <section ref={ref} style={{ backgroundColor: C.sand, paddingTop: secPad(m), paddingBottom: secPad(m), paddingLeft: px(m), paddingRight: px(m) }}>
      <div style={{ maxWidth: 820, margin: "0 auto" }}>
        <h2 style={{ fontSize: m ? 30 : 40, fontWeight: 600, lineHeight: 1.15, letterSpacing: "-0.02em", color: C.navy, textAlign: "center", marginBottom: m ? 36 : 56, ...fadeIn(visible) }}>Frequently Asked Questions</h2>
        <div style={{ ...fadeIn(visible, 80) }}>
          {faqs.map((faq, i) => {
            const isOpen = openFaq === i;
            return (
              <div key={i} style={{ borderTop: `1px solid ${C.border}` }}>
                <button onClick={() => setOpenFaq(isOpen ? null : i)} aria-expanded={isOpen}
                  style={{ width: "100%", padding: "22px 0", minHeight: 48, display: "flex", alignItems: "center", justifyContent: "space-between", background: "none", border: "none", cursor: "pointer", textAlign: "left" }}>
                  <span style={{ fontSize: m ? 16 : 18, fontWeight: 500, color: C.navy, paddingRight: 16, lineHeight: 1.4 }}>{faq.q}</span>
                  <svg width="14" height="14" viewBox="0 0 16 16" fill="none" style={{ flexShrink: 0, transition: "transform 200ms", transform: isOpen ? "rotate(45deg)" : "rotate(0deg)" }}>
                    <path d="M3 8h10" stroke={C.navy} strokeWidth="1.5" strokeLinecap="round" />
                    <path d="M8 3v10" stroke={C.navy} strokeWidth="1.5" strokeLinecap="round" />
                  </svg>
                </button>
                <div style={{ maxHeight: isOpen ? 400 : 0, overflow: "hidden", transition: "max-height 300ms ease" }}>
                  <p style={{ fontSize: 15, color: muted, lineHeight: 1.65, margin: 0, paddingBottom: 22 }}>{faq.a}</p>
                </div>
              </div>
            );
          })}
          <div style={{ borderTop: `1px solid ${C.border}` }} />
        </div>
      </div>
    </section>
  );
}


/* ================================================================== */
/* SECTION 9 — FINAL CTA                                               */
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
          Your income already has a structure.{m ? " " : <br />}Now you can see it clearly.
        </h2>
        <p style={{ fontSize: 16, color: "rgba(244,241,234,0.45)", lineHeight: 1.65, marginBottom: 8, ...fadeIn(visible, 60) }}>Start with the free score.</p>
        <p style={{ fontSize: 16, color: "rgba(244,241,234,0.45)", lineHeight: 1.65, marginBottom: 40, ...fadeIn(visible, 100) }}>Unlock the diagnostic when you&#8217;re ready to act.</p>
        <div style={{ ...fadeIn(visible, 180) }}>
          <Link href="/begin" style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", height: 56, padding: "0 48px", borderRadius: 12, backgroundColor: C.white, color: C.navy, fontSize: 17, fontWeight: 600, textDecoration: "none", transition: "background-color 200ms, box-shadow 200ms", boxShadow: "0 2px 16px rgba(244,241,234,0.10)" }}
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
/* PAGE EXPORT                                                         */
/* ================================================================== */

export default function PricingPage() {
  return (
    <div className="overflow-x-hidden">
      <main>
        <HeroSection />
        <ValueFrame />
        <PricingCards />
        <WhyUpgrade />
        <ReportBreakdown />
        <TransformationProof />
        <TrustBlock />
        <FaqSection />
        <FinalCta />
      </main>
    </div>
  );
}
