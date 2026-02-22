import StandardCTA from "./StandardCTA";

export default function StandardCTAClosing() {
  return (
    <div style={{ paddingTop: "120px", paddingBottom: "48px" }}>
      <div className="space-y-6 text-[16px] md:text-[18px] text-gray-700 leading-[1.6]">
        <p>Revenue performance is commonly tracked.</p>
        <p>Revenue dependency rarely is.</p>
        <p>The Payway Rating&#8482; defines it.</p>
      </div>

      {/* Button — 24px below last line */}
      <div className="mt-6">
        <StandardCTA />
      </div>

      {/* Subtext — 16px below button */}
      <div className="mt-4 space-y-1 text-sm text-gray-500">
        <p>Immediate downloadable report.</p>
        <p>No subscription. No recurring charges.</p>
      </div>
    </div>
  );
}
