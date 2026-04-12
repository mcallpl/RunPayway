export function generateStaticParams() {
  return [
    { slug: "the-income-stability-gap" },
    { slug: "what-is-income-stability" },
    { slug: "hidden-risk-in-commission-income" },
    { slug: "recurring-revenue-for-service-businesses" },
  ];
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
