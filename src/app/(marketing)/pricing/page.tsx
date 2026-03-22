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
  sand: "#F4F1EA",
  sandDk: "#F4F1EA",
  offWhite: "#FFFFFF",
  muted: "rgba(14,26,43,0.58)",
  light: "rgba(14,26,43,0.42)",
  border: "rgba(14,26,43,0.12)",
  gradient:
    "linear-gradient(135deg, #0E1A2B 0%, #1A1540 40%, #4B3FAE 70%, #1F6D7A 100%)",
  cream: "#F4F1EA",
};

const S = {
  sectionY: { desktop: 120, mobile: 80 },
  sectionYsm: { desktop: 100, mobile: 64 },
  maxW: 1060,
  padX: { desktop: 48, mobile: 24 },
  h1mb: 20,
  h2mb: 20,
  subtextMb: 44,
  cardRadius: 12,
  ctaH: 52,
  ctaHsm: 44,
  ctaRadius: 12,
  lhHeading: 1.12,
  lhBody: 1.65,
  lsHeading: "-0.02em",
  lsHero: "-0.03em",
  lsLabel: "0.12em",
};

/* ------------------------------------------------------------------ */
/*  Stripe payment links                                               */
/* ------------------------------------------------------------------ */

const STRIPE = {
  single: "https://buy.stripe.com/14A28j48E2socZQa2Z2Nq02",
  annual: "https://buy.stripe.com/aFacMXdJe2so7Fw7UR2Nq03",
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
        paddingTop: mobile ? 100 : 140,
        paddingBottom: mobile ? 64 : 96,
        overflow: "hidden",
      }}
    >
      <style>{`@import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display&display=swap');`}</style>
      {/* Radial glow */}
      <div
        style={{
          position: "absolute",
          top: "40%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: mobile ? 400 : 700,
          height: mobile ? 400 : 700,
          borderRadius: "50%",
          background:
            "radial-gradient(circle, rgba(75,63,174,0.25) 0%, transparent 70%)",
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
              fontSize: mobile ? 32 : 48,
              fontFamily: DISPLAY_FONT,
              fontWeight: 400,
              letterSpacing: S.lsHero,
              lineHeight: S.lhHeading,
              color: B.cream,
              marginBottom: S.h1mb,
            }}
          >
            Know exactly where your income stands.
          </h1>

          <p
            style={{
              fontSize: 17,
              lineHeight: S.lhBody,
              color: "rgba(244,241,234,0.75)",
              maxWidth: 560,
              marginLeft: "auto",
              marginRight: "auto",
              margin: "0 auto",
            }}
          >
            A five-page diagnostic report that shows your score, explains what it means, reveals your biggest risks, and gives you a clear path to stronger protection.
          </p>
        </div>
      </div>
    </section>
  );
}


/* ================================================================== */
/* 2. PRICING CARDS — The centerpiece                                  */
/* ================================================================== */
function SingleCard({ visible, mobile, delay }: { visible: boolean; mobile: boolean; delay: number }) {
  const [hovered, setHovered] = useState(false);

  const features = [
    "Five-page diagnostic report",
    "Score, interpretation, risks, improvements, and next steps",
    "Personalized to your name and industry",
    "Verified, shareable score card",
    "Instant digital delivery",
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
        boxShadow: hovered
          ? "0 12px 32px rgba(14,26,43,0.08)"
          : "0 4px 16px rgba(14,26,43,0.04)",
        transition: "opacity 700ms ease, transform 700ms ease, box-shadow 260ms ease",
        opacity: visible ? 1 : 0,
        transform: visible
          ? hovered
            ? "translateY(-4px)"
            : "translateY(0)"
          : "translateY(28px)",
        transitionDelay: `${delay}ms`,
        display: "flex",
        flexDirection: "column" as const,
      }}
    >
      <div
        style={{
          fontSize: 11,
          fontWeight: 600,
          textTransform: "uppercase" as const,
          letterSpacing: "0.10em",
          color: B.teal,
          marginBottom: 20,
        }}
      >
        Single Assessment
      </div>

      <div style={{ display: "flex", alignItems: "baseline", gap: 8, marginBottom: 4 }}>
        <span style={{ fontSize: 52, fontWeight: 600, color: B.navy, lineHeight: 1 }}>
          $39
        </span>
        <span style={{ fontSize: 14, color: B.muted }}>one-time</span>
      </div>

      <div
        style={{
          height: 1,
          background: "rgba(14,26,43,0.06)",
          margin: "24px 0",
        }}
      />

      <div style={{ flex: 1, marginBottom: 32 }}>
        {features.map((f) => (
          <div
            key={f}
            style={{
              display: "flex",
              gap: 12,
              alignItems: "flex-start",
              marginBottom: 14,
            }}
          >
            <div
              style={{
                width: 6,
                height: 6,
                borderRadius: "50%",
                backgroundColor: B.teal,
                flexShrink: 0,
                marginTop: 7,
              }}
            />
            <span style={{ fontSize: 14, color: B.muted, lineHeight: 1.6 }}>
              {f}
            </span>
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
          background: B.navy,
          color: "#ffffff",
          fontSize: 15,
          fontWeight: 600,
          textDecoration: "none",
          letterSpacing: "0.01em",
          transition: "background 200ms ease",
          ...(hovered ? { background: "#162236" } : {}),
        }}
      >
        Get My Score
      </a>

      <p
        style={{
          fontSize: 12,
          color: B.light,
          textAlign: "center",
          marginTop: 14,
          marginBottom: 0,
        }}
      >
        Under 2 minutes &middot; No bank connection
      </p>
    </div>
  );
}

function AnnualCard({ visible, mobile, delay }: { visible: boolean; mobile: boolean; delay: number }) {
  const [hovered, setHovered] = useState(false);

  const features = [
    "Everything in Single Assessment",
    "Three full assessments over 12 months",
    "Track structural changes over time",
    "See which improvements moved the score",
    "Includes all Model RP-2.0 updates",
  ];

  return (
    <div
      onMouseEnter={() => canHover() && setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        position: "relative",
        background: "#FFFFFF",
        borderRadius: S.cardRadius,
        border: "1px solid rgba(75,63,174,0.15)",
        padding: mobile ? "32px 28px" : "40px",
        boxShadow: hovered
          ? "0 20px 48px rgba(75,63,174,0.14), 0 4px 12px rgba(14,26,43,0.04), inset 0 0 0 1px rgba(75,63,174,0.04)"
          : "0 8px 32px rgba(75,63,174,0.10), 0 2px 8px rgba(14,26,43,0.04), inset 0 0 0 1px rgba(75,63,174,0.04)",
        transition: "opacity 700ms ease, transform 700ms ease, box-shadow 260ms ease",
        opacity: visible ? 1 : 0,
        transform: visible
          ? hovered
            ? "translateY(-4px)"
            : "translateY(0)"
          : "translateY(28px)",
        transitionDelay: `${delay}ms`,
        display: "flex",
        flexDirection: "column" as const,
      }}
    >
      {/* Recommended badge */}
      <div
        style={{
          position: "absolute",
          top: -14,
          left: "50%",
          transform: "translateX(-50%)",
          padding: "6px 20px",
          borderRadius: 100,
          background: B.purple,
          color: "#FFFFFF",
          fontSize: 11,
          fontWeight: 600,
          letterSpacing: "0.08em",
          textTransform: "uppercase" as const,
          whiteSpace: "nowrap" as const,
        }}
      >
        Recommended
      </div>

      <div
        style={{
          fontSize: 11,
          fontWeight: 600,
          textTransform: "uppercase" as const,
          letterSpacing: "0.10em",
          color: B.teal,
          marginBottom: 20,
        }}
      >
        Annual Monitoring
      </div>

      <div style={{ display: "flex", alignItems: "baseline", gap: 8, marginBottom: 4 }}>
        <span style={{ fontSize: 52, fontWeight: 600, color: B.navy, lineHeight: 1 }}>
          $99
        </span>
        <span style={{ fontSize: 14, color: B.muted }}>
          per year &middot; 3 assessments
        </span>
      </div>

      <div style={{ fontSize: 13, color: B.purple, fontWeight: 500, marginTop: 8 }}>
        Save $18 vs. three single assessments
      </div>

      <div
        style={{
          height: 1,
          background: "rgba(14,26,43,0.06)",
          margin: "24px 0",
        }}
      />

      <div style={{ flex: 1, marginBottom: 32 }}>
        {features.map((f) => (
          <div
            key={f}
            style={{
              display: "flex",
              gap: 12,
              alignItems: "flex-start",
              marginBottom: 14,
            }}
          >
            <div
              style={{
                width: 6,
                height: 6,
                borderRadius: "50%",
                backgroundColor: B.teal,
                flexShrink: 0,
                marginTop: 7,
              }}
            />
            <span style={{ fontSize: 14, color: B.muted, lineHeight: 1.6 }}>
              {f}
            </span>
          </div>
        ))}
      </div>

      <a
        href={STRIPE.annual}
        target="_blank"
        rel="noopener noreferrer"
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          height: S.ctaH,
          borderRadius: S.ctaRadius,
          background: "linear-gradient(135deg, #4B3FAE 0%, #3A2F8E 100%)",
          color: "#ffffff",
          fontSize: 15,
          fontWeight: 600,
          textDecoration: "none",
          letterSpacing: "0.01em",
          boxShadow: hovered
            ? "0 12px 28px rgba(75,63,174,0.30)"
            : "0 4px 16px rgba(75,63,174,0.20)",
          transition: "box-shadow 260ms ease, transform 200ms ease",
          transform: hovered ? "translateY(-1px)" : "translateY(0)",
        }}
      >
        Get Annual Plan
      </a>

      <p
        style={{
          fontSize: 12,
          color: B.light,
          textAlign: "center",
          marginTop: 14,
          marginBottom: 0,
        }}
      >
        Under 2 minutes &middot; No bank connection
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
        backgroundColor: "#FFFFFF",
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
            display: "grid",
            gridTemplateColumns: mobile ? "1fr" : "1fr 1fr",
            gap: 32,
            maxWidth: 780,
            margin: "0 auto",
          }}
        >
          <SingleCard visible={visible} mobile={mobile} delay={0} />
          <AnnualCard visible={visible} mobile={mobile} delay={120} />
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
      desc: "Your score, stability band, peer percentile, and the main thing holding the structure back.",
      accent: B.purple,
    },
    {
      num: "02",
      title: "What This Score Means",
      desc: "What is already working, what is still vulnerable, and a plain-English interpretation.",
      accent: B.teal,
    },
    {
      num: "03",
      title: "Your Biggest Risks",
      desc: "What would happen if your largest source disappeared, how long income would continue, and how you compare to peers.",
      accent: B.purple,
    },
    {
      num: "04",
      title: "How to Raise Your Score",
      desc: "The specific changes that would raise your score the most, with prioritized action steps.",
      accent: B.teal,
    },
    {
      num: "05",
      title: "What to Do Next",
      desc: "A clear action plan, 90-day checklist, when to reassess, and how you compare to the benchmark.",
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
            Both plans include the same 5-page report. Nothing is withheld.
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
          If the report doesn&#8217;t tell you something you didn&#8217;t already know, contact us at support@runpayway.com.
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
      q: "What is the difference between Single and Annual?",
      a: "Single is a one-time assessment. Annual gives you three assessments over 12 months to track structural changes. Both use Model RP-2.0 and produce the same 5-page report.",
    },
    {
      q: "Do you need access to my bank accounts?",
      a: "No. RunPayway\u2122 never connects to a bank, pulls credit, or accesses financial accounts. You answer six questions and the model generates your assessment from those inputs alone.",
    },
    {
      q: "How long does it take?",
      a: "Most people complete the assessment in under two minutes. Your report is delivered instantly.",
    },
    {
      q: "Can I share the report?",
      a: "Yes. Every report includes a verification stamp with model version and record ID. Share it however you choose.",
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
            Get My Income Stability Score&trade;
          </a>

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
