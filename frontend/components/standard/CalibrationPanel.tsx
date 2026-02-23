"use client";

import { useCalibration } from "@/lib/calibration-context";
import { INDUSTRIES, REVENUE_MODELS, ROLES } from "@/lib/constants";

export default function CalibrationPanel() {
  const { calibration, updateField, reset, isComplete, mounted, labels } =
    useCalibration();

  if (!mounted) {
    return (
      <div className="rounded-lg border border-gray-200 bg-[#F7F9FB] p-6 h-48" />
    );
  }

  return (
    <div className="rounded-lg border border-gray-200 bg-[#F7F9FB] p-6 relative overflow-hidden">
      {/* Left navy rail */}
      <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-[#0B1F2E]" />

      {/* Top row: label + capsule */}
      <div className="flex items-center justify-between mb-1 pl-4">
        <p className="text-[12px] uppercase tracking-[0.08em] text-gray-400 font-medium">
          Calibration Profile
        </p>
        <span className="text-[11px] border border-gray-300 text-gray-400 px-2.5 py-1 rounded-full">
          RP-1.0 CALIBRATED
        </span>
      </div>

      {/* Definition */}
      <p className="text-[13px] text-gray-500 mb-5 pl-4">
        Defines the structural context used for interpretation under Model
        RP-1.0.
      </p>

      {/* Row A: 3-column inputs */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-5 pl-4">
        <div>
          <label className="block text-[11px] text-gray-400 mb-1">
            Industry
          </label>
          <select
            value={calibration.industry}
            onChange={(e) => updateField("industry", e.target.value)}
            className="w-full h-[52px] text-[16px] border border-gray-200 rounded-lg px-3 text-gray-700 bg-white focus:outline-none focus:ring-2 focus:ring-[#0B1F2E] focus:ring-offset-1 cursor-pointer"
          >
            <option value="">Select industry</option>
            {INDUSTRIES.map((i) => (
              <option key={i.value} value={i.value}>
                {i.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-[11px] text-gray-400 mb-1">
            Revenue Model
          </label>
          <select
            value={calibration.revenueModel}
            onChange={(e) => updateField("revenueModel", e.target.value)}
            className="w-full h-[52px] text-[16px] border border-gray-200 rounded-lg px-3 text-gray-700 bg-white focus:outline-none focus:ring-2 focus:ring-[#0B1F2E] focus:ring-offset-1 cursor-pointer"
          >
            <option value="">Select revenue model</option>
            {REVENUE_MODELS.map((r) => (
              <option key={r.value} value={r.value}>
                {r.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-[11px] text-gray-400 mb-1">
            Operator Role
          </label>
          <select
            value={calibration.role}
            onChange={(e) => updateField("role", e.target.value)}
            className="w-full h-[52px] text-[16px] border border-gray-200 rounded-lg px-3 text-gray-700 bg-white focus:outline-none focus:ring-2 focus:ring-[#0B1F2E] focus:ring-offset-1 cursor-pointer"
          >
            <option value="">Select role</option>
            {ROLES.map((r) => (
              <option key={r.value} value={r.value}>
                {r.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Row B: Signature Output */}
      <div className="border-t border-gray-200 pt-4 pl-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-[11px] text-gray-400 mb-1">
              Calibration Signature
            </p>
            <p className="text-[15px] text-[#0B1F2E] font-medium transition-opacity duration-150">
              {isComplete
                ? `${labels.industry} \u00B7 ${labels.revenueModel} \u00B7 ${labels.role}`
                : "\u2014"}
            </p>
          </div>

          {(calibration.industry ||
            calibration.revenueModel ||
            calibration.role) && (
            <button
              onClick={reset}
              className="text-[12px] text-gray-400 hover:text-[#0B1F2E] hover:underline"
            >
              Reset profile
            </button>
          )}
        </div>

        <p className="text-[12px] text-gray-400 mt-2">
          Calibration adjusts interpretive weighting only. Base scoring criteria
          remain fixed.
        </p>
      </div>
    </div>
  );
}
