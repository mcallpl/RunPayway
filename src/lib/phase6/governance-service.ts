/**
 * Phase 6: Governance Service
 * Business logic layer for policy lifecycle management
 *
 * Enforces:
 * - State machine validation (8 valid transitions only)
 * - Role-based authorization (3 roles)
 * - Active-only policy selection (fail-closed, no fallback)
 * - Single-ACTIVE invariant (only one ACTIVE version per policy_id)
 *
 * Does NOT:
 * - Mutate Phase 5 tables (Evaluation, PolicyVersion, AuditEvent)
 * - Introduce broad RBAC storage or user management
 * - Handle audit event creation (separate service, Block 5)
 */

import { prisma } from "../prisma";
import {
  governanceRepository,
  PolicyVersionGovernanceRepository,
} from "./governance-repository";
import {
  PolicyVersionGovernance,
  PolicyLifecycleState,
  GovernanceAction,
  GovernanceRole,
  GovernanceContext,
  NoActivePolicyError,
  InvalidStateTransitionError,
  UnauthorizedGovernanceActionError,
  MultipleActivePoliciesError,
  isValidTransition,
  GOVERNANCE_ACTION_TO_EVENT_TYPE,
} from "./governance-types";
import { AuthorizationHelper } from "./authorization-helper";

/**
 * GovernanceService
 * Orchestrates policy lifecycle state machine with role-based authorization
 *
 * All transitions validated before repository.updateState() is called.
 * Repository remains low-level (no validation).
 */
export class GovernanceService {
  private repository: PolicyVersionGovernanceRepository;
  private authHelper: AuthorizationHelper;

  constructor(
    repository: PolicyVersionGovernanceRepository = governanceRepository,
    authHelper: AuthorizationHelper = new AuthorizationHelper(),
  ) {
    this.repository = repository;
    this.authHelper = authHelper;
  }

  /**
   * Select ACTIVE policy version for evaluation
   *
   * Core Invariant:
   * - Query ACTIVE state ONLY
   * - No fallback to APPROVED
   * - No selection by latest/created_at
   * - Throw NoActivePolicyError if none exists
   * - Throw MultipleActivePoliciesError if more than one (invariant violation)
   *
   * @param policy_id Policy identifier
   * @returns ACTIVE governance record
   * @throws NoActivePolicyError if no ACTIVE version exists
   * @throws MultipleActivePoliciesError if multiple ACTIVE versions found (corruption)
   */
  async selectVersionForEvaluation(policy_id: string): Promise<PolicyVersionGovernance> {
    const activeVersion = await this.repository.findActiveVersion(policy_id);

    if (!activeVersion) {
      throw new NoActivePolicyError(policy_id);
    }

    return activeVersion;
  }

  /**
   * Get current state of a policy version (read-only)
   *
   * @param policy_id Policy identifier
   * @param version Policy version number
   * @returns Current governance record or null if not found
   */
  async getState(policy_id: string, version: number): Promise<PolicyVersionGovernance | null> {
    return this.repository.findByCompositeKey(policy_id, version);
  }

  /**
   * Get governance history for a policy (all versions)
   *
   * @param policy_id Policy identifier
   * @returns Array of governance records (empty if policy doesn't exist)
   */
  async getHistory(policy_id: string): Promise<PolicyVersionGovernance[]> {
    return this.repository.findAllVersions(policy_id);
  }

  /**
   * Submit policy for review (DRAFT → PENDING_REVIEW)
   *
   * Requires: POLICY_CREATOR role
   *
   * @param policy_id Policy identifier
   * @param version Policy version number
   * @param context Governance context (actor, role)
   * @returns Updated governance record
   * @throws UnauthorizedGovernanceActionError if actor lacks POLICY_CREATOR role
   * @throws InvalidStateTransitionError if not in DRAFT state
   */
  async submitForReview(
    policy_id: string,
    version: number,
    context: GovernanceContext,
  ): Promise<PolicyVersionGovernance> {
    const current = await this.getState(policy_id, version);
    if (!current) {
      throw new Error(`Policy version not found: ${policy_id} v${version}`);
    }

    // Validate transition
    if (!isValidTransition(current.current_state, PolicyLifecycleState.PENDING_REVIEW, GovernanceRole.POLICY_CREATOR)) {
      throw new InvalidStateTransitionError(current.current_state, PolicyLifecycleState.PENDING_REVIEW);
    }

    // Validate authorization
    if (!this.authHelper.canTransition(current.current_state, PolicyLifecycleState.PENDING_REVIEW, context)) {
      throw new UnauthorizedGovernanceActionError("submitForReview", context.role);
    }

    return this.repository.updateState(
      policy_id,
      version,
      PolicyLifecycleState.PENDING_REVIEW,
      GovernanceAction.SUBMITTED_FOR_REVIEW,
      context.actor_id,
    );
  }

  /**
   * Approve policy (PENDING_REVIEW → APPROVED)
   *
   * Requires: POLICY_REVIEWER role
   * APPROVED means eligible for activation, NOT usable for evaluation
   *
   * @param policy_id Policy identifier
   * @param version Policy version number
   * @param context Governance context (actor, role)
   * @returns Updated governance record
   * @throws UnauthorizedGovernanceActionError if actor lacks POLICY_REVIEWER role
   * @throws InvalidStateTransitionError if not in PENDING_REVIEW state
   */
  async approve(
    policy_id: string,
    version: number,
    context: GovernanceContext,
  ): Promise<PolicyVersionGovernance> {
    const current = await this.getState(policy_id, version);
    if (!current) {
      throw new Error(`Policy version not found: ${policy_id} v${version}`);
    }

    // Validate transition
    if (!isValidTransition(current.current_state, PolicyLifecycleState.APPROVED, GovernanceRole.POLICY_REVIEWER)) {
      throw new InvalidStateTransitionError(current.current_state, PolicyLifecycleState.APPROVED);
    }

    // Validate authorization
    if (!this.authHelper.canTransition(current.current_state, PolicyLifecycleState.APPROVED, context)) {
      throw new UnauthorizedGovernanceActionError("approve", context.role);
    }

    return this.repository.updateState(
      policy_id,
      version,
      PolicyLifecycleState.APPROVED,
      GovernanceAction.APPROVED,
      context.actor_id,
    );
  }

  /**
   * Reject policy (PENDING_REVIEW → REJECTED or APPROVED → REJECTED)
   *
   * Requires: POLICY_REVIEWER role
   * Rejected policies cannot be resubmitted (forces new version)
   *
   * @param policy_id Policy identifier
   * @param version Policy version number
   * @param context Governance context (actor, role)
   * @returns Updated governance record
   * @throws UnauthorizedGovernanceActionError if actor lacks POLICY_REVIEWER role
   * @throws InvalidStateTransitionError if not in PENDING_REVIEW or APPROVED state
   */
  async reject(
    policy_id: string,
    version: number,
    context: GovernanceContext,
  ): Promise<PolicyVersionGovernance> {
    const current = await this.getState(policy_id, version);
    if (!current) {
      throw new Error(`Policy version not found: ${policy_id} v${version}`);
    }

    // Validate transition (from PENDING_REVIEW or APPROVED only)
    if (
      current.current_state !== PolicyLifecycleState.PENDING_REVIEW &&
      current.current_state !== PolicyLifecycleState.APPROVED
    ) {
      throw new InvalidStateTransitionError(current.current_state, PolicyLifecycleState.REJECTED);
    }

    // Validate authorization
    if (!this.authHelper.canTransition(current.current_state, PolicyLifecycleState.REJECTED, context)) {
      throw new UnauthorizedGovernanceActionError("reject", context.role);
    }

    return this.repository.updateState(
      policy_id,
      version,
      PolicyLifecycleState.REJECTED,
      GovernanceAction.REJECTED,
      context.actor_id,
    );
  }

  /**
   * Activate policy (APPROVED → ACTIVE)
   *
   * Requires: POLICY_ADMIN role
   * ACTIVE is the only state usable for new evaluations
   *
   * Single-ACTIVE Invariant:
   * Only one ACTIVE version per policy_id is allowed.
   * If another version is already ACTIVE, activation fails.
   * Caller must explicitly retire or supersede the existing ACTIVE version first.
   *
   * @param policy_id Policy identifier
   * @param version Policy version number
   * @param context Governance context (actor, role)
   * @returns Updated governance record
   * @throws UnauthorizedGovernanceActionError if actor lacks POLICY_ADMIN role
   * @throws InvalidStateTransitionError if not in APPROVED state
   * @throws Error if another version is already ACTIVE (single-ACTIVE constraint)
   */
  async activate(
    policy_id: string,
    version: number,
    context: GovernanceContext,
  ): Promise<PolicyVersionGovernance> {
    const current = await this.getState(policy_id, version);
    if (!current) {
      throw new Error(`Policy version not found: ${policy_id} v${version}`);
    }

    // Validate transition
    if (!isValidTransition(current.current_state, PolicyLifecycleState.ACTIVE, GovernanceRole.POLICY_ADMIN)) {
      throw new InvalidStateTransitionError(current.current_state, PolicyLifecycleState.ACTIVE);
    }

    // Validate authorization
    if (!this.authHelper.canTransition(current.current_state, PolicyLifecycleState.ACTIVE, context)) {
      throw new UnauthorizedGovernanceActionError("activate", context.role);
    }

    // Preserve single-ACTIVE invariant
    const existingActive = await this.repository.findActiveVersion(policy_id);
    if (existingActive && existingActive.version !== version) {
      throw new Error(
        `Cannot activate version ${version}: another version (${existingActive.version}) is already ACTIVE. ` +
          `Retire or supersede the existing ACTIVE version first.`,
      );
    }

    return this.repository.updateState(
      policy_id,
      version,
      PolicyLifecycleState.ACTIVE,
      GovernanceAction.ACTIVATED,
      context.actor_id,
    );
  }

  /**
   * Retire policy (ACTIVE → RETIRED)
   *
   * Requires: POLICY_ADMIN role
   * Archives an active policy (no longer usable for new evaluations)
   *
   * @param policy_id Policy identifier
   * @param version Policy version number
   * @param context Governance context (actor, role)
   * @returns Updated governance record
   * @throws UnauthorizedGovernanceActionError if actor lacks POLICY_ADMIN role
   * @throws InvalidStateTransitionError if not in ACTIVE state
   */
  async retire(
    policy_id: string,
    version: number,
    context: GovernanceContext,
  ): Promise<PolicyVersionGovernance> {
    const current = await this.getState(policy_id, version);
    if (!current) {
      throw new Error(`Policy version not found: ${policy_id} v${version}`);
    }

    // Validate transition (ACTIVE → RETIRED only)
    if (current.current_state !== PolicyLifecycleState.ACTIVE) {
      throw new InvalidStateTransitionError(current.current_state, PolicyLifecycleState.RETIRED);
    }

    // Validate authorization
    if (!this.authHelper.canTransition(current.current_state, PolicyLifecycleState.RETIRED, context)) {
      throw new UnauthorizedGovernanceActionError("retire", context.role);
    }

    return this.repository.updateState(
      policy_id,
      version,
      PolicyLifecycleState.RETIRED,
      GovernanceAction.RETIRED,
      context.actor_id,
    );
  }

  /**
   * Supersede policy (ACTIVE/APPROVED → SUPERSEDED)
   *
   * Requires: POLICY_ADMIN role
   * Replaces an active or approved policy with a newer version
   *
   * Valid from:
   * - ACTIVE (replace active policy with new version)
   * - APPROVED (replace approved policy before activation)
   *
   * @param policy_id Policy identifier
   * @param version Policy version number (version being superseded)
   * @param superseded_by_version Policy version number (new version replacing this one)
   * @param context Governance context (actor, role)
   * @returns Updated governance record
   * @throws UnauthorizedGovernanceActionError if actor lacks POLICY_ADMIN role
   * @throws InvalidStateTransitionError if not in ACTIVE or APPROVED state
   */
  async supersede(
    policy_id: string,
    version: number,
    superseded_by_version: number,
    context: GovernanceContext,
  ): Promise<PolicyVersionGovernance> {
    const current = await this.getState(policy_id, version);
    if (!current) {
      throw new Error(`Policy version not found: ${policy_id} v${version}`);
    }

    // Validate transition (from ACTIVE or APPROVED only)
    if (current.current_state !== PolicyLifecycleState.ACTIVE && current.current_state !== PolicyLifecycleState.APPROVED) {
      throw new InvalidStateTransitionError(current.current_state, PolicyLifecycleState.SUPERSEDED);
    }

    // Validate authorization
    if (!this.authHelper.canTransition(current.current_state, PolicyLifecycleState.SUPERSEDED, context)) {
      throw new UnauthorizedGovernanceActionError("supersede", context.role);
    }

    // Verify superseding version exists
    const supersedingVersion = await this.getState(policy_id, superseded_by_version);
    if (!supersedingVersion) {
      throw new Error(`Superseding version not found: ${policy_id} v${superseded_by_version}`);
    }

    return this.repository.updateState(
      policy_id,
      version,
      PolicyLifecycleState.SUPERSEDED,
      GovernanceAction.SUPERSEDED,
      context.actor_id,
    );
  }
}

/**
 * Singleton instance
 * Used throughout the application for governance business logic
 */
export const governanceService = new GovernanceService();
