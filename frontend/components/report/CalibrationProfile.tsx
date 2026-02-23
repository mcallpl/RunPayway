interface CalibrationProfileProps {
  assessmentId: string;
  assessmentDate: string;
  modelVersion: string;
  industry: string;
  revenueModel: string;
  role: string;
  profileId: string;
  engineVersion: string;
  calibrationVersion: string;
}

function formatLabel(value: string): string {
  return value
    .replace(/_/g, " ")
    .split(" ")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
    .join(" ");
}

export default function CalibrationProfile({
  industry,
  revenueModel,
  role,
  profileId,
  engineVersion,
  calibrationVersion,
}: CalibrationProfileProps) {
  return (
    <div className="py-14 md:py-[72px] border-t border-gray-100">
      <h2 className="text-xs font-semibold uppercase tracking-[0.14em] text-gray-400 mb-6">
        Calibration Profile (Bounded Context)
      </h2>

      <div className="border border-gray-200 px-6 py-5">
        {/* Calibration fields */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
          <div>
            <p className="text-[11px] uppercase tracking-wider text-gray-400 font-medium mb-0.5">
              Industry
            </p>
            <p className="text-sm text-navy-900 font-semibold">
              {formatLabel(industry)}
            </p>
          </div>
          <div>
            <p className="text-[11px] uppercase tracking-wider text-gray-400 font-medium mb-0.5">
              Revenue Model
            </p>
            <p className="text-sm text-navy-900 font-semibold">
              {formatLabel(revenueModel)}
            </p>
          </div>
          <div>
            <p className="text-[11px] uppercase tracking-wider text-gray-400 font-medium mb-0.5">
              Role
            </p>
            <p className="text-sm text-navy-900 font-semibold">
              {formatLabel(role)}
            </p>
          </div>
          <div>
            <p className="text-[11px] uppercase tracking-wider text-gray-400 font-medium mb-0.5">
              Profile ID
            </p>
            <p className="text-sm text-navy-900 font-semibold font-mono">
              {profileId}
            </p>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-gray-100 my-4" />

        {/* Disclosure */}
        <p className="text-xs text-gray-500 leading-relaxed">
          Calibrated to selected industry, revenue model, and role using bounded
          group-level emphasis. Core structural logic remains unchanged.
        </p>

        {/* Engine versions */}
        <div className="flex gap-6 mt-3 text-[11px] text-gray-400 font-mono">
          <span>Engine: {engineVersion}</span>
          <span>Calibration: {calibrationVersion}</span>
        </div>
      </div>
    </div>
  );
}
