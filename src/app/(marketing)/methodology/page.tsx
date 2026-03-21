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


/* ================================================================== */
/* HERO                                                                */
/* ================================================================== */
function Hero() {
  const { ref, visible } = useInView();
  const mobile = useMobile();

  return (
    <section
      ref={ref}
      aria-label="Methodology Hero"
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
            Methodology
          </h1>
          <p
            className="text-[16px] md:text-[18px]"
            style={{ color: B.muted, lineHeight: S.lhBody, maxWidth: 620, marginLeft: "auto", marginRight: "auto" }}
          >
            A complete description of how the Income Stability Score is constructed, from canonical inputs through scoring framework to classification and verification.
          </p>
        </div>
      </div>
    </section>
  );
}


/* ================================================================== */
/* PURPOSE OF THE MODEL                                                */
/* ================================================================== */
function Purpose() {
  const { ref, visible } = useInView();
  const mobile = useMobile();

  return (
    <section
      ref={ref}
      aria-label="Purpose"
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
          <h2 className="text-[28px] md:text-[36px]" style={{ color: B.navy, fontWeight: 600, letterSpacing: S.lsHeading, marginBottom: S.h2mb }}>
            Purpose of the model
          </h2>
          <p className="text-[15px] md:text-[16px]" style={{ color: B.muted, lineHeight: S.lhBody, marginBottom: S.paraMb }}>
            Model RP-2.0 exists to answer a single question: how structurally durable is this income? It does not predict future earnings, estimate creditworthiness, or assess investment potential. It measures the architecture of how someone earns today.
          </p>
          <p className="text-[15px] md:text-[16px]" style={{ color: B.muted, lineHeight: S.lhBody, marginBottom: 0 }}>
            The model is designed for income structures that traditional metrics struggle to evaluate — freelance, contract, gig, multi-source, and variable income. It produces a score from 0 to 100 using entirely deterministic rules. The same inputs always produce the same output.
          </p>
        </div>
      </div>
    </section>
  );
}


/* ================================================================== */
/* SIX CANONICAL INPUTS                                                */
/* ================================================================== */
function CanonicalInputs() {
  const { ref, visible } = useInView();
  const mobile = useMobile();

  const inputs = [
    { num: "01", title: "Number of Income Sources", desc: "Total count of distinct income streams. Each source must represent a separate origin of payment — not separate invoices from the same client." },
    { num: "02", title: "Largest Source Concentration", desc: "The percentage of total income derived from the single largest source. Measures concentration risk and single-point-of-failure exposure." },
    { num: "03", title: "Income Predictability", desc: "How consistent and regular income patterns are across months. Measures whether income arrives on a reliable schedule or is sporadic." },
    { num: "04", title: "Forward Commitment Horizon", desc: "How far ahead income is contractually committed before the earning period begins. Longer horizons indicate stronger forward visibility." },
    { num: "05", title: "Passive or Recurring Share", desc: "The percentage of total income that continues without active work — recurring revenue, subscriptions, royalties, or contractual retainers." },
    { num: "06", title: "Industry or Income Category", desc: "The broad category of work or income model. Used for peer benchmarking and industry-specific refinement of stress scenarios." },
  ];

  return (
    <section
      ref={ref}
      aria-label="Six Canonical Inputs"
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
          <h2 className="text-[28px] md:text-[36px]" style={{ color: B.navy, fontWeight: 600, letterSpacing: S.lsHeading, marginBottom: 12 }}>
            Six canonical inputs
          </h2>
          <p className="text-[15px]" style={{ color: B.muted, lineHeight: S.lhBody, maxWidth: 560, marginLeft: "auto", marginRight: "auto" }}>
            Every assessment begins with exactly six inputs. No more, no less. These are the only data points the model accepts.
          </p>
        </div>

        <div style={{ maxWidth: 740, margin: "0 auto" }}>
          {inputs.map((input, i) => (
            <div
              key={input.num}
              style={{
                display: "flex",
                gap: mobile ? 16 : 28,
                alignItems: "flex-start",
                marginBottom: i < inputs.length - 1 ? 36 : 0,
                opacity: visible ? 1 : 0,
                transform: visible ? "translateY(0)" : "translateY(12px)",
                transition: `opacity 0.5s ease-out ${i * 80}ms, transform 0.5s ease-out ${i * 80}ms`,
              }}
            >
              <div
                className="text-[28px]"
                style={{
                  fontWeight: 800,
                  color: "rgba(75,63,174,0.15)",
                  lineHeight: 1,
                  flexShrink: 0,
                  minWidth: 40,
                  paddingTop: 2,
                }}
              >
                {input.num}
              </div>
              <div>
                <h3 className="text-[15px]" style={{ fontWeight: 700, color: B.navy, marginBottom: 8 }}>{input.title}</h3>
                <p className="text-[14px]" style={{ color: B.muted, lineHeight: S.lhBody, margin: 0 }}>{input.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}


/* ================================================================== */
/* SCORING FRAMEWORK                                                   */
/* ================================================================== */
function ScoringFramework() {
  const { ref, visible } = useInView();
  const mobile = useMobile();

  return (
    <section
      ref={ref}
      aria-label="Scoring Framework"
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
          <h2 className="text-[28px] md:text-[36px]" style={{ color: B.navy, fontWeight: 600, letterSpacing: S.lsHeading, marginBottom: S.h2mb }}>
            Scoring framework
          </h2>
          <p className="text-[15px] md:text-[16px]" style={{ color: B.muted, lineHeight: S.lhBody, marginBottom: 40 }}>
            The final score is composed of two weighted blocks that together sum to 100 maximum points.
          </p>

          {/* Blocks */}
          <div style={{ display: "grid", gridTemplateColumns: mobile ? "1fr" : "1fr 1fr", gap: S.gridGap, marginBottom: 40 }}>
            <div style={{
              backgroundColor: "#ffffff",
              borderRadius: S.cardRadius,
              padding: mobile ? S.cardPad.mobile : S.cardPad.desktop,
              border: "1px solid rgba(14,26,43,0.06)",
            }}>
              <div className="text-[11px] uppercase" style={{ color: B.teal, fontWeight: 700, letterSpacing: "0.08em", marginBottom: 12 }}>
                Structure Block
              </div>
              <div className="text-[36px]" style={{ fontWeight: 700, color: B.navy, lineHeight: 1, marginBottom: 12 }}>60 pts</div>
              <p className="text-[13px]" style={{ color: B.muted, lineHeight: 1.6, margin: 0 }}>
                Measures the architecture of income sources: count, diversification, and predictability patterns. This block captures how income is organized.
              </p>
            </div>
            <div style={{
              backgroundColor: "#ffffff",
              borderRadius: S.cardRadius,
              padding: mobile ? S.cardPad.mobile : S.cardPad.desktop,
              border: "1px solid rgba(14,26,43,0.06)",
            }}>
              <div className="text-[11px] uppercase" style={{ color: B.purple, fontWeight: 700, letterSpacing: "0.08em", marginBottom: 12 }}>
                Stability Block
              </div>
              <div className="text-[36px]" style={{ fontWeight: 700, color: B.navy, lineHeight: 1, marginBottom: 12 }}>40 pts</div>
              <p className="text-[13px]" style={{ color: B.muted, lineHeight: 1.6, margin: 0 }}>
                Measures behavioral durability: forward commitment, continuity ratio, and resilience under stress. This block captures how income holds up.
              </p>
            </div>
          </div>

          <h3 className="text-[18px]" style={{ fontWeight: 700, color: B.navy, marginBottom: 16 }}>
            Interaction effects
          </h3>
          <p className="text-[15px] md:text-[16px]" style={{ color: B.muted, lineHeight: S.lhBody, marginBottom: S.paraMb }}>
            After raw block scores are computed, the model applies interaction effects — cross-dimensional patterns that modify the total. These include penalties for structural contradictions (e.g., high source count but extreme concentration) and bonuses for reinforcing patterns (e.g., high predictability combined with strong forward commitment).
          </p>
          <p className="text-[15px] md:text-[16px]" style={{ color: B.muted, lineHeight: S.lhBody, marginBottom: 0 }}>
            Interaction effects are fixed rules, not learned weights. They are documented in the model manifest and versioned alongside all other scoring parameters.
          </p>
        </div>
      </div>
    </section>
  );
}


/* ================================================================== */
/* CLASSIFICATION BANDS                                                */
/* ================================================================== */
function ClassificationBands() {
  const { ref, visible } = useInView();
  const mobile = useMobile();

  const bands = [
    { range: "0\u201329", label: "Limited", color: "#DC2626", desc: "Income structure is fragile. Heavy dependence on active work with minimal structural support. High exposure to disruption." },
    { range: "30\u201349", label: "Developing", color: "#F59E0B", desc: "Some structural elements exist, but the income remains exposed. Moderate resilience with clear improvement paths." },
    { range: "50\u201374", label: "Established", color: B.teal, desc: "Meaningful stability with structural protection across multiple dimensions. The income can absorb moderate disruption." },
    { range: "75\u2013100", label: "High", color: B.navy, desc: "Durable income architecture. Strong diversification, forward visibility, and continuity. Less dependent on constant active effort." },
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
          <h2 className="text-[28px] md:text-[36px]" style={{ color: B.navy, fontWeight: 600, letterSpacing: S.lsHeading, marginBottom: 12 }}>
            Classification bands
          </h2>
          <p className="text-[15px]" style={{ color: B.muted, lineHeight: S.lhBody, maxWidth: 560, marginLeft: "auto", marginRight: "auto" }}>
            Every score maps to exactly one stability band. Band thresholds are fixed under Model RP-2.0 and do not change.
          </p>
        </div>

        <div style={{ maxWidth: 720, margin: "0 auto" }}>
          {bands.map((band, i) => (
            <div
              key={band.label}
              style={{
                display: "flex",
                alignItems: mobile ? "flex-start" : "center",
                flexDirection: mobile ? "column" : "row",
                gap: mobile ? 10 : 24,
                padding: mobile ? "20px 16px" : "24px 28px",
                marginBottom: i < bands.length - 1 ? 2 : 0,
                borderRadius: S.cardRadius,
                backgroundColor: B.sand,
                border: "1px solid rgba(14,26,43,0.04)",
                opacity: visible ? 1 : 0,
                transform: visible ? "translateY(0)" : "translateY(12px)",
                transition: `opacity 0.5s ease-out ${i * 80}ms, transform 0.5s ease-out ${i * 80}ms`,
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 12, minWidth: mobile ? "auto" : 180, flexShrink: 0 }}>
                <div style={{ width: 12, height: 12, borderRadius: "50%", backgroundColor: band.color, flexShrink: 0 }} />
                <span className="text-[14px]" style={{ fontWeight: 700, color: B.navy, minWidth: 64 }}>{band.range}</span>
                <span className="text-[14px]" style={{ fontWeight: 600, color: band.color }}>{band.label}</span>
              </div>
              <p className="text-[13px]" style={{ color: B.muted, lineHeight: 1.6, margin: 0 }}>
                {band.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}


/* ================================================================== */
/* OUTCOME LAYER                                                       */
/* ================================================================== */
function OutcomeLayer() {
  const { ref, visible } = useInView();
  const mobile = useMobile();

  return (
    <section
      ref={ref}
      aria-label="Outcome Layer"
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
          <h2 className="text-[28px] md:text-[36px]" style={{ color: B.navy, fontWeight: 600, letterSpacing: S.lsHeading, marginBottom: S.h2mb }}>
            Outcome layer
          </h2>
          <p className="text-[15px] md:text-[16px]" style={{ color: B.muted, lineHeight: S.lhBody, marginBottom: S.paraMb }}>
            Beyond the raw score and classification, the model generates an outcome layer that provides context and actionable intelligence.
          </p>

          <h3 className="text-[16px]" style={{ fontWeight: 700, color: B.navy, marginBottom: 10 }}>
            Income model families
          </h3>
          <p className="text-[15px] md:text-[16px]" style={{ color: B.muted, lineHeight: S.lhBody, marginBottom: 28 }}>
            Each assessment is mapped to an income model family based on the combination of inputs. These families — such as "single-source freelance," "diversified consulting," or "hybrid employment" — determine which stress scenarios, improvement paths, and peer benchmarks are most relevant.
          </p>

          <h3 className="text-[16px]" style={{ fontWeight: 700, color: B.navy, marginBottom: 10 }}>
            Industry refinement
          </h3>
          <p className="text-[15px] md:text-[16px]" style={{ color: B.muted, lineHeight: S.lhBody, marginBottom: 0 }}>
            The sixth input — industry or income category — is used to calibrate peer benchmarking and to apply industry-specific context to recommendations. A score of 65 means different things in professional services versus creative freelancing, and the outcome layer reflects this through tailored actions and percentile placement.
          </p>
        </div>
      </div>
    </section>
  );
}


/* ================================================================== */
/* INTEGRITY                                                           */
/* ================================================================== */
function Integrity() {
  const { ref, visible } = useInView();
  const mobile = useMobile();

  return (
    <section
      ref={ref}
      aria-label="Integrity"
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
          <h2 className="text-[28px] md:text-[36px]" style={{ color: B.navy, fontWeight: 600, letterSpacing: S.lsHeading, marginBottom: S.h2mb }}>
            Integrity and verification
          </h2>
          <p className="text-[15px] md:text-[16px]" style={{ color: B.muted, lineHeight: S.lhBody, marginBottom: S.paraMb }}>
            Every assessment is hashed using SHA-256 and stamped with the model version that produced it. This creates a verifiable chain: the inputs, the scoring rules, and the output are all cryptographically linked.
          </p>
          <p className="text-[15px] md:text-[16px]" style={{ color: B.muted, lineHeight: S.lhBody, marginBottom: S.paraMb }}>
            Model manifests are versioned and immutable. When any rule, weight, threshold, or classification boundary changes, the model version increments. Model RP-2.0 assessments can only be compared to other Model RP-2.0 assessments. Cross-version comparison is explicitly not supported.
          </p>
          <p className="text-[15px] md:text-[16px]" style={{ color: B.muted, lineHeight: S.lhBody, marginBottom: 0 }}>
            This architecture ensures that assessments are auditable, reproducible, and tamper-evident. Recipients of a report can verify its authenticity without needing to trust the individual or RunPayway itself.
          </p>
        </div>
      </div>
    </section>
  );
}


/* ================================================================== */
/* NON-PREDICTIVE DISCLAIMER                                           */
/* ================================================================== */
function NonPredictive() {
  const { ref, visible } = useInView();
  const mobile = useMobile();

  return (
    <section
      ref={ref}
      aria-label="Non-Predictive Disclaimer"
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
            padding: mobile ? S.cardPad.mobile : S.cardPad.desktop,
            backgroundColor: "#ffffff",
            borderRadius: S.panelRadius,
            border: "1px solid rgba(14,26,43,0.08)",
            opacity: visible ? 1 : 0,
            transform: visible ? "translateY(0)" : "translateY(14px)",
            transition: "opacity 0.6s ease-out, transform 0.6s ease-out",
          }}
        >
          <div className="text-[11px] uppercase" style={{ color: B.teal, fontWeight: 700, letterSpacing: S.lsLabel, marginBottom: 16 }}>
            Important Distinction
          </div>
          <h3 className="text-[18px]" style={{ fontWeight: 700, color: B.navy, marginBottom: 16 }}>
            The Income Stability Score is not predictive
          </h3>
          <p className="text-[14px]" style={{ color: B.muted, lineHeight: S.lhBody, marginBottom: S.paraMb }}>
            Model RP-2.0 measures the structural properties of income as they exist at the time of assessment. It does not predict future earnings, estimate probability of income loss, or forecast financial outcomes.
          </p>
          <p className="text-[14px]" style={{ color: B.muted, lineHeight: S.lhBody, marginBottom: 0 }}>
            Stress scenarios show how the score would change under hypothetical conditions — they are structural projections, not probabilistic forecasts. The score reflects current architecture, not future performance.
          </p>
        </div>
      </div>
    </section>
  );
}


/* ================================================================== */
/* MODEL VERSION BADGE                                                 */
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
        <p className="text-[12px]" style={{ color: B.light, marginTop: 16, lineHeight: 1.5, maxWidth: 480, marginLeft: "auto", marginRight: "auto" }}>
          This document describes Model RP-2.0, the current production version of the Income Stability Score. All methodology details are version-locked.
        </p>
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
      <CanonicalInputs />
      <ScoringFramework />
      <ClassificationBands />
      <OutcomeLayer />
      <Integrity />
      <NonPredictive />
      <ModelBadge />
    </div>
  );
}
