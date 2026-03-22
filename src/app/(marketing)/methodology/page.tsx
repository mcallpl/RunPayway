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
  bandLimited: "#9B2C2C",
  bandDeveloping: "#92640A",
  bandEstablished: "#2B5EA7",
  bandHigh: "#1F6D7A",
};

const S = {
  sectionY: { desktop: 120, mobile: 80 },
  sectionYsm: { desktop: 100, mobile: 64 },
  transitionY: { desktop: 56, mobile: 40 },
  disclaimerY: { desktop: 20, mobile: 14 },
  maxW: 1060,
  padX: { desktop: 48, mobile: 24 },
  h1mb: 20,
  h2mb: 20,
  subtextMb: 44,
  paraMb: 20,
  labelMb: 14,
  cardPad: { desktop: 32, mobile: 24 },
  cardRadius: 12,
  panelRadius: 16,
  gridGap: 20,
  gridGapSm: 14,
  ctaH: 52,
  ctaHsm: 44,
  ctaPadX: 28,
  ctaRadius: 12,
  lhHeading: 1.12,
  lhBody: 1.65,
  lhDense: 1.5,
  lsHeading: "-0.02em",
  lsHero: "-0.03em",
  lsLabel: "0.12em",
};

const STRIPE_SINGLE = "https://buy.stripe.com/14A28j48E2socZQa2Z2Nq02";
const DISPLAY_FONT = "'DM Serif Display', Georgia, serif";


/* ================================================================== */
/* 1. HERO — Dark gradient                                             */
/* ================================================================== */
function Hero() {
  const { ref, visible } = useInView();
  const mobile = useMobile();

  return (
    <section
      ref={ref}
      aria-label="Methodology Hero"
      style={{
        background: B.gradient,
        position: "relative",
        overflow: "hidden",
        paddingTop: mobile ? 120 : 160,
        paddingBottom: mobile ? 72 : 100,
      }}
    >
      <style>{`@import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display&display=swap');`}</style>
      {/* Radial glow */}
      <div
        style={{
          position: "absolute",
          top: "30%",
          left: "50%",
          width: 800,
          height: 800,
          transform: "translate(-50%, -50%)",
          background:
            "radial-gradient(circle, rgba(75,63,174,0.18) 0%, transparent 70%)",
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
            maxWidth: 720,
            marginLeft: "auto",
            marginRight: "auto",
            opacity: visible ? 1 : 0,
            transform: visible ? "translateY(0)" : "translateY(20px)",
            transition: "opacity 0.7s ease-out, transform 0.7s ease-out",
          }}
        >
          <div
            className="text-[11px] uppercase"
            style={{
              color: "rgba(255,255,255,0.50)",
              fontWeight: 600,
              letterSpacing: S.lsLabel,
              marginBottom: 20,
            }}
          >
            Methodology
          </div>
          <h1
            className="text-[36px] md:text-[44px]"
            style={{
              color: "#F4F1EA",
              fontFamily: DISPLAY_FONT,
              fontWeight: 400,
              letterSpacing: S.lsHero,
              lineHeight: S.lhHeading,
              marginBottom: S.h1mb,
            }}
          >
            How the score is built.
          </h1>
          <p
            className="text-[15px] md:text-[17px]"
            style={{
              color: "rgba(244,241,234,0.70)",
              lineHeight: S.lhBody,
              maxWidth: 620,
              marginLeft: "auto",
              marginRight: "auto",
            }}
          >
            The Income Stability Score&trade; is a deterministic structural
            assessment. Every rule is fixed, every result is reproducible, and no
            AI determines the outcome.
          </p>
        </div>
      </div>
    </section>
  );
}


/* ================================================================== */
/* 2. PURPOSE — White background                                       */
/* ================================================================== */
function Purpose() {
  const { ref, visible } = useInView();
  const mobile = useMobile();

  return (
    <section
      ref={ref}
      aria-label="Purpose"
      style={{
        backgroundColor: "#ffffff",
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
            maxWidth: 680,
            margin: "0 auto",
            textAlign: "center",
            opacity: visible ? 1 : 0,
            transform: visible ? "translateY(0)" : "translateY(14px)",
            transition: "opacity 0.6s ease-out, transform 0.6s ease-out",
          }}
        >
          <h2
            className="text-[28px] md:text-[36px]"
            style={{
              color: B.navy,
              fontFamily: DISPLAY_FONT,
              fontWeight: 400,
              letterSpacing: S.lsHeading,
              marginBottom: S.h2mb,
            }}
          >
            Purpose of the model
          </h2>
          <p
            className="text-[15px] md:text-[17px]"
            style={{
              color: B.muted,
              lineHeight: S.lhBody,
              marginBottom: S.paraMb,
            }}
          >
            The Income Stability Score&#8482; measures how structurally stable your
            income is — not how much you earn, but how well your income holds up
            when something changes.
          </p>
          <p
            className="text-[15px] md:text-[17px]"
            style={{
              color: B.muted,
              lineHeight: S.lhBody,
              marginBottom: 0,
            }}
          >
            It answers six questions: How much income is repeatable? How much
            depends on one source? How many sources support it? How much is
            secured ahead of time? How stable is it month to month? How much
            continues without daily work?
          </p>
        </div>
      </div>
    </section>
  );
}


/* ================================================================== */
/* 3. SIX DIMENSIONS — Sand background                                 */
/* ================================================================== */
function SixDimensions() {
  const { ref, visible } = useInView();
  const mobile = useMobile();

  const dimensions = [
    {
      num: "01",
      title: "Repeatable Income",
      desc: "How much of your income comes back without needing to be rebuilt each time.",
      accent: B.teal,
    },
    {
      num: "02",
      title: "Reliance on One Source",
      desc: "How much depends on your single largest client, channel, or source of work.",
      accent: B.purple,
    },
    {
      num: "03",
      title: "Number of Income Sources",
      desc: "How many independent, meaningful sources support the income structure.",
      accent: B.teal,
    },
    {
      num: "04",
      title: "Income Secured Ahead of Time",
      desc: "How much upcoming income is already committed before the month begins.",
      accent: B.purple,
    },
    {
      num: "05",
      title: "Month-to-Month Stability",
      desc: "How consistent the income is from one month to the next.",
      accent: B.teal,
    },
    {
      num: "06",
      title: "Income That Continues Without Daily Work",
      desc: "How much income would keep coming in if active work stopped.",
      accent: B.purple,
    },
  ];

  return (
    <section
      ref={ref}
      aria-label="Six Dimensions"
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
            className="text-[28px] md:text-[36px]"
            style={{
              color: B.navy,
              fontFamily: DISPLAY_FONT,
              fontWeight: 400,
              letterSpacing: S.lsHeading,
              marginBottom: 12,
            }}
          >
            What the model measures
          </h2>
          <p
            className="text-[15px] md:text-[17px]"
            style={{
              color: B.muted,
              lineHeight: S.lhBody,
              maxWidth: 560,
              marginLeft: "auto",
              marginRight: "auto",
            }}
          >
            Your score is built from six key measures.
          </p>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: mobile ? "1fr" : "1fr 1fr",
            gap: S.gridGap,
            maxWidth: 880,
            margin: "0 auto",
          }}
        >
          {dimensions.map((dim, i) => (
            <div
              key={dim.num}
              style={{
                backgroundColor: "#ffffff",
                borderRadius: S.cardRadius,
                padding: mobile ? S.cardPad.mobile : S.cardPad.desktop,
                borderLeft: `4px solid ${dim.accent}`,
                border: `1px solid rgba(14,26,43,0.06)`,
                borderLeftWidth: 4,
                borderLeftColor: dim.accent,
                opacity: visible ? 1 : 0,
                transform: visible ? "translateY(0)" : "translateY(14px)",
                transition: `opacity 0.5s ease-out ${i * 70}ms, transform 0.5s ease-out ${i * 70}ms`,
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 12,
                  marginBottom: 12,
                }}
              >
                <span
                  className="text-[12px]"
                  style={{
                    color: dim.accent,
                    fontWeight: 600,
                    letterSpacing: "0.06em",
                    opacity: 0.6,
                  }}
                >
                  {dim.num}
                </span>
                <h3
                  className="text-[15px]"
                  style={{ fontWeight: 600, color: B.navy, margin: 0 }}
                >
                  {dim.title}
                </h3>
              </div>
              <p
                className="text-[14px]"
                style={{
                  color: B.muted,
                  lineHeight: S.lhBody,
                  margin: 0,
                }}
              >
                {dim.desc}
              </p>
            </div>
          ))}
        </div>

        <p
          className="text-[13px]"
          style={{
            color: B.light,
            textAlign: "center",
            marginTop: 40,
            letterSpacing: "0.02em",
            opacity: visible ? 1 : 0,
            transition: "opacity 0.5s ease-out 500ms",
          }}
        >
          These six measures are fixed under Model RP-2.0.
        </p>
      </div>
    </section>
  );
}


/* ================================================================== */
/* 4. SCORING FRAMEWORK — White background                             */
/* ================================================================== */
function ScoringFramework() {
  const { ref, visible } = useInView();
  const mobile = useMobile();
  const [hovered, setHovered] = useState<number | null>(null);

  const blocks = [
    {
      label: "Structure Block",
      color: B.teal,
      desc: "Evaluates the composition of your income \u2014 repeatable income, number of income sources, income secured ahead of time, and reliance on one source.",
    },
    {
      label: "Stability Block",
      color: B.purple,
      desc: "Evaluates the durability of your income \u2014 month-to-month stability and income that continues without daily work.",
    },
  ];

  return (
    <section
      ref={ref}
      aria-label="Scoring Framework"
      style={{
        backgroundColor: "#ffffff",
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
            maxWidth: 720,
            margin: "0 auto",
            opacity: visible ? 1 : 0,
            transform: visible ? "translateY(0)" : "translateY(14px)",
            transition: "opacity 0.6s ease-out, transform 0.6s ease-out",
          }}
        >
          <h2
            className="text-[28px] md:text-[36px]"
            style={{
              color: B.navy,
              fontFamily: DISPLAY_FONT,
              fontWeight: 400,
              letterSpacing: S.lsHeading,
              marginBottom: S.h2mb,
              textAlign: "center",
            }}
          >
            How the score is calculated
          </h2>
          <p
            className="text-[15px] md:text-[17px]"
            style={{
              color: B.muted,
              lineHeight: S.lhBody,
              marginBottom: 48,
              textAlign: "center",
            }}
          >
            Each dimension is scored individually and combined into a single
            0&ndash;100 result. The model evaluates two structural blocks:
          </p>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: mobile ? "1fr" : "1fr 1fr",
            gap: S.gridGap,
            maxWidth: 780,
            margin: "0 auto 48px",
          }}
        >
          {blocks.map((block, i) => (
            <div
              key={block.label}
              onMouseEnter={() => canHover() && setHovered(i)}
              onMouseLeave={() => setHovered(null)}
              style={{
                backgroundColor: B.sand,
                borderRadius: S.cardRadius,
                padding: mobile ? S.cardPad.mobile : S.cardPad.desktop,
                border: `1px solid ${hovered === i ? block.color : "rgba(14,26,43,0.06)"}`,
                transition: "border-color 0.25s ease, transform 0.25s ease, box-shadow 0.25s ease",
                transform: hovered === i ? "translateY(-2px)" : "translateY(0)",
                boxShadow: hovered === i ? "0 8px 24px rgba(14,26,43,0.06)" : "none",
                opacity: visible ? 1 : 0,
                animationDelay: `${i * 100}ms`,
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  marginBottom: 16,
                }}
              >
                <div
                  style={{
                    width: 10,
                    height: 10,
                    borderRadius: "50%",
                    backgroundColor: block.color,
                    flexShrink: 0,
                  }}
                />
                <div
                  className="text-[11px] uppercase"
                  style={{
                    color: block.color,
                    fontWeight: 600,
                    letterSpacing: "0.08em",
                  }}
                >
                  {block.label}
                </div>
              </div>
              <p
                className="text-[14px]"
                style={{
                  color: B.muted,
                  lineHeight: S.lhBody,
                  margin: 0,
                }}
              >
                {block.desc}
              </p>
            </div>
          ))}
        </div>

        <p
          className="text-[15px] md:text-[16px]"
          style={{
            color: B.muted,
            lineHeight: S.lhBody,
            textAlign: "center",
            maxWidth: 620,
            marginLeft: "auto",
            marginRight: "auto",
            opacity: visible ? 1 : 0,
            transition: "opacity 0.5s ease-out 300ms",
          }}
        >
          The two blocks combine into your final score. The same inputs always
          produce the same result.
        </p>
      </div>
    </section>
  );
}


/* ================================================================== */
/* 5. INTERACTION EFFECTS — Sand background                            */
/* ================================================================== */
function InteractionEffects() {
  const { ref, visible } = useInView();
  const mobile = useMobile();

  const examples = [
    {
      type: "Penalty",
      color: B.bandLimited,
      desc: "Heavy reliance on one source combined with little income secured ahead of time triggers a penalty.",
    },
    {
      type: "Bonus",
      color: B.bandHigh,
      desc: "Strong repeatable income combined with income that continues without daily work produces a bonus.",
    },
  ];

  return (
    <section
      ref={ref}
      aria-label="Interaction Effects"
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
            maxWidth: 720,
            margin: "0 auto",
            opacity: visible ? 1 : 0,
            transform: visible ? "translateY(0)" : "translateY(14px)",
            transition: "opacity 0.6s ease-out, transform 0.6s ease-out",
          }}
        >
          <h2
            className="text-[28px] md:text-[36px]"
            style={{
              color: B.navy,
              fontFamily: DISPLAY_FONT,
              fontWeight: 400,
              letterSpacing: S.lsHeading,
              marginBottom: S.h2mb,
            }}
          >
            Interaction effects
          </h2>
          <p
            className="text-[15px] md:text-[17px]"
            style={{
              color: B.muted,
              lineHeight: S.lhBody,
              marginBottom: 40,
            }}
          >
            Certain combinations of structural characteristics produce additional
            scoring adjustments. These are fixed rules — not learned patterns —
            and they apply automatically when specific conditions are met.
          </p>

          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 16,
              marginBottom: 40,
            }}
          >
            {examples.map((ex, i) => (
              <div
                key={ex.type}
                style={{
                  display: "flex",
                  alignItems: "flex-start",
                  gap: 16,
                  backgroundColor: "#ffffff",
                  borderRadius: S.cardRadius,
                  padding: mobile ? "20px" : "24px 28px",
                  border: "1px solid rgba(14,26,43,0.06)",
                  opacity: visible ? 1 : 0,
                  transform: visible ? "translateY(0)" : "translateY(10px)",
                  transition: `opacity 0.5s ease-out ${200 + i * 100}ms, transform 0.5s ease-out ${200 + i * 100}ms`,
                }}
              >
                <div
                  style={{
                    width: 8,
                    height: 8,
                    borderRadius: "50%",
                    backgroundColor: ex.color,
                    flexShrink: 0,
                    marginTop: 7,
                  }}
                />
                <p
                  className="text-[14px] md:text-[15px]"
                  style={{
                    color: B.muted,
                    lineHeight: S.lhBody,
                    margin: 0,
                  }}
                >
                  {ex.desc}
                </p>
              </div>
            ))}
          </div>

          <p
            className="text-[13px]"
            style={{
              color: B.light,
              letterSpacing: "0.02em",
            }}
          >
            All interaction rules are versioned and documented in the model
            manifest.
          </p>
        </div>
      </div>
    </section>
  );
}


/* ================================================================== */
/* 6. CLASSIFICATION BANDS — White background                          */
/* ================================================================== */
function ClassificationBands() {
  const { ref, visible } = useInView();
  const mobile = useMobile();

  const bands = [
    {
      range: "0\u201329",
      label: "Limited Stability",
      color: B.bandLimited,
      desc: "The income structure is vulnerable and not yet protected against disruption.",
      width: "30%",
    },
    {
      range: "30\u201349",
      label: "Developing Stability",
      color: B.bandDeveloping,
      desc: "The structure is developing but still needs stronger protection in key areas.",
      width: "20%",
    },
    {
      range: "50\u201374",
      label: "Established Stability",
      color: B.bandEstablished,
      desc: "The structure has real stability but is not yet fully protected against disruption.",
      width: "25%",
    },
    {
      range: "75\u2013100",
      label: "High Stability",
      color: B.bandHigh,
      desc: "The structure is strong, well-protected, and resilient against most disruptions.",
      width: "25%",
    },
  ];

  return (
    <section
      ref={ref}
      aria-label="Classification Bands"
      style={{
        backgroundColor: "#ffffff",
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
            className="text-[28px] md:text-[36px]"
            style={{
              color: B.navy,
              fontFamily: DISPLAY_FONT,
              fontWeight: 400,
              letterSpacing: S.lsHeading,
              marginBottom: 12,
            }}
          >
            Income Stability Classification Scale
          </h2>
          <p
            className="text-[15px] md:text-[17px]"
            style={{
              color: B.muted,
              lineHeight: S.lhBody,
              maxWidth: 560,
              marginLeft: "auto",
              marginRight: "auto",
            }}
          >
            Every score maps to a fixed stability band.
          </p>
        </div>

        <div style={{ maxWidth: 780, margin: "0 auto" }}>
          {/* Animated horizontal bar */}
          <div
            style={{
              display: "flex",
              borderRadius: 8,
              overflow: "hidden",
              height: mobile ? 12 : 16,
              marginBottom: 48,
            }}
          >
            {bands.map((band, i) => (
              <div
                key={band.label}
                style={{
                  width: band.width,
                  backgroundColor: band.color,
                  transform: visible ? "scaleX(1)" : "scaleX(0)",
                  transformOrigin: "left center",
                  transition: `transform 0.6s cubic-bezier(0.22,1,0.36,1) ${300 + i * 150}ms`,
                }}
              />
            ))}
          </div>

          {/* 4-column grid */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: mobile ? "1fr" : "repeat(4, 1fr)",
              gap: mobile ? 20 : S.gridGap,
            }}
          >
            {bands.map((band, i) => (
              <div
                key={band.label}
                style={{
                  opacity: visible ? 1 : 0,
                  transform: visible ? "translateY(0)" : "translateY(14px)",
                  transition: `opacity 0.5s ease-out ${400 + i * 100}ms, transform 0.5s ease-out ${400 + i * 100}ms`,
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 10,
                    marginBottom: 8,
                  }}
                >
                  <div
                    style={{
                      width: 10,
                      height: 10,
                      borderRadius: "50%",
                      backgroundColor: band.color,
                      flexShrink: 0,
                    }}
                  />
                  <span
                    className="text-[13px]"
                    style={{ fontWeight: 600, color: B.navy }}
                  >
                    {band.range}
                  </span>
                </div>
                <h3
                  className="text-[14px]"
                  style={{
                    fontWeight: 600,
                    color: band.color,
                    marginBottom: 6,
                    marginTop: 0,
                  }}
                >
                  {band.label}
                </h3>
                <p
                  className="text-[13px]"
                  style={{ color: B.muted, lineHeight: 1.6, margin: 0 }}
                >
                  {band.desc}
                </p>
              </div>
            ))}
          </div>

          <p
            className="text-[13px]"
            style={{
              color: B.light,
              textAlign: "center",
              marginTop: 40,
              letterSpacing: "0.02em",
              opacity: visible ? 1 : 0,
              transition: "opacity 0.5s ease-out 800ms",
            }}
          >
            Band thresholds are fixed under Model RP-2.0.
          </p>
        </div>
      </div>
    </section>
  );
}


/* ================================================================== */
/* 7. INDUSTRY CONTEXT — Sand background                               */
/* ================================================================== */
function IndustryContext() {
  const { ref, visible } = useInView();
  const mobile = useMobile();

  return (
    <section
      ref={ref}
      aria-label="Industry Context"
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
            maxWidth: 680,
            margin: "0 auto",
            textAlign: "center",
            opacity: visible ? 1 : 0,
            transform: visible ? "translateY(0)" : "translateY(14px)",
            transition: "opacity 0.6s ease-out, transform 0.6s ease-out",
          }}
        >
          <h2
            className="text-[28px] md:text-[36px]"
            style={{
              color: B.navy,
              fontFamily: DISPLAY_FONT,
              fontWeight: 400,
              letterSpacing: S.lsHeading,
              marginBottom: S.h2mb,
            }}
          >
            Industry and income model context
          </h2>
          <p
            className="text-[15px] md:text-[17px]"
            style={{
              color: B.muted,
              lineHeight: S.lhBody,
              marginBottom: S.paraMb,
            }}
          >
            The core score is fixed regardless of industry. However, the report
            includes additional context tailored to your income model and industry
            — including relevant risk scenarios, improvement priorities, and peer
            benchmarking.
          </p>
          <p
            className="text-[15px] md:text-[17px]"
            style={{
              color: B.muted,
              lineHeight: S.lhBody,
              marginBottom: 0,
            }}
          >
            This context layer enriches the interpretation without altering the
            score itself.
          </p>
        </div>
      </div>
    </section>
  );
}


/* ================================================================== */
/* 8. INTEGRITY AND VERIFICATION — White background                    */
/* ================================================================== */
function Integrity() {
  const { ref, visible } = useInView();
  const mobile = useMobile();
  const [open, setOpen] = useState<number | null>(null);

  const panels = [
    {
      title: "Consistency",
      dotColor: B.teal,
      items: [
        "The same answers produce the same score",
        "Fixed scoring rules under Model RP-2.0",
        "AI does not determine assessment results",
        "Framework changes create a new model version",
      ],
    },
    {
      title: "Verification",
      dotColor: B.purple,
      items: [
        "Unique record ID on each report",
        "Integrity hash for tamper detection",
        "Model version recorded on every assessment",
        "Reports can be verified at runpayway.com/verify",
      ],
    },
    {
      title: "Non-predictive nature",
      dotColor: B.navy,
      items: [
        "The score reflects income structure at the time of assessment",
        "It is not a prediction of future financial outcomes",
        "It is not financial advice, credit underwriting, or investment guidance",
        "Reassessment is recommended after meaningful structural change",
      ],
    },
  ];

  return (
    <section
      ref={ref}
      aria-label="Assessment Integrity"
      style={{
        backgroundColor: "#ffffff",
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
            maxWidth: 720,
            margin: "0 auto",
            opacity: visible ? 1 : 0,
            transform: visible ? "translateY(0)" : "translateY(14px)",
            transition: "opacity 0.6s ease-out, transform 0.6s ease-out",
          }}
        >
          <h2
            className="text-[28px] md:text-[36px]"
            style={{
              color: B.navy,
              fontFamily: DISPLAY_FONT,
              fontWeight: 400,
              letterSpacing: S.lsHeading,
              marginBottom: S.h2mb,
              textAlign: "center",
            }}
          >
            Assessment integrity
          </h2>
          <p
            className="text-[15px] md:text-[17px]"
            style={{
              color: B.muted,
              lineHeight: S.lhBody,
              marginBottom: 48,
              textAlign: "center",
            }}
          >
            Every assessment is stamped with a unique record identifier and a
            verification hash. The model version is recorded on every report.
          </p>

          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {panels.map((panel, i) => {
              const isOpen = open === i;
              return (
                <div
                  key={panel.title}
                  style={{
                    backgroundColor: B.sand,
                    borderRadius: S.cardRadius,
                    border: `1px solid ${isOpen ? B.border : "rgba(14,26,43,0.06)"}`,
                    overflow: "hidden",
                    transition: "border-color 0.25s ease",
                    opacity: visible ? 1 : 0,
                    transform: visible ? "translateY(0)" : "translateY(10px)",
                    animationDelay: `${i * 80}ms`,
                  }}
                >
                  <button
                    onClick={() => setOpen(isOpen ? null : i)}
                    aria-expanded={isOpen}
                    style={{
                      width: "100%",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      padding: mobile ? "18px 20px" : "22px 28px",
                      background: "none",
                      border: "none",
                      cursor: "pointer",
                      textAlign: "left",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 12,
                      }}
                    >
                      <div
                        style={{
                          width: 10,
                          height: 10,
                          borderRadius: "50%",
                          backgroundColor: panel.dotColor,
                          flexShrink: 0,
                        }}
                      />
                      <span
                        className="text-[15px]"
                        style={{ fontWeight: 600, color: B.navy }}
                      >
                        {panel.title}
                      </span>
                    </div>
                    <svg
                      width="18"
                      height="18"
                      viewBox="0 0 18 18"
                      fill="none"
                      style={{
                        flexShrink: 0,
                        transform: isOpen ? "rotate(180deg)" : "rotate(0deg)",
                        transition: "transform 0.25s ease",
                      }}
                    >
                      <path
                        d="M4.5 6.75L9 11.25L13.5 6.75"
                        stroke={B.light}
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </button>

                  <div
                    style={{
                      maxHeight: isOpen ? 300 : 0,
                      opacity: isOpen ? 1 : 0,
                      overflow: "hidden",
                      transition: "max-height 0.35s ease, opacity 0.3s ease",
                    }}
                  >
                    <div
                      style={{
                        padding: mobile
                          ? "0 20px 20px 42px"
                          : "0 28px 24px 50px",
                      }}
                    >
                      {panel.items.map((item, j) => (
                        <div
                          key={j}
                          style={{
                            display: "flex",
                            alignItems: "flex-start",
                            gap: 10,
                            marginBottom:
                              j < panel.items.length - 1 ? 10 : 0,
                          }}
                        >
                          <div
                            style={{
                              width: 4,
                              height: 4,
                              borderRadius: "50%",
                              backgroundColor: B.light,
                              flexShrink: 0,
                              marginTop: 8,
                            }}
                          />
                          <p
                            className="text-[14px]"
                            style={{
                              color: B.muted,
                              lineHeight: 1.6,
                              margin: 0,
                            }}
                          >
                            {item}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}


/* ================================================================== */
/* 9. CTA — Dark gradient                                              */
/* ================================================================== */
function CtaSection() {
  const { ref, visible } = useInView();
  const mobile = useMobile();
  const [hovered, setHovered] = useState(false);

  return (
    <section
      ref={ref}
      aria-label="Call to Action"
      style={{
        background: B.gradient,
        position: "relative",
        overflow: "hidden",
        paddingTop: mobile ? S.sectionY.mobile : S.sectionY.desktop,
        paddingBottom: mobile ? S.sectionY.mobile : S.sectionY.desktop,
      }}
    >
      {/* Radial glow */}
      <div
        style={{
          position: "absolute",
          bottom: "-20%",
          left: "50%",
          width: 600,
          height: 600,
          transform: "translateX(-50%)",
          background:
            "radial-gradient(circle, rgba(31,109,122,0.15) 0%, transparent 70%)",
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
            maxWidth: 600,
            marginLeft: "auto",
            marginRight: "auto",
            opacity: visible ? 1 : 0,
            transform: visible ? "translateY(0)" : "translateY(20px)",
            transition: "opacity 0.7s ease-out, transform 0.7s ease-out",
          }}
        >
          <h2
            className="text-[32px] md:text-[40px]"
            style={{
              color: "#F4F1EA",
              fontFamily: DISPLAY_FONT,
              fontWeight: 400,
              letterSpacing: S.lsHero,
              lineHeight: S.lhHeading,
              marginBottom: 20,
            }}
          >
            See where your income stands.
          </h2>
          <p
            className="text-[15px] md:text-[16px]"
            style={{
              color: "rgba(244,241,234,0.70)",
              lineHeight: S.lhBody,
              marginBottom: 40,
            }}
          >
            Under two minutes. Full structural diagnosis. Instant delivery.
          </p>

          <Link
            href={STRIPE_SINGLE}
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
              backgroundColor: "#F4F1EA",
              color: B.navy,
              fontSize: mobile ? 14 : 15,
              fontWeight: 600,
              letterSpacing: "-0.01em",
              textDecoration: "none",
              transition:
                "transform 0.2s ease, box-shadow 0.2s ease, background-color 0.2s ease",
              transform: hovered ? "translateY(-2px)" : "translateY(0)",
              boxShadow: hovered
                ? "0 8px 32px rgba(0,0,0,0.25)"
                : "0 2px 8px rgba(0,0,0,0.12)",
            }}
          >
            Get My Income Stability Score&trade; &mdash; $39
          </Link>

          <p
            className="text-[12px]"
            style={{
              color: "rgba(244,241,234,0.40)",
              marginTop: 24,
              letterSpacing: "0.02em",
            }}
          >
            Model RP-2.0 &middot; Private by default
          </p>
        </div>
      </div>
    </section>
  );
}


/* ================================================================== */
/* MAIN EXPORT                                                         */
/* ================================================================== */
export default function MethodologyPage() {
  return (
    <div>
      <Hero />
      <Purpose />
      <SixDimensions />
      <ScoringFramework />
      <InteractionEffects />
      <ClassificationBands />
      <IndustryContext />
      <Integrity />
      <CtaSection />
    </div>
  );
}
