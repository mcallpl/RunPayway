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
/* ARTICLE DATA                                                      */
/* ================================================================ */

const ARTICLES = [
  {
    slug: "post-tax-season-income-review",
    title: "Post-Tax-Season Income Review: 5 Stability Gaps Most Owners Overlook",
    excerpt: "Your tax return shows what you made. It doesn't tell you if your income is stable. Here are the 5 gaps keeping you fragile—and what to do about them.",
    category: "STRATEGY",
    readTime: "12 min read",
    date: "April 21, 2026",
    author: "RunPayway Research",
  },
  {
    slug: "the-income-stability-gap",
    title: "The Income Stability Gap: What Your Accountant, Advisor, and Bank All Miss",
    excerpt: "Three professionals look at your money. None of them measure the one thing that determines whether your income survives next quarter.",
    category: "INSIGHT",
    readTime: "8 min read",
    date: "April 12, 2026",
    author: "RunPayway Research",
  },
  {
    slug: "what-is-income-stability",
    title: "What Is Income Stability — And Why Nobody Measures It",
    excerpt: "Credit scores measure borrowing. Income verification measures amounts. Nobody measures how income is built. That gap has consequences.",
    category: "FUNDAMENTALS",
    readTime: "7 min read",
    date: "April 8, 2026",
    author: "RunPayway Research",
  },
  {
    slug: "hidden-risk-in-commission-income",
    title: "The Hidden Structural Risk in Commission-Based Income",
    excerpt: "Commission earners often appear successful on paper while operating one of the most fragile income structures in the modern economy.",
    category: "ANALYSIS",
    readTime: "8 min read",
    date: "April 3, 2026",
    author: "RunPayway Research",
  },
  {
    slug: "recurring-revenue-for-service-businesses",
    title: "Why Recurring Revenue Changes Everything for Service Businesses",
    excerpt: "The single most impactful structural change a service business can make is converting project-based work to recurring arrangements.",
    category: "STRATEGY",
    readTime: "7 min read",
    date: "April 1, 2026",
    author: "RunPayway Research",
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
/* ARTICLE 1: POST-TAX-SEASON INCOME REVIEW                         */
/* ================================================================ */

function Article1() {
  return (
    <>
      <P>
        Your tax return just landed. Maybe you're happy with the number. Maybe not. But here's what most owners miss: a good tax return doesn't mean your income is stable.
      </P>
      <P>
        You can make $200k a year and still be fragile. You can have months that look great on paper but leave you stressed, unable to plan, and one client loss away from scrambling.
      </P>
      <P>
        This post walks through the 5 gaps that kill income stability—and more importantly, the psychology that keeps you trapped in them. By the end, you'll recognize yourself, and you'll know exactly what to do about it.
      </P>

      <H2>Gap #1: Client Concentration Risk</H2>
      <P>
        You've got a big client. They're 40% of your revenue. You know it's risky. You tell yourself you'll diversify. Next quarter, maybe. Next year, definitely.
      </P>
      <P>
        But you don't.
      </P>
      <P>
        Instead, you pour energy into keeping that client happy. You answer their emails first. You prioritize their projects. You give them the best rates, the fastest turnaround, everything.
      </P>
      <P>
        Meanwhile, new business sits in your pipeline. You don't have bandwidth for it because you're protecting the one big relationship.
      </P>
      <P>
        Here's what's actually happening: You're experiencing <em>concentration comfort</em>. That one big client feels stable because the revenue is predictable and large. You know what's coming from them. It's real. It's now.
      </P>
      <P>
        A new client? That's uncertain. They might not pay. They might be demanding. They might disappear. So you stick with the known thing, even though it's actually more fragile.
      </P>

      <H2>Gap #2: Forward Visibility</H2>
      <P>
        You're good at what you do. Clients come to you. When they need something, they call or email, and you deliver.
      </P>
      <P>
        So you don't push for commitments in advance. You don't ask them to lock in quarterly work. You don't build retainer relationships.
      </P>
      <P>
        Why? Because it feels pushy. It feels like you're asking too much. It feels transactional.
      </P>
      <P>
        So you stay reactive. You wait for them to call. You deliver. You move on to the next project. It works. Revenue is there. But you're constantly nervous about next month.
      </P>
      <P>
        This is <em>fear of rejection</em> mixed with <em>scarcity mindset</em>. Deep down, you believe that if you ask clients for a commitment, they'll say no. Or worse, they'll leave. So you don't ask. You take what they give. You're grateful for the work.
      </P>
      <P>
        But here's the truth: Most clients *want* predictability. They want a trusted partner they can count on. Asking for a commitment often *increases* the relationship, not diminishes it.
      </P>

      <H2>Gap #3: Pricing Power</H2>
      <P>
        A prospect asks what you charge. You give a number. They say "that's a bit high."
      </P>
      <P>
        You feel the pressure. You're nervous they'll say no. So you offer a discount. "How about this price instead?"
      </P>
      <P>
        They say yes. Deal done.
      </P>
      <P>
        The next prospect asks. You do the same thing. By the end of the year, your "standard" rate is actually 20% lower than it should be because you've discounted so much.
      </P>
      <P>
        You know your prices are inconsistent. You know you're leaving money on the table. But the alternative—someone saying no—feels worse than the money loss.
      </P>
      <P>
        This is pure <em>loss aversion</em> combined with <em>fear of conflict</em>. Your brain registers "they might say no" as a loss (rejection). The actual cost of discounting is abstract and spread out over time, so it doesn't trigger the same fear response.
      </P>

      <H2>Gap #4: Time-to-Income Ratio</H2>
      <P>
        You're the expert. You do the best work. When clients hire you, they're hiring <em>you</em>.
      </P>
      <P>
        So you do everything. You handle the client relationship, the strategy, the execution, the quality control. You work 50+ hours a week.
      </P>
      <P>
        Other people could do parts of this work, but it wouldn't be as good. So you do it.
      </P>
      <P>
        You tell yourself you'll delegate someday. When things slow down. When you find the right person. Next year, maybe.
      </P>
      <P>
        But you never do. You're the bottleneck, and you've made peace with it.
      </P>
      <P>
        This is <em>identity fusion</em>. Your sense of self is wrapped up in being the expert, the person who does the best work. If you delegate, you're giving up control. If you automate, you're admitting the work isn't that special. If you raise prices, you're... well, you're saying no to some people.
      </P>
      <P>
        All of that feels like losing something essential about yourself.
      </P>

      <H2>Gap #5: Revenue Consistency</H2>
      <P>
        You notice a pattern. Summer is slow. Q4 is crazy. It's been like this for years.
      </P>
      <P>
        You know what's coming. But you don't plan for it.
      </P>
      <P>
        When summer hits, revenue dips. Suddenly you're worried. You discount hard to bring in quick work. You reduce quality or cut corners to deliver faster. You stress-spend on things you don't need.
      </P>
      <P>
        Then Q4 hits. Revenue explodes. You're making great money, so you feel rich. You spend freely. You relax.
      </P>
      <P>
        Then the cycle repeats.
      </P>
      <P>
        This is <em>present bias</em> mixed with <em>scarcity panic</em>. When times are good, your brain believes they'll stay good. You don't plan for the dip because you can't really imagine it when you're in the good months. When the dip hits, you panic. Scarcity mindset kicks in. You make desperate decisions you wouldn't make if you had time to think.
      </P>

      <H2>The Pattern</H2>
      <P>
        All 5 gaps point to the same root issue: **Your business structure is fragile because your psychology is keeping you trapped in it.**
      </P>
      <P>
        You know what to do. You know you should diversify clients. You know you should ask for commitments. You know you should raise prices. You know you should delegate. You know you should plan for seasonal swings.
      </P>
      <P>
        You're not stuck because you don't know how. You're stuck because the unknown (new clients, asking for commitments, saying no to discounts, delegating, planning for the future) feels scarier than the pain you're already in.
      </P>

      <H2>Your Next 30 Days</H2>
      <P>
        Pick the gap that scares you the most. That's the one costing you the most money.
      </P>
      <BulletList items={[
        "Client Concentration: List top 5 clients; identify replacement targets (this week)",
        "Forward Visibility: Audit pipeline; lock in 1 client for quarterly commitment (2 weeks)",
        "Pricing Power: Define your three rates; test one price increase (2 weeks)",
        "Time-to-Income: Identify 3 time-wasting tasks; automate or delegate one (1 week)",
        "Revenue Consistency: Map seasonal patterns; design one counter-seasonal offer (3 weeks)",
      ]} />
      <P>
        The gap that scares you most? That's the one with the biggest payoff. Start there.
      </P>
    </>
  );
}


/* ================================================================ */
/* ARTICLE 2: THE INCOME STABILITY GAP                              */
/* ================================================================ */

function Article2() {
  return (
    <>
      <P>
        Three professionals look at your money. Your accountant tracks what you earned last year. Your financial advisor manages what you've accumulated. Your bank verifies how much comes in each month.
      </P>
      <P>
        Between the three of them, they cover income history, asset growth, and cash flow.
      </P>
      <P>
        None of them measure the one thing that determines whether your income survives next quarter.
      </P>

      <H2>The Gap Nobody Talks About</H2>
      <P>
        Consider a management consultant earning $180,000 a year. On paper, everything looks strong. The accountant files clean returns. The advisor allocates a healthy portfolio. The bank approves the mortgage. Every system says "this person is doing well."
      </P>
      <P>
        But here's what none of them see: 70% of that $180,000 comes from a single client on a handshake agreement. Nothing is contracted beyond the current quarter. There's no recurring revenue, no retainer, no written commitment past 90 days. If that client changes direction, $126,000 vanishes—and there's nothing in the pipeline to replace it.
      </P>
      <P>
        The consultant's income isn't $180,000. It's $180,000 <em>if nothing changes</em>. That distinction is invisible to every tool in the current financial system.
      </P>

      <H2>What Your Accountant Misses</H2>
      <P>
        Accountants are essential. They organize financial records, ensure tax compliance, and identify deductions. But their lens is backward-looking by design. They work with what has already occurred.
      </P>
      <P>
        A tax return shows $180,000 in revenue. It does not show that $126,000 came from one source with no contract. It does not show that income arrived in three large deposits with nothing in the months between. It does not show that the entire earning structure depends on one relationship continuing exactly as it has.
      </P>

      <H2>What Your Financial Advisor Misses</H2>
      <P>
        Financial advisors focus on what you've built: retirement accounts, investment portfolios, insurance coverage, estate plans. Their expertise is in managing accumulated wealth and protecting it over time.
      </P>
      <P>
        But the income funding those accounts? That's treated as a given. The standard planning conversation assumes income continues at roughly the same level. The advisor models what happens to your portfolio over 20 years—but rarely asks what happens if the income feeding it drops 40% in the next six months.
      </P>

      <H2>What Your Bank Misses</H2>
      <P>
        Banks verify income for one purpose: to determine whether you can service a debt. Mortgage underwriting looks at two years of tax returns, recent pay stubs, and bank statements. The question is simple: does enough money come in to cover the payment?
      </P>
      <P>
        What they don't evaluate is how that income is constructed. A salaried employee earning $180,000 from a Fortune 500 company and a freelance consultant earning $180,000 from a single client look identical on a loan application. Both show the same annual income. Both can demonstrate consistent deposits.
      </P>
      <P>
        But the risk profiles are completely different. The employee has contractual protections, severance provisions, and unemployment insurance. The consultant has none of those. The bank's system can't distinguish between the two because it was never designed to.
      </P>

      <H2>The Layer Between Earning and Keeping</H2>
      <P>
        This is the income stability gap. Not a gap in how much you earn—a gap in understanding <em>how</em> you earn it. Specifically:
      </P>
      <BulletList items={[
        "How many sources does your income depend on?",
        "How much of it is contractually committed beyond this month?",
        "What percentage is recurring versus one-time?",
        "What happens to your total income if your largest source disappears?",
        "How far ahead can you see with reasonable certainty?",
      ]} />
      <P>
        These aren't abstract questions. They determine whether a bad quarter is an inconvenience or a crisis. And until now, no system existed to answer them with a consistent, measurable score.
      </P>

      <H2>Why This Gap Exists</H2>
      <P>
        The financial system evolved around three pillars: credit risk, asset management, and income verification. Each serves a critical function. But each was built for a world where most income was salaried, predictable, and employer-backed.
      </P>
      <P>
        That world is shrinking. Today, over 36% of the U.S. workforce earns through freelance, contract, gig, or commission-based arrangements. For these earners, income is not a fixed input—it's a variable output that depends on client retention, deal flow, market conditions, and personal capacity.
      </P>
      <P>
        The tools that evaluate financial health were not built for this reality. The result is a growing population of earners whose financial picture looks complete on the surface—but has a critical measurement missing underneath.
      </P>

      <H2>Closing the Gap</H2>
      <P>
        RunPayway™ was built to fill this gap. The Income Stability Score™ measures the six key dimensions of how income is constructed—not the amount. It evaluates source diversity, income persistence, forward visibility, concentration risk, labor dependence, and earnings consistency.
      </P>
      <P>
        The result is a score from 0 to 100 that tells you what no accountant, advisor, or bank currently can: how much of your income is protected, how much is at risk, and what specific actions would strengthen it.
      </P>
      <P>
        It doesn't replace any of these professionals. It gives them—and you—the measurement that's been missing. The one that sits between earning money and being able to count on it.
      </P>
    </>
  );
}


/* ================================================================ */
/* ARTICLE 3: WHAT IS INCOME STABILITY                              */
/* ================================================================ */

function Article3() {
  return (
    <>
      <P>
        Your bank knows how much money you make. Your accountant knows how much you earned last year. Your credit card company knows how you spend it.
      </P>
      <P>
        Nobody knows whether you'll still be making it next quarter.
      </P>

      <H2>The Question Nobody Asks</H2>
      <P>
        Imagine two people. Both make $150,000 a year. On paper, they're identical—same income, same tax return, same borrowing power.
      </P>
      <P>
        Person A gets paid every month by their employer. The contract is solid. They've been there 5 years. If they lose the job, they get unemployment and severance.
      </P>
      <P>
        Person B is a consultant. One client pays them $150,000 a year. No contract. They've been working together for 2 years, but nothing's written down. The client could leave tomorrow.
      </P>
      <P>
        Every financial system in existence treats them the same way. Same income = same risk. But you know they're not the same. The question is: why doesn't anyone measure the difference?
      </P>

      <H2>Why Your Credit Score Doesn't Help</H2>
      <P>
        Credit scores are brilliant for one thing: predicting whether you'll pay back debt. They look at your history of borrowing and paying. Perfect tool for that job.
      </P>
      <P>
        But your credit score doesn't care how stable your income is. You could have an 800 credit score and work for a failing company. You could have perfect credit and be one client away from financial crisis.
      </P>
      <P>
        That's not because credit scores are bad—they do exactly what they were designed to do. It's because they measure borrowing behavior, not income structure. Two different things.
      </P>

      <H2>The Six Things That Actually Matter</H2>
      <P>
        Income stability isn't about how much you make. It's about how your income is built. Six dimensions matter:
      </P>
      <BulletList items={[
        "Diversification: Do you have 3 clients or 30? Is your income spread out or concentrated?",
        "Revenue type: Is it recurring (monthly retainer) or one-off (project-based, commission)?",
        "Contracts: How much of your income is backed by a written agreement?",
        "Client concentration: What percentage comes from your single biggest client?",
        "Income continuity: Does your income stop if you take time off or get sick?",
        "Forward visibility: How far ahead do you know your revenue—90 days? 30 days? Nothing?",
      ]} />
      <P>
        Each of these tells you something different about whether your income structure can survive disruption. Together, they show you what's really stable and what's fragile.
      </P>

      <H2>Why This Matters</H2>
      <P>
        Here's the truth: Salaried employees get stability by default. They didn't have to build it. The employer did. Recurring payroll, written contracts, benefits—all built in.
      </P>
      <P>
        Freelancers, consultants, business owners, and commission earners build their own income structure—usually by accident, and almost never deliberately. You drift into concentrating revenue in one client. You accept project-based work because that's what's available. You never formalize relationships with contracts.
      </P>
      <P>
        Then one client leaves, or one project ends, or the market shifts. And suddenly your stable-looking income isn't stable at all.
      </P>

      <H2>The Power of Seeing It Clearly</H2>
      <P>
        Once you can <em>see</em> how your income is structured, you can change it. A score that shows "80% of your revenue comes from one client" isn't an opinion or a prediction. It's a measurement. And measurements create clarity.
      </P>
      <P>
        Clear problem = clear solution. Too concentrated? Diversify. No recurring revenue? Build a retainer. Income stops when you stop working? Design a component that doesn't.
      </P>
      <P>
        These aren't theoretical improvements. They're structural changes that make your income harder to break.
      </P>
    </>
  );
}


/* ================================================================ */
/* ARTICLE 4: HIDDEN RISK IN COMMISSION INCOME                      */
/* ================================================================ */

function Article4() {
  return (
    <>
      <P>
        Commission-based income looks great on paper. Top real estate agents, insurance producers, and enterprise sales professionals routinely generate six-figure annual income. By conventional metrics—gross income, year-over-year growth, even net worth accumulation—they appear financially strong.
      </P>
      <P>
        But income amount is not income structure. And when you evaluate commission income structurally, a different picture emerges—one defined by concentration, fragility, and dependence on conditions that the earner does not control.
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
        Forward visibility—the degree to which future income is committed or contracted—is one of the most heavily weighted dimensions in income stability measurement. Commission structures typically score near zero on this dimension.
      </P>

      <H3>Full Labor Dependence</H3>
      <P>
        Commission income stops when active selling stops. Illness, travel, family obligations, or simply a slow month produces an immediate income gap with no contractual cushion. There is no passive component, no residual stream, no mechanism that generates revenue absent the earner's direct effort.
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
        "90% commission-based, 10% from property management arrangements",
        "45% of annual income comes from referrals through a single mortgage broker relationship",
        "Zero binding contracts; every transaction is a new, independent engagement",
        "No committed income beyond listings currently under contract (30–60 days)",
        "Income drops to near zero within 60 days of ceasing active work",
        "Effectively two income sources—commission sales and management fee",
      ]} />
      <P>
        Evaluated structurally, this income profile produces a score of approximately 28 out of 100. The gap between the perceived strength ($180,000 annual income) and the structural reality (a score of 28) is not a rounding error. It represents genuine financial fragility that existing instruments fail to surface.
      </P>

      <H2>Why This Matters Beyond the Individual</H2>
      <P>
        Lenders who evaluate commission earners based on two years of tax returns are measuring historical output, not structural durability. A mortgage underwriter approving a $600,000 loan based on $180,000 in commission income is making a bet on structural conditions they have not evaluated.
      </P>
      <P>
        Financial advisors managing wealth for commission-based clients face a similar blind spot. Asset allocation strategies built on assumed income continuity are structurally unsound when the income itself has no continuity mechanism.
      </P>

      <H2>What Commission Earners Can Do</H2>
      <P>
        The structural weaknesses of commission income are not permanent. They are architectural, which means they can be redesigned. The highest-impact changes:
      </P>
      <BulletList items={[
        "Introduce a recurring revenue component—even a small retainer or management fee fundamentally changes the income profile",
        "Diversify referral sources to reduce dependency on any single relationship for more than 20% of revenue",
        "Convert repeat client relationships into formal, contracted arrangements where possible",
        "Build pipeline mechanisms that extend forward visibility beyond the current transaction cycle",
      ]} />
      <P>
        None of these changes require earning less. They require restructuring how existing economic activity is organized—converting transactional relationships into structural ones.
      </P>
    </>
  );
}


/* ================================================================ */
/* ARTICLE 5: RECURRING REVENUE FOR SERVICE BUSINESSES               */
/* ================================================================ */

function Article5() {
  return (
    <>
      <P>
        Service businesses—consulting firms, agencies, professional practices, freelance operations—share a common structural default: project-based revenue. A client engages for a defined scope, the work is delivered, payment is collected, and the cycle resets. Each new period requires new sales to replace the revenue that expired with the last deliverable.
      </P>
      <P>
        This model is functional. Millions of service businesses operate profitably on project-based revenue. But profitability and structural resilience are different measurements. And on the dimension that matters most for long-term income stability—how income behaves under change—project-based revenue has significant weaknesses.
      </P>

      <H2>The Structural Problem with Project Revenue</H2>
      <P>
        Project-based income suffers from three structural limitations that compound over time.
      </P>
      <P>
        <strong>Forward visibility resets with each project completion.</strong> A consulting firm that delivers a $50,000 strategy engagement has zero committed revenue the day after delivery unless new work has already been contracted. The financial position on December 1st may look nothing like the position on January 15th, based solely on pipeline timing.
      </P>
      <P>
        <strong>Revenue continuity is zero.</strong> Income stops when projects stop. There is no residual component, no passive stream, no mechanism that generates revenue between active engagements. This creates a perpetual sales obligation that competes with delivery capacity.
      </P>
      <P>
        <strong>Client relationships are episodic rather than structural.</strong> A client who engages for a single project may or may not return. There is no contractual obligation to continue, no switching cost, and no institutional dependency that creates retention by default.
      </P>

      <H2>What Recurring Revenue Changes</H2>
      <P>
        Recurring revenue—income that arrives on a contracted, repeating basis—addresses each of these structural weaknesses directly.
      </P>
      <P>
        <strong>Forward visibility extends</strong> to the duration of the agreement. A 12-month retainer contracted in January provides visibility through December. A monthly subscription with a 90-day notice period provides at least three months of committed revenue at any point.
      </P>
      <P>
        <strong>Revenue continuity becomes inherent</strong> rather than dependent on active selling. A service business with $30,000 in monthly retainer revenue generates $360,000 annually before any new project is sold. That base exists regardless of pipeline conditions, market shifts, or seasonal slowdowns.
      </P>
      <P>
        <strong>Client relationships shift from episodic to structural.</strong> Recurring arrangements create institutional dependency—the client's operations integrate with the service provider, creating natural retention through switching costs and relationship depth.
      </P>

      <H2>Practical Conversion Strategies</H2>
      <P>
        Converting project-based revenue to recurring revenue is not theoretical. It requires specific structural changes to how services are packaged, priced, and delivered.
      </P>

      <H3>Retainer Conversion</H3>
      <P>
        The most direct path. Identify clients who engage repeatedly for similar work and propose a monthly retainer that covers a defined scope of ongoing service. A marketing consultant who produces quarterly strategy decks for three clients can convert those project engagements into monthly retainers with a broader but more consistent scope. The client gets predictable access; the provider gets predictable revenue.
      </P>

      <H3>Subscription Models</H3>
      <P>
        For service businesses that can productize elements of their offering, subscription models create recurring revenue at scale. An accounting firm that offers quarterly advisory calls, monthly financial reviews, and annual tax preparation as a bundled monthly subscription fundamentally changes its revenue structure compared to billing each service as a discrete project.
      </P>

      <H3>Maintenance and Support Agreements</H3>
      <P>
        Service businesses that deliver implementation projects have a natural recurring revenue opportunity in ongoing maintenance. A web development agency that builds a platform can offer a monthly maintenance agreement covering hosting management, security updates, performance monitoring, and a defined number of modification hours. This converts a one-time project into a long-term revenue stream.
      </P>

      <H2>The Compounding Effect</H2>
      <P>
        The structural impact of recurring revenue compounds. Each new retainer or subscription adds to a base that persists independently. A service business that converts three clients to monthly retainers per quarter accumulates a recurring base that grows by twelve clients per year. After two years, the business has a structural foundation of 24 recurring relationships generating predictable monthly revenue.
      </P>
      <P>
        This compounding effect is visible in structural scoring. A service business that begins with a score driven primarily by project revenue will see measurable improvement with each recurring arrangement added—not because income increases, but because the architecture of that income changes.
      </P>

      <PullQuote>
        The question is not whether recurring revenue is better than project revenue. Structurally, this is settled. The question is how quickly a service business can shift its income architecture toward a recurring base.
      </PullQuote>
    </>
  );
}


/* ================================================================ */
/* CONTENT ROUTER                                                    */
/* ================================================================ */

function getArticleContent(slug: string): React.ReactNode | null {
  switch (slug) {
    case "post-tax-season-income-review": return <Article1 />;
    case "the-income-stability-gap": return <Article2 />;
    case "what-is-income-stability": return <Article3 />;
    case "hidden-risk-in-commission-income": return <Article4 />;
    case "recurring-revenue-for-service-businesses": return <Article5 />;
    default: return null;
  }
}


/* ================================================================ */
/* ARTICLE HEADER                                                    */
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
          RunPayway™ scores how much of your income is protected, how much is at risk, and what to do about it. Under 2 minutes. Consistent results. Private by&nbsp;default.
        </p>
        <div style={{ ...fadeIn(visible, 150), display: "flex", flexDirection: "column" as const, alignItems: "center", gap: 16 }}>
          <div style={{ display: "flex", flexDirection: m ? "column" : "row", alignItems: "center", gap: m ? 12 : 14, justifyContent: "center", width: "100%" }}>
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
              Get My Stability Class — Free
            </Link>
            <a href="https://buy.stripe.com/9B66oz48EaYU2lc4IF2Nq05" style={{
              display: "inline-flex", alignItems: "center", justifyContent: "center",
              height: m ? 52 : 56, width: m ? "100%" : "auto",
              padding: m ? "0 24px" : "0 32px",
              borderRadius: 14, backgroundColor: C.navy, color: C.white,
              fontSize: 16, fontWeight: 600, textDecoration: "none",
              boxShadow: "0 8px 24px rgba(14,26,43,0.12)",
              border: `1px solid ${C.navy}`,
              transition: "transform 200ms, box-shadow 200ms",
            }}
              onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = "0 12px 32px rgba(14,26,43,0.18)"; }}
              onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "0 8px 24px rgba(14,26,43,0.12)"; }}>
              Get Your Full Report — $69
            </a>
          </div>
          <Link href="/learn" style={{ display: "inline-block", fontSize: 14, fontWeight: 600, color: "rgba(244,241,234,0.50)", textDecoration: "none" }}>
            Explore the Learn Center →
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
