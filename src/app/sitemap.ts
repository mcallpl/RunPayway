import type { MetadataRoute } from "next";

export const dynamic = "force-static";

const BASE = "https://peoplestar.com/RunPayway";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    // Homepage
    { url: BASE, lastModified: new Date(), changeFrequency: "weekly", priority: 1.0 },

    // Main marketing pages
    { url: `${BASE}/how-it-works`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.8 },
    { url: `${BASE}/pricing`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.8 },
    { url: `${BASE}/sample-report`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.8 },
    { url: `${BASE}/about`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.8 },
    { url: `${BASE}/faq`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.8 },
    { url: `${BASE}/advisors`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.8 },
    { url: `${BASE}/organizations`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.8 },
    { url: `${BASE}/methodology`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.8 },
    { url: `${BASE}/contact`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.7 },
    { url: `${BASE}/coming-soon`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.6 },

    // Legal pages
    { url: `${BASE}/privacy-policy`, lastModified: new Date(), changeFrequency: "yearly", priority: 0.4 },
    { url: `${BASE}/terms-of-use`, lastModified: new Date(), changeFrequency: "yearly", priority: 0.4 },
    { url: `${BASE}/accessibility`, lastModified: new Date(), changeFrequency: "yearly", priority: 0.4 },
    { url: `${BASE}/acceptable-use-policy`, lastModified: new Date(), changeFrequency: "yearly", priority: 0.4 },
    { url: `${BASE}/security-practices`, lastModified: new Date(), changeFrequency: "yearly", priority: 0.4 },
    { url: `${BASE}/model-version-policy`, lastModified: new Date(), changeFrequency: "yearly", priority: 0.4 },
    { url: `${BASE}/data-processing-agreement`, lastModified: new Date(), changeFrequency: "yearly", priority: 0.4 },

    // /learn/ hub and terms
    { url: `${BASE}/learn`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.9 },
    { url: `${BASE}/learn/terms`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.7 },

    // /learn/ pages
    ...[
      // Core (25)
      "what-is-income-stability", "income-stability-explained", "how-to-measure-income-stability",
      "income-stability-vs-credit-score", "income-stability-vs-income", "income-stability-vs-net-worth",
      "what-is-income-structure", "income-structure-explained", "what-makes-income-stable",
      "what-makes-income-unstable", "income-risk-explained", "income-fragility-explained",
      "income-continuity-explained", "income-concentration-risk", "active-vs-passive-income-stability",
      "recurring-vs-non-recurring-income", "predictable-vs-unpredictable-income",
      "how-income-breaks-under-pressure", "structural-income-risk-explained", "income-stability-index",
      "income-stress-testing-explained", "income-dependency-explained", "how-stable-is-your-income",
      "is-my-income-stable", "how-to-improve-income-stability",
      // Industry (15)
      "income-stability-real-estate-agents", "income-stability-freelancers", "income-stability-consultants",
      "income-stability-sales-professionals", "income-stability-insurance-agents",
      "income-stability-mortgage-brokers", "income-stability-lawyers", "income-stability-doctors",
      "income-stability-contractors", "income-stability-creators", "income-stability-tech-workers",
      "income-stability-small-business-owners", "income-stability-retail-owners",
      "income-stability-hospitality-workers", "income-stability-transportation-workers",
      // Scenarios (25)
      "150k-freelancer-one-client", "150k-freelancer-five-clients", "200k-realtor-commission-heavy",
      "200k-realtor-diversified-pipeline", "consultant-no-contracts-vs-retainers",
      "sales-rep-base-plus-commission", "business-owner-one-vs-three-sources",
      "creator-brand-deals-vs-mixed-income", "contractor-project-based-risk", "lawyer-hourly-vs-retainer",
      "doctor-salary-vs-private-practice", "insurance-renewal-vs-new-business", "mortgage-refi-dependent",
      "freelancer-no-recurring-income", "freelancer-50-percent-retainer", "real-estate-boom-vs-slow-market",
      "sales-high-performer-risk", "consultant-high-income-low-stability", "creator-viral-income-risk",
      "small-business-seasonal-risk", "multi-income-professional", "single-income-earner",
      "passive-income-illusion", "income-drop-40-percent", "stop-working-30-days",
      // Score interpretation (5)
      "what-a-35-score-means", "what-a-50-score-means", "what-a-72-score-means",
      "what-a-90-score-means", "is-70-a-good-income-stability-score",
      // Governance (3)
      "model-governance", "how-versioning-works", "what-runpayway-does-not-do",
    ].map(slug => ({
      url: `${BASE}/learn/${slug}`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: slug.startsWith("income-stability-vs") || slug === "what-is-income-stability" || slug === "how-to-measure-income-stability" ? 0.8 : 0.7,
    })),

    // Blog pages
    { url: `${BASE}/blog`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.7 },
    { url: `${BASE}/blog/the-income-stability-gap`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.7 },
    { url: `${BASE}/blog/what-is-income-stability`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.6 },
    { url: `${BASE}/blog/hidden-risk-in-commission-income`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.6 },
    { url: `${BASE}/blog/recurring-revenue-for-service-businesses`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.6 },
  ];
}
