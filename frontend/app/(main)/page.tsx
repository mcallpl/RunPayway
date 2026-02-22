import HeroSection from "@/components/landing/HeroSection";
import ReportPreview from "@/components/landing/ReportPreview";
import WhyPeopleRunThis from "@/components/landing/WhyPeopleRunThis";
import RiskOfNotMeasuring from "@/components/landing/RiskOfNotMeasuring";
import WhatRunPaywayMeasures from "@/components/landing/WhatRunPaywayMeasures";
import WhatYouReceive from "@/components/landing/WhatYouReceive";
import WhatThisHelpsYouDo from "@/components/landing/WhatThisHelpsYouDo";
import PaywayRating from "@/components/landing/PaywayRating";
import RatingBands from "@/components/landing/RatingBands";
import HowItWorks from "@/components/landing/HowItWorks";
import WhoThisIsFor from "@/components/landing/WhoThisIsFor";
import ScopeSection from "@/components/landing/ScopeSection";
import GovernanceSection from "@/components/landing/GovernanceSection";
import AuthorityClose from "@/components/landing/AuthorityClose";
import DisclosureSection from "@/components/landing/DisclosureSection";

export default function Home() {
  return (
    <main>
      {/* Section 1 — Hero (with primary CTA) */}
      <HeroSection />

      {/* Section 2 — Report Preview */}
      <ReportPreview />

      {/* Section 3 — Why People Run This */}
      <WhyPeopleRunThis />

      {/* Section 4 — The Risk of Not Measuring It */}
      <RiskOfNotMeasuring />

      {/* Section 5 — What RunPayway Measures */}
      <WhatRunPaywayMeasures />

      {/* Section 6 — What You Receive */}
      <WhatYouReceive />

      {/* Section 7 — What This Helps You Do */}
      <WhatThisHelpsYouDo />

      {/* Section 8 — The Payway Rating */}
      <PaywayRating />

      {/* Section 9 — Rating Bands */}
      <RatingBands />

      {/* Section 10 — How It Works */}
      <HowItWorks />

      {/* Section 11 — Who This Is For */}
      <WhoThisIsFor />

      {/* Section 12 — Scope */}
      <ScopeSection />

      {/* Section 13 — Governance */}
      <GovernanceSection />

      {/* Final Section — Closing CTA */}
      <AuthorityClose />

      {/* Important Disclosure */}
      <DisclosureSection />
    </main>
  );
}
