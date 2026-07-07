import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Methodology | RunPayway™",
  description:
    "How the RunPayway™ governed measurement layer works: the approved measurement rules and fixed logic behind every approved, external-safe output.",
  openGraph: {
    title: "Methodology | RunPayway™",
    description:
      "How the RunPayway™ governed measurement layer works: the approved measurement rules and fixed logic behind every approved, external-safe output.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Methodology | RunPayway™",
    description:
      "How the RunPayway™ governed measurement layer works: the approved measurement rules and fixed logic behind every approved, external-safe output.",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
