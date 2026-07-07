import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "FAQ | RunPayway™",
  description:
    "Answers about RunPayway™ complex-income measurement: approved measurement rules, approved outputs, external-safe output, privacy, and organization licensing.",
  openGraph: {
    title: "FAQ | RunPayway™",
    description:
      "Answers about RunPayway™ complex-income measurement: approved measurement rules, approved outputs, external-safe output, privacy, and organization licensing.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "FAQ | RunPayway™",
    description:
      "Answers about RunPayway™ complex-income measurement: approved measurement rules, approved outputs, external-safe output, privacy, and organization licensing.",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
