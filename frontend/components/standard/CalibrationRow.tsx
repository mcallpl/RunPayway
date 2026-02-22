"use client";

import { useCalibration } from "@/lib/calibration-context";
import { INDUSTRIES, REVENUE_MODELS, ROLES } from "@/lib/constants";

export default function CalibrationRow() {
  const { calibration, updateField, reset, isComplete, mounted, labels } =
    useCalibration();

  if (!mounted) return <div className="h-12 border-b border-gray-100" />;

  return (
    <div className="border-b border-gray-100 bg-white">
      <div className="max-w-[1200px] mx-auto px-6 py-2.5 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-2">
        {/* Left: calibration status */}
        <p className="text-sm text-gray-400 shrink-0">
          {isComplete ? (
            <>
              Calibrated to: {labels.industry} &middot;{" "}
              {labels.revenueModel} &middot; {labels.role}
            </>
          ) : (
            "Calibration not set"
          )}
        </p>

        {/* Right: dropdowns + reset */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
          <select
            value={calibration.industry}
            onChange={(e) => updateField("industry", e.target.value)}
            className="text-xs border border-gray-200 rounded px-2 py-1.5 text-gray-600 bg-white focus:outline-none focus:ring-1 focus:ring-navy-900"
          >
            <option value="">Industry</option>
            {INDUSTRIES.map((i) => (
              <option key={i.value} value={i.value}>
                {i.label}
              </option>
            ))}
          </select>

          <select
            value={calibration.revenueModel}
            onChange={(e) => updateField("revenueModel", e.target.value)}
            className="text-xs border border-gray-200 rounded px-2 py-1.5 text-gray-600 bg-white focus:outline-none focus:ring-1 focus:ring-navy-900"
          >
            <option value="">Revenue Model</option>
            {REVENUE_MODELS.map((r) => (
              <option key={r.value} value={r.value}>
                {r.label}
              </option>
            ))}
          </select>

          <select
            value={calibration.role}
            onChange={(e) => updateField("role", e.target.value)}
            className="text-xs border border-gray-200 rounded px-2 py-1.5 text-gray-600 bg-white focus:outline-none focus:ring-1 focus:ring-navy-900"
          >
            <option value="">Role</option>
            {ROLES.map((r) => (
              <option key={r.value} value={r.value}>
                {r.label}
              </option>
            ))}
          </select>

          {(calibration.industry ||
            calibration.revenueModel ||
            calibration.role) && (
            <button
              onClick={reset}
              className="text-xs text-gray-400 hover:text-navy-900 hover:underline whitespace-nowrap"
            >
              Reset calibration
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
