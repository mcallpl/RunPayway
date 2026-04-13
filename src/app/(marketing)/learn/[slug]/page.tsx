"use client";
import { useParams } from "next/navigation";
import WhatIsIncomeStability from "./pages/what-is-income-stability";
import IncomeStabilityRealEstateAgents from "./pages/income-stability-real-estate-agents";
import FreelancerOneClient from "./pages/150k-freelancer-one-client";

export default function LearnPage() {
  const { slug } = useParams();
  switch (slug) {
    case "what-is-income-stability": return <WhatIsIncomeStability />;
    case "income-stability-real-estate-agents": return <IncomeStabilityRealEstateAgents />;
    case "150k-freelancer-one-client": return <FreelancerOneClient />;
    default: return <div>Coming soon</div>;
  }
}
