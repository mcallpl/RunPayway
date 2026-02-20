interface ExposureProfileProps {
  pressureIndex: number;
  pressureLabel: string;
  attentionDependenceLabel: string;
  contractDisruptionLabel: string;
  clientTurnoverLabel: string;
}

const severityColors: Record<string, string> = {
  "Lower Sensitivity": "text-emerald-700 bg-emerald-50 border-emerald-200",
  "Moderate Sensitivity": "text-blue-700 bg-blue-50 border-blue-200",
  "Elevated Sensitivity": "text-amber-700 bg-amber-50 border-amber-200",
  "High Sensitivity": "text-red-700 bg-red-50 border-red-200",
  "Lower Impact": "text-emerald-700 bg-emerald-50 border-emerald-200",
  "Moderate Impact": "text-blue-700 bg-blue-50 border-blue-200",
  "Elevated Impact": "text-amber-700 bg-amber-50 border-amber-200",
  "High Impact": "text-red-700 bg-red-50 border-red-200",
};

function SeverityBadge({ label }: { label: string }) {
  const color =
    severityColors[label] || "text-gray-700 bg-gray-50 border-gray-200";
  return (
    <span
      className={`inline-block text-xs font-semibold px-3 py-1.5 border ${color}`}
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
        "Composite index measuring sensitivity to external disruption across all structural dimensions. Higher values indicate greater vulnerability to revenue interruption.",
      label: pressureLabel,
      detail: `${pressureIndex} / 100`,
    },
    {
      title: "Attention Dependence Impact",
      description:
        "Measures the degree to which revenue continuity depends on direct personal involvement. Reflects how income behaves when the primary operator is absent.",
      label: attentionDependenceLabel,
      detail: null,
    },
    {
      title: "Contract Disruption Impact",
      description:
        "Evaluates exposure to revenue loss from contractual fragility — including short-term agreements, informal arrangements, and renewal dependency.",
      label: contractDisruptionLabel,
      detail: null,
    },
    {
      title: "Client Turnover Impact",
      description:
        "Assesses risk from client concentration and acquisition dependency. Measures how revenue would respond to the loss of key clients or accounts.",
      label: clientTurnoverLabel,
      detail: null,
    },
  ];

  return (
    <div className="mb-12">
      <h2 className="text-xs font-semibold uppercase tracking-[0.14em] text-gray-400 mb-2">
        Structural Exposure Profile
      </h2>
      <p className="text-sm text-gray-500 leading-relaxed mb-6">
        Exposure indicators identify specific dimensions of structural
        vulnerability. Each indicator is derived from diagnostic responses and
        calibrated to the selected industry and role profile.
      </p>

      <div className="space-y-4">
        {indicators.map((item) => (
          <div
            key={item.title}
            className="border border-gray-200 p-5"
          >
            <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-3">
              <div className="flex-1">
                <p className="font-semibold text-navy-900 text-sm mb-1">
                  {item.title}
                </p>
                <p className="text-xs text-gray-500 leading-relaxed">
                  {item.description}
                </p>
              </div>
              <div className="flex items-center gap-3 flex-shrink-0">
                {item.detail && (
                  <span className="text-sm text-navy-900 font-bold font-mono tabular-nums">
                    {item.detail}
                  </span>
                )}
                <SeverityBadge label={item.label} />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
