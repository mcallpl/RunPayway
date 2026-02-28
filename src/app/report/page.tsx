"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import {
  getPositionSentence1,
  getPositionSentence2,
  getPositionSentence3,
  getExposureTier,
  getPillarBullets,
} from "@/lib/rendering/sentences";
import type { EngineOutput } from "@/lib/engine/types";

export default function ReportPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          <p className="text-sm text-neutral-500">Loading report...</p>
        </div>
      }
    >
      <ReportContent />
    </Suspense>
  );
}

function ReportContent() {
  const searchParams = useSearchParams();
  const [report, setReport] = useState<EngineOutput | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const cached = sessionStorage.getItem("rp_report");
    if (cached) {
      try {
        setReport(JSON.parse(cached));
        setLoading(false);
        return;
      } catch {
        // fall through to API
      }
    }

    const id = searchParams.get("id");
    if (id) {
      fetch(`/api/report?id=${encodeURIComponent(id)}`)
        .then((r) => r.json())
        .then((data) => {
          if (data.engineOutput) {
            setReport(data.engineOutput);
          }
        })
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, [searchParams]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-sm text-neutral-500">Loading report...</p>
      </div>
    );
  }

  if (!report) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-sm text-neutral-500">Report not found.</p>
      </div>
    );
  }

  const stabilityTier = getExposureTier(Math.round(report.stabilityInternal));
  const diversityTier = getExposureTier(Math.round(report.diversityInternal));
  const independenceTier = getExposureTier(Math.round(report.independenceInternal));

  const stabilityBullets = getPillarBullets("Stability Base", report.stabilityInternal);
  const diversityBullets = getPillarBullets("Revenue Diversity", report.diversityInternal);
  const independenceBullets = getPillarBullets("System Independence", report.independenceInternal);

  return (
    <div className="min-h-screen bg-white">
      {/* Top Bar */}
      <div className="flex items-center justify-between px-6 py-4">
        <span className="text-sm font-semibold tracking-wide">RUNPAYWAY™</span>
        <span className="text-xs text-neutral-500">
          Model RP-1.0 | Version 1.0
        </span>
      </div>
      <div className="border-t border-neutral-200" />

      <div className="max-w-2xl mx-auto px-6 py-8">
        {/* Reference header */}
        <div className="mb-8 text-xs text-neutral-400 space-y-0.5">
          <p>Structural Reference: {report.referenceId}</p>
          <p>Issued: {new Date(report.timestampUTC).toUTCString()}</p>
        </div>

        {/* Section 1.0 — Structural Classification Summary */}
        <section className="mb-10">
          <SectionHeader number="1.0" title="Structural Classification Summary" />
          <div className="mt-4">
            <div className="text-5xl font-light mb-1">{report.finalScore}</div>
            <div className="text-sm font-medium mb-4">{report.band}</div>

            <div className="border border-neutral-200 p-4 text-xs text-neutral-500 space-y-1">
              <p>Foundation (0–49)</p>
              <p>Developing (50–69)</p>
              <p>Strong (70–87)</p>
              <p>Elite (88–100)</p>
            </div>
          </div>
        </section>

        {/* Section 2.0 — Pillar Breakdown */}
        <section className="mb-10">
          <SectionHeader number="2.0" title="Pillar Breakdown" />
          <div className="mt-4 space-y-6">
            <PillarRow
              name="Stability Base"
              value={Math.round(report.stabilityInternal)}
              tier={stabilityTier}
              bullets={stabilityBullets}
            />
            <PillarRow
              name="Revenue Diversity"
              value={Math.round(report.diversityInternal)}
              tier={diversityTier}
              bullets={diversityBullets}
            />
            <PillarRow
              name="System Independence"
              value={Math.round(report.independenceInternal)}
              tier={independenceTier}
              bullets={independenceBullets}
            />

            <div className="border border-neutral-200 p-4 text-xs text-neutral-500 space-y-1">
              <p className="font-medium text-neutral-600 mb-1">Exposure Tier Reference</p>
              <p>Severe (0–49)</p>
              <p>Elevated (50–64)</p>
              <p>Moderate (65–79)</p>
              <p>Low (80–100)</p>
            </div>
          </div>
        </section>

        {/* Section 3.0 — Structural Exposure Summary */}
        <section className="mb-10">
          <SectionHeader number="3.0" title="Structural Exposure Summary" />
          <div className="mt-4 text-sm text-neutral-700 space-y-2">
            <p>{getPositionSentence1(report.band)}</p>
            <p>
              {getPositionSentence2(
                report.stabilityInternal,
                report.diversityInternal,
                report.independenceInternal
              )}
            </p>
            <p>{getPositionSentence3(report.independenceInternal)}</p>
          </div>
        </section>

        {/* Section 4.0 — Simulation */}
        <section className="mb-10">
          <SectionHeader number="4.0" title="Simulation" />
          <div className="mt-4 space-y-4">
            <SimulationRow
              title="Scenario A — Largest Client Removed"
              pillar="Revenue Diversity"
              originalScore={report.finalScore}
              adjustedScore={report.simulations.scenarioA.adjustedScore}
              delta={report.simulations.scenarioA.delta}
            />
            <SimulationRow
              title="Scenario B — 60-Day Labor Halt"
              pillar="System Independence"
              originalScore={report.finalScore}
              adjustedScore={report.simulations.scenarioB.adjustedScore}
              delta={report.simulations.scenarioB.delta}
            />
            <SimulationRow
              title="Scenario C — Volatility Increase"
              pillar="Stability Base"
              originalScore={report.finalScore}
              adjustedScore={report.simulations.scenarioC.adjustedScore}
              delta={report.simulations.scenarioC.delta}
            />
          </div>
        </section>

        {/* Section 5.0 — Methodological Reference */}
        <section className="mb-10">
          <SectionHeader number="5.0" title="Methodological Reference" />
          <div className="mt-4 text-xs text-neutral-500 space-y-2">
            <p>Model: RP-1.0 | Version: 1.0</p>
            <p>Classification instrument: deterministic, weighted pillar architecture.</p>
            <p>Pillars: Stability Base (40%), Revenue Diversity (30%), System Independence (30%).</p>
            <p>Scoring range: 0–100. Band classification applied post-scoring.</p>
          </div>
        </section>

        {/* Section 6.0 — Disclosure */}
        <section className="mb-10">
          <SectionHeader number="6.0" title="Disclosure" />
          <div className="mt-4 text-xs text-neutral-500 space-y-2">
            <p>
              RUNPAYWAY™ provides structural income classification only.
            </p>
            <p>This instrument does not:</p>
            <ul className="list-disc list-inside space-y-0.5 ml-2">
              <li>Assess creditworthiness</li>
              <li>Provide lending qualification</li>
              <li>Offer financial advice</li>
              <li>Predict future earnings</li>
            </ul>
            <p>
              Results reflect structural inputs provided at time of submission.
            </p>
          </div>
        </section>

        {/* Authentication Code Footer */}
        {report.authenticationCode && (
          <div className="border-t border-neutral-200 pt-4 text-center">
            <p className="text-[10px] text-neutral-400 tracking-wider">
              Authentication: {report.authenticationCode}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

function SectionHeader({ number, title }: { number: string; title: string }) {
  return (
    <>
      <h3 className="text-xs text-neutral-400 mb-0.5">{number}</h3>
      <h2 className="text-base font-semibold">{title}</h2>
      <div className="border-t border-neutral-200 mt-2" />
    </>
  );
}

function PillarRow({
  name,
  value,
  tier,
  bullets,
}: {
  name: string;
  value: number;
  tier: string;
  bullets: string[];
}) {
  return (
    <div>
      <div className="flex items-baseline justify-between mb-1">
        <span className="text-sm font-medium">{name}</span>
        <span className="text-sm">{value}</span>
      </div>
      <div className="text-xs text-neutral-500 mb-2">Exposure: {tier}</div>
      <div className="w-full bg-neutral-100 h-1.5">
        <div
          className="bg-neutral-900 h-1.5"
          style={{ width: `${value}%` }}
        />
      </div>
      {bullets.length > 0 && (
        <ul className="mt-2 text-xs text-neutral-600 space-y-0.5">
          {bullets.map((b, i) => (
            <li key={i}>• {b}</li>
          ))}
        </ul>
      )}
    </div>
  );
}

function SimulationRow({
  title,
  pillar,
  originalScore,
  adjustedScore,
  delta,
}: {
  title: string;
  pillar: string;
  originalScore: number;
  adjustedScore: number;
  delta: number;
}) {
  return (
    <div className="border border-neutral-200 p-4">
      <h4 className="text-sm font-medium mb-2">{title}</h4>
      <div className="border-t border-neutral-100 my-2" />
      <div className="text-xs text-neutral-600 space-y-1">
        <div className="flex justify-between">
          <span>Original Score</span>
          <span>{originalScore}</span>
        </div>
        <div className="flex justify-between">
          <span>Adjusted Score</span>
          <span>{adjustedScore}</span>
        </div>
        <div className="flex justify-between">
          <span>Delta</span>
          <span>{delta}</span>
        </div>
      </div>
      <p className="text-xs text-neutral-400 mt-2">
        Impact concentrated within {pillar}.
      </p>
    </div>
  );
}
