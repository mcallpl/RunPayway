"use client";

import { useState, useEffect, useRef } from "react";
import { useLanguage } from "@/lib/i18n";
import { C, sans, sp } from "@/lib/design-tokens";

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

const gradient = `linear-gradient(135deg, ${C.navy} 0%, ${C.purple} 50%, ${C.teal} 100%)`;

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
        background: C.white,
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
          color: C.navy,
          letterSpacing: "-0.02em",
          marginBottom: 16,
          lineHeight: 1.3,
        }}
      >
        <span style={{ color: C.purple, marginRight: 8 }}>{number}</span>
        {title}
      </h2>
      {children}
    </div>
  );
}

function P({ children, style }: { children: React.ReactNode; style?: React.CSSProperties }) {
  return (
    <p style={{ fontSize: 15, color: C.muted, lineHeight: 1.75, marginBottom: 12, ...style }}>
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
            color: C.muted,
            lineHeight: 1.75,
            paddingLeft: 20,
            position: "relative",
          }}
        >
          <span style={{ position: "absolute", left: 0, color: C.purple, fontSize: 11, lineHeight: "26px" }}>●</span>
          {item}
        </li>
      ))}
    </ul>
  );
}

/* ------------------------------------------------------------------ */
/*  Page                                                               */
/* ------------------------------------------------------------------ */

export default function ModelVersionPolicyPage() {
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

  return (
    <div style={{ background: C.sand, fontFamily: sans }}>
      {/* ============================================================ */}
      {/*  Hero                                                        */}
      {/* ============================================================ */}
      <section
        style={{
          position: "relative",
          overflow: "hidden",
          background: gradient,
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
            <span style={{ fontSize: 12, fontWeight: 600, color: C.sandText, letterSpacing: "0.06em", textTransform: "uppercase" }}>
              {t.modelVersionPolicy.heroTag}
            </span>
          </div>

          <h1
            style={{
              fontSize: mobile ? 30 : 44,
              fontWeight: 700,
              color: C.sandText,
              letterSpacing: "-0.03em",
              lineHeight: 1.15,
              marginBottom: 20,
            }}
          >
            {t.modelVersionPolicy.heroTitle}
          </h1>

          <p style={{ fontSize: mobile ? 15 : 17, color: C.sandMuted, lineHeight: 1.7, marginBottom: 8 }}>
            {t.modelVersionPolicy.heroSubtitle}
          </p>
          <p style={{ fontSize: 14, color: C.sandLight, marginBottom: 8 }}>
            {t.modelVersionPolicy.heroModel}
          </p>
          <p style={{ fontSize: 14, color: C.sandLight }}>
            {t.modelVersionPolicy.heroEffectiveDate}
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
            <Section number="1." title={t.modelVersionPolicy.s1Title} mobile={mobile} visible={s1.visible}>
              <P>{t.modelVersionPolicy.s1P1}</P>
              <P style={{ marginBottom: 0 }}>{t.modelVersionPolicy.s1P2}</P>
            </Section>
          </div>

          {/* 2 */}
          <div ref={s2.ref}>
            <Section number="2." title={t.modelVersionPolicy.s2Title} mobile={mobile} visible={s2.visible}>
              <P>{t.modelVersionPolicy.s2P1}</P>
              <P>{t.modelVersionPolicy.s2P2}</P>
              <P style={{ marginBottom: 0 }}>{t.modelVersionPolicy.s2P3}</P>
            </Section>
          </div>

          {/* 3 */}
          <div ref={s3.ref}>
            <Section number="3." title={t.modelVersionPolicy.s3Title} mobile={mobile} visible={s3.visible}>
              <P>{t.modelVersionPolicy.s3P1}</P>
              <P>{t.modelVersionPolicy.s3P2}</P>
              <P style={{ marginBottom: 0 }}>{t.modelVersionPolicy.s3P3}</P>
            </Section>
          </div>

          {/* 4 */}
          <div ref={s4.ref}>
            <Section number="4." title={t.modelVersionPolicy.s4Title} mobile={mobile} visible={s4.visible}>
              <P>{t.modelVersionPolicy.s4P1}</P>
              <Bullet items={[
                t.modelVersionPolicy.s4Li1,
                t.modelVersionPolicy.s4Li2,
                t.modelVersionPolicy.s4Li3,
              ]} />
              <P>{t.modelVersionPolicy.s4P2}</P>
              <P style={{ marginBottom: 0 }}>{t.modelVersionPolicy.s4P3}</P>
            </Section>
          </div>

          {/* 5 */}
          <div ref={s5.ref}>
            <Section number="5." title={t.modelVersionPolicy.s5Title} mobile={mobile} visible={s5.visible}>
              <P>{t.modelVersionPolicy.s5P1}</P>
              <P style={{ marginBottom: 0 }}>{t.modelVersionPolicy.s5P2}</P>
            </Section>
          </div>

          {/* 6 */}
          <div ref={s6.ref}>
            <Section number="6." title={t.modelVersionPolicy.s6Title} mobile={mobile} visible={s6.visible}>
              <P>{t.modelVersionPolicy.s6P1}</P>
              <Bullet items={[
                t.modelVersionPolicy.s6Li1,
                t.modelVersionPolicy.s6Li2,
                t.modelVersionPolicy.s6Li3,
                t.modelVersionPolicy.s6Li4,
              ]} />
              <P>{t.modelVersionPolicy.s6P2}</P>
              <P style={{ marginBottom: 0 }}>{t.modelVersionPolicy.s6P3}</P>
            </Section>
          </div>

          {/* 7 */}
          <div ref={s7.ref}>
            <Section number="7." title={t.modelVersionPolicy.s7Title} mobile={mobile} visible={s7.visible}>
              <P>{t.modelVersionPolicy.s7P1}</P>
              <P>{t.modelVersionPolicy.s7P2}</P>
              <Bullet items={[
                t.modelVersionPolicy.s7Li1,
                t.modelVersionPolicy.s7Li2,
                t.modelVersionPolicy.s7Li3,
                t.modelVersionPolicy.s7Li4,
              ]} />
              <P style={{ marginBottom: 0 }}>{t.modelVersionPolicy.s7P3}</P>
            </Section>
          </div>

          {/* 8 */}
          <div ref={s8.ref}>
            <Section number="8." title={t.modelVersionPolicy.s8Title} mobile={mobile} visible={s8.visible}>
              <P>{t.modelVersionPolicy.s8P1}</P>
              <P>{t.modelVersionPolicy.s8P2}</P>
              <P style={{ marginBottom: 0 }}>{t.modelVersionPolicy.s8P3}</P>
            </Section>
          </div>

          {/* 9 */}
          <div ref={s9.ref}>
            <Section number="9." title={t.modelVersionPolicy.s9Title} mobile={mobile} visible={s9.visible}>
              <P>{t.modelVersionPolicy.s9P1}</P>
              <Bullet items={[
                t.modelVersionPolicy.s9Li1,
                t.modelVersionPolicy.s9Li2,
                t.modelVersionPolicy.s9Li3,
              ]} />
              <P style={{ marginBottom: 0 }}>{t.modelVersionPolicy.s9P2}</P>
            </Section>
          </div>

          {/* 10 */}
          <div ref={s10.ref}>
            <Section number="10." title={t.modelVersionPolicy.s10Title} mobile={mobile} visible={s10.visible}>
              <P>{t.modelVersionPolicy.s10P1}</P>
              <Bullet items={[
                t.modelVersionPolicy.s10Li1,
                t.modelVersionPolicy.s10Li2,
                t.modelVersionPolicy.s10Li3,
                t.modelVersionPolicy.s10Li4,
                t.modelVersionPolicy.s10Li5,
              ]} />
              <P style={{ marginBottom: 0 }}>{t.modelVersionPolicy.s10P2}</P>
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
          background: gradient,
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
          <div style={{ fontSize: mobile ? 22 : 28, fontWeight: 700, color: C.sandText, letterSpacing: "-0.02em", marginBottom: 8 }}>
            {t.modelVersionPolicy.closingBrand}
          </div>
          <div style={{ fontSize: mobile ? 15 : 17, color: C.sandMuted, marginBottom: 24 }}>
            {t.modelVersionPolicy.closingSubtitle}
          </div>
          <p style={{ fontSize: 12, color: C.sandLight, letterSpacing: "0.02em" }}>
            {t.modelVersionPolicy.closingPowered}
          </p>
        </div>
      </section>
    </div>
  );
}
