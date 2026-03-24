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
  teal: "#1A7A6D",
  sand: "#F5F2EC",
  offWhite: "#FAFAF8",
  muted: "rgba(14,26,43,0.55)",
  light: "rgba(14,26,43,0.38)",
  border: "rgba(14,26,43,0.08)",
  gradient: "linear-gradient(145deg, #0E1A2B 0%, #161430 35%, #3D2F9C 65%, #1A7A6D 100%)",
  cream: "#F4F1EA",
};

const S = {
  sectionY: { desktop: 120, mobile: 72 },
  sectionYsm: { desktop: 80, mobile: 48 },
  maxW: 1060,
  padX: { desktop: 48, mobile: 24 },
  h1mb: 20,
  h2mb: 16,
  subtextMb: 48,
  cardRadius: 8,
  panelRadius: 12,
  ctaH: 52,
  ctaHsm: 44,
  ctaRadius: 10,
  lhHeading: 1.08,
  lhBody: 1.6,
  lsHeading: "-0.025em",
  lsHero: "-0.03em",
  lsLabel: "0.10em",
};

/* ------------------------------------------------------------------ */
/*  Stripe payment links                                               */
/* ------------------------------------------------------------------ */

const STRIPE = {
  single: "https://buy.stripe.com/7sY8wHeNid726Bs8YV2Nq04",
};

const DISPLAY_FONT = "'DM Serif Display', Georgia, serif";



/* ================================================================== */
/* 1. HERO — Dark gradient, commanding                                 */
/* ================================================================== */
function Hero() {
  const { ref, visible } = useInView();
  const mobile = useMobile();

  return (
    <section
      ref={ref}
      aria-label="Pricing Hero"
      style={{
        position: "relative",
        background: B.gradient,
        paddingTop: mobile ? 96 : 160,
        paddingBottom: mobile ? 72 : 120,
        overflow: "hidden",
      }}
    >
      <style>{`@import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display&display=swap');`}</style>
      {/* Atmospheric glows */}
      <div style={{ position: "absolute", top: "30%", left: "50%", transform: "translate(-50%, -50%)", width: mobile ? 500 : 900, height: mobile ? 500 : 900, borderRadius: "50%", background: "radial-gradient(circle, rgba(75,63,174,0.20) 0%, transparent 65%)", pointerEvents: "none" }} />
      <div style={{ position: "absolute", bottom: "-20%", right: "-10%", width: 600, height: 600, borderRadius: "50%", background: "radial-gradient(circle, rgba(26,122,109,0.10) 0%, transparent 60%)", pointerEvents: "none" }} />

      <div
        style={{
          position: "relative",
          zIndex: 1,
          maxWidth: S.maxW,
          marginLeft: "auto",
          marginRight: "auto",
          paddingLeft: mobile ? S.padX.mobile : S.padX.desktop,
          paddingRight: mobile ? S.padX.mobile : S.padX.desktop,
        }}
      >
        <div
          style={{
            textAlign: "center",
            opacity: visible ? 1 : 0,
            transform: visible ? "translateY(0)" : "translateY(20px)",
            transition: "opacity 0.7s ease-out, transform 0.7s ease-out",
          }}
        >
          <div
            style={{
              fontSize: 11,
              fontWeight: 600,
              textTransform: "uppercase" as const,
              letterSpacing: S.lsLabel,
              color: B.teal,
              marginBottom: 24,
            }}
          >
            Income Stability Score&trade;
          </div>

          <h1
            style={{
              fontSize: mobile ? 32 : 52,
              fontFamily: DISPLAY_FONT,
              fontWeight: 400,
              letterSpacing: S.lsHero,
              lineHeight: S.lhHeading,
              color: B.cream,
              marginBottom: S.h1mb,
            }}
          >
            Know your number.<br />Then change it.
          </h1>

          <p
            style={{
              fontSize: mobile ? 15 : 17,
              lineHeight: S.lhBody,
              color: "rgba(244,241,234,0.60)",
              maxWidth: 480,
              margin: "0 auto 32px",
            }}
          >
            Your Income Stability Score tells you how protected your income actually is. The full report shows you exactly what to do about it — with an interactive simulator, ready-to-send scripts, and tradeoff analysis.
          </p>

          <div style={{ display: "flex", justifyContent: "center", gap: 24, flexWrap: "wrap" as const }}>
            {["Under 2 minutes", "No bank connection", "Full refund guarantee"].map((t) => (
              <span key={t} style={{ fontSize: 12, color: "rgba(244,241,234,0.35)", letterSpacing: "0.02em" }}>{t}</span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}


/* ================================================================== */
/* 2. PRICING CARDS — The centerpiece                                  */
/* ================================================================== */
function FreeCard({ visible, mobile, delay }: { visible: boolean; mobile: boolean; delay: number }) {
  const [hovered, setHovered] = useState(false);

  const features = [
    "Your score out of 100",
    "Your stability band",
    "Your peer percentile",
    "One key insight about your income",
  ];

  return (
    <div
      onMouseEnter={() => canHover() && setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        position: "relative",
        background: "#FFFFFF",
        borderRadius: S.cardRadius,
        border: "1px solid rgba(14,26,43,0.06)",
        padding: mobile ? "32px 28px" : "40px",
        boxShadow: hovered ? "0 12px 32px rgba(14,26,43,0.08)" : "0 4px 16px rgba(14,26,43,0.04)",
        transition: "opacity 700ms ease, transform 700ms ease, box-shadow 260ms ease",
        opacity: visible ? 1 : 0,
        transform: visible ? hovered ? "translateY(-4px)" : "translateY(0)" : "translateY(28px)",
        transitionDelay: `${delay}ms`,
        display: "flex",
        flexDirection: "column" as const,
      }}
    >
      <div style={{ fontSize: 11, fontWeight: 600, textTransform: "uppercase" as const, letterSpacing: "0.10em", color: B.teal, marginBottom: 20 }}>
        Free Score
      </div>

      <div style={{ display: "flex", alignItems: "baseline", gap: 8, marginBottom: 4 }}>
        <span style={{ fontSize: 52, fontWeight: 600, color: B.navy, lineHeight: 1 }}>$0</span>
        <span style={{ fontSize: 14, color: B.muted }}>always free</span>
      </div>

      <div style={{ height: 1, background: "rgba(14,26,43,0.06)", margin: "24px 0" }} />

      <div style={{ flex: 1, marginBottom: 32 }}>
        {features.map((f) => (
          <div key={f} style={{ display: "flex", gap: 12, alignItems: "flex-start", marginBottom: 14 }}>
            <div style={{ width: 6, height: 6, borderRadius: "50%", backgroundColor: B.teal, flexShrink: 0, marginTop: 7 }} />
            <span style={{ fontSize: 14, color: B.muted, lineHeight: 1.6 }}>{f}</span>
          </div>
        ))}
      </div>

      <Link
        href="/begin"
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          height: S.ctaH,
          borderRadius: S.ctaRadius,
          background: "#FFFFFF",
          color: B.navy,
          fontSize: 15,
          fontWeight: 600,
          textDecoration: "none",
          letterSpacing: "0.01em",
          border: `1px solid ${B.navy}`,
          transition: "background 200ms ease, color 200ms ease",
          ...(hovered ? { background: B.navy, color: "#FFFFFF" } : {}),
        }}
      >
        Get My Free Score
      </Link>

      <p style={{ fontSize: 12, color: B.light, textAlign: "center", marginTop: 14, marginBottom: 0 }}>
        Under 2 minutes &middot; No bank connection
      </p>
    </div>
  );
}

function FullReportCard({ visible, mobile, delay }: { visible: boolean; mobile: boolean; delay: number }) {
  const [hovered, setHovered] = useState(false);

  const features = [
    "Everything in Free, plus:",
    "What happens if things change? — answer that question with your real numbers, in real time",
    "Income runway calculator — days of income if you stop working",
    "Risk scenarios with score-drop projections",
    "Action plan with specific timeframes, targets, and tradeoffs",
    "Ready-to-use scripts (retainer pitch, client outreach, pricing restructure)",
    "Predictive warnings — mistakes you are likely to make next",
    "6 structural indicators, fragility, and cross-factor effects",
    "Peer comparison with actual numbers + advisor discussion guide",
  ];

  return (
    <div
      onMouseEnter={() => canHover() && setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        position: "relative",
        background: B.navy,
        borderRadius: S.panelRadius,
        padding: mobile ? "36px 28px" : "48px 40px",
        boxShadow: hovered
          ? "0 24px 56px rgba(14,26,43,0.30), 0 4px 12px rgba(14,26,43,0.10)"
          : "0 12px 40px rgba(14,26,43,0.20), 0 2px 8px rgba(14,26,43,0.08)",
        transition: "opacity 700ms ease, transform 700ms ease, box-shadow 260ms ease",
        opacity: visible ? 1 : 0,
        transform: visible ? hovered ? "translateY(-4px)" : "translateY(0)" : "translateY(28px)",
        transitionDelay: `${delay}ms`,
        display: "flex",
        flexDirection: "column" as const,
        overflow: "hidden",
      }}
    >
      {/* Ambient glow inside card */}
      <div style={{ position: "absolute", top: "-30%", right: "-20%", width: 300, height: 300, borderRadius: "50%", background: "radial-gradient(circle, rgba(75,63,174,0.15) 0%, transparent 70%)", pointerEvents: "none" }} />

      {/* Recommended badge */}
      <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 3, background: `linear-gradient(90deg, ${B.purple}, ${B.teal})` }} />

      <div style={{ position: "relative" }}>
        <div style={{ display: "inline-block", padding: "4px 12px", borderRadius: 4, background: "rgba(75,63,174,0.20)", marginBottom: 16 }}>
          <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.10em", textTransform: "uppercase" as const, color: B.teal }}>Most Popular</span>
        </div>

        <div style={{ fontSize: 11, fontWeight: 600, textTransform: "uppercase" as const, letterSpacing: "0.10em", color: "rgba(244,241,234,0.40)", marginBottom: 16 }}>
          Complete Assessment
        </div>

        <div style={{ display: "flex", alignItems: "baseline", gap: 8, marginBottom: 4 }}>
          <span style={{ fontSize: 56, fontWeight: 600, color: "#F4F1EA", lineHeight: 1 }}>$99</span>
          <span style={{ fontSize: 14, color: "rgba(244,241,234,0.45)" }}>one-time</span>
        </div>
      </div>

      <div style={{ height: 1, background: "rgba(244,241,234,0.08)", margin: "24px 0", position: "relative" }} />

      <div style={{ flex: 1, marginBottom: 32, position: "relative" }}>
        {features.map((f, i) => (
          <div key={f} style={{ display: "flex", gap: 12, alignItems: "flex-start", marginBottom: 12 }}>
            <div style={{ width: 5, height: 5, borderRadius: "50%", backgroundColor: i === 0 ? "transparent" : B.teal, flexShrink: 0, marginTop: 7 }} />
            <span style={{ fontSize: 14, color: i === 0 ? "#F4F1EA" : "rgba(244,241,234,0.55)", lineHeight: 1.55, fontWeight: i === 0 ? 600 : 400 }}>{f}</span>
          </div>
        ))}
      </div>

      <a
        href={STRIPE.single}
        target="_blank"
        rel="noopener noreferrer"
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          height: S.ctaH,
          borderRadius: S.ctaRadius,
          background: "linear-gradient(135deg, #F4F1EA 0%, #E8E5DD 100%)",
          color: B.navy,
          fontSize: 15,
          fontWeight: 600,
          textDecoration: "none",
          letterSpacing: "-0.01em",
          boxShadow: hovered ? "0 12px 32px rgba(0,0,0,0.30)" : "0 8px 24px rgba(0,0,0,0.20)",
          transition: "box-shadow 260ms ease, transform 200ms ease",
          transform: hovered ? "translateY(-2px)" : "translateY(0)",
          position: "relative",
        }}
      >
        Get Full Report — $99
      </a>

      <p style={{ fontSize: 12, color: "rgba(244,241,234,0.35)", textAlign: "center", marginTop: 14, marginBottom: 0, position: "relative" }}>
        If it doesn&apos;t reveal something new, full refund. No questions.
      </p>
    </div>
  );
}

function PricingCards() {
  const { ref, visible } = useInView();
  const mobile = useMobile();

  return (
    <section
      ref={ref}
      aria-label="Pricing Plans"
      style={{
        background: B.offWhite,
        paddingTop: mobile ? S.sectionY.mobile : S.sectionY.desktop,
        paddingBottom: mobile ? S.sectionY.mobile : S.sectionY.desktop,
        position: "relative",
      }}
    >
      {/* Subtle top gradient bleed from hero */}
      <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 120, background: "linear-gradient(180deg, rgba(14,26,43,0.03) 0%, transparent 100%)", pointerEvents: "none" }} />

      <div
        style={{
          maxWidth: S.maxW,
          marginLeft: "auto",
          marginRight: "auto",
          paddingLeft: mobile ? S.padX.mobile : S.padX.desktop,
          paddingRight: mobile ? S.padX.mobile : S.padX.desktop,
          position: "relative",
        }}
      >
        {/* Social proof strip */}
        <div style={{
          textAlign: "center", marginBottom: mobile ? 32 : 48,
          opacity: visible ? 1 : 0, transition: "opacity 600ms ease-out",
        }}>
          <p style={{ fontSize: 14, color: B.muted, margin: 0, lineHeight: 1.6 }}>
            Trusted by freelancers, contractors, and business owners across 18 industries.
            <span style={{ color: B.teal, fontWeight: 600 }}> Average assessment time: 1 minute 47 seconds.</span>
          </p>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: mobile ? "1fr" : "5fr 7fr",
            gap: mobile ? 16 : 24,
            maxWidth: 820,
            margin: "0 auto",
            alignItems: "start",
          }}
        >
          <FreeCard visible={visible} mobile={mobile} delay={0} />
          <FullReportCard visible={visible} mobile={mobile} delay={120} />
        </div>

        {/* Urgency + scarcity — psychological conversion */}
        <div style={{
          textAlign: "center", marginTop: mobile ? 32 : 48,
          opacity: visible ? 1 : 0, transition: "opacity 600ms ease-out 400ms",
        }}>
          <p style={{ fontSize: 13, color: B.light, margin: 0 }}>
            Your score is calculated the moment you finish. No waiting. No follow-up calls. Instant results.
          </p>
        </div>
      </div>
    </section>
  );
}


/* ================================================================== */
/* 3. WHAT'S INCLUDED — Clean inventory                                */
/* ================================================================== */
function WhatsIncluded() {
  const { ref, visible } = useInView();
  const mobile = useMobile();

  const items = [
    {
      num: "01",
      title: "Your Score",
      desc: "Your score, stability band, the single most important thing to fix, and what it means in plain English — with your actual numbers, not vague labels.",
      accent: B.purple,
    },
    {
      num: "02",
      title: "How Your Income Is Built",
      desc: "Income structure breakdown (active vs. recurring vs. passive), stress test, continuity window, and peer comparison with actual industry numbers.",
      accent: B.teal,
    },
    {
      num: "03",
      title: "Your Biggest Risks",
      desc: "The scenarios that would hurt you most — ranked by severity with exact score drops. Plus predictive warnings about mistakes you are likely to make next.",
      accent: B.purple,
    },
    {
      num: "04",
      title: "Your Income Deep Dive",
      desc: "Six structural indicators scored, fragility classified, cross-factor effects explained, surprising insights surfaced, and your income system mapped visually.",
      accent: B.teal,
    },
    {
      num: "05",
      title: "Your Action Plan",
      desc: "Prioritized actions with specific timeframes and targets, tradeoff analysis for each move, ready-to-use scripts, and your reassessment date.",
      accent: B.purple,
    },
  ];

  return (
    <section
      ref={ref}
      aria-label="What Every Assessment Delivers"
      style={{
        backgroundColor: B.sand,
        paddingTop: mobile ? S.sectionY.mobile : S.sectionY.desktop,
        paddingBottom: mobile ? S.sectionY.mobile : S.sectionY.desktop,
      }}
    >
      <div
        style={{
          maxWidth: S.maxW,
          marginLeft: "auto",
          marginRight: "auto",
          paddingLeft: mobile ? S.padX.mobile : S.padX.desktop,
          paddingRight: mobile ? S.padX.mobile : S.padX.desktop,
        }}
      >
        <div
          style={{
            textAlign: "center",
            marginBottom: S.subtextMb,
            opacity: visible ? 1 : 0,
            transform: visible ? "translateY(0)" : "translateY(12px)",
            transition: "opacity 0.5s ease-out, transform 0.5s ease-out",
          }}
        >
          <h2
            style={{
              fontSize: mobile ? 28 : 40,
              color: B.navy,
              fontFamily: DISPLAY_FONT,
              fontWeight: 400,
              letterSpacing: S.lsHeading,
              lineHeight: S.lhHeading,
              marginBottom: 12,
            }}
          >
            What every assessment delivers
          </h2>
          <p
            style={{
              fontSize: 16,
              color: B.muted,
              lineHeight: S.lhBody,
              maxWidth: 560,
              marginLeft: "auto",
              marginRight: "auto",
            }}
          >
            Every assessment delivers the full report, interactive simulator, and ready-to-use action tools. Nothing is withheld.
          </p>
        </div>

        <div style={{ maxWidth: 600, margin: "0 auto" }}>
          {items.map((item, i) => (
            <div
              key={item.num}
              style={{
                display: "flex",
                gap: mobile ? 16 : 24,
                alignItems: "flex-start",
                paddingLeft: 20,
                borderLeft: `3px solid ${item.accent}`,
                marginBottom: i < items.length - 1 ? 32 : 0,
                opacity: visible ? 1 : 0,
                transform: visible ? "translateY(0)" : "translateY(10px)",
                transition: `opacity 0.5s ease-out ${i * 80}ms, transform 0.5s ease-out ${i * 80}ms`,
              }}
            >
              <span
                style={{
                  fontSize: mobile ? 28 : 36,
                  fontWeight: 600,
                  color: "rgba(14,26,43,0.06)",
                  lineHeight: 1,
                  flexShrink: 0,
                  minWidth: mobile ? 36 : 44,
                }}
              >
                {item.num}
              </span>
              <div>
                <div
                  style={{
                    fontSize: 15,
                    fontWeight: 600,
                    color: B.navy,
                    marginBottom: 4,
                  }}
                >
                  {item.title}
                </div>
                <p
                  style={{
                    fontSize: 14,
                    color: B.muted,
                    lineHeight: 1.65,
                    margin: 0,
                  }}
                >
                  {item.desc}
                </p>
              </div>
            </div>
          ))}
        </div>

        <div
          style={{
            textAlign: "center",
            marginTop: 48,
            opacity: visible ? 1 : 0,
            transition: "opacity 0.5s ease-out 400ms",
          }}
        >
          <Link
            href="/sample-report"
            style={{
              fontSize: 14,
              fontWeight: 600,
              color: B.purple,
              textDecoration: "none",
              letterSpacing: "0.01em",
            }}
          >
            View the sample report &rarr;
          </Link>
        </div>
      </div>
    </section>
  );
}


/* ================================================================== */
/* 4. TRUST STRIP — Elegant badges                                     */
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
        backgroundColor: "#FFFFFF",
        paddingTop: mobile ? 48 : 80,
        paddingBottom: mobile ? 48 : 80,
      }}
    >
      <div
        style={{
          maxWidth: S.maxW,
          marginLeft: "auto",
          marginRight: "auto",
          paddingLeft: mobile ? S.padX.mobile : S.padX.desktop,
          paddingRight: mobile ? S.padX.mobile : S.padX.desktop,
        }}
      >
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
                backgroundColor: B.sand,
                border: `1px solid ${B.border}`,
              }}
            >
              <div
                style={{
                  width: 6,
                  height: 6,
                  borderRadius: "50%",
                  background: B.gradient,
                }}
              />
              <span
                style={{
                  fontSize: 13,
                  color: B.navy,
                  fontWeight: 600,
                  letterSpacing: "0.02em",
                }}
              >
                {badge}
              </span>
            </div>
          ))}
        </div>
        <p
          style={{
            textAlign: "center",
            marginTop: 28,
            fontSize: 13,
            color: B.muted,
            lineHeight: 1.6,
            opacity: visible ? 1 : 0,
            transition: "opacity 0.5s ease-out 200ms",
          }}
        >
          If the report doesn&#8217;t tell you something you didn&#8217;t already know, <Link href="/contact" style={{ color: B.teal, textDecoration: "underline", textUnderlineOffset: 3 }}>contact us</Link> for a full refund.
        </p>
      </div>
    </section>
  );
}


/* ================================================================== */
/* 5. FAQ — Clean accordion                                            */
/* ================================================================== */
function Faq() {
  const { ref, visible } = useInView();
  const mobile = useMobile();
  const [openIdx, setOpenIdx] = useState<number | null>(null);

  const faqs = [
    {
      q: "What\u2019s the difference between Free and the Full Report?",
      a: "Free gives you your score out of 100, your stability band, peer percentile, and one key insight. The $99 Full Report adds an interactive score simulator with 5 sliders, income runway calculator, risk scenarios with exact score drops, an action plan with specific targets and timelines, ready-to-use scripts you can send tomorrow, tradeoff analysis, predictive warnings, 6 structural indicators, and an advisor discussion guide.",
    },
    {
      q: "What is your refund policy?",
      a: "Full refund within 30 days if the report does not reveal at least one insight you did not already know. Visit our contact page with your record ID. No questions asked. Refunds are processed within 3 business days to the original payment method.",
    },
    {
      q: "Is my information confidential?",
      a: "Yes. We never collect financial account data, bank credentials, or credit information. The assessment is generated entirely from your responses. Your data is encrypted, never sold, and you can request deletion at any time. See our privacy policy for full details.",
    },
    {
      q: "Who is this for?",
      a: "Anyone whose income does not come from a single predictable paycheck \u2014 freelancers, contractors, business owners, commissioned professionals, consultants, creators, and anyone with variable or multi-source income. The model evaluates income structure, not income amount.",
    },
    {
      q: "How long does it take?",
      a: "Under two minutes. Your free score is delivered instantly. The full report generates immediately after purchase \u2014 no waiting, no follow-up calls.",
    },
    {
      q: "How is the score calculated?",
      a: "The scoring engine evaluates six structural dimensions \u2014 recurrence, concentration, forward visibility, variability, labor dependence, and income quality \u2014 through a deterministic 20-engine pipeline. Same inputs always produce the same score. Full methodology at runpayway.com/methodology.",
    },
    {
      q: "Can I retake the assessment?",
      a: "Yes. Each assessment is independent. Retake after a meaningful structural change \u2014 new client, new retainer, lost source \u2014 to see how your score has moved. Your report includes a recommended reassessment date.",
    },
    {
      q: "Can I share the report with my advisor or lender?",
      a: "Yes. Every report includes a QR-verified record ID, model version stamp, and a shareable score card. You can download your report, copy the verification link, or email it directly to anyone from within the report.",
    },
  ];

  return (
    <section
      ref={ref}
      aria-label="Frequently Asked Questions"
      style={{
        backgroundColor: B.sand,
        paddingTop: mobile ? S.sectionY.mobile : S.sectionY.desktop,
        paddingBottom: mobile ? S.sectionY.mobile : S.sectionY.desktop,
      }}
    >
      <div
        style={{
          maxWidth: S.maxW,
          marginLeft: "auto",
          marginRight: "auto",
          paddingLeft: mobile ? S.padX.mobile : S.padX.desktop,
          paddingRight: mobile ? S.padX.mobile : S.padX.desktop,
        }}
      >
        <div
          style={{
            textAlign: "center",
            marginBottom: S.subtextMb,
            opacity: visible ? 1 : 0,
            transform: visible ? "translateY(0)" : "translateY(12px)",
            transition: "opacity 0.5s ease-out, transform 0.5s ease-out",
          }}
        >
          <h2
            style={{
              fontSize: mobile ? 28 : 36,
              color: B.navy,
              fontFamily: DISPLAY_FONT,
              fontWeight: 400,
              letterSpacing: S.lsHeading,
            }}
          >
            Common questions
          </h2>
        </div>

        <div style={{ maxWidth: 680, margin: "0 auto" }}>
          {faqs.map((faq, i) => (
            <div
              key={i}
              style={{
                borderTop: "1px solid rgba(14,26,43,0.06)",
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
                <span
                  style={{
                    fontSize: 15,
                    fontWeight: 600,
                    color: B.navy,
                    paddingRight: 16,
                  }}
                >
                  {faq.q}
                </span>
                <span
                  style={{
                    fontSize: 20,
                    color: B.light,
                    flexShrink: 0,
                    transition: "transform 200ms ease",
                    transform: openIdx === i ? "rotate(45deg)" : "rotate(0)",
                  }}
                >
                  +
                </span>
              </button>
              <div
                style={{
                  maxHeight: openIdx === i ? 300 : 0,
                  overflow: "hidden",
                  transition: "max-height 300ms ease",
                }}
              >
                <p
                  style={{
                    fontSize: 14,
                    color: B.muted,
                    lineHeight: S.lhBody,
                    paddingBottom: 24,
                    margin: 0,
                  }}
                >
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
/* 6. FINAL CTA — Dark gradient, final push                            */
/* ================================================================== */
function FinalCta() {
  const { ref, visible } = useInView();
  const mobile = useMobile();
  const [hovered, setHovered] = useState(false);

  return (
    <section
      ref={ref}
      aria-label="Final CTA"
      style={{
        position: "relative",
        background: "linear-gradient(135deg, #0E1A2B 0%, #1A1540 50%, #4B3FAE 100%)",
        paddingTop: mobile ? 100 : 160,
        paddingBottom: mobile ? 100 : 160,
        overflow: "hidden",
      }}
    >
      {/* Centered radial glow */}
      <div
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: mobile ? 350 : 600,
          height: mobile ? 350 : 600,
          borderRadius: "50%",
          background:
            "radial-gradient(circle, rgba(75,63,174,0.20) 0%, transparent 70%)",
          pointerEvents: "none",
        }}
      />

      <div
        style={{
          position: "relative",
          zIndex: 1,
          maxWidth: S.maxW,
          marginLeft: "auto",
          marginRight: "auto",
          paddingLeft: mobile ? S.padX.mobile : S.padX.desktop,
          paddingRight: mobile ? S.padX.mobile : S.padX.desktop,
        }}
      >
        <div
          style={{
            textAlign: "center",
            opacity: visible ? 1 : 0,
            transform: visible ? "translateY(0)" : "translateY(16px)",
            transition: "opacity 0.6s ease-out, transform 0.6s ease-out",
          }}
        >
          <h2
            style={{
              fontSize: mobile ? 28 : 40,
              fontFamily: DISPLAY_FONT,
              fontWeight: 400,
              letterSpacing: S.lsHeading,
              lineHeight: S.lhHeading,
              color: B.cream,
              marginBottom: S.h2mb,
            }}
          >
            See where your income stands.
          </h2>

          <p
            style={{
              fontSize: 16,
              color: "rgba(244,241,234,0.70)",
              lineHeight: S.lhBody,
              maxWidth: 480,
              marginLeft: "auto",
              marginRight: "auto",
              marginBottom: 40,
            }}
          >
            Under two minutes. Full structural diagnosis. Instant delivery.
          </p>

          <Link
            href="/begin"
            onMouseEnter={() => canHover() && setHovered(true)}
            onMouseLeave={() => setHovered(false)}
            style={{
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              height: mobile ? S.ctaHsm : S.ctaH,
              paddingLeft: 36,
              paddingRight: 36,
              borderRadius: S.ctaRadius,
              background: B.cream,
              color: B.navy,
              fontSize: 15,
              fontWeight: 600,
              textDecoration: "none",
              letterSpacing: "0.01em",
              boxShadow: hovered
                ? "0 8px 24px rgba(0,0,0,0.20)"
                : "0 4px 16px rgba(0,0,0,0.12)",
              transition: "box-shadow 260ms ease, transform 200ms ease",
              transform: hovered ? "translateY(-2px)" : "translateY(0)",
            }}
          >
            Get My Free Score
          </Link>

          <p
            style={{
              fontSize: 12,
              color: "rgba(244,241,234,0.40)",
              marginTop: 24,
              marginBottom: 0,
            }}
          >
            Model RP-2.0 &middot; No bank connection &middot; Private by default
          </p>
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
      <WhatsIncluded />
      <TrustStrip />
      <Faq />
      <FinalCta />
    </div>
  );
}
