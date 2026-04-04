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
const muted = "rgba(14,26,43,0.68)";
const light = "rgba(14,26,43,0.52)";
const contentW = 1040;
const secPad = (m: boolean) => m ? 56 : 112;
const px = (m: boolean) => m ? 20 : 24;

function ScoreRing({ score, size, stroke = 8, color }: { score: number; size: number; stroke?: number; color: string }) {
  const r = (size - stroke) / 2;
  const circ = 2 * Math.PI * r;
  const offset = circ - (score / 100) * circ;
  return (
    <svg width={size} height={size} style={{ transform: "rotate(-90deg)" }}>
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="rgba(244,241,234,0.10)" strokeWidth={stroke} />
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={color} strokeWidth={stroke} strokeDasharray={circ} strokeDashoffset={offset} strokeLinecap="round" style={{ transition: "stroke-dashoffset 1.2s cubic-bezier(0.22, 1, 0.36, 1)" }} />
    </svg>
  );
}


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
      <div style={{ position: "absolute", bottom: "-30%", left: "-15%", width: 500, height: 500, borderRadius: "50%", background: `radial-gradient(circle, ${C.teal}05 0%, transparent 70%)`, pointerEvents: "none" }} />
      <div style={{ maxWidth: 780, margin: "0 auto", textAlign: "center", position: "relative", zIndex: 1 }}>
        <div style={{ fontSize: 11, fontWeight: 500, letterSpacing: "0.14em", textTransform: "uppercase" as const, color: C.teal, marginBottom: 20, ...fadeIn(visible) }}>Sample Report</div>
        <h1 style={{ fontSize: m ? 32 : 48, fontWeight: 600, lineHeight: 1.08, letterSpacing: "-0.03em", color: "#F4F1EA", marginBottom: 24, ...fadeIn(visible, 80) }}>
          See exactly what&#8217;s holding your income together — and what would break it first.
        </h1>
        <p style={{ fontSize: 16, color: "rgba(244,241,234,0.50)", lineHeight: 1.65, marginBottom: 16, ...fadeIn(visible, 160) }}>
          Four pages. Generated from your structure. Not a template. The same inputs always produce the same result.
        </p>
        <p style={{ fontSize: 13, color: "rgba(244,241,234,0.45)", letterSpacing: "0.03em", ...fadeIn(visible, 240) }}>
          Example report &bull; Score: 72 &bull; Established Stability
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
        <div style={{ marginBottom: m ? 40 : 64, ...fadeIn(visible) }}>
          <div style={{ fontSize: 11, fontWeight: 500, letterSpacing: "0.12em", textTransform: "uppercase" as const, color: C.teal, marginBottom: 16 }}>The Report</div>
          <h2 style={{ fontSize: m ? 26 : 36, fontWeight: 600, lineHeight: 1.15, letterSpacing: "-0.02em", color: C.navy, marginBottom: 14 }}>Four pages generated from your structural inputs.</h2>
          <p style={{ fontSize: 16, color: muted, lineHeight: 1.65, maxWidth: 560 }}>Each section reflects how your income is actually built.</p>
        </div>

        <div style={{ display: "flex", flexDirection: "column" as const, gap: m ? 40 : 56 }}>

          {/* PAGE 01 — Cover & Score */}
          <div style={{ ...fadeIn(visible, 100) }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20 }}>
              <div style={{ width: 36, height: 36, borderRadius: 8, backgroundColor: `${C.teal}08`, border: `1px solid ${C.teal}12`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <span style={{ fontSize: 13, fontWeight: 600, fontFamily: mono, color: C.teal }}>01</span>
              </div>
              <span style={{ fontSize: 16, fontWeight: 600, color: C.navy }}>Cover & Score</span>
            </div>
            <div style={{ backgroundColor: C.navy, borderRadius: 16, padding: m ? 36 : 56, textAlign: "center", position: "relative", overflow: "hidden" }}>
              <div style={{ position: "absolute", top: "50%", left: "50%", width: 400, height: 400, transform: "translate(-50%, -50%)", borderRadius: "50%", background: `radial-gradient(circle, ${C.purple}08 0%, transparent 70%)`, pointerEvents: "none" }} />
              <div style={{ position: "relative", zIndex: 1 }}>
                <div style={{ fontSize: 10, fontWeight: 600, letterSpacing: "0.14em", textTransform: "uppercase" as const, color: "rgba(244,241,234,0.50)", marginBottom: 28 }}>Income Stability Score&#8482;</div>
                <div style={{ position: "relative", width: m ? 140 : 170, height: m ? 140 : 170, margin: "0 auto 20px" }}>
                  <ScoreRing score={72} size={m ? 140 : 170} stroke={10} color="#2B5EA7" />
                  <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
                    <span style={{ fontSize: m ? 48 : 56, fontWeight: 300, fontFamily: mono, color: "#F4F1EA", lineHeight: 1, letterSpacing: "-0.04em" }}>72</span>
                    <span style={{ fontSize: 13, color: "rgba(244,241,234,0.45)", marginTop: 2 }}>/100</span>
                  </div>
                </div>
                <div style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "6px 16px", borderRadius: 100, backgroundColor: "rgba(43,94,167,0.12)", border: "1px solid rgba(43,94,167,0.15)", marginBottom: 16 }}>
                  <div style={{ width: 6, height: 6, borderRadius: 2, backgroundColor: "#2B5EA7" }} />
                  <span style={{ fontSize: 12, fontWeight: 600, color: "#2B5EA7", letterSpacing: "0.02em" }}>Established Stability</span>
                </div>
                <div style={{ fontSize: 14, color: "rgba(244,241,234,0.50)" }}>3 points to High Stability</div>
              </div>
            </div>
            <p style={{ fontSize: 14, color: light, marginTop: 20, lineHeight: 1.6 }}>
              Your score, stability band, distance to the next band, and your Command Center access code.
            </p>
          </div>

          {/* PAGE 02 — Key Findings */}
          <div style={{ ...fadeIn(visible, 180) }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20 }}>
              <div style={{ width: 36, height: 36, borderRadius: 8, backgroundColor: `${C.teal}08`, border: `1px solid ${C.teal}12`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <span style={{ fontSize: 13, fontWeight: 600, fontFamily: mono, color: C.teal }}>02</span>
              </div>
              <span style={{ fontSize: 16, fontWeight: 600, color: C.navy }}>Key Findings</span>
            </div>
            <div style={{ backgroundColor: "#FAFAFA", borderRadius: 16, padding: m ? 28 : 36, border: `1px solid ${C.border}` }}>
              {/* Key Takeaway */}
              <div style={{ padding: "20px 24px", borderRadius: 12, borderLeft: `4px solid ${C.purple}`, backgroundColor: C.white, marginBottom: 28, boxShadow: "0 1px 4px rgba(14,26,43,0.03)" }}>
                <div style={{ fontSize: 10, fontWeight: 600, letterSpacing: "0.10em", color: C.purple, marginBottom: 8, textTransform: "uppercase" as const }}>Key Takeaway</div>
                <p style={{ fontSize: 16, fontWeight: 500, color: C.navy, margin: 0, lineHeight: 1.5 }}>
                  Your structure is stable — but one client puts most of it at risk.
                </p>
              </div>

              {/* Income Structure Bar */}
              <div style={{ marginBottom: 28 }}>
                <div style={{ fontSize: 13, fontWeight: 600, color: C.navy, marginBottom: 14 }}>Income Structure</div>
                <div style={{ display: "flex", height: 10, borderRadius: 5, overflow: "hidden", marginBottom: 12 }}>
                  <div style={{ width: "55%", backgroundColor: "rgba(192,57,43,0.20)" }} />
                  <div style={{ width: "20%", backgroundColor: "rgba(181,137,0,0.20)", borderLeft: `2px solid ${C.white}` }} />
                  <div style={{ width: "25%", backgroundColor: "rgba(31,109,122,0.25)", borderLeft: `2px solid ${C.white}` }} />
                </div>
                <div style={{ display: "flex", gap: 24, fontSize: 14, color: muted }}>
                  <span>Active: <strong style={{ color: C.navy, fontFamily: mono }}>55%</strong></span>
                  <span>Semi-persistent: <strong style={{ color: C.navy, fontFamily: mono }}>20%</strong></span>
                  <span>Persistent: <strong style={{ color: C.navy, fontFamily: mono }}>25%</strong></span>
                </div>
              </div>

              {/* Strength + Risk */}
              <div style={{ display: m ? "block" : "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                <div style={{ padding: "18px 20px", borderRadius: 12, backgroundColor: C.white, border: `1px solid ${C.border}`, marginBottom: m ? 12 : 0 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
                    <div style={{ width: 6, height: 6, borderRadius: 2, backgroundColor: C.teal }} />
                    <span style={{ fontSize: 10, fontWeight: 600, letterSpacing: "0.10em", color: C.teal, textTransform: "uppercase" as const }}>Strength</span>
                  </div>
                  <p style={{ fontSize: 14, color: C.navy, margin: 0, lineHeight: 1.55 }}>Low variability — earnings are consistent month to month.</p>
                </div>
                <div style={{ padding: "18px 20px", borderRadius: 12, backgroundColor: C.white, border: `1px solid ${C.border}` }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
                    <div style={{ width: 6, height: 6, borderRadius: 2, backgroundColor: "#C0392B" }} />
                    <span style={{ fontSize: 10, fontWeight: 600, letterSpacing: "0.10em", color: "#C0392B", textTransform: "uppercase" as const }}>Risk</span>
                  </div>
                  <p style={{ fontSize: 14, color: C.navy, margin: 0, lineHeight: 1.55 }}>High concentration — one source carries most of the structure.</p>
                </div>
              </div>
            </div>
            <p style={{ fontSize: 14, color: light, marginTop: 20, lineHeight: 1.6 }}>
              Plain-English explanation of your structure, including strengths, risks, and the constraint limiting your score.
            </p>
          </div>

          {/* PAGE 03 — Stability Plan */}
          <div style={{ ...fadeIn(visible, 260) }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20 }}>
              <div style={{ width: 36, height: 36, borderRadius: 8, backgroundColor: `${C.teal}08`, border: `1px solid ${C.teal}12`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <span style={{ fontSize: 13, fontWeight: 600, fontFamily: mono, color: C.teal }}>03</span>
              </div>
              <span style={{ fontSize: 16, fontWeight: 600, color: C.navy }}>Stability Plan</span>
            </div>
            <div style={{ backgroundColor: "#FAFAFA", borderRadius: 16, padding: m ? 28 : 36, border: `1px solid ${C.border}` }}>
              <div style={{ fontSize: 16, fontWeight: 600, color: C.navy, marginBottom: 24 }}>Ranked by impact. Ordered for execution.</div>
              <div style={{ display: "flex", flexDirection: "column" as const, gap: 10, marginBottom: 24 }}>
                {[
                  { action: "Reduce concentration", priority: "High", color: "#C0392B" },
                  { action: "Extend forward visibility", priority: "High", color: "#C0392B" },
                  { action: "Add recurring revenue stream", priority: "Medium", color: "#B58900" },
                ].map((a, i) => (
                  <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "14px 18px", borderRadius: 10, backgroundColor: C.white, border: `1px solid ${C.border}` }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                      <div style={{ width: 24, height: 24, borderRadius: 6, backgroundColor: `${a.color}08`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                        <span style={{ fontSize: 12, fontWeight: 700, color: a.color }}>{i + 1}</span>
                      </div>
                      <span style={{ fontSize: 14, fontWeight: 500, color: C.navy }}>{a.action}</span>
                    </div>
                    <span style={{ fontSize: 11, fontWeight: 600, letterSpacing: "0.06em", color: a.color, padding: "3px 10px", borderRadius: 6, backgroundColor: `${a.color}08` }}>{a.priority}</span>
                  </div>
                ))}
              </div>
              <div style={{ display: m ? "block" : "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                <div style={{ padding: "14px 18px", borderRadius: 10, backgroundColor: C.white, border: `1px solid ${C.border}`, marginBottom: m ? 10 : 0 }}>
                  <div style={{ fontSize: 10, fontWeight: 600, letterSpacing: "0.10em", color: light, marginBottom: 4, textTransform: "uppercase" as const }}>Projected Improvement</div>
                  <div style={{ fontSize: 16, fontWeight: 600, color: C.teal }}>Significant</div>
                </div>
                <div style={{ padding: "14px 18px", borderRadius: 10, backgroundColor: C.white, border: `1px solid ${C.border}` }}>
                  <div style={{ fontSize: 10, fontWeight: 600, letterSpacing: "0.10em", color: light, marginBottom: 4, textTransform: "uppercase" as const }}>Command Center Access</div>
                  <div style={{ fontSize: 13, fontWeight: 500, color: C.navy }}>PressureMap&#8482; &middot; Simulator &middot; 12-week roadmap</div>
                </div>
              </div>
            </div>
            <p style={{ fontSize: 14, color: light, marginTop: 20, lineHeight: 1.6 }}>
              Your highest-leverage actions, ranked by how much they move your score. Includes a 30-day execution path.
            </p>
          </div>

          {/* PAGE 04 — Stress Testing */}
          <div style={{ ...fadeIn(visible, 340) }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20 }}>
              <div style={{ width: 36, height: 36, borderRadius: 8, backgroundColor: `${C.teal}08`, border: `1px solid ${C.teal}12`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <span style={{ fontSize: 13, fontWeight: 600, fontFamily: mono, color: C.teal }}>04</span>
              </div>
              <span style={{ fontSize: 16, fontWeight: 600, color: C.navy }}>Stress Testing</span>
            </div>
            <div style={{ backgroundColor: "#FAFAFA", borderRadius: 16, padding: m ? 28 : 36, border: `1px solid ${C.border}` }}>
              <div style={{ fontSize: 16, fontWeight: 600, color: C.navy, marginBottom: 24 }}>What breaks your structure — and how fast</div>
              <div style={{ display: "flex", flexDirection: "column" as const, gap: 10 }}>
                {[
                  { scenario: "Your largest client stops paying", severity: "Severe", color: "#C0392B" },
                  { scenario: "You cannot work for 90 days", severity: "Moderate", color: "#B58900" },
                  { scenario: "Forward commitments delayed", severity: "Moderate", color: "#B58900" },
                ].map((s, i) => (
                  <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "16px 18px", borderRadius: 10, backgroundColor: C.white, border: `1px solid ${C.border}` }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                      <div style={{ width: 8, height: 8, borderRadius: 2, backgroundColor: s.color, flexShrink: 0 }} />
                      <span style={{ fontSize: 14, fontWeight: 500, color: C.navy }}>{s.scenario}</span>
                    </div>
                    <span style={{ fontSize: 11, fontWeight: 600, letterSpacing: "0.06em", color: s.color, padding: "3px 10px", borderRadius: 6, backgroundColor: `${s.color}08` }}>{s.severity}</span>
                  </div>
                ))}
              </div>
            </div>
            <p style={{ fontSize: 14, color: light, marginTop: 20, lineHeight: 1.6 }}>
              Real-world disruption scenarios ranked by impact, including exact score drops and structural fragility.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}


/* ================================================================== */
/* SECTION 3 — COMMAND CENTER                                          */
/* ================================================================== */

function CommandCenterSection() {
  const { ref, visible } = useInView();
  const m = useMobile();
  const fadeIn = useFadeIn();
  return (
    <section ref={ref} style={{ backgroundColor: C.navy, paddingTop: secPad(m), paddingBottom: secPad(m), paddingLeft: px(m), paddingRight: px(m), position: "relative", overflow: "hidden" }}>
      <div style={{ position: "absolute", top: "50%", left: "50%", width: 500, height: 500, transform: "translate(-50%, -50%)", borderRadius: "50%", background: `radial-gradient(circle, ${C.purple}06 0%, transparent 70%)`, pointerEvents: "none" }} />
      <div style={{ maxWidth: contentW, margin: "0 auto", position: "relative", zIndex: 1 }}>
        <div style={{ textAlign: "center", marginBottom: m ? 36 : 56, ...fadeIn(visible) }}>
          <div style={{ fontSize: 11, fontWeight: 500, letterSpacing: "0.12em", textTransform: "uppercase" as const, color: C.teal, marginBottom: 16 }}>Command Center</div>
          <h2 style={{ fontSize: m ? 26 : 36, fontWeight: 600, lineHeight: 1.15, letterSpacing: "-0.02em", color: "#F4F1EA", marginBottom: 14 }}>
            This is where your structure changes — not just your score.
          </h2>
          <p style={{ fontSize: 16, color: "rgba(244,241,234,0.50)", lineHeight: 1.65 }}>
            Every tool runs on your actual structure — not estimates.
          </p>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: m ? "1fr" : "1fr 1fr", gap: 16, maxWidth: 880, margin: "0 auto", ...fadeIn(visible, 120) }}>
          {[
            { label: "PressureMap\u2122", desc: "Structural exposure by zone.", icon: "M9 19v-6a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v6M15 19v-6a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v6M9 13V5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v8" },
            { label: "What-If Simulator", desc: "Test changes and see score impact.", icon: "M13 10V3L4 14h7v7l9-11h-7z" },
            { label: "12-Week Roadmap", desc: "Execution sequence based on your structure.", icon: "M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2M9 5a2 2 0 0 0 2 2h2a2 2 0 0 0 2-2M9 5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2" },
            { label: "Industry Benchmarks", desc: "Your position relative to peers.", icon: "M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" },
          ].map((mod, i) => (
            <div key={i} style={{ padding: m ? 24 : 28, borderRadius: 14, backgroundColor: "rgba(244,241,234,0.04)", border: "1px solid rgba(244,241,234,0.06)" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 10 }}>
                <div style={{ width: 36, height: 36, borderRadius: 8, backgroundColor: `${C.teal}12`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={C.teal} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d={mod.icon} /></svg>
                </div>
                <span style={{ fontSize: 16, fontWeight: 600, color: "#F4F1EA" }}>{mod.label}</span>
              </div>
              <p style={{ fontSize: 14, color: "rgba(244,241,234,0.45)", lineHeight: 1.6, margin: 0 }}>{mod.desc}</p>
            </div>
          ))}
        </div>
        <p style={{ fontSize: 13, color: "rgba(244,241,234,0.45)", textAlign: "center", marginTop: m ? 24 : 36, letterSpacing: "0.03em", ...fadeIn(visible, 220) }}>Lifetime access included</p>
      </div>
    </section>
  );
}


/* ================================================================== */
/* SECTION 4 — WHY PEOPLE BUY                                          */
/* ================================================================== */

function WhyPeopleBuy() {
  const { ref, visible } = useInView();
  const m = useMobile();
  const fadeIn = useFadeIn();
  return (
    <section ref={ref} style={{ backgroundColor: C.white, paddingTop: secPad(m), paddingBottom: secPad(m), paddingLeft: px(m), paddingRight: px(m) }}>
      <div style={{ maxWidth: 720, margin: "0 auto" }}>
        <div style={{ width: 48, height: 1, backgroundColor: C.border, margin: m ? "0 auto 36px" : "0 auto 56px" }} />
        <h2 style={{ fontSize: m ? 26 : 36, fontWeight: 600, lineHeight: 1.15, letterSpacing: "-0.02em", color: C.navy, marginBottom: 24, ...fadeIn(visible) }}>Why people buy the report</h2>
        <p style={{ fontSize: 16, color: muted, lineHeight: 1.65, marginBottom: 24, ...fadeIn(visible, 80) }}>The score shows the number.</p>
        <p style={{ fontSize: 16, color: muted, lineHeight: 1.65, marginBottom: 8, ...fadeIn(visible, 120) }}>The report shows:</p>
        <div style={{ marginBottom: 28, ...fadeIn(visible, 160) }}>
          {["what\u2019s fragile", "what breaks first", "what to fix first"].map((item, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 10 }}>
              <span style={{ width: 5, height: 5, borderRadius: "50%", backgroundColor: C.teal, flexShrink: 0 }} />
              <span style={{ fontSize: 16, fontWeight: 500, color: C.navy }}>{item}</span>
            </div>
          ))}
        </div>
        <div style={{ padding: "20px 28px", borderRadius: 14, backgroundColor: C.white, border: `1px solid ${C.border}`, display: "inline-block", ...fadeIn(visible, 220) }}>
          <p style={{ fontSize: 16, color: light, marginBottom: 4 }}>Without it, you&#8217;re guessing.</p>
          <p style={{ fontSize: 16, fontWeight: 500, color: C.navy, margin: 0 }}>With it, you&#8217;re acting on structure.</p>
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
      <div style={{ position: "absolute", top: "50%", left: "50%", width: 500, height: 500, transform: "translate(-50%, -50%)", borderRadius: "50%", background: `radial-gradient(circle, ${C.purple}06 0%, transparent 70%)`, pointerEvents: "none" }} />
      <div style={{ maxWidth: 700, margin: "0 auto", textAlign: "center", position: "relative", zIndex: 1 }}>
        <h2 style={{ fontSize: m ? 26 : 36, fontWeight: 600, lineHeight: 1.12, letterSpacing: "-0.02em", color: "#F4F1EA", marginBottom: 20, ...fadeIn(visible) }}>
          Your structure is already there.{m ? " " : <br />}This shows it clearly.
        </h2>
        <p style={{ fontSize: 16, color: "rgba(244,241,234,0.50)", lineHeight: 1.65, marginBottom: 8, ...fadeIn(visible, 60) }}>
          Your report will look like this — but every number will be yours.
        </p>
        <p style={{ fontSize: 16, color: "rgba(244,241,234,0.45)", lineHeight: 1.65, marginBottom: 8, ...fadeIn(visible, 100) }}>Start with the free score.</p>
        <p style={{ fontSize: 16, color: "rgba(244,241,234,0.45)", lineHeight: 1.65, marginBottom: 40, ...fadeIn(visible, 130) }}>Unlock the full diagnostic when you&#8217;re ready to act.</p>
        <div style={{ ...fadeIn(visible, 200) }}>
          <Link href="/pricing" style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", height: 56, padding: "0 48px", borderRadius: 12, backgroundColor: C.white, color: C.navy, fontSize: 16, fontWeight: 600, textDecoration: "none", transition: "background-color 200ms, box-shadow 200ms", boxShadow: "0 2px 16px rgba(244,241,234,0.10)" }}
            onMouseEnter={e => { e.currentTarget.style.backgroundColor = "#E8E5DE"; e.currentTarget.style.boxShadow = "0 4px 24px rgba(244,241,234,0.15)"; }}
            onMouseLeave={e => { e.currentTarget.style.backgroundColor = C.white; e.currentTarget.style.boxShadow = "0 2px 16px rgba(244,241,234,0.10)"; }}>
            Start Your Free Assessment
          </Link>
          <p style={{ fontSize: 13, color: "rgba(244,241,234,0.45)", marginTop: 16, letterSpacing: "0.03em" }}>Under 2 minutes &bull; Instant result &bull; $69 for full report</p>
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
