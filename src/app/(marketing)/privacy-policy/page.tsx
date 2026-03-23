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

function Section({
  number,
  title,
  children,
  mobile,
  visible,
}: {
  number?: string;
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
        {number && <span style={{ color: B.purple, marginRight: 8 }}>{number}</span>}
        {title}
      </h2>
      {children}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Text helpers                                                       */
/* ------------------------------------------------------------------ */

function P({ children, style }: { children: React.ReactNode; style?: React.CSSProperties }) {
  return (
    <p style={{ fontSize: 15, color: B.muted, lineHeight: 1.75, marginBottom: 12, ...style }}>
      {children}
    </p>
  );
}

function Bullet({ items }: { items: string[] }) {
  return (
    <ul style={{ padding: 0, margin: "0 0 12px", listStyle: "none" }}>
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

function SubHead({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ fontSize: 14, fontWeight: 700, color: B.navy, marginBottom: 10, marginTop: 16 }}>
      {children}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Page                                                               */
/* ------------------------------------------------------------------ */

export default function PrivacyPolicyPage() {
  const mobile = useMobile();
  const { t } = useLanguage();
  const heroAnim = useInView();

  // Create refs for each section
  const sectionRefs = Array.from({ length: 15 }, () => useInView());

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
              {t.privacyPolicy.heroTag}
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
            {t.privacyPolicy.heroTitle}
          </h1>

          <p style={{ fontSize: mobile ? 15 : 17, color: "rgba(255,255,255,0.60)", lineHeight: 1.7, marginBottom: 8 }}>
            {t.privacyPolicy.heroSubtitle}
          </p>
          <p style={{ fontSize: 14, color: "rgba(255,255,255,0.40)" }}>
            {t.privacyPolicy.heroModel}
          </p>
        </div>
      </section>

      {/* ============================================================ */}
      {/*  Content                                                     */}
      {/* ============================================================ */}
      <section style={{ paddingTop: mobile ? 48 : 72, paddingBottom: mobile ? 64 : 96 }}>
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
          {/* Effective date + entity info */}
          <div ref={sectionRefs[0].ref}>
            <Section title={t.privacyPolicy.s0Title} mobile={mobile} visible={sectionRefs[0].visible}>
              <P>{t.privacyPolicy.s0EffectiveDate}</P>
              <P style={{ fontWeight: 600, color: B.navy, marginBottom: 4 }}>{t.privacyPolicy.s0Operator}</P>
              <P>{t.privacyPolicy.s0Address.split("\n").map((line: string, i: number) => (<span key={i}>{line}{i < 2 && <br />}</span>))}</P>
              <P>{t.privacyPolicy.s0Controller}</P>
              <P style={{ marginBottom: 0 }}>
                {t.privacyPolicy.s0InquiriesPre}
                <Link
                  href="/privacy-request"
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
                  {t.privacyPolicy.s0LinkText}
                </Link>.
              </P>
            </Section>
          </div>

          {/* 1. Overview */}
          <div ref={sectionRefs[1].ref}>
            <Section number="1." title={t.privacyPolicy.s1Title} mobile={mobile} visible={sectionRefs[1].visible}>
              <P>{t.privacyPolicy.s1P1}</P>
              <P>{t.privacyPolicy.s1P2}</P>
              <Bullet items={[
                t.privacyPolicy.s1Li1,
                t.privacyPolicy.s1Li2,
                t.privacyPolicy.s1Li3,
                t.privacyPolicy.s1Li4,
                t.privacyPolicy.s1Li5,
                t.privacyPolicy.s1Li6,
              ]} />
              <P style={{ marginBottom: 0 }}>{t.privacyPolicy.s1P3}</P>
            </Section>
          </div>

          {/* 2. Information Collected */}
          <div ref={sectionRefs[2].ref}>
            <Section number="2." title={t.privacyPolicy.s2Title} mobile={mobile} visible={sectionRefs[2].visible}>
              <SubHead>{t.privacyPolicy.s2SubA}</SubHead>
              <P>{t.privacyPolicy.s2P1}</P>
              <Bullet items={[
                t.privacyPolicy.s2Li1,
                t.privacyPolicy.s2Li2,
                t.privacyPolicy.s2Li3,
                t.privacyPolicy.s2Li4,
                t.privacyPolicy.s2Li5,
                t.privacyPolicy.s2Li6,
              ]} />
              <P>{t.privacyPolicy.s2P2}</P>

              <SubHead>{t.privacyPolicy.s2SubB}</SubHead>
              <P>{t.privacyPolicy.s2P3}</P>
              <Bullet items={[
                t.privacyPolicy.s2Li7,
                t.privacyPolicy.s2Li8,
                t.privacyPolicy.s2Li9,
                t.privacyPolicy.s2Li10,
                t.privacyPolicy.s2Li11,
                t.privacyPolicy.s2Li12,
                t.privacyPolicy.s2Li13,
              ]} />
              <P>{t.privacyPolicy.s2P4}</P>

              <SubHead>{t.privacyPolicy.s2SubC}</SubHead>
              <P>{t.privacyPolicy.s2P5}</P>
              <P>{t.privacyPolicy.s2P6}</P>
              <P style={{ marginBottom: 0 }}>{t.privacyPolicy.s2P7}</P>
            </Section>
          </div>

          {/* 3. Purpose of Processing */}
          <div ref={sectionRefs[3].ref}>
            <Section number="3." title={t.privacyPolicy.s3Title} mobile={mobile} visible={sectionRefs[3].visible}>
              <P>{t.privacyPolicy.s3P1}</P>
              <Bullet items={[
                t.privacyPolicy.s3Li1,
                t.privacyPolicy.s3Li2,
                t.privacyPolicy.s3Li3,
                t.privacyPolicy.s3Li4,
                t.privacyPolicy.s3Li5,
                t.privacyPolicy.s3Li6,
                t.privacyPolicy.s3Li7,
                t.privacyPolicy.s3Li8,
                t.privacyPolicy.s3Li9,
                t.privacyPolicy.s3Li10,
              ].filter(Boolean)} />
              <P style={{ marginBottom: 0 }}>{t.privacyPolicy.s3P2}</P>
            </Section>
          </div>

          {/* 4. Service Providers */}
          <div ref={sectionRefs[4].ref}>
            <Section number="4." title={t.privacyPolicy.s4Title} mobile={mobile} visible={sectionRefs[4].visible}>
              <P>{t.privacyPolicy.s4P1}</P>
              <Bullet items={[
                t.privacyPolicy.s4Li1,
                t.privacyPolicy.s4Li2,
                t.privacyPolicy.s4Li3,
                t.privacyPolicy.s4Li4,
              ]} />
              <P style={{ marginBottom: 0 }}>{t.privacyPolicy.s4P2}</P>
            </Section>
          </div>

          {/* 5. Consent-Based Contact */}
          <div ref={sectionRefs[5].ref}>
            <Section number="5." title={t.privacyPolicy.s5Title} mobile={mobile} visible={sectionRefs[5].visible}>
              <P>{t.privacyPolicy.s5P1}</P>
              <P>{t.privacyPolicy.s5P2}</P>
              <Bullet items={[
                t.privacyPolicy.s5Li1,
                t.privacyPolicy.s5Li2,
                t.privacyPolicy.s5Li3,
                t.privacyPolicy.s5Li4,
              ]} />
              <P>{t.privacyPolicy.s5P3}</P>
              <P>{t.privacyPolicy.s5P4}</P>
              <P style={{ marginBottom: 0 }}>{t.privacyPolicy.s5P5}</P>
            </Section>
          </div>

          {/* 6. Data Retention */}
          <div ref={sectionRefs[6].ref}>
            <Section number="6." title={t.privacyPolicy.s6Title} mobile={mobile} visible={sectionRefs[6].visible}>
              <P>{t.privacyPolicy.s6P1}</P>
              <P>{t.privacyPolicy.s6P2}</P>
              <P>{t.privacyPolicy.s6P3}</P>
              <P style={{ marginBottom: 0 }}>{t.privacyPolicy.s6P4}</P>
            </Section>
          </div>

          {/* 7. Data Security */}
          <div ref={sectionRefs[7].ref}>
            <Section number="7." title={t.privacyPolicy.s7Title} mobile={mobile} visible={sectionRefs[7].visible}>
              <P>{t.privacyPolicy.s7P1}</P>
              <P style={{ marginBottom: 0 }}>{t.privacyPolicy.s7P2}</P>
            </Section>
          </div>

          {/* 8. Public Registry */}
          <div ref={sectionRefs[8].ref}>
            <Section number="8." title={t.privacyPolicy.s8Title} mobile={mobile} visible={sectionRefs[8].visible}>
              <P>{t.privacyPolicy.s8P1}</P>
              <P>{t.privacyPolicy.s8P2}</P>
              <Bullet items={[
                t.privacyPolicy.s8Li1,
                t.privacyPolicy.s8Li2,
                t.privacyPolicy.s8Li3,
                t.privacyPolicy.s8Li4,
                t.privacyPolicy.s8Li5,
              ]} />
              <P>{t.privacyPolicy.s8P3}</P>
              <Bullet items={[
                t.privacyPolicy.s8Li6,
                t.privacyPolicy.s8Li7,
                t.privacyPolicy.s8Li8,
              ]} />
            </Section>
          </div>

          {/* 9. Privacy Rights */}
          <div ref={sectionRefs[9].ref}>
            <Section number="9." title={t.privacyPolicy.s9Title} mobile={mobile} visible={sectionRefs[9].visible}>
              <P>{t.privacyPolicy.s9P1}</P>
              <Bullet items={[
                t.privacyPolicy.s9Li1,
                t.privacyPolicy.s9Li2,
                t.privacyPolicy.s9Li3,
                t.privacyPolicy.s9Li4,
              ]} />
              <P>{t.privacyPolicy.s9P2}</P>
              <P>{t.privacyPolicy.s9P3}</P>
              <P style={{ marginBottom: 0 }}>{t.privacyPolicy.s9P4}</P>
            </Section>
          </div>

          {/* 10. California Privacy Notice */}
          <div ref={sectionRefs[10].ref}>
            <Section number="10." title={t.privacyPolicy.s10Title} mobile={mobile} visible={sectionRefs[10].visible}>
              <P>{t.privacyPolicy.s10P1}</P>
              <Bullet items={[
                t.privacyPolicy.s10Li1,
                t.privacyPolicy.s10Li2,
                t.privacyPolicy.s10Li3,
                t.privacyPolicy.s10Li4,
                t.privacyPolicy.s10Li5,
              ]} />
              <P>{t.privacyPolicy.s10P2}</P>
              <P style={{ marginBottom: 0 }}>{t.privacyPolicy.s10P3}</P>
            </Section>
          </div>

          {/* 11. Cookies & Tracking */}
          <div ref={sectionRefs[11].ref}>
            <Section number="11." title={t.privacyPolicy.s11Title} mobile={mobile} visible={sectionRefs[11].visible}>
              <P>{t.privacyPolicy.s11P1}</P>
              <Bullet items={[
                t.privacyPolicy.s11Li1,
                t.privacyPolicy.s11Li2,
                t.privacyPolicy.s11Li3,
                t.privacyPolicy.s11Li4,
              ]} />
              <P>{t.privacyPolicy.s11P2}</P>
              <P>{t.privacyPolicy.s11P3}</P>
              <P>{t.privacyPolicy.s11P4}</P>
              <P style={{ marginBottom: 0 }}>{t.privacyPolicy.s11P5}</P>
            </Section>
          </div>

          {/* 12. Children's Privacy */}
          <div ref={sectionRefs[12].ref}>
            <Section number="12." title={t.privacyPolicy.s12Title} mobile={mobile} visible={sectionRefs[12].visible}>
              <P>{t.privacyPolicy.s12P1}</P>
              <P style={{ marginBottom: 0 }}>{t.privacyPolicy.s12P2}</P>
            </Section>
          </div>

          {/* 13. International Users */}
          <div ref={sectionRefs[13].ref}>
            <Section number="13." title={t.privacyPolicy.s13Title} mobile={mobile} visible={sectionRefs[13].visible}>
              <P>{t.privacyPolicy.s13P1}</P>
              <P style={{ marginBottom: 0 }}>{t.privacyPolicy.s13P2}</P>
            </Section>
          </div>

          {/* 14. Changes to This Policy */}
          <div ref={sectionRefs[14].ref}>
            <Section number="14." title={t.privacyPolicy.s14Title} mobile={mobile} visible={sectionRefs[14].visible}>
              <P>{t.privacyPolicy.s14P1}</P>
              <P style={{ marginBottom: 0 }}>{t.privacyPolicy.s14P2}</P>
            </Section>
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
          className="mx-auto"
          style={{
            position: "relative",
            zIndex: 1,
            maxWidth: 600,
            paddingLeft: mobile ? 24 : 40,
            paddingRight: mobile ? 24 : 40,
            textAlign: "center",
          }}
        >
          <div style={{ fontSize: mobile ? 22 : 28, fontWeight: 700, color: "#FFFFFF", letterSpacing: "-0.02em", marginBottom: 8 }}>
            {t.privacyPolicy.closingBrand}
          </div>
          <div style={{ fontSize: mobile ? 15 : 17, color: "rgba(255,255,255,0.60)", marginBottom: 24 }}>
            {t.privacyPolicy.closingSubtitle}
          </div>
          <p style={{ fontSize: 12, color: "rgba(255,255,255,0.30)", letterSpacing: "0.02em" }}>
            {t.privacyPolicy.closingPowered}
          </p>
        </div>
      </section>
    </div>
  );
}
