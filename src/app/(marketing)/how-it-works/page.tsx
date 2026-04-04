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
    <header ref={ref} style={{
      backgroundColor: C.navy,
      paddingTop: m ? 80 : 120, paddingBottom: m ? 48 : 80,
      paddingLeft: px(m), paddingRight: px(m),
    }}>
      <div style={{ maxWidth: contentW, margin: "0 auto" }}>
        <div style={{
          fontSize: 12, fontWeight: 500, letterSpacing: "0.12em", textTransform: "uppercase" as const,
          color: C.teal, marginBottom: 16,
          ...fadeIn(visible),
        }}>
          How It Works
        </div>

        <h1 style={{
          fontSize: m ? 36 : 48, fontWeight: 600, lineHeight: 1.15, letterSpacing: "-0.02em",
          color: C.sand, marginBottom: 24, maxWidth: 600,
          ...fadeIn(visible, 80),
        }}>
          The system behind your score.
        </h1>

        <div style={{ maxWidth: 560, ...fadeIn(visible, 160) }}>
          <p style={{ fontSize: 16, color: "rgba(244,241,234,0.55)", lineHeight: 1.65, marginBottom: 12 }}>
            RunPayway&#8482; measures how your income is structured — not how much you earn.
          </p>
          <p style={{ fontSize: 16, color: "rgba(244,241,234,0.55)", lineHeight: 1.65 }}>
            The model is fixed, versioned, and deterministic. Identical inputs always produce identical outputs.
          </p>
        </div>

        {/* Model declaration strip */}
        <div style={{
          marginTop: m ? 40 : 56,
          paddingTop: m ? 24 : 32,
          borderTop: "1px solid rgba(244,241,234,0.08)",
          ...fadeIn(visible, 280),
        }}>
          <div style={{ fontSize: 14, fontWeight: 500, color: "rgba(244,241,234,0.50)", marginBottom: 6 }}>
            RunPayway&#8482; Structural Income Classification System
          </div>
          <p style={{ fontSize: 13, color: "rgba(244,241,234,0.30)", letterSpacing: "0.02em", margin: 0 }}>
            Model RP-2.0 &bull; Version 2.0 &bull; Deterministic &bull; Version-controlled &bull; Audit-reproducible
          </p>
        </div>
      </div>
    </header>
  );
}


/* ================================================================== */
/* SECTION 2 — SYSTEM OVERVIEW                                         */
/* ================================================================== */

function SystemOverview() {
  const { ref, visible } = useInView();
  const m = useMobile();
  const fadeIn = useFadeIn();

  return (
    <section ref={ref} style={{
      backgroundColor: C.white,
      paddingTop: secPad(m), paddingBottom: secPad(m),
      paddingLeft: px(m), paddingRight: px(m),
    }}>
      <div style={{ maxWidth: 700, margin: "0 auto" }}>
        <h2 style={{
          fontSize: m ? 28 : 32, fontWeight: 600, lineHeight: 1.2, color: C.navy, marginBottom: 20,
          ...fadeIn(visible),
        }}>
          What the system measures.
        </h2>
        <p style={{
          fontSize: 16, color: muted, lineHeight: 1.65, marginBottom: 16,
          ...fadeIn(visible, 80),
        }}>
          Income is typically evaluated by amount.
        </p>
        <p style={{
          fontSize: 16, color: muted, lineHeight: 1.65, marginBottom: 24,
          ...fadeIn(visible, 140),
        }}>
          RunPayway&#8482; evaluates how income is built — and how it holds under disruption.
        </p>
        <p style={{
          fontSize: 16, fontWeight: 500, color: C.navy, lineHeight: 1.65,
          ...fadeIn(visible, 200),
        }}>
          It measures structure before outcomes change.
        </p>
      </div>
    </section>
  );
}


/* ================================================================== */
/* SECTION 3 — THE PROCESS                                             */
/* ================================================================== */

function TheProcess() {
  const { ref, visible } = useInView();
  const m = useMobile();
  const fadeIn = useFadeIn();

  const steps = [
    {
      num: "01", title: "Structural intake",
      body: "You complete a structured assessment across six defined dimensions.",
      detail: "Each dimension isolates a specific aspect of how income is built.",
      notes: ["No financial documents required.", "No bank connection."],
    },
    {
      num: "02", title: "Deterministic scoring",
      body: "Each dimension is evaluated independently using fixed definitions.",
      detail: "The model then combines these evaluations into a single score from 0 to 100.",
      notes: ["Same inputs always produce the same score."],
    },
    {
      num: "03", title: "Issued result",
      body: "The system produces a standardized output:",
      detail: null,
      notes: ["Score", "Stability band", "Primary constraint", "Stress test", "Distance to next band"],
    },
    {
      num: "04", title: "Diagnostic expansion",
      body: "The diagnostic layer applies context to expand explanation clarity.",
      detail: null,
      notes: ["Structural interpretation", "Scenario relevance", "Action prioritization"],
      warning: "This layer does not influence the score.",
    },
  ];

  return (
    <section ref={ref} style={{
      backgroundColor: C.sand,
      paddingTop: secPad(m), paddingBottom: secPad(m),
      paddingLeft: px(m), paddingRight: px(m),
    }}>
      <div style={{ maxWidth: contentW, margin: "0 auto" }}>
        <h2 style={{
          fontSize: m ? 28 : 32, fontWeight: 600, lineHeight: 1.2, color: C.navy, marginBottom: 12,
          ...fadeIn(visible),
        }}>
          The process.
        </h2>
        <p style={{
          fontSize: 16, color: muted, lineHeight: 1.65, marginBottom: 8,
          ...fadeIn(visible, 60),
        }}>
          Each stage operates under fixed evaluation rules.
        </p>
        <p style={{
          fontSize: 16, color: muted, lineHeight: 1.65, marginBottom: m ? 40 : 56,
          ...fadeIn(visible, 100),
        }}>
          No interpretation layer exists within scoring.
        </p>

        <div style={{ display: "flex", flexDirection: "column" as const, gap: m ? 24 : 32 }}>
          {steps.map((step, i) => (
            <div key={i} style={{
              display: m ? "block" : "flex", gap: 40,
              ...fadeIn(visible, 140 + i * 60),
            }}>
              {/* Left — step number */}
              <div style={{ flexShrink: 0, minWidth: 80, marginBottom: m ? 8 : 0 }}>
                <div style={{ fontSize: 12, fontWeight: 500, letterSpacing: "0.12em", color: C.teal }}>{step.num}</div>
              </div>

              {/* Right — content */}
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 20, fontWeight: 500, color: C.navy, marginBottom: 12 }}>{step.title}</div>
                <p style={{ fontSize: 16, color: muted, lineHeight: 1.65, marginBottom: step.detail ? 8 : 16 }}>{step.body}</p>
                {step.detail && <p style={{ fontSize: 16, color: muted, lineHeight: 1.65, marginBottom: 16 }}>{step.detail}</p>}
                <div style={{ display: "flex", flexDirection: "column" as const, gap: 6 }}>
                  {step.notes.map((note, j) => (
                    <div key={j} style={{ display: "flex", alignItems: "flex-start", gap: 8 }}>
                      <span style={{ width: 5, height: 5, borderRadius: "50%", backgroundColor: C.teal, flexShrink: 0, marginTop: 7 }} />
                      <span style={{ fontSize: 15, color: muted, lineHeight: 1.5 }}>{note}</span>
                    </div>
                  ))}
                </div>
                {(step as { warning?: string }).warning && (
                  <p style={{ fontSize: 14, fontWeight: 500, color: C.purple, marginTop: 16, fontStyle: "italic" }}>
                    {(step as { warning?: string }).warning}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}


/* ================================================================== */
/* SECTION 4 — THE DIMENSIONS                                          */
/* ================================================================== */

function TheDimensions() {
  const { ref, visible } = useInView();
  const m = useMobile();
  const fadeIn = useFadeIn();

  const dims = [
    { name: "Recurrence", desc: "Measures the proportion of income that renews without new acquisition." },
    { name: "Concentration", desc: "Measures reliance on the largest income source." },
    { name: "Diversification", desc: "Measures the number of independent income sources contributing meaningfully." },
    { name: "Forward Visibility", desc: "Measures how much income is secured ahead of time." },
    { name: "Earnings Consistency", desc: "Measures variability in income over time." },
    { name: "Labor Independence", desc: "Measures how much income continues without active work." },
  ];

  return (
    <section ref={ref} style={{
      backgroundColor: C.white,
      paddingTop: secPad(m), paddingBottom: secPad(m),
      paddingLeft: px(m), paddingRight: px(m),
    }}>
      <div style={{ maxWidth: contentW, margin: "0 auto" }}>
        <h2 style={{
          fontSize: m ? 28 : 32, fontWeight: 600, lineHeight: 1.2, color: C.navy, marginBottom: 12,
          ...fadeIn(visible),
        }}>
          The dimensions.
        </h2>
        <p style={{
          fontSize: 16, color: muted, lineHeight: 1.65, marginBottom: 8,
          ...fadeIn(visible, 60),
        }}>
          Six structural dimensions are evaluated using fixed definitions.
        </p>
        <p style={{
          fontSize: 16, color: muted, lineHeight: 1.65, marginBottom: m ? 32 : 48,
          ...fadeIn(visible, 100),
        }}>
          Each dimension contributes independently before interaction analysis produces the final score.
        </p>

        <div style={{
          display: "grid",
          gridTemplateColumns: m ? "1fr" : "1fr 1fr 1fr",
          gap: m ? 12 : 16,
          ...fadeIn(visible, 160),
        }}>
          {dims.map((d, i) => (
            <div key={i} style={{
              padding: m ? 20 : 24, borderRadius: 16,
              border: `1px solid ${C.border}`,
              backgroundColor: C.white,
            }}>
              <div style={{ fontSize: 16, fontWeight: 500, color: C.navy, marginBottom: 8 }}>{d.name}</div>
              <p style={{ fontSize: 14, color: muted, lineHeight: 1.6, margin: 0 }}>{d.desc}</p>
            </div>
          ))}
        </div>

        <p style={{
          fontSize: 14, color: light, textAlign: "center", marginTop: 24,
          ...fadeIn(visible, 240),
        }}>
          Cross-dimensional interaction determines final structural integrity.
        </p>
      </div>
    </section>
  );
}


/* ================================================================== */
/* SECTION 5 — OUTPUT SUMMARY                                          */
/* ================================================================== */

function OutputSummary() {
  const { ref, visible } = useInView();
  const m = useMobile();
  const fadeIn = useFadeIn();

  const outputs = [
    { label: "Score (0\u2013100)", desc: "Scalar measure of structural integrity." },
    { label: "Stability Band", desc: "Classification based on score range." },
    { label: "Primary Constraint", desc: "Most limiting structural factor." },
    { label: "Stress Test", desc: "Impact of losing the largest income source." },
    { label: "Distance to Next Band", desc: "Points required to reach the next classification." },
  ];

  return (
    <section ref={ref} style={{
      backgroundColor: C.sand,
      paddingTop: secPad(m), paddingBottom: secPad(m),
      paddingLeft: px(m), paddingRight: px(m),
    }}>
      <div style={{ maxWidth: 700, margin: "0 auto" }}>
        <h2 style={{
          fontSize: m ? 28 : 32, fontWeight: 600, lineHeight: 1.2, color: C.navy, marginBottom: 12,
          ...fadeIn(visible),
        }}>
          What your score produces.
        </h2>
        <p style={{
          fontSize: 16, color: muted, lineHeight: 1.65, marginBottom: m ? 32 : 40,
          ...fadeIn(visible, 80),
        }}>
          Every assessment produces a standardized output.
        </p>

        <div style={{ display: "flex", flexDirection: "column" as const, gap: 12, ...fadeIn(visible, 140) }}>
          {outputs.map((o, i) => (
            <div key={i} style={{
              padding: m ? "16px 18px" : "18px 24px", borderRadius: 12,
              backgroundColor: C.white, border: `1px solid ${C.border}`,
              display: "flex", alignItems: "baseline", justifyContent: "space-between",
              gap: 16, flexWrap: "wrap" as const,
            }}>
              <span style={{ fontSize: 16, fontWeight: 500, color: C.navy }}>{o.label}</span>
              <span style={{ fontSize: 14, color: muted }}>{o.desc}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}


/* ================================================================== */
/* SECTION 6 — CLASSIFICATION PREVIEW                                  */
/* ================================================================== */

function ClassificationPreview() {
  const { ref, visible } = useInView();
  const m = useMobile();
  const fadeIn = useFadeIn();

  const bands = [
    { range: "0\u201329", label: "Limited Stability", desc: "Highly vulnerable to disruption.", color: "#9B2C2C" },
    { range: "30\u201349", label: "Developing Stability", desc: "Not structurally protected.", color: "#92640A" },
    { range: "50\u201374", label: "Established Stability", desc: "Stable under typical conditions.", color: "#2B5EA7" },
    { range: "75\u2013100", label: "High Stability", desc: "Resilient under significant disruption.", color: C.teal },
  ];

  return (
    <section ref={ref} style={{
      backgroundColor: C.white,
      paddingTop: secPad(m), paddingBottom: secPad(m),
      paddingLeft: px(m), paddingRight: px(m),
    }}>
      <div style={{ maxWidth: contentW, margin: "0 auto" }}>
        <h2 style={{
          fontSize: m ? 28 : 32, fontWeight: 600, lineHeight: 1.2, color: C.navy, marginBottom: 12,
          ...fadeIn(visible),
        }}>
          The classification.
        </h2>
        <p style={{
          fontSize: 16, color: muted, lineHeight: 1.65, marginBottom: m ? 32 : 48,
          ...fadeIn(visible, 80),
        }}>
          Each band defines what your structure can absorb under disruption.
        </p>

        <div style={{
          display: "grid",
          gridTemplateColumns: m ? "1fr" : "1fr 1fr 1fr 1fr",
          gap: m ? 12 : 16,
          ...fadeIn(visible, 140),
        }}>
          {bands.map((b, i) => (
            <div key={i} style={{
              padding: m ? 20 : 24, borderRadius: 16,
              border: `1px solid ${C.border}`,
              borderTop: `3px solid ${b.color}`,
            }}>
              <div style={{ fontSize: 14, fontFamily: mono, fontWeight: 500, color: b.color, marginBottom: 8 }}>{b.range}</div>
              <div style={{ fontSize: 16, fontWeight: 500, color: C.navy, marginBottom: 8 }}>{b.label}</div>
              <p style={{ fontSize: 14, color: muted, lineHeight: 1.55, margin: 0 }}>{b.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}


/* ================================================================== */
/* SECTION 7 — ARCHITECTURE OVERVIEW                                   */
/* ================================================================== */

function ArchitectureOverview() {
  const { ref, visible } = useInView();
  const m = useMobile();
  const fadeIn = useFadeIn();

  return (
    <section ref={ref} style={{
      backgroundColor: C.sand,
      paddingTop: secPad(m), paddingBottom: secPad(m),
      paddingLeft: px(m), paddingRight: px(m),
    }}>
      <div style={{ maxWidth: contentW, margin: "0 auto" }}>
        <h2 style={{
          fontSize: m ? 28 : 32, fontWeight: 600, lineHeight: 1.2, color: C.navy, marginBottom: 12,
          ...fadeIn(visible),
        }}>
          The architecture.
        </h2>
        <p style={{
          fontSize: 16, color: muted, lineHeight: 1.65, marginBottom: 8,
          ...fadeIn(visible, 60),
        }}>
          The system operates in two distinct layers.
        </p>
        <p style={{
          fontSize: 16, color: muted, lineHeight: 1.65, marginBottom: m ? 32 : 48,
          ...fadeIn(visible, 100),
        }}>
          The boundary between them is fixed and auditable.
        </p>

        <div style={{
          display: m ? "block" : "grid", gridTemplateColumns: "1fr 1fr",
          gap: m ? 16 : 24,
          ...fadeIn(visible, 160),
        }}>
          {/* Deterministic Core */}
          <div style={{
            padding: m ? 24 : 32, borderRadius: 16,
            backgroundColor: C.white, border: `1px solid ${C.border}`,
            marginBottom: m ? 16 : 0,
          }}>
            <div style={{ fontSize: 12, fontWeight: 500, letterSpacing: "0.10em", textTransform: "uppercase" as const, color: C.teal, marginBottom: 16 }}>
              Deterministic Core
            </div>
            <p style={{ fontSize: 16, color: muted, lineHeight: 1.65, marginBottom: 20 }}>
              Produces the score using structural inputs only.
            </p>
            <div style={{ display: "flex", flexDirection: "column" as const, gap: 8, marginBottom: 20 }}>
              {["Score", "Band", "Constraint", "Stress test"].map((item, i) => (
                <div key={i} style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <span style={{ width: 5, height: 5, borderRadius: "50%", backgroundColor: C.teal, flexShrink: 0 }} />
                  <span style={{ fontSize: 15, color: C.navy }}>{item}</span>
                </div>
              ))}
            </div>
            <p style={{ fontSize: 14, fontWeight: 500, color: C.navy, margin: 0 }}>
              No contextual input can alter the result.
            </p>
          </div>

          {/* Outcome Layer */}
          <div style={{
            padding: m ? 24 : 32, borderRadius: 16,
            backgroundColor: C.white, border: `1px solid ${C.border}`,
          }}>
            <div style={{ fontSize: 12, fontWeight: 500, letterSpacing: "0.10em", textTransform: "uppercase" as const, color: C.purple, marginBottom: 16 }}>
              Outcome Layer
            </div>
            <p style={{ fontSize: 16, color: muted, lineHeight: 1.65, marginBottom: 20 }}>
              Enhances interpretation using context.
            </p>
            <div style={{ display: "flex", flexDirection: "column" as const, gap: 8, marginBottom: 20 }}>
              {["Industry patterns", "Scenario framing", "Action prioritization"].map((item, i) => (
                <div key={i} style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <span style={{ width: 5, height: 5, borderRadius: "50%", backgroundColor: C.purple, flexShrink: 0 }} />
                  <span style={{ fontSize: 15, color: C.navy }}>{item}</span>
                </div>
              ))}
            </div>
            <p style={{ fontSize: 14, fontWeight: 500, color: C.navy, margin: 0 }}>
              Does not modify the score.
            </p>
          </div>
        </div>

        {/* Critical boundary line */}
        <div style={{
          marginTop: m ? 24 : 36,
          padding: "16px 24px", borderRadius: 10,
          backgroundColor: C.white,
          border: `1px solid rgba(75,63,174,0.12)`,
          borderLeft: `3px solid ${C.purple}`,
          ...fadeIn(visible, 240),
        }}>
          <p style={{ fontSize: 15, fontWeight: 500, color: C.navy, margin: 0, lineHeight: 1.55 }}>
            The Outcome Layer cannot modify, influence, or override the Deterministic Core under any condition.
          </p>
        </div>
      </div>
    </section>
  );
}


/* ================================================================== */
/* SECTION 8 — FINAL CTA                                               */
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
          fontSize: m ? 28 : 32, fontWeight: 600, lineHeight: 1.2,
          color: C.sand, marginBottom: 16,
          ...fadeIn(visible),
        }}>
          You&#8217;ve seen how the system works.{m ? " " : <br />}Now apply it to your structure.
        </h2>
        <p style={{
          fontSize: 16, color: "rgba(244,241,234,0.55)", lineHeight: 1.65, marginBottom: 32,
          ...fadeIn(visible, 80),
        }}>
          The assessment takes under 2 minutes. Every dimension scored. Every result reproducible.
        </p>

        <div style={{ ...fadeIn(visible, 160) }}>
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
            Start Your Free Assessment
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
/* PAGE EXPORT                                                         */
/* ================================================================== */

export default function HowItWorksPage() {
  return (
    <div className="overflow-x-hidden">
      <main>
        <HeroSection />
        <SystemOverview />
        <TheProcess />
        <TheDimensions />
        <OutputSummary />
        <ClassificationPreview />
        <ArchitectureOverview />
        <FinalCta />
      </main>
    </div>
  );
}
