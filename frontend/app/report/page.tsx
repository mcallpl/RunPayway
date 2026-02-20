"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import Link from "next/link";
import PageContainer from "@/components/layout/PageContainer";
import ReportHeader from "@/components/report/ReportHeader";
import RatingDisplay from "@/components/report/RatingDisplay";
import CompositionDisplay from "@/components/report/CompositionDisplay";
import ExposureProfile from "@/components/report/ExposureProfile";
import DirectionIndicator from "@/components/report/DirectionIndicator";
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
  success: boolean;
  data?: {
    assessment_id: string;
    assessment_date: string;
    model_version: string;
    display_score: number;
    band: string;
    output_payload: OutputPayload;
  };
  error?: string;
}

type PageStatus = "loading" | "ready" | "error" | "expired";

function ReportContent() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token") || "";

  const [status, setStatus] = useState<PageStatus>(token ? "loading" : "error");
  const [report, setReport] = useState<OutputPayload | null>(null);
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

        if (data.success && data.data) {
          setReport(data.data.output_payload);
          setMeta({
            assessment_id: data.data.assessment_id,
            assessment_date: data.data.assessment_date,
            model_version: data.data.model_version,
          });
          setStatus("ready");
        } else if (data.error?.includes("expired")) {
          setStatus("expired");
        } else {
          setStatus("error");
          setErrorMessage(data.error || "Unable to load report.");
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

  if (status === "loading") {
    return (
      <section className="py-20 bg-white min-h-[80vh]">
        <PageContainer>
          <div className="max-w-[800px] mx-auto text-center">
            <div className="inline-block w-8 h-8 border-2 border-navy-900 border-t-transparent animate-spin mb-6" />
            <p className="text-lg font-semibold text-navy-900">
              Loading Report...
            </p>
          </div>
        </PageContainer>
      </section>
    );
  }

  if (status === "expired") {
    return (
      <section className="py-20 bg-white min-h-[80vh]">
        <PageContainer>
          <div className="max-w-[600px] mx-auto text-center">
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
        </PageContainer>
      </section>
    );
  }

  if (status === "error" || !report || !meta) {
    return (
      <section className="py-20 bg-white min-h-[80vh]">
        <PageContainer>
          <div className="max-w-[600px] mx-auto text-center">
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
        </PageContainer>
      </section>
    );
  }

  return (
    <section className="py-12 md:py-20 bg-white">
      <PageContainer>
        <div className="max-w-[800px] mx-auto">
          <ReportHeader
            assessmentId={report.assessment_id}
            assessmentDate={report.assessment_date}
            modelVersion={meta.model_version}
            industry={report.industry}
            revenueModel={report.revenue_model}
            role={report.role}
          />
          <RatingDisplay
            displayScore={report.payway_rating}
            bandLabel={report.dependency_classification}
          />
          <CompositionDisplay
            structuralPct={report.structure_supported_composition_pct}
            directPct={report.direct_involvement_composition_pct}
          />
          <ExposureProfile
            pressureIndex={report.structural_pressure_index}
            pressureLabel={report.structural_pressure_label}
            attentionDependenceLabel={report.attention_dependence_label}
            contractDisruptionLabel={report.contract_disruption_impact_label}
            clientTurnoverLabel={report.client_turnover_impact_label}
          />
          <DirectionIndicator
            direction={report.structural_direction_indicator}
          />
          <div className="mb-10 border border-gray-200 p-6 text-center">
            <p className="text-sm text-gray-600 mb-4">
              Download your full report as a PDF. Once downloaded, a 24-hour
              access window begins for unlimited re-downloads.
            </p>
            <button
              type="button"
              onClick={handleDownload}
              disabled={downloading}
              className="bg-navy-900 text-white px-10 py-3 font-medium hover:bg-navy-800 transition-colors focus:outline-none focus:ring-2 focus:ring-navy-900 focus:ring-offset-2 rounded-none disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {downloading ? "Preparing Download\u2026" : "Download PDF Report"}
            </button>
          </div>
          <ReportFooter
            modelVersion={meta.model_version}
            engineVersion={report.engine_version}
            calibrationVersion={report.calibration_version}
          />
        </div>
      </PageContainer>
    </section>
  );
}

export default function ReportPage() {
  return (
    <Suspense
      fallback={
        <section className="py-20 bg-white min-h-[80vh]">
          <PageContainer>
            <div className="max-w-[800px] mx-auto text-center">
              <div className="inline-block w-8 h-8 border-2 border-navy-900 border-t-transparent animate-spin mb-6" />
              <p className="text-lg font-semibold text-navy-900">
                Loading Report...
              </p>
            </div>
          </PageContainer>
        </section>
      }
    >
      <ReportContent />
    </Suspense>
  );
}
