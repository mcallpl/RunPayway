interface CompositionDisplayProps {
  structuralPct: number;
  directPct: number;
}

export default function CompositionDisplay({
  structuralPct,
  directPct,
}: CompositionDisplayProps) {
  return (
    <div className="mb-10">
      <h2 className="text-sm font-semibold uppercase tracking-wider text-gray-400 mb-6">
        Structural Revenue Composition
      </h2>

      <div className="space-y-5">
        {/* Structural Revenue */}
        <div>
          <div className="flex items-center justify-between text-sm mb-1.5">
            <span className="font-medium text-navy-900">
              Structural Revenue
            </span>
            <span className="font-semibold text-navy-900">
              {structuralPct}%
            </span>
          </div>
          <div className="w-full h-4 bg-gray-100 overflow-hidden">
            <div
              className="h-full bg-navy-900 transition-all duration-500"
              style={{ width: `${structuralPct}%` }}
            />
          </div>
        </div>

        {/* Direct Involvement */}
        <div>
          <div className="flex items-center justify-between text-sm mb-1.5">
            <span className="font-medium text-gray-600">
              Direct Involvement
            </span>
            <span className="font-semibold text-gray-600">{directPct}%</span>
          </div>
          <div className="w-full h-4 bg-gray-100 overflow-hidden">
            <div
              className="h-full bg-gray-400 transition-all duration-500"
              style={{ width: `${directPct}%` }}
            />
          </div>
        </div>
      </div>

      <p className="text-xs text-gray-400 mt-3">
        Structural Revenue reflects income supported by Core Revenue Flow and
        Stability Indicators. Direct Involvement reflects income dependent on
        Modifiers (concentration, client dynamics, contractual exposure).
      </p>
    </div>
  );
}
