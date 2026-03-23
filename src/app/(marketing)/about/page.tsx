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
  muted: "rgba(14,26,43,0.58)",
  light: "rgba(14,26,43,0.42)",
  gradient: "linear-gradient(135deg, #0E1A2B 0%, #1A1540 40%, #4B3FAE 70%, #1F6D7A 100%)",
};

const DISPLAY_FONT = "'DM Serif Display', Georgia, serif";

const S = {
  sectionY:     { desktop: 120, mobile: 80 },
  sectionYsm:   { desktop: 100, mobile: 64 },
  transitionY:  { desktop: 56, mobile: 40 },
  disclaimerY:  { desktop: 48, mobile: 36 },
  maxW:         1060,
  padX:         { desktop: 48, mobile: 24 },
  h1mb:         20,
  h2mb:         20,
  subtextMb:    44,
  paraMb:       20,
  labelMb:      14,
  cardPad:      { desktop: 32, mobile: 24 },
  cardRadius:   12,
  panelRadius:  16,
  gridGap:      20,
  gridGapSm:    14,
  ctaH:         52,
  ctaHsm:       44,
  ctaPadX:      28,
  ctaRadius:    12,
  lhHeading:    1.12,
  lhBody:       1.65,
  lhDense:      1.5,
  lsHeading:    "-0.02em",
  lsHero:       "-0.03em",
  lsLabel:      "0.12em",
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
      aria-label="About Hero"
      style={{
        background: B.gradient,
        position: "relative",
        overflow: "hidden",
        paddingTop: mobile ? 100 : 160,
        paddingBottom: mobile ? 72 : 100,
      }}
    >
      <style>{`@import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display&display=swap');`}</style>
      <div style={{ position: "absolute", top: "30%", left: "50%", width: 800, height: 800, transform: "translate(-50%, -50%)", background: "radial-gradient(circle, rgba(75,63,174,0.18) 0%, transparent 70%)", pointerEvents: "none" }} />
      <div style={{ maxWidth: S.maxW, marginLeft: "auto", marginRight: "auto", paddingLeft: mobile ? S.padX.mobile : S.padX.desktop, paddingRight: mobile ? S.padX.mobile : S.padX.desktop, position: "relative", zIndex: 1 }}>
        <div
          style={{
            textAlign: "center",
            maxWidth: 720,
            margin: "0 auto",
            opacity: visible ? 1 : 0,
            transform: visible ? "translateY(0)" : "translateY(20px)",
            transition: "opacity 0.7s ease-out, transform 0.7s ease-out",
          }}
        >
          <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: S.lsLabel, textTransform: "uppercase" as const, color: "rgba(244,241,234,0.50)", marginBottom: 20 }}>
            PeopleStar Enterprises, Inc.
          </div>
          <h1
            style={{
              fontSize: mobile ? 36 : 52,
              color: "#F4F1EA",
              fontFamily: DISPLAY_FONT,
              fontWeight: 400,
              letterSpacing: S.lsHero,
              lineHeight: S.lhHeading,
              marginBottom: S.h1mb,
            }}
          >
            About RunPayway&#8482;
          </h1>
          <p
            style={{ fontSize: mobile ? 15 : 17, color: "rgba(244,241,234,0.70)", lineHeight: S.lhBody, maxWidth: 620, marginLeft: "auto", marginRight: "auto" }}
          >
            RunPayway&#8482; produces the Income Stability Score&#8482; — a present-state diagnostic that measures how well your income holds up if conditions change. No AI. No opinions. Just the math.
          </p>
        </div>
      </div>
    </section>
  );
}


/* ================================================================== */
/* WHAT IS THE INCOME STABILITY SCORE                                  */
/* ================================================================== */
function WhatIsISS() {
  const { ref, visible } = useInView();
  const mobile = useMobile();

  return (
    <section
      ref={ref}
      aria-label="What is the Income Stability Score"
      style={{
        backgroundColor: B.sand,
        paddingTop: mobile ? S.sectionY.mobile : S.sectionY.desktop,
        paddingBottom: mobile ? S.sectionY.mobile : S.sectionY.desktop,
      }}
    >
      <div style={{ maxWidth: S.maxW, marginLeft: "auto", marginRight: "auto", paddingLeft: mobile ? S.padX.mobile : S.padX.desktop, paddingRight: mobile ? S.padX.mobile : S.padX.desktop }}>
        <div
          style={{
            maxWidth: 720,
            margin: "0 auto",
            opacity: visible ? 1 : 0,
            transform: visible ? "translateY(0)" : "translateY(14px)",
            transition: "opacity 0.6s ease-out, transform 0.6s ease-out",
          }}
        >
          <h2 className="text-[28px] md:text-[36px]" style={{ color: B.navy, fontFamily: DISPLAY_FONT, fontWeight: 400, letterSpacing: S.lsHeading, marginBottom: S.h2mb }}>
            The Income Stability Score&#8482;
          </h2>
          <p className="text-[15px] md:text-[16px]" style={{ color: B.muted, lineHeight: S.lhBody, marginBottom: S.paraMb }}>
            The Income Stability Score&#8482; is a number between 0 and 100 that measures the structural durability of your income. It answers a simple question: if conditions changed, how well would your income hold up?
          </p>
          <p className="text-[15px] md:text-[16px]" style={{ color: B.muted, lineHeight: S.lhBody, marginBottom: S.paraMb }}>
            Unlike credit scores, which measure borrowing history, or income verification, which confirms what you earned last month, the Income Stability Score&#8482; examines the architecture of how you earn. It looks at how many sources you have, how predictable they are, how much continues without active work, and how far forward your income is committed.
          </p>
          <p className="text-[15px] md:text-[16px]" style={{ color: B.muted, lineHeight: S.lhBody, marginBottom: 0 }}>
            The result is a deterministic structural assessment — the same inputs always produce the same score, and every score maps to a fixed classification band under Model RP-2.0.
          </p>
        </div>
      </div>
    </section>
  );
}


/* ================================================================== */
/* WHAT THE MODEL MEASURES                                             */
/* ================================================================== */
function WhatModelMeasures() {
  const { ref, visible } = useInView();
  const mobile = useMobile();

  const dimensions = [
    { title: "Repeatable Income", desc: "How much of your income comes back without needing to be rebuilt each time." },
    { title: "Reliance on One Source", desc: "How much depends on your single largest client, channel, or source of work." },
    { title: "Number of Income Sources", desc: "How many independent, meaningful sources support the income structure." },
    { title: "Income Secured Ahead of Time", desc: "How much upcoming income is already committed before the month begins." },
    { title: "Month-to-Month Stability", desc: "How consistent the income is from one month to the next." },
    { title: "Income That Continues Without Daily Work", desc: "How much income would keep coming in if active work stopped." },
  ];

  return (
    <section
      ref={ref}
      aria-label="What the Model Measures"
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
          <h2 className="text-[28px] md:text-[36px]" style={{ color: B.navy, fontFamily: DISPLAY_FONT, fontWeight: 400, letterSpacing: S.lsHeading, marginBottom: 12 }}>
            What the model measures
          </h2>
          <p className="text-[15px]" style={{ color: B.muted, lineHeight: S.lhBody, maxWidth: 560, marginLeft: "auto", marginRight: "auto" }}>
            The model evaluates income across six independent dimensions. Each contributes to the final score.
          </p>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: mobile ? "1fr" : "1fr 1fr 1fr", gap: S.gridGap, maxWidth: 880, margin: "0 auto" }}>
          {dimensions.map((d, i) => (
            <div
              key={d.title}
              style={{
                backgroundColor: B.purple,
                borderRadius: S.cardRadius,
                padding: mobile ? S.cardPad.mobile : S.cardPad.desktop,
                border: "none",
                opacity: visible ? 1 : 0,
                transform: visible ? "translateY(0)" : "translateY(12px)",
                transition: `opacity 0.5s ease-out ${i * 60}ms, transform 0.5s ease-out ${i * 60}ms`,
              }}
            >
              <div style={{ width: 8, height: 8, borderRadius: "50%", backgroundColor: B.teal, marginBottom: 16 }} />
              <h3 className="text-[15px]" style={{ fontWeight: 600, color: "#FFFFFF", marginBottom: 10 }}>{d.title}</h3>
              <p className="text-[13px]" style={{ color: "rgba(255,255,255,0.70)", lineHeight: 1.6, margin: 0 }}>{d.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}


/* ================================================================== */
/* HOW THE SCORE IS CALCULATED                                         */
/* ================================================================== */
function HowCalculated() {
  const { ref, visible } = useInView();
  const mobile = useMobile();

  return (
    <section
      ref={ref}
      aria-label="How the Score is Calculated"
      style={{
        backgroundColor: B.sand,
        paddingTop: mobile ? S.sectionY.mobile : S.sectionY.desktop,
        paddingBottom: mobile ? S.sectionY.mobile : S.sectionY.desktop,
      }}
    >
      <div style={{ maxWidth: S.maxW, marginLeft: "auto", marginRight: "auto", paddingLeft: mobile ? S.padX.mobile : S.padX.desktop, paddingRight: mobile ? S.padX.mobile : S.padX.desktop }}>
        <div
          style={{
            maxWidth: 720,
            margin: "0 auto",
            opacity: visible ? 1 : 0,
            transform: visible ? "translateY(0)" : "translateY(14px)",
            transition: "opacity 0.6s ease-out, transform 0.6s ease-out",
          }}
        >
          <h2 className="text-[28px] md:text-[36px]" style={{ color: B.navy, fontFamily: DISPLAY_FONT, fontWeight: 400, letterSpacing: S.lsHeading, marginBottom: S.h2mb }}>
            How the score is calculated
          </h2>
          <p className="text-[15px] md:text-[16px]" style={{ color: B.muted, lineHeight: S.lhBody, marginBottom: S.paraMb }}>
            Model RP-2.0 is entirely deterministic. There is no machine learning, no AI, no probabilistic modeling, and no human judgment in the scoring process. The same six inputs always produce the same score.
          </p>
          <p className="text-[15px] md:text-[16px]" style={{ color: B.muted, lineHeight: S.lhBody, marginBottom: S.paraMb }}>
            The model evaluates your income across six dimensions using fixed, versioned rules. Each dimension contributes to the final 0&#8211;100 score, which maps to one of four stability bands: Limited, Developing, Established, or High.
          </p>
          <p className="text-[15px] md:text-[16px]" style={{ color: B.muted, lineHeight: S.lhBody, marginBottom: 0 }}>
            The result is a five-page diagnostic report that explains your score, translates what it means, shows your biggest risks, identifies the specific changes that would raise it, and gives you a clear action plan.
          </p>
        </div>
      </div>
    </section>
  );
}


/* ================================================================== */
/* MODEL GOVERNANCE                                                    */
/* ================================================================== */
function ModelGovernance() {
  const { ref, visible } = useInView();
  const mobile = useMobile();

  return (
    <section
      ref={ref}
      aria-label="Model Governance"
      style={{
        backgroundColor: "#ffffff",
        paddingTop: mobile ? S.sectionY.mobile : S.sectionY.desktop,
        paddingBottom: mobile ? S.sectionY.mobile : S.sectionY.desktop,
      }}
    >
      <div style={{ maxWidth: S.maxW, marginLeft: "auto", marginRight: "auto", paddingLeft: mobile ? S.padX.mobile : S.padX.desktop, paddingRight: mobile ? S.padX.mobile : S.padX.desktop }}>
        <div
          style={{
            maxWidth: 720,
            margin: "0 auto",
            opacity: visible ? 1 : 0,
            transform: visible ? "translateY(0)" : "translateY(14px)",
            transition: "opacity 0.6s ease-out, transform 0.6s ease-out",
          }}
        >
          <h2 className="text-[28px] md:text-[36px]" style={{ color: B.navy, fontFamily: DISPLAY_FONT, fontWeight: 400, letterSpacing: S.lsHeading, marginBottom: S.h2mb }}>
            Model governance
          </h2>
          <p className="text-[15px] md:text-[16px]" style={{ color: B.muted, lineHeight: S.lhBody, marginBottom: S.paraMb }}>
            Every version of the scoring model is locked and versioned. The current version is Model RP-2.0. If any rule, weight, threshold, or classification boundary changes, the model increments to a new version number.
          </p>
          <p className="text-[15px] md:text-[16px]" style={{ color: B.muted, lineHeight: S.lhBody, marginBottom: S.paraMb }}>
            This means a score generated under Model RP-2.0 can always be compared to another score generated under Model RP-2.0. The rules are identical. If the rules ever change, it becomes a new model — and every assessment is stamped with the version that produced it.
          </p>
          <p className="text-[15px] md:text-[16px]" style={{ color: B.muted, lineHeight: S.lhBody, marginBottom: 0 }}>
            Every assessment includes a SHA-256 hash that can be used to verify the report was produced by the stated model version and has not been modified after generation. This is how institutional trust works: not through promises, but through verifiable, versioned outputs.
          </p>
        </div>
      </div>
    </section>
  );
}


/* ================================================================== */
/* VERIFICATION                                                        */
/* ================================================================== */
function Verification() {
  const { ref, visible } = useInView();
  const mobile = useMobile();

  return (
    <section
      ref={ref}
      aria-label="Verification"
      style={{
        background: B.navy,
        paddingTop: mobile ? S.sectionY.mobile : S.sectionY.desktop,
        paddingBottom: mobile ? S.sectionY.mobile : S.sectionY.desktop,
      }}
    >
      <div style={{ maxWidth: S.maxW, marginLeft: "auto", marginRight: "auto", paddingLeft: mobile ? S.padX.mobile : S.padX.desktop, paddingRight: mobile ? S.padX.mobile : S.padX.desktop }}>
        <div
          style={{
            maxWidth: 720,
            margin: "0 auto",
            opacity: visible ? 1 : 0,
            transform: visible ? "translateY(0)" : "translateY(14px)",
            transition: "opacity 0.6s ease-out, transform 0.6s ease-out",
          }}
        >
          <h2 className="text-[28px] md:text-[36px]" style={{ color: "#F4F1EA", fontFamily: DISPLAY_FONT, fontWeight: 400, letterSpacing: S.lsHeading, marginBottom: S.h2mb }}>
            Every score is verifiable
          </h2>
          <p className="text-[15px] md:text-[16px]" style={{ color: "rgba(244,241,234,0.70)", lineHeight: S.lhBody, marginBottom: S.paraMb }}>
            Every assessment includes a SHA-256 hash, a model version stamp, and a timestamp. These three elements prove the assessment was produced by Model RP-2.0 and has not been altered.
          </p>
          <p className="text-[15px] md:text-[16px]" style={{ color: "rgba(244,241,234,0.55)", lineHeight: S.lhBody, marginBottom: 0 }}>
            Share your score with a lender, employer, or financial advisor. They don&#8217;t need to trust you or trust RunPayway&#8482; — they can verify it themselves.
          </p>

          {/* Verification badges */}
          <div style={{ display: "flex", gap: mobile ? 12 : 20, marginTop: 36, flexWrap: "wrap", justifyContent: "center" }}>
            {["SHA-256 Hash", "Model Version Stamp", "Immutable Timestamp", "QR Verification"].map((badge) => (
              <div key={badge} style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "8px 16px", borderRadius: 100, backgroundColor: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.08)" }}>
                <div style={{ width: 5, height: 5, borderRadius: "50%", backgroundColor: B.teal }} />
                <span style={{ fontSize: 12, fontWeight: 600, color: "rgba(244,241,234,0.60)", letterSpacing: "0.02em" }}>{badge}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}


/* ================================================================== */
/* WHO BUILT IT                                                        */
/* ================================================================== */
function WhoBuiltIt() {
  const { ref, visible } = useInView();
  const mobile = useMobile();

  return (
    <section
      ref={ref}
      aria-label="Who Built It"
      style={{
        backgroundColor: "#ffffff",
        paddingTop: mobile ? S.sectionY.mobile : S.sectionY.desktop,
        paddingBottom: mobile ? S.sectionY.mobile : S.sectionY.desktop,
      }}
    >
      <div style={{ maxWidth: S.maxW, marginLeft: "auto", marginRight: "auto", paddingLeft: mobile ? S.padX.mobile : S.padX.desktop, paddingRight: mobile ? S.padX.mobile : S.padX.desktop }}>
        <div
          style={{
            maxWidth: 720,
            margin: "0 auto",
            opacity: visible ? 1 : 0,
            transform: visible ? "translateY(0)" : "translateY(14px)",
            transition: "opacity 0.6s ease-out, transform 0.6s ease-out",
          }}
        >
          <h2 className="text-[28px] md:text-[36px]" style={{ color: B.navy, fontFamily: DISPLAY_FONT, fontWeight: 400, letterSpacing: S.lsHeading, marginBottom: S.h2mb }}>
            Who built this
          </h2>
          <p className="text-[15px] md:text-[16px]" style={{ color: B.muted, lineHeight: S.lhBody, marginBottom: S.paraMb }}>
            RunPayway&#8482; is built and operated by PeopleStar Enterprises, Inc. The Income Stability Score&#8482; was developed to fill a gap in how income is evaluated: credit scores measure borrowing history, income verification confirms what you earned last month, but nothing measured the structural durability of how you earn.
          </p>
          <p className="text-[15px] md:text-[16px]" style={{ color: B.muted, lineHeight: S.lhBody, marginBottom: S.paraMb }}>
            RunPayway&#8482; exists to give people a clear, verifiable way to understand and communicate the stability of their income. The score is private by default, requires no bank connection or credit pull, and belongs entirely to the individual who takes it.
          </p>
          <p className="text-[15px] md:text-[16px]" style={{ color: B.muted, lineHeight: S.lhBody, marginBottom: 0 }}>
            The model is designed for anyone whose income does not fit neatly into a W-2 paycheck — business owners, self-employed professionals, consultants, contractors, and anyone with variable or multi-source income.
          </p>
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
        backgroundColor: B.sand,
        paddingTop: mobile ? 48 : 64,
        paddingBottom: mobile ? 48 : 64,
      }}
    >
      <div style={{ maxWidth: S.maxW, marginLeft: "auto", marginRight: "auto", paddingLeft: mobile ? S.padX.mobile : S.padX.desktop, paddingRight: mobile ? S.padX.mobile : S.padX.desktop, textAlign: "center" }}>
        <div style={{ display: "flex", justifyContent: "center", gap: mobile ? 16 : 24, flexWrap: "wrap" }}>
          {[
            { label: "Model RP-2.0", sub: "Current version" },
            { label: "20 Engines", sub: "Deterministic pipeline" },
            { label: "19 Industries", sub: "Full sector coverage" },
            { label: "6 Dimensions", sub: "Structural analysis" },
          ].map((item) => (
            <div key={item.label} style={{ textAlign: "center", minWidth: mobile ? 120 : 140 }}>
              <div style={{ fontSize: 15, fontWeight: 700, color: B.navy, marginBottom: 4 }}>{item.label}</div>
              <div style={{ fontSize: 11, color: B.light, letterSpacing: "0.02em" }}>{item.sub}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}


/* ================================================================== */
/* CTA                                                                 */
/* ================================================================== */
function CtaSection() {
  const { ref, visible } = useInView();
  const mobile = useMobile();

  return (
    <section
      ref={ref}
      aria-label="Call to Action"
      style={{
        background: B.gradient,
        position: "relative",
        overflow: "hidden",
        paddingTop: mobile ? 72 : 96,
        paddingBottom: mobile ? 72 : 96,
      }}
    >
      <div
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          width: 600,
          height: 600,
          transform: "translate(-50%, -50%)",
          background: "radial-gradient(circle, rgba(75,63,174,0.15) 0%, transparent 70%)",
          pointerEvents: "none",
        }}
      />
      <div
        style={{
          maxWidth: S.maxW,
          marginLeft: "auto",
          marginRight: "auto",
          paddingLeft: mobile ? S.padX.mobile : S.padX.desktop,
          paddingRight: mobile ? S.padX.mobile : S.padX.desktop,
          position: "relative",
          zIndex: 1,
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
              fontSize: mobile ? 26 : 36,
              color: "#F4F1EA",
              fontFamily: DISPLAY_FONT,
              fontWeight: 400,
              letterSpacing: S.lsHeading,
              lineHeight: S.lhHeading,
              marginBottom: 16,
            }}
          >
            Now that you know who built it &#8212; see your score.
          </h2>
          <p
            style={{
              fontSize: 16,
              color: "rgba(244,241,234,0.60)",
              lineHeight: 1.65,
              marginBottom: 12,
              maxWidth: 440,
              marginLeft: "auto",
              marginRight: "auto",
            }}
          >
            Your free score shows where you stand. The full report shows what to do about it &#8212; $99.
          </p>
          <p
            style={{
              fontSize: 13,
              color: "rgba(244,241,234,0.40)",
              lineHeight: 1.6,
              marginBottom: 28,
              maxWidth: 440,
              marginLeft: "auto",
              marginRight: "auto",
            }}
          >
            If the report doesn&#8217;t reveal at least one insight you didn&#8217;t already know, full refund.
          </p>
          <Link
            href="/diagnostic-portal"
            style={{
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              height: 52,
              paddingLeft: 32,
              paddingRight: 32,
              borderRadius: 12,
              backgroundColor: "#F4F1EA",
              color: B.navy,
              fontSize: 15,
              fontWeight: 600,
              letterSpacing: "-0.01em",
              textDecoration: "none",
            }}
          >
            Get My Free Score
          </Link>
          <div style={{ marginTop: 16, fontSize: 12, color: "rgba(244,241,234,0.40)" }}>
            Free to start &#183; Under 2 minutes &#183; No bank connection
          </div>
        </div>
      </div>
    </section>
  );
}

/* ================================================================== */
/* MAIN EXPORT                                                         */
/* ================================================================== */
export default function AboutPage() {
  return (
    <div>
      <Hero />
      <WhatIsISS />
      <WhatModelMeasures />
      <HowCalculated />
      <ModelGovernance />
      <Verification />
      <WhoBuiltIt />
      <ModelBadge />
      <CtaSection />
    </div>
  );
}
