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
/*  Pricing card                                                       */
/* ------------------------------------------------------------------ */

function PricingCard({
  recommended,
  title,
  price,
  perUnit,
  description,
  ctaLabel,
  ctaHref,
  mobile,
  visible,
  delay,
}: {
  recommended?: boolean;
  title: string;
  price: string;
  perUnit?: string;
  description: string;
  ctaLabel: string;
  ctaHref: string;
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
        position: "relative",
        background: "#FFFFFF",
        borderRadius: 20,
        border: `1px solid ${recommended ? "rgba(75,63,174,0.25)" : "rgba(14,26,43,0.06)"}`,
        padding: mobile ? "32px 28px" : "40px 36px",
        boxShadow: hovered
          ? recommended
            ? "0 20px 48px rgba(75,63,174,0.14)"
            : "0 12px 32px rgba(14,26,43,0.08)"
          : recommended
            ? "0 8px 24px rgba(75,63,174,0.08)"
            : "0 2px 8px rgba(14,26,43,0.04)",
        transition: "opacity 700ms ease, transform 700ms ease, box-shadow 260ms ease",
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(28px)",
        transitionDelay: `${delay}ms`,
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* Recommended badge */}
      {recommended && (
        <div
          style={{
            position: "absolute",
            top: -14,
            left: "50%",
            transform: "translateX(-50%)",
            padding: "5px 18px",
            borderRadius: 100,
            background: B.purple,
            color: "#FFFFFF",
            fontSize: 11,
            fontWeight: 700,
            letterSpacing: "0.06em",
            textTransform: "uppercase",
            whiteSpace: "nowrap",
          }}
        >
          Recommended
        </div>
      )}

      <div style={{ fontSize: mobile ? 17 : 19, fontWeight: 700, color: B.navy, marginBottom: 16 }}>
        {title}
      </div>

      <div style={{ display: "flex", alignItems: "baseline", gap: 4, marginBottom: 4 }}>
        <span style={{ fontSize: mobile ? 44 : 52, fontWeight: 700, color: B.navy, lineHeight: 1, letterSpacing: "-0.03em" }}>
          {price}
        </span>
      </div>

      {perUnit && (
        <div style={{ fontSize: 14, fontWeight: 600, color: B.purple, marginBottom: 8 }}>
          {perUnit}
        </div>
      )}

      <p style={{ fontSize: 15, color: B.muted, lineHeight: 1.7, marginBottom: 28, flex: 1 }}>
        {description}
      </p>

      <div style={{ fontSize: 12, color: B.light, marginBottom: 16 }}>
        Secure checkout via Stripe
      </div>

      <a
        href={ctaHref}
        className="cta-tick inline-flex items-center justify-center font-semibold"
        style={{
          width: "100%",
          height: 52,
          borderRadius: 12,
          background: recommended ? B.purple : B.navy,
          color: "#FFFFFF",
          fontSize: 15,
          letterSpacing: "-0.01em",
          border: "none",
          textDecoration: "none",
          boxShadow: recommended
            ? "0 6px 16px rgba(75,63,174,0.25)"
            : "0 4px 12px rgba(14,26,43,0.15)",
          transition: "background 180ms ease, transform 180ms ease",
        }}
        onMouseEnter={(e) => {
          if (!canHover()) return;
          e.currentTarget.style.background = recommended ? "#3D33A0" : "#1a2a40";
          e.currentTarget.style.transform = "translateY(-1px)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = recommended ? B.purple : B.navy;
          e.currentTarget.style.transform = "translateY(0)";
        }}
      >
        <span className="tick tick-white" />
        <span className="cta-label">{ctaLabel}</span>
        <span className="cta-arrow cta-arrow-white" />
      </a>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Page                                                               */
/* ------------------------------------------------------------------ */

export default function PricingPage() {
  const mobile = useMobile();

  const heroAnim = useInView();
  const cardsAnim = useInView();
  const monitorAnim = useInView();
  const includesAnim = useInView();
  const processAnim = useInView();
  const ctaAnim = useInView();

  return (
    <div style={{ background: "#FFFFFF" }}>
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
              Income Stability Assessment
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
            Measure Your Income Stability
          </h1>

          <p
            style={{
              fontSize: mobile ? 15 : 18,
              color: "rgba(255,255,255,0.65)",
              lineHeight: 1.7,
              maxWidth: 560,
              margin: "0 auto 8px",
            }}
          >
            RunPayway™ provides structured income stability diagnostics using the Income Stability Score™.
          </p>

          <p
            style={{
              fontSize: 14,
              color: "rgba(255,255,255,0.40)",
            }}
          >
            Model RP-1.0 | Version 1.0
          </p>
        </div>
      </section>

      {/* ============================================================ */}
      {/*  Pricing cards                                               */}
      {/* ============================================================ */}
      <section
        style={{
          paddingTop: mobile ? 56 : 80,
          paddingBottom: mobile ? 40 : 56,
          background: B.sand,
        }}
      >
        <div
          ref={cardsAnim.ref}
          className="mx-auto"
          style={{
            maxWidth: 860,
            paddingLeft: mobile ? 24 : 40,
            paddingRight: mobile ? 24 : 40,
          }}
        >
          <div
            style={{
              display: "grid",
              gridTemplateColumns: mobile ? "1fr" : "1fr 1fr",
              gap: mobile ? 32 : 28,
              alignItems: "start",
            }}
          >
            <PricingCard
              title="Single Assessment"
              price="$39"
              description="One structural measurement of your income system. Receive your Income Stability Score™ and full diagnostic report instantly."
              ctaLabel="Get Assessment"
              ctaHref="https://buy.stripe.com/5kQ00b20w7MI3pg2Ax2Nq01"
              mobile={mobile}
              visible={cardsAnim.visible}
              delay={0}
            />
            <PricingCard
              recommended
              title="Annual Monitoring"
              price="$99"
              perUnit="$33 per assessment"
              description="Three assessments you can take at any time within one year. Track how your income structure evolves over time."
              ctaLabel="Start Monitoring"
              ctaHref="https://buy.stripe.com/bJecMX20wd726Bsgrn2Nq00"
              mobile={mobile}
              visible={cardsAnim.visible}
              delay={140}
            />
          </div>

          {/* Trust line */}
          <div style={{ textAlign: "center", marginTop: 28 }}>
            <p style={{ fontSize: 13, color: B.light }}>
              Secure checkout powered by Stripe · Encrypted payment processing
            </p>
            <p style={{ fontSize: 13, color: B.light, marginTop: 8, maxWidth: 480, lineHeight: 1.6 }}>
              Every assessment is backed by a deterministic scoring model. Identical inputs always produce identical results. Your score reflects your income structure exactly as reported.
            </p>
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/*  Monitoring timeline                                         */}
      {/* ============================================================ */}
      <section
        style={{
          paddingTop: mobile ? 56 : 80,
          paddingBottom: mobile ? 56 : 80,
          background: "#FFFFFF",
        }}
      >
        <div
          ref={monitorAnim.ref}
          className="mx-auto"
          style={{
            maxWidth: 780,
            paddingLeft: mobile ? 24 : 40,
            paddingRight: mobile ? 24 : 40,
            opacity: monitorAnim.visible ? 1 : 0,
            transform: monitorAnim.visible ? "translateY(0)" : "translateY(24px)",
            transition: "opacity 700ms ease, transform 700ms ease",
          }}
        >
          <div style={{ fontSize: 12, fontWeight: 600, color: B.purple, letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 14 }}>
            Annual Plan
          </div>
          <h2 style={{ fontSize: mobile ? 24 : 32, fontWeight: 700, color: B.navy, letterSpacing: "-0.02em", marginBottom: 12 }}>
            Income Stability Monitoring
          </h2>
          <p style={{ fontSize: mobile ? 15 : 16, color: B.muted, lineHeight: 1.75, marginBottom: 32, maxWidth: 560 }}>
            Annual monitoring measures how your income structure evolves over time. Take your three assessments at any time within one year.
          </p>

          {/* Timeline */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              padding: mobile ? "24px 20px" : "28px 36px",
              borderRadius: 16,
              background: B.sand,
              border: "1px solid rgba(14,26,43,0.06)",
              flexWrap: "wrap",
              gap: mobile ? 20 : 12,
            }}
          >
            {[
              ["Assessment 1", "Any time"],
              ["Assessment 2", "Any time"],
              ["Assessment 3", "Any time"],
            ].map(([label, timing], i) => (
              <div key={label} style={{ display: "flex", alignItems: "center", gap: mobile ? 16 : 24 }}>
                <div style={{ textAlign: "center" }}>
                  <div style={{ width: 40, height: 40, borderRadius: 10, background: i === 0 ? B.navy : "rgba(14,26,43,0.06)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 8px" }}>
                    <span style={{ fontSize: 14, fontWeight: 700, color: i === 0 ? "#FFFFFF" : B.navy }}>{i + 1}</span>
                  </div>
                  <div style={{ fontSize: 13, fontWeight: 600, color: B.navy }}>{label}</div>
                  <div style={{ fontSize: 11, color: B.light }}>{timing}</div>
                </div>
                {i < 2 && !mobile && (
                  <div style={{ width: 40, height: 1, background: "rgba(14,26,43,0.12)" }} />
                )}
              </div>
            ))}
          </div>

          <p style={{ fontSize: 13, color: B.light, marginTop: 16 }}>
            All three assessments must be used within 12 months of purchase. Each measures the structural stability of income at the time it is issued.
          </p>
        </div>
      </section>

      {/* ============================================================ */}
      {/*  What every assessment includes                              */}
      {/* ============================================================ */}
      <section
        style={{
          paddingTop: mobile ? 56 : 80,
          paddingBottom: mobile ? 56 : 80,
          background: B.sand,
        }}
      >
        <div
          ref={includesAnim.ref}
          className="mx-auto"
          style={{
            maxWidth: 780,
            paddingLeft: mobile ? 24 : 40,
            paddingRight: mobile ? 24 : 40,
            opacity: includesAnim.visible ? 1 : 0,
            transform: includesAnim.visible ? "translateY(0)" : "translateY(24px)",
            transition: "opacity 700ms ease, transform 700ms ease",
          }}
        >
          <h2 style={{ fontSize: mobile ? 24 : 32, fontWeight: 700, color: B.navy, letterSpacing: "-0.02em", marginBottom: 24 }}>
            What Every Assessment Includes
          </h2>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: mobile ? "1fr" : "1fr 1fr",
              gap: 12,
              marginBottom: 20,
            }}
          >
            {[
              "Income Stability Score\u2122 (0\u2013100)",
              "Stability Classification",
              "Structural Drivers",
              "Structural Constraints",
              "Industry Percentile Comparison",
              "Structural Improvement Path",
              "Official PDF Assessment Record",
            ].map((item) => (
              <div
                key={item}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 12,
                  padding: "12px 16px",
                  borderRadius: 10,
                  background: "#FFFFFF",
                  border: "1px solid rgba(14,26,43,0.06)",
                }}
              >
                <span style={{ width: 6, height: 6, borderRadius: "50%", background: B.teal, flexShrink: 0 }} />
                <span style={{ fontSize: 14, fontWeight: 500, color: B.navy }}>{item}</span>
              </div>
            ))}
          </div>

          <p style={{ fontSize: 13, color: B.light }}>
            Assessments are generated using fixed scoring criteria under Model RP-1.0.
          </p>
        </div>
      </section>

      {/* ============================================================ */}
      {/*  How the process works                                       */}
      {/* ============================================================ */}
      <section
        style={{
          paddingTop: mobile ? 56 : 80,
          paddingBottom: mobile ? 56 : 80,
          background: "#FFFFFF",
        }}
      >
        <div
          ref={processAnim.ref}
          className="mx-auto"
          style={{
            maxWidth: 780,
            paddingLeft: mobile ? 24 : 40,
            paddingRight: mobile ? 24 : 40,
            opacity: processAnim.visible ? 1 : 0,
            transform: processAnim.visible ? "translateY(0)" : "translateY(24px)",
            transition: "opacity 700ms ease, transform 700ms ease",
          }}
        >
          <h2 style={{ fontSize: mobile ? 24 : 32, fontWeight: 700, color: B.navy, letterSpacing: "-0.02em", marginBottom: 32 }}>
            How the Process Works
          </h2>

          <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
            {[
              { step: "Select your assessment option." },
              { step: "You will be redirected to ", bold: "Stripe Secure Checkout", after: "." },
              { step: "After successful payment, Single Assessment customers are directed to the diagnostic. Annual Monitoring subscribers are directed to the ", bold: "Monitoring Portal Sign In", after: "." },
              { step: "Complete the ", bold: "Income Stability Assessment", after: "." },
              { step: "Your ", bold: "Income Stability Score\u2122 report", after: " will be generated and issued as an ", bold2: "Official PDF Assessment Record", after2: "." },
            ].map((item, i) => (
              <div
                key={i}
                style={{
                  display: "flex",
                  gap: 20,
                  padding: "20px 0",
                  borderBottom: i < 4 ? "1px solid rgba(14,26,43,0.06)" : "none",
                }}
              >
                <div
                  style={{
                    width: 36,
                    height: 36,
                    borderRadius: 10,
                    background: "rgba(75,63,174,0.08)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                  }}
                >
                  <span style={{ fontSize: 14, fontWeight: 700, color: B.purple }}>{i + 1}</span>
                </div>
                <p style={{ fontSize: 15, color: B.muted, lineHeight: 1.75, paddingTop: 6 }}>
                  {item.step}
                  {item.bold && <strong style={{ color: B.navy }}>{item.bold}</strong>}
                  {item.after}
                  {item.bold2 && <strong style={{ color: B.navy }}>{item.bold2}</strong>}
                  {item.after2}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/*  Final CTA                                                   */}
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
          <h2 style={{ fontSize: mobile ? 26 : 38, fontWeight: 700, color: "#FFFFFF", letterSpacing: "-0.03em", lineHeight: 1.2, marginBottom: 20 }}>
            Choose Your Assessment
          </h2>

          <p style={{ fontSize: mobile ? 14 : 16, color: "rgba(255,255,255,0.60)", lineHeight: 1.75, maxWidth: 520, margin: "0 auto 36px" }}>
            Choose how you would like to measure the structural stability of your income system.
          </p>

          {/* Two CTA buttons */}
          <div style={{ display: "flex", flexDirection: mobile ? "column" : "row", gap: 16, justifyContent: "center" }}>
            <a
              href="https://buy.stripe.com/5kQ00b20w7MI3pg2Ax2Nq01"
              className="inline-flex items-center justify-center font-semibold"
              style={{
                height: 52,
                paddingLeft: 28,
                paddingRight: 28,
                borderRadius: 14,
                background: "rgba(255,255,255,0.12)",
                color: "#FFFFFF",
                fontSize: 15,
                letterSpacing: "-0.01em",
                border: "1px solid rgba(255,255,255,0.18)",
                textDecoration: "none",
                transition: "background 180ms ease, transform 180ms ease",
                width: mobile ? "100%" : "auto",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "rgba(255,255,255,0.18)";
                e.currentTarget.style.transform = "translateY(-1px)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "rgba(255,255,255,0.12)";
                e.currentTarget.style.transform = "translateY(0)";
              }}
            >
              Single Assessment — $39
            </a>
            <a
              href="https://buy.stripe.com/bJecMX20wd726Bsgrn2Nq00"
              className="inline-flex items-center justify-center font-semibold"
              style={{
                height: 52,
                paddingLeft: 28,
                paddingRight: 28,
                borderRadius: 14,
                background: "#FFFFFF",
                color: B.navy,
                fontSize: 15,
                letterSpacing: "-0.01em",
                border: "none",
                textDecoration: "none",
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
              Annual Monitoring — $99
            </a>
          </div>

          {/* Methodology statement */}
          <div style={{ marginTop: 48, maxWidth: 520, margin: "48px auto 0" }}>
            <p style={{ fontSize: 12, color: "rgba(255,255,255,0.40)", lineHeight: 1.7, marginBottom: 8 }}>
              Income Stability assessments are generated using fixed scoring criteria defined under Model RP-1.0.
            </p>
            <p style={{ fontSize: 11, color: "rgba(255,255,255,0.28)", lineHeight: 1.7, marginBottom: 8 }}>
              The Income Stability Score™ is a structural income assessment based on information provided by the user. It does not provide financial advice and does not predict future financial outcomes.
            </p>
            <p style={{ fontSize: 11, color: "rgba(255,255,255,0.35)", lineHeight: 1.7 }}>
              Your score reflects the structural characteristics of your income system exactly as reported.
            </p>
          </div>

          <p style={{ fontSize: 12, color: "rgba(255,255,255,0.30)", marginTop: 28, letterSpacing: "0.02em" }}>
            Powered by Structural Stability Model RP-1.0
          </p>
        </div>
      </section>
    </div>
  );
}
