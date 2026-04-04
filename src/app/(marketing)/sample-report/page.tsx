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
    reduced ? {} : { opacity: visible ? 1 : 0, transform: visible ? "translateY(0)" : "translateY(8px)", transition: `opacity 400ms ease-out ${delay}ms, transform 400ms ease-out ${delay}ms` };
}

/* ================================================================== */
/* DESIGN SYSTEM (LOCKED)                                              */
/* ================================================================== */

const C = { navy: "#0E1A2B", purple: "#4B3FAE", teal: "#1F6D7A", sand: "#F4F1EA", white: "#FFFFFF", border: "#E5E7EB" };
const mono = '"SF Mono", "Fira Code", "IBM Plex Mono", "Courier New", monospace';
const muted = "rgba(14,26,43,0.55)";
const light = "rgba(14,26,43,0.38)";
const contentW = 1040;
const secPad = (m: boolean) => m ? 48 : 96;
const px = (m: boolean) => m ? 20 : 24;


/* ================================================================== */
/* SECTION 1 — HERO                                                    */
/* ================================================================== */

function HeroSection() {
  const { ref, visible } = useInView();
  const m = useMobile();
  const fadeIn = useFadeIn();

  return (
    <header ref={ref} style={{ backgroundColor: C.navy, paddingTop: m ? 80 : 120, paddingBottom: m ? 48 : 80, paddingLeft: px(m), paddingRight: px(m) }}>
      <div style={{ maxWidth: 720, margin: "0 auto", textAlign: "center" }}>
        <h1 style={{ fontSize: m ? 32 : 48, fontWeight: 600, lineHeight: 1.15, letterSpacing: "-0.02em", color: C.sand, marginBottom: 20, ...fadeIn(visible) }}>
          See exactly what&#8217;s holding your income together — and what would break it first.
        </h1>
        <p style={{ fontSize: 16, color: "rgba(244,241,234,0.55)", lineHeight: 1.65, marginBottom: 12, ...fadeIn(visible, 80) }}>
          Four pages. Generated from your structure. Not a template. The same inputs always produce the same result.
        </p>
        <p style={{ fontSize: 14, color: "rgba(244,241,234,0.35)", ...fadeIn(visible, 140) }}>
          Example report (Score: 72 — Established Stability)
        </p>
      </div>
    </header>
  );
}


/* ================================================================== */
/* SECTION 2 — EXAMPLE REPORT                                          */
/* ================================================================== */

function ExampleReport() {
  const { ref, visible } = useInView();
  const m = useMobile();
  const fadeIn = useFadeIn();

  return (
    <section ref={ref} style={{ backgroundColor: C.white, paddingTop: secPad(m), paddingBottom: secPad(m), paddingLeft: px(m), paddingRight: px(m) }}>
      <div style={{ maxWidth: contentW, margin: "0 auto" }}>
        <h2 style={{ fontSize: m ? 28 : 32, fontWeight: 600, lineHeight: 1.2, color: C.navy, marginBottom: 12, ...fadeIn(visible) }}>The report</h2>
        <p style={{ fontSize: 16, color: muted, lineHeight: 1.65, marginBottom: m ? 40 : 56, maxWidth: 560, ...fadeIn(visible, 60) }}>
          Four pages generated from your structural inputs. Each section reflects how your income is actually built.
        </p>

        <div style={{ display: "flex", flexDirection: "column" as const, gap: m ? 32 : 48 }}>

          {/* PAGE 01 — Cover & Score */}
          <div style={{ ...fadeIn(visible, 100) }}>
            <div style={{ fontSize: 11, fontWeight: 500, letterSpacing: "0.10em", textTransform: "uppercase" as const, color: C.teal, marginBottom: 16 }}>Page 01</div>
            <div style={{ backgroundColor: C.navy, borderRadius: 12, padding: m ? 28 : 40, textAlign: "center" }}>
              <div style={{ fontSize: 11, fontWeight: 500, letterSpacing: "0.10em", textTransform: "uppercase" as const, color: "rgba(244,241,234,0.40)", marginBottom: 24 }}>
                Income Stability Score&#8482;
              </div>
              <div style={{ fontSize: m ? 56 : 72, fontWeight: 300, fontFamily: mono, color: C.sand, lineHeight: 1 }}>72</div>
              <div style={{ fontFamily: mono, fontSize: 14, color: "rgba(244,241,234,0.30)", marginTop: 4, marginBottom: 16 }}>/100</div>
              <div style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "4px 14px", borderRadius: 100, backgroundColor: "rgba(43,94,167,0.12)", marginBottom: 16 }}>
                <div style={{ width: 6, height: 6, borderRadius: "50%", backgroundColor: "#2B5EA7" }} />
                <span style={{ fontSize: 12, fontWeight: 600, color: "#2B5EA7" }}>Established Stability</span>
              </div>
              <div style={{ fontSize: 14, color: "rgba(244,241,234,0.40)" }}>3 points to High Stability</div>
            </div>
            <p style={{ fontSize: 14, color: light, marginTop: 16, lineHeight: 1.6 }}>
              Your score, stability band, distance to the next band, and your Command Center access code.
            </p>
          </div>

          {/* PAGE 02 — Key Findings */}
          <div style={{ ...fadeIn(visible, 160) }}>
            <div style={{ fontSize: 11, fontWeight: 500, letterSpacing: "0.10em", textTransform: "uppercase" as const, color: C.teal, marginBottom: 16 }}>Page 02 — Key Findings</div>
            <div style={{ backgroundColor: C.white, borderRadius: 12, padding: m ? 24 : 32, border: `1px solid ${C.border}` }}>
              {/* Key Takeaway */}
              <div style={{ padding: "16px 20px", borderRadius: 8, borderLeft: `3px solid ${C.purple}`, backgroundColor: "rgba(75,63,174,0.03)", marginBottom: 24 }}>
                <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: "0.08em", color: C.purple, marginBottom: 6, textTransform: "uppercase" as const }}>Key Takeaway</div>
                <p style={{ fontSize: 16, fontWeight: 500, color: C.navy, margin: 0, lineHeight: 1.55 }}>
                  Your structure is stable — but one client puts most of it at risk.
                </p>
              </div>

              {/* Income Structure */}
              <div style={{ marginBottom: 24 }}>
                <div style={{ fontSize: 13, fontWeight: 600, color: C.navy, marginBottom: 12 }}>Income Structure</div>
                <div style={{ display: "flex", height: 8, borderRadius: 4, overflow: "hidden", marginBottom: 10 }}>
                  <div style={{ width: "55%", backgroundColor: "rgba(155,44,44,0.25)" }} />
                  <div style={{ width: "20%", backgroundColor: "rgba(146,100,10,0.25)", borderLeft: `2px solid ${C.white}` }} />
                  <div style={{ width: "25%", backgroundColor: "rgba(31,109,122,0.30)", borderLeft: `2px solid ${C.white}` }} />
                </div>
                <div style={{ display: "flex", gap: 20, fontSize: 13, color: muted }}>
                  <span>Active: <strong style={{ color: C.navy }}>55%</strong></span>
                  <span>Semi-persistent: <strong style={{ color: C.navy }}>20%</strong></span>
                  <span>Persistent: <strong style={{ color: C.navy }}>25%</strong></span>
                </div>
              </div>

              {/* Strength + Risk */}
              <div style={{ display: m ? "block" : "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                <div style={{ padding: "14px 18px", borderRadius: 8, border: `1px solid ${C.border}`, marginBottom: m ? 12 : 0 }}>
                  <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: "0.08em", color: C.teal, marginBottom: 6, textTransform: "uppercase" as const }}>Strength</div>
                  <p style={{ fontSize: 14, color: C.navy, margin: 0, lineHeight: 1.55 }}>Low variability — earnings are consistent month to month.</p>
                </div>
                <div style={{ padding: "14px 18px", borderRadius: 8, border: `1px solid ${C.border}` }}>
                  <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: "0.08em", color: "#C0392B", marginBottom: 6, textTransform: "uppercase" as const }}>Risk</div>
                  <p style={{ fontSize: 14, color: C.navy, margin: 0, lineHeight: 1.55 }}>High concentration — one source carries most of the structure.</p>
                </div>
              </div>
            </div>
            <p style={{ fontSize: 14, color: light, marginTop: 16, lineHeight: 1.6 }}>
              Plain-English explanation of your structure, including strengths, risks, and the constraint limiting your score.
            </p>
          </div>

          {/* PAGE 03 — Stability Plan */}
          <div style={{ ...fadeIn(visible, 220) }}>
            <div style={{ fontSize: 11, fontWeight: 500, letterSpacing: "0.10em", textTransform: "uppercase" as const, color: C.teal, marginBottom: 16 }}>Page 03 — Stability Plan</div>
            <div style={{ backgroundColor: C.white, borderRadius: 12, padding: m ? 24 : 32, border: `1px solid ${C.border}` }}>
              <div style={{ fontSize: 16, fontWeight: 600, color: C.navy, marginBottom: 20 }}>Ranked by impact. Ordered for execution.</div>
              <div style={{ display: "flex", flexDirection: "column" as const, gap: 10, marginBottom: 20 }}>
                {[
                  { action: "Reduce concentration", priority: "High", color: "#C0392B" },
                  { action: "Extend forward visibility", priority: "High", color: "#C0392B" },
                  { action: "Add recurring revenue stream", priority: "Medium", color: "#B58900" },
                ].map((a, i) => (
                  <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px 16px", borderRadius: 8, border: `1px solid ${C.border}` }}>
                    <span style={{ fontSize: 15, color: C.navy }}>{a.action}</span>
                    <span style={{ fontSize: 12, fontWeight: 600, color: a.color }}>{a.priority}</span>
                  </div>
                ))}
              </div>
              <div style={{ display: m ? "block" : "flex", gap: 16 }}>
                <div style={{ flex: 1, padding: "12px 16px", borderRadius: 8, backgroundColor: "#FAFAFA", marginBottom: m ? 10 : 0 }}>
                  <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: "0.08em", color: light, marginBottom: 4, textTransform: "uppercase" as const }}>Projected Improvement</div>
                  <div style={{ fontSize: 15, fontWeight: 600, color: C.teal }}>Significant</div>
                </div>
                <div style={{ flex: 1, padding: "12px 16px", borderRadius: 8, backgroundColor: "#FAFAFA" }}>
                  <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: "0.08em", color: light, marginBottom: 4, textTransform: "uppercase" as const }}>Command Center Access</div>
                  <div style={{ fontSize: 13, color: C.navy }}>PressureMap&#8482; &middot; Simulator &middot; 12-week roadmap</div>
                </div>
              </div>
            </div>
            <p style={{ fontSize: 14, color: light, marginTop: 16, lineHeight: 1.6 }}>
              Your highest-leverage actions, ranked by how much they move your score. Includes a 30-day execution path.
            </p>
          </div>

          {/* PAGE 04 — Stress Testing */}
          <div style={{ ...fadeIn(visible, 280) }}>
            <div style={{ fontSize: 11, fontWeight: 500, letterSpacing: "0.10em", textTransform: "uppercase" as const, color: C.teal, marginBottom: 16 }}>Page 04 — Stress Testing</div>
            <div style={{ backgroundColor: C.white, borderRadius: 12, padding: m ? 24 : 32, border: `1px solid ${C.border}` }}>
              <div style={{ fontSize: 16, fontWeight: 600, color: C.navy, marginBottom: 20 }}>What breaks your structure — and how fast</div>
              <div style={{ display: "flex", flexDirection: "column" as const, gap: 10 }}>
                {[
                  { scenario: "Your largest client stops paying", severity: "Severe", color: "#C0392B" },
                  { scenario: "You cannot work for 90 days", severity: "Moderate", color: "#B58900" },
                  { scenario: "Forward commitments delayed", severity: "Moderate", color: "#B58900" },
                ].map((s, i) => (
                  <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "14px 16px", borderRadius: 8, border: `1px solid ${C.border}` }}>
                    <span style={{ fontSize: 15, color: C.navy }}>{s.scenario}</span>
                    <span style={{ fontSize: 12, fontWeight: 600, color: s.color }}>{s.severity}</span>
                  </div>
                ))}
              </div>
            </div>
            <p style={{ fontSize: 14, color: light, marginTop: 16, lineHeight: 1.6 }}>
              Real-world disruption scenarios ranked by impact, including exact score drops and structural fragility.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}


/* ================================================================== */
/* SECTION 4 — COMMAND CENTER                                          */
/* ================================================================== */

function CommandCenterSection() {
  const { ref, visible } = useInView();
  const m = useMobile();
  const fadeIn = useFadeIn();

  return (
    <section ref={ref} style={{ backgroundColor: C.navy, paddingTop: secPad(m), paddingBottom: secPad(m), paddingLeft: px(m), paddingRight: px(m) }}>
      <div style={{ maxWidth: contentW, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: m ? 32 : 48, ...fadeIn(visible) }}>
          <h2 style={{ fontSize: m ? 28 : 32, fontWeight: 600, lineHeight: 1.2, color: C.sand, marginBottom: 12 }}>
            This is where your structure changes — not just your score.
          </h2>
          <p style={{ fontSize: 16, color: "rgba(244,241,234,0.55)", lineHeight: 1.65 }}>
            Every tool runs on your actual structure — not estimates.
          </p>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: m ? "1fr" : "1fr 1fr", gap: 14, maxWidth: 860, margin: "0 auto", ...fadeIn(visible, 120) }}>
          {[
            { label: "PressureMap\u2122", desc: "Structural exposure by zone." },
            { label: "What-If Simulator", desc: "Test changes and see score impact." },
            { label: "12-Week Roadmap", desc: "Execution sequence based on your structure." },
            { label: "Industry Benchmarks", desc: "Your position relative to peers." },
          ].map((mod, i) => (
            <div key={i} style={{ padding: m ? 20 : 24, borderRadius: 12, backgroundColor: "rgba(244,241,234,0.04)", border: "1px solid rgba(244,241,234,0.06)" }}>
              <div style={{ fontSize: 16, fontWeight: 600, color: C.sand, marginBottom: 6 }}>{mod.label}</div>
              <p style={{ fontSize: 14, color: "rgba(244,241,234,0.45)", lineHeight: 1.55, margin: 0 }}>{mod.desc}</p>
            </div>
          ))}
        </div>
        <p style={{ fontSize: 13, color: "rgba(244,241,234,0.30)", textAlign: "center", marginTop: m ? 24 : 32, ...fadeIn(visible, 200) }}>Lifetime access included</p>
      </div>
    </section>
  );
}


/* ================================================================== */
/* SECTION 5 — WHY PEOPLE BUY                                          */
/* ================================================================== */

function WhyPeopleBuy() {
  const { ref, visible } = useInView();
  const m = useMobile();
  const fadeIn = useFadeIn();

  return (
    <section ref={ref} style={{ backgroundColor: C.sand, paddingTop: secPad(m), paddingBottom: secPad(m), paddingLeft: px(m), paddingRight: px(m) }}>
      <div style={{ maxWidth: 700, margin: "0 auto" }}>
        <h2 style={{ fontSize: m ? 28 : 32, fontWeight: 600, lineHeight: 1.2, color: C.navy, marginBottom: 20, ...fadeIn(visible) }}>
          Why people buy the report
        </h2>
        <p style={{ fontSize: 16, color: muted, lineHeight: 1.65, marginBottom: 20, ...fadeIn(visible, 80) }}>
          The score shows the number.
        </p>
        <p style={{ fontSize: 16, color: muted, lineHeight: 1.65, marginBottom: 8, ...fadeIn(visible, 120) }}>The report shows:</p>
        <div style={{ marginBottom: 24, ...fadeIn(visible, 160) }}>
          {["what\u2019s fragile", "what breaks first", "what to fix first"].map((item, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
              <span style={{ width: 5, height: 5, borderRadius: "50%", backgroundColor: C.teal, flexShrink: 0 }} />
              <span style={{ fontSize: 16, fontWeight: 500, color: C.navy }}>{item}</span>
            </div>
          ))}
        </div>
        <div style={{ ...fadeIn(visible, 200) }}>
          <p style={{ fontSize: 16, color: light, marginBottom: 4 }}>Without it, you&#8217;re guessing.</p>
          <p style={{ fontSize: 16, fontWeight: 500, color: C.navy }}>With it, you&#8217;re acting on structure.</p>
        </div>
      </div>
    </section>
  );
}


/* ================================================================== */
/* SECTION 6 — FINAL CTA                                               */
/* ================================================================== */

function FinalCta() {
  const { ref, visible } = useInView();
  const m = useMobile();
  const fadeIn = useFadeIn();

  return (
    <section ref={ref} style={{ backgroundColor: C.navy, paddingTop: m ? 64 : 96, paddingBottom: m ? 64 : 96, paddingLeft: px(m), paddingRight: px(m) }}>
      <div style={{ maxWidth: 700, margin: "0 auto", textAlign: "center" }}>
        <h2 style={{ fontSize: m ? 28 : 32, fontWeight: 600, lineHeight: 1.2, color: C.sand, marginBottom: 20, ...fadeIn(visible) }}>
          Your structure is already there.{m ? " " : <br />}This shows it clearly.
        </h2>
        <p style={{ fontSize: 16, color: "rgba(244,241,234,0.55)", lineHeight: 1.65, marginBottom: 8, ...fadeIn(visible, 60) }}>
          Your report will look like this — but every number will be yours.
        </p>
        <p style={{ fontSize: 16, color: "rgba(244,241,234,0.50)", lineHeight: 1.65, marginBottom: 8, ...fadeIn(visible, 100) }}>
          Start with the free score.
        </p>
        <p style={{ fontSize: 16, color: "rgba(244,241,234,0.50)", lineHeight: 1.65, marginBottom: 32, ...fadeIn(visible, 130) }}>
          Unlock the full diagnostic when you&#8217;re ready to act.
        </p>
        <div style={{ ...fadeIn(visible, 180) }}>
          <Link href="/pricing" style={{
            display: "inline-flex", alignItems: "center", justifyContent: "center",
            height: 52, padding: "0 40px", borderRadius: 10,
            backgroundColor: C.white, color: C.navy,
            fontSize: 16, fontWeight: 600, textDecoration: "none",
            transition: "background-color 200ms",
          }}
            onMouseEnter={e => { e.currentTarget.style.backgroundColor = "#E8E5DE"; }}
            onMouseLeave={e => { e.currentTarget.style.backgroundColor = C.white; }}>
            Start Your Free Assessment
          </Link>
          <p style={{ fontSize: 13, color: "rgba(244,241,234,0.38)", marginTop: 14 }}>
            Under 2 minutes &bull; Instant result &bull; $69 for full report
          </p>
        </div>
      </div>
    </section>
  );
}


/* ================================================================== */
/* PAGE EXPORT                                                         */
/* ================================================================== */

export default function SampleReportPage() {
  return (
    <div className="overflow-x-hidden">
      <main>
        <HeroSection />
        <ExampleReport />
        <CommandCenterSection />
        <WhyPeopleBuy />
        <FinalCta />
      </main>
    </div>
  );
}
