interface ExposureProfileProps {
  contractDisruptionLabel: string;
  clientTurnoverLabel: string;
}

function stripSuffix(label: string): string {
  return label.replace(/ Impact$/, "").replace(/ Sensitivity$/, "");
}

export default function ExposureProfile({
  contractDisruptionLabel,
  clientTurnoverLabel,
}: ExposureProfileProps) {
  const determinants = [
    { name: "Contract Disruption Impact", level: stripSuffix(contractDisruptionLabel) },
    { name: "Client Turnover Impact", level: stripSuffix(clientTurnoverLabel) },
  ];

  return (
    <div className="py-14 md:py-[72px] border-t border-gray-100">
      <h2 className="text-xs font-semibold uppercase tracking-[0.14em] text-gray-400 mb-6">
        Impact Determinants
      </h2>

      <div className="space-y-4">
        {determinants.map((d) => (
          <div key={d.name} className="flex items-baseline gap-3">
            <span className="text-sm font-semibold text-navy-900">{d.name}</span>
            <span className="text-gray-300">&mdash;</span>
            <span className="text-sm text-gray-600">{d.level}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
