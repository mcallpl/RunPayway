/* ------------------------------------------------------------------ */
/*  industry-vocabulary.ts                                             */
/*  Industry-specific vocabulary for every report surface.             */
/*  First 10 industries + default fallback.                            */
/*  NO GENERIC COPY. Every line speaks directly to that professional.  */
/* ------------------------------------------------------------------ */

import { normSector } from "@/lib/sector-map";

// ── Interface ──────────────────────────────────────────────────────

export interface IndustryVocabulary {
  industry_key: string;
  industry_label: string;

  // What generic concepts are called in this industry
  nouns: {
    recurring_revenue: string;
    top_client: string;
    pipeline: string;
    passive_income: string;
    forward_commitment: string;
    active_work: string;
  };

  // What stress scenarios mean in this industry
  scenarios: {
    lose_top_client: string;
    cant_work_90_days: string;
    market_slowdown: string;
    pipeline_dries_up: string;
  };

  // What each improvement action means in this industry
  actions: {
    convert_retainer: string;
    add_client: string;
    build_passive: string;
    lock_forward: string;
  };

  // Constraint explanations — what each weakness means for YOU in this industry
  constraints: Record<string, string>;

  // How your income behaves when this constraint is dominant
  behaviors: Record<string, string>;

  // What to do about each constraint — 3 specific directions
  improvements: Record<string, string[]>;

  // Opening context paragraph about this industry
  industry_context: string;

  // Benchmark data
  stats: { general: string; redAvg: number; greenAvg: number };

  // Self-check prompts for reassessment (6 dimensions)
  reassessment: {
    recurrence: string;
    concentration: string;
    diversification: string;
    forward: string;
    variability: string;
    labor: string;
  };

  // Industry-specific labels for each action (replaces generic labels)
  actionLabels: {
    convert_retainer: string;
    add_client: string;
    build_passive: string;
    lock_forward: string;
  };

  // Industry-specific micro-steps (3 steps per action)
  microSteps: {
    convert_retainer: string[];
    add_client: string[];
    build_passive: string[];
    lock_forward: string[];
  };

  // Context for Claude prompts via the worker
  worker_context: {
    pressure_framing: string;
    tailwind_framing: string;
    arrangement_types: string;
    peer_group_label: string;
  };
}

// ── Vocabulary Data ────────────────────────────────────────────────

const VOCABULARY: Record<string, IndustryVocabulary> = {

  /* ================================================================ */
  /*  1. REAL ESTATE                                                   */
  /* ================================================================ */
  real_estate: {
    industry_key: "real_estate",
    industry_label: "Real Estate",

    nouns: {
      recurring_revenue: "property management fees and rental portfolio income",
      top_client: "anchor listing client",
      pipeline: "active listings under contract",
      passive_income: "rental portfolio income",
      forward_commitment: "signed listing agreements",
      active_work: "showing properties and closing deals",
    },

    scenarios: {
      lose_top_client:
        "Your biggest referral source — the developer or investor who feeds you three to five deals a year — suddenly takes their business to another brokerage. That single relationship may represent 30-40% of your annual GCI, and replacing it means months of prospecting with no guaranteed closings. Without that anchor, your next quarter looks like open houses and cold calls with no contract pipeline to fall back on.",
      cant_work_90_days:
        "You break your ankle or get hit with a family emergency and cannot show properties, host open houses, or attend closings for 90 days. Every active listing either expires or gets reassigned to another agent in your office. Your pending deals may still close if they are far enough along, but your future pipeline goes to zero because nobody is generating new buyer or seller leads on your behalf.",
      market_slowdown:
        "Interest rates spike another 150 basis points and transaction volume drops 35% in your market. Sellers pull listings, buyers pause their searches, and days on market stretch past 90. Your commission income doesn't just dip — it craters, because you earn nothing until a deal actually closes, and closings are now months apart instead of weeks.",
      pipeline_dries_up:
        "You close a strong quarter and then realize you spent all your time servicing active deals instead of prospecting. Your CRM shows zero new listing appointments for the next 60 days, and your sphere-of-influence outreach has gone cold. The feast-or-famine cycle kicks in hard: you are about to enter a drought that could last two to three months before new contracts start flowing again.",
    },

    actions: {
      convert_retainer:
        "Build a systematic referral engine — a past-client nurture system, quarterly check-ins, and referral partnerships with lenders, title companies, and home inspectors. Most top-producing agents generate 60%+ of deals from repeat and referral business. This converts random deal flow into predictable, relationship-driven pipeline.",
      add_client:
        "Launch a geographic farming campaign in a specific subdivision or zip code where you don't currently have market share. Send monthly market reports, door-knock on weekends, and sponsor a neighborhood event. Within six months, a consistent farming effort typically yields two to four new listing appointments, diversifying your deal flow beyond your current referral network.",
      build_passive:
        "Acquire a small rental property — even a single duplex — and use it to generate monthly cash flow that is completely independent of your brokerage commissions. As an agent, you have market access and negotiation skills that give you an acquisition advantage. One paid-off duplex generating $2,400 per month in net rent replaces an entire commission check without requiring a single showing.",
      lock_forward:
        "Sign exclusive listing agreements with sellers 60-90 days before they plan to go to market. Offer a pre-marketing package — professional photos, staging consultation, and a coming-soon campaign — in exchange for a signed agreement today. This gives you contractual certainty on future commissions and lets you plan your quarter around deals that are locked in, not hoped for.",
    },

    actionLabels: {
      convert_retainer: "Build a systematic referral engine",
      add_client: "Farm a new neighborhood for listing appointments",
      build_passive: "Acquire a rental property for monthly cash flow",
      lock_forward: "Sign exclusive listing agreements before sellers go to market",
    },

    microSteps: {
      convert_retainer: ["List your 20 best past clients and referral partners", "Schedule quarterly touchpoints with each — calls, market updates, or coffee", "Ask each for one referral this month — the outreach script is below"],
      add_client: ["Pick a specific subdivision or zip code you want to own", "Commit to monthly mailers and weekend door-knocking for 6 months", "Sponsor one neighborhood event this quarter to build local visibility"],
      build_passive: ["Identify a below-market duplex or small multi-family in your area", "Run the numbers on net monthly cash flow after PITI and maintenance", "Make an offer this quarter — your agent access gives you a sourcing edge"],
      lock_forward: ["Identify sellers in your sphere who plan to list in the next 90 days", "Offer a pre-marketing package in exchange for a signed exclusive agreement now", "Lock in at least two listing agreements before the end of the month"],
    },

    constraints: {
      high_concentration:
        "You are dangerously dependent on a small number of referral sources or repeat clients. In real estate, losing your top relationship doesn't just cost you one deal — it costs you the entire pipeline of deals that relationship would have generated over the next 12-18 months. Your income is one phone call away from a cliff.",
      low_recurrence:
        "Almost all of your income resets to zero after each closing. Unlike agents who have built property management books or rental portfolios, you have to generate every dollar from scratch each month. When deals stop closing, your income stops immediately — there is no baseline to carry you through the gap.",
      low_diversification:
        "Your revenue comes from a single transaction type in a single market area. If that market segment softens — luxury slows down, new construction stalls, your zip code over-saturates with inventory — you have no fallback income stream. Agents who diversify across buyer, seller, rental, and commercial transactions weather downturns far better.",
      low_forward_visibility:
        "You have very little contractual certainty about what you will earn in the next 90 days. Most of your expected income depends on deals that haven't gone under contract yet, which means your financial planning is based on hope rather than signed agreements. One failed inspection or financing contingency can wipe out an entire month's projection.",
      high_variability:
        "Your monthly income swings wildly between closing months and drought months. A $25,000 commission check in March followed by $0 in April creates cash flow chaos that makes it impossible to budget, invest, or plan. This volatility is the number one reason otherwise successful agents feel financially insecure despite high annual earnings.",
      high_labor_dependence:
        "Every dollar you earn requires you to personally show up — to the listing appointment, the open house, the inspection, the closing table. There is no leverage in your current model. If you stop working, your income stops working. This is the most fragile structure in real estate and it caps your earning potential at however many hours you can physically work.",
      low_passive_income:
        "You have not built any income streams that pay you without active deal work. Most top-producing agents eventually layer in rental income, property management fees, or team overrides that create a financial floor. Without this, you are running a high-wire act with no safety net beneath your commission income.",
      low_continuity:
        "If you walked away from your business today, your income would stop almost immediately. You have no recurring management contracts, no rental portfolio, and no team structure that would continue generating revenue. Your business is worth exactly what you personally produce this month — nothing more.",
    },

    behaviors: {
      high_concentration:
        "Your income chart looks like a single peak and valley — massive checks when your anchor client transacts, followed by long dry spells. One relationship change reshapes your entire financial year, making you reactive rather than strategic about your business growth.",
      low_recurrence:
        "Your cash flow resets to zero on the first of every month. Each quarter feels like you are starting a new business from scratch, scrambling to fill the pipeline before your reserves run out. There is no compounding effect in your income — just a series of isolated transactions.",
      low_diversification:
        "When your specific market segment slows, you have nowhere to redirect your effort. Agents who only do residential resale in one zip code watch helplessly as market shifts drain their pipeline, while diversified agents pivot to rentals, commercial, or adjacent markets.",
      low_forward_visibility:
        "You cannot accurately predict your income 60 days out, which makes every financial commitment — a new hire, a marketing investment, a personal purchase — feel like a gamble. Your business operates in a constant fog where next month's revenue is genuinely unknowable.",
      high_variability:
        "Your bank account swings between abundance and scarcity on a 30-60 day cycle. The emotional toll of this roller coaster erodes your confidence and forces conservative decisions even during peak months, because you know the trough is always coming.",
      high_labor_dependence:
        "You are the bottleneck in your own business. Every listing presentation, showing, and negotiation requires your personal time, which means your income is capped by the number of hours in your week. Growth requires working more, not working smarter.",
      low_passive_income:
        "Between deals, your income is literally zero. Unlike agents who collect monthly management fees or rental checks, you experience genuine income gaps that force you to dip into savings or take on debt to cover personal expenses during slow periods.",
      low_continuity:
        "Your business has no enterprise value beyond your personal production. If you needed to take a year off, there would be nothing generating income in your absence. Every dollar of your net worth was earned by showing up, and that pattern has to continue indefinitely.",
    },

    improvements: {
      high_concentration: [
        "Build a systematic sphere-of-influence program that generates leads from 50+ contacts instead of relying on a handful of top referrers — monthly market updates, quarterly check-in calls, and annual client appreciation events.",
        "Partner with two to three non-competing professionals (mortgage brokers, financial planners, attorneys) who serve the same client base and establish formal cross-referral agreements with tracking.",
        "Launch a targeted digital marketing campaign in a new geographic farm area to build a second lead pipeline that is completely independent of your current referral network.",
      ],
      low_recurrence: [
        "Offer property management services to your investor clients — even managing five rental units at $200/month each creates $12,000 in annual recurring revenue that pays you regardless of closings.",
        "Create an annual home maintenance membership for past buyers — a quarterly check-in call, contractor referral service, and home value update for $50/month establishes ongoing revenue and generates repeat business referrals.",
        "Build a team and structure it so you earn an override on every transaction your agents close, turning their production into your recurring income stream.",
      ],
      low_diversification: [
        "Get your commercial real estate certification and begin marketing to small business owners who need retail or office space — this creates a transaction stream that moves on a completely different cycle than residential.",
        "Add rental placement services to your offerings, charging landlords a placement fee equal to one month's rent — this generates income even when the purchase market is frozen.",
        "Expand into an adjacent market area at least 20 miles from your current farm so that localized market downturns in one area don't eliminate your entire pipeline.",
      ],
      low_forward_visibility: [
        "Implement a pre-listing program where you sign exclusive agreements with sellers 60-90 days before they plan to list, giving you contractual certainty on upcoming commissions.",
        "Create a buyer pipeline tracker that scores leads by readiness (pre-approved, actively searching, just browsing) so you can accurately forecast which prospects will convert this quarter.",
        "Negotiate builder or developer partnerships where you are the assigned agent for upcoming phases, locking in future transactions months before they close.",
      ],
      high_variability: [
        "Establish a commission smoothing system — deposit every check into a holding account and pay yourself a fixed monthly salary, letting the surplus build a buffer that covers lean months.",
        "Add at least one income stream (property management, rental referrals, or team overrides) that pays monthly regardless of deal closings to stabilize your baseline.",
        "Schedule your prospecting activities on a rigid weekly calendar so pipeline generation continues even during busy closing months, preventing the feast-or-famine cycle.",
      ],
      high_labor_dependence: [
        "Hire a licensed showing assistant who can handle buyer showings and open houses, freeing your time for listing appointments and negotiations where your expertise matters most.",
        "Build a team of two to three buyer's agents who handle transactions under your brand, generating override income that doesn't require your personal presence at every deal.",
        "Create a referral network where you hand off out-of-area or lower-value leads to partner agents for a 25% referral fee — income from deals you never have to touch.",
      ],
      low_passive_income: [
        "Purchase your first rental property using your market expertise and agent access to find below-market deals — even one duplex generating $2,000/month in net rent transforms your financial stability.",
        "License your brand, systems, and training to agents in non-competing markets for a monthly franchise-style fee that scales without your direct involvement.",
        "Create and sell a digital course or coaching program teaching your prospecting methodology to agents in other markets — leveraging your expertise into scalable income.",
      ],
      low_continuity: [
        "Document and systematize every part of your business — from lead generation scripts to transaction checklists — so another agent could step in and run your operation if needed.",
        "Build a team with at least one agent capable of handling listings and closings independently, creating operational continuity that doesn't depend on your personal involvement.",
        "Establish recurring property management contracts with written agreements that would transfer to a successor or partner if you needed to step away from active sales.",
      ],
    },

    industry_context:
      "Real estate is one of the most volatile commission-based professions in the economy. Your income is earned deal by deal, with nothing flowing between closings unless you have deliberately built recurring streams like property management or rental income. Most agents experience dramatic income swings — a strong month followed by weeks of zero revenue — because the business rewards hustle over structure. The agents who achieve true financial durability are the ones who layer management fees, rental portfolio income, and team overrides on top of their transaction commissions, creating a baseline that carries them through market shifts and personal downtime.",

    stats: {
      general:
        "The median real estate agent earns $54,300 annually, but income distribution is severely skewed — the top 10% earn over $180,000 while the bottom 25% earn less than $28,000. Over 87% of new agents leave the industry within five years, primarily due to income instability.",
      redAvg: 31,
      greenAvg: 68,
    },

    reassessment: {
      recurrence:
        "Have you added any property management contracts, rental units, or team override arrangements since your last assessment that now generate monthly income without requiring a closing?",
      concentration:
        "Has the share of your GCI coming from your single largest referral source or client changed — have you added new lead sources, or has one relationship become even more dominant?",
      diversification:
        "Are you now earning income from transaction types or market areas you were not active in before — commercial, rentals, new construction, or a different geographic farm?",
      forward:
        "Do you currently have more or fewer signed listing agreements and pre-approved buyers in your pipeline compared to your last assessment?",
      variability:
        "Over the past six months, has the gap between your highest-earning month and lowest-earning month narrowed or widened?",
      labor:
        "Have you hired showing assistants, buyer's agents, or established referral partnerships that generate income without your personal presence at every transaction?",
    },

    worker_context: {
      pressure_framing:
        "This person is a real estate professional whose income depends entirely on closing transactions. Pressure points include deal drought between closings, concentration on a small number of referral sources, and zero income when not actively working. Frame risks in terms of listings lost, pipelines dried up, and commissions that vanish when the market shifts.",
      tailwind_framing:
        "Strengths in real estate manifest as a deep referral network, signed listing agreements that provide forward visibility, property management fees that pay monthly, and rental portfolio income that creates a financial floor. Frame improvements in terms of management contracts signed, new farm areas established, and team members generating override income.",
      arrangement_types:
        "Buyer agent commissions, seller listing commissions, property management monthly fees, rental placement fees, team overrides on agent production, referral fees from partner agents, and rental portfolio net income.",
      peer_group_label:
        "commission-based real estate professionals including residential agents, commercial brokers, and property managers",
    },
  },

  /* ================================================================ */
  /*  2. CONSULTING / PROFESSIONAL SERVICES                            */
  /* ================================================================ */
  consulting_professional_services: {
    industry_key: "consulting_professional_services",
    industry_label: "Consulting / Professional Services",

    nouns: {
      recurring_revenue: "advisory retainers and ongoing engagement fees",
      top_client: "anchor retainer client",
      pipeline: "signed engagements and active proposals",
      passive_income: "licensing fees and productized service revenue",
      forward_commitment: "executed engagement letters with defined scope",
      active_work: "delivering client engagements and advisory sessions",
    },

    scenarios: {
      lose_top_client:
        "Your largest retainer client — the one paying $8,000 to $15,000 per month for your fractional advisory role — notifies you they are bringing the function in-house or switching to a competitor. That single retainer may represent 40% or more of your monthly revenue, and there is no backfill sitting in your pipeline. Replacing a retainer relationship of that size typically takes three to six months of business development, during which your income is structurally impaired.",
      cant_work_90_days:
        "A health issue or personal emergency takes you completely offline for 90 days. Your retainer clients expect consistent availability and deliverables, and most engagement letters include performance clauses that allow termination for non-delivery. Within 30 days, clients start seeking alternatives. By day 60, your retainers are at serious risk of cancellation, and your project pipeline has gone dark because nobody is managing intake or proposals.",
      market_slowdown:
        "Corporate budgets tighten across the board and discretionary advisory spend gets cut first. Your clients delay project kick-offs, reduce retainer scope, or invoke pause clauses in their agreements. The consulting market is a leading indicator of economic sentiment — when CFOs get nervous, outside advisors are the first expense eliminated. Your pipeline of proposals stalls because prospects stop making buying decisions.",
      pipeline_dries_up:
        "You have been heads-down delivering on current engagements for months and realize your proposal pipeline is empty. No discovery calls scheduled, no RFPs in progress, no warm introductions pending. When your current projects conclude in 60-90 days, you face a revenue gap that could stretch for months while you rebuild your business development momentum from a standing start.",
    },

    actions: {
      convert_retainer:
        "Take your most engaged project clients and propose converting to a monthly advisory retainer — a fixed monthly fee for a defined number of hours, strategic access, and ongoing deliverables. Position it as continuity of the insight they have already invested in, not a new expense. A $5,000/month retainer with three clients creates $180,000 in annualized recurring revenue that renews automatically instead of requiring a new sale each quarter.",
      add_client:
        "Identify two adjacent industries or functional areas where your methodology applies and launch a targeted outreach campaign — publish thought leadership, speak at their industry conferences, and offer a diagnostic engagement as an entry point. Diversifying your client base beyond a single sector protects you from industry-specific budget cuts and gives you multiple referral networks feeding your pipeline.",
      build_passive:
        "Productize your most repeatable framework into a licensed methodology, online course, or subscription-based toolkit that clients can purchase without your direct delivery involvement. If you run the same diagnostic process for every new engagement, package that into a self-service product at $2,000-$5,000 per license. This creates revenue that scales without adding hours to your calendar.",
      lock_forward:
        "Structure your engagement letters with minimum commitment periods — six-month retainers with 90-day termination notice, or project fees paid 50% upfront with milestone-based billing. Every signed engagement with a forward commitment window gives you contractual certainty that improves your ability to plan hiring, investment, and personal financial decisions.",
    },

    actionLabels: {
      convert_retainer: "Convert your top client to a monthly retainer",
      add_client: "Land one new recurring engagement",
      build_passive: "Productize your expertise into a course or template",
      lock_forward: "Get written SOWs for next quarter's work",
    },

    microSteps: {
      convert_retainer: ["Identify your most engaged project client", "Draft a retainer proposal with a fixed monthly fee", "Send it this week — the script is ready below"],
      add_client: ["List 3 companies in an adjacent industry that need your expertise", "Send a personalized outreach to each this week", "Offer a free 30-minute diagnostic call"],
      build_passive: ["Identify your most repeatable framework or methodology", "Outline it as a 4-module online course or toolkit", "Set a 30-day launch deadline"],
      lock_forward: ["List all engagements ending in the next 90 days", "Draft renewal proposals with 6-month minimum terms", "Send them before the current contract winds down"],
    },

    constraints: {
      high_concentration:
        "A disproportionate share of your consulting revenue comes from one or two anchor clients. In professional services, this is especially dangerous because client budget decisions are made by individuals — one new VP or CFO can terminate your engagement overnight. Your entire financial trajectory is hostage to decisions made in someone else's boardroom.",
      low_recurrence:
        "You are selling your expertise project by project, which means each quarter requires closing new business just to maintain your current income level. Without retainer arrangements, your revenue resets at the end of every engagement. The most durable consulting practices are built on 60-70% retainer income, and yours is far below that threshold.",
      low_diversification:
        "Your client base is concentrated in a single industry or functional area. If that sector faces a downturn, regulatory shift, or budget realignment, every client in your portfolio is affected simultaneously. Consultants who serve multiple industries and functional areas can redirect capacity when one segment slows.",
      low_forward_visibility:
        "You lack signed engagement letters or retainer agreements that extend more than 30-60 days into the future. This means you are constantly uncertain about whether next quarter's revenue will materialize, which prevents you from making confident investment decisions about your practice — hiring subcontractors, upgrading tools, or expanding your service offerings.",
      high_variability:
        "Your monthly revenue fluctuates significantly based on project timing, client payment cycles, and engagement starts and stops. Consulting income is inherently lumpy — large project fees arrive in bursts while overhead costs remain steady. This variability makes it difficult to maintain consistent personal income and build reserves.",
      high_labor_dependence:
        "Every billable hour requires your personal expertise and presence. You are selling your brain, your time, and your reputation — none of which can be delegated without significant investment in team building. This creates a hard ceiling on your revenue and means any personal disruption immediately translates into lost income.",
      low_passive_income:
        "You have not created any income streams that generate revenue without your active involvement in client delivery. Top consulting practices build licensing programs, training products, and subscription tools that earn while the principal focuses on high-value engagements. Without these, your income is perfectly correlated with your available hours.",
      low_continuity:
        "Your practice has no structural continuity beyond your personal client relationships and delivery capabilities. If you stepped away for a year, clients would find other advisors, your brand would fade from consideration, and there would be no revenue-generating assets continuing to operate in your absence.",
    },

    behaviors: {
      high_concentration:
        "Your revenue timeline shows large plateaus during active retainer periods followed by sharp drops when a major client transitions. The emotional weight of knowing one client controls your financial stability creates risk-averse behavior that prevents you from setting appropriate boundaries or raising rates.",
      low_recurrence:
        "Each quarter feels like a cold start. You finish a project, celebrate briefly, then immediately face the anxiety of filling the next slot. This project-to-project existence consumes an enormous amount of mental energy on business development that could be spent on deeper client work or practice building.",
      low_diversification:
        "When your primary industry tightens budgets, your entire book of business contracts simultaneously. There is no counter-cyclical revenue stream to absorb the shock, and your specialized reputation in one sector actually works against you when you try to pivot quickly to adjacent markets.",
      low_forward_visibility:
        "You are unable to forecast revenue beyond the current engagement cycle, which forces short-term financial thinking. You defer investments in your practice, avoid hiring support, and maintain a scarcity mindset even during busy periods because you genuinely do not know if the work will continue.",
      high_variability:
        "Your cash flow alternates between months where multiple project payments arrive simultaneously and months where nothing lands. This oscillation makes it nearly impossible to set a consistent personal draw and forces you to maintain larger cash reserves than a more stable practice would require.",
      high_labor_dependence:
        "Your calendar is the binding constraint on your revenue. When you are fully utilized, you cannot take on additional work, and when you have capacity, you may not have demand. There is no mechanism in your current model to serve clients without personally delivering the work.",
      low_passive_income:
        "During gaps between engagements, your income drops to zero. There are no licensing fees, course sales, or subscription products generating background revenue while you focus on winning the next project. Your practice operates as a pure services business with no product component.",
      low_continuity:
        "Your consulting practice is essentially a personal brand attached to your individual capabilities. The moment you stop delivering, the revenue stops entirely. There is no associate team, no licensed methodology in market, and no recurring product revenue that would sustain income in your absence.",
    },

    improvements: {
      high_concentration: [
        "Set a hard rule that no single client can exceed 30% of your total revenue — actively pursue two to three new retainer relationships to dilute your dependency on your anchor client.",
        "Join two industry associations outside your current primary sector and begin building referral relationships that will generate engagement opportunities from multiple independent networks.",
        "Create a referral incentive program for past clients and professional contacts that systematically generates warm introductions across different industries and company sizes.",
      ],
      low_recurrence: [
        "Restructure your pricing to lead with retainer arrangements — offer a monthly advisory fee that includes a defined number of hours and strategic deliverables, positioning project work as add-on scope.",
        "Create an annual planning engagement that renews each fiscal year — a recurring strategic review that keeps you embedded in the client's decision-making process on a 12-month cycle.",
        "Develop a subscription-based research or benchmarking service that clients pay for monthly, providing industry insights that complement your advisory work and generate standalone recurring revenue.",
      ],
      low_diversification: [
        "Identify the two industries most adjacent to your current expertise and publish sector-specific thought leadership — white papers, webinars, and case studies — to establish credibility in those markets.",
        "Offer a reduced-rate diagnostic engagement to three prospects outside your primary industry, using these as case studies to prove your methodology transfers across sectors.",
        "Partner with consultants who specialize in industries you don't serve and establish mutual referral agreements, giving you access to their client base while you provide access to yours.",
      ],
      low_forward_visibility: [
        "Restructure all retainer agreements to require six-month minimum commitments with 90-day termination notice periods, giving you contractual certainty on at least 50% of your revenue.",
        "Implement a formal pipeline management system that tracks every prospect from initial contact through signed engagement letter, with probability-weighted revenue forecasting.",
        "Propose annual engagement frameworks to your top five clients — a 12-month advisory scope with quarterly milestone reviews — converting short-term projects into year-long commitments.",
      ],
      high_variability: [
        "Move all clients to monthly billing regardless of project structure — even fixed-fee projects should be billed in equal monthly installments to smooth your cash flow.",
        "Build a six-month operating reserve that covers all personal and business expenses, funded by setting aside 20% of every client payment until the reserve is fully established.",
        "Add at least two retainer clients whose payments arrive on different billing cycles, creating overlapping monthly revenue streams that reduce the impact of any single payment gap.",
      ],
      high_labor_dependence: [
        "Hire a senior associate or subcontractor who can deliver 60-70% of your standard engagement methodology under your supervision, freeing your time for business development and high-value strategic work.",
        "Productize your diagnostic framework into a software tool or guided assessment that clients can complete independently, with your advisory time focused on interpreting results rather than gathering data.",
        "Create a junior consultant development program where you train and certify other professionals in your methodology, earning a licensing fee on their engagements.",
      ],
      low_passive_income: [
        "Package your most repeatable framework into a digital course priced at $2,000-$5,000 and sell it through your professional network — even 10 sales per quarter generates $20,000-$50,000 in non-delivery revenue.",
        "License your proprietary assessment tools, templates, or methodologies to non-competing consultants in other markets for an annual fee.",
        "Write and publish a book that establishes your methodology as an industry standard, generating royalty income and serving as a lead generation engine for your advisory practice.",
      ],
      low_continuity: [
        "Document every process, framework, and deliverable template in a practice playbook that another consultant could use to serve your clients in your absence.",
        "Build a bench of two to three trusted subcontractors who know your clients, understand your methodology, and can step in for delivery continuity if you become unavailable.",
        "Structure your retainer agreements with clear deliverable specifications so that fulfillment can be transitioned to a qualified associate without renegotiating the client relationship.",
      ],
    },

    industry_context:
      "Consulting and professional services is fundamentally a trust-based business where your personal reputation is the product. Revenue arrives as project fees, retainers, and advisory arrangements — all of which depend on ongoing client relationships and your ability to continuously deliver value. The most common structural weakness is over-dependence on a small number of anchor clients, combined with purely labor-based delivery that creates a hard ceiling on revenue. The consultants who build genuinely durable practices are those who layer retainer income, productized offerings, and scalable methodologies on top of their personal advisory work.",

    stats: {
      general:
        "Independent consultants report median annual revenue of $120,000, with top performers exceeding $350,000. However, 65% of solo consultants experience at least one quarter per year with revenue below 50% of their average, driven by project timing gaps and client concentration risk.",
      redAvg: 34,
      greenAvg: 71,
    },

    reassessment: {
      recurrence:
        "Have you converted any project clients to monthly retainer arrangements, or added subscription-based services that now generate predictable monthly revenue?",
      concentration:
        "Has the percentage of your total revenue coming from your single largest client increased or decreased since your last assessment?",
      diversification:
        "Are you now serving clients in industries or functional areas that you were not active in previously?",
      forward:
        "Do you currently have more signed engagement letters and committed retainers extending into the next quarter than you did at your last assessment?",
      variability:
        "Over the last two quarters, has the spread between your highest-revenue month and lowest-revenue month narrowed?",
      labor:
        "Have you hired associates, engaged subcontractors, or launched any productized offerings that generate revenue without requiring your personal delivery hours?",
    },

    worker_context: {
      pressure_framing:
        "This person is a consultant or professional services provider whose income depends on active client engagements. Pressure points include retainer cancellations, project gaps between engagements, concentration on a small number of anchor clients, and pure labor-based delivery that caps revenue at available hours. Frame risks in terms of retainers lost, pipelines gone cold, and the constant restart cycle of project-based work.",
      tailwind_framing:
        "Strengths in consulting manifest as a diversified retainer book, signed engagement letters providing forward visibility, productized offerings generating non-delivery revenue, and a bench of associates who can deliver without the principal's direct involvement. Frame improvements in terms of retainers signed, methodologies licensed, and recurring revenue streams established.",
      arrangement_types:
        "Monthly advisory retainers, fixed-fee project engagements, hourly consulting arrangements, methodology licensing fees, productized assessment subscriptions, subcontractor overrides, and annual strategic planning retainers.",
      peer_group_label:
        "independent consultants, fractional executives, and professional services firms including management advisors, strategy consultants, and specialized practitioners",
    },
  },

  /* ================================================================ */
  /*  3. TECHNOLOGY                                                    */
  /* ================================================================ */
  technology: {
    industry_key: "technology",
    industry_label: "Technology",

    nouns: {
      recurring_revenue: "MRR from subscriptions and support contracts",
      top_client: "primary contract or enterprise customer",
      pipeline: "signed SOWs and committed development projects",
      passive_income: "SaaS subscription revenue and code licensing fees",
      forward_commitment: "executed statements of work and multi-year licenses",
      active_work: "writing code, shipping features, and delivering technical projects",
    },

    scenarios: {
      lose_top_client:
        "Your biggest client — the enterprise account paying $12,000 per month for your custom development and support — decides to bring development in-house or switches to an agency. That single contract may represent half your revenue, and the tech hiring market means it could take four to six months to replace a contract of that size. Your MRR drops by thousands overnight while your fixed costs remain unchanged.",
      cant_work_90_days:
        "A repetitive strain injury, burnout episode, or medical event forces you offline for 90 days. Your SaaS product continues collecting subscription revenue on autopilot, but your contract clients expect active delivery. Support tickets pile up, sprint commitments miss deadlines, and clients begin evaluating alternatives. The code you wrote keeps running, but the new code your clients are paying for does not get written.",
      market_slowdown:
        "Tech spending freezes as companies slash discretionary budgets and delay digital transformation projects. Your SaaS churn rate doubles as customers downgrade or cancel. Contract renewals get pushed to next quarter, and new SOWs require VP-level approval that adds 60-90 days to your sales cycle. Startups that were your early adopters start shutting down entirely, evaporating ARR you thought was secure.",
      pipeline_dries_up:
        "You have been deep in delivery mode for months — heads down building features and fulfilling contracts — and realize you have zero new prospects in your pipeline. Your last SOW was signed four months ago, and when your current engagements wrap up, there is nothing behind them. The tech contractor market rewards continuous networking, and going dark for a quarter means rebuilding momentum from scratch.",
    },

    actions: {
      convert_retainer:
        "For contractors and consultants: propose a managed services or ongoing support agreement to your current client — a monthly fee for maintenance, on-call support, and priority access. For employees: negotiate a longer employment term with retention bonus, severance provisions, or equity vesting that rewards staying.",
      add_client:
        "Target a specific vertical where your technical stack solves a known pain point and build a case study-driven outreach campaign. Attend their industry conference, publish a technical blog post about their domain problem, and offer a paid technical discovery engagement as an entry point. Winning one client in a new vertical opens a referral network within that entire industry.",
      build_passive:
        "Take the reusable components, integrations, or tools you have already built for client projects and package them as a standalone SaaS product or marketplace plugin. If you have built a custom Shopify integration three times, productize it at $49/month and market it to the thousands of stores with the same need. This converts sunk development time into recurring passive revenue.",
      lock_forward:
        "Structure all new SOWs with phased milestones and minimum engagement durations — a six-month development roadmap with monthly billing rather than a single deliverable contract. Include a maintenance phase after launch that extends the revenue window by 12 months. Every multi-phase SOW gives you forward revenue visibility that single-project contracts do not.",
    },

    actionLabels: {
      convert_retainer: "Secure ongoing engagement terms",
      add_client: "Win a client in a new vertical",
      build_passive: "Productize a reusable component into a SaaS tool",
      lock_forward: "Structure multi-phase SOWs with minimum durations",
    },

    microSteps: {
      convert_retainer: ["Review your current contract or employment agreement end date", "Draft a proposal for extended or recurring terms", "Schedule the conversation this week — framing notes are below"],
      add_client: ["Identify a vertical where your stack solves a known pain point", "Publish a case study or blog post about that domain problem", "Offer a paid technical discovery engagement as an entry point"],
      build_passive: ["Identify your most reusable component, integration, or internal tool", "Scope a standalone SaaS version with subscription pricing", "Set a 60-day MVP launch deadline"],
      lock_forward: ["List all current engagements and their end dates", "Draft renewal SOWs with 6-month minimums and maintenance phases", "Send them before the current scope wraps up"],
    },

    constraints: {
      high_concentration:
        "Your revenue is critically dependent on a single client or platform. In technology, client concentration is amplified by switching costs — when your anchor client leaves, you lose not just revenue but the domain expertise and codebase context you invested months building. Acquiring a replacement client at the same scale requires repeating that entire investment.",
      low_recurrence:
        "Your income comes primarily from one-time project deliveries rather than ongoing subscriptions or maintenance contracts. Each completed project leaves you searching for the next engagement with zero revenue bridge. The most resilient tech businesses generate 60% or more of their revenue from recurring sources, and yours falls well short of that benchmark.",
      low_diversification:
        "You are dependent on a single technology stack, platform, or client industry. If demand shifts — a framework falls out of favor, a platform changes its API, or an industry freezes tech spending — your entire skill-based revenue stream is threatened. Developers and tech contractors who serve multiple verticals with multiple technologies weather market shifts far more effectively.",
      low_forward_visibility:
        "You lack signed contracts or committed development roadmaps extending more than 30-60 days ahead. Without SOWs on the books, your forward revenue is speculative. This prevents you from hiring subcontractors, investing in product development, or making personal financial commitments with confidence.",
      high_variability:
        "Your monthly income swings significantly based on project delivery milestones, payment terms, and the gap between completed and newly started engagements. Technology contract work is inherently lumpy — large milestone payments arrive in bursts while living expenses demand consistency.",
      high_labor_dependence:
        "Every line of code, every deployment, and every client call requires your personal involvement. You are the entire technical team, and your revenue is capped at the number of billable hours you can sustain without burning out. This model has a hard ceiling that no amount of rate increases can fully overcome.",
      low_passive_income:
        "You have not converted any of your technical work into products, tools, or subscriptions that generate revenue independently of your billable hours. Top tech professionals build SaaS products, sell templates, license code, or earn from open-source sponsorships — income streams that compound while you sleep.",
      low_continuity:
        "If you stopped working today, your contract revenue would cease immediately and your SaaS products (if any) would slowly degrade without maintenance. You have no team, no documented systems, and no operational structure that could sustain revenue generation without your direct involvement.",
    },

    behaviors: {
      high_concentration:
        "Your revenue graph mirrors the billing cycle of your primary client — steady during active engagement, cliff-like when the contract ends or pauses. Every decision you make is filtered through the lens of retaining that client, which limits your ability to raise rates, set boundaries, or pursue better opportunities.",
      low_recurrence:
        "Your income arrives in project-shaped chunks with unpredictable gaps between them. The completion of each project brings a brief financial high followed by the anxiety of an empty pipeline. You spend nearly as much time selling the next project as you do delivering the current one.",
      low_diversification:
        "A technology shift or market change in your primary vertical creates existential risk. When the single industry or platform you depend on contracts, there is no alternate revenue stream to absorb the impact, and pivoting to a new technology or market takes months of learning curve investment.",
      low_forward_visibility:
        "You operate without a clear picture of where next quarter's revenue will come from. This uncertainty drives short-term decision making — accepting lower-rate projects to fill gaps, deferring product investment, and maintaining a survival mentality even during productive periods.",
      high_variability:
        "Your bank balance oscillates between milestone payment highs and inter-project lows. The cash flow unpredictability forces you to maintain large reserves that could otherwise be invested in product development or business growth, creating an opportunity cost that compounds over time.",
      high_labor_dependence:
        "You are simultaneously the architect, developer, tester, and project manager on every engagement. Any increase in revenue requires a proportional increase in your working hours, and you are already approaching the sustainable limit. Vacation, illness, or simply a bad week directly reduces your output and income.",
      low_passive_income:
        "Between contracts, your revenue is zero unless you have built products with subscription revenue. The code you have written for clients generates value for them indefinitely, but generates nothing for you after the project fee is paid. Your expertise creates compounding value for others but not for yourself.",
      low_continuity:
        "Your tech business is a one-person operation with no structural assets beyond your skills and client relationships. Code repositories, project documentation, and client contacts all live in your head or personal accounts. If you disappeared for a year, there would be nothing to sell, transfer, or continue.",
    },

    improvements: {
      high_concentration: [
        "Actively pursue two to three smaller contracts in different industries to reduce your largest client below 35% of total revenue — use platforms like Toptal, referral networks, or direct outreach to technical founders.",
        "Build a SaaS product or tool that generates revenue independent of any single client relationship, creating a revenue base that persists regardless of contract changes.",
        "Establish referral partnerships with agencies and consultancies that serve different markets, creating multiple independent deal flow channels.",
      ],
      low_recurrence: [
        "Offer every project client a post-launch maintenance and support agreement — a monthly fee covering bug fixes, security updates, and minor feature enhancements — turning one-time builds into ongoing revenue.",
        "Launch a subscription-based tool, plugin, or SaaS product built on components you have already developed for client projects, converting sunk development costs into recurring income.",
        "Create a managed hosting and monitoring package for applications you build, charging $500-$2,000/month per client for uptime guarantees and proactive maintenance.",
      ],
      low_diversification: [
        "Learn a complementary technology stack that serves a different market segment — if you only do web development, add mobile or data engineering to access an entirely different client pool.",
        "Target three distinct industry verticals with your existing skills, creating separate case studies and outreach strategies for each so that a downturn in one sector does not eliminate all your opportunities.",
        "Build expertise in an emerging technology area (AI integration, blockchain infrastructure, IoT) that opens entirely new client categories unavailable to generalist developers.",
      ],
      low_forward_visibility: [
        "Structure all proposals as phased engagements with six-month minimum scopes and monthly billing milestones, converting one-off projects into multi-month committed revenue.",
        "Negotiate annual maintenance contracts with all existing project clients — even at modest rates, these create a visible 12-month revenue baseline.",
        "Build a pipeline tracking system that scores prospects by commitment likelihood and expected start date, giving you data-driven visibility into future quarters.",
      ],
      high_variability: [
        "Move all clients to monthly billing regardless of project structure — negotiate equal monthly payments over the engagement term instead of milestone-based lump sums.",
        "Build your SaaS or subscription revenue to cover at least your personal fixed expenses, so contract income variability only affects discretionary spending and savings.",
        "Maintain a rolling six-month contract backlog by continuously pursuing new SOWs even during busy delivery periods, eliminating the feast-or-famine cycle.",
      ],
      high_labor_dependence: [
        "Hire a junior developer to handle routine maintenance, bug fixes, and basic feature work, freeing your hours for architecture, client relationships, and product development.",
        "Build internal tools and automation for your own delivery process — boilerplate generators, testing pipelines, deployment scripts — that multiply your output per hour.",
        "Create a development partnership with one or two trusted contractors who can white-label deliver work under your brand, allowing you to take on more engagements without increasing your personal coding hours.",
      ],
      low_passive_income: [
        "Identify the most reusable component or tool you have built across client projects and launch it as a standalone product — a SaaS app, API service, or marketplace plugin priced at $29-$99/month.",
        "Create technical course content or tutorials monetized through platforms like Udemy, Gumroad, or your own site — leveraging your expertise into scalable educational revenue.",
        "Open-source a popular tool with a premium tier or commercial license, building community adoption that converts into paid subscriptions for advanced features or enterprise support.",
      ],
      low_continuity: [
        "Document all client systems, deployment processes, and maintenance procedures in a shared knowledge base that another developer could use to take over operations.",
        "Build a small bench of subcontractors familiar with your clients and codebase who can maintain service continuity during any personal absence.",
        "Structure your SaaS products with automated billing, monitoring, and customer support systems that can operate for extended periods without manual intervention.",
      ],
    },

    industry_context:
      "Technology professionals operate in a market that rewards deep specialization but punishes narrow dependency. Whether you are shipping SaaS subscriptions, delivering custom development, or contracting for enterprise clients, your income structure reflects how well you have converted technical expertise into durable revenue. The critical difference between vulnerable and resilient tech incomes is the ratio of recurring revenue (MRR, maintenance contracts, licensing) to one-time project fees. Those who build products alongside their services create compounding income; those who only sell hours face a permanent ceiling.",

    stats: {
      general:
        "The average independent tech contractor earns $135,000-$185,000 annually, while SaaS founders with product-market fit often exceed $250,000. However, 58% of solo tech professionals report income gaps exceeding 45 days at least once per year between contracts.",
      redAvg: 33,
      greenAvg: 72,
    },

    reassessment: {
      recurrence:
        "Have you added maintenance contracts, SaaS subscriptions, or any recurring billing arrangements since your last assessment?",
      concentration:
        "Has the share of revenue from your single largest client or platform changed — have you onboarded new clients, or has one account grown more dominant?",
      diversification:
        "Are you now generating income from technology stacks, platforms, or client industries you were not serving before?",
      forward:
        "Do you have more or fewer signed SOWs and committed engagements on the books compared to your last assessment?",
      variability:
        "Has the gap between your highest and lowest billing months over the past two quarters narrowed or widened?",
      labor:
        "Have you launched products, hired subcontractors, or built automation that generates revenue without your direct billable hours?",
    },

    worker_context: {
      pressure_framing:
        "This person is a technology professional whose income comes from contracts, project deliveries, and/or SaaS subscriptions. Pressure points include single-client dependency, project gaps between engagements, pure labor-based delivery with no product leverage, and platform or stack concentration risk. Frame risks in terms of contracts lost, MRR churn, and the ceiling imposed by billable hours.",
      tailwind_framing:
        "Strengths in technology manifest as growing MRR from SaaS products, long-term maintenance contracts, diversified client industries, and automation that multiplies output. Frame improvements in terms of MRR added, contracts extended, products launched, and delivery capacity expanded through tooling or team.",
      arrangement_types:
        "Fixed-price project contracts, time-and-materials engagements, monthly maintenance and support retainers, SaaS subscription revenue, code and API licensing fees, marketplace plugin revenue, and technology partnership commissions.",
      peer_group_label:
        "technology professionals including SaaS founders, freelance developers, technical consultants, and software contractors",
    },
  },

  /* ================================================================ */
  /*  4. HEALTHCARE                                                    */
  /* ================================================================ */
  healthcare: {
    industry_key: "healthcare",
    industry_label: "Healthcare",

    nouns: {
      recurring_revenue: "panel patient revenue and membership practice fees",
      top_client: "largest payer contract or referral source",
      pipeline: "scheduled patient appointments and authorized treatments",
      passive_income: "direct-pay membership dues and telehealth subscription fees",
      forward_commitment: "authorized treatment plans and booked patient schedules",
      active_work: "seeing patients, performing procedures, and delivering clinical care",
    },

    scenarios: {
      lose_top_client:
        "Your largest insurance payer — the carrier whose patients make up 35-45% of your panel — terminates your network participation or dramatically cuts reimbursement rates. Overnight, you either lose access to those patients entirely or must decide whether to continue treating them at rates that no longer cover your overhead. Rebuilding that patient volume with a different payer mix takes 12-18 months of credentialing, marketing, and relationship building.",
      cant_work_90_days:
        "A surgical complication, illness, or personal emergency takes you out of clinical practice for 90 days. Your scheduled patients must be referred out or rescheduled, your staff continues drawing salaries, and your office lease and equipment payments do not pause. Membership patients may tolerate a temporary substitute, but fee-for-service volume drops to zero immediately. Your overhead continues burning at $30,000-$80,000 per month with no clinical revenue to cover it.",
      market_slowdown:
        "A reimbursement model change — a shift from fee-for-service to value-based care, or a significant Medicare rate reduction — fundamentally alters the economics of your practice. Procedures that were profitable at previous rates now generate marginal or negative returns, and the volume adjustments needed to maintain revenue require seeing 20-30% more patients per week. Your entire practice model needs restructuring, but patients still expect the same level of care.",
      pipeline_dries_up:
        "Your referral sources — the primary care physicians, specialists, or hospital systems that send you patients — shift their referral patterns. A new specialist joins the hospital network, a referring physician retires, or an insurance carrier steers patients to a preferred provider. Your appointment schedule, which was booked three weeks out, now has same-day openings. Patient acquisition in healthcare is slow, and rebuilding referral relationships takes months of outreach and relationship cultivation.",
    },

    actions: {
      convert_retainer:
        "Negotiate a multi-year employment agreement or contract with guaranteed base compensation, severance provisions, and non-compete clarity. For independent practitioners, secure annual service agreements with healthcare systems or group practices that commit to minimum volume.",
      add_client:
        "Establish referral relationships with three to five new physician practices or healthcare organizations outside your current referral network. Offer to present at their staff meetings, provide same-day consultation reports, and create a seamless referral experience. Diversifying your referral sources beyond one hospital system or physician group protects your patient volume from single-source dependency.",
      build_passive:
        "Develop a telehealth wellness program or chronic disease management subscription that patients can access remotely — automated check-ins, educational content, and scheduled virtual visits for a monthly fee. This creates scalable revenue that is not limited by your physical clinic capacity and continues generating income even when you are not in the office seeing patients face-to-face.",
      lock_forward:
        "Structure treatment plans with pre-authorized multi-visit protocols — physical therapy series, post-surgical follow-ups, or chronic care management programs that book patients for six to twelve visits in advance. This creates forward visibility on your schedule and revenue, allowing you to staff and plan your practice with confidence about upcoming volume.",
    },

    actionLabels: {
      convert_retainer: "Secure a multi-year contract with guaranteed terms",
      add_client: "Build referral relationships with new physician practices",
      build_passive: "Launch a telehealth or chronic care subscription",
      lock_forward: "Pre-authorize multi-visit treatment protocols",
    },

    microSteps: {
      convert_retainer: ["Review your current contract's expiration date and renewal terms", "Research market rates for your specialty in your region", "Request a meeting with your administrator to discuss a multi-year commitment"],
      add_client: ["Identify 3-5 physician practices outside your current referral network", "Offer to present at their next staff meeting on a relevant clinical topic", "Follow up with same-day consultation reports to demonstrate your responsiveness"],
      build_passive: ["Identify your most common patient education or monitoring workflow", "Scope a telehealth subscription with automated check-ins and virtual visits", "Pilot it with 20 existing patients this quarter"],
      lock_forward: ["Review which treatment plans could be structured as multi-visit protocols", "Pre-authorize 6-12 visit series for your most common conditions", "Book those visits in advance to create schedule and revenue visibility"],
    },

    constraints: {
      high_concentration:
        "A large share of your patient revenue comes from a single insurance carrier or referral source. In healthcare, payer concentration is uniquely dangerous because carriers make unilateral decisions about network participation, reimbursement rates, and prior authorization requirements. One administrative decision made in an insurer's corporate office can reshape your entire revenue structure.",
      low_recurrence:
        "Your income depends on individual patient encounters rather than ongoing care relationships with predictable monthly revenue. Each visit is a separate billing event, and gaps between appointments translate directly into revenue gaps. Practices that build membership programs or chronic care management contracts create a financial floor that pure fee-for-service models lack.",
      low_diversification:
        "Your revenue is concentrated in a narrow set of procedure codes, a single clinical specialty, or a specific patient demographic. If reimbursement rates change for those services or your patient population shifts, your revenue is disproportionately affected. Clinicians who offer multiple service lines across different payer types build more resilient practices.",
      low_forward_visibility:
        "Your schedule beyond the next two to three weeks is uncertain, and you lack committed treatment plans or membership enrollments that guarantee future revenue. Healthcare is one of the few professions where next month's income depends on patients choosing to book appointments, insurance companies choosing to authorize care, and referral sources choosing to send patients your way.",
      high_variability:
        "Your monthly collections fluctuate based on patient volume, payer mix, claims processing delays, and seasonal patterns. Insurance reimbursement arrives 30-90 days after the visit, creating cash flow timing that disconnects your work from your compensation. High-revenue months are followed by collection delays and seasonal dips that create financial unpredictability.",
      high_labor_dependence:
        "Every dollar of clinical revenue requires you to be physically present — examining patients, performing procedures, and documenting encounters. Your income is perfectly correlated with your chair time, and there is a hard ceiling on how many patients you can safely see in a day. This makes your revenue fundamentally limited by your physical and emotional capacity.",
      low_passive_income:
        "You have not created any income streams beyond direct clinical care. Top clinicians build membership practices, telehealth programs, clinical education products, or medically-supervised wellness services that generate revenue without requiring one-on-one patient encounters. Without these, every dollar requires your clinical presence.",
      low_continuity:
        "If you were unable to practice for an extended period, your patient panel would scatter to other providers, your staff would need to be laid off or reassigned, and your practice revenue would cease entirely. Medical practices without associate providers or recurring membership revenue have zero continuity beyond the principal clinician's active availability.",
    },

    behaviors: {
      high_concentration:
        "Your revenue is effectively controlled by one payer's fee schedule and authorization decisions. When that carrier adjusts rates, changes formularies, or modifies authorization requirements, your practice revenue shifts immediately — and you have no negotiating leverage because you cannot afford to lose access to their patient volume.",
      low_recurrence:
        "Your cash flow tracks directly to your appointment volume — full schedules mean strong months, cancellation waves mean weak months. There is no monthly baseline revenue arriving regardless of patient visits, which means every snow day, holiday week, and flu season creates a measurable revenue dip.",
      low_diversification:
        "When reimbursement rates change for your primary procedure codes, your entire practice economics shift. You cannot pivot to a different service line quickly because clinical services require credentialing, training, and equipment investment that takes months to establish.",
      low_forward_visibility:
        "Your production forecast depends on patient behavior you cannot control — whether they schedule, whether they show up, and whether their insurance authorizes the treatment. This makes accurate revenue projections nearly impossible beyond a two-week window.",
      high_variability:
        "Your collections vary significantly month to month based on payer mix, claims denial rates, and patient payment behavior. The lag between service delivery and payment receipt creates cash flow timing mismatches that make it difficult to cover fixed overhead costs consistently.",
      high_labor_dependence:
        "You are the clinical bottleneck — every patient interaction requires your licensure, expertise, and physical presence. Expanding revenue means seeing more patients per day, which has both practical and ethical limits. You cannot delegate clinical decision-making, and the emotional toll of maximum patient loads contributes to burnout.",
      low_passive_income:
        "Between your scheduled patients, your income is zero. There are no membership dues, educational product sales, or subscription wellness programs generating revenue in the background. Your practice is a pure service business with no scalable component.",
      low_continuity:
        "Your practice is functionally you. Patients have relationships with you, not your office. If you stepped away, most patients would seek care elsewhere within weeks, and the practice would have no revenue-generating capacity without your active clinical involvement.",
    },

    improvements: {
      high_concentration: [
        "Credential with at least two additional insurance carriers and actively market to patients covered by those payers, reducing any single carrier below 30% of your revenue mix.",
        "Build direct-pay service lines — cash-pay procedures, wellness memberships, or concierge offerings — that create revenue completely independent of insurance carrier relationships.",
        "Establish referral relationships with physician groups and organizations affiliated with different hospital systems, diversifying your patient acquisition beyond a single referral network.",
      ],
      low_recurrence: [
        "Launch a direct primary care or concierge membership where patients pay a fixed monthly fee for enhanced access, creating a predictable revenue base independent of insurance billing cycles.",
        "Implement chronic care management (CCM) billing for eligible patients — Medicare and many commercial payers reimburse monthly CCM fees that create recurring revenue from your existing panel.",
        "Develop a patient wellness program with monthly subscription pricing for services like nutritional counseling, health coaching, or preventive screenings.",
      ],
      low_diversification: [
        "Add complementary clinical services that serve your existing patient base but bill under different procedure codes — if you do orthopedic surgery, add physical therapy and sports medicine evaluations.",
        "Develop a telehealth service line for follow-ups, chronic disease management, or mental health support that attracts patients outside your geographic area.",
        "Create a medical aesthetics, functional medicine, or wellness service line that operates on a cash-pay basis, completely separate from your insurance-dependent clinical revenue.",
      ],
      low_forward_visibility: [
        "Pre-schedule all chronic disease patients for quarterly visits at the time of their current appointment, building a booked schedule three to six months in advance.",
        "Launch treatment protocols that include multi-visit series — physical therapy programs, post-surgical follow-up schedules, or wellness plans — that pre-book future revenue on your calendar.",
        "Grow your membership patient panel to represent at least 20% of your revenue, creating a contractually committed monthly income floor visible 12 months ahead.",
      ],
      high_variability: [
        "Build membership and chronic care management revenue to cover at least your fixed overhead costs, so insurance reimbursement variability only affects your discretionary income.",
        "Negotiate faster payment terms with your top payers or switch to a billing service that offers advance funding on submitted claims to reduce the lag between service and collection.",
        "Diversify your payer mix across commercial, Medicare, Medicaid, and direct-pay patients so that seasonal patterns in one payer type are offset by others.",
      ],
      high_labor_dependence: [
        "Hire a physician assistant or nurse practitioner who can see lower-acuity patients independently under your supervision, expanding your practice capacity without requiring your presence in every exam room.",
        "Build a telehealth and remote monitoring program that allows clinical team members to manage routine follow-ups, freeing your time for complex cases and procedures.",
        "Develop group visit programs for chronic conditions like diabetes management or weight loss, allowing you to serve eight to twelve patients in the time typically allocated for two individual visits.",
      ],
      low_passive_income: [
        "Create a patient education course or digital health program that patients can purchase and complete online — leveraging your clinical expertise into a product that scales without additional clinical hours.",
        "Launch a medically-supervised supplement, skincare, or wellness product line that patients can purchase through your practice, generating product revenue alongside clinical services.",
        "Develop clinical training or continuing education content for other healthcare professionals, monetized through subscriptions or course fees.",
      ],
      low_continuity: [
        "Hire at least one associate provider who can maintain patient care and generate revenue if you are unable to practice, ensuring operational continuity beyond your personal availability.",
        "Build your membership program with practice-level (not provider-level) agreements so that membership revenue continues even if the treating provider changes.",
        "Document clinical protocols, patient management workflows, and operational procedures so that a covering provider could maintain your standard of care without your direct oversight.",
      ],
    },

    industry_context:
      "Healthcare professionals face a unique structural challenge: your clinical training and licensure create enormous earning power, but that power is almost entirely dependent on your physical presence in the exam room. Insurance reimbursement models add another layer of fragility — rates are set by carriers, not by you, and changes in payer policy can restructure your economics overnight. The clinicians who build financially durable practices are those who layer membership revenue, telehealth subscriptions, and multi-provider capacity on top of their fee-for-service production, creating income that persists even when patient volume fluctuates or reimbursement models shift.",

    stats: {
      general:
        "Physician median compensation ranges from $260,000 (primary care) to $550,000+ (surgical specialties), while therapists and clinicians average $85,000-$140,000. However, 42% of physicians in private practice report that a single payer represents more than 35% of their revenue, creating significant concentration risk.",
      redAvg: 36,
      greenAvg: 69,
    },

    reassessment: {
      recurrence:
        "Have you enrolled new patients in a membership or concierge program, added chronic care management billing, or established any recurring monthly revenue since your last assessment?",
      concentration:
        "Has the percentage of your collections from your single largest insurance payer or referral source changed significantly?",
      diversification:
        "Are you now offering clinical services, payer types, or treatment modalities that you were not providing at your last assessment?",
      forward:
        "Is your patient schedule booked further in advance than it was previously — do you have more pre-scheduled visits and committed treatment plans on the books?",
      variability:
        "Over the past six months, has the spread between your highest-collection month and lowest-collection month narrowed or widened?",
      labor:
        "Have you hired associate providers, launched telehealth services, or created any revenue streams that do not require your direct clinical presence?",
    },

    worker_context: {
      pressure_framing:
        "This person is a healthcare professional whose income depends on clinical encounters and insurance reimbursements. Pressure points include payer concentration, reimbursement rate changes, complete labor dependence on personal clinical availability, and low forward visibility on patient volume. Frame risks in terms of payer contract losses, schedule gaps, overhead costs that continue regardless of patient volume, and burnout from maximum clinical loads.",
      tailwind_framing:
        "Strengths in healthcare manifest as a diversified payer mix, growing membership patient panels, associate providers generating independent revenue, and telehealth services that scale beyond physical clinic capacity. Frame improvements in terms of membership enrollments, new payer credentials, associate providers hired, and recurring revenue streams established.",
      arrangement_types:
        "Fee-for-service insurance reimbursements, direct-pay membership fees, concierge practice dues, chronic care management monthly billing, telehealth subscription fees, procedure-based cash-pay services, and group visit program revenue.",
      peer_group_label:
        "healthcare professionals including physicians, therapists, nurse practitioners, and clinical practice owners",
    },
  },

  /* ================================================================ */
  /*  5. LEGAL SERVICES                                                */
  /* ================================================================ */
  legal_services: {
    industry_key: "legal_services",
    industry_label: "Legal Services",

    nouns: {
      recurring_revenue: "ongoing client retainers and matter-based monthly billing",
      top_client: "largest billing client or anchor retainer relationship",
      pipeline: "active cases and matters in progress",
      passive_income: "portfolio-based legal service subscriptions and of-counsel fees",
      forward_commitment: "signed engagement letters and retained matter agreements",
      active_work: "drafting, advising, appearing in court, and managing client matters",
    },

    scenarios: {
      lose_top_client:
        "Your anchor client — the company paying $15,000 to $30,000 per month for ongoing general counsel work — hires an in-house attorney or switches firms. That single relationship represents a substantial portion of your billings, and replacing a legal client of that scale requires months of relationship building, conflicts checks, and trust establishment. The legal market rewards loyalty and incumbency, so new client acquisition is inherently slow.",
      cant_work_90_days:
        "A health emergency or personal crisis takes you out of practice for 90 days. Court deadlines do not pause — motions come due, discovery responses are required, and hearings proceed on schedule. Your active cases must be covered by colleagues or co-counsel, potentially at a cost to your client relationships and professional reputation. Clients who need responsive counsel will begin seeking it elsewhere before you return.",
      market_slowdown:
        "A recession reduces transaction volume across your practice areas — M&A activity drops, real estate closings stall, and businesses defer discretionary legal work. Litigation may increase over time, but the immediate effect is a sharp decline in corporate and transactional billings. Clients who previously approved premium rates now push back aggressively or delay engagement on new matters.",
      pipeline_dries_up:
        "Your current matters are resolving faster than new ones are coming in. Cases settle, transactions close, and regulatory projects conclude — but your business development efforts have been dormant while you were focused on active work. Your billable hours drop from full utilization to 60% or less, and the realization hits that building a legal pipeline takes three to six months of networking, writing, and relationship cultivation.",
    },

    actions: {
      convert_retainer:
        "Propose a fixed monthly retainer to your top five corporate clients — a set fee for defined legal services each month (contract review, regulatory guidance, employment matters) that replaces unpredictable hourly billing with stable monthly revenue. A $5,000/month retainer with five clients creates $300,000 in annualized recurring revenue. Frame it as budget predictability for them and income stability for you.",
      add_client:
        "Join two industry organizations where your ideal clients gather (not lawyer organizations — client organizations) and commit to publishing one article per quarter in their trade publications. Attend their events, speak on panels about legal risks in their industry, and build relationships with non-lawyers who control legal spending decisions. Every relationship takes 12-18 months to mature, so start planting now.",
      build_passive:
        "Create a legal compliance subscription service for small businesses in a specific sector — a monthly fee for template documents, regulatory updates, and quarterly compliance check-ins that can be delivered by paralegals under your supervision. This generates scalable revenue from clients who need legal guidance but cannot afford full hourly engagement, and it creates a referral pipeline for higher-value matters.",
      lock_forward:
        "Structure all new engagement letters with minimum commitment periods and advance retainer deposits. For ongoing advisory relationships, propose annual engagement frameworks with quarterly scope reviews and 90-day termination notice requirements. For litigation, secure funding commitments for the full anticipated case lifecycle rather than phase-by-phase approval.",
    },

    actionLabels: {
      convert_retainer: "Convert your top corporate client to a monthly retainer",
      add_client: "Build relationships in a new client industry",
      build_passive: "Launch a legal compliance subscription for small businesses",
      lock_forward: "Structure engagement letters with minimum commitment periods",
    },

    microSteps: {
      convert_retainer: ["Identify your most engaged corporate client billing hourly", "Draft a fixed monthly retainer proposal with defined scope", "Present it this week as budget predictability for them and stability for you"],
      add_client: ["Join two industry organizations where your ideal clients gather", "Commit to publishing one article this quarter in their trade publication", "Attend their next event and build three new relationships"],
      build_passive: ["Identify your most repeatable legal workflow — compliance reviews, template packages, or regulatory updates", "Package it as a monthly subscription for small businesses in a specific sector", "Launch a pilot with 10 businesses this quarter"],
      lock_forward: ["Review all current engagement letters for commitment terms", "Add minimum 6-month commitment periods and 90-day termination notice to new letters", "Propose annual engagement frameworks to your top 5 clients"],
    },

    constraints: {
      high_concentration:
        "Your billings are dominated by a small number of clients, and in legal services this concentration carries reputational and financial risk simultaneously. Losing your top client does not just reduce revenue — it may signal to the market that something went wrong, making replacement even harder. Your financial stability depends on decisions made by a handful of business owners and general counsel you do not control.",
      low_recurrence:
        "Your revenue is tied to specific matters that have defined endpoints — cases resolve, transactions close, and projects conclude. Without evergreen retainer arrangements, every matter completion leaves a revenue gap that must be filled through new business development. The most stable law practices maintain 50-60% of revenue on retainer, and yours is well below that threshold.",
      low_diversification:
        "Your practice is concentrated in a narrow set of legal disciplines or a single client industry. If regulatory changes reduce demand for your specialty, or if your primary industry enters a downturn, your entire book of business is affected simultaneously. Attorneys who practice across multiple areas and serve diverse industries weather market shifts with far less disruption.",
      low_forward_visibility:
        "You lack signed engagement letters or committed retainer agreements extending beyond your current active matters. Legal work often arrives in unpredictable bursts — a lawsuit is filed, a deal appears, a regulatory issue emerges — making forward revenue planning difficult. Without structural commitments, your financial planning is based on historical patterns rather than contractual certainty.",
      high_variability:
        "Your monthly billings and collections fluctuate significantly based on case activity, client payment behavior, and matter timing. Large contingency fee payments create dramatic income spikes followed by months of lower billings. This variability makes it difficult to maintain consistent partner draws or associate salaries.",
      high_labor_dependence:
        "Every brief, memo, court appearance, and client call requires your direct professional involvement. Your bar license, subject matter expertise, and client trust are the product, and none of them can be fully delegated. This creates a hard ceiling on your billings and makes every personal disruption an immediate revenue event.",
      low_passive_income:
        "You have not developed any income streams that produce revenue without your active legal work. Top law practitioners build referral fee arrangements, of-counsel relationships, legal technology products, or compliance subscription services that generate income beyond their personal billable hours. Without these, your income is limited to what you personally bill.",
      low_continuity:
        "Your practice depends entirely on your personal involvement in client matters. If you stepped away, active cases would need to be transferred, retainer clients would seek new counsel, and your firm's revenue would cease. There is no associate structure, legal product, or recurring service that would continue generating revenue in your absence.",
    },

    behaviors: {
      high_concentration:
        "Your billing reports show that removing your top two clients would reduce your revenue by 50% or more. This dependency shapes every business decision — you accept scope changes, absorb write-downs, and tolerate payment delays from these clients because you cannot afford to lose them.",
      low_recurrence:
        "Each month's revenue depends on what matters are active and billable that month. Concluded matters create immediate billing gaps, and the lag time to open new matters means your revenue trajectory is inherently discontinuous. You are perpetually one settlement or transaction closing away from a lean quarter.",
      low_diversification:
        "A shift in regulatory landscape, market conditions, or client industry health affects your entire book simultaneously. When your primary practice area slows, there is no cross-practice revenue to maintain your billings while you adjust, and pivoting to a new area of law requires significant learning investment.",
      low_forward_visibility:
        "You cannot reliably predict your billings more than 30-60 days ahead because legal work is inherently reactive — matters arrive when clients have problems, not on a schedule you control. This makes annual budgeting, hiring decisions, and partner compensation planning exercises in educated guessing.",
      high_variability:
        "Your collections swing dramatically between months when large payments arrive and months when billables are low or collections lag. Contingency fees amplify this further — you may receive nothing for months or years on a case, then receive a substantial sum at resolution. This pattern makes consistent financial planning nearly impossible.",
      high_labor_dependence:
        "Your billable hour capacity is the ceiling on your firm's revenue. Every additional dollar requires you to work an additional fraction of an hour. Associates can leverage some of your time, but client-facing strategic work, court appearances, and complex negotiations demand your personal involvement.",
      low_passive_income:
        "When you are not billing hours, your practice generates zero revenue. There are no subscription services, legal products, or passive fee arrangements producing income in the background. Your firm's value proposition begins and ends with your active professional work.",
      low_continuity:
        "Your client relationships are personal — they hired you, not a firm name or platform. If you became unavailable, clients would seek new counsel rather than accept a substitute, and your firm would have no revenue-generating mechanism operating independently of your practice.",
    },

    improvements: {
      high_concentration: [
        "Set an internal policy that no single client can exceed 25% of total billings and actively pursue new engagements to dilute your top client's share — attend industry events, publish thought leadership, and formalize referral relationships.",
        "Develop a second practice area that serves a completely different client base, creating revenue diversification that protects against any single client's departure.",
        "Build an of-counsel relationship with two to three firms in different practice areas, generating referral fee income from matters outside your direct expertise.",
      ],
      low_recurrence: [
        "Convert your top corporate clients from hourly billing to monthly retainer arrangements — package routine legal needs into a fixed monthly fee that provides them with budget certainty and you with predictable income.",
        "Launch a legal subscription service for small businesses — monthly plans covering contract templates, compliance reviews, and limited advisory hours that create a recurring revenue base.",
        "Establish annual engagement letters with your top ten clients that automatically renew, creating structural continuity in your billing relationships year over year.",
      ],
      low_diversification: [
        "Add a complementary practice area that serves a different client need — if you do corporate transactional work, add employment law or regulatory compliance to capture adjacent legal spending from existing clients.",
        "Target an entirely new industry vertical with a focused business development campaign, building a second client base with different economic drivers than your primary sector.",
        "Partner with attorneys in non-competing specialties to create cross-referral arrangements and joint service offerings that expand your effective practice scope without requiring you to build new expertise from scratch.",
      ],
      low_forward_visibility: [
        "Structure all retainer and advisory relationships with 12-month terms and 90-day termination notice requirements, giving you contractual certainty on a significant portion of your revenue.",
        "Implement a matter pipeline tracking system that scores potential engagements by probability and expected billing volume, providing data-driven forecasting for future quarters.",
        "Negotiate phased litigation budgets and transactional milestone billing schedules that create visible, committed billing timelines extending six to twelve months forward.",
      ],
      high_variability: [
        "Move all retainer and advisory clients to equal monthly billing, and structure project-based fees as monthly installments rather than lump-sum payments at matter conclusion.",
        "Build a six-month operating reserve funded by earmarking 15% of every collection until the target is met, creating a buffer that smooths the impact of billing fluctuations.",
        "Add subscription-based legal service revenue that creates a consistent monthly baseline, reducing your dependency on variable matter-based billing.",
      ],
      high_labor_dependence: [
        "Hire an associate or contract attorney to handle routine matter work — document review, standard filings, research memos — freeing your hours for high-value strategic and client development work.",
        "Invest in legal technology (document automation, AI-assisted research, client portals) that multiplies your output per hour and reduces the labor required for standard deliverables.",
        "Build a paralegal team that can manage case administration, client communications, and document preparation independently, expanding your practice capacity without proportional increases in your personal hours.",
      ],
      low_passive_income: [
        "Create a legal compliance product for a specific industry — template document packages, regulatory checklists, and compliance calendars sold as annual subscriptions without requiring your billable time.",
        "Establish of-counsel arrangements with firms that pay you a monthly retainer for availability and referral reciprocity, generating income without active case work.",
        "Develop and sell CLE (continuing legal education) content or practice management training for other attorneys, converting your expertise into a scalable educational product.",
      ],
      low_continuity: [
        "Hire at least one associate who can independently manage client relationships and case work, creating operational continuity that does not depend entirely on your personal availability.",
        "Structure your practice with documented workflows, template libraries, and case management systems that would allow a substitute attorney to maintain service levels in your absence.",
        "Build your retainer agreements at the firm level rather than as personal engagements, so that the client relationship and revenue survive a change in the responsible attorney.",
      ],
    },

    industry_context:
      "Legal services is a profession built on personal trust, specialized knowledge, and hourly billing — a combination that creates high earning potential but extreme labor dependence. Your income is earned hour by hour and matter by matter, with each case or transaction having a defined endpoint that resets your revenue. The attorneys who build financially resilient practices are those who convert episodic legal work into ongoing advisory retainers, diversify across practice areas and client industries, and eventually build firm structures where associate production creates leverage beyond their personal billable capacity.",

    stats: {
      general:
        "Solo attorneys report median income of $100,000-$150,000, while partners at mid-size firms average $250,000-$500,000+. However, 55% of solo practitioners and small firm partners report that their top three clients represent more than 50% of total billings, creating dangerous concentration risk.",
      redAvg: 32,
      greenAvg: 70,
    },

    reassessment: {
      recurrence:
        "Have you converted any hourly clients to monthly retainer arrangements, or established subscription legal services that now generate predictable monthly revenue?",
      concentration:
        "Has the share of your total billings from your single largest client increased or decreased since your last assessment?",
      diversification:
        "Are you now practicing in areas of law or serving client industries that you were not active in previously?",
      forward:
        "Do you have more signed engagement letters, committed retainers, and active matters on the books than at your last assessment?",
      variability:
        "Over the past two quarters, has the difference between your highest and lowest billing months narrowed?",
      labor:
        "Have you hired associates, engaged contract attorneys, or launched any legal products or services that generate revenue without your direct billable hours?",
    },

    worker_context: {
      pressure_framing:
        "This person is a legal professional whose income depends on billable hours, case outcomes, and client retainers. Pressure points include client concentration, matter endpoints that reset revenue, pure labor dependence on personal billable hours, and unpredictable case timing. Frame risks in terms of retainers lost, matters concluded without replacement, and the ceiling imposed by billable hour capacity.",
      tailwind_framing:
        "Strengths in legal services manifest as a diversified retainer book, multiple practice areas generating independent revenue, associate attorneys producing billable hours, and legal products or subscription services creating non-billable revenue. Frame improvements in terms of retainers established, practice areas added, associates generating leverage, and recurring service revenue growing.",
      arrangement_types:
        "Monthly retainer agreements, hourly billing engagements, contingency fee arrangements, flat-fee service packages, legal subscription plans, of-counsel monthly fees, and referral fee arrangements with other attorneys.",
      peer_group_label:
        "legal professionals including solo practitioners, law firm partners, and attorneys in private practice across transactional, litigation, and advisory disciplines",
    },
  },

  /* ================================================================ */
  /*  6. FINANCE / BANKING                                             */
  /* ================================================================ */
  finance_banking: {
    industry_key: "finance_banking",
    industry_label: "Finance / Banking",

    nouns: {
      recurring_revenue: "AUM-based advisory fees and trail commissions",
      top_client: "largest household or institutional account",
      pipeline: "prospect meetings and proposals in progress",
      passive_income: "book-based recurring fees and residual income streams",
      forward_commitment: "signed investment advisory agreements and financial plans",
      active_work: "advising clients, managing portfolios, and closing new accounts",
    },

    scenarios: {
      lose_top_client:
        "Your wealthiest client — the household paying $40,000 to $80,000 per year in advisory fees on their $5-8M portfolio — moves their assets to another advisor or a robo-platform. In financial services, large accounts often arrive through decades of relationship building, and losing one cannot be replaced quickly. Your AUM drops immediately, and the fee income attached to those assets disappears from your next billing cycle. Rebuilding that revenue requires finding and winning a client of equal wealth, which takes 12-24 months of cultivation.",
      cant_work_90_days:
        "A medical event or personal crisis takes you out of client-facing work for 90 days. Your AUM-based fees continue billing automatically — this is the structural advantage of your model. However, clients expect proactive communication during market volatility, and unanswered calls erode trust rapidly. If a market correction hits during your absence, panicked clients may transfer assets to an advisor who is available. Your recurring revenue is at risk not because it stops billing, but because clients may leave.",
      market_slowdown:
        "A sustained bear market drops the S&P 500 by 25-30%, and your AUM declines proportionally — wiping out $1.5-2M in assets under management for every $6M you manage. Because your fees are based on asset value, your revenue drops even though you are doing more work (more client calls, more portfolio adjustments, more emotional management). A 25% market decline means a 25% fee revenue decline, with no commensurate reduction in your workload or overhead.",
      pipeline_dries_up:
        "You have been focused on servicing existing clients through a volatile market and realize your prospecting pipeline has gone cold. No seminars scheduled, no referral requests made, no COI meetings held in months. Your current book generates steady recurring revenue, but organic growth has stalled completely. Without new asset inflows, your practice revenue will only grow at the rate of market appreciation — which is zero in flat or down markets.",
    },

    actions: {
      convert_retainer:
        "Transition your largest commission-based clients to fee-based advisory accounts — a flat percentage of AUM that bills quarterly regardless of trading activity. This converts unpredictable commission income into smooth, recurring fee revenue that arrives automatically. Every $1M in assets moved from commission to advisory generates approximately $10,000 in predictable annual fee revenue that compounds as the portfolio grows.",
      add_client:
        "Build a systematic centers-of-influence strategy with CPAs, estate attorneys, and business brokers who serve your ideal client demographic. Offer co-hosted client events, joint educational workshops, and reciprocal referral tracking. Each COI relationship that produces two qualified referrals per year can generate $500,000+ in new AUM, translating to $5,000+ in incremental annual fees.",
      build_passive:
        "Develop a financial planning subscription for mass-affluent clients who are below your typical AUM minimum — a $200-$500/month flat-fee planning relationship that includes annual reviews, financial plan updates, and access to your planning team. This creates a scalable revenue stream from clients who will eventually consolidate assets with you as their wealth grows, building your future pipeline while generating current income.",
      lock_forward:
        "Implement multi-year financial planning agreements with annual prepayment — clients commit to a three to five year planning relationship with fees locked in advance. Structure advisory agreements with 90-day termination notice requirements. These commitments give you contractual certainty on fee revenue and reduce the risk of impulsive asset transfers during market volatility.",
    },

    actionLabels: {
      convert_retainer: "Move your largest clients to fee-based advisory accounts",
      add_client: "Build a centers-of-influence referral strategy",
      build_passive: "Launch a flat-fee planning subscription for mass-affluent clients",
      lock_forward: "Implement multi-year planning agreements with prepayment",
    },

    microSteps: {
      convert_retainer: ["Identify your top 5 commission-based accounts by annual revenue", "Draft a fee-based advisory proposal for each", "Present the transition as smoother billing and aligned incentives"],
      add_client: ["List 3 CPAs, estate attorneys, or business brokers serving your ideal demographic", "Invite each to co-host a client education event this quarter", "Establish a reciprocal referral tracking system"],
      build_passive: ["Define a flat-fee planning package for clients below your AUM minimum", "Set pricing at $200-$500/month with annual reviews and plan updates", "Market it to your existing network as a feeder for future full advisory relationships"],
      lock_forward: ["Review all current advisory agreements for commitment terms", "Propose 3-year planning commitments with prepaid annual fees to your top clients", "Add 90-day termination notice clauses to all new agreements"],
    },

    constraints: {
      high_concentration:
        "A disproportionate share of your AUM and fee revenue comes from a handful of large households. In wealth management, this concentration is magnified by the personal nature of client relationships — high-net-worth clients are loyal to their advisor, not to a firm, and a single dissatisfied client can take millions in AUM with a single phone call. Your financial stability is hostage to the satisfaction and life circumstances of a few individuals.",
      low_recurrence:
        "Too much of your income depends on new account openings, product commissions, or transactional fees rather than recurring AUM-based advisory fees. Commission-based income resets to zero each month, requiring you to constantly sell to maintain your current income level. The most durable financial practices derive 80%+ of revenue from recurring AUM fees, and yours has not reached that threshold.",
      low_diversification:
        "Your client base is concentrated in a single demographic, asset class, or planning niche. If a market correction disproportionately affects that segment — tech executives with concentrated stock positions, retirees dependent on fixed income, or business owners in a single industry — your entire book is affected simultaneously.",
      low_forward_visibility:
        "You lack committed advisory agreements or planning contracts that extend beyond the standard 30-day termination window. While AUM fees are structurally recurring, clients can transfer assets at any time, making your forward revenue less certain than it appears. True forward visibility comes from multi-year planning commitments and contractual retention terms that most advisors do not implement.",
      high_variability:
        "Your fee revenue fluctuates with market performance because AUM-based billing means your income rises and falls with portfolio values you do not control. A 20% market correction immediately reduces your revenue by 20%, and commission-heavy practices add additional volatility on top of market-driven fluctuations.",
      high_labor_dependence:
        "Every client review, prospect meeting, financial plan, and portfolio discussion requires your personal involvement. High-net-worth clients choose you for your expertise and relationship, not for your firm's platform. This means your revenue capacity is limited by the number of client relationships you can personally maintain, typically 100-150 households.",
      low_passive_income:
        "Beyond your AUM-based fees — which require ongoing client service to retain — you have not built income streams that generate revenue without your active client management. Top advisors build educational products, planning subscription services, or team-based models that scale revenue beyond their personal client capacity.",
      low_continuity:
        "Your practice value is tied to your personal client relationships. If you became unavailable, clients would likely transition to other advisors, and your AUM — the core asset of your practice — would walk out the door. Without a successor plan, team structure, or firm-level relationships, your practice has limited sale or continuity value.",
    },

    behaviors: {
      high_concentration:
        "Your fee revenue would drop by 30-40% if your top three households transferred assets. This concentration shapes your service model — you over-serve large clients and under-invest in smaller relationships that could eventually grow, creating a self-reinforcing dependency on your largest accounts.",
      low_recurrence:
        "Your monthly income depends heavily on new sales activity — insurance commissions, product placements, or account opening bonuses. This creates a treadmill effect where you must constantly sell just to maintain your current lifestyle, leaving less time for the deep planning work that generates client loyalty and referrals.",
      low_diversification:
        "When your primary client segment is under financial pressure, your entire book of business suffers simultaneously. All your clients face similar challenges, seek similar solutions, and may make similar decisions about their advisory relationships — including consolidating or reducing fees.",
      low_forward_visibility:
        "Despite the recurring nature of AUM fees, you lack contractual protections against asset transfers or account closures. Any client can leave at any time, and your standard advisory agreement does nothing to prevent it. Your revenue appears stable until the moment it is not.",
      high_variability:
        "Your income tracks market performance like a leveraged ETF — amplifying both gains and losses relative to the broader market. In bull markets you feel prosperous; in corrections you face revenue declines while your workload increases, creating an emotionally and financially draining mismatch.",
      high_labor_dependence:
        "You are the face and brain of every client relationship. Annual reviews, financial plan updates, market commentary calls, and prospect meetings all require your calendar. Growth means more meetings, more calls, and more evenings at client events — with a hard cap at the number of relationships you can maintain with quality.",
      low_passive_income:
        "Between active client engagements, the only revenue flowing is your AUM billing — which, while recurring, requires continuous service to retain. You have no products, educational offerings, or platform revenue generating income independent of your client book.",
      low_continuity:
        "Your book of business is functionally a collection of personal relationships. If you stepped away for a year, attrition would erode your AUM significantly as clients seek advisors who are present and engaged. Your firm may retain some assets through transition, but a substantial portion would leave with you.",
    },

    improvements: {
      high_concentration: [
        "Set a target that no single household represents more than 10% of your AUM and actively prospect in client segments that would diversify your book — younger accumulators, business owners, or a different demographic than your current core.",
        "Build referral relationships with three to five professionals (CPAs, attorneys, HR directors) who serve different client demographics than your existing COI network, opening new asset flow channels.",
        "Develop a niche service offering for a specific planning need (equity compensation, retirement income, business exit) that attracts clients from diverse industries and wealth levels.",
      ],
      low_recurrence: [
        "Systematically convert all commission-based client relationships to fee-based advisory accounts, prioritizing your largest relationships first to maximize the recurring revenue impact.",
        "Launch a flat-fee financial planning service for clients below your AUM minimum — a $200-$500/month subscription that generates predictable monthly revenue and builds your future asset pipeline.",
        "Negotiate trail commission arrangements on all product placements so that each sale continues generating residual income for the life of the policy or account.",
      ],
      low_diversification: [
        "Expand your service offering to include a planning niche (equity compensation, business succession, federal employee benefits) that attracts clients from an industry or demographic different from your current core.",
        "Build expertise in an alternative asset class or investment strategy that appeals to a client segment you do not currently serve, broadening your value proposition.",
        "Partner with an advisor who serves a complementary client demographic and establish a mutual referral agreement, giving each of you access to a new market without building expertise from scratch.",
      ],
      low_forward_visibility: [
        "Implement multi-year advisory agreements with annual prepaid planning fees and 90-day termination notice requirements, converting standard month-to-month arrangements into committed relationships.",
        "Create an annual financial planning calendar for each client with pre-scheduled quarterly reviews, rebalancing meetings, and planning updates — locking commitments 12 months in advance.",
        "Build a prospect pipeline scoring system that tracks each opportunity from initial meeting through account opening, providing probability-weighted AUM projections for the next four quarters.",
      ],
      high_variability: [
        "Shift your fee structure to include a fixed planning fee component alongside AUM-based billing, creating a revenue floor that does not decline with market values.",
        "Build your financial planning subscription revenue to cover at least your personal fixed expenses, so AUM fee variability only affects discretionary spending and business reinvestment.",
        "Maintain a 12-month personal income reserve funded by setting aside a portion of fee revenue during bull markets, ensuring smooth personal cash flow through market corrections.",
      ],
      high_labor_dependence: [
        "Hire a paraplanner or associate advisor who can conduct routine reviews, prepare financial plan updates, and handle service requests, freeing your time for prospect meetings and high-value planning sessions.",
        "Implement a client tiering system that matches service levels to client value — top-tier households receive your personal attention while smaller accounts are served through a scalable team model.",
        "Build a digital client experience (portal, automated reporting, educational content library) that provides value between meetings without requiring your personal involvement.",
      ],
      low_passive_income: [
        "Create a financial wellness course or retirement planning educational series that you sell directly to corporate HR departments, generating revenue from your expertise without managing individual accounts.",
        "Develop a model portfolio or investment strategy that you license to other advisors for a fee, converting your investment process into a scalable product.",
        "Launch a podcast or content platform monetized through sponsorships and premium content tiers, building a media asset that generates income independently of your advisory practice.",
      ],
      low_continuity: [
        "Develop a formal succession plan with a named successor advisor who actively participates in your client relationships, ensuring smooth transition and asset retention if you become unavailable.",
        "Build a team-based service model where clients interact with multiple team members, reducing the perception that your practice is a solo operation and improving retention through any transition.",
        "Structure your advisory agreements at the firm level with continuity provisions, so clients have contractual assurance that their planning relationship survives any individual advisor's departure.",
      ],
    },

    industry_context:
      "Financial advisory is one of the few professions where your revenue grows automatically with market appreciation — but that same mechanism means your income declines in bear markets without any reduction in your workload. Your AUM-based fee model creates structural recurrence that most industries envy, but it exposes you to market risk that is completely outside your control. The advisors who build truly durable practices are those who diversify client demographics, layer fixed planning fees on top of AUM billing, build team models that scale beyond personal capacity, and maintain prospect pipelines that ensure continuous asset inflows regardless of market conditions.",

    stats: {
      general:
        "The median financial advisor earns $95,000 annually, while advisors managing $100M+ in AUM typically earn $250,000-$500,000+. AUM-based practices benefit from structural recurrence averaging 93-97% annual retention, but market sensitivity means a 20% correction immediately reduces revenue by the same percentage.",
      redAvg: 35,
      greenAvg: 74,
    },

    reassessment: {
      recurrence:
        "Have you converted commission-based client relationships to fee-based advisory accounts, or added flat-fee planning subscriptions that generate new recurring revenue?",
      concentration:
        "Has the percentage of your AUM held by your top three households increased or decreased since your last assessment?",
      diversification:
        "Are you now serving client demographics, asset classes, or planning niches that you were not active in before?",
      forward:
        "Do you have more signed multi-year advisory agreements or prepaid planning commitments on the books than at your last assessment?",
      variability:
        "Over the past four quarters, has the impact of market fluctuations on your fee revenue been reduced by fixed-fee or subscription components?",
      labor:
        "Have you hired associate advisors, paraplanners, or implemented technology that allows your practice to serve clients without your direct involvement in every interaction?",
    },

    worker_context: {
      pressure_framing:
        "This person is a financial professional whose income depends on AUM-based fees, commissions, and client advisory relationships. Pressure points include large household concentration, market-driven revenue volatility, labor-intensive client service models, and pipeline gaps in new asset acquisition. Frame risks in terms of AUM lost, market-driven fee declines, anchor client departures, and the capacity ceiling of personal relationship management.",
      tailwind_framing:
        "Strengths in financial services manifest as high AUM retention rates, diversified client demographics, fixed planning fee revenue that buffers market volatility, and team models that scale service capacity. Frame improvements in terms of AUM growth, client demographic diversification, fixed-fee revenue added, and team members serving clients independently.",
      arrangement_types:
        "AUM-based advisory fees, flat-fee financial planning subscriptions, insurance and annuity commissions, trail commissions on product placements, hourly consulting fees, corporate wellness program fees, and referral fee arrangements with professional partners.",
      peer_group_label:
        "financial professionals including wealth managers, financial planners, investment advisors, and registered representatives",
    },
  },

  /* ================================================================ */
  /*  7. INSURANCE                                                     */
  /* ================================================================ */
  insurance: {
    industry_key: "insurance",
    industry_label: "Insurance",

    nouns: {
      recurring_revenue: "renewal commissions from your book of business",
      top_client: "largest policy account or group benefits client",
      pipeline: "quoted prospects awaiting binding decisions",
      passive_income: "book renewal income that arrives without new sales activity",
      forward_commitment: "bound policies and signed applications in underwriting",
      active_work: "quoting, prospecting, and writing new policies",
    },

    scenarios: {
      lose_top_client:
        "Your largest commercial account — the business client whose policies generate $15,000 to $25,000 in annual commissions across P&C, workers' comp, and group benefits — receives a competitive quote from another agency and decides to move their entire account. That single loss ripples across every line of coverage you wrote for them, and the commission impact hits your renewal income for years. Replacing a commercial account of that size requires months of prospecting, quoting, and trust-building with a new business owner.",
      cant_work_90_days:
        "An injury or personal emergency takes you out of production for 90 days. Your existing book continues generating renewal commissions — policies auto-renew and carriers process renewals without your involvement. This is the structural advantage of insurance. However, service issues pile up — claims questions, endorsement requests, and certificate demands go unanswered. Poor service during renewal windows gives competitors an opening, and your new business pipeline evaporates entirely because nobody is quoting prospects.",
      market_slowdown:
        "A hard market drives premiums up 20-30% across your primary lines, and your clients start shopping aggressively. What was a loyal book becomes a portfolio of price-sensitive accounts that your competitors are targeting with aggressive quoting. At the same time, small businesses in your commercial book close or downsize, eliminating policies entirely. Your renewal commissions decline both from lost accounts and from clients shifting to lower-premium carriers where your commission percentage may be lower.",
      pipeline_dries_up:
        "You have been focused on service and renewals for your existing book and realize you have not quoted a new prospect in weeks. Your production numbers are trending toward zero while your peers are bringing in new business. In insurance, new business commissions are typically two to five times the renewal commission rate, and without fresh production your income growth flatlines. Worse, natural attrition — clients who move, die, or cancel — gradually erodes your book if new policies are not replacing lost ones.",
    },

    actions: {
      convert_retainer:
        "Strengthen your renewal retention rate — your book of business IS your recurring revenue engine. Implement a systematic 90-day pre-renewal review process for your top 50 accounts. Proactive retention prevents the silent erosion that new production masks.",
      add_client:
        "Launch an industry-specific prospecting campaign targeting a business sector where you have deep expertise (restaurants, contractors, medical offices) and build a vertical reputation as the specialist agent. Attend their association meetings, publish risk management content in their trade publications, and offer free coverage audits. Industry-focused agents close at double the rate of generalists because prospects trust specialists with their coverage decisions.",
      build_passive:
        "Grow your book of personal lines policies — auto, home, umbrella — that renew annually with minimal service requirements. A book of 200 personal lines households generates $40,000-$60,000 in annual renewal commissions that arrives automatically. These accounts require far less service than commercial lines and create a stable income base that supports your practice even during slow production months.",
      lock_forward:
        "Implement a three-year account review cycle with your top 50 commercial clients, scheduling annual stewardship meetings and mid-year reviews on a calendar that locks their attention and relationship to your agency. Propose multi-year policies where available, and cross-sell additional lines of coverage at each review meeting. Every additional line you write on a commercial account increases switching costs and reduces the probability of loss at renewal.",
    },

    actionLabels: {
      convert_retainer: "Strengthen your renewal retention rate",
      add_client: "Build a vertical specialty in a new business sector",
      build_passive: "Grow your personal lines book for automatic renewal income",
      lock_forward: "Lock top accounts into a multi-year review cycle",
    },

    microSteps: {
      convert_retainer: ["Pull your renewal report for the next 90 days", "Call your top 5 upcoming renewals to review coverage and confirm retention", "Document the commitments — the retention conversation script is below"],
      add_client: ["Pick one business sector where you have deep expertise", "Attend their next association meeting and offer free coverage audits", "Publish one risk management article in their trade publication this quarter"],
      build_passive: ["Set a goal to add 5 new personal lines households per month", "Create a simple referral incentive for existing clients", "Automate quoting and onboarding to minimize service time per account"],
      lock_forward: ["Schedule annual stewardship meetings with your top 50 commercial accounts", "Cross-sell at least one additional coverage line at each meeting", "Propose multi-year policies where carriers offer them"],
    },

    constraints: {
      high_concentration:
        "Your commission income is dominated by a small number of large accounts. In insurance, concentration risk is amplified by renewal dynamics — one lost commercial account reduces your income not just for one year but for every future renewal year. A competitor agent who captures your anchor account today will earn those renewal commissions for the next decade.",
      low_recurrence:
        "Your income depends too heavily on new business first-year commissions rather than renewal income from an established book. First-year commissions are the highest-effort, highest-variability component of insurance income. Agents with mature books derive 60-80% of their income from renewals, and your ratio is far below that threshold.",
      low_diversification:
        "Your book is concentrated in a narrow range of coverage types, carrier relationships, or client industries. If a carrier exits your market, a coverage line becomes unprofitable, or your primary industry sector contracts, your entire book is exposed. Diversified agents who write across personal, commercial, life, and benefits lines weather market disruptions with far less impact.",
      low_forward_visibility:
        "You lack bound policies in the pipeline or signed applications currently in underwriting. Your forward revenue depends on renewal retention rates you cannot control and new business production you have not yet initiated. Insurance has strong structural recurrence through renewals, but without fresh production in the pipeline, your income is limited to whatever your current book generates minus attrition.",
      high_variability:
        "Your monthly income swings based on new business closing patterns, renewal timing, and carrier commission payment schedules. First-year commissions arrive in unpredictable bursts while renewal commissions are distributed across the year. This creates cash flow volatility that makes it difficult to manage personal and agency expenses consistently.",
      high_labor_dependence:
        "Every quote, application, and client meeting requires your personal involvement. Quoting commercial accounts is especially time-intensive — hours of information gathering, submission preparation, and carrier negotiation for each prospect. Your new business production is directly limited by your quoting capacity, and service demands on your existing book compete for the same hours.",
      low_passive_income:
        "Beyond your book's renewal commissions, you have not built income streams that generate revenue without active production or service work. Top insurance professionals build override commissions from sub-agents, cluster group participation income, or risk management consulting fees that diversify their revenue beyond carrier commissions.",
      low_continuity:
        "Your book of business has significant continuity through carrier renewal processes, but your client relationships are personal. If you became unavailable, the policies would renew automatically, but service-dependent clients would eventually move to an agent who is present. Without a successor or team, your book's value erodes over time without active management.",
    },

    behaviors: {
      high_concentration:
        "Your commission statements show a handful of large accounts generating the majority of your income. You bend your service model around these clients — prioritizing their certificates, fast-tracking their endorsements, and accepting after-hours calls — because losing any one of them would create a meaningful income gap.",
      low_recurrence:
        "Your income is dominated by the boom-and-bust pattern of first-year production. Strong sales months create spikes that are not sustained by the smaller renewal commissions that follow. You are perpetually chasing the next new account because your book has not yet reached the size where renewals alone support your income needs.",
      low_diversification:
        "When a carrier changes appetite or rates in your primary coverage line, you feel the impact across your entire book. Agents who write across multiple coverage types and multiple carriers can shift production to where the market is favorable; your concentrated book leaves you exposed to single-carrier or single-line disruptions.",
      low_forward_visibility:
        "You cannot reliably project next quarter's new business production because your pipeline consists of quotes that prospects may or may not bind. Insurance quoting is high-effort and low-conversion — you may quote ten accounts to close two — making production forecasting inherently uncertain.",
      high_variability:
        "Your monthly commission deposits vary significantly based on when policies bind, how carriers process payments, and whether renewals retain or lapse. The timing mismatch between effort (quoting) and reward (commission payment) creates persistent cash flow unpredictability.",
      high_labor_dependence:
        "Quoting, presenting, and servicing accounts consumes your entire working week. Every new business opportunity requires hours of personal effort, and your existing book demands ongoing service attention. There is a hard ceiling on production because you physically cannot quote more accounts than your schedule allows.",
      low_passive_income:
        "Your renewal commissions require a maintained book — clients must stay, policies must renew, and carriers must continue paying commissions at current rates. Beyond this semi-passive income, you have no additional revenue streams operating independently of your daily insurance production and service activity.",
      low_continuity:
        "Your book would continue generating renewal commissions if you became unavailable, but without active management, retention would decline steadily. Clients who need service — claims help, coverage changes, certificate requests — would eventually migrate to an agent who responds, gradually eroding the book you spent years building.",
    },

    improvements: {
      high_concentration: [
        "Launch a focused prospecting campaign to add 10-15 mid-size commercial accounts over the next 12 months, reducing your largest account below 15% of total commissions.",
        "Cross-sell every existing account into at least two additional coverage lines — adding workers' comp, commercial auto, or group benefits to P&C-only accounts increases per-client revenue and switching costs.",
        "Build personal lines volume by marketing home and auto bundles to the employees of your commercial clients, creating a diversified account base that is not dependent on any single large policy.",
      ],
      low_recurrence: [
        "Prioritize building your renewal book by writing long-tail policy types (life, disability, group benefits) that generate renewal commissions for 10-20+ years per policy.",
        "Target personal lines volume — a book of 200+ households generates sustainable renewal income with minimal service requirements, creating the baseline income that supports your new business efforts.",
        "Negotiate higher renewal commission rates with your preferred carriers by demonstrating retention metrics and production volume, increasing the per-policy value of your existing book.",
      ],
      low_diversification: [
        "Obtain appointments with carriers in coverage lines you do not currently write — if you only do P&C, add life, health, or benefits markets to access an entirely different commission stream.",
        "Target a new industry vertical with a focused quoting campaign, building expertise and carrier relationships in a sector that operates on a different business cycle than your primary market.",
        "Join a cluster group or aggregator that gives you access to carriers and markets outside your current appointments, broadening your placement options and reducing single-carrier dependency.",
      ],
      low_forward_visibility: [
        "Build a quoting pipeline tracker that measures quoted premium volume, bind ratios, and expected commission by month — giving you data-driven visibility into production before policies actually bind.",
        "Schedule renewal reviews with your top 50 accounts 90 days before renewal date, identifying at-risk accounts early and creating a proactive retention strategy that improves your forecast accuracy.",
        "Increase your quoting volume by 30% through targeted prospecting, ensuring that your pipeline always contains enough quoted business to meet production targets even with normal bind ratios.",
      ],
      high_variability: [
        "Set up a commission smoothing account — deposit all commissions into a business account and pay yourself a fixed monthly salary, using the surplus to build a reserve that covers low-production months.",
        "Shift your production mix toward policies with level commission structures — group benefits and certain life products pay monthly commissions that smooth your income throughout the year.",
        "Build your renewal book to the point where renewal commissions alone cover your fixed personal and business expenses, making new business production purely additive rather than necessary for survival.",
      ],
      high_labor_dependence: [
        "Hire a licensed service assistant or CSR who can handle certificates, endorsements, and routine client requests, freeing your time exclusively for quoting and closing new business.",
        "Implement quoting technology that automates carrier submissions and comparison — rater tools, AMS integrations, and proposal generators that reduce your per-quote time investment.",
        "Recruit one or two sub-producers who generate new business under your supervision, creating override income on their production that supplements your personal sales commissions.",
      ],
      low_passive_income: [
        "Build override commission income by mentoring sub-agents who produce under your license, earning a percentage of their new business and renewal commissions without personal production effort.",
        "Develop a risk management consulting practice that charges business clients for loss control assessments, safety program development, and claims advocacy — revenue that is independent of carrier commissions.",
        "Create educational content (workshops, webinars, guides) for business owners about risk management and insurance strategy, monetized through sponsorships, lead generation, or direct fees.",
      ],
      low_continuity: [
        "Develop a formal perpetuation plan — identify a successor agent, begin introducing them to your top clients, and structure a buy-sell agreement that ensures your book's value is realized if you exit.",
        "Build a team-based service model where clients interact with your CSR and service staff regularly, reducing the perception that your agency is a one-person operation.",
        "Ensure your agency management system (AMS) contains complete documentation on every account — contacts, coverage details, loss history, and service notes — so any successor could take over without a knowledge gap.",
      ],
    },

    industry_context:
      "Insurance is uniquely positioned among commission-based professions because it offers built-in renewal income — your book of business generates commissions every year when policies renew, creating a compounding asset that most other sales professions lack. However, this structural advantage masks real vulnerabilities: book erosion from client attrition, carrier appetite changes that disrupt placement, hard market cycles that drive competitive shopping, and the constant tension between servicing your existing book and prospecting for new business. The agents who build truly resilient practices are those who grow a large, diversified renewal book across multiple lines and carriers while maintaining enough new business production to outpace natural attrition.",

    stats: {
      general:
        "The median insurance agent earns $57,000 annually, but experienced agents with mature books typically earn $120,000-$250,000+. Established agents with 500+ active policies report renewal income covering 65-85% of their total compensation, while newer agents depend almost entirely on volatile first-year commissions.",
      redAvg: 30,
      greenAvg: 72,
    },

    reassessment: {
      recurrence:
        "Has your renewal commission income grown as a percentage of total compensation — are renewals now covering a larger share of your expenses than at your last assessment?",
      concentration:
        "Has the share of your total commissions coming from your single largest account or carrier changed significantly?",
      diversification:
        "Are you now writing coverage lines, serving industries, or placed with carriers that you were not active with before?",
      forward:
        "Do you have more bound policies and signed applications in the pipeline than you did at your last assessment?",
      variability:
        "Over the past six months, has the gap between your highest and lowest commission months narrowed?",
      labor:
        "Have you hired service staff, added sub-producers, or implemented quoting automation that generates production without your direct effort?",
    },

    worker_context: {
      pressure_framing:
        "This person is an insurance professional whose income depends on new business commissions and renewal book income. Pressure points include large account concentration, book erosion from attrition and carrier changes, labor-intensive quoting processes, and the constant tension between servicing existing clients and prospecting for new business. Frame risks in terms of accounts lost, renewal commissions declining, carrier appetite shifts, and the quoting capacity ceiling.",
      tailwind_framing:
        "Strengths in insurance manifest as a large, diversified renewal book, multi-line coverage per client, appointments with multiple carriers, and sub-producer relationships generating override income. Frame improvements in terms of book growth, retention rates, lines per account added, and new business production volume.",
      arrangement_types:
        "First-year new business commissions, annual renewal commissions, override commissions on sub-agent production, group benefits commissions, contingency profit-sharing bonuses, risk management consulting fees, and cluster group participation income.",
      peer_group_label:
        "insurance professionals including P&C agents, benefits brokers, life insurance producers, and independent agency owners",
    },
  },

  /* ================================================================ */
  /*  8. SALES / BROKERAGE                                             */
  /* ================================================================ */
  sales_brokerage: {
    industry_key: "sales_brokerage",
    industry_label: "Sales / Brokerage",

    nouns: {
      recurring_revenue: "residual commissions and override payments",
      top_client: "anchor deal relationship or primary account",
      pipeline: "qualified deals in active negotiation",
      passive_income: "residual income and portfolio-based override commissions",
      forward_commitment: "signed LOIs and executed agreements pending close",
      active_work: "prospecting, negotiating deals, and closing transactions",
    },

    scenarios: {
      lose_top_client:
        "Your biggest account — the client whose repeat transactions or recurring purchases generate 30-40% of your annual commissions — decides to consolidate vendors, hire internally, or switch to a competitor. In sales, losing an anchor account does not just reduce current income — it eliminates the ongoing referrals and repeat deals that account generated. Your revenue drops immediately, and rebuilding a relationship of that scale means months of prospecting with no guarantee of a replacement at the same volume.",
      cant_work_90_days:
        "A health issue or personal crisis pulls you completely out of the field for 90 days. Your active deals stall because nobody is driving them to close — follow-up calls go unmade, proposals go undelivered, and negotiations lose momentum. Deals that were close to closing may slip to another rep or simply die from inattention. Your residual income continues flowing, but your pipeline of new commissions goes to zero, and the deals you lose during your absence are gone permanently.",
      market_slowdown:
        "A recession, regulatory change, or industry contraction reduces buying activity across your target market by 30-40%. Deals take twice as long to close, decision-makers defer purchasing, and budget freezes eliminate opportunities that were previously moving forward. Your commission income drops proportionally because you earn nothing until transactions complete, and in a slow market, completions become rare events rather than regular occurrences.",
      pipeline_dries_up:
        "You have been focused on closing existing deals and realize your prospecting pipeline is empty — no new leads being worked, no discovery meetings scheduled, and no proposals outstanding. The deals you are about to close represent your last known income, with nothing behind them. The classic sales cycle gap hits hard: you spent all your time closing and none of it sourcing, and now you face a two to four month revenue vacuum while you rebuild momentum from scratch.",
    },

    actions: {
      convert_retainer:
        "Focus on building accounts with residual or trailing commission structures — subscription products, renewal-based services, or managed accounts that generate ongoing revenue from existing relationships without requiring a new sale each quarter.",
      add_client:
        "Build a systematic outbound prospecting engine — 25 targeted outreach touches per week to qualified prospects in a defined market segment. Use a multi-channel approach (direct calls, LinkedIn engagement, industry event networking, and warm referral requests). Consistent prospecting activity is the only reliable cure for pipeline gaps, and the discipline of maintaining it during busy closing periods is what separates sustainably successful reps from boom-bust producers.",
      build_passive:
        "Develop an income stream outside of direct deal-making — recruit and train junior reps and earn override commissions on their production, build a referral network that pays you fees for qualified introductions, or create a market intelligence product for your industry that generates subscription revenue. The goal is income that arrives even during months when you are not personally closing deals.",
      lock_forward:
        "Structure deals with larger upfront commitments and longer contract terms — multi-year agreements, volume commitments with scheduled deliveries, or retainer-style arrangements that lock clients into ongoing purchasing relationships. Every deal you close with a multi-period commitment creates forward revenue visibility that single-transaction commissions cannot provide. Push for signed LOIs and binding purchase agreements as early in the process as possible.",
    },

    actionLabels: {
      convert_retainer: "Build accounts with residual commissions",
      add_client: "Launch a systematic outbound prospecting engine",
      build_passive: "Build override income from junior reps or referral fees",
      lock_forward: "Structure deals with multi-year commitments",
    },

    microSteps: {
      convert_retainer: ["Identify which products in your portfolio have recurring revenue structures", "Shift your next 3 pitches toward those products", "Track trailing commission as a separate line item in your pipeline"],
      add_client: ["Define a specific market segment to target this quarter", "Commit to 25 outreach touches per week using calls, LinkedIn, and warm referrals", "Track conversion from outreach to meeting to close"],
      build_passive: ["Identify one junior rep you could recruit and mentor", "Structure an override arrangement on their production", "Set a 90-day goal for their first closed deals"],
      lock_forward: ["Review your current pipeline for single-transaction deals", "Propose multi-year terms or volume commitments on your next 3 closes", "Push for signed LOIs and binding agreements as early as possible"],
    },

    constraints: {
      high_concentration:
        "Your commission income is dominated by a small number of accounts or deal relationships. In sales, concentration risk is especially acute because account decisions are made by individuals — a new purchasing manager, a change in corporate strategy, or a budget reallocation can terminate your income from that account instantly. Your financial stability depends on people you do not manage making decisions you do not control.",
      low_recurrence:
        "Your income is purely transactional — each deal is a standalone event that pays once and then requires a new sale to generate the next commission. Without residual commissions, override arrangements, or recurring account fees, every month starts at zero revenue regardless of how much you closed last month. This creates a perpetual treadmill where stopping to breathe means stopping to earn.",
      low_diversification:
        "Your deal flow is concentrated in a single product category, market vertical, or geography. If demand shifts, a competitor enters your market, or your primary industry contracts, every deal in your pipeline is affected simultaneously. Reps who sell across multiple verticals or product lines can redirect effort when one segment slows.",
      low_forward_visibility:
        "You lack signed commitments or executed agreements for future transactions. Your pipeline consists of prospects at various stages of interest, but interest is not income. Until a deal closes and a commission check is issued, your projected earnings are speculative. This makes financial planning, hiring decisions, and personal commitments feel like gambles.",
      high_variability:
        "Your monthly income fluctuates dramatically based on deal timing and closing patterns. A $30,000 commission month followed by a $3,000 commission month is normal in sales, but this volatility creates cash flow chaos that undermines your ability to invest, plan, and maintain emotional equilibrium during dry spells.",
      high_labor_dependence:
        "Every deal requires your personal involvement — prospecting, qualifying, presenting, negotiating, and closing. There is no mechanism in your current structure for deals to close without your direct effort. Your income is proportional to your activity level, and taking your foot off the gas for even a few weeks shows up immediately in your pipeline.",
      low_passive_income:
        "You have no income flowing outside of your active deal-closing work. Top sales professionals build override arrangements, referral fee networks, or advisory board positions that generate income between deals. Without these, you are entirely dependent on your personal production volume and closing rate for every dollar you earn.",
      low_continuity:
        "If you stopped working tomorrow, your deals in progress would either close without you (benefiting someone else) or die from inattention. Your pipeline, relationships, and market knowledge exist in your head, and there is no structure to capture or continue generating value from those assets in your absence.",
    },

    behaviors: {
      high_concentration:
        "Your income timeline is shaped by the purchasing cycles of your top accounts. When they buy, you earn; when they pause, you scramble. This dependency forces you into a service posture with those accounts that limits your ability to negotiate terms, push back on timelines, or pursue higher-value opportunities elsewhere.",
      low_recurrence:
        "Every month you start from zero and fight your way up. The psychological weight of perpetual sales pressure drives some reps to close bad deals just to generate income, compromising long-term relationships for short-term survival. Your earnings chart is a series of isolated spikes rather than a growing baseline.",
      low_diversification:
        "When your primary market segment slows, you have nowhere to redirect your prospecting effort. All your industry knowledge, relationships, and positioning are invested in a single vertical, and pivoting to a new market means starting the trust-building process from scratch.",
      low_forward_visibility:
        "Your CRM pipeline shows potential deals, but potential is not revenue. You cannot distinguish with confidence between deals that will close this quarter and deals that will slip indefinitely, making every revenue forecast unreliable. This uncertainty permeates your financial decisions and personal planning.",
      high_variability:
        "Your bank account balance swings between feast and famine on a monthly basis. Large commission checks create a false sense of security that masks the underlying volatility, and lean months force painful expense cuts that could have been avoided with more stable income structure.",
      high_labor_dependence:
        "You are the entire sales engine — from lead generation through contract execution. Scaling your income means scaling your personal effort, and there are only so many hours in a week. The most successful reps eventually hit a wall where they are maxing out their calendar but cannot grow revenue further without structural changes.",
      low_passive_income:
        "Between closed deals, there is no income. Your earnings chart shows gaps between transaction peaks that represent pure zero-revenue periods. These gaps grow longer during market slowdowns and shorter during booms, but they never disappear entirely because your model has no passive income component.",
      low_continuity:
        "Your sales pipeline is a personal asset with zero transferable value. Deals in progress, prospect relationships, and market intelligence all depend on your continued involvement. If you stepped away, the pipeline would dissolve and the next rep would start fresh with your former prospects.",
    },

    improvements: {
      high_concentration: [
        "Commit to prospecting a minimum of 10 new accounts per month in industries or company sizes different from your current anchor clients, systematically building a diversified revenue base.",
        "Build referral reciprocity agreements with five to ten non-competing sales professionals who serve the same buyer personas in different capacities, creating multiple independent deal sourcing channels.",
        "Develop expertise in a second product category or service offering that appeals to a different buyer segment, reducing your dependency on any single account's purchasing decisions.",
      ],
      low_recurrence: [
        "Negotiate residual or trailing commission structures on every new deal — even a 1-2% annual residual on recurring purchases creates compounding passive income over time.",
        "Propose ongoing advisory or account management arrangements with your top clients, earning a monthly fee for proactive service, reporting, and strategic recommendations that supplements deal commissions.",
        "Build a referral network where you earn ongoing fees for qualified introductions — connecting buyers and sellers in your industry for a percentage of completed transactions, creating deal flow income without direct sales effort.",
      ],
      low_diversification: [
        "Target a second industry vertical with a focused prospecting campaign, adapting your sales methodology to their specific buying process and pain points.",
        "Add a complementary product or service to your portfolio that serves a different need for the same buyer, or the same need for a different buyer — expanding your addressable market without abandoning your core expertise.",
        "Build relationships in geographic markets outside your current territory through digital outreach and virtual selling, creating revenue streams independent of local market conditions.",
      ],
      low_forward_visibility: [
        "Structure proposals with multi-period commitments — annual purchasing agreements, subscription-style service contracts, or volume schedules that create binding forward revenue.",
        "Implement a weighted pipeline scoring system that honestly assesses close probability and expected timing, giving you realistic (not optimistic) revenue projections for the next two quarters.",
        "Push for signed LOIs, binding commitments, or deposit payments earlier in your sales process — moving deals from speculative interest to contractual certainty as quickly as possible.",
      ],
      high_variability: [
        "Create a commission smoothing account — deposit every commission check and pay yourself a fixed monthly amount, building a surplus during strong months that carries you through weak ones.",
        "Add recurring revenue streams (residuals, overrides, advisory fees) that create a monthly income floor, so commission variability only affects the upside of your earnings rather than your ability to pay bills.",
        "Maintain a rigid weekly prospecting schedule even during busy closing periods — the single most effective cure for income variability is a consistently full pipeline.",
      ],
      high_labor_dependence: [
        "Recruit and mentor a junior sales rep who can handle prospecting, qualification, and initial presentations, with you stepping in only for negotiation and closing — creating leverage on your most valuable skill.",
        "Build an automated top-of-funnel system — email sequences, content marketing, and CRM automation — that generates and qualifies leads without your manual prospecting effort.",
        "Establish override or profit-sharing arrangements on deals you source but another rep closes, enabling you to earn from volume you generate but do not personally manage through the entire sales cycle.",
      ],
      low_passive_income: [
        "Build override commission income by managing or mentoring junior reps whose production pays you a percentage, creating earnings proportional to their activity rather than yours.",
        "Develop industry expertise into a paid advisory or consulting service — market analysis, deal structuring guidance, or vendor evaluation — that clients pay for monthly independent of any transaction.",
        "Create a digital resource (deal templates, negotiation frameworks, market intelligence reports) sold as a subscription to professionals in your industry, generating scalable product revenue.",
      ],
      low_continuity: [
        "Document your entire sales process — prospecting methodology, qualification criteria, negotiation playbooks, and account histories — in a system that another rep could use to continue your book.",
        "Build a small team with at least one rep capable of managing your active accounts and pipeline independently, creating operational continuity that does not depend on your personal involvement.",
        "Structure key account relationships with multi-contact engagement — introduce colleagues, service team members, and support resources — so the client relationship is with your organization, not just with you personally.",
      ],
    },

    industry_context:
      "Sales and brokerage professionals operate in the purest commission environment — you eat what you kill, and there is no salary floor to catch you when deals stall. Your income is entirely determined by your ability to find prospects, move them through a sales process, and close transactions. The fundamental challenge is the pipeline gap: the time lag between prospecting activity and commission checks means today's income was determined by effort you put in weeks or months ago. The reps who achieve genuine financial stability are those who build residual commission structures, develop multiple deal sourcing channels, and maintain disciplined prospecting activity even during peak closing periods.",

    stats: {
      general:
        "Commissioned sales professionals report median earnings of $72,000 annually, with top performers exceeding $200,000. However, 70% of sales reps experience at least one income drop exceeding 40% in a given quarter, driven by deal timing and pipeline gaps. The average sales cycle gap — the time between closing a deal and closing the next one — creates persistent income volatility.",
      redAvg: 29,
      greenAvg: 67,
    },

    reassessment: {
      recurrence:
        "Have you established residual commission arrangements, override structures, or recurring advisory fees that now generate income without requiring you to close a new deal?",
      concentration:
        "Has the share of your total commission income from your single largest account or deal type changed since your last assessment?",
      diversification:
        "Are you now closing deals in industries, product categories, or geographic markets you were not active in before?",
      forward:
        "Do you have more signed commitments, LOIs, or binding agreements in your pipeline than at your last assessment?",
      variability:
        "Over the past two quarters, has the difference between your best and worst commission months narrowed?",
      labor:
        "Have you added junior reps, automated your prospecting process, or built any income streams that generate commissions without your direct deal involvement?",
    },

    worker_context: {
      pressure_framing:
        "This person is a sales or brokerage professional whose income depends entirely on closing deals. Pressure points include pipeline gaps between closings, heavy concentration on anchor accounts, purely transactional commission structures with no residuals, and the labor intensity of managing every deal personally. Frame risks in terms of deals lost, pipeline vacuums, anchor account departures, and the relentless restart cycle of commission-only income.",
      tailwind_framing:
        "Strengths in sales manifest as diversified deal flow, residual commission structures, a disciplined prospecting pipeline, and team or override arrangements that generate income beyond personal production. Frame improvements in terms of new accounts added, residual income growing, pipeline depth increasing, and leverage created through team or automation.",
      arrangement_types:
        "One-time deal commissions, residual and trailing commissions, override commissions on team production, referral fees, advisory retainers, performance bonuses, and profit-sharing arrangements on managed accounts.",
      peer_group_label:
        "sales and brokerage professionals including commission-only reps, business brokers, executive recruiters, and account executives",
    },
  },

  /* ================================================================ */
  /*  9. CREATIVE / MEDIA                                              */
  /* ================================================================ */
  creative_media: {
    industry_key: "creative_media",
    industry_label: "Creative / Media",

    nouns: {
      recurring_revenue: "content licensing fees and subscription audience revenue",
      top_client: "anchor brand partner or primary content buyer",
      pipeline: "booked productions and confirmed projects",
      passive_income: "royalties, licensing income, and evergreen content revenue",
      forward_commitment: "signed production contracts and confirmed sponsorship deals",
      active_work: "creating content, producing media, and delivering creative projects",
    },

    scenarios: {
      lose_top_client:
        "Your biggest brand sponsor — the company paying $5,000 to $15,000 per month for dedicated content, appearances, or creative partnership — decides to shift their marketing budget to a different channel, creator, or agency. That single partnership may represent 35-50% of your income, and in the creator economy, brand deals are won through relationship and timing, not competitive bidding. Replacing that sponsorship means months of pitching, negotiating, and proving ROI to a new brand partner from scratch.",
      cant_work_90_days:
        "A health issue, creative burnout, or personal crisis takes you out of production for 90 days. Your evergreen content continues generating views, streams, and ad revenue — but at a decaying rate as algorithms deprioritize inactive creators. Your sponsorship contracts may include minimum output requirements that you cannot fulfill, triggering penalty clauses or early termination. By the time you return, your audience has shifted attention elsewhere, and rebuilding algorithmic momentum takes weeks or months of consistent output.",
      market_slowdown:
        "A recession cuts marketing budgets across the board, and brand sponsorship spending drops 30-40%. The brands that keep spending shift toward performance-based deals — paying only for measurable conversions rather than flat-rate creative fees. Your per-project rates come under pressure as more creators compete for fewer brand dollars, and the premium rates you charged during the boom now feel unjustifiable to budget-conscious marketing directors.",
      pipeline_dries_up:
        "You have been deep in production on a major project for months and realize you have no follow-up work booked. Your content calendar beyond the current project is blank, your brand outreach has gone dormant, and your agent or manager has no pending proposals. The creative industry rewards momentum — consistent output, growing audiences, and regular visibility — and going quiet for even a few months means rebuilding presence from a diminished starting point.",
    },

    actions: {
      convert_retainer:
        "Secure recurring content or production agreements — annual sponsorship deals, ongoing brand partnerships, or multi-episode/multi-project commitments rather than one-off gigs. For talent: negotiate deal structures that include residuals, licensing fees, or backend participation that pay beyond the initial project.",
      add_client:
        "Diversify your client base by targeting brands in three distinct industry categories — if your current sponsors are all in one sector (beauty, tech, fitness), actively pitch brands in complementary categories. Build a media kit that demonstrates audience crossover potential, and attend industry events where marketing decision-makers from those sectors are present. Each new industry vertical you crack opens an entirely independent pipeline of sponsorship opportunities.",
      build_passive:
        "Invest in creating evergreen content assets — courses, templates, presets, music, stock footage, or print-on-demand products — that generate revenue indefinitely without additional production effort. A single well-designed digital product priced at $29-$99 and marketed to your audience can generate $2,000-$10,000 per month in passive sales. This converts your creative expertise into a product that earns while you sleep.",
      lock_forward:
        "Sign multi-month or annual sponsorship and production contracts with upfront payment terms — six-month brand partnerships, annual content licensing deals, and pre-paid production retainers. Negotiate 30-50% upfront payment on all production projects to establish cash flow before delivery. Every long-term contract you sign provides months of forward revenue certainty that ad-hoc project work cannot match.",
    },

    actionLabels: {
      convert_retainer: "Secure a recurring content or production deal",
      add_client: "Pitch brands in three new industry categories",
      build_passive: "Create an evergreen digital product from your expertise",
      lock_forward: "Sign multi-month or annual production contracts",
    },

    microSteps: {
      convert_retainer: ["Identify your strongest brand or production relationship", "Propose a multi-month or annual content agreement", "Send the pitch this week — the partnership framework is below"],
      add_client: ["List 3 industry categories beyond your current sponsor base", "Build a media kit showing audience crossover potential", "Pitch one brand in each new category this month"],
      build_passive: ["Identify your most in-demand creative skill or process", "Package it as a course, template pack, or digital product at $29-$99", "Launch it to your audience with a 30-day marketing push"],
      lock_forward: ["Review all current project-based agreements", "Propose 6-month or annual terms on your next 3 brand conversations", "Negotiate 30-50% upfront payment on all new production deals"],
    },

    constraints: {
      high_concentration:
        "Your income is dangerously dependent on a single brand partner, platform, or content buyer. In creative media, concentration is amplified by platform dependency — if your primary revenue comes through one social platform's algorithm, a single policy change or algorithmic shift can decimate your reach and income simultaneously. Your financial life is shaped by decisions made in corporate offices you have no access to.",
      low_recurrence:
        "Your income comes from discrete productions, one-time brand deals, and project fees that end when the deliverable is complete. Without subscription revenue, licensing agreements, or retainer partnerships, every completed project leaves a revenue gap. Creators who build recurring income from memberships, licensing, and long-term brand retainers have a fundamentally different financial experience than project-based producers.",
      low_diversification:
        "Your revenue is concentrated in a single content format, distribution platform, or audience demographic. If that platform changes its algorithm, your content format falls out of favor, or your audience demographic shifts their attention, your entire income structure is disrupted. Diversified creators who produce across multiple formats and platforms weather industry shifts far more effectively.",
      low_forward_visibility:
        "You lack signed production contracts or confirmed sponsorships extending more than 30-60 days ahead. Your income depends on deals that have not been negotiated yet, audiences that may or may not engage, and platforms whose algorithms change without notice. This makes financial planning feel like guessing rather than forecasting.",
      high_variability:
        "Your monthly income swings dramatically between months with brand deal payments, production fees, and platform revenue bumps, and months where nothing lands. A $20,000 month followed by a $2,000 month is normal in creative work, but this volatility creates emotional and financial instability that undermines your ability to invest in your craft and grow your business.",
      high_labor_dependence:
        "Every video, article, design, performance, and brand deliverable requires your personal creative effort. You are the talent, the producer, and the brand — none of which can be delegated without fundamentally changing what you offer. This means your income is capped by your creative output capacity and directly impacted by creative blocks, fatigue, or personal disruption.",
      low_passive_income:
        "Beyond ad revenue on existing content (which decays over time), you have not built income streams that generate revenue without ongoing creative production. Top creators build product lines, licensing catalogs, and membership communities that earn independently of their active content schedule. Without these, taking a break means taking a pay cut.",
      low_continuity:
        "Your creative business is inseparable from your personal output and brand. If you stopped creating, your audience would gradually disperse, brand partners would move on, and platform algorithms would deprioritize your content. There is no entity, product, or team that would continue generating significant revenue in your extended absence.",
    },

    behaviors: {
      high_concentration:
        "Your income is controlled by one brand's marketing budget or one platform's algorithm. Changes you cannot predict or influence — a brand CMO departure, an algorithm update, a platform policy shift — have outsized impact on your financial stability. You structure your creative decisions around keeping that single revenue source happy rather than building your own vision.",
      low_recurrence:
        "Each project or brand deal is an isolated revenue event with a defined end date. When the production wraps or the sponsorship period concludes, the income stops completely. You are perpetually selling the next project while delivering the current one, which divides your creative energy and limits the quality of both.",
      low_diversification:
        "When your primary platform, format, or audience shifts, your entire income is affected. Creators who only do YouTube, only do photography, or only serve one brand category experience existential risk from changes that diversified creators absorb without significant disruption.",
      low_forward_visibility:
        "You do not know what your income will be two months from now because it depends on brand deals not yet negotiated, content not yet produced, and audience engagement not yet measured. This uncertainty makes it impossible to commit to personal financial goals, equipment investments, or team expansion with confidence.",
      high_variability:
        "Your revenue chart looks like a mountain range — dramatic peaks from brand payments and production fees separated by valleys of minimal income. The emotional toll of this volatility is significant, as the anxiety during low months can undermine the creative confidence you need during productive periods.",
      high_labor_dependence:
        "You are the product. Your face, voice, expertise, and creative vision are what brands pay for and audiences consume. No amount of automation or delegation can fully replace your personal creative involvement, which means your income is permanently tethered to your energy, health, and inspiration.",
      low_passive_income:
        "When you are not actively producing and publishing, your income drifts toward zero. Legacy content generates declining residuals, but new revenue requires new creative output. Your catalog is an asset, but without ongoing production, it is a depreciating one.",
      low_continuity:
        "Your creative brand is a personal brand. Audiences follow you, brands partner with you, and platforms promote you — the person. If you stepped away for a year, your audience would find new creators, your brand deals would lapse, and your platform positioning would be replaced by whoever filled the gap in your absence.",
    },

    improvements: {
      high_concentration: [
        "Actively pitch brands in three industry categories outside your current primary sponsor, building a diversified sponsor portfolio where no single brand exceeds 25% of your total income.",
        "Distribute your content across at least three platforms (video, audio, written, social) so that no single platform's algorithm controls your audience reach and monetization.",
        "Develop direct-to-audience revenue streams (memberships, products, events) that are platform-independent, ensuring you maintain income even if a brand partner or platform relationship changes.",
      ],
      low_recurrence: [
        "Launch a membership or subscription community (Patreon, paid newsletter, Discord membership) where your most engaged audience pays monthly for exclusive access, creating predictable recurring revenue.",
        "Convert your best brand partnerships from project-based to retainer-based — propose a monthly creative retainer with defined deliverables that bills automatically instead of per-project invoicing.",
        "License your existing content catalog to stock platforms, music libraries, or media distributors who pay ongoing royalties, turning your back catalog into a revenue-generating asset.",
      ],
      low_diversification: [
        "Expand into adjacent content formats — if you do video, add a podcast; if you write, add visual content — reaching audiences through channels you do not currently serve.",
        "Target brand partnerships in at least three different industry sectors, ensuring that a marketing budget cut in any single industry does not eliminate your sponsorship income.",
        "Build a physical or digital product line (merch, templates, presets, courses) that generates revenue independent of content production or brand partnerships.",
      ],
      low_forward_visibility: [
        "Sign multi-month or annual sponsorship and licensing contracts with upfront payment terms, creating committed forward revenue for at least the next two quarters.",
        "Build an event, workshop, or appearance calendar booked three to six months in advance, providing revenue visibility from confirmed engagements beyond your content production schedule.",
        "Pre-sell production packages or content series to brands with advance payment, locking in revenue before creative work begins.",
      ],
      high_variability: [
        "Build membership and licensing revenue to cover your fixed personal expenses, so that brand deals, production fees, and platform revenue only affect your discretionary income and savings.",
        "Establish a revenue smoothing system — deposit all income into a business account and draw a fixed monthly salary, letting the surplus accumulate as a buffer for lean months.",
        "Diversify your income across multiple revenue types (brand deals, audience revenue, product sales, licensing) so that the timing and variability of each is offset by the others.",
      ],
      high_labor_dependence: [
        "Hire a production assistant or editor who can handle post-production, scheduling, and distribution, freeing your creative time for the high-value work only you can do — ideation, performance, and brand relationships.",
        "Build a content system with templates, workflows, and batching processes that increase your output per hour, reducing the labor cost of each piece of content you produce.",
        "Develop products (courses, presets, templates) that leverage your expertise into one-time creative efforts with ongoing sales, decoupling revenue from your ongoing production schedule.",
      ],
      low_passive_income: [
        "Create a digital product suite — courses, templates, presets, or guides — priced at $20-$200 and sold through your audience channels, generating revenue from every new follower without additional production work.",
        "License your content catalog to stock platforms, media libraries, and content distributors who pay per-use or subscription-based royalties on your existing work.",
        "Build an evergreen content strategy — tutorials, educational series, resource guides — that continues generating ad revenue, affiliate income, and product sales months or years after initial publication.",
      ],
      low_continuity: [
        "Build a content library of evergreen material that continues performing in algorithms and generating revenue even during extended breaks from active production.",
        "Develop a team (editor, social manager, production assistant) capable of maintaining your content schedule and audience engagement during temporary absences.",
        "Structure brand partnerships with deliverable flexibility that allows pre-produced or team-produced content to fulfill obligations if you need to step back from active creation.",
      ],
    },

    industry_context:
      "Creative and media professionals operate in an industry where your personal talent, vision, and audience relationship are the product — creating extraordinary earning potential alongside extreme personal dependency. Revenue comes from a patchwork of brand sponsorships, production fees, platform ad share, licensing, and audience-funded memberships, each with different risk profiles and payment patterns. The fundamental tension is between creating work that feeds algorithms today and building assets (products, licenses, evergreen content) that generate revenue tomorrow. Creators who achieve financial resilience are those who deliberately build recurring income streams alongside their active production work.",

    stats: {
      general:
        "Full-time content creators and media professionals report median earnings of $68,000, with the top 5% exceeding $300,000+. However, creator income is notoriously volatile — 73% report that their highest-earning month is more than 3x their lowest-earning month within any given year. Platform algorithm changes are cited as the top income risk by 61% of creators.",
      redAvg: 27,
      greenAvg: 65,
    },

    reassessment: {
      recurrence:
        "Have you launched a membership program, signed retainer-based brand partnerships, or established any licensing arrangements that now generate predictable monthly revenue?",
      concentration:
        "Has the percentage of your income from a single brand partner, platform, or content buyer changed since your last assessment?",
      diversification:
        "Are you now earning revenue from content formats, platforms, or brand categories you were not active in previously?",
      forward:
        "Do you have more signed production contracts, confirmed sponsorships, and pre-sold content packages than at your last assessment?",
      variability:
        "Over the past six months, has the gap between your highest-earning and lowest-earning months narrowed?",
      labor:
        "Have you hired production support, launched digital products, or built systems that generate revenue without requiring your personal creative involvement in every deliverable?",
    },

    worker_context: {
      pressure_framing:
        "This person is a creative or media professional whose income depends on content production, brand partnerships, and audience engagement. Pressure points include brand sponsor concentration, platform algorithm dependency, the labor intensity of constant content creation, and the volatility of project-based production income. Frame risks in terms of brand deals lost, platform changes reducing reach, creative burnout, and the decay of audience engagement during production breaks.",
      tailwind_framing:
        "Strengths in creative media manifest as diversified brand partnerships, growing audience-funded memberships, licensing revenue from a content catalog, digital product sales, and a production team that maintains output. Frame improvements in terms of recurring revenue streams added, brand partnerships diversified, digital products launched, and platform dependency reduced.",
      arrangement_types:
        "Brand sponsorship deals, production project fees, platform ad revenue share, content licensing royalties, membership and subscription audience revenue, digital product sales, event appearance fees, and affiliate commission income.",
      peer_group_label:
        "creative and media professionals including content creators, producers, artists, photographers, influencers, and media entrepreneurs",
    },
  },

  /* ================================================================ */
  /*  10. CONSTRUCTION / TRADES                                        */
  /* ================================================================ */
  construction_trades: {
    industry_key: "construction_trades",
    industry_label: "Construction / Trades",

    nouns: {
      recurring_revenue: "maintenance contracts and service agreement fees",
      top_client: "primary general contractor or anchor project client",
      pipeline: "awarded bids and projects under contract",
      passive_income: "service agreement revenue and equipment rental income",
      forward_commitment: "signed construction contracts and awarded bid confirmations",
      active_work: "completing projects, performing service calls, and managing job sites",
    },

    scenarios: {
      lose_top_client:
        "Your biggest general contractor — the one who feeds you three to five subcontract projects per year worth $200,000 to $500,000 in total — takes their work to a competitor or loses their own contracts. That single relationship may represent 40% of your annual revenue, and in construction, replacing it means winning new bids against every other sub in your trade. The bidding process is competitive, time-intensive, and uncertain — you may submit 10 bids to win two, and the timeline from bid to mobilization can stretch months.",
      cant_work_90_days:
        "A jobsite injury, back surgery, or personal emergency takes you off the tools and out of the field for 90 days. Your active projects face immediate disruption — crews need supervision, inspections need scheduling, and clients need communication. If you are the primary tradesperson on your jobs, work simply stops. If you have a crew, they need direction, and without your oversight, quality and timeline slip. Your overhead — truck payments, insurance, tool maintenance, crew wages — continues regardless.",
      market_slowdown:
        "Interest rates rise and new construction permits drop 30-40% in your market. Homeowners defer renovations, developers shelve projects, and general contractors reduce their subcontractor lists. Your bid pipeline shrinks, and the bids you do win are at compressed margins because every contractor in your area is chasing the same reduced volume. Service work picks up slightly as people repair instead of replace, but it does not come close to replacing your project revenue.",
      pipeline_dries_up:
        "You have been heads-down on a major project for three months and realize you have not submitted a single new bid during that time. The project is wrapping up in four weeks, and there is nothing behind it — no awarded bids, no pending proposals, no scheduled estimates. In construction, the gap between finishing one job and starting the next can be devastating. Crew members take other work, cash flow drops to maintenance calls only, and the momentum that took years to build stalls completely.",
    },

    actions: {
      convert_retainer:
        "For service-oriented trades (HVAC, plumbing, electrical, landscaping): offer annual maintenance agreements to your past clients — a flat monthly or annual fee for priority service, seasonal maintenance, and discounted emergency rates. For project-based trades (GC, roofing, specialty): focus on locking multi-phase projects under single contracts with progress billing.",
      add_client:
        "Build relationships with three to five new general contractors, property management companies, or commercial building owners who are not currently in your network. Attend local builder association meetings, join the chamber of commerce, and offer competitive pricing on your first project with each new contact to demonstrate reliability and quality. In construction, trust is earned on the job site — one well-executed project with a new GC can generate years of repeat subcontract work.",
      build_passive:
        "Invest in specialized equipment that you can rent to other contractors when not in use on your own jobs. A scissor lift, excavator, or concrete pump sitting idle between projects can generate $500-$2,000 per week in rental income. Alternatively, acquire a small rental property where you can use your trade skills to renovate and maintain it yourself, generating monthly rental cash flow at a fraction of the cost an investor without your skills would face.",
      lock_forward:
        "Push for signed contracts with deposits on every project before mobilization — a 30-50% deposit upon contract execution, with milestone-based progress billing through completion. Submit bids on larger, longer-duration projects that provide three to six months of work per contract rather than one to two week jobs. Every multi-month contract you sign provides forward revenue visibility that short-term service calls cannot match.",
    },

    actionLabels: {
      convert_retainer: "Add a recurring service or maintenance line",
      add_client: "Build relationships with new GCs and property managers",
      build_passive: "Rent idle equipment or acquire a rental property",
      lock_forward: "Lock in multi-month contracts with deposits before mobilization",
    },

    microSteps: {
      convert_retainer: ["List your top 20 past clients from the last 2 years", "Draft a simple annual maintenance or priority service agreement", "Send the proposal this week — the template is below"],
      add_client: ["Identify 3-5 GCs or property managers outside your current network", "Attend the next local builder association meeting", "Offer competitive pricing on a first project to earn trust on the job site"],
      build_passive: ["Inventory any specialized equipment that sits idle between projects", "List it on peer-to-peer rental platforms or offer it to other contractors", "Alternatively, identify a small rental property to renovate with your trade skills"],
      lock_forward: ["Review your current pipeline for projects without signed contracts", "Require 30-50% deposits and milestone billing on every new project", "Bid on at least one larger, multi-month project this quarter"],
    },

    constraints: {
      high_concentration:
        "Your project revenue is dominated by a single general contractor, developer, or property owner. In construction, this dependency is compounded by the relationship-driven nature of subcontracting — GCs give repeat work to subs they trust, but that loyalty evaporates instantly when they lose their own contracts, find a cheaper competitor, or change project managers. Your income depends on someone else winning work first.",
      low_recurrence:
        "Your income comes project by project with nothing flowing between jobs. Each completed project leaves you searching for the next one, with crew costs, insurance premiums, and equipment payments continuing regardless. The most resilient trade businesses generate 20-30% of revenue from maintenance contracts and service agreements that pay monthly, and yours has not reached that threshold.",
      low_diversification:
        "Your work is concentrated in a single project type (new construction, renovation, or commercial) or a single trade specialty. If new construction permits drop, renovation demand shifts, or your specific trade faces reduced demand, your entire pipeline is affected. Contractors who serve both residential and commercial markets, or who offer both project work and ongoing service, weather market cycles far more effectively.",
      low_forward_visibility:
        "You lack awarded bids or signed contracts extending more than 30-60 days into the future. Your pipeline consists of bids submitted and waiting, estimates pending, and prospects who may or may not proceed — none of which are contractual commitments. This makes crew scheduling, equipment investment, and personal financial planning exercises in uncertainty.",
      high_variability:
        "Your monthly revenue swings dramatically based on project completion timing, progress billing schedules, and the gap between finishing one job and starting the next. Construction cash flow is notoriously lumpy — a $50,000 progress payment arrives one month, followed by two months of minimal income while you mobilize for the next project. This pattern creates chronic financial stress despite strong annual earnings.",
      high_labor_dependence:
        "Every project requires your physical presence — on the tools, supervising crews, managing inspections, and communicating with clients. Your body is your primary business asset, and your income is directly proportional to the hours you can work in the field. Injury, illness, or physical wear from decades of trade work creates a time-limited earning window that most office-based professionals never face.",
      low_passive_income:
        "You have not built any income streams that pay you when you are not on a job site. Top trade business owners build maintenance contract revenue, equipment rental income, or real estate portfolios (renovated with their own skills) that generate monthly cash flow independent of project work. Without these, your income stops the moment your tools go down.",
      low_continuity:
        "Your construction business depends on your personal skills, relationships, and field presence. If you were unable to work for an extended period, active projects would need to be subcontracted out (at your cost), future work would go to competitors, and your crew would find other employment. There is no structural mechanism to sustain revenue generation in your absence.",
    },

    behaviors: {
      high_concentration:
        "Your project calendar is controlled by your primary GC's schedule. When they have work, you are busy; when they do not, you scramble. This dependency prevents you from raising rates, negotiating better terms, or pursuing more profitable opportunities because you cannot risk alienating your primary revenue source.",
      low_recurrence:
        "Between projects, your revenue drops to whatever service calls you can pick up. The transition from a $80,000 project to $500 service calls creates dramatic income compression that forces you to dip into savings or delay personal expenses until the next project starts. Your income timeline is a series of plateaus and cliffs rather than a steady line.",
      low_diversification:
        "When your primary market segment slows — new construction freezes, commercial permits stall, or renovation demand dips — your entire operation feels it simultaneously. Contractors who only do one type of work in one market are fully exposed to cyclical downturns with no alternative revenue channel.",
      low_forward_visibility:
        "You cannot reliably predict your income beyond the current project's remaining draws. Bids submitted may or may not be awarded, and awarded bids may not mobilize for months. Your crew scheduling, equipment needs, and personal financial planning all operate under genuine uncertainty about what work is actually coming.",
      high_variability:
        "Your bank account fluctuates between project payments and the dry spells between jobs. Large draw payments create a false sense of abundance, masking the fact that those funds must cover weeks or months of overhead before the next payment arrives. This cash flow pattern makes construction one of the most financially stressful professions despite potentially strong annual earnings.",
      high_labor_dependence:
        "Your revenue is limited by how many hours your body can spend on the job site. Physical fatigue, weather days, and the cumulative toll of trade work create a ceiling on your annual earning capacity that tightens with every year in the field. You are one injury away from a complete income shutdown.",
      low_passive_income:
        "On weekends, holidays, and between projects, your income is zero. The physical assets you own (tools, trucks, equipment) cost money to maintain but generate nothing when not deployed on a job. Your trade skills — which could be leveraged into rental property income or equipment rental revenue — are currently used only for direct project work.",
      low_continuity:
        "Your business is functionally your personal labor capacity. Client relationships, trade knowledge, and crew management all depend on your daily involvement. If you stepped away, there is no system, team, or asset that would continue generating revenue in your absence.",
    },

    improvements: {
      high_concentration: [
        "Submit bids to at least three new general contractors or project owners each month, deliberately building relationships with decision-makers outside your current primary client network.",
        "Diversify your client mix by targeting property management companies, commercial building owners, and municipal bid opportunities that operate on different cycles than your primary GC's project schedule.",
        "Develop direct-to-homeowner marketing (yard signs, truck wraps, Google Local Services ads) that generates service and renovation leads independent of any GC relationship.",
      ],
      low_recurrence: [
        "Offer annual maintenance contracts to every past client — HVAC tune-ups, plumbing inspections, electrical checks, or seasonal property maintenance — creating monthly recurring revenue that fills gaps between projects.",
        "Build a service division within your business that handles repair calls, warranty work, and small jobs, generating consistent weekly revenue that supplements project-based income.",
        "Create property management maintenance agreements with landlords and HOAs for ongoing building maintenance, locking in monthly revenue with 12-month service contracts.",
      ],
      low_diversification: [
        "Add a service capability adjacent to your primary trade — if you do HVAC installation, add duct cleaning or indoor air quality services; if you do electrical, add generator installation and maintenance — expanding your addressable market.",
        "Pursue both residential and commercial work if you currently serve only one sector, accessing two market cycles that rarely move in lockstep.",
        "Offer emergency or after-hours service at premium rates, creating a high-margin revenue stream that operates independent of your standard project pipeline.",
      ],
      low_forward_visibility: [
        "Increase your bid volume by 50% — submit proposals on every qualified project in your capacity range, ensuring that your pipeline always contains enough potential work to fill your schedule even with typical win rates.",
        "Push for signed contracts with deposits at least 60 days before project start dates, creating a backlog of committed revenue that you can count on when planning crew schedules and equipment needs.",
        "Build relationships with developers and builders who plan projects in phases, positioning yourself as the preferred sub for multi-phase developments that provide work continuity across months or years.",
      ],
      high_variability: [
        "Implement progress billing on every project — negotiate monthly draws or bi-weekly payments based on completion percentage, rather than waiting for milestone completions to invoice.",
        "Build maintenance contract revenue to cover at least your fixed monthly overhead (truck payments, insurance, crew base wages), so project income variability only affects your profit margin rather than your ability to operate.",
        "Maintain a three-month operating reserve funded by setting aside 10-15% of every project payment, creating a cash buffer that smooths the impact of gaps between jobs.",
      ],
      high_labor_dependence: [
        "Train and develop a lead tradesperson on your crew who can manage job sites independently, allowing you to oversee multiple projects simultaneously and spend more time on bidding and client development.",
        "Invest in tools and technology that increase crew productivity — laser levels, power tools, project management apps — that multiply your team's output without requiring additional labor hours from you personally.",
        "Transition from being on the tools yourself to managing a crew of two to four tradespeople, converting your role from labor to management and removing your physical capacity as the ceiling on revenue.",
      ],
      low_passive_income: [
        "Purchase a rental property and use your trade skills to renovate it at a fraction of the cost a typical investor would pay — generating monthly rental income from an asset you can maintain yourself.",
        "Buy specialized equipment (excavator, lift, scaffold systems) and rent it to other contractors when not in use on your jobs, creating equipment rental income that generates revenue between your own projects.",
        "Build a trade training program or apprenticeship where aspiring tradespeople pay for instruction, converting your expertise into educational revenue that does not require job site labor.",
      ],
      low_continuity: [
        "Develop a crew of skilled tradespeople who can execute projects independently, creating operational capacity that survives any period when you are personally unable to be in the field.",
        "Document your bidding process, project management workflows, and client communication standards so that a foreman or business manager could maintain operations in your absence.",
        "Build your maintenance contract portfolio and equipment rental assets to a level that generates baseline revenue even during periods when project work is not being actively performed.",
      ],
    },

    industry_context:
      "Construction and trades professionals face a unique combination of high earning potential and extreme physical and financial vulnerability. Your income is earned project by project, with significant gaps between job completions that create cash flow stress even in strong markets. The physical demands of trade work add a time dimension to your risk — your body has a finite number of productive years, and every year on the tools brings you closer to the point where physical capacity limits your income. The contractors who build lasting financial security are those who transition from pure project work to a hybrid model: maintenance contracts for recurring revenue, crew development for operational leverage, and strategic asset acquisition (rental properties, equipment) that creates income independent of personal labor.",

    stats: {
      general:
        "The median construction contractor earns $65,000-$95,000 annually, while established specialty contractors with crews can exceed $150,000-$250,000. However, 60% of trade businesses report at least one project gap exceeding 30 days per year, and the construction industry has the highest rate of business failure in the first five years among all major sectors.",
      redAvg: 28,
      greenAvg: 64,
    },

    reassessment: {
      recurrence:
        "Have you added maintenance contracts, service agreements, or any recurring monthly revenue arrangements since your last assessment?",
      concentration:
        "Has the share of your total project revenue from your single largest client or GC relationship changed — have you added new project sources, or has one relationship become more dominant?",
      diversification:
        "Are you now performing work types, serving market segments, or bidding project categories that you were not active in before?",
      forward:
        "Do you currently have more awarded bids and signed contracts on your books than at your last assessment?",
      variability:
        "Over the past six months, has the gap between your highest-revenue and lowest-revenue months narrowed?",
      labor:
        "Have you developed crew leaders who can manage job sites independently, acquired rental assets, or built any income streams that generate revenue without your personal presence on the job site?",
    },

    worker_context: {
      pressure_framing:
        "This person is a construction or trades professional whose income depends on completing projects and winning bids. Pressure points include project gaps between completions, GC dependency for subcontract work, physical labor demands that create a finite earning window, and the cash flow volatility of milestone-based billing. Frame risks in terms of bids lost, project gaps, crew costs during downtime, and the physical toll that limits long-term earning capacity.",
      tailwind_framing:
        "Strengths in construction manifest as a deep backlog of signed contracts, maintenance agreements generating monthly revenue, a capable crew that operates independently, and income-producing assets (rental properties, equipment rentals) built using trade skills. Frame improvements in terms of contracts signed, maintenance agreements added, crew capability developed, and passive assets acquired.",
      arrangement_types:
        "Fixed-price project contracts, time-and-materials billing, progress draw payments, annual maintenance and service agreements, emergency service call revenue, equipment rental income, and subcontractor management fees.",
      peer_group_label:
        "construction and trades professionals including general contractors, specialty subcontractors, tradespeople, and construction business owners",
    },
  },

  /* ================================================================ */
  /*  DEFAULT FALLBACK                                                 */
  /* ================================================================ */

  education_training: {
    industry_key: "education_training",
    industry_label: "Education & Training",
    nouns: {
      recurring_revenue: "ongoing enrollment or institutional salary",
      top_client: "primary institution or anchor client",
      pipeline: "upcoming semesters, course registrations, or training inquiries",
      passive_income: "self-paced course sales or licensing royalties",
      forward_commitment: "contracted terms, booked workshops, or signed training agreements",
      active_work: "live instruction, coaching sessions, or curriculum delivery",
    },
    scenarios: {
      lose_top_client: "Your anchor institution decides not to renew your adjunct contract or your largest corporate training client pulls their annual program. That single loss could erase 40% or more of your teaching income overnight.",
      cant_work_90_days: "A vocal injury or health setback takes you out of the classroom for an entire quarter. Without you physically delivering lessons or facilitating workshops, every session-based fee stops and substitute coverage rarely pays you a dime.",
      market_slowdown: "Budget cuts sweep through school districts and corporate L&D departments simultaneously. Training is always the first line item slashed, and you watch enrollment numbers and RFP volume collapse in the same month.",
      pipeline_dries_up: "Summer break hits, corporate budgets freeze for Q4 planning, and your course registration page goes quiet. You have zero new sign-ups, no workshop inquiries, and months of dead air ahead.",
    },
    actions: {
      convert_retainer: "For independent trainers and tutors: propose annual retainers to institutional clients — guaranteed workshops per semester at a locked rate. For employed educators: negotiate multi-year contracts with step increases and guaranteed placement. For adjuncts: secure course commitments for the full academic year, not semester-by-semester.",
      add_client: "Reach out to three new schools, districts, or corporate HR departments this month with a tailored pitch deck showing measurable learning outcomes from your programs. Each new institutional relationship reduces your dependence on any single contract.",
      build_passive: "Record your highest-demand workshop or lecture series as a polished self-paced course on a platform like Teachable or Udemy. Once published, every sale generates income whether you are lecturing that day or not.",
      lock_forward: "Get next semester's contracts signed before the current one ends. Push for multi-term agreements with institutions and ask corporate clients to book their entire annual training calendar now at a locked-in rate.",
    },

    actionLabels: {
      convert_retainer: "Lock in multi-term commitments",
      add_client: "Pitch three new institutional clients this month",
      build_passive: "Record your top workshop as a self-paced course",
      lock_forward: "Sign next semester's contracts before this one ends",
    },

    microSteps: {
      convert_retainer: ["Identify your top 3 institutional clients or your department head", "Draft a proposal for a full-year or multi-semester commitment", "Present it before the current term scheduling window closes"],
      add_client: ["List 3 schools, districts, or corporate HR departments you have never pitched", "Send a tailored pitch showing measurable learning outcomes", "Offer a free sample workshop or pilot session to demonstrate value"],
      build_passive: ["Identify your highest-demand workshop or lecture series", "Record and package it as a self-paced course on Teachable or Udemy", "Set a 60-day launch deadline and promote it to your existing network"],
      lock_forward: ["List all current contracts and their end dates", "Begin renewal conversations at the midpoint of each engagement", "Push for full academic year commitments at locked-in rates"],
    },
    constraints: {
      high_concentration: "A huge share of your teaching income flows from one institution or one corporate client. If that relationship ends — whether from budget cuts, leadership turnover, or restructuring — you face an immediate income cliff with no quick replacement.",
      weak_forward_visibility: "You rarely know your course load or workshop schedule more than one term in advance. Institutions finalize budgets late, corporate clients approve training last-minute, and you are left guessing about next quarter's income until contracts actually land.",
      high_labor_dependence: "Every dollar you earn requires you standing in front of a classroom or on a video call. There is no leverage in your model — if you cannot physically or mentally deliver instruction, the revenue stops completely.",
      low_persistence: "When a semester ends or a training contract wraps up, the income from it simply stops. There is no residual tail unless you have negotiated ongoing access fees or follow-up coaching baked into the agreement.",
      low_source_diversity: "Your income comes from the same type of buyer — either institutions or corporate clients — and often through a single channel. A policy change in higher ed funding or a shift in corporate training budgets hits every revenue line at once.",
      high_variability: "Your monthly income swings wildly between peak semesters and dead periods like summer break or holiday months. January and September feel abundant; June and December feel hollow.",
      weak_durability: "Teaching contracts are renewed at the institution's discretion, often annually. You have little contractual protection if a dean decides to consolidate courses or a company reorganizes its L&D priorities.",
      shallow_continuity: "Each course or workshop is a discrete engagement with a clear end date. Without deliberate effort to create continuity — follow-up programs, alumni offerings, ongoing coaching — every engagement is a one-and-done transaction.",
    },
    behaviors: {
      high_concentration: "You keep accepting more sections or workshops from your largest client because it is easy and familiar. Meanwhile, you have not pitched a new institution in over a year, and your income dependency deepens with every additional course you teach for them.",
      weak_forward_visibility: "You wait for institutions to post openings or send RFPs rather than proactively securing commitments. By the time you react, the best contracts are already filled and you are left scrambling for leftover sections.",
      high_labor_dependence: "You have not invested any time in creating asynchronous content — no recorded courses, no downloadable curriculum kits, no licensed materials. Every hour of income requires an hour of your live presence.",
      low_persistence: "When a training contract ends, you move on to the next one without building any ongoing relationship. You never propose a follow-up coaching package or a refresher series that would keep revenue flowing between major engagements.",
      low_source_diversity: "All your training clients are in the same sector — all K-12, all corporate, or all higher ed. You have not explored adjacent markets like professional associations, government agencies, or community education programs.",
      high_variability: "You accept the feast-or-famine academic calendar as inevitable rather than deliberately booking summer intensives, corporate off-cycle workshops, or international programs to fill the gaps.",
      weak_durability: "You operate on handshake agreements and semester-by-semester renewals instead of pushing for multi-year contracts with automatic renewal clauses. Every term feels like starting from scratch.",
      shallow_continuity: "You treat each cohort as a closed chapter. You do not maintain an alumni network, offer advanced follow-up courses, or create a learning community that generates ongoing engagement and revenue.",
    },
    improvements: {
      high_concentration: [
        "Pitch your training programs to two new institutions or companies in a different sector this quarter",
        "Set a personal rule that no single client accounts for more than 30% of your annual teaching income",
        "Develop a modular curriculum that can be adapted for multiple industries, making it easier to diversify quickly",
      ],
      weak_forward_visibility: [
        "Begin next-term contract discussions at the midpoint of each current engagement, not after it ends",
        "Create an annual training calendar template and present it to corporate clients for full-year booking",
        "Build a waitlist system for your most popular courses so you have demand data before each enrollment cycle",
      ],
      high_labor_dependence: [
        "Record and package your top three workshops as self-paced online courses this quarter",
        "License your proprietary curriculum to other trainers or institutions for a recurring royalty",
        "Create a train-the-trainer certification program that lets others deliver your content while you earn fees",
      ],
      low_persistence: [
        "Add a three-month follow-up coaching package as a standard upsell to every training engagement",
        "Launch a monthly alumni webinar or learning community that keeps past participants paying a small subscription",
        "Negotiate contracts that include post-delivery check-in sessions billed at your standard hourly rate",
      ],
      low_source_diversity: [
        "Identify three non-traditional buyers — associations, government agencies, or nonprofits — and send tailored proposals",
        "Adapt your existing curriculum for a completely different audience segment than your current base",
        "List your training services on at least two new procurement platforms or directories this month",
      ],
      high_variability: [
        "Book at least one summer intensive or off-cycle corporate workshop before March each year",
        "Create a subscription-based micro-learning series that generates steady monthly income year-round",
        "Negotiate payment schedules with institutional clients that spread fees evenly across 12 months",
      ],
      weak_durability: [
        "Propose multi-year training agreements with built-in annual escalators to your top three clients",
        "Add automatic renewal clauses to every new contract you sign going forward",
        "Document measurable outcomes from your programs so clients have hard data supporting renewal decisions",
      ],
      shallow_continuity: [
        "Build an alumni learning community with a paid annual membership for ongoing access to resources",
        "Design a progressive curriculum pathway — beginner, intermediate, advanced — that keeps learners enrolled across terms",
        "Offer a standing office-hours subscription for past students who want ongoing access to your expertise",
      ],
    },
    industry_context: "Education and training professionals live at the mercy of institutional calendars and budget cycles. Your income often concentrates around September and January enrollments, leaving long dry stretches that test your reserves. The shift to online and hybrid delivery has opened new channels but also invited global competition for the same learners. Building a portfolio that blends institutional contracts, corporate training, and self-paced digital courses is the most reliable path to smoothing out those brutal seasonal swings.",
    stats: {
      general: "Education professionals with diversified delivery models — mixing institutional, corporate, and digital course income — report 35% less income volatility than those relying on a single channel.",
      redAvg: 38,
      greenAvg: 72,
    },
    reassessment: {
      recurrence: "Have you added any new ongoing contracts, subscription courses, or recurring training retainers since your last assessment?",
      concentration: "Has the share of income from your largest institution or client changed — did you reduce dependency or did it grow?",
      diversification: "Are you now serving new types of buyers — different sectors, new platforms, or different learner demographics — compared to before?",
      forward: "How far out is your teaching calendar booked? Do you have confirmed engagements further into the future than last time?",
      variability: "Did your month-to-month income even out, or are the peaks and valleys still as dramatic as before?",
      labor: "Have you launched any asynchronous courses, licensed materials, or other income streams that do not require your live presence?",
    },

    worker_context: {
      pressure_framing: "As an educator, your income pressure often comes from institutional dependency and calendar-driven enrollment gaps that leave you without revenue for months at a time.",
      tailwind_framing: "Your expertise has compounding value — every course you develop, every curriculum you refine, and every student outcome you document becomes a reusable asset that can generate income across multiple channels.",
      arrangement_types: "institutional salary, adjunct contracts, corporate training agreements, private tutoring, online course sales, curriculum licensing, speaking engagements, coaching retainers",
      peer_group_label: "educators, trainers, and course creators",
    },
  },

  retail_ecommerce: {
    industry_key: "retail_ecommerce",
    industry_label: "Retail & E-Commerce",
    nouns: {
      recurring_revenue: "subscription orders, repeat buyer revenue, or standing wholesale accounts",
      top_client: "highest-volume buyer, top wholesale account, or primary marketplace channel",
      pipeline: "inventory on hand, pre-orders, and inbound purchase intent",
      passive_income: "automated storefront sales, dropship margins, or affiliate commissions",
      forward_commitment: "purchase orders, pre-sale commitments, or contracted wholesale terms",
      active_work: "order fulfillment, customer service, merchandising, and inventory management",
    },
    scenarios: {
      lose_top_client: "Your top wholesale account — the one responsible for your biggest monthly purchase orders — switches suppliers. Or Amazon suspends your seller account without warning. Either way, the revenue channel you have built everything around goes dark.",
      cant_work_90_days: "A health issue pulls you away from the business for three months. Without you managing inventory, processing orders, and handling customer issues, fulfillment slows to a crawl and your ratings tank on every platform.",
      market_slowdown: "Consumer spending tightens across every channel. Your average order value drops, cart abandonment spikes, and the holiday bump you were counting on barely materializes. Inventory sits on shelves burning carrying costs.",
      pipeline_dries_up: "Your supplier raises prices 25%, your best-selling product gets knocked off by a cheaper competitor, and your ad spend stops converting. The traffic and orders you relied on evaporate in a matter of weeks.",
    },
    actions: {
      convert_retainer: "Approach your most consistent wholesale buyers about a standing monthly order at a small discount. Guaranteed volume each month lets you forecast inventory needs accurately and creates a predictable revenue floor beneath your variable retail sales.",
      add_client: "Open your products on two new sales channels this quarter — whether that is a new marketplace, a retail partnership, or a B2B wholesale portal. Each channel you add insulates you from algorithm changes or policy shifts on any single platform.",
      build_passive: "Set up a subscription box or auto-replenishment program for your consumable or frequently reordered products. Customers opt in once and generate recurring revenue every month without any additional marketing spend per order.",
      lock_forward: "Run a pre-sale campaign for your next product launch or seasonal collection. Collect deposits or full payments before you commit to production, giving you confirmed demand and cash flow before inventory costs hit.",
    },

    actionLabels: {
      convert_retainer: "Set up subscription or auto-replenish for top products",
      add_client: "Open your products on two new sales channels",
      build_passive: "Launch a subscription box or auto-replenishment program",
      lock_forward: "Run a pre-sale campaign for your next product launch",
    },

    microSteps: {
      convert_retainer: ["Identify your 3 best-selling consumable or repeat-purchase products", "Set up a subscription option with a 10-15% discount for commitment", "Email your top 50 customers with the subscription offer this week"],
      add_client: ["Research 2 new sales channels — a niche marketplace, retail partnership, or B2B portal", "List your top products on each new channel this quarter", "Track channel-specific performance weekly for the first 90 days"],
      build_passive: ["Identify which products customers reorder most frequently", "Create a curated monthly subscription box or auto-ship option", "Promote it with a launch discount to your existing customer list"],
      lock_forward: ["Plan your next product launch or seasonal collection", "Set up a pre-sale page to collect deposits before committing to production", "Promote the pre-sale to your email list and social channels"],
    },

    constraints: {
      high_concentration: "Most of your sales volume flows through a single marketplace or one dominant wholesale account. If that platform changes its fee structure or that buyer finds a cheaper source, your primary revenue channel collapses with no backup ready.",
      weak_forward_visibility: "You cannot see further than your current inventory cycle. Consumer demand shifts on a dime, trending products peak and crash unpredictably, and you are always reacting to last week's sales data instead of next month's confirmed orders.",
      high_labor_dependence: "You are personally handling product sourcing, listing optimization, fulfillment, and customer service. The entire operation stalls when you step away, and hiring feels impossible when margins are already thin.",
      low_persistence: "Each sale is a discrete transaction. Unless a customer explicitly reorders or subscribes, yesterday's buyer generates zero revenue today. You are perpetually hunting for the next purchase.",
      low_source_diversity: "Your product line is narrow or your customer base is homogeneous. A single trend shift — a new competitor, a viral negative review, a change in consumer preference — can undercut your entire catalog at once.",
      high_variability: "Your revenue graph looks like a roller coaster. Holiday spikes dwarf spring lulls, promotional weekends create artificial peaks, and organic baseline sales feel anemic by comparison.",
      weak_durability: "Marketplace rankings, ad performance, and customer attention are fragile. A competitor undercutting your price by a dollar, a slight algorithm tweak, or a supply chain hiccup can knock you from page one to page five overnight.",
      shallow_continuity: "You have no structured mechanism to bring buyers back after their first purchase. No loyalty program, no post-purchase email sequence, no subscription option — every customer walks out the door and may never return.",
    },
    behaviors: {
      high_concentration: "You pour all your optimization energy into a single platform because that is where the volume is. You have not seriously explored other channels because they seem like too much work for uncertain returns.",
      weak_forward_visibility: "You order inventory based on gut feel and last season's performance rather than collecting pre-orders or running demand tests. When a product flops, you are stuck with dead stock eating into your margins.",
      high_labor_dependence: "You handle everything from photography to packing tape because nobody else knows your products the way you do. You have not documented a single process or trained anyone to cover for you.",
      low_persistence: "You celebrate a big sales day and then wonder why next Tuesday is dead. You have not built any mechanism — email flows, loyalty rewards, subscription offers — to turn one-time buyers into repeat customers.",
      low_source_diversity: "Your entire catalog targets the same customer persona. You have not tested adjacent product categories, different price tiers, or B2B opportunities that could smooth out consumer demand fluctuations.",
      high_variability: "You lean heavily on promotional events and seasonal spikes to make your annual numbers. Between those peaks, you accept low sales as normal rather than building consistent demand drivers.",
      weak_durability: "You chase trending products instead of building a brand that customers seek out. When trends shift, you are left with inventory nobody wants and no loyal customer base to fall back on.",
      shallow_continuity: "After a customer's order ships, they never hear from you again. You have no post-purchase touchpoint, no replenishment reminder, and no reason for them to come back except their own memory.",
    },
    improvements: {
      high_concentration: [
        "Launch your products on at least two new sales channels — your own Shopify store, a niche marketplace, or a local retail partnership",
        "Cap any single channel at 50% of total revenue and actively redirect growth investment into secondary channels",
        "Build a direct-to-consumer email list so you own the customer relationship independent of any marketplace",
      ],
      weak_forward_visibility: [
        "Run pre-sale campaigns or waitlist sign-ups before committing to large inventory purchases",
        "Implement a simple demand forecasting tool that combines historical sales data with current traffic trends",
        "Negotiate smaller, more frequent inventory orders with suppliers to reduce the cost of demand misses",
      ],
      high_labor_dependence: [
        "Document your top five operational workflows — fulfillment, listing, customer service — so someone else can execute them",
        "Hire a part-time virtual assistant to handle order processing and customer inquiries this month",
        "Automate at least three repetitive tasks — shipping label generation, review requests, inventory alerts — using your platform's built-in tools",
      ],
      low_persistence: [
        "Launch a post-purchase email sequence that offers a discount on the next order within 30 days",
        "Create a subscription or auto-replenishment option for your most frequently reordered products",
        "Build a simple loyalty points program that rewards repeat purchases with escalating discounts",
      ],
      low_source_diversity: [
        "Test two adjacent product categories that serve your existing customer base but at different price points",
        "Explore a B2B or wholesale version of your best-selling products to add a completely different revenue stream",
        "Survey your existing customers about what else they buy regularly and develop or source one of those products",
      ],
      high_variability: [
        "Develop an evergreen product line that sells consistently regardless of season or promotional calendar",
        "Schedule monthly promotions or content drops that create regular demand spikes instead of relying only on major holidays",
        "Introduce a subscription box or curated monthly offering that generates steady baseline revenue",
      ],
      weak_durability: [
        "Invest in brand storytelling and packaging that creates customer loyalty beyond price competition",
        "Build a content strategy — blog, social, video — that drives organic traffic you control, not just paid ads",
        "Collect and prominently display customer reviews and testimonials to create social proof that competitors cannot easily replicate",
      ],
      shallow_continuity: [
        "Implement a post-purchase SMS or email flow that engages customers at 7, 30, and 60 days after their order",
        "Create a VIP or membership tier for your best customers with exclusive early access and special pricing",
        "Add a referral program that turns satisfied customers into acquisition channels for new buyers",
      ],
    },
    industry_context: "Retail and e-commerce operators face relentless pressure from platform dependency, razor-thin margins, and consumer attention spans measured in seconds. Your inventory is capital sitting on shelves depreciating, and every algorithm update can redirect your traffic to a competitor overnight. The businesses that thrive build owned channels — email lists, branded storefronts, subscription programs — so they are not one policy change away from disaster. Your strongest moat is a loyal customer base that buys from you, not from a search result.",
    stats: {
      general: "E-commerce sellers with three or more active sales channels experience 40% fewer revenue disruptions from platform policy changes than single-channel sellers.",
      redAvg: 34,
      greenAvg: 69,
    },
    reassessment: {
      recurrence: "Have you added any subscription offerings, auto-replenishment programs, or recurring wholesale orders since your last assessment?",
      concentration: "Is your revenue more spread across channels now, or has your dependence on a single marketplace grown since last time?",
      diversification: "Have you expanded your product catalog, entered new customer segments, or opened new sales channels?",
      forward: "Do you have more confirmed pre-orders, standing purchase orders, or contracted wholesale commitments than before?",
      variability: "Has your month-to-month revenue become more consistent, or are the seasonal spikes and valleys still extreme?",
      labor: "Have you automated more operations or hired help, or are you still the bottleneck for daily fulfillment and customer service?",
    },

    worker_context: {
      pressure_framing: "As a retail or e-commerce operator, your income pressure stems from platform dependency, inventory risk, and the constant battle for consumer attention in a crowded marketplace.",
      tailwind_framing: "Every repeat customer, every subscription sign-up, and every new channel you open compounds your resilience — the infrastructure you build today keeps generating sales without starting from zero each morning.",
      arrangement_types: "marketplace sales, direct-to-consumer storefront, wholesale accounts, subscription boxes, dropshipping, affiliate partnerships, pop-up retail, consignment arrangements",
      peer_group_label: "retail operators and e-commerce sellers",
    },
  },

  hospitality: {
    industry_key: "hospitality",
    industry_label: "Hospitality",
    nouns: {
      recurring_revenue: "standing corporate accounts, repeat group bookings, or long-term venue contracts",
      top_client: "anchor corporate account or highest-revenue event client",
      pipeline: "tentative bookings, event inquiries, and seasonal reservation projections",
      passive_income: "venue rental fees, licensing agreements, or co-branded product sales",
      forward_commitment: "confirmed reservations, signed event contracts, or deposited bookings",
      active_work: "event execution, nightly service, catering delivery, and guest management",
    },
    scenarios: {
      lose_top_client: "Your anchor corporate account — the one that books your private dining room every week and caters every quarterly meeting — moves their business to a competing venue. That single client represented a steady drumbeat of guaranteed covers and catering revenue that vanishes in one phone call.",
      cant_work_90_days: "A kitchen fire, a health code issue, or a personal medical emergency forces you to close operations for three months. In hospitality, dark doors mean zero revenue — there is no way to serve guests from your couch.",
      market_slowdown: "A recession hits and corporate travel budgets get slashed first. Business travelers stop booking rooms, companies cancel holiday parties, and weekend diners trade your restaurant for cheaper alternatives. Your fixed costs do not care about the economy.",
      pipeline_dries_up: "January arrives after the holiday rush, the phone stops ringing, and your event calendar is blank for the next eight weeks. No inquiries, no tentative holds, no walk-in traffic — just empty tables and idle staff you still have to pay.",
    },
    actions: {
      convert_retainer: "Pitch your top five corporate clients on an annual hospitality retainer — a set monthly fee that guarantees them priority booking, preferred pricing, and dedicated event coordination. You get predictable cash flow; they get VIP treatment without negotiating every event separately.",
      add_client: "Identify three corporate offices, wedding planners, or event agencies within a 20-mile radius that you have never pitched. Send a personalized tasting invitation or venue tour offer. Each new institutional relationship adds a booking pipeline that fills your slow periods.",
      build_passive: "License your signature recipes, sauces, or branded products for retail or online sale. Develop a venue rental package for photo shoots, pop-ups, or co-working that generates income from your space even when you are not serving guests.",
      lock_forward: "Require deposits for all bookings over 30 days out and offer a 10% discount for events booked and paid six months in advance. Convert tentative holds into confirmed, deposited commitments that give you bankable forward revenue.",
    },

    actionLabels: {
      convert_retainer: "Pitch corporate clients on annual event retainers",
      add_client: "Build relationships with new corporate and event clients",
      build_passive: "License recipes or develop venue rental packages",
      lock_forward: "Convert tentative holds into deposited commitments",
    },

    microSteps: {
      convert_retainer: ["List your top 5 corporate accounts from the past year", "Draft an annual hospitality package with monthly retainer pricing", "Send the proposal this week — the pitch template is below"],
      add_client: ["Identify 3 corporate offices, wedding planners, or event agencies nearby", "Send a personalized tasting invitation or venue tour offer", "Follow up within one week to schedule the visit"],
      build_passive: ["Identify your signature recipes, sauces, or branded products", "Explore retail packaging or online sale options", "Develop a venue rental package for photo shoots or pop-ups"],
      lock_forward: ["Review all tentative holds and pending inquiries", "Require deposits on all bookings over 30 days out", "Offer a 10% discount for events booked and paid 6 months in advance"],
    },

    constraints: {
      high_concentration: "One corporate account or event type dominates your bookings. If that single client restructures their office, changes caterers, or cancels their annual gala, you lose a disproportionate chunk of revenue with no immediate way to replace it.",
      weak_forward_visibility: "Event inquiries and reservations often come in waves with little advance notice. You cannot reliably predict what next month's covers, bookings, or catering orders will look like until they are actually on the books.",
      high_labor_dependence: "Hospitality is fundamentally a people business. Every plate served, every room turned, every event executed requires human hands. When your team is short-staffed or you personally step away, service quality and capacity drop immediately.",
      low_persistence: "Last Saturday's sold-out dining room generates zero revenue on Monday. Each night, each event, each booking is an independent transaction that ends when the last guest leaves and the lights go off.",
      low_source_diversity: "Your revenue may lean heavily on one type of service — just dining, just events, or just room nights. A downturn that hits that specific segment drags your entire operation down because you have no offsetting revenue stream.",
      high_variability: "Friday and Saturday carry the week. December carries the year. Your revenue concentration around peak periods means your average month looks nothing like your best month, and your worst months can barely cover fixed costs.",
      weak_durability: "Guest loyalty in hospitality is notoriously fickle. A single bad review, a new restaurant opening nearby, or a change in trends can redirect traffic away from you faster than you can adapt your concept.",
      shallow_continuity: "Most guests visit once or twice and drift away without any structured reason to return. You have no membership, no loyalty program, no automated touchpoint reminding them why they loved their experience with you.",
    },
    behaviors: {
      high_concentration: "You keep saying yes to every request from your biggest account because the revenue is reliable. You have stopped actively pursuing new corporate relationships because this one keeps the lights on — for now.",
      weak_forward_visibility: "You wait for the phone to ring instead of proactively filling your calendar. Your booking system is reactive, and you rarely reach out to past clients to secure future dates before they book elsewhere.",
      high_labor_dependence: "You are personally managing front-of-house, troubleshooting kitchen issues, and running every event. You have not cross-trained anyone to handle these responsibilities, so the operation depends entirely on your physical presence.",
      low_persistence: "After a great event, you send a thank-you and move on. You do not follow up with a rebooking offer, a next-event discount, or even a simple check-in that would keep the relationship warm and the calendar filling.",
      low_source_diversity: "You focus exclusively on the revenue stream you know best and have not explored adjacent opportunities — private dining, cooking classes, venue rentals, branded product lines — that could diversify your income.",
      high_variability: "You accept the seasonal roller coaster as just how hospitality works. You have not developed off-peak programming, weekday specials, or corporate lunch packages that could level out the revenue curve.",
      weak_durability: "You invest in ambiance and food quality but not in building a brand that transcends location. Your repeat business depends on proximity and habit, not on a relationship that would survive a move or a trend shift.",
      shallow_continuity: "Guests leave after a wonderful evening and never hear from you again. You collect no contact information, run no email campaigns, and offer no incentive for them to make their next reservation with you.",
    },
    improvements: {
      high_concentration: [
        "Set a target to add at least two new corporate accounts per quarter to dilute single-client dependency",
        "Develop packages targeting different client types — weddings, nonprofit galas, corporate retreats — to spread risk across event categories",
        "Create a referral incentive for your existing corporate clients to introduce you to other departments or partner companies",
      ],
      weak_forward_visibility: [
        "Implement a proactive rebooking outreach — contact every past event client 60 days before their likely next booking window",
        "Launch a seasonal pre-booking campaign offering priority dates and preferred pricing for early commitments",
        "Track inquiry-to-booking conversion rates monthly so you can forecast revenue from current pipeline volume",
      ],
      high_labor_dependence: [
        "Cross-train at least two team members on your core event management and guest service responsibilities",
        "Document your standard operating procedures for every service type so operations continue smoothly in your absence",
        "Invest in kitchen and service automation — prep systems, reservation management, automated communications — that reduce per-event labor requirements",
      ],
      low_persistence: [
        "Follow up every event with a personalized rebooking offer sent within 48 hours while the experience is still fresh",
        "Create quarterly themed events or seasonal menus that give past guests a specific reason to return",
        "Launch a chef's table or exclusive dining series with a recurring monthly format that locks in repeat attendance",
      ],
      low_source_diversity: [
        "Add at least one new revenue stream this quarter — venue rentals, cooking classes, branded retail products, or private dining packages",
        "Explore daytime revenue opportunities like corporate lunches, co-working space, or production kitchen rentals",
        "Partner with local businesses for cross-promotional packages — hotel plus dining, event space plus catering — that bring in new client types",
      ],
      high_variability: [
        "Develop dedicated weekday and off-peak programming — lunch specials, weeknight events, shoulder-season packages — to fill the gaps",
        "Negotiate annual corporate meal plans or monthly catering subscriptions that provide flat monthly revenue",
        "Create a private membership or dining club with monthly dues that generate steady income regardless of walk-in traffic",
      ],
      weak_durability: [
        "Build a recognizable brand identity — signature dishes, unique service rituals, distinctive design — that customers associate specifically with you",
        "Collect and amplify positive guest testimonials and press coverage to create a reputation moat around your business",
        "Develop proprietary recipes, events, or experiences that competitors cannot easily duplicate",
      ],
      shallow_continuity: [
        "Capture guest contact information at every touchpoint and build a segmented email list for targeted outreach",
        "Launch a loyalty or membership program that rewards repeat visits with escalating perks and exclusive access",
        "Send personalized milestone messages — anniversary of first visit, birthday offers, seasonal greetings — that maintain the relationship between visits",
      ],
    },
    industry_context: "Hospitality businesses burn cash every hour the doors are open, whether guests show up or not. Your rent, utilities, insurance, and payroll do not flex with demand, but your revenue absolutely does. The operators who survive long-term build institutional relationships that fill the calendar predictably, develop off-peak programming that smooths seasonal valleys, and create brand loyalty that outlasts any individual trend cycle. Your greatest asset is not your space — it is the relationships that fill it consistently.",
    stats: {
      general: "Hospitality operators with standing corporate accounts covering at least 25% of monthly revenue report significantly more stable cash flow than those relying entirely on transient bookings.",
      redAvg: 32,
      greenAvg: 66,
    },
    reassessment: {
      recurrence: "Have you secured any new standing accounts, recurring event contracts, or membership subscriptions since your last assessment?",
      concentration: "Has your largest client's share of revenue decreased, or have you become even more dependent on them?",
      diversification: "Are you generating revenue from new service types or client segments that you were not serving before?",
      forward: "How far into the future is your events and reservations calendar booked compared to last time?",
      variability: "Have your off-peak months improved, or is the gap between your best and worst months still just as wide?",
      labor: "Can your operation run without you for a week now? Have you reduced the number of tasks that only you can perform?",
    },

    worker_context: {
      pressure_framing: "As a hospitality professional, your income pressure comes from high fixed costs that run whether or not guests walk through the door, combined with seasonal demand swings that can leave you empty during slow periods.",
      tailwind_framing: "Every standing corporate account, every loyal regular, and every recurring event you secure acts as a revenue anchor — these relationships compound over time and give you a predictable foundation beneath the variable walk-in traffic.",
      arrangement_types: "restaurant revenue, catering contracts, event venue bookings, corporate dining accounts, hotel room nights, private dining series, venue rentals, pop-up partnerships",
      peer_group_label: "hospitality operators and event professionals",
    },
  },

  transportation: {
    industry_key: "transportation",
    industry_label: "Transportation & Logistics",
    nouns: {
      recurring_revenue: "standing route contracts, dedicated lane agreements, or repeat shipper relationships",
      top_client: "anchor shipper, primary broker, or highest-volume freight partner",
      pipeline: "posted loads, pending bids, and upcoming contracted shipments",
      passive_income: "equipment lease income, trailer rentals, or brokerage commissions on subcontracted loads",
      forward_commitment: "contracted freight lanes, booked loads, or signed hauling agreements",
      active_work: "loads in transit, dispatch operations, and driver hours on the road",
    },
    scenarios: {
      lose_top_client: "Your anchor shipper — the one who fills your trucks five days a week on a dedicated lane — moves their freight to a competitor who underbid you by pennies per mile. That single contract was keeping your fleet utilized, and now you are running half-empty searching for spot loads.",
      cant_work_90_days: "A DOT medical issue pulls your CDL or a serious accident takes you off the road for a quarter. If you are the primary driver, every truck that sits generates insurance and payment costs with zero revenue. Your dispatcher cannot will loads into existence without drivers to haul them.",
      market_slowdown: "Freight volumes collapse across the board. Spot rates crater, load boards are flooded with desperate carriers, and even your contracted rates get renegotiated downward. Every mile you drive earns less than it did last month, but diesel prices do not care about your rate per mile.",
      pipeline_dries_up: "Your contract lanes dry up simultaneously — seasonal shifts, shipper inventory reductions, and a broker who ghosted on promised volume. Your load board is showing nothing but bottom-rate freight moving in the wrong direction, and deadhead miles are eating your margins alive.",
    },
    actions: {
      convert_retainer: "Propose a minimum-volume commitment to your top three shippers — guaranteed truck availability in exchange for a minimum number of loads per week at a locked rate. This converts unpredictable spot freight into a steady baseline you can build dispatch schedules around.",
      add_client: "Register with three new freight brokers or reach out directly to shippers in industries you have not served before — agricultural, manufacturing, or retail distribution. Each new shipper relationship is another source of loads when your primary lanes go quiet.",
      build_passive: "If you own equipment that sits idle — trailers, chassis, containers — list them for rental on peer-to-peer platforms or lease them to other carriers. Idle assets should be generating income even when they are not hauling your freight.",
      lock_forward: "Negotiate quarterly or annual rate agreements with your best shippers before peak season. Lock in favorable rates while demand is strong and commit to capacity that keeps your trucks moving through slow periods at agreed-upon volumes.",
    },

    actionLabels: {
      convert_retainer: "Lock in minimum-volume commitments with top shippers",
      add_client: "Register with new brokers in untapped industries",
      build_passive: "Rent idle trailers and equipment to other carriers",
      lock_forward: "Negotiate annual rate agreements before peak season",
    },

    microSteps: {
      convert_retainer: ["Identify your top 3 shippers by weekly load volume", "Propose guaranteed truck availability in exchange for minimum weekly loads", "Lock in a rate that provides margin stability through slow periods"],
      add_client: ["Register with 3 new freight brokers or shipper directories", "Target industries you have not served — agriculture, manufacturing, or retail", "Run one load for each new relationship to prove reliability"],
      build_passive: ["Inventory all equipment that sits idle between loads", "List trailers and chassis on peer-to-peer rental platforms", "Set rental rates and availability windows for off-peak periods"],
      lock_forward: ["List your most profitable lanes over the past 12 months", "Approach those shippers about quarterly or annual rate agreements", "Lock in rates before the next peak season begins"],
    },

    constraints: {
      high_concentration: "The majority of your weekly loads come from a single shipper or broker. If they cut volume, renegotiate rates, or switch carriers, your fleet utilization drops to a level that cannot cover your fixed equipment and insurance costs.",
      weak_forward_visibility: "You rarely know what next week's loads look like until the weekend. Spot market dependence means you are constantly reacting to today's available freight rather than planning around confirmed future shipments.",
      high_labor_dependence: "Trucks do not drive themselves — yet. Every load requires a qualified driver behind the wheel, and driver shortages, turnover, and compliance requirements mean your capacity is always constrained by the humans available to operate your equipment.",
      low_persistence: "Each load is a one-time transaction. The moment delivery is confirmed, that revenue is done. Without a standing contract or lane agreement, tomorrow's income depends entirely on tomorrow's load board.",
      low_source_diversity: "You haul the same commodity type on the same lanes for the same handful of brokers. A downturn in that specific commodity or region hits every truck in your fleet simultaneously.",
      high_variability: "Freight rates swing dramatically with seasons, fuel prices, and economic cycles. A rate that was profitable in October can be below breakeven by February, and you have little control over any of the variables driving the change.",
      weak_durability: "Shipper loyalty in trucking is almost entirely rate-driven. A carrier willing to haul for five cents less per mile will take your lane tomorrow, regardless of your service quality or on-time record.",
      shallow_continuity: "Completed deliveries generate no ongoing revenue. Unless you have actively converted a lane into a standing contract, every successful haul is just a finished transaction with no guaranteed sequel.",
    },
    behaviors: {
      high_concentration: "You keep running the same lanes for the same shipper because the volume is consistent and the dispatch is easy. You have not bothered building backup relationships because this one keeps the trucks full — until it does not.",
      weak_forward_visibility: "You check the load board every morning hoping for good freight instead of calling shippers and brokers proactively to lock in loads for next week and next month.",
      high_labor_dependence: "You have not invested in driver retention programs, competitive pay structures, or recruiting pipelines. When a driver quits, you lose capacity for weeks while scrambling to find a replacement.",
      low_persistence: "After delivering a load, you move on to the next one without following up with the shipper about future needs. You treat every successful delivery as a closed file instead of an open relationship.",
      low_source_diversity: "All your freight is the same type — all dry van, all reefer, or all flatbed — serving the same industry. A downturn in that sector or a seasonal shift in that commodity type leaves your entire fleet idle.",
      high_variability: "You ride the rate cycles passively, accepting whatever the spot market offers instead of locking in contract rates that provide a floor during soft markets.",
      weak_durability: "You compete on price alone and have not differentiated your service in any way that would make a shipper hesitate before switching to a cheaper carrier.",
      shallow_continuity: "You do not track which lanes you run most profitably or follow up with shippers after delivery. Each load exists in isolation with no system for converting one-time hauls into regular routes.",
    },
    improvements: {
      high_concentration: [
        "Add at least two new shipper relationships per quarter in different industries to reduce single-client freight dependency",
        "Set a fleet utilization rule: no single shipper should account for more than 40% of your weekly loads",
        "Join a carrier network or cooperative that gives you access to diversified freight from multiple shippers",
      ],
      weak_forward_visibility: [
        "Call your top five shippers every Friday to book confirmed loads for the following week before touching the spot market",
        "Negotiate mini-bid contracts that lock in weekly minimum volumes on your most profitable lanes",
        "Track your historical lane data to predict seasonal freight patterns and proactively secure capacity commitments before peak demand",
      ],
      high_labor_dependence: [
        "Implement a driver retention program — performance bonuses, home-time guarantees, equipment upgrades — that reduces costly turnover",
        "Build a recruiting pipeline so you always have qualified driver candidates in queue before you need them",
        "Cross-train dispatchers and office staff so your operational capacity does not depend on any single person",
      ],
      low_persistence: [
        "Follow up with every shipper within 24 hours of delivery to ask about upcoming freight needs and express interest in regular lane coverage",
        "Propose standing lane agreements to any shipper you have hauled for three or more times",
        "Build a simple CRM tracking every shipper relationship, delivery history, and next follow-up date",
      ],
      low_source_diversity: [
        "Add capability for a different trailer type — flatbed, reefer, or tanker — to access freight markets your current equipment cannot serve",
        "Pursue freight in at least two different commodity sectors to insulate against single-industry downturns",
        "Explore last-mile, LTL, or expedited services as supplemental revenue streams that use different demand cycles",
      ],
      high_variability: [
        "Lock in contract rates on your most consistent lanes before the next bid season instead of relying on spot market pricing",
        "Build a cash reserve equal to two months of fixed costs during peak rate periods to survive soft market stretches",
        "Diversify into freight categories with counter-cyclical demand patterns — produce in summer, retail in Q4 — to balance seasonal swings",
      ],
      weak_durability: [
        "Differentiate your service with technology — real-time tracking, automated POD delivery, proactive exception alerts — that makes switching to a cheaper carrier inconvenient",
        "Build direct shipper relationships instead of relying solely on brokers, creating loyalty based on reliability rather than just rate",
        "Maintain a perfect on-time and claims-free record that becomes a competitive advantage shippers value above marginal rate differences",
      ],
      shallow_continuity: [
        "Convert your top five one-time lanes into standing weekly or monthly contracts with guaranteed volume commitments",
        "Implement post-delivery follow-up as a standard dispatch procedure, not an afterthought",
        "Create a preferred carrier program for your regular shippers with benefits that reward ongoing partnership over transactional booking",
      ],
    },
    industry_context: "Transportation is a capital-intensive, razor-margin business where your trucks cost money whether they are rolling or parked. Fuel prices, regulatory changes, and freight market cycles are entirely outside your control, but your lane diversity, shipper relationships, and contract mix are not. The carriers who build sustainable operations prioritize contracted freight over spot market volatility, invest in driver retention to maintain capacity, and diversify across industries so no single economic shift can idle their entire fleet.",
    stats: {
      general: "Carriers with at least 60% of their freight under contract rates — versus spot market pricing — report 30% more stable quarterly revenue than spot-dependent operators.",
      redAvg: 31,
      greenAvg: 65,
    },
    reassessment: {
      recurrence: "Have you converted any spot lanes into standing contracts or added new recurring freight commitments since your last assessment?",
      concentration: "Has your freight volume become more diversified across shippers, or are you still heavily dependent on one or two accounts?",
      diversification: "Are you hauling for new industries, running new lane types, or serving new geographies compared to before?",
      forward: "How many weeks of confirmed loads do you have booked ahead? Is your forward visibility longer or shorter than last time?",
      variability: "Has your rate per mile and weekly revenue become more consistent, or are you still riding the spot market roller coaster?",
      labor: "Have you improved driver retention, added capacity, or reduced your personal involvement in daily dispatch operations?",
    },

    worker_context: {
      pressure_framing: "As a transportation operator, your income pressure comes from the brutal combination of high fixed equipment costs, volatile freight rates, and the reality that parked trucks bleed money every single day.",
      tailwind_framing: "Every standing contract you secure, every new shipper relationship you build, and every lane you lock in ahead of time creates a foundation of predictable revenue that insulates you from spot market chaos.",
      arrangement_types: "dedicated lane contracts, spot market loads, broker agreements, shipper direct relationships, lease-on arrangements, owner-operator authority, fleet subcontracting, freight brokerage commissions",
      peer_group_label: "carriers, owner-operators, and logistics professionals",
    },
  },

  manufacturing: {
    industry_key: "manufacturing",
    industry_label: "Manufacturing",
    nouns: {
      recurring_revenue: "standing production orders, supply agreements, or long-term OEM contracts",
      top_client: "primary OEM buyer, anchor distributor, or highest-volume production customer",
      pipeline: "production backlog, quoted jobs, and RFQ responses pending decision",
      passive_income: "tooling royalties, licensing fees, or co-manufactured product margins",
      forward_commitment: "signed purchase orders, blanket orders, or contracted production schedules",
      active_work: "production runs, quality inspections, order fulfillment, and shop floor operations",
    },
    scenarios: {
      lose_top_client: "Your primary OEM buyer — the one whose standing orders keep your production line humming 40 hours a week — decides to bring fabrication in-house or shifts to an overseas supplier. That single decision leaves your shop running at 30% capacity with fixed overhead unchanged.",
      cant_work_90_days: "An equipment failure or a personal injury shuts down your production floor for a full quarter. Your customers cannot wait — they need parts now. By the time you are back online, they have qualified a backup supplier and your volume may never fully return.",
      market_slowdown: "A tariff war, raw material shortage, or demand contraction hits your customers' industries simultaneously. Order volumes drop across the board, your production schedule opens up with idle time, and you are still paying for machine leases, utilities, and floor labor.",
      pipeline_dries_up: "Your backlog evaporates as customers delay purchase orders, pending quotes go cold, and new RFQs stop arriving. Your shop has capacity and your team is ready, but there is simply no work to run — and every idle day burns cash.",
    },
    actions: {
      convert_retainer: "Negotiate blanket purchase orders with your top buyers — annual volume commitments at locked pricing with scheduled monthly releases. You get predictable production scheduling and guaranteed revenue; they get price certainty and priority capacity allocation.",
      add_client: "Attend an industry trade show or join a supplier directory in a vertical you have not served before. Each new customer in a different industry means your shop stays busy even when one sector slows down.",
      build_passive: "License your proprietary tooling designs, jigs, or processes to non-competing manufacturers in other regions. If you have developed custom fixtures or production methods, those intellectual assets can generate royalty income without consuming any shop floor time.",
      lock_forward: "Push for quarterly or annual purchase orders with firm delivery schedules instead of accepting one-off job orders. Offer a small volume discount for commitments that extend beyond 90 days to incentivize longer-term planning from your buyers.",
    },

    actionLabels: {
      convert_retainer: "Negotiate blanket purchase orders with top buyers",
      add_client: "Win customers in a new industry vertical",
      build_passive: "License proprietary tooling or processes for royalty income",
      lock_forward: "Push for quarterly or annual purchase orders with firm schedules",
    },

    microSteps: {
      convert_retainer: ["Identify your top 3 buyers by annual production volume", "Propose blanket purchase orders with monthly releases at locked pricing", "Frame it as price certainty and priority capacity for them"],
      add_client: ["Identify 2 industries where your equipment and skills apply", "Attend a trade show in a vertical you have never served", "Submit competitive quotes on 3 new RFQs this quarter"],
      build_passive: ["Inventory proprietary tooling, jigs, or processes you have developed", "Identify non-competing manufacturers who could license them", "Draft a simple licensing agreement with per-unit or annual royalty terms"],
      lock_forward: ["Review all current customers on one-off job orders", "Propose quarterly or annual purchase orders with volume discounts", "Get at least 2 blanket orders signed this quarter"],
    },

    constraints: {
      high_concentration: "One buyer accounts for a dangerous percentage of your production volume. If their demand drops, their business fails, or they find an alternative supplier, your fixed costs remain the same but your revenue collapses to a fraction of what it was.",
      weak_forward_visibility: "Your production schedule only extends as far as your current purchase orders. Beyond that, you are guessing based on customer forecasts that often turn out to be optimistic, leaving you either overcommitted or idle.",
      high_labor_dependence: "Skilled machinists, welders, and technicians are the bottleneck in your operation. Training takes months, turnover is expensive, and every unfilled position directly reduces your production capacity and revenue ceiling.",
      low_persistence: "Completed production orders do not generate any trailing revenue. Once parts ship and invoices clear, that income stream is finished unless the customer places another order — which is never guaranteed.",
      low_source_diversity: "Your customer base clusters in one industry — all automotive, all aerospace, or all construction. A downturn in that single sector hits every open order and every pending quote simultaneously.",
      high_variability: "Production volume swings with your customers' order patterns, which are themselves driven by end-market demand you cannot see or control. A great quarter can be followed by weeks of idle machines and uncertain forecasts.",
      weak_durability: "Manufacturing relationships often come down to price and delivery time. A competitor with newer equipment, lower labor costs, or a more favorable location can win your business away with a marginally better quote.",
      shallow_continuity: "Each production order is a discrete project. Without proactive account management and deliberate efforts to secure ongoing work, every completed job could easily be the last one from that customer.",
    },
    behaviors: {
      high_concentration: "You keep prioritizing your biggest buyer's orders over developing new accounts because their volume is reliable and the relationship is comfortable. Your sales effort has atrophied because one customer keeps the shop busy.",
      weak_forward_visibility: "You accept jobs as they come in without pushing customers for longer-term forecasts or blanket orders. Your production schedule is always reactive, never planned more than a few weeks ahead.",
      high_labor_dependence: "You have not documented your processes, invested in automation for repetitive tasks, or cross-trained operators across multiple machines. Losing one skilled employee can shut down an entire production cell.",
      low_persistence: "After shipping an order, you invoice and move on. You do not proactively check in with the customer about their next production needs, quality feedback, or upcoming projects that could generate repeat business.",
      low_source_diversity: "All your customers make products in the same industry, so when that industry contracts, every job in your shop is at risk. You have not explored adjacent markets where your capabilities would be equally valuable.",
      high_variability: "You accept that production volume fluctuates and staff up or down reactively. You have not developed fill work, maintenance contracts, or secondary product lines that could absorb capacity during slow periods.",
      weak_durability: "You compete primarily on price and lead time without investing in certifications, quality systems, or proprietary capabilities that would make it costly for customers to switch suppliers.",
      shallow_continuity: "You treat each purchase order as an isolated transaction. You have no account management system, no regular customer check-ins, and no structured process for identifying and securing repeat work.",
    },
    improvements: {
      high_concentration: [
        "Dedicate 20% of your sales effort exclusively to prospecting new customers outside your top account's industry",
        "Set a shop utilization rule: no single customer should represent more than 35% of your monthly production hours",
        "Develop a capability brochure targeting industries adjacent to your current base where your equipment and skills apply directly",
      ],
      weak_forward_visibility: [
        "Negotiate blanket purchase orders with quarterly releases from your top five customers to extend your production visibility",
        "Implement a simple quoting pipeline tracker so you can see the probability-weighted value of pending RFQs at any time",
        "Request rolling 90-day forecasts from your key accounts and build production schedules around committed volumes",
      ],
      high_labor_dependence: [
        "Cross-train every operator on at least two additional machines or processes to eliminate single-point-of-failure skill gaps",
        "Document your most critical production processes as standard operating procedures so new hires can ramp faster",
        "Evaluate automation for your highest-volume, most repetitive operations to reduce per-unit labor dependency",
      ],
      low_persistence: [
        "Schedule quarterly business reviews with your top ten customers to discuss upcoming projects and production needs",
        "Implement a post-delivery follow-up process that captures quality feedback and identifies next-order opportunities within 30 days",
        "Propose long-term supply agreements with built-in annual volume commitments to customers you have served consistently",
      ],
      low_source_diversity: [
        "Identify two new industries where your existing equipment and expertise would serve unmet manufacturing needs",
        "Attend a trade show in a vertical you have never served to build relationships and understand new market requirements",
        "Pursue certifications — ISO, AS9100, IATF — that qualify you as a supplier in regulated industries beyond your current base",
      ],
      high_variability: [
        "Develop a secondary product line or maintenance service that fills shop capacity during slow periods for your primary customers",
        "Build an inventory of standard parts or components that you can produce speculatively during downtime and sell from stock",
        "Negotiate staggered delivery schedules with customers to smooth production volume across months instead of lumpy quarterly spikes",
      ],
      weak_durability: [
        "Invest in certifications and quality management systems that create switching costs for customers who would need to re-qualify a new supplier",
        "Develop proprietary tooling or processes that deliver results competitors cannot match with standard equipment",
        "Build engineering support capability — DFM reviews, prototyping, material selection consulting — that makes you a partner, not just a vendor",
      ],
      shallow_continuity: [
        "Assign an account manager or designate yourself to proactively manage your top ten customer relationships with monthly touchpoints",
        "Create a customer portal where buyers can view order status, reorder parts, and request quotes — making it easier to buy from you than from anyone else",
        "Offer annual pricing agreements with guaranteed capacity allocation that reward customers for ongoing commitment to your shop",
      ],
    },
    industry_context: "Manufacturing carries some of the heaviest fixed costs of any business model — equipment, facilities, utilities, and skilled labor all cost money whether your machines are running or idle. Your profitability depends on utilization, and utilization depends on having enough diversified customers to keep production schedules full through market cycles. The shops that survive long-term build deep relationships across multiple industries, invest in capabilities that create switching costs, and convert one-time jobs into standing production agreements that provide the forward visibility needed to plan with confidence.",
    stats: {
      general: "Manufacturing operations with customers across three or more industries maintain 25% higher average capacity utilization during market downturns than single-industry shops.",
      redAvg: 33,
      greenAvg: 68,
    },
    reassessment: {
      recurrence: "Have you secured any new blanket orders, long-term supply agreements, or standing production contracts since your last assessment?",
      concentration: "Has your production volume become more balanced across customers, or has your top buyer's share increased?",
      diversification: "Are you now serving customers in new industries or producing new product types compared to before?",
      forward: "How deep is your production backlog in weeks? Do you have more confirmed orders on the books than last time?",
      variability: "Has your monthly production volume stabilized, or do you still experience dramatic swings between busy and idle periods?",
      labor: "Have you reduced skill bottlenecks through cross-training, documentation, or automation since your last assessment?",
    },

    worker_context: {
      pressure_framing: "As a manufacturer, your income pressure comes from the gap between your high fixed costs — machines, space, skilled labor — and production volume that fluctuates with customer demand cycles you cannot control.",
      tailwind_framing: "Every standing order you lock in, every new industry you qualify for, and every proprietary capability you develop makes your shop harder to replace — these compound into a moat that protects your revenue through market cycles.",
      arrangement_types: "blanket purchase orders, spot job orders, OEM supply contracts, prototype and engineering services, maintenance agreements, co-manufacturing partnerships, toll processing, private label production",
      peer_group_label: "manufacturers, fabricators, and production shop operators",
    },
  },

  nonprofit: {
    industry_key: "nonprofit",
    industry_label: "Nonprofit & Social Impact",
    nouns: {
      recurring_revenue: "multi-year grants, monthly donor pledges, or sustained program fee income",
      top_client: "largest funder, primary foundation partner, or anchor government grantor",
      pipeline: "submitted proposals, LOI invitations, and scheduled donor meetings",
      passive_income: "endowment distributions, investment returns, or earned revenue from social enterprise",
      forward_commitment: "awarded multi-year grants, pledged donations, or signed program contracts",
      active_work: "program delivery, grant reporting, fundraising campaigns, and donor cultivation",
    },
    scenarios: {
      lose_top_client: "Your anchor foundation funder — the one whose annual six-figure grant underwrites your core programs — shifts their strategic priorities and your next application is declined. That single loss creates a budget hole you cannot fill before the fiscal year ends.",
      cant_work_90_days: "You as the executive director or lead fundraiser step away for three months due to burnout or a health crisis. Donor relationships go untended, grant deadlines get missed, and the board is not equipped to fill the gap. Fundraising momentum stalls completely.",
      market_slowdown: "An economic downturn hits individual giving, corporate philanthropy tightens, and government funding faces sequestration or budget cuts. Every revenue source your organization depends on contracts at the same time, while the community need you serve actually increases.",
      pipeline_dries_up: "Your pending proposals are all rejected in the same funding cycle, your spring fundraising gala underperforms, and your major donor prospect meetings get indefinitely postponed. The pipeline you were counting on to fund next quarter's programs is suddenly empty.",
    },
    actions: {
      convert_retainer: "Approach your most consistent program funders about converting annual grants into multi-year commitments. Present an impact case showing how multi-year funding reduces administrative overhead and allows deeper program investment, benefiting both the funder's outcomes and your financial stability.",
      add_client: "Identify three new foundation or corporate funders whose stated priorities align with your mission and submit tailored LOIs this quarter. Each new funder relationship reduces your dependence on any single source and broadens your coalition of supporters.",
      build_passive: "Launch a monthly giving program with automated recurring donations. Even at small individual amounts, a base of 200 monthly donors creates a reliable revenue floor that no single grant decision can take away.",
      lock_forward: "Secure multi-year pledge commitments from your top individual donors by presenting a compelling three-year strategic plan. Ask them to pledge annual gifts for the full period, giving you bankable forward revenue for program planning.",
    },

    actionLabels: {
      convert_retainer: "Convert annual grants into multi-year commitments",
      add_client: "Submit tailored LOIs to three new funders",
      build_passive: "Launch a monthly giving program with automated donations",
      lock_forward: "Secure multi-year pledge commitments from top donors",
    },

    microSteps: {
      convert_retainer: ["Identify your most consistent program funders", "Present an impact case showing how multi-year funding improves outcomes", "Ask for a 3-year commitment at the next renewal conversation"],
      add_client: ["Research 3 new foundations whose priorities align with your mission", "Submit tailored LOIs to each this quarter", "Follow up with a personal introduction to your program director"],
      build_passive: ["Set up a monthly giving page with automated recurring donation processing", "Email your full donor list with a specific ask to convert to monthly giving", "Set a goal of 50 new monthly donors in the first 90 days"],
      lock_forward: ["Identify your top 10 individual donors by giving history", "Present a compelling 3-year strategic plan to each", "Ask for annual pledge commitments covering the full period"],
    },

    constraints: {
      high_concentration: "One funder — a single foundation, government agency, or major donor — provides a disproportionate share of your budget. Their funding decision cycle controls your organization's survival, and a single decline letter can trigger a fiscal crisis.",
      weak_forward_visibility: "Grant cycles, donor decisions, and government appropriations operate on timelines you do not control. You often do not know whether critical funding will continue until weeks before it is needed, making program planning feel like guesswork.",
      high_labor_dependence: "Your fundraising and program delivery depend heavily on a small team — often just you. Donor relationships are personal, institutional knowledge lives in individual heads, and there is no system that would keep operations running if key people left.",
      low_persistence: "Annual grants reset every year. One-time donations are exactly that — one time. Without deliberate stewardship systems, every dollar raised this year tells you nothing about whether that donor or funder will give again next year.",
      low_source_diversity: "Your funding comes predominantly from one type of source — all foundation grants, all government contracts, or all individual donors. A policy change, funding priority shift, or economic downturn in that single sector threatens your entire budget.",
      high_variability: "Fundraising revenue clusters around galas, year-end giving, and grant award cycles, creating dramatic peaks and valleys in your cash flow. The months between major funding decisions can feel financially precarious.",
      weak_durability: "Funder priorities shift, political administrations change, and donor interests evolve. Funding relationships that feel rock-solid today can disappear with a new program officer, a board leadership change, or a strategic pivot at the foundation.",
      shallow_continuity: "Many donors give once and are never heard from again because there is no structured stewardship program keeping them engaged. First-time donor retention across the sector hovers below 20%, and your organization may not be an exception.",
    },
    behaviors: {
      high_concentration: "You spend most of your fundraising energy maintaining your relationship with your largest funder rather than cultivating new ones. The comfort of that anchor grant has made your development strategy lazy.",
      weak_forward_visibility: "You submit grant proposals and then wait anxiously rather than maintaining a diversified pipeline with enough volume that any single rejection is manageable. Your proposal calendar is reactive, driven by deadlines rather than strategy.",
      high_labor_dependence: "You hold all the donor relationships, all the grant-writing knowledge, and all the institutional history in your own head. No one else on your team could step into a funder meeting and represent the organization credibly.",
      low_persistence: "After receiving a donation, you send a thank-you letter and then nothing for eleven months until the next appeal. You have no engagement touchpoints, no impact updates, no reason for the donor to feel connected between asks.",
      low_source_diversity: "Your budget relies on the same type of funding year after year. You have not seriously explored earned revenue, fee-for-service programs, corporate partnerships, or social enterprise models that could diversify your income mix.",
      high_variability: "You lean on one or two big fundraising events per year to make your budget, and the months between them feel like a financial tightrope. Monthly cash flow looks nothing like annual projections.",
      weak_durability: "You assume funders will continue to support you because they always have. You have not built the kind of impact documentation, outcome data, and relationship depth that makes your organization hard to defund.",
      shallow_continuity: "Your donor database is a mess. You cannot easily tell who gave last year, who lapsed, or who is overdue for a personal touchpoint. Without that data, systematic retention is impossible.",
    },
    improvements: {
      high_concentration: [
        "Submit proposals to at least three new funders this quarter whose priorities align with your mission but who have never funded you",
        "Set a board-level policy that no single funder should represent more than 25% of your annual budget and create a diversification plan to get there",
        "Develop a corporate partnership program targeting local businesses that can provide smaller but numerous annual contributions",
      ],
      weak_forward_visibility: [
        "Maintain a rolling 12-month grant calendar showing submission deadlines, decision dates, and expected amounts for every pending proposal",
        "Begin multi-year grant conversations with current funders at least six months before their current award expires",
        "Build relationships with program officers well before application deadlines so you understand their priorities and can tailor proposals proactively",
      ],
      high_labor_dependence: [
        "Document every major donor relationship — history, preferences, giving patterns, key contacts — in a shared CRM accessible to your full team",
        "Train at least one other team member or board member to lead funder meetings and represent the organization's impact story",
        "Create grant-writing templates and boilerplate content that any trained staff member can customize for new proposals",
      ],
      low_persistence: [
        "Implement a donor stewardship calendar with touchpoints at 30, 90, 180, and 330 days after every gift — not just at renewal time",
        "Send quarterly impact updates to all donors showing specific outcomes their contributions made possible",
        "Launch a monthly giving program and actively convert one-time donors to recurring contributors within 60 days of their first gift",
      ],
      low_source_diversity: [
        "Explore at least one earned revenue opportunity — fee-for-service, social enterprise, or consulting — that leverages your organization's expertise",
        "Develop a corporate sponsorship package with tiered benefits that attracts business partners alongside traditional philanthropic funders",
        "Apply to government funding sources if you have not already, or explore individual giving if you have relied exclusively on institutional grants",
      ],
      high_variability: [
        "Grow your monthly giving program to cover at least 30% of your fixed operating costs, creating a reliable baseline beneath variable grant income",
        "Spread fundraising events and campaigns across the calendar year rather than concentrating them in Q4",
        "Negotiate grant payment schedules that distribute funds quarterly rather than in a single annual lump sum",
      ],
      weak_durability: [
        "Invest in rigorous impact measurement and reporting that gives funders compelling, data-driven reasons to renew",
        "Build personal relationships with program officers and donors that go deeper than transactional grant cycles",
        "Diversify your board of directors to include individuals with connections to multiple funding sectors and donor communities",
      ],
      shallow_continuity: [
        "Clean up your donor database and implement a lapsed-donor reactivation campaign targeting everyone who gave last year but not this year",
        "Create a donor journey map that moves supporters from first gift through recurring giving to legacy commitment",
        "Assign each board member a portfolio of five to ten donors for personal stewardship — handwritten notes, phone calls, coffee meetings — throughout the year",
      ],
    },
    industry_context: "Nonprofit leaders carry the weight of dual accountability — to the communities they serve and to the funders who make that service possible. Your funding landscape is inherently unstable: foundation priorities shift, government budgets fluctuate with political winds, and individual donors are generous but fickle. The organizations that sustain their missions long-term build diversified funding portfolios, invest in donor retention as aggressively as acquisition, and develop earned revenue streams that provide financial independence from any single funder's whims.",
    stats: {
      general: "Nonprofits with a monthly giving program covering at least 20% of operating costs retain donors at nearly twice the rate of organizations relying primarily on annual appeals.",
      redAvg: 36,
      greenAvg: 70,
    },
    reassessment: {
      recurrence: "Have you added any new multi-year grants, monthly donors, or recurring program fee revenue since your last assessment?",
      concentration: "Has your largest funder's share of your total budget decreased, or has your dependency on them grown?",
      diversification: "Are you receiving funding from new source types — earned revenue, corporate partners, new government programs — that you were not tapping before?",
      forward: "How many months of committed funding do you have confirmed? Is your financial runway longer or shorter than last time?",
      variability: "Has your monthly cash flow stabilized, or are you still experiencing dramatic swings between funding peaks and valleys?",
      labor: "Could your fundraising and programs continue if you personally stepped away for a month? Have you reduced single-person dependencies?",
    },

    worker_context: {
      pressure_framing: "As a nonprofit leader, your income pressure comes from the fundamental instability of philanthropic funding — grant cycles that reset annually, donor retention rates that hover below 50%, and the constant tension between mission urgency and financial reality.",
      tailwind_framing: "Every multi-year grant you secure, every monthly donor you onboard, and every earned revenue stream you develop creates financial resilience that lets you focus on impact instead of survival.",
      arrangement_types: "foundation grants, government contracts, individual donations, monthly giving programs, corporate sponsorships, fee-for-service programs, social enterprise revenue, endowment distributions, planned giving",
      peer_group_label: "nonprofit leaders, executive directors, and development professionals",
    },
  },

  agriculture: {
    industry_key: "agriculture",
    industry_label: "Agriculture",
    nouns: {
      recurring_revenue: "CSA subscriptions, forward crop contracts, or standing supply agreements",
      top_client: "anchor buyer, primary distributor, or largest wholesale produce account",
      pipeline: "planted acres, livestock in production, and pending buyer commitments",
      passive_income: "land lease income, equipment rental fees, or conservation payment programs",
      forward_commitment: "signed crop contracts, forward-priced hedges, or pre-sold harvest allocations",
      active_work: "planting, cultivation, harvest, livestock management, and daily farm operations",
    },
    scenarios: {
      lose_top_client: "Your anchor wholesale buyer — the distributor who purchases 50% of your harvest at a pre-agreed price every year — drops you for a larger farm that can offer lower per-unit pricing. Half your crop suddenly has no committed buyer, and harvest is eight weeks away.",
      cant_work_90_days: "An injury during planting season takes you out for three critical months. Crops need tending, livestock need feeding, and equipment needs operating. Without you, the farm's daily rhythm breaks down and yields suffer irreversibly for the entire growing season.",
      market_slowdown: "Commodity prices drop 30% across the board while your input costs — seed, fertilizer, fuel, labor — stay flat or rise. The margin between what it costs to grow and what the market will pay squeezes to nearly nothing, and you are locked into a season you cannot abandon.",
      pipeline_dries_up: "A severe drought decimates your planted acres, or an early frost wipes out a crop that was weeks from harvest. The physical pipeline you invested months of labor and capital into is destroyed, and crop insurance only covers a fraction of your expected revenue.",
    },
    actions: {
      convert_retainer: "Propose annual supply agreements with your top restaurant, grocery, and distributor buyers. Lock in guaranteed purchase volumes at pre-agreed prices so you have confirmed revenue before the first seed hits the ground. Buyers get supply certainty; you get income predictability.",
      add_client: "Approach three new buyers this season — a new farmers market, a restaurant group, a meal kit company, or a food co-op — with samples of your best product. Each new sales channel reduces your exposure to any single buyer walking away.",
      build_passive: "Lease underutilized acreage to other operators, rent out idle equipment during off-season months, or enroll marginal land in conservation reserve programs that pay annual per-acre fees. These income streams require no additional planting or harvest labor from you.",
      lock_forward: "Forward-price 60-70% of your expected harvest through futures contracts or direct buyer agreements before the season begins. Accept a slightly lower ceiling in exchange for a guaranteed floor that covers your production costs regardless of what spot prices do at harvest.",
    },

    actionLabels: {
      convert_retainer: "Lock in annual supply agreements with top buyers",
      add_client: "Approach three new buyers with samples this season",
      build_passive: "Lease idle acreage or enroll in conservation programs",
      lock_forward: "Forward-price 60-70% of your expected harvest",
    },

    microSteps: {
      convert_retainer: ["Identify your top 3 restaurant, grocery, or distributor buyers", "Propose annual supply agreements with pre-agreed volumes and prices", "Sign them before planting season so revenue is confirmed early"],
      add_client: ["List 3 new buyers — farmers markets, restaurant groups, or food co-ops", "Send samples of your best product to each this month", "Follow up within a week to discuss standing order terms"],
      build_passive: ["Identify any acreage or equipment sitting idle during off-season", "List equipment for rental or lease land to neighboring operators", "Explore conservation reserve program enrollment for marginal acres"],
      lock_forward: ["Research futures contract options for your primary commodity", "Forward-price at least 50% of expected production before planting", "Lock in direct buyer agreements for the remaining committed volume"],
    },

    constraints: {
      high_concentration: "One buyer or one crop dominates your revenue. If that buyer switches suppliers or that commodity's price crashes, your entire year's income is compromised because you have no diversification to absorb the impact.",
      weak_forward_visibility: "You plant based on hope and historical pricing, but you will not know your actual revenue until harvest — and even then, it depends on yield, quality, and a market price you cannot predict. Months of work happen before any income materializes.",
      high_labor_dependence: "Farming is physically demanding, seasonal, and deeply personal. Critical operations — planting, irrigation management, harvest timing — depend on your judgment and your body being in the field every day during peak periods.",
      low_persistence: "Last year's harvest generates zero revenue this year. Every growing season starts from bare soil and requires a full reinvestment of time, capital, and labor before you see a single dollar of return.",
      low_source_diversity: "You grow one crop or raise one livestock type, selling through one channel. A disease outbreak, a commodity price swing, or a buyer loss hits everything simultaneously because there is no offsetting revenue stream.",
      high_variability: "Your income arrives in lumps — at harvest, at market day, at contract settlement — with long stretches of zero revenue in between. Monthly cash flow looks nothing like annual income, and the timing is largely dictated by nature.",
      weak_durability: "Agricultural income is at the mercy of weather, pests, disease, commodity markets, and trade policy — none of which you can control. A single adverse event can wipe out an entire season's expected revenue.",
      shallow_continuity: "Each growing season is a fresh start. Without forward contracts, CSA commitments, or multi-year supply agreements, there is no carryover revenue from one year to the next. You begin each January with a blank ledger.",
    },
    behaviors: {
      high_concentration: "You keep planting the same crop for the same buyer because the relationship is established and the routine is familiar. You have not explored crop diversification or new markets because changing feels risky — but so is staying concentrated.",
      weak_forward_visibility: "You plant your full acreage without securing any forward contracts or pre-sale commitments, hoping the market will be favorable at harvest. You are betting your entire year's income on a price you will not see for months.",
      high_labor_dependence: "You work every critical operation yourself because finding reliable farm labor is difficult and expensive. You have not invested in labor-saving equipment or trained anyone to handle key decisions in your absence.",
      low_persistence: "After selling your harvest, you do not follow up with buyers to lock in next year's commitments. Each selling season starts cold, rebuilding relationships that could have been maintained year-round.",
      low_source_diversity: "All your revenue comes from one commodity sold through one channel. You have not explored value-added products, agritourism, direct-to-consumer sales, or secondary crops that could diversify your income.",
      high_variability: "You accept the feast-or-famine cycle of agriculture as unchangeable rather than using tools like forward contracts, CSA programs, and staggered planting to create more even monthly cash flow.",
      weak_durability: "You have no crop insurance, no forward hedges, and no emergency fund. A single bad weather event could erase your entire year's income with no safety net to cover fixed costs until next season.",
      shallow_continuity: "You do not maintain an off-season relationship with your buyers. Between harvest and planting, months pass without contact, and each spring you start from scratch rebuilding the sales relationships you let go dormant.",
    },
    improvements: {
      high_concentration: [
        "Add at least one new crop, livestock product, or value-added item to your operation this year to reduce single-commodity risk",
        "Sell through at least three different channels — wholesale, direct-to-consumer, farmers market, and CSA — so no single buyer controls your revenue",
        "Set a rule that no single buyer receives more than 30% of your total production volume",
      ],
      weak_forward_visibility: [
        "Forward-price at least 50% of your expected production before planting begins using futures contracts or direct buyer agreements",
        "Launch a CSA program that collects payment before the growing season starts, giving you confirmed revenue and cash flow during planting",
        "Build relationships with buyers year-round so you can negotiate next season's contracts before the current harvest is even complete",
      ],
      high_labor_dependence: [
        "Invest in one piece of labor-saving equipment this year that reduces your physical involvement in the most time-intensive operation",
        "Cross-train a family member, employee, or neighbor on your critical daily operations so the farm can function during a short absence",
        "Document your irrigation, feeding, and harvest protocols so someone else can follow them accurately if you are unavailable",
      ],
      low_persistence: [
        "Contact every buyer within 30 days of harvest completion to discuss next year's needs and begin early commitment conversations",
        "Convert your best one-time buyers into multi-year supply agreement partners with pre-agreed volumes and pricing",
        "Maintain a quarterly newsletter or market update for all your buyers that keeps the relationship active between selling seasons",
      ],
      low_source_diversity: [
        "Develop at least one value-added product — jams, dried goods, packaged cuts, specialty flour — that generates higher margins than raw commodity sales",
        "Explore agritourism revenue — farm tours, U-pick events, farm dinners — that monetizes your land and brand without additional crop production",
        "Plant a secondary crop or add a small livestock operation that produces revenue on a different seasonal cycle than your primary commodity",
      ],
      high_variability: [
        "Use a CSA or subscription model to collect monthly payments year-round instead of receiving all revenue at harvest",
        "Stagger planting and harvest schedules across multiple crops to create revenue at different points throughout the year",
        "Build a cash reserve equal to six months of fixed costs during profitable seasons to smooth cash flow through lean periods",
      ],
      weak_durability: [
        "Carry crop insurance or revenue protection coverage that guarantees a minimum income even in catastrophic yield or price scenarios",
        "Use futures contracts or options to establish a price floor on your primary commodity before planting",
        "Diversify into enterprises with different risk profiles — livestock alongside crops, perennials alongside annuals — to reduce the chance of total loss",
      ],
      shallow_continuity: [
        "Build and maintain a buyer contact list with annual purchase history so you can proactively approach them before each season",
        "Offer early-commitment discounts or priority access to your best buyers who sign contracts before planting begins",
        "Create a farm brand identity — website, social media, packaging — that builds buyer loyalty beyond a transactional commodity relationship",
      ],
    },
    industry_context: "Agriculture is the ultimate long-cycle, high-stakes business — you invest months of labor and thousands in inputs before seeing a single dollar of revenue, and the gap between your costs and your income depends on weather, markets, and forces entirely beyond your control. The operators who build lasting operations diversify their crops, lock in forward prices, develop direct-to-consumer channels, and treat every buyer relationship as a year-round partnership rather than a once-a-season transaction. Your land is your greatest asset, but only if your financial structure lets you survive the inevitable bad seasons.",
    stats: {
      general: "Farms that forward-price at least 50% of expected production before planting report 40% less income volatility year over year than those selling entirely at spot harvest prices.",
      redAvg: 29,
      greenAvg: 63,
    },
    reassessment: {
      recurrence: "Have you added any new CSA subscriptions, forward contracts, or recurring supply agreements since your last assessment?",
      concentration: "Has your revenue become more balanced across buyers and crops, or are you still heavily concentrated in one commodity or one sales channel?",
      diversification: "Are you generating income from new sources — value-added products, agritourism, new crops, or secondary livestock — that were not part of your operation before?",
      forward: "What percentage of your next harvest is already committed or forward-priced? Is your pre-season revenue certainty higher than last year?",
      variability: "Has your monthly cash flow smoothed out, or is your income still arriving in one or two large lumps around harvest?",
      labor: "Could your farm operate for two weeks without you personally in the field? Have you reduced your physical dependency through equipment, training, or hired help?",
    },

    worker_context: {
      pressure_framing: "As a farmer or rancher, your income pressure comes from the brutal reality that months of labor and investment happen before any revenue arrives, and the final outcome depends on weather, commodity prices, and market forces you cannot control.",
      tailwind_framing: "Every forward contract you secure, every new buyer you onboard, and every direct-to-consumer channel you build gives you more control over your revenue — turning your operation from a commodity gamble into a planned business.",
      arrangement_types: "forward crop contracts, CSA subscriptions, wholesale supply agreements, farmers market sales, direct-to-consumer e-commerce, agritourism income, conservation program payments, land and equipment leases",
      peer_group_label: "farmers, ranchers, and agricultural producers",
    },
  },

  energy: {
    industry_key: "energy",
    industry_label: "Energy",
    nouns: {
      recurring_revenue: "maintenance contracts, PPA income, or ongoing consulting retainers",
      top_client: "primary utility partner, anchor developer, or largest installation client",
      pipeline: "approved projects, pending interconnection applications, and signed proposals",
      passive_income: "PPA cash flows, royalty income from deployed systems, or monitoring service fees",
      forward_commitment: "signed installation contracts, approved project permits, or contracted service agreements",
      active_work: "system installations, site assessments, energy audits, and project management",
    },
    scenarios: {
      lose_top_client: "Your primary developer partner — the one who channels 60% of your installation volume your way — gets acquired or pivots to a different technology platform. Your project pipeline thins overnight and the relationships you built through them do not transfer automatically.",
      cant_work_90_days: "A serious injury takes you off job sites for a full quarter. Without you managing installations, conducting site assessments, and closing new contracts, projects stall, timelines slip, and customers start looking for contractors who can deliver now.",
      market_slowdown: "Interest rate hikes crush project economics, a key tax credit expires or gets reduced, and utility interconnection queues back up to 18 months. The pipeline you built on favorable policy assumptions suddenly does not pencil out, and customers pause or cancel.",
      pipeline_dries_up: "A state regulatory change eliminates net metering, a major incentive program sunsets, and your pending project approvals get stuck in bureaucratic limbo. The projects you were counting on for next quarter are frozen indefinitely.",
    },
    actions: {
      convert_retainer: "Offer your top clients annual maintenance and monitoring retainers for their installed systems. Recurring service agreements generate steady monthly income from your existing install base and keep you embedded in the client relationship long after the installation project closes.",
      add_client: "Pursue commercial or municipal clients in addition to residential. Attend a local business association meeting and present the ROI case for energy upgrades. Each new client segment operates on different budget cycles and policy drivers, diversifying your demand sources.",
      build_passive: "Structure deals where you retain ownership of installed systems and sell power through PPAs. Each system you own becomes a long-term revenue-generating asset that pays you monthly whether or not you install a single new system this quarter.",
      lock_forward: "Get contracts signed and deposits collected for approved projects immediately rather than letting them linger in the pipeline. Offer a small incentive for customers who commit and pay within 30 days of proposal acceptance to accelerate your confirmed backlog.",
    },

    actionLabels: {
      convert_retainer: "Offer maintenance and monitoring retainers to past clients",
      add_client: "Pursue commercial or municipal clients in a new segment",
      build_passive: "Retain system ownership and sell power through PPAs",
      lock_forward: "Collect signed contracts and deposits on approved projects now",
    },

    microSteps: {
      convert_retainer: ["Pull a list of every system you have installed in the past 3 years", "Draft an annual maintenance and monitoring retainer proposal", "Contact your top 10 past clients with the offer this month"],
      add_client: ["Identify a client segment you have not served — commercial, municipal, or industrial", "Attend a local business association meeting and present the energy ROI case", "Follow up with 3 personalized proposals within 2 weeks"],
      build_passive: ["Evaluate which upcoming projects could work as PPA-owned systems", "Model the long-term cash flow from retaining ownership vs. selling outright", "Propose PPA terms to your next qualified customer"],
      lock_forward: ["Review all approved but unsigned projects in your pipeline", "Offer a small incentive for commitment within 30 days", "Collect deposits on every signed contract before mobilization"],
    },

    constraints: {
      high_concentration: "A large share of your projects flow through one developer, one utility territory, or one client type. If that partner relationship changes, that utility's interconnection process stalls, or that market segment pauses, your revenue drops precipitously.",
      weak_forward_visibility: "Energy projects involve long permitting timelines, unpredictable approval processes, and policy dependencies that can shift mid-project. You often cannot tell whether a pipeline project will convert to revenue this quarter or next year.",
      high_labor_dependence: "Site assessments, installations, and project management all require skilled personnel on location. Your capacity is limited by the number of qualified people available, and finding licensed electricians and certified installers is an ongoing challenge.",
      low_persistence: "Installation revenue is project-based — once the system is commissioned, the income from that project is complete. Without a maintenance or monitoring agreement, each completed installation generates no further revenue.",
      low_source_diversity: "You serve one technology type in one geography under one policy framework. A change in any of those — technology evolution, geographic market saturation, or policy reversal — threatens your entire business model simultaneously.",
      high_variability: "Your revenue spikes when incentive deadlines approach and craters when policy uncertainty freezes decision-making. The cadence of your income is driven more by legislative calendars than by customer demand.",
      weak_durability: "Energy policy is inherently political. Tax credits, net metering rules, and renewable portfolio standards can be reversed, reduced, or restructured with a single legislative session or regulatory ruling.",
      shallow_continuity: "Once a system is installed and commissioned, the customer relationship typically ends unless you have proactively sold ongoing services. Your install base is a dormant asset generating no recurring revenue.",
    },
    behaviors: {
      high_concentration: "You keep taking every project your primary developer partner sends because the volume is easy and consistent. You have not built your own direct sales pipeline or relationships with other referral sources.",
      weak_forward_visibility: "You count pipeline projects at face value without discounting for permitting delays, customer hesitation, or policy risk. Your revenue forecasts consistently overestimate what actually closes and when.",
      high_labor_dependence: "You personally handle most site assessments and oversee every installation because you do not trust anyone else to maintain quality. Your growth is capped at what your own schedule can accommodate.",
      low_persistence: "After commissioning a system, you move on to the next installation. You have never gone back to an existing customer with a maintenance proposal, a system expansion opportunity, or a referral request.",
      low_source_diversity: "All your revenue comes from one technology — residential solar, commercial HVAC, or EV charging — in one service territory. You have not explored adjacent services or neighboring markets.",
      high_variability: "You ride policy-driven demand waves without building counter-cyclical revenue streams. When incentive programs lapse, you sit idle waiting for the next policy catalyst instead of generating revenue from your install base.",
      weak_durability: "You have not built any recurring revenue that would sustain your business if the current policy environment changed dramatically. Your entire model depends on new installations driven by incentives that could expire.",
      shallow_continuity: "Your installed systems are out in the world generating value for customers, but you have no ongoing relationship with those system owners. You are leaving maintenance revenue, expansion opportunities, and referrals on the table.",
    },
    improvements: {
      high_concentration: [
        "Build a direct sales pipeline that generates at least 30% of your projects independent of any single developer or referral partner",
        "Expand into an adjacent service territory or client segment — commercial if you are residential-focused, or municipal if you serve only private clients",
        "Develop relationships with at least three new referral sources — real estate agents, architects, general contractors — who can send project leads from different channels",
      ],
      weak_forward_visibility: [
        "Apply probability weighting to every pipeline project based on permitting status, customer commitment level, and policy certainty",
        "Track your historical conversion rates from proposal to signed contract so your forecasts reflect reality rather than optimism",
        "Accelerate permitting and interconnection processes by building relationships with utility and municipal approval staff who can flag delays early",
      ],
      high_labor_dependence: [
        "Hire or subcontract a certified installer who can run projects independently so your capacity is not limited to your personal schedule",
        "Create detailed installation checklists and quality standards that allow trained crews to execute to your standards without your on-site presence",
        "Invest in project management software that lets you oversee multiple concurrent installations remotely",
      ],
      low_persistence: [
        "Launch a maintenance and monitoring service offering for every system you have ever installed — your existing install base is an untapped recurring revenue source",
        "Contact every past customer with a system health check offer and a proposal for a service agreement",
        "Build annual performance review touchpoints into every customer relationship that naturally lead to upsell and referral conversations",
      ],
      low_source_diversity: [
        "Add a complementary service line — battery storage, EV charging, energy efficiency audits — that serves the same customers but generates revenue on a different cycle",
        "Pursue projects in at least one additional market segment — government, commercial, industrial — beyond your current customer base",
        "Explore energy-as-a-service or PPA models that create long-term revenue streams distinct from one-time installation fees",
      ],
      high_variability: [
        "Build a recurring maintenance and monitoring revenue base large enough to cover fixed costs even during zero-installation months",
        "Develop service offerings that are not policy-dependent — efficiency upgrades, system repairs, component replacements — to smooth revenue between incentive-driven demand peaks",
        "Create a pipeline of smaller, quick-turn projects that can be executed during lulls between major installations",
      ],
      weak_durability: [
        "Diversify across technologies and service types so no single policy change can undermine your entire revenue model",
        "Build long-term PPA or lease structures that lock in revenue for 15-25 years independent of future incentive availability",
        "Stay actively engaged in policy advocacy so you have early warning of regulatory changes and a voice in shaping them",
      ],
      shallow_continuity: [
        "Build a customer database of every system you have installed with monitoring data, warranty status, and next-service dates",
        "Implement automated annual check-in emails to past customers offering performance reviews, cleaning, and upgrade consultations",
        "Create a referral program that rewards past customers for sending new installation leads, keeping the relationship active and mutually beneficial",
      ],
    },
    industry_context: "Energy professionals operate in a market shaped as much by policy as by demand. Tax credits, net metering rules, and renewable mandates drive project economics, and when those policies shift, your pipeline can evaporate overnight. The practitioners who build durable businesses move beyond project-based installation revenue to develop recurring service income from their install base, diversify across technologies and customer segments, and structure PPA ownership models that generate long-term cash flow independent of any single policy framework.",
    stats: {
      general: "Energy contractors with recurring maintenance and monitoring revenue covering at least 30% of overhead report significantly higher survival rates through policy transition periods than installation-only businesses.",
      redAvg: 35,
      greenAvg: 71,
    },
    reassessment: {
      recurrence: "Have you added any new maintenance contracts, PPA income, or recurring monitoring agreements since your last assessment?",
      concentration: "Is your project volume more diversified across referral sources, technologies, and client types, or has dependency on a single channel increased?",
      diversification: "Are you now serving new customer segments, offering new services, or operating in new territories compared to before?",
      forward: "How deep is your signed project backlog? Do you have more committed, permitted projects on the books than last time?",
      variability: "Has your monthly revenue stabilized through recurring services, or is it still driven entirely by project-based installation timing?",
      labor: "Have you expanded your team's capacity or reduced your personal involvement in on-site project execution?",
    },

    worker_context: {
      pressure_framing: "As an energy professional, your income pressure comes from the intersection of long project timelines, policy-dependent economics, and the project-based nature of installation revenue that generates nothing between completed jobs.",
      tailwind_framing: "Every system you install is a potential long-term revenue asset — through maintenance contracts, monitoring fees, expansion projects, and referrals — if you build the structures to capture that ongoing value.",
      arrangement_types: "installation project fees, PPA ownership income, maintenance and monitoring retainers, energy consulting fees, equipment sales, utility incentive processing, EPC subcontracting, system design services",
      peer_group_label: "energy professionals, solar contractors, and clean energy consultants",
    },
  },

  fitness_wellness: {
    industry_key: "fitness_wellness",
    industry_label: "Fitness & Wellness",
    nouns: {
      recurring_revenue: "monthly memberships, class pack subscriptions, or ongoing coaching retainers",
      top_client: "highest-paying private client, anchor corporate wellness account, or primary studio partnership",
      pipeline: "booked consultations, trial session sign-ups, and incoming referrals",
      passive_income: "digital program sales, app subscriptions, or branded product revenue",
      forward_commitment: "pre-paid session packages, signed coaching agreements, or contracted corporate wellness programs",
      active_work: "training sessions, group classes, wellness consultations, and program design",
    },
    scenarios: {
      lose_top_client: "Your anchor private client — the one paying premium rates for three sessions per week — relocates, gets injured, or simply stops booking. That single client may represent 20% of your monthly income, and replacing their volume takes weeks of outreach and trial sessions.",
      cant_work_90_days: "A torn rotator cuff, a back injury, or a health scare takes you off the training floor for three months. Every session you cannot deliver is income that does not exist. Your clients need to train, and they will find someone else if you cannot show up.",
      market_slowdown: "A recession hits and personal training becomes a line item people cut first. Corporate wellness budgets freeze, gym memberships get downgraded, and your premium pricing suddenly feels like a luxury your clients cannot justify.",
      pipeline_dries_up: "January motivation fades by March, your referral network goes quiet, and no new consultations appear on your calendar. Your existing clients are stable for now, but you have no new prospects replacing the natural attrition that every trainer experiences.",
    },
    actions: {
      convert_retainer: "Move your best clients from per-session billing to monthly coaching retainers that include sessions, programming, nutrition check-ins, and messaging access. The monthly commitment smooths your cash flow and increases the perceived value beyond individual workouts.",
      add_client: "Partner with three local businesses — physical therapy offices, chiropractors, or corporate HR departments — to cross-refer clients. Each partnership is a lead pipeline that brings in people who are already motivated and willing to invest in their health.",
      build_passive: "Create a digital training program — a 12-week transformation guide, a mobility course, or a nutrition protocol — and sell it through your website and social channels. Once built, every sale generates revenue without requiring your physical presence.",
      lock_forward: "Offer a meaningful discount for clients who purchase 6-month or annual training commitments paid upfront. Pre-paid packages give you bankable revenue today and dramatically improve client retention because they have skin in the game.",
    },

    actionLabels: {
      convert_retainer: "Move top clients to monthly coaching retainers",
      add_client: "Partner with local health businesses for cross-referrals",
      build_passive: "Create a digital training program for online sales",
      lock_forward: "Offer discounted 6-month or annual prepaid commitments",
    },

    microSteps: {
      convert_retainer: ["Identify your 5 most consistent per-session clients", "Draft a monthly retainer that includes sessions, programming, and check-ins", "Present the retainer as more value for a predictable monthly fee"],
      add_client: ["List 3 local PT offices, chiropractors, or corporate HR departments", "Propose a formal cross-referral partnership with each", "Offer a free workshop or lunch-and-learn to get the relationship started"],
      build_passive: ["Identify your most popular training methodology or program", "Record it as a 12-week digital course or downloadable guide", "Launch it on your website with a 30-day promotional campaign"],
      lock_forward: ["Review which clients are currently booking session-by-session", "Offer a 10-15% discount for 6-month or annual prepaid commitments", "Present the offer to your top 10 clients this week"],
    },

    constraints: {
      high_concentration: "A few high-paying private clients account for most of your income. Losing even one or two of them creates an immediate and painful revenue gap that cannot be filled by a single week of marketing.",
      weak_forward_visibility: "Most clients book week to week, and even those on packages can pause or cancel with minimal notice. You rarely know what your income will look like more than 30 days out because client commitment is inherently short-term.",
      high_labor_dependence: "Every dollar you earn as a trainer or practitioner requires your physical presence, energy, and expertise in the room. There is a hard ceiling on your income set by the number of hours your body can work in a day.",
      low_persistence: "A session delivered today does not generate any income tomorrow. When a client cancels, pauses, or leaves, the revenue stops instantly with no residual tail. Your income is only as stable as next week's booking calendar.",
      low_source_diversity: "Your income likely flows through a single channel — private sessions at one gym, group classes at one studio, or treatments at one location. A change in that facility's policies, closure, or rent increase hits all your revenue at once.",
      high_variability: "January is packed, February starts to thin, and summer and holidays see dramatic drop-offs. Your income mirrors your clients' motivation cycles, which swing predictably but painfully throughout the year.",
      weak_durability: "Client loyalty in fitness is notoriously fragile. A new trainer at the gym, a trendy workout app, a life change, or a simple loss of motivation can end a training relationship that you thought was rock-solid.",
      shallow_continuity: "When a client finishes a program or reaches a goal, the relationship often just fades out. You have no structured graduation pathway, no alumni offering, and no next step that keeps them engaged and paying.",
    },
    behaviors: {
      high_concentration: "You devote your best time slots and most energy to your highest-paying clients while neglecting outreach for new ones. Your schedule feels full, but your income is fragile because it depends on so few people.",
      weak_forward_visibility: "You let clients book session by session and hope they keep showing up. You have not offered packages, commitments, or retainers that would give you confirmed revenue for the next quarter.",
      high_labor_dependence: "You have not created any income source that does not require you personally delivering a session. No digital programs, no group offerings, no passive products — just you, trading hours for dollars.",
      low_persistence: "When a client pauses or leaves, you wait to see if they come back instead of proactively reaching out, offering modified programming, or transitioning them to a lower-commitment option that maintains the revenue relationship.",
      low_source_diversity: "All your sessions happen at one location through one arrangement. You have not explored online coaching, corporate wellness, workshop partnerships, or any channel that would survive a disruption to your primary training space.",
      high_variability: "You accept the New Year rush and summer slump as inevitable instead of creating programming — outdoor boot camps, challenge programs, accountability groups — designed specifically to maintain engagement during traditionally slow periods.",
      weak_durability: "You compete on personality and relationship without building systems — progress tracking, nutrition integration, community — that make it genuinely hard for a client to leave and start over with someone else.",
      shallow_continuity: "Clients finish their initial goal and drift away because you have not designed a next phase. There is no progression pathway, no alumni community, and no reason for a satisfied client to keep paying once they feel done.",
    },
    improvements: {
      high_concentration: [
        "Set a goal that no single client represents more than 10% of your monthly income and actively fill gaps with new clients",
        "Launch a small group training offering that serves multiple people per time slot, reducing the income impact of any single cancellation",
        "Build a waitlist system so you always have prospective clients ready to fill slots when existing ones leave",
      ],
      weak_forward_visibility: [
        "Move all clients to monthly or quarterly packages with automatic billing instead of per-session booking",
        "Offer a 10-15% discount for 6-month commitments paid upfront to lock in revenue and improve retention",
        "Track client retention rates monthly so you can forecast natural attrition and plan acquisition efforts accordingly",
      ],
      high_labor_dependence: [
        "Create and sell one digital training program this quarter — even a simple 4-week guide generates income without your physical presence",
        "Launch a small group format that allows you to earn 3-4x your hourly rate by training multiple clients simultaneously",
        "Develop an online coaching tier that includes programming and check-ins but not live sessions, extending your reach beyond available training hours",
      ],
      low_persistence: [
        "Implement a pause policy that keeps departing clients on a reduced-rate maintenance plan instead of fully canceling",
        "Contact every client who has lapsed in the past 90 days with a personalized re-engagement offer",
        "Add ongoing accountability touchpoints — weekly check-ins, monthly assessments, quarterly goal reviews — that create continuity beyond individual sessions",
      ],
      low_source_diversity: [
        "Add at least one new revenue channel — online coaching, corporate wellness, workshop facilitation, or retreat hosting — this quarter",
        "Partner with a complementary practitioner — a nutritionist, physical therapist, or mental health counselor — for cross-referral revenue",
        "Offer your services at a second location or through a virtual platform to reduce dependence on any single facility",
      ],
      high_variability: [
        "Design specific seasonal programming — summer outdoor series, holiday accountability challenges, spring transformation programs — to maintain engagement during traditionally slow months",
        "Create an annual membership with monthly billing that clients pay year-round regardless of session frequency",
        "Build a 30-day challenge or group program that launches during your historically slowest month to generate counter-seasonal demand",
      ],
      weak_durability: [
        "Implement a progress tracking system that shows clients measurable results they cannot get elsewhere, creating emotional switching costs",
        "Build a client community — private group, events, challenges — that creates social bonds making it harder to leave than just quitting a trainer",
        "Integrate nutrition guidance, recovery protocols, and lifestyle coaching into your offering so clients see you as their complete wellness partner, not just a workout facilitator",
      ],
      shallow_continuity: [
        "Design a clear client journey — foundation, development, mastery, maintenance — with distinct phases that always offer a next step",
        "Create an alumni membership with reduced pricing that keeps former intensive clients engaged through group classes, check-ins, and community access",
        "Offer annual reassessment sessions that bring past clients back for a progress review and naturally lead to renewed training commitments",
      ],
    },
    industry_context: "Fitness and wellness professionals face a uniquely personal income challenge — your body is your business, and your earning capacity is capped by the number of hours you can physically train, treat, or coach. Client motivation waxes and wanes with seasons, trends, and life events, creating income volatility that mirrors human psychology more than market economics. The practitioners who build lasting careers create multiple revenue tiers — premium private coaching, scalable group offerings, and passive digital products — while building client communities and progression pathways that keep people engaged far beyond their initial fitness goal.",
    stats: {
      general: "Fitness professionals who combine private training with group offerings and digital products earn 45% more annually than those relying exclusively on one-on-one sessions.",
      redAvg: 33,
      greenAvg: 67,
    },
    reassessment: {
      recurrence: "Have you added any new monthly memberships, coaching retainers, or subscription-based offerings since your last assessment?",
      concentration: "Has your income become more distributed across clients, or are you still heavily dependent on a handful of premium bookings?",
      diversification: "Are you generating revenue from new channels — digital products, corporate wellness, group programming, workshops — that you were not using before?",
      forward: "How far ahead is your booking calendar filled? Do you have more pre-paid commitments and locked-in clients than last time?",
      variability: "Have your seasonal income swings reduced, or is January still dramatically better than July?",
      labor: "Have you created any income source that does not require your physical presence — digital programs, group formats, passive products?",
    },

    worker_context: {
      pressure_framing: "As a fitness or wellness professional, your income pressure comes from the hard ceiling of tradeable hours in a day, the fragility of client motivation, and seasonal demand cycles that mirror human psychology more than market fundamentals.",
      tailwind_framing: "Every client you convert to a monthly retainer, every digital product you launch, and every group format you fill multiplies the value of your expertise beyond what one-on-one sessions alone can generate.",
      arrangement_types: "private training sessions, group class instruction, monthly coaching retainers, corporate wellness contracts, digital program sales, workshop facilitation, studio rent or revenue share, retreat hosting, app subscriptions",
      peer_group_label: "trainers, coaches, and wellness practitioners",
    },
  },


  default: {
    industry_key: "default",
    industry_label: "Professional Services",

    nouns: {
      recurring_revenue: "recurring client fees and subscription revenue",
      top_client: "largest revenue-generating client",
      pipeline: "active opportunities and signed engagements",
      passive_income: "income that arrives without active project delivery",
      forward_commitment: "signed agreements with future revenue commitment",
      active_work: "delivering services and managing client relationships",
    },

    scenarios: {
      lose_top_client:
        "Your single largest revenue source decides to end the relationship, move to a competitor, or bring the work in-house. That client may represent 25-40% of your income, and replacing them requires months of business development with no guarantee of finding an equivalent replacement. Your revenue drops immediately while your costs remain fixed.",
      cant_work_90_days:
        "A health issue or personal emergency takes you completely offline for 90 days. Active client work stalls or must be delegated, and your pipeline of new opportunities goes dormant. Any recurring revenue continues, but project-based and service-based income drops to zero. Overhead costs — rent, subscriptions, insurance — continue uninterrupted.",
      market_slowdown:
        "Economic conditions tighten and your clients reduce spending across the board. New opportunities slow, existing clients defer decisions, and pricing pressure increases as competitors chase the same reduced demand. Your revenue declines without a proportional reduction in your costs or effort.",
      pipeline_dries_up:
        "You have been focused on current client work and realize your pipeline of new opportunities is empty. When your current projects or engagements conclude, there is nothing behind them. Rebuilding pipeline momentum takes weeks to months, during which your income is at risk of a significant gap.",
    },

    actions: {
      convert_retainer:
        "Approach your best clients about converting to a recurring monthly arrangement — a set fee for ongoing access, defined deliverables, and priority availability. This converts unpredictable project revenue into stable monthly income that auto-renews.",
      add_client:
        "Launch a targeted outreach campaign to prospects in an industry or segment you do not currently serve. Diversifying your client base across multiple independent sources protects you from the impact of losing any single relationship.",
      build_passive:
        "Create a product, tool, or subscription offering based on your expertise that generates revenue without requiring your direct involvement in delivery. Even a modest passive income stream fundamentally changes your financial resilience.",
      lock_forward:
        "Structure all new agreements with minimum commitment periods and advance payment terms. Multi-month contracts with defined termination notice windows give you forward revenue visibility and time to adjust if a client decides to leave.",
    },

    actionLabels: {
      convert_retainer: "Convert your best client to a recurring monthly arrangement",
      add_client: "Diversify into a new client segment or industry",
      build_passive: "Create a product or subscription from your expertise",
      lock_forward: "Structure agreements with minimum commitment periods",
    },

    microSteps: {
      convert_retainer: ["Identify the client you work with most frequently on a project basis", "Draft a monthly retainer proposal with defined deliverables and access", "Send it this week — position it as budget predictability for them"],
      add_client: ["Identify an industry or segment you do not currently serve", "Send personalized outreach to 3 prospects in that segment this week", "Offer a free diagnostic or consultation as an entry point"],
      build_passive: ["Identify your most repeatable process or deliverable", "Package it as a template, toolkit, or online course", "Set a 30-day deadline to launch a minimum viable version"],
      lock_forward: ["Review all current agreements for commitment terms", "Add 6-month minimums and 90-day termination notice to new contracts", "Propose renewal terms to your top 3 clients before current engagements end"],
    },

    constraints: {
      high_concentration:
        "Too much of your revenue comes from too few sources. Losing your top client would create a significant income gap that could take months to fill, leaving you financially exposed to decisions you do not control.",
      low_recurrence:
        "Your income resets after each project or engagement concludes. Without recurring revenue arrangements, every period requires new sales just to maintain your current income level.",
      low_diversification:
        "Your revenue comes from a narrow set of services, client types, or market segments. If conditions change in your primary market, you lack alternative income streams to absorb the impact.",
      low_forward_visibility:
        "You lack signed commitments extending more than 30-60 days into the future. Your forward revenue depends on opportunities that have not yet been confirmed, making financial planning unreliable.",
      high_variability:
        "Your monthly income fluctuates significantly based on project timing and client payment patterns. This volatility makes it difficult to budget consistently and creates financial stress during low-revenue periods.",
      high_labor_dependence:
        "Every dollar of revenue requires your personal time and effort. Your income is capped by the hours you can work, and any personal disruption immediately reduces your earning capacity.",
      low_passive_income:
        "You have not built income streams that generate revenue without your active involvement. When you stop working, your income stops entirely.",
      low_continuity:
        "Your business has no structural mechanism to generate revenue in your absence. If you stepped away, client relationships would fade and revenue would cease within weeks.",
    },

    behaviors: {
      high_concentration:
        "Your revenue trajectory is controlled by decisions made by a small number of clients. Changes in their circumstances, priorities, or preferences have outsized impact on your financial stability.",
      low_recurrence:
        "Each month starts at zero, requiring constant sales and business development activity just to maintain your baseline. The psychological weight of this perpetual restart drains energy from your actual work.",
      low_diversification:
        "When your primary market segment experiences pressure, your entire revenue base is affected simultaneously. There is no counter-cyclical income to buffer the impact.",
      low_forward_visibility:
        "You cannot predict your income beyond the next few weeks with any confidence, which prevents you from making commitments, investments, or plans that require financial certainty.",
      high_variability:
        "Your income oscillates between strong periods and lean periods without a predictable pattern. This unpredictability forces defensive financial behavior even during prosperous months.",
      high_labor_dependence:
        "Your revenue is perfectly correlated with your available working hours. There is no leverage or scale in your current model — growth requires proportionally more of your personal time.",
      low_passive_income:
        "Between active client work, your income is zero. There are no products, subscriptions, or automated revenue streams generating background income while you focus on delivery.",
      low_continuity:
        "Your business would generate zero revenue within weeks of your departure. There is no team, product, or system that operates independently of your personal involvement.",
    },

    improvements: {
      high_concentration: [
        "Set a target that no single client exceeds 25% of your revenue and actively pursue relationships to diversify your client base.",
        "Build at least three independent lead generation channels so new client acquisition does not depend on any single source.",
        "Develop a referral program with other professionals who serve your ideal client, creating multiple relationship-based pipelines.",
      ],
      low_recurrence: [
        "Convert your best client relationships to monthly retainer arrangements with auto-renewal terms.",
        "Create a subscription-based service offering that provides ongoing value for a predictable monthly fee.",
        "Structure engagements with built-in continuation phases that extend the revenue duration of each client relationship.",
      ],
      low_diversification: [
        "Identify two adjacent markets where your skills apply and launch a targeted outreach campaign to build presence.",
        "Add a complementary service offering that attracts a different client segment or serves a different need.",
        "Build expertise in an emerging area that opens new client categories not available through your current positioning.",
      ],
      low_forward_visibility: [
        "Structure all agreements with minimum commitment periods and advance payment terms.",
        "Implement a pipeline tracking system that scores opportunities by probability and expected timeline.",
        "Negotiate multi-period contracts that provide committed revenue extending at least one quarter into the future.",
      ],
      high_variability: [
        "Build recurring revenue streams to cover at least your fixed monthly expenses, so variable income only affects discretionary spending.",
        "Create a revenue smoothing system — deposit all income centrally and draw a fixed monthly amount.",
        "Diversify your revenue across multiple types with different timing patterns, reducing the impact of any single source's fluctuations.",
      ],
      high_labor_dependence: [
        "Hire support that can handle routine delivery, freeing your time for high-value work and business development.",
        "Build systems and processes that multiply your output per hour, reducing the labor intensity of each unit of revenue.",
        "Create products or tools based on your expertise that generate revenue without requiring your direct delivery involvement.",
      ],
      low_passive_income: [
        "Productize your most repeatable process into a digital offering that generates sales without your direct involvement.",
        "License your methodology, templates, or tools to others in your field for a recurring fee.",
        "Build an educational product based on your expertise, sold through your professional network.",
      ],
      low_continuity: [
        "Document all processes so another professional could maintain service levels in your absence.",
        "Build a small team with at least one person capable of managing client relationships independently.",
        "Create revenue-generating assets (products, subscriptions) that continue operating without your daily involvement.",
      ],
    },

    industry_context:
      "Your income structure reflects the common pattern of professional service providers — revenue earned through direct client work, with limited structural protection against disruptions. The most important factor in your financial resilience is the ratio of recurring to one-time revenue, followed by client diversification and forward contractual commitments. Building durability means deliberately creating income streams that do not depend on your continuous personal effort.",

    stats: {
      general:
        "Independent professionals across all industries report a median income of $78,000, with significant variation based on specialization and business structure. The most common structural weakness is client concentration, with over 60% of independent professionals reporting that their top three clients represent more than 50% of revenue.",
      redAvg: 32,
      greenAvg: 66,
    },

    reassessment: {
      recurrence:
        "Have you established any new recurring revenue arrangements since your last assessment?",
      concentration:
        "Has the share of revenue from your largest client changed?",
      diversification:
        "Are you now serving markets or offering services you were not active in before?",
      forward:
        "Do you have more signed commitments extending into the future than at your last assessment?",
      variability:
        "Has the spread between your best and worst months narrowed over the past two quarters?",
      labor:
        "Have you added team members, products, or systems that generate revenue without your direct involvement?",
    },

    worker_context: {
      pressure_framing:
        "This person is a professional whose income depends on active client engagement. Pressure points include client concentration, project gaps, labor-dependent delivery, and limited forward visibility. Frame risks in terms of client losses, revenue resets, and the ceiling imposed by personal capacity.",
      tailwind_framing:
        "Strengths manifest as diversified clients, recurring revenue arrangements, signed forward commitments, and team or product leverage. Frame improvements in terms of recurring revenue added, clients diversified, and delivery capacity expanded.",
      arrangement_types:
        "Project fees, retainer arrangements, subscription services, hourly billing, product sales, licensing fees, and referral commissions.",
      peer_group_label:
        "independent professionals and business owners across various industries",
    },
  },
};

// ── Lookup Function ────────────────────────────────────────────────

export function getVocabulary(industry_sector: string): IndustryVocabulary {
  const key = normSector(industry_sector);
  return VOCABULARY[key] || VOCABULARY.default;
}
