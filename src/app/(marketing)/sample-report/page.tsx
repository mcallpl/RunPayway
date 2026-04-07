"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";

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
  textPrimary: "#131A22",
  textSecondary: "#5E6873",
  textMuted: "#7B848E",
  borderSoft: "#D9D6CF",
  risk: "#C74634",
  moderate: "#D0A23A",
  green: "#2A6E49",
  sandText: "#F4F1EA",
  sandMuted: "rgba(244,241,234,0.55)",
  sandLight: "rgba(244,241,234,0.40)",
};

const mono = '"SF Mono", "Fira Code", "IBM Plex Mono", "Courier New", monospace';
const innerW = 1120;
const narrowW = 720;
const explanatoryW = 640;
const sectionPx = (m: boolean) => m ? 20 : 48;
const cardShadow = "0 10px 30px rgba(14,26,43,0.06)";


/* ================================================================ */
/* SECTION 1 — HERO                                                  */
/* ================================================================ */

function HeroSection() {
  const { ref, visible } = useInView();
  const m = useMobile();
  const fadeIn = useFadeIn();

  return (
    <header ref={ref} style={{ backgroundColor: C.sand, paddingTop: m ? 104 : 152, paddingBottom: m ? 56 : 88, paddingLeft: sectionPx(m), paddingRight: sectionPx(m) }}>
      <div style={{ maxWidth: narrowW, margin: "0 auto", textAlign: "center" }}>
        <div style={{ fontSize: m ? 13 : 14, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase" as const, color: C.teal, marginBottom: 16, ...fadeIn(visible) }}>
          SAMPLE REPORT
        </div>
        <h1 style={{ fontSize: m ? 38 : 56, fontWeight: 700, lineHeight: 1.02, letterSpacing: "-0.035em", color: C.navy, marginBottom: 24, ...fadeIn(visible, 50) }}>
          See what the system reveals —{m ? " " : <br />}before you access it.
        </h1>
        <p style={{ fontSize: m ? 18 : 20, fontWeight: 400, lineHeight: 1.55, color: C.textSecondary, maxWidth: 560, margin: "0 auto 16px", ...fadeIn(visible, 100) }}>
          A four-page structural read of your income.{m ? " " : <br />}Generated from your inputs. No estimates. No interpretation.
        </p>
        <p style={{ fontSize: 16, fontWeight: 600, color: C.navy, marginBottom: 0, ...fadeIn(visible, 140) }}>
          Same inputs. Same result. Every time.
        </p>
      </div>
    </header>
  );
}


/* ================================================================ */
/* SECTION 2 — DECLARATION                                           */
/* ================================================================ */

function Declaration() {
  const { ref, visible } = useInView();
  const m = useMobile();
  const fadeIn = useFadeIn();

  return (
    <section ref={ref} style={{ backgroundColor: C.white, paddingTop: m ? 72 : 120, paddingBottom: m ? 72 : 120, paddingLeft: sectionPx(m), paddingRight: sectionPx(m) }}>
      <div style={{ maxWidth: narrowW, margin: "0 auto" }}>
        <h2 style={{ fontSize: m ? 28 : 40, fontWeight: 600, lineHeight: 1.08, letterSpacing: "-0.028em", color: C.navy, textAlign: "center", marginBottom: 24, ...fadeIn(visible) }}>
          This is not a template. It is a reading.
        </h2>
        <p style={{ fontSize: 18, fontWeight: 400, lineHeight: 1.6, color: C.textSecondary, textAlign: "center", marginBottom: 32, ...fadeIn(visible, 80) }}>
          Every report is generated from your inputs using fixed rules.
        </p>
        <div style={{ display: "flex", flexDirection: "column" as const, gap: 12, maxWidth: 420, margin: "0 auto 32px", ...fadeIn(visible, 140) }}>
          {[
            "Nothing is generalized.",
            "Nothing is guessed.",
            "Nothing is adjusted after the fact.",
          ].map((line, i) => (
            <div key={i} style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
              <div style={{ width: 6, height: 6, borderRadius: "50%", backgroundColor: C.teal, flexShrink: 0, marginTop: 9 }} />
              <span style={{ fontSize: 18, color: C.textSecondary, lineHeight: 1.6 }}>{line}</span>
            </div>
          ))}
        </div>
        <p style={{ fontSize: 16, fontWeight: 600, color: C.navy, textAlign: "center", ...fadeIn(visible, 200) }}>
          What you see here is exactly how the system behaves.
        </p>
      </div>
    </section>
  );
}


/* ================================================================ */
/* SECTION 3 — STRUCTURE OVERVIEW                                    */
/* ================================================================ */

function StructureOverview() {
  const { ref, visible } = useInView();
  const m = useMobile();
  const fadeIn = useFadeIn();

  return (
    <section ref={ref} style={{ backgroundColor: C.sand, paddingTop: m ? 72 : 120, paddingBottom: m ? 48 : 80, paddingLeft: sectionPx(m), paddingRight: sectionPx(m) }}>
      <div style={{ maxWidth: narrowW, margin: "0 auto", textAlign: "center" }}>
        <h2 style={{ fontSize: m ? 28 : 40, fontWeight: 600, lineHeight: 1.08, letterSpacing: "-0.028em", color: C.navy, marginBottom: 24, ...fadeIn(visible) }}>
          Four pages. Each one shows{m ? " " : <br />}something specific.
        </h2>
      </div>
    </section>
  );
}


/* ================================================================ */
/* PAGE 01 — COVER & SCORE                                           */
/* ================================================================ */

function Page01() {
  const { ref, visible } = useInView();
  const m = useMobile();
  const fadeIn = useFadeIn();

  return (
    <section ref={ref} style={{ backgroundColor: C.sand, paddingTop: 0, paddingBottom: m ? 64 : 80, paddingLeft: sectionPx(m), paddingRight: sectionPx(m) }}>
      <div style={{ maxWidth: 780, margin: "0 auto", ...fadeIn(visible) }}>
        <div style={{ fontSize: 12, fontWeight: 700, letterSpacing: "0.12em", color: C.textMuted, marginBottom: 16 }}>PAGE 01</div>

        {/* Report card */}
        <div style={{ backgroundColor: C.white, borderRadius: 20, padding: m ? 28 : 40, boxShadow: cardShadow, overflow: "hidden" }}>
          {/* Header bar */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingBottom: 20, borderBottom: `1px solid rgba(14,26,43,0.08)`, marginBottom: 32 }}>
            <span style={{ fontSize: 14, fontWeight: 600, color: C.navy }}>RunPayway&#8482;</span>
            <span style={{ fontSize: 12, fontWeight: 400, color: C.textMuted }}>2026-03-15 &bull; RP-7X2K</span>
          </div>

          <div style={{ fontSize: m ? 22 : 28, fontWeight: 600, color: C.navy, marginBottom: 8 }}>Structural Income Report</div>
          <p style={{ fontSize: 14, color: C.textMuted, marginBottom: 32 }}>Measured under a fixed system. No variation.</p>

          {/* Score module */}
          <div style={{ backgroundColor: C.sand, borderRadius: 20, padding: m ? 24 : 32, marginBottom: 24 }}>
            <div style={{ display: m ? "block" : "flex", alignItems: "center", gap: 40 }}>
              {/* Score */}
              <div style={{ textAlign: m ? "center" : "left", marginBottom: m ? 24 : 0, flexShrink: 0 }}>
                <div style={{ display: "flex", alignItems: "baseline", justifyContent: m ? "center" : "flex-start", gap: 4 }}>
                  <span style={{ fontSize: m ? 64 : 80, fontWeight: 700, fontFamily: mono, color: C.navy, lineHeight: 1, letterSpacing: "-0.04em" }}>72</span>
                  <span style={{ fontSize: 18, fontWeight: 400, color: C.textMuted }}>/100</span>
                </div>
                <div style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "4px 12px", borderRadius: 100, backgroundColor: `${C.teal}10`, marginTop: 8 }}>
                  <div style={{ width: 6, height: 6, borderRadius: 3, backgroundColor: C.teal }} />
                  <span style={{ fontSize: 13, fontWeight: 600, color: C.teal }}>Established Stability</span>
                </div>
              </div>

              {/* Scale bar + meta */}
              <div style={{ flex: 1 }}>
                {/* Scale bar */}
                <div style={{ marginBottom: 20 }}>
                  <div style={{ position: "relative", height: 10, borderRadius: 999, overflow: "hidden", backgroundColor: "rgba(14,26,43,0.04)" }}>
                    <div style={{ position: "absolute", inset: 0, borderRadius: 999, background: `linear-gradient(90deg, ${C.risk}40, ${C.moderate}40, ${C.teal}40, ${C.green}40)` }} />
                    <div style={{ position: "absolute", left: "72%", top: -2, width: 3, height: 14, borderRadius: 2, backgroundColor: C.navy, transform: "translateX(-50%)" }} />
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", marginTop: 4 }}>
                    {["0", "40", "60", "80", "100"].map((t, i) => (
                      <span key={i} style={{ fontSize: 10, fontWeight: 400, color: C.textMuted }}>{t}</span>
                    ))}
                  </div>
                </div>

                {/* Meta grid */}
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                  {[
                    { label: "STABILITY BAND", value: "Established" },
                    { label: "DISTANCE TO NEXT", value: "3 pts" },
                    { label: "STRUCTURAL TYPE", value: "Uneven" },
                    { label: "ACCESS CODE", value: "RP-7X2K" },
                  ].map((item, i) => (
                    <div key={i}>
                      <div style={{ fontSize: 10, fontWeight: 600, letterSpacing: "0.12em", color: C.textMuted, marginBottom: 2 }}>{item.label}</div>
                      <div style={{ fontSize: 14, fontWeight: 600, color: C.navy }}>{item.value}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <p style={{ fontSize: 13, color: C.textMuted, textAlign: "center", margin: 0 }}>Same inputs produce the same result.</p>
        </div>
      </div>
    </section>
  );
}


/* ================================================================ */
/* PAGE 02 — KEY FINDINGS                                            */
/* ================================================================ */

function Page02() {
  const { ref, visible } = useInView();
  const m = useMobile();
  const fadeIn = useFadeIn();

  return (
    <section ref={ref} style={{ backgroundColor: C.white, paddingTop: m ? 64 : 80, paddingBottom: m ? 64 : 80, paddingLeft: sectionPx(m), paddingRight: sectionPx(m) }}>
      <div style={{ maxWidth: 780, margin: "0 auto", ...fadeIn(visible) }}>
        <div style={{ fontSize: 12, fontWeight: 700, letterSpacing: "0.12em", color: C.textMuted, marginBottom: 16 }}>PAGE 02</div>

        <div style={{ backgroundColor: C.sand, borderRadius: 20, padding: m ? 28 : 40, boxShadow: cardShadow }}>
          <div style={{ fontSize: m ? 20 : 24, fontWeight: 600, color: C.navy, marginBottom: 24 }}>Key structural findings</div>

          {/* Key takeaway */}
          <div style={{ borderLeft: `4px solid ${C.teal}`, padding: "16px 20px", borderRadius: "0 12px 12px 0", backgroundColor: C.white, marginBottom: 32 }}>
            <p style={{ fontSize: m ? 16 : 18, fontWeight: 600, color: C.navy, margin: 0, lineHeight: 1.45 }}>
              Your income is stable — but one source carries most of the risk.
            </p>
          </div>

          {/* Structure breakdown */}
          <div style={{ marginBottom: 32 }}>
            <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: "0.12em", color: C.textMuted, marginBottom: 12 }}>HOW YOUR INCOME BEHAVES</div>
            <div style={{ display: "flex", height: 14, borderRadius: 7, overflow: "hidden", marginBottom: 12 }}>
              <div style={{ width: "55%", backgroundColor: `${C.risk}40` }} />
              <div style={{ width: "20%", backgroundColor: `${C.moderate}40`, borderLeft: `2px solid ${C.sand}` }} />
              <div style={{ width: "25%", backgroundColor: `${C.teal}40`, borderLeft: `2px solid ${C.sand}` }} />
            </div>
            <div style={{ display: "flex", gap: 16, flexWrap: "wrap" as const }}>
              {[
                { label: "Stops if you stop", value: "55%", color: C.risk },
                { label: "Continues temporarily", value: "20%", color: C.moderate },
                { label: "Protected", value: "25%", color: C.teal },
              ].map((s, i) => (
                <div key={i} style={{ display: "flex", alignItems: "center", gap: 6 }}>
                  <div style={{ width: 6, height: 6, borderRadius: 2, backgroundColor: s.color }} />
                  <span style={{ fontSize: 13, color: C.textSecondary }}>{s.label}: <strong style={{ fontFamily: mono, fontWeight: 600, color: C.navy }}>{s.value}</strong></span>
                </div>
              ))}
            </div>
          </div>

          {/* Strength + Constraint */}
          <div style={{ display: m ? "block" : "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 24 }}>
            <div style={{ padding: "16px 20px", borderRadius: 12, backgroundColor: C.white, marginBottom: m ? 12 : 0 }}>
              <div style={{ fontSize: 10, fontWeight: 600, letterSpacing: "0.12em", color: C.teal, marginBottom: 6 }}>STRONGEST</div>
              <p style={{ fontSize: 14, color: C.navy, margin: 0, lineHeight: 1.5 }}>Income remains steady month to month</p>
            </div>
            <div style={{ padding: "16px 20px", borderRadius: 12, backgroundColor: C.white }}>
              <div style={{ fontSize: 10, fontWeight: 600, letterSpacing: "0.12em", color: C.risk, marginBottom: 6 }}>PRIMARY CONSTRAINT</div>
              <p style={{ fontSize: 14, color: C.navy, margin: 0, lineHeight: 1.5 }}>Too much reliance on a single source</p>
            </div>
          </div>

          <p style={{ fontSize: 14, fontWeight: 600, color: C.navy, margin: 0, textAlign: "center" }}>This is what defines your score.</p>
        </div>
      </div>
    </section>
  );
}


/* ================================================================ */
/* PAGE 03 — STABILITY PLAN                                          */
/* ================================================================ */

function Page03() {
  const { ref, visible } = useInView();
  const m = useMobile();
  const fadeIn = useFadeIn();

  return (
    <section ref={ref} style={{ backgroundColor: C.sand, paddingTop: m ? 64 : 80, paddingBottom: m ? 64 : 80, paddingLeft: sectionPx(m), paddingRight: sectionPx(m) }}>
      <div style={{ maxWidth: 780, margin: "0 auto", ...fadeIn(visible) }}>
        <div style={{ fontSize: 12, fontWeight: 700, letterSpacing: "0.12em", color: C.textMuted, marginBottom: 16 }}>PAGE 03</div>

        <div style={{ backgroundColor: C.white, borderRadius: 20, padding: m ? 28 : 40, boxShadow: cardShadow }}>
          <div style={{ fontSize: m ? 20 : 24, fontWeight: 600, color: C.navy, marginBottom: 8 }}>What moves your score</div>
          <p style={{ fontSize: 14, color: C.textSecondary, marginBottom: 28 }}>Targeted actions based on your current structure.</p>

          {/* Action list */}
          {[
            { num: 1, action: "Spread income sources", desc: "Reduce reliance on a single source", lift: "+11", priority: "High", color: C.risk },
            { num: 2, action: "Extend income visibility", desc: "Secure commitments further ahead", lift: "+8", priority: "High", color: C.risk },
            { num: 3, action: "Introduce recurring income", desc: "Convert one-time work into repeating income", lift: "+5", priority: "Medium", color: C.moderate },
          ].map((a, i) => (
            <div key={i} style={{ display: "flex", gap: 16, alignItems: "flex-start", padding: "16px 0", borderBottom: i < 2 ? `1px solid rgba(14,26,43,0.06)` : "none" }}>
              <span style={{ fontSize: 24, fontWeight: 700, color: "rgba(14,26,43,0.10)", flexShrink: 0, lineHeight: 1, width: 28 }}>{a.num}</span>
              <div style={{ flex: 1 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 4 }}>
                  <span style={{ fontSize: 16, fontWeight: 600, color: C.navy }}>{a.action}</span>
                  <span style={{ fontSize: 15, fontWeight: 700, fontFamily: mono, color: C.teal, flexShrink: 0, marginLeft: 12 }}>{a.lift}</span>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <span style={{ fontSize: 13, color: C.textSecondary }}>{a.desc}</span>
                  <span style={{ fontSize: 10, fontWeight: 600, letterSpacing: "0.04em", color: a.color, padding: "2px 8px", borderRadius: 4, backgroundColor: `${a.color}08`, flexShrink: 0 }}>{a.priority}</span>
                </div>
              </div>
            </div>
          ))}

          {/* Impact block */}
          <div style={{ marginTop: 28, padding: m ? 20 : 24, borderRadius: 16, backgroundColor: C.sand, textAlign: "center" }}>
            <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: "0.12em", color: C.textMuted, marginBottom: 12 }}>IF IMPLEMENTED TOGETHER</div>
            <div style={{ display: "flex", alignItems: "baseline", justifyContent: "center", gap: 12 }}>
              <span style={{ fontSize: 28, fontWeight: 700, fontFamily: mono, color: C.textMuted }}>72</span>
              <span style={{ fontSize: 18, color: C.textMuted }}>&rarr;</span>
              <span style={{ fontSize: 40, fontWeight: 700, fontFamily: mono, color: C.teal }}>96</span>
            </div>
          </div>

          <p style={{ fontSize: 13, color: C.textMuted, textAlign: "center", marginTop: 20, marginBottom: 0 }}>
            The model shows what changes your structure — not just what it is.
          </p>
        </div>
      </div>
    </section>
  );
}


/* ================================================================ */
/* PAGE 04 — STRESS TEST                                             */
/* ================================================================ */

function Page04() {
  const { ref, visible } = useInView();
  const m = useMobile();
  const fadeIn = useFadeIn();

  return (
    <section ref={ref} style={{ backgroundColor: C.white, paddingTop: m ? 64 : 80, paddingBottom: m ? 72 : 120, paddingLeft: sectionPx(m), paddingRight: sectionPx(m) }}>
      <div style={{ maxWidth: 780, margin: "0 auto", ...fadeIn(visible) }}>
        <div style={{ fontSize: 12, fontWeight: 700, letterSpacing: "0.12em", color: C.textMuted, marginBottom: 16 }}>PAGE 04</div>

        <div style={{ backgroundColor: C.sand, borderRadius: 20, padding: m ? 28 : 40, boxShadow: cardShadow }}>
          <div style={{ fontSize: m ? 20 : 24, fontWeight: 600, color: C.navy, marginBottom: 8 }}>Stress testing your income</div>
          <p style={{ fontSize: 14, color: C.textSecondary, marginBottom: 28 }}>How your structure responds under real conditions.</p>

          {/* Scenario table */}
          <div style={{ marginBottom: 28 }}>
            {[
              { scenario: "Largest client lost", severity: "Severe", score: 44, delta: -28, color: C.risk },
              { scenario: "Unable to work for 90 days", severity: "Significant", score: 53, delta: -19, color: C.moderate },
              { scenario: "Pipeline delay (3 months)", severity: "Moderate", score: 64, delta: -8, color: C.teal },
            ].map((s, i) => (
              <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "14px 0", borderBottom: i < 2 ? `1px solid rgba(14,26,43,0.06)` : "none" }}>
                <div style={{ flex: 1 }}>
                  <span style={{ fontSize: 15, fontWeight: 400, color: C.navy }}>{s.scenario}</span>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 16, flexShrink: 0 }}>
                  <span style={{ fontSize: 11, fontWeight: 600, letterSpacing: "0.04em", color: s.color, padding: "2px 8px", borderRadius: 4, backgroundColor: `${s.color}08` }}>{s.severity}</span>
                  <div style={{ display: "flex", alignItems: "baseline", gap: 4, minWidth: 60, justifyContent: "flex-end" }}>
                    <span style={{ fontSize: 18, fontWeight: 700, fontFamily: mono, color: s.color }}>{s.score}</span>
                    <span style={{ fontSize: 12, fontWeight: 600, fontFamily: mono, color: s.color }}>{s.delta}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Summary block */}
          <div style={{ padding: m ? 20 : 24, borderRadius: 14, backgroundColor: C.white, border: `1px solid rgba(14,26,43,0.06)` }}>
            <div style={{ fontSize: 15, fontWeight: 600, color: C.navy, marginBottom: 8 }}>Stability type: Uneven</div>
            <p style={{ fontSize: 14, color: C.textSecondary, lineHeight: 1.6, marginBottom: 12 }}>
              Some parts of your income are protected.{m ? " " : <br />}Others depend on a small number of sources.
            </p>
            <div style={{ fontSize: 12, fontWeight: 600, letterSpacing: "0.08em", color: C.risk, marginBottom: 4 }}>KEY VULNERABILITY</div>
            <p style={{ fontSize: 14, color: C.navy, margin: 0 }}>Loss of a primary income source</p>
          </div>

          <p style={{ fontSize: 13, color: C.textMuted, textAlign: "center", marginTop: 20, marginBottom: 0 }}>
            Structure determines outcome under stress.
          </p>
        </div>
      </div>
    </section>
  );
}


/* ================================================================ */
/* SECTION 8 — REFRAME                                               */
/* ================================================================ */

function Reframe() {
  const { ref, visible } = useInView();
  const m = useMobile();
  const fadeIn = useFadeIn();

  return (
    <section ref={ref} style={{ backgroundColor: C.sand, paddingTop: m ? 72 : 120, paddingBottom: m ? 72 : 120, paddingLeft: sectionPx(m), paddingRight: sectionPx(m) }}>
      <div style={{ maxWidth: narrowW, margin: "0 auto", textAlign: "center" }}>
        <h2 style={{ fontSize: m ? 28 : 40, fontWeight: 600, lineHeight: 1.08, letterSpacing: "-0.028em", color: C.navy, marginBottom: 24, ...fadeIn(visible) }}>
          Your report will follow this structure.
        </h2>
        <p style={{ fontSize: 18, fontWeight: 400, lineHeight: 1.6, color: C.textSecondary, marginBottom: 16, ...fadeIn(visible, 80) }}>
          But every number, every outcome, and every recommendation will reflect your actual inputs.
        </p>
        <p style={{ fontSize: 16, fontWeight: 600, color: C.navy, ...fadeIn(visible, 140) }}>
          Nothing is simulated. Everything is derived.
        </p>
      </div>
    </section>
  );
}


/* ================================================================ */
/* SECTION 9 — FINAL CTA                                             */
/* ================================================================ */

function FinalCta() {
  const { ref, visible } = useInView();
  const m = useMobile();
  const fadeIn = useFadeIn();

  return (
    <section ref={ref} style={{ backgroundColor: C.navy, paddingTop: m ? 88 : 128, paddingBottom: m ? 88 : 128, paddingLeft: sectionPx(m), paddingRight: sectionPx(m) }}>
      <div style={{ maxWidth: explanatoryW, margin: "0 auto", textAlign: "center" }}>
        <h2 style={{ fontSize: m ? 34 : 52, fontWeight: 700, lineHeight: 1.02, letterSpacing: "-0.035em", color: C.sandText, marginBottom: 20, ...fadeIn(visible) }}>
          See your own structure.
        </h2>
        <p style={{ fontSize: m ? 20 : 24, fontWeight: 400, lineHeight: 1.45, color: C.sandMuted, marginBottom: 32, ...fadeIn(visible, 80) }}>
          Measure how your income is built—and whether it holds when it matters.
        </p>
        <div style={{ display: "flex", flexDirection: "column" as const, alignItems: "center", ...fadeIn(visible, 160) }}>
          <Link href="/begin" style={{
            display: "inline-flex", alignItems: "center", justifyContent: "center",
            height: m ? 56 : 60, width: m ? "100%" : "auto",
            padding: m ? "0 28px" : "0 32px",
            borderRadius: 14, backgroundColor: C.white, color: C.navy,
            fontSize: 18, fontWeight: 600, textDecoration: "none",
            boxShadow: "0 8px 24px rgba(14,26,43,0.08)",
            border: `1px solid ${C.borderSoft}`,
            transition: "transform 200ms",
          }}
            onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-1px)"; }}
            onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; }}>
            Get Your Structural Income Report
          </Link>
          <p style={{ fontSize: 14, fontWeight: 400, color: C.sandLight, marginTop: 16 }}>
            Under 2 minutes &bull; Instant result &bull; Private by default
          </p>
        </div>
      </div>
    </section>
  );
}


/* ================================================================ */
/* PAGE EXPORT                                                       */
/* ================================================================ */

export default function SampleReportPage() {
  return (
    <div className="overflow-x-hidden">
      <main>
        <HeroSection />
        <Declaration />
        <StructureOverview />
        <Page01 />
        <Page02 />
        <Page03 />
        <Page04 />
        <Reframe />
        <FinalCta />
      </main>
    </div>
  );
}
