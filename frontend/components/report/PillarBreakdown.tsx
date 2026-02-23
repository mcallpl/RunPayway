interface PillarBreakdownProps {
  structuralPct: number;
  pressureIndex: number;
  pressureLabel: string;
  attentionDependencePct: number;
  attentionDependenceLabel: string;
}

export default function PillarBreakdown({
  structuralPct,
  pressureIndex,
  pressureLabel,
  attentionDependencePct,
  attentionDependenceLabel,
}: PillarBreakdownProps) {
  const pillars = [
    {
      title: "Signal Composition",
      value: `${structuralPct}%`,
      detail: "Structural share",
    },
    {
      title: "Pressure Sensitivity",
      value: `${pressureIndex}%`,
      detail: pressureLabel,
    },
    {
      title: "Attention Dependence",
      value: `${attentionDependencePct}%`,
      detail: attentionDependenceLabel,
    },
  ];

  return (
    <div className="py-14 md:py-[72px] border-t border-gray-100">
      <h2 className="text-xs font-semibold uppercase tracking-[0.14em] text-gray-400 mb-6">
        Pillar Breakdown
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {pillars.map((p) => (
          <div
            key={p.title}
            className="border border-gray-100 px-5 py-5"
          >
            <p className="text-[11px] uppercase tracking-wider text-gray-400 font-medium mb-2">
              {p.title}
            </p>
            <p className="text-2xl font-bold text-navy-900 tabular-nums">
              {p.value}
            </p>
            <p className="text-sm text-gray-500 mt-1">{p.detail}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
