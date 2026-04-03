"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import {
  C, T, mono, sans, sp, maxW, padX, textMax,
  secPad, px,
  h1, h2Style, h3Style, body, bodySm,
  cardStyle, ctaButton, ctaButtonLight,
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
            <span style={{ ...T.label, color: C.teal }}>Pricing</span>
          </div>
          <h1 style={{ ...h1(m), color: C.sandText, marginBottom: 24, maxWidth: 680, margin: "0 auto 24px" }}>
            Measure your income stability{!m && <br />} before something tests it.
          </h1>
          <p style={{ ...body(m), color: C.sandMuted, maxWidth: 500, margin: "0 auto 28px" }}>
            Free score instantly. Full 4-page diagnostic for <span style={{ fontFamily: mono, color: C.sandText }}>$69</span>. Track your progress over 12 months for <span style={{ fontFamily: mono, color: C.sandText }}>$149</span>.
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
/* 2. WHAT YOU GET — Report contents + visual preview                   */
/* ================================================================== */
function WhatYouGet() {
  const { ref, visible } = useInView();
  const m = useMobile();

  return (
    <section ref={ref} style={{ backgroundColor: C.sand, paddingTop: secPad(m), paddingBottom: secPad(m), paddingLeft: px(m), paddingRight: px(m) }}>
      <div style={{ maxWidth: textMax, margin: "0 auto" }}>
        <div style={{ marginBottom: m ? sp(4) : sp(6), ...fadeIn(visible) }}>
          <div style={{ ...T.label, fontSize: 13, color: C.teal, marginBottom: 16 }}>The Report</div>
          <h2 style={{ ...h2Style(m), color: C.navy, marginBottom: 12 }}>
            Four pages. Nothing withheld.
          </h2>
          <p style={{ ...body(m), color: C.muted, maxWidth: 520 }}>
            Every section generated from your structural inputs, interpreted using your industry, operating structure, and income model.
          </p>
        </div>

        {/* Report pages */}
        {[
          { num: "01", title: "Cover & Score", desc: "Your Income Stability Score, stability band, primary constraint, and distance to the next band.", color: C.purple },
          { num: "02", title: "Key Findings", desc: "PressureMap\u2122 intelligence, income structure breakdown, structural strengths and primary constraint — in plain English.", color: C.teal },
          { num: "03", title: "Stability Plan", desc: "Highest-leverage actions ranked by projected impact, combined improvement projection, 30-day roadmap.", color: C.purple },
          { num: "04", title: "Stress Testing", desc: "Ranked disruption scenarios with exact score drops, fragility assessment, and Command Center access code.", color: C.teal },
        ].map((p, i) => (
          <div key={p.num} style={{
            display: "flex", gap: 16, alignItems: "flex-start", padding: "20px 0",
            borderBottom: i < 3 ? `1px solid ${C.softBorder}` : "none",
            ...fadeIn(visible, 80 + i * 60),
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

        <div style={{ display: "flex", gap: 16, marginTop: sp(4), flexWrap: "wrap" as const, ...fadeIn(visible, 400) }}>
          <Link href="/sample-report" style={{ fontSize: 15, fontWeight: 600, color: C.purple, textDecoration: "none" }}>
            View sample report &rarr;
          </Link>
        </div>
      </div>
    </section>
  );
}


/* ================================================================== */
/* 3. PRICING CARDS                                                    */
/* ================================================================== */
function PricingCards() {
  const { ref, visible } = useInView();
  const m = useMobile();

  return (
    <section ref={ref} style={{ backgroundColor: C.white, paddingTop: secPad(m), paddingBottom: secPad(m), paddingLeft: px(m), paddingRight: px(m) }}>
      <div style={{ maxWidth: maxW, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: m ? sp(4) : sp(6), ...fadeIn(visible) }}>
          <h2 style={{ ...h2Style(m), color: C.navy, marginBottom: 12 }}>
            Start free. Go deeper when you&#8217;re ready.
          </h2>
          <p style={{ ...body(m), color: C.muted, maxWidth: 520, margin: "0 auto" }}>
            Your free score shows the problem. The diagnostic shows exactly what to fix.
            <span style={{ color: C.teal, fontWeight: 600 }}> Under 2 minutes.</span>
          </p>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: m ? "1fr" : "1fr 1fr 1fr", gap: m ? 16 : 20, alignItems: "start" }}>

          {/* ── FREE ── */}
          <div style={{
            ...cardStyle, borderRadius: 16,
            padding: m ? `${sp(4)}px ${sp(3)}px` : `${sp(4.5)}px ${sp(3.5)}px`,
            display: "flex", flexDirection: "column" as const,
            ...fadeIn(visible, 100),
          }}>
            <div style={{ ...T.label, fontSize: 13, color: C.teal, marginBottom: sp(2.5) }}>Income Stability Score&#8482;</div>
            <div style={{ display: "flex", alignItems: "baseline", gap: 8, marginBottom: 4 }}>
              <span style={{ fontSize: 48, fontWeight: 600, fontFamily: mono, color: C.navy, lineHeight: 1 }}>$0</span>
              <span style={{ ...T.meta, color: C.muted }}>always free</span>
            </div>
            <div style={{ height: 1, background: C.softBorder, margin: `${sp(3)}px 0` }} />
            <div style={{ flex: 1, marginBottom: sp(3.5) }}>
              {["Your score out of 100", "Your stability band", "Distance to next band", "Primary structural constraint", "Peer percentile for your industry"].map(f => (
                <div key={f} style={{ display: "flex", gap: 10, alignItems: "flex-start", marginBottom: 12 }}>
                  <div style={{ width: 5, height: 5, borderRadius: "50%", backgroundColor: C.teal, flexShrink: 0, marginTop: 7 }} />
                  <span style={{ fontSize: 15, color: C.muted }}>{f}</span>
                </div>
              ))}
            </div>
            <Link href="/begin" style={{
              ...ctaButton, width: "100%", height: 52, borderRadius: 10, padding: 0,
              background: C.white, color: C.navy, border: `1px solid ${C.navy}`,
            }}>
              Get My Free Score
            </Link>
            <p style={{ ...T.meta, color: C.light, textAlign: "center", marginTop: 12, marginBottom: 0 }}>Takes about <span style={{ fontFamily: mono }}>90</span> seconds</p>
          </div>

          {/* ── DIAGNOSTIC REPORT — $69 ── */}
          <div style={{
            ...cardStyle, borderRadius: 16, position: "relative",
            padding: m ? `${sp(4)}px ${sp(3)}px` : `${sp(4.5)}px ${sp(3.5)}px`,
            border: `2px solid ${C.purple}`,
            boxShadow: "0 8px 28px rgba(75,63,174,0.12)",
            display: "flex", flexDirection: "column" as const,
            ...fadeIn(visible, 180),
          }}>
            <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 3, background: `linear-gradient(90deg, ${C.purple}, ${C.teal})` }} />

            <div>
              <div style={{ display: "inline-block", padding: "4px 12px", borderRadius: 4, background: "rgba(75,63,174,0.10)", marginBottom: 16 }}>
                <span style={{ ...T.label, fontSize: 13, color: C.purple }}>Recommended</span>
              </div>
              <div style={{ ...T.label, fontSize: 13, color: C.muted, marginBottom: 16 }}>RunPayway&#8482; Diagnostic Report</div>
              <div style={{ display: "flex", alignItems: "baseline", gap: 8, marginBottom: 4 }}>
                <span style={{ fontSize: 48, fontWeight: 600, fontFamily: mono, color: C.navy, lineHeight: 1 }}>$69</span>
                <span style={{ ...T.meta, color: C.muted }}>one-time</span>
              </div>
            </div>

            <div style={{ height: 1, background: C.softBorder, margin: `${sp(3)}px 0` }} />

            <div style={{ flex: 1, marginBottom: sp(3) }}>
              {[
                { text: "Everything in Free, plus:", bold: true },
                { text: "4-page diagnostic interpreted from your structural inputs" },
                { text: "PressureMap\u2122 structural intelligence for your industry" },
                { text: "Ranked disruption scenarios with exact score drops" },
                { text: "Highest-leverage actions with projected score impact" },
                { text: "30-day execution roadmap" },
                { text: "Command Center with lifetime simulator access" },
              ].map((f, i) => (
                <div key={i} style={{ display: "flex", gap: 10, alignItems: "flex-start", marginBottom: 10 }}>
                  <div style={{ width: 5, height: 5, borderRadius: "50%", backgroundColor: (f as { bold?: boolean }).bold ? "transparent" : C.teal, flexShrink: 0, marginTop: 7 }} />
                  <span style={{ fontSize: 15, color: (f as { bold?: boolean }).bold ? C.navy : C.muted, fontWeight: (f as { bold?: boolean }).bold ? 600 : 400 }}>{f.text}</span>
                </div>
              ))}
            </div>

            <a href={STRIPE} style={{
              ...ctaButton, width: "100%", height: 52, borderRadius: 10, padding: 0,
              background: C.navy, color: C.white,
              boxShadow: "0 8px 24px rgba(14,26,43,0.15)",
            }}>
              Get Diagnostic Report &mdash; <span style={{ fontFamily: mono }}>$69</span>
            </a>
            <p style={{ ...T.meta, color: C.light, textAlign: "center", marginTop: 12, marginBottom: 0 }}>
              If it doesn&#8217;t reveal something new, full refund.
            </p>
          </div>

          {/* ── STABILITY MONITORING — $149/year ── */}
          <div style={{
            background: C.navy, borderRadius: 16, position: "relative",
            padding: m ? `${sp(4)}px ${sp(3)}px` : `${sp(4.5)}px ${sp(3.5)}px`,
            boxShadow: "0 12px 40px rgba(14,26,43,0.20)",
            display: "flex", flexDirection: "column" as const,
            ...fadeIn(visible, 260),
          }}>
            <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 3, background: `linear-gradient(90deg, ${C.teal}, ${C.purple})` }} />

            <div>
              <div style={{ display: "inline-block", padding: "4px 12px", borderRadius: 4, background: "rgba(31,109,122,0.15)", marginBottom: 16 }}>
                <span style={{ ...T.label, fontSize: 13, color: C.teal }}>Best Value</span>
              </div>
              <div style={{ ...T.label, fontSize: 13, color: C.sandLight, marginBottom: 16 }}>RunPayway&#8482; Stability Monitoring</div>
              <div style={{ display: "flex", alignItems: "baseline", gap: 8, marginBottom: 4 }}>
                <span style={{ fontSize: 48, fontWeight: 600, fontFamily: mono, color: C.sandText, lineHeight: 1 }}>$149</span>
                <span style={{ ...T.meta, color: C.sandLight }}>/year</span>
              </div>
              <div style={{ ...T.meta, color: C.sandLight, marginTop: 4 }}>
                <span style={{ fontFamily: mono }}>3</span> assessments &middot; save <span style={{ fontFamily: mono }}>$58</span>
              </div>
            </div>

            <div style={{ height: 1, background: C.sandBorder, margin: `${sp(3)}px 0` }} />

            <div style={{ flex: 1, marginBottom: sp(3) }}>
              {[
                { text: "Everything in the Diagnostic, plus:", bold: true },
                { text: "3 full assessments within 12 months" },
                { text: "Score History Timeline — track your progression" },
                { text: "Factor-level delta tracking between assessments" },
                { text: "Benchmark evolution — peer percentile over time" },
                { text: "Monitoring Portal with email + PIN sign-in" },
              ].map((f, i) => (
                <div key={i} style={{ display: "flex", gap: 10, alignItems: "flex-start", marginBottom: 10 }}>
                  <div style={{ width: 5, height: 5, borderRadius: "50%", backgroundColor: (f as { bold?: boolean }).bold ? "transparent" : C.teal, flexShrink: 0, marginTop: 7 }} />
                  <span style={{ fontSize: 15, color: (f as { bold?: boolean }).bold ? C.sandText : C.sandMuted, fontWeight: (f as { bold?: boolean }).bold ? 600 : 400 }}>{f.text}</span>
                </div>
              ))}
            </div>

            <a href={STRIPE_ANNUAL} style={{
              ...ctaButton, width: "100%", height: 52, borderRadius: 10, padding: 0,
              background: C.white, color: C.navy,
              boxShadow: "0 8px 24px rgba(0,0,0,0.20)",
            }}>
              Start Monitoring &mdash; <span style={{ fontFamily: mono }}>$149</span>
            </a>
            <p style={{ ...T.meta, color: C.sandLight, textAlign: "center", marginTop: 12, marginBottom: 0 }}>
              Includes Monitoring Portal with email + PIN access.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}


/* ================================================================== */
/* 4. OUTCOME PROOF — one testimonial from landing page                */
/* ================================================================== */
function OutcomeProof() {
  const { ref, visible } = useInView();
  const m = useMobile();

  const outcomes = [
    {
      before: 34, after: 61,
      constraint: "80% client concentration",
      action: "Restructured to 4 clients, none above 35%. Added 2 retainer agreements.",
      name: "Sarah M.", role: "Real Estate Agent",
    },
    {
      before: 28, after: 52,
      constraint: "Zero recurring income",
      action: "Converted 3 project clients to monthly retainers. Shifted 40% of revenue to recurring.",
      name: "James R.", role: "Software Contractor",
    },
    {
      before: 42, after: 67,
      constraint: "No forward visibility",
      action: "Secured 3-month contracts for top 2 clients. Extended engagement terms from monthly to quarterly.",
      name: "Priya K.", role: "Management Consultant",
    },
  ];

  return (
    <section ref={ref} style={{ backgroundColor: C.sand, paddingTop: secPad(m), paddingBottom: secPad(m), paddingLeft: px(m), paddingRight: px(m) }}>
      <div style={{ maxWidth: maxW, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: m ? sp(5) : sp(6), ...fadeIn(visible) }}>
          <h2 style={{ ...h2Style(m), color: C.navy, marginBottom: sp(2) }}>What changed after they measured</h2>
          <p style={{ ...body(m), color: C.muted }}>
            The score reveals the weakness. The action changes the outcome.
          </p>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: m ? "1fr" : "repeat(3, 1fr)", gap: sp(3.5) }}>
          {outcomes.map((t, i) => (
            <div key={t.name} style={{
              ...cardStyle,
              padding: m ? sp(4) : sp(5),
              ...fadeIn(visible, 150 + i * 100),
            }}>
              {/* Score change */}
              <div style={{ display: "flex", alignItems: "center", gap: sp(1.5), marginBottom: sp(3) }}>
                <span style={{ fontSize: 32, fontWeight: 600, color: C.light, lineHeight: 1, fontFamily: mono }}>{t.before}</span>
                <svg width="20" height="12" viewBox="0 0 20 12" fill="none" aria-hidden="true">
                  <path d="M2 6h16M14 2l4 4-4 4" stroke={C.teal} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                <span style={{ fontSize: 32, fontWeight: 600, color: C.purple, lineHeight: 1, fontFamily: mono }}>{t.after}</span>
              </div>

              {/* Constraint */}
              <p style={{ fontSize: 14, fontWeight: 500, color: C.muted, marginBottom: sp(2) }}>
                Constraint: {t.constraint}
              </p>

              {/* Action taken */}
              <p style={{ fontSize: 16, fontWeight: 400, lineHeight: 1.6, color: C.navy, marginBottom: sp(3) }}>
                {t.action}
              </p>

              {/* Attribution */}
              <div style={{ paddingTop: sp(2.5), borderTop: `1px solid ${C.softBorder}` }}>
                <div style={{ fontSize: 16, fontWeight: 500, color: C.navy, marginBottom: 2 }}>{t.name}</div>
                <div style={{ ...T.micro, color: C.muted }}>{t.role}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}


/* ================================================================== */
/* 5. TRUST                                                            */
/* ================================================================== */
function Trust() {
  const { ref, visible } = useInView();
  const m = useMobile();

  return (
    <section ref={ref} style={{ backgroundColor: C.navy, paddingTop: secPad(m), paddingBottom: secPad(m), paddingLeft: px(m), paddingRight: px(m) }}>
      <div style={{ maxWidth: 800, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: m ? sp(5) : sp(7), ...fadeIn(visible) }}>
          <h2 style={{ ...h2Style(m), color: C.sandText }}>
            Built on trust. Not on promises.
          </h2>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: m ? "1fr 1fr" : "repeat(4, 1fr)", gap: m ? 12 : 16 }}>
          {[
            { title: "No bank connection", desc: "We never access financial accounts." },
            { title: "No credit pull", desc: "No impact on your credit." },
            { title: "Private by default", desc: "Your data is never sold." },
            { title: "Full refund", desc: "30 days, no questions asked." },
          ].map((b, i) => (
            <div key={b.title} style={{
              padding: m ? "20px 16px" : "24px 20px", borderRadius: 14, textAlign: "center",
              backgroundColor: "rgba(244,241,234,0.04)", border: `1px solid ${C.sandBorder}`,
              ...fadeIn(visible, 100 + i * 80),
            }}>
              <div style={{ fontSize: 15, fontWeight: 600, color: C.sandText, marginBottom: 6 }}>{b.title}</div>
              <div style={{ ...T.meta, color: C.sandLight }}>{b.desc}</div>
            </div>
          ))}
        </div>

        <div style={{ textAlign: "center", marginTop: sp(4), ...fadeIn(visible, 500) }}>
          <div style={{ display: "inline-block", padding: "14px 28px", borderRadius: 12, border: `1px solid ${C.sandBorder}` }}>
            <p style={{ fontSize: 15, color: C.sandMuted, margin: 0, fontWeight: 500 }}>
              Deterministic &#183; Fixed rules &#183; Versioned &#183; Same inputs, same score
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}


/* ================================================================== */
/* 6. FAQ                                                              */
/* ================================================================== */
function Faq() {
  const { ref, visible } = useInView();
  const m = useMobile();
  const [openIdx, setOpenIdx] = useState<number | null>(null);

  const faqs = [
    { q: "What do I get for free?", a: "Your score out of 100, your stability band, distance to the next band, your primary structural constraint, and your peer percentile. No payment required." },
    { q: "What does the Diagnostic Report include?", a: "A 4-page structural diagnostic with PressureMap\u2122 intelligence, ranked risk scenarios, projected actions, tradeoff analysis, a 30-day roadmap, and lifetime access to the Command Center with the stability simulator." },
    { q: "What does Stability Monitoring include?", a: "Three full assessments within 12 months, each generating a complete 4-page diagnostic. Plus monitoring-exclusive features: Score History Timeline, factor-level delta tracking, benchmark evolution, and Monitoring Portal access with email + PIN sign-in." },
    { q: "How is the score calculated?", a: "The scoring model evaluates six fixed structural dimensions using deterministic, versioned rules. Same inputs always produce the same score." },
    { q: "What is your refund policy?", a: "Full refund within 30 days \u2014 no questions asked. If the report doesn\u2019t reveal at least one insight you didn\u2019t already know, you get your money back." },
    { q: "Is my information confidential?", a: "Yes. No bank credentials, no credit data, no financial account access. Your data is never sold. You can request deletion at any time." },
    { q: "How long does it take?", a: "Under two minutes. Your free score is delivered instantly. The full diagnostic generates immediately after purchase." },
  ];

  return (
    <section ref={ref} style={{ backgroundColor: C.white, paddingTop: secPad(m), paddingBottom: secPad(m), paddingLeft: px(m), paddingRight: px(m) }}>
      <div style={{ maxWidth: textMax, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: m ? sp(5) : sp(7), ...fadeIn(visible) }}>
          <h2 style={{ ...h2Style(m), color: C.navy }}>
            Frequently asked questions
          </h2>
        </div>

        {faqs.map((faq, i) => {
          const isOpen = openIdx === i;
          return (
            <div key={i} style={{ borderBottom: `1px solid ${C.softBorder}`, ...fadeIn(visible, 60 + i * 40) }}>
              <button onClick={() => setOpenIdx(isOpen ? null : i)} style={{ width: "100%", display: "flex", justifyContent: "space-between", alignItems: "center", padding: m ? "18px 0" : "22px 0", minHeight: 48, border: "none", backgroundColor: "transparent", cursor: "pointer", textAlign: "left", gap: 16 }}>
                <span style={{ fontSize: m ? 16 : 18, fontWeight: 600, color: C.navy }}>{faq.q}</span>
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
/* 7. CTA                                                              */
/* ================================================================== */
function Cta() {
  const { ref, visible } = useInView();
  const m = useMobile();

  return (
    <section ref={ref} style={{ backgroundColor: C.navy, paddingTop: secPad(m), paddingBottom: secPad(m), paddingLeft: px(m), paddingRight: px(m) }}>
      <div style={{ maxWidth: maxW, margin: "0 auto", textAlign: "center" }}>
        <div style={{ ...fadeIn(visible) }}>
          <h2 style={{ ...h2Style(m), color: C.sandText, marginBottom: 20 }}>
            Your income has a structure.{!m && <br />} Now you can measure it.
          </h2>
          <p style={{ ...body(m), color: C.sandMuted, maxWidth: 440, margin: "0 auto 40px" }}>
            Start with the free score. The diagnostic is there when you want the full picture.
          </p>
          <Link href="/begin" style={{
            ...ctaButtonLight, height: m ? 48 : 56, paddingLeft: 36, paddingRight: 36, borderRadius: 10,
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
export default function PricingPage() {
  return (
    <div style={{ fontFamily: sans, overflowX: "hidden" }}>
      <Hero />
      <WhatYouGet />
      <PricingCards />
      <OutcomeProof />
      <Trust />
      <Faq />
      <Cta />
    </div>
  );
}
