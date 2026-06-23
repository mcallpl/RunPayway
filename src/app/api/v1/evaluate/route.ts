import { NextRequest, NextResponse } from "next/server";
import { validateEvaluationRequest } from "../../../../../packages/ingestion/schemas";
import { Executor } from "../../../../../packages/rp-dsl/executor";
import { compilePolicy } from "../../../../../packages/rp-dsl/compiler";
import { MORTGAGE_MIXED_INCOME_POLICY_V1 } from "../../../../../packages/rp-dsl/seed-policy";
import { classifyScore } from "../../../../../packages/rp-dsl/executor";
import { computeAuditHashes, generateAuditId } from "../../../../../packages/audit/hash";
import { getReasonCode, validateReasonCode } from "../../../../../packages/reason-codes/registry";
import { EvaluationStatus } from "../../../../../packages/domain/types";
import { PrismaClient } from "@prisma/client";
import { EvaluationRepository } from "../../../../../src/lib/persistence/evaluation-repository";
import { EvaluationPersistenceService } from "../../../../../src/lib/persistence/evaluation-persistence-service";

export async function POST(request: NextRequest) {
  try {
    // Step 1: Parse and validate request (REQ-006)
    const body = await request.json();

    const validation = validateEvaluationRequest(body);
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

    const { organization_id, cohort_key, payload } = validation.data;

    // Step 2: Validate payload (REQ-006)
    const payloadValidation = validateEvaluationRequest({
      organization_id,
      cohort_key,
      payload,
    });

    if (!payloadValidation.success) {
      return NextResponse.json(
        {
          error: true,
          code: "INPUT_ERROR",
          message: payloadValidation.error,
        },
        { status: 400 }
      );
    }

    // Step 3: Get policy (simplified for MVP - hardcoded seed policy)
    // In production, this would look up policy from database via cohort_policy_bindings
    if (cohort_key !== "mortgage_software_sales_mixed_income") {
      return NextResponse.json(
        {
          error: true,
          code: "POLICY_BINDING_ERROR",
          message: `No policy bound to cohort: ${cohort_key}`,
        },
        { status: 404 }
      );
    }

    const policy = MORTGAGE_MIXED_INCOME_POLICY_V1;
    const policyJson = JSON.stringify(policy);

    // Step 4: Compile policy (REQ-008)
    const compileResult = compilePolicy(policyJson);
    if (!compileResult.valid) {
      return NextResponse.json(
        {
          error: true,
          code: "ASNC",
          message: "Policy compilation failed",
          details: compileResult.errors,
        },
        { status: 400 }
      );
    }

    // Step 5: Execute policy (REQ-007)
    let violationScore = 0;
    const triggeredReasonCodes: string[] = [];
    const ruleResults: any[] = [];

    for (const rule of policy.rules) {
      const executor = new Executor({
        payload: payloadValidation.data.payload,
        variables: {},
      });

      try {
        const result = executor.execute(rule.condition);

        if (result.value === true) {
          // Rule condition met, add violation score
          violationScore += rule.violation_contribution;
          triggeredReasonCodes.push(rule.reason_code);

          ruleResults.push({
            operator: (rule.condition as any).operator,
            operands: [(rule.condition as any).left, (rule.condition as any).right],
            condition_met: true,
            violation_contribution: rule.violation_contribution,
          });
        } else {
          ruleResults.push({
            operator: (rule.condition as any).operator,
            operands: [(rule.condition as any).left, (rule.condition as any).right],
            condition_met: false,
            violation_contribution: 0,
          });
        }
      } catch (err) {
        return NextResponse.json(
          {
            error: true,
            code: "EXECUTION_TIMEOUT",
            message: `Rule ${rule.rule_id} execution failed: ${err instanceof Error ? err.message : String(err)}`,
          },
          { status: 500 }
        );
      }
    }

    // Step 6: Classify result (REQ-010)
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

    // Step 7: Map status (REQ-010)
    let status: EvaluationStatus;
    if (classification === "PASS") {
      status = EvaluationStatus.PASS;
    } else if (classification === "REVIEW") {
      status = EvaluationStatus.REVIEW;
    } else if (classification === "FAIL") {
      status = EvaluationStatus.FAIL;
    } else {
      status = EvaluationStatus.ASNC;
    }

    // Step 8: Compute audit hashes (REQ-002)
    const result = {
      status,
      compliance_classification: classification,
      violation_score: violationScore,
      reason_codes: triggeredReasonCodes,
      rule_results: ruleResults,
    };

    const auditHashes = computeAuditHashes(
      payloadValidation.data.payload,
      policyJson,
      result
    );

    // Step 9: Persist evaluation (Phase 5a - Core Evaluation Persistence)
    const prisma = new PrismaClient();
    const evaluationRepository = new EvaluationRepository(prisma);
    const persistenceService = new EvaluationPersistenceService(evaluationRepository);

    const persistedEvaluation = await persistenceService.persistEvaluation({
      subject_id: organization_id,
      cohort_key,
      policy_id: policy.policy_id,
      policy_version: 1,
      policy_hash: auditHashes.policy_hash,
      evaluation_timestamp: new Date(),
      payload: payloadValidation.data.payload,
      result,
      classification,
      violation_score: violationScore,
      triggered_reason_codes: triggeredReasonCodes,
    });

    const evaluationId = persistedEvaluation.evaluation_id;
    const auditId = generateAuditId();

    // Step 10: Return structured JSON (REQ-002, API_STANDARD)
    return NextResponse.json(
      {
        evaluation_id: evaluationId,
        status: status,
        compliance_classification: classification,
        violation_score: violationScore,
        reason_codes: triggeredReasonCodes,
        rule_results: ruleResults,
        audit: {
          audit_id: auditId,
          input_hash: auditHashes.input_hash,
          policy_hash: auditHashes.policy_hash,
          result_hash: auditHashes.result_hash,
          evaluator_version: "1.0.0",
          replayable: true,
        },
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
