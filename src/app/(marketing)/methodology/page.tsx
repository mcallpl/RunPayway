"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import {
  C, T, mono, sans, sp, maxW, secPad, px,
  h1, h2Style, h3Style, body, bodySm, cardStyle, ctaButtonLight,
  canHover,
} from "@/lib/design-tokens";

/* ------------------------------------------------------------------ */
/*  Hooks                                                              */
/* ------------------------------------------------------------------ */
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

const fadeIn = (v: boolean, delay = 0) => ({
  opacity: v ? 1 : 0,
  transform: v ? "translateY(0)" : "translateY(16px)",
  transition: `opacity 600ms ease-out ${delay}ms, transform 600ms ease-out ${delay}ms`,
});


/* ================================================================== */
/* 1. HERO                                                             */
/* ================================================================== */
function Hero() {
  const { ref, visible } = useInView();
  const m = useMobile();
  return (
    <section ref={ref} style={{ backgroundColor: C.navy, paddingTop: m ? 120 : 180, paddingBottom: m ? 80 : 120, paddingLeft: px(m), paddingRight: px(m) }}>
      <div style={{ maxWidth: maxW, margin: "0 auto", textAlign: "center" }}>
        <div style={{ ...fadeIn(visible) }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 12, marginBottom: 28 }}>
            <span style={{ ...T.label, color: C.teal }}>Methodology</span>
          </div>
          <h1 style={{ ...h1(m), color: C.sandText, lineHeight: 1.08, letterSpacing: "-0.03em", marginBottom: 24 }}>
            Fixed rules. Deterministic scoring.{!m && <br />} Every result reproducible.
          </h1>
          <p style={{ ...body(m), color: C.sandMuted, maxWidth: 540, margin: "0 auto" }}>
            The Income Stability Score&#8482; is a deterministic structural assessment. Same inputs always produce the same score. Every rule is versioned and auditable.
          </p>
        </div>
      </div>
    </section>
  );
}


/* ================================================================== */
/* 2. PURPOSE                                                          */
/* ================================================================== */
function Purpose() {
  const { ref, visible } = useInView();
  const m = useMobile();
  return (
    <section ref={ref} style={{ backgroundColor: C.white, paddingTop: secPad(m), paddingBottom: secPad(m), paddingLeft: px(m), paddingRight: px(m) }}>
      <div style={{ maxWidth: maxW, margin: "0 auto" }}>
        <div style={{ marginBottom: sp(2), ...fadeIn(visible) }}>
          <span style={{ fontSize: 12, fontWeight: 500, letterSpacing: "0.14em", color: C.light, fontFamily: mono }}>01</span>
        </div>
        <div style={{ display: m ? "block" : "flex", gap: 64, alignItems: "flex-start", ...fadeIn(visible) }}>
          <div style={{ flex: 1, marginBottom: m ? 28 : 0 }}>
            <h2 style={{ ...h2Style(m), color: C.navy, margin: 0 }}>
              Not how much you earn.{!m && <br />} How well it holds up.
            </h2>
          </div>
          <div style={{ flex: 1 }}>
            <p style={{ ...body(m), color: C.muted, marginBottom: 16 }}>
              The Income Stability Score&#8482; quantifies structural resilience — the architecture of your income, not the amount. Two people earning the same number can have completely different stability profiles.
            </p>
            <p style={{ ...body(m), color: C.muted, margin: 0 }}>
              The model evaluates recurrence, concentration, forward visibility, variability, labor dependence, and income quality — then evaluates how these dimensions interact before producing your final score.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}


/* ================================================================== */
/* 3. DIMENSIONS                                                       */
/* ================================================================== */
function Dimensions() {
  const { ref, visible } = useInView();
  const m = useMobile();

  const dims = [
    { title: "Recurrence", desc: "Income that continues from existing agreements without new acquisition.", block: "Structure", color: C.teal },
    { title: "Concentration", desc: "Reliance on any single source. Measures what percentage flows through the largest client.", block: "Structure", color: C.purple },
    { title: "Diversification", desc: "Number of independent income streams each contributing meaningful revenue.", block: "Structure", color: C.teal },
    { title: "Forward Visibility", desc: "Income secured ahead of time under signed or enforceable agreements.", block: "Structure", color: C.purple },
    { title: "Earnings Consistency", desc: "Variation in monthly earnings over the prior 12 months.", block: "Stability", color: C.amber },
    { title: "Labor Independence", desc: "Income that continues without active work through a work interruption.", block: "Stability", color: C.navy },
  ];

  return (
    <section ref={ref} style={{ backgroundColor: C.sand, paddingTop: secPad(m), paddingBottom: secPad(m), paddingLeft: px(m), paddingRight: px(m) }}>
      <div style={{ maxWidth: maxW, margin: "0 auto" }}>
        <div style={{ marginBottom: sp(2), ...fadeIn(visible) }}>
          <span style={{ fontSize: 12, fontWeight: 500, letterSpacing: "0.14em", color: C.light, fontFamily: mono }}>02</span>
        </div>
        <div style={{ marginBottom: m ? 32 : 48, ...fadeIn(visible) }}>
          <h2 style={{ ...h2Style(m), color: C.navy, letterSpacing: "-0.02em", marginBottom: 12 }}>
            The dimensions.
          </h2>
          <p style={{ ...body(m), color: C.muted, maxWidth: 520 }}>
            Six fixed dimensions across two blocks — Structure and Stability. Each scored independently using fixed, versioned definitions.
          </p>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: m ? "1fr" : "1fr 1fr", gap: m ? 12 : 16 }}>
          {dims.map((dim, i) => (
            <div key={dim.title} style={{
              ...cardStyle, padding: m ? "20px 18px" : "24px 24px", borderRadius: 12,
              ...fadeIn(visible, 100 + i * 60),
            }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
                <span style={{ fontSize: m ? 17 : 18, fontWeight: 600, color: C.navy, borderBottom: `1.5px dotted ${C.teal}`, paddingBottom: 1 }}>{dim.title}</span>
                <span style={{ fontSize: 11, fontWeight: 500, color: C.light }}>{dim.block}</span>
              </div>
              <p style={{ ...bodySm(m), color: C.muted, margin: 0 }}>{dim.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}


/* ================================================================== */
/* 4. SCORING FRAMEWORK                                                */
/* ================================================================== */
function ScoringFramework() {
  const { ref, visible } = useInView();
  const m = useMobile();
  return (
    <section ref={ref} style={{ backgroundColor: C.white, paddingTop: secPad(m), paddingBottom: secPad(m), paddingLeft: px(m), paddingRight: px(m) }}>
      <div style={{ maxWidth: 800, margin: "0 auto" }}>
        <div style={{ marginBottom: sp(2), ...fadeIn(visible) }}>
          <span style={{ fontSize: 12, fontWeight: 500, letterSpacing: "0.14em", color: C.light, fontFamily: mono }}>03</span>
        </div>
        <div style={{ marginBottom: m ? 32 : 48, ...fadeIn(visible) }}>
          <h2 style={{ ...h2Style(m), color: C.navy, letterSpacing: "-0.02em", marginBottom: 12 }}>
            The scoring framework.
          </h2>
          <p style={{ ...body(m), color: C.muted, maxWidth: 540 }}>
            Two weighted blocks compose the final score. The model then adjusts for how dimensions interact — compound weaknesses lower the score, reinforcing strengths raise it.
          </p>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: m ? "1fr" : "1fr 1fr", gap: m ? 16 : 20 }}>
          <div style={{ padding: m ? "28px 24px" : "36px 32px", borderRadius: 14, backgroundColor: C.navy, position: "relative", overflow: "hidden", ...fadeIn(visible, 100) }}>
            <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 3, background: `linear-gradient(90deg, ${C.teal}, ${C.purple})` }} />
            <span style={{ ...T.label, fontSize: 13, color: C.teal, marginBottom: 16, display: "block" }}>Structure Block</span>
            <p style={{ ...bodySm(m), color: C.sandMuted, marginBottom: 16 }}>How your income is architecturally composed.</p>
            {["Recurrence", "Diversification", "Forward Visibility", "Concentration Resilience", "Quality"].map(name => (
              <div key={name} style={{ display: "flex", gap: 8, alignItems: "center", marginBottom: 6 }}>
                <div style={{ width: 4, height: 4, borderRadius: "50%", backgroundColor: C.teal, flexShrink: 0 }} />
                <span style={{ ...T.meta, color: C.sandMuted }}>{name}</span>
              </div>
            ))}
          </div>
          <div style={{ padding: m ? "28px 24px" : "36px 32px", borderRadius: 14, backgroundColor: C.navy, position: "relative", overflow: "hidden", ...fadeIn(visible, 200) }}>
            <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 3, background: `linear-gradient(90deg, ${C.purple}, ${C.teal})` }} />
            <span style={{ ...T.label, fontSize: 13, color: C.purple, marginBottom: 16, display: "block" }}>Stability Block</span>
            <p style={{ ...bodySm(m), color: C.sandMuted, marginBottom: 16 }}>How well the structure holds up under pressure.</p>
            {["Labor Independence", "Earnings Consistency", "Continuity"].map(name => (
              <div key={name} style={{ display: "flex", gap: 8, alignItems: "center", marginBottom: 6 }}>
                <div style={{ width: 4, height: 4, borderRadius: "50%", backgroundColor: C.purple, flexShrink: 0 }} />
                <span style={{ ...T.meta, color: C.sandMuted }}>{name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}


/* ================================================================== */
/* 5. CROSS-DIMENSION INTERACTIONS                                     */
/* ================================================================== */
function Interactions() {
  const { ref, visible } = useInView();
  const m = useMobile();
  return (
    <section ref={ref} style={{ backgroundColor: C.sand, paddingTop: secPad(m), paddingBottom: secPad(m), paddingLeft: px(m), paddingRight: px(m) }}>
      <div style={{ maxWidth: 800, margin: "0 auto" }}>
        <div style={{ marginBottom: sp(2), ...fadeIn(visible) }}>
          <span style={{ fontSize: 12, fontWeight: 500, letterSpacing: "0.14em", color: C.light, fontFamily: mono }}>04</span>
        </div>
        <div style={{ display: m ? "block" : "flex", gap: 56, alignItems: "flex-start", ...fadeIn(visible) }}>
          <div style={{ flex: 1, marginBottom: m ? 28 : 0 }}>
            <h2 style={{ ...h2Style(m), color: C.navy, margin: 0 }}>
              Weaknesses compound.{!m && <br />} The model captures that.
            </h2>
          </div>
          <div style={{ flex: 1 }}>
            <p style={{ ...body(m), color: C.muted, marginBottom: 20 }}>
              Dimensions don&#8217;t exist in isolation. High concentration paired with low forward visibility is structurally different from high concentration with strong visibility — even if both profiles score similarly on individual dimensions.
            </p>
            <p style={{ ...body(m), color: C.muted, marginBottom: 0 }}>
              The model evaluates these relationships and adjusts the final score accordingly. Compound weaknesses lower it. Reinforcing strengths raise it. This ensures the score reflects your actual structural resilience, not just an average of independent factors.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}


/* ================================================================== */
/* 6. CLASSIFICATION BANDS                                             */
/* ================================================================== */
function Bands() {
  const { ref, visible } = useInView();
  const m = useMobile();

  const bands = [
    { range: "0\u201329", label: "Limited Stability", color: C.bandLimited, desc: "High vulnerability to disruption. A single source change or work interruption could shift the entire structure." },
    { range: "30\u201349", label: "Developing Stability", color: C.bandDeveloping, desc: "Building toward stability, but not structurally protected. A major source loss would put pressure on the structure within weeks." },
    { range: "50\u201374", label: "Established Stability", color: C.bandEstablished, desc: "Solid structural foundation. Income can absorb most common disruptions without dropping below a stable threshold." },
    { range: "75\u2013100", label: "High Stability", color: C.bandHigh, desc: "Structurally sound and resilient under pressure. Can absorb a lost client, a slow quarter, or a 90-day work pause." },
  ];

  return (
    <section ref={ref} style={{ backgroundColor: C.navy, paddingTop: secPad(m), paddingBottom: secPad(m), paddingLeft: px(m), paddingRight: px(m) }}>
      <div style={{ maxWidth: 800, margin: "0 auto" }}>
        <div style={{ marginBottom: sp(2), ...fadeIn(visible) }}>
          <span style={{ fontSize: 12, fontWeight: 500, letterSpacing: "0.14em", color: C.sandLight, fontFamily: mono }}>05</span>
        </div>
        <div style={{ marginBottom: m ? 32 : 48, ...fadeIn(visible) }}>
          <h2 style={{ ...h2Style(m), color: C.sandText, letterSpacing: "-0.02em", marginBottom: 12 }}>
            The classification.
          </h2>
          <p style={{ ...body(m), color: C.sandMuted, maxWidth: 480 }}>
            Each band defines what your income structure can absorb under disruption. Fixed thresholds.
          </p>
        </div>

        <div style={{ display: "flex", height: 6, borderRadius: 3, overflow: "hidden", marginBottom: 32, ...fadeIn(visible, 100) }}>
          {bands.map((b) => (
            <div key={b.label} style={{ flex: 1, backgroundColor: b.color }} />
          ))}
        </div>

        <div style={{ display: "grid", gridTemplateColumns: m ? "1fr" : "1fr 1fr", gap: 12 }}>
          {bands.map((b, i) => (
            <div key={b.label} style={{
              ...cardStyle, padding: m ? "20px 18px" : "24px 24px", borderRadius: 12,
              backgroundColor: "rgba(244,241,234,0.04)", border: `1px solid ${C.sandBorder}`,
              position: "relative", overflow: "hidden",
              ...fadeIn(visible, 200 + i * 80),
            }}>
              <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 3, backgroundColor: b.color }} />
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
                <span style={{ fontFamily: mono, fontSize: 15, fontWeight: 700, color: b.color }}>{b.range}</span>
                <span style={{ fontSize: 15, fontWeight: 600, color: C.sandText }}>{b.label}</span>
              </div>
              <p style={{ ...T.meta, color: C.sandMuted, lineHeight: 1.55, margin: 0 }}>{b.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}


/* ================================================================== */
/* 7. ARCHITECTURE                                                     */
/* ================================================================== */
function Architecture() {
  const { ref, visible } = useInView();
  const m = useMobile();
  return (
    <section ref={ref} style={{ backgroundColor: C.white, paddingTop: secPad(m), paddingBottom: secPad(m), paddingLeft: px(m), paddingRight: px(m) }}>
      <div style={{ maxWidth: 800, margin: "0 auto" }}>
        <div style={{ marginBottom: sp(2), ...fadeIn(visible) }}>
          <span style={{ fontSize: 12, fontWeight: 500, letterSpacing: "0.14em", color: C.light, fontFamily: mono }}>06</span>
        </div>
        <div style={{ marginBottom: m ? 32 : 48, ...fadeIn(visible) }}>
          <h2 style={{ ...h2Style(m), color: C.navy, letterSpacing: "-0.02em", marginBottom: 12 }}>
            The architecture.
          </h2>
          <p style={{ ...body(m), color: C.muted, maxWidth: 520 }}>
            The score and the diagnostic report are built by separate layers. The boundary between them is fixed and auditable.
          </p>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: m ? "1fr" : "1fr 1fr", gap: m ? 16 : 20 }}>
          <div style={{ ...cardStyle, padding: m ? "24px 20px" : "32px 28px", borderRadius: 12, ...fadeIn(visible, 100) }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16 }}>
              <span style={{ ...T.label, fontSize: 11, color: C.teal }}>Layer 1</span>
            </div>
            <h3 style={{ ...h3Style(m), color: C.navy, marginBottom: 10 }}>Deterministic Core</h3>
            <p style={{ ...bodySm(m), color: C.muted, marginBottom: 16 }}>Produces the score from structural inputs only. Same inputs, same score. No contextual input can alter it.</p>
            {["Score (0\u2013100)", "Band classification", "Structural diagnosis", "Stress testing"].map(item => (
              <div key={item} style={{ display: "flex", gap: 8, alignItems: "center", marginBottom: 6 }}>
                <div style={{ width: 4, height: 4, borderRadius: "50%", backgroundColor: C.teal, flexShrink: 0 }} />
                <span style={{ ...T.meta, color: C.navy }}>{item}</span>
              </div>
            ))}
          </div>
          <div style={{ padding: m ? "24px 20px" : "32px 28px", borderRadius: 12, backgroundColor: C.navy, ...fadeIn(visible, 200) }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16 }}>
              <span style={{ ...T.label, fontSize: 11, color: C.teal }}>Layer 2</span>
            </div>
            <h3 style={{ ...h3Style(m), color: C.sandText, marginBottom: 10 }}>Outcome Layer</h3>
            <p style={{ ...bodySm(m), color: C.sandMuted, marginBottom: 16 }}>Applies your operating context to improve explanation quality and action relevance. Does not change the score.</p>
            {["Industry-specific scenarios", "Prioritized actions", "Plain English explanations", "Contextual benchmarks"].map(item => (
              <div key={item} style={{ display: "flex", gap: 8, alignItems: "center", marginBottom: 6 }}>
                <div style={{ width: 4, height: 4, borderRadius: "50%", backgroundColor: C.teal, flexShrink: 0 }} />
                <span style={{ ...T.meta, color: C.sandMuted }}>{item}</span>
              </div>
            ))}
          </div>
        </div>

        <p style={{ ...bodySm(m), color: C.muted, textAlign: "center", marginTop: 28, maxWidth: 540, margin: "28px auto 0" }}>
          A real estate agent and a SaaS founder with identical inputs get the same score — but different scenarios, action plans, and structural context.
        </p>
      </div>
    </section>
  );
}


/* ================================================================== */
/* 8. INTEGRITY                                                        */
/* ================================================================== */
function Integrity() {
  const { ref, visible } = useInView();
  const m = useMobile();

  const principles = [
    { title: "No bank connections", desc: "We never access financial accounts, credit data, or transaction history." },
    { title: "No machine learning", desc: "Fixed, deterministic rules. No probabilistic scoring, no adaptive logic." },
    { title: "No subjective judgment", desc: "The model applies the same rules to every assessment. No human override." },
    { title: "Fully versioned", desc: "Every assessment records the model version. Results are reproducible." },
    { title: "No artificial precision", desc: "If a comparison cannot be rigorously supported, we use category framing." },
    { title: "Explainable", desc: "The system explains what determines the score and what the contextual layer changes." },
  ];

  return (
    <section ref={ref} style={{ backgroundColor: C.sand, paddingTop: secPad(m), paddingBottom: secPad(m), paddingLeft: px(m), paddingRight: px(m) }}>
      <div style={{ maxWidth: 800, margin: "0 auto" }}>
        <div style={{ marginBottom: sp(2), ...fadeIn(visible) }}>
          <span style={{ fontSize: 12, fontWeight: 500, letterSpacing: "0.14em", color: C.light, fontFamily: mono }}>07</span>
        </div>
        <div style={{ marginBottom: m ? 32 : 48, ...fadeIn(visible) }}>
          <h2 style={{ ...h2Style(m), color: C.navy, letterSpacing: "-0.02em" }}>
            What we will never do.
          </h2>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: m ? "1fr" : "1fr 1fr", gap: m ? 12 : 16 }}>
          {principles.map((p, i) => (
            <div key={p.title} style={{
              ...cardStyle, padding: m ? "20px 18px" : "24px 24px", borderRadius: 12,
              ...fadeIn(visible, 80 + i * 50),
            }}>
              <div style={{ fontSize: m ? 15 : 16, fontWeight: 600, color: C.navy, marginBottom: 6 }}>{p.title}</div>
              <p style={{ ...T.meta, color: C.muted, lineHeight: 1.55, margin: 0 }}>{p.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}


/* ================================================================== */
/* 9. CTA                                                              */
/* ================================================================== */
function Cta() {
  const { ref, visible } = useInView();
  const m = useMobile();
  return (
    <section ref={ref} style={{ backgroundColor: C.navy, paddingTop: secPad(m), paddingBottom: secPad(m), paddingLeft: px(m), paddingRight: px(m) }}>
      <div style={{ maxWidth: maxW, margin: "0 auto", textAlign: "center" }}>
        <div style={{ ...fadeIn(visible) }}>
          <h2 style={{ ...h2Style(m), color: C.sandText, letterSpacing: "-0.02em", marginBottom: 20 }}>
            The methodology is transparent.{!m && <br />} Now test it yourself.
          </h2>
          <p style={{ ...body(m), color: C.sandMuted, maxWidth: 440, margin: "0 auto 40px" }}>
            Same inputs, same score. See where your income structure stands.
          </p>
          <Link href="/begin" style={{
            ...ctaButtonLight, height: m ? 48 : 56, paddingLeft: 36, paddingRight: 36, borderRadius: 10,
            backgroundColor: C.white, color: C.navy,
          }}>
            Start Your Free Assessment
          </Link>
          <div style={{ marginTop: 20, ...T.meta, color: C.sandLight }}>
            Under 2 minutes &#183; Instant result &#183; <span style={{ fontFamily: mono }}>$69</span> for the full report
          </div>
        </div>
      </div>
    </section>
  );
}


/* ================================================================== */
/* EXPORT                                                              */
/* ================================================================== */
export default function MethodologyPage() {
  return (
    <div style={{ fontFamily: sans, overflowX: "hidden" }}>
      <Hero />
      <Purpose />
      <Dimensions />
      <ScoringFramework />
      <Interactions />
      <Bands />
      <Architecture />
      <Integrity />
      <Cta />
    </div>
  );
}
