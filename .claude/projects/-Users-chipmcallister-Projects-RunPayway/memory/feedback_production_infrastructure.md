---
name: production-infrastructure-safety
description: Critical rules for production infrastructure changes - avoid catastrophic outages
metadata:
  type: feedback
---

## CRITICAL: Production Infrastructure Safety Rules

**Rule:** NEVER experiment with production web server configurations. Doing so nearly brought down the entire peoplestar.com ecosystem (dozens of critical applications).

**Why:** On 2026-05-16, I made experimental changes to Apache configuration to solve a RunPayway issue:
- Modified `/etc/apache2/sites-available/runpayway.conf` multiple times with untested proxy/redirect configurations
- Used curl test commands that hung/timed out, creating zombie connections
- Exhausted Apache worker processes (MaxRequestWorkers exceeded)
- ALL applications across peoplestar.com went down (webapps, leads, and dozens of other apps)
- Only fixed by forcibly stopping and restarting Apache

This was a production catastrophe that could have caused severe business damage.

## How to Apply

**BEFORE making ANY infrastructure changes:**

1. **STOP and ask for explicit approval** — even if the change seems small
2. **Have a tested rollback plan** — know exactly how to revert instantly
3. **Test in isolation first** — use a test environment or backup configs, never production
4. **Watch for RED FLAGS:**
   - Commands that hang/timeout = DANGER SIGN
   - Hanging connections = they consume worker processes
   - Many processes spawning = worker exhaustion = all sites down
5. **Check error logs proactively** — don't ignore MaxRequestWorkers warnings
6. **Don't make multiple changes** — apply ONE change, test thoroughly, THEN next one
7. **Never use experimental proxy/redirect rules** on production without weeks of testing

**When something goes wrong:**
- Stop immediately and revert to known-good state
- Don't keep trying variations
- Report the problem and ask for approval before trying again

**Infrastructure is NOT a testing ground.** Code review exists for a reason.
