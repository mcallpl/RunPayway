'use client';

import React, { useState } from 'react';

export default function LandingPage() {
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);

  const toggleFaq = (index: number) => {
    setOpenFaqIndex(openFaqIndex === index ? null : index);
  };

  return (
    <div className="w-full bg-white">
      {/* HEADER */}
      <header className="sticky top-0 z-50 bg-white border-b border-rp-border">
        <div className="max-w-[1440px] mx-auto px-8 h-[72px] flex items-center justify-between">
          {/* Logo */}
          <a href="/RunPayway" className="flex items-center flex-shrink-0 mr-20">
            <img src="/RunPayway/logo.png" alt="RunPayway™" className="h-14 w-auto" />
          </a>

          {/* Center Navigation */}
          <nav className="flex gap-7 items-center flex-1 text-sm font-medium text-rp-textNavy">
            <a href="#how-it-works" className="hover:text-rp-navy2 transition-colors">How It Works</a>
            <a href="#methodology" className="hover:text-rp-navy2 transition-colors">Methodology</a>
            <a href="#use-cases" className="hover:text-rp-navy2 transition-colors">Use Cases</a>
            <a href="#reports" className="hover:text-rp-navy2 transition-colors">Reports</a>
            <a href="#professionals" className="hover:text-rp-navy2 transition-colors">For Professionals</a>
            <a href="#learn" className="hover:text-rp-navy2 transition-colors">Learn</a>
            <a href="#about" className="hover:text-rp-navy2 transition-colors">About</a>
          </nav>

          {/* Right Actions */}
          <div className="flex gap-4 items-center ml-auto">
            <a href="#sign-in" className="text-sm font-medium text-rp-textNavy hover:text-rp-navy2 transition-colors">
              Sign In
            </a>
            <button className="bg-rp-navy text-white px-6 py-2.5 rounded-md text-sm font-medium hover:bg-rp-navy2 transition-colors flex items-center gap-2">
              Start Evaluation
              <span>→</span>
            </button>
          </div>
        </div>
      </header>

      {/* HERO SECTION */}
      <section className="max-w-[1440px] mx-auto px-8 py-24">
        <div className="grid grid-cols-2 gap-20">
          {/* Left Column */}
          <div className="flex flex-col justify-center">
            <p className="text-xs font-medium tracking-wider text-rp-navy uppercase mb-6">
              For Independent Income Structures.
            </p>

            <h1 className="font-serif text-5xl leading-tight text-rp-navy mb-6">
              The Standard for Measuring Income Stability.
            </h1>

            <p className="text-base text-rp-textNavy leading-relaxed mb-8 max-w-md">
              RunPayway™ evaluates how resilient income remains under real-world conditions before financial, business, and career decisions are made.
            </p>

            <div className="border-b border-rp-border mb-8 pb-8"></div>

            <p className="text-sm font-medium tracking-wider text-rp-navy uppercase mb-8">
              Income Does Not Equal Stability.
            </p>

            <div className="flex gap-4">
              <button className="bg-rp-navy text-white px-6 py-3 rounded-md text-sm font-medium hover:bg-rp-navy2 transition-colors">
                Start Free Evaluation
              </button>
              <button className="bg-transparent text-rp-navy border border-rp-navy px-6 py-3 rounded-md text-sm font-medium hover:bg-rp-page transition-colors flex items-center gap-2">
                How it works
                <span>→</span>
              </button>
            </div>

            <p className="text-xs text-rp-softGray mt-6">
              Free evaluation includes Stability Classification™ and primary exposure indicator.
            </p>
          </div>

          {/* Right Column - Score Framework Card */}
          <div className="bg-white border border-rp-border rounded-lg p-8">
            <p className="text-xs font-medium tracking-wider text-rp-navy uppercase mb-8">
              Income Stability Score™
            </p>

            <div className="text-7xl font-bold text-rp-navy mb-2">72</div>
            <p className="text-sm font-medium text-rp-textNavy mb-8">ESTABLISHED STABILITY</p>

            <p className="text-xs text-rp-textNavy mb-8 leading-relaxed">
              Recurring income characteristics with moderate diversification, continuity, and forward visibility.
            </p>

            {/* Score Range Visualization */}
            <div className="mb-8">
              <div className="grid grid-cols-4 gap-1 mb-2">
                <div className="h-1 bg-rp-softGray rounded-full"></div>
                <div className="h-1 bg-rp-softGray rounded-full"></div>
                <div className="h-1 bg-rp-navy rounded-full"></div>
                <div className="h-1 bg-rp-softGray rounded-full"></div>
              </div>
              <div className="grid grid-cols-4 gap-4 text-xs font-medium text-rp-textNavy">
                <span>0–39</span>
                <span>40–59</span>
                <span>60–79</span>
                <span>80–100</span>
              </div>
            </div>

            <div className="flex justify-between items-center text-xs font-medium text-rp-softGray mb-8">
              <span>0</span>
              <span>SCORE RANGE 0–100</span>
              <span>100</span>
            </div>

            <div className="border-t border-rp-border pt-8">
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <p className="text-xs font-medium tracking-wider uppercase text-rp-softGray mb-2">Revenue Structure</p>
                  <p className="text-sm font-medium text-rp-navy">Distributed</p>
                </div>
                <div>
                  <p className="text-xs font-medium tracking-wider uppercase text-rp-softGray mb-2">Continuity</p>
                  <p className="text-sm font-medium text-rp-navy">Moderate</p>
                </div>
                <div>
                  <p className="text-xs font-medium tracking-wider uppercase text-rp-softGray mb-2">Labor Independence</p>
                  <p className="text-sm font-medium text-rp-navy">Partial</p>
                </div>
              </div>

              <div className="border-t border-rp-border mt-6 pt-6">
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <p className="text-xs font-medium tracking-wider uppercase text-rp-softGray mb-2">Model</p>
                    <p className="text-sm font-medium text-rp-navy">RP-2.0</p>
                  </div>
                  <div>
                    <p className="text-xs font-medium tracking-wider uppercase text-rp-softGray mb-2">Evaluation</p>
                    <p className="text-sm font-medium text-rp-navy">Version-Stamped</p>
                  </div>
                  <div>
                    <p className="text-xs font-medium tracking-wider uppercase text-rp-softGray mb-2">Integrity</p>
                    <p className="text-sm font-medium text-rp-navy">Same inputs produce same result</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* METHODOLOGY STRIP */}
      <section className="bg-rp-page border-y border-rp-border">
        <div className="max-w-[1440px] mx-auto px-8 py-16">
          <div className="grid grid-cols-3 gap-16">
            <div className="flex gap-4">
              <div className="flex-shrink-0">
                <svg className="w-6 h-6 text-rp-navy" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2zm0 18a8 8 0 1 1 8-8 8 8 0 0 1-8 8z"/>
                  <circle cx="12" cy="12" r="4" fill="currentColor"/>
                </svg>
              </div>
              <div>
                <p className="text-xs font-medium tracking-wider text-rp-navy uppercase mb-2">Deterministic Methodology</p>
                <p className="text-sm text-rp-textNavy">Fixed scoring architecture</p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex-shrink-0">
                <svg className="w-6 h-6 text-rp-navy" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M3 4h18v2H3V4zm0 7h18v2H3v-2zm0 7h18v2H3v-2z"/>
                </svg>
              </div>
              <div>
                <p className="text-xs font-medium tracking-wider text-rp-navy uppercase mb-2">Version-Stamped Results</p>
                <p className="text-sm text-rp-textNavy">Tied to model version</p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex-shrink-0">
                <svg className="w-6 h-6 text-rp-navy" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 1c6.05 0 11 4.95 11 11s-4.95 11-11 11S1 18.05 1 12 5.95 1 12 1m0-1C5.37 0 0 5.37 0 12s5.37 12 12 12 12-5.37 12-12S18.63 0 12 0z"/>
                  <path d="M12 5a2 2 0 1 0 0 4 2 2 0 0 0 0-4zm0 6a2 2 0 0 0-2 2v4a2 2 0 0 0 4 0v-4a2 2 0 0 0-2-2z"/>
                </svg>
              </div>
              <div>
                <p className="text-xs font-medium tracking-wider text-rp-navy uppercase mb-2">Private By Default</p>
                <p className="text-sm text-rp-textNavy">Your data stays yours</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* STRUCTURAL EXPOSURE SECTION */}
      <section className="max-w-[1440px] mx-auto px-8 py-24">
        <p className="text-xs font-medium tracking-wider text-rp-teal uppercase mb-4">STRONG INCOME CAN STILL FAIL STRUCTURALLY.</p>

        <div className="grid grid-cols-3 gap-12 mb-20">
          <div>
            <h2 className="font-serif text-4xl leading-tight text-rp-navy mb-4">
              Structural Exposure Appears Different Under Pressure.
            </h2>
          </div>

          <div>
            <p className="text-sm text-rp-textNavy leading-relaxed mb-4">
              RunPayway™ reveals hidden risks that traditional income metrics do not capture—before they impact your next financial decision.
            </p>
            <p className="text-xs text-rp-softGray">
              Interpretation is framed using industry context. The evaluation itself remains fixed.
            </p>
          </div>

          <div>
            <p className="text-sm text-rp-textNavy leading-relaxed">
              Designed for consultants, founders, operators, independent earners, and professionals with variable income profiles.
            </p>
          </div>
        </div>

        {/* Three Exposure Cards */}
        <div className="grid grid-cols-3 gap-8">
          <div className="border border-rp-border rounded-lg p-8">
            <div className="flex items-center gap-3 mb-6">
              <svg className="w-8 h-8 text-rp-navy" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm3.5-9c.83 0 1.5-.67 1.5-1.5S16.33 8 15.5 8 14 8.67 14 9.5s.67 1.5 1.5 1.5zm-7 0c.83 0 1.5-.67 1.5-1.5S9.33 8 8.5 8 7 8.67 7 9.5 7.67 11 8.5 11zm3.5 6.5c2.33 0 4.31-1.46 5.11-3.5H6.89c.8 2.04 2.78 3.5 5.11 3.5z"/>
              </svg>
              <p className="text-xs font-medium tracking-wider uppercase text-rp-navy">Before a Major Financial Decision</p>
            </div>
            <p className="text-sm text-rp-textNavy mb-6">
              A strong income history does not always indicate structural resilience.
            </p>
            <p className="text-xs font-medium text-rp-textNavy">Hidden risks RunPayway™ identifies:</p>
            <ul className="text-xs text-rp-textNavy mt-3 space-y-2">
              <li>• Concentration exposure</li>
              <li>• Continuity weakness</li>
              <li>• Variability risk</li>
            </ul>
          </div>

          <div className="border border-rp-border rounded-lg p-8">
            <div className="flex items-center gap-3 mb-6">
              <svg className="w-8 h-8 text-rp-navy" fill="currentColor" viewBox="0 0 24 24">
                <path d="M19 5H5c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 12H5V7h14v10zm-5.04-6.71l-2.75 3.54-2.16-2.66c-.23-.29-.62-.29-.85 0-.23.29-.23.77 0 1.06L10.5 15.5c.23.29.62.29.85 0l3.54-4.29c.23-.29.23-.77 0-1.06-.23-.28-.62-.28-.85.01z"/>
              </svg>
              <p className="text-xs font-medium tracking-wider uppercase text-rp-navy">Business & Career Decisions</p>
            </div>
            <p className="text-sm text-rp-textNavy mb-6">
              Income transitions can amplify risks that are not visible in current results.
            </p>
            <p className="text-xs font-medium text-rp-textNavy">Hidden risks RunPayway™ identifies:</p>
            <ul className="text-xs text-rp-textNavy mt-3 space-y-2">
              <li>• Dependence risk</li>
              <li>• Forward visibility instability</li>
              <li>• Revenue interruption exposure</li>
            </ul>
          </div>

          <div className="border border-rp-border rounded-lg p-8">
            <div className="flex items-center gap-3 mb-6">
              <svg className="w-8 h-8 text-rp-navy" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm0 10.99h7c-.53 4.12-3.28 7.72-7 8.77V12H5V6.3l7-3.11v8.8z"/>
              </svg>
              <p className="text-xs font-medium tracking-wider uppercase text-rp-navy">Household Financial Pressure</p>
            </div>
            <p className="text-sm text-rp-textNavy mb-6">
              Unexpected disruption may expose gaps in income structure.
            </p>
            <p className="text-xs font-medium text-rp-textNavy">Hidden risks RunPayway™ identifies:</p>
            <ul className="text-xs text-rp-textNavy mt-3 space-y-2">
              <li>• Insufficient diversification</li>
              <li>• Continuity gaps</li>
              <li>• Unstable revenue dependency</li>
            </ul>
          </div>
        </div>

        <div className="text-center mt-8 text-xs text-rp-softGray">
          <p>Income alone does not determine stability. RunPayway™ analyzes the structure behind your income to reveal how it may perform in the future.</p>
        </div>
      </section>

      {/* SAME INCOME DIFFERENT STABILITY */}
      <section className="bg-rp-page border-y border-rp-border">
        <div className="max-w-[1440px] mx-auto px-8 py-24">
          <p className="text-xs font-medium tracking-wider text-rp-teal uppercase mb-4 text-center">INCOME STRUCTURES. DIFFERENT OUTCOMES.</p>
          <h2 className="font-serif text-4xl leading-tight text-rp-navy mb-16 text-center">
            Same Income. Different Stability.
          </h2>

          <p className="text-sm text-rp-textNavy text-center mb-16 max-w-lg mx-auto">
            Two individuals with the same annual income can have very different stability outcomes.
          </p>

          <div className="grid grid-cols-2 gap-16">
            {/* Profile A */}
            <div>
              <p className="text-xs font-medium tracking-wider text-rp-navy uppercase mb-8">Profile A</p>
              <p className="text-sm text-rp-softGray mb-2">Annual Income</p>
              <p className="text-3xl font-bold text-rp-navy mb-8">$125,000</p>

              <p className="text-xs font-medium tracking-wider text-rp-navy uppercase mb-2">Income Stability Score™</p>
              <p className="text-6xl font-bold text-rp-navy mb-2">31</p>
              <p className="text-sm font-medium text-rp-textNavy mb-8">LIMITED STABILITY</p>

              <div className="grid grid-cols-4 gap-1 mb-2">
                <div className="h-1 bg-rp-teal rounded-full"></div>
                <div className="h-1 bg-rp-softGray rounded-full"></div>
                <div className="h-1 bg-rp-softGray rounded-full"></div>
                <div className="h-1 bg-rp-softGray rounded-full"></div>
              </div>
              <div className="grid grid-cols-4 gap-4 text-xs font-medium text-rp-textNavy mb-8">
                <span>0–39</span>
                <span>40–59</span>
                <span>60–79</span>
                <span>80–100</span>
              </div>

              <div className="flex justify-between items-center text-xs font-medium text-rp-softGray mb-8">
                <span>0</span>
                <span>SCORE RANGE 0–100</span>
                <span>100</span>
              </div>

              <div className="space-y-2 text-xs">
                <div className="flex items-center gap-2">
                  <span className="text-rp-red">●</span>
                  <span className="text-rp-textNavy">Revenue concentrated in one source increases disruption risk.</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-rp-red">●</span>
                  <span className="text-rp-textNavy">Elevated exposure to income interruption.</span>
                </div>
              </div>
            </div>

            {/* Profile B */}
            <div>
              <p className="text-xs font-medium tracking-wider text-rp-navy uppercase mb-8">Profile B</p>
              <p className="text-sm text-rp-softGray mb-2">Annual Income</p>
              <p className="text-3xl font-bold text-rp-navy mb-8">$125,000</p>

              <p className="text-xs font-medium tracking-wider text-rp-navy uppercase mb-2">Income Stability Score™</p>
              <p className="text-6xl font-bold text-rp-navy mb-2">74</p>
              <p className="text-sm font-medium text-rp-textNavy mb-8">ESTABLISHED STABILITY</p>

              <div className="grid grid-cols-4 gap-1 mb-2">
                <div className="h-1 bg-rp-softGray rounded-full"></div>
                <div className="h-1 bg-rp-softGray rounded-full"></div>
                <div className="h-1 bg-rp-teal rounded-full"></div>
                <div className="h-1 bg-rp-softGray rounded-full"></div>
              </div>
              <div className="grid grid-cols-4 gap-4 text-xs font-medium text-rp-textNavy mb-8">
                <span>0–39</span>
                <span>40–59</span>
                <span>60–79</span>
                <span>80–100</span>
              </div>

              <div className="flex justify-between items-center text-xs font-medium text-rp-softGray mb-8">
                <span>0</span>
                <span>SCORE RANGE 0–100</span>
                <span>100</span>
              </div>

              <div className="space-y-2 text-xs">
                <div className="flex items-center gap-2">
                  <span className="text-rp-teal">●</span>
                  <span className="text-rp-textNavy">Revenue is distributed across multiple sources.</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-rp-teal">●</span>
                  <span className="text-rp-textNavy">Greater continuity and flexibility under stress.</span>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-16 bg-white border border-rp-border rounded-lg p-6 flex items-start gap-4">
            <svg className="w-5 h-5 text-rp-navy flex-shrink-0 mt-1" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/>
            </svg>
            <p className="text-xs text-rp-textNavy">
              <span className="font-medium">Stability is shaped by continuity, diversification, predictability, and resilience—not income amount alone.</span> RunPayway™ measures what matters most: how your income structure performs under pressure.
            </p>
          </div>
        </div>
      </section>

      {/* PRICING SECTION */}
      <section className="max-w-[1440px] mx-auto px-8 py-24">
        <div className="mb-16">
          <p className="text-xs font-medium tracking-wider text-rp-navy uppercase mb-2 text-center">ACCESS THE FULL FRAMEWORK.</p>
          <h2 className="font-serif text-3xl text-rp-navy mb-8 text-center">RunPayway™ Evaluation</h2>
          <p className="text-sm text-rp-textNavy text-center">Choose the evaluation that fits your need.</p>
        </div>

        <div className="grid grid-cols-3 gap-8">
          {/* Left Info Column */}
          <div className="flex flex-col justify-center">
            <h3 className="text-sm font-medium text-rp-navy mb-4">Stability Classification™ only</h3>
            <p className="text-xs text-rp-softGray mb-6">
              Get a quick stability indicator to understand your income structure classification.
            </p>
            <p className="text-xs text-rp-softGray mb-6">
              Full Income Stability Score™ and evaluation report available for $69.
            </p>
            <button className="bg-white border border-rp-border text-rp-navy px-6 py-3 rounded-md text-sm font-medium hover:bg-rp-page transition-colors w-fit">
              Get Basic Insight
            </button>
            <p className="text-xs text-rp-softGray mt-4">One-time. Years to keep.</p>
          </div>

          {/* Basic Insight Card */}
          <div className="border border-rp-border rounded-lg p-8 bg-white">
            <p className="text-xs font-medium tracking-wider text-rp-navy uppercase mb-4">Basic Insight</p>
            <p className="text-4xl font-bold text-rp-navy mb-1">$0</p>
            <p className="text-xs text-rp-softGray mb-8">One-time. Never expires.</p>

            <ul className="space-y-4 mb-8">
              <li className="flex items-center gap-3 text-sm text-rp-textNavy">
                <span className="text-rp-teal text-lg">✓</span>
                <span>Stability Classification™</span>
              </li>
              <li className="flex items-center gap-3 text-sm text-rp-textNavy">
                <span className="text-rp-teal text-lg">✓</span>
                <span>Primary Exposure Indicator</span>
              </li>
            </ul>

            <button className="w-full bg-white border border-rp-border text-rp-navy px-6 py-3 rounded-md text-sm font-medium hover:bg-rp-page transition-colors">
              Get Basic Insight
            </button>
          </div>

          {/* Full Evaluation Card */}
          <div className="border border-rp-navy rounded-lg p-8 bg-white relative">
            <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-rp-navy text-white px-3 py-1 text-xs font-medium rounded">
              MOST COMPREHENSIVE
            </div>

            <p className="text-xs font-medium tracking-wider text-rp-navy uppercase mb-4 mt-4">Full Evaluation</p>
            <p className="text-4xl font-bold text-rp-navy mb-1">$69</p>
            <p className="text-xs text-rp-softGray mb-8">One-time. Years to keep.</p>

            <ul className="space-y-4 mb-8">
              <li className="flex items-center gap-3 text-sm text-rp-textNavy">
                <span className="text-rp-teal text-lg">✓</span>
                <span>Income Stability Score™</span>
              </li>
              <li className="flex items-center gap-3 text-sm text-rp-textNavy">
                <span className="text-rp-teal text-lg">✓</span>
                <span>Six-Dimension Evaluation</span>
              </li>
              <li className="flex items-center gap-3 text-sm text-rp-textNavy">
                <span className="text-rp-teal text-lg">✓</span>
                <span>Exposure Analysis</span>
              </li>
              <li className="flex items-center gap-3 text-sm text-rp-textNavy">
                <span className="text-rp-teal text-lg">✓</span>
                <span>Stability Roadmap</span>
              </li>
              <li className="flex items-center gap-3 text-sm text-rp-textNavy">
                <span className="text-rp-teal text-lg">✓</span>
                <span>Professional Documentation</span>
              </li>
              <li className="flex items-center gap-3 text-sm text-rp-textNavy">
                <span className="text-rp-teal text-lg">✓</span>
                <span>Scenario Evaluation</span>
              </li>
            </ul>

            <button className="w-full bg-rp-navy text-white px-6 py-3 rounded-md text-sm font-medium hover:bg-rp-navy2 transition-colors">
              Get Full Evaluation
            </button>
          </div>
        </div>

        {/* Right Column Info */}
        <div className="grid grid-cols-3 gap-8 mt-16">
          <div></div>
          <div></div>
          <div className="border border-rp-border rounded-lg p-8 bg-rp-page">
            <p className="font-serif text-xl text-rp-navy mb-4">The deeper the insight, the better the decision.</p>
            <p className="text-sm text-rp-textNavy mb-4">
              The full evaluation reveals the structural factors that determine how your income performs when it matters most.
            </p>
            <p className="text-xs text-rp-softGray">
              Designed for independent professionals, consultants, and business owners who need institutional-grade income assessment.
            </p>
          </div>
        </div>
      </section>

      {/* FAQ SECTION */}
      <section className="bg-rp-page border-y border-rp-border">
        <div className="max-w-[1440px] mx-auto px-8 py-24">
          <h2 className="text-sm font-medium text-rp-navy mb-12 uppercase tracking-wider">Key Questions Answered</h2>

          <div className="space-y-4 max-w-2xl">
            {[
              { q: "What does RunPayway™ evaluate?", a: "RunPayway™ measures income stability by analyzing six structural dimensions: revenue structure, continuity, labor independence, predictability, diversification, and resilience." },
              { q: "Why can similar income produce different stability outcomes?", a: "Income amount alone doesn't determine stability. How that income is structured—its sources, continuity, and vulnerability—determines how resilient it is under real-world conditions." },
              { q: "Does RunPayway™ evaluate income amount?", a: "No. RunPayway™ evaluates the structure behind your income, not the size of it. Two people with identical income can have very different stability profiles." },
              { q: "Is evaluation private?", a: "Yes. Your evaluation data is completely private. RunPayway™ does not store, sell, or share your data. Your results are yours alone." },
              { q: "How is the Income Stability Score™ calculated?", a: "The Income Stability Score™ is calculated using a deterministic methodology that evaluates six dimensions of income structure. The same inputs will always produce the same result." },
            ].map((item, index) => (
              <div key={index} className="border-b border-rp-border pb-4">
                <button
                  onClick={() => toggleFaq(index)}
                  className="w-full flex justify-between items-center py-4 text-left hover:bg-white transition-colors rounded px-4 -mx-4"
                >
                  <p className="font-medium text-rp-navy text-sm">{item.q}</p>
                  <span className={`text-rp-navy transition-transform ${openFaqIndex === index ? 'rotate-180' : ''}`}>
                    ▼
                  </span>
                </button>
                {openFaqIndex === index && (
                  <p className="text-sm text-rp-textNavy pb-4 px-4">
                    {item.a}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* BOTTOM CTA SECTION */}
      <section className="max-w-[1440px] mx-auto px-8 py-24">
        <div className="text-center">
          <h2 className="font-serif text-4xl leading-tight text-rp-navy mb-12">
            Understand Your Stability Position.
          </h2>
          <p className="text-sm text-rp-textNavy mb-12 max-w-lg mx-auto">
            Complete your evaluation in under 2 minutes.
          </p>
          <button className="bg-rp-navy text-white px-8 py-3 rounded-md text-sm font-medium hover:bg-rp-navy2 transition-colors">
            Start Free Evaluation
          </button>
        </div>

        {/* Decorative dots */}
        <div className="mt-20 flex justify-center gap-2 opacity-20">
          {[...Array(12)].map((_, i) => (
            <span key={i} className="w-1 h-1 bg-rp-navy rounded-full"></span>
          ))}
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-rp-navy text-white">
        <div className="max-w-[1440px] mx-auto px-8 py-20">
          <div className="grid grid-cols-5 gap-12 mb-16">
            <div>
              <img src="/RunPayway/logo.png" alt="RunPayway™" className="h-12 w-auto mb-6 brightness-0 invert" />
              <p className="text-xs text-gray-300">Income Stability Score™</p>
            </div>

            <div>
              <p className="text-xs font-medium uppercase tracking-wider text-gray-200 mb-4">Product</p>
              <nav className="space-y-2 text-xs text-gray-300">
                <a href="#" className="hover:text-white transition-colors">How It Works</a>
                <a href="#" className="hover:text-white transition-colors block">Methodology</a>
                <a href="#" className="hover:text-white transition-colors block">Use Cases</a>
              </nav>
            </div>

            <div>
              <p className="text-xs font-medium uppercase tracking-wider text-gray-200 mb-4">Resources</p>
              <nav className="space-y-2 text-xs text-gray-300">
                <a href="#" className="hover:text-white transition-colors">Learn</a>
                <a href="#" className="hover:text-white transition-colors block">About</a>
                <a href="#" className="hover:text-white transition-colors block">Contact</a>
              </nav>
            </div>

            <div>
              <p className="text-xs font-medium uppercase tracking-wider text-gray-200 mb-4">Legal</p>
              <nav className="space-y-2 text-xs text-gray-300">
                <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
                <a href="#" className="hover:text-white transition-colors block">Terms of Use</a>
                <a href="#" className="hover:text-white transition-colors block">Security</a>
              </nav>
            </div>

            <div>
              <p className="text-xs font-medium uppercase tracking-wider text-gray-200 mb-4">Framework</p>
              <nav className="space-y-2 text-xs text-gray-300">
                <a href="#" className="hover:text-white transition-colors">Deterministic Framework</a>
                <a href="#" className="hover:text-white transition-colors block">Version-Stamped Results</a>
                <a href="#" className="hover:text-white transition-colors block">Privacy First</a>
              </nav>
            </div>
          </div>

          <div className="border-t border-gray-700 pt-8 flex justify-between items-center text-xs text-gray-300">
            <p>© 2024 RunPayway™. All rights reserved. Income Stability Score™ is a trademark of RunPayway.</p>
            <div className="flex items-center gap-2">
              <span>MODEL RP-2.0</span>
              <span className="text-gray-500">—</span>
              <span>VERSION LOCKED</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
