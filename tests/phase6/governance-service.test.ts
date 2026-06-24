import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { prisma } from "../../src/lib/prisma";
import { governanceService } from "../../src/lib/phase6";
import {
  PolicyLifecycleState,
  GovernanceRole,
  GovernanceContext,
  InvalidStateTransitionError,
  UnauthorizedGovernanceActionError,
} from "../../src/lib/phase6";

// ============================================================================
// Test Setup
// ============================================================================

const testContext: GovernanceContext = {
  actor_id: "test_actor_001",
  role: GovernanceRole.POLICY_CREATOR,
  timestamp: new Date(),
};

const creatorContext: GovernanceContext = {
  actor_id: "creator_001",
  role: GovernanceRole.POLICY_CREATOR,
  timestamp: new Date(),
};

const reviewerContext: GovernanceContext = {
  actor_id: "reviewer_001",
  role: GovernanceRole.POLICY_REVIEWER,
  timestamp: new Date(),
};

const adminContext: GovernanceContext = {
  actor_id: "admin_001",
  role: GovernanceRole.POLICY_ADMIN,
  timestamp: new Date(),
};

/**
 * Test fixture: Create a policy version and its governance record
 * Pre-condition: Policy must exist in PolicyVersion table
 */
async function createTestPolicy(policy_id: string, version: number, initial_state: PolicyLifecycleState = PolicyLifecycleState.DRAFT) {
  // Create policy version (immutable)
  await prisma.policyVersion.create({
    data: {
      policy_id,
      version,
      source_definition: JSON.stringify({ test: true }),
      compiled_hash: `hash_${policy_id}_v${version}`,
      created_by: "test_setup",
    },
  });

  // Create governance record with initial state
  await prisma.policyVersionGovernance.create({
    data: {
      policy_id,
      version,
      current_state: initial_state,
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

describe("Phase 6: State Transitions", () => {
  const policy_id = "test_policy_transitions";

  beforeEach(async () => {
    await createTestPolicy(policy_id, 1, PolicyLifecycleState.DRAFT);
  });

  afterEach(async () => {
    await cleanupTestData(policy_id);
  });

  describe("Valid Transitions", () => {
    it("DRAFT → PENDING_REVIEW (submit for review)", async () => {
      const result = await governanceService.submitForReview(policy_id, 1, creatorContext);
      expect(result.current_state).toBe(PolicyLifecycleState.PENDING_REVIEW);
      expect(result.previous_state).toBe(PolicyLifecycleState.DRAFT);
    });

    it("PENDING_REVIEW → APPROVED (approve)", async () => {
      await createTestPolicy(policy_id, 2, PolicyLifecycleState.PENDING_REVIEW);
      const result = await governanceService.approve(policy_id, 2, reviewerContext);
      expect(result.current_state).toBe(PolicyLifecycleState.APPROVED);
      expect(result.previous_state).toBe(PolicyLifecycleState.PENDING_REVIEW);
    });

    it("PENDING_REVIEW → REJECTED (reject)", async () => {
      await createTestPolicy(policy_id, 3, PolicyLifecycleState.PENDING_REVIEW);
      const result = await governanceService.reject(policy_id, 3, reviewerContext);
      expect(result.current_state).toBe(PolicyLifecycleState.REJECTED);
    });

    it("APPROVED → ACTIVE (activate)", async () => {
      await createTestPolicy(policy_id, 4, PolicyLifecycleState.APPROVED);
      const result = await governanceService.activate(policy_id, 4, adminContext);
      expect(result.current_state).toBe(PolicyLifecycleState.ACTIVE);
    });

    it("ACTIVE → RETIRED (retire)", async () => {
      await createTestPolicy(policy_id, 5, PolicyLifecycleState.ACTIVE);
      const result = await governanceService.retire(policy_id, 5, adminContext);
      expect(result.current_state).toBe(PolicyLifecycleState.RETIRED);
    });

    it("ACTIVE → SUPERSEDED (supersede)", async () => {
      await createTestPolicy(policy_id, 6, PolicyLifecycleState.ACTIVE);
      await createTestPolicy(policy_id, 7, PolicyLifecycleState.DRAFT);
      const result = await governanceService.supersede(policy_id, 6, 7, adminContext);
      expect(result.current_state).toBe(PolicyLifecycleState.SUPERSEDED);
    });

    it("APPROVED → REJECTED (reject after approval)", async () => {
      await createTestPolicy(policy_id, 8, PolicyLifecycleState.APPROVED);
      const result = await governanceService.reject(policy_id, 8, reviewerContext);
      expect(result.current_state).toBe(PolicyLifecycleState.REJECTED);
    });

    it("APPROVED → SUPERSEDED (supersede before activation)", async () => {
      await createTestPolicy(policy_id, 9, PolicyLifecycleState.APPROVED);
      await createTestPolicy(policy_id, 10, PolicyLifecycleState.DRAFT);
      const result = await governanceService.supersede(policy_id, 9, 10, adminContext);
      expect(result.current_state).toBe(PolicyLifecycleState.SUPERSEDED);
    });
  });

  describe("Invalid Transitions (Blocked)", () => {
    it("DRAFT → ACTIVE (cannot skip PENDING_REVIEW)", async () => {
      await expect(governanceService.activate(policy_id, 1, adminContext)).rejects.toThrow(
        InvalidStateTransitionError,
      );
    });

    it("REJECTED → DRAFT (rejected policies cannot be resubmitted)", async () => {
      await createTestPolicy(policy_id, 11, PolicyLifecycleState.REJECTED);
      await expect(governanceService.submitForReview(policy_id, 11, creatorContext)).rejects.toThrow(
        InvalidStateTransitionError,
      );
    });

    it("APPROVED → RETIRED (cannot retire unapproved policy)", async () => {
      await createTestPolicy(policy_id, 12, PolicyLifecycleState.APPROVED);
      await expect(governanceService.retire(policy_id, 12, adminContext)).rejects.toThrow(
        InvalidStateTransitionError,
      );
    });

    it("PENDING_REVIEW → ACTIVE (cannot skip APPROVED)", async () => {
      await createTestPolicy(policy_id, 13, PolicyLifecycleState.PENDING_REVIEW);
      await expect(governanceService.activate(policy_id, 13, adminContext)).rejects.toThrow(
        InvalidStateTransitionError,
      );
    });
  });

  describe("Transition Metadata", () => {
    it("transition_count increments on each state change", async () => {
      await governanceService.submitForReview(policy_id, 1, creatorContext);
      const result = await governanceService.getState(policy_id, 1);
      expect(result?.transition_count).toBe(1);
    });

    it("last_actor_id is recorded", async () => {
      await governanceService.submitForReview(policy_id, 1, creatorContext);
      const result = await governanceService.getState(policy_id, 1);
      expect(result?.last_actor_id).toBe("creator_001");
    });

    it("state_changed_at is updated", async () => {
      const before = new Date();
      await governanceService.submitForReview(policy_id, 1, creatorContext);
      const result = await governanceService.getState(policy_id, 1);
      const after = new Date();
      expect(result?.state_changed_at.getTime()).toBeGreaterThanOrEqual(before.getTime());
      expect(result?.state_changed_at.getTime()).toBeLessThanOrEqual(after.getTime());
    });
  });
});

describe("Phase 6: Single-ACTIVE Guard", () => {
  const policy_id = "test_policy_single_active";

  afterEach(async () => {
    await cleanupTestData(policy_id);
  });

  it("cannot activate if another version is already ACTIVE", async () => {
    // Create v1 as ACTIVE
    await createTestPolicy(policy_id, 1, PolicyLifecycleState.ACTIVE);

    // Try to activate v2
    await createTestPolicy(policy_id, 2, PolicyLifecycleState.APPROVED);
    await expect(governanceService.activate(policy_id, 2, adminContext)).rejects.toThrow(
      "Cannot activate version 2: another version (1) is already ACTIVE",
    );
  });

  it("can activate if no other version is ACTIVE", async () => {
    await createTestPolicy(policy_id, 3, PolicyLifecycleState.APPROVED);
    const result = await governanceService.activate(policy_id, 3, adminContext);
    expect(result.current_state).toBe(PolicyLifecycleState.ACTIVE);
  });

  it("cannot activate if already ACTIVE (invalid self-transition)", async () => {
    await createTestPolicy(policy_id, 4, PolicyLifecycleState.ACTIVE);
    // Trying to activate an already ACTIVE version is invalid (no self-transitions)
    await expect(governanceService.activate(policy_id, 4, adminContext)).rejects.toThrow(
      InvalidStateTransitionError,
    );
  });
});
