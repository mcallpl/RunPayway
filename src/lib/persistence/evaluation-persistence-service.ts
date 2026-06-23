import { randomUUID } from 'crypto';
import { EvaluationRepository } from './evaluation-repository';
import { hashPayload, hashResult } from './hash-utils';

export interface EvaluationData {
  subject_id: string;
  cohort_key: string;
  policy_id: string;
  policy_version: number;
  policy_hash: string;
  evaluation_timestamp: Date;
  payload: unknown;
  result: unknown;
  classification: string;
  violation_score: number;
  triggered_reason_codes: string[];
}

export interface PersistedEvaluation {
  evaluation_id: string;
  created_at: Date;
}

export class EvaluationPersistenceService {
  constructor(private evaluationRepository: EvaluationRepository) {}

  async persistEvaluation(data: EvaluationData): Promise<PersistedEvaluation> {
    const evaluation_id = randomUUID();
    const payload_hash = hashPayload(data.payload);
    const result_hash = hashResult(data.result);

    const evaluation = await this.evaluationRepository.create({
      evaluation_id,
      subject_id: data.subject_id,
      cohort_key: data.cohort_key,
      policy_id: data.policy_id,
      policy_version: data.policy_version,
      policy_hash: data.policy_hash,
      evaluation_timestamp: data.evaluation_timestamp,
      payload_hash,
      result_hash,
      classification: data.classification,
      violation_score: data.violation_score,
      triggered_reason_codes: data.triggered_reason_codes,
    });

    return {
      evaluation_id: evaluation.evaluation_id,
      created_at: evaluation.created_at,
    };
  }
}
