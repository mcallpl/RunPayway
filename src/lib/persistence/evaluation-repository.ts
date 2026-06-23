import { PrismaClient } from '@prisma/client';

export interface CreateEvaluationInput {
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
  triggered_reason_codes: string[];
}

export interface Evaluation extends CreateEvaluationInput {
  created_at: Date;
}

export class EvaluationRepository {
  constructor(private prisma: PrismaClient) {}

  async create(input: CreateEvaluationInput): Promise<Evaluation> {
    const evaluation = await this.prisma.evaluation.create({
      data: {
        evaluation_id: input.evaluation_id,
        subject_id: input.subject_id,
        cohort_key: input.cohort_key,
        policy_id: input.policy_id,
        policy_version: input.policy_version,
        policy_hash: input.policy_hash,
        evaluation_timestamp: input.evaluation_timestamp,
        payload_hash: input.payload_hash,
        result_hash: input.result_hash,
        classification: input.classification,
        violation_score: input.violation_score,
        triggered_reason_codes: input.triggered_reason_codes,
        created_at: new Date(),
      },
    });

    return evaluation as Evaluation;
  }

  async findById(evaluationId: string): Promise<Evaluation | null> {
    const evaluation = await this.prisma.evaluation.findUnique({
      where: { evaluation_id: evaluationId },
    });

    return evaluation as Evaluation | null;
  }

  async findBySubjectId(subjectId: string, limit: number = 100): Promise<Evaluation[]> {
    const evaluations = await this.prisma.evaluation.findMany({
      where: { subject_id: subjectId },
      take: limit,
      orderBy: { evaluation_timestamp: 'desc' },
    });

    return evaluations as Evaluation[];
  }

  async findByCohortKey(cohortKey: string, limit: number = 100): Promise<Evaluation[]> {
    const evaluations = await this.prisma.evaluation.findMany({
      where: { cohort_key: cohortKey },
      take: limit,
      orderBy: { evaluation_timestamp: 'desc' },
    });

    return evaluations as Evaluation[];
  }
}
