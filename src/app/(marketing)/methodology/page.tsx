"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";

/* ------------------------------------------------------------------ */
/*  Shared hooks                                                       */
/* ------------------------------------------------------------------ */

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

/* ------------------------------------------------------------------ */
/*  Section component                                                  */
/* ------------------------------------------------------------------ */

function DocSection({
  title,
  children,
  mobile,
  visible,
  delay,
}: {
  title: string;
  children: React.ReactNode;
  mobile: boolean;
  visible: boolean;
  delay: number;
}) {
  return (
    <div
      style={{
        background: "#FFFFFF",
        borderRadius: 16,
        border: "1px solid rgba(14,26,43,0.06)",
        padding: mobile ? "28px 24px" : "36px 36px",
        boxShadow: "0 2px 8px rgba(14,26,43,0.04)",
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(20px)",
        transition: "opacity 600ms ease, transform 600ms ease",
        transitionDelay: `${delay}ms`,
      }}
    >
      <h2
        style={{
          fontSize: mobile ? 17 : 19,
          fontWeight: 700,
          color: B.navy,
          letterSpacing: "-0.02em",
          marginBottom: 16,
          lineHeight: 1.3,
        }}
      >
        {title}
      </h2>
      {children}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Paragraph helper                                                   */
/* ------------------------------------------------------------------ */

function P({ children, style }: { children: React.ReactNode; style?: React.CSSProperties }) {
  return (
    <p
      style={{
        fontSize: 15,
        color: B.muted,
        lineHeight: 1.75,
        marginBottom: 12,
        ...style,
      }}
    >
      {children}
    </p>
  );
}

/* ------------------------------------------------------------------ */
/*  Bullet list helper                                                 */
/* ------------------------------------------------------------------ */

function BulletList({ items, style }: { items: string[]; style?: React.CSSProperties }) {
  return (
    <ul style={{ padding: 0, margin: "0 0 12px", listStyle: "none", ...style }}>
      {items.map((item) => (
        <li
          key={item}
          style={{
            fontSize: 15,
            color: B.muted,
            lineHeight: 1.75,
            paddingLeft: 20,
            position: "relative",
          }}
        >
          <span style={{ position: "absolute", left: 0, color: B.purple, fontSize: 11, lineHeight: "26px" }}>●</span>
          {item}
        </li>
      ))}
    </ul>
  );
}

/* ------------------------------------------------------------------ */
/*  Page                                                               */
/* ------------------------------------------------------------------ */

export default function MethodologyPage() {
  const mobile = useMobile();

  const heroAnim = useInView();
  const s1 = useInView();
  const s2 = useInView();
  const s3 = useInView();
  const s4 = useInView();
  const s5 = useInView();
  const s6 = useInView();
  const s7 = useInView();
  const s8 = useInView();
  const s9 = useInView();
  const s10 = useInView();
  const s11 = useInView();
  const s12 = useInView();
  const s13 = useInView();

  return (
    <div style={{ background: B.sand }}>
      {/* ============================================================ */}
      {/*  Hero                                                        */}
      {/* ============================================================ */}
      <section
        style={{
          position: "relative",
          overflow: "hidden",
          background: B.gradient,
          paddingTop: mobile ? 72 : 100,
          paddingBottom: mobile ? 72 : 100,
        }}
      >
        {/* Grain overlay */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            opacity: 0.15,
            mixBlendMode: "soft-light",
            pointerEvents: "none",
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='g'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23g)'/%3E%3C/svg%3E")`,
            backgroundSize: "180px 180px",
          }}
        />

        <div
          ref={heroAnim.ref}
          className="mx-auto"
          style={{
            position: "relative",
            zIndex: 1,
            maxWidth: 820,
            paddingLeft: mobile ? 24 : 40,
            paddingRight: mobile ? 24 : 40,
            textAlign: "center",
            opacity: heroAnim.visible ? 1 : 0,
            transform: heroAnim.visible ? "translateY(0)" : "translateY(24px)",
            transition: "opacity 700ms ease, transform 700ms ease",
          }}
        >
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              padding: "6px 16px",
              borderRadius: 100,
              border: "1px solid rgba(255,255,255,0.12)",
              background: "rgba(255,255,255,0.06)",
              marginBottom: 28,
            }}
          >
            <span style={{ fontSize: 12, fontWeight: 600, color: "rgba(255,255,255,0.70)", letterSpacing: "0.06em", textTransform: "uppercase" }}>
              Model Documentation
            </span>
          </div>

          <h1
            style={{
              fontSize: mobile ? 30 : 44,
              fontWeight: 700,
              color: "#FFFFFF",
              letterSpacing: "-0.03em",
              lineHeight: 1.15,
              marginBottom: 20,
            }}
          >
            Income Stability Score™
          </h1>

          <p
            style={{
              fontSize: mobile ? 15 : 18,
              color: "rgba(255,255,255,0.60)",
              lineHeight: 1.7,
              maxWidth: 560,
              margin: "0 auto",
            }}
          >
            Structural Stability Model RP-1.0 | Version 1.0
          </p>
        </div>
      </section>

      {/* ============================================================ */}
      {/*  Documentation sections                                      */}
      {/* ============================================================ */}
      <section
        style={{
          paddingTop: mobile ? 48 : 72,
          paddingBottom: mobile ? 64 : 96,
        }}
      >
        <div
          className="mx-auto"
          style={{
            maxWidth: 780,
            paddingLeft: mobile ? 24 : 40,
            paddingRight: mobile ? 24 : 40,
            display: "flex",
            flexDirection: "column",
            gap: mobile ? 20 : 24,
          }}
        >
          {/* 1. Methodology Overview */}
          <div ref={s1.ref}>
            <DocSection title="Methodology Overview" mobile={mobile} visible={s1.visible} delay={0}>
              <P>
                The Income Stability Score™ is a deterministic model that classifies the structural stability of an income system.
              </P>
              <P>
                Developed by RunPayway™, the model evaluates six canonical structural dimensions to produce a single integer score and corresponding stability classification band.
              </P>
              <P style={{ marginBottom: 0 }}>
                The objective of the model is to provide a consistent analytical method for evaluating how stable an income structure is based on how income is generated and sustained.
              </P>
            </DocSection>
          </div>

          {/* 2. Purpose of the Model */}
          <div ref={s2.ref}>
            <DocSection title="Purpose of the Model" mobile={mobile} visible={s2.visible} delay={0}>
              <P>
                The model is designed to classify the structural stability of income systems.
              </P>
              <P>
                It provides a standardized framework for evaluating key characteristics of income durability, including diversification, persistence, and variability of income streams.
              </P>
              <P style={{ marginBottom: 0 }}>
                The model evaluates the structure of income generation, rather than personal financial performance.
              </P>
            </DocSection>
          </div>

          {/* 3. Canonical Input Dimensions */}
          <div ref={s3.ref}>
            <DocSection title="The Six Scoring Factors" mobile={mobile} visible={s3.visible} delay={0}>
              <P>
                The diagnostic instrument consists of six questions that correspond to six structural input dimensions.
              </P>
              <P>
                Each dimension is scored on a five-point scale and converted to integer values used in the scoring calculation.
              </P>
              <P>The six canonical input dimensions are:</P>
              <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 16 }}>
                {[
                  "Recurring Revenue Base",
                  "Income Source Diversification",
                  "Income Source Count",
                  "Forward Revenue Visibility",
                  "Earnings Consistency",
                  "Income Without Active Work",
                ].map((dim) => (
                  <div
                    key={dim}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 12,
                      padding: "10px 16px",
                      borderRadius: 10,
                      background: B.sand,
                    }}
                  >
                    <span
                      style={{
                        width: 6,
                        height: 6,
                        borderRadius: "50%",
                        background: B.purple,
                        flexShrink: 0,
                      }}
                    />
                    <span style={{ fontSize: 14, fontWeight: 600, color: B.navy }}>{dim}</span>
                  </div>
                ))}
              </div>
              <P style={{ marginBottom: 0 }}>
                These dimensions describe how income is generated, how diversified or concentrated it is, and how stable it is likely to be under disruption.
              </P>
            </DocSection>
          </div>

          {/* 4. Deterministic Scoring Framework */}
          <div ref={s4.ref}>
            <DocSection title="Deterministic Scoring Framework" mobile={mobile} visible={s4.visible} delay={0}>
              <P>The scoring process follows a fixed deterministic framework.</P>
              <P>Identical inputs under the same model version always produce identical outputs.</P>
              <P>
                The model uses fixed scoring rules with no rounding, no AI, no randomization, and no adaptive adjustments. The same inputs always produce the same score.
              </P>
              <P>
                Inputs are grouped into two scoring pillars representing income structure characteristics and income stability characteristics.
              </P>
              <P style={{ marginBottom: 0 }}>
                The final score is calculated using a deterministic weighted scoring framework applied to the pillar scores.
              </P>
            </DocSection>
          </div>

          {/* 5. Stability Classification System */}
          <div ref={s5.ref}>
            <DocSection title="Stability Classification System" mobile={mobile} visible={s5.visible} delay={0}>
              <P>The final score is mapped to one of four stability classification bands.</P>
              <div style={{ borderRadius: 12, overflow: "hidden", border: `1px solid ${B.sandDk}`, marginBottom: 16 }}>
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr",
                    padding: "10px 20px",
                    background: B.navy,
                  }}
                >
                  <span style={{ fontSize: 11, fontWeight: 600, color: "rgba(255,255,255,0.70)", letterSpacing: "0.08em", textTransform: "uppercase" }}>Stability Band</span>
                  <span style={{ fontSize: 11, fontWeight: 600, color: "rgba(255,255,255,0.70)", letterSpacing: "0.08em", textTransform: "uppercase", textAlign: "right" }}>Score Range</span>
                </div>
                {[
                  { band: "Limited", range: "0–39", dot: "#DC2626" },
                  { band: "Developing", range: "40–59", dot: "#F59E0B" },
                  { band: "Established", range: "60–79", dot: B.purple },
                  { band: "High", range: "80–100", dot: B.teal },
                ].map((row, i) => (
                  <div
                    key={row.band}
                    style={{
                      display: "grid",
                      gridTemplateColumns: "1fr 1fr",
                      padding: "12px 20px",
                      background: i % 2 === 0 ? "#FFFFFF" : B.sand,
                      alignItems: "center",
                    }}
                  >
                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                      <span style={{ width: 8, height: 8, borderRadius: "50%", background: row.dot, flexShrink: 0 }} />
                      <span style={{ fontSize: 14, fontWeight: 600, color: B.navy }}>{row.band}</span>
                    </div>
                    <span style={{ fontSize: 14, color: B.muted, textAlign: "right" }}>{row.range}</span>
                  </div>
                ))}
              </div>
              <P style={{ marginBottom: 0 }}>
                These classification bands provide context for interpreting the structural durability of the income system.
              </P>
            </DocSection>
          </div>

          {/* 6. Structural Interpretation Framework */}
          <div ref={s6.ref}>
            <DocSection title="Structural Interpretation Framework" mobile={mobile} visible={s6.visible} delay={0}>
              <P>The model produces a structured interpretation of the results.</P>
              <P>This interpretation identifies:</P>
              <BulletList items={[
                "The primary structural constraint affecting stability",
                "The key structural factors supporting stability",
                "A structural priority derived from the constraint",
              ]} />
              <P style={{ marginBottom: 0 }}>
                All interpretation outputs are generated deterministically using locked interpretation templates.
              </P>
            </DocSection>
          </div>

          {/* 7. Diagnostic Timeframe */}
          <div ref={s7.ref}>
            <DocSection title="Diagnostic Timeframe" mobile={mobile} visible={s7.visible} delay={0}>
              <P>
                The assessment evaluates income structure over the preceding twelve-month period based on the information reported by the subject.
              </P>
              <P style={{ marginBottom: 0 }}>
                The income continuity test considers a hypothetical 90-day cessation of active work to evaluate whether income would persist without continued labor.
              </P>
            </DocSection>
          </div>

          {/* 8. Analytical Scope */}
          <div ref={s8.ref}>
            <DocSection title="Analytical Scope" mobile={mobile} visible={s8.visible} delay={0}>
              <P>The model evaluates structural income stability only.</P>
              <P>The diagnostic does not assess:</P>
              <BulletList items={[
                "Creditworthiness",
                "Net worth",
                "Investment performance",
                "Debt capacity",
                "Future income growth",
              ]} />
              <P style={{ marginBottom: 0 }}>
                The assessment is analytical in nature and does not constitute financial advice.
              </P>
            </DocSection>
          </div>

          {/* 9. Non-Predictive Nature */}
          <div ref={s9.ref}>
            <DocSection title="Non-Predictive Nature" mobile={mobile} visible={s9.visible} delay={0}>
              <P>
                The Income Stability Score™ is a classification of current structural characteristics.
              </P>
              <P>
                The model does not forecast income, estimate growth, or predict future financial outcomes.
              </P>
              <P style={{ marginBottom: 0 }}>
                The score reflects the structural stability of the income system based solely on the information reported at the time of the assessment.
              </P>
            </DocSection>
          </div>

          {/* 10. Model Version Governance */}
          <div ref={s10.ref}>
            <DocSection title="Model Version Governance" mobile={mobile} visible={s10.visible} delay={0}>
              <P>Any change to the model requires a formal version update.</P>
              <P>Changes requiring a version update include:</P>
              <BulletList items={[
                "Diagnostic questions",
                "Answer mapping logic",
                "Canonical input order",
                "Scoring framework",
                "Classification thresholds",
                "Tie-break rules",
                "Interpretation templates",
                "Structural priority mapping",
              ]} />
              <P style={{ marginBottom: 0 }}>
                Historical assessments remain permanently tied to their original model version, ruleset identifier, and interpretation version.
              </P>
            </DocSection>
          </div>

          {/* 11. Assessment Record Integrity */}
          <div ref={s11.ref}>
            <DocSection title="Assessment Record Integrity" mobile={mobile} visible={s11.visible} delay={0}>
              <P>
                Each issued assessment produces an immutable record identified by a unique Record ID and Authorization Code.
              </P>
              <P>
                Records are append-only and cannot be modified, deleted, or regenerated after issuance.
              </P>
              <P style={{ marginBottom: 0 }}>
                A built-in integrity check ensures no record can be altered after it is issued.
              </P>
            </DocSection>
          </div>

          {/* 12. Independent Verification */}
          <div ref={s12.ref}>
            <DocSection title="Independent Verification" mobile={mobile} visible={s12.visible} delay={0}>
              <P>Issued assessments may be independently verified at:</P>
              <div
                style={{
                  padding: "14px 20px",
                  borderRadius: 10,
                  background: B.sand,
                  marginBottom: 16,
                  textAlign: "center",
                }}
              >
                <Link
                  href="/verify"
                  style={{
                    fontSize: 15,
                    fontWeight: 600,
                    color: B.purple,
                    textDecoration: "none",
                    borderBottom: "1px solid rgba(75,63,174,0.30)",
                    transition: "border-color 180ms ease",
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.borderColor = B.purple; }}
                  onMouseLeave={(e) => { e.currentTarget.style.borderColor = "rgba(75,63,174,0.30)"; }}
                >
                  RunPayway™.com/verify
                </Link>
              </div>
              <P>
                Verification requires the Record ID and Authorization Code.
              </P>
              <P style={{ marginBottom: 0 }}>
                The verification system confirms that the record exists and returns the score, classification band, and issuance details without exposing internal assessment data.
              </P>
            </DocSection>
          </div>

          {/* 13. Methodology Transparency */}
          <div ref={s13.ref}>
            <DocSection title="Methodology Transparency" mobile={mobile} visible={s13.visible} delay={0}>
              <P>
                The scoring methodology, input structure, weighting framework, and classification system are publicly documented.
              </P>
              <P>
                The model operates under a published ruleset containing the complete ruleset and interpretation templates.
              </P>
              <P style={{ marginBottom: 0 }}>
                A verified ruleset identifier ensures consistent scoring across all assessments issued under the same model version.
              </P>
            </DocSection>
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/*  CTA                                                         */}
      {/* ============================================================ */}
      <section
        style={{
          position: "relative",
          overflow: "hidden",
          background: B.gradient,
          paddingTop: mobile ? 72 : 100,
          paddingBottom: mobile ? 72 : 100,
        }}
      >
        {/* Grain overlay */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            opacity: 0.15,
            mixBlendMode: "soft-light",
            pointerEvents: "none",
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='g'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23g)'/%3E%3C/svg%3E")`,
            backgroundSize: "180px 180px",
          }}
        />

        {/* Concentric halos */}
        {[220, 380, 560].map((size, i) => (
          <div
            key={size}
            style={{
              position: "absolute",
              top: "50%",
              left: "50%",
              width: size,
              height: size,
              borderRadius: "50%",
              transform: "translate(-50%, -50%)",
              border: `1px solid rgba(255,255,255,${0.06 - i * 0.015})`,
              pointerEvents: "none",
            }}
          />
        ))}

        <div
          className="mx-auto"
          style={{
            position: "relative",
            zIndex: 1,
            maxWidth: 680,
            paddingLeft: mobile ? 24 : 40,
            paddingRight: mobile ? 24 : 40,
            textAlign: "center",
          }}
        >
          <h2
            style={{
              fontSize: mobile ? 26 : 38,
              fontWeight: 700,
              color: "#FFFFFF",
              letterSpacing: "-0.03em",
              lineHeight: 1.2,
              marginBottom: 20,
            }}
          >
            Run Your Assessment
          </h2>

          <p
            style={{
              fontSize: mobile ? 14 : 16,
              color: "rgba(255,255,255,0.60)",
              lineHeight: 1.75,
              maxWidth: 520,
              margin: "0 auto 36px",
            }}
          >
            Complete the assessment in under two minutes and receive your Income Stability Score™ instantly with a full structured diagnostic report.
          </p>

          <Link
            href="/pricing"
            className="cta-tick inline-flex items-center justify-center font-semibold"
            style={{
              height: mobile ? 52 : 56,
              paddingLeft: mobile ? 28 : 36,
              paddingRight: mobile ? 28 : 36,
              borderRadius: 14,
              background: "#FFFFFF",
              color: B.navy,
              fontSize: mobile ? 15 : 16,
              letterSpacing: "-0.01em",
              border: "none",
              boxShadow: "0 8px 24px rgba(0,0,0,0.18)",
              transition: "transform 180ms ease, box-shadow 180ms ease",
              width: mobile ? "100%" : "auto",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "translateY(-2px)";
              e.currentTarget.style.boxShadow = "0 12px 32px rgba(0,0,0,0.24)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.boxShadow = "0 8px 24px rgba(0,0,0,0.18)";
            }}
          >
            <span className="tick tick-navy" />
            <span className="cta-label">Get My Income Stability Score™</span>
            <span className="cta-arrow cta-arrow-navy" />
          </Link>

          <p style={{ fontSize: 12, color: "rgba(255,255,255,0.30)", marginTop: 32, letterSpacing: "0.02em" }}>
            Powered by Structural Stability Model RP-1.0
          </p>
        </div>
      </section>
    </div>
  );
}
