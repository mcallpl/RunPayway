// Advisor Assessment Questions — Professional framing, client-focused.
// Maps to the same A/B/C/D/E answers as the canonical engine.
// Designed for financial professionals assessing a client's income structure.

export interface AdvisorQuestion {
  number: number;
  title: string;
  prompt: string;
  note?: string;
  options: { letter: string; text: string }[];
}

export function buildAdvisorQuestions(): AdvisorQuestion[] {
  return [
    {
      number: 1,
      title: "Recurring Revenue Base",
      prompt: "What portion of your client's income renews automatically — through existing agreements, renewals, or subscriptions — without requiring new client acquisition?",
      note: "Do not include income that requires re-selling or re-earning each period.",
      options: [
        { letter: "A", text: "None — income is entirely transactional (0–10%)" },
        { letter: "B", text: "A small recurring component (11–30%)" },
        { letter: "C", text: "A moderate recurring base (31–60%)" },
        { letter: "D", text: "A strong recurring foundation (61–85%)" },
        { letter: "E", text: "Primarily recurring — over 85% auto-renews" },
      ],
    },
    {
      number: 2,
      title: "Income Concentration",
      prompt: "How concentrated is your client's income around a single source — top client, employer, transaction type, or platform?",
      note: "Consider the share from the single largest contributor over the past 12 months.",
      options: [
        { letter: "A", text: "Extremely concentrated — 90–100% from one source" },
        { letter: "B", text: "Highly concentrated — 70–89% from one source" },
        { letter: "C", text: "Moderately concentrated — 50–69% from one source" },
        { letter: "D", text: "Moderately distributed — 30–49% from the largest source" },
        { letter: "E", text: "Well distributed — under 30% from any single source" },
      ],
    },
    {
      number: 3,
      title: "Source Diversification",
      prompt: "How many distinct income sources — each representing at least 10% of total income — does your client have?",
      note: "Count only sources that independently contribute 10% or more.",
      options: [
        { letter: "A", text: "One" },
        { letter: "B", text: "Two" },
        { letter: "C", text: "Three or four" },
        { letter: "D", text: "Five to seven" },
        { letter: "E", text: "Eight or more" },
      ],
    },
    {
      number: 4,
      title: "Forward Revenue Visibility",
      prompt: "How much of your client's upcoming income is already secured through signed contracts, binding renewals, or committed forward agreements?",
      note: "Include only legally committed or contractually obligated income — not projections or expected renewals.",
      options: [
        { letter: "A", text: "Less than one month of committed forward income" },
        { letter: "B", text: "One to two months secured" },
        { letter: "C", text: "Three to five months secured" },
        { letter: "D", text: "Six to eleven months secured" },
        { letter: "E", text: "Twelve or more months secured" },
      ],
    },
    {
      number: 5,
      title: "Earnings Consistency",
      prompt: "Over the past 12 months, how variable has your client's monthly income been?",
      note: "Assess the range between their highest and lowest earning months relative to their average.",
      options: [
        { letter: "A", text: "Extreme variability — fluctuations exceeding 75%" },
        { letter: "B", text: "High variability — fluctuations of 50–75%" },
        { letter: "C", text: "Moderate variability — fluctuations of 25–49%" },
        { letter: "D", text: "Low variability — fluctuations of 10–24%" },
        { letter: "E", text: "Consistent — fluctuations under 10%" },
      ],
    },
    {
      number: 6,
      title: "Labor Independence",
      prompt: "If your client stopped actively working for 90 consecutive days, what percentage of their income would continue to arrive without direct intervention?",
      note: "Include only income streams that operate independently of active effort — contracts, renewals, passive distributions.",
      options: [
        { letter: "A", text: "None — income is entirely dependent on active labor (0%)" },
        { letter: "B", text: "A small portion continues independently (1–25%)" },
        { letter: "C", text: "About half continues without active effort (26–50%)" },
        { letter: "D", text: "More than half continues independently (51–75%)" },
        { letter: "E", text: "Nearly all income continues without intervention (76–100%)" },
      ],
    },
  ];
}
