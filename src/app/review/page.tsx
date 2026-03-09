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

const B = {
  navy: "#0E1A2B",
  purple: "#4B3FAE",
  teal: "#1F6D7A",
  sand: "#F7F6F3",
  sandDk: "#EDE9E0",
  muted: "#6B7280",
  light: "#9CA3AF",
};

// ============================================================
// LAYOUT
// ============================================================

function PageHeader({ record }: { record: AssessmentRecord }) {
  return (
    <div className="mb-6 md:mb-8 pb-3 border-b" style={{ borderColor: B.sandDk }}>
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
  );
}

function Label({ children }: { children: React.ReactNode }) {
  return (
    <div className="text-[10px] font-semibold uppercase tracking-[0.12em] mb-2" style={{ color: B.muted }}>{children}</div>
  );
}

function Sidebar({ record }: { record: AssessmentRecord }) {
  const items = [
    ["Persistence", record.income_persistence_label],
    ["Diversity", record.income_source_diversity_label],
    ["Visibility", record.forward_revenue_visibility_label],
    ["Variability", record.income_variability_label],
    ["Labor Dep.", record.active_labor_dependence_label],
    ["Concentration", record.exposure_concentration_label],
  ];
  return (
    <div className="mt-6 pt-4 border-t md:mt-0 md:pt-0 md:border-t-0 md:w-44 md:shrink-0 md:pl-6 md:border-l" style={{ borderColor: B.sandDk }}>
      <Label>Structural Indicators</Label>
      {/* Mobile: compact horizontal grid */}
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
      {/* Desktop: vertical list */}
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
      <div className="border-l-[3px] pl-3 sm:pl-4 py-2 mb-6 md:mb-8" style={{ borderColor: B.teal, backgroundColor: B.sand }}>
        <p className="text-xs italic" style={{ color: B.muted }}>{insight}</p>
      </div>
      <div className="md:flex">
        <div className="flex-1 min-w-0 md:pr-6">{children}</div>
        <Sidebar record={record} />
      </div>
    </div>
  );
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
    <div className="mb-6 md:mb-8">
      <div className="grid grid-cols-4 gap-1 sm:gap-1.5">
        {BANDS.map((b) => {
          const active = band === b.key;
          return (
            <div
              key={b.key}
              className="flex flex-col items-center justify-center py-3 sm:py-4 rounded-lg"
              style={{ backgroundColor: active ? B.purple : B.sand, color: active ? "white" : B.light }}
            >
              <span className="text-[10px] sm:text-xs font-semibold leading-tight text-center">{b.short}</span>
              <span className="text-[9px] sm:text-[10px] mt-0.5 opacity-80">{b.range}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function LaborAssetBar({ label }: { label: string }) {
  const segs = ["Labor-Dependent", "Transitional", "Asset-Supported"];
  const idx = label.toLowerCase().includes("labor") ? 0 : label.toLowerCase().includes("asset") ? 2 : 1;
  return (
    <div className="mb-6">
      <div className="grid grid-cols-3 gap-1">
        {segs.map((s, i) => (
          <div
            key={s}
            className="flex items-center justify-center py-2.5 sm:py-3 rounded-lg text-[9px] sm:text-[11px] font-medium text-center px-1"
            style={{ backgroundColor: i === idx ? B.teal : B.sand, color: i === idx ? "white" : B.light }}
          >
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
    { label: "Active", value: active, color: B.muted },
    { label: "Semi-Persistent", value: semi, color: B.teal },
    { label: "Persistent", value: persistent, color: B.navy },
  ];
  return (
    <div className="space-y-2.5 mb-6">
      {bars.map((bar) => (
        <div key={bar.label}>
          <div className="flex justify-between text-[11px] mb-1">
            <span style={{ color: B.muted }}>{bar.label}</span>
            <span className="font-medium" style={{ color: B.navy }}>{bar.value}%</span>
          </div>
          <div className="h-3 rounded-full overflow-hidden" style={{ backgroundColor: B.sand }}>
            <div className="h-full rounded-full" style={{ width: `${bar.value}%`, backgroundColor: bar.color }} />
          </div>
        </div>
      ))}
    </div>
  );
}

const PEER_DIST: Record<string, number> = { "High Stability": 12, "Established Stability": 28, "Developing Stability": 38, "Limited Stability": 22 };

function PeerBars({ activeBand, groupLabel }: { activeBand: string; groupLabel: string }) {
  return (
    <div className="mb-6">
      <Label>{groupLabel} — Peer Distribution</Label>
      <div className="space-y-2 mt-3">
        {BANDS.map((b) => {
          const pct = PEER_DIST[b.key] || 0;
          const active = activeBand === b.key;
          return (
            <div key={b.key} className="flex items-center gap-2 sm:gap-3">
              <div className="w-16 sm:w-24 text-[10px] sm:text-[11px] text-right shrink-0" style={{ color: active ? B.navy : B.light }}>
                {b.short}
              </div>
              <div className="flex-1 h-5 rounded-full overflow-hidden relative" style={{ backgroundColor: B.sand }}>
                <div className="h-full rounded-full" style={{ width: `${pct}%`, backgroundColor: active ? B.purple : B.sandDk }} />
                {active && (
                  <span className="absolute right-2 top-1/2 -translate-y-1/2 text-[8px] sm:text-[9px] font-medium" style={{ color: B.navy }}>
                    Your Band
                  </span>
                )}
              </div>
              <div className="w-8 text-[10px] shrink-0" style={{ color: active ? B.navy : B.light }}>{pct}%</div>
            </div>
          );
        })}
      </div>
      <p className="text-[10px] mt-3 italic" style={{ color: B.light }}>
        Distribution reflects typical structural stability patterns within the sector under Model RP-1.0.
      </p>
    </div>
  );
}

function EvolutionPath({ steps, currentLabel, currentPosition }: { steps: string[]; currentLabel: string; currentPosition: number }) {
  const idx = steps.length > 1 ? Math.round((currentPosition / 100) * (steps.length - 1)) : 0;
  return (
    <div className="mb-6">
      {/* Mobile: vertical list */}
      <div className="sm:hidden space-y-2">
        {steps.map((step, i) => {
          const active = i === idx;
          const past = i < idx;
          return (
            <div key={i} className="flex items-center gap-3">
              <div
                className="w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-semibold shrink-0"
                style={{ backgroundColor: active ? B.purple : past ? B.teal : B.sand, color: active || past ? "white" : B.light }}
              >
                {i + 1}
              </div>
              <span className="text-xs" style={{ color: active ? B.navy : B.light, fontWeight: active ? 600 : 400 }}>{step}</span>
            </div>
          );
        })}
      </div>
      {/* Desktop: horizontal */}
      <div className="hidden sm:flex items-start">
        {steps.map((step, i) => {
          const active = i === idx;
          const past = i < idx;
          return (
            <div key={i} className="flex-1 flex flex-col items-center relative">
              {i > 0 && <div className="absolute top-3.5 right-1/2 w-full h-px -z-0" style={{ backgroundColor: past ? B.teal : B.sandDk }} />}
              <div className="w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-semibold z-10" style={{ backgroundColor: active ? B.purple : past ? B.teal : B.sand, color: active || past ? "white" : B.light }}>
                {i + 1}
              </div>
              <div className="text-[9px] text-center mt-1.5 leading-tight max-w-[72px]" style={{ color: active ? B.navy : B.light, fontWeight: active ? 600 : 400 }}>
                {step}
              </div>
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
    <div className="mb-6">
      <Label>Structural Stability Trajectory</Label>
      <div className="flex flex-col sm:flex-row items-stretch gap-0 rounded-lg overflow-hidden mt-3" style={{ backgroundColor: B.sand }}>
        <div className="flex-1 text-center py-4 sm:py-5 px-4">
          <div className="text-[10px]" style={{ color: B.light }}>Current Score</div>
          <div className="text-2xl sm:text-3xl font-bold mt-1" style={{ color: B.navy }}>{currentScore}</div>
          <div className="text-[11px] mt-1" style={{ color: B.muted }}>{currentBand}</div>
        </div>
        {hasProjection && (
          <>
            <div className="flex items-center justify-center py-1 sm:py-0 sm:px-2" style={{ color: B.light }}>
              <svg className="rotate-90 sm:rotate-0" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M5 12h14M13 6l6 6-6 6" />
              </svg>
            </div>
            <div className="flex-1 text-center py-4 sm:py-5 px-4">
              <div className="text-[10px]" style={{ color: B.light }}>Projected Score</div>
              <div className="text-2xl sm:text-3xl font-bold mt-1" style={{ color: B.teal }}>{projectedScore}</div>
              <div className="text-[11px] mt-1" style={{ color: B.muted }}>{projectedBand}</div>
            </div>
          </>
        )}
        {!hasProjection && (
          <div className="flex-1 flex items-center justify-center py-4 px-4">
            <p className="text-xs text-center" style={{ color: B.muted }}>
              {projectedScore != null ? "Constraint at maximum level." : "Projection available with updated assessment."}
            </p>
          </div>
        )}
      </div>
      <p className="text-[10px] mt-2 italic" style={{ color: B.light }}>
        Illustrative only — projection does not modify the issued record.
      </p>
    </div>
  );
}

// ============================================================
// MAIN PAGE
// ============================================================

export default function ReviewPage() {
  const router = useRouter();
  const [record, setRecord] = useState<AssessmentRecord | null>(null);

  useEffect(() => {
    const stored = sessionStorage.getItem("rp_record");
    if (!stored) { router.push("/"); return; }
    setRecord(JSON.parse(stored));
  }, [router]);

  if (!record) return null;

  const evolutionSteps: string[] = JSON.parse(record.evolution_path_steps_payload);
  const sectorMechanisms: string[] = JSON.parse(record.sector_mechanisms_payload);

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Screen-only header */}
      <div className="no-print">
        <h1 className="text-lg sm:text-xl font-semibold" style={{ color: B.navy }}>Income Stability Assessment</h1>
        <p className="text-sm mt-1" style={{ color: B.muted }}>Model RP-1.0 | Version 1.0</p>
      </div>

      {/* ==================== PAGE 1 ==================== */}
      <Page record={record} insight={record.page_1_key_insight_text}>
        {/* Score */}
        <div className="mb-2">
          <div className="text-4xl sm:text-5xl font-bold" style={{ color: B.navy }}>{record.final_score}</div>
          <div className="text-sm sm:text-base font-semibold mt-1" style={{ color: B.navy }}>{record.stability_band}</div>
          <div className="text-[10px] mt-1" style={{ color: B.light }}>
            Score Range: 0–100 · Higher = greater structural persistence
          </div>
        </div>

        {record.peer_stability_percentile_label && (
          <p className="text-xs mb-6" style={{ color: B.muted }}>
            <span className="font-medium" style={{ color: B.navy }}>{record.peer_stability_percentile_label} percentile</span>{" "}
            within {record.industry_sector}
          </p>
        )}

        <StabilitySpectrum band={record.stability_band} />

        {/* Executive Summary */}
        <div className="rounded-lg p-4 sm:p-5 mb-6 md:mb-8" style={{ backgroundColor: B.sand }}>
          <div className="text-[11px] font-semibold uppercase tracking-wider mb-3 sm:mb-4" style={{ color: B.navy }}>
            Executive Structural Summary
          </div>
          <div className="space-y-3 sm:space-y-0 sm:grid sm:grid-cols-2 sm:gap-x-6 sm:gap-y-3">
            <div>
              <div className="text-[10px] uppercase tracking-wider mb-0.5" style={{ color: B.teal }}>Constraint</div>
              <div className="text-xs font-medium" style={{ color: B.navy }}>{record.primary_constraint_label}</div>
            </div>
            <div>
              <div className="text-[10px] uppercase tracking-wider mb-0.5" style={{ color: B.teal }}>Priority</div>
              <div className="text-xs font-medium" style={{ color: B.navy }}>{record.structural_priority_label}</div>
            </div>
            <div className="sm:col-span-2">
              <div className="text-[10px] uppercase tracking-wider mb-1" style={{ color: B.teal }}>Drivers</div>
              <div className="flex flex-wrap gap-1.5">
                {[record.driver_1_label, record.driver_2_label, record.driver_3_label].map((d) => (
                  <span key={d} className="text-[10px] font-medium px-2 py-0.5 rounded-md bg-white" style={{ color: B.navy }}>{d}</span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Structural Profile */}
        <Label>Structural Profile</Label>
        <dl className="space-y-1 sm:grid sm:grid-cols-2 sm:gap-x-6 sm:gap-y-1.5 sm:space-y-0 text-xs mt-2">
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

      {/* ==================== PAGE 2 ==================== */}
      <Page record={record} insight={record.page_2_key_insight_text}>
        {/* Methodology */}
        <div className="rounded-lg p-3 sm:p-4 mb-6 md:mb-8" style={{ backgroundColor: B.sand }}>
          <div className="text-[10px] font-semibold uppercase tracking-wider mb-1" style={{ color: B.navy }}>Methodology</div>
          <p className="text-xs leading-relaxed" style={{ color: B.muted }}>
            The Income Stability Score evaluates six structural characteristics of an income system
            using a deterministic classification model (RP-1.0) over the preceding twelve-month period.
          </p>
        </div>

        <Label>Labor–Asset Spectrum</Label>
        <p className="text-xs mb-3" style={{ color: B.muted }}>
          Degree to which income persistence depends on continued labor versus asset-supported structures.
        </p>
        <LaborAssetBar label={record.labor_asset_position_label} />

        <Label>Structural Income Map</Label>
        <p className="text-xs mb-3" style={{ color: B.muted }}>
          Estimated distribution of income components within the current system.
        </p>
        <IncomeMapBars active={record.active_income_level} semi={record.semi_persistent_income_level} persistent={record.persistent_income_level} />

        <Label>Structural Indicators</Label>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 mb-6 md:mb-8">
          {[
            ["Income Persistence", record.income_persistence_label],
            ["Source Diversity", record.income_source_diversity_label],
            ["Forward Visibility", record.forward_revenue_visibility_label],
            ["Variability", record.income_variability_label],
            ["Labor Dependence", record.active_labor_dependence_label],
            ["Concentration", record.exposure_concentration_label],
          ].map(([l, v]) => (
            <div key={l} className="flex justify-between rounded-md px-3 py-2" style={{ backgroundColor: B.sand }}>
              <span className="text-[10px]" style={{ color: B.muted }}>{l}</span>
              <span className="text-[10px] font-medium" style={{ color: B.navy }}>{v}</span>
            </div>
          ))}
        </div>

        <PeerBars activeBand={record.stability_band} groupLabel={record.peer_benchmark_group_label} />
      </Page>

      {/* ==================== PAGE 3 ==================== */}
      <Page record={record} insight={record.page_5_key_insight_text}>
        <Label>Structural Drivers</Label>
        <div className="space-y-2.5 mb-6 md:mb-8">
          {[
            { l: record.driver_1_label, t: record.driver_1_text },
            { l: record.driver_2_label, t: record.driver_2_text },
            { l: record.driver_3_label, t: record.driver_3_text },
          ].map((d) => (
            <div key={d.l}>
              <div className="text-xs font-medium" style={{ color: B.navy }}>{d.l}</div>
              <p className="text-[11px] mt-0.5" style={{ color: B.muted }}>{d.t}</p>
            </div>
          ))}
        </div>

        <Label>Structural Priority</Label>
        <p className="text-xs mb-6" style={{ color: B.muted }}>
          The primary structural priority identified by Model RP-1.0 is{" "}
          <strong style={{ color: B.navy }}>{record.structural_priority_label}</strong>.
        </p>

        <Trajectory
          currentScore={record.final_score}
          currentBand={record.stability_band}
          projectedScore={record.projected_final_score}
          projectedBand={record.projected_stability_band}
        />

        <Label>Sector Evolution Path</Label>
        <p className="text-xs mb-3" style={{ color: B.muted }}>
          Common structural income development stages within this sector.
        </p>
        <EvolutionPath steps={evolutionSteps} currentLabel={record.current_evolution_stage_label} currentPosition={record.current_evolution_stage_position} />

        <Label>Sector Stability Mechanisms</Label>
        <ul className="text-xs list-disc list-inside mb-6" style={{ color: B.muted }}>
          {sectorMechanisms.map((m) => <li key={m}>{m}</li>)}
        </ul>

        {/* Disclosure + Record */}
        <div className="border-t pt-4 sm:pt-5 mt-2" style={{ borderColor: B.sandDk }}>
          <p className="text-[10px] leading-relaxed mb-4" style={{ color: B.light }}>
            This assessment is generated by a deterministic structural classification model
            and does not constitute financial advice. Verify at{" "}
            <span className="font-medium" style={{ color: B.navy }}>RunPayway.com/verify</span>.
          </p>

          <Label>Official Classification Record</Label>
          <dl className="space-y-0.5 text-[11px] mt-2">
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
        </div>
      </Page>

      {/* Download */}
      <div className="space-y-3 download-section no-print">
        <button
          onClick={() => window.print()}
          className="w-full sm:w-auto px-6 py-2.5 text-sm font-medium text-white rounded transition-colors"
          style={{ backgroundColor: B.navy }}
          onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = B.purple)}
          onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = B.navy)}
        >
          Download Assessment PDF
        </button>
        <p className="text-xs" style={{ color: B.light }}>A copy of this diagnostic record will be sent by email.</p>
      </div>

      <div className="print-footer hidden print:block">
        RunPayway™ Income Stability Assessment — Model RP-1.0 | Version 1.0
      </div>
    </div>
  );
}
