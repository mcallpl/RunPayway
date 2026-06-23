import { PrismaClient } from '@prisma/client';
import { AuditEventRepository, AuditEventInput } from './audit-repository';
import { computeAuditHash } from './hash-utils';

export interface Evaluation {
  evaluation_id: string;
  subject_id: string;
  cohort_key: string;
  policy_id: string;
  policy_version: number;
  policy_hash: string;
  evaluation_timestamp: Date;
  payload_hash: string;
  result_hash: string;
  classification: string;
  violation_score: number;
  triggered_reason_codes: string;
  created_at: Date;
}

export interface ReplayResult {
  evaluation_id: string;
  original_result_hash: string;
  replay_result_hash: string;
  match: boolean;
  replay_timestamp: Date;
  discrepancies?: unknown[];
}

export class AuditService {
  private repository: AuditEventRepository;

  constructor(private prisma: PrismaClient) {
    this.repository = new AuditEventRepository(prisma);
  }

  async logEvaluationCreated(
    evaluation: Evaluation,
    payload: unknown
  ): Promise<void> {
    const sequenceNumber = await this.getNextSequenceNumber();
    const previousHash = await this.getPreviousHash(sequenceNumber);

    const detailsPayload = {
      evaluation_id: evaluation.evaluation_id,
      policy_id: evaluation.policy_id,
      policy_version: evaluation.policy_version,
      payload_hash: evaluation.payload_hash,
      payload: payload,
      result_hash: evaluation.result_hash,
      classification: evaluation.classification,
    };

    const audit_hash = computeAuditHash(
      previousHash,
      'EVALUATION_CREATED',
      'evaluation',
      evaluation.evaluation_id,
      evaluation.evaluation_id,
      evaluation.policy_id,
      evaluation.policy_version,
      evaluation.evaluation_timestamp.toISOString(),
      detailsPayload
    );

    const event: AuditEventInput = {
      audit_id: this.generateAuditId(),
      sequence_number: sequenceNumber,
      previous_hash: previousHash,
      audit_hash,
      event_type: 'EVALUATION_CREATED',
      event_timestamp: evaluation.evaluation_timestamp,
      actor_id: null,
      subject_type: 'evaluation',
      subject_id: evaluation.evaluation_id,
      evaluation_id: evaluation.evaluation_id,
      policy_id: evaluation.policy_id,
      policy_version: evaluation.policy_version,
      details: JSON.stringify(detailsPayload),
    };

    await this.repository.create(event);
  }

  async logEvaluationReplayed(
    evaluationId: string,
    replay: ReplayResult
  ): Promise<void> {
    const sequenceNumber = await this.getNextSequenceNumber();
    const previousHash = await this.getPreviousHash(sequenceNumber);

    const detailsPayload = {
      evaluation_id: evaluationId,
      original_result_hash: replay.original_result_hash,
      replay_result_hash: replay.replay_result_hash,
      match: replay.match,
      replay_timestamp: replay.replay_timestamp.toISOString(),
      discrepancies: replay.discrepancies || [],
    };

    const audit_hash = computeAuditHash(
      previousHash,
      'EVALUATION_REPLAYED',
      'evaluation',
      evaluationId,
      evaluationId,
      null,
      null,
      replay.replay_timestamp.toISOString(),
      detailsPayload
    );

    const event: AuditEventInput = {
      audit_id: this.generateAuditId(),
      sequence_number: sequenceNumber,
      previous_hash: previousHash,
      audit_hash,
      event_type: 'EVALUATION_REPLAYED',
      event_timestamp: replay.replay_timestamp,
      actor_id: null,
      subject_type: 'evaluation',
      subject_id: evaluationId,
      evaluation_id: evaluationId,
      policy_id: null,
      policy_version: null,
      details: JSON.stringify(detailsPayload),
    };

    await this.repository.create(event);
  }

  private async getNextSequenceNumber(): Promise<number> {
    const latest = await this.repository.findLatestSequenceNumber();
    return latest + 1;
  }

  private async getPreviousHash(currentSequence: number): Promise<string | null> {
    if (currentSequence === 1) {
      return null;
    }

    const previous = await this.repository.findBySequenceNumber(currentSequence - 1);
    return previous?.audit_hash || null;
  }

  private generateAuditId(): string {
    return this.generateUUID();
  }

  private generateUUID(): string {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
      const r = (Math.random() * 16) | 0;
      const v = c === 'x' ? r : (r & 0x3) | 0x8;
      return v.toString(16);
    });
  }
}
