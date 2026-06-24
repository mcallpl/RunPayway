import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { prisma } from "../../src/lib/prisma";
import { governanceService } from "../../src/lib/phase6";
import {
  PolicyLifecycleState,
  GovernanceRole,
  GovernanceContext,
  UnauthorizedGovernanceActionError,
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
 */
async function cleanupTestData(policy_id: string) {
  await prisma.policyVersionGovernance.deleteMany({
    where: { policy_id },
  });
  await prisma.policyVersion.deleteMany({
    where: { policy_id },
  });
}

// ============================================================================
// Test Suites
// ============================================================================

describe("Phase 6: Role-Based Authorization", () => {
  const policy_id = "test_policy_authz";

  afterEach(async () => {
    await cleanupTestData(policy_id);
  });

  describe("POLICY_CREATOR Role", () => {
    const creatorContext: GovernanceContext = {
      actor_id: "creator_001",
      role: GovernanceRole.POLICY_CREATOR,
      timestamp: new Date(),
    };

    it("can submitForReview (DRAFT → PENDING_REVIEW)", async () => {
      await createTestPolicy(policy_id, 1, PolicyLifecycleState.DRAFT);
      const result = await governanceService.submitForReview(policy_id, 1, creatorContext);
      expect(result.current_state).toBe(PolicyLifecycleState.PENDING_REVIEW);
    });

    it("cannot approve (PENDING_REVIEW → APPROVED)", async () => {
      await createTestPolicy(policy_id, 2, PolicyLifecycleState.PENDING_REVIEW);
      await expect(governanceService.approve(policy_id, 2, creatorContext)).rejects.toThrow(
        UnauthorizedGovernanceActionError,
      );
    });

    it("cannot activate (APPROVED → ACTIVE)", async () => {
      await createTestPolicy(policy_id, 3, PolicyLifecycleState.APPROVED);
      await expect(governanceService.activate(policy_id, 3, creatorContext)).rejects.toThrow(
        UnauthorizedGovernanceActionError,
      );
    });

    it("cannot retire", async () => {
      await createTestPolicy(policy_id, 4, PolicyLifecycleState.ACTIVE);
      await expect(governanceService.retire(policy_id, 4, creatorContext)).rejects.toThrow(
        UnauthorizedGovernanceActionError,
      );
    });
  });

  describe("POLICY_REVIEWER Role", () => {
    const reviewerContext: GovernanceContext = {
      actor_id: "reviewer_001",
      role: GovernanceRole.POLICY_REVIEWER,
      timestamp: new Date(),
    };

    it("can approve (PENDING_REVIEW → APPROVED)", async () => {
      await createTestPolicy(policy_id, 5, PolicyLifecycleState.PENDING_REVIEW);
      const result = await governanceService.approve(policy_id, 5, reviewerContext);
      expect(result.current_state).toBe(PolicyLifecycleState.APPROVED);
    });

    it("can reject (PENDING_REVIEW → REJECTED)", async () => {
      await createTestPolicy(policy_id, 6, PolicyLifecycleState.PENDING_REVIEW);
      const result = await governanceService.reject(policy_id, 6, reviewerContext);
      expect(result.current_state).toBe(PolicyLifecycleState.REJECTED);
    });

    it("can reject after approval (APPROVED → REJECTED)", async () => {
      await createTestPolicy(policy_id, 7, PolicyLifecycleState.APPROVED);
      const result = await governanceService.reject(policy_id, 7, reviewerContext);
      expect(result.current_state).toBe(PolicyLifecycleState.REJECTED);
    });

    it("cannot activate", async () => {
      await createTestPolicy(policy_id, 8, PolicyLifecycleState.APPROVED);
      await expect(governanceService.activate(policy_id, 8, reviewerContext)).rejects.toThrow(
        UnauthorizedGovernanceActionError,
      );
    });

    it("cannot retire", async () => {
      await createTestPolicy(policy_id, 9, PolicyLifecycleState.ACTIVE);
      await expect(governanceService.retire(policy_id, 9, reviewerContext)).rejects.toThrow(
        UnauthorizedGovernanceActionError,
      );
    });

    it("cannot supersede", async () => {
      await createTestPolicy(policy_id, 10, PolicyLifecycleState.ACTIVE);
      await createTestPolicy(policy_id, 11, PolicyLifecycleState.DRAFT);
      await expect(
        governanceService.supersede(policy_id, 10, 11, reviewerContext),
      ).rejects.toThrow(UnauthorizedGovernanceActionError);
    });
  });

  describe("POLICY_ADMIN Role", () => {
    const adminContext: GovernanceContext = {
      actor_id: "admin_001",
      role: GovernanceRole.POLICY_ADMIN,
      timestamp: new Date(),
    };

    it("can activate (APPROVED → ACTIVE)", async () => {
      await createTestPolicy(policy_id, 12, PolicyLifecycleState.APPROVED);
      const result = await governanceService.activate(policy_id, 12, adminContext);
      expect(result.current_state).toBe(PolicyLifecycleState.ACTIVE);
    });

    it("can retire (ACTIVE → RETIRED)", async () => {
      await createTestPolicy(policy_id, 13, PolicyLifecycleState.ACTIVE);
      const result = await governanceService.retire(policy_id, 13, adminContext);
      expect(result.current_state).toBe(PolicyLifecycleState.RETIRED);
    });

    it("can supersede (ACTIVE → SUPERSEDED)", async () => {
      await createTestPolicy(policy_id, 14, PolicyLifecycleState.ACTIVE);
      await createTestPolicy(policy_id, 15, PolicyLifecycleState.DRAFT);
      const result = await governanceService.supersede(policy_id, 14, 15, adminContext);
      expect(result.current_state).toBe(PolicyLifecycleState.SUPERSEDED);
    });

    it("can supersede from APPROVED", async () => {
      await createTestPolicy(policy_id, 16, PolicyLifecycleState.APPROVED);
      await createTestPolicy(policy_id, 17, PolicyLifecycleState.DRAFT);
      const result = await governanceService.supersede(policy_id, 16, 17, adminContext);
      expect(result.current_state).toBe(PolicyLifecycleState.SUPERSEDED);
    });

    it("cannot submitForReview", async () => {
      await createTestPolicy(policy_id, 18, PolicyLifecycleState.DRAFT);
      await expect(
        governanceService.submitForReview(policy_id, 18, adminContext),
      ).rejects.toThrow(UnauthorizedGovernanceActionError);
    });

    it("cannot approve", async () => {
      await createTestPolicy(policy_id, 19, PolicyLifecycleState.PENDING_REVIEW);
      await expect(governanceService.approve(policy_id, 19, adminContext)).rejects.toThrow(
        UnauthorizedGovernanceActionError,
      );
    });
  });

  describe("Unauthorized Errors", () => {
    const invalidContext: GovernanceContext = {
      actor_id: "invalid_001",
      role: "INVALID_ROLE" as GovernanceRole, // Force invalid role
      timestamp: new Date(),
    };

    it("throws UnauthorizedGovernanceActionError with action name", async () => {
      await createTestPolicy(policy_id, 20, PolicyLifecycleState.PENDING_REVIEW);
      await expect(governanceService.approve(policy_id, 20, invalidContext)).rejects.toThrow(
        UnauthorizedGovernanceActionError,
      );
    });
  });
});
