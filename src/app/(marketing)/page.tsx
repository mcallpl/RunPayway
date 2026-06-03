'use client';

import React from 'react';
import Image from 'next/image';

const SampleProfile = () => (
  <div style={{
    background: '#FCFCFB',
    border: '1px solid #0B1730',
    padding: '48px',
    borderRadius: '0',
  }}>
    <div style={{
      background: '#0B1730',
      color: '#FCFCFB',
      padding: '24px',
      margin: '-48px -48px 32px -48px',
      fontSize: '14px',
      fontWeight: '600',
    }}>Income Stability Profile™</div>

    <div style={{ paddingBottom: '32px', borderBottom: '1px solid #6A7485', marginBottom: '32px' }}>
      {[
        { name: 'Income Concentration', description: 'Reliance on individual income sources.', score: 82 },
        { name: 'Source Diversity', description: 'Variety of income sources.', score: 76 },
        { name: 'Forward Visibility', description: 'Visibility into future income commitments.', score: 41 },
        { name: 'Stability Pattern', description: 'Consistency of income over time.', score: 68 },
        { name: 'Continuity Strength', description: 'Durability of income relationships.', score: 55 },
        { name: 'Dependency Exposure', description: 'Exposure to key-person or key-source risk.', score: 71 },
      ].map((factor, idx) => (
        <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '32px' }}>
          <div>
            <div style={{ fontSize: '12px', fontWeight: '600', color: '#6A7485', marginBottom: '4px', textTransform: 'uppercase' }}>
              {factor.name}
            </div>
            <div style={{ fontSize: '13px', color: '#6A7485', fontWeight: '400' }}>
              {factor.description}
            </div>
          </div>
          <div style={{ fontSize: '56px', fontWeight: '700', color: '#0B1730', fontFamily: "'IBM Plex Mono', monospace" }}>
            {factor.score}
          </div>
        </div>
      ))}
    </div>

    <div style={{ marginBottom: '24px' }}>
      <h4 style={{ fontSize: '12px', fontWeight: '600', color: '#1B6873', marginBottom: '8px', textTransform: 'uppercase' }}>
        Supporting Drivers™
      </h4>
      <div style={{ fontSize: '13px', color: '#0B1730', lineHeight: '20px' }}>
        <div style={{ marginBottom: '4px' }}>✓ Income Concentration</div>
        <div>✓ Income Diversity</div>
      </div>
      <p style={{ fontSize: '12px', color: '#6A7485', marginTop: '8px', fontWeight: '400' }}>
        Factors currently strengthening Income Stability.
      </p>
    </div>

    <div style={{ marginBottom: '32px' }}>
      <h4 style={{ fontSize: '12px', fontWeight: '600', color: '#0B1730', marginBottom: '8px', textTransform: 'uppercase' }}>
        Stability Pressure Factors™
      </h4>
      <div style={{ fontSize: '13px', color: '#0B1730', lineHeight: '20px' }}>
        <div style={{ marginBottom: '4px' }}>⚠ Forward Visibility</div>
        <div>⚠ Continuity Strength</div>
      </div>
      <p style={{ fontSize: '12px', color: '#6A7485', marginTop: '8px', fontWeight: '400' }}>
        Factors currently creating the greatest stability pressure.
      </p>
    </div>

    <div style={{ paddingTop: '32px', marginTop: '32px', borderTop: '1px solid #6A7485' }}>
      <div style={{ fontSize: '12px', fontWeight: '600', color: '#0B1730', marginBottom: '16px', textTransform: 'uppercase' }}>
        Summary Result
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '32px', fontSize: '12px' }}>
        <div>
          <label style={{ fontSize: '11px', fontWeight: '600', color: '#0B1730', display: 'block', marginBottom: '4px' }}>
            Income Stability Score™
          </label>
          <div style={{ fontSize: '48px', fontWeight: '700', color: '#0B1730', fontFamily: "'IBM Plex Mono', monospace" }}>
            72
          </div>
        </div>
        <div>
          <label style={{ fontSize: '11px', fontWeight: '600', color: '#0B1730', display: 'block', marginBottom: '4px' }}>
            Stability Class™
          </label>
          <div style={{ color: '#0B1730', fontSize: '13px', fontWeight: '500' }}>
            Established Stability™
          </div>
        </div>
        <div>
          <label style={{ fontSize: '11px', fontWeight: '600', color: '#0B1730', display: 'block', marginBottom: '4px' }}>
            Verification ID
          </label>
          <div style={{ color: '#0B1730', fontSize: '13px', fontWeight: '500' }}>
            RP2-2026-00012874
          </div>
        </div>
        <div>
          <label style={{ fontSize: '11px', fontWeight: '600', color: '#0B1730', display: 'block', marginBottom: '4px' }}>
            Status
          </label>
          <div style={{ color: '#1B6873', fontSize: '13px', fontWeight: '500' }}>
            Verified
          </div>
        </div>
      </div>
    </div>
  </div>
);

export default function LandingPage() {
  return (
    <div style={{
      fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
      backgroundColor: '#FCFCFB',
      color: '#0B1730',
    }}>
      <style>{`
        * { margin: 0; padding: 0; box-sizing: border-box; }
        html, body { overflow-x: hidden; }

        .header {
          position: sticky;
          top: 0;
          height: 88px;
          background: #FCFCFB;
          border-bottom: 1px solid #6A7485;
          display: flex;
          align-items: center;
          z-index: 100;
          padding: 0 48px;
        }

        @media (max-width: 768px) {
          .header { padding: 0 24px; height: 72px; }
        }

        .header-container {
          width: 100%;
          max-width: 1600px;
          margin: 0 auto;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .logo { height: 32px; width: auto; }

        .nav { display: flex; gap: 32px; flex: 1; margin-left: 60px; align-items: center; }
        @media (max-width: 768px) { .nav { display: none; } }

        .nav a { font-size: 13px; font-weight: 500; color: #0B1730; text-decoration: none; cursor: pointer; }
        .nav a:hover { color: #6A7485; }

        .header-right { display: flex; gap: 24px; align-items: center; margin-left: auto; }
        .sign-in { font-size: 13px; font-weight: 500; color: #0B1730; text-decoration: none; }
        @media (max-width: 1024px) { .sign-in { display: none; } }

        .btn-primary {
          background: #0B1730;
          color: #FCFCFB;
          border: none;
          padding: 12px 32px;
          border-radius: 6px;
          font-size: 14px;
          font-weight: 600;
          cursor: pointer;
        }
        .btn-primary:hover { background: #1a2a4a; }

        .btn-secondary { background: transparent; color: #0B1730; border: none; font-size: 14px; font-weight: 600; cursor: pointer; padding: 0; }
        .btn-secondary:hover { text-decoration: underline; }

        .hero { padding: 64px 48px; max-width: 1600px; margin: 0 auto; }
        @media (max-width: 768px) { .hero { padding: 48px 24px; } }

        .hero-grid { display: grid; grid-template-columns: 60% 40%; gap: 64px; align-items: flex-start; }
        @media (max-width: 1024px) { .hero-grid { grid-template-columns: 1fr; gap: 48px; } }

        .hero-left h1 { font-size: 72px; font-weight: 700; line-height: 84px; margin-bottom: 32px; color: #0B1730; max-width: 560px; }
        @media (max-width: 768px) { .hero-left h1 { font-size: 44px; line-height: 52px; margin-bottom: 24px; } }

        .hero-left p { font-size: 20px; font-weight: 400; line-height: 32px; margin-bottom: 32px; color: #0B1730; max-width: 560px; }

        .hero-cta { display: flex; flex-direction: column; gap: 16px; margin-bottom: 32px; }
        .hero-cta-trust { font-size: 14px; font-weight: 500; color: #6A7485; }

        .section { padding: 160px 48px; max-width: 1600px; margin: 0 auto; }
        @media (max-width: 768px) { .section { padding: 80px 24px; } }

        .section h2 { font-size: 48px; font-weight: 600; line-height: 56px; margin-bottom: 64px; color: inherit; }
        @media (max-width: 768px) { .section h2 { font-size: 32px; line-height: 40px; margin-bottom: 48px; } }

        .section-white { background: #FCFCFB; color: #0B1730; }
        .section-navy { background: #0B1730; color: #FCFCFB; }

        .comparison-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 48px; margin-bottom: 64px; }
        @media (max-width: 768px) { .comparison-grid { grid-template-columns: 1fr; gap: 40px; } }

        .comparison-column {
          background: #FCFCFB;
          border: 1px solid #0B1730;
          padding: 48px;
        }
        @media (max-width: 768px) { .comparison-column { padding: 36px; } }

        .comparison-label { font-size: 14px; font-weight: 600; color: #6A7485; margin-bottom: 16px; text-transform: uppercase; }
        .comparison-income { font-size: 18px; font-weight: 700; color: #0B1730; margin-bottom: 24px; }

        .comparison-list { list-style: none; margin: 0 0 32px 0; padding: 0; font-size: 16px; color: #0B1730; line-height: 28px; }
        .comparison-list li { margin-bottom: 12px; }

        .comparison-class { font-size: 20px; font-weight: 600; color: #0B1730; margin-top: 32px; padding-top: 32px; border-top: 1px solid #6A7485; }

        .insight-box {
          background: #FCFCFB;
          border: 1px solid #0B1730;
          padding: 48px;
          margin-top: 64px;
        }
        @media (max-width: 768px) { .insight-box { padding: 36px; margin-top: 48px; } }

        .insight-box h3 { font-size: 14px; font-weight: 600; color: #0B1730; margin-bottom: 16px; text-transform: uppercase; }
        .insight-box p { font-size: 20px; font-weight: 400; line-height: 32px; color: #0B1730; margin-bottom: 24px; }

        .nav-items { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 48px; }
        @media (max-width: 768px) { .nav-items { grid-template-columns: 1fr; gap: 32px; } }

        .nav-item h3 { font-size: 20px; font-weight: 600; color: #0B1730; margin-bottom: 12px; }
        .nav-item p { font-size: 16px; color: #0B1730; line-height: 28px; font-weight: 400; }

        .access-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 48px; }
        @media (max-width: 768px) { .access-grid { grid-template-columns: 1fr; gap: 32px; } }

        .access-card {
          background: #FCFCFB;
          border: 1px solid #0B1730;
          padding: 48px;
          display: flex;
          flex-direction: column;
        }
        @media (max-width: 768px) { .access-card { padding: 36px; } }
        .access-card.featured { border: 2px solid #0B1730; }

        .card-title { font-size: 20px; font-weight: 600; color: #0B1730; margin-bottom: 8px; }
        .card-price { font-size: 16px; font-weight: 600; color: #0B1730; margin-bottom: 16px; }
        .card-description { font-size: 14px; color: #0B1730; margin-bottom: 24px; font-weight: 400; }

        .card-includes { font-size: 11px; font-weight: 600; color: #0B1730; text-transform: uppercase; margin-bottom: 12px; }
        .card-list { list-style: none; margin: 0 0 32px 0; padding: 0; font-size: 13px; color: #0B1730; line-height: 20px; flex: 1; }
        .card-list li { margin-bottom: 8px; }

        .card-btn {
          background: #0B1730;
          color: #FCFCFB;
          border: none;
          padding: 16px;
          font-size: 14px;
          font-weight: 600;
          cursor: pointer;
          width: 100%;
        }
        .card-btn:hover { background: #1a2a4a; }

        .consistency-statement { padding: 64px; background: #0B1730; color: #FCFCFB; margin-bottom: 48px; }
        .consistency-statement p { font-size: 18px; font-weight: 400; line-height: 32px; margin-bottom: 24px; }

        .indicator { font-size: 16px; font-weight: 600; color: #1B6873; margin-bottom: 8px; }

        .final-cta { padding: 160px 48px; background: #0B1730; color: #FCFCFB; text-align: center; }
        @media (max-width: 768px) { .final-cta { padding: 80px 24px; } }

        .final-cta h2 { font-size: 48px; font-weight: 600; line-height: 56px; margin-bottom: 32px; }
        .final-cta-subtitle { font-size: 20px; font-weight: 400; line-height: 32px; margin-bottom: 48px; }

        .footer { background: #0B1730; color: #FCFCFB; padding: 160px 48px 64px; }
        @media (max-width: 768px) { .footer { padding: 80px 24px 48px; } }

        .footer-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 96px; max-width: 1600px; margin: 0 auto 96px; }
        @media (max-width: 768px) { .footer-grid { grid-template-columns: repeat(2, 1fr); gap: 48px; margin-bottom: 64px; } }

        .footer-section h4 { font-size: 11px; font-weight: 600; text-transform: uppercase; margin-bottom: 24px; }

        .footer-links { list-style: none; margin: 0; padding: 0; }
        .footer-links li { margin-bottom: 16px; }
        .footer-links a { font-size: 13px; font-weight: 400; color: #FCFCFB; text-decoration: none; }
        .footer-links a:hover { opacity: 0.7; }

        .footer-bottom { max-width: 1600px; margin: 0 auto; padding-top: 64px; border-top: 1px solid rgba(252, 252, 251, 0.1); text-align: center; }
        .footer-bottom p { font-size: 12px; color: rgba(252, 252, 251, 0.7); margin-bottom: 8px; }
      `}</style>

      {/* HEADER */}
      <header className="header">
        <div className="header-container">
          <Image src="/RunPayway_Logo.svg" alt="RunPayway™" width={180} height={40} className="logo" priority />
          <nav className="nav">
            <a href="#how-it-works">How It Works</a>
            <a href="#methodology">Methodology</a>
            <a href="#learn">Learn</a>
            <a href="#solutions">Solutions</a>
          </nav>
          <div className="header-right">
            <a href="/sign-in" className="sign-in">Sign In</a>
            <button className="btn-primary" onClick={() => window.location.href = '/assessment'}>Start Assessment →</button>
          </div>
        </div>
      </header>

      {/* HERO */}
      <section className="hero">
        <div className="hero-grid">
          <div className="hero-left">
            <h1>Before relying on income, know your Income Stability.</h1>
            <p>RunPayway™ measures Income Stability. Income Stability measures the structure supporting income.</p>
            <div className="hero-cta">
              <button className="btn-primary" onClick={() => window.location.href = '/assessment'}>Start Assessment →</button>
              <button className="btn-secondary" onClick={() => window.location.href = '/#'}>See How It Works</button>
            </div>
            <p className="hero-cta-trust">Free structural insight · No documents required · 12 questions · Under 3 minutes</p>
          </div>
          <SampleProfile />
        </div>
      </section>

      {/* SECTION 1: INCOME VS STABILITY */}
      <section className="section section-white">
        <h2>Income and Income Stability are not the same thing.</h2>
        <div className="comparison-grid">
          <div className="comparison-column">
            <p className="comparison-label">Profile A</p>
            <p className="comparison-income">$150,000 Income</p>
            <ul className="comparison-list">
              <li>One primary client</li>
              <li>No recurring agreements</li>
              <li>Income varies month to month</li>
              <li>Income depends on continued activity</li>
            </ul>
            <div className="comparison-class">Developing Stability™</div>
          </div>
          <div className="comparison-column">
            <p className="comparison-label">Profile B</p>
            <p className="comparison-income">$150,000 Income</p>
            <ul className="comparison-list">
              <li>Multiple income sources</li>
              <li>Recurring monthly income</li>
              <li>Lower reliance on any single source</li>
              <li>More consistent income over time</li>
            </ul>
            <div className="comparison-class">Established Stability™</div>
          </div>
        </div>
        <div className="insight-box">
          <h3>Key Insight</h3>
          <p>Two people can earn the same income and have very different levels of Income Stability.</p>
          <p style={{ fontSize: '14px', fontWeight: '600', color: '#5146A8', cursor: 'pointer' }}>See My Income Stability →</p>
        </div>
      </section>

      {/* SECTION 2: COMMON SITUATIONS */}
      <section className="section section-white">
        <h2>Common Situations Where Income Structure Matters</h2>
        <p style={{ fontSize: '20px', fontWeight: '400', lineHeight: '32px', marginBottom: '64px', maxWidth: '760px' }}>
          Two people can earn the same income and face very different levels of stability. Income Stability helps reveal structural differences that income amount alone may not show.
        </p>
        <div className="nav-items">
          <div className="nav-item">
            <h3>Buying a Home</h3>
            <p>A mortgage may last decades. Understanding the stability of the income supporting that commitment may provide additional context before you buy.</p>
          </div>
          <div className="nav-item">
            <h3>Leaving a Job</h3>
            <p>A career change often means replacing one income structure with another. Understanding Income Stability may provide additional context before making that transition.</p>
          </div>
          <div className="nav-item">
            <h3>Starting a Business</h3>
            <p>Many entrepreneurs transition away from existing income sources. Understanding Income Stability may provide additional context before making that change.</p>
          </div>
        </div>
      </section>

      {/* SECTION 3: UNDERSTANDING */}
      <section className="section section-white">
        <h2>The Report Shows What Income Structure You Have</h2>
        <p style={{ fontSize: '20px', fontWeight: '400', lineHeight: '32px', marginBottom: '64px', maxWidth: '760px' }}>
          RunPayway doesn't judge your income or your structure. It measures the stability of what you have.
        </p>
        <div className="nav-items">
          <div className="nav-item">
            <h3>Your Stability Profile</h3>
            <p>Six measurable factors that describe the structure and consistency of your income.</p>
          </div>
          <div className="nav-item">
            <h3>Your Stability Score</h3>
            <p>A single number (0-100) that summarizes your overall Income Stability based on those factors.</p>
          </div>
          <div className="nav-item">
            <h3>Your Stability Class</h3>
            <p>A category that contextualizes your score: Limited, Developing, Established, or High Stability.</p>
          </div>
        </div>
      </section>

      {/* SECTION 4: WHAT RUNPAYWAY MEASURES */}
      <section className="section section-navy">
        <h2 style={{ color: '#FCFCFB', marginBottom: '64px' }}>The Structural Stability Model RP-2.0</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '48px', marginBottom: '64px' }}>
          <div>
            <h3 style={{ fontSize: '20px', fontWeight: '600', color: '#FCFCFB', paddingBottom: '24px', borderBottom: '1px solid rgba(252, 252, 251, 0.2)' }}>
              Income Concentration
            </h3>
            <p style={{ fontSize: '14px', color: '#FCFCFB', lineHeight: '24px', marginTop: '24px' }}>
              The degree to which your income depends on a single source.
            </p>
          </div>
          <div>
            <h3 style={{ fontSize: '20px', fontWeight: '600', color: '#FCFCFB', paddingBottom: '24px', borderBottom: '1px solid rgba(252, 252, 251, 0.2)' }}>
              Source Diversity
            </h3>
            <p style={{ fontSize: '14px', color: '#FCFCFB', lineHeight: '24px', marginTop: '24px' }}>
              The number and composition of your income sources.
            </p>
          </div>
          <div>
            <h3 style={{ fontSize: '20px', fontWeight: '600', color: '#FCFCFB', paddingBottom: '24px', borderBottom: '1px solid rgba(252, 252, 251, 0.2)' }}>
              Forward Visibility
            </h3>
            <p style={{ fontSize: '14px', color: '#FCFCFB', lineHeight: '24px', marginTop: '24px' }}>
              Your ability to forecast income commitments.
            </p>
          </div>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '48px' }}>
          <div>
            <h3 style={{ fontSize: '20px', fontWeight: '600', color: '#FCFCFB', paddingBottom: '24px', borderBottom: '1px solid rgba(252, 252, 251, 0.2)' }}>
              Stability Pattern
            </h3>
            <p style={{ fontSize: '14px', color: '#FCFCFB', lineHeight: '24px', marginTop: '24px' }}>
              The consistency of income over time.
            </p>
          </div>
          <div>
            <h3 style={{ fontSize: '20px', fontWeight: '600', color: '#FCFCFB', paddingBottom: '24px', borderBottom: '1px solid rgba(252, 252, 251, 0.2)' }}>
              Continuity Strength
            </h3>
            <p style={{ fontSize: '14px', color: '#FCFCFB', lineHeight: '24px', marginTop: '24px' }}>
              The durability of your income relationships.
            </p>
          </div>
          <div>
            <h3 style={{ fontSize: '20px', fontWeight: '600', color: '#FCFCFB', paddingBottom: '24px', borderBottom: '1px solid rgba(252, 252, 251, 0.2)' }}>
              Dependency Exposure
            </h3>
            <p style={{ fontSize: '14px', color: '#FCFCFB', lineHeight: '24px', marginTop: '24px' }}>
              Your exposure to key-person or key-source risk.
            </p>
          </div>
        </div>
      </section>

      {/* SECTION 5: ACCESS */}
      <section className="section section-white">
        <h2>How RunPayway Works</h2>
        <p style={{ fontSize: '20px', fontWeight: '400', lineHeight: '32px', marginBottom: '80px', maxWidth: '760px' }}>
          Three levels of detail based on how much you need to know.
        </p>
        <div className="access-grid">
          <div className="access-card">
            <h3 className="card-title">Free Assessment</h3>
            <p className="card-price">$0</p>
            <p className="card-description">Understand your Income Stability right now.</p>
            <div className="card-includes">Includes</div>
            <ul className="card-list">
              <li>12 questions</li>
              <li>Your Stability Score™</li>
              <li>Your Stability Class™</li>
              <li>Your six-factor Profile</li>
            </ul>
            <button className="card-btn">Start Assessment</button>
          </div>

          <div className="access-card featured">
            <h3 className="card-title">Detailed Results</h3>
            <p className="card-price">$15</p>
            <p className="card-description">Get the complete diagnostic breakdown.</p>
            <div className="card-includes">All Free Features +</div>
            <ul className="card-list">
              <li>Profile interpretation</li>
              <li>Pressure factor analysis</li>
              <li>Historical baseline</li>
              <li>Downloadable report</li>
              <li>Verification certificate</li>
            </ul>
            <button className="card-btn">Purchase Results</button>
          </div>

          <div className="access-card">
            <h3 className="card-title">Institutional Analysis</h3>
            <p className="card-price">$50</p>
            <p className="card-description">For advisors and institutions.</p>
            <div className="card-includes">All Results Features +</div>
            <ul className="card-list">
              <li>Advisor-grade briefing</li>
              <li>Comparative analysis</li>
              <li>Integration documentation</li>
              <li>API access</li>
              <li>Priority support</li>
            </ul>
            <button className="card-btn">Request Access</button>
          </div>
        </div>
      </section>

      {/* SECTION 6: SYSTEM PRINCIPLES */}
      <section className="section section-navy">
        <h2 style={{ color: '#FCFCFB', marginBottom: '64px' }}>Built on Institutional Principles</h2>
        <div className="consistency-statement">
          <p>Every assessment is deterministic, immutable, and verifiable.</p>
          <p>The same answers produce the same results. Forever. This is how we build trust.</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginTop: '32px' }}>
            <div style={{ fontSize: '16px', fontWeight: '600', color: '#1B6873' }}>
              ✓ Deterministic: Same input, identical output, every time
            </div>
            <div style={{ fontSize: '16px', fontWeight: '600', color: '#1B6873' }}>
              ✓ Immutable: Once created, assessments never change
            </div>
            <div style={{ fontSize: '16px', fontWeight: '600', color: '#1B6873' }}>
              ✓ Verifiable: Every assessment has a unique verification code
            </div>
          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="final-cta">
        <h2>Know Your Income Stability</h2>
        <p className="final-cta-subtitle">Start your assessment in under 3 minutes.</p>
        <button className="btn-primary" onClick={() => window.location.href = '/assessment'}>Start Assessment →</button>
      </section>

      {/* FOOTER */}
      <footer className="footer">
        <div className="footer-grid">
          <div className="footer-section">
            <h4>Product</h4>
            <ul className="footer-links">
              <li><a href="#assessment">Assessment</a></li>
              <li><a href="#how-it-works">How It Works</a></li>
              <li><a href="#methodology">Methodology</a></li>
              <li><a href="#pricing">Pricing</a></li>
            </ul>
          </div>
          <div className="footer-section">
            <h4>Learn</h4>
            <ul className="footer-links">
              <li><a href="#articles">Articles</a></li>
              <li><a href="#guides">Guides</a></li>
              <li><a href="#research">Research</a></li>
              <li><a href="#definitions">Definitions</a></li>
            </ul>
          </div>
          <div className="footer-section">
            <h4>Solutions</h4>
            <ul className="footer-links">
              <li><a href="#for-advisors">For Advisors</a></li>
              <li><a href="#for-institutions">For Institutions</a></li>
              <li><a href="#api">API</a></li>
              <li><a href="#partners">Partners</a></li>
            </ul>
          </div>
          <div className="footer-section">
            <h4>Company</h4>
            <ul className="footer-links">
              <li><a href="#about">About</a></li>
              <li><a href="#contact">Contact</a></li>
              <li><a href="#privacy">Privacy</a></li>
              <li><a href="#terms">Terms</a></li>
            </ul>
          </div>
        </div>
        <div className="footer-bottom">
          <p>RunPayway™ is a structural income stability measurement system.</p>
          <p>© 2026 RunPayway, Inc. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
