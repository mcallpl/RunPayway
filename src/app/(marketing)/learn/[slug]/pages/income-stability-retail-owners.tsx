"use client";

import {
  LearnHero,
  QuickInsightStrip,
  CoreContent,
  P,
  IndustryBlock,
  SystemBlock,
  VisualModel,
  ScenarioBlock,
  ContrastBlock,
  RealityCheck,
  RelatedTopics,
  LearnFAQ,
  LearnCTA,
  MetaFooter,
} from "@/components/learn/LearnComponents";

export default function IncomeStabilityRetailOwners() {
  return (
    <>
      {/* 1. Hero */}
      <LearnHero
        label="Industry Analysis"
        title="Income Stability for Retail Owners"
        definition="Retail income is the margin after costs — not the revenue. High sales can mask thin margins, seasonal dependency, and supplier concentration."
        subtitle="Revenue is vanity. Margin is reality. Stability measures whether the margin holds."
      />

      {/* 2. Quick Insight Strip */}
      <QuickInsightStrip
        items={[
          "Retail income is margin-based — high revenue does not guarantee high take-home pay",
          "Seasonal concentration compresses annual earnings into narrow windows",
          "Supplier dependency creates structural risk that revenue figures do not reveal",
        ]}
      />

      {/* 3. Core Content */}
      <CoreContent
        sections={[
          {
            heading: "Why Retail Revenue Overstates Income Stability",
            body: (
              <>
                <P>
                  Retail businesses report revenue that can be orders of magnitude larger than the owner&apos;s actual income. A boutique generating $800,000 in annual sales may produce owner compensation of $75,000 to $120,000 after cost of goods, rent, payroll, and operating expenses. The revenue figure creates an impression of financial substance. The margin figure reveals the actual earning structure — and margins in retail are structurally thin, typically 5% to 15% net for independent operators.
                </P>
                <P>
                  This margin sensitivity means that small changes in cost structure produce disproportionate income effects. A 10% increase in supplier costs or a 15% decline in foot traffic does not reduce owner income by 10% or 15%. It can reduce it by 40% to 60% because fixed costs remain constant while the revenue that covers them contracts. Retail income is leveraged — the owner benefits disproportionately from strong sales and suffers disproportionately from weak ones.
                </P>
                <P>
                  Traditional income assessment tools — tax returns, profit and loss statements — capture the historical margin but do not evaluate its structural durability. A year of strong margins does not indicate that the conditions producing those margins will persist. Seasonal patterns, supplier terms, lease obligations, and competitive dynamics can all shift in ways that compress margins without warning.
                </P>
              </>
            ),
          },
          {
            heading: "Seasonal Concentration in Retail",
            body: (
              <>
                <P>
                  Many retail businesses derive a disproportionate share of annual profit from a narrow time window. A gift shop may generate 50% of annual profit during the November-December holiday period. A swimwear retailer may compress 60% of earnings into a four-month summer window. This concentration creates a structural vulnerability that differs from typical income variability — the business is not merely seasonal, it is existentially dependent on a specific period performing well.
                </P>
                <P>
                  The consequence is that a single bad season can erase a year of earnings. If the holiday quarter underperforms due to weather, economic sentiment, or supply chain disruption, the retailer cannot recover that revenue in January. The seasonal window has closed. Fixed costs — rent, insurance, base payroll — continue regardless. The resulting cash flow compression can eliminate the owner&apos;s annual income entirely while the business continues to appear operational.
                </P>
                <P>
                  Seasonal concentration also limits the owner&apos;s ability to respond to disruption. A year-round business with consistent monthly revenue can adjust staffing, inventory, and marketing in response to underperformance. A seasonally concentrated business must execute during its peak window or absorb the loss for the full year. There is no structural mechanism for recovery.
                </P>
              </>
            ),
          },
          {
            heading: "Inventory and Supplier as Structural Risk",
            body: (
              <>
                <P>
                  Retail income depends on the continuous availability of product at acceptable margins. This creates a dual dependency — on suppliers to deliver inventory and on cost structures to remain within the margin threshold that produces owner income. A boutique owner who sources 70% of inventory from a single supplier has a concentration risk that is invisible on financial statements but structural in its impact.
                </P>
                <P>
                  Supplier disruption in retail is not hypothetical. Tariff changes, shipping delays, raw material shortages, and supplier insolvency can all interrupt inventory flow. When inventory is unavailable, revenue stops — not because demand has changed, but because the supply chain that enables revenue has been disrupted. The owner&apos;s income is downstream of a logistics chain they do not control.
                </P>
                <P>
                  Inventory itself represents capital at risk. Unsold inventory ties up cash that cannot be deployed elsewhere. Seasonal markdowns, obsolescence, and spoilage all reduce the realized margin on purchased goods. A retailer who buys $200,000 in inventory expecting to sell it at a 2x markup may realize only 1.4x after markdowns and unsold stock. The income that was projected at purchase never materializes.
                </P>
              </>
            ),
          },
        ]}
      />

      {/* Industry Block */}
      <IndustryBlock
        industry="Retail"
        howIncomeWorks="Margin-based after cost of goods, rent, payroll, and operating expenses. Revenue can be 5x to 10x owner income. Earnings are seasonal in most retail categories, with 40% to 60% of annual profit concentrating in peak periods. Inventory-dependent — income requires capital deployed in advance with no guaranteed return."
        typicalRange="30-45. Retailers with diversified product lines, year-round demand, and multiple supplier relationships score toward the upper range. Single-category retailers with seasonal concentration and thin margins score toward the lower range. High revenue alone does not improve the score."
        biggestRisk="Revenue does not equal income. Margin compression from supplier cost increases, competitive pricing pressure, or seasonal underperformance can eliminate owner income while the business continues to operate. The owner is the last to get paid, and the margin that funds their compensation is the thinnest and most vulnerable layer of the financial structure."
      />

      {/* 4. System Block */}
      <SystemBlock />

      {/* 5. Visual Model */}
      <VisualModel protected={10} recurring={30} atRisk={60} />

      {/* 6. Scenario */}
      <ScenarioBlock
        title="Boutique owner with 60% of revenue from Q4 holiday season"
        setup="An independent boutique owner generates $650,000 in annual revenue with approximately $95,000 in owner compensation. Sixty percent of revenue — and an estimated 70% of annual profit — concentrates in October through December. The remaining nine months produce revenue that approximately covers fixed operating costs but generates minimal owner income. Two primary suppliers provide 75% of inventory."
        risk="A warm winter reduces holiday foot traffic by 25%. Online competitors run aggressive promotions that force margin compression on key product categories. The boutique enters January with $40,000 in unsold holiday inventory requiring 40% markdowns. One of the two primary suppliers increases wholesale prices by 12% for the spring line, further compressing margins on remaining stock."
        outcome="Estimated stability score: 26-33. The owner&apos;s income was structurally dependent on a single quarter performing well, with concentrated supplier relationships and no margin buffer. The holiday underperformance did not merely reduce income — it eliminated the majority of annual compensation. Twelve months of operating costs were paid. The owner was not."
      />

      {/* 7. Contrast */}
      <ContrastBlock
        left="Revenue"
        right="Take-Home Income"
        explanation="Revenue measures what the business collects. Take-home income measures what the owner keeps after cost of goods, rent, payroll, and operating expenses. In retail, the gap between these two figures is enormous — an $800,000 revenue business may produce $80,000 in owner income. Stability must be measured against the income figure, not the revenue figure, because the margin that separates them is where structural risk concentrates."
      />

      {/* 8. Reality Check */}
      <RealityCheck statement="A retail business can process a million dollars in sales and leave the owner with nothing. Revenue is not income. Margin is income. And margin is fragile." />

      {/* 9. Related Topics */}
      <RelatedTopics
        links={[
          { href: "/learn/income-stability-small-business-owners", label: "Income Stability for Small Business Owners" },
          { href: "/learn/income-concentration-risk", label: "Income Concentration Risk" },
          { href: "/learn/income-stability-explained", label: "Income Stability Explained" },
          { href: "/learn/income-stability-hospitality-workers", label: "Income Stability for Hospitality Workers" },
          { href: "/learn/what-makes-income-unstable", label: "What Makes Income Unstable" },
        ]}
      />

      {/* 10. FAQ */}
      <LearnFAQ
        items={[
          {
            q: "My store has been profitable for years — doesn't that mean my income is stable?",
            a: "Historical profitability indicates persistence but does not measure structural resilience. If profitability depends on a single peak season, thin margins, or concentrated supplier relationships, the structure is fragile regardless of past performance. Stability measures whether the conditions producing profit are likely to hold, not whether they have held so far.",
          },
          {
            q: "Does opening a second location improve income stability?",
            a: "It can, if the second location diversifies geographic or seasonal risk. A second store in a different market or with a different product focus creates structural diversification. A second store in the same market with the same product mix doubles revenue exposure without improving structural resilience — it amplifies both the upside and the downside.",
          },
          {
            q: "How does e-commerce affect retail income stability?",
            a: "E-commerce can improve stability by extending selling windows beyond store hours, reducing geographic dependency, and smoothing seasonal patterns. However, it also introduces new structural risks — platform dependency, digital marketing costs, and competitive exposure to national operators. The net effect on stability depends on whether the e-commerce channel diversifies risk or merely shifts it.",
          },
          {
            q: "What is the most effective way for a retail owner to improve their score?",
            a: "Reduce seasonal concentration by developing year-round product categories or services. Diversify supplier relationships so no single vendor controls more than 30% of inventory. Build a recurring revenue component — repair services, subscriptions, membership programs — that generates income independent of foot traffic. Each structural change addresses a different dimension of stability.",
          },
          {
            q: "Should I measure stability against revenue or owner compensation?",
            a: "Owner compensation. Revenue is the top-line figure that funds all obligations before the owner is paid. Stability must be measured against the income the owner actually receives, because that is the layer most vulnerable to margin compression, seasonal shortfall, and cost increases. A stable revenue line can coexist with unstable owner income if margins are thin.",
          },
        ]}
      />

      {/* 11. Micro Conversion */}

      {/* 12. CTA */}
      <LearnCTA
        heading="Know Your Margin Risk"
        sub="Get a structural stability score that measures your actual income — not your revenue."
      />

      {/* 13. Meta Footer */}
      <MetaFooter updated="April 2026" />
    </>
  );
}
