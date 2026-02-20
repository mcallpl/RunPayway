import HeroSection from "@/components/landing/HeroSection";
import ImmediateClarity from "@/components/landing/ImmediateClarity";
import WhoThisIsFor from "@/components/landing/WhoThisIsFor";
import CTABlock from "@/components/landing/CTABlock";
import ReportPreview from "@/components/landing/ReportPreview";
import WhatThisShows from "@/components/landing/WhatThisShows";
import WhyItMatters from "@/components/landing/WhyItMatters";
import PaywayRating from "@/components/landing/PaywayRating";
import RatingBands from "@/components/landing/RatingBands";
import HowItWorks from "@/components/landing/HowItWorks";
import ScopeSection from "@/components/landing/ScopeSection";
import AuthorityClose from "@/components/landing/AuthorityClose";

export default function Home() {
  return (
    <main>
      <HeroSection />
      <ImmediateClarity />
      <WhoThisIsFor />
      <CTABlock variant="primary" />
      <ReportPreview />
      <WhatThisShows />
      <WhyItMatters />
      <PaywayRating />
      <RatingBands />
      <CTABlock variant="mid" />
      <HowItWorks />
      <ScopeSection />
      <AuthorityClose />
      <CTABlock variant="final" />
    </main>
  );
}
