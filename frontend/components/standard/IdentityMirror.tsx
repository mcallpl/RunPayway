"use client";

import { useCalibration } from "@/lib/calibration-context";
import { getDependencyPattern } from "@/lib/identity-mirror-patterns";

export default function IdentityMirror() {
  const { isComplete, mounted, calibration, labels } = useCalibration();

  if (!mounted || !isComplete) return null;

  const pattern = getDependencyPattern(calibration.revenueModel);

  return (
    <div className="bg-gray-50 rounded-lg p-8 mt-8">
      <div className="space-y-5 text-[16px] md:text-[18px] text-gray-700 leading-[1.6]">
        <p>
          Many {labels.industry} {labels.role.toLowerCase()}s operating under a{" "}
          {labels.revenueModel.toLowerCase()} structure appear stable while
          remaining dependent on {pattern}.
        </p>

        <p className="text-navy-900 font-medium">
          Does income continue through structure &mdash; or through you?
        </p>

        <p>The diagnostic defines this precisely.</p>
      </div>
    </div>
  );
}
