import { NextRequest, NextResponse } from "next/server";
import { createHash } from "crypto";
import { validateReplayRequest } from "../../../../../packages/ingestion/schemas";
import { Executor } from "../../../../../packages/rp-dsl/executor";
import { MORTGAGE_MIXED_INCOME_POLICY_V1 } from "../../../../../packages/rp-dsl/seed-policy";
import { classifyScore } from "../../../../../packages/rp-dsl/executor";

// Mock audit store (in production, this would be database)
const mockAuditStore: Record<
  string,
  {
    audit_id: string;
    input: any;
    policy: any;
    original_result_hash: string;
    policy_hash: string;
  }
> = {};

export async function POST(request: NextRequest) {
  try {
    // Step 1: Parse and validate request (REQ-003)
    const body = await request.json();

    const validation = validateReplayRequest(body);
    if (!validation.success) {
      return NextResponse.json(
        {
          error: true,
          code: "INPUT_ERROR",
          message: validation.error,
        },
        { status: 400 }
      );
    }

    const { audit_id } = validation.data;

    // Step 2: Look up audit record (REQ-003)
    // In production, this would query database: prisma.auditRecord.findUnique({ where: { audit_id } })
    const auditRecord = mockAuditStore[audit_id];
    if (!auditRecord) {
      return NextResponse.json(
        {
          error: true,
          code: "NOT_FOUND",
          message: `Audit record not found: ${audit_id}`,
        },
        { status: 404 }
      );
    }

    // Step 3: Retrieve original policy version (REQ-003, REQ-005)
    // For MVP, using seed policy (hardcoded)
    const policy = MORTGAGE_MIXED_INCOME_POLICY_V1;
    const policyJson = JSON.stringify(policy);

    // Verify policy hasn't changed (REQ-001, Determinism)
    const currentPolicyHash = createHash("sha256")
      .update(policyJson)
      .digest("hex");

    if (currentPolicyHash !== auditRecord.policy_hash) {
      return NextResponse.json(
        {
          audit_id,
          replay_status: "MISMATCH",
          original_result_hash: auditRecord.original_result_hash,
          replay_result_hash: "N/A",
          evaluator_version: "1.0.0",
          replay_timestamp: new Date().toISOString(),
          reason: "Policy hash mismatch - policy has been modified",
        },
        { status: 200 }
      );
    }

    // Step 4: Re-execute policy with original input (REQ-003)
    const originalPayload = auditRecord.input;
    let violationScore = 0;
    const triggeredReasonCodes: string[] = [];

    for (const rule of policy.rules) {
      const executor = new Executor({
        payload: originalPayload,
        variables: {},
      });

      try {
        const result = executor.execute(rule.condition);

        if (result.value === true) {
          violationScore += rule.violation_contribution;
          triggeredReasonCodes.push(rule.reason_code);
        }
      } catch (err) {
        return NextResponse.json(
          {
            error: true,
            code: "EXECUTION_TIMEOUT",
            message: `Replay execution failed: ${err instanceof Error ? err.message : String(err)}`,
          },
          { status: 500 }
        );
      }
    }

    // Step 5: Classify result (REQ-010)
    let classification: string;
    try {
      classification = classifyScore(violationScore, policy.classification_rules.ranges);
    } catch (err) {
      return NextResponse.json(
        {
          error: true,
          code: "ASNC",
          message: `Classification failed: ${err instanceof Error ? err.message : String(err)}`,
        },
        { status: 500 }
      );
    }

    // Step 6: Compute new result hash (REQ-003)
    const replayResult = {
      status: classification === "PASS" ? "PASS" : classification === "REVIEW" ? "REVIEW" : "FAIL",
      compliance_classification: classification,
      violation_score: violationScore,
      reason_codes: triggeredReasonCodes,
    };

    const replayHash = createHash("sha256")
      .update(JSON.stringify(replayResult, null, 0))
      .digest("hex");

    // Step 7: Compare result hashes (REQ-003, REQ-001 Determinism)
    const matchStatus = replayHash === auditRecord.original_result_hash ? "MATCH" : "MISMATCH";

    // Step 8: Return replay result (REQ-003, API_STANDARD)
    return NextResponse.json(
      {
        audit_id,
        replay_status: matchStatus,
        original_result_hash: auditRecord.original_result_hash,
        replay_result_hash: replayHash,
        evaluator_version: "1.0.0",
        replay_timestamp: new Date().toISOString(),
      },
      { status: 200 }
    );
  } catch (err) {
    return NextResponse.json(
      {
        error: true,
        code: "SERVER_ERROR",
        message: err instanceof Error ? err.message : "Internal server error",
      },
      { status: 500 }
    );
  }
}

// Helper function to register audit record (for testing)
export function registerAuditRecord(auditId: string, input: any, policy: any, resultHash: string) {
  const policyJson = JSON.stringify(policy);
  const policyHash = createHash("sha256")
    .update(policyJson)
    .digest("hex");

  mockAuditStore[auditId] = {
    audit_id: auditId,
    input,
    policy,
    original_result_hash: resultHash,
    policy_hash: policyHash,
  };
}
