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
const STRIPE = "https://buy.stripe.com/9B66oz48EaYU2lc4IF2Nq05";
const STRIPE_ANNUAL = "https://buy.stripe.com/14A14fbB67MIcZQ3EB2Nq06";

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
            Your free score instantly. The full diagnostic for $69 — or track your progress over 12 months for $149.
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
/* 2. PRICING CARDS — Three tiers                                      */
/* ================================================================== */
function PricingCards() {
  const { ref, visible } = useInView();
  const m = useMobile();
  const [freeHover, setFreeHover] = useState(false);
  const [fullHover, setFullHover] = useState(false);
  const [annualHover, setAnnualHover] = useState(false);

  return (
    <section ref={ref} style={{ backgroundColor: B.bone, paddingTop: m ? SY.mobile : SY.desktop, paddingBottom: m ? SY.mobile : SY.desktop, paddingLeft: m ? PAD.mobile : PAD.desktop, paddingRight: m ? PAD.mobile : PAD.desktop, position: "relative" }}>
      <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 120, background: "linear-gradient(180deg, rgba(14,26,43,0.03) 0%, transparent 100%)", pointerEvents: "none" }} />
      <div style={{ maxWidth: 1060, margin: "0 auto", position: "relative" }}>
        <div style={{ textAlign: "center", marginBottom: m ? 32 : 48, opacity: visible ? 1 : 0, transition: "opacity 600ms ease-out" }}>
          <p style={{ fontSize: m ? 16 : 18, color: B.muted, lineHeight: 1.6 }}>
            Built for freelancers, contractors, and business owners across 19 industries.
            <span style={{ color: B.teal, fontWeight: 600 }}> Under 2 minutes.</span>
          </p>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: m ? "1fr" : "1fr 1fr 1fr", gap: m ? 16 : 20, alignItems: "start" }}>
          {/* FREE */}
          <div
            onMouseEnter={() => canHover() && setFreeHover(true)}
            onMouseLeave={() => setFreeHover(false)}
            style={{
              background: "#FFFFFF", borderRadius: 16, border: `1px solid ${B.border}`,
              padding: m ? "32px 24px" : "36px 28px",
              boxShadow: freeHover ? "0 12px 32px rgba(14,26,43,0.08)" : "0 4px 16px rgba(14,26,43,0.04)",
              transform: freeHover ? "translateY(-4px)" : "translateY(0)",
              transition: "box-shadow 260ms ease, transform 260ms ease",
              opacity: visible ? 1 : 0, ...(visible ? {} : { transform: "translateY(28px)" }),
              transitionDuration: "700ms",
              display: "flex", flexDirection: "column" as const,
            }}
          >
            <div style={{ fontSize: 13, fontWeight: 700, letterSpacing: "0.10em", textTransform: "uppercase" as const, color: B.teal, marginBottom: 20 }}>Income Stability Score&#8482;</div>
            <div style={{ display: "flex", alignItems: "baseline", gap: 8, marginBottom: 4 }}>
              <span style={{ fontSize: 48, fontWeight: 600, color: B.navy, lineHeight: 1 }}>$0</span>
              <span style={{ fontSize: 14, color: B.muted }}>always free</span>
            </div>
            <div style={{ height: 1, background: B.border, margin: "24px 0" }} />
            <div style={{ flex: 1, marginBottom: 28 }}>
              {["Your score out of 100", "Your stability band", "Points to the next band", "Top limiting factor"].map(f => (
                <div key={f} style={{ display: "flex", gap: 10, alignItems: "flex-start", marginBottom: 12 }}>
                  <div style={{ width: 5, height: 5, borderRadius: "50%", backgroundColor: B.teal, flexShrink: 0, marginTop: 7 }} />
                  <span style={{ fontSize: 15, color: B.muted, lineHeight: 1.55 }}>{f}</span>
                </div>
              ))}
            </div>
            <Link className="cta-tick" href="/begin" style={{
              display: "flex", alignItems: "center", justifyContent: "center", height: 52, borderRadius: 10,
              background: freeHover ? B.navy : "#FFFFFF", color: freeHover ? "#FFFFFF" : B.navy,
              fontSize: 16, fontWeight: 600, textDecoration: "none", border: `1px solid ${B.navy}`,
              transition: "background 200ms ease, color 200ms ease",
            }}>
              <span className="tick tick-navy" />
              Get My Free Score
            </Link>
            <p style={{ fontSize: 14, color: B.light, textAlign: "center", marginTop: 12, marginBottom: 0 }}>Takes about 90 seconds</p>
          </div>

          {/* DIAGNOSTIC REPORT — $69 */}
          <div
            onMouseEnter={() => canHover() && setFullHover(true)}
            onMouseLeave={() => setFullHover(false)}
            style={{
              background: "#FFFFFF", borderRadius: 16, position: "relative", overflow: "hidden",
              padding: m ? "32px 24px" : "36px 28px",
              border: `2px solid ${B.purple}`,
              boxShadow: fullHover ? "0 20px 48px rgba(75,63,174,0.18)" : "0 8px 28px rgba(75,63,174,0.12)",
              transform: fullHover ? "translateY(-4px)" : "translateY(0)",
              transition: "box-shadow 260ms ease, transform 260ms ease",
              opacity: visible ? 1 : 0, ...(visible ? {} : { transform: "translateY(28px)" }),
              transitionDuration: "700ms", transitionDelay: "80ms",
              display: "flex", flexDirection: "column" as const,
            }}
          >
            <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 3, background: `linear-gradient(90deg, ${B.purple}, ${B.teal})` }} />

            <div style={{ position: "relative" }}>
              <div style={{ display: "inline-block", padding: "4px 12px", borderRadius: 4, background: "rgba(75,63,174,0.10)", marginBottom: 16 }}>
                <span style={{ fontSize: 13, fontWeight: 700, letterSpacing: "0.10em", textTransform: "uppercase" as const, color: B.purple }}>Most Popular</span>
              </div>
              <div style={{ fontSize: 13, fontWeight: 700, letterSpacing: "0.10em", textTransform: "uppercase" as const, color: B.muted, marginBottom: 16 }}>RunPayway&#8482; Diagnostic Report</div>
              <div style={{ display: "flex", alignItems: "baseline", gap: 8, marginBottom: 4 }}>
                <span style={{ fontSize: 48, fontWeight: 600, color: B.navy, lineHeight: 1 }}>$69</span>
                <span style={{ fontSize: 14, color: B.muted }}>one-time</span>
              </div>
            </div>

            <div style={{ height: 1, background: B.border, margin: "24px 0", position: "relative" }} />

            <div style={{ flex: 1, marginBottom: 24, position: "relative" }}>
              {[
                { text: "Everything in Free, plus:", bold: true },
                { text: "4-page structural diagnostic report" },
                { text: "Risk scenarios ranked by severity" },
                { text: "Action plan with projected score impact" },
                { text: "Tradeoff analysis for each move" },
                { text: "Week-by-week execution roadmap" },
                { text: "Assessment confidence and durability grade" },
                { text: "Lifetime access to RunPayway&#8482; Stability Simulator" },
              ].map((f, i) => (
                <div key={i} style={{ display: "flex", gap: 10, alignItems: "flex-start", marginBottom: 10 }}>
                  <div style={{ width: 5, height: 5, borderRadius: "50%", backgroundColor: (f as { bold?: boolean }).bold ? "transparent" : B.teal, flexShrink: 0, marginTop: 7 }} />
                  <span style={{ fontSize: 15, color: (f as { bold?: boolean }).bold ? B.navy : B.muted, lineHeight: 1.55, fontWeight: (f as { bold?: boolean }).bold ? 600 : 400 }}>{f.text}</span>
                </div>
              ))}
            </div>

            <a className="cta-tick" href={STRIPE} style={{
              display: "flex", alignItems: "center", justifyContent: "center", height: 52, borderRadius: 10,
              background: B.gradient, color: "#FFFFFF",
              fontSize: 16, fontWeight: 600, textDecoration: "none", letterSpacing: "-0.01em",
              boxShadow: fullHover ? "0 12px 32px rgba(75,63,174,0.35)" : "0 8px 24px rgba(75,63,174,0.25)",
              transition: "box-shadow 260ms ease, transform 200ms ease",
              transform: fullHover ? "translateY(-2px)" : "translateY(0)", position: "relative",
            }}>
              <span className="tick tick-white" />
              Get Diagnostic Report — $69
            </a>
            <p style={{ fontSize: 14, color: B.light, textAlign: "center", marginTop: 12, marginBottom: 0, position: "relative" }}>
              If it doesn&#8217;t reveal something new, full refund. No questions.
            </p>
          </div>

          {/* STABILITY MONITORING — $149/year */}
          <div
            onMouseEnter={() => canHover() && setAnnualHover(true)}
            onMouseLeave={() => setAnnualHover(false)}
            style={{
              background: B.navy, borderRadius: 16, position: "relative", overflow: "hidden",
              padding: m ? "32px 24px" : "36px 28px",
              boxShadow: annualHover ? "0 24px 56px rgba(14,26,43,0.30)" : "0 12px 40px rgba(14,26,43,0.20)",
              transform: annualHover ? "translateY(-4px)" : "translateY(0)",
              transition: "box-shadow 260ms ease, transform 260ms ease",
              opacity: visible ? 1 : 0, ...(visible ? {} : { transform: "translateY(28px)" }),
              transitionDuration: "700ms", transitionDelay: "160ms",
              display: "flex", flexDirection: "column" as const,
            }}
          >
            <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 3, background: `linear-gradient(90deg, ${B.teal}, ${B.purple})` }} />
            <div style={{ position: "absolute", top: "-30%", right: "-20%", width: 300, height: 300, borderRadius: "50%", background: "radial-gradient(circle, rgba(26,122,109,0.12) 0%, transparent 70%)", pointerEvents: "none" }} />

            <div style={{ position: "relative" }}>
              <div style={{ display: "inline-block", padding: "4px 12px", borderRadius: 4, background: "rgba(26,122,109,0.15)", marginBottom: 16 }}>
                <span style={{ fontSize: 13, fontWeight: 700, letterSpacing: "0.10em", textTransform: "uppercase" as const, color: B.teal }}>Best Value</span>
              </div>
              <div style={{ fontSize: 13, fontWeight: 700, letterSpacing: "0.10em", textTransform: "uppercase" as const, color: "rgba(244,241,234,0.40)", marginBottom: 16 }}>RunPayway&#8482; Stability Monitoring</div>
              <div style={{ display: "flex", alignItems: "baseline", gap: 8, marginBottom: 4 }}>
                <span style={{ fontSize: 48, fontWeight: 600, color: "#F4F1EA", lineHeight: 1 }}>$149</span>
                <span style={{ fontSize: 14, color: "rgba(244,241,234,0.45)" }}>/year</span>
              </div>
              <div style={{ fontSize: 14, color: "rgba(244,241,234,0.40)", marginTop: 4 }}>
                3 assessments &middot; save $58 vs. buying separately
              </div>
            </div>

            <div style={{ height: 1, background: "rgba(244,241,234,0.08)", margin: "24px 0", position: "relative" }} />

            <div style={{ flex: 1, marginBottom: 24, position: "relative" }}>
              {[
                { text: "Everything in the Diagnostic Report, plus:", bold: true },
                { text: "3 full assessments within 12 months" },
                { text: "Take each assessment on your own schedule" },
                { text: "Full 4-page report generated every time" },
                { text: "Monitoring Portal with email sign-in" },
                { text: "Save $58 vs. buying three reports separately" },
              ].map((f, i) => (
                <div key={i} style={{ display: "flex", gap: 10, alignItems: "flex-start", marginBottom: 10 }}>
                  <div style={{ width: 5, height: 5, borderRadius: "50%", backgroundColor: (f as { bold?: boolean }).bold ? "transparent" : B.teal, flexShrink: 0, marginTop: 7 }} />
                  <span style={{ fontSize: 15, color: (f as { bold?: boolean }).bold ? "#F4F1EA" : "rgba(244,241,234,0.55)", lineHeight: 1.55, fontWeight: (f as { bold?: boolean }).bold ? 600 : 400 }}>{f.text}</span>
                </div>
              ))}
            </div>

            <a className="cta-tick" href={STRIPE_ANNUAL} style={{
              display: "flex", alignItems: "center", justifyContent: "center", height: 52, borderRadius: 10,
              background: "linear-gradient(135deg, #F4F1EA 0%, #E8E5DD 100%)", color: B.navy,
              fontSize: 16, fontWeight: 600, textDecoration: "none", letterSpacing: "-0.01em",
              boxShadow: annualHover ? "0 12px 32px rgba(0,0,0,0.30)" : "0 8px 24px rgba(0,0,0,0.20)",
              transition: "box-shadow 260ms ease, transform 200ms ease",
              transform: annualHover ? "translateY(-2px)" : "translateY(0)", position: "relative",
            }}>
              <span className="tick tick-navy" />
              Start Stability Monitoring — $149
            </a>
            <p style={{ fontSize: 14, color: "rgba(244,241,234,0.35)", textAlign: "center", marginTop: 12, marginBottom: 0, position: "relative" }}>
              Includes login access to your Monitoring Portal.
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
    { num: "01", title: "Your Score & Structural Diagnosis", desc: "Score, plain-English interpretation, biggest constraint, distance to next band, PressureMap intelligence.", color: B.purple },
    { num: "02", title: "PressureMap & Income Structure", desc: "What pressures your structure, income breakdown, strongest and weakest factors, what\u2019s working and holding you back.", color: B.teal },
    { num: "03", title: "Fragility & Pressure Test", desc: "Ranked disruption scenarios with exact score drops, absorbency summary, pattern to watch.", color: B.purple },
    { num: "04", title: "Your Highest-Leverage Action Plan", desc: "Best changes ranked by impact, tradeoffs, 30-day roadmap, retake timing.", color: B.teal },
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
    { q: "What does the RunPayway\u2122 Diagnostic Report include?", a: "A 4-page structural diagnostic with PressureMap intelligence, ranked risk scenarios, projected actions, tradeoff analysis, a 30-day roadmap, and lifetime access to the RunPayway\u2122 Stability Simulator." },
    { q: "What does RunPayway\u2122 Stability Monitoring include?", a: "Three full assessments within 12 months. Each generates a complete 4-page diagnostic report. You sign in with your email anytime to take your next assessment or review your history. It\u2019s $149/year \u2014 saving $58 compared to purchasing three reports individually." },
    { q: "How is the score calculated?", a: "The scoring model evaluates fixed structural dimensions \u2014 recurrence, concentration, forward visibility, variability, labor dependence, and income quality \u2014 using deterministic rules under Model RP-2.0. Same inputs always produce the same score." },
    { q: "What is your refund policy?", a: "Full refund within 30 days \u2014 no questions asked. If the report doesn\u2019t reveal at least one insight you didn\u2019t already know, you get your money back." },
    { q: "Is my information confidential?", a: "Yes. We never collect bank credentials, credit data, or financial account access. Your data is encrypted, never sold, and you can request deletion at any time." },
    { q: "How long does it take?", a: "Under two minutes. Your free score is delivered instantly. The full report generates immediately after purchase." },
    { q: "Can I retake the assessment?", a: "Yes. Each assessment is independent. With the RunPayway\u2122 Diagnostic Report, you purchase one at a time. With RunPayway\u2122 Stability Monitoring ($149/year), you get three assessments over 12 months \u2014 take them whenever you want." },
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
          <Link className="cta-tick" href="/begin" onMouseEnter={() => canHover() && setHovered(true)} onMouseLeave={() => setHovered(false)} style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", height: m ? 48 : 56, paddingLeft: 36, paddingRight: 36, borderRadius: 10, backgroundColor: "#F4F1EA", color: B.navy, fontSize: 16, fontWeight: 600, textDecoration: "none", boxShadow: hovered ? "0 8px 28px rgba(0,0,0,0.25)" : "0 4px 16px rgba(0,0,0,0.15)", transform: hovered ? "translateY(-2px)" : "translateY(0)", transition: "box-shadow 260ms ease, transform 260ms ease" }}>
            <span className="tick tick-navy" />
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
