import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Methodology | RunPayway™",
  description:
    "How the Structural Stability Model works. Six dimensions, deterministic scoring, and the fixed rules behind every Income Stability Score.",
  openGraph: {
    title: "Methodology | RunPayway™",
    description:
      "How the Structural Stability Model works. Six dimensions, deterministic scoring, and the fixed rules behind every score.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Methodology | RunPayway™",
    description:
      "How the Structural Stability Model works. Six dimensions, deterministic scoring, and the fixed rules behind every score.",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
