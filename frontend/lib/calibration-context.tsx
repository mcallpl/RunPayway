"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { INDUSTRIES, REVENUE_MODELS, ROLES } from "./constants";

interface CalibrationState {
  industry: string;
  revenueModel: string;
  role: string;
}

interface CalibrationContextValue {
  calibration: CalibrationState;
  updateField: (field: keyof CalibrationState, value: string) => void;
  reset: () => void;
  isComplete: boolean;
  mounted: boolean;
  labels: {
    industry: string;
    revenueModel: string;
    role: string;
  };
}

const STORAGE_KEY = "rp_calibration";

const EMPTY: CalibrationState = { industry: "", revenueModel: "", role: "" };

const CalibrationContext = createContext<CalibrationContextValue>({
  calibration: EMPTY,
  updateField: () => {},
  reset: () => {},
  isComplete: false,
  mounted: false,
  labels: { industry: "", revenueModel: "", role: "" },
});

function resolveLabels(state: CalibrationState) {
  return {
    industry:
      INDUSTRIES.find((i) => i.value === state.industry)?.label ?? "",
    revenueModel:
      REVENUE_MODELS.find((r) => r.value === state.revenueModel)?.label ?? "",
    role: ROLES.find((r) => r.value === state.role)?.label ?? "",
  };
}

export function CalibrationProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [calibration, setCalibration] = useState<CalibrationState>(EMPTY);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored) as CalibrationState;
        if (parsed.industry || parsed.revenueModel || parsed.role) {
          setCalibration(parsed);
        }
      }
    } catch {
      // ignore
    }
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(calibration));
    } catch {
      // ignore
    }
  }, [calibration, mounted]);

  const updateField = useCallback(
    (field: keyof CalibrationState, value: string) => {
      setCalibration((prev) => ({ ...prev, [field]: value }));
    },
    []
  );

  const reset = useCallback(() => {
    setCalibration(EMPTY);
  }, []);

  const isComplete =
    calibration.industry !== "" &&
    calibration.revenueModel !== "" &&
    calibration.role !== "";

  const labels = resolveLabels(calibration);

  return (
    <CalibrationContext.Provider
      value={{ calibration, updateField, reset, isComplete, mounted, labels }}
    >
      {children}
    </CalibrationContext.Provider>
  );
}

export function useCalibration() {
  return useContext(CalibrationContext);
}
