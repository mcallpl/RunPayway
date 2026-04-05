"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useLanguage } from "@/lib/i18n";
import { C, sans } from "@/lib/design-tokens";

/* ================================================================== */
/* UTILITIES                                                           */
/* ================================================================== */

function useMobile(bp = 768) {
  const [m, setM] = useState(false);
  useEffect(() => { const c = () => setM(window.innerWidth <= bp); c(); window.addEventListener("resize", c); return () => window.removeEventListener("resize", c); }, [bp]);
  return m;
}

function useInView(threshold = 0) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    if (rect.top < window.innerHeight + 50 && rect.bottom > 0) { setVisible(true); return; }
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setVisible(true); obs.disconnect(); } }, { threshold });
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);
  return { ref, visible };
}

/* ================================================================== */
/* TOKENS                                                              */
/* ================================================================== */

const muted = "rgba(14,26,43,0.68)";
const light = "rgba(14,26,43,0.52)";
const border = "#E5E7EB";

/* ================================================================== */
/* CONTENT COMPONENTS                                                  */
/* ================================================================== */

function Section({ number, title, children, mobile, visible }: { number?: string; title: string; children: React.ReactNode; mobile: boolean; visible: boolean }) {
  return (
    <div style={{
      background: C.white, borderRadius: 16, border: `1px solid ${border}`,
      padding: mobile ? "28px 24px" : "36px 40px",
      boxShadow: "0 1px 4px rgba(14,26,43,0.03)",
      opacity: visible ? 1 : 0, transform: visible ? "translateY(0)" : "translateY(10px)",
      transition: "opacity 500ms ease-out, transform 500ms ease-out",
    }}>
      <h2 style={{ fontSize: mobile ? 18 : 20, fontWeight: 600, color: C.navy, letterSpacing: "-0.02em", marginBottom: 18, lineHeight: 1.3 }}>
        {number && <span style={{ color: C.purple, marginRight: 8, fontWeight: 500 }}>{number}</span>}
        {title}
      </h2>
      {children}
    </div>
  );
}

function P({ children, style }: { children: React.ReactNode; style?: React.CSSProperties }) {
  return <p style={{ fontSize: 14, color: muted, lineHeight: 1.75, marginBottom: 12, ...style }}>{children}</p>;
}

function Bullet({ items }: { items: string[] }) {
  return (
    <ul style={{ padding: 0, margin: "0 0 12px", listStyle: "none" }}>
      {items.map((item) => (
        <li key={item} style={{ fontSize: 14, color: muted, lineHeight: 1.75, paddingLeft: 20, position: "relative" }}>
          <span style={{ position: "absolute", left: 0, top: 10, width: 5, height: 5, borderRadius: "50%", backgroundColor: C.teal }} />
          {item}
        </li>
      ))}
    </ul>
  );
}

function SubHead({ children }: { children: React.ReactNode }) {
  return <div style={{ fontSize: 14, fontWeight: 600, color: C.navy, marginBottom: 10, marginTop: 18 }}>{children}</div>;
}

/* ================================================================== */
/* PAGE                                                                */
/* ================================================================== */

export default function PrivacyPolicyPage() {
  const mobile = useMobile();
  const { t } = useLanguage();
  const heroAnim = useInView();
  const sectionRefs = Array.from({ length: 16 }, () => useInView());

  return (
    <div style={{ background: "#FAFAFA", fontFamily: sans }}>

      {/* HERO */}
      <header style={{ backgroundColor: C.white, position: "relative", overflow: "hidden", paddingTop: mobile ? 36 : 56, paddingBottom: mobile ? 36 : 56, paddingLeft: mobile ? 20 : 24, paddingRight: mobile ? 20 : 24 }}>
        <div style={{ position: "absolute", top: "-20%", right: "-10%", width: 600, height: 600, borderRadius: "50%", background: `radial-gradient(circle, ${C.purple}06 0%, transparent 70%)`, pointerEvents: "none" }} />
        <div ref={heroAnim.ref} style={{ maxWidth: 780, margin: "0 auto", textAlign: "center", position: "relative", zIndex: 1, opacity: heroAnim.visible ? 1 : 0, transform: heroAnim.visible ? "translateY(0)" : "translateY(10px)", transition: "opacity 500ms ease-out, transform 500ms ease-out" }}>
          <div style={{ fontSize: 11, fontWeight: 500, letterSpacing: "0.14em", textTransform: "uppercase" as const, color: C.teal, marginBottom: 20 }}>
            {t.privacyPolicy.heroTag}
          </div>
          <h1 style={{ fontSize: mobile ? 36 : 52, fontWeight: 600, color: C.navy, letterSpacing: "-0.03em", lineHeight: 1.08, marginBottom: 20 }}>
            {t.privacyPolicy.heroTitle}
          </h1>
          <p style={{ fontSize: 16, color: muted, lineHeight: 1.65, marginBottom: 12 }}>
            {t.privacyPolicy.heroSubtitle}
          </p>
          <p style={{ fontSize: 13, color: light, letterSpacing: "0.03em" }}>
            {t.privacyPolicy.heroModel}
          </p>
        </div>
      </header>

      {/* CONTENT */}
      <section style={{ paddingTop: mobile ? 56 : 112, paddingBottom: mobile ? 56 : 112 }}>
        <div style={{ maxWidth: 820, margin: "0 auto", paddingLeft: mobile ? 20 : 24, paddingRight: mobile ? 20 : 24, display: "flex", flexDirection: "column" as const, gap: mobile ? 16 : 20 }}>

          <div ref={sectionRefs[0].ref}>
            <Section title={t.privacyPolicy.s0Title} mobile={mobile} visible={sectionRefs[0].visible}>
              <P>{t.privacyPolicy.s0EffectiveDate}</P>
              <P style={{ fontWeight: 600, color: C.navy, marginBottom: 4 }}>{t.privacyPolicy.s0Operator}</P>
              <P>{t.privacyPolicy.s0Address.split("\n").map((line: string, i: number) => (<span key={i}>{line}{i < 2 && <br />}</span>))}</P>
              <P>{t.privacyPolicy.s0Controller}</P>
              <P style={{ marginBottom: 0 }}>
                {t.privacyPolicy.s0InquiriesPre}
                <Link href="/privacy-request" style={{ color: C.purple, fontWeight: 600, textDecoration: "none", borderBottom: "1px solid rgba(75,63,174,0.30)" }}>
                  {t.privacyPolicy.s0LinkText}
                </Link>.
              </P>
            </Section>
          </div>

          <div ref={sectionRefs[1].ref}>
            <Section number="1." title={t.privacyPolicy.s1Title} mobile={mobile} visible={sectionRefs[1].visible}>
              <P>{t.privacyPolicy.s1P1}</P>
              <P>{t.privacyPolicy.s1P2}</P>
              <Bullet items={[t.privacyPolicy.s1Li1, t.privacyPolicy.s1Li2, t.privacyPolicy.s1Li3, t.privacyPolicy.s1Li4, t.privacyPolicy.s1Li5, t.privacyPolicy.s1Li6]} />
              <P style={{ marginBottom: 0 }}>{t.privacyPolicy.s1P3}</P>
            </Section>
          </div>

          <div ref={sectionRefs[2].ref}>
            <Section number="2." title={t.privacyPolicy.s2Title} mobile={mobile} visible={sectionRefs[2].visible}>
              <SubHead>{t.privacyPolicy.s2SubA}</SubHead>
              <P>{t.privacyPolicy.s2P1}</P>
              <Bullet items={[t.privacyPolicy.s2Li1, t.privacyPolicy.s2Li2, t.privacyPolicy.s2Li3, t.privacyPolicy.s2Li4, t.privacyPolicy.s2Li5, t.privacyPolicy.s2Li6]} />
              <P>{t.privacyPolicy.s2P2}</P>
              <SubHead>{t.privacyPolicy.s2SubB}</SubHead>
              <P>{t.privacyPolicy.s2P3}</P>
              <Bullet items={[t.privacyPolicy.s2Li7, t.privacyPolicy.s2Li8, t.privacyPolicy.s2Li9, t.privacyPolicy.s2Li10, t.privacyPolicy.s2Li11, t.privacyPolicy.s2Li12, t.privacyPolicy.s2Li13]} />
              <P>{t.privacyPolicy.s2P4}</P>
              <SubHead>{t.privacyPolicy.s2SubC}</SubHead>
              <P>{t.privacyPolicy.s2P5}</P>
              <P>{t.privacyPolicy.s2P6}</P>
              <P style={{ marginBottom: 0 }}>{t.privacyPolicy.s2P7}</P>
            </Section>
          </div>

          <div ref={sectionRefs[3].ref}>
            <Section number="3." title={t.privacyPolicy.s3Title} mobile={mobile} visible={sectionRefs[3].visible}>
              <P>{t.privacyPolicy.s3P1}</P>
              <Bullet items={[t.privacyPolicy.s3Li1, t.privacyPolicy.s3Li2, t.privacyPolicy.s3Li3, t.privacyPolicy.s3Li4, t.privacyPolicy.s3Li5, t.privacyPolicy.s3Li6, t.privacyPolicy.s3Li7, t.privacyPolicy.s3Li8, t.privacyPolicy.s3Li9, t.privacyPolicy.s3Li10].filter(Boolean)} />
              <P style={{ marginBottom: 0 }}>{t.privacyPolicy.s3P2}</P>
            </Section>
          </div>

          <div ref={sectionRefs[4].ref}>
            <Section number="4." title={t.privacyPolicy.s4Title} mobile={mobile} visible={sectionRefs[4].visible}>
              <P>{t.privacyPolicy.s4P1}</P>
              <Bullet items={[t.privacyPolicy.s4Li1, t.privacyPolicy.s4Li2, t.privacyPolicy.s4Li3, t.privacyPolicy.s4Li4]} />
              <P style={{ marginBottom: 0 }}>{t.privacyPolicy.s4P2}</P>
            </Section>
          </div>

          <div ref={sectionRefs[5].ref}>
            <Section number="5." title={t.privacyPolicy.s5Title} mobile={mobile} visible={sectionRefs[5].visible}>
              <P>{t.privacyPolicy.s5P1}</P>
              <P>{t.privacyPolicy.s5P2}</P>
              <Bullet items={[t.privacyPolicy.s5Li1, t.privacyPolicy.s5Li2, t.privacyPolicy.s5Li3, t.privacyPolicy.s5Li4]} />
              <P>{t.privacyPolicy.s5P3}</P>
              <P>{t.privacyPolicy.s5P4}</P>
              <P style={{ marginBottom: 0 }}>{t.privacyPolicy.s5P5}</P>
            </Section>
          </div>

          <div ref={sectionRefs[6].ref}>
            <Section number="6." title={t.privacyPolicy.s6Title} mobile={mobile} visible={sectionRefs[6].visible}>
              <P>{t.privacyPolicy.s6P1}</P>
              <P>{t.privacyPolicy.s6P2}</P>
              <P>{t.privacyPolicy.s6P3}</P>
              <P style={{ marginBottom: 0 }}>{t.privacyPolicy.s6P4}</P>
            </Section>
          </div>

          <div ref={sectionRefs[7].ref}>
            <Section number="7." title={t.privacyPolicy.s7Title} mobile={mobile} visible={sectionRefs[7].visible}>
              <P>{t.privacyPolicy.s7P1}</P>
              <P style={{ marginBottom: 0 }}>{t.privacyPolicy.s7P2}</P>
            </Section>
          </div>

          <div ref={sectionRefs[8].ref}>
            <Section number="8." title={t.privacyPolicy.s8Title} mobile={mobile} visible={sectionRefs[8].visible}>
              <P>{t.privacyPolicy.s8P1}</P>
              <P>{t.privacyPolicy.s8P2}</P>
              <Bullet items={[t.privacyPolicy.s8Li1, t.privacyPolicy.s8Li2, t.privacyPolicy.s8Li3, t.privacyPolicy.s8Li4, t.privacyPolicy.s8Li5]} />
              <P>{t.privacyPolicy.s8P3}</P>
              <Bullet items={[t.privacyPolicy.s8Li6, t.privacyPolicy.s8Li7, t.privacyPolicy.s8Li8]} />
            </Section>
          </div>

          <div ref={sectionRefs[9].ref}>
            <Section number="9." title={t.privacyPolicy.s9Title} mobile={mobile} visible={sectionRefs[9].visible}>
              <P>{t.privacyPolicy.s9P1}</P>
              <Bullet items={[t.privacyPolicy.s9Li1, t.privacyPolicy.s9Li2, t.privacyPolicy.s9Li3, t.privacyPolicy.s9Li4, t.privacyPolicy.s9Li5]} />
              <P>{t.privacyPolicy.s9P2}</P>
              <P>{t.privacyPolicy.s9P3}</P>
              <P>{t.privacyPolicy.s9P4}</P>
              <P style={{ marginBottom: 0 }}>{t.privacyPolicy.s9P5}</P>
            </Section>
          </div>

          <div ref={sectionRefs[10].ref}>
            <Section number="10." title={t.privacyPolicy.s10Title} mobile={mobile} visible={sectionRefs[10].visible}>
              <P>{t.privacyPolicy.s10P1}</P>
              <Bullet items={[t.privacyPolicy.s10Li1, t.privacyPolicy.s10Li2, t.privacyPolicy.s10Li3, t.privacyPolicy.s10Li4, t.privacyPolicy.s10Li5]} />
              <P>{t.privacyPolicy.s10P2}</P>
              <P style={{ marginBottom: 0 }}>{t.privacyPolicy.s10P3}</P>
            </Section>
          </div>

          <div ref={sectionRefs[11].ref}>
            <Section number="11." title={t.privacyPolicy.s11Title} mobile={mobile} visible={sectionRefs[11].visible}>
              <P>{t.privacyPolicy.s11P1}</P>
              <Bullet items={[t.privacyPolicy.s11Li1, t.privacyPolicy.s11Li2, t.privacyPolicy.s11Li3, t.privacyPolicy.s11Li4]} />
              <P>{t.privacyPolicy.s11P2}</P>
              <P>{t.privacyPolicy.s11P3}</P>
              <P>{t.privacyPolicy.s11P4}</P>
              <P style={{ marginBottom: 0 }}>{t.privacyPolicy.s11P5}</P>
            </Section>
          </div>

          <div ref={sectionRefs[12].ref}>
            <Section number="12." title={t.privacyPolicy.s12Title} mobile={mobile} visible={sectionRefs[12].visible}>
              <P>{t.privacyPolicy.s12P1}</P>
              <P style={{ marginBottom: 0 }}>{t.privacyPolicy.s12P2}</P>
            </Section>
          </div>

          <div ref={sectionRefs[13].ref}>
            <Section number="13." title={t.privacyPolicy.s13Title} mobile={mobile} visible={sectionRefs[13].visible}>
              <P>{t.privacyPolicy.s13P1}</P>
              <P>{t.privacyPolicy.s13P2}</P>
              <P style={{ marginBottom: 0 }}>{t.privacyPolicy.s13P3}</P>
            </Section>
          </div>

          <div ref={sectionRefs[14].ref}>
            <Section number="14." title={t.privacyPolicy.s13bTitle} mobile={mobile} visible={sectionRefs[14].visible}>
              <P>{t.privacyPolicy.s13bP1}</P>
              <P style={{ marginBottom: 0 }}>{t.privacyPolicy.s13bP2}</P>
            </Section>
          </div>

          <div ref={sectionRefs[15].ref}>
            <Section number="15." title={t.privacyPolicy.s14Title} mobile={mobile} visible={sectionRefs[15].visible}>
              <P>{t.privacyPolicy.s14P1}</P>
              <P style={{ marginBottom: 0 }}>{t.privacyPolicy.s14P2}</P>
            </Section>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <section style={{ backgroundColor: C.navy, paddingTop: mobile ? 56 : 80, paddingBottom: mobile ? 56 : 80, paddingLeft: mobile ? 20 : 24, paddingRight: mobile ? 20 : 24, position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", top: "50%", left: "50%", width: 400, height: 400, transform: "translate(-50%, -50%)", borderRadius: "50%", background: `radial-gradient(circle, ${C.purple}06 0%, transparent 70%)`, pointerEvents: "none" }} />
        <div style={{ maxWidth: 600, margin: "0 auto", textAlign: "center", position: "relative", zIndex: 1 }}>
          <div style={{ fontSize: mobile ? 24 : 32, fontWeight: 600, color: C.navy, letterSpacing: "-0.02em", lineHeight: 1.15, marginBottom: 12 }}>
            {t.privacyPolicy.closingBrand}
          </div>
          <p style={{ fontSize: 14, color: light, lineHeight: 1.6, marginBottom: 16 }}>
            {t.privacyPolicy.closingSubtitle}
          </p>
          <p style={{ fontSize: 12, color: light, letterSpacing: "0.04em" }}>
            {t.privacyPolicy.closingPowered}
          </p>
        </div>
      </section>
    </div>
  );
}
