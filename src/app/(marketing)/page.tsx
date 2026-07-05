'use client';

import React from 'react';
import Link from 'next/link';

// ================================================================
// RUNPAYWAY PRODUCTION LANDING PAGE
// Final Landing Page Information Architecture Blueprint™ v1.0
// Category Protection Standard™ Compliant
// ================================================================

export default function LandingPage() {
  return (
    <div style={{
      fontFamily: "'Inter Variable', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
      backgroundColor: '#FCFCFB',
      color: '#0B1730',
      margin: 0,
      padding: 0,
      overflow: 'hidden'
    }}>
      <style>{`
        * { margin: 0; padding: 0; box-sizing: border-box; }
        html, body { overflow-x: hidden; }

        .header {
          position: sticky;
          top: 0;
          height: 80px;
          background: #FFFFFF;
          border-bottom: 1px solid #E5E7EB;
          display: flex;
          align-items: center;
          z-index: 100;
          padding: 0 48px;
        }

        @media (max-width: 1024px) { .header { padding: 0 32px; } }
        @media (max-width: 768px) { .header { padding: 0 24px; height: 64px; } }

        .header-content {
          width: 100%;
          max-width: 1400px;
          margin: 0 auto;
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 48px;
        }

        .logo { height: 40px; width: auto; flex-shrink: 0; }

        .logo-text {
          font-size: 14px;
          font-weight: 600;
          color: #0B1730;
          text-decoration: none;
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .nav {
          display: flex;
          gap: 40px;
          align-items: center;
          flex: 1;
        }

        @media (max-width: 768px) { .nav { display: none; } }

        .nav a {
          font-size: 14px;
          font-weight: 500;
          color: #0B1730;
          text-decoration: none;
          position: relative;
          transition: color 200ms;
        }

        .nav a:hover { color: #4B3FAE; }

        .nav-dropdown {
          position: relative;
          display: inline-block;
        }

        .nav-dropdown-content {
          display: none;
          position: absolute;
          background-color: white;
          min-width: 180px;
          box-shadow: 0 8px 16px rgba(0,0,0,0.1);
          padding: 8px 0;
          z-index: 1;
          border: 1px solid #E5E7EB;
          border-radius: 4px;
          top: 100%;
          left: 0;
        }

        .nav-dropdown:hover .nav-dropdown-content {
          display: block;
        }

        .nav-dropdown-content a {
          color: #0B1730;
          padding: 8px 16px;
          text-decoration: none;
          display: block;
          font-size: 13px;
          font-weight: 400;
        }

        .nav-dropdown-content a:hover {
          background-color: #F3F4F6;
          color: #4B3FAE;
        }

        .header-right {
          display: flex;
          gap: 24px;
          align-items: center;
          flex-shrink: 0;
          margin-left: auto;
        }

        .header-cta {
          background: #0B1730;
          color: #FCFCFB;
          border: 1px solid #0B1730;
          padding: 12px 28px;
          border-radius: 2px;
          font-size: 12px;
          font-weight: 700;
          cursor: pointer;
          text-decoration: none;
          display: inline-flex;
          align-items: center;
          gap: 8px;
          transition: all 150ms;
        }

        .header-cta:hover {
          background: #4B3FAE;
          border-color: #4B3FAE;
        }

        .section {
          padding: 80px 48px;
          max-width: 1400px;
          margin: 0 auto;
        }

        @media (max-width: 1024px) { .section { padding: 64px 32px; } }
        @media (max-width: 768px) { .section { padding: 48px 24px; } }

        .section-title {
          font-size: 40px;
          font-weight: 600;
          line-height: 1.2;
          color: #0B1730;
          margin-bottom: 32px;
          letter-spacing: -0.03em;
        }

        .section-subtitle {
          font-size: 18px;
          font-weight: 500;
          color: #6B7280;
          line-height: 1.6;
          margin-bottom: 40px;
        }

        .hero-title {
          font-size: 56px;
          font-weight: 600;
          line-height: 1.1;
          color: #0B1730;
          margin-bottom: 20px;
          letter-spacing: -0.04em;
        }

        .hero-subheading {
          font-size: 18px;
          font-weight: 400;
          color: #6B7280;
          line-height: 1.6;
          margin-bottom: 40px;
          max-width: 600px;
        }

        .cta-button {
          background: #0B1730;
          color: #FCFCFB;
          border: none;
          padding: 16px 32px;
          border-radius: 2px;
          font-size: 13px;
          font-weight: 700;
          cursor: pointer;
          text-decoration: none;
          display: inline-flex;
          align-items: center;
          gap: 8px;
          transition: all 150ms;
          letter-spacing: 0.03em;
        }

        .cta-button:hover {
          background: #4B3FAE;
        }

        .secondary-cta {
          background: transparent;
          color: #0B1730;
          border: 1px solid #0B1730;
          padding: 14px 28px;
          margin-left: 16px;
        }

        .secondary-cta:hover {
          background: #F3F4F6;
          border-color: #4B3FAE;
          color: #4B3FAE;
        }

        .four-column-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 32px;
          margin-top: 40px;
        }

        @media (max-width: 1024px) { .four-column-grid { grid-template-columns: repeat(2, 1fr); } }
        @media (max-width: 768px) { .four-column-grid { grid-template-columns: 1fr; } }

        .feature-card {
          background: #FFFFFF;
          border: 1px solid #E5E7EB;
          padding: 32px;
          border-radius: 4px;
          transition: all 200ms;
        }

        .feature-card:hover {
          border-color: #4B3FAE;
          box-shadow: 0 4px 12px rgba(75, 63, 174, 0.08);
        }

        .feature-label {
          font-size: 12px;
          font-weight: 700;
          letter-spacing: 0.08em;
          color: #1F6D7A;
          text-transform: uppercase;
          margin-bottom: 12px;
        }

        .feature-title {
          font-size: 18px;
          font-weight: 600;
          color: #0B1730;
          margin-bottom: 12px;
          line-height: 1.3;
        }

        .feature-description {
          font-size: 15px;
          color: #6B7280;
          line-height: 1.6;
          margin: 0;
        }

        .report-preview {
          background: #FFFFFF;
          border: 1px solid #E5E7EB;
          border-radius: 4px;
          padding: 40px;
          margin: 40px 0;
        }

        .report-section {
          margin-bottom: 32px;
          padding-bottom: 32px;
          border-bottom: 1px solid #E5E7EB;
        }

        .report-section:last-child {
          border-bottom: none;
          margin-bottom: 0;
          padding-bottom: 0;
        }

        .report-label {
          font-size: 12px;
          font-weight: 700;
          letter-spacing: 0.08em;
          color: #1F6D7A;
          text-transform: uppercase;
          margin-bottom: 8px;
        }

        .report-content {
          font-size: 15px;
          color: #0B1730;
          line-height: 1.6;
          font-weight: 500;
        }

        .report-description {
          font-size: 14px;
          color: #6B7280;
          line-height: 1.6;
          margin-top: 4px;
        }

        .comparison-table {
          width: 100%;
          border-collapse: collapse;
          margin-top: 32px;
        }

        .comparison-table th,
        .comparison-table td {
          padding: 16px;
          text-align: left;
          border-bottom: 1px solid #E5E7EB;
          font-size: 14px;
        }

        .comparison-table th {
          background: #F9FAFB;
          font-weight: 700;
          color: #0B1730;
        }

        .comparison-table tr:last-child td {
          border-bottom: none;
        }

        .decision-carousel {
          display: flex;
          gap: 24px;
          overflow-x: auto;
          padding: 20px 0;
          margin: 40px 0;
          scroll-behavior: smooth;
        }

        @media (max-width: 768px) { .decision-carousel { margin: 24px -24px; padding: 20px 24px; } }

        .decision-card {
          background: #FFFFFF;
          border: 1px solid #E5E7EB;
          padding: 32px;
          border-radius: 4px;
          flex-shrink: 0;
          width: 320px;
          transition: all 200ms;
        }

        @media (max-width: 768px) { .decision-card { width: 280px; } }

        .decision-card:hover {
          border-color: #4B3FAE;
          box-shadow: 0 4px 12px rgba(75, 63, 174, 0.08);
        }

        .decision-title {
          font-size: 16px;
          font-weight: 700;
          color: #0B1730;
          margin-bottom: 16px;
          text-transform: uppercase;
          letter-spacing: 0.03em;
        }

        .decision-item {
          font-size: 14px;
          color: #6B7280;
          line-height: 1.6;
          margin-bottom: 12px;
          padding-left: 20px;
          position: relative;
        }

        .decision-item:before {
          content: '•';
          position: absolute;
          left: 0;
          color: #1F6D7A;
          font-weight: bold;
        }

        .three-step-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 40px;
          margin: 40px 0;
        }

        @media (max-width: 1024px) { .three-step-grid { grid-template-columns: repeat(2, 1fr); gap: 32px; } }
        @media (max-width: 768px) { .three-step-grid { grid-template-columns: 1fr; gap: 24px; } }

        .step-card {
          text-align: center;
        }

        .step-number {
          font-size: 48px;
          font-weight: 700;
          color: #4B3FAE;
          line-height: 1;
          margin-bottom: 20px;
        }

        .step-title {
          font-size: 18px;
          font-weight: 600;
          color: #0B1730;
          margin-bottom: 12px;
          line-height: 1.3;
        }

        .step-description {
          font-size: 15px;
          color: #6B7280;
          line-height: 1.6;
          margin: 0;
        }

        .commitment-spectrum {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 16px;
          margin: 40px 0;
        }

        @media (max-width: 768px) { .commitment-spectrum { grid-template-columns: repeat(2, 1fr); } }

        .commitment-level {
          background: #FFFFFF;
          border: 1px solid #E5E7EB;
          padding: 24px;
          border-radius: 4px;
          text-align: center;
          transition: all 200ms;
        }

        .commitment-level:hover {
          border-color: #4B3FAE;
          box-shadow: 0 4px 12px rgba(75, 63, 174, 0.08);
        }

        .commitment-badge {
          display: inline-block;
          background: #F3F4F6;
          padding: 8px 12px;
          border-radius: 2px;
          font-size: 12px;
          font-weight: 700;
          color: #0B1730;
          margin-bottom: 12px;
          letter-spacing: 0.03em;
        }

        .commitment-label {
          font-size: 14px;
          font-weight: 600;
          color: #0B1730;
          margin-bottom: 8px;
          line-height: 1.3;
        }

        .commitment-description {
          font-size: 13px;
          color: #6B7280;
          line-height: 1.5;
        }

        .what-is-not-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 48px;
          margin: 40px 0;
        }

        @media (max-width: 768px) { .what-is-not-grid { grid-template-columns: 1fr; gap: 32px; } }

        .what-is-item {
          display: flex;
          gap: 16px;
          margin-bottom: 20px;
        }

        .what-is-check {
          font-size: 20px;
          color: #1F6D7A;
          flex-shrink: 0;
          font-weight: 700;
          width: 24px;
          text-align: center;
        }

        .what-is-text {
          font-size: 15px;
          color: #0B1730;
          line-height: 1.6;
          font-weight: 500;
        }

        .footer {
          background: #FFFFFF;
          border-top: 1px solid #E5E7EB;
          padding: 80px 48px 40px;
          margin-top: 80px;
        }

        @media (max-width: 1024px) { .footer { padding: 64px 32px 32px; } }
        @media (max-width: 768px) { .footer { padding: 48px 24px 24px; } }

        .footer-content {
          max-width: 1400px;
          margin: 0 auto;
        }

        .footer-grid {
          display: grid;
          grid-template-columns: repeat(7, 1fr);
          gap: 40px;
          margin-bottom: 40px;
          padding-bottom: 40px;
          border-bottom: 1px solid #E5E7EB;
        }

        @media (max-width: 1024px) { .footer-grid { grid-template-columns: repeat(3, 1fr); gap: 32px; } }
        @media (max-width: 768px) { .footer-grid { grid-template-columns: repeat(2, 1fr); gap: 24px; } }

        .footer-column h3 {
          font-size: 12px;
          font-weight: 700;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          color: #0B1730;
          margin-bottom: 16px;
        }

        .footer-column p {
          font-size: 14px;
          color: #6B7280;
          line-height: 1.6;
          margin-bottom: 12px;
        }

        .footer-column a {
          display: block;
          font-size: 14px;
          color: #6B7280;
          text-decoration: none;
          margin-bottom: 12px;
          transition: color 200ms;
        }

        .footer-column a:hover {
          color: #1F6D7A;
        }

        .footer-bottom {
          display: flex;
          justify-content: space-between;
          align-items: center;
          flex-wrap: wrap;
          gap: 24px;
        }

        @media (max-width: 768px) { .footer-bottom { flex-direction: column; align-items: flex-start; } }

        .footer-copyright {
          font-size: 13px;
          color: #6B7280;
        }

        .footer-links {
          display: flex;
          gap: 24px;
          flex-wrap: wrap;
        }

        .footer-links a {
          font-size: 13px;
          color: #6B7280;
          text-decoration: none;
          transition: color 200ms;
        }

        .footer-links a:hover {
          color: #1F6D7A;
        }

        .microcopy {
          font-size: 13px;
          color: #6B7280;
          margin-top: 16px;
        }
      `}</style>

      {/* ================================================================ */}
      {/* HEADER - LOCKED STRUCTURE */}
      {/* ================================================================ */}
      <header className="header">
        <div className="header-content">
          {/* Logo */}
          <Link href="/" className="logo-text">
            <span style={{ fontSize: '16px', fontWeight: '700', color: '#0B1730' }}>RunPayway™</span>
          </Link>

          {/* Navigation */}
          <nav className="nav">
            <Link href="/how-it-works">How It Works</Link>
            <Link href="/methodology">Methodology</Link>
            <Link href="/organizations">Organizations</Link>
            <Link href="/learn">Learn</Link>
            <Link href="/about">About</Link>
          </nav>

          {/* Right CTA */}
          <div className="header-right">
            <Link href="/organizations" className="header-cta">
              Request Enterprise Briefing
              <span>→</span>
            </Link>
          </div>
        </div>
      </header>

      {/* ================================================================ */}
      {/* SECTION 1: HERO */}
      {/* ================================================================ */}
      <section className="section" style={{ paddingTop: '120px', paddingBottom: '80px' }}>
        <h1 className="hero-title">Complex income. Measured consistently.</h1>
        <p className="hero-subheading">
          RunPayway™ is the governed standard for complex-income measurement. It helps organizations measure income structure the same way every time, across teams, systems, policies, and time.
        </p>
        <div>
          <Link href="/organizations" className="cta-button">
            Request Enterprise Briefing
            <span>→</span>
          </Link>
          <Link href="#sample-report" className="cta-button secondary-cta">
            View a Sample Output
          </Link>
        </div>
        <p className="microcopy">
          Governed measurement. Approved rules. Approved outputs published to connected systems.
        </p>
      </section>

      {/* ================================================================ */}
      {/* SECTION 2: WHAT YOU GET */}
      {/* ================================================================ */}
      <section className="section">
        <h2 className="section-title">What RunPayway™ Measures</h2>
        <p className="section-subtitle">RunPayway™ measures the structure behind income, not just the amount. Every measurement produces an approved, external-safe output:</p>

        <div className="four-column-grid">
          <div className="feature-card">
            <div className="feature-label">Structure</div>
            <h3 className="feature-title">Income Structure</h3>
            <p className="feature-description">
              How income is built, how it behaves, and what it depends on, measured under approved rules.
            </p>
          </div>

          <div className="feature-card">
            <div className="feature-label">Classification</div>
            <h3 className="feature-title">Approved Classification</h3>
            <p className="feature-description">
              An external-safe classification of income structure: Stable, Moderate, or Volatile. No public numeric score.
            </p>
          </div>

          <div className="feature-card">
            <div className="feature-label">Consistency</div>
            <h3 className="feature-title">Measured the Same Way Every Time</h3>
            <p className="feature-description">
              The same inputs are measured the same way every time, across teams, systems, policies, and time.
            </p>
          </div>

          <div className="feature-card">
            <div className="feature-label">Provenance</div>
            <h3 className="feature-title">Replayable Output</h3>
            <p className="feature-description">
              Every measurement records the approved rule version used, so past measurements can be replayed and explained.
            </p>
          </div>
        </div>

        <p style={{ marginTop: '40px', fontSize: '15px', color: '#6B7280', lineHeight: '1.6' }}>
          Every output is external-safe by design. RunPayway™ does not issue recommendations or provide financial advice. It measures income structure according to approved rules.
        </p>
      </section>

      {/* ================================================================ */}
      {/* SECTION 3: SAMPLE REPORT PREVIEW */}
      {/* ================================================================ */}
      <section className="section" id="sample-report">
        <h2 className="section-title">Sample RunPayway™ Output</h2>

        <div className="report-preview">
          <div style={{ marginBottom: '24px', paddingBottom: '16px', borderBottom: '1px solid #E5E7EB' }}>
            <p style={{ fontSize: '14px', color: '#6B7280', margin: '0 0 8px 0' }}>EXAMPLE — APPROVED OUTPUT</p>
            <h3 style={{ fontSize: '18px', fontWeight: '600', color: '#0B1730', margin: 0 }}>Commission-Based Income, Measured for a Lending Platform</h3>
          </div>

          <div className="report-section">
            <div className="report-label">Measurement</div>
            <div className="report-content">Income-Structure Classification</div>
          </div>

          <div className="report-section">
            <div className="report-label">Compared With</div>
            <div className="report-content">Income structures built on variable, commission-based sources.</div>
          </div>

          <div className="report-section">
            <div className="report-label">Interpretation</div>
            <div className="report-content">
              This income structure depends heavily on a variable, commission-based source continuing at expected levels. Measured under the approved rules in effect, it shows higher dependence on that single source persisting.
            </div>
          </div>

          <div className="report-section">
            <div className="report-label">Primary Drivers</div>
            <div style={{ marginTop: '8px' }}>
              <div className="decision-item" style={{ marginBottom: '8px' }}>Income depends on variable, commission-based continuation</div>
              <div className="decision-item" style={{ marginBottom: '8px' }}>A single source carries most of the structure</div>
              <div className="decision-item" style={{ marginBottom: '8px' }}>Limited recurring or contracted income sits underneath</div>
              <div className="decision-item">Continuity drops if the primary source pauses</div>
            </div>
          </div>

          <div className="report-section">
            <div className="report-label">Implications</div>
            <div className="report-content">
              Several conditions must hold for this income structure to remain stable. The approved output makes that dependence explicit for the connected system.
            </div>
          </div>

          <div className="report-section" style={{ borderBottom: 'none' }}>
            <div className="report-label">Classification</div>
            <div className="report-content" style={{ fontSize: '16px' }}>Volatile</div>
          </div>
        </div>

        <div style={{ marginTop: '40px', padding: '24px', backgroundColor: '#F9FAFB', borderRadius: '4px', borderLeft: '4px solid #1F6D7A' }}>
          <h4 style={{ fontSize: '15px', fontWeight: '700', color: '#0B1730', marginBottom: '12px' }}>What This Output Shows</h4>
          <div style={{ fontSize: '14px', color: '#6B7280', lineHeight: '1.6' }}>
            <p style={{ margin: '0 0 8px 0' }}>• The classification reflects how dependent this income structure is on its primary source</p>
            <p style={{ margin: '0 0 8px 0' }}>• It is measured under approved rules, the same way every time</p>
            <p style={{ margin: '0 0 8px 0' }}>• The output is external-safe: no internal logic and no numeric score are exposed</p>
            <p style={{ margin: '0 0 8px 0' }}>• Similar variable, commission-based structures typically classify as Volatile</p>
            <p style={{ margin: '0' }}>• The approved output can be published to connected systems</p>
          </div>
        </div>
      </section>

      {/* ================================================================ */}
      {/* SECTION 4: WHY IT MATTERS */}
      {/* ================================================================ */}
      <section className="section">
        <h2 className="section-title">Complex Income Is Measured Differently Everywhere</h2>

        <div style={{ maxWidth: '800px' }}>
          <p style={{ fontSize: '16px', color: '#6B7280', lineHeight: '1.8', marginBottom: '24px' }}>
            Organizations make decisions where income matters. But complex income is rarely measured the same way twice.
          </p>

          <div style={{ background: '#F9FAFB', padding: '24px', borderRadius: '4px', marginBottom: '32px' }}>
            <p style={{ fontSize: '15px', color: '#0B1730', lineHeight: '1.6', margin: '0 0 8px 0' }}>
              One analyst measures it one way.
            </p>
            <p style={{ fontSize: '15px', color: '#0B1730', lineHeight: '1.6', margin: '0 0 8px 0' }}>
              Another team applies a different rule.
            </p>
            <p style={{ fontSize: '15px', color: '#0B1730', lineHeight: '1.6', margin: 0 }}>
              A third system records something else entirely.
            </p>
          </div>

          <p style={{ fontSize: '16px', color: '#6B7280', lineHeight: '1.8', marginBottom: '24px' }}>
            The result is inconsistency across teams, systems, policies, and time. The question that stays unanswered is:
          </p>

          <div style={{ background: '#1F6D7A', padding: '24px', borderRadius: '4px', marginBottom: '32px' }}>
            <p style={{ fontSize: '16px', color: '#FFFFFF', lineHeight: '1.6', margin: 0, fontWeight: '500' }}>
              "How should this income structure be measured, and will it be measured the same way next time?"
            </p>
          </div>

          <p style={{ fontSize: '15px', color: '#6B7280', lineHeight: '1.8', marginBottom: '24px' }}>
            Income may come from business revenue, commissions, contracts, platform payouts, seasonal work, or several sources at once. That is a measurement problem, not a math problem.
          </p>

          <p style={{ fontSize: '15px', color: '#6B7280', lineHeight: '1.8', marginBottom: '24px' }}>
            Today, organizations measure it subjectively, and results drift over time. The same income structure can be measured differently by different teams, systems, and policies.
          </p>

          <p style={{ fontSize: '15px', color: '#0B1730', lineHeight: '1.8', fontWeight: '500' }}>
            RunPayway™ applies approved rules so the same income structure is measured the same way every time. The consistency comes from a governed standard, not subjective judgment.
          </p>
        </div>
      </section>

      {/* ================================================================ */}
      {/* SECTION 5: APPLICATIONS/DECISION TYPES */}
      {/* ================================================================ */}
      <section className="section">
        <h2 className="section-title">What RunPayway™ Measures Across Organizations</h2>
        <p className="section-subtitle">Wherever complex income affects a decision, RunPayway™ measures its structure consistently.</p>

        <div className="decision-carousel">
          <div className="decision-card">
            <h3 className="decision-title">Commission-Based Income</h3>
            <div className="decision-item">How much depends on a single commission source</div>
            <div className="decision-item">Whether recurring income sits underneath</div>
            <div className="decision-item">Continuity if the pipeline slows</div>
            <div className="decision-item">Approved classification for connected systems</div>
            <div className="decision-item">Measured the same way every time</div>
          </div>

          <div className="decision-card">
            <h3 className="decision-title">Multi-Source Income</h3>
            <div className="decision-item">How many sources carry the income</div>
            <div className="decision-item">Concentration in any single source</div>
            <div className="decision-item">How sources behave together under change</div>
            <div className="decision-item">Consistent measurement across teams</div>
            <div className="decision-item">External-safe output for downstream systems</div>
          </div>

          <div className="decision-card">
            <h3 className="decision-title">Contractor & Project-Based Income</h3>
            <div className="decision-item">Dependence on active projects</div>
            <div className="decision-item">Gaps between contracts</div>
            <div className="decision-item">Recurring versus one-time work</div>
            <div className="decision-item">Replayable measurement history</div>
            <div className="decision-item">Approved rules applied every time</div>
          </div>

          <div className="decision-card">
            <h3 className="decision-title">Owner-Dependent Business Income</h3>
            <div className="decision-item">Reliance on the owner's activity</div>
            <div className="decision-item">Revenue continuity if the owner steps back</div>
            <div className="decision-item">Structure beneath headline revenue</div>
            <div className="decision-item">Approved, external-safe output</div>
            <div className="decision-item">One standard across the organization</div>
          </div>

          <div className="decision-card">
            <h3 className="decision-title">Platform & Multi-Client Income</h3>
            <div className="decision-item">Reliance on one client or platform</div>
            <div className="decision-item">Spread across clients</div>
            <div className="decision-item">Onboarding and renewal consistency</div>
            <div className="decision-item">One approved standard across the platform</div>
            <div className="decision-item">Published to connected systems</div>
          </div>

          <div className="decision-card">
            <h3 className="decision-title">Seasonal & Variable Income</h3>
            <div className="decision-item">Month-to-month steadiness</div>
            <div className="decision-item">Peak versus off-peak dependence</div>
            <div className="decision-item">Locked-in versus variable portions</div>
            <div className="decision-item">Measured the same way every time</div>
            <div className="decision-item">Replayable under the approved rule version</div>
          </div>
        </div>
      </section>

      {/* ================================================================ */}
      {/* SECTION 6: PRICING */}
      {/* ================================================================ */}
      <section className="section" style={{ textAlign: 'center' }}>
        <h2 className="section-title">Built for Organizations</h2>
        <p className="section-subtitle">One governed standard, deployed across your teams and connected systems.</p>

        <div style={{
          background: '#FFFFFF',
          border: '1px solid #E5E7EB',
          borderRadius: '4px',
          padding: '48px',
          maxWidth: '480px',
          margin: '40px auto'
        }}>
          <h3 style={{ fontSize: '20px', fontWeight: '600', color: '#0B1730', marginBottom: '16px', margin: '0 0 16px' }}>RunPayway™ for Organizations</h3>
          <p style={{ fontSize: '15px', color: '#6B7280', lineHeight: '1.6', marginBottom: '24px' }}>
            Governed complex-income measurement, approved rules, replayable outputs, and approved outputs published to your connected systems.
          </p>
          <Link href="/organizations" className="cta-button" style={{ width: '100%', justifyContent: 'center' }}>
            Request Enterprise Briefing
          </Link>
          <p className="microcopy" style={{ marginTop: '20px' }}>
            For organizations, platforms, and institutions. We follow up within two business days.
          </p>
        </div>
      </section>

      {/* ================================================================ */}
      {/* SECTION 7: HOW IT WORKS */}
      {/* ================================================================ */}
      <section className="section">
        <h2 className="section-title">How RunPayway™ Works</h2>

        <div className="three-step-grid">
          <div className="step-card">
            <div className="step-number">1</div>
            <h3 className="step-title">Measure Income Structure</h3>
            <p className="step-description">
              RunPayway™ measures the structure behind income, not just the amount, using approved rules applied the same way every time.
            </p>
          </div>

          <div className="step-card">
            <div className="step-number">2</div>
            <h3 className="step-title">Apply Approved Rules</h3>
            <p className="step-description">
              Measurement rules are defined, versioned, and approved before they affect any connected system. Test measurement-rule changes before launch with the Measurement Impact Simulator.
            </p>
          </div>

          <div className="step-card">
            <div className="step-number">3</div>
            <h3 className="step-title">Publish Approved Outputs</h3>
            <p className="step-description">
              RunPayway™ publishes an approved, external-safe output to your connected systems, and preserves it for Measurement Replay.
            </p>
          </div>
        </div>

        <p style={{
          fontSize: '14px',
          color: '#6B7280',
          marginTop: '40px',
          textAlign: 'center'
        }}>
          Approved rules in, approved outputs out. Internal measurement logic stays internal.
        </p>
      </section>

      {/* ================================================================ */}
      {/* SECTION 8: DECISION CHECK™ INTRODUCTION */}
      {/* ================================================================ */}
      <section className="section">
        <h2 className="section-title">RunPayway™ Is the Governed Standard for Complex-Income Measurement</h2>

        <div style={{ maxWidth: '800px', margin: '40px auto' }}>
          <p style={{ fontSize: '15px', color: '#0B1730', lineHeight: '1.8', marginBottom: '24px', fontWeight: '500' }}>
            RunPayway™ is a governed measurement layer for complex income.
          </p>

          <p style={{ fontSize: '15px', color: '#6B7280', lineHeight: '1.8', marginBottom: '24px' }}>
            It measures how income is built, applies approved rules, and publishes approved outputs to connected systems.
          </p>

          <p style={{ fontSize: '16px', color: '#6B7280', lineHeight: '1.8', marginBottom: '24px' }}>
            Complex income is often measured differently across teams, systems, policies, and time. RunPayway™ answers a single governed question:
          </p>

          <div style={{ background: '#F9FAFB', padding: '24px', borderRadius: '4px', marginBottom: '32px', borderLeft: '4px solid #1F6D7A' }}>
            <p style={{ fontSize: '16px', color: '#0B1730', lineHeight: '1.8', margin: 0, fontWeight: '500' }}>
              How should this income structure be measured, and will it be measured the same way every time?
            </p>
          </div>

          <p style={{ fontSize: '15px', color: '#6B7280', lineHeight: '1.8', marginBottom: '24px' }}>
            Think of it like a measurement standard. It does not decide what an organization does with the result. It ensures the measurement itself is consistent, governed, and replayable.
          </p>

          <p style={{ fontSize: '15px', color: '#0B1730', lineHeight: '1.8', fontWeight: '500' }}>
            RunPayway™ does not make the decision. It measures income structure the same way every time, so teams and systems work from one standard.
          </p>
        </div>
      </section>

      {/* ================================================================ */}
      {/* SECTION 9: COMMITMENT PRESSURE™ INTRODUCTION */}
      {/* ================================================================ */}
      <section className="section">
        <h2 className="section-title">Understanding the Income-Structure Classification</h2>
        <p className="section-subtitle">
          Every RunPayway™ output includes an external-safe classification of how dependent an income structure is on the continued strength of its sources.
        </p>

        <div className="commitment-spectrum">
          <div className="commitment-level">
            <div className="commitment-badge">Stable</div>
            <h4 className="commitment-label">Stable</h4>
            <p className="commitment-description">
              Few conditions must hold. The income structure has room to absorb change in its sources.
            </p>
          </div>

          <div className="commitment-level">
            <div className="commitment-badge">Moderate</div>
            <h4 className="commitment-label">Moderate</h4>
            <p className="commitment-description">
              Several conditions must hold. The income structure relies on stability across key sources.
            </p>
          </div>

          <div className="commitment-level">
            <div className="commitment-badge">Volatile</div>
            <h4 className="commitment-label">Volatile</h4>
            <p className="commitment-description">
              Many conditions must hold. The income structure depends heavily on the continued strength of its sources.
            </p>
          </div>
        </div>

        <p style={{
          fontSize: '15px',
          color: '#0B1730',
          marginTop: '40px',
          textAlign: 'center',
          fontWeight: '500'
        }}>
          The classification is external-safe. It is published to connected systems without exposing internal logic or any numeric score.
        </p>
      </section>

      {/* ================================================================ */}
      {/* SECTION 10: WHAT IT IS / IS NOT */}
      {/* ================================================================ */}
      <section className="section">
        <h2 className="section-title">What RunPayway™ Is, and Is Not</h2>

        <div className="what-is-not-grid">
          <div>
            <h3 style={{ fontSize: '18px', fontWeight: '600', color: '#0B1730', marginBottom: '20px' }}>What It Is</h3>
            <div className="what-is-item">
              <div className="what-is-check">✓</div>
              <div className="what-is-text">A governed standard for complex-income measurement</div>
            </div>
            <div className="what-is-item">
              <div className="what-is-check">✓</div>
              <div className="what-is-text">A measurement of income structure, not just income amount</div>
            </div>
            <div className="what-is-item">
              <div className="what-is-check">✓</div>
              <div className="what-is-text">Approved rules, versioned and testable before launch</div>
            </div>
            <div className="what-is-item">
              <div className="what-is-check">✓</div>
              <div className="what-is-text">Replayable measurements with recorded rule versions</div>
            </div>
            <div className="what-is-item">
              <div className="what-is-check">✓</div>
              <div className="what-is-text">External-safe outputs published to connected systems</div>
            </div>
            <div className="what-is-item">
              <div className="what-is-check">✓</div>
              <div className="what-is-text">One standard across teams, systems, policies, and time</div>
            </div>
          </div>

          <div>
            <h3 style={{ fontSize: '18px', fontWeight: '600', color: '#0B1730', marginBottom: '20px' }}>What It Is Not</h3>
            <div className="what-is-item">
              <div className="what-is-check">✗</div>
              <div className="what-is-text">Financial, legal, or investment advice</div>
            </div>
            <div className="what-is-item">
              <div className="what-is-check">✗</div>
              <div className="what-is-text">An eligibility, approval, or underwriting decision</div>
            </div>
            <div className="what-is-item">
              <div className="what-is-check">✗</div>
              <div className="what-is-text">A public stability score or numeric score</div>
            </div>
            <div className="what-is-item">
              <div className="what-is-check">✗</div>
              <div className="what-is-text">A recommendation or safe-or-unsafe judgment</div>
            </div>
            <div className="what-is-item">
              <div className="what-is-check">✗</div>
              <div className="what-is-text">AI decisioning or credit-default prediction</div>
            </div>
            <div className="what-is-item">
              <div className="what-is-check">✗</div>
              <div className="what-is-text">A replacement for institutional policy</div>
            </div>
          </div>
        </div>
      </section>

      {/* ================================================================ */}
      {/* SECTION 11: METHODOLOGY PREVIEW (Optional) */}
      {/* ================================================================ */}
      <section className="section">
        <h2 className="section-title">How the Measurement Works</h2>
        <p className="section-subtitle">
          RunPayway™ uses a governed, versioned framework to measure income structure.
        </p>

        <div className="four-column-grid">
          <div className="feature-card">
            <div className="feature-label">Step 1</div>
            <h3 className="feature-title">Structural Measurement</h3>
            <p className="feature-description">
              RunPayway™ measures how income is built and how it behaves under change.
            </p>
          </div>

          <div className="feature-card">
            <div className="feature-label">Step 2</div>
            <h3 className="feature-title">Approved Rules</h3>
            <p className="feature-description">
              Measurement rules are versioned and approved. Test measurement-rule changes before launch with the Measurement Impact Simulator.
            </p>
          </div>

          <div className="feature-card">
            <div className="feature-label">Step 3</div>
            <h3 className="feature-title">Approved Classification</h3>
            <p className="feature-description">
              The output includes an external-safe classification: Stable, Moderate, or Volatile.
            </p>
          </div>

          <div className="feature-card">
            <div className="feature-label">Step 4</div>
            <h3 className="feature-title">Replay and Publish</h3>
            <p className="feature-description">
              Every measurement is replayable, and approved outputs publish to connected systems.
            </p>
          </div>
        </div>

        <p style={{ marginTop: '40px', fontSize: '15px', color: '#6B7280', lineHeight: '1.6', textAlign: 'center' }}>
          Consistent, governed, and replayable. <Link href="/methodology" style={{ color: '#1F6D7A', textDecoration: 'none', fontWeight: '600' }}>Explore the measurement standard →</Link>
        </p>
      </section>

      {/* ================================================================ */}
      {/* SECTION 12: FINAL CTA */}
      {/* ================================================================ */}
      <section className="section" style={{ textAlign: 'center', paddingBottom: '120px' }}>
        <h2 className="section-title">One Standard for Complex-Income Measurement</h2>
        <p className="section-subtitle" style={{ maxWidth: '600px', margin: '20px auto 40px' }}>
          If income affects the decision, the income structure needs to be measured the same way every time.
        </p>

        <p style={{ fontSize: '16px', color: '#0B1730', lineHeight: '1.8', marginBottom: '40px', fontWeight: '500' }}>
          RunPayway™ does not make eligibility decisions, replace institutional policy, issue recommendations, or provide financial advice. It measures income structure according to approved rules and publishes approved outputs to connected systems.
        </p>

        <Link href="/organizations" className="cta-button" style={{ fontSize: '14px', padding: '16px 40px' }}>
          Request Enterprise Briefing
          <span>→</span>
        </Link>

        <p className="microcopy">
          Governed measurement for organizations, platforms, and institutions.
        </p>
      </section>

      {/* ================================================================ */}
      {/* FOOTER - LOCKED STRUCTURE */}
      {/* ================================================================ */}
      <footer className="footer">
        <div className="footer-content">
          <div className="footer-grid">
            {/* Column 1 - Brand */}
            <div className="footer-column">
              <h3>RunPayway™</h3>
              <p>The governed standard for complex-income measurement.</p>
              <div style={{ marginTop: '12px' }}>
                <p style={{ fontSize: '12px', fontWeight: '700', letterSpacing: '0.08em', textTransform: 'uppercase', color: '#1F6D7A', marginBottom: '8px' }}>
                  Complex-Income Measurement
                </p>
                <p style={{ fontSize: '13px', margin: 0 }}>Measure income structure consistently across teams, systems, policies, and time.</p>
              </div>
              <p style={{ fontSize: '12px', color: '#999', marginTop: '12px' }}>Product of PeopleStar Enterprises Inc.</p>
            </div>

            {/* Column 2 - Product */}
            <div className="footer-column">
              <h3>Product</h3>
              <a href="/organizations">For Organizations</a>
              <a href="/how-it-works">How It Works</a>
              <a href="#sample-report">Sample Output</a>
              <a href="/faq">FAQ</a>
              <a href="/verify">Verify Output</a>
            </div>

            {/* Column 3 - What We Measure */}
            <div className="footer-column">
              <h3>What We Measure</h3>
              <a href="#">Commission-Based Income</a>
              <a href="#">Multi-Source Income</a>
              <a href="#">Contractor Income</a>
              <a href="#">Owner-Dependent Business Income</a>
              <a href="#">Platform & Multi-Client Income</a>
              <a href="#">Seasonal & Variable Income</a>
            </div>

            {/* Column 4 - For */}
            <div className="footer-column">
              <h3>For</h3>
              <a href="/organizations">Organizations</a>
              <a href="#">Platforms</a>
              <a href="#">Enterprise</a>
            </div>

            {/* Column 5 - Standard */}
            <div className="footer-column">
              <h3>Standard</h3>
              <a href="/methodology">Methodology</a>
              <a href="#">Approved Rules</a>
              <a href="#">Measurement Replay</a>
              <a href="/learn">Glossary</a>
            </div>

            {/* Column 6 - Company */}
            <div className="footer-column">
              <h3>Company</h3>
              <a href="/about">About</a>
              <a href="/contact">Contact</a>
              <a href="/accessibility">Accessibility</a>
              <a href="/careers">Careers</a>
              <a href="/press">Press</a>
            </div>

            {/* Column 7 - Legal */}
            <div className="footer-column">
              <h3>Legal</h3>
              <a href="/privacy-policy">Privacy Policy</a>
              <a href="/terms-of-use">Terms of Service</a>
              <a href="/disclaimer">Disclaimer</a>
              <a href="/cookie-policy">Cookie Policy</a>
              <a href="/accessibility">Accessibility Statement</a>
              <a href="/report-use-policy">Report Use Policy</a>
            </div>
          </div>

          {/* Footer Bottom */}
          <div className="footer-bottom">
            <div className="footer-copyright">
              © RunPayway™ • Product of PeopleStar Enterprises Inc.<br />
              The governed standard for complex-income measurement • External-safe outputs<br />
              Accessibility: WCAG 2.1 AA Compliant
            </div>
            <div className="footer-links">
              <a href="/privacy-policy">Privacy</a>
              <a href="/terms-of-use">Terms</a>
              <a href="/accessibility">Accessibility</a>
              <a href="/contact">Contact</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
