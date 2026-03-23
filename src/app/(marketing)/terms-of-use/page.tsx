"use client";

import { useState, useEffect, useRef } from "react";
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
/*  Helpers                                                            */
/* ------------------------------------------------------------------ */

function Section({
  number,
  title,
  children,
  mobile,
  visible,
}: {
  number: string;
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
        <span style={{ color: B.purple, marginRight: 8 }}>{number}</span>
        {title}
      </h2>
      {children}
    </div>
  );
}

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

/* ------------------------------------------------------------------ */
/*  Page                                                               */
/* ------------------------------------------------------------------ */

export default function TermsOfUsePage() {
  const mobile = useMobile();
  const { t } = useLanguage();
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
  const s14 = useInView();
  const s15 = useInView();
  const s16 = useInView();
  const s17 = useInView();
  const s18 = useInView();
  const s19 = useInView();
  const s20 = useInView();

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
              {t.termsOfUse.heroTag}
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
            {t.termsOfUse.heroTitle}
          </h1>

          <p style={{ fontSize: mobile ? 15 : 17, color: "rgba(255,255,255,0.60)", lineHeight: 1.7, marginBottom: 8 }}>
            {t.termsOfUse.heroSubtitle}
          </p>
          <p style={{ fontSize: 14, color: "rgba(255,255,255,0.40)", marginBottom: 8 }}>
            {t.termsOfUse.heroModel}
          </p>
          <p style={{ fontSize: 14, color: "rgba(255,255,255,0.40)" }}>
            {t.termsOfUse.heroEffectiveDate}
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
          {/* 1 */}
          <div ref={s1.ref}>
            <Section number="1." title={t.termsOfUse.s1Title} mobile={mobile} visible={s1.visible}>
              <P>{t.termsOfUse.s1P1}</P>
              <P style={{ marginBottom: 0 }}>{t.termsOfUse.s1P2}</P>
            </Section>
          </div>

          {/* 2 */}
          <div ref={s2.ref}>
            <Section number="2." title={t.termsOfUse.s2Title} mobile={mobile} visible={s2.visible}>
              <P>{t.termsOfUse.s2P1}</P>
              <P>{t.termsOfUse.s2P2}</P>
              <P style={{ marginBottom: 0 }}>{t.termsOfUse.s2P3}</P>
            </Section>
          </div>

          {/* 3 */}
          <div ref={s3.ref}>
            <Section number="3." title={t.termsOfUse.s3Title} mobile={mobile} visible={s3.visible}>
              <P>{t.termsOfUse.s3P1}</P>
              <P>{t.termsOfUse.s3P2}</P>
              <P style={{ marginBottom: 0 }}>{t.termsOfUse.s3P3}</P>
            </Section>
          </div>

          {/* 4 */}
          <div ref={s4.ref}>
            <Section number="4." title={t.termsOfUse.s4Title} mobile={mobile} visible={s4.visible}>
              <P>{t.termsOfUse.s4P1}</P>
              <Bullet items={[
                t.termsOfUse.s4Li1,
                t.termsOfUse.s4Li2,
                t.termsOfUse.s4Li3,
                t.termsOfUse.s4Li4,
              ]} />
              <P style={{ marginBottom: 0 }}>{t.termsOfUse.s4P2}</P>
            </Section>
          </div>

          {/* 5 */}
          <div ref={s5.ref}>
            <Section number="5." title={t.termsOfUse.s5Title} mobile={mobile} visible={s5.visible}>
              <P>{t.termsOfUse.s5P1}</P>
              <Bullet items={[
                t.termsOfUse.s5Li1,
                t.termsOfUse.s5Li2,
                t.termsOfUse.s5Li3,
                t.termsOfUse.s5Li4,
              ]} />
              <P style={{ marginBottom: 0 }}>{t.termsOfUse.s5P2}</P>
            </Section>
          </div>

          {/* 6 */}
          <div ref={s6.ref}>
            <Section number="6." title={t.termsOfUse.s6Title} mobile={mobile} visible={s6.visible}>
              <P>{t.termsOfUse.s6P1}</P>
              <P>{t.termsOfUse.s6P2}</P>
              <P>{t.termsOfUse.s6P3}</P>
              <P style={{ marginBottom: 0 }}>{t.termsOfUse.s6P4}</P>
            </Section>
          </div>

          {/* 7 */}
          <div ref={s7.ref}>
            <Section number="7." title={t.termsOfUse.s7Title} mobile={mobile} visible={s7.visible}>
              <P>{t.termsOfUse.s7P1}</P>
              <P>{t.termsOfUse.s7P2}</P>
              <Bullet items={[
                t.termsOfUse.s7Li1,
                t.termsOfUse.s7Li2,
              ]} />
              <P>{t.termsOfUse.s7P3}</P>
              <P>{t.termsOfUse.s7P4}</P>
              <P style={{ marginBottom: 0 }}>{t.termsOfUse.s7P5}</P>
            </Section>
          </div>

          {/* 8 */}
          <div ref={s8.ref}>
            <Section number="8." title={t.termsOfUse.s8Title} mobile={mobile} visible={s8.visible}>
              <P>{t.termsOfUse.s8P1}</P>
              <P>{t.termsOfUse.s8P2}</P>
              <Bullet items={[
                t.termsOfUse.s8Li1,
                t.termsOfUse.s8Li2,
                t.termsOfUse.s8Li3,
                t.termsOfUse.s8Li4,
                t.termsOfUse.s8Li5,
              ].filter(Boolean)} />
              <P>{t.termsOfUse.s8P3}</P>
              <P>{t.termsOfUse.s8P4}</P>
              <P style={{ marginBottom: 0 }}>{t.termsOfUse.s8P5}</P>
            </Section>
          </div>

          {/* 9 */}
          <div ref={s9.ref}>
            <Section number="9." title={t.termsOfUse.s9Title} mobile={mobile} visible={s9.visible}>
              <P>{t.termsOfUse.s9P1}</P>
              <P>{t.termsOfUse.s9P2}</P>
              <P>{t.termsOfUse.s9P3}</P>
              <Bullet items={[
                t.termsOfUse.s9Li1,
                t.termsOfUse.s9Li2,
                t.termsOfUse.s9Li3,
                t.termsOfUse.s9Li4,
                t.termsOfUse.s9Li5,
              ]} />
              <P style={{ marginBottom: 0 }}>{t.termsOfUse.s9P4}</P>
            </Section>
          </div>

          {/* 10 */}
          <div ref={s10.ref}>
            <Section number="10." title={t.termsOfUse.s10Title} mobile={mobile} visible={s10.visible}>
              <P>{t.termsOfUse.s10P1}</P>
              <P>{t.termsOfUse.s10P2}</P>
              <P style={{ marginBottom: 0 }}>{t.termsOfUse.s10P3}</P>
            </Section>
          </div>

          {/* 11 */}
          <div ref={s11.ref}>
            <Section number="11." title={t.termsOfUse.s11Title} mobile={mobile} visible={s11.visible}>
              <P>{t.termsOfUse.s11P1}</P>
              <P style={{ marginBottom: 0 }}>{t.termsOfUse.s11P2}</P>
            </Section>
          </div>

          {/* 12 */}
          <div ref={s12.ref}>
            <Section number="12." title={t.termsOfUse.s12Title} mobile={mobile} visible={s12.visible}>
              <P>{t.termsOfUse.s12P1}</P>
              <P>{t.termsOfUse.s12P2}</P>
              <P>{t.termsOfUse.s12P3}</P>
              <P style={{ marginBottom: 0 }}>{t.termsOfUse.s12P4}</P>
            </Section>
          </div>

          {/* 13 */}
          <div ref={s13.ref}>
            <Section number="13." title={t.termsOfUse.s13Title} mobile={mobile} visible={s13.visible}>
              <P>{t.termsOfUse.s13P1}</P>
              <P>{t.termsOfUse.s13P2}</P>
              <Bullet items={[
                t.termsOfUse.s13Li1,
                t.termsOfUse.s13Li2,
                t.termsOfUse.s13Li3,
                t.termsOfUse.s13Li4,
              ]} />
              <P style={{ marginBottom: 0 }}>{t.termsOfUse.s13P3}</P>
            </Section>
          </div>

          {/* 14 */}
          <div ref={s14.ref}>
            <Section number="14." title={t.termsOfUse.s14Title} mobile={mobile} visible={s14.visible}>
              <P>{t.termsOfUse.s14P1}</P>
              <Bullet items={[
                t.termsOfUse.s14Li1,
                t.termsOfUse.s14Li2,
                t.termsOfUse.s14Li3,
              ]} />
            </Section>
          </div>

          {/* 15 */}
          <div ref={s15.ref}>
            <Section number="15." title={t.termsOfUse.s15Title} mobile={mobile} visible={s15.visible}>
              <P style={{ marginBottom: 0 }}>{t.termsOfUse.s15P1}</P>
            </Section>
          </div>

          {/* 16 */}
          <div ref={s16.ref}>
            <Section number="16." title={t.termsOfUse.s16Title} mobile={mobile} visible={s16.visible}>
              <P>{t.termsOfUse.s16P1}</P>
              <P>{t.termsOfUse.s16P2}</P>
              <P style={{ marginBottom: 0 }}>{t.termsOfUse.s16P3}</P>
            </Section>
          </div>

          {/* 17 */}
          <div ref={s17.ref}>
            <Section number="17." title={t.termsOfUse.s17Title} mobile={mobile} visible={s17.visible}>
              <P>{t.termsOfUse.s17P1}</P>
              <P>{t.termsOfUse.s17P2}</P>
              <P style={{ marginBottom: 0 }}>{t.termsOfUse.s17P3}</P>
            </Section>
          </div>

          {/* 18 */}
          <div ref={s18.ref}>
            <Section number="18." title={t.termsOfUse.s18Title} mobile={mobile} visible={s18.visible}>
              <P style={{ marginBottom: 0 }}>{t.termsOfUse.s18P1}</P>
            </Section>
          </div>

          {/* 19 */}
          <div ref={s19.ref}>
            <Section number="19." title={t.termsOfUse.s19Title} mobile={mobile} visible={s19.visible}>
              <P style={{ marginBottom: 0 }}>{t.termsOfUse.s19P1}</P>
            </Section>
          </div>

          {/* 20 */}
          <div ref={s20.ref}>
            <Section number="20." title={t.termsOfUse.s20Title} mobile={mobile} visible={s20.visible}>
              <P>{t.termsOfUse.s20P1}</P>
              <P>{t.termsOfUse.s20P2}</P>
              <P>{t.termsOfUse.s20P3}</P>
              <P style={{ marginBottom: 0 }}>{t.termsOfUse.s20P4}</P>
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
            {t.termsOfUse.closingBrand}
          </div>
          <div style={{ fontSize: mobile ? 15 : 17, color: "rgba(255,255,255,0.60)", marginBottom: 24 }}>
            {t.termsOfUse.closingSubtitle}
          </div>
          <p style={{ fontSize: 12, color: "rgba(255,255,255,0.30)", letterSpacing: "0.02em" }}>
            {t.termsOfUse.closingPowered}
          </p>
        </div>
      </section>
    </div>
  );
}
