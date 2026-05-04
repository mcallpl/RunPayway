# RunPayway Developer Setup & Workflow

## Quick Start (Do This Every Time You Open the Project)

```bash
./scripts/sync.sh
```

This ensures:
- ✓ You're on the latest code
- ✓ All dependencies are installed
- ✓ You're ready to start working

Takes ~10 seconds.

---

## The Workflow

### 1. Start Your Session
```bash
./scripts/sync.sh
```
Response: "✅ You're ready to work!"

### 2. Make Changes
Edit files normally. No special commands.

### 3. Commit
```bash
git add .
git commit -m "Your message"
```

Two automatic things happen:
- **Pre-commit hook:** Checks you're on latest code (safety net)
- **Post-commit hook:** Auto-pushes to GitHub → Triggers DigitalOcean deployment

**Result:** Your changes are live on GitHub and the server.

### 4. Done
No push needed. Hooks handle it automatically.

---

## What The Hooks Do

### Pre-Commit Hook (Safety Net)
If you somehow try to commit stale code:
- ❌ Commit blocked
- Message: "Your code is behind origin/main by X commits"
- Fix: `git pull origin main` → try commit again

This prevents accidentally pushing old code.

### Post-Commit Hook (Auto-Deploy)
After every commit:
- ✅ Automatically runs: `git push origin main`
- GitHub Actions triggers
- DigitalOcean server gets latest code
- No manual push ever needed

---

## Multi-Programmer Scenario

**Programmer A** makes changes and commits → auto-pushed → live

**Programmer B** opens folder (old code on disk):
```bash
./scripts/sync.sh
```
→ Detects they're behind → pulls latest → ready to work

**No conflicts. No surprises. Always in sync.**

---

## Troubleshooting

**Q: Commit is blocked with "behind origin/main" message**
```bash
git pull origin main
git commit -m "..."  # Try again
```

**Q: Push failed in post-commit hook**
- Hook will show error message
- Network issue or GitHub is down
- Try manually: `git push origin main`

**Q: Sync script fails**
- Make sure you're on `main` branch: `git branch`
- Try: `git fetch origin` first, then `./scripts/sync.sh` again

---

## Key Rules (No Exceptions)

1. **Always run `./scripts/sync.sh` at session start**
   - This is your safety checkpoint
   - Guarantees you're on latest code

2. **Never skip the hooks**
   - Pre-commit and post-commit hooks are mandatory
   - They prevent problems automatically
   - Don't use `git commit --no-verify`

3. **Every commit is auto-pushed**
   - No manual `git push` needed
   - Every change goes live automatically
   - If push fails, you'll see the error

---

## For The Other Programmer

Send them this:

> 1. Every time you open the project, run: `./scripts/sync.sh`
> 2. Make changes and commit normally: `git commit -m "..."`
> 3. Changes auto-push. Don't manual push.
> 4. If anything blocks, the error message tells you exactly what to do.

---

## Git Config (Optional)

Add this alias for quick status check (optional, not required):

```bash
git config --global alias.status-sync '!git fetch origin && if [ $(git rev-parse main) = $(git rev-parse origin/main) ]; then echo "✓ In sync"; else echo "✗ Behind by $(git rev-list --count origin/main..main) commits"; fi'
```

Then use: `git status-sync` anytime to check sync status.
