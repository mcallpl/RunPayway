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

const bandDescriptions: Record<string, string> = {
  "Structurally Supported":
    "Revenue continuity is primarily maintained through structural mechanisms. Income persists independent of direct personal involvement under normal operating conditions.",
  "Mixed Structural Support":
    "Revenue is partially supported by structural mechanisms, but meaningful dependency on direct involvement remains. Continuity under absence is conditional.",
  "Attention-Weighted":
    "Revenue continuity depends significantly on direct personal involvement. Structural support exists but is insufficient to sustain income independently.",
  "Attention-Dependent":
    "Revenue is predominantly dependent on direct, ongoing personal effort. Structural support is minimal. Income continuity under absence is not reliably sustained.",
};

export default function RatingDisplay({
  displayScore,
  bandLabel,
}: RatingDisplayProps) {
  const colors = bandColors[bandLabel] || bandColors["Attention-Dependent"];
  const description = bandDescriptions[bandLabel] || "";

  return (
    <div className="mb-12">
      <h2 className="text-xs font-semibold uppercase tracking-[0.14em] text-gray-400 mb-6">
        Payway Rating&trade;
      </h2>

      <div className="flex items-start gap-8 md:gap-10">
        {/* Large Score */}
        <div className="flex-shrink-0">
          <div
            className={`w-28 h-28 md:w-36 md:h-36 flex items-center justify-center border-2 ${colors.border} ${colors.bg}`}
          >
            <span className={`text-5xl md:text-6xl font-bold ${colors.text}`}>
              {displayScore}
            </span>
          </div>
        </div>

        {/* Band + Description + Scale */}
        <div className="flex-1 min-w-0">
          <p className={`text-xl md:text-2xl font-semibold ${colors.text} mb-2`}>
            {bandLabel}
          </p>
          <p className="text-sm text-gray-500 leading-relaxed mb-5">
            {description}
          </p>

          {/* Visual Scale */}
          <div className="w-full max-w-md">
            <div className="flex h-2.5 overflow-hidden rounded-sm">
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
            <div className="flex justify-between text-[11px] text-gray-400 mt-0.5 tabular-nums">
              <span>0</span>
              <span className="ml-[15%]">40</span>
              <span className="ml-auto mr-[20%]">60</span>
              <span className="ml-auto mr-[0%]">80</span>
              <span>100</span>
            </div>
          </div>
        </div>
      </div>

      {/* Rating Bands Reference */}
      <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { range: "0\u201339", label: "Attention-Dependent", color: "border-red-400 bg-red-50/50" },
          { range: "40\u201359", label: "Attention-Weighted", color: "border-amber-400 bg-amber-50/50" },
          { range: "60\u201379", label: "Mixed Structural Support", color: "border-blue-400 bg-blue-50/50" },
          { range: "80\u2013100", label: "Structurally Supported", color: "border-emerald-400 bg-emerald-50/50" },
        ].map((band) => (
          <div
            key={band.range}
            className={`border-l-2 ${band.color} px-3 py-2`}
          >
            <p className="text-sm font-semibold text-navy-900 tabular-nums">{band.range}</p>
            <p className="text-[11px] text-gray-500">{band.label}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
