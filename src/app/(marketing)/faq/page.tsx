"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useLanguage } from "@/lib/i18n";
import type { Translations } from "@/lib/i18n/types";
import { C, mono, sans } from "@/lib/design-tokens";

/* ================================================================== */
/* UTILITIES                                                           */
/* ================================================================== */

function useMobile(breakpoint = 768) {
  const [mobile, setMobile] = useState(false);
  useEffect(() => { const c = () => setMobile(window.innerWidth <= breakpoint); c(); window.addEventListener("resize", c); return () => window.removeEventListener("resize", c); }, [breakpoint]);
  return mobile;
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
/* DESIGN TOKENS                                                       */
/* ================================================================== */

const muted = "rgba(14,26,43,0.68)";
const light = "rgba(14,26,43,0.52)";
const border = "#E5E7EB";
const contentW = 1040;

/* ================================================================== */
/* FAQ DATA                                                            */
/* ================================================================== */

interface FaqCategory { title: string; items: { q: string; a: React.ReactNode }[] }

function getFaqCategories(t: Translations): FaqCategory[] { return [
  {
    title: t.faqPage.cat1Title,
    items: [
      { q: t.faqPage.cat1Q1, a: (<><p>{t.faqPage.cat1A1P1}</p><p>{t.faqPage.cat1A1P2}</p><p>{t.faqPage.cat1A1P3}</p></>) },
      { q: t.faqPage.cat1Q2, a: (<><p>{t.faqPage.cat1A2P1}</p><ul><li>{t.faqPage.cat1A2Li1}</li><li>{t.faqPage.cat1A2Li2}</li><li>{t.faqPage.cat1A2Li3}</li><li>{t.faqPage.cat1A2Li4}</li><li>{t.faqPage.cat1A2Li5}</li><li>{t.faqPage.cat1A2Li6}</li></ul><p>{t.faqPage.cat1A2P2}</p></>) },
      { q: t.faqPage.cat1Q3, a: (<><p>{t.faqPage.cat1A3P1}</p><p>{t.faqPage.cat1A3P2}</p><div className="faq-table"><div className="faq-table-row faq-table-header"><span>{t.faqPage.cat1A3ThBand}</span><span>{t.faqPage.cat1A3ThRange}</span></div><div className="faq-table-row"><span>{t.report.limited}</span><span>0–29</span></div><div className="faq-table-row"><span>{t.report.developing}</span><span>30–49</span></div><div className="faq-table-row"><span>{t.report.established}</span><span>50–74</span></div><div className="faq-table-row"><span>{t.report.high}</span><span>75–100</span></div></div><p>{t.faqPage.cat1A3P3}</p></>) },
      { q: t.faqPage.cat1Q4, a: (<><p>{t.faqPage.cat1A4P1}</p><p>{t.faqPage.cat1A4P2}</p><p>{t.faqPage.cat1A4P3}</p></>) },
    ],
  },
  {
    title: t.faqPage.cat2Title,
    items: [
      { q: t.faqPage.cat2Q1, a: (<><p>{t.faqPage.cat2A1P1}</p><p>{t.faqPage.cat2A1P2}</p></>) },
      { q: t.faqPage.cat2Q2, a: (<><p>{t.faqPage.cat2A2P1}</p><p>{t.faqPage.cat2A2P2}</p></>) },
      { q: t.faqPage.cat2Q3, a: (<><p>{t.faqPage.cat2A3P1}</p><p>{t.faqPage.cat2A3P2}</p><p>{t.faqPage.cat2A3P3}</p></>) },
    ],
  },
  {
    title: t.faqPage.cat3Title,
    items: [
      { q: t.faqPage.cat3Q1, a: (<><p>{t.faqPage.cat3A1P1}</p><ul><li>{t.faqPage.cat3A1Li1}</li><li>{t.faqPage.cat3A1Li2}</li><li>{t.faqPage.cat3A1Li3}</li><li>{t.faqPage.cat3A1Li4}</li><li>{t.faqPage.cat3A1Li5}</li><li>{t.faqPage.cat3A1Li6}</li><li>{t.faqPage.cat3A1Li7}</li><li>{t.faqPage.cat3A1Li8}</li></ul><p>{t.faqPage.cat3A1P2}</p></>) },
      { q: t.faqPage.cat3Q2, a: (<><p>{t.faqPage.cat3A2P1}</p><p>{t.faqPage.cat3A2P2}</p><p>{t.faqPage.cat3A2P3}</p></>) },
    ],
  },
  {
    title: t.faqPage.cat4Title,
    items: [
      { q: t.faqPage.cat4Q1, a: (<><p>{t.faqPage.cat4A1P1}</p><p>{t.faqPage.cat4A1P2}</p><p>{t.faqPage.cat4A1P3}</p></>) },
      { q: t.faqPage.cat4Q2, a: (<><p>{t.faqPage.cat4A2P1}</p><p>{t.faqPage.cat4A2P2}</p><p>{t.faqPage.cat4A2P3}</p></>) },
    ],
  },
  {
    title: t.faqPage.cat5Title,
    items: [
      { q: t.faqPage.cat5Q1, a: (<><p>{t.faqPage.cat5A1P1}</p><p>{t.faqPage.cat5A1P2}</p><p>{t.faqPage.cat5A1P3}</p></>) },
      { q: t.faqPage.cat5Q2, a: (<><p>{t.faqPage.cat5A2P1}</p><p>{t.faqPage.cat5A2P2}</p><p>{t.faqPage.cat5A2P3}</p></>) },
    ],
  },
  {
    title: t.faqPage.cat6Title,
    items: [
      { q: t.faqPage.cat6Q1, a: (<><p>{t.faqPage.cat6A1P1}</p><p>{t.faqPage.cat6A1P2}</p></>) },
      { q: t.faqPage.cat6Q2, a: (<><p>{t.faqPage.cat6A2P1}</p><p>{t.faqPage.cat6A2P2}</p></>) },
    ],
  },
  {
    title: t.faqPage.cat7Title,
    items: [
      { q: t.faqPage.cat7Q1, a: (<><p>{t.faqPage.cat7A1P1}</p><p>{t.faqPage.cat7A1P2}</p><p><Link href="/contact" style={{ color: C.purple, fontWeight: 500 }}>{t.faqPage.cat7A1P3}</Link></p></>) },
      { q: t.faqPage.cat7Q2, a: (<><p>{t.faqPage.cat7A2P1}</p><p>{t.faqPage.cat7A2P2}</p><p><Link href="/contact" style={{ color: C.purple, fontWeight: 500 }}>{t.faqPage.cat7A2P3}</Link></p></>) },
      { q: t.faqPage.cat7Q3, a: (<><p>{t.faqPage.cat7A3P1}</p><p>{t.faqPage.cat7A3P2}</p></>) },
      { q: t.faqPage.cat7Q4, a: (<><p>{t.faqPage.cat7A4P1}</p><p>{t.faqPage.cat7A4P2}</p></>) },
      { q: t.faqPage.cat7Q5, a: (<><p>{t.faqPage.cat7A5P1}</p><p>{t.faqPage.cat7A5P2}</p><p><Link href="/contact" style={{ color: C.purple, fontWeight: 500 }}>{t.faqPage.cat7A5P3}</Link></p></>) },
    ],
  },
  {
    title: t.faqPage.cat8Title,
    items: [
      { q: t.faqPage.cat8Q1, a: (<><p>{t.faqPage.cat8A1P1}</p><p>{t.faqPage.cat8A1P2}</p><p><Link href="/contact" style={{ color: C.purple, fontWeight: 500 }}>{t.faqPage.cat8A1P3}</Link></p></>) },
      { q: t.faqPage.cat8Q2, a: (<><p>{t.faqPage.cat8A2P1}</p><p>{t.faqPage.cat8A2P2}</p><p>{t.faqPage.cat8A2P3}</p></>) },
      { q: t.faqPage.cat8Q3, a: (<><p>{t.faqPage.cat8A3P1}</p><p>{t.faqPage.cat8A3P2}</p><p><Link href="/contact" style={{ color: C.purple, fontWeight: 500 }}>{t.faqPage.cat8A3P3}</Link></p></>) },
    ],
  },
]; }


/* ================================================================== */
/* ACCORDION                                                           */
/* ================================================================== */

function AccordionItem({ question, children, isOpen, onToggle, mobile }: { question: string; children: React.ReactNode; isOpen: boolean; onToggle: () => void; mobile: boolean }) {
  return (
    <div style={{
      background: C.white, borderRadius: 14,
      border: `1px solid ${isOpen ? "rgba(75,63,174,0.15)" : border}`,
      overflow: "hidden",
      transition: "border-color 200ms ease",
      boxShadow: isOpen ? "0 2px 12px rgba(75,63,174,0.04)" : "0 1px 3px rgba(14,26,43,0.02)",
    }}>
      <button onClick={onToggle} style={{
        display: "flex", alignItems: "center", justifyContent: "space-between",
        width: "100%", padding: mobile ? "18px 22px" : "22px 28px",
        background: "transparent", border: "none", cursor: "pointer", textAlign: "left",
        transition: "background 180ms ease",
      }}>
        <span style={{ fontSize: mobile ? 16 : 18, fontWeight: 600, color: C.navy, lineHeight: 1.4, paddingRight: 16 }}>{question}</span>
        <span style={{ flexShrink: 0, width: 28, height: 28, borderRadius: 8, backgroundColor: isOpen ? `${C.purple}08` : "rgba(14,26,43,0.03)", display: "flex", alignItems: "center", justifyContent: "center", transition: "transform 200ms ease, background-color 200ms ease", transform: isOpen ? "rotate(180deg)" : "rotate(0deg)" }}>
          <svg width="12" height="7" viewBox="0 0 12 7" fill="none"><path d="M1 1L6 6L11 1" stroke={isOpen ? C.purple : light} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
        </span>
      </button>
      {isOpen && (
        <div style={{ padding: mobile ? "0 22px 22px" : "0 28px 28px" }}>
          <div style={{ height: 1, background: border, marginBottom: 18 }} />
          <div className="faq-answer">{children}</div>
        </div>
      )}
    </div>
  );
}

function FaqCategorySection({ cat, openItems, toggleItem, mobile }: { cat: FaqCategory; openItems: Record<string, boolean>; toggleItem: (key: string) => void; mobile: boolean }) {
  const catAnim = useInView();
  return (
    <div ref={catAnim.ref}>
      <div style={{
        display: "flex", alignItems: "center", gap: 14, marginBottom: 20,
        opacity: catAnim.visible ? 1 : 0, transform: catAnim.visible ? "translateY(0)" : "translateY(10px)",
        transition: "opacity 500ms ease-out, transform 500ms ease-out",
      }}>
        <div style={{ width: 4, height: 24, borderRadius: 2, backgroundColor: C.purple, opacity: 0.30, flexShrink: 0 }} />
        <span style={{ fontSize: 11, fontWeight: 700, color: C.purple, letterSpacing: "0.14em", textTransform: "uppercase" as const }}>{cat.title}</span>
        <div style={{ height: 1, flex: 1, background: `linear-gradient(90deg, ${C.purple}10 0%, transparent 100%)` }} />
      </div>
      <div style={{
        display: "flex", flexDirection: "column" as const, gap: 10,
        opacity: catAnim.visible ? 1 : 0, transform: catAnim.visible ? "translateY(0)" : "translateY(10px)",
        transition: "opacity 500ms ease-out 100ms, transform 500ms ease-out 100ms",
      }}>
        {cat.items.map((item, i) => {
          const key = `${cat.title}-${i}`;
          return <AccordionItem key={key} question={item.q} isOpen={!!openItems[key]} onToggle={() => toggleItem(key)} mobile={mobile}>{item.a}</AccordionItem>;
        })}
      </div>
    </div>
  );
}


/* ================================================================== */
/* PAGE                                                                */
/* ================================================================== */

export default function FaqPage() {
  const mobile = useMobile();
  const { t } = useLanguage();
  const heroAnim = useInView();
  const [openItems, setOpenItems] = useState<Record<string, boolean>>({});
  const FAQ_CATEGORIES = getFaqCategories(t);
  const toggleItem = (key: string) => { setOpenItems((prev) => ({ ...prev, [key]: !prev[key] })); };

  return (
    <div style={{ background: "#FAFAFA", fontFamily: sans }}>
      <style>{`
        .faq-answer p { font-size: 16px; color: ${muted}; line-height: 1.65; margin-bottom: 10px; }
        .faq-answer p:last-child { margin-bottom: 0; }
        .faq-answer ul { padding: 0; margin: 0 0 10px; list-style: none; }
        .faq-answer ul li { font-size: 16px; color: ${muted}; line-height: 1.65; padding-left: 20px; position: relative; }
        .faq-answer ul li::before { content: ""; position: absolute; left: 0; top: 11px; width: 5px; height: 5px; border-radius: 50%; background: ${C.teal}; }
        .faq-table { border-radius: 12px; overflow: hidden; border: 1px solid ${border}; margin-bottom: 12px; }
        .faq-table-row { display: grid; grid-template-columns: 1fr 1fr; padding: 12px 20px; font-size: 14px; }
        .faq-table-row:nth-child(even) { background: #FAFAFA; }
        .faq-table-row:nth-child(odd):not(.faq-table-header) { background: ${C.white}; }
        .faq-table-header { background: ${C.navy} !important; color: rgba(244,241,234,0.65); font-size: 12px; font-weight: 600; letter-spacing: 0.10em; text-transform: uppercase; }
        .faq-table-row span:first-child { font-weight: 600; color: ${C.navy}; }
        .faq-table-header span:first-child, .faq-table-header span:last-child { color: rgba(244,241,234,0.65); font-weight: 600; }
        .faq-table-row:not(.faq-table-header) span:last-child { color: ${muted}; text-align: right; font-family: ${mono}; }
        .faq-table-header span:last-child { text-align: right; }
      `}</style>

      {/* HERO */}
      <header style={{ backgroundColor: C.white, position: "relative", overflow: "hidden", paddingTop: mobile ? 48 : 100, paddingBottom: mobile ? 48 : 80, paddingLeft: mobile ? 20 : 24, paddingRight: mobile ? 20 : 24 }}>
        <div style={{ position: "absolute", top: "-20%", right: "-10%", width: 600, height: 600, borderRadius: "50%", background: `radial-gradient(circle, ${C.purple}06 0%, transparent 70%)`, pointerEvents: "none" }} />
        <div ref={heroAnim.ref} style={{ maxWidth: 780, margin: "0 auto", textAlign: "center", position: "relative", zIndex: 1, opacity: heroAnim.visible ? 1 : 0, transform: heroAnim.visible ? "translateY(0)" : "translateY(10px)", transition: "opacity 500ms ease-out, transform 500ms ease-out" }}>
          <div style={{ fontSize: 11, fontWeight: 500, letterSpacing: "0.14em", textTransform: "uppercase" as const, color: C.teal, marginBottom: 20 }}>
            {t.faqPage.heroTag}
          </div>
          <h1 style={{ fontSize: mobile ? 36 : 52, fontWeight: 600, color: C.navy, letterSpacing: "-0.03em", lineHeight: 1.08, marginBottom: 20 }}>
            {t.faqPage.heroTitle}
          </h1>
          <p style={{ fontSize: 16, color: muted, lineHeight: 1.65, maxWidth: 560, margin: "0 auto" }}>
            {t.faqPage.heroSubtitle}
          </p>
        </div>
      </header>

      {/* FAQ SECTIONS */}
      <section style={{ paddingTop: mobile ? 56 : 112, paddingBottom: mobile ? 56 : 112 }}>
        <div style={{ maxWidth: 820, margin: "0 auto", paddingLeft: mobile ? 20 : 24, paddingRight: mobile ? 20 : 24, display: "flex", flexDirection: "column" as const, gap: mobile ? 44 : 64 }}>
          {FAQ_CATEGORIES.map((cat) => (
            <FaqCategorySection key={cat.title} cat={cat} openItems={openItems} toggleItem={toggleItem} mobile={mobile} />
          ))}
        </div>
      </section>

      {/* FINAL CTA */}
      <section style={{ backgroundColor: C.navy, paddingTop: mobile ? 72 : 120, paddingBottom: mobile ? 72 : 120, paddingLeft: mobile ? 20 : 24, paddingRight: mobile ? 20 : 24, position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", top: "50%", left: "50%", width: 500, height: 500, transform: "translate(-50%, -50%)", borderRadius: "50%", background: `radial-gradient(circle, ${C.purple}06 0%, transparent 70%)`, pointerEvents: "none" }} />
        <div style={{ maxWidth: 600, margin: "0 auto", textAlign: "center", position: "relative", zIndex: 1 }}>
          <div style={{ fontSize: mobile ? 28 : 40, fontWeight: 500, color: C.sand, letterSpacing: "-0.02em", lineHeight: 1.15, marginBottom: 16 }}>
            {t.faqPage.closingSubtitle}
          </div>
          <p style={{ fontSize: 14, color: "rgba(244,241,234,0.45)", letterSpacing: "0.04em", marginBottom: 28 }}>
            {t.faqPage.poweredBy}
          </p>
          <Link href="/pricing" style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", height: 52, padding: "0 40px", borderRadius: 12, backgroundColor: C.white, color: C.navy, fontSize: 16, fontWeight: 600, textDecoration: "none", transition: "background-color 200ms, box-shadow 200ms", boxShadow: "0 2px 12px rgba(244,241,234,0.10)" }}
            onMouseEnter={e => { e.currentTarget.style.backgroundColor = "#E8E5DE"; e.currentTarget.style.boxShadow = "0 4px 20px rgba(244,241,234,0.15)"; }}
            onMouseLeave={e => { e.currentTarget.style.backgroundColor = C.white; e.currentTarget.style.boxShadow = "0 2px 12px rgba(244,241,234,0.10)"; }}>
            Start Your Free Assessment
          </Link>
          <p style={{ fontSize: 13, color: "rgba(244,241,234,0.45)", marginTop: 14, letterSpacing: "0.03em" }}>Under 2 minutes &bull; Instant result &bull; Private by default</p>
        </div>
      </section>
    </div>
  );
}
