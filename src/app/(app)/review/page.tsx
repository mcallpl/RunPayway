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
  const strong = labels.filter((l) => /high|very high|strong/i.test(l)).length;
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
  if (p >= 25) return `A score at the ${label} percentile means ${name} is less stable than most income systems in the ${r.industry_sector} sector.`;
  return `A score at the ${label} percentile means ${name} is less stable than most income systems in the ${r.industry_sector} sector.`;
}

// Industry stability benchmark data (deterministic from band distribution)
function getIndustryBenchmark(finalScore: number) {
  // Based on locked peer distribution: 12% High, 28% Established, 38% Developing, 22% Limited
  // Weighted average ≈ (90*0.12 + 69.5*0.28 + 49.5*0.38 + 19.5*0.22) = 48.5 → 48
  const avgScore = 48;
  const top20Range = 65;
  const distance = Math.max(0, top20Range - finalScore);
  return { avgScore, top20Range, distance };
}

// Risk exposure templates
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

// ============================================================
// LAYOUT COMPONENTS
// ============================================================

function PageHeader({ record }: { record: AssessmentRecord }) {
  return (
    <div className="mb-6">
      {/* Gradient strip */}
      <div className="h-[5px] -mx-5 sm:-mx-6 md:-mx-8 -mt-5 sm:-mt-6 md:-mt-8 rounded-t-lg overflow-hidden" style={{ background: B.gradient }} />
      <div className="pt-4 pb-3 border-b" style={{ borderColor: B.sandDk }}>
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

function Label({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`text-[10px] font-semibold uppercase tracking-[0.12em] mb-3 ${className}`} style={{ color: B.muted }}>{children}</div>
  );
}

function Sidebar({ record }: { record: AssessmentRecord }) {
  const items = [
    ["Continues", record.income_persistence_label],
    ["Sources", record.income_source_diversity_label],
    ["Scheduled", record.forward_revenue_visibility_label],
    ["Stability", record.income_variability_label],
    ["Work Dep.", record.active_labor_dependence_label],
    ["Concentration", record.exposure_concentration_label],
  ];
  return (
    <div className="mt-6 pt-5 border-t md:mt-0 md:pt-0 md:border-t-0 md:w-44 md:shrink-0 md:pl-6 md:border-l" style={{ borderColor: B.sandDk }}>
      <Label>Indicators</Label>
      <div className="grid grid-cols-3 gap-2 mt-3 md:hidden">
        <div className="col-span-3 flex gap-4">
          <div>
            <div className="text-[10px]" style={{ color: B.light }}>Band</div>
            <div className="text-sm font-semibold" style={{ color: B.navy }}>{record.stability_band}</div>
          </div>
          <div>
            <div className="text-[10px]" style={{ color: B.light }}>Score</div>
            <div className="text-sm font-semibold" style={{ color: B.navy }}>{record.final_score}</div>
          </div>
        </div>
        {items.map(([label, value]) => (
          <div key={label}>
            <div className="text-[9px]" style={{ color: B.light }}>{label}</div>
            <div className="text-[11px] font-medium" style={{ color: B.navy }}>{value}</div>
          </div>
        ))}
      </div>
      <div className="hidden md:block space-y-2.5 mt-3">
        {[["Band", record.stability_band], ["Score", String(record.final_score)]].map(([l, v]) => (
          <div key={l}>
            <div className="text-[10px]" style={{ color: B.light }}>{l}</div>
            <div className="text-sm font-semibold" style={{ color: B.navy }}>{v}</div>
          </div>
        ))}
        <div className="border-t pt-2" style={{ borderColor: B.sand }}>
          {items.map(([label, value]) => (
            <div key={label} className="py-1">
              <div className="text-[9px]" style={{ color: B.light }}>{label}</div>
              <div className="text-[11px] font-medium" style={{ color: B.navy }}>{value}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function Page({ record, insight, children }: { record: AssessmentRecord; insight: string; children: React.ReactNode }) {
  return (
    <div className="report-page bg-white border rounded-lg p-5 sm:p-6 md:p-8" style={{ borderColor: "#E5E7EB" }}>
      <PageHeader record={record} />
      <div className="border-l-[3px] pl-3 sm:pl-4 py-2 mb-6" style={{ borderColor: B.teal, backgroundColor: B.sand }}>
        <p className="text-xs italic" style={{ color: B.muted }}>{insight}</p>
      </div>
      <div className="md:flex">
        <div className="flex-1 min-w-0 md:pr-6">{children}</div>
        <Sidebar record={record} />
      </div>
    </div>
  );
}

function SectionGap() {
  return <div className="h-6 md:h-8" />;
}

// ============================================================
// VISUALS
// ============================================================

const BANDS = [
  { key: "High Stability", short: "High", range: "80–100" },
  { key: "Established Stability", short: "Estab.", range: "60–79" },
  { key: "Developing Stability", short: "Devel.", range: "40–59" },
  { key: "Limited Stability", short: "Limited", range: "0–39" },
];

function StabilitySpectrum({ band }: { band: string }) {
  return (
    <div className="grid grid-cols-4 gap-1 sm:gap-1.5">
      {BANDS.map((b) => {
        const active = band === b.key;
        return (
          <div key={b.key} className="flex flex-col items-center justify-center py-3 sm:py-4 rounded-lg"
            style={{ backgroundColor: active ? B.purple : B.sand, color: active ? "white" : B.light }}>
            <span className="text-[10px] sm:text-xs font-semibold leading-tight text-center">{b.short}</span>
            <span className="text-[9px] sm:text-[10px] mt-0.5 opacity-80">{b.range}</span>
          </div>
        );
      })}
    </div>
  );
}

function LaborAssetBar({ label }: { label: string }) {
  const segs = ["Work-Dependent", "Transitional", "Asset-Supported"];
  const idx = label.toLowerCase().includes("labor") ? 0 : label.toLowerCase().includes("asset") ? 2 : 1;
  return (
    <div>
      <div className="grid grid-cols-3 gap-1">
        {segs.map((s, i) => (
          <div key={s} className="flex items-center justify-center py-2.5 sm:py-3 rounded-lg text-[9px] sm:text-[11px] font-medium text-center px-1"
            style={{ backgroundColor: i === idx ? B.teal : B.sand, color: i === idx ? "white" : B.light }}>
            {s}
          </div>
        ))}
      </div>
      <div className="text-[11px] mt-2 text-center" style={{ color: B.muted }}>Position: {label}</div>
    </div>
  );
}

function IncomeMapBars({ active, semi, persistent }: { active: number; semi: number; persistent: number }) {
  const bars = [
    { label: "Active Income", desc: "Earned by doing work", value: active, color: B.muted },
    { label: "Semi-Persistent", desc: "Repeats for a while, then stops", value: semi, color: B.teal },
    { label: "Persistent", desc: "Continues with little work", value: persistent, color: B.navy },
  ];
  return (
    <div className="space-y-3">
      {bars.map((bar) => (
        <div key={bar.label}>
          <div className="flex justify-between text-[11px] mb-0.5">
            <span style={{ color: B.muted }}>{bar.label}</span>
            <span className="font-medium" style={{ color: B.navy }}>{bar.value}%</span>
          </div>
          <div className="text-[9px] mb-1" style={{ color: B.light }}>{bar.desc}</div>
          <div className="h-3 rounded-full overflow-hidden" style={{ backgroundColor: B.sand }}>
            <div className="h-full rounded-full" style={{ width: `${bar.value}%`, backgroundColor: bar.color }} />
          </div>
        </div>
      ))}
      <p className="text-[10px] italic mt-2" style={{ color: B.light }}>
        Income that continues without new work usually improves stability.
      </p>
    </div>
  );
}

function EvolutionPath({ steps, currentLabel, currentPosition }: { steps: string[]; currentLabel: string; currentPosition: number }) {
  const idx = steps.length > 1 ? Math.round((currentPosition / 100) * (steps.length - 1)) : 0;
  return (
    <div>
      <div className="sm:hidden space-y-2">
        {steps.map((step, i) => {
          const active = i === idx; const past = i < idx;
          return (
            <div key={i} className="flex items-center gap-3">
              <div className="w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-semibold shrink-0"
                style={{ backgroundColor: active ? B.purple : past ? B.teal : B.sand, color: active || past ? "white" : B.light }}>{i + 1}</div>
              <span className="text-xs" style={{ color: active ? B.navy : B.light, fontWeight: active ? 600 : 400 }}>{step}</span>
            </div>
          );
        })}
      </div>
      <div className="hidden sm:flex items-start">
        {steps.map((step, i) => {
          const active = i === idx; const past = i < idx;
          return (
            <div key={i} className="flex-1 flex flex-col items-center relative">
              {i > 0 && <div className="absolute top-3.5 right-1/2 w-full h-px -z-0" style={{ backgroundColor: past ? B.teal : B.sandDk }} />}
              <div className="w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-semibold z-10"
                style={{ backgroundColor: active ? B.purple : past ? B.teal : B.sand, color: active || past ? "white" : B.light }}>{i + 1}</div>
              <div className="text-[9px] text-center mt-1.5 leading-tight max-w-[72px]" style={{ color: active ? B.navy : B.light, fontWeight: active ? 600 : 400 }}>{step}</div>
            </div>
          );
        })}
      </div>
      <div className="text-[11px] mt-3 text-center font-medium" style={{ color: B.navy }}>Current Stage: {currentLabel}</div>
    </div>
  );
}

function Trajectory({ currentScore, currentBand, projectedScore, projectedBand }: { currentScore: number; currentBand: string; projectedScore?: number; projectedBand?: string }) {
  const hasProjection = projectedScore != null && projectedScore !== currentScore;
  return (
    <div>
      <Label>Stability Trajectory</Label>
      <div className="flex flex-col sm:flex-row items-stretch gap-0 rounded-lg overflow-hidden mt-4" style={{ backgroundColor: B.sand }}>
        <div className="flex-1 text-center py-4 sm:py-5 px-4">
          <div className="text-[10px]" style={{ color: B.light }}>Current Score</div>
          <div className="text-2xl sm:text-3xl font-bold mt-1" style={{ color: B.navy }}>{currentScore}</div>
          <div className="text-[11px] mt-1" style={{ color: B.muted }}>{currentBand}</div>
        </div>
        {hasProjection && (
          <>
            <div className="flex items-center justify-center py-1 sm:py-0 sm:px-2" style={{ color: B.light }}>
              <svg className="rotate-90 sm:rotate-0" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M5 12h14M13 6l6 6-6 6" /></svg>
            </div>
            <div className="flex-1 text-center py-4 sm:py-5 px-4">
              <div className="text-[10px]" style={{ color: B.light }}>Potential Score</div>
              <div className="text-2xl sm:text-3xl font-bold mt-1" style={{ color: B.teal }}>{projectedScore}</div>
              <div className="text-[11px] mt-1" style={{ color: B.muted }}>{projectedBand}</div>
            </div>
          </>
        )}
        {!hasProjection && (
          <div className="flex-1 flex items-center justify-center py-4 px-4">
            <p className="text-xs text-center" style={{ color: B.muted }}>
              {projectedScore != null ? "Already at highest level for this area." : "Available with updated assessment."}
            </p>
          </div>
        )}
      </div>
      <p className="text-[10px] mt-2 italic" style={{ color: B.light }}>This is an illustration. It does not change the official score.</p>
    </div>
  );
}

function IndustryBenchmark({ record }: { record: AssessmentRecord }) {
  const bench = getIndustryBenchmark(record.final_score);
  const rows = [
    [`Average ${record.industry_sector} Stability Score`, String(bench.avgScore)],
    ["Top 20% Stability Range", `${bench.top20Range}+`],
    ["Your Score", String(record.final_score)],
    ["Distance From Top Stability Tier", `${bench.distance} points`],
  ];
  return (
    <div>
      <Label>Industry Stability Benchmark</Label>
      <div className="rounded-lg overflow-hidden border" style={{ borderColor: B.sandDk }}>
        {rows.map(([label, value], i) => (
          <div key={label} className="flex justify-between items-center px-4 py-2.5 text-xs"
            style={{ backgroundColor: i % 2 === 0 ? B.sand : "white" }}>
            <span style={{ color: B.muted }}>{label}</span>
            <span className="font-semibold" style={{ color: i === 2 ? B.purple : B.navy }}>{value}</span>
          </div>
        ))}
      </div>
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
  const margin = 0.4;
  const contentWidth = pageWidth - margin * 2;

  for (let i = 0; i < pages.length; i++) {
    const el = pages[i] as HTMLElement;
    const canvas = await html2canvas(el, {
      scale: 2,
      useCORS: true,
      backgroundColor: "#ffffff",
      logging: false,
    });

    const imgRatio = canvas.height / canvas.width;
    const imgHeight = contentWidth * imgRatio;
    const finalHeight = Math.min(imgHeight, pageHeight - margin * 2);

    if (i > 0) pdf.addPage();
    pdf.addImage(
      canvas.toDataURL("image/png"),
      "PNG",
      margin,
      margin,
      contentWidth,
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

  const handleDownload = async () => {
    setDownloading(true);
    try {
      await downloadPDF(record.record_id);
    } finally {
      setDownloading(false);
    }
  };

  return (
    <div className="space-y-6 sm:space-y-8">
      <div className="no-print">
        <h1 className="text-lg sm:text-xl font-semibold" style={{ color: B.navy }}>Income Stability Assessment</h1>
        <p className="text-sm mt-1" style={{ color: B.muted }}>Model RP-1.0 | Version 1.0</p>
      </div>

      {/* ==================== PAGE 1 — Score Result ==================== */}
      <Page record={record} insight={record.page_1_key_insight_text}>
        <p className="text-xs mb-4" style={{ color: B.muted }}>
          This report shows how reliable an income system is over time.
        </p>

        <div className="rounded-xl p-5 sm:p-6 mb-2" style={{ background: B.gradient }}>
          <div className="text-[10px] uppercase tracking-wider mb-1" style={{ color: "rgba(255,255,255,0.55)" }}>RunPayway Stability Score™</div>
          <div className="text-4xl sm:text-5xl font-bold" style={{ color: "#ffffff" }}>{record.final_score}</div>
          <div className="text-sm sm:text-base font-semibold mt-1" style={{ color: "#ffffff" }}>{record.stability_band}</div>
          <div className="text-[10px] mt-1" style={{ color: "rgba(255,255,255,0.45)" }}>Score Range: 0–100 · Higher = more reliable income over time</div>
        </div>

        <SectionGap />

        {/* Percentile */}
        {record.peer_stability_percentile_label && (
          <div className="mb-2">
            <p className="text-xs" style={{ color: B.muted }}>
              <span className="font-medium" style={{ color: B.navy }}>{record.peer_stability_percentile_label} percentile</span>{" "}within {record.industry_sector}
            </p>
            <p className="text-[11px] mt-2 leading-relaxed" style={{ color: B.muted }}>
              {percentileExplanation(record)}
            </p>
          </div>
        )}

        <SectionGap />
        <StabilitySpectrum band={record.stability_band} />
        <SectionGap />

        {/* Profile */}
        <Label>Profile</Label>
        <dl className="space-y-1 sm:grid sm:grid-cols-2 sm:gap-x-6 sm:gap-y-1.5 sm:space-y-0 text-xs mt-3">
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
      </Page>

      {/* ==================== PAGE 2 — Income Structure ==================== */}
      <Page record={record} insight={record.page_2_key_insight_text}>
        <Label>Income Structure Map</Label>
        <p className="text-xs mb-1" style={{ color: B.muted }}>
          {possessive} income comes from three types of sources.
        </p>
        <IncomeMapBars active={record.active_income_level} semi={record.semi_persistent_income_level} persistent={record.persistent_income_level} />

        <SectionGap />

        <Label>Structural Indicators</Label>
        <p className="text-[10px] mb-2 italic" style={{ color: B.light }}>
          These indicators show how income is structured, not how much money is earned.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
          {[
            ["Income That Continues", record.income_persistence_label],
            ["Number of Income Sources", record.income_source_diversity_label],
            ["Income Already Scheduled", record.forward_revenue_visibility_label],
            ["Monthly Income Stability", record.income_variability_label],
            ["Dependence on Your Personal Work", record.active_labor_dependence_label],
            ["Dependence on One Client or Source", record.exposure_concentration_label],
          ].map(([l, v]) => (
            <div key={l} className="flex justify-between rounded-md px-3 py-2" style={{ backgroundColor: B.sand }}>
              <span className="text-[10px]" style={{ color: B.muted }}>{l}</span>
              <span className="text-[10px] font-medium" style={{ color: B.navy }}>{v}</span>
            </div>
          ))}
        </div>

        <SectionGap />

        <Label>Work–Asset Spectrum</Label>
        <p className="text-xs mb-4" style={{ color: B.muted }}>
          Shows whether income depends mostly on active work or on assets and recurring structures.
        </p>
        <LaborAssetBar label={record.labor_asset_position_label} />
      </Page>

      {/* ==================== PAGE 3 — System Diagnosis ==================== */}
      <Page record={record} insight={record.page_3_key_insight_text}>
        <h2 className="text-sm font-semibold uppercase tracking-[0.1em]" style={{ color: B.navy }}>
          System Diagnosis
        </h2>
        <p className="text-xs mt-1 mb-2" style={{ color: B.muted }}>
          This section explains how the structure of {possessive} income affects stability.
        </p>

        <SectionGap />

        <Label>Overview</Label>
        <div className="text-xs leading-relaxed space-y-3" style={{ color: B.muted }}>
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

        <SectionGap />

        <Label>What This Means</Label>
        <p className="text-xs leading-relaxed" style={{ color: B.muted }}>
          Income systems with similar structures usually fall in
          the <strong style={{ color: B.navy }}>{record.stability_band}</strong> band.
          Without changes to {record.primary_constraint_label}, income reliability will likely stay
          tied to active work.
        </p>

        <SectionGap />

        <Label>Sector Pattern</Label>
        <p className="text-xs leading-relaxed" style={{ color: B.muted }}>
          In the {record.industry_sector} sector, income systems become more stable when
          recurring revenue or asset income is added.
        </p>
      </Page>

      {/* ==================== PAGE 4 — Risk Exposure + Trajectory ==================== */}
      <Page record={record} insight={record.page_4_key_insight_text}>
        {/* Risk Exposure Box */}
        <div className="rounded-lg p-4 sm:p-5 border" style={{ borderColor: B.sandDk, backgroundColor: B.sand }}>
          <div className="text-[11px] font-semibold uppercase tracking-wider mb-4" style={{ color: B.navy }}>
            Risk Exposure
          </div>
          <div className="space-y-4">
            <div>
              <div className="text-[10px] uppercase tracking-wider mb-0.5" style={{ color: B.teal }}>Primary Risk</div>
              <div className="text-xs font-medium" style={{ color: B.navy }}>{record.primary_constraint_label}</div>
            </div>
            <div>
              <div className="text-[10px] uppercase tracking-wider mb-0.5" style={{ color: B.teal }}>How It Works</div>
              <p className="text-xs leading-relaxed" style={{ color: B.muted }}>{riskData.mechanism}</p>
            </div>
            <div>
              <div className="text-[10px] uppercase tracking-wider mb-0.5" style={{ color: B.teal }}>Impact on Stability</div>
              <p className="text-xs leading-relaxed" style={{ color: B.muted }}>{riskData.impact}</p>
            </div>
          </div>
        </div>

        <SectionGap />

        {/* Constraint + Priority */}
        <Label>Main Constraint</Label>
        <div className="text-xs font-medium" style={{ color: B.navy }}>{record.primary_constraint_label}</div>

        <SectionGap />

        <Label>Priority</Label>
        <div className="text-xs font-medium" style={{ color: B.navy }}>{record.structural_priority_label}</div>

        <SectionGap />

        <Trajectory
          currentScore={record.final_score}
          currentBand={record.stability_band}
          projectedScore={record.projected_final_score}
          projectedBand={record.projected_stability_band}
        />
      </Page>

      {/* ==================== PAGE 5 — Sector Evolution + Benchmark ==================== */}
      <Page record={record} insight={record.page_5_key_insight_text}>
        <Label>Sector Evolution Path</Label>
        <p className="text-xs mb-4" style={{ color: B.muted }}>
          This chart shows how income systems in this sector often become more stable over time.
        </p>
        <EvolutionPath steps={evolutionSteps} currentLabel={record.current_evolution_stage_label} currentPosition={record.current_evolution_stage_position} />

        <SectionGap />

        <Label>Sector Stability Mechanisms</Label>
        <p className="text-xs mb-2" style={{ color: B.muted }}>
          Ways income systems in this sector become more reliable:
        </p>
        <ul className="text-xs list-disc list-inside" style={{ color: B.muted }}>
          {sectorMechanisms.map((m) => <li key={m}>{m}</li>)}
        </ul>

        <SectionGap />

        <IndustryBenchmark record={record} />

        <SectionGap />

        {/* Drivers */}
        <Label>Drivers Supporting Stability</Label>
        <div className="space-y-2">
          {[record.driver_1_label, record.driver_2_label, record.driver_3_label].map((d) => (
            <span key={d} className="inline-block text-[10px] font-medium px-2 py-0.5 rounded-md mr-1.5" style={{ backgroundColor: B.sand, color: B.navy }}>{d}</span>
          ))}
        </div>
      </Page>

      {/* ==================== PAGE 6 — Registry Record ==================== */}
      <Page record={record} insight={record.page_6_key_insight_text}>
        {/* Disclosure */}
        <Label>Disclosure</Label>
        <p className="text-[10px] leading-relaxed" style={{ color: B.light }}>
          This report is created by a fixed classification model. It is not financial advice.
          The Income Stability Score is not a credit score, not a measure of net worth,
          and not a prediction of future income.
        </p>

        <SectionGap />

        {/* Verification */}
        <Label>Record Verification</Label>
        <div className="text-xs leading-relaxed space-y-2" style={{ color: B.muted }}>
          <p>This assessment is issued as a verifiable RunPayway classification record.</p>
          <p>
            Verify this report using the Record ID and Authorization Code at{" "}
            <span className="font-medium" style={{ color: B.navy }}>RunPayway.com/verify</span>.
          </p>
        </div>

        <SectionGap />

        {/* Official Record */}
        <Label>Official Classification Record</Label>
        <dl className="space-y-0.5 text-[11px] mt-3">
          {[
            ["Record ID", record.record_id],
            ["Model", record.model_version],
            ["Date", record.assessment_date_utc],
            ["Score", `${record.final_score} — ${record.stability_band}`],
            ["Auth Code", record.authorization_code],
            ["Registry", record.registry_visibility === "public" ? "Publicly Listed" : "Private Record"],
          ].map(([l, v]) => (
            <div key={l} className="flex flex-col sm:flex-row">
              <dt className="sm:w-24 shrink-0" style={{ color: B.light }}>{l}</dt>
              <dd className="font-mono text-[10px] break-all" style={{ color: B.navy }}>{v}</dd>
            </div>
          ))}
        </dl>
      </Page>

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
