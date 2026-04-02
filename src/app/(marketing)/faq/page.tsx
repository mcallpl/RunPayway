"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useLanguage } from "@/lib/i18n";
import type { Translations } from "@/lib/i18n/types";
import { C, mono, sans, maxW, canHover } from "@/lib/design-tokens";

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

const gradient = C.navy;

/* ------------------------------------------------------------------ */
/*  FAQ data                                                           */
/* ------------------------------------------------------------------ */

interface FaqItem {
  q: string;
  a: React.ReactNode;
}

interface FaqCategory {
  title: string;
  items: FaqItem[];
}

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

/* ------------------------------------------------------------------ */
/*  Accordion item                                                     */
/* ------------------------------------------------------------------ */

function AccordionItem({
  question,
  children,
  isOpen,
  onToggle,
  mobile,
}: {
  question: string;
  children: React.ReactNode;
  isOpen: boolean;
  onToggle: () => void;
  mobile: boolean;
}) {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      style={{
        background: C.white,
        borderRadius: 12,
        border: `1px solid ${isOpen ? "rgba(75,63,174,0.18)" : C.border}`,
        overflow: "hidden",
        transition: "border-color 220ms ease, box-shadow 220ms ease",
        boxShadow: isOpen ? "0 4px 16px rgba(75,63,174,0.06)" : "0 1px 4px rgba(14,26,43,0.03)",
      }}
    >
      <button
        onClick={onToggle}
        onMouseEnter={() => canHover() && setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          width: "100%",
          padding: mobile ? "16px 20px" : "20px 24px",
          background: hovered && !isOpen ? "rgba(14,26,43,0.015)" : "transparent",
          border: "none",
          cursor: "pointer",
          textAlign: "left",
          transition: "background 180ms ease",
        }}
      >
        <span
          style={{
            fontSize: mobile ? 16 : 18,
            fontWeight: 600,
            color: C.navy,
            lineHeight: 1.4,
            paddingRight: 16,
          }}
        >
          {question}
        </span>
        <span
          style={{
            flexShrink: 0,
            width: 24,
            height: 24,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            transition: "transform 220ms ease",
            transform: isOpen ? "rotate(180deg)" : "rotate(0deg)",
          }}
        >
          <svg width="12" height="7" viewBox="0 0 12 7" fill="none">
            <path d="M1 1L6 6L11 1" stroke={isOpen ? C.purple : C.light} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </span>
      </button>

      {isOpen && (
        <div
          style={{
            padding: mobile ? "0 20px 20px" : "0 24px 24px",
          }}
        >
          <div style={{ height: 1, background: C.border, marginBottom: 16 }} />
          <div className="faq-answer">
            {children}
          </div>
        </div>
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  FAQ Category with animation (hook must be in its own component)    */
/* ------------------------------------------------------------------ */

function FaqCategorySection({
  cat,
  openItems,
  toggleItem,
  mobile,
}: {
  cat: FaqCategory;
  openItems: Record<string, boolean>;
  toggleItem: (key: string) => void;
  mobile: boolean;
}) {
  const catAnim = useInView();
  return (
    <div ref={catAnim.ref}>
      <div
        style={{
          fontSize: 13,
          fontWeight: 600,
          color: C.purple,
          letterSpacing: "0.08em",
          textTransform: "uppercase",
          marginBottom: 18,
          opacity: catAnim.visible ? 1 : 0,
          transform: catAnim.visible ? "translateY(0)" : "translateY(12px)",
          transition: "opacity 600ms ease, transform 600ms ease",
        }}
      >
        {cat.title}
      </div>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 10,
          opacity: catAnim.visible ? 1 : 0,
          transform: catAnim.visible ? "translateY(0)" : "translateY(16px)",
          transition: "opacity 600ms ease 100ms, transform 600ms ease 100ms",
        }}
      >
        {cat.items.map((item, i) => {
          const key = `${cat.title}-${i}`;
          return (
            <AccordionItem
              key={key}
              question={item.q}
              isOpen={!!openItems[key]}
              onToggle={() => toggleItem(key)}
              mobile={mobile}
            >
              {item.a}
            </AccordionItem>
          );
        })}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Page                                                               */
/* ------------------------------------------------------------------ */

export default function FaqPage() {
  const mobile = useMobile();
  const { t } = useLanguage();
  const heroAnim = useInView();
  const [openItems, setOpenItems] = useState<Record<string, boolean>>({});
  const FAQ_CATEGORIES = getFaqCategories(t);

  const toggleItem = (key: string) => {
    setOpenItems((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div style={{ background: C.sand, fontFamily: sans }}>
      {/* Scoped styles for FAQ answer content */}
      <style>{`
        .faq-answer p {
          font-size: 16px;
          color: ${C.muted};
          line-height: 1.65;
          margin-bottom: 10px;
        }
        .faq-answer p:last-child {
          margin-bottom: 0;
        }
        .faq-answer ul {
          padding: 0;
          margin: 0 0 10px;
          list-style: none;
        }
        .faq-answer ul li {
          font-size: 16px;
          color: ${C.muted};
          line-height: 1.65;
          padding-left: 20px;
          position: relative;
        }
        .faq-answer ul li::before {
          content: "";
          position: absolute;
          left: 0;
          top: 11px;
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: ${C.purple};
        }
        .faq-table {
          border-radius: 10px;
          overflow: hidden;
          border: 1px solid ${C.sand};
          margin-bottom: 12px;
        }
        .faq-table-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          padding: 10px 18px;
          font-size: 14px;
        }
        .faq-table-row:nth-child(even) {
          background: ${C.sand};
        }
        .faq-table-row:nth-child(odd):not(.faq-table-header) {
          background: ${C.white};
        }
        .faq-table-header {
          background: ${C.navy} !important;
          color: ${C.sandMuted};
          font-size: 13px;
          font-weight: 600;
          letter-spacing: 0.08em;
          text-transform: uppercase;
        }
        .faq-table-row span:first-child {
          font-weight: 600;
          color: ${C.navy};
        }
        .faq-table-header span:first-child,
        .faq-table-header span:last-child {
          color: ${C.sandMuted};
          font-weight: 600;
        }
        .faq-table-row:not(.faq-table-header) span:last-child {
          color: ${C.muted};
          text-align: right;
        }
        .faq-table-header span:last-child {
          text-align: right;
        }
      `}</style>

      {/* ============================================================ */}
      {/*  Hero                                                        */}
      {/* ============================================================ */}
      <section
        style={{
          backgroundColor: C.navy,
          paddingTop: mobile ? 120 : 180,
          paddingBottom: mobile ? 80 : 120,
          paddingLeft: mobile ? 24 : 40,
          paddingRight: mobile ? 24 : 40,
        }}
      >
        <div
          ref={heroAnim.ref}
          style={{
            maxWidth: maxW,
            margin: "0 auto",
            textAlign: "center",
            opacity: heroAnim.visible ? 1 : 0,
            transform: heroAnim.visible ? "translateY(0)" : "translateY(24px)",
            transition: "opacity 700ms ease, transform 700ms ease",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 12, marginBottom: 28 }}>
            <span style={{ fontSize: 14, fontWeight: 500, letterSpacing: "0.10em", textTransform: "uppercase" as const, color: C.teal }}>
              {t.faqPage.heroTag}
            </span>
            <span style={{ fontSize: 11, fontFamily: mono, fontWeight: 500, color: C.sandLight, padding: "3px 8px", borderRadius: 4, border: `1px solid ${C.sandBorder}` }}>RP-2.0</span>
          </div>

          <h1
            style={{
              fontSize: mobile ? 32 : 48,
              fontWeight: 600,
              fontFamily: sans,
              color: C.sandText,
              letterSpacing: "-0.03em",
              lineHeight: 1.12,
              marginBottom: 20,
            }}
          >
            {t.faqPage.heroTitle}
          </h1>

          <p
            style={{
              fontSize: mobile ? 16 : 18,
              color: C.sandMuted,
              lineHeight: 1.65,
              maxWidth: 600,
              margin: "0 auto",
            }}
          >
            {t.faqPage.heroSubtitle}
          </p>
        </div>
      </section>

      {/* ============================================================ */}
      {/*  FAQ sections                                                */}
      {/* ============================================================ */}
      <section
        style={{
          paddingTop: mobile ? 72 : 120,
          paddingBottom: mobile ? 72 : 120,
        }}
      >
        <div
          className="mx-auto"
          style={{
            maxWidth: 780,
            paddingLeft: mobile ? 24 : 40,
            paddingRight: mobile ? 24 : 40,
            display: "flex",
            flexDirection: "column",
            gap: mobile ? 40 : 56,
          }}
        >
          {FAQ_CATEGORIES.map((cat) => (
              <FaqCategorySection key={cat.title} cat={cat} openItems={openItems} toggleItem={toggleItem} mobile={mobile} />
          ))}
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
          <div style={{ fontSize: mobile ? 22 : 28, fontWeight: 600, fontFamily: sans, color: C.white, letterSpacing: "-0.02em", marginBottom: 8 }}>
            RunPayway™
          </div>
          <div style={{ fontSize: mobile ? 16 : 18, color: C.sandMuted, lineHeight: 1.65, marginBottom: 24 }}>
            {t.faqPage.closingSubtitle}
          </div>
          <p style={{ fontSize: 14, color: C.sandLight, letterSpacing: "0.02em" }}>
            {t.faqPage.poweredBy}
          </p>
        </div>
      </section>
    </div>
  );
}
