import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { prisma } from "../../src/lib/prisma";
import { governanceService } from "../../src/lib/phase6";
import {
  PolicyLifecycleState,
  NoActivePolicyError,
  MultipleActivePoliciesError,
} from "../../src/lib/phase6";

// ============================================================================
// Test Setup
// ============================================================================

/**
 * Test fixture: Create a policy version and its governance record
 */
async function createTestPolicy(
  policy_id: string,
  version: number,
  state: PolicyLifecycleState = PolicyLifecycleState.DRAFT,
) {
  await prisma.policyVersion.create({
    data: {
      policy_id,
      version,
      source_definition: JSON.stringify({ test: true }),
      compiled_hash: `hash_${policy_id}_v${version}`,
      created_by: "test_setup",
    },
  });

  await prisma.policyVersionGovernance.create({
    data: {
      policy_id,
      version,
      current_state: state,
      previous_state: null,
      created_at: new Date(),
      state_changed_at: new Date(),
      last_actor_id: "test_setup",
      last_action: "CREATED",
      transition_count: 0,
      created_by: "test_setup",
    },
  });
}

/**
 * Test cleanup: Remove all test data
 * Wrapped in try/catch to handle SQLite locking issues
 */
async function cleanupTestData(policy_id: string) {
  try {
    await prisma.policyVersionGovernance.deleteMany({
      where: { policy_id },
    });
    await prisma.policyVersion.deleteMany({
      where: { policy_id },
    });
  } catch (error) {
    // Ignore cleanup errors (SQLite locking, etc.)
    // Fresh test.db is created before all tests anyway
    console.warn(`Cleanup warning for ${policy_id}:`, error);
  }
}

// ============================================================================
// Test Suites
// ============================================================================

describe("Phase 6: ACTIVE-Only Policy Selection", () => {
  const policy_id = "test_policy_active_only";

  afterEach(async () => {
    await cleanupTestData(policy_id);
  });

  describe("selectVersionForEvaluation: ACTIVE-Only Behavior", () => {
    it("returns ACTIVE version when available", async () => {
      await createTestPolicy(policy_id, 1, PolicyLifecycleState.ACTIVE);
      const result = await governanceService.selectVersionForEvaluation(policy_id);
      expect(result.current_state).toBe(PolicyLifecycleState.ACTIVE);
      expect(result.version).toBe(1);
    });

    it("does NOT return APPROVED version (no fallback)", async () => {
      await createTestPolicy(policy_id, 1, PolicyLifecycleState.APPROVED);
      await expect(governanceService.selectVersionForEvaluation(policy_id)).rejects.toThrow(
        NoActivePolicyError,
      );
    });

    it("does NOT return DRAFT version", async () => {
      await createTestPolicy(policy_id, 1, PolicyLifecycleState.DRAFT);
      await expect(governanceService.selectVersionForEvaluation(policy_id)).rejects.toThrow(
        NoActivePolicyError,
      );
    });

    it("does NOT return PENDING_REVIEW version", async () => {
      await createTestPolicy(policy_id, 1, PolicyLifecycleState.PENDING_REVIEW);
      await expect(governanceService.selectVersionForEvaluation(policy_id)).rejects.toThrow(
        NoActivePolicyError,
      );
    });

    it("does NOT return RETIRED version", async () => {
      await createTestPolicy(policy_id, 1, PolicyLifecycleState.RETIRED);
      await expect(governanceService.selectVersionForEvaluation(policy_id)).rejects.toThrow(
        NoActivePolicyError,
      );
    });

    it("does NOT return SUPERSEDED version", async () => {
      await createTestPolicy(policy_id, 1, PolicyLifecycleState.SUPERSEDED);
      await expect(governanceService.selectVersionForEvaluation(policy_id)).rejects.toThrow(
        NoActivePolicyError,
      );
    });

    it("does NOT return REJECTED version", async () => {
      await createTestPolicy(policy_id, 1, PolicyLifecycleState.REJECTED);
      await expect(governanceService.selectVersionForEvaluation(policy_id)).rejects.toThrow(
        NoActivePolicyError,
      );
    });

    it("does NOT select by latest created_at (only checks state)", async () => {
      // Create v2 APPROVED (latest by time)
      await createTestPolicy(policy_id, 2, PolicyLifecycleState.APPROVED);
      // Create v1 ACTIVE (not latest by time)
      await createTestPolicy(policy_id, 1, PolicyLifecycleState.ACTIVE);

      const result = await governanceService.selectVersionForEvaluation(policy_id);
      expect(result.version).toBe(1); // Should return ACTIVE v1, not APPROVED v2
      expect(result.current_state).toBe(PolicyLifecycleState.ACTIVE);
    });

    it("does NOT select by latest version number (only checks state)", async () => {
      // Create v10 APPROVED (higher version)
      await createTestPolicy(policy_id, 10, PolicyLifecycleState.APPROVED);
      // Create v1 ACTIVE (lower version)
      await createTestPolicy(policy_id, 1, PolicyLifecycleState.ACTIVE);

      const result = await governanceService.selectVersionForEvaluation(policy_id);
      expect(result.version).toBe(1); // Should return ACTIVE v1, not APPROVED v10
    });
  });

  describe("Fail-Closed: NoActivePolicy Error", () => {
    it("throws NoActivePolicy when no ACTIVE version exists", async () => {
      await createTestPolicy(policy_id, 1, PolicyLifecycleState.APPROVED);
      await expect(governanceService.selectVersionForEvaluation(policy_id)).rejects.toThrow(
        NoActivePolicyError,
      );
    });

    it("error message includes policy_id", async () => {
      await createTestPolicy(policy_id, 1, PolicyLifecycleState.DRAFT);
      await expect(governanceService.selectVersionForEvaluation(policy_id)).rejects.toThrow(
        `No ACTIVE policy version found for policy_id: ${policy_id}`,
      );
    });

    it("no fallback to APPROVED when ACTIVE missing", async () => {
      // Create only APPROVED version
      await createTestPolicy(policy_id, 1, PolicyLifecycleState.APPROVED);

      // Attempting to use this policy for evaluation should fail
      await expect(governanceService.selectVersionForEvaluation(policy_id)).rejects.toThrow(
        NoActivePolicyError,
      );

      // Verify it's not silently using the APPROVED version
      const state = await governanceService.getState(policy_id, 1);
      expect(state?.current_state).toBe(PolicyLifecycleState.APPROVED);
    });
  });

  describe("Fail-Closed: MultipleActivePolicies Error", () => {
    it("throws MultipleActivePoliciesError when multiple ACTIVE versions exist", async () => {
      // Create two ACTIVE versions (data corruption)
      await createTestPolicy(policy_id, 1, PolicyLifecycleState.ACTIVE);
      await createTestPolicy(policy_id, 2, PolicyLifecycleState.ACTIVE);

      await expect(governanceService.selectVersionForEvaluation(policy_id)).rejects.toThrow(
        MultipleActivePoliciesError,
      );
    });

    it("error message indicates invariant violation", async () => {
      await createTestPolicy(policy_id, 1, PolicyLifecycleState.ACTIVE);
      await createTestPolicy(policy_id, 2, PolicyLifecycleState.ACTIVE);

      await expect(governanceService.selectVersionForEvaluation(policy_id)).rejects.toThrow(
        `Multiple ACTIVE versions found for policy_id: ${policy_id}`,
      );
    });

    it("distinguishable from NoActivePolicy error", async () => {
      // Multiple ACTIVE scenario
      await createTestPolicy(policy_id, 1, PolicyLifecycleState.ACTIVE);
      await createTestPolicy(policy_id, 2, PolicyLifecycleState.ACTIVE);

      const error = await governanceService
        .selectVersionForEvaluation(policy_id)
        .catch((e) => e);
      expect(error).toBeInstanceOf(MultipleActivePoliciesError);
      expect(error.name).toBe("MultipleActivePoliciesError");
    });
  });

  describe("Edge Cases", () => {
    it("works with ACTIVE version among multiple versions in other states", async () => {
      await createTestPolicy(policy_id, 1, PolicyLifecycleState.DRAFT);
      await createTestPolicy(policy_id, 2, PolicyLifecycleState.APPROVED);
      await createTestPolicy(policy_id, 3, PolicyLifecycleState.ACTIVE);
      await createTestPolicy(policy_id, 4, PolicyLifecycleState.RETIRED);

      const result = await governanceService.selectVersionForEvaluation(policy_id);
      expect(result.version).toBe(3);
      expect(result.current_state).toBe(PolicyLifecycleState.ACTIVE);
    });

    it("throws NoActivePolicy when policy never existed", async () => {
      await expect(governanceService.selectVersionForEvaluation("nonexistent_policy")).rejects.toThrow(
        NoActivePolicyError,
      );
    });
  });
});
