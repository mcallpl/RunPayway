import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Pricing | RunPayway™",
  description:
    "RunPayway™ is the governed standard for complex-income measurement. Licensing for organizations, institutions, and platforms. Approved, external-safe outputs for connected systems.",
  openGraph: {
    title: "Pricing | RunPayway™",
    description:
      "RunPayway™ is the governed standard for complex-income measurement. Licensing for organizations, institutions, and platforms. Approved, external-safe outputs for connected systems.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Pricing | RunPayway™",
    description:
      "RunPayway™ is the governed standard for complex-income measurement. Licensing for organizations, institutions, and platforms. Approved, external-safe outputs for connected systems.",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
