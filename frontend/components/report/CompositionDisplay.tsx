interface CompositionDisplayProps {
  structuralPct: number;
  directPct: number;
}

export default function CompositionDisplay({
  structuralPct,
  directPct,
}: CompositionDisplayProps) {
  return (
    <div className="py-14 md:py-[72px] border-t border-gray-100">
      <h2 className="text-xs font-semibold uppercase tracking-[0.14em] text-gray-400 mb-6">
        Structural Signal Composition
      </h2>

      <div className="space-y-6">
        {/* Structural Pillars Share */}
        <div>
          <div className="flex items-baseline justify-between mb-2">
            <span className="text-sm font-semibold text-navy-900">
              Structural Pillars Share (Core + Stability)
            </span>
            <span className="text-lg font-bold text-navy-900 tabular-nums">
              {structuralPct}%
            </span>
          </div>
          <div className="w-full h-3 bg-gray-100 overflow-hidden">
            <div
              className="h-full bg-navy-900 transition-all duration-500"
              style={{ width: `${structuralPct}%` }}
            />
          </div>
        </div>

        {/* Direct-Involvement Share */}
        <div>
          <div className="flex items-baseline justify-between mb-2">
            <span className="text-sm font-semibold text-gray-600">
              Direct-Involvement Share (Modifiers)
            </span>
            <span className="text-lg font-bold text-gray-500 tabular-nums">
              {directPct}%
            </span>
          </div>
          <div className="w-full h-3 bg-gray-100 overflow-hidden">
            <div
              className="h-full bg-gray-400 transition-all duration-500"
              style={{ width: `${directPct}%` }}
            />
          </div>
        </div>
      </div>

      {/* Mandatory fixed clarification */}
      <p className="text-xs text-gray-400 mt-6 leading-relaxed">
        Percentages describe distribution of measured structural signal across
        pillars; not revenue allocation and not structural magnitude.
      </p>
    </div>
  );
}
