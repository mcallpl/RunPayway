/**
 * Phase 6: Policy Governance Layer
 * Deterministic policy lifecycle management (DRAFT → PENDING_REVIEW → APPROVED → ACTIVE → RETIRED/SUPERSEDED)
 *
 * Core Invariant: APPROVED means eligible for activation, not usable for evaluation.
 * Only ACTIVE versions usable for new evaluations.
 * If no ACTIVE version exists, evaluation fails closed (NoActivePolicy error).
 * Replay uses historical (policy_id, version), ignoring current governance state.
 */

// ============================================================================
// POLICY LIFECYCLE STATES
// ============================================================================

export enum PolicyLifecycleState {
  /** Initial state: policy created, not yet submitted for review */
  DRAFT = "DRAFT",

  /** Under review: submitted for review, awaiting approval */
  PENDING_REVIEW = "PENDING_REVIEW",

  /** Approved: eligible for activation, but not yet active */
  APPROVED = "APPROVED",

  /** Active: usable for new evaluations. Only one ACTIVE per policy_id */
  ACTIVE = "ACTIVE",

  /** Retired: no longer used, archived */
  RETIRED = "RETIRED",

  /** Superseded: replaced by newer version */
  SUPERSEDED = "SUPERSEDED",

  /** Rejected: not approved, will not be activated */
  REJECTED = "REJECTED",
}

export const VALID_POLICY_LIFECYCLE_STATES = Object.values(PolicyLifecycleState);

// ============================================================================
// GOVERNANCE ACTIONS
// ============================================================================

export enum GovernanceAction {
  /** Initial action: governance record created with policy version */
  CREATED = "CREATED",

  /** Action: policy submitted for review */
  SUBMITTED_FOR_REVIEW = "SUBMITTED_FOR_REVIEW",

  /** Action: policy approved by reviewer */
  APPROVED = "APPROVED",

  /** Action: policy rejected by reviewer */
  REJECTED = "REJECTED",

  /** Action: approved policy activated for evaluations */
  ACTIVATED = "ACTIVATED",

  /** Action: active policy retired (archived) */
  RETIRED = "RETIRED",

  /** Action: policy superseded by newer version */
  SUPERSEDED = "SUPERSEDED",
}

export const VALID_GOVERNANCE_ACTIONS = Object.values(GovernanceAction);

// ============================================================================
// GOVERNANCE AUDIT EVENT TYPES
// ============================================================================

export enum GovernanceEventType {
  POLICY_GOVERNANCE_CREATED = "POLICY_GOVERNANCE_CREATED",
  POLICY_SUBMITTED_FOR_REVIEW = "POLICY_SUBMITTED_FOR_REVIEW",
  POLICY_APPROVED = "POLICY_APPROVED",
  POLICY_REJECTED = "POLICY_REJECTED",
  POLICY_ACTIVATED = "POLICY_ACTIVATED",
  POLICY_RETIRED = "POLICY_RETIRED",
  POLICY_SUPERSEDED = "POLICY_SUPERSEDED",
}

export const VALID_GOVERNANCE_EVENT_TYPES = Object.values(GovernanceEventType);

// Map GovernanceAction to GovernanceEventType
export const GOVERNANCE_ACTION_TO_EVENT_TYPE: Record<GovernanceAction, GovernanceEventType> = {
  [GovernanceAction.CREATED]: GovernanceEventType.POLICY_GOVERNANCE_CREATED,
  [GovernanceAction.SUBMITTED_FOR_REVIEW]: GovernanceEventType.POLICY_SUBMITTED_FOR_REVIEW,
  [GovernanceAction.APPROVED]: GovernanceEventType.POLICY_APPROVED,
  [GovernanceAction.REJECTED]: GovernanceEventType.POLICY_REJECTED,
  [GovernanceAction.ACTIVATED]: GovernanceEventType.POLICY_ACTIVATED,
  [GovernanceAction.RETIRED]: GovernanceEventType.POLICY_RETIRED,
  [GovernanceAction.SUPERSEDED]: GovernanceEventType.POLICY_SUPERSEDED,
};

// ============================================================================
// AUTHORIZATION ROLES
// ============================================================================

export enum GovernanceRole {
  /** Can create policy versions, submit for review */
  POLICY_CREATOR = "POLICY_CREATOR",

  /** Can review and approve/reject policy versions */
  POLICY_REVIEWER = "POLICY_REVIEWER",

  /** Can activate, retire, supersede policies */
  POLICY_ADMIN = "POLICY_ADMIN",
}

export const VALID_GOVERNANCE_ROLES = Object.values(GovernanceRole);

// ============================================================================
// POLICY VERSION GOVERNANCE
// ============================================================================

export interface PolicyVersionGovernance {
  /** Policy identifier */
  policy_id: string;

  /** Policy version number */
  version: number;

  /** Current lifecycle state */
  current_state: PolicyLifecycleState;

  /** Previous state (for audit trail) */
  previous_state?: PolicyLifecycleState | null;

  /** Timestamp when governance record was created */
  created_at: Date;

  /** Timestamp when state last changed */
  state_changed_at: Date;

  /** Actor who made the last state change */
  last_actor_id?: string | null;

  /** Last action performed (CREATED, SUBMITTED_FOR_REVIEW, etc.) */
  last_action?: GovernanceAction | null;

  /** Count of state transitions */
  transition_count: number;

  /** User who created the governance record */
  created_by?: string | null;

  /** User who last modified the governance record */
  last_modified_by?: string | null;
}

// ============================================================================
// GOVERNANCE AUDIT EVENT
// ============================================================================

export interface GovernanceAuditEventPayload {
  policy_id: string;
  version: number;
  previous_state: PolicyLifecycleState;
  next_state: PolicyLifecycleState;
  action: GovernanceAction;
  actor_id?: string;
  superseded_by_version?: number; // Set if action is SUPERSEDED
  timestamp: Date;
}

export interface GovernanceAuditEvent {
  /** Audit event identifier */
  audit_id: string;

  /** Sequential event number (for ordering) */
  sequence_number: number;

  /** Hash of previous audit event (for chain integrity) */
  previous_hash?: string | null;

  /** Hash of this audit event */
  audit_hash: string;

  /** Event type (POLICY_GOVERNANCE_*) */
  event_type: GovernanceEventType;

  /** Timestamp when event occurred */
  event_timestamp: Date;

  /** Timestamp when event was recorded */
  created_at: Date;

  /** Actor who triggered the event */
  actor_id?: string | null;

  /** Subject type (always "POLICY_VERSION_GOVERNANCE" for governance events) */
  subject_type: string;

  /** Subject ID (policy_id for governance events) */
  subject_id: string;

  /** Related policy ID */
  policy_id?: string | null;

  /** Related policy version */
  policy_version?: number | null;

  /** Event details as JSON string */
  details: string; // JSON stringified GovernanceAuditEventPayload
}

// ============================================================================
// STATE TRANSITION RULES
// ============================================================================

export interface StateTransition {
  from: PolicyLifecycleState;
  to: PolicyLifecycleState;
  action: GovernanceAction;
  requiredRole: GovernanceRole;
}

/**
 * Valid state transitions for policy lifecycle
 * Enforced by GovernanceService
 */
export const VALID_STATE_TRANSITIONS: StateTransition[] = [
  // DRAFT → PENDING_REVIEW (submit for review)
  {
    from: PolicyLifecycleState.DRAFT,
    to: PolicyLifecycleState.PENDING_REVIEW,
    action: GovernanceAction.SUBMITTED_FOR_REVIEW,
    requiredRole: GovernanceRole.POLICY_CREATOR,
  },

  // PENDING_REVIEW → APPROVED (approval by reviewer)
  {
    from: PolicyLifecycleState.PENDING_REVIEW,
    to: PolicyLifecycleState.APPROVED,
    action: GovernanceAction.APPROVED,
    requiredRole: GovernanceRole.POLICY_REVIEWER,
  },

  // PENDING_REVIEW → REJECTED (rejection by reviewer)
  {
    from: PolicyLifecycleState.PENDING_REVIEW,
    to: PolicyLifecycleState.REJECTED,
    action: GovernanceAction.REJECTED,
    requiredRole: GovernanceRole.POLICY_REVIEWER,
  },

  // APPROVED → ACTIVE (activation by admin)
  {
    from: PolicyLifecycleState.APPROVED,
    to: PolicyLifecycleState.ACTIVE,
    action: GovernanceAction.ACTIVATED,
    requiredRole: GovernanceRole.POLICY_ADMIN,
  },

  // APPROVED → REJECTED (rejection after approval, before activation)
  {
    from: PolicyLifecycleState.APPROVED,
    to: PolicyLifecycleState.REJECTED,
    action: GovernanceAction.REJECTED,
    requiredRole: GovernanceRole.POLICY_REVIEWER,
  },

  // ACTIVE → RETIRED (retire policy)
  {
    from: PolicyLifecycleState.ACTIVE,
    to: PolicyLifecycleState.RETIRED,
    action: GovernanceAction.RETIRED,
    requiredRole: GovernanceRole.POLICY_ADMIN,
  },

  // ACTIVE → SUPERSEDED (supersede with newer version)
  {
    from: PolicyLifecycleState.ACTIVE,
    to: PolicyLifecycleState.SUPERSEDED,
    action: GovernanceAction.SUPERSEDED,
    requiredRole: GovernanceRole.POLICY_ADMIN,
  },

  // APPROVED → SUPERSEDED (supersede approved policy before activation)
  {
    from: PolicyLifecycleState.APPROVED,
    to: PolicyLifecycleState.SUPERSEDED,
    action: GovernanceAction.SUPERSEDED,
    requiredRole: GovernanceRole.POLICY_ADMIN,
  },
];

/**
 * Get valid transitions FROM a given state
 */
export function getValidTransitionsFrom(fromState: PolicyLifecycleState): StateTransition[] {
  return VALID_STATE_TRANSITIONS.filter((t) => t.from === fromState);
}

/**
 * Check if a transition is valid
 */
export function isValidTransition(
  fromState: PolicyLifecycleState,
  toState: PolicyLifecycleState,
  requiredRole: GovernanceRole,
): boolean {
  return VALID_STATE_TRANSITIONS.some(
    (t) => t.from === fromState && t.to === toState && t.requiredRole === requiredRole,
  );
}

// ============================================================================
// GOVERNANCE CONTEXT
// ============================================================================

export interface GovernanceContext {
  /** Actor ID (user performing the action) */
  actor_id: string;

  /** Actor's role */
  role: GovernanceRole;

  /** Request timestamp */
  timestamp: Date;

  /** Request correlation ID (for tracing) */
  correlation_id?: string;
}

// ============================================================================
// GOVERNANCE ERROR TYPES
// ============================================================================

export class NoActivePolicyError extends Error {
  constructor(policy_id: string) {
    super(`No ACTIVE policy version found for policy_id: ${policy_id}`);
    this.name = "NoActivePolicyError";
  }
}

export class InvalidStateTransitionError extends Error {
  constructor(from: PolicyLifecycleState, to: PolicyLifecycleState) {
    super(`Invalid state transition: ${from} → ${to}`);
    this.name = "InvalidStateTransitionError";
  }
}

export class UnauthorizedGovernanceActionError extends Error {
  constructor(action: string, role: GovernanceRole) {
    super(`Unauthorized: ${role} cannot perform ${action}`);
    this.name = "UnauthorizedGovernanceActionError";
  }
}

export class GovernanceRecordNotFoundError extends Error {
  constructor(policy_id: string, version: number) {
    super(`Governance record not found: ${policy_id} v${version}`);
    this.name = "GovernanceRecordNotFoundError";
  }
}

export class MultipleActivePoliciesError extends Error {
  constructor(policy_id: string) {
    super(`Multiple ACTIVE versions found for policy_id: ${policy_id}. This should not happen.`);
    this.name = "MultipleActivePoliciesError";
  }
}

// ============================================================================
// TYPE GUARDS
// ============================================================================

export function isPolicyLifecycleState(value: unknown): value is PolicyLifecycleState {
  return typeof value === "string" && Object.values(PolicyLifecycleState).includes(value as PolicyLifecycleState);
}

export function isGovernanceAction(value: unknown): value is GovernanceAction {
  return typeof value === "string" && Object.values(GovernanceAction).includes(value as GovernanceAction);
}

export function isGovernanceRole(value: unknown): value is GovernanceRole {
  return typeof value === "string" && Object.values(GovernanceRole).includes(value as GovernanceRole);
}
