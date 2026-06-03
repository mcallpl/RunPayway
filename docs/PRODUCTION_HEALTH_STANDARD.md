# Production Health Standard

**Owner**: CTO / Operations  
**Effective Date**: Sprint 2 (when production deployed)  
**Review Frequency**: Daily (automated), Weekly (manual review)  
**Status**: TEMPLATE (metrics become live post-deployment)

---

## Core Principle

**What gets measured, gets managed.**

RunPayway's institutional credibility depends on observable, measurable health—not claims.

This standard defines what we measure, how often, and what action we take if metrics deviate.

---

## APPLICATION HEALTH

### Uptime

**Metric**: Availability percentage (target: 99.9%)

```
Calculation: (total_seconds - downtime_seconds) / total_seconds * 100

99.9% = 8.76 hours downtime allowed per year
99.99% = 52.56 minutes downtime allowed per year
```

**Monitoring**:
- Health check every 30 seconds
- If 3 consecutive checks fail → alert
- Track outages in incident log

**Alert Threshold**: <99%  
**Action**: Page on-call engineer, begin incident response

---

### Error Rate

**Metric**: Percentage of requests returning 5xx errors (target: <0.1%)

```
error_rate = 5xx_requests / total_requests * 100

0.1% = 1 error per 1,000 requests
1.0% = 1 error per 100 requests (unacceptable)
```

**Monitoring**:
- Real-time log analysis
- Alert if error rate >0.5% for >5 minutes
- Daily summary of errors by type

**Alert Threshold**: >0.5%  
**Action**: Investigate error source, consider rollback if recent deployment

---

### Response Time (Latency)

**Metric**: p95 (95th percentile) response time (target: <500ms)

```
p95 = 95% of requests complete within X milliseconds

p50 (median): should be ~100-200ms
p95 (slow): should be <500ms
p99 (slowest): should be <1000ms
```

**Monitoring**:
- Measure every request
- Track by endpoint (assessment creation should be faster than complex queries)
- Daily histogram

**Alert Threshold**: p95 >1000ms for >5 minutes  
**Action**: Check database slow queries, consider scaling

---

## ASSESSMENT ENGINE HEALTH

### Assessments Per Day

**Metric**: Number of assessments completed daily (historical baseline)

```
Jan: 10 assessments/day
Feb: 12 assessments/day
Mar: 15 assessments/day
...
Trend: Growth indicator
```

**Monitoring**:
- Count daily completions
- Weekly trend analysis
- Monthly growth rate

**Alert Threshold**: Sudden drop (>50% decrease) → investigate  
**Action**: Customer inquiry, support ticket spike?

---

### Failed Assessments

**Metric**: Assessments that errored during processing (target: <0.1%)

```
failed_rate = error_count / total_assessments * 100

0.1% = 1 error per 1,000 assessments
1.0% = 1 error per 100 (unacceptable)
```

**Monitoring**:
- Real-time error tracking
- Log failure reason (input validation, model phase failure, etc.)
- Alert if >1 failure in a day

**Alert Threshold**: >1 failure/day  
**Action**: Investigate error logs, consider model regression

---

### Assessment Duration

**Metric**: Average time from submission to completion (target: <5 seconds)

```
p50 (median): should be <2 seconds
p95 (slow): should be <5 seconds
p99 (slowest): should be <10 seconds
```

**Monitoring**:
- Measure per assessment
- Track if models run slower on certain input types
- Daily histogram

**Alert Threshold**: p95 >10 seconds  
**Action**: Profile code, check database performance

---

## MODEL HEALTH

### Score Distribution

**Metric**: Distribution of final scores (should be roughly normal)

```
Expected distribution (from historical data):
  Limited Stability (0-50): 20%
  Developing Stability (51-65): 35%
  Established Stability (66-75): 30%
  High Stability (76-100): 15%
  
Anomaly: If Limited >40%, something might be wrong
Anomaly: If High <5%, model might be too harsh
```

**Monitoring**:
- Daily histogram of scores
- Compare to baseline distribution
- Alert if deviation >5% from baseline

**Alert Threshold**: >10% deviation  
**Action**: Review recent assessments, check for input data quality issues

---

### Band Distribution

**Metric**: Distribution of stability bands (should match score distribution)

```
Expected (from baseline):
  Limited: 20%
  Developing: 35%
  Established: 30%
  High: 15%
```

**Monitoring**:
- Daily count per band
- Compare to expected distribution
- Alert if any band >50% or <5%

**Alert Threshold**: >10% deviation  
**Action**: Investigate assessment inputs

---

### Anomaly Detection

**Metric**: Outliers (assessments with unusual characteristics)

```
Trigger if:
  • Score < 20 or > 95 (extreme, rare)
  • Duration > 30 seconds (very slow)
  • Model phase failed (unusual error)
  • Income data contradicts band (data quality)
```

**Monitoring**:
- Real-time detection
- Log each anomaly
- Alert if >5 anomalies/day

**Alert Threshold**: >5 anomalies/day  
**Action**: Manual review of flagged assessments

---

### Model Version Adoption

**Metric**: What percentage of new assessments use current model version

```
When RP-2.1 released:
  Day 1: 100% new assessments → RP-2.1
  Transition period: None (upgrade immediately)
  
If rollback happens:
  RP-2.1: 95% (until users explicitly choose RP-2.0)
  RP-2.0: 5% (legacy holdouts)
```

**Monitoring**:
- Track by model_version in assessments
- Monitor for unexpected RP-2.0 usage after RP-2.1 release

**Alert Threshold**: >10% on old model version after 30 days  
**Action**: Check for bugs in new version, consider rollback

---

## DATABASE HEALTH

### Slow Queries

**Metric**: Queries taking >1 second (target: zero)

```
Example slow query:
  SELECT * FROM assessments WHERE created_at > NOW() - INTERVAL '1 year'
  (no index, full table scan)
  
Expected: Completes in <100ms with proper indices
```

**Monitoring**:
- PostgreSQL slow query log (enable for >1s queries)
- Daily report of top 10 slowest queries
- Alert if any query >5 seconds

**Alert Threshold**: Any query >5 seconds  
**Action**: Add index or optimize query

---

### Connection Pool Usage

**Metric**: Active database connections (target: <80% of max)

```
Max connections: 100
Alert if: >80 in use simultaneously
Critical if: >95 in use (connection pool exhausted)
```

**Monitoring**:
- Real-time connection count
- Alert if >80% for >5 minutes
- Daily peak usage

**Alert Threshold**: >90% utilization  
**Action**: Investigate connection leaks, consider scaling

---

### Storage Growth

**Metric**: Database disk usage (target: growing linearly with data)

```
Jan 1: 10 GB
Feb 1: 12 GB (2 GB/month = normal)
Mar 1: 20 GB (8 GB/month = anomaly, investigate)
```

**Monitoring**:
- Monthly size check
- Trend analysis
- Alert if growth rate doubles unexpectedly

**Alert Threshold**: Growth spike (>3x normal rate)  
**Action**: Check for data quality issues, old data accumulation

---

### Backup Success

**Metric**: Daily backup completion (target: 100% success)

```
Expected:
  Daily automated backup: ✅
  Backup size: Grows linearly with data
  Backup success rate: 100%
```

**Monitoring**:
- Daily backup completion check
- Alert if backup fails
- Monthly restore test (prove backups are usable)

**Alert Threshold**: Any backup failure  
**Action**: Investigate, fix immediately (backups are critical)

---

## DEPLOYMENT HEALTH

### Deployment Frequency

**Metric**: How often we deploy to production (trend, not target)

```
Healthy pattern:
  Week 1: 3 deployments (active development)
  Week 2: 1 deployment (slower period)
  Week 3: 2 deployments
  Average: 1-2 per week
  
Anomaly:
  Zero deployments for 30 days (stalled)
  10+ deployments in 1 day (unusual, high risk)
```

**Monitoring**:
- Track every deployment
- Weekly count
- Monthly trend

**Alert Threshold**: Zero deployments >30 days (stalled project)  
**Action**: Check if team is blocked

---

### Rollback Count

**Metric**: How many deployments were rolled back (target: <5% of all deployments)

```
100 deployments/year
5 rollbacks acceptable (5%)
10+ rollbacks = high defect rate
```

**Monitoring**:
- Track every rollback
- Reason for each rollback
- Monthly rollback rate

**Alert Threshold**: >10% rollback rate in any month  
**Action**: Improve testing/staging validation

---

### Deployment Success Rate

**Metric**: Percentage of deployments that succeeded without rollback (target: >95%)

```
Success = deployed, no rollback within 24 hours
Failure = rolled back (immediately or after issues)

95% = 1 failure per 20 deployments
80% = 1 failure per 5 deployments (too high)
```

**Monitoring**:
- Track each deployment outcome
- Weekly success rate
- Monthly trend

**Alert Threshold**: <90% success rate  
**Action**: Improve CI/CD gates, add more staging validation

---

## INSTITUTIONAL HEALTH

### Audit Log Completeness

**Metric**: Percentage of actions logged (target: 100%)

```
Expected audit trail:
  ✅ Every assessment created
  ✅ Every role granted/revoked
  ✅ Every secret accessed
  ✅ Every model change
  
Anomaly: Missing audit entries
```

**Monitoring**:
- Daily audit log review
- Verify completeness (no gaps)
- Alert if any action missing from log

**Alert Threshold**: Audit entry missing  
**Action**: Investigate, add logging if needed

---

### Data Integrity Checks

**Metric**: Periodic verification that hashes match (target: 100% pass)

```
Monthly validation test:
  1. Sample 100 random assessments
  2. Recompute hashes from original data
  3. Compare to stored hashes
  4. Verify 100% match
```

**Monitoring**:
- Monthly integrity check
- Alert if any hash mismatch (data corruption!)
- Document results

**Alert Threshold**: Any hash mismatch  
**Action**: CRITICAL - stop deployment, investigate immediately

---

## Health Dashboard Layout

```
🟢 = Healthy (target met)
🟡 = Warning (approaching threshold)
🔴 = Critical (over threshold, action required)

APPLICATION
  Uptime:              🟢 99.92%
  Error Rate:          🟢 0.08%
  Response Time (p95): 🟡 650ms (target: <500ms)

ASSESSMENT ENGINE
  Assessments/Day:     🟢 42
  Failed Rate:         🟢 0.00%
  Avg Duration:        🟢 2.1s

MODEL
  Score Distribution:  🟢 Normal
  Band Distribution:   🟢 Expected
  Anomalies:           🟢 0
  Version Adoption:    🟢 RP-2.0: 100%

DATABASE
  Slow Queries:        🟢 0
  Connections:         🟢 45/100 (45%)
  Storage:             🟢 45 GB (normal growth)
  Backup:              🟢 ✅ Successful

DEPLOYMENT
  Frequency:           🟢 2/week
  Success Rate:        🟢 98%
  Rollback Count:      🟢 1/20

INSTITUTIONAL
  Audit Completeness:  🟢 100%
  Data Integrity:      🟢 100% match
```

---

## Weekly Review Process

**Every Monday, 10am**:

1. **Review Dashboard** (5 min)
   - Any 🔴 alerts? → Investigate
   - Any 🟡 trends? → Watch

2. **Review Metrics** (10 min)
   - Performance trends (improving or degrading?)
   - Compare to baseline

3. **Review Incidents** (10 min)
   - Any outages?
   - Any errors?
   - Document root cause

4. **Plan** (5 min)
   - Anything to fix this week?
   - Any preventive improvements?

---

## Action Thresholds

**Green → Yellow**:
- Error rate rises above 0.1%
- Response time p95 rises above 500ms
- Failed assessments rise above 0
- Slow queries appear

**Action**: Monitor closely, no action yet

**Yellow → Red**:
- Error rate above 0.5% for >5 minutes
- Response time p95 above 1000ms for >5 minutes
- >5 anomalies in a day
- >10% rollback rate

**Action**: Page on-call, begin investigation

**Red (Critical)**:
- Uptime below 95% (production down)
- Data corruption detected (hash mismatch)
- Audit log gap (missing entries)
- Backup failure (no recovery capability)

**Action**: IMMEDIATE response, escalate to leadership

---

## Reporting

**Daily**: Automated dashboard update (available 24/7)

**Weekly**: Manual review + summary email

**Monthly**: Detailed health report (to leadership/board)
- Performance summary
- Incident summary
- Improvement recommendations
- Forecast (if trends continue)

---

**This standard defines how we know RunPayway is healthy and institutional-grade.**

Elite companies obsess over metrics. Metrics drive behavior. Behavior drives outcomes.

Monitor these. Act on them. Build trust through visibility.
