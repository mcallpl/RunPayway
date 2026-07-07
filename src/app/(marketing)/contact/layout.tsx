import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact | RunPayway™",
  description:
    "Get in touch with the RunPayway team. RunPayway™ is the governed standard for complex-income measurement for organizations, institutions, platforms, and teams.",
  openGraph: {
    title: "Contact | RunPayway™",
    description:
      "Get in touch with the RunPayway team. RunPayway™ is the governed standard for complex-income measurement for organizations, institutions, platforms, and teams.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Contact | RunPayway™",
    description:
      "Get in touch with the RunPayway team. RunPayway™ is the governed standard for complex-income measurement for organizations, institutions, platforms, and teams.",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
