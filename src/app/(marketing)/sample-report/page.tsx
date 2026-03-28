"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import logoWhite from "../../../../public/runpayway-logo-white.png";

/* ------------------------------------------------------------------ */
/*  Hooks                                                              */
/* ------------------------------------------------------------------ */
const canHover = () => typeof window !== "undefined" && window.matchMedia("(hover: hover)").matches;

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
/*  Tokens                                                             */
/* ------------------------------------------------------------------ */
const B = {
  navy: "#0E1A2B",
  purple: "#4B3FAE",
  teal: "#1A7A6D",
  sand: "#F5F2EC",
  bone: "#FAF9F6",
  muted: "rgba(14,26,43,0.55)",
  light: "rgba(14,26,43,0.38)",
  border: "rgba(14,26,43,0.08)",
  borderMd: "rgba(14,26,43,0.12)",
  gradient: "linear-gradient(145deg, #0E1A2B 0%, #161430 35%, #3D2F9C 65%, #1A7A6D 100%)",
  bandLimited: "#9B2C2C",
  bandDeveloping: "#92640A",
  bandEstablished: "#2B5EA7",
  bandHigh: "#1A7A6D",
};

const SY = { desktop: 120, mobile: 72 };
const PAD = { desktop: 56, mobile: 24 };
const MAX = 1100;
const DF = "'DM Serif Display', Georgia, serif";

/* ================================================================== */
/* 1. HERO — Transparent, confident                                    */
/* ================================================================== */
function Hero() {
  const { ref, visible } = useInView();
  const m = useMobile();

  return (
    <section ref={ref} style={{ background: B.gradient, position: "relative", overflow: "hidden", paddingTop: m ? 120 : 180, paddingBottom: m ? 80 : 120 }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display&display=swap');`}</style>
      <div style={{ position: "absolute", top: "20%", left: "50%", width: 900, height: 900, transform: "translate(-50%, -50%)", background: "radial-gradient(circle, rgba(75,63,174,0.14) 0%, transparent 70%)", pointerEvents: "none" }} />
      <div style={{ maxWidth: MAX, margin: "0 auto", padding: `0 ${m ? PAD.mobile : PAD.desktop}px`, position: "relative", zIndex: 1, textAlign: "center" }}>
        <div style={{ opacity: visible ? 1 : 0, transform: visible ? "translateY(0)" : "translateY(24px)", transition: "opacity 800ms ease-out, transform 800ms ease-out" }}>
          <div style={{ fontSize: 13, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase" as const, color: B.teal, marginBottom: 28 }}>Sample Report</div>
          <h1 style={{ fontSize: m ? 36 : 56, fontFamily: DF, fontWeight: 400, color: "#F4F1EA", lineHeight: 1.08, letterSpacing: "-0.03em", marginBottom: 24, maxWidth: 680, margin: "0 auto 24px" }}>
            See what the report looks like<br />before you buy.
          </h1>
          <p style={{ fontSize: m ? 16 : 20, color: "rgba(244,241,234,0.50)", lineHeight: 1.6, maxWidth: 480, margin: "0 auto" }}>
            Five pages of structural diagnosis. An interactive simulator. Every number is yours.
          </p>
        </div>
      </div>
    </section>
  );
}

/* ================================================================== */
/* 2. REPORT PAGES PREVIEW — Visual proof of each page                 */
/* ================================================================== */
function ReportPreview() {
  const { ref, visible } = useInView();
  const m = useMobile();

  const pages = [
    {
      num: "01", title: "Score & Structural Diagnosis", color: B.purple,
      screen: (
        <div style={{ padding: m ? "16px 14px" : "20px 18px" }}>
          <div style={{ textAlign: "center", marginBottom: 12 }}>
            <div style={{ fontSize: 42, fontWeight: 600, color: "#F4F1EA", lineHeight: 1 }}>48</div>
            <div style={{ fontSize: 13, color: "rgba(244,241,234,0.30)", marginTop: 2 }}>/100</div>
            <div style={{ display: "inline-flex", alignItems: "center", gap: 5, marginTop: 8, padding: "3px 10px", borderRadius: 100, backgroundColor: "rgba(146,100,10,0.12)" }}>
              <div style={{ width: 5, height: 5, borderRadius: "50%", backgroundColor: B.bandDeveloping }} />
              <span style={{ fontSize: 12, fontWeight: 600, color: B.bandDeveloping }}>Developing Stability</span>
            </div>
            <div style={{ fontSize: 11, color: "rgba(244,241,234,0.30)", marginTop: 6 }}>6 points from Established</div>
          </div>
          <div style={{ padding: "10px 12px", borderRadius: 6, borderLeft: "2px solid #F4F1EA", backgroundColor: "rgba(244,241,234,0.04)", marginBottom: 8 }}>
            <div style={{ fontSize: 12, color: "rgba(244,241,234,0.55)", lineHeight: 1.5 }}>Your project-based income has limited forward visibility. Only 33% is secured ahead of time.</div>
          </div>
          <div style={{ padding: "8px 12px", borderRadius: 6, backgroundColor: "rgba(244,241,234,0.03)" }}>
            <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.06em", color: "rgba(244,241,234,0.20)", marginBottom: 3, textTransform: "uppercase" as const }}>In Plain English</div>
            <div style={{ fontSize: 11, color: "rgba(244,241,234,0.40)", lineHeight: 1.4 }}>AI-generated interpretation specific to your industry and structure.</div>
          </div>
        </div>
      ),
      desc: "Your score, AI-powered plain-English interpretation, biggest structural constraint, projected impact of fixing it, and distance to the next stability band.",
    },
    {
      num: "02", title: "PressureMap & Income Structure", color: B.teal,
      screen: (
        <div style={{ padding: m ? "16px 14px" : "20px 18px" }}>
          <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.06em", color: B.teal, marginBottom: 6, textTransform: "uppercase" as const }}>PressureMap&#8482;</div>
          <div style={{ fontSize: 11, color: "rgba(244,241,234,0.35)", marginBottom: 10 }}>Independent Contractor - Contract-Based - Manufacturing</div>
          {[
            { label: "What is most likely to disrupt stability", color: "#9B2C2C" },
            { label: "What is working in your favor", color: B.teal },
            { label: "Highest-leverage move right now", color: B.purple },
          ].map(s => (
            <div key={s.label} style={{ marginBottom: 6 }}>
              <div style={{ fontSize: 9, fontWeight: 700, color: s.color, letterSpacing: "0.04em", textTransform: "uppercase" as const }}>{s.label}</div>
              <div style={{ height: 6, backgroundColor: "rgba(244,241,234,0.04)", borderRadius: 3, marginTop: 3 }} />
            </div>
          ))}
          <div style={{ height: 1, backgroundColor: "rgba(244,241,234,0.06)", margin: "10px 0" }} />
          <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.06em", color: "rgba(244,241,234,0.20)", marginBottom: 6, textTransform: "uppercase" as const }}>How your income breaks down</div>
          <div style={{ display: "flex", gap: 1, height: 6, borderRadius: 3, overflow: "hidden", marginBottom: 6 }}>
            <div style={{ flex: 63, backgroundColor: B.navy }} />
            <div style={{ flex: 17, backgroundColor: "rgba(244,241,234,0.20)" }} />
            <div style={{ flex: 20, backgroundColor: B.teal }} />
          </div>
          <div style={{ display: "flex", gap: 4 }}>
            <div style={{ flex: 1, padding: "6px", borderRadius: 4, backgroundColor: "rgba(244,241,234,0.03)", textAlign: "center" }}>
              <div style={{ fontSize: 14, fontWeight: 600, color: "#F4F1EA" }}>48 to 26</div>
              <div style={{ fontSize: 9, color: "rgba(244,241,234,0.25)" }}>If biggest source leaves</div>
            </div>
            <div style={{ flex: 1, padding: "6px", borderRadius: 4, backgroundColor: "rgba(244,241,234,0.03)", textAlign: "center" }}>
              <div style={{ fontSize: 14, fontWeight: 600, color: "#F4F1EA" }}>1.8 mo</div>
              <div style={{ fontSize: 9, color: "rgba(244,241,234,0.25)" }}>If you stop working</div>
            </div>
          </div>
        </div>
      ),
      desc: "AI-generated PressureMap intelligence specific to your industry, income breakdown, biggest source loss impact, continuity window, strongest and weakest structural factors.",
    },
    {
      num: "03", title: "Fragility & Pressure Test", color: B.bandLimited,
      screen: (
        <div style={{ padding: m ? "16px 14px" : "20px 18px" }}>
          <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.06em", color: "rgba(244,241,234,0.20)", marginBottom: 8, textTransform: "uppercase" as const }}>Ranked by damage</div>
          {[
            { rank: "#1", title: "Your largest client stops paying", score: "48 to 26", color: B.bandLimited },
            { rank: "#2", title: "You cannot work for 90 days", score: "48 to 30", color: B.bandDeveloping },
            { rank: "#3", title: "New work arrives later than expected", score: "48 to 40", color: "rgba(244,241,234,0.15)" },
          ].map((s, i) => (
            <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "8px 0", borderLeft: `2px solid ${s.color}`, paddingLeft: 10, marginBottom: 4 }}>
              <span style={{ fontSize: 12, fontWeight: 500, color: "rgba(244,241,234,0.55)" }}>{s.title}</span>
              <span style={{ fontSize: 12, fontWeight: 600, color: "rgba(244,241,234,0.40)", flexShrink: 0, marginLeft: 8 }}>{s.score}</span>
            </div>
          ))}
          <div style={{ marginTop: 8, padding: "8px 10px", borderRadius: 6, backgroundColor: "rgba(244,241,234,0.03)" }}>
            <div style={{ fontSize: 10, fontWeight: 700, color: "rgba(244,241,234,0.20)", letterSpacing: "0.04em", textTransform: "uppercase" as const, marginBottom: 3 }}>How much can your income absorb?</div>
            <div style={{ fontSize: 12, fontWeight: 600, color: B.bandDeveloping }}>Moderate resilience</div>
          </div>
        </div>
      ),
      desc: "Ranked disruption scenarios with exact score drops, how much your income can absorb, and the structural pattern to watch.",
    },
    {
      num: "04", title: "Highest-Leverage Action Plan", color: B.purple,
      screen: (
        <div style={{ padding: m ? "16px 14px" : "20px 18px" }}>
          <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.06em", color: B.purple, marginBottom: 8, textTransform: "uppercase" as const }}>Highest-leverage change</div>
          <div style={{ fontSize: 12, fontWeight: 500, color: "rgba(244,241,234,0.60)", lineHeight: 1.5, marginBottom: 8 }}>Convert your top client relationship into a monthly retainer for ongoing advisory services.</div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "6px 10px", borderRadius: 4, backgroundColor: "rgba(26,122,109,0.08)", marginBottom: 10 }}>
            <span style={{ fontSize: 11, color: "rgba(244,241,234,0.40)" }}>Projected impact</span>
            <span style={{ fontSize: 14, fontWeight: 700, color: B.teal, fontFamily: DF }}>48 to 60 (+12)</span>
          </div>
          <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.06em", color: B.teal, marginBottom: 4, textTransform: "uppercase" as const }}>30-day roadmap</div>
          {["Audit current structure", "Design one recurring offer", "Secure first retainer", "Measure and plan next move"].map((step, i) => (
            <div key={i} style={{ display: "flex", gap: 6, alignItems: "center", marginBottom: 3 }}>
              <span style={{ fontSize: 9, fontWeight: 700, color: B.purple, minWidth: 14 }}>{i + 1}</span>
              <span style={{ fontSize: 11, color: "rgba(244,241,234,0.45)" }}>{step}</span>
            </div>
          ))}
        </div>
      ),
      desc: "AI-generated personalized action plan, structural tradeoff analysis, 30-day execution roadmap, and retake timing.",
    },
  ];

  return (
    <section ref={ref} style={{ backgroundColor: B.bone, paddingTop: m ? SY.mobile : SY.desktop, paddingBottom: m ? SY.mobile : SY.desktop, paddingLeft: m ? PAD.mobile : PAD.desktop, paddingRight: m ? PAD.mobile : PAD.desktop }}>
      <div style={{ maxWidth: MAX, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: m ? 40 : 64, opacity: visible ? 1 : 0, transform: visible ? "translateY(0)" : "translateY(16px)", transition: "opacity 600ms ease-out, transform 600ms ease-out" }}>
          <div style={{ fontSize: 13, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase" as const, color: B.teal, marginBottom: 16 }}>Inside The Report</div>
          <h2 style={{ fontSize: m ? 32 : 48, fontFamily: DF, fontWeight: 400, color: B.navy, lineHeight: 1.12, letterSpacing: "-0.025em", marginBottom: 12 }}>
            Four pages. Every section written for you.
          </h2>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: m ? 32 : 48 }}>
          {pages.map((page, i) => {
            const isRight = !m && i % 2 === 1;
            return (
              <div key={page.num} style={{
                display: m ? "flex" : "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: m ? 20 : 40,
                flexDirection: "column",
                alignItems: m ? "stretch" : "center",
                opacity: visible ? 1 : 0,
                transform: visible ? "translateY(0)" : "translateY(20px)",
                transition: `opacity 600ms ease-out ${150 + i * 100}ms, transform 600ms ease-out ${150 + i * 100}ms`,
              }}>
                {/* Screen preview */}
                <div style={{ order: m ? 0 : isRight ? 1 : 0 }}>
                  <div style={{ backgroundColor: B.navy, borderRadius: 16, overflow: "hidden", boxShadow: "0 8px 32px rgba(14,26,43,0.12)", border: `1px solid ${B.borderMd}` }}>
                    <div style={{ padding: "8px 14px 0", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <Image src={logoWhite} alt="RunPayway" width={80} height={10} style={{ height: "auto", opacity: 0.6 }} />
                      <span style={{ fontSize: 13, fontWeight: 600, color: "rgba(244,241,234,0.20)" }}>Page {page.num}</span>
                    </div>
                    {page.screen}
                  </div>
                </div>

                {/* Description */}
                <div style={{ display: "flex", flexDirection: "column", justifyContent: "center", order: m ? 1 : isRight ? 0 : 1 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
                    <div style={{ width: 32, height: 32, borderRadius: 8, backgroundColor: B.sand, border: `1px solid ${B.borderMd}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, fontWeight: 700, color: page.color, position: "relative", overflow: "hidden" }}>
                      <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 2, backgroundColor: page.color, opacity: 0.6 }} />
                      {page.num}
                    </div>
                    <h3 style={{ fontSize: m ? 22 : 26, fontWeight: 600, color: B.navy, letterSpacing: "-0.02em", margin: 0 }}>{page.title}</h3>
                  </div>
                  <p style={{ fontSize: m ? 15 : 17, color: B.muted, lineHeight: 1.65, margin: 0 }}>{page.desc}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

/* ================================================================== */
/* 3. SIMULATOR PREVIEW — Interactive tab showcase                     */
/* ================================================================== */
function SimulatorPreview() {
  const { ref, visible } = useInView();
  const m = useMobile();
  const [activeTab, setActiveTab] = useState<number | null>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleEnter = (i: number) => { if (timerRef.current) clearTimeout(timerRef.current); setActiveTab(i); };
  const handleLeave = () => { if (timerRef.current) clearTimeout(timerRef.current); timerRef.current = setTimeout(() => setActiveTab(null), 6000); };

  const tabs = [
    { label: "Adjust any dimension", desc: "Drag sliders to test changes" },
    { label: "Real-time score updates", desc: "Watch the projected score shift" },
    { label: "See what matters most", desc: "Which change has the biggest impact" },
  ];

  const screenDefault = (
    <>
      <div style={{ display: "flex", gap: 3, borderRadius: 8, overflow: "hidden", marginBottom: 14 }}>
        {[{ l: "CURRENT", v: "48", c: "#F4F1EA" }, { l: "SIMULATED", v: "62", c: B.teal }, { l: "IMPACT", v: "+14", c: B.teal }].map(col => (
          <div key={col.l} style={{ flex: 1, background: "rgba(244,241,234,0.04)", padding: m ? "10px 6px" : "12px 10px", textAlign: "center" }}>
            <div style={{ fontSize: 13, fontWeight: 700, letterSpacing: "0.08em", color: "rgba(244,241,234,0.25)", marginBottom: 3 }}>{col.l}</div>
            <div style={{ fontSize: m ? 22 : 28, fontWeight: 300, color: col.c, fontFamily: DF, lineHeight: 1 }}>{col.v}</div>
          </div>
        ))}
      </div>
      <div style={{ display: "flex", height: 4, borderRadius: 2, overflow: "hidden", marginBottom: 14, position: "relative" }}>
        <div style={{ flex: 30, backgroundColor: "rgba(220,74,74,0.25)" }} /><div style={{ flex: 20, backgroundColor: "rgba(212,148,10,0.25)" }} /><div style={{ flex: 25, backgroundColor: "rgba(59,130,246,0.6)" }} /><div style={{ flex: 25, backgroundColor: "rgba(26,122,109,0.25)" }} />
        <div style={{ position: "absolute", top: "50%", left: "55%", transform: "translate(-50%, -50%)", width: 8, height: 8, borderRadius: "50%", backgroundColor: "#fff", border: `2px solid ${B.teal}`, boxShadow: `0 0 6px rgba(26,122,109,0.4)` }} />
      </div>
    </>
  );

  const screenSliders = (
    <div>
      {["Recurring Revenue", "Source Concentration", "Forward Visibility", "Earnings Consistency", "Labor Independence"].map((dim, i) => (
        <div key={dim} style={{ marginBottom: i < 4 ? 12 : 0 }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 3 }}>
            <span style={{ fontSize: 13, fontWeight: 600, color: "rgba(244,241,234,0.40)" }}>{dim}</span>
            <span style={{ fontSize: 13, color: "rgba(244,241,234,0.25)" }}>{[15, 55, 25, 50, 10][i]}%</span>
          </div>
          <div style={{ height: 4, backgroundColor: "rgba(244,241,234,0.06)", borderRadius: 2, position: "relative" }}>
            <div style={{ height: 4, backgroundColor: B.teal, borderRadius: 2, width: `${[15, 55, 25, 50, 10][i]}%`, opacity: 0.7 }} />
            <div style={{ position: "absolute", top: "50%", left: `${[15, 55, 25, 50, 10][i]}%`, transform: "translate(-50%, -50%)", width: 9, height: 9, borderRadius: "50%", backgroundColor: "#fff", border: `2px solid ${B.teal}` }} />
          </div>
        </div>
      ))}
    </div>
  );

  const screenImpact = (
    <div>
      <div style={{ fontSize: 13, fontWeight: 700, letterSpacing: "0.08em", color: B.teal, marginBottom: 10, textTransform: "uppercase" as const }}>Highest Impact</div>
      {[{ a: "Add recurring revenue", l: "+8" }, { a: "Reduce concentration", l: "+5" }, { a: "Extend visibility", l: "+4" }].map((item, i) => (
        <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "8px 0", borderBottom: i < 2 ? "1px solid rgba(244,241,234,0.06)" : "none" }}>
          <span style={{ fontSize: 14, fontWeight: 500, color: "rgba(244,241,234,0.60)" }}>{item.a}</span>
          <span style={{ fontSize: 18, fontWeight: 700, color: B.teal, fontFamily: DF }}>{item.l}</span>
        </div>
      ))}
      <div style={{ marginTop: 12, padding: "8px 12px", borderRadius: 6, backgroundColor: "rgba(26,122,109,0.08)", border: "1px solid rgba(26,122,109,0.12)" }}>
        <div style={{ fontSize: 13, color: "rgba(244,241,234,0.50)" }}>All three: 48 &#8594; 65 (+17)</div>
      </div>
    </div>
  );

  const screens = [screenSliders, screenDefault, screenImpact];
  const current = activeTab !== null ? screens[activeTab] : screenDefault;

  return (
    <section ref={ref} style={{ backgroundColor: B.navy, paddingTop: m ? SY.mobile : SY.desktop, paddingBottom: m ? SY.mobile : SY.desktop, paddingLeft: m ? PAD.mobile : PAD.desktop, paddingRight: m ? PAD.mobile : PAD.desktop }}>
      <div style={{ maxWidth: 640, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: m ? 32 : 48, opacity: visible ? 1 : 0, transform: visible ? "translateY(0)" : "translateY(16px)", transition: "opacity 600ms ease-out, transform 600ms ease-out" }}>
          <div style={{ fontSize: 13, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase" as const, color: B.teal, marginBottom: 16 }}>RunPayway&#8482; Stability Simulator</div>
          <h2 style={{ fontSize: m ? 28 : 40, fontFamily: DF, fontWeight: 400, color: "#F4F1EA", lineHeight: 1.12, letterSpacing: "-0.025em", marginBottom: 8 }}>
            Model scenarios against your actual data.
          </h2>
          <p style={{ fontSize: m ? 15 : 16, color: "rgba(244,241,234,0.40)", lineHeight: 1.5, margin: "0 auto" }}>
            Included with your report. Lifetime access.
          </p>
        </div>

        <div style={{ backgroundColor: "rgba(244,241,234,0.03)", borderRadius: 16, border: `1px solid rgba(244,241,234,0.08)`, padding: m ? "20px 16px" : "24px 20px", marginBottom: 12, boxShadow: "0 12px 48px rgba(0,0,0,0.25)", minHeight: m ? 180 : 200, borderColor: activeTab !== null ? "rgba(26,122,109,0.25)" : "rgba(244,241,234,0.08)", transition: "border-color 300ms ease", opacity: visible ? 1 : 0, transform: visible ? "translateY(0)" : "translateY(12px)", transition: "opacity 600ms ease-out 200ms, transform 600ms ease-out 200ms, border-color 300ms ease" }}>
          <div key={activeTab ?? "d"}>{current}</div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: m ? "1fr" : "1fr 1fr 1fr", gap: 8 }}>
          {tabs.map((tab, i) => {
            const active = activeTab === i;
            return (
              <div key={tab.label} onMouseEnter={() => handleEnter(i)} onMouseLeave={handleLeave} onClick={() => handleEnter(i)} style={{
                padding: "14px 16px", borderRadius: 10, cursor: "pointer",
                backgroundColor: active ? "rgba(26,122,109,0.12)" : "rgba(244,241,234,0.03)",
                border: `1px solid ${active ? "rgba(26,122,109,0.30)" : "rgba(244,241,234,0.06)"}`,
                transition: "all 200ms ease",
              }}>
                <div style={{ fontSize: 14, fontWeight: 600, color: active ? B.teal : "#F4F1EA", marginBottom: 2, transition: "color 200ms" }}>{tab.label}</div>
                <div style={{ fontSize: 13, color: active ? "rgba(26,122,109,0.60)" : "rgba(244,241,234,0.35)", lineHeight: 1.4, transition: "color 200ms" }}>{tab.desc}</div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

/* ================================================================== */
/* 4. WHAT'S INCLUDED — Scannable checklist                            */
/* ================================================================== */
function WhatsIncluded() {
  const { ref, visible } = useInView();
  const m = useMobile();

  const items = [
    { cat: "Diagnosis", features: ["AI-powered plain-English interpretation", "PressureMap\u2122 structural intelligence", "Income composition breakdown", "Biggest source loss impact", "Strongest and weakest structural factors"] },
    { cat: "Risks", features: ["Ranked disruption scenarios with exact drops", "Structural absorbency assessment", "Behavioral pattern to watch", "Band shift warnings"] },
    { cat: "Action", features: ["AI-generated personalized action plan", "Structural tradeoff analysis", "30-day execution roadmap", "Retake timing with triggers"] },
    { cat: "Tools", features: ["RunPayway\u2122 Stability Simulator (lifetime)", "Report delivered to your email", "Cloud-stored record (never lost)", "Deterministic scoring — same answers, same score"] },
  ];

  return (
    <section ref={ref} style={{ backgroundColor: "#FFFFFF", paddingTop: m ? SY.mobile : SY.desktop, paddingBottom: m ? SY.mobile : SY.desktop, paddingLeft: m ? PAD.mobile : PAD.desktop, paddingRight: m ? PAD.mobile : PAD.desktop }}>
      <div style={{ maxWidth: 900, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: m ? 40 : 56, opacity: visible ? 1 : 0, transform: visible ? "translateY(0)" : "translateY(16px)", transition: "opacity 600ms ease-out, transform 600ms ease-out" }}>
          <div style={{ fontSize: 13, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase" as const, color: B.teal, marginBottom: 16 }}>Everything Included</div>
          <h2 style={{ fontSize: m ? 32 : 48, fontFamily: DF, fontWeight: 400, color: B.navy, lineHeight: 1.12, letterSpacing: "-0.025em" }}>
            One report. Nothing withheld.
          </h2>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: m ? "1fr" : "1fr 1fr", gap: m ? 20 : 24 }}>
          {items.map((group, gi) => (
            <div key={group.cat} style={{
              padding: m ? "24px 20px" : "28px 24px", borderRadius: 14,
              backgroundColor: B.bone, border: `1px solid ${B.border}`,
              opacity: visible ? 1 : 0, transform: visible ? "translateY(0)" : "translateY(12px)",
              transition: `opacity 500ms ease-out ${100 + gi * 80}ms, transform 500ms ease-out ${100 + gi * 80}ms`,
            }}>
              <div style={{ fontSize: 13, fontWeight: 700, letterSpacing: "0.08em", color: B.teal, textTransform: "uppercase" as const, marginBottom: 16 }}>{group.cat}</div>
              {group.features.map((f) => (
                <div key={f} style={{ display: "flex", gap: 10, alignItems: "flex-start", marginBottom: 10 }}>
                  <svg width="16" height="16" viewBox="0 0 16 16" style={{ flexShrink: 0, marginTop: 2 }}><circle cx="8" cy="8" r="7" fill="none" stroke={B.teal} strokeWidth="1.5" /><path d="M5 8l2 2 4-4" stroke={B.teal} strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round" /></svg>
                  <span style={{ fontSize: 15, color: B.navy, lineHeight: 1.45 }}>{f}</span>
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
  const [hovered, setHovered] = useState(false);

  return (
    <section ref={ref} style={{ background: B.gradient, position: "relative", overflow: "hidden", paddingTop: m ? SY.mobile : SY.desktop, paddingBottom: m ? SY.mobile : SY.desktop }}>
      <div style={{ position: "absolute", top: "50%", left: "50%", width: 700, height: 700, transform: "translate(-50%, -50%)", background: "radial-gradient(circle, rgba(75,63,174,0.15) 0%, transparent 70%)", pointerEvents: "none" }} />
      <div style={{ maxWidth: MAX, margin: "0 auto", padding: `0 ${m ? PAD.mobile : PAD.desktop}px`, position: "relative", zIndex: 1, textAlign: "center" }}>
        <div style={{ opacity: visible ? 1 : 0, transform: visible ? "translateY(0)" : "translateY(16px)", transition: "opacity 600ms ease-out, transform 600ms ease-out" }}>
          <h2 style={{ fontSize: m ? 32 : 48, color: "#F4F1EA", fontFamily: DF, fontWeight: 400, letterSpacing: "-0.025em", lineHeight: 1.12, marginBottom: 20 }}>
            Ready to see yours?
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
            Free to start &#183; Under 2 minutes &#183; $69 for the full report
          </div>
        </div>
      </div>
    </section>
  );
}

/* ================================================================== */
/* MAIN EXPORT                                                         */
/* ================================================================== */
export default function SampleReportPage() {
  return (
    <div>
      <Hero />
      <ReportPreview />
      <SimulatorPreview />
      <WhatsIncluded />
      <Cta />
    </div>
  );
}
