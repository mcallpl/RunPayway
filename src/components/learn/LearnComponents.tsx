"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";

/* ================================================================ */
/* DESIGN SYSTEM — /learn/ institutional layer                       */
/* ================================================================ */

export const L = {
  navy: "#0E1A2B",
  purple: "#4B3FAE",
  teal: "#1F6D7A",
  sand: "#F4F1EA",
  white: "#FFFFFF",
  text: "#0E1A2B",
  textSecondary: "#5E6873",
  textMuted: "#7B848E",
  border: "rgba(14,26,43,0.08)",
  divider: "rgba(14,26,43,0.06)",
  panelFill: "#F8F6F1",
};

const mono = '"SF Mono", "Fira Code", "IBM Plex Mono", "Courier New", monospace';
const maxW = 1120;
const narrowW = 720;

function useMobile(bp = 768) {
  const [m, setM] = useState(false);
  useEffect(() => { const c = () => setM(window.innerWidth <= bp); c(); window.addEventListener("resize", c); return () => window.removeEventListener("resize", c); }, [bp]);
  return m;
}

function useTablet() {
  const [t, setT] = useState(false);
  useEffect(() => { const c = () => setT(window.innerWidth > 768 && window.innerWidth <= 1024); c(); window.addEventListener("resize", c); return () => window.removeEventListener("resize", c); }, []);
  return t;
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

const px = (m: boolean, t?: boolean) => m ? 28 : t ? 56 : 48;


/* ================================================================ */
/* SECTION 1 — HERO                                                  */
/* ================================================================ */

export function LearnHero({ label, title, definition, subtitle, description, slug, cta }: {
  label?: string;
  title: string;
  definition?: string;
  subtitle?: string;
  description?: string;
  slug?: string;
  cta?: { label: string; href: string };
}) {
  const m = useMobile();
  const t = useTablet();

  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": title,
    "description": description || definition || subtitle || "",
    "author": { "@type": "Organization", "name": "RunPayway\u2122 Research" },
    "publisher": { "@type": "Organization", "name": "RunPayway\u2122", "url": "https://peoplestar.com/RunPayway" },
    "dateModified": "2026-04-12",
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      { "@type": "ListItem", "position": 1, "name": "Learn", "item": "https://peoplestar.com/RunPayway/learn" },
      { "@type": "ListItem", "position": 2, "name": title },
    ]
  };

  return (
    <header style={{ backgroundColor: L.sand, paddingTop: m ? 104 : 148, paddingBottom: m ? 56 : 80, paddingLeft: px(m, t), paddingRight: px(m, t) }}>
      <title>{title} | RunPayway™ Learn</title>
      <meta name="description" content={description || definition || subtitle || `${title} — Income stability measurement by RunPayway™`} />
      {slug && <link rel="canonical" href={`https://peoplestar.com/RunPayway/learn/${slug}`} />}
      <meta property="og:title" content={`${title} | RunPayway™`} />
      <meta property="og:description" content={description || definition || subtitle || ""} />
      <meta property="og:type" content="article" />
      {slug && <meta property="og:url" content={`https://peoplestar.com/RunPayway/learn/${slug}`} />}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <div style={{ maxWidth: narrowW, margin: "0 auto" }}>
        {label && <div style={{ fontSize: m ? 13 : 14, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase" as const, color: L.teal, marginBottom: 16 }}>{label}</div>}
        <h1 style={{ fontSize: m ? 30 : 64, fontWeight: 700, lineHeight: 1.1, letterSpacing: "-0.035em", color: L.navy, marginBottom: definition ? 24 : 16 }}>
          {title}
        </h1>
        {definition && (
          <div style={{ padding: m ? "18px 20px" : "22px 28px", borderLeft: `3px solid ${L.teal}`, backgroundColor: L.panelFill, marginBottom: 20 }}>
            <p style={{ fontSize: m ? 16 : 18, fontWeight: 500, lineHeight: 1.6, color: L.navy, margin: 0 }}>{definition}</p>
          </div>
        )}
        {subtitle && <p style={{ fontSize: m ? 16 : 18, fontWeight: 400, lineHeight: 1.6, color: L.textSecondary, marginBottom: cta ? 28 : 0 }}>{subtitle}</p>}
        {cta && (
          <Link href={cta.href} style={{
            display: "inline-flex", alignItems: "center", justifyContent: "center",
            height: 52, padding: "0 28px", borderRadius: 12,
            backgroundColor: L.navy, color: L.white,
            fontSize: 15, fontWeight: 600, textDecoration: "none",
            transition: "opacity 200ms",
          }}>
            {cta.label}
          </Link>
        )}
      </div>
    </header>
  );
}


/* ================================================================ */
/* SECTION 2 — QUICK INSIGHT STRIP                                   */
/* ================================================================ */

export function QuickInsightStrip({ items }: { items: [string, string, string] }) {
  const m = useMobile();
  const t = useTablet();
  return (
    <section style={{ backgroundColor: L.white, borderBottom: `1px solid ${L.divider}`, paddingTop: m ? 32 : 40, paddingBottom: m ? 32 : 40, paddingLeft: px(m, t), paddingRight: px(m, t) }}>
      <div style={{ maxWidth: maxW, margin: "0 auto", display: m ? "block" : "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 32 }}>
        {items.map((item, i) => (
          <div key={i} style={{ display: "flex", gap: 12, alignItems: "flex-start", marginBottom: m ? 16 : 0 }}>
            <div style={{ width: 6, height: 6, borderRadius: "50%", backgroundColor: i === 0 ? L.teal : i === 1 ? L.purple : L.navy, flexShrink: 0, marginTop: 8 }} />
            <p style={{ fontSize: 15, fontWeight: 500, lineHeight: 1.55, color: L.text, margin: 0 }}>{item}</p>
          </div>
        ))}
      </div>
    </section>
  );
}


/* ================================================================ */
/* SECTION 3 — CORE CONTENT                                          */
/* ================================================================ */

export function CoreContent({ sections }: { sections: { heading: string; body: string | React.ReactNode }[] }) {
  const m = useMobile();
  const t = useTablet();
  return (
    <section style={{ backgroundColor: L.white, paddingTop: m ? 56 : 80, paddingBottom: m ? 56 : 80, paddingLeft: px(m, t), paddingRight: px(m, t) }}>
      <div style={{ maxWidth: narrowW, margin: "0 auto" }}>
        {sections.map((s, i) => (
          <div key={i} style={{ marginBottom: i < sections.length - 1 ? (m ? 40 : 56) : 0 }}>
            <h2 style={{ fontSize: m ? 22 : 28, fontWeight: 600, lineHeight: 1.2, letterSpacing: "-0.02em", color: L.navy, marginBottom: 16 }}>{s.heading}</h2>
            {typeof s.body === "string" ? (
              <p style={{ fontSize: 17, fontWeight: 400, lineHeight: 1.75, color: L.textSecondary, margin: 0 }}>{s.body}</p>
            ) : s.body}
          </div>
        ))}
      </div>
    </section>
  );
}

export function P({ children }: { children: React.ReactNode }) {
  return <p style={{ fontSize: 17, fontWeight: 400, lineHeight: 1.75, color: L.textSecondary, marginBottom: 20 }}>{children}</p>;
}


/* ================================================================ */
/* SECTION 4 — RUNPAYWAY SYSTEM BLOCK                                */
/* ================================================================ */

export function SystemBlock() {
  const m = useMobile();
  const t = useTablet();
  return (
    <section style={{ backgroundColor: L.navy, paddingTop: m ? 56 : 80, paddingBottom: m ? 56 : 80, paddingLeft: px(m, t), paddingRight: px(m, t) }}>
      <div style={{ maxWidth: narrowW, margin: "0 auto" }}>
        <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.12em", color: L.teal, marginBottom: 16 }}>HOW RUNPAYWAY™ MEASURES THIS</div>
        <p style={{ fontSize: m ? 17 : 20, fontWeight: 500, lineHeight: 1.6, color: L.sand, marginBottom: 24 }}>
          RunPayway™ uses a fixed scoring model to evaluate income stability. No AI in scoring. No subjective judgment. Same inputs always produce the same result.
        </p>
        <div style={{ display: "flex", flexWrap: "wrap" as const, gap: m ? 12 : 20 }}>
          {["Consistent scoring", "Fixed rules", "Version-locked", "No interpretation"].map((item, i) => (
            <span key={i} style={{ fontSize: 13, fontWeight: 600, color: "rgba(244,241,234,0.50)", padding: "6px 14px", borderRadius: 100, border: "1px solid rgba(244,241,234,0.10)" }}>{item}</span>
          ))}
        </div>
      </div>
    </section>
  );
}


/* ================================================================ */
/* SECTION 5 — VISUAL MODEL (Income Zones)                           */
/* ================================================================ */

export function VisualModel({ protected: prot, recurring, atRisk }: { protected: number; recurring: number; atRisk: number }) {
  const m = useMobile();
  const t = useTablet();
  return (
    <section style={{ backgroundColor: L.panelFill, paddingTop: m ? 48 : 64, paddingBottom: m ? 48 : 64, paddingLeft: px(m, t), paddingRight: px(m, t) }}>
      <div style={{ maxWidth: 560, margin: "0 auto" }}>
        <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.12em", color: L.textMuted, marginBottom: 16 }}>INCOME STRUCTURE</div>
        <div style={{ display: "flex", height: 12, borderRadius: 6, overflow: "hidden", marginBottom: 12 }}>
          <div style={{ width: `${prot}%`, backgroundColor: L.teal }} />
          <div style={{ width: `${recurring}%`, backgroundColor: "#D0A23A" }} />
          <div style={{ width: `${atRisk}%`, backgroundColor: "#C74634" }} />
        </div>
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <span style={{ fontSize: 12, fontWeight: 600, color: L.teal }}>Protected {prot}%</span>
          <span style={{ fontSize: 12, fontWeight: 600, color: "#D0A23A" }}>Recurring {recurring}%</span>
          <span style={{ fontSize: 12, fontWeight: 600, color: "#C74634" }}>At risk {atRisk}%</span>
        </div>
      </div>
    </section>
  );
}


/* ================================================================ */
/* SECTION 6 — SCENARIO / EXAMPLE                                    */
/* ================================================================ */

export function ScenarioBlock({ title, setup, risk, outcome }: {
  title: string;
  setup: string;
  risk: string;
  outcome: string;
}) {
  const m = useMobile();
  const t = useTablet();
  return (
    <section style={{ backgroundColor: L.white, paddingTop: m ? 56 : 80, paddingBottom: m ? 56 : 80, paddingLeft: px(m, t), paddingRight: px(m, t) }}>
      <div style={{ maxWidth: narrowW, margin: "0 auto" }}>
        <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.12em", color: L.purple, marginBottom: 16 }}>SCENARIO</div>
        <h3 style={{ fontSize: m ? 20 : 24, fontWeight: 600, lineHeight: 1.25, color: L.navy, marginBottom: 24 }}>{title}</h3>
        <div style={{ display: "flex", flexDirection: "column" as const, gap: 16 }}>
          {[
            { label: "SETUP", text: setup, color: L.teal },
            { label: "RISK", text: risk, color: "#D0A23A" },
            { label: "OUTCOME", text: outcome, color: "#C74634" },
          ].map((item, i) => (
            <div key={i} style={{ paddingLeft: 20, borderLeft: `3px solid ${item.color}` }}>
              <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.10em", color: item.color, marginBottom: 6 }}>{item.label}</div>
              <p style={{ fontSize: 16, lineHeight: 1.65, color: L.textSecondary, margin: 0 }}>{item.text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}


/* ================================================================ */
/* SECTION 7 — CONTRAST BLOCK                                        */
/* ================================================================ */

export function ContrastBlock({ left, right, explanation }: {
  left: string;
  right: string;
  explanation: string;
}) {
  const m = useMobile();
  const t = useTablet();
  return (
    <section style={{ backgroundColor: L.panelFill, paddingTop: m ? 48 : 64, paddingBottom: m ? 48 : 64, paddingLeft: px(m, t), paddingRight: px(m, t) }}>
      <div style={{ maxWidth: 560, margin: "0 auto", textAlign: "center" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: m ? 16 : 24, marginBottom: 20 }}>
          <span style={{ fontSize: m ? 18 : 22, fontWeight: 600, color: L.navy }}>{left}</span>
          <span style={{ fontSize: 16, fontWeight: 400, color: L.textMuted }}>&ne;</span>
          <span style={{ fontSize: m ? 18 : 22, fontWeight: 600, color: L.navy }}>{right}</span>
        </div>
        <p style={{ fontSize: 16, lineHeight: 1.65, color: L.textSecondary, margin: 0 }}>{explanation}</p>
      </div>
    </section>
  );
}


/* ================================================================ */
/* SECTION 8 — REALITY CHECK                                         */
/* ================================================================ */

export function RealityCheck({ statement }: { statement: string }) {
  const m = useMobile();
  const t = useTablet();
  return (
    <section style={{ backgroundColor: L.navy, paddingTop: m ? 48 : 64, paddingBottom: m ? 48 : 64, paddingLeft: px(m, t), paddingRight: px(m, t) }}>
      <div style={{ maxWidth: narrowW, margin: "0 auto", textAlign: "center" }}>
        <p style={{ fontSize: m ? 20 : 28, fontWeight: 600, lineHeight: 1.3, letterSpacing: "-0.02em", color: L.sand, margin: 0 }}>
          {statement}
        </p>
      </div>
    </section>
  );
}


/* ================================================================ */
/* SECTION 9 — RELATED TOPICS                                        */
/* ================================================================ */

export function RelatedTopics({ links }: { links: { href: string; label: string }[] }) {
  const m = useMobile();
  const t = useTablet();
  return (
    <section style={{ backgroundColor: L.white, paddingTop: m ? 48 : 64, paddingBottom: m ? 48 : 64, paddingLeft: px(m, t), paddingRight: px(m, t), borderTop: `1px solid ${L.divider}` }}>
      <div style={{ maxWidth: narrowW, margin: "0 auto" }}>
        <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.12em", color: L.textMuted, marginBottom: 20 }}>RELATED TOPICS</div>
        <div style={{ display: "flex", flexDirection: "column" as const, gap: 0 }}>
          {links.map((link, i) => (
            <Link key={i} href={link.href} style={{
              display: "flex", alignItems: "center", justifyContent: "space-between",
              padding: "16px 0",
              borderBottom: i < links.length - 1 ? `1px solid ${L.divider}` : "none",
              fontSize: 16, fontWeight: 500, color: L.navy, textDecoration: "none",
              transition: "color 200ms",
            }}>
              {link.label}
              <span style={{ color: L.teal, fontSize: 14 }}>&rarr;</span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}


/* ================================================================ */
/* SECTION 10 — FAQ BLOCK                                            */
/* ================================================================ */

export function LearnFAQ({ items }: { items: { q: string; a: string }[] }) {
  const m = useMobile();
  const t = useTablet();
  const [open, setOpen] = useState<number | null>(null);
  return (
    <section style={{ backgroundColor: L.panelFill, paddingTop: m ? 56 : 80, paddingBottom: m ? 56 : 80, paddingLeft: px(m, t), paddingRight: px(m, t) }}>
      <div style={{ maxWidth: narrowW, margin: "0 auto" }}>
        <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.12em", color: L.textMuted, marginBottom: 24 }}>FREQUENTLY ASKED QUESTIONS</div>
        {items.map((item, i) => (
          <div key={i} style={{ borderBottom: `1px solid ${L.divider}` }}>
            <button onClick={() => setOpen(open === i ? null : i)} style={{
              width: "100%", display: "flex", justifyContent: "space-between", alignItems: "center",
              padding: "18px 0", background: "none", border: "none", cursor: "pointer",
              fontSize: 16, fontWeight: 600, color: L.navy, textAlign: "left" as const,
            }}>
              {item.q}
              <span style={{ fontSize: 18, color: L.textMuted, transform: open === i ? "rotate(45deg)" : "none", transition: "transform 200ms", flexShrink: 0, marginLeft: 12 }}>+</span>
            </button>
            <div style={{ maxHeight: open === i ? 300 : 0, overflow: "hidden", transition: "max-height 300ms ease" }}>
              <p style={{ fontSize: 15, lineHeight: 1.7, color: L.textSecondary, margin: "0 0 18px", paddingRight: 24 }}>{item.a}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}


/* ================================================================ */
/* SECTION 11 — MICRO-CONVERSION BLOCK                               */
/* ================================================================ */

export function MicroConversion({ items }: { items?: { text: string; href: string }[] }) {
  const m = useMobile();
  const t = useTablet();
  const defaultItems = [
    { text: "Get your stability class — free", href: "/begin" },
    { text: "See a sample report", href: "/sample-report" },
  ];
  const displayItems = items && items.length > 0 ? items : defaultItems;
  return (
    <section style={{ backgroundColor: L.white, paddingTop: m ? 48 : 64, paddingBottom: m ? 48 : 64, paddingLeft: px(m, t), paddingRight: px(m, t) }}>
      <div style={{ maxWidth: 560, margin: "0 auto", display: m ? "block" : "flex", gap: 16, justifyContent: "center" }}>
        {displayItems.map((item, i) => (
          <Link key={i} href={item.href} style={{
            display: "flex", alignItems: "center", justifyContent: "center",
            height: 48, padding: "0 24px", borderRadius: 10,
            border: i === 0 ? "none" : `1.5px solid ${L.teal}30`,
            backgroundColor: i === 0 ? L.navy : "transparent",
            fontSize: 14, fontWeight: 600, color: i === 0 ? L.white : L.teal, textDecoration: "none",
            marginBottom: m ? 12 : 0,
            transition: "background-color 200ms, border-color 200ms",
          }}>
            {item.text}
          </Link>
        ))}
      </div>
    </section>
  );
}


/* ================================================================ */
/* SECTION 12 — FINAL CTA                                            */
/* ================================================================ */

/* ================================================================ */
/* SECTION 11b — ABOUT THIS MEASUREMENT                              */
/* ================================================================ */

export function AboutMeasurement() {
  const m = useMobile();
  const t = useTablet();
  return (
    <section style={{ backgroundColor: L.panelFill, paddingTop: m ? 40 : 56, paddingBottom: m ? 40 : 56, paddingLeft: px(m, t), paddingRight: px(m, t), borderTop: `1px solid ${L.divider}` }}>
      <div style={{ maxWidth: narrowW, margin: "0 auto" }}>
        <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.12em", color: L.textMuted, marginBottom: 16 }}>ABOUT THIS MEASUREMENT</div>
        <p style={{ fontSize: 15, lineHeight: 1.7, color: L.textSecondary, margin: "0 0 12px" }}>
          The <strong style={{ color: L.navy }}>Income Stability Score™</strong> is produced by <strong style={{ color: L.navy }}>RunPayway™</strong> using a consistent, version-locked scoring model. It measures <strong style={{ color: L.navy }}>income stability</strong> and <strong style={{ color: L.navy }}>income structure</strong> &mdash; not income amount.
        </p>
        <p style={{ fontSize: 15, lineHeight: 1.7, color: L.textSecondary, margin: 0 }}>
          The system uses <strong style={{ color: L.navy }}>fixed rules</strong> with no AI in scoring and no subjective interpretation. Same inputs always produce the same result. Every assessment is stamped with the model version used.
        </p>
      </div>
    </section>
  );
}


/* ================================================================ */
/* SECTION 12 — FINAL CTA                                            */
/* ================================================================ */

export function LearnCTA({ heading, sub }: { heading?: string; sub?: string }) {
  const m = useMobile();
  const t = useTablet();
  return (
    <>
    <AboutMeasurement />
    <section style={{ backgroundColor: L.navy, paddingTop: m ? 72 : 96, paddingBottom: m ? 72 : 96, paddingLeft: px(m, t), paddingRight: px(m, t) }}>
      <div style={{ maxWidth: 560, margin: "0 auto", textAlign: "center" }}>
        <h2 style={{ fontSize: m ? 24 : 36, fontWeight: 600, lineHeight: 1.15, letterSpacing: "-0.02em", color: L.sand, marginBottom: 16 }}>
          {heading || "See Your Income Stability Class"}
        </h2>
        <p style={{ fontSize: 16, lineHeight: 1.6, color: "rgba(244,241,234,0.50)", marginBottom: 28 }}>
          {sub || "RunPayway\u2122 measures your income structure using fixed rules. See your stability class free \u2014 full report available for $69."}
        </p>
        <Link href="/begin" style={{
          display: "inline-flex", alignItems: "center", justifyContent: "center",
          height: 56, padding: "0 32px", borderRadius: 14,
          backgroundColor: L.white, color: L.navy,
          fontSize: 16, fontWeight: 600, textDecoration: "none",
          transition: "transform 200ms",
        }}>
          Get My Stability Class &mdash; Free
        </Link>
        <p style={{ fontSize: 13, color: "rgba(244,241,234,0.35)", marginTop: 16 }}>
          Free &middot; Full report available for $69
        </p>
      </div>
    </section>
    </>
  );
}


/* ================================================================ */
/* SECTION 13a — AUTHOR BLOCK                                        */
/* ================================================================ */

export function AuthorBlock() {
  return (
    <section style={{ backgroundColor: L.white, borderTop: `1px solid ${L.divider}`, paddingTop: 24, paddingBottom: 24, paddingLeft: 28, paddingRight: 28 }}>
      <div style={{ maxWidth: 720, margin: "0 auto", display: "flex", flexWrap: "wrap" as const, gap: 24, alignItems: "center" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ width: 32, height: 32, borderRadius: "50%", backgroundColor: L.navy, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <span style={{ fontSize: 12, fontWeight: 700, color: L.white }}>RP</span>
          </div>
          <div>
            <div style={{ fontSize: 13, fontWeight: 600, color: L.navy }}>RunPayway™ Research</div>
            <div style={{ fontSize: 11, color: L.textMuted }}>Income Stability Measurement</div>
          </div>
        </div>
        <div style={{ fontSize: 12, color: L.textMuted, display: "flex", gap: 16, flexWrap: "wrap" as const }}>
          <span>Model: RP-2.0</span>
          <span>&middot;</span>
          <span>Fixed scoring methodology</span>
          <span>&middot;</span>
          <span>Educational &mdash; not financial advice</span>
        </div>
      </div>
    </section>
  );
}


/* ================================================================ */
/* SECTION 13b — META FOOTER                                         */
/* ================================================================ */

export function MetaFooter({ updated }: { updated: string }) {
  return (
    <section style={{ backgroundColor: L.white, borderTop: `1px solid ${L.divider}`, paddingTop: 24, paddingBottom: 24, paddingLeft: 28, paddingRight: 28 }}>
      <div style={{ maxWidth: narrowW, margin: "0 auto", display: "flex", flexWrap: "wrap" as const, gap: 16, justifyContent: "center" }}>
        {[
          `Last Updated: ${updated}`,
          "Model: RP-2.0",
          "Not financial advice",
          "Consistent scoring system",
        ].map((item, i) => (
          <span key={i} style={{ fontSize: 12, fontWeight: 500, color: L.textMuted }}>{item}</span>
        ))}
      </div>
    </section>
  );
}


/* ================================================================ */
/* INDUSTRY EXTENSION — Additional sections for industry pages        */
/* ================================================================ */

export function IndustryBlock({ industry, howIncomeWorks, typicalRange, biggestRisk }: {
  industry: string;
  howIncomeWorks: string;
  typicalRange: string;
  biggestRisk: string;
}) {
  const m = useMobile();
  const t = useTablet();
  return (
    <section style={{ backgroundColor: L.white, paddingTop: m ? 56 : 80, paddingBottom: m ? 56 : 80, paddingLeft: px(m, t), paddingRight: px(m, t), borderTop: `1px solid ${L.divider}` }}>
      <div style={{ maxWidth: narrowW, margin: "0 auto" }}>
        <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.12em", color: L.purple, marginBottom: 24 }}>{industry.toUpperCase()} INCOME PROFILE</div>
        {[
          { label: "How Income Works", text: howIncomeWorks, color: L.teal },
          { label: "Typical Stability Range", text: typicalRange, color: L.purple },
          { label: "Biggest Structural Risk", text: biggestRisk, color: "#C74634" },
        ].map((item, i) => (
          <div key={i} style={{ paddingLeft: 20, borderLeft: `3px solid ${item.color}`, marginBottom: i < 2 ? 28 : 0 }}>
            <div style={{ fontSize: 14, fontWeight: 600, color: L.navy, marginBottom: 6 }}>{item.label}</div>
            <p style={{ fontSize: 16, lineHeight: 1.65, color: L.textSecondary, margin: 0 }}>{item.text}</p>
          </div>
        ))}
      </div>
    </section>
  );
}


/* ================================================================ */
/* SCENARIO EXTENSION — Additional sections for scenario pages        */
/* ================================================================ */

export function ScenarioExtension({ setup, riskExposure, disruption, scoreRange, howToFix }: {
  setup: string;
  riskExposure: string;
  disruption: string;
  scoreRange: string;
  howToFix: string;
}) {
  const m = useMobile();
  const t = useTablet();
  return (
    <section style={{ backgroundColor: L.panelFill, paddingTop: m ? 56 : 80, paddingBottom: m ? 56 : 80, paddingLeft: px(m, t), paddingRight: px(m, t) }}>
      <div style={{ maxWidth: narrowW, margin: "0 auto" }}>
        <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.12em", color: L.navy, marginBottom: 24 }}>SCENARIO ANALYSIS</div>
        {[
          { label: "Income Setup", text: setup },
          { label: "Risk Exposure", text: riskExposure },
          { label: "Disruption Event", text: disruption },
          { label: "Estimated Score Range", text: scoreRange },
          { label: "How to Strengthen", text: howToFix },
        ].map((item, i) => (
          <div key={i} style={{ marginBottom: i < 4 ? 24 : 0 }}>
            <div style={{ fontSize: 12, fontWeight: 700, letterSpacing: "0.08em", color: L.textMuted, marginBottom: 6 }}>{item.label.toUpperCase()}</div>
            <p style={{ fontSize: 16, lineHeight: 1.65, color: L.text, margin: 0 }}>{item.text}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
