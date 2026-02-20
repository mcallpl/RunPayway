interface RatingDisplayProps {
  displayScore: number;
  bandLabel: string;
}

const bandColors: Record<string, { bg: string; border: string; text: string }> = {
  "Structurally Supported": {
    bg: "bg-emerald-50",
    border: "border-emerald-500",
    text: "text-emerald-700",
  },
  "Mixed Structural Support": {
    bg: "bg-blue-50",
    border: "border-blue-500",
    text: "text-blue-700",
  },
  "Attention-Weighted": {
    bg: "bg-amber-50",
    border: "border-amber-500",
    text: "text-amber-700",
  },
  "Attention-Dependent": {
    bg: "bg-red-50",
    border: "border-red-500",
    text: "text-red-700",
  },
};

export default function RatingDisplay({
  displayScore,
  bandLabel,
}: RatingDisplayProps) {
  const colors = bandColors[bandLabel] || bandColors["Attention-Dependent"];

  return (
    <div className="mb-10">
      <h2 className="text-sm font-semibold uppercase tracking-wider text-gray-400 mb-6">
        Payway Rating
      </h2>

      <div className="flex items-center gap-8">
        {/* Large Score */}
        <div
          className={`w-32 h-32 flex items-center justify-center border-2 ${colors.border} ${colors.bg}`}
        >
          <span className={`text-5xl font-bold ${colors.text}`}>
            {displayScore}
          </span>
        </div>

        {/* Band + Scale */}
        <div className="flex-1">
          <p className={`text-xl font-semibold ${colors.text} mb-3`}>
            {bandLabel}
          </p>

          {/* Visual Scale */}
          <div className="w-full">
            <div className="flex h-3 overflow-hidden">
              <div className="bg-red-400 flex-1" />
              <div className="bg-amber-400 flex-1" />
              <div className="bg-blue-400 flex-1" />
              <div className="bg-emerald-400 flex-1" />
            </div>
            {/* Marker */}
            <div className="relative h-4 mt-1">
              <div
                className="absolute w-0 h-0 border-l-[6px] border-r-[6px] border-b-[8px] border-l-transparent border-r-transparent border-b-navy-900 -translate-x-1/2"
                style={{ left: `${displayScore}%` }}
              />
            </div>
            <div className="flex justify-between text-xs text-gray-400 mt-1">
              <span>0</span>
              <span>40</span>
              <span>60</span>
              <span>80</span>
              <span>100</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
