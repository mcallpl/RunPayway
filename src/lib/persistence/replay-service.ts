import { PrismaClient } from '@prisma/client';
import { AuditEventRepository } from './audit-repository';
import { AuditService } from './audit-service';
import { hashResult } from './hash-utils';

export interface DeterminismResult {
  evaluation_id: string;
  replayable: boolean;
  original_result_hash: string;
  replay_result_hash?: string;
  match?: boolean;
  discrepancies?: unknown[];
  replay_timestamp: Date;
}

export interface ReplayExecutionContext {
  policy_id: string;
  policy_version: number;
  payload: unknown;
  policy_source: string;
}

export interface PolicyExecutor {
  execute(payload: unknown, policySource: string): Promise<unknown>;
}

export class ReplayService {
  private auditRepository: AuditEventRepository;

  constructor(
    private prisma: PrismaClient,
    private policyExecutor: PolicyExecutor,
    private auditService: AuditService
  ) {
    this.auditRepository = new AuditEventRepository(prisma);
  }

  async verifyDeterminism(evaluationId: string): Promise<DeterminismResult> {
    const evaluation = await this.prisma.evaluation.findUnique({
      where: { evaluation_id: evaluationId },
    });

    if (!evaluation) {
      throw new Error(`Evaluation not found: ${evaluationId}`);
    }

    const auditEvent = await this.auditRepository.findByEvaluationId(evaluationId);
    const creationEvent = auditEvent.find((e) => e.event_type === 'EVALUATION_CREATED');

    if (!creationEvent || !creationEvent.details) {
      return {
        evaluation_id: evaluationId,
        replayable: false,
        original_result_hash: evaluation.result_hash,
        replay_timestamp: new Date(),
      };
    }

    const details = JSON.parse(creationEvent.details);

    if (!details.payload) {
      return {
        evaluation_id: evaluationId,
        replayable: false,
        original_result_hash: evaluation.result_hash,
        replay_timestamp: new Date(),
      };
    }

    return this.replayEvaluation(evaluationId, details.payload);
  }

  async replayEvaluation(
    evaluationId: string,
    payload?: unknown
  ): Promise<DeterminismResult> {
    const evaluation = await this.prisma.evaluation.findUnique({
      where: { evaluation_id: evaluationId },
    });

    if (!evaluation) {
      throw new Error(`Evaluation not found: ${evaluationId}`);
    }

    const policyVersion = await this.prisma.policyVersion.findUnique({
      where: {
        policy_id_version: {
          policy_id: evaluation.policy_id,
          version: evaluation.policy_version,
        },
      },
    });

    if (!policyVersion) {
      throw new Error(
        `Policy version not found: ${evaluation.policy_id}@${evaluation.policy_version}`
      );
    }

    let replayPayload = payload;

    if (!replayPayload) {
      const auditEvent = await this.auditRepository.findByEvaluationId(evaluationId);
      const creationEvent = auditEvent.find((e) => e.event_type === 'EVALUATION_CREATED');

      if (!creationEvent || !creationEvent.details) {
        return {
          evaluation_id: evaluationId,
          replayable: false,
          original_result_hash: evaluation.result_hash,
          replay_timestamp: new Date(),
        };
      }

      const details = JSON.parse(creationEvent.details);
      replayPayload = details.payload;

      if (!replayPayload) {
        return {
          evaluation_id: evaluationId,
          replayable: false,
          original_result_hash: evaluation.result_hash,
          replay_timestamp: new Date(),
        };
      }
    }

    let replayResult: unknown;
    try {
      replayResult = await this.policyExecutor.execute(
        replayPayload,
        policyVersion.source_definition
      );
    } catch (error) {
      return {
        evaluation_id: evaluationId,
        replayable: true,
        original_result_hash: evaluation.result_hash,
        replay_result_hash: '',
        match: false,
        discrepancies: [
          {
            type: 'execution_error',
            message: error instanceof Error ? error.message : String(error),
          },
        ],
        replay_timestamp: new Date(),
      };
    }

    const replayResultHash = hashResult(replayResult);
    const match = replayResultHash === evaluation.result_hash;

    const result: DeterminismResult = {
      evaluation_id: evaluationId,
      replayable: true,
      original_result_hash: evaluation.result_hash,
      replay_result_hash: replayResultHash,
      match,
      replay_timestamp: new Date(),
    };

    if (!match) {
      result.discrepancies = [
        {
          type: 'result_hash_mismatch',
          original: evaluation.result_hash,
          replay: replayResultHash,
        },
      ];
    }

    const auditResult = {
      evaluation_id: evaluationId,
      original_result_hash: evaluation.result_hash,
      replay_result_hash: replayResultHash,
      match,
      replay_timestamp: new Date(),
      discrepancies: result.discrepancies,
    };

    await this.auditService.logEvaluationReplayed(evaluationId, auditResult);

    return result;
  }
}
