# RunPayway Pre-Launch Checklist

## CRITICAL BUGS (Must fix before launch)

- [ ] **Simulator tealGlow reference** — `BRAND.tealGlow` undefined. Fix in simulator/page.tsx line ~1357
- [ ] **Tools page missing router** — `router.replace` called but `useRouter()` never initialized in tools/page.tsx
- [ ] **Free-score import path** — `CanonicalInput` imported from wrong module in free-score/page.tsx
- [ ] **V2 engine variable order** — `benchmarks` used before declaration in v2/index.ts line 224 vs 247

## REPORT (Interactive + PDF)

- [ ] Report renders as 5 pages (Cover + 4 content). Verify no overflow.
- [ ] PDF print produces exactly 5 letter-size pages. Test Cmd+P with margins set to None.
- [ ] Cover page: score, band, access code, QR code all render
- [ ] Page 1 Key Findings: Key Takeaway, Good/Bad News, Suite CTA
- [ ] Page 2 Action Plan: 3 steps with plain English (no raw field names like `labor_dependence_pct`)
- [ ] Page 3 Stress Test: 3 scenarios with risk/solution/impact
- [ ] Page 4 Next Steps: real-world cards, value section, share (email only), retake timing
- [ ] Email delivery works (Resend API key configured)
- [ ] Access code on cover page is valid base64 that decodes correctly

## STABILITY SUITE

### Dashboard (/dashboard)
- [ ] Sample data renders with 4 band selector buttons (Limited/Developing/Established/High)
- [ ] Access code input works inline on the dashboard
- [ ] Score displays with AnimatedNumber component
- [ ] Two-column layout renders on desktop, stacks on mobile
- [ ] #1 Priority card shows with correct action and lift
- [ ] Income structure bar shows 3 segments with correct labels
- [ ] SVG trajectory line chart renders with 4 points (Now/3mo/6mo/12mo)
- [ ] Key metrics show: runway, risk drop, fragility
- [ ] Reassessment readiness checkboxes persist in localStorage
- [ ] Plan status shows ($69 single vs $149 monitoring)
- [ ] Return visit notification appears for returning users
- [ ] Download Assessment Data (JSON) button works
- [ ] Cmd+K command palette opens and navigates
- [ ] SuiteCTA renders at bottom

### PressureMap (/pressuremap)
- [ ] Sample data renders with 4 band selector buttons
- [ ] Score + Income Bar in one card (side by side)
- [ ] 3 zone cards always visible (not collapsed)
- [ ] Each zone shows: percentage, risk, "IF YOU FIX THIS" with projected score, "Model in Simulator" button
- [ ] Key risk metrics row: source loss, runway, fragility
- [ ] Clicking "Model in Simulator" navigates to /simulator
- [ ] SuiteCTA renders at bottom

### Simulator (/simulator)
- [ ] Renders with default data when no access code loaded (no error)
- [ ] Light theme matches Dashboard/PressureMap (no dark theme remnants)
- [ ] Score triptych shows Current/Simulated/Impact with AnimatedNumber
- [ ] Micro-goal progress bar shows gap to next band
- [ ] Celebration toast appears on score changes
- [ ] All 6 presets work and show lift values
- [ ] Advanced sliders work (recurrence, top client, sources, months, passive)
- [ ] Income Timeline SVG chart renders for 3/6/12 month projection
- [ ] Stress test cards show (lose top client, can't work 90 days)
- [ ] State persistence: scenario saves to localStorage, resume banner appears on return
- [ ] Cmd+K works from simulator
- [ ] SuiteCTA renders at bottom
- [ ] SuiteHeader shows with correct active state

### Suite Hub (/tools)
- [ ] Redirects to /dashboard when customer data exists in sessionStorage
- [ ] Shows conversion page with 3 tool cards for non-customers
- [ ] Access code input with unlock animation works
- [ ] After code entry, redirects to /dashboard
- [ ] Band demo buttons work on non-customer view
- [ ] CTA "Get Started — From $69" links to /pricing

## NAVIGATION & FLOW

- [ ] SuiteHeader appears on all 4 Suite pages (Dashboard, PressureMap, Simulator, Tools)
- [ ] SuiteHeader shows RunPayway logo linking to / (landing page)
- [ ] SuiteHeader shows current page name + nav links
- [ ] Cmd+K search button visible in header
- [ ] Report bottom bar shows "RunPayway Stability Suite" link + Print/PDF button
- [ ] Report Suite CTA links to /pressuremap (first step in flow)
- [ ] Marketing header: How It Works | Sample Report | Stability Suite | Pricing | [More]
- [ ] Marketing footer: Stability Suite listed under Product
- [ ] Ghost bar (landing page sticky nav): Stability Suite | Sample Report | Pricing

## LANDING PAGE

- [ ] Hero video plays (rp-video.mp4)
- [ ] Hero section renders with score animation
- [ ] SimulatorTeaser component works
- [ ] All sections load without errors
- [ ] CTA buttons link to /pricing
- [ ] "Stability Suite" link in nav goes to /tools

## DIAGNOSTIC FLOW

- [ ] /diagnostic-portal loads with name/email input
- [ ] Profile setup (classification, structure, income model, industry) works
- [ ] 6 diagnostic questions render and accept answers
- [ ] Score calculation completes without errors
- [ ] PressureMap API call works (or fallback generates correctly)
- [ ] Record saves to sessionStorage and localStorage
- [ ] Redirect to /review works after completion
- [ ] Email sends with report summary

## PRICING & PAYMENT

- [ ] /pricing page shows $69 single and $149 three-assessment options
- [ ] Stripe checkout flow works
- [ ] Webhook processes payment and creates session
- [ ] Purchase session stored correctly for plan detection

## EMAIL

- [ ] Report delivery email sends via Resend
- [ ] Follow-up API route exists at /api/v1/follow-up (Day 7, 30, 90 templates)
- [ ] Resend API key is set in environment variables

## MOBILE RESPONSIVENESS

- [ ] Landing page responsive on mobile
- [ ] Report readable on mobile (paginated view)
- [ ] Dashboard stacks to single column on mobile
- [ ] PressureMap stacks on mobile
- [ ] Simulator mobile CSS overrides work
- [ ] SuiteHeader responsive (may need mobile menu)
- [ ] Cmd+K works on mobile (via button, not keyboard)

## SEO & META

- [ ] Title tags on all pages
- [ ] Meta descriptions on marketing pages
- [ ] OG image set
- [ ] Favicon set
- [ ] robots.txt exists
- [ ] sitemap generated

## LEGAL & COMPLIANCE

- [ ] Privacy policy page exists and is current
- [ ] Terms of use page exists
- [ ] Cookie consent banner works
- [ ] "Not financial advice" disclaimer on report and all tools
- [ ] "Proprietary tool by PeopleStar Enterprises" in all footers

## DEPLOYMENT

- [ ] GoDaddy FTP deployment via GitHub Actions works
- [ ] All static assets deploy correctly (fonts, images, video)
- [ ] Environment variables set (RESEND_API_KEY, STRIPE keys)
- [ ] HTTPS configured
- [ ] Custom domain resolves correctly

## BRANDING CONSISTENCY

- [ ] RunPayway with TM symbol everywhere the brand name appears
- [ ] PressureMap with TM where referenced
- [ ] Income Stability Score with TM on report
- [ ] "PeopleStar Enterprises" in all legal footers
- [ ] Navy (#0E1A2B), Purple (#4B3FAE), Teal (#1F6D7A) used consistently
- [ ] Inter font loaded on all pages
- [ ] No emoji in production UI (removed from badges)
