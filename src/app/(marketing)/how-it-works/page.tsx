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

const canHover = () =>
  typeof window !== "undefined" && window.matchMedia("(hover: hover)").matches;

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
/*  Step Card                                                          */
/* ------------------------------------------------------------------ */

function StepCard({
  number,
  title,
  description,
  bullets,
  note,
  mobile,
  visible,
  delay,
}: {
  number: string;
  title: string;
  description: string;
  bullets?: string[];
  note?: string;
  mobile: boolean;
  visible: boolean;
  delay: number;
}) {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      onMouseEnter={() => canHover() && setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: "#FFFFFF",
        borderRadius: 16,
        border: `1px solid ${hovered ? "rgba(75,63,174,0.18)" : "rgba(14,26,43,0.06)"}`,
        padding: mobile ? "28px 24px" : "36px 32px",
        boxShadow: hovered
          ? "0 12px 32px rgba(75,63,174,0.10)"
          : "0 2px 8px rgba(14,26,43,0.04)",
        transition: "opacity 700ms ease, transform 700ms ease, box-shadow 260ms ease, border-color 260ms ease",
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(28px)",
        transitionDelay: `${delay}ms`,
      }}
    >
      {/* Step number pill */}
      <div
        style={{
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
          width: 36,
          height: 36,
          borderRadius: 10,
          background: "rgba(75,63,174,0.08)",
          marginBottom: 20,
        }}
      >
        <span
          style={{
            fontSize: 14,
            fontWeight: 700,
            color: B.purple,
            letterSpacing: "-0.02em",
          }}
        >
          {number}
        </span>
      </div>

      <h3
        style={{
          fontSize: mobile ? 18 : 20,
          fontWeight: 700,
          color: B.navy,
          letterSpacing: "-0.02em",
          marginBottom: 12,
          lineHeight: 1.3,
        }}
      >
        {title}
      </h3>

      <p
        style={{
          fontSize: mobile ? 14 : 15,
          color: B.muted,
          lineHeight: 1.75,
          marginBottom: bullets ? 16 : note ? 16 : 0,
        }}
      >
        {description}
      </p>

      {bullets && (
        <ul style={{ padding: 0, margin: 0, listStyle: "none" }}>
          {bullets.map((item) => (
            <li
              key={item}
              style={{
                fontSize: mobile ? 14 : 15,
                color: B.muted,
                lineHeight: 1.75,
                paddingLeft: 18,
                position: "relative",
              }}
            >
              <span
                style={{
                  position: "absolute",
                  left: 0,
                  top: 0,
                  color: B.purple,
                  fontSize: 11,
                  lineHeight: "26px",
                }}
              >
                ●
              </span>
              {item}
            </li>
          ))}
        </ul>
      )}

      {note && (
        <p
          style={{
            fontSize: mobile ? 13 : 14,
            color: "rgba(14,26,43,0.50)",
            lineHeight: 1.7,
            marginTop: bullets ? 16 : 0,
            fontStyle: "italic",
          }}
        >
          {note}
        </p>
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Classification Band                                                */
/* ------------------------------------------------------------------ */

function ClassificationBand({
  label,
  index,
  mobile,
  visible,
}: {
  label: string;
  index: number;
  mobile: boolean;
  visible: boolean;
}) {
  const [hovered, setHovered] = useState(false);
  const colors = [
    { bg: "rgba(220,38,38,0.06)", border: "rgba(220,38,38,0.14)", text: "#DC2626", dot: "#DC2626" },
    { bg: "rgba(245,158,11,0.06)", border: "rgba(245,158,11,0.14)", text: "#D97706", dot: "#F59E0B" },
    { bg: "rgba(75,63,174,0.06)", border: "rgba(75,63,174,0.14)", text: "#4B3FAE", dot: "#4B3FAE" },
    { bg: "rgba(31,109,122,0.06)", border: "rgba(31,109,122,0.14)", text: "#1F6D7A", dot: "#1F6D7A" },
  ];
  const c = colors[index];

  return (
    <div
      onMouseEnter={() => canHover() && setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display: "flex",
        alignItems: "center",
        gap: 14,
        padding: mobile ? "16px 20px" : "18px 24px",
        borderRadius: 12,
        background: hovered ? c.bg : "#FFFFFF",
        border: `1px solid ${hovered ? c.border : "rgba(14,26,43,0.06)"}`,
        transition: "opacity 600ms ease, transform 600ms ease, background 220ms ease, border-color 220ms ease",
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(20px)",
        transitionDelay: `${index * 100 + 100}ms`,
        cursor: "default",
      }}
    >
      <span
        style={{
          width: 10,
          height: 10,
          borderRadius: "50%",
          background: c.dot,
          flexShrink: 0,
        }}
      />
      <span
        style={{
          fontSize: mobile ? 15 : 16,
          fontWeight: 600,
          color: c.text,
          letterSpacing: "-0.01em",
        }}
      >
        {label}
      </span>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Page                                                               */
/* ------------------------------------------------------------------ */

export default function HowItWorksPage() {
  const mobile = useMobile();

  const heroAnim = useInView();
  const processAnim = useInView();
  const stepsAnim = useInView();
  const classAnim = useInView();
  const verifyAnim = useInView();
  const ctaAnim = useInView();

  return (
    <div style={{ background: "#FFFFFF" }}>
      {/* ============================================================ */}
      {/*  Section 1 — Hero / Page Introduction                        */}
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
          {/* Label */}
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
              How It Works
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
            RunPayway™ — How It Works
          </h1>

          <p
            style={{
              fontSize: mobile ? 16 : 18,
              color: "rgba(255,255,255,0.72)",
              lineHeight: 1.7,
              maxWidth: 680,
              margin: "0 auto 20px",
            }}
          >
            RunPayway™ evaluates the structural stability of an income system.
          </p>

          <p
            style={{
              fontSize: mobile ? 14 : 16,
              color: "rgba(255,255,255,0.55)",
              lineHeight: 1.75,
              maxWidth: 640,
              margin: "0 auto 32px",
            }}
          >
            The platform applies Structural Stability Model RP-1.0, a deterministic classification model designed to analyze how income is generated, how dependent it is on continued labor, and how durable the structure is under disruption.
          </p>

          <p
            style={{
              fontSize: mobile ? 14 : 16,
              color: "rgba(255,255,255,0.55)",
              lineHeight: 1.75,
              maxWidth: 560,
              margin: "0 auto 32px",
            }}
          >
            The system produces a single output metric:
          </p>

          {/* Score pill */}
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 10,
              padding: "12px 28px",
              borderRadius: 12,
              background: "rgba(255,255,255,0.06)",
              border: "1px solid rgba(255,255,255,0.10)",
            }}
          >
            <span style={{ fontSize: mobile ? 18 : 22, fontWeight: 700, color: "#FFFFFF", letterSpacing: "-0.02em" }}>
              Income Stability Score™
            </span>
            <span style={{ fontSize: mobile ? 14 : 16, color: "rgba(255,255,255,0.50)", fontWeight: 500 }}>
              (0–100)
            </span>
          </div>

          <p
            style={{
              fontSize: 14,
              color: "rgba(255,255,255,0.45)",
              marginTop: 16,
            }}
          >
            Higher scores indicate stronger structural income stability.
          </p>
        </div>
      </section>

      {/* ============================================================ */}
      {/*  Section 2 — Assessment Process                              */}
      {/* ============================================================ */}
      <section
        style={{
          paddingTop: mobile ? 64 : 96,
          paddingBottom: mobile ? 64 : 96,
          background: "#FFFFFF",
        }}
      >
        <div
          className="mx-auto"
          style={{
            maxWidth: 1060,
            paddingLeft: mobile ? 24 : 40,
            paddingRight: mobile ? 24 : 40,
          }}
        >
          {/* Section header */}
          <div
            ref={processAnim.ref}
            style={{
              textAlign: "center",
              marginBottom: mobile ? 48 : 64,
              opacity: processAnim.visible ? 1 : 0,
              transform: processAnim.visible ? "translateY(0)" : "translateY(24px)",
              transition: "opacity 700ms ease, transform 700ms ease",
            }}
          >
            <div
              style={{
                fontSize: 12,
                fontWeight: 600,
                color: B.purple,
                letterSpacing: "0.08em",
                textTransform: "uppercase",
                marginBottom: 14,
              }}
            >
              Assessment Process
            </div>
            <h2
              style={{
                fontSize: mobile ? 28 : 40,
                fontWeight: 700,
                color: B.navy,
                letterSpacing: "-0.03em",
                lineHeight: 1.15,
                marginBottom: 16,
              }}
            >
              How It Works
            </h2>
            <p
              style={{
                fontSize: mobile ? 15 : 17,
                color: B.muted,
                lineHeight: 1.7,
                maxWidth: 540,
                margin: "0 auto",
              }}
            >
              A structural diagnostic evaluating the stability of an income system.
            </p>
          </div>

          {/* Steps */}
          <div
            ref={stepsAnim.ref}
            style={{
              display: "grid",
              gridTemplateColumns: mobile ? "1fr" : "repeat(3, 1fr)",
              gap: mobile ? 20 : 28,
            }}
          >
            <StepCard
              number="01"
              title="Income Profile Intake"
              description="Six structured questions describe how your income is generated and how dependable it is. The assessment captures key characteristics of the income structure, including:"
              bullets={[
                "Income sources",
                "Reliance on active labor",
                "Persistence of income without continued work",
                "Diversification of income streams",
                "Structural protections against disruption",
              ]}
              note="The objective is to classify the architecture of the income system, not personal financial data."
              mobile={mobile}
              visible={stepsAnim.visible}
              delay={0}
            />
            <StepCard
              number="02"
              title="Structural Analysis"
              description="Structural Stability Model RP-1.0 evaluates the responses across six structural factors and calculates the Income Stability Score™ (0–100). The model applies deterministic scoring rules. Identical structural inputs will always produce the same score."
              note="No subjective interpretation or AI judgment is used in the scoring process."
              mobile={mobile}
              visible={stepsAnim.visible}
              delay={140}
            />
            <StepCard
              number="03"
              title="Score and Report Generation"
              description="Once the model completes its evaluation, the system generates:"
              bullets={[
                "Income Stability Score™",
                "Stability classification band",
                "Structured diagnostic report",
                "Verification identifier",
              ]}
              note="The report provides a formal record of the structural evaluation performed by the model."
              mobile={mobile}
              visible={stepsAnim.visible}
              delay={280}
            />
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/*  Section 3 — Stability Classification                       */}
      {/* ============================================================ */}
      <section
        style={{
          paddingTop: mobile ? 64 : 96,
          paddingBottom: mobile ? 64 : 96,
          background: B.sand,
        }}
      >
        <div
          ref={classAnim.ref}
          className="mx-auto"
          style={{
            maxWidth: 720,
            paddingLeft: mobile ? 24 : 40,
            paddingRight: mobile ? 24 : 40,
          }}
        >
          <div
            style={{
              textAlign: "center",
              marginBottom: mobile ? 36 : 48,
              opacity: classAnim.visible ? 1 : 0,
              transform: classAnim.visible ? "translateY(0)" : "translateY(24px)",
              transition: "opacity 700ms ease, transform 700ms ease",
            }}
          >
            <div
              style={{
                fontSize: 12,
                fontWeight: 600,
                color: B.purple,
                letterSpacing: "0.08em",
                textTransform: "uppercase",
                marginBottom: 14,
              }}
            >
              Classification System
            </div>
            <h2
              style={{
                fontSize: mobile ? 26 : 36,
                fontWeight: 700,
                color: B.navy,
                letterSpacing: "-0.03em",
                lineHeight: 1.2,
                marginBottom: 16,
              }}
            >
              Stability Classification
            </h2>
            <p
              style={{
                fontSize: mobile ? 14 : 16,
                color: B.muted,
                lineHeight: 1.75,
                maxWidth: 560,
                margin: "0 auto",
              }}
            >
              Every score is placed within a structural stability classification band. The classification provides context for how durable the income system is likely to be under economic disruption.
            </p>
          </div>

          {/* Bands */}
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {["Fragile Stability", "Early Stability", "Established Stability", "High Stability"].map((band, i) => (
              <ClassificationBand
                key={band}
                label={band}
                index={i}
                mobile={mobile}
                visible={classAnim.visible}
              />
            ))}
          </div>

          <p
            style={{
              fontSize: 14,
              color: "rgba(14,26,43,0.45)",
              lineHeight: 1.7,
              textAlign: "center",
              marginTop: 28,
              opacity: classAnim.visible ? 1 : 0,
              transition: "opacity 700ms ease",
              transitionDelay: "600ms",
            }}
          >
            These classifications describe the structural strength of the income system.
          </p>
        </div>
      </section>

      {/* ============================================================ */}
      {/*  Section 4 — Score Verification                              */}
      {/* ============================================================ */}
      <section
        style={{
          paddingTop: mobile ? 64 : 96,
          paddingBottom: mobile ? 64 : 96,
          background: "#FFFFFF",
        }}
      >
        <div
          ref={verifyAnim.ref}
          className="mx-auto"
          style={{
            maxWidth: 720,
            paddingLeft: mobile ? 24 : 40,
            paddingRight: mobile ? 24 : 40,
            textAlign: "center",
            opacity: verifyAnim.visible ? 1 : 0,
            transform: verifyAnim.visible ? "translateY(0)" : "translateY(24px)",
            transition: "opacity 700ms ease, transform 700ms ease",
          }}
        >
          <div
            style={{
              fontSize: 12,
              fontWeight: 600,
              color: B.purple,
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              marginBottom: 14,
            }}
          >
            Verification
          </div>
          <h2
            style={{
              fontSize: mobile ? 26 : 36,
              fontWeight: 700,
              color: B.navy,
              letterSpacing: "-0.03em",
              lineHeight: 1.2,
              marginBottom: 20,
            }}
          >
            Score Verification
          </h2>

          <div
            style={{
              maxWidth: 560,
              margin: "0 auto",
              display: "flex",
              flexDirection: "column",
              gap: 16,
            }}
          >
            <p style={{ fontSize: mobile ? 14 : 16, color: B.muted, lineHeight: 1.75 }}>
              Each completed assessment receives a unique verification identifier.
            </p>
            <p style={{ fontSize: mobile ? 14 : 16, color: B.muted, lineHeight: 1.75 }}>
              This identifier allows third parties to confirm that a score was generated using the official RunPayway™ model.
            </p>
            <p style={{ fontSize: mobile ? 14 : 16, color: B.muted, lineHeight: 1.75 }}>
              Verification can be performed through the{" "}
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
              page.
            </p>
            <p style={{ fontSize: mobile ? 14 : 16, color: B.muted, lineHeight: 1.75 }}>
              The verification system helps maintain the integrity of the Income Stability Score™.
            </p>
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/*  Section 5 — Run an Assessment (CTA)                        */}
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
          ref={ctaAnim.ref}
          className="mx-auto"
          style={{
            position: "relative",
            zIndex: 1,
            maxWidth: 680,
            paddingLeft: mobile ? 24 : 40,
            paddingRight: mobile ? 24 : 40,
            textAlign: "center",
            opacity: ctaAnim.visible ? 1 : 0,
            transform: ctaAnim.visible ? "translateY(0)" : "translateY(24px)",
            transition: "opacity 700ms ease, transform 700ms ease",
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
            Run an Assessment
          </h2>

          <p
            style={{
              fontSize: mobile ? 14 : 16,
              color: "rgba(255,255,255,0.60)",
              lineHeight: 1.75,
              maxWidth: 520,
              margin: "0 auto 12px",
            }}
          >
            The RunPayway™ assessment can be completed in a few minutes. After submitting the structural inputs, the model calculates the Income Stability Score™ instantly and generates a structured diagnostic report.
          </p>

          <p
            style={{
              fontSize: mobile ? 14 : 16,
              color: "rgba(255,255,255,0.50)",
              lineHeight: 1.75,
              maxWidth: 520,
              margin: "0 auto 36px",
            }}
          >
            The report provides a clear analytical view of the stability characteristics of an income system.
          </p>

          {/* CTA button */}
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

          {/* Footer reference */}
          <p
            style={{
              fontSize: 12,
              color: "rgba(255,255,255,0.30)",
              marginTop: 32,
              letterSpacing: "0.02em",
            }}
          >
            Powered by Structural Stability Model RP-1.0
          </p>
        </div>
      </section>
    </div>
  );
}
