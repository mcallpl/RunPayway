"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";

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
};

const SY = { desktop: 120, mobile: 72 };
const PAD = { desktop: 56, mobile: 24 };
const MAX = 1100;
const DF = "'DM Serif Display', Georgia, serif";
const STRIPE = "https://buy.stripe.com/7sY8wHeNid726Bs8YV2Nq04";

/* ================================================================== */
/* 1. HERO                                                              */
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
          <div style={{ fontSize: 13, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase" as const, color: B.teal, marginBottom: 28 }}>Pricing</div>
          <h1 style={{ fontSize: m ? 36 : 56, fontFamily: DF, fontWeight: 400, color: "#F4F1EA", lineHeight: 1.08, letterSpacing: "-0.03em", marginBottom: 24, maxWidth: 680, margin: "0 auto 24px" }}>
            Know your number.<br />Then change it.
          </h1>
          <p style={{ fontSize: m ? 16 : 20, color: "rgba(244,241,234,0.50)", lineHeight: 1.6, maxWidth: 480, margin: "0 auto 28px" }}>
            Your free score instantly. The full diagnostic for $99 — with an interactive simulator you keep forever.
          </p>
          <div style={{ display: "flex", justifyContent: "center", gap: 20, flexWrap: "wrap" as const }}>
            {["No bank connection", "Full refund guarantee", "Instant results"].map(t => (
              <span key={t} style={{ fontSize: 13, fontWeight: 500, color: "rgba(244,241,234,0.30)" }}>{t}</span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ================================================================== */
/* 2. PRICING CARDS — Side by side                                     */
/* ================================================================== */
function PricingCards() {
  const { ref, visible } = useInView();
  const m = useMobile();
  const [freeHover, setFreeHover] = useState(false);
  const [fullHover, setFullHover] = useState(false);

  return (
    <section ref={ref} style={{ backgroundColor: B.bone, paddingTop: m ? SY.mobile : SY.desktop, paddingBottom: m ? SY.mobile : SY.desktop, paddingLeft: m ? PAD.mobile : PAD.desktop, paddingRight: m ? PAD.mobile : PAD.desktop, position: "relative" }}>
      <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 120, background: "linear-gradient(180deg, rgba(14,26,43,0.03) 0%, transparent 100%)", pointerEvents: "none" }} />
      <div style={{ maxWidth: 860, margin: "0 auto", position: "relative" }}>
        <div style={{ textAlign: "center", marginBottom: m ? 32 : 48, opacity: visible ? 1 : 0, transition: "opacity 600ms ease-out" }}>
          <p style={{ fontSize: m ? 16 : 18, color: B.muted, lineHeight: 1.6 }}>
            Built for freelancers, contractors, and business owners across 19 industries.
            <span style={{ color: B.teal, fontWeight: 600 }}> Under 2 minutes.</span>
          </p>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: m ? "1fr" : "5fr 7fr", gap: m ? 16 : 24, alignItems: "start" }}>
          {/* FREE */}
          <div
            onMouseEnter={() => canHover() && setFreeHover(true)}
            onMouseLeave={() => setFreeHover(false)}
            style={{
              background: "#FFFFFF", borderRadius: 16, border: `1px solid ${B.border}`,
              padding: m ? "32px 24px" : "40px 36px",
              boxShadow: freeHover ? "0 12px 32px rgba(14,26,43,0.08)" : "0 4px 16px rgba(14,26,43,0.04)",
              transform: freeHover ? "translateY(-4px)" : "translateY(0)",
              transition: "box-shadow 260ms ease, transform 260ms ease",
              opacity: visible ? 1 : 0, ...(visible ? {} : { transform: "translateY(28px)" }),
              transitionDuration: "700ms",
              display: "flex", flexDirection: "column" as const,
            }}
          >
            <div style={{ fontSize: 13, fontWeight: 700, letterSpacing: "0.10em", textTransform: "uppercase" as const, color: B.teal, marginBottom: 20 }}>Free Score</div>
            <div style={{ display: "flex", alignItems: "baseline", gap: 8, marginBottom: 4 }}>
              <span style={{ fontSize: 52, fontWeight: 600, color: B.navy, lineHeight: 1 }}>$0</span>
              <span style={{ fontSize: 14, color: B.muted }}>always free</span>
            </div>
            <div style={{ height: 1, background: B.border, margin: "24px 0" }} />
            <div style={{ flex: 1, marginBottom: 28 }}>
              {["Your score out of 100", "Your stability band", "What your structure can absorb", "The single biggest factor to fix"].map(f => (
                <div key={f} style={{ display: "flex", gap: 10, alignItems: "flex-start", marginBottom: 12 }}>
                  <div style={{ width: 5, height: 5, borderRadius: "50%", backgroundColor: B.teal, flexShrink: 0, marginTop: 7 }} />
                  <span style={{ fontSize: 15, color: B.muted, lineHeight: 1.55 }}>{f}</span>
                </div>
              ))}
            </div>
            <Link href="/begin" style={{
              display: "flex", alignItems: "center", justifyContent: "center", height: 52, borderRadius: 10,
              background: freeHover ? B.navy : "#FFFFFF", color: freeHover ? "#FFFFFF" : B.navy,
              fontSize: 16, fontWeight: 600, textDecoration: "none", border: `1px solid ${B.navy}`,
              transition: "background 200ms ease, color 200ms ease",
            }}>
              Get My Free Score
            </Link>
            <p style={{ fontSize: 14, color: B.light, textAlign: "center", marginTop: 12, marginBottom: 0 }}>Takes about 90 seconds</p>
          </div>

          {/* FULL REPORT */}
          <div
            onMouseEnter={() => canHover() && setFullHover(true)}
            onMouseLeave={() => setFullHover(false)}
            style={{
              background: B.navy, borderRadius: 16, position: "relative", overflow: "hidden",
              padding: m ? "36px 24px" : "48px 40px",
              boxShadow: fullHover ? "0 24px 56px rgba(14,26,43,0.30)" : "0 12px 40px rgba(14,26,43,0.20)",
              transform: fullHover ? "translateY(-4px)" : "translateY(0)",
              transition: "box-shadow 260ms ease, transform 260ms ease",
              opacity: visible ? 1 : 0, ...(visible ? {} : { transform: "translateY(28px)" }),
              transitionDuration: "700ms", transitionDelay: "120ms",
              display: "flex", flexDirection: "column" as const,
            }}
          >
            <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 3, background: `linear-gradient(90deg, ${B.purple}, ${B.teal})` }} />
            <div style={{ position: "absolute", top: "-30%", right: "-20%", width: 300, height: 300, borderRadius: "50%", background: "radial-gradient(circle, rgba(75,63,174,0.15) 0%, transparent 70%)", pointerEvents: "none" }} />

            <div style={{ position: "relative" }}>
              <div style={{ display: "inline-block", padding: "4px 12px", borderRadius: 4, background: "rgba(75,63,174,0.20)", marginBottom: 16 }}>
                <span style={{ fontSize: 13, fontWeight: 700, letterSpacing: "0.10em", textTransform: "uppercase" as const, color: B.teal }}>Most Popular</span>
              </div>
              <div style={{ fontSize: 13, fontWeight: 700, letterSpacing: "0.10em", textTransform: "uppercase" as const, color: "rgba(244,241,234,0.40)", marginBottom: 16 }}>Complete Assessment</div>
              <div style={{ display: "flex", alignItems: "baseline", gap: 8, marginBottom: 4 }}>
                <span style={{ fontSize: 56, fontWeight: 600, color: "#F4F1EA", lineHeight: 1 }}>$99</span>
                <span style={{ fontSize: 14, color: "rgba(244,241,234,0.45)" }}>one-time</span>
              </div>
            </div>

            <div style={{ height: 1, background: "rgba(244,241,234,0.08)", margin: "24px 0", position: "relative" }} />

            <div style={{ flex: 1, marginBottom: 24, position: "relative" }}>
              {[
                { text: "Everything in Free, plus:", bold: true },
                { text: "5-page structural diagnostic report" },
                { text: "Risk scenarios ranked by severity with exact score drops" },
                { text: "Action plan with projected score impact" },
                { text: "Tradeoff analysis for each recommended move" },
                { text: "Structural indicators with cross-factor effects" },
                { text: "Predictive warnings and behavioral insights" },
                { text: "Week-by-week execution roadmap" },
                { text: "Assessment confidence and income durability grade" },
              ].map((f, i) => (
                <div key={i} style={{ display: "flex", gap: 10, alignItems: "flex-start", marginBottom: 10 }}>
                  <div style={{ width: 5, height: 5, borderRadius: "50%", backgroundColor: (f as { bold?: boolean }).bold ? "transparent" : B.teal, flexShrink: 0, marginTop: 7 }} />
                  <span style={{ fontSize: 15, color: (f as { bold?: boolean }).bold ? "#F4F1EA" : "rgba(244,241,234,0.55)", lineHeight: 1.55, fontWeight: (f as { bold?: boolean }).bold ? 600 : 400 }}>{f.text}</span>
                </div>
              ))}
            </div>

            {/* Lifetime simulator callout */}
            <div style={{ display: "flex", gap: 10, alignItems: "center", marginBottom: 24, padding: "14px 18px", background: "rgba(26,122,109,0.08)", border: "1px solid rgba(26,122,109,0.25)", borderRadius: 10, position: "relative" }}>
              <div style={{ width: 8, height: 8, borderRadius: "50%", backgroundColor: B.teal, flexShrink: 0 }} />
              <span style={{ fontSize: 15, fontWeight: 700, color: "#F4F1EA", lineHeight: 1.4 }}>Lifetime access to your personal Score Simulator</span>
            </div>

            <a href={STRIPE} style={{
              display: "flex", alignItems: "center", justifyContent: "center", height: 52, borderRadius: 10,
              background: "linear-gradient(135deg, #F4F1EA 0%, #E8E5DD 100%)", color: B.navy,
              fontSize: 16, fontWeight: 600, textDecoration: "none", letterSpacing: "-0.01em",
              boxShadow: fullHover ? "0 12px 32px rgba(0,0,0,0.30)" : "0 8px 24px rgba(0,0,0,0.20)",
              transition: "box-shadow 260ms ease, transform 200ms ease",
              transform: fullHover ? "translateY(-2px)" : "translateY(0)", position: "relative",
            }}>
              Get Full Report — $99
            </a>
            <p style={{ fontSize: 14, color: "rgba(244,241,234,0.35)", textAlign: "center", marginTop: 12, marginBottom: 0, position: "relative" }}>
              If it doesn&#8217;t reveal something new, full refund. No questions.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ================================================================== */
/* 3. WHAT THE REPORT COVERS — Accent-bordered list                    */
/* ================================================================== */
function ReportCovers() {
  const { ref, visible } = useInView();
  const m = useMobile();

  const pages = [
    { num: "01", title: "Your Score", desc: "What it means in plain English, how far you are from the next band, and the single biggest structural factor to fix.", color: B.purple },
    { num: "02", title: "How Your Income Is Built", desc: "Income composition, stress test, structural indicators, what\u2019s working, and what\u2019s holding you back.", color: B.teal },
    { num: "03", title: "What Could Go Wrong", desc: "Ranked scenarios with exact score drops, fragility classification, behavioral patterns to watch.", color: B.purple },
    { num: "04", title: "Your Action Plan", desc: "Projected score impact per action, tradeoff analysis, week-by-week execution roadmap.", color: B.teal },
    { num: "05", title: "Methodology + Next Steps", desc: "Assessment confidence, income durability, reassessment triggers, and your verification record.", color: B.purple },
  ];

  return (
    <section ref={ref} style={{ backgroundColor: B.sand, paddingTop: m ? SY.mobile : SY.desktop, paddingBottom: m ? SY.mobile : SY.desktop, paddingLeft: m ? PAD.mobile : PAD.desktop, paddingRight: m ? PAD.mobile : PAD.desktop }}>
      <div style={{ maxWidth: 640, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: m ? 36 : 48, opacity: visible ? 1 : 0, transform: visible ? "translateY(0)" : "translateY(12px)", transition: "opacity 500ms ease-out, transform 500ms ease-out" }}>
          <div style={{ fontSize: 13, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase" as const, color: B.teal, marginBottom: 16 }}>The Report</div>
          <h2 style={{ fontSize: m ? 32 : 48, fontFamily: DF, fontWeight: 400, color: B.navy, lineHeight: 1.12, letterSpacing: "-0.025em", marginBottom: 12 }}>
            Five pages. Nothing withheld.
          </h2>
        </div>

        {pages.map((p, i) => (
          <div key={p.num} style={{
            display: "flex", gap: 16, alignItems: "flex-start", padding: "20px 0",
            borderBottom: i < 4 ? `1px solid ${B.borderMd}` : "none",
            opacity: visible ? 1 : 0, transform: visible ? "translateY(0)" : "translateY(10px)",
            transition: `opacity 500ms ease-out ${80 + i * 60}ms, transform 500ms ease-out ${80 + i * 60}ms`,
          }}>
            <div style={{ width: 36, height: 36, borderRadius: 10, flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center", backgroundColor: "#FFFFFF", border: `1px solid ${B.borderMd}`, fontSize: 13, fontWeight: 700, color: p.color, position: "relative", overflow: "hidden" }}>
              <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 2, backgroundColor: p.color, opacity: 0.6 }} />
              {p.num}
            </div>
            <div>
              <div style={{ fontSize: m ? 16 : 18, fontWeight: 600, color: B.navy, marginBottom: 4 }}>{p.title}</div>
              <p style={{ fontSize: m ? 14 : 15, color: B.muted, lineHeight: 1.55, margin: 0 }}>{p.desc}</p>
            </div>
          </div>
        ))}

        <div style={{ textAlign: "center", marginTop: 32, opacity: visible ? 1 : 0, transition: "opacity 500ms ease-out 400ms" }}>
          <Link href="/sample-report" style={{ fontSize: 16, fontWeight: 600, color: B.purple, textDecoration: "none" }}>
            View sample report &rarr;
          </Link>
        </div>
      </div>
    </section>
  );
}

/* ================================================================== */
/* 4. TRUST — Badges + guarantee                                       */
/* ================================================================== */
function Trust() {
  const { ref, visible } = useInView();
  const m = useMobile();

  return (
    <section ref={ref} style={{ backgroundColor: B.navy, paddingTop: m ? SY.mobile : SY.desktop, paddingBottom: m ? SY.mobile : SY.desktop, paddingLeft: m ? PAD.mobile : PAD.desktop, paddingRight: m ? PAD.mobile : PAD.desktop }}>
      <div style={{ maxWidth: 800, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: m ? 40 : 56, opacity: visible ? 1 : 0, transform: visible ? "translateY(0)" : "translateY(16px)", transition: "opacity 600ms ease-out, transform 600ms ease-out" }}>
          <h2 style={{ fontSize: m ? 28 : 40, fontFamily: DF, fontWeight: 400, color: "#F4F1EA", lineHeight: 1.12, letterSpacing: "-0.025em", marginBottom: 12 }}>
            Built on trust. Not on hype.
          </h2>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: m ? "1fr 1fr" : "repeat(4, 1fr)", gap: m ? 12 : 16 }}>
          {[
            { title: "No bank connection", desc: "We never access financial accounts." },
            { title: "No credit pull", desc: "No impact on your credit." },
            { title: "Private by default", desc: "Your data is encrypted, never sold." },
            { title: "Full refund", desc: "30 days, no questions asked." },
          ].map((b, i) => (
            <div key={b.title} style={{
              padding: m ? "20px 16px" : "24px 20px", borderRadius: 14, textAlign: "center",
              backgroundColor: "rgba(244,241,234,0.04)", border: "1px solid rgba(244,241,234,0.08)",
              opacity: visible ? 1 : 0, transform: visible ? "translateY(0)" : "translateY(10px)",
              transition: `opacity 500ms ease-out ${100 + i * 80}ms, transform 500ms ease-out ${100 + i * 80}ms`,
            }}>
              <div style={{ fontSize: 15, fontWeight: 600, color: "#F4F1EA", marginBottom: 6 }}>{b.title}</div>
              <div style={{ fontSize: 14, color: "rgba(244,241,234,0.45)", lineHeight: 1.45 }}>{b.desc}</div>
            </div>
          ))}
        </div>

        <div style={{ textAlign: "center", marginTop: 32, opacity: visible ? 1 : 0, transition: "opacity 600ms ease-out 400ms" }}>
          <div style={{ display: "inline-block", padding: "14px 28px", borderRadius: 12, border: "1px solid rgba(244,241,234,0.10)" }}>
            <p style={{ fontSize: 15, color: "rgba(244,241,234,0.60)", margin: 0, fontWeight: 500 }}>
              Deterministic &#183; Fixed rules &#183; Versioned &#183; Model RP-2.0
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ================================================================== */
/* 5. FAQ                                                              */
/* ================================================================== */
function Faq() {
  const { ref, visible } = useInView();
  const m = useMobile();
  const [openIdx, setOpenIdx] = useState<number | null>(null);

  const faqs = [
    { q: "What do I get for free?", a: "Your score out of 100, your stability band, a consequence sentence showing what your structure can absorb, and the single biggest structural factor limiting your score. No payment required." },
    { q: "What does the $99 report include?", a: "A 5-page structural diagnostic with risk scenarios, projected actions, tradeoff analysis, structural indicators with cross-factor effects, a week-by-week execution roadmap, assessment confidence, income durability grade, and lifetime access to the Score Simulator." },
    { q: "How is the score calculated?", a: "The scoring model evaluates fixed structural dimensions \u2014 recurrence, concentration, forward visibility, variability, labor dependence, and income quality \u2014 using deterministic rules under Model RP-2.0. Same inputs always produce the same score." },
    { q: "What is your refund policy?", a: "Full refund within 30 days \u2014 no questions asked. If the report doesn\u2019t reveal at least one insight you didn\u2019t already know, you get your money back." },
    { q: "Is my information confidential?", a: "Yes. We never collect bank credentials, credit data, or financial account access. Your data is encrypted, never sold, and you can request deletion at any time." },
    { q: "How long does it take?", a: "Under two minutes. Your free score is delivered instantly. The full report generates immediately after purchase." },
    { q: "Can I retake the assessment?", a: "Yes. Each assessment is independent. Retake after a meaningful structural change to see how your score has moved." },
  ];

  return (
    <section ref={ref} style={{ backgroundColor: B.bone, paddingTop: m ? SY.mobile : SY.desktop, paddingBottom: m ? SY.mobile : SY.desktop, paddingLeft: m ? PAD.mobile : PAD.desktop, paddingRight: m ? PAD.mobile : PAD.desktop }}>
      <div style={{ maxWidth: 700, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: m ? 40 : 56, opacity: visible ? 1 : 0, transform: visible ? "translateY(0)" : "translateY(16px)", transition: "opacity 600ms ease-out, transform 600ms ease-out" }}>
          <h2 style={{ fontSize: m ? 32 : 48, fontFamily: DF, fontWeight: 400, color: B.navy, lineHeight: 1.12, letterSpacing: "-0.025em" }}>
            Frequently asked questions
          </h2>
        </div>

        {faqs.map((faq, i) => {
          const isOpen = openIdx === i;
          return (
            <div key={i} style={{ borderBottom: `1px solid ${B.borderMd}`, opacity: visible ? 1 : 0, transform: visible ? "translateY(0)" : "translateY(8px)", transition: `opacity 500ms ease-out ${60 + i * 40}ms, transform 500ms ease-out ${60 + i * 40}ms` }}>
              <button onClick={() => setOpenIdx(isOpen ? null : i)} style={{ width: "100%", display: "flex", justifyContent: "space-between", alignItems: "center", padding: m ? "18px 0" : "22px 0", border: "none", backgroundColor: "transparent", cursor: "pointer", textAlign: "left", gap: 16 }}>
                <span style={{ fontSize: m ? 16 : 18, fontWeight: 600, color: B.navy }}>{faq.q}</span>
                <span style={{ fontSize: 18, color: B.light, flexShrink: 0, transform: isOpen ? "rotate(180deg)" : "rotate(0deg)", transition: "transform 200ms ease" }}>&#9662;</span>
              </button>
              {isOpen && (
                <div style={{ paddingBottom: 20 }}>
                  <p style={{ fontSize: m ? 15 : 16, color: B.muted, lineHeight: 1.65, margin: 0 }}>{faq.a}</p>
                </div>
              )}
            </div>
          );
        })}
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
          <h2 style={{ fontSize: m ? 32 : 48, color: "#F4F1EA", fontFamily: DF, fontWeight: 400, letterSpacing: "-0.025em", lineHeight: 1.12, marginBottom: 20 }}>
            See where your income stands.
          </h2>
          <p style={{ fontSize: m ? 16 : 18, color: "rgba(250,249,247,0.55)", lineHeight: 1.65, maxWidth: 440, margin: "0 auto 40px" }}>
            Your free score shows where you stand. The full report shows what to do about it.
          </p>
          <Link href="/begin" onMouseEnter={() => canHover() && setHovered(true)} onMouseLeave={() => setHovered(false)} style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", height: m ? 48 : 56, paddingLeft: 36, paddingRight: 36, borderRadius: 10, backgroundColor: "#F4F1EA", color: B.navy, fontSize: 16, fontWeight: 600, textDecoration: "none", boxShadow: hovered ? "0 8px 28px rgba(0,0,0,0.25)" : "0 4px 16px rgba(0,0,0,0.15)", transform: hovered ? "translateY(-2px)" : "translateY(0)", transition: "box-shadow 260ms ease, transform 260ms ease" }}>
            Get My Free Score
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
/* EXPORT                                                              */
/* ================================================================== */
export default function PricingPage() {
  return (
    <div>
      <Hero />
      <PricingCards />
      <ReportCovers />
      <Trust />
      <Faq />
      <Cta />
    </div>
  );
}
