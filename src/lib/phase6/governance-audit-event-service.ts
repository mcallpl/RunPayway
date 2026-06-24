/**
 * Phase 6: Governance Audit Event Service
 * Append-only audit trail for policy lifecycle state transitions
 *
 * Constraints:
 * - AuditEvent records are append-only (INSERT only, no UPDATE/DELETE)
 * - Sequence numbers ensure ordering
 * - Hash chain provides tamper detection
 * - Transaction-safe: must be called within prisma.$transaction()
 * - Creates audit events atomically with governance state changes
 *
 * Does NOT:
 * - Mutate existing AuditEvent records
 * - Mutate Evaluation or PolicyVersion tables (Phase 5 read-only)
 */

import { createHash } from "crypto";
import { prisma } from "../prisma";
import {
  GovernanceAuditEvent,
  GovernanceAuditEventPayload,
  GovernanceEventType,
  GovernanceAction,
  GOVERNANCE_ACTION_TO_EVENT_TYPE,
} from "./governance-types";

/**
 * GovernanceAuditEventService
 * Appends governance audit events to immutable audit trail
 *
 * All operations are INSERT only. No updates or deletes.
 * Must be called within prisma.$transaction() context.
 */
export class GovernanceAuditEventService {
  /**
   * Create governance audit event (append-only)
   *
   * Constraints:
   * - Sequence number is assigned based on max existing sequence
   * - Previous hash links to prior event (or null if first)
   * - Audit hash includes previous hash (chain integrity)
   * - Operation is INSERT only (no update/delete)
   *
   * @param payload Event payload (policy_id, version, action, states, actor, timestamp)
   * @param tx Optional Prisma transaction context (required for atomicity)
   * @returns Created audit event
   * @throws Error if sequence number collision or database failure
   */
  async createEvent(
    payload: GovernanceAuditEventPayload,
    tx?: any, // Prisma transaction context
  ): Promise<GovernanceAuditEvent> {
    const prismaClient = tx || prisma;

    // Get next sequence number (max existing + 1)
    const lastEvent = await prismaClient.auditEvent.findFirst({
      orderBy: { sequence_number: "desc" },
      select: { sequence_number: true, audit_hash: true },
    });

    const nextSequence = (lastEvent?.sequence_number ?? 0) + 1;
    const previousHash = lastEvent?.audit_hash || null;

    // Compute audit hash (includes previous hash for chain integrity)
    const auditHash = this.computeAuditHash({
      policy_id: payload.policy_id,
      policy_version: payload.version,
      previous_state: payload.previous_state,
      next_state: payload.next_state,
      action: payload.action,
      actor_id: payload.actor_id,
      timestamp: payload.timestamp,
      previous_hash: previousHash,
      sequence_number: nextSequence,
    });

    // Create audit event (append-only INSERT)
    const event = await prismaClient.auditEvent.create({
      data: {
        audit_id: this.generateCUID(),
        sequence_number: nextSequence,
        previous_hash: previousHash,
        audit_hash: auditHash,
        event_type: GOVERNANCE_ACTION_TO_EVENT_TYPE[payload.action] as GovernanceEventType,
        event_timestamp: payload.timestamp,
        created_at: new Date(),
        actor_id: payload.actor_id,
        subject_type: "POLICY_VERSION_GOVERNANCE",
        subject_id: payload.policy_id,
        policy_id: payload.policy_id,
        policy_version: payload.version,
        details: JSON.stringify(payload),
      },
    });

    return this.mapToDomain(event);
  }

  /**
   * Compute audit hash for tamper detection
   *
   * Hash includes:
   * - Policy identifier and version
   * - State transition (previous → next)
   * - Action performed
   * - Actor who initiated change
   * - Event timestamp
   * - Previous event's hash (chain integrity)
   * - Sequence number (order preservation)
   *
   * @param data Event data with all fields
   * @returns SHA-256 hex digest
   */
  private computeAuditHash(data: {
    policy_id: string;
    policy_version: number;
    previous_state: string;
    next_state: string;
    action: GovernanceAction;
    actor_id?: string;
    timestamp: Date;
    previous_hash: string | null;
    sequence_number: number;
  }): string {
    const hashInput = JSON.stringify({
      policy_id: data.policy_id,
      policy_version: data.policy_version,
      previous_state: data.previous_state,
      next_state: data.next_state,
      action: data.action,
      actor_id: data.actor_id || null,
      timestamp: data.timestamp.toISOString(),
      previous_hash: data.previous_hash,
      sequence_number: data.sequence_number,
    });

    return createHash("sha256").update(hashInput).digest("hex");
  }

  /**
   * Map Prisma model to domain type
   *
   * @param record Raw Prisma record
   * @returns Domain GovernanceAuditEvent
   */
  private mapToDomain(record: any): GovernanceAuditEvent {
    return {
      audit_id: record.audit_id,
      sequence_number: record.sequence_number,
      previous_hash: record.previous_hash,
      audit_hash: record.audit_hash,
      event_type: record.event_type as GovernanceEventType,
      event_timestamp: record.event_timestamp,
      created_at: record.created_at,
      actor_id: record.actor_id,
      subject_type: record.subject_type,
      subject_id: record.subject_id,
      policy_id: record.policy_id,
      policy_version: record.policy_version,
      details: record.details,
    };
  }

  /**
   * Generate CUID for audit_id
   * Copied from Phase 5 implementation (simple CUID format)
   */
  private generateCUID(): string {
    const timestamp = Date.now().toString(36);
    const random = Math.random().toString(36).substring(2, 15);
    return `c${timestamp}${random}`;
  }
}

/**
 * Singleton instance
 * Used throughout the application for audit event creation
 */
export const auditService = new GovernanceAuditEventService();
