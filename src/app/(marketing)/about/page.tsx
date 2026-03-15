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
}: {
  title: string;
  children: React.ReactNode;
  mobile: boolean;
  visible: boolean;
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
/*  Page                                                               */
/* ------------------------------------------------------------------ */

export default function AboutPage() {
  const mobile = useMobile();

  const heroAnim = useInView();
  const s1 = useInView();
  const s2 = useInView();
  const s3 = useInView();
  const s4 = useInView();
  const s5 = useInView();
  const s6 = useInView();

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
              About
            </span>
          </div>

          <h1
            style={{
              fontSize: mobile ? 30 : 44,
              fontWeight: 700,
              color: "#FFFFFF",
              letterSpacing: "-0.03em",
              lineHeight: 1.15,
              marginBottom: 24,
            }}
          >
            About RunPayway
          </h1>

          <p
            style={{
              fontSize: mobile ? 16 : 18,
              color: "rgba(255,255,255,0.72)",
              lineHeight: 1.7,
              maxWidth: 640,
              margin: "0 auto 16px",
            }}
          >
            RunPayway™ is a structural income stability diagnostic platform.
          </p>

          <p
            style={{
              fontSize: mobile ? 14 : 16,
              color: "rgba(255,255,255,0.50)",
              lineHeight: 1.75,
              maxWidth: 600,
              margin: "0 auto 16px",
            }}
          >
            The platform evaluates how stable an income structure is based on how income is generated and sustained. Assessments are performed using a deterministic analytical model known as the Structural Stability Model RP-1.0.
          </p>

          <p
            style={{
              fontSize: mobile ? 14 : 16,
              color: "rgba(255,255,255,0.50)",
              lineHeight: 1.75,
              maxWidth: 600,
              margin: "0 auto 16px",
            }}
          >
            RunPayway produces a standardized metric called the Income Stability Score™, which measures the structural durability of an income system.
          </p>

          <p
            style={{
              fontSize: mobile ? 14 : 15,
              color: "rgba(255,255,255,0.40)",
              lineHeight: 1.75,
              maxWidth: 600,
              margin: "0 auto",
            }}
          >
            The platform is designed to provide individuals and organizations with a consistent analytical method for understanding how stable an income structure is based on its underlying characteristics.
          </p>
        </div>
      </section>

      {/* ============================================================ */}
      {/*  Content sections                                            */}
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
            paddingLeft: mobile ? 20 : 40,
            paddingRight: mobile ? 20 : 40,
            display: "flex",
            flexDirection: "column",
            gap: mobile ? 20 : 24,
          }}
        >
          {/* The Income Stability Score */}
          <div ref={s1.ref}>
            <DocSection title="The Income Stability Score™" mobile={mobile} visible={s1.visible}>
              <P>
                The Income Stability Score™ is a structural classification metric that evaluates income stability on a scale from 0 to 100.
              </P>
              <P>
                The score measures the structural characteristics of income generation rather than the financial performance of the individual or organization.
              </P>
              <P>
                The model evaluates six structural dimensions that describe how income behaves under disruption, variability, and reliance on active labor.
              </P>
              <P style={{ marginBottom: 0 }}>
                Scores are generated using deterministic scoring rules defined under Structural Stability Model RP-1.0.
              </P>
            </DocSection>
          </div>

          {/* What the Model Measures */}
          <div ref={s2.ref}>
            <DocSection title="What the Model Measures" mobile={mobile} visible={s2.visible}>
              <P>
                RunPayway evaluates the structural stability of income systems.
              </P>
              <P>
                The model analyzes factors such as income diversification, recurring revenue characteristics, income concentration, earnings variability, and income continuity without active labor.
              </P>
              <P>
                These characteristics describe how stable an income structure is likely to be under disruption.
              </P>
              <P style={{ marginBottom: 0 }}>
                The model evaluates the structure of income generation rather than financial outcomes.
              </P>
            </DocSection>
          </div>

          {/* Model Governance */}
          <div ref={s3.ref}>
            <DocSection title="Model Governance" mobile={mobile} visible={s3.visible}>
              <P>
                RunPayway assessments are generated using a deterministic scoring framework governed by a version-controlled model system.
              </P>
              <P>
                Each assessment applies fixed scoring rules defined under the active model version.
              </P>
              <P>
                Identical inputs under the same model version always produce identical outputs.
              </P>
              <P>
                Any change to model inputs, scoring logic, classification thresholds, or interpretation templates requires a formal model version update.
              </P>
              <P style={{ marginBottom: 0 }}>
                All assessments remain permanently tied to the model version under which they were issued.
              </P>
            </DocSection>
          </div>

          {/* Assessment Integrity and Verification */}
          <div ref={s4.ref}>
            <DocSection title="Assessment Integrity and Verification" mobile={mobile} visible={s4.visible}>
              <P>
                Each RunPayway assessment produces an immutable record.
              </P>
              <P>
                Every issued assessment receives a unique Record ID and Authorization Code that allow the record to be independently verified.
              </P>
              <P>
                Verification confirms that the score was generated by the RunPayway model and that the assessment record has not been modified.
              </P>
              <P style={{ marginBottom: 0 }}>
                Assessment verification can be performed through the{" "}
                <Link
                  href="/verify"
                  style={{
                    color: B.purple,
                    fontWeight: 600,
                    textDecoration: "none",
                    borderBottom: "1px solid rgba(75,63,174,0.30)",
                    transition: "border-color 180ms ease",
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.borderColor = B.purple; }}
                  onMouseLeave={(e) => { e.currentTarget.style.borderColor = "rgba(75,63,174,0.30)"; }}
                >
                  Verify a Score
                </Link>{" "}
                system.
              </P>
            </DocSection>
          </div>

          {/* Analytical Scope */}
          <div ref={s5.ref}>
            <DocSection title="Analytical Scope" mobile={mobile} visible={s5.visible}>
              <P>
                RunPayway provides analytical assessments of income structure.
              </P>
              <P>
                The platform evaluates structural income stability only and does not assess:
              </P>
              <ul style={{ padding: 0, margin: "0 0 12px", listStyle: "none" }}>
                {[
                  "Creditworthiness",
                  "Net worth",
                  "Investment performance",
                  "Debt capacity",
                  "Future income growth",
                ].map((item) => (
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
              <P>
                The Income Stability Score™ reflects the structural characteristics of income at the time of assessment based on information provided by the user.
              </P>
              <P style={{ marginBottom: 0 }}>
                RunPayway does not provide financial, investment, or tax advice.
              </P>
            </DocSection>
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/*  Closing brand bar                                           */}
      {/* ============================================================ */}
      <section
        style={{
          position: "relative",
          overflow: "hidden",
          background: B.gradient,
          paddingTop: mobile ? 56 : 72,
          paddingBottom: mobile ? 56 : 72,
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
        {[180, 320, 480].map((size, i) => (
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
          ref={s6.ref}
          className="mx-auto"
          style={{
            position: "relative",
            zIndex: 1,
            maxWidth: 600,
            paddingLeft: mobile ? 24 : 40,
            paddingRight: mobile ? 24 : 40,
            textAlign: "center",
            opacity: s6.visible ? 1 : 0,
            transform: s6.visible ? "translateY(0)" : "translateY(16px)",
            transition: "opacity 700ms ease, transform 700ms ease",
          }}
        >
          <div style={{ fontSize: mobile ? 22 : 28, fontWeight: 700, color: "#FFFFFF", letterSpacing: "-0.02em", marginBottom: 8 }}>
            RunPayway™
          </div>
          <div style={{ fontSize: mobile ? 15 : 17, color: "rgba(255,255,255,0.60)", marginBottom: 24 }}>
            Income Stability Score™
          </div>
          <p style={{ fontSize: 12, color: "rgba(255,255,255,0.30)", letterSpacing: "0.02em" }}>
            Powered by Structural Stability Model RP-1.0
          </p>
        </div>
      </section>
    </div>
  );
}
