"use client";

import {
  LearnHero,
  QuickInsightStrip,
  CoreContent,
  P,
  SystemBlock,
  VisualModel,
  ScenarioBlock,
  ContrastBlock,
  RealityCheck,
  RelatedTopics,
  LearnFAQ,
  MicroConversion,
  LearnCTA,
  MetaFooter,
  IndustryBlock,
} from "@/components/learn/LearnComponents";

export default function IncomeStabilityCreators() {
  return (
    <>
      {/* 1. Hero */}
      <LearnHero
        label="Industry Analysis"
        title="Income Stability for Creators"
        definition="Creator income is audience-dependent and platform-mediated. A viral month can generate more than the previous quarter — and the next month can return to zero."
        subtitle="Why audience size and income stability are measured on different axes."
      />

      {/* 2. Quick Insight Strip */}
      <QuickInsightStrip
        items={[
          "Platform algorithms control distribution — creators do not own their reach",
          "Brand deal income is campaign-based with no recurring commitment",
          "Most creators score between 20 and 35 on income stability",
        ]}
      />

      {/* 3. Core Content */}
      <CoreContent
        sections={[
          {
            heading: "How creator income works",
            body: (
              <>
                <P>
                  Creator income is assembled from multiple revenue layers, each with different structural characteristics. Brand deals and sponsorships typically represent the largest single revenue source for mid-to-large creators. These are campaign-based engagements — a brand pays a negotiated fee for one or more pieces of content promoting a product or service. The engagement is discrete: one video, one post series, one campaign period. When the deliverable is complete, the income from that deal concludes. There is no structural mechanism that guarantees the next deal.
                </P>
                <P>
                  Ad revenue from platforms like YouTube provides a second income layer that is algorithmically determined. The creator publishes content, the platform distributes it to an audience, and the creator receives a share of advertising revenue based on views, watch time, and advertiser demand. This revenue is entirely platform-mediated — the creator has no direct relationship with the advertisers and no control over distribution decisions. A change in algorithm weighting, advertiser spending patterns, or platform policy can materially alter ad revenue without any change in the creator&apos;s content quality or output volume.
                </P>
                <P>
                  Additional revenue sources include merchandise sales, course or digital product sales, membership or subscription programs (Patreon, channel memberships), and affiliate commissions. Each of these sources has different stability characteristics. Membership income is recurring by structure — subscribers pay monthly and continue until they cancel. Merchandise and course sales are transactional and episodic. Affiliate income depends on audience purchasing behavior and merchant program terms that can change unilaterally.
                </P>
              </>
            ),
          },
          {
            heading: "Why stability scores cluster in the 20-35 range",
            body: (
              <>
                <P>
                  The fundamental structural issue for creators is platform dependency. The creator&apos;s ability to reach their audience — and therefore to generate revenue — is mediated by platforms they do not control. YouTube, Instagram, TikTok, and similar platforms make distribution decisions based on their own business objectives, not the creator&apos;s income needs. An algorithm change that reduces a creator&apos;s average views by 30% reduces their ad revenue by a comparable amount, with no recourse.
                </P>
                <P>
                  Brand deal income compounds this instability. Brand partnerships are negotiated individually, executed as discrete campaigns, and provide no forward revenue commitment. A creator who earned $80,000 in brand deals last year has no structural guarantee of earning any brand deal income this year. Brands shift budgets, change creative strategies, and rotate creator partnerships based on campaign performance and internal priorities. The creator&apos;s negotiating position depends on audience metrics that are themselves unstable.
                </P>
                <P>
                  Audience volatility introduces a third structural risk. Creator audiences are not captive — they follow based on interest and can disengage rapidly if content shifts, competition increases, or platform trends change. A creator&apos;s audience size is a lagging indicator that can overstate current engagement. Monthly active engagement is a more accurate measure of monetizable audience, and it fluctuates more than subscriber counts suggest.
                </P>
              </>
            ),
          },
          {
            heading: "Structural strategies for creators",
            body: (
              <>
                <P>
                  The most impactful structural improvement is building owned audience products — revenue streams where the creator has a direct relationship with the paying customer, independent of any platform. A course hosted on the creator&apos;s own domain, a membership community managed through a platform the creator controls, or a physical product sold through a creator-owned store all generate revenue that does not depend on algorithmic distribution. These products convert audience attention into structural assets.
                </P>
                <P>
                  Diversifying across platforms reduces the single-platform dependency risk. A creator who publishes on YouTube, maintains an email newsletter, and runs a podcast distributes their audience relationship across multiple channels. If one platform reduces distribution, the others continue to function. The email list is particularly valuable because it is the only audience channel the creator fully owns — no algorithm mediates delivery.
                </P>
                <P>
                  Converting brand deal relationships into longer-term arrangements improves forward visibility. A quarterly brand partnership with a committed budget provides three months of contracted revenue, compared to a one-off sponsored video that provides a single payment. Some creators negotiate annual ambassador arrangements that guarantee a minimum number of paid activations over a twelve-month period. These structures move brand income from purely transactional to partially recurring.
                </P>
              </>
            ),
          },
        ]}
      />

      {/* Industry Block Extension */}
      <IndustryBlock
        industry="Creator Economy"
        howIncomeWorks="Revenue assembled from brand deals, ad revenue share, sponsorships, merchandise, digital products (courses, templates), and membership/subscription programs. Brand deals are campaign-based with no recurring commitment. Ad revenue is algorithmically determined and platform-mediated. Merchandise and course sales are transactional. Membership income is the only structurally recurring layer for most creators."
        typicalRange="20-35. Creators with diversified revenue including owned products and membership income score toward the upper range. Creators dependent primarily on brand deals and ad revenue with no recurring revenue layer score toward the lower range. Platform concentration and audience volatility are the primary factors suppressing scores."
        biggestRisk="Platform dependency combined with audience volatility. The creator does not own their distribution channel. Algorithmic changes, platform policy shifts, or audience disengagement can reduce revenue materially with no warning and no recourse. Brand deal income compounds this risk because it depends on audience metrics that are themselves platform-dependent and volatile."
      />

      {/* 4. System Block */}
      <SystemBlock />

      {/* 5. Visual Model */}
      <VisualModel protected={5} recurring={15} atRisk={80} />

      {/* 6. Scenario */}
      <ScenarioBlock
        title="YouTuber earning $120K — 60% from brand deals, no long-term contracts"
        setup="A mid-size YouTuber earns $120,000 annually. Revenue breakdown: $72,000 from brand deals (six separate campaigns averaging $12,000 each), $30,000 from YouTube ad revenue, $12,000 from affiliate commissions, and $6,000 from merchandise. No brand deal extends beyond a single campaign. No retainer or ambassador agreements. Channel has 250,000 subscribers with an average of 80,000 views per video."
        risk="A combination of two common events: YouTube adjusts its algorithm and the creator's average views drop from 80,000 to 50,000 per video. Simultaneously, two brand partners shift their Q3 budgets to TikTok creators with higher engagement rates. Ad revenue drops by approximately 35% and brand deal income for the quarter is reduced by $24,000."
        outcome="Estimated stability score: 22-28. Annual income projection drops from $120,000 to approximately $75,000-$85,000. The creator has no contractual protection against either revenue decline. Recovery depends on audience metrics improving or new brand partnerships being secured — both of which are outside the creator's direct control."
      />

      {/* 7. Contrast */}
      <ContrastBlock
        left="Audience Size"
        right="Income Durability"
        explanation="A creator with 500,000 followers and no owned products has a large audience but fragile income. A creator with 50,000 followers and a membership program generating $8,000 per month has a smaller audience but structurally durable income. Audience size measures reach. Income durability measures how much of that reach converts to revenue the creator controls and can rely on month to month."
      />

      {/* 8. Reality Check */}
      <RealityCheck statement="You do not own your audience on a platform you do not control. You rent access to them." />

      {/* 9. Related Topics */}
      <RelatedTopics
        links={[
          { href: "/learn/what-is-income-stability", label: "What Is Income Stability" },
          { href: "/learn/creator-brand-deals-vs-mixed-income", label: "Scenario: Creator — Brand Deals vs Mixed Income" },
          { href: "/learn/income-stability-freelancers", label: "Income Stability for Freelancers" },
          { href: "/learn/what-makes-income-unstable", label: "What Makes Income Unstable" },
          { href: "/learn/how-to-improve-income-stability", label: "How to Improve Income Stability" },
        ]}
      />

      {/* 10. FAQ */}
      <LearnFAQ
        items={[
          {
            q: "I have 500K subscribers — doesn't that indicate stable income?",
            a: "Subscriber count measures accumulated audience interest over time. It does not measure current engagement, monetization reliability, or income structure. A channel with 500,000 subscribers and declining average views is losing monetizable reach. Stability is measured by how income is structured — recurring revenue, contractual commitments, and ownership of audience relationships — not by how many people once clicked subscribe.",
          },
          {
            q: "How do brand deals affect my stability score?",
            a: "Brand deals are scored as variable, non-recurring income with no forward commitment. Each deal is a discrete transaction — one campaign, one payment, no obligation for future work. High brand deal income increases your total earnings but does not improve your structural position. Converting brand relationships into quarterly or annual agreements with committed budgets moves this income toward the recurring category.",
          },
          {
            q: "Does having multiple platforms improve my score?",
            a: "Platform diversification reduces concentration risk, which can improve the score modestly. However, the more significant factor is whether you have revenue streams you own — products, memberships, or direct customer relationships that do not depend on any platform's algorithm or policies. Multi-platform presence without owned revenue is diversified dependency, not structural independence.",
          },
          {
            q: "What is the fastest way for a creator to improve their score?",
            a: "Launch a recurring revenue product — a membership, subscription, or structured course with ongoing enrollment. Even $2,000 per month in membership income fundamentally changes the income structure by creating a predictable floor that persists regardless of brand deal flow or algorithm changes. The structural shift from zero recurring to any recurring is the single highest-impact change for most creators.",
          },
        ]}
      />

      {/* 11. Micro Conversion */}
      <MicroConversion
        items={[
          { text: "See a Sample Report", href: "/sample-report" },
          { text: "Score Your Creator Income", href: "/begin" },
        ]}
      />

      {/* 12. CTA */}
      <LearnCTA
        heading="Understand Your Structural Position"
        sub="Get your income stability score and identify which revenue streams are structural and which are volatile."
      />

      {/* 13. Meta Footer */}
      <MetaFooter updated="April 2026" />
    </>
  );
}
