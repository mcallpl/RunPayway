"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import logoWhite from "../../../../public/runpayway-logo-white.png";
import { C, T, mono, sans, sp, secPad, px, h1, h2Style, h3Style, body, bodySm, cardStyle, ctaButton, ctaButtonLight, navStyle, canHover } from "@/lib/design-tokens";

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
/*  Local constants (not in shared tokens)                             */
/* ------------------------------------------------------------------ */

const gradient = C.navy;
const borderMd = "rgba(14,26,43,0.12)";
const bone = C.sand;
const MAX = 1200;

/* ================================================================== */
/* 1. HERO — Explanatory, not salesy                                   */
/* ================================================================== */
function Hero() {
  const { ref, visible } = useInView();
  const m = useMobile();
  return (
    <section ref={ref} style={{ background: gradient, position: "relative", overflow: "hidden", paddingTop: m ? 120 : 180, paddingBottom: m ? 80 : 120 }}>
      <div style={{ maxWidth: MAX, margin: "0 auto", padding: `0 ${px(m)}px`, position: "relative", zIndex: 1 }}>
        <div style={{ maxWidth: 680, opacity: visible ? 1 : 0, transform: visible ? "translateY(0)" : "translateY(24px)", transition: "opacity 800ms ease-out, transform 800ms ease-out" }}>
          <div style={{ ...T.label, color: C.teal, marginBottom: 28 }}>How It Works</div>
          <h1 style={{ ...h1(m), color: C.sandText, lineHeight: 1.08, letterSpacing: "-0.03em", marginBottom: 24, wordBreak: "break-word" as const }}>
            A structured assessment.{!m && <br />} Not a guess.
          </h1>
          <p style={{ ...body(m), color: C.sandMuted, marginBottom: 16, maxWidth: 520 }}>
            RunPayway scores how your income is built using fixed structural dimensions. The same answers always produce the same score. Here is exactly how the process works.
          </p>
          <div style={{ display: "flex", flexWrap: "wrap" as const, gap: 16, marginTop: 28 }}>
            {["No bank connection", "No credit pull", "No document upload"].map(t => (
              <span key={t} style={{ ...T.micro, fontWeight: 500, color: C.sandLight, letterSpacing: "0.02em" }}>{t}</span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ================================================================== */
/* 2. THE JOURNEY — Vertical timeline with screen previews             */
/* ================================================================== */
function Journey() {
  const { ref, visible } = useInView();
  const m = useMobile();

  const steps = [
    {
      num: "01", title: "You answer six structural questions",
      body: "Six questions. Each one measures a different dimension of your income: how much repeats, how concentrated it is, how many sources you have, how far ahead it\u2019s secured, how consistent it is month to month, and how much continues if you stop working.",
      detail: "No dollar amounts. No bank connection. No document upload.",
      screen: (
        <div style={{ padding: m ? "16px 14px" : "20px 18px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
            <div style={{ ...T.label, color: C.teal }}>Question 4 of 6</div>
            <div style={{ fontSize: 11, fontFamily: mono, color: C.sandLight }}>Forward Revenue Visibility</div>
          </div>
          <div style={{ fontSize: m ? 15 : 16, fontWeight: 600, color: C.sandText, marginBottom: 6, lineHeight: 1.35 }}>How many months of future income are currently secured under signed or enforceable agreements?</div>
          <div style={{ fontSize: 11, color: C.sandLight, marginBottom: 14 }}>Only include income that is already contractually committed.</div>
          {[
            { letter: "A", text: "Less than 1 month" },
            { letter: "B", text: "1\u20132 months" },
            { letter: "C", text: "3\u20135 months", selected: true },
            { letter: "D", text: "6\u201311 months" },
            { letter: "E", text: "12 or more months" },
          ].map((opt) => (
            <div key={opt.letter} style={{ display: "flex", gap: 10, alignItems: "center", padding: "9px 12px", marginBottom: 5, borderRadius: 8, backgroundColor: opt.selected ? "rgba(31,109,122,0.15)" : C.sandBorder, border: opt.selected ? `1px solid ${C.teal}` : `1px solid ${C.sandBorder}` }}>
              <span style={{ fontFamily: mono, fontSize: 12, fontWeight: 600, color: opt.selected ? C.teal : C.sandLight, minWidth: 14 }}>{opt.letter}</span>
              <span style={{ fontSize: 14, color: opt.selected ? C.teal : C.sandMuted, fontWeight: opt.selected ? 600 : 400 }}>{opt.text}</span>
            </div>
          ))}
        </div>
      ),
    },
    {
      num: "02", title: "The model scores your structure",
      body: "Model RP-2.0 evaluates your answers across six fixed dimensions. It computes factor scores, applies cross-factor interaction rules that capture how weaknesses compound, and produces a single score from 0 to 100.",
      detail: "Deterministic. Version-locked. Same inputs always produce the same score.",
      screen: (
        <div style={{ padding: m ? "16px 14px" : "20px 18px" }}>
          <div style={{ ...T.label, color: C.sandLight, marginBottom: 16 }}>Model RP-2.0</div>
          {[
            { label: "Computing factor scores", sub: "Persistence, Concentration, Diversity, Visibility, Consistency, Labor Independence", done: true },
            { label: "Applying cross-factor interactions", sub: "8 penalty rules, 2 bonus rules", done: true },
            { label: "Computing stability classification", sub: "Structure (60%) + Stability (40%)", done: true },
            { label: "Generating structural diagnosis", sub: "Constraints, fragility, sensitivity", done: false },
          ].map((step, i) => (
            <div key={step.label} style={{ marginBottom: 12 }}>
              <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
                <div style={{ width: 18, height: 18, borderRadius: "50%", backgroundColor: step.done ? C.teal : C.sandBorder, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  {step.done && <svg width="9" height="9" viewBox="0 0 10 10"><path d="M2 5L4 7L8 3" stroke="#F4F1EA" strokeWidth="1.5" fill="none" strokeLinecap="round" /></svg>}
                </div>
                <span style={{ fontSize: 13, color: step.done ? C.sandMuted : C.sandLight, fontWeight: 500 }}>{step.label}</span>
              </div>
              <div style={{ fontSize: 11, color: C.sandLight, marginLeft: 28, marginTop: 2 }}>{step.sub}</div>
            </div>
          ))}
          <div style={{ height: 3, borderRadius: 2, backgroundColor: C.sandBorder, marginTop: 8 }}>
            <div style={{ height: 3, borderRadius: 2, backgroundColor: C.teal, width: "75%" }} />
          </div>
        </div>
      ),
    },
    {
      num: "03", title: "You see your score instantly",
      body: "Your Income Stability Score\u2122 out of 100, your stability band, how far you are from the next band, your primary structural constraint, and a preview of what one change could do.",
      detail: "Free. Instant. No payment required.",
      screen: (
        <div style={{ padding: m ? "16px 14px" : "20px 18px", textAlign: "center" }}>
          <div style={{ fontFamily: mono, fontSize: 48, fontWeight: 600, color: C.sandText, lineHeight: 1, marginBottom: 4 }}>72</div>
          <div style={{ fontFamily: mono, fontSize: 14, color: C.sandLight, marginBottom: 12 }}>out of 100</div>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "4px 12px", borderRadius: 100, backgroundColor: "rgba(43,94,167,0.15)", marginBottom: 8 }}>
            <div style={{ width: 6, height: 6, borderRadius: "50%", backgroundColor: C.bandEstablished }} />
            <span style={{ fontSize: 13, fontWeight: 600, color: C.bandEstablished }}>Established Stability</span>
          </div>
          <div style={{ fontFamily: mono, fontSize: 12, color: C.sandLight, marginBottom: 12 }}>3 points to High Stability</div>
          <div style={{ height: 1, backgroundColor: C.sandBorder, margin: "8px 0" }} />
          <div style={{ fontSize: 12, color: C.sandMuted, marginBottom: 4 }}>Primary constraint: Income concentration</div>
          <div style={{ fontSize: 12, color: C.sandLight }}>Stress test: Largest source removed &rarr; projected <span style={{ fontFamily: mono }}>44</span></div>
        </div>
      ),
    },
    {
      num: "04", title: "You unlock the full diagnostic",
      body: "The $69 report uses your score plus your operating structure, income model, and industry to produce a 3-page structural diagnosis with PressureMap\u2122 intelligence, ranked risk scenarios, projected actions, and Command Center access with a lifetime simulator.",
      detail: "Same score. Deeper interpretation. Practical action plan.",
      screen: (
        <div style={{ padding: m ? "16px 14px" : "20px 18px" }}>
          {[
            { num: "01", title: "Cover & Score", desc: "Score, band, primary constraint", color: C.purple },
            { num: "02", title: "Key Findings", desc: "PressureMap, income structure, plain English", color: C.teal },
            { num: "03", title: "What To Do Next", desc: "Actions, roadmap, Command Center", color: C.purple },
          ].map((p, i) => (
            <div key={p.num} style={{ display: "flex", gap: 10, alignItems: "flex-start", padding: "10px 0", borderBottom: i < 2 ? `1px solid ${C.sandBorder}` : "none" }}>
              <span style={{ fontFamily: mono, fontSize: 12, fontWeight: 700, color: p.color, minWidth: 20, marginTop: 2 }}>{p.num}</span>
              <div>
                <div style={{ fontSize: 14, fontWeight: 600, color: C.sandText, marginBottom: 2 }}>{p.title}</div>
                <div style={{ fontSize: 12, color: C.sandLight }}>{p.desc}</div>
              </div>
            </div>
          ))}
        </div>
      ),
    },
  ];

  return (
    <section ref={ref} style={{ backgroundColor: bone, paddingTop: secPad(m), paddingBottom: secPad(m), paddingLeft: px(m), paddingRight: px(m) }}>
      <div style={{ maxWidth: MAX, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: m ? 48 : 72, opacity: visible ? 1 : 0, transform: visible ? "translateY(0)" : "translateY(16px)", transition: "opacity 600ms ease-out, transform 600ms ease-out" }}>
          <div style={{ ...T.label, color: C.teal, marginBottom: 16 }}>The Process</div>
          <h2 style={{ ...h2Style(m), color: C.navy, letterSpacing: "-0.025em", marginBottom: 12 }}>
            Four steps. Every one transparent.
          </h2>
          <p style={{ ...body(m), color: C.muted, maxWidth: 480, margin: "0 auto" }}>
            No black boxes. You see exactly what happens at each stage.
          </p>
        </div>

        {/* Timeline */}
        <div style={{ maxWidth: 880, margin: "0 auto", position: "relative" }}>
          {/* Vertical line — desktop */}
          {!m && <div style={{ position: "absolute", left: "50%", top: 0, bottom: 0, width: 1, backgroundColor: borderMd, transform: "translateX(-0.5px)" }} />}

          {steps.map((step, i) => {
            const isRight = !m && i % 2 === 1;
            return (
              <div key={step.num} style={{
                display: m ? "flex" : "grid",
                gridTemplateColumns: "1fr 48px 1fr",
                gap: 0,
                flexDirection: "column",
                marginBottom: i < 3 ? (m ? 40 : 64) : 0,
                opacity: visible ? 1 : 0,
                transform: visible ? "translateY(0)" : "translateY(20px)",
                transition: `opacity 600ms ease-out ${200 + i * 150}ms, transform 600ms ease-out ${200 + i * 150}ms`,
              }}>
                {/* Left content or empty */}
                {!m && (
                  <div style={{ paddingRight: 32, display: "flex", flexDirection: "column", justifyContent: "center" }}>
                    {!isRight && (
                      <>
                        <div style={{ ...T.label, color: C.teal, marginBottom: 8 }}>Step <span style={{ fontFamily: mono }}>{step.num}</span></div>
                        <h3 style={{ ...h3Style(m), color: C.navy, marginBottom: 10 }}>{step.title}</h3>
                        <p style={{ ...bodySm(m), color: C.muted, marginBottom: 8 }}>{step.body}</p>
                        <p style={{ ...T.meta, color: C.teal, fontWeight: 500, margin: 0 }}>{step.detail}</p>
                      </>
                    )}
                    {isRight && (
                      <div style={{ backgroundColor: C.navy, borderRadius: 16, overflow: "hidden", boxShadow: "0 8px 32px rgba(14,26,43,0.12)", border: `1px solid ${borderMd}` }}>
                        <div style={{ padding: "8px 14px 0", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                          <Image src={logoWhite} alt="RunPayway" width={90} height={11} style={{ height: "auto", opacity: 0.7 }} />
                          <div style={{ width: 4, height: 4, borderRadius: "50%", backgroundColor: C.teal, opacity: 0.6 }} />
                        </div>
                        {step.screen}
                      </div>
                    )}
                  </div>
                )}

                {/* Center dot */}
                {!m && (
                  <div style={{ display: "flex", justifyContent: "center", paddingTop: 4 }}>
                    <div style={{ width: 14, height: 14, borderRadius: "50%", backgroundColor: C.white, border: `3px solid ${C.teal}`, boxShadow: `0 0 0 4px ${bone}, 0 0 8px rgba(31,109,122,0.20)`, position: "relative", zIndex: 2 }} />
                  </div>
                )}

                {/* Right content or empty */}
                {!m && (
                  <div style={{ paddingLeft: 32, display: "flex", flexDirection: "column", justifyContent: "center" }}>
                    {isRight && (
                      <>
                        <div style={{ ...T.label, color: C.teal, marginBottom: 8 }}>Step <span style={{ fontFamily: mono }}>{step.num}</span></div>
                        <h3 style={{ ...h3Style(m), color: C.navy, marginBottom: 10 }}>{step.title}</h3>
                        <p style={{ ...bodySm(m), color: C.muted, marginBottom: 8 }}>{step.body}</p>
                        <p style={{ ...T.meta, color: C.teal, fontWeight: 500, margin: 0 }}>{step.detail}</p>
                      </>
                    )}
                    {!isRight && (
                      <div style={{ backgroundColor: C.navy, borderRadius: 16, overflow: "hidden", boxShadow: "0 8px 32px rgba(14,26,43,0.12)", border: `1px solid ${borderMd}` }}>
                        <div style={{ padding: "8px 14px 0", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                          <Image src={logoWhite} alt="RunPayway" width={90} height={11} style={{ height: "auto", opacity: 0.7 }} />
                          <div style={{ width: 4, height: 4, borderRadius: "50%", backgroundColor: C.teal, opacity: 0.6 }} />
                        </div>
                        {step.screen}
                      </div>
                    )}
                  </div>
                )}

                {/* Mobile layout: screen + text stacked */}
                {m && (
                  <>
                    <div style={{ display: "flex", gap: 12, alignItems: "center", marginBottom: 16 }}>
                      <div style={{ width: 32, height: 32, borderRadius: 8, backgroundColor: "rgba(31,109,122,0.08)", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: mono, fontSize: 14, fontWeight: 700, color: C.teal, flexShrink: 0 }}>{step.num}</div>
                      <h3 style={{ ...h3Style(m), color: C.navy, margin: 0 }}>{step.title}</h3>
                    </div>
                    <div style={{ backgroundColor: C.navy, borderRadius: 14, overflow: "hidden", boxShadow: "0 6px 24px rgba(14,26,43,0.10)", marginBottom: 16 }}>
                      <div style={{ padding: "6px 12px 0", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <Image src={logoWhite} alt="RunPayway" width={90} height={11} style={{ height: "auto", opacity: 0.7 }} />
                        <div style={{ width: 4, height: 4, borderRadius: "50%", backgroundColor: C.teal, opacity: 0.6 }} />
                      </div>
                      {step.screen}
                    </div>
                    <p style={{ ...bodySm(m), color: C.muted, marginBottom: 6 }}>{step.body}</p>
                    <p style={{ ...T.meta, color: C.teal, fontWeight: 500, margin: 0 }}>{step.detail}</p>
                  </>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

/* ================================================================== */
/* 3. THE DIMENSIONS — Deep breakdown with low/high examples           */
/* ================================================================== */
function Dimensions() {
  const { ref, visible } = useInView();
  const m = useMobile();
  const [expandedIdx, setExpandedIdx] = useState<number | null>(null);

  const dims = [
    { title: "Recurring Revenue Base", desc: "What percentage of your income renews automatically through an existing agreement or subscription.", low: "Answer A (0\u201310%) \u2014 almost no income repeats. You rebuild from scratch every month.", high: "Answer E (86\u2013100%) \u2014 nearly all income renews automatically without re-selling.", color: C.teal },
    { title: "Income Concentration", desc: "How much of your total income depended on any single source over the previous 12 months.", low: "Answer A (90\u2013100% from one source) \u2014 a single departure collapses the structure.", high: "Answer E (under 30% from any source) \u2014 no single point of failure.", color: C.purple },
    { title: "Income Source Count", desc: "How many separate income sources each contributed at least 10% of your total income.", low: "Answer A (1 source) \u2014 total dependency on a single relationship.", high: "Answer E (8 or more) \u2014 income is distributed across many independent sources.", color: C.teal },
    { title: "Forward Revenue Visibility", desc: "How many months of future income are currently secured under signed or enforceable agreements.", low: "Answer A (less than 1 month) \u2014 no income is committed beyond what you earn today.", high: "Answer E (12 or more months) \u2014 strong forward commitment and structural protection.", color: C.purple },
    { title: "Earnings Consistency", desc: "How consistent your monthly income was over the previous 12 months.", low: "Answer A (fluctuated more than 75%) \u2014 income is volatile and hard to plan around.", high: "Answer E (fluctuated less than 10%) \u2014 highly predictable month to month.", color: C.amber },
    { title: "Income Without Active Work", desc: "If you stopped working for 90 consecutive days, what percentage of your income would continue automatically.", low: "Answer A (0%) \u2014 income stops the moment you stop working.", high: "Answer E (76\u2013100%) \u2014 income persists through extended absence.", color: C.navy },
  ];

  return (
    <section ref={ref} style={{ backgroundColor: C.white, paddingTop: secPad(m), paddingBottom: secPad(m), paddingLeft: px(m), paddingRight: px(m) }}>
      <div style={{ maxWidth: MAX, margin: "0 auto" }}>
        <div style={{ maxWidth: 600, marginBottom: m ? 40 : 56, opacity: visible ? 1 : 0, transform: visible ? "translateY(0)" : "translateY(16px)", transition: "opacity 600ms ease-out, transform 600ms ease-out" }}>
          <div style={{ ...T.label, color: C.teal, marginBottom: 16 }}>The Model</div>
          <h2 style={{ ...h2Style(m), color: C.navy, letterSpacing: "-0.025em", marginBottom: 16 }}>
            What each dimension measures.
          </h2>
          <p style={{ ...body(m), color: C.muted }}>
            Each dimension is scored independently. The model then applies cross-factor interaction rules to capture how weaknesses compound.
          </p>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
          {dims.map((dim, i) => {
            const isOpen = expandedIdx === i;
            return (
              <div key={dim.title} style={{
                borderBottom: `1px solid ${C.border}`,
                opacity: visible ? 1 : 0,
                transform: visible ? "translateY(0)" : "translateY(10px)",
                transition: `opacity 500ms ease-out ${80 + i * 60}ms, transform 500ms ease-out ${80 + i * 60}ms`,
              }}>
                <button
                  onClick={() => setExpandedIdx(isOpen ? null : i)}
                  style={{
                    width: "100%", display: "flex", alignItems: "center", justifyContent: "space-between",
                    padding: m ? "20px 0" : "24px 0", border: "none", backgroundColor: "transparent", cursor: "pointer",
                    textAlign: "left", gap: 16,
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: 14, minWidth: 0 }}>
                    <div style={{ width: 10, height: 10, borderRadius: "50%", backgroundColor: dim.color, flexShrink: 0 }} />
                    <div style={{ minWidth: 0 }}>
                      <div style={{ fontSize: m ? 17 : 20, fontWeight: 600, color: C.navy, letterSpacing: "-0.01em" }}>{dim.title}</div>
                      <div style={{ ...bodySm(m), color: C.muted, marginTop: 2 }}>{dim.desc}</div>
                    </div>
                  </div>
                  <span style={{ fontSize: 18, color: C.light, flexShrink: 0, transform: isOpen ? "rotate(180deg)" : "rotate(0deg)", transition: "transform 200ms ease" }}>&#9662;</span>
                </button>
                {isOpen && (
                  <div style={{ paddingLeft: m ? 24 : 24, paddingBottom: 24, display: "grid", gridTemplateColumns: m ? "1fr" : "1fr 1fr", gap: 12 }}>
                    <div style={{ padding: "14px 16px", borderRadius: 10, backgroundColor: "rgba(155,44,44,0.04)", border: "1px solid rgba(155,44,44,0.10)" }}>
                      <div style={{ ...T.label, fontSize: 13, letterSpacing: "0.06em", color: C.bandLimited, marginBottom: 6 }}>Low Score</div>
                      <div style={{ ...T.meta, color: C.muted }}>{dim.low}</div>
                    </div>
                    <div style={{ padding: "14px 16px", borderRadius: 10, backgroundColor: "rgba(31,109,122,0.04)", border: "1px solid rgba(31,109,122,0.10)" }}>
                      <div style={{ ...T.label, fontSize: 13, letterSpacing: "0.06em", color: C.bandHigh, marginBottom: 6 }}>High Score</div>
                      <div style={{ ...T.meta, color: C.muted }}>{dim.high}</div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <div style={{ textAlign: "center", marginTop: 32, ...T.meta, color: C.light, opacity: visible ? 1 : 0, transition: "opacity 600ms ease-out 500ms" }}>
          All dimensions are fixed and versioned under Model RP-2.0. The same answers always produce the same result.
        </div>
      </div>
    </section>
  );
}

/* ================================================================== */
/* 4. CLASSIFICATION BANDS — Elevated with layered cards               */
/* ================================================================== */
function Bands() {
  const { ref, visible } = useInView();
  const m = useMobile();

  const bands = [
    { range: "0\u201329", label: "Limited", color: C.bandLimited, consequence: "Income structure needs attention. High vulnerability to disruption. A single source change or work interruption could shift the entire structure." },
    { range: "30\u201349", label: "Developing", color: C.bandDeveloping, consequence: "Building toward stability, but not structurally protected yet. A major source loss would put pressure on the structure within weeks." },
    { range: "50\u201374", label: "Established", color: C.bandEstablished, consequence: "Solid structural foundation with identifiable gaps. Income can absorb most common disruptions without dropping below a stable threshold." },
    { range: "75\u2013100", label: "High", color: C.bandHigh, consequence: "Income is structurally sound and resilient under pressure. Can absorb a lost client, a slow quarter, or a 90-day work pause without structural damage." },
  ];

  return (
    <section ref={ref} style={{ backgroundColor: C.navy, paddingTop: secPad(m), paddingBottom: secPad(m), paddingLeft: px(m), paddingRight: px(m) }}>
      <div style={{ maxWidth: 800, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: m ? 40 : 56, opacity: visible ? 1 : 0, transform: visible ? "translateY(0)" : "translateY(16px)", transition: "opacity 600ms ease-out, transform 600ms ease-out" }}>
          <div style={{ ...T.label, color: C.teal, marginBottom: 16 }}>Classification</div>
          <h2 style={{ ...h2Style(m), color: C.sandText, letterSpacing: "-0.025em", marginBottom: 12 }}>
            What your score means.
          </h2>
          <p style={{ ...body(m), color: C.sandMuted, maxWidth: 480, margin: "0 auto" }}>
            Each band defines what your income structure can absorb.
          </p>
        </div>

        {/* Animated bar */}
        <div style={{ display: "flex", height: 8, borderRadius: 4, overflow: "hidden", marginBottom: 32 }}>
          {bands.map((b, i) => (
            <div key={b.label} style={{ flex: i === 0 ? 3 : i === 1 ? 2 : 2.5, backgroundColor: b.color, transform: visible ? "scaleX(1)" : "scaleX(0)", transformOrigin: "left", transition: `transform 600ms ease-out ${200 + i * 150}ms` }} />
          ))}
        </div>

        {/* Band cards */}
        <div style={{ display: "grid", gridTemplateColumns: m ? "1fr" : "1fr 1fr", gap: 12 }}>
          {bands.map((b, i) => (
            <div key={b.label} style={{
              padding: m ? "20px 18px" : "24px 24px", borderRadius: 14,
              backgroundColor: C.sandBorder, border: `1px solid ${C.sandBorder}`,
              position: "relative", overflow: "hidden",
              opacity: visible ? 1 : 0, transform: visible ? "translateY(0)" : "translateY(12px)",
              transition: `opacity 500ms ease-out ${300 + i * 100}ms, transform 500ms ease-out ${300 + i * 100}ms`,
            }}>
              <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 3, backgroundColor: b.color }} />
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10, flexWrap: "wrap" as const }}>
                <div style={{ width: 8, height: 8, borderRadius: "50%", backgroundColor: b.color, flexShrink: 0 }} />
                <span style={{ fontFamily: mono, fontSize: 15, fontWeight: 700, color: b.color }}>{b.range}</span>
                <span style={{ fontSize: 15, fontWeight: 600, color: C.sandText }}>{b.label} Stability</span>
              </div>
              <p style={{ fontSize: 14, color: C.sandMuted, lineHeight: 1.55, margin: 0 }}>{b.consequence}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ================================================================== */
/* 5. TWO-LAYER ARCHITECTURE — Score vs. interpretation                */
/* ================================================================== */
function TwoLayers() {
  const { ref, visible } = useInView();
  const m = useMobile();

  return (
    <section ref={ref} style={{ backgroundColor: C.sand, paddingTop: secPad(m), paddingBottom: secPad(m), paddingLeft: px(m), paddingRight: px(m) }}>
      <div style={{ maxWidth: 800, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: m ? 40 : 56, opacity: visible ? 1 : 0, transform: visible ? "translateY(0)" : "translateY(16px)", transition: "opacity 600ms ease-out, transform 600ms ease-out" }}>
          <div style={{ ...T.label, color: C.teal, marginBottom: 16 }}>Architecture</div>
          <h2 style={{ ...h2Style(m), color: C.navy, letterSpacing: "-0.025em", marginBottom: 12 }}>
            Two layers. One boundary.
          </h2>
          <p style={{ ...body(m), color: C.muted, maxWidth: 520, margin: "0 auto" }}>
            The score and the report are built separately. The boundary between them is fixed and auditable.
          </p>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: m ? "1fr" : "1fr 1fr", gap: m ? 16 : 20 }}>
          {/* Layer 1 */}
          <div style={{ ...cardStyle, padding: m ? "24px 20px" : "32px 28px", borderRadius: 14, border: `1px solid ${borderMd}`, opacity: visible ? 1 : 0, transform: visible ? "translateY(0)" : "translateY(12px)", transition: "opacity 500ms ease-out 100ms, transform 500ms ease-out 100ms" }}>
            <div style={{ ...T.label, color: C.teal, marginBottom: 12 }}>Layer 1 — Core Score</div>
            <h3 style={{ ...h3Style(m), color: C.navy, marginBottom: 12 }}>The number.</h3>
            <p style={{ ...bodySm(m), color: C.muted, marginBottom: 16 }}>Generated from fixed structural questions only. Same answers, same score. No contextual input can alter it.</p>
            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              {["Score (0\u2013100)", "Band classification", "Cross-factor interactions", "Sensitivity analysis"].map(item => (
                <div key={item} style={{ display: "flex", gap: 8, alignItems: "center" }}>
                  <div style={{ width: 5, height: 5, borderRadius: "50%", backgroundColor: C.teal, flexShrink: 0 }} />
                  <span style={{ ...T.meta, color: C.navy }}>{item}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Layer 2 */}
          <div style={{ padding: m ? "24px 20px" : "32px 28px", borderRadius: 14, backgroundColor: C.navy, boxShadow: "0 4px 16px rgba(14,26,43,0.10)", opacity: visible ? 1 : 0, transform: visible ? "translateY(0)" : "translateY(12px)", transition: "opacity 500ms ease-out 200ms, transform 500ms ease-out 200ms" }}>
            <div style={{ ...T.label, color: C.teal, marginBottom: 12 }}>Layer 2 — Context Precision</div>
            <h3 style={{ ...h3Style(m), color: C.sandText, marginBottom: 12 }}>The interpretation.</h3>
            <p style={{ ...bodySm(m), color: C.sandMuted, marginBottom: 16 }}>Uses your operating structure, income model, and industry to improve explanation quality, scenario relevance, and action planning. Does not change the score.</p>
            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              {["Scenario selection", "Action priority ordering", "Language precision", "Category framing"].map(item => (
                <div key={item} style={{ display: "flex", gap: 8, alignItems: "center" }}>
                  <div style={{ width: 5, height: 5, borderRadius: "50%", backgroundColor: C.teal, flexShrink: 0 }} />
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
/* 6. CTA                                                              */
/* ================================================================== */
function Cta() {
  const { ref, visible } = useInView();
  const m = useMobile();
  const [hovered, setHovered] = useState(false);

  return (
    <section ref={ref} style={{ background: gradient, position: "relative", overflow: "hidden", paddingTop: secPad(m), paddingBottom: secPad(m) }}>
      <div style={{ maxWidth: MAX, margin: "0 auto", padding: `0 ${px(m)}px`, position: "relative", zIndex: 1, textAlign: "center" }}>
        <div style={{ opacity: visible ? 1 : 0, transform: visible ? "translateY(0)" : "translateY(16px)", transition: "opacity 600ms ease-out, transform 600ms ease-out" }}>
          <h2 style={{ ...h2Style(m), color: C.sandText, letterSpacing: "-0.025em", marginBottom: 20 }}>
            See where your income stands.
          </h2>
          <p style={{ ...body(m), color: C.sandMuted, maxWidth: 440, margin: "0 auto 40px" }}>
            Your free score shows where you stand. The full report shows what to do about it.
          </p>
          <Link
            href="/pricing"
            onMouseEnter={() => canHover() && setHovered(true)}
            onMouseLeave={() => setHovered(false)}
            style={{
              ...ctaButtonLight,
              height: m ? 48 : 56, paddingLeft: 36, paddingRight: 36, borderRadius: 10,
              backgroundColor: C.sand, color: C.navy,
              boxShadow: hovered ? "0 8px 28px rgba(0,0,0,0.25)" : "0 4px 16px rgba(0,0,0,0.15)",
              transform: hovered ? "translateY(-2px)" : "translateY(0)", transition: "box-shadow 260ms ease, transform 260ms ease",
            }}
          >
            Start Your Assessment
          </Link>
          <div style={{ marginTop: 20, ...T.meta, color: C.sandLight }}>
            Free to start &#183; Under 2 minutes &#183; Private by default
          </div>
        </div>
      </div>
    </section>
  );
}

/* ================================================================== */
/* MAIN EXPORT                                                         */
/* ================================================================== */
export default function HowItWorksPage() {
  return (
    <div style={{ overflowX: "hidden" }}>
      <Hero />
      <Journey />
      <Dimensions />
      <Bands />
      <TwoLayers />
      <Cta />
    </div>
  );
}
