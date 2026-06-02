'use client';

import React from 'react';
import Image from 'next/image';

const COLORS = {
  navy: '#0E1A2B',
  teal: '#1F6D7A',
  purple: '#4B3FAE',
  sand: '#F4F1EA',
  white: '#FFFFFF',
  border: '#E5E7EB',
};

export default function LandingPage() {
  return (
    <div className="w-full">
      <style>{`
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }

        body, html {
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
        }

        .rp-header {
          position: sticky;
          top: 0;
          height: 80px;
          background: white;
          border-bottom: 1px solid #E5E7EB;
          display: flex;
          align-items: center;
          z-index: 100;
        }

        .rp-header-container {
          width: 100%;
          max-width: 1280px;
          margin: 0 auto;
          padding: 0 20px;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .rp-nav {
          display: none;
        }

        @media (min-width: 1024px) {
          .rp-nav {
            display: flex;
            gap: 32px;
          }
        }

        .rp-section {
          padding: 64px 20px;
          max-width: 1280px;
          margin: 0 auto;
        }

        @media (min-width: 768px) {
          .rp-section {
            padding: 80px 20px;
          }
        }

        @media (min-width: 1024px) {
          .rp-section {
            padding: 120px 20px;
          }
        }

        .rp-section.rp-sand {
          background: ${COLORS.sand};
        }

        .rp-section.rp-navy {
          background: ${COLORS.navy};
          color: white;
        }

        .rp-grid-2 {
          display: grid;
          grid-template-columns: 1fr;
          gap: 48px;
          align-items: center;
        }

        @media (min-width: 1024px) {
          .rp-grid-2 {
            grid-template-columns: 55% 45%;
          }
        }

        .rp-grid-comparison {
          display: grid;
          grid-template-columns: 1fr;
          gap: 32px;
        }

        @media (min-width: 768px) {
          .rp-grid-comparison {
            grid-template-columns: 1fr 1fr;
          }
        }

        .rp-grid-3-cards {
          display: grid;
          grid-template-columns: 1fr;
          gap: 32px;
        }

        @media (min-width: 768px) {
          .rp-grid-3-cards {
            grid-template-columns: 1fr;
          }
        }

        @media (min-width: 1024px) {
          .rp-grid-3-cards {
            grid-template-columns: 1fr 1fr 1fr;
          }
        }

        .rp-grid-pillars {
          display: grid;
          grid-template-columns: 1fr;
          gap: 32px;
        }

        @media (min-width: 1024px) {
          .rp-grid-pillars {
            grid-template-columns: 1fr 1fr 1fr;
          }
        }

        .rp-grid-footer {
          display: grid;
          grid-template-columns: 1fr;
          gap: 64px;
        }

        @media (min-width: 768px) {
          .rp-grid-footer {
            grid-template-columns: 1fr 1fr;
          }
        }

        @media (min-width: 1024px) {
          .rp-grid-footer {
            grid-template-columns: repeat(4, 1fr);
          }
        }

        .rp-button-primary {
          background: ${COLORS.purple};
          color: white;
          border: none;
          padding: 16px 32px;
          border-radius: 6px;
          font-size: 16px;
          font-weight: 600;
          cursor: pointer;
          text-decoration: none;
          display: inline-block;
          transition: opacity 0.2s;
        }

        .rp-button-primary:hover {
          opacity: 0.9;
        }

        .rp-button-block {
          width: 100%;
          padding: 16px;
        }

        .rp-card {
          background: white;
          border: 1px solid ${COLORS.border};
          border-radius: 8px;
          padding: 40px;
        }

        .rp-card.rp-highlight {
          border: 2px solid ${COLORS.purple};
          box-shadow: 0 0 0 1px rgba(75, 63, 174, 0.1);
        }

        .rp-report {
          background: white;
          border: 1px solid ${COLORS.border};
          border-radius: 8px;
          padding: 40px;
        }

        h1, h2, h3, h4, h5, h6 {
          color: ${COLORS.navy};
          font-weight: 700;
          line-height: 1.2;
        }

        h1 {
          font-size: 40px;
        }

        @media (min-width: 768px) {
          h1 {
            font-size: 48px;
          }
        }

        h2 {
          font-size: 32px;
        }

        @media (min-width: 768px) {
          h2 {
            font-size: 40px;
          }
        }

        @media (min-width: 1024px) {
          h2 {
            font-size: 44px;
          }
        }

        h3 {
          font-size: 24px;
        }

        h4 {
          font-size: 18px;
        }

        p {
          color: ${COLORS.navy};
          font-weight: 400;
          line-height: 1.6;
        }

        a {
          color: ${COLORS.teal};
          text-decoration: none;
          font-weight: 600;
          cursor: pointer;
        }

        a:hover {
          opacity: 0.8;
        }

        .rp-navy-text h1, .rp-navy-text h2, .rp-navy-text h3, .rp-navy-text h4, .rp-navy-text h5, .rp-navy-text h6 {
          color: white;
        }

        .rp-navy-text p {
          color: white;
        }

        .rp-navy-text a {
          color: white;
        }

        .rp-report-score {
          font-size: 52px;
          font-weight: 700;
          color: ${COLORS.navy};
          margin: 0;
        }

        .rp-report-class {
          font-size: 20px;
          font-weight: 700;
          color: ${COLORS.navy};
          margin: 0;
        }

        ul {
          list-style: none;
          margin: 0;
          padding: 0;
        }

        li {
          margin-bottom: 8px;
        }
      `}</style>

      {/* HEADER */}
      <header className="rp-header">
        <div className="rp-header-container">
          {/* Logo */}
          <div className="flex items-center">
            <Image
              src="/RunPayway_Logo.svg"
              alt="RunPayway™"
              width={180}
              height={40}
              priority
              style={{ height: 'auto' }}
            />
          </div>

          {/* Desktop Navigation */}
          <nav className="rp-nav">
            {['How It Works', 'Methodology', 'Learn', 'Solutions'].map((item) => (
              <a
                key={item}
                href="#"
                className="text-sm font-medium"
              >
                {item}
                {item === 'Solutions' && ' ▼'}
              </a>
            ))}
          </nav>

          {/* Right Actions */}
          <div className="flex gap-4 items-center">
            <a
              href="/sign-in"
              className="text-sm font-medium hidden lg:block"
            >
              Sign In
            </a>
            <button
              className="rp-button-primary text-sm"
              onClick={() => window.location.href = '/assessment'}
            >
              Start Assessment →
            </button>
          </div>
        </div>
      </header>

      {/* HERO */}
      <section className="rp-section">
        <div className="rp-grid-2">
          {/* Left Content */}
          <div>
            <h1 className="mb-6">
              Before relying on income, know its stability.
            </h1>
            <p className="text-lg mb-8">
              RunPayway™ measures the stability of your income using Structural Stability Model RP-2.0.
            </p>
            <button
              className="rp-button-primary mb-6"
              onClick={() => window.location.href = '/assessment'}
            >
              Start Assessment →
            </button>
            <p className="text-sm opacity-70">
              Free • Under 2 Minutes • No Documents Required
            </p>
          </div>

          {/* Right - Report Preview */}
          <ReportPreview />
        </div>
      </section>

      {/* SAME INCOME. DIFFERENT STABILITY. */}
      <section className="rp-section rp-sand">
        <h2 className="text-center mb-12">Same Income. Different Stability.</h2>

        {/* Comparison Panels */}
        <div className="rp-grid-comparison mb-12">
          {/* Profile A */}
          <div className="rp-card">
            <h3 className="text-lg font-semibold mb-6">PROFILE A</h3>
            <div className="mb-8">
              <p className="font-semibold mb-4">Income: $150,000</p>
              <ul className="text-sm">
                <li>• One primary client</li>
                <li>• No recurring agreements</li>
                <li>• Income depends on continued activity</li>
              </ul>
            </div>
            <div className="bg-white bg-opacity-50 p-5 rounded-lg">
              <p className="text-xs font-semibold mb-2">Income Stability Class</p>
              <p className="rp-report-class">Developing Stability</p>
            </div>
          </div>

          {/* Profile B */}
          <div className="rp-card">
            <h3 className="text-lg font-semibold mb-6">PROFILE B</h3>
            <div className="mb-8">
              <p className="font-semibold mb-4">Income: $150,000</p>
              <ul className="text-sm">
                <li>• Multiple income sources</li>
                <li>• Recurring income</li>
                <li>• Lower concentration</li>
                <li>• More consistent income over time</li>
              </ul>
            </div>
            <div className="bg-white bg-opacity-50 p-5 rounded-lg">
              <p className="text-xs font-semibold mb-2">Income Stability Class</p>
              <p className="rp-report-class">Established Stability</p>
            </div>
          </div>
        </div>

        {/* Key Insight */}
        <div className="rp-card">
          <p className="font-semibold text-lg mb-4">Key Insight</p>
          <p className="mb-6">
            Two people earning the same income can receive different Income Stability classifications.
          </p>
          <a href="#">Know the stability of your income →</a>
        </div>
      </section>

      {/* EXAMPLE INCOME STABILITY PROFILE */}
      <section className="rp-section">
        <h2 className="mb-16">Example Income Stability Profile</h2>

        {/* Report Component */}
        <div className="mb-20">
          <ReportProfile />
        </div>

        {/* Included In The Report */}
        <div className="mt-16">
          <h3 className="text-xl font-semibold mb-8">Included In The Report</h3>
          <div className="grid grid-cols-1 gap-4 mb-8">
            {[
              'Income Stability Measurement',
              'Income Stability Class',
              'Income Stability Score',
              'Primary Stability Drivers™',
              'Stability Pressure Factors™',
              'Report Verification',
            ].map((item) => (
              <p key={item} className="text-base">
                {item}
              </p>
            ))}
          </div>
          <a href="/sample-report">View Sample Report →</a>
        </div>
      </section>

      {/* UNDERSTANDING THE REPORT */}
      <section className="rp-section rp-sand">
        <h2 className="mb-16">Understanding the Report</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-16">
          {[
            {
              title: 'Income Stability Measurement',
              desc: 'A standardized measurement of Income Stability.',
            },
            {
              title: 'Income Stability Class',
              desc: 'A classification within the Income Stability framework.',
            },
            {
              title: 'Income Stability Score',
              desc: 'A standardized score generated using Structural Stability Model RP-2.0.',
            },
            {
              title: 'Primary Stability Drivers™',
              desc: 'Characteristics contributing most to the result.',
            },
            {
              title: 'Stability Pressure Factors™',
              desc: 'Characteristics placing pressure on the result.',
            },
            {
              title: 'Report Verification',
              desc: 'Model version, report identification, and verification details.',
            },
          ].map((item) => (
            <div key={item.title}>
              <h4 className="mb-3">{item.title}</h4>
              <p>{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* WHY INCOME STABILITY EXISTS */}
      <section className="rp-section">
        <div className="max-w-4xl mx-auto text-center">
          <h2 style={{ fontSize: '44px' }} className="font-semibold">
            Income Amount And Income Stability Provide Different Information.
          </h2>
        </div>
      </section>

      {/* STRUCTURAL STABILITY MODEL RP-2.0 */}
      <section className="rp-section">
        <h2 className="mb-16">Structural Stability Model RP-2.0</h2>

        <div className="rp-grid-pillars mb-12">
          {['Same Inputs', 'Same Methodology', 'Same Outputs'].map((item) => (
            <div
              key={item}
              className="rp-card text-center"
            >
              <p className="text-lg font-semibold">{item}</p>
            </div>
          ))}
        </div>

        <div className="bg-[#F4F1EA] p-10 rounded-lg mb-8">
          <p className="text-base mb-4">No human overrides.</p>
          <p className="text-base mb-4">No subjective scoring.</p>
          <p className="text-base">No changing standards.</p>
        </div>

        <a href="/methodology">Learn More About The Methodology →</a>
      </section>

      {/* ACCESS YOUR RESULT */}
      <section className="rp-section rp-sand">
        <h2 className="mb-16">Access Your Result</h2>

        <div className="rp-grid-3-cards">
          {/* Assessment Card */}
          <div className="rp-card">
            <h3 className="mb-4">Assessment</h3>
            <p className="text-base mb-6">Begin the measurement process.</p>
            <div className="mb-8">
              <p className="text-xs font-semibold mb-3">Includes:</p>
              <ul className="text-xs space-y-2">
                <li>• Assessment Completion</li>
                <li>• Income Structure Evaluation</li>
                <li>• Eligibility To Unlock Additional Outputs</li>
              </ul>
            </div>
            <p className="text-xl font-bold text-teal mb-6">FREE</p>
            <button
              className="rp-button-primary rp-button-block"
              onClick={() => window.location.href = '/assessment'}
            >
              Start Assessment →
            </button>
          </div>

          {/* Result Card - HIGHEST EMPHASIS */}
          <div className="rp-card rp-highlight">
            <h3 style={{ color: COLORS.purple }} className="mb-4">Result</h3>
            <p className="text-base mb-6">Receive your Income Stability result.</p>
            <div className="mb-8">
              <p className="text-xs font-semibold mb-3">Includes:</p>
              <ul className="text-xs space-y-2">
                <li>• Income Stability Measurement</li>
                <li>• Income Stability Class</li>
                <li>• Income Stability Score</li>
              </ul>
            </div>
            <p style={{ color: COLORS.purple }} className="text-xl font-bold mb-6">$9</p>
            <button
              className="rp-button-primary rp-button-block"
              onClick={() => window.location.href = '/assessment'}
            >
              Reveal My Result →
            </button>
          </div>

          {/* Analysis Card */}
          <div className="rp-card">
            <h3 className="mb-4">Analysis</h3>
            <p className="text-base mb-6">Receive the complete Income Stability analysis.</p>
            <div className="mb-8">
              <p className="text-xs font-semibold mb-3">Includes everything in Result plus:</p>
              <ul className="text-xs space-y-2">
                <li>• Expanded Result Explanation</li>
                <li>• Stability Contributors</li>
                <li>• Stability Pressure Factors™</li>
                <li>• Review Areas</li>
                <li>• Industry Context™</li>
                <li>• Analysis Observations™</li>
              </ul>
            </div>
            <p className="text-xl font-bold mb-6">$69</p>
            <button
              className="rp-button-primary rp-button-block"
              onClick={() => window.location.href = '/assessment'}
            >
              Understand My Income Stability →
            </button>
          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="rp-section rp-navy rp-navy-text">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="mb-6">Before relying on income, know its stability.</h2>
          <p className="text-xl font-medium mb-12">Start Your Income Stability Assessment.</p>
          <button
            className="rp-button-primary mb-6"
            onClick={() => window.location.href = '/assessment'}
          >
            Start Assessment →
          </button>
          <p className="text-sm opacity-90">
            Free • Under 2 Minutes • No Documents Required
          </p>
        </div>
      </section>

      {/* SYSTEM CLARIFICATION */}
      <section className="rp-section">
        <div className="max-w-2xl mx-auto">
          <p className="text-base mb-4">
            RunPayway™ measures the stability of your income using Structural Stability Model RP-2.0.
          </p>
          <p className="text-base mb-4">
            RunPayway™ is not a credit score, lending decision, investment recommendation, financial plan, employment evaluation, or prediction of future income.
          </p>
          <p className="text-base mb-4">
            Results provide a standardized measurement generated from information supplied during the assessment.
          </p>
          <p className="text-base mb-4">Model Version: RP-2.0</p>
          <p className="text-base">Verification Available On Issued Reports.</p>
        </div>
      </section>

      {/* FOOTER */}
      <footer style={{ backgroundColor: COLORS.navy }} className="text-white py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="rp-grid-footer mb-20">
            {/* Product */}
            <div>
              <h4 className="text-xs font-bold mb-5 uppercase tracking-wider text-white">Product</h4>
              <ul className="space-y-4">
                {['Income Stability Assessment', 'How It Works', 'Methodology', 'Verify Report'].map(
                  (link) => (
                    <li key={link}>
                      <a href="#" className="text-sm font-normal text-white hover:opacity-80">
                        {link}
                      </a>
                    </li>
                  )
                )}
              </ul>
            </div>

            {/* Solutions */}
            <div>
              <h4 className="text-xs font-bold mb-5 uppercase tracking-wider text-white">Solutions</h4>
              <ul className="space-y-4">
                {['Individuals', 'Advisors', 'Organizations'].map((link) => (
                  <li key={link}>
                    <a href="#" className="text-sm font-normal text-white hover:opacity-80">
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Learn */}
            <div>
              <h4 className="text-xs font-bold mb-5 uppercase tracking-wider text-white">Learn</h4>
              <ul className="space-y-4">
                {[
                  'What Is Income Stability?',
                  'Income Stability vs Income',
                  'Why Income Stability Matters',
                  'Learn',
                ].map((link) => (
                  <li key={link}>
                    <a href="#" className="text-sm font-normal text-white hover:opacity-80">
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Company */}
            <div>
              <h4 className="text-xs font-bold mb-5 uppercase tracking-wider text-white">Company</h4>
              <ul className="space-y-4">
                {['About', 'Contact', 'Privacy', 'Terms', 'Accessibility'].map((link) => (
                  <li key={link}>
                    <a href="#" className="text-sm font-normal text-white hover:opacity-80">
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Bottom Footer */}
          <div
            className="border-t pt-10 text-center"
            style={{ borderTopColor: 'rgba(255,255,255,0.1)' }}
          >
            <p className="text-xs opacity-70 mb-4">Income Stability Measurement</p>
            <p className="text-xs opacity-70 mb-2">© 2026 RunPayway™. All rights reserved.</p>
            <p className="text-xs opacity-70 mb-2">RunPayway™ is a product of PeopleStar Enterprises, LLC.</p>
            <p className="text-xs opacity-70 mb-2">Orange County, California, USA.</p>
            <p className="text-xs opacity-70">Structural Stability Model RP-2.0.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

// Report Preview Component for Hero
function ReportPreview() {
  return (
    <div className="rp-report">
      <div className="mb-8">
        <p className="text-xs font-semibold mb-2">Income Stability Score</p>
        <p className="rp-report-score">72</p>
      </div>

      <div className="mb-8 border-b pb-8" style={{ borderBottomColor: COLORS.border }}>
        <p className="text-xs font-semibold mb-2">Income Stability Class</p>
        <p className="rp-report-class">Established Stability</p>
      </div>

      <div className="mb-8">
        <h4 className="text-xs font-bold mb-3 uppercase tracking-wider">Primary Stability Drivers™</h4>
        <ul className="text-xs space-y-2">
          <li>• Recurring Income</li>
          <li>• Income Diversification</li>
          <li>• Income Continuity</li>
        </ul>
      </div>

      <div className="mb-8 border-b pb-8" style={{ borderBottomColor: COLORS.border }}>
        <h4 className="text-xs font-bold mb-3 uppercase tracking-wider">Stability Pressure Factors™</h4>
        <ul className="text-xs space-y-2">
          <li>• Income Concentration</li>
          <li>• Activity Dependency</li>
        </ul>
      </div>

      <div>
        <p className="text-xs font-bold mb-3 uppercase tracking-wider">VERIFIED REPORT</p>
        <div className="grid grid-cols-2 gap-6 text-xs mb-4">
          <div>
            <p className="opacity-70 mb-1">Verification Status:</p>
            <p className="font-semibold">Verified</p>
          </div>
          <div>
            <p className="opacity-70 mb-1">Report ID:</p>
            <p className="font-semibold">RP2-2026-0048127</p>
          </div>
          <div>
            <p className="opacity-70 mb-1">Model Version:</p>
            <p className="font-semibold">RP-2.0</p>
          </div>
          <div>
            <p className="opacity-70 mb-1">Generated:</p>
            <p className="font-semibold">June 2, 2026</p>
          </div>
        </div>
        <p className="text-xs opacity-70">Verification Available On All Issued Reports</p>
      </div>
    </div>
  );
}

// Report Profile Component for Example Section
function ReportProfile() {
  return (
    <div className="rp-report" style={{ padding: '60px' }}>
      <div className="mb-12">
        <p className="text-xs font-semibold mb-2">Income Stability Score</p>
        <p style={{ fontSize: '52px', fontWeight: '700', margin: '0' }}>72</p>
      </div>

      <div className="mb-12 border-b pb-12" style={{ borderBottomColor: COLORS.border }}>
        <p className="text-xs font-semibold mb-2">Income Stability Class</p>
        <p className="rp-report-class">Established Stability</p>
      </div>

      <div className="mb-12">
        <h4 className="text-xs font-bold mb-4 uppercase tracking-wider">Primary Stability Drivers™</h4>
        <ul className="text-xs space-y-3">
          <li>• Recurring Income</li>
          <li>• Income Diversification</li>
          <li>• Income Continuity</li>
        </ul>
      </div>

      <div className="mb-12 border-b pb-12" style={{ borderBottomColor: COLORS.border }}>
        <h4 className="text-xs font-bold mb-4 uppercase tracking-wider">Stability Pressure Factors™</h4>
        <ul className="text-xs space-y-3">
          <li>• Income Concentration</li>
          <li>• Activity Dependency</li>
        </ul>
      </div>

      <div>
        <p className="text-xs font-bold mb-4 uppercase tracking-wider">VERIFIED REPORT</p>
        <div className="grid grid-cols-2 gap-10 text-xs mb-6">
          <div>
            <p className="opacity-70 mb-1">Verification Status:</p>
            <p className="font-semibold">Verified</p>
          </div>
          <div>
            <p className="opacity-70 mb-1">Report ID:</p>
            <p className="font-semibold">RP2-2026-0048127</p>
          </div>
          <div>
            <p className="opacity-70 mb-1">Model Version:</p>
            <p className="font-semibold">RP-2.0</p>
          </div>
          <div>
            <p className="opacity-70 mb-1">Generated:</p>
            <p className="font-semibold">June 2, 2026</p>
          </div>
        </div>
        <p className="text-xs opacity-70">Verification Available On All Issued Reports</p>
      </div>
    </div>
  );
}
