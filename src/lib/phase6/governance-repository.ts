/**
 * Phase 6: Governance Repository
 * Data access layer for PolicyVersionGovernance table
 *
 * Constraints:
 * - Read-only access to PolicyVersion (verification only)
 * - No mutations to Phase 5 tables
 * - No business logic, validation, or state machine
 * - No authorization checks
 * - Active-only queries return ACTIVE state only (no fallback)
 */

import { prisma } from "../prisma";
import {
  PolicyVersionGovernance,
  PolicyLifecycleState,
  GovernanceAction,
  GovernanceRecordNotFoundError,
  MultipleActivePoliciesError,
} from "./governance-types";

/**
 * PolicyVersionGovernanceRepository
 * Pure data access layer for governance records
 *
 * No validation, no authorization, no business logic.
 * All state machine and role checks belong in GovernanceService.
 */
export class PolicyVersionGovernanceRepository {
  /**
   * Find governance record by composite key (policy_id, version)
   *
   * @param policy_id Policy identifier
   * @param version Policy version number
   * @returns Governance record or null if not found
   */
  async findByCompositeKey(
    policy_id: string,
    version: number,
  ): Promise<PolicyVersionGovernance | null> {
    const record = await prisma.policyVersionGovernance.findUnique({
      where: {
        policy_id_version: { policy_id, version },
      },
    });

    if (!record) {
      return null;
    }

    return this.mapToDomain(record);
  }

  /**
   * Find ACTIVE version for a policy (exact state match only)
   *
   * No fallback logic. No selection of APPROVED, DRAFT, or other states.
   * Returns null if no ACTIVE version exists (caller handles fail-closed).
   *
   * @param policy_id Policy identifier
   * @returns ACTIVE governance record or null
   * @throws MultipleActivePoliciesError if multiple ACTIVE versions found (invariant violation)
   */
  async findActiveVersion(policy_id: string): Promise<PolicyVersionGovernance | null> {
    const records = await prisma.policyVersionGovernance.findMany({
      where: {
        policy_id,
        current_state: "ACTIVE",
      },
    });

    if (records.length === 0) {
      return null;
    }

    if (records.length > 1) {
      throw new MultipleActivePoliciesError(policy_id);
    }

    return this.mapToDomain(records[0]);
  }

  /**
   * Find all versions of a policy (optionally filtered by state)
   *
   * @param policy_id Policy identifier
   * @param state Optional state filter
   * @returns Array of governance records (empty if none found)
   */
  async findAllVersions(
    policy_id: string,
    state?: PolicyLifecycleState,
  ): Promise<PolicyVersionGovernance[]> {
    const records = await prisma.policyVersionGovernance.findMany({
      where: {
        policy_id,
        ...(state && { current_state: state }),
      },
      orderBy: {
        version: "asc",
      },
    });

    return records.map((r) => this.mapToDomain(r));
  }

  /**
   * Find all policies in a given state
   *
   * Useful for queries like "get all APPROVED policies" or "get all ACTIVE policies"
   *
   * @param state Policy lifecycle state
   * @returns Array of governance records (empty if none found)
   */
  async findByState(state: PolicyLifecycleState): Promise<PolicyVersionGovernance[]> {
    const records = await prisma.policyVersionGovernance.findMany({
      where: {
        current_state: state,
      },
      orderBy: {
        state_changed_at: "desc",
      },
    });

    return records.map((r) => this.mapToDomain(r));
  }

  /**
   * Create initial governance record for a new policy version
   *
   * Precondition: PolicyVersion must exist (caller verifies via policyRepository)
   * Initial state: DRAFT
   *
   * @param policy_id Policy identifier
   * @param version Policy version number
   * @param created_by User ID of creator (optional)
   * @returns Newly created governance record
   */
  async create(
    policy_id: string,
    version: number,
    created_by?: string,
  ): Promise<PolicyVersionGovernance> {
    const record = await prisma.policyVersionGovernance.create({
      data: {
        policy_id,
        version,
        current_state: "DRAFT",
        previous_state: null,
        created_at: new Date(),
        state_changed_at: new Date(),
        last_actor_id: created_by,
        last_action: "CREATED",
        transition_count: 0,
        created_by,
        last_modified_by: created_by,
      },
    });

    return this.mapToDomain(record);
  }

  /**
   * Update governance state (low-level persistence only)
   *
   * No validation, no authorization, no state machine logic.
   * Caller must ensure transition is valid and authorized.
   *
   * Updates:
   * - current_state: new state
   * - previous_state: prior state (for audit)
   * - state_changed_at: current timestamp
   * - last_actor_id: who made the change
   * - last_action: what action was performed
   * - transition_count: increment by 1
   * - last_modified_by: who performed the update
   *
   * @param policy_id Policy identifier
   * @param version Policy version number
   * @param newState New lifecycle state
   * @param action Action that triggered the transition
   * @param actor_id User ID performing the action (optional)
   * @returns Updated governance record
   * @throws GovernanceRecordNotFoundError if record does not exist
   */
  async updateState(
    policy_id: string,
    version: number,
    newState: PolicyLifecycleState,
    action: GovernanceAction,
    actor_id?: string,
  ): Promise<PolicyVersionGovernance> {
    // Fetch current record to get previous_state
    const current = await prisma.policyVersionGovernance.findUnique({
      where: {
        policy_id_version: { policy_id, version },
      },
    });

    if (!current) {
      throw new GovernanceRecordNotFoundError(policy_id, version);
    }

    const updated = await prisma.policyVersionGovernance.update({
      where: {
        policy_id_version: { policy_id, version },
      },
      data: {
        current_state: newState,
        previous_state: current.current_state,
        state_changed_at: new Date(),
        last_actor_id: actor_id,
        last_action: action,
        transition_count: current.transition_count + 1,
        last_modified_by: actor_id,
      },
    });

    return this.mapToDomain(updated);
  }

  /**
   * Map Prisma model to domain type
   *
   * Prisma returns database types; convert to domain types.
   *
   * @param record Raw Prisma record
   * @returns Domain PolicyVersionGovernance
   */
  private mapToDomain(record: any): PolicyVersionGovernance {
    return {
      policy_id: record.policy_id,
      version: record.version,
      current_state: record.current_state as PolicyLifecycleState,
      previous_state: record.previous_state as PolicyLifecycleState | null | undefined,
      created_at: record.created_at,
      state_changed_at: record.state_changed_at,
      last_actor_id: record.last_actor_id,
      last_action: record.last_action as GovernanceAction | null | undefined,
      transition_count: record.transition_count,
      created_by: record.created_by,
      last_modified_by: record.last_modified_by,
    };
  }

  /**
   * Health check: Verify table exists and is accessible
   *
   * Used for startup diagnostics and testing.
   *
   * @returns true if table is accessible, false otherwise
   */
  async isHealthy(): Promise<boolean> {
    try {
      await prisma.policyVersionGovernance.findMany({
        take: 1,
      });
      return true;
    } catch {
      return false;
    }
  }
}

/**
 * Singleton instance
 * Used throughout the application for governance data access
 */
export const governanceRepository = new PolicyVersionGovernanceRepository();
