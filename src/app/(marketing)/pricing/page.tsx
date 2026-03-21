"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";

/* ------------------------------------------------------------------ */
/*  Shared hooks                                                       */
/* ------------------------------------------------------------------ */

const canHover = () =>
  typeof window !== "undefined" && window.matchMedia("(hover: hover)").matches;

function useInView(threshold = 0) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    if (rect.top < window.innerHeight + 50 && rect.bottom > 0) {
      setVisible(true);
      return;
    }
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          obs.disconnect();
        }
      },
      { threshold },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);
  return { ref, visible };
}

function useMobile(breakpoint = 768) {
  const [mobile, setMobile] = useState(false);
  useEffect(() => {
    const check = () => setMobile(window.innerWidth <= breakpoint);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, [breakpoint]);
  return mobile;
}

/* ------------------------------------------------------------------ */
/*  Brand tokens                                                       */
/* ------------------------------------------------------------------ */

const B = {
  navy: "#0E1A2B",
  purple: "#4B3FAE",
  teal: "#1F6D7A",
  sand: "#F7F6F3",
  sandDk: "#EDECEA",
  muted: "#6B7280",
  light: "#9CA3AF",
  gradient: "linear-gradient(135deg, #0E1A2B 0%, #4B3FAE 50%, #1F6D7A 100%)",
};

const S = {
  sectionY:     { desktop: 160, mobile: 88 },
  sectionYsm:   { desktop: 120, mobile: 72 },
  transitionY:  { desktop: 72, mobile: 48 },
  disclaimerY:  { desktop: 64, mobile: 48 },
  maxW:         1060,
  padX:         { desktop: 48, mobile: 24 },
  h1mb:         28,
  h2mb:         24,
  subtextMb:    56,
  paraMb:       24,
  labelMb:      16,
  cardPad:      { desktop: 36, mobile: 24 },
  cardRadius:   16,
  panelRadius:  20,
  gridGap:      24,
  gridGapSm:    16,
  ctaH:         56,
  ctaHsm:       46,
  ctaPadX:      32,
  ctaRadius:    14,
  lhHeading:    1.08,
  lhBody:       1.75,
  lhDense:      1.5,
  lsHeading:    "-0.025em",
  lsHero:       "-0.035em",
  lsLabel:      "0.14em",
};

/* ------------------------------------------------------------------ */
/*  Stripe payment links                                               */
/* ------------------------------------------------------------------ */

const STRIPE = {
  single: "https://buy.stripe.com/14A28j48E2socZQa2Z2Nq02",
  annual: "https://buy.stripe.com/aFacMXdJe2so7Fw7UR2Nq03",
};


/* ================================================================== */
/* HERO                                                                */
/* ================================================================== */
function Hero() {
  const { ref, visible } = useInView();
  const mobile = useMobile();

  return (
    <section
      ref={ref}
      aria-label="Pricing Hero"
      style={{
        backgroundColor: "#ffffff",
        paddingTop: mobile ? S.sectionY.mobile : S.sectionY.desktop,
        paddingBottom: mobile ? S.sectionYsm.mobile : S.sectionYsm.desktop,
      }}
    >
      <div style={{ maxWidth: S.maxW, marginLeft: "auto", marginRight: "auto", paddingLeft: mobile ? S.padX.mobile : S.padX.desktop, paddingRight: mobile ? S.padX.mobile : S.padX.desktop }}>
        <div
          style={{
            textAlign: "center",
            opacity: visible ? 1 : 0,
            transform: visible ? "translateY(0)" : "translateY(16px)",
            transition: "opacity 0.6s ease-out, transform 0.6s ease-out",
          }}
        >
          <div
            className="text-[11px] uppercase"
            style={{ color: B.teal, fontWeight: 700, letterSpacing: S.lsLabel, marginBottom: 20 }}
          >
            Model RP-2.0
          </div>
          <h1
            className="text-[36px] md:text-[52px]"
            style={{
              color: B.navy,
              fontWeight: 700,
              letterSpacing: S.lsHero,
              lineHeight: S.lhHeading,
              marginBottom: S.h1mb,
            }}
          >
            Measure the structure<br />behind your income
          </h1>
          <p
            className="text-[16px] md:text-[18px]"
            style={{ color: B.muted, lineHeight: S.lhBody, maxWidth: 560, marginLeft: "auto", marginRight: "auto" }}
          >
            A deterministic structural assessment — no AI, no credit pull, no bank connection. Just a score backed by fixed rules.
          </p>
        </div>
      </div>
    </section>
  );
}


/* ================================================================== */
/* PRICING CARDS                                                       */
/* ================================================================== */
function PricingCards() {
  const { ref, visible } = useInView();
  const mobile = useMobile();

  const plans = [
    {
      title: "Single Assessment",
      price: "$39",
      perUnit: "one-time",
      desc: "A complete 5-page income stability assessment generated by Model RP-2.0. Answer six questions, receive your full report.",
      href: STRIPE.single,
      recommended: false,
    },
    {
      title: "Annual Monitoring",
      price: "$99",
      perUnit: "per year",
      desc: "Unlimited reassessments for 12 months. Track how structural changes affect your score over time. Includes every Model RP-2.0 update.",
      href: STRIPE.annual,
      recommended: true,
    },
  ];

  return (
    <section
      ref={ref}
      aria-label="Pricing Plans"
      style={{
        backgroundColor: B.sand,
        paddingTop: mobile ? S.sectionY.mobile : S.sectionY.desktop,
        paddingBottom: mobile ? S.sectionY.mobile : S.sectionY.desktop,
      }}
    >
      <div style={{ maxWidth: S.maxW, marginLeft: "auto", marginRight: "auto", paddingLeft: mobile ? S.padX.mobile : S.padX.desktop, paddingRight: mobile ? S.padX.mobile : S.padX.desktop }}>
        <div style={{ display: "grid", gridTemplateColumns: mobile ? "1fr" : "1fr 1fr", gap: 32, maxWidth: 780, margin: "0 auto" }}>
          {plans.map((plan, i) => {
            const [hovered, setHovered] = useState(false);
            return (
              <div
                key={plan.title}
                onMouseEnter={() => canHover() && setHovered(true)}
                onMouseLeave={() => setHovered(false)}
                style={{
                  position: "relative",
                  background: "#FFFFFF",
                  borderRadius: S.panelRadius,
                  border: `1px solid ${plan.recommended ? "rgba(75,63,174,0.25)" : "rgba(14,26,43,0.06)"}`,
                  padding: mobile ? "32px 28px" : "40px 36px",
                  boxShadow: hovered
                    ? plan.recommended
                      ? "0 20px 48px rgba(75,63,174,0.14)"
                      : "0 12px 32px rgba(14,26,43,0.08)"
                    : plan.recommended
                      ? "0 8px 24px rgba(75,63,174,0.08)"
                      : "0 2px 8px rgba(14,26,43,0.04)",
                  transition: "opacity 700ms ease, transform 700ms ease, box-shadow 260ms ease",
                  opacity: visible ? 1 : 0,
                  transform: visible ? "translateY(0)" : "translateY(28px)",
                  transitionDelay: `${i * 120}ms`,
                  display: "flex",
                  flexDirection: "column" as const,
                }}
              >
                {/* Recommended badge */}
                {plan.recommended && (
                  <div
                    style={{
                      position: "absolute",
                      top: -14,
                      left: "50%",
                      transform: "translateX(-50%)",
                      padding: "5px 18px",
                      borderRadius: 100,
                      background: B.purple,
                      color: "#FFFFFF",
                      fontSize: 11,
                      fontWeight: 700,
                      letterSpacing: "0.06em",
                      textTransform: "uppercase" as const,
                      whiteSpace: "nowrap" as const,
                    }}
                  >
                    Recommended
                  </div>
                )}

                <h3 className="text-[14px] uppercase" style={{ color: B.teal, fontWeight: 700, letterSpacing: "0.08em", marginBottom: 16 }}>
                  {plan.title}
                </h3>

                <div style={{ display: "flex", alignItems: "baseline", gap: 6, marginBottom: 8 }}>
                  <span className="text-[44px]" style={{ fontWeight: 700, color: B.navy, lineHeight: 1 }}>{plan.price}</span>
                  <span className="text-[14px]" style={{ color: B.muted }}>{plan.perUnit}</span>
                </div>

                <p className="text-[14px]" style={{ color: B.muted, lineHeight: S.lhBody, marginBottom: 32, flex: 1 }}>
                  {plan.desc}
                </p>

                <a
                  href={plan.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    height: mobile ? S.ctaHsm : S.ctaH,
                    borderRadius: S.ctaRadius,
                    background: plan.recommended ? B.gradient : "transparent",
                    color: plan.recommended ? "#ffffff" : B.navy,
                    border: plan.recommended ? "none" : `1.5px solid ${B.navy}`,
                    fontSize: 15,
                    fontWeight: 600,
                    textDecoration: "none",
                    letterSpacing: "0.01em",
                    transition: "box-shadow 260ms ease",
                    boxShadow: hovered && plan.recommended ? "0 8px 24px rgba(75,63,174,0.25)" : "none",
                  }}
                >
                  Get Started
                </a>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}


/* ================================================================== */
/* WHAT EVERY ASSESSMENT INCLUDES                                      */
/* ================================================================== */
function WhatIncludes() {
  const { ref, visible } = useInView();
  const mobile = useMobile();

  const items = [
    { title: "Income Stability Score", desc: "A single 0\u2013100 score reflecting your income\u2019s structural durability." },
    { title: "Classification Band", desc: "Limited, Developing, Established, or High \u2014 fixed thresholds under Model RP-2.0." },
    { title: "Structural Breakdown", desc: "Five scored dimensions showing exactly where strength and fragility live." },
    { title: "Stress Scenarios", desc: "Deterministic projections of how your score changes under adverse conditions." },
    { title: "Sensitivity Analysis", desc: "Which inputs have the most leverage on your score." },
    { title: "Improvement Projections", desc: "Ranked actions with estimated point impact, tailored to your profile." },
    { title: "Industry-Tailored Actions", desc: "Recommendations calibrated to your income model family." },
    { title: "Reassessment Triggers", desc: "Specific conditions under which you should reassess." },
    { title: "Peer Benchmarking", desc: "Percentile ranking within your industry cohort." },
    { title: "Verification", desc: "SHA-256 hash and model version stamp for every assessment." },
  ];

  return (
    <section
      ref={ref}
      aria-label="What Every Assessment Includes"
      style={{
        backgroundColor: "#ffffff",
        paddingTop: mobile ? S.sectionY.mobile : S.sectionY.desktop,
        paddingBottom: mobile ? S.sectionY.mobile : S.sectionY.desktop,
      }}
    >
      <div style={{ maxWidth: S.maxW, marginLeft: "auto", marginRight: "auto", paddingLeft: mobile ? S.padX.mobile : S.padX.desktop, paddingRight: mobile ? S.padX.mobile : S.padX.desktop }}>
        <div
          style={{
            textAlign: "center",
            marginBottom: S.subtextMb,
            opacity: visible ? 1 : 0,
            transform: visible ? "translateY(0)" : "translateY(12px)",
            transition: "opacity 0.5s ease-out, transform 0.5s ease-out",
          }}
        >
          <h2 className="text-[28px] md:text-[40px]" style={{ color: B.navy, fontWeight: 600, letterSpacing: S.lsHeading, marginBottom: 12 }}>
            What every assessment includes
          </h2>
          <p className="text-[15px]" style={{ color: B.muted, lineHeight: S.lhBody, maxWidth: 560, marginLeft: "auto", marginRight: "auto" }}>
            Both plans deliver the same comprehensive 5-page report. Nothing is hidden behind a paywall.
          </p>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: mobile ? "1fr" : "1fr 1fr", gap: S.gridGap, maxWidth: 800, margin: "0 auto" }}>
          {items.map((item, i) => (
            <div
              key={item.title}
              style={{
                display: "flex",
                gap: 14,
                alignItems: "flex-start",
                opacity: visible ? 1 : 0,
                transform: visible ? "translateY(0)" : "translateY(10px)",
                transition: `opacity 0.5s ease-out ${i * 50}ms, transform 0.5s ease-out ${i * 50}ms`,
              }}
            >
              <div style={{ width: 6, height: 6, borderRadius: "50%", backgroundColor: B.teal, flexShrink: 0, marginTop: 7 }} />
              <div>
                <span className="text-[14px]" style={{ fontWeight: 600, color: B.navy }}>{item.title}</span>
                <p className="text-[13px]" style={{ color: B.muted, lineHeight: 1.6, margin: "4px 0 0" }}>{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}


/* ================================================================== */
/* TRUST STRIP                                                         */
/* ================================================================== */
function TrustStrip() {
  const { ref, visible } = useInView();
  const mobile = useMobile();

  const badges = [
    "No bank connection",
    "No credit pull",
    "Private by default",
    "Model RP-2.0",
  ];

  return (
    <section
      ref={ref}
      aria-label="Trust Badges"
      style={{
        backgroundColor: B.sand,
        paddingTop: mobile ? S.sectionYsm.mobile : S.sectionYsm.desktop,
        paddingBottom: mobile ? S.sectionYsm.mobile : S.sectionYsm.desktop,
      }}
    >
      <div style={{ maxWidth: S.maxW, marginLeft: "auto", marginRight: "auto", paddingLeft: mobile ? S.padX.mobile : S.padX.desktop, paddingRight: mobile ? S.padX.mobile : S.padX.desktop }}>
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "center",
            gap: mobile ? 12 : 20,
            opacity: visible ? 1 : 0,
            transform: visible ? "translateY(0)" : "translateY(10px)",
            transition: "opacity 0.5s ease-out, transform 0.5s ease-out",
          }}
        >
          {badges.map((badge) => (
            <div
              key={badge}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
                padding: "10px 20px",
                borderRadius: 100,
                backgroundColor: "#ffffff",
                border: "1px solid rgba(14,26,43,0.06)",
              }}
            >
              <div style={{ width: 6, height: 6, borderRadius: "50%", background: B.gradient }} />
              <span className="text-[13px]" style={{ color: B.navy, fontWeight: 600, letterSpacing: "0.02em" }}>{badge}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}


/* ================================================================== */
/* FAQ                                                                 */
/* ================================================================== */
function Faq() {
  const { ref, visible } = useInView();
  const mobile = useMobile();
  const [openIdx, setOpenIdx] = useState<number | null>(null);

  const faqs = [
    {
      q: "What is the difference between Single and Annual?",
      a: "The Single Assessment is a one-time report. Annual Monitoring gives you unlimited reassessments for 12 months, so you can track how changes to your income structure affect your score over time. Both use the same Model RP-2.0 engine and produce the same comprehensive 5-page report.",
    },
    {
      q: "Do you need access to my bank accounts?",
      a: "No. RunPayway never connects to your bank, pulls your credit, or accesses any financial accounts. You answer six structured questions about your income, and the model generates your assessment from those inputs alone.",
    },
    {
      q: "Can I share my report with a lender or employer?",
      a: "Yes. Every assessment includes a SHA-256 verification hash and model version stamp. Recipients can confirm the report was generated by Model RP-2.0 and has not been altered. The report is yours — share it however you choose.",
    },
  ];

  return (
    <section
      ref={ref}
      aria-label="Frequently Asked Questions"
      style={{
        backgroundColor: "#ffffff",
        paddingTop: mobile ? S.sectionY.mobile : S.sectionY.desktop,
        paddingBottom: mobile ? S.sectionY.mobile : S.sectionY.desktop,
      }}
    >
      <div style={{ maxWidth: S.maxW, marginLeft: "auto", marginRight: "auto", paddingLeft: mobile ? S.padX.mobile : S.padX.desktop, paddingRight: mobile ? S.padX.mobile : S.padX.desktop }}>
        <div
          style={{
            textAlign: "center",
            marginBottom: S.subtextMb,
            opacity: visible ? 1 : 0,
            transform: visible ? "translateY(0)" : "translateY(12px)",
            transition: "opacity 0.5s ease-out, transform 0.5s ease-out",
          }}
        >
          <h2 className="text-[28px] md:text-[36px]" style={{ color: B.navy, fontWeight: 600, letterSpacing: S.lsHeading }}>
            Common Questions
          </h2>
        </div>

        <div style={{ maxWidth: 680, margin: "0 auto" }}>
          {faqs.map((faq, i) => (
            <div
              key={i}
              style={{
                borderBottom: i < faqs.length - 1 ? "1px solid rgba(14,26,43,0.06)" : "none",
                opacity: visible ? 1 : 0,
                transform: visible ? "translateY(0)" : "translateY(10px)",
                transition: `opacity 0.5s ease-out ${i * 80}ms, transform 0.5s ease-out ${i * 80}ms`,
              }}
            >
              <button
                onClick={() => setOpenIdx(openIdx === i ? null : i)}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  width: "100%",
                  padding: "24px 0",
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  textAlign: "left",
                }}
              >
                <span className="text-[15px]" style={{ fontWeight: 600, color: B.navy, paddingRight: 16 }}>{faq.q}</span>
                <span className="text-[20px]" style={{ color: B.light, flexShrink: 0, transition: "transform 200ms ease", transform: openIdx === i ? "rotate(45deg)" : "rotate(0)" }}>+</span>
              </button>
              <div style={{ maxHeight: openIdx === i ? 300 : 0, overflow: "hidden", transition: "max-height 300ms ease" }}>
                <p className="text-[14px]" style={{ color: B.muted, lineHeight: S.lhBody, paddingBottom: 24, margin: 0 }}>
                  {faq.a}
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
/* CTA SECTION                                                         */
/* ================================================================== */
function CtaSection() {
  const { ref, visible } = useInView();
  const mobile = useMobile();
  const [hovered, setHovered] = useState(false);

  return (
    <section
      ref={ref}
      aria-label="Final CTA"
      style={{
        backgroundColor: B.sand,
        paddingTop: mobile ? S.sectionY.mobile : S.sectionY.desktop,
        paddingBottom: mobile ? S.sectionY.mobile : S.sectionY.desktop,
      }}
    >
      <div style={{ maxWidth: S.maxW, marginLeft: "auto", marginRight: "auto", paddingLeft: mobile ? S.padX.mobile : S.padX.desktop, paddingRight: mobile ? S.padX.mobile : S.padX.desktop }}>
        <div
          style={{
            textAlign: "center",
            opacity: visible ? 1 : 0,
            transform: visible ? "translateY(0)" : "translateY(16px)",
            transition: "opacity 0.6s ease-out, transform 0.6s ease-out",
          }}
        >
          <h2 className="text-[28px] md:text-[40px]" style={{ color: B.navy, fontWeight: 600, letterSpacing: S.lsHeading, marginBottom: S.h2mb }}>
            Ready to measure your income stability?
          </h2>
          <p className="text-[15px] md:text-[16px]" style={{ color: B.muted, lineHeight: S.lhBody, maxWidth: 480, marginLeft: "auto", marginRight: "auto", marginBottom: 40 }}>
            Under two minutes. No bank access. No credit pull. Just a structural score backed by Model RP-2.0.
          </p>
          <a
            href={STRIPE.single}
            target="_blank"
            rel="noopener noreferrer"
            onMouseEnter={() => canHover() && setHovered(true)}
            onMouseLeave={() => setHovered(false)}
            style={{
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              height: mobile ? S.ctaHsm : S.ctaH,
              paddingLeft: S.ctaPadX,
              paddingRight: S.ctaPadX,
              borderRadius: S.ctaRadius,
              background: hovered ? B.purple : B.gradient,
              color: "#ffffff",
              fontSize: 15,
              fontWeight: 600,
              letterSpacing: "0.01em",
              textDecoration: "none",
              boxShadow: hovered ? "0 8px 24px rgba(75,63,174,0.25)" : "0 4px 16px rgba(14,26,43,0.12)",
              transition: "background 260ms ease, box-shadow 260ms ease",
            }}
          >
            Get My Score
          </a>
        </div>
      </div>
    </section>
  );
}


/* ================================================================== */
/* MODEL BADGE                                                         */
/* ================================================================== */
function ModelBadge() {
  const mobile = useMobile();

  return (
    <section
      aria-label="Model Badge"
      style={{
        backgroundColor: "#ffffff",
        paddingTop: mobile ? S.disclaimerY.mobile : S.disclaimerY.desktop,
        paddingBottom: mobile ? S.disclaimerY.mobile : S.disclaimerY.desktop,
      }}
    >
      <div style={{ maxWidth: S.maxW, marginLeft: "auto", marginRight: "auto", paddingLeft: mobile ? S.padX.mobile : S.padX.desktop, paddingRight: mobile ? S.padX.mobile : S.padX.desktop, textAlign: "center" }}>
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 10,
            padding: "10px 20px",
            borderRadius: 100,
            backgroundColor: B.sand,
            border: "1px solid rgba(14,26,43,0.06)",
          }}
        >
          <div style={{ width: 8, height: 8, borderRadius: "50%", background: B.gradient }} />
          <span className="text-[12px]" style={{ color: B.navy, fontWeight: 600, letterSpacing: "0.04em" }}>
            Model RP-2.0
          </span>
        </div>
      </div>
    </section>
  );
}


/* ================================================================== */
/* MAIN EXPORT                                                         */
/* ================================================================== */
export default function PricingPage() {
  return (
    <div>
      <Hero />
      <PricingCards />
      <WhatIncludes />
      <TrustStrip />
      <Faq />
      <CtaSection />
      <ModelBadge />
    </div>
  );
}
