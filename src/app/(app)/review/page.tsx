"use client";

import { useEffect, useState, useRef, Component, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import logoImg from "../../../../public/runpayway-logo.png";
import { useAssessmentServer } from "@/lib/monitoring";

// ============================================================
// ERROR BOUNDARY
// ============================================================
class ReportErrorBoundary extends Component<
  { children: ReactNode },
  { hasError: boolean; error: string }
> {
  constructor(props: { children: ReactNode }) {
    super(props);
    this.state = { hasError: false, error: "" };
  }
  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error: error.message || "Unknown error" };
  }
  render() {
    if (this.state.hasError) {
      return (
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: "60vh", padding: 40, textAlign: "center" }}>
          <h2 style={{ fontSize: 20, fontWeight: 600, color: "#0E1A2B", marginBottom: 12 }}>
            Something went wrong loading your report
          </h2>
          <p style={{ fontSize: 14, color: "#6B7280", marginBottom: 24, maxWidth: 400 }}>
            Your assessment was saved. Please try refreshing the page. If the problem persists, contact support@runpayway.com.
          </p>
          <p style={{ fontSize: 11, color: "#9CA3AF", marginBottom: 24 }}>{this.state.error}</p>
          <button
            onClick={() => window.location.reload()}
            style={{ padding: "10px 24px", fontSize: 14, fontWeight: 500, color: "#fff", backgroundColor: "#0E1A2B", border: "none", borderRadius: 10, cursor: "pointer" }}
          >
            Refresh Page
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

// ============================================================
// SAFE JSON PARSE
// ============================================================
function safeJsonParse<T>(json: string | undefined | null, fallback: T): T {
  if (!json) return fallback;
  try {
    const parsed = JSON.parse(json);
    if (Array.isArray(fallback) && !Array.isArray(parsed)) return fallback;
    if (fallback !== null && typeof fallback === "object" && !Array.isArray(fallback) && (typeof parsed !== "object" || parsed === null || Array.isArray(parsed))) return fallback;
    return parsed;
  } catch {
    return fallback;
  }
}

interface AssessmentRecord {
  record_id: string;
  authorization_code: string;
  model_version: string;
  assessment_date_utc: string;
  issued_timestamp_utc: string;
  final_score: number;
  stability_band: string;
  assessment_title: string;
  classification: string;
  operating_structure: string;
  primary_income_model: string;
  revenue_structure: string;
  industry_sector: string;
  band_interpretation_text: string;
  primary_constraint_label: string;
  primary_constraint_text: string;
  primary_constraint_key: string;
  driver_1_label: string;
  driver_1_text: string;
  driver_2_label: string;
  driver_2_text: string;
  driver_3_label: string;
  driver_3_text: string;
  structural_priority_label: string;
  structural_priority_text: string;
  page_1_key_insight_text: string;
  page_2_key_insight_text: string;
  page_3_key_insight_text: string;
  page_4_key_insight_text: string;
  page_5_key_insight_text: string;
  page_6_key_insight_text: string;
  labor_asset_position_label: string;
  labor_asset_framework_text: string;
  labor_asset_marker_position: number;
  active_income_level: number;
  semi_persistent_income_level: number;
  persistent_income_level: number;
  income_persistence_label: string;
  income_source_diversity_label: string;
  forward_revenue_visibility_label: string;
  income_variability_label: string;
  active_labor_dependence_label: string;
  exposure_concentration_label: string;
  stability_spectrum_position: number;
  peer_benchmark_group_label: string;
  peer_benchmark_text: string;
  peer_position_marker: number;
  evolution_path_title: string;
  evolution_path_steps_payload: string;
  current_evolution_stage_label: string;
  current_evolution_stage_position: number;
  sector_mechanisms_payload: string;
  sector_avg_score: number;
  sector_top_20_threshold: number;
  peer_band_distribution_payload: string;
  constraint_guidance_payload: string;
  structural_improvement_path_text: string;
  action_plan_payload: string;
  peer_stability_percentile: number;
  peer_stability_percentile_label: string;
  projected_final_score: number;
  projected_stability_band: string;
  improvement_estimate_text: string;
  registry_visibility: string;
  income_continuity_pct: number;
  income_continuity_months: number;
  income_continuity_text: string;
  risk_scenario_score: number;
  risk_scenario_band: string;
  risk_scenario_drop: number;
  risk_scenario_text: string;
  advisor_discussion_guide_payload: string;
  product_recommendations_payload: string;
  _v2?: {
    scores?: { overall_score: number; structure_score: number; stability_score: number; quality_adjustment: number };
    fragility?: { fragility_score: number; fragility_class: string; primary_failure_mode: string; secondary_failure_modes: string[]; deductions: { trigger: string; points: number; condition_met: boolean }[] };
    confidence?: { confidence_score: number; confidence_level: string; deductions: { reason: string; points: number }[] };
    quality?: { quality_score: number; durability_grade: string; adjustments: { factor: string; delta: number; reason: string }[] };
    sensitivity?: { tests: { factor: string; delta_description: string; original_score: number; projected_score: number; lift: number; rank: number }[]; highest_lift_factor: string; bottleneck_factor: string; low_return_factor: string };
    interactions?: { effects: { code: string; type: string; points: number; trigger_condition: string; factors_involved: string[] }[]; total_penalty: number; total_bonus: number; net_adjustment: number };
    constraints?: { root_constraint: string; primary_constraint: string; secondary_constraint: string; dependent_constraint: string | null; hidden_unlock: string | null };
    scenarios?: { scenario_id: string; label: string; description: string; original_score: number; scenario_score: number; score_drop: number; original_band: string; scenario_band: string; band_shift: boolean; narrative: string }[];
    score_lift_projection?: { lift_scenarios: { scenario_id: string; label: string; change_description: string; original_score: number; projected_score: number; lift: number; projected_band: string; band_shift: boolean }[]; combined_top_two: { label: string; change_description: string; projected_score: number; lift: number; projected_band: string; band_shift: boolean }; highest_single_lift: { label: string; lift: number; projected_score: number } };
    recommended_actions?: { action_id: string; priority: number; label: string; description: string; category: string; expected_impact: string; blocked_until?: string; sequencing_note?: string }[];
    avoid_actions?: { action_id: string; label: string; reason: string }[];
    reassessment_triggers?: { trigger_id: string; condition: string; threshold: string; current_value: string; description: string }[];
    benchmarks?: { peer_percentile: number; cluster_average_score: number; top_20_threshold: number; peer_band_distribution: { limited: number; developing: number; established: number; high: number }; outlier_dimensions: { factor: string; user_value: number; peer_average: number; direction: string; magnitude: string }[] };
    indicators?: { key: string; label: string; raw_value: number; normalized_value: number; level: string }[];
    outcome_layer?: {
      income_model_family: { family_id: string; family_label: string };
      industry_refinement_profile: { industry_id: string; industry_label: string } | null;
      selected_scenarios: { scenario_id: string; label: string; description: string; severity: string; why_it_matters: string }[];
      stronger_structure_patterns: string[];
      ranked_action_map: { rank: number; action_id: string; label: string; description: string; why_now: string; expected_effect: string }[];
      avoid_actions: string[];
      reassessment_trigger_set: { trigger_id: string; condition: string; display_text: string }[];
      explanation_translation_layer: Record<string, string>;
      benchmark_context_layer: { framing_text: string; peer_group_label: string; typical_score_range: { low: number; mid: number; high: number }; common_strengths: string[]; common_weaknesses: string[] } | null;
    };
  };
}

// ============================================================
// BRAND — Refined Institutional Design System
// ============================================================
const B = {
  navy: "#0E1A2B",
  ink: "#0E1A2B",
  sand: "#FFFFFF",
  bone: "#F8F6F1",
  white: "#FFFFFF",
  stone: "rgba(14,26,43,0.12)",
  taupe: "rgba(14,26,43,0.42)",
  muted: "rgba(14,26,43,0.58)",
  purple: "#4B3FAE",
  teal: "#1F6D7A",
  bandLimited: "#9B2C2C",
  bandDeveloping: "#92640A",
  bandEstablished: "#2B5EA7",
  bandHigh: "#1F6D7A",
};

// ============================================================
// SPACING + TYPOGRAPHY TOKENS
// ============================================================
const R = {
  pagePad: 40,
  headerMb: 16,
  sectionGap: 16,
  labelMb: 8,
  paraMb: 12,
  itemGap: 10,
  dividerMy: 16,
  footerMt: 16,
};

const T = {
  score: { fontSize: 72, fontWeight: 600, lineHeight: 1 },
  pageTitle: { fontSize: 24, fontWeight: 600, lineHeight: 1.2, color: "#0E1A2B" },
  classification: { fontSize: 16, fontWeight: 500, lineHeight: 1.3 },
  overline: { fontSize: 10, fontWeight: 600, lineHeight: 1.3, letterSpacing: "0.12em", textTransform: "uppercase" as const },
  sectionLabel: { fontSize: 12, fontWeight: 600, lineHeight: 1.35 },
  cardHeading: { fontSize: 13, fontWeight: 600, lineHeight: 1.35 },
  body: { fontSize: 11.5, fontWeight: 400, lineHeight: 1.6 },
  small: { fontSize: 10.5, fontWeight: 400, lineHeight: 1.5 },
  meta: { fontSize: 10, fontWeight: 400, lineHeight: 1.45 },
  micro: { fontSize: 9.5, fontWeight: 500, lineHeight: 1.3 },
};

// ── PDF page dimensions ──
const PDF = {
  captureW: 816,
  scale: 2,
  pageW: 8.5,
  pageH: 11,
  margin: 0.72,
  footer: 0.68,
  get contentW() { return this.pageW - 2 * this.margin; },
  get contentH() { return this.pageH - this.margin - this.footer; },
  get canvasW() { return this.captureW * this.scale; },
  get pxPerInch() { return this.canvasW / this.contentW; },
  get sliceH() { return Math.floor(this.contentH * this.pxPerInch); },
  get previewH() { return Math.round(this.captureW * (this.pageH / this.pageW)); },
};

// ============================================================
// LAYOUT COMPONENTS
// ============================================================

function ReportHeader() {
  return (
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: R.headerMb, paddingBottom: 14, borderBottom: "1px solid rgba(14,26,43,0.12)" }}>
      <Image src={logoImg} alt="RunPayway" width={120} height={14} style={{ height: "auto" }} />
      <div style={{ textAlign: "right" }}>
        <div style={{ ...T.meta, color: B.taupe }}>Income Stability Score™</div>
        <div style={{ ...T.meta, color: B.taupe }}>Model RP-2.0</div>
      </div>
    </div>
  );
}

function Overline({ children }: { children: React.ReactNode }) {
  return <div style={{ ...T.overline, color: B.teal, marginBottom: R.labelMb }}>{children}</div>;
}

function SectionDivider() {
  return <div style={{ height: 1, backgroundColor: "rgba(14,26,43,0.12)", marginTop: R.dividerMy, marginBottom: R.dividerMy }} />;
}

function PageFooter({ section, page }: { section: string; page: number }) {
  return (
    <div className="report-page-footer" style={{ marginTop: "auto", paddingTop: 12, borderTop: "1px solid rgba(14,26,43,0.12)" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <span style={{ ...T.meta, color: B.taupe }}>{section} · Page {page}</span>
        <span style={{ ...T.meta, color: B.taupe }}>Model RP-2.0 · runpayway.com/methodology</span>
      </div>
    </div>
  );
}

function MetricCard({ label, value, explanation }: { label: string; value: React.ReactNode; explanation: string; accent?: string }) {
  return (
    <div style={{ flex: 1, backgroundColor: B.bone, border: "1px solid rgba(14,26,43,0.06)", borderRadius: 4, padding: "14px 16px" }}>
      <div style={{ ...T.overline, color: B.teal, marginBottom: 6 }}>{label}</div>
      <div style={{ fontSize: 15, fontWeight: 600, color: B.navy, marginBottom: 6, lineHeight: 1.3 }}>{value}</div>
      <div style={{ ...T.small, color: B.muted, lineHeight: 1.55 }}>{explanation}</div>
    </div>
  );
}

function DiagnosisBlock({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ backgroundColor: B.bone, border: "1px solid rgba(14,26,43,0.06)", borderLeft: `3px solid ${B.purple}`, borderRadius: 4, padding: "18px 22px" }}>
      {children}
    </div>
  );
}

function SimpleTermsBox({ title, copy, takeaway }: { title: string; copy: string; takeaway: string }) {
  return (
    <div style={{ backgroundColor: B.sand, borderTop: `1px solid ${B.stone}`, borderBottom: `1px solid ${B.stone}`, padding: "14px 18px", marginTop: 12, marginBottom: 12 }}>
      <div style={{ ...T.overline, color: B.taupe, marginBottom: 6 }}>{title}</div>
      <p style={{ ...T.body, color: B.navy, margin: "0 0 8px", maxWidth: 520, lineHeight: 1.55 }}>{copy}</p>
      <p style={{ ...T.small, color: B.muted, margin: 0, fontStyle: "italic" }}>{takeaway}</p>
    </div>
  );
}

function ReportPage({ children, noPad }: { record: AssessmentRecord; children: React.ReactNode; noPad?: boolean }) {
  return (
    <div className="report-page" style={{
      width: PDF.captureW,
      maxWidth: "100%",
      backgroundColor: B.sand,
      border: "none",
      borderRadius: 0,
      padding: noPad ? 0 : R.pagePad,
      boxSizing: "border-box",
      display: "flex",
      flexDirection: "column",
      overflow: "visible",
      position: "relative",
    }}>
      {/* Top accent line */}
      <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 2, background: "linear-gradient(90deg, #4B3FAE 0%, #1F6D7A 100%)" }} />
      {children}
    </div>
  );
}

// ── QR Code component ──
function QRCodeImage({ recordId, authCode, score, band, date, model }: { recordId: string; authCode?: string; score?: number; band?: string; date?: string; model?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const params = new URLSearchParams();
    params.set("id", recordId);
    if (authCode) params.set("auth", authCode);
    if (score !== undefined) params.set("s", String(score));
    if (band) params.set("b", band);
    if (date) params.set("d", date);
    if (model) params.set("m", model);
    const url = `https://peoplestar.com/RunPayway/verify?${params.toString()}`;
    import("qrcode").then((QRCode) => {
      QRCode.toCanvas(canvas, url, {
        width: 140,
        margin: 2,
        color: { dark: "#0E1A2B", light: "#FFFFFF" },
        errorCorrectionLevel: "M",
      });
    }).catch(() => {});
  }, [recordId, authCode]);

  return <canvas ref={canvasRef} width={140} height={140} style={{ width: 80, height: 80 }} />;
}

// ============================================================
// PDF DOWNLOAD
// ============================================================

function findSafeCutRow(
  canvas: HTMLCanvasElement,
  targetY: number,
  searchRange: number,
): number {
  const width = canvas.width;
  const minY = Math.max(0, targetY - searchRange);
  const maxY = targetY;
  const searchHeight = maxY - minY;
  if (searchHeight <= 0) return targetY;

  const ctx = canvas.getContext("2d")!;
  const imageData = ctx.getImageData(0, minY, width, searchHeight);
  const pixels = imageData.data;
  const sampleStep = Math.max(1, Math.floor(width / 80));
  const threshold = 4;

  for (let offset = 0; offset < searchHeight; offset++) {
    const localRow = searchHeight - 1 - offset;
    let nonWhiteCount = 0;
    const rowStart = localRow * width * 4;

    for (let x = 0; x < width; x += sampleStep) {
      const idx = rowStart + x * 4;
      if (pixels[idx] < 245 || pixels[idx + 1] < 245 || pixels[idx + 2] < 245) {
        nonWhiteCount++;
        if (nonWhiteCount > threshold) break;
      }
    }

    if (nonWhiteCount <= threshold) {
      return minY + localRow;
    }
  }

  return targetY;
}

async function downloadPDF(record: AssessmentRecord) {
  let html2canvas: typeof import("html2canvas").default;
  let jsPDF: typeof import("jspdf").jsPDF;

  try {
    html2canvas = (await import("html2canvas")).default;
    jsPDF = (await import("jspdf")).jsPDF;
  } catch {
    alert("PDF generation libraries failed to load. Please check your connection and try again.");
    return;
  }

  const pages = document.querySelectorAll(".report-page");
  if (!pages.length) return;

  const pdf = new jsPDF({ orientation: "portrait", unit: "in", format: "letter" });
  pdf.setProperties({
    title: `Income Stability Assessment — ${record.assessment_title || "Report"}`,
    author: "RunPayway",
    subject: "Income Stability Score Report",
    keywords: "income stability, assessment, RunPayway, income analysis",
    creator: `RunPayway Model ${record.model_version || "RP-1.0"}`,
  });

  const { captureW, scale: S, pageW: PW, pageH: PH, margin: M, footer: FT, contentW: CW, canvasW, pxPerInch, sliceH } = PDF;

  let pdfPageCount = 0;

  for (let i = 0; i < pages.length; i++) {
    const el = pages[i] as HTMLElement;

    const saved = {
      width: el.style.width,
      maxWidth: el.style.maxWidth,
      border: el.style.border,
      borderRadius: el.style.borderRadius,
      boxSizing: el.style.boxSizing,
      overflow: el.style.overflow,
    };
    el.style.width = `${captureW}px`;
    el.style.maxWidth = `${captureW}px`;
    el.style.boxSizing = "border-box";
    el.style.border = "none";
    el.style.borderRadius = "0";
    el.style.overflow = "visible";

    const htmlFooter = el.querySelector(".report-page-footer") as HTMLElement | null;
    if (htmlFooter) htmlFooter.style.display = "none";

    await new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r)));

    const canvas = await html2canvas(el, {
      scale: S,
      useCORS: true,
      backgroundColor: "#ffffff",
      logging: false,
      width: captureW,
      height: el.scrollHeight,
      windowWidth: captureW,
    });

    Object.assign(el.style, saved);
    if (htmlFooter) htmlFooter.style.display = "";

    const totalCanvasH = canvas.height;
    let currentY = 0;

    while (currentY < totalCanvasH) {
      if (pdfPageCount > 0) pdf.addPage();
      pdfPageCount++;

      let cutY: number;
      const idealCutY = currentY + sliceH;

      if (idealCutY >= totalCanvasH) {
        cutY = totalCanvasH;
      } else {
        cutY = findSafeCutRow(canvas, idealCutY, 200);
      }

      const srcH = Math.max(1, cutY - currentY);

      const strip = document.createElement("canvas");
      strip.width = canvasW;
      strip.height = srcH;
      const ctx = strip.getContext("2d")!;
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(0, 0, canvasW, srcH);
      ctx.drawImage(canvas, 0, currentY, canvasW, srcH, 0, 0, canvasW, srcH);

      const imgH = srcH / pxPerInch;
      pdf.addImage(strip.toDataURL("image/png"), "PNG", M, M, CW, imgH);

      currentY = cutY;
    }
  }

  for (let p = 1; p <= pdfPageCount; p++) {
    pdf.setPage(p);

    pdf.setDrawColor(220, 218, 212);
    pdf.setLineWidth(0.004);
    pdf.line(M, PH - FT + 0.05, PW - M, PH - FT + 0.05);

    pdf.setFont("helvetica", "italic");
    pdf.setFontSize(7);
    pdf.setTextColor(156, 163, 175);
    pdf.text(
      `Confidential — Prepared for ${record.assessment_title || "Assessment Subject"}`,
      M,
      PH - FT + 0.2,
    );

    pdf.setFont("helvetica", "normal");
    pdf.text("support@runpayway.com", PW - M, PH - FT + 0.2, { align: "right" });

    pdf.setFontSize(7.5);
    pdf.setTextColor(156, 163, 175);
    pdf.text(`Page ${p} of ${pdfPageCount}`, PW / 2, PH - FT + 0.35, { align: "center" });
  }

  const shortId = record.record_id.slice(0, 8);
  pdf.save(`RunPayway-Income-Stability-Report-${shortId}.pdf`);
}


// ============================================================
// MAIN PAGE
// ============================================================

export default function ReviewPage() {
  const router = useRouter();
  const [record, setRecord] = useState<AssessmentRecord | null>(null);
  const [downloading, setDownloading] = useState(false);
  const [downloadError, setDownloadError] = useState<string | null>(null);
  const [emailStatus, setEmailStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [linkCopied, setLinkCopied] = useState(false);
  const [advisorEmail, setAdvisorEmail] = useState("");
  const [advisorSending, setAdvisorSending] = useState(false);
  const [advisorSent, setAdvisorSent] = useState(false);
  const [animatedScore, setAnimatedScore] = useState(0);
  const [collapsed, setCollapsed] = useState<Record<number, boolean>>({});
  const monitoringTracked = useRef(false);
  const emailSent = useRef(false);
  const scoreAnimated = useRef(false);

  useEffect(() => {
    window.scrollTo(0, 0);
    const stored = sessionStorage.getItem("rp_record");
    if (!stored) { router.push("/diagnostic-portal"); return; }

    let parsed: AssessmentRecord;
    try {
      parsed = JSON.parse(stored);
    } catch {
      router.push("/diagnostic-portal");
      return;
    }

    if (!parsed || !parsed.record_id || typeof parsed.final_score !== "number") {
      router.push("/diagnostic-portal");
      return;
    }

    setRecord(parsed);

    try {
      const records = safeJsonParse<Array<Record<string, unknown>>>(localStorage.getItem("rp_records"), []);
      if (!records.some((r) => r.record_id === parsed.record_id)) {
        records.push({
          record_id: parsed.record_id,
          authorization_code: parsed.authorization_code,
          model_version: parsed.model_version,
          final_score: parsed.final_score,
          stability_band: parsed.stability_band,
          assessment_date_utc: parsed.assessment_date_utc,
          issued_timestamp_utc: parsed.issued_timestamp_utc,
        });
        localStorage.setItem("rp_records", JSON.stringify(records));
      }
    } catch { /* ignore */ }

    // Clean up localStorage session data now that the report is delivered
    try {
      localStorage.removeItem("rp_purchase_session");
      localStorage.removeItem("rp_profile");
    } catch { /* ignore */ }

    if (!monitoringTracked.current) {
      monitoringTracked.current = true;
      try {
        const purchaseSession = sessionStorage.getItem("rp_purchase_session");
        if (purchaseSession) {
          const ps = JSON.parse(purchaseSession);
          if (ps.plan_key === "annual_monitoring" && ps.monitoring_access_code) {
            void useAssessmentServer(ps.monitoring_access_code, parsed.record_id);
          }
        }
      } catch { /* ignore */ }
    }

    if (!emailSent.current) {
      emailSent.current = true;
      try {
        const purchaseRaw = sessionStorage.getItem("rp_purchase_session");
        const profileRaw = sessionStorage.getItem("rp_profile");
        const email =
          (purchaseRaw ? safeJsonParse<Record<string, string>>(purchaseRaw, {}).customer_email : null) ||
          (profileRaw ? safeJsonParse<Record<string, string>>(profileRaw, {}).recipient_email : null);
        if (email) {
          setEmailStatus("sending");
          fetch("/api/v1/send-report", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              recipientEmail: email,
              assessmentTitle: parsed.assessment_title,
              finalScore: parsed.final_score,
              stabilityBand: parsed.stability_band,
              recordId: parsed.record_id,
              modelVersion: parsed.model_version,
              issuedTimestamp: parsed.issued_timestamp_utc,
              industrySector: parsed.industry_sector,
              classification: parsed.classification,
              primaryConstraintLabel: parsed.primary_constraint_label,
              bandInterpretationText: parsed.band_interpretation_text,
              peerPercentileLabel: parsed.peer_stability_percentile_label,
              riskScenarioDrop: parsed.risk_scenario_drop,
            }),
          })
            .then((res) => res.ok ? setEmailStatus("sent") : setEmailStatus("error"))
            .catch(() => setEmailStatus("error"));
        }
      } catch { /* ignore email errors */ }
    }
  }, [router]);

  // ── Score count-up animation ──
  useEffect(() => {
    if (!record || scoreAnimated.current) return;
    scoreAnimated.current = true;
    const target = record.final_score;
    const duration = 1500;
    const start = performance.now();
    const step = (now: number) => {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3); // ease-out cubic
      setAnimatedScore(Math.round(eased * target));
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [record]);

  if (!record) return null;

  // ── Derived values ──
  const score = record.final_score;
  const tier: "limited" | "developing" | "established" | "high" =
    score >= 75 ? "high" : score >= 50 ? "established" : score >= 30 ? "developing" : "limited";

  const subTier: "A1" | "A2" | "A3" | "B1" | "B2" | "C1" | "C2" | "D1" | "D2" =
    score <= 9 ? "A1" : score <= 19 ? "A2" : score <= 29 ? "A3" :
    score <= 39 ? "B1" : score <= 49 ? "B2" :
    score <= 59 ? "C1" : score <= 74 ? "C2" :
    score <= 89 ? "D1" : "D2";

  const name = record.assessment_title || "This income profile";
  const issuedDate = (record.issued_timestamp_utc || record.assessment_date_utc).split("T")[0];
  const reassessDate = (() => {
    const d = new Date(record.issued_timestamp_utc || record.assessment_date_utc);
    d.setMonth(d.getMonth() + (tier === "limited" ? 2 : tier === "high" ? 6 : 3));
    return d.toISOString().split("T")[0];
  })();
  const actionPlan: string[] = safeJsonParse(record.action_plan_payload, []);
  const constraintGuidance: string[] = safeJsonParse(record.constraint_guidance_payload, []);
  const evolutionSteps: string[] = safeJsonParse(record.evolution_path_steps_payload, []);
  const advisorGuide: { talking_points: string[]; client_questions: string[]; red_flags: string[]; next_steps: string[] } = safeJsonParse(record.advisor_discussion_guide_payload, { talking_points: [], client_questions: [], red_flags: [], next_steps: [] });

  // ── Profile context for dynamic personalization ──
  const profileClass = (record.classification || "").toLowerCase();
  const opStructure = (record.operating_structure || "").toLowerCase();
  const incomeModel = (record.primary_income_model || "").toLowerCase();
  const revStructure = (record.revenue_structure || "").toLowerCase();
  const industrySector = (record.industry_sector || "").replace(/_/g, " ").replace(/\b\w/g, (c: string) => c.toUpperCase());

  // Dynamic labels based on profile
  const profileNoun = profileClass.includes("business") ? "business" : profileClass.includes("team") ? "team" : "individual";
  const structureDesc = opStructure.includes("employee") || opStructure.includes("w-2") ? "salaried employee"
    : opStructure.includes("contractor") || opStructure.includes("independent") ? "independent contractor"
    : opStructure.includes("business owner") || opStructure.includes("firm") ? "business owner"
    : opStructure.includes("partnership") ? "partnership"
    : opStructure.includes("nonprofit") ? "nonprofit operator"
    : "professional";

  const incomeModelDesc = incomeModel.includes("salary") ? "salary-based"
    : incomeModel.includes("commission") ? "commission-driven"
    : incomeModel.includes("contract") ? "contract-based"
    : incomeModel.includes("retainer") || incomeModel.includes("subscription") ? "retainer/subscription-based"
    : incomeModel.includes("project") ? "project-based"
    : incomeModel.includes("consulting") || incomeModel.includes("client") ? "consulting/client-services"
    : incomeModel.includes("product") ? "product-sales"
    : incomeModel.includes("creator") || incomeModel.includes("media") ? "creator/media"
    : incomeModel.includes("rental") || incomeModel.includes("real estate") ? "rental/real-estate"
    : incomeModel.includes("franchise") ? "franchise"
    : incomeModel.includes("hybrid") || incomeModel.includes("multiple") ? "hybrid/multi-source"
    : "mixed-income";

  const revenueDesc = revStructure.includes("one-time") ? "mostly one-time payments"
    : revStructure.includes("repeat") ? "repeat-client revenue"
    : revStructure.includes("monthly") ? "monthly recurring revenue"
    : revStructure.includes("contracted") ? "contracted multi-month revenue"
    : revStructure.includes("long-term") ? "long-term recurring income"
    : revStructure.includes("mixed") ? "a mixed revenue structure"
    : "variable revenue";

  // Dynamic constraint advice based on profile
  const profileConstraintAdvice: Record<string, string> = {
    source_concentration: opStructure.includes("contractor") || opStructure.includes("independent")
      ? "As a contractor, losing your primary client would be devastating. Secure at least 2–3 active contracts at all times."
      : opStructure.includes("employee")
      ? "As a salaried employee, your income depends entirely on one employer. Building a secondary income stream is critical."
      : profileClass.includes("business")
      ? "Your business revenue is too concentrated. No single client should represent more than 30% of total revenue."
      : "Your income is too concentrated in one source. Diversify to protect against sudden loss.",
    forward_visibility: incomeModel.includes("commission") || incomeModel.includes("project")
      ? `With ${incomeModelDesc} income, future earnings are unpredictable. Lock in advance commitments, retainers, or pipeline guarantees.`
      : opStructure.includes("contractor")
      ? "As a contractor, secure multi-month engagements or retainer agreements instead of rolling month-to-month."
      : profileClass.includes("business")
      ? "Your business needs more contracted or recurring revenue locked in before each month begins."
      : "Too little of your income is committed before the month starts. Lock in recurring or pre-committed income.",
    labor_dependence: opStructure.includes("employee")
      ? "As an employee, 100% of your income stops if you stop working. Build passive or semi-passive income alongside your salary."
      : incomeModel.includes("consulting") || incomeModel.includes("client")
      ? "Your consulting income requires constant client delivery. Productize your expertise into courses, templates, or licensing."
      : profileClass.includes("business")
      ? "Your business is still owner-dependent. Build systems, recurring revenue, or delegated delivery so income continues without you."
      : "Too much income requires your daily effort. Shift toward streams that produce without constant work.",
    low_continuity: incomeModel.includes("commission")
      ? "Commission income stops immediately when deals stop closing. Build a base of recurring or residual commissions."
      : opStructure.includes("contractor")
      ? "Contract income has a short shelf life. Negotiate longer-term contracts or build retainer relationships."
      : "Your income would stop too quickly if active work paused. Build streams that continue producing independently.",
    few_sources: profileClass.includes("business")
      ? "Your business relies on too few revenue channels. Add a new client segment, product line, or service tier."
      : opStructure.includes("contractor")
      ? "You need more active clients. Each new contract that contributes at least 10% of income strengthens the structure."
      : "Your income comes from too few sources. Adding even one more meaningful source significantly reduces risk.",
  };

  // ── Tier-aware copy ──
  const copy = {
    p1_headline: ({
      A1: `${name} scored ${score} out of 100 as a ${structureDesc} in ${industrySector} with ${incomeModelDesc} income and ${revenueDesc}. The structure is highly vulnerable — most protection needed for stability is not yet in place.`,
      A2: `${name} scored ${score} out of 100 as a ${structureDesc} in ${industrySector}. With ${incomeModelDesc} income and ${revenueDesc}, the structure is weak and exposed to disruption.`,
      A3: `${name} scored ${score} out of 100 as a ${structureDesc} in ${industrySector}. Some early structure exists, but the ${incomeModelDesc} income with ${revenueDesc} is still below a stable range.`,
      B1: `${name} scored ${score} out of 100 as a ${structureDesc} in ${industrySector}. The ${incomeModelDesc} income structure is developing but not yet protected against disruption.`,
      B2: `${name} scored ${score} out of 100 as a ${structureDesc} in ${industrySector}. The structure needs stronger protection before it can be considered stable.`,
      C1: `${name} scored ${score} out of 100 as a ${structureDesc} in ${industrySector}. The ${incomeModelDesc} income structure has real stability but is not yet fully protected against disruption.`,
      C2: `${name} scored ${score} out of 100 as a ${structureDesc} in ${industrySector}. The structure is established and relatively stable.`,
      D1: `${name} scored ${score} out of 100 as a ${structureDesc} in ${industrySector}. The ${incomeModelDesc} income structure is strong with substantial protection in place.`,
      D2: `${name} scored ${score} out of 100 as a ${structureDesc} in ${industrySector}. The structure is exceptionally strong and highly protected.`,
    })[subTier],
    p5_reassess: "Retake after real structural improvement is active, not after a short-term earnings spike.",
  };

  // ── V2 engine data (must be before band-sensitive copy) ──
  const v2 = record._v2;
  const v2Fragility = v2?.fragility ?? null;
  const v2Confidence = v2?.confidence ?? null;
  const v2Quality = v2?.quality ?? null;
  const v2Sensitivity = v2?.sensitivity ?? null;
  const v2Interactions = v2?.interactions ?? null;
  const v2Constraints = v2?.constraints ?? null;
  const v2Scenarios = v2?.scenarios ?? null;
  const v2Lift = v2?.score_lift_projection ?? null;
  const v2AvoidActions = v2?.avoid_actions ?? null;
  const v2Triggers = v2?.reassessment_triggers ?? null;
  const v2Benchmarks = v2?.benchmarks ?? null;
  const v2Scores = v2?.scores ?? null;

  // ── Outcome layer ──
  const ol = v2?.outcome_layer;
  const olActions = ol?.ranked_action_map ?? null;
  const olAvoid = ol?.avoid_actions ?? null;
  const olExplanations = ol?.explanation_translation_layer ?? null;
  const olTriggers = ol?.reassessment_trigger_set ?? null;
  const olStrongerPatterns = ol?.stronger_structure_patterns ?? null;
  const olScenarios = ol?.selected_scenarios ?? null;
  const olFamilyLabel = ol?.income_model_family?.family_label ?? null;
  const olIndustryLabel = ol?.industry_refinement_profile?.industry_label ?? null;
  const olBenchmark = ol?.benchmark_context_layer ?? null;

  // ── LAYER 2: Dominant constraint ──
  const dominantConstraintKey = v2Constraints?.root_constraint ?? "weak_forward_visibility";
  const dominantConstraint: "source_concentration" | "forward_visibility" | "labor_dependence" | "low_continuity" | "few_sources" =
    dominantConstraintKey === "high_concentration" ? "source_concentration" :
    dominantConstraintKey === "weak_forward_visibility" ? "forward_visibility" :
    dominantConstraintKey === "high_labor_dependence" ? "labor_dependence" :
    dominantConstraintKey === "low_persistence" ? "low_continuity" :
    dominantConstraintKey === "low_source_diversity" ? "few_sources" :
    "forward_visibility";

  const dominantConstraintPlain: Record<string, string> = {
    source_concentration: "too much reliance on one source",
    forward_visibility: "not enough income secured ahead of time",
    labor_dependence: "too much of the income still depends on daily work",
    low_continuity: "too little income would continue if work stopped",
    few_sources: "the income structure is still too narrow",
  };

  // ── LAYER 3: Distance to next band ──
  const nextBandThreshold = score < 30 ? 30 : score < 50 ? 50 : score < 75 ? 75 : 100;
  const distanceToNext = nextBandThreshold - score;
  const bandDistance: "CLOSE" | "MODERATE" | "FAR" | "TOP_BAND" =
    tier === "high" ? "TOP_BAND" :
    distanceToNext <= 4 ? "CLOSE" :
    distanceToNext <= 14 ? "MODERATE" : "FAR";

  // ── LAYER 4: Metric severity ──
  const continuitySeverity: string =
    record.income_continuity_months < 1 ? "very short" :
    record.income_continuity_months < 3 ? "limited" :
    record.income_continuity_months < 6 ? "moderate" :
    record.income_continuity_months < 12 ? "meaningful" : "strong";

  const sourceDropSeverity: "collapse" | "severe" | "significant" | "moderate" | "minor" =
    record.risk_scenario_score <= 0 ? "collapse" :
    record.risk_scenario_drop > score * 0.6 ? "severe" :
    record.risk_scenario_drop > score * 0.3 ? "significant" :
    record.risk_scenario_drop > 5 ? "moderate" : "minor";

  const peerPercentileValue = record.peer_stability_percentile ?? (v2Benchmarks?.peer_percentile ?? 50);
  const peerInterpretation: string =
    peerPercentileValue <= 10 ? "far below benchmark" :
    peerPercentileValue <= 30 ? "below benchmark" :
    peerPercentileValue <= 60 ? "around benchmark" :
    peerPercentileValue <= 85 ? "above benchmark" : "well above benchmark";

  const durabilityValue: Record<string, string> = {
    A1: "Very weak protection", A2: "Weak protection", A3: "Limited protection",
    B1: "Needs stronger protection", B2: "Partly protected",
    C1: "Moderately protected", C2: "Meaningfully protected",
    D1: "Strong protection", D2: "Very strong protection",
  };

  const durabilityBody: Record<string, string> = {
    A1: "The structure has very little protection in place if conditions change.",
    A2: "The structure has some support, but not enough to absorb disruption well.",
    A3: "Some support exists, but the structure is still below a stable level of protection.",
    B1: "The structure is improving, but it is still vulnerable in important areas.",
    B2: "The structure has a foundation, but stronger protection is still needed.",
    C1: "The structure has real support, but not enough protection yet against meaningful disruption.",
    C2: "The structure is relatively stable, though some vulnerabilities still matter.",
    D1: "The structure is strong and holds up well under most common disruptions.",
    D2: "The structure is highly durable and well-protected across the benchmark.",
  };

  const p2Intro: Record<string, string> = {
    A1: `${name} scored ${score} out of 100 as a ${structureDesc} with ${incomeModelDesc} income in ${industrySector}. The structure is highly exposed and not stable enough to absorb disruption.`,
    A2: `${name} scored ${score} out of 100. As a ${structureDesc} with ${revenueDesc}, the structure cannot yet handle disruption.`,
    A3: `${name} scored ${score} out of 100. Some early structure exists, but the ${incomeModelDesc} setup in ${industrySector} is still vulnerable.`,
    B1: `${name} scored ${score} out of 100. The ${incomeModelDesc} structure in ${industrySector} is developing but has meaningful vulnerabilities.`,
    B2: `${name} scored ${score} out of 100. The structure is improving but needs stronger protection before it can be called stable.`,
    C1: `${name} scored ${score} out of 100. The ${incomeModelDesc} structure in ${industrySector} has real stability but is not yet fully protected.`,
    C2: `${name} scored ${score} out of 100. The structure is established in ${industrySector} with only limited vulnerabilities remaining.`,
    D1: `${name} scored ${score} out of 100. The ${incomeModelDesc} structure has substantial protection with only minor weaknesses.`,
    D2: `${name} scored ${score} out of 100. Exceptionally strong. The structure is highly protected and well-positioned in ${industrySector}.`,
  };

  const p2Interpretation: Record<string, string> = {
    A1: `The main issue: ${dominantConstraintPlain[dominantConstraint]}. With ${record.income_continuity_pct}% continuity and a ${record.risk_scenario_drop}-point stress test drop, the ${incomeModelDesc} structure could collapse quickly under pressure.`,
    A2: `The main issue — ${dominantConstraintPlain[dominantConstraint]} — must be addressed before anything else. As a ${structureDesc}, this is the priority.`,
    A3: `Some structure is forming, but the ${incomeModelDesc} setup is still below stable. Focus: strengthen continuity and balance.`,
    B1: `The main issue — ${dominantConstraintPlain[dominantConstraint]} — still limits protection. As a ${structureDesc} in ${industrySector}, the next step is turning progress into durability.`,
    B2: `Stronger protection is needed. The ${record.risk_scenario_drop}-point stress test drop and ${record.income_continuity_pct}% continuity show where the ${incomeModelDesc} structure is still exposed.`,
    C1: `${dominantConstraintPlain[dominantConstraint].charAt(0).toUpperCase() + dominantConstraintPlain[dominantConstraint].slice(1)} still limits full protection. The ${record.risk_scenario_drop}-point stress test drop shows remaining exposure in this ${incomeModelDesc} structure.`,
    C2: `The structure is established. Remaining gains come from reducing concentration risk and extending continuity in this ${incomeModelDesc} setup.`,
    D1: `Well-protected. Focus on preserving strength and reducing the remaining ${record.risk_scenario_drop}-point stress test exposure.`,
    D2: `Exceptionally strong. Maintain discipline and avoid unnecessary fragility in this ${incomeModelDesc} structure.`,
  };

  const p2BottomLine: Record<string, string> = {
    A1: `${name} needs protection first, not more output. As a ${structureDesc}, build structural safeguards before scaling.`,
    A2: `${name} needs stronger protection. The ${incomeModelDesc} structure cannot absorb disruption yet.`,
    A3: `${name} has a starting structure. Turn it into something stable by addressing ${dominantConstraintPlain[dominantConstraint]}.`,
    B1: `${name} is developing. The next gains come from protection, not more output.`,
    B2: `${name} is progressing. Strengthen the structure so the ${incomeModelDesc} income holds up under pressure.`,
    C1: `${name} has real stability. Strengthen protection to lock it in.`,
    C2: `${name} is established. Refine and harden what is already working.`,
    D1: `${name} is strong. Preserve resilience and close the remaining gaps.`,
    D2: `${name} is exceptionally strong. Maintain discipline.`,
  };

  const p2WorkingBody: string = ["A1", "A2"].includes(subTier) ? `Not starting from zero. As a ${structureDesc} with ${incomeModelDesc} income, this is an early base to build from.` : ["A3"].includes(subTier) ? `A base exists in the ${incomeModelDesc} structure, but still below a stable range.` : subTier === "B1" ? `The ${incomeModelDesc} structure is building, but important weaknesses remain.` : subTier === "B2" ? `Parts of the ${incomeModelDesc} structure support stability. Stronger protection is still needed.` : ["C1", "C2"].includes(subTier) ? `The ${incomeModelDesc} structure is working. Next gains come from strengthening what exists.` : `Protection is substantial in this ${incomeModelDesc} structure. Focus: refinement.`;

  const p3Intro: Record<string, string> = {
    A1: `As a ${structureDesc} in ${industrySector} with ${incomeModelDesc} income, these are the biggest threats to your structure right now.`,
    A2: `These are the scenarios that would hurt your ${incomeModelDesc} income most given the current weak structure.`,
    A3: `These risks are specific to your ${incomeModelDesc} setup in ${industrySector} while the structure is still below stable.`,
    B1: `These risks show where your ${incomeModelDesc} structure in ${industrySector} is still exposed.`,
    B2: `These are the scenarios that could set back your developing ${incomeModelDesc} structure.`,
    C1: `Even with real stability, these scenarios could still weaken your ${incomeModelDesc} income in ${industrySector}.`,
    C2: `Despite an established structure, these risks still matter for your ${incomeModelDesc} setup.`,
    D1: `From a position of strength, these are the limited risks that could still affect your ${incomeModelDesc} income.`,
    D2: `These are the only remaining risks for your highly resilient ${incomeModelDesc} structure.`,
  };

  const p4CurrentBandBody: Record<string, string> = {
    A1: `The ${incomeModelDesc} structure is fragile. As a ${structureDesc}, build protection first.`,
    A2: `The ${incomeModelDesc} structure needs stronger protection before it can absorb disruption.`,
    A3: `Some early ${incomeModelDesc} structure exists but is still below stable for a ${structureDesc}.`,
    B1: `The ${incomeModelDesc} structure is developing but not yet strong enough for a ${structureDesc} in ${industrySector}.`,
    B2: `The ${incomeModelDesc} structure has a foundation. Stronger protection is needed.`,
    C1: `The ${incomeModelDesc} structure is stable but not yet fully protected.`,
    C2: `Established ${incomeModelDesc} structure with limited vulnerabilities remaining.`,
    D1: `Strong ${incomeModelDesc} structure. Only limited refinements needed.`,
    D2: `Exceptionally strong. Refinement, not repair.`,
  };

  const p4TargetBandBody: string = (() => {
    if (tier === "high") return "The focus now is not a new band. It is preserving strength and reducing remaining weak points.";
    const distanceNote = bandDistance === "CLOSE" ? " A few practical changes could make this realistic." : bandDistance === "MODERATE" ? " This is achievable with sustained structural improvement." : " This will take sustained effort, but each step reduces vulnerability.";
    if (tier === "limited") return "The next level means moving from fragile or early-stage structure into something more stable and better protected." + distanceNote;
    if (tier === "developing") return "The next level means moving from a developing structure into one with clearer stability and stronger protection." + distanceNote;
    return "The next level means moving from established stability into a more resilient and well-protected structure." + distanceNote;
  })();

  const p4CombinedLine: string = (() => {
    if (tier === "high") return "These changes would further strengthen an already strong structure.";
    if (bandDistance === "CLOSE") return `A few practical changes could move ${name} into ${score < 30 ? "Developing" : score < 50 ? "Established" : "High"} Stability. Near-term improvement is realistic.`;
    if (bandDistance === "FAR" && tier === "limited") return "These changes would be a meaningful first step. More than one round of improvement may be needed, but each step materially reduces vulnerability.";
    if (bandDistance === "FAR" && tier === "developing") return `These changes would strengthen protection meaningfully. The next band is achievable, but will take sustained effort.`;
    if (bandDistance === "FAR") return "These changes would create meaningful progress toward stronger protection.";
    // MODERATE
    if (tier === "limited") return "These changes would create real progress, even if more work would still be needed to move fully out of Limited Stability.";
    if (tier === "developing") return `Together, these changes would create meaningful progress toward Established Stability.`;
    return `Together, these changes could move ${name} deeper into stability and strengthen protection against disruption.`;
  })();

  const p5Intro: Record<string, string> = {
    A1: `As a ${structureDesc} in ${industrySector}, ${name} needs basic protection first: secure income ahead of time, reduce single-source reliance, and build income that continues if work stops.`,
    A2: `${name} needs structural protection before growth. As a ${structureDesc} with ${incomeModelDesc} income, focus on durability.`,
    A3: `${name} has early structure. As a ${structureDesc} in ${industrySector}, the next step is turning ${incomeModelDesc} income into something stable.`,
    B1: `${name} needs to strengthen the developing ${incomeModelDesc} structure so it handles disruption in ${industrySector}.`,
    B2: `${name} needs stronger protection, better continuity, and less concentration risk in this ${incomeModelDesc} setup.`,
    C1: `As a ${structureDesc} in ${industrySector}, the priority is strengthening protection and forward visibility.`,
    C2: `Refine the established ${incomeModelDesc} structure to become more durable and less exposed.`,
    D1: `Preserve strength, reduce residual vulnerabilities, and maintain continuity in this ${incomeModelDesc} structure.`,
    D2: `Maintain discipline and long-term resilience. The ${incomeModelDesc} structure is strong — protect it.`,
  };

  const p5CompareInterpretation: string = (() => {
    const pct = peerPercentileValue;
    const avg = v2Benchmarks?.cluster_average_score ?? 42;
    const top20 = v2Benchmarks?.top_20_threshold ?? 65;
    if (score < avg && pct <= 10) return `This score is well below the peer average of ${avg} and far from the top 20% benchmark of ${top20}. Strengthening the structure would close this gap meaningfully.`;
    if (score < avg && pct <= 30) return `This score is below the peer average of ${avg}. Reaching the peer average is a realistic near-term target, with the top 20% benchmark of ${top20} as a longer-term goal.`;
    if (score < avg) return `This score is approaching the peer average of ${avg}. A few structural improvements could move it above average.`;
    if (score >= top20) return `This score is above both the peer average of ${avg} and the top 20% benchmark of ${top20}. The focus now is maintaining this position.`;
    if (score >= avg) return `This score is above the peer average of ${avg}, but there is still room to reach the top 20% benchmark of ${top20}.`;
    return `This score is around the peer average of ${avg}.`;
  })();

  // ── Consumer-friendly label maps ──
  const failureModeLabel: Record<string, string> = {
    concentration_collapse: "Too much weight on a single source",
    labor_interruption: "Income stops when active work stops",
    visibility_gap: "Not enough income is secured ahead",
    durability_thinness: "Recurring income is fragile or cancelable",
  };
  const constraintLabel: Record<string, string> = {
    weak_forward_visibility: "Too little income secured ahead",
    high_labor_dependence: "Too much dependence on active work",
    high_concentration: "Too much dependence on one source",
    low_persistence: "Not enough recurring income",
    high_variability: "Too much earnings variability",
    weak_durability: "Income quality is too fragile",
    shallow_continuity: "Continuity window is too short",
  };
  const fragilityClassLabel: Record<string, string> = {
    brittle: "Brittle", thin: "Thin", uneven: "Uneven", supported: "Supported", resilient: "Resilient",
  };
  const confidenceColor: Record<string, string> = {
    high: B.teal, moderate: B.bandEstablished, guarded: B.bandDeveloping, low: B.bandLimited,
  };

  // ── Continuity display ──
  const continuityDisplay = record.income_continuity_months < 0.5
    ? "Less than 1 week"
    : record.income_continuity_months < 1
      ? "Less than 1 month"
      : `${record.income_continuity_months} month${record.income_continuity_months !== 1 ? "s" : ""}`;

  // ── Page navigation ──
  const pageTitles = ["Your Score", "What This Score Means", "Your Biggest Risks", "How to Raise Your Score", "What to Do Next"];
  const toggleSection = (page: number) => setCollapsed((prev) => ({ ...prev, [page]: !prev[page] }));

  // ── Reassessment countdown ──
  const reassessDaysLeft = Math.max(0, Math.ceil((new Date(reassessDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24)));

  const handleDownload = async () => {
    setDownloading(true);
    setDownloadError(null);
    try {
      await downloadPDF(record);
    } catch (err) {
      const msg = err instanceof Error ? err.message : "PDF generation failed";
      setDownloadError(msg);
    } finally {
      setDownloading(false);
    }
  };

  // ── Band color helper ──
  const bandColor = tier === "high" ? B.bandHigh : tier === "established" ? B.bandEstablished : tier === "developing" ? B.bandDeveloping : B.bandLimited;

  // ── Indicator helpers ──
  function indicatorLevel(label: string, inverted: boolean): { display: string; color: string } {
    const isHigh = /high|very high/i.test(label);
    const isLow = /low|very low/i.test(label);
    if (inverted) {
      if (isHigh) return { display: "High", color: B.bandLimited };
      if (isLow) return { display: "Low", color: B.teal };
      return { display: "Moderate", color: B.ink };
    }
    if (isHigh) return { display: "High", color: B.teal };
    if (isLow) return { display: "Low", color: B.bandLimited };
    return { display: "Moderate", color: B.ink };
  }

  return (
    <ReportErrorBoundary>
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 32, maxWidth: PDF.captureW, margin: "0 auto", padding: "0 0 40px" }}>

      {/* ---- PAGE 1 — Where do I stand? ---- */}
      <ReportPage record={record}>
        <ReportHeader />

        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 8 }}>
          <Overline>YOUR INCOME STABILITY REPORT</Overline>
          <div style={{ flexShrink: 0, textAlign: "center" }}>
            <QRCodeImage recordId={record.record_id} authCode={record.authorization_code} score={record.final_score} band={record.stability_band} date={issuedDate} model={record.model_version || "RP-2.0"} />
            <div style={{ ...T.meta, color: B.taupe, marginTop: 4 }}>Scan to verify</div>
          </div>
        </div>

        <h1 style={{ ...T.pageTitle, marginBottom: 12 }}>Your Score</h1>

        <div style={{ marginBottom: 20 }}>
          <div style={{ ...T.score, color: B.navy, marginBottom: 10 }}>{animatedScore}</div>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 8 }}>
            <div style={{ width: 10, height: 10, borderRadius: 2, backgroundColor: bandColor }} />
            <div style={{ ...T.classification, color: bandColor }}>{record.stability_band}</div>
          </div>
          {record.peer_stability_percentile_label && (
            <div style={{ ...T.small, color: B.muted, marginTop: 8 }}>
              {record.peer_stability_percentile_label} percentile among {(record.industry_sector || "").replace(/_/g, " ").replace(/\b\w/g, (c: string) => c.toUpperCase())} professionals{v2Benchmarks ? ` (peer average: ${v2Benchmarks.cluster_average_score})` : ""}
            </div>
          )}
        </div>

        {/* Classification Scale */}
        <div style={{ marginBottom: 16 }}>
          <div style={{ ...T.overline, color: B.taupe, marginBottom: 10 }}>WHERE YOU LAND</div>
          <div style={{ display: "flex", gap: 2, height: 8, marginBottom: 10 }}>
            {[
              { w: 30, color: B.bandLimited },
              { w: 20, color: B.bandDeveloping },
              { w: 25, color: B.bandEstablished },
              { w: 25, color: B.bandHigh },
            ].map((seg, i) => (
              <div key={i} style={{ width: `${seg.w}%`, backgroundColor: seg.color, borderRadius: i === 0 ? "3px 0 0 3px" : i === 3 ? "0 3px 3px 0" : 0, opacity: (tier === "limited" && i === 0) || (tier === "developing" && i === 1) || (tier === "established" && i === 2) || (tier === "high" && i === 3) ? 1 : 0.25 }} />
            ))}
          </div>
          <div style={{ display: "flex", gap: 2 }}>
            {[
              { range: "0–29", label: "Limited Stability", color: B.bandLimited, tier: "limited" as const },
              { range: "30–49", label: "Developing Stability", color: B.bandDeveloping, tier: "developing" as const },
              { range: "50–74", label: "Established Stability", color: B.bandEstablished, tier: "established" as const },
              { range: "75–100", label: "High Stability", color: B.bandHigh, tier: "high" as const },
            ].map((band) => (
              <div key={band.range} style={{ flex: 1, opacity: tier === band.tier ? 1 : 0.5 }}>
                <div style={{ ...T.micro, color: band.color, fontWeight: tier === band.tier ? 700 : 500 }}>{band.range}</div>
                <div style={{ ...T.meta, color: tier === band.tier ? B.navy : B.taupe, fontWeight: tier === band.tier ? 600 : 400 }}>{band.label}</div>
              </div>
            ))}
          </div>
        </div>

        <p style={{ ...T.body, color: B.muted, marginBottom: 16, maxWidth: 540 }}>
          {copy.p1_headline}
        </p>

        {/* Single most important insight — one line the customer remembers */}
        <div style={{ backgroundColor: B.bone, border: "1px solid rgba(14,26,43,0.06)", borderLeft: `3px solid ${B.purple}`, borderRadius: 4, padding: "14px 18px", marginBottom: 16 }}>
          <p style={{ ...T.body, color: B.navy, margin: 0, fontWeight: 500, lineHeight: 1.6 }}>
            {profileConstraintAdvice[dominantConstraint] || `The main thing holding ${name} back: ${dominantConstraintPlain[dominantConstraint]}.`}
            {v2Sensitivity?.tests?.[0]?.lift ? ` Fixing this could raise the score by about ${v2Sensitivity.tests[0].lift} points.` : ""}
          </p>
        </div>

        <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginBottom: 16 }}>
          <MetricCard label="INCOME CONTINUITY IF WORK STOPS" value={`${record.income_continuity_pct}%`} explanation={`${continuitySeverity.charAt(0).toUpperCase() + continuitySeverity.slice(1)} continuity for a ${structureDesc}.`} />
          <MetricCard label="LARGEST SOURCE STRESS TEST" value={<>{record.final_score} <span style={{ color: B.taupe, fontWeight: 400 }}>→</span> {Math.max(0, record.risk_scenario_score)}</>} explanation={`${record.risk_scenario_drop}-point drop. ${sourceDropSeverity === "collapse" ? "Severe concentration risk." : sourceDropSeverity === "severe" ? "Too dependent on one source." : "Meaningful single-source exposure."}`} />
          <MetricCard label="PRIMARY CONSTRAINT" value={dominantConstraintPlain[dominantConstraint].charAt(0).toUpperCase() + dominantConstraintPlain[dominantConstraint].slice(1)} explanation={profileConstraintAdvice[dominantConstraint]?.split(".")[0] + "." || ""} />
          <MetricCard label="DURABILITY" value={durabilityValue[subTier]} explanation={durabilityBody[subTier]} />
        </div>


        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 10, paddingTop: 16, borderTop: "1px solid rgba(14,26,43,0.12)" }}>
          {[["Prepared for", name], ["Industry", industrySector], ["Date Issued", issuedDate], ["Record ID", record.record_id.slice(0, 8)]].map(([l, v]) => (
            <div key={l}>
              <div style={{ ...T.meta, color: B.taupe }}>{l}</div>
              <div style={{ ...T.small, fontWeight: 500, color: B.navy }}>{v}</div>
            </div>
          ))}
        </div>
        {/* Classification/Operating Structure/Income Model/Revenue Structure — already stated in headline */}

        {/* Score trend — shown only if previous assessments exist */}
        {(() => {
          try {
            const allRecords = JSON.parse(localStorage.getItem("rp_records") || "[]") as Array<{ record_id: string; final_score: number; stability_band: string; assessment_date_utc: string }>;
            const previous = allRecords.filter(r => r.record_id !== record.record_id && typeof r.final_score === "number").sort((a, b) => (b.assessment_date_utc || "").localeCompare(a.assessment_date_utc || ""));
            if (previous.length === 0) return null;
            const last = previous[0];
            const diff = record.final_score - last.final_score;
            return (
              <div style={{ backgroundColor: B.bone, border: "1px solid rgba(14,26,43,0.06)", borderRadius: 4, padding: "12px 16px", marginBottom: 12 }}>
                <div style={{ ...T.overline, color: B.teal, marginBottom: 6 }}>SCORE TREND</div>
                <div style={{ display: "flex", alignItems: "baseline", gap: 8 }}>
                  <span style={{ ...T.sectionLabel, color: B.navy }}>{last.final_score}</span>
                  <span style={{ ...T.meta, color: B.taupe }}>→</span>
                  <span style={{ ...T.sectionLabel, color: B.navy }}>{record.final_score}</span>
                  <span style={{ ...T.small, fontWeight: 600, color: diff > 0 ? B.teal : diff < 0 ? B.bandLimited : B.muted }}>{diff > 0 ? `+${diff}` : diff === 0 ? "no change" : String(diff)} points</span>
                </div>
                <p style={{ ...T.meta, color: B.muted, margin: "4px 0 0" }}>Compared with your previous assessment{last.assessment_date_utc ? ` from ${last.assessment_date_utc.split("T")[0]}` : ""}.</p>
              </div>
            );
          } catch { return null; }
        })()}

        <p style={{ ...T.meta, color: B.taupe, lineHeight: 1.5, margin: 0, fontStyle: "italic" }}>
          The Income Stability Score™ is a present-state income stability assessment based on information provided by the user. It does not provide financial advice and does not predict future financial outcomes.
        </p>

        <PageFooter section="Your Score" page={1} />
      </ReportPage>


      {/* ---- PAGE 2 — What does this score mean? ---- */}
      <ReportPage record={record}>
        <ReportHeader />
        <h1 style={{ ...T.pageTitle, marginBottom: 12 }}>What This Score Means</h1>
        <p style={{ ...T.body, color: B.muted, marginBottom: 20, maxWidth: 540 }}>
          {p2Intro[subTier]}
        </p>

        {/* What is already working */}
        <Overline>WHAT IS ALREADY WORKING</Overline>
        <p style={{ ...T.body, color: B.muted, margin: "0 0 20px" }}>{p2WorkingBody}</p>

        <SectionDivider />

        {/* What is still vulnerable */}
        <Overline>WHAT IS STILL VULNERABLE</Overline>
        <div style={{ marginBottom: 20 }}>
          <div style={{ ...T.sectionLabel, color: B.navy, marginBottom: 4 }}>Primary: {dominantConstraintPlain[dominantConstraint]}</div>
          <p style={{ ...T.body, color: B.muted, margin: 0 }}>{profileConstraintAdvice[dominantConstraint]}</p>
        </div>

        {/* Peer comparison insight */}
        {v2Benchmarks && v2Benchmarks.outlier_dimensions.length > 0 && (
          <div style={{ backgroundColor: B.bone, border: "1px solid rgba(14,26,43,0.06)", borderRadius: 4, padding: "12px 16px", marginTop: 16, marginBottom: 4 }}>
            <div style={{ ...T.overline, color: B.teal, marginBottom: 8 }}>HOW YOU COMPARE TO PEERS{olIndustryLabel ? ` IN ${olIndustryLabel.toUpperCase()}` : ""}</div>
            <div style={{ display: "flex", gap: 16, marginBottom: 10, padding: "8px 0", borderBottom: `1px solid ${B.stone}` }}>
              <div style={{ ...T.small, color: B.navy }}>Your Score: <span style={{ fontWeight: 700, fontSize: 14 }}>{score}</span></div>
              <div style={{ ...T.small, color: B.muted }}>Peer Average: <span style={{ fontWeight: 700, fontSize: 14, color: B.navy }}>{v2Benchmarks.cluster_average_score}</span></div>
              <div style={{ ...T.small, color: B.muted }}>Top 20%: <span style={{ fontWeight: 700, fontSize: 14, color: B.teal }}>{v2Benchmarks.top_20_threshold}</span></div>
            </div>
            {v2Benchmarks.outlier_dimensions.slice(0, 3).map((d) => {
              const peerLabel: Record<string, string> = {
                income_persistence: "Income that continues if work stops",
                forward_revenue_visibility: "Income secured ahead of time",
                concentration_resilience: "Reliance on one source",
                income_source_diversity: "Number of income sources",
                source_diversification: "Number of income sources",
                labor_dependence: "Dependence on daily work",
                active_labor_dependence: "Dependence on daily work",
                earnings_stability: "Month-to-month earnings stability",
                income_variability: "Month-to-month earnings stability",
                forward_visibility: "Income secured ahead of time",
                income_continuity: "Income that continues if work stops",
                source_concentration: "Reliance on one source",
              };
              const label = peerLabel[d.factor.toLowerCase().replace(/ /g, "_")] ?? d.factor;
              return (
                <div key={d.factor} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", margin: "0 0 6px" }}>
                  <span style={{ ...T.small, fontWeight: 500, color: B.navy }}>{label}</span>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <span style={{ ...T.meta, color: B.muted }}>You: <span style={{ fontWeight: 600, color: B.navy }}>{Math.round(d.user_value)}</span></span>
                    <span style={{ ...T.meta, color: B.muted }}>Peers: <span style={{ fontWeight: 600 }}>{Math.round(d.peer_average)}</span></span>
                    <span style={{ ...T.micro, color: d.direction === "above" ? B.teal : B.bandLimited, fontWeight: 600 }}>{d.direction === "above" ? "▲" : "▼"} {d.direction}</span>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        <SectionDivider />

        {/* Bottom line — one clear takeaway */}
        <div style={{ backgroundColor: B.bone, border: "1px solid rgba(14,26,43,0.06)", borderLeft: `3px solid ${B.purple}`, borderRadius: 4, padding: "14px 18px" }}>
          <div style={{ ...T.overline, color: B.teal, marginBottom: 6 }}>BOTTOM LINE</div>
          <p style={{ ...T.body, color: B.navy, margin: "0 0 8px", fontWeight: 500 }}>
            {p2BottomLine[subTier]}
          </p>
          <p style={{ ...T.small, color: B.muted, margin: 0 }}>
            {p2Interpretation[subTier]}
          </p>
        </div>

        <PageFooter section="What This Score Means" page={2} />
      </ReportPage>


      {/* ---- PAGE 3 — Where is the structure exposed? ---- */}
      <ReportPage record={record}>
        <ReportHeader />
        <h1 style={{ ...T.pageTitle, marginBottom: 12 }}>Your Biggest Risks</h1>
        <p style={{ ...T.body, color: B.muted, marginBottom: 24, maxWidth: 540 }}>
          {p3Intro[subTier]}{olIndustryLabel ? ` These risks are assessed in the context of the ${olIndustryLabel} industry.` : ""}
        </p>

        {/* Two large cards: Stress Test + Continuity */}
        <div style={{ display: "flex", gap: 14, marginBottom: 20 }}>
          <div style={{ flex: 3, backgroundColor: B.bone, border: "1px solid rgba(14,26,43,0.06)", borderRadius: 4, padding: "16px 20px" }}>
            <Overline>IF YOUR LARGEST INCOME SOURCE DISAPPEARED</Overline>
            <div style={{ display: "flex", alignItems: "baseline", gap: 8, marginBottom: 8 }}>
              <span style={{ fontSize: 28, fontWeight: 600, color: B.navy }}>{record.final_score}</span>
              <span style={{ fontSize: 16, color: B.taupe }}>→</span>
              <span style={{ fontSize: 28, fontWeight: 600, color: B.bandLimited }}>{Math.max(0, record.risk_scenario_score)}</span>
            </div>
            <p style={{ ...T.small, color: B.muted, margin: 0 }}>
              A {record.risk_scenario_drop}-point drop from losing one source.{record.risk_scenario_drop > score * 0.4 ? " That is a severe dependency." : ""}
            </p>
          </div>
          <div style={{ flex: 2, backgroundColor: B.bone, border: "1px solid rgba(14,26,43,0.06)", borderRadius: 4, padding: "16px 20px" }}>
            <Overline>HOW LONG INCOME WOULD CONTINUE IF WORK STOPPED</Overline>
            <div style={{ fontSize: 22, fontWeight: 600, color: B.navy, marginBottom: 4 }}>
              Estimated: {continuityDisplay}
            </div>
            <p style={{ ...T.small, color: B.muted, margin: 0 }}>
              {record.income_continuity_months < 1 ? `As a ${structureDesc}, this is critically short.` : record.income_continuity_months < 3 ? `Limited runway for a ${structureDesc}.` : record.income_continuity_months < 6 ? `Moderate runway. Extend further for stronger protection.` : `Strong continuity window.`}
            </p>
          </div>
        </div>

        {/* Stress scenarios — top 3, clear layout */}
        {v2Scenarios && v2Scenarios.length > 0 && (
          <div style={{ marginBottom: 20 }}>
            <Overline>WHAT COULD HURT YOUR SCORE MOST</Overline>
            {[...v2Scenarios].sort((a, b) => b.score_drop - a.score_drop).slice(0, 3).map((s) => {
              const scenarioPlain: Record<string, string> = {
                active_labor_interrupted: "You are unable to work for an extended period",
                platform_dependency_shock: "An income channel you rely on changes its terms or access",
                forward_commitments_delayed: "Income you were expecting gets delayed",
                client_concentration_loss: "Your largest client leaves or stops paying",
                market_contraction: "Demand in your industry drops significantly",
                regulatory_disruption: "A regulatory or policy change affects your work",
                revenue_model_disruption: "Your primary way of earning income stops working",
                high_volatility_month: "You have a month where income drops sharply",
                seasonal_revenue_gap: "A seasonal slowdown reduces your income",
                key_client_loss: "You lose a key client or contract",
                pricing_pressure: "What you can charge drops due to market pressure",
                recurring_stream_degrades: "A repeating income stream weakens or ends",
                referral_pipeline_dries: "New business or referrals slow down significantly",
                contract_non_renewal: "A major contract is not renewed",
                scope_reduction: "A client significantly reduces the scope of your work",
              };
              // Normalize: try ID match, then label match via replace chain
              const title = scenarioPlain[s.scenario_id] ?? s.label
                .replace(/^Active Labor Interrupted$/i, "You are unable to work for an extended period")
                .replace(/^Platform Dependency Shock$/i, "An income channel you rely on changes its terms or access")
                .replace(/^Forward Commitments Delayed$/i, "Income you were expecting gets delayed")
                .replace(/^High Volatility Month$/i, "You have a month where income drops sharply")
                .replace(/^Client Concentration Loss$/i, "Your largest client leaves or stops paying")
                .replace(/^Market Contraction$/i, "Demand in your industry drops significantly")
                .replace(/^Revenue Model Disruption$/i, "Your primary way of earning income stops working")
                .replace(/^Seasonal Revenue Gap$/i, "A seasonal slowdown reduces your income")
                .replace(/^Key Client Loss$/i, "You lose a key client or contract")
                .replace(/^Regulatory Disruption$/i, "A regulatory or policy change affects your work")
                .replace(/^Pricing Pressure$/i, "What you can charge drops due to market pressure")
                .replace(/^Recurring Stream Degrades$/i, "A repeating income stream weakens or ends")
                .replace(/^Referral Pipeline Dries$/i, "New business or referrals slow down significantly")
                .replace(/^Contract Non.?Renewal$/i, "A major contract is not renewed")
                .replace(/^Scope Reduction$/i, "A client significantly reduces the scope of your work");
              // Safety: if title still looks like a model label (multiple capital words), lowercase it
              const safeTitle = (/^[A-Z][a-z]+ [A-Z]/.test(title) && !title.includes("You ") && !title.includes("A ") && !title.includes("Your "))
                ? title.charAt(0).toUpperCase() + title.slice(1).toLowerCase()
                : title;
              const severity = s.band_shift ? "SEVERE" : (s.scenario_score <= 0 || s.score_drop > score * 0.5) ? "SEVERE" : s.score_drop > 8 ? "HIGH" : s.score_drop > 3 ? "MODERATE" : "LOW";
              const sevColor = severity === "SEVERE" ? B.bandLimited : severity === "HIGH" ? B.bandDeveloping : B.muted;
              return (
                <div key={s.scenario_id} style={{ padding: "12px 0", borderBottom: `1px solid ${B.stone}` }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 4 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                      <span style={{ ...T.micro, color: sevColor, minWidth: 60 }}>{severity}</span>
                      <span style={{ ...T.sectionLabel, color: B.navy }}>{safeTitle}</span>
                    </div>
                    <span style={{ ...T.small, color: B.navy, flexShrink: 0 }}>
                      {s.original_score} → <span style={{ color: B.bandLimited }}>{s.scenario_score}</span>
                    </span>
                  </div>
                  {s.band_shift && (
                  <div style={{ paddingLeft: 70 }}>
                    <p style={{ ...T.meta, color: B.bandLimited, margin: 0, fontWeight: 500 }}>
                      Would drop to {s.scenario_band} band.
                    </p>
                  </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* Income Structure Mix */}
        <Overline>HOW THE INCOME IS CURRENTLY BUILT</Overline>
        <div style={{ display: "flex", gap: 2, height: 10, marginBottom: 12, marginTop: 6 }}>
          <div style={{ width: `${record.active_income_level}%`, backgroundColor: B.navy, borderRadius: 1 }} />
          <div style={{ width: `${record.semi_persistent_income_level}%`, backgroundColor: B.taupe, borderRadius: 1 }} />
          <div style={{ width: `${record.persistent_income_level}%`, backgroundColor: B.teal, borderRadius: 1 }} />
        </div>
        <div style={{ display: "flex", gap: 24, marginBottom: 10 }}>
          {[
            { label: "Earned through active work", pct: record.active_income_level, color: B.ink },
            { label: "Repeatable income", pct: record.semi_persistent_income_level, color: B.taupe },
            { label: "Continues without daily work", pct: record.persistent_income_level, color: B.teal },
          ].map((seg) => (
            <div key={seg.label} style={{ flex: 1 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <div style={{ width: 8, height: 8, borderRadius: 1, backgroundColor: seg.color }} />
                <span style={{ ...T.small, fontWeight: 500, color: B.navy }}>{seg.label} — {seg.pct}%</span>
              </div>
            </div>
          ))}
        </div>
        <p style={{ ...T.meta, color: B.muted, marginBottom: 20, fontStyle: "italic" }}>
          {record.active_income_level >= 80 ? `High active-work dependence for a ${structureDesc}. ${profileConstraintAdvice.labor_dependence?.split(".")[0]}.` : record.active_income_level >= 50 ? `${record.active_income_level}% active-work dependence. Shift more toward repeatable income.` : `${100 - record.active_income_level}% repeats or continues independently — a structural advantage.`}
        </p>

        {/* Peer comparison moved to Page 2 — shown once for clarity */}


        <PageFooter section="Your Biggest Risks" page={3} />
      </ReportPage>


      {/* ---- PAGE 4 — What would improve it? ---- */}
      <ReportPage record={record}>
        <ReportHeader />
        <h1 style={{ ...T.pageTitle, marginBottom: 12 }}>How to Raise Your Score</h1>
        <p style={{ ...T.body, color: B.muted, marginBottom: 24, maxWidth: 540 }}>
          As a {structureDesc} in {industrySector} with {incomeModelDesc} income and {revenueDesc}, the fastest path to a higher score is restructuring how income flows — not just earning more.
        </p>

        {/* Current Band / Next Target Band — compact side by side */}
        <div style={{ display: "flex", gap: 12, marginBottom: 16 }}>
          <div style={{ flex: 1, backgroundColor: B.bone, border: "1px solid rgba(14,26,43,0.06)", borderLeft: `3px solid ${bandColor}`, borderRadius: 4, padding: "14px 18px" }}>
            <Overline>CURRENT BAND</Overline>
            <div style={{ ...T.cardHeading, color: bandColor }}>{record.stability_band} | {record.final_score}</div>
            <p style={{ ...T.meta, color: B.muted, margin: "8px 0 0" }}>{p4CurrentBandBody[subTier]}</p>
          </div>
          <div style={{ flex: 1, backgroundColor: B.bone, border: "1px solid rgba(14,26,43,0.06)", borderLeft: `3px solid ${tier === "high" ? B.bandHigh : tier === "established" ? B.bandHigh : tier === "developing" ? B.bandEstablished : B.bandDeveloping}`, borderRadius: 4, padding: "14px 18px" }}>
            <Overline>NEXT TARGET BAND</Overline>
            <div style={{ ...T.cardHeading, color: B.navy }}>{record.final_score < 30 ? "Developing Stability | 30+" : record.final_score < 50 ? "Established Stability | 50+" : record.final_score < 75 ? "High Stability | 75+" : "Maintain Current"}</div>
            <p style={{ ...T.meta, color: B.muted, margin: "6px 0 0" }}>{p4TargetBandBody}</p>
          </div>
        </div>

        {/* Top 3 projected improvements — clear layout */}
        {v2Lift && v2Lift.lift_scenarios.length > 0 && (
          <div style={{ marginBottom: 16 }}>
            <Overline>IF YOU MADE THESE CHANGES</Overline>
            {v2Lift.lift_scenarios.filter(s => s.lift > 0).sort((a, b) => b.lift - a.lift).slice(0, 3).map((s, i) => {
              const liftPlain: Record<string, string> = {
                reduce_labor_dependence: "Reduce how much income depends on daily work",
                extend_forward_visibility: "Secure more income before next month begins",
                reduce_concentration: "Reduce reliance on the largest source",
                increase_persistence: "Build more income that repeats or continues without daily work",
                increase_persistent_revenue: "Build more income that repeats or continues without daily work",
                add_income_sources: "Add more dependable income sources",
                reduce_variability: "Reduce month-to-month income swings",
                increase_continuity: "Increase how long income would continue if work stopped",
                extend_continuity: "Increase how long income would continue if work stopped",
                diversify_sources: "Spread income across more independent sources",
                reduce_active_dependence: "Reduce how much income depends on daily work",
                improve_forward_secured: "Secure more income before next month begins",
                strengthen_persistence: "Build more income that continues without daily work",
                reduce_largest_source: "Reduce reliance on the largest source",
              };
              const title = liftPlain[s.scenario_id] ?? s.label
                .replace(/Extend Forward Visibility/i, "Secure more income before next month begins")
                .replace(/Reduce Labor Dependence/i, "Reduce how much income depends on daily work")
                .replace(/Reduce Concentration/i, "Reduce reliance on the largest source")
                .replace(/Increase Persist.*Revenue/i, "Build more income that repeats or continues without daily work");
              return (
                <div key={s.scenario_id} style={{ padding: "10px 0", borderBottom: `1px solid ${B.stone}` }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                      <span style={{ fontSize: 16, fontWeight: 600, color: B.purple, minWidth: 20 }}>{i + 1}</span>
                      <span style={{ ...T.sectionLabel, color: B.navy }}>{title}</span>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: 6, flexShrink: 0 }}>
                      <span style={{ ...T.small, color: B.teal, fontWeight: 600 }}>+{s.lift} points</span>
                      <span style={{ ...T.meta, color: B.muted }}>→ {s.projected_score}</span>
                    </div>
                  </div>
                </div>
              );
            })}
            {/* Combined improvement line */}
            {v2Lift.combined_top_two && v2Lift.combined_top_two.lift > 0 && (
              <div style={{ ...T.small, color: B.muted, marginTop: 10, fontStyle: "italic" }}>
                {p4CombinedLine}
              </div>
            )}
            {/* Score progression visual */}
            {v2Lift.combined_top_two && v2Lift.combined_top_two.lift > 0 && (
            <div style={{ marginTop: 16, marginBottom: 8 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 6 }}>
                <span style={{ ...T.meta, color: B.muted, minWidth: 50 }}>Now</span>
                <div style={{ flex: 1, height: 8, backgroundColor: "rgba(14,26,43,0.06)", borderRadius: 4, overflow: "hidden" }}>
                  <div style={{ height: "100%", width: `${record.final_score}%`, backgroundColor: B.navy, borderRadius: 4 }} />
                </div>
                <span style={{ ...T.meta, color: B.navy, fontWeight: 600, minWidth: 24, textAlign: "right" }}>{record.final_score}</span>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <span style={{ ...T.meta, color: B.muted, minWidth: 50 }}>After</span>
                <div style={{ flex: 1, height: 8, backgroundColor: "rgba(14,26,43,0.06)", borderRadius: 4, overflow: "hidden" }}>
                  <div style={{ height: "100%", width: `${Math.min(100, v2Lift.combined_top_two.projected_score)}%`, backgroundColor: B.teal, borderRadius: 4 }} />
                </div>
                <span style={{ ...T.meta, color: B.teal, fontWeight: 600, minWidth: 24, textAlign: "right" }}>{v2Lift.combined_top_two.projected_score}</span>
              </div>
            </div>
            )}
          </div>
        )}

        {/* 4 priority actions — compact list */}
        {olActions && olActions.length > 0 && (
          <div style={{ ...T.meta, color: B.teal, fontWeight: 500, marginBottom: 8 }}>
            Tailored for {olIndustryLabel ? `${olIndustryLabel} · ` : ""}{olFamilyLabel ?? "your income model"}
          </div>
        )}
        <div style={{ display: "flex", flexDirection: "column", gap: 12, marginBottom: 20 }}>
          {(olActions && olActions.length > 0
            ? olActions.slice(0, 4).map((a, i) => ({
                rank: `Priority ${i + 1}`,
                title: a.label,
                copy: a.description,
                why: a.why_now,
              }))
            : (() => {
                const priorities = [
                  { key: "forward_visibility", title: "Secure more income ahead of time", copy: profileConstraintAdvice.forward_visibility },
                  { key: "source_concentration", title: "Reduce reliance on the largest source", copy: `${profileConstraintAdvice.source_concentration} Your stress test shows a ${record.risk_scenario_drop}-point drop if the largest source disappears.` },
                  { key: "labor_dependence", title: "Build more repeatable income", copy: profileConstraintAdvice.labor_dependence },
                  { key: "low_continuity", title: "Extend income continuity", copy: `${profileConstraintAdvice.low_continuity} Currently: about ${continuityDisplay}.` },
                ];
                // Put dominant constraint first
                const sorted = [
                  ...priorities.filter(p => p.key === dominantConstraint),
                  ...priorities.filter(p => p.key !== dominantConstraint),
                ];
                return sorted.map((p, i) => ({ rank: `Priority ${i + 1}`, title: p.title, copy: p.copy, why: "" }));
              })()

          ).map((action) => (
            <div key={action.rank} style={{ display: "flex", gap: 14, alignItems: "flex-start" }}>
              <div style={{ ...T.micro, color: B.purple, minWidth: 60, paddingTop: 2 }}>{action.rank}</div>
              <div>
                <div style={{ ...T.sectionLabel, color: B.navy, marginBottom: 3 }}>{action.title}</div>
                <p style={{ ...T.small, color: B.muted, margin: 0 }}>{action.copy}</p>
                {action.why && <p style={{ ...T.meta, color: B.teal, margin: "4px 0 0", fontWeight: 500 }}>Why now: {action.why}</p>}
              </div>
            </div>
          ))}
        </div>

        {/* What NOT to do — removed: generic filler */}


        <PageFooter section="How to Raise Your Score" page={4} />
      </ReportPage>


      {/* ---- PAGE 5 — What do I do next? ---- */}
      <ReportPage record={record}>
        <ReportHeader />
        <h1 style={{ ...T.pageTitle, marginBottom: 16 }}>What to Do Next</h1>

        <p style={{ ...T.body, color: B.muted, marginBottom: 24, maxWidth: 540, lineHeight: 1.6 }}>
          {p5Intro[subTier]}
        </p>

        {/* Action items — profile-specific */}
        <div style={{ marginBottom: 24 }}>
          <div style={{ ...T.sectionLabel, color: B.navy, marginBottom: 8 }}>What to do next as a {structureDesc} in {industrySector}</div>
          {(({
            source_concentration: [
              `Reduce largest-source dependency (currently a ${record.risk_scenario_drop}-point stress test drop)`,
              `Lock in at least one ${incomeModel.includes("commission") ? "recurring commission" : incomeModel.includes("contract") ? "multi-month contract" : "committed income source"} for 3+ months`,
              `Build ${incomeModel.includes("consulting") ? "productized or retainer" : "repeatable"} income alongside ${incomeModelDesc} work`,
              "Reassess only after changes are active, not planned",
            ],
            forward_visibility: [
              `Lock in ${incomeModel.includes("commission") ? "advance pipeline commitments" : incomeModel.includes("contract") ? "multi-month contract extensions" : "recurring or pre-committed revenue"} for next quarter`,
              `Reduce largest-source dependency (${record.risk_scenario_drop}-point drop risk)`,
              `Convert some ${revenueDesc} into contracted or recurring payments`,
              "Reassess only after changes are active, not planned",
            ],
            labor_dependence: [
              `Convert ${record.active_income_level}% active-work income into ${incomeModel.includes("consulting") ? "productized delivery or licensing" : incomeModel.includes("creator") ? "royalties, licensing, or syndication" : "repeatable or passive streams"}`,
              `Lock in at least one committed income source for 3+ months`,
              `Reduce largest-source exposure (${record.risk_scenario_drop}-point drop risk)`,
              "Reassess only after changes are active, not planned",
            ],
            low_continuity: [
              `Extend continuity beyond ${continuityDisplay} with ${incomeModel.includes("contract") ? "longer-term contracts" : incomeModel.includes("commission") ? "residual or trail commissions" : "recurring revenue streams"}`,
              "Lock in at least one committed income source for 3+ months",
              `Reduce largest-source exposure (${record.risk_scenario_drop}-point drop risk)`,
              "Reassess only after changes are active, not planned",
            ],
            few_sources: [
              `Add at least one new ${incomeModel.includes("consulting") ? "client segment or service line" : incomeModel.includes("product") ? "distribution channel" : "income source"} contributing 10%+ of total`,
              "Lock in at least one committed income source for 3+ months",
              `Convert some ${revenueDesc} into repeatable income`,
              "Reassess only after changes are active, not planned",
            ],
          })[dominantConstraint]).map((item, i) => (
            <div key={i} style={{ ...T.small, color: B.ink, display: "flex", gap: 8, marginBottom: 5 }}>
              <span style={{ color: B.purple, fontWeight: 600, flexShrink: 0 }}>{i + 1}.</span>{item}
            </div>
          ))}
        </div>

        {/* 90-Day Action Plan removed — duplicated the numbered list above */}

        {/* Bottom cards: Reassessment + Verification */}
        <div style={{ display: "flex", gap: 12, marginBottom: 16 }}>
          <div style={{ flex: 1, backgroundColor: B.bone, border: "1px solid rgba(14,26,43,0.06)", borderRadius: 4, padding: "14px 18px" }}>
            <Overline>WHEN TO REASSESS</Overline>
            <div style={{ ...T.cardHeading, color: B.navy, marginBottom: 2 }}>{reassessDate}</div>
            <div style={{ fontSize: 13, fontWeight: 600, color: B.purple, marginBottom: 6 }}>{reassessDaysLeft} days from now</div>
            <p style={{ ...T.meta, color: B.muted, margin: "0 0 8px", lineHeight: 1.5 }}>{copy.p5_reassess}</p>
          </div>
          <div style={{ flex: 1, backgroundColor: B.bone, border: "1px solid rgba(14,26,43,0.06)", borderRadius: 4, padding: "14px 18px" }}>
            <Overline>VERIFICATION</Overline>
            <div style={{ ...T.meta, color: B.ink, display: "flex", flexDirection: "column", gap: 2 }}>
              <div>Record ID: <span style={{ fontFamily: "monospace", fontSize: 9 }}>{record.record_id.slice(0, 8)}</span></div>
              <div>Registry Status: Private Record</div>
              <div>Model: {record.model_version || "RP-2.0"}</div>
              <div>Verification: peoplestar.com/RunPayway/verify</div>
            </div>
          </div>
        </div>

        {/* Peer comparison shown once on Page 2 — not repeated here */}

        <p style={{ ...T.meta, color: B.taupe, lineHeight: 1.5, margin: 0, fontStyle: "italic" }}>
          The Income Stability Score™ is a present-state income stability assessment based on information provided by the user. It does not provide financial advice and does not predict future financial outcomes. This report reflects a present-state structural interpretation under the RunPayway™ framework.
        </p>

        <PageFooter section="What to Do Next" page={5} />
      </ReportPage>


      {/* ================================================================
          POST-REPORT ACTION PANEL — APP UI, NOT REPORT CONTENT
          ================================================================ */}
      <div className="download-section no-print" style={{ display: "flex", flexDirection: "column", gap: 12, width: "100%" }}>
        {/* Primary actions — horizontal row */}
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
          <button
            onClick={handleDownload}
            disabled={downloading}
            style={{ padding: "12px 24px", fontSize: 14, fontWeight: 600, color: "#ffffff", borderRadius: 12, border: "none", cursor: "pointer", backgroundColor: B.navy, opacity: downloading ? 0.6 : 1, transition: "background-color 180ms ease, transform 180ms ease", flex: 1, minWidth: 180, boxShadow: "0 4px 12px rgba(14,26,43,0.15)" }}
            onMouseEnter={(e) => !downloading && (e.currentTarget.style.backgroundColor = B.purple)}
            onMouseLeave={(e) => !downloading && (e.currentTarget.style.backgroundColor = B.navy)}>
            {downloading ? "Generating PDF…" : "Download Report"}
          </button>

          <button
            onClick={() => {
              const url = `https://peoplestar.com/RunPayway/verify?id=${record.record_id}&auth=${record.authorization_code}`;
              navigator.clipboard.writeText(url).then(() => {
                setLinkCopied(true);
                setTimeout(() => setLinkCopied(false), 3000);
              });
            }}
            style={{ padding: "12px 18px", fontSize: 13, fontWeight: 500, color: linkCopied ? B.purple : B.navy, borderRadius: 12, border: `1px solid ${linkCopied ? B.purple : B.stone}`, cursor: "pointer", backgroundColor: linkCopied ? "rgba(31,109,122,0.06)" : "#ffffff", transition: "all 180ms ease" }}>
            {linkCopied ? "Link Copied" : "Copy Verification Link"}
          </button>

          <button
            onClick={() => {
              const nextDate = new Date(record.issued_timestamp_utc || record.assessment_date_utc);
              nextDate.setMonth(nextDate.getMonth() + (record.final_score < 40 ? 2 : record.final_score >= 80 ? 6 : 3));
              const dateStr = nextDate.toISOString().replace(/[-:]/g, "").split(".")[0] + "Z";
              const endDate = new Date(nextDate.getTime() + 30 * 60000);
              const endStr = endDate.toISOString().replace(/[-:]/g, "").split(".")[0] + "Z";
              const url = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent("RunPayway™ Income Stability Reassessment")}&dates=${dateStr}/${endStr}&details=${encodeURIComponent(`Time to reassess your Income Stability Score™.\n\nPrevious score: ${record.final_score} (${record.stability_band})\nPrimary focus: ${record.primary_constraint_label}\n\nTake your assessment at https://runpayway.com/pricing`)}`;
              window.open(url, "_blank");
            }}
            style={{ padding: "12px 18px", fontSize: 13, fontWeight: 500, color: B.navy, borderRadius: 12, border: `1px solid ${B.stone}`, cursor: "pointer", backgroundColor: "#ffffff", transition: "all 180ms ease" }}>
            Add Reassessment to Calendar
          </button>
        </div>

        {/* Shareable Score Card */}
        <div id="shareable-score-card" style={{ borderRadius: 16, border: "1px solid rgba(14,26,43,0.08)", overflow: "hidden" }}>
          {/* Card header */}
          <div style={{ background: "linear-gradient(135deg, #0E1A2B 0%, #1a2d45 100%)", padding: "28px 28px 24px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
              <div>
                <div style={{ fontSize: 10, fontWeight: 600, color: "rgba(244,241,234,0.50)", letterSpacing: "0.12em", textTransform: "uppercase" as const, marginBottom: 8 }}>INCOME STABILITY SCORE™</div>
                <div style={{ fontSize: 48, fontWeight: 600, color: "#F4F1EA", lineHeight: 1 }}>{record.final_score}</div>
                <div style={{ display: "inline-flex", alignItems: "center", gap: 8, marginTop: 10 }}>
                  <div style={{ width: 8, height: 8, borderRadius: 2, backgroundColor: bandColor }} />
                  <span style={{ fontSize: 15, fontWeight: 500, color: bandColor }}>{record.stability_band}</span>
                </div>
              </div>
              <div style={{ textAlign: "right" }}>
                <Image src={logoImg} alt="RunPayway" width={100} height={12} style={{ height: "auto", marginBottom: 8, filter: "brightness(10)" }} />
                <div style={{ fontSize: 10, color: "rgba(244,241,234,0.40)" }}>Verified Assessment</div>
              </div>
            </div>
          </div>
          {/* Card body */}
          <div style={{ padding: "20px 28px 24px", backgroundColor: "#FFFFFF" }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 16 }}>
              {[
                ["Prepared for", name],
                ["Industry", (record.industry_sector || "").replace(/_/g, " ").replace(/\b\w/g, (c: string) => c.toUpperCase())],
                ["Assessed", issuedDate],
              ].map(([l, v]) => (
                <div key={l}>
                  <div style={{ fontSize: 10, color: B.taupe, marginBottom: 2 }}>{l}</div>
                  <div style={{ fontSize: 12, fontWeight: 500, color: B.navy }}>{v}</div>
                </div>
              ))}
            </div>
            <div style={{ height: 1, backgroundColor: "rgba(14,26,43,0.08)", marginBottom: 16 }} />
            <div style={{ display: "flex", gap: 16, marginBottom: 16 }}>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 10, color: B.taupe, marginBottom: 2 }}>Peer Percentile</div>
                <div style={{ fontSize: 12, fontWeight: 600, color: B.purple }}>{record.peer_stability_percentile_label || "—"}</div>
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 10, color: B.taupe, marginBottom: 2 }}>Model Version</div>
                <div style={{ fontSize: 12, fontWeight: 500, color: B.navy }}>RP-2.0</div>
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 10, color: B.taupe, marginBottom: 2 }}>Record ID</div>
                <div style={{ fontSize: 12, fontWeight: 500, color: B.navy, fontFamily: "monospace" }}>{record.record_id.slice(0, 8)}</div>
              </div>
            </div>
            <div style={{ fontSize: 10, color: B.taupe, marginBottom: 16 }}>
              Verify this score at peoplestar.com/RunPayway/verify
            </div>
            {/* Share actions */}
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              <button
                onClick={() => {
                  const text = `${name} — Income Stability Score™: ${record.final_score} (${record.stability_band}). ${record.peer_stability_percentile_label ? `${record.peer_stability_percentile_label} percentile. ` : ""}Assessed ${issuedDate} under Model RP-2.0. Verify at peoplestar.com/RunPayway/verify?id=${record.record_id}&auth=${record.authorization_code}`;
                  navigator.clipboard.writeText(text).then(() => {
                    setLinkCopied(true);
                    setTimeout(() => setLinkCopied(false), 3000);
                  });
                }}
                style={{ padding: "10px 16px", fontSize: 12, fontWeight: 600, color: B.navy, borderRadius: 10, border: `1px solid ${B.stone}`, cursor: "pointer", backgroundColor: B.bone, transition: "all 150ms ease", flex: 1 }}
              >
                {linkCopied ? "Copied to clipboard" : "Copy score summary"}
              </button>
              <button
                onClick={() => {
                  const url = `https://peoplestar.com/RunPayway/verify?id=${record.record_id}&auth=${record.authorization_code}`;
                  navigator.clipboard.writeText(url).then(() => {
                    setLinkCopied(true);
                    setTimeout(() => setLinkCopied(false), 3000);
                  });
                }}
                style={{ padding: "10px 16px", fontSize: 12, fontWeight: 600, color: B.navy, borderRadius: 10, border: `1px solid ${B.stone}`, cursor: "pointer", backgroundColor: B.bone, transition: "all 150ms ease", flex: 1 }}
              >
                Copy verification link
              </button>
              <button
                onClick={async () => {
                  const el = document.getElementById("shareable-score-card");
                  if (!el) return;
                  const sendSection = el.querySelector("[data-send-section]") as HTMLElement | null;
                  if (sendSection) sendSection.style.display = "none";
                  try {
                    const html2canvas = (await import("html2canvas")).default;
                    const canvas = await html2canvas(el, { scale: 2, useCORS: true, backgroundColor: "#ffffff" });
                    if (sendSection) sendSection.style.display = "";
                    const link = document.createElement("a");
                    link.download = `RunPayway-Score-Card-${record.record_id.slice(0, 8)}.png`;
                    link.href = canvas.toDataURL("image/png");
                    link.click();
                  } catch {
                    if (sendSection) sendSection.style.display = "";
                  }
                }}
                style={{ padding: "10px 16px", fontSize: 12, fontWeight: 600, color: "#FFFFFF", borderRadius: 10, border: "none", cursor: "pointer", backgroundColor: B.navy, transition: "all 150ms ease", flex: 1 }}
              >
                Download score card
              </button>
            </div>
          </div>
          {/* Send to someone */}
          <div data-send-section style={{ padding: "16px 28px 20px", backgroundColor: B.bone, borderTop: "1px solid rgba(14,26,43,0.06)" }}>
            <div style={{ fontSize: 12, fontWeight: 600, color: B.navy, marginBottom: 4 }}>Send to a lender, partner, or advisor</div>
            <p style={{ fontSize: 11, color: B.muted, margin: "0 0 10px 0", lineHeight: 1.5 }}>
              They will receive your score summary and a verification link.
            </p>
            <div style={{ display: "flex", gap: 8 }}>
              <input
                type="email"
                placeholder="Recipient's email address"
                value={advisorEmail}
                onChange={(e) => setAdvisorEmail(e.target.value)}
                style={{ flex: 1, padding: "10px 14px", fontSize: 13, borderRadius: 10, border: `1px solid ${B.stone}`, outline: "none", color: B.navy, backgroundColor: "#FFFFFF" }}
              />
              <button
                disabled={advisorSending || advisorSent || !advisorEmail.includes("@")}
                onClick={async () => {
                  setAdvisorSending(true);
                  try {
                    const res = await fetch("/api/v1/send-report", {
                      method: "POST",
                      headers: { "Content-Type": "application/json" },
                      body: JSON.stringify({
                        recipientEmail: advisorEmail.trim(),
                        assessmentTitle: record.assessment_title,
                        finalScore: record.final_score,
                        stabilityBand: record.stability_band,
                        recordId: record.record_id,
                        modelVersion: record.model_version || "RP-2.0",
                        issuedTimestamp: record.issued_timestamp_utc || record.assessment_date_utc,
                        industrySector: record.industry_sector,
                        classification: record.classification,
                        primaryConstraintLabel: record.primary_constraint_label,
                        bandInterpretationText: record.band_interpretation_text,
                        peerPercentileLabel: record.peer_stability_percentile_label,
                      }),
                    });
                    if (res.ok) { setAdvisorSent(true); }
                  } catch { /* silent */ }
                  finally { setAdvisorSending(false); }
                }}
                style={{ padding: "10px 20px", fontSize: 13, fontWeight: 600, color: "#ffffff", borderRadius: 10, border: "none", cursor: advisorSent ? "default" : "pointer", backgroundColor: B.purple, opacity: advisorSending || (!advisorEmail.includes("@")) ? 0.6 : 1, transition: "all 180ms ease", whiteSpace: "nowrap" }}>
                {advisorSent ? "Sent" : advisorSending ? "Sending..." : "Send"}
              </button>
            </div>
          </div>
        </div>

        {downloadError && (
          <div style={{ padding: "10px 16px", borderRadius: 10, backgroundColor: "rgba(220,38,38,0.06)", border: "1px solid rgba(220,38,38,0.12)" }}>
            <p style={{ fontSize: 13, color: "#DC2626", margin: 0 }}>PDF download failed: {downloadError}. Try refreshing the page.</p>
          </div>
        )}

        {/* Email delivery status */}
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          {emailStatus === "sending" && (
            <>
              <span style={{ width: 8, height: 8, borderRadius: "50%", backgroundColor: B.taupe, animation: "pulse 1.2s infinite" }} />
              <span style={{ fontSize: 13, color: B.muted }}>Sending report to your email...</span>
            </>
          )}
          {emailStatus === "sent" && (
            <>
              <span style={{ width: 8, height: 8, borderRadius: "50%", backgroundColor: B.purple }} />
              <span style={{ fontSize: 13, color: B.purple, fontWeight: 500 }}>Report sent to your email</span>
            </>
          )}
          {emailStatus === "error" && (
            <>
              <span style={{ width: 8, height: 8, borderRadius: "50%", backgroundColor: B.muted }} />
              <span style={{ fontSize: 13, color: B.muted }}>Email delivery unavailable — download PDF above</span>
            </>
          )}
        </div>

        <style>{`@keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.3; } }`}</style>
      </div>

      {/* ── Print stylesheet + dark mode ── */}
      <style>{`
        @page {
          size: letter;
          margin: 0.5in;
        }
        @media print {
          .no-print, .download-section { display: none !important; }
          .report-page {
            break-inside: avoid;
            page-break-inside: avoid;
            page-break-after: always;
            box-shadow: none !important;
            border: none !important;
            border-radius: 0 !important;
            margin: 0 !important;
            padding: 0.5in !important;
            width: 100% !important;
            max-width: 100% !important;
            min-height: auto !important;
            color-adjust: exact;
            -webkit-print-color-adjust: exact;
          }
          .report-page:last-child {
            page-break-after: auto;
          }
          body { background: white !important; }
        }
        @media (prefers-color-scheme: dark) {
          .report-page {
            background-color: #ffffff !important;
          }
        }
      `}</style>
    </div>
    </ReportErrorBoundary>
  );
}
