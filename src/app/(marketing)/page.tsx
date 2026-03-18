"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useLanguage } from "@/lib/i18n";

/* Guard for hover-capable devices — prevents stuck states on iOS */
const canHover = () => typeof window !== "undefined" && window.matchMedia("(hover: hover)").matches;

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

/* Bidirectional variant — does NOT disconnect, so visible toggles on/off as you scroll */
function useInViewBidi(threshold = 0.1) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => setVisible(entry.isIntersecting),
      { threshold },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);

  return { ref, visible };
}

/* Runtime mobile detection — bypasses CSS entirely */
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

/* ────────────────────────────────────────────────────────────────────
   DESIGN TOKENS — Enterprise spacing scale (8px base unit)
   Every value is deliberate. Nothing is arbitrary.
   ──────────────────────────────────────────────────────────────────── */
const S = {
  /* Section vertical rhythm */
  sectionY:     { desktop: 140, mobile: 80 },   /* primary section padding */
  sectionYsm:   { desktop: 120, mobile: 72 },   /* secondary (lighter sections) */
  transitionY:  { desktop: 72, mobile: 48 },     /* pillar transitions */
  disclaimerY:  { desktop: 64, mobile: 48 },     /* compressed institutional */

  /* Container */
  maxW:         1100,                             /* content max-width */
  padX:         { desktop: 40, mobile: 24 },     /* horizontal gutter */

  /* Typography rhythm */
  h1mb:         24,    /* hero heading → subtext */
  h2mb:         20,    /* section heading → subtext */
  subtextMb:    48,    /* subtext → content block */
  paraMb:       20,    /* between body paragraphs */
  labelMb:      16,    /* eyebrow label → heading */

  /* Component spacing */
  cardPad:      { desktop: 32, mobile: 24 },
  cardRadius:   16,
  panelRadius:  20,
  gridGap:      20,
  gridGapSm:    16,

  /* CTA buttons */
  ctaH:         52,    /* primary CTA height */
  ctaHsm:       44,    /* secondary CTA height */
  ctaPadX:      28,    /* CTA horizontal padding */
  ctaRadius:    12,    /* CTA border radius */

  /* Line heights */
  lhHeading:    1.1,
  lhBody:       1.7,
  lhDense:      1.5,

  /* Letter spacing */
  lsHeading:    "-0.02em",
  lsHero:       "-0.03em",
  lsLabel:      "0.12em",
};

// INDUSTRY_EXAMPLES moved inside LandingPage to access translations


/* ------------------------------------------------------------------ */
/* GLOBAL DISCLAIMER — institutional disclosure                         */
/* ------------------------------------------------------------------ */
function Disclaimer() {
  const { ref, visible } = useInView();
  const mobile = useMobile();
  const { t } = useLanguage();

  return (
    <section
      ref={ref}
      aria-label="Global Disclaimer"
      className="relative overflow-hidden"
      style={{ background: B.navy }}
    >
      <div
        className="relative mx-auto"
        style={{
          maxWidth: S.maxW,
          paddingTop: mobile ? S.disclaimerY.mobile : S.disclaimerY.desktop,
          paddingBottom: mobile ? S.disclaimerY.mobile : S.disclaimerY.desktop,
          paddingLeft: mobile ? S.padX.mobile : S.padX.desktop,
          paddingRight: mobile ? S.padX.mobile : S.padX.desktop,
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
            background: "linear-gradient(90deg, transparent, rgba(244,241,234,0.12), transparent)",
            marginBottom: 36,
            marginLeft: "auto",
            marginRight: "auto",
          }}
        />

        {/* Label */}
        <h2
          className="font-semibold uppercase text-[11px] md:text-[12px]"
          style={{
            color: "#ffffff",
            letterSpacing: S.lsLabel,
            marginBottom: 12,
            textAlign: "center",
          }}
        >
          {t.home.disclaimerTitle}
        </h2>

        {/* Disclosure text */}
        <div style={{ maxWidth: 720, marginLeft: "auto", marginRight: "auto", textAlign: "center" }}>
          <p
            className="text-[14px] md:text-[15px]"
            style={{
              color: "rgba(244,241,234,0.55)",
              lineHeight: S.lhBody,
              marginBottom: 10,
            }}
          >
            {t.home.disclaimerBody1}
          </p>
          <p
            className="text-[14px] md:text-[15px]"
            style={{
              color: "rgba(244,241,234,0.55)",
              lineHeight: 1.7,
            }}
          >
            {t.home.disclaimerBody2}
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
  const mobile = useMobile();
  const { t } = useLanguage();

  return (
    <section
      ref={ref}
      aria-label="Get Your Income Stability Score"
      className="relative navy-grain"
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
          maxWidth: S.maxW,
          paddingTop: mobile ? S.sectionY.mobile : S.sectionY.desktop,
          paddingBottom: mobile ? S.sectionY.mobile : S.sectionY.desktop,
          paddingLeft: mobile ? S.padX.mobile : S.padX.desktop,
          paddingRight: mobile ? S.padX.mobile : S.padX.desktop,
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
              lineHeight: S.lhHeading,
              letterSpacing: S.lsHero,
              maxWidth: 640,
              margin: `0 auto ${S.h2mb}px auto`,
            }}
          >
            {t.home.ctaTitle}
          </h2>

          {/* Supporting line */}
          <p
            className="text-[17px] md:text-[19px] lg:text-[20px]"
            style={{
              color: "rgba(244,241,234,0.80)",
              lineHeight: S.lhBody,
              maxWidth: 560,
              margin: `0 auto ${S.subtextMb}px auto`,
            }}
          >
            {t.home.ctaBody}
          </p>

          {/* CTA Button */}
          <div className="flex justify-center">
            <Link
              href="/pricing"
              className="cta-tick inline-flex items-center justify-center font-semibold
                         focus:outline-none focus:ring-2 focus:ring-offset-2"
              style={{
                height: S.ctaH,
                minWidth: mobile ? 0 : 320,
                width: mobile ? "100%" : "auto",
                paddingLeft: S.ctaPadX,
                paddingRight: S.ctaPadX,
                borderRadius: S.ctaRadius,
                background: "linear-gradient(135deg, #F4F1EA 0%, #EDECEA 100%)",
                color: B.navy,
                fontSize: 16,
                letterSpacing: "-0.01em",
                border: "1px solid rgba(244,241,234,0.92)",
                boxShadow: "inset 0 1px 0 rgba(255,255,255,0.5), 0 12px 32px rgba(0,0,0,0.25), 0 2px 6px rgba(0,0,0,0.15)",
                transition: "background-color 180ms ease, border-color 180ms ease, transform 180ms ease, box-shadow 180ms ease",

              }}
              onMouseEnter={(e) => {
                 if (!canHover()) return;
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
              <span className="tick tick-navy" />
              <span className="cta-label">{t.nav.getMyScoreFull}</span>
              <span className="cta-arrow cta-arrow-navy" />
            </Link>
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
            {t.home.ctaPrice}
          </p>

          {/* Microcopy */}
          <p
            className="text-[14px] md:text-[15px]"
            style={{
              color: "rgba(244,241,234,0.66)",
              lineHeight: 1.6,
            }}
          >
            Average completion: 1 min 47 sec &#8212; Instant results
          </p>
          <p
            className="text-[12px] md:text-[13px]"
            style={{
              color: "rgba(244,241,234,0.45)",
              lineHeight: 1.6,
              marginTop: 8,
              maxWidth: 440,
              textAlign: "center" as const,
              marginLeft: "auto",
              marginRight: "auto",
            }}
          >
            Most first-time assessments score between 35&#8211;55. If your income depends on active work or a few key clients, this assessment quantifies that risk.
          </p>
        </div>
      </div>

      {/* Mobile overrides */}
      <style>{`
        @media (max-width: 768px) {
          section[aria-label="Get Your Income Stability Score"] > div:last-of-type {
            padding-top: 80px !important;
            padding-bottom: 80px !important;
            padding-left: 24px !important;
            padding-right: 24px !important;
          }
          section[aria-label="Get Your Income Stability Score"] a {
            min-width: 0 !important;
            width: 100% !important;
            height: 52px !important;
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

      {/* Clean edge — no wave */}
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* MODEL GOVERNANCE — scroll-reveal section                             */
/* ------------------------------------------------------------------ */
function ModelGovernance() {
  const { ref, visible } = useInView();
  const mobile = useMobile();
  const { t } = useLanguage();

  return (
    <section
      ref={ref}
      aria-label="Model Governance"
      style={{
        backgroundColor: B.purple,
        paddingTop: mobile ? S.sectionY.mobile : S.sectionY.desktop,
        paddingBottom: mobile ? S.sectionY.mobile : S.sectionY.desktop,
        position: "relative",
        overflow: "hidden",
      }}
    >
      <div style={{ maxWidth: S.maxW, marginLeft: "auto", marginRight: "auto", position: "relative", zIndex: 1, paddingLeft: mobile ? S.padX.mobile : S.padX.desktop, paddingRight: mobile ? S.padX.mobile : S.padX.desktop, textAlign: "center" }}>
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
              color: "#F4F1EA",
              fontWeight: 600,
              lineHeight: S.lhHeading,
              letterSpacing: S.lsHeading,
              marginBottom: S.h2mb,
            }}
          >
            {t.home.governanceTitle}
          </h2>

          <div style={{ maxWidth: 640, marginLeft: "auto", marginRight: "auto" }}>
            <p className="text-[16px] md:text-[18px]" style={{ color: "rgba(244,241,234,0.75)", fontWeight: 400, lineHeight: S.lhBody, marginBottom: S.paraMb }}>
              {t.home.governanceBody}
            </p>
            <p className="text-[16px] md:text-[18px]" style={{ color: "rgba(244,241,234,0.75)", fontWeight: 500, lineHeight: S.lhBody }}>
              {t.home.governanceFuture}
            </p>
          </div>
        </div>

        {/* Governance reference panel */}
        <article
          style={{
            marginTop: S.subtextMb,
            width: "100%",
            maxWidth: 420,
            marginLeft: "auto",
            marginRight: "auto",
            textAlign: "left",
            backgroundColor: "#ffffff",
            border: "1px solid rgba(14,26,43,0.10)",
            borderRadius: S.panelRadius,
            padding: mobile ? S.cardPad.mobile : S.cardPad.desktop,
            boxShadow: "0 16px 44px rgba(0,0,0,0.08)",
            opacity: visible ? 1 : 0,
            transform: visible ? "translateY(0)" : "translateY(14px)",
            transition: "opacity 0.48s ease-out 80ms, transform 0.48s ease-out 80ms",
          }}
        >
          {/* Top accent */}
          <div style={{ width: "100%", height: 2, background: `linear-gradient(90deg, ${B.purple} 0%, transparent 60%)`, borderRadius: 2, marginBottom: 16 }} />

          {/* Panel header */}
          <div
            className="text-[12px] uppercase"
            style={{ color: B.teal, fontWeight: 500, letterSpacing: S.lsLabel, marginBottom: 10 }}
          >
            Model Version
          </div>

          {/* Version value */}
          <div
            className="text-[24px] md:text-[28px]"
            style={{ color: B.navy, fontWeight: 600, letterSpacing: "0.01em", marginBottom: 14 }}
          >
            RP-1.0
          </div>

          {/* Supporting line */}
          <p className="text-[15px]" style={{ color: "rgba(14,26,43,0.55)", fontWeight: 400, lineHeight: 1.6 }}>
            {t.home.scoringFramework}
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
  const mobile = useMobile();
  const { t } = useLanguage();

  const faqItems = [
    { q: t.home.faq1Q, a: t.home.faq1A },
    { q: t.home.faq2Q, a: t.home.faq2A },
    { q: t.home.faq3Q, a: t.home.faq3A },
    { q: t.home.faq4Q, a: t.home.faq4A },
    { q: t.home.faq5Q, a: t.home.faq5A },
  ];

  return (
    <section
      ref={ref}
      aria-label="FAQ"
      className="relative overflow-hidden navy-grain"
      style={{
        backgroundColor: B.navy,
        paddingTop: mobile ? S.sectionY.mobile : S.sectionY.desktop,
        paddingBottom: mobile ? S.sectionY.mobile : S.sectionY.desktop,
        position: "relative",
        overflow: "hidden",
      }}
    >

      {/* Ambient glows */}
      <div style={{ position: "absolute", top: "-20%", right: "-10%", width: 600, height: 600, borderRadius: "50%", background: "radial-gradient(circle, rgba(75,63,174,0.07) 0%, transparent 65%)", pointerEvents: "none" }} />
      <div style={{ position: "absolute", bottom: "-15%", left: "-8%", width: 500, height: 500, borderRadius: "50%", background: "radial-gradient(circle, rgba(31,109,122,0.05) 0%, transparent 60%)", pointerEvents: "none" }} />

      <div style={{ maxWidth: S.maxW, marginLeft: "auto", marginRight: "auto", position: "relative", zIndex: 1, paddingLeft: mobile ? S.padX.mobile : S.padX.desktop, paddingRight: mobile ? S.padX.mobile : S.padX.desktop }}>
        {/* Header */}
        <div
          style={{
            textAlign: mobile ? "left" : "center",
            opacity: visible ? 1 : 0,
            transform: visible ? "translateY(0)" : "translateY(12px)",
            transition: "opacity 0.5s ease-out, transform 0.5s ease-out",
          }}
        >
          <h2
            style={{
              textAlign: mobile ? "left" : "center",
              fontSize: mobile ? 32 : 40,
              color: "#F4F1EA",
              fontWeight: 600,
              lineHeight: S.lhHeading,
              letterSpacing: S.lsHeading,
              marginBottom: S.h2mb,
            }}
          >
            {t.home.faqTitle}
          </h2>
          <p
            style={{
              textAlign: mobile ? "left" : "center",
              fontSize: mobile ? 16 : 18,
              color: "rgba(244,241,234,0.78)",
              fontWeight: 400,
              lineHeight: S.lhBody,
              maxWidth: 680,
              margin: "0 auto",
              marginBottom: S.subtextMb,
            }}
          >
            {t.home.faqSubtitle}
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
                      paddingRight: mobile ? 16 : 48,
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
  const mobile = useMobile();
  const { t } = useLanguage();

  const fields = [
    { label: "Registry ID", value: "RP-A7E2F1B3" },
    { label: "Score Result", value: "78 \u2014 Established Stability" },
    { label: "Model Version", value: "RP-1.0", purple: true },
    { label: "Timestamp", value: "2026-03-10 14:42 UTC" },
  ];

  return (
    <section
      ref={ref}
      aria-label="Score Registry"
      style={{
        backgroundColor: "#F4F1EA",
        paddingTop: mobile ? S.sectionY.mobile : S.sectionY.desktop,
        paddingBottom: mobile ? S.sectionY.mobile : S.sectionY.desktop,
        position: "relative",
        overflow: "hidden",
      }}
    >
      <div style={{ maxWidth: S.maxW, marginLeft: "auto", marginRight: "auto", position: "relative", zIndex: 1, paddingLeft: mobile ? S.padX.mobile : S.padX.desktop, paddingRight: mobile ? S.padX.mobile : S.padX.desktop }}>
        <div
          style={{ display: "flex", flexDirection: "column", alignItems: "center", rowGap: S.subtextMb }}
        >
          {/* Header text */}
          <div
            style={{
              maxWidth: 640,
              textAlign: "center",
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
                letterSpacing: S.lsHeading,
                marginBottom: S.h2mb,
              }}
            >
              {t.home.registryTitle}
            </h2>

            <p className="text-[16px] md:text-[18px]" style={{ color: "rgba(14,26,43,0.78)", fontWeight: 400, lineHeight: S.lhBody, marginBottom: S.paraMb }}>
              {t.home.registrySubtitle}
            </p>
            <p className="text-[16px] md:text-[18px]" style={{ color: "rgba(14,26,43,0.78)", fontWeight: 500, lineHeight: S.lhBody }}>
              {t.home.registryVerify}
            </p>
          </div>

          {/* Registry preview panel */}
          <article
            style={{
              width: "100%",
              maxWidth: 420,
              backgroundColor: "#ffffff",
              border: "1px solid rgba(14,26,43,0.08)",
              borderRadius: S.panelRadius,
              padding: mobile ? S.cardPad.mobile : S.cardPad.desktop,
              boxShadow: "inset 0 1px 0 rgba(255,255,255,0.8), 0 20px 60px rgba(14,26,43,0.10), 0 4px 12px rgba(14,26,43,0.04)",
              position: "relative",
              overflow: "hidden",
              alignSelf: "center",
              opacity: visible ? 1 : 0,
              transform: visible ? "translateY(0)" : "translateY(14px)",
              transition: "opacity 0.5s ease-out 100ms, transform 0.5s ease-out 100ms, border-color 0.2s ease, box-shadow 0.2s ease",
            }}
            onMouseEnter={(e) => {
               if (!canHover()) return;
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
              style={{ color: B.teal, fontWeight: 500, letterSpacing: S.lsLabel, marginBottom: 18 }}
            >
              {t.home.registryRecord}
            </div>

            {/* Field list */}
            <div style={{ display: "grid", rowGap: S.paraMb }}>
              {fields.map((field, i) => (
                <div key={field.label}>
                  <div
                    className="text-[11px] uppercase"
                    style={{ color: "rgba(14,26,43,0.52)", fontWeight: 500, letterSpacing: S.lsLabel, marginBottom: 5 }}
                  >
                    {field.label}
                  </div>
                  <div
                    className="text-[15px] md:text-[16px]"
                    style={{ color: field.purple ? B.purple : B.navy, fontWeight: 500, lineHeight: S.lhDense }}
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
  const mobile = useMobile();
  const { t } = useLanguage();

  return (
    <section
      ref={ref}
      aria-label="Why Income Stability Matters"
      className="relative"
      style={{
        backgroundColor: "#0E1A2B",
        paddingTop: mobile ? S.sectionY.mobile + 20 : S.sectionY.desktop + 32,
        paddingBottom: mobile ? S.sectionY.mobile + 20 : S.sectionY.desktop + 32,
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Architectural grid — precision texture */}
      <svg className="absolute inset-0 pointer-events-none" style={{ width: "100%", height: "100%", opacity: 0.04 }}>
        <defs>
          <pattern id="navyGrid" width="60" height="60" patternUnits="userSpaceOnUse">
            <line x1="60" y1="0" x2="60" y2="60" stroke="#ffffff" strokeWidth="0.5" />
            <line x1="0" y1="60" x2="60" y2="60" stroke="#ffffff" strokeWidth="0.5" />
          </pattern>
          <radialGradient id="navyGridFade" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0" />
            <stop offset="40%" stopColor="#ffffff" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#ffffff" stopOpacity="1" />
          </radialGradient>
          <mask id="navyGridMask">
            <rect width="100%" height="100%" fill="url(#navyGridFade)" />
          </mask>
        </defs>
        <rect width="100%" height="100%" fill="url(#navyGrid)" mask="url(#navyGridMask)" />
      </svg>

      {/* Diagnostic pulse line */}
      <div style={{ position: "absolute", top: "38%", left: 0, right: 0, height: 1, overflow: "hidden", pointerEvents: "none" }}>
        <div style={{ position: "absolute", top: 0, left: 0, width: "50%", height: "100%", background: "linear-gradient(90deg, transparent 0%, rgba(31,109,122,0.12) 40%, rgba(75,63,174,0.15) 60%, transparent 100%)", animation: "pulseSweep 8s ease-in-out infinite" }} />
      </div>
      <div style={{ position: "absolute", top: "68%", left: 0, right: 0, height: 1, overflow: "hidden", pointerEvents: "none" }}>
        <div style={{ position: "absolute", top: 0, left: 0, width: "40%", height: "100%", background: "linear-gradient(90deg, transparent 0%, rgba(75,63,174,0.10) 40%, rgba(31,109,122,0.12) 60%, transparent 100%)", animation: "pulseSweep 12s ease-in-out 3s infinite" }} />
      </div>

      {/* Ambient glows */}
      <div style={{ position: "absolute", top: "-18%", right: "-10%", width: 700, height: 700, borderRadius: "50%", background: "radial-gradient(circle, rgba(31,109,122,0.04) 0%, transparent 65%)", pointerEvents: "none" }} />
      <div style={{ position: "absolute", bottom: "-12%", left: "-6%", width: 500, height: 500, borderRadius: "50%", background: "radial-gradient(circle, rgba(75,63,174,0.03) 0%, transparent 60%)", pointerEvents: "none" }} />


      <div style={{ maxWidth: S.maxW, marginLeft: "auto", marginRight: "auto", position: "relative", zIndex: 1, paddingLeft: mobile ? S.padX.mobile : S.padX.desktop, paddingRight: mobile ? S.padX.mobile : S.padX.desktop }}>
        {/* Comparison panel — static border + subtle animated warmth */}
        <div
          className="mx-auto"
          style={{
            maxWidth: 820,
            marginBottom: mobile ? 32 : 48,
            position: "relative",
            borderRadius: S.panelRadius + 1,
            padding: 1,
            overflow: "hidden",
            opacity: visible ? 1 : 0,
            transform: visible ? "translateY(0)" : "translateY(12px)",
            transition: "opacity 0.5s ease-out, transform 0.5s ease-out",
          }}
        >
          {/* Slow animated gradient — ambient warmth only */}
          <div style={{
            position: "absolute",
            inset: -40,
            background: "conic-gradient(from 0deg, #0E1A2B, #4B3FAE, #1F6D7A, #4B3FAE, #0E1A2B)",
            animation: "borderGlow 60s linear infinite",
            opacity: 0.20,
          }} />
          {/* Inner panel */}
          <div
            style={{
              position: "relative",
              display: "grid",
              gridTemplateColumns: mobile ? "1fr" : "1fr 1fr",
              gap: 0,
              borderRadius: S.panelRadius,
              overflow: "hidden",
              border: "1px solid rgba(75,63,174,0.18)",
              boxShadow: "0 20px 60px rgba(0,0,0,0.30), inset 0 1px 0 rgba(255,255,255,0.04)",
            }}
          >
          {/* Credit Score side */}
          <div style={{ padding: mobile ? "28px 24px 32px" : "36px 36px 40px", backgroundColor: "rgba(255,255,255,0.03)" }}>
            <div
              className="text-[11px] uppercase"
              style={{ color: "rgba(244,241,234,0.40)", fontWeight: 500, letterSpacing: S.lsLabel, marginBottom: 14 }}
            >
              {t.home.whatExists}
            </div>
            <div
              className="text-[20px] md:text-[22px]"
              style={{ color: "rgba(244,241,234,0.70)", fontWeight: 600, letterSpacing: "-0.01em", marginBottom: 12 }}
            >
              {t.home.creditScore}
            </div>
            <p className="text-[15px] md:text-[16px]" style={{ color: "rgba(244,241,234,0.55)", fontWeight: 400, lineHeight: 1.7 }}>
              {t.home.creditScoreDesc}
            </p>
            <p className="text-[14px]" style={{ color: "rgba(244,241,234,0.35)", fontWeight: 400, lineHeight: 1.7, marginTop: 10 }}>
              {t.home.creditScoreMissing}
            </p>
          </div>

          {/* Income Stability Score side */}
          <div style={{ padding: mobile ? "28px 24px 32px" : "36px 36px 40px", backgroundColor: "rgba(75,63,174,0.12)", borderLeft: mobile ? "none" : "1px solid rgba(75,63,174,0.20)", borderTop: mobile ? "1px solid rgba(75,63,174,0.20)" : "none" }}>
            <div
              className="text-[11px] uppercase"
              style={{ color: B.teal, fontWeight: 500, letterSpacing: S.lsLabel, marginBottom: 14 }}
            >
              {t.home.whatsMissing}
            </div>
            <div
              className="text-[20px] md:text-[22px]"
              style={{ color: "#F4F1EA", fontWeight: 600, letterSpacing: "-0.01em", marginBottom: 12 }}
            >
              Income Stability Score&#8482;
            </div>
            <p className="text-[15px] md:text-[16px]" style={{ color: "rgba(244,241,234,0.85)", fontWeight: 400, lineHeight: 1.7 }}>
              {t.home.issDesc}
            </p>
            <p className="text-[14px]" style={{ color: "rgba(244,241,234,0.55)", fontWeight: 400, lineHeight: 1.7, marginTop: 10 }}>
              {t.home.issTagline}
            </p>
          </div>
          </div>
        </div>

        {/* Thin accent rule — visual thread from panel to argument */}
        <div style={{ width: 40, height: 1, backgroundColor: "rgba(75,63,174,0.35)", margin: "0 auto 32px", opacity: visible ? 1 : 0, transition: "opacity 0.5s ease-out 100ms" }} />

        {/* Title */}
        <h2
          className="text-[28px] md:text-[34px]"
          style={{
            color: "#F4F1EA",
            fontWeight: 600,
            letterSpacing: "-0.02em",
            marginBottom: 20,
            textAlign: "center",
            opacity: visible ? 1 : 0,
            transform: visible ? "translateY(0)" : "translateY(12px)",
            transition: "opacity 0.5s ease-out 100ms, transform 0.5s ease-out 100ms",
          }}
        >
          {t.home.whyTitle}
        </h2>

        {/* Body copy — tighter, more deliberate */}
        <div
          style={{
            maxWidth: 620,
            marginLeft: "auto",
            marginRight: "auto",
            textAlign: "center",
            opacity: visible ? 1 : 0,
            transform: visible ? "translateY(0)" : "translateY(12px)",
            transition: "opacity 0.5s ease-out 200ms, transform 0.5s ease-out 200ms",
          }}
        >
          <p
            className="text-[15px] md:text-[17px]"
            style={{ color: "rgba(244,241,234,0.70)", fontWeight: 400, lineHeight: 1.75, marginBottom: 16 }}
          >
            {t.home.whyBody1}
          </p>
          <p
            className="text-[15px] md:text-[17px]"
            style={{ color: "rgba(244,241,234,0.70)", fontWeight: 400, lineHeight: 1.75, marginBottom: 28 }}
          >
            {t.home.whyBody2}
          </p>

          {/* Anchor statement — elevated */}
          <p
            className="text-[17px] md:text-[19px]"
            style={{ color: "rgba(244,241,234,0.95)", fontWeight: 500, lineHeight: 1.5, marginBottom: 28, letterSpacing: "-0.01em" }}
          >
            {t.home.whyCreditDoesnt}<br />
            {t.home.whyScoreDoes}
          </p>

          {/* CTA Button */}
          <div className="flex justify-center">
            <Link
              href="/pricing"
              className="cta-tick inline-flex items-center justify-center font-semibold
                         focus:outline-none focus:ring-2 focus:ring-offset-2"
              style={{
                height: S.ctaH,
                width: mobile ? "100%" : "auto",
                paddingLeft: S.ctaPadX,
                paddingRight: S.ctaPadX,
                borderRadius: S.ctaRadius,
                background: "rgba(75,63,174,0.85)",
                color: "#ffffff",
                fontSize: 14,
                letterSpacing: "-0.01em",
                border: "1px solid rgba(75,63,174,0.50)",
                boxShadow: "0 4px 16px rgba(75,63,174,0.20)",
                transition: "background 180ms ease, transform 180ms ease, box-shadow 180ms ease",

              }}
              onMouseEnter={(e) => {
                 if (!canHover()) return;
const t = e.currentTarget;
                t.style.background = "#3D33A0";
                t.style.transform = "translateY(-1px)";
                t.style.boxShadow = "0 12px 32px rgba(75,63,174,0.40)";
              }}
              onMouseLeave={(e) => {
                const t = e.currentTarget;
                t.style.background = B.purple;
                t.style.transform = "translateY(0)";
                t.style.boxShadow = "0 8px 24px rgba(75,63,174,0.30)";
              }}
              onMouseDown={(e) => { e.currentTarget.style.transform = "translateY(0)"; }}
            >
              <span className="tick tick-white" />
              <span className="cta-label">{t.nav.getMyScoreFull}</span>
              <span className="cta-arrow cta-arrow-white" />
            </Link>
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
  const { t } = useLanguage();
  const { ref, visible } = useInView();
  const mobile = useMobile();

  /* ==================== TRUNCATED PREVIEW — Score + Profile only ==================== */

  return (
    <section
      ref={ref}
      style={{
        paddingTop: mobile ? S.sectionYsm.mobile : S.sectionYsm.desktop,
        paddingBottom: mobile ? S.sectionY.mobile : S.sectionY.desktop,
        position: "relative",
        overflow: "hidden",
      }}
     aria-label="Preview Your Score Report">

      <div style={{ maxWidth: S.maxW, marginLeft: "auto", marginRight: "auto", position: "relative", zIndex: 1, paddingLeft: mobile ? S.padX.mobile : S.padX.desktop, paddingRight: mobile ? S.padX.mobile : S.padX.desktop }}>
        {/* Section header */}
        <h2
          className="text-[32px] md:text-[40px]"
          style={{
            color: B.navy,
            fontWeight: 600,
            letterSpacing: S.lsHeading,
            marginBottom: S.h2mb,
            textAlign: "center",
          }}
        >
          {t.home.reportTitle}
        </h2>
        <p
          className="text-[16px] md:text-[18px]"
          style={{
            color: "rgba(14,26,43,0.75)",
            fontWeight: 400,
            lineHeight: S.lhBody,
            maxWidth: 720,
            marginBottom: S.subtextMb,
            textAlign: "center",
            marginLeft: "auto",
            marginRight: "auto",
          }}
        >
          {t.home.reportSubtitle}
        </p>

        {/* Enterprise report preview — multi-panel showcase */}
        <div style={{
          opacity: visible ? 1 : 0,
          transform: visible ? "translateY(0)" : "translateY(16px)",
          transition: "opacity 0.6s ease-out, transform 0.6s ease-out",
          maxWidth: 900,
          margin: "0 auto",
        }}>
          {/* Top row — Score card + Continuity estimate */}
          <div style={{ display: "grid", gridTemplateColumns: mobile ? "1fr" : "1fr 1fr", gap: 16, marginBottom: 16 }}>
            {/* Score card */}
            <div style={{
              backgroundColor: "#ffffff",
              border: "1px solid rgba(14,26,43,0.08)",
              borderRadius: 14,
              padding: mobile ? "24px 20px" : "28px 28px",
              boxShadow: "0 8px 32px rgba(14,26,43,0.06)",
              position: "relative",
              overflow: "hidden",
            }}>
              <div style={{ position: "absolute", top: 0, left: 20, right: 20, height: 3, borderRadius: "0 0 3px 3px", background: B.gradient }} />
              <div className="text-[10px] uppercase" style={{ color: B.light, fontWeight: 600, letterSpacing: "0.12em", marginBottom: 10 }}>{t.home.reportScoreLabel}</div>
              <div style={{ display: "flex", alignItems: "baseline", gap: 12, marginBottom: 10 }}>
                <span className="text-[40px]" style={{ fontWeight: 700, color: B.navy, lineHeight: 1 }}>78</span>
                <span className="text-[15px]" style={{ fontWeight: 600, color: B.teal }}>Established Stability</span>
              </div>
              <div className="text-[11px]" style={{ color: B.muted }}>
                <span style={{ fontWeight: 600, color: B.navy }}>72nd percentile</span> within Professional Services
              </div>
              <div style={{ height: 6, borderRadius: 99, background: B.gradient, marginTop: 14, position: "relative" }}>
                <div style={{ position: "absolute", left: "78%", top: -2, width: 10, height: 10, borderRadius: 99, backgroundColor: "#fff", border: `2px solid ${B.navy}`, transform: "translateX(-50%)" }} />
              </div>
            </div>

            {/* Continuity estimate */}
            <div style={{
              backgroundColor: "#ffffff",
              border: "1px solid rgba(14,26,43,0.08)",
              borderRadius: 14,
              padding: mobile ? "24px 20px" : "28px 28px",
              boxShadow: "0 8px 32px rgba(14,26,43,0.06)",
            }}>
              <div className="text-[10px] uppercase" style={{ color: B.teal, fontWeight: 600, letterSpacing: "0.12em", marginBottom: 10 }}>{t.home.reportContinuityLabel}</div>
              <div style={{ display: "flex", alignItems: "baseline", gap: 10, marginBottom: 6 }}>
                <span className="text-[32px]" style={{ fontWeight: 700, color: B.navy, lineHeight: 1 }}>38%</span>
                <span className="text-[12px]" style={{ color: B.muted }}>{t.home.reportContinuityUnit}</span>
              </div>
              <div style={{ display: "flex", alignItems: "baseline", gap: 8, marginBottom: 10 }}>
                <span className="text-[20px]" style={{ fontWeight: 600, color: B.teal }}>4 {t.home.reportContinuityMonths}</span>
                <span className="text-[11px]" style={{ color: B.muted }}>{t.home.reportContinuityEstimated}</span>
              </div>
              <p className="text-[10px]" style={{ color: B.muted, lineHeight: 1.5, margin: 0 }}>
                {t.home.reportContinuityDesc}
              </p>
            </div>
          </div>

          {/* Middle row — Risk scenario + Radar chart + Recommendations */}
          <div style={{ display: "grid", gridTemplateColumns: mobile ? "1fr" : "1fr 1fr 1fr", gap: 16, marginBottom: 16 }}>
            {/* Risk scenario */}
            <div style={{
              backgroundColor: "#ffffff",
              border: "1px solid rgba(14,26,43,0.08)",
              borderRadius: 14,
              padding: "20px",
              boxShadow: "0 8px 32px rgba(14,26,43,0.06)",
            }}>
              <div className="text-[10px] uppercase" style={{ color: B.navy, fontWeight: 600, letterSpacing: "0.12em", marginBottom: 12 }}>{t.home.reportRiskTitle}</div>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
                <span className="text-[24px]" style={{ fontWeight: 700, color: B.navy }}>78</span>
                <span className="text-[14px]" style={{ color: B.light }}>&rarr;</span>
                <span className="text-[24px]" style={{ fontWeight: 700, color: "#DC2626" }}>56</span>
                <span className="text-[11px]" style={{ fontWeight: 600, color: "#DC2626" }}>-22 {t.home.reportRiskPts}</span>
              </div>
              <p className="text-[10px]" style={{ color: B.muted, lineHeight: 1.5, margin: 0 }}>
                {t.home.reportRiskDesc}
              </p>
            </div>

            {/* Radar chart preview */}
            <div style={{
              backgroundColor: "#ffffff",
              border: "1px solid rgba(14,26,43,0.08)",
              borderRadius: 14,
              padding: "20px",
              boxShadow: "0 8px 32px rgba(14,26,43,0.06)",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}>
              <div className="text-[10px] uppercase" style={{ color: B.purple, fontWeight: 600, letterSpacing: "0.12em", marginBottom: 8, alignSelf: "flex-start" }}>{t.home.reportRadarTitle}</div>
              {/* Simplified radar preview */}
              <svg width={180} height={140} viewBox="-20 0 180 140" style={{ display: "block" }}>
                {/* Grid */}
                <polygon points="70,15 120,42 120,88 70,115 20,88 20,42" fill="none" stroke="rgba(14,26,43,0.06)" strokeWidth="0.75" />
                <polygon points="70,35 100,52 100,78 70,95 40,78 40,52" fill="none" stroke="rgba(14,26,43,0.06)" strokeWidth="0.75" />
                {/* Data */}
                <polygon points="70,30 108,48 105,92 70,100 35,75 28,45" fill="rgba(31,109,122,0.12)" stroke={B.teal} strokeWidth="1.5" />
                {[{x:70,y:30},{x:108,y:48},{x:105,y:92},{x:70,y:100},{x:35,y:75},{x:28,y:45}].map((p,i) => (
                  <circle key={i} cx={p.x} cy={p.y} r={2.5} fill={B.teal} />
                ))}
                {/* Labels */}
                {[{x:70,y:8,t:"Persistence"},{x:135,y:45,t:"Diversity"},{x:133,y:95,t:"Visibility"},{x:70,y:132,t:"Consistency"},{x:5,y:95,t:"Independence"},{x:3,y:45,t:"Spread"}].map((l,i) => (
                  <text key={i} x={l.x} y={l.y} textAnchor="middle" style={{fontSize:7,fill:B.muted,fontWeight:500}}>{l.t}</text>
                ))}
              </svg>
            </div>

            {/* Related service categories preview */}
            <div style={{
              backgroundColor: "#ffffff",
              border: "1px solid rgba(14,26,43,0.08)",
              borderRadius: 14,
              padding: "20px",
              boxShadow: "0 8px 32px rgba(14,26,43,0.06)",
            }}>
              <div className="text-[10px] uppercase" style={{ color: B.navy, fontWeight: 600, letterSpacing: "0.12em", marginBottom: 12 }}>{t.home.reportRecsTitle}</div>
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {[
                  { name: "Income Protection Planning", urgency: "High", color: B.teal },
                  { name: "Revenue Structure Analysis", urgency: "High", color: B.teal },
                  { name: "Diversification Review", urgency: "Med", color: B.navy },
                ].map((rec) => (
                  <div key={rec.name} style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <span className="text-[11px]" style={{ color: B.navy, fontWeight: 500 }}>{rec.name}</span>
                    <span className="text-[8px]" style={{ fontWeight: 600, padding: "2px 6px", borderRadius: 3, backgroundColor: rec.color, color: "#fff" }}>{rec.urgency}</span>
                  </div>
                ))}
              </div>
              <p className="text-[9px]" style={{ color: B.light, marginTop: 10, lineHeight: 1.4, fontStyle: "italic" }}>
                {t.home.reportRecsNote}
              </p>
            </div>
          </div>

          {/* Bottom row — feature highlights */}
          <div style={{ display: "grid", gridTemplateColumns: mobile ? "1fr 1fr" : "1fr 1fr 1fr 1fr", gap: 12 }}>
            {[
              { label: t.home.reportFeat1Label, desc: t.home.reportFeat1Desc },
              { label: t.home.reportFeat2Label, desc: t.home.reportFeat2Desc },
              { label: t.home.reportFeat3Label, desc: t.home.reportFeat3Desc },
              { label: t.home.reportFeat4Label, desc: t.home.reportFeat4Desc },
            ].map((feat) => (
              <div key={feat.label} style={{
                backgroundColor: "#ffffff",
                border: "1px solid rgba(14,26,43,0.06)",
                borderRadius: 10,
                padding: "14px 16px",
                textAlign: "center",
              }}>
                <div className="text-[11px]" style={{ fontWeight: 600, color: B.navy, marginBottom: 2 }}>{feat.label}</div>
                <div className="text-[10px]" style={{ color: B.light }}>{feat.desc}</div>
              </div>
            ))}
          </div>
        </div>

        {/* View sample report link */}
        <div className="text-center" style={{ marginTop: 32 }}>
          <Link
            href="/sample-report"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              fontSize: 15,
              fontWeight: 600,
              color: "#ffffff",
              backgroundColor: B.purple,
              padding: "12px 28px",
              borderRadius: 10,
              textDecoration: "none",
              boxShadow: "0 4px 12px rgba(75,63,174,0.25)",
              transition: "background 180ms ease, transform 180ms ease",
            }}
            onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = "#3D33A0"; e.currentTarget.style.transform = "translateY(-1px)"; }}
            onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = B.purple; e.currentTarget.style.transform = "translateY(0)"; }}
          >
            {t.home.viewSample}
          </Link>
          <p
            className="text-[13px]"
            style={{ color: B.light, marginTop: 12 }}
          >
            {t.home.reportDelivered}
          </p>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* FACTOR ROW — each row observes its own visibility                     */
/* ------------------------------------------------------------------ */
function FactorRow({ num, name, desc, icon, groupLabel, showGroupLabel, mobile }: {
  num: number; name: string; desc: string; icon: React.ReactNode;
  groupLabel: string; showGroupLabel: boolean; mobile: boolean;
}) {
  const { ref, visible } = useInView(0.25);

  return (
    <div ref={ref}>
      {/* Group label — only shown above the first factor in each group */}
      {showGroupLabel && (
        <div
          className="text-[11px] font-semibold uppercase"
          style={{
            letterSpacing: "0.12em",
            color: B.teal,
            marginBottom: 16,
            marginTop: num > 1 ? 40 : 0,
            opacity: visible ? 1 : 0,
            transform: visible ? "translateY(0)" : "translateY(8px)",
            transition: "opacity 400ms ease-out, transform 400ms ease-out",
          }}
        >
          {groupLabel}
        </div>
      )}

      {/* Factor row */}
      <div
        style={{
          display: "flex",
          alignItems: mobile ? "flex-start" : "center",
          gap: mobile ? 16 : 28,
          padding: mobile ? "20px 0" : "24px 0",
          borderBottom: "1px solid rgba(14,26,43,0.06)",
          opacity: visible ? 1 : 0,
          transform: visible ? "translateX(0)" : "translateX(-16px)",
          transition: "opacity 450ms ease-out, transform 450ms ease-out",
        }}
      >
        {/* Number */}
        <div
          style={{
            flexShrink: 0,
            width: mobile ? 28 : 36,
            fontSize: mobile ? 14 : 16,
            fontWeight: 600,
            color: B.light,
            letterSpacing: "-0.02em",
            fontVariantNumeric: "tabular-nums",
          }}
        >
          {String(num).padStart(2, "0")}
        </div>

        {/* Icon */}
        <div
          style={{
            flexShrink: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: 44,
            height: 44,
            borderRadius: 12,
            backgroundColor: "rgba(75,63,174,0.05)",
            color: B.purple,
          }}
        >
          <div style={{ transform: "scale(1.3)" }}>{icon}</div>
        </div>

        {/* Name + description */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <div
            className="text-[16px] md:text-[17px] font-semibold"
            style={{ color: B.navy, lineHeight: 1.3, marginBottom: 4 }}
          >
            {name}
          </div>
          <div
            className="text-[14px] md:text-[15px]"
            style={{ color: "rgba(14,26,43,0.50)", lineHeight: 1.55 }}
          >
            {desc}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* SCORING FACTORS — Model Input Framework                              */
/* ------------------------------------------------------------------ */
function ScoringFactors() {
  const { t } = useLanguage();
  const { ref: sectionRef, visible } = useInView();
  const mobile = useMobile();

  const allFactors = [
    { group: t.home.revenueStructure, name: t.home.factor1, desc: t.home.factor1Desc, icon: (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M14.5 4.5A6.5 6.5 0 004 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/><path d="M5.5 15.5A6.5 6.5 0 0016 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/><path d="M14.5 2v3h-3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/><path d="M5.5 18v-3h3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
    )},
    { group: t.home.revenueStructure, name: t.home.factor2, desc: t.home.factor2Desc, icon: (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M10 16V10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/><path d="M10 10L4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/><path d="M10 10V4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/><path d="M10 10l6-6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/><circle cx="4" cy="4" r="1.5" fill="currentColor"/><circle cx="10" cy="4" r="1.5" fill="currentColor"/><circle cx="16" cy="4" r="1.5" fill="currentColor"/></svg>
    )},
    { group: t.home.revenueStructure, name: t.home.factor3, desc: t.home.factor3Desc, icon: (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><circle cx="10" cy="10" r="7" stroke="currentColor" strokeWidth="1.5"/><path d="M10 3v7h7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/><path d="M10 10l-4.95 4.95" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>
    )},
    { group: t.home.incomeDurability, name: t.home.factor4, desc: t.home.factor4Desc, icon: (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M2 17l5-8 3 2-5 8z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/><path d="M7 9l4-6.5 5 3-4 6.5z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/><circle cx="14" cy="4" r="2" stroke="currentColor" strokeWidth="1.5"/></svg>
    )},
    { group: t.home.incomeDurability, name: t.home.factor5, desc: t.home.factor5Desc, icon: (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M2 10h16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" opacity="0.35"/><path d="M2 10h3l1.5-3 2 6 2-5 1.5 2H16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
    )},
    { group: t.home.incomeDurability, name: t.home.factor6, desc: t.home.factor6Desc, icon: (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><ellipse cx="10" cy="6" rx="6" ry="2.5" stroke="currentColor" strokeWidth="1.5"/><path d="M4 6v3c0 1.38 2.69 2.5 6 2.5s6-1.12 6-2.5V6" stroke="currentColor" strokeWidth="1.5"/><path d="M4 9v3c0 1.38 2.69 2.5 6 2.5s6-1.12 6-2.5V9" stroke="currentColor" strokeWidth="1.5"/></svg>
    )},
  ];

  return (
    <section
      ref={sectionRef}
      aria-label="Six Structural Factors"
      className="scoring-factors-section relative"
      style={{
        paddingTop: mobile ? S.sectionY.mobile : S.sectionY.desktop,
        paddingBottom: mobile ? S.sectionY.mobile : S.sectionY.desktop,
      }}
    >
      <div style={{ maxWidth: S.maxW, marginLeft: "auto", marginRight: "auto", position: "relative", zIndex: 1, paddingLeft: mobile ? S.padX.mobile : S.padX.desktop, paddingRight: mobile ? S.padX.mobile : S.padX.desktop }}>
        {/* Section header */}
        <div
          className="text-center"
          style={{
            marginBottom: mobile ? 40 : 56,
            opacity: visible ? 1 : 0,
            transform: visible ? "translateY(0)" : "translateY(20px)",
            transition: "opacity 600ms ease-out, transform 600ms ease-out",
          }}
        >
          <div
            className="font-medium uppercase text-[11px]"
            style={{ letterSpacing: "0.14em", color: B.teal, marginBottom: S.labelMb }}
          >
            {t.home.factorsTag}
          </div>
          <h2
            className="text-[34px] md:text-[48px] font-semibold"
            style={{ color: B.navy, letterSpacing: S.lsHeading, marginBottom: S.h2mb, lineHeight: S.lhHeading }}
          >
            {t.home.factorsTitle}
          </h2>
          <p
            className="text-[17px] md:text-[18px] mx-auto"
            style={{ color: "rgba(14,26,43,0.55)", lineHeight: S.lhBody, maxWidth: 520 }}
          >
            {t.home.factorsSubtitle}
          </p>
        </div>

        {/* Factor rows */}
        <div style={{ maxWidth: 720, margin: "0 auto" }}>
          {allFactors.map((f, i) => {
            const showGroupLabel = i === 0 || f.group !== allFactors[i - 1].group;
            return (
              <FactorRow
                key={f.name}
                num={i + 1}
                name={f.name}
                desc={f.desc}
                icon={f.icon}
                groupLabel={f.group}
                showGroupLabel={showGroupLabel}
                mobile={mobile}
              />
            );
          })}
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* HOW IT WORKS                                                         */
/* ------------------------------------------------------------------ */
function HowItWorks() {
  const { t } = useLanguage();
  const { ref, visible } = useInViewBidi(0.15);
  const mobile = useMobile();

  const steps = [
    { num: "1", title: t.home.step1Title, desc: t.home.step1Desc },
    { num: "2", title: t.home.step2Title, desc: t.home.step2Desc },
    { num: "3", title: t.home.step3Title, desc: t.home.step3Desc },
  ];

  return (
    <section
      ref={ref}
      aria-label="How It Works"
      style={{ paddingTop: mobile ? S.sectionYsm.mobile : S.sectionYsm.desktop, paddingBottom: mobile ? S.sectionYsm.mobile : S.sectionYsm.desktop, background: "#ffffff" }}
    >
      <div style={{ maxWidth: S.maxW, marginLeft: "auto", marginRight: "auto", paddingLeft: mobile ? S.padX.mobile : S.padX.desktop, paddingRight: mobile ? S.padX.mobile : S.padX.desktop }}>
        {/* Header */}
        <div className="text-center" style={{ marginBottom: mobile ? S.subtextMb : S.subtextMb + 8 }}>
          <div
            className="text-[10px] font-semibold uppercase tracking-[0.2em] mb-4"
            style={{
              color: B.light,
              opacity: visible ? 1 : 0,
              transform: visible ? "translateY(0)" : "translateY(12px)",
              transition: "opacity 0.5s ease-out, transform 0.5s ease-out",
            }}
          >
            {t.home.processTag}
          </div>
          <h2
            className="text-[24px] sm:text-[30px] md:text-[34px] font-semibold leading-tight"
            style={{
              color: B.navy,
              marginBottom: S.h2mb,
              opacity: visible ? 1 : 0,
              transform: visible ? "translateY(0)" : "translateY(12px)",
              transition: "opacity 0.5s ease-out 100ms, transform 0.5s ease-out 100ms",
            }}
          >
            {t.home.processTitle}
          </h2>
          <p
            className="text-base leading-relaxed mx-auto"
            style={{
              color: B.muted,
              maxWidth: 520,
              opacity: visible ? 1 : 0,
              transform: visible ? "translateY(0)" : "translateY(12px)",
              transition: "opacity 0.5s ease-out 200ms, transform 0.5s ease-out 200ms",
            }}
          >
            {t.home.processSubtitle}
          </p>
        </div>

        {/* 3 step cards */}
        <div
          style={{ display: "grid", gridTemplateColumns: mobile ? "1fr" : "repeat(3, 1fr)", gap: S.gridGap, maxWidth: 960, margin: "0 auto" }}
        >
          {steps.map((step, i) => {
            const delay = 300 + i * 120;
            return (
              <article
                key={step.num}
                className="text-center"
                style={{
                  backgroundColor: "#ffffff",
                  borderRadius: S.cardRadius,
                  padding: mobile ? `${S.cardPad.mobile}px` : `${S.cardPad.desktop}px`,
                  border: "1px solid rgba(14,26,43,0.06)",
                  boxShadow: "0 1px 3px rgba(14,26,43,0.04), 0 8px 24px rgba(14,26,43,0.03)",
                  opacity: visible ? 1 : 0,
                  transform: visible ? "translateY(0)" : "translateY(24px)",
                  transition: `opacity 600ms ease-out ${delay}ms, transform 600ms ease-out ${delay}ms, box-shadow 400ms ease, border-color 400ms ease`,
                }}
                onMouseEnter={(e) => {
                   if (!canHover()) return;
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
                <div
                  className="inline-flex items-center justify-center font-semibold"
                  style={{
                    width: 44, height: 44, borderRadius: 12,
                    backgroundColor: B.purple, color: "#ffffff", fontSize: 17,
                    marginBottom: 24,
                    boxShadow: "0 4px 12px rgba(75,63,174,0.25)",
                  }}
                >
                  {step.num}
                </div>
                <div className="text-[18px] md:text-[20px] font-semibold" style={{ color: B.navy, marginBottom: S.labelMb - 2 }}>
                  {step.title}
                </div>
                <p className="text-[14px] md:text-[15px]" style={{ color: B.muted, lineHeight: S.lhBody }}>
                  {step.desc}
                </p>
              </article>
            );
          })}
        </div>

        {/* Model reference */}
        <div className="text-center" style={{ marginTop: S.subtextMb }}>
          <p
            className="text-[12px] font-medium"
            style={{
              color: B.light,
              opacity: visible ? 1 : 0,
              transition: "opacity 0.5s ease-out 700ms",
            }}
          >
            {t.home.poweredBy}
          </p>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* HERO SECTION — Premium Financial Instrument                          */
/* ------------------------------------------------------------------ */
function HeroSection() {
  const { t } = useLanguage();
  const [score, setScore] = useState(0);
  const [hasAnimated, setHasAnimated] = useState(false);
  const [cardVisible, setCardVisible] = useState(false);
  const heroRef = useRef<HTMLDivElement>(null);
  const mobile = useMobile();

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
      aria-label="Hero"
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
        className="relative mx-auto"
        style={{ maxWidth: 1200, paddingTop: mobile ? S.sectionY.mobile : S.sectionY.desktop, paddingBottom: mobile ? S.sectionY.mobile : S.sectionY.desktop, paddingLeft: mobile ? S.padX.mobile : S.padX.desktop, paddingRight: mobile ? S.padX.mobile : S.padX.desktop }}
      >
        <div style={{ display: "flex", flexDirection: mobile ? "column" : "row", alignItems: mobile ? "stretch" : "center", gap: mobile ? 24 : 80 }}>
          {/* Left — Copy + CTA */}
          <div className="flex-1 lg:max-w-[560px]" style={{ textAlign: "center" }}>
            {/* Eyebrow */}
            <div
              className="font-medium uppercase text-[11px] md:text-[12px]"
              style={{
                letterSpacing: "0.14em",
                color: B.teal,
                marginBottom: S.h2mb,
                opacity: hasAnimated ? 1 : 0,
                transform: hasAnimated ? "translateY(0)" : "translateY(8px)",
                transition: "opacity 500ms ease-out, transform 500ms ease-out",
              }}
            >
              Income Stability Score™
            </div>

            <h1
              className="font-semibold"
              style={{
                fontSize: mobile ? 32 : 52,
                color: B.navy,
                lineHeight: S.lhHeading,
                letterSpacing: S.lsHero,
                marginBottom: S.h1mb,
                maxWidth: mobile ? undefined : 520,
                marginLeft: "auto",
                marginRight: "auto",
                opacity: hasAnimated ? 1 : 0,
                transform: hasAnimated ? "translateY(0)" : "translateY(12px)",
                transition: "opacity 600ms ease-out 100ms, transform 600ms ease-out 100ms",
              }}
            >
              {t.home.heroTitle}
            </h1>

            <p
              className="text-[17px] md:text-[20px]"
              style={{
                color: "rgba(14,26,43,0.65)",
                lineHeight: S.lhBody,
                marginBottom: S.ctaPadX,
                maxWidth: mobile ? undefined : 460,
                marginLeft: "auto",
                marginRight: "auto",
                opacity: hasAnimated ? 1 : 0,
                transform: hasAnimated ? "translateY(0)" : "translateY(10px)",
                transition: "opacity 600ms ease-out 250ms, transform 600ms ease-out 250ms",
              }}
            >
              {t.home.heroSubtitle}
            </p>

            <p
              className="text-[15px] md:text-[16px]"
              style={{
                color: "rgba(14,26,43,0.55)",
                lineHeight: S.lhBody,
                maxWidth: mobile ? undefined : 460,
                marginLeft: "auto",
                marginRight: "auto",
                marginBottom: S.h1mb,
                opacity: hasAnimated ? 1 : 0,
                transform: hasAnimated ? "translateY(0)" : "translateY(10px)",
                transition: "opacity 600ms ease-out 280ms, transform 600ms ease-out 280ms",
              }}
            >
              {t.home.heroBody}
            </p>

            <p
              style={{
                fontWeight: 500,
                fontSize: 15,
                letterSpacing: "0.01em",
                color: "rgba(14,26,43,0.55)",
                marginBottom: S.cardPad.desktop,
                opacity: hasAnimated ? 1 : 0,
                transform: hasAnimated ? "translateY(0)" : "translateY(10px)",
                transition: "opacity 600ms ease-out 320ms, transform 600ms ease-out 320ms",
              }}
            >
              {t.home.heroAudience}
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
                className="cta-tick inline-flex items-center justify-center font-semibold
                           focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#1F6D7A]"
                style={{
                  height: S.ctaH,
                  width: mobile ? "100%" : "auto",
                  paddingLeft: S.cardPad.desktop,
                  paddingRight: S.cardPad.desktop,
                  borderRadius: S.ctaRadius,
                  background: B.purple,
                  color: "#ffffff",
                  fontSize: 15,
                  letterSpacing: "-0.01em",
                  border: "1px solid rgba(75,63,174,0.90)",
                  boxShadow: "0 8px 24px rgba(75,63,174,0.25)",
                  transition: "background 180ms ease, transform 180ms ease, box-shadow 180ms ease",

                }}
                onMouseEnter={(e) => {
                   if (!canHover()) return;
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
                <span className="tick tick-white" />
                <span className="cta-label">{t.nav.getMyScoreFull}</span>
                <span className="cta-arrow cta-arrow-white" />
              </Link>

              <p
                className="text-[13px] md:text-[14px]"
                style={{ color: "rgba(14,26,43,0.42)", marginTop: 14, letterSpacing: "0.01em", textAlign: "center" }}
              >
                {t.home.heroCompletion}
              </p>
            </div>
          </div>

          {/* Right — Floating Score (no card) */}
          <div className="flex-1 flex justify-center" style={{ position: "relative", minHeight: mobile ? 280 : 400 }}>
            {/* Precision gauge — SVG instrument visual */}
            {(() => {
              const C = 260; // center of viewBox
              const VB = 520; // viewBox size — room for labels
              const R = 190; // outer arc radius
              const circum = 2 * Math.PI * R;
              const scorePercent = 0.78;
              const bands = [0.39, 0.59, 0.79];
              const endAngle = -90 + 360 * scorePercent;
              const endRad = endAngle * Math.PI / 180;
              const endX = C + Math.cos(endRad) * R;
              const endY = C + Math.sin(endRad) * R;
              const tickOuterR = R + 14;
              const scaleLabels = [
                { value: 40, angle: -90 + 360 * 0.40 },
                { value: 60, angle: -90 + 360 * 0.60 },
                { value: 80, angle: -90 + 360 * 0.80 },
              ];

              return (
                <>
                  {/* Combined gauge SVG */}
                  <svg className="absolute pointer-events-none" style={{ top: "50%", left: "50%", transform: "translate(-50%, -50%)", width: mobile ? 340 : 480, height: mobile ? 340 : 480 }} viewBox={`0 0 ${VB} ${VB}`} fill="none">

                    {/* Tick marks — even opacity, scored range slightly emphasized */}
                    {Array.from({ length: 100 }, (_, i) => {
                      const angle = (i * 3.6 - 90) * Math.PI / 180;
                      const isLong = i % 10 === 0;
                      const isMid = i % 5 === 0 && !isLong;
                      const isBand = bands.some(b => Math.round(b * 100) === i);
                      const oR = tickOuterR;
                      const iR = isBand ? oR - 16 : isLong ? oR - 12 : isMid ? oR - 8 : oR - 5;
                      const inScored = i <= 78;
                      const opacity = isBand ? 0.22 : isLong ? (inScored ? 0.16 : 0.10) : isMid ? (inScored ? 0.09 : 0.06) : (inScored ? 0.05 : 0.03);
                      return (
                        <line key={i}
                          x1={C + Math.cos(angle) * oR} y1={C + Math.sin(angle) * oR}
                          x2={C + Math.cos(angle) * iR} y2={C + Math.sin(angle) * iR}
                          stroke={isBand ? "#1F6D7A" : "#0E1A2B"} strokeWidth={isBand ? 1.2 : isLong ? 1 : 0.5} opacity={opacity}
                        />
                      );
                    })}

                    {/* Faint full-circle track */}
                    <circle cx={C} cy={C} r={R} stroke="#0E1A2B" strokeWidth="1" opacity="0.04" />

                    {/* Score arc — animated draw-in */}
                    <circle
                      cx={C} cy={C} r={R}
                      stroke="url(#heroScoreArc)" strokeWidth="2.5" strokeLinecap="round"
                      opacity="0.32"
                      strokeDasharray={`${circum * scorePercent} ${circum * (1 - scorePercent)}`}
                      strokeDashoffset={hasAnimated ? 0 : circum * scorePercent}
                      transform={`rotate(-90 ${C} ${C})`}
                      style={{ transition: "stroke-dashoffset 1.6s cubic-bezier(0.16, 1, 0.3, 1) 0.6s" }}
                    />

                    {/* Score endpoint marker */}
                    <circle cx={endX} cy={endY} r="3.5" fill="#4B3FAE"
                      opacity={hasAnimated ? 0.35 : 0}
                      style={{ transition: "opacity 400ms ease 2.2s" }}
                    />
                    <circle cx={endX} cy={endY} r="1.5" fill="#ffffff"
                      opacity={hasAnimated ? 0.8 : 0}
                      style={{ transition: "opacity 400ms ease 2.2s" }}
                    />

                    {/* Band boundary notches on arc */}
                    {bands.map((b) => {
                      const a = (-90 + 360 * b) * Math.PI / 180;
                      return (
                        <line key={b}
                          x1={C + Math.cos(a) * (R - 5)} y1={C + Math.sin(a) * (R - 5)}
                          x2={C + Math.cos(a) * (R + 5)} y2={C + Math.sin(a) * (R + 5)}
                          stroke="#1F6D7A" strokeWidth="0.75" opacity="0.14"
                        />
                      );
                    })}

                    {/* Scale labels — with connecting hairline */}
                    {scaleLabels.map(({ value, angle: a }) => {
                      const rad = a * Math.PI / 180;
                      const labelR = tickOuterR + 16;
                      const inScored = value <= 78;
                      return (
                        <g key={value}>
                          <line
                            x1={C + Math.cos(rad) * tickOuterR} y1={C + Math.sin(rad) * tickOuterR}
                            x2={C + Math.cos(rad) * (tickOuterR + 6)} y2={C + Math.sin(rad) * (tickOuterR + 6)}
                            stroke="#0E1A2B" strokeWidth="0.5" opacity={inScored ? 0.10 : 0.05}
                          />
                          <text
                            x={C + Math.cos(rad) * labelR} y={C + Math.sin(rad) * labelR}
                            textAnchor="middle" dominantBaseline="central"
                            fontSize="9" fontWeight="500" letterSpacing="0.02em"
                            fill="#0E1A2B"
                            opacity={inScored ? 0.20 : 0.10}
                            fontFamily="system-ui, -apple-system, sans-serif"
                          >{value}</text>
                        </g>
                      );
                    })}

                    {/* Structural rings */}
                    <circle cx={C} cy={C} r="152" stroke="url(#heroRingMid)" strokeWidth="0.5" opacity="0.06" />
                    <circle cx={C} cy={C} r="114" stroke="url(#heroRingInner)" strokeWidth="0.5" opacity="0.05" />
                    <circle cx={C} cy={C} r="76" stroke="#1F6D7A" strokeWidth="0.5" opacity="0.04" />

                    {/* Bullseye target fills */}
                    <circle cx={C} cy={C} r="152" fill="url(#heroBullseyeOuter)" opacity="0.015" />
                    <circle cx={C} cy={C} r="114" fill="url(#heroBullseyeMid)" opacity="0.018" />
                    <circle cx={C} cy={C} r="76" fill="url(#heroBullseyeInner)" opacity="0.022" />
                    <circle cx={C} cy={C} r="38" fill="#4B3FAE" opacity="0.028" />

                    {/* Crosshairs — centered on new C */}
                    <line x1={C} y1={C - 75} x2={C} y2={C - 45} stroke="#0E1A2B" strokeWidth="0.5" opacity="0.06" />
                    <line x1={C} y1={C + 45} x2={C} y2={C + 75} stroke="#0E1A2B" strokeWidth="0.5" opacity="0.06" />
                    <line x1={C - 75} y1={C} x2={C - 45} y2={C} stroke="#0E1A2B" strokeWidth="0.5" opacity="0.06" />
                    <line x1={C + 45} y1={C} x2={C + 75} y2={C} stroke="#0E1A2B" strokeWidth="0.5" opacity="0.06" />

                    {/* Gradient definitions */}
                    <defs>
                      <linearGradient id="heroScoreArc" gradientUnits="userSpaceOnUse" x1={C} y1={C - R} x2={C - R} y2={C + R * 0.5}>
                        <stop offset="0%" stopColor="#0E1A2B" />
                        <stop offset="35%" stopColor="#2A2670" />
                        <stop offset="60%" stopColor="#4B3FAE" />
                        <stop offset="85%" stopColor="#2B5A6E" />
                        <stop offset="100%" stopColor="#1F6D7A" />
                      </linearGradient>
                      <linearGradient id="heroRingMid" gradientUnits="userSpaceOnUse" x1={C - 152} y1={C} x2={C + 152} y2={C}>
                        <stop offset="0%" stopColor="#0E1A2B" />
                        <stop offset="50%" stopColor="#4B3FAE" />
                        <stop offset="100%" stopColor="#0E1A2B" />
                      </linearGradient>
                      <linearGradient id="heroRingInner" gradientUnits="userSpaceOnUse" x1={C - 114} y1={C} x2={C + 114} y2={C}>
                        <stop offset="0%" stopColor="#4B3FAE" />
                        <stop offset="50%" stopColor="#1F6D7A" />
                        <stop offset="100%" stopColor="#4B3FAE" />
                      </linearGradient>
                      <radialGradient id="heroBullseyeOuter" cx="50%" cy="50%" r="50%">
                        <stop offset="0%" stopColor="#4B3FAE" />
                        <stop offset="100%" stopColor="#0E1A2B" />
                      </radialGradient>
                      <radialGradient id="heroBullseyeMid" cx="50%" cy="50%" r="50%">
                        <stop offset="0%" stopColor="#4B3FAE" />
                        <stop offset="60%" stopColor="#2A2670" />
                        <stop offset="100%" stopColor="#1F6D7A" />
                      </radialGradient>
                      <radialGradient id="heroBullseyeInner" cx="50%" cy="50%" r="50%">
                        <stop offset="0%" stopColor="#4B3FAE" />
                        <stop offset="100%" stopColor="#4B3FAE" stopOpacity="0.5" />
                      </radialGradient>
                    </defs>
                  </svg>
                </>
              );
            })()}

            {/* Score typography — centered in bullseye */}
            <div
              style={{
                position: "absolute",
                top: "50%",
                left: "50%",
                transform: `translate(-50%, -50%) ${cardVisible ? "translateY(0)" : "translateY(24px)"}`,
                textAlign: "center",
                opacity: cardVisible ? 1 : 0,
                transition: "opacity 800ms cubic-bezier(0.16, 1, 0.3, 1), transform 800ms cubic-bezier(0.16, 1, 0.3, 1)",
                whiteSpace: "nowrap",
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
                {t.home.heroScoreLabel}
              </div>

              {/* Score number — gradient text */}
              <div
                className="font-semibold leading-none"
                style={{
                  fontSize: mobile ? 64 : 148,
                  background: `linear-gradient(145deg, ${B.navy} 0%, #2A2670 30%, ${B.purple} 55%, #2B5A6E 80%, ${B.teal} 100%)`,
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
                className="text-[17px] sm:text-[20px] md:text-[24px] font-medium"
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
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* MAIN LANDING PAGE                                                    */
/* ------------------------------------------------------------------ */
export default function LandingPage() {
  const [openIndustry, setOpenIndustry] = useState<number | null>(null);
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [activeTierIdx, setActiveTierIdx] = useState(2); /* default: Established Stability */
  const mobile = useMobile();
  const { t } = useLanguage();

  const INDUSTRY_EXAMPLES = [
    {
      industry: t.industryPatterns.ind1Title,
      stable: [t.industryPatterns.ind1Stable1, t.industryPatterns.ind1Stable2, t.industryPatterns.ind1Stable3, t.industryPatterns.ind1Stable4],
      unstable: [t.industryPatterns.ind1Unstable1, t.industryPatterns.ind1Unstable2, t.industryPatterns.ind1Unstable3],
    },
    {
      industry: t.industryPatterns.ind2Title,
      stable: [t.industryPatterns.ind2Stable1, t.industryPatterns.ind2Stable2, t.industryPatterns.ind2Stable3, t.industryPatterns.ind2Stable4],
      unstable: [t.industryPatterns.ind2Unstable1, t.industryPatterns.ind2Unstable2, t.industryPatterns.ind2Unstable3],
    },
    {
      industry: t.industryPatterns.ind3Title,
      stable: [t.industryPatterns.ind3Stable1, t.industryPatterns.ind3Stable2, t.industryPatterns.ind3Stable3, t.industryPatterns.ind3Stable4],
      unstable: [t.industryPatterns.ind3Unstable1, t.industryPatterns.ind3Unstable2, t.industryPatterns.ind3Unstable3],
    },
  ];

  return (
    <div className="overflow-x-hidden">

      {/* ============ 1. HERO — Financial Platform ============ */}
      <HeroSection />

      {/* Clean edge into dark section */}

      {/* ============ WHY INCOME STABILITY MATTERS ============ */}
      <WhyIncomeStabilityMatters />

      {/* Clean edge out of dark section */}

      {/* ============ HOW IT WORKS — Financial Scoring Pipeline ============ */}
      <HowItWorks />

      {/* ============ CONTINUOUS CANVAS: Factors → Classification → Report ============ */}
      <div className="grain-overlay" style={{ position: "relative", background: "linear-gradient(180deg, #ffffff 0%, #FAFAF8 3%, #F7F6F3 8%, #F4F1EA 25%, #F4F1EA 75%, #F4F1EA 100%)" }}>

      {/* ============ SCORING FACTORS — Model Input Framework ============ */}
      <ScoringFactors />


      {/* ============ INCOME STABILITY CLASSIFICATION — after factors for context ============ */}
      <section aria-label="Income Stability Classification Scale" style={{ paddingTop: mobile ? S.sectionYsm.mobile : S.sectionYsm.desktop, paddingBottom: mobile ? S.sectionYsm.mobile : S.sectionYsm.desktop, position: "relative" }}>

        <div style={{ maxWidth: S.maxW, marginLeft: "auto", marginRight: "auto", position: "relative", zIndex: 1, paddingLeft: mobile ? S.padX.mobile : S.padX.desktop, paddingRight: mobile ? S.padX.mobile : S.padX.desktop }}>
          {/* Header */}
          <div className="text-center" style={{ marginBottom: mobile ? S.subtextMb : S.subtextMb + 8 }}>
            <div className="text-[10px] font-semibold uppercase tracking-[0.2em] mb-4" style={{ color: B.light }}>
              {t.classScale.frameworkTag}
            </div>
            <h2 className="text-[24px] sm:text-[30px] md:text-[34px] font-semibold leading-tight" style={{ color: B.navy, marginBottom: S.h2mb }}>
              {t.classScale.title}
            </h2>
            <p className="text-base leading-relaxed mx-auto" style={{ color: B.muted, maxWidth: 600 }}>
              {t.classScale.subtitle}
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
              {t.classScale.subtitle2}
            </p>
          </div>

          {/* Spectrum bar with tick marks */}
          {(() => {
            const tiers = [
              { range: "0\u201339", label: t.classScale.limitedLabel, summary: t.classScale.limitedSummary, desc: t.classScale.limitedDesc, color: "#DC2626", sliderPos: 20, sampleScore: 20 },
              { range: "40\u201359", label: t.classScale.developingLabel, summary: t.classScale.developingSummary, desc: t.classScale.developingDesc, color: "#F59E0B", sliderPos: 50, sampleScore: 50 },
              { range: "60\u201379", label: t.classScale.establishedLabel, summary: t.classScale.establishedSummary, desc: t.classScale.establishedDesc, color: B.teal, sliderPos: 70, sampleScore: 78 },
              { range: "80\u2013100", label: t.classScale.highLabel, summary: t.classScale.highSummary, desc: t.classScale.highDesc, color: B.navy, sliderPos: 90, sampleScore: 92 },
            ];
            const active = tiers[activeTierIdx];
            return (
              <>
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
                    {/* Score marker — slides to active tier */}
                    <div style={{ position: "absolute", left: `${active.sliderPos}%`, top: -4, width: 22, height: 22, borderRadius: 999, border: "3px solid #fff", backgroundColor: active.color, transform: "translateX(-50%)", boxShadow: `0 2px 8px ${active.color}59`, transition: "left 400ms cubic-bezier(0.4,0,0.2,1), background-color 400ms ease, box-shadow 400ms ease" }} />
                    {/* Tick labels */}
                    <div className="flex justify-between px-1" style={{ marginTop: 6 }}>
                      {[0, 20, 40, 60, 80, 100].map((tick) => (
                        <span key={tick} className="text-[9px] font-medium" style={{ color: B.light }}>{tick}</span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Four tier cards */}
                <div style={{ display: "grid", gridTemplateColumns: mobile ? "1fr" : "repeat(4, 1fr)", gap: S.gridGap, maxWidth: 880, margin: `${S.h1mb}px auto 0` }}>
                  {tiers.map((tier, idx) => {
                    const isActive = idx === activeTierIdx;
                    return (
                      <div
                        key={tier.label}
                        style={{
                          backgroundColor: isActive ? "#ffffff" : "rgba(255,255,255,0.7)",
                          backdropFilter: isActive ? "none" : "blur(8px)",
                          borderRadius: 14,
                          border: isActive ? `1.5px solid ${tier.color}` : "1px solid rgba(14,26,43,0.06)",
                          padding: "28px 22px 30px",
                          position: "relative" as const,
                          cursor: "pointer",
                          boxShadow: isActive
                            ? `0 4px 20px ${tier.color}1F, 0 12px 40px ${tier.color}0F`
                            : "0 1px 4px rgba(14,26,43,0.03), 0 4px 16px rgba(14,26,43,0.02)",
                          transform: isActive ? "translateY(-2px)" : "translateY(0)",
                          transition: "all 400ms cubic-bezier(0.4,0,0.2,1)",
                        }}
                        onMouseEnter={() => {
                          if (!canHover()) return;
                          setActiveTierIdx(idx);
                        }}
                      >
                        {/* Active tier badge */}
                        <div
                          style={{
                            display: "inline-flex",
                            alignItems: "center",
                            gap: 6,
                            padding: "4px 10px",
                            borderRadius: 999,
                            backgroundColor: isActive ? `${tier.color}14` : "transparent",
                            marginBottom: 14,
                            opacity: isActive ? 1 : 0,
                            transform: isActive ? "translateY(0)" : "translateY(-4px)",
                            transition: "opacity 300ms ease, transform 300ms ease, background-color 300ms ease",
                          }}
                        >
                          <span style={{ width: 6, height: 6, borderRadius: 999, backgroundColor: tier.color }} />
                          <span className="text-[9px] font-semibold uppercase tracking-[0.1em]" style={{ color: tier.color }}>
                            {t.classScale.sampleScore}: {tier.sampleScore}
                          </span>
                        </div>

                        {/* Color accent + range */}
                        <div className="flex items-center gap-3 mb-3">
                          <div style={{ width: 4, height: 36, borderRadius: 4, backgroundColor: tier.color }} />
                          <div className="text-[26px] font-bold leading-none" style={{ color: B.navy }}>{tier.range}</div>
                        </div>

                        {/* Tier label */}
                        <div className="text-[15px] font-semibold mb-1" style={{ color: tier.color }}>
                          {tier.label} {t.classScale.stabilityWord}
                        </div>

                        {/* One-word summary */}
                        <div className="text-[10px] font-medium uppercase tracking-wider mb-3" style={{ color: B.light }}>
                          {tier.summary} {t.classScale.incomeStructure}
                        </div>

                        {/* Description */}
                        <p className="text-[12px] leading-[1.7]" style={{ color: B.muted }}>
                          {tier.desc}
                        </p>
                      </div>
                    );
                  })}
                </div>
              </>
            );
          })()}

          {/* Model reference */}
          <div className="text-center" style={{ marginTop: S.subtextMb }}>
            <p className="text-[12px] font-medium" style={{ color: B.muted }} dangerouslySetInnerHTML={{ __html: t.classScale.modelNote }} />
            <p className="text-[11px] mt-2" style={{ color: B.light }}>
              {t.classScale.bandNote}
            </p>
          </div>
        </div>
      </section>


      {/* ============ PREVIEW YOUR SCORE REPORT ============ */}
      <PreviewYourScoreReport />

      </div>{/* ← end continuous canvas */}

      {/* ============ INDUSTRY PATTERNS — Real-World Context ============ */}
      <section aria-label="Stability Patterns by Industry" style={{ background: "linear-gradient(180deg, #F4F1EA 0%, #FAFAF8 8%, #ffffff 20%, #ffffff 100%)", paddingTop: mobile ? S.sectionYsm.mobile : S.sectionYsm.desktop, paddingBottom: mobile ? S.sectionY.mobile : S.sectionY.desktop }}>
      <div style={{ maxWidth: S.maxW, marginLeft: "auto", marginRight: "auto", textAlign: "center", paddingLeft: mobile ? S.padX.mobile : S.padX.desktop, paddingRight: mobile ? S.padX.mobile : S.padX.desktop }}>
        <h2 className="text-[24px] sm:text-[30px] md:text-[34px] font-semibold leading-tight" style={{ color: B.navy, marginBottom: S.h2mb }}>
          {t.industryPatterns.title}
        </h2>
        <p className="text-base leading-relaxed mx-auto" style={{ color: B.muted, marginBottom: 12, maxWidth: 640 }}>
          {t.industryPatterns.subtitle}
        </p>
        <p className="text-[14px] mx-auto" style={{ color: B.light, marginBottom: 40, maxWidth: 640 }}>
          {t.industryPatterns.note}
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
                  aria-expanded={isOpen}
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
                          {t.industryPatterns.stableHeading}
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
                          {t.industryPatterns.unstableHeading}
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
