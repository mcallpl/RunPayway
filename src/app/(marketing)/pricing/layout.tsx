import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Pricing | RunPayway™",
  description:
    "Free Income Stability Score in 90 seconds. Full report with action plan for $69. No subscription required.",
  openGraph: {
    title: "Pricing | RunPayway™",
    description:
      "Free Income Stability Score in 90 seconds. Full report with action plan for $69. No subscription required.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Pricing | RunPayway™",
    description:
      "Free Income Stability Score in 90 seconds. Full report with action plan for $69. No subscription required.",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
