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

export default function LearnHub() {
  const m = useMobile();
  const [selectedPath, setSelectedPath] = useState<string | null>(null);

  return (
    <main style={{ backgroundColor: L.white }}>
      {/* HERO */}
      <section style={{ backgroundColor: "#F4F1EA", paddingTop: m ? 80 : 120, paddingBottom: m ? 60 : 80, paddingLeft: px(m), paddingRight: px(m) }}>
        <div style={{ maxWidth: 720, margin: "0 auto", textAlign: "center" }}>
          <div style={{ fontSize: m ? 13 : 14, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: L.teal, marginBottom: 16 }}>
            LEARN
          </div>
          <h1 style={{ fontSize: m ? 32 : 56, fontWeight: 700, lineHeight: 1.1, letterSpacing: "-0.035em", color: L.navy, marginBottom: 20 }}>
            See how your income actually works
          </h1>
          <p style={{ fontSize: m ? 16 : 18, lineHeight: 1.6, color: L.textSecondary, marginBottom: 0 }}>
            Income stability isn't about how much you make. It's about how it's built. Understand your structure, spot the gaps, and know what to strengthen.
          </p>
        </div>
      </section>

      {/* START HERE: GUIDED PATHS */}
      <section style={{ backgroundColor: L.white, paddingTop: m ? 56 : 80, paddingBottom: m ? 56 : 80, paddingLeft: px(m), paddingRight: px(m) }}>
        <div style={{ maxWidth: 1120, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: m ? 40 : 56 }}>
            <h2 style={{ fontSize: m ? 24 : 36, fontWeight: 600, lineHeight: 1.15, color: L.navy, marginBottom: 16 }}>
              Start here. Pick your situation.
            </h2>
            <p style={{ fontSize: m ? 15 : 16, color: L.textSecondary, maxWidth: 560, margin: "0 auto" }}>
              We'll show you the most important concepts for your specific income type.
            </p>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: m ? "1fr" : "repeat(2, 1fr)", gap: m ? 16 : 24, maxWidth: 960, margin: "0 auto", marginBottom: m ? 40 : 56 }}>
            {[
              {
                id: "freelancer",
                title: "Freelancer",
                description: "Project-based work, multiple clients, varying monthly income",
                guides: [
                  { slug: "recurring-vs-non-recurring-income", label: "Project vs. recurring income" },
                  { slug: "income-concentration-risk", label: "Client concentration risk" },
                  { slug: "how-to-improve-income-stability", label: "How to improve stability" },
                  { slug: "predictable-vs-unpredictable-income", label: "Making income predictable" },
                  { slug: "income-stability-freelancers", label: "Freelancer patterns and solutions" },
                ],
              },
              {
                id: "consultant",
                title: "Consultant or Service Provider",
                description: "Higher rates, longer engagements, landing new clients is critical",
                guides: [
                  { slug: "forward-visibility-explained", label: "Forward visibility and why it matters" },
                  { slug: "consultant-no-contracts-vs-retainers", label: "Contracts vs. handshake agreements" },
                  { slug: "recurring-revenue-for-service-businesses", label: "Building recurring revenue" },
                  { slug: "income-stability-consultants", label: "Consultant income patterns" },
                  { slug: "how-to-improve-income-stability", label: "Structural improvements that work" },
                ],
              },
              {
                id: "commission",
                title: "Commission or Sales-Based",
                description: "Variable income, quota resets, pipeline-dependent revenue",
                guides: [
                  { slug: "hidden-risk-in-commission-income", label: "Why commission income is fragile" },
                  { slug: "how-income-breaks-under-pressure", label: "How income breaks under pressure" },
                  { slug: "income-dependency-explained", label: "Dependency on conditions you don't control" },
                  { slug: "income-stability-sales-professionals", label: "Sales-based income patterns" },
                  { slug: "recurring-vs-non-recurring-income", label: "Adding recurring to commission" },
                ],
              },
              {
                id: "business",
                title: "Business Owner",
                description: "Multiple revenue streams, team complexity, growth challenges",
                guides: [
                  { slug: "income-concentration-risk", label: "Client concentration and diversification" },
                  { slug: "recurring-revenue-for-service-businesses", label: "Building recurring revenue" },
                  { slug: "small-business-seasonal-risk", label: "Seasonal patterns and cash flow" },
                  { slug: "income-stability-small-business-owners", label: "Business owner scenarios" },
                  { slug: "how-to-improve-income-stability", label: "Structural improvements for growth" },
                ],
              },
            ].map((path) => (
              <div
                key={path.id}
                onClick={() => setSelectedPath(selectedPath === path.id ? null : path.id)}
                style={{
                  padding: m ? "24px" : "32px",
                  border: `1px solid ${selectedPath === path.id ? L.teal : L.divider}`,
                  borderRadius: 12,
                  cursor: "pointer",
                  transition: "all 200ms",
                  backgroundColor: selectedPath === path.id ? "rgba(31,109,122,0.04)" : L.white,
                  boxShadow: selectedPath === path.id ? "0 4px 12px rgba(31,109,122,0.08)" : "none",
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 8 }}>
                  <h3 style={{ fontSize: m ? 17 : 18, fontWeight: 600, color: L.navy, margin: 0 }}>
                    {path.title}
                  </h3>
                  <span style={{ fontSize: 18, color: L.teal, transition: "transform 200ms", transform: selectedPath === path.id ? "rotate(180deg)" : "none", flexShrink: 0 }}>
                    ▼
                  </span>
                </div>
                <p style={{ fontSize: 14, color: L.textSecondary, margin: "0 0 0 0" }}>
                  {path.description}
                </p>
                {selectedPath === path.id && (
                  <div style={{ marginTop: 20, paddingTop: 20, borderTop: `1px solid ${L.divider}` }}>
                    <div style={{ fontSize: 12, fontWeight: 600, color: L.teal, letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 16 }}>
                      Next steps:
                    </div>
                    <div style={{ display: "flex", flexDirection: "column", gap: m ? 10 : 12 }}>
                      {path.guides.map((guide) => (
                        <Link
                          key={guide.slug}
                          href={`/learn/${guide.slug}`}
                          style={{
                            fontSize: 14,
                            color: L.navy,
                            textDecoration: "none",
                            display: "flex",
                            alignItems: "flex-start",
                            gap: 10,
                            padding: "8px 0",
                            transition: "color 200ms",
                          }}
                          onMouseEnter={(e) => { e.currentTarget.style.color = L.teal; }}
                          onMouseLeave={(e) => { e.currentTarget.style.color = L.navy; }}
                        >
                          <span style={{ color: L.teal, flexShrink: 0, marginTop: 2 }}>→</span>
                          <span>{guide.label}</span>
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FEATURED INSIGHT */}
      <RealityCheck statement="Most income isn't unstable because it's low. It's unstable because it's concentrated." />

      {/* INDUSTRY SCENARIOS */}
      <IndustryScenarios m={m} />

      {/* CORE CONCEPTS - STREAMLINED */}
      <section style={{ backgroundColor: L.white, paddingTop: m ? 56 : 80, paddingBottom: m ? 56 : 80, paddingLeft: px(m), paddingRight: px(m) }}>
        <div style={{ maxWidth: 1120, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: m ? 40 : 56 }}>
            <div style={{ fontSize: m ? 13 : 14, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: L.teal, marginBottom: 16 }}>
              FOUNDATIONAL CONCEPTS
            </div>
            <h2 style={{ fontSize: m ? 24 : 36, fontWeight: 600, lineHeight: 1.15, color: L.navy, marginBottom: 16 }}>
              Build your understanding
            </h2>
            <p style={{ fontSize: m ? 15 : 16, color: L.textSecondary, maxWidth: 560, margin: "0 auto" }}>
              Start with the basics, then explore deeper based on what interests you.
            </p>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: m ? "1fr" : "repeat(3, 1fr)", gap: m ? 16 : 24, maxWidth: 960, margin: "0 auto" }}>
            {[
              {
                title: "What is Income Stability?",
                description: "The core concept: why structure matters more than amount.",
                slug: "what-is-income-stability",
              },
              {
                title: "How to Measure It",
                description: "The six dimensions that determine whether your income survives disruption.",
                slug: "how-to-measure-income-stability",
              },
              {
                title: "Income Structure vs. Income",
                description: "Why two people earning the same amount can have radically different stability.",
                slug: "income-stability-vs-income",
              },
            ].map((concept) => (
              <Link
                key={concept.slug}
                href={`/learn/${concept.slug}`}
                style={{
                  padding: m ? "24px" : "28px",
                  border: `1px solid ${L.divider}`,
                  borderRadius: 12,
                  backgroundColor: L.white,
                  textDecoration: "none",
                  transition: "all 200ms",
                  display: "flex",
                  flexDirection: "column",
                  gap: 12,
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = L.teal;
                  e.currentTarget.style.boxShadow = "0 4px 16px rgba(31,109,122,0.08)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = L.divider;
                  e.currentTarget.style.boxShadow = "none";
                }}
              >
                <h3 style={{ fontSize: 16, fontWeight: 600, color: L.navy, margin: 0 }}>
                  {concept.title}
                </h3>
                <p style={{ fontSize: 14, color: L.textSecondary, margin: 0 }}>
                  {concept.description}
                </p>
                <div style={{ fontSize: 13, fontWeight: 600, color: L.teal, marginTop: "auto" }}>
                  Read →
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* PREVENTATIVE MEASUREMENT */}
      <section style={{ backgroundColor: L.white, paddingTop: m ? 56 : 80, paddingBottom: m ? 56 : 80, paddingLeft: px(m), paddingRight: px(m) }}>
        <div style={{ maxWidth: 1120, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: m ? 36 : 48 }}>
            <div style={{ fontSize: m ? 13 : 14, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase" as const, color: L.teal, marginBottom: 16 }}>
              WHY THIS MATTERS
            </div>
            <h2 style={{ fontSize: m ? 24 : 36, fontWeight: 600, lineHeight: 1.15, letterSpacing: "-0.02em", color: L.navy, marginBottom: 16 }}>
              When should you care about income stability?
            </h2>
          </div>

          <div style={{ display: m ? "block" : "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 24, maxWidth: 960, margin: "0 auto 40px" }}>
            {[
              {
                label: "Before a major decision",
                body: "Taking on a mortgage, hiring an employee, or leaving a job? Your stability score tells you whether your income structure can support it.",
                color: L.teal,
              },
              {
                label: "When planning for the future",
                body: "Growth, time off, or a pivot. Your income structure determines what's possible without scrambling.",
                color: "#4B3FAE",
              },
              {
                label: "When times are good",
                body: "This is when you have leverage to strengthen your structure—lock in retainers, diversify clients, and build forward visibility.",
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
        </div>
      </section>

      {/* REFERENCE LIBRARY - COLLAPSED BY DEFAULT */}
      <ReferenceLibrary m={m} />

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
  { industry: "Real Estate", slug: "income-stability-real-estate-agents", scenario: "Top producer earning $200K through commissions. No recurring revenue, no retainers. Market slows 30%.", score: "25–35", risk: "Pipeline dependency", color: "#C74634" },
  { industry: "Freelance / Creative", slug: "income-stability-freelancers", scenario: "Designer earning $95K from 3 clients. Largest client is 50% of income. They don't renew.", score: "20–35", risk: "Client concentration", color: "#C74634" },
  { industry: "Consulting", slug: "income-stability-consultants", scenario: "Management consultant earning $200K from 2 project-based clients. No contracts beyond current quarter.", score: "30–45", risk: "Labor dependence", color: "#D0A23A" },
  { industry: "Sales / Brokerage", slug: "income-stability-sales-professionals", scenario: "SaaS rep earning $180K with 60% commission. Quota resets every quarter. Pipeline is 90-day visibility.", score: "25–40", risk: "Income persistence", color: "#D0A23A" },
  { industry: "Insurance", slug: "income-stability-insurance-agents", scenario: "Agent earning $200K. Strong new business production masks declining renewal retention rate of 78%.", score: "35–55", risk: "Renewal erosion", color: "#D0A23A" },
  { industry: "Mortgage", slug: "income-stability-mortgage-brokers", scenario: "Broker earning $180K. 70% of volume is refinance. Rates rise 200 basis points.", score: "15–25", risk: "Rate cycle dependency", color: "#C74634" },
  { industry: "Legal Services", slug: "income-stability-lawyers", scenario: "Litigation partner billing $250K. Top 3 matters carry 65% of revenue. Two conclude simultaneously.", score: "35–50", risk: "Matter concentration", color: "#D0A23A" },
  { industry: "Healthcare", slug: "income-stability-doctors", scenario: "Employed physician earning $350K from one hospital system. System restructures compensation model.", score: "40–55", risk: "Single employer dependency", color: "#D0A23A" },
  { industry: "Construction / Trades", slug: "income-stability-contractors", scenario: "GC finishing a $400K project. Nothing signed for next quarter. 6-week gap between contracts.", score: "28–40", risk: "Forward visibility gap", color: "#D0A23A" },
  { industry: "Media / Entertainment", slug: "income-stability-creators", scenario: "YouTuber earning $120K. 60% from brand deals with no long-term contracts. Algorithm changes.", score: "20–35", risk: "Platform dependency", color: "#C74634" },
  { industry: "Technology", slug: "income-stability-tech-workers", scenario: "Senior engineer earning $250K total comp. 40% is RSUs. Company stock drops 50% in a correction.", score: "40–55", risk: "Compensation structure risk", color: "#D0A23A" },
  { industry: "Small Business", slug: "income-stability-small-business-owners", scenario: "Marketing agency owner. 3 clients, largest is 55% of revenue. They move to an in-house team.", score: "30–45", risk: "Revenue concentration", color: "#D0A23A" },
  { industry: "Retail / E-Commerce", slug: "income-stability-retail-owners", scenario: "Boutique owner earning $140K. 60% of revenue comes from Q4 holiday season. Supply chain delays hit.", score: "30–40", risk: "Seasonal concentration", color: "#D0A23A" },
  { industry: "Hospitality", slug: "income-stability-hospitality-workers", scenario: "Restaurant owner earning $160K. 40% from catering revenue. Corporate clients cut event budgets.", score: "25–40", risk: "Demand volatility", color: "#D0A23A" },
  { industry: "Transportation", slug: "income-stability-transportation-workers", scenario: "Owner-operator running 70% spot freight. Fuel costs spike 25%. Spot rates drop simultaneously.", score: "30–40", risk: "Utilization + cost exposure", color: "#D0A23A" },
  { industry: "Education", slug: "is-my-income-stable", scenario: "Independent trainer earning $90K. Semester-by-semester contracts. One institution doesn't renew.", score: "28–42", risk: "Term-based uncertainty", color: "#D0A23A" },
  { industry: "Manufacturing", slug: "income-stability-index", scenario: "Shop owner with $500K revenue. Largest buyer is 45% of output. They renegotiate terms downward 20%.", score: "35–50", risk: "Buyer concentration", color: "#D0A23A" },
  { industry: "Nonprofit", slug: "how-to-improve-income-stability", scenario: "Executive director. 60% of funding from one foundation grant. Grant cycle is annual with no guarantee.", score: "30–45", risk: "Funding cycle dependency", color: "#D0A23A" },
  { industry: "Agriculture", slug: "income-dependency-explained", scenario: "Farm operator with $300K revenue. 70% forward-priced through futures. Drought cuts yield 30%.", score: "30–45", risk: "Weather + market exposure", color: "#D0A23A" },
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
          <div style={{ fontSize: m ? 13 : 14, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase" as const, color: L.teal, marginBottom: 16 }}>
            REAL-WORLD EXAMPLES
          </div>
          <h2 style={{ fontSize: m ? 24 : 36, fontWeight: 600, lineHeight: 1.15, letterSpacing: "-0.02em", color: L.navy, marginBottom: 16 }}>
            See your situation (and what happens next)
          </h2>
          <p style={{ fontSize: m ? 16 : 18, lineHeight: 1.6, color: L.textSecondary, maxWidth: 560, margin: "0 auto" }}>
            Click any industry to see how income stability works in your field, and what risks matter most.
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
                        Read full analysis →
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
            RunPayway™ is calibrated for <strong style={{ color: L.navy }}>19 industries</strong>. Each scenario shows income structure in real conditions.
          </p>
        </div>
      </div>
    </section>
  );
}

/* ================================================================ */
/* REFERENCE LIBRARY                                                */
/* ================================================================ */

function ReferenceLibrary({ m }: { m: boolean }) {
  const [expanded, setExpanded] = useState(false);

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

  return (
    <section style={{ backgroundColor: L.panelFill, paddingTop: m ? 56 : 80, paddingBottom: m ? 56 : 80, paddingLeft: px(m), paddingRight: px(m) }}>
      <div style={{ maxWidth: 1120, margin: "0 auto" }}>
        <button
          onClick={() => setExpanded(!expanded)}
          style={{
            width: "100%",
            padding: m ? "24px" : "32px",
            backgroundColor: L.white,
            border: `1px solid ${L.divider}`,
            borderRadius: 12,
            cursor: "pointer",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: expanded ? 24 : 0,
          }}
        >
          <div style={{ textAlign: "left" }}>
            <h2 style={{ fontSize: m ? 18 : 20, fontWeight: 600, color: L.navy, margin: "0 0 4px 0" }}>
              🔍 Go deeper
            </h2>
            <p style={{ fontSize: 14, color: L.textSecondary, margin: 0 }}>
              Explore all {coreSlugs.length} concepts
            </p>
          </div>
          <span style={{ fontSize: 24, transition: "transform 200ms", transform: expanded ? "rotate(180deg)" : "none", flexShrink: 0 }}>
            ▼
          </span>
        </button>

        {expanded && (
          <div style={{
            display: "grid",
            gridTemplateColumns: m ? "1fr" : "repeat(2, 1fr)",
            gap: m ? 16 : 24,
            marginTop: 24,
          }}>
            {coreSlugs.map((item) => (
              <Link
                key={item.slug}
                href={`/learn/${item.slug}`}
                style={{
                  padding: "16px 20px",
                  backgroundColor: L.white,
                  border: `1px solid ${L.divider}`,
                  borderRadius: 8,
                  fontSize: 14,
                  color: L.navy,
                  textDecoration: "none",
                  transition: "all 200ms",
                  display: "block",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = L.teal;
                  e.currentTarget.style.color = L.teal;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = L.divider;
                  e.currentTarget.style.color = L.navy;
                }}
              >
                {item.label}
              </Link>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
