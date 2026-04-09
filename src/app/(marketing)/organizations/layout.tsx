import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "For Organizations | RunPayway™",
  description:
    "Enterprise income stability assessments for teams. Volume access, structured reporting, and integration options for organizations.",
  openGraph: {
    title: "For Organizations | RunPayway™",
    description:
      "Enterprise income stability assessments for teams. Volume access, structured reporting, and integration options.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "For Organizations | RunPayway™",
    description:
      "Enterprise income stability assessments for teams. Volume access, structured reporting, and integration options.",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
