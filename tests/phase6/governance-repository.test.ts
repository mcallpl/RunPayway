import { describe, it, expect, afterEach } from "vitest";
import { prisma } from "../../src/lib/prisma";
import { governanceRepository } from "../../src/lib/phase6";
import {
  PolicyLifecycleState,
  GovernanceRecordNotFoundError,
  MultipleActivePoliciesError,
  GovernanceAction,
} from "../../src/lib/phase6";

async function cleanupTestPolicy(policy_id: string) {
  try {
    await prisma.policyVersionGovernance.deleteMany({ where: { policy_id } });
    await prisma.policyVersion.deleteMany({ where: { policy_id } });
  } catch (error) {
    console.warn(`Cleanup warning for ${policy_id}:`, error);
  }
}

describe("Phase 6: Governance Repository Layer", () => {
  const basePolicy = "repo_test_policy_";
  let testCount = 0;

  afterEach(async () => {
    await cleanupTestPolicy(basePolicy + testCount);
  });

  describe("findByCompositeKey(policy_id, version)", () => {
    it("returns governance record when composite key exists", async () => {
      const policy_id = basePolicy + ++testCount;
      const version = 1;

      await prisma.policyVersion.create({
        data: {
          policy_id,
          version,
          source_definition: JSON.stringify({}),
          compiled_hash: "hash",
          created_by: "test",
        },
      });

      await prisma.policyVersionGovernance.create({
        data: {
          policy_id,
          version,
          current_state: PolicyLifecycleState.DRAFT,
          created_at: new Date(),
          state_changed_at: new Date(),
          transition_count: 0,
          created_by: "test",
        },
      });

      const result = await governanceRepository.findByCompositeKey(policy_id, version);
      expect(result).not.toBeNull();
      expect(result?.policy_id).toBe(policy_id);
      expect(result?.version).toBe(version);
      expect(result?.current_state).toBe(PolicyLifecycleState.DRAFT);
    });

    it("returns null when composite key does not exist", async () => {
      const result = await governanceRepository.findByCompositeKey("nonexistent", 999);
      expect(result).toBeNull();
    });
  });

  describe("findActiveVersion(policy_id)", () => {
    it("returns ACTIVE version when exactly one exists", async () => {
      const policy_id = basePolicy + ++testCount;

      await prisma.policyVersion.create({
        data: {
          policy_id,
          version: 1,
          source_definition: JSON.stringify({}),
          compiled_hash: "hash1",
          created_by: "test",
        },
      });

      await prisma.policyVersionGovernance.create({
        data: {
          policy_id,
          version: 1,
          current_state: PolicyLifecycleState.ACTIVE,
          created_at: new Date(),
          state_changed_at: new Date(),
          transition_count: 0,
          created_by: "test",
        },
      });

      const result = await governanceRepository.findActiveVersion(policy_id);
      expect(result?.version).toBe(1);
      expect(result?.current_state).toBe(PolicyLifecycleState.ACTIVE);
    });

    it("returns null when zero ACTIVE versions exist (service layer handles error)", async () => {
      const policy_id = basePolicy + ++testCount;

      await prisma.policyVersion.create({
        data: {
          policy_id,
          version: 1,
          source_definition: JSON.stringify({}),
          compiled_hash: "hash1",
          created_by: "test",
        },
      });

      await prisma.policyVersionGovernance.create({
        data: {
          policy_id,
          version: 1,
          current_state: PolicyLifecycleState.DRAFT,
          created_at: new Date(),
          state_changed_at: new Date(),
          transition_count: 0,
          created_by: "test",
        },
      });

      const result = await governanceRepository.findActiveVersion(policy_id);
      expect(result).toBeNull();
    });

    it("throws MultipleActivePoliciesError when multiple ACTIVE versions exist (data corruption)", async () => {
      const policy_id = basePolicy + ++testCount;

      await prisma.policyVersion.create({
        data: {
          policy_id,
          version: 1,
          source_definition: JSON.stringify({}),
          compiled_hash: "hash1",
          created_by: "test",
        },
      });

      await prisma.policyVersion.create({
        data: {
          policy_id,
          version: 2,
          source_definition: JSON.stringify({}),
          compiled_hash: "hash2",
          created_by: "test",
        },
      });

      await prisma.policyVersionGovernance.create({
        data: {
          policy_id,
          version: 1,
          current_state: PolicyLifecycleState.ACTIVE,
          created_at: new Date(),
          state_changed_at: new Date(),
          transition_count: 0,
          created_by: "test",
        },
      });

      await prisma.policyVersionGovernance.create({
        data: {
          policy_id,
          version: 2,
          current_state: PolicyLifecycleState.ACTIVE,
          created_at: new Date(),
          state_changed_at: new Date(),
          transition_count: 0,
          created_by: "test",
        },
      });

      await expect(governanceRepository.findActiveVersion(policy_id)).rejects.toThrow(
        MultipleActivePoliciesError,
      );
    });
  });

  describe("findAllVersions(policy_id)", () => {
    it("returns empty array if policy never created", async () => {
      const result = await governanceRepository.findAllVersions("never_created");
      expect(result).toEqual([]);
    });

    it("returns all versions sorted by version number ascending", async () => {
      const policy_id = basePolicy + ++testCount;

      for (const v of [3, 1, 2]) {
        await prisma.policyVersion.create({
          data: {
            policy_id,
            version: v,
            source_definition: JSON.stringify({}),
            compiled_hash: `hash${v}`,
            created_by: "test",
          },
        });

        await prisma.policyVersionGovernance.create({
          data: {
            policy_id,
            version: v,
            current_state: PolicyLifecycleState.DRAFT,
            created_at: new Date(),
            state_changed_at: new Date(),
            transition_count: 0,
            created_by: "test",
          },
        });
      }

      const result = await governanceRepository.findAllVersions(policy_id);
      expect(result.length).toBe(3);
      expect(result.map((r) => r.version)).toEqual([1, 2, 3]);
    });

    it("filters by state when provided", async () => {
      const policy_id = basePolicy + ++testCount;

      await prisma.policyVersion.create({
        data: {
          policy_id,
          version: 1,
          source_definition: JSON.stringify({}),
          compiled_hash: "hash1",
          created_by: "test",
        },
      });

      await prisma.policyVersion.create({
        data: {
          policy_id,
          version: 2,
          source_definition: JSON.stringify({}),
          compiled_hash: "hash2",
          created_by: "test",
        },
      });

      await prisma.policyVersionGovernance.create({
        data: {
          policy_id,
          version: 1,
          current_state: PolicyLifecycleState.ACTIVE,
          created_at: new Date(),
          state_changed_at: new Date(),
          transition_count: 0,
          created_by: "test",
        },
      });

      await prisma.policyVersionGovernance.create({
        data: {
          policy_id,
          version: 2,
          current_state: PolicyLifecycleState.DRAFT,
          created_at: new Date(),
          state_changed_at: new Date(),
          transition_count: 0,
          created_by: "test",
        },
      });

      const activeOnly = await governanceRepository.findAllVersions(
        policy_id,
        PolicyLifecycleState.ACTIVE,
      );
      expect(activeOnly.length).toBe(1);
      expect(activeOnly[0].version).toBe(1);
    });
  });

  describe("findByState(state) - global query", () => {
    it("returns records matching the state globally (not per-policy)", async () => {
      const policy_id = basePolicy + ++testCount;

      await prisma.policyVersion.create({
        data: {
          policy_id,
          version: 1,
          source_definition: JSON.stringify({}),
          compiled_hash: "hash1",
          created_by: "test",
        },
      });

      await prisma.policyVersionGovernance.create({
        data: {
          policy_id,
          version: 1,
          current_state: PolicyLifecycleState.APPROVED,
          created_at: new Date(),
          state_changed_at: new Date(),
          transition_count: 0,
          created_by: "test",
        },
      });

      const approvedRecords = await governanceRepository.findByState(PolicyLifecycleState.APPROVED);
      expect(approvedRecords.length).toBeGreaterThanOrEqual(1);
      expect(approvedRecords.some((r) => r.policy_id === policy_id && r.version === 1)).toBe(true);
    });
  });

  describe("create(policy_id, version, created_by) - always DRAFT", () => {
    it("inserts new governance record with DRAFT state (state not configurable)", async () => {
      const policy_id = basePolicy + ++testCount;
      const version = 1;

      await prisma.policyVersion.create({
        data: {
          policy_id,
          version,
          source_definition: JSON.stringify({}),
          compiled_hash: "hash",
          created_by: "test",
        },
      });

      const result = await governanceRepository.create(policy_id, version, "test_creator");

      expect(result.policy_id).toBe(policy_id);
      expect(result.version).toBe(version);
      expect(result.current_state).toBe(PolicyLifecycleState.DRAFT);
      expect(result.transition_count).toBe(0);
      expect(result.previous_state).toBeNull();
    });

    it("throws P2002 unique constraint error if duplicate (policy_id, version) exists", async () => {
      const policy_id = basePolicy + ++testCount;
      const version = 1;

      await prisma.policyVersion.create({
        data: {
          policy_id,
          version,
          source_definition: JSON.stringify({}),
          compiled_hash: "hash",
          created_by: "test",
        },
      });

      await governanceRepository.create(policy_id, version, "test");

      await expect(governanceRepository.create(policy_id, version, "test2")).rejects.toThrow();
    });
  });

  describe("updateState(policy_id, version, newState, action, actor_id, tx)", () => {
    it("updates state correctly and increments transition_count", async () => {
      const policy_id = basePolicy + ++testCount;
      const version = 1;

      await prisma.policyVersion.create({
        data: {
          policy_id,
          version,
          source_definition: JSON.stringify({}),
          compiled_hash: "hash",
          created_by: "test",
        },
      });

      await prisma.policyVersionGovernance.create({
        data: {
          policy_id,
          version,
          current_state: PolicyLifecycleState.DRAFT,
          previous_state: null,
          created_at: new Date(),
          state_changed_at: new Date(),
          transition_count: 0,
          created_by: "test",
        },
      });

      const result = await governanceRepository.updateState(
        policy_id,
        version,
        PolicyLifecycleState.PENDING_REVIEW,
        GovernanceAction.SUBMITTED_FOR_REVIEW,
        "actor_001",
      );

      expect(result.current_state).toBe(PolicyLifecycleState.PENDING_REVIEW);
      expect(result.previous_state).toBe(PolicyLifecycleState.DRAFT);
      expect(result.transition_count).toBe(1);
      expect(result.last_actor_id).toBe("actor_001");
    });

    it("works without transaction context (falls back to direct prisma)", async () => {
      const policy_id = basePolicy + ++testCount;
      const version = 1;

      await prisma.policyVersion.create({
        data: {
          policy_id,
          version,
          source_definition: JSON.stringify({}),
          compiled_hash: "hash",
          created_by: "test",
        },
      });

      await prisma.policyVersionGovernance.create({
        data: {
          policy_id,
          version,
          current_state: PolicyLifecycleState.DRAFT,
          created_at: new Date(),
          state_changed_at: new Date(),
          transition_count: 0,
          created_by: "test",
        },
      });

      const result = await governanceRepository.updateState(
        policy_id,
        version,
        PolicyLifecycleState.PENDING_REVIEW,
        GovernanceAction.SUBMITTED_FOR_REVIEW,
        "actor_002",
      );

      expect(result.current_state).toBe(PolicyLifecycleState.PENDING_REVIEW);
      expect(result.transition_count).toBe(1);
    });

    it("throws GovernanceRecordNotFoundError if record does not exist", async () => {
      const policy_id = basePolicy + ++testCount;

      await expect(
        governanceRepository.updateState(
          policy_id,
          999,
          PolicyLifecycleState.PENDING_REVIEW,
          GovernanceAction.SUBMITTED_FOR_REVIEW,
          "actor_003",
        ),
      ).rejects.toThrow(GovernanceRecordNotFoundError);
    });
  });

  describe("isHealthy()", () => {
    it("returns true if database connection is valid", async () => {
      const result = await governanceRepository.isHealthy();
      expect(result).toBe(true);
    });
  });
});
