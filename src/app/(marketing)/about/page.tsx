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
/*  Shared hooks                                                       */
/* ------------------------------------------------------------------ */

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


/* ================================================================== */
/* HERO                                                                */
/* ================================================================== */
function Hero() {
  const { ref, visible } = useInView();
  const m = useMobile();

  return (
    <section
      ref={ref}
      aria-label="About Hero"
      style={{
        background: `linear-gradient(135deg, ${C.navy} 0%, #1A1540 40%, ${C.purple} 70%, ${C.teal} 100%)`,
        position: "relative",
        overflow: "hidden",
        paddingTop: m ? 100 : 160,
        paddingBottom: m ? 72 : 100,
      }}
    >
      <div style={{ position: "absolute", top: "30%", left: "50%", width: 800, height: 800, transform: "translate(-50%, -50%)", background: "radial-gradient(circle, rgba(75,63,174,0.18) 0%, transparent 70%)", pointerEvents: "none" }} />
      <div style={{ maxWidth: maxW, marginLeft: "auto", marginRight: "auto", paddingLeft: px(m), paddingRight: px(m), position: "relative", zIndex: 1 }}>
        <div
          style={{
            textAlign: "center",
            maxWidth: textMax,
            margin: "0 auto",
            opacity: visible ? 1 : 0,
            transform: visible ? "translateY(0)" : "translateY(20px)",
            transition: "opacity 0.7s ease-out, transform 0.7s ease-out",
          }}
        >
          <div style={{ ...T.label, color: C.sandLight, marginBottom: 20 }}>
            PeopleStar Enterprises, Inc.
          </div>
          <h1
            style={{
              ...h1(m),
              color: C.sandText,
              fontFamily: sans,
              marginBottom: 20,
            }}
          >
            About RunPayway&#8482;
          </h1>
          <p
            style={{ ...body(m), color: C.sandMuted, maxWidth: 620, marginLeft: "auto", marginRight: "auto" }}
          >
            RunPayway&#8482; produces the Income Stability Score&#8482; — a present-state diagnostic that measures how well your income holds up if conditions change. Fixed rules. No opinions. Just the math.
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
  const m = useMobile();

  return (
    <section
      ref={ref}
      aria-label="What is the Income Stability Score&#8482;"
      style={{
        backgroundColor: C.sand,
        paddingTop: secPad(m),
        paddingBottom: secPad(m),
      }}
    >
      <div style={{ maxWidth: maxW, marginLeft: "auto", marginRight: "auto", paddingLeft: px(m), paddingRight: px(m) }}>
        <div
          style={{
            maxWidth: textMax,
            margin: "0 auto",
            opacity: visible ? 1 : 0,
            transform: visible ? "translateY(0)" : "translateY(14px)",
            transition: "opacity 0.6s ease-out, transform 0.6s ease-out",
          }}
        >
          <h2 style={{ ...h2Style(m), color: C.navy, fontFamily: sans, marginBottom: 20 }}>
            The Income Stability Score&#8482;
          </h2>
          <p style={{ ...body(m), color: C.muted, marginBottom: 20 }}>
            The Income Stability Score&#8482; is a number between <span style={{ fontFamily: mono }}>0</span> and <span style={{ fontFamily: mono }}>100</span> that measures the structural durability of your income. It answers a simple question: if conditions changed, how well would your income hold up?
          </p>
          <p style={{ ...body(m), color: C.muted, marginBottom: 20 }}>
            Unlike credit scores, which measure borrowing history, or income verification, which confirms what you earned last month, the Income Stability Score&#8482; examines the architecture of how you earn. It looks at how many sources you have, how predictable they are, how much continues without active work, and how far forward your income is committed.
          </p>
          <p style={{ ...body(m), color: C.muted, marginBottom: 0 }}>
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
  const m = useMobile();

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
        backgroundColor: C.white,
        paddingTop: secPad(m),
        paddingBottom: secPad(m),
      }}
    >
      <div style={{ maxWidth: maxW, marginLeft: "auto", marginRight: "auto", paddingLeft: px(m), paddingRight: px(m) }}>
        <div
          style={{
            textAlign: "center",
            marginBottom: 44,
            opacity: visible ? 1 : 0,
            transform: visible ? "translateY(0)" : "translateY(12px)",
            transition: "opacity 0.5s ease-out, transform 0.5s ease-out",
          }}
        >
          <h2 style={{ ...h2Style(m), color: C.navy, fontFamily: sans, marginBottom: 12 }}>
            What the model measures
          </h2>
          <p style={{ ...body(m), color: C.muted, maxWidth: 560, marginLeft: "auto", marginRight: "auto" }}>
            The model evaluates income across independent structural dimensions. Each contributes to the final score.
          </p>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: m ? "1fr" : "1fr 1fr 1fr", gap: 20, maxWidth: 880, margin: "0 auto" }}>
          {dimensions.map((d, i) => (
            <div
              key={d.title}
              style={{
                backgroundColor: C.purple,
                borderRadius: 12,
                padding: m ? 24 : 32,
                border: "none",
                opacity: visible ? 1 : 0,
                transform: visible ? "translateY(0)" : "translateY(12px)",
                transition: `opacity 0.5s ease-out ${i * 60}ms, transform 0.5s ease-out ${i * 60}ms`,
              }}
            >
              <div style={{ width: 8, height: 8, borderRadius: "50%", backgroundColor: C.teal, marginBottom: 16 }} />
              <h3 style={{ ...h3Style(m), fontWeight: 600, color: C.white, lineHeight: 1.12, marginBottom: 10 }}>{d.title}</h3>
              <p style={{ ...T.meta, color: C.sandMuted, lineHeight: 1.65, margin: 0 }}>{d.desc}</p>
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
  const m = useMobile();

  return (
    <section
      ref={ref}
      aria-label="How the Score is Calculated"
      style={{
        backgroundColor: C.sand,
        paddingTop: secPad(m),
        paddingBottom: secPad(m),
      }}
    >
      <div style={{ maxWidth: maxW, marginLeft: "auto", marginRight: "auto", paddingLeft: px(m), paddingRight: px(m) }}>
        <div
          style={{
            maxWidth: textMax,
            margin: "0 auto",
            opacity: visible ? 1 : 0,
            transform: visible ? "translateY(0)" : "translateY(14px)",
            transition: "opacity 0.6s ease-out, transform 0.6s ease-out",
          }}
        >
          <h2 style={{ ...h2Style(m), color: C.navy, fontFamily: sans, marginBottom: 20 }}>
            How the score is calculated
          </h2>
          <p style={{ ...body(m), color: C.muted, marginBottom: 20 }}>
            Model RP-2.0 is entirely deterministic. There is no probabilistic modeling, no adaptive learning, and no human judgment in the scoring process. The same inputs always produce the same score.
          </p>
          <p style={{ ...body(m), color: C.muted, marginBottom: 20 }}>
            The model evaluates your income across fixed structural dimensions using versioned rules. Each dimension contributes to the final <span style={{ fontFamily: mono }}>0</span>&#8211;<span style={{ fontFamily: mono }}>100</span> score, which maps to one of four stability bands: Limited, Developing, Established, or High.
          </p>
          <p style={{ ...body(m), color: C.muted, marginBottom: 0 }}>
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
  const m = useMobile();

  return (
    <section
      ref={ref}
      aria-label="Model Governance"
      style={{
        backgroundColor: C.white,
        paddingTop: secPad(m),
        paddingBottom: secPad(m),
      }}
    >
      <div style={{ maxWidth: maxW, marginLeft: "auto", marginRight: "auto", paddingLeft: px(m), paddingRight: px(m) }}>
        <div
          style={{
            maxWidth: textMax,
            margin: "0 auto",
            opacity: visible ? 1 : 0,
            transform: visible ? "translateY(0)" : "translateY(14px)",
            transition: "opacity 0.6s ease-out, transform 0.6s ease-out",
          }}
        >
          <h2 style={{ ...h2Style(m), color: C.navy, fontFamily: sans, marginBottom: 20 }}>
            Model governance
          </h2>
          <p style={{ ...body(m), color: C.muted, marginBottom: 20 }}>
            Every version of the scoring model is locked and versioned. The current version is Model RP-2.0. If any rule, weight, threshold, or classification boundary changes, the model increments to a new version number.
          </p>
          <p style={{ ...body(m), color: C.muted, marginBottom: 20 }}>
            This means a score generated under Model RP-2.0 can always be compared to another score generated under Model RP-2.0. The rules are identical. If the rules ever change, it becomes a new model — and every assessment is stamped with the version that produced it.
          </p>
          <p style={{ ...body(m), color: C.muted, marginBottom: 0 }}>
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
  const m = useMobile();

  return (
    <section
      ref={ref}
      aria-label="Verification"
      style={{
        background: C.navy,
        paddingTop: secPad(m),
        paddingBottom: secPad(m),
      }}
    >
      <div style={{ maxWidth: maxW, marginLeft: "auto", marginRight: "auto", paddingLeft: px(m), paddingRight: px(m) }}>
        <div
          style={{
            maxWidth: textMax,
            margin: "0 auto",
            opacity: visible ? 1 : 0,
            transform: visible ? "translateY(0)" : "translateY(14px)",
            transition: "opacity 0.6s ease-out, transform 0.6s ease-out",
          }}
        >
          <h2 style={{ ...h2Style(m), color: C.sandText, fontFamily: sans, marginBottom: 20 }}>
            Every score is verifiable
          </h2>
          <p style={{ ...body(m), color: C.sandMuted, marginBottom: 20 }}>
            Every assessment includes a SHA-256 hash, a model version stamp, and a timestamp. These three elements prove the assessment was produced by Model RP-2.0 and has not been altered.
          </p>
          <p style={{ ...body(m), color: C.sandLight, marginBottom: 0 }}>
            Share your score with a lender, employer, or financial advisor. They don&#8217;t need to trust you or trust RunPayway&#8482; — they can verify it themselves.
          </p>

          {/* Verification badges */}
          <div style={{ display: "flex", gap: m ? 12 : 20, marginTop: 36, flexWrap: "wrap", justifyContent: "center" }}>
            {["SHA-256 Hash", "Model Version Stamp", "Immutable Timestamp", "QR Verification"].map((badge) => (
              <div key={badge} style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "8px 16px", borderRadius: 100, backgroundColor: "rgba(255,255,255,0.06)", border: `1px solid ${C.sandBorder}` }}>
                <div style={{ width: 5, height: 5, borderRadius: "50%", backgroundColor: C.teal }} />
                <span style={{ ...T.micro, fontWeight: 600, color: C.sandMuted, letterSpacing: "0.02em" }}>{badge}</span>
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
  const m = useMobile();

  return (
    <section
      ref={ref}
      aria-label="Who Built It"
      style={{
        backgroundColor: C.white,
        paddingTop: secPad(m),
        paddingBottom: secPad(m),
      }}
    >
      <div style={{ maxWidth: maxW, marginLeft: "auto", marginRight: "auto", paddingLeft: px(m), paddingRight: px(m) }}>
        <div
          style={{
            maxWidth: textMax,
            margin: "0 auto",
            opacity: visible ? 1 : 0,
            transform: visible ? "translateY(0)" : "translateY(14px)",
            transition: "opacity 0.6s ease-out, transform 0.6s ease-out",
          }}
        >
          <h2 style={{ ...h2Style(m), color: C.navy, fontFamily: sans, marginBottom: 20 }}>
            Who built this
          </h2>
          <p style={{ ...body(m), color: C.muted, marginBottom: 20 }}>
            RunPayway&#8482; is built and operated by PeopleStar Enterprises, Inc. The Income Stability Score&#8482; was developed to fill a gap in how income is evaluated: credit scores measure borrowing history, income verification confirms what you earned last month, but nothing measured the structural durability of how you earn.
          </p>
          <p style={{ ...body(m), color: C.muted, marginBottom: 20 }}>
            RunPayway&#8482; exists to give people a clear, verifiable way to understand and communicate the stability of their income. The score is private by default, requires no bank connection or credit pull, and belongs entirely to the individual who takes it.
          </p>
          <p style={{ ...body(m), color: C.muted, marginBottom: 0 }}>
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
  const m = useMobile();

  return (
    <section
      aria-label="Model Badge"
      style={{
        backgroundColor: C.sand,
        paddingTop: m ? 48 : 64,
        paddingBottom: m ? 48 : 64,
      }}
    >
      <div style={{ maxWidth: maxW, marginLeft: "auto", marginRight: "auto", paddingLeft: px(m), paddingRight: px(m), textAlign: "center" }}>
        <div style={{ display: "flex", justifyContent: "center", gap: m ? 16 : 24, flexWrap: "wrap" }}>
          {[
            { label: "Model RP-2.0", sub: "Current version" },
            { label: "Deterministic", sub: "Fixed scoring rules" },
            { label: "19 Industries", sub: "Full sector coverage" },
            { label: "Fixed Dimensions", sub: "Structural analysis" },
          ].map((item) => (
            <div key={item.label} style={{ textAlign: "center", minWidth: m ? 120 : 140 }}>
              <div style={{ ...T.bodySm.desktop, fontWeight: 700, color: C.navy, marginBottom: 4 }}>{item.label}</div>
              <div style={{ ...T.micro, color: C.light, letterSpacing: "0.02em" }}>{item.sub}</div>
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
  const m = useMobile();

  return (
    <section
      ref={ref}
      aria-label="Call to Action"
      style={{
        background: `linear-gradient(135deg, ${C.navy} 0%, #1A1540 40%, ${C.purple} 70%, ${C.teal} 100%)`,
        position: "relative",
        overflow: "hidden",
        paddingTop: m ? 72 : 96,
        paddingBottom: m ? 72 : 96,
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
          maxWidth: maxW,
          marginLeft: "auto",
          marginRight: "auto",
          paddingLeft: px(m),
          paddingRight: px(m),
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
              ...h2Style(m),
              color: C.sandText,
              fontFamily: sans,
              marginBottom: 16,
            }}
          >
            Now that you know who built it &#8212; see your score.
          </h2>
          <p
            style={{
              ...bodySm(m),
              color: C.sandMuted,
              marginBottom: 12,
              maxWidth: 440,
              marginLeft: "auto",
              marginRight: "auto",
            }}
          >
            Your free score shows where you stand. The full report shows what to do about it &#8212; <span style={{ fontFamily: mono }}>$69</span>.
          </p>
          <p
            style={{
              ...T.meta,
              color: C.sandLight,
              lineHeight: 1.65,
              marginBottom: 28,
              maxWidth: 440,
              marginLeft: "auto",
              marginRight: "auto",
            }}
          >
            If the report doesn&#8217;t reveal at least one insight you didn&#8217;t already know, full refund.
          </p>
          <Link
            href="/pricing"
            style={{
              ...ctaButtonLight,
              backgroundColor: C.sandText,
              color: C.navy,
              borderRadius: 8,
              letterSpacing: "-0.01em",
              textDecoration: "none",
            }}
          >
            Get My Free Score
          </Link>
          <div style={{ marginTop: 16, ...T.meta, color: "rgba(244,241,234,0.40)" }}>
            Free to start &#183; No bank connection &#183; No credit pull
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
