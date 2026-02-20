interface DirectionIndicatorProps {
  direction: string;
}

export default function DirectionIndicator({
  direction,
}: DirectionIndicatorProps) {
  return (
    <div className="mb-12">
      <h2 className="text-xs font-semibold uppercase tracking-[0.14em] text-gray-400 mb-2">
        Structural Direction Indicator
      </h2>
      <p className="text-sm text-gray-500 leading-relaxed mb-6">
        Identifies the primary area constraining structural support, based on
        the lowest-scoring question group after calibration weighting.
      </p>

      <div className="border border-gray-200 p-6 bg-slate-50">
        <p className="text-navy-900 leading-relaxed font-medium">
          {direction}
        </p>
      </div>

      <p className="text-xs text-gray-400 mt-3 leading-relaxed">
        This indicator reflects where structural reinforcement would have the
        greatest impact on overall rating improvement. It does not prescribe
        specific actions — it identifies the structural dimension most
        constraining the current Payway Rating.
      </p>
    </div>
  );
}
