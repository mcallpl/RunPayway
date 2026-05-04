# RunPayway Developer Setup & Workflow

## Quick Start (Do This Every Time You Open the Project)

```bash
./scripts/sync.sh
npm run dev
```

This ensures:
- ✓ You're on the latest code
- ✓ All dependencies are installed
- ✓ You can test locally before committing

Takes ~10 seconds.

---

## The Workflow (Optimized for Speed & Safety)

### 1. Start Your Session
```bash
./scripts/sync.sh
npm run dev
```
Local dev server running on localhost:3000/RunPayway

### 2. Make Changes & Test Locally
- Edit files in your editor
- See changes in `npm run dev` (hot reload)
- **Verify visually** before committing
- Test against mockups and reference designs

### 3. Commit & Deploy (One Step)
```bash
git add .
git commit -m "Your message"
```

What happens automatically:
1. **Pre-commit hook validates:**
   - ✓ You're on latest code (pulls if needed)
   - ✓ Code builds successfully (`npm run build`)
   - ✓ If build fails → commit blocked, fix code, try again
   - ✓ If build succeeds → commit allowed

2. **Post-commit hook deploys:**
   - ✓ Pushes to GitHub automatically
   - ✓ Triggers GitHub Actions
   - ✓ Deploys to peoplestar.com/RunPayway in ~1-2 minutes

**Result:** One command (`git commit`) = fully deployed. No manual push needed.

---

## What The Hooks Do

### Pre-Commit Hook (Validates Quality)
Before allowing any commit:
- ✓ Fetches latest code from GitHub
- ✓ Checks you're not behind origin/main
- ✓ Runs `npm run build` to ensure code compiles
- ✓ If any check fails: commit is blocked, errors shown, you fix and retry

**Result:** Only validated, compilable code leaves your machine.

### Post-Commit Hook (Auto-Deploys)
After successful commit:
- ✓ Automatically runs `git push origin main`
- ✓ Pushes code to GitHub
- ✓ Triggers GitHub Actions workflow
- ✓ Shows deployment URL and status

**Result:** Changes deployed automatically within 1-2 minutes.

---

## The Flow

**Old way:** Manual commit → Manual push → Hope code works → Discover problems on live site

**New way:** Commit → Build validation → Auto-push → Deploy → Done

---

## Troubleshooting

**Q: Commit blocked with "BUILD FAILED"**
```bash
# Review the build errors shown in your terminal
# Fix the issues in your code
git add .
git commit -m "..."  # Try again
```

**Q: Commit blocked with "behind origin/main"**
```bash
git pull origin main
git commit -m "..."  # Try again
```

**Q: Push failed during post-commit hook**
```bash
# Check your internet connection
# Check GitHub status (github.com/status)
# Retry: git commit --amend --no-edit (re-triggers hooks)
```

**Q: Changes not showing on live site**
1. Wait 2 minutes (GitHub Actions needs time)
2. Hard refresh in browser (Cmd+Shift+R or Ctrl+Shift+R)
3. Check GitHub Actions status: github.com/anthropics/RunPayway/actions

**Q: I broke production, how do I fix it?**
```bash
# Find the bad commit
git log --oneline

# Revert it
git revert <bad-commit-hash>
# This creates NEW commit that undoes the bad one
# Post-commit hook will auto-push and deploy the fix
```

---

## Key Rules

1. **Always run `./scripts/sync.sh` at session start**
   - Guarantees you're on latest code before testing

2. **Always test with `npm run dev` before committing**
   - See changes live in dev environment
   - Catch visual/functional errors before production

3. **Never skip the pre-commit hook**
   - Don't use `git commit --no-verify`
   - Build validation prevents broken code from deploying

4. **Trust the workflow**
   - Commit = build validation + auto-deploy
   - Changes live within 1-2 minutes
   - No manual push needed

---

## Quick Reference

```bash
# Start session
./scripts/sync.sh
npm run dev

# Make changes, test locally
# (verify against mockups)

# Commit (automatically validates build + pushes + deploys)
git add .
git commit -m "description of changes"

# Check deployment (wait 1-2 minutes)
# Visit: peoplestar.com/RunPayway
# Hard refresh: Cmd+Shift+R (or Ctrl+Shift+R)

# If something breaks
git revert <commit-hash>
# Auto-deploys the fix
```

---

## Summary

- **Local testing:** `npm run dev` catches issues before commit
- **Build validation:** Pre-commit blocks non-compiling code
- **Auto-deploy:** Post-commit hook pushes and GitHub Actions deploys
- **Safety:** Bad code never reaches GitHub or production
- **Fast rollback:** `git revert` creates new commit that auto-deploys

This ensures: Test → Commit → Deploy, all in one atomic operation.
