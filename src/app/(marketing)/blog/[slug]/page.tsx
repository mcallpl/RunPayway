"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";

/* ================================================================ */
/* UTILITIES                                                         */
/* ================================================================ */

function useInView(threshold = 0) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    if (rect.top < window.innerHeight + 50 && rect.bottom > 0) { setVisible(true); return; }
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setVisible(true); obs.disconnect(); } }, { threshold });
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);
  return { ref, visible };
}

function useMobile(bp = 768) {
  const [m, setM] = useState(false);
  useEffect(() => { const c = () => setM(window.innerWidth <= bp); c(); window.addEventListener("resize", c); return () => window.removeEventListener("resize", c); }, [bp]);
  return m;
}

function useReducedMotion() {
  const [r, setR] = useState(false);
  useEffect(() => { setR(window.matchMedia("(prefers-reduced-motion: reduce)").matches); }, []);
  return r;
}

function useFadeIn() {
  const reduced = useReducedMotion();
  return (visible: boolean, delay = 0): React.CSSProperties =>
    reduced ? {} : {
      opacity: visible ? 1 : 0,
      transform: visible ? "translateY(0)" : "translateY(16px)",
      transition: `opacity 600ms cubic-bezier(0.22,1,0.36,1) ${delay}ms, transform 600ms cubic-bezier(0.22,1,0.36,1) ${delay}ms`,
    };
}


/* ================================================================ */
/* DESIGN SYSTEM                                                     */
/* ================================================================ */

const C = {
  navy: "#0E1A2B",
  purple: "#4B3FAE",
  teal: "#1F6D7A",
  sand: "#F4F1EA",
  white: "#FFFFFF",
  textSecondary: "#5E6873",
  textMuted: "#7B848E",
  borderSoft: "#D9D6CF",
  sandText: "#F4F1EA",
  sandMuted: "rgba(244,241,234,0.55)",
  sandLight: "rgba(244,241,234,0.40)",
};

const sectionPx = (m: boolean) => m ? 24 : 48;
const mono = '"SF Mono", "Fira Code", "IBM Plex Mono", "Courier New", monospace';


/* ================================================================ */
/* ARTICLE METADATA                                                  */
/* ================================================================ */

interface ArticleMeta {
  slug: string;
  title: string;
  category: string;
  readTime: string;
  date: string;
  author: string;
  excerpt: string;
}

const ARTICLES: ArticleMeta[] = [
  {
    slug: "the-income-stability-gap",
    title: "The Income Stability Gap: What Your Accountant, Advisor, and Bank All Miss",
    category: "INSIGHT",
    readTime: "8 min read",
    date: "April 12, 2026",
    author: "RunPayway Research",
    excerpt: "Three professionals look at your money. None of them measure the one thing that determines whether your income survives next quarter.",
  },
  {
    slug: "what-is-income-stability",
    title: "What Is Income Stability \u2014 And Why Nobody Measures It",
    category: "FUNDAMENTALS",
    readTime: "7 min read",
    date: "April 8, 2026",
    author: "RunPayway Research",
    excerpt: "Credit scores measure borrowing. Income verification measures amounts. Nobody measures how income is built. That gap has consequences.",
  },
  {
    slug: "hidden-risk-in-commission-income",
    title: "The Hidden Structural Risk in Commission-Based Income",
    category: "ANALYSIS",
    readTime: "8 min read",
    date: "April 3, 2026",
    author: "RunPayway Research",
    excerpt: "Commission earners often appear successful on paper while operating one of the most fragile income structures in the modern economy.",
  },
  {
    slug: "recurring-revenue-for-service-businesses",
    title: "Why Recurring Revenue Changes Everything for Service Businesses",
    category: "STRATEGY",
    readTime: "7 min read",
    date: "April 1, 2026",
    author: "RunPayway Research",
    excerpt: "The single most impactful structural change a service business can make is converting project-based work to recurring arrangements.",
  },
];


/* ================================================================ */
/* TYPOGRAPHY HELPERS                                                */
/* ================================================================ */

function P({ children, style }: { children: React.ReactNode; style?: React.CSSProperties }) {
  return (
    <p style={{ fontSize: 17, fontWeight: 400, lineHeight: 1.75, color: C.textSecondary, marginBottom: 24, ...style }}>
      {children}
    </p>
  );
}

function H2({ children }: { children: React.ReactNode }) {
  return (
    <h2 style={{ fontSize: 24, fontWeight: 600, lineHeight: 1.3, letterSpacing: "-0.02em", color: C.navy, marginTop: 48, marginBottom: 16 }}>
      {children}
    </h2>
  );
}

function H3({ children }: { children: React.ReactNode }) {
  return (
    <h3 style={{ fontSize: 20, fontWeight: 600, lineHeight: 1.3, letterSpacing: "-0.015em", color: C.navy, marginTop: 36, marginBottom: 12 }}>
      {children}
    </h3>
  );
}

function PullQuote({ children }: { children: React.ReactNode }) {
  return (
    <blockquote style={{
      borderLeft: `3px solid ${C.teal}`,
      paddingLeft: 24,
      marginLeft: 0,
      marginRight: 0,
      marginTop: 32,
      marginBottom: 32,
    }}>
      <p style={{ fontSize: 19, fontWeight: 500, lineHeight: 1.65, color: C.navy, fontStyle: "normal", margin: 0 }}>
        {children}
      </p>
    </blockquote>
  );
}

function BulletList({ items }: { items: string[] }) {
  return (
    <div style={{ display: "flex", flexDirection: "column" as const, gap: 10, marginBottom: 24, marginTop: 8 }}>
      {items.map((item, i) => (
        <div key={i} style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
          <div style={{ width: 6, height: 6, borderRadius: "50%", backgroundColor: C.teal, flexShrink: 0, marginTop: 9 }} />
          <span style={{ fontSize: 17, color: C.textSecondary, lineHeight: 1.75 }}>{item}</span>
        </div>
      ))}
    </div>
  );
}


/* ================================================================ */
/* ARTICLE 1: WHAT IS INCOME STABILITY                               */
/* ================================================================ */

function Article1() {
  return (
    <>
      <P>
        There is a measurement gap at the center of personal finance. Credit scores evaluate borrowing behavior. Income verification confirms amounts. Net worth calculations tally accumulated assets. But none of these instruments answer a more fundamental question: how is income actually built?
      </P>
      <P>
        This is not a theoretical distinction. The structural characteristics of income&mdash;how it arrives, what it depends on, and how it behaves when conditions change&mdash;determine financial resilience more than the dollar figure on a tax return. Two individuals earning $150,000 per year can have radically different financial positions depending on whether that income is contractually recurring or entirely contingent on new sales each quarter.
      </P>

      <H2>The Measurement That Does Not Exist</H2>
      <P>
        Credit scoring, introduced in the 1950s and standardized by FICO in 1989, addressed a real problem: lenders needed a consistent way to evaluate borrowing risk. The system works. But it measures one dimension of financial life&mdash;how you manage debt&mdash;and says nothing about the income that services it.
      </P>
      <P>
        Income verification, used in mortgage underwriting and employment screening, confirms that income exists and reaches a certain threshold. It answers the question of &ldquo;how much&rdquo; while ignoring the question of &ldquo;how.&rdquo;
      </P>
      <PullQuote>
        A freelancer earning $200,000 from twelve clients with annual contracts and a commission-only salesperson earning $200,000 from unpredictable closings are not in the same structural position. Existing systems treat them identically.
      </PullQuote>

      <H2>What Income Stability Actually Means</H2>
      <P>
        Income stability is not income predictability. Predictability implies forecasting&mdash;an attempt to estimate future amounts. Stability, as defined structurally, describes the architectural properties of how income is generated right now.
      </P>
      <P>
        Six dimensions define it:
      </P>
      <BulletList items={[
        "Source diversification \u2014 how concentrated income is across clients, contracts, or revenue streams",
        "Revenue type \u2014 whether income is recurring, project-based, commission-driven, or a hybrid",
        "Contractual protection \u2014 the degree to which income is backed by binding agreements with defined terms",
        "Client concentration \u2014 dependency on any single source for a disproportionate share of revenue",
        "Income continuity \u2014 whether income continues when active labor stops, even temporarily",
        "Forward visibility \u2014 how far ahead committed or contracted income extends",
      ]} />
      <P>
        Each dimension captures a different structural property. Together, they produce a composite view of how income is built&mdash;not how much of it exists.
      </P>

      <H2>Why This Matters for Non-Salaried Earners</H2>
      <P>
        Salaried employees benefit from built-in structural advantages: recurring payroll, employment contracts, benefits continuity, and often severance provisions. These properties score well on structural measures without any deliberate effort by the earner.
      </P>
      <P>
        Freelancers, consultants, business owners, and commission-based professionals operate without these defaults. Their income structures are self-built, often by accident, and rarely evaluated. A management consultant who has drifted into a position where 70% of revenue comes from a single client has a structural vulnerability that no income statement will reveal. A freelance designer with eight clients on monthly retainers has built a more resilient structure than many salaried positions, but no system recognizes this.
      </P>

      <H2>The Case for Deterministic Measurement</H2>
      <P>
        One of the persistent problems in financial assessment is subjectivity. Advisory opinions vary. Risk models incorporate probabilistic assumptions that change over time. Two advisors reviewing the same client may reach different conclusions.
      </P>
      <P>
        A deterministic model eliminates this variability. Given identical inputs, it produces identical outputs. The same income structure, evaluated on the same model version, will always yield the same score. This is not a minor technical detail&mdash;it is the difference between a measurement and an opinion.
      </P>
      <PullQuote>
        The goal is not to predict what will happen to your income. The goal is to measure what is structurally true about it right now.
      </PullQuote>

      <H2>What Changes When You Can See Structure</H2>
      <P>
        Measurement creates leverage. When income structure becomes visible, specific improvements become actionable. A score that highlights low contractual protection and high client concentration does not require interpretation&mdash;it points directly at what to address. Convert informal arrangements to contracts. Diversify the client base. Introduce a recurring revenue component.
      </P>
      <P>
        These are not abstract financial goals. They are structural changes with measurable impact on how income behaves when a client leaves, a contract ends, or market conditions shift.
      </P>
      <P>
        The absence of this measurement has persisted not because the concept is complex, but because nobody built the system to deliver it. That gap is now closed.
      </P>
    </>
  );
}


/* ================================================================ */
/* ARTICLE 2: HIDDEN RISK IN COMMISSION INCOME                       */
/* ================================================================ */

function Article2() {
  return (
    <>
      <P>
        Commission-based income occupies a peculiar position in the financial landscape. On paper, commission earners frequently outperform their salaried counterparts. Top real estate agents, insurance producers, and enterprise sales professionals routinely generate annual income well into six figures. By conventional metrics&mdash;gross income, year-over-year growth, even net worth accumulation&mdash;they appear financially strong.
      </P>
      <P>
        But income amount is not income structure. And when you evaluate commission income structurally, a different picture emerges&mdash;one defined by concentration, fragility, and dependence on conditions that the earner does not control.
      </P>

      <H2>The Structural Profile of Commission Income</H2>
      <P>
        Commission-based income has several characteristics that score poorly across structural dimensions, regardless of the dollar amount involved.
      </P>
      <H3>Zero Forward Visibility</H3>
      <P>
        Commission income, by definition, is earned at the point of transaction. There is no backlog, no contracted future revenue, no pipeline that constitutes a binding obligation. A salesperson who closed $400,000 last quarter may close $80,000 next quarter. There is no structural mechanism that prevents this.
      </P>
      <P>
        Forward visibility&mdash;the degree to which future income is committed or contracted&mdash;is one of the most heavily weighted dimensions in income stability measurement. Commission structures typically score near zero on this dimension.
      </P>

      <H3>Full Labor Dependence</H3>
      <P>
        Commission income stops when active selling stops. Illness, travel, family obligations, or simply a slow month produces an immediate income gap with no contractual cushion. There is no passive component, no residual stream, no mechanism that generates revenue absent the earner&rsquo;s direct effort.
      </P>
      <P>
        This is distinct from, say, a consultant on a six-month retainer who receives payment regardless of whether any specific deliverable ships in a given week.
      </P>

      <H3>Revenue Concentration</H3>
      <P>
        In many commission environments, a small number of large transactions comprise the majority of annual income. A real estate agent who closes 15 deals per year may derive 60% of their income from three or four transactions. The departure of one referral source or a downturn in one market segment can reshape the entire income picture.
      </P>

      <H2>A Structural Case Study</H2>
      <P>
        Consider a residential real estate agent earning $180,000 annually. By most standards, this is a strong income. But examine the structure:
      </P>
      <BulletList items={[
        "Revenue composition: 90% commission-based, 10% from a small property management side arrangement",
        "Client concentration: 45% of annual income derived from referrals through a single mortgage broker relationship",
        "Contractual protection: zero binding contracts; every transaction is a new, independent engagement",
        "Forward visibility: no committed income beyond listings currently under contract (typically 30\u201360 days)",
        "Income continuity: income drops to near zero within 60 days of ceasing active work",
        "Source diversification: effectively two income sources\u2014commission sales and a minor management fee",
      ]} />
      <P>
        Evaluated structurally, this income profile produces a score of approximately 28 out of 100. The gap between the perceived strength ($180,000 annual income) and the structural reality (a score of 28) is not a rounding error. It represents genuine financial fragility that existing instruments fail to surface.
      </P>
      <PullQuote>
        An income of $180,000 with a structural score of 28 is not a strong financial position with room for improvement. It is a fragile position that happens to be generating high revenue in the current period.
      </PullQuote>

      <H2>Why This Matters Beyond the Individual</H2>
      <P>
        The structural risk in commission income extends beyond personal financial planning. Lenders who evaluate commission earners based on two years of tax returns are measuring historical output, not structural durability. A mortgage underwriter approving a $600,000 loan based on $180,000 in commission income is making a bet on structural conditions they have not evaluated.
      </P>
      <P>
        Financial advisors managing wealth for commission-based clients face a similar blind spot. Asset allocation strategies built on assumed income continuity are structurally unsound when the income itself has no continuity mechanism.
      </P>

      <H2>What Commission Earners Can Do</H2>
      <P>
        The structural weaknesses of commission income are not permanent. They are architectural, which means they can be redesigned. The highest-impact changes:
      </P>
      <BulletList items={[
        "Introduce a recurring revenue component\u2014even a small retainer or management fee fundamentally changes the income profile",
        "Diversify referral sources to reduce dependency on any single relationship for more than 20% of revenue",
        "Convert repeat client relationships into formal, contracted arrangements where possible",
        "Build pipeline mechanisms that extend forward visibility beyond the current transaction cycle",
      ]} />
      <P>
        None of these changes require earning less or working differently in a fundamental sense. They require restructuring how existing economic activity is organized&mdash;converting transactional relationships into structural ones.
      </P>
      <P>
        The first step is measurement. Until the structural properties of income are visible, the specific improvements remain unclear. That is the problem structural income scoring solves.
      </P>
    </>
  );
}


/* ================================================================ */
/* ARTICLE 3: RECURRING REVENUE FOR SERVICE BUSINESSES               */
/* ================================================================ */

function Article3() {
  return (
    <>
      <P>
        Service businesses&mdash;consulting firms, agencies, professional practices, freelance operations&mdash;share a common structural default: project-based revenue. A client engages for a defined scope, the work is delivered, payment is collected, and the cycle resets. Each new period requires new sales to replace the revenue that expired with the last deliverable.
      </P>
      <P>
        This model is functional. Millions of service businesses operate profitably on project-based revenue. But profitability and structural resilience are different measurements, and on the dimension that matters most for long-term stability&mdash;how income behaves under change&mdash;project-based revenue has significant weaknesses.
      </P>

      <H2>The Structural Problem with Project Revenue</H2>
      <P>
        Project-based income suffers from three structural limitations that compound over time.
      </P>
      <P>
        First, forward visibility resets with each project completion. A consulting firm that delivers a $50,000 strategy engagement has zero committed revenue the day after delivery unless new work has already been contracted. The financial position on December 1st may look nothing like the position on January 15th, based solely on pipeline timing.
      </P>
      <P>
        Second, revenue continuity is zero. Income stops when projects stop. There is no residual component, no passive stream, no mechanism that generates revenue between active engagements. This creates a perpetual sales obligation that competes with delivery capacity.
      </P>
      <P>
        Third, client relationships are episodic rather than structural. A client who engages for a single project may or may not return. There is no contractual obligation to continue, no switching cost, and no institutional dependency that creates retention by default.
      </P>
      <PullQuote>
        The most profitable quarter in a project-based business provides no structural guarantee about the next quarter. Revenue must be re-earned continuously, from scratch, with no compounding effect.
      </PullQuote>

      <H2>What Recurring Revenue Changes</H2>
      <P>
        Recurring revenue&mdash;income that arrives on a contracted, repeating basis&mdash;addresses each of these structural weaknesses directly.
      </P>
      <P>
        Forward visibility extends to the duration of the agreement. A 12-month retainer contracted in January provides visibility through December. A monthly subscription with a 90-day notice period provides at least three months of committed revenue at any point.
      </P>
      <P>
        Revenue continuity becomes inherent rather than dependent on active selling. A service business with $30,000 in monthly retainer revenue generates $360,000 annually before any new project is sold. That base exists regardless of pipeline conditions, market shifts, or seasonal slowdowns.
      </P>
      <P>
        Client relationships shift from episodic to structural. Recurring arrangements create institutional dependency&mdash;the client&rsquo;s operations integrate with the service provider, creating natural retention through switching costs and relationship depth.
      </P>

      <H2>Practical Conversion Strategies</H2>
      <P>
        Converting project-based revenue to recurring revenue is not a theoretical exercise. It requires specific structural changes to how services are packaged, priced, and delivered.
      </P>

      <H3>Retainer Conversion</H3>
      <P>
        The most direct path. Identify clients who engage repeatedly for similar work and propose a monthly retainer that covers a defined scope of ongoing service. A marketing consultant who produces quarterly strategy decks for three clients can convert those project engagements into monthly retainers with a broader but more consistent scope. The client gets predictable access; the provider gets predictable revenue.
      </P>
      <P>
        Effective retainer structures define hours or deliverables per month, include a minimum commitment period (six months is standard for initial agreements), and price at a modest discount to equivalent project rates to incentivize the switch.
      </P>

      <H3>Subscription Models</H3>
      <P>
        For service businesses that can productize elements of their offering, subscription models create recurring revenue at scale. An accounting firm that offers quarterly advisory calls, monthly financial reviews, and annual tax preparation as a bundled monthly subscription fundamentally changes its revenue structure compared to billing each service as a discrete project.
      </P>
      <P>
        Subscription models work best when the underlying service has a natural recurring cadence and when the value compounds over time as the provider accumulates context about the client.
      </P>

      <H3>Maintenance and Support Agreements</H3>
      <P>
        Service businesses that deliver implementation projects have a natural recurring revenue opportunity in ongoing maintenance. A web development agency that builds a platform can offer a monthly maintenance agreement covering hosting management, security updates, performance monitoring, and a defined number of modification hours. This converts a one-time project into a long-term revenue stream.
      </P>
      <P>
        Maintenance agreements typically generate lower per-hour revenue than project work but dramatically improve structural scores through forward visibility and income continuity.
      </P>

      <H2>The Compounding Effect</H2>
      <P>
        The structural impact of recurring revenue compounds. Each new retainer or subscription adds to a base that persists independently. A service business that converts three clients to monthly retainers per quarter accumulates a recurring base that grows by twelve clients per year. After two years, the business has a structural foundation of 24 recurring relationships generating predictable monthly revenue.
      </P>
      <P>
        This compounding effect is visible in structural scoring. A service business that begins with a score driven primarily by project revenue will see measurable improvement with each recurring arrangement added&mdash;not because income increases, but because the architecture of that income changes.
      </P>
      <PullQuote>
        The question is not whether recurring revenue is better than project revenue. Structurally, this is settled. The question is how quickly a service business can shift its income architecture toward a recurring base.
      </PullQuote>
      <P>
        Measurement accelerates this process. When the structural properties of income are visible, the impact of each conversion is quantifiable. A retainer that moves the score from 42 to 49 is not an abstraction&mdash;it is a specific, measurable improvement in how income behaves under real-world conditions.
      </P>
      <P>
        The structural shift from project-based to recurring revenue is the single highest-leverage change available to most service businesses. It does not require new skills, new markets, or new clients. It requires reorganizing existing relationships around a different revenue architecture&mdash;one that compounds rather than resets.
      </P>
    </>
  );
}


/* ================================================================ */
/* CONTENT ROUTER                                                    */
/* ================================================================ */

function getArticleContent(slug: string): React.ReactNode | null {
  switch (slug) {
    case "the-income-stability-gap": return <Article4 />;
    case "what-is-income-stability": return <Article1 />;
    case "hidden-risk-in-commission-income": return <Article2 />;
    case "recurring-revenue-for-service-businesses": return <Article3 />;
    default: return null;
  }
}


/* ================================================================ */
/* ARTICLE 4: THE INCOME STABILITY GAP                               */
/* ================================================================ */

function Article4() {
  return (
    <>
      <P>
        Three professionals look at your money. Your accountant tracks what you earned last year. Your financial advisor manages what you&rsquo;ve accumulated. Your bank verifies how much comes in each month. Between the three of them, they cover income history, asset growth, and cash flow.
      </P>
      <P>
        None of them measure the one thing that determines whether your income survives next quarter.
      </P>

      <H2>The Gap Nobody Talks About</H2>
      <P>
        Consider a management consultant earning $180,000 a year. On paper, everything looks strong. The accountant files clean returns. The advisor allocates a healthy portfolio. The bank approves the mortgage. Every system says &ldquo;this person is doing well.&rdquo;
      </P>
      <P>
        But here&rsquo;s what none of them see: 70% of that $180,000 comes from a single client on a handshake agreement. Nothing is contracted beyond the current quarter. There&rsquo;s no recurring revenue, no retainer, no written commitment past 90 days. If that client changes direction, $126,000 vanishes&mdash;and there&rsquo;s nothing in the pipeline to replace it.
      </P>
      <P>
        The consultant&rsquo;s income isn&rsquo;t $180,000. It&rsquo;s $180,000 <em>if nothing changes</em>. That distinction is invisible to every tool in the current financial system.
      </P>

      <PullQuote>
        Your accountant sees what happened. Your advisor manages what accumulated. Your bank verifies what arrived. Nobody measures whether it will continue.
      </PullQuote>

      <H2>What Your Accountant Misses</H2>
      <P>
        Accountants are essential. They organize financial records, ensure tax compliance, and identify deductions. But their lens is backward-looking by design. They work with what has already occurred.
      </P>
      <P>
        A tax return shows $180,000 in revenue. It does not show that $126,000 of it came from one source with no contract. It does not show that income arrived in three large deposits with nothing in the months between. It does not show that the entire earning structure depends on one relationship continuing exactly as it has.
      </P>
      <P>
        The accountant&rsquo;s job is to report accurately on the past. The stability of the income going forward is outside that scope&mdash;not because they don&rsquo;t care, but because no tool exists to measure it.
      </P>

      <H2>What Your Financial Advisor Misses</H2>
      <P>
        Financial advisors focus on what you&rsquo;ve built: retirement accounts, investment portfolios, insurance coverage, estate plans. Their expertise is in managing accumulated wealth and protecting it over time.
      </P>
      <P>
        But the income funding those accounts? That&rsquo;s treated as a given. The standard planning conversation assumes income continues at roughly the same level. The advisor models what happens to your portfolio over 20 years&mdash;but rarely asks what happens if the income feeding it drops 40% in the next six months.
      </P>
      <P>
        This isn&rsquo;t negligence. It&rsquo;s a blind spot built into the advisory model. Financial planning tools don&rsquo;t have an input field for &ldquo;how much of your income is actually protected.&rdquo; The question has never had a measurable answer.
      </P>

      <H2>What Your Bank Misses</H2>
      <P>
        Banks verify income for one purpose: to determine whether you can service a debt. Mortgage underwriting looks at two years of tax returns, recent pay stubs, and bank statements. The question is simple: does enough money come in to cover the payment?
      </P>
      <P>
        What they don&rsquo;t evaluate is how that income is constructed. A W-2 employee earning $180,000 from a Fortune 500 company and a freelance consultant earning $180,000 from a single client look identical on a loan application. Both show the same annual income. Both can demonstrate consistent deposits.
      </P>
      <P>
        But the risk profiles are completely different. The employee has contractual protections, severance provisions, and unemployment insurance. The consultant has none of those. The bank&rsquo;s system can&rsquo;t distinguish between the two because it was never designed to.
      </P>

      <H2>The Layer Between Earning and Keeping</H2>
      <P>
        This is the income stability gap. Not a gap in how much you earn&mdash;a gap in understanding <em>how</em> you earn it. Specifically:
      </P>
      <BulletList items={[
        "How many sources does your income depend on?",
        "How much of it is contractually committed beyond this month?",
        "What percentage is recurring versus one-time?",
        "What happens to your total income if your largest source disappears?",
        "How far ahead can you see with reasonable certainty?",
      ]} />
      <P>
        These aren&rsquo;t abstract questions. They determine whether a bad quarter is an inconvenience or a crisis. And until now, no system existed to answer them with a consistent, measurable score.
      </P>

      <H2>Why This Gap Exists</H2>
      <P>
        The financial system evolved around three pillars: credit risk, asset management, and income verification. Each serves a critical function. But each was built for a world where most income was salaried, predictable, and employer-backed.
      </P>
      <P>
        That world is shrinking. Today, over 36% of the U.S. workforce earns through freelance, contract, gig, or commission-based arrangements. For these earners, income is not a fixed input&mdash;it&rsquo;s a variable output that depends on client retention, deal flow, market conditions, and personal capacity.
      </P>
      <P>
        The tools that evaluate financial health were not built for this reality. Credit scores don&rsquo;t account for it. Financial plans assume around it. Bank underwriting ignores it. The result is a growing population of earners whose financial picture looks complete on the surface&mdash;but has a critical measurement missing underneath.
      </P>

      <PullQuote>
        The financial system was built for salaried income. The workforce moved on. The measurement tools didn&rsquo;t.
      </PullQuote>

      <H2>Closing the Gap</H2>
      <P>
        RunPayway&#8482; was built to fill this gap. The Income Stability Score&#8482; measures the six key dimensions of how income is constructed&mdash;not the amount. It evaluates source diversity, income persistence, forward visibility, concentration risk, labor dependence, and earnings consistency.
      </P>
      <P>
        The result is a score from 0 to 100 that tells you what no accountant, advisor, or bank currently can: how much of your income is protected, how much is at risk, and what specific actions would strengthen it.
      </P>
      <P>
        It doesn&rsquo;t replace any of these professionals. It gives them&mdash;and you&mdash;the measurement that&rsquo;s been missing. The one that sits between earning money and being able to count on it.
      </P>

      <H2>What To Do Next</H2>
      <P>
        If you earn variable income&mdash;through consulting, freelancing, commissions, business ownership, or any arrangement where next quarter isn&rsquo;t guaranteed&mdash;the stability gap applies to you. The question isn&rsquo;t whether your income is good. It&rsquo;s whether your income is built to last.
      </P>
      <P style={{ fontWeight: 600, color: "#0E1A2B" }}>
        RunPayway&#8482; measures that in under two minutes. No financial accounts required. No documents. Just what you already know about how your income works.
      </P>
    </>
  );
}


/* ================================================================ */
/* ARTICLE HEADER                                                    */
/* ================================================================ */

function ArticleHeader({ article }: { article: ArticleMeta }) {
  const { ref, visible } = useInView();
  const m = useMobile();
  const fadeIn = useFadeIn();

  return (
    <header ref={ref} style={{ backgroundColor: C.sand, paddingTop: m ? 104 : 148, paddingBottom: m ? 48 : 72, paddingLeft: sectionPx(m), paddingRight: sectionPx(m) }}>
      <div style={{ maxWidth: 720, margin: "0 auto" }}>
        <div style={{ fontFamily: mono, fontSize: 11, fontWeight: 600, letterSpacing: "0.14em", textTransform: "uppercase" as const, color: C.teal, marginBottom: 16, ...fadeIn(visible) }}>
          {article.category}
        </div>
        <h1 style={{ fontSize: m ? 28 : 48, fontWeight: 700, lineHeight: 1.12, letterSpacing: "-0.035em", color: C.navy, marginBottom: 24, ...fadeIn(visible, 50) }}>
          {article.title}
        </h1>
        <div style={{ display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap", ...fadeIn(visible, 100) }}>
          <span style={{ fontSize: 14, fontWeight: 500, color: C.navy }}>{article.author}</span>
          <span style={{ width: 3, height: 3, borderRadius: "50%", backgroundColor: C.textMuted, flexShrink: 0 }} />
          <span style={{ fontFamily: mono, fontSize: 12, fontWeight: 500, color: C.textMuted }}>{article.date}</span>
          <span style={{ width: 3, height: 3, borderRadius: "50%", backgroundColor: C.textMuted, flexShrink: 0 }} />
          <span style={{ fontFamily: mono, fontSize: 12, fontWeight: 500, color: C.textMuted }}>{article.readTime}</span>
        </div>
      </div>
    </header>
  );
}


/* ================================================================ */
/* ARTICLE BODY                                                      */
/* ================================================================ */

function ArticleBody({ slug }: { slug: string }) {
  const { ref, visible } = useInView();
  const m = useMobile();
  const fadeIn = useFadeIn();
  const content = getArticleContent(slug);

  if (!content) return null;

  return (
    <section ref={ref} style={{ backgroundColor: C.white, paddingTop: m ? 48 : 72, paddingBottom: m ? 48 : 72, paddingLeft: sectionPx(m), paddingRight: sectionPx(m) }}>
      <div style={{ maxWidth: 720, margin: "0 auto", ...fadeIn(visible) }}>
        {content}
      </div>
    </section>
  );
}


/* ================================================================ */
/* CTA SECTION                                                       */
/* ================================================================ */

function ArticleCta() {
  const { ref, visible } = useInView();
  const m = useMobile();
  const fadeIn = useFadeIn();

  return (
    <section ref={ref} style={{ backgroundColor: C.navy, paddingTop: m ? 72 : 100, paddingBottom: m ? 72 : 100, paddingLeft: sectionPx(m), paddingRight: sectionPx(m) }}>
      <div style={{ maxWidth: 600, margin: "0 auto", textAlign: "center" }}>
        <p style={{ fontFamily: mono, fontSize: 11, fontWeight: 600, letterSpacing: "0.14em", textTransform: "uppercase" as const, color: C.teal, marginBottom: 16, ...fadeIn(visible) }}>
          YOUR INCOME SCORE
        </p>
        <h2 style={{ fontSize: m ? 24 : 32, fontWeight: 600, lineHeight: 1.15, letterSpacing: "-0.028em", color: C.sandText, marginBottom: 16, ...fadeIn(visible, 50) }}>
          Your income has a structure. See&nbsp;yours.
        </h2>
        <p style={{ fontSize: 17, fontWeight: 400, lineHeight: 1.6, color: C.sandMuted, marginBottom: 32, ...fadeIn(visible, 100) }}>
          RunPayway&#8482; scores how much of your income is protected, how much is at risk, and what to do about it. Under 2 minutes. Consistent results. Private by&nbsp;default.
        </p>
        <div style={{ ...fadeIn(visible, 150) }}>
          <Link href="/begin" style={{
            display: "inline-flex", alignItems: "center", justifyContent: "center",
            height: m ? 52 : 56, width: m ? "100%" : "auto",
            padding: m ? "0 24px" : "0 32px",
            borderRadius: 14, backgroundColor: C.white, color: C.navy,
            fontSize: 16, fontWeight: 600, textDecoration: "none",
            boxShadow: "0 8px 24px rgba(14,26,43,0.08)",
            border: `1px solid ${C.borderSoft}`,
            transition: "transform 200ms, box-shadow 200ms",
          }}
            onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = "0 12px 32px rgba(14,26,43,0.12)"; }}
            onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "0 8px 24px rgba(14,26,43,0.08)"; }}>
            Get Your Income Stability Score
          </Link>
        </div>
      </div>
    </section>
  );
}


/* ================================================================ */
/* RELATED ARTICLES                                                  */
/* ================================================================ */

function RelatedArticles({ currentSlug }: { currentSlug: string }) {
  const { ref, visible } = useInView();
  const m = useMobile();
  const fadeIn = useFadeIn();

  const related = ARTICLES.filter(a => a.slug !== currentSlug).slice(0, 2);

  return (
    <section ref={ref} style={{ backgroundColor: C.sand, paddingTop: m ? 56 : 80, paddingBottom: m ? 56 : 80, paddingLeft: sectionPx(m), paddingRight: sectionPx(m) }}>
      <div style={{ maxWidth: 720, margin: "0 auto" }}>
        <div style={{ fontFamily: mono, fontSize: 11, fontWeight: 600, letterSpacing: "0.14em", textTransform: "uppercase" as const, color: C.teal, marginBottom: 24, ...fadeIn(visible) }}>
          RELATED RESEARCH
        </div>
        <div style={{ display: "grid", gridTemplateColumns: m ? "1fr" : "1fr 1fr", gap: m ? 16 : 24 }}>
          {related.map((article, i) => (
            <RelatedCard key={article.slug} article={article} index={i} visible={visible} />
          ))}
        </div>
      </div>
    </section>
  );
}

function RelatedCard({ article, index, visible }: { article: ArticleMeta; index: number; visible: boolean }) {
  const fadeIn = useFadeIn();
  const [hovered, setHovered] = useState(false);

  return (
    <Link
      href={`/blog/${article.slug}`}
      style={{ textDecoration: "none", display: "block", ...fadeIn(visible, index * 80 + 50) }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div style={{
        backgroundColor: C.white,
        border: `1px solid ${hovered ? "rgba(14,26,43,0.12)" : "rgba(14,26,43,0.06)"}`,
        borderRadius: 14,
        padding: 24,
        transition: "border-color 280ms cubic-bezier(0.22,1,0.36,1), box-shadow 280ms cubic-bezier(0.22,1,0.36,1)",
        boxShadow: hovered ? "0 8px 24px rgba(14,26,43,0.06)" : "0 2px 8px rgba(14,26,43,0.02)",
      }}>
        <div style={{ fontFamily: mono, fontSize: 10, fontWeight: 600, letterSpacing: "0.12em", textTransform: "uppercase" as const, color: C.teal, marginBottom: 10 }}>
          {article.category}
        </div>
        <div style={{ fontSize: 16, fontWeight: 600, lineHeight: 1.35, color: C.navy, marginBottom: 8 }}>
          {article.title}
        </div>
        <div style={{ fontFamily: mono, fontSize: 11, fontWeight: 500, color: C.textMuted }}>
          {article.readTime}
        </div>
      </div>
    </Link>
  );
}


/* ================================================================ */
/* 404 STATE                                                         */
/* ================================================================ */

function NotFoundState() {
  const m = useMobile();

  return (
    <section style={{ backgroundColor: C.sand, paddingTop: m ? 120 : 180, paddingBottom: m ? 120 : 180, paddingLeft: sectionPx(m), paddingRight: sectionPx(m), textAlign: "center" }}>
      <h1 style={{ fontSize: m ? 28 : 40, fontWeight: 600, color: C.navy, marginBottom: 16 }}>Article Not Found</h1>
      <p style={{ fontSize: 17, color: C.textSecondary, marginBottom: 32 }}>The article you are looking for does not exist.</p>
      <Link href="/blog" style={{ fontSize: 16, fontWeight: 600, color: C.teal, textDecoration: "none" }}>
        Back to Research &amp; Insights
      </Link>
    </section>
  );
}


/* ================================================================ */
/* PAGE EXPORT                                                       */
/* ================================================================ */

export default function BlogArticlePage() {
  const params = useParams();
  const slug = typeof params.slug === "string" ? params.slug : "";
  const article = ARTICLES.find(a => a.slug === slug);

  if (!article) {
    return (
      <div className="overflow-x-hidden">
        <main>
          <NotFoundState />
        </main>
      </div>
    );
  }

  return (
    <div className="overflow-x-hidden">
      <main>
        <ArticleHeader article={article} />
        <ArticleBody slug={slug} />
        <ArticleCta />
        <RelatedArticles currentSlug={slug} />
      </main>
    </div>
  );
}
