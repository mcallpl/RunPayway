/**
 * Phase 6: Policy Governance Layer
 * Barrel export for all governance-related types, services, and repositories
 */

export {
  PolicyLifecycleState,
  GovernanceAction,
  GovernanceEventType,
  GovernanceRole,
  VALID_POLICY_LIFECYCLE_STATES,
  VALID_GOVERNANCE_ACTIONS,
  VALID_GOVERNANCE_EVENT_TYPES,
  VALID_GOVERNANCE_ROLES,
  GOVERNANCE_ACTION_TO_EVENT_TYPE,
  type PolicyVersionGovernance,
  type GovernanceAuditEvent,
  type GovernanceAuditEventPayload,
  type StateTransition,
  VALID_STATE_TRANSITIONS,
  getValidTransitionsFrom,
  isValidTransition,
  type GovernanceContext,
  NoActivePolicyError,
  InvalidStateTransitionError,
  UnauthorizedGovernanceActionError,
  GovernanceRecordNotFoundError,
  MultipleActivePoliciesError,
  isPolicyLifecycleState,
  isGovernanceAction,
  isGovernanceRole,
} from "./governance-types";

export {
  PolicyVersionGovernanceRepository,
  governanceRepository,
} from "./governance-repository";
