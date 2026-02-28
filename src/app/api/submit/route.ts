import { NextResponse } from "next/server";
import { runDiagnostic, RESPONSE_VALUES } from "@/lib/engine";
import { saveRecord } from "@/lib/engine/storage";
import type { SetupData, SubmissionRecord } from "@/lib/engine/types";

function validateResponses(responses: unknown): number[] | null {
  if (!Array.isArray(responses) || responses.length !== 7) return null;
  const valid = responses.every(
    (r) => typeof r === "number" && (RESPONSE_VALUES as readonly number[]).includes(r)
  );
  return valid ? (responses as number[]) : null;
}

function validateSetup(setup: unknown): SetupData | null {
  if (!setup || typeof setup !== "object") return null;
  const s = setup as Record<string, unknown>;
  if (typeof s.firstName !== "string" || s.firstName.trim().length === 0) return null;
  if (typeof s.email !== "string" || !s.email.includes("@")) return null;
  if (typeof s.role !== "string") return null;
  if (!Array.isArray(s.revenueModels)) return null;
  if (typeof s.revenueRange !== "string") return null;
  if (typeof s.quarter !== "string") return null;
  return {
    firstName: s.firstName.trim(),
    email: s.email.trim().toLowerCase(),
    role: s.role,
    revenueModels: s.revenueModels as string[],
    revenueRange: s.revenueRange,
    quarter: s.quarter,
  };
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const responses = validateResponses(body.responses);
    if (!responses) {
      return NextResponse.json(
        { error: "Invalid responses. Must be array of 7 values from [0,25,50,75,100]." },
        { status: 400 }
      );
    }

    const setup = validateSetup(body.setup);
    if (!setup) {
      return NextResponse.json(
        { error: "Invalid setup data." },
        { status: 400 }
      );
    }

    const engineOutput = runDiagnostic(responses);

    const record: SubmissionRecord = {
      referenceId: engineOutput.referenceId,
      timestampUTC: engineOutput.timestampUTC,
      setup,
      responses,
      finalScore: engineOutput.finalScore,
      band: engineOutput.band,
      stabilityInternal: engineOutput.stabilityInternal,
      diversityInternal: engineOutput.diversityInternal,
      independenceInternal: engineOutput.independenceInternal,
      model: engineOutput.model,
      version: engineOutput.version,
      engineOutput,
    };

    saveRecord(record);

    return NextResponse.json({ engineOutput });
  } catch {
    return NextResponse.json(
      { error: "Server error." },
      { status: 500 }
    );
  }
}
