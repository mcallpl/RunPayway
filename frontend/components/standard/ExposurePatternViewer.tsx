"use client";

import { useCalibration } from "@/lib/calibration-context";
import {
  GENERIC_PATTERNS,
  getPatternsForCalibration,
} from "@/lib/exposure-patterns";

export default function ExposurePatternViewer() {
  const { isComplete, mounted, calibration } = useCalibration();

  const patterns =
    mounted && isComplete
      ? getPatternsForCalibration(calibration.revenueModel)
      : GENERIC_PATTERNS;

  return (
    <div className="mt-16">
      <h2 className="text-[26px] md:text-[30px] font-semibold text-navy-900">
        Common Exposure Patterns (Contextual)
      </h2>
      <p className="mt-2 text-sm text-gray-500">
        These are interpretive patterns only. The diagnostic defines your
        measured position.
      </p>

      <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
        {patterns.map((pattern) => (
          <div
            key={pattern.name}
            className="border border-gray-100 rounded-lg p-6"
          >
            <h3 className="text-[16px] font-medium text-navy-900">
              {pattern.name}
            </h3>

            <p className="mt-3 text-sm text-gray-600 leading-[1.6]">
              {pattern.reflects}
            </p>

            <div className="mt-4">
              <p className="text-xs text-gray-400 uppercase tracking-wider mb-2">
                Where it tends to surface
              </p>
              <ul className="space-y-2">
                {pattern.surfaces.map((s, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-gray-600">
                    <span className="text-gray-300 mt-0.5">&bull;</span>
                    <span>{s}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="mt-4 pt-4 border-t border-gray-50">
              <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">
                What the diagnostic clarifies
              </p>
              <p className="text-sm text-gray-600">{pattern.clarifies}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
