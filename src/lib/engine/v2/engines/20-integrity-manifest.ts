// Engine 20 — Integrity & Manifest
// Computes SHA-256 hashes for inputs, outputs, manifest, and record.

import { sha256 as sha256Hash } from "../crypto-compat";
import type { CanonicalInput, ScoreBreakdown, IntegrityResult, ModelManifest } from "../types";
import {
  MODEL_VERSION,
  FACTOR_VERSION,
  SCENARIO_VERSION,
  BENCHMARK_VERSION,
  EXPLANATION_VERSION,
} from "../constants";

export function computeIntegrity(
  normalized: CanonicalInput,
  scores: ScoreBreakdown,
  assessmentId: string,
): IntegrityResult {
  const input_hash = sha256(JSON.stringify(sortKeys(normalized as unknown as Record<string, unknown>)));

  const output_hash = sha256(
    JSON.stringify(
      sortKeys({
        overall_score: scores.overall_score,
        structure_score: scores.structure_score,
        stability_score: scores.stability_score,
        fragility_score: scores.fragility_score,
      }),
    ),
  );

  const manifest_hash = sha256(
    JSON.stringify({
      model_version: MODEL_VERSION,
      factor_version: FACTOR_VERSION,
      scenario_version: SCENARIO_VERSION,
      benchmark_version: BENCHMARK_VERSION,
      explanation_version: EXPLANATION_VERSION,
    }),
  );

  const record_hash = sha256(
    input_hash + output_hash + manifest_hash + assessmentId,
  );

  return { input_hash, output_hash, manifest_hash, record_hash };
}

export function getModelManifest(): ModelManifest {
  return {
    model_version: MODEL_VERSION,
    factor_version: FACTOR_VERSION,
    scenario_version: SCENARIO_VERSION,
    benchmark_version: BENCHMARK_VERSION,
    explanation_version: EXPLANATION_VERSION,
  };
}

export function computeManifestHash(): string {
  return sha256(
    JSON.stringify({
      model_version: MODEL_VERSION,
      factor_version: FACTOR_VERSION,
      scenario_version: SCENARIO_VERSION,
      benchmark_version: BENCHMARK_VERSION,
      explanation_version: EXPLANATION_VERSION,
    }),
  );
}

function sha256(data: string): string {
  return sha256Hash(data);
}

function sortKeys(obj: Record<string, unknown>): Record<string, unknown> {
  return Object.keys(obj)
    .sort()
    .reduce(
      (sorted, key) => {
        sorted[key] = obj[key];
        return sorted;
      },
      {} as Record<string, unknown>,
    );
}
