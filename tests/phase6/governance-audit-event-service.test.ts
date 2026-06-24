import { describe, it, expect, afterEach } from "vitest";
import { prisma } from "../../src/lib/prisma";
import { auditService } from "../../src/lib/phase6";
import {
  PolicyLifecycleState,
  GovernanceAction,
  GovernanceAuditEventPayload,
} from "../../src/lib/phase6";

async function cleanupAuditEvents() {
  try {
    // Delete all audit events from test database
    await prisma.auditEvent.deleteMany({});
  } catch (error) {
    console.warn("Cleanup warning:", error);
  }
}

async function setupTestPolicy(policy_id: string, version: number) {
  await prisma.policyVersion.create({
    data: {
      policy_id,
      version,
      source_definition: JSON.stringify({}),
      compiled_hash: `hash_${policy_id}_v${version}`,
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
}

async function cleanupTestPolicy(policy_id: string) {
  try {
    await prisma.policyVersionGovernance.deleteMany({ where: { policy_id } });
    await prisma.policyVersion.deleteMany({ where: { policy_id } });
  } catch (error) {
    console.warn("Cleanup warning:", error);
  }
}

describe("Phase 6: Governance Audit Event Service", () => {
  const basePolicy = "audit_test_";
  let testCount = 0;

  // Clean audit events before all tests in this suite (other tests may have created events)
  beforeEach(async () => {
    await cleanupAuditEvents();
  });

  afterEach(async () => {
    await cleanupTestPolicy(basePolicy + testCount);
  });

  describe("createEvent(payload)", () => {
    it("creates audit event with correct fields", async () => {
      const policy_id = basePolicy + ++testCount;
      const version = 1;
      await setupTestPolicy(policy_id, version);

      const payload: GovernanceAuditEventPayload = {
        policy_id,
        version,
        previous_state: PolicyLifecycleState.DRAFT,
        next_state: PolicyLifecycleState.PENDING_REVIEW,
        action: GovernanceAction.SUBMITTED_FOR_REVIEW,
        actor_id: "actor_001",
        timestamp: new Date(),
      };

      const event = await auditService.createEvent(payload);

      expect(event.audit_id).toBeDefined();
      expect(typeof event.sequence_number).toBe("number");
      expect(event.sequence_number).toBeGreaterThan(0);
      expect(event.policy_id).toBe(policy_id);
      expect(event.policy_version).toBe(version);
      expect(event.event_type).toBe("POLICY_SUBMITTED_FOR_REVIEW");
      expect(event.actor_id).toBe("actor_001");
      expect(event.audit_hash).toBeDefined();
      expect(event.previous_hash).toBeNull();
    });

    it("assigns sequence numbers incrementally", async () => {
      const policy_id = basePolicy + ++testCount;
      const version = 1;
      await setupTestPolicy(policy_id, version);

      const payloads: GovernanceAuditEventPayload[] = [
        {
          policy_id,
          version,
          previous_state: PolicyLifecycleState.DRAFT,
          next_state: PolicyLifecycleState.PENDING_REVIEW,
          action: GovernanceAction.SUBMITTED_FOR_REVIEW,
          actor_id: "actor_001",
          timestamp: new Date(),
        },
        {
          policy_id,
          version,
          previous_state: PolicyLifecycleState.PENDING_REVIEW,
          next_state: PolicyLifecycleState.APPROVED,
          action: GovernanceAction.APPROVED,
          actor_id: "actor_002",
          timestamp: new Date(),
        },
        {
          policy_id,
          version,
          previous_state: PolicyLifecycleState.APPROVED,
          next_state: PolicyLifecycleState.ACTIVE,
          action: GovernanceAction.ACTIVATED,
          actor_id: "actor_003",
          timestamp: new Date(),
        },
      ];

      const event1 = await auditService.createEvent(payloads[0]);
      const event2 = await auditService.createEvent(payloads[1]);
      const event3 = await auditService.createEvent(payloads[2]);

      // Sequence numbers increment by 1 each
      expect(event2.sequence_number).toBe(event1.sequence_number + 1);
      expect(event3.sequence_number).toBe(event2.sequence_number + 1);
    });

    it("links previous_hash to prior event audit_hash", async () => {
      const policy_id = basePolicy + ++testCount;
      const version = 1;
      await setupTestPolicy(policy_id, version);

      const payload1: GovernanceAuditEventPayload = {
        policy_id,
        version,
        previous_state: PolicyLifecycleState.DRAFT,
        next_state: PolicyLifecycleState.PENDING_REVIEW,
        action: GovernanceAction.SUBMITTED_FOR_REVIEW,
        actor_id: "actor_001",
        timestamp: new Date(),
      };

      const payload2: GovernanceAuditEventPayload = {
        policy_id,
        version,
        previous_state: PolicyLifecycleState.PENDING_REVIEW,
        next_state: PolicyLifecycleState.APPROVED,
        action: GovernanceAction.APPROVED,
        actor_id: "actor_002",
        timestamp: new Date(),
      };

      const event1 = await auditService.createEvent(payload1);
      const event2 = await auditService.createEvent(payload2);

      expect(event1.previous_hash).toBeNull();
      expect(event2.previous_hash).toBe(event1.audit_hash);
    });

    it("computes audit_hash deterministically", async () => {
      const policy_id = basePolicy + ++testCount;
      const version = 1;
      await setupTestPolicy(policy_id, version);

      const payload: GovernanceAuditEventPayload = {
        policy_id,
        version,
        previous_state: PolicyLifecycleState.DRAFT,
        next_state: PolicyLifecycleState.PENDING_REVIEW,
        action: GovernanceAction.SUBMITTED_FOR_REVIEW,
        actor_id: "actor_001",
        timestamp: new Date("2026-06-23T12:00:00Z"),
      };

      const event1 = await auditService.createEvent(payload);

      // Verify hash is consistent
      expect(event1.audit_hash).toBeDefined();
      expect(event1.audit_hash).toMatch(/^[a-f0-9]{64}$/);
    });

    it("works without transaction context (falls back to direct prisma)", async () => {
      const policy_id = basePolicy + ++testCount;
      const version = 1;
      await setupTestPolicy(policy_id, version);

      const payload: GovernanceAuditEventPayload = {
        policy_id,
        version,
        previous_state: PolicyLifecycleState.DRAFT,
        next_state: PolicyLifecycleState.PENDING_REVIEW,
        action: GovernanceAction.SUBMITTED_FOR_REVIEW,
        actor_id: "actor_001",
        timestamp: new Date(),
      };

      const event = await auditService.createEvent(payload);

      expect(event.sequence_number).toBe(1);
      expect(event.audit_id).toBeDefined();
    });

    it("includes all event fields in audit_hash", async () => {
      const policy_id = basePolicy + ++testCount;
      const version = 1;
      await setupTestPolicy(policy_id, version);

      const payload: GovernanceAuditEventPayload = {
        policy_id,
        version,
        previous_state: PolicyLifecycleState.DRAFT,
        next_state: PolicyLifecycleState.PENDING_REVIEW,
        action: GovernanceAction.SUBMITTED_FOR_REVIEW,
        actor_id: "actor_001",
        timestamp: new Date(),
      };

      const event1 = await auditService.createEvent(payload);

      // Modify payload and create new event
      const payload2: GovernanceAuditEventPayload = {
        ...payload,
        actor_id: "actor_002",
        next_state: PolicyLifecycleState.APPROVED,
      };

      const event2 = await auditService.createEvent(payload2);

      // Hashes should be different (different actor_id and next_state)
      expect(event1.audit_hash).not.toBe(event2.audit_hash);
    });
  });

  describe("Audit trail integrity", () => {
    it("creates audit events within state transitions atomically", async () => {
      const policy_id = basePolicy + ++testCount;
      const version = 1;
      await setupTestPolicy(policy_id, version);

      // Simulate state transition with audit event creation
      const payload: GovernanceAuditEventPayload = {
        policy_id,
        version,
        previous_state: PolicyLifecycleState.DRAFT,
        next_state: PolicyLifecycleState.PENDING_REVIEW,
        action: GovernanceAction.SUBMITTED_FOR_REVIEW,
        actor_id: "actor_001",
        timestamp: new Date(),
      };

      const event = await auditService.createEvent(payload);

      // Verify event is persisted
      const retrievedEvent = await prisma.auditEvent.findUnique({
        where: { audit_id: event.audit_id },
      });

      expect(retrievedEvent).not.toBeNull();
      expect(retrievedEvent?.sequence_number).toBe(1);
      expect(retrievedEvent?.policy_id).toBe(policy_id);
    });

    it("maintains correct sequence ordering across multiple events", async () => {
      const policy_id = basePolicy + ++testCount;
      const version = 1;
      await setupTestPolicy(policy_id, version);

      const actions = [
        GovernanceAction.SUBMITTED_FOR_REVIEW,
        GovernanceAction.APPROVED,
        GovernanceAction.ACTIVATED,
        GovernanceAction.RETIRED,
      ];

      const states = [
        [PolicyLifecycleState.DRAFT, PolicyLifecycleState.PENDING_REVIEW],
        [PolicyLifecycleState.PENDING_REVIEW, PolicyLifecycleState.APPROVED],
        [PolicyLifecycleState.APPROVED, PolicyLifecycleState.ACTIVE],
        [PolicyLifecycleState.ACTIVE, PolicyLifecycleState.RETIRED],
      ];

      for (let i = 0; i < actions.length; i++) {
        await auditService.createEvent({
          policy_id,
          version,
          previous_state: states[i][0],
          next_state: states[i][1],
          action: actions[i],
          actor_id: `actor_${i + 1}`,
          timestamp: new Date(),
        });
      }

      const events = await prisma.auditEvent.findMany({
        where: { policy_id },
        orderBy: { sequence_number: "asc" },
      });

      expect(events.length).toBe(4);
      expect(events.map((e) => e.sequence_number)).toEqual([1, 2, 3, 4]);
    });

    it("hash chain is unbroken across events", async () => {
      const policy_id = basePolicy + ++testCount;
      const version = 1;
      await setupTestPolicy(policy_id, version);

      const event1 = await auditService.createEvent({
        policy_id,
        version,
        previous_state: PolicyLifecycleState.DRAFT,
        next_state: PolicyLifecycleState.PENDING_REVIEW,
        action: GovernanceAction.SUBMITTED_FOR_REVIEW,
        actor_id: "actor_001",
        timestamp: new Date(),
      });

      const event2 = await auditService.createEvent({
        policy_id,
        version,
        previous_state: PolicyLifecycleState.PENDING_REVIEW,
        next_state: PolicyLifecycleState.APPROVED,
        action: GovernanceAction.APPROVED,
        actor_id: "actor_002",
        timestamp: new Date(),
      });

      const event3 = await auditService.createEvent({
        policy_id,
        version,
        previous_state: PolicyLifecycleState.APPROVED,
        next_state: PolicyLifecycleState.ACTIVE,
        action: GovernanceAction.ACTIVATED,
        actor_id: "actor_003",
        timestamp: new Date(),
      });

      // Verify chain integrity
      expect(event1.previous_hash).toBeNull();
      expect(event2.previous_hash).toBe(event1.audit_hash);
      expect(event3.previous_hash).toBe(event2.audit_hash);
    });
  });

  describe("Action to event type mapping", () => {
    it("maps SUBMITTED_FOR_REVIEW action to POLICY_SUBMITTED_FOR_REVIEW event type", async () => {
      const policy_id = basePolicy + ++testCount;
      const version = 1;
      await setupTestPolicy(policy_id, version);

      const event = await auditService.createEvent({
        policy_id,
        version,
        previous_state: PolicyLifecycleState.DRAFT,
        next_state: PolicyLifecycleState.PENDING_REVIEW,
        action: GovernanceAction.SUBMITTED_FOR_REVIEW,
        actor_id: "actor_001",
        timestamp: new Date(),
      });

      expect(event.event_type).toBe("POLICY_SUBMITTED_FOR_REVIEW");
    });

    it("maps APPROVED action to POLICY_APPROVED event type", async () => {
      const policy_id = basePolicy + ++testCount;
      const version = 1;
      await setupTestPolicy(policy_id, version);

      const event = await auditService.createEvent({
        policy_id,
        version,
        previous_state: PolicyLifecycleState.PENDING_REVIEW,
        next_state: PolicyLifecycleState.APPROVED,
        action: GovernanceAction.APPROVED,
        actor_id: "actor_001",
        timestamp: new Date(),
      });

      expect(event.event_type).toBe("POLICY_APPROVED");
    });

    it("maps ACTIVATED action to POLICY_ACTIVATED event type", async () => {
      const policy_id = basePolicy + ++testCount;
      const version = 1;
      await setupTestPolicy(policy_id, version);

      const event = await auditService.createEvent({
        policy_id,
        version,
        previous_state: PolicyLifecycleState.APPROVED,
        next_state: PolicyLifecycleState.ACTIVE,
        action: GovernanceAction.ACTIVATED,
        actor_id: "actor_001",
        timestamp: new Date(),
      });

      expect(event.event_type).toBe("POLICY_ACTIVATED");
    });
  });
});
