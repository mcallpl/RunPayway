'use client';

import React from 'react';
import Image from 'next/image';

export default function LandingPage() {
  return (
    <div style={{ fontFamily: "'Inter Variable', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif", backgroundColor: '#FCFCFB', color: '#0B1730' }}>
      <style>{`
        * { margin: 0; padding: 0; box-sizing: border-box; }
        html, body { overflow-x: hidden; }

        /* HEADER - 88px */
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

        @media (max-width: 1024px) {
          .header { padding: 0 32px; }
        }

        @media (max-width: 768px) {
          .header { padding: 0 24px; height: 72px; }
        }

        .header-content {
          width: 100%;
          max-width: 1600px;
          margin: 0 auto;
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 48px;
        }

        .logo { height: 32px; width: auto; flex-shrink: 0; }

        .nav {
          display: flex;
          gap: 48px;
          align-items: center;
          flex: 1;
          margin: 0 auto;
          justify-content: center;
        }

        @media (max-width: 1024px) {
          .nav { gap: 32px; }
        }

        @media (max-width: 768px) {
          .nav { display: none; }
        }

        .nav a {
          font-size: 14px;
          font-weight: 500;
          color: #0B1730;
          text-decoration: none;
          cursor: pointer;
        }

        .nav a:hover { color: #6A7485; }

        .header-right {
          display: flex;
          gap: 24px;
          align-items: center;
          flex-shrink: 0;
        }

        .sign-in {
          font-size: 14px;
          font-weight: 500;
          color: #0B1730;
          text-decoration: none;
        }

        @media (max-width: 768px) {
          .sign-in { display: none; }
        }

        .btn {
          background: #0B1730;
          color: #FCFCFB;
          border: none;
          padding: 12px 28px;
          border-radius: 6px;
          font-size: 14px;
          font-weight: 600;
          cursor: pointer;
          text-decoration: none;
          display: inline-flex;
          align-items: center;
        }

        .btn:hover { background: #1a2a4a; }

        /* HERO - 60/40 layout */
        .hero {
          padding: 80px 48px;
          max-width: 1600px;
          margin: 0 auto;
        }

        @media (max-width: 1024px) {
          .hero { padding: 64px 48px; }
        }

        @media (max-width: 768px) {
          .hero { padding: 48px 24px; }
        }

        .hero-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 80px;
          align-items: flex-start;
        }

        @media (max-width: 1024px) {
          .hero-grid { gap: 64px; }
        }

        @media (max-width: 768px) {
          .hero-grid { grid-template-columns: 1fr; gap: 48px; }
        }

        .hero-left h1 {
          font-size: 72px;
          font-weight: 700;
          line-height: 84px;
          margin-bottom: 32px;
          color: #0B1730;
          max-width: 560px;
        }

        @media (max-width: 768px) {
          .hero-left h1 { font-size: 48px; line-height: 56px; margin-bottom: 24px; }
        }

        .hero-left p {
          font-size: 20px;
          font-weight: 400;
          line-height: 32px;
          margin-bottom: 32px;
          color: #0B1730;
          max-width: 560px;
        }

        .cta-group {
          display: flex;
          flex-direction: column;
          gap: 16px;
          margin-bottom: 32px;
        }

        .trust-line {
          font-size: 14px;
          font-weight: 500;
          color: #6A7485;
        }

        /* REPORT CARD */
        .report {
          background: #FCFCFB;
          border: 1px solid #0B1730;
          padding: 48px;
        }

        @media (max-width: 768px) {
          .report { padding: 36px; }
        }

        .report-header {
          background: #0B1730;
          color: #FCFCFB;
          padding: 20px 24px;
          margin: -48px -48px 32px -48px;
          font-size: 13px;
          font-weight: 600;
          letter-spacing: 0.5px;
          text-transform: uppercase;
        }

        @media (max-width: 768px) {
          .report-header { margin: -36px -36px 24px -36px; padding: 16px 20px; }
        }

        .report-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 32px;
          margin-bottom: 48px;
        }

        @media (max-width: 768px) {
          .report-grid { grid-template-columns: 1fr; gap: 24px; }
        }

        .report-factor {
          padding-bottom: 24px;
          border-bottom: 1px solid #6A7485;
        }

        .report-factor:last-child { border-bottom: none; padding-bottom: 0; }

        .report-factor-name {
          font-size: 16px;
          font-weight: 600;
          color: #0B1730;
          margin-bottom: 4px;
        }

        .report-factor-desc {
          font-size: 13px;
          color: #6A7485;
          font-weight: 400;
          margin-bottom: 16px;
        }

        .report-factor-score {
          font-size: 56px;
          font-weight: 700;
          color: #0B1730;
          font-family: 'IBM Plex Mono', monospace;
        }

        .report-section {
          padding-bottom: 32px;
          margin-bottom: 32px;
          border-bottom: 1px solid #6A7485;
        }

        .report-section:last-child { border-bottom: none; padding-bottom: 0; margin-bottom: 0; }

        .section-title {
          font-size: 12px;
          font-weight: 600;
          color: #0B1730;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          margin-bottom: 16px;
        }

        .section-list {
          display: flex;
          flex-direction: column;
          gap: 8px;
          font-size: 13px;
          margin-bottom: 12px;
        }

        .section-list li {
          color: #0B1730;
          list-style: none;
        }

        .section-list.teal li {
          color: #1B6873;
        }

        .section-desc {
          font-size: 12px;
          color: #6A7485;
          font-weight: 400;
        }

        .summary-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 32px;
          font-size: 12px;
        }

        @media (max-width: 768px) {
          .summary-grid { grid-template-columns: 1fr; gap: 24px; }
        }

        .summary-item label {
          font-size: 11px;
          font-weight: 600;
          color: #0B1730;
          text-transform: uppercase;
          display: block;
          margin-bottom: 4px;
        }

        .summary-item {
          color: #6A7485;
        }

        .summary-score {
          font-size: 48px;
          font-weight: 700;
          color: #0B1730;
          font-family: 'IBM Plex Mono', monospace;
          margin-bottom: 4px;
        }

        /* SECTIONS */
        .section {
          padding: 160px 48px;
          max-width: 1600px;
          margin: 0 auto;
        }

        @media (max-width: 1024px) {
          .section { padding: 120px 48px; }
        }

        @media (max-width: 768px) {
          .section { padding: 80px 24px; }
        }

        .section h2 {
          font-size: 48px;
          font-weight: 600;
          line-height: 56px;
          margin-bottom: 64px;
          color: inherit;
        }

        @media (max-width: 768px) {
          .section h2 { font-size: 36px; line-height: 44px; margin-bottom: 48px; }
        }

        .section-white { background: #FCFCFB; color: #0B1730; }
        .section-navy { background: #0B1730; color: #FCFCFB; }

        .intro-text {
          font-size: 20px;
          font-weight: 400;
          line-height: 32px;
          margin-bottom: 64px;
          max-width: 760px;
          color: inherit;
        }

        /* COMPARISON */
        .comparison-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 48px;
          margin-bottom: 64px;
        }

        @media (max-width: 768px) {
          .comparison-grid { grid-template-columns: 1fr; gap: 40px; }
        }

        .profile-card {
          background: #FCFCFB;
          border: 1px solid #0B1730;
          padding: 48px;
        }

        @media (max-width: 768px) {
          .profile-card { padding: 36px; }
        }

        .profile-label {
          font-size: 13px;
          font-weight: 600;
          color: #6A7485;
          text-transform: uppercase;
          margin-bottom: 12px;
          letter-spacing: 0.5px;
        }

        .profile-income {
          font-size: 20px;
          font-weight: 700;
          color: #0B1730;
          margin-bottom: 24px;
        }

        .profile-list {
          list-style: none;
          margin: 0 0 32px 0;
          padding: 0;
          font-size: 16px;
          color: #0B1730;
          line-height: 28px;
        }

        .profile-list li {
          margin-bottom: 12px;
        }

        .profile-class {
          font-size: 20px;
          font-weight: 600;
          color: #0B1730;
          margin-top: 32px;
          padding-top: 32px;
          border-top: 1px solid #6A7485;
        }

        .insight-box {
          background: #FCFCFB;
          border: 1px solid #0B1730;
          padding: 48px;
          margin-top: 64px;
        }

        @media (max-width: 768px) {
          .insight-box { padding: 36px; margin-top: 48px; }
        }

        .insight-box h3 {
          font-size: 14px;
          font-weight: 600;
          color: #0B1730;
          margin-bottom: 16px;
          text-transform: uppercase;
        }

        .insight-box p {
          font-size: 18px;
          font-weight: 400;
          line-height: 28px;
          color: #0B1730;
          margin-bottom: 16px;
        }

        .insight-box p:last-child { margin-bottom: 0; }

        .insight-cta {
          font-size: 14px;
          font-weight: 600;
          color: #5146A8;
          cursor: pointer;
          margin-top: 24px;
        }

        /* THREE COLUMN */
        .three-col {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 48px;
          margin-bottom: 0;
        }

        @media (max-width: 1024px) {
          .three-col { grid-template-columns: repeat(2, 1fr); gap: 40px; }
        }

        @media (max-width: 768px) {
          .three-col { grid-template-columns: 1fr; gap: 32px; }
        }

        .col-item h3 {
          font-size: 20px;
          font-weight: 600;
          color: inherit;
          margin-bottom: 12px;
        }

        .col-item p {
          font-size: 16px;
          font-weight: 400;
          line-height: 28px;
          color: inherit;
        }

        /* SAMPLE PROFILE SECTION */
        .sample-profile {
          background: #FCFCFB;
          border: 2px solid #0B1730;
          padding: 64px;
          margin-bottom: 0;
        }

        @media (max-width: 768px) {
          .sample-profile { padding: 48px; }
        }

        .sample-score {
          font-size: 72px;
          font-weight: 700;
          color: #0B1730;
          font-family: 'IBM Plex Mono', monospace;
          margin-bottom: 8px;
        }

        .sample-class {
          font-size: 28px;
          font-weight: 600;
          color: #0B1730;
          margin-bottom: 48px;
          padding-bottom: 48px;
          border-bottom: 1px solid #6A7485;
        }

        .factor-box {
          padding-bottom: 24px;
          border-bottom: 1px solid #6A7485;
          margin-bottom: 24px;
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
        }

        .factor-box:last-child { border-bottom: none; }

        .factor-info h4 {
          font-size: 16px;
          font-weight: 600;
          color: #0B1730;
          margin-bottom: 4px;
        }

        .factor-info p {
          font-size: 13px;
          color: #6A7485;
          font-weight: 400;
        }

        .factor-score-large {
          font-size: 48px;
          font-weight: 700;
          color: #0B1730;
          font-family: 'IBM Plex Mono', monospace;
          text-align: right;
        }

        /* EXPLANATION BOXES */
        .explanation {
          background: #FCFCFB;
          border: 1px solid #6A7485;
          padding: 32px;
          margin-bottom: 32px;
        }

        @media (max-width: 768px) {
          .explanation { padding: 24px; }
        }

        .explanation h4 {
          font-size: 14px;
          font-weight: 600;
          color: #0B1730;
          text-transform: uppercase;
          margin-bottom: 12px;
          letter-spacing: 0.5px;
        }

        .explanation p {
          font-size: 14px;
          color: #0B1730;
          line-height: 24px;
          font-weight: 400;
        }

        .explanation p:not(:last-child) { margin-bottom: 12px; }

        /* ACCESS CARDS */
        .access-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 48px;
        }

        @media (max-width: 1024px) {
          .access-grid { grid-template-columns: repeat(2, 1fr); gap: 40px; }
        }

        @media (max-width: 768px) {
          .access-grid { grid-template-columns: 1fr; gap: 32px; }
        }

        .access-card {
          background: #FCFCFB;
          border: 1px solid #0B1730;
          padding: 48px;
          display: flex;
          flex-direction: column;
        }

        @media (max-width: 768px) {
          .access-card { padding: 36px; }
        }

        .access-card.featured {
          border: 2px solid #0B1730;
        }

        .card-title {
          font-size: 20px;
          font-weight: 600;
          color: #0B1730;
          margin-bottom: 8px;
        }

        .card-price {
          font-size: 16px;
          font-weight: 600;
          color: #0B1730;
          margin-bottom: 8px;
        }

        .card-desc {
          font-size: 14px;
          color: #0B1730;
          font-weight: 400;
          margin-bottom: 24px;
        }

        .card-includes {
          font-size: 11px;
          font-weight: 600;
          color: #0B1730;
          text-transform: uppercase;
          margin-bottom: 12px;
          letter-spacing: 0.5px;
        }

        .card-list {
          list-style: none;
          margin: 0 0 32px 0;
          padding: 0;
          font-size: 13px;
          color: #0B1730;
          line-height: 20px;
          flex: 1;
        }

        .card-list li {
          margin-bottom: 8px;
        }

        .card-list li:last-child { margin-bottom: 0; }

        .card-btn {
          background: #0B1730;
          color: #FCFCFB;
          border: none;
          padding: 14px 24px;
          font-size: 14px;
          font-weight: 600;
          cursor: pointer;
          width: 100%;
        }

        .card-btn:hover { background: #1a2a4a; }

        /* CONSISTENCY STATEMENT */
        .consistency {
          background: #0B1730;
          color: #FCFCFB;
          padding: 64px;
          border-radius: 0;
        }

        @media (max-width: 768px) {
          .consistency { padding: 48px; }
        }

        .consistency p {
          font-size: 18px;
          font-weight: 400;
          line-height: 32px;
          margin-bottom: 24px;
        }

        .consistency p:last-child { margin-bottom: 0; }

        .indicator {
          font-size: 16px;
          font-weight: 600;
          color: #1B6873;
          margin: 16px 0;
        }

        /* SYSTEM CLARIFICATION */
        .clarification {
          padding: 0;
          max-width: 760px;
          margin: 160px auto 0;
          text-align: left;
        }

        @media (max-width: 768px) {
          .clarification { margin-top: 80px; }
        }

        .clarification h3 {
          font-size: 14px;
          font-weight: 600;
          color: #0B1730;
          text-transform: uppercase;
          margin-bottom: 24px;
          letter-spacing: 0.5px;
        }

        .clarification p {
          font-size: 14px;
          color: #0B1730;
          line-height: 24px;
          font-weight: 400;
          margin-bottom: 12px;
        }

        .clarification p:last-child { margin-bottom: 0; }

        /* FINAL CTA */
        .final-cta {
          padding: 160px 48px;
          background: #0B1730;
          color: #FCFCFB;
          text-align: center;
        }

        @media (max-width: 1024px) {
          .final-cta { padding: 120px 48px; }
        }

        @media (max-width: 768px) {
          .final-cta { padding: 80px 24px; }
        }

        .final-cta h2 {
          font-size: 48px;
          font-weight: 600;
          line-height: 56px;
          margin-bottom: 32px;
        }

        @media (max-width: 768px) {
          .final-cta h2 { font-size: 36px; line-height: 44px; }
        }

        .final-subtitle {
          font-size: 20px;
          font-weight: 400;
          line-height: 32px;
          margin-bottom: 48px;
        }

        .final-trust {
          font-size: 14px;
          font-weight: 500;
          color: rgba(252, 252, 251, 0.8);
          margin-top: 24px;
        }

        /* FOOTER */
        .footer {
          background: #0B1730;
          color: #FCFCFB;
          padding: 160px 48px 64px;
        }

        @media (max-width: 1024px) {
          .footer { padding: 120px 48px 48px; }
        }

        @media (max-width: 768px) {
          .footer { padding: 80px 24px 48px; }
        }

        .footer-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 96px;
          max-width: 1600px;
          margin: 0 auto 96px;
        }

        @media (max-width: 1024px) {
          .footer-grid { grid-template-columns: repeat(2, 1fr); gap: 64px; margin-bottom: 80px; }
        }

        @media (max-width: 768px) {
          .footer-grid { grid-template-columns: repeat(2, 1fr); gap: 48px; margin-bottom: 64px; }
        }

        .footer-col h4 {
          font-size: 11px;
          font-weight: 600;
          text-transform: uppercase;
          margin-bottom: 24px;
          letter-spacing: 0.5px;
        }

        .footer-links {
          list-style: none;
          margin: 0;
          padding: 0;
        }

        .footer-links li {
          margin-bottom: 16px;
        }

        .footer-links a {
          font-size: 13px;
          font-weight: 400;
          color: #FCFCFB;
          text-decoration: none;
        }

        .footer-links a:hover { opacity: 0.7; }

        .footer-bottom {
          max-width: 1600px;
          margin: 0 auto;
          padding-top: 64px;
          border-top: 1px solid rgba(252, 252, 251, 0.1);
          text-align: center;
        }

        .footer-bottom p {
          font-size: 12px;
          color: rgba(252, 252, 251, 0.7);
          margin-bottom: 8px;
          line-height: 18px;
        }

        .footer-bottom p:last-child { margin-bottom: 0; }
      `}</style>

      {/* HEADER */}
      <header className="header">
        <div className="header-content">
          <Image src="/RunPayway_Logo.svg" alt="RunPayway™" width={160} height={32} className="logo" priority />
          <nav className="nav">
            <a href="#how-it-works">How It Works</a>
            <a href="#methodology">Methodology</a>
            <a href="#when-it-matters">When It Matters</a>
            <a href="#solutions">Solutions</a>
            <a href="#learn">Learn</a>
          </nav>
          <div className="header-right">
            <a href="#sign-in" className="sign-in">Sign In</a>
            <button className="btn" onClick={() => window.location.href = '/assessment'}>Start Assessment →</button>
          </div>
        </div>
      </header>

      {/* HERO */}
      <section className="hero">
        <div className="hero-grid">
          <div className="hero-left">
            <h1>Before relying on income, know your Income Stability.</h1>
            <p>RunPayway™ measures Income Stability. Income Stability measures the structure supporting income.</p>
            <div className="cta-group">
              <button className="btn" onClick={() => window.location.href = '/assessment'}>Start Assessment →</button>
              <a className="btn" style={{ background: 'transparent', color: '#0B1730', border: 'none', padding: 0, textDecoration: 'underline', borderRadius: 0 }} href="#how-it-works">See How It Works</a>
            </div>
            <p className="trust-line">Free structural insight · No documents required · Approximately 6 questions · Under 2 minutes</p>
          </div>

          <div className="report">
            <div className="report-header">Income Stability Profile™</div>
            <div className="report-grid">
              <div className="report-factor">
                <div className="report-factor-name">Income Concentration</div>
                <div className="report-factor-desc">Reliance on individual income sources.</div>
                <div className="report-factor-score">82</div>
              </div>
              <div className="report-factor">
                <div className="report-factor-name">Income Diversity</div>
                <div className="report-factor-desc">Variety of income sources.</div>
                <div className="report-factor-score">76</div>
              </div>
              <div className="report-factor">
                <div className="report-factor-name">Forward Visibility</div>
                <div className="report-factor-desc">Visibility into future income commitments.</div>
                <div className="report-factor-score">41</div>
              </div>
              <div className="report-factor">
                <div className="report-factor-name">Stability Pattern</div>
                <div className="report-factor-desc">Consistency of income over time.</div>
                <div className="report-factor-score">68</div>
              </div>
              <div className="report-factor">
                <div className="report-factor-name">Continuity Strength</div>
                <div className="report-factor-desc">Durability of income relationships.</div>
                <div className="report-factor-score">55</div>
              </div>
              <div className="report-factor">
                <div className="report-factor-name">Dependency Exposure</div>
                <div className="report-factor-desc">Exposure to key-person or key-source risk.</div>
                <div className="report-factor-score">71</div>
              </div>
            </div>

            <div className="report-section">
              <div className="section-title">Supporting Drivers™</div>
              <ul className="section-list teal">
                <li>✓ Income Concentration</li>
                <li>✓ Income Diversity</li>
              </ul>
              <div className="section-desc">Factors currently strengthening Income Stability.</div>
            </div>

            <div className="report-section">
              <div className="section-title">Stability Pressure Factors™</div>
              <ul className="section-list">
                <li>⚠ Forward Visibility</li>
                <li>⚠ Continuity Strength</li>
              </ul>
              <div className="section-desc">Factors currently creating the greatest stability pressure.</div>
            </div>

            <div className="report-section">
              <div className="section-title">Summary Result</div>
              <div className="summary-grid">
                <div>
                  <label>Income Stability Score™</label>
                  <div className="summary-score">72</div>
                </div>
                <div>
                  <label>Stability Class™</label>
                  <div style={{ fontSize: '14px', color: '#0B1730', fontWeight: '500' }}>Established Stability™</div>
                </div>
                <div>
                  <label>Model Version</label>
                  <div style={{ fontSize: '13px', color: '#0B1730', fontWeight: '400' }}>Structural Stability Model RP-2.0</div>
                </div>
                <div>
                  <label>Report ID</label>
                  <div style={{ fontSize: '13px', color: '#0B1730', fontWeight: '400' }}>RP2-2026-00012874</div>
                </div>
              </div>
            </div>

            <div style={{ paddingTop: '24px', borderTop: '1px solid #6A7485' }}>
              <div className="section-title">Verification Status</div>
              <div style={{ fontSize: '14px', color: '#1B6873', fontWeight: '500' }}>Verified</div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 1: INCOME VS STABILITY */}
      <section className="section section-white">
        <h2>Income and Income Stability are not the same thing.</h2>

        <div style={{ marginBottom: '64px' }}>
          <h3 style={{ fontSize: '20px', fontWeight: '600', color: '#0B1730', marginBottom: '48px' }}>Same Income. Different Stability.</h3>

          <div className="comparison-grid">
            <div className="profile-card">
              <div className="profile-label">Profile A</div>
              <div className="profile-income">$150,000 Income</div>
              <ul className="profile-list">
                <li>One primary client</li>
                <li>No recurring agreements</li>
                <li>Income varies month to month</li>
                <li>Income depends on continued activity</li>
              </ul>
              <div className="profile-class">Developing Stability™</div>
            </div>

            <div className="profile-card">
              <div className="profile-label">Profile B</div>
              <div className="profile-income">$150,000 Income</div>
              <ul className="profile-list">
                <li>Multiple income sources</li>
                <li>Recurring monthly income</li>
                <li>Lower reliance on any single source</li>
                <li>More consistent income over time</li>
              </ul>
              <div className="profile-class">Established Stability™</div>
            </div>
          </div>
        </div>

        <div className="insight-box">
          <h3>Key Insight</h3>
          <p>Two people can earn the same income and have very different levels of Income Stability.</p>
          <p>Income amount alone does not tell the whole story.</p>
          <div className="insight-cta">See My Income Stability →</div>
        </div>
      </section>

      {/* SECTION 2: COMMON SITUATIONS */}
      <section className="section section-white">
        <h2>Common Situations Where People Rely On Income</h2>
        <p className="intro-text">Two people can earn the same income and face very different levels of stability. Income Stability helps reveal structural differences that income amount alone may not show.</p>

        <div className="three-col">
          <div className="col-item">
            <h3>Buying a Home</h3>
            <p>A mortgage may last decades. Understanding the stability of the income supporting that commitment may provide additional context before you buy.</p>
          </div>
          <div className="col-item">
            <h3>Leaving a Job</h3>
            <p>A career change often means replacing one income structure with another. Understanding Income Stability may provide additional context before making that transition.</p>
          </div>
          <div className="col-item">
            <h3>Starting a Business</h3>
            <p>Many entrepreneurs transition away from existing income sources. Understanding Income Stability may provide additional context before making that change.</p>
          </div>
        </div>
      </section>

      {/* SECTION 3: SAMPLE PROFILE */}
      <section className="section section-white">
        <h2>Sample Income Stability Profile™</h2>

        <div className="sample-profile">
          <div style={{ marginBottom: '48px' }}>
            <div className="sample-score">72</div>
            <div className="sample-class">Established Stability™</div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '48px', marginBottom: '48px', paddingBottom: '48px', borderBottom: '1px solid #6A7485' }}>
            <div>
              <div className="factor-box">
                <div className="factor-info">
                  <h4>Income Concentration</h4>
                  <p>Reliance on individual income sources.</p>
                </div>
                <div className="factor-score-large">82</div>
              </div>
              <div className="factor-box">
                <div className="factor-info">
                  <h4>Income Diversity</h4>
                  <p>Variety of income sources.</p>
                </div>
                <div className="factor-score-large">76</div>
              </div>
              <div className="factor-box">
                <div className="factor-info">
                  <h4>Forward Visibility</h4>
                  <p>Visibility into future income commitments.</p>
                </div>
                <div className="factor-score-large">41</div>
              </div>
            </div>
            <div>
              <div className="factor-box">
                <div className="factor-info">
                  <h4>Stability Pattern</h4>
                  <p>Consistency of income over time.</p>
                </div>
                <div className="factor-score-large">68</div>
              </div>
              <div className="factor-box">
                <div className="factor-info">
                  <h4>Continuity Strength</h4>
                  <p>Durability of income relationships.</p>
                </div>
                <div className="factor-score-large">55</div>
              </div>
              <div className="factor-box">
                <div className="factor-info">
                  <h4>Dependency Exposure</h4>
                  <p>Exposure to key-person or key-source risk.</p>
                </div>
                <div className="factor-score-large">71</div>
              </div>
            </div>
          </div>

          <div style={{ marginBottom: '32px' }}>
            <h4 style={{ fontSize: '14px', fontWeight: '600', color: '#0B1730', marginBottom: '12px', textTransform: 'uppercase' }}>Why This Score?</h4>
            <p style={{ fontSize: '14px', color: '#0B1730', lineHeight: '24px', marginBottom: '12px' }}>Your Income Stability Score™ is generated from the factors that make up your Income Stability Profile™.</p>
            <p style={{ fontSize: '14px', color: '#0B1730', lineHeight: '24px', marginBottom: '12px' }}>Strong diversification and concentration characteristics contribute positively to the result.</p>
            <p style={{ fontSize: '14px', color: '#0B1730', lineHeight: '24px' }}>Forward Visibility remains the largest source of stability pressure. The score represents the combined profile, not a standalone measurement.</p>
          </div>

          <div style={{ marginBottom: '32px', paddingBottom: '32px', borderBottom: '1px solid #6A7485' }}>
            <h4 style={{ fontSize: '14px', fontWeight: '600', color: '#0B1730', marginBottom: '12px', textTransform: 'uppercase' }}>What This Means</h4>
            <p style={{ fontSize: '14px', color: '#0B1730', lineHeight: '24px', marginBottom: '12px' }}>Your income demonstrates Established Stability™ with effective diversification across multiple income sources.</p>
            <p style={{ fontSize: '14px', color: '#0B1730', lineHeight: '24px', marginBottom: '12px' }}>Your strongest characteristics are concentration management and income diversity. Your primary pressure point is Forward Visibility.</p>
            <p style={{ fontSize: '14px', color: '#0B1730', lineHeight: '24px' }}>While current income appears stable, limited visibility into future income commitments reduces overall structural strength. Improving visibility and continuity may strengthen long-term Income Stability.</p>
          </div>

          <div>
            <h4 style={{ fontSize: '14px', fontWeight: '600', color: '#0B1730', marginBottom: '12px', textTransform: 'uppercase' }}>Improvement Opportunities™</h4>
            <p style={{ fontSize: '13px', fontWeight: '600', color: '#0B1730', marginBottom: '4px' }}>Primary Focus Area:</p>
            <p style={{ fontSize: '13px', color: '#0B1730', marginBottom: '12px' }}>Forward Visibility</p>
            <p style={{ fontSize: '13px', fontWeight: '600', color: '#0B1730', marginBottom: '4px' }}>Structural Observation:</p>
            <p style={{ fontSize: '13px', color: '#0B1730', marginBottom: '12px' }}>A meaningful portion of income lacks confirmed visibility beyond the current period.</p>
            <p style={{ fontSize: '13px', fontWeight: '600', color: '#0B1730', marginBottom: '4px' }}>Potential Improvement Pathway:</p>
            <p style={{ fontSize: '13px', color: '#0B1730' }}>Increasing recurring agreements, longer-term contracts, or future income commitments may strengthen Forward Visibility and overall Income Stability.</p>
          </div>
        </div>

        <div style={{ marginTop: '64px', background: '#0B1730', color: '#FCFCFB', padding: '48px' }}>
          <h4 style={{ fontSize: '14px', fontWeight: '600', color: '#FCFCFB', marginBottom: '16px', textTransform: 'uppercase' }}>Full Analysis Delivers</h4>
          <p style={{ fontSize: '16px', fontWeight: '700', color: '#FCFCFB', marginBottom: '8px', lineHeight: '24px' }}>Not just a score.</p>
          <p style={{ fontSize: '16px', fontWeight: '400', color: '#FCFCFB', lineHeight: '24px' }}>A complete explanation of the profile, what it means, and where opportunities for improvement may exist.</p>
        </div>
      </section>

      {/* SECTION 4: UNDERSTANDING */}
      <section className="section section-white">
        <h2>Understanding Your Income Stability Profile™</h2>

        <div className="three-col">
          <div className="col-item">
            <h3>Income Stability Profile™</h3>
            <p>The structural factors that influence Income Stability.</p>
          </div>
          <div className="col-item">
            <h3>Income Stability Score™</h3>
            <p>A standardized measurement of Income Stability.</p>
          </div>
          <div className="col-item">
            <h3>Stability Class™</h3>
            <p>A classification that helps place the result into context.</p>
          </div>
        </div>

        <div style={{ marginTop: '64px', background: '#FCFCFB', border: '1px solid #0B1730', padding: '48px', borderRadius: 0 }}>
          <h4 style={{ fontSize: '14px', fontWeight: '600', color: '#0B1730', marginBottom: '24px', textTransform: 'uppercase' }}>Why This Matters</h4>
          <p style={{ fontSize: '16px', fontWeight: '400', color: '#0B1730', lineHeight: '28px', marginBottom: '12px' }}>The profile explains the score.</p>
          <p style={{ fontSize: '16px', fontWeight: '400', color: '#0B1730', lineHeight: '28px', marginBottom: '12px' }}>The score summarizes the profile.</p>
          <p style={{ fontSize: '16px', fontWeight: '400', color: '#0B1730', lineHeight: '28px', marginBottom: '24px' }}>Together they provide a clearer understanding of Income Stability.</p>
          <button className="btn" onClick={() => window.location.href = '/assessment'}>Reveal My Result →</button>
        </div>
      </section>

      {/* SECTION 5: WHAT RUNPAYWAY EVALUATES */}
      <section className="section section-white">
        <h2>What RunPayway™ Evaluates</h2>
        <p className="intro-text">RunPayway™ evaluates structural factors that contribute to Income Stability.</p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '48px', marginBottom: '64px' }}>
          <div><h4 style={{ fontSize: '16px', fontWeight: '600', color: '#0B1730' }}>Income Concentration</h4></div>
          <div><h4 style={{ fontSize: '16px', fontWeight: '600', color: '#0B1730' }}>Income Diversity</h4></div>
          <div><h4 style={{ fontSize: '16px', fontWeight: '600', color: '#0B1730' }}>Forward Visibility</h4></div>
          <div><h4 style={{ fontSize: '16px', fontWeight: '600', color: '#0B1730' }}>Stability Pattern</h4></div>
          <div><h4 style={{ fontSize: '16px', fontWeight: '600', color: '#0B1730' }}>Continuity Strength</h4></div>
          <div><h4 style={{ fontSize: '16px', fontWeight: '600', color: '#0B1730' }}>Dependency Exposure</h4></div>
        </div>

        <div className="consistency">
          <h4 style={{ fontSize: '14px', fontWeight: '600', color: '#FCFCFB', marginBottom: '24px', textTransform: 'uppercase' }}>Why This Matters</h4>
          <p>Income measures amount.</p>
          <p>RunPayway™ measures stability.</p>
          <p>Income amount alone may not reveal these structural characteristics. RunPayway™ evaluates them using a consistent methodology.</p>
          <div style={{ fontSize: '14px', fontWeight: '600', color: '#1B6873', cursor: 'pointer', marginTop: '32px' }}>Learn More About The Methodology →</div>
        </div>
      </section>

      {/* SECTION 6: ACCESS LEVELS */}
      <section className="section section-white">
        <h2>Understanding Income Stability™</h2>

        <div className="access-grid">
          <div className="access-card">
            <div className="card-title">Income Stability Assessment™</div>
            <div className="card-price">FREE</div>
            <div className="card-desc">Discover your result.</div>
            <div className="card-includes">Includes:</div>
            <ul className="card-list">
              <li>Assessment Completion</li>
              <li>Income Structure Evaluation</li>
              <li>Eligibility to Unlock Your Result™</li>
            </ul>
            <button className="card-btn" onClick={() => window.location.href = '/assessment'}>Start Assessment →</button>
          </div>

          <div className="access-card featured">
            <div className="card-title">Income Stability Result™</div>
            <div className="card-price">$9</div>
            <div className="card-desc">See where you stand.</div>
            <div className="card-includes">Includes:</div>
            <ul className="card-list">
              <li>Income Stability Profile™</li>
              <li>Stability Class™</li>
              <li>Income Stability Score™</li>
              <li>Supporting Drivers™</li>
              <li>Stability Pressure Factors™</li>
            </ul>
            <button className="card-btn" onClick={() => window.location.href = '/unlock'}>Reveal My Result →</button>
          </div>

          <div className="access-card">
            <div className="card-title">Income Stability Analysis™</div>
            <div className="card-price">$69</div>
            <div className="card-desc">Understand why.</div>
            <div className="card-includes">Includes everything in the Result™ plus:</div>
            <ul className="card-list">
              <li>Why This Score?</li>
              <li>What This Means</li>
              <li>Improvement Opportunities™</li>
              <li>What's Supporting Stability</li>
              <li>What May Be Affecting Stability</li>
              <li>Areas Worth Reviewing</li>
              <li>Industry Context™</li>
              <li>Analysis Observations™</li>
            </ul>
            <button className="card-btn" onClick={() => window.location.href = '/analysis'}>Understand My Income Stability →</button>
          </div>
        </div>
      </section>

      {/* SECTION 7: CONSISTENCY */}
      <section className="section section-navy">
        <h2 style={{ color: '#FCFCFB' }}>Why Results Remain Consistent</h2>

        <div className="consistency" style={{ marginTop: '64px' }}>
          <p>Results are generated using Structural Stability Model RP-2.0.</p>
          <div className="indicator">✓ Same Inputs</div>
          <div className="indicator">✓ Same Methodology</div>
          <div className="indicator">✓ Same Outputs</div>
          <div className="indicator">✓ Verifiable Reports</div>
          <p style={{ marginTop: '32px' }}>No human overrides. No subjective scoring. No changing standards.</p>
          <p style={{ marginTop: '16px' }}>Income measures amount. RunPayway™ measures stability.</p>
          <div style={{ fontSize: '14px', fontWeight: '600', color: '#1B6873', cursor: 'pointer', marginTop: '32px' }}>Learn More About The Methodology →</div>
        </div>
      </section>

      {/* SYSTEM CLARIFICATION */}
      <div style={{ background: '#FCFCFB', paddingBottom: '160px' }}>
        <div className="section clarification">
          <h3>SYSTEM CLARIFICATION™</h3>
          <p>RunPayway™ measures Income Stability using a standardized methodology. Income measures amount. RunPayway™ measures stability.</p>
          <p>RunPayway™ is not a credit score, lending decision, investment recommendation, financial plan, employment evaluation, or prediction of future income.</p>
          <p>Results are generated using Structural Stability Model RP-2.0 and are intended to provide a consistent measurement of Income Stability based on information supplied during the assessment.</p>
          <p style={{ marginTop: '24px' }}><strong>Model Version:</strong> RP-2.0</p>
          <p><strong>Report Verification:</strong> Available on all issued reports</p>
        </div>
      </div>

      {/* FINAL CTA */}
      <section className="final-cta">
        <h2>Before relying on income, know your Income Stability.</h2>
        <p className="final-subtitle">Start your Income Stability Assessment™ in under 2 minutes.</p>
        <button className="btn" onClick={() => window.location.href = '/assessment'}>Start Assessment →</button>
        <p className="final-trust">Free structural insight · No documents required</p>
      </section>

      {/* FOOTER */}
      <footer className="footer">
        <div className="footer-grid">
          <div className="footer-col">
            <h4>PRODUCT</h4>
            <ul className="footer-links">
              <li><a href="#how-it-works">How It Works</a></li>
              <li><a href="#methodology">Methodology</a></li>
              <li><a href="#profile">Income Stability Profile™</a></li>
              <li><a href="#score">Income Stability Score™</a></li>
              <li><a href="#analysis">Income Stability Analysis™</a></li>
              <li><a href="#verify">Verify A Report</a></li>
            </ul>
          </div>
          <div className="footer-col">
            <h4>SOLUTIONS</h4>
            <ul className="footer-links">
              <li><a href="#individuals">Individuals</a></li>
              <li><a href="#advisors">Advisors</a></li>
              <li><a href="#organizations">Organizations</a></li>
            </ul>
          </div>
          <div className="footer-col">
            <h4>LEARN</h4>
            <ul className="footer-links">
              <li><a href="#what-is">What Is Income Stability?</a></li>
              <li><a href="#vs-income">Income Stability vs Income</a></li>
              <li><a href="#why-matters">Why Income Stability Matters</a></li>
              <li><a href="#learn">Learn</a></li>
            </ul>
          </div>
          <div className="footer-col">
            <h4>COMPANY</h4>
            <ul className="footer-links">
              <li><a href="#about">About RunPayway™</a></li>
              <li><a href="#contact">Contact</a></li>
              <li><a href="#privacy">Privacy Policy</a></li>
              <li><a href="#terms">Terms of Use</a></li>
              <li><a href="#accessibility">Accessibility</a></li>
            </ul>
          </div>
        </div>
        <div className="footer-bottom">
          <p>© 2026 RunPayway™. All rights reserved.</p>
          <p>RunPayway™ is a product of PeopleStar Enterprises, INC. Orange County, California, USA.</p>
          <p>Structural Stability Model RP-2.0. Accessibility: WCAG 2.1 AA Compliant</p>
        </div>
      </footer>
    </div>
  );
}
