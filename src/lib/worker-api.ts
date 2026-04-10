/**
 * Worker API Client
 *
 * All scoring, simulation, and proprietary logic runs on the Cloudflare Worker.
 * Client components call these functions instead of importing the engine directly.
 */

const WORKER_URL = "https://runpayway-pressuremap.mcallpl.workers.dev";

/* ------------------------------------------------------------------ */
/*  Types (response shapes — no scoring logic)                         */
/* ------------------------------------------------------------------ */

export interface SimulationResult {
  overall_score: number;
  band: string;
  factor_scores: {
    persistence: number;
    diversity: number;
    forward: number;
    concentration: number;
    labor: number;
    variability: number;
    continuity: number;
  };
  structure_score: number;
  stability_score: number;
  interaction_adjustment: number;
  continuity_months: number;
  fragility_class: string;
}

export interface TimelinePoint {
  month: number;
  score: number;
  band: string;
  label?: string;
}

export interface PresetMeta {
  id: string;
  label: string;
  description: string;
  category: "growth" | "stress";
}

export interface ActionScript {
  id: string;
  title: string;
  body: string;
  sector: string;
}

export interface CanonicalInputs {
  income_persistence_pct: number;
  largest_source_pct: number;
  source_diversity_count: number;
  forward_secured_pct: number;
  income_variability_level: string;
  labor_dependence_pct: number;
  continuity_months?: number;
}

export interface BatchScenario {
  id: string;
  preset_id?: string;
  modified_inputs?: Partial<CanonicalInputs>;
}

/* ------------------------------------------------------------------ */
/*  API Calls                                                          */
/* ------------------------------------------------------------------ */

async function post<T>(path: string, body: unknown): Promise<T> {
  const res = await fetch(`${WORKER_URL}${path}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    const text = await res.text().catch(() => "Unknown error");
    throw new Error(`Worker ${path} failed (${res.status}): ${text}`);
  }
  return res.json();
}

async function get<T>(path: string, headers?: Record<string, string>): Promise<T> {
  const res = await fetch(`${WORKER_URL}${path}`, {
    method: "GET",
    headers: { ...headers },
  });
  if (!res.ok) {
    const text = await res.text().catch(() => "Unknown error");
    throw new Error(`Worker ${path} failed (${res.status}): ${text}`);
  }
  return res.json();
}

/**
 * Run a single simulation with given inputs.
 */
export async function fetchSimulation(
  inputs: CanonicalInputs,
  quality_score?: number
): Promise<SimulationResult> {
  return post<SimulationResult>("/simulate", { inputs, quality_score });
}

/**
 * Run multiple simulations in one request (critical for dashboard performance).
 * Returns a map of scenario ID → result.
 */
export async function fetchSimulationBatch(
  base_inputs: CanonicalInputs,
  scenarios: BatchScenario[],
  quality_score?: number
): Promise<Record<string, SimulationResult>> {
  const res = await post<{ results: Record<string, SimulationResult> }>("/simulate-batch", {
    base_inputs,
    quality_score,
    scenarios,
  });
  return res.results;
}

/**
 * Project a timeline of score improvement from current to target inputs.
 */
export async function fetchTimeline(
  current_inputs: CanonicalInputs,
  target_inputs: CanonicalInputs,
  quality_score?: number
): Promise<TimelinePoint[]> {
  const res = await post<{ timeline: TimelinePoint[] }>("/timeline", {
    current_inputs,
    target_inputs,
    quality_score,
  });
  return res.timeline;
}

/**
 * Fetch simulator preset metadata (IDs, labels, descriptions — no logic).
 */
export async function fetchPresets(sector?: string): Promise<PresetMeta[]> {
  const path = sector ? `/presets?sector=${encodeURIComponent(sector)}` : "/presets";
  const res = await get<{ presets: PresetMeta[] }>(path);
  return res.presets;
}

/**
 * Fetch action scripts for a sector (auth-gated — requires payment token).
 */
export async function fetchActionScripts(
  sector: string,
  authToken?: string
): Promise<ActionScript[]> {
  const headers: Record<string, string> = {};
  if (authToken) headers["Authorization"] = `Bearer ${authToken}`;
  const res = await get<{ scripts: ActionScript[] }>(`/action-scripts/${encodeURIComponent(sector)}`, headers);
  return res.scripts;
}
