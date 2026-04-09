import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About | RunPayway™",
  description:
    "RunPayway measures income stability with deterministic scoring. Built for consultants, contractors, freelancers, and business owners.",
  openGraph: {
    title: "About | RunPayway™",
    description:
      "RunPayway measures income stability with deterministic scoring. Built for consultants, contractors, freelancers, and business owners.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "About | RunPayway™",
    description:
      "RunPayway measures income stability with deterministic scoring. Built for consultants, contractors, and business owners.",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
