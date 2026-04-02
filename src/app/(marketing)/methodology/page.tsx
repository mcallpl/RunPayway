"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import {
  C, T, mono, sans, sp, maxW, padX, textMax,
  secPad, px,
  h1, h2Style, h3Style, body, bodySm,
  cardStyle, ctaButton, ctaButtonLight, navStyle,
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

/* ------------------------------------------------------------------ */
/*  Local helpers                                                      */
/* ------------------------------------------------------------------ */
const gradient = C.navy;
const labelStyle = { ...T.label, color: C.teal } as const;

/* ================================================================== */
/* 1. HERO                                                              */
/* ================================================================== */
function Hero() {
  const { ref, visible } = useInView();
  const m = useMobile();
  return (
    <section ref={ref} style={{ background: gradient, position: "relative", overflow: "hidden", paddingTop: m ? 120 : 180, paddingBottom: m ? 80 : 120 }}>
      <div style={{ position: "absolute", top: "20%", left: "50%", width: 900, height: 900, transform: "translate(-50%, -50%)", background: "radial-gradient(circle, rgba(75,63,174,0.14) 0%, transparent 70%)", pointerEvents: "none" }} />
      <div style={{ maxWidth: maxW, margin: "0 auto", padding: `0 ${px(m)}px`, position: "relative", zIndex: 1, textAlign: "center" }}>
        <div style={{ opacity: visible ? 1 : 0, transform: visible ? "translateY(0)" : "translateY(24px)", transition: "opacity 800ms ease-out, transform 800ms ease-out" }}>
          <div style={{ display: "inline-block", padding: "5px 16px", borderRadius: 4, background: "rgba(75,63,174,0.15)", border: "1px solid rgba(75,63,174,0.25)", marginBottom: 24 }}>
            <span style={{ ...T.micro, fontWeight: 700, letterSpacing: "0.10em", textTransform: "uppercase" as const, color: C.sandLight }}>Model RP-2.0 &#183; Methodology</span>
          </div>
          <h1 style={{ ...h1(m), fontFamily: sans, color: C.sandText, letterSpacing: "-0.03em", marginBottom: 24, maxWidth: textMax, margin: "0 auto 24px" }}>
            Engineered for precision.<br />Built on fixed rules.
          </h1>
          <p style={{ fontSize: m ? 16 : 20, fontFamily: sans, color: C.sandLight, lineHeight: 1.6, maxWidth: 540, margin: "0 auto 28px" }}>
            The Income Stability Score&#8482; is a deterministic structural assessment. Every rule is fixed, every result is reproducible. Same inputs always produce the same score.
          </p>
          <div style={{ display: "flex", justifyContent: "center", gap: 20, flexWrap: "wrap" as const }}>
            {["Deterministic", "Fixed rules", "Versioned", "Reproducible"].map(t => (
              <span key={t} style={{ ...T.micro, fontWeight: 500, fontFamily: sans, color: C.sandLight, letterSpacing: "0.02em" }}>{t}</span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ================================================================== */
/* 2. WHAT IT MEASURES — Split layout                                  */
/* ================================================================== */
function Purpose() {
  const { ref, visible } = useInView();
  const m = useMobile();
  return (
    <section ref={ref} style={{ backgroundColor: C.white, paddingTop: secPad(m), paddingBottom: secPad(m), paddingLeft: px(m), paddingRight: px(m) }}>
      <div style={{ maxWidth: maxW, margin: "0 auto" }}>
        <div style={{ display: m ? "block" : "flex", gap: 64, alignItems: "flex-start", opacity: visible ? 1 : 0, transform: visible ? "translateY(0)" : "translateY(14px)", transition: "opacity 600ms ease-out, transform 600ms ease-out" }}>
          <div style={{ flex: 1, marginBottom: m ? 28 : 0 }}>
            <div style={{ ...labelStyle, marginBottom: 16 }}>What It Measures</div>
            <h2 style={{ ...h2Style(m), fontFamily: sans, color: C.navy, margin: 0 }}>
              Not how much you earn.<br />How well it holds up.
            </h2>
          </div>
          <div style={{ flex: 1 }}>
            <p style={{ ...body(m), fontFamily: sans, color: C.muted, marginBottom: 16 }}>
              The Income Stability Score&#8482; quantifies structural resilience — the architecture of your income, not the amount. Two people earning the same number can have completely different stability profiles.
            </p>
            <p style={{ ...body(m), fontFamily: sans, color: C.muted, margin: 0 }}>
              The model evaluates recurrence, concentration, forward visibility, variability, labor dependence, and income quality — then applies cross-factor interaction rules that capture how weaknesses compound.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ================================================================== */
/* 3. STRUCTURAL DIMENSIONS — Detailed accordion                       */
/* ================================================================== */
function Dimensions() {
  const { ref, visible } = useInView();
  const m = useMobile();
  const [openIdx, setOpenIdx] = useState<number | null>(null);

  const dims = [
    { title: "Repeatable Income", desc: "How much of your income comes back without needing to be rebuilt each time.", range: "0% (rebuild every month) to 100% (fully recurring)", color: C.teal },
    { title: "Reliance on One Source", desc: "How much depends on your single largest client, channel, or source of work.", range: "90%+ from one source (critical) to under 30% (diversified)", color: C.purple },
    { title: "Number of Income Sources", desc: "How many independent, meaningful sources support the income structure.", range: "1 source (total dependency) to 8+ (well-diversified)", color: C.teal },
    { title: "Income Secured Ahead of Time", desc: "How much upcoming income is already committed before the month begins.", range: "Less than 1 month (no visibility) to 12+ months (strong protection)", color: C.purple },
    { title: "Month-to-Month Stability", desc: "How consistent the income is from one month to the next.", range: "75%+ fluctuation (volatile) to under 10% (highly predictable)", color: C.amber },
    { title: "Income That Continues Without Daily Work", desc: "How much income would keep coming in if active work stopped.", range: "0% continues (fully labor-dependent) to 76%+ (structurally independent)", color: C.navy },
  ];

  return (
    <section ref={ref} style={{ backgroundColor: C.sand, paddingTop: secPad(m), paddingBottom: secPad(m), paddingLeft: px(m), paddingRight: px(m) }}>
      <div style={{ maxWidth: 800, margin: "0 auto" }}>
        <div style={{ marginBottom: m ? 40 : 56, opacity: visible ? 1 : 0, transform: visible ? "translateY(0)" : "translateY(16px)", transition: "opacity 600ms ease-out, transform 600ms ease-out" }}>
          <div style={{ ...labelStyle, marginBottom: 16 }}>The Structural Dimensions</div>
          <h2 style={{ ...h2Style(m), fontFamily: sans, color: C.navy, marginBottom: 12 }}>
            What each dimension measures — in exact terms.
          </h2>
          <p style={{ ...body(m), fontFamily: sans, color: C.muted }}>
            Each dimension is scored independently using fixed rules. The model then applies cross-factor interaction logic to capture how weaknesses compound.
          </p>
        </div>

        {dims.map((dim, i) => {
          const isOpen = openIdx === i;
          return (
            <div key={dim.title} style={{ borderBottom: `1px solid ${C.border}`, opacity: visible ? 1 : 0, transform: visible ? "translateY(0)" : "translateY(10px)", transition: `opacity 500ms ease-out ${80 + i * 50}ms, transform 500ms ease-out ${80 + i * 50}ms` }}>
              <button onClick={() => setOpenIdx(isOpen ? null : i)} style={{ width: "100%", display: "flex", alignItems: "center", justifyContent: "space-between", padding: m ? "20px 0" : "24px 0", border: "none", backgroundColor: "transparent", cursor: "pointer", textAlign: "left", gap: 16 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                  <div style={{ width: 10, height: 10, borderRadius: "50%", backgroundColor: dim.color, flexShrink: 0 }} />
                  <div>
                    <div style={{ ...h3Style(m), fontFamily: sans, fontSize: m ? 17 : 20, color: C.navy }}>{dim.title}</div>
                    <div style={{ ...bodySm(m), fontFamily: sans, fontSize: m ? 14 : 15, color: C.muted, marginTop: 2 }}>{dim.desc}</div>
                  </div>
                </div>
                <span style={{ fontSize: 18, color: C.light, flexShrink: 0, transform: isOpen ? "rotate(180deg)" : "rotate(0deg)", transition: "transform 200ms ease" }}>&#9662;</span>
              </button>
              {isOpen && (
                <div style={{ paddingLeft: 24, paddingBottom: 24 }}>
                  <div style={{ ...cardStyle, padding: "14px 16px" }}>
                    <div style={{ ...T.label, fontSize: 13, color: C.teal, marginBottom: 6 }}>Scoring Range</div>
                    <div style={{ ...bodySm(m), fontFamily: sans, fontSize: 15, color: C.navy }}>
                      <span style={{ fontFamily: mono }}>{dim.range.replace(/^([^(]+)/, (match) => match)}</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}

        <div style={{ textAlign: "center", marginTop: 28, ...T.meta, fontFamily: sans, color: C.light }}>
          All dimensions are fixed and versioned under Model RP-2.0.
        </div>
      </div>
    </section>
  );
}

/* ================================================================== */
/* 4. SCORING FRAMEWORK — Two blocks visual                            */
/* ================================================================== */
function ScoringFramework() {
  const { ref, visible } = useInView();
  const m = useMobile();
  return (
    <section ref={ref} style={{ backgroundColor: C.white, paddingTop: secPad(m), paddingBottom: secPad(m), paddingLeft: px(m), paddingRight: px(m) }}>
      <div style={{ maxWidth: 800, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: m ? 40 : 56, opacity: visible ? 1 : 0, transform: visible ? "translateY(0)" : "translateY(16px)", transition: "opacity 600ms ease-out, transform 600ms ease-out" }}>
          <div style={{ ...labelStyle, marginBottom: 16 }}>The Mechanism</div>
          <h2 style={{ ...h2Style(m), fontFamily: sans, color: C.navy, marginBottom: 12 }}>
            Two blocks. One score. Zero subjectivity.
          </h2>
          <p style={{ ...body(m), fontFamily: sans, color: C.muted, maxWidth: 540, margin: "0 auto" }}>
            The scoring model evaluates your income across fixed structural dimensions, applies cross-factor interaction rules, and produces a single <span style={{ fontFamily: mono }}>0&#8211;100</span> score.
          </p>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: m ? "1fr" : "1fr 1fr", gap: m ? 16 : 20 }}>
          <div style={{ padding: m ? "28px 24px" : "36px 32px", borderRadius: 16, backgroundColor: C.navy, position: "relative", overflow: "hidden", opacity: visible ? 1 : 0, transform: visible ? "translateY(0)" : "translateY(12px)", transition: "opacity 500ms ease-out 100ms, transform 500ms ease-out 100ms" }}>
            <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 3, background: `linear-gradient(90deg, ${C.teal}, ${C.purple})` }} />
            <div style={{ ...T.label, fontSize: 13, color: C.teal, marginBottom: 16 }}>Structure Analysis</div>
            <div style={{ ...h3Style(m), fontFamily: sans, color: C.sandText, marginBottom: 4 }}>Primary weight</div>
            <p style={{ ...bodySm(m), fontFamily: sans, fontSize: 15, color: C.sandLight, marginBottom: 20 }}>How your income is architecturally composed.</p>
            {["Recurring revenue base", "Source diversification", "Forward visibility", "Concentration resilience"].map(f => (
              <div key={f} style={{ display: "flex", gap: 8, alignItems: "center", marginBottom: 8 }}>
                <div style={{ width: 5, height: 5, borderRadius: "50%", backgroundColor: C.teal, flexShrink: 0 }} />
                <span style={{ ...T.meta, fontFamily: sans, color: C.sandMuted }}>{f}</span>
              </div>
            ))}
          </div>
          <div style={{ padding: m ? "28px 24px" : "36px 32px", borderRadius: 16, backgroundColor: C.navy, position: "relative", overflow: "hidden", opacity: visible ? 1 : 0, transform: visible ? "translateY(0)" : "translateY(12px)", transition: "opacity 500ms ease-out 200ms, transform 500ms ease-out 200ms" }}>
            <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 3, background: `linear-gradient(90deg, ${C.purple}, ${C.teal})` }} />
            <div style={{ ...T.label, fontSize: 13, color: C.purple, marginBottom: 16 }}>Stability Analysis</div>
            <div style={{ ...h3Style(m), fontFamily: sans, color: C.sandText, marginBottom: 4 }}>Secondary weight</div>
            <p style={{ ...bodySm(m), fontFamily: sans, fontSize: 15, color: C.sandLight, marginBottom: 20 }}>How well the structure holds up under pressure.</p>
            {["Labor independence", "Earnings stability", "Income continuity", "Quality adjustment"].map(f => (
              <div key={f} style={{ display: "flex", gap: 8, alignItems: "center", marginBottom: 8 }}>
                <div style={{ width: 5, height: 5, borderRadius: "50%", backgroundColor: C.purple, flexShrink: 0 }} />
                <span style={{ ...T.meta, fontFamily: sans, color: C.sandMuted }}>{f}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ================================================================== */
/* 5. CROSS-FACTOR INTERACTIONS — How weaknesses compound              */
/* ================================================================== */
function Interactions() {
  const { ref, visible } = useInView();
  const m = useMobile();
  return (
    <section ref={ref} style={{ backgroundColor: C.sand, paddingTop: secPad(m), paddingBottom: secPad(m), paddingLeft: px(m), paddingRight: px(m) }}>
      <div style={{ maxWidth: 800, margin: "0 auto" }}>
        <div style={{ display: m ? "block" : "flex", gap: 56, alignItems: "flex-start", opacity: visible ? 1 : 0, transform: visible ? "translateY(0)" : "translateY(14px)", transition: "opacity 600ms ease-out, transform 600ms ease-out" }}>
          <div style={{ flex: 1, marginBottom: m ? 28 : 0 }}>
            <div style={{ ...labelStyle, marginBottom: 16 }}>Cross-Factor Logic</div>
            <h2 style={{ ...h2Style(m), fontFamily: sans, color: C.navy, margin: 0 }}>
              Weaknesses compound. The model captures that.
            </h2>
          </div>
          <div style={{ flex: 1 }}>
            <p style={{ ...bodySm(m), fontFamily: sans, fontSize: m ? 15 : 17, color: C.muted, lineHeight: 1.65, marginBottom: 20 }}>
              A score of <span style={{ fontFamily: mono }}>48</span> with high concentration and low forward visibility is structurally different from a <span style={{ fontFamily: mono }}>48</span> with moderate concentration and strong visibility. The model applies interaction penalties and bonuses that reflect how factors amplify or offset each other.
            </p>
            <div style={{ ...cardStyle, padding: "16px 20px" }}>
              <div style={{ ...T.label, fontSize: 13, color: C.purple, marginBottom: 10 }}>Example Interactions</div>
              {[
                { effect: "Penalty", desc: "High concentration + low visibility", pts: "\u22124" },
                { effect: "Penalty", desc: "High labor dependence + low continuity", pts: "\u22123" },
                { effect: "Bonus", desc: "Strong recurrence + high diversity", pts: "+2" },
              ].map((item, i) => (
                <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "8px 0", borderBottom: i < 2 ? `1px solid ${C.border}` : "none" }}>
                  <div>
                    <span style={{ ...T.micro, fontWeight: 700, fontFamily: sans, color: item.effect === "Penalty" ? C.bandLimited : C.teal, marginRight: 8 }}>{item.effect}</span>
                    <span style={{ ...T.meta, fontFamily: sans, color: C.muted }}>{item.desc}</span>
                  </div>
                  <span style={{ fontSize: 15, fontWeight: 700, fontFamily: mono, color: item.effect === "Penalty" ? C.bandLimited : C.teal }}>{item.pts}</span>
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
/* 6. CLASSIFICATION BANDS — Dark, layered cards                       */
/* ================================================================== */
function Bands() {
  const { ref, visible } = useInView();
  const m = useMobile();

  const bands = [
    { range: "0\u201329", label: "Limited", color: C.bandLimited, consequence: "Your income depends almost entirely on active work. A major disruption puts immediate pressure on the structure." },
    { range: "30\u201349", label: "Developing", color: C.bandDeveloping, consequence: "You can handle small disruptions, but a major source loss would put pressure on the structure quickly." },
    { range: "50\u201374", label: "Established", color: C.bandEstablished, consequence: "Your income can absorb most common disruptions without dropping below a stable threshold." },
    { range: "75\u2013100", label: "High", color: C.bandHigh, consequence: "Your income can absorb a lost client, a slow quarter, or a 90-day work pause without structural damage." },
  ];

  return (
    <section ref={ref} style={{ backgroundColor: C.navy, paddingTop: secPad(m), paddingBottom: secPad(m), paddingLeft: px(m), paddingRight: px(m) }}>
      <div style={{ maxWidth: 800, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: m ? 40 : 56, opacity: visible ? 1 : 0, transform: visible ? "translateY(0)" : "translateY(16px)", transition: "opacity 600ms ease-out, transform 600ms ease-out" }}>
          <div style={{ ...labelStyle, marginBottom: 16 }}>Classification</div>
          <h2 style={{ ...h2Style(m), fontFamily: sans, color: C.sandText, marginBottom: 12 }}>
            Four stability bands. Fixed thresholds.
          </h2>
        </div>

        <div style={{ display: "flex", height: 8, borderRadius: 4, overflow: "hidden", marginBottom: 32 }}>
          {bands.map((b, i) => (
            <div key={b.label} style={{ flex: i === 0 ? 3 : i === 1 ? 2 : 2.5, backgroundColor: b.color, transform: visible ? "scaleX(1)" : "scaleX(0)", transformOrigin: "left", transition: `transform 600ms ease-out ${200 + i * 150}ms` }} />
          ))}
        </div>

        <div style={{ display: "grid", gridTemplateColumns: m ? "1fr" : "1fr 1fr", gap: 12 }}>
          {bands.map((b, i) => (
            <div key={b.label} style={{ padding: m ? "20px 18px" : "24px 24px", borderRadius: 14, backgroundColor: "rgba(244,241,234,0.04)", border: `1px solid ${C.sandBorder}`, position: "relative", overflow: "hidden", opacity: visible ? 1 : 0, transform: visible ? "translateY(0)" : "translateY(12px)", transition: `opacity 500ms ease-out ${300 + i * 100}ms, transform 500ms ease-out ${300 + i * 100}ms` }}>
              <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 3, backgroundColor: b.color }} />
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
                <div style={{ width: 8, height: 8, borderRadius: "50%", backgroundColor: b.color }} />
                <span style={{ fontSize: 15, fontWeight: 700, fontFamily: mono, color: b.color }}>{b.range}</span>
                <span style={{ ...bodySm(m), fontFamily: sans, fontSize: 15, fontWeight: 600, color: C.sandText }}>{b.label} Stability</span>
              </div>
              <p style={{ ...T.meta, fontFamily: sans, color: C.sandLight, lineHeight: 1.55, margin: 0 }}>{b.consequence}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ================================================================== */
/* 7. TWO-LAYER ARCHITECTURE                                           */
/* ================================================================== */
function TwoLayers() {
  const { ref, visible } = useInView();
  const m = useMobile();
  return (
    <section ref={ref} style={{ backgroundColor: C.sand, paddingTop: secPad(m), paddingBottom: secPad(m), paddingLeft: px(m), paddingRight: px(m) }}>
      <div style={{ maxWidth: 800, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: m ? 40 : 56, opacity: visible ? 1 : 0, transform: visible ? "translateY(0)" : "translateY(16px)", transition: "opacity 600ms ease-out, transform 600ms ease-out" }}>
          <div style={{ ...labelStyle, marginBottom: 16 }}>How the report is interpreted</div>
          <h2 style={{ ...h2Style(m), fontFamily: sans, color: C.navy, marginBottom: 12 }}>
            Same score. Your context.
          </h2>
          <p style={{ ...body(m), fontFamily: sans, color: C.muted, maxWidth: 540, margin: "0 auto" }}>
            Your score is generated from fixed structural questions. The same answers always produce the same score.
          </p>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: m ? "1fr" : "1fr 1fr", gap: m ? 16 : 20 }}>
          <div style={{ ...cardStyle, padding: m ? "24px 20px" : "32px 28px", borderRadius: 14, opacity: visible ? 1 : 0, transform: visible ? "translateY(0)" : "translateY(12px)", transition: "opacity 500ms ease-out 100ms, transform 500ms ease-out 100ms" }}>
            <div style={{ ...T.label, fontSize: 13, color: C.teal, marginBottom: 12 }}>Layer 1 — Core Score</div>
            <h3 style={{ ...h3Style(m), fontFamily: sans, color: C.navy, marginBottom: 12 }}>The number.</h3>
            <p style={{ ...bodySm(m), fontFamily: sans, fontSize: 15, color: C.muted, marginBottom: 16 }}>Generated from fixed structural questions only. No contextual input can alter it.</p>
            <div style={{ display: "flex", gap: 8, alignItems: "center", marginBottom: 6 }}>
              <div style={{ width: 5, height: 5, borderRadius: "50%", backgroundColor: C.teal, flexShrink: 0 }} />
              <span style={{ ...T.meta, fontFamily: sans, color: C.navy }}>Score (<span style={{ fontFamily: mono }}>0&#8211;100</span>)</span>
            </div>
            {["Band classification", "Cross-factor interactions", "Sensitivity analysis"].map(item => (
              <div key={item} style={{ display: "flex", gap: 8, alignItems: "center", marginBottom: 6 }}>
                <div style={{ width: 5, height: 5, borderRadius: "50%", backgroundColor: C.teal, flexShrink: 0 }} />
                <span style={{ ...T.meta, fontFamily: sans, color: C.navy }}>{item}</span>
              </div>
            ))}
          </div>
          <div style={{ padding: m ? "24px 20px" : "32px 28px", borderRadius: 14, backgroundColor: C.navy, boxShadow: "0 4px 16px rgba(14,26,43,0.10)", opacity: visible ? 1 : 0, transform: visible ? "translateY(0)" : "translateY(12px)", transition: "opacity 500ms ease-out 200ms, transform 500ms ease-out 200ms" }}>
            <div style={{ ...T.label, fontSize: 13, color: C.teal, marginBottom: 12 }}>Layer 2 — Context Precision</div>
            <h3 style={{ ...h3Style(m), fontFamily: sans, color: C.sandText, marginBottom: 12 }}>The interpretation.</h3>
            <p style={{ ...bodySm(m), fontFamily: sans, fontSize: 15, color: C.sandLight, marginBottom: 16 }}>Uses your operating structure, income model, and industry to improve explanation quality, scenario relevance, and action planning. Does not change the score.</p>
            {["Scenario selection", "Action priority ordering", "Language precision", "Category framing"].map(item => (
              <div key={item} style={{ display: "flex", gap: 8, alignItems: "center", marginBottom: 6 }}>
                <div style={{ width: 5, height: 5, borderRadius: "50%", backgroundColor: C.teal, flexShrink: 0 }} />
                <span style={{ ...T.meta, fontFamily: sans, color: C.sandMuted }}>{item}</span>
              </div>
            ))}
          </div>
        </div>

        <p style={{ ...bodySm(m), fontFamily: sans, color: C.muted, textAlign: "center", marginTop: 28, maxWidth: 540, margin: "28px auto 0" }}>
          A real estate agent and a SaaS founder with identical inputs get the same score — but different scenarios, different action plans, and different structural context. The separation between scoring and interpretation is fixed and auditable.
        </p>
      </div>
    </section>
  );
}

/* ================================================================== */
/* 8. INTEGRITY — Trust signals                                        */
/* ================================================================== */
function Integrity() {
  const { ref, visible } = useInView();
  const m = useMobile();

  const principles = [
    { title: "No bank connections", desc: "We never access financial accounts, credit data, or transaction history." },
    { title: "No machine learning", desc: "Fixed, deterministic rules. No probabilistic scoring, no black-box logic." },
    { title: "No subjective judgment", desc: "The model applies the same rules to every assessment. No human override." },
    { title: "Fully versioned", desc: "Every assessment records the model version used. Results are reproducible." },
    { title: "No fake precision", desc: "If a comparison cannot be rigorously supported, we use category framing instead." },
    { title: "Explainable", desc: "The system can explain what determines the score, what the contextual layer changes, and what it does not change." },
  ];

  return (
    <section ref={ref} style={{ backgroundColor: C.white, paddingTop: secPad(m), paddingBottom: secPad(m), paddingLeft: px(m), paddingRight: px(m) }}>
      <div style={{ maxWidth: 800, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: m ? 40 : 56, opacity: visible ? 1 : 0, transform: visible ? "translateY(0)" : "translateY(16px)", transition: "opacity 600ms ease-out, transform 600ms ease-out" }}>
          <div style={{ ...labelStyle, marginBottom: 16 }}>Integrity</div>
          <h2 style={{ ...h2Style(m), fontFamily: sans, color: C.navy }}>
            What we will never do.
          </h2>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: m ? "1fr" : "1fr 1fr", gap: m ? 14 : 16 }}>
          {principles.map((p, i) => (
            <div key={p.title} style={{
              ...cardStyle, padding: m ? "20px 18px" : "24px 24px",
              backgroundColor: C.sand,
              opacity: visible ? 1 : 0, transform: visible ? "translateY(0)" : "translateY(10px)",
              transition: `opacity 500ms ease-out ${80 + i * 50}ms, transform 500ms ease-out ${80 + i * 50}ms`,
            }}>
              <div style={{ ...bodySm(m), fontFamily: sans, fontWeight: 600, color: C.navy, marginBottom: 6 }}>{p.title}</div>
              <p style={{ ...T.meta, fontFamily: sans, color: C.muted, lineHeight: 1.55, margin: 0 }}>{p.desc}</p>
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
  const [hovered, setHovered] = useState(false);
  return (
    <section ref={ref} style={{ background: gradient, position: "relative", overflow: "hidden", paddingTop: secPad(m), paddingBottom: secPad(m) }}>
      <div style={{ position: "absolute", top: "50%", left: "50%", width: 700, height: 700, transform: "translate(-50%, -50%)", background: "radial-gradient(circle, rgba(75,63,174,0.15) 0%, transparent 70%)", pointerEvents: "none" }} />
      <div style={{ maxWidth: maxW, margin: "0 auto", padding: `0 ${px(m)}px`, position: "relative", zIndex: 1, textAlign: "center" }}>
        <div style={{ opacity: visible ? 1 : 0, transform: visible ? "translateY(0)" : "translateY(16px)", transition: "opacity 600ms ease-out, transform 600ms ease-out" }}>
          <h2 style={{ ...h2Style(m), fontFamily: sans, color: C.sandText, marginBottom: 20 }}>
            See where your income stands.
          </h2>
          <p style={{ ...body(m), fontFamily: sans, color: C.sandMuted, maxWidth: 440, margin: "0 auto 40px" }}>
            Your free score shows where you stand. The full report shows what to do about it.
          </p>
          <Link href="/pricing" onMouseEnter={() => canHover() && setHovered(true)} onMouseLeave={() => setHovered(false)} style={{ ...ctaButtonLight, height: m ? 48 : 56, paddingLeft: 36, paddingRight: 36, borderRadius: 10, fontFamily: sans, boxShadow: hovered ? "0 8px 28px rgba(0,0,0,0.25)" : "0 4px 16px rgba(0,0,0,0.15)", transform: hovered ? "translateY(-2px)" : "translateY(0)", transition: "box-shadow 260ms ease, transform 260ms ease" }}>
            Start Your Assessment
          </Link>
          <div style={{ marginTop: 20, ...T.meta, fontFamily: sans, color: C.sandLight }}>
            Free to start &#183; Under 2 minutes &#183; Private by default
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
    <div style={{ fontFamily: sans }}>
      <Hero />
      <Purpose />
      <Dimensions />
      <ScoringFramework />
      <Interactions />
      <Bands />
      <TwoLayers />
      <Integrity />
      <Cta />
    </div>
  );
}
