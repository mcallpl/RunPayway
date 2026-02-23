interface RatingDisplayProps {
  displayScore: number;
  bandLabel: string;
}

const BANDS = [
  {
    min: 0,
    max: 39,
    label: "Attention-Dependent",
    color: "bg-red-500",
  },
  {
    min: 40,
    max: 59,
    label: "Attention-Weighted",
    color: "bg-amber-500",
  },
  {
    min: 60,
    max: 79,
    label: "Mixed Structural Support",
    color: "bg-blue-500",
  },
  {
    min: 80,
    max: 100,
    label: "Structurally Supported",
    color: "bg-emerald-500",
  },
];

export default function RatingDisplay({
  displayScore,
  bandLabel,
}: RatingDisplayProps) {
  const activeBandIndex = BANDS.findIndex(
    (b) => displayScore >= b.min && displayScore <= b.max
  );

  return (
    <div className="bg-[#0B1623] py-14 md:py-24">
      <div className="max-w-[1100px] mx-auto px-6 text-center">
        {/* Micro Label */}
        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-white/50 mb-2">
          Payway Rating&trade;
        </p>

        {/* Metric Definition */}
        <p className="text-sm text-white/50 mb-8 max-w-xl mx-auto">
          Measures the degree to which revenue continuity is supported by
          structural systems rather than requiring direct operator involvement.
        </p>

        {/* Large Score */}
        <p className="text-[72px] md:text-[96px] font-bold text-white/[0.92] leading-none tabular-nums">
          {displayScore}
        </p>

        {/* Band Label */}
        <p className="text-xl md:text-2xl font-semibold text-white/[0.92] mt-4 mb-12">
          {bandLabel}
        </p>

        {/* Segmented Band Bar — highlight only, no badge */}
        <div className="max-w-lg mx-auto">
          <div className="flex gap-1.5">
            {BANDS.map((band, i) => {
              const isActive = i === activeBandIndex;
              return (
                <div key={band.label} className="flex-1">
                  {/* Segment */}
                  <div
                    className={`h-3 ${isActive ? band.color : "bg-white/15"}`}
                  />
                  {/* Range label */}
                  <p
                    className={`text-xs mt-2 tabular-nums ${
                      isActive ? "text-white font-semibold" : "text-white/30"
                    }`}
                  >
                    {band.min}&ndash;{band.max}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
