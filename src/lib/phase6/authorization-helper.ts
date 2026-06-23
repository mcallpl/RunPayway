/**
 * Phase 6: Authorization Helper
 * Role-based access control for governance transitions
 *
 * Minimal RBAC: 3 roles only (POLICY_CREATOR, POLICY_REVIEWER, POLICY_ADMIN)
 * Service-layer enforcement only (no database storage, no user tables, no permissions tables)
 * No broad enterprise RBAC, no user management, no delegation workflows
 */

import {
  PolicyLifecycleState,
  GovernanceRole,
  GovernanceContext,
  StateTransition,
  VALID_STATE_TRANSITIONS,
} from "./governance-types";

/**
 * AuthorizationHelper
 * In-memory role-based authorization (stateless, no persistence)
 *
 * Does NOT:
 * - Store permissions in database
 * - Manage users or roles
 * - Handle delegation or fine-grained access control
 * - Introduce user tables, role tables, or permissions tables
 */
export class AuthorizationHelper {
  /**
   * Check if actor has a specific role
   *
   * @param context Governance context (contains actor role)
   * @param requiredRole Role to check for
   * @returns true if actor has required role
   */
  hasRole(context: GovernanceContext, requiredRole: GovernanceRole): boolean {
    return context.role === requiredRole;
  }

  /**
   * Get all allowed transitions for a given state and role
   *
   * @param currentState Current policy state
   * @param role Actor role
   * @returns Array of valid transitions (may be empty if no transitions allowed)
   */
  getAllowedTransitions(currentState: PolicyLifecycleState, role: GovernanceRole): StateTransition[] {
    return VALID_STATE_TRANSITIONS.filter((t) => t.from === currentState && t.requiredRole === role);
  }

  /**
   * Check if an actor can perform a specific state transition
   *
   * Validates:
   * 1. Transition exists in VALID_STATE_TRANSITIONS
   * 2. Actor has required role for transition
   *
   * @param currentState Current policy state
   * @param nextState Desired next state
   * @param context Governance context (actor, role)
   * @returns true if transition is allowed for this actor
   */
  canTransition(
    currentState: PolicyLifecycleState,
    nextState: PolicyLifecycleState,
    context: GovernanceContext,
  ): boolean {
    const transition = VALID_STATE_TRANSITIONS.find(
      (t) => t.from === currentState && t.to === nextState,
    );

    if (!transition) {
      return false;
    }

    return this.hasRole(context, transition.requiredRole);
  }

  /**
   * Get role required for a specific transition
   *
   * Useful for error messages ("POLICY_REVIEWER required to approve")
   *
   * @param currentState Current policy state
   * @param nextState Desired next state
   * @returns Required role, or null if transition not valid
   */
  getRequiredRole(currentState: PolicyLifecycleState, nextState: PolicyLifecycleState): GovernanceRole | null {
    const transition = VALID_STATE_TRANSITIONS.find(
      (t) => t.from === currentState && t.to === nextState,
    );

    return transition?.requiredRole ?? null;
  }

  /**
   * Get all valid transitions for a role
   *
   * Useful for UI (show available actions for current user role)
   *
   * @param role Actor role
   * @returns Array of all transitions allowed for this role (across all states)
   */
  getTransitionsForRole(role: GovernanceRole): StateTransition[] {
    return VALID_STATE_TRANSITIONS.filter((t) => t.requiredRole === role);
  }
}

/**
 * Singleton instance
 * Used throughout the application for authorization checks
 */
export const authorizationHelper = new AuthorizationHelper();
