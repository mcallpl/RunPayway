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
  { slug: "income-stability-vs-credit-score", label: "Income Stability vs Credit Score" },
  { slug: "income-stability-vs-income", label: "Income Stability vs Income" },
  { slug: "income-stability-vs-net-worth", label: "Income Stability vs Net Worth" },
  { slug: "what-is-income-structure", label: "What Is Income Structure?" },
  { slug: "income-structure-explained", label: "Income Structure Explained" },
  { slug: "what-makes-income-stable", label: "What Makes Income Stable?" },
  { slug: "what-makes-income-unstable", label: "What Makes Income Unstable?" },
  { slug: "income-risk-explained", label: "Income Risk Explained" },
  { slug: "income-fragility-explained", label: "Income Fragility Explained" },
  { slug: "income-continuity-explained", label: "Income Continuity Explained" },
  { slug: "income-concentration-risk", label: "Income Concentration Risk" },
  { slug: "active-vs-passive-income-stability", label: "Active vs Passive Income Stability" },
  { slug: "recurring-vs-non-recurring-income", label: "Recurring vs Non-Recurring Income" },
  { slug: "predictable-vs-unpredictable-income", label: "Predictable vs Unpredictable Income" },
  { slug: "how-income-breaks-under-pressure", label: "How Income Breaks Under Pressure" },
  { slug: "structural-income-risk-explained", label: "Structural Income Risk Explained" },
  { slug: "income-stability-index", label: "Income Stability Index" },
  { slug: "income-stress-testing-explained", label: "Income Stress Testing Explained" },
  { slug: "income-dependency-explained", label: "Income Dependency Explained" },
  { slug: "how-stable-is-your-income", label: "How Stable Is Your Income?" },
  { slug: "is-my-income-stable", label: "Is My Income Stable?" },
  { slug: "how-to-improve-income-stability", label: "How to Improve Income Stability" },
];

const industrySlugs = [
  { slug: "income-stability-real-estate-agents", label: "Real Estate Agents" },
  { slug: "income-stability-freelancers", label: "Freelancers" },
  { slug: "income-stability-consultants", label: "Consultants" },
  { slug: "income-stability-sales-professionals", label: "Sales Professionals" },
  { slug: "income-stability-insurance-agents", label: "Insurance Agents" },
  { slug: "income-stability-mortgage-brokers", label: "Mortgage Brokers" },
  { slug: "income-stability-lawyers", label: "Lawyers" },
  { slug: "income-stability-doctors", label: "Doctors" },
  { slug: "income-stability-contractors", label: "Contractors" },
  { slug: "income-stability-creators", label: "Creators" },
  { slug: "income-stability-tech-workers", label: "Tech Workers" },
  { slug: "income-stability-small-business-owners", label: "Small Business Owners" },
  { slug: "income-stability-retail-owners", label: "Retail Owners" },
  { slug: "income-stability-hospitality-workers", label: "Hospitality Workers" },
  { slug: "income-stability-transportation-workers", label: "Transportation Workers" },
];

const scenarioSlugs = [
  { slug: "150k-freelancer-one-client", label: "$150K Freelancer — One Client" },
  { slug: "150k-freelancer-five-clients", label: "$150K Freelancer — Five Clients" },
  { slug: "200k-realtor-commission-heavy", label: "$200K Realtor — Commission Heavy" },
  { slug: "200k-realtor-diversified-pipeline", label: "$200K Realtor — Diversified Pipeline" },
  { slug: "consultant-no-contracts-vs-retainers", label: "Consultant — No Contracts vs Retainers" },
  { slug: "sales-rep-base-plus-commission", label: "Sales Rep — Base + Commission" },
  { slug: "business-owner-one-vs-three-sources", label: "Business Owner — 1 vs 3 Sources" },
  { slug: "creator-brand-deals-vs-mixed-income", label: "Creator — Brand Deals vs Mixed Income" },
  { slug: "contractor-project-based-risk", label: "Contractor — Project-Based Risk" },
  { slug: "lawyer-hourly-vs-retainer", label: "Lawyer — Hourly vs Retainer" },
  { slug: "doctor-salary-vs-private-practice", label: "Doctor — Salary vs Private Practice" },
  { slug: "insurance-renewal-vs-new-business", label: "Insurance — Renewal vs New Business" },
  { slug: "mortgage-refi-dependent", label: "Mortgage — Refi Dependent" },
  { slug: "freelancer-no-recurring-income", label: "Freelancer — No Recurring Income" },
  { slug: "freelancer-50-percent-retainer", label: "Freelancer — 50% Retainer" },
  { slug: "real-estate-boom-vs-slow-market", label: "Real Estate — Boom vs Slow Market" },
  { slug: "sales-high-performer-risk", label: "Sales — High Performer Risk" },
  { slug: "consultant-high-income-low-stability", label: "Consultant — High Income, Low Stability" },
  { slug: "creator-viral-income-risk", label: "Creator — Viral Income Risk" },
  { slug: "small-business-seasonal-risk", label: "Small Business — Seasonal Risk" },
  { slug: "multi-income-professional", label: "Multi-Income Professional" },
  { slug: "single-income-earner", label: "Single Income Earner" },
  { slug: "passive-income-illusion", label: "Passive Income Illusion" },
  { slug: "income-drop-40-percent", label: "Income Drop 40%" },
  { slug: "stop-working-30-days", label: "Stop Working 30 Days" },
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
    body: "Same inputs always produce the same score. No AI in scoring. No interpretation.",
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
        cta={{ label: "Get My Score \u2014 Free", href: "/begin" }}
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
          {["Model RP-2.0", "Consistent Rules", "No AI in Scoring", "Version-Locked"].map(
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
          <CategoryColumn title="Core Concepts" items={coreSlugs} m={m} />
          <CategoryColumn title="Industries" items={industrySlugs} m={m} />
          <CategoryColumn title="Real-World Scenarios" items={scenarioSlugs} m={m} />
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

      {/* INDUSTRY SCENARIOS */}
      <IndustryScenarios m={m} />

      {/* PREVENTATIVE MEASUREMENT */}
      <section style={{ backgroundColor: L.white, paddingTop: m ? 56 : 80, paddingBottom: m ? 56 : 80, paddingLeft: px(m), paddingRight: px(m) }}>
        <div style={{ maxWidth: 1120, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: m ? 36 : 48 }}>
            <div style={{ fontSize: m ? 13 : 14, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase" as const, color: L.teal, marginBottom: 16 }}>PREVENTATIVE MEASUREMENT</div>
            <h2 style={{ fontSize: m ? 24 : 36, fontWeight: 600, lineHeight: 1.15, letterSpacing: "-0.02em", color: L.navy, marginBottom: 16 }}>
              Measure before it matters.
            </h2>
            <p style={{ fontSize: m ? 16 : 18, lineHeight: 1.6, color: L.textSecondary, maxWidth: 560, margin: "0 auto" }}>
              Most people discover income risk after a disruption. RunPayway™ measures it before.
            </p>
          </div>

          <div style={{ display: m ? "block" : "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 24, maxWidth: 960, margin: "0 auto 40px" }}>
            {[
              {
                label: "Before a major decision",
                body: "Taking on a mortgage, hiring an employee, or leaving a job? Your Income Stability Score™\u2122 tells you if your income structure can support it.",
                color: L.teal,
              },
              {
                label: "Before a market shift",
                body: "Rate changes, client consolidation, seasonal dips \u2014 know how your income holds before conditions change. Structure determines outcome under pressure.",
                color: "#4B3FAE",
              },
              {
                label: "Before it\u2019s urgent",
                body: "The best time to strengthen your income structure is when things are going well. That\u2019s when you have leverage to negotiate retainers, diversify, and lock forward commitments.",
                color: L.navy,
              },
            ].map((card, i) => (
              <div key={i} style={{
                padding: m ? "24px 24px" : "28px 28px",
                borderLeft: `4px solid ${card.color}`,
                backgroundColor: L.panelFill,
                marginBottom: m ? 16 : 0,
              }}>
                <div style={{ fontSize: 16, fontWeight: 600, color: L.navy, marginBottom: 10 }}>{card.label}</div>
                <p style={{ fontSize: 15, lineHeight: 1.65, color: L.textSecondary, margin: 0 }}>{card.body}</p>
              </div>
            ))}
          </div>

          <p style={{ fontSize: 16, fontWeight: 600, color: L.navy, textAlign: "center", maxWidth: 600, margin: "0 auto" }}>
            RunPayway™ doesn&rsquo;t predict disruption. It measures whether your income is ready for&nbsp;it.
          </p>
        </div>
      </section>

      {/* STRATEGIC VALUE */}
      <section style={{ backgroundColor: L.navy, paddingTop: m ? 56 : 80, paddingBottom: m ? 56 : 80, paddingLeft: px(m), paddingRight: px(m) }}>
        <div style={{ maxWidth: 720, margin: "0 auto" }}>
          <div style={{ fontSize: m ? 13 : 14, fontWeight: 700, letterSpacing: "0.12em", color: L.teal, marginBottom: 16 }}>STRATEGIC APPLICATIONS</div>
          <h2 style={{ fontSize: m ? 24 : 36, fontWeight: 600, lineHeight: 1.15, letterSpacing: "-0.02em", color: "#F4F1EA", marginBottom: 32 }}>
            How RunPayway™ creates strategic advantage.
          </h2>
          <div style={{ display: "flex", flexDirection: "column" as const, gap: 0 }}>
            {[
              { title: "Negotiate from data, not instinct", body: "Your stability score gives you a factual basis for retainer conversations, rate negotiations, and contract terms. Clients respond to structured data differently than they respond to requests." },
              { title: "Identify your weakest income point before it fails", body: "The score pinpoints exactly which dimension is most exposed \u2014 concentration, labor dependence, forward visibility. You fix the right thing first, not the most obvious thing." },
              { title: "Track structural improvement over time", body: "Each reassessment captures a new snapshot. Over 12 months, you can see whether your income structure is strengthening or eroding \u2014 independent of how much you earned." },
              { title: "Make career and business decisions with structural clarity", body: "Should you take on a partner? Leave your job? Raise your rates? The stability score tells you whether your income structure can absorb the transition." },
              { title: "Give advisors and lenders a new data point", body: "Your accountant, financial advisor, and bank see income amount. RunPayway\u2122 gives them income structure. It\u2019s the layer between earning and keeping." },
            ].map((item, i) => (
              <div key={i} style={{ padding: "20px 0", borderBottom: i < 4 ? "1px solid rgba(244,241,234,0.08)" : "none" }}>
                <div style={{ fontSize: 17, fontWeight: 600, color: "#F4F1EA", marginBottom: 8 }}>{item.title}</div>
                <p style={{ fontSize: 15, lineHeight: 1.65, color: "rgba(244,241,234,0.55)", margin: 0 }}>{item.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <LearnCTA
        heading="See Your Stability Class"
        sub="Know where your income holds — and where it's exposed."
      />

      {/* META FOOTER */}
      <MetaFooter updated="April 2026" />
    </main>
  );
}

/* ================================================================ */
/* INDUSTRY SCENARIOS                                                */
/* ================================================================ */

const industryScenarios = [
  { industry: "Real Estate", slug: "income-stability-real-estate-agents", scenario: "Top producer earning $200K through commissions. No recurring revenue, no retainers. Market slows 30%.", score: "25\u201335", risk: "Pipeline dependency", color: "#C74634" },
  { industry: "Freelance / Creative", slug: "income-stability-freelancers", scenario: "Designer earning $95K from 3 clients. Largest client is 50% of income. They don\u2019t renew.", score: "20\u201335", risk: "Client concentration", color: "#C74634" },
  { industry: "Consulting", slug: "income-stability-consultants", scenario: "Management consultant earning $200K from 2 project-based clients. No contracts beyond current quarter.", score: "30\u201345", risk: "Labor dependence", color: "#D0A23A" },
  { industry: "Sales / Brokerage", slug: "income-stability-sales-professionals", scenario: "SaaS rep earning $180K with 60% commission. Quota resets every quarter. Pipeline is 90-day visibility.", score: "25\u201340", risk: "Income persistence", color: "#D0A23A" },
  { industry: "Insurance", slug: "income-stability-insurance-agents", scenario: "Agent earning $200K. Strong new business production masks declining renewal retention rate of 78%.", score: "35\u201355", risk: "Renewal erosion", color: "#D0A23A" },
  { industry: "Mortgage", slug: "income-stability-mortgage-brokers", scenario: "Broker earning $180K. 70% of volume is refinance. Rates rise 200 basis points.", score: "15\u201325", risk: "Rate cycle dependency", color: "#C74634" },
  { industry: "Legal Services", slug: "income-stability-lawyers", scenario: "Litigation partner billing $250K. Top 3 matters carry 65% of revenue. Two conclude simultaneously.", score: "35\u201350", risk: "Matter concentration", color: "#D0A23A" },
  { industry: "Healthcare", slug: "income-stability-doctors", scenario: "Employed physician earning $350K from one hospital system. System restructures compensation model.", score: "40\u201355", risk: "Single employer dependency", color: "#D0A23A" },
  { industry: "Construction / Trades", slug: "income-stability-contractors", scenario: "GC finishing a $400K project. Nothing signed for next quarter. 6-week gap between contracts.", score: "28\u201340", risk: "Forward visibility gap", color: "#D0A23A" },
  { industry: "Media / Entertainment", slug: "income-stability-creators", scenario: "YouTuber earning $120K. 60% from brand deals with no long-term contracts. Algorithm changes.", score: "20\u201335", risk: "Platform dependency", color: "#C74634" },
  { industry: "Technology", slug: "income-stability-tech-workers", scenario: "Senior engineer earning $250K total comp. 40% is RSUs. Company stock drops 50% in a correction.", score: "40\u201355", risk: "Compensation structure risk", color: "#D0A23A" },
  { industry: "Small Business", slug: "income-stability-small-business-owners", scenario: "Marketing agency owner. 3 clients, largest is 55% of revenue. They move to an in-house team.", score: "30\u201345", risk: "Revenue concentration", color: "#D0A23A" },
  { industry: "Retail / E-Commerce", slug: "income-stability-retail-owners", scenario: "Boutique owner earning $140K. 60% of revenue comes from Q4 holiday season. Supply chain delays hit.", score: "30\u201340", risk: "Seasonal concentration", color: "#D0A23A" },
  { industry: "Hospitality", slug: "income-stability-hospitality-workers", scenario: "Restaurant owner earning $160K. 40% from catering revenue. Corporate clients cut event budgets.", score: "25\u201340", risk: "Demand volatility", color: "#D0A23A" },
  { industry: "Transportation", slug: "income-stability-transportation-workers", scenario: "Owner-operator running 70% spot freight. Fuel costs spike 25%. Spot rates drop simultaneously.", score: "30\u201340", risk: "Utilization + cost exposure", color: "#D0A23A" },
  { industry: "Education", slug: "is-my-income-stable", scenario: "Independent trainer earning $90K. Semester-by-semester contracts. One institution doesn\u2019t renew.", score: "28\u201342", risk: "Term-based uncertainty", color: "#D0A23A" },
  { industry: "Manufacturing", slug: "income-stability-index", scenario: "Shop owner with $500K revenue. Largest buyer is 45% of output. They renegotiate terms downward 20%.", score: "35\u201350", risk: "Buyer concentration", color: "#D0A23A" },
  { industry: "Nonprofit", slug: "how-to-improve-income-stability", scenario: "Executive director. 60% of funding from one foundation grant. Grant cycle is annual with no guarantee.", score: "30\u201345", risk: "Funding cycle dependency", color: "#D0A23A" },
  { industry: "Agriculture", slug: "income-dependency-explained", scenario: "Farm operator with $300K revenue. 70% forward-priced through futures. Drought cuts yield 30%.", score: "30\u201345", risk: "Weather + market exposure", color: "#D0A23A" },
];

function IndustryScenarios({ m }: { m: boolean }) {
  const [expanded, setExpanded] = useState<string | null>(null);

  const scenariosSchema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "name": "Income Stability Scenarios by Industry",
    "numberOfItems": industryScenarios.length,
    "itemListElement": industryScenarios.map((s, i) => ({
      "@type": "ListItem",
      "position": i + 1,
      "name": `${s.industry}: ${s.scenario.slice(0, 80)}`,
    })),
  };

  return (
    <section style={{ backgroundColor: L.white, paddingTop: m ? 56 : 80, paddingBottom: m ? 56 : 80, paddingLeft: m ? 28 : 48, paddingRight: m ? 28 : 48 }}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(scenariosSchema) }} />
      <div style={{ maxWidth: 1120, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: m ? 36 : 48 }}>
          <div style={{ fontSize: m ? 13 : 14, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase" as const, color: L.teal, marginBottom: 16 }}>INCOME RISK BY INDUSTRY</div>
          <h2 style={{ fontSize: m ? 24 : 36, fontWeight: 600, lineHeight: 1.15, letterSpacing: "-0.02em", color: L.navy, marginBottom: 16 }}>
            What income risk looks like in your industry.
          </h2>
          <p style={{ fontSize: m ? 16 : 18, lineHeight: 1.6, color: L.textSecondary, maxWidth: 560, margin: "0 auto" }}>
            Every industry has a different income structure. Each scenario below is calibrated to how income actually works in that field.
          </p>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: m ? "1fr" : "1fr 1fr", gap: m ? 12 : 16, maxWidth: 960, margin: "0 auto" }}>
          {industryScenarios.map((s) => {
            const isOpen = expanded === s.industry;
            return (
              <div key={s.industry}
                onClick={() => setExpanded(isOpen ? null : s.industry)}
                style={{
                  padding: m ? "18px 20px" : "22px 24px",
                  borderLeft: `4px solid ${s.color}`,
                  backgroundColor: isOpen ? L.panelFill : L.white,
                  border: `1px solid ${isOpen ? L.teal + "20" : L.divider}`,
                  borderLeftWidth: 4,
                  borderLeftColor: s.color,
                  cursor: "pointer",
                  transition: "background-color 200ms, border-color 200ms",
                }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: isOpen ? 12 : 0 }}>
                  <div style={{ fontSize: 15, fontWeight: 600, color: L.navy }}>{s.industry}</div>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <span style={{ fontSize: 12, fontWeight: 600, fontFamily: '"SF Mono", monospace', color: s.color }}>{s.score}</span>
                    <span style={{ fontSize: 14, color: L.textMuted, transform: isOpen ? "rotate(180deg)" : "none", transition: "transform 200ms" }}>&darr;</span>
                  </div>
                </div>
                {isOpen && (
                  <div>
                    <p style={{ fontSize: 14, lineHeight: 1.6, color: L.textSecondary, margin: "0 0 10px" }}>{s.scenario}</p>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <span style={{ fontSize: 12, fontWeight: 600, color: s.color }}>Primary risk: {s.risk}</span>
                      <Link href={`/learn/${s.slug}`} onClick={(e) => e.stopPropagation()} style={{ fontSize: 13, fontWeight: 600, color: L.teal, textDecoration: "none" }}>
                        Read full analysis &rarr;
                      </Link>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <div style={{ textAlign: "center", marginTop: 32 }}>
          <p style={{ fontSize: 15, fontWeight: 500, color: L.textSecondary }}>
            RunPayway™ is calibrated for <strong style={{ color: L.navy }}>19 industries</strong>. Each scenario uses the Income Stability Score™™ to measure how income structure holds under real-world&nbsp;conditions.
          </p>
        </div>
      </div>
    </section>
  );
}


function CategoryColumn({
  title,
  items,
  m,
}: {
  title: string;
  items: { slug: string; label: string }[];
  m: boolean;
}) {
  const [expanded, setExpanded] = useState(false);
  const visible = expanded ? items : items.slice(0, 8);
  const hasMore = items.length > 8;

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
        {title} ({items.length})
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
        {visible.map((item, i) => (
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
      {hasMore && (
        <button
          onClick={() => setExpanded(!expanded)}
          style={{
            display: "inline-block",
            marginTop: 16,
            fontSize: 14,
            fontWeight: 600,
            color: L.teal,
            background: "none",
            border: "none",
            cursor: "pointer",
            padding: 0,
            fontFamily: "inherit",
          }}
        >
          {expanded ? "Show fewer \u2191" : `See all ${items.length} topics \u2192`}
        </button>
      )}
    </div>
  );
}
