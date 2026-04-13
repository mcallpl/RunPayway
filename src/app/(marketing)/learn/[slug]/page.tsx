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
import IncomeStabilityVsIncome from "./pages/income-stability-vs-income";
import IncomeStabilityVsNetWorth from "./pages/income-stability-vs-net-worth";
import IncomeStructureExplained from "./pages/income-structure-explained";
import WhatMakesIncomeStable from "./pages/what-makes-income-stable";
import WhatMakesIncomeUnstable from "./pages/what-makes-income-unstable";
import IncomeRiskExplained from "./pages/income-risk-explained";
import IncomeFragilityExplained from "./pages/income-fragility-explained";
import IncomeContinuityExplained from "./pages/income-continuity-explained";
// Batch 2b — Industry
import IncomeStabilityInsuranceAgents from "./pages/income-stability-insurance-agents";
import IncomeStabilityMortgageBrokers from "./pages/income-stability-mortgage-brokers";
import IncomeStabilityLawyers from "./pages/income-stability-lawyers";
import IncomeStabilityDoctors from "./pages/income-stability-doctors";
// Batch 2b — Scenarios
import RealtorCommissionHeavy from "./pages/200k-realtor-commission-heavy";
import RealtorDiversifiedPipeline from "./pages/200k-realtor-diversified-pipeline";
import SalesRepBaseCommission from "./pages/sales-rep-base-plus-commission";
// Batch 3a — Core
import IncomeConcentrationRisk from "./pages/income-concentration-risk";
import ActiveVsPassive from "./pages/active-vs-passive-income-stability";
import RecurringVsNonRecurring from "./pages/recurring-vs-non-recurring-income";
import PredictableVsUnpredictable from "./pages/predictable-vs-unpredictable-income";
import HowIncomeBreaks from "./pages/how-income-breaks-under-pressure";
import StructuralIncomeRisk from "./pages/structural-income-risk-explained";
import IncomeStabilityIndex from "./pages/income-stability-index";
// Batch 3b — Industry
import IncomeStabilityContractors from "./pages/income-stability-contractors";
import IncomeStabilityCreators from "./pages/income-stability-creators";
import IncomeStabilityTechWorkers from "./pages/income-stability-tech-workers";
import IncomeStabilitySmallBusiness from "./pages/income-stability-small-business-owners";
// Batch 3b — Scenarios
import BusinessOwnerSources from "./pages/business-owner-one-vs-three-sources";
import CreatorBrandVsMixed from "./pages/creator-brand-deals-vs-mixed-income";
import ContractorProjectRisk from "./pages/contractor-project-based-risk";
import LawyerHourlyVsRetainer from "./pages/lawyer-hourly-vs-retainer";
// Batch 4a — Core
import IncomeStressTesting from "./pages/income-stress-testing-explained";
import IncomeDependency from "./pages/income-dependency-explained";
import HowStableIsYourIncome from "./pages/how-stable-is-your-income";
import IsMyIncomeStable from "./pages/is-my-income-stable";
// Batch 4a — Industry
import IncomeStabilityRetailOwners from "./pages/income-stability-retail-owners";
import IncomeStabilityHospitality from "./pages/income-stability-hospitality-workers";
import IncomeStabilityTransportation from "./pages/income-stability-transportation-workers";
// Batch 4b — Scenarios
import DoctorSalaryVsPractice from "./pages/doctor-salary-vs-private-practice";
import InsuranceRenewalVsNew from "./pages/insurance-renewal-vs-new-business";
import MortgageRefiDependent from "./pages/mortgage-refi-dependent";
import FreelancerNoRecurring from "./pages/freelancer-no-recurring-income";
import FreelancerHalfRetainer from "./pages/freelancer-50-percent-retainer";
import RealEstateBoomVsSlow from "./pages/real-estate-boom-vs-slow-market";
import SalesHighPerformerRisk from "./pages/sales-high-performer-risk";
import ConsultantHighIncomeLow from "./pages/consultant-high-income-low-stability";
// Batch 5 — Final Scenarios
import CreatorViralIncomeRisk from "./pages/creator-viral-income-risk";
// Batch 6 — Score Interpretation
import WhatA35ScoreMeans from "./pages/what-a-35-score-means";
import WhatA50ScoreMeans from "./pages/what-a-50-score-means";
import WhatA72ScoreMeans from "./pages/what-a-72-score-means";
import WhatA90ScoreMeans from "./pages/what-a-90-score-means";
import Is70AGoodScore from "./pages/is-70-a-good-income-stability-score";
// Batch 6 — Governance
import ModelGovernance from "./pages/model-governance";
import HowVersioningWorks from "./pages/how-versioning-works";
import WhatRunPaywayDoesNotDo from "./pages/what-runpayway-does-not-do";
import SmallBusinessSeasonalRisk from "./pages/small-business-seasonal-risk";
import MultiIncomeProfessional from "./pages/multi-income-professional";
import SingleIncomeEarner from "./pages/single-income-earner";
import PassiveIncomeIllusion from "./pages/passive-income-illusion";
import IncomeDrop40Percent from "./pages/income-drop-40-percent";
import StopWorking30Days from "./pages/stop-working-30-days";

export default function LearnPage() {
  const { slug } = useParams();
  switch (slug) {
    // Core
    case "what-is-income-stability": return <WhatIsIncomeStability />;
    case "income-stability-explained": return <IncomeStabilityExplained />;
    case "how-to-measure-income-stability": return <HowToMeasureIncomeStability />;
    case "income-stability-vs-credit-score": return <IncomeStabilityVsCreditScore />;
    case "income-stability-vs-income": return <IncomeStabilityVsIncome />;
    case "income-stability-vs-net-worth": return <IncomeStabilityVsNetWorth />;
    case "what-is-income-structure": return <WhatIsIncomeStructure />;
    case "income-structure-explained": return <IncomeStructureExplained />;
    case "what-makes-income-stable": return <WhatMakesIncomeStable />;
    case "what-makes-income-unstable": return <WhatMakesIncomeUnstable />;
    case "income-risk-explained": return <IncomeRiskExplained />;
    case "income-fragility-explained": return <IncomeFragilityExplained />;
    case "income-continuity-explained": return <IncomeContinuityExplained />;
    case "income-concentration-risk": return <IncomeConcentrationRisk />;
    case "active-vs-passive-income-stability": return <ActiveVsPassive />;
    case "recurring-vs-non-recurring-income": return <RecurringVsNonRecurring />;
    case "predictable-vs-unpredictable-income": return <PredictableVsUnpredictable />;
    case "how-income-breaks-under-pressure": return <HowIncomeBreaks />;
    case "structural-income-risk-explained": return <StructuralIncomeRisk />;
    case "income-stability-index": return <IncomeStabilityIndex />;
    case "how-to-improve-income-stability": return <HowToImproveIncomeStability />;
    // Industry
    case "income-stability-real-estate-agents": return <IncomeStabilityRealEstateAgents />;
    case "income-stability-freelancers": return <IncomeStabilityFreelancers />;
    case "income-stability-consultants": return <IncomeStabilityConsultants />;
    case "income-stability-sales-professionals": return <IncomeStabilitySalesProfessionals />;
    case "income-stability-insurance-agents": return <IncomeStabilityInsuranceAgents />;
    case "income-stability-mortgage-brokers": return <IncomeStabilityMortgageBrokers />;
    case "income-stability-lawyers": return <IncomeStabilityLawyers />;
    case "income-stability-doctors": return <IncomeStabilityDoctors />;
    case "income-stability-contractors": return <IncomeStabilityContractors />;
    case "income-stability-creators": return <IncomeStabilityCreators />;
    case "income-stability-tech-workers": return <IncomeStabilityTechWorkers />;
    case "income-stability-small-business-owners": return <IncomeStabilitySmallBusiness />;
    // Scenarios
    case "150k-freelancer-one-client": return <FreelancerOneClient />;
    case "150k-freelancer-five-clients": return <FreelancerFiveClients />;
    case "200k-realtor-commission-heavy": return <RealtorCommissionHeavy />;
    case "200k-realtor-diversified-pipeline": return <RealtorDiversifiedPipeline />;
    case "consultant-no-contracts-vs-retainers": return <ConsultantContractsVsRetainers />;
    case "sales-rep-base-plus-commission": return <SalesRepBaseCommission />;
    case "business-owner-one-vs-three-sources": return <BusinessOwnerSources />;
    case "creator-brand-deals-vs-mixed-income": return <CreatorBrandVsMixed />;
    case "contractor-project-based-risk": return <ContractorProjectRisk />;
    case "lawyer-hourly-vs-retainer": return <LawyerHourlyVsRetainer />;
    case "doctor-salary-vs-private-practice": return <DoctorSalaryVsPractice />;
    case "insurance-renewal-vs-new-business": return <InsuranceRenewalVsNew />;
    case "mortgage-refi-dependent": return <MortgageRefiDependent />;
    case "freelancer-no-recurring-income": return <FreelancerNoRecurring />;
    case "freelancer-50-percent-retainer": return <FreelancerHalfRetainer />;
    case "real-estate-boom-vs-slow-market": return <RealEstateBoomVsSlow />;
    case "sales-high-performer-risk": return <SalesHighPerformerRisk />;
    case "consultant-high-income-low-stability": return <ConsultantHighIncomeLow />;
    // Core (batch 4a)
    case "income-stress-testing-explained": return <IncomeStressTesting />;
    case "income-dependency-explained": return <IncomeDependency />;
    case "how-stable-is-your-income": return <HowStableIsYourIncome />;
    case "is-my-income-stable": return <IsMyIncomeStable />;
    // Industry (batch 4a)
    case "income-stability-retail-owners": return <IncomeStabilityRetailOwners />;
    case "income-stability-hospitality-workers": return <IncomeStabilityHospitality />;
    case "income-stability-transportation-workers": return <IncomeStabilityTransportation />;
    // Final Scenarios (batch 5)
    case "creator-viral-income-risk": return <CreatorViralIncomeRisk />;
    case "small-business-seasonal-risk": return <SmallBusinessSeasonalRisk />;
    case "multi-income-professional": return <MultiIncomeProfessional />;
    case "single-income-earner": return <SingleIncomeEarner />;
    case "passive-income-illusion": return <PassiveIncomeIllusion />;
    case "income-drop-40-percent": return <IncomeDrop40Percent />;
    case "stop-working-30-days": return <StopWorking30Days />;
    // Score Interpretation
    case "what-a-35-score-means": return <WhatA35ScoreMeans />;
    case "what-a-50-score-means": return <WhatA50ScoreMeans />;
    case "what-a-72-score-means": return <WhatA72ScoreMeans />;
    case "what-a-90-score-means": return <WhatA90ScoreMeans />;
    case "is-70-a-good-income-stability-score": return <Is70AGoodScore />;
    // Governance
    case "model-governance": return <ModelGovernance />;
    case "how-versioning-works": return <HowVersioningWorks />;
    case "what-runpayway-does-not-do": return <WhatRunPaywayDoesNotDo />;
    default: return <div style={{ minHeight: "60vh", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "system-ui", color: "#5E6873" }}>This page is coming soon.</div>;
  }
}
