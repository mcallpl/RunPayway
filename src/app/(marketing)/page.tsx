"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";

/* Shared hook: triggers visibility when element enters viewport.
   Checks on mount so elements already in view appear immediately. */
function useInView(threshold = 0) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    /* Already in view on mount? Fire immediately */
    const rect = el.getBoundingClientRect();
    if (rect.top < window.innerHeight + 50 && rect.bottom > 0) {
      setVisible(true);
      return;
    }
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setVisible(true); obs.disconnect(); } },
      { threshold },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);

  return { ref, visible };
}

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

const INDUSTRY_EXAMPLES = [
  {
    industry: "Professional Services: Moving From Project Work to Recurring Revenue",
    stable: [
      "multiple income sources",
      "recurring revenue",
      "forward income commitments",
      "income beyond personal labor",
    ],
    unstable: [
      "reliance on a single source",
      "one-time transactions",
      "unpredictable revenue cycles",
    ],
  },
  {
    industry: "Private Practice: Increasing Revenue Continuity",
    stable: [
      "multiple income sources",
      "recurring revenue",
      "forward income commitments",
      "income beyond personal labor",
    ],
    unstable: [
      "reliance on a single source",
      "one-time transactions",
      "unpredictable revenue cycles",
    ],
  },
  {
    industry: "Agency Owners: Reducing Client Concentration Risk",
    stable: [
      "multiple income sources",
      "recurring revenue",
      "forward income commitments",
      "income beyond personal labor",
    ],
    unstable: [
      "reliance on a single source",
      "one-time transactions",
      "unpredictable revenue cycles",
    ],
  },
];

const FAQ_ITEMS = [
  {
    q: "What does the Income Stability Score™ measure?",
    a: "The score evaluates the structural stability of your income system across six factors — including income persistence, source diversity, and forward revenue visibility. It measures how your income is structured, not how much you earn.",
  },
  {
    q: "How long does the assessment take?",
    a: "The assessment consists of six structured questions and takes under two minutes to complete. Your score and full PDF report are generated instantly upon completion.",
  },
  {
    q: "Is this financial advice?",
    a: "No. The Income Stability Score™ is a structural analytical tool. It does not evaluate investment performance, creditworthiness, or future financial outcomes, and should not be interpreted as financial, tax, legal, or investment advice.",
  },
  {
    q: "Can I retake the assessment?",
    a: "Yes. With the Annual Monitoring plan, you receive three assessments over 12 months to track how your income structure evolves. Single assessments can be purchased at any time.",
  },
  {
    q: "What is included in the report?",
    a: "Your report includes your Income Stability Score™, stability classification, structural indicators, income structure map, system diagnosis, industry benchmark comparison, improvement path, and an official PDF assessment record issued under Model RP-1.0.",
  },
  {
    q: "How is my data handled?",
    a: "Your assessment data is processed securely and used only to generate your report. Payment is handled through Stripe Secure Checkout. We do not sell or share your personal information.",
  },
];


/* ------------------------------------------------------------------ */
/* GLOBAL DISCLAIMER — institutional disclosure                         */
/* ------------------------------------------------------------------ */
function Disclaimer() {
  const { ref, visible } = useInView();

  return (
    <section
      ref={ref}
      aria-label="Global Disclaimer"
      className="relative overflow-hidden"
      style={{ background: "#F4F1EA" }}
    >
      <div
        className="relative mx-auto px-6 md:px-8 lg:px-10"
        style={{
          maxWidth: 920,
          paddingTop: 64,
          paddingBottom: 64,
          opacity: visible ? 1 : 0,
          transform: visible ? "translateY(0)" : "translateY(8px)",
          transition: "opacity 360ms ease-out, transform 360ms ease-out",
        }}
      >
        {/* Structural divider */}
        <div
          style={{
            height: 1,
            width: "100%",
            background: "linear-gradient(90deg, transparent, rgba(14,26,43,0.10), transparent)",
            marginBottom: 36,
          }}
        />

        {/* Label */}
        <h2
          className="font-semibold uppercase text-[11px] md:text-[12px]"
          style={{
            color: B.teal,
            letterSpacing: "0.12em",
            marginBottom: 12,
          }}
        >
          Global Disclaimer
        </h2>

        {/* Disclosure text */}
        <div style={{ maxWidth: 720 }}>
          <p
            className="text-[14px] md:text-[15px]"
            style={{
              color: "rgba(14,26,43,0.75)",
              lineHeight: 1.7,
              marginBottom: 10,
            }}
          >
            The <strong style={{ fontWeight: 500 }}>Income Stability Score™</strong> is a structural income assessment based on information provided by the user.
          </p>
          <p
            className="text-[14px] md:text-[15px]"
            style={{
              color: "rgba(14,26,43,0.75)",
              lineHeight: 1.7,
            }}
          >
            It does not provide financial advice and does not predict future financial outcomes.
          </p>
        </div>
      </div>

      {/* Mobile overrides */}
      <style>{`
        @media (max-width: 768px) {
          section[aria-label="Global Disclaimer"] > div:nth-child(2) {
            padding-top: 48px !important;
            padding-bottom: 48px !important;
            padding-left: 24px !important;
            padding-right: 24px !important;
          }
        }
        @media (min-width: 769px) and (max-width: 1024px) {
          section[aria-label="Global Disclaimer"] > div:nth-child(2) {
            padding-left: 32px !important;
            padding-right: 32px !important;
          }
        }
        @media (prefers-reduced-motion: reduce) {
          section[aria-label="Global Disclaimer"] [style*="transition"] {
            transition: opacity 360ms ease-out !important;
          }
        }
      `}</style>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* FINAL CTA — Premium Assessment Entry                                 */
/* ------------------------------------------------------------------ */
function FinalCta() {
  const { ref, visible } = useInView();

  return (
    <section
      ref={ref}
      aria-label="Get Your Income Stability Score"
      className="relative overflow-hidden navy-grain"
      style={{ background: `linear-gradient(180deg, ${B.navy} 0%, #1A1540 40%, ${B.purple} 100%)` }}
    >
      {/* Ambient glows */}
      <div style={{ position: "absolute", top: "-25%", left: "50%", width: 800, height: 800, borderRadius: "50%", transform: "translateX(-50%)", background: "radial-gradient(circle, rgba(75,63,174,0.14) 0%, transparent 60%)", pointerEvents: "none" }} />

      {/* Concentric scoring halos */}
      <div className="absolute pointer-events-none" style={{ width: 320, height: 320, borderRadius: "50%", border: "1px solid rgba(244,241,234,0.06)", top: "50%", left: "50%", transform: "translate(-50%, -50%)" }} />
      <div className="absolute pointer-events-none" style={{ width: 520, height: 520, borderRadius: "50%", border: "1px solid rgba(244,241,234,0.08)", top: "50%", left: "50%", transform: "translate(-50%, -50%)" }} />
      <div className="absolute pointer-events-none" style={{ width: 720, height: 720, borderRadius: "50%", border: "1px solid rgba(244,241,234,0.04)", top: "50%", left: "50%", transform: "translate(-50%, -50%)" }} />

      <div
        className="relative mx-auto text-center"
        style={{
          maxWidth: 980,
          paddingTop: 156,
          paddingBottom: 156,
          paddingLeft: 40,
          paddingRight: 40,
        }}
      >
        <div
          className="mx-auto md:px-0 sm:px-8 px-6"
          style={{
            maxWidth: 700,
            opacity: visible ? 1 : 0,
            transform: visible ? "translateY(0)" : "translateY(14px)",
            transition: "opacity 520ms ease-out, transform 520ms ease-out",
          }}
        >
          {/* Heading */}
          <h2
            className="font-semibold text-[34px] md:text-[44px] lg:text-[52px]"
            style={{
              color: "#F4F1EA",
              lineHeight: 1.08,
              letterSpacing: "-0.03em",
              maxWidth: 640,
              margin: "0 auto 22px auto",
            }}
          >
            Get Your Income Stability Score™
          </h2>

          {/* Supporting line */}
          <p
            className="text-[17px] md:text-[19px] lg:text-[20px]"
            style={{
              color: "rgba(244,241,234,0.80)",
              lineHeight: 1.7,
              maxWidth: 560,
              margin: "0 auto 42px auto",
            }}
          >
            Measure the stability of your income.
          </p>

          {/* CTA Button */}
          <div className="flex justify-center">
            <a
              href="/pricing"
              className="inline-flex items-center justify-center font-semibold
                         w-full md:w-auto
                         focus:outline-none focus:ring-2 focus:ring-offset-2"
              style={{
                height: 56,
                minWidth: 320,
                paddingLeft: 28,
                paddingRight: 28,
                borderRadius: 16,
                background: "linear-gradient(135deg, #F4F1EA 0%, #EDECEA 100%)",
                color: B.navy,
                fontSize: 16,
                letterSpacing: "-0.01em",
                border: "1px solid rgba(244,241,234,0.92)",
                boxShadow: "inset 0 1px 0 rgba(255,255,255,0.5), 0 12px 32px rgba(0,0,0,0.25), 0 2px 6px rgba(0,0,0,0.15)",
                transition: "background-color 180ms ease, border-color 180ms ease, transform 180ms ease, box-shadow 180ms ease",
                // @ts-expect-error focus ring color
                "--tw-ring-color": B.teal,
              }}
              onMouseEnter={(e) => {
                const t = e.currentTarget;
                t.style.background = "linear-gradient(135deg, #EDECEA 0%, #E5E2DA 100%)";
                t.style.transform = "translateY(-2px)";
                t.style.boxShadow = "inset 0 1px 0 rgba(255,255,255,0.5), 0 16px 40px rgba(0,0,0,0.30), 0 2px 8px rgba(0,0,0,0.18)";
              }}
              onMouseLeave={(e) => {
                const t = e.currentTarget;
                t.style.background = "linear-gradient(135deg, #F4F1EA 0%, #EDECEA 100%)";
                t.style.transform = "translateY(0)";
                t.style.boxShadow = "inset 0 1px 0 rgba(255,255,255,0.5), 0 12px 32px rgba(0,0,0,0.25), 0 2px 6px rgba(0,0,0,0.15)";
              }}
              onMouseDown={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
              }}
            >
              Get My Income Stability Score
            </a>
          </div>

          {/* Pricing anchor */}
          <p
            style={{
              fontWeight: 500,
              fontSize: 16,
              color: "rgba(244,241,234,0.85)",
              marginTop: 14,
              marginBottom: 4,
            }}
          >
            Single Assessment — $39
          </p>

          {/* Microcopy */}
          <p
            className="text-[14px] md:text-[15px]"
            style={{
              color: "rgba(244,241,234,0.66)",
              lineHeight: 1.6,
            }}
          >
            Takes under 2 minutes &bull; Instant results
          </p>
        </div>
      </div>

      {/* Mobile overrides */}
      <style>{`
        @media (max-width: 768px) {
          section[aria-label="Get Your Income Stability Score"] > div:last-of-type {
            padding-top: 120px !important;
            padding-bottom: 120px !important;
            padding-left: 24px !important;
            padding-right: 24px !important;
          }
          section[aria-label="Get Your Income Stability Score"] a {
            min-width: 0 !important;
            height: 54px !important;
          }
        }
        @media (min-width: 769px) and (max-width: 1024px) {
          section[aria-label="Get Your Income Stability Score"] > div:last-of-type {
            padding-left: 32px !important;
            padding-right: 32px !important;
          }
        }
        @media (prefers-reduced-motion: reduce) {
          section[aria-label="Get Your Income Stability Score"] [style*="transition"] {
            transition: opacity 520ms ease-out !important;
          }
        }
      `}</style>

      {/* Bottom wave transition */}
      <div className="absolute bottom-0 left-0 right-0" style={{ transform: "translateY(99%)" }}>
        <svg viewBox="0 0 1440 80" preserveAspectRatio="none" style={{ display: "block", width: "100%", height: 80 }}>
          <path d="M0,0 L0,40 Q360,80 720,40 Q1080,0 1440,40 L1440,0 Z" fill={B.purple} />
        </svg>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* MODEL GOVERNANCE — scroll-reveal section                             */
/* ------------------------------------------------------------------ */
function ModelGovernance() {
  const { ref, visible } = useInView();

  return (
    <section
      ref={ref}
      style={{
        backgroundColor: "#F4F1EA",
        paddingTop: 228,
        paddingBottom: 148,
        position: "relative",
        overflow: "hidden",
      }}
    >
      <div className="max-w-[980px] mx-auto px-6 md:px-10" style={{ position: "relative", zIndex: 1 }}>
        {/* Title + text */}
        <div
          style={{
            opacity: visible ? 1 : 0,
            transform: visible ? "translateY(0)" : "translateY(12px)",
            transition: "opacity 0.48s ease-out, transform 0.48s ease-out",
          }}
        >
          <h2
            className="text-[32px] md:text-[40px]"
            style={{
              color: B.navy,
              fontWeight: 600,
              lineHeight: 1.12,
              letterSpacing: "-0.02em",
              marginBottom: 32,
            }}
          >
            Model Governance
          </h2>

          <div style={{ maxWidth: 640 }}>
            <p className="text-[16px] md:text-[18px]" style={{ color: "rgba(14,26,43,0.80)", fontWeight: 400, lineHeight: 1.75, marginBottom: 18 }}>
              RunPayway Model <span style={{ fontWeight: 500, color: B.purple }}>RP-1.0</span> defines the scoring framework.
            </p>
            <p className="text-[16px] md:text-[18px]" style={{ color: "rgba(14,26,43,0.80)", fontWeight: 400, lineHeight: 1.75, marginBottom: 18 }}>
              The scoring model, classification scale, and factor definitions are versioned to maintain consistency.
            </p>
            <p className="text-[16px] md:text-[18px]" style={{ color: "rgba(14,26,43,0.80)", fontWeight: 400, lineHeight: 1.75 }}>
              Future updates are released as new model versions.
            </p>
            <p
              style={{
                fontWeight: 400,
                fontSize: 15,
                color: "rgba(14,26,43,0.70)",
                marginTop: 18,
              }}
            >
              Assessments currently run under Model RP-1.0.
            </p>
          </div>
        </div>

        {/* Governance reference panel */}
        <article
          style={{
            marginTop: 36,
            width: "100%",
            maxWidth: 420,
            backgroundColor: "#ffffff",
            border: "1px solid rgba(14,26,43,0.10)",
            borderRadius: 18,
            padding: 28,
            boxShadow: "inset 0 1px 0 rgba(255,255,255,0.8), 0 16px 44px rgba(14,26,43,0.08), 0 2px 8px rgba(14,26,43,0.03)",
            opacity: visible ? 1 : 0,
            transform: visible ? "translateY(0)" : "translateY(14px)",
            transition: "opacity 0.48s ease-out 80ms, transform 0.48s ease-out 80ms",
          }}
        >
          {/* Top accent */}
          <div style={{ width: "100%", height: 2, background: "linear-gradient(90deg, #4B3FAE 0%, transparent 60%)", borderRadius: 2, marginBottom: 16 }} />

          {/* Panel header */}
          <div
            className="text-[12px] uppercase"
            style={{ color: B.teal, fontWeight: 500, letterSpacing: "0.12em", marginBottom: 10 }}
          >
            Model Version
          </div>

          {/* Version value */}
          <div
            className="text-[24px] md:text-[28px]"
            style={{ color: B.purple, fontWeight: 600, letterSpacing: "0.01em", marginBottom: 14 }}
          >
            RP-1.0
          </div>

          {/* Supporting line */}
          <p className="text-[15px]" style={{ color: "rgba(14,26,43,0.70)", fontWeight: 400, lineHeight: 1.6 }}>
            Scoring framework currently in use.
          </p>
        </article>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* FAQ — Premium Financial Documentation                                */
/* ------------------------------------------------------------------ */
function FaqSection({ openFaq, setOpenFaq }: { openFaq: number | null; setOpenFaq: (v: number | null) => void }) {
  const { ref, visible } = useInView();

  const faqItems = [
    {
      q: "What does the Income Stability Score\u2122 measure?",
      a: "The score evaluates the structural stability of your income system across six factors — including income persistence, source diversity, and forward revenue visibility. It measures how your income is structured, not how much you earn.",
    },
    {
      q: "How long does the assessment take?",
      a: "The assessment consists of six structured questions and takes under two minutes to complete. Your score and full PDF report are generated instantly upon completion.",
    },
    {
      q: "What is included in the report?",
      a: "Your report includes your Income Stability Score\u2122, stability classification, structural indicators, income structure map, system diagnosis, industry benchmark comparison, improvement path, and an official PDF assessment record issued under Model RP-1.0.",
    },
    {
      q: "Can I retake the assessment?",
      a: "Yes. With the Annual Monitoring plan, you receive three assessments over 12 months to track how your income structure evolves. Single assessments can be purchased at any time.",
    },
    {
      q: "How is my data handled?",
      a: "Your assessment data is processed securely and used only to generate your report. Payment is handled through Stripe Secure Checkout. We do not sell or share your personal information.",
    },
  ];

  return (
    <section
      ref={ref}
      className="relative overflow-hidden navy-grain"
      style={{
        backgroundColor: B.navy,
        paddingTop: 152,
        paddingBottom: 152,
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Top wave transition */}
      <div className="absolute top-0 left-0 right-0" style={{ transform: "translateY(-99%)" }}>
        <svg viewBox="0 0 1440 80" preserveAspectRatio="none" style={{ display: "block", width: "100%", height: 80 }}>
          <path d="M0,80 L0,40 Q360,0 720,40 Q1080,80 1440,40 L1440,80 Z" fill="#0E1A2B" />
        </svg>
      </div>

      {/* Bottom wave transition */}
      <div className="absolute bottom-0 left-0 right-0" style={{ transform: "translateY(99%)" }}>
        <svg viewBox="0 0 1440 80" preserveAspectRatio="none" style={{ display: "block", width: "100%", height: 80 }}>
          <path d="M0,0 L0,40 Q360,80 720,40 Q1080,0 1440,40 L1440,0 Z" fill="#0E1A2B" />
        </svg>
      </div>

      {/* Ambient glows */}
      <div style={{ position: "absolute", top: "-20%", right: "-10%", width: 600, height: 600, borderRadius: "50%", background: "radial-gradient(circle, rgba(75,63,174,0.07) 0%, transparent 65%)", pointerEvents: "none" }} />
      <div style={{ position: "absolute", bottom: "-15%", left: "-8%", width: 500, height: 500, borderRadius: "50%", background: "radial-gradient(circle, rgba(31,109,122,0.05) 0%, transparent 60%)", pointerEvents: "none" }} />

      <div className="max-w-[980px] mx-auto px-6 md:px-10" style={{ position: "relative", zIndex: 1 }}>
        {/* Header */}
        <div
          className="text-center md:text-center"
          style={{
            opacity: visible ? 1 : 0,
            transform: visible ? "translateY(0)" : "translateY(12px)",
            transition: "opacity 0.5s ease-out, transform 0.5s ease-out",
          }}
        >
          <h2
            className="text-[32px] md:text-[40px] text-left md:text-center"
            style={{
              color: "#F4F1EA",
              fontWeight: 600,
              lineHeight: 1.12,
              letterSpacing: "-0.02em",
              marginBottom: 18,
            }}
          >
            Frequently Asked Questions
          </h2>
          <p
            className="text-[16px] md:text-[18px] text-left md:text-center mx-auto"
            style={{
              color: "rgba(244,241,234,0.78)",
              fontWeight: 400,
              lineHeight: 1.7,
              maxWidth: 680,
              marginBottom: 64,
            }}
          >
            Common questions about the <strong style={{ fontWeight: 500, color: "#F4F1EA" }}>Income Stability Score&#8482;</strong> and assessment.
          </p>
        </div>

        {/* FAQ list */}
        <div
          className="mx-auto"
          style={{
            maxWidth: 820,
            opacity: visible ? 1 : 0,
            transform: visible ? "translateY(0)" : "translateY(10px)",
            transition: "opacity 0.5s ease-out 80ms, transform 0.5s ease-out 80ms",
          }}
        >
          {faqItems.map((item, i) => {
            const isOpen = openFaq === i;
            return (
              <div
                key={i}
                style={{
                  borderTop: "1px solid rgba(255,255,255,0.10)",
                  borderBottom: i === faqItems.length - 1 ? "1px solid rgba(255,255,255,0.10)" : "none",
                  backgroundColor: isOpen ? "rgba(75,63,174,0.04)" : "transparent",
                  transition: "border-color 180ms ease, background-color 180ms ease",
                }}
              >
                <button
                  onClick={() => setOpenFaq(isOpen ? null : i)}
                  className="w-full flex items-center justify-between text-left group"
                  style={{ padding: "26px 0", gap: 24 }}
                  aria-expanded={isOpen}
                >
                  <span
                    className="text-[17px] md:text-[20px] group-hover:!text-[#F4F1EA] transition-colors duration-[180ms]"
                    style={{
                      color: isOpen ? "#F4F1EA" : "rgba(244,241,234,0.88)",
                      fontWeight: 500,
                      lineHeight: 1.45,
                      letterSpacing: "-0.01em",
                    }}
                  >
                    {item.q}
                  </span>
                  {/* Plus/minus indicator */}
                  <svg
                    width="16" height="16" viewBox="0 0 16 16" fill="none"
                    className="shrink-0 transition-colors duration-[180ms] group-hover:!stroke-[rgba(244,241,234,0.9)]"
                    stroke="rgba(244,241,234,0.72)"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                  >
                    {!isOpen && <line x1="8" y1="2" x2="8" y2="14" />}
                    <line x1="2" y1="8" x2="14" y2="8" />
                  </svg>
                </button>
                {/* Answer area */}
                <div
                  className="overflow-hidden transition-all duration-[220ms] ease-in-out"
                  style={{ maxHeight: isOpen ? 300 : 0, opacity: isOpen ? 1 : 0 }}
                >
                  <p
                    className="text-[15px] md:text-[16px]"
                    style={{
                      color: "rgba(244,241,234,0.76)",
                      fontWeight: 400,
                      lineHeight: 1.75,
                      maxWidth: 680,
                      paddingTop: 14,
                      paddingRight: 48,
                      paddingBottom: 20,
                    }}
                  >
                    {item.a}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* SCORE REGISTRY                                                       */
/* ------------------------------------------------------------------ */
function ScoreRegistry() {
  const { ref, visible } = useInView();

  const fields = [
    { label: "Registry ID", value: "RP-A7E2F1B3" },
    { label: "Score Result", value: "78 \u2014 Established Stability" },
    { label: "Model Version", value: "RP-1.0", purple: true },
    { label: "Timestamp", value: "2026-03-10 14:42 UTC" },
  ];

  return (
    <section
      ref={ref}
      style={{
        backgroundColor: "#F4F1EA",
        paddingTop: 232,
        paddingBottom: 152,
        position: "relative",
        overflow: "hidden",
      }}
    >
      <div className="max-w-[1140px] mx-auto px-6 md:px-10" style={{ position: "relative", zIndex: 1 }}>
        <div
          className="grid grid-cols-1 lg:grid-cols-[minmax(0,1.05fr)_minmax(360px,420px)]"
          style={{ columnGap: 88, rowGap: 36, alignItems: "start" }}
        >
          {/* Left column — editorial text */}
          <div
            style={{
              maxWidth: 640,
              opacity: visible ? 1 : 0,
              transform: visible ? "translateY(0)" : "translateY(12px)",
              transition: "opacity 0.5s ease-out, transform 0.5s ease-out",
            }}
          >
            <h2
              className="text-[32px] md:text-[40px]"
              style={{
                color: B.navy,
                fontWeight: 600,
                lineHeight: 1.12,
                letterSpacing: "-0.02em",
                marginBottom: 18,
              }}
            >
              Score Registry
            </h2>

            <p className="text-[16px] md:text-[18px]" style={{ color: "rgba(14,26,43,0.78)", fontWeight: 400, lineHeight: 1.75, marginBottom: 18 }}>
              Each <strong style={{ fontWeight: 500, color: B.navy }}>Income Stability Score&#8482;</strong> assessment receives a unique registry ID.
            </p>
            <p className="text-[16px] md:text-[18px]" style={{ color: "rgba(14,26,43,0.78)", fontWeight: 400, lineHeight: 1.75, marginBottom: 18 }}>
              Registry records include the score result, model version, and assessment timestamp.
            </p>
            <p className="text-[16px] md:text-[18px]" style={{ color: "rgba(14,26,43,0.78)", fontWeight: 400, lineHeight: 1.75, marginBottom: 18 }}>
              This allows score results to be referenced and verified over time.
            </p>
            <p className="text-[16px] md:text-[18px]" style={{ color: "rgba(14,26,43,0.78)", fontWeight: 500, lineHeight: 1.75 }}>
              Registry records are generated under <strong>RunPayway Model RP-1.0</strong>.
            </p>
          </div>

          {/* Right column — registry preview panel */}
          <article
            className="lg:justify-self-center"
            style={{
              width: "100%",
              maxWidth: 420,
              backgroundColor: "#ffffff",
              border: "1px solid rgba(14,26,43,0.08)",
              borderRadius: 20,
              padding: 32,
              boxShadow: "inset 0 1px 0 rgba(255,255,255,0.8), 0 20px 60px rgba(14,26,43,0.10), 0 4px 12px rgba(14,26,43,0.04)",
              position: "relative",
              overflow: "hidden",
              alignSelf: "start",
              opacity: visible ? 1 : 0,
              transform: visible ? "translateY(0)" : "translateY(14px)",
              transition: "opacity 0.5s ease-out 100ms, transform 0.5s ease-out 100ms, border-color 0.2s ease, box-shadow 0.2s ease",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = "rgba(14,26,43,0.16)";
              e.currentTarget.style.boxShadow = "inset 0 1px 0 rgba(255,255,255,0.8), 0 24px 72px rgba(14,26,43,0.14), 0 4px 16px rgba(14,26,43,0.06)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = "rgba(14,26,43,0.08)";
              e.currentTarget.style.boxShadow = "inset 0 1px 0 rgba(255,255,255,0.8), 0 20px 60px rgba(14,26,43,0.10), 0 4px 12px rgba(14,26,43,0.04)";
            }}
          >
            {/* Top accent */}
            <div style={{ width: "100%", height: 2, background: "linear-gradient(90deg, #4B3FAE 0%, #1F6D7A 60%, transparent 100%)", borderRadius: 2, marginBottom: 22 }} />

            {/* Panel header */}
            <div
              className="text-[12px] uppercase"
              style={{ color: B.teal, fontWeight: 500, letterSpacing: "0.12em", marginBottom: 18 }}
            >
              Registry Record
            </div>

            {/* Field list */}
            <div style={{ display: "grid", rowGap: 18 }}>
              {fields.map((field, i) => (
                <div key={field.label}>
                  <div
                    className="text-[11px] uppercase"
                    style={{ color: "rgba(14,26,43,0.52)", fontWeight: 500, letterSpacing: "0.10em", marginBottom: 5 }}
                  >
                    {field.label}
                  </div>
                  <div
                    className="text-[15px] md:text-[16px]"
                    style={{ color: field.purple ? B.purple : B.navy, fontWeight: 500, lineHeight: 1.5 }}
                  >
                    {field.value}
                  </div>
                  {/* Divider after each field except last */}
                  {i < fields.length - 1 && (
                    <div style={{ height: 1, background: "linear-gradient(90deg, rgba(14,26,43,0.08) 0%, rgba(14,26,43,0.02) 100%)", marginTop: 18 }} />
                  )}
                </div>
              ))}
            </div>
          </article>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* WHY INCOME STABILITY MATTERS                                         */
/* ------------------------------------------------------------------ */
function WhyIncomeStabilityMatters() {
  const { ref, visible } = useInView();

  return (
    <section
      ref={ref}
      className="relative overflow-hidden navy-grain"
      style={{
        backgroundColor: B.navy,
        paddingTop: 160,
        paddingBottom: 160,
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Ambient glows */}
      <div style={{ position: "absolute", top: "-18%", right: "-10%", width: 700, height: 700, borderRadius: "50%", background: "radial-gradient(circle, rgba(75,63,174,0.08) 0%, transparent 65%)", pointerEvents: "none" }} />
      <div style={{ position: "absolute", bottom: "-12%", left: "-6%", width: 500, height: 500, borderRadius: "50%", background: "radial-gradient(circle, rgba(31,109,122,0.06) 0%, transparent 60%)", pointerEvents: "none" }} />

      {/* Top wave transition */}
      <div className="absolute top-0 left-0 right-0" style={{ transform: "translateY(-99%)" }}>
        <svg viewBox="0 0 1440 80" preserveAspectRatio="none" style={{ display: "block", width: "100%", height: 80 }}>
          <path d="M0,80 L0,40 Q360,0 720,40 Q1080,80 1440,40 L1440,80 Z" fill="#0E1A2B" />
        </svg>
      </div>

      {/* Bottom wave transition */}
      <div className="absolute bottom-0 left-0 right-0" style={{ transform: "translateY(99%)" }}>
        <svg viewBox="0 0 1440 80" preserveAspectRatio="none" style={{ display: "block", width: "100%", height: 80 }}>
          <path d="M0,0 L0,40 Q360,80 720,40 Q1080,0 1440,40 L1440,0 Z" fill="#0E1A2B" />
        </svg>
      </div>

      <div className="max-w-[1100px] mx-auto px-6 md:px-10" style={{ position: "relative", zIndex: 1 }}>
        {/* Title */}
        <h2
          className="text-[32px] md:text-[40px]"
          style={{
            color: "#F4F1EA",
            fontWeight: 600,
            letterSpacing: "-0.02em",
            marginBottom: 56,
          }}
        >
          Why Income Stability Matters
        </h2>

        {/* Two-column layout */}
        <div
          className="grid grid-cols-1 lg:grid-cols-[1.1fr_0.9fr]"
          style={{ columnGap: 80, rowGap: 36, alignItems: "start" }}
        >
          {/* Left column — explanatory text */}
          <div
            style={{
              maxWidth: 620,
              opacity: visible ? 1 : 0,
              transform: visible ? "translateY(0)" : "translateY(12px)",
              transition: "opacity 0.5s ease-out, transform 0.5s ease-out",
            }}
          >
            {[
              <>A credit score measures <strong style={{ fontWeight: 500, color: "#F4F1EA" }}>how reliably you repay debt</strong>.</>,
              <>It does <strong style={{ fontWeight: 500, color: "#F4F1EA" }}>not measure how stable your income is</strong>.</>,
              <>Two people can have the same credit score but very different income structures.</>,
              <>One income may be predictable and recurring.</>,
              <>Another may stop if work stops.</>,
              <>That difference affects financial risk and long-term planning.</>,
            ].map((text, i) => (
              <p
                key={i}
                className="text-[16px] md:text-[18px]"
                style={{ color: "rgba(244,241,234,0.86)", fontWeight: 400, lineHeight: 1.75, marginBottom: 22 }}
              >
                {text}
              </p>
            ))}

            <p
              className="text-[16px] md:text-[18px]"
              style={{ color: "#F4F1EA", fontWeight: 500, lineHeight: 1.75, marginTop: 18 }}
            >
              The <strong>Income Stability Score&#8482;</strong> measures the stability of your income structure.
            </p>

            <Link
              href="/pricing"
              className="inline-block transition-colors duration-200"
              style={{
                color: B.purple,
                fontWeight: 600,
                fontSize: 20,
                marginTop: 36,
              }}
              onMouseEnter={(e) => { e.currentTarget.style.color = B.teal; }}
              onMouseLeave={(e) => { e.currentTarget.style.color = B.purple; }}
            >
              Get your Income Stability Score&#8482;.
            </Link>
          </div>

          {/* Right column — comparison panel */}
          <div
            className="lg:justify-self-end"
            style={{
              maxWidth: 420,
              width: "100%",
              backgroundColor: "rgba(255,255,255,0.03)",
              border: "1px solid rgba(255,255,255,0.10)",
              borderRadius: 20,
              padding: 32,
              boxShadow: "inset 0 1px 0 rgba(255,255,255,0.06), 0 20px 60px rgba(0,0,0,0.30)",
              alignSelf: "start",
              opacity: visible ? 1 : 0,
              transform: visible ? "translateY(0)" : "translateY(12px)",
              transition: "opacity 0.5s ease-out 120ms, transform 0.5s ease-out 120ms, border-color 300ms ease, box-shadow 300ms ease, transform 300ms ease",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = "rgba(255,255,255,0.16)";
              e.currentTarget.style.boxShadow = "inset 0 1px 0 rgba(255,255,255,0.08), 0 24px 72px rgba(0,0,0,0.35)";
              e.currentTarget.style.transform = "translateY(-2px)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = "rgba(255,255,255,0.10)";
              e.currentTarget.style.boxShadow = "inset 0 1px 0 rgba(255,255,255,0.06), 0 20px 60px rgba(0,0,0,0.30)";
              e.currentTarget.style.transform = "translateY(0)";
            }}
          >
            {/* Top accent line */}
            <div style={{ width: "100%", height: 1, background: "linear-gradient(90deg, #4B3FAE, rgba(31,109,122,0.5), transparent)", borderRadius: 2, marginBottom: 18 }} />

            {/* Entry 1: Credit Score */}
            <div style={{ marginBottom: 20 }}>
              <div
                className="text-[16px] uppercase"
                style={{ color: B.purple, fontWeight: 600, letterSpacing: "0.04em", marginBottom: 8 }}
              >
                Credit Score
              </div>
              <p className="text-[16px]" style={{ color: "rgba(244,241,234,0.82)", fontWeight: 400, lineHeight: 1.6 }}>
                Measures how reliably you repay debt.
              </p>
            </div>

            {/* Divider */}
            <div style={{ height: 1, background: "linear-gradient(90deg, rgba(75,63,174,0.3), rgba(255,255,255,0.08), transparent)", margin: "18px 0" }} />

            {/* Entry 2: Income Stability Score */}
            <div>
              <div
                className="text-[16px] uppercase"
                style={{ color: B.purple, fontWeight: 600, letterSpacing: "0.04em", marginBottom: 8 }}
              >
                Income Stability Score&#8482;
              </div>
              <p className="text-[16px]" style={{ color: "rgba(244,241,234,0.82)", fontWeight: 400, lineHeight: 1.6 }}>
                Measures how stable your income structure is.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* PREVIEW YOUR SCORE REPORT — Financial Assessment Document            */
/* ------------------------------------------------------------------ */
function PreviewYourScoreReport() {
  const { ref, visible } = useInView();
  const [activePage, setActivePage] = useState(0);
  const pages = ["Executive Assessment", "Structural Analysis", "Improvement Path"];

  /* ---- Shared report header (appears on every page) ---- */
  const reportHeader = (
    <>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 8 }}>
        <div>
          <div className="text-[20px] md:text-[22px]" style={{ color: B.navy, fontWeight: 600 }}>
            Income Stability Assessment
          </div>
          <div className="text-[13px]" style={{ color: B.purple, fontWeight: 500, letterSpacing: "0.04em", marginTop: 4 }}>
            Model <strong>RP-1.0</strong>
          </div>
        </div>
        <div className="text-[10px] text-right" style={{ color: B.light, lineHeight: 1.6 }}>
          <div>A7E2F1B3</div>
          <div>2026-03-10</div>
        </div>
      </div>
      <div style={{ height: 1, background: "rgba(14,26,43,0.06)", margin: "16px 0 24px 0" }} />
    </>
  );

  /* ---- Shared section divider ---- */
  const divider = <div style={{ height: 1, background: "rgba(14,26,43,0.06)", margin: "20px 0" }} />;

  /* ---- Shared section label ---- */
  const label = (text: string) => (
    <div className="text-[10px] uppercase" style={{ color: B.light, fontWeight: 600, letterSpacing: "0.12em", marginBottom: 8 }}>
      {text}
    </div>
  );

  /* ==================== PAGE CONTENT ==================== */
  const page1 = (
    <>
      {reportHeader}

      {/* Key insight */}
      <p className="text-[13px]" style={{ color: B.muted, lineHeight: 1.7, marginBottom: 20 }}>
        This assessment evaluates the structural stability of income systems using six deterministic factors under Model RP-1.0. Score reflects current income architecture, not future outcomes.
      </p>

      {/* Compact score + percentile row */}
      <div style={{ display: "flex", flexWrap: "wrap", gap: 12, marginBottom: 24 }}>
        <div style={{ padding: "12px 20px", borderRadius: 10, backgroundColor: B.sand, display: "flex", alignItems: "center", gap: 14 }}>
          <div className="text-[28px]" style={{ color: B.navy, fontWeight: 700, lineHeight: 1 }}>78</div>
          <div>
            <div className="text-[12px]" style={{ color: B.purple, fontWeight: 600 }}>Established Stability</div>
            <div className="text-[10px]" style={{ color: B.light, marginTop: 2 }}>Income Stability Score™</div>
          </div>
        </div>
        <div style={{ padding: "12px 20px", borderRadius: 10, backgroundColor: B.sand, display: "flex", alignItems: "center" }}>
          <div>
            <div className="text-[12px]" style={{ color: B.muted }}>
              <span style={{ fontWeight: 600, color: B.navy }}>72nd percentile</span> within Professional Services
            </div>
            <div className="text-[10px]" style={{ color: B.light, marginTop: 2 }}>
              Exceeds 72% of assessed income systems in this sector.
            </div>
          </div>
        </div>
      </div>

      {divider}

      {/* Assessment Title */}
      <div style={{ marginBottom: 14 }}>
        <div
          style={{
            fontWeight: 500,
            fontSize: 12,
            letterSpacing: "0.08em",
            textTransform: "uppercase" as const,
            color: "rgba(14,26,43,0.55)",
            marginBottom: 4,
          }}
        >
          Assessment Title
        </div>
        <div
          style={{
            fontWeight: 600,
            fontSize: 16,
            color: B.navy,
          }}
        >
          Jordan Ellis — Ellis Advisory Group
        </div>
      </div>

      {/* Profile */}
      {label("Profile")}
      <div className="grid grid-cols-2 gap-x-6 gap-y-2">
        {[
          ["Classification", "Established Stability"],
          ["Structure", "LLC — Single Operator"],
          ["Income Model", "Fee-for-Service"],
          ["Revenue", "Project-Based"],
          ["Sector", "Professional Services"],
        ].map(([l, v]) => (
          <div key={l}>
            <span className="text-[11px]" style={{ color: B.light }}>{l}: </span>
            <span className="text-[11px]" style={{ color: B.navy, fontWeight: 500 }}>{v}</span>
          </div>
        ))}
      </div>

      {divider}

      {/* Key Structural Factors */}
      {label("Key Structural Factors")}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <div className="text-[10px] uppercase" style={{ fontWeight: 600, color: B.teal, letterSpacing: "0.08em", marginBottom: 8 }}>Positive Factors</div>
          {["Multiple income sources", "Some recurring revenue", "Forward commitments present"].map((f) => (
            <div key={f} className="flex items-center gap-2 mb-1">
              <span style={{ width: 5, height: 5, borderRadius: 999, backgroundColor: B.teal, flexShrink: 0 }} />
              <span className="text-[11px]" style={{ color: B.navy }}>{f}</span>
            </div>
          ))}
        </div>
        <div>
          <div className="text-[10px] uppercase" style={{ fontWeight: 600, color: B.muted, letterSpacing: "0.08em", marginBottom: 8 }}>Structural Risks</div>
          {["High active labor dependence", "Limited persistent income"].map((f) => (
            <div key={f} className="flex items-center gap-2 mb-1">
              <span style={{ width: 5, height: 5, borderRadius: 999, backgroundColor: B.light, flexShrink: 0 }} />
              <span className="text-[11px]" style={{ color: B.navy }}>{f}</span>
            </div>
          ))}
        </div>
      </div>
    </>
  );

  const page2 = (
    <>
      {reportHeader}

      <div className="text-[12px] uppercase" style={{ color: B.navy, fontWeight: 600, letterSpacing: "0.1em", marginBottom: 4 }}>
        Structural Analysis
      </div>
      <p className="text-[13px]" style={{ color: B.muted, lineHeight: 1.7, marginBottom: 24 }}>
        This page breaks down the composition of income sources and structural indicators driving the overall stability score.
      </p>

      {/* Income Structure Map */}
      {label("Income Structure Map")}
      <div style={{ display: "flex", flexDirection: "column", gap: 14, marginBottom: 24 }}>
        {[
          { l: "Active Income", desc: "Earned by doing work", v: 65, c: B.muted },
          { l: "Semi-Persistent", desc: "Repeats for a while, then stops", v: 25, c: B.teal },
          { l: "Persistent", desc: "Continues with little work", v: 10, c: B.navy },
        ].map((bar) => (
          <div key={bar.l}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
              <span className="text-[11px]" style={{ color: B.muted }}>{bar.l}</span>
              <span className="text-[11px]" style={{ color: B.navy, fontWeight: 600 }}>{bar.v}%</span>
            </div>
            <div style={{ height: 10, borderRadius: 999, backgroundColor: B.sand, overflow: "hidden" }}>
              <div style={{ height: "100%", borderRadius: 999, width: `${bar.v}%`, backgroundColor: bar.c, transition: "width 0.6s ease" }} />
            </div>
          </div>
        ))}
      </div>

      {divider}

      {/* Structural Indicators */}
      {label("Structural Indicators")}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
        {[
          ["Income That Continues", "Moderate"],
          ["Number of Income Sources", "Multiple"],
          ["Income Already Scheduled", "Some"],
          ["Monthly Income Stability", "Variable"],
          ["Dependence on Personal Work", "High"],
          ["Dependence on One Source", "Low"],
        ].map(([l, v]) => (
          <div key={l} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "8px 14px", borderRadius: 8, backgroundColor: B.sand }}>
            <span className="text-[10px]" style={{ color: B.muted }}>{l}</span>
            <span className="text-[10px]" style={{ color: B.navy, fontWeight: 600 }}>{v}</span>
          </div>
        ))}
      </div>

      {divider}

      {/* System Diagnosis */}
      {label("System Diagnosis")}
      <div className="text-[12px]" style={{ color: B.muted, lineHeight: 1.7 }}>
        <p style={{ marginBottom: 8 }}>
          This system operates mainly as a <strong style={{ color: B.navy }}>Labor-Dependent</strong> income system in the <strong style={{ color: B.navy }}>Professional Services</strong> sector.
        </p>
        <p>
          Income mainly comes from active project work. The system shows moderate diversification but limited persistent revenue streams. Because <strong style={{ color: B.navy }}>Income Persistence</strong> is limited, stability depends on continuing to generate new work.
        </p>
      </div>

      {divider}

      {/* Industry Benchmark */}
      {label("Industry Stability Benchmark")}
      <div style={{ borderRadius: 10, overflow: "hidden", border: `1px solid ${B.sandDk}` }}>
        {[
          ["Average Professional Services Score", "62", false],
          ["Top 20% Stability Range", "80+", false],
          ["Your Score", "78", true],
          ["Distance From Top Tier", "2 points", false],
        ].map(([l, v, highlight], i) => (
          <div key={l as string} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 16px", backgroundColor: i % 2 === 0 ? B.sand : "#fff" }}>
            <span className="text-[11px]" style={{ color: B.muted }}>{l as string}</span>
            <span className="text-[11px]" style={{ fontWeight: 600, color: highlight ? B.purple : B.navy }}>{v as string}</span>
          </div>
        ))}
      </div>

      {/* Drivers */}
      <div style={{ marginTop: 16 }}>
        {label("Drivers Supporting Stability")}
        <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
          {["Client Diversification", "Recurring Engagements", "Service Expansion"].map((d) => (
            <span key={d} className="text-[10px]" style={{ fontWeight: 500, padding: "4px 10px", borderRadius: 6, backgroundColor: B.sand, color: B.navy }}>{d}</span>
          ))}
        </div>
      </div>
    </>
  );

  const page3 = (
    <>
      {reportHeader}

      <div className="text-[12px] uppercase" style={{ color: B.navy, fontWeight: 600, letterSpacing: "0.1em", marginBottom: 4 }}>
        Improvement Path &amp; Governance
      </div>
      <p className="text-[13px]" style={{ color: B.muted, lineHeight: 1.7, marginBottom: 24 }}>
        Structural actions that may move this income system toward higher stability classification.
      </p>

      {/* Primary Constraint */}
      {label("Primary Structural Constraint")}
      <div className="text-[13px]" style={{ color: B.navy, fontWeight: 600, marginBottom: 6 }}>Income Persistence</div>
      <div className="text-[12px]" style={{ color: B.muted, lineHeight: 1.7, marginBottom: 4 }}>
        Most income requires ongoing active effort to generate. When active work pauses, income pauses with it.
      </div>
      <div className="text-[12px]" style={{ color: B.muted, lineHeight: 1.7 }}>
        Systems dependent on active labor face higher score volatility if conditions change.
      </div>

      {divider}

      {/* Improvement Opportunities */}
      {label("Improvement Opportunities")}
      <p className="text-[12px]" style={{ color: B.muted, lineHeight: 1.7, marginBottom: 16 }}>
        Shifting 10–15% of income from project-based to recurring service agreements would improve persistence scores. Structuring intellectual property or productized offerings could create asset-based revenue.
      </p>

      {/* Sector evolution */}
      <div style={{ marginBottom: 16 }}>
        <div className="text-[10px] uppercase" style={{ fontWeight: 600, color: B.muted, letterSpacing: "0.08em", marginBottom: 10 }}>
          Sector Evolution Path
        </div>
        <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: 8 }}>
          {["Project-Based", "Recurring Services", "Managed Services", "Asset-Based"].map((step, i) => (
            <div key={step} style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <span className="text-[10px]" style={{
                fontWeight: 500,
                padding: "4px 10px",
                borderRadius: 6,
                backgroundColor: i === 0 ? B.teal : i === 1 ? B.navy : B.sand,
                color: i <= 1 ? "#fff" : B.light,
              }}>
                {step}
              </span>
              {i < 3 && <span className="text-[10px]" style={{ color: B.light }}>&rarr;</span>}
            </div>
          ))}
        </div>
        <div className="text-[10px]" style={{ color: B.muted, marginTop: 8 }}>
          Current Stage: <strong style={{ color: B.navy }}>Project-Based → Recurring Services</strong>
        </div>
      </div>

      {/* Sector mechanisms */}
      <div style={{ marginBottom: 4 }}>
        <div className="text-[10px] uppercase" style={{ fontWeight: 600, color: B.muted, letterSpacing: "0.08em", marginBottom: 6 }}>
          Sector Stability Mechanisms
        </div>
        <ul className="text-[11px]" style={{ color: B.muted, listStyleType: "disc", paddingLeft: 16, lineHeight: 1.8 }}>
          <li>Retainer-based client relationships</li>
          <li>Productized service packages</li>
          <li>Licensing intellectual property or frameworks</li>
        </ul>
      </div>

      {divider}

      {/* Methodology */}
      {label("Methodology")}
      <p className="text-[10px]" style={{ color: B.muted, lineHeight: 1.7, marginBottom: 4 }}>
        The Income Stability Score™ evaluates the structural stability of income at a specific point in time. Six structural factors are assessed under Model RP-1.0 using fixed, deterministic scoring criteria. The model does not evaluate investment performance, creditworthiness, or future financial outcomes.
      </p>

      {divider}

      {/* Disclosure */}
      {label("Disclosure")}
      <p className="text-[10px]" style={{ color: B.light, lineHeight: 1.7 }}>
        This report is created by a fixed classification model. It is not financial advice. The Income Stability Score is not a credit score, not a measure of net worth, and not a prediction of future income.
      </p>

      {divider}

      {/* Official Record */}
      {label("Official Classification Record")}
      <div style={{ display: "grid", gap: 4, marginTop: 4 }}>
        {[
          ["Record ID", "a7e2f1b3-94c1-4d8e-b7a2-3f1e5d9c6b8a"],
          ["Model", "RP-1.0"],
          ["Date", "2026-03-10"],
          ["Score", "78 — Established Stability"],
          ["Auth Code", "RP-78-A7E2-2026"],
          ["Registry", "Publicly Listed"],
        ].map(([l, v]) => (
          <div key={l} className="flex flex-col sm:flex-row">
            <span className="text-[10px] sm:w-20 shrink-0" style={{ color: B.light }}>{l}</span>
            <span className="text-[10px] font-mono break-all" style={{ color: B.navy }}>{v}</span>
          </div>
        ))}
      </div>

      {/* Verification */}
      <p className="text-[10px]" style={{ color: B.muted, marginTop: 12, lineHeight: 1.6 }}>
        Verify this report at <span style={{ fontWeight: 500, color: B.navy }}>RunPayway.com/verify</span> using the Record ID and Authorization Code.
      </p>

      {/* Model reference */}
      <div style={{ textAlign: "center", marginTop: 20, paddingTop: 12, borderTop: `1px solid ${B.sandDk}` }}>
        <div className="text-[10px]" style={{ color: B.light }}>RunPayway Structural Stability Model RP-1.0</div>
      </div>
    </>
  );

  const pageContent = [page1, page2, page3];

  return (
    <section
      ref={ref}
      style={{
        paddingTop: 120,
        paddingBottom: 140,
        position: "relative",
        overflow: "hidden",
      }}
    >

      <div className="max-w-[1100px] mx-auto px-6 md:px-10" style={{ position: "relative", zIndex: 1 }}>
        {/* Section header */}
        <h2
          className="text-[32px] md:text-[40px]"
          style={{
            color: B.navy,
            fontWeight: 600,
            letterSpacing: "-0.02em",
            marginBottom: 16,
          }}
        >
          What&rsquo;s Inside Your Report
        </h2>
        <p
          className="text-[16px] md:text-[18px]"
          style={{
            color: "rgba(14,26,43,0.75)",
            fontWeight: 400,
            lineHeight: 1.7,
            maxWidth: 720,
            marginBottom: 48,
          }}
        >
          Every assessment produces a three-page report covering your classification, structural breakdown, and a clear path to improve your score.
        </p>

        {/* Page tabs */}
        <div className="flex flex-wrap gap-0 mb-0" style={{ maxWidth: 820, margin: "0 auto 0 auto" }}>
          {pages.map((label, i) => {
            const isActive = activePage === i;
            return (
              <button
                key={label}
                onClick={() => setActivePage(i)}
                style={{
                  flex: 1,
                  padding: "14px 16px",
                  fontSize: 13,
                  fontWeight: 600,
                  letterSpacing: "0.01em",
                  border: "1px solid rgba(14,26,43,0.10)",
                  borderBottom: isActive ? "1px solid #fff" : "1px solid rgba(14,26,43,0.10)",
                  borderTopLeftRadius: i === 0 ? 14 : 0,
                  borderTopRightRadius: i === pages.length - 1 ? 14 : 0,
                  backgroundColor: isActive ? "#ffffff" : "rgba(14,26,43,0.03)",
                  color: isActive ? B.navy : B.light,
                  cursor: "pointer",
                  transition: "all 0.2s ease",
                  position: "relative",
                  zIndex: isActive ? 2 : 1,
                  marginLeft: i > 0 ? -1 : 0,
                }}
              >
                <span className="hidden sm:inline">Page {i + 1}: </span>{label}
              </button>
            );
          })}
        </div>

        {/* Report preview card */}
        <div
          className="text-left"
          style={{
            opacity: visible ? 1 : 0,
            transform: visible ? "translateY(0)" : "translateY(12px)",
            transition: "opacity 0.5s ease-out, transform 0.5s ease-out",
            maxWidth: 820,
            margin: "0 auto",
            backgroundColor: "#ffffff",
            border: "1px solid rgba(14,26,43,0.10)",
            borderTop: "none",
            borderRadius: "0 0 18px 18px",
            padding: "36px 40px 44px 40px",
            boxShadow: "0 24px 80px rgba(14,26,43,0.10), 0 4px 16px rgba(14,26,43,0.04)",
            position: "relative",
          }}
        >
          {/* Active page indicator line */}
          <div style={{ position: "absolute", top: 0, left: 32, right: 32, height: 2, borderRadius: 2, background: B.gradient }} />

          {pageContent[activePage]}
        </div>

        {/* Closing text */}
        <p
          className="text-[15px] text-center"
          style={{ color: "rgba(14,26,43,0.65)", fontWeight: 400, marginTop: 28 }}
        >
          Your report is delivered instantly after assessment.
        </p>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* SCORING FACTORS — Model Input Framework                              */
/* ------------------------------------------------------------------ */
function ScoringFactors() {
  const { ref: sectionRef, visible } = useInView();
  const headerRef = useRef<HTMLDivElement>(null);
  const [scrollProgress, setScrollProgress] = useState(0);

  /* Scroll-driven parallax: track how far through the section the user is */
  useEffect(() => {
    const onScroll = () => {
      const el = sectionRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const vh = window.innerHeight;
      /* 0 = section top at viewport bottom, 1 = section bottom at viewport top */
      const raw = (vh - rect.top) / (rect.height + vh);
      setScrollProgress(Math.max(0, Math.min(1, raw)));
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  /* Title parallax: vertical drift + scale + fade at edges */
  const titleY = (scrollProgress - 0.5) * -80;
  const titleScale = 1 + (0.5 - Math.abs(scrollProgress - 0.5)) * 0.06;
  const titleOpacity = visible
    ? Math.min(1, 1 - Math.max(0, (scrollProgress - 0.72) * 4)) * Math.min(1, scrollProgress * 5)
    : 0;

  const factors = [
    { num: "01", name: "Recurring Income", desc: "Measures how reliably your income renews without active effort." },
    { num: "02", name: "Income Diversification", desc: "Evaluates whether your income is supported by multiple streams." },
    { num: "03", name: "Income Concentration", desc: "Assesses your exposure if any single source were disrupted." },
    { num: "04", name: "Forward Visibility", desc: "Gauges how far into the future your income can be projected." },
    { num: "05", name: "Earnings Consistency", desc: "Analyzes the stability of your income from period to period." },
    { num: "06", name: "Passive Income", desc: "Identifies income that continues independent of direct labor." },
  ];

  return (
    <section
      ref={sectionRef}
      className="scoring-factors-section relative"
      style={{
        paddingTop: 140,
        paddingBottom: 140,
      }}
    >

      <div className="mx-auto px-6 md:px-10" style={{ maxWidth: 1100, position: "relative", zIndex: 1 }}>
        {/* Sticky header — parallax drift */}
        <div
          ref={headerRef}
          className="text-center"
          style={{
            marginBottom: 80,
            opacity: titleOpacity,
            transform: `translateY(${visible ? titleY : 30}px) scale(${visible ? titleScale : 0.92})`,
            transition: visible ? "none" : "opacity 600ms ease-out, transform 600ms ease-out",
            willChange: "transform, opacity",
          }}
        >
          <div
            className="font-medium uppercase text-[11px]"
            style={{ letterSpacing: "0.14em", color: B.teal, marginBottom: 16 }}
          >
            What We Measure
          </div>
          <h2
            className="text-[34px] md:text-[48px] font-semibold"
            style={{ color: B.navy, letterSpacing: "-0.025em", marginBottom: 16, lineHeight: 1.1 }}
          >
            Six Scoring Factors
          </h2>
          <p
            className="text-[17px] md:text-[18px] mx-auto"
            style={{ color: "rgba(14,26,43,0.55)", lineHeight: 1.7, maxWidth: 520 }}
          >
            Your score is built from six structural dimensions of income health.
          </p>
        </div>

        {/* Factor grid: 2 cols desktop, 1 col mobile */}
        <div
          className="grid grid-cols-1 md:grid-cols-2"
          style={{ gap: 18, maxWidth: 920, margin: "0 auto" }}
        >
          {factors.map((factor, i) => {
            const row = Math.floor(i / 2);
            const cardDelay = 100 + row * 140 + (i % 2) * 70;
            return (
              <article
                key={factor.num}
                className="group"
                style={{
                  position: "relative",
                  backgroundColor: "#ffffff",
                  borderRadius: 16,
                  padding: "32px 32px 36px 32px",
                  border: "1px solid rgba(14,26,43,0.06)",
                  boxShadow: "0 1px 3px rgba(14,26,43,0.04), 0 8px 24px rgba(14,26,43,0.03)",
                  opacity: visible ? 1 : 0,
                  transform: visible ? "translateY(0)" : `translateY(${24 + row * 8}px)`,
                  transition: `opacity 600ms ease-out ${cardDelay}ms, transform 600ms ease-out ${cardDelay}ms, box-shadow 400ms ease, transform 400ms ease, border-color 400ms ease`,
                  overflow: "hidden",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.boxShadow = "0 4px 16px rgba(14,26,43,0.08), 0 16px 48px rgba(75,63,174,0.08)";
                  e.currentTarget.style.transform = "translateY(-3px)";
                  e.currentTarget.style.borderColor = "rgba(75,63,174,0.12)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.boxShadow = "0 1px 3px rgba(14,26,43,0.04), 0 8px 24px rgba(14,26,43,0.03)";
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.borderColor = "rgba(14,26,43,0.06)";
                }}
              >
                {/* Subtle top accent line */}
                <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 2, background: `linear-gradient(90deg, ${B.purple} 0%, rgba(75,63,174,0.15) 100%)`, opacity: 0.6 }} />

                {/* Number badge */}
                <div
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    justifyContent: "center",
                    width: 32,
                    height: 32,
                    borderRadius: 10,
                    backgroundColor: "rgba(75,63,174,0.06)",
                    marginBottom: 16,
                  }}
                >
                  <span className="text-[12px] font-bold" style={{ color: B.purple }}>{factor.num}</span>
                </div>

                {/* Name */}
                <div
                  className="text-[18px] md:text-[20px] font-semibold"
                  style={{ color: B.navy, lineHeight: 1.3, marginBottom: 10 }}
                >
                  {factor.name}
                </div>

                {/* Outcome-focused description */}
                <p
                  className="text-[14px] md:text-[15px]"
                  style={{ color: "rgba(14,26,43,0.55)", lineHeight: 1.7 }}
                >
                  {factor.desc}
                </p>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* HOW IT WORKS — Unified Scoring Pipeline + Model Diagram              */
/* ------------------------------------------------------------------ */
function HowItWorks() {
  const { ref, visible } = useInView();

  const steps = [
    {
      num: "1",
      title: "Income Profile Intake",
      desc: "We assess your income structure — its sources, frequency, and predictability.",
    },
    {
      num: "2",
      title: "Structural Analysis",
      desc: "Our model analyzes your answers across six factors and places you on a 0–100 stability scale.",
    },
    {
      num: "3",
      title: "Get Your Report",
      desc: "Receive your Income Stability Score and a detailed breakdown showing exactly where you stand.",
    },
  ];

  return (
    <section
      ref={ref}
      className="relative navy-grain"
      style={{
        backgroundColor: B.navy,
        paddingTop: 180,
        paddingBottom: 180,
      }}
    >
      {/* Top curve — organic wave transition */}
      <div className="absolute top-0 left-0 right-0" style={{ transform: "translateY(-99%)" }}>
        <svg viewBox="0 0 1440 80" preserveAspectRatio="none" style={{ display: "block", width: "100%", height: 80 }}>
          <path d="M0,80 L0,40 Q360,0 720,40 Q1080,80 1440,40 L1440,80 Z" fill={B.navy} />
        </svg>
      </div>

      {/* Bottom curve — mirrored organic wave */}
      <div className="absolute bottom-0 left-0 right-0" style={{ transform: "translateY(99%)" }}>
        <svg viewBox="0 0 1440 80" preserveAspectRatio="none" style={{ display: "block", width: "100%", height: 80 }}>
          <path d="M0,0 L0,40 Q360,80 720,40 Q1080,0 1440,40 L1440,0 Z" fill={B.navy} />
        </svg>
      </div>

      {/* Ambient purple glow */}
      <div style={{ position: "absolute", top: "-15%", right: "-8%", width: 700, height: 700, borderRadius: "50%", background: "radial-gradient(circle, rgba(75,63,174,0.08) 0%, transparent 65%)", pointerEvents: "none" }} />
      {/* Ambient teal glow */}
      <div style={{ position: "absolute", bottom: "-10%", left: "-6%", width: 500, height: 500, borderRadius: "50%", background: "radial-gradient(circle, rgba(31,109,122,0.06) 0%, transparent 60%)", pointerEvents: "none" }} />

      <div className="relative mx-auto px-6 md:px-10" style={{ maxWidth: 1100 }}>
        {/* Header */}
        <div
          className="text-center"
          style={{
            marginBottom: 72,
            opacity: visible ? 1 : 0,
            transform: visible ? "translateY(0)" : "translateY(10px)",
            transition: "opacity 500ms ease-out, transform 500ms ease-out",
          }}
        >
          <div
            className="font-medium uppercase text-[11px]"
            style={{ letterSpacing: "0.14em", color: B.teal, marginBottom: 16 }}
          >
            Assessment Process
          </div>
          <h2
            className="text-[30px] md:text-[42px] font-semibold"
            style={{ color: "#F4F1EA", letterSpacing: "-0.02em", marginBottom: 16 }}
          >
            How It Works
          </h2>
          <p
            className="text-[17px] md:text-[18px] mx-auto"
            style={{ color: "rgba(244,241,234,0.55)", lineHeight: 1.7, maxWidth: 480 }}
          >
            A structured diagnostic built on six dimensions of income health.
          </p>
        </div>

        {/* 3 steps — horizontal on desktop, stacked on mobile */}
        <div
          className="grid grid-cols-1 md:grid-cols-3"
          style={{ gap: 24, maxWidth: 960, margin: "0 auto" }}
        >
          {steps.map((step, i) => (
            <article
              key={step.num}
              className="text-center"
              style={{
                position: "relative",
                backgroundColor: "rgba(244,241,234,0.06)",
                borderRadius: 16,
                padding: "40px 28px 44px",
                border: "1px solid rgba(244,241,234,0.10)",
                backdropFilter: "blur(12px)",
                WebkitBackdropFilter: "blur(12px)",
                boxShadow: "inset 0 1px 0 rgba(244,241,234,0.06), 0 8px 32px rgba(0,0,0,0.20)",
                opacity: visible ? 1 : 0,
                transform: visible ? "translateY(0)" : "translateY(10px)",
                transition: `opacity 500ms ease-out ${200 + i * 120}ms, transform 500ms ease-out ${200 + i * 120}ms, box-shadow 280ms ease, border-color 280ms ease, transform 280ms ease`,
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = "rgba(244,241,234,0.10)";
                e.currentTarget.style.borderColor = "rgba(244,241,234,0.18)";
                e.currentTarget.style.boxShadow = "inset 0 1px 0 rgba(244,241,234,0.08), 0 12px 48px rgba(0,0,0,0.30)";
                e.currentTarget.style.transform = "translateY(-2px)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = "rgba(244,241,234,0.06)";
                e.currentTarget.style.borderColor = "rgba(244,241,234,0.10)";
                e.currentTarget.style.boxShadow = "inset 0 1px 0 rgba(244,241,234,0.06), 0 8px 32px rgba(0,0,0,0.20)";
                e.currentTarget.style.transform = "translateY(0)";
              }}
            >
              <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 1, background: "linear-gradient(90deg, transparent, rgba(244,241,234,0.12), transparent)" }} />
              {/* Step number */}
              <div
                className="inline-flex items-center justify-center font-semibold"
                style={{
                  width: 44,
                  height: 44,
                  borderRadius: 12,
                  backgroundColor: B.purple,
                  color: "#ffffff",
                  fontSize: 17,
                  marginBottom: 24,
                  boxShadow: "0 0 24px rgba(75,63,174,0.30), 0 4px 16px rgba(75,63,174,0.35)",
                }}
              >
                {step.num}
              </div>

              {/* Title */}
              <div
                className="text-[18px] md:text-[20px] font-semibold"
                style={{ color: "#F4F1EA", marginBottom: 14 }}
              >
                {step.title}
              </div>

              {/* Description */}
              <p
                className="text-[14px] md:text-[15px]"
                style={{ color: "rgba(244,241,234,0.55)", lineHeight: 1.7 }}
              >
                {step.desc}
              </p>
            </article>
          ))}
        </div>

        {/* Connector line between cards — desktop only */}
        <div
          className="hidden md:block absolute"
          style={{
            top: "50%",
            left: "50%",
            transform: "translate(-50%, 12px)",
            width: 600,
            height: 1,
            background: `linear-gradient(90deg, transparent, rgba(244,241,234,0.12), rgba(75,63,174,0.20), rgba(244,241,234,0.12), transparent)`,
            zIndex: 0,
          }}
        />

        {/* Model reference */}
        <p
          className="text-[13px] text-center mx-auto"
          style={{
            color: "rgba(244,241,234,0.35)",
            marginTop: 56,
            maxWidth: 500,
            lineHeight: 1.7,
            opacity: visible ? 1 : 0,
            transition: "opacity 500ms ease-out 800ms",
          }}
        >
          Powered by <strong style={{ fontWeight: 600, color: "rgba(244,241,234,0.65)" }}>RunPayway Model RP-1.0</strong>
        </p>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* HERO SECTION — Premium Financial Instrument                          */
/* ------------------------------------------------------------------ */
function HeroSection() {
  const [score, setScore] = useState(0);
  const [hasAnimated, setHasAnimated] = useState(false);
  const [cardVisible, setCardVisible] = useState(false);
  const heroRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = heroRef.current;
    if (!el) return;
    const trigger = () => {
      if (hasAnimated) return;
      setHasAnimated(true);
      setTimeout(() => setCardVisible(true), 300);
      setTimeout(() => {
        const target = 78;
        const duration = 1000;
        const start = performance.now();
        const animate = (now: number) => {
          const elapsed = now - start;
          const progress = Math.min(elapsed / duration, 1);
          const eased = 1 - Math.pow(1 - progress, 3);
          setScore(Math.round(eased * target));
          if (progress < 1) requestAnimationFrame(animate);
        };
        requestAnimationFrame(animate);
      }, 800);
    };
    /* Fire immediately if already in view */
    const rect = el.getBoundingClientRect();
    if (rect.top < window.innerHeight && rect.bottom > 0) { trigger(); return; }
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { trigger(); obs.disconnect(); } },
      { threshold: 0 },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [hasAnimated]);

  return (
    <section
      ref={heroRef}
      className="relative overflow-hidden"
      style={{ background: "#ffffff" }}
    >
      {/* Faint radial glow — barely visible warmth */}
      <div
        className="absolute pointer-events-none"
        style={{
          width: 900,
          height: 900,
          borderRadius: "50%",
          top: "50%",
          right: "-5%",
          transform: "translateY(-50%)",
          background: "radial-gradient(circle, rgba(75,63,174,0.03) 0%, transparent 65%)",
        }}
      />

      <div
        className="relative mx-auto px-6 md:px-10 lg:px-12"
        style={{ maxWidth: 1200, paddingTop: 140, paddingBottom: 160 }}
      >
        <div className="flex flex-col lg:flex-row lg:items-center" style={{ gap: 80 }}>
          {/* Left — Copy + CTA */}
          <div className="flex-1 lg:max-w-[560px]">
            {/* Eyebrow */}
            <div
              className="font-medium uppercase text-[11px] md:text-[12px]"
              style={{
                letterSpacing: "0.14em",
                color: B.teal,
                marginBottom: 20,
                opacity: hasAnimated ? 1 : 0,
                transform: hasAnimated ? "translateY(0)" : "translateY(8px)",
                transition: "opacity 500ms ease-out, transform 500ms ease-out",
              }}
            >
              Income Stability Score™
            </div>

            <h1
              className="text-[38px] md:text-[52px] lg:text-[58px] font-semibold"
              style={{
                color: B.navy,
                lineHeight: 1.08,
                letterSpacing: "-0.03em",
                marginBottom: 24,
                opacity: hasAnimated ? 1 : 0,
                transform: hasAnimated ? "translateY(0)" : "translateY(12px)",
                transition: "opacity 600ms ease-out 100ms, transform 600ms ease-out 100ms",
              }}
            >
              How Stable Is Your Income?
            </h1>

            <p
              className="text-[17px] md:text-[20px]"
              style={{
                color: "rgba(14,26,43,0.65)",
                lineHeight: 1.65,
                marginBottom: 40,
                maxWidth: 460,
                opacity: hasAnimated ? 1 : 0,
                transform: hasAnimated ? "translateY(0)" : "translateY(10px)",
                transition: "opacity 600ms ease-out 250ms, transform 600ms ease-out 250ms",
              }}
            >
              Get your <strong style={{ fontWeight: 600, color: B.navy }}>Income Stability Score™</strong> in minutes.
            </p>

            {/* Audience clarification */}
            <p
              style={{
                fontWeight: 400,
                fontSize: 16,
                lineHeight: 1.6,
                color: "rgba(14,26,43,0.70)",
                maxWidth: 520,
                marginBottom: 24,
                opacity: hasAnimated ? 1 : 0,
                transform: hasAnimated ? "translateY(0)" : "translateY(10px)",
                transition: "opacity 600ms ease-out 280ms, transform 600ms ease-out 280ms",
              }}
            >
              Designed for independent professionals, founders, and income-driven careers.
            </p>

            <p
              className="text-[15px] md:text-[17px]"
              style={{
                color: "rgba(14,26,43,0.60)",
                lineHeight: 1.65,
                marginBottom: 40,
                maxWidth: 460,
                opacity: hasAnimated ? 1 : 0,
                transform: hasAnimated ? "translateY(0)" : "translateY(10px)",
                transition: "opacity 600ms ease-out 300ms, transform 600ms ease-out 300ms",
              }}
            >
              Scores range from <strong style={{ fontWeight: 600, color: B.navy }}>0–100</strong>. Higher scores indicate stronger income stability.
            </p>

            {/* Credibility signal */}
            <p
              style={{
                fontWeight: 400,
                fontSize: 14,
                letterSpacing: "0.02em",
                color: "rgba(14,26,43,0.60)",
                marginTop: 18,
                marginBottom: 18,
                opacity: hasAnimated ? 1 : 0,
                transform: hasAnimated ? "translateY(0)" : "translateY(10px)",
                transition: "opacity 600ms ease-out 380ms, transform 600ms ease-out 380ms",
              }}
            >
              Built on deterministic structural scoring.<br />
              RunPayway Model RP-1.0.
            </p>

            {/* CTA Button */}
            <div
              style={{
                opacity: hasAnimated ? 1 : 0,
                transform: hasAnimated ? "translateY(0)" : "translateY(10px)",
                transition: "opacity 500ms ease-out 450ms, transform 500ms ease-out 450ms",
              }}
            >
              <Link
                href="/pricing"
                className="inline-flex items-center justify-center font-semibold
                           focus:outline-none focus:ring-2 focus:ring-offset-2"
                style={{
                  height: 54,
                  paddingLeft: 32,
                  paddingRight: 32,
                  borderRadius: 12,
                  background: B.purple,
                  color: "#ffffff",
                  fontSize: 15,
                  letterSpacing: "-0.01em",
                  border: "1px solid rgba(75,63,174,0.90)",
                  boxShadow: "0 8px 24px rgba(75,63,174,0.25)",
                  transition: "background 180ms ease, transform 180ms ease, box-shadow 180ms ease",
                  // @ts-expect-error focus ring
                  "--tw-ring-color": B.teal,
                }}
                onMouseEnter={(e) => {
                  const t = e.currentTarget;
                  t.style.background = "#3D33A0";
                  t.style.transform = "translateY(-1px)";
                  t.style.boxShadow = "0 12px 32px rgba(75,63,174,0.35)";
                }}
                onMouseLeave={(e) => {
                  const t = e.currentTarget;
                  t.style.background = B.purple;
                  t.style.transform = "translateY(0)";
                  t.style.boxShadow = "0 8px 24px rgba(75,63,174,0.25)";
                }}
                onMouseDown={(e) => { e.currentTarget.style.transform = "translateY(0)"; }}
              >
                Get My Income Stability Score
              </Link>

              <p
                className="text-[13px] md:text-[14px]"
                style={{ color: "rgba(14,26,43,0.42)", marginTop: 14, letterSpacing: "0.01em" }}
              >
                Takes under 2 minutes &mdash; Instant results
              </p>
            </div>
          </div>

          {/* Right — Floating Score (no card) */}
          <div className="flex-1 flex justify-center lg:justify-end" style={{ position: "relative" }}>
            {/* Very faint radial glow behind the score */}
            <div
              className="absolute pointer-events-none"
              style={{
                width: 500,
                height: 500,
                borderRadius: "50%",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
                background: "radial-gradient(circle, rgba(75,63,174,0.035) 0%, transparent 60%)",
              }}
            />

            {/* Concentric scoring rings */}
            <div
              className="absolute pointer-events-none"
              style={{
                width: 380,
                height: 380,
                borderRadius: "50%",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
                border: "1.5px solid rgba(75,63,174,0.06)",
              }}
            />
            <div
              className="absolute pointer-events-none"
              style={{
                width: 260,
                height: 260,
                borderRadius: "50%",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
                border: "1px solid rgba(75,63,174,0.05)",
              }}
            />
            <div
              className="absolute pointer-events-none"
              style={{
                width: 160,
                height: 160,
                borderRadius: "50%",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
                border: "1px solid rgba(75,63,174,0.04)",
              }}
            />

            {/* Score typography — floating in space */}
            <div
              className="relative text-center lg:text-right"
              style={{
                opacity: cardVisible ? 1 : 0,
                transform: cardVisible ? "translateY(0)" : "translateY(24px)",
                transition: "opacity 800ms cubic-bezier(0.16, 1, 0.3, 1), transform 800ms cubic-bezier(0.16, 1, 0.3, 1)",
                padding: "40px 0",
              }}
            >
              {/* Label */}
              <div
                className="font-medium uppercase text-[10px] md:text-[11px]"
                style={{
                  letterSpacing: "0.16em",
                  color: "rgba(14,26,43,0.35)",
                  marginBottom: 24,
                }}
              >
                Your Income Stability Score
              </div>

              {/* Score number — gradient text */}
              <div
                className="text-[100px] md:text-[128px] lg:text-[148px] font-semibold leading-none"
                style={{
                  background: `linear-gradient(135deg, ${B.navy} 0%, ${B.purple} 100%)`,
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                  letterSpacing: "-0.05em",
                  marginBottom: 6,
                  fontFeatureSettings: "'tnum'",
                }}
              >
                {score}
              </div>

              {/* Classification */}
              <div
                className="text-[20px] md:text-[24px] font-medium"
                style={{
                  color: B.purple,
                  letterSpacing: "-0.01em",
                }}
              >
                Established Stability
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* No divider — flows into classification */}

      {/* Mobile overrides */}
      <style>{`
        @media (max-width: 768px) {
          section:first-of-type > div:nth-child(2) {
            padding-top: 100px !important;
            padding-bottom: 120px !important;
          }
        }
      `}</style>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* MAIN LANDING PAGE                                                    */
/* ------------------------------------------------------------------ */
export default function LandingPage() {
  const [openIndustry, setOpenIndustry] = useState<number | null>(null);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  return (
    <div className="overflow-x-hidden">

      {/* ============ 1. HERO — Financial Platform ============ */}
      <HeroSection />

      {/* ============ HOW IT WORKS — Financial Scoring Pipeline ============ */}
      <HowItWorks />

      {/* ============ CONTINUOUS CANVAS: Factors → Classification → Report ============ */}
      <div className="grain-overlay" style={{ position: "relative", background: "linear-gradient(180deg, #ffffff 0%, #FAFAF8 3%, #F7F6F3 8%, #F4F1EA 25%, #F4F1EA 75%, #F4F1EA 100%)" }}>

      {/* ============ SCORING FACTORS — Model Input Framework ============ */}
      <ScoringFactors />

      {/* Elegant divider */}
      <div className="section-divider-elegant" style={{ padding: "0 40px" }}>
        <div className="divider-dot" />
      </div>

      {/* ============ INCOME STABILITY CLASSIFICATION — after factors for context ============ */}
      <section style={{ paddingTop: 120, paddingBottom: 120, position: "relative" }}>

        <div className="max-w-[1100px] mx-auto px-5 sm:px-6" style={{ position: "relative", zIndex: 1 }}>
          {/* Header */}
          <div className="text-center" style={{ marginBottom: 56 }}>
            <div className="text-[10px] font-semibold uppercase tracking-[0.2em] mb-4" style={{ color: B.light }}>
              Official Scoring Framework · Model RP-1.0
            </div>
            <h2 className="text-[24px] sm:text-[30px] md:text-[34px] font-semibold leading-tight" style={{ color: B.navy, marginBottom: 16 }}>
              Income Stability Classification Scale
            </h2>
            <p className="text-base leading-relaxed mx-auto" style={{ color: B.muted, maxWidth: 600 }}>
              The Income Stability Score™ places every income structure on a standardized 0–100 scale and classifies it into one of four stability tiers.
            </p>
            <p
              className="mx-auto"
              style={{
                fontWeight: 400,
                fontSize: 16,
                lineHeight: 1.7,
                color: "rgba(14,26,43,0.70)",
                maxWidth: 620,
                marginTop: 14,
              }}
            >
              Your score reveals how resilient your income structure is — and where it can become stronger.
            </p>
          </div>

          {/* Spectrum bar with tick marks */}
          <div className="mx-auto" style={{ maxWidth: 880, marginBottom: 0 }}>
            <div style={{ position: "relative" }}>
              <div style={{ height: 14, borderRadius: "10px 10px 0 0", background: B.gradient, boxShadow: "0 2px 12px rgba(14,26,43,0.12)" }} />
              {/* Tier separators */}
              {[39, 59, 79].map((pos) => (
                <div
                  key={pos}
                  style={{
                    position: "absolute",
                    left: `${pos}%`,
                    top: 0,
                    width: 2,
                    height: 14,
                    backgroundColor: "rgba(255,255,255,0.45)",
                  }}
                />
              ))}
              {/* Score marker */}
              <div style={{ position: "absolute", left: "78%", top: -4, width: 22, height: 22, borderRadius: 999, border: "3px solid #fff", backgroundColor: B.teal, transform: "translateX(-50%)", boxShadow: "0 2px 8px rgba(31,109,122,0.35)" }} />
              {/* Tick labels */}
              <div className="flex justify-between px-1" style={{ marginTop: 6 }}>
                {[0, 20, 40, 60, 80, 100].map((tick) => (
                  <span key={tick} className="text-[9px] font-medium" style={{ color: B.light }}>{tick}</span>
                ))}
              </div>
            </div>
          </div>

          {/* Four tier cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4" style={{ gap: 16, maxWidth: 880, margin: "24px auto 0" }}>
            {[
              { range: "0\u201339", label: "Limited", summary: "Fragile", desc: "Income heavily dependent on active work. Income stops when work stops. No structural support.", color: "#DC2626", active: false },
              { range: "40\u201359", label: "Developing", summary: "Partial", desc: "Some recurring elements exist but income still depends primarily on active effort. Early structural support.", color: "#F59E0B", active: false },
              { range: "60\u201379", label: "Established", summary: "Resilient", desc: "Diversified sources with meaningful forward visibility. Can absorb disruption without income loss.", color: B.teal, active: true },
              { range: "80\u2013100", label: "High", summary: "Durable", desc: "Income continues with minimal active effort. Multiple persistent revenue sources provide structural durability.", color: B.navy, active: false },
            ].map((tier) => (
              <div
                key={tier.label}
                style={{
                  backgroundColor: tier.active ? "#ffffff" : "rgba(255,255,255,0.7)",
                  backdropFilter: tier.active ? "none" : "blur(8px)",
                  borderRadius: 14,
                  border: tier.active ? `1.5px solid ${B.teal}` : "1px solid rgba(14,26,43,0.06)",
                  padding: "28px 22px 30px",
                  position: "relative" as const,
                  boxShadow: tier.active
                    ? `0 4px 20px rgba(31,109,122,0.12), 0 12px 40px rgba(31,109,122,0.06)`
                    : "0 1px 4px rgba(14,26,43,0.03), 0 4px 16px rgba(14,26,43,0.02)",
                  transition: "box-shadow 400ms ease, transform 400ms ease",
                }}
                onMouseEnter={(e) => {
                  if (!tier.active) {
                    e.currentTarget.style.boxShadow = "0 4px 16px rgba(14,26,43,0.06), 0 12px 40px rgba(14,26,43,0.05)";
                    e.currentTarget.style.transform = "translateY(-2px)";
                  }
                }}
                onMouseLeave={(e) => {
                  if (!tier.active) {
                    e.currentTarget.style.boxShadow = "0 1px 4px rgba(14,26,43,0.03), 0 4px 16px rgba(14,26,43,0.02)";
                    e.currentTarget.style.transform = "translateY(0)";
                  }
                }}
              >
                {/* Active tier badge */}
                {tier.active && (
                  <div
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: 6,
                      padding: "4px 10px",
                      borderRadius: 999,
                      backgroundColor: "rgba(31,109,122,0.08)",
                      marginBottom: 14,
                    }}
                  >
                    <span style={{ width: 6, height: 6, borderRadius: 999, backgroundColor: B.teal }} />
                    <span className="text-[9px] font-semibold uppercase tracking-[0.1em]" style={{ color: B.teal }}>
                      Sample Score: 78
                    </span>
                  </div>
                )}

                {/* Color accent + range */}
                <div className="flex items-center gap-3 mb-3">
                  <div style={{ width: 4, height: 36, borderRadius: 4, backgroundColor: tier.color }} />
                  <div className="text-[26px] font-bold leading-none" style={{ color: B.navy }}>{tier.range}</div>
                </div>

                {/* Tier label */}
                <div className="text-[15px] font-semibold mb-1" style={{ color: tier.color }}>
                  {tier.label} Stability
                </div>

                {/* One-word summary */}
                <div className="text-[10px] font-medium uppercase tracking-wider mb-3" style={{ color: B.light }}>
                  {tier.summary} income structure
                </div>

                {/* Description */}
                <p className="text-[12px] leading-[1.7]" style={{ color: B.muted }}>
                  {tier.desc}
                </p>
              </div>
            ))}
          </div>

          {/* Model reference */}
          <div className="text-center" style={{ marginTop: 48 }}>
            <p className="text-[12px] font-medium" style={{ color: B.muted }}>
              Classifications are fixed under <strong style={{ color: B.navy }}>Model RP-1.0</strong> and reflect income structure at the time the assessment is completed.
            </p>
            <p className="text-[11px] mt-2" style={{ color: B.light }}>
              Band thresholds are deterministic and do not change between assessments.
            </p>
          </div>
        </div>
      </section>

      {/* Elegant divider */}
      <div className="section-divider-elegant" style={{ padding: "0 40px" }}>
        <div className="divider-dot" />
      </div>

      {/* ============ MID-PAGE CONVERSION STRIP ============ */}
      <div
        className="conversion-strip"
        style={{
          background: "#F4F1EA",
          border: "1px solid rgba(14,26,43,0.08)",
          padding: "22px 40px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          maxWidth: 920,
          margin: "0 auto",
          borderRadius: 14,
        }}
      >
        <p
          style={{
            fontWeight: 500,
            fontSize: 16,
            color: "#0E1A2B",
            margin: 0,
          }}
        >
          Measure your Income Stability in under 2 minutes.
        </p>
        <Link
          href="/pricing"
          className="conversion-strip-cta inline-flex items-center justify-center font-semibold whitespace-nowrap
                     focus:outline-none focus:ring-2"
          style={{
            height: 40,
            paddingLeft: 18,
            paddingRight: 18,
            borderRadius: 10,
            background: "#0E1A2B",
            color: "#F4F1EA",
            fontSize: 14,
            border: "none",
            transition: "background-color 180ms ease",
            flexShrink: 0,
            // @ts-expect-error focus ring
            "--tw-ring-color": "#1F6D7A",
          }}
          onMouseEnter={(e) => { e.currentTarget.style.background = "#4B3FAE"; }}
          onMouseLeave={(e) => { e.currentTarget.style.background = "#0E1A2B"; }}
        >
          Get My Income Stability Score
        </Link>
      </div>

      <style>{`
        @media (max-width: 720px) {
          .conversion-strip {
            flex-direction: column !important;
            align-items: flex-start !important;
            gap: 14px;
            padding: 22px 24px !important;
          }
          .conversion-strip p {
            font-size: 15px !important;
          }
          .conversion-strip-cta {
            width: 100% !important;
          }
        }
      `}</style>

      {/* ============ PREVIEW YOUR SCORE REPORT ============ */}
      <PreviewYourScoreReport />

      </div>{/* ← end continuous canvas */}

      {/* ============ INDUSTRY PATTERNS — Real-World Context ============ */}
      <section style={{ background: "linear-gradient(180deg, #F4F1EA 0%, #FAFAF8 8%, #ffffff 20%, #ffffff 100%)", paddingTop: 120, paddingBottom: 140 }}>
      <div className="max-w-[1100px] mx-auto px-5 sm:px-6 text-center">
        <h2 className="text-[24px] sm:text-[30px] md:text-[34px] font-semibold leading-tight" style={{ color: B.navy, marginBottom: 16 }}>
          How Income Structures Become More Stable
        </h2>
        <p className="text-base leading-relaxed mx-auto" style={{ color: B.muted, marginBottom: 40, maxWidth: 640 }}>
          High-stability income systems tend to share common structural characteristics, regardless of profession.
        </p>
        <p className="text-[13px] mx-auto" style={{ color: B.light, marginBottom: 32, maxWidth: 640 }}>
          Explore structural patterns that increase income stability.
        </p>

        <div className="flex flex-col gap-3 text-left" style={{ maxWidth: 720, margin: "0 auto" }}>
          {INDUSTRY_EXAMPLES.map((ex, i) => {
            const isOpen = openIndustry === i;
            const colors = [B.navy, B.purple, B.teal];
            const cardColor = colors[i];
            return (
              <div
                key={ex.industry}
                className="overflow-hidden"
                style={{
                  borderColor: isOpen ? cardColor : "rgba(14,26,43,0.06)",
                  backgroundColor: "#ffffff",
                  borderWidth: 1,
                  borderStyle: "solid",
                  borderRadius: 14,
                  boxShadow: "0 1px 3px rgba(14,26,43,0.04), 0 4px 16px rgba(14,26,43,0.03)",
                  transition: "box-shadow 300ms ease, border-color 300ms ease, transform 300ms ease",
                }}
              >
                <button
                  onClick={() => setOpenIndustry(isOpen ? null : i)}
                  className="w-full px-5 sm:px-6 py-4 sm:py-5 flex items-center justify-between gap-4 transition-colors"
                  style={{ background: isOpen
                    ? (i === 0 ? "linear-gradient(135deg, #0E1A2B 0%, #1a2a3f 100%)"
                       : i === 1 ? "linear-gradient(135deg, #4B3FAE 0%, #5a4cc0 100%)"
                       : "linear-gradient(135deg, #1F6D7A 0%, #287d8c 100%)")
                    : "#ffffff" }}
                >
                  <span className="text-[14px] sm:text-[15px] font-semibold" style={{ color: isOpen ? "#ffffff" : B.navy }}>
                    {ex.industry}
                  </span>
                  <svg
                    width="20" height="20" viewBox="0 0 20 20" fill="none"
                    className="shrink-0 transition-transform duration-300"
                    style={{ transform: isOpen ? "rotate(180deg)" : "rotate(0deg)" }}
                  >
                    <path d="M5 8l5 5 5-5" stroke={isOpen ? "#ffffff" : B.light} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </button>
                <div
                  className="transition-all duration-300 ease-in-out overflow-hidden"
                  style={{ maxHeight: isOpen ? 400 : 0, opacity: isOpen ? 1 : 0 }}
                >
                  <div className="px-5 sm:px-6 py-5 sm:py-6">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-8">
                      <div>
                        <div className="text-[10px] font-semibold uppercase tracking-wider" style={{ color: B.teal, marginBottom: 12 }}>
                          More Stable Income Systems Often Include
                        </div>
                        <ul style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                          {ex.stable.map((item) => (
                            <li key={item} className="flex items-start gap-2.5 text-[13px] sm:text-[14px]" style={{ color: B.muted }}>
                              <span className="mt-2 w-1.5 h-1.5 rounded-full shrink-0" style={{ backgroundColor: B.teal }} />
                              {item}
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <div className="text-[10px] font-semibold uppercase tracking-wider" style={{ color: B.light, marginBottom: 12 }}>
                          Common Sources of Instability
                        </div>
                        <ul style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                          {ex.unstable.map((item) => (
                            <li key={item} className="flex items-start gap-2.5 text-[13px] sm:text-[14px]" style={{ color: B.muted }}>
                              <span className="mt-2 w-1.5 h-1.5 rounded-full shrink-0" style={{ backgroundColor: B.light }} />
                              {item}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
      </section>


      {/* ============ WHY INCOME STABILITY MATTERS ============ */}
      <WhyIncomeStabilityMatters />

      {/* ============ SCORE REGISTRY ============ */}
      <ScoreRegistry />

      {/* ============ FAQ ============ */}
      <FaqSection openFaq={openFaq} setOpenFaq={setOpenFaq} />

      {/* ============ FINAL CTA — Premium Assessment Entry ============ */}
      <FinalCta />

      {/* ============ MODEL GOVERNANCE ============ */}
      <ModelGovernance />

      {/* ============ DISCLAIMER ============ */}
      <Disclaimer />
    </div>
  );
}
