import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact | RunPayway™",
  description:
    "Get in touch with the RunPayway team. Questions about scoring, reports, enterprise licensing, or partnership inquiries.",
  openGraph: {
    title: "Contact | RunPayway™",
    description:
      "Get in touch with the RunPayway team. Questions about scoring, reports, enterprise licensing, or partnerships.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Contact | RunPayway™",
    description:
      "Get in touch with the RunPayway team. Questions about scoring, reports, enterprise licensing, or partnerships.",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
