import { describe, it, expect, afterEach } from "vitest";
import { prisma } from "../../src/lib/prisma";
import { PolicyLifecycleState, GovernanceRole } from "../../src/lib/phase6";
import { POST as submitForReview } from "../../src/app/api/platform/v1/governance/submit/route";
import { POST as approve } from "../../src/app/api/platform/v1/governance/approve/route";
import { POST as reject } from "../../src/app/api/platform/v1/governance/reject/route";
import { POST as activate } from "../../src/app/api/platform/v1/governance/activate/route";
import { POST as retire } from "../../src/app/api/platform/v1/governance/retire/route";
import { POST as supersede } from "../../src/app/api/platform/v1/governance/supersede/route";
import { GET as getState } from "../../src/app/api/platform/v1/governance/state/route";
import { GET as getHistory } from "../../src/app/api/platform/v1/governance/history/route";

class MockNextRequest {
  url: string;
  private body: any;

  constructor(url: string, body?: any) {
    this.url = url;
    this.body = body;
  }

  async json() {
    return this.body;
  }
}

async function cleanupTestPolicy(policy_id: string) {
  try {
    await prisma.policyVersionGovernance.deleteMany({ where: { policy_id } });
    await prisma.policyVersion.deleteMany({ where: { policy_id } });
  } catch (error) {
    console.warn(`Cleanup warning:`, error);
  }
}

async function createTestPolicy(
  policy_id: string,
  version: number,
  state: PolicyLifecycleState = PolicyLifecycleState.DRAFT,
) {
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
      current_state: state,
      created_at: new Date(),
      state_changed_at: new Date(),
      transition_count: 0,
      created_by: "test",
    },
  });
}

describe("Phase 6: Governance Endpoints", () => {
  const basePolicy = "endpoint_test_";
  let testCount = 0;

  afterEach(async () => {
    await cleanupTestPolicy(basePolicy + testCount);
  });

  describe("POST /api/platform/v1/governance/submit", () => {
    it("returns 200 for valid DRAFT → PENDING_REVIEW with POLICY_CREATOR role", async () => {
      const policy_id = basePolicy + ++testCount;
      await createTestPolicy(policy_id, 1, PolicyLifecycleState.DRAFT);

      const request = new MockNextRequest("http://localhost/api/platform/v1/governance/submit", {
        policy_id,
        version: 1,
        actor_id: "actor_001",
        role: GovernanceRole.POLICY_CREATOR,
      });

      const response = await submitForReview(request as any);
      expect(response.status).toBe(200);

      const data = await response.json();
      expect(data.status).toBe("success");
      expect(data.data.current_state).toBe(PolicyLifecycleState.PENDING_REVIEW);
    });

    it("returns 400 for invalid state transition (ACTIVE → PENDING_REVIEW)", async () => {
      const policy_id = basePolicy + ++testCount;
      await createTestPolicy(policy_id, 1, PolicyLifecycleState.ACTIVE);

      const request = new MockNextRequest("http://localhost/api/platform/v1/governance/submit", {
        policy_id,
        version: 1,
        actor_id: "actor_001",
        role: GovernanceRole.POLICY_CREATOR,
      });

      const response = await submitForReview(request as any);
      expect(response.status).toBe(400);

      const data = await response.json();
      expect(data.error).toBe("InvalidStateTransitionError");
    });

    it("returns 401 for unauthorized role (POLICY_REVIEWER cannot submit)", async () => {
      const policy_id = basePolicy + ++testCount;
      await createTestPolicy(policy_id, 1, PolicyLifecycleState.DRAFT);

      const request = new MockNextRequest("http://localhost/api/platform/v1/governance/submit", {
        policy_id,
        version: 1,
        actor_id: "actor_001",
        role: GovernanceRole.POLICY_REVIEWER,
      });

      const response = await submitForReview(request as any);
      expect(response.status).toBe(401);

      const data = await response.json();
      expect(data.error).toBe("UnauthorizedGovernanceActionError");
    });

    it("returns 400 for missing required fields", async () => {
      const request = new MockNextRequest("http://localhost/api/platform/v1/governance/submit", {
        policy_id: "test_policy",
      });

      const response = await submitForReview(request as any);
      expect(response.status).toBe(400);

      const data = await response.json();
      expect(data.error).toBe("ValidationError");
    });
  });

  describe("POST /api/platform/v1/governance/approve", () => {
    it("returns 200 for valid PENDING_REVIEW → APPROVED with POLICY_REVIEWER role", async () => {
      const policy_id = basePolicy + ++testCount;
      await createTestPolicy(policy_id, 1, PolicyLifecycleState.PENDING_REVIEW);

      const request = new MockNextRequest("http://localhost/api/platform/v1/governance/approve", {
        policy_id,
        version: 1,
        actor_id: "actor_001",
        role: GovernanceRole.POLICY_REVIEWER,
      });

      const response = await approve(request as any);
      expect(response.status).toBe(200);

      const data = await response.json();
      expect(data.status).toBe("success");
      expect(data.data.current_state).toBe(PolicyLifecycleState.APPROVED);
    });

    it("returns 401 for unauthorized role (POLICY_CREATOR cannot approve)", async () => {
      const policy_id = basePolicy + ++testCount;
      await createTestPolicy(policy_id, 1, PolicyLifecycleState.PENDING_REVIEW);

      const request = new MockNextRequest("http://localhost/api/platform/v1/governance/approve", {
        policy_id,
        version: 1,
        actor_id: "actor_001",
        role: GovernanceRole.POLICY_CREATOR,
      });

      const response = await approve(request as any);
      expect(response.status).toBe(401);
    });
  });

  describe("POST /api/platform/v1/governance/reject", () => {
    it("returns 200 for valid PENDING_REVIEW → REJECTED with POLICY_REVIEWER role", async () => {
      const policy_id = basePolicy + ++testCount;
      await createTestPolicy(policy_id, 1, PolicyLifecycleState.PENDING_REVIEW);

      const request = new MockNextRequest("http://localhost/api/platform/v1/governance/reject", {
        policy_id,
        version: 1,
        actor_id: "actor_001",
        role: GovernanceRole.POLICY_REVIEWER,
      });

      const response = await reject(request as any);
      expect(response.status).toBe(200);

      const data = await response.json();
      expect(data.data.current_state).toBe(PolicyLifecycleState.REJECTED);
    });

    it("returns 200 for valid APPROVED → REJECTED with POLICY_REVIEWER role", async () => {
      const policy_id = basePolicy + ++testCount;
      await createTestPolicy(policy_id, 1, PolicyLifecycleState.APPROVED);

      const request = new MockNextRequest("http://localhost/api/platform/v1/governance/reject", {
        policy_id,
        version: 1,
        actor_id: "actor_001",
        role: GovernanceRole.POLICY_REVIEWER,
      });

      const response = await reject(request as any);
      expect(response.status).toBe(200);

      const data = await response.json();
      expect(data.data.current_state).toBe(PolicyLifecycleState.REJECTED);
    });
  });

  describe("POST /api/platform/v1/governance/activate", () => {
    it("returns 200 for valid APPROVED → ACTIVE with POLICY_ADMIN role", async () => {
      const policy_id = basePolicy + ++testCount;
      await createTestPolicy(policy_id, 1, PolicyLifecycleState.APPROVED);

      const request = new MockNextRequest("http://localhost/api/platform/v1/governance/activate", {
        policy_id,
        version: 1,
        actor_id: "actor_001",
        role: GovernanceRole.POLICY_ADMIN,
      });

      const response = await activate(request as any);
      expect(response.status).toBe(200);

      const data = await response.json();
      expect(data.data.current_state).toBe(PolicyLifecycleState.ACTIVE);
    });

    it("returns 409 when another version already ACTIVE (single-ACTIVE guard)", async () => {
      const policy_id = basePolicy + ++testCount;
      await createTestPolicy(policy_id, 1, PolicyLifecycleState.ACTIVE);
      await createTestPolicy(policy_id, 2, PolicyLifecycleState.APPROVED);

      const request = new MockNextRequest("http://localhost/api/platform/v1/governance/activate", {
        policy_id,
        version: 2,
        actor_id: "actor_001",
        role: GovernanceRole.POLICY_ADMIN,
      });

      const response = await activate(request as any);
      expect(response.status).toBe(409);
    });

    it("returns 401 for unauthorized role (POLICY_REVIEWER cannot activate)", async () => {
      const policy_id = basePolicy + ++testCount;
      await createTestPolicy(policy_id, 1, PolicyLifecycleState.APPROVED);

      const request = new MockNextRequest("http://localhost/api/platform/v1/governance/activate", {
        policy_id,
        version: 1,
        actor_id: "actor_001",
        role: GovernanceRole.POLICY_REVIEWER,
      });

      const response = await activate(request as any);
      expect(response.status).toBe(401);
    });
  });

  describe("POST /api/platform/v1/governance/retire", () => {
    it("returns 200 for valid ACTIVE → RETIRED with POLICY_ADMIN role", async () => {
      const policy_id = basePolicy + ++testCount;
      await createTestPolicy(policy_id, 1, PolicyLifecycleState.ACTIVE);

      const request = new MockNextRequest("http://localhost/api/platform/v1/governance/retire", {
        policy_id,
        version: 1,
        actor_id: "actor_001",
        role: GovernanceRole.POLICY_ADMIN,
      });

      const response = await retire(request as any);
      expect(response.status).toBe(200);

      const data = await response.json();
      expect(data.data.current_state).toBe(PolicyLifecycleState.RETIRED);
    });

    it("returns 400 for invalid state transition (APPROVED → RETIRED)", async () => {
      const policy_id = basePolicy + ++testCount;
      await createTestPolicy(policy_id, 1, PolicyLifecycleState.APPROVED);

      const request = new MockNextRequest("http://localhost/api/platform/v1/governance/retire", {
        policy_id,
        version: 1,
        actor_id: "actor_001",
        role: GovernanceRole.POLICY_ADMIN,
      });

      const response = await retire(request as any);
      expect(response.status).toBe(400);
    });
  });

  describe("POST /api/platform/v1/governance/supersede", () => {
    it("returns 200 for valid ACTIVE → SUPERSEDED with POLICY_ADMIN role", async () => {
      const policy_id = basePolicy + ++testCount;
      await createTestPolicy(policy_id, 1, PolicyLifecycleState.ACTIVE);
      await createTestPolicy(policy_id, 2, PolicyLifecycleState.DRAFT);

      const request = new MockNextRequest("http://localhost/api/platform/v1/governance/supersede", {
        policy_id,
        version: 1,
        superseded_by_version: 2,
        actor_id: "actor_001",
        role: GovernanceRole.POLICY_ADMIN,
      });

      const response = await supersede(request as any);
      expect(response.status).toBe(200);

      const data = await response.json();
      expect(data.data.current_state).toBe(PolicyLifecycleState.SUPERSEDED);
    });

    it("returns 200 for valid APPROVED → SUPERSEDED with POLICY_ADMIN role", async () => {
      const policy_id = basePolicy + ++testCount;
      await createTestPolicy(policy_id, 1, PolicyLifecycleState.APPROVED);
      await createTestPolicy(policy_id, 2, PolicyLifecycleState.DRAFT);

      const request = new MockNextRequest("http://localhost/api/platform/v1/governance/supersede", {
        policy_id,
        version: 1,
        superseded_by_version: 2,
        actor_id: "actor_001",
        role: GovernanceRole.POLICY_ADMIN,
      });

      const response = await supersede(request as any);
      expect(response.status).toBe(200);

      const data = await response.json();
      expect(data.data.current_state).toBe(PolicyLifecycleState.SUPERSEDED);
    });

    it("returns 401 for unauthorized role (POLICY_REVIEWER cannot supersede)", async () => {
      const policy_id = basePolicy + ++testCount;
      await createTestPolicy(policy_id, 1, PolicyLifecycleState.ACTIVE);
      await createTestPolicy(policy_id, 2, PolicyLifecycleState.DRAFT);

      const request = new MockNextRequest("http://localhost/api/platform/v1/governance/supersede", {
        policy_id,
        version: 1,
        superseded_by_version: 2,
        actor_id: "actor_001",
        role: GovernanceRole.POLICY_REVIEWER,
      });

      const response = await supersede(request as any);
      expect(response.status).toBe(401);
    });
  });

  describe("GET /api/platform/v1/governance/state", () => {
    it("returns 200 with governance record for valid query params", async () => {
      const policy_id = basePolicy + ++testCount;
      await createTestPolicy(policy_id, 1, PolicyLifecycleState.APPROVED);

      const request = new MockNextRequest(
        `http://localhost/api/platform/v1/governance/state?policy_id=${policy_id}&version=1`,
      );

      const response = await getState(request as any);
      expect(response.status).toBe(200);

      const data = await response.json();
      expect(data.status).toBe("success");
      expect(data.data.current_state).toBe(PolicyLifecycleState.APPROVED);
      expect(data.data.version).toBe(1);
    });

    it("returns 404 if policy version does not exist", async () => {
      const request = new MockNextRequest(
        `http://localhost/api/platform/v1/governance/state?policy_id=nonexistent&version=999`,
      );

      const response = await getState(request as any);
      expect(response.status).toBe(404);

      const data = await response.json();
      expect(data.error).toBe("NotFound");
    });

    it("returns 400 if missing query params", async () => {
      const request = new MockNextRequest(
        `http://localhost/api/platform/v1/governance/state?policy_id=test`,
      );

      const response = await getState(request as any);
      expect(response.status).toBe(400);

      const data = await response.json();
      expect(data.error).toBe("ValidationError");
    });

    it("returns 400 if version is not an integer", async () => {
      const request = new MockNextRequest(
        `http://localhost/api/platform/v1/governance/state?policy_id=test&version=abc`,
      );

      const response = await getState(request as any);
      expect(response.status).toBe(400);
    });
  });

  describe("GET /api/platform/v1/governance/history", () => {
    it("returns 200 with array of governance records", async () => {
      const policy_id = basePolicy + ++testCount;
      await createTestPolicy(policy_id, 1, PolicyLifecycleState.DRAFT);
      await createTestPolicy(policy_id, 2, PolicyLifecycleState.APPROVED);
      await createTestPolicy(policy_id, 3, PolicyLifecycleState.ACTIVE);

      const request = new MockNextRequest(
        `http://localhost/api/platform/v1/governance/history?policy_id=${policy_id}`,
      );

      const response = await getHistory(request as any);
      expect(response.status).toBe(200);

      const data = await response.json();
      expect(data.status).toBe("success");
      expect(Array.isArray(data.data)).toBe(true);
      expect(data.data.length).toBe(3);
      expect(data.data[0].version).toBe(1);
      expect(data.data[2].version).toBe(3);
    });

    it("returns 200 with empty array if policy never created", async () => {
      const request = new MockNextRequest(
        `http://localhost/api/platform/v1/governance/history?policy_id=never_created`,
      );

      const response = await getHistory(request as any);
      expect(response.status).toBe(200);

      const data = await response.json();
      expect(data.status).toBe("success");
      expect(Array.isArray(data.data)).toBe(true);
      expect(data.data.length).toBe(0);
    });
  });
});
