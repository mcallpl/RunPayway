"use client";

import { useState, useEffect, useRef } from "react";
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
const light = "rgba(14,26,43,0.62)";const border = "#E5E7EB";

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

export default function TermsOfUsePage() {
  const mobile = useMobile();
  const { t } = useLanguage();
  const heroAnim = useInView();

  const s1 = useInView(); const s2 = useInView(); const s3 = useInView(); const s4 = useInView();
  const s5 = useInView(); const s6 = useInView(); const s7 = useInView(); const s8 = useInView();
  const s9 = useInView(); const s10 = useInView(); const s11 = useInView(); const s12 = useInView();
  const s13 = useInView(); const s14 = useInView(); const s15 = useInView(); const s16 = useInView();
  const s17 = useInView(); const s18 = useInView(); const s19 = useInView(); const s20 = useInView();

  return (
    <div style={{ background: "#FAFAFA", fontFamily: sans }}>

      {/* HERO */}
      <header style={{ backgroundColor: C.white, position: "relative", overflow: "hidden", paddingTop: mobile ? 36 : 56, paddingBottom: mobile ? 36 : 56, paddingLeft: mobile ? 20 : 24, paddingRight: mobile ? 20 : 24 }}>
        <div style={{ position: "absolute", top: "-20%", right: "-10%", width: 600, height: 600, borderRadius: "50%", background: `radial-gradient(circle, ${C.purple}06 0%, transparent 70%)`, pointerEvents: "none" }} />
        <div ref={heroAnim.ref} style={{ maxWidth: 780, margin: "0 auto", textAlign: "center", position: "relative", zIndex: 1, opacity: heroAnim.visible ? 1 : 0, transform: heroAnim.visible ? "translateY(0)" : "translateY(10px)", transition: "opacity 500ms ease-out, transform 500ms ease-out" }}>
          <div style={{ fontSize: 11, fontWeight: 500, letterSpacing: "0.14em", textTransform: "uppercase" as const, color: C.teal, marginBottom: 20 }}>
            {t.termsOfUse.heroTag}
          </div>
          <h1 style={{ fontSize: mobile ? 36 : 52, fontWeight: 600, color: C.navy, letterSpacing: "-0.03em", lineHeight: 1.08, marginBottom: 20 }}>
            {t.termsOfUse.heroTitle}
          </h1>
          <p style={{ fontSize: 16, color: muted, lineHeight: 1.65, marginBottom: 12 }}>
            {t.termsOfUse.heroSubtitle}
          </p>
          <p style={{ fontSize: 13, color: light, letterSpacing: "0.03em", marginBottom: 4 }}>
            {t.termsOfUse.heroModel}
          </p>
          <p style={{ fontSize: 13, color: light, letterSpacing: "0.03em" }}>
            {t.termsOfUse.heroEffectiveDate}
          </p>
        </div>
      </header>

      {/* CONTENT */}
      <section style={{ paddingTop: mobile ? 56 : 112, paddingBottom: mobile ? 56 : 112 }}>
        <div style={{ maxWidth: 820, margin: "0 auto", paddingLeft: mobile ? 20 : 24, paddingRight: mobile ? 20 : 24, display: "flex", flexDirection: "column" as const, gap: mobile ? 16 : 20 }}>

          <div ref={s1.ref}><Section number="1." title={t.termsOfUse.s1Title} mobile={mobile} visible={s1.visible}><P>{t.termsOfUse.s1P1}</P><P style={{ marginBottom: 0 }}>{t.termsOfUse.s1P2}</P></Section></div>
          <div ref={s2.ref}><Section number="2." title={t.termsOfUse.s2Title} mobile={mobile} visible={s2.visible}><P>{t.termsOfUse.s2P1}</P><P>{t.termsOfUse.s2P2}</P><P style={{ marginBottom: 0 }}>{t.termsOfUse.s2P3}</P></Section></div>
          <div ref={s3.ref}><Section number="3." title={t.termsOfUse.s3Title} mobile={mobile} visible={s3.visible}><P>{t.termsOfUse.s3P1}</P><P>{t.termsOfUse.s3P2}</P><P style={{ marginBottom: 0 }}>{t.termsOfUse.s3P3}</P></Section></div>
          <div ref={s4.ref}><Section number="4." title={t.termsOfUse.s4Title} mobile={mobile} visible={s4.visible}><P>{t.termsOfUse.s4P1}</P><Bullet items={[t.termsOfUse.s4Li1, t.termsOfUse.s4Li2, t.termsOfUse.s4Li3, t.termsOfUse.s4Li4]} /><P style={{ marginBottom: 0 }}>{t.termsOfUse.s4P2}</P></Section></div>
          <div ref={s5.ref}><Section number="5." title={t.termsOfUse.s5Title} mobile={mobile} visible={s5.visible}><P>{t.termsOfUse.s5P1}</P><Bullet items={[t.termsOfUse.s5Li1, t.termsOfUse.s5Li2, t.termsOfUse.s5Li3, t.termsOfUse.s5Li4]} /><P style={{ marginBottom: 0 }}>{t.termsOfUse.s5P2}</P></Section></div>
          <div ref={s6.ref}><Section number="6." title={t.termsOfUse.s6Title} mobile={mobile} visible={s6.visible}><P>{t.termsOfUse.s6P1}</P><P>{t.termsOfUse.s6P2}</P><P>{t.termsOfUse.s6P3}</P><P style={{ marginBottom: 0 }}>{t.termsOfUse.s6P4}</P></Section></div>
          <div ref={s7.ref}><Section number="7." title={t.termsOfUse.s7Title} mobile={mobile} visible={s7.visible}><P>{t.termsOfUse.s7P1}</P><P>{t.termsOfUse.s7P2}</P><Bullet items={[t.termsOfUse.s7Li1, t.termsOfUse.s7Li2]} /><P>{t.termsOfUse.s7P3}</P><P>{t.termsOfUse.s7P4}</P><P style={{ marginBottom: 0 }}>{t.termsOfUse.s7P5}</P></Section></div>
          <div ref={s8.ref}><Section number="8." title={t.termsOfUse.s8Title} mobile={mobile} visible={s8.visible}><P>{t.termsOfUse.s8P1}</P><P>{t.termsOfUse.s8P2}</P><Bullet items={[t.termsOfUse.s8Li1, t.termsOfUse.s8Li2, t.termsOfUse.s8Li3, t.termsOfUse.s8Li4, t.termsOfUse.s8Li5].filter(Boolean)} /><P>{t.termsOfUse.s8P3}</P><P>{t.termsOfUse.s8P4}</P><P style={{ marginBottom: 0 }}>{t.termsOfUse.s8P5}</P></Section></div>
          <div ref={s9.ref}><Section number="9." title={t.termsOfUse.s9Title} mobile={mobile} visible={s9.visible}><P>{t.termsOfUse.s9P1}</P><P>{t.termsOfUse.s9P2}</P><P>{t.termsOfUse.s9P3}</P><Bullet items={[t.termsOfUse.s9Li1, t.termsOfUse.s9Li2, t.termsOfUse.s9Li3, t.termsOfUse.s9Li4, t.termsOfUse.s9Li5]} /><P style={{ marginBottom: 0 }}>{t.termsOfUse.s9P4}</P></Section></div>
          <div ref={s10.ref}><Section number="10." title={t.termsOfUse.s10Title} mobile={mobile} visible={s10.visible}><P>{t.termsOfUse.s10P1}</P><P>{t.termsOfUse.s10P2}</P><P style={{ marginBottom: 0 }}>{t.termsOfUse.s10P3}</P></Section></div>
          <div ref={s11.ref}><Section number="11." title={t.termsOfUse.s11Title} mobile={mobile} visible={s11.visible}><P>{t.termsOfUse.s11P1}</P><P style={{ marginBottom: 0 }}>{t.termsOfUse.s11P2}</P></Section></div>
          <div ref={s12.ref}><Section number="12." title={t.termsOfUse.s12Title} mobile={mobile} visible={s12.visible}><P>{t.termsOfUse.s12P1}</P><P>{t.termsOfUse.s12P2}</P><P>{t.termsOfUse.s12P3}</P><P style={{ marginBottom: 0 }}>{t.termsOfUse.s12P4}</P></Section></div>
          <div ref={s13.ref}><Section number="13." title={t.termsOfUse.s13Title} mobile={mobile} visible={s13.visible}><P>{t.termsOfUse.s13P1}</P><P>{t.termsOfUse.s13P2}</P><Bullet items={[t.termsOfUse.s13Li1, t.termsOfUse.s13Li2, t.termsOfUse.s13Li3, t.termsOfUse.s13Li4]} /><P style={{ marginBottom: 0 }}>{t.termsOfUse.s13P3}</P></Section></div>
          <div ref={s14.ref}><Section number="14." title={t.termsOfUse.s14Title} mobile={mobile} visible={s14.visible}><P>{t.termsOfUse.s14P1}</P><Bullet items={[t.termsOfUse.s14Li1, t.termsOfUse.s14Li2, t.termsOfUse.s14Li3]} /></Section></div>
          <div ref={s15.ref}><Section number="15." title={t.termsOfUse.s15Title} mobile={mobile} visible={s15.visible}><P style={{ marginBottom: 0 }}>{t.termsOfUse.s15P1}</P></Section></div>
          <div ref={s16.ref}><Section number="16." title={t.termsOfUse.s16Title} mobile={mobile} visible={s16.visible}><P>{t.termsOfUse.s16P1}</P><P>{t.termsOfUse.s16P2}</P><P style={{ marginBottom: 0 }}>{t.termsOfUse.s16P3}</P></Section></div>
          <div ref={s17.ref}><Section number="17." title={t.termsOfUse.s17Title} mobile={mobile} visible={s17.visible}><P>{t.termsOfUse.s17P1}</P><P>{t.termsOfUse.s17P2}</P><P style={{ marginBottom: 0 }}>{t.termsOfUse.s17P3}</P></Section></div>
          <div ref={s18.ref}><Section number="18." title={t.termsOfUse.s18Title} mobile={mobile} visible={s18.visible}><P style={{ marginBottom: 0 }}>{t.termsOfUse.s18P1}</P></Section></div>
          <div ref={s19.ref}><Section number="19." title={t.termsOfUse.s19Title} mobile={mobile} visible={s19.visible}><P style={{ marginBottom: 0 }}>{t.termsOfUse.s19P1}</P></Section></div>
          <div ref={s20.ref}><Section number="20." title={t.termsOfUse.s20Title} mobile={mobile} visible={s20.visible}><P>{t.termsOfUse.s20P1}</P><P>{t.termsOfUse.s20P2}</P><P>{t.termsOfUse.s20P3}</P><P style={{ marginBottom: 0 }}>{t.termsOfUse.s20P4}</P></Section></div>

        </div>
      </section>

      {/* FOOTER */}
      <section style={{ backgroundColor: C.navy, paddingTop: mobile ? 56 : 80, paddingBottom: mobile ? 56 : 80, paddingLeft: mobile ? 20 : 24, paddingRight: mobile ? 20 : 24, position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", top: "50%", left: "50%", width: 400, height: 400, transform: "translate(-50%, -50%)", borderRadius: "50%", background: `radial-gradient(circle, ${C.purple}06 0%, transparent 70%)`, pointerEvents: "none" }} />
        <div style={{ maxWidth: 600, margin: "0 auto", textAlign: "center", position: "relative", zIndex: 1 }}>
          <div style={{ fontSize: mobile ? 24 : 32, fontWeight: 600, color: C.navy, letterSpacing: "-0.02em", lineHeight: 1.15, marginBottom: 12 }}>
            {t.termsOfUse.closingBrand}
          </div>
          <p style={{ fontSize: 14, color: light, lineHeight: 1.6, marginBottom: 16 }}>
            {t.termsOfUse.closingSubtitle}
          </p>
          <p style={{ fontSize: 12, color: light, letterSpacing: "0.04em" }}>
            {t.termsOfUse.closingPowered}
          </p>
        </div>
      </section>
    </div>
  );
}
