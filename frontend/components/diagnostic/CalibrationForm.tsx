import { INDUSTRIES, REVENUE_MODELS, ROLES } from "@/lib/constants";
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

  return (
    <div className="space-y-10">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-navy-900 mb-2">
          Calibration
        </h2>
        <p className="text-gray-600 leading-relaxed">
          Before beginning the diagnostic, select the three inputs below. These
          calibrate the assessment to reflect the structural reality of your
          income environment.
        </p>
      </div>

      {/* Fields */}
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

      {/* Info */}
      <div className="border border-gray-200 p-5 bg-slate-50">
        <p className="text-sm text-gray-600 leading-relaxed">
          Calibration adjusts the relative weight of each question group. It
          does not change the scoring logic, answer values, or rating band
          thresholds. These selections cannot be changed after the diagnostic
          begins.
        </p>
      </div>

      {/* Submit */}
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
