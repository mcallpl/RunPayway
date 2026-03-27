"use client";

import { useEffect, useState, useRef, Component, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import logoBlue from "../../../../public/runpayway-logo-blue.png";
import { useAssessmentServer } from "@/lib/monitoring";
// Simulator moved to standalone /simulator page — accessed via QR code

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
          <h2 style={{ fontSize: 20, fontWeight: 600, color: B.navy, marginBottom: R.paraMb }}>
            Something went wrong loading your report
          </h2>
          <p style={{ ...T.body, color: B.muted, marginBottom: R.sectionGap, maxWidth: 400 }}>
            Your assessment was saved. Please try refreshing the page. If the problem persists, visit our contact page.
          </p>
          <p style={{ ...T.meta, color: B.taupe, marginBottom: R.sectionGap }}>{this.state.error}</p>
          <button
            onClick={() => window.location.reload()}
            style={{ padding: "10px 24px", ...T.body, fontWeight: 500, color: B.white, backgroundColor: B.navy, border: "none", borderRadius: 4, cursor: "pointer" }}
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
    surprising_insights?: { headline: string; explanation: string; data_point: string }[];
    tradeoff_narratives?: { action_label: string; upside: string; downside: string; net_recommendation: string }[];
    one_thing_that_matters?: string;
    reusable_framework?: string[];
    predictive_warnings?: { headline: string; explanation: string; timeframe: string }[];
    behavioral_insights?: { pattern: string; consequence: string; reframe: string }[];
    execution_roadmap?: { week: string; action: string; detail: string; success_metric: string }[];
    script_templates?: { id: string; title: string; context: string; script: string }[];
    normalized_inputs?: { income_persistence_pct: number; largest_source_pct: number; source_diversity_count: number; forward_secured_pct: number; income_variability_level: string; labor_dependence_pct: number };
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
// ── Spacing: strict 4px grid ──
const R = {
  pagePad: 40,
  headerMb: 16,
  sectionGap: 24,
  sectionMb: 20,
  cardMb: 16,
  labelMb: 8,
  paraMb: 12,
  itemGap: 12,
  cardGap: 12,
  rowGap: 16,
  dividerMy: 20,
  footerMt: 16,
  cardPad: "16px 20px" as string,
};

// ── Reusable card style ──
const cardStyle: React.CSSProperties = {
  backgroundColor: B.bone,
  border: "1px solid rgba(14,26,43,0.06)",
  borderRadius: 4,
  padding: R.cardPad,
};

const accentGradient = `linear-gradient(90deg, ${B.purple} 0%, ${B.teal} 100%)`;

// ── Typography: 7-step scale optimized for print clarity ──
const T = {
  score: { fontSize: 72, fontWeight: 600, lineHeight: 1 },                                          // The big number
  pageTitle: { fontSize: 28, fontWeight: 600, lineHeight: 1.2, color: B.navy },                     // Page titles
  sectionTitle: { fontSize: 18, fontWeight: 600, lineHeight: 1.3, color: B.navy },                  // Major section headers (H2)
  classification: { fontSize: 18, fontWeight: 500, lineHeight: 1.3 },                               // Band label
  overline: { fontSize: 11, fontWeight: 700, lineHeight: 1.3, letterSpacing: "0.12em", textTransform: "uppercase" as const },  // Card/metadata labels
  sectionLabel: { fontSize: 14, fontWeight: 600, lineHeight: 1.4 },                                 // Bold inline labels
  cardHeading: { fontSize: 15, fontWeight: 600, lineHeight: 1.35 },                                 // Card titles
  cardHero: { fontSize: 24, fontWeight: 600, lineHeight: 1.1 },                                     // Card hero numbers
  body: { fontSize: 14, fontWeight: 400, lineHeight: 1.65 },                                        // Paragraph text
  small: { fontSize: 13, fontWeight: 400, lineHeight: 1.55 },                                       // Secondary text
  meta: { fontSize: 12, fontWeight: 400, lineHeight: 1.5 },                                         // Fine print
  micro: { fontSize: 11, fontWeight: 700, lineHeight: 1.3 },                                        // Severity tags
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
      <Image src={logoBlue} alt="RunPayway&#8482;" width={120} height={14} style={{ height: "auto" }} />
      <div style={{ textAlign: "right" }}>
        <div style={{ ...T.meta, color: B.taupe }}>Income Stability Score™</div>
        <div style={{ ...T.meta, color: B.taupe }}>Model RP-2.0</div>
      </div>
    </div>
  );
}

function Overline({ children, large }: { children: React.ReactNode; large?: boolean }) {
  return large
    ? <div style={{ ...T.sectionTitle, color: B.navy, marginBottom: R.labelMb }}>{children}</div>
    : <div style={{ ...T.overline, color: B.teal, marginBottom: 6 }}>{children}</div>;
}

function SectionDivider() {
  return <div style={{ height: 1, backgroundColor: "rgba(14,26,43,0.08)", marginTop: R.dividerMy, marginBottom: R.dividerMy }} />;
}

function PageFooter({ section, page }: { section: string; page: number }) {
  return (
    <div className="report-page-footer" style={{ marginTop: "auto", paddingTop: 12, borderTop: "1px solid rgba(14,26,43,0.12)" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <span style={{ ...T.meta, color: B.taupe }}>{section} · Page {page} of 5</span>
        <span style={{ ...T.meta, color: B.taupe }}>Model RP-2.0 · runpayway.com/methodology</span>
      </div>
    </div>
  );
}

function ReportPage({ children, noPad }: { record?: AssessmentRecord; children: React.ReactNode; noPad?: boolean }) {
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
      <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 2, background: accentGradient }} />
      {children}
    </div>
  );
}

// ── QR Code component ──
function QRCodeImage({ recordId, authCode, score, band, date, model }: { recordId: string; authCode?: string; score?: number; band?: string; date?: string; model?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [simUrl, setSimUrl] = useState("/simulator");

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const params = new URLSearchParams();
    try {
      const stored = sessionStorage.getItem("rp_record");
      if (stored) {
        const rec = JSON.parse(stored);
        const v2 = rec._v2;
        if (v2?.normalized_inputs) {
          const ni = v2.normalized_inputs;
          params.set("p", String(ni.income_persistence_pct));
          params.set("c", String(ni.largest_source_pct));
          params.set("src", String(ni.source_diversity_count));
          params.set("f", String(ni.forward_secured_pct));
          params.set("v", ni.income_variability_level);
          params.set("l", String(ni.labor_dependence_pct));
          params.set("q", String(v2.quality?.quality_score ?? 5));
        }
        if (score !== undefined) params.set("s", String(score));
        if (band) params.set("b", band);
        if (rec.assessment_title) params.set("n", encodeURIComponent(rec.assessment_title));
        if (rec.industry_sector) params.set("ind", encodeURIComponent(rec.industry_sector));
        if (rec.primary_income_model) params.set("mod", encodeURIComponent(rec.primary_income_model));
      }
    } catch { /* fallback */ }
    params.set("id", recordId);
    const url = `https://peoplestar.com/RunPayway/simulator?${params.toString()}`;
    // Use full URL for click link — basePath not auto-prepended on raw <a> tags
    setSimUrl(`https://peoplestar.com/RunPayway/simulator?${params.toString()}`);
    import("qrcode").then((QRCode) => {
      QRCode.toCanvas(canvas, url, {
        width: 140,
        margin: 2,
        color: { dark: "#0E1A2B", light: "#FFFFFF" },
        errorCorrectionLevel: "M",
      });
    }).catch(() => {});
  }, [recordId, authCode, score, band]);

  return (
    <a href={simUrl} style={{ display: "block", cursor: "pointer" }} title="Open RunPayway&#8482; Stability Simulator">
      <canvas ref={canvasRef} width={140} height={140} style={{ width: 80, height: 80 }} />
    </a>
  );
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
      if (pixels[idx] < 235 || pixels[idx + 1] < 230 || pixels[idx + 2] < 225) {
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
    alert("Download libraries failed to load. Please check your connection and try again.");
    return;
  }

  // Capture entire report as one continuous flow — no artificial page breaks
  const reportContainer = document.getElementById("report-container");
  if (!reportContainer) return;

  const pdf = new jsPDF({ orientation: "portrait", unit: "in", format: "letter" });
  pdf.setProperties({
    title: `Income Stability Assessment — ${record.assessment_title || "Report"}`,
    author: "RunPayway\u2122",
    subject: "Income Stability Score\u2122 Report",
    keywords: "income stability, assessment, RunPayway\u2122, income analysis",
    creator: `RunPayway\u2122 Model ${record.model_version || "RP-2.0"}`,
  });

  const { captureW, scale: S, pageW: PW, pageH: PH, margin: M, footer: FT, contentW: CW, canvasW, pxPerInch, sliceH } = PDF;

  // Hide all HTML page footers (PDF adds its own) and interactive-only sections
  const htmlFooters = reportContainer.querySelectorAll(".report-page-footer") as NodeListOf<HTMLElement>;
  htmlFooters.forEach((f) => { f.style.display = "none"; });
  const noPrintEls = reportContainer.querySelectorAll(".no-print") as NodeListOf<HTMLElement>;
  noPrintEls.forEach((el) => { el.style.display = "none"; });

  // Temporarily style for capture — make visible and properly sized
  const savedContainerStyle = {
    maxWidth: reportContainer.style.maxWidth,
    gap: (reportContainer as HTMLElement).style.gap,
    opacity: reportContainer.style.opacity,
    zIndex: reportContainer.style.zIndex,
    position: reportContainer.style.position,
  };
  reportContainer.style.opacity = "1";
  reportContainer.style.zIndex = "9999";
  reportContainer.style.position = "absolute";
  reportContainer.style.maxWidth = `${captureW}px`;
  (reportContainer as HTMLElement).style.gap = "0px";

  const pages = reportContainer.querySelectorAll(".report-page") as NodeListOf<HTMLElement>;
  const savedPageStyles: Array<Record<string, string>> = [];
  pages.forEach((el, i) => {
    savedPageStyles[i] = { width: el.style.width, maxWidth: el.style.maxWidth, border: el.style.border, borderRadius: el.style.borderRadius, boxSizing: el.style.boxSizing, overflow: el.style.overflow };
    el.style.width = `${captureW}px`;
    el.style.maxWidth = `${captureW}px`;
    el.style.boxSizing = "border-box";
    el.style.border = "none";
    el.style.borderRadius = "0";
    el.style.overflow = "visible";
  });

  await new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r)));

  const canvas = await html2canvas(reportContainer as HTMLElement, {
    scale: S,
    useCORS: true,
    backgroundColor: "#ffffff",
    logging: false,
    width: captureW,
    height: reportContainer.scrollHeight,
    windowWidth: captureW,
  });

  // Restore styles
  pages.forEach((el, i) => { Object.assign(el.style, savedPageStyles[i]); });
  htmlFooters.forEach((f) => { f.style.display = ""; });
  noPrintEls.forEach((el) => { el.style.display = ""; });
  reportContainer.style.maxWidth = savedContainerStyle.maxWidth;
  (reportContainer as HTMLElement).style.gap = savedContainerStyle.gap;
  reportContainer.style.opacity = savedContainerStyle.opacity;
  reportContainer.style.zIndex = savedContainerStyle.zIndex;
  reportContainer.style.position = savedContainerStyle.position;

  const totalCanvasH = canvas.height;
  let currentY = 0;
  let pdfPageCount = 0;

  while (currentY < totalCanvasH) {
    if (pdfPageCount > 0) pdf.addPage();
    pdfPageCount++;

    let cutY: number;
    const idealCutY = currentY + sliceH;

    if (idealCutY >= totalCanvasH) {
      cutY = totalCanvasH;
    } else {
      cutY = findSafeCutRow(canvas, idealCutY, 400);
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
  const [animatedScore, setAnimatedScore] = useState(0);
  const [expandedScript, setExpandedScript] = useState<string | null>(null);
  const [scriptCopied, setScriptCopied] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [mobile, setMobile] = useState(false);
  const monitoringTracked = useRef(false);
  const totalPages = 6; // cover + 5 pages
  const emailSent = useRef(false);
  const scoreAnimated = useRef(false);
  const pageContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const check = () => setMobile(window.innerWidth <= 640);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  // Scroll to top on page change
  useEffect(() => {
    window.scrollTo(0, 0);
    if (pageContainerRef.current) {
      pageContainerRef.current.scrollTop = 0;
    }
  }, [currentPage]);

  // Keyboard navigation for pages
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight" || e.key === "ArrowDown") { e.preventDefault(); setCurrentPage(p => Math.min(totalPages - 1, p + 1)); }
      if (e.key === "ArrowLeft" || e.key === "ArrowUp") { e.preventDefault(); setCurrentPage(p => Math.max(0, p - 1)); }
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, []);

  // Scroll to top of page container on page change
  useEffect(() => {
    pageContainerRef.current?.scrollTo(0, 0);
  }, [currentPage]);

  useEffect(() => {
    window.scrollTo(0, 0);
    let stored = sessionStorage.getItem("rp_record");
    if (!stored) {
      stored = localStorage.getItem("rp_record");
      if (stored) sessionStorage.setItem("rp_record", stored);
    }
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
    const duration = 600;
    const start = performance.now();
    const step = (now: number) => {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      setAnimatedScore(Math.round(progress * target));
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [record]);

  if (!record) return null;

  // ── Derived values ──
  const score = record.final_score;
  const tier: "limited" | "developing" | "established" | "high" =
    score >= 75 ? "high" : score >= 50 ? "established" : score >= 30 ? "developing" : "limited";
  const isHighScorer = score >= 50; // Established or High — needs preservation framing, not repair framing

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
      ? "Based on your assessment profile, as a contractor, losing your primary client would significantly impact your income. Maintaining at least 2–3 active contracts reduces this exposure."
      : opStructure.includes("employee")
      ? "Based on your assessment profile, as a salaried employee, your income depends entirely on one employer. Building a secondary income stream strengthens your structure."
      : profileClass.includes("business")
      ? "Based on your assessment profile, your business revenue is too concentrated. As a general guideline, reducing reliance on any single client strengthens the overall structure."
      : "Based on your assessment profile, your income is too concentrated in one source. Diversifying helps protect against sudden loss.",
    forward_visibility: incomeModel.includes("commission") || incomeModel.includes("project")
      ? `Based on your assessment profile, with ${incomeModelDesc} income, future earnings are unpredictable. Lock in advance commitments, retainers, or pipeline guarantees.`
      : opStructure.includes("contractor")
      ? "Based on your assessment profile, as a contractor, secure multi-month engagements or retainer agreements instead of rolling month-to-month."
      : profileClass.includes("business")
      ? "Based on your assessment profile, your business needs more contracted or recurring revenue locked in before each month begins."
      : "Based on your assessment profile, too little of your income is committed before the month starts. Lock in recurring or pre-committed income.",
    labor_dependence: opStructure.includes("employee")
      ? "Based on your assessment profile, as an employee, 100% of your income stops if you stop working. Building passive or semi-passive income alongside your salary can help."
      : incomeModel.includes("consulting") || incomeModel.includes("client")
      ? "Based on your assessment profile, your consulting income requires constant client delivery. Productizing your expertise into courses, templates, or licensing can reduce this dependency."
      : profileClass.includes("business")
      ? "Based on your assessment profile, your business is still owner-dependent. Building systems, recurring revenue, or delegated delivery so income continues without you strengthens the structure."
      : "Based on your assessment profile, too much income requires your daily effort. Shifting toward streams that produce without constant work improves stability.",
    low_continuity: incomeModel.includes("commission")
      ? "Based on your assessment profile, commission income stops immediately when deals stop closing. Building a base of recurring or residual commissions adds runway."
      : opStructure.includes("contractor")
      ? "Based on your assessment profile, contract income has a short shelf life. Negotiating longer-term contracts or building retainer relationships extends continuity."
      : "Based on your assessment profile, your income would stop too quickly if active work paused. Building streams that continue producing independently adds protection.",
    few_sources: profileClass.includes("business")
      ? "Based on your assessment profile, your business relies on too few revenue channels. Adding a new client segment, product line, or service tier broadens the base."
      : opStructure.includes("contractor")
      ? "Based on your assessment profile, you need more active clients. Each new contract that contributes at least 10% of income strengthens the structure."
      : "Based on your assessment profile, your income comes from too few sources. Adding even one more meaningful source significantly reduces risk.",
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

  // ── Strategic insight data (RP-2.1) ──
  const v2SurprisingInsights = v2?.surprising_insights ?? null;
  const v2TradeoffNarratives = v2?.tradeoff_narratives ?? null;
  const v2OneThingThatMatters = v2?.one_thing_that_matters ?? null;
  const v2PredictiveWarnings = v2?.predictive_warnings ?? null;
  const v2ScriptTemplates = v2?.script_templates ?? null;
  const v2NormalizedInputs = v2?.normalized_inputs ?? null;

  // ── Outcome layer ──
  const ol = v2?.outcome_layer;
  const olActions = ol?.ranked_action_map ?? null;
  const olAvoid = ol?.avoid_actions ?? null;
  const olExplanations = ol?.explanation_translation_layer ?? null;
  const olTriggers = ol?.reassessment_trigger_set ?? null;
  const olFamilyLabel = ol?.income_model_family?.family_label ?? null;
  const olIndustryLabel = ol?.industry_refinement_profile?.industry_label ?? null;

  // ── Deep engine data for rich personalization ──
  const v2Explainability = v2?.explainability as { why_this_score?: string; why_not_higher?: string; strongest_supports?: string[]; strongest_suppressors?: string[]; best_lift_explanation?: string; fragility_explanation?: string; interaction_summary?: string } | undefined;
  const v2BehavioralInsights = v2?.behavioral_insights as Array<{ pattern: string; consequence: string; reframe: string }> | undefined;
  const v2ExecutionRoadmap = v2?.execution_roadmap as Array<{ week: string; action: string; detail: string; success_metric: string }> | undefined;
  const v2Indicators = v2?.indicators as Array<{ key: string; label: string; raw_value: number; normalized_value: number; level: string }> | undefined;
  const olSelectedScenarios = ol?.selected_scenarios as Array<{ scenario_id: string; label: string; description: string; severity: string; why_it_matters: string }> | undefined;

  // ── Outcome layer explanations override profileConstraintAdvice when available ──
  if (olExplanations) {
    const constraintKeyMap: Record<string, string> = {
      source_concentration: "high_concentration",
      forward_visibility: "low_forward_secured",
      labor_dependence: "high_labor_dependence",
      low_continuity: "short_continuity",
      few_sources: "low_source_diversity",
    };
    for (const [constraint, olKey] of Object.entries(constraintKeyMap)) {
      if (olExplanations[olKey]) {
        profileConstraintAdvice[constraint] = olExplanations[olKey];
      }
    }
    if (olExplanations.high_variability && !profileConstraintAdvice.high_variability) {
      profileConstraintAdvice.high_variability = olExplanations.high_variability;
    }
  }

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
  const nextBandName = score < 30 ? "Developing" : score < 50 ? "Established" : score < 75 ? "High" : null;
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

  const peerPercentileValue: number | null = record.peer_stability_percentile ?? (v2Benchmarks?.peer_percentile ?? null);
  const peerInterpretation: string | null = peerPercentileValue === null ? null :
    peerPercentileValue <= 10 ? "far below benchmark" :
    peerPercentileValue <= 30 ? "below benchmark" :
    peerPercentileValue <= 60 ? "around benchmark" :
    peerPercentileValue <= 85 ? "above benchmark" : "well above benchmark";


  const p2Intro: Record<string, string> = {
    A1: `Here is how your ${incomeModelDesc} income in ${industrySector} actually works — where it comes from, how it flows, and where it breaks.`,
    A2: `This is the structural breakdown of your income. As a ${structureDesc} with ${revenueDesc}, here is what the data shows.`,
    A3: `You have early structure. Here is the composition of your ${incomeModelDesc} income in ${industrySector} — and where the gaps are.`,
    B1: `Your ${incomeModelDesc} income in ${industrySector} is developing. Here is the breakdown — what is working and what is exposed.`,
    B2: `Your income structure is taking shape. Here is the composition — ${record.active_income_level}% active, ${record.persistent_income_level}% persistent.`,
    C1: `Your ${incomeModelDesc} structure in ${industrySector} has real protection. Here is the composition and where the remaining exposure sits.`,
    C2: `Established ${incomeModelDesc} structure. Here is how your income is composed — and the specific areas that still matter.`,
    D1: `Strong ${incomeModelDesc} structure with ${record.persistent_income_level}% persistent income. Here is the full composition.`,
    D2: `Exceptionally well-built. Here is the structural detail behind the ${score}/100 score.`,
  };

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
    brittle: "One disruption could seriously damage your income", thin: "You can handle a small setback, but not two in a row", uneven: "Some parts of your income are protected, others are not", supported: "Your income has multiple layers of protection", resilient: "Your income can absorb a major hit and keep going",
  };
  const confidenceColor: Record<string, string> = {
    high: B.teal, moderate: B.bandEstablished, guarded: B.bandDeveloping, low: B.bandLimited,
  };

  // ── Plain English dimension name mapping ──
  const dimensionNameMap: Record<string, string> = {
    "Income Persistence": "How much income repeats without new sales",
    "Source Diversification": "How spread out your income sources are",
    "Source Independence": "How much depends on your biggest source",
    "Forward Revenue Visibility": "How much income is already booked ahead",
    "Labor Independence": "How much continues if you stop working",
    "Earnings Stability": "How consistent your income is month to month",
  };
  const plainDimension = (name: string): string => dimensionNameMap[name] ?? name;

  // ── Score context helper for dimension scores ──
  const scoreContext = (val: number): string =>
    val < 30 ? "(below average — this is a weak point)" :
    val < 50 ? "(developing — room to improve)" :
    val < 75 ? "(solid — this is working for you)" :
    "(strong — this is a strength)";

  // ── Peer comparison direction helper ──
  const peerDirectionLabel = (direction: string): string =>
    direction === "above" ? "Above your peers — this is a strength" :
    "Below your peers — this is an area to improve";

  // ── Continuity display ──
  const continuityDisplay = record.income_continuity_months < 0.5
    ? "Less than 1 week"
    : record.income_continuity_months < 1
      ? "Less than 1 month"
      : `${record.income_continuity_months} month${record.income_continuity_months !== 1 ? "s" : ""}`;

  // ── Page navigation ──

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


  // ── Formal date for cover page ──
  const formalDate = (() => {
    const d = new Date(record.issued_timestamp_utc || record.assessment_date_utc);
    return d.toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
  })();

  // ── Page summary sentences ──
  const coverBandDesc: Record<string, string> = {
    limited: "Your income is highly vulnerable to disruption right now.",
    developing: "Some structure is in place, but important weaknesses still remain.",
    established: "Your income has meaningful structural protection in place.",
    high: "Your income is well-protected against most disruptions.",
  };

  const p1Summary: Record<string, string> = {
    limited: "Your income is structurally vulnerable right now — but this report shows you exactly how to fix it.",
    developing: "Your income has some structure, but important weaknesses still remain.",
    established: "Your income is well-protected. This report shows the remaining gaps and how to close them.",
    high: "Your income is strong. This report confirms what is working and where to focus next.",
  };

  const p3Summary: Record<string, string> = {
    limited: "Most of your income depends on your active effort every day. Here is exactly how it breaks down.",
    developing: "Most of your income depends on your active effort every day. Here is exactly how it breaks down.",
    established: "Your income has multiple layers of protection. Here is the detailed composition.",
    high: "Your income has multiple layers of protection. Here is the detailed composition.",
  };

  // ── Page names for navigation ──
  const pageNames = ["Cover", "Your Score", "Income Structure", "Risks", "Action Plan", "Methodology"];


  // ── Paginated page contents (shared between PDF container and on-screen view) ──
  const pageContents: ReactNode[] = [
    // Page 0: Cover
    <>
        <div style={{ display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", minHeight: mobile ? 420 : 500, textAlign: "center", padding: mobile ? "0 8px" : 0 }}>
          <Image src={logoBlue} alt="RunPayway&#8482;" width={mobile ? 140 : 180} height={21} style={{ height: "auto", marginBottom: mobile ? 20 : 32 }} />
          <div style={{ width: mobile ? "80%" : "60%", height: 1, backgroundColor: B.stone, marginBottom: mobile ? 20 : 32 }} />

          <div style={{ ...T.pageTitle, fontSize: mobile ? 22 : 28, marginBottom: 4 }}>Income Stability Report</div>
          <div style={{ ...T.small, color: B.muted, marginBottom: mobile ? 16 : 24 }}>Structural assessment of how your income holds up under disruption, concentration, and interruption.</div>

          <div style={{ fontSize: mobile ? 18 : 24, fontWeight: 500, color: B.navy, marginBottom: 4 }}>{record.assessment_title}</div>
          <div style={{ ...T.meta, color: B.muted, marginBottom: mobile ? 20 : 32 }}>{formalDate}</div>

          {/* Score block */}
          <div style={{ marginBottom: 12 }}>
            <span style={{ ...T.score, fontSize: mobile ? 56 : 72, color: B.navy }}>{record.final_score}</span>
            <span style={{ fontSize: mobile ? 18 : 24, fontWeight: 400, color: B.taupe }}>/100</span>
          </div>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
            <div style={{ width: 10, height: 10, borderRadius: 2, backgroundColor: bandColor }} />
            <div style={{ ...T.classification, fontSize: mobile ? 16 : 18, color: bandColor }}>{record.stability_band}</div>
          </div>
          <div style={{ ...T.small, color: B.muted, marginBottom: mobile ? 16 : 24, maxWidth: 340, lineHeight: 1.5 }}>{coverBandDesc[tier]}</div>

          {/* Methodology footer */}
          <div style={{ ...T.meta, color: B.taupe, marginBottom: 3 }}>Built from fixed structural questions under Model RP-2.0.</div>
          <div style={{ ...T.meta, color: B.taupe, marginBottom: mobile ? 20 : 28 }}>Report tailored using your operating structure, income model, and priorities.</div>

          {/* Simulator QR */}
          <div style={{ ...T.overline, color: B.navy, marginBottom: 6, letterSpacing: 1, fontSize: mobile ? 10 : 11 }}>SCORE SIMULATOR&#8482;</div>
          <div style={{ ...T.meta, color: B.muted, marginBottom: 8, fontSize: mobile ? 11 : 12 }}>Scan to model changes using your actual assessment.</div>
          <QRCodeImage recordId={record.record_id} authCode={record.authorization_code} score={record.final_score} band={record.stability_band} date={issuedDate} model={record.model_version || "RP-2.0"} />
          <div style={{ ...T.meta, color: B.muted, marginTop: 6, fontSize: mobile ? 11 : 12 }}>Linked to your report</div>
          <div style={{ ...T.meta, color: B.taupe, marginTop: 12 }}>Model RP-2.0 · 5 Pages</div>
        </div>
    </>,

    // Page 1: Your Score
    <>
        <ReportHeader />

        {/* ── 1. STATE THE SCORE ── */}
        <div style={{ textAlign: "center", marginBottom: 24 }}>
          <div style={{ ...T.overline, color: B.teal, marginBottom: 16, letterSpacing: "0.14em" }}>INCOME STABILITY ASSESSMENT</div>
          <h1 style={{ ...T.pageTitle, marginBottom: 4, fontSize: 28 }}>{record.assessment_title || "Assessment"}</h1>
          <div style={{ ...T.meta, color: B.taupe, marginBottom: 24 }}>
            {issuedDate} &middot; Model RP-2.0
          </div>

          <div style={{ marginBottom: 8 }}>
            <span style={{ ...T.score, color: B.navy }}>{animatedScore}</span>
            <span style={{ fontSize: 24, fontWeight: 400, color: B.taupe }}>/100</span>
          </div>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
            <div style={{ width: 10, height: 10, borderRadius: 2, backgroundColor: bandColor }} />
            <div style={{ ...T.classification, color: bandColor }}>{record.stability_band}</div>
          </div>
          {nextBandName && <div style={{ ...T.meta, color: B.muted, marginTop: 6 }}>{distanceToNext} points from {nextBandName} Stability</div>}
        </div>

        {/* ── 2. KILLER DIAGNOSTIC SENTENCE ── */}
        <div style={{ backgroundColor: B.bone, border: "1px solid rgba(14,26,43,0.06)", borderRadius: 6, padding: mobile ? "16px 16px" : "20px 24px", marginBottom: 20, textAlign: "center" }}>
          <p style={{ ...T.body, color: B.navy, margin: 0, lineHeight: 1.7, fontSize: mobile ? 15 : 16, fontWeight: 500 }}>
            {(() => {
              if (tier === "high") return "Your income is not invulnerable. But it is built to absorb a hit without forcing a crisis. That is rare.";
              if (tier === "established") return "Your income is not fragile. But it still depends on a narrow set of conditions staying exactly as they are.";
              if (dominantConstraint === "labor_dependence") return "Your income is not weak because you earn too little. It is weak because too much of it stops when your daily effort stops.";
              if (dominantConstraint === "source_concentration") return "Your income is not weak because it is small. It is weak because too much of it depends on one source continuing to pay.";
              if (dominantConstraint === "forward_visibility") return "Your income is not unstable because you lack skill. It is unstable because you cannot see far enough ahead to plan around a disruption.";
              if (dominantConstraint === "low_continuity") return "Your income is not insecure because of what you earn. It is insecure because almost none of it would continue if you had to stop working tomorrow.";
              if (dominantConstraint === "few_sources") return "Your income is not at risk because of how much you earn. It is at risk because losing any one source would change everything.";
              return "Your income has structural weaknesses that are not visible in your day-to-day earnings. This report makes them visible.";
            })()}
          </p>
        </div>

        {/* ── 3. IN PLAIN ENGLISH — WHY THE SCORE IS WHERE IT IS ── */}
        <div style={{ ...cardStyle, marginBottom: 16 }}>
          <div style={{ ...T.overline, color: B.taupe, marginBottom: 8 }}>IN PLAIN ENGLISH</div>
          <p style={{ ...T.body, color: B.navy, margin: 0, lineHeight: 1.65 }}>
            {v2Explainability?.why_this_score || (() => {
              const ctx = olFamilyLabel ? `As a ${olFamilyLabel.toLowerCase()}${olIndustryLabel ? ` in ${olIndustryLabel}` : ""}, ` : "";
              return isHighScorer ? ({
                C1: `${ctx}your income survives most common disruptions — a slow quarter, a lost mid-tier client. But a ${record.risk_scenario_drop}-point stress test drop means a major hit would still damage your structure.`,
                C2: `${ctx}your income holds up under pressure. You have ${record.income_continuity_months} months of runway and no single-source dependency. The remaining gaps are specific, not structural.`,
                D1: `${ctx}your income can absorb a lost client, an illness, or a market downturn without crisis. ${record.income_continuity_months}+ months of continuity. Focus on maintaining what you have built.`,
                D2: `${ctx}${record.income_continuity_months}+ months of continuity, diversified sources, strong forward visibility. Very few scenarios threaten your structure.`,
              })[subTier] || `${ctx}your income has structural protection. The priority is strengthening specific weak points, not rebuilding.` : ({
                A1: `${ctx}if your main income source changed tomorrow, you have ${continuityDisplay} of runway. This leaves very little margin for unexpected disruptions.`,
                A2: `${ctx}your income is active but structurally exposed. A lost client, a slow month, or 2 weeks off work could create significant financial pressure. You have ${continuityDisplay} of runway.`,
                A3: `${ctx}you have a starting foundation, but a ${record.risk_scenario_drop}-point stress test drop means one unexpected change sets you back hard.`,
                B1: `${ctx}your income is developing. You could absorb a minor hit, but losing your biggest source would drop your score by ${record.risk_scenario_drop} points. You are ${nextBandThreshold - score} points away from Established Stability. That gap is realistic to close.`,
                B2: `${ctx}you are ${nextBandThreshold - score} points from the next band. Your income handles small bumps but a sustained disruption — 60+ days of reduced income — would create real pressure.`,
              })[subTier] || `${ctx}your income is developing. ${nextBandThreshold - score} points from the next band.`;
            })()}
          </p>
          {v2Explainability?.why_not_higher && (
            <p style={{ ...T.small, color: B.muted, margin: "8px 0 0", lineHeight: 1.55 }}>
              <span style={{ fontWeight: 600 }}>Why not higher:</span> {v2Explainability.why_not_higher}
            </p>
          )}
        </div>

        {/* ── 4. BIGGEST THING HOLDING IT DOWN ── */}
        <div style={{ backgroundColor: B.bone, border: "1px solid rgba(14,26,43,0.06)", borderLeft: `3px solid ${B.purple}`, borderRadius: 4, padding: "16px 20px", marginBottom: 16 }}>
          <div style={{ ...T.overline, color: B.purple, marginBottom: 8 }}>THE SINGLE BIGGEST THING HOLDING YOUR SCORE DOWN</div>
          <p style={{ ...T.body, color: B.navy, margin: "0 0 12px", lineHeight: 1.6 }}>
            {dominantConstraintPlain[dominantConstraint] ? dominantConstraintPlain[dominantConstraint].charAt(0).toUpperCase() + dominantConstraintPlain[dominantConstraint].slice(1) + "." : "A structural weakness is limiting your score."}
          </p>
          <div style={{ display: "flex", gap: 24, flexWrap: "wrap" as const }}>
            <div style={{ flex: 1, minWidth: 180 }}>
              <div style={{ ...T.meta, color: B.taupe, fontWeight: 600, marginBottom: 4 }}>What to change first</div>
              <div style={{ ...T.body, color: B.navy, margin: 0 }}>
                {v2Sensitivity?.tests?.[0]?.delta_description || (v2Lift?.highest_single_lift?.label ? `${v2Lift.highest_single_lift.label}.` : `Reduce ${dominantConstraintPlain[dominantConstraint]}.`)}
              </div>
            </div>
            <div style={{ flex: 1, minWidth: 140 }}>
              <div style={{ ...T.meta, color: B.taupe, fontWeight: 600, marginBottom: 4 }}>What that would do</div>
              <div style={{ ...T.body, color: B.navy, margin: 0 }}>
                {v2Sensitivity?.tests?.[0] ? `${v2Sensitivity.tests[0].original_score} → ${v2Sensitivity.tests[0].projected_score} (+${v2Sensitivity.tests[0].lift} points)` : v2Lift?.highest_single_lift ? `${score} → ${v2Lift.highest_single_lift.projected_score} (+${v2Lift.highest_single_lift.lift} points)` : `Estimated improvement available.`}
              </div>
            </div>
          </div>
        </div>

        {/* ── 5. HOW FAR FROM STRONGER STABILITY ── */}
        {nextBandName && (
          <div style={{ ...cardStyle, marginBottom: 16 }}>
            <div style={{ ...T.overline, color: B.teal, marginBottom: 8 }}>HOW FAR FROM STRONGER STABILITY</div>
            <div style={{ display: "flex", alignItems: "baseline", gap: 6, marginBottom: 8 }}>
              <span style={{ fontSize: 28, fontWeight: 700, color: B.navy }}>{distanceToNext}</span>
              <span style={{ ...T.body, color: B.navy }}>points to {nextBandName} Stability</span>
            </div>
            <div style={{ display: "flex", gap: 2, height: 6, marginBottom: 8 }}>
              <div style={{ width: `${score}%`, backgroundColor: bandColor, borderRadius: "3px 0 0 3px" }} />
              <div style={{ width: `${distanceToNext}%`, backgroundColor: B.stone, borderRadius: "0 3px 3px 0" }} />
            </div>
            <p style={{ ...T.small, color: B.muted, margin: 0, lineHeight: 1.55 }}>
              {bandDistance === "CLOSE" ? "You are close. One structural change could move you into the next band."
                : bandDistance === "MODERATE" ? "This gap is closeable. The constraint above is the fastest path."
                : "This will take more than one change — but the constraint above is where to start."}
            </p>
          </div>
        )}
        {tier === "high" && (
          <div style={{ ...cardStyle, marginBottom: 16 }}>
            <div style={{ ...T.overline, color: B.teal, marginBottom: 8 }}>STABILITY POSITION</div>
            <p style={{ ...T.body, color: B.navy, margin: 0, lineHeight: 1.6 }}>You are in the highest stability band. The remaining pages show what is working, what could still improve, and how to maintain this position.</p>
          </div>
        )}

        {/* ── PRESSUREMAP™ — YOUR STRUCTURE + CURRENT CONDITIONS ── */}
        {record.pressure_map && (
          <div style={{ ...cardStyle, marginTop: 4, borderLeft: `3px solid ${B.purple}`, background: "rgba(75,63,174,0.02)" }}>
            <div style={{ marginBottom: 12 }}>
              <Overline>PressureMap&#8482;</Overline>
              <p style={{ ...T.meta, color: B.muted, margin: "4px 0 0", lineHeight: 1.4 }}>
                Your structure as a {record.pressure_map.operating_structure?.toLowerCase()}{record.pressure_map.income_model ? ` earning through ${record.pressure_map.income_model.toLowerCase()}` : ""}{record.pressure_map.industry ? ` in ${record.pressure_map.industry}` : ""} — matched against current conditions.
              </p>
            </div>

            <div style={{ marginBottom: 14 }}>
              <div style={{ ...T.overline, color: "#DC4A4A", marginBottom: 4, fontSize: 10 }}>WHAT IS MOST LIKELY TO DISRUPT YOU RIGHT NOW</div>
              <p style={{ ...T.small, color: B.navy, lineHeight: 1.6, margin: 0 }}>{record.pressure_map.pressure}</p>
            </div>

            <div style={{ marginBottom: 14 }}>
              <div style={{ ...T.overline, color: B.teal, marginBottom: 4, fontSize: 10 }}>WHAT IS WORKING IN YOUR FAVOR</div>
              <p style={{ ...T.small, color: B.navy, lineHeight: 1.6, margin: 0 }}>{record.pressure_map.tailwind}</p>
            </div>

            <div>
              <div style={{ ...T.overline, color: B.purple, marginBottom: 4, fontSize: 10 }}>HIGHEST-LEVERAGE MOVE RIGHT NOW</div>
              <p style={{ ...T.small, color: B.navy, lineHeight: 1.6, margin: 0 }}>{record.pressure_map.leverage_move}</p>
            </div>

            <div style={{ marginTop: 12, paddingTop: 8, borderTop: `1px solid ${B.stone}` }}>
              <p style={{ ...T.meta, color: B.taupe, margin: 0, fontStyle: "italic", lineHeight: 1.4 }}>
                PressureMap&#8482; reflects current conditions applied to your structural profile. It does not affect your score.
              </p>
            </div>
          </div>
        )}

        <PageFooter section="Your Score" page={1} />
    </>,

    // Page 2: Income Structure
    <>
        <ReportHeader />
        <h1 style={{ ...T.pageTitle, marginBottom: 12 }}>How Your Income Is Built</h1>
        <p style={{ fontSize: 16, color: B.muted, maxWidth: 540, marginBottom: 20 }}>{p3Summary[tier]}</p>

        {/* Income Structure Bar */}
        <Overline large>Income Structure</Overline>
        <div style={{ display: "flex", gap: 2, height: 10, marginBottom: 12, marginTop: 4 }}>
          <div style={{ width: `${record.active_income_level}%`, backgroundColor: B.navy, borderRadius: 1 }} />
          <div style={{ width: `${record.semi_persistent_income_level}%`, backgroundColor: B.taupe, borderRadius: 1 }} />
          <div style={{ width: `${record.persistent_income_level}%`, backgroundColor: B.teal, borderRadius: 1 }} />
        </div>
        <div style={{ display: "flex", flexDirection: mobile ? "column" : "row", gap: mobile ? 6 : 24, marginBottom: 12 }}>
          {[
            { label: "You must actively work to earn this", pct: record.active_income_level, color: B.ink },
            { label: "This renews automatically (retainers, subscriptions, contracts)", pct: record.semi_persistent_income_level, color: B.taupe },
            { label: "This continues even if you stop working entirely", pct: record.persistent_income_level, color: B.teal },
          ].map((seg) => (
            <div key={seg.label} style={{ flex: mobile ? undefined : 1 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <div style={{ width: 8, height: 8, borderRadius: 1, backgroundColor: seg.color, flexShrink: 0 }} />
                <span style={{ ...T.small, fontWeight: 500, color: B.navy }}>{seg.label} — {seg.pct}%</span>
              </div>
            </div>
          ))}
        </div>
        <p style={{ ...T.meta, color: B.muted, marginBottom: 16, fontStyle: "italic" }}>
          {(olExplanations as Record<string, string> | null)?.high_labor_dependence && record.active_income_level >= 70
            ? (olExplanations as Record<string, string>).high_labor_dependence
            : record.active_income_level >= 80 ? `${record.active_income_level}% of your income disappears the moment you stop working.${olFamilyLabel ? ` For ${olFamilyLabel.toLowerCase()} structures, this level of labor dependence is the primary structural ceiling.` : ""}`
            : record.active_income_level >= 50 ? `${record.active_income_level}% of your income requires your daily effort.${olFamilyLabel ? ` For ${olFamilyLabel.toLowerCase()} structures, reducing this is typically the path to the next band.` : ""}`
            : `${100 - record.active_income_level}% of your income continues without your daily effort.${olFamilyLabel ? ` For ${olFamilyLabel.toLowerCase()} structures, this level of persistence is a meaningful structural advantage.` : ""}`}
        </p>

        {/* Stress Test + Continuity cards */}
        <div style={{ display: "flex", flexDirection: mobile ? "column" : "row", gap: 12, marginBottom: 20 }}>
          <div style={{ flex: mobile ? undefined : 3, ...cardStyle }}>
            <Overline>WHAT HAPPENS IF YOUR BIGGEST SOURCE OF INCOME GOES AWAY</Overline>
            <div style={{ display: "flex", alignItems: "baseline", gap: 8, marginBottom: 8 }}>
              <span style={{ ...T.cardHero, color: B.navy }}>{record.final_score}<span style={{ ...T.meta, color: B.taupe }}>/100</span></span>
              <span style={{ ...T.sectionLabel, color: B.taupe }}>→</span>
              <span style={{ ...T.cardHero, color: B.bandLimited }}>{Math.max(0, record.risk_scenario_score)}<span style={{ ...T.meta, color: B.taupe }}>/100</span></span>
            </div>
            <p style={{ ...T.small, color: B.muted, margin: 0 }}>
              {record.risk_scenario_drop}-point drop on the 0–100 scale.{record.risk_scenario_drop > score * 0.4 ? " Severe dependency." : ""}
            </p>
          </div>
          <div style={{ flex: mobile ? undefined : 2, ...cardStyle }}>
            <Overline>HOW LONG YOUR INCOME CONTINUES IF YOU STOP WORKING</Overline>
            <div style={{ ...T.cardHero, color: B.navy, marginBottom: 8 }}>{continuityDisplay}</div>
            <p style={{ ...T.small, color: B.muted, margin: 0 }}>
              {record.income_continuity_months < 1 ? `Critically short for a ${structureDesc}.` : record.income_continuity_months < 3 ? `Limited runway.` : record.income_continuity_months < 6 ? `Moderate runway.` : `Strong window.`}
            </p>
          </div>
        </div>

        <SectionDivider />

        {/* Structural Indicators */}
        {v2Indicators && v2Indicators.length > 0 && (
          <div style={{ marginBottom: 20 }}>
            <Overline large>Structural Indicators</Overline>
            <div style={{ display: "grid", gridTemplateColumns: mobile ? "1fr" : "1fr 1fr", gap: 8 }}>
              {v2Indicators.map((ind) => {
                const levelColor = ind.level === "critical" || ind.level === "weak" ? B.bandLimited : ind.level === "moderate" ? B.bandDeveloping : ind.level === "strong" ? B.bandEstablished : B.bandHigh;
                return (
                  <div key={ind.key} style={{ ...cardStyle, padding: "10px 14px" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 4 }}>
                      <span style={{ ...T.small, fontWeight: 600, color: B.navy }}>{ind.label}</span>
                      <span style={{ ...T.micro, color: levelColor, textTransform: "capitalize" }}>{ind.level}</span>
                    </div>
                    <div style={{ height: 4, backgroundColor: B.stone, borderRadius: 2 }}>
                      <div style={{ height: 4, backgroundColor: levelColor, borderRadius: 2, width: `${ind.normalized_value}%`, transition: "width 600ms ease" }} />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* What's working / What's dragging you down */}
        {v2Explainability && (v2Explainability.strongest_supports?.length || v2Explainability.strongest_suppressors?.length) && (
          <div style={{ display: "flex", flexDirection: mobile ? "column" : "row", gap: 12, marginBottom: 20 }}>
            {v2Explainability.strongest_supports && v2Explainability.strongest_supports.length > 0 && (
              <div style={{ flex: 1, ...cardStyle, borderLeft: `3px solid ${B.teal}` }}>
                <div style={{ ...T.overline, color: B.teal, marginBottom: 8 }}>WHAT&apos;S WORKING</div>
                {v2Explainability.strongest_supports.slice(0, 2).map((s, i) => (
                  <p key={i} style={{ ...T.small, color: B.navy, margin: i > 0 ? "6px 0 0" : 0, lineHeight: 1.5 }}>{s}</p>
                ))}
              </div>
            )}
            {v2Explainability.strongest_suppressors && v2Explainability.strongest_suppressors.length > 0 && (
              <div style={{ flex: 1, ...cardStyle, borderLeft: `3px solid ${B.bandLimited}` }}>
                <div style={{ ...T.overline, color: B.bandLimited, marginBottom: 8 }}>WHAT&apos;S HOLDING YOU BACK</div>
                {v2Explainability.strongest_suppressors.slice(0, 2).map((s, i) => (
                  <p key={i} style={{ ...T.small, color: B.navy, margin: i > 0 ? "6px 0 0" : 0, lineHeight: 1.5 }}>{s}</p>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Cross-factor interactions */}
        {v2Interactions && v2Interactions.effects && v2Interactions.effects.length > 0 && (
          <div style={{ ...cardStyle, marginBottom: 16 }}>
            <div style={{ ...T.overline, color: B.purple, marginBottom: 8 }}>HOW YOUR FACTORS INTERACT</div>
            {v2Explainability?.interaction_summary ? (
              <p style={{ ...T.small, color: B.navy, margin: 0, lineHeight: 1.55 }}>{v2Explainability.interaction_summary}</p>
            ) : (
              <div>
                {v2Interactions.effects.slice(0, 3).map((e, i) => (
                  <div key={i} style={{ display: "flex", gap: 8, alignItems: "baseline", marginBottom: i < 2 ? 4 : 0 }}>
                    <span style={{ ...T.micro, color: e.type === "penalty" ? B.bandLimited : B.teal, minWidth: 52 }}>{e.type === "penalty" ? `−${Math.abs(e.points)}` : `+${e.points}`} pts</span>
                    <span style={{ ...T.small, color: B.muted }}>{e.trigger_condition}</span>
                  </div>
                ))}
                {v2Interactions.net_adjustment !== 0 && (
                  <div style={{ ...T.meta, color: B.taupe, marginTop: 6, fontStyle: "italic" }}>Net interaction effect: {v2Interactions.net_adjustment > 0 ? "+" : ""}{v2Interactions.net_adjustment} points</div>
                )}
              </div>
            )}
          </div>
        )}

        {/* Category framing */}
        {olIndustryLabel && (
          <div style={{ ...cardStyle, marginBottom: 16 }}>
            <div style={{ ...T.overline, color: B.teal, marginBottom: 8 }}>STRUCTURAL CONTEXT</div>
            <p style={{ ...T.body, color: B.navy, margin: 0, lineHeight: 1.65 }}>
              {tier === "high" || tier === "established"
                ? `For ${incomeModelDesc || "this type of"} income structures in ${olIndustryLabel}, your level of structural protection is above typical patterns. The remaining gaps are specific, not fundamental.`
                : `For ${incomeModelDesc || "this type of"} income structures in ${olIndustryLabel}, the differentiating factor between ${record.stability_band} and the next band is typically ${dominantConstraintPlain[dominantConstraint] || "reducing the primary structural weakness"}.`}
            </p>
          </div>
        )}

        <PageFooter section="How Your Income Is Built" page={2} />
    </>,

    // Page 3: Risks
    <>
        <ReportHeader />
        <h1 style={{ ...T.pageTitle, marginBottom: 12 }}>What Could Go Wrong</h1>
        <p style={{ fontSize: 16, color: B.muted, maxWidth: 540, marginBottom: 20 }}>This section covers the risks that could lower your score and the detailed measurements behind it.</p>

        {/* Stress scenarios — top 3 */}
        {v2Scenarios && v2Scenarios.length > 0 && (
          <div style={{ marginBottom: 20 }}>
            <Overline large>What Could Hurt Your Score Most</Overline>
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
              const safeTitle = (/^[A-Z][a-z]+ [A-Z]/.test(title) && !title.includes("You ") && !title.includes("A ") && !title.includes("Your "))
                ? title.charAt(0).toUpperCase() + title.slice(1).toLowerCase()
                : title;
              const severity = s.band_shift ? "SEVERE" : (s.scenario_score <= 0 || s.score_drop > score * 0.5) ? "SEVERE" : s.score_drop > 8 ? "HIGH" : s.score_drop > 3 ? "MODERATE" : "LOW";
              const sevColor = severity === "SEVERE" ? B.bandLimited : severity === "HIGH" ? B.bandDeveloping : B.muted;
              return (
                <div key={s.scenario_id} style={{ padding: "12px 0", borderBottom: `1px solid ${B.stone}` }}>
                  <div style={{ display: "flex", flexDirection: mobile ? "column" : "row", justifyContent: "space-between", alignItems: mobile ? "flex-start" : "center", gap: mobile ? 4 : 0, marginBottom: 4 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <span style={{ ...T.micro, color: sevColor, minWidth: mobile ? 50 : 60 }}>{severity}</span>
                      <span style={{ ...T.sectionLabel, color: B.navy }}>{safeTitle}</span>
                    </div>
                    <span style={{ ...T.small, color: B.navy, flexShrink: 0, paddingLeft: mobile ? 58 : 0 }}>
                      {s.original_score} → <span style={{ color: B.bandLimited }}>{s.scenario_score}</span> <span style={{ color: B.muted }}>(−{s.score_drop})</span>
                    </span>
                  </div>
                  {/* Why this risk matters — narrative + outcome layer */}
                  {(() => {
                    const olMatch = olSelectedScenarios?.find(os => s.scenario_id.toLowerCase().includes(os.scenario_id.toLowerCase().replace("rs-", "").replace(/-/g, "_")) || os.label.toLowerCase() === s.label?.toLowerCase());
                    const bandShiftNote = s.band_shift ? <p style={{ ...T.meta, color: B.bandLimited, margin: "4px 0 0", fontWeight: 500 }}>This means you would move from {s.original_band} to {s.scenario_band}.</p> : null;
                    const narrativeText = olMatch?.why_it_matters || s.narrative;
                    return narrativeText ? (
                      <div style={{ paddingLeft: mobile ? 0 : 70, marginTop: 4 }}>
                        <p style={{ ...T.meta, color: B.muted, margin: 0, lineHeight: 1.5 }}>{narrativeText}</p>
                        {bandShiftNote}
                      </div>
                    ) : s.band_shift ? (
                      <div style={{ paddingLeft: mobile ? 0 : 70 }}>
                        {bandShiftNote}
                      </div>
                    ) : null;
                  })()}
                </div>
              );
            })}
          </div>
        )}

        <SectionDivider />

        {/* Fragility card */}
        {v2Fragility && (
          <div style={{ ...cardStyle, marginBottom: 24 }}>
            <div style={{ ...T.overline, color: B.taupe, marginBottom: 6 }}>IF SOMETHING GOES WRONG, HOW PROTECTED ARE YOU?</div>
            <div style={{ ...T.cardHeading, color: v2Fragility.fragility_class === "brittle" || v2Fragility.fragility_class === "thin" ? B.bandLimited : v2Fragility.fragility_class === "resilient" || v2Fragility.fragility_class === "supported" ? B.teal : B.navy, marginBottom: 6 }}>
              {fragilityClassLabel[v2Fragility.fragility_class] || ((v2Fragility.fragility_class || "").charAt(0).toUpperCase() + (v2Fragility.fragility_class || "").slice(1))}
            </div>
            <div style={{ ...T.meta, color: B.muted }}>
              {v2Explainability?.fragility_explanation || ((() => {
                const fCtx = olFamilyLabel ? ` For ${olFamilyLabel.toLowerCase()} structures${olIndustryLabel ? ` in ${olIndustryLabel}` : ""}, this is ` : "";
                return ({
                  brittle: `A single disruption — lost client, slow month — could cause a score collapse.${fCtx ? `${fCtx}a critical vulnerability.` : ""}`,
                  thin: `Can absorb a minor hit, but not two in a row.${fCtx ? `${fCtx}a common pattern that limits growth.` : ""}`,
                  uneven: `Protected in some dimensions, exposed in others.${fCtx ? `${fCtx}typical when one structural area is strong but others lag.` : ""}`,
                  supported: `Can absorb most common disruptions without band change.${fCtx ? `${fCtx}above-average structural protection.` : ""}`,
                  resilient: `Can absorb a major client loss or 90-day work stoppage.${fCtx ? `${fCtx}strong structural resilience.` : ""}`,
                })[v2Fragility.fragility_class] ?? "";
              })())}
            </div>
            {v2Fragility.primary_failure_mode && (
              <div style={{ ...T.meta, color: B.muted, marginTop: 4 }}>
                Primary risk: {({
                  concentration_collapse: "single-source dependency",
                  labor_interruption: "income stops when work stops",
                  visibility_gap: "no forward-committed income",
                  durability_thinness: "recurring income is fragile",
                })[v2Fragility.primary_failure_mode] ?? v2Fragility.primary_failure_mode}
              </div>
            )}
          </div>
        )}

        {/* Behavioral insight */}
        {v2BehavioralInsights && v2BehavioralInsights.length > 0 && (
          <div style={{ ...cardStyle, marginBottom: 16, borderLeft: `3px solid ${B.bandDeveloping}` }}>
            <div style={{ ...T.overline, color: B.bandDeveloping, marginBottom: 6 }}>PATTERN TO WATCH</div>
            <p style={{ ...T.small, color: B.navy, margin: 0, lineHeight: 1.55, fontWeight: 500 }}>{v2BehavioralInsights[0].pattern}</p>
            <p style={{ ...T.meta, color: B.muted, margin: "4px 0 0", lineHeight: 1.5 }}>{v2BehavioralInsights[0].consequence}</p>
            {v2BehavioralInsights[0].reframe && (
              <p style={{ ...T.meta, color: B.teal, margin: "4px 0 0", lineHeight: 1.5, fontWeight: 500 }}>{v2BehavioralInsights[0].reframe}</p>
            )}
          </div>
        )}

        {/* Page footer */}
        <PageFooter section="What Could Go Wrong" page={3} />
    </>,

    // Page 4: Action Plan
    <>
        <ReportHeader />
        <h1 style={{ ...T.pageTitle, marginBottom: 12 }}>Your Action Plan</h1>
        <p style={{ fontSize: 16, color: B.muted, maxWidth: 540, marginBottom: 20 }}>The single most impactful change you can make is described below. Start here.</p>
        {/* Top 3 improvements */}
        {v2Lift && v2Lift.lift_scenarios.length > 0 && (
          <div style={{ marginBottom: 16 }}>
            <Overline large>What Your Score Could Be</Overline>
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
                  <div style={{ display: "flex", alignItems: "flex-start", gap: 10 }}>
                    <span style={{ ...T.sectionTitle, color: B.purple, minWidth: 20 }}>{i + 1}</span>
                    <div style={{ flex: 1 }}>
                      <span style={{ ...T.sectionLabel, color: B.navy }}>{title}</span>
                      <div style={{ ...T.small, color: B.teal, fontWeight: 500, marginTop: 4 }}>If you made this change, your score would increase by approximately {s.lift} points, from {s.original_score} to {s.projected_score}.{s.band_shift ? ` This would move you to ${s.projected_band}.` : ""}</div>
                      {s.change_description && <div style={{ ...T.meta, color: B.muted, marginTop: 4 }}>What this means in practice: {s.change_description}</div>}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        <SectionDivider />

        {/* Priority actions — from outcome layer or fallback */}
        <Overline large>{isHighScorer ? `How to Maintain Your Position in ${industrySector}` : `Your Next Steps as a ${structureDesc} in ${industrySector}`}</Overline>
        {olActions && olActions.length > 0 && (
          <div style={{ ...T.meta, color: B.teal, fontWeight: 500, marginBottom: 8 }}>
            Tailored for {olIndustryLabel ? `${olIndustryLabel} · ` : ""}{olFamilyLabel ?? "your income model"}
          </div>
        )}
        <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 16 }}>
          {(olActions && olActions.length > 0
            ? olActions.slice(0, 3).map((a, i) => {
                // Blend OL narrative with v2 engine specifics (timeframe/target/tradeoff)
                const v2Match = v2?.recommended_actions?.find(ra => ra.category === a.action_id || ra.label.toLowerCase().includes(a.label.toLowerCase().split(" ")[0]));
                return {
                  rank: `${i + 1}`,
                  title: a.label,
                  copy: a.description,
                  why: a.why_now,
                  effect: a.expected_effect,
                  timeframe: (v2Match as Record<string, string>)?.timeframe ?? "",
                  target: (v2Match as Record<string, string>)?.target ?? "",
                  tradeoff: (v2Match as Record<string, string>)?.tradeoff ?? "",
                };
              })
            : (v2?.recommended_actions && v2.recommended_actions.length > 0)
            ? v2.recommended_actions.slice(0, 4).map((a, i) => ({
                rank: `${i + 1}`,
                title: a.label,
                copy: a.description,
                why: "",
                effect: a.expected_impact,
                timeframe: (a as Record<string, string>).timeframe ?? "",
                target: (a as Record<string, string>).target ?? "",
                tradeoff: (a as Record<string, string>).tradeoff ?? "",
              }))
            : (() => {
                const fam = olFamilyLabel ? olFamilyLabel.toLowerCase() : structureDesc;
                const ind = olIndustryLabel || industrySector;
                const priorities = isHighScorer ? [
                  { key: "forward_visibility", title: "Maintain forward revenue visibility", copy: `As a ${fam} in ${ind}, review your committed revenue quarterly. Ensure at least 60% of next quarter's income is already locked in.` },
                  { key: "source_concentration", title: "Monitor client concentration", copy: `For ${fam} structures, no single client should exceed 25% of revenue. Review your client mix monthly and diversify proactively.` },
                  { key: "labor_dependence", title: "Protect income continuity", copy: `As a ${fam}, ensure your passive and repeatable income streams are growing, not shrinking. Review annually.` },
                  { key: "low_continuity", title: "Extend your runway", copy: `For ${fam} structures in ${ind}, your continuity window is your safety margin. Every quarter, ask: could I sustain 6 months without new business?` },
                ] : [
                  { key: "forward_visibility", title: "This week: start locking in future income", copy: `As a ${fam} in ${ind}, reach out to your top 3 clients or prospects about converting to retainers, multi-month contracts, or advance commitments. Your forward visibility is your biggest gap right now.` },
                  { key: "source_concentration", title: "This month: add a second meaningful income source", copy: `Your stress test shows a ${record.risk_scenario_drop}-point drop if your biggest source disappears. For ${fam} structures, identify one new client, product, or revenue stream that could reach 10%+ of your income within 90 days.` },
                  { key: "labor_dependence", title: "This quarter: build one income stream that doesn't need you daily", copy: `${record.active_income_level}% of your income requires your daily effort. As a ${fam} in ${ind}, pick one service, product, or arrangement you can convert into recurring or passive revenue this quarter.` },
                  { key: "low_continuity", title: "This quarter: extend how long income lasts without work", copy: `Your income would continue for about ${continuityDisplay} if you stopped. For ${fam} structures, build at least one stream that would keep producing for 3+ months independently.` },
                ];
                const sorted = [
                  ...priorities.filter(p => p.key === dominantConstraint),
                  ...priorities.filter(p => p.key !== dominantConstraint),
                ];
                return sorted.map((p, i) => ({ rank: `${i + 1}`, title: p.title, copy: p.copy, why: "", effect: "", timeframe: "", target: "", tradeoff: "" }));
              })()
          ).map((action) => (
            <div key={action.rank} style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
              <span style={{ ...T.sectionLabel, color: B.purple, minWidth: 18 }}>{action.rank}.</span>
              <div style={{ flex: 1 }}>
                <div style={{ ...T.sectionLabel, color: B.navy, marginBottom: 2 }}>{action.title}</div>
                <p style={{ ...T.small, color: B.muted, margin: 0 }}>{action.copy}</p>
              </div>
            </div>
          ))}
        </div>

        {/* What NOT to do — inline with actions */}
        {((v2AvoidActions && v2AvoidActions.length > 0) || (olAvoid && olAvoid.length > 0)) && (
          <div style={{ marginBottom: 16 }}>
            <div style={{ ...T.sectionLabel, color: B.bandLimited, marginBottom: 8 }}>What to avoid</div>
            {(v2AvoidActions ?? []).slice(0, 1).map((a) => (
              <div key={a.action_id} style={{ ...T.small, color: B.muted, marginBottom: 4 }}>— <span style={{ fontWeight: 500 }}>{a.label}:</span> {a.reason}</div>
            ))}
            {(olAvoid ?? []).slice(0, 1).map((text) => (
              <div key={text} style={{ ...T.small, color: B.muted, marginBottom: 4 }}>— {text}</div>
            ))}
          </div>
        )}

        <SectionDivider />

        {/* Tradeoffs */}
        {v2TradeoffNarratives && v2TradeoffNarratives.length > 0 && (
          <div style={{ marginBottom: R.sectionMb }}>
            <Overline large>Tradeoffs to Understand</Overline>
            {v2TradeoffNarratives.slice(0, 1).map((t, i) => (
              <div key={i} style={{ ...cardStyle, marginBottom: 8 }}>
                <div style={{ ...T.sectionLabel, color: B.navy, marginBottom: 6 }}>{t.action_label}</div>
                <div style={{ display: "flex", flexDirection: mobile ? "column" : "row", gap: mobile ? 12 : 16 }}>
                  <div style={{ flex: mobile ? undefined : 1 }}><div style={{ ...T.meta, color: B.teal, fontWeight: 600, marginBottom: 4 }}>THE UPSIDE</div><p style={{ ...T.meta, color: B.muted, margin: 0, lineHeight: 1.5 }}>{t.upside}</p></div>
                  <div style={{ flex: mobile ? undefined : 1 }}><div style={{ ...T.meta, color: B.bandDeveloping, fontWeight: 600, marginBottom: 4 }}>THE COST</div><p style={{ ...T.meta, color: B.muted, margin: 0, lineHeight: 1.5 }}>{t.downside}</p></div>
                </div>
                <div style={{ borderTop: `1px solid ${B.stone}`, marginTop: 8, paddingTop: 6 }}><p style={{ ...T.meta, color: B.navy, margin: 0, fontWeight: 500 }}>{t.net_recommendation}</p></div>
              </div>
            ))}
          </div>
        )}

        {/* Combined top-two lift */}
        {v2Lift?.combined_top_two && v2Lift.combined_top_two.lift > 0 && (
          <div style={{ ...cardStyle, marginBottom: 16, borderLeft: `3px solid ${B.teal}` }}>
            <div style={{ ...T.overline, color: B.teal, marginBottom: 6 }}>IF YOU DID BOTH</div>
            <p style={{ ...T.small, color: B.navy, margin: 0, lineHeight: 1.55 }}>
              Combining the top two changes would raise your score to approximately <span style={{ fontWeight: 700 }}>{v2Lift.combined_top_two.projected_score}</span> (+{v2Lift.combined_top_two.lift} points).{v2Lift.combined_top_two.band_shift ? ` This would move you to ${v2Lift.combined_top_two.projected_band}.` : ""}
            </p>
            {v2Explainability?.best_lift_explanation && (
              <p style={{ ...T.meta, color: B.muted, margin: "6px 0 0", lineHeight: 1.5 }}>{v2Explainability.best_lift_explanation}</p>
            )}
          </div>
        )}

        {/* Execution roadmap */}
        {v2ExecutionRoadmap && v2ExecutionRoadmap.length > 0 && (
          <div style={{ marginBottom: 16 }}>
            <SectionDivider />
            <Overline large>Week-by-Week Roadmap</Overline>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {v2ExecutionRoadmap.slice(0, 4).map((w, i) => (
                <div key={i} style={{ ...cardStyle, padding: "10px 14px" }}>
                  <div style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
                    <span style={{ ...T.micro, color: B.purple, minWidth: mobile ? 60 : 70, flexShrink: 0 }}>{w.week}</span>
                    <div style={{ flex: 1 }}>
                      <div style={{ ...T.small, fontWeight: 600, color: B.navy, marginBottom: 2 }}>{w.action}</div>
                      <p style={{ ...T.meta, color: B.muted, margin: 0, lineHeight: 1.5 }}>{w.detail}</p>
                      {w.success_metric && <p style={{ ...T.meta, color: B.teal, margin: "4px 0 0", fontWeight: 500 }}>Target: {w.success_metric}</p>}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <PageFooter section="Your Action Plan" page={4} />
    </>,

    // Page 5: Methodology
    <>
        <ReportHeader />
        <h1 style={{ ...T.pageTitle, marginBottom: 16 }}>Methodology and Next Steps</h1>

        {/* Methodology */}
        <div style={{ ...cardStyle, marginBottom: 20, borderLeft: `3px solid ${B.teal}` }}>
          <div style={{ ...T.overline, color: B.teal, marginBottom: 8 }}>HOW THIS SCORE WAS CALCULATED</div>
          <p style={{ ...T.small, color: B.muted, margin: 0, lineHeight: 1.65 }}>
            Your Income Stability Score is produced by Model RP-2.0, a deterministic scoring system that evaluates fixed structural dimensions of income. The same inputs always produce the same score. The model uses fixed rules and weights — no machine learning, no subjective judgment, and no access to your financial accounts. Full methodology is published at runpayway.com/methodology.
          </p>
        </div>

        {/* Assessment quality — confidence + durability */}
        {(v2Confidence || v2Quality) && (
          <div style={{ display: "flex", flexDirection: mobile ? "column" : "row", gap: 12, marginBottom: 16 }}>
            {v2Confidence && (
              <div style={{ flex: 1, ...cardStyle }}>
                <div style={{ ...T.overline, color: B.taupe, marginBottom: 6 }}>ASSESSMENT CONFIDENCE</div>
                <div style={{ ...T.cardHeading, color: v2Confidence.confidence_level === "high" ? B.teal : v2Confidence.confidence_level === "moderate" ? B.navy : B.bandDeveloping, marginBottom: 4, textTransform: "capitalize" }}>{v2Confidence.confidence_level}</div>
                {v2Confidence.deductions && v2Confidence.deductions.length > 0 && (
                  <p style={{ ...T.meta, color: B.muted, margin: 0, lineHeight: 1.5 }}>
                    {v2Confidence.deductions.slice(0, 2).map((d: { reason: string }) => d.reason).join(". ")}.
                  </p>
                )}
              </div>
            )}
            {v2Quality && (
              <div style={{ flex: 1, ...cardStyle }}>
                <div style={{ ...T.overline, color: B.taupe, marginBottom: 6 }}>INCOME DURABILITY</div>
                <div style={{ ...T.cardHeading, color: v2Quality.durability_grade === "durable" || v2Quality.durability_grade === "robust" ? B.teal : v2Quality.durability_grade === "moderate" ? B.navy : B.bandDeveloping, marginBottom: 4, textTransform: "capitalize" }}>{v2Quality.durability_grade}</div>
                <p style={{ ...T.meta, color: B.muted, margin: 0, lineHeight: 1.5 }}>Quality score: {v2Quality.quality_score}/100</p>
              </div>
            )}
          </div>
        )}

        {/* Industry-specific reassessment triggers */}
        {olTriggers && olTriggers.length > 0 && (
          <div style={{ marginBottom: 16 }}>
            <div style={{ ...T.sectionLabel, color: B.navy, marginBottom: 8 }}>When to retake this assessment</div>
            {olTriggers.slice(0, 3).map((t) => (
              <div key={t.trigger_id} style={{ ...T.small, color: B.muted, display: "flex", gap: 8, marginBottom: 4 }}>
                <div style={{ width: 5, height: 5, borderRadius: "50%", backgroundColor: B.purple, marginTop: 6, flexShrink: 0 }} />
                {t.display_text}
              </div>
            ))}
          </div>
        )}

        {/* Reassessment + Verification */}
        <div style={{ ...cardStyle, marginBottom: 16 }}>
          <Overline>WHEN TO RETAKE THIS ASSESSMENT</Overline>
          <div style={{ ...T.cardHeading, color: B.navy, marginBottom: 2 }}>{reassessDate}</div>
          <div style={{ ...T.cardHeading, color: B.purple, marginBottom: 6 }}>{reassessDaysLeft} days from now</div>
          <p style={{ ...T.meta, color: B.muted, margin: 0, lineHeight: 1.5 }}>We suggest reassessing after you have made meaningful structural changes to your income — typically {tier === "limited" ? "2" : tier === "high" ? "6" : "3"} months. Retake after real structural improvement is active, not after a short-term earnings spike.</p>
        </div>

        {/* Reference to simulator for suggested language */}
        {v2ScriptTemplates && v2ScriptTemplates.length > 0 && (
          <div className="no-print" style={{ ...cardStyle, marginBottom: 16, borderLeft: `3px solid ${B.purple}` }}>
            <div style={{ ...T.sectionLabel, color: B.navy, marginBottom: 4 }}>Suggested Language for Your Next Move</div>
            <p style={{ ...T.small, color: B.muted, margin: 0, lineHeight: 1.55 }}>
              Starting drafts based on your structural weaknesses are available in your RunPayway&#8482; Stability Simulator — along with your interactive sliders and scenario modeling tools.
            </p>
          </div>
        )}

        <p style={{ ...T.meta, color: B.taupe, lineHeight: 1.5, margin: 0, fontStyle: "italic" }}>
          The Income Stability Score is a present-state income stability assessment based on information provided by the user. It does not provide financial advice and does not predict future financial outcomes. This report reflects a present-state structural interpretation under the RunPayway framework.
        </p>

        {/* Closing signature */}
        <div style={{ marginTop: 24, paddingTop: 16, borderTop: `1px solid ${B.stone}`, textAlign: "center" }}>
          <p style={{ ...T.meta, color: B.taupe, margin: 0 }}>
            This report was generated by RunPayway Model RP-2.0.
            The methodology is published at runpayway.com/methodology.
          </p>
        </div>

        <PageFooter section="Methodology and Next Steps" page={5} />
    </>,

  ];

  return (
    <ReportErrorBoundary>
    {/* Hidden container for PDF export — keeps all pages rendered */}
    <div id="report-container" style={{ position: "fixed", left: 0, top: 0, width: PDF.captureW, zIndex: -1, opacity: 0, pointerEvents: "none", display: "flex", flexDirection: "column", alignItems: "center", gap: 32, maxWidth: PDF.captureW, padding: "0 0 40px" }}>
      {pageContents.map((content, i) => (
        <ReportPage key={i} record={record}>{content}</ReportPage>
      ))}

      {/* ── Print stylesheet + dark mode ── */}
      <style>{`
        @page {
          size: letter;
          margin: 0.5in;
        }
        @media print {
          .no-print, .download-section { display: none !important; }
          #report-container { position: static !important; left: auto !important; gap: 0 !important; opacity: 1 !important; z-index: auto !important; pointer-events: auto !important; width: 100% !important; }
          #paginated-view { display: none !important; }
          .report-page {
            break-inside: auto;
            page-break-inside: auto;
            page-break-after: auto;
            box-shadow: none !important;
            border: none !important;
            border-radius: 0 !important;
            margin: 0 !important;
            padding: 0.5in !important;
            width: 100% !important;
            max-width: 100% !important;
            min-height: auto !important;
            overflow: visible !important;
            color-adjust: exact;
            -webkit-print-color-adjust: exact;
          }
          .report-page:last-child {
            page-break-after: auto;
          }
          /* Prevent individual cards/sections from splitting across pages */
          .report-page > div {
            break-inside: avoid;
            page-break-inside: avoid;
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

    {/* On-screen paginated view */}
    <div id="paginated-view" style={{ maxWidth: PDF.captureW, margin: "0 auto", padding: "0 0 80px" }}>
      <div ref={pageContainerRef} style={{ minHeight: "60vh" }}>
        <div className="report-page" style={{ backgroundColor: "#FFFFFF", borderRadius: mobile ? 0 : 8, padding: mobile ? "24px 16px" : "32px 36px", border: mobile ? "none" : "1px solid rgba(14,26,43,0.06)", boxShadow: mobile ? "none" : "0 2px 12px rgba(14,26,43,0.04)" }}>
          {pageContents[currentPage]}
        </div>
      </div>

      {/* Fixed bottom navigation bar */}
      <div style={{
        position: "fixed", bottom: 0, left: 0, right: 0,
        backgroundColor: "rgba(255,255,255,0.97)",
        backdropFilter: "blur(12px)",
        borderTop: "1px solid rgba(14,26,43,0.08)",
        padding: mobile ? "10px 12px" : "12px 24px",
        zIndex: 100,
        display: "flex", justifyContent: "center", alignItems: "center", gap: mobile ? 8 : 24,
      }}>
        {/* Download PDF — hide on mobile to save space */}
        {!mobile && (
          <button
            onClick={handleDownload}
            disabled={downloading}
            style={{
              background: "none", border: "none", cursor: downloading ? "default" : "pointer",
              fontSize: 13, color: "rgba(14,26,43,0.58)",
              padding: "8px 12px", fontWeight: 500,
            }}
          >
            {downloading ? "Generating..." : "Download PDF"}
          </button>
        )}

        {/* Left arrow */}
        <button
          onClick={() => setCurrentPage(p => Math.max(0, p - 1))}
          disabled={currentPage === 0}
          style={{
            background: "none", border: "none", cursor: currentPage === 0 ? "default" : "pointer",
            fontSize: mobile ? 16 : 18, color: currentPage === 0 ? "rgba(14,26,43,0.15)" : "#0E1A2B",
            padding: mobile ? "8px 8px" : "8px 12px",
          }}
          aria-label="Previous page"
        >
          ←
        </button>

        {/* Page dots */}
        <div style={{ display: "flex", gap: mobile ? 6 : 8, alignItems: "center" }}>
          {Array.from({ length: totalPages }, (_, i) => (
            <button
              key={i}
              onClick={() => setCurrentPage(i)}
              style={{
                width: currentPage === i ? (mobile ? 18 : 24) : (mobile ? 6 : 8),
                height: mobile ? 6 : 8,
                borderRadius: 4,
                backgroundColor: currentPage === i ? "#0E1A2B" : "rgba(14,26,43,0.15)",
                border: "none",
                cursor: "pointer",
                transition: "all 200ms ease",
                padding: 0,
              }}
              aria-label={`Go to page ${i === 0 ? "Cover" : i}`}
            />
          ))}
        </div>

        {/* Page label */}
        <span style={{ fontSize: mobile ? 12 : 13, color: "#0E1A2B", fontWeight: 500 }}>{pageNames[currentPage]}</span>

        {/* Right arrow */}
        <button
          onClick={() => setCurrentPage(p => Math.min(totalPages - 1, p + 1))}
          disabled={currentPage === totalPages - 1}
          style={{
            background: "none", border: "none", cursor: currentPage === totalPages - 1 ? "default" : "pointer",
            fontSize: mobile ? 16 : 18, color: currentPage === totalPages - 1 ? "rgba(14,26,43,0.15)" : "#0E1A2B",
            padding: mobile ? "8px 8px" : "8px 12px",
          }}
          aria-label="Next page"
        >
          →
        </button>
      </div>
    </div>
    </ReportErrorBoundary>
  );
}
