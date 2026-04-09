import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sample Report | RunPayway™",
  description:
    "Preview a full RunPayway diagnostic report. See scoring breakdown, structural analysis, stress testing, and personalized action plan.",
  openGraph: {
    title: "Sample Report | RunPayway™",
    description:
      "Preview a full RunPayway diagnostic report. See scoring breakdown, structural analysis, and personalized action plan.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Sample Report | RunPayway™",
    description:
      "Preview a full RunPayway diagnostic report. See scoring breakdown, structural analysis, and personalized action plan.",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
