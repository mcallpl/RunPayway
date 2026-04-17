// Free Assessment Questions — Plain language, no percentages.
// Maps to the same A/B/C/D/E answers as the canonical engine.
// Designed for first-time visitors who don't yet understand income structure terminology.

export interface FreeQuestion {
  number: number;
  title: string;
  prompt: string;
  hint?: string;
  options: { letter: string; text: string }[];
}

export function buildFreeQuestions(): FreeQuestion[] {
  return [
    {
      number: 1,
      title: "How reliable is your income each month?",
      prompt: "How much of your income comes back automatically — without you re-earning it?",
      hint: "Think about retainers, subscriptions, or contracts that renew on their own.",
      options: [
        { letter: "A", text: "Almost none — I start from zero every month" },
        { letter: "B", text: "A small portion — maybe 10 to 30%" },
        { letter: "C", text: "About a third to half of it" },
        { letter: "D", text: "More than half — mostly ongoing agreements" },
        { letter: "E", text: "Almost all of it continues without me re-earning it" },
      ],
    },
    {
      number: 2,
      title: "How spread out is your income?",
      prompt: "How much of your income comes from your single biggest source?",
      hint: "This might be your largest client, employer, platform, or income type.",
      options: [
        { letter: "A", text: "Nearly all of it — one source makes up almost everything" },
        { letter: "B", text: "Most of it — more than two thirds" },
        { letter: "C", text: "About half" },
        { letter: "D", text: "Less than half — spread across a few sources" },
        { letter: "E", text: "A small portion — income is well distributed" },
      ],
    },
    {
      number: 3,
      title: "How many sources contribute to your income?",
      prompt: "How many separate sources each bring in a meaningful share of your total income?",
      hint: "Only count sources that represent at least 10% of your total.",
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
      title: "How far ahead is your income locked in?",
      prompt: "How much of your upcoming income is already secured — from signed deals, contracts, or renewals?",
      hint: "Only count income that is already committed, not expected or hoped for.",
      options: [
        { letter: "A", text: "Less than a month — I don't know what's coming" },
        { letter: "B", text: "A month or two ahead" },
        { letter: "C", text: "Three to five months ahead" },
        { letter: "D", text: "Six months to a year ahead" },
        { letter: "E", text: "A year or more ahead" },
      ],
    },
    {
      number: 5,
      title: "How consistent is your income month to month?",
      prompt: "Looking at your best and worst months in the past year — how much did your income swing?",
      hint: "Think about the gap between your highest and lowest earning months.",
      options: [
        { letter: "A", text: "Dramatically — some months were 3 to 5 times others" },
        { letter: "B", text: "A lot — swings of 50 to 75%" },
        { letter: "C", text: "Noticeably — swings of 25 to 50%" },
        { letter: "D", text: "Somewhat — minor swings of 10 to 25%" },
        { letter: "E", text: "Very little — roughly the same each month" },
      ],
    },
    {
      number: 6,
      title: "What happens if you stop working?",
      prompt: "If you couldn't work for 90 days, what portion of your income would keep coming in on its own?",
      hint: "Think about any income that continues regardless of your active involvement.",
      options: [
        { letter: "A", text: "None — income stops completely without me" },
        { letter: "B", text: "A small amount — maybe 10 to 25% continues" },
        { letter: "C", text: "About half continues on its own" },
        { letter: "D", text: "More than half — most income runs without me" },
        { letter: "E", text: "Almost all of it continues without me" },
      ],
    },
  ];
}
