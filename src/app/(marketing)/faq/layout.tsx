import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "FAQ | RunPayway™",
  description:
    "Answers about the Income Stability Score, assessment process, reports, pricing, privacy, and enterprise licensing.",
  openGraph: {
    title: "FAQ | RunPayway™",
    description:
      "Answers about the Income Stability Score, assessment process, reports, pricing, privacy, and enterprise licensing.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "FAQ | RunPayway™",
    description:
      "Answers about the Income Stability Score, assessment process, reports, pricing, privacy, and enterprise licensing.",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
