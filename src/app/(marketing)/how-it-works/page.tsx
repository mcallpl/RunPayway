"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import logoWhite from "../../../../public/runpayway-logo-white.png";
import { C, T, mono, sp, maxW, padX, secPad, px, h1, h2Style, h3Style, body, bodySm, cardStyle, ctaButton, ctaButtonLight, navStyle, canHover } from "@/lib/design-tokens";

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

const gradient = "linear-gradient(145deg, #0E1A2B 0%, #161430 35%, #3D2F9C 65%, #1F6D7A 100%)";
const borderMd = "rgba(14,26,43,0.12)";
const bone = "#F7F6F3";
const MAX = 1200;

/* ================================================================== */
/* 1. HERO — Explanatory, not salesy                                   */
/* ================================================================== */
function Hero() {
  const { ref, visible } = useInView();
  const m = useMobile();
  return (
    <section ref={ref} style={{ background: gradient, position: "relative", overflow: "hidden", paddingTop: m ? 120 : 180, paddingBottom: m ? 80 : 120 }}>
      <div style={{ position: "absolute", top: "20%", left: "50%", width: 900, height: 900, transform: "translate(-50%, -50%)", background: "radial-gradient(circle, rgba(75,63,174,0.14) 0%, transparent 70%)", pointerEvents: "none" }} />
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
      num: "01", title: "You answer structural questions",
      body: "Each question examines a different part of your income \u2014 how much repeats, how concentrated it is, how far ahead it\u2019s secured, how consistent it is month to month, and how much continues without your daily effort.",
      detail: "No dollar amounts. No account access. Just structural patterns.",
      screen: (
        <div style={{ padding: m ? "16px 14px" : "20px 18px" }}>
          <div style={{ ...T.label, color: C.teal, marginBottom: 12 }}>Structural Assessment</div>
          <div style={{ fontSize: m ? 15 : 17, fontWeight: 600, color: C.sandText, marginBottom: 16, lineHeight: 1.35 }}>How many months of future income are currently secured under signed agreements?</div>
          {["Less than 1 month", "1\u20132 months", "3\u20135 months", "6\u201311 months", "12 or more months"].map((opt, i) => (
            <div key={opt} style={{ padding: "10px 14px", marginBottom: 6, borderRadius: 8, backgroundColor: i === 2 ? "rgba(31,109,122,0.15)" : "rgba(244,241,234,0.04)", border: i === 2 ? `1px solid ${C.teal}` : "1px solid rgba(244,241,234,0.06)", fontSize: 14, color: i === 2 ? C.teal : "rgba(244,241,234,0.50)", fontWeight: i === 2 ? 600 : 400 }}>{opt}</div>
          ))}
        </div>
      ),
    },
    {
      num: "02", title: "The model scores your structure",
      body: "Model RP-2.0 evaluates your answers across fixed structural dimensions. It applies cross-factor interaction rules \u2014 capturing how weaknesses compound \u2014 and produces a single 0\u2013100 score.",
      detail: "Fixed rules. Deterministic. No machine learning.",
      screen: (
        <div style={{ padding: m ? "16px 14px" : "20px 18px" }}>
          <div style={{ ...T.label, color: C.sandLight, marginBottom: 16 }}>Calculating</div>
          {["Evaluating structural factors", "Applying cross-factor interactions", "Computing stability classification", "Generating structural diagnosis"].map((step, i) => (
            <div key={step} style={{ display: "flex", gap: 10, alignItems: "center", marginBottom: 12 }}>
              <div style={{ width: 20, height: 20, borderRadius: "50%", backgroundColor: i < 3 ? C.teal : "rgba(244,241,234,0.08)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                {i < 3 && <svg width="10" height="10" viewBox="0 0 10 10"><path d="M2 5L4 7L8 3" stroke="#F4F1EA" strokeWidth="1.5" fill="none" strokeLinecap="round" /></svg>}
              </div>
              <span style={{ fontSize: 14, color: i < 3 ? "rgba(244,241,234,0.60)" : "rgba(244,241,234,0.25)", fontWeight: i === 3 ? 500 : 400 }}>{step}</span>
            </div>
          ))}
          <div style={{ height: 3, borderRadius: 2, backgroundColor: "rgba(244,241,234,0.06)", marginTop: 8 }}>
            <div style={{ height: 3, borderRadius: 2, backgroundColor: C.teal, width: "75%" }} />
          </div>
        </div>
      ),
    },
    {
      num: "03", title: "You see your score instantly",
      body: "Your Income Stability Score\u2122, your stability band, a consequence sentence explaining what the structure can absorb, how far you are from the next band, and the single biggest structural factor limiting your score.",
      detail: "Free. Instant. No payment required.",
      screen: (
        <div style={{ padding: m ? "16px 14px" : "20px 18px", textAlign: "center" }}>
          <div style={{ fontFamily: mono, fontSize: 48, fontWeight: 600, color: C.sandText, lineHeight: 1, marginBottom: 4 }}>48</div>
          <div style={{ fontFamily: mono, fontSize: 14, color: "rgba(244,241,234,0.35)", marginBottom: 12 }}>out of 100</div>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "4px 12px", borderRadius: 100, backgroundColor: "rgba(146,100,10,0.15)", marginBottom: 12 }}>
            <div style={{ width: 6, height: 6, borderRadius: "50%", backgroundColor: C.bandDeveloping }} />
            <span style={{ fontSize: 13, fontWeight: 600, color: C.bandDeveloping }}>Developing Stability</span>
          </div>
          <div style={{ fontFamily: mono, fontSize: 13, color: "rgba(244,241,234,0.40)", lineHeight: 1.5 }}>12 points to Established</div>
        </div>
      ),
    },
    {
      num: "04", title: "You unlock the full diagnostic",
      body: "The $69 report uses your score plus additional context \u2014 your operating structure, income model, and industry \u2014 to produce a 4-page structural diagnosis with PressureMap intelligence, risk scenarios, projected actions, tradeoff analysis, and a lifetime simulator.",
      detail: "Same score. Deeper interpretation. Practical action plan.",
      screen: (
        <div style={{ padding: m ? "16px 14px" : "20px 18px" }}>
          {[
            { num: "01", title: "Your Score", color: C.purple },
            { num: "02", title: "Income Structure", color: C.teal },
            { num: "03", title: "Disruption Analysis", color: C.bandLimited },
            { num: "04", title: "Best Next Move", color: C.purple },
          ].map((p, i) => (
            <div key={p.num} style={{ display: "flex", gap: 10, alignItems: "center", padding: "8px 0", borderBottom: i < 3 ? "1px solid rgba(244,241,234,0.06)" : "none" }}>
              <span style={{ fontFamily: mono, fontSize: 13, fontWeight: 700, color: p.color, minWidth: 22 }}>{p.num}</span>
              <span style={{ fontSize: 14, fontWeight: 500, color: "rgba(244,241,234,0.60)" }}>{p.title}</span>
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
                        <p style={{ fontSize: 16, color: B.muted, lineHeight: 1.65, marginBottom: 8 }}>{step.body}</p>
                        <p style={{ fontSize: 14, color: B.teal, fontWeight: 500, margin: 0 }}>{step.detail}</p>
                      </>
                    )}
                    {isRight && (
                      <div style={{ backgroundColor: B.navy, borderRadius: 16, overflow: "hidden", boxShadow: "0 8px 32px rgba(14,26,43,0.12)", border: `1px solid ${B.borderMd}` }}>
                        <div style={{ padding: "8px 14px 0", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                          <Image src={logoWhite} alt="RunPayway" width={90} height={11} style={{ height: "auto", opacity: 0.7 }} />
                          <div style={{ width: 4, height: 4, borderRadius: "50%", backgroundColor: B.teal, opacity: 0.6 }} />
                        </div>
                        {step.screen}
                      </div>
                    )}
                  </div>
                )}

                {/* Center dot */}
                {!m && (
                  <div style={{ display: "flex", justifyContent: "center", paddingTop: 4 }}>
                    <div style={{ width: 14, height: 14, borderRadius: "50%", backgroundColor: "#FFFFFF", border: `3px solid ${B.teal}`, boxShadow: `0 0 0 4px ${B.bone}, 0 0 8px rgba(26,122,109,0.20)`, position: "relative", zIndex: 2 }} />
                  </div>
                )}

                {/* Right content or empty */}
                {!m && (
                  <div style={{ paddingLeft: 32, display: "flex", flexDirection: "column", justifyContent: "center" }}>
                    {isRight && (
                      <>
                        <div style={{ ...T.label, color: C.teal, marginBottom: 8 }}>Step <span style={{ fontFamily: mono }}>{step.num}</span></div>
                        <h3 style={{ ...h3Style(m), color: C.navy, marginBottom: 10 }}>{step.title}</h3>
                        <p style={{ fontSize: 16, color: B.muted, lineHeight: 1.65, marginBottom: 8 }}>{step.body}</p>
                        <p style={{ fontSize: 14, color: B.teal, fontWeight: 500, margin: 0 }}>{step.detail}</p>
                      </>
                    )}
                    {!isRight && (
                      <div style={{ backgroundColor: B.navy, borderRadius: 16, overflow: "hidden", boxShadow: "0 8px 32px rgba(14,26,43,0.12)", border: `1px solid ${B.borderMd}` }}>
                        <div style={{ padding: "8px 14px 0", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                          <Image src={logoWhite} alt="RunPayway" width={90} height={11} style={{ height: "auto", opacity: 0.7 }} />
                          <div style={{ width: 4, height: 4, borderRadius: "50%", backgroundColor: B.teal, opacity: 0.6 }} />
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
                      <div style={{ width: 32, height: 32, borderRadius: 8, backgroundColor: "rgba(26,122,109,0.08)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, fontWeight: 700, color: B.teal, flexShrink: 0 }}>{step.num}</div>
                      <h3 style={{ fontSize: 18, fontWeight: 600, color: B.navy, margin: 0, letterSpacing: "-0.02em" }}>{step.title}</h3>
                    </div>
                    <div style={{ backgroundColor: B.navy, borderRadius: 14, overflow: "hidden", boxShadow: "0 6px 24px rgba(14,26,43,0.10)", marginBottom: 16 }}>
                      <div style={{ padding: "6px 12px 0", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <Image src={logoWhite} alt="RunPayway" width={90} height={11} style={{ height: "auto", opacity: 0.7 }} />
                        <div style={{ width: 4, height: 4, borderRadius: "50%", backgroundColor: B.teal, opacity: 0.6 }} />
                      </div>
                      {step.screen}
                    </div>
                    <p style={{ fontSize: 15, color: B.muted, lineHeight: 1.6, marginBottom: 6 }}>{step.body}</p>
                    <p style={{ fontSize: 14, color: B.teal, fontWeight: 500, margin: 0 }}>{step.detail}</p>
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
    { title: "Recurring Income", desc: "How much income continues from existing agreements without new acquisition.", low: "0% recurring \u2014 you rebuild from scratch every month.", high: "60%+ recurring \u2014 most income renews automatically.", color: B.teal },
    { title: "Source Concentration", desc: "How much depends on your single largest client or source.", low: "90%+ from one source \u2014 a single loss collapses the structure.", high: "Under 30% from any single source \u2014 no single point of failure.", color: B.purple },
    { title: "Source Diversity", desc: "How many meaningful, independent income sources support the structure.", low: "1 source \u2014 total dependency on a single relationship.", high: "5+ sources each contributing 10%+ \u2014 well-diversified.", color: B.teal },
    { title: "Forward Visibility", desc: "How far ahead income is already committed or contracted.", low: "Less than 1 month \u2014 no income secured beyond what you earn today.", high: "12+ months committed \u2014 strong forward protection.", color: B.purple },
    { title: "Earnings Consistency", desc: "How stable income is from month to month.", low: "Fluctuates 75%+ \u2014 income is unpredictable and hard to plan around.", high: "Fluctuates less than 10% \u2014 highly predictable month to month.", color: "#D97706" },
    { title: "Labor Independence", desc: "What percentage of income continues without your daily effort.", low: "0% continues \u2014 if you stop working, income stops immediately.", high: "76%+ continues \u2014 income persists through extended absence.", color: B.navy },
  ];

  return (
    <section ref={ref} style={{ backgroundColor: "#FFFFFF", paddingTop: m ? SY.mobile : SY.desktop, paddingBottom: m ? SY.mobile : SY.desktop, paddingLeft: m ? PAD.mobile : PAD.desktop, paddingRight: m ? PAD.mobile : PAD.desktop }}>
      <div style={{ maxWidth: MAX, margin: "0 auto" }}>
        <div style={{ maxWidth: 600, marginBottom: m ? 40 : 56, opacity: visible ? 1 : 0, transform: visible ? "translateY(0)" : "translateY(16px)", transition: "opacity 600ms ease-out, transform 600ms ease-out" }}>
          <div style={{ fontSize: 13, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase" as const, color: B.teal, marginBottom: 16 }}>The Model</div>
          <h2 style={{ fontSize: m ? 28 : 48, fontWeight: 600, color: B.navy, lineHeight: 1.12, letterSpacing: "-0.025em", marginBottom: 16 }}>
            What each dimension measures.
          </h2>
          <p style={{ fontSize: m ? 16 : 18, color: B.muted, lineHeight: 1.65 }}>
            Each dimension is scored independently. The model then applies cross-factor interaction rules to capture how weaknesses compound.
          </p>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
          {dims.map((dim, i) => {
            const isOpen = expandedIdx === i;
            return (
              <div key={dim.title} style={{
                borderBottom: `1px solid ${B.border}`,
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
                      <div style={{ fontSize: m ? 17 : 20, fontWeight: 600, color: B.navy, letterSpacing: "-0.01em" }}>{dim.title}</div>
                      <div style={{ fontSize: m ? 14 : 15, color: B.muted, lineHeight: 1.5, marginTop: 2 }}>{dim.desc}</div>
                    </div>
                  </div>
                  <span style={{ fontSize: 18, color: B.light, flexShrink: 0, transform: isOpen ? "rotate(180deg)" : "rotate(0deg)", transition: "transform 200ms ease" }}>&#9662;</span>
                </button>
                {isOpen && (
                  <div style={{ paddingLeft: m ? 24 : 24, paddingBottom: 24, display: "grid", gridTemplateColumns: m ? "1fr" : "1fr 1fr", gap: 12 }}>
                    <div style={{ padding: "14px 16px", borderRadius: 10, backgroundColor: "rgba(155,44,44,0.04)", border: "1px solid rgba(155,44,44,0.10)" }}>
                      <div style={{ fontSize: 13, fontWeight: 700, letterSpacing: "0.06em", color: B.bandLimited, textTransform: "uppercase" as const, marginBottom: 6 }}>Low Score</div>
                      <div style={{ fontSize: 14, color: B.muted, lineHeight: 1.5 }}>{dim.low}</div>
                    </div>
                    <div style={{ padding: "14px 16px", borderRadius: 10, backgroundColor: "rgba(26,122,109,0.04)", border: "1px solid rgba(26,122,109,0.10)" }}>
                      <div style={{ fontSize: 13, fontWeight: 700, letterSpacing: "0.06em", color: B.bandHigh, textTransform: "uppercase" as const, marginBottom: 6 }}>High Score</div>
                      <div style={{ fontSize: 14, color: B.muted, lineHeight: 1.5 }}>{dim.high}</div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <div style={{ textAlign: "center", marginTop: 32, fontSize: 14, color: B.light, opacity: visible ? 1 : 0, transition: "opacity 600ms ease-out 500ms" }}>
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
    { range: "0\u201329", label: "Limited", color: B.bandLimited, consequence: "Your income depends almost entirely on active work. A major disruption puts immediate pressure on the structure." },
    { range: "30\u201349", label: "Developing", color: B.bandDeveloping, consequence: "You can handle small disruptions, but a major source loss would put pressure on the structure quickly." },
    { range: "50\u201374", label: "Established", color: B.bandEstablished, consequence: "Your income can absorb most common disruptions without dropping below a stable threshold." },
    { range: "75\u2013100", label: "High", color: B.bandHigh, consequence: "Your income can absorb a lost client, a slow quarter, or a 90-day work pause without structural damage." },
  ];

  return (
    <section ref={ref} style={{ backgroundColor: B.navy, paddingTop: m ? SY.mobile : SY.desktop, paddingBottom: m ? SY.mobile : SY.desktop, paddingLeft: m ? PAD.mobile : PAD.desktop, paddingRight: m ? PAD.mobile : PAD.desktop }}>
      <div style={{ maxWidth: 800, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: m ? 40 : 56, opacity: visible ? 1 : 0, transform: visible ? "translateY(0)" : "translateY(16px)", transition: "opacity 600ms ease-out, transform 600ms ease-out" }}>
          <div style={{ fontSize: 13, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase" as const, color: B.teal, marginBottom: 16 }}>Classification</div>
          <h2 style={{ fontSize: m ? 28 : 48, fontWeight: 600, color: "#F4F1EA", lineHeight: 1.12, letterSpacing: "-0.025em", marginBottom: 12 }}>
            What your score means.
          </h2>
          <p style={{ fontSize: m ? 16 : 18, color: "rgba(244,241,234,0.45)", lineHeight: 1.65, maxWidth: 480, margin: "0 auto" }}>
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
              backgroundColor: "rgba(244,241,234,0.04)", border: "1px solid rgba(244,241,234,0.08)",
              position: "relative", overflow: "hidden",
              opacity: visible ? 1 : 0, transform: visible ? "translateY(0)" : "translateY(12px)",
              transition: `opacity 500ms ease-out ${300 + i * 100}ms, transform 500ms ease-out ${300 + i * 100}ms`,
            }}>
              <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 3, backgroundColor: b.color }} />
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10, flexWrap: "wrap" as const }}>
                <div style={{ width: 8, height: 8, borderRadius: "50%", backgroundColor: b.color, flexShrink: 0 }} />
                <span style={{ fontSize: 15, fontWeight: 700, color: b.color }}>{b.range}</span>
                <span style={{ fontSize: 15, fontWeight: 600, color: "#F4F1EA" }}>{b.label} Stability</span>
              </div>
              <p style={{ fontSize: 14, color: "rgba(244,241,234,0.50)", lineHeight: 1.55, margin: 0 }}>{b.consequence}</p>
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
    <section ref={ref} style={{ backgroundColor: B.sand, paddingTop: m ? SY.mobile : SY.desktop, paddingBottom: m ? SY.mobile : SY.desktop, paddingLeft: m ? PAD.mobile : PAD.desktop, paddingRight: m ? PAD.mobile : PAD.desktop }}>
      <div style={{ maxWidth: 800, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: m ? 40 : 56, opacity: visible ? 1 : 0, transform: visible ? "translateY(0)" : "translateY(16px)", transition: "opacity 600ms ease-out, transform 600ms ease-out" }}>
          <div style={{ fontSize: 13, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase" as const, color: B.teal, marginBottom: 16 }}>Architecture</div>
          <h2 style={{ fontSize: m ? 28 : 48, fontWeight: 600, color: B.navy, lineHeight: 1.12, letterSpacing: "-0.025em", marginBottom: 12 }}>
            Two layers. One boundary.
          </h2>
          <p style={{ fontSize: m ? 16 : 18, color: B.muted, lineHeight: 1.65, maxWidth: 520, margin: "0 auto" }}>
            The score and the report are built separately. The boundary between them is fixed and auditable.
          </p>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: m ? "1fr" : "1fr 1fr", gap: m ? 16 : 20 }}>
          {/* Layer 1 */}
          <div style={{ padding: m ? "24px 20px" : "32px 28px", borderRadius: 14, backgroundColor: "#FFFFFF", border: `1px solid ${B.borderMd}`, boxShadow: "0 2px 8px rgba(14,26,43,0.04)", opacity: visible ? 1 : 0, transform: visible ? "translateY(0)" : "translateY(12px)", transition: "opacity 500ms ease-out 100ms, transform 500ms ease-out 100ms" }}>
            <div style={{ fontSize: 13, fontWeight: 700, letterSpacing: "0.08em", color: B.teal, textTransform: "uppercase" as const, marginBottom: 12 }}>Layer 1 — Core Score</div>
            <h3 style={{ fontSize: m ? 20 : 22, fontWeight: 600, color: B.navy, marginBottom: 12, letterSpacing: "-0.02em" }}>The number.</h3>
            <p style={{ fontSize: 15, color: B.muted, lineHeight: 1.6, marginBottom: 16 }}>Generated from fixed structural questions only. Same answers, same score. No contextual input can alter it.</p>
            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              {["Score (0\u2013100)", "Band classification", "Cross-factor interactions", "Sensitivity analysis"].map(item => (
                <div key={item} style={{ display: "flex", gap: 8, alignItems: "center" }}>
                  <div style={{ width: 5, height: 5, borderRadius: "50%", backgroundColor: B.teal, flexShrink: 0 }} />
                  <span style={{ fontSize: 14, color: B.navy }}>{item}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Layer 2 */}
          <div style={{ padding: m ? "24px 20px" : "32px 28px", borderRadius: 14, backgroundColor: B.navy, boxShadow: "0 4px 16px rgba(14,26,43,0.10)", opacity: visible ? 1 : 0, transform: visible ? "translateY(0)" : "translateY(12px)", transition: "opacity 500ms ease-out 200ms, transform 500ms ease-out 200ms" }}>
            <div style={{ fontSize: 13, fontWeight: 700, letterSpacing: "0.08em", color: B.teal, textTransform: "uppercase" as const, marginBottom: 12 }}>Layer 2 — Context Precision</div>
            <h3 style={{ fontSize: m ? 20 : 22, fontWeight: 600, color: "#F4F1EA", marginBottom: 12, letterSpacing: "-0.02em" }}>The interpretation.</h3>
            <p style={{ fontSize: 15, color: "rgba(244,241,234,0.50)", lineHeight: 1.6, marginBottom: 16 }}>Uses your operating structure, income model, and industry to improve explanation quality, scenario relevance, and action planning. Does not change the score.</p>
            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              {["Scenario selection", "Action priority ordering", "Language precision", "Category framing"].map(item => (
                <div key={item} style={{ display: "flex", gap: 8, alignItems: "center" }}>
                  <div style={{ width: 5, height: 5, borderRadius: "50%", backgroundColor: B.teal, flexShrink: 0 }} />
                  <span style={{ fontSize: 14, color: "rgba(244,241,234,0.60)" }}>{item}</span>
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
    <section ref={ref} style={{ background: B.gradient, position: "relative", overflow: "hidden", paddingTop: m ? SY.mobile : SY.desktop, paddingBottom: m ? SY.mobile : SY.desktop }}>
      <div style={{ position: "absolute", top: "50%", left: "50%", width: 700, height: 700, transform: "translate(-50%, -50%)", background: "radial-gradient(circle, rgba(75,63,174,0.15) 0%, transparent 70%)", pointerEvents: "none" }} />
      <div style={{ maxWidth: MAX, margin: "0 auto", padding: `0 ${m ? PAD.mobile : PAD.desktop}px`, position: "relative", zIndex: 1, textAlign: "center" }}>
        <div style={{ opacity: visible ? 1 : 0, transform: visible ? "translateY(0)" : "translateY(16px)", transition: "opacity 600ms ease-out, transform 600ms ease-out" }}>
          <h2 style={{ fontSize: m ? 28 : 48, color: "#F4F1EA", fontWeight: 600, letterSpacing: "-0.025em", lineHeight: 1.12, marginBottom: 20 }}>
            See where your income stands.
          </h2>
          <p style={{ fontSize: m ? 16 : 18, color: "rgba(250,249,247,0.55)", lineHeight: 1.65, maxWidth: 440, margin: "0 auto 40px" }}>
            Your free score shows where you stand. The full report shows what to do about it.
          </p>
          <Link
            href="/pricing"
            onMouseEnter={() => canHover() && setHovered(true)}
            onMouseLeave={() => setHovered(false)}
            style={{
              display: "inline-flex", alignItems: "center", justifyContent: "center",
              height: m ? 48 : 56, paddingLeft: 36, paddingRight: 36, borderRadius: 10,
              backgroundColor: "#F4F1EA", color: B.navy, fontSize: 16, fontWeight: 600,
              textDecoration: "none", boxShadow: hovered ? "0 8px 28px rgba(0,0,0,0.25)" : "0 4px 16px rgba(0,0,0,0.15)",
              transform: hovered ? "translateY(-2px)" : "translateY(0)", transition: "box-shadow 260ms ease, transform 260ms ease",
            }}
          >
            Start Your Assessment
          </Link>
          <div style={{ marginTop: 20, fontSize: 14, color: "rgba(250,249,247,0.35)" }}>
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
