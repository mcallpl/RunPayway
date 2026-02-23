interface ProgressBarProps {
  current: number;
  total: number;
  factorLabel?: string;
}

export default function ProgressBar({ current, total, factorLabel }: ProgressBarProps) {
  const percentage = Math.round((current / total) * 100);

  return (
    <div className="w-full">
      <div className="flex items-center justify-between text-sm text-gray-500 mb-1">
        <span className="font-medium text-navy-900">
          Structural Factor {current} of {total}
        </span>
        <span>{percentage}%</span>
      </div>
      {factorLabel && (
        <p className="text-xs text-gray-400 mb-2">{factorLabel}</p>
      )}
      <div className="w-full h-1.5 bg-gray-200 overflow-hidden">
        <div
          className="h-full bg-navy-900 transition-all duration-300 ease-out"
          style={{ width: `${percentage}%` }}
          role="progressbar"
          aria-valuenow={current}
          aria-valuemin={0}
          aria-valuemax={total}
          aria-label={`Structural Factor ${current} of ${total}`}
        />
      </div>
    </div>
  );
}
