import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "For Advisors | RunPayway™",
  description:
    "Add income stability scoring to your advisory practice. Structured assessments and diagnostic reports for client engagements.",
  openGraph: {
    title: "For Advisors | RunPayway™",
    description:
      "Add income stability scoring to your advisory practice. Structured assessments and diagnostic reports for client engagements.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "For Advisors | RunPayway™",
    description:
      "Add income stability scoring to your advisory practice. Structured assessments and diagnostic reports for clients.",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
