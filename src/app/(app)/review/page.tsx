"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

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
  structural_improvement_path_text: string;
  peer_stability_percentile: number;
  peer_stability_percentile_label: string;
  projected_final_score: number;
  projected_stability_band: string;
  registry_visibility: string;
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

function indicatorStrengthSummary(r: AssessmentRecord): string {
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
  if (strong >= 4) return "strength in many areas";
  if (strong >= 2) return "some areas of strength";
  if (moderate >= 3) return "moderate results in several areas";
  return "early-stage results with limited income that continues on its own";
}

function activeIncomeDependence(r: AssessmentRecord): string {
  if (r.active_income_level >= 75) return "income from active work";
  if (r.active_income_level >= 50) return "a mix of active and partly recurring income";
  return "a mix of active, partly recurring, and ongoing income";
}

function percentileExplanation(r: AssessmentRecord): string {
  const p = r.peer_stability_percentile;
  const label = r.peer_stability_percentile_label;
  const name = subjectName(r);
  if (p >= 75) return `A score at the ${label} percentile means ${name} is more stable than most income systems in the ${r.industry_sector} sector.`;
  if (p >= 50) return `A score at the ${label} percentile means ${name} is about as stable as the average income system in the ${r.industry_sector} sector.`;
  return `A score at the ${label} percentile means ${name} is less stable than most income systems in the ${r.industry_sector} sector.`;
}

function getIndustryBenchmark(finalScore: number) {
  const avgScore = 48;
  const top20Range = 65;
  const distance = Math.max(0, top20Range - finalScore);
  return { avgScore, top20Range, distance };
}

const RISK_EXPOSURE: Record<string, { mechanism: string; impact: string }> = {
  "Income Continuity Without Active Labor": {
    mechanism: "Income depends on ongoing work. If work stops, income stops too.",
    impact: "A health issue, break, or slowdown could mean no income during that time.",
  },
  "Recurring Revenue Base": {
    mechanism: "Most income comes from one-time payments rather than repeating revenue.",
    impact: "Stability depends on always finding new clients or deals.",
  },
  "Forward Revenue Visibility": {
    mechanism: "Very little income is already scheduled or committed for future months.",
    impact: "Income may drop if there are gaps between jobs or clients.",
  },
  "Income Concentration": {
    mechanism: "Most income comes from one or very few sources.",
    impact: "Losing a main source could cause a big drop in income.",
  },
  "Income Source Count": {
    mechanism: "Income comes from very few independent sources.",
    impact: "Losing any one source could seriously affect total income.",
  },
  "Earnings Variability": {
    mechanism: "Monthly income changes a lot from month to month.",
    impact: "It is harder to plan or meet regular financial obligations.",
  },
};

// Identify key positive/negative factors for Page 1
function getKeyFactors(r: AssessmentRecord): { positive: string[]; risks: string[] } {
  // For inverted indicators (variability, labor dependence, concentration),
  // "low/very low" is GOOD and "high/very high" is BAD.
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
      // Inverted: low = positive, high = risk
      if (isLow) positive.push(f.label);
      else if (isHigh) risks.push(f.label);
    } else {
      // Normal: high = positive, low = risk
      if (isHigh) positive.push(f.label);
      else if (isLow) risks.push(f.label);
    }
  }
  // If not enough, add moderate ones
  if (positive.length < 2) {
    for (const f of factors) {
      if (/moderate/i.test(f.value) && positive.length < 2) positive.push(f.label);
    }
  }
  if (risks.length < 2) {
    for (const f of factors) {
      if (/moderate/i.test(f.value) && !positive.includes(f.label) && risks.length < 2) risks.push(f.label);
    }
  }
  return { positive: positive.slice(0, 3), risks: risks.slice(0, 3) };
}

// ============================================================
// REPORT SPACING TOKENS — purposeful, enterprise-grade
// ============================================================
const R = {
  pagePad:    32,    /* page container padding — used for PDF capture at 750px */
  headerMb:   20,    /* header → first content */
  sectionGap: 16,    /* between major sections */
  labelMb:    8,     /* label → content below */
  paraMb:     8,     /* between paragraphs */
  itemGap:    6,     /* between list/grid items */
  dividerMy:  14,    /* divider vertical margin */
  footerMt:   16,    /* above page footer */
};

// ============================================================
// LAYOUT COMPONENTS
// ============================================================

function ReportHeader({ record }: { record: AssessmentRecord }) {
  return (
    <div style={{ marginBottom: R.headerMb }}>
      <div className="h-[3px] rounded-t-lg overflow-hidden" style={{ background: B.gradient, margin: `-${R.pagePad}px -${R.pagePad}px 0` }} />
      <div style={{ paddingTop: 12, paddingBottom: 10, borderBottom: `1px solid ${B.sandDk}` }}>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold tracking-wider" style={{ color: B.navy }}>RUNPAYWAY™</span>
            <span className="text-[10px] hidden sm:inline" style={{ color: B.light }}>Income Stability Assessment · Model RP-1.0</span>
          </div>
          <div className="text-[10px]" style={{ color: B.light }}>
            {record.record_id.slice(0, 8)}… · {record.assessment_date_utc}
          </div>
        </div>
      </div>
    </div>
  );
}

function Label({ children }: { children: React.ReactNode }) {
  return (
    <div className="text-[10px] font-semibold uppercase tracking-[0.12em]" style={{ color: B.muted, marginBottom: R.labelMb }}>{children}</div>
  );
}

function SectionDivider() {
  return <div style={{ height: 1, backgroundColor: B.navy, opacity: 0.08, marginTop: R.dividerMy, marginBottom: R.dividerMy }} />;
}

function ReportPage({ record, children }: { record: AssessmentRecord; children: React.ReactNode }) {
  return (
    <div className="report-page bg-white border rounded-lg" style={{ borderColor: "#E5E7EB", padding: R.pagePad }}>
      <ReportHeader record={record} />
      {children}
    </div>
  );
}

// ============================================================
// PDF DOWNLOAD
// ============================================================

async function downloadPDF(recordId: string) {
  const html2canvas = (await import("html2canvas")).default;
  const { jsPDF } = await import("jspdf");

  const pages = document.querySelectorAll(".report-page");
  if (!pages.length) return;

  const pdf = new jsPDF({ orientation: "portrait", unit: "in", format: "letter" });
  const pageWidth = 8.5;
  const pageHeight = 11;
  const margin = 0.35;
  const contentWidth = pageWidth - margin * 2;
  const contentHeight = pageHeight - margin * 2;

  // Fixed capture width for consistent rendering
  const captureWidth = 750;

  // Exactly 3 report pages → exactly 3 PDF pages. One-to-one.
  for (let i = 0; i < pages.length; i++) {
    const el = pages[i] as HTMLElement;

    // Save original styles
    const origWidth = el.style.width;
    const origMinHeight = el.style.minHeight;
    const origMaxWidth = el.style.maxWidth;
    const origBoxSizing = el.style.boxSizing;
    const origHeight = el.style.height;
    const origOverflow = el.style.overflow;

    // Set fixed width, let height be natural
    el.style.width = `${captureWidth}px`;
    el.style.maxWidth = `${captureWidth}px`;
    el.style.boxSizing = "border-box";
    el.style.height = "auto";
    el.style.minHeight = "0";
    el.style.overflow = "visible";

    // Let the browser reflow, then measure actual height
    await new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r)));
    const naturalHeight = el.scrollHeight;

    const canvas = await html2canvas(el, {
      scale: 2,
      useCORS: true,
      backgroundColor: "#ffffff",
      logging: false,
      width: captureWidth,
      height: naturalHeight,
      windowWidth: captureWidth,
    });

    // Restore original styles
    el.style.width = origWidth;
    el.style.minHeight = origMinHeight;
    el.style.maxWidth = origMaxWidth;
    el.style.boxSizing = origBoxSizing;
    el.style.height = origHeight;
    el.style.overflow = origOverflow;

    // Place each report page on exactly one PDF page — scale to fit
    if (i > 0) pdf.addPage();
    const imgWidth = contentWidth;
    const imgHeight = (canvas.height / canvas.width) * imgWidth;

    // If content is taller than page, scale down to fit
    const scale = imgHeight > contentHeight ? contentHeight / imgHeight : 1;
    const finalWidth = imgWidth * scale;
    const finalHeight = imgHeight * scale;

    // Center on page
    const xOffset = margin + (contentWidth - finalWidth) / 2;
    const yOffset = margin;

    pdf.addImage(
      canvas.toDataURL("image/png"),
      "PNG",
      xOffset,
      yOffset,
      finalWidth,
      finalHeight
    );
  }

  const shortId = recordId.slice(0, 8);
  pdf.save(`RunPayway-Income-Stability-Report-${shortId}.pdf`);
}

// ============================================================
// MAIN PAGE
// ============================================================

export default function ReviewPage() {
  const router = useRouter();
  const [record, setRecord] = useState<AssessmentRecord | null>(null);
  const [downloading, setDownloading] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
    const stored = sessionStorage.getItem("rp_record");
    if (!stored) { router.push("/diagnostic-portal"); return; }
    setRecord(JSON.parse(stored));
  }, [router]);

  if (!record) return null;

  const evolutionSteps: string[] = JSON.parse(record.evolution_path_steps_payload);
  const sectorMechanisms: string[] = JSON.parse(record.sector_mechanisms_payload);
  const riskData = RISK_EXPOSURE[record.primary_constraint_label] || RISK_EXPOSURE["Forward Revenue Visibility"];
  const subject = subjectName(record);
  const possessive = subjectPossessive(record);
  const keyFactors = getKeyFactors(record);
  const bench = getIndustryBenchmark(record.final_score);

  const handleDownload = async () => {
    setDownloading(true);
    try { await downloadPDF(record.record_id); } finally { setDownloading(false); }
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
      <div className="no-print">
        <h1 className="text-lg sm:text-xl font-semibold" style={{ color: B.navy }}>Income Stability Assessment</h1>
        <p className="text-sm mt-1" style={{ color: B.muted }}>Model RP-1.0 | Version 1.0</p>
      </div>

      {/* ==================== PAGE 1 — Executive Assessment ==================== */}
      <ReportPage record={record}>
        {/* Executive summary */}
        <p className="text-xs leading-relaxed" style={{ color: B.muted, marginBottom: R.sectionGap }}>
          {record.page_1_key_insight_text}
        </p>

        {/* Score presentation */}
        <div style={{ marginBottom: R.sectionGap }}>
          <Label>Income Stability Score™</Label>
          <div className="text-[48px] font-bold leading-none" style={{ color: B.navy }}>
            {record.final_score}
          </div>
          <div className="text-[15px] font-semibold" style={{ color: B.teal, marginTop: 6 }}>
            {record.stability_band}
          </div>

          {/* Metadata */}
          <div className="flex flex-wrap gap-x-6 gap-y-1 text-[10px]" style={{ color: B.light, marginTop: R.paraMb }}>
            <span>Assessment ID: {record.record_id.slice(0, 8)}…</span>
            <span>Generated: {record.assessment_date_utc}</span>
            <span>Model: RP-1.0</span>
          </div>
        </div>

        {/* Spectrum bar */}
        <div style={{ marginBottom: R.sectionGap }}>
          <div className="relative" style={{ marginBottom: R.itemGap }}>
            <div className="rounded-full" style={{ height: 8, background: B.gradient }} />
            {[40, 60, 80].map((pos) => (
              <div key={pos} style={{ position: "absolute", left: `${pos}%`, top: 0, width: 1, height: 8, backgroundColor: "rgba(255,255,255,0.4)" }} />
            ))}
          </div>
          <div className="grid grid-cols-4 gap-0.5">
            {[
              { label: "Limited", range: "0\u201339" },
              { label: "Developing", range: "40\u201359" },
              { label: "Established", range: "60\u201379" },
              { label: "High", range: "80\u2013100" },
            ].map((b) => (
              <div key={b.label} className="text-center">
                <div className="text-[9px] font-semibold" style={{ color: b.label + " Stability" === record.stability_band ? B.navy : B.light }}>{b.label}</div>
                <div className="text-[8px]" style={{ color: B.light }}>{b.range}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Percentile */}
        {record.peer_stability_percentile_label && (
          <div style={{ marginBottom: R.sectionGap }}>
            <p className="text-xs" style={{ color: B.muted }}>
              <span className="font-medium" style={{ color: B.navy }}>{record.peer_stability_percentile_label} percentile</span>{" "}within {record.industry_sector}
            </p>
            <p className="text-[11px] leading-relaxed" style={{ color: B.muted, marginTop: 6 }}>
              {percentileExplanation(record)}
            </p>
          </div>
        )}

        <SectionDivider />

        {/* Profile */}
        <Label>Profile</Label>
        <dl className="sm:grid sm:grid-cols-2 sm:gap-x-6" style={{ display: "flex", flexDirection: "column", gap: R.itemGap }}>
          {record.assessment_title && (
            <div className="sm:col-span-2">
              <dt className="inline" style={{ color: B.light }}>Assessment Title: </dt>
              <dd className="inline font-medium" style={{ color: B.navy }}>{record.assessment_title}</dd>
            </div>
          )}
          {[
            ["Classification", record.classification],
            ["Structure", record.operating_structure],
            ["Income Model", record.primary_income_model],
            ["Revenue", record.revenue_structure],
            ["Sector", record.industry_sector],
          ].map(([l, v]) => (
            <div key={l}>
              <dt className="inline" style={{ color: B.light }}>{l}: </dt>
              <dd className="inline font-medium" style={{ color: B.navy }}>{v}</dd>
            </div>
          ))}
        </dl>

        <SectionDivider />

        {/* Key Structural Factors */}
        <Label>Key Structural Factors Affecting Your Score</Label>
        <div className="grid grid-cols-1 sm:grid-cols-2" style={{ gap: R.sectionGap, marginTop: R.paraMb }}>
          <div>
            <div className="text-[10px] font-medium uppercase tracking-wider" style={{ color: B.teal, marginBottom: R.labelMb }}>
              Positive Factors
            </div>
            <ul style={{ display: "flex", flexDirection: "column", gap: R.itemGap }}>
              {keyFactors.positive.map((f) => (
                <li key={f} className="flex items-center gap-2 text-[11px]" style={{ color: B.navy }}>
                  <span className="w-1 h-1 rounded-full shrink-0" style={{ backgroundColor: B.teal }} />
                  {f}
                </li>
              ))}
              {keyFactors.positive.length === 0 && (
                <li className="text-[11px]" style={{ color: B.light }}>No strong positive factors identified</li>
              )}
            </ul>
          </div>
          <div>
            <div className="text-[10px] font-medium uppercase tracking-wider" style={{ color: B.muted, marginBottom: R.labelMb }}>
              Structural Risks
            </div>
            <ul style={{ display: "flex", flexDirection: "column", gap: R.itemGap }}>
              {keyFactors.risks.map((f) => (
                <li key={f} className="flex items-center gap-2 text-[11px]" style={{ color: B.navy }}>
                  <span className="w-1 h-1 rounded-full shrink-0" style={{ backgroundColor: B.light }} />
                  {f}
                </li>
              ))}
              {keyFactors.risks.length === 0 && (
                <li className="text-[11px]" style={{ color: B.light }}>No significant structural risks identified</li>
              )}
            </ul>
          </div>
        </div>
      </ReportPage>

      {/* ==================== PAGE 2 — Structural Analysis ==================== */}
      <ReportPage record={record}>
        <h2 className="text-sm font-semibold uppercase tracking-[0.1em]" style={{ color: B.navy, marginBottom: 4 }}>
          Structural Analysis
        </h2>
        <p className="text-xs leading-relaxed" style={{ color: B.muted, marginBottom: R.sectionGap }}>
          {record.page_2_key_insight_text}
        </p>

        {/* Income Structure Map */}
        <Label>Income Structure Map</Label>
        <p className="text-[11px]" style={{ color: B.muted, marginBottom: R.paraMb }}>
          {possessive} income comes from three types of sources.
        </p>
        <div style={{ display: "flex", flexDirection: "column", gap: R.paraMb }}>
          {[
            { label: "Active Income", desc: "Earned by doing work", value: record.active_income_level, color: B.muted },
            { label: "Semi-Persistent", desc: "Repeats for a while, then stops", value: record.semi_persistent_income_level, color: B.teal },
            { label: "Persistent", desc: "Continues with little work", value: record.persistent_income_level, color: B.navy },
          ].map((bar) => (
            <div key={bar.label}>
              <div className="flex justify-between text-[11px]" style={{ marginBottom: 4 }}>
                <span style={{ color: B.muted }}>{bar.label}</span>
                <span className="font-medium" style={{ color: B.navy }}>{bar.value}%</span>
              </div>
              <div className="h-2.5 rounded-full overflow-hidden" style={{ backgroundColor: B.sand }}>
                <div className="h-full rounded-full" style={{ width: `${bar.value}%`, backgroundColor: bar.color }} />
              </div>
            </div>
          ))}
        </div>

        <SectionDivider />

        {/* Structural Indicators */}
        <Label>Structural Indicators</Label>
        <div className="grid grid-cols-1 sm:grid-cols-2" style={{ gap: R.itemGap }}>
          {[
            ["Income That Continues", record.income_persistence_label],
            ["Number of Income Sources", record.income_source_diversity_label],
            ["Income Already Scheduled", record.forward_revenue_visibility_label],
            ["Monthly Income Variability", record.income_variability_label],
            ["Dependence on Personal Work", record.active_labor_dependence_label],
            ["Dependence on One Source", record.exposure_concentration_label],
          ].map(([l, v]) => (
            <div key={l} className="flex justify-between rounded-md" style={{ backgroundColor: B.sand, padding: "10px 14px" }}>
              <span className="text-[10px]" style={{ color: B.muted }}>{l}</span>
              <span className="text-[10px] font-medium" style={{ color: B.navy }}>{v}</span>
            </div>
          ))}
        </div>

        <SectionDivider />

        {/* System Diagnosis */}
        <Label>System Diagnosis</Label>
        <div className="text-xs leading-relaxed" style={{ color: B.muted, display: "flex", flexDirection: "column", gap: R.paraMb }}>
          <p>
            {subject} operates mainly as a <strong style={{ color: B.navy }}>{record.labor_asset_position_label}</strong> income
            system in the <strong style={{ color: B.navy }}>{record.industry_sector}</strong> sector.
          </p>
          <p>
            Income mainly comes from {activeIncomeDependence(record)}.
            The system shows {indicatorStrengthSummary(record)}.
          </p>
          <p>
            Because <strong style={{ color: B.navy }}>{record.primary_constraint_label}</strong> is limited,
            stability depends on continuing to generate new work.
          </p>
        </div>

        <SectionDivider />

        {/* Industry Benchmark */}
        <Label>Industry Stability Benchmark</Label>
        <div className="rounded-lg overflow-hidden border" style={{ borderColor: B.sandDk }}>
          {[
            [`Average ${record.industry_sector} Stability Score`, String(bench.avgScore)],
            ["Top 20% Stability Range", `${bench.top20Range}+`],
            ["Your Score", String(record.final_score)],
            ["Distance From Top Stability Tier", `${bench.distance} points`],
          ].map(([label, value], i) => (
            <div key={label} className="flex justify-between items-center text-[11px]"
              style={{ backgroundColor: i % 2 === 0 ? B.sand : "white", padding: "10px 16px" }}>
              <span style={{ color: B.muted }}>{label}</span>
              <span className="font-semibold" style={{ color: i === 2 ? B.purple : B.navy }}>{value}</span>
            </div>
          ))}
        </div>

        {/* Drivers */}
        <div style={{ marginTop: R.sectionGap }}>
          <Label>Drivers Supporting Stability</Label>
          <div className="flex flex-wrap" style={{ gap: R.itemGap }}>
            {[record.driver_1_label, record.driver_2_label, record.driver_3_label].map((d) => (
              <span key={d} className="text-[10px] font-medium rounded-md" style={{ backgroundColor: B.sand, color: B.navy, padding: "4px 10px" }}>{d}</span>
            ))}
          </div>
        </div>
      </ReportPage>

      {/* ==================== PAGE 3 — Improvement Path & Governance ==================== */}
      <ReportPage record={record}>
        <h2 className="text-sm font-semibold uppercase tracking-[0.1em]" style={{ color: B.navy, marginBottom: 4 }}>
          Improvement Path &amp; Governance
        </h2>
        <p className="text-xs leading-relaxed" style={{ color: B.muted, marginBottom: R.sectionGap }}>
          {record.page_3_key_insight_text}
        </p>

        {/* Primary Constraint */}
        <Label>Primary Structural Constraint</Label>
        <div className="text-xs font-medium" style={{ color: B.navy, marginBottom: R.itemGap }}>{record.primary_constraint_label}</div>
        <div className="text-[11px] leading-relaxed" style={{ color: B.muted, display: "flex", flexDirection: "column", gap: R.itemGap }}>
          <p>{riskData.mechanism}</p>
          <p>{riskData.impact}</p>
        </div>

        <SectionDivider />

        {/* Improvement Opportunities */}
        <Label>Improvement Opportunities</Label>
        <p className="text-[11px] leading-relaxed" style={{ color: B.muted, marginBottom: R.paraMb }}>
          {record.structural_improvement_path_text}
        </p>

        {/* Sector evolution */}
        <div style={{ marginTop: R.sectionGap }}>
          <div className="text-[10px] font-medium uppercase tracking-wider" style={{ color: B.muted, marginBottom: R.labelMb }}>
            Sector Evolution Path
          </div>
          <div className="flex flex-wrap items-center" style={{ gap: R.itemGap }}>
            {evolutionSteps.map((step, i) => {
              const idx = evolutionSteps.length > 1 ? Math.round((record.current_evolution_stage_position / 100) * (evolutionSteps.length - 1)) : 0;
              const active = i === idx;
              const past = i < idx;
              return (
                <div key={i} className="flex items-center" style={{ gap: R.itemGap }}>
                  <span
                    className="text-[10px] font-medium rounded"
                    style={{
                      padding: "4px 10px",
                      backgroundColor: active ? B.navy : past ? B.teal : B.sand,
                      color: active || past ? "#ffffff" : B.light,
                    }}
                  >
                    {step}
                  </span>
                  {i < evolutionSteps.length - 1 && <span className="text-[10px]" style={{ color: B.light }}>&rarr;</span>}
                </div>
              );
            })}
          </div>
          <div className="text-[10px]" style={{ color: B.muted, marginTop: R.paraMb }}>
            Current Stage: <strong style={{ color: B.navy }}>{record.current_evolution_stage_label}</strong>
          </div>
        </div>

        {/* Sector mechanisms */}
        <div style={{ marginTop: R.sectionGap }}>
          <div className="text-[10px] font-medium uppercase tracking-wider" style={{ color: B.muted, marginBottom: R.labelMb }}>
            Sector Stability Mechanisms
          </div>
          <ul className="text-[11px] list-disc list-inside" style={{ color: B.muted, display: "flex", flexDirection: "column", gap: 4 }}>
            {sectorMechanisms.map((m) => <li key={m}>{m}</li>)}
          </ul>
        </div>

        <SectionDivider />

        {/* Methodology */}
        <Label>Methodology</Label>
        <p className="text-[10px] leading-relaxed" style={{ color: B.muted }}>
          The Income Stability Score™ evaluates the structural stability of income at a specific point in time.
          Six structural factors are assessed under Model RP-1.0 using fixed, deterministic scoring criteria.
          The model does not evaluate investment performance, creditworthiness, or future financial outcomes.
        </p>

        <SectionDivider />

        {/* Disclosure */}
        <Label>Disclosure</Label>
        <p className="text-[10px] leading-relaxed" style={{ color: B.light }}>
          This report is created by a fixed classification model. It is not financial advice.
          The Income Stability Score is not a credit score, not a measure of net worth,
          and not a prediction of future income.
        </p>

        <SectionDivider />

        {/* Official Record */}
        <Label>Official Classification Record</Label>
        <dl className="text-[11px]" style={{ display: "flex", flexDirection: "column", gap: R.itemGap, marginTop: R.paraMb }}>
          {[
            ["Record ID", record.record_id],
            ["Model", record.model_version],
            ["Date", record.assessment_date_utc],
            ["Score", `${record.final_score} — ${record.stability_band}`],
            ["Auth Code", record.authorization_code],
            ["Registry", record.registry_visibility === "public" ? "Publicly Listed" : "Private Record"],
          ].map(([l, v]) => (
            <div key={l} className="flex flex-col sm:flex-row">
              <dt className="sm:w-28 shrink-0" style={{ color: B.light }}>{l}</dt>
              <dd className="font-mono text-[10px] break-all" style={{ color: B.navy }}>{v}</dd>
            </div>
          ))}
        </dl>

        {/* Verification */}
        <p className="text-[10px] leading-relaxed" style={{ color: B.muted, marginTop: R.sectionGap }}>
          Verify this report at <span className="font-medium" style={{ color: B.navy }}>RunPayway.com/verify</span> using the Record ID and Authorization Code.
        </p>

        {/* Model reference */}
        <div className="text-center" style={{ marginTop: R.footerMt, paddingTop: R.paraMb, borderTop: `1px solid ${B.sandDk}` }}>
          <div className="text-[10px]" style={{ color: B.light }}>RunPayway Structural Stability Model RP-1.0</div>
        </div>
      </ReportPage>

      {/* Download */}
      <div className="space-y-3 download-section no-print">
        <button
          onClick={handleDownload}
          disabled={downloading}
          className="w-full sm:w-auto px-6 py-2.5 text-sm font-medium text-white rounded transition-colors disabled:opacity-60"
          style={{ backgroundColor: B.navy }}
          onMouseEnter={(e) => !downloading && (e.currentTarget.style.backgroundColor = B.purple)}
          onMouseLeave={(e) => !downloading && (e.currentTarget.style.backgroundColor = B.navy)}>
          {downloading ? "Generating PDF..." : "Download Report"}
        </button>
        <p className="text-xs" style={{ color: B.light }}>A copy of this report will be sent to your email.</p>
      </div>

      <div className="print-footer hidden print:block">RunPayway™ Income Stability Assessment — Model RP-1.0 | Version 1.0</div>
    </div>
  );
}
