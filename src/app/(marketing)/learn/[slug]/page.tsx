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
import IncomeStabilityFreelancers from "./pages/income-stability-freelancers";
import IncomeStabilityConsultants from "./pages/income-stability-consultants";
import IncomeStabilitySalesProfessionals from "./pages/income-stability-sales-professionals";
import FreelancerFiveClients from "./pages/150k-freelancer-five-clients";
import ConsultantContractsVsRetainers from "./pages/consultant-no-contracts-vs-retainers";

export default function LearnPage() {
  const { slug } = useParams();
  switch (slug) {
    case "what-is-income-stability": return <WhatIsIncomeStability />;
    case "income-stability-explained": return <IncomeStabilityExplained />;
    case "how-to-measure-income-stability": return <HowToMeasureIncomeStability />;
    case "income-stability-vs-credit-score": return <IncomeStabilityVsCreditScore />;
    case "what-is-income-structure": return <WhatIsIncomeStructure />;
    case "how-to-improve-income-stability": return <HowToImproveIncomeStability />;
    case "income-stability-real-estate-agents": return <IncomeStabilityRealEstateAgents />;
    case "income-stability-freelancers": return <IncomeStabilityFreelancers />;
    case "income-stability-consultants": return <IncomeStabilityConsultants />;
    case "income-stability-sales-professionals": return <IncomeStabilitySalesProfessionals />;
    case "150k-freelancer-one-client": return <FreelancerOneClient />;
    case "150k-freelancer-five-clients": return <FreelancerFiveClients />;
    case "consultant-no-contracts-vs-retainers": return <ConsultantContractsVsRetainers />;
    default: return <div style={{ minHeight: "60vh", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "system-ui", color: "#5E6873" }}>This page is coming soon.</div>;
  }
}
