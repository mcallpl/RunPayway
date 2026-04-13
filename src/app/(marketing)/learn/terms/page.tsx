"use client";

import Link from "next/link";
import { LearnHero, LearnCTA, MetaFooter, L } from "@/components/learn/LearnComponents";
import { useState, useEffect } from "react";

function useMobile(bp = 768) {
  const [m, setM] = useState(false);
  useEffect(() => {
    const c = () => setM(window.innerWidth <= bp);
    c();
    window.addEventListener("resize", c);
    return () => window.removeEventListener("resize", c);
  }, [bp]);
  return m;
}

const px = (m: boolean) => (m ? 28 : 48);

const terms = [
  {
    term: "Income Stability",
    definition:
      "The degree to which income continues under disruption, based on its structure.",
    href: "/learn/what-is-income-stability",
  },
  {
    term: "Income Structure",
    definition:
      "How income is built — its sources, dependencies, and patterns.",
    href: "/learn/what-is-income-structure",
  },
  {
    term: "Income Risk",
    definition:
      "The likelihood and impact of income disruption based on structural factors.",
    href: "/learn/income-risk-explained",
  },
  {
    term: "Income Continuity",
    definition:
      "The ability of income to persist without active effort.",
    href: "/learn/income-continuity-explained",
  },
  {
    term: "Income Fragility",
    definition:
      "The degree to which income is vulnerable to a single point of failure.",
    href: "/learn/income-fragility-explained",
  },
  {
    term: "Income Concentration",
    definition:
      "The percentage of income dependent on a single source.",
    href: "/learn/income-concentration-risk",
  },
];

const termsSchema = {
  "@context": "https://schema.org",
  "@type": "DefinedTermSet",
  "name": "Income Stability Terms",
  "hasDefinedTerm": [
    { "@type": "DefinedTerm", "name": "Income Stability", "description": "The degree to which income continues under disruption, based on its structure." },
    { "@type": "DefinedTerm", "name": "Income Structure", "description": "How income is built — its sources, dependencies, and patterns." },
    { "@type": "DefinedTerm", "name": "Income Risk", "description": "The likelihood and impact of income disruption based on structural factors." },
    { "@type": "DefinedTerm", "name": "Income Continuity", "description": "The ability of income to persist without active effort." },
    { "@type": "DefinedTerm", "name": "Income Fragility", "description": "The degree to which income is vulnerable to a single point of failure." },
    { "@type": "DefinedTerm", "name": "Income Concentration", "description": "The percentage of income dependent on a single source." },
  ]
};

export default function TermsGlossary() {
  const m = useMobile();

  return (
    <main style={{ backgroundColor: L.white }}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(termsSchema) }} />
      {/* HERO */}
      <LearnHero
        label="GLOSSARY"
        title="Income Stability Terms"
        definition="Key terms used in income stability measurement."
      />

      {/* TERMS LIST */}
      <section
        style={{
          backgroundColor: L.white,
          paddingTop: m ? 56 : 80,
          paddingBottom: m ? 56 : 80,
          paddingLeft: px(m),
          paddingRight: px(m),
        }}
      >
        <div style={{ maxWidth: 720, margin: "0 auto" }}>
          {terms.map((item, i) => (
            <Link
              key={i}
              href={item.href}
              style={{
                display: "block",
                padding: m ? "24px 0" : "28px 0",
                borderBottom:
                  i < terms.length - 1
                    ? `1px solid ${L.divider}`
                    : "none",
                textDecoration: "none",
                transition: "opacity 200ms",
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "flex-start",
                  gap: 16,
                }}
              >
                <div>
                  <div
                    style={{
                      fontSize: m ? 18 : 20,
                      fontWeight: 600,
                      color: L.navy,
                      marginBottom: 6,
                    }}
                  >
                    {item.term}
                  </div>
                  <p
                    style={{
                      fontSize: 15,
                      lineHeight: 1.6,
                      color: L.textSecondary,
                      margin: 0,
                    }}
                  >
                    {item.definition}
                  </p>
                </div>
                <span
                  style={{
                    color: L.teal,
                    fontSize: 14,
                    flexShrink: 0,
                    marginTop: 4,
                  }}
                >
                  &rarr;
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* CTA */}
      <LearnCTA
        heading="Get Your Income Stability Score"
        sub="Know where your income holds — and where it's exposed."
      />

      {/* META FOOTER */}
      <MetaFooter updated="April 2026" />
    </main>
  );
}
