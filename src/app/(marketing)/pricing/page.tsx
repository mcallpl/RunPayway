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
/*  Constants                                                          */
/* ------------------------------------------------------------------ */
const STRIPE = "https://buy.stripe.com/9B66oz48EaYU2lc4IF2Nq05";
const STRIPE_ANNUAL = "https://buy.stripe.com/14A14fbB67MIcZQ3EB2Nq06";
const gradient = C.navy;

/* ------------------------------------------------------------------ */
/*  Helpers                                                            */
/* ------------------------------------------------------------------ */
const fadeIn = (v: boolean, delay = 0) => ({
  opacity: v ? 1 : 0,
  transform: v ? "translateY(0)" : "translateY(16px)",
  transition: `opacity 600ms ease-out ${delay}ms, transform 600ms ease-out ${delay}ms`,
});

/* ================================================================== */
/* 1. HERO                                                              */
/* ================================================================== */
function Hero() {
  const { ref, visible } = useInView();
  const m = useMobile();
  return (
    <section ref={ref} style={{ background: gradient, position: "relative", overflow: "hidden", paddingTop: m ? 120 : 180, paddingBottom: m ? 80 : 120 }}>
      <div style={{ maxWidth: maxW, margin: "0 auto", padding: `0 ${px(m)}px`, position: "relative", zIndex: 1, textAlign: "center" }}>
        <div style={{ opacity: visible ? 1 : 0, transform: visible ? "translateY(0)" : "translateY(24px)", transition: "opacity 800ms ease-out, transform 800ms ease-out" }}>
          <div style={{ ...T.label, color: C.teal, marginBottom: 28 }}>Pricing</div>
          <h1 style={{ ...h1(m), color: C.sandText, marginBottom: 24, maxWidth: 680, margin: "0 auto 24px" }}>
            Know your number.<br />Then change it.
          </h1>
          <p style={{ fontSize: m ? 16 : 20, color: C.sandMuted, lineHeight: 1.6, maxWidth: 480, margin: "0 auto 28px" }}>
            Your free score instantly. The full diagnostic for <span style={{ fontFamily: mono }}>$69</span> — or track your progress over 12 months for <span style={{ fontFamily: mono }}>$149</span>.
          </p>
          <div style={{ display: "flex", justifyContent: "center", gap: 20, flexWrap: "wrap" as const }}>
            {["No bank connection", "Full refund guarantee", "Instant results"].map(t => (
              <span key={t} style={{ ...T.micro, fontWeight: 500, color: C.sandLight }}>{t}</span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ================================================================== */
/* PRESSURE NARRATIVE — urgency before pricing                         */
/* ================================================================== */
function PressureNarrative() {
  const { ref, visible } = useInView();
  const m = useMobile();

  const scenarios = [
    {
      label: "Concentration",
      title: "Your biggest client leaves.",
      desc: "The Score isolates how much of your stability depends on a single source. If one departure drops your score by 30 points, that concentration is the structural risk \u2014 not the client relationship.",
      stat: "\u221230 pts",
      statLabel: "potential impact",
      accent: "#C53030",
    },
    {
      label: "Continuity",
      title: "You can\u2019t work for 90 days.",
      desc: "Continuity measures what happens to your income when labor stops. The Score reveals whether your structure survives a gap \u2014 or collapses with it.",
      stat: "27 days",
      statLabel: "median cash buffer",
      accent: "#B7791F",
    },
    {
      label: "Visibility",
      title: "A contract doesn\u2019t renew.",
      desc: "Visibility tracks how far ahead your income is committed. When a contract ends without a replacement, the Score shows how much of your forward certainty disappears with it.",
      stat: "0 days",
      statLabel: "advance warning",
      accent: C.teal,
    },
  ];

  return (
    <section ref={ref} aria-label="Pressure narrative" style={{
      background: C.navy,
      paddingTop: m ? sp(8) : sp(10),
      paddingBottom: m ? sp(8) : sp(10),
      paddingLeft: px(m), paddingRight: px(m),
      position: "relative",
      overflow: "hidden",
    }}>
      <div style={{
        position: "absolute", top: "-30%", right: "-10%",
        width: 600, height: 600, borderRadius: "50%",
        background: "none",
        pointerEvents: "none",
      }} />

      <div style={{ maxWidth: 900, margin: "0 auto", position: "relative", zIndex: 1 }}>
        <div style={{ textAlign: "center", marginBottom: m ? sp(6) : sp(7), ...fadeIn(visible) }}>
          <div style={{ ...T.meta, fontWeight: 500, color: C.teal, marginBottom: 20 }}>
            The Pressure You Already Feel
          </div>
          <h2 style={{
            ...h2Style(m), color: C.sandText,
            maxWidth: 640, margin: "0 auto",
            marginBottom: sp(3),
          }}>
            You already know something is fragile. The Score tells you exactly where.
          </h2>
          <p style={{ ...body(m), color: C.sandMuted, maxWidth: 500, margin: "0 auto" }}>
            These aren&rsquo;t hypotheticals. They&rsquo;re the three structural failures that collapse independent income.
          </p>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: m ? sp(4) : sp(5) }}>
          {scenarios.map((s, i) => (
            <div key={s.label} style={{
              display: m ? "block" : "flex",
              alignItems: "stretch",
              gap: 0,
              borderRadius: 18,
              overflow: "hidden",
              backgroundColor: "rgba(255,255,255,0.03)",
              border: "1px solid rgba(255,255,255,0.06)",
              flexDirection: i % 2 === 1 ? "row-reverse" : "row",
              ...fadeIn(visible, 200 + i * 150),
            }}>
              <div style={{
                flex: m ? "none" : "0 0 180px",
                display: "flex", flexDirection: m ? "row" : "column",
                alignItems: "center", justifyContent: "center",
                gap: m ? 12 : 0,
                padding: m ? "20px 24px" : 32,
                backgroundColor: `${s.accent}10`,
                borderBottom: m ? "1px solid rgba(255,255,255,0.04)" : "none",
                borderRight: !m && i % 2 === 0 ? "1px solid rgba(255,255,255,0.04)" : "none",
                borderLeft: !m && i % 2 === 1 ? "1px solid rgba(255,255,255,0.04)" : "none",
              }}>
                <span style={{
                  fontFamily: mono, fontSize: m ? 28 : 40, color: s.accent,
                  lineHeight: 1, letterSpacing: "-0.02em",
                }}>{s.stat}</span>
                <span style={{ fontSize: 11, fontWeight: 600, letterSpacing: "0.06em", color: C.sandLight, marginTop: m ? 0 : 8, textTransform: "uppercase" as const, textAlign: "center" }}>
                  {s.statLabel}
                </span>
              </div>

              <div style={{ flex: 1, padding: m ? sp(3) : `${sp(4)}px ${sp(5)}px` }}>
                <div style={{ ...T.meta, fontWeight: 500, color: s.accent, marginBottom: 12 }}>{s.label}</div>
                <h3 style={{ ...h3Style(m), color: C.sandText, marginBottom: sp(2) }}>
                  {s.title}
                </h3>
                <p style={{ ...body(m), color: C.sandMuted, margin: 0 }}>
                  {s.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ================================================================== */
/* 2. PRICING CARDS                                                     */
/* ================================================================== */
function PricingCards() {
  const { ref, visible } = useInView();
  const m = useMobile();
  const [freeHover, setFreeHover] = useState(false);
  const [fullHover, setFullHover] = useState(false);
  const [annualHover, setAnnualHover] = useState(false);

  return (
    <section ref={ref} style={{ backgroundColor: C.sand, paddingTop: secPad(m), paddingBottom: secPad(m), paddingLeft: px(m), paddingRight: px(m), position: "relative" }}>
      <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 120, background: "linear-gradient(180deg, rgba(14,26,43,0.03) 0%, transparent 100%)", pointerEvents: "none" }} />
      <div style={{ maxWidth: maxW, margin: "0 auto", position: "relative" }}>
        <div style={{ textAlign: "center", marginBottom: m ? sp(4) : sp(6), opacity: visible ? 1 : 0, transition: "opacity 600ms ease-out" }}>
          <p style={{ ...body(m), color: C.muted }}>
            Your free score shows the problem. The report shows exactly what to fix — interpreted using your industry, structure, and income model.
            <span style={{ color: C.teal, fontWeight: 600 }}> Under 2 minutes.</span>
          </p>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: m ? "1fr" : "1fr 1fr 1fr", gap: m ? 16 : 20, alignItems: "start" }}>
          {/* FREE */}
          <div
            onMouseEnter={() => canHover() && setFreeHover(true)}
            onMouseLeave={() => setFreeHover(false)}
            style={{
              ...cardStyle,
              borderRadius: 16,
              padding: m ? `${sp(4)}px ${sp(3)}px` : `${sp(4.5)}px ${sp(3.5)}px`,
              boxShadow: freeHover ? "0 12px 32px rgba(14,26,43,0.08)" : cardStyle.boxShadow,
              transform: freeHover ? "translateY(-4px)" : "translateY(0)",
              transition: "box-shadow 260ms ease, transform 260ms ease",
              opacity: visible ? 1 : 0, ...(visible ? {} : { transform: "translateY(28px)" }),
              transitionDuration: "700ms",
              display: "flex", flexDirection: "column" as const,
            }}
          >
            <div style={{ ...T.label, fontSize: 13, color: C.teal, marginBottom: sp(2.5) }}>Income Stability Score&#8482;</div>
            <div style={{ display: "flex", alignItems: "baseline", gap: 8, marginBottom: 4 }}>
              <span style={{ fontSize: 48, fontWeight: 600, fontFamily: mono, color: C.navy, lineHeight: 1 }}>$0</span>
              <span style={{ ...T.meta, color: C.muted }}>always free</span>
            </div>
            <div style={{ height: 1, background: C.border, margin: `${sp(3)}px 0` }} />
            <div style={{ flex: 1, marginBottom: sp(3.5) }}>
              {["Your score out of 100", "Your stability band", "Points to the next band", "Top limiting factor", "Preview: what one change could do"].map(f => (
                <div key={f} style={{ display: "flex", gap: 10, alignItems: "flex-start", marginBottom: 12 }}>
                  <div style={{ width: 5, height: 5, borderRadius: "50%", backgroundColor: C.teal, flexShrink: 0, marginTop: 7 }} />
                  <span style={{ ...bodySm(m), fontSize: 15, color: C.muted }}>{f}</span>
                </div>
              ))}
            </div>
            <Link className="cta-tick" href="/begin" style={{
              ...ctaButton,
              width: "100%",
              height: 52, borderRadius: 10,
              padding: 0,
              background: freeHover ? C.navy : C.white, color: freeHover ? C.white : C.navy,
              border: `1px solid ${C.navy}`,
              transition: "background 200ms ease, color 200ms ease",
            }}>
              <span className="tick tick-navy" />
              Get My Free Score
            </Link>
            <p style={{ ...T.meta, color: C.light, textAlign: "center", marginTop: 12, marginBottom: 0 }}>Takes about <span style={{ fontFamily: mono }}>90</span> seconds</p>
          </div>

          {/* DIAGNOSTIC REPORT — $69 */}
          <div
            onMouseEnter={() => canHover() && setFullHover(true)}
            onMouseLeave={() => setFullHover(false)}
            style={{
              ...cardStyle,
              borderRadius: 16, position: "relative", overflow: "hidden",
              padding: m ? `${sp(4)}px ${sp(3)}px` : `${sp(4.5)}px ${sp(3.5)}px`,
              border: `2px solid ${C.purple}`,
              boxShadow: fullHover ? "0 20px 48px rgba(75,63,174,0.18)" : "0 8px 28px rgba(75,63,174,0.12)",
              transform: fullHover ? "translateY(-4px)" : "translateY(0)",
              transition: "box-shadow 260ms ease, transform 260ms ease",
              opacity: visible ? 1 : 0, ...(visible ? {} : { transform: "translateY(28px)" }),
              transitionDuration: "700ms", transitionDelay: "80ms",
              display: "flex", flexDirection: "column" as const,
            }}
          >
            <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 3, background: `linear-gradient(90deg, ${C.purple}, ${C.teal})` }} />

            <div style={{ position: "relative" }}>
              <div style={{ display: "inline-block", padding: "4px 12px", borderRadius: 4, background: "rgba(75,63,174,0.10)", marginBottom: 16 }}>
                <span style={{ ...T.label, fontSize: 13, color: C.purple }}>Most Popular</span>
              </div>
              <div style={{ ...T.label, fontSize: 13, color: C.muted, marginBottom: 16 }}>RunPayway&#8482; Diagnostic Report</div>
              <div style={{ display: "flex", alignItems: "baseline", gap: 8, marginBottom: 4 }}>
                <span style={{ fontSize: 48, fontWeight: 600, fontFamily: mono, color: C.navy, lineHeight: 1 }}>$69</span>
                <span style={{ ...T.meta, color: C.muted }}>one-time</span>
              </div>
            </div>

            <div style={{ height: 1, background: C.border, margin: `${sp(3)}px 0`, position: "relative" }} />

            <div style={{ flex: 1, marginBottom: sp(3), position: "relative" }}>
              {[
                { text: "Everything in Free, plus:", bold: true },
                { text: "4-page diagnostic interpreted from your structural inputs" },
                { text: "PressureMap\u2122 structural intelligence specific to your profile" },
                { text: "Structural action plan with projected score impact" },
                { text: "Risk scenarios ranked by damage to your structure" },
                { text: "Structural tradeoff analysis" },
                { text: "30-day execution roadmap" },
                { text: "Report delivered to your email" },
                { text: "Lifetime access to RunPayway\u2122 Stability Simulator" },
              ].map((f, i) => (
                <div key={i} style={{ display: "flex", gap: 10, alignItems: "flex-start", marginBottom: 10 }}>
                  <div style={{ width: 5, height: 5, borderRadius: "50%", backgroundColor: (f as { bold?: boolean }).bold ? "transparent" : C.teal, flexShrink: 0, marginTop: 7 }} />
                  <span style={{ fontSize: 15, color: (f as { bold?: boolean }).bold ? C.navy : C.muted, lineHeight: 1.55, fontWeight: (f as { bold?: boolean }).bold ? 600 : 400 }}>{f.text}</span>
                </div>
              ))}
            </div>

            <a className="cta-tick" href={STRIPE} style={{
              ...ctaButton,
              width: "100%",
              height: 52, borderRadius: 10,
              padding: 0,
              background: gradient, color: C.white,
              letterSpacing: "-0.01em",
              boxShadow: fullHover ? "0 12px 32px rgba(75,63,174,0.35)" : "0 8px 24px rgba(75,63,174,0.25)",
              transition: "box-shadow 260ms ease, transform 200ms ease",
              transform: fullHover ? "translateY(-2px)" : "translateY(0)", position: "relative",
            }}>
              <span className="tick tick-white" />
              Get Diagnostic Report — <span style={{ fontFamily: mono }}>$69</span>
            </a>
            <p style={{ ...T.meta, color: C.light, textAlign: "center", marginTop: 12, marginBottom: 0, position: "relative" }}>
              If it doesn&#8217;t reveal something new, full refund. No questions.
            </p>
          </div>

          {/* STABILITY MONITORING — $149/year */}
          <div
            onMouseEnter={() => canHover() && setAnnualHover(true)}
            onMouseLeave={() => setAnnualHover(false)}
            style={{
              background: C.navy, borderRadius: 16, position: "relative", overflow: "hidden",
              padding: m ? `${sp(4)}px ${sp(3)}px` : `${sp(4.5)}px ${sp(3.5)}px`,
              boxShadow: annualHover ? "0 24px 56px rgba(14,26,43,0.30)" : "0 12px 40px rgba(14,26,43,0.20)",
              transform: annualHover ? "translateY(-4px)" : "translateY(0)",
              transition: "box-shadow 260ms ease, transform 260ms ease",
              opacity: visible ? 1 : 0, ...(visible ? {} : { transform: "translateY(28px)" }),
              transitionDuration: "700ms", transitionDelay: "160ms",
              display: "flex", flexDirection: "column" as const,
            }}
          >
            <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 3, background: `linear-gradient(90deg, ${C.teal}, ${C.purple})` }} />
            <div style={{ position: "absolute", top: "-30%", right: "-20%", width: 300, height: 300, borderRadius: "50%", background: `radial-gradient(circle, rgba(31,109,122,0.12) 0%, transparent 70%)`, pointerEvents: "none" }} />

            <div style={{ position: "relative" }}>
              <div style={{ display: "inline-block", padding: "4px 12px", borderRadius: 4, background: "rgba(31,109,122,0.15)", marginBottom: 16 }}>
                <span style={{ ...T.label, fontSize: 13, color: C.teal }}>Best Value</span>
              </div>
              <div style={{ ...T.label, fontSize: 13, color: C.sandLight, marginBottom: 16 }}>RunPayway&#8482; Stability Monitoring</div>
              <div style={{ display: "flex", alignItems: "baseline", gap: 8, marginBottom: 4 }}>
                <span style={{ fontSize: 48, fontWeight: 600, fontFamily: mono, color: C.sandText, lineHeight: 1 }}>$149</span>
                <span style={{ ...T.meta, color: C.sandLight }}>/year</span>
              </div>
              <div style={{ ...T.meta, color: C.sandLight, marginTop: 4 }}>
                <span style={{ fontFamily: mono }}>3</span> assessments &middot; save <span style={{ fontFamily: mono }}>$58</span> vs. buying separately
              </div>
            </div>

            <div style={{ height: 1, background: C.sandBorder, margin: `${sp(3)}px 0`, position: "relative" }} />

            <div style={{ flex: 1, marginBottom: sp(3), position: "relative" }}>
              {[
                { text: "Everything in the Diagnostic Report, plus:", bold: true },
                { text: "3 full assessments within 12 months" },
                { text: "Take each assessment on your own schedule" },
                { text: "Full 4-page report generated every time" },
                { text: "Monitoring Portal with email sign-in" },
                { text: "Save $58 vs. buying three reports separately" },
              ].map((f, i) => (
                <div key={i} style={{ display: "flex", gap: 10, alignItems: "flex-start", marginBottom: 10 }}>
                  <div style={{ width: 5, height: 5, borderRadius: "50%", backgroundColor: (f as { bold?: boolean }).bold ? "transparent" : C.teal, flexShrink: 0, marginTop: 7 }} />
                  <span style={{ fontSize: 15, color: (f as { bold?: boolean }).bold ? C.sandText : C.sandMuted, lineHeight: 1.55, fontWeight: (f as { bold?: boolean }).bold ? 600 : 400 }}>{f.text}</span>
                </div>
              ))}
            </div>

            <a className="cta-tick" href={STRIPE_ANNUAL} style={{
              ...ctaButton,
              width: "100%",
              height: 52, borderRadius: 10,
              padding: 0,
              background: `linear-gradient(135deg, ${C.sandText} 0%, #E8E5DD 100%)`, color: C.navy,
              letterSpacing: "-0.01em",
              boxShadow: annualHover ? "0 12px 32px rgba(0,0,0,0.30)" : "0 8px 24px rgba(0,0,0,0.20)",
              transition: "box-shadow 260ms ease, transform 200ms ease",
              transform: annualHover ? "translateY(-2px)" : "translateY(0)", position: "relative",
            }}>
              <span className="tick tick-navy" />
              Start Stability Monitoring — <span style={{ fontFamily: mono }}>$149</span>
            </a>
            <p style={{ ...T.meta, color: C.sandLight, textAlign: "center", marginTop: 12, marginBottom: 0, position: "relative" }}>
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
    { num: "01", title: "Cover & Score", desc: "Your Income Stability Score, stability band, primary constraint, and distance to the next band.", color: C.purple },
    { num: "02", title: "Key Findings", desc: "Plain-English interpretation, income structure breakdown, what\u2019s working, what\u2019s holding you back, and PressureMap intelligence.", color: C.teal },
    { num: "03", title: "What To Do Next", desc: "Highest-leverage actions ranked by impact, projected score lift, 30-day roadmap, and Command Center access.", color: C.purple },
  ];

  return (
    <section ref={ref} style={{ backgroundColor: C.sand, paddingTop: secPad(m), paddingBottom: secPad(m), paddingLeft: px(m), paddingRight: px(m) }}>
      <div style={{ maxWidth: textMax, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: m ? sp(4.5) : sp(6), opacity: visible ? 1 : 0, transform: visible ? "translateY(0)" : "translateY(12px)", transition: "opacity 500ms ease-out, transform 500ms ease-out" }}>
          <div style={{ ...T.label, fontSize: 13, color: C.teal, marginBottom: 16 }}>The Report</div>
          <h2 style={{ ...h2Style(m), color: C.navy, marginBottom: 12 }}>
            Three pages. Nothing withheld.
          </h2>
        </div>

        {pages.map((p, i) => (
          <div key={p.num} style={{
            display: "flex", gap: 16, alignItems: "flex-start", padding: "20px 0",
            borderBottom: i < 2 ? `1px solid ${C.softBorder}` : "none",
            opacity: visible ? 1 : 0, transform: visible ? "translateY(0)" : "translateY(10px)",
            transition: `opacity 500ms ease-out ${80 + i * 60}ms, transform 500ms ease-out ${80 + i * 60}ms`,
          }}>
            <div style={{ width: 36, height: 36, borderRadius: 10, flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center", backgroundColor: C.white, border: `1px solid ${C.softBorder}`, fontSize: 13, fontFamily: mono, fontWeight: 700, color: p.color, position: "relative", overflow: "hidden" }}>
              <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 2, backgroundColor: p.color, opacity: 0.6 }} />
              {p.num}
            </div>
            <div>
              <div style={{ fontSize: m ? 16 : 18, fontWeight: 600, color: C.navy, letterSpacing: m ? undefined : "-0.01em", marginBottom: 4 }}>{p.title}</div>
              <p style={{ ...bodySm(m), fontSize: m ? 14 : 15, color: C.muted, margin: 0 }}>{p.desc}</p>
            </div>
          </div>
        ))}

        <div style={{ textAlign: "center", marginTop: sp(4), opacity: visible ? 1 : 0, transition: "opacity 500ms ease-out 400ms" }}>
          <Link href="/sample-report" style={{ fontSize: 16, fontWeight: 600, color: C.purple, textDecoration: "none" }}>
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
    <section ref={ref} style={{ backgroundColor: C.navy, paddingTop: secPad(m), paddingBottom: secPad(m), paddingLeft: px(m), paddingRight: px(m) }}>
      <div style={{ maxWidth: 800, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: m ? sp(5) : sp(7), opacity: visible ? 1 : 0, transform: visible ? "translateY(0)" : "translateY(16px)", transition: "opacity 600ms ease-out, transform 600ms ease-out" }}>
          <h2 style={{ ...h2Style(m), color: C.sandText }}>
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
              backgroundColor: "rgba(244,241,234,0.04)", border: `1px solid ${C.sandBorder}`,
              opacity: visible ? 1 : 0, transform: visible ? "translateY(0)" : "translateY(10px)",
              transition: `opacity 500ms ease-out ${100 + i * 80}ms, transform 500ms ease-out ${100 + i * 80}ms`,
            }}>
              <div style={{ fontSize: 15, fontWeight: 600, color: C.sandText, marginBottom: 6 }}>{b.title}</div>
              <div style={{ ...T.meta, color: C.sandLight }}>{b.desc}</div>
            </div>
          ))}
        </div>

        <div style={{ textAlign: "center", marginTop: sp(4), opacity: visible ? 1 : 0, transition: "opacity 600ms ease-out 400ms" }}>
          <div style={{ display: "inline-block", padding: "14px 28px", borderRadius: 12, border: `1px solid ${C.sandBorder}` }}>
            <p style={{ fontSize: 15, color: C.sandMuted, margin: 0, fontWeight: 500 }}>
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
    <section ref={ref} style={{ backgroundColor: C.white, paddingTop: secPad(m), paddingBottom: secPad(m), paddingLeft: px(m), paddingRight: px(m) }}>
      <div style={{ maxWidth: textMax, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: m ? sp(5) : sp(7), opacity: visible ? 1 : 0, transform: visible ? "translateY(0)" : "translateY(16px)", transition: "opacity 600ms ease-out, transform 600ms ease-out" }}>
          <h2 style={{ ...h2Style(m), color: C.navy }}>
            Frequently asked questions
          </h2>
        </div>

        {faqs.map((faq, i) => {
          const isOpen = openIdx === i;
          return (
            <div key={i} style={{ borderBottom: `1px solid ${C.softBorder}`, opacity: visible ? 1 : 0, transform: visible ? "translateY(0)" : "translateY(8px)", transition: `opacity 500ms ease-out ${60 + i * 40}ms, transform 500ms ease-out ${60 + i * 40}ms` }}>
              <button onClick={() => setOpenIdx(isOpen ? null : i)} style={{ width: "100%", display: "flex", justifyContent: "space-between", alignItems: "center", padding: m ? "18px 0" : "22px 0", border: "none", backgroundColor: "transparent", cursor: "pointer", textAlign: "left", gap: 16 }}>
                <span style={{ fontSize: m ? 16 : 18, fontWeight: 600, color: C.navy, letterSpacing: m ? undefined : "-0.01em" }}>{faq.q}</span>
                <span style={{ fontSize: 18, color: C.light, flexShrink: 0, transform: isOpen ? "rotate(180deg)" : "rotate(0deg)", transition: "transform 200ms ease" }}>&#9662;</span>
              </button>
              {isOpen && (
                <div style={{ paddingBottom: 20 }}>
                  <p style={{ ...body(m), fontSize: m ? 15 : 16, color: C.muted, margin: 0 }}>{faq.a}</p>
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
    <section ref={ref} style={{ background: gradient, position: "relative", overflow: "hidden", paddingTop: secPad(m), paddingBottom: secPad(m) }}>
      <div style={{ maxWidth: maxW, margin: "0 auto", padding: `0 ${px(m)}px`, position: "relative", zIndex: 1, textAlign: "center" }}>
        <div style={{ opacity: visible ? 1 : 0, transform: visible ? "translateY(0)" : "translateY(16px)", transition: "opacity 600ms ease-out, transform 600ms ease-out" }}>
          <h2 style={{ ...h2Style(m), fontSize: m ? 32 : 48, color: C.sandText, marginBottom: 20 }}>
            See where your income stands.
          </h2>
          <p style={{ ...body(m), color: C.sandMuted, maxWidth: 440, margin: "0 auto 40px" }}>
            Your free score shows where you stand. The full report shows what to do about it.
          </p>
          <Link className="cta-tick" href="/begin" onMouseEnter={() => canHover() && setHovered(true)} onMouseLeave={() => setHovered(false)} style={{ ...ctaButtonLight, height: m ? 48 : 56, paddingLeft: 36, paddingRight: 36, borderRadius: 10, backgroundColor: C.sandText, color: C.navy, boxShadow: hovered ? "0 8px 28px rgba(0,0,0,0.25)" : "0 4px 16px rgba(0,0,0,0.15)", transform: hovered ? "translateY(-2px)" : "translateY(0)", transition: "box-shadow 260ms ease, transform 260ms ease" }}>
            <span className="tick tick-navy" />
            Get My Free Score
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
/* EXPORT                                                              */
/* ================================================================== */
export default function PricingPage() {
  return (
    <div>
      <Hero />
      <PressureNarrative />
      <PricingCards />
      <ReportCovers />
      <Trust />
      <Faq />
      <Cta />
    </div>
  );
}
