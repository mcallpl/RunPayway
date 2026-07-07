import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "How It Works | RunPayway™",
  description:
    "How RunPayway™ measures the structure behind complex income using approved measurement rules, producing approved, external-safe outputs measured the same way every time.",
  openGraph: {
    title: "How It Works | RunPayway™",
    description:
      "How RunPayway™ measures the structure behind complex income using approved measurement rules, producing approved, external-safe outputs measured the same way every time.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "How It Works | RunPayway™",
    description:
      "How RunPayway™ measures the structure behind complex income using approved measurement rules, producing approved, external-safe outputs measured the same way every time.",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
