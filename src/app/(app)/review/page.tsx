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

  // ── Tier-aware copy ──
  const copy = {
    p1_headline: ({
      A1: `${name} scored ${score} out of 100. The income is active, but the structure is very vulnerable if conditions change. Most of the protection needed for stability is not yet in place.`,
      A2: `${name} scored ${score} out of 100. The income is active, but the structure is still weak and vulnerable if conditions change. Protection is limited, and important stability elements are still missing.`,
      A3: `${name} scored ${score} out of 100. Some early income structure is in place, but the setup is still below a stable range and remains vulnerable to disruption.`,
      B1: `${name} scored ${score} out of 100. The structure is developing, but it is not yet protected enough against disruption. The next gains will come from improving continuity, visibility, and source balance.`,
      B2: `${name} scored ${score} out of 100. The income structure is developing, but it still needs stronger protection before it can be considered stable.`,
      C1: `${name} scored ${score} out of 100. The income structure has real stability, but it is not yet strongly protected against disruption. The main opportunity now is to secure more income ahead of time and reduce reliance on any single source.`,
      C2: `${name} scored ${score} out of 100. The structure is established and relatively stable, but it is not yet fully insulated from meaningful disruption.`,
      D1: `${name} scored ${score} out of 100. The income structure is strong, with substantial protection already in place. The focus now is on preserving strength and tightening remaining weak points.`,
      D2: `${name} scored ${score} out of 100. The structure is exceptionally strong and highly protected. The focus now is on maintaining durability and avoiding unnecessary concentration risk.`,
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

  // ── Band-sensitive copy blocks ──
  const bandExplainer: Record<string, string> = {
    A1: `${name} is active right now, but the structure is highly vulnerable if conditions change. Very little protection is in place.`,
    A2: `${name} is active right now, but the structure is still weak and not yet protected enough against disruption.`,
    A3: `${name} has some early structure in place, but protection is still limited and meaningful vulnerability remains.`,
    B1: `${name} is developing, but the structure is still not protected enough against disruption.`,
    B2: `${name} has a developing structure, but stronger protection is still needed in key areas.`,
    C1: `${name} has real stability, but the structure is not yet strongly protected against disruption.`,
    C2: `${name} has established stability and meaningful protection, though some vulnerabilities still remain.`,
    D1: `${name} is strong and well-protected compared with most benchmarks, with only limited vulnerabilities remaining.`,
    D2: `${name} is exceptionally strong, highly protected, and structurally resilient across the benchmark.`,
  };

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
    A1: `${name} scored ${score} out of 100. This is a weak score. The income is active, but the structure is highly exposed and not yet stable enough to absorb disruption well.`,
    A2: `${name} scored ${score} out of 100. This is still a weak score. The income is active, but the structure is not yet stable enough to handle disruption confidently.`,
    A3: `${name} scored ${score} out of 100. This score shows that some early structure is in place, but protection is still limited and the setup remains vulnerable.`,
    B1: `${name} scored ${score} out of 100. This score shows a developing structure, but protection is still incomplete and meaningful vulnerabilities remain.`,
    B2: `${name} scored ${score} out of 100. This is an improving score, but the structure still needs stronger protection before it can be called stable.`,
    C1: `${name} scored ${score} out of 100. This is a solid score. The structure is working, but it is not yet strongly protected from disruption.`,
    C2: `${name} scored ${score} out of 100. This is a strong score. The structure has established stability, though important vulnerabilities still remain.`,
    D1: `${name} scored ${score} out of 100. This is a strong score. The structure already has substantial protection, with only limited weaknesses remaining.`,
    D2: `${name} scored ${score} out of 100. This is an exceptional score. The structure is highly protected and well-positioned relative to the benchmark.`,
  };

  const p2Interpretation: Record<string, string> = {
    A1: "This is a weak score. The income is active, but the structure is still highly exposed. Too much depends on ongoing work, too little is secured ahead of time, and the setup could weaken quickly if conditions change.",
    A2: "This is still a weak score. The structure is active, but it is not yet stable enough to absorb disruption well. The next step is to build stronger protection before focusing on growth.",
    A3: "This score shows that some structure is beginning to form, but it is still below a stable level. The next step is to strengthen protection, continuity, and balance.",
    B1: "This is a developing score. The structure is improving, but important weaknesses still remain. The next step is to turn early progress into stronger protection.",
    B2: "This is an improving score, but the structure still needs stronger protection before it can be considered stable. The next gains will come from strengthening continuity and reducing major vulnerabilities.",
    C1: "This is a solid score. The structure is working, but it is not fully protected yet. A disruption to one major source would still matter too much, and more income needs to be lined up ahead of time.",
    C2: "This is a strong score. The structure is established, but it is not fully insulated from disruption. The next gains come from refinement, stronger continuity, and reducing concentration risk.",
    D1: "This is a strong score. The structure is already well-protected. The next gains come from preserving continuity, reducing residual risk, and maintaining strength over time.",
    D2: "This is an exceptional score. The structure is highly resilient and already protected at a high level. The next focus is maintenance, discipline, and avoiding unnecessary fragility.",
  };

  const p2BottomLine: Record<string, string> = {
    A1: `${name} is active, but not yet stable enough. The first priority is building protection.`,
    A2: `${name} has early income activity, but the structure still needs much stronger protection.`,
    A3: `${name} has a starting structure in place. The next gains come from turning it into something more stable.`,
    B1: `${name} is developing. The next gains come from stronger protection, not just more output.`,
    B2: `${name} has real progress. The next gains come from strengthening the structure so it can hold up better.`,
    C1: `${name} has real stability. The next gains come from stronger protection, not just higher output.`,
    C2: `${name} is established. The next gains come from refinement and stronger durability.`,
    D1: `${name} is strong. The next gains come from preserving resilience and reducing remaining weak points.`,
    D2: `${name} is exceptionally strong. The focus now is maintaining discipline and long-term resilience.`,
  };

  const p2WorkingTitle: string = ["A1", "A2"].includes(subTier) ? "There is some income activity in place" : ["A3"].includes(subTier) ? "Some early structure is visible" : subTier === "B1" ? "There is an early foundation forming" : subTier === "B2" ? "There is a developing foundation in place" : ["C1", "C2"].includes(subTier) ? "There is real stability in place" : "The structure is already strong";

  const p2WorkingBody: string = ["A1", "A2"].includes(subTier) ? "The income is not starting from zero. This is an early base to build from, but it is not yet strong protection." : ["A3"].includes(subTier) ? "The income is no longer starting from zero. A base exists, but it is still below a stable range." : subTier === "B1" ? "The structure is not starting from zero, but it is still early. Important weaknesses remain." : subTier === "B2" ? "Parts of the structure are beginning to support stability, but stronger protection is still needed." : ["C1", "C2"].includes(subTier) ? "Parts of the structure are already working well. The next gains come from strengthening what already exists." : "Protection is already substantial. The focus is refinement rather than repair.";

  const p3Intro: Record<string, string> = {
    A1: `This page shows what could cause the most damage because the current structure has very little protection in place.`,
    A2: `This page shows what could hurt your income most because the current structure is still weak and vulnerable to disruption.`,
    A3: `This page shows what could hurt your income most as the structure is still below a stable range.`,
    B1: `This page shows what could hurt your income most while the structure is still developing.`,
    B2: `This page shows what could hurt your income most before the structure becomes more stable.`,
    C1: `This page shows what could still weaken the structure even though it is already stable.`,
    C2: `This page shows what could still weaken your income despite an established structure.`,
    D1: `This page shows the main risks that could still weaken your income, even from a position of strength.`,
    D2: `This page shows the limited risks that could still affect your income despite a highly resilient structure.`,
  };

  const p4CurrentBandBody: Record<string, string> = {
    A1: "The income is working now, but the structure is still fragile. Immediate stability and protection need to come first.",
    A2: "The income is active, but the structure is still weak and needs stronger protection before it can absorb disruption well.",
    A3: "Some early structure is in place, but the setup is still below a stable level and needs stronger protection first.",
    B1: "The structure is developing, but it is not yet strong enough to absorb disruption well.",
    B2: "The structure has a real foundation, but stronger protection is still needed in key areas.",
    C1: "The structure is stable, but it is not yet strongly protected against meaningful disruption.",
    C2: "The structure is established and relatively stable, though some important vulnerabilities still remain.",
    D1: "The structure is strong, with only limited areas left to refine.",
    D2: "The structure is exceptionally strong. The remaining gains come from refinement rather than repair.",
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
    A1: `The first priority for ${name} is not bigger income. It is building basic protection. That means securing more income ahead of time, reducing reliance on one source, and creating more income that continues if work stops.`,
    A2: `The first priority for ${name} is not bigger income. It is building stronger protection so the structure can hold up better if conditions change.`,
    A3: `The first priority for ${name} is to turn early structure into something more stable. That means stronger continuity, more income secured ahead of time, and less reliance on one source.`,
    B1: `The next priority for ${name} is to strengthen the developing structure so it can handle disruption more confidently.`,
    B2: `The first priority for ${name} is not simply more income. It is stronger protection, better continuity, and less concentration risk.`,
    C1: "The priority now is not simply earning more. It is strengthening protection, visibility, and continuity.",
    C2: "The priority now is to refine an established structure so it becomes even more durable and less exposed to disruption.",
    D1: "The priority now is to preserve strength, reduce residual vulnerabilities, and maintain continuity over time.",
    D2: "The priority now is long-term discipline: preserve strength, avoid unnecessary fragility, and maintain resilience over time.",
  };

  const p5CompareInterpretation: string = (() => {
    const pct = peerPercentileValue;
    const avg = v2Benchmarks?.cluster_average_score ?? 42;
    const top20 = v2Benchmarks?.top_20_threshold ?? 65;
    if (score < avg && pct <= 10) return `This score is currently far below the peer average of ${avg} and well below the top 20% threshold of ${top20}.`;
    if (score < avg && pct <= 30) return `This score is currently below the peer average of ${avg} and below the top 20% threshold of ${top20}.`;
    if (score < avg) return `This score is still below the peer average of ${avg}.`;
    if (score >= top20) return `This score is above both the peer average of ${avg} and the top 20% threshold of ${top20}.`;
    if (score >= avg) return `This score is above the peer average of ${avg}, but still below the top 20% threshold of ${top20}.`;
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
              {record.peer_stability_percentile_label} percentile among {(record.industry_sector || "").replace(/_/g, " ").replace(/\b\w/g, (c: string) => c.toUpperCase())} professionals in this benchmark
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

        <p style={{ ...T.body, color: B.muted, marginBottom: 10, maxWidth: 540 }}>
          {copy.p1_headline}
        </p>
        <p style={{ ...T.small, color: B.teal, marginBottom: 16, fontWeight: 500 }}>
          Why this matters: income that looks fine today can still be structurally weak if too much depends on active work, one source, or income that is not secured ahead of time.
        </p>

        {/* Single most important insight — one line the customer remembers */}
        <div style={{ backgroundColor: B.bone, border: "1px solid rgba(14,26,43,0.06)", borderLeft: `3px solid ${B.purple}`, borderRadius: 4, padding: "14px 18px", marginBottom: 16 }}>
          <p style={{ ...T.body, color: B.navy, margin: 0, fontWeight: 500, lineHeight: 1.6 }}>
            {`The main thing holding ${name} back right now: ${dominantConstraintPlain[dominantConstraint]}.`}
            {v2Sensitivity?.tests?.[0]?.lift ? ` Fixing this could raise the score by about ${v2Sensitivity.tests[0].lift} points.` : ""}
          </p>
        </div>

        <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginBottom: 16 }}>
          <MetricCard label="INCOME THAT WOULD CONTINUE IF YOU STOPPED WORKING TODAY" value={`${record.income_continuity_pct}%`} explanation={`${record.income_continuity_pct}% of your income would likely keep coming in if active work stopped today. That is a ${continuitySeverity} level of continuity.`} />
          <MetricCard label="IF THE LARGEST INCOME SOURCE DISAPPEARED" value={<>{record.final_score} <span style={{ color: B.taupe, fontWeight: 400 }}>→</span> {Math.max(0, record.risk_scenario_score)}</>} explanation={sourceDropSeverity === "collapse" ? "If the largest source disappeared, the score would collapse to near zero. This is a severe concentration risk." : sourceDropSeverity === "severe" ? "If the largest source disappeared, the score would drop sharply. Too much still depends on one source." : "If the largest income source disappeared, the score would likely fall to this level. That means too much still depends on one source."} />
          <MetricCard label="MAIN REASON THE SCORE IS HELD BACK" value={dominantConstraintPlain[dominantConstraint].charAt(0).toUpperCase() + dominantConstraintPlain[dominantConstraint].slice(1)} explanation={({
            source_concentration: "If the largest source changed, the score would drop significantly.",
            forward_visibility: "More income needs to be committed before each month begins.",
            labor_dependence: "Too much income still requires daily work to keep being produced.",
            low_continuity: "Income would not continue for long enough if active work stopped.",
            few_sources: "The income depends on too few independent sources.",
          })[dominantConstraint]} />
          <MetricCard label="OVERALL DURABILITY" value={durabilityValue[subTier]} explanation={durabilityBody[subTier]} />
        </div>


        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 16, paddingTop: 16, borderTop: "1px solid rgba(14,26,43,0.12)" }}>
          {[["Prepared for", name], ["Industry", (record.industry_sector || "").replace(/_/g, " ").replace(/\b\w/g, (c: string) => c.toUpperCase())], ["Date Issued", issuedDate], ["Record ID", record.record_id.slice(0, 8)]].map(([l, v]) => (
            <div key={l}>
              <div style={{ ...T.meta, color: B.taupe }}>{l}</div>
              <div style={{ ...T.small, fontWeight: 500, color: B.navy }}>{v}</div>
            </div>
          ))}
        </div>

        <p style={{ ...T.meta, color: B.taupe, lineHeight: 1.5, margin: 0, fontStyle: "italic" }}>
          The Income Stability Score is a present-state income stability assessment based on information provided by the user. It does not provide financial advice and does not predict future financial outcomes.
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
        <div style={{ display: "flex", flexDirection: "column", gap: 14, marginBottom: 20 }}>
          <div>
            <div style={{ ...T.sectionLabel, color: B.navy, marginBottom: 6 }}>{p2WorkingTitle}</div>
            <p style={{ ...T.body, color: B.muted, margin: 0 }}>{p2WorkingBody}</p>
          </div>
          <div>
            <div style={{ ...T.sectionLabel, color: B.navy, marginBottom: 6 }}>Some income would continue even if active work stopped</div>
            <p style={{ ...T.body, color: B.muted, margin: 0 }}>{record.income_continuity_pct}% of your income would likely keep coming in if active work stopped today. That is a real base, but it is still smaller than ideal.</p>
          </div>
          <div>
            <div style={{ ...T.sectionLabel, color: B.navy, marginBottom: 6 }}>{tier === "limited" ? "The structure is early, but not absent" : tier === "developing" ? "There is progress to build on" : "The opportunity is refinement, not rebuilding"}</div>
            <p style={{ ...T.body, color: B.muted, margin: 0 }}>{tier === "limited" ? "This is a starting point. The priority is to build basic protection before focusing on growth." : tier === "developing" ? "The structure is developing, but it still needs stronger protection in key areas." : "The foundation is working. The next gains come from strengthening what is already in place, not starting over."}</p>
          </div>
        </div>

        <SectionDivider />

        {/* What is still vulnerable — ordered by dominant constraint */}
        <Overline>WHAT IS STILL VULNERABLE</Overline>
        <div style={{ display: "flex", flexDirection: "column", gap: 14, marginBottom: 20 }}>
          {(() => {
            const vulnerabilities: Record<string, Array<{ title: string; body: string }>> = {
              source_concentration: [
                { title: "Too much still depends on one source", body: `If the largest income source disappeared, the score would likely fall from ${record.final_score} to ${Math.max(0, record.risk_scenario_score)}. That is still too large a drop.` },
                { title: "More income needs to be secured ahead of time", body: "The next gains will come from having more income already committed before the month begins." },
                { title: "Income would continue, but not for long enough yet", body: `Based on the current structure, income would likely continue for about ${continuityDisplay} if active work stopped. Longer is better.` },
              ],
              forward_visibility: [
                { title: "More income needs to be secured ahead of time", body: "The next gains will come from having more income already committed before the month begins." },
                { title: "Too much still depends on one source", body: `If the largest income source disappeared, the score would likely fall from ${record.final_score} to ${Math.max(0, record.risk_scenario_score)}. That is still too large a drop.` },
                { title: "Income would continue, but not for long enough yet", body: `Based on the current structure, income would likely continue for about ${continuityDisplay} if active work stopped. Longer is better.` },
              ],
              labor_dependence: [
                { title: "Too much income still depends on daily work", body: "A large share of the income requires active work to keep being produced. If work slows or stops, stability drops quickly." },
                { title: "More income needs to be secured ahead of time", body: "The next gains will come from having more income already committed before the month begins." },
                { title: "Too much still depends on one source", body: `If the largest income source disappeared, the score would likely fall from ${record.final_score} to ${Math.max(0, record.risk_scenario_score)}. That is still too large a drop.` },
              ],
              low_continuity: [
                { title: "Income would not continue for long enough if work stopped", body: `Based on the current structure, income would likely continue for about ${continuityDisplay} if active work stopped. That is not yet enough.` },
                { title: "More income needs to be secured ahead of time", body: "The next gains will come from having more income already committed before the month begins." },
                { title: "Too much still depends on one source", body: `If the largest income source disappeared, the score would likely fall from ${record.final_score} to ${Math.max(0, record.risk_scenario_score)}. That is still too large a drop.` },
              ],
              few_sources: [
                { title: "The income depends on too few sources", body: "The structure is still too narrow. Adding dependable sources would reduce exposure to any single one changing." },
                { title: "More income needs to be secured ahead of time", body: "The next gains will come from having more income already committed before the month begins." },
                { title: "Income would continue, but not for long enough yet", body: `Based on the current structure, income would likely continue for about ${continuityDisplay} if active work stopped. Longer is better.` },
              ],
            };
            return (vulnerabilities[dominantConstraint] ?? vulnerabilities.forward_visibility).map((v) => (
              <div key={v.title}>
                <div style={{ ...T.sectionLabel, color: B.navy, marginBottom: 6 }}>{v.title}</div>
                <p style={{ ...T.body, color: B.muted, margin: 0 }}>{v.body}</p>
              </div>
            ));
          })()}
        </div>

        <SectionDivider />

        {/* Plain-English interpretation */}
        <Overline>PLAIN-ENGLISH INTERPRETATION</Overline>
        <p style={{ ...T.body, color: B.navy, marginBottom: 16, lineHeight: 1.6, maxWidth: 600 }}>
          {p2Interpretation[subTier]}
        </p>

        {/* Bottom takeaway */}
        <div style={{ backgroundColor: B.bone, border: "1px solid rgba(14,26,43,0.06)", borderLeft: `3px solid ${B.purple}`, borderRadius: 4, padding: "14px 18px" }}>
          <div style={{ ...T.overline, color: B.teal, marginBottom: 6 }}>BOTTOM LINE</div>
          <p style={{ ...T.body, color: B.navy, margin: 0, fontWeight: 500 }}>
            {p2BottomLine[subTier]}
          </p>
        </div>

        <PageFooter section="What This Score Means" page={2} />
      </ReportPage>


      {/* ---- PAGE 3 — Where is the structure exposed? ---- */}
      <ReportPage record={record}>
        <ReportHeader />
        <h1 style={{ ...T.pageTitle, marginBottom: 12 }}>Your Biggest Risks</h1>
        <p style={{ ...T.body, color: B.muted, marginBottom: 24, maxWidth: 540 }}>
          {p3Intro[subTier]}
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
              If the largest income source disappeared tomorrow, the score would likely fall to {Math.max(0, record.risk_scenario_score)}. This shows that the structure still depends too heavily on that one source.
            </p>
          </div>
          <div style={{ flex: 2, backgroundColor: B.bone, border: "1px solid rgba(14,26,43,0.06)", borderRadius: 4, padding: "16px 20px" }}>
            <Overline>HOW LONG INCOME WOULD CONTINUE IF WORK STOPPED</Overline>
            <div style={{ fontSize: 22, fontWeight: 600, color: B.navy, marginBottom: 4 }}>
              Estimated: {continuityDisplay}
            </div>
            <p style={{ ...T.small, color: B.muted, margin: 0 }}>
              Based on the current structure, income would likely continue for about {continuityDisplay} if active work stopped. Longer is better.
            </p>
          </div>
        </div>

        {/* Stress scenarios — top 3, clear layout */}
        {v2Scenarios && v2Scenarios.length > 0 && (
          <div style={{ marginBottom: 20 }}>
            <Overline>WHAT COULD HURT YOUR SCORE MOST</Overline>
            {[...v2Scenarios].sort((a, b) => b.score_drop - a.score_drop).slice(0, 3).map((s) => {
              const scenarioPlain: Record<string, string> = {
                active_labor_interrupted: "You cannot work for 90 days",
                platform_dependency_shock: "A platform or channel you rely on changes suddenly",
                forward_commitments_delayed: "Expected income gets delayed by several months",
                client_concentration_loss: "Your largest client or contract ends unexpectedly",
                market_contraction: "Your industry slows down significantly",
                regulatory_disruption: "Rules or regulations change in your field",
                revenue_model_disruption: "Your main way of earning income stops working",
                high_volatility_month: "You experience a month with very low income",
                seasonal_revenue_gap: "A seasonal gap significantly reduces income",
                key_client_loss: "A key client or contract ends unexpectedly",
                pricing_pressure: "Pricing pressure reduces what you earn per unit of work",
                recurring_stream_degrades: "A recurring income stream weakens or stops renewing",
                referral_pipeline_dries: "Your referral or lead pipeline dries up",
                contract_non_renewal: "A major contract is not renewed",
                scope_reduction: "A key client reduces the scope of your work",
              };
              // Normalize: try ID match, then label match via replace chain
              const title = scenarioPlain[s.scenario_id] ?? s.label
                .replace(/^Active Labor Interrupted$/i, "You cannot work for 90 days")
                .replace(/^Platform Dependency Shock$/i, "A platform or channel you rely on changes suddenly")
                .replace(/^Forward Commitments Delayed$/i, "Expected income gets delayed by several months")
                .replace(/^High Volatility Month$/i, "You experience a month with very low income")
                .replace(/^Client Concentration Loss$/i, "Your largest client or contract ends unexpectedly")
                .replace(/^Market Contraction$/i, "Your industry slows down significantly")
                .replace(/^Revenue Model Disruption$/i, "Your main way of earning income stops working")
                .replace(/^Seasonal Revenue Gap$/i, "A seasonal gap significantly reduces income")
                .replace(/^Key Client Loss$/i, "A key client or contract ends unexpectedly")
                .replace(/^Regulatory Disruption$/i, "Rules or regulations change in your field")
                .replace(/^Pricing Pressure$/i, "Pricing pressure reduces what you earn per unit of work")
                .replace(/^Recurring Stream Degrades$/i, "A recurring income stream weakens or stops renewing")
                .replace(/^Referral Pipeline Dries$/i, "Your referral or lead pipeline dries up")
                .replace(/^Contract Non.?Renewal$/i, "A major contract is not renewed")
                .replace(/^Scope Reduction$/i, "A key client reduces the scope of your work");
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
                  <div style={{ paddingLeft: 70 }}>
                    <p style={{ ...T.small, color: B.muted, margin: 0 }}>
                      {s.scenario_score <= 0 ? "This would effectively collapse the structure's protection." : s.band_shift ? "This would materially weaken the structure and move it into a lower stability band." : s.score_drop > 10 ? "This would meaningfully weaken the current level of protection." : s.score_drop > 5 ? "This would noticeably reduce the structure's current protection." : "This would have a limited but real impact on the structure."}
                    </p>
                  </div>
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
        <div style={{ display: "flex", gap: 24, marginBottom: 20 }}>
          {[
            { label: "Requires daily work to earn", pct: record.active_income_level, color: B.ink },
            { label: "Repeats on a recurring basis", pct: record.semi_persistent_income_level, color: B.taupe },
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

        {/* Peer band distribution */}
        {v2Benchmarks && (
          <div style={{ marginBottom: 16 }}>
            <div style={{ ...T.overline, color: B.taupe, marginBottom: 8 }}>WHERE YOUR PEERS LAND</div>
            <div style={{ display: "flex", gap: 2, height: 8, marginBottom: 8 }}>
              {[
                { pct: v2Benchmarks.peer_band_distribution.limited, color: B.bandLimited, t: "limited" },
                { pct: v2Benchmarks.peer_band_distribution.developing, color: B.bandDeveloping, t: "developing" },
                { pct: v2Benchmarks.peer_band_distribution.established, color: B.bandEstablished, t: "established" },
                { pct: v2Benchmarks.peer_band_distribution.high, color: B.bandHigh, t: "high" },
              ].map((seg, i) => (
                <div key={i} style={{ width: `${seg.pct}%`, backgroundColor: seg.color, borderRadius: i === 0 ? "3px 0 0 3px" : i === 3 ? "0 3px 3px 0" : 0, opacity: tier === seg.t ? 1 : 0.3 }} />
              ))}
            </div>
            <div style={{ display: "flex", gap: 2, marginBottom: 12 }}>
              {[
                { pct: v2Benchmarks.peer_band_distribution.limited, label: "Limited", color: B.bandLimited },
                { pct: v2Benchmarks.peer_band_distribution.developing, label: "Developing", color: B.bandDeveloping },
                { pct: v2Benchmarks.peer_band_distribution.established, label: "Established", color: B.bandEstablished },
                { pct: v2Benchmarks.peer_band_distribution.high, label: "High", color: B.bandHigh },
              ].map((seg) => (
                <div key={seg.label} style={{ flex: 1, ...T.meta, color: B.muted }}><span style={{ color: seg.color, fontWeight: 600 }}>{seg.pct}%</span> {seg.label}</div>
              ))}
            </div>

            {/* Outlier dimensions — top 3 */}
            {v2Benchmarks.outlier_dimensions.length > 0 && (
              <div style={{ marginBottom: 12 }}>
                {v2Benchmarks.outlier_dimensions.slice(0, 3).map((d) => (
                  <div key={d.factor} style={{ ...T.meta, color: B.ink, display: "flex", justifyContent: "space-between", marginBottom: 3 }}>
                    <span>{(() => {
                      const peerLabel: Record<string, string> = {
                        income_persistence: "Income that continues if work stops",
                        forward_revenue_visibility: "Income secured ahead of time",
                        concentration_resilience: "Reliance on one source",
                        income_source_diversity: "Number of income sources",
                        labor_dependence: "Dependence on daily work",
                        earnings_stability: "Month-to-month earnings stability",
                      };
                      return peerLabel[d.factor.toLowerCase().replace(/ /g, "_")] ?? d.factor;
                    })()}</span>
                    <span style={{ fontWeight: 600, color: d.direction === "above" ? B.teal : B.bandLimited }}>
                      {d.direction === "above" ? "▲ above peers" : "▲ below peers"}
                    </span>
                  </div>
                ))}
              </div>
            )}
            <p style={{ ...T.meta, color: B.muted, margin: 0, fontStyle: "italic" }}>
              {({
                A1: `Compared with peers, ${name} is currently well below benchmark in several protection areas.`,
                A2: `Compared with peers, ${name} is below benchmark in several areas that matter for stability.`,
                A3: `Compared with peers, ${name} is still behind in several important stability areas.`,
                B1: `Compared with peers, ${name} is improving, but still trails the benchmark in important areas.`,
                B2: `Compared with peers, ${name} is close to the middle in some areas, but still below benchmark in others.`,
                C1: `Compared with peers, ${name} is around or above benchmark in some areas, but still weaker in others.`,
                C2: `Compared with peers, ${name} is performing solidly, with only a few remaining areas below benchmark.`,
                D1: `Compared with peers, ${name} is performing strongly across most areas.`,
                D2: `Compared with peers, ${name} is performing at a very high level across the benchmark.`,
              })[subTier]}
            </p>
          </div>
        )}


        <PageFooter section="Your Biggest Risks" page={3} />
      </ReportPage>


      {/* ---- PAGE 4 — What would improve it? ---- */}
      <ReportPage record={record}>
        <ReportHeader />
        <h1 style={{ ...T.pageTitle, marginBottom: 12 }}>How to Raise Your Score</h1>
        <p style={{ ...T.body, color: B.muted, marginBottom: 24, maxWidth: 540 }}>
          The fastest way to raise this score is not just to work more. It is to improve how the income is structured — with more income secured ahead of time, less dependence on one source, and more income that continues without daily effort.
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
            <p style={{ ...T.small, color: B.muted, marginBottom: 12, maxWidth: 520 }}>
              These are the changes that would likely raise your score the most, based on how your income is currently structured.
            </p>
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
                  { key: "forward_visibility", title: "Secure more income ahead of time", copy: "Add income that is already committed before the month begins. Examples include retainers, multi-month agreements, advance bookings, or recurring contracts." },
                  { key: "source_concentration", title: "Reduce reliance on the largest source", copy: "Strengthen one or more additional dependable sources so the structure is not overly exposed to a single client or channel." },
                  { key: "labor_dependence", title: "Build more income that repeats or continues without daily work", copy: "Shift part of one-time work into income that repeats, renews, or continues without needing to be rebuilt each time." },
                  { key: "low_continuity", title: "Increase how long income would continue if work stopped", copy: "Build more income that can keep coming in for a period of time even if daily work slows down or stops." },
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
                {action.why && <p style={{ ...T.meta, color: B.teal, margin: "4px 0 0", fontStyle: "italic" }}>{action.why}</p>}
              </div>
            </div>
          ))}
        </div>

        {/* What NOT to do — compact dash list */}
        {((v2AvoidActions && v2AvoidActions.length > 0) || (olAvoid && olAvoid.length > 0)) && (
          <div style={{ marginBottom: 16 }}>
            <div style={{ ...T.overline, color: B.taupe, marginBottom: 6 }}>WHAT NOT TO DO</div>
            {(v2AvoidActions ?? []).map((a) => (
              <div key={a.action_id} style={{ ...T.meta, color: B.ink, display: "flex", gap: 6, marginBottom: 4 }}>
                <span style={{ color: B.taupe }}>—</span>
                <span><span style={{ fontWeight: 500 }}>{a.label}:</span> {a.reason}</span>
              </div>
            ))}
            {(olAvoid ?? []).map((text) => (
              <div key={text} style={{ ...T.meta, color: B.ink, display: "flex", gap: 6, marginBottom: 4 }}>
                <span style={{ color: B.taupe }}>—</span>
                <span>{text}</span>
              </div>
            ))}
          </div>
        )}


        <PageFooter section="How to Raise Your Score" page={4} />
      </ReportPage>


      {/* ---- PAGE 5 — What do I do next? ---- */}
      <ReportPage record={record}>
        <ReportHeader />
        <h1 style={{ ...T.pageTitle, marginBottom: 16 }}>What to Do Next</h1>

        <p style={{ ...T.body, color: B.muted, marginBottom: 24, maxWidth: 540, lineHeight: 1.6 }}>
          {p5Intro[subTier]}
        </p>

        {/* Two columns: 5 actions + 4 avoid — side by side */}
        <div style={{ display: "flex", gap: 24, marginBottom: 24 }}>
          <div style={{ flex: 1 }}>
            <div style={{ ...T.sectionLabel, color: B.navy, marginBottom: 8 }}>What to do next</div>
            {(({
              source_concentration: [
                "Reduce how much the structure depends on the single largest source",
                "Lock in at least one income source committed for more than one month",
                "Build more income that repeats or continues without daily work",
                "Know more of next month\u2019s income before the month begins",
                "Reassess only after these changes are actually live, not just planned",
              ],
              forward_visibility: [
                "Lock in at least one income source that is committed for more than one month",
                "Reduce how much the structure depends on the single largest source",
                "Build more income that repeats or continues without daily work",
                "Know more of next month\u2019s income before the month begins",
                "Reassess only after these changes are actually live, not just planned",
              ],
              labor_dependence: [
                "Build more income that repeats or continues without daily work",
                "Lock in at least one income source committed for more than one month",
                "Reduce how much the structure depends on the single largest source",
                "Know more of next month\u2019s income before the month begins",
                "Reassess only after these changes are actually live, not just planned",
              ],
              low_continuity: [
                "Build income that would continue for longer if active work stopped",
                "Lock in at least one income source committed for more than one month",
                "Reduce how much the structure depends on the single largest source",
                "Know more of next month\u2019s income before the month begins",
                "Reassess only after these changes are actually live, not just planned",
              ],
              few_sources: [
                "Add at least one additional dependable income source",
                "Lock in at least one income source committed for more than one month",
                "Build more income that repeats or continues without daily work",
                "Know more of next month\u2019s income before the month begins",
                "Reassess only after these changes are actually live, not just planned",
              ],
            })[dominantConstraint]).map((item, i) => (
              <div key={i} style={{ ...T.small, color: B.ink, display: "flex", gap: 8, marginBottom: 5 }}>
                <span style={{ color: B.purple, fontWeight: 600, flexShrink: 0 }}>{i + 1}.</span>{item}
              </div>
            ))}
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ ...T.sectionLabel, color: B.navy, marginBottom: 8 }}>What not to prioritize yet</div>
            {[
              "Working more without improving the structure underneath it",
              "Short bursts of output that do not improve durability",
              "Temporary spikes that disappear when work stops",
              "Measures that do not improve how long income continues or how much is secured ahead of time",
            ].map((item) => (
              <div key={item} style={{ ...T.small, color: B.muted, display: "flex", gap: 8, marginBottom: 5 }}>
                <span style={{ color: B.taupe }}>—</span>{item}
              </div>
            ))}
          </div>
        </div>

        {/* 90-Day Checklist */}
        <Overline>YOUR 90-DAY ACTION PLAN</Overline>
        <div style={{ display: "flex", flexDirection: "column", marginBottom: 20 }}>
          {[
            "Create one offer, agreement, or revenue stream that secures income ahead for more than one month.",
            "Identify the largest source and reduce how much the structure depends on it.",
            "Add one income stream that repeats or continues without daily work.",
            "Know more of next month\u2019s income before the month begins.",
            "Reassess only after the structural changes are active, not just planned.",
          ].map((row, i) => (
            <div key={i} style={{ display: "flex", gap: 12, alignItems: "flex-start", padding: "10px 0", borderBottom: `1px solid ${B.stone}` }}>
              <div style={{ width: 14, height: 14, borderRadius: "50%", border: `1.5px solid ${B.stone}`, flexShrink: 0, marginTop: 2 }} />
              <span style={{ ...T.small, color: B.ink }}>{row}</span>
            </div>
          ))}
        </div>

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

        {/* Benchmark context — only if data available */}
        {(v2Benchmarks || olBenchmark) && (
          <div style={{ display: "flex", gap: 12, marginBottom: 16 }}>
            <div style={{ flex: 1, backgroundColor: B.bone, border: "1px solid rgba(14,26,43,0.06)", borderRadius: 4, padding: "14px 18px" }}>
              <Overline>HOW YOU COMPARE</Overline>
              {v2Benchmarks && (
                <>
                <div style={{ display: "flex", flexDirection: "column", gap: 3 }}>
                  <div style={{ ...T.small, color: B.ink }}>Peer average: <span style={{ fontWeight: 600 }}>{v2Benchmarks.cluster_average_score}</span></div>
                  <div style={{ ...T.small, color: B.ink }}>Top 20% threshold: <span style={{ fontWeight: 600 }}>{v2Benchmarks.top_20_threshold}</span></div>
                  <div style={{ ...T.small, color: B.ink }}>Your percentile: <span style={{ fontWeight: 600, color: B.purple }}>{record.peer_stability_percentile_label || `${v2Benchmarks.peer_percentile}th`}</span></div>
                </div>
                <p style={{ ...T.meta, color: B.muted, margin: "10px 0 0", fontStyle: "italic" }}>{p5CompareInterpretation}</p>
                </>
              )}
              {olBenchmark && <p style={{ ...T.meta, color: B.muted, margin: "8px 0 0", fontStyle: "italic" }}>{olBenchmark.framing_text}</p>}
            </div>
            {olBenchmark && (olBenchmark.common_strengths?.length > 0 || olBenchmark.common_weaknesses?.length > 0) && (
              <div style={{ flex: 1, backgroundColor: B.bone, border: "1px solid rgba(14,26,43,0.06)", borderRadius: 4, padding: "14px 18px" }}>
                <Overline>TYPICAL PATTERNS IN YOUR PEER GROUP</Overline>
                {olBenchmark.common_strengths?.length > 0 && (
                  <>
                    <div style={{ ...T.meta, color: B.teal, fontWeight: 500, marginBottom: 2 }}>Common strengths:</div>
                    {olBenchmark.common_strengths.slice(0, 3).map((s) => (
                      <div key={s} style={{ ...T.meta, color: B.muted, marginBottom: 2 }}>— {s}</div>
                    ))}
                  </>
                )}
                {olBenchmark.common_weaknesses?.length > 0 && (
                  <>
                    <div style={{ ...T.meta, color: B.bandDeveloping, fontWeight: 500, marginTop: 6, marginBottom: 2 }}>Common gaps:</div>
                    {olBenchmark.common_weaknesses.slice(0, 3).map((w) => (
                      <div key={w} style={{ ...T.meta, color: B.muted, marginBottom: 2 }}>— {w}</div>
                    ))}
                  </>
                )}
              </div>
            )}
          </div>
        )}

        <p style={{ ...T.meta, color: B.taupe, lineHeight: 1.5, margin: 0, fontStyle: "italic" }}>
          The Income Stability Score is a present-state income stability assessment based on information provided by the user. It does not provide financial advice and does not predict future financial outcomes. This report reflects a present-state structural interpretation under the RunPayway framework.
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
