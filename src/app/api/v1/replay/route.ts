import { NextRequest, NextResponse } from "next/server";
import { prisma } from "../../../../../src/lib/prisma";
import { ReplayService } from "../../../../../src/lib/persistence/replay-service";
import { AuditService } from "../../../../../src/lib/persistence/audit-service";
import { Executor } from "../../../../../packages/rp-dsl/executor";

interface PolicyExecutor {
  execute(payload: unknown, policySource: string): Promise<unknown>;
}

class DefaultPolicyExecutor implements PolicyExecutor {
  async execute(payload: unknown, policySource: string): Promise<unknown> {
    const policy = JSON.parse(policySource);
    const executor = new Executor({
      payload: payload as any,
      variables: {},
    });

    const result: any = {
      status: "PASS",
      compliance_classification: "PASS",
      violation_score: 0,
      reason_codes: [],
      rule_results: [],
    };

    for (const rule of policy.rules) {
      try {
        const ruleResult = executor.execute(rule.condition);

        if (ruleResult.value === true) {
          result.violation_score += rule.violation_contribution;
          result.reason_codes.push(rule.reason_code);
          result.rule_results.push({
            operator: (rule.condition as any).operator,
            operands: [(rule.condition as any).left, (rule.condition as any).right],
            condition_met: true,
            violation_contribution: rule.violation_contribution,
          });
        } else {
          result.rule_results.push({
            operator: (rule.condition as any).operator,
            operands: [(rule.condition as any).left, (rule.condition as any).right],
            condition_met: false,
            violation_contribution: 0,
          });
        }
      } catch (err) {
        throw new Error(
          `Rule ${rule.rule_id} execution failed: ${err instanceof Error ? err.message : String(err)}`
        );
      }
    }

    return result;
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { evaluation_id } = body;

    if (!evaluation_id || typeof evaluation_id !== "string") {
      return NextResponse.json(
        {
          error: true,
          code: "INVALID_REQUEST",
          message: "evaluation_id is required and must be a string",
        },
        { status: 400 }
      );
    }

    const evaluation = await prisma.evaluation.findUnique({
      where: { evaluation_id },
    });

    if (!evaluation) {
      return NextResponse.json(
        {
          error: true,
          code: "NOT_FOUND",
          message: `Evaluation not found: ${evaluation_id}`,
        },
        { status: 404 }
      );
    }

    const policyVersion = await prisma.policyVersion.findUnique({
      where: {
        policy_id_version: {
          policy_id: evaluation.policy_id,
          version: evaluation.policy_version,
        },
      },
    });

    if (!policyVersion) {
      return NextResponse.json(
        {
          error: true,
          code: "POLICY_NOT_FOUND",
          message: `Policy version not found: ${evaluation.policy_id}@${evaluation.policy_version}`,
        },
        { status: 404 }
      );
    }

    const auditService = new AuditService(prisma);
    const policyExecutor = new DefaultPolicyExecutor();
    const replayService = new ReplayService(prisma, policyExecutor, auditService);

    const result = await replayService.replayEvaluation(evaluation_id);

    return NextResponse.json(
      {
        evaluation_id: result.evaluation_id,
        replayable: result.replayable,
        original_result_hash: result.original_result_hash,
        replay_result_hash: result.replay_result_hash || null,
        match: result.match || false,
        replay_timestamp: result.replay_timestamp.toISOString(),
        discrepancies: result.discrepancies || [],
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
