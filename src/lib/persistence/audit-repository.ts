import { PrismaClient } from '@prisma/client';

export interface AuditEventInput {
  audit_id: string;
  sequence_number: number;
  previous_hash: string | null;
  audit_hash: string;
  event_type: string;
  event_timestamp: Date;
  actor_id: string | null;
  subject_type: string;
  subject_id: string;
  evaluation_id: string | null;
  policy_id: string | null;
  policy_version: number | null;
  details: string;
}

export interface AuditEvent extends AuditEventInput {
  created_at: Date;
}

export class AuditEventRepository {
  constructor(private prisma: PrismaClient) {}

  async create(event: AuditEventInput): Promise<AuditEvent> {
    const created = await this.prisma.auditEvent.create({
      data: event,
    });

    return {
      ...created,
      audit_id: created.audit_id,
      sequence_number: created.sequence_number,
      previous_hash: created.previous_hash,
      audit_hash: created.audit_hash,
      event_type: created.event_type,
      event_timestamp: created.event_timestamp,
      created_at: created.created_at,
      actor_id: created.actor_id,
      subject_type: created.subject_type,
      subject_id: created.subject_id,
      evaluation_id: created.evaluation_id,
      policy_id: created.policy_id,
      policy_version: created.policy_version,
      details: created.details,
    };
  }

  async findBySequenceNumber(sequence_number: number): Promise<AuditEvent | null> {
    const event = await this.prisma.auditEvent.findUnique({
      where: { sequence_number },
    });

    return event as AuditEvent | null;
  }

  async findLatestSequenceNumber(): Promise<number> {
    const latest = await this.prisma.auditEvent.findFirst({
      orderBy: { sequence_number: 'desc' },
      select: { sequence_number: true },
    });

    return latest?.sequence_number ?? 0;
  }

  async findByEvaluationId(evaluationId: string): Promise<AuditEvent[]> {
    const events = await this.prisma.auditEvent.findMany({
      where: { evaluation_id: evaluationId },
      orderBy: { sequence_number: 'asc' },
    });

    return events as AuditEvent[];
  }

  async findBySubjectId(subjectId: string): Promise<AuditEvent[]> {
    const events = await this.prisma.auditEvent.findMany({
      where: { subject_id: subjectId },
      orderBy: { sequence_number: 'asc' },
    });

    return events as AuditEvent[];
  }

  async findByEventType(eventType: string): Promise<AuditEvent[]> {
    const events = await this.prisma.auditEvent.findMany({
      where: { event_type: eventType },
      orderBy: { sequence_number: 'asc' },
    });

    return events as AuditEvent[];
  }

  async findByPolicyVersion(policyId: string, version: number): Promise<AuditEvent[]> {
    const events = await this.prisma.auditEvent.findMany({
      where: {
        policy_id: policyId,
        policy_version: version,
      },
      orderBy: { sequence_number: 'asc' },
    });

    return events as AuditEvent[];
  }
}
