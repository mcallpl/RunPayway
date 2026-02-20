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
    .replace(/\b\w/g, (c) => c.toUpperCase());
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
    <div className="border-b border-gray-200 pb-8 mb-10">
      {/* Title */}
      <p className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-1">
        Income Structure Diagnostic
      </p>
      <h1 className="text-2xl md:text-3xl font-bold text-navy-900 mb-6">
        RunPayway&#8482; Report
      </h1>

      {/* Meta Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
        <div>
          <p className="text-gray-400 font-medium">Assessment ID</p>
          <p className="text-navy-900 font-semibold">{assessmentId}</p>
        </div>
        <div>
          <p className="text-gray-400 font-medium">Date</p>
          <p className="text-navy-900 font-semibold">{assessmentDate}</p>
        </div>
        <div>
          <p className="text-gray-400 font-medium">Model</p>
          <p className="text-navy-900 font-semibold">{modelVersion}</p>
        </div>
        <div>
          <p className="text-gray-400 font-medium">Profile</p>
          <p className="text-navy-900 font-semibold text-xs mt-0.5">
            {formatLabel(industry)}
            <br />
            {formatLabel(revenueModel)}
            <br />
            {formatLabel(role)}
          </p>
        </div>
      </div>
    </div>
  );
}
