interface CompositionDisplayProps {
  structuralPct: number;
  directPct: number;
}

export default function CompositionDisplay({
  structuralPct,
  directPct,
}: CompositionDisplayProps) {
  return (
    <div className="mb-12">
      <h2 className="text-xs font-semibold uppercase tracking-[0.14em] text-gray-400 mb-2">
        Structural Revenue Composition
      </h2>
      <p className="text-sm text-gray-500 leading-relaxed mb-6">
        Composition reflects the balance between revenue supported by structural
        mechanisms and revenue dependent on direct personal involvement.
      </p>

      <div className="space-y-6">
        {/* Structural Revenue */}
        <div>
          <div className="flex items-baseline justify-between mb-2">
            <div>
              <span className="text-sm font-semibold text-navy-900">
                Structural Revenue
              </span>
              <span className="text-xs text-gray-400 ml-2">
                Core Revenue Flow + Stability Indicators
              </span>
            </div>
            <span className="text-lg font-bold text-navy-900 tabular-nums">
              {structuralPct}%
            </span>
          </div>
          <div className="w-full h-3 bg-gray-100 rounded-sm overflow-hidden">
            <div
              className="h-full bg-navy-900 rounded-sm transition-all duration-500"
              style={{ width: `${structuralPct}%` }}
            />
          </div>
        </div>

        {/* Direct Involvement */}
        <div>
          <div className="flex items-baseline justify-between mb-2">
            <div>
              <span className="text-sm font-semibold text-gray-600">
                Direct Involvement
              </span>
              <span className="text-xs text-gray-400 ml-2">
                Modifiers (concentration, exposure, dynamics)
              </span>
            </div>
            <span className="text-lg font-bold text-gray-500 tabular-nums">
              {directPct}%
            </span>
          </div>
          <div className="w-full h-3 bg-gray-100 rounded-sm overflow-hidden">
            <div
              className="h-full bg-gray-400 rounded-sm transition-all duration-500"
              style={{ width: `${directPct}%` }}
            />
          </div>
        </div>
      </div>

      <div className="mt-6 border border-gray-100 bg-slate-50/50 px-4 py-3">
        <p className="text-xs text-gray-400 leading-relaxed">
          <strong className="text-gray-500">Structural Revenue</strong> reflects
          income that continues without direct personal effort — supported by
          contracts, recurring arrangements, and system-level mechanisms.{" "}
          <strong className="text-gray-500">Direct Involvement</strong> reflects
          income that requires ongoing personal action — influenced by client
          concentration, acquisition dependency, and contractual exposure.
        </p>
      </div>
    </div>
  );
}
