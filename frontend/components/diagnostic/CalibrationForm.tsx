import { INDUSTRIES, REVENUE_MODELS, ROLES, DIAGNOSTIC_INSTRUCTION } from "@/lib/constants";
import type { CalibrationData } from "@/lib/types";

interface CalibrationFormProps {
  calibration: CalibrationData;
  onChange: (data: CalibrationData) => void;
  onSubmit: () => void;
}

interface SelectFieldProps {
  id: string;
  label: string;
  description: string;
  value: string;
  options: ReadonlyArray<{ value: string; label: string }>;
  onChange: (value: string) => void;
}

function SelectField({
  id,
  label,
  description,
  value,
  options,
  onChange,
}: SelectFieldProps) {
  return (
    <div>
      <label
        htmlFor={id}
        className="block text-sm font-semibold text-navy-900 mb-1"
      >
        {label}
      </label>
      <p className="text-sm text-gray-500 mb-2">{description}</p>
      <select
        id={id}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full border border-gray-300 bg-white px-4 py-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-navy-900 focus:border-navy-900 rounded-none appearance-none"
      >
        <option value="">Select...</option>
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  );
}

export default function CalibrationForm({
  calibration,
  onChange,
  onSubmit,
}: CalibrationFormProps) {
  const isComplete =
    calibration.industry !== "" &&
    calibration.revenue_model !== "" &&
    calibration.role !== "";

  const reportTitleLength = (calibration.report_title || "").length;

  return (
    <div className="space-y-10">
      {/* ── Before You Begin ─────────────────────────────── */}
      <div className="border border-gray-200 bg-slate-50 p-6">
        <h3 className="text-sm font-semibold text-navy-900 uppercase tracking-wider mb-3">
          Before You Begin
        </h3>
        <p className="text-sm text-gray-700 leading-relaxed">
          {DIAGNOSTIC_INSTRUCTION}
        </p>
      </div>

      {/* ── Report Title (Optional) ──────────────────────── */}
      <div>
        <label
          htmlFor="report-title"
          className="block text-sm font-semibold text-navy-900 mb-1"
        >
          Report Title{" "}
          <span className="font-normal text-gray-400">(Optional)</span>
        </label>
        <p className="text-sm text-gray-500 mb-2">
          A label for this report — e.g., your company name, division, or project.
        </p>
        <div className="relative">
          <input
            id="report-title"
            type="text"
            maxLength={50}
            value={calibration.report_title || ""}
            onChange={(e) =>
              onChange({ ...calibration, report_title: e.target.value })
            }
            placeholder="e.g., Acme Corp Q1 Review"
            className="w-full border border-gray-300 bg-white px-4 py-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-navy-900 focus:border-navy-900 rounded-none"
          />
          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-400 pointer-events-none">
            {reportTitleLength}/50
          </span>
        </div>
      </div>

      {/* ── Calibration Header ───────────────────────────── */}
      <div>
        <h2 className="text-2xl font-bold text-navy-900 mb-2">
          Calibration
        </h2>
        <p className="text-gray-600 leading-relaxed">
          Select the three inputs below. These calibrate the assessment to
          reflect the structural reality of your income environment.
        </p>
      </div>

      {/* ── Calibration Fields ───────────────────────────── */}
      <div className="space-y-8">
        <SelectField
          id="industry"
          label="Industry"
          description="The sector in which you primarily operate."
          value={calibration.industry}
          options={INDUSTRIES}
          onChange={(v) => onChange({ ...calibration, industry: v })}
        />

        <SelectField
          id="revenue-model"
          label="Revenue Model"
          description="The primary mechanism through which your income is generated."
          value={calibration.revenue_model}
          options={REVENUE_MODELS}
          onChange={(v) => onChange({ ...calibration, revenue_model: v })}
        />

        <SelectField
          id="role"
          label="Role"
          description="Your function within the revenue generation process."
          value={calibration.role}
          options={ROLES}
          onChange={(v) => onChange({ ...calibration, role: v })}
        />
      </div>

      {/* ── Calibration Info ─────────────────────────────── */}
      <div className="border border-gray-200 p-5 bg-slate-50">
        <p className="text-sm text-gray-600 leading-relaxed">
          Calibration adjusts the relative weight of each question group. It
          does not change the scoring logic, answer values, or rating band
          thresholds. These selections cannot be changed after the diagnostic
          begins.
        </p>
      </div>

      {/* ── Submit ───────────────────────────────────────── */}
      <button
        type="button"
        onClick={onSubmit}
        disabled={!isComplete}
        className="w-full bg-navy-900 text-white py-4 text-base font-medium hover:bg-navy-800 transition-colors focus:outline-none focus:ring-2 focus:ring-navy-900 focus:ring-offset-2 rounded-none disabled:opacity-40 disabled:cursor-not-allowed"
      >
        Begin Diagnostic
      </button>
    </div>
  );
}
