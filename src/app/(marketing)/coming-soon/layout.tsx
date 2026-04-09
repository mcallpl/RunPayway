import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "New Releases | RunPayway™",
  description:
    "Upcoming features and product updates for RunPayway. See what is next for income stability scoring and reporting.",
  openGraph: {
    title: "New Releases | RunPayway™",
    description:
      "Upcoming features and product updates for RunPayway. See what is next for income stability scoring and reporting.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "New Releases | RunPayway™",
    description:
      "Upcoming features and product updates for RunPayway. See what is next for income stability scoring and reporting.",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
