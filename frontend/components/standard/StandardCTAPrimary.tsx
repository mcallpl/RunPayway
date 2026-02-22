import StandardCTA from "./StandardCTA";
import AboutTheFee from "./AboutTheFee";

export default function StandardCTAPrimary() {
  return (
    <div>
      {/* Micro-line */}
      <p
        className="text-[16px] md:text-[18px] text-gray-700 leading-[1.6]"
        style={{ opacity: 0.87 }}
      >
        Measurement replaces assumption
      </p>

      {/* CTA Button — 8px below micro-line */}
      <div className="mt-2">
        <StandardCTA />
      </div>

      {/* Subtext — 16px below button */}
      <p className="mt-4 text-sm text-gray-500">
        One-time structural diagnostic &middot; Immediate formal report &middot;
        No subscription
      </p>

      {/* About the Fee — 32px below subtext */}
      <div className="mt-8">
        <AboutTheFee />
      </div>
    </div>
  );
}
