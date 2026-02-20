interface DirectionIndicatorProps {
  direction: string;
}

export default function DirectionIndicator({
  direction,
}: DirectionIndicatorProps) {
  return (
    <div className="mb-10">
      <h2 className="text-sm font-semibold uppercase tracking-wider text-gray-400 mb-6">
        Structural Direction Indicator
      </h2>

      <div className="border border-gray-200 p-6 bg-slate-50">
        <p className="text-navy-900 leading-relaxed">{direction}</p>
        <p className="text-xs text-gray-400 mt-3">
          This indicator identifies the primary area constraining structural
          support, based on the lowest-scoring question group after
          calibration.
        </p>
      </div>
    </div>
  );
}
