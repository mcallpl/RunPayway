import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "How It Works | RunPayway™",
  description:
    "Six structural questions. Deterministic scoring. See how the Income Stability Score measures how your income is built — not how much you earn.",
  openGraph: {
    title: "How It Works | RunPayway™",
    description:
      "Six structural questions. Deterministic scoring. See how the Income Stability Score measures how your income is built.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "How It Works | RunPayway™",
    description:
      "Six structural questions. Deterministic scoring. See how the Income Stability Score measures how your income is built.",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
