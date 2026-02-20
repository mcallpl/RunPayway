interface ExposureProfileProps {
  pressureIndex: number;
  pressureLabel: string;
  attentionDependenceLabel: string;
  contractDisruptionLabel: string;
  clientTurnoverLabel: string;
}

const severityColors: Record<string, string> = {
  "Lower Sensitivity": "text-emerald-700 bg-emerald-50",
  "Moderate Sensitivity": "text-blue-700 bg-blue-50",
  "Elevated Sensitivity": "text-amber-700 bg-amber-50",
  "High Sensitivity": "text-red-700 bg-red-50",
  "Lower Impact": "text-emerald-700 bg-emerald-50",
  "Moderate Impact": "text-blue-700 bg-blue-50",
  "Elevated Impact": "text-amber-700 bg-amber-50",
  "High Impact": "text-red-700 bg-red-50",
};

function SeverityBadge({ label }: { label: string }) {
  const color = severityColors[label] || "text-gray-700 bg-gray-50";
  return (
    <span
      className={`inline-block text-xs font-semibold px-3 py-1 ${color}`}
    >
      {label}
    </span>
  );
}

export default function ExposureProfile({
  pressureIndex,
  pressureLabel,
  attentionDependenceLabel,
  contractDisruptionLabel,
  clientTurnoverLabel,
}: ExposureProfileProps) {
  const indicators = [
    {
      title: "Structural Pressure Sensitivity",
      description:
        "Composite index measuring sensitivity to external disruption.",
      label: pressureLabel,
      detail: `Index: ${pressureIndex}/100`,
    },
    {
      title: "Attention Dependence Impact",
      description:
        "Degree to which revenue depends on direct personal involvement.",
      label: attentionDependenceLabel,
      detail: null,
    },
    {
      title: "Contract Disruption Impact",
      description:
        "Exposure to contract-related revenue loss based on contractual structure.",
      label: contractDisruptionLabel,
      detail: null,
    },
    {
      title: "Client Turnover Impact",
      description:
        "Risk from client concentration and acquisition dependency.",
      label: clientTurnoverLabel,
      detail: null,
    },
  ];

  return (
    <div className="mb-10">
      <h2 className="text-sm font-semibold uppercase tracking-wider text-gray-400 mb-6">
        Structural Exposure Profile
      </h2>

      <div className="space-y-4">
        {indicators.map((item) => (
          <div
            key={item.title}
            className="border border-gray-200 p-5 flex flex-col md:flex-row md:items-center md:justify-between gap-3"
          >
            <div className="flex-1">
              <p className="font-semibold text-navy-900 text-sm">
                {item.title}
              </p>
              <p className="text-xs text-gray-500 mt-0.5">
                {item.description}
              </p>
            </div>
            <div className="flex items-center gap-3">
              {item.detail && (
                <span className="text-xs text-gray-400 font-mono">
                  {item.detail}
                </span>
              )}
              <SeverityBadge label={item.label} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
