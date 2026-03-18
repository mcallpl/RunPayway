"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useLanguage } from "@/lib/i18n";

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
  const { t } = useLanguage();

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
              {t.howItWorks.heroLabel}
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
            {t.howItWorks.heroTitle}
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
            {t.howItWorks.heroDesc1}
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
            {t.howItWorks.heroDesc2}
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
            {t.howItWorks.heroDesc3}
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
              {t.howItWorks.scoreLabel}
            </span>
            <span style={{ fontSize: mobile ? 14 : 16, color: "rgba(255,255,255,0.50)", fontWeight: 500 }}>
              {t.howItWorks.scoreRange}
            </span>
          </div>

          <p
            style={{
              fontSize: 14,
              color: "rgba(255,255,255,0.45)",
              marginTop: 16,
            }}
          >
            {t.howItWorks.heroFooter}
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
              {t.howItWorks.processTag}
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
              {t.howItWorks.processTitle}
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
              {t.howItWorks.processSubtitle}
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
              title={t.howItWorks.step1Title}
              description={t.howItWorks.step1Desc}
              bullets={[
                t.howItWorks.step1Bullet1,
                t.howItWorks.step1Bullet2,
                t.howItWorks.step1Bullet3,
                t.howItWorks.step1Bullet4,
                t.howItWorks.step1Bullet5,
                t.howItWorks.step1Bullet6,
              ]}
              note={t.howItWorks.step1Note}
              mobile={mobile}
              visible={stepsAnim.visible}
              delay={0}
            />
            <StepCard
              number="02"
              title={t.howItWorks.step2Title}
              description={t.howItWorks.step2Desc}
              note={t.howItWorks.step2Note}
              mobile={mobile}
              visible={stepsAnim.visible}
              delay={140}
            />
            <StepCard
              number="03"
              title={t.howItWorks.step3Title}
              description={t.howItWorks.step3Desc}
              bullets={[
                t.howItWorks.step3Bullet1,
                t.howItWorks.step3Bullet2,
                t.howItWorks.step3Bullet3,
                t.howItWorks.step3Bullet4,
              ]}
              note={t.howItWorks.step3Note}
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
              {t.howItWorks.classTag}
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
              {t.howItWorks.classTitle}
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
              {t.howItWorks.classDesc}
            </p>
          </div>

          {/* Bands */}
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {[t.howItWorks.bandLimited, t.howItWorks.bandDeveloping, t.howItWorks.bandEstablished, t.howItWorks.bandHigh].map((band, i) => (
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
            {t.howItWorks.classFooter}
          </p>
        </div>
      </section>

      {/* ============================================================ */}
      {/*  Section 4 — What You Receive                                */}
      {/* ============================================================ */}
      {(() => {
        const deliverAnim = useInView();
        return (
          <section
            style={{
              paddingTop: mobile ? 64 : 96,
              paddingBottom: mobile ? 64 : 96,
              background: "#FFFFFF",
            }}
          >
            <div
              ref={deliverAnim.ref}
              className="mx-auto"
              style={{
                maxWidth: 1060,
                paddingLeft: mobile ? 24 : 40,
                paddingRight: mobile ? 24 : 40,
              }}
            >
              {/* Section header */}
              <div
                style={{
                  textAlign: "center",
                  marginBottom: mobile ? 48 : 64,
                  opacity: deliverAnim.visible ? 1 : 0,
                  transform: deliverAnim.visible ? "translateY(0)" : "translateY(24px)",
                  transition: "opacity 700ms ease, transform 700ms ease",
                }}
              >
                <div style={{ fontSize: 12, fontWeight: 600, color: B.purple, letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 14 }}>
                  {t.howItWorks.deliverTag}
                </div>
                <h2 style={{ fontSize: mobile ? 28 : 40, fontWeight: 700, color: B.navy, letterSpacing: "-0.03em", lineHeight: 1.15, marginBottom: 16 }}>
                  {t.howItWorks.deliverTitle}
                </h2>
                <p style={{ fontSize: mobile ? 15 : 17, color: B.muted, lineHeight: 1.7, maxWidth: 600, margin: "0 auto" }}>
                  {t.howItWorks.deliverSubtitle}
                </p>
              </div>

              {/* Feature grid */}
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: mobile ? "1fr" : "repeat(3, 1fr)",
                  gap: mobile ? 20 : 24,
                }}
              >
                {[
                  { title: t.howItWorks.deliverItem1Title, desc: t.howItWorks.deliverItem1Desc, color: B.teal },
                  { title: t.howItWorks.deliverItem2Title, desc: t.howItWorks.deliverItem2Desc, color: "#DC2626" },
                  { title: t.howItWorks.deliverItem3Title, desc: t.howItWorks.deliverItem3Desc, color: B.purple },
                  { title: t.howItWorks.deliverItem4Title, desc: t.howItWorks.deliverItem4Desc, color: B.navy },
                  { title: t.howItWorks.deliverItem5Title, desc: t.howItWorks.deliverItem5Desc, color: B.teal },
                  { title: t.howItWorks.deliverItem6Title, desc: t.howItWorks.deliverItem6Desc, color: B.purple },
                ].map((item, i) => (
                  <div
                    key={item.title}
                    style={{
                      background: "#FFFFFF",
                      borderRadius: 16,
                      border: "1px solid rgba(14,26,43,0.06)",
                      padding: mobile ? "24px 20px" : "28px 24px",
                      boxShadow: "0 2px 8px rgba(14,26,43,0.04)",
                      opacity: deliverAnim.visible ? 1 : 0,
                      transform: deliverAnim.visible ? "translateY(0)" : "translateY(20px)",
                      transition: "opacity 600ms ease, transform 600ms ease",
                      transitionDelay: `${i * 80 + 100}ms`,
                    }}
                  >
                    <div style={{ width: 8, height: 8, borderRadius: "50%", backgroundColor: item.color, marginBottom: 16 }} />
                    <h3 style={{ fontSize: mobile ? 16 : 18, fontWeight: 700, color: B.navy, letterSpacing: "-0.02em", marginBottom: 10, lineHeight: 1.3 }}>
                      {item.title}
                    </h3>
                    <p style={{ fontSize: mobile ? 14 : 15, color: B.muted, lineHeight: 1.75, margin: 0 }}>
                      {item.desc}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </section>
        );
      })()}

      {/* ============================================================ */}
      {/*  Section 5 — Score Verification                              */}
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
            {t.howItWorks.verifyTag}
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
            {t.howItWorks.verifyTitle}
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
              {t.howItWorks.verifyDesc1}
            </p>
            <p style={{ fontSize: mobile ? 14 : 16, color: B.muted, lineHeight: 1.75 }}>
              {t.howItWorks.verifyDesc2}
            </p>
            <p style={{ fontSize: mobile ? 14 : 16, color: B.muted, lineHeight: 1.75 }}>
              {t.howItWorks.verifyDesc3pre}{" "}
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
                {t.howItWorks.verifyLinkText}
              </Link>{" "}
              {t.howItWorks.verifyDesc3post}
            </p>
            <p style={{ fontSize: mobile ? 14 : 16, color: B.muted, lineHeight: 1.75 }}>
              {t.howItWorks.verifyDesc4}
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
            {t.howItWorks.ctaTitle}
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
            {t.howItWorks.ctaDesc1}
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
            {t.howItWorks.ctaDesc2}
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
            <span className="cta-label">{t.howItWorks.ctaButton}</span>
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
            {t.howItWorks.poweredBy}
          </p>
        </div>
      </section>
    </div>
  );
}
