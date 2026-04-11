import { getVocabulary } from "@/lib/industry-vocabulary";

export interface Question {
  number: number;
  title: string;
  prompt: string;
  examples?: string[];
  note?: string;
  definition?: string;
  options: { letter: string; text: string }[];
}

export function buildQuestions(industrySector: string): Question[] {
  const vocab = getVocabulary(industrySector);
  const n = vocab.nouns;

  return [
    {
      number: 1,
      title: "Recurring Revenue Base",
      prompt: "What percentage of your income renews automatically through an existing agreement or subscription?",
      examples: [n.recurring_revenue],
      definition: "Recurring income renews without requiring new client acquisition.",
      options: [
        { letter: "A", text: "0–10%" },
        { letter: "B", text: "11–30%" },
        { letter: "C", text: "31–60%" },
        { letter: "D", text: "61–85%" },
        { letter: "E", text: "86–100%" },
      ],
    },
    {
      number: 2,
      title: "Income Source Diversification",
      prompt: "Over the previous 12 months, how spread out was your income across different sources?",
      examples: [n.top_client],
      note: `Think about how much of your total income depended on any single source, such as a ${n.top_client}.`,
      options: [
        { letter: "A", text: "Almost all from one source (90–100%)" },
        { letter: "B", text: "Mostly from one source (70–89%)" },
        { letter: "C", text: "About half from one source (50–69%)" },
        { letter: "D", text: "Spread across a few sources (30–49% from largest)" },
        { letter: "E", text: "Well diversified (under 30% from any single source)" },
      ],
    },
    {
      number: 3,
      title: "Income Source Count",
      prompt: "Over the previous 12 months, how many separate income sources each contributed at least 10% of your total income?",
      note: "Only count sources that contributed 10% or more.",
      options: [
        { letter: "A", text: "1" },
        { letter: "B", text: "2" },
        { letter: "C", text: "3–4" },
        { letter: "D", text: "5–7" },
        { letter: "E", text: "8 or more" },
      ],
    },
    {
      number: 4,
      title: "Forward Revenue Visibility",
      prompt: `How many months of future income are currently secured — such as ${n.forward_commitment}?`,
      note: "Only include income that is already contractually committed.",
      options: [
        { letter: "A", text: "Less than 1 month" },
        { letter: "B", text: "1–2 months" },
        { letter: "C", text: "3–5 months" },
        { letter: "D", text: "6–11 months" },
        { letter: "E", text: "12 or more months" },
      ],
    },
    {
      number: 5,
      title: "Earnings Consistency",
      prompt: "Over the previous 12 months, how consistent was your monthly income?",
      note: "Compare your highest and lowest earning months relative to your average.",
      options: [
        { letter: "A", text: "Very inconsistent (fluctuated more than 75%)" },
        { letter: "B", text: "Inconsistent (fluctuated 50–75%)" },
        { letter: "C", text: "Somewhat consistent (fluctuated 25–49%)" },
        { letter: "D", text: "Mostly consistent (fluctuated 10–24%)" },
        { letter: "E", text: "Very consistent (fluctuated less than 10%)" },
      ],
    },
    {
      number: 6,
      title: "Income Without Active Work",
      prompt: `If you stopped ${n.active_work} for 90 consecutive days, what percentage of your income would continue automatically?`,
      examples: [n.passive_income],
      definition: `Income that continues without ${n.active_work} or new client acquisition.`,
      options: [
        { letter: "A", text: "0%" },
        { letter: "B", text: "1–25%" },
        { letter: "C", text: "26–50%" },
        { letter: "D", text: "51–75%" },
        { letter: "E", text: "76–100%" },
      ],
    },
  ];
}
