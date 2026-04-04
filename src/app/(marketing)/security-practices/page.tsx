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
const border = "#E5E7EB";

/* ================================================================== */
/* CONTENT COMPONENTS                                                  */
/* ================================================================== */

function Section({ number, title, children, mobile, visible }: { number: string; title: string; children: React.ReactNode; mobile: boolean; visible: boolean }) {
  return (
    <div style={{
      background: C.white, borderRadius: 16, border: `1px solid ${border}`,
      padding: mobile ? "28px 24px" : "36px 40px",
      boxShadow: "0 1px 4px rgba(14,26,43,0.03)",
      opacity: visible ? 1 : 0, transform: visible ? "translateY(0)" : "translateY(10px)",
      transition: "opacity 500ms ease-out, transform 500ms ease-out",
    }}>
      <h2 style={{ fontSize: mobile ? 18 : 20, fontWeight: 600, color: C.navy, letterSpacing: "-0.02em", marginBottom: 18, lineHeight: 1.3 }}>
        <span style={{ color: C.purple, marginRight: 8, fontWeight: 500 }}>{number}</span>
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

/* ================================================================== */
/* PAGE                                                                */
/* ================================================================== */

export default function SecurityPracticesPage() {
  const mobile = useMobile();
  const { t } = useLanguage();
  const heroAnim = useInView();
  const s1 = useInView(); const s2 = useInView(); const s3 = useInView(); const s4 = useInView();
  const s5 = useInView(); const s6 = useInView(); const s7 = useInView(); const s8 = useInView();
  const s9 = useInView(); const s10 = useInView();

  return (
    <div style={{ background: "#FAFAFA", fontFamily: sans }}>

      {/* HERO */}
      <header style={{ backgroundColor: C.navy, position: "relative", overflow: "hidden", paddingTop: mobile ? 80 : 140, paddingBottom: mobile ? 56 : 100, paddingLeft: mobile ? 20 : 24, paddingRight: mobile ? 20 : 24 }}>
        <div style={{ position: "absolute", top: "-20%", right: "-10%", width: 600, height: 600, borderRadius: "50%", background: `radial-gradient(circle, ${C.purple}06 0%, transparent 70%)`, pointerEvents: "none" }} />
        <div ref={heroAnim.ref} style={{ maxWidth: 780, margin: "0 auto", textAlign: "center", position: "relative", zIndex: 1, opacity: heroAnim.visible ? 1 : 0, transform: heroAnim.visible ? "translateY(0)" : "translateY(10px)", transition: "opacity 500ms ease-out, transform 500ms ease-out" }}>
          <div style={{ fontSize: 11, fontWeight: 500, letterSpacing: "0.14em", textTransform: "uppercase" as const, color: C.teal, marginBottom: 20 }}>
            {t.securityPractices.heroTag}
          </div>
          <h1 style={{ fontSize: mobile ? 36 : 52, fontWeight: 600, color: "#F4F1EA", letterSpacing: "-0.03em", lineHeight: 1.08, marginBottom: 20 }}>
            {t.securityPractices.heroTitle}
          </h1>
          <p style={{ fontSize: 16, color: "rgba(244,241,234,0.50)", lineHeight: 1.65, marginBottom: 12 }}>
            {t.securityPractices.heroSubtitle}
          </p>
          <p style={{ fontSize: 13, color: "rgba(244,241,234,0.45)", letterSpacing: "0.03em", marginBottom: 4 }}>
            {t.securityPractices.heroModel}
          </p>
          <p style={{ fontSize: 13, color: "rgba(244,241,234,0.45)", letterSpacing: "0.03em" }}>
            {t.securityPractices.heroEffectiveDate}
          </p>
        </div>
      </header>

      {/* CONTENT */}
      <section style={{ paddingTop: mobile ? 56 : 112, paddingBottom: mobile ? 56 : 112 }}>
        <div style={{ maxWidth: 820, margin: "0 auto", paddingLeft: mobile ? 20 : 24, paddingRight: mobile ? 20 : 24, display: "flex", flexDirection: "column" as const, gap: mobile ? 16 : 20 }}>

          <div ref={s1.ref}><Section number="1." title={t.securityPractices.s1Title} mobile={mobile} visible={s1.visible}><P>{t.securityPractices.s1P1}</P><P>{t.securityPractices.s1P2}</P><P style={{ marginBottom: 0 }}>{t.securityPractices.s1P3}</P></Section></div>
          <div ref={s2.ref}><Section number="2." title={t.securityPractices.s2Title} mobile={mobile} visible={s2.visible}><P>{t.securityPractices.s2P1}</P><Bullet items={[t.securityPractices.s2Li1, t.securityPractices.s2Li2, t.securityPractices.s2Li3, t.securityPractices.s2Li4]} /><P style={{ marginBottom: 0 }}>{t.securityPractices.s2P2}</P></Section></div>
          <div ref={s3.ref}><Section number="3." title={t.securityPractices.s3Title} mobile={mobile} visible={s3.visible}><P>{t.securityPractices.s3P1}</P><Bullet items={[t.securityPractices.s3Li1, t.securityPractices.s3Li2, t.securityPractices.s3Li3, t.securityPractices.s3Li4, t.securityPractices.s3Li5]} /><P>{t.securityPractices.s3P2}</P><P style={{ marginBottom: 0 }}>{t.securityPractices.s3P3}</P></Section></div>
          <div ref={s4.ref}><Section number="4." title={t.securityPractices.s4Title} mobile={mobile} visible={s4.visible}><P>{t.securityPractices.s4P1}</P><P>{t.securityPractices.s4P2}</P><P style={{ marginBottom: 0 }}>{t.securityPractices.s4P3}</P></Section></div>
          <div ref={s5.ref}><Section number="5." title={t.securityPractices.s5Title} mobile={mobile} visible={s5.visible}><P>{t.securityPractices.s5P1}</P><Bullet items={[t.securityPractices.s5Li1, t.securityPractices.s5Li2, t.securityPractices.s5Li3, t.securityPractices.s5Li4]} /><P style={{ marginBottom: 0 }}>{t.securityPractices.s5P2}</P></Section></div>
          <div ref={s6.ref}><Section number="6." title={t.securityPractices.s6Title} mobile={mobile} visible={s6.visible}><P>{t.securityPractices.s6P1}</P><P>{t.securityPractices.s6P2}</P><P>{t.securityPractices.s6P3}</P><P style={{ marginBottom: 0 }}>{t.securityPractices.s6P4}</P></Section></div>
          <div ref={s7.ref}><Section number="7." title={t.securityPractices.s7Title} mobile={mobile} visible={s7.visible}><P>{t.securityPractices.s7P1}</P><P>{t.securityPractices.s7P2}</P><P>{t.securityPractices.s7P3}</P><Bullet items={[t.securityPractices.s7Li1, t.securityPractices.s7Li2, t.securityPractices.s7Li3, t.securityPractices.s7Li4]} /></Section></div>
          <div ref={s8.ref}><Section number="8." title={t.securityPractices.s8Title} mobile={mobile} visible={s8.visible}>
            <P>
              {t.securityPractices.s8Pre}
              <Link href="/contact" style={{ color: C.purple, fontWeight: 600, textDecoration: "none", borderBottom: "1px solid rgba(75,63,174,0.30)" }}>{t.securityPractices.s8LinkText}</Link>
              {t.securityPractices.s8Post}
            </P>
            <P style={{ marginBottom: 0 }}>{t.securityPractices.s8P2}</P>
          </Section></div>
          <div ref={s9.ref}><Section number="9." title={t.securityPractices.s9Title} mobile={mobile} visible={s9.visible}><P>{t.securityPractices.s9P1}</P><P>{t.securityPractices.s9P2}</P><P style={{ marginBottom: 0 }}>{t.securityPractices.s9P3}</P></Section></div>
          <div ref={s10.ref}><Section number="10." title={t.securityPractices.s10Title} mobile={mobile} visible={s10.visible}><P>{t.securityPractices.s10P1}</P><P style={{ marginBottom: 0 }}>{t.securityPractices.s10P2}</P></Section></div>

        </div>
      </section>

      {/* FOOTER */}
      <section style={{ backgroundColor: C.navy, paddingTop: mobile ? 56 : 80, paddingBottom: mobile ? 56 : 80, paddingLeft: mobile ? 20 : 24, paddingRight: mobile ? 20 : 24, position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", top: "50%", left: "50%", width: 400, height: 400, transform: "translate(-50%, -50%)", borderRadius: "50%", background: `radial-gradient(circle, ${C.purple}06 0%, transparent 70%)`, pointerEvents: "none" }} />
        <div style={{ maxWidth: 600, margin: "0 auto", textAlign: "center", position: "relative", zIndex: 1 }}>
          <div style={{ fontSize: mobile ? 24 : 32, fontWeight: 600, color: "#F4F1EA", letterSpacing: "-0.02em", lineHeight: 1.15, marginBottom: 12 }}>
            {t.securityPractices.closingBrand}
          </div>
          <p style={{ fontSize: 14, color: "rgba(244,241,234,0.40)", lineHeight: 1.6, marginBottom: 16 }}>
            {t.securityPractices.closingSubtitle}
          </p>
          <p style={{ fontSize: 12, color: "rgba(244,241,234,0.45)", letterSpacing: "0.04em" }}>
            {t.securityPractices.closingPowered}
          </p>
        </div>
      </section>
    </div>
  );
}
