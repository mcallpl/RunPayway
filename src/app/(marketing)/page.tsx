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
          grid-template-columns: repeat(5, 1fr);
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

            <div className="nav-dropdown">
              <a href="#" style={{ cursor: 'pointer' }}>Applications ▼</a>
              <div className="nav-dropdown-content">
                <a href="#">Home Purchase</a>
                <a href="#">Vehicle Purchase</a>
                <a href="#">Career Change</a>
                <a href="#">Retirement</a>
                <a href="#">Business Launch</a>
                <a href="#">Business Acquisition</a>
                <a href="#">Business Expansion</a>
                <a href="#">Employee Hire</a>
                <a href="#">Investment Property</a>
              </div>
            </div>

            <div className="nav-dropdown">
              <a href="#" style={{ cursor: 'pointer' }}>Solutions ▼</a>
              <div className="nav-dropdown-content">
                <a href="/advisors">Advisor</a>
                <a href="/organizations">Organization</a>
                <a href="#">Enterprise</a>
              </div>
            </div>

            <Link href="/methodology">Methodology</Link>
            <Link href="/learn">Learn</Link>
            <Link href="/about">About</Link>
          </nav>

          {/* Right CTA */}
          <div className="header-right">
            <Link href="/begin" className="header-cta">
              Decision Check™
              <span>→</span>
            </Link>
          </div>
        </div>
      </header>

      {/* ================================================================ */}
      {/* SECTION 1: HERO */}
      {/* ================================================================ */}
      <section className="section" style={{ paddingTop: '120px', paddingBottom: '80px' }}>
        <h1 className="hero-title">Know What Your Decision Depends On</h1>
        <p className="hero-subheading">
          Professional assessment of what must continue to go right for your major financial commitment—before you make it.
        </p>
        <div>
          <Link href="/begin" className="cta-button">
            Understand Your Decision Dependencies
            <span>→</span>
          </Link>
          <Link href="#sample-report" className="cta-button secondary-cta">
            View a Sample Report
          </Link>
        </div>
        <p className="microcopy">
          $29 professional assessment. Takes 10 minutes. You'll get your report in 24 hours.
        </p>
      </section>

      {/* ================================================================ */}
      {/* SECTION 2: WHAT YOU GET */}
      {/* ================================================================ */}
      <section className="section">
        <h2 className="section-title">What Your Decision Check™ Report Includes</h2>
        <p className="section-subtitle">When you complete your assessment, you'll receive a professional report showing:</p>

        <div className="four-column-grid">
          <div className="feature-card">
            <div className="feature-label">Dependence</div>
            <h3 className="feature-title">What Your Decision Depends On</h3>
            <p className="feature-description">
              Clear identification of the specific conditions your decision requires to work as expected.
            </p>
          </div>

          <div className="feature-card">
            <div className="feature-label">Classification</div>
            <h3 className="feature-title">Your Dependence Level</h3>
            <p className="feature-description">
              Categorized as Low, Moderate, Elevated, High, or Critical based on how heavily it depends on supporting conditions.
            </p>
          </div>

          <div className="feature-card">
            <div className="feature-label">Comparison</div>
            <h3 className="feature-title">How You Compare</h3>
            <p className="feature-description">
              Shows where you sit relative to the typical range for decisions like yours.
            </p>
          </div>

          <div className="feature-card">
            <div className="feature-label">Understanding</div>
            <h3 className="feature-title">What to Understand Going Forward</h3>
            <p className="feature-description">
              Clear explanation of what the decision relies on and what represents concentrated dependence.
            </p>
          </div>
        </div>

        <p style={{ marginTop: '40px', fontSize: '15px', color: '#6B7280', lineHeight: '1.6' }}>
          The entire report is written in plain language. No jargon. No recommendations. Just clear assessment of what your decision is built on.
        </p>
      </section>

      {/* ================================================================ */}
      {/* SECTION 3: SAMPLE REPORT PREVIEW */}
      {/* ================================================================ */}
      <section className="section" id="sample-report">
        <h2 className="section-title">Sample Decision Check™ Report</h2>

        <div className="report-preview">
          <div style={{ marginBottom: '24px', paddingBottom: '16px', borderBottom: '1px solid #E5E7EB' }}>
            <p style={{ fontSize: '14px', color: '#6B7280', margin: '0 0 8px 0' }}>EXAMPLE</p>
            <h3 style={{ fontSize: '18px', fontWeight: '600', color: '#0B1730', margin: 0 }}>Home Purchase — Jane and Michael</h3>
          </div>

          <div className="report-section">
            <div className="report-label">Measurement</div>
            <div className="report-content">Elevated Commitment Pressure</div>
          </div>

          <div className="report-section">
            <div className="report-label">Position</div>
            <div className="report-content">Higher Than Typical</div>
          </div>

          <div className="report-section">
            <div className="report-label">Compared With</div>
            <div className="report-content">Home purchases supported by employment income with variable commission.</div>
          </div>

          <div className="report-section">
            <div className="report-label">Interpretation</div>
            <div className="report-content">
              This home purchase relies on the continued strength of the structure supporting it. Commission income must persist at expected levels throughout the 30-year mortgage term.
            </div>
          </div>

          <div className="report-section">
            <div className="report-label">Primary Drivers</div>
            <div style={{ marginTop: '8px' }}>
              <div className="decision-item" style={{ marginBottom: '8px' }}>Support depends on variable income continuation (commission-based)</div>
              <div className="decision-item" style={{ marginBottom: '8px' }}>Long-term horizon (30 years) extends dependence on sustained income</div>
              <div className="decision-item" style={{ marginBottom: '8px' }}>Loss of commission income would affect mortgage payment capacity</div>
              <div className="decision-item">Employment income alone insufficient to cover full mortgage obligation</div>
            </div>
          </div>

          <div className="report-section">
            <div className="report-label">Implications</div>
            <div className="report-content">
              Several important things must continue to be true for this home purchase to remain supported.
            </div>
          </div>

          <div className="report-section">
            <div className="report-label">Typical Range</div>
            <div className="report-content">
              Most home purchases supported by employment income with commission fall between Moderate and Elevated Commitment Pressure.
            </div>
          </div>

          <div className="report-section" style={{ borderBottom: 'none' }}>
            <div className="report-label">Technical Classification</div>
            <div className="report-content" style={{ fontSize: '16px', fontFamily: 'monospace' }}>CPE</div>
          </div>
        </div>

        <div style={{ marginTop: '40px', padding: '24px', backgroundColor: '#F9FAFB', borderRadius: '4px', borderLeft: '4px solid #1F6D7A' }}>
          <h4 style={{ fontSize: '15px', fontWeight: '700', color: '#0B1730', marginBottom: '12px' }}>What This Report Shows</h4>
          <div style={{ fontSize: '14px', color: '#6B7280', lineHeight: '1.6' }}>
            <p style={{ margin: '0 0 8px 0' }}>• If commission continues as expected, the decision remains supported</p>
            <p style={{ margin: '0 0 8px 0' }}>• The decision depends on continued commission income at current levels</p>
            <p style={{ margin: '0 0 8px 0' }}>• If commission stops, the decision would lack adequate support</p>
            <p style={{ margin: '0 0 8px 0' }}>• Similar situations with commission-based income typically show Elevated Commitment Pressure</p>
            <p style={{ margin: '0' }}>• Commission income stability is what this decision relies on most heavily</p>
          </div>
        </div>
      </section>

      {/* ================================================================ */}
      {/* SECTION 4: WHY IT MATTERS */}
      {/* ================================================================ */}
      <section className="section">
        <h2 className="section-title">Before a Major Decision, Know What It Depends On</h2>

        <div style={{ maxWidth: '800px' }}>
          <p style={{ fontSize: '16px', color: '#6B7280', lineHeight: '1.8', marginBottom: '24px' }}>
            Most people think about financial decisions in terms of affordability.
          </p>

          <div style={{ background: '#F9FAFB', padding: '24px', borderRadius: '4px', marginBottom: '32px' }}>
            <p style={{ fontSize: '15px', color: '#0B1730', lineHeight: '1.6', margin: '0 0 8px 0' }}>
              "Can I afford the monthly payment?"
            </p>
            <p style={{ fontSize: '15px', color: '#0B1730', lineHeight: '1.6', margin: '0 0 8px 0' }}>
              "Do I have enough savings?"
            </p>
            <p style={{ fontSize: '15px', color: '#0B1730', lineHeight: '1.6', margin: 0 }}>
              "Is my income sufficient?"
            </p>
          </div>

          <p style={{ fontSize: '16px', color: '#6B7280', lineHeight: '1.8', marginBottom: '24px' }}>
            But there's another question that matters equally:
          </p>

          <div style={{ background: '#1F6D7A', padding: '24px', borderRadius: '4px', marginBottom: '32px' }}>
            <p style={{ fontSize: '16px', color: '#FFFFFF', lineHeight: '1.6', margin: 0, fontWeight: '500' }}>
              "What must continue to go right for this decision to work?"
            </p>
          </div>

          <p style={{ fontSize: '15px', color: '#6B7280', lineHeight: '1.8', marginBottom: '24px' }}>
            A $300,000 home purchase seems affordable. But what if your income drops 30%? What if you need extended leave? What if your partner's income changes?
          </p>

          <p style={{ fontSize: '15px', color: '#6B7280', lineHeight: '1.8', marginBottom: '24px' }}>
            Professional decision-makers—financial advisors, business owners, investors—always evaluate this question. They just do it subjectively, based on experience.
          </p>

          <p style={{ fontSize: '15px', color: '#0B1730', lineHeight: '1.8', fontWeight: '500' }}>
            Decision Check™ systematizes that evaluation. So you get the same clarity professionals rely on.
          </p>
        </div>
      </section>

      {/* ================================================================ */}
      {/* SECTION 5: APPLICATIONS/DECISION TYPES */}
      {/* ================================================================ */}
      <section className="section">
        <h2 className="section-title">What Might Your Decision Depend On?</h2>
        <p className="section-subtitle">These are conditions different decisions require. That's what we measure.</p>

        <div className="decision-carousel">
          <div className="decision-card">
            <h3 className="decision-title">Buying a Home</h3>
            <div className="decision-item">Sustained income to cover mortgage payments</div>
            <div className="decision-item">Stability in your employment or business</div>
            <div className="decision-item">Absence of major unexpected expenses</div>
            <div className="decision-item">Continued access to credit/refinancing</div>
            <div className="decision-item">Stability in property value (for equity)</div>
          </div>

          <div className="decision-card">
            <h3 className="decision-title">Changing Careers</h3>
            <div className="decision-item">Sufficient savings to cover the transition period</div>
            <div className="decision-item">Ability to find work in the new field</div>
            <div className="decision-item">Income stability during the transition</div>
            <div className="decision-item">Support from family/dependents</div>
            <div className="decision-item">Timeline flexibility for the transition</div>
          </div>

          <div className="decision-card">
            <h3 className="decision-title">Retiring</h3>
            <div className="decision-item">Sustained income (pension, portfolio, Social Security)</div>
            <div className="decision-item">Stability of income sources over 30-40 years</div>
            <div className="decision-item">No major unexpected expenses</div>
            <div className="decision-item">Health and longevity as expected</div>
            <div className="decision-item">No major market disruptions</div>
          </div>

          <div className="decision-card">
            <h3 className="decision-title">Launching a Business</h3>
            <div className="decision-item">Runway to cover personal expenses during startup phase</div>
            <div className="decision-item">Time to customer acquisition and revenue</div>
            <div className="decision-item">Ability to sustain on reduced income temporarily</div>
            <div className="decision-item">Support from family/dependents</div>
            <div className="decision-item">Market timing and customer demand</div>
          </div>

          <div className="decision-card">
            <h3 className="decision-title">Acquiring a Business</h3>
            <div className="decision-item">Client/revenue retention during integration</div>
            <div className="decision-item">Ability to service acquisition debt</div>
            <div className="decision-item">Continued market demand for acquired business</div>
            <div className="decision-item">Success of integration and operations</div>
            <div className="decision-item">No major surprises in business operations</div>
          </div>

          <div className="decision-card">
            <h3 className="decision-title">Investment Property</h3>
            <div className="decision-item">Rental income at projected levels</div>
            <div className="decision-item">Tenant retention and occupancy rates</div>
            <div className="decision-item">No major property damage or repairs</div>
            <div className="decision-item">Real estate market stability</div>
            <div className="decision-item">Ability to cover gaps if vacancy occurs</div>
          </div>
        </div>
      </section>

      {/* ================================================================ */}
      {/* SECTION 6: PRICING */}
      {/* ================================================================ */}
      <section className="section" style={{ textAlign: 'center' }}>
        <h2 className="section-title">Simple Pricing</h2>
        <p className="section-subtitle">One Product. One Price. One Standard.</p>

        <div style={{
          background: '#FFFFFF',
          border: '1px solid #E5E7EB',
          borderRadius: '4px',
          padding: '48px',
          maxWidth: '400px',
          margin: '40px auto'
        }}>
          <div style={{ fontSize: '48px', fontWeight: '700', color: '#0B1730', marginBottom: '8px' }}>$29</div>
          <h3 style={{ fontSize: '18px', fontWeight: '600', color: '#0B1730', marginBottom: '16px', margin: '16px 0' }}>Decision Check™</h3>
          <p style={{ fontSize: '15px', color: '#6B7280', lineHeight: '1.6', marginBottom: '24px' }}>
            One-time standardized professional assessment
          </p>
          <Link href="/begin" className="cta-button" style={{ width: '100%', justifyContent: 'center' }}>
            Get Your Report
          </Link>
          <p className="microcopy" style={{ marginTop: '20px' }}>
            Takes 10 minutes. Report delivered in 24 hours.
          </p>
        </div>
      </section>

      {/* ================================================================ */}
      {/* SECTION 7: HOW IT WORKS */}
      {/* ================================================================ */}
      <section className="section">
        <h2 className="section-title">Three Simple Steps</h2>

        <div className="three-step-grid">
          <div className="step-card">
            <div className="step-number">1</div>
            <h3 className="step-title">Choose Your Decision</h3>
            <p className="step-description">
              Select the financial decision you're evaluating: buying a home, changing careers, retiring, launching a business, or another major commitment.
            </p>
          </div>

          <div className="step-card">
            <div className="step-number">2</div>
            <h3 className="step-title">Answer Structured Questions</h3>
            <p className="step-description">
              You'll answer straightforward questions about your situation: income sources, savings, timeline, and what conditions your decision requires.
            </p>
          </div>

          <div className="step-card">
            <div className="step-number">3</div>
            <h3 className="step-title">Receive Your Report</h3>
            <p className="step-description">
              Within 24 hours, you'll receive your Decision Check™ report with professional assessment and clear explanation of what your decision depends on.
            </p>
          </div>
        </div>

        <p style={{
          fontSize: '14px',
          color: '#6B7280',
          marginTop: '40px',
          textAlign: 'center'
        }}>
          Takes about 10 minutes. All your information stays private and encrypted.
        </p>
      </section>

      {/* ================================================================ */}
      {/* SECTION 8: DECISION CHECK™ INTRODUCTION */}
      {/* ================================================================ */}
      <section className="section">
        <h2 className="section-title">Decision Check™ Is Your Professional Assessment</h2>

        <div style={{ maxWidth: '800px', margin: '40px auto' }}>
          <p style={{ fontSize: '16px', color: '#6B7280', lineHeight: '1.8', marginBottom: '24px' }}>
            Decision Check™ is a professional assessment that answers one simple question:
          </p>

          <div style={{ background: '#F9FAFB', padding: '24px', borderRadius: '4px', marginBottom: '32px', borderLeft: '4px solid #1F6D7A' }}>
            <p style={{ fontSize: '16px', color: '#0B1730', lineHeight: '1.8', margin: 0, fontWeight: '500' }}>
              How much does my major financial decision depend on supporting conditions remaining intact?
            </p>
          </div>

          <p style={{ fontSize: '15px', color: '#6B7280', lineHeight: '1.8', marginBottom: '24px' }}>
            When you complete your assessment, you get a standardized report that shows what your decision is built on, how typical your situation is, and what you need to understand going forward.
          </p>

          <p style={{ fontSize: '15px', color: '#6B7280', lineHeight: '1.8', marginBottom: '24px' }}>
            Think of it like a home inspection. An inspection doesn't tell you whether to buy the house. It tells you what the house is built on and what condition it's in. You decide what to do with that information.
          </p>

          <p style={{ fontSize: '15px', color: '#0B1730', lineHeight: '1.8', fontWeight: '500' }}>
            Decision Check™ works the same way. It doesn't recommend yes or no. It shows you what your decision is built on so you can decide confidently.
          </p>
        </div>
      </section>

      {/* ================================================================ */}
      {/* SECTION 9: COMMITMENT PRESSURE™ INTRODUCTION */}
      {/* ================================================================ */}
      <section className="section">
        <h2 className="section-title">Understanding Your Commitment Pressure™ Classification</h2>
        <p className="section-subtitle">
          Every Decision Check™ report includes a Commitment Pressure™ classification that measures how much your financial decision depends on specific conditions continuing to happen.
        </p>

        <div className="commitment-spectrum">
          <div className="commitment-level">
            <div className="commitment-badge">CPL</div>
            <h4 className="commitment-label">Low Commitment Pressure</h4>
            <p className="commitment-description">
              Few important things must continue to go right. Your decision has flexibility to absorb change.
            </p>
          </div>

          <div className="commitment-level">
            <div className="commitment-badge">CPM</div>
            <h4 className="commitment-label">Moderate Commitment Pressure</h4>
            <p className="commitment-description">
              Several things must continue to go right. Your decision requires stability in key areas but has some flexibility.
            </p>
          </div>

          <div className="commitment-level">
            <div className="commitment-badge">CPE</div>
            <h4 className="commitment-label">Elevated Commitment Pressure</h4>
            <p className="commitment-description">
              Several important things must continue to go right. Your decision requires more stability and has limited flexibility.
            </p>
          </div>

          <div className="commitment-level">
            <div className="commitment-badge">CPH</div>
            <h4 className="commitment-label">High Commitment Pressure</h4>
            <p className="commitment-description">
              Many important things must continue to go right. Your decision is dependent on sustained stability across multiple areas.
            </p>
          </div>

          <div className="commitment-level">
            <div className="commitment-badge">CPC</div>
            <h4 className="commitment-label">Critical Commitment Pressure</h4>
            <p className="commitment-description">
              Most key things must continue to go right. Your decision has minimal flexibility and depends on nearly everything staying the same.
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
          Your classification shows you where you sit—and what you actually depend on.
        </p>
      </section>

      {/* ================================================================ */}
      {/* SECTION 10: WHAT IT IS / IS NOT */}
      {/* ================================================================ */}
      <section className="section">
        <h2 className="section-title">What Decision Check™ Actually Is</h2>

        <div className="what-is-not-grid">
          <div>
            <h3 style={{ fontSize: '18px', fontWeight: '600', color: '#0B1730', marginBottom: '20px' }}>What It Is</h3>
            <div className="what-is-item">
              <div className="what-is-check">✓</div>
              <div className="what-is-text">Professional assessment of what your decision depends on</div>
            </div>
            <div className="what-is-item">
              <div className="what-is-check">✓</div>
              <div className="what-is-text">Standardized measurement of decision dependencies</div>
            </div>
            <div className="what-is-item">
              <div className="what-is-check">✓</div>
              <div className="what-is-text">Plain-language report showing your situation's structure</div>
            </div>
            <div className="what-is-item">
              <div className="what-is-check">✓</div>
              <div className="what-is-text">Comparison to typical situations like yours</div>
            </div>
            <div className="what-is-item">
              <div className="what-is-check">✓</div>
              <div className="what-is-text">Classification of your decision's dependence level</div>
            </div>
            <div className="what-is-item">
              <div className="what-is-check">✓</div>
              <div className="what-is-text">Professional clarity before commitment</div>
            </div>
          </div>

          <div>
            <h3 style={{ fontSize: '18px', fontWeight: '600', color: '#0B1730', marginBottom: '20px' }}>What It Is Not</h3>
            <div className="what-is-item">
              <div className="what-is-check">✗</div>
              <div className="what-is-text">Financial advice ("you should do this")</div>
            </div>
            <div className="what-is-item">
              <div className="what-is-check">✗</div>
              <div className="what-is-text">Affordability approval or denial</div>
            </div>
            <div className="what-is-item">
              <div className="what-is-check">✗</div>
              <div className="what-is-text">Risk scoring or prediction</div>
            </div>
            <div className="what-is-item">
              <div className="what-is-check">✗</div>
              <div className="what-is-text">Credit score or credit assessment</div>
            </div>
            <div className="what-is-item">
              <div className="what-is-check">✗</div>
              <div className="what-is-text">AI insights or algorithmic recommendation</div>
            </div>
            <div className="what-is-item">
              <div className="what-is-check">✗</div>
              <div className="what-is-text">Budgeting or expense tracking</div>
            </div>
          </div>
        </div>
      </section>

      {/* ================================================================ */}
      {/* SECTION 11: METHODOLOGY PREVIEW (Optional) */}
      {/* ================================================================ */}
      <section className="section">
        <h2 className="section-title">How This Measurement Works</h2>
        <p className="section-subtitle">
          Decision Check™ uses a systematic framework to evaluate decision dependencies.
        </p>

        <div className="four-column-grid">
          <div className="feature-card">
            <div className="feature-label">Step 1</div>
            <h3 className="feature-title">Structural Analysis</h3>
            <p className="feature-description">
              We analyze your specific situation against your decision type to identify supporting conditions.
            </p>
          </div>

          <div className="feature-card">
            <div className="feature-label">Step 2</div>
            <h3 className="feature-title">Comparison Framework</h3>
            <p className="feature-description">
              We compare your situation to the typical range for similar decisions in your category.
            </p>
          </div>

          <div className="feature-card">
            <div className="feature-label">Step 3</div>
            <h3 className="feature-title">Dependence Classification</h3>
            <p className="feature-description">
              We classify your dependence level using the Commitment Pressure™ scale (Low to Critical).
            </p>
          </div>

          <div className="feature-card">
            <div className="feature-label">Step 4</div>
            <h3 className="feature-title">Clear Reporting</h3>
            <p className="feature-description">
              We generate a clear, standardized report showing what you depend on and what that means.
            </p>
          </div>
        </div>

        <p style={{ marginTop: '40px', fontSize: '15px', color: '#6B7280', lineHeight: '1.6', textAlign: 'center' }}>
          This approach is consistent, comparable, and transparent. <Link href="/methodology" style={{ color: '#1F6D7A', textDecoration: 'none', fontWeight: '600' }}>Learn more about our methodology →</Link>
        </p>
      </section>

      {/* ================================================================ */}
      {/* SECTION 12: FINAL CTA */}
      {/* ================================================================ */}
      <section className="section" style={{ textAlign: 'center', paddingBottom: '120px' }}>
        <h2 className="section-title">Before You Commit, Get Clarity</h2>
        <p className="section-subtitle" style={{ maxWidth: '600px', margin: '20px auto 40px' }}>
          Your major financial decision deserves professional assessment of what it depends on.
        </p>

        <p style={{ fontSize: '16px', color: '#0B1730', lineHeight: '1.8', marginBottom: '40px', fontWeight: '500' }}>
          Not advice. Not approval. Just clear understanding of what your decision is built on.
        </p>

        <Link href="/begin" className="cta-button" style={{ fontSize: '14px', padding: '16px 40px' }}>
          Get Your Decision Check™ Report
          <span>→</span>
        </Link>

        <p className="microcopy">
          Takes 10 minutes. Report delivered in 24 hours.<br />Used by financial advisors and professionals.
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
              <p>Measure what must continue to go right.</p>
              <p style={{ fontSize: '13px', marginTop: '12px' }}>Standardized measurement of how heavily financial decisions depend on supporting conditions remaining intact.</p>
              <p style={{ fontSize: '12px', color: '#999', marginTop: '12px' }}>Product of PeopleStar Enterprises Inc.</p>
            </div>

            {/* Column 2 - Product */}
            <div className="footer-column">
              <h3>Product</h3>
              <a href="/begin">Decision Check™</a>
              <a href="/how-it-works">How It Works</a>
              <a href="#sample-report">Sample Report</a>
              <a href="/pricing">Pricing</a>
              <a href="/faq">FAQ</a>
              <a href="/verify">Verify Report</a>
            </div>

            {/* Column 3 - Applications */}
            <div className="footer-column">
              <h3>Applications</h3>
              <a href="#">Home Purchase</a>
              <a href="#">Vehicle Purchase</a>
              <a href="#">Career Change</a>
              <a href="#">Retirement</a>
              <a href="#">Business Launch</a>
              <a href="#">Business Acquisition</a>
              <a href="#">Business Expansion</a>
              <a href="#">Employee Hire</a>
              <a href="#">Investment Property</a>
            </div>

            {/* Column 4 - Solutions */}
            <div className="footer-column">
              <h3>Solutions</h3>
              <a href="/advisors">Advisor</a>
              <a href="/organizations">Organization</a>
              <a href="#">Enterprise</a>
            </div>

            {/* Column 5 - Methodology */}
            <div className="footer-column">
              <h3>Methodology</h3>
              <a href="/methodology">Methodology</a>
              <a href="/methodology#commitment-pressure">Commitment Pressure™</a>
              <a href="/methodology#decision-check">Decision Check™</a>
              <a href="/methodology#typical-range">Typical Range™</a>
              <a href="/methodology#compared-with">Compared With™</a>
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
              Decision Check™ Report Standard™ • Commitment Pressure Classification™<br />
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
