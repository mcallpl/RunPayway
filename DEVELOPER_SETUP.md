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

## The Workflow (Safe & Tested)

### 1. Start Your Session
```bash
./scripts/sync.sh
npm run dev
```
Response: "✅ Ready to work" + local dev server running on localhost:3000/RunPayway

### 2. Make Changes & Test Locally
- Edit files in your editor
- See changes in `npm run dev` (hot reload)
- **Verify visually against mockups** before committing
- This prevents bad code from going to production

### 3. Commit (Pre-Commit Validation)
```bash
git add .
git commit -m "Your message"
```

What happens:
- **Pre-commit hook runs:**
  1. Checks you're on latest code
  2. Runs `npm run build` to validate code compiles
  3. If build fails → commit blocked with error details
  4. If build succeeds → commit allowed

**Result:** Bad code can't be committed. Period.

### 4. Review & Push (You Control Deployment)
After commit succeeds, you get a reminder:
```
✅ Commit successful (build validated)

Next step: Push to deploy
  → Run: git push origin main

This will:
  1. Upload to GitHub
  2. Trigger GitHub Actions
  3. Deploy to peoplestar.com/RunPayway
```

**You decide when to push.** This creates a review point.

```bash
git push origin main
# GitHub Actions deploys within 1-2 minutes
# Visit peoplestar.com/RunPayway to verify
```

**Result:** Changes are live after you push.

---

## What The Hooks Do (Now)

### Pre-Commit Hook (Prevents Bad Code)
Before allowing any commit:
- ✓ Checks you're on latest code (pulls if needed)
- ✓ Validates build with `npm run build`
- ✓ If build fails: blocks commit, shows errors, you fix and try again

**Result:** Only compilable code reaches GitHub/production.

### Post-Commit Hook (Reminds You to Push)
After successful commit:
- Prints reminder: "Your code is committed locally"
- Reminds you to: `git push origin main` when ready
- No auto-push (you control deployment timing)

---

## The Difference

**Old way:** Commit → Auto-push → Deploy → Discover problems on live site

**New way:** Commit → Local validation → Manual push → Deploy → Verify works

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

**Q: Changes pushed but not showing on live site**
1. Wait 2 minutes (GitHub Actions needs time)
2. Hard refresh in browser (Cmd+Shift+R or Ctrl+Shift+R)
3. If still not there, check GitHub Actions build status (Actions tab)

**Q: I broke production, how do I fix it?**
```bash
# Find the bad commit
git log --oneline

# Revert it
git revert <bad-commit-hash>
git push origin main

# This creates a new commit that undoes the bad one
# GitHub Actions will re-deploy the fixed version
```

---

## Key Rules

1. **Always run `./scripts/sync.sh` at session start**
   - Guarantees you're on latest code

2. **Always use `npm run dev` to test locally**
   - See changes before committing
   - Catch visual errors before production

3. **Never skip the pre-commit hook**
   - Don't use `git commit --no-verify`
   - The build validation is your safety net

4. **Push manually when you're confident**
   - You control when code goes to production
   - Review the commit before pushing
   - Creates natural review point

---

## Quick Reference

```bash
# Session start
./scripts/sync.sh
npm run dev

# Work normally
# (test locally, verify against mockups)

# When ready to commit
git add .
git commit -m "description of changes"
# Pre-commit hook validates build

# When ready to deploy
git push origin main
# GitHub Actions deploys to peoplestar.com/RunPayway

# If something breaks
git revert <commit-hash>
git push origin main
```

---

## Summary

- **Local testing:** `npm run dev` before committing
- **Build validation:** Pre-commit hook checks it compiles
- **Manual deploy:** You push when ready (not auto)
- **Safety net:** Bad code can't leave your machine
- **Rollback:** Easy to undo with `git revert`

This prevents the "changes don't match mockups" and "site is broken" problems.
