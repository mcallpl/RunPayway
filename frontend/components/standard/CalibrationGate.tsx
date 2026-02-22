"use client";

import { useCalibration } from "@/lib/calibration-context";

export default function CalibrationGate({
  children,
  fallback,
}: {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}) {
  const { isComplete, mounted } = useCalibration();
  if (!mounted || !isComplete) return fallback ?? null;
  return <>{children}</>;
}
