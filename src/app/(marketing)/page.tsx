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

function useFadeIn() {
  const reduced = useReducedMotion();
  return (visible: boolean, delay = 0): React.CSSProperties =>
    reduced
      ? {}
      : {
          opacity: visible ? 1 : 0,
          transform: visible ? "translateY(0)" : "translateY(8px)",
          transition: `opacity 400ms ease-out ${delay}ms, transform 400ms ease-out ${delay}ms`,
        };
}

/* ================================================================== */
/* DESIGN SYSTEM (LOCKED)                                              */
/* ================================================================== */

const C = {
  navy: "#0E1A2B",
  purple: "#4B3FAE",
  teal: "#1F6D7A",
  sand: "#F4F1EA",
  white: "#FFFFFF",
  border: "rgba(14,26,43,0.08)",
};

const mono = '"SF Mono", "Fira Code", "IBM Plex Mono", "Courier New", monospace';
const muted = "rgba(14,26,43,0.55)";
const light = "rgba(14,26,43,0.38)";

const maxW = 1200;
const contentW = 1040;
const gutter = 24;

const secPad = (m: boolean) => m ? 48 : 96;
const px = (m: boolean) => m ? 20 : gutter;

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

  return (
    <header ref={ref} style={{ backgroundColor: C.navy }}>
      <div style={{
        maxWidth: contentW, margin: "0 auto",
        paddingTop: m ? 80 : 120,
        paddingBottom: m ? 48 : 80,
        paddingLeft: px(m), paddingRight: px(m),
      }}>
        <div style={{
          display: m ? "block" : "flex",
          alignItems: "center", justifyContent: "space-between", gap: 64,
        }}>
          {/* Left — copy */}
          <div style={{ maxWidth: 540, textAlign: m ? "center" : "left" }}>
            <div style={{
              fontSize: 12, fontWeight: 500, letterSpacing: "0.12em", textTransform: "uppercase" as const,
              color: C.teal, marginBottom: 16,
              ...fadeIn(visible),
            }}>
              Income Stability Score&#8482;
            </div>

            <h1 style={{
              fontSize: m ? 36 : 56, fontWeight: 600, lineHeight: 1.1, letterSpacing: "-0.02em",
              color: C.sand,
              marginBottom: m ? 24 : 32,
              ...fadeIn(visible, 80),
            }}>
              Your income might be strong.{m ? " " : <br />}Your structure might not.
            </h1>

            <p style={{
              fontSize: 16, fontWeight: 400, lineHeight: 1.65,
              color: "rgba(244,241,234,0.55)",
              maxWidth: m ? undefined : 460,
              marginBottom: m ? 32 : 40,
              ...fadeIn(visible, 160),
            }}>
              Most people never measure how stable their income actually is — until something breaks it.
            </p>
            <p style={{
              fontSize: 16, fontWeight: 400, lineHeight: 1.65,
              color: "rgba(244,241,234,0.55)",
              maxWidth: m ? undefined : 460,
              marginBottom: m ? 32 : 40,
              ...fadeIn(visible, 200),
            }}>
              RunPayway&#8482; measures the structure of your income — not the size of it — and shows how it holds up under pressure.
            </p>

            <div style={{ ...fadeIn(visible, 280) }}>
              <Link href="/pricing" style={{
                display: "inline-flex", alignItems: "center", justifyContent: "center",
                height: 52, width: m ? "100%" : "auto",
                padding: "0 40px", borderRadius: 10,
                backgroundColor: C.white, color: C.navy,
                fontSize: 16, fontWeight: 600,
                textDecoration: "none",
                transition: "background-color 200ms ease",
              }}
                onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = "#E8E5DE"; }}
                onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = C.white; }}
              >
                Get My Income Stability Score
              </Link>

              <p style={{ fontSize: 14, color: "rgba(244,241,234,0.38)", marginTop: 16, letterSpacing: "0.02em" }}>
                Under 2 minutes &bull; Instant result &bull; Private by default
              </p>
            </div>
          </div>

          {/* Right — score card */}
          <div style={{
            flexShrink: 0,
            marginTop: m ? 40 : 0,
            ...fadeIn(visible, 350),
          }}>
            <div style={{
              backgroundColor: C.white, borderRadius: 16, padding: m ? 32 : 40,
              maxWidth: m ? "100%" : 320,
              margin: m ? "0 auto" : undefined,
              border: `1px solid rgba(14,26,43,0.06)`,
              boxShadow: "0 1px 3px rgba(14,26,43,0.04)",
            }}>
              <div style={{
                fontSize: 12, fontWeight: 500, letterSpacing: "0.10em", textTransform: "uppercase" as const,
                color: light, marginBottom: 24,
              }}>
                Income Stability Score
              </div>

              <div style={{ textAlign: "center", marginBottom: 16 }}>
                <div style={{
                  fontSize: 56, fontWeight: 300, color: C.purple, lineHeight: 1,
                  fontFamily: mono, fontVariantNumeric: "tabular-nums",
                  opacity: showLabel ? 1 : 0, transition: "opacity 500ms ease-out",
                }}>
                  {animatedScore}
                </div>
                <div style={{
                  fontFamily: mono, fontSize: 14, color: light, marginTop: 4,
                  opacity: showLabel ? 1 : 0, transition: "opacity 500ms ease-out 50ms",
                }}>/ 100</div>
              </div>

              <div style={{
                display: "flex", justifyContent: "center", marginBottom: 16,
                opacity: showLabel ? 1 : 0, transition: "opacity 500ms ease-out 100ms",
              }}>
                <div style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "4px 12px", borderRadius: 100, backgroundColor: "rgba(43,94,167,0.08)" }}>
                  <div style={{ width: 6, height: 6, borderRadius: "50%", backgroundColor: "#2B5EA7" }} />
                  <span style={{ fontSize: 12, fontWeight: 600, color: "#2B5EA7" }}>Established Stability</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Industry signal cards */}
        <div style={{
          marginTop: m ? 40 : 56,
          paddingTop: m ? 24 : 32,
          borderTop: "1px solid rgba(244,241,234,0.08)",
          ...fadeIn(visible, 400),
        }}>
          <div style={{
            display: "grid",
            gridTemplateColumns: m ? "1fr 1fr" : "1fr 1fr 1fr 1fr",
            gap: m ? 10 : 14,
            marginBottom: m ? 24 : 32,
          }}>
            {[
              { name: "Real Estate", line: "Income comes in bursts. Risk sits between transactions." },
              { name: "Consulting", line: "Revenue depends on utilization. Continuity depends on structure." },
              { name: "Sales / Brokerage", line: "Compensation moves in cycles. Exposure sits between them." },
              { name: "Freelance / Contract", line: "Every month starts at zero unless the structure says otherwise." },
            ].map((ind, i) => (
              <div key={i} style={{
                padding: m ? "12px 14px" : "14px 16px",
                borderRadius: 10,
                border: "1px solid rgba(244,241,234,0.08)",
                backgroundColor: "rgba(244,241,234,0.04)",
              }}>
                <div style={{ fontSize: 12, fontWeight: 600, color: "rgba(244,241,234,0.55)", marginBottom: 6 }}>{ind.name}</div>
                <div style={{ fontSize: 12, color: "rgba(244,241,234,0.30)", lineHeight: 1.5 }}>{ind.line}</div>
              </div>
            ))}
          </div>

          {/* Trust strip */}
          <p style={{
            fontSize: 13, letterSpacing: "0.02em",
            color: "rgba(244,241,234,0.35)",
            textAlign: m ? "center" : "left",
          }}>
            Model RP-2.0 &bull; Version-locked &bull; Deterministic output &bull; Same inputs &rarr; same score &bull; No bank connection &bull; No credit pull
          </p>
        </div>
      </div>
    </header>
  );
}


/* ================================================================== */
/* SECTION 2 — WHAT THIS IS                                            */
/* ================================================================== */

function WhatThisIs() {
  const { ref, visible } = useInView();
  const m = useMobile();
  const fadeIn = useFadeIn();

  return (
    <section ref={ref} style={{
      backgroundColor: C.sand,
      paddingTop: secPad(m), paddingBottom: secPad(m),
      paddingLeft: px(m), paddingRight: px(m),
    }}>
      <div style={{ maxWidth: 700, margin: "0 auto", textAlign: "center" }}>
        <h2 style={{
          fontSize: m ? 28 : 36, fontWeight: 600, lineHeight: 1.2, letterSpacing: "-0.02em",
          color: C.navy, marginBottom: 24,
          ...fadeIn(visible),
        }}>
          This is not a budgeting tool.{m ? " " : <br />}Not a credit score. Not a forecast.
        </h2>
        <p style={{
          fontSize: 16, fontWeight: 400, lineHeight: 1.65,
          color: muted, marginBottom: 16,
          ...fadeIn(visible, 100),
        }}>
          Those measure what happened — or guess what might.
        </p>
        <p style={{
          fontSize: 16, fontWeight: 400, lineHeight: 1.65,
          color: muted,
          ...fadeIn(visible, 180),
        }}>
          RunPayway&#8482; measures the structure of how your income is built — right now.
        </p>
      </div>
    </section>
  );
}


/* ================================================================== */
/* SECTION 3 — SAME INCOME PROOF                                       */
/* ================================================================== */

function SameIncomeProof() {
  const { ref, visible } = useInView();
  const m = useMobile();
  const fadeIn = useFadeIn();

  return (
    <section ref={ref} style={{
      backgroundColor: C.navy,
      paddingTop: secPad(m), paddingBottom: secPad(m),
      paddingLeft: px(m), paddingRight: px(m),
    }}>
      <div style={{ maxWidth: contentW, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: m ? 32 : 48, ...fadeIn(visible) }}>
          <h2 style={{ fontSize: m ? 28 : 36, fontWeight: 600, lineHeight: 1.2, color: C.sand, marginBottom: 16 }}>
            Same Income. Different Stability.
          </h2>
          <p style={{ fontSize: 16, color: "rgba(244,241,234,0.55)", lineHeight: 1.65 }}>
            Same income does not mean equal stability.
          </p>
        </div>

        <div style={{
          display: m ? "block" : "grid", gridTemplateColumns: "1fr 1fr",
          gap: m ? 16 : 24, maxWidth: 860, margin: "0 auto",
          ...fadeIn(visible, 150),
        }}>
          {/* Person A */}
          <div style={{
            backgroundColor: C.white, borderRadius: 16, padding: m ? 24 : 32,
            marginBottom: m ? 16 : 0,
          }}>
            <div style={{ fontSize: 14, fontWeight: 500, color: light, marginBottom: 8 }}>$150K / year</div>
            <div style={{ display: "flex", flexDirection: "column" as const, gap: 8, marginBottom: 24 }}>
              {["1 client = 80% of income", "No forward contracts", "Income stops if work stops"].map((item, i) => (
                <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 8 }}>
                  <span style={{ width: 5, height: 5, borderRadius: "50%", backgroundColor: "#9B2C2C", flexShrink: 0, marginTop: 7 }} />
                  <span style={{ fontSize: 15, color: muted, lineHeight: 1.5 }}>{item}</span>
                </div>
              ))}
            </div>
            <div style={{ borderTop: `1px solid ${C.border}`, paddingTop: 20 }}>
              <span style={{ fontSize: 36, fontWeight: 300, fontFamily: mono, color: "#9B2C2C" }}>31</span>
              <span style={{ fontSize: 14, fontWeight: 600, color: "#9B2C2C", marginLeft: 12 }}>Limited Stability</span>
            </div>
          </div>

          {/* Person B */}
          <div style={{
            backgroundColor: C.white, borderRadius: 16, padding: m ? 24 : 32,
          }}>
            <div style={{ fontSize: 14, fontWeight: 500, color: light, marginBottom: 8 }}>$150K / year</div>
            <div style={{ display: "flex", flexDirection: "column" as const, gap: 8, marginBottom: 24 }}>
              {["5 clients, none over 30%", "40% recurring revenue", "3 months secured forward"].map((item, i) => (
                <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 8 }}>
                  <span style={{ width: 5, height: 5, borderRadius: "50%", backgroundColor: C.teal, flexShrink: 0, marginTop: 7 }} />
                  <span style={{ fontSize: 15, color: muted, lineHeight: 1.5 }}>{item}</span>
                </div>
              ))}
            </div>
            <div style={{ borderTop: `1px solid ${C.border}`, paddingTop: 20 }}>
              <span style={{ fontSize: 36, fontWeight: 300, fontFamily: mono, color: C.teal }}>74</span>
              <span style={{ fontSize: 14, fontWeight: 600, color: C.teal, marginLeft: 12 }}>Established Stability</span>
            </div>
          </div>
        </div>

        <p style={{
          fontSize: 16, fontWeight: 500, color: "rgba(244,241,234,0.50)",
          textAlign: "center", marginTop: m ? 24 : 36,
          ...fadeIn(visible, 250),
        }}>
          Structure determines stability.
        </p>
      </div>
    </section>
  );
}


/* ================================================================== */
/* SECTION 4 — HOW IT WORKS                                            */
/* ================================================================== */

function HowItWorks() {
  const { ref, visible } = useInView();
  const m = useMobile();
  const fadeIn = useFadeIn();

  const bands = [
    { label: "Limited", range: "0\u201329", color: "#9B2C2C" },
    { label: "Developing", range: "30\u201349", color: "#92640A" },
    { label: "Established", range: "50\u201374", color: "#2B5EA7" },
    { label: "High", range: "75\u2013100", color: C.teal },
  ];

  return (
    <section ref={ref} style={{
      backgroundColor: C.white,
      paddingTop: secPad(m), paddingBottom: secPad(m),
      paddingLeft: px(m), paddingRight: px(m),
    }}>
      <div style={{ maxWidth: contentW, margin: "0 auto" }}>
        <h2 style={{
          fontSize: m ? 28 : 36, fontWeight: 600, lineHeight: 1.2, color: C.navy,
          textAlign: "center", marginBottom: m ? 40 : 56,
          ...fadeIn(visible),
        }}>
          How It Works
        </h2>

        <div style={{
          display: m ? "block" : "grid", gridTemplateColumns: "1fr 1fr 1fr",
          gap: m ? 24 : 32, marginBottom: m ? 40 : 56,
          ...fadeIn(visible, 100),
        }}>
          {[
            { step: "01", title: "Define your income structure", body: "You describe how your income is organized \u2014 sources, contracts, dependencies." },
            { step: "02", title: "The system evaluates 6 fixed dimensions", body: "Recurrence, concentration, diversification, forward visibility, consistency, and labor dependence." },
            { step: "03", title: "You receive one standardized score", body: "A single number from 0\u2013100 with a stability band and your primary structural constraint." },
          ].map((s, i) => (
            <div key={i} style={{ marginBottom: m ? 0 : 0 }}>
              <div style={{ fontSize: 12, fontWeight: 500, letterSpacing: "0.12em", color: C.teal, marginBottom: 12 }}>{s.step}</div>
              <div style={{ fontSize: 20, fontWeight: 500, color: C.navy, marginBottom: 12, lineHeight: 1.3 }}>{s.title}</div>
              <p style={{ fontSize: 16, color: muted, lineHeight: 1.65, margin: 0 }}>{s.body}</p>
            </div>
          ))}
        </div>

        {/* Bands */}
        <div style={{
          display: "flex", gap: m ? 8 : 12, justifyContent: "center", flexWrap: "wrap" as const,
          marginBottom: 24,
          ...fadeIn(visible, 200),
        }}>
          {bands.map(b => (
            <div key={b.label} style={{
              display: "flex", alignItems: "center", gap: 8,
              padding: "8px 16px", borderRadius: 8,
              border: `1px solid ${C.border}`,
            }}>
              <div style={{ width: 8, height: 8, borderRadius: 2, backgroundColor: b.color }} />
              <span style={{ fontSize: 14, fontWeight: 500, color: C.navy }}>{b.label}</span>
              <span style={{ fontSize: 13, color: light }}>{b.range}</span>
            </div>
          ))}
        </div>

        <p style={{
          fontSize: 14, color: light, textAlign: "center",
          ...fadeIn(visible, 250),
        }}>
          Deterministic. Version-locked.
        </p>
      </div>
    </section>
  );
}


/* ================================================================== */
/* SECTION 5 — SAMPLE RESULT                                           */
/* ================================================================== */

function SampleResult() {
  const { ref, visible } = useInView();
  const m = useMobile();
  const fadeIn = useFadeIn();

  return (
    <section ref={ref} style={{
      backgroundColor: C.sand,
      paddingTop: secPad(m), paddingBottom: secPad(m),
      paddingLeft: px(m), paddingRight: px(m),
    }}>
      <div style={{ maxWidth: 700, margin: "0 auto" }}>
        <h2 style={{
          fontSize: m ? 28 : 36, fontWeight: 600, lineHeight: 1.2, color: C.navy,
          textAlign: "center", marginBottom: m ? 32 : 48,
          ...fadeIn(visible),
        }}>
          Your score reveals what&#8217;s holding your income together — and what could break it.
        </h2>

        <div style={{
          backgroundColor: C.white, borderRadius: 16, padding: m ? 24 : 36,
          border: `1px solid ${C.border}`,
          ...fadeIn(visible, 120),
        }}>
          {/* Score */}
          <div style={{ display: "flex", alignItems: "baseline", gap: 12, marginBottom: 8 }}>
            <span style={{ fontSize: 48, fontWeight: 300, fontFamily: mono, color: C.purple, lineHeight: 1 }}>72</span>
            <span style={{ fontSize: 14, color: light }}>/100</span>
          </div>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "4px 12px", borderRadius: 100, backgroundColor: "rgba(43,94,167,0.08)", marginBottom: 24 }}>
            <div style={{ width: 6, height: 6, borderRadius: "50%", backgroundColor: "#2B5EA7" }} />
            <span style={{ fontSize: 12, fontWeight: 600, color: "#2B5EA7" }}>Established Stability</span>
          </div>

          <div style={{ height: 1, backgroundColor: C.border, marginBottom: 20 }} />

          <div style={{ fontSize: 14, fontWeight: 500, color: light, marginBottom: 8 }}>Primary constraint: <span style={{ color: C.navy }}>Income concentration</span></div>

          <p style={{ fontSize: 16, fontWeight: 500, color: C.navy, lineHeight: 1.55, marginBottom: 20 }}>
            Your structure is stable — but one source puts most of it at risk.
          </p>

          <div style={{
            padding: "16px 20px", borderRadius: 10,
            backgroundColor: "rgba(155,44,44,0.04)", border: "1px solid rgba(155,44,44,0.08)",
          }}>
            <div style={{ fontSize: 14, color: muted, marginBottom: 4 }}>If that source disappears:</div>
            <div style={{ fontSize: 20, fontWeight: 500, fontFamily: mono, color: "#9B2C2C" }}>Projected score: 44</div>
          </div>
        </div>

        <p style={{
          fontSize: 14, color: light, textAlign: "center", marginTop: 24,
          ...fadeIn(visible, 200),
        }}>
          The model does not change. Only the inputs change.
        </p>
      </div>
    </section>
  );
}


/* ================================================================== */
/* SECTION 6 — COMMAND CENTER                                          */
/* ================================================================== */

function CommandCenter() {
  const { ref, visible } = useInView();
  const m = useMobile();
  const fadeIn = useFadeIn();

  const modules = [
    { label: "Score Breakdown", desc: "See how each of the 6 structural dimensions contributes to your score." },
    { label: "What-If Simulator", desc: "Test changes before you commit. See the exact score impact." },
    { label: "12-Week Roadmap", desc: "Step-by-step plan with industry-specific guidance and cumulative projections." },
    { label: "Goal Mode", desc: "Pick a target band. See the minimum moves to get there." },
  ];

  return (
    <section ref={ref} style={{
      backgroundColor: C.navy,
      paddingTop: secPad(m), paddingBottom: secPad(m),
      paddingLeft: px(m), paddingRight: px(m),
    }}>
      <div style={{ maxWidth: contentW, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: m ? 32 : 48, ...fadeIn(visible) }}>
          <div style={{ fontSize: 12, fontWeight: 500, letterSpacing: "0.12em", textTransform: "uppercase" as const, color: C.teal, marginBottom: 16 }}>
            Command Center
          </div>
          <h2 style={{ fontSize: m ? 28 : 36, fontWeight: 600, lineHeight: 1.2, color: C.sand, marginBottom: 16 }}>
            This is where your income structure gets fixed.
          </h2>
          <p style={{ fontSize: 16, color: "rgba(244,241,234,0.55)", lineHeight: 1.65 }}>
            Test changes. See impact. Improve your score.
          </p>
        </div>

        <div style={{
          display: "grid",
          gridTemplateColumns: m ? "1fr" : "1fr 1fr",
          gap: m ? 12 : 16, maxWidth: 860, margin: "0 auto",
          ...fadeIn(visible, 150),
        }}>
          {modules.map((mod, i) => (
            <div key={i} style={{
              padding: m ? 24 : 28, borderRadius: 16,
              backgroundColor: "rgba(244,241,234,0.04)",
              border: "1px solid rgba(244,241,234,0.06)",
            }}>
              <div style={{ fontSize: 20, fontWeight: 500, color: C.sand, marginBottom: 10 }}>{mod.label}</div>
              <p style={{ fontSize: 14, color: "rgba(244,241,234,0.45)", lineHeight: 1.6, margin: 0 }}>{mod.desc}</p>
            </div>
          ))}
        </div>

        <p style={{
          fontSize: 14, color: "rgba(244,241,234,0.30)", textAlign: "center", marginTop: m ? 24 : 36,
          ...fadeIn(visible, 250),
        }}>
          Included with diagnostic
        </p>
      </div>
    </section>
  );
}


/* ================================================================== */
/* SECTION 7 — PRICING                                                 */
/* ================================================================== */

function PricingSection() {
  const { ref, visible } = useInView();
  const m = useMobile();
  const fadeIn = useFadeIn();

  const check = (text: string) => (
    <div style={{ display: "flex", alignItems: "flex-start", gap: 10, marginBottom: 14 }}>
      <span style={{ color: C.teal, fontSize: 14, flexShrink: 0, marginTop: 2 }}>&#10003;</span>
      <span style={{ fontSize: 15, color: muted, lineHeight: 1.55 }}>{text}</span>
    </div>
  );

  return (
    <section ref={ref} style={{
      backgroundColor: C.white,
      paddingTop: secPad(m), paddingBottom: secPad(m),
      paddingLeft: px(m), paddingRight: px(m),
    }}>
      <div style={{ maxWidth: contentW, margin: "0 auto" }}>
        <h2 style={{
          fontSize: m ? 28 : 36, fontWeight: 600, lineHeight: 1.2, color: C.navy,
          textAlign: "center", marginBottom: m ? 32 : 48,
          ...fadeIn(visible),
        }}>
          Start with the score.{m ? " " : <br />}Go deeper only if you need the diagnosis.
        </h2>

        <div style={{
          display: m ? "block" : "grid", gridTemplateColumns: "1fr 1fr",
          gap: 24, maxWidth: 860, margin: "0 auto",
          ...fadeIn(visible, 120),
        }}>
          {/* Free */}
          <div style={{
            backgroundColor: "#F8F7F3", borderRadius: 16, padding: m ? 24 : 32,
            border: `1px solid ${C.border}`,
            display: "flex", flexDirection: "column" as const,
            marginBottom: m ? 16 : 0,
          }}>
            <div style={{ fontSize: 12, fontWeight: 500, letterSpacing: "0.10em", textTransform: "uppercase" as const, color: C.teal, marginBottom: 20 }}>
              Income Stability Score&#8482;
            </div>
            <div style={{ marginBottom: 24 }}>
              <span style={{ fontSize: 48, fontWeight: 600, fontFamily: mono, color: C.navy, lineHeight: 1 }}>$0</span>
            </div>
            <div style={{ marginBottom: 32, flex: 1 }}>
              {check("Score out of 100")}
              {check("Stability band")}
              {check("Primary constraint")}
              {check("Highest-impact improvement")}
            </div>
            <Link href="/pricing" style={{
              display: "flex", alignItems: "center", justifyContent: "center",
              height: 52, borderRadius: 10,
              backgroundColor: C.navy, color: C.white,
              fontSize: 16, fontWeight: 600, textDecoration: "none",
              transition: "background-color 200ms",
            }}
              onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = "#1a2540"; }}
              onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = C.navy; }}
            >
              Start Free Assessment
            </Link>
          </div>

          {/* Diagnostic (PRIMARY) */}
          <div style={{
            backgroundColor: C.white, borderRadius: 16, padding: m ? 24 : 32,
            border: `1px solid rgba(14,26,43,0.12)`,
            boxShadow: "0 2px 8px rgba(14,26,43,0.06)",
            display: "flex", flexDirection: "column" as const,
            transform: m ? "none" : "scale(1.02)",
          }}>
            <div style={{ fontSize: 12, fontWeight: 500, letterSpacing: "0.10em", textTransform: "uppercase" as const, color: C.purple, marginBottom: 20 }}>
              RunPayway&#8482; Diagnostic Report
            </div>
            <div style={{ marginBottom: 16 }}>
              <span style={{ fontSize: 48, fontWeight: 600, fontFamily: mono, color: C.navy, lineHeight: 1 }}>$69</span>
            </div>

            <p style={{ fontSize: 16, fontWeight: 500, color: C.navy, lineHeight: 1.55, marginBottom: 8 }}>
              See exactly what would break your income — before it happens.
            </p>
            <p style={{ fontSize: 15, color: muted, lineHeight: 1.6, marginBottom: 24 }}>
              Most people discover their biggest risk after it hits. This shows it before.
            </p>

            <div style={{ marginBottom: 24, flex: 1 }}>
              {check("Structural breakdown")}
              {check("Risk scenarios")}
              {check("Score drivers")}
              {check("Improvement plan")}
              {check("12-week roadmap")}
            </div>

            <a href={process.env.NEXT_PUBLIC_STRIPE_CHECKOUT_URL || "https://buy.stripe.com/9B66oz48EaYU2lc4IF2Nq05"} style={{
              display: "flex", alignItems: "center", justifyContent: "center",
              height: 52, borderRadius: 10,
              backgroundColor: C.navy, color: C.white,
              fontSize: 16, fontWeight: 600, textDecoration: "none",
              transition: "background-color 200ms",
            }}
              onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = "#1a2540"; }}
              onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = C.navy; }}
            >
              Unlock Full Diagnostic
            </a>
            <p style={{ fontSize: 14, fontWeight: 500, color: C.teal, textAlign: "center", marginTop: 12, marginBottom: 0 }}>
              If it doesn&#8217;t reveal something new, full refund.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}


/* ================================================================== */
/* SECTION 8 — FEATURE TABLE                                           */
/* ================================================================== */

function FeatureTable() {
  const { ref, visible } = useInView();
  const m = useMobile();
  const fadeIn = useFadeIn();

  const rows = [
    { feature: "Score out of 100", free: true, paid: true },
    { feature: "Stability band", free: true, paid: true },
    { feature: "Primary constraint", free: true, paid: true },
    { feature: "Improvement direction", free: true, paid: true },
    { feature: "Full structural breakdown", free: false, paid: true },
    { feature: "PressureMap\u2122 zone analysis", free: false, paid: true },
    { feature: "Ranked disruption scenarios", free: false, paid: true },
    { feature: "What-If Simulator", free: false, paid: true },
    { feature: "Goal Mode", free: false, paid: true },
    { feature: "12-week execution roadmap", free: false, paid: true },
    { feature: "Industry-specific scripts", free: false, paid: true },
    { feature: "Command Center access", free: false, paid: true },
  ];

  return (
    <section ref={ref} style={{
      backgroundColor: C.sand,
      paddingTop: secPad(m), paddingBottom: secPad(m),
      paddingLeft: px(m), paddingRight: px(m),
    }}>
      <div style={{ maxWidth: 860, margin: "0 auto" }}>
        <h2 style={{
          fontSize: m ? 28 : 36, fontWeight: 600, lineHeight: 1.2, color: C.navy,
          textAlign: "center", marginBottom: m ? 32 : 48,
          ...fadeIn(visible),
        }}>
          What you see vs what you unlock
        </h2>

        <div style={{ overflowX: "auto", ...fadeIn(visible, 100) }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr>
                <th style={{ textAlign: "left", padding: "14px 16px", borderBottom: `2px solid rgba(14,26,43,0.10)`, color: C.navy, fontWeight: 600, fontSize: 14 }}>Feature</th>
                <th style={{ textAlign: "center", padding: "14px 16px", borderBottom: `2px solid rgba(14,26,43,0.10)`, color: C.teal, fontWeight: 600, fontSize: 14, minWidth: 80 }}>Free</th>
                <th style={{ textAlign: "center", padding: "14px 16px", borderBottom: `2px solid rgba(14,26,43,0.10)`, color: C.purple, fontWeight: 600, fontSize: 14, minWidth: 80 }}>Diagnostic</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row, i) => (
                <tr key={i}>
                  <td style={{ padding: "12px 16px", borderBottom: `1px solid ${C.border}`, color: muted, fontSize: 15 }}>{row.feature}</td>
                  <td style={{ padding: "12px 16px", borderBottom: `1px solid ${C.border}`, textAlign: "center" }}>
                    {row.free ? <span style={{ color: C.teal, fontWeight: 600 }}>&#10003;</span> : <span style={{ color: light }}>&mdash;</span>}
                  </td>
                  <td style={{ padding: "12px 16px", borderBottom: `1px solid ${C.border}`, textAlign: "center" }}>
                    <span style={{ color: C.purple, fontWeight: 600 }}>&#10003;</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}


/* ================================================================== */
/* SECTION 9 — TRANSFORMATION                                         */
/* ================================================================== */

function Transformation() {
  const { ref, visible } = useInView();
  const m = useMobile();
  const fadeIn = useFadeIn();

  const results = [
    { before: 34, after: 61 },
    { before: 28, after: 52 },
    { before: 42, after: 67 },
  ];

  return (
    <section ref={ref} style={{
      backgroundColor: C.white,
      paddingTop: secPad(m), paddingBottom: secPad(m),
      paddingLeft: px(m), paddingRight: px(m),
    }}>
      <div style={{ maxWidth: contentW, margin: "0 auto" }}>
        <h2 style={{
          fontSize: m ? 28 : 36, fontWeight: 600, lineHeight: 1.2, color: C.navy,
          textAlign: "center", marginBottom: m ? 32 : 48,
          ...fadeIn(visible),
        }}>
          They didn&#8217;t earn more.{m ? " " : <br />}They changed their structure.
        </h2>

        <div style={{
          display: "flex", gap: m ? 16 : 32,
          justifyContent: "center", flexWrap: "wrap" as const,
          marginBottom: m ? 32 : 48,
          ...fadeIn(visible, 120),
        }}>
          {results.map((r, i) => (
            <div key={i} style={{
              textAlign: "center", padding: m ? "24px 20px" : "28px 32px",
              borderRadius: 16, border: `1px solid ${C.border}`,
              backgroundColor: C.white, minWidth: m ? 140 : 180,
            }}>
              <div style={{ display: "flex", alignItems: "baseline", justifyContent: "center", gap: 8 }}>
                <span style={{ fontSize: 28, fontWeight: 300, fontFamily: mono, color: light }}>{r.before}</span>
                <span style={{ fontSize: 16, color: light }}>&rarr;</span>
                <span style={{ fontSize: 28, fontWeight: 300, fontFamily: mono, color: C.teal }}>{r.after}</span>
              </div>
            </div>
          ))}
        </div>

        <div style={{ textAlign: "center", ...fadeIn(visible, 200) }}>
          <p style={{ fontSize: 16, color: muted, lineHeight: 1.65, marginBottom: 4 }}>
            The score reveals the weakness.
          </p>
          <p style={{ fontSize: 16, color: muted, lineHeight: 1.65 }}>
            The action changes the outcome.
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
  const fadeIn = useFadeIn();

  return (
    <section ref={ref} style={{
      backgroundColor: C.navy,
      paddingTop: m ? 64 : 96, paddingBottom: m ? 64 : 96,
      paddingLeft: px(m), paddingRight: px(m),
    }}>
      <div style={{ maxWidth: 700, margin: "0 auto", textAlign: "center" }}>
        <h2 style={{
          fontSize: m ? 28 : 36, fontWeight: 600, lineHeight: 1.2,
          color: C.sand, marginBottom: 32,
          ...fadeIn(visible),
        }}>
          Your income has a structure.{m ? " " : <br />}Now you can measure it.
        </h2>

        <div style={{ ...fadeIn(visible, 150) }}>
          <Link href="/pricing" style={{
            display: "inline-flex", alignItems: "center", justifyContent: "center",
            height: 52, padding: "0 40px", borderRadius: 10,
            backgroundColor: C.white, color: C.navy,
            fontSize: 16, fontWeight: 600,
            textDecoration: "none",
            transition: "background-color 200ms",
          }}
            onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = "#E8E5DE"; }}
            onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = C.white; }}
          >
            Start Free Assessment
          </Link>

          <p style={{ fontSize: 14, color: "rgba(244,241,234,0.38)", marginTop: 16 }}>
            Under 2 minutes &bull; Instant result &bull; Private by default
          </p>
        </div>
      </div>
    </section>
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

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(PRODUCT_SCHEMA) }} />
      <main id="main-content">
        <HeroSection />
        <WhatThisIs />
        <SameIncomeProof />
        <HowItWorks />
        <SampleResult />
        <CommandCenter />
        <PricingSection />
        <FeatureTable />
        <Transformation />
        <FinalCta />
      </main>
    </div>
  );
}
