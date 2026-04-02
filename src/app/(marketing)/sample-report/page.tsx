"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import logoWhite from "../../../../public/runpayway-logo-white.png";
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

/* ------------------------------------------------------------------ */
/*  Helpers                                                            */
/* ------------------------------------------------------------------ */

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
            <span style={{ ...T.label, color: C.teal }}>Sample Report</span>
            <span style={{ fontSize: 11, fontFamily: mono, fontWeight: 500, color: C.sandLight, padding: "3px 8px", borderRadius: 4, border: `1px solid ${C.sandBorder}` }}>RP-2.0</span>
          </div>
          <h1 style={{ ...h1(m), color: C.sandText, lineHeight: 1.08, letterSpacing: "-0.03em", marginBottom: 24, maxWidth: 680, margin: "0 auto 24px" }}>
            See exactly what the{!m && <br />} diagnostic report contains.
          </h1>
          <p style={{ ...body(m), color: C.sandMuted, maxWidth: 500, margin: "0 auto" }}>
            Four pages. Every section generated from your structural inputs. Here is the report for a score of <span style={{ fontFamily: mono, color: C.sandText }}>72</span>.
          </p>
        </div>
      </div>
    </section>
  );
}


/* ================================================================== */
/* 2. REPORT PAGES — Exact match to actual report structure            */
/* ================================================================== */
function ReportPages() {
  const { ref, visible } = useInView();
  const m = useMobile();

  const pages = [
    {
      num: "01", title: "Cover & Score", color: C.purple,
      screen: (
        <div style={{ padding: m ? "16px 14px" : "20px 18px", textAlign: "center" }}>
          <div style={{ fontSize: 9, fontFamily: mono, letterSpacing: "0.10em", color: C.sandLight, marginBottom: 10 }}>INCOME STABILITY REPORT</div>
          <div style={{ fontSize: 10, letterSpacing: "0.08em", color: C.teal, marginBottom: 12 }}>STRUCTURAL ASSESSMENT &middot; CONFIDENTIAL</div>
          <div style={{ fontFamily: mono, fontSize: 42, fontWeight: 300, color: C.sandText, lineHeight: 1, marginBottom: 2 }}>72</div>
          <div style={{ fontFamily: mono, fontSize: 11, color: C.sandLight, marginBottom: 10 }}>/ 100</div>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 5, padding: "3px 10px", borderRadius: 100, backgroundColor: "rgba(43,94,167,0.12)", marginBottom: 6 }}>
            <div style={{ width: 5, height: 5, borderRadius: "50%", backgroundColor: C.bandEstablished }} />
            <span style={{ fontSize: 11, fontWeight: 600, color: C.bandEstablished }}>Established Stability</span>
          </div>
          <div style={{ fontFamily: mono, fontSize: 10, color: C.teal, marginTop: 4 }}>3 points to High Stability</div>
          <div style={{ height: 1, backgroundColor: C.sandBorder, margin: "10px auto", width: "60%" }} />
          <div style={{ fontSize: 9, color: C.sandLight }}>Model RP-2.0 &middot; Confidential</div>
        </div>
      ),
      desc: "Your Income Stability Score, stability band, distance to the next band, and a confidential access code for the Command Center.",
    },
    {
      num: "02", title: "Key Findings", color: C.teal,
      screen: (
        <div style={{ padding: m ? "16px 14px" : "20px 18px" }}>
          {/* Key takeaway */}
          <div style={{ padding: "8px 10px", borderRadius: 6, borderLeft: `2px solid ${C.purple}`, backgroundColor: "rgba(75,63,174,0.04)", marginBottom: 10 }}>
            <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.06em", color: C.purple, marginBottom: 2, textTransform: "uppercase" as const }}>Key Takeaway</div>
            <div style={{ fontSize: 11, color: C.sandMuted, lineHeight: 1.4 }}>Solid foundation — but income concentration is limiting the score. One client carries too much weight.</div>
          </div>

          {/* Income structure bar */}
          <div style={{ marginBottom: 10 }}>
            <div style={{ fontSize: 9, fontWeight: 700, letterSpacing: "0.06em", color: C.sandLight, marginBottom: 4, textTransform: "uppercase" as const }}>Income Structure</div>
            <div style={{ display: "flex", gap: 1, height: 5, borderRadius: 3, overflow: "hidden" }}>
              <div style={{ flex: 55, backgroundColor: C.bandLimited }} />
              <div style={{ flex: 20, backgroundColor: C.amber }} />
              <div style={{ flex: 25, backgroundColor: C.teal }} />
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", marginTop: 3 }}>
              <span style={{ fontSize: 9, color: C.sandLight }}>Active <span style={{ fontFamily: mono }}>55%</span></span>
              <span style={{ fontSize: 9, color: C.sandLight }}>Semi-persistent <span style={{ fontFamily: mono }}>20%</span></span>
              <span style={{ fontSize: 9, color: C.sandLight }}>Persistent <span style={{ fontFamily: mono }}>25%</span></span>
            </div>
          </div>

          {/* In Plain English */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 4 }}>
            <div style={{ padding: "6px 8px", borderRadius: 4, backgroundColor: "rgba(31,109,122,0.04)" }}>
              <div style={{ fontSize: 9, fontWeight: 700, color: C.teal, letterSpacing: "0.04em", textTransform: "uppercase" as const, marginBottom: 2 }}>The Strength</div>
              <div style={{ fontSize: 10, color: C.sandMuted, lineHeight: 1.3 }}>Low variability. Earnings are consistent month to month.</div>
            </div>
            <div style={{ padding: "6px 8px", borderRadius: 4, backgroundColor: "rgba(155,44,44,0.03)" }}>
              <div style={{ fontSize: 9, fontWeight: 700, color: C.bandLimited, letterSpacing: "0.04em", textTransform: "uppercase" as const, marginBottom: 2 }}>The Risk</div>
              <div style={{ fontSize: 10, color: C.sandMuted, lineHeight: 1.3 }}>High concentration. One source carries most of the weight.</div>
            </div>
          </div>
        </div>
      ),
      desc: "Plain-English interpretation, key takeaway, income structure breakdown (active / semi-persistent / persistent), structural strengths and risks — all generated from your inputs.",
    },
    {
      num: "03", title: "What To Do Next", color: C.purple,
      screen: (
        <div style={{ padding: m ? "16px 14px" : "20px 18px" }}>
          {/* Action steps */}
          {[
            { step: "1", action: "Reduce concentration below 50%", lift: "+5", color: C.purple },
            { step: "2", action: "Secure 3 months forward visibility", lift: "+4", color: C.teal },
            { step: "3", action: "Add one recurring revenue stream", lift: "+3", color: C.navy },
          ].map((a, i) => (
            <div key={a.step} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "7px 0", borderBottom: i < 2 ? `1px solid ${C.sandBorder}` : "none" }}>
              <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
                <span style={{ fontFamily: mono, fontSize: 10, fontWeight: 700, color: a.color, minWidth: 12 }}>{a.step}</span>
                <span style={{ fontSize: 12, fontWeight: 500, color: C.sandMuted }}>{a.action}</span>
              </div>
              <span style={{ fontFamily: mono, fontSize: 13, fontWeight: 700, color: C.teal }}>{a.lift}</span>
            </div>
          ))}

          {/* Combined impact */}
          <div style={{ marginTop: 8, padding: "6px 10px", borderRadius: 4, backgroundColor: "rgba(31,109,122,0.06)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={{ fontSize: 10, color: C.sandLight }}>Combined projected score</span>
            <span style={{ fontFamily: mono, fontSize: 14, fontWeight: 600, color: C.teal }}>72 &rarr; 82</span>
          </div>

          {/* Command Center CTA */}
          <div style={{ marginTop: 8, padding: "6px 10px", borderRadius: 4, border: `1px solid ${C.sandBorder}`, textAlign: "center" }}>
            <div style={{ fontSize: 9, fontWeight: 700, letterSpacing: "0.06em", color: C.sandLight, textTransform: "uppercase" as const, marginBottom: 2 }}>Command Center</div>
            <div style={{ fontSize: 10, color: C.sandMuted }}>PressureMap&#8482; &middot; Simulator &middot; 12-week roadmap</div>
          </div>
        </div>
      ),
      desc: "Highest-leverage actions ranked by projected score impact, combined improvement projection, 30-day execution roadmap, and what to avoid.",
    },
    {
      num: "04", title: "Stress Testing", color: C.bandLimited,
      screen: (
        <div style={{ padding: m ? "16px 14px" : "20px 18px" }}>
          <div style={{ fontSize: 9, fontWeight: 700, letterSpacing: "0.06em", color: C.sandLight, marginBottom: 8, textTransform: "uppercase" as const }}>Ranked by damage</div>
          {[
            { title: "Your largest client stops paying", score: "72 \u2192 44", color: C.bandLimited },
            { title: "You cannot work for 90 days", score: "72 \u2192 52", color: C.bandEstablished },
            { title: "Forward commitments delayed", score: "72 \u2192 61", color: C.bandEstablished },
          ].map((s, i) => (
            <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "6px 0", borderLeft: `2px solid ${s.color}`, paddingLeft: 8, marginBottom: 3 }}>
              <span style={{ fontSize: 11, fontWeight: 500, color: C.sandMuted }}>{s.title}</span>
              <span style={{ fontSize: 11, fontWeight: 600, fontFamily: mono, color: C.sandLight, flexShrink: 0, marginLeft: 6 }}>{s.score}</span>
            </div>
          ))}
          <div style={{ height: 1, backgroundColor: C.sandBorder, margin: "6px 0" }} />
          <div style={{ fontSize: 9, fontWeight: 700, letterSpacing: "0.06em", color: C.sandLight, marginBottom: 3, textTransform: "uppercase" as const }}>Command Center Access</div>
          <div style={{ padding: "4px 8px", borderRadius: 4, backgroundColor: C.sandBorder, fontSize: 9, fontFamily: mono, color: C.sandMuted }}>Access code included on this page</div>
        </div>
      ),
      desc: "Ranked disruption scenarios with exact score drops, fragility assessment, real-world impact projections, and your Command Center access code.",
    },
  ];

  return (
    <section ref={ref} style={{ backgroundColor: C.sand, paddingTop: secPad(m), paddingBottom: secPad(m), paddingLeft: px(m), paddingRight: px(m) }}>
      <div style={{ maxWidth: maxW, margin: "0 auto" }}>
        <div style={{ marginBottom: sp(2), ...fadeIn(visible) }}>
          <span style={{ fontSize: 12, fontWeight: 500, letterSpacing: "0.14em", color: C.light, fontFamily: mono }}>01</span>
        </div>
        <div style={{ marginBottom: m ? 40 : 64, ...fadeIn(visible) }}>
          <h2 style={{ ...h2Style(m), color: C.navy, letterSpacing: "-0.02em", marginBottom: 12 }}>
            The report.
          </h2>
          <p style={{ ...body(m), color: C.muted, maxWidth: 520 }}>
            Four pages generated from your structural inputs. Every section is personalized to your operating context.
          </p>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: m ? 48 : 64 }}>
          {pages.map((page, i) => (
            <div key={page.num} style={{
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
                    <span style={{ fontSize: 11, fontFamily: mono, color: C.sandLight }}>Page {page.num}</span>
                  </div>
                  {page.screen}
                </div>
              </div>

              {/* Description */}
              <div style={{ display: "flex", flexDirection: "column", justifyContent: "center", order: m ? 1 : i % 2 === 1 ? 0 : 1 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
                  <span style={{ fontFamily: mono, fontSize: 13, fontWeight: 700, color: page.color }}>{page.num}</span>
                  <h3 style={{ ...h3Style(m), color: C.navy, margin: 0 }}>{page.title}</h3>
                </div>
                <p style={{ ...body(m), color: C.muted, margin: 0 }}>{page.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}


/* ================================================================== */
/* 3. COMMAND CENTER — Simulator + PressureMap                         */
/* ================================================================== */
function CommandCenter() {
  const { ref, visible } = useInView();
  const m = useMobile();

  return (
    <section ref={ref} style={{ backgroundColor: C.navy, paddingTop: secPad(m), paddingBottom: secPad(m), paddingLeft: px(m), paddingRight: px(m) }}>
      <div style={{ maxWidth: 720, margin: "0 auto" }}>
        <div style={{ marginBottom: sp(2), ...fadeIn(visible) }}>
          <span style={{ fontSize: 12, fontWeight: 500, letterSpacing: "0.14em", color: C.sandLight, fontFamily: mono }}>02</span>
        </div>
        <div style={{ textAlign: "center", marginBottom: m ? 32 : 48, ...fadeIn(visible) }}>
          <h2 style={{ ...h2Style(m), color: C.sandText, letterSpacing: "-0.02em", marginBottom: 12 }}>
            The Command Center.
          </h2>
          <p style={{ ...body(m), color: C.sandMuted, maxWidth: 480, margin: "0 auto" }}>
            Included with your diagnostic. Lifetime access. Every tool operates on your actual structural data.
          </p>
        </div>

        {/* Simulator preview */}
        <div style={{ backgroundColor: "rgba(244,241,234,0.03)", borderRadius: 14, border: `1px solid ${C.sandBorder}`, padding: m ? "20px 16px" : "24px 20px", marginBottom: 16, ...fadeIn(visible, 150) }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
            <div style={{ ...T.label, fontSize: 11, color: C.teal }}>Stability Simulator</div>
            <div style={{ fontSize: 10, fontFamily: mono, color: C.sandLight }}>Lifetime Access</div>
          </div>

          <div style={{ display: "flex", gap: 3, borderRadius: 8, overflow: "hidden", marginBottom: 14 }}>
            {[
              { l: "CURRENT", v: "72", c: C.sandText },
              { l: "SIMULATED", v: "82", c: C.teal },
              { l: "IMPACT", v: "+10", c: C.teal },
            ].map(col => (
              <div key={col.l} style={{ flex: 1, background: "rgba(244,241,234,0.04)", padding: m ? "10px 6px" : "12px 10px", textAlign: "center" }}>
                <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.08em", color: C.sandLight, marginBottom: 3 }}>{col.l}</div>
                <div style={{ fontSize: m ? 22 : 28, fontWeight: 300, fontFamily: mono, color: col.c, lineHeight: 1 }}>{col.v}</div>
              </div>
            ))}
          </div>

          {/* Dimension sliders */}
          {[
            { name: "Recurring Revenue", val: 45 },
            { name: "Concentration", val: 40 },
            { name: "Forward Visibility", val: 33 },
          ].map((dim) => (
            <div key={dim.name} style={{ marginBottom: 8 }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 3 }}>
                <span style={{ fontSize: 12, color: C.sandLight }}>{dim.name}</span>
                <span style={{ fontSize: 11, fontFamily: mono, color: C.sandLight }}>{dim.val}%</span>
              </div>
              <div style={{ height: 4, backgroundColor: C.sandBorder, borderRadius: 2, position: "relative" }}>
                <div style={{ height: 4, backgroundColor: C.teal, borderRadius: 2, width: `${dim.val}%`, opacity: 0.7 }} />
                <div style={{ position: "absolute", top: "50%", left: `${dim.val}%`, transform: "translate(-50%, -50%)", width: 8, height: 8, borderRadius: "50%", backgroundColor: "#fff", border: `2px solid ${C.teal}` }} />
              </div>
            </div>
          ))}
        </div>

        {/* Tool list */}
        <div style={{ display: "grid", gridTemplateColumns: m ? "1fr" : "1fr 1fr", gap: 8, ...fadeIn(visible, 250) }}>
          {[
            { name: "PressureMap\u2122", desc: "Structural intelligence specific to your industry and profile" },
            { name: "What-If Simulator", desc: "Test any structural change and see the projected score impact" },
            { name: "12-Week Roadmap", desc: "Execution plan based on your highest-leverage actions" },
            { name: "Industry Benchmarks", desc: "Your score relative to peers in your sector" },
          ].map((tool) => (
            <div key={tool.name} style={{ padding: "14px 16px", borderRadius: 10, backgroundColor: "rgba(244,241,234,0.03)", border: `1px solid ${C.sandBorder}` }}>
              <div style={{ fontSize: 14, fontWeight: 600, color: C.sandText, marginBottom: 3 }}>{tool.name}</div>
              <div style={{ fontSize: 12, color: C.sandLight, lineHeight: 1.4 }}>{tool.desc}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}


/* ================================================================== */
/* 4. WHAT'S INCLUDED — Comprehensive feature list                     */
/* ================================================================== */
function WhatsIncluded() {
  const { ref, visible } = useInView();
  const m = useMobile();

  const groups = [
    {
      cat: "Diagnostic Report",
      features: [
        "Income Stability Score (0\u2013100) with band classification",
        "Primary structural constraint identified",
        "Plain-English interpretation generated from your inputs",
        "Income composition breakdown (active / semi-persistent / persistent)",
        "PressureMap\u2122 structural intelligence for your industry",
      ],
    },
    {
      cat: "Risk Analysis",
      features: [
        "Ranked disruption scenarios with exact score drops",
        "Largest source removal impact (72 \u2192 44)",
        "90-day work interruption projection",
        "Fragility class assessment",
        "Cross-factor interaction effects",
      ],
    },
    {
      cat: "Action Plan",
      features: [
        "Actions ranked by projected score impact",
        "Combined improvement projection (72 \u2192 82)",
        "Structural tradeoff analysis per action",
        "30-day execution roadmap",
        "Reassessment triggers",
      ],
    },
    {
      cat: "Command Center",
      features: [
        "Stability Simulator with lifetime access",
        "PressureMap\u2122 zone analysis",
        "12-week execution roadmap",
        "Industry-specific benchmarks",
        "Report delivered to your email",
      ],
    },
  ];

  return (
    <section ref={ref} style={{ backgroundColor: C.white, paddingTop: secPad(m), paddingBottom: secPad(m), paddingLeft: px(m), paddingRight: px(m) }}>
      <div style={{ maxWidth: 900, margin: "0 auto" }}>
        <div style={{ marginBottom: sp(2), ...fadeIn(visible) }}>
          <span style={{ fontSize: 12, fontWeight: 500, letterSpacing: "0.14em", color: C.light, fontFamily: mono }}>03</span>
        </div>
        <div style={{ marginBottom: m ? 32 : 48, ...fadeIn(visible) }}>
          <h2 style={{ ...h2Style(m), color: C.navy, letterSpacing: "-0.02em", marginBottom: 12 }}>
            Everything included.
          </h2>
          <p style={{ ...body(m), color: C.muted, maxWidth: 480 }}>
            One purchase. No subscription. No upsell.
          </p>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: m ? "1fr" : "1fr 1fr", gap: m ? 16 : 20 }}>
          {groups.map((group, gi) => (
            <div key={group.cat} style={{
              padding: m ? "24px 20px" : "28px 24px", borderRadius: 12,
              backgroundColor: C.sand, border: `1px solid ${C.softBorder}`,
              ...fadeIn(visible, 100 + gi * 80),
            }}>
              <div style={{ ...T.label, fontSize: 11, color: C.teal, marginBottom: 16 }}>{group.cat}</div>
              {group.features.map((f) => (
                <div key={f} style={{ display: "flex", gap: 8, alignItems: "flex-start", marginBottom: 10 }}>
                  <div style={{ width: 4, height: 4, borderRadius: "50%", backgroundColor: C.teal, flexShrink: 0, marginTop: 7 }} />
                  <span style={{ fontSize: 14, color: C.navy, lineHeight: 1.5 }}>{f}</span>
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}


/* ================================================================== */
/* 5. CTA                                                              */
/* ================================================================== */
function Cta() {
  const { ref, visible } = useInView();
  const m = useMobile();

  return (
    <section ref={ref} style={{ backgroundColor: C.navy, paddingTop: secPad(m), paddingBottom: secPad(m), paddingLeft: px(m), paddingRight: px(m) }}>
      <div style={{ maxWidth: maxW, margin: "0 auto", textAlign: "center" }}>
        <div style={{ ...fadeIn(visible) }}>
          <h2 style={{ ...h2Style(m), color: C.sandText, letterSpacing: "-0.02em", marginBottom: 20 }}>
            Your income has a structure.{!m && <br />} Now you can measure it.
          </h2>
          <p style={{ ...body(m), color: C.sandMuted, maxWidth: 440, margin: "0 auto 40px" }}>
            The free score shows where you stand. The full diagnostic shows what to do about it.
          </p>
          <Link href="/pricing" style={{
            ...ctaButtonLight,
            height: m ? 48 : 56, paddingLeft: 36, paddingRight: 36, borderRadius: 10,
            backgroundColor: C.white, color: C.navy,
          }}>
            Start Your Assessment
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
export default function SampleReportPage() {
  return (
    <div style={{ fontFamily: sans, overflowX: "hidden" }}>
      <Hero />
      <ReportPages />
      <CommandCenter />
      <WhatsIncluded />
      <Cta />
    </div>
  );
}
