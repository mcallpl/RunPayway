"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import logoWhite from "../../../../public/runpayway-logo-white.png";
import { C, T, mono, sans, sp, secPad, px, h1, h2Style, h3Style, body, bodySm, cardStyle, ctaButton, ctaButtonLight, canHover } from "@/lib/design-tokens";

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

/* ------------------------------------------------------------------ */
/*  Constants                                                          */
/* ------------------------------------------------------------------ */

const MAX = 1080;

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
      <div style={{ maxWidth: MAX, margin: "0 auto" }}>
        <div style={{ maxWidth: 700, ...fadeIn(visible) }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 28 }}>
            <span style={{ ...T.label, color: C.teal }}>How It Works</span>
          </div>
          <h1 style={{ ...h1(m), color: C.sandText, lineHeight: 1.08, letterSpacing: "-0.03em", marginBottom: 24 }}>
            The system behind{!m && <br />} your score.
          </h1>
          <p style={{ ...body(m), color: C.sandMuted, maxWidth: 540, marginBottom: 0 }}>
            RunPayway&#8482; evaluates the structural integrity of how your income is built. The model is fixed, versioned, and deterministic. Identical inputs always produce identical outputs.
          </p>
        </div>
      </div>
    </section>
  );
}


/* ================================================================== */
/* 2. THE PROCESS — 4 steps                                            */
/* ================================================================== */
function Process() {
  const { ref, visible } = useInView();
  const m = useMobile();

  const steps = [
    {
      num: "01",
      title: "Structural intake",
      body: "You complete a structured assessment across six fixed dimensions. Each dimension isolates one aspect of how your income is built. No dollar amounts. No bank connection. No document upload.",
      screen: (
        <div style={{ padding: m ? "16px 14px" : "20px 18px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
            <div style={{ ...T.label, fontSize: 11, color: C.teal }}>Assessment</div>
            <div style={{ fontSize: 10, fontFamily: mono, color: C.sandLight }}>6 dimensions</div>
          </div>
          <div style={{ fontSize: m ? 14 : 15, fontWeight: 600, color: C.sandText, marginBottom: 5, lineHeight: 1.35 }}>Each question targets a specific structural dimension of your income.</div>
          <div style={{ fontSize: 10, color: C.sandLight, marginBottom: 12, fontStyle: "italic" }}>Multiple-choice format. No financial documents required.</div>
          {[
            { letter: "A", text: "Answer option A" },
            { letter: "B", text: "Answer option B" },
            { letter: "C", text: "Answer option C", selected: true },
            { letter: "D", text: "Answer option D" },
            { letter: "E", text: "Answer option E" },
          ].map((opt) => (
            <div key={opt.letter} style={{ display: "flex", gap: 8, alignItems: "center", padding: "8px 10px", marginBottom: 4, borderRadius: 6, backgroundColor: opt.selected ? "rgba(31,109,122,0.15)" : C.sandBorder, border: opt.selected ? `1px solid ${C.teal}` : `1px solid ${C.sandBorder}` }}>
              <span style={{ fontFamily: mono, fontSize: 11, fontWeight: 600, color: opt.selected ? C.teal : C.sandLight, minWidth: 12 }}>{opt.letter}</span>
              <span style={{ fontSize: 13, color: opt.selected ? C.teal : C.sandMuted, fontWeight: opt.selected ? 600 : 400 }}>{opt.text}</span>
            </div>
          ))}
        </div>
      ),
    },
    {
      num: "02",
      title: "Deterministic scoring",
      body: "The model scores each dimension independently, evaluates how they interact, and produces a single score from 0 to 100. Same inputs always produce the same score.",
      screen: (
        <div style={{ padding: m ? "16px 14px" : "20px 18px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
            <div style={{ ...T.label, fontSize: 11, color: C.sandLight }}>Scoring Process</div>
            <div style={{ fontSize: 10, fontFamily: mono, color: C.teal }}>Deterministic</div>
          </div>
          {[
            { label: "Dimension scoring", sub: "Each dimension evaluated independently", done: true },
            { label: "Interaction analysis", sub: "Cross-dimension relationships assessed", done: true },
            { label: "Score composition", sub: "Weighted combination into single score", done: true },
            { label: "Structural diagnosis", sub: "Constraints and vulnerabilities identified", done: false },
          ].map((step, i) => (
            <div key={step.label} style={{ marginBottom: 10 }}>
              <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                <div style={{ width: 16, height: 16, borderRadius: "50%", backgroundColor: step.done ? C.teal : C.sandBorder, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  {step.done && <svg width="8" height="8" viewBox="0 0 10 10"><path d="M2 5L4 7L8 3" stroke={C.sandText} strokeWidth="1.5" fill="none" strokeLinecap="round" /></svg>}
                </div>
                <span style={{ fontSize: 12, color: step.done ? C.sandMuted : C.sandLight, fontWeight: 500 }}>{step.label}</span>
              </div>
              <div style={{ fontSize: 10, fontFamily: mono, color: C.sandLight, marginLeft: 24, marginTop: 2 }}>{step.sub}</div>
            </div>
          ))}
          <div style={{ height: 3, borderRadius: 2, backgroundColor: C.sandBorder, marginTop: 6 }}>
            <div style={{ height: 3, borderRadius: 2, backgroundColor: C.teal, width: "75%" }} />
          </div>
        </div>
      ),
    },
    {
      num: "03",
      title: "Issued result",
      body: "Your Income Stability Score\u2122 is issued instantly. The free result includes your score, stability band, distance to the next band, primary structural constraint, and a projected stress test.",
      screen: (
        <div style={{ padding: m ? "16px 14px" : "20px 18px" }}>
          <div style={{ textAlign: "center", marginBottom: 10 }}>
            <div style={{ fontSize: 10, fontFamily: mono, color: C.sandLight, marginBottom: 8, letterSpacing: "0.08em" }}>ISSUED RESULT</div>
            <div style={{ fontFamily: mono, fontSize: 44, fontWeight: 600, color: C.sandText, lineHeight: 1 }}>72</div>
            <div style={{ fontFamily: mono, fontSize: 12, color: C.sandLight, marginTop: 2 }}>/ 100</div>
          </div>
          <div style={{ display: "flex", justifyContent: "center", marginBottom: 10 }}>
            <div style={{ display: "inline-flex", alignItems: "center", gap: 5, padding: "3px 10px", borderRadius: 100, backgroundColor: "rgba(43,94,167,0.12)" }}>
              <div style={{ width: 5, height: 5, borderRadius: "50%", backgroundColor: C.bandEstablished }} />
              <span style={{ fontSize: 12, fontWeight: 600, color: C.bandEstablished }}>Established Stability</span>
            </div>
          </div>
          <div style={{ height: 1, backgroundColor: C.sandBorder, margin: "10px 0" }} />
          <div style={{ fontSize: 11, color: C.sandMuted, marginBottom: 3 }}>Primary constraint: <span style={{ color: C.sandText, fontWeight: 500 }}>Income concentration</span></div>
          <div style={{ fontSize: 11, color: C.sandMuted }}>Stress test: Largest source removed &rarr; <span style={{ fontFamily: mono, color: C.sandText }}>44</span></div>
          <div style={{ fontSize: 11, fontFamily: mono, color: C.teal, marginTop: 6, fontWeight: 500 }}>3 points to High Stability</div>
        </div>
      ),
    },
    {
      num: "04",
      title: "Full diagnostic",
      body: "The $69 report applies your operating structure, income model, and industry sector to produce a 4-page structural diagnosis. Includes PressureMap\u2122 intelligence, ranked risk scenarios, stress testing, projected actions, and lifetime Command Center access.",
      screen: (
        <div style={{ padding: m ? "16px 14px" : "20px 18px" }}>
          <div style={{ fontSize: 10, fontFamily: mono, color: C.sandLight, marginBottom: 12, letterSpacing: "0.08em" }}>DIAGNOSTIC REPORT</div>
          {[
            { num: "01", title: "Cover & Score", sub: "Score, band, constraint, access code", color: C.purple },
            { num: "02", title: "Key Findings", sub: "PressureMap\u2122, income structure, plain English", color: C.teal },
            { num: "03", title: "Stability Plan", sub: "Actions, roadmap, combined projection", color: C.purple },
            { num: "04", title: "Stress Testing", sub: "Scenarios, fragility, Command Center access", color: C.teal },
          ].map((p, i) => (
            <div key={p.num} style={{ display: "flex", gap: 8, padding: "8px 0", borderBottom: i < 3 ? `1px solid ${C.sandBorder}` : "none" }}>
              <span style={{ fontFamily: mono, fontSize: 11, fontWeight: 700, color: p.color, minWidth: 18, marginTop: 1 }}>{p.num}</span>
              <div>
                <div style={{ fontSize: 13, fontWeight: 600, color: C.sandText, marginBottom: 1 }}>{p.title}</div>
                <div style={{ fontSize: 10, color: C.sandLight, lineHeight: 1.4 }}>{p.sub}</div>
              </div>
            </div>
          ))}
        </div>
      ),
    },
  ];

  return (
    <section ref={ref} style={{ backgroundColor: C.sand, paddingTop: secPad(m), paddingBottom: secPad(m), paddingLeft: px(m), paddingRight: px(m) }}>
      <div style={{ maxWidth: MAX, margin: "0 auto" }}>
        <div style={{ marginBottom: sp(2), ...fadeIn(visible) }}>
          <span style={{ fontSize: 12, fontWeight: 500, letterSpacing: "0.14em", color: C.light, fontFamily: mono }}>01</span>
        </div>
        <div style={{ marginBottom: m ? 48 : 64, ...fadeIn(visible) }}>
          <h2 style={{ ...h2Style(m), color: C.navy, letterSpacing: "-0.02em", marginBottom: 12 }}>
            The process.
          </h2>
          <p style={{ ...body(m), color: C.muted, maxWidth: 520 }}>
            From structural intake to issued result. Every stage is fixed, versioned, and reproducible.
          </p>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: m ? 48 : 64 }}>
          {steps.map((step, i) => (
            <div key={step.num} style={{
              display: m ? "flex" : "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: m ? 20 : 48,
              flexDirection: "column",
              alignItems: m ? "stretch" : "center",
              ...fadeIn(visible, 100 + i * 120),
            }}>
              {/* Screen preview */}
              <div style={{ order: m ? 0 : i % 2 === 1 ? 1 : 0 }}>
                <div style={{ backgroundColor: C.navy, borderRadius: 14, overflow: "hidden", boxShadow: "0 6px 24px rgba(14,26,43,0.10)", border: `1px solid ${C.border}` }}>
                  <div style={{ padding: "6px 12px 0", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <Image src={logoWhite} alt="RunPayway" width={80} height={10} style={{ height: "auto", opacity: 0.5 }} />
                    <span style={{ fontSize: 11, fontFamily: mono, color: C.sandLight }}>{step.num}</span>
                  </div>
                  {step.screen}
                </div>
              </div>

              {/* Description */}
              <div style={{ display: "flex", flexDirection: "column", justifyContent: "center", order: m ? 1 : i % 2 === 1 ? 0 : 1 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
                  <span style={{ fontFamily: mono, fontSize: 13, fontWeight: 700, color: C.teal }}>{step.num}</span>
                  <h3 style={{ ...h3Style(m), color: C.navy, margin: 0 }}>{step.title}</h3>
                </div>
                <p style={{ ...body(m), color: C.muted, margin: 0 }}>{step.body}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}


/* ================================================================== */
/* 3. THE DIMENSIONS                                                   */
/* ================================================================== */
function Dimensions() {
  const { ref, visible } = useInView();
  const m = useMobile();

  const dims = [
    { title: "Recurrence", desc: "Income that continues from existing agreements without new acquisition. Measures how much of your revenue renews automatically.", block: "Structure" },
    { title: "Concentration", desc: "Reliance on any single source. Measures what percentage of total income flows through the largest client or channel.", block: "Structure" },
    { title: "Diversification", desc: "Number of independent income streams. Measures how many separate sources each contribute meaningful revenue.", block: "Structure" },
    { title: "Forward Visibility", desc: "Income secured ahead of time. Measures how many months of future revenue are already contractually committed.", block: "Structure" },
    { title: "Earnings Consistency", desc: "Variation in monthly earnings. Measures how predictable income is from month to month.", block: "Stability" },
    { title: "Labor Independence", desc: "Income that continues without active work. Measures what percentage would persist through a work interruption.", block: "Stability" },
  ];

  return (
    <section ref={ref} style={{ backgroundColor: C.white, paddingTop: secPad(m), paddingBottom: secPad(m), paddingLeft: px(m), paddingRight: px(m) }}>
      <div style={{ maxWidth: MAX, margin: "0 auto" }}>
        <div style={{ marginBottom: sp(2), ...fadeIn(visible) }}>
          <span style={{ fontSize: 12, fontWeight: 500, letterSpacing: "0.14em", color: C.light, fontFamily: mono }}>02</span>
        </div>
        <div style={{ maxWidth: 600, marginBottom: m ? 40 : 56, ...fadeIn(visible) }}>
          <h2 style={{ ...h2Style(m), color: C.navy, letterSpacing: "-0.02em", marginBottom: 12 }}>
            The dimensions.
          </h2>
          <p style={{ ...body(m), color: C.muted }}>
            Each dimension is scored independently using fixed, versioned definitions. The model then evaluates how dimensions interact before producing your final score.
          </p>
        </div>

        {/* Dimension grid */}
        <div style={{ display: "grid", gridTemplateColumns: m ? "1fr" : "1fr 1fr", gap: m ? 12 : 16 }}>
          {dims.map((dim, i) => (
            <div key={dim.title} style={{
              padding: m ? "20px 18px" : "24px 24px",
              borderRadius: 12,
              border: `1px solid ${C.softBorder}`,
              backgroundColor: C.white,
              ...fadeIn(visible, 150 + i * 60),
            }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
                <span style={{ fontSize: m ? 17 : 18, fontWeight: 600, color: C.navy, borderBottom: `1.5px dotted ${C.teal}`, paddingBottom: 1 }}>{dim.title}</span>
                <span style={{ fontSize: 11, fontWeight: 500, color: C.light }}>{dim.block}</span>
              </div>
              <p style={{ ...bodySm(m), color: C.muted, margin: 0 }}>{dim.desc}</p>
            </div>
          ))}
        </div>

        {/* Total note */}
        <div style={{ marginTop: 24, padding: "16px 20px", borderRadius: 10, backgroundColor: C.sand, ...fadeIn(visible, 500) }}>
          <p style={{ ...T.meta, color: C.muted, margin: 0 }}>
            These six dimensions, along with cross-dimension interactions, produce a single score from <span style={{ fontFamily: mono }}>0</span> to <span style={{ fontFamily: mono }}>100</span>.
          </p>
        </div>
      </div>
    </section>
  );
}


/* ================================================================== */
/* 4. WHAT YOUR SCORE TELLS YOU                                        */
/* ================================================================== */
function Specimen() {
  const { ref, visible } = useInView();
  const m = useMobile();

  const outputs = [
    { label: "Your score", desc: "A single number from 0 to 100 representing the structural integrity of your income." },
    { label: "Stability band", desc: "Where your score falls across four classification bands, from Limited to High Stability." },
    { label: "Primary constraint", desc: "The single biggest structural weakness holding your score back." },
    { label: "Stress test", desc: "What happens to your score if your largest income source disappears." },
    { label: "Distance to next band", desc: "How many points separate you from the next stability classification." },
  ];

  return (
    <section ref={ref} style={{ backgroundColor: C.navy, paddingTop: secPad(m), paddingBottom: secPad(m), paddingLeft: px(m), paddingRight: px(m) }}>
      <div style={{ maxWidth: 720, margin: "0 auto" }}>
        <div style={{ marginBottom: sp(2), ...fadeIn(visible) }}>
          <span style={{ fontSize: 12, fontWeight: 500, letterSpacing: "0.14em", color: C.sandLight, fontFamily: mono }}>03</span>
        </div>
        <div style={{ marginBottom: m ? 40 : 56, ...fadeIn(visible) }}>
          <h2 style={{ ...h2Style(m), color: C.sandText, letterSpacing: "-0.02em", marginBottom: 12 }}>
            What your score tells you.
          </h2>
          <p style={{ ...body(m), color: C.sandMuted, maxWidth: 520 }}>
            Every assessment produces these outputs instantly. The free result includes all five.
          </p>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 12, ...fadeIn(visible, 150) }}>
          {outputs.map((item, i) => (
            <div key={item.label} style={{
              display: "flex", gap: 16, alignItems: "flex-start",
              padding: m ? "16px 16px" : "20px 24px",
              borderRadius: 10,
              backgroundColor: "rgba(255,255,255,0.04)",
              border: `1px solid ${C.sandBorder}`,
              ...fadeIn(visible, 150 + i * 60),
            }}>
              <span style={{ fontFamily: mono, fontSize: 13, fontWeight: 700, color: C.teal, minWidth: 20, marginTop: 2 }}>{String(i + 1).padStart(2, "0")}</span>
              <div>
                <div style={{ fontSize: 15, fontWeight: 600, color: C.sandText, marginBottom: 4 }}>{item.label}</div>
                <p style={{ ...bodySm(m), color: C.sandMuted, margin: 0 }}>{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}


/* ================================================================== */
/* 5. CLASSIFICATION BANDS                                             */
/* ================================================================== */
function Classification() {
  const { ref, visible } = useInView();
  const m = useMobile();

  const bands = [
    { range: "0\u201329", label: "Limited Stability", color: C.bandLimited, desc: "High vulnerability to disruption. A single source change or work interruption could shift the entire structure." },
    { range: "30\u201349", label: "Developing Stability", color: C.bandDeveloping, desc: "Building toward stability, but not structurally protected. A major source loss would put pressure on the structure within weeks." },
    { range: "50\u201374", label: "Established Stability", color: C.bandEstablished, desc: "Solid structural foundation. Income can absorb most common disruptions without dropping below a stable threshold." },
    { range: "75\u2013100", label: "High Stability", color: C.bandHigh, desc: "Structurally sound and resilient under pressure. Can absorb a lost client, a slow quarter, or a 90-day work pause." },
  ];

  return (
    <section ref={ref} style={{ backgroundColor: C.sand, paddingTop: secPad(m), paddingBottom: secPad(m), paddingLeft: px(m), paddingRight: px(m) }}>
      <div style={{ maxWidth: 800, margin: "0 auto" }}>
        <div style={{ marginBottom: sp(2), ...fadeIn(visible) }}>
          <span style={{ fontSize: 12, fontWeight: 500, letterSpacing: "0.14em", color: C.light, fontFamily: mono }}>04</span>
        </div>
        <div style={{ marginBottom: m ? 32 : 48, ...fadeIn(visible) }}>
          <h2 style={{ ...h2Style(m), color: C.navy, letterSpacing: "-0.02em", marginBottom: 12 }}>
            The classification.
          </h2>
          <p style={{ ...body(m), color: C.muted, maxWidth: 480 }}>
            Each band defines what your income structure can absorb under disruption.
          </p>
        </div>

        {/* Animated spectrum bar */}
        <div style={{ display: "flex", height: 6, borderRadius: 3, overflow: "hidden", marginBottom: 32, ...fadeIn(visible, 100) }}>
          {bands.map((b, i) => (
            <div key={b.label} style={{ flex: i === 0 ? 3 : i === 1 ? 2 : 2.5, backgroundColor: b.color }} />
          ))}
        </div>

        <div style={{ display: "grid", gridTemplateColumns: m ? "1fr" : "1fr 1fr", gap: 12 }}>
          {bands.map((b, i) => (
            <div key={b.label} style={{
              ...cardStyle, padding: m ? "20px 18px" : "24px 24px", borderRadius: 12,
              position: "relative", overflow: "hidden",
              ...fadeIn(visible, 200 + i * 80),
            }}>
              <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 3, backgroundColor: b.color }} />
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
                <span style={{ fontFamily: mono, fontSize: 15, fontWeight: 700, color: b.color }}>{b.range}</span>
                <span style={{ fontSize: 15, fontWeight: 600, color: C.navy }}>{b.label}</span>
              </div>
              <p style={{ ...T.meta, color: C.muted, lineHeight: 1.55, margin: 0 }}>{b.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}


/* ================================================================== */
/* 6. ARCHITECTURE — Layer 1 + Layer 2                                 */
/* ================================================================== */
function Architecture() {
  const { ref, visible } = useInView();
  const m = useMobile();

  return (
    <section ref={ref} style={{ backgroundColor: C.white, paddingTop: secPad(m), paddingBottom: secPad(m), paddingLeft: px(m), paddingRight: px(m) }}>
      <div style={{ maxWidth: 800, margin: "0 auto" }}>
        <div style={{ marginBottom: sp(2), ...fadeIn(visible) }}>
          <span style={{ fontSize: 12, fontWeight: 500, letterSpacing: "0.14em", color: C.light, fontFamily: mono }}>05</span>
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
          {/* Layer 1 */}
          <div style={{ ...cardStyle, padding: m ? "24px 20px" : "32px 28px", borderRadius: 12, ...fadeIn(visible, 100) }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16 }}>
              <span style={{ ...T.label, fontSize: 11, color: C.teal }}>Layer 1</span>
            </div>
            <h3 style={{ ...h3Style(m), color: C.navy, marginBottom: 10 }}>Deterministic Core</h3>
            <p style={{ ...bodySm(m), color: C.muted, marginBottom: 16 }}>Produces the score from structural inputs only. Same inputs, same score. No contextual input can alter it.</p>
            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              {["Score (0\u2013100)", "Band classification", "Structural diagnosis", "Stress testing"].map(item => (
                <div key={item} style={{ display: "flex", gap: 8, alignItems: "center" }}>
                  <div style={{ width: 4, height: 4, borderRadius: "50%", backgroundColor: C.teal, flexShrink: 0 }} />
                  <span style={{ ...T.meta, color: C.navy }}>{item}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Layer 2 */}
          <div style={{ padding: m ? "24px 20px" : "32px 28px", borderRadius: 12, backgroundColor: C.navy, ...fadeIn(visible, 200) }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16 }}>
              <span style={{ ...T.label, fontSize: 11, color: C.teal }}>Layer 2</span>
            </div>
            <h3 style={{ ...h3Style(m), color: C.sandText, marginBottom: 10 }}>Outcome Layer</h3>
            <p style={{ ...bodySm(m), color: C.sandMuted, marginBottom: 16 }}>Applies your operating context to improve explanation quality and action relevance. Does not change the score.</p>
            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              {["Industry-specific scenarios", "Prioritized actions", "Plain English explanations", "Contextual benchmarks"].map(item => (
                <div key={item} style={{ display: "flex", gap: 8, alignItems: "center" }}>
                  <div style={{ width: 4, height: 4, borderRadius: "50%", backgroundColor: C.teal, flexShrink: 0 }} />
                  <span style={{ ...T.meta, color: C.sandMuted }}>{item}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}


/* ================================================================== */
/* 7. CTA                                                              */
/* ================================================================== */
function Cta() {
  const { ref, visible } = useInView();
  const m = useMobile();

  return (
    <section ref={ref} style={{ backgroundColor: C.navy, paddingTop: secPad(m), paddingBottom: secPad(m), paddingLeft: px(m), paddingRight: px(m) }}>
      <div style={{ maxWidth: MAX, margin: "0 auto", textAlign: "center" }}>
        <div style={{ ...fadeIn(visible) }}>
          <h2 style={{ ...h2Style(m), color: C.sandText, letterSpacing: "-0.02em", marginBottom: 20 }}>
            You&#8217;ve seen how it works.{!m && <br />} Now see your score.
          </h2>
          <p style={{ ...body(m), color: C.sandMuted, maxWidth: 440, margin: "0 auto 40px" }}>
            The free assessment takes under 2 minutes. Every dimension scored. Every result reproducible.
          </p>
          <Link href="/begin" style={{
            ...ctaButtonLight,
            height: m ? 48 : 56, paddingLeft: 36, paddingRight: 36, borderRadius: 10,
            backgroundColor: C.white, color: C.navy,
          }}>
            Start Your Free Assessment
          </Link>
          <div style={{ marginTop: 20, ...T.meta, color: C.sandLight }}>
            Under 2 minutes &#183; Instant result &#183; Private by default
          </div>
        </div>
      </div>
    </section>
  );
}


/* ================================================================== */
/* EXPORT                                                              */
/* ================================================================== */
export default function HowItWorksPage() {
  return (
    <div style={{ overflowX: "hidden" }}>
      <Hero />
      <Process />
      <Dimensions />
      <Specimen />
      <Classification />
      <Architecture />
      <Cta />
    </div>
  );
}
