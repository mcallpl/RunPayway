# RunPayway Development Scripts

Permanent, reusable QA and deployment scripts. No temporary test files.

## Workflow

### Local Development

1. **Start dev server** (in separate terminal):
   ```bash
   npm run dev
   ```

2. **Verify a page**:
   ```bash
   npm run verify -- /how-it-works
   npm run verify -- /
   ```

3. **Take screenshots** (saves to `/tmp/runpayway-screenshots/`):
   ```bash
   npm run screenshot -- /how-it-works
   npm run screenshot -- /
   ```

4. **Check route accessibility**:
   ```bash
   npm run check:route -- /how-it-works
   ```

### Before Commit

**Run predeploy check** (build + cleanup + verify):
```bash
npm run predeploy
```

This will:
- Build the project
- Remove any temporary test files from root
- Verify the how-it-works page loads correctly
- Check header, footer, nav links, and essential copy

### Before Push

Verify git status shows only intended changes:
```bash
git status
```

Confirm:
- Only source files changed (no build artifacts)
- No temporary test files remain
- package.json changes are intentional

### After Deployment

Verify live site:
```bash
npm run check:route -- /how-it-works
```

This will confirm the route is accessible on the live server.

## Scripts Reference

### verify-page.js
Validates page structure and content.

**Checks**:
- Header exists
- Footer exists
- Navigation links present
- Essential page copy exists

**Usage**:
```bash
npm run verify -- /how-it-works
```

### screenshot-page.js
Captures desktop and mobile screenshots.

**Output**: `/tmp/runpayway-screenshots/`

**Sizes**:
- Desktop: 1200x800
- Mobile: 375x812

**Usage**:
```bash
npm run screenshot -- /how-it-works
```

### check-route.js
Quick accessibility check for a route.

**Checks**:
- HTTP status code
- Page title present
- Content loaded

**Usage**:
```bash
npm run check:route -- /how-it-works
```

### cleanup-temp.js
Removes temporary test scripts from project root.

Automatically run by `npm run predeploy`, but can be run manually:

```bash
npm run cleanup
```

### predeploy-check.js
Full pre-deployment validation.

**Checks**:
- Build directory exists
- Package files present (package.json, package-lock.json, tsconfig.json)
- No temporary scripts in root
- Git status summary

**Usage**:
```bash
npm run predeploy
```

## Policy

- ✅ All QA scripts live in `/scripts/`
- ✅ All scripts accept route arguments
- ✅ Screenshots save to `/tmp/` (not in project)
- ✅ No ad hoc test files in project root
- ✅ No heredoc commands for file creation
- ✅ Run `npm run predeploy` before every commit
- ✅ Run `git status` before every push
- ✅ **All scripts use automatic port detection (3000→3001→3002)**
- ✅ **No hardcoded `localhost:3000` anywhere**
- ✅ **Scripts fail with clear error if dev server not running**

## Examples

### Update a page and deploy

1. Edit page file
2. Test locally: `npm run verify -- /page-route`
3. Take screenshot: `npm run screenshot -- /page-route`
4. Before commit: `npm run predeploy`
5. Commit with message
6. Push to main (auto-deploys)
7. Verify live: `npm run check:route -- /page-route`

### Create a new page

1. Create page file
2. Start dev: `npm run dev`
3. Verify structure: `npm run verify -- /new-page`
4. Screenshot: `npm run screenshot -- /new-page`
5. Before commit: `npm run predeploy`
6. Commit and push

## Port Detection

All scripts automatically detect the running dev server port:

- First tries **port 3000**
- If unavailable, tries **port 3001**
- If unavailable, tries **port 3002**
- If none available, returns clear error message

**No hardcoding of ports.** This ensures scripts work whether port 3000 is free or occupied.

If you see:
```
Error: Could not connect to dev server
Make sure to run: npm run dev
```

Then start the dev server:
```bash
npm run dev
```

## Troubleshooting

### Scripts fail with "Could not connect to dev server"
Dev server not running. Start with: `npm run dev`

### Scripts fail with "Cannot find module 'puppeteer'"
Ensure puppeteer is installed: `npm install`

### Screenshot script times out
Check that dev server is running and page loads successfully.

### cleanup script says temporary files found
Run it: `npm run cleanup`

## Notes

- All scripts are idempotent and safe to run multiple times
- All scripts auto-detect active dev server port (3000/3001/3002)
- Screenshots are timestamped (YYYY-MM-DD) and saved to `/tmp/`
- No authentication required for local scripts
- Scripts use Puppeteer for accurate page rendering
- **Never hardcode localhost:3000 in any new script**
