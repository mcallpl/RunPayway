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
  StickyLearnCTA,
  MetaFooter,
} from "@/components/learn/LearnComponents";

export default function IncomeStabilityHospitalityWorkers() {
  return (
    <>
      {/* 1. Hero */}
      <LearnHero
        label="Industry Analysis"
        title="Income Stability for Hospitality Workers"
        definition="Hospitality income depends on demand that can disappear overnight — one slow season, one policy change, one shift in consumer behavior."
        subtitle="An industry built on discretionary spending has structural fragility embedded in its revenue model."
      />

      {/* 2. Quick Insight Strip */}
      <QuickInsightStrip
        items={[
          "Hospitality income combines variable pay with demand-dependent volume",
          "Tips, events, and seasonal traffic create layered unpredictability",
          "Most hospitality earners score between 25 and 40 on income stability",
        ]}
      />

      {/* 3. Core Content */}
      <CoreContent
        sections={[
          {
            heading: "The Structure of Hospitality Income",
            body: (
              <>
                <P>
                  Hospitality income arrives through multiple channels that are individually variable and collectively correlated with consumer demand. A restaurant server earns an hourly base plus tips that fluctuate with traffic volume, check size, and customer generosity. A hotel manager earns a salary that is nominally fixed but depends on the property maintaining occupancy rates that justify the position. A catering business owner earns project fees that are entirely event-driven — no events, no income.
                </P>
                <P>
                  These income components share a common structural dependency: consumer willingness to spend on discretionary experiences. When economic conditions tighten, hospitality spending contracts before other categories because dining out, traveling, and hosting events are among the first expenditures that households and businesses reduce. The income is not just variable — it is variable in a direction that is correlated with broader economic stress.
                </P>
                <P>
                  This demand sensitivity creates a structural condition where hospitality income is most at risk precisely when the earner most needs stability. Economic downturns reduce both the volume of hospitality spending and the per-transaction value (smaller tips, lower check averages, fewer premium bookings). The earner faces income compression from multiple directions simultaneously.
                </P>
              </>
            ),
          },
          {
            heading: "Seasonal and Event Dependency",
            body: (
              <>
                <P>
                  Hospitality revenue concentrates around seasons, events, and local demand patterns that the operator does not control. A beachside restaurant may generate 55% of annual revenue between Memorial Day and Labor Day. A wedding venue may derive 70% of income from a May-through-October booking window. A ski lodge restaurant operates profitably for four months and subsidizes losses for the remaining eight.
                </P>
                <P>
                  Event-driven revenue adds another layer of structural concentration. A restaurant that derives 40% of income from catering has effectively built its income around a project-based model within an already volatile industry. Each catering engagement is independent — there is no contractual guarantee of the next event. When corporate event budgets are cut or social gatherings decline, that 40% revenue stream can contract sharply with no alternative channel to absorb the loss.
                </P>
                <P>
                  The combination of seasonal dependency and event dependency creates compounding fragility. A slow tourist season reduces dine-in revenue. A simultaneous pullback in corporate events reduces catering revenue. Both channels decline together because they share the same underlying demand driver — consumer and business willingness to spend on hospitality experiences.
                </P>
              </>
            ),
          },
          {
            heading: "Labor Dependence and Operational Fragility",
            body: (
              <>
                <P>
                  Hospitality is among the most labor-intensive industries. Income generation requires physical presence — kitchens must be staffed, dining rooms must be served, events must be executed, rooms must be cleaned. This creates extreme labor dependence for both employees and owners. A restaurant owner who also serves as head chef cannot generate income during illness, injury, or personal absence without a qualified replacement who may not exist.
                </P>
                <P>
                  Staffing itself represents a structural risk to income stability. High turnover rates — averaging 70% to 80% annually in food service — mean that the labor force required to generate revenue is in constant flux. Training costs, service quality variability, and the operational disruption of continuous hiring all compress the margin between revenue and owner income. The business can be full every night and still underperform because staffing instability erodes the operating efficiency that produces profit.
                </P>
                <P>
                  For hospitality employees, labor dependence is total. Tips cease the day a server stops working. Hourly wages stop the day a line cook is absent. There is no mechanism for income continuity during non-work periods, and the industry offers minimal structural protection — few long-term contracts, limited paid leave in independent establishments, and no recurring income component for most positions.
                </P>
              </>
            ),
          },
        ]}
      />

      {/* Industry Block */}
      <IndustryBlock
        industry="Hospitality"
        howIncomeWorks="Tips plus hourly wages or salary for employees. Revenue minus cost of goods, labor, and overhead for owners. Income is event-driven and seasonal, with consumer demand as the primary volume driver. Most positions and businesses have zero recurring revenue — each dollar earned requires a new customer, a new event, or a new shift."
        typicalRange="25-40. Hospitality earners with diversified revenue streams (dine-in, catering, private events, retail product sales) and year-round demand score toward the upper range. Earners dependent on seasonal traffic, tips, or a single revenue channel score toward the lower range."
        biggestRisk="Demand volatility combined with labor dependence. Hospitality income requires both consumer demand and personal or staff labor to produce revenue. When demand drops — due to economic conditions, seasonal shifts, or external disruptions — income drops proportionally with no contractual floor. When labor is disrupted — illness, staffing shortages, burnout — the business cannot generate revenue regardless of demand."
      />

      {/* 4. System Block */}
      <SystemBlock />

      {/* 5. Visual Model */}
      <VisualModel protected={5} recurring={25} atRisk={70} />

      {/* 6. Scenario */}
      <ScenarioBlock
        title="Restaurant owner with 40% revenue from catering that dries up"
        setup="An independent restaurant owner generates $1.2 million in annual revenue with approximately $110,000 in owner compensation. The business operates two revenue channels: dine-in service (60% of revenue) and corporate and social event catering (40% of revenue). The catering channel has no long-term contracts — each event is booked individually, typically 2 to 6 weeks in advance."
        risk="A regional economic slowdown reduces corporate event spending. Three major repeat corporate clients pause their event calendars indefinitely. Social event bookings decline 30% as consumers reduce discretionary spending. Catering revenue drops from $480,000 to $210,000 over two quarters. Dine-in traffic also softens by 15%, further compressing margins."
        outcome="Estimated stability score: 22-28. Owner compensation drops from $110,000 to approximately $35,000 as the catering revenue loss flows directly to the bottom line. Fixed costs — rent, insurance, base payroll — continue unchanged. The 40% catering dependency had no contractual protection, and when corporate demand contracted, there was no structural mechanism to maintain the income. The restaurant remained open. The owner&apos;s income effectively disappeared."
      />

      {/* 7. Contrast */}
      <ContrastBlock
        left="Full House Tonight"
        right="Stable Revenue"
        explanation="A full house tonight describes current demand — the restaurant is busy, tables are occupied, the kitchen is running. Stable revenue describes structural commitment — whether tomorrow&apos;s demand is secured through advance bookings, catering contracts, or recurring events. Tonight&apos;s full house does not predict next Tuesday&apos;s covers. Stability requires structural reasons for revenue to continue, not just current evidence that it exists."
      />

      {/* 8. Reality Check */}
      <RealityCheck statement="An industry where income depends on people choosing to eat out, travel, or celebrate is an industry where income depends on choices that change first when conditions tighten." />

      {/* 9. Related Topics */}
      <RelatedTopics
        links={[
          { href: "/learn/income-stability-retail-owners", label: "Income Stability for Retail Owners" },
          { href: "/learn/income-stability-small-business-owners", label: "Income Stability for Small Business Owners" },
          { href: "/learn/income-dependency-explained", label: "Income Dependency Explained" },
          { href: "/learn/income-stability-explained", label: "Income Stability Explained" },
          { href: "/learn/income-concentration-risk", label: "Income Concentration Risk" },
        ]}
      />

      {/* 10. FAQ */}
      <LearnFAQ
        items={[
          {
            q: "Can a restaurant have high income stability?",
            a: "It is structurally difficult but not impossible. Restaurants with long-term catering contracts, membership dining programs, retail product revenue (packaged goods, meal kits), and diversified event channels can score in the 40-50 range. The key is building recurring or contracted revenue that persists independent of nightly dine-in traffic.",
          },
          {
            q: "How do tips affect income stability measurement?",
            a: "Tip income is highly variable and entirely demand-dependent — it scores poorly on multiple stability dimensions. Tips have no forward visibility, no contractual protection, and fluctuate with traffic volume, check size, and customer behavior. An earner whose compensation is primarily tip-based has a structurally fragile income regardless of average tip amounts.",
          },
          {
            q: "Does owning the building improve stability for a restaurant owner?",
            a: "It removes one structural risk — lease non-renewal or rent increases — but does not address the underlying demand dependency that drives hospitality income volatility. Property ownership improves the business&apos;s cost structure stability but does not improve revenue stability. The owner still depends on consumer demand to generate income.",
          },
          {
            q: "What structural changes have the most impact for hospitality owners?",
            a: "Three changes produce the largest stability improvements: securing long-term catering or event contracts with committed minimum volumes, developing a revenue channel that is not demand-dependent (retail products, licensing, subscription meal services), and reducing labor dependency by cross-training staff and creating operational systems that function without the owner&apos;s daily presence.",
          },
          {
            q: "Is hospitality income always low-stability?",
            a: "It tends to score lower than industries with contractual revenue or recurring billing models, but the range is meaningful. A hotel management company with multi-year property contracts scores differently than a seasonal food truck. The industry creates structural headwinds, but individual operators can build architectures that partially offset them.",
          },
        ]}
      />

      {/* 11. Micro Conversion */}

      {/* 12. CTA */}
      <LearnCTA
        heading="Understand Your Demand Exposure"
        sub="Get a structural stability score that reveals where your hospitality income is most vulnerable."
      />

      {/* 13. Meta Footer */}
      <MetaFooter updated="April 2026" />
      <StickyLearnCTA />
    </>
  );
}
