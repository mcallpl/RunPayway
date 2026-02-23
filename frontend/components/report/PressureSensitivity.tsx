interface PressureSensitivityProps {
  pressureIndex: number;
  pressureLabel: string;
}

export default function PressureSensitivity({
  pressureIndex,
  pressureLabel,
}: PressureSensitivityProps) {
  return (
    <div className="py-14 md:py-[72px] border-t border-gray-100">
      <h2 className="text-xs font-semibold uppercase tracking-[0.14em] text-gray-400 mb-6">
        Structural Pressure Sensitivity
      </h2>

      <p className="text-lg font-semibold text-navy-900">
        {pressureLabel} ({pressureIndex}%)
      </p>

      <p className="text-sm text-gray-500 mt-3">
        Higher values indicate greater vulnerability under operational pressure.
      </p>
    </div>
  );
}
