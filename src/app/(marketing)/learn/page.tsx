"use client";

import Link from "next/link";
import { LearnHero, LearnCTA, MetaFooter, RealityCheck, L } from "@/components/learn/LearnComponents";
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

const coreSlugs = [
  { slug: "what-is-income-stability", label: "What Is Income Stability?" },
  { slug: "income-stability-explained", label: "Income Stability Explained" },
  { slug: "how-to-measure-income-stability", label: "How to Measure Income Stability" },
  { slug: "income-stability-vs-credit-score", label: "Income Stability vs. Credit Score" },
  { slug: "what-is-income-structure", label: "What Is Income Structure?" },
  { slug: "what-makes-income-stable", label: "What Makes Income Stable?" },
  { slug: "income-risk-explained", label: "Income Risk Explained" },
  { slug: "how-to-improve-income-stability", label: "How to Improve Income Stability" },
];

const industrySlugs = [
  { slug: "income-stability-real-estate-agents", label: "Real Estate Agents" },
  { slug: "income-stability-freelancers", label: "Freelancers" },
  { slug: "income-stability-consultants", label: "Consultants" },
  { slug: "income-stability-sales-professionals", label: "Sales Professionals" },
  { slug: "income-stability-insurance-agents", label: "Insurance Agents" },
  { slug: "income-stability-lawyers", label: "Lawyers" },
  { slug: "income-stability-contractors", label: "Contractors" },
  { slug: "income-stability-tech-workers", label: "Tech Workers" },
];

const scenarioSlugs = [
  { slug: "150k-freelancer-one-client", label: "$150K Freelancer, One Client" },
  { slug: "150k-freelancer-five-clients", label: "$150K Freelancer, Five Clients" },
  { slug: "200k-realtor-commission-heavy", label: "$200K Realtor, Commission-Heavy" },
  { slug: "consultant-no-contracts-vs-retainers", label: "Consultant: No Contracts vs. Retainers" },
  { slug: "sales-rep-base-plus-commission", label: "Sales Rep: Base + Commission" },
  { slug: "business-owner-one-vs-three-sources", label: "Business Owner: 1 vs. 3 Sources" },
  { slug: "contractor-project-based-risk", label: "Contractor: Project-Based Risk" },
  { slug: "freelancer-no-recurring-income", label: "Freelancer: No Recurring Income" },
];

const steps = [
  {
    number: "01",
    title: "Describe your income",
    body: "Answer a few questions about how your income arrives, what it depends on, and how it repeats.",
  },
  {
    number: "02",
    title: "Six dimensions scored",
    body: "The model evaluates persistence, diversification, forward visibility, concentration, variability, and labor dependence.",
  },
  {
    number: "03",
    title: "One consistent result",
    body: "Same inputs always produce the same score. No AI. No interpretation.",
  },
];

export default function LearnHub() {
  const m = useMobile();

  return (
    <main style={{ backgroundColor: L.white }}>
      {/* HERO */}
      <LearnHero
        label="LEARN"
        title="Income Stability & Structure"
        definition="Income Stability is the degree to which income continues under disruption, based on its structure — not its amount."
        cta={{ label: "Get Your Income Stability Score", href: "/begin" }}
      />

      {/* TRUST STRIP */}
      <section
        style={{
          backgroundColor: L.white,
          borderBottom: `1px solid ${L.divider}`,
          paddingTop: m ? 20 : 24,
          paddingBottom: m ? 20 : 24,
          paddingLeft: px(m),
          paddingRight: px(m),
        }}
      >
        <div
          style={{
            maxWidth: 1120,
            margin: "0 auto",
            display: "flex",
            flexWrap: "wrap",
            gap: m ? 12 : 24,
            justifyContent: "center",
          }}
        >
          {["Model RP-2.0", "Consistent Rules", "No AI Interpretation", "Version-Locked"].map(
            (item, i) => (
              <span
                key={i}
                style={{
                  fontSize: 12,
                  fontWeight: 600,
                  color: L.textMuted,
                  letterSpacing: "0.04em",
                }}
              >
                {item}
              </span>
            )
          )}
        </div>
      </section>

      {/* CATEGORY GRID */}
      <section
        style={{
          backgroundColor: L.white,
          paddingTop: m ? 56 : 80,
          paddingBottom: m ? 56 : 80,
          paddingLeft: px(m),
          paddingRight: px(m),
        }}
      >
        <div
          style={{
            maxWidth: 1120,
            margin: "0 auto",
            display: m ? "block" : "grid",
            gridTemplateColumns: "1fr 1fr 1fr",
            gap: 48,
          }}
        >
          {/* Core Concepts */}
          <CategoryColumn
            title="Core Concepts"
            total={25}
            items={coreSlugs}
            m={m}
          />

          {/* Industries */}
          <CategoryColumn
            title="Industries"
            total={15}
            items={industrySlugs}
            m={m}
          />

          {/* Real-World Scenarios */}
          <CategoryColumn
            title="Real-World Scenarios"
            total={25}
            items={scenarioSlugs}
            m={m}
          />
        </div>
      </section>

      {/* DIVIDER */}
      <div style={{ height: 1, backgroundColor: L.divider }} />

      {/* HOW IT WORKS */}
      <section
        style={{
          backgroundColor: L.panelFill,
          paddingTop: m ? 56 : 80,
          paddingBottom: m ? 56 : 80,
          paddingLeft: px(m),
          paddingRight: px(m),
        }}
      >
        <div style={{ maxWidth: 720, margin: "0 auto" }}>
          <div
            style={{
              fontSize: 11,
              fontWeight: 700,
              letterSpacing: "0.12em",
              color: L.textMuted,
              marginBottom: 32,
              textTransform: "uppercase",
            }}
          >
            HOW IT WORKS
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 36 }}>
            {steps.map((step, i) => (
              <div key={i} style={{ display: "flex", gap: 20, alignItems: "flex-start" }}>
                <div
                  style={{
                    fontSize: 13,
                    fontWeight: 700,
                    color: L.teal,
                    fontFamily:
                      '"SF Mono", "Fira Code", "IBM Plex Mono", "Courier New", monospace',
                    flexShrink: 0,
                    marginTop: 2,
                  }}
                >
                  {step.number}
                </div>
                <div>
                  <div
                    style={{
                      fontSize: m ? 18 : 20,
                      fontWeight: 600,
                      color: L.navy,
                      marginBottom: 8,
                    }}
                  >
                    {step.title}
                  </div>
                  <p
                    style={{
                      fontSize: 16,
                      lineHeight: 1.65,
                      color: L.textSecondary,
                      margin: 0,
                    }}
                  >
                    {step.body}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FEATURED INSIGHT */}
      <RealityCheck statement="Most income isn't unstable because it's low. It's unstable because it's concentrated." />

      {/* FINAL CTA */}
      <LearnCTA
        heading="Get Your Income Stability Score"
        sub="Know where your income holds — and where it's exposed."
      />

      {/* META FOOTER */}
      <MetaFooter updated="April 2026" />
    </main>
  );
}

function CategoryColumn({
  title,
  total,
  items,
  m,
}: {
  title: string;
  total: number;
  items: { slug: string; label: string }[];
  m: boolean;
}) {
  return (
    <div style={{ marginBottom: m ? 40 : 0 }}>
      <div
        style={{
          fontSize: 11,
          fontWeight: 700,
          letterSpacing: "0.12em",
          color: L.textMuted,
          textTransform: "uppercase",
          marginBottom: 20,
        }}
      >
        {title}
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
        {items.map((item, i) => (
          <Link
            key={i}
            href={`/learn/${item.slug}`}
            style={{
              display: "block",
              padding: "12px 0",
              borderBottom: `1px solid ${L.divider}`,
              fontSize: 15,
              fontWeight: 500,
              color: L.navy,
              textDecoration: "none",
              transition: "color 200ms",
            }}
          >
            {item.label}
          </Link>
        ))}
      </div>
      <Link
        href="/learn"
        style={{
          display: "inline-block",
          marginTop: 16,
          fontSize: 14,
          fontWeight: 600,
          color: L.teal,
          textDecoration: "none",
        }}
      >
        See all {total} topics &rarr;
      </Link>
    </div>
  );
}
