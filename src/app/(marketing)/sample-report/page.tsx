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
      num: "01", title: "Your Score", color: B.purple,
      screen: (
        <div style={{ padding: m ? "16px 14px" : "20px 18px", textAlign: "center" }}>
          <div style={{ fontSize: 48, fontWeight: 600, color: "#F4F1EA", lineHeight: 1, marginBottom: 4 }}>48</div>
          <div style={{ fontSize: 14, color: "rgba(244,241,234,0.35)", marginBottom: 12 }}>out of 100</div>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "4px 12px", borderRadius: 100, backgroundColor: "rgba(146,100,10,0.15)", marginBottom: 10 }}>
            <div style={{ width: 6, height: 6, borderRadius: "50%", backgroundColor: B.bandDeveloping }} />
            <span style={{ fontSize: 13, fontWeight: 600, color: B.bandDeveloping }}>Developing</span>
          </div>
          <div style={{ fontSize: 13, color: "rgba(244,241,234,0.35)" }}>17 points to Established</div>
          <div style={{ marginTop: 14, padding: "10px 12px", borderRadius: 8, backgroundColor: "rgba(244,241,234,0.04)", border: "1px solid rgba(244,241,234,0.06)", textAlign: "left" }}>
            <div style={{ fontSize: 13, fontWeight: 700, letterSpacing: "0.06em", color: "rgba(244,241,234,0.25)", marginBottom: 4, textTransform: "uppercase" as const }}>In Plain English</div>
            <div style={{ fontSize: 13, color: "rgba(244,241,234,0.50)", lineHeight: 1.5 }}>Your income is developing. A major source loss would put pressure on the structure quickly.</div>
          </div>
        </div>
      ),
      desc: "Your exact score, what it means in plain English, how far you are from the next band, and the single biggest structural factor to fix.",
    },
    {
      num: "02", title: "How Your Income Is Built", color: B.teal,
      screen: (
        <div style={{ padding: m ? "16px 14px" : "20px 18px" }}>
          <div style={{ fontSize: 13, fontWeight: 700, letterSpacing: "0.06em", color: "rgba(244,241,234,0.25)", marginBottom: 8, textTransform: "uppercase" as const }}>Income Structure</div>
          <div style={{ display: "flex", gap: 2, height: 8, borderRadius: 4, overflow: "hidden", marginBottom: 12 }}>
            <div style={{ flex: 72, backgroundColor: B.navy, border: "1px solid rgba(244,241,234,0.15)" }} />
            <div style={{ flex: 18, backgroundColor: "rgba(244,241,234,0.25)" }} />
            <div style={{ flex: 10, backgroundColor: B.teal }} />
          </div>
          {[{ label: "Active work", pct: "72%" }, { label: "Semi-persistent", pct: "18%" }, { label: "Persistent", pct: "10%" }].map(s => (
            <div key={s.label} style={{ display: "flex", justifyContent: "space-between", marginBottom: 4, fontSize: 13, color: "rgba(244,241,234,0.45)" }}>
              <span>{s.label}</span><span style={{ fontWeight: 600, color: "rgba(244,241,234,0.60)" }}>{s.pct}</span>
            </div>
          ))}
          <div style={{ marginTop: 12, display: "flex", gap: 6 }}>
            <div style={{ flex: 1, padding: "8px", borderRadius: 6, backgroundColor: "rgba(244,241,234,0.04)", textAlign: "center" }}>
              <div style={{ fontSize: 18, fontWeight: 600, color: "#F4F1EA" }}>48</div>
              <div style={{ fontSize: 13, color: "rgba(244,241,234,0.25)" }}>Current</div>
            </div>
            <div style={{ flex: 1, padding: "8px", borderRadius: 6, backgroundColor: "rgba(155,44,44,0.10)", textAlign: "center" }}>
              <div style={{ fontSize: 18, fontWeight: 600, color: B.bandLimited }}>19</div>
              <div style={{ fontSize: 13, color: "rgba(244,241,234,0.25)" }}>Stress test</div>
            </div>
          </div>
        </div>
      ),
      desc: "Income composition, stress test drop, continuity window, structural indicators, what\u2019s working, and what\u2019s holding you back.",
    },
    {
      num: "03", title: "What Could Go Wrong", color: B.bandLimited,
      screen: (
        <div style={{ padding: m ? "16px 14px" : "20px 18px" }}>
          {[
            { severity: "SEVERE", title: "Largest client leaves", drop: "\u221229" },
            { severity: "HIGH", title: "Work interruption (90 days)", drop: "\u221218" },
            { severity: "MODERATE", title: "Pipeline slowdown", drop: "\u22128" },
          ].map((s, i) => (
            <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 0", borderBottom: i < 2 ? "1px solid rgba(244,241,234,0.06)" : "none" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <span style={{ fontSize: 13, fontWeight: 700, color: i === 0 ? B.bandLimited : i === 1 ? B.bandDeveloping : "rgba(244,241,234,0.35)", minWidth: 65 }}>{s.severity}</span>
                <span style={{ fontSize: 14, color: "rgba(244,241,234,0.60)" }}>{s.title}</span>
              </div>
              <span style={{ fontSize: 15, fontWeight: 700, color: B.bandLimited }}>{s.drop}</span>
            </div>
          ))}
          <div style={{ marginTop: 12, padding: "8px 12px", borderRadius: 6, backgroundColor: "rgba(244,241,234,0.04)" }}>
            <div style={{ fontSize: 13, fontWeight: 600, color: "rgba(244,241,234,0.40)" }}>Fragility: <span style={{ color: B.bandDeveloping }}>Thin</span></div>
          </div>
        </div>
      ),
      desc: "Ranked scenarios with exact score drops, fragility classification, behavioral patterns to watch, and predictive warnings.",
    },
    {
      num: "04", title: "Your Action Plan", color: B.purple,
      screen: (
        <div style={{ padding: m ? "16px 14px" : "20px 18px" }}>
          <div style={{ fontSize: 13, fontWeight: 700, letterSpacing: "0.06em", color: B.teal, marginBottom: 10, textTransform: "uppercase" as const }}>What your score could be</div>
          {[
            { action: "Add recurring revenue", lift: "+8" },
            { action: "Reduce concentration", lift: "+5" },
            { action: "Extend visibility", lift: "+4" },
          ].map((a, i) => (
            <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "8px 0", borderBottom: i < 2 ? "1px solid rgba(244,241,234,0.06)" : "none" }}>
              <span style={{ fontSize: 14, color: "rgba(244,241,234,0.60)" }}>{a.action}</span>
              <span style={{ fontSize: 16, fontWeight: 700, color: B.teal, fontFamily: DF }}>{a.lift}</span>
            </div>
          ))}
          <div style={{ marginTop: 12, padding: "8px 12px", borderRadius: 6, backgroundColor: "rgba(75,63,174,0.08)", border: "1px solid rgba(75,63,174,0.15)" }}>
            <div style={{ fontSize: 13, color: "rgba(244,241,234,0.50)" }}>Combined: 48 &#8594; 65 (+17 points)</div>
          </div>
        </div>
      ),
      desc: "Projected score impact per action, tradeoff analysis, week-by-week execution roadmap, and what to avoid.",
    },
    {
      num: "05", title: "Methodology + Next Steps", color: B.teal,
      screen: (
        <div style={{ padding: m ? "16px 14px" : "20px 18px" }}>
          <div style={{ padding: "10px 12px", borderRadius: 6, backgroundColor: "rgba(244,241,234,0.04)", marginBottom: 10 }}>
            <div style={{ fontSize: 13, fontWeight: 600, color: "rgba(244,241,234,0.40)" }}>Confidence: <span style={{ color: B.teal }}>High</span></div>
            <div style={{ fontSize: 13, fontWeight: 600, color: "rgba(244,241,234,0.40)", marginTop: 4 }}>Durability: <span style={{ color: B.teal }}>Moderate</span></div>
          </div>
          <div style={{ fontSize: 13, fontWeight: 700, letterSpacing: "0.06em", color: "rgba(244,241,234,0.25)", marginBottom: 8, textTransform: "uppercase" as const }}>Reassess when</div>
          {["Major client change", "Revenue model shift", "3 months post-action"].map((t, i) => (
            <div key={i} style={{ display: "flex", gap: 8, alignItems: "center", marginBottom: 6 }}>
              <div style={{ width: 5, height: 5, borderRadius: "50%", backgroundColor: B.purple, flexShrink: 0 }} />
              <span style={{ fontSize: 13, color: "rgba(244,241,234,0.50)" }}>{t}</span>
            </div>
          ))}
        </div>
      ),
      desc: "How the score was calculated, assessment confidence, income durability grade, reassessment triggers, and verification record.",
    },
  ];

  return (
    <section ref={ref} style={{ backgroundColor: B.bone, paddingTop: m ? SY.mobile : SY.desktop, paddingBottom: m ? SY.mobile : SY.desktop, paddingLeft: m ? PAD.mobile : PAD.desktop, paddingRight: m ? PAD.mobile : PAD.desktop }}>
      <div style={{ maxWidth: MAX, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: m ? 40 : 64, opacity: visible ? 1 : 0, transform: visible ? "translateY(0)" : "translateY(16px)", transition: "opacity 600ms ease-out, transform 600ms ease-out" }}>
          <div style={{ fontSize: 13, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase" as const, color: B.teal, marginBottom: 16 }}>Inside The Report</div>
          <h2 style={{ fontSize: m ? 32 : 48, fontFamily: DF, fontWeight: 400, color: B.navy, lineHeight: 1.12, letterSpacing: "-0.025em", marginBottom: 12 }}>
            Five pages. Every one earns its place.
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
          <div style={{ fontSize: 13, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase" as const, color: B.teal, marginBottom: 16 }}>Score Simulator&#8482;</div>
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
    { cat: "Diagnosis", features: ["Score with plain-English interpretation", "Structural indicators with cross-factor effects", "Income composition breakdown", "Stress test with exact score drop", "Fragility classification"] },
    { cat: "Risks", features: ["Ranked risk scenarios by severity", "Predictive warnings", "Behavioral patterns to watch", "Band shift alerts"] },
    { cat: "Action", features: ["Prioritized actions with projected impact", "Tradeoff analysis for each move", "Week-by-week execution roadmap", "Reassessment triggers"] },
    { cat: "Tools", features: ["Interactive Score Simulator (lifetime)", "Suggested language for your next move", "Structural context for your income model", "Assessment confidence and durability grade"] },
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
