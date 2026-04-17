import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "RunPayway™ for Mortgage Lenders — Income Stability Scoring for Self-Employed Borrowers",
  description: "Tax returns show what a borrower earned. RunPayway™ shows whether they'll keep earning it. Standardized income stability scoring for self-employed, commissioned, and contract borrowers.",
};

export default function LendersLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
