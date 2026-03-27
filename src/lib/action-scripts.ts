/* ------------------------------------------------------------------ */
/*  RunPayway™ — Ready-to-Use Action Scripts by Industry               */
/*  3 scripts per industry × 19 industries = 57 scripts                */
/*  Each script is a starting draft the user can adapt to their voice.  */
/* ------------------------------------------------------------------ */

export interface ActionScript {
  id: string;
  title: string;
  context: string;
  script: string;
}

export const ACTION_SCRIPTS: Record<string, ActionScript[]> = {

  /* ═══════════════════════════════════════════════════════════════ */
  /*  REAL ESTATE                                                    */
  /* ═══════════════════════════════════════════════════════════════ */
  real_estate: [
    {
      id: "re-retainer",
      title: "Retainer Pitch — Property Management",
      context: "Shift from transaction-based commissions to recurring management fees",
      script: `Hi [Client Name],

I wanted to share something I've been building for select clients. Beyond buying and selling, I now offer a retained property management and advisory service — a fixed monthly engagement that covers market monitoring, tenant coordination, and portfolio strategy.

For clients like you with [X properties / ongoing real estate interests], this means you have a dedicated advisor year-round, not just at closing.

The retainer is [$ amount]/month. I'd be happy to walk through what's included — would next week work for a quick call?`,
    },
    {
      id: "re-diversify",
      title: "Diversification Outreach — Commercial Referral",
      context: "Build a referral pipeline into commercial real estate to reduce residential dependency",
      script: `Hi [Contact Name],

I've been expanding my practice to include commercial advisory alongside residential. I know you work with [business owners / investors / developers] who occasionally need guidance on commercial spaces — leasing, acquisitions, or dispositions.

If any of your clients need that kind of support, I'd welcome the introduction. I handle the full process and, of course, any referral fee arrangement is standard.

Would you be open to a quick coffee to discuss how this might work?`,
    },
    {
      id: "re-referral",
      title: "Referral Partnership Ask — Mortgage Broker",
      context: "Establish a two-way referral relationship to generate consistent leads",
      script: `Hi [Broker Name],

I've been working with a number of pre-approved buyers lately and I want to make sure my clients are getting the best lending options. I'd like to establish a formal referral partnership — I send qualified buyers your way, and when your borrowers need an agent, you think of me first.

I typically close [X] transactions per quarter, so the volume is consistent. Would you be interested in setting up a quick intro meeting to align on how we'd work together?`,
    },
  ],

  /* ═══════════════════════════════════════════════════════════════ */
  /*  CONSULTING & PROFESSIONAL SERVICES                             */
  /* ═══════════════════════════════════════════════════════════════ */
  consulting_professional_services: [
    {
      id: "cps-retainer",
      title: "Retainer Pitch — Advisory Retainer",
      context: "Convert project-based engagements into ongoing advisory relationships",
      script: `Hi [Client Name],

Now that we've completed the [project name] engagement, I wanted to propose something that several of my long-term clients have found valuable — an ongoing advisory retainer.

Rather than scoping a new project every time a question comes up, this gives you direct access to me on a monthly basis for strategic guidance, review, and prioritization. Think of it as having a senior advisor on call.

The retainer is [$ amount]/month for [X hours] of dedicated advisory time. I'll send over the structure — would it be worth discussing?`,
    },
    {
      id: "cps-diversify",
      title: "Diversification Outreach — New Vertical",
      context: "Expand into an adjacent industry to reduce client concentration",
      script: `Hi [Contact Name],

I've spent the last [X years] helping [current industry] companies with [service]. I'm now selectively expanding into [new vertical] — the challenges are structurally similar, and I believe the frameworks we've built translate directly.

I'd love to learn more about what [their company / their clients] are facing in this area. Would you be open to a 20-minute conversation? No pitch — I'm genuinely exploring whether this is a space where I can add value.`,
    },
    {
      id: "cps-referral",
      title: "Referral Partnership Ask — Complementary Firm",
      context: "Build a referral relationship with a non-competing firm serving the same clients",
      script: `Hi [Partner Name],

I've noticed that we serve a lot of the same clients but in complementary ways — you handle [their service], and I focus on [your service]. I think there's a natural opportunity to refer work to each other.

When your clients need [your expertise area], I'd be the right person to bring in — and vice versa. Would you be interested in a quarterly check-in to keep each other informed on capacity and client needs?`,
    },
  ],

  /* ═══════════════════════════════════════════════════════════════ */
  /*  SALES & BROKERAGE                                              */
  /* ═══════════════════════════════════════════════════════════════ */
  sales_brokerage: [
    {
      id: "sb-retainer",
      title: "Retainer Pitch — Managed Sales Channel",
      context: "Offer a recurring managed service instead of per-deal commissions",
      script: `Hi [Client Name],

Instead of engaging deal-by-deal, I'd like to propose a managed sales channel arrangement. For [$ amount]/month, I'll run a dedicated pipeline for your [product/territory] — prospecting, relationship management, and closing, with monthly reporting.

This gives you predictable sales coverage without the overhead of a full-time hire, and it gives me the stability to prioritize your pipeline. Would you be open to a conversation about structuring this?`,
    },
    {
      id: "sb-diversify",
      title: "Diversification Outreach — Adjacent Product Line",
      context: "Add a complementary product line to reduce single-principal risk",
      script: `Hi [Principal Name],

I currently represent [current principal] in [territory/market] and have built strong relationships with [buyer type]. I'm looking to add one complementary product line to my portfolio — something that serves the same buyers without competing.

Your [product] seems like a natural fit. Would you be open to exploring a representation arrangement? I can share my current coverage and client list for your review.`,
    },
    {
      id: "sb-followup",
      title: "Client Follow-Up — Reactivation",
      context: "Re-engage a dormant client relationship to reopen the pipeline",
      script: `Hi [Client Name],

It's been a while since we last connected, and I wanted to reach out. I've been working on some new [products / partnerships / opportunities] that I think align well with where you were headed when we last spoke.

No pressure at all — I just didn't want to let a strong relationship go quiet. Would a 15-minute catch-up be worthwhile? I'm flexible on timing.`,
    },
  ],

  /* ═══════════════════════════════════════════════════════════════ */
  /*  TECHNOLOGY                                                     */
  /* ═══════════════════════════════════════════════════════════════ */
  technology: [
    {
      id: "tech-retainer",
      title: "Retainer Pitch — Ongoing Technical Advisory",
      context: "Convert one-time builds into recurring support and development agreements",
      script: `Hi [Client Name],

Now that the initial build is live, the real work begins — iteration, optimization, and making sure the system evolves with your business. I'd like to propose a monthly retainer that covers ongoing development, bug resolution, performance monitoring, and strategic technical advisory.

This is [$ amount]/month for [X] hours of dedicated capacity, with rollover for unused time. You'll have priority access and won't need to re-scope every time something comes up.

Want me to put together a formal scope?`,
    },
    {
      id: "tech-diversify",
      title: "Diversification Outreach — SaaS or Licensing Model",
      context: "Develop a product-based revenue stream alongside client services",
      script: `Hi [Contact Name],

I've been building [tool/platform] as an internal solution for my consulting work, and several clients have asked if they could license it directly. I'm now exploring offering it as a standalone product.

Would you be interested in an early-access look? I'm offering founding-tier pricing for the first [X] users, with input into the roadmap. Let me know if a quick demo would be useful.`,
    },
    {
      id: "tech-referral",
      title: "Referral Partnership Ask — Design or Marketing Agency",
      context: "Build a referral pipeline with agencies that need technical implementation",
      script: `Hi [Agency Name],

I know your team focuses on [design / marketing / strategy], and clients often need technical implementation to bring those plans to life. I'd like to be your go-to development partner for those projects.

I handle [your tech stack / capabilities], and I'm used to working alongside agency timelines and client expectations. Could we set up a quick intro call to see if there's a fit?`,
    },
  ],

  /* ═══════════════════════════════════════════════════════════════ */
  /*  FINANCE & BANKING                                              */
  /* ═══════════════════════════════════════════════════════════════ */
  finance_banking: [
    {
      id: "fin-retainer",
      title: "Retainer Pitch — Ongoing Financial Advisory",
      context: "Move from transactional financial services to a retained advisory model",
      script: `Hi [Client Name],

I'd like to propose transitioning our relationship from transactional to a retained advisory model. Instead of engaging only around specific events — tax season, a refinance, a new investment — you'd have ongoing access to proactive financial guidance throughout the year.

The retainer is [$ amount]/month and includes quarterly reviews, real-time advisory access, and proactive alerts when market conditions warrant action. Would this kind of arrangement be valuable to you?`,
    },
    {
      id: "fin-diversify",
      title: "Diversification Outreach — Adjacent Client Segment",
      context: "Expand into a new client segment to reduce concentration risk",
      script: `Hi [Contact Name],

My practice has historically focused on [current segment — e.g., high-net-worth individuals], but I'm now selectively working with [new segment — e.g., business owners approaching exit]. The financial planning challenges overlap significantly, and I've built frameworks that translate well.

If you know anyone in that situation who could use guidance, I'd welcome an introduction. Happy to do an initial consultation at no cost to see if there's a fit.`,
    },
    {
      id: "fin-referral",
      title: "Referral Partnership Ask — CPA or Estate Attorney",
      context: "Establish a cross-referral relationship with a complementary professional",
      script: `Hi [CPA/Attorney Name],

Our clients often need both of our services, and I think a formal referral relationship would serve them well. When your clients need financial planning or investment guidance, I'd be glad to step in — and when mine need [tax strategy / estate planning], I'd send them your way.

Would you be open to a quarterly check-in to share notes on client needs and referral opportunities?`,
    },
  ],

  /* ═══════════════════════════════════════════════════════════════ */
  /*  INSURANCE                                                      */
  /* ═══════════════════════════════════════════════════════════════ */
  insurance: [
    {
      id: "ins-retainer",
      title: "Retainer Pitch — Annual Risk Review Program",
      context: "Create a recurring engagement through annual policy and risk reviews",
      script: `Hi [Client Name],

I'd like to introduce my Annual Risk Review Program. Instead of only connecting at renewal time, this is a structured engagement where we review your full coverage portfolio twice a year — proactively identifying gaps, optimizing premiums, and adjusting as your life or business changes.

The program is [$ amount]/year and includes two comprehensive reviews, priority claims support, and real-time alerts when regulatory changes affect your coverage. Would you like to hear more?`,
    },
    {
      id: "ins-diversify",
      title: "Diversification Outreach — Commercial Lines",
      context: "Expand from personal lines into commercial coverage to broaden revenue base",
      script: `Hi [Business Owner Name],

I've been working in personal insurance for [X years], and many of my clients are business owners who also need commercial coverage — general liability, professional liability, property, or workers' comp. I'm now offering commercial lines as part of my practice.

If your current business coverage is due for review, I'd be happy to do a no-obligation audit. Sometimes a fresh set of eyes catches gaps or savings that get overlooked.`,
    },
    {
      id: "ins-referral",
      title: "Referral Partnership Ask — Real Estate Agent or Mortgage Broker",
      context: "Build a referral pipeline through professionals whose clients need insurance immediately",
      script: `Hi [Agent/Broker Name],

Every home purchase and refinance requires insurance — and your clients often need it fast. I'd like to be the advisor you refer to. I specialize in quick turnaround, competitive quotes, and making the process seamless for your clients.

I'm happy to provide same-day quotes and coordinate directly with the lender. Would you be open to a trial referral to see how the process works?`,
    },
  ],

  /* ═══════════════════════════════════════════════════════════════ */
  /*  HEALTHCARE                                                     */
  /* ═══════════════════════════════════════════════════════════════ */
  healthcare: [
    {
      id: "hc-retainer",
      title: "Retainer Pitch — Concierge or Membership Model",
      context: "Establish a recurring membership fee for priority access and expanded services",
      script: `Hi [Patient/Client Name],

I'm introducing a membership program for patients who want a more proactive approach to their health. For [$ amount]/month, you'd receive [expanded appointment access, same-day scheduling, annual comprehensive assessment, direct communication channel].

This allows me to limit my patient panel and spend more time per visit — which means better care and no rushing. I'm only offering this to [X] patients. Would you like to learn more?`,
    },
    {
      id: "hc-pricing",
      title: "Pricing Restructure — Cash-Pay Service Package",
      context: "Offer a direct-pay package that reduces insurance dependency",
      script: `Hi [Patient/Client Name],

I'm now offering a direct-pay option for [service]. For [$ amount], the package includes [specific services] — no insurance claims, no surprise bills, no waiting for authorization. You know the exact cost upfront.

Many of my patients have found this simpler and more transparent than going through insurance for this type of care. Would you like me to send over the details?`,
    },
    {
      id: "hc-diversify",
      title: "Diversification Outreach — Corporate Wellness Program",
      context: "Sell health services to businesses rather than relying solely on individual patients",
      script: `Hi [HR Director / Business Owner],

I'm offering a corporate wellness program designed for teams of [X–Y] people. It includes [annual health assessments, on-site or virtual consultations, wellness workshops]. The goal is to reduce absenteeism and health-related productivity loss.

The program is [$ amount] per employee per year. I'd be happy to share a case study from a similar company. Would a brief overview be helpful?`,
    },
    {
      id: "hc-referral",
      title: "Referral Partnership Ask — Specialist or Allied Health Provider",
      context: "Build a two-way referral relationship with a complementary provider",
      script: `Hi [Provider Name],

I frequently see patients who need [their specialty], and I want to make sure I'm sending them to someone I trust. I'd like to establish a formal referral relationship — I refer to you for [their area], and when your patients need [your area], you think of me.

Would you be open to a brief meeting to align on how we'd coordinate patient care?`,
    },
  ],

  /* ═══════════════════════════════════════════════════════════════ */
  /*  LEGAL SERVICES                                                 */
  /* ═══════════════════════════════════════════════════════════════ */
  legal_services: [
    {
      id: "leg-retainer",
      title: "Retainer Pitch — General Counsel Retainer",
      context: "Offer ongoing legal advisory access on a monthly retainer",
      script: `Hi [Client Name],

Rather than engaging on a matter-by-matter basis, I'd like to propose a monthly retainer that gives you ongoing access to legal counsel. For [$ amount]/month, you'd have priority access for contract reviews, compliance questions, and strategic legal guidance — without needing to scope a new engagement every time.

Most of my retained clients find this saves them money over time because issues get addressed before they become expensive problems. Shall I send over the terms?`,
    },
    {
      id: "leg-pricing",
      title: "Pricing Restructure — Flat-Fee Legal Package",
      context: "Move from hourly billing to fixed-fee for predictable legal costs",
      script: `Hi [Client Name],

For [matter type], I'm offering a flat-fee arrangement at [$ amount]. This covers the full scope from start to finish — no hourly surprises, no uncertainty about the final bill.

I've found that flat fees create better alignment between us. I'm incentivized to work efficiently, and you get cost certainty. Want me to detail what's included?`,
    },
    {
      id: "leg-diversify",
      title: "Diversification Outreach — New Practice Area",
      context: "Expand into an adjacent legal specialty to reduce client concentration",
      script: `Hi [Contact Name],

In addition to my [current practice area] work, I've been building expertise in [new area] — the legal frameworks overlap significantly, and I've seen strong demand from existing clients. I'm now taking on new matters in this space.

If you or anyone in your network needs support with [new area], I'd welcome the conversation. Happy to do an initial assessment at no charge.`,
    },
    {
      id: "leg-referral",
      title: "Referral Partnership Ask — CPA or Financial Advisor",
      context: "Build a cross-referral relationship with professionals who serve the same clients",
      script: `Hi [CPA/Advisor Name],

Many of my clients need both legal and [tax/financial] guidance, especially around [business formation, estate planning, M&A]. I'd like to establish a referral partnership where we send clients to each other when the need arises.

This could be as simple as a quarterly check-in to share notes. Would you be interested in exploring this?`,
    },
  ],

  /* ═══════════════════════════════════════════════════════════════ */
  /*  CONSTRUCTION & TRADES                                          */
  /* ═══════════════════════════════════════════════════════════════ */
  construction_trades: [
    {
      id: "ct-retainer",
      title: "Retainer Pitch — Maintenance Contract",
      context: "Convert one-time project clients into recurring maintenance relationships",
      script: `Hi [Client Name],

Now that the [project] is complete, I'd like to offer a maintenance and priority service agreement. For [$ amount]/month, you get scheduled preventive maintenance, priority scheduling for any issues, and a guaranteed response time of [X hours].

This keeps your property in top condition and gives you a reliable contractor on call — no more searching for availability when something breaks. Would this be useful?`,
    },
    {
      id: "ct-renewal",
      title: "Contract Renewal — Multi-Phase Project",
      context: "Extend a completed project into additional phases",
      script: `Hi [Client Name],

Phase 1 is wrapping up on schedule. Based on what we've seen during construction, I'd recommend moving forward with Phase 2 sooner rather than later — [reason: weather window, material pricing, permitting timeline]. I've put together a proposal for the next phase.

Continuity with the same crew and subcontractors also means faster mobilization and fewer surprises. Shall I walk you through the scope and timeline?`,
    },
    {
      id: "ct-diversify",
      title: "Diversification Outreach — Commercial or Municipal Work",
      context: "Move beyond residential into commercial or public sector contracts",
      script: `Hi [Property Manager / Procurement Contact],

My company has [X years] of experience in [residential/specialty], and we're expanding into [commercial/municipal] projects. Our licensing, insurance, and crew capabilities are fully aligned for this type of work.

I'd like to be considered for upcoming [bid opportunities / preferred vendor lists]. Could I send over our qualifications and recent project portfolio?`,
    },
    {
      id: "ct-referral",
      title: "Referral Partnership Ask — Architect or General Contractor",
      context: "Build a referral pipeline with professionals who specify or manage trade work",
      script: `Hi [Architect/GC Name],

I specialize in [your trade] and I've been told my work speaks for itself. I'd like to be on your preferred subcontractor list for projects that need [your specialty]. I'm licensed, insured, and I show up on time.

Can I send over my portfolio and references? I'd love to be your go-to for [trade] on upcoming projects.`,
    },
  ],

  /* ═══════════════════════════════════════════════════════════════ */
  /*  HOSPITALITY & FOOD SERVICE                                     */
  /* ═══════════════════════════════════════════════════════════════ */
  hospitality_food_service: [
    {
      id: "hfs-retainer",
      title: "Retainer Pitch — Catering or Event Partnership",
      context: "Establish a recurring catering agreement with a venue or corporate client",
      script: `Hi [Event Manager / HR Contact],

I'd like to propose a standing catering partnership for your [monthly events / corporate meetings / venue programming]. Rather than quoting each event individually, we'd establish a preferred-vendor agreement with set pricing, priority scheduling, and a dedicated coordinator.

This simplifies your planning, locks in rates, and guarantees availability. Would you be interested in seeing a partnership proposal?`,
    },
    {
      id: "hfs-pricing",
      title: "Pricing Restructure — Subscription or Meal Plan",
      context: "Offer a prepaid subscription model for recurring customers",
      script: `Hi [Customer Name],

I'm introducing a monthly meal plan for regular customers like you. For [$ amount]/month, you get [X meals/credits per week] at a [X%] discount versus ordering individually. It's prepaid, simple, and you can customize each order.

This gives you reliable meals and gives me reliable revenue — it works for both of us. Want me to set you up for a trial month?`,
    },
    {
      id: "hfs-diversify",
      title: "Diversification Outreach — Wholesale or Retail Distribution",
      context: "Sell packaged products through retail channels beyond the restaurant",
      script: `Hi [Buyer / Store Manager],

I make [signature product — sauce, baked goods, prepared meals] that my restaurant customers consistently ask about. I'm now offering it in retail-ready packaging for stores like yours.

I can provide samples, shelf-stable packaging, and competitive wholesale pricing. Would you be willing to try a small initial order to see how it performs with your customers?`,
    },
    {
      id: "hfs-referral",
      title: "Referral Partnership Ask — Event Planner or Hotel",
      context: "Build a referral pipeline with professionals who book food service regularly",
      script: `Hi [Planner / Hotel Contact],

I know you're constantly coordinating food for events. I'd like to be your preferred catering partner — reliable, professional, and easy to work with. I specialize in [cuisine type / event scale].

I'm happy to do a tasting or a trial event at a reduced rate so you can experience the quality firsthand. Would that be worthwhile?`,
    },
  ],

  /* ═══════════════════════════════════════════════════════════════ */
  /*  TRANSPORTATION & LOGISTICS                                     */
  /* ═══════════════════════════════════════════════════════════════ */
  transportation_logistics: [
    {
      id: "tl-retainer",
      title: "Retainer Pitch — Dedicated Capacity Agreement",
      context: "Lock in recurring freight or delivery commitments",
      script: `Hi [Shipper / Logistics Manager],

Instead of booking lanes on the spot market each time, I'd like to propose a dedicated capacity agreement. I'd reserve [X trucks/routes] for your freight at a locked-in rate for [6/12 months], with guaranteed availability and priority loading.

This protects you from rate volatility and gives you reliability. I've prepared a rate sheet and capacity commitment — can we schedule a review?`,
    },
    {
      id: "tl-renewal",
      title: "Contract Renewal — Carrier Agreement Extension",
      context: "Renew a carrier or broker agreement with improved terms",
      script: `Hi [Client Name],

Our current agreement is up for renewal. Based on our on-time performance of [X%] and zero claims over the past [period], I'd like to propose a 12-month renewal with a [X%] volume increase and locked rates.

Continuity with a proven carrier reduces your operational risk. I've prepared the renewal terms — when can we walk through them?`,
    },
    {
      id: "tl-diversify",
      title: "Diversification Outreach — Last-Mile or Specialty Freight",
      context: "Expand into a new service category to reduce lane concentration",
      script: `Hi [Contact Name],

In addition to [current service — long-haul, LTL, etc.], I'm now offering [last-mile delivery / temperature-controlled freight / oversized loads]. I've invested in the equipment and certifications to serve this market.

If you have any upcoming needs in this area, I'd love to provide a competitive quote. No obligation — just want to show you what we can do.`,
    },
    {
      id: "tl-referral",
      title: "Referral Partnership Ask — Freight Broker or Warehouse",
      context: "Build a referral relationship with complementary logistics providers",
      script: `Hi [Broker / Warehouse Contact],

I think there's a natural partnership opportunity between us. When you need reliable carrier capacity for [your lane / specialty], I'd like to be your first call. And when my clients need [their service — warehousing, brokerage, drayage], I'd refer them to you.

Can we set up a quick call to discuss how this would work?`,
    },
  ],

  /* ═══════════════════════════════════════════════════════════════ */
  /*  MANUFACTURING                                                  */
  /* ═══════════════════════════════════════════════════════════════ */
  manufacturing: [
    {
      id: "mfg-retainer",
      title: "Retainer Pitch — Supply Agreement with Minimum Commitment",
      context: "Establish a recurring supply contract with volume minimums",
      script: `Hi [Buyer / Procurement Manager],

I'd like to propose a supply agreement with a minimum monthly commitment. For a guaranteed order of [X units/month], I can lock in your pricing at [$ amount per unit] for the next 12 months — protecting you from raw material price increases and ensuring priority production scheduling.

This gives you cost predictability and supply security. Want me to send over the terms?`,
    },
    {
      id: "mfg-renewal",
      title: "Contract Renewal — Purchase Order Extension",
      context: "Renew a production contract with improved terms based on track record",
      script: `Hi [Client Name],

Our current production agreement is coming up for renewal. Over the past [period], we've maintained a [X%] on-time delivery rate and [X%] quality acceptance rate. Based on this performance, I'd like to propose a 12-month renewal with a [X%] volume increase.

I've also identified a few process improvements that could reduce your per-unit cost by [X%]. Shall I put together a renewal proposal?`,
    },
    {
      id: "mfg-diversify",
      title: "Diversification Outreach — Private Label or OEM",
      context: "Offer manufacturing capacity for other brands to reduce single-client dependency",
      script: `Hi [Brand Owner / Product Company],

I have [manufacturing capability — CNC, injection molding, food production, etc.] with available capacity. I'm selectively offering private-label and OEM manufacturing for companies that need reliable production without building their own facility.

I handle [scope — production, packaging, quality control, shipping]. Would it be worth sharing our capabilities and sample pricing?`,
    },
    {
      id: "mfg-referral",
      title: "Referral Partnership Ask — Distributor or Reseller",
      context: "Build a distribution partnership to expand market reach",
      script: `Hi [Distributor Name],

I manufacture [product category] and I'm looking for distribution partners in [region / channel]. My products are [quality differentiator], and I offer competitive wholesale pricing with reliable lead times.

Would you be open to carrying our line on a trial basis? I can provide samples and marketing collateral to support the sell-through.`,
    },
  ],

  /* ═══════════════════════════════════════════════════════════════ */
  /*  EDUCATION                                                      */
  /* ═══════════════════════════════════════════════════════════════ */
  education: [
    {
      id: "edu-retainer",
      title: "Retainer Pitch — Ongoing Training or Tutoring Package",
      context: "Convert one-time students into recurring monthly engagements",
      script: `Hi [Student / Parent / HR Contact],

Rather than booking sessions individually, I'd like to offer a monthly package. For [$ amount]/month, you get [X sessions] per month with priority scheduling, progress tracking, and a customized curriculum.

Students on a monthly plan consistently outperform drop-in students because of the continuity and accountability. Would you like to try a month and see the difference?`,
    },
    {
      id: "edu-pricing",
      title: "Pricing Restructure — Cohort or Group Program",
      context: "Move from 1-on-1 to group delivery to scale income without scaling hours",
      script: `Hi [Prospective Student],

I'm launching a [X-week] group program on [topic]. It includes [live sessions, materials, community access, office hours]. The group format is [$ amount] per person — significantly less than 1-on-1, but with the added benefit of peer learning and accountability.

The next cohort starts [date]. Would you like me to reserve a spot?`,
    },
    {
      id: "edu-diversify",
      title: "Diversification Outreach — Corporate Training Contract",
      context: "Sell training services to organizations rather than individual students",
      script: `Hi [L&D Manager / HR Director],

I offer [training topic] programs designed for professional teams. The curriculum is built for working professionals and can be delivered on-site or virtually in [X-hour / X-day] formats.

I've trained teams at [reference companies or industries]. Would it be helpful if I shared a sample agenda and pricing for a pilot workshop?`,
    },
    {
      id: "edu-referral",
      title: "Referral Partnership Ask — School, Community Org, or Platform",
      context: "Build a referral channel through institutions that serve your target students",
      script: `Hi [School Counselor / Community Director / Platform Manager],

I specialize in [your educational focus] and I'd love to be a resource for your [students / members / users] who need additional support or advanced instruction. I offer [your format — tutoring, courses, workshops].

Could I provide you with materials to share when the need comes up? I'm happy to offer a [discount / free intro session] for referrals from your organization.`,
    },
  ],

  /* ═══════════════════════════════════════════════════════════════ */
  /*  NONPROFIT & PUBLIC SECTOR                                      */
  /* ═══════════════════════════════════════════════════════════════ */
  nonprofit_public_sector: [
    {
      id: "nps-retainer",
      title: "Retainer Pitch — Multi-Year Grant or Service Agreement",
      context: "Secure multi-year funding commitments for program stability",
      script: `Hi [Funder / Program Officer],

I'd like to propose a multi-year funding arrangement for [program name]. A 3-year commitment at [$ amount/year] would allow us to plan long-term, retain key staff, and deliver measurably stronger outcomes than year-to-year funding permits.

I've prepared a multi-year impact projection and budget. Would you be open to reviewing it?`,
    },
    {
      id: "nps-diversify",
      title: "Diversification Outreach — Earned Revenue Program",
      context: "Develop a fee-for-service or social enterprise revenue stream",
      script: `Hi [Board Member / Advisor],

I've been exploring an earned revenue model to complement our grant funding. The concept is [fee-for-service program, social enterprise, training-for-fee]. This would generate [estimated revenue] annually while directly advancing our mission.

I'd like to pilot it next quarter. Can we discuss the feasibility and any governance considerations at the next board meeting?`,
    },
    {
      id: "nps-renewal",
      title: "Contract Renewal — Government Contract Extension",
      context: "Renew a government or institutional service contract",
      script: `Hi [Contracting Officer / Program Director],

Our current contract for [service] expires [date]. Over the term, we've delivered [key metrics — people served, outcomes achieved, cost per unit]. Based on these results, I'd like to discuss a renewal and potential scope expansion.

I've prepared a performance summary and proposed renewal terms. When would be a good time to review?`,
    },
    {
      id: "nps-referral",
      title: "Referral Partnership Ask — Complementary Nonprofit or Agency",
      context: "Build a referral network with organizations serving overlapping populations",
      script: `Hi [Executive Director / Program Manager],

Our organizations serve [overlapping population], and I think there's an opportunity to strengthen referrals between us. When your clients need [your service], we'd love to be the recommended resource — and we'd do the same for [their service].

Could we set up a brief meeting to map out how our programs connect and formalize the referral pathway?`,
    },
  ],

  /* ═══════════════════════════════════════════════════════════════ */
  /*  AGRICULTURE                                                    */
  /* ═══════════════════════════════════════════════════════════════ */
  agriculture: [
    {
      id: "ag-retainer",
      title: "Retainer Pitch — CSA or Subscription Box",
      context: "Establish recurring revenue through direct-to-consumer subscriptions",
      script: `Hi [Customer Name],

I'm offering a seasonal subscription — [weekly/biweekly] deliveries of [product type] straight from the farm. For [$ amount]/month, you get [quantity/variety], picked fresh and delivered to [location/pickup point].

Subscriptions help me plan production and reduce waste, and you get the freshest product at a better price than retail. Want me to sign you up for the next season?`,
    },
    {
      id: "ag-renewal",
      title: "Contract Renewal — Wholesale Buyer Agreement",
      context: "Renew a supply agreement with a restaurant, grocer, or distributor",
      script: `Hi [Buyer Name],

Our current supply agreement is coming up for renewal. This season, I can offer [increased volume, new varieties, improved packaging] at the same pricing if we commit to a 12-month term. I've also invested in [cold chain, organic certification, etc.] that improves the product quality you'll receive.

Would you like to review the updated terms?`,
    },
    {
      id: "ag-diversify",
      title: "Diversification Outreach — Value-Added Products",
      context: "Sell processed or packaged goods to reduce raw commodity dependency",
      script: `Hi [Retailer / Distributor],

In addition to fresh [product], I'm now producing [value-added product — jams, dried goods, sauces, flour, etc.]. These are made from the same farm-fresh ingredients, shelf-stable, and retail-ready with professional labeling.

I can offer wholesale pricing and initial samples. Would you be interested in stocking a trial order?`,
    },
    {
      id: "ag-referral",
      title: "Referral Partnership Ask — Chef, Market, or Agritourism Operator",
      context: "Build a referral relationship to expand market access",
      script: `Hi [Chef / Market Manager / Tour Operator],

I grow [product] locally and I'd like to supply your [restaurant / market / farm tours]. My products are [organic, heritage variety, sustainably grown] — whatever matters most to your customers, I can speak to the provenance and quality.

Can I bring by some samples? I think your [customers / guests] would appreciate knowing exactly where their food comes from.`,
    },
  ],

  /* ═══════════════════════════════════════════════════════════════ */
  /*  ENERGY & UTILITIES                                             */
  /* ═══════════════════════════════════════════════════════════════ */
  energy_utilities: [
    {
      id: "eu-retainer",
      title: "Retainer Pitch — Ongoing Maintenance and Monitoring",
      context: "Establish recurring service contracts for energy systems",
      script: `Hi [Facility Manager / Property Owner],

I'd like to propose a maintenance and monitoring agreement for your [solar installation, HVAC system, energy infrastructure]. For [$ amount]/month, this includes [quarterly inspections, 24/7 monitoring, priority emergency response, parts warranty].

Proactive maintenance extends system life by [X years] on average and prevents costly emergency repairs. Want me to send over the agreement?`,
    },
    {
      id: "eu-renewal",
      title: "Contract Renewal — Service or Supply Agreement",
      context: "Renew an energy service contract with performance-based terms",
      script: `Hi [Client Name],

Our service agreement is up for renewal. Over the past [period], we've delivered [energy savings, uptime percentage, cost reduction]. I'd like to propose a renewal with performance guarantees — if we don't hit [target], the rate adjusts in your favor.

This shows our confidence in the service and aligns our incentives. Shall I draft the renewal with these terms?`,
    },
    {
      id: "eu-diversify",
      title: "Diversification Outreach — Residential or Commercial Expansion",
      context: "Expand into a new market segment within energy services",
      script: `Hi [Contact Name],

My company has been serving [current segment — commercial, industrial, residential] with [energy service]. We're now expanding into [new segment] — the technology and expertise are the same, but the market opportunity is significant.

I'd love to discuss potential projects in your portfolio. Could I share our capabilities and a few relevant case studies?`,
    },
    {
      id: "eu-referral",
      title: "Referral Partnership Ask — Contractor or Property Developer",
      context: "Build a referral pipeline with professionals who specify energy systems",
      script: `Hi [Contractor / Developer Name],

I specialize in [energy service — solar installation, energy audits, EV charging, etc.] and I'd like to be your go-to partner for projects that need this expertise. I handle everything from design to installation to ongoing maintenance.

Can I send over our project portfolio? I'd love to be included in your next relevant bid or spec.`,
    },
  ],

  /* ═══════════════════════════════════════════════════════════════ */
  /*  CREATOR / MEDIA (media_entertainment maps here)                */
  /* ═══════════════════════════════════════════════════════════════ */
  creator_media: [
    {
      id: "cm-retainer",
      title: "Retainer Pitch — Content or Creative Retainer",
      context: "Convert one-off projects into ongoing monthly creative relationships",
      script: `Hi [Client / Brand Name],

Rather than scoping each project individually, I'd like to offer a monthly creative retainer. For [$ amount]/month, you get [X deliverables — posts, videos, designs, articles] per month, with priority scheduling and a dedicated creative direction.

Retainer clients get my best thinking because I understand your brand deeply over time. The work gets better and faster the longer we work together. Interested in trying a quarter?`,
    },
    {
      id: "cm-pricing",
      title: "Pricing Restructure — Licensing and Royalties",
      context: "Shift from work-for-hire to licensing deals that generate passive income",
      script: `Hi [Client / Publisher / Platform],

For this project, I'd like to propose a licensing arrangement rather than a flat buyout. I'll create [the work] and license it to you for [specific use, duration, territory] at [$ amount] — with a [X%] royalty on [sales, streams, syndication].

This gives you full usage rights for your needs while allowing me to retain ownership. It's standard in [industry] and often results in a lower upfront cost for you. Shall I send over the licensing terms?`,
    },
    {
      id: "cm-diversify",
      title: "Diversification Outreach — Course or Digital Product",
      context: "Build a scalable revenue stream from expertise",
      script: `Hi [Audience / Newsletter / Community],

I'm launching [course / template pack / digital resource] — everything I've learned about [topic] packaged into a [format]. It's [$ amount] for [lifetime access / X modules / complete toolkit].

Early supporters get [discount / bonus / founding member access]. If you've ever wanted to learn [topic] from someone who does it professionally, this is it. [Link]`,
    },
    {
      id: "cm-referral",
      title: "Referral Partnership Ask — Agency or Complementary Creator",
      context: "Build a referral pipeline with professionals who need creative talent",
      script: `Hi [Agency / Creator Name],

I specialize in [your medium — video, design, writing, photography] and I'd love to be your go-to when you need [your specialty] for client projects or collaborations. I work fast, hit deadlines, and I'm easy to brief.

Could I send over my portfolio? And if you ever have overflow work or a project outside your wheelhouse, I'd welcome the referral — and reciprocate when the opportunity arises.`,
    },
  ],

  /* ═══════════════════════════════════════════════════════════════ */
  /*  ECOMMERCE / PRODUCT (retail_ecommerce maps here)               */
  /* ═══════════════════════════════════════════════════════════════ */
  ecommerce_product: [
    {
      id: "ec-retainer",
      title: "Retainer Pitch — Subscription or Auto-Replenishment",
      context: "Convert one-time buyers into recurring subscribers",
      script: `Hi [Customer Name],

Love your [product]? Never run out again. Subscribe for automatic delivery every [X weeks] and save [X%] on every order. You can pause, skip, or cancel anytime — no commitment.

Subscribers also get early access to new products and exclusive pricing. Want me to set up your subscription?`,
    },
    {
      id: "ec-pricing",
      title: "Pricing Restructure — Wholesale or Bulk Pricing",
      context: "Offer B2B wholesale pricing to diversify beyond direct-to-consumer",
      script: `Hi [Retailer / Buyer Name],

I'd like to offer [product] at wholesale pricing for your [store / platform / catalog]. My wholesale rates start at [$ amount] per unit for minimum orders of [X units], with [shipping terms].

The product has strong consumer demand — [social proof: reviews, sales figures, press]. Can I send over a wholesale line sheet and samples?`,
    },
    {
      id: "ec-diversify",
      title: "Diversification Outreach — New Sales Channel",
      context: "Expand from a single platform to additional marketplaces or retail",
      script: `Hi [Marketplace / Retail Buyer],

I currently sell [product] on [current channel] with strong performance — [X units/month, X-star reviews]. I'm looking to expand into [new channel] and I believe there's a strong fit with your customer base.

I can provide product samples, listing assets, and fulfillment from [your warehouse / 3PL]. Would you be open to a trial listing?`,
    },
    {
      id: "ec-referral",
      title: "Referral Partnership Ask — Influencer or Affiliate",
      context: "Build a referral and affiliate program to drive consistent new customer acquisition",
      script: `Hi [Creator / Influencer Name],

I think [product] would resonate with your audience. I'd like to offer you an affiliate partnership — you share [product] with your followers, and you earn [X%] on every sale through your link. No inventory, no risk.

I'll provide free product, custom discount codes, and creative assets. Would you be interested in trying it? Happy to send samples first.`,
    },
  ],
};

/* ------------------------------------------------------------------ */
/*  Helper — resolve sector key to scripts                             */
/* ------------------------------------------------------------------ */
/** Maps display names (from UI dropdowns) to ACTION_SCRIPTS keys */
const DISPLAY_TO_KEY: Record<string, string> = {
  "Real Estate": "real_estate",
  "Finance / Banking": "finance_banking",
  "Insurance": "insurance",
  "Technology": "technology",
  "Healthcare": "healthcare",
  "Legal Services": "legal_services",
  "Consulting / Professional Services": "consulting_professional_services",
  "Sales / Brokerage": "sales_brokerage",
  "Media / Entertainment": "creator_media",
  "Construction / Trades": "construction_trades",
  "Retail / E-Commerce": "ecommerce_product",
  "Hospitality / Food Service": "hospitality_food_service",
  "Transportation / Logistics": "transportation_logistics",
  "Manufacturing": "manufacturing",
  "Education": "education",
  "Nonprofit / Public Sector": "nonprofit_public_sector",
  "Agriculture": "agriculture",
  "Energy / Utilities": "energy_utilities",
};

export function getScriptsForSector(sectorKey: string): ActionScript[] {
  // Direct match (snake_case key)
  if (ACTION_SCRIPTS[sectorKey]) return ACTION_SCRIPTS[sectorKey];

  // Display name match (from UI)
  const resolved = DISPLAY_TO_KEY[sectorKey];
  if (resolved && ACTION_SCRIPTS[resolved]) return ACTION_SCRIPTS[resolved];

  // Mapped matches (alternate snake_case keys)
  const mapped: Record<string, string> = {
    media_entertainment: "creator_media",
    retail_ecommerce: "ecommerce_product",
  };
  if (mapped[sectorKey] && ACTION_SCRIPTS[mapped[sectorKey]]) {
    return ACTION_SCRIPTS[mapped[sectorKey]];
  }

  return [];
}
