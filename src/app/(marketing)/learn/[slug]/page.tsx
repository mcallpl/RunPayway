"use client";
import { useParams } from "next/navigation";
import WhatIsIncomeStability from "./pages/what-is-income-stability";
import IncomeStabilityRealEstateAgents from "./pages/income-stability-real-estate-agents";
import FreelancerOneClient from "./pages/150k-freelancer-one-client";
import IncomeStabilityExplained from "./pages/income-stability-explained";
import HowToMeasureIncomeStability from "./pages/how-to-measure-income-stability";
import IncomeStabilityVsCreditScore from "./pages/income-stability-vs-credit-score";
import WhatIsIncomeStructure from "./pages/what-is-income-structure";
import HowToImproveIncomeStability from "./pages/how-to-improve-income-stability";

export default function LearnPage() {
  const { slug } = useParams();
  switch (slug) {
    case "what-is-income-stability": return <WhatIsIncomeStability />;
    case "income-stability-real-estate-agents": return <IncomeStabilityRealEstateAgents />;
    case "150k-freelancer-one-client": return <FreelancerOneClient />;
    case "income-stability-explained": return <IncomeStabilityExplained />;
    case "how-to-measure-income-stability": return <HowToMeasureIncomeStability />;
    case "income-stability-vs-credit-score": return <IncomeStabilityVsCreditScore />;
    case "what-is-income-structure": return <WhatIsIncomeStructure />;
    case "how-to-improve-income-stability": return <HowToImproveIncomeStability />;
    default: return <div>Coming soon</div>;
  }
}
