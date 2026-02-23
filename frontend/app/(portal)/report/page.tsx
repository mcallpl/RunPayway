"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import Link from "next/link";
import RatingDisplay from "@/components/report/RatingDisplay";
import PillarBreakdown from "@/components/report/PillarBreakdown";
import CompositionDisplay from "@/components/report/CompositionDisplay";
import PressureSensitivity from "@/components/report/PressureSensitivity";
import ExposureProfile from "@/components/report/ExposureProfile";
import CalibrationProfile from "@/components/report/CalibrationProfile";
import ReportFooter from "@/components/report/ReportFooter";

const API_BASE = "https://peoplestar.com/RunPayway/api";

interface OutputPayload {
  payway_rating: number;
  dependency_classification: string;
  structure_supported_composition_pct: number;
  direct_involvement_composition_pct: number;
  structural_pressure_index: number;
  structural_pressure_label: string;
  attention_dependence_pct: number;
  attention_dependence_label: string;
  contract_disruption_impact_label: string;
  client_turnover_impact_label: string;
  structural_direction_indicator: string;
  structural_position_text: string;
  industry: string;
  revenue_model: string;
  role: string;
  profile_id: string;
  engine_version: string;
  calibration_version: string;
  assessment_id: string;
  assessment_date: string;
}

interface ReportAPIResponse {
  status: string;
  message?: string;
  assessment_id?: string;
  assessment_date?: string;
  model_version?: string;
  prepared_for_name?: string;
  output?: OutputPayload;
  error?: string;
}

type PageStatus = "loading" | "ready" | "error" | "expired";

function ReportContent() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token") || "";

  const [status, setStatus] = useState<PageStatus>(token ? "loading" : "error");
  const [report, setReport] = useState<OutputPayload | null>(null);
  const [reportTitle, setReportTitle] = useState("");
  const [meta, setMeta] = useState<{
    assessment_id: string;
    assessment_date: string;
    model_version: string;
  } | null>(null);
  const [errorMessage, setErrorMessage] = useState(
    token ? "" : "No access token provided."
  );
  const [downloading, setDownloading] = useState(false);

  useEffect(() => {
    if (!token) return;

    async function fetchReport() {
      try {
        const response = await fetch(
          `${API_BASE}/get_report.php?token=${encodeURIComponent(token)}`
        );
        const data: ReportAPIResponse = await response.json();

        if (data.status === "success" && data.output) {
          setReport(data.output);
          setReportTitle(
            data.prepared_for_name || ""
          );
          setMeta({
            assessment_id: data.assessment_id || data.output.assessment_id,
            assessment_date: data.assessment_date || data.output.assessment_date,
            model_version: data.model_version || "RP-1.0",
          });
          setStatus("ready");
        } else if (data.message?.includes("expired")) {
          setStatus("expired");
        } else {
          setStatus("error");
          setErrorMessage(data.message || data.error || "Unable to load report.");
        }
      } catch {
        setStatus("error");
        setErrorMessage(
          "Unable to load report. Please check your connection and try again."
        );
      }
    }

    fetchReport();
  }, [token]);

  const handleDownload = async () => {
    setDownloading(true);
    try {
      const response = await fetch(
        `${API_BASE}/download_report.php?token=${encodeURIComponent(token)}`
      );

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        throw new Error(errorData?.error || "Download failed");
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `RunPayway-Report-${meta?.assessment_id || "report"}.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (err) {
      alert(
        err instanceof Error
          ? err.message
          : "Unable to download report. Please try again."
      );
    } finally {
      setDownloading(false);
    }
  };

  // --- Loading ---
  if (status === "loading") {
    return (
      <section className="py-20 bg-white min-h-[80vh]">
        <div className="max-w-[1100px] mx-auto px-6 text-center">
          <div className="inline-block w-8 h-8 border-2 border-navy-900 border-t-transparent animate-spin mb-6" />
          <p className="text-lg font-semibold text-navy-900">
            Loading Report...
          </p>
        </div>
      </section>
    );
  }

  // --- Expired ---
  if (status === "expired") {
    return (
      <section className="py-20 bg-white min-h-[80vh]">
        <div className="max-w-[600px] mx-auto px-6 text-center">
          <h1 className="text-2xl font-bold text-navy-900 mb-4">
            Report Access Expired
          </h1>
          <p className="text-gray-600 mb-6">
            This report link has expired. Report links are valid for 30 days
            after purchase. If you believe this is an error, please contact us.
          </p>
          <Link
            href="/contact/"
            className="inline-block bg-navy-900 text-white px-8 py-3 font-medium hover:bg-navy-800 transition-colors"
          >
            Contact Support
          </Link>
        </div>
      </section>
    );
  }

  // --- Error ---
  if (status === "error" || !report || !meta) {
    return (
      <section className="py-20 bg-white min-h-[80vh]">
        <div className="max-w-[600px] mx-auto px-6 text-center">
          <h1 className="text-2xl font-bold text-navy-900 mb-4">
            Unable to Load Report
          </h1>
          <p className="text-gray-600 mb-6">{errorMessage}</p>
          <Link
            href="/contact/"
            className="inline-block bg-navy-900 text-white px-8 py-3 font-medium hover:bg-navy-800 transition-colors"
          >
            Contact Support
          </Link>
        </div>
      </section>
    );
  }

  // --- Ready: Report ---
  const displayTitle =
    reportTitle.trim() || "RunPayway\u2122 Structural Report";

  function formatDate(dateStr: string): string {
    try {
      const d = new Date(dateStr + "T00:00:00");
      return d.toISOString().split("T")[0];
    } catch {
      return dateStr;
    }
  }

  return (
    <section className="bg-white">
      {/* Header Bar: Logo left, Title/ID/Date right */}
      <div className="max-w-[1100px] mx-auto px-6 py-10 md:py-14">
        <div className="flex items-start justify-between gap-6">
          {/* Left: Logo */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/RunPayway/images/logo.png"
            alt="RunPayway"
            className="h-[22px] md:h-[26px] w-auto mt-1 shrink-0"
          />

          {/* Right: Title + ID + Date */}
          <div className="text-right min-w-0">
            <p className="text-base md:text-lg font-semibold text-navy-900 truncate">
              {displayTitle}
            </p>
            <p className="text-xs text-gray-400 mt-1 font-mono">
              {meta.assessment_id}
            </p>
            <p className="text-xs text-gray-400 mt-0.5">
              {formatDate(meta.assessment_date)}
            </p>
          </div>
        </div>
      </div>

      {/* Payway Rating (full-width navy hero) */}
      <RatingDisplay
        displayScore={report.payway_rating}
        bandLabel={report.dependency_classification}
      />

      <div className="max-w-[1100px] mx-auto px-6">
        {/* Pillar Breakdown (3-column grid) */}
        <PillarBreakdown
          structuralPct={report.structure_supported_composition_pct}
          pressureIndex={report.structural_pressure_index}
          pressureLabel={report.structural_pressure_label}
          attentionDependencePct={report.attention_dependence_pct}
          attentionDependenceLabel={report.attention_dependence_label}
        />

        {/* Structural Signal Composition */}
        <CompositionDisplay
          structuralPct={report.structure_supported_composition_pct}
          directPct={report.direct_involvement_composition_pct}
        />

        {/* Structural Pressure Sensitivity */}
        <PressureSensitivity
          pressureIndex={report.structural_pressure_index}
          pressureLabel={report.structural_pressure_label}
        />

        {/* Impact Determinants */}
        <ExposureProfile
          contractDisruptionLabel={report.contract_disruption_impact_label}
          clientTurnoverLabel={report.client_turnover_impact_label}
        />

        {/* Calibration Profile */}
        <CalibrationProfile
          assessmentId={report.assessment_id}
          assessmentDate={report.assessment_date}
          modelVersion={meta.model_version}
          industry={report.industry}
          revenueModel={report.revenue_model}
          role={report.role}
          profileId={report.profile_id}
          engineVersion={report.engine_version}
          calibrationVersion={report.calibration_version}
        />

        {/* Generate Formal Report (PDF) — not a numbered section */}
        <div className="py-14 md:py-[72px] border-t border-gray-100 text-center">
          <h2 className="text-xs font-semibold uppercase tracking-[0.14em] text-gray-400 mb-4">
            Generate Formal Report
          </h2>
          <p className="text-sm text-gray-600 mb-6 max-w-lg mx-auto">
            Generate your formal report (PDF). Once generated, a 24-hour access
            window begins for unlimited re-downloads.
          </p>
          <button
            type="button"
            onClick={handleDownload}
            disabled={downloading}
            className="bg-navy-900 text-white px-10 py-3 font-medium hover:bg-navy-800 transition-colors focus:outline-none focus:ring-2 focus:ring-navy-900 focus:ring-offset-2 disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {downloading
              ? "Preparing Download\u2026"
              : "Generate Formal PDF Report"}
          </button>
        </div>

        {/* Section 7: Footer (Deterministic Statement + Legal + Versions) */}
        <ReportFooter />
      </div>
    </section>
  );
}

export default function ReportPage() {
  return (
    <Suspense
      fallback={
        <section className="py-20 bg-white min-h-[80vh]">
          <div className="max-w-[1100px] mx-auto px-6 text-center">
            <div className="inline-block w-8 h-8 border-2 border-navy-900 border-t-transparent animate-spin mb-6" />
            <p className="text-lg font-semibold text-navy-900">
              Loading Report...
            </p>
          </div>
        </section>
      }
    >
      <ReportContent />
    </Suspense>
  );
}
