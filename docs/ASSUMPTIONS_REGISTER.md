# Assumptions Register

**Owner**: CTO  
**Effective Date**: Sprint 1 start  
**Review Frequency**: Quarterly  
**Last Updated**: June 2, 2026

---

## Core Principle

**Every architectural decision rests on assumptions.**

Document them. Monitor them. When one breaks, reassess the architecture.

---

## Active Assumptions

### A-001: Advisors Are the Primary Institutional Entry Point

**Assumption**: Advisors (financial professionals) will be the primary customer and user of RunPayway.

**Rationale**: 
- Market research shows advisors value income stability assessment
- B2B advisory licensing model targets advisors
- Advisor-First schema reflects this priority

**How We Know**: 
- Customer surveys indicate >80% interest from advisors
- Enterprise interest exists but secondary

**If This Breaks**: 
- Consumer-Direct or Enterprise-Direct models require schema redesign
- Advisor-First schema may not be optimal
- Reprioritize Identity Architecture

**Monitoring**: 
- Track new customer acquisition by type (Advisor vs. Enterprise vs. Consumer)
- Review quarterly (Q3, Q4, 2026)
- Escalate if enterprise customers > 30% of new business

**Review Date**: Q4 2026

---

### A-002: PostgreSQL Will Remain the System of Record

**Assumption**: PostgreSQL will be the authoritative data store for assessments, users, organizations, and audit events.

**Rationale**:
- ACID guarantees match institutional requirements
- Mature ecosystem, strong community
- Row-level security supports multi-tenant architecture
- Cost-effective at current scale

**How We Know**:
- Evaluated competing databases (MongoDB, DynamoDB, etc.)
- PostgreSQL offers best combination of safety + cost + simplicity

**If This Breaks**:
- Performance issues at scale (>1M assessments)
- Need for distributed transactions across regions
- Cost becomes prohibitive
- Require database feature not in PostgreSQL

**Monitoring**:
- Track database performance (query time, connection pool usage)
- Monitor cost per assessment
- Review quarterly

**Review Date**: Q4 2026 (or when assessment count > 500K)

---

### A-003: Assessment Volume Will Remain Manageable on a Monolith

**Assumption**: RunPayway can handle current and next 12 months of assessment volume (~10-50K assessments) on a single application server.

**Rationale**:
- Early-stage product, manageable scale
- Monolith reduces operational complexity
- Easier to deploy and maintain

**If This Breaks**:
- Latency becomes unacceptable (>2 sec per assessment)
- Server capacity approaches limits (>90% CPU)
- Need to scale across multiple availability zones

**Monitoring**:
- Track assessment creation rate (assessments/day)
- Monitor server CPU, memory, disk I/O
- Review monthly

**Review Date**: Q4 2026 (or when assessment creation > 1K/day)

---

### A-004: DigitalOcean Remains the Hosting Provider

**Assumption**: DigitalOcean will continue to be a cost-effective, reliable hosting provider for RunPayway infrastructure.

**Rationale**:
- Vendor consolidation (DigitalOcean Secrets, DigitalOcean App Platform, etc.)
- Lower operational burden than managing own infrastructure
- Cost predictability

**If This Breaks**:
- DigitalOcean changes pricing materially (>50%)
- Service reliability degrades
- Need for multi-cloud or self-hosted infrastructure
- Competitive offering emerges with significant advantages

**Monitoring**:
- Track infrastructure costs monthly
- Monitor uptime (target: 99.9%)
- Review quarterly

**Review Date**: Q4 2026 (or if cumulative costs exceed budget)

---

### A-005: Enterprise Hierarchy Is Not Required Today

**Assumption**: RunPayway does not need to support enterprise organizational hierarchies (departments, teams, approval workflows) in Sprint 1-3.

**Rationale**:
- No current customer demand
- Advisor-First schema is simpler without it
- Can add later when evidence justifies complexity

**Customer Evidence Gate**: Before implementing Enterprise Hierarchy, require:
- ☐ 3 enterprise prospects requesting it, OR
- ☐ 1 signed enterprise contract requiring it, OR  
- ☐ 50%+ of new customers are enterprises asking for it

**If This Breaks**:
- Major enterprise customer requires it immediately
- Market shifts, enterprises become primary customer type
- Competitor implements it and gains market advantage

**Monitoring**:
- Track enterprise prospect requests
- Document all "need for hierarchy" feedback
- Review monthly

**Review Date**: Q2 2026 (or when customer evidence gate met)

---

### A-006: Model Governance Can Be Lightweight Initially

**Assumption**: RP-2.0 governance (Model Review Board, change control, formal approval) is appropriate for current-stage product.

**Rationale**:
- Early-stage, limited customers
- Board is small (CTO, CPO, CRO)
- Processes can evolve as organization grows

**If This Breaks**:
- Formal board governance becomes impossible (conflicting schedules)
- Model changes become too frequent to track
- Regulatory requirement for external oversight

**Monitoring**:
- Track decision log entries (should grow 2-4/month initially)
- Monitor board meeting frequency (target: monthly third Tuesday)
- Review quarterly

**Review Date**: Q4 2026

---

### A-007: Tamper-Evident Audit Logs Provide Sufficient Defensibility

**Assumption**: Hash-chain audit logs (with database admin ability to modify) provide sufficient defensibility for institutional review.

**Rationale**:
- Tampering would require modifying multiple hashes (detectable)
- Immutable infrastructure is expensive, not justified yet
- Tamper-evidence is "good enough" for current institutional stage

**If This Breaks**:
- Enterprise customer demands immutable logs
- Regulatory requirement for cryptographically immutable records
- Tamper-detection alone insufficient for compliance

**Monitoring**:
- Document all audit log questions from prospects
- Track if any deal is lost due to tamper-evidence requirement
- Review quarterly

**Review Date**: Q4 2026

---

### A-008: No Real-Time Integration Required Yet

**Assumption**: Assessments can be created and verified asynchronously (no real-time API requirement in Sprint 1).

**Rationale**:
- Initial customers (advisors) work in batch/offline workflow
- Reduces operational complexity
- Can add streaming/webhooks later if needed

**If This Breaks**:
- Customer requires real-time assessment API
- Market competitive pressure for real-time verification
- Integration partnerships require real-time data feeds

**Monitoring**:
- Track customer requests for real-time features
- Monitor latency requirements in new prospects
- Review quarterly

**Review Date**: Q4 2026

---

### A-009: Single-Region Deployment Is Sufficient

**Assumption**: All infrastructure will be hosted in DigitalOcean's US region (no multi-region, no disaster recovery failover in Sprint 1).

**Rationale**:
- Simplifies deployment and operations
- No current customer demand for geo-redundancy
- Cost-effective for early stage

**If This Breaks**:
- Customer in regulated jurisdiction requires data residency
- Service availability becomes critical (>99.9% uptime SLA)
- Disaster recovery becomes business requirement

**Monitoring**:
- Track downtime incidents (target: <8.76 hours/year for 99.9%)
- Document any customer concerns about data residency
- Review quarterly

**Review Date**: Q4 2026

---

### A-010: Advisor Authentication via Email/Password Is Sufficient

**Assumption**: Email/password authentication is adequate for advisor login (no OAuth, SAML, MFA required in Sprint 1).

**Rationale**:
- Reduces initial complexity
- Advisors manage credentials easily
- Can add SSO/MFA later if needed

**If This Breaks**:
- Enterprise customer requires SAML/SSO
- Regulatory requirement for MFA
- Competitive pressure for advanced auth

**Monitoring**:
- Track authentication-related customer requests
- Document any compliance requirements
- Review quarterly

**Review Date**: Q4 2026

---

## Assumption Change Process

### If an Assumption Becomes Invalid

**Step 1: Document**
```
Assumption: A-00X [name]
Status: BROKEN
Evidence: [What broke it?]
Date: [When did we discover it?]
Impact: [What needs to change?]
```

**Step 2: Assess**
- Does this block a critical customer deal?
- Does this create regulatory risk?
- Does this require immediate action, or can it wait until next sprint?

**Step 3: Decide**
- **Critical**: Trigger architecture review and roadmap update
- **Important**: Schedule for next sprint planning
- **Nice-to-have**: Monitor and decide later

**Step 4: Document in Decision Log**

---

## Quarterly Review

**Every quarter (start of Q), review all assumptions**:

1. **Still Valid?**
   - Is the evidence supporting this assumption still true?
   - Has market, customer base, or technology changed?

2. **Still Important?**
   - Does this assumption still drive architectural decisions?
   - Or has it become irrelevant?

3. **Review Date Still Good?**
   - Adjust review date if needed
   - Bring forward if evidence is mounting

4. **New Assumptions?**
   - Any new assumptions in architecture since last review?
   - Add to register

---

## Why This Matters

**Most failed architectures collapse because**:

❌ Key assumptions were never documented  
❌ No one monitored whether assumptions remained valid  
❌ When assumptions broke, no one reassessed  
❌ Architecture continued operating on false premises  

**This register prevents that.**

It says: "We built this on these assumptions. We will monitor them. When one breaks, we will act."

---

**This document is the source of truth for architectural assumptions.**

Review quarterly. Update immediately when evidence changes.
