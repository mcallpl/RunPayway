"use client";

import { useEffect, useState, useRef, Component, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { useAssessmentServer } from "@/lib/monitoring";
import { useLanguage } from "@/lib/i18n";

// ============================================================
// ERROR BOUNDARY — catches rendering crashes gracefully
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
            style={{ padding: "10px 24px", fontSize: 14, fontWeight: 500, color: "#fff", backgroundColor: "#0E1A2B", border: "none", borderRadius: 6, cursor: "pointer" }}
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
// SAFE JSON PARSE — prevents crashes from missing/corrupt payloads
// ============================================================
function safeJsonParse<T>(json: string | undefined | null, fallback: T): T {
  if (!json) return fallback;
  try {
    return JSON.parse(json);
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
  constraint_guidance_payload: string;
  structural_improvement_path_text: string;
  action_plan_payload: string;
  peer_stability_percentile: number;
  peer_stability_percentile_label: string;
  projected_final_score: number;
  projected_stability_band: string;
  registry_visibility: string;
  // Income continuity estimate
  income_continuity_pct: number;
  income_continuity_months: number;
  income_continuity_text: string;
  // Risk scenario
  risk_scenario_score: number;
  risk_scenario_band: string;
  risk_scenario_drop: number;
  risk_scenario_text: string;
  // Advisor tools
  advisor_discussion_guide_payload: string;
  product_recommendations_payload: string;
}

// ============================================================
// BRAND
// ============================================================
const B = {
  navy: "#0E1A2B",
  purple: "#4B3FAE",
  teal: "#1F6D7A",
  sand: "#F4F1EA",
  sandDk: "#EDE9E0",
  muted: "#6B7280",
  light: "#9CA3AF",
  gradient: "linear-gradient(135deg, #0E1A2B 0%, #4B3FAE 50%, #1F6D7A 100%)",
};

// ============================================================
// HELPERS
// ============================================================

function subjectName(r: AssessmentRecord): string {
  return r.assessment_title || "this income system";
}

function subjectPossessive(r: AssessmentRecord): string {
  const name = subjectName(r);
  if (name === "this income system") return "this income system\u2019s";
  return name.endsWith("s") ? `${name}\u2019` : `${name}\u2019s`;
}

function indicatorStrengthSummary(r: AssessmentRecord, rt: typeof import("@/lib/i18n/en").en.report): string {
  const labels = [
    r.income_persistence_label,
    r.income_source_diversity_label,
    r.forward_revenue_visibility_label,
    r.income_variability_label,
    r.active_labor_dependence_label,
    r.exposure_concentration_label,
  ];
  const strong = labels.filter((l) => /high|very high/i.test(l)).length;
  const moderate = labels.filter((l) => /moderate/i.test(l)).length;
  if (strong >= 4) return rt.strengthMany;
  if (strong >= 2) return rt.strengthSome;
  if (moderate >= 3) return rt.moderateResults;
  return rt.earlyStage;
}

function activeIncomeDependence(r: AssessmentRecord, rt: typeof import("@/lib/i18n/en").en.report): string {
  if (r.active_income_level >= 75) return rt.activeWork;
  if (r.active_income_level >= 50) return rt.mixActiveRecurring;
  return rt.mixAll;
}

function percentileExplanation(r: AssessmentRecord, rt: typeof import("@/lib/i18n/en").en.report): string {
  const p = r.peer_stability_percentile;
  const label = r.peer_stability_percentile_label;
  const name = subjectName(r);
  if (p >= 75) return `${name} ${rt.percentileAbove} ${r.industry_sector}.`;
  if (p >= 50) return `${name} ${rt.percentileAverage} ${r.industry_sector}.`;
  return `${name} ${rt.percentileBelow} ${r.industry_sector}.`;
}

function getIndustryBenchmark(finalScore: number, sectorAvg?: number, sectorTop20?: number) {
  const avgScore = sectorAvg ?? 48;
  const top20Range = sectorTop20 ?? 65;
  const distance = Math.max(0, top20Range - finalScore);
  return { avgScore, top20Range, distance };
}

function getRiskExposure(rt: typeof import("@/lib/i18n/en").en.report): Record<string, { mechanism: string; impact: string }> {
  return {
    "Income Continuity Without Active Labor": { mechanism: rt.riskContinuityMech, impact: rt.riskContinuityImpact },
    "Recurring Revenue Base": { mechanism: rt.riskRecurringMech, impact: rt.riskRecurringImpact },
    "Forward Revenue Visibility": { mechanism: rt.riskVisibilityMech, impact: rt.riskVisibilityImpact },
    "Income Concentration": { mechanism: rt.riskConcentrationMech, impact: rt.riskConcentrationImpact },
    "Income Source Count": { mechanism: rt.riskSourceCountMech, impact: rt.riskSourceCountImpact },
    "Earnings Variability": { mechanism: rt.riskVariabilityMech, impact: rt.riskVariabilityImpact },
  };
}

// Rank all 6 factors from strongest to weakest (labels only — no raw values exposed)
function getRankedFactors(r: AssessmentRecord): { label: string; level: string }[] {
  const LEVEL_ORDER: Record<string, number> = { "Very High": 5, "High": 4, "Moderate": 3, "Low": 2, "Very Low": 1 };
  const factors = [
    { label: "Income Persistence", level: r.income_persistence_label, inverted: false },
    { label: "Income Source Diversity", level: r.income_source_diversity_label, inverted: false },
    { label: "Forward Revenue Visibility", level: r.forward_revenue_visibility_label, inverted: false },
    { label: "Monthly Income Consistency", level: r.income_variability_label, inverted: true },
    { label: "Active Labor Independence", level: r.active_labor_dependence_label, inverted: true },
    { label: "Source Diversification", level: r.exposure_concentration_label, inverted: true },
  ];
  return factors
    .map((f) => {
      const raw = LEVEL_ORDER[f.level] || 3;
      const strength = f.inverted ? 6 - raw : raw;
      const displayLevel = f.inverted
        ? (raw <= 2 ? "Strong" : raw === 3 ? "Moderate" : "Weak")
        : (raw >= 4 ? "Strong" : raw === 3 ? "Moderate" : "Weak");
      return { label: f.label, level: displayLevel, _strength: strength };
    })
    .sort((a, b) => b._strength - a._strength)
    .map(({ label, level }) => ({ label, level }));
}

// Identify key positive/negative factors for Page 1
function getKeyFactors(r: AssessmentRecord): { positive: string[]; risks: string[] } {
  const factors = [
    { label: "Income Persistence", value: r.income_persistence_label, inverted: false },
    { label: "Income Source Diversity", value: r.income_source_diversity_label, inverted: false },
    { label: "Forward Revenue Visibility", value: r.forward_revenue_visibility_label, inverted: false },
    { label: "Monthly Income Variability", value: r.income_variability_label, inverted: true },
    { label: "Active Labor Independence", value: r.active_labor_dependence_label, inverted: true },
    { label: "Source Concentration", value: r.exposure_concentration_label, inverted: true },
  ];
  const positive: string[] = [];
  const risks: string[] = [];
  for (const f of factors) {
    const isHigh = /high|very high/i.test(f.value);
    const isLow = /low|very low/i.test(f.value);
    if (f.inverted) {
      if (isLow) positive.push(f.label);
      else if (isHigh) risks.push(f.label);
    } else {
      if (isHigh) positive.push(f.label);
      else if (isLow) risks.push(f.label);
    }
  }
  // Backfill with moderates — ensure at least 3 in each column
  const used = new Set([...positive, ...risks]);
  if (positive.length < 3) {
    for (const f of factors) {
      if (/moderate/i.test(f.value) && !used.has(f.label) && positive.length < 3) {
        positive.push(f.label);
        used.add(f.label);
      }
    }
  }
  if (risks.length < 3) {
    for (const f of factors) {
      if (/moderate/i.test(f.value) && !used.has(f.label) && risks.length < 3) {
        risks.push(f.label);
        used.add(f.label);
      }
    }
  }
  return { positive: positive.slice(0, 3), risks: risks.slice(0, 3) };
}

// ============================================================
// REPORT SPACING TOKENS — enterprise-grade, PDF-safe
// ============================================================
const R = {
  pagePad:    40,
  headerMb:   20,
  sectionGap: 18,
  labelMb:    8,
  paraMb:     10,
  itemGap:    7,
  dividerMy:  16,
  footerMt:   18,
};

const T = {
  score:      { fontSize: 48, fontWeight: 700, lineHeight: 1 },
  pageTitle:  { fontSize: 14, fontWeight: 600, lineHeight: 1.3, letterSpacing: "0.1em", textTransform: "uppercase" as const },
  band:       { fontSize: 15, fontWeight: 600, lineHeight: 1.3 },
  body:       { fontSize: 12.5, fontWeight: 400, lineHeight: 1.6 },
  small:      { fontSize: 11, fontWeight: 400, lineHeight: 1.5 },
  label:      { fontSize: 10, fontWeight: 600, lineHeight: 1.3, letterSpacing: "0.12em", textTransform: "uppercase" as const },
  caption:    { fontSize: 10, fontWeight: 400, lineHeight: 1.5 },
  micro:      { fontSize: 9, fontWeight: 600, lineHeight: 1.3 },
};

// ── PDF page dimensions ──
// Letter = 8.5×11 in. Capture at 800px wide = 7.7" content area.
// Each "page" on screen targets this aspect ratio so preview matches PDF.
const PDF = {
  captureW: 800,
  scale: 2,
  pageW: 8.5,
  pageH: 11,
  margin: 0.4,
  footer: 0.5,
  get contentW() { return this.pageW - 2 * this.margin; },   // 7.7"
  get contentH() { return this.pageH - this.margin - this.footer; }, // 10.1"
  get canvasW() { return this.captureW * this.scale; },       // 1600px
  get pxPerInch() { return this.canvasW / this.contentW; },   // ~207.8
  get sliceH() { return Math.floor(this.contentH * this.pxPerInch); }, // ~2099px per page
  // Target height for on-screen preview (content inside padding)
  get previewH() { return Math.round(this.captureW * (this.pageH / this.pageW)); }, // ~1035px
};

// ============================================================
// LAYOUT COMPONENTS
// ============================================================

function ReportHeader({ record, pageLabel }: { record: AssessmentRecord; pageLabel?: string }) {
  const ts = record.issued_timestamp_utc || record.assessment_date_utc;
  return (
    <div style={{ marginBottom: R.headerMb }}>
      <div style={{ height: 3, borderRadius: "6px 6px 0 0", overflow: "hidden", background: B.gradient, margin: `-${R.pagePad}px -${R.pagePad}px 0` }} />
      <div style={{ paddingTop: 12, paddingBottom: 10, borderBottom: `1px solid ${B.sandDk}` }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/runpayway-logo-full.png" alt="RunPayway" style={{ height: 18, width: "auto" }} />
            <span style={{ ...T.caption, color: B.light }}>Income Stability Assessment · Model RP-1.0</span>
          </div>
          <div style={{ ...T.caption, color: B.light, textAlign: "right" }}>
            {pageLabel && <div style={{ fontWeight: 500, color: B.muted, marginBottom: 1 }}>{pageLabel}</div>}
            <div>{record.record_id.slice(0, 8)}… · {ts}</div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Label({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ ...T.label, color: B.muted, marginBottom: R.labelMb }}>{children}</div>
  );
}

function SectionDivider() {
  return <div style={{ height: 1, backgroundColor: B.navy, opacity: 0.08, marginTop: R.dividerMy, marginBottom: R.dividerMy }} />;
}

function ConfidentialityFooter({ record }: { record: AssessmentRecord }) {
  return (
    <div className="report-page-footer" style={{ marginTop: "auto", paddingTop: R.paraMb, borderTop: `1px solid ${B.sandDk}`, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
      <span style={{ ...T.caption, color: B.light, fontStyle: "italic" }}>
        Confidential — Prepared for {record.assessment_title || "Assessment Subject"}
      </span>
      <span style={{ ...T.caption, color: B.light }}>
        RunPayway™ · support@runpayway.com
      </span>
    </div>
  );
}

function ReportPage({ record, children, pageLabel }: { record: AssessmentRecord; children: React.ReactNode; pageLabel?: string }) {
  return (
    <div className="report-page" style={{
      width: PDF.captureW,
      maxWidth: "100%",
      minHeight: PDF.previewH,
      backgroundColor: "#ffffff",
      border: "1px solid #E5E7EB",
      borderRadius: 6,
      padding: R.pagePad,
      boxSizing: "border-box",
      display: "flex",
      flexDirection: "column",
      overflow: "visible",
      boxShadow: "0 2px 16px rgba(14,26,43,0.06), 0 1px 4px rgba(14,26,43,0.04)",
    }}>
      <ReportHeader record={record} pageLabel={pageLabel} />
      <div style={{ flex: 1 }}>{children}</div>
      <ConfidentialityFooter record={record} />
    </div>
  );
}

// ── Radar Chart for 6 structural factors (SVG) ──
function RadarChart({ factors }: { factors: { label: string; value: number }[] }) {
  const cx = 120, cy = 110, r = 85;
  const n = factors.length;
  const angleStep = (2 * Math.PI) / n;
  const startAngle = -Math.PI / 2;

  const getPoint = (i: number, pct: number) => {
    const angle = startAngle + i * angleStep;
    return { x: cx + r * pct * Math.cos(angle), y: cy + r * pct * Math.sin(angle) };
  };

  // Grid rings
  const rings = [0.25, 0.5, 0.75, 1.0];
  // Data polygon
  const dataPoints = factors.map((f, i) => getPoint(i, f.value / 100));
  const dataPath = dataPoints.map((p, i) => `${i === 0 ? "M" : "L"}${p.x},${p.y}`).join(" ") + "Z";

  return (
    <svg width={240} height={230} viewBox="0 0 240 230" style={{ display: "block" }} role="img" aria-label="Structural factor radar chart showing strength across 6 income stability dimensions">
      {/* Grid rings */}
      {rings.map((pct) => {
        const pts = Array.from({ length: n }, (_, i) => getPoint(i, pct));
        const path = pts.map((p, i) => `${i === 0 ? "M" : "L"}${p.x},${p.y}`).join(" ") + "Z";
        return <path key={pct} d={path} fill="none" stroke={B.sandDk} strokeWidth={0.75} />;
      })}
      {/* Axis lines */}
      {factors.map((_, i) => {
        const p = getPoint(i, 1);
        return <line key={i} x1={cx} y1={cy} x2={p.x} y2={p.y} stroke={B.sandDk} strokeWidth={0.5} />;
      })}
      {/* Data polygon */}
      <path d={dataPath} fill="rgba(31,109,122,0.12)" stroke={B.teal} strokeWidth={1.5} />
      {/* Data points */}
      {dataPoints.map((p, i) => (
        <circle key={i} cx={p.x} cy={p.y} r={3} fill={B.teal} />
      ))}
      {/* Labels */}
      {factors.map((f, i) => {
        const p = getPoint(i, 1.22);
        const anchor = p.x < cx - 10 ? "end" : p.x > cx + 10 ? "start" : "middle";
        return (
          <text key={i} x={p.x} y={p.y} textAnchor={anchor} dominantBaseline="central"
            style={{ fontSize: 8, fontWeight: 500, fill: B.muted }}>
            {f.label}
          </text>
        );
      })}
    </svg>
  );
}

// ── QR Code component (uses qrcode package) ──
function QRCodeImage({ recordId }: { recordId: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    import("qrcode").then((QRCode) => {
      QRCode.toCanvas(canvas, `https://runpayway.com/verify?id=${recordId}`, {
        width: 72,
        margin: 0,
        color: { dark: "#0E1A2B", light: "#FFFFFF" },
      });
    }).catch(() => {
      // QR code library not available — leave canvas empty
    });
  }, [recordId]);

  return <canvas ref={canvasRef} width={72} height={72} style={{ width: 72, height: 72, borderRadius: 4 }} />;
}

// ── Score trend for monitoring plan users ──
function ScoreTrend({ currentScore, records }: { currentScore: number; records: Array<{ final_score: number; assessment_date_utc: string }> }) {
  if (records.length < 2) return null;
  const sorted = [...records].sort((a, b) => a.assessment_date_utc.localeCompare(b.assessment_date_utc));
  const prev = sorted[sorted.length - 2];
  const diff = currentScore - prev.final_score;
  const arrow = diff > 0 ? "\u2191" : diff < 0 ? "\u2193" : "\u2192";
  const color = diff > 0 ? B.teal : diff < 0 ? "#DC2626" : B.muted;

  return (
    <div aria-label={`Score ${diff > 0 ? "increased" : diff < 0 ? "decreased" : "unchanged"} by ${Math.abs(diff)} points`} style={{
      display: "inline-flex", alignItems: "center", gap: 6,
      padding: "4px 10px", borderRadius: 6, backgroundColor: `${color}10`,
      marginLeft: 12,
    }}>
      <span style={{ fontSize: 14, fontWeight: 700, color }}>{arrow} {diff > 0 ? "+" : ""}{diff}</span>
      <span style={{ ...T.caption, color: B.muted }}>vs prior</span>
    </div>
  );
}

// ============================================================
// PDF DOWNLOAD — smart whitespace-aware slicing
// ============================================================
//
// How it works:
//   1. Each .report-page is captured at full natural height
//   2. If it fits in one PDF page, it's placed directly
//   3. If it overflows, the canvas is sliced at WHITESPACE GAPS
//      (not arbitrary pixel positions) so text/charts are never
//      cut in half
//   4. Enterprise overlays are drawn in a second pass
// ============================================================

/** Scan canvas rows near targetY to find a whitespace gap for clean cutting */
function findSafeCutRow(
  canvas: HTMLCanvasElement,
  targetY: number,
  searchRange: number,
): number {
  const width = canvas.width;
  const minY = Math.max(0, targetY - searchRange);
  const maxY = targetY; // only search ABOVE target to prevent page overflow
  const searchHeight = maxY - minY;
  if (searchHeight <= 0) return targetY;

  const ctx = canvas.getContext("2d")!;
  const imageData = ctx.getImageData(0, minY, width, searchHeight);
  const pixels = imageData.data;
  const sampleStep = Math.max(1, Math.floor(width / 80)); // sample ~80 points per row
  const threshold = 4; // allow up to 4 non-white samples (anti-aliasing artifacts)

  // Search from closest-to-target upward — first clean row wins
  for (let offset = 0; offset < searchHeight; offset++) {
    const localRow = searchHeight - 1 - offset;
    let nonWhiteCount = 0;
    const rowStart = localRow * width * 4;

    for (let x = 0; x < width; x += sampleStep) {
      const idx = rowStart + x * 4;
      if (pixels[idx] < 245 || pixels[idx + 1] < 245 || pixels[idx + 2] < 245) {
        nonWhiteCount++;
        if (nonWhiteCount > threshold) break; // skip row early
      }
    }

    if (nonWhiteCount <= threshold) {
      return minY + localRow;
    }
  }

  // No whitespace gap found — fall back to target position
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
    keywords: "income stability, assessment, RunPayway, structural analysis",
    creator: `RunPayway Model ${record.model_version || "RP-1.0"}`,
  });

  const { captureW, scale: S, pageW: PW, pageH: PH, margin: M, footer: FT, contentW: CW, canvasW, pxPerInch, sliceH } = PDF;

  let pdfPageCount = 0;

  for (let i = 0; i < pages.length; i++) {
    const el = pages[i] as HTMLElement;

    // ── Freeze element for capture ──
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

    // Hide HTML footer — PDF gets its own overlay
    const htmlFooter = el.querySelector(".report-page-footer") as HTMLElement | null;
    if (htmlFooter) htmlFooter.style.display = "none";

    // Allow browser reflow
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

    // ── Restore original styles ──
    Object.assign(el.style, saved);
    if (htmlFooter) htmlFooter.style.display = "";

    // ── Smart-slice canvas into page-height strips ──
    const totalCanvasH = canvas.height;
    let currentY = 0;

    while (currentY < totalCanvasH) {
      if (pdfPageCount > 0) pdf.addPage();
      pdfPageCount++;

      let cutY: number;
      const idealCutY = currentY + sliceH;

      if (idealCutY >= totalCanvasH) {
        // Last strip — take whatever remains
        cutY = totalCanvasH;
      } else {
        // Find a whitespace gap near the ideal cut point (search up to 200px above)
        cutY = findSafeCutRow(canvas, idealCutY, 200);
      }

      const srcH = Math.max(1, cutY - currentY);

      // Create sub-canvas for this strip
      const strip = document.createElement("canvas");
      strip.width = canvasW;
      strip.height = srcH;
      const ctx = strip.getContext("2d")!;
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(0, 0, canvasW, srcH);
      ctx.drawImage(canvas, 0, currentY, canvasW, srcH, 0, 0, canvasW, srcH);

      // Place on PDF — exact size, no scaling
      const imgH = srcH / pxPerInch;
      pdf.addImage(strip.toDataURL("image/png"), "PNG", M, M, CW, imgH);

      currentY = cutY;
    }
  }

  // ── Enterprise overlays: confidentiality + page numbers ──
  for (let p = 1; p <= pdfPageCount; p++) {
    pdf.setPage(p);

    // Footer rule
    pdf.setDrawColor(220, 218, 212);
    pdf.setLineWidth(0.004);
    pdf.line(M, PH - FT + 0.05, PW - M, PH - FT + 0.05);

    // Confidentiality
    pdf.setFont("helvetica", "italic");
    pdf.setFontSize(7);
    pdf.setTextColor(156, 163, 175);
    pdf.text(
      `Confidential — Prepared for ${record.assessment_title || "Assessment Subject"}`,
      M,
      PH - FT + 0.2,
    );

    // Support
    pdf.setFont("helvetica", "normal");
    pdf.text("support@runpayway.com", PW - M, PH - FT + 0.2, { align: "right" });

    // Page number
    pdf.setFontSize(7.5);
    pdf.setTextColor(156, 163, 175);
    pdf.text(`Page ${p} of ${pdfPageCount}`, PW / 2, PH - FT + 0.35, { align: "center" });
  }

  // ── Save ──
  const shortId = record.record_id.slice(0, 8);
  pdf.save(`RunPayway-Income-Stability-Report-${shortId}.pdf`);
}


// ============================================================
// MAIN PAGE
// ============================================================

export default function ReviewPage() {
  const router = useRouter();
  const { t } = useLanguage();
  const rt = t.report;
  const [record, setRecord] = useState<AssessmentRecord | null>(null);
  const [downloading, setDownloading] = useState(false);
  const [emailStatus, setEmailStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const monitoringTracked = useRef(false);
  const emailSent = useRef(false);

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

    // Validate critical fields exist
    if (!parsed || !parsed.record_id || typeof parsed.final_score !== "number") {
      router.push("/diagnostic-portal");
      return;
    }

    setRecord(parsed);

    // Persist record for Verify a Score lookup
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

    // Track monitoring assessment usage (once per load)
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

    // Auto-send report via email (once per load)
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

  if (!record) return null;

  const evolutionSteps: string[] = safeJsonParse(record.evolution_path_steps_payload, []);
  const sectorMechanisms: string[] = safeJsonParse(record.sector_mechanisms_payload, []);
  const advisorGuide: { talking_points: string[]; client_questions: string[]; red_flags: string[]; next_steps: string[] } = safeJsonParse(record.advisor_discussion_guide_payload, { talking_points: [], client_questions: [], red_flags: [], next_steps: [] });
  const productRecs: { category: string; rationale: string; urgency: string }[] = safeJsonParse(record.product_recommendations_payload, []);
  const RISK_EXPOSURE = getRiskExposure(rt);
  const riskData = RISK_EXPOSURE[record.primary_constraint_label] || RISK_EXPOSURE["Forward Revenue Visibility"];
  const subject = subjectName(record);
  const possessive = subjectPossessive(record);
  const keyFactors = getKeyFactors(record);
  const rankedFactors = getRankedFactors(record);
  const bench = getIndustryBenchmark(record.final_score, record.sector_avg_score, record.sector_top_20_threshold);
  const evoIdx = evolutionSteps.length > 1 ? Math.round(((record.current_evolution_stage_position || 0) / 100) * (evolutionSteps.length - 1)) : 0;

  const [downloadError, setDownloadError] = useState<string | null>(null);
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

  return (
    <ReportErrorBoundary>
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 40, maxWidth: PDF.captureW + 48, margin: "0 auto", padding: "0 0 40px" }}>
      <div className="no-print" style={{ width: "100%", textAlign: "center" }}>
        <h1 style={{ fontSize: 20, fontWeight: 600, color: B.navy }}>{rt.title}</h1>
        <p style={{ fontSize: 14, color: B.muted, marginTop: 4 }}>{rt.modelVersion}</p>
      </div>

      {/* ==================== COVER PAGE ==================== */}
      <ReportPage record={record}>
        <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", textAlign: "center", padding: "40px 0" }}>
          {/* Logo */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/runpayway-logo-full.png" alt="RunPayway" style={{ height: 36, width: "auto", marginBottom: 40 }} />

          {/* Title */}
          <div style={{ fontSize: 28, fontWeight: 700, color: B.navy, letterSpacing: "-0.02em", marginBottom: 8 }}>
            Income Stability Assessment
          </div>
          <div style={{ fontSize: 14, fontWeight: 500, color: B.teal, letterSpacing: "0.06em", marginBottom: 40 }}>
            Structural Stability Model RP-1.0
          </div>

          {/* Divider */}
          <div style={{ width: 60, height: 2, backgroundColor: B.navy, opacity: 0.12, marginBottom: 40 }} />

          {/* Subject */}
          <div style={{ marginBottom: 32 }}>
            <div style={{ ...T.label, color: B.light, marginBottom: 6 }}>PREPARED FOR</div>
            <div style={{ fontSize: 20, fontWeight: 600, color: B.navy }}>
              {record.assessment_title || "Assessment Subject"}
            </div>
          </div>

          {/* Score preview */}
          <div style={{ display: "flex", alignItems: "baseline", gap: 12, marginBottom: 32 }}>
            <span style={{ fontSize: 56, fontWeight: 700, color: B.navy, lineHeight: 1 }}>{record.final_score}</span>
            <span style={{ fontSize: 18, fontWeight: 600, color: B.teal }}>{record.stability_band}</span>
          </div>

          {/* Meta grid */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 24, maxWidth: 440 }}>
            {[
              ["Record ID", record.record_id.slice(0, 8) + "…"],
              ["Issued", (record.issued_timestamp_utc || record.assessment_date_utc).split("T")[0]],
              ["Industry", record.industry_sector],
            ].map(([label, value]) => (
              <div key={label}>
                <div style={{ ...T.caption, color: B.light, marginBottom: 2 }}>{label}</div>
                <div style={{ ...T.small, fontWeight: 500, color: B.navy }}>{value}</div>
              </div>
            ))}
          </div>

          {/* Table of Contents */}
          <div style={{ width: "100%", maxWidth: 320, textAlign: "left", margin: "0 auto" }}>
            <div style={{ ...T.label, color: B.light, marginBottom: 10 }}>CONTENTS</div>
            {[
              ["1", "Executive Assessment"],
              ["2", "Structural Analysis"],
              ["3", "Diagnosis & Benchmarks"],
              ["4", "Improvement Path"],
              ["5", "Summary & Official Record"],
              ["6", "Advisor Discussion Guide"],
              ["7", "Service Recommendations"],
              ["8", "Client Action Summary"],
            ].map(([num, title]) => (
              <div key={num} style={{ display: "flex", alignItems: "center", gap: 10, padding: "6px 0", borderBottom: "1px solid rgba(14,26,43,0.04)" }}>
                <span style={{ ...T.caption, fontWeight: 600, color: B.teal, minWidth: 16 }}>{num}</span>
                <span style={{ ...T.small, color: B.navy }}>{title}</span>
              </div>
            ))}
          </div>

          {/* Divider */}
          <div style={{ width: 60, height: 2, backgroundColor: B.navy, opacity: 0.12, margin: "32px 0" }} />

          {/* Confidentiality */}
          <div style={{ ...T.caption, color: B.light, maxWidth: 400, lineHeight: 1.6 }}>
            This document is confidential and prepared exclusively for the named recipient.
            Unauthorized distribution is prohibited. Verify authenticity at RunPayway.com/verify.
          </div>
        </div>
      </ReportPage>

      {/* ==================== PAGE 1 — Executive Assessment ==================== */}
      <ReportPage record={record} pageLabel="Page 1 — Executive Assessment">
        {/* Executive summary */}
        <p style={{ ...T.body, color: B.muted, marginBottom: R.sectionGap }}>
          {record.page_1_key_insight_text}
        </p>

        {/* Score presentation */}
        <div style={{ marginBottom: R.sectionGap }}>
          <Label>{rt.scoreLabel}</Label>
          <div style={{ display: "flex", alignItems: "baseline", gap: 16, flexWrap: "wrap" }}>
            <div style={{ ...T.score, color: B.navy }}>
              {record.final_score}
            </div>
            <div style={{ ...T.band, color: B.teal }}>
              {record.stability_band}
            </div>
            {/* Score trend for monitoring plan users */}
            {(() => {
              try {
                if (typeof window === "undefined") return null;
                const allRecords = safeJsonParse<Array<{ final_score: number; assessment_date_utc: string }>>(localStorage.getItem("rp_records"), []);
                if (allRecords.length >= 2) return <ScoreTrend currentScore={record.final_score} records={allRecords} />;
              } catch { /* ignore */ }
              return null;
            })()}
          </div>

          {/* Band interpretation */}
          {record.band_interpretation_text && (
            <p style={{ ...T.small, color: B.muted, marginTop: R.paraMb }}>
              {record.band_interpretation_text}
            </p>
          )}

          {/* Metadata */}
          <div style={{ ...T.caption, color: B.light, marginTop: R.paraMb, display: "flex", flexWrap: "wrap", gap: "0 24px" }}>
            <span>{rt.assessmentId} {record.record_id.slice(0, 8)}…</span>
            <span>{rt.generated} {record.issued_timestamp_utc || record.assessment_date_utc}</span>
            <span>{rt.model}</span>
          </div>
        </div>

        {/* Income Continuity Estimate */}
        {record.income_continuity_text && (
          <div aria-label="Income continuity estimate" style={{
            borderRadius: 8,
            backgroundColor: B.sand,
            padding: "12px 16px",
            marginBottom: R.sectionGap,
          }}>
            <div style={{ display: "flex", alignItems: "baseline", gap: 12, marginBottom: 6 }}>
              <span style={{ fontSize: 24, fontWeight: 700, color: B.navy }}>{record.income_continuity_pct}%</span>
              <span style={{ ...T.small, color: B.muted }}>income continues without active work</span>
            </div>
            <div style={{ display: "flex", alignItems: "baseline", gap: 8, marginBottom: 8 }}>
              <span style={{ fontSize: 18, fontWeight: 600, color: B.teal }}>{record.income_continuity_months} month{record.income_continuity_months !== 1 ? "s" : ""}</span>
              <span style={{ ...T.caption, color: B.muted }}>estimated continuity</span>
            </div>
            <p style={{ ...T.caption, color: B.muted, margin: 0, lineHeight: 1.5 }}>
              {record.income_continuity_text}
            </p>
          </div>
        )}

        {/* Spectrum bar */}
        <div style={{ marginBottom: R.sectionGap }} role="img" aria-label={`Score spectrum showing ${record.final_score} out of 100, classified as ${record.stability_band}`}>
          <div style={{ position: "relative", marginBottom: R.itemGap }}>
            <div style={{ height: 8, borderRadius: 99, background: B.gradient }} />
            {/* Score position marker */}
            <div style={{
              position: "absolute",
              left: `${Math.min(Math.max(record.final_score, 0), 100)}%`,
              top: -3,
              width: 14,
              height: 14,
              borderRadius: 99,
              backgroundColor: "#ffffff",
              border: `2px solid ${B.navy}`,
              transform: "translateX(-50%)",
              boxShadow: "0 1px 3px rgba(0,0,0,0.2)",
            }} />
            {[40, 60, 80].map((pos) => (
              <div key={pos} style={{ position: "absolute", left: `${pos}%`, top: 0, width: 1, height: 8, backgroundColor: "rgba(255,255,255,0.4)" }} />
            ))}
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 2 }}>
            {[
              { label: rt.limited, range: "0\u201339" },
              { label: rt.developing, range: "40\u201359" },
              { label: rt.established, range: "60\u201379" },
              { label: rt.high, range: "80\u2013100" },
            ].map((b) => {
              const isActive = b.label + " Stability" === record.stability_band;
              return (
                <div key={b.label} style={{ textAlign: "center", padding: "4px 2px 3px", borderRadius: 4, border: isActive ? `1.5px solid ${B.navy}` : "1.5px solid transparent", backgroundColor: isActive ? "rgba(14,26,43,0.03)" : "transparent" }}>
                  <div style={{ ...T.micro, fontWeight: isActive ? 700 : T.micro.fontWeight, color: isActive ? B.navy : B.light }}>{b.label}</div>
                  <div style={{ fontSize: 8, fontWeight: isActive ? 600 : 400, color: isActive ? B.navy : B.light }}>{b.range}</div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Percentile */}
        {record.peer_stability_percentile_label && (
          <div style={{ marginBottom: R.sectionGap }}>
            <p style={{ ...T.body, color: B.muted }}>
              <span style={{ fontWeight: 500, color: B.navy }}>{record.peer_stability_percentile_label} percentile</span>{" "}{rt.percentileWithin} {record.industry_sector}
            </p>
            <p style={{ ...T.small, color: B.muted, marginTop: 6 }}>
              {percentileExplanation(record, rt)}
            </p>
          </div>
        )}

        <SectionDivider />

        {/* Profile */}
        <Label>{rt.profile}</Label>
        <dl style={{ ...T.body, display: "grid", gridTemplateColumns: "1fr 1fr", gap: `${R.itemGap}px 24px` }}>
          {record.assessment_title && (
            <div style={{ gridColumn: "1 / -1" }}>
              <dt style={{ display: "inline", color: B.light }}>{rt.assessmentTitle} </dt>
              <dd style={{ display: "inline", fontWeight: 500, color: B.navy }}>{record.assessment_title}</dd>
            </div>
          )}
          {[
            [rt.classification, record.classification],
            [rt.structure, record.operating_structure],
            [rt.incomeModel, record.primary_income_model],
            [rt.revenue, record.revenue_structure],
            [rt.sector, record.industry_sector],
          ].map(([l, v]) => (
            <div key={l}>
              <dt style={{ display: "inline", color: B.light }}>{l}: </dt>
              <dd style={{ display: "inline", fontWeight: 500, color: B.navy }}>{v}</dd>
            </div>
          ))}
        </dl>

        <SectionDivider />

        {/* Key Structural Factors */}
        <Label>{rt.keyFactors} — {subject}</Label>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: R.sectionGap, marginTop: R.paraMb }}>
          <div>
            <div style={{ ...T.label, color: B.teal, marginBottom: R.labelMb }}>
              {rt.positiveFactors}
            </div>
            <ul style={{ display: "flex", flexDirection: "column", gap: R.itemGap }}>
              {keyFactors.positive.map((f) => (
                <li key={f} style={{ ...T.small, color: B.navy, display: "flex", alignItems: "center", gap: 8 }}>
                  <span style={{ width: 4, height: 4, borderRadius: 99, flexShrink: 0, backgroundColor: B.teal }} />
                  {f}
                </li>
              ))}
              {keyFactors.positive.length === 0 && (
                <li style={{ ...T.small, color: B.light }}>{rt.noPositive}</li>
              )}
            </ul>
          </div>
          <div>
            <div style={{ ...T.label, color: B.muted, marginBottom: R.labelMb }}>
              {rt.structuralRisks}
            </div>
            <ul style={{ display: "flex", flexDirection: "column", gap: R.itemGap }}>
              {keyFactors.risks.map((f) => (
                <li key={f} style={{ ...T.small, color: B.navy, display: "flex", alignItems: "center", gap: 8 }}>
                  <span style={{ width: 4, height: 4, borderRadius: 99, flexShrink: 0, backgroundColor: B.light }} />
                  {f}
                </li>
              ))}
              {keyFactors.risks.length === 0 && (
                <li style={{ ...T.small, color: B.light }}>{rt.noRisks}</li>
              )}
            </ul>
          </div>
        </div>

        {/* "What This Means" plain-language callout */}
        <div aria-label="Plain-language score summary" style={{
          borderRadius: 8,
          background: `linear-gradient(135deg, rgba(14,26,43,0.03) 0%, rgba(31,109,122,0.04) 100%)`,
          border: `1px solid rgba(31,109,122,0.10)`,
          padding: "12px 16px",
          marginTop: R.sectionGap,
        }}>
          <div style={{ ...T.caption, fontWeight: 600, color: B.teal, marginBottom: 4 }}>What This Means</div>
          <p style={{ ...T.small, color: B.navy, lineHeight: 1.55, margin: 0 }}>
            {record.final_score >= 80
              ? `${subject} demonstrates high structural income stability. Income systems are well-diversified with strong persistence mechanisms. This income structure would likely maintain significant continuity even during disruptions.`
              : record.final_score >= 60
              ? `${subject} has established meaningful structural stability. Core income mechanisms are functional, though specific areas could be strengthened. The income system shows moderate resilience to disruption.`
              : record.final_score >= 40
              ? `${subject} shows developing stability patterns. The income structure relies heavily on active effort with limited persistence mechanisms. Targeted structural changes could significantly improve resilience.`
              : `${subject} operates with limited structural stability. Income is primarily dependent on continuous active labor with minimal persistence or diversification. Structural improvements are recommended.`}
          </p>
        </div>
      </ReportPage>

      {/* ==================== PAGE 2 — Structural Analysis ==================== */}
      <ReportPage record={record} pageLabel="Page 2 — Structural Analysis">
        <h2 style={{ ...T.pageTitle, color: B.navy, marginBottom: 4 }}>
          {rt.structuralAnalysis}
        </h2>
        <p style={{ ...T.body, color: B.muted, marginBottom: R.sectionGap }}>
          {record.page_2_key_insight_text}
        </p>

        {/* Income Structure Map — color-coded bars */}
        <Label>{rt.incomeStructureMap} — {subject}</Label>
        <p style={{ ...T.small, color: B.muted, marginBottom: R.paraMb }}>
          {possessive} {rt.incomeSources}
        </p>
        <div style={{ display: "flex", flexDirection: "column", gap: R.paraMb }}>
          {[
            { label: rt.activeIncome, value: record.active_income_level, color: B.muted },
            { label: rt.semiPersistent, value: record.semi_persistent_income_level, color: B.teal },
            { label: rt.persistent, value: record.persistent_income_level, color: B.navy },
          ].map((bar) => (
            <div key={bar.label}>
              <div style={{ ...T.small, display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                <span style={{ color: B.muted }}>{bar.label}</span>
                <span style={{ fontWeight: 500, color: B.navy }}>{bar.value}%</span>
              </div>
              <div style={{ height: 10, borderRadius: 99, overflow: "hidden", backgroundColor: B.sand }}>
                <div style={{ height: "100%", borderRadius: 99, width: `${bar.value}%`, backgroundColor: bar.color }} />
              </div>
            </div>
          ))}
        </div>

        <SectionDivider />

        {/* Structural Indicators — radar chart + data grid side by side */}
        <Label>{rt.structuralIndicators}</Label>
        <div style={{ display: "flex", gap: 20, alignItems: "flex-start" }}>
          {/* Radar chart */}
          <div style={{ flexShrink: 0 }}>
            <RadarChart factors={[
              { label: "Persistence", value: { "Very High": 100, "High": 80, "Moderate": 55, "Low": 30, "Very Low": 10 }[record.income_persistence_label] || 50 },
              { label: "Diversification", value: { "Very High": 100, "High": 80, "Moderate": 55, "Low": 30, "Very Low": 10 }[record.income_source_diversity_label] || 50 },
              { label: "Visibility", value: { "Very High": 100, "High": 80, "Moderate": 55, "Low": 30, "Very Low": 10 }[record.forward_revenue_visibility_label] || 50 },
              { label: "Consistency", value: 100 - ({ "Very High": 100, "High": 80, "Moderate": 55, "Low": 30, "Very Low": 10 }[record.income_variability_label] || 50) },
              { label: "Independence", value: 100 - ({ "Very High": 100, "High": 80, "Moderate": 55, "Low": 30, "Very Low": 10 }[record.active_labor_dependence_label] || 50) },
              { label: "Spread", value: 100 - ({ "Very High": 100, "High": 80, "Moderate": 55, "Low": 30, "Very Low": 10 }[record.exposure_concentration_label] || 50) },
            ]} />
          </div>
          {/* Data grid */}
          <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: R.itemGap }}>
            {[
              [rt.incomeThatContinues, record.income_persistence_label],
              [rt.numberOfSources, record.income_source_diversity_label],
              [rt.incomeScheduled, record.forward_revenue_visibility_label],
              [rt.monthlyVariability, record.income_variability_label],
              [rt.dependencePersonalWork, record.active_labor_dependence_label],
              [rt.dependenceOneSource, record.exposure_concentration_label],
            ].map(([l, v]) => (
              <div key={l} style={{ display: "flex", justifyContent: "space-between", borderRadius: 6, backgroundColor: B.sand, padding: "7px 12px" }}>
                <span style={{ ...T.caption, color: B.muted }}>{l}</span>
                <span style={{ ...T.caption, fontWeight: 500, color: B.navy }}>{v}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Labor-Asset Position */}
        {record.labor_asset_position_label && (
          <>
            <SectionDivider />
            <Label>Labor-Asset Position — {subject}</Label>
            <div style={{ marginBottom: R.paraMb }}>
              {/* Spectrum bar */}
              <div style={{ position: "relative", height: 8, borderRadius: 99, background: `linear-gradient(90deg, ${B.muted} 0%, ${B.teal} 50%, ${B.navy} 100%)`, marginBottom: 6 }}>
                <div style={{
                  position: "absolute",
                  left: `${Math.min(Math.max(record.labor_asset_marker_position, 0), 100)}%`,
                  top: -3,
                  width: 14, height: 14, borderRadius: 99,
                  backgroundColor: "#ffffff", border: `2px solid ${B.navy}`,
                  transform: "translateX(-50%)", boxShadow: "0 1px 3px rgba(0,0,0,0.2)",
                }} />
              </div>
              <div style={{ ...T.caption, display: "flex", justifyContent: "space-between", color: B.light }}>
                <span>Labor-Dependent</span>
                <span style={{ fontWeight: 500, color: B.navy }}>{record.labor_asset_position_label}</span>
                <span>Asset-Driven</span>
              </div>
            </div>
            {record.labor_asset_framework_text && (
              <p style={{ ...T.caption, color: B.muted }}>{record.labor_asset_framework_text}</p>
            )}
          </>
        )}

        <SectionDivider />

        {/* Structural Priority Map — ALL 6 factors */}
        <Label>{rt.priorityMap} — {subject}</Label>
        <p style={{ ...T.caption, color: B.muted, marginBottom: R.paraMb }}>
          {rt.factorsRanked} {possessive}.
        </p>
        <div style={{ display: "flex", flexDirection: "column", gap: 3 }}>
          {rankedFactors.map((f, i) => (
            <div key={f.label} style={{ display: "flex", alignItems: "center", gap: 10, borderRadius: 6, backgroundColor: i === 0 ? "rgba(31,109,122,0.06)" : i >= rankedFactors.length - 1 ? "rgba(14,26,43,0.03)" : "transparent", padding: "5px 10px" }}>
              <span style={{ ...T.caption, fontWeight: 600, color: i === 0 ? B.teal : i >= rankedFactors.length - 1 ? B.light : B.muted, minWidth: 14 }}>{i + 1}</span>
              <span style={{ ...T.small, color: B.navy, flex: 1 }}>{f.label}</span>
              <span style={{ ...T.caption, fontWeight: 500, color: f.level === "Strong" ? B.teal : f.level === "Weak" ? B.muted : B.light }}>{f.level}</span>
            </div>
          ))}
        </div>
      </ReportPage>

      {/* ==================== PAGE 3 — Diagnosis & Benchmarks ==================== */}
      <ReportPage record={record} pageLabel="Page 3 — Diagnosis & Benchmarks">
        <h2 style={{ ...T.pageTitle, color: B.navy, marginBottom: 4 }}>
          {rt.diagnosisBenchmarks}
        </h2>
        <p style={{ ...T.body, color: B.muted, marginBottom: R.sectionGap }}>
          {record.page_3_key_insight_text || record.page_4_key_insight_text}
        </p>

        {/* System Diagnosis */}
        <Label>{rt.systemDiagnosis} — {subject}</Label>
        <div style={{ ...T.body, color: B.muted, display: "flex", flexDirection: "column", gap: R.paraMb }}>
          <p>
            {subject} {rt.operatesAs} <strong style={{ color: B.navy }}>{record.labor_asset_position_label}</strong>{" "}
            {record.industry_sector}.
          </p>
          <p>
            {rt.incomeMainly} {activeIncomeDependence(record, rt)}.
            {rt.systemShows} {indicatorStrengthSummary(record, rt)}.
          </p>
          <p>
            <strong style={{ color: B.navy }}>{record.primary_constraint_label}</strong> {rt.becauseConstraint}
          </p>
        </div>

        <SectionDivider />

        {/* Industry Benchmark */}
        <Label>{record.industry_sector} {rt.stabilityBenchmark}</Label>
        <div style={{ borderRadius: 8, overflow: "hidden", border: `1px solid ${B.sandDk}` }}>
          {[
            [`${rt.avgScore} ${record.industry_sector}`, String(bench.avgScore)],
            [rt.top20, `${bench.top20Range}+`],
            [rt.yourScore, String(record.final_score)],
            [rt.distanceTop, `${bench.distance} ${rt.points}`],
          ].map(([label, value], i) => (
            <div key={label} style={{ ...T.small, display: "flex", justifyContent: "space-between", alignItems: "center", backgroundColor: i % 2 === 0 ? B.sand : "white", padding: "8px 14px" }}>
              <span style={{ color: B.muted }}>{label}</span>
              <span style={{ fontWeight: 600, color: i === 2 ? B.purple : B.navy }}>{value}</span>
            </div>
          ))}
        </div>

        {/* Peer benchmark narrative */}
        {record.peer_benchmark_text && (
          <p style={{ ...T.caption, color: B.muted, marginTop: R.paraMb }}>
            {record.peer_benchmark_text}
          </p>
        )}

        {/* Risk Scenario */}
        {record.risk_scenario_text && (
          <div aria-label="Risk scenario analysis" style={{
            marginTop: R.paraMb,
            borderRadius: 8,
            backgroundColor: "rgba(14,26,43,0.02)",
            border: "1px solid rgba(14,26,43,0.06)",
            padding: "12px 16px",
          }}>
            <div style={{ ...T.caption, fontWeight: 600, color: B.navy, marginBottom: 6 }}>Risk Scenario — Largest Source Lost</div>
            <div style={{ display: "flex", gap: 24, marginBottom: 8 }}>
              <div>
                <span style={{ ...T.caption, color: B.light }}>Current</span>
                <div style={{ fontSize: 18, fontWeight: 700, color: B.navy }}>{record.final_score}</div>
              </div>
              <div style={{ display: "flex", alignItems: "center", color: B.light }}>&rarr;</div>
              <div>
                <span style={{ ...T.caption, color: B.light }}>After loss</span>
                <div style={{ fontSize: 18, fontWeight: 700, color: record.risk_scenario_drop > 15 ? "#DC2626" : B.muted }}>{record.risk_scenario_score}</div>
              </div>
              <div>
                <span style={{ ...T.caption, color: B.light }}>Drop</span>
                <div style={{ fontSize: 18, fontWeight: 700, color: record.risk_scenario_drop > 15 ? "#DC2626" : B.muted }}>-{record.risk_scenario_drop}</div>
              </div>
            </div>
            <p style={{ ...T.caption, color: B.muted, margin: 0, lineHeight: 1.5 }}>
              {record.risk_scenario_text}
            </p>
          </div>
        )}

        <SectionDivider />

        {/* Drivers — with detailed explanations */}
        <div style={{ marginTop: 0 }}>
          <Label>{rt.driversSupporting} {possessive}</Label>
          <div style={{ display: "flex", flexDirection: "column", gap: R.itemGap }}>
            {[
              { label: record.driver_1_label, text: record.driver_1_text },
              { label: record.driver_2_label, text: record.driver_2_text },
              { label: record.driver_3_label, text: record.driver_3_text },
            ].map((d) => (
              <div key={d.label} style={{ borderRadius: 6, backgroundColor: B.sand, padding: "8px 12px" }}>
                <div style={{ ...T.caption, fontWeight: 600, color: B.navy, marginBottom: 2 }}>{d.label}</div>
                {d.text && <div style={{ ...T.caption, color: B.muted }}>{d.text}</div>}
              </div>
            ))}
          </div>
        </div>

        <SectionDivider />

        {/* Primary Constraint — with detailed explanation + guidance */}
        <Label>{rt.primaryConstraint} — {subject}</Label>
        <div style={{ ...T.body, fontWeight: 500, color: B.navy, marginBottom: R.itemGap }}>{record.primary_constraint_label}</div>
        <div style={{ ...T.small, color: B.muted, display: "flex", flexDirection: "column", gap: R.itemGap }}>
          {record.primary_constraint_text && <p>{record.primary_constraint_text}</p>}
          <p>{riskData.mechanism}</p>
          <p>{riskData.impact}</p>
        </div>
        {/* Constraint-specific guidance */}
        {(() => {
          const guidance: string[] = safeJsonParse(record.constraint_guidance_payload, []);
          if (guidance.length === 0) return null;
          return (
            <div style={{ marginTop: R.paraMb, borderRadius: 6, backgroundColor: "rgba(31,109,122,0.04)", border: `1px solid rgba(31,109,122,0.12)`, padding: "10px 12px" }}>
              <div style={{ ...T.caption, fontWeight: 600, color: B.teal, marginBottom: 4 }}>Guidance</div>
              <ul style={{ ...T.caption, color: B.muted, margin: 0, paddingLeft: 14, display: "flex", flexDirection: "column", gap: 2 }}>
                {guidance.map((g, i) => <li key={i}>{g}</li>)}
              </ul>
            </div>
          );
        })()}

        {/* Projected Score */}
        {record.projected_final_score && record.projected_final_score !== record.final_score && (
          <>
            <SectionDivider />
            <Label>{rt.projectedScore}</Label>
            <div style={{ ...T.body, display: "flex", gap: 32 }}>
              <span style={{ color: B.muted }}>{rt.current} <strong style={{ color: B.navy }}>{record.final_score}</strong></span>
              <span style={{ color: B.muted }}>{rt.projected} <strong style={{ color: B.teal }}>{record.projected_final_score} ({record.projected_stability_band})</strong></span>
            </div>
          </>
        )}
      </ReportPage>

      {/* ==================== PAGE 4 — Improvement Path ==================== */}
      <ReportPage record={record} pageLabel="Page 4 — Improvement Path">
        <h2 style={{ ...T.pageTitle, color: B.navy, marginBottom: 4 }}>
          {rt.improvementPath}
        </h2>
        <p style={{ ...T.body, color: B.muted, marginBottom: R.sectionGap }}>
          {record.page_6_key_insight_text}
        </p>

        {/* Structural Priority */}
        {record.structural_priority_label && (
          <div style={{ marginBottom: R.sectionGap, borderRadius: 6, backgroundColor: "rgba(75,63,174,0.04)", border: `1px solid rgba(75,63,174,0.10)`, padding: "10px 12px" }}>
            <div style={{ ...T.caption, fontWeight: 600, color: B.purple, marginBottom: 3 }}>Structural Priority: {record.structural_priority_label}</div>
            {record.structural_priority_text && (
              <div style={{ ...T.caption, color: B.muted }}>{record.structural_priority_text}</div>
            )}
          </div>
        )}

        {/* Improvement Opportunities */}
        <Label>{rt.improvementOpportunities} — {subject}</Label>
        <p style={{ ...T.small, color: B.muted, marginBottom: R.paraMb }}>
          {record.structural_improvement_path_text}
        </p>

        {/* 90-Day Action Plan */}
        {(() => {
          const actionPlan: string[] = safeJsonParse(record.action_plan_payload, []);
          if (actionPlan.length === 0) return null;
          return (
            <div style={{ marginTop: R.sectionGap }}>
              <Label>{rt.actionPlan} — {subject}</Label>
              <p style={{ ...T.caption, color: B.muted, marginBottom: R.paraMb }}>
                {rt.actionPlanDesc} {subject}: {record.primary_constraint_label}
              </p>
              <ol style={{ ...T.small, color: B.navy, margin: 0, paddingLeft: 0, listStyleType: "none", display: "flex", flexDirection: "column", gap: R.itemGap }}>
                {actionPlan.map((action, i) => (
                  <li key={i} style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
                    <span style={{ ...T.small, fontWeight: 600, color: B.teal, flexShrink: 0, minWidth: 18 }}>{i + 1}.</span>
                    <span style={{ ...T.small, color: B.navy }}>{action}</span>
                  </li>
                ))}
              </ol>
              <p style={{ ...T.caption, color: B.light, marginTop: R.paraMb, fontStyle: "italic" }}>
                {rt.actionPlanDisclaimer} {record.industry_sector}. {record.primary_constraint_label}.
              </p>
            </div>
          );
        })()}

        <SectionDivider />

        {/* Sector evolution */}
        <div>
          <div style={{ ...T.label, color: B.muted, marginBottom: R.labelMb }}>
            {rt.evolutionPath}
          </div>
          <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: R.itemGap }}>
            {evolutionSteps.map((step, i) => {
              const active = i === evoIdx;
              const past = i < evoIdx;
              return (
                <div key={i} style={{ display: "flex", alignItems: "center", gap: R.itemGap }}>
                  <span
                    style={{
                      ...T.caption, fontWeight: 500,
                      padding: "4px 10px", borderRadius: 4,
                      backgroundColor: active ? B.navy : past ? B.teal : B.sand,
                      color: active || past ? "#ffffff" : B.light,
                    }}
                  >
                    {step}
                  </span>
                  {i < evolutionSteps.length - 1 && <span style={{ ...T.caption, color: B.light }}>&rarr;</span>}
                </div>
              );
            })}
          </div>
          <div style={{ ...T.caption, color: B.muted, marginTop: R.paraMb }}>
            {rt.currentStage} <strong style={{ color: B.navy }}>{record.current_evolution_stage_label}</strong>
          </div>
        </div>

        {/* Sector mechanisms */}
        <div style={{ marginTop: R.sectionGap }}>
          <div style={{ ...T.label, color: B.muted, marginBottom: R.labelMb }}>
            {rt.stabilityMechanisms}
          </div>
          <ul style={{ ...T.small, color: B.muted, listStyleType: "disc", listStylePosition: "inside", display: "flex", flexDirection: "column", gap: 4 }}>
            {sectorMechanisms.map((m) => <li key={m}>{m}</li>)}
          </ul>
        </div>
      </ReportPage>

      {/* ==================== PAGE 5 — Score Summary & Official Record ==================== */}
      <ReportPage record={record} pageLabel="Page 5 — Summary & Record">
        {/* Score Summary Card — the shareable snapshot */}
        <div style={{
          borderRadius: 8,
          border: `1px solid ${B.sandDk}`,
          padding: "20px 24px",
          marginBottom: R.sectionGap,
          background: `linear-gradient(135deg, rgba(14,26,43,0.01) 0%, rgba(31,109,122,0.02) 100%)`,
        }}>
          <div style={{ ...T.label, color: B.teal, marginBottom: 12 }}>ASSESSMENT SUMMARY</div>
          <div style={{ display: "flex", alignItems: "baseline", gap: 12, marginBottom: 12 }}>
            <span style={{ fontSize: 36, fontWeight: 700, color: B.navy, lineHeight: 1 }}>{record.final_score}</span>
            <span style={{ ...T.band, color: B.teal }}>{record.stability_band}</span>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px 20px" }}>
            {[
              ["Subject", record.assessment_title || "—"],
              ["Industry", record.industry_sector],
              ["Peer Ranking", `${record.peer_stability_percentile_label} percentile`],
              ["Constraint", record.primary_constraint_label],
              ["Continuity", `${record.income_continuity_pct}% for ${record.income_continuity_months}mo`],
              ["Risk Exposure", `-${record.risk_scenario_drop} pts if largest source lost`],
            ].map(([l, v]) => (
              <div key={l}>
                <div style={{ ...T.caption, color: B.light }}>{l}</div>
                <div style={{ ...T.small, fontWeight: 500, color: B.navy }}>{v}</div>
              </div>
            ))}
          </div>
        </div>

        <SectionDivider />

        {/* Official Record + QR */}
        <div style={{ display: "flex", gap: 20, alignItems: "flex-start" }}>
          <div style={{ flex: 1 }}>
            <Label>{rt.officialRecord}</Label>
            <dl style={{ ...T.small, display: "flex", flexDirection: "column", gap: R.itemGap }}>
              {[
                [rt.recordId, record.record_id],
                [rt.modelLabel, record.model_version || "RP-1.0 | Version 1.0"],
                [rt.date, record.issued_timestamp_utc || record.assessment_date_utc],
                [rt.score, `${record.final_score} — ${record.stability_band}`],
                [rt.authCode, record.authorization_code],
                [rt.registry, record.registry_visibility === "public" ? rt.publiclyListed : rt.privateRecord],
              ].map(([l, v]) => (
                <div key={l} style={{ display: "flex" }}>
                  <dt style={{ width: 72, flexShrink: 0, color: B.light }}>{l}</dt>
                  <dd style={{ ...T.caption, fontFamily: "monospace", wordBreak: "break-all", color: B.navy }}>{v}</dd>
                </div>
              ))}
            </dl>
          </div>
          {/* QR code */}
          <div style={{ flexShrink: 0, textAlign: "center" }} aria-label="QR code linking to score verification page">
            <QRCodeImage recordId={record.record_id} />
            <div style={{ ...T.caption, color: B.light, marginTop: 4 }}>Scan to verify</div>
          </div>
        </div>

        <SectionDivider />

        {/* Condensed governance */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
          <div>
            <Label>{rt.methodologyLabel}</Label>
            <p style={{ ...T.caption, color: B.muted, margin: 0 }}>{rt.methodologyText}</p>
          </div>
          <div>
            <Label>{rt.disclosure}</Label>
            <p style={{ ...T.caption, color: B.light, margin: 0 }}>{rt.disclosureText}</p>
          </div>
        </div>

        {/* Verification link */}
        <p style={{ ...T.caption, color: B.muted, marginTop: R.sectionGap }}>
          {rt.verifyAt} <span style={{ fontWeight: 500, color: B.navy }}>RunPayway™.com/verify</span>
        </p>

        {/* Model reference */}
        <div style={{ textAlign: "center", marginTop: R.footerMt, paddingTop: R.paraMb, borderTop: `1px solid ${B.sandDk}` }}>
          <div style={{ ...T.caption, color: B.light }}>{rt.modelReference}</div>
        </div>
      </ReportPage>

      {/* ==================== PAGE 6 — Advisor Discussion Guide ==================== */}
      <ReportPage record={record} pageLabel="Page 6 — Advisor Discussion Guide">
        <h2 style={{ ...T.pageTitle, color: B.navy, marginBottom: 4 }}>
          Advisor Discussion Guide
        </h2>
        <p style={{ ...T.body, color: B.muted, marginBottom: R.sectionGap }}>
          Structured framework for the advisor-client conversation based on this assessment.
        </p>

        {/* Talking Points */}
        <Label>Talking Points</Label>
        <div style={{ display: "flex", flexDirection: "column", gap: R.itemGap, marginBottom: R.sectionGap }}>
          {advisorGuide.talking_points.map((tp, i) => (
            <div key={i} style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
              <span style={{ ...T.caption, fontWeight: 700, color: B.teal, flexShrink: 0, minWidth: 18 }}>{i + 1}.</span>
              <span style={{ ...T.small, color: B.navy, lineHeight: 1.55 }}>{tp}</span>
            </div>
          ))}
        </div>

        <SectionDivider />

        {/* Client Questions */}
        <Label>Questions to Ask the Client</Label>
        <div style={{ display: "flex", flexDirection: "column", gap: R.itemGap, marginBottom: R.sectionGap }}>
          {advisorGuide.client_questions.map((q, i) => (
            <div key={i} style={{ display: "flex", gap: 10, alignItems: "flex-start", borderRadius: 6, backgroundColor: B.sand, padding: "8px 12px" }}>
              <span style={{ ...T.caption, fontWeight: 600, color: B.purple, flexShrink: 0 }}>Q{i + 1}</span>
              <span style={{ ...T.small, color: B.navy, fontStyle: "italic" }}>&ldquo;{q}&rdquo;</span>
            </div>
          ))}
        </div>

        {/* Red Flags */}
        {advisorGuide.red_flags.length > 0 && (
          <>
            <SectionDivider />
            <Label>Red Flags to Address</Label>
            <div style={{ display: "flex", flexDirection: "column", gap: R.itemGap }}>
              {advisorGuide.red_flags.map((rf, i) => (
                <div key={i} style={{ display: "flex", gap: 10, alignItems: "flex-start", borderRadius: 6, backgroundColor: "rgba(220,38,38,0.04)", border: "1px solid rgba(220,38,38,0.10)", padding: "8px 12px" }}>
                  <span style={{ ...T.caption, fontWeight: 700, color: "#DC2626", flexShrink: 0 }}>!</span>
                  <span style={{ ...T.small, color: B.navy }}>{rf}</span>
                </div>
              ))}
            </div>
          </>
        )}

        <SectionDivider />

        {/* Next Steps */}
        <Label>Next Steps</Label>
        <div style={{ display: "flex", flexDirection: "column", gap: R.itemGap }}>
          {advisorGuide.next_steps.map((ns, i) => (
            <div key={i} style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
              <span style={{ width: 20, height: 20, borderRadius: 4, backgroundColor: B.navy, color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, ...T.micro }}>{i + 1}</span>
              <span style={{ ...T.small, color: B.navy }}>{ns}</span>
            </div>
          ))}
        </div>
      </ReportPage>

      {/* ==================== PAGE 7 — Service Recommendations ==================== */}
      {productRecs.length > 0 && (
        <ReportPage record={record} pageLabel="Page 7 — Service Recommendations">
          <h2 style={{ ...T.pageTitle, color: B.navy, marginBottom: 4 }}>
            Product & Service Recommendations
          </h2>
          <p style={{ ...T.body, color: B.muted, marginBottom: R.sectionGap }}>
            Based on the structural assessment, the following categories of products or services would address identified gaps in {record.assessment_title || "this income system"}&apos;s stability profile.
          </p>

          <div style={{ display: "flex", flexDirection: "column", gap: R.paraMb }}>
            {productRecs.map((rec, i) => (
              <div key={i} style={{
                borderRadius: 8,
                border: `1px solid ${rec.urgency === "High" ? "rgba(31,109,122,0.15)" : rec.urgency === "Medium" ? "rgba(14,26,43,0.08)" : "rgba(14,26,43,0.04)"}`,
                backgroundColor: rec.urgency === "High" ? "rgba(31,109,122,0.03)" : "#ffffff",
                padding: "14px 16px",
              }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                  <div style={{ ...T.body, fontWeight: 600, color: B.navy }}>{rec.category}</div>
                  <span style={{
                    ...T.micro,
                    padding: "2px 8px",
                    borderRadius: 4,
                    backgroundColor: rec.urgency === "High" ? B.teal : rec.urgency === "Medium" ? B.navy : B.light,
                    color: "#ffffff",
                  }}>
                    {rec.urgency}
                  </span>
                </div>
                <p style={{ ...T.caption, color: B.muted, margin: 0, lineHeight: 1.55 }}>
                  {rec.rationale}
                </p>
              </div>
            ))}
          </div>

          <SectionDivider />

          <div style={{ ...T.caption, color: B.light, fontStyle: "italic", lineHeight: 1.55 }}>
            These recommendations are structural observations based on the Income Stability Score™ assessment.
            They are not financial advice. Specific product selection should be discussed with the appropriate
            licensed professional based on the client&apos;s complete financial situation.
          </div>
        </ReportPage>
      )}

      {/* ==================== PAGE 8 — Client Action Summary (Tearsheet) ==================== */}
      <ReportPage record={record} pageLabel="Client Summary">
        <div style={{ textAlign: "center", marginBottom: 24 }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/runpayway-logo-full.png" alt="RunPayway" style={{ height: 24, width: "auto", marginBottom: 16 }} />
          <div style={{ fontSize: 20, fontWeight: 700, color: B.navy, marginBottom: 4 }}>
            {record.assessment_title || "Income Stability Assessment"}
          </div>
          <div style={{ ...T.caption, color: B.light }}>
            {(record.issued_timestamp_utc || record.assessment_date_utc).split("T")[0]} · {record.industry_sector} · Model {record.model_version || "RP-1.0"}
          </div>
        </div>

        {/* Score block */}
        <div style={{
          textAlign: "center",
          borderRadius: 8,
          background: `linear-gradient(135deg, rgba(14,26,43,0.02) 0%, rgba(31,109,122,0.03) 100%)`,
          border: `1px solid ${B.sandDk}`,
          padding: "20px",
          marginBottom: R.sectionGap,
        }}>
          <div style={{ fontSize: 56, fontWeight: 700, color: B.navy, lineHeight: 1 }}>{record.final_score}</div>
          <div style={{ ...T.band, color: B.teal, marginTop: 6 }}>{record.stability_band}</div>
          <div style={{ ...T.caption, color: B.muted, marginTop: 8 }}>
            {record.peer_stability_percentile_label} percentile in {record.industry_sector}
          </div>
        </div>

        {/* Key metrics grid */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: R.itemGap, marginBottom: R.sectionGap }}>
          {[
            ["Income Continuity", `${record.income_continuity_pct}% for ${record.income_continuity_months}mo`],
            ["Risk Exposure", `-${record.risk_scenario_drop} pts if largest source lost`],
            ["Primary Constraint", record.primary_constraint_label],
            ["Structural Priority", record.structural_priority_label],
          ].map(([l, v]) => (
            <div key={l} style={{ borderRadius: 6, backgroundColor: B.sand, padding: "8px 12px" }}>
              <div style={{ ...T.caption, color: B.light }}>{l}</div>
              <div style={{ ...T.small, fontWeight: 500, color: B.navy }}>{v}</div>
            </div>
          ))}
        </div>

        <SectionDivider />

        {/* Top 3 Actions */}
        <Label>Your Top 3 Actions</Label>
        <div style={{ display: "flex", flexDirection: "column", gap: R.itemGap, marginBottom: R.sectionGap }}>
          {(() => {
            const actionPlan: string[] = safeJsonParse(record.action_plan_payload, []);
            return actionPlan.slice(0, 3).map((action, i) => (
              <div key={i} style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
                <span style={{
                  width: 22, height: 22, borderRadius: 6,
                  backgroundColor: B.teal, color: "#ffffff",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  flexShrink: 0, ...T.micro
                }}>{i + 1}</span>
                <span style={{ ...T.small, color: B.navy, lineHeight: 1.55 }}>{action}</span>
              </div>
            ));
          })()}
        </div>

        <SectionDivider />

        {/* Verification + QR */}
        <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
          <div style={{ flex: 1 }}>
            <div style={{ ...T.caption, color: B.light, marginBottom: 4 }}>Record ID: {record.record_id.slice(0, 8)}…</div>
            <div style={{ ...T.caption, color: B.muted }}>
              Verify at <span style={{ fontWeight: 500, color: B.navy }}>RunPayway.com/verify</span>
            </div>
          </div>
          <div aria-label="QR code for verification">
            <QRCodeImage recordId={record.record_id} />
          </div>
        </div>

        {/* Next assessment date */}
        <div style={{ textAlign: "center", marginTop: R.sectionGap, padding: "10px", borderRadius: 6, backgroundColor: B.sand }}>
          <div style={{ ...T.caption, color: B.muted }}>
            Recommended next assessment: <strong style={{ color: B.navy }}>
              {(() => {
                const d = new Date(record.issued_timestamp_utc || record.assessment_date_utc);
                d.setMonth(d.getMonth() + (record.final_score >= 60 ? 6 : 3));
                return d.toISOString().split("T")[0];
              })()}
            </strong>
          </div>
        </div>
      </ReportPage>

      {/* Download + Email Status */}
      <div className="download-section no-print" style={{ display: "flex", flexDirection: "column", gap: 12, width: "100%" }}>
        <button
          onClick={handleDownload}
          disabled={downloading}
          style={{ padding: "10px 24px", fontSize: 14, fontWeight: 500, color: "#ffffff", borderRadius: 6, border: "none", cursor: "pointer", backgroundColor: B.navy, opacity: downloading ? 0.6 : 1, transition: "background-color 180ms ease" }}
          onMouseEnter={(e) => !downloading && (e.currentTarget.style.backgroundColor = B.purple)}
          onMouseLeave={(e) => !downloading && (e.currentTarget.style.backgroundColor = B.navy)}>
          {downloading ? rt.generatingPdf : rt.downloadReport}
        </button>

        {downloadError && (
          <div style={{ padding: "10px 16px", borderRadius: 6, backgroundColor: "rgba(220,38,38,0.06)", border: "1px solid rgba(220,38,38,0.12)" }}>
            <p style={{ fontSize: 13, color: "#DC2626", margin: 0 }}>PDF download failed: {downloadError}. Try refreshing the page.</p>
          </div>
        )}

        {/* Email delivery status */}
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          {emailStatus === "sending" && (
            <>
              <span style={{ width: 8, height: 8, borderRadius: "50%", backgroundColor: B.light, animation: "pulse 1.2s infinite" }} />
              <span style={{ fontSize: 13, color: B.muted }}>Sending report to your email...</span>
            </>
          )}
          {emailStatus === "sent" && (
            <>
              <span style={{ width: 8, height: 8, borderRadius: "50%", backgroundColor: B.teal }} />
              <span style={{ fontSize: 13, color: B.teal, fontWeight: 500 }}>Report sent to your email</span>
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
        @media print {
          .no-print, .download-section { display: none !important; }
          .report-page {
            break-inside: avoid;
            page-break-inside: avoid;
            box-shadow: none !important;
            border: none !important;
            border-radius: 0 !important;
            margin: 0 !important;
            padding: 0.5in !important;
            width: 100% !important;
            max-width: 100% !important;
            min-height: auto !important;
          }
          .report-page + .report-page {
            page-break-before: always;
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
