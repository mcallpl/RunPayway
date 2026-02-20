interface ProgressBarProps {
  current: number;
  total: number;
}

export default function ProgressBar({ current, total }: ProgressBarProps) {
  const percentage = Math.round((current / total) * 100);

  return (
    <div className="w-full">
      <div className="flex items-center justify-between text-sm text-gray-500 mb-2">
        <span>
          Question {current} of {total}
        </span>
        <span>{percentage}%</span>
      </div>
      <div className="w-full h-1.5 bg-gray-200 overflow-hidden">
        <div
          className="h-full bg-navy-900 transition-all duration-300 ease-out"
          style={{ width: `${percentage}%` }}
          role="progressbar"
          aria-valuenow={current}
          aria-valuemin={0}
          aria-valuemax={total}
          aria-label={`Question ${current} of ${total}`}
        />
      </div>
    </div>
  );
}
