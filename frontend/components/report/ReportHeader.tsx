interface ReportHeaderProps {
  assessmentId: string;
  assessmentDate: string;
  modelVersion: string;
  industry: string;
  revenueModel: string;
  role: string;
}

function formatLabel(value: string): string {
  return value
    .replace(/_/g, " ")
    .split(" ")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
    .join(" ");
}

function formatDate(dateStr: string): string {
  try {
    const d = new Date(dateStr + "T00:00:00");
    return d.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  } catch {
    return dateStr;
  }
}

export default function ReportHeader({
  assessmentId,
  assessmentDate,
  modelVersion,
  industry,
  revenueModel,
  role,
}: ReportHeaderProps) {
  return (
    <div className="border-b border-gray-200 pb-10 mb-12">
      {/* Title */}
      <p className="text-xs font-semibold uppercase tracking-[0.14em] text-gray-400 mb-1">
        Income Structure Diagnostic
      </p>
      <h1 className="text-2xl md:text-3xl font-bold text-navy-900 tracking-tight mb-8">
        RunPayway&#8482; Structural Report
      </h1>

      {/* Meta Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
        <div>
          <p className="text-[11px] uppercase tracking-wider text-gray-400 font-medium mb-1">
            Assessment ID
          </p>
          <p className="text-sm text-navy-900 font-semibold font-mono">
            {assessmentId}
          </p>
        </div>
        <div>
          <p className="text-[11px] uppercase tracking-wider text-gray-400 font-medium mb-1">
            Assessment Date
          </p>
          <p className="text-sm text-navy-900 font-semibold">
            {formatDate(assessmentDate)}
          </p>
        </div>
        <div>
          <p className="text-[11px] uppercase tracking-wider text-gray-400 font-medium mb-1">
            Model Version
          </p>
          <p className="text-sm text-navy-900 font-semibold font-mono">
            {modelVersion}
          </p>
        </div>
        <div>
          <p className="text-[11px] uppercase tracking-wider text-gray-400 font-medium mb-1">
            Deterministic Standard
          </p>
          <p className="text-sm text-navy-900 font-semibold">
            Fixed Criteria
          </p>
        </div>
      </div>

      {/* Calibration Profile */}
      <div className="bg-slate-50 border border-gray-100 px-5 py-4">
        <p className="text-[11px] uppercase tracking-wider text-gray-400 font-medium mb-3">
          Calibration Profile
        </p>
        <div className="grid grid-cols-3 gap-4">
          <div>
            <p className="text-[11px] text-gray-400 mb-0.5">Industry</p>
            <p className="text-sm text-navy-900 font-semibold">
              {formatLabel(industry)}
            </p>
          </div>
          <div>
            <p className="text-[11px] text-gray-400 mb-0.5">Revenue Model</p>
            <p className="text-sm text-navy-900 font-semibold">
              {formatLabel(revenueModel)}
            </p>
          </div>
          <div>
            <p className="text-[11px] text-gray-400 mb-0.5">Role</p>
            <p className="text-sm text-navy-900 font-semibold">
              {formatLabel(role)}
            </p>
          </div>
        </div>
        <p className="text-[11px] text-gray-400 mt-3">
          Calibration adjusts group-level weight emphasis. It does not alter
          question scoring, band thresholds, or normalization logic.
        </p>
      </div>
    </div>
  );
}
